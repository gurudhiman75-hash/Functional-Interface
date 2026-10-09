import {
  absRational,
  add,
  compare,
  divide,
  modulo,
  multiply,
  rational,
  subtract,
  toCanonicalString,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp012ExecutableSolution, TsdCp012Stage, TsdCp012TimedStage } from "./executable-types";
import type { TsdCp012ReviewInput } from "./english-review-final";
import {
  buildTsdCp012ScalarDistractors as buildLegacyScalarDistractors,
  buildTsdCp012SetDistractors,
  type TsdCp012ScalarDistractor,
} from "./question-studio-distractors";

export { buildTsdCp012SetDistractors };
export type { TsdCp012ScalarDistractor, TsdCp012SetDistractor } from "./question-studio-distractors";

const ZERO = rational(0);
const ONE = rational(1);
const TWO = rational(2);
const THREE = rational(3);
const q = (value: number | bigint): Rational => rational(value);
const sum = (values: readonly Rational[]): Rational => values.reduce((total, value) => add(total, value), ZERO);
const timedDistance = (stage: TsdCp012TimedStage): Rational => multiply(stage.speed, stage.duration);
const stageTime = (stage: TsdCp012Stage): Rational => divide(stage.distance, stage.speed);
const routeTime = (route: { readonly segments: readonly TsdCp012Stage[] }): Rational => sum(route.segments.map(stageTime));

function c(id: string, calculation: string, value: Rational): TsdCp012ScalarDistractor {
  return Object.freeze({ kind: "SCALAR" as const, misconceptionId: id, calculation, value });
}

function pickScalar(
  correct: Rational,
  candidates: readonly TsdCp012ScalarDistractor[],
  context: string,
): readonly TsdCp012ScalarDistractor[] {
  const seen = new Set<string>([toCanonicalString(correct)]);
  const picked: TsdCp012ScalarDistractor[] = [];
  for (const candidate of candidates) {
    if (compare(candidate.value, ZERO) < 0) continue;
    const key = toCanonicalString(candidate.value);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(candidate);
    if (picked.length === 3) break;
  }
  if (picked.length !== 3) throw new Error(`CP012 expanded distractor engine produced only ${picked.length} unique scalar wrong paths for ${context}`);
  return Object.freeze(picked);
}

