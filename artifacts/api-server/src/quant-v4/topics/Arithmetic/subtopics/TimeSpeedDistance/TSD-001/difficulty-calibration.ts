import type {
  TsdDifficultyLabel,
  TsdEditorialDifficulty,
} from "./editorial-contract";

const EASY_MODES = new Set([
  "distanceFromSpeedAndTime",
  "speedFromDistanceAndTime",
  "timeFromDistanceAndSpeed",
  "convertSpeedUnit",
  "convertDistanceUnit",
  "convertTimeUnit",
  "arrivalClockTime",
  "departureClockTime",
  "compareDistancesAtEqualTime",
  "compareTimesAtEqualDistance",
  "compareSpeedsAtEqualTime",
  "distanceByProportion",
  "timeByProportion",
  "speedByProportion",
  "speedFromPace",
  "paceFromSpeed",
  "roundTripTimeFromOneWayDistance",
  "totalDistanceFromAverageAndTime",
]);

const HARD_MODES = new Set([
  "unknownSegmentDistanceFromAverage",
  "segmentAllocationFromTotalsAndSpeeds",
  "segmentRatioFromAverageAndSpeeds",
  "requiredRemainingSpeedForTargetAverage",
]);

/**
 * Legacy score-only helper kept for compatibility with old proof code.
 * New learner output must use examDifficultyLabel(), which considers the
 * actual question family rather than counting operations alone.
 */
export function calibratedDifficultyLabel(featureScore: number): TsdDifficultyLabel {
  if (!Number.isInteger(featureScore) || featureScore < 1) {
    throw new Error(`Invalid TSD difficulty feature score: ${featureScore}`);
  }
  if (featureScore === 1) return "Easy";
  if (featureScore <= 3) return "Medium";
  return "Hard";
}

export function examDifficultyLabel(
  solveMode: string,
  input?: unknown,
): TsdDifficultyLabel {
  if (EASY_MODES.has(solveMode)) return "Easy";

  if (solveMode === "unknownSegmentShareFromAverage") {
    const shareKind = (input as { readonly shareKind?: string } | undefined)?.shareKind;
    return shareKind === "DISTANCE" ? "Hard" : "Medium";
  }

  if (solveMode === "compareSegmentedJourneyPlans") {
    const candidate = input as {
      readonly planA?: readonly unknown[];
      readonly planB?: readonly unknown[];
    } | undefined;
    const legs = (candidate?.planA?.length ?? 0) + (candidate?.planB?.length ?? 0);
    return legs >= 6 ? "Hard" : "Medium";
  }

  if (HARD_MODES.has(solveMode)) return "Hard";
  return "Medium";
}

export function calibrateTsdDifficulty(
  difficulty: TsdEditorialDifficulty,
  solveMode?: string,
  input?: unknown,
): TsdEditorialDifficulty {
  const label = solveMode
    ? examDifficultyLabel(solveMode, input)
    : calibratedDifficultyLabel(difficulty.featureScore);
  return Object.freeze({
    label,
    status: "EDITORIALLY_CALIBRATED" as const,
    featureScore: difficulty.featureScore,
  });
}
