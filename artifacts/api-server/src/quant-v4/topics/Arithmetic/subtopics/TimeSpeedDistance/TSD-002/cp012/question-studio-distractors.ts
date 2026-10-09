import {
  absRational,
  add,
  ceilRational,
  compare,
  divide,
  floorRational,
  modulo,
  multiply,
  rational,
  subtract,
  toCanonicalString,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp012ExecutableSolution, TsdCp012Stage, TsdCp012TimedStage } from "./executable-types";
import type { TsdCp012ReviewInput } from "./english-review-final";

export type TsdCp012ScalarDistractor = Readonly<{
  kind: "SCALAR";
  misconceptionId: string;
  calculation: string;
  value: Rational;
}>;
export type TsdCp012SetDistractor = Readonly<{
  kind: "SET";
  misconceptionId: string;
  calculation: string;
  values: readonly Rational[];
}>;

const ZERO = rational(0);
const TWO = rational(2);
const q = (value: number | bigint): Rational => rational(value);
const sum = (values: readonly Rational[]): Rational => values.reduce((total, value) => add(total, value), ZERO);
const timedDistance = (stage: TsdCp012TimedStage): Rational => multiply(stage.speed, stage.duration);
const stageTime = (stage: TsdCp012Stage): Rational => divide(stage.distance, stage.speed);
const mean = (values: readonly Rational[]): Rational => divide(sum(values), q(values.length));
const minR = (values: readonly Rational[]): Rational => values.reduce((best, value) => compare(value, best) < 0 ? value : best);
const maxR = (values: readonly Rational[]): Rational => values.reduce((best, value) => compare(value, best) > 0 ? value : best);
const absDiff = (a: Rational, b: Rational): Rational => absRational(subtract(a, b));

function c(id: string, calculation: string, value: Rational): TsdCp012ScalarDistractor {
  return Object.freeze({ kind: "SCALAR" as const, misconceptionId: id, calculation, value });
}
function s(id: string, calculation: string, values: readonly Rational[]): TsdCp012SetDistractor {
  return Object.freeze({ kind: "SET" as const, misconceptionId: id, calculation, values: Object.freeze([...values]) });
}
function pickScalar(correct: Rational, candidates: readonly TsdCp012ScalarDistractor[]): readonly TsdCp012ScalarDistractor[] {
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
  if (picked.length !== 3) throw new Error(`CP012 distractor engine produced only ${picked.length} unique scalar wrong paths`);
  return Object.freeze(picked);
}
function setKey(values: readonly Rational[]): string { return values.map(toCanonicalString).join("|"); }
function pickSet(correct: readonly Rational[], candidates: readonly TsdCp012SetDistractor[]): readonly TsdCp012SetDistractor[] {
  const seen = new Set<string>([setKey(correct)]);
  const picked: TsdCp012SetDistractor[] = [];
  for (const candidate of candidates) {
    const key = setKey(candidate.values);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(candidate);
    if (picked.length === 3) break;
  }
  if (picked.length !== 3) throw new Error(`CP012 distractor engine produced only ${picked.length} unique set wrong paths`);
  return Object.freeze(picked);
}
function ratioSplit(total: Rational, speedA: Rational, speedB: Rational): readonly TsdCp012ScalarDistractor[] {
  const totalSpeed = add(speedA, speedB);
  const a2 = multiply(speedA, speedA);
  const b2 = multiply(speedB, speedB);
  return [
    c("DIRECT_SPEED_RATIO_A", "Split distance directly in the two speeds' ratio.", divide(multiply(total, speedA), totalSpeed)),
    c("DIRECT_SPEED_RATIO_B", "Reverse the direct speed-ratio distance allocation.", divide(multiply(total, speedB), totalSpeed)),
    c("EQUAL_DISTANCE_SPLIT", "Ignore the time condition and split the route equally.", divide(total, TWO)),
    c("SQUARED_SPEED_RATIO", "Use a squared-speed ratio instead of the time equation.", divide(multiply(total, a2), add(a2, b2))),
  ];
}

