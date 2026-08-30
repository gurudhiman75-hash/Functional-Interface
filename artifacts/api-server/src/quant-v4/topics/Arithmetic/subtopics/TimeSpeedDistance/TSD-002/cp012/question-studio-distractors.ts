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
const absDiff = (a: Rational, b: Rational): Rational => absRational(subtract(a, b));
const mean = (values: readonly Rational[]): Rational => divide(sum(values), q(values.length));
const minR = (values: readonly Rational[]): Rational => values.reduce((best, value) => compare(value, best) < 0 ? value : best);
const maxR = (values: readonly Rational[]): Rational => values.reduce((best, value) => compare(value, best) > 0 ? value : best);

function c(misconceptionId: string, calculation: string, value: Rational): TsdCp012ScalarDistractor {
  return Object.freeze({ kind: "SCALAR" as const, misconceptionId, calculation, value });
}
function s(misconceptionId: string, calculation: string, values: readonly Rational[]): TsdCp012SetDistractor {
  return Object.freeze({ kind: "SET" as const, misconceptionId, calculation, values: Object.freeze([...values]) });
}
function pickScalar(correct: Rational, candidates: readonly TsdCp012ScalarDistractor[]): readonly TsdCp012ScalarDistractor[] {
  const seen = new Set<string>([toCanonicalString(correct)]);
  const out: TsdCp012ScalarDistractor[] = [];
  for (const candidate of candidates) {
    if (compare(candidate.value, ZERO) < 0) continue;
    const key = toCanonicalString(candidate.value);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
    if (out.length === 3) break;
  }
  if (out.length !== 3) throw new Error(`CP012 distractor engine produced only ${out.length} unique scalar wrong paths`);
  return Object.freeze(out);
}
function setKey(values: readonly Rational[]): string { return values.map(toCanonicalString).join("|"); }
function pickSet(correct: readonly Rational[], candidates: readonly TsdCp012SetDistractor[]): readonly TsdCp012SetDistractor[] {
  const seen = new Set<string>([setKey(correct)]);
  const out: TsdCp012SetDistractor[] = [];
  for (const candidate of candidates) {
    const key = setKey(candidate.values);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
    if (out.length === 3) break;
  }
  if (out.length !== 3) throw new Error(`CP012 distractor engine produced only ${out.length} unique set wrong paths`);
  return Object.freeze(out);
}
function movementBlocks(distance: Rational, speed: Rational, duration: Rational): bigint {
  return ceilRational(divide(distance, multiply(speed, duration)));
}
function ratioSplitCandidates(total: Rational, speedA: Rational, speedB: Rational): readonly TsdCp012ScalarDistractor[] {
  const speedSum = add(speedA, speedB);
  const squareA = multiply(speedA, speedA);
  const squareB = multiply(speedB, speedB);
  return Object.freeze([
    c("SPEED_RATIO_USED_AS_DISTANCE_RATIO_A", "Split total distance directly in the speed ratio and assign speed A its proportional share.", divide(multiply(total, speedA), speedSum)),
    c("SPEED_RATIO_USED_AS_DISTANCE_RATIO_B", "Reverse the direct speed-ratio allocation and assign speed A the other proportional share.", divide(multiply(total, speedB), speedSum)),
    c("EQUAL_DISTANCE_SPLIT_ASSUMED", "Ignore the time condition and split the route into two equal distances.", divide(total, TWO)),
    c("SQUARED_SPEED_RATIO_SPLIT", "Use a squared-speed ratio instead of the reciprocal-time relation required by the two-speed journey.", divide(multiply(total, squareA), add(squareA, squareB))),
  ]);
}

