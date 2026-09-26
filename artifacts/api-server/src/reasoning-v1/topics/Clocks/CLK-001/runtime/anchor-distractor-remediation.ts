import {
  addRationals,
  exactRational,
  multiplyRationals,
} from "../../../../foundation/temporal";
import type { SolvedClockPrototype } from "./solver-types";
import {
  formatAngle,
  rationalAnswer,
} from "./utils";

function exactAnswerValue(solved: SolvedClockPrototype) {
  const value = solved.answer.exactValue;
  return value
    ? exactRational(BigInt(value.numerator), BigInt(value.denominator))
    : null;
}

/**
 * Some otherwise good misconception candidates can collapse onto the correct
 * answer for particular values. Add a task-owned supplement before the generic
 * makeOptions fallback is allowed to run, so learner anchors keep three named
 * clock misconceptions rather than arbitrary arithmetic fillers.
 */
export function remediateAnchorDistractors(
  solved: SolvedClockPrototype,
): SolvedClockPrototype {
  if (solved.taskId === "HAND_HOUR_ROTATION") {
    const correct = exactAnswerValue(solved);
    if (!correct) return solved;
    const oneDegreePerMinute = multiplyRationals(correct, 2);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: rationalAnswer(
            "ANGLE",
            oneDegreePerMinute,
            formatAngle(oneDegreePerMinute),
          ),
          reasonCode: "HOUR_HAND_RATE_AS_ONE_DEGREE_PER_MINUTE",
          reason: "This treats the hour hand as moving 1° per minute instead of its correct 0.5° per minute rate.",
        },
      ],
    };
  }

  if (solved.taskId === "SMALLER_ANGLE_AT_TIME") {
    const correct = exactAnswerValue(solved);
    if (!correct) return solved;
    const oneHourSpaceAdded = addRationals(correct, 30);
    const twoHourSpacesAdded = addRationals(correct, 60);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: rationalAnswer(
            "ANGLE",
            oneHourSpaceAdded,
            formatAngle(oneHourSpaceAdded),
          ),
          reasonCode: "ONE_HOUR_SPACE_ADDED_TO_SMALLER_ANGLE",
          reason: "This adds one 30-degree hour space after the hand separation has already been calculated.",
        },
        {
          answer: rationalAnswer(
            "ANGLE",
            twoHourSpacesAdded,
            formatAngle(twoHourSpacesAdded),
          ),
          reasonCode: "TWO_HOUR_SPACES_ADDED_TO_SMALLER_ANGLE",
          reason: "This adds two extra hour spaces to the exact hand separation without support from the stated time.",
        },
      ],
    };
  }

  if (solved.taskId === "DERIVE_RATE_FROM_OBSERVATIONS") {
    const finalSlowMinutes = solved.scenario.finalSlowMinutes;
    if (typeof finalSlowMinutes !== "number") return solved;
    const finalErrorAsDailyLoss = exactRational(1_440 - finalSlowMinutes, 1_440);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: rationalAnswer(
            "RATE",
            finalErrorAsDailyLoss,
            `${finalErrorAsDailyLoss.numerator}:${finalErrorAsDailyLoss.denominator}`,
          ),
          reasonCode: "FINAL_TOTAL_ERROR_TREATED_AS_DAILY_LOSS",
          reason: "This treats the clock's entire final slow amount as the loss accumulated during the 24-hour observation, instead of subtracting the initial slow amount first.",
        },
      ],
    };
  }

  return solved;
}
