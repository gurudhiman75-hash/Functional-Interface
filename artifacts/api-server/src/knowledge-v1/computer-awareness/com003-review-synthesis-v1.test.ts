import { strict as assert } from "node:assert";

// Branch-scoped execution gate for the 228-question COM-003 English review corpus.
import {
  COM003_ENGLISH_REVIEW_CORPUS_V1,
  auditCom003EnglishReviewSynthesisV1,
  buildCom003EnglishReviewCorpus,
} from "./com003-review-synthesis-v1";

const audit = auditCom003EnglishReviewSynthesisV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 228);
assert.equal(audit.qlCount, 19);
assert.equal(audit.perQl, 12);
assert.equal(audit.coverage.length, 19);
assert.equal(audit.coverage.every((entry) => entry.questionCount === 12), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueStemCount >= 6), true);
assert.equal(audit.reviewOnly, true);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V1.length, 228);

const deterministicA = buildCom003EnglishReviewCorpus({ perQl: 3, seedPrefix: "determinism" });
const deterministicB = buildCom003EnglishReviewCorpus({ perQl: 3, seedPrefix: "determinism" });
assert.deepEqual(deterministicA, deterministicB);
assert.throws(() => buildCom003EnglishReviewCorpus({ perQl: 0 }), /between 1 and 50/);
assert.throws(() => buildCom003EnglishReviewCorpus({ perQl: 51 }), /between 1 and 50/);

for (const question of COM003_ENGLISH_REVIEW_CORPUS_V1) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V1]", audit);
