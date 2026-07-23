import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { recordAdminRequestFailure } from "../lib/admin-request-failures";

function safeBody(value: unknown): { code: string | null; message: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { code: null, message: "Admin request failed" };
  }
  const body = value as Record<string, unknown>;
  return {
    code: typeof body.code === "string" ? body.code : null,
    message: typeof body.error === "string"
      ? body.error
      : typeof body.message === "string"
        ? body.message
        : "Admin request failed",
  };
}

export function adminRequestObservability(req: Request, res: Response, next: NextFunction): void {
  if (!req.path.startsWith("/admin/")) {
    next();
    return;
  }

  const startedAt = performance.now();
  const correlationId = typeof req.headers["x-correlation-id"] === "string"
    ? req.headers["x-correlation-id"].slice(0, 120)
    : randomUUID();
  res.setHeader("X-Correlation-Id", correlationId);

  let responseBody: unknown;
  const originalJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    responseBody = body;
    return originalJson(body);
  }) as Response["json"];

  res.on("finish", () => {
    if (res.statusCode < 400) return;
    const parsed = safeBody(responseBody);
    recordAdminRequestFailure({
      correlationId,
      method: req.method,
      path: req.originalUrl.split("?")[0] ?? req.path,
      statusCode: res.statusCode,
      code: parsed.code,
      message: parsed.message,
      durationMs: Math.max(0, Math.round((performance.now() - startedAt) * 10) / 10),
      actorUserId: req.adminSession?.user.id ?? null,
    });
  });

  next();
}
