import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=p=>readFileSync(p,"utf8");
const ddl=read("artifacts/api-server/migrations/20261013_question_studio_async_enqueue_idempotency.sql");
const service=read("artifacts/api-server/src/question-studio/async-enqueue-foundation.ts");
const canonical=read("artifacts/api-server/src/question-studio/async-enqueue-contract.ts");
const admin=read("artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts");
const status=read("artifacts/api-server/src/routes/admin-question-studio-run-status.ts");

test("migration adds unique per-actor idempotency without mutating existing review schema",()=>{
  assert.match(ddl,/CREATE TABLE IF NOT EXISTS content\.generation_enqueue_idempotency/);
  assert.match(ddl,/PRIMARY KEY \(actor_firebase_uid, idempotency_key\)/);
  assert.match(ddl,/UNIQUE \(generation_run_id\)/);
  assert.match(ddl,/REFERENCES content\.generation_runs\(id\) ON DELETE RESTRICT/);
  assert.match(ddl,/request_sha256 ~ '\^\[0-9a-f\]\{64\}\$'/);
  assert.match(ddl,/BEGIN;/);
  assert.match(ddl,/COMMIT;/);
  assert.doesNotMatch(ddl,/^\\s*(?:ALTER TABLE content\\.generation_runs|DROP\\s|UPDATE\\s|DELETE\\s+FROM|TRUNCATE\\s)/im);
});

test("queue intent is disabled by default and cannot schedule tasks directly",()=>{
  assert.match(service,/EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true"/);
  assert.match(service,/EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true"/);
  assert.match(service,/validateUniversalStudioComputeInput\(input\.compute\)/);
  assert.match(service,/sqlClient\.begin\(async \(tx\)/);
  assert.match(service,/content\.generation_runs/);
  assert.match(service,/content\.generation_enqueue_idempotency/);
  assert.match(service,/ON CONFLICT \(actor_firebase_uid, idempotency_key\) DO NOTHING/);
  assert.match(service,/ExistingIdempotencyReservation/);
  assert.match(service,/platform\.audit_events/);
  assert.match(service,/platform\.outbox_events/);
  assert.match(service,/question_studio\.generation_run\.queued\.v1/);
  assert.match(service,/GENERATION_IDEMPOTENCY_CONFLICT/);
  assert.match(service,/request_sha256 !== requestSha/);
  assert.doesNotMatch(service,/fetch\(|cloudtasks|createTask\(|publish\(/i);
  assert.doesNotMatch(admin,/recordQuestionStudioEnqueueIntent/);
  assert.doesNotMatch(status,/recordQuestionStudioEnqueueIntent/);
});

test("no tokens in enqueue snapshot or task intent payload; canonical hash filters extras",()=>{
  assert.match(canonical,/Only the known Question Studio request fields are persisted/);
  assert.match(canonical,/Object\.entries\(value\)\.filter/);
  assert.match(canonical,/digestCanonicalEnqueueRequest/);
  assert.match(service,/JSON\.stringify\(channel === "chapter_review"/);
  assert.match(service,/: \{runId, queueVersion:1\}/);
  assert.match(service,/channel:"chapter_review"/);
  assert.doesNotMatch(service,/Firebase ID token|authorizationHeaders|password/);
});
