import { API_BASE_URL } from "./config";

const TOKEN_KEY = "cs-token";
const USER_KEY = "cs-user";

export const tokenStorage = {
  get: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};

export const userStorage = {
  get: <T>(): T | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set: <T>(user: T) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
};

export class HttpError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: Record<string, string>;
  skipAuthRedirect?: boolean;
}

interface ApiErrorBody {
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, string[]>;
  };
}

export async function http<T>(
  path: string,
  {
    body,
    headers,
    credentials = "include",
    skipAuthRedirect = false,
    ...init
  }: RequestOptions = {},
): Promise<T> {
  const token = tokenStorage.get();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && !skipAuthRedirect) {
    tokenStorage.clear();
    unauthorizedHandler?.();
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => undefined)) as
      | ApiErrorBody
      | undefined;
    throw new HttpError(
      response.status,
      errorBody?.error?.message ?? errorBody?.message ?? response.statusText,
      errorBody?.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
