import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const route=read("artifacts/api-server/src/routes/admin-question-studio-async-staging.ts");
const mount=read("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts");
const registry=read("artifacts/api-server/src/routes/admin-question-studio-registry.ts");
const enqueue=read("artifacts/api-server/src/question-studio/async-enqueue-foundation.ts");
const previous=read("artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts");

test("new endpoint is staging-only and requires existing RBAC",()=>{
  assert.match(route,/router\.post\("\/runs\/async-staging",requireAdminPermission\("content\.generation\.run"\)/);
  assert.match(route,/EXAMTREE_API_RUNTIME==="cloud-run"/);
  assert.match(route,/EXAMTREE_API_STAGING==="true"/);
  for(const key of [
    "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_STAGING_ENQUEUE_APPROVED",
  ]) assert.ok(route.includes(key));
  assert.match(route,/QUESTION_STUDIO_STAGING_ENQUEUE_DISABLED/);
  assert.match(route,/req\.adminSession\?\.user\.id/);
  assert.match(route,/req\.user\?\.id/);
  assert.match(route,/Cache-Control","no-store"/);
});

test("staging enqueue follows existing auth and does not preempt legacy route",()=>{
  assert.ok(mount.indexOf("router.use(authenticate)") < mount.indexOf("router.use(adminQuestionStudioAsyncStagingRouter)"));
  assert.match(registry,/router\.post\("\/runs"/);
  assert.match(previous,/router\.post\(\s*"\/runs"/);
  assert.match(previous,/res\.status\(201\)\.json/);
  assert.match(route,/runs\/async-staging/);
  assert.doesNotMatch(previous,/recordQuestionStudioEnqueueIntent/);
});

test("enqueue validates authoritative registry, actor-scoped idempotency and never leaks task credentials",()=>{
  assert.match(route,/Idempotency-Key/);
  assert.match(route,/validateUniversalStudioComputeInput\(compute\)/);
  assert.match(route,/recordQuestionStudioEnqueueIntent/);
  assert.match(route,/identityUserId:req\.adminSession\.user\.id/);
  assert.match(route,/actorFirebaseUid:req\.user\.id/);
  assert.match(route,/idempotencyKey:key/);
  assert.match(route,/JSON\.stringify\(req\.body\)\.length>16_384/);
  assert.match(route,/res\.status\(receipt\.reused\?200:202\)/);
  assert.match(route,/QUESTION_STUDIO_STAGING_ENQUEUE_UNAVAILABLE/);
  assert.match(enqueue,/sqlClient\.begin\(async \(tx\)/);
  assert.doesNotMatch(route,/runUniversalStudioRemote|deliverQuestionStudioCloudTask|CloudTasksClient|INSERT INTO/);
});
