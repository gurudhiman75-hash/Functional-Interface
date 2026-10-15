import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const ops=read('artifacts/api-server/src/routes/admin-question-studio-async-operations.ts');
const mount=read('artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts');
const page=read('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx');
const api=read('artifacts/admin-app/src/features/question-studio/api.ts');

test('ops endpoint is staging-only, RBAC protected, read-only, not public',()=>{
  assert.match(ops,/EXAMTREE_API_RUNTIME === "cloud-run"/);
  assert.match(ops,/EXAMTREE_API_STAGING === "true"/);
  assert.match(ops,/EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED === "true"/);
  assert.match(ops,/router.get\("\/operations\/staging",requireAdminPermission\("content\.generation\.read"\)/);
  assert.match(mount,/router.use\(authenticate\);[\s\S]*router.use\(adminQuestionStudioAsyncOperationsRouter\)/);
  assert.match(ops,/Cache-Control","private, no-store"/);
  assert.doesNotMatch(ops,/\b(UPDATE|INSERT INTO|DELETE FROM|TRUNCATE|DROP TABLE|ALTER TABLE)\b/i);
});
test('ops reports only durable outbox-backed runs and never treats synthetic rows as backlog',()=>{
  assert.match(ops,/JOIN platform\.outbox_events e ON e\.aggregate_id=r\.id/);
  assert.match(ops,/e\.event_type='question_studio\.generation_run\.queued\.v1'/);
  assert.match(ops,/r\.request_snapshot->>'queueVersion'='1'/);
  assert.match(ops,/r\.created_at >= now\(\)-interval '30 days'/);
  for(const field of ['dispatch_delayed','task_delayed','expired_leases','last_completed_at','overdue','failed']){
    assert.ok(ops.includes(field),`Missing ${field}`);
  }
  assert.match(ops,/LIMIT 10/);
  assert.match(ops,/infrastructureStatus:"not-verified-by-database"/);
});
test('monitoring is visible only in opted-in staging frontend and does not claim infrastructure health',()=>{
  assert.match(api,/getQuestionStudioStagingOperations/);
  assert.match(page,/if \(!STAGING_ASYNC_ENABLED\) return;/);
  assert.match(page,/window\.setInterval\(\(\) => void update\(\), 60000\)/);
  assert.match(page,/Staging async pipeline · Neon outbox/);
  assert.match(page,/Database metrics cannot confirm Cloud Scheduler or Cloud Tasks availability/);
  assert.doesNotMatch(page,/operator dispatch required|paused staging queue needs an operator/);
  assert.match(page,/automatic staging dispatch when Cloud Scheduler and Cloud Tasks are running/);
  assert.match(page,/getQuestionStudioStagingOperations/);
});

test('mobile telemetry retries on foreground or connectivity and does not mislabel stale results as healthy',()=>{
  assert.match(page,/document\.addEventListener\('visibilitychange', retryWhenVisible\)/);
  assert.match(page,/window\.addEventListener\('focus', retryWhenVisible\)/);
  assert.match(page,/window\.addEventListener\('online', retryWhenOnline\)/);
  assert.match(page,/document\.removeEventListener\('visibilitychange', retryWhenVisible\)/);
  assert.match(page,/window\.removeEventListener\('focus', retryWhenVisible\)/);
  assert.match(page,/window\.removeEventListener\('online', retryWhenOnline\)/);
  assert.match(page,/if \(!active \|\| inFlight\) return/);
  assert.match(page,/Monitoring needs refresh/);
  assert.match(page,/Figures are from the last successful check, not current health/);
  assert.match(page,/Retry status/);
  assert.match(page,/stagingOperationsError \|\|[\s\S]*?stagingOperations\.requiresAttention/);
});
