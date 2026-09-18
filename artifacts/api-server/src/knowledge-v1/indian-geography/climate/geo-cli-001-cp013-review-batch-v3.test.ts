import assert from "node:assert/strict";
import { GEO_CLI_001_CP013_REVIEW_BATCH_V3, auditGeoCli001Cp013ReviewBatchV3 } from "./geo-cli-001-cp013-review-batch-v3";
const audit=auditGeoCli001Cp013ReviewBatchV3();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.questionCount,108);assert.equal(audit.qlCount,108);assert.equal(audit.stemCount,108);assert.equal(audit.semanticCount,108);assert.equal(audit.explanationCount,108);
assert.deepEqual(audit.difficultyCounts,{Easy:36,Medium:60,Hard:12});assert.deepEqual(audit.answerPositions,[27,27,27,27]);assert.equal(audit.synchronizedCp012Representatives,9);
for(let n=1;n<=108;n+=1){const id=`GEO-CLI-001-QL-${String(n).padStart(3,"0")}`;assert.equal(audit.qlCounts[id],1);}
for(const q of GEO_CLI_001_CP013_REVIEW_BATCH_V3){assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options[q.correctIndex],q.canonicalAnswer);assert.ok(q.sourceQuestionId&&q.sourceIds.length&&q.sourceFactIds.length);assert.equal(/\bbroad(?:ly)?\b/i.test(`${q.stem}\n${q.options.join("\n")}\n${q.explanation}`),false);}
console.log(JSON.stringify(audit,null,2));
