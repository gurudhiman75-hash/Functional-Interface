import { DI003_V2_PROHIBITED_PERCENT_MISCONCEPTIONS, generateDi003GroupedBarV2ReviewSet } from "./grouped-bar-set-v2-review";
import type { Di003V2ExamProfile } from "./grouped-bar-v2-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parsePercent(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)%$/u);
  return match ? Number(match[1]) : null;
}

const profiles: readonly Di003V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
let sets = 0;
let questions = 0;
let percentageQuestions = 0;
let optionChecks = 0;

for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
  for (const examProfile of profiles) {
    const set = generateDi003GroupedBarV2ReviewSet({ seed: `DI-003-V2-DISTRACTOR-${seedIndex}`, examProfile });
    assert(set.questions.length === 5, `${examProfile} seed ${seedIndex} lost the five-question set contract.`);

    for (const question of set.questions) {
      assert(question.options.length === set.optionCount, `${question.questionId} has the wrong option count.`);
      assert(new Set(question.options).size === question.options.length, `${question.questionId} contains duplicate options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} lost answer binding.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} lost correct-option metadata.`);
      assert(
        question.optionMetadata.every((option) => !DI003_V2_PROHIBITED_PERCENT_MISCONCEPTIONS.includes(option.misconceptionId as never)),
        `${question.questionId} retained an implausible percentage misconception.`,
      );

      if (
        question.kind === "PERCENT_CHANGE_WITHIN_SERIES" ||
        question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL" ||
        question.kind === "TOTAL_SERIES_PERCENT_EXCESS"
      ) {
        percentageQuestions += 1;
        for (const option of question.options) {
          const value = parsePercent(option);
          assert(value !== null && Number.isFinite(value) && value > 0, `${question.questionId} has a malformed percentage option: ${option}.`);
          assert(!/\d+\.\d+/u.test(option), `${question.questionId} has a decimal percentage option after the whole-number policy: ${option}.`);
          if (question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL") {
            assert(value <= 100, `${question.questionId} has an impossible category-share option above 100%: ${option}.`);
          }
          optionChecks += 1;
        }
      }
      questions += 1;
    }
    sets += 1;
  }
}

assert(sets === 240 && questions === 1200, `Unexpected distractor qualification size: ${sets} sets / ${questions} questions.`);
assert(percentageQuestions >= 200, `Percentage-family coverage is unexpectedly low: ${percentageQuestions}.`);

console.log(JSON.stringify({
  status: "PASS_DI_003_V3_WHOLE_PERCENT_DISTRACTOR_PLAUSIBILITY",
  sets,
  questions,
  percentageQuestions,
  optionChecks,
  prohibitedMisconceptions: DI003_V2_PROHIBITED_PERCENT_MISCONCEPTIONS,
}));
