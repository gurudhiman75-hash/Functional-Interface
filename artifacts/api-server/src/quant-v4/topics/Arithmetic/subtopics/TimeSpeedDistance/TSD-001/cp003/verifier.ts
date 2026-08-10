import {
  absRational,
  add,
  compare,
  divide,
  equals,
  isPositive,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

function positive(value: Rational): boolean {
  return isPositive(value);
}

export interface TsdCp003VerificationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function verifyCp003(
  input: TsdCp003SolveInput,
  certificate: TsdCp003SolveCertificate,
): TsdCp003VerificationResult {
  const errors: string[] = [];
  if (certificate.solveMode !== input.solveMode) errors.push("solve-mode mismatch");
  if (!positive(certificate.answer)) errors.push("answer must be positive");

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      if (compare(input.originalSpeed, input.changedSpeed) === 0) errors.push("speed change is zero");
      const expected = absRational(subtract(
        divide(input.distance, input.originalSpeed),
        divide(input.distance, input.changedSpeed),
      ));
      if (!equals(certificate.answer, expected)) errors.push("time gain/loss does not match the two travel times");
      if (certificate.unit !== "HOUR") errors.push("time gain/loss unit must be HOUR");
      break;
    }

    case "distanceFromSpeedTimeDifference": {
      if (compare(input.fasterSpeed, input.slowerSpeed) <= 0) errors.push("faster speed must exceed slower speed");
      const slowerTime = divide(certificate.answer, input.slowerSpeed);
      const fasterTime = divide(certificate.answer, input.fasterSpeed);
      if (!equals(subtract(slowerTime, fasterTime), input.timeDifference)) {
        errors.push("candidate distance does not reproduce the stated time difference");
      }
      if (certificate.unit !== "KM") errors.push("distance unit must be KM");
      break;
    }

    case "usualSpeedFromEarlyLatePair": {
      if (compare(input.fasterTrialSpeed, input.slowerTrialSpeed) <= 0) errors.push("faster trial speed must exceed slower trial speed");
      const scheduleGap = add(input.lateBy, input.earlyBy);
      const reciprocalGap = subtract(
        divide({ numerator: 1n, denominator: 1n }, input.slowerTrialSpeed),
        divide({ numerator: 1n, denominator: 1n }, input.fasterTrialSpeed),
      );
      const distance = divide(scheduleGap, reciprocalGap);
      const slowScheduledTime = subtract(divide(distance, input.slowerTrialSpeed), input.lateBy);
      const fastScheduledTime = add(divide(distance, input.fasterTrialSpeed), input.earlyBy);
      if (!equals(slowScheduledTime, fastScheduledTime)) errors.push("early/late pair does not define one scheduled travel time");
      const expectedSpeed = divide(distance, slowScheduledTime);
      if (!equals(certificate.answer, expectedSpeed)) errors.push("usual speed does not match reconstructed schedule");
      if (certificate.unit !== "KMPH") errors.push("usual speed unit must be KMPH");
      break;
    }

    case "distanceFromEarlyLatePair": {
      const slowScheduledTime = subtract(divide(certificate.answer, input.slowerTrialSpeed), input.lateBy);
      const fastScheduledTime = add(divide(certificate.answer, input.fasterTrialSpeed), input.earlyBy);
      if (!equals(slowScheduledTime, fastScheduledTime)) errors.push("candidate distance does not reconcile early and late arrivals");
      if (certificate.unit !== "KM") errors.push("distance unit must be KM");
      break;
    }

    case "requiredRecoverySpeedAfterLostTime": {
      const recoveredTime = divide(input.remainingDistance, certificate.answer);
      if (!equals(recoveredTime, input.remainingAvailableTime)) errors.push("recovery speed does not fit remaining distance/time");
      if (certificate.unit !== "KMPH") errors.push("recovery speed unit must be KMPH");
      break;
    }

    case "requiredRemainingSpeedAfterPartialRoute": {
      if (compare(input.completedDistance, input.totalDistance) >= 0) errors.push("completed distance must be below total distance");
      const completedTime = divide(input.completedDistance, input.completedSpeed);
      const remainingDistance = subtract(input.totalDistance, input.completedDistance);
      const remainingTimeAtCandidate = divide(remainingDistance, certificate.answer);
      if (!equals(add(completedTime, remainingTimeAtCandidate), input.scheduledTotalTime)) {
        errors.push("remaining speed does not meet the scheduled total time");
      }
      if (certificate.unit !== "KMPH") errors.push("remaining speed unit must be KMPH");
      break;
    }
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
