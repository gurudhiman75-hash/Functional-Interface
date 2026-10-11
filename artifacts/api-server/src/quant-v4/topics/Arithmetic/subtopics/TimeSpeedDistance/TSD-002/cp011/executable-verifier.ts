import {
  add,
  compare,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp011ExecutableInput, TsdCp011ExecutableSolution, TsdCp011SolutionUnit } from "./executable-types";

export type TsdCp011Verification = Readonly<{ accepted: boolean; reason?: string }>;

function positive(value: Rational) { return compare(value, rational(0)) > 0; }
function eq(a: Rational, b: Rational) { return equals(a, b); }
function sign(direction: "SAME" | "OPPOSITE") { return rational(direction === "SAME" ? 1 : -1); }
function net(person: Rational, surface: Rational, direction: "SAME" | "OPPOSITE") {
  return direction === "SAME" ? add(person, surface) : subtract(person, surface);
}
function rateUnit(measureUnit: "METRE" | "STEP"): TsdCp011SolutionUnit {
  return measureUnit === "METRE" ? "METRE_PER_SECOND" : "STEP_PER_SECOND";
}
function reject(reason: string): TsdCp011Verification { return Object.freeze({ accepted: false, reason }); }
function accept(): TsdCp011Verification { return Object.freeze({ accepted: true }); }

