import assert from "node:assert/strict";
import {
  CLOCK_DIFFICULTY_AUDIT,
  CLOCK_DIFFICULTY_POLICY,
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_ITEM_DIFFICULTY_POLICY,
  CLOCK_TASK_CATALOG,
  clockDifficultyAuditSummary,
  difficultyForClockTask,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
assert.deepEqual(new Set(Object.keys(CLOCK_DIFFICULTY_AUDIT)), new Set(taskIds));

for (const taskId of taskIds) {
  const record = CLOCK_DIFFICULTY_AUDIT[taskId];
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
  assert.equal(record.taskId, taskId);
  assert.equal(record.cluster, disposition.cluster);
  assert.equal(record.disposition, disposition.disposition);
  assert.equal(difficultyForClockTask(taskId), record.difficulty);
  assert(record.rationale.length > 0);

  if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    assert.equal(record.calibrationStatus, "ADVANCED_HOLD_NOT_CORE_CALIBRATED");
    assert.equal(record.difficulty, "ADVANCED");
  } else if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
    assert.equal(record.calibrationStatus, "INTERNAL_ONLY");
  } else {
    assert.equal(record.calibrationStatus, "SEMANTIC_BASELINE_CALIBRATED");
    assert(record.features.length > 0, `${taskId} has no semantic difficulty features.`);
  }
}

// Baseline task calibration must not regress to checkpoint-order labels.
assert.equal(difficultyForClockTask("HAND_HOUR_ROTATION"), "FOUNDATION");
assert.equal(difficultyForClockTask("SMALLER_ANGLE_AT_TIME"), "FOUNDATION");
assert.equal(difficultyForClockTask("DIRECTED_CLOCKWISE_SEPARATION"), "STANDARD");
assert.equal(difficultyForClockTask("ONE_TIME_FOR_ANGLE_IN_HOUR"), "STANDARD");
assert.equal(difficultyForClockTask("COUNT_COINCIDENCES"), "STANDARD");
assert.equal(difficultyForClockTask("DISPLAYED_FROM_ACTUAL_ELAPSED"), "STANDARD");
assert.equal(difficultyForClockTask("INITIAL_OFFSET_CORRECT_RATE"), "FOUNDATION");
assert.equal(difficultyForClockTask("DERIVE_RATE_FROM_OBSERVATIONS"), "ADVANCED");
assert.equal(difficultyForClockTask("MULTIDAY_ACTUAL_FROM_DISPLAY"), "ADVANCED");
assert.equal(difficultyForClockTask("NEXT_CORRECT_READING"), "ADVANCED");
assert.equal(difficultyForClockTask("COMPARE_TWO_FAULTY_CLOCKS"), "ADVANCED");
assert.equal(difficultyForClockTask("GAIN_FROM_COINCIDENCE_INTERVAL"), "ADVANCED");
assert.equal(difficultyForClockTask("DURATION_FOR_N_STRIKES"), "FOUNDATION");
assert.equal(difficultyForClockTask("TOTAL_STRIKES_24_HOURS"), "FOUNDATION");
assert.equal(difficultyForClockTask("MIRROR_FROM_ACTUAL"), "FOUNDATION");
assert.equal(difficultyForClockTask("READ_TIME_FROM_DIAGRAM"), "FOUNDATION");
assert.equal(difficultyForClockTask("TIME_AFTER_HANDS_INTERCHANGED"), "STANDARD");
assert.equal(difficultyForClockTask("PIECEWISE_RATE"), "ADVANCED");

function expectedBand(score: number) {
  if (score <= 2) return "FOUNDATION";
  if (score <= 4) return "STANDARD";
  return "ADVANCED";
}

// Generated items add actual item features (fractions, day offsets, diagrams, etc.)
// on top of the semantic baseline. Human calibration remains required.
for (const taskId of [
  "HAND_HOUR_ROTATION",
  "DIRECTED_CLOCKWISE_SEPARATION",
  "DISPLAYED_FROM_ACTUAL_ELAPSED",
  "DERIVE_RATE_FROM_OBSERVATIONS",
  "DURATION_FOR_N_STRIKES",
  "MIRROR_FROM_ACTUAL",
  "TIME_AFTER_HANDS_INTERCHANGED",
] as const) {
  const question = generateClockQuestion({ taskId, seed: `CLK-DIFFICULTY-${taskId}`, correctOptionIndex: 1 });
  assert.equal(question.discoveryAudit.difficultyModel, "ITEM_LEVEL_V1");
  assert.equal(question.discoveryAudit.difficultyBaselineScore, CLOCK_DIFFICULTY_AUDIT[taskId].semanticScore);
  assert(question.discoveryAudit.difficultyItemScore >= question.discoveryAudit.difficultyBaselineScore);
  assert(question.discoveryAudit.difficultyFactors.length > 0);
  assert.equal(question.discoveryAudit.difficultyHumanCalibrationRequired, true);
  assert.equal(question.difficulty, expectedBand(question.discoveryAudit.difficultyItemScore));
  assert.equal(question.discoveryAudit.declaredSourceRegistrySaturationComplete, true);
  assert.equal(question.discoveryAudit.sourceSaturationComplete, false);
}

// The source-natural interchange baseline is Standard, but its exact 720/13 answer
// can legitimately make an individual generated item Advanced.
const interchange = generateClockQuestion({
  taskId: "TIME_AFTER_HANDS_INTERCHANGED",
  seed: "CLK-DIFFICULTY-INTERCHANGE-EXACT",
  correctOptionIndex: 0,
});
assert.equal(CLOCK_DIFFICULTY_AUDIT.TIME_AFTER_HANDS_INTERCHANGED.difficulty, "STANDARD");
assert.equal(interchange.difficulty, "ADVANCED");
assert(interchange.discoveryAudit.difficultyFactors.includes("FRACTIONAL_ANSWER"));
assert(interchange.discoveryAudit.difficultyFactors.includes("HIGH_DENOMINATOR_FRACTION"));

const summary = clockDifficultyAuditSummary();
assert.equal(summary.totalCandidateRows, 100);
assert(summary.coreCalibratedRows > 0);
assert(summary.foundationCoreRows > 0);
assert(summary.standardCoreRows > 0);
assert(summary.advancedCoreRows > 0);
assert(summary.heldRows > 0);
assert.equal(summary.internalRows, 1);

assert.equal(CLOCK_DIFFICULTY_POLICY.status, "SEMANTIC_DIFFICULTY_AUDIT_COMPLETE");
assert.equal(CLOCK_DIFFICULTY_POLICY.checkpointOrderUsedAsDifficultyProxy, false);
assert.equal(CLOCK_DIFFICULTY_POLICY.difficultyAuditComplete, true);
assert.equal(CLOCK_DIFFICULTY_POLICY.itemLevelHumanCalibrationStillRequired, true);
assert.equal(CLOCK_DIFFICULTY_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.status, "PROVISIONAL_ITEM_LEVEL_DIFFICULTY_CALIBRATION");
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.generatedItemFeaturesRequired, true);
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.humanCalibrationRequired, true);
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.permanentQlAllocationAllowed, false);

console.log(JSON.stringify({
  status: "PASS_CLK_001_SEMANTIC_PLUS_ITEM_LEVEL_DIFFICULTY_AUDIT",
  ...summary,
  itemPolicy: CLOCK_ITEM_DIFFICULTY_POLICY,
  semanticPolicy: CLOCK_DIFFICULTY_POLICY,
}, null, 2));
