import { add, divide, equals, isPositive, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004MisconceptionId, TsdCp004ReviewUnit, TsdCp004WrongWorking } from "./runtime-types";

function need(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): Rational {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value)) throw new Error(`missing ${String(key)}`);
  return value as Rational;
}

function row(id: Exclude<TsdCp004MisconceptionId, "CORRECT">, value: Rational, calculation: string, diagnosis: string): TsdCp004WrongWorking {
  return Object.freeze({ misconceptionId: id, value, calculation, diagnosis });
}

function rel(input: TsdCp004CoreInput, reverse = false): Rational | null {
  if (!input.speedA || !input.speedB) return null;
  const same = input.directionCase === "SAME";
  if (same !== reverse) {
    const value = subtract(input.speedA, input.speedB);
    return isPositive(value) ? value : null;
  }
  return add(input.speedA, input.speedB);
}

function pushUnique(target: TsdCp004WrongWorking[], candidate: TsdCp004WrongWorking | null, answer: Rational, clock: boolean): void {
  if (!candidate || equals(candidate.value, answer)) return;
  if (!clock && !isPositive(candidate.value)) return;
  if (target.some((entry) => equals(entry.value, candidate.value))) return;
  target.push(candidate);
}

export function deriveCp004WrongWorkings(mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): readonly TsdCp004WrongWorking[] {
  const wrongs: TsdCp004WrongWorking[] = [];
  const correctRelative = rel(input);
  const wrongRelative = rel(input, true);
  const clock = solution.unit === "CLOCK_MINUTE";
  const addWrong = (candidate: TsdCp004WrongWorking | null) => pushUnique(wrongs, candidate, solution.answer, clock);

  if (mode === "findRelativeSpeedOppositeDirections" || mode === "findRelativeSpeedSameDirection") {
    if (wrongRelative) addWrong(row(mode === "findRelativeSpeedSameDirection" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", wrongRelative, "use the opposite direction rule", "The sum/difference rule for relative speed was reversed."));
    if (input.speedA) addWrong(row("USE_ONE_SPEED_ONLY", input.speedA, "use one body's speed", "Relative speed depends on both bodies."));
    if (input.speedA && input.speedB) addWrong(row("USE_AVERAGE_SPEED", divide(add(input.speedA, input.speedB), rational(2)), "average the two speeds", "Average speed is not the rate at which the gap changes."));
  } else if (mode === "findMeetingTimeFromInitialSeparation" || mode === "findCatchUpTimeFromHeadStartDistance") {
    const gap = mode === "findCatchUpTimeFromHeadStartDistance" ? need(input, "headStartDistance") : need(input, "initialSeparation");
    if (wrongRelative) addWrong(row(input.directionCase === "SAME" || mode === "findCatchUpTimeFromHeadStartDistance" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", divide(gap, wrongRelative), "gap ÷ wrong relative speed", "The relative-speed direction rule was reversed."));
    if (input.speedA) addWrong(row("USE_ONE_SPEED_ONLY", divide(gap, input.speedA), "gap ÷ one speed", "Meeting time uses relative speed, not one body's speed."));
    if (correctRelative) addWrong(row("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(gap, correctRelative), "gap × relative speed", "Time equals distance divided by speed."));
  } else if (mode === "findDelayedStartCatchUpTime") {
    const delay = need(input, "startDelay");
    addWrong(row("TREAT_DELAY_AS_PURSUIT_TIME", delay, "copy the start delay", "The delay creates a head start; it is not the pursuit time."));
    if (wrongRelative) addWrong(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(multiply(need(input, "speedB"), delay), wrongRelative), "head start ÷ sum speed", "Same-direction pursuit uses closing speed."));
    if (correctRelative) addWrong(row("IGNORE_START_DELAY", divide(need(input, "speedB"), correctRelative), "slower speed ÷ closing speed", "The duration of the head start was omitted."));
  } else if (mode === "findStartDelayFromCatchUpState") {
    const pursuit = need(input, "meetingTime");
    addWrong(row("TREAT_DELAY_AS_PURSUIT_TIME", pursuit, "copy pursuit time", "Pursuit time and start delay are different quantities."));
    if (wrongRelative) addWrong(row("USE_SUM_INSTEAD_OF_DIFFERENCE", divide(multiply(wrongRelative, pursuit), need(input, "speedB")), "sum speed × pursuit ÷ slower speed", "Same-direction pursuit uses the speed difference."));
    if (correctRelative) addWrong(row("IGNORE_START_DELAY", multiply(correctRelative, pursuit), "closing speed × pursuit", "This is the head-start distance, not the start delay."));
  } else if (["findInitialSeparationFromMeetingTime", "findHeadStartDistanceFromCatchUpTime", "findUnknownStartPointGap", "findRelativeDistanceCoveredInGivenTime"].includes(mode)) {
    const duration = mode === "findRelativeDistanceCoveredInGivenTime" ? need(input, "elapsedTime") : need(input, "meetingTime");
    if (wrongRelative) addWrong(row(input.directionCase === "SAME" || mode === "findHeadStartDistanceFromCatchUpTime" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", multiply(wrongRelative, duration), "wrong relative speed × time", "The direction rule for relative speed was reversed."));
    if (input.speedA) addWrong(row("USE_ONE_SPEED_ONLY", multiply(input.speedA, duration), "one speed × time", "The target is relative distance, so both bodies matter."));
    if (correctRelative) addWrong(row("DIVIDE_INSTEAD_OF_MULTIPLY", divide(correctRelative, duration), "relative speed ÷ time", "Distance equals speed multiplied by time."));
  } else if (mode === "findRelativeSpeedFromMeetingTime") {
    const gap = need(input, "initialSeparation"), time = need(input, "meetingTime");
    addWrong(row("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(gap, time), "gap × time", "Speed equals distance divided by time."));
    addWrong(row("USE_ONE_SPEED_ONLY", gap, "copy the gap", "Distance and speed are different quantities."));
    addWrong(row("DIVIDE_INSTEAD_OF_MULTIPLY", divide(time, gap), "time ÷ gap", "The speed relation was inverted."));
  } else if (["findIndividualSpeedFromRelativeSpeedAndOtherSpeed", "findFasterSpeedFromCatchUpState", "findSlowerSpeedFromCatchUpState"].includes(mode)) {
    const relative = mode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" ? need(input, "relativeSpeed") : divide(need(input, "headStartDistance"), need(input, "meetingTime"));
    const known = mode === "findSlowerSpeedFromCatchUpState" ? need(input, "speedA") : need(input, "speedB");
    addWrong(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", relative, "use closing/relative speed as body speed", "Relative speed still has to be decomposed."));
    addWrong(row("COPY_KNOWN_SPEED", known, "copy the known speed", "The other body's speed is requested."));
    const reverse = mode === "findSlowerSpeedFromCatchUpState" ? add(known, relative) : subtract(known, relative);
    if (isPositive(reverse)) addWrong(row("REVERSE_RELATIVE_DECOMPOSITION", reverse, "reverse the add/subtract decomposition", "The faster/slower relation was reversed."));
  } else if (mode === "findSeparationAfterMovingApart" || mode === "findInitialGapFromLaterSeparation") {
    const time = need(input, "elapsedTime");
    const sum = add(need(input, "speedA"), need(input, "speedB"));
    const diff = subtract(need(input, "speedA"), need(input, "speedB"));
    if (mode === "findSeparationAfterMovingApart") {
      const initial = need(input, "initialSeparation");
      if (isPositive(diff)) addWrong(row("USE_DIFFERENCE_INSTEAD_OF_SUM", add(initial, multiply(diff, time)), "initial gap + speed difference × time", "Bodies moving apart in opposite directions use sum speed."));
      addWrong(row("IGNORE_INITIAL_GAP", multiply(sum, time), "sum speed × time", "The original separation was omitted."));
      addWrong(row("USE_ONE_SPEED_ONLY", add(initial, multiply(need(input, "speedA"), time)), "initial gap + one body's distance", "Both bodies increase the separation."));
    } else {
      const later = need(input, "specifiedSeparation");
      if (isPositive(diff)) addWrong(row("USE_DIFFERENCE_INSTEAD_OF_SUM", subtract(later, multiply(diff, time)), "later gap − speed difference × time", "The separation grew at sum speed."));
      addWrong(row("IGNORE_INITIAL_GAP", multiply(sum, time), "sum speed × time", "This is only the increase in separation."));
      addWrong(row("REVERSE_RELATIVE_DECOMPOSITION", add(later, multiply(sum, time)), "later gap + increase", "Recover the initial gap by subtracting the increase."));
    }
  } else if (mode === "findTimeUntilSpecifiedSeparation") {
    const initial = need(input, "initialSeparation"), target = need(input, "specifiedSeparation");
    const change = input.directionCase === "SAME" ? subtract(initial, target) : subtract(target, initial);
    if (wrongRelative) addWrong(row(input.directionCase === "SAME" ? "USE_SUM_INSTEAD_OF_DIFFERENCE" : "USE_DIFFERENCE_INSTEAD_OF_SUM", divide(change, wrongRelative), "required gap change ÷ wrong relative speed", "The direction rule for relative speed was reversed."));
    if (correctRelative) addWrong(row("IGNORE_INITIAL_GAP", divide(target, correctRelative), "final separation ÷ relative speed", "Use the change in separation, not the final separation."));
    if (correctRelative) addWrong(row("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(change, correctRelative), "gap change × relative speed", "Time equals distance change divided by speed."));
  } else if (mode === "findMeetingPointDistanceSplit" || mode === "findMeetingPointFromSpeedRatio") {
    const route = need(input, "routeDistance");
    const first = mode === "findMeetingPointDistanceSplit" ? need(input, "speedA") : need(input, "ratioA");
    const second = mode === "findMeetingPointDistanceSplit" ? need(input, "speedB") : need(input, "ratioB");
    addWrong(row("ASSUME_MIDPOINT", divide(route, rational(2)), "route ÷ 2", "The midpoint is valid only for equal speeds."));
    addWrong(row("REVERSE_MEETING_RATIO", divide(multiply(route, second), add(first, second)), "route × second part ÷ total parts", "This gives the distance from the other endpoint."));
    const difference = subtract(first, second);
    if (isPositive(difference)) addWrong(row("USE_ROUTE_DIFFERENCE", divide(multiply(route, first), difference), "route × first part ÷ difference", "First-meeting division uses the sum of ratio parts."));
  } else if (mode === "findSpeedRatioFromMeetingPoint") {
    const da = need(input, "distanceA"), db = need(input, "distanceB");
    addWrong(row("REVERSE_MEETING_RATIO", divide(db, da), "reverse distance ratio", "The speed ratio follows the corresponding distance ratio in the same order."));
    addWrong(row("ASSUME_MIDPOINT", rational(1), "assume 1:1", "Equal speeds are not implied."));
    addWrong(row("USE_ROUTE_DIFFERENCE", divide(add(da, db), db), "total route ÷ second distance", "Use the two meeting distances directly."));
  } else if (mode === "findMeetingClockTime" || mode === "findDepartureClockTimeFromMeetingState") {
    if (!correctRelative) throw new Error(`${mode}: relative speed missing`);
    const durationMinutes = multiply(divide(need(input, "initialSeparation"), correctRelative), rational(60));
    if (mode === "findMeetingClockTime") {
      const start = need(input, "departureMinute");
      addWrong(row("COPY_DEPARTURE_CLOCK", start, "copy departure clock", "The meeting duration must be added."));
      const back = subtract(start, durationMinutes); if (back.numerator >= 0n) addWrong(row("SUBTRACT_MEETING_DURATION", back, "departure − duration", "The meeting happens after departure."));
      addWrong(row("DOUBLE_MEETING_DURATION", add(start, multiply(durationMinutes, rational(2))), "departure + 2 × duration", "Add the meeting duration once."));
    } else {
      const meeting = need(input, "meetingClockMinute");
      addWrong(row("COPY_MEETING_CLOCK", meeting, "copy meeting clock", "The earlier departure time must be recovered."));
      addWrong(row("ADD_MEETING_DURATION", add(meeting, durationMinutes), "meeting + duration", "Departure is before the meeting."));
      const twice = subtract(meeting, multiply(durationMinutes, rational(2))); if (twice.numerator >= 0n) addWrong(row("DOUBLE_MEETING_DURATION", twice, "meeting − 2 × duration", "Subtract the duration once."));
    }
  } else if (mode === "findSpeedNeededToAvoidOrCauseMeeting") {
    const requiredRelative = divide(need(input, "initialSeparation"), need(input, "targetTime"));
    const other = need(input, "speedB");
    addWrong(row("USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED", requiredRelative, "gap ÷ target time", "This is the required relative speed, not the requested body speed."));
    addWrong(row("COPY_KNOWN_SPEED", other, "copy other body's speed", "The target meeting condition changes the requested speed."));
    const reverse = input.directionCase === "OPPOSITE" ? add(requiredRelative, other) : subtract(requiredRelative, other);
    if (isPositive(reverse)) addWrong(row("REVERSE_TARGET_DECOMPOSITION", reverse, "reverse directional decomposition", "The required relative speed was decomposed with the wrong sign."));
  }

  for (const offset of [rational(1), rational(2), rational(3), rational(5)]) {
    if (wrongs.length >= 3) break;
    addWrong(row("USE_ONE_SPEED_ONLY", add(solution.answer, offset), `alter final arithmetic by ${formatExamNumber(offset)}`, "This value does not satisfy the relative-motion equation."));
  }
  if (wrongs.length < 3) throw new Error(`${mode}: fewer than three distinct wrong workings`);
  return Object.freeze(wrongs.slice(0, 3));
}

export function reviewUnit(solution: TsdCp004CoreSolution): TsdCp004ReviewUnit {
  if (solution.unit === "SPEED") return "KMPH";
  if (solution.unit === "TIME") return "HOUR";
  if (solution.unit === "DISTANCE") return "KM";
  if (solution.unit === "RATIO") return "RATIO";
  return "CLOCK_MINUTE";
}

export function formatCp004Answer(value: Rational, unit: TsdCp004ReviewUnit): string {
  if (unit === "KMPH") return `${formatExamNumber(value)} km/h`;
  if (unit === "HOUR") return formatDurationHours(value);
  if (unit === "KM") return `${formatExamNumber(value)} km`;
  if (unit === "CLOCK_MINUTE") return formatClockMinute(value);
  return `${value.numerator}:${value.denominator}`;
}
