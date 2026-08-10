import type { TsdEditorialDifficulty } from "../editorial-contract";

export type TsdCp003CalibratedDifficultyLabel = "Easy" | "Medium" | "Hard";

const EASY_MODES = new Set([
  "timeGainLossFromSpeedChange",
  "scheduledArrivalTimeFromActualSpeed",
  "requiredRecoverySpeedAfterLostTime",
  "numberOfStopsFromOverallDelay",
  "delayFromRegularStops",
  "totalTimeWithRegularStops",
]);

const HARD_MODES = new Set([
  "usualSpeedFromEarlyLatePair",
  "speedChangePointDistance",
  "fractionOfRouteAtChangedSpeed",
  "walkingRidingAllocation",
]);

const CALIBRATION_RATIONALE: Readonly<Record<string, string>> = Object.freeze({
  timeGainLossFromSpeedChange: "Directly compare two travel times on the same route; one familiar TSD relation and a subtraction.",
  distanceFromSpeedTimeDifference: "Requires forming and solving the reciprocal-speed time-gap equation for the route distance.",
  speedFromFixedRouteTimeDifference: "Requires inverse reconstruction of an unknown speed, sometimes through a speed-ratio representation.",
  usualSpeedFromEarlyLatePair: "Requires combining early and late conditions, reconstructing route distance and scheduled time, then solving the on-time speed.",
  distanceFromEarlyLatePair: "Requires combining early and late amounts into a time gap and solving a reciprocal-speed distance equation.",
  scheduledArrivalTimeFromActualSpeed: "Compute one travel duration and add it to a stated clock time, including ordinary next-day rollover.",
  requiredRecoverySpeedAfterLostTime: "Direct remaining-distance divided by remaining-time recovery calculation.",
  requiredRemainingSpeedAfterPartialRoute: "Requires reconstructing time already spent, remaining time and remaining distance before solving the required speed.",
  stoppageDurationFromRunningAndOverallSpeed: "Requires comparing running time with overall elapsed time to isolate stoppage duration.",
  overallSpeedIncludingStops: "Requires converting running speed to running time, adding stoppage and recomputing overall speed.",
  runningSpeedFromOverallSpeedAndStops: "Requires reconstructing total time, removing stoppage and solving running speed.",
  numberOfStopsFromOverallDelay: "Direct discrete count from total delay and one-stop duration.",
  delayFromRegularStops: "Direct accumulated delay from stop count and one-stop duration.",
  restTimeInRepeatedTravelRestCycle: "Requires distinguishing travel cycles from rest events and isolating the rest component from total elapsed time.",
  totalTimeWithRegularStops: "Direct running-time plus accumulated stoppage with one off-by-one/count interpretation.",
  speedChangePointDistance: "Requires setting up and solving a two-segment linear time equation with an unknown change-point distance.",
  fractionOfRouteAtChangedSpeed: "Requires solving a two-speed segment allocation and then converting the requested distance share to a percentage.",
  lostTimeDurationFromScheduleRecovery: "Requires comparing usual and recovery journey times and combining recovered time with residual delay.",
  startTimeShiftForSameArrival: "Requires comparing old and new journey durations and interpreting the difference as an earlier/later departure shift.",
  arrivalShiftFromDepartureAndSpeedChanges: "Requires signed composition of a departure-time change with a speed-induced travel-time change before taking the requested magnitude.",
  walkingRidingAllocation: "Requires a two-speed simultaneous segment-allocation equation and then extracting the requested time or distance component.",
});

export function calibratedCp003DifficultyLabel(solveMode: string): TsdCp003CalibratedDifficultyLabel {
  if (EASY_MODES.has(solveMode)) return "Easy";
  if (HARD_MODES.has(solveMode)) return "Hard";
  if (solveMode in CALIBRATION_RATIONALE) return "Medium";
  throw new Error(`${solveMode}: CP-003 difficulty calibration is missing`);
}

export function calibrateCp003Difficulty(solveMode: string): TsdEditorialDifficulty {
  const label = calibratedCp003DifficultyLabel(solveMode);
  return Object.freeze({
    label,
    status: "EDITORIALLY_CALIBRATED" as const,
    featureScore: label === "Easy" ? 1 : label === "Medium" ? 2 : 4,
  });
}

export function cp003DifficultyRationale(solveMode: string): string {
  const rationale = CALIBRATION_RATIONALE[solveMode];
  if (!rationale) throw new Error(`${solveMode}: CP-003 difficulty rationale is missing`);
  return rationale;
}

export const TSD_CP003_DIFFICULTY_RUBRIC = Object.freeze({
  Easy: "One familiar TSD relation or direct discrete schedule operation, normally one main setup and at most one simple follow-up operation.",
  Medium: "Two or more linked operations, inverse reconstruction, elapsed-time decomposition, or signed schedule composition without a full simultaneous segment system.",
  Hard: "A genuinely multi-stage system: reconstructing both schedule state and speed, solving a two-segment allocation/equation, or extracting a secondary quantity after that system is solved.",
});
