import { add, compare, divide, equals, isPositive, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004MisconceptionId, TsdCp004WrongWorking } from "./runtime-types";

function need(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): Rational {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value)) throw new Error(`missing ${String(key)}`);
  return value as Rational;
}

function row(
  misconceptionId: Exclude<TsdCp004MisconceptionId, "CORRECT">,
  value: Rational,
  calculation: string,
  diagnosis: string,
): TsdCp004WrongWorking {
  return Object.freeze({ misconceptionId, value, calculation, diagnosis });
}

function relative(input: TsdCp004CoreInput, reversed = false): Rational | null {
  if (!input.speedA || !input.speedB) return null;
  const same = input.directionCase === "SAME";
  if (same !== reversed) {
    const diff = subtract(input.speedA, input.speedB);
    return isPositive(diff) ? diff : null;
  }
  return add(input.speedA, input.speedB);
}

function positiveDifference(a: Rational, b: Rational): Rational | null {
  const value = compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a);
  return isPositive(value) ? value : null;
}

function plausible(value: Rational, mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): boolean {
  if (equals(value, solution.answer)) return false;
  if (solution.unit === "CLOCK_MINUTE") return value.denominator === 1n && value.numerator >= 0n && value.numerator < 2880n;
  if (!isPositive(value)) return false;

  if (solution.unit === "SPEED") return compare(value, rational(180)) <= 0;
  if (solution.unit === "TIME") return compare(value, rational(24)) <= 0;
  if (solution.unit === "RATIO") return compare(value, rational(1, 10)) >= 0 && compare(value, rational(10)) <= 0;

  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && input.routeDistance) {
    return compare(value, input.routeDistance) < 0;
  }
  return compare(value, rational(1500)) <= 0;
}

function push(target: TsdCp004WrongWorking[], candidate: TsdCp004WrongWorking | null, mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): void {
  if (!candidate || !plausible(candidate.value, mode, input, solution)) return;
  if (target.some((entry) => equals(entry.value, candidate.value))) return;
  target.push(candidate);
}

