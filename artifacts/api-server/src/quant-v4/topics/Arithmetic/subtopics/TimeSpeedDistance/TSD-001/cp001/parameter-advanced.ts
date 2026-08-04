import { add, multiply, rational, toMixedString } from "../foundation/rational";
import type { DistanceUnit, PaceUnit, SpeedUnit, TimeUnit } from "../foundation/units";
import type { GeneratedState } from "./runtime-types";
import { DISTANCE_LABEL, PACE_LABEL, SPEED_LABEL, TIME_LABEL, SeededRng, formatClock, r } from "./runtime-support";

interface SpeedFromPaceCase {
  readonly pace: ReturnType<typeof r>;
  readonly paceUnit: PaceUnit;
  readonly outputUnit: SpeedUnit;
  readonly paceText: string;
}

interface PaceFromSpeedCase {
  readonly speed: ReturnType<typeof r>;
  readonly speedUnit: SpeedUnit;
  readonly outputUnit: PaceUnit;
  readonly speedText: string;
}

interface DistanceFromPaceCase {
  readonly pace: ReturnType<typeof r>;
  readonly paceUnit: PaceUnit;
  readonly duration: ReturnType<typeof r>;
  readonly timeUnit: TimeUnit;
  readonly outputUnit: DistanceUnit;
  readonly paceText: string;
  readonly durationText: string;
}

