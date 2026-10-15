import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const entry=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatch-prod-once.ts","utf8");
const docker=readFileSync("Dockerfile.examtree-qs-prod-dispatcher","utf8");
const builder=readFileSync("artifacts/api-server/build-qs-prod-dispatcher.mjs","utf8");
const staging=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatch-once.ts","utf8");
const stagingDocker=readFileSync("Dockerfile.examtree-qs-staging-dispatcher","utf8");

test("production executable requires explicit Cloud Run production approvals and no staging toggle",()=>{
  for(const required of [
    'EXAMTREE_API_RUNTIME !== "cloud-run"',
    'EXAMTREE_API_STAGING !== "false"',
    'EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED !== "true"',
    'EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED !== "true"',
    'EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED !== "true"',
    'EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true"',
    'EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true"',
    'EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED !== "true"',
    'EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED !== "true"',
    'EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED === "true"',
    'EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED === "true"',
  ])assert.ok(entry.includes(required),required);
});
test("target uses separate production queue, task service identity and receiver",()=>{
  for(const expected of [
    'config.projectId !== "sarbedutech"',
    'config.region !== "asia-south1"',
    'config.queueId !== "examtree-qs-prod"',
    'config.serviceAccount !== "examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com"',
    'host.startsWith("examtree-qs-receiver-prod-")',
    'host.endsWith(".run.app")',
    'getQuestionStudioTaskConfig(env)',
  ])assert.ok(entry.includes(expected),expected);
});
test("production artifact is independent, one-shot, and does not add rollout side effects",()=>{
  assert.match(builder,/async-cloud-tasks-dispatch-prod-once\.ts/);
  assert.match(builder,/qs-prod-dispatch-once\.mjs/);
  assert.match(docker,/EXAMTREE_API_STAGING=false/);
  assert.match(docker,/CMD \["node","artifacts\/api-server\/dist\/qs-prod-dispatch-once\.mjs"\]/);
  assert.match(entry,/runQuestionStudioTaskDispatchOnce\(\)/);
  assert.match(entry,/QS_PROD_OUTBOX_EMPTY/);
  assert.match(entry,/QS_PRODUCTION_DISPATCH_FAILED/);
  for(const text of [entry,docker,builder]){
    assert.doesNotMatch(text,/gcloud\s+(?:run|tasks|scheduler|sql)/);
    assert.doesNotMatch(text,/cloudtasks\.googleapis\.com\/v2.*queues\//);
  }
  assert.match(staging,/queue!=="examtree-qs-staging"/);
  assert.match(stagingDocker,/EXAMTREE_API_STAGING=true/);
});
