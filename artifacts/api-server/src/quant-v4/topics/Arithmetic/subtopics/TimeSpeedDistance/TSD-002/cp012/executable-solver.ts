import {
  add,
  ceilRational,
  compare,
  divide,
  modulo,
  multiply,
  rational,
  reciprocal,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type {
  TsdCp012ExecutableInput,
  TsdCp012ExecutableSolution,
  TsdCp012Route,
  TsdCp012ScalarUnit,
  TsdCp012Stage,
  TsdCp012TimedStage,
} from "./executable-types";

const ZERO = rational(0);
const ONE = rational(1);
function positive(value: Rational, label: string) {
  if (compare(value, ZERO) <= 0) throw new Error(`TSD-CP-012 infeasible ${label}`);
  return value;
}
function nonNegative(value: Rational, label: string) {
  if (compare(value, ZERO) < 0) throw new Error(`TSD-CP-012 infeasible ${label}`);
  return value;
}
function scalar(answer: Rational, unit: TsdCp012ScalarUnit): TsdCp012ExecutableSolution {
  return Object.freeze({ kind: "SCALAR" as const, answer, unit });
}
function sum(values: readonly Rational[]) { return values.reduce((a, b) => add(a, b), ZERO); }
function timedDistance(stage: TsdCp012TimedStage) { return multiply(positive(stage.speed, "stage speed"), nonNegative(stage.duration, "stage duration")); }
function stageTime(stage: TsdCp012Stage) { return divide(nonNegative(stage.distance, "stage distance"), positive(stage.speed, "stage speed")); }
function routeTime(route: TsdCp012Route) { return sum(route.segments.map(stageTime)); }
function absoluteDifference(a: Rational, b: Rational) { return compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a); }
function lessOrEqual(a: Rational, b: Rational) { return compare(a, b) <= 0; }
function integerRational(value: number) { return rational(BigInt(value)); }

function movementBlockCount(distance: Rational, speed: Rational, travelDurationPerBlock: Rational) {
  const blockDistance = positive(multiply(positive(speed, "travel speed"), positive(travelDurationPerBlock, "travel duration per block")), "block distance");
  const blocks = ceilRational(divide(positive(distance, "distance"), blockDistance));
  if (blocks <= 0n) throw new Error("TSD-CP-012 infeasible movement block count");
  return blocks;
}
function restCount(distance: Rational, speed: Rational, travelDurationPerBlock: Rational) {
  const blocks = movementBlockCount(distance, speed, travelDurationPerBlock);
  return blocks - 1n;
}

