import { add, multiply, rational, toMixedString } from "../foundation/rational";
import type { PaceUnit, SpeedUnit } from "../foundation/units";
import type { GeneratedState } from "./runtime-types";
import { PACE_LABEL, SPEED_LABEL, SeededRng, formatClock, r } from "./runtime-support";

export function paceState(mode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime", rng: SeededRng): GeneratedState {
  const pace = r(rng.pick([4, 5, 6, 8, 10, 12]));
  const paceUnit: PaceUnit = "MINUTE_PER_KM";
  if (mode === "speedFromPace") {
    const outputUnit: SpeedUnit = rng.pick(["KMPH", "MPS"] as const);
    return {
      input: { solveMode: mode, pace, paceUnit, outputUnit },
      stem: `A runner takes ${toMixedString(pace)} minutes to cover 1 km. Find the speed in ${SPEED_LABEL[outputUnit]}.`,
      display: {
        unit: SPEED_LABEL[outputUnit],
        formula: outputUnit === "KMPH" ? "Speed = 60 ÷ time taken for 1 km" : "Convert minutes into seconds, then use Speed = Distance ÷ Time",
        givens: [`Time for 1 km = ${toMixedString(pace)} minutes`],
        shortcut: outputUnit === "KMPH" ? "Divide 60 by the minutes taken for 1 km." : "Convert the time into seconds first.",
      },
    };
  }
  if (mode === "paceFromSpeed") {
    const speed = r(rng.pick([6, 8, 10, 12, 15, 20]));
    const speedUnit: SpeedUnit = "KMPH";
    return {
      input: { solveMode: mode, speed, speedUnit, outputUnit: paceUnit },
      stem: `A runner moves at ${toMixedString(speed)} km/h. How many minutes will the runner take to cover 1 km?`,
      display: {
        unit: PACE_LABEL[paceUnit],
        formula: "Time for 1 km = 60 ÷ Speed",
        givens: [`Speed = ${toMixedString(speed)} km/h`],
        shortcut: "Divide 60 by the speed in km/h.",
      },
    };
  }
  const duration = r(rng.pick([20, 30, 40, 45, 60, 90]));
  return {
    input: { solveMode: mode, pace, paceUnit, duration, timeUnit: "MINUTE", outputUnit: "KM" },
    stem: `A runner takes ${toMixedString(pace)} minutes to cover 1 km. How much distance will be covered in ${toMixedString(duration)} minutes?`,
    display: {
      unit: "km",
      formula: "Distance = Total time ÷ Time taken for 1 km",
      givens: [`Time for 1 km = ${toMixedString(pace)} minutes`, `Total time = ${toMixedString(duration)} minutes`],
      shortcut: "Divide the total minutes by the minutes taken for 1 km.",
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
