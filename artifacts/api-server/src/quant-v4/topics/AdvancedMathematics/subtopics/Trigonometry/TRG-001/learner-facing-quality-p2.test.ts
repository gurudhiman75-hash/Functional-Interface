import assert from "node:assert/strict";

import { generatePostFreezeRemediatedTrg001Question } from "./production-post-freeze-remediation-v1";
import {
  TRG_001_LEARNER_FACING_QUALITY_P2,
  generateLearnerFacingAuditTrg001Question,
} from "./learner-facing-quality-p2";

assert.deepEqual(TRG_001_LEARNER_FACING_QUALITY_P2.difficultyRecalibratedQlIds, ["TRG-001-QL-121"]);
assert.equal(TRG_001_LEARNER_FACING_QUALITY_P2.questionStudioRebound, false);

for (const seed of Array.from({ length: 20 }, (_, i) => `trg-learner-q121-${i + 1}`)) {
  const source: any = generatePostFreezeRemediatedTrg001Question("TRG-001-QL-121", seed);
  const audited: any = generateLearnerFacingAuditTrg001Question("TRG-001-QL-121", seed, "en");

  assert.equal(source.difficulty, "Hard");
  assert.equal(audited.difficulty, "Medium");
  assert.equal(audited.learnerFacingAuditP2.originalDifficulty, "Hard");
  assert.equal(audited.learnerFacingAuditP2.learnerDifficulty, "Medium");

  // Difficulty calibration must not alter the mathematical question.
  assert.equal(audited.stem, source.stem);
  assert.deepEqual(audited.options, source.options);
  assert.equal(audited.correctIndex, source.correctIndex);
  assert.equal(audited.answer, source.answer);
  assert.deepEqual(audited.exactAnswer, source.exactAnswer);

  // Learner-facing explanation is simplified without deleting QA metadata.
  assert.ok(String(audited.learnerExplanation).length > 0);
  assert.ok(!audited.learnerExplanation.includes("Shortcut:"));
  assert.ok(!audited.learnerExplanation.includes("Common trap:"));
  assert.deepEqual(audited.explanation.shortcut, source.explanation.shortcut);
  assert.deepEqual(audited.explanation.traps, source.explanation.traps);

  assert.equal(audited.questionStudioDiscoverable, false);
  assert.equal(audited.testEligibility, "INELIGIBLE");
  assert.equal(audited.publiclyPublishable, false);
}

// A non-remediated role keeps its existing difficulty.
for (const qlId of ["TRG-001-QL-122", "TRG-001-QL-136", "TRG-001-QL-142"] as const) {
  const seed = `trg-learner-control-${qlId}`;
  const source: any = generatePostFreezeRemediatedTrg001Question(qlId, seed);
  const audited: any = generateLearnerFacingAuditTrg001Question(qlId, seed, "en");
  assert.equal(audited.difficulty, source.difficulty);
}

console.log(JSON.stringify({
  status: "PASS_TRG_001_LEARNER_FACING_QUALITY_P2",
  difficultyRecalibratedQlIds: TRG_001_LEARNER_FACING_QUALITY_P2.difficultyRecalibratedQlIds,
  sampledQ121Seeds: 20,
  questionStudioRebound: false,
}));
