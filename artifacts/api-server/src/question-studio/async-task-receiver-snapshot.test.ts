import assert from "node:assert/strict";
import {computeInputFromQueuedSnapshot,QuestionStudioTaskSnapshotError} from "./async-task-receiver-snapshot";

const request={
  engineId:"quant-v4",packageId:"NUM-001",topic:"Arithmetic",
  subtopic:"Number System",count:3,language:"en",difficulty:"Mixed",seed:"persistent-seed",
};
const input={
  queueVersion:1,request,count:3,selectedCpIds:["NUM-CP-001"],
  difficultyFilterSupported:false,forwardLegacyExamProfile:true,
  requestedByFirebaseUid:"secret-admin-uid",authorization:"Bearer fake",
};
const sanitized=computeInputFromQueuedSnapshot(input);
assert.equal(sanitized.request.engineId,request.engineId);
assert.equal(sanitized.request.packageId,request.packageId);
assert.equal(sanitized.request.count,request.count);
assert.equal(sanitized.count,3);
assert.deepEqual(sanitized.selectedCpIds,["NUM-CP-001"]);
assert.equal(sanitized.difficultyFilterSupported,false);
assert.equal(sanitized.forwardLegacyExamProfile,true);
assert.ok(!JSON.stringify(sanitized).includes("secret-admin-uid"));
assert.ok(!JSON.stringify(sanitized).includes("Bearer"));
const poisoned={...input,request:{...request,authorization:"Bearer embedded-token",paymentSecret:"must-not-leak"}};
const stripped=computeInputFromQueuedSnapshot(poisoned);
assert.ok(!JSON.stringify(stripped).includes("Bearer embedded-token"));
assert.ok(!JSON.stringify(stripped).includes("must-not-leak"));
for(const invalid of [
  null, {}, [], {...input,queueVersion:2},
  {...input,count:51},
  {...input,count:0},
  {...input,selectedCpIds:null},
  {...input,request:null},
  {...input,request:{...request,count:2}},
  {...input,request:{...request,engineId:42}},
  {...input,request:{...request,packageId:undefined}},
]){
 assert.throws(()=>computeInputFromQueuedSnapshot(invalid),QuestionStudioTaskSnapshotError);
}
console.log("PASS: task worker reads only canonical queued input and excludes private admin data");
