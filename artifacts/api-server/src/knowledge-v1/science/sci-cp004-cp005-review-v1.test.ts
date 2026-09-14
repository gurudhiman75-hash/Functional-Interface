import assert from "node:assert/strict";
import { auditSciCp004ReviewBatchV1 } from "./gravitation-pressure/sci-cp004-review-v1";
import { auditSciCp005ReviewBatchV1 } from "./heat-temperature/sci-cp005-review-v1";

const cp004 = auditSciCp004ReviewBatchV1();
const cp005 = auditSciCp005ReviewBatchV1();
assert.equal(cp004.valid,true,cp004.issues.join(" | "));
assert.equal(cp005.valid,true,cp005.issues.join(" | "));
assert.equal(cp004.questionCount,60);
assert.equal(cp005.questionCount,60);
assert.deepEqual(cp004.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(cp005.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(cp004.answerPositions,[15,15,15,15]);
assert.deepEqual(cp005.answerPositions,[15,15,15,15]);
console.log("SCI-CP-004/005 qualification audit passed");
