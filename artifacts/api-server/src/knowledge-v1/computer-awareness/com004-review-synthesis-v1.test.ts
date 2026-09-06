import assert from "node:assert/strict";
import {
  COM004_ENGLISH_REVIEW_CORPUS_V1,
  auditCom004EnglishReviewCorpusV1,
  generateCom004ReviewQuestionV1,
} from "./com004-review-synthesis-v1";

const audit = auditCom004EnglishReviewCorpusV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM004_ENGLISH_REVIEW_CORPUS_V1.length, 216);
assert.equal(audit.questionCount, 216);
assert.equal(audit.qlCount, 18);
assert.equal(audit.questionsPerQl, 12);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.questionStudioRuntimeAuthorized, false);
assert.equal(audit.questionBankWritable, false);
assert.equal(audit.testEligible, false);
assert.equal(audit.mockEligible, false);
assert.equal(audit.productionEligible, false);
assert.equal(audit.status, "ENGLISH_REVIEW_CORPUS_V1_READY_FOR_EDITORIAL_AUDIT");
assert.equal(audit.nextGate, "COM004_ENGLISH_REVIEW_CORPUS_V1_WHOLE_CHAPTER_EDITORIAL_AUDIT");

for (let ql = 1; ql <= 18; ql += 1) {
  const qlId = `COM-004-QL-${String(ql).padStart(3, "0")}`;
  const questions = COM004_ENGLISH_REVIEW_CORPUS_V1.filter((question) => question.qlId === qlId);
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map((question) => question.stem)).size, 12);
  assert.equal(new Set(questions.map((question) => question.correctIndex)).size, 4);
}

assert.throws(() => generateCom004ReviewQuestionV1("COM-004-QL-001", 12));
assert.throws(() => generateCom004ReviewQuestionV1("COM-004-QL-999", 0));