export function paceState(mode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime", rng: SeededRng): GeneratedState {
  if (mode === "speedFromPace") {
    const cases: readonly SpeedFromPaceCase[] = [
      { pace: r(12), paceUnit: "MINUTE_PER_KM", outputUnit: "KMPH", paceText: "12 minutes" },
      { pace: r(8), paceUnit: "MINUTE_PER_KM", outputUnit: "KMPH", paceText: "8 minutes" },
      { pace: r(6), paceUnit: "MINUTE_PER_KM", outputUnit: "KMPH", paceText: "6 minutes" },
      { pace: r(200), paceUnit: "SECOND_PER_KM", outputUnit: "MPS", paceText: "200 seconds" },
      { pace: r(250), paceUnit: "SECOND_PER_KM", outputUnit: "MPS", paceText: "250 seconds" },
    ];
    const selected = rng.pick(cases);
    const kilometreText = selected.paceUnit === "MINUTE_PER_KM" ? "60 minutes" : "1000 metres";
    return {
      input: {
        solveMode: mode,
        pace: selected.pace,
        paceUnit: selected.paceUnit,
        outputUnit: selected.outputUnit,
      },
      stem: `A runner takes ${selected.paceText} to cover 1 km. Find the speed in ${SPEED_LABEL[selected.outputUnit]}.`,
      display: {
        unit: SPEED_LABEL[selected.outputUnit],
        formula: selected.outputUnit === "KMPH"
          ? "Speed = 60 ÷ minutes taken for 1 km"
          : "Speed = 1000 metres ÷ seconds taken for 1 km",
        givens: [`Time for 1 km = ${selected.paceText}`],
        shortcut: selected.outputUnit === "KMPH"
          ? `One kilometre is covered in the given part of ${kilometreText}, so divide 60 by the minutes.`
          : "One kilometre is 1000 metres, so divide 1000 by the seconds taken.",
      },
    };
  }

  if (mode === "paceFromSpeed") {
    const cases: readonly PaceFromSpeedCase[] = [
      { speed: r(6), speedUnit: "KMPH", outputUnit: "MINUTE_PER_KM", speedText: "6 km/h" },
      { speed: r(8), speedUnit: "KMPH", outputUnit: "MINUTE_PER_KM", speedText: "8 km/h" },
      { speed: r(20), speedUnit: "KMPH", outputUnit: "MINUTE_PER_KM", speedText: "20 km/h" },
      { speed: r(5), speedUnit: "MPS", outputUnit: "SECOND_PER_KM", speedText: "5 m/s" },
      { speed: r(8), speedUnit: "MPS", outputUnit: "SECOND_PER_KM", speedText: "8 m/s" },
    ];
    const selected = rng.pick(cases);
    const asksMinutes = selected.outputUnit === "MINUTE_PER_KM";
    return {
      input: {
        solveMode: mode,
        speed: selected.speed,
        speedUnit: selected.speedUnit,
        outputUnit: selected.outputUnit,
      },
      stem: asksMinutes
        ? `A runner moves at ${selected.speedText}. What is the runner's pace in minutes per kilometre?`
        : `A runner moves at ${selected.speedText}. What is the runner's pace in seconds per kilometre?`,
      display: {
        unit: PACE_LABEL[selected.outputUnit],
        formula: asksMinutes ? "Pace in minutes/km = 60 ÷ speed in km/h" : "Pace in seconds/km = 1000 ÷ speed in m/s",
        givens: [`Speed = ${selected.speedText}`],
        shortcut: asksMinutes
          ? "Divide 60 by the speed in km/h to obtain minutes per kilometre."
          : "Divide 1000 metres by the speed in metres per second to obtain seconds per kilometre.",
      },
    };
  }

  const cases: readonly DistanceFromPaceCase[] = [
    {
      pace: r(10),
      paceUnit: "MINUTE_PER_KM",
      duration: r(20),
      timeUnit: "MINUTE",
      outputUnit: "KM",
      paceText: "10 minutes",
      durationText: "20 minutes",
    },
    {
      pace: r(12),
      paceUnit: "MINUTE_PER_KM",
      duration: r(30),
      timeUnit: "MINUTE",
      outputUnit: "KM",
      paceText: "12 minutes",
      durationText: "30 minutes",
    },
    {
      pace: r(10),
      paceUnit: "MINUTE_PER_KM",
      duration: r(90),
      timeUnit: "MINUTE",
      outputUnit: "KM",
      paceText: "10 minutes",
      durationText: "90 minutes",
    },
    {
      pace: r(200),
      paceUnit: "SECOND_PER_KM",
      duration: r(500),
      timeUnit: "SECOND",
      outputUnit: "M",
      paceText: "200 seconds",
      durationText: "500 seconds",
    },
    {
      pace: r(250),
      paceUnit: "SECOND_PER_KM",
      duration: r(750),
      timeUnit: "SECOND",
      outputUnit: "M",
      paceText: "250 seconds",
      durationText: "750 seconds",
    },
  ];
  const selected = rng.pick(cases);
  return {
    input: {
      solveMode: mode,
      pace: selected.pace,
      paceUnit: selected.paceUnit,
      duration: selected.duration,
      timeUnit: selected.timeUnit,
      outputUnit: selected.outputUnit,
    },
    stem: `A runner takes ${selected.paceText} to cover 1 km. How much distance will be covered in ${selected.durationText}? Give the answer in ${DISTANCE_LABEL[selected.outputUnit]}.`,
    display: {
      unit: DISTANCE_LABEL[selected.outputUnit],
      formula: `Distance in kilometres = total ${TIME_LABEL[selected.timeUnit]} ÷ ${TIME_LABEL[selected.timeUnit]} taken for 1 km`,
      givens: [`Time for 1 km = ${selected.paceText}`, `Total time = ${selected.durationText}`],
      shortcut: selected.outputUnit === "KM"
        ? `Divide the total ${TIME_LABEL[selected.timeUnit]} by the ${TIME_LABEL[selected.timeUnit]} taken for 1 km.`
        : "First find the distance in kilometres, then multiply by 1000 to express it in metres.",
    },
  };
}

