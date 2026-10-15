import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(p,'utf8');
const monitor=read('artifacts/api-server/src/question-studio/async-staging-watchdog.ts');
const job=read('artifacts/api-server/src/question-studio/async-cloud-tasks-dispatch-once.ts');
const image=read('Dockerfile.examtree-qs-staging-dispatcher');

test('watchdog is strictly isolated to authorized staging job and queue',()=>{
  for(const key of [
    'EXAMTREE_API_RUNTIME','EXAMTREE_API_STAGING',
    'EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED',
    'EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED',
    'EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED',
    'EXAMTREE_QUESTION_STUDIO_TASK_QUEUE',
    'EXAMTREE_QUESTION_STUDIO_TASK_PROJECT',
    'EXAMTREE_QUESTION_STUDIO_TASK_REGION',
  ])assert.ok(monitor.includes(key),`Missing staging guard ${key}`);
  assert.match(monitor,/examtree-qs-staging/);
  assert.match(monitor,/sarbedutech/);
  assert.match(monitor,/asia-south1/);
  assert.match(job,/assertStagingDispatcher|inspectQuestionStudioAsyncIncidents/);
  assert.match(image,/EXAMTREE_API_RUNTIME=cloud-run EXAMTREE_API_STAGING=true/);
});
test('alerts count only real outbox-queued requests, never legacy synthetic rows or private payloads',()=>{
  assert.match(monitor,/JOIN platform\.outbox_events e ON e\.aggregate_id=r\.id/);
  assert.match(monitor,/question_studio\.generation_run\.queued\.v1/);
  assert.match(monitor,/r\.request_snapshot->>'queueVersion'='1'/);
  assert.match(monitor,/LIMIT 5/);
  assert.match(monitor,/EXAMTREE_QS_STAGING_INCIDENT/);
  assert.match(monitor,/EXAMTREE_QS_STAGING_WATCHDOG_OK/);
  assert.doesNotMatch(monitor,/console\.(?:log|info|error)\([^\n]*requestSnapshot/);
  assert.doesNotMatch(monitor,/console\.(?:log|info|error)\([^\n]*(?:DATABASE_URL|WORKER_TOKEN)/);
});
test('recovery is off by default, requires expired deadline plus grace and no active lease',()=>{
  assert.match(monitor,/EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED!=="true"/);
  assert.match(monitor,/TERMINAL_GRACE_MINUTES = 10/);
  assert.match(monitor,/r\.due_at < now\(\)-\(\$\{TERMINAL_GRACE_MINUTES\} \* interval '1 minute'\)/);
  assert.match(monitor,/l\.generation_run_id IS NULL OR l\.completed_at IS NOT NULL/);
  assert.match(monitor,/l\.lease_expires_at <= now\(\)/);
  assert.match(monitor,/r\.status IN \('queued','running'\)/);
  assert.match(monitor,/FOR UPDATE OF r SKIP LOCKED/);
  assert.match(monitor,/LIMIT 1/);
  assert.match(monitor,/EXISTS \([\s\S]*e\.aggregate_id=r\.id/);
  assert.match(monitor,/SET status='failed'::generation_run_status/);
  assert.match(monitor,/actor_type,actor_user_id,action_key/);
  assert.match(monitor,/question_studio\.generation_run\.deadline_expired/);
  assert.doesNotMatch(monitor,/INSERT INTO content\.generation_run_items/);
  assert.doesNotMatch(monitor,/INSERT INTO content\.questions/);
  assert.doesNotMatch(monitor,/deliverQuestionStudioCloudTask/);
  assert.match(job,/recoverOneExpiredQuestionStudioStagingRun\(\)/);
  assert.ok(job.indexOf('recoverOneExpiredQuestionStudioStagingRun()') <
    job.indexOf('runQuestionStudioTaskDispatchOnce()'));
});
test('scanner runs even with empty outbox and check errors make scheduled job fail',()=>{
  assert.ok(job.indexOf('runQuestionStudioTaskDispatchOnce()') <
    job.indexOf('inspectQuestionStudioAsyncIncidents()'));
  assert.match(job,/EXAMTREE_QS_STAGING_HEALTH_CHECK_FAILED/);
  assert.match(job,/throw error;/);
  assert.match(job,/process\.exitCode=1/);
});
