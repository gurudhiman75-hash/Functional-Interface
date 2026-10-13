import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const app=read("artifacts/api-server/src/app.ts");
const router=read("artifacts/api-server/src/routes/internal-question-studio-async-task.ts");
const snapshot=read("artifacts/api-server/src/question-studio/async-task-receiver-snapshot.ts");

test("Cloud Tasks route is staging-only, disabled by default, size bounded",()=>{
  assert.match(app,/app\.post\("\/internal\/question-studio\/async-task",express\.json\(\{limit:"2kb"\}\)/);
  assert.match(app,/EXAMTREE_API_RUNTIME==="cloud-run"/);
  assert.match(app,/EXAMTREE_API_STAGING==="true"/);
  for(const flag of [
    "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
    "EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED",
  ])assert.ok(app.includes(flag),flag);
  assert.match(app,/QUESTION_STUDIO_ASYNC_RECEIVER_DISABLED/);
  assert.match(app,/lazyRouter\(/);
});

test("Google JWT verification must precede Neon claim, worker compute and review commit",()=>{
  const auth=router.indexOf("await verifyOidc(");
  const body=router.indexOf("validateQuestionStudioTaskBody(req.body)");
  const claim=router.indexOf("await claimQuestionStudioAsyncTask(");
  const run=router.indexOf("await runUniversalStudioRemote(");
  const save=router.indexOf("await commitQuestionStudioAsyncReview(");
  assert.ok(auth>=0&&auth<body&&body<claim&&claim<run&&run<save);
  assert.match(router,/getQuestionStudioTaskOidcConfig/);
  assert.match(router,/computeInputFromQueuedSnapshot\(claim\.requestSnapshot\)/);
  assert.match(router,/validateUniversalStudioComputeInput\(compute\)/);
  assert.match(router,/leaseToken:claim\.leaseToken/);
  assert.match(router,/\["terminal","not_found","exhausted"\]/);
  assert.match(router,/ASYNC_TASK_LEASE_BUSY/);
  assert.match(router,/status\(503\)/);
  assert.doesNotMatch(router,/req\.adminSession|requireAdminPermission|FirebaseAuth/);
  assert.doesNotMatch(router,/console\.error\([^\n]*error\)/);
});

test("task payload contains run ID only; full generation request comes from Neon",()=>{
  assert.match(router,/validateQuestionStudioTaskBody\(req\.body\)/);
  assert.match(snapshot,/queueVersion!==1/);
  assert.match(snapshot,/request\.count!==x\.count/);
  assert.match(snapshot,/request:safeRequest as UniversalStudioComputeInput/);
  assert.match(snapshot,/const safeRequest=/);
  assert.doesNotMatch(snapshot,/request:request as UniversalStudioComputeInput/);
  assert.doesNotMatch(router,/req\.body\.questions|req\.body\.request|req\.body\.token/);
});
