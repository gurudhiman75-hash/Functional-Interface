import {
  addRationals,
  exactRational,
  multiplyRationals,
  subtractRationals,
} from "../../../../foundation/temporal";
import type { SolvedClockPrototype } from "./solver-types";
import {
  formatAngle,
  formatDurationSeconds,
  rationalAnswer,
  timeAnswer,
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

  if (solved.taskId === "ERROR_AFTER_ACTUAL_DURATION") {
    const dailyErrorMinutes = solved.scenario.errorMinutesPerDay;
    const actualHours = solved.scenario.actualHours;
    if (typeof dailyErrorMinutes !== "number" || typeof actualHours !== "number") return solved;
    const fullDayError = exactRational(dailyErrorMinutes * 60);
    const inverseScaledError = exactRational(dailyErrorMinutes * 60 * 24, actualHours);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: rationalAnswer(
            "DURATION",
            fullDayError,
            formatDurationSeconds(fullDayError),
          ),
          reasonCode: "FULL_DAY_ERROR_USED_FOR_PARTIAL_DURATION",
          reason: "This applies the complete 24-hour gain or loss even though the stated actual duration may be only part of a day.",
        },
        {
          answer: rationalAnswer(
            "DURATION",
            inverseScaledError,
            formatDurationSeconds(inverseScaledError),
          ),
          reasonCode: "ACTUAL_DURATION_PROPORTION_INVERTED",
          reason: "This inverts the elapsed-time proportion and scales the daily error by 24 divided by the stated hours.",
        },
      ],
    };
  }

  if (solved.taskId === "COMPARE_TWO_FAULTY_CLOCKS") {
    const leftInitialAhead = solved.scenario.leftInitialAhead;
    const rightInitialBehind = solved.scenario.rightInitialBehind;
    const leftDailyGain = solved.scenario.leftDailyGain;
    const rightDailyLoss = solved.scenario.rightDailyLoss;
    if (
      typeof leftInitialAhead !== "number" ||
      typeof rightInitialBehind !== "number" ||
      typeof leftDailyGain !== "number" ||
      typeof rightDailyLoss !== "number"
    ) return solved;
    const initialSeparation = leftInitialAhead + rightInitialBehind;
    const dailySeparation = leftDailyGain + rightDailyLoss;
    const halfDaySeparation = exactRational((initialSeparation * 2 + dailySeparation) * 30);
    const twoDaySeparation = exactRational((initialSeparation + 2 * dailySeparation) * 60);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: rationalAnswer(
            "DURATION",
            halfDaySeparation,
            formatDurationSeconds(halfDaySeparation),
          ),
          reasonCode: "TWELVE_HOUR_DRIFT_USED_FOR_TWENTY_FOUR_HOURS",
          reason: "This accumulates only half a day's extra separation although the question asks for the readings after 24 actual hours.",
        },
        {
          answer: rationalAnswer(
            "DURATION",
            twoDaySeparation,
            formatDurationSeconds(twoDaySeparation),
          ),
          reasonCode: "DAILY_DRIFT_APPLIED_TWICE",
          reason: "This counts two full days of gain and loss instead of the single 24-hour interval stated in the question.",
        },
      ],
    };
  }

  if (solved.taskId === "MIRROR_FROM_ACTUAL") {
    const correct = exactAnswerValue(solved);
    if (!correct) return solved;
    const oneMinuteEarly = subtractRationals(correct, 60);
    const oneHourLate = addRationals(correct, 3_600);
    return {
      ...solved,
      distractors: [
        ...solved.distractors,
        {
          answer: timeAnswer(oneMinuteEarly),
          reasonCode: "MIRROR_BORROWING_ERROR_ONE_MINUTE_EARLY",
          reason: "This makes a one-minute borrowing error while subtracting the actual time from the 12:00 mirror reference.",
        },
        {
          answer: timeAnswer(oneHourLate),
          reasonCode: "MIRROR_REFERENCE_SHIFTED_ONE_HOUR",
          reason: "This shifts the correct mirror reading by one hour after the 12-hour complement has already been applied.",
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