type FeasibleInput = Extract<TsdCp012ReviewInput, { authorityKey: "feasibleParameterSetState" }>;
type FeasibleMode = "STRICT" | "IGNORE_DELAY" | "EXTEND_UPPER" | "ALL_ALLOWED";
function feasibleValues(input: FeasibleInput, mode: FeasibleMode): readonly Rational[] {
  const upper = mode === "EXTEND_UPPER" ? input.maximumCandidate + 1 : input.maximumCandidate;
  const out: Rational[] = [];
  for (let speed = input.minimumCandidate; speed <= upper; speed += 1) {
    if (mode === "ALL_ALLOWED") { out.push(q(speed)); continue; }
    const delay = mode === "IGNORE_DELAY" ? ZERO : input.fixedDelay;
    const elapsed = add(delay, divide(input.distance, q(speed)));
    const valid = mode === "STRICT" ? compare(elapsed, input.deadline) < 0 : compare(elapsed, input.deadline) <= 0;
    if (valid) out.push(q(speed));
  }
  return Object.freeze(out);
}
function feasibleWrongSets(input: FeasibleInput): readonly TsdCp012SetDistractor[] {
  return [
    s("STRICT_INSTEAD_OF_AT_MOST", "Treat an at-most deadline as a strict less-than deadline.", feasibleValues(input, "STRICT")),
    s("FIXED_DELAY_IGNORED", "Check travel time but omit the fixed non-travel delay.", feasibleValues(input, "IGNORE_DELAY")),
    s("UPPER_BOUND_OFF_BY_ONE", "Admit one integer above the allowed maximum.", feasibleValues(input, "EXTEND_UPPER")),
    s("FEASIBILITY_TEST_SKIPPED", "Accept every allowed integer without testing the deadline.", feasibleValues(input, "ALL_ALLOWED")),
  ];
}

export function buildTsdCp012SetDistractors(input: TsdCp012ReviewInput, solution: Extract<TsdCp012ExecutableSolution, { kind: "SET" }>): readonly TsdCp012SetDistractor[] {
  if (input.authorityKey !== "feasibleParameterSetState" || input.target !== "VALID_SET") throw new Error("CP012 set distractors are defined only for reviewed feasible-set questions");
  return pickSet(solution.values, feasibleWrongSets(input));
}

