import { add, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { solveTsdCp011 } from "./executable-solver";
import type { TsdCp011Direction, TsdCp011ExecutableCase, TsdCp011ExecutableInput } from "./executable-types";
import { TSD_CP011_LEARNER_AUTHORITIES, type TsdCp011AuthorityKey } from "./source-saturation";

function movingSurfaceInput(index: number): TsdCp011ExecutableInput {
  const personRate = rational(4 + (index % 4));
  const surfaceRate = rational(1 + (index % 2));
  const direction: TsdCp011Direction = index % 3 === 2 ? "OPPOSITE" : "SAME";
  const time = rational(12 + index);
  const ground = direction === "SAME" ? add(personRate, surfaceRate) : subtract(personRate, surfaceRate);
  const length = multiply(ground, time);
  const measureUnit = index % 2 === 0 ? "METRE" as const : "STEP" as const;
  switch (index % 4) {
    case 0: return { authorityKey: "movingSurfaceTravelState", target: "TIME", measureUnit, direction, length, personRate, surfaceRate };
    case 1: return { authorityKey: "movingSurfaceTravelState", target: "LENGTH", measureUnit, direction, time, personRate, surfaceRate };
    case 2: return { authorityKey: "movingSurfaceTravelState", target: "PERSON_RATE", measureUnit, direction, length, time, surfaceRate };
    default: return { authorityKey: "movingSurfaceTravelState", target: "SURFACE_RATE", measureUnit, direction, length, time, personRate };
  }
}

function stationaryStepsInput(index: number): TsdCp011ExecutableInput {
  const personStepRate = rational(5 + (index % 4));
  const escalatorStepRate = rational(1 + (index % 2));
  const direction: TsdCp011Direction = index % 3 === 1 ? "OPPOSITE" : "SAME";
  const time = rational(9 + index);
  const ground = direction === "SAME" ? add(personStepRate, escalatorStepRate) : subtract(personStepRate, escalatorStepRate);
  const walkedSteps = multiply(personStepRate, time);
  const totalSteps = multiply(ground, time);
  switch (index % 4) {
    case 0: return { authorityKey: "stationaryStepCountState", target: "TOTAL_STEPS", direction, walkedSteps, personStepRate, escalatorStepRate };
    case 1: return { authorityKey: "stationaryStepCountState", target: "WALKED_STEPS", direction, totalSteps, personStepRate, escalatorStepRate };
    case 2: return { authorityKey: "stationaryStepCountState", target: "PERSON_RATE", direction, totalSteps, walkedSteps, escalatorStepRate };
    default: return { authorityKey: "stationaryStepCountState", target: "ESCALATOR_RATE", direction, totalSteps, walkedSteps, personStepRate };
  }
}

function dualObservationInput(index: number): TsdCp011ExecutableInput {
  const personRate = rational(5 + (index % 4));
  const escalatorRate = rational(1 + (index % 2));
  const k = rational(3 + index);
  const upTime = multiply(subtract(personRate, escalatorRate), k);
  const downTime = multiply(add(personRate, escalatorRate), k);
  return index % 2 === 0
    ? { authorityKey: "dualEscalatorObservationState", target: "STOPPED_TIME", upTime, downTime }
    : { authorityKey: "dualEscalatorObservationState", target: "PERSON_TO_ESCALATOR_RATE_RATIO", upTime, downTime };
}

function stateComparisonInput(index: number): TsdCp011ExecutableInput {
  const stoppedWalkingTime = rational(40 + index * 4);
  const carriedStandingTime = rational(70 + index * 5);
  const combinedTime = { numerator: stoppedWalkingTime.numerator * carriedStandingTime.numerator, denominator: stoppedWalkingTime.numerator + carriedStandingTime.numerator };
  switch (index % 4) {
    case 0: return { authorityKey: "movingSurfaceStateComparison", target: "COMBINED_TIME", stoppedWalkingTime, carriedStandingTime };
    case 1: return { authorityKey: "movingSurfaceStateComparison", target: "STOPPED_WALKING_TIME", combinedTime: rational(combinedTime.numerator, combinedTime.denominator), carriedStandingTime };
    case 2: return { authorityKey: "movingSurfaceStateComparison", target: "CARRIED_STANDING_TIME", combinedTime: rational(combinedTime.numerator, combinedTime.denominator), stoppedWalkingTime };
    default: return { authorityKey: "movingSurfaceStateComparison", target: "TIME_SAVED", stoppedWalkingTime, carriedStandingTime };
  }
}

function wheelRollInput(index: number): TsdCp011ExecutableInput {
  const pi = rational(22, 7);
  const diameter = rational(7 * (2 + (index % 4)), 100);
  const circumference = multiply(pi, diameter);
  const revolutions = rational(40 + index * 5);
  const distance = multiply(circumference, revolutions);
  switch (index % 5) {
    case 0: return { authorityKey: "wheelRollState", target: "DISTANCE", circumference, revolutions };
    case 1: return { authorityKey: "wheelRollState", target: "REVOLUTIONS", distance, circumference };
    case 2: return { authorityKey: "wheelRollState", target: "CIRCUMFERENCE", distance, revolutions };
    case 3: return { authorityKey: "wheelRollState", target: "DIAMETER", distance, revolutions, pi };
    default: return { authorityKey: "wheelRollState", target: "RADIUS", distance, revolutions, pi };
  }
}

function wheelRateInput(index: number): TsdCp011ExecutableInput {
  const circumference = rational(2 + (index % 4));
  const rpm = rational(18 + index * 2);
  const timeMinutes = rational(3 + index);
  const linearSpeedPerMinute = multiply(circumference, rpm);
  const distance = multiply(linearSpeedPerMinute, timeMinutes);
  switch (index % 4) {
    case 0: return { authorityKey: "wheelRateTranslationState", target: "LINEAR_SPEED", circumference, rpm };
    case 1: return { authorityKey: "wheelRateTranslationState", target: "RPM", circumference, linearSpeedPerMinute };
    case 2: return { authorityKey: "wheelRateTranslationState", target: "DISTANCE", circumference, rpm, timeMinutes };
    default: return { authorityKey: "wheelRateTranslationState", target: "TIME_MINUTES", circumference, rpm, distance };
  }
}

function twoWheelInput(index: number): TsdCp011ExecutableInput {
  const circumferenceA = rational(2 + (index % 3));
  const circumferenceB = rational(5 + (index % 4));
  const distance = multiply(multiply(circumferenceA, circumferenceB), rational(20 + index));
  return index % 2 === 0
    ? { authorityKey: "twoWheelComparisonState", target: "REVOLUTION_RATIO", circumferenceA, circumferenceB }
    : { authorityKey: "twoWheelComparisonState", target: "REVOLUTION_COUNT_DIFFERENCE", distance, circumferenceA, circumferenceB };
}

function buildInput(authorityKey: TsdCp011AuthorityKey, index: number): TsdCp011ExecutableInput {
  switch (authorityKey) {
    case "movingSurfaceTravelState": return movingSurfaceInput(index);
    case "stationaryStepCountState": return stationaryStepsInput(index);
    case "dualEscalatorObservationState": return dualObservationInput(index);
    case "movingSurfaceStateComparison": return stateComparisonInput(index);
    case "wheelRollState": return wheelRollInput(index);
    case "wheelRateTranslationState": return wheelRateInput(index);
    case "twoWheelComparisonState": return twoWheelInput(index);
  }
}

export function generateTsdCp011ExecutableCases(): readonly TsdCp011ExecutableCase[] {
  const out: TsdCp011ExecutableCase[] = [];
  for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
    for (let index = 0; index < 24; index += 1) {
      const input = buildInput(authorityKey, index);
      out.push(Object.freeze({
        caseId: `TSD-CP011-${authorityKey}-${String(index + 1).padStart(2, "0")}`,
        authorityKey,
        input,
        expected: solveTsdCp011(input),
      }));
    }
  }
  return Object.freeze(out);
}