import { add, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp001SolveInput } from "./canonical-solver";
import { formatClock, formatExamNumber } from "./runtime-support";

type ClockInput = Extract<TsdCp001SolveInput, {
  solveMode: "arrivalClockTime" | "departureClockTime" | "elapsedClockTime";
}>;

const MINUTES_PER_DAY = 1440n;

function requireWholeMinutes(value: Rational, label: string): bigint {
  if (value.denominator !== 1n) throw new Error(`${label} must use whole minutes`);
  return value.numerator;
}

function absoluteClock(totalMinutes: Rational): string {
  const total = requireWholeMinutes(totalMinutes, "Clock value");
  const dayOffset = total >= 0n ? total / MINUTES_PER_DAY : -1n;
  const minuteOfDay = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return formatClock(rational(minuteOfDay), dayOffset);
}

function durationParts(duration: Rational): { hours: bigint; minutes: bigint } {
  const total = requireWholeMinutes(duration, "Journey time");
  return { hours: total / 60n, minutes: total % 60n };
}

function durationText(duration: Rational): string {
  const { hours, minutes } = durationParts(duration);
  if (hours === 0n) return `${minutes} ${minutes === 1n ? "minute" : "minutes"}`;
  if (minutes === 0n) return `${hours} ${hours === 1n ? "hour" : "hours"}`;
  return `${hours} ${hours === 1n ? "hour" : "hours"} ${minutes} ${minutes === 1n ? "minute" : "minutes"}`;
}

function boundaryExplanation(absoluteArrival: Rational): string {
  const total = requireWholeMinutes(absoluteArrival, "Arrival time");
  if (total === 720n) {
    return "The result is 12:00 PM, which means 12 noon—not 12 midnight.";
  }
  if (total === 1440n) {
    return "The result is 12:00 AM at midnight, so the date has moved to the next day.";
  }
  if (total > 1440n) {
    return "The clock passes 12:00 AM at midnight, so the final time must be written as next day.";
  }
  return "The complete journey remains within the same calendar day.";
}

function arrivalWorking(
  input: Extract<ClockInput, { solveMode: "arrivalClockTime" }>,
  answer: string,
): readonly string[] {
  const { hours, minutes } = durationParts(input.durationMinutes);
  const start = input.departureMinuteOfDay;
  const afterHours = add(start, rational(hours * 60n));
  const absoluteArrival = add(start, input.durationMinutes);
  return [
    "Break the journey time into complete hours and the remaining minutes before moving forward on the clock.",
    `Journey time = ${formatExamNumber(input.durationMinutes)} minutes = ${durationText(input.durationMinutes)}`,
    `After adding ${hours} ${hours === 1n ? "hour" : "hours"}: ${absoluteClock(start)} → ${absoluteClock(afterHours)}`,
    `After adding the remaining ${minutes} ${minutes === 1n ? "minute" : "minutes"}: ${absoluteClock(afterHours)} → ${absoluteClock(absoluteArrival)}`,
    boundaryExplanation(absoluteArrival),
    `Therefore, the arrival time is ${answer}.`,
  ];
}

function departureWorking(
  input: Extract<ClockInput, { solveMode: "departureClockTime" }>,
  answer: string,
): readonly string[] {
  const { hours, minutes } = durationParts(input.durationMinutes);
  const absoluteArrival = add(
    input.arrivalMinuteOfDay,
    multiply(rational(input.arrivalDayOffset), rational(1440)),
  );
  const afterHours = subtract(absoluteArrival, rational(hours * 60n));
  const departure = subtract(afterHours, rational(minutes));
  const boundaryLine = requireWholeMinutes(absoluteArrival, "Arrival time") === 720n
    ? "Moving backward through 12 noon changes PM back to AM."
    : requireWholeMinutes(absoluteArrival, "Arrival time") >= 1440n
      ? "The arrival is on the next day; subtracting the journey time moves backward across midnight into the previous evening."
      : "The subtraction remains within the same calendar day.";
  return [
    "To find the starting time, move backward from the arrival time by the complete journey duration.",
    `Journey time = ${formatExamNumber(input.durationMinutes)} minutes = ${durationText(input.durationMinutes)}`,
    `After subtracting ${hours} ${hours === 1n ? "hour" : "hours"}: ${absoluteClock(absoluteArrival)} → ${absoluteClock(afterHours)}`,
    `After subtracting the remaining ${minutes} ${minutes === 1n ? "minute" : "minutes"}: ${absoluteClock(afterHours)} → ${absoluteClock(departure)}`,
    boundaryLine,
    `Therefore, the departure time is ${answer}.`,
  ];
}

function elapsedWorking(
  input: Extract<ClockInput, { solveMode: "elapsedClockTime" }>,
  answer: string,
): readonly string[] {
  const absoluteArrival = add(
    input.arrivalMinuteOfDay,
    multiply(rational(input.arrivalDayOffset), rational(1440)),
  );
  const elapsed = subtract(absoluteArrival, input.departureMinuteOfDay);
  const arrivalTotal = requireWholeMinutes(absoluteArrival, "Arrival time");

  if (input.arrivalDayOffset === 1n) {
    const toMidnight = subtract(rational(1440), input.departureMinuteOfDay);
    const afterMidnight = input.arrivalMinuteOfDay;
    const lines = [
      "Because the journey ends on the next day, split the interval at 12:00 AM midnight.",
      `From ${absoluteClock(input.departureMinuteOfDay)} to 12:00 AM next day = ${formatExamNumber(toMidnight)} minutes`,
    ];
    if (afterMidnight.numerator === 0n) {
      lines.push("The arrival is exactly at midnight, so there is no additional time after 12:00 AM.");
    } else {
      lines.push(`From 12:00 AM to ${absoluteClock(absoluteArrival)} = ${formatExamNumber(afterMidnight)} minutes`);
    }
    lines.push(`Total journey time = ${formatExamNumber(toMidnight)} + ${formatExamNumber(afterMidnight)} = ${formatExamNumber(elapsed)} minutes`);
    lines.push(`This is ${durationText(elapsed)}.`);
    lines.push(arrivalTotal === 1440n
      ? "Here 12:00 AM is midnight on the next day, not noon."
      : "The words ‘next day’ are essential because the clock has crossed midnight.");
    lines.push(`Therefore, the total journey time is ${answer}.`);
    return lines;
  }

  const { hours, minutes } = durationParts(elapsed);
  const afterHours = add(input.departureMinuteOfDay, rational(hours * 60n));
  return [
    "Both times are on the same day, so move forward from the starting time to the arrival time.",
    `From ${absoluteClock(input.departureMinuteOfDay)} to ${absoluteClock(afterHours)} = ${hours} ${hours === 1n ? "hour" : "hours"}`,
    `From ${absoluteClock(afterHours)} to ${absoluteClock(absoluteArrival)} = ${minutes} ${minutes === 1n ? "minute" : "minutes"}`,
    `Total journey time = ${hours * 60n} + ${minutes} = ${formatExamNumber(elapsed)} minutes`,
    arrivalTotal === 720n
      ? "The endpoint 12:00 PM is noon; it must not be read as midnight."
      : boundaryExplanation(absoluteArrival),
    `Therefore, the total journey time is ${answer}.`,
  ];
}

export function clockWorkingLines(input: ClockInput, answer: string): readonly string[] {
  switch (input.solveMode) {
    case "arrivalClockTime":
      return arrivalWorking(input, answer);
    case "departureClockTime":
      return departureWorking(input, answer);
    case "elapsedClockTime":
      return elapsedWorking(input, answer);
  }
}
