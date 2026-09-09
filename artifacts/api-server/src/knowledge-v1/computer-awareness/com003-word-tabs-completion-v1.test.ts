import { strict as assert } from "node:assert";
import {
  COM003_WORD_TABS_AUTHORITY_V1,
  COM003_WORD_TABS_COMPLETION_AUDIT_V1,
  COM003_WORD_TABS_ENGLISH_REVIEW,
  COM003_WORD_TABS_HINDI_REVIEW,
  COM003_WORD_TABS_PUNJABI_REVIEW,
  COM003_WORD_TABS_QLS,
} from "./com003-word-tabs-completion-v1";

assert.equal(COM003_WORD_TABS_COMPLETION_AUDIT_V1.valid, true);
assert.equal(COM003_WORD_TABS_COMPLETION_AUDIT_V1.qls, 10);
assert.equal(COM003_WORD_TABS_COMPLETION_AUDIT_V1.questionsPerLanguage, 80);
assert.equal(COM003_WORD_TABS_AUTHORITY_V1.questionCountPerLanguage, 80);
assert.equal(COM003_WORD_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts, 240);
assert.equal(COM003_WORD_TABS_AUTHORITY_V1.status, "REVIEW_ONLY");
assert.equal(COM003_WORD_TABS_AUTHORITY_V1.questionBankWritesAuthorized, false);
assert.equal(COM003_WORD_TABS_AUTHORITY_V1.hardDifficultyAuthorized, false);
assert.deepEqual(COM003_WORD_TABS_QLS.map((item) => item.qlId), [
  "COM-003-QL-020",
  "COM-003-QL-021",
  "COM-003-QL-022",
  "COM-003-QL-023",
  "COM-003-QL-024",
  "COM-003-QL-025",
  "COM-003-QL-026",
  "COM-003-QL-027",
  "COM-003-QL-028",
  "COM-003-QL-029",
]);

for (const corpus of [COM003_WORD_TABS_ENGLISH_REVIEW, COM003_WORD_TABS_HINDI_REVIEW, COM003_WORD_TABS_PUNJABI_REVIEW]) {
  assert.equal(corpus.length, 80);
  assert.equal(new Set(corpus.map((item) => item.sourceQuestionId)).size, 80);
  assert.ok(corpus.every((item) => item.cpId === "COM-003-CP-002"));
  assert.ok(corpus.every((item) => item.options.length === 4));
  assert.ok(corpus.every((item) => item.options[item.correctIndex] === item.canonicalAnswer));
  assert.ok(corpus.every((item) => item.reviewOnly === true));
  assert.ok(corpus.every((item) => item.runtimeRegistered === false));
  assert.ok(corpus.every((item) => item.versionScoped === true));
}

assert.deepEqual(
  COM003_WORD_TABS_ENGLISH_REVIEW.map((item) => `${item.sourceQuestionId}|${item.correctIndex}`),
  COM003_WORD_TABS_HINDI_REVIEW.map((item) => `${item.sourceQuestionId}|${item.correctIndex}`),
);
assert.deepEqual(
  COM003_WORD_TABS_ENGLISH_REVIEW.map((item) => `${item.sourceQuestionId}|${item.correctIndex}`),
  COM003_WORD_TABS_PUNJABI_REVIEW.map((item) => `${item.sourceQuestionId}|${item.correctIndex}`),
);

for (const ql of COM003_WORD_TABS_QLS) {
  assert.equal(COM003_WORD_TABS_ENGLISH_REVIEW.filter((item) => item.qlId === ql.qlId).length, 8);
}

console.log("[COM003-WORD-TABS-COMPLETION-V1] PASS qls=10 questionsPerLanguage=80 artifacts=240");