export function verifyTsdCp011(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution): TsdCp011Verification {
  if (!positive(solution.answer)) return reject("answer must be positive");

  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      if (input.target === "TIME") {
        const ground = net(input.personRate, input.surfaceRate, input.direction);
        if (!positive(ground) || solution.unit !== "SECOND") return reject("invalid travel-time state/unit");
        return eq(input.length, multiply(ground, solution.answer)) ? accept() : reject("distance != net rate * answer time");
      }
      if (input.target === "LENGTH") {
        const ground = net(input.personRate, input.surfaceRate, input.direction);
        if (!positive(ground) || solution.unit !== input.measureUnit) return reject("invalid length state/unit");
        return eq(solution.answer, multiply(ground, input.time)) ? accept() : reject("answer length != net rate * time");
      }
      if (solution.unit !== rateUnit(input.measureUnit)) return reject("rate unit mismatch");
      if (input.target === "PERSON_RATE") {
        const ground = net(solution.answer, input.surfaceRate, input.direction);
        if (!positive(ground)) return reject("infeasible recovered person rate");
        return eq(input.length, multiply(ground, input.time)) ? accept() : reject("recovered person rate does not reproduce trip");
      }
      const ground = net(input.personRate, solution.answer, input.direction);
      if (!positive(ground)) return reject("infeasible recovered surface rate");
      return eq(input.length, multiply(ground, input.time)) ? accept() : reject("recovered surface rate does not reproduce trip");
    }
    case "stationaryStepCountState": {
      if (input.target === "TOTAL_STEPS") {
        if (solution.unit !== "STEP") return reject("total-step unit mismatch");
        const ground = net(input.personStepRate, input.escalatorStepRate, input.direction);
        if (!positive(ground)) return reject("infeasible escalator net step rate");
        const expectedDistance = multiply(ground, divide(input.walkedSteps, input.personStepRate));
        return eq(solution.answer, expectedDistance) ? accept() : reject("stationary step count identity failed");
      }
      if (input.target === "WALKED_STEPS") {
        if (solution.unit !== "STEP") return reject("walked-step unit mismatch");
        const ground = net(input.personStepRate, input.escalatorStepRate, input.direction);
        if (!positive(ground)) return reject("infeasible escalator net step rate");
        const expectedTotal = multiply(ground, divide(solution.answer, input.personStepRate));
        return eq(input.totalSteps, expectedTotal) ? accept() : reject("walked-step identity failed");
      }
      if (solution.unit !== "STEP_PER_SECOND") return reject("step-rate unit mismatch");
      if (input.target === "PERSON_RATE") {
        const ground = net(solution.answer, input.escalatorStepRate, input.direction);
        if (!positive(ground)) return reject("infeasible person rate");
        const expectedTotal = multiply(ground, divide(input.walkedSteps, solution.answer));
        return eq(input.totalSteps, expectedTotal) ? accept() : reject("person-rate identity failed");
      }
      const ground = net(input.personStepRate, solution.answer, input.direction);
      if (!positive(ground)) return reject("infeasible escalator rate");
      const expectedTotal = multiply(ground, divide(input.walkedSteps, input.personStepRate));
      return eq(input.totalSteps, expectedTotal) ? accept() : reject("escalator-rate identity failed");
    }
    case "dualEscalatorObservationState": {
      if (!positive(input.upTime) || !positive(input.downTime) || compare(input.downTime, input.upTime) <= 0) return reject("up/down observations are infeasible");
      if (input.target === "STOPPED_TIME") {
        if (solution.unit !== "SECOND") return reject("stopped-time unit mismatch");
        const left = multiply(solution.answer, add(input.upTime, input.downTime));
        const right = multiply(rational(2), multiply(input.upTime, input.downTime));
        return eq(left, right) ? accept() : reject("stopped-time harmonic identity failed");
      }
      if (solution.unit !== "RATIO") return reject("rate-ratio unit mismatch");
      return eq(multiply(solution.answer, subtract(input.downTime, input.upTime)), add(input.downTime, input.upTime))
        ? accept() : reject("person/escalator rate-ratio identity failed");
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME") {
        if (solution.unit !== "SECOND") return reject("combined-time unit mismatch");
        return eq(multiply(solution.answer, add(input.stoppedWalkingTime, input.carriedStandingTime)), multiply(input.stoppedWalkingTime, input.carriedStandingTime))
          ? accept() : reject("combined-time identity failed");
      }
      if (input.target === "STOPPED_WALKING_TIME") {
        if (solution.unit !== "SECOND" || compare(input.carriedStandingTime, input.combinedTime) <= 0) return reject("invalid stopped-time state/unit");
        return eq(multiply(input.combinedTime, add(solution.answer, input.carriedStandingTime)), multiply(solution.answer, input.carriedStandingTime))
          ? accept() : reject("recovered stopped-time identity failed");
      }
      if (input.target === "CARRIED_STANDING_TIME") {
        if (solution.unit !== "SECOND" || compare(input.stoppedWalkingTime, input.combinedTime) <= 0) return reject("invalid carried-time state/unit");
        return eq(multiply(input.combinedTime, add(input.stoppedWalkingTime, solution.answer)), multiply(input.stoppedWalkingTime, solution.answer))
          ? accept() : reject("recovered carried-time identity failed");
      }
      if (solution.unit !== "SECOND") return reject("time-saved unit mismatch");
      const combined = subtract(input.stoppedWalkingTime, solution.answer);
      if (!positive(combined)) return reject("time saved exceeds stopped travel time");
      return eq(multiply(combined, add(input.stoppedWalkingTime, input.carriedStandingTime)), multiply(input.stoppedWalkingTime, input.carriedStandingTime))
        ? accept() : reject("time-saved identity failed");
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") {
        return solution.unit === "METRE" && eq(solution.answer, multiply(input.circumference, input.revolutions)) ? accept() : reject("wheel distance identity failed");
      }
      if (input.target === "REVOLUTIONS") {
        return solution.unit === "REVOLUTION" && eq(input.distance, multiply(input.circumference, solution.answer)) ? accept() : reject("wheel revolution identity failed");
      }
      if (input.target === "CIRCUMFERENCE") {
        return solution.unit === "METRE" && eq(input.distance, multiply(solution.answer, input.revolutions)) ? accept() : reject("circumference identity failed");
      }
      if (solution.unit !== "METRE") return reject("wheel radius/diameter unit mismatch");
      const circumference = input.target === "DIAMETER" ? multiply(input.pi, solution.answer) : multiply(multiply(rational(2), input.pi), solution.answer);
      return eq(input.distance, multiply(circumference, input.revolutions)) ? accept() : reject("radius/diameter rolling identity failed");
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return solution.unit === "METRE_PER_MINUTE" && eq(solution.answer, multiply(input.circumference, input.rpm)) ? accept() : reject("linear-speed identity failed");
      if (input.target === "RPM") return solution.unit === "REVOLUTION_PER_MINUTE" && eq(input.linearSpeedPerMinute, multiply(input.circumference, solution.answer)) ? accept() : reject("RPM identity failed");
      if (input.target === "DISTANCE") return solution.unit === "METRE" && eq(solution.answer, multiply(multiply(input.circumference, input.rpm), input.timeMinutes)) ? accept() : reject("RPM distance identity failed");
      return solution.unit === "MINUTE" && eq(input.distance, multiply(multiply(input.circumference, input.rpm), solution.answer)) ? accept() : reject("RPM time identity failed");
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") {
        return solution.unit === "RATIO" && eq(multiply(solution.answer, input.circumferenceA), input.circumferenceB) ? accept() : reject("same-distance revolution ratio failed");
      }
      if (solution.unit !== "REVOLUTION") return reject("revolution-difference unit mismatch");
      const a = divide(input.distance, input.circumferenceA);
      const b = divide(input.distance, input.circumferenceB);
      const expected = compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a);
      return eq(solution.answer, expected) ? accept() : reject("revolution-count difference failed");
    }
  }
}