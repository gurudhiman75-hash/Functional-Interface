import { strict as assert } from "node:assert";
import { auditGeoRiv001Cp007FactsV1 } from "./geo-riv-001-cp007-validator";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED, auditGeoRiv001Cp007ReviewPolishV3 } from "./geo-riv-001-cp007-review-polish-v3";

const facts = auditGeoRiv001Cp007FactsV1();
assert.equal(facts.valid, true, facts.issues.join(" | "));
assert.ok((facts.sourceCounts.cp006 ?? 0) >= 12);

const audit = auditGeoRiv001Cp007ReviewPolishV3();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 60);
assert.equal(audit.semanticUniqueCount, 60);
assert.deepEqual(audit.answerPositions, [15, 15, 15, 15]);
assert.deepEqual(audit.difficultyCounts, { Easy: 15, Medium: 36, Hard: 9 });
assert.equal(audit.polishedQuestionCount, 60);
assert.equal(audit.polishedSemanticUniqueCount, 60);
assert.deepEqual(audit.polishedAnswerPositions, [15, 15, 15, 15]);
for (const token of ["cp002", "cp003", "cp004", "cp005", "cp006"]) assert.ok((audit.upstreamCounts[token] ?? 0) > 0, token);
assert.ok((audit.upstreamCounts.cp006 ?? 0) >= 5);
assert.equal(new Set(GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED.map((q) => q.questionId)).size, 60);
console.log(JSON.stringify(audit));
