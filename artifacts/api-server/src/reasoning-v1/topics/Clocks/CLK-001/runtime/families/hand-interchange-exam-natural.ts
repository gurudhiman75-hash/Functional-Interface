import {
  compareRationals,
  exactRational,
  findHandInterchangePairsExact,
  rationalsEqual,
  subtractRationals,
} from "../../../../../foundation/temporal";
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import { formatDurationSeconds, rationalAnswer } from "../utils";

const SOURCE_NATURAL_INTERCHANGE_DURATION_SECONDS = exactRational(43_200, 13);

function sourcePairVerifierDuration() {
  const fivePm = exactRational(5 * 3_600);
  const sixPm = exactRational(6 * 3_600);
  const oneHour = exactRational(3_600);
  const pair = findHandInterchangePairsExact().find((candidate) => {
    if (compareRationals(candidate.originalSeconds, fivePm) < 0) return false;
    if (compareRationals(candidate.originalSeconds, sixPm) >= 0) return false;
    const elapsed = subtractRationals(candidate.candidateSeconds, candidate.originalSeconds);
    return compareRationals(elapsed, 0) > 0 && compareRationals(elapsed, oneHour) < 0;
  });
  if (!pair) {
    throw new Error("No exact physical hand-interchange pair exists in the sourced 5-to-6 p.m. window.");
  }
  return subtractRationals(pair.candidateSeconds, pair.originalSeconds);
}

export function solveExamNaturalHandInterchangeFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (input.taskId !== "TIME_AFTER_HANDS_INTERCHANGED") return null;

  const verifierDuration = sourcePairVerifierDuration();
  if (!rationalsEqual(verifierDuration, SOURCE_NATURAL_INTERCHANGE_DURATION_SECONDS)) {
    throw new Error("Source-natural hand-interchange duration disagrees with the exact physical-pair verifier.");
  }

  const answer = rationalAnswer(
    "DURATION",
    SOURCE_NATURAL_INTERCHANGE_DURATION_SECONDS,
    "55 5/13 minutes",
  );
  const verifierAnswer = rationalAnswer(
    "DURATION",
    verifierDuration,
    "55 5/13 minutes",
  );

  const coincidenceTrap = exactRational(43_200, 11);
  const stationaryHourHandTrap = exactRational(3_600);
  const wrongCombinedRateTrap = exactRational(21_600, 7);

  return {
    taskId: input.taskId,
    stem: "A person leaves home sometime between 5 p.m. and 6 p.m. and returns less than one hour later. On return, the hour and minute hands are exactly interchanged from their positions at departure. For how long was the person away?",
    scenario: {
      departureWindow: "5 p.m. to 6 p.m.",
      returnConstraint: "less than one hour later",
      relation: "HANDS_EXACTLY_INTERCHANGED",
      sourceNaturalModel: true,
    },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: rationalAnswer("DURATION", coincidenceTrap, "65 5/11 minutes"),
        reasonCode: "COINCIDENCE_RELATIVE_SPEED_USED",
        reason: "This uses the 5.5 degrees-per-minute relative speed for coincidence. Interchange requires the two hands' movements to add to one full turn, not their separation to close.",
      },
      {
        answer: rationalAnswer("DURATION", stationaryHourHandTrap, "60 minutes"),
        reasonCode: "HOUR_HAND_TREATED_STATIONARY",
        reason: "This lets only the minute hand move through 360 degrees and ignores the hour hand's continuous 0.5 degree-per-minute movement.",
      },
      {
        answer: rationalAnswer("DURATION", wrongCombinedRateTrap, "51 3/7 minutes"),
        reasonCode: "HOUR_HAND_RATE_DOUBLED",
        reason: "This incorrectly uses a combined rate of 7 degrees per minute instead of the exact 6.5 degrees per minute.",
      },
    ],
    explanation: {
      given: "The hands are exactly interchanged between departure and return, and the elapsed time is less than one hour.",
      rule: "For the first interchange within one hour, the movement of the minute hand plus the movement of the hour hand totals one full 360-degree turn.",
      working: [
        "Minute-hand speed = 6 degrees per minute; hour-hand speed = 0.5 degree per minute.",
        "Combined movement = (6 + 0.5)t = 6.5t degrees.",
        "6.5t = 360, so t = 360 / 6.5 = 720/13 minutes = 55 5/13 minutes.",
      ],
      validityCheck: "An independent exact physical-pair search finds an interchange pair between 5 and 6 p.m. with the same elapsed duration.",
      closestTrap: "Do not use 5.5 degrees per minute here; that relative speed is for one hand catching the other, not for exchanging their two positions.",
      answer: answer.display,
    },
    canonicalTrace: ["combinedRate=13/2 deg/min", "duration=360/(13/2)=720/13 min=43200/13 sec"],
    verifierTrace: [`exactPairElapsed=${verifierDuration.numerator}/${verifierDuration.denominator} sec`],
    solveTraceExtras: {
      sourceNaturalCalibration: true,
      handInterchangeDurationMinutes: "720/13",
    },
    contractEvidence: {
      expectedAnswerKind: "DURATION",
      oracleName: "CP013_SOURCE_NATURAL_INTERCHANGE_DURATION_ORACLE",
      visibleStemTokens: ["between 5 p.m. and 6 p.m.", "less than one hour later", "exactly interchanged", "how long"],
    },
  };
}