export function deadlineState(rng: SeededRng): GeneratedState {
  const cases = [
    { distance: 72, availableMinutes: 90 },
    { distance: 72, availableMinutes: 120 },
    { distance: 105, availableMinutes: 150 },
    { distance: 120, availableMinutes: 180 },
    { distance: 120, availableMinutes: 240 },
    { distance: 180, availableMinutes: 300 },
  ] as const;
  const selected = rng.pick(cases);
  const distance = r(selected.distance);
  const departure = r(rng.pick([360, 420, 510, 600, 720, 840]));
  const availableMinutes = r(selected.availableMinutes);
  const absoluteDeadline = add(departure, availableMinutes);
  const deadlineDayOffset = absoluteDeadline.numerator >= 1440n ? 1n : 0n;
  const deadlineMinute = rational(absoluteDeadline.numerator % 1440n, absoluteDeadline.denominator);
  return {
    input: {
      solveMode: "requiredUniformSpeedForDeadline",
      distance,
      distanceUnit: "KM",
      departureMinuteOfDay: departure,
      deadlineMinuteOfDay: deadlineMinute,
      deadlineDayOffset,
      outputUnit: "KMPH",
    },
    stem: `A car starts at ${formatClock(departure, 0n)} and has to cover ${toMixedString(distance)} km by ${formatClock(deadlineMinute, deadlineDayOffset)}. Find the minimum speed required.`,
    display: {
      unit: "km/h",
      formula: "Required speed = Distance ÷ Available time",
      givens: [`Distance = ${toMixedString(distance)} km`, `Available time = ${toMixedString(availableMinutes)} minutes`],
      shortcut: "Convert the available time into hours first.",
    },
  };
}

// These two generators are retained for solver and validator QA only.
// They are deliberately excluded from the learner-facing review export.
export function classificationState(rng: SeededRng): GeneratedState {
  const variant = rng.int(0, 3);
  if (variant === 0) {
    return {
      input: { solveMode: "classifyUniformMotionState", distanceMetres: r(600), speedMps: r(10) },
      stem: "A QA record gives distance and speed but no time. Is the missing value determinable?",
      display: { formula: "Use distance = speed × time", givens: ["Distance and speed are known"], shortcut: "Two values determine the third." },
    };
  }
  if (variant === 1) {
    return {
      input: { solveMode: "classifyUniformMotionState", distanceMetres: r(600), speedMps: r(10), durationSeconds: r(60) },
      stem: "A QA record gives 600 m, 10 m/s and 60 seconds. Are the values consistent?",
      display: { formula: "Check distance = speed × time", givens: ["600 m", "10 m/s", "60 seconds"], shortcut: "Multiply speed by time." },
    };
  }
  if (variant === 2) {
    return {
      input: { solveMode: "classifyUniformMotionState", speedMps: r(10) },
      stem: "A QA record gives only speed. Is the information sufficient?",
      display: { formula: "One value is not enough", givens: ["Only speed is known"], shortcut: "Distance and time are both unknown." },
    };
  }
  return {
    input: { solveMode: "classifyUniformMotionState", distanceMetres: r(650), speedMps: r(10), durationSeconds: r(60) },
    stem: "A QA record gives 650 m, 10 m/s and 60 seconds. Are the values consistent?",
    display: { formula: "Check distance = speed × time", givens: ["650 m", "10 m/s", "60 seconds"], shortcut: "Multiply speed by time." },
  };
}

export function claimState(rng: SeededRng): GeneratedState {
  const speed = r(rng.pick([5, 8, 10, 12, 15]));
  const time = r(rng.pick([30, 45, 60, 75, 90]));
  const trueDistance = multiply(speed, time);
  const isTrue = rng.int(0, 1) === 1;
  const distance = isTrue ? trueDistance : add(trueDistance, r(rng.pick([10, 20, 30, 50])));
  return {
    input: { solveMode: "verifyUniformMotionClaim", distanceMetres: distance, speedMps: speed, durationSeconds: time },
    stem: `A QA record claims ${toMixedString(speed)} m/s for ${toMixedString(time)} seconds gives ${toMixedString(distance)} metres. Is it correct?`,
    display: { formula: "Check distance = speed × time", givens: [`${toMixedString(speed)} m/s`, `${toMixedString(time)} seconds`, `${toMixedString(distance)} m`], shortcut: "Multiply speed by time." },
  };
}
