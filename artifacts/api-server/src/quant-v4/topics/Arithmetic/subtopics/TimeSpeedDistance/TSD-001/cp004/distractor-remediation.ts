import { add, compare, divide, equals, isPositive, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { deriveCp004WrongWorkings } from "./distractors";
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

function directionRelative(input: TsdCp004CoreInput, reverse = false): Rational | null {
  if (!input.speedA || !input.speedB) return null;
  const same = input.directionCase === "SAME";
  if (same !== reverse) {
    const value = subtract(input.speedA, input.speedB);
    return isPositive(value) ? value : null;
  }
  return add(input.speedA, input.speedB);
}

function plausible(
  value: Rational,
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): boolean {
  if (!isPositive(value) || equals(value, solution.answer)) return false;
  if ((mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") && input.routeDistance) {
    if (compare(value, input.routeDistance) >= 0) return false;
  }
  if (solution.unit === "CLOCK_MINUTE" || solution.unit === "RATIO") return true;
  const lower = divide(solution.answer, rational(4));
  const upper = multiply(solution.answer, rational(4));
  return compare(value, lower) >= 0 && compare(value, upper) <= 0;
}

function semanticFallbacks(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const rows: TsdCp004WrongWorking[] = [];
  const correctRelative = directionRelative(input);
  const wrongRelative = directionRelative(input, true);
  const push = (candidate: TsdCp004WrongWorking | null) => {
    if (!candidate || !plausible(candidate.value, mode, input, solution)) return;
    if (rows.some((entry) => equals(entry.value, candidate.value))) return;
    rows.push(candidate);
  };

  if (mode === "findRelativeSpeedOppositeDirections" || mode === "findRelativeSpeedSameDirection") {
    if (input.speedA) push(row("USE_ONE_SPEED_ONLY", input.speedA, "take only the first vehicle's speed", "Relative speed depends on the motion of both vehicles."));
    if (input.speedB) push(row("USE_ONE_SPEED_ONLY", input.speedB, "take only the second vehicle's speed", "The second vehicle's speed alone is not the rate of change of the gap."));
    if (input.speedA && input.speedB) push(row("USE_AVERAGE_SPEED", divide(add(input.speedA, input.speedB), rational(2)), "average the two speeds", "Average speed is unrelated to the rate at which the gap changes."));
  }

  if (mode === "findMeetingTimeFromInitialSeparation" || mode === "findCatchUpTimeFromHeadStartDistance") {
    const gap = mode === "findCatchUpTimeFromHeadStartDistance" ? need(input, "headStartDistance") : need(input, "initialSeparation");
    if (input.speedA) push(row("USE_ONE_SPEED_ONLY", divide(gap, input.speedA), "gap ÷ faster/first speed", "The meeting condition depends on relative speed, not the first vehicle alone."));
    if (input.speedB) push(row("USE_ONE_SPEED_ONLY", divide(gap, input.speedB), "gap ÷ slower/second speed", "The second vehicle alone does not close the stated gap."));
    if (wrongRelative) push(row(input.directionCase === "SAME" || mode === "findCatchUpTimeFromHeadStartDistance" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", divide(gap, wrongRelative), "gap ÷ relative speed from the wrong direction rule", "The sum/difference rule for relative speed was reversed."));
  }

  if (mode === "findDelayedStartCatchUpTime") {
    const delay = need(input, "startDelay");
    const headStart = multiply(need(input, "speedB"), delay);
    push(row("TREAT_DELAY_AS_PURSUIT_TIME", delay, "take the departure delay itself as catch-up time", "The delay creates a distance lead; it is not the pursuit duration."));
    push(row("USE_ONE_SPEED_ONLY", divide(headStart, need(input, "speedA")), "head-start distance ÷ pursuer speed", "The target vehicle keeps moving, so closing speed must be used."));
    if (wrongRelative) push(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(headStart, wrongRelative), "head-start distance ÷ sum of speeds", "Same-direction pursuit uses the speed difference."));
  }

  if (mode === "findStartDelayFromCatchUpState") {
    const pursuit = need(input, "meetingTime");
    const closing = subtract(need(input, "speedA"), need(input, "speedB"));
    const headStart = multiply(closing, pursuit);
    push(row("TREAT_DELAY_AS_PURSUIT_TIME", pursuit, "copy the pursuit time as the start delay", "The pursuit duration and the earlier start delay are different intervals."));
    push(row("USE_ONE_SPEED_ONLY", divide(headStart, need(input, "speedA")), "head-start distance ÷ faster speed", "The lead was built by the slower vehicle before the faster vehicle started."));
    push(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(multiply(add(need(input, "speedA"), need(input, "speedB")), pursuit), need(input, "speedB")), "use sum speed to reconstruct the lead", "The catch-up phase is governed by closing speed, not sum speed."));
  }

  if (["findInitialSeparationFromMeetingTime", "findHeadStartDistanceFromCatchUpTime", "findUnknownStartPointGap", "findRelativeDistanceCoveredInGivenTime"].includes(mode)) {
    const duration = mode === "findRelativeDistanceCoveredInGivenTime" ? need(input, "elapsedTime") : need(input, "meetingTime");
    if (input.speedA) push(row("USE_ONE_SPEED_ONLY", multiply(input.speedA, duration), "first vehicle's speed × time", "This counts only one vehicle's contribution to the relative distance."));
    if (input.speedB) push(row("USE_ONE_SPEED_ONLY", multiply(input.speedB, duration), "second vehicle's speed × time", "This counts only the other vehicle's contribution."));
    if (wrongRelative) push(row(input.directionCase === "SAME" || mode === "findHeadStartDistanceFromCatchUpTime" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", multiply(wrongRelative, duration), "wrong relative speed × time", "The direction rule for relative speed was reversed."));
  }

  if (mode === "findRelativeSpeedFromMeetingTime") {
    const gap = need(input, "initialSeparation");
    const time = need(input, "meetingTime");
    push(row("USE_ONE_SPEED_ONLY", divide(gap, multiply(time, rational(2))), "split the closed gap equally and report one body's assumed speed", "The question asks for relative speed, not an assumed one-body share."));
    push(row("MULTIPLY_INSTEAD_OF_DIVIDE", divide(multiply(gap, rational(2)), time), "count the closed gap twice before dividing by time", "The same relative gap has been double-counted."));
    push(row("DIVIDE_INSTEAD_OF_MULTIPLY", divide(time, gap), "time ÷ gap", "Speed is distance divided by time, not its reciprocal."));
  }

  if (["findIndividualSpeedFromRelativeSpeedAndOtherSpeed", "findFasterSpeedFromCatchUpState", "findSlowerSpeedFromCatchUpState"].includes(mode)) {
    const relative = mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" ? need(input, "relativeSpeed") : divide(need(input, "headStartDistance"), need(input, "meetingTime"));
    const known = mode === "findSlowerSpeedFromCatchUpState" ? need(input, "speedA") : need(input, "speedB");
    push(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", relative, "report relative/closing speed as the requested body speed", "Relative speed still has to be combined with the known speed."));
    push(row("COPY_KNOWN_SPEED", known, "copy the given vehicle's speed", "The other vehicle's speed is required."));
    const reversed = mode === "findSlowerSpeedFromCatchUpState" ? add(known, relative) : subtract(known, relative);
    if (isPositive(reversed)) push(row("REVERSE_RELATIVE_DECOMPOSITION", reversed, "reverse the final add/subtract relation", "The faster/slower decomposition has been reversed."));
  }

  if (mode === "findSeparationAfterMovingApart") {
    const initial = need(input, "initialSeparation"), time = need(input, "elapsedTime");
    push(row("USE_ONE_SPEED_ONLY", add(initial, multiply(need(input, "speedA"), time)), "initial gap + first vehicle's distance", "The second vehicle also increases the separation."));
    push(row("USE_ONE_SPEED_ONLY", add(initial, multiply(need(input, "speedB"), time)), "initial gap + second vehicle's distance", "Both outward motions contribute to the later separation."));
    const diff = subtract(need(input, "speedA"), need(input, "speedB"));
    if (isPositive(diff)) push(row("USE_DIFFERENCE_INSTEAD_OF_SUM", add(initial, multiply(diff, time)), "initial gap + speed difference × time", "Opposite outward directions use sum speed."));
  }

  if (mode === "findInitialGapFromLaterSeparation") {
    const later = need(input, "specifiedSeparation"), time = need(input, "elapsedTime");
    const byA = subtract(later, multiply(need(input, "speedA"), time));
    const byB = subtract(later, multiply(need(input, "speedB"), time));
    if (isPositive(byA)) push(row("USE_ONE_SPEED_ONLY", byA, "later separation − first vehicle's distance", "The other vehicle's outward movement has been ignored."));
    if (isPositive(byB)) push(row("USE_ONE_SPEED_ONLY", byB, "later separation − second vehicle's distance", "Both vehicles contributed to the increase in separation."));
    const diff = subtract(need(input, "speedA"), need(input, "speedB"));
    if (isPositive(diff)) {
      const wrong = subtract(later, multiply(diff, time));
      if (isPositive(wrong)) push(row("USE_DIFFERENCE_INSTEAD_OF_SUM", wrong, "later separation − speed difference × time", "Outward opposite motion increases separation at sum speed."));
    }
  }

  if (mode === "findTimeUntilSpecifiedSeparation") {
    const initial = need(input, "initialSeparation"), target = need(input, "specifiedSeparation");
    const change = input.directionCase === "SAME" ? subtract(initial, target) : subtract(target, initial);
    if (correctRelative) push(row("IGNORE_INITIAL_GAP", divide(target, correctRelative), "final gap ÷ relative speed", "Only the required change in separation should be divided by relative speed."));
    if (input.speedA) push(row("USE_ONE_SPEED_ONLY", divide(change, input.speedA), "required change ÷ first vehicle's speed", "The gap changes according to relative speed."));
    if (input.speedB) push(row("USE_ONE_SPEED_ONLY", divide(change, input.speedB), "required change ÷ second vehicle's speed", "The second speed alone is not the gap-change rate."));
  }

  if (mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") {
    const route = need(input, "routeDistance");
    const first = mode === "findMeetingPointDistanceSplit" ? need(input, "speedA") : need(input, "ratioA");
    const second = mode === "findMeetingPointDistanceSplit" ? need(input, "speedB") : need(input, "ratioB");
    push(row("ASSUME_MIDPOINT", divide(route, rational(2)), "take half the route", "The midpoint is correct only when the two speeds are equal."));
    push(row("REVERSE_MEETING_RATIO", divide(multiply(route, second), add(first, second)), "use the second share while measuring from the first end", "This gives the distance from the opposite endpoint."));
    const diff = subtract(first, second);
    const absDiff = isPositive(diff) ? diff : subtract(second, first);
    push(row("USE_ROUTE_DIFFERENCE", divide(multiply(route, absDiff), add(first, second)), "use speed-ratio difference as the first distance share", "At first meeting, the route is divided by the actual speed shares, not by their difference."));
  }

  if (mode === "findSpeedRatioFromMeetingPoint") {
    const da = need(input, "distanceA"), db = need(input, "distanceB");
    push(row("REVERSE_MEETING_RATIO", divide(db, da), "reverse the two meeting distances", "The speed ratio follows the corresponding distances in the same order."));
    push(row("ASSUME_MIDPOINT", rational(1), "assume equal speeds (1:1)", "Meeting at unequal distances rules out equal speeds."));
    push(row("USE_ROUTE_DIFFERENCE", divide(add(da, db), db), "use total route : second distance", "The speed ratio comes directly from the two distances covered in equal time."));
  }

  if (mode === "findMeetingClockTime" || mode === "findDepartureClockTimeFromMeetingState") {
    if (!correctRelative) return rows;
    const durationMinutes = multiply(divide(need(input, "initialSeparation"), correctRelative), rational(60));
    if (mode === "findMeetingClockTime") {
      const start = need(input, "departureMinute");
      push(row("COPY_DEPARTURE_CLOCK", start, "copy the departure time", "The travel duration must be added to the start time."));
      const back = subtract(start, durationMinutes);
      if (back.numerator >= 0n) push(row("SUBTRACT_MEETING_DURATION", back, "departure time − meeting duration", "The meeting occurs after departure, not before it."));
      push(row("DOUBLE_MEETING_DURATION", add(start, multiply(durationMinutes, rational(2))), "departure time + twice the travel duration", "The meeting duration should be added exactly once."));
    } else {
      const meeting = need(input, "meetingClockMinute");
      push(row("COPY_MEETING_CLOCK", meeting, "copy the meeting time", "The earlier departure time must be recovered."));
      push(row("ADD_MEETING_DURATION", add(meeting, durationMinutes), "meeting time + travel duration", "Departure occurred before the meeting."));
      const twice = subtract(meeting, multiply(durationMinutes, rational(2)));
      if (twice.numerator >= 0n) push(row("DOUBLE_MEETING_DURATION", twice, "meeting time − twice the travel duration", "The travel duration should be subtracted only once."));
    }
  }

  if (mode === "findSpeedNeededToAvoidOrCauseMeeting") {
    const requiredRelative = divide(need(input, "initialSeparation"), need(input, "targetTime"));
    const other = need(input, "speedB");
    push(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", requiredRelative, "report gap ÷ target time as the vehicle speed", "That is the required relative speed; the known vehicle's speed must still be decomposed."));
    push(row("COPY_KNOWN_SPEED", other, "copy the known vehicle's speed", "The requested speed is constrained by the target meeting time."));
    const reversed = input.directionCase === "OPPOSITE" ? add(requiredRelative, other) : subtract(requiredRelative, other);
    if (isPositive(reversed)) push(row("REVERSE_TARGET_DECOMPOSITION", reversed, "use the wrong sign when decomposing relative speed", "The directional relation between body speed and relative speed was reversed."));
  }

  return Object.freeze(rows);
}

export function deriveExamReadyCp004WrongWorkings(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const accepted: TsdCp004WrongWorking[] = [];
  const push = (working: TsdCp004WrongWorking) => {
    if (!plausible(working.value, mode, input, solution)) return;
    if (accepted.some((entry) => equals(entry.value, working.value))) return;
    accepted.push(working);
  };

  for (const working of deriveCp004WrongWorkings(mode, input, solution)) {
    if (working.calculation.startsWith("alter final arithmetic")) continue;
    push(working);
  }
  for (const working of semanticFallbacks(mode, input, solution)) {
    if (accepted.length >= 3) break;
    push(working);
  }

  if (accepted.length < 3) {
    throw new Error(`${mode}: fewer than three semantic, plausible distractors after misconception audit`);
  }
  return Object.freeze(accepted.slice(0, 3));
}