type FeasibleInput = Extract<TsdCp012ReviewInput, { authorityKey: "feasibleParameterSetState" }>;
type FeasibleMode = "CORRECT" | "STRICT" | "IGNORE_DELAY" | "ALL_ALLOWED" | "EXTEND_UPPER";
function feasibleValues(input: FeasibleInput, mode: FeasibleMode): readonly Rational[] {
  const maximum = mode === "EXTEND_UPPER" ? input.maximumCandidate + 1 : input.maximumCandidate;
  const values: Rational[] = [];
  for (let candidate = input.minimumCandidate; candidate <= maximum; candidate += 1) {
    if (mode === "ALL_ALLOWED") { values.push(q(candidate)); continue; }
    const fixedDelay = mode === "IGNORE_DELAY" ? ZERO : input.fixedDelay;
    const elapsed = add(fixedDelay, divide(input.distance, q(candidate)));
    const accepted = mode === "STRICT" ? compare(elapsed, input.deadline) < 0 : compare(elapsed, input.deadline) <= 0;
    if (accepted) values.push(q(candidate));
  }
  return Object.freeze(values);
}
function feasibleCandidates(input: FeasibleInput): readonly TsdCp012SetDistractor[] {
  return Object.freeze([
    s("STRICT_DEADLINE_INSTEAD_OF_AT_MOST", "Use total time < deadline instead of the stated at-most condition.", feasibleValues(input, "STRICT")),
    s("FIXED_DELAY_IGNORED", "Apply the travel-time test but omit the fixed non-travel delay.", feasibleValues(input, "IGNORE_DELAY")),
    s("UPPER_BOUND_OFF_BY_ONE", "Apply the feasibility inequality but admit one integer speed above the allowed maximum.", feasibleValues(input, "EXTEND_UPPER")),
    s("FEASIBILITY_TEST_SKIPPED", "Treat every allowed integer speed as feasible without applying the deadline test.", feasibleValues(input, "ALL_ALLOWED")),
  ]);
}

export function buildTsdCp012SetDistractors(input: TsdCp012ReviewInput, solution: Extract<TsdCp012ExecutableSolution, { kind: "SET" }>): readonly TsdCp012SetDistractor[] {
  if (input.authorityKey !== "feasibleParameterSetState" || input.target !== "VALID_SET") throw new Error("CP012 set distractors are only defined for reviewed feasible-set questions");
  return pickSet(solution.values, feasibleCandidates(input));
}

