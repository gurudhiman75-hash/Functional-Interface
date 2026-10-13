import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(p,"utf8");
const route=read("artifacts/api-server/src/routes/admin-question-studio-run-status.ts");
const registry=read("artifacts/api-server/src/routes/admin-question-studio-registry.ts");
const api=read("artifacts/admin-app/src/features/question-studio/api.ts");
const engine=read("artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts");

test("generation progress requires admin read permission and validates canonical run ID",()=>{
  assert.match(route,/router\.get\(\s*"\/runs\/:runId\/status"/);
  assert.match(route,/authenticate,\s*requireAdminPermission\("content\.generation\.read"\)/);
  assert.match(route,/UUID\.test\(runId\)/);
  assert.match(route,/INVALID_GENERATION_RUN_ID/);
  assert.match(route,/GENERATION_RUN_NOT_FOUND/);
  assert.match(route,/Cache-Control", "no-store"/);
});

test("polling route is fast-path before historical chapter handlers",()=>{
  assert.match(registry,/adminQuestionStudioRunStatusRouter = lazyRouter/);
  assert.match(registry,/router\.get\("\/runs\/:runId\/status"/);
  assert.ok(registry.indexOf('router.get("/runs/:runId/status"') <
    registry.indexOf("router.use(adminQuestionStudioBulkHardeningRouter)"));
  assert.ok(registry.indexOf('router.get("/runs/:runId/status"') <
    registry.indexOf('router.post("/runs"'));
});

test("progress status uses canonical Neon records, no new table, writes, or accidental data exposure",()=>{
  assert.match(route,/FROM content\.generation_runs g/);
  assert.match(route,/FROM content\.generation_run_items i/);
  assert.match(route,/g\.id = \$\{runId\}::uuid/);
  assert.match(route,/generatedCount: count\(row\.generated_count\)/);
  assert.match(route,/requestedCount/);
  assert.match(route,/attemptNumber/);
  assert.match(route,/retryAfterSeconds/);
  assert.match(route,/ACTIVE = new Set\(\["queued", "running", "validation"\]\)/);
  assert.doesNotMatch(route,/\b(?:INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s+(?:INTO|TABLE|FROM|content\.|platform\.)/i);
  assert.doesNotMatch(route,/runUniversalStudioRemote|generateProfiledQuantBatch|publish|Cashfree/i);
  assert.doesNotMatch(route,/requestSnapshot:\s*row\.request_snapshot/);
  assert.doesNotMatch(route,/failureReason:\s*row\.failure_reason/);
});

test("existing synchronous Generate contract stays unchanged until explicit queue activation",()=>{
  assert.match(engine,/router\.post\(\s*"\/runs"/);
  assert.match(engine,/await sqlClient\.begin\(/);
  assert.match(engine,/res\.status\(201\)\.json/);
  assert.match(api,/export function createGenerationRun/);
  assert.match(api,/export interface QuestionStudioRunProgress/);
  assert.match(api,/export function getQuestionStudioRunProgress/);
  assert.match(api,/encodeURIComponent\(runId\)/);
  assert.match(api,/retryAfterSeconds: number \| null/);
});
