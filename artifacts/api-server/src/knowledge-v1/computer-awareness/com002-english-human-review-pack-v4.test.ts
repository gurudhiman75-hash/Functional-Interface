import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_PACK_V4 } from "./com002-english-human-review-pack-v4";
import { generateCom002ReviewQuestionV4 } from "./com002-review-synthesis-v4";

assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.questionCount, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.qlCount, 13);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.questions.length, 26);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.status,
  "EXECUTED_GREEN_AWAITING_EXPLICIT_PRODUCT_OWNER_APPROVAL",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.workflowRunId, 33090114122);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.workflowJobId, 98580358004);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.conclusion, "SUCCESS");
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.englishV4CorpusQuestions, 520);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.localizationV3ParityQuestions, 1040);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence.preBankCandidateQuestions, 390);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.explicitApprovalVerified, false);

const perQl = new Map<string, number>();
for (const entry of COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.questions) {
  const qlId = entry.seed.split(":")[1];
  const replay = generateCom002ReviewQuestionV4({ qlId, seed: entry.seed });
  assert.deepEqual(replay, entry.question, `${entry.seed}: materialized V4 pack drift`);
  assert.equal(entry.question.options.length, 4);
  assert.equal(new Set(entry.question.options).size, 4);
  assert.equal(entry.question.options[entry.question.correctIndex], entry.question.canonicalAnswer);
  perQl.set(qlId, (perQl.get(qlId) ?? 0) + 1);
}

assert.equal(perQl.size, 13);
for (const [qlId, count] of perQl) {
  assert.equal(count, 2, `${qlId}: review pack must contain exactly two questions`);
}

console.log("[COM002-ENGLISH-HUMAN-REVIEW-PACK-V4] PASS questions=26 approval=false");