export function buildTsdCp012ScalarDistractors(input: TsdCp012ReviewInput, solution: Extract<TsdCp012ExecutableSolution, { kind: "SCALAR" }>): readonly TsdCp012ScalarDistractor[] {
  if (solution.unit === "INDEX") throw new Error("CP012 finite route index uses its dedicated route-choice option model");
  let candidates: readonly TsdCp012ScalarDistractor[];

  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") {
        const speeds = input.stages.map((stage) => stage.speed);
        const durations = input.stages.map((stage) => stage.duration);
        candidates = [
          c("STAGE_PAIRING_LOST", "Multiply the sum of all speeds by the sum of all durations instead of pairing each speed with its own duration.", multiply(sum(speeds), sum(durations))),
          c("UNWEIGHTED_AVERAGE_SPEED", "Use the simple average of listed speeds for the entire elapsed time.", multiply(mean(speeds), sum(durations))),
          c("FINAL_STAGE_OMITTED", "Add the travelled distances but forget the final speed-duration stage.", sum(input.stages.slice(0, -1).map(timedDistance))),
          c("FINAL_STAGE_ONLY", "Use only the final speed-duration block as the journey distance.", timedDistance(input.stages.at(-1)!)),
        ];
      } else if (input.target === "TOTAL_TIME") {
        const totalDistance = sum(input.stages.map((stage) => stage.distance));
        const speeds = input.stages.map((stage) => stage.speed);
        candidates = [
          c("SPEEDS_ADDED_BEFORE_TIME", "Divide total route distance by the sum of segment speeds instead of adding segment times.", divide(totalDistance, sum(speeds))),
          c("FASTEST_SPEED_USED_FOR_WHOLE_ROUTE", "Treat the fastest listed speed as if it applied to every stretch.", divide(totalDistance, maxR(speeds))),
          c("SLOWEST_SPEED_USED_FOR_WHOLE_ROUTE", "Treat the slowest listed speed as if it applied to every stretch.", divide(totalDistance, minR(speeds))),
          c("FINAL_STRETCH_OMITTED", "Add segment times but omit the final stretch.", sum(input.stages.slice(0, -1).map(stageTime))),
        ];
      } else if (input.target === "UNKNOWN_FINAL_SPEED") {
        const priorDistance = sum(input.priorStages.map(timedDistance));
        const remaining = subtract(input.totalDistance, priorDistance);
        const priorDuration = sum(input.priorStages.map((stage) => stage.duration));
        candidates = [
          c("PRIOR_DISTANCE_IGNORED", "Divide the full journey distance by the final-stage duration.", divide(input.totalDistance, input.finalDuration)),
          c("PRIOR_TIME_ADDED_TO_FINAL_DENOMINATOR", "Use remaining distance but divide by all earlier time plus the final-stage duration.", divide(remaining, add(priorDuration, input.finalDuration))),
          c("LAST_KNOWN_SPEED_REUSED", "Carry the previous stage speed forward as the missing final speed.", input.priorStages.at(-1)!.speed),
          c("PRIOR_SPEEDS_AVERAGED", "Use the simple average of previous speeds as the missing final speed.", mean(input.priorStages.map((stage) => stage.speed))),
          c("REMAINING_DISTANCE_OVER_PRIOR_TIME", "Use the remaining final distance but divide it by the time already spent before the final stage.", divide(remaining, priorDuration)),
          c("PRIOR_DISTANCE_OVER_FINAL_TIME", "Use distance already covered as the numerator for the final-stage speed.", divide(priorDistance, input.finalDuration)),
        ];
      } else if (input.target === "EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE") {
        const cycleDistance = sum(input.cycle.map(timedDistance));
        const cycleTime = sum(input.cycle.map((stage) => stage.duration));
        const speeds = input.cycle.map((stage) => stage.speed);
        candidates = [
          c("SIMPLE_SPEED_AVERAGE_FOR_CYCLE", "Replace the repeating schedule by the unweighted average of its stage speeds.", divide(input.distance, mean(speeds))),
          c("PARTIAL_CYCLE_IGNORED", "Count only completed cycles and ignore the final partial stage needed to reach the target distance.", multiply(q(floorRational(divide(input.distance, cycleDistance))), cycleTime)),
          c("FASTEST_STAGE_ASSUMED_CONTINUOUS", "Use the fastest cycle speed for the whole target distance.", divide(input.distance, maxR(speeds))),
          c("SLOWEST_STAGE_ASSUMED_CONTINUOUS", "Use the slowest cycle speed for the whole target distance.", divide(input.distance, minR(speeds))),
        ];
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed discrete target ${input.target}`);
      }
      break;
    }

    case "periodicTravelRestProgramState": {
      const blocks = movementBlocks(input.distance, input.travelSpeed, input.travelDurationPerBlock);
      const rests = blocks - 1n;
      const movingTime = divide(input.distance, input.travelSpeed);
      if (input.target === "COMPLETION_TIME") {
        candidates = [
          c("RESTS_IGNORED", "Use only moving time and omit every scheduled rest.", movingTime),
          c("REST_AFTER_ARRIVAL_CHARGED", "Charge one rest after every movement block, including the final arrival block.", add(movingTime, multiply(q(blocks), input.restDuration))),
          c("FINAL_PARTIAL_BLOCK_TREATED_AS_FULL", "Charge full movement duration for every block before adding the correct pre-arrival rests.", add(multiply(q(blocks), input.travelDurationPerBlock), multiply(q(rests), input.restDuration))),
          c("FULL_BLOCK_AND_FINAL_REST_BOTH_CHARGED", "Treat every movement block as full and also charge a rest after arrival.", multiply(q(blocks), add(input.travelDurationPerBlock, input.restDuration))),
        ];
      } else if (input.target === "REST_COUNT") {
        candidates = [
          c("ARRIVAL_REST_COUNTED", "Count one rest for every movement block, including after final arrival.", q(blocks)),
          c("ONE_REST_SKIPPED", "Stop the rest count one block too early.", q(rests > 0n ? rests - 1n : 0n)),
          c("INITIAL_REST_INVENTED", "Count an extra rest before the first movement spell.", q(blocks + 1n)),
          c("FLOOR_BLOCK_COUNT_USED", "Use completed full movement-block count directly as the rest count.", q(floorRational(divide(input.distance, multiply(input.travelSpeed, input.travelDurationPerBlock))))),
        ];
      } else {
        const totalRestTime = subtract(input.totalElapsedTime, movingTime);
        candidates = [
          c("REST_TIME_DIVIDED_BY_BLOCKS", "Divide total rest time by movement blocks instead of actual rests.", divide(totalRestTime, q(blocks))),
          c("MOVING_TIME_NOT_REMOVED", "Divide the full elapsed time by the number of rests without first removing travel time.", divide(input.totalElapsedTime, q(rests))),
          c("ELAPSED_TIME_DIVIDED_BY_BLOCKS", "Treat each movement block as one equal elapsed-time unit.", divide(input.totalElapsedTime, q(blocks))),
          c("MOVEMENT_DURATION_USED_AS_REST", "Copy the movement duration per block as the inferred rest duration.", input.travelDurationPerBlock),
        ];
      }
      break;
    }

    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") {
        const remainingDistance = subtract(input.totalDistance, input.completedDistance);
        const remainingTime = subtract(input.deadline, input.elapsedTime);
        candidates = [
          c("COMPLETED_DISTANCE_NOT_REMOVED", "Use full route distance with only the remaining time.", divide(input.totalDistance, remainingTime)),
          c("ELAPSED_TIME_NOT_REMOVED", "Use remaining distance but divide by the original full deadline.", divide(remainingDistance, input.deadline)),
          c("AVERAGE_TRIP_SPEED_SUBSTITUTED", "Use full distance divided by full deadline instead of the speed required from now.", divide(input.totalDistance, input.deadline)),
          c("PAST_AVERAGE_SPEED_REUSED", "Reuse the average speed achieved in the completed part.", divide(input.completedDistance, input.elapsedTime)),
          c("COMPLETED_DISTANCE_OVER_REMAINING_TIME", "Use the already completed distance with the time remaining to the deadline.", divide(input.completedDistance, remainingTime)),
          c("REMAINING_DISTANCE_OVER_ELAPSED_TIME", "Use the remaining distance but divide by time already elapsed.", divide(remainingDistance, input.elapsedTime)),
        ];
      } else if (input.target === "REQUIRED_FINAL_TIME") {
        const remainingDistance = subtract(input.totalDistance, input.completedDistance);
        candidates = [
          c("FULL_DISTANCE_USED_FOR_FINAL_STAGE", "Divide the full route distance by the final-stage speed.", divide(input.totalDistance, input.finalSpeed)),
          c("COMPLETED_DISTANCE_USED_AGAIN", "Use the already completed distance as the distance for the final stage.", divide(input.completedDistance, input.finalSpeed)),
          c("ELAPSED_TIME_REUSED", "Confuse time already spent with time still needed.", input.elapsedTime),
          c("PAST_AVERAGE_SPEED_CARRIED_FORWARD", "Use the earlier average speed on the remaining distance.", divide(remainingDistance, divide(input.completedDistance, input.elapsedTime))),
        ];
      } else if (input.target === "STAGE_BOUNDARY_DISTANCE") {
        candidates = ratioSplitCandidates(input.totalDistance, input.firstSpeed, input.secondSpeed);
      } else if (input.target === "DISTANCE_REMAINING_AFTER_STAGES") {
        const completed = input.completedStages.map(timedDistance);
        candidates = [
          c("DURATIONS_SUBTRACTED_AS_DISTANCE", "Subtract listed durations directly from total distance without converting each stage to distance.", subtract(input.totalDistance, sum(input.completedStages.map((stage) => stage.duration)))),
          c("COVERED_DISTANCE_REPORTED", "Report distance already covered instead of distance remaining.", sum(completed)),
          c("ONLY_FIRST_STAGE_SUBTRACTED", "Subtract only the first completed stage from the journey total.", subtract(input.totalDistance, completed[0]!)),
          c("ONLY_FINAL_STAGE_SUBTRACTED", "Subtract only the last completed stage from the journey total.", subtract(input.totalDistance, completed.at(-1)!)),
        ];
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed terminal target ${input.target}`);
      }
      break;
    }

    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") {
        const totalDistance = sum(input.segments.map((stage) => stage.distance));
        const speeds = input.segments.map((stage) => stage.speed);
        candidates = [
          c("UNWEIGHTED_ROUTE_SPEED_AVERAGE", "Use the simple average of segment speeds for the whole route.", divide(totalDistance, mean(speeds))),
          c("FASTEST_SEGMENT_SPEED_FOR_WHOLE_ROUTE", "Use the fastest segment speed for all route distance.", divide(totalDistance, maxR(speeds))),
          c("SLOWEST_SEGMENT_SPEED_FOR_WHOLE_ROUTE", "Use the slowest segment speed for all route distance.", divide(totalDistance, minR(speeds))),
          c("FINAL_ROUTE_SEGMENT_OMITTED", "Add route times but forget the final segment.", sum(input.segments.slice(0, -1).map(stageTime))),
        ];
      } else if (input.target === "DISTANCE_SPLIT_A") {
        candidates = ratioSplitCandidates(input.totalDistance, input.speedA, input.speedB);
      } else if (input.target === "CLOSED_ROUTE_OPPOSITE_MEETING_TIME") {
        const perimeter = sum(input.clockwiseSegments.map((stage) => stage.distance));
        const cwSpeeds = input.clockwiseSegments.map((stage) => stage.speed);
        const ccwSpeeds = input.counterclockwiseSegments.map((stage) => stage.speed);
        candidates = [
          c("FIRST_SEGMENT_SPEEDS_USED_THROUGHOUT", "Treat both runners' first-segment speeds as constant for the whole perimeter.", divide(perimeter, add(cwSpeeds[0]!, ccwSpeeds[0]!))),
          c("UNWEIGHTED_ROUTE_SPEEDS_USED", "Use simple averages of the listed clockwise and counterclockwise speeds.", divide(perimeter, add(mean(cwSpeeds), mean(ccwSpeeds)))),
          c("FASTEST_ROUTE_SPEEDS_USED", "Assume each runner keeps the fastest speed appearing on that route.", divide(perimeter, add(maxR(cwSpeeds), maxR(ccwSpeeds)))),
          c("SLOWEST_ROUTE_SPEEDS_USED", "Assume each runner keeps the slowest speed appearing on that route.", divide(perimeter, add(minR(cwSpeeds), minR(ccwSpeeds)))),
        ];
      } else if (input.target === "FASTEST_ROUTE_INDEX") {
        throw new Error("CP012 fastest-route target uses dedicated route-choice options");
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed route target ${input.target}`);
      }
      break;
    }

    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") {
        candidates = [
          c("ONLY_FIRST_KNOWN_DISTANCE_REMOVED", "Subtract only the first recorded distance from the journey total.", subtract(input.totalDistance, input.knownDistances[0]!)),
          c("KNOWN_DISTANCE_SUM_REPORTED", "Report the sum of recorded distances instead of the missing distance.", sum(input.knownDistances)),
          c("EQUAL_STAGE_SPLIT_ASSUMED", "Ignore recorded values and divide total distance equally across all stages.", divide(input.totalDistance, q(input.knownDistances.length + 1))),
          c("LAST_KNOWN_DISTANCE_COPIED", "Copy the final recorded stage distance into the missing row.", input.knownDistances.at(-1)!),
        ];
      } else if (input.target === "MISSING_TIME") {
        candidates = [
          c("ONLY_FIRST_KNOWN_TIME_REMOVED", "Subtract only the first recorded time from the trip total.", subtract(input.totalTime, input.knownTimes[0]!)),
          c("KNOWN_TIME_SUM_REPORTED", "Report the sum of recorded stage times instead of the missing time.", sum(input.knownTimes)),
          c("EQUAL_TIME_SPLIT_ASSUMED", "Ignore recorded values and divide total time equally across all stages.", divide(input.totalTime, q(input.knownTimes.length + 1))),
          c("LAST_KNOWN_TIME_COPIED", "Copy the final recorded stage time into the missing row.", input.knownTimes.at(-1)!),
        ];
      } else if (input.target === "MISSING_SPEED") {
        candidates = [
          c("DISTANCE_AND_TIME_MULTIPLIED", "Multiply distance by time instead of dividing distance by time.", multiply(input.missingDistance, input.missingTime)),
          c("SPEED_FORMULA_INVERTED", "Use time divided by distance instead of distance divided by time.", divide(input.missingTime, input.missingDistance)),
          c("ROUND_TRIP_TIME_ASSUMED", "Double the stated time before computing the speed.", divide(input.missingDistance, multiply(TWO, input.missingTime))),
          c("ROUND_TRIP_DISTANCE_ASSUMED", "Double the stated distance before computing the speed.", divide(multiply(TWO, input.missingDistance), input.missingTime)),
        ];
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed reconstruction target ${input.target}`);
      }
      break;
    }

    case "trainScheduleSynthesisState": {
      const relativeToward = add(input.speedA, input.speedB);
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") {
        const delayedTravel = multiply(input.speedB, input.delayB);
        candidates = [
          c("SECOND_TRAIN_DELAY_IGNORED", "Assume both trains start together and divide station distance by closing speed.", divide(input.stationDistance, relativeToward)),
          c("DELAY_DISTANCE_SUBTRACTED", "Subtract Train B's delayed-start distance from the station gap instead of adding it in the closure equation.", divide(absRational(subtract(input.stationDistance, delayedTravel)), relativeToward)),
          c("SAME_DIRECTION_RELATIVE_SPEED", "Use the difference of train speeds even though the trains move toward each other.", divide(input.stationDistance, absDiff(input.speedA, input.speedB))),
          c("TIME_MEASURED_FROM_SECOND_DEPARTURE", "Report only the interval after Train B starts, although time is required from Train A's departure.", subtract(solution.answer, input.delayB)),
        ];
      } else if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") {
        const closure = add(add(input.initialGap, input.lengthA), input.lengthB);
        const remaining = subtract(closure, multiply(input.speedA, input.delayB));
        candidates = [
          c("TRAIN_LENGTHS_IGNORED", "Use only the initial nose-to-nose gap and ignore both train lengths.", divide(input.initialGap, relativeToward)),
          c("DELAY_IGNORED", "Use full gap plus both train lengths but assume simultaneous starts.", divide(closure, relativeToward)),
          c("DELAY_DOUBLE_COUNTED", "Add the departure delay to a simultaneous-start crossing time without crediting Train A's early movement.", add(input.delayB, divide(closure, relativeToward))),
          c("MEASURED_FROM_SECOND_DEPARTURE", "Solve only the remaining closure after Train B starts and report that interval alone.", divide(remaining, relativeToward)),
        ];
      } else {
        const delayedClosure = subtract(multiply(relativeToward, input.meetingTimeFromFirstDeparture), input.stationDistance);
        candidates = [
          c("DELAY_DIVIDED_BY_FIRST_TRAIN_SPEED", "Use Train A's speed instead of Train B's speed when converting delayed closure into time.", divide(delayedClosure, input.speedA)),
          c("SIMULTANEOUS_MEETING_TIME_CALLED_DELAY", "Treat the simultaneous-start meeting time itself as Train B's departure delay.", divide(input.stationDistance, relativeToward)),
          c("NAIVE_TIME_DIFFERENCE", "Subtract simultaneous-start meeting time directly from the observed meeting time.", subtract(input.meetingTimeFromFirstDeparture, divide(input.stationDistance, relativeToward))),
          c("STATION_DISTANCE_DIVIDED_BY_SECOND_SPEED", "Treat Train B's solo time across the whole station gap as the departure delay.", divide(input.stationDistance, input.speedB)),
        ];
      }
      break;
    }

    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") {
        candidates = [
          c("BOAT_START_TO_CATCH_INTERVAL_ONLY", "Compute only the interval after the delayed boat starts and forget the raft's head-start time.", divide(multiply(input.currentSpeed, input.boatStartDelay), input.boatStillWaterSpeed)),
          c("UPSTREAM_RELATIVE_SPEED_USED", "Use boat speed minus current as if the downstream chase were upstream.", divide(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay), subtract(input.boatStillWaterSpeed, input.currentSpeed))),
          c("CURRENT_IGNORED_IN_BOAT_GROUND_SPEED", "Use still-water boat speed where downstream ground speed is required.", divide(multiply(input.boatStillWaterSpeed, input.boatStartDelay), subtract(input.boatStillWaterSpeed, input.currentSpeed))),
          c("DELAY_REPORTED_AS_CATCH_TIME", "Report the boat's starting delay itself as the total catch time.", input.boatStartDelay),
        ];
      } else if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") {
        const catchTime = divide(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay), input.boatStillWaterSpeed);
        candidates = [
          c("RAFT_POSITION_AT_BOAT_START", "Report the raft's position when the boat starts, not when it is caught.", multiply(input.currentSpeed, input.boatStartDelay)),
          c("STILL_WATER_BOAT_DISTANCE_DURING_DELAY", "Multiply the boat's still-water speed by the starting delay and report it as catch distance.", multiply(input.boatStillWaterSpeed, input.boatStartDelay)),
          c("DOWNSTREAM_BOAT_DISTANCE_DURING_DELAY", "Use downstream boat speed times the starting delay as catch distance.", multiply(add(input.boatStillWaterSpeed, input.currentSpeed), input.boatStartDelay)),
          c("CATCH_TIME_REPORTED_AS_DISTANCE", "Carry the catch-time magnitude into the distance answer without multiplying by current speed.", catchTime),
        ];
      } else if (input.target === "CURRENT_SPEED") {
        const extra = subtract(input.catchTimeFromRaftStart, input.boatStartDelay);
        candidates = [
          c("TOTAL_CATCH_TIME_USED_IN_NUMERATOR", "Use total raft-to-catch time instead of only the interval beyond the boat's start delay.", divide(multiply(input.boatStillWaterSpeed, input.catchTimeFromRaftStart), input.boatStartDelay)),
          c("DELAY_OVER_TOTAL_TIME_RATIO", "Reverse the time ratio when inferring current speed.", divide(multiply(input.boatStillWaterSpeed, input.boatStartDelay), input.catchTimeFromRaftStart)),
          c("EXTRA_TIME_DIVIDED_BY_TOTAL_TIME", "Scale boat speed by extra catch time over total catch time rather than over start delay.", divide(multiply(input.boatStillWaterSpeed, extra), input.catchTimeFromRaftStart)),
          c("EXTRA_TIME_REPORTED_AS_SPEED", "Use the extra catch-time magnitude directly as a speed.", extra),
        ];
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed medium target ${input.target}`);
      }
      break;
    }

    case "closedTrackRaceSynthesisState": {
      const raceDistance = multiply(input.trackLength, q(input.raceLaps));
      const finishTime = divide(raceDistance, input.fasterSpeed);
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") {
        const slowerTravel = multiply(input.slowerSpeed, finishTime);
        const slowerPosition = modulo(add(input.slowerHeadStart, slowerTravel), input.trackLength);
        candidates = [
          c("HEAD_START_IGNORED", "Compute the slower runner's position at finish time but omit the initial head start.", modulo(subtract(ZERO, modulo(slowerTravel, input.trackLength)), input.trackLength)),
          c("POSITION_REPORTED_AS_GAP", "Report the slower runner's track position instead of the forward gap to the finish point.", slowerPosition),
          c("INITIAL_HEAD_START_USED_AS_FINAL_GAP", "Use only the original head-start complement and ignore running during the race.", modulo(subtract(input.trackLength, input.slowerHeadStart), input.trackLength)),
          c("LAP_WRAP_IGNORED", "Use straight-line distance difference without reducing the slower runner's position modulo track length.", absRational(subtract(raceDistance, add(input.slowerHeadStart, slowerTravel)))),
        ];
      } else if (input.target === "HEAD_START_FOR_DEAD_HEAT") {
        candidates = [
          c("SLOWER_SPEED_IN_DENOMINATOR", "Scale race distance by speed difference over the slower speed.", divide(multiply(raceDistance, subtract(input.fasterSpeed, input.slowerSpeed)), input.slowerSpeed)),
          c("SUM_SPEED_DENOMINATOR", "Use speed difference over speed sum instead of the faster runner's finish time.", divide(multiply(raceDistance, subtract(input.fasterSpeed, input.slowerSpeed)), add(input.fasterSpeed, input.slowerSpeed))),
          c("HEAD_START_COMPLEMENT", "Report the remaining race distance after the correct head start as the head start itself.", subtract(raceDistance, solution.answer)),
          c("ONE_LAP_COMPLEMENT", "Use the complement within one track lap regardless of the stated race length.", absRational(subtract(input.trackLength, solution.answer))),
        ];
      } else {
        const speedDifference = subtract(input.fasterSpeed, input.slowerSpeed);
        candidates = [
          c("OPPOSITE_DIRECTION_RELATIVE_SPEED", "Use speed sum instead of speed difference for a same-direction overtake.", divide(input.slowerHeadStart, add(input.fasterSpeed, input.slowerSpeed))),
          c("FULL_LAP_GAP_USED", "Ignore the stated head start and use a complete lap as the gap to close.", divide(input.trackLength, speedDifference)),
          c("COMPLEMENTARY_GAP_USED", "Use track length minus the head start as the gap to close.", divide(subtract(input.trackLength, input.slowerHeadStart), speedDifference)),
          c("FASTER_SPEED_ALONE_USED", "Divide the head-start gap by the faster runner's speed rather than relative speed.", divide(input.slowerHeadStart, input.fasterSpeed)),
        ];
      }
      break;
    }

    case "movingSurfaceScheduleSynthesisState": {
      const assisted = add(input.personRate, input.surfaceRate);
      if (input.target === "TIME_WITH_STOP_AFTER") {
        const activeDistance = multiply(assisted, input.surfaceActiveTime);
        const remaining = subtract(input.length, activeDistance);
        candidates = [
          c("SURFACE_ACTIVE_FOR_WHOLE_TRIP", "Assume the walkway keeps assisting for the entire crossing.", divide(input.length, assisted)),
          c("SURFACE_IGNORED", "Ignore the moving walkway and use the person's walking rate for the whole length.", divide(input.length, input.personRate)),
          c("ASSISTED_RATE_USED_AFTER_STOP", "Split at the stopping time but keep using assisted rate after the walkway stops.", add(input.surfaceActiveTime, divide(remaining, assisted))),
          c("SURFACE_RATE_USED_AS_PERSON_RATE", "Use the walkway's own rate as the travel rate for the whole crossing.", divide(input.length, input.surfaceRate)),
        ];
      } else if (input.target === "TIME_WITH_DELAYED_ACTIVATION") {
        const walkedBefore = multiply(input.personRate, input.activationDelay);
        const remaining = subtract(input.length, walkedBefore);
        candidates = [
          c("SURFACE_ACTIVE_FROM_START", "Assume the walkway assists from time zero.", divide(input.length, assisted)),
          c("SURFACE_NEVER_ACTIVATES", "Ignore the delayed activation and use walking rate for the full length.", divide(input.length, input.personRate)),
          c("PRE_ACTIVATION_DISTANCE_NOT_REMOVED", "Add the delay to an assisted traversal of the full length instead of the remaining length.", add(input.activationDelay, divide(input.length, assisted))),
          c("DELAY_OMITTED_AFTER_SPLIT", "Use only assisted time for the post-activation remaining distance.", divide(remaining, assisted)),
        ];
      } else if (input.target === "TIME_WITH_DIRECTION_REVERSAL") {
        const firstDistance = multiply(assisted, input.reversalTime);
        const remaining = subtract(input.length, firstDistance);
        candidates = [
          c("REVERSAL_IGNORED", "Assume the surface keeps assisting after the reversal point.", divide(input.length, assisted)),
          c("SURFACE_IGNORED", "Ignore both assistance and opposition from the moving surface.", divide(input.length, input.personRate)),
          c("ASSISTED_RATE_USED_AFTER_REVERSAL", "Split at reversal but keep the assisted rate for the remaining distance.", add(input.reversalTime, divide(remaining, assisted))),
          c("OPPOSING_RATE_USED_FROM_START", "Use person minus surface rate for the whole crossing as if the surface opposed from time zero.", divide(input.length, subtract(input.personRate, input.surfaceRate))),
          c("SURFACE_RATE_ALONE_AFTER_REVERSAL", "After reversal, use the surface's own speed as the traveller's net rate.", add(input.reversalTime, divide(remaining, input.surfaceRate))),
          c("PERSON_RATE_AFTER_REVERSAL", "After reversal, ignore the opposing belt and use only the person's walking rate for the remaining distance.", add(input.reversalTime, divide(remaining, input.personRate))),
        ];
      } else {
        throw new Error(`CP012 distractors do not cover unreviewed moving-surface target ${input.target}`);
      }
      break;
    }

    case "twoEngineInverseState": {
      const determinant = subtract(multiply(input.a1, input.b2), multiply(input.a2, input.b1));
      const x = divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), determinant);
      const y = divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), determinant);
      if (input.target === "X") {
        candidates = [
          c("SECOND_VARIABLE_SET_TO_ZERO_EQ1", "Solve the first observation for x as if y were zero.", divide(input.c1, input.a1)),
          c("SECOND_VARIABLE_SET_TO_ZERO_EQ2", "Solve the second observation for x as if y were zero.", divide(input.c2, input.a2)),
          c("VARIABLES_SWAPPED", "Return the solved y-value when the question asks for x.", y),
          c("DETERMINANT_SIGN_REVERSED", "Reverse determinant sign while leaving the x numerator unchanged.", divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), subtract(ZERO, determinant))),
          c("FIRST_EQUATION_DIVIDED_BY_OTHER_COEFFICIENT", "Divide the first equation constant by the y coefficient and report it as x.", divide(input.c1, input.b1)),
        ];
      } else {
        candidates = [
          c("FIRST_VARIABLE_SET_TO_ZERO_EQ1", "Solve the first observation for y as if x were zero.", divide(input.c1, input.b1)),
          c("FIRST_VARIABLE_SET_TO_ZERO_EQ2", "Solve the second observation for y as if x were zero.", divide(input.c2, input.b2)),
          c("VARIABLES_SWAPPED", "Return the solved x-value when the question asks for y.", x),
          c("DETERMINANT_SIGN_REVERSED", "Reverse determinant sign while leaving the y numerator unchanged.", divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), subtract(ZERO, determinant))),
          c("FIRST_EQUATION_DIVIDED_BY_X_COEFFICIENT", "Divide the first equation constant by the x coefficient and report it as y.", divide(input.c1, input.a1)),
          c("SECOND_EQUATION_SIGN_IGNORED", "Ignore the sign of the second equation's y coefficient before isolating y with x set to zero.", absRational(divide(input.c2, input.b2))),
        ];
      }
      break;
    }

    case "feasibleParameterSetState": {
      if (input.target !== "COUNT") throw new Error("CP012 feasible-set scalar distractors require COUNT target");
      candidates = feasibleCandidates(input).map((candidate) => c(candidate.misconceptionId, candidate.calculation, q(candidate.values.length)));
      break;
    }
  }

  return pickScalar(solution.answer, candidates);
}
