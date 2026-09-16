import assert from "node:assert/strict";
import { SCI_CP013_REVIEW_V1, validateSciCp013ReviewV1 } from "./sci-cp013-review-v1";

const v=validateSciCp013ReviewV1();
assert.equal(v.valid,true,v.errors.join("; "));
assert.equal(v.totalQuestions,60);
assert.deepEqual(v.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(v.answerPositionCounts,{A:15,B:15,C:15,D:15});
for(let ql=1;ql<=10;ql++)assert.equal(v.qlCounts[`SCI-013-QL-${String(ql).padStart(3,"0")}`],6);
assert.equal(new Set(SCI_CP013_REVIEW_V1.map(q=>q.stem)).size,60);
assert.ok(SCI_CP013_REVIEW_V1.every(q=>q.options.length===4&&new Set(q.options).size===4));
assert.ok(SCI_CP013_REVIEW_V1.some(q=>q.stem.includes("same group")&&q.stem.includes("directly below")));
assert.ok(SCI_CP013_REVIEW_V1.some(q=>q.canonicalAnswer==="It resolved important order anomalies while preserving periodic properties"));
assert.ok(SCI_CP013_REVIEW_V1.some(q=>q.qlId==="SCI-013-QL-009"&&q.stem.includes("configuration")));
assert.ok(SCI_CP013_REVIEW_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered));
