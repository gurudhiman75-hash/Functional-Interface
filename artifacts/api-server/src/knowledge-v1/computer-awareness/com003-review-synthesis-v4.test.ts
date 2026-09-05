import { strict as assert } from "node:assert";

// Final English review-corpus gate before any freeze authority is considered.
import { COM003_ENGLISH_REVIEW_CORPUS_V4, buildCom003EnglishReviewCorpusV4 } from "./com003-review-synthesis-v4";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V4.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V4.map((q) => q.qlId)).size, 19);
for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((q) => q.qlId === ql.qlId);
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map((q) => q.explanation.trim().toLowerCase())).size >= 6, true, `${ql.qlId} explanation diversity is thin`);
}
for (const question of COM003_ENGLISH_REVIEW_CORPUS_V4) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.trim().toLowerCase())).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.explanation.includes(question.canonicalAnswer), true);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}
const replayA = buildCom003EnglishReviewCorpusV4({ perQl: 4, seedPrefix: "v4-replay" });
const replayB = buildCom003EnglishReviewCorpusV4({ perQl: 4, seedPrefix: "v4-replay" });
assert.deepEqual(replayA, replayB);

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V4]", { questionCount: 228, qlCount: 19, explanationDiversityFloor: 6, deterministic: true, reviewOnly: true });
