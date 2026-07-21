import assert from "node:assert/strict";
import test from "node:test";

import {
  SystemHealthError,
  assessOperationalJob,
  assertOperationalJobActionAllowed,
  deriveSystemHealth,
  normalizeOperationalJobAction,
  redactOperationalTelemetry,
} from "./admin-system-health";

const now = Date.parse("2026-07-21T08:00:00.000Z");

test("running jobs become critical when their heartbeat is stale", () => {
  assert.deepEqual(assessOperationalJob({
    status: "running",
    startedAt: "2026-07-21T07:30:00.000Z",
    heartbeatAt: "2026-07-21T07:50:00.000Z",
  }, now), {
    level: "critical",
    stale: true,
    issue: "Running job heartbeat is stale.",
  });
});

test("recent queued and running jobs remain healthy", () => {
  assert.equal(assessOperationalJob({ status: "queued", scheduledAt: "2026-07-21T07:55:00.000Z" }, now).level, "healthy");
  assert.equal(assessOperationalJob({ status: "running", heartbeatAt: "2026-07-21T07:58:00.000Z" }, now).level, "healthy");
});

test("system health prioritises database and stale-worker failures", () => {
  assert.equal(deriveSystemHealth({
    databaseOk: false,
    databaseLatencyMs: null,
    staleJobCount: 0,
    failedJobCount24h: 0,
    failedGenerationCount24h: 0,
    failedValidationCount24h: 0,
    pendingOutboxCount: 0,
    oldestPendingOutboxAgeMinutes: null,
    errorCount24h: 0,
  }).level, "critical");

  const stale = deriveSystemHealth({
    databaseOk: true,
    databaseLatencyMs: 20,
    staleJobCount: 1,
    failedJobCount24h: 0,
    failedGenerationCount24h: 0,
    failedValidationCount24h: 0,
    pendingOutboxCount: 0,
    oldestPendingOutboxAgeMinutes: null,
    errorCount24h: 0,
  });
  assert.equal(stale.level, "critical");
  assert.equal(stale.reasons.some((reason) => reason.includes("stale")), true);
});

test("delayed outbox and recent failures produce degraded health", () => {
  const summary = deriveSystemHealth({
    databaseOk: true,
    databaseLatencyMs: 40,
    staleJobCount: 0,
    failedJobCount24h: 1,
    failedGenerationCount24h: 0,
    failedValidationCount24h: 0,
    pendingOutboxCount: 3,
    oldestPendingOutboxAgeMinutes: 12,
    errorCount24h: 1,
  });
  assert.equal(summary.level, "degraded");
  assert.equal(summary.reasons.length >= 2, true);
});

test("operational telemetry redacts secrets recursively", () => {
  assert.deepEqual(redactOperationalTelemetry({
    payload: {
      apiKey: "secret-value",
      nested: { authorization: "Bearer token", safe: "visible" },
    },
  }), {
    payload: {
      apiKey: "[REDACTED]",
      nested: { authorization: "[REDACTED]", safe: "visible" },
    },
  });
});

test("job actions require reasons and enforce safe transitions", () => {
  assert.deepEqual(normalizeOperationalJobAction({ action: "retry", reason: "Retry after provider recovery" }), {
    action: "retry",
    reason: "Retry after provider recovery",
  });
  assert.throws(
    () => normalizeOperationalJobAction({ action: "retry", reason: "x" }),
    (error) => error instanceof SystemHealthError && error.code === "JOB_ACTION_REASON_REQUIRED",
  );
  assert.doesNotThrow(() => assertOperationalJobActionAllowed("retry", "failed"));
  assert.doesNotThrow(() => assertOperationalJobActionAllowed("cancel", "queued"));
  assert.throws(
    () => assertOperationalJobActionAllowed("cancel", "running"),
    (error) => error instanceof SystemHealthError && error.code === "JOB_CANCEL_NOT_ALLOWED",
  );
});
