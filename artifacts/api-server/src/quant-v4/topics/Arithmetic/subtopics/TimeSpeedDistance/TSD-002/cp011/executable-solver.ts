import {
  add,
  compare,
  divide,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp011Direction, TsdCp011ExecutableInput, TsdCp011ExecutableSolution, TsdCp011MeasureUnit } from "./executable-types";

function positive(value: Rational, label: string): Rational {
  if (compare(value, rational(0)) <= 0) throw new Error(`TSD-CP-011 infeasible ${label}`);
  return value;
}
function directionSign(direction: TsdCp011Direction) { return rational(direction === "SAME" ? 1 : -1); }
function netRate(personRate: Rational, surfaceRate: Rational, direction: TsdCp011Direction) {
  return positive(direction === "SAME" ? add(personRate, surfaceRate) : subtract(personRate, surfaceRate), "net rate");
}
function measureUnit(unit: TsdCp011MeasureUnit) { return unit; }
function rateUnit(unit: TsdCp011MeasureUnit) { return unit === "METRE" ? "METRE_PER_SECOND" as const : "STEP_PER_SECOND" as const; }

export function solveTsdCp011(input: TsdCp011ExecutableInput): TsdCp011ExecutableSolution {
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      if (input.target === "TIME") {
        const net = netRate(input.personRate, input.surfaceRate, input.direction);
        return Object.freeze({ answer: positive(divide(input.length, net), "travel time"), unit: "SECOND" });
      }
      if (input.target === "LENGTH") {
        const net = netRate(input.personRate, input.surfaceRate, input.direction);
        return Object.freeze({ answer: positive(multiply(net, input.time), "surface length"), unit: measureUnit(input.measureUnit) });
      }
      const groundRate = positive(divide(input.length, input.time), "ground rate");
      if (input.target === "PERSON_RATE") {
        const answer = input.direction === "SAME" ? subtract(groundRate, input.surfaceRate) : add(groundRate, input.surfaceRate);
        return Object.freeze({ answer: positive(answer, "person rate"), unit: rateUnit(input.measureUnit) });
      }
      const answer = input.direction === "SAME" ? subtract(groundRate, input.personRate) : subtract(input.personRate, groundRate);
      return Object.freeze({ answer: positive(answer, "surface rate"), unit: rateUnit(input.measureUnit) });
    }
    case "stationaryStepCountState": {
      const sign = directionSign(input.direction);
      if (input.target === "TOTAL_STEPS") {
        const time = positive(divide(input.walkedSteps, input.personStepRate), "walking time");
        const total = multiply(netRate(input.personStepRate, input.escalatorStepRate, input.direction), time);
        return Object.freeze({ answer: positive(total, "stationary step count"), unit: "STEP" });
      }
      if (input.target === "WALKED_STEPS") {
        const time = positive(divide(input.totalSteps, netRate(input.personStepRate, input.escalatorStepRate, input.direction)), "walking time");
        return Object.freeze({ answer: positive(multiply(input.personStepRate, time), "walked steps"), unit: "STEP" });
      }
      if (input.target === "PERSON_RATE") {
        const difference = subtract(input.totalSteps, input.walkedSteps);
        const answer = divide(multiply(multiply(sign, input.escalatorStepRate), input.walkedSteps), difference);
        return Object.freeze({ answer: positive(answer, "person step rate"), unit: "STEP_PER_SECOND" });
      }
      const difference = subtract(input.totalSteps, input.walkedSteps);
      const answer = divide(multiply(multiply(sign, difference), input.personStepRate), input.walkedSteps);
      return Object.freeze({ answer: positive(answer, "escalator step rate"), unit: "STEP_PER_SECOND" });
    }
    case "dualEscalatorObservationState": {
      positive(input.upTime, "up time");
      positive(input.downTime, "down time");
      if (input.target === "STOPPED_TIME") {
        return Object.freeze({
          answer: divide(multiply(rational(2), multiply(input.upTime, input.downTime)), add(input.upTime, input.downTime)),
          unit: "SECOND",
        });
      }
      const denominator = positive(subtract(input.downTime, input.upTime), "up/down time difference");
      return Object.freeze({ answer: divide(add(input.downTime, input.upTime), denominator), unit: "RATIO" });
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME") {
        return Object.freeze({
          answer: divide(multiply(input.stoppedWalkingTime, input.carriedStandingTime), add(input.stoppedWalkingTime, input.carriedStandingTime)),
          unit: "SECOND",
        });
      }
      if (input.target === "STOPPED_WALKING_TIME") {
        const denominator = positive(subtract(input.carriedStandingTime, input.combinedTime), "comparison denominator");
        return Object.freeze({ answer: divide(multiply(input.combinedTime, input.carriedStandingTime), denominator), unit: "SECOND" });
      }
      if (input.target === "CARRIED_STANDING_TIME") {
        const denominator = positive(subtract(input.stoppedWalkingTime, input.combinedTime), "comparison denominator");
        return Object.freeze({ answer: divide(multiply(input.combinedTime, input.stoppedWalkingTime), denominator), unit: "SECOND" });
      }
      const combined = divide(multiply(input.stoppedWalkingTime, input.carriedStandingTime), add(input.stoppedWalkingTime, input.carriedStandingTime));
      return Object.freeze({ answer: positive(subtract(input.stoppedWalkingTime, combined), "time saved"), unit: "SECOND" });
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") return Object.freeze({ answer: multiply(input.circumference, input.revolutions), unit: "METRE" });
      if (input.target === "REVOLUTIONS") return Object.freeze({ answer: divide(input.distance, input.circumference), unit: "REVOLUTION" });
      const circumference = divide(input.distance, input.revolutions);
      if (input.target === "CIRCUMFERENCE") return Object.freeze({ answer: circumference, unit: "METRE" });
      if (input.target === "DIAMETER") return Object.freeze({ answer: divide(circumference, input.pi), unit: "METRE" });
      return Object.freeze({ answer: divide(circumference, multiply(rational(2), input.pi)), unit: "METRE" });
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return Object.freeze({ answer: multiply(input.circumference, input.rpm), unit: "METRE_PER_MINUTE" });
      if (input.target === "RPM") return Object.freeze({ answer: divide(input.linearSpeedPerMinute, input.circumference), unit: "REVOLUTION_PER_MINUTE" });
      if (input.target === "DISTANCE") return Object.freeze({ answer: multiply(multiply(input.circumference, input.rpm), input.timeMinutes), unit: "METRE" });
      return Object.freeze({ answer: divide(input.distance, multiply(input.circumference, input.rpm)), unit: "MINUTE" });
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") return Object.freeze({ answer: divide(input.circumferenceB, input.circumferenceA), unit: "RATIO" });
      const a = divide(input.distance, input.circumferenceA);
      const b = divide(input.distance, input.circumferenceB);
      const difference = compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a);
      return Object.freeze({ answer: difference, unit: "REVOLUTION" });
    }
  }
}