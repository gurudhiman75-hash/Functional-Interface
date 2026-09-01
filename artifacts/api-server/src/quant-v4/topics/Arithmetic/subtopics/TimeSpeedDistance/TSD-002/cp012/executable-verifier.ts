import {
  add,
  ceilRational,
  compare,
  divide,
  equals,
  modulo,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp012ExecutableInput, TsdCp012ExecutableSolution, TsdCp012Route, TsdCp012Stage, TsdCp012TimedStage } from "./executable-types";

const ZERO = rational(0);
function sum(values: readonly Rational[]) { return values.reduce((a, b) => add(a, b), ZERO); }
function timedDistance(stage: TsdCp012TimedStage) { return multiply(stage.speed, stage.duration); }
function stageTime(stage: TsdCp012Stage) { return divide(stage.distance, stage.speed); }
function routeTime(route: TsdCp012Route) { return sum(route.segments.map(stageTime)); }
function absDiff(a: Rational, b: Rational) { return compare(a, b) >= 0 ? subtract(a, b) : subtract(b, a); }
function scalar(solution: TsdCp012ExecutableSolution): Rational | undefined { return solution.kind === "SCALAR" ? solution.answer : undefined; }
function unitIs(solution: TsdCp012ExecutableSolution, unit: string) { return solution.kind === "SCALAR" && solution.unit === unit; }
function integerValue(value: Rational): number | undefined {
  if (value.denominator !== 1n) return undefined;
  const n = Number(value.numerator);
  return Number.isSafeInteger(n) ? n : undefined;
}
function sameSet(a: readonly Rational[], b: readonly Rational[]) {
  return a.length === b.length && a.every((value, index) => equals(value, b[index]!));
}
function movementRests(distance: Rational, speed: Rational, duration: Rational) {
  const blockDistance = multiply(speed, duration);
  if (compare(distance, ZERO) <= 0 || compare(blockDistance, ZERO) <= 0) return undefined;
  const blocks = ceilRational(divide(distance, blockDistance));
  return blocks > 0n ? blocks - 1n : undefined;
}

