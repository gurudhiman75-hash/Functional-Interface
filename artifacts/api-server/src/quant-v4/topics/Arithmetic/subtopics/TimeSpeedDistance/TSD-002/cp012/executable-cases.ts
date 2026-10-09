import { add, multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { solveTsdCp012 } from "./executable-solver";
import type { TsdCp012ExecutableCase, TsdCp012ExecutableInput } from "./executable-types";
import { TSD_CP012_LEARNER_AUTHORITIES } from "./source-saturation";

const q = (n: number, d = 1) => rational(BigInt(n), BigInt(d));

function isRational(value: unknown): value is Rational {
  return !!value && typeof value === "object" && typeof (value as Rational).numerator === "bigint" && typeof (value as Rational).denominator === "bigint";
}

function scaleSemanticValue(value: unknown, key: string, factor: Rational): unknown {
  if (isRational(value)) return /speed|rate/i.test(key) ? value : multiply(value, factor);
  if (Array.isArray(value)) return value.map((item) => scaleSemanticValue(item, key, factor));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, scaleSemanticValue(childValue, childKey, factor)]));
  }
  return value;
}

function scaleSemanticInput(input: TsdCp012ExecutableInput, factorValue: 2 | 3): TsdCp012ExecutableInput {
  return scaleSemanticValue(input, "input", q(factorValue)) as TsdCp012ExecutableInput;
}

