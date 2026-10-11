import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

test("outbox row lock remains inside publish transaction", () => {
  const source = read("artifacts/api-server/src/lib/outbox-publisher.ts");
  const start = source.indexOf("async function publishOneLocked()");
  const stop = source.indexOf("export async function runOutboxPublisherOnce", start);
  assert.ok(start >= 0 && stop > start);
  const body = source.slice(start, stop);
  assert.match(body, /sqlClient\.begin\(async \(tx\) =>/);
  assert.match(body, /FOR UPDATE SKIP LOCKED/);
  assert.match(body, /await dispatch\(event\)/);
  assert.match(body, /SET published_at = now\(\)/);
  assert.ok(body.indexOf("FOR UPDATE SKIP LOCKED") < body.indexOf("await dispatch(event)"));
  assert.ok(body.indexOf("await dispatch(event)") < body.indexOf("SET published_at = now()"));
  assert.doesNotMatch(source, /async function claimBatch\(/);
});

test("Render mobile-notification worker supports explicit shutdown", () => {
  const mobile = read("artifacts/api-server/src/lib/mobile-notification-delivery.ts");
  assert.match(mobile, /MOBILE_NOTIFICATION_WORKER_ENABLED === "false"/);
  const start = mobile.indexOf("export function startMobileNotificationWorker()");
  const flag = mobile.indexOf("MOBILE_NOTIFICATION_WORKER_ENABLED", start);
  const timer = mobile.indexOf("setInterval", start);
  assert.ok(start >= 0 && start < flag && flag < timer);
});

test("Cloud Run staging and live handover must keep worker gates", () => {
  const api = read("artifacts/api-server/src/index.ts");
  const background = read("artifacts/api-server/src/cloud-run-background.ts");
  const scheduler = read("scripts/enable-examtree-api-background-scheduler.sh");
  assert.match(api, /EXAMTREE_API_RUNTIME === "cloud-run"/);
  assert.match(background, /EXAMTREE_API_STAGING === "true"/);
  assert.match(scheduler, /EXAMTREE_RENDER_STOPPED/);
  assert.match(scheduler, /EXAMTREE_BACKGROUND_JOB_VERIFIED/);
  assert.match(scheduler, /examtree-api-background-every-5m/);
});
