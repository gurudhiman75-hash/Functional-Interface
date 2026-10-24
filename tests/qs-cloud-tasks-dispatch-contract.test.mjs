import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(p)=>readFileSync(p,"utf8");
const general=read("artifacts/api-server/src/lib/outbox-publisher.ts");
const dispatcher=read("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatcher.ts");
const transport=read("artifacts/api-server/src/question-studio/async-cloud-tasks-transport.ts");
const enqueue=read("artifacts/api-server/src/question-studio/async-enqueue-foundation.ts");
const api=read("artifacts/api-server/src/app.ts");

test("legacy log-only outbox MUST NOT mark queued Question Studio work published",()=>{
  assert.match(general,/AND event_type <> 'question_studio\.generation_run\.queued\.v1'/);
  assert.match(general,/WHERE published_at IS NULL/);
  assert.match(general,/FOR UPDATE SKIP LOCKED/);
  assert.match(enqueue,/question_studio\.generation_run\.queued\.v1/);
});

test("dispatcher exclusively handles queued event with DB lock and only a run-id task",()=>{
  assert.match(dispatcher,/STANDARD_EVENT_TYPE = "question_studio\.generation_run\.queued\.v1"/);
  assert.match(dispatcher,/CHAPTER_EVENT_TYPE = "question_studio\.generation_run\.chapter_review_queued\.v1"/);
  assert.match(dispatcher,/e\.event_type = \$\{eventType\}/);
  assert.match(dispatcher,/chapterRunId \? CHAPTER_EVENT_TYPE : STANDARD_EVENT_TYPE/);
  assert.match(dispatcher,/INNER JOIN content\.generation_runs/);
  assert.match(dispatcher,/FOR UPDATE OF e SKIP LOCKED/);
  assert.match(dispatcher,/e\.published_at IS NULL/);
  assert.match(dispatcher,/e\.available_at <= now\(\)/);
  assert.match(dispatcher,/payload\?\.runId !== runId/);
  assert.match(dispatcher,/payload\?\.queueVersion !== 1/);
  assert.match(dispatcher,/deliverQuestionStudioCloudTask\(\{eventId,runId\},config\)/);
  assert.ok(dispatcher.indexOf("await deliverQuestionStudioCloudTask") <
    dispatcher.indexOf("SET attempts = attempts + 1, published_at = now()"));
  assert.match(dispatcher,/TASK_DISPATCH_RETRY_LIMIT/);
  assert.match(dispatcher,/available_at = now\(\) \+ interval '1 minute'/);
  assert.match(dispatcher,/cancelled/);
  assert.match(dispatcher,/failed/);
});

test("queue delivery requires four opt-in readiness flags and remains unmounted",()=>{
  for(const flag of [
    "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
  ]) assert.ok(dispatcher.includes(flag),flag);
  assert.doesNotMatch(api,/async-cloud-tasks-dispatcher|runQuestionStudioTaskDispatchOnce/);
  assert.doesNotMatch(general,/runQuestionStudioTaskDispatchOnce/);
  assert.doesNotMatch(enqueue,/deliverQuestionStudioCloudTask/);
  assert.doesNotMatch(dispatcher,/INSERT INTO content\.generation_run_items|INSERT INTO content\.generation_item_versions|DELETE FROM/i);
});

test("Cloud Tasks uses OIDC service account and no API secrets in task payload",()=>{
  assert.match(transport,/oidcToken:/);
  assert.match(transport,/serviceAccountEmail: config\.serviceAccount/);
  assert.match(transport,/audience: config\.audience/);
  assert.match(transport,/runId:event\.runId,queueVersion:1/);
  assert.match(transport,/createQuestionStudioTask/);
  assert.match(transport,/response\.status === 409/);
  assert.match(transport,/cloudtasks\.googleapis\.com/);
  assert.match(transport,/metadata\.google\.internal/);
  assert.doesNotMatch(transport,/FIREBASE_ID_TOKEN|QUESTION_STUDIO_WORKER_TOKEN|DATABASE_URL/);
  assert.doesNotMatch(transport,/authorization:\s*firebase|X-Examtree-Worker-Token/i);
});
