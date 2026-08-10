import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_ITEM_DIFFICULTY_POLICY,
  CLOCK_TASK_CATALOG,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const bandCounts = { FOUNDATION: 0, STANDARD: 0, ADVANCED: 0 };
const factorCounts = new Map<string, number>();
const taskBands = new Map<string, Set<string>>();
let generated = 0;
let heldSentinels = 0;
let internalSentinels = 0;
let fractionalItems = 0;
let diagramItems = 0;

for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
  const [taskId] = CLOCK_TASK_CATALOG[taskIndex]!;
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId].disposition;
  const bands = new Set<string>();

  for (let seedIndex = 0; seedIndex < 50; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-ITEM-DIFFICULTY-${taskIndex}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });

    assert.equal(question.discoveryAudit.difficultyModel, "ITEM_LEVEL_V1");
    assert.equal(question.discoveryAudit.difficultyHumanCalibrationRequired, true);
    assert.equal(question.discoveryAudit.declaredSourceRegistrySaturationComplete, true);
    assert.equal(question.discoveryAudit.sourceSaturationComplete, false);
    assert.equal(question.discoveryAudit.authorityFrozen, false);
    assert.equal(question.discoveryAudit.permanentQlEligible, false);
    assert(question.discoveryAudit.difficultyBaselineScore >= 1);
    assert(question.discoveryAudit.difficultyItemScore >= question.discoveryAudit.difficultyBaselineScore ||
      question.discoveryAudit.difficultyItemScore === 99);
    assert(question.discoveryAudit.difficultyFactors.length > 0);

    if (disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
      assert.equal(question.difficulty, "ADVANCED");
      assert.deepEqual(question.discoveryAudit.difficultyFactors, ["ADVANCED_HOLD_SENTINEL"]);
      heldSentinels += 1;
    } else if (disposition === "INTERNAL_VERIFICATION_ONLY") {
      assert.equal(question.difficulty, "ADVANCED");
      assert.deepEqual(question.discoveryAudit.difficultyFactors, ["INTERNAL_ONLY_SENTINEL"]);
      internalSentinels += 1;
    } else {
      assert.notEqual(question.discoveryAudit.difficultyItemScore, 99);
    }

    if (question.discoveryAudit.difficultyFactors.includes("FRACTIONAL_ANSWER")) fractionalItems += 1;
    if (question.discoveryAudit.difficultyFactors.includes("OPTION_DIAGRAM_SELECTION") ||
        question.discoveryAudit.difficultyFactors.includes("PROMPT_DIAGRAM_INTERPRETATION")) diagramItems += 1;

    for (const factor of question.discoveryAudit.difficultyFactors) {
      factorCounts.set(factor, (factorCounts.get(factor) ?? 0) + 1);
    }
    bandCounts[question.difficulty] += 1;
    bands.add(question.difficulty);
    generated += 1;
  }
  taskBands.set(taskId, bands);
}

assert.equal(generated, CLOCK_TASK_CATALOG.length * 50);
assert(bandCounts.FOUNDATION > 0);
assert(bandCounts.STANDARD > 0);
assert(bandCounts.ADVANCED > 0);
assert(heldSentinels > 0);
assert.equal(internalSentinels, 50);
assert(fractionalItems > 0);
assert(diagramItems > 0);
assert((factorCounts.get("BASE_SEMANTIC_CLUSTER") ?? 0) > 0);
assert((factorCounts.get("MULTIPLE_EXACT_ANSWERS") ?? 0) > 0);
assert((factorCounts.get("INVERSE_QUERY") ?? 0) > 0);
assert((factorCounts.get("MULTI_CLOCK") ?? 0) > 0);

const handMotion = generateClockQuestion({
  taskId: "HAND_HOUR_ROTATION",
  seed: "CLK-DIFF-HAND-MOTION-FOUNDATION",
  locale: "en-IN",
  correctOptionIndex: 0,
});
assert.equal(handMotion.difficulty, "FOUNDATION");

const basicForwardFaulty = generateClockQuestion({
  taskId: "DISPLAYED_FROM_ACTUAL_ELAPSED",
  seed: "CLK-DIFF-FAULTY-FORWARD",
  locale: "en-IN",
  correctOptionIndex: 0,
});
assert.notEqual(basicForwardFaulty.difficulty, "FOUNDATION");

const twoClock = generateClockQuestion({
  taskId: "COMPARE_TWO_FAULTY_CLOCKS",
  seed: "CLK-DIFF-TWO-CLOCK",
  locale: "en-IN",
  correctOptionIndex: 0,
});
assert.equal(twoClock.difficulty, "ADVANCED");
assert(twoClock.discoveryAudit.difficultyFactors.includes("MULTI_CLOCK"));

const interchange = generateClockQuestion({
  taskId: "TIME_AFTER_HANDS_INTERCHANGED",
  seed: "CLK-DIFF-INTERCHANGE",
  locale: "en-IN",
  correctOptionIndex: 0,
});
assert.equal(interchange.difficulty, "ADVANCED");
assert(interchange.discoveryAudit.difficultyFactors.includes("FRACTIONAL_ANSWER"));
assert(interchange.discoveryAudit.difficultyFactors.includes("HIGH_DENOMINATOR_FRACTION"));

assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.status, "PROVISIONAL_ITEM_LEVEL_DIFFICULTY_CALIBRATION");
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.checkpointOrderUsedAsDifficultyProxy, false);
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.humanCalibrationRequired, true);
assert.equal(CLOCK_ITEM_DIFFICULTY_POLICY.permanentQlAllocationAllowed, false);

console.log(JSON.stringify({
  status: "PASS_CLK_001_ITEM_LEVEL_DIFFICULTY_CALIBRATION",
  generated,
  bandCounts,
  heldSentinels,
  internalSentinels,
  fractionalItems,
  diagramItems,
  factorCounts: Object.fromEntries([...factorCounts.entries()].sort()),
  tasksWithMultipleBands: [...taskBands.entries()]
    .filter(([, bands]) => bands.size > 1)
    .map(([taskId, bands]) => ({ taskId, bands: [...bands].sort() })),
  policy: CLOCK_ITEM_DIFFICULTY_POLICY,
}, null, 2));
