import { strict as assert } from "node:assert";

import { auditCom003EditorialQualityV2 } from "./com003-editorial-quality-audit-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V3 } from "./com003-review-synthesis-v3";

const audit = auditCom003EditorialQualityV2();
const failingIds = new Set(
  audit.blockers
    .map((blocker) => blocker.split(":").slice(1).join(":"))
    .filter((value) => value.startsWith("COM003-REVIEW")),
);
const failingQuestions = COM003_ENGLISH_REVIEW_CORPUS_V3
  .filter((question) => failingIds.has(question.questionId))
  .map((question) => ({
    questionId: question.questionId,
    qlId: question.qlId,
    surfaceMode: question.surfaceMode,
    targetFactId: question.targetFactId,
    stem: question.stem,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
  }));
console.log("[COM003-EDITORIAL-FAILURE-DIAGNOSTICS]", JSON.stringify({ failingQuestions, duplicateStemGroups: audit.duplicateStemGroups }, null, 2));

assert.equal(audit.questionCount, 228);
assert.equal(audit.qlCount, 19);
assert.equal(audit.valid, true, [
  ...audit.blockers,
  ...audit.duplicateStemGroups.map((group) => `DUPLICATE:${group.stem}:${group.questionIds.join(",")}`),
].join("\n"));
assert.equal(audit.blockerCount, 0);
assert.equal(audit.duplicateStemGroups.length, 0);
assert.equal(audit.coverage.every((entry) => entry.questionCount === 12), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueStemCount >= 8), true);
assert.equal(audit.coverage.every((entry) => entry.stemFamilyCount >= 3), true);
assert.equal(audit.coverage.every((entry) => entry.answerPositions.every((count) => count > 0)), true);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

console.log("[COM003-EDITORIAL-QUALITY-AUDIT-V2]", JSON.stringify(audit, null, 2));