function expandedCandidates(
  input: TsdCp012ReviewInput,
  solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>,
): readonly TsdCp012ScalarDistractor[] | null {
  if (input.authorityKey === "discreteSpeedProgramState" && input.target === "PERIODIC_DISTANCE") {
    const cycleDistance = sum(input.cycle.map(timedDistance));
    const partialDistance = sum(input.partialStages.map(timedDistance));
    const fullCycleDistance = multiply(q(input.fullCycles), cycleDistance);
    return [
      c("TERMINAL_PARTIAL_CYCLE_OMITTED", "Count only the completed full cycles and ignore the terminal partial cycle.", fullCycleDistance),
      c("PARTIAL_CYCLE_PROMOTED_TO_FULL", "Treat the terminal partial cycle as one additional complete cycle.", multiply(q(input.fullCycles + 1), cycleDistance)),
      c("ONLY_ONE_FULL_CYCLE_PLUS_PARTIAL", "Use one full cycle plus the terminal partial cycle instead of all completed cycles.", add(cycleDistance, partialDistance)),
      c("PARTIAL_DISTANCE_ONLY", "Report only the distance covered in the terminal partial cycle.", partialDistance),
      c("ONE_EXTRA_CYCLE_AFTER_PARTIAL", "Add one complete cycle after correctly counting the full cycles and terminal partial sequence.", add(add(fullCycleDistance, partialDistance), cycleDistance)),
      c("PARTIAL_SEQUENCE_COUNTED_TWICE", "Count the terminal partial sequence twice after the completed full cycles.", add(fullCycleDistance, multiply(TWO, partialDistance))),
    ];
  }

  if (input.authorityKey === "terminalConstraintProgramState" && input.target === "MAXIMUM_DELAY") {
    const travelTime = divide(input.distance, input.speed);
    return [
      c("TRAVEL_TIME_REPORTED_AS_DELAY", "Report the travel time itself instead of the spare time before departure.", travelTime),
      c("TRAVEL_TIME_IGNORED", "Treat the entire arrival window as allowable departure delay.", input.arrivalDeadline),
      c("HALF_TRAVEL_TIME_SUBTRACTED", "Subtract only half of the required travel time from the deadline.", subtract(input.arrivalDeadline, divide(travelTime, TWO))),
      c("DEADLINE_AND_TRAVEL_TIME_ADDED", "Add travel time to the arrival deadline instead of subtracting it.", add(input.arrivalDeadline, travelTime)),
      c("HALF_DEADLINE_USED_AS_DELAY", "Treat half of the complete arrival window as the allowable departure delay.", divide(input.arrivalDeadline, TWO)),
      c("DOUBLE_TRAVEL_TIME_SUBTRACTED", "Reserve twice the true travel time before allowing any departure delay.", subtract(input.arrivalDeadline, multiply(TWO, travelTime))),
    ];
  }

  if (input.authorityKey === "terminalConstraintProgramState" && input.target === "MINIMUM_SPEED") {
    return [
      c("AVAILABLE_TIME_DOUBLED", "Allow twice the stated available time before computing the minimum speed.", divide(input.distance, multiply(input.availableTime, TWO))),
      c("ONE_EXTRA_TIME_UNIT_ALLOWED", "Add one extra time unit to the deadline before computing speed.", divide(input.distance, add(input.availableTime, ONE))),
      c("DISTANCE_AND_TIME_SWAPPED", "Invert the distance-over-time relation.", divide(input.availableTime, input.distance)),
      c("TIME_HALVED", "Use only half of the available time and therefore demand an unnecessarily high speed.", divide(input.distance, divide(input.availableTime, TWO))),
      c("TRIPLE_TIME_ALLOWED", "Allow three times the stated deadline before computing the required speed.", divide(input.distance, multiply(input.availableTime, THREE))),
      c("DISTANCE_DOUBLED", "Treat the route as twice its stated length while keeping the same deadline.", divide(multiply(input.distance, TWO), input.availableTime)),
    ];
  }

  if (input.authorityKey === "routeProfileProgramState" && input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") {
    const routeA = routeTime(input.routeA);
    const routeB = routeTime(input.routeB);
    const difference = absRational(subtract(routeA, routeB));
    return [
      c("ROUTE_A_TIME_REPORTED", "Report Route A's complete travel time instead of the difference between routes.", routeA),
      c("ROUTE_B_TIME_REPORTED", "Report Route B's complete travel time instead of the difference between routes.", routeB),
      c("ROUTE_TIMES_ADDED", "Add the two route times instead of taking their absolute difference.", add(routeA, routeB)),
      c("SIGNED_DIFFERENCE_WITH_EXTRA_UNIT", "Take the route-time difference and then incorrectly add one extra time unit.", add(difference, ONE)),
      c("DIFFERENCE_SHARED_EQUALLY", "Divide the route-time difference by two as if both routes shared the gap equally.", divide(difference, TWO)),
      c("DOUBLE_DIFFERENCE_REPORTED", "Count the route-time gap once for each route and therefore report twice the true difference.", multiply(TWO, difference)),
    ];
  }

  if (input.authorityKey === "motionReconstructionProgramState" && input.target === "MISSING_STAGE_DISTANCE") {
    const knownTime = stageTime(input.knownStage);
    return [
      c("KNOWN_STAGE_TIME_NOT_REMOVED", "Use the missing-stage speed for the entire trip time.", multiply(input.missingSpeed, input.totalTime)),
      c("KNOWN_STAGE_DISTANCE_REPORTED", "Report the known stage's distance as the missing stage distance.", input.knownStage.distance),
      c("MISSING_SPEED_APPLIED_TO_KNOWN_TIME", "Apply the missing-stage speed to the known stage's time.", multiply(input.missingSpeed, knownTime)),
      c("TOTAL_DISTANCE_REPORTED", "Report the full itinerary distance instead of the missing stage distance.", input.totalDistance),
      c("KNOWN_AND_MISSING_STAGE_DISTANCES_ADDED", "Add the known stage distance to the distance implied by the missing-stage speed over the known-stage time.", add(input.knownStage.distance, multiply(input.missingSpeed, knownTime))),
      c("KNOWN_STAGE_DISTANCE_DOUBLED", "Assume both stages cover the same distance as the known stage.", multiply(TWO, input.knownStage.distance)),
    ];
  }

  if (input.authorityKey === "mediumPursuitSynthesisState" && input.target === "DROPPED_OBJECT_RECOVERY_DISTANCE") {
    const driftDuringDelay = multiply(input.currentSpeed, input.detectionDelay);
    const stillWaterDelayDistance = multiply(input.boatStillWaterSpeed, input.detectionDelay);
    return [
      c("ONE_WAY_DRIFT_ONLY", "Count only the object's drift during the detection delay and omit the return-pursuit interval.", driftDuringDelay),
      c("BOAT_STILL_WATER_SPEED_USED_FOR_DRIFT", "Use the boat's still-water speed as if it were the floating object's drift speed.", stillWaterDelayDistance),
      c("DOWNSTREAM_BOAT_GROUND_SPEED_USED", "Use boat speed plus current for the object's displacement during the detection delay.", multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.detectionDelay)),
      c("UPSTREAM_BOAT_GROUND_SPEED_USED", "Use boat speed minus current as the object's drift speed.", multiply(subtract(input.boatStillWaterSpeed, input.currentSpeed), input.detectionDelay)),
      c("BOAT_ROUND_TRIP_AT_STILL_WATER_SPEED", "Use twice the boat's still-water distance during the detection interval as the recovery displacement.", multiply(TWO, stillWaterDelayDistance)),
      c("DOWNSTREAM_BOAT_DISTANCE_PLUS_OBJECT_DRIFT", "Add the downstream boat distance during the delay to one extra interval of object drift.", multiply(add(input.boatStillWaterSpeed, multiply(TWO, input.currentSpeed)), input.detectionDelay)),
    ];
  }

  if (input.authorityKey === "closedTrackRaceSynthesisState" && input.target === "FIRST_OVERTAKE_TIME") {
    const relativeSpeed = subtract(input.fasterSpeed, input.slowerSpeed);
    const wrappedHeadStart = modulo(input.slowerHeadStart, input.trackLength);
    const effectiveGap = compare(wrappedHeadStart, ZERO) === 0 ? input.trackLength : wrappedHeadStart;
    const complementaryGap = subtract(input.trackLength, wrappedHeadStart);
    return [
      c("OPPOSITE_DIRECTION_RATE", "Use the speed sum for a same-direction overtake while keeping the effective forward gap.", divide(effectiveGap, add(input.fasterSpeed, input.slowerSpeed))),
      c("FASTER_SPEED_ALONE", "Close the effective gap using only the faster runner's speed instead of relative speed.", divide(effectiveGap, input.fasterSpeed)),
      c("SLOWER_SPEED_AS_CLOSING_RATE", "Treat the slower runner's speed as the closing rate.", divide(effectiveGap, input.slowerSpeed)),
      c("COMPLEMENTARY_GAP", "Use the complementary track arc instead of the forward gap that must actually be gained.", divide(complementaryGap, relativeSpeed)),
      c("ONE_EXTRA_LAP_BEFORE_OVERTAKE", "Require the faster runner to gain one additional full lap beyond the actual overtake gap.", divide(add(effectiveGap, input.trackLength), relativeSpeed)),
      c("TWO_EXTRA_LAPS_BEFORE_OVERTAKE", "Require two unnecessary additional full laps before calling the first pass an overtake.", divide(add(effectiveGap, multiply(TWO, input.trackLength)), relativeSpeed)),
      c("FULL_LAP_AT_FASTER_SPEED", "Use one full track length divided by the faster runner's own speed.", divide(input.trackLength, input.fasterSpeed)),
    ];
  }

  if (input.authorityKey === "movingSurfaceScheduleSynthesisState" && input.target === "UNKNOWN_ACTIVE_TIME_BEFORE_STOP") {
    const combinedRate = add(input.personRate, input.surfaceRate);
    const extraDistanceNeeded = subtract(input.length, multiply(input.personRate, input.totalTime));
    return [
      c("SURFACE_ASSUMED_ACTIVE_WHOLE_TRIP", "Assume the moving surface remains active for the whole crossing and compute the full crossing time at combined speed.", divide(input.length, combinedRate)),
      c("PERSON_RATE_OMITTED_FROM_BASE_DISTANCE", "Attribute the entire route length to the surface's contribution before solving for active time.", divide(input.length, input.surfaceRate)),
      c("COMBINED_RATE_USED_FOR_EXTRA_DISTANCE", "Divide the surface-only extra distance by person-plus-surface speed instead of the surface rate.", divide(extraDistanceNeeded, combinedRate)),
      c("INACTIVE_TIME_REPORTED", "Report the time after the surface stops instead of the time for which it was active.", subtract(input.totalTime, solution.answer)),
      c("TOTAL_CROSSING_TIME_REPORTED", "Report the complete crossing time as if it were the surface-active duration.", input.totalTime),
      c("SURFACE_IGNORED_FOR_FULL_CROSSING", "Use the person's walking time for the full length as the supposed surface-active duration.", divide(input.length, input.personRate)),
    ];
  }

  return null;
}

export function buildTsdCp012ScalarDistractors(
  input: TsdCp012ReviewInput,
  solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>,
): readonly TsdCp012ScalarDistractor[] {
  const context = `${input.authorityKey}/${input.target}`;
  const expanded = expandedCandidates(input, solution);
  if (expanded) return pickScalar(solution.answer, expanded, context);
  try {
    return buildLegacyScalarDistractors(input, solution);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`CP012 legacy distractor fallback failed for ${context}: ${message}`);
  }
}
