import { strict as assert } from "node:assert";

import { COM003_EXAM_REALNESS_AUDIT_V1 } from "./com003-exam-realness-audit-v1";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V6, buildCom003EnglishReviewCorpusV6 } from "./com003-review-synthesis-v6";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V6.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V6.map((q) => q.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V6.filter((q) => q.qlId === ql.qlId);
  assert.equal(questions.length, 12, `${ql.qlId} must have 12 review questions`);
  assert.equal(new Set(questions.map((q) => q.stem.trim().toLowerCase())).size >= 8, true, `${ql.qlId} stem diversity is thin`);
}

for (const question of COM003_ENGLISH_REVIEW_CORPUS_V6) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.trim().toLowerCase())).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.match(question.stem, /^[A-Z0-9“"'(]/);
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV6({ perQl: 4, seedPrefix: "v6-replay" }),
  buildCom003EnglishReviewCorpusV6({ perQl: 4, seedPrefix: "v6-replay" }),
);

assert.equal(COM003_EXAM_REALNESS_AUDIT_V1.valid, true, JSON.stringify(COM003_EXAM_REALNESS_AUDIT_V1.blockers, null, 2));
assert.equal(COM003_EXAM_REALNESS_AUDIT_V1.priorV4ProductReview, "REJECTED_STEMS_NOT_EXAM_LEVEL");
assert.equal(COM003_EXAM_REALNESS_AUDIT_V1.priorV5TechnicalReview, "REJECTED_DUPLICATE_STEMS");

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V6]", {
  questionCount: 228,
  qlCount: 19,
  priorV4ProductReview: "REJECTED_STEMS_NOT_EXAM_LEVEL",
  priorV5TechnicalReview: "REJECTED_DUPLICATE_STEMS",
  examRealness: COM003_EXAM_REALNESS_AUDIT_V1.status,
  blockerCount: COM003_EXAM_REALNESS_AUDIT_V1.blockerCount,
  advisoryCount: COM003_EXAM_REALNESS_AUDIT_V1.advisoryCount,
  deterministic: true,
  reviewOnly: true,
});
