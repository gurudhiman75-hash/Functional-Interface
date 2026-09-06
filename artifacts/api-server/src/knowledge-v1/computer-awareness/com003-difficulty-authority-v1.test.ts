import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  COM003_HARD_DIFFICULTY_STATUS_V1,
  classifyCom003DifficultyV1,
  filterCom003ByDifficultyV1,
} from "./com003-difficulty-authority-v1";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16_2.length, 228);
assert.equal(COM003_PERMANENT_QLS.length, 19);

const decisions = COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((question) => ({
  question,
  decision: classifyCom003DifficultyV1(question),
}));

const counts = { Easy: 0, Medium: 0, Hard: 0 };
for (const { question, decision } of decisions) {
  counts[decision.difficulty] += 1;
  assert.equal(decision.authorityVersion, COM003_DIFFICULTY_AUTHORITY_VERSION_V1);
  assert.equal(decision.productionClaimAuthorized, false);
  assert.ok(decision.rationale.length >= 40, `${question.questionId}:thin rationale`);
}

assert.deepEqual(counts, { Easy: 96, Medium: 132, Hard: 0 });
assert.equal(filterCom003ByDifficultyV1(COM003_ENGLISH_REVIEW_CORPUS_V16_2, "Easy").length, 96);
assert.equal(filterCom003ByDifficultyV1(COM003_ENGLISH_REVIEW_CORPUS_V16_2, "Medium").length, 132);
assert.equal(filterCom003ByDifficultyV1(COM003_ENGLISH_REVIEW_CORPUS_V16_2, "Hard").length, 0);
assert.equal(filterCom003ByDifficultyV1(COM003_ENGLISH_REVIEW_CORPUS_V16_2, "Mixed").length, 228);
assert.equal(COM003_HARD_DIFFICULTY_STATUS_V1.authorized, false);

for (const ql of COM003_PERMANENT_QLS) {
  const qlDecisions = decisions.filter(({ question }) => question.qlId === ql.qlId);
  assert.equal(qlDecisions.length, 12, ql.qlId);
  assert.ok(qlDecisions.every(({ decision }) => decision.difficulty !== "Hard"), `${ql.qlId}:unexpected hard label`);
}

for (const qlId of ["COM-003-QL-011", "COM-003-QL-015", "COM-003-QL-018"]) {
  const qlDecisions = decisions.filter(({ question }) => question.qlId === qlId);
  assert.ok(qlDecisions.every(({ decision }) => decision.difficulty === "Medium"), `${qlId}:must remain Medium-only`);
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => q.surfaceMode === "CELL_ADDRESS_INTERPRETATION" || q.surfaceMode === "ORIENTATION_FROM_DIMENSIONS")) {
  if (q.examSurfaceFamily === "DIRECT_RECALL" || q.examSurfaceFamily === "FUNCTIONAL_APPLICATION") {
    assert.equal(classifyCom003DifficultyV1(q).difficulty, "Easy", `${q.questionId}:one-step interpretation must remain Easy`);
  }
}

console.log("[COM003-DIFFICULTY-V1]", {
  authority: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  questions: decisions.length,
  counts,
  hardRoutingAuthorized: COM003_HARD_DIFFICULTY_STATUS_V1.authorized,
  productionClaimAuthorized: false,
});
