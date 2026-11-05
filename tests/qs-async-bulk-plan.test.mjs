import test from "node:test";
import assert from "node:assert/strict";
import {planAsyncChapterReviewBatches, MAX_CHAPTER_REVIEW_CHILD} from "../artifacts/api-server/src/question-studio/async-bulk-plan.mjs";

const operationId = "review-operation-001";
test("splits 250 into stable independent safe child sizes",()=>{
  const plan=planAsyncChapterReviewBatches({totalCount:250,operationId});
  assert.equal(plan.length,13);
  assert.equal(plan.reduce((sum,b)=>sum+b.count,0),250);
  assert.ok(plan.every(b=>b.count<=MAX_CHAPTER_REVIEW_CHILD && b.count>=1));
  assert.equal(new Set(plan.map(b=>b.idempotencyKey)).size,plan.length);
  assert.deepEqual(plan,planAsyncChapterReviewBatches({totalCount:250,operationId}));
});
test("balanced CP allocation never creates a child smaller than selected CPs",()=>{
  const cpIds=Array.from({length:15},(_,i)=>"CP-"+String(i).padStart(3,"0"));
  const plan=planAsyncChapterReviewBatches({totalCount:45,selectedCpIds:cpIds,operationId});
  assert.deepEqual(plan.map(b=>b.count),[15,15,15]);
  assert.ok(plan.every(b=>b.selectedCpIds.length<=b.count));
  assert.throws(()=>planAsyncChapterReviewBatches({totalCount:21,selectedCpIds:cpIds,operationId}),
    /BULK_ASYNC_CP_SELECTION_EXCEEDS_SMALLEST_BATCH/);
});
test("fails closed on invalid requests and identities",()=>{
  for(const totalCount of [0,251,1.5,NaN,-2]){
    assert.throws(()=>planAsyncChapterReviewBatches({totalCount,operationId}));
  }
  assert.throws(()=>planAsyncChapterReviewBatches({totalCount:20,operationId:"x"}));
  assert.throws(()=>planAsyncChapterReviewBatches({totalCount:20,operationId,selectedCpIds:["a","a"]}));
  assert.throws(()=>planAsyncChapterReviewBatches({totalCount:250,operationId,
    selectedCpIds:Array.from({length:21},(_,i)=>"CP-"+i)}));
});
test("operation and child index domain separate idempotency keys",()=>{
  const a=planAsyncChapterReviewBatches({totalCount:30,operationId});
  const b=planAsyncChapterReviewBatches({totalCount:30,operationId:"review-operation-002"});
  assert.notEqual(a[0].idempotencyKey,a[1].idempotencyKey);
  assert.notEqual(a[0].idempotencyKey,b[0].idempotencyKey);
});
