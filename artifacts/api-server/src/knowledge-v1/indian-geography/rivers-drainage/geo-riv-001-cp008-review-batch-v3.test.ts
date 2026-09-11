import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP008_REVIEW_BATCH_V3, auditGeoRiv001Cp008ReviewBatchV3 } from "./geo-riv-001-cp008-review-batch-v3";

const audit = auditGeoRiv001Cp008ReviewBatchV3();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 24, Hard: 12 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
assert.equal(audit.editorialOverlayOnly, true);

const statementQuestions = GEO_RIV_001_CP008_REVIEW_BATCH_V3.filter(
  (question) => question.qlId === "GEO-RIV-001-QL-072" || question.qlId === "GEO-RIV-001-QL-073",
);
const ambiguous = statementQuestions.filter((question) => /is incorrect:\s|Incorrect —/.test(question.explanation));
assert.equal(ambiguous.length, 0, ambiguous.map((question) => `${question.questionId}: ${question.explanation}`).join("\n"));

const falseStatementExplanations = statementQuestions.filter((question) => /incorrect/i.test(question.explanation));
assert.ok(falseStatementExplanations.length > 0);
for (const question of falseStatementExplanations) assert.match(question.explanation, /Correct fact:/);

console.log(JSON.stringify(audit, null, 2));
