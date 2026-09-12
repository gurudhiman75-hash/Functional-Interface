import { strict as assert } from "node:assert";
import {
  COM003_OFFICE_TABS_AUTHORITY_V1,
  COM003_OFFICE_TABS_COMPLETION_AUDIT_V1,
  COM003_OFFICE_TABS_ENGLISH_REVIEW,
  COM003_OFFICE_TABS_HINDI_REVIEW,
  COM003_OFFICE_TABS_PUNJABI_REVIEW,
  COM003_OFFICE_TABS_QLS,
} from "./com003-office-tabs-completion-v1";

assert.equal(COM003_OFFICE_TABS_COMPLETION_AUDIT_V1.valid, true);
assert.equal(COM003_OFFICE_TABS_QLS.length, 19);
assert.equal(COM003_OFFICE_TABS_AUTHORITY_V1.qlCount, 19);
assert.equal(COM003_OFFICE_TABS_AUTHORITY_V1.questionsPerQlPerLanguage, 8);
assert.equal(COM003_OFFICE_TABS_ENGLISH_REVIEW.length, 152);
assert.equal(COM003_OFFICE_TABS_HINDI_REVIEW.length, 152);
assert.equal(COM003_OFFICE_TABS_PUNJABI_REVIEW.length, 152);
assert.equal(COM003_OFFICE_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts, 456);

const expectedQlIds = Array.from({ length: 19 }, (_, index) => `COM-003-QL-${String(index + 30).padStart(3, "0")}`);
assert.deepEqual(COM003_OFFICE_TABS_QLS.map((item) => item.qlId), expectedQlIds);

for (const corpus of [COM003_OFFICE_TABS_ENGLISH_REVIEW, COM003_OFFICE_TABS_HINDI_REVIEW, COM003_OFFICE_TABS_PUNJABI_REVIEW]) {
  for (const question of corpus) {
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(question.stem.trim());
    assert.ok(question.explanation.trim());
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.versionScoped, true);
    assert.equal(question.cpId, "COM-003-CP-002");
  }
}

assert.deepEqual(
  COM003_OFFICE_TABS_ENGLISH_REVIEW.map((question) => `${question.sourceQuestionId}|${question.correctIndex}`),
  COM003_OFFICE_TABS_HINDI_REVIEW.map((question) => `${question.sourceQuestionId}|${question.correctIndex}`),
);
assert.deepEqual(
  COM003_OFFICE_TABS_ENGLISH_REVIEW.map((question) => `${question.sourceQuestionId}|${question.correctIndex}`),
  COM003_OFFICE_TABS_PUNJABI_REVIEW.map((question) => `${question.sourceQuestionId}|${question.correctIndex}`),
);

for (const ql of COM003_OFFICE_TABS_QLS) {
  for (const corpus of [COM003_OFFICE_TABS_ENGLISH_REVIEW, COM003_OFFICE_TABS_HINDI_REVIEW, COM003_OFFICE_TABS_PUNJABI_REVIEW]) {
    assert.equal(corpus.filter((question) => question.qlId === ql.qlId).length, 8, `${ql.qlId} must have 8 questions per language`);
  }
}

console.log("[COM003-OFFICE-TABS-COMPLETION-V1] PASS qls=19 questionsPerLanguage=152 artifacts=456");
