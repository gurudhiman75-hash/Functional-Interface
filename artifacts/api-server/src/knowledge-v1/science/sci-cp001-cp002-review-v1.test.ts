import assert from "node:assert/strict";
import { auditSciCp001ReviewBatchV1 } from "./measurement-units/sci-cp001-review-v1";
import { auditSciCp002ReviewBatchV1 } from "./motion-force/sci-cp002-review-v1";

const cp001 = auditSciCp001ReviewBatchV1();
const cp002 = auditSciCp002ReviewBatchV1();

assert.equal(cp001.valid, true, cp001.issues.join(" | "));
assert.equal(cp001.questionCount, 60);
assert.equal(cp001.semanticCount, 60);
assert.deepEqual(cp001.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(cp001.answerPositions, [15, 15, 15, 15]);

assert.equal(cp002.valid, true, cp002.issues.join(" | "));
assert.equal(cp002.questionCount, 60);
assert.equal(cp002.semanticCount, 60);
assert.deepEqual(cp002.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(cp002.answerPositions, [15, 15, 15, 15]);

console.log(JSON.stringify({ SCI_CP_001: cp001, SCI_CP_002: cp002 }, null, 2));
