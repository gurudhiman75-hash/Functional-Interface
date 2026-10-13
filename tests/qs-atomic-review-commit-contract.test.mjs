import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const commit=read("artifacts/api-server/src/question-studio/async-review-commit.ts");
const contract=read("artifacts/api-server/src/question-studio/async-review-commit-contract.ts");
const app=read("artifacts/api-server/src/app.ts");
const taskClaim=read("artifacts/api-server/src/question-studio/async-task-lease-claim.ts");

test("review saver remains disabled and unreachable until secure task receiver exists",()=>{
  for(const flag of [
    "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
    "EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED",
  ])assert.ok(commit.includes(flag),flag);
  assert.doesNotMatch(app,/commitQuestionStudioAsyncReview|async-review-commit/);
  assert.doesNotMatch(taskClaim,/commitQuestionStudioAsyncReview/);
});

test("single Neon transaction locks run and checks fenced lease before insert",()=>{
  assert.match(commit,/sqlClient\.begin\(async\(tx\)/);
  assert.match(commit,/FROM content\.generation_runs/);
  assert.match(commit,/FOR UPDATE/);
  assert.match(commit,/FROM content\.generation_run_task_leases/);
  assert.match(commit,/leaseRows\[0\]\.leaseToken!==input\.leaseToken/);
  assert.match(commit,/leaseRows\[0\]\.active!==true/);
  assert.match(commit,/ASYNC_REVIEW_STALE_LEASE/);
  assert.match(commit,/status!=="running"/);
  assert.match(commit,/validateQuestionStudioAsyncReviewBatch/);
  assert.match(commit,/validateUniversalStudioComputeInput\(canonical\)/);
  assert.ok(commit.indexOf("FROM content.generation_run_task_leases") <
    commit.indexOf("INSERT INTO content.generation_run_items"));
  assert.match(commit,/INSERT INTO content\.generation_run_items/);
  assert.match(commit,/INSERT INTO content\.generation_item_versions/);
  assert.match(commit,/SET status='review'::generation_run_status/);
  assert.match(commit,/SET completed_at=now\(\)/);
  assert.match(commit,/INSERT INTO platform\.audit_events/);
  assert.match(commit,/INSERT INTO platform\.outbox_events/);
  assert.doesNotMatch(commit,/INSERT INTO content\.questions|INSERT INTO content\.question_versions|automaticStudentPublication:\s*true/);
});

test("duplicate task after commit returns same review and verifies complete initial versions",()=>{
  assert.match(commit,/\["review","partially_approved","approved"\]/);
  assert.match(commit,/ASYNC_REVIEW_STATE_INCOMPLETE/);
  assert.match(commit,/v\.version_number=1/);
  assert.match(commit,/status:"already_committed"/);
  assert.match(commit,/count\s*=\s*canonical\.count/);
});

test("worker cannot self-authorize Question Bank eligibility via output",()=>{
  assert.match(commit,/listQuestionStudioPackages\(\)/);
  assert.match(commit,/questionBankWritable:pkg\.questionBankWritable/);
  assert.match(commit,/manualApprovalRequired:pkg\.manualApprovalRequired/);
  assert.match(commit,/\.\.\.question,\s*\.\.\.lifecycle/);
  assert.match(commit,/validationResult:"pending"/);
  assert.match(contract,/ASYNC_BATCH_MISMATCH/);
});