export function generateTsdCp012ExecutableCases(): readonly TsdCp012ExecutableCase[] {
  const out: TsdCp012ExecutableCase[] = [];
  const counts = new Map<string, number>();
  const addCase = (input: TsdCp012ExecutableInput) => {
    const next = (counts.get(input.authorityKey) ?? 0) + 1;
    counts.set(input.authorityKey, next);
    out.push(Object.freeze({
      caseId: `TSD-CP012-${input.authorityKey}-${String(next).padStart(2, "0")}`,
      authorityKey: input.authorityKey,
      input: Object.freeze(input),
      expected: solveTsdCp012(input),
    }));
  };

  // 1. Discrete speed programs — distance, time, inverse final rate, periodic partial cycle.
  addCase({ authorityKey: "discreteSpeedProgramState", target: "TOTAL_DISTANCE", stages: [{ speed: q(10), duration: q(5) }, { speed: q(12), duration: q(4) }] });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "TOTAL_DISTANCE", stages: [{ speed: q(6), duration: q(10) }, { speed: q(9), duration: q(6) }, { speed: q(12), duration: q(4) }] });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "TOTAL_TIME", stages: [{ distance: q(60), speed: q(10) }, { distance: q(48), speed: q(8) }] });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "TOTAL_TIME", stages: [{ distance: q(100), speed: q(20) }, { distance: q(90), speed: q(15) }, { distance: q(40), speed: q(10) }] });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "UNKNOWN_FINAL_SPEED", priorStages: [{ speed: q(8), duration: q(5) }, { speed: q(10), duration: q(4) }], finalDuration: q(5), totalDistance: q(140) });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "UNKNOWN_FINAL_SPEED", priorStages: [{ speed: q(12), duration: q(3) }], finalDuration: q(6), totalDistance: q(108) });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "PERIODIC_DISTANCE", cycle: [{ speed: q(5), duration: q(2) }, { speed: q(10), duration: q(1) }], fullCycles: 4, partialStages: [{ speed: q(5), duration: q(1) }] });
  addCase({ authorityKey: "discreteSpeedProgramState", target: "PERIODIC_DISTANCE", cycle: [{ speed: q(6), duration: q(3) }, { speed: q(9), duration: q(2) }, { speed: q(12), duration: q(1) }], fullCycles: 3, partialStages: [{ speed: q(6), duration: q(3) }, { speed: q(9), duration: q(1) }] });

  // 2. Periodic travel/rest programs — no rest is charged after final arrival.
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "COMPLETION_TIME", distance: q(100), travelSpeed: q(10), travelDurationPerBlock: q(3), restDuration: q(5) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "COMPLETION_TIME", distance: q(95), travelSpeed: q(5), travelDurationPerBlock: q(4), restDuration: q(2) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "REST_COUNT", distance: q(100), travelSpeed: q(10), travelDurationPerBlock: q(3) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "REST_COUNT", distance: q(120), travelSpeed: q(8), travelDurationPerBlock: q(5) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "REST_DURATION", distance: q(100), travelSpeed: q(10), travelDurationPerBlock: q(3), totalElapsedTime: q(22) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "REST_DURATION", distance: q(120), travelSpeed: q(8), travelDurationPerBlock: q(5), totalElapsedTime: q(21) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "COMPLETION_TIME", distance: q(60), travelSpeed: q(6), travelDurationPerBlock: q(4), restDuration: q(3) });
  addCase({ authorityKey: "periodicTravelRestProgramState", target: "REST_COUNT", distance: q(81), travelSpeed: q(9), travelDurationPerBlock: q(2) });

  // 3. Terminal/deadline constraints.
  addCase({ authorityKey: "terminalConstraintProgramState", target: "REQUIRED_FINAL_SPEED", completedDistance: q(60), elapsedTime: q(5), totalDistance: q(140), deadline: q(13) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "REQUIRED_FINAL_SPEED", completedDistance: q(120), elapsedTime: q(8), totalDistance: q(210), deadline: q(14) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "REQUIRED_FINAL_TIME", completedDistance: q(60), elapsedTime: q(5), totalDistance: q(140), finalSpeed: q(10) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "STAGE_BOUNDARY_DISTANCE", totalDistance: q(100), totalTime: q(16), firstSpeed: q(10), secondSpeed: q(5) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "STAGE_BOUNDARY_DISTANCE", totalDistance: q(180), totalTime: q(15), firstSpeed: q(18), secondSpeed: q(9) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "MAXIMUM_DELAY", distance: q(120), speed: q(12), arrivalDeadline: q(18) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "MINIMUM_SPEED", distance: q(150), availableTime: q(10) });
  addCase({ authorityKey: "terminalConstraintProgramState", target: "MAXIMUM_DELAY", distance: q(200), speed: q(20), arrivalDeadline: q(16) });

  // 4. Route profiles and finite route choice.
  addCase({ authorityKey: "routeProfileProgramState", target: "TOTAL_TIME", segments: [{ distance: q(60), speed: q(10) }, { distance: q(80), speed: q(20) }] });
  addCase({ authorityKey: "routeProfileProgramState", target: "TOTAL_TIME", segments: [{ distance: q(90), speed: q(15) }, { distance: q(40), speed: q(10) }, { distance: q(100), speed: q(20) }] });
  addCase({ authorityKey: "routeProfileProgramState", target: "DISTANCE_SPLIT_A", totalDistance: q(100), totalTime: q(16), speedA: q(10), speedB: q(5) });
  addCase({ authorityKey: "routeProfileProgramState", target: "DISTANCE_SPLIT_A", totalDistance: q(180), totalTime: q(15), speedA: q(18), speedB: q(9) });
  addCase({ authorityKey: "routeProfileProgramState", target: "FASTEST_ROUTE_INDEX", routes: [{ segments: [{ distance: q(100), speed: q(10) }] }, { segments: [{ distance: q(60), speed: q(12) }, { distance: q(40), speed: q(20) }] }, { segments: [{ distance: q(100), speed: q(8) }] }] });
  addCase({ authorityKey: "routeProfileProgramState", target: "FASTEST_ROUTE_INDEX", routes: [{ segments: [{ distance: q(120), speed: q(12) }] }, { segments: [{ distance: q(50), speed: q(10) }, { distance: q(70), speed: q(14) }] }, { segments: [{ distance: q(120), speed: q(20) }] }] });
  addCase({ authorityKey: "routeProfileProgramState", target: "TIME_DIFFERENCE_BETWEEN_ROUTES", routeA: { segments: [{ distance: q(100), speed: q(10) }] }, routeB: { segments: [{ distance: q(60), speed: q(12) }, { distance: q(40), speed: q(20) }] } });
  addCase({ authorityKey: "routeProfileProgramState", target: "TIME_DIFFERENCE_BETWEEN_ROUTES", routeA: { segments: [{ distance: q(180), speed: q(15) }] }, routeB: { segments: [{ distance: q(90), speed: q(10) }, { distance: q(90), speed: q(30) }] } });

  // 5. Motion-state reconstruction.
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_DISTANCE", totalDistance: q(200), knownDistances: [q(60), q(80)] });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_DISTANCE", totalDistance: q(350), knownDistances: [q(100), q(75), q(125)] });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_TIME", totalTime: q(20), knownTimes: [q(5), q(7)] });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_TIME", totalTime: q(30), knownTimes: [q(8), q(6), q(5)] });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_SPEED", missingDistance: q(90), missingTime: q(6) });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_SPEED", missingDistance: q(140), missingTime: q(10) });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_STAGE_DISTANCE", totalDistance: q(140), totalTime: q(14), knownStage: { distance: q(60), speed: q(10) }, missingSpeed: q(10) });
  addCase({ authorityKey: "motionReconstructionProgramState", target: "MISSING_STAGE_DISTANCE", totalDistance: q(180), totalTime: q(14), knownStage: { distance: q(60), speed: q(10) }, missingSpeed: q(15) });

  // 6. Train + schedule synthesis.
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "MEETING_TIME_FROM_FIRST_DEPARTURE", stationDistance: q(1000), speedA: q(10), speedB: q(15), delayB: q(20) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "MEETING_TIME_FROM_FIRST_DEPARTURE", stationDistance: q(1500), speedA: q(20), speedB: q(10), delayB: q(30) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "MEETING_TIME_FROM_FIRST_DEPARTURE", stationDistance: q(900), speedA: q(12), speedB: q(18), delayB: q(10) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE", initialGap: q(500), lengthA: q(100), lengthB: q(100), speedA: q(10), speedB: q(20), delayB: q(10) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE", initialGap: q(600), lengthA: q(120), lengthB: q(180), speedA: q(15), speedB: q(25), delayB: q(8) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "DELAY_B", stationDistance: q(950), speedA: q(10), speedB: q(15), meetingTimeFromFirstDeparture: q(50) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "DELAY_B", stationDistance: q(1320), speedA: q(18), speedB: q(12), meetingTimeFromFirstDeparture: q(48) });
  addCase({ authorityKey: "trainScheduleSynthesisState", target: "DELAY_B", stationDistance: q(840), speedA: q(12), speedB: q(18), meetingTimeFromFirstDeparture: q(36) });

  // 7. Signed-medium pursuit synthesis.
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "RAFT_CATCH_TIME_FROM_RAFT_START", boatStillWaterSpeed: q(10), currentSpeed: q(2), boatStartDelay: q(5) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "RAFT_CATCH_TIME_FROM_RAFT_START", boatStillWaterSpeed: q(12), currentSpeed: q(3), boatStartDelay: q(8) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "RAFT_CATCH_DISTANCE_FROM_START", boatStillWaterSpeed: q(10), currentSpeed: q(2), boatStartDelay: q(5) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "RAFT_CATCH_DISTANCE_FROM_START", boatStillWaterSpeed: q(15), currentSpeed: q(5), boatStartDelay: q(6) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "CURRENT_SPEED", boatStillWaterSpeed: q(10), boatStartDelay: q(5), catchTimeFromRaftStart: q(6) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "CURRENT_SPEED", boatStillWaterSpeed: q(12), boatStartDelay: q(8), catchTimeFromRaftStart: q(10) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "DROPPED_OBJECT_RECOVERY_DISTANCE", currentSpeed: q(2), detectionDelay: q(5), boatStillWaterSpeed: q(10) });
  addCase({ authorityKey: "mediumPursuitSynthesisState", target: "DROPPED_OBJECT_RECOVERY_DISTANCE", currentSpeed: q(3), detectionDelay: q(8), boatStillWaterSpeed: q(12) });

  // 8. Closed-track + race synthesis.
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "TRACK_GAP_AT_FASTER_FINISH", trackLength: q(400), raceLaps: 2, fasterSpeed: q(10), slowerSpeed: q(8), slowerHeadStart: q(50) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "TRACK_GAP_AT_FASTER_FINISH", trackLength: q(300), raceLaps: 3, fasterSpeed: q(12), slowerSpeed: q(9), slowerHeadStart: q(30) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "TRACK_GAP_AT_FASTER_FINISH", trackLength: q(500), raceLaps: 2, fasterSpeed: q(15), slowerSpeed: q(12), slowerHeadStart: q(100) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "HEAD_START_FOR_DEAD_HEAT", trackLength: q(400), raceLaps: 1, fasterSpeed: q(10), slowerSpeed: q(8) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "HEAD_START_FOR_DEAD_HEAT", trackLength: q(300), raceLaps: 2, fasterSpeed: q(12), slowerSpeed: q(9) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "FIRST_OVERTAKE_TIME", trackLength: q(400), fasterSpeed: q(10), slowerSpeed: q(8), slowerHeadStart: q(100) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "FIRST_OVERTAKE_TIME", trackLength: q(400), fasterSpeed: q(10), slowerSpeed: q(8), slowerHeadStart: q(0) });
  addCase({ authorityKey: "closedTrackRaceSynthesisState", target: "FIRST_OVERTAKE_TIME", trackLength: q(300), fasterSpeed: q(12), slowerSpeed: q(9), slowerHeadStart: q(60) });

  // 9. Moving-surface schedule synthesis.
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_STOP_AFTER", length: q(100), personRate: q(2), surfaceRate: q(1), surfaceActiveTime: q(20) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_STOP_AFTER", length: q(90), personRate: q(3), surfaceRate: q(1), surfaceActiveTime: q(10) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_DELAYED_ACTIVATION", length: q(100), personRate: q(2), surfaceRate: q(1), activationDelay: q(20) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_DELAYED_ACTIVATION", length: q(120), personRate: q(3), surfaceRate: q(2), activationDelay: q(10) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_DIRECTION_REVERSAL", length: q(100), personRate: q(3), surfaceRate: q(1), reversalTime: q(20) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "TIME_WITH_DIRECTION_REVERSAL", length: q(120), personRate: q(4), surfaceRate: q(1), reversalTime: q(15) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "UNKNOWN_ACTIVE_TIME_BEFORE_STOP", length: q(100), personRate: q(2), surfaceRate: q(1), totalTime: q(40) });
  addCase({ authorityKey: "movingSurfaceScheduleSynthesisState", target: "UNKNOWN_ACTIVE_TIME_BEFORE_STOP", length: q(150), personRate: q(3), surfaceRate: q(2), totalTime: q(40) });

  // 10. Coupled two-engine inverse systems. c-values are generated from known positive x/y states.
  const coupled = [
    [q(4), q(3), q(1), q(1), q(2), q(-1)],
    [q(5), q(2), q(2), q(1), q(1), q(-1)],
    [q(6), q(4), q(1), q(2), q(3), q(-1)],
    [q(7), q(5), q(2), q(1), q(1), q(2)],
    [q(8), q(3), q(3), q(1), q(2), q(-1)],
    [q(9), q(4), q(1), q(3), q(2), q(1)],
    [q(10), q(6), q(2), q(3), q(1), q(-1)],
    [q(12), q(5), q(1), q(2), q(4), q(-1)],
  ] as const;
  coupled.forEach(([x, y, a1, b1, a2, b2], index) => {
    const c1 = add(multiply(a1, x), multiply(b1, y));
    const c2 = add(multiply(a2, x), multiply(b2, y));
    addCase({ authorityKey: "twoEngineInverseState", target: index % 2 === 0 ? "X" : "Y", a1, b1, c1, a2, b2, c2 });
  });

  // 11. Finite feasible parameter sets/counts.
  addCase({ authorityKey: "feasibleParameterSetState", target: "VALID_SET", minimumCandidate: 1, maximumCandidate: 10, distance: q(100), deadline: q(20), fixedDelay: q(0) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "COUNT", minimumCandidate: 1, maximumCandidate: 10, distance: q(100), deadline: q(20), fixedDelay: q(0) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "VALID_SET", minimumCandidate: 5, maximumCandidate: 15, distance: q(120), deadline: q(15), fixedDelay: q(3) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "COUNT", minimumCandidate: 5, maximumCandidate: 15, distance: q(120), deadline: q(15), fixedDelay: q(3) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "VALID_SET", minimumCandidate: 4, maximumCandidate: 12, distance: q(60), deadline: q(10), fixedDelay: q(2) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "COUNT", minimumCandidate: 4, maximumCandidate: 12, distance: q(60), deadline: q(10), fixedDelay: q(2) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "VALID_SET", minimumCandidate: 6, maximumCandidate: 20, distance: q(180), deadline: q(15), fixedDelay: q(3) });
  addCase({ authorityKey: "feasibleParameterSetState", target: "COUNT", minimumCandidate: 6, maximumCandidate: 20, distance: q(180), deadline: q(15), fixedDelay: q(3) });

  const originalCases = [...out];
  for (const factor of [2, 3] as const) {
    for (const original of originalCases) addCase(scaleSemanticInput(original.input, factor));
  }

  for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
    if ((counts.get(authorityKey) ?? 0) !== 24) throw new Error(`${authorityKey}: expected exactly 24 deterministic executable cases after semantic scaling`);
  }
  return Object.freeze(out);
}
