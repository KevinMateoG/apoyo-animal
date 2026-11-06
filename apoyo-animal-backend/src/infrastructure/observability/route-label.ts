import type { Request } from "express";

type RequestWithRoute = Request & {
  route?: { path?: string | string[] };
};

export function getRouteLabel(req: Request): string {
  const routePath = (req as RequestWithRoute).route?.path;
  const path = Array.isArray(routePath) ? routePath[0] : routePath;

  if (typeof path !== "string") {
    return "unmatched";
  }

  return `${req.baseUrl}${path}` || "/";
}