export function deriveStrongCp004WrongWorkings(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const candidates: TsdCp004WrongWorking[] = [];
  const addCandidate = (candidate: TsdCp004WrongWorking | null) => push(candidates, candidate, mode, input, solution);
  const correctRelative = relative(input);
  const wrongRelative = relative(input, true);

  if (mode === "findRelativeSpeedOppositeDirections" || mode === "findRelativeSpeedSameDirection") {
    if (wrongRelative) addCandidate(row(
      mode === "findRelativeSpeedSameDirection" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM",
      wrongRelative,
      "apply the opposite direction rule to the two speeds",
      "The learner reverses the sum/difference rule for relative speed.",
    ));
    if (input.speedA) addCandidate(row("USE_ONE_SPEED_ONLY", input.speedA, "use speed A alone as relative speed", "Only one body's speed is used."));
    if (input.speedB) addCandidate(row("USE_ONE_SPEED_ONLY", input.speedB, "use speed B alone as relative speed", "Only the other body's speed is used."));
    if (input.speedA && input.speedB) addCandidate(row("USE_AVERAGE_SPEED", divide(add(input.speedA, input.speedB), rational(2)), "average the two speeds", "Average speed is confused with relative speed."));
  }

  else if (mode === "findMeetingTimeFromInitialSeparation" || mode === "findCatchUpTimeFromHeadStartDistance") {
    const gap = mode === "findCatchUpTimeFromHeadStartDistance" ? need(input, "headStartDistance") : need(input, "initialSeparation");
    if (wrongRelative) addCandidate(row(
      input.directionCase === "SAME" || mode === "findCatchUpTimeFromHeadStartDistance" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM",
      divide(gap, wrongRelative),
      "gap ÷ relative speed from the wrong direction rule",
      "The correct gap is divided by the wrong closing/opening rate.",
    ));
    if (input.speedA) addCandidate(row("USE_ONE_SPEED_ONLY", divide(gap, input.speedA), "gap ÷ speed A", "The learner uses the faster/first body's speed instead of relative speed."));
    if (input.speedB) addCandidate(row("USE_ONE_SPEED_ONLY", divide(gap, input.speedB), "gap ÷ speed B", "The learner uses the slower/second body's speed instead of relative speed."));
    if (input.speedA && input.speedB) addCandidate(row("USE_AVERAGE_SPEED", divide(gap, divide(add(input.speedA, input.speedB), rational(2))), "gap ÷ average of the two speeds", "Average speed is incorrectly substituted for closing speed."));
  }

  else if (["findInitialSeparationFromMeetingTime", "findHeadStartDistanceFromCatchUpTime", "findUnknownStartPointGap", "findRelativeDistanceCoveredInGivenTime"].includes(mode)) {
    const time = mode === "findRelativeDistanceCoveredInGivenTime" ? need(input, "elapsedTime") : need(input, "meetingTime");
    if (wrongRelative) addCandidate(row(
      input.directionCase === "SAME" || mode === "findHeadStartDistanceFromCatchUpTime" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM",
      multiply(wrongRelative, time),
      "wrong relative speed × time",
      "The direction rule is reversed before reconstructing the distance.",
    ));
    if (input.speedA) addCandidate(row("USE_ONE_SPEED_ONLY", multiply(input.speedA, time), "speed A × time", "Only the distance of the first/faster body is counted."));
    if (input.speedB) addCandidate(row("USE_ONE_SPEED_ONLY", multiply(input.speedB, time), "speed B × time", "Only the distance of the second/slower body is counted."));
    if (input.speedA && input.speedB) addCandidate(row("USE_AVERAGE_SPEED", multiply(divide(add(input.speedA, input.speedB), rational(2)), time), "average speed × time", "Average speed is used instead of the rate at which the gap changes."));
  }

  else if (mode === "findRelativeSpeedFromMeetingTime") {
    const gap = need(input, "initialSeparation");
    const time = need(input, "meetingTime");
    const relativeSpeed = divide(gap, time);
    addCandidate(row("USE_AVERAGE_SPEED", divide(relativeSpeed, rational(2)), "assume each body accounts for half the relative rate", "The learner reports one equal-share component instead of the relative speed."));
    addCandidate(row("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(relativeSpeed, rational(2)), "double the gap-closing rate", "The learner double-counts the two-body contribution after already using relative distance."));
    if (input.speedB) {
      addCandidate(row("COPY_KNOWN_SPEED", input.speedB, "copy the stated individual speed", "The known body's speed is reported instead of the relative speed."));
      const decomposed = input.directionCase === "SAME" ? add(relativeSpeed, input.speedB) : subtract(relativeSpeed, input.speedB);
      if (isPositive(decomposed)) addCandidate(row("REVERSE_RELATIVE_DECOMPOSITION", decomposed, "decompose the relative speed into an individual speed", "The question asks for relative speed, but the learner continues to solve for one body."));
    }
    addCandidate(row("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(gap, time), "gap × elapsed time", "Distance is multiplied by time instead of divided by it."));
  }

  else if (mode === "findDelayedStartCatchUpTime") {
    const delay = need(input, "startDelay");
    const slower = need(input, "speedB");
    const faster = need(input, "speedA");
    const headStart = multiply(slower, delay);
    const closing = subtract(faster, slower);
    addCandidate(row("TREAT_DELAY_AS_PURSUIT_TIME", delay, "copy the start delay as pursuit time", "The head-start interval is confused with the later chase duration."));
    addCandidate(row("USE_ONE_SPEED_ONLY", divide(headStart, faster), "head-start distance ÷ pursuer speed", "The pursuer's full speed is used instead of closing speed."));
    addCandidate(row("IGNORE_START_DELAY", divide(multiply(faster, delay), closing), "use pursuer speed × delay as the head-start distance", "The wrong vehicle is assumed to travel during the start delay."));
    addCandidate(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(headStart, add(faster, slower)), "head-start distance ÷ sum of speeds", "Same-direction pursuit is incorrectly treated as opposite-direction motion."));
  }

  else if (mode === "findStartDelayFromCatchUpState") {
    const pursuit = need(input, "meetingTime");
    const faster = need(input, "speedA");
    const slower = need(input, "speedB");
    const closing = subtract(faster, slower);
    const headStart = multiply(closing, pursuit);
    addCandidate(row("TREAT_DELAY_AS_PURSUIT_TIME", pursuit, "copy pursuit time as start delay", "The chase duration is confused with the earlier lead time."));
    addCandidate(row("USE_ONE_SPEED_ONLY", divide(headStart, faster), "head-start distance ÷ faster speed", "The delay belongs to the slower vehicle's earlier travel, not the faster vehicle."));
    addCandidate(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(multiply(add(faster, slower), pursuit), slower), "sum speed × pursuit time ÷ slower speed", "The chase is treated as opposite-direction motion."));
    addCandidate(row("REVERSE_RELATIVE_DECOMPOSITION", divide(headStart, closing), "head-start distance ÷ closing speed", "This simply returns the pursuit time instead of reconstructing the start delay."));
  }

  else if (["findIndividualSpeedFromRelativeSpeedAndOtherSpeed", "findFasterSpeedFromCatchUpState", "findSlowerSpeedFromCatchUpState"].includes(mode)) {
    const relativeSpeed = mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed"
      ? need(input, "relativeSpeed")
      : divide(need(input, "headStartDistance"), need(input, "meetingTime"));
    const known = mode === "findSlowerSpeedFromCatchUpState" ? need(input, "speedA") : need(input, "speedB");
    addCandidate(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", relativeSpeed, "report relative/closing speed as the body speed", "The learner stops after finding the relative speed."));
    addCandidate(row("COPY_KNOWN_SPEED", known, "copy the known body's speed", "The given speed is mistaken for the requested speed."));
    const reverse = mode === "findSlowerSpeedFromCatchUpState" || (mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" && input.directionCase === "OPPOSITE")
      ? add(known, relativeSpeed)
      : subtract(known, relativeSpeed);
    if (isPositive(reverse)) addCandidate(row("REVERSE_RELATIVE_DECOMPOSITION", reverse, "reverse the final add/subtract relation", "The relative speed is decomposed with the wrong sign."));
    const alternate = mode === "findSlowerSpeedFromCatchUpState" || (mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" && input.directionCase === "OPPOSITE")
      ? subtract(known, relativeSpeed)
      : add(known, relativeSpeed);
    if (isPositive(alternate)) addCandidate(row("REVERSE_RELATIVE_DECOMPOSITION", alternate, "apply the other directional decomposition", "The learner applies the pursuit/opposite-direction relation to the wrong case."));
  }

  else if (mode === "findSeparationAfterMovingApart") {
    const initial = need(input, "initialSeparation");
    const time = need(input, "elapsedTime");
    const a = need(input, "speedA"), b = need(input, "speedB");
    const diff = positiveDifference(a, b);
    if (diff) addCandidate(row("USE_DIFFERENCE_INSTEAD_OF_SUM", add(initial, multiply(diff, time)), "initial gap + speed difference × time", "Opposite movement apart is wrongly treated like same-direction motion."));
    addCandidate(row("IGNORE_INITIAL_GAP", multiply(add(a, b), time), "sum speed × time", "Only the increase in separation is reported; the original gap is omitted."));
    addCandidate(row("USE_ONE_SPEED_ONLY", add(initial, multiply(a, time)), "initial gap + first body's distance", "Only one body's contribution to increasing separation is counted."));
    addCandidate(row("USE_ONE_SPEED_ONLY", add(initial, multiply(b, time)), "initial gap + second body's distance", "Only the other body's contribution is counted."));
  }

  else if (mode === "findInitialGapFromLaterSeparation") {
    const later = need(input, "specifiedSeparation");
    const time = need(input, "elapsedTime");
    const a = need(input, "speedA"), b = need(input, "speedB");
    const diff = positiveDifference(a, b);
    if (diff) addCandidate(row("USE_DIFFERENCE_INSTEAD_OF_SUM", subtract(later, multiply(diff, time)), "later separation − speed difference × time", "The increase in separation is calculated with speed difference instead of sum."));
    addCandidate(row("USE_ONE_SPEED_ONLY", subtract(later, multiply(a, time)), "later separation − first body's distance", "Only one body's travel is removed from the later gap."));
    addCandidate(row("USE_ONE_SPEED_ONLY", subtract(later, multiply(b, time)), "later separation − second body's distance", "Only the other body's travel is removed from the later gap."));
    addCandidate(row("IGNORE_INITIAL_GAP", multiply(add(a, b), time), "sum speed × time", "The increase in separation is mistaken for the initial separation."));
  }

  else if (mode === "findTimeUntilSpecifiedSeparation") {
    const initial = need(input, "initialSeparation");
    const target = need(input, "specifiedSeparation");
    const change = input.directionCase === "SAME" ? subtract(initial, target) : subtract(target, initial);
    if (wrongRelative) addCandidate(row(
      input.directionCase === "SAME" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM",
      divide(change, wrongRelative),
      "required change in gap ÷ wrong relative speed",
      "The correct change in separation is divided by the wrong rate.",
    ));
    if (correctRelative) {
      addCandidate(row("IGNORE_INITIAL_GAP", divide(target, correctRelative), "final separation ÷ relative speed", "The final gap is used instead of the change in gap."));
      addCandidate(row("IGNORE_INITIAL_GAP", divide(initial, correctRelative), "initial separation ÷ relative speed", "The starting gap is used instead of the required change."));
      addCandidate(row("REVERSE_RELATIVE_DECOMPOSITION", divide(add(initial, target), correctRelative), "(initial + target separation) ÷ relative speed", "The two gaps are added rather than differenced."));
    }
  }

  else if (mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") {
    const route = need(input, "routeDistance");
    const first = mode === "findMeetingPointDistanceSplit" ? need(input, "speedA") : need(input, "ratioA");
    const second = mode === "findMeetingPointDistanceSplit" ? need(input, "speedB") : need(input, "ratioB");
    addCandidate(row("ASSUME_MIDPOINT", divide(route, rational(2)), "route ÷ 2", "The meeting point is incorrectly assumed to be the midpoint."));
    addCandidate(row("REVERSE_MEETING_RATIO", divide(multiply(route, second), add(first, second)), "route × second part ÷ sum of parts", "The distance from the opposite endpoint is reported."));
    const difference = positiveDifference(first, second);
    if (difference) addCandidate(row("USE_ROUTE_DIFFERENCE", divide(multiply(route, difference), add(first, second)), "route × speed/ratio difference ÷ sum", "The speed advantage share is mistaken for distance travelled from the first endpoint."));
    addCandidate(row("USE_ROUTE_DIFFERENCE", divide(multiply(route, first), add(add(first, second), second)), "route × first part ÷ (first + twice second)", "The second speed/ratio part is counted twice in the total."));
  }

  else if (mode === "findSpeedRatioFromMeetingPoint") {
    const a = need(input, "distanceA"), b = need(input, "distanceB");
    addCandidate(row("REVERSE_MEETING_RATIO", divide(b, a), "reverse the two meeting distances", "The order of the requested speed ratio is reversed."));
    addCandidate(row("ASSUME_MIDPOINT", rational(1), "assume equal speeds, 1:1", "Equal speeds are assumed despite unequal meeting distances."));
    addCandidate(row("USE_ROUTE_DIFFERENCE", divide(add(a, b), b), "total route ÷ second traveller's distance", "The whole route is used as one ratio term instead of the first traveller's distance."));
    addCandidate(row("USE_ROUTE_DIFFERENCE", divide(a, add(a, b)), "first traveller's distance ÷ total route", "A route fraction is reported instead of the ratio of the two speeds."));
  }

  else if (mode === "findMeetingClockTime" || mode === "findDepartureClockTimeFromMeetingState") {
    if (!correctRelative) throw new Error(`${mode}: relative speed missing`);
    const durationMinutes = multiply(divide(need(input, "initialSeparation"), correctRelative), rational(60));
    if (mode === "findMeetingClockTime") {
      const start = need(input, "departureMinute");
      addCandidate(row("COPY_DEPARTURE_CLOCK", start, "copy departure time", "The travel duration is omitted."));
      const backwards = subtract(start, durationMinutes);
      if (backwards.numerator >= 0n) addCandidate(row("SUBTRACT_MEETING_DURATION", backwards, "departure time − meeting duration", "The duration is shifted in the wrong direction on the clock."));
      addCandidate(row("DOUBLE_MEETING_DURATION", add(start, multiply(durationMinutes, rational(2))), "departure time + twice the meeting duration", "The duration is added twice."));
    } else {
      const meeting = need(input, "meetingClockMinute");
      addCandidate(row("COPY_MEETING_CLOCK", meeting, "copy meeting time", "The earlier departure time is not reconstructed."));
      addCandidate(row("ADD_MEETING_DURATION", add(meeting, durationMinutes), "meeting time + duration", "The duration is added instead of subtracted."));
      const twice = subtract(meeting, multiply(durationMinutes, rational(2)));
      if (twice.numerator >= 0n) addCandidate(row("DOUBLE_MEETING_DURATION", twice, "meeting time − twice the duration", "The meeting duration is subtracted twice."));
    }
  }

  else if (mode === "findSpeedNeededToAvoidOrCauseMeeting") {
    const requiredRelative = divide(need(input, "initialSeparation"), need(input, "targetTime"));
    const other = need(input, "speedB");
    addCandidate(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", requiredRelative, "gap ÷ target time", "The required relative speed is reported as the requested vehicle's speed."));
    addCandidate(row("COPY_KNOWN_SPEED", other, "copy the known vehicle's speed", "The given speed is mistaken for the required unknown speed."));
    const reverse = input.directionCase === "OPPOSITE" ? add(requiredRelative, other) : subtract(requiredRelative, other);
    if (isPositive(reverse)) addCandidate(row("REVERSE_TARGET_DECOMPOSITION", reverse, "decompose required relative speed with the wrong sign", "The direction-specific final add/subtract is reversed."));
    const halfCondition = divide(requiredRelative, rational(2));
    addCandidate(row("USE_AVERAGE_SPEED", halfCondition, "split required relative speed equally between the two vehicles", "The learner assumes equal contribution despite one speed being given."));
  }

  if (candidates.length < 3) {
    throw new Error(`${mode}: V2 distractor engine produced only ${candidates.length} strong misconception candidates`);
  }

  return Object.freeze(candidates.slice(0, 4));
}
