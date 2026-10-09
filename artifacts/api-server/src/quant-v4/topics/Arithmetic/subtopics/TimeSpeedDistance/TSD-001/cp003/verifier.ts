import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

function positive(value: Rational): boolean {
  return isPositive(value);
}

function wholePositive(value: Rational): boolean {
  return positive(value) && value.denominator === 1n;
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

    case "speedFromFixedRouteTimeDifference": {
      let slowerSpeed: Rational;
      let fasterSpeed: Rational;
      if (input.representation === "KNOWN_OTHER_SPEED") {
        slowerSpeed = input.unknownRole === "SLOWER" ? certificate.answer : input.knownSpeed;
        fasterSpeed = input.unknownRole === "FASTER" ? certificate.answer : input.knownSpeed;
      } else {
        const targetRatio = input.target === "SLOWER" ? input.slowerRatio : input.fasterRatio;
        const scale = divide(certificate.answer, targetRatio);
        slowerSpeed = multiply(scale, input.slowerRatio);
        fasterSpeed = multiply(scale, input.fasterRatio);
      }
      if (compare(fasterSpeed, slowerSpeed) <= 0) errors.push("reconstructed faster speed must exceed slower speed");
      const reconstructedDifference = subtract(
        divide(input.distance, slowerSpeed),
        divide(input.distance, fasterSpeed),
      );
      if (!equals(reconstructedDifference, input.timeDifference)) errors.push("candidate speed does not reproduce the fixed-route time difference");
      if (certificate.unit !== "KMPH") errors.push("fixed-route speed unit must be KMPH");
      break;
    }

    case "usualSpeedFromEarlyLatePair": {
      if (compare(input.fasterTrialSpeed, input.slowerTrialSpeed) <= 0) errors.push("faster trial speed must exceed slower trial speed");
      const one: Rational = { numerator: 1n, denominator: 1n };
      const scheduleGap = add(input.lateBy, input.earlyBy);
      const reciprocalGap = subtract(
        divide(one, input.slowerTrialSpeed),
        divide(one, input.fasterTrialSpeed),
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

    case "scheduledArrivalTimeFromActualSpeed": {
      const expected = add(
        input.departureMinuteFromDayZero,
        multiply(divide(input.distance, input.actualSpeed), rational(60)),
      );
      if (!equals(certificate.answer, expected)) errors.push("arrival clock minute does not match departure plus exact travel time");
      if (certificate.unit !== "CLOCK_MINUTE") errors.push("scheduled-arrival unit must be CLOCK_MINUTE");
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

    case "stoppageDurationFromRunningAndOverallSpeed": {
      if (compare(input.runningSpeed, input.overallSpeed) <= 0) errors.push("running speed must exceed overall speed");
      const runningTime = divide(input.distance, input.runningSpeed);
      const totalTimeWithCandidateStop = add(runningTime, certificate.answer);
      const expectedOverallTime = divide(input.distance, input.overallSpeed);
      if (!equals(totalTimeWithCandidateStop, expectedOverallTime)) errors.push("stoppage duration does not reconcile running and overall speed");
      if (certificate.unit !== "HOUR") errors.push("stoppage duration unit must be HOUR");
      break;
    }

    case "overallSpeedIncludingStops": {
      const runningTime = divide(input.distance, input.runningSpeed);
      const totalElapsedTime = add(runningTime, input.totalStopTime);
      const timeAtCandidateOverallSpeed = divide(input.distance, certificate.answer);
      if (!equals(timeAtCandidateOverallSpeed, totalElapsedTime)) errors.push("overall speed does not include the complete stop time");
      if (certificate.unit !== "KMPH") errors.push("overall speed unit must be KMPH");
      break;
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const totalElapsedTime = divide(input.distance, input.overallSpeed);
      const runningTimeAtCandidate = divide(input.distance, certificate.answer);
      if (!equals(add(runningTimeAtCandidate, input.totalStopTime), totalElapsedTime)) errors.push("running speed does not reconcile overall speed and stoppage time");
      if (certificate.unit !== "KMPH") errors.push("running speed unit must be KMPH");
      break;
    }

    case "numberOfStopsFromOverallDelay": {
      if (!wholePositive(certificate.answer)) errors.push("stop count must be a whole positive count");
      if (!equals(multiply(certificate.answer, input.stopDuration), input.totalDelay)) errors.push("stop count does not reproduce total delay");
      if (certificate.unit !== "COUNT") errors.push("stop-count unit must be COUNT");
      break;
    }

    case "delayFromRegularStops": {
      if (!wholePositive(input.stopCount)) errors.push("input stop count must be a whole positive count");
      if (!equals(certificate.answer, multiply(input.stopCount, input.stopDuration))) errors.push("delay does not equal stop count × stop duration");
      if (certificate.unit !== "HOUR") errors.push("delay unit must be HOUR");
      break;
    }

    case "restTimeInRepeatedTravelRestCycle": {
      if (!wholePositive(input.cycleCount)) errors.push("cycle count must be whole and positive");
      if (!wholePositive(input.restEvents)) errors.push("rest-event count must be whole and positive");
      const reconstructedElapsed = add(
        multiply(input.travelTimePerCycle, input.cycleCount),
        multiply(certificate.answer, input.restEvents),
      );
      if (!equals(reconstructedElapsed, input.totalElapsedTime)) errors.push("rest time does not reconstruct total elapsed time");
      if (certificate.unit !== "HOUR") errors.push("rest-time unit must be HOUR");
      break;
    }

    case "totalTimeWithRegularStops": {
      if (!wholePositive(input.stopCount)) errors.push("stop count must be whole and positive");
      const expected = add(input.runningTime, multiply(input.stopCount, input.stopDuration));
      if (!equals(certificate.answer, expected)) errors.push("total elapsed time omits or miscounts stoppage time");
      if (certificate.unit !== "HOUR") errors.push("total elapsed-time unit must be HOUR");
      break;
    }

    case "speedChangePointDistance": {
      if (compare(certificate.answer, RATIONAL_ZERO) <= 0 || compare(certificate.answer, input.totalDistance) >= 0) errors.push("speed-change point must lie inside the route");
      const firstTime = divide(certificate.answer, input.firstSpeed);
      const secondTime = divide(subtract(input.totalDistance, certificate.answer), input.secondSpeed);
      if (!equals(add(firstTime, secondTime), input.totalTravelTime)) errors.push("speed-change point does not reconstruct total travel time");
      if (certificate.unit !== "KM") errors.push("speed-change point unit must be KM");
      break;
    }

    case "fractionOfRouteAtChangedSpeed": {
      if (compare(certificate.answer, RATIONAL_ZERO) <= 0 || compare(certificate.answer, rational(100)) >= 0) errors.push("changed-route percentage must lie between 0 and 100");
      const changedDistance = multiply(input.totalDistance, divide(certificate.answer, rational(100)));
      const originalDistance = subtract(input.totalDistance, changedDistance);
      const reconstructedTime = add(
        divide(originalDistance, input.originalSpeed),
        divide(changedDistance, input.changedSpeed),
      );
      if (!equals(reconstructedTime, input.totalTravelTime)) errors.push("route percentage does not reconstruct total travel time");
      if (certificate.unit !== "PERCENT") errors.push("changed-route fraction unit must be PERCENT");
      break;
    }

    case "lostTimeDurationFromScheduleRecovery": {
      if (compare(input.recoverySpeed, input.usualSpeed) < 0) errors.push("recovery speed cannot be below usual speed");
      if (compare(input.finalArrivalDelay, RATIONAL_ZERO) < 0) errors.push("final arrival delay cannot be negative");
      const expected = add(
        subtract(divide(input.remainingDistance, input.usualSpeed), divide(input.remainingDistance, input.recoverySpeed)),
        input.finalArrivalDelay,
      );
      if (!equals(certificate.answer, expected)) errors.push("lost-time duration does not match recovery gain plus final delay");
      if (certificate.unit !== "HOUR") errors.push("lost-time duration unit must be HOUR");
      break;
    }

    case "startTimeShiftForSameArrival": {
      const expected = absRational(subtract(
        divide(input.distance, input.originalSpeed),
        divide(input.distance, input.newSpeed),
      ));
      if (!equals(certificate.answer, expected)) errors.push("start-time shift does not offset the travel-time change");
      if (certificate.unit !== "HOUR") errors.push("start-time shift unit must be HOUR");
      break;
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const signedShift = add(
        input.departureShift,
        subtract(divide(input.distance, input.newSpeed), divide(input.distance, input.originalSpeed)),
      );
      if (compare(signedShift, RATIONAL_ZERO) === 0) errors.push("combined changes produce no arrival shift");
      if (!equals(certificate.answer, absRational(signedShift))) errors.push("arrival-shift magnitude does not match departure plus travel-time changes");
      if (certificate.unit !== "HOUR") errors.push("arrival-shift unit must be HOUR");
      break;
    }

    case "walkingRidingAllocation": {
      let walkingDistance: Rational;
      if (input.target === "WALKING_DISTANCE") {
        walkingDistance = certificate.answer;
        if (certificate.unit !== "KM") errors.push("walking-distance allocation unit must be KM");
      } else if (input.target === "RIDING_DISTANCE") {
        walkingDistance = subtract(input.totalDistance, certificate.answer);
        if (certificate.unit !== "KM") errors.push("riding-distance allocation unit must be KM");
      } else if (input.target === "WALKING_TIME") {
        walkingDistance = multiply(certificate.answer, input.walkingSpeed);
        if (certificate.unit !== "HOUR") errors.push("walking-time allocation unit must be HOUR");
      } else {
        const ridingDistance = multiply(certificate.answer, input.ridingSpeed);
        walkingDistance = subtract(input.totalDistance, ridingDistance);
        if (certificate.unit !== "HOUR") errors.push("riding-time allocation unit must be HOUR");
      }
      if (compare(walkingDistance, RATIONAL_ZERO) <= 0 || compare(walkingDistance, input.totalDistance) >= 0) errors.push("walking/riding allocation must keep both modes non-empty");
      const ridingDistance = subtract(input.totalDistance, walkingDistance);
      const reconstructedTime = add(
        divide(walkingDistance, input.walkingSpeed),
        divide(ridingDistance, input.ridingSpeed),
      );
      if (!equals(reconstructedTime, input.totalTime)) errors.push("walking/riding allocation does not reconstruct total time");
      break;
    }

    case "scheduleBuffer": {
      if (!equals(add(certificate.answer, input.plannedTravelDuration), input.scheduledDuration)) errors.push("schedule buffer does not bridge planned and scheduled durations");
      if (certificate.unit !== "HOUR") errors.push("schedule-buffer unit must be HOUR");
      break;
    }
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
