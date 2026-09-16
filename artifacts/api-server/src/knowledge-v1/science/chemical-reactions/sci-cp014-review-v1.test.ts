import assert from "node:assert/strict";
import { SCI_CP014_REVIEW_V1, validateSciCp014ReviewV1 } from "./sci-cp014-review-v1";

const v=validateSciCp014ReviewV1();
assert.equal(v.valid,true,v.errors.join("; "));
assert.equal(v.totalQuestions,60);
assert.deepEqual(v.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(v.answerPositionCounts,{A:15,B:15,C:15,D:15});
for(let ql=1;ql<=10;ql++)assert.equal(v.qlCounts[`SCI-014-QL-${String(ql).padStart(3,"0")}`],6);
assert.equal(new Set(SCI_CP014_REVIEW_V1.map(q=>q.stem)).size,60);
assert.ok(SCI_CP014_REVIEW_V1.every(q=>q.options.length===4&&new Set(q.options).size===4));
assert.ok(SCI_CP014_REVIEW_V1.some(q=>q.canonicalAnswer==="double displacement and precipitation"));
assert.ok(SCI_CP014_REVIEW_V1.some(q=>q.canonicalAnswer==="it remains balanced but is no longer in the smallest whole-number ratio"));
assert.ok(SCI_CP014_REVIEW_V1.some(q=>q.qlId==="SCI-014-QL-009"&&q.stem.includes("silver salt")));
assert.ok(SCI_CP014_REVIEW_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered));