export function solveTsdCp012(input: TsdCp012ExecutableInput): TsdCp012ExecutableSolution {
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return scalar(sum(input.stages.map(timedDistance)), "METRE");
      if (input.target === "TOTAL_TIME") return scalar(sum(input.stages.map(stageTime)), "SECOND");
      if (input.target === "UNKNOWN_FINAL_SPEED") {
        const priorDistance = sum(input.priorStages.map(timedDistance));
        const remaining = positive(subtract(input.totalDistance, priorDistance), "remaining final distance");
        return scalar(positive(divide(remaining, positive(input.finalDuration, "final duration")), "final speed"), "METRE_PER_SECOND");
      }
      const cycleDistance = sum(input.cycle.map(timedDistance));
      const partialDistance = sum(input.partialStages.map(timedDistance));
      return scalar(add(multiply(cycleDistance, integerRational(input.fullCycles)), partialDistance), "METRE");
    }

    case "periodicTravelRestProgramState": {
      const rests = restCount(input.distance, input.travelSpeed, input.travelDurationPerBlock);
      if (input.target === "REST_COUNT") return scalar(rational(rests), "COUNT");
      const movingTime = divide(positive(input.distance, "distance"), positive(input.travelSpeed, "travel speed"));
      if (input.target === "COMPLETION_TIME") {
        return scalar(add(movingTime, multiply(rational(rests), nonNegative(input.restDuration, "rest duration"))), "SECOND");
      }
      if (rests <= 0n) throw new Error("TSD-CP-012 rest duration is not identifiable when no rest occurs");
      const restTimeTotal = nonNegative(subtract(input.totalElapsedTime, movingTime), "total rest time");
      return scalar(divide(restTimeTotal, rational(rests)), "SECOND");
    }

    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") {
        const remainingDistance = positive(subtract(input.totalDistance, input.completedDistance), "remaining distance");
        const remainingTime = positive(subtract(input.deadline, input.elapsedTime), "remaining time");
        return scalar(divide(remainingDistance, remainingTime), "METRE_PER_SECOND");
      }
      if (input.target === "REQUIRED_FINAL_TIME") {
        const remainingDistance = positive(subtract(input.totalDistance, input.completedDistance), "remaining distance");
        return scalar(divide(remainingDistance, positive(input.finalSpeed, "final speed")), "SECOND");
      }
      if (input.target === "STAGE_BOUNDARY_DISTANCE") {
        const denominator = subtract(reciprocal(positive(input.firstSpeed, "first speed")), reciprocal(positive(input.secondSpeed, "second speed")));
        if (compare(denominator, ZERO) === 0) throw new Error("TSD-CP-012 stage boundary not identifiable for equal speeds");
        const numerator = subtract(input.totalTime, divide(input.totalDistance, input.secondSpeed));
        const boundary = divide(numerator, denominator);
        if (compare(boundary, ZERO) < 0 || compare(boundary, input.totalDistance) > 0) throw new Error("TSD-CP-012 stage boundary outside route");
        return scalar(boundary, "METRE");
      }
      if (input.target === "MAXIMUM_DELAY") {
        const travelTime = divide(positive(input.distance, "distance"), positive(input.speed, "speed"));
        return scalar(nonNegative(subtract(input.arrivalDeadline, travelTime), "maximum delay"), "SECOND");
      }
      return scalar(divide(positive(input.distance, "distance"), positive(input.availableTime, "available time")), "METRE_PER_SECOND");
    }

    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return scalar(routeTime({ segments: input.segments }), "SECOND");
      if (input.target === "DISTANCE_SPLIT_A") {
        const denominator = subtract(reciprocal(positive(input.speedA, "speed A")), reciprocal(positive(input.speedB, "speed B")));
        if (compare(denominator, ZERO) === 0) throw new Error("TSD-CP-012 distance split not identifiable for equal speeds");
        const numerator = subtract(input.totalTime, divide(input.totalDistance, input.speedB));
        const distanceA = divide(numerator, denominator);
        if (compare(distanceA, ZERO) < 0 || compare(distanceA, input.totalDistance) > 0) throw new Error("TSD-CP-012 distance split outside route");
        return scalar(distanceA, "METRE");
      }
      if (input.target === "FASTEST_ROUTE_INDEX") {
        if (input.routes.length < 2) throw new Error("TSD-CP-012 route comparison needs at least two routes");
        const times = input.routes.map(routeTime);
        let best = 0;
        for (let i = 1; i < times.length; i += 1) if (compare(times[i]!, times[best]!) < 0) best = i;
        if (times.some((time, index) => index !== best && compare(time, times[best]!) === 0)) throw new Error("TSD-CP-012 fastest route is not unique");
        return scalar(rational(best + 1), "INDEX");
      }
      return scalar(absoluteDifference(routeTime(input.routeA), routeTime(input.routeB)), "SECOND");
    }

    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return scalar(nonNegative(subtract(input.totalDistance, sum(input.knownDistances)), "missing distance"), "METRE");
      if (input.target === "MISSING_TIME") return scalar(nonNegative(subtract(input.totalTime, sum(input.knownTimes)), "missing time"), "SECOND");
      if (input.target === "MISSING_SPEED") return scalar(divide(positive(input.missingDistance, "missing distance"), positive(input.missingTime, "missing time")), "METRE_PER_SECOND");
      const knownTime = stageTime(input.knownStage);
      const missingTime = positive(subtract(input.totalTime, knownTime), "missing stage time");
      const missingDistance = multiply(positive(input.missingSpeed, "missing speed"), missingTime);
      const expectedTotal = add(input.knownStage.distance, missingDistance);
      if (compare(expectedTotal, input.totalDistance) !== 0) throw new Error("TSD-CP-012 reconstruction totals are inconsistent");
      return scalar(missingDistance, "METRE");
    }

    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") {
        const numerator = add(positive(input.stationDistance, "station distance"), multiply(positive(input.speedB, "speed B"), nonNegative(input.delayB, "delay B")));
        const meetingTime = divide(numerator, add(positive(input.speedA, "speed A"), input.speedB));
        if (compare(meetingTime, input.delayB) < 0) throw new Error("TSD-CP-012 trains meet before second departure");
        return scalar(meetingTime, "SECOND");
      }
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") {
        const totalClosure = add(add(positive(input.initialGap, "initial gap"), positive(input.lengthA, "train A length")), positive(input.lengthB, "train B length"));
        const closedBeforeBStarts = multiply(positive(input.speedA, "speed A"), nonNegative(input.delayB, "delay B"));
        const remaining = positive(subtract(totalClosure, closedBeforeBStarts), "remaining closure after second departure");
        return scalar(add(input.delayB, divide(remaining, add(input.speedA, positive(input.speedB, "speed B")))), "SECOND");
      }
      const numerator = subtract(multiply(add(positive(input.speedA, "speed A"), positive(input.speedB, "speed B")), positive(input.meetingTimeFromFirstDeparture, "meeting time")), positive(input.stationDistance, "station distance"));
      const delay = divide(numerator, input.speedB);
      if (compare(delay, ZERO) < 0 || compare(delay, input.meetingTimeFromFirstDeparture) > 0) throw new Error("TSD-CP-012 inferred train delay is infeasible");
      return scalar(delay, "SECOND");
    }

    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") {
        const boat = positive(input.boatStillWaterSpeed, "boat still-water speed");
        const current = nonNegative(input.currentSpeed, "current speed");
        const delay = nonNegative(input.boatStartDelay, "boat start delay");
        return scalar(divide(multiply(add(boat, current), delay), boat), "SECOND");
      }
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") {
        const catchTime = divide(multiply(add(positive(input.boatStillWaterSpeed, "boat still-water speed"), nonNegative(input.currentSpeed, "current speed")), nonNegative(input.boatStartDelay, "boat start delay")), input.boatStillWaterSpeed);
        return scalar(multiply(input.currentSpeed, catchTime), "METRE");
      }
      if (input.target === "CURRENT_SPEED") {
        const delay = positive(input.boatStartDelay, "boat start delay");
        const extraCatchTime = nonNegative(subtract(input.catchTimeFromRaftStart, delay), "catch time beyond delay");
        return scalar(divide(multiply(positive(input.boatStillWaterSpeed, "boat still-water speed"), extraCatchTime), delay), "METRE_PER_SECOND");
      }
      if (compare(input.boatStillWaterSpeed, input.currentSpeed) <= 0) throw new Error("TSD-CP-012 boat cannot execute upstream recovery turn");
      return scalar(multiply(rational(2), multiply(nonNegative(input.currentSpeed, "current speed"), positive(input.detectionDelay, "detection delay"))), "METRE");
    }

    case "closedTrackRaceSynthesisState": {
      const trackLength = positive(input.trackLength, "track length");
      const faster = positive(input.fasterSpeed, "faster speed");
      const slower = positive(input.slowerSpeed, "slower speed");
      if (compare(faster, slower) <= 0) throw new Error("TSD-CP-012 faster runner must actually be faster");
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") {
        const raceDistance = multiply(trackLength, rational(input.raceLaps));
        const finishTime = divide(raceDistance, faster);
        const slowerPosition = modulo(add(nonNegative(input.slowerHeadStart, "slower head start"), multiply(slower, finishTime)), trackLength);
        return scalar(modulo(subtract(ZERO, slowerPosition), trackLength), "METRE");
      }
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") {
        const raceDistance = multiply(trackLength, rational(input.raceLaps));
        const finishTime = divide(raceDistance, faster);
        return scalar(nonNegative(subtract(raceDistance, multiply(slower, finishTime)), "dead-heat head start"), "METRE");
      }
      const headStart = nonNegative(input.slowerHeadStart, "slower head start");
      const relativeGap = compare(headStart, ZERO) === 0 ? trackLength : modulo(headStart, trackLength);
      const gap = compare(relativeGap, ZERO) === 0 ? trackLength : relativeGap;
      return scalar(divide(gap, subtract(faster, slower)), "SECOND");
    }

    case "movingSurfaceScheduleSynthesisState": {
      const length = positive(input.length, "surface length");
      const person = positive(input.personRate, "person rate");
      const surface = positive(input.surfaceRate, "surface rate");
      if (input.target === "TIME_WITH_STOP_AFTER") {
        const activeTime = nonNegative(input.surfaceActiveTime, "surface active time");
        const net = add(person, surface);
        const activeDistance = multiply(net, activeTime);
        if (lessOrEqual(length, activeDistance)) return scalar(divide(length, net), "SECOND");
        return scalar(add(activeTime, divide(subtract(length, activeDistance), person)), "SECOND");
      }
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") {
        const delay = nonNegative(input.activationDelay, "activation delay");
        const walkedBefore = multiply(person, delay);
        if (lessOrEqual(length, walkedBefore)) return scalar(divide(length, person), "SECOND");
        return scalar(add(delay, divide(subtract(length, walkedBefore), add(person, surface))), "SECOND");
      }
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") {
        const reversal = nonNegative(input.reversalTime, "reversal time");
        const firstRate = add(person, surface);
        const firstDistance = multiply(firstRate, reversal);
        if (lessOrEqual(length, firstDistance)) return scalar(divide(length, firstRate), "SECOND");
        const secondRate = positive(subtract(person, surface), "post-reversal net rate");
        return scalar(add(reversal, divide(subtract(length, firstDistance), secondRate)), "SECOND");
      }
      const numerator = subtract(length, multiply(person, positive(input.totalTime, "total time")));
      const activeTime = divide(numerator, surface);
      if (compare(activeTime, ZERO) < 0 || compare(activeTime, input.totalTime) > 0) throw new Error("TSD-CP-012 inferred active surface time is infeasible");
      return scalar(activeTime, "SECOND");
    }

    case "twoEngineInverseState": {
      const determinant = subtract(multiply(input.a1, input.b2), multiply(input.a2, input.b1));
      if (compare(determinant, ZERO) === 0) throw new Error("TSD-CP-012 coupled inverse system is not uniquely identifiable");
      if (input.target === "X") return scalar(divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), determinant), "PARAMETER");
      return scalar(divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), determinant), "PARAMETER");
    }

    case "feasibleParameterSetState": {
      if (!Number.isInteger(input.minimumCandidate) || !Number.isInteger(input.maximumCandidate) || input.minimumCandidate > input.maximumCandidate) throw new Error("TSD-CP-012 invalid finite candidate domain");
      const valid: Rational[] = [];
      for (let candidate = input.minimumCandidate; candidate <= input.maximumCandidate; candidate += 1) {
        if (candidate <= 0) continue;
        const speed = rational(candidate);
        const elapsed = add(divide(positive(input.distance, "distance"), speed), nonNegative(input.fixedDelay, "fixed delay"));
        if (compare(elapsed, positive(input.deadline, "deadline")) <= 0) valid.push(speed);
      }
      if (input.target === "COUNT") return scalar(rational(valid.length), "COUNT");
      return Object.freeze({ kind: "SET" as const, values: Object.freeze(valid), unit: "PARAMETER_SET" as const });
    }
  }
}
