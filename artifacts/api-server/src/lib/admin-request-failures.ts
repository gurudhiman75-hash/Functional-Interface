import { randomUUID } from "node:crypto";

export type AdminRequestFailure = {
  id: string;
  correlationId: string;
  occurredAt: string;
  method: string;
  path: string;
  statusCode: number;
  code: string | null;
  message: string;
  durationMs: number;
  actorUserId: string | null;
};

const MAX_FAILURES = 500;
const failures: AdminRequestFailure[] = [];

export function recordAdminRequestFailure(input: Omit<AdminRequestFailure, "id" | "occurredAt">): AdminRequestFailure {
  const entry: AdminRequestFailure = {
    id: randomUUID(),
    occurredAt: new Date().toISOString(),
    ...input,
  };
  failures.unshift(entry);
  if (failures.length > MAX_FAILURES) failures.length = MAX_FAILURES;
  return entry;
}

export function listAdminRequestFailures(limit = 100): AdminRequestFailure[] {
  return failures.slice(0, Math.max(1, Math.min(500, limit)));
}
