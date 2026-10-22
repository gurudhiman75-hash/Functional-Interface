import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const receiver=readFileSync("artifacts/api-server/src/async-task-receiver-prod-standalone.ts","utf8");
const staging=readFileSync("artifacts/api-server/src/async-task-receiver-standalone.ts","utf8");
const build=readFileSync("artifacts/api-server/build-qs-prod-task-receiver.mjs","utf8");
const docker=readFileSync("Dockerfile.examtree-qs-prod-task-receiver","utf8");
test("requires explicit production flags and dedicated Cloud Run service",()=>{
  for(const signal of [
    'env.EXAMTREE_API_RUNTIME!=="cloud-run"',
    'env.EXAMTREE_API_STAGING!=="false"',
    'env.K_SERVICE!=="examtree-qs-receiver-prod"',
    'env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED==="true"',
    '"EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED"',
    '"EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED"',
    '"EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED"',
    '"EXAMTREE_QS_PRODUCTION_WORKER_BINDING_VERIFIED"',
    '"EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED"',
    '"EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED"',
  ])assert.ok(receiver.includes(signal),signal);
});
test("validates Google OIDC identity and fixed production receiver audience",()=>{
  assert.match(receiver,/createQuestionStudioTaskOidcVerifier/);
  assert.match(receiver,/await verifyOidc\(req\.get\("Authorization"\),config\)/);
  assert.match(receiver,/config\.serviceAccount!=="examtree-qs-task-prod@sarbedutech\.iam\.gserviceaccount\.com"/);
  assert.match(receiver,/host\.startsWith\("examtree-qs-receiver-prod-"\)/);
  assert.match(receiver,/validateQuestionStudioTaskBody\(req\.body\)/);
});
test("uses only production remote worker and durable review commit",()=>{
  assert.match(receiver,/worker\.hostname\.startsWith\("examtree-universal-prod-"\)/);
  assert.match(receiver,/claimQuestionStudioAsyncTask\(runId,reviewGuard \?\? isProdCanarySnapshot\)/);
  assert.match(receiver,/QS_PRODUCTION_REVIEW_SCOPE_NOT_AUTHORIZED/);
  assert.match(receiver,/assertProdCanaryRequest\(runId\)/);
  assert.match(receiver,/validateAsyncTaskComputeInput\(compute\)/);
  assert.match(receiver,/commitQuestionStudioAsyncReview/);
  assert.match(receiver,/res\.status\(204\)\.end\(\)/);
  assert.match(docker,/EXAMTREE_API_STAGING=false/);
  assert.match(build,/async-task-receiver-prod-standalone\.ts/);
  assert.match(build,/question-studio-capabilities\.json/);
  assert.match(staging,/EXAMTREE_API_STAGING!=="true"/);
});
