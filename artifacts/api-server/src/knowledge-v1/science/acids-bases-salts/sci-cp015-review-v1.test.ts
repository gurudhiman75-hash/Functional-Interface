import assert from "node:assert/strict";
import { SCI_CP015_REVIEW_V1, validateSciCp015ReviewV1 } from "./sci-cp015-review-v1";

const result=validateSciCp015ReviewV1();
assert.equal(result.valid,true,result.errors.join("; "));
assert.equal(result.totalQuestions,60);
assert.deepEqual(result.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(result.answerPositionCounts,{A:15,B:15,C:15,D:15});
for(let ql=1;ql<=10;ql++){const id=`SCI-015-QL-${String(ql).padStart(3,"0")}`;assert.equal(result.qlCounts[id],6);}
assert.equal(new Set(SCI_CP015_REVIEW_V1.map(q=>q.stem)).size,60);
assert.ok(SCI_CP015_REVIEW_V1.every(q=>q.options.length===4&&new Set(q.options).size===4));
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.stem.includes("strength from concentration")));
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.canonicalAnswer==="ammonium chloride"));
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.canonicalAnswer==="sodium carbonate"));
assert.ok(SCI_CP015_REVIEW_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered));
