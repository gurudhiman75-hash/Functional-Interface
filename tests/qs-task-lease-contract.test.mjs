import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(p)=>readFileSync(p,"utf8");
const lease=read("artifacts/api-server/src/question-studio/async-task-lease-claim.ts");
const ddl=read("artifacts/api-server/migrations/20261013_question_studio_task_leases.sql");
const api=read("artifacts/api-server/src/app.ts");
const dispatch=read("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatcher.ts");

test("proposed lease migration is unique, bounded and unapplied",()=>{
  assert.match(ddl,/CREATE TABLE IF NOT EXISTS content\.generation_run_task_leases/);
  assert.match(ddl,/generation_run_id uuid PRIMARY KEY/);
  assert.match(ddl,/ON DELETE RESTRICT/);
  assert.match(ddl,/attempt_number BETWEEN 1 AND 3/);
  assert.match(ddl,/lease_token uuid NOT NULL/);
  assert.match(ddl,/lease_expires_at/);
  assert.match(ddl,/BEGIN;/);
  assert.match(ddl,/COMMIT;/);
  assert.doesNotMatch(ddl,/^\s*(?:DROP|TRUNCATE|ALTER TABLE content\.generation_runs|UPDATE|DELETE FROM)/im);
});

test("task claim serializes DB ownership and fences retries without invoking worker",()=>{
  assert.match(lease,/EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true"/);
  assert.match(lease,/EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED !== "true"/);
  assert.match(lease,/EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED !== "true"/);
  assert.match(lease,/sqlClient\.begin\(async\(tx\)/);
  assert.match(lease,/FROM content\.generation_runs/);
  assert.match(lease,/FOR UPDATE/);
  assert.match(lease,/FROM content\.generation_run_task_leases/);
  assert.match(lease,/queueVersion:snapshot\?\.queueVersion/);
  assert.match(lease,/ON CONFLICT \(generation_run_id\) DO UPDATE/);
  assert.match(lease,/status = 'running'::generation_run_status/);
  assert.match(lease,/status = 'failed'::generation_run_status/);
  assert.match(lease,/EXCLUDED\.lease_token/);
  assert.ok(lease.indexOf("INSERT INTO content.generation_run_task_leases") <
    lease.indexOf("SET status = 'running'"));
  assert.doesNotMatch(lease,/runUniversalStudioRemote|executeUniversalStudioCompute|publish|CloudTasks|fetch\(/);
});

test("claim service is not mounted or dispatched without separate receiver and Neon approval",()=>{
  assert.doesNotMatch(api,/claimQuestionStudioAsyncTask|async-task-lease-claim/);
  assert.doesNotMatch(dispatch,/claimQuestionStudioAsyncTask/);
});
