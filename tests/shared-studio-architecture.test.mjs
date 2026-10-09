import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync("artifacts/api-server/src/app.ts", "utf8");
const route = readFileSync("artifacts/api-server/src/routes/admin-question-studio-num001-remote.ts", "utf8");
const service = readFileSync("artifacts/api-server/shared-question-studio-worker-service.mjs", "utf8");

test("NUM-001 opt-in route is ahead of legacy API without touching TRG-002", () => {
  const num = app.indexOf("const num001RemoteRouter");
  const trg = app.indexOf("const trg002OffThreadRouter");
  const legacy = app.indexOf("function loadLegacyRouter()");
  assert.ok(num >= 0 && num < trg && trg < legacy);
  assert.ok(app.includes('req.body?.packageId !== "NUM-001"'));
  assert.ok(app.includes('!process.env.QUESTION_STUDIO_SHARED_WORKER_URL?.trim()'));
});

test("remote NUM-001 preserves review-only lifecycle and atomic DB writes", () => {
  assert.match(route, /"REVIEW_ONLY"/);
  assert.match(route, /questionBankWritable: false/);
  assert.match(route, /testEligible: false/);
  assert.match(route, /productionReleaseAuthorized: false/);
  assert.match(route, /sqlClient.begin/);
  assert.match(route, /content.generation_runs/);
  assert.match(route, /content.generation_item_versions/);
  assert.match(route, /platform.outbox_events/);
  assert.match(route, /requireAdminPermission\("content.generation.run"\)/);
});

test("shared service has an explicit chapter allowlist and no DB imports", () => {
  assert.match(service, /"TRG-002"/);
  assert.match(service, /"NUM-001"/);
  assert.doesNotMatch(service, /\b(?:postgres|firebase-admin|sqlClient)\b/);
  assert.match(service, /timingSafeEqual/);
  assert.match(service, /maxResponseBytes/);
});
