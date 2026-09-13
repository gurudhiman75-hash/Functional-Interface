import assert from "node:assert/strict";
import { HIS_CP003_REQUIRED_FACTS_V1,HIS_CP003_REVIEW_BATCH_V1,auditHisCp003ReviewBatchV1 } from "./his-cp003-review-v1";

const audit=auditHisCp003ReviewBatchV1();
assert.equal(audit.valid,true,audit.issues.join(" | "));
assert.equal(audit.questionCount,60);
assert.equal(audit.semanticCount,60);
assert.deepEqual(audit.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.equal(Object.keys(audit.qlCounts).length,10);
assert.ok(Object.values(audit.qlCounts).every(count=>count===6));
assert.ok(Math.max(...audit.answerPositions)-Math.min(...audit.answerPositions)<=1);
assert.ok(HIS_CP003_REQUIRED_FACTS_V1.length>=40);
assert.equal(HIS_CP003_REVIEW_BATCH_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered),true);
assert.equal(HIS_CP003_REVIEW_BATCH_V1.some(q=>/\b(?:NIOS|NCERT|UNESCO|source|textbook)\b/i.test(q.stem)),false);
console.log(JSON.stringify(audit,null,2));