export function verifyTsdCp012(input: TsdCp012ExecutableInput, claimed: TsdCp012ExecutableSolution): Readonly<{ accepted: boolean; reason: string }> {
  try {
    const answer = scalar(claimed);
    switch (input.authorityKey) {
      case "discreteSpeedProgramState": {
        if (input.target === "TOTAL_DISTANCE") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && equals(answer, sum(input.stages.map(timedDistance))), reason: "distance ledger" });
        if (input.target === "TOTAL_TIME") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && equals(answer, sum(input.stages.map(stageTime))), reason: "time ledger" });
        if (input.target === "UNKNOWN_FINAL_SPEED") {
          const prior = sum(input.priorStages.map(timedDistance));
          return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE_PER_SECOND") && compare(answer, ZERO) > 0 && equals(add(prior, multiply(answer, input.finalDuration)), input.totalDistance), reason: "final-stage distance equation" });
        }
        const cycleDistance = sum(input.cycle.map(timedDistance));
        const partialDistance = sum(input.partialStages.map(timedDistance));
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && equals(answer, add(multiply(cycleDistance, rational(input.fullCycles)), partialDistance)), reason: "periodic distance equation" });
      }

      case "periodicTravelRestProgramState": {
        const rests = movementRests(input.distance, input.travelSpeed, input.travelDurationPerBlock);
        if (rests === undefined) return Object.freeze({ accepted: false, reason: "invalid cycle" });
        if (input.target === "REST_COUNT") return Object.freeze({ accepted: !!answer && unitIs(claimed, "COUNT") && equals(answer, rational(rests)), reason: "rest count" });
        const movingTime = divide(input.distance, input.travelSpeed);
        if (input.target === "COMPLETION_TIME") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && equals(answer, add(movingTime, multiply(rational(rests), input.restDuration))), reason: "movement plus rests" });
        return Object.freeze({ accepted: !!answer && rests > 0n && unitIs(claimed, "SECOND") && equals(add(movingTime, multiply(rational(rests), answer)), input.totalElapsedTime), reason: "inverse rest duration" });
      }

      case "terminalConstraintProgramState": {
        if (input.target === "REQUIRED_FINAL_SPEED") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE_PER_SECOND") && compare(answer, ZERO) > 0 && equals(add(input.completedDistance, multiply(answer, subtract(input.deadline, input.elapsedTime))), input.totalDistance), reason: "terminal distance/deadline equation" });
        if (input.target === "REQUIRED_FINAL_TIME") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, ZERO) > 0 && equals(add(input.completedDistance, multiply(input.finalSpeed, answer)), input.totalDistance), reason: "terminal stage equation" });
        if (input.target === "STAGE_BOUNDARY_DISTANCE") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && compare(answer, ZERO) >= 0 && compare(answer, input.totalDistance) <= 0 && equals(add(divide(answer, input.firstSpeed), divide(subtract(input.totalDistance, answer), input.secondSpeed)), input.totalTime), reason: "two-stage boundary equation" });
        if (input.target === "MAXIMUM_DELAY") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, ZERO) >= 0 && equals(add(answer, divide(input.distance, input.speed)), input.arrivalDeadline), reason: "latest departure equality" });
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE_PER_SECOND") && compare(answer, ZERO) > 0 && equals(multiply(answer, input.availableTime), input.distance), reason: "minimum speed boundary" });
      }

      case "routeProfileProgramState": {
        if (input.target === "TOTAL_TIME") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && equals(answer, routeTime({ segments: input.segments })), reason: "route segment sum" });
        if (input.target === "DISTANCE_SPLIT_A") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && compare(answer, ZERO) >= 0 && compare(answer, input.totalDistance) <= 0 && equals(add(divide(answer, input.speedA), divide(subtract(input.totalDistance, answer), input.speedB)), input.totalTime), reason: "two-mode split equation" });
        if (input.target === "FASTEST_ROUTE_INDEX") {
          if (!answer || !unitIs(claimed, "INDEX")) return Object.freeze({ accepted: false, reason: "index unit" });
          const index = integerValue(answer);
          if (!index || index < 1 || index > input.routes.length) return Object.freeze({ accepted: false, reason: "index range" });
          const selected = routeTime(input.routes[index - 1]!);
          const accepted = input.routes.every((route, i) => i === index - 1 || compare(selected, routeTime(route)) < 0);
          return Object.freeze({ accepted, reason: "unique minimum route" });
        }
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && equals(answer, absDiff(routeTime(input.routeA), routeTime(input.routeB))), reason: "route time difference" });
      }

      case "motionReconstructionProgramState": {
        if (input.target === "MISSING_DISTANCE") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && equals(add(sum(input.knownDistances), answer), input.totalDistance), reason: "distance total" });
        if (input.target === "MISSING_TIME") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && equals(add(sum(input.knownTimes), answer), input.totalTime), reason: "time total" });
        if (input.target === "MISSING_SPEED") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE_PER_SECOND") && compare(answer, ZERO) > 0 && equals(multiply(answer, input.missingTime), input.missingDistance), reason: "missing-stage rate" });
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && equals(add(input.knownStage.distance, answer), input.totalDistance) && equals(add(stageTime(input.knownStage), divide(answer, input.missingSpeed)), input.totalTime), reason: "ledger reconstruction" });
      }

      case "trainScheduleSynthesisState": {
        if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, input.delayB) >= 0 && equals(add(multiply(input.speedA, answer), multiply(input.speedB, subtract(answer, input.delayB))), input.stationDistance), reason: "opposite train meeting with delay" });
        if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") {
          const totalClosure = add(add(input.initialGap, input.lengthA), input.lengthB);
          return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, input.delayB) >= 0 && equals(add(multiply(input.speedA, answer), multiply(input.speedB, subtract(answer, input.delayB))), totalClosure), reason: "finite train complete crossing with delay" });
        }
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, ZERO) >= 0 && compare(answer, input.meetingTimeFromFirstDeparture) <= 0 && equals(add(multiply(input.speedA, input.meetingTimeFromFirstDeparture), multiply(input.speedB, subtract(input.meetingTimeFromFirstDeparture, answer))), input.stationDistance), reason: "inverse train departure delay" });
      }

      case "mediumPursuitSynthesisState": {
        if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return Object.freeze({ accepted: !!answer && unitIs(claimed, "SECOND") && compare(answer, input.boatStartDelay) >= 0 && equals(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), subtract(answer, input.boatStartDelay)), multiply(input.currentSpeed, answer)), reason: "boat catches current-driven raft" });
        if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") {
          if (!answer || !unitIs(claimed, "METRE") || compare(input.currentSpeed, ZERO) <= 0) return Object.freeze({ accepted: false, reason: "catch distance feasibility" });
          const catchTime = divide(answer, input.currentSpeed);
          return Object.freeze({ accepted: compare(catchTime, input.boatStartDelay) >= 0 && equals(multiply(add(input.boatStillWaterSpeed, input.currentSpeed), subtract(catchTime, input.boatStartDelay)), answer), reason: "raft catch distance equation" });
        }
        if (input.target === "CURRENT_SPEED") return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE_PER_SECOND") && compare(answer, ZERO) >= 0 && equals(multiply(add(input.boatStillWaterSpeed, answer), subtract(input.catchTimeFromRaftStart, input.boatStartDelay)), multiply(answer, input.catchTimeFromRaftStart)), reason: "inverse current from raft catch" });
        return Object.freeze({ accepted: !!answer && unitIs(claimed, "METRE") && compare(input.boatStillWaterSpeed, input.currentSpeed) > 0 && equals(answer, multiply(rational(2), multiply(input.currentSpeed, input.detectionDelay))), reason: "dropped-object recovery displacement" });
      }

      case "closedTrackRaceSynthesisState": {
        if (compare(input.fasterSpeed, input.slowerSpeed) <= 0) return Object.freeze({ accepted: false, reason: "runner ordering" });
        if (input.target === "TRACK_GAP_AT_FASTER_FINISH") {
          if (!answer || !unitIs(claimed, "METRE")) return Object.freeze({ accepted: false, reason: "track gap unit" });
          const raceDistance = multiply(input.trackLength, rational(input.raceLaps));
          const finishTime = divide(raceDistance, input.fasterSpeed);
          const slowerPosition = modulo(add(input.slowerHeadStart, multiply(input.slowerSpeed, finishTime)), input.trackLength);
          return Object.freeze({ accepted: equals(answer, modulo(subtract(ZERO, slowerPosition), input.trackLength)), reason: "modular finish position" });
        }
        if (input.target === "HEAD_START_FOR_DEAD_HEAT") {
          if (!answer || !unitIs(claimed, "METRE")) return Object.freeze({ accepted: false, reason: "head start unit" });
          const raceDistance = multiply(input.trackLength, rational(input.raceLaps));
          const time = divide(raceDistance, input.fasterSpeed);
          return Object.freeze({ accepted: equals(add(answer, multiply(input.slowerSpeed, time)), raceDistance), reason: "dead-heat distance equality" });
        }
        if (!answer || !unitIs(claimed, "SECOND")) return Object.freeze({ accepted: false, reason: "overtake time unit" });
        const relative = subtract(input.fasterSpeed, input.slowerSpeed);
        const head = compare(input.slowerHeadStart, ZERO) === 0 ? input.trackLength : modulo(input.slowerHeadStart, input.trackLength);
        const gap = compare(head, ZERO) === 0 ? input.trackLength : head;
        return Object.freeze({ accepted: equals(multiply(relative, answer), gap), reason: "first modular overtake" });
      }

      case "movingSurfaceScheduleSynthesisState": {
        if (!answer || !unitIs(claimed, "SECOND")) return Object.freeze({ accepted: false, reason: "time unit" });
        if (input.target === "TIME_WITH_STOP_AFTER") {
          const activeUsed = compare(answer, input.surfaceActiveTime) <= 0 ? answer : input.surfaceActiveTime;
          const stoppedUsed = compare(answer, input.surfaceActiveTime) <= 0 ? ZERO : subtract(answer, input.surfaceActiveTime);
          return Object.freeze({ accepted: equals(add(multiply(add(input.personRate, input.surfaceRate), activeUsed), multiply(input.personRate, stoppedUsed)), input.length), reason: "surface active then stopped" });
        }
        if (input.target === "TIME_WITH_DELAYED_ACTIVATION") {
          const before = compare(answer, input.activationDelay) <= 0 ? answer : input.activationDelay;
          const after = compare(answer, input.activationDelay) <= 0 ? ZERO : subtract(answer, input.activationDelay);
          return Object.freeze({ accepted: equals(add(multiply(input.personRate, before), multiply(add(input.personRate, input.surfaceRate), after)), input.length), reason: "delayed surface activation" });
        }
        if (input.target === "TIME_WITH_DIRECTION_REVERSAL") {
          if (compare(input.personRate, input.surfaceRate) <= 0) return Object.freeze({ accepted: false, reason: "post-reversal feasibility" });
          const before = compare(answer, input.reversalTime) <= 0 ? answer : input.reversalTime;
          const after = compare(answer, input.reversalTime) <= 0 ? ZERO : subtract(answer, input.reversalTime);
          return Object.freeze({ accepted: equals(add(multiply(add(input.personRate, input.surfaceRate), before), multiply(subtract(input.personRate, input.surfaceRate), after)), input.length), reason: "surface direction reversal" });
        }
        return Object.freeze({ accepted: compare(answer, ZERO) >= 0 && compare(answer, input.totalTime) <= 0 && equals(add(multiply(add(input.personRate, input.surfaceRate), answer), multiply(input.personRate, subtract(input.totalTime, answer))), input.length), reason: "inverse active-surface interval" });
      }

      case "twoEngineInverseState": {
        if (!answer || !unitIs(claimed, "PARAMETER")) return Object.freeze({ accepted: false, reason: "parameter unit" });
        const determinant = subtract(multiply(input.a1, input.b2), multiply(input.a2, input.b1));
        if (compare(determinant, ZERO) === 0) return Object.freeze({ accepted: false, reason: "singular coupled system" });
        if (input.target === "X") {
          const y = divide(subtract(multiply(input.a1, input.c2), multiply(input.a2, input.c1)), determinant);
          return Object.freeze({ accepted: equals(add(multiply(input.a1, answer), multiply(input.b1, y)), input.c1) && equals(add(multiply(input.a2, answer), multiply(input.b2, y)), input.c2), reason: "two coupled engine equations" });
        }
        const x = divide(subtract(multiply(input.c1, input.b2), multiply(input.c2, input.b1)), determinant);
        return Object.freeze({ accepted: equals(add(multiply(input.a1, x), multiply(input.b1, answer)), input.c1) && equals(add(multiply(input.a2, x), multiply(input.b2, answer)), input.c2), reason: "two coupled engine equations" });
      }

      case "feasibleParameterSetState": {
        const valid: Rational[] = [];
        for (let candidate = input.minimumCandidate; candidate <= input.maximumCandidate; candidate += 1) {
          if (!Number.isInteger(candidate) || candidate <= 0) continue;
          const value = rational(candidate);
          const elapsed = add(divide(input.distance, value), input.fixedDelay);
          if (compare(elapsed, input.deadline) <= 0) valid.push(value);
        }
        if (input.target === "COUNT") return Object.freeze({ accepted: !!answer && unitIs(claimed, "COUNT") && equals(answer, rational(valid.length)), reason: "feasible-state count" });
        return Object.freeze({ accepted: claimed.kind === "SET" && claimed.unit === "PARAMETER_SET" && sameSet(claimed.values, valid), reason: "complete feasible parameter set" });
      }
    }
  } catch (error) {
    return Object.freeze({ accepted: false, reason: error instanceof Error ? error.message : "verification error" });
  }
}
