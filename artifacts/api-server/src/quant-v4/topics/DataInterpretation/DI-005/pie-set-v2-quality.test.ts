import assert from "node:assert/strict";
import { generateDi005V2ReviewSet } from "./pie-set-v2-quality";
import { verifyDi005V2Question } from "./independent-verifier-v2";
import type { Di005V2ExamProfile } from "./pie-v2-types";

const profiles: readonly Di005V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
let checkedSets = 0;
let checkedQuestions = 0;
let countQualityChecks = 0;
let differenceQualityChecks = 0;
let hardRatioCalibrationChecks = 0;
let hardExcessCalibrationChecks = 0;
let hardAngleCalibrationChecks = 0;
let hardRemainderCalibrationChecks = 0;

for (const profile of profiles) {
  for (let index = 1; index <= 120; index += 1) {
    const seed = `DI005-V2-QUALITY-${String(index).padStart(3, "0")}`;
    const first = generateDi005V2ReviewSet({ seed, examProfile: profile });
    const replay = generateDi005V2ReviewSet({ seed, examProfile: profile });
    assert.deepEqual(first.questions, replay.questions, `${profile}/${seed} quality output is not deterministic.`);
    assert.equal(first.validation.valid, true, `${profile}/${seed} review-quality validation failed.`);
    checkedSets += 1;

    for (const question of first.questions) {
      checkedQuestions += 1;
      assert.equal(question.options.length, first.optionCount);
      assert.equal(new Set(question.options).size, first.optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(verifyDi005V2Question(first, question).valid, true);

      if (question.kind === "SECTOR_COUNT_FROM_TOTAL") {
        const targetIndex = Number(question.evidence.categoryIndex);
        const allowed = new Set(first.stimulus.slices.map((slice) => String((first.stimulus.totalValue * slice.percent) / 100)));
        for (const option of question.options) {
          assert.match(option, /^\d+$/u, `${profile}/${seed} sector-count option is not an integer: ${option}`);
          assert.ok(allowed.has(option), `${profile}/${seed} sector-count distractor is not another plausible sector count: ${option}`);
        }
        assert.ok(!question.optionMetadata.some((option) => option.misconceptionId === "TREAT_PERCENT_AS_ANGLE" || option.misconceptionId === "COPY_PERCENT_AS_COUNT"));
        assert.ok(targetIndex >= 0 && targetIndex < 5);
        countQualityChecks += 1;
      }

      if (question.kind === "DIFFERENCE_IN_COUNTS") {
        const step = first.stimulus.totalValue / 20;
        for (const option of question.options) {
          assert.match(option, /^\d+$/u, `${profile}/${seed} difference option is not an integer: ${option}`);
          assert.equal(Number(option) % step, 0, `${profile}/${seed} difference option does not sit on a plausible five-percent count step: ${option}`);
        }
        assert.ok(!question.optionMetadata.some((option) => option.misconceptionId === "USE_PERCENT_GAP_AS_COUNT"));
        differenceQualityChecks += 1;
      }

      if (question.kind === "RATIO_OF_TWO_SECTORS") {
        const hidden = first.stimulus.hiddenPercentIndex;
        const firstIndex = Number(question.evidence.firstIndex);
        const secondIndex = Number(question.evidence.secondIndex);
        assert.ok(firstIndex === hidden || secondIndex === hidden, `${profile}/${seed} Hard ratio does not require the hidden sector.`);
        assert.match(question.explanation.steps[0] ?? "", /100%/u, `${profile}/${seed} Hard ratio explanation does not recover the missing share first.`);
        hardRatioCalibrationChecks += 1;
      }

      if (question.kind === "RELATIVE_SECTOR_PERCENT_EXCESS") {
        const hidden = first.stimulus.hiddenPercentIndex;
        const largerIndex = Number(question.evidence.largerIndex);
        const smallerIndex = Number(question.evidence.smallerIndex);
        assert.ok(largerIndex === hidden || smallerIndex === hidden, `${profile}/${seed} Hard relative-excess task does not require the hidden sector.`);
        assert.match(question.explanation.steps[0] ?? "", /100%/u, `${profile}/${seed} Hard relative-excess explanation does not recover the missing share first.`);
        hardExcessCalibrationChecks += 1;
      }

      if (question.kind === "COMBINED_SECTOR_ANGLE") {
        const hidden = first.stimulus.hiddenPercentIndex;
        const firstIndex = Number(question.evidence.firstIndex);
        const secondIndex = Number(question.evidence.secondIndex);
        assert.ok(firstIndex === hidden || secondIndex === hidden, `${profile}/${seed} Hard combined-angle task does not require the hidden sector.`);
        assert.match(question.explanation.steps[0] ?? "", /100%/u, `${profile}/${seed} Hard combined-angle explanation does not recover the missing share first.`);
        hardAngleCalibrationChecks += 1;
      }

      if (question.kind === "REMAINDER_AFTER_TWO_SECTORS_COUNT") {
        const hidden = first.stimulus.hiddenPercentIndex;
        const firstIndex = Number(question.evidence.firstIndex);
        const secondIndex = Number(question.evidence.secondIndex);
        assert.ok(firstIndex === hidden || secondIndex === hidden, `${profile}/${seed} Hard remainder-count task does not require the hidden sector.`);
        assert.match(question.explanation.steps[0] ?? "", /100%/u, `${profile}/${seed} Hard remainder-count explanation does not recover the missing share first.`);
        const excludedPercent = first.stimulus.slices[firstIndex]!.percent + first.stimulus.slices[secondIndex]!.percent;
        assert.notEqual(excludedPercent, 50, `${profile}/${seed} Hard remainder-count used a 50/50 complement state.`);
        hardRemainderCalibrationChecks += 1;
      }
    }
  }
}

assert.ok(countQualityChecks >= 30, `Expected substantial sector-count coverage, saw ${countQualityChecks}.`);
assert.ok(differenceQualityChecks >= 30, `Expected substantial difference-count coverage, saw ${differenceQualityChecks}.`);
assert.ok(hardRatioCalibrationChecks >= 30, `Expected substantial calibrated Hard ratio coverage, saw ${hardRatioCalibrationChecks}.`);
assert.ok(hardExcessCalibrationChecks >= 30, `Expected substantial calibrated Hard relative-excess coverage, saw ${hardExcessCalibrationChecks}.`);
assert.ok(hardAngleCalibrationChecks >= 30, `Expected substantial calibrated Hard combined-angle coverage, saw ${hardAngleCalibrationChecks}.`);
assert.ok(hardRemainderCalibrationChecks >= 30, `Expected substantial calibrated Hard remainder-count coverage, saw ${hardRemainderCalibrationChecks}.`);

console.log(JSON.stringify({
  status: "PASS_DI_005_PIE_V2_LEARNER_QUALITY",
  checkedSets,
  checkedQuestions,
  countQualityChecks,
  differenceQualityChecks,
  hardRatioCalibrationChecks,
  hardExcessCalibrationChecks,
  hardAngleCalibrationChecks,
  hardRemainderCalibrationChecks,
}));
