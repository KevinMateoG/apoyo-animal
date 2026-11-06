import { createConnection, type Socket } from "node:net";
import { applicationName } from "./config.ts";

type LogContext = Record<string, string | number | boolean | undefined>;

const maxQueuedEvents = 1_000;
const queuedEvents: string[] = [];
let socket: Socket | undefined;
let connected = false;
let reconnectTimer: NodeJS.Timeout | undefined;
let reconnectDelayMs = 1_000;

function getLogstashPort(): number {
  const configuredPort = Number(process.env["LOGSTASH_PORT"] || 5001);
  return Number.isInteger(configuredPort) &&
    configuredPort > 0 &&
    configuredPort <= 65_535
    ? configuredPort
    : 5001;
}

function scheduleReconnect(): void {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    connectToLogstash();
  }, reconnectDelayMs);
  reconnectTimer.unref();
  reconnectDelayMs = Math.min(reconnectDelayMs * 2, 30_000);
}

function flushQueue(client: Socket): void {
  if (!connected || socket !== client) return;

  while (queuedEvents.length > 0) {
    const event = queuedEvents.shift();
    if (event === undefined) return;

    if (!client.write(event)) {
      client.once("drain", () => flushQueue(client));
      return;
    }
  }
}

function connectToLogstash(): void {
  if (socket && !socket.destroyed) return;

  const client = createConnection({
    host: process.env["LOGSTASH_HOST"]?.trim() || "127.0.0.1",
    port: getLogstashPort(),
  });
  socket = client;
  client.setNoDelay(true);

  client.on("connect", () => {
    connected = true;
    reconnectDelayMs = 1_000;
    flushQueue(client);
  });

  client.on("error", () => {
    connected = false;
  });

  client.on("close", () => {
    if (socket === client) socket = undefined;
    connected = false;
    scheduleReconnect();
  });
}

function writeLog(
  level: "INFO" | "WARN" | "ERROR",
  message: string,
  context: LogContext,
): void {
  const event = `${JSON.stringify({
    ...context,
    "@timestamp": new Date().toISOString(),
    level,
    message,
    application: applicationName,
  })}\n`;

  if (queuedEvents.length >= maxQueuedEvents) {
    queuedEvents.shift();
  }
  queuedEvents.push(event);

  if (!socket) connectToLogstash();
  if (socket) flushQueue(socket);
}

export const logger = {
  info(message: string, context: LogContext = {}): void {
    writeLog("INFO", message, context);
  },
  warn(message: string, context: LogContext = {}): void {
    writeLog("WARN", message, context);
  },
  error(message: string, context: LogContext = {}): void {
    writeLog("ERROR", message, context);
  },
};