export function buildTsdCp012ScalarDistractors(input: TsdCp012ReviewInput, solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>): readonly TsdCp012ScalarDistractor[] {
  if (solution.unit === "INDEX") throw new Error("CP012 route-index questions use the dedicated finite-route option model");
  let candidates: readonly TsdCp012ScalarDistractor[];

  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") {
        const speeds = input.stages.map((x) => x.speed);
        const durations = input.stages.map((x) => x.duration);
        candidates = [
          c("STAGE_PAIRING_LOST", "Multiply summed speeds by summed durations instead of pairing stages.", multiply(sum(speeds), sum(durations))),
          c("UNWEIGHTED_SPEED_AVERAGE", "Use the simple speed average over the whole elapsed time.", multiply(mean(speeds), sum(durations))),
          c("FINAL_STAGE_OMITTED", "Forget the final speed-duration stage.", sum(input.stages.slice(0, -1).map(timedDistance))),
          c("FINAL_STAGE_ONLY", "Use only the final speed-duration stage.", timedDistance(input.stages.at(-1)!)),
        ];
      } else if (input.target === "TOTAL_TIME") {
        const distance = sum(input.stages.map((x) => x.distance));
        const speeds = input.stages.map((x) => x.speed);
        candidates = [
          c("SPEEDS_ADDED_BEFORE_TIME", "Divide total distance by the sum of segment speeds.", divide(distance, sum(speeds))),
          c("FASTEST_SPEED_WHOLE_ROUTE", "Apply the fastest segment speed to the whole route.", divide(distance, maxR(speeds))),
          c("SLOWEST_SPEED_WHOLE_ROUTE", "Apply the slowest segment speed to the whole route.", divide(distance, minR(speeds))),
          c("FINAL_STRETCH_OMITTED", "Add segment times but omit the final stretch.", sum(input.stages.slice(0, -1).map(stageTime))),
        ];
      } else if (input.target === "UNKNOWN_FINAL_SPEED") {
        const priorDistance = sum(input.priorStages.map(timedDistance));
        const remaining = subtract(input.totalDistance, priorDistance);
        const priorTime = sum(input.priorStages.map((x) => x.duration));
        candidates = [
          c("PRIOR_DISTANCE_IGNORED", "Divide full journey distance by final-stage duration.", divide(input.totalDistance, input.finalDuration)),
          c("PRIOR_TIME_IN_FINAL_DENOMINATOR", "Divide remaining distance by all earlier time plus final-stage time.", divide(remaining, add(priorTime, input.finalDuration))),
          c("LAST_KNOWN_SPEED_REUSED", "Reuse the preceding stage speed.", input.priorStages.at(-1)!.speed),
          c("PRIOR_SPEEDS_AVERAGED", "Use the simple average of earlier speeds.", mean(input.priorStages.map((x) => x.speed))),
          c("REMAINING_DISTANCE_OVER_PRIOR_TIME", "Divide remaining distance by time already spent.", divide(remaining, priorTime)),
          c("PRIOR_DISTANCE_OVER_FINAL_TIME", "Divide already-covered distance by final-stage duration.", divide(priorDistance, input.finalDuration)),
        ];
      } else if (input.target === "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE") {
        const cycleDistance = sum(input.cycle.map(timedDistance));
        const cycleTime = sum(input.cycle.map((x) => x.duration));
        const speeds = input.cycle.map((x) => x.speed);
        candidates = [
          c("SIMPLE_CYCLE_SPEED_AVERAGE", "Replace the repeating schedule by a simple average speed.", divide(input.distance, mean(speeds))),
          c("PARTIAL_CYCLE_IGNORED", "Count only complete cycles and omit the final partial cycle.", multiply(q(floorRational(divide(input.distance, cycleDistance))), cycleTime)),
          c("FASTEST_STAGE_CONTINUOUS", "Use the fastest stage speed for the whole target distance.", divide(input.distance, maxR(speeds))),
          c("SLOWEST_STAGE_CONTINUOUS", "Use the slowest stage speed for the whole target distance.", divide(input.distance, minR(speeds))),
        ];
      } else throw new Error(`Unreviewed discrete target ${input.target}`);
      break;
    }

    case "periodicTravelRestProgramState": {
      const blocks = ceilRational(divide(input.distance, multiply(input.travelSpeed, input.travelDurationPerBlock)));
      const rests = blocks - 1n;
      const movingTime = divide(input.distance, input.travelSpeed);
      if (input.target === "COMPLETION_TIME") {
        candidates = [
          c("RESTS_IGNORED", "Use travel time only and omit all rests.", movingTime),
          c("REST_AFTER_ARRIVAL", "Charge a rest after the final arrival block.", add(movingTime, multiply(q(blocks), input.restDuration))),
          c("FINAL_PARTIAL_BLOCK_FULL", "Charge full movement duration for every movement block.", add(multiply(q(blocks), input.travelDurationPerBlock), multiply(q(rests), input.restDuration))),
          c("FULL_BLOCK_PLUS_FINAL_REST", "Treat every block as full and also rest after arrival.", multiply(q(blocks), add(input.travelDurationPerBlock, input.restDuration))),
        ];
      } else if (input.target === "REST_COUNT") {
        candidates = [
          c("ARRIVAL_REST_COUNTED", "Count one rest for every movement block including arrival.", q(blocks)),
          c("ONE_REST_SKIPPED", "Stop the rest count one block early.", q(rests > 0n ? rests - 1n : 0n)),
          c("INITIAL_REST_INVENTED", "Add a rest before the first movement spell.", q(blocks + 1n)),
          c("FULL_BLOCK_COUNT_USED", "Use full movement-block count directly as rest count.", q(floorRational(divide(input.distance, multiply(input.travelSpeed, input.travelDurationPerBlock))))),
        ];
      } else {
        const totalRest = subtract(input.totalElapsedTime, movingTime);
        candidates = [
          c("REST_TIME_DIVIDED_BY_BLOCKS", "Divide total rest time by movement blocks instead of rests.", divide(totalRest, q(blocks))),
          c("MOVING_TIME_NOT_REMOVED", "Divide total elapsed time directly by the number of rests.", divide(input.totalElapsedTime, q(rests))),
          c("ELAPSED_TIME_DIVIDED_BY_BLOCKS", "Divide full elapsed time by movement-block count.", divide(input.totalElapsedTime, q(blocks))),
          c("MOVEMENT_DURATION_COPIED", "Copy movement duration as the rest duration.", input.travelDurationPerBlock),
        ];
      }
      break;
    }

    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") {
        const remainingDistance = subtract(input.totalDistance, input.completedDistance);
        const remainingTime = subtract(input.deadline, input.elapsedTime);
        candidates = [
          c("FULL_DISTANCE_REMAINING_TIME", "Use full distance with only remaining time.", divide(input.totalDistance, remainingTime)),
          c("REMAINING_DISTANCE_FULL_DEADLINE", "Use remaining distance with the original deadline.", divide(remainingDistance, input.deadline)),
          c("FULL_TRIP_AVERAGE_SPEED", "Use full distance divided by full deadline.", divide(input.totalDistance, input.deadline)),
          c("PAST_AVERAGE_SPEED_REUSED", "Reuse speed achieved in the completed portion.", divide(input.completedDistance, input.elapsedTime)),
          c("COMPLETED_DISTANCE_REMAINING_TIME", "Use completed distance with remaining time.", divide(input.completedDistance, remainingTime)),
          c("REMAINING_DISTANCE_ELAPSED_TIME", "Use remaining distance with elapsed time.", divide(remainingDistance, input.elapsedTime)),
        ];
      } else if (input.target === "REQUIRED_FINAL_TIME") {
        const remaining = subtract(input.totalDistance, input.completedDistance);
        candidates = [
          c("FULL_DISTANCE_FINAL_SPEED", "Use full route distance for the final stage.", divide(input.totalDistance, input.finalSpeed)),
          c("COMPLETED_DISTANCE_FINAL_SPEED", "Use already-completed distance for the final stage.", divide(input.completedDistance, input.finalSpeed)),
          c("ELAPSED_TIME_REUSED", "Report time already elapsed as time still needed.", input.elapsedTime),
          c("PAST_SPEED_ON_REMAINING", "Carry the earlier average speed onto the remaining distance.", divide(remaining, divide(input.completedDistance, input.elapsedTime))),
        ];
      } else if (input.target === "STAGE_BOUNDARY_DISTANCE") {
        candidates = ratioSplit(input.totalDistance, input.firstSpeed, input.secondSpeed);
      } else if (input.target === "DISTANCE_REMAINING_AFTER_STAGES") {
        const completed = input.completedStages.map(timedDistance);
        candidates = [
          c("DURATIONS_SUBTRACTED_AS_DISTANCE", "Subtract durations directly from total distance.", subtract(input.totalDistance, sum(input.completedStages.map((x) => x.duration)))),
          c("COVERED_DISTANCE_REPORTED", "Report distance covered instead of distance remaining.", sum(completed)),
          c("ONLY_FIRST_STAGE_SUBTRACTED", "Subtract only the first completed stage.", subtract(input.totalDistance, completed[0]!)),
          c("ONLY_LAST_STAGE_SUBTRACTED", "Subtract only the last completed stage.", subtract(input.totalDistance, completed.at(-1)!)),
        ];
      } else throw new Error(`Unreviewed terminal target ${input.target}`);
      break;
    }

    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") {
        const distance = sum(input.segments.map((x) => x.distance));
        const speeds = input.segments.map((x) => x.speed);
        candidates = [
          c("UNWEIGHTED_ROUTE_SPEED", "Use the simple average segment speed for the whole route.", divide(distance, mean(speeds))),
          c("FASTEST_ROUTE_SPEED", "Use the fastest segment speed for the whole route.", divide(distance, maxR(speeds))),
          c("SLOWEST_ROUTE_SPEED", "Use the slowest segment speed for the whole route.", divide(distance, minR(speeds))),
          c("FINAL_SEGMENT_OMITTED", "Omit the final segment time.", sum(input.segments.slice(0, -1).map(stageTime))),
        ];
      } else if (input.target === "DISTANCE_SPLIT_A") {
        candidates = ratioSplit(input.totalDistance, input.speedA, input.speedB);
      } else if (input.target === "CLOSED_ROUTE_OPPOSITE_MEETING_TIME") {
        const perimeter = sum(input.clockwiseSegments.map((x) => x.distance));
        const cw = input.clockwiseSegments.map((x) => x.speed);
        const ccw = input.counterclockwiseSegments.map((x) => x.speed);
        candidates = [
          c("FIRST_SEGMENT_SPEEDS_THROUGHOUT", "Use both runners' first-segment speeds for the whole closed route.", divide(perimeter, add(cw[0]!, ccw[0]!))),
          c("AVERAGE_ROUTE_SPEEDS", "Use simple averages of the listed route speeds.", divide(perimeter, add(mean(cw), mean(ccw)))),
          c("FASTEST_ROUTE_SPEEDS", "Use each runner's fastest listed speed throughout.", divide(perimeter, add(maxR(cw), maxR(ccw)))),
          c("SLOWEST_ROUTE_SPEEDS", "Use each runner's slowest listed speed throughout.", divide(perimeter, add(minR(cw), minR(ccw)))),
        ];
      } else if (input.target === "FASTEST_ROUTE_INDEX") throw new Error("Route index uses dedicated options");
      else throw new Error(`Unreviewed route target ${input.target}`);
      break;
    }

    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") {
        candidates = [
          c("ONLY_FIRST_DISTANCE_REMOVED", "Subtract only the first known distance.", subtract(input.totalDistance, input.knownDistances[0]!)),
          c("KNOWN_DISTANCE_SUM_REPORTED", "Report the sum of known distances.", sum(input.knownDistances)),
          c("EQUAL_STAGE_DISTANCE", "Split total distance equally across all stages.", divide(input.totalDistance, q(input.knownDistances.length + 1))),
          c("LAST_DISTANCE_COPIED", "Copy the final known distance.", input.knownDistances.at(-1)!),
        ];
      } else if (input.target === "MISSING_TIME") {
        candidates = [
          c("ONLY_FIRST_TIME_REMOVED", "Subtract only the first known time.", subtract(input.totalTime, input.knownTimes[0]!)),
          c("KNOWN_TIME_SUM_REPORTED", "Report the sum of known times.", sum(input.knownTimes)),
          c("EQUAL_STAGE_TIME", "Split total time equally across all stages.", divide(input.totalTime, q(input.knownTimes.length + 1))),
          c("LAST_TIME_COPIED", "Copy the final known stage time.", input.knownTimes.at(-1)!),
        ];
      } else if (input.target === "MISSING_SPEED") {
        candidates = [
          c("DISTANCE_TIMES_TIME", "Multiply distance and time instead of dividing.", multiply(input.missingDistance, input.missingTime)),
          c("TIME_OVER_DISTANCE", "Invert the speed formula to time divided by distance.", divide(input.missingTime, input.missingDistance)),
          c("DOUBLE_TIME", "Double the stated time before finding speed.", divide(input.missingDistance, multiply(TWO, input.missingTime))),
          c("DOUBLE_DISTANCE", "Double the stated distance before finding speed.", divide(multiply(TWO, input.missingDistance), input.missingTime)),
        ];
      } else throw new Error(`Unreviewed reconstruction target ${input.target}`);
      break;
    }

    case "trainScheduleSynthesisState": {
      const closing = add(input.speedA, input.speedB);
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") {
        candidates = [
          c("DELAY_IGNORED", "Assume simultaneous starts.", divide(input.stationDistance, closing)),
          c("DELAY_DISTANCE_SUBTRACTED", "Subtract Train B's delayed-start distance from the station gap.", divide(absRational(subtract(input.stationDistance, multiply(input.speedB, input.delayB))), closing)),
          c("SAME_DIRECTION_RELATIVE_SPEED", "Use speed difference although trains move toward each other.", divide(input.stationDistance, absDiff(input.speedA, input.speedB))),
          c("TIME_FROM_SECOND_DEPARTURE", "Report only time after Train B departs.", subtract(solution.answer, input.delayB)),
        ];
      } else if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") {
        const closure = add(add(input.initialGap, input.lengthA), input.lengthB);
        const remaining = subtract(closure, multiply(input.speedA, input.delayB));
        candidates = [
          c("TRAIN_LENGTHS_IGNORED", "Use only the initial gap.", divide(input.initialGap, closing)),
          c("DELAY_IGNORED", "Include train lengths but assume simultaneous starts.", divide(closure, closing)),
          c("DELAY_DOUBLE_COUNTED", "Add the delay to simultaneous-start crossing time without early-movement credit.", add(input.delayB, divide(closure, closing))),
          c("TIME_FROM_SECOND_DEPARTURE", "Report only the interval after Train B starts.", divide(remaining, closing)),
        ];
      } else {
        const delayedClosure = subtract(multiply(closing, input.meetingTimeFromFirstDeparture), input.stationDistance);
        candidates = [
          c("DIVIDE_BY_TRAIN_A_SPEED", "Convert delayed closure using Train A's speed.", divide(delayedClosure, input.speedA)),
          c("SIMULTANEOUS_MEETING_TIME_AS_DELAY", "Treat simultaneous-start meeting time as the delay.", divide(input.stationDistance, closing)),
          c("NAIVE_TIME_DIFFERENCE", "Subtract simultaneous-start meeting time from observed meeting time.", subtract(input.meetingTimeFromFirstDeparture, divide(input.stationDistance, closing))),
          c("TRAIN_B_SOLO_TIME", "Use Train B's solo time across the station gap.", divide(input.stationDistance, input.speedB)),
        ];
      }
      break;
    }

    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") {
        candidates = [
          c("BOAT_INTERVAL_ONLY", "Report only the interval after the delayed boat starts.", divide(multiply(input.currentSpeed, input.boatStartDelay), input.boatStillWaterSpeed)),
          c("UPSTREAM_RATE_USED", "Use boat speed minus current for a downstream chase.", divide(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay), subtract(input.boatStillWaterSpeed, input.currentSpeed))),
          c("GROUND_SPEED_CURRENT_IGNORED", "Use still-water boat speed where downstream ground speed is required.", divide(multiply(input.boatStillWaterSpeed, input.boatStartDelay), subtract(input.boatStillWaterSpeed, input.currentSpeed))),
          c("START_DELAY_AS_CATCH_TIME", "Report the start delay as catch time.", input.boatStartDelay),
        ];
      } else if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") {
        const catchTime = divide(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay), input.boatStillWaterSpeed);
        candidates = [
          c("RAFT_POSITION_AT_BOAT_START", "Report raft position when the boat starts.", multiply(input.currentSpeed, input.boatStartDelay)),
          c("STILL_WATER_DISTANCE_DURING_DELAY", "Multiply still-water boat speed by start delay.", multiply(input.boatStillWaterSpeed, input.boatStartDelay)),
          c("DOWNSTREAM_DISTANCE_DURING_DELAY", "Multiply downstream boat speed by start delay.", multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay)),
          c("CATCH_TIME_AS_DISTANCE", "Report catch-time magnitude as distance.", catchTime),
        ];
      } else if (input.target === "CURRENT_SPEED") {
        const extra = subtract(input.catchTimeFromRaftStart, input.boatStartDelay);
        candidates = [
          c("DELAY_PLUS_TOTAL_IN_DENOMINATOR", "Add the start delay and total catch time in the denominator instead of using the correct time relation.", divide(multiply(input.boatStillWaterSpeed, input.boatStartDelay), add(input.catchTimeFromRaftStart, input.boatStartDelay))),
          c("REVERSED_TIME_RATIO", "Reverse the start-delay and catch-time ratio.", divide(multiply(input.boatStillWaterSpeed, input.boatStartDelay), input.catchTimeFromRaftStart)),
          c("EXTRA_OVER_TOTAL_TIME", "Scale boat speed by extra time over total catch time.", divide(multiply(input.boatStillWaterSpeed, extra), input.catchTimeFromRaftStart)),
          c("EXTRA_TIME_AS_SPEED", "Use extra catch-time magnitude as speed.", extra),
        ];
      } else throw new Error(`Unreviewed medium target ${input.target}`);
      break;
    }

    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") {
        const raceDistance = multiply(input.trackLength, q(input.raceLaps));
        const finishTime = divide(raceDistance, input.fasterSpeed);
        const slowerTravel = multiply(input.slowerSpeed, finishTime);
        const position = modulo(add(input.slowerHeadStart, slowerTravel), input.trackLength);
        const subtractHeadStartPosition = modulo(subtract(slowerTravel, input.slowerHeadStart), input.trackLength);
        const oneLapFinishTime = divide(input.trackLength, input.fasterSpeed);
        const oneLapSlowerPosition = modulo(add(input.slowerHeadStart, multiply(input.slowerSpeed, oneLapFinishTime)), input.trackLength);
        candidates = [
          c("HEAD_START_IGNORED", "Omit the initial head start when locating the slower runner.", modulo(subtract(ZERO, modulo(slowerTravel, input.trackLength)), input.trackLength)),
          c("POSITION_REPORTED_AS_GAP", "Report track position instead of forward gap to the finish.", position),
          c("INITIAL_HEAD_START_AS_FINAL_GAP", "Use the initial head-start complement as the final gap.", modulo(subtract(input.trackLength, input.slowerHeadStart), input.trackLength)),
          c("LAP_WRAP_IGNORED", "Use straight-line distance difference without track wrapping.", absRational(subtract(raceDistance, add(input.slowerHeadStart, slowerTravel)))),
          c("HEAD_START_SUBTRACTED", "Subtract the head start from the slower runner's travelled distance instead of adding it before locating the runner on the track.", modulo(subtract(ZERO, subtractHeadStartPosition), input.trackLength)),
          c("ONE_LAP_RACE_ASSUMED", "Treat the race as one lap when finding the faster runner's finish time, even though the stated race lasts more laps.", modulo(subtract(ZERO, oneLapSlowerPosition), input.trackLength)),
        ];
      } else if (input.target === "HEAD_START_FOR_DEAD_HEAT") {
        const raceDistance = multiply(input.trackLength, q(input.raceLaps));
        candidates = [
          c("SLOWER_SPEED_DENOMINATOR", "Scale race distance by speed difference over slower speed.", divide(multiply(raceDistance, subtract(input.fasterSpeed, input.slowerSpeed)), input.slowerSpeed)),
          c("SUM_SPEED_DENOMINATOR", "Use speed difference over speed sum.", divide(multiply(raceDistance, subtract(input.fasterSpeed, input.slowerSpeed)), add(input.fasterSpeed, input.slowerSpeed))),
          c("HEAD_START_COMPLEMENT", "Report the race-distance complement of the correct head start.", subtract(raceDistance, solution.answer)),
          c("ONE_LAP_COMPLEMENT", "Use a one-lap complement regardless of race length.", absRational(subtract(input.trackLength, solution.answer))),
        ];
      } else {
        const difference = subtract(input.fasterSpeed, input.slowerSpeed);
        candidates = [
          c("OPPOSITE_DIRECTION_RATE", "Use speed sum for a same-direction overtake.", divide(input.slowerHeadStart, add(input.fasterSpeed, input.slowerSpeed))),
          c("FULL_LAP_GAP", "Ignore the stated head start and close one full lap.", divide(input.trackLength, difference)),
          c("COMPLEMENTARY_GAP", "Use track length minus head start as the gap.", divide(subtract(input.trackLength, input.slowerHeadStart), difference)),
          c("FASTER_SPEED_ALONE", "Divide head-start gap by faster runner's speed rather than relative speed.", divide(input.slowerHeadStart, input.fasterSpeed)),
        ];
      }
      break;
    }

    case "movingSurfaceScheduleSynthesisState": {
      const assisted = add(input.personRate, input.surfaceRate);
      if (input.target === "TIME_WITH_STOP_AFTER") {
        const remaining = subtract(input.length, multiply(assisted, input.surfaceActiveTime));
        candidates = [
          c("SURFACE_ACTIVE_WHOLE_TRIP", "Assume the surface assists for the whole crossing.", divide(input.length, assisted)),
          c("SURFACE_IGNORED", "Ignore the moving surface completely.", divide(input.length, input.personRate)),
          c("ASSISTED_RATE_AFTER_STOP", "Keep using assisted rate after the surface stops.", add(input.surfaceActiveTime, divide(remaining, assisted))),
          c("SURFACE_RATE_AS_PERSON_RATE", "Use surface rate alone for the crossing.", divide(input.length, input.surfaceRate)),
        ];
      } else if (input.target === "TIME_WITH_DELAYED_ACTIVATION") {
        const remaining = subtract(input.length, multiply(input.personRate, input.activationDelay));
        candidates = [
          c("SURFACE_ACTIVE_FROM_START", "Assume the surface assists from time zero.", divide(input.length, assisted)),
          c("SURFACE_NEVER_ACTIVATES", "Ignore the later activation.", divide(input.length, input.personRate)),
          c("FULL_LENGTH_AFTER_ACTIVATION", "Add the delay then traverse the full length at assisted rate.", add(input.activationDelay, divide(input.length, assisted))),
          c("DELAY_OMITTED", "Report only the assisted time for the remaining distance.", divide(remaining, assisted)),
        ];
      } else if (input.target === "TIME_WITH_DIRECTION_REVERSAL") {
        const remaining = subtract(input.length, multiply(assisted, input.reversalTime));
        candidates = [
          c("REVERSAL_IGNORED", "Assume the surface keeps assisting after reversal.", divide(input.length, assisted)),
          c("SURFACE_IGNORED", "Ignore both assistance and opposition.", divide(input.length, input.personRate)),
          c("ASSISTED_RATE_AFTER_REVERSAL", "Keep assisted rate after reversal.", add(input.reversalTime, divide(remaining, assisted))),
          c("OPPOSING_RATE_FROM_START", "Use person minus surface rate from time zero.", divide(input.length, subtract(input.personRate, input.surfaceRate))),
          c("SURFACE_RATE_AFTER_REVERSAL", "Use surface rate alone after reversal.", add(input.reversalTime, divide(remaining, input.surfaceRate))),
          c("PERSON_RATE_AFTER_REVERSAL", "Ignore opposition after reversal and use only walking rate.", add(input.reversalTime, divide(remaining, input.personRate))),
        ];
      } else throw new Error(`Unreviewed moving-surface target ${input.target}`);
      break;
    }

    case "twoEngineInverseState": {
      const determinant = subtract(multiply(input.a1, input.b2), multiply(input.a2, input.b1));
      const x = divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), determinant);
      const y = divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), determinant);
      if (input.target === "X") {
        candidates = [
          c("Y_ZERO_FIRST_EQUATION", "Set y to zero in the first observation.", divide(input.c1, input.a1)),
          c("Y_ZERO_SECOND_EQUATION", "Set y to zero in the second observation.", divide(input.c2, input.a2)),
          c("VARIABLES_SWAPPED", "Return y when x is requested.", y),
          c("DETERMINANT_SIGN_REVERSED", "Reverse determinant sign only.", divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), subtract(ZERO, determinant))),
          c("WRONG_FIRST_COEFFICIENT", "Divide the first equation constant by the y coefficient and report it as x.", divide(input.c1, input.b1)),
        ];
      } else {
        candidates = [
          c("X_ZERO_FIRST_EQUATION", "Set x to zero in the first observation.", divide(input.c1, input.b1)),
          c("X_ZERO_SECOND_EQUATION", "Set x to zero in the second observation.", divide(input.c2, input.b2)),
          c("VARIABLES_SWAPPED", "Return x when y is requested.", x),
          c("DETERMINANT_SIGN_REVERSED", "Reverse determinant sign only.", divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), subtract(ZERO, determinant))),
          c("WRONG_FIRST_COEFFICIENT", "Divide the first equation constant by the x coefficient and report it as y.", divide(input.c1, input.a1)),
          c("SECOND_COEFFICIENT_SIGN_IGNORED", "Ignore the sign of the second equation's y coefficient.", absRational(divide(input.c2, input.b2))),
        ];
      }
      break;
    }

    case "feasibleParameterSetState": {
      if (input.target !== "COUNT") throw new Error("Set-valued feasible question must use set distractors");
      candidates = feasibleWrongSets(input).map((wrong) => c(wrong.misconceptionId, wrong.calculation, q(wrong.values.length)));
      break;
    }
  }

  return pickScalar(solution.answer, candidates);
}
