import assert from "node:assert/strict";
import { GEO_CLI_001_CP005_REVIEW_BATCH_V1, auditGeoCli001Cp005ReviewBatchV1 } from "./geo-cli-001-cp005-review-batch-v1";

const audit=auditGeoCli001Cp005ReviewBatchV1();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.questionCount,54);
assert.equal(audit.stemCount,54);
assert.equal(audit.semanticCount,54);
assert.equal(audit.explanationCount,54);
assert.deepEqual(audit.difficultyCounts,{Easy:18,Medium:30,Hard:6});
assert.deepEqual(audit.answerPositions,[14,14,13,13]);
assert.ok(audit.hardAnswerVariety>=3);
assert.ok(audit.statementStemCount<=10);
for(let i=37;i<=45;i+=1){assert.equal(audit.qlCounts[`GEO-CLI-001-QL-${String(i).padStart(3,"0")}`],6);}
for(const q of GEO_CLI_001_CP005_REVIEW_BATCH_V1){
  assert.equal(q.reviewOnly,true); assert.equal(q.runtimeRegistered,false);
  assert.equal(q.options.length,4); assert.equal(new Set(q.options).size,4);
  assert.equal(q.options[q.correctIndex],q.canonicalAnswer);
  assert.ok(q.explanation.length>=60); assert.ok(q.stem.length>=28); assert.ok(q.stem.length<=220); assert.ok(q.stem.trim().endsWith("?"));
}
console.log(JSON.stringify(audit,null,2));
