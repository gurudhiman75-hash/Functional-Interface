import assert from "node:assert/strict";
import {
  assertEnqueueIdentity, canonicalEnqueueRequest,
  digestCanonicalEnqueueRequest, EnqueueValidationError,
} from "./async-enqueue-contract";
import type { UniversalStudioComputeInput } from "./universal-executor";

const base: UniversalStudioComputeInput = {
  request: {
    engineId:"quant-v4",packageId:"TRG-002",exam:"SSC CGL",
    topic:"Trigonometry",subtopic:"Heights & Distances",
    count:3,language:"en",difficulty:"Medium",
    seed:"fixed-seed",canonicalProblemId:"TRG-CP-007",
  },
  count:3, selectedCpIds:["TRG-CP-007"], difficultyFilterSupported:true,
};
const sameReordered: UniversalStudioComputeInput = {
  selectedCpIds:["TRG-CP-007"], count:3, difficultyFilterSupported:true,
  request:{
    canonicalProblemId:"TRG-CP-007", difficulty:"Medium", language:"en",
    seed:"fixed-seed",subtopic:"Heights & Distances",topic:"Trigonometry",
    exam:"SSC CGL",packageId:"TRG-002",engineId:"quant-v4",count:3,
  },
};

assert.equal(digestCanonicalEnqueueRequest(base),digestCanonicalEnqueueRequest(sameReordered));
assert.match(digestCanonicalEnqueueRequest(base),/^[0-9a-f]{64}$/);
assert.notEqual(digestCanonicalEnqueueRequest(base),
  digestCanonicalEnqueueRequest({...base,count:2,request:{...base.request,count:2}}));
assert.notEqual(digestCanonicalEnqueueRequest(base),
  digestCanonicalEnqueueRequest({...base,request:{...base.request,language:"hi"}}));
assert.notEqual(digestCanonicalEnqueueRequest(base),
  digestCanonicalEnqueueRequest({...base,selectedCpIds:["TRG-CP-008"]}));
const contaminated = {...base,request:{...base.request,authorization:"Bearer secret",customerEmail:"customer@example.com"}};
assert.equal(digestCanonicalEnqueueRequest(base),
  digestCanonicalEnqueueRequest(contaminated as UniversalStudioComputeInput));
assert.ok(!JSON.stringify(canonicalEnqueueRequest(contaminated as UniversalStudioComputeInput)).includes("secret"));
assert.ok(!JSON.stringify(canonicalEnqueueRequest(contaminated as UniversalStudioComputeInput)).includes("customer@example.com"));
assertEnqueueIdentity({actorFirebaseUid:"admin_firebase-123",idempotencyKey:"request-uuid-123"});
for(const actorFirebaseUid of ["", "bad uid", "user@example.com", "u".repeat(129)]) {
  assert.throws(()=>assertEnqueueIdentity({actorFirebaseUid,idempotencyKey:"request-uuid-123"}),EnqueueValidationError);
}
for(const idempotencyKey of ["", "short", "includes space", "x".repeat(129)]) {
  assert.throws(()=>assertEnqueueIdentity({actorFirebaseUid:"admin-123",idempotencyKey}),EnqueueValidationError);
}
assert.throws(()=>assertEnqueueIdentity({actorFirebaseUid:"admin-123",idempotencyKey:"request-uuid-123",identityUserId:"not-a-uuid"}),EnqueueValidationError);
console.log("PASS: deterministic hashing, identity validation, secret exclusion, and request uniqueness");
