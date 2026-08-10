import { add, equals, rational } from "../foundation/rational";
import { solveCp003 } from "./solver";
import type { TsdCp003SolveInput, TsdCp003SolvedUnit } from "./types";
import { verifyCp003 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const cases: readonly { input: TsdCp003SolveInput; expected: ReturnType<typeof rational>; unit: TsdCp003SolvedUnit }[] = [
  {
    input: {
      solveMode: "timeGainLossFromSpeedChange",
      distance: rational(120),
      originalSpeed: rational(40),
      changedSpeed: rational(60),
    },
    expected: rational(1),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "distanceFromSpeedTimeDifference",
      slowerSpeed: rational(40),
      fasterSpeed: rational(60),
      timeDifference: rational(1),
    },
    expected: rational(120),
    unit: "KM",
  },
  {
    input: {
      solveMode: "speedFromFixedRouteTimeDifference",
      representation: "KNOWN_OTHER_SPEED",
      distance: rational(120),
      timeDifference: rational(1),
      knownSpeed: rational(40),
      unknownRole: "FASTER",
    },
    expected: rational(60),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "speedFromFixedRouteTimeDifference",
      representation: "KNOWN_SPEED_RATIO",
      distance: rational(200),
      timeDifference: rational(1),
      slowerRatio: rational(4),
      fasterRatio: rational(5),
      target: "FASTER",
    },
    expected: rational(50),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "usualSpeedFromEarlyLatePair",
      slowerTrialSpeed: rational(40),
      fasterTrialSpeed: rational(60),
      lateBy: rational(1),
      earlyBy: rational(1),
    },
    expected: rational(48),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "distanceFromEarlyLatePair",
      slowerTrialSpeed: rational(40),
      fasterTrialSpeed: rational(60),
      lateBy: rational(1),
      earlyBy: rational(1),
    },
    expected: rational(240),
    unit: "KM",
  },
  {
    input: {
      solveMode: "scheduledArrivalTimeFromActualSpeed",
      departureMinuteFromDayZero: rational(480),
      distance: rational(120),
      actualSpeed: rational(60),
    },
    expected: rational(600),
    unit: "CLOCK_MINUTE",
  },
  {
    input: {
      solveMode: "requiredRecoverySpeedAfterLostTime",
      remainingDistance: rational(90),
      remainingAvailableTime: rational(3, 2),
    },
    expected: rational(60),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "requiredRemainingSpeedAfterPartialRoute",
      totalDistance: rational(240),
      scheduledTotalTime: rational(4),
      completedDistance: rational(60),
      completedSpeed: rational(30),
    },
    expected: rational(90),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "stoppageDurationFromRunningAndOverallSpeed",
      distance: rational(120),
      runningSpeed: rational(60),
      overallSpeed: rational(48),
    },
    expected: rational(1, 2),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "overallSpeedIncludingStops",
      distance: rational(120),
      runningSpeed: rational(60),
      totalStopTime: rational(1, 2),
    },
    expected: rational(48),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "runningSpeedFromOverallSpeedAndStops",
      distance: rational(120),
      overallSpeed: rational(48),
      totalStopTime: rational(1, 2),
    },
    expected: rational(60),
    unit: "KMPH",
  },
  {
    input: {
      solveMode: "numberOfStopsFromOverallDelay",
      totalDelay: rational(1, 2),
      stopDuration: rational(1, 12),
    },
    expected: rational(6),
    unit: "COUNT",
  },
  {
    input: {
      solveMode: "delayFromRegularStops",
      stopCount: rational(6),
      stopDuration: rational(1, 12),
    },
    expected: rational(1, 2),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "restTimeInRepeatedTravelRestCycle",
      travelTimePerCycle: rational(1, 2),
      cycleCount: rational(4),
      restEvents: rational(3),
      totalElapsedTime: rational(11, 4),
    },
    expected: rational(1, 4),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "totalTimeWithRegularStops",
      runningTime: rational(3),
      stopCount: rational(4),
      stopDuration: rational(1, 8),
    },
    expected: rational(7, 2),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "speedChangePointDistance",
      totalDistance: rational(120),
      totalTravelTime: rational(3),
      firstSpeed: rational(30),
      secondSpeed: rational(60),
    },
    expected: rational(60),
    unit: "KM",
  },
  {
    input: {
      solveMode: "fractionOfRouteAtChangedSpeed",
      totalDistance: rational(120),
      totalTravelTime: rational(3),
      originalSpeed: rational(30),
      changedSpeed: rational(60),
    },
    expected: rational(50),
    unit: "PERCENT",
  },
  {
    input: {
      solveMode: "lostTimeDurationFromScheduleRecovery",
      remainingDistance: rational(120),
      usualSpeed: rational(60),
      recoverySpeed: rational(80),
      finalArrivalDelay: rational(1, 4),
    },
    expected: rational(3, 4),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "startTimeShiftForSameArrival",
      distance: rational(120),
      originalSpeed: rational(40),
      newSpeed: rational(60),
    },
    expected: rational(1),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "arrivalShiftFromDepartureAndSpeedChanges",
      distance: rational(120),
      originalSpeed: rational(60),
      newSpeed: rational(40),
      departureShift: rational(-1, 2),
    },
    expected: rational(1, 2),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "walkingRidingAllocation",
      totalDistance: rational(30),
      totalTime: rational(2),
      walkingSpeed: rational(5),
      ridingSpeed: rational(20),
      target: "WALKING_DISTANCE",
    },
    expected: rational(10, 3),
    unit: "KM",
  },
  {
    input: {
      solveMode: "walkingRidingAllocation",
      totalDistance: rational(30),
      totalTime: rational(2),
      walkingSpeed: rational(5),
      ridingSpeed: rational(20),
      target: "RIDING_TIME",
    },
    expected: rational(4, 3),
    unit: "HOUR",
  },
  {
    input: {
      solveMode: "scheduleBuffer",
      scheduledDuration: rational(4),
      plannedTravelDuration: rational(7, 2),
    },
    expected: rational(1, 2),
    unit: "HOUR",
  },
];

let tamperRejections = 0;
for (const testCase of cases) {
  const certificate = solveCp003(testCase.input);
  assert(equals(certificate.answer, testCase.expected), `${testCase.input.solveMode}: exact answer mismatch`);
  assert(certificate.unit === testCase.unit, `${testCase.input.solveMode}: answer unit mismatch`);
  const verification = verifyCp003(testCase.input, certificate);
  assert(verification.valid, `${testCase.input.solveMode}: independent verification failed: ${verification.errors.join("; ")}`);

  const tampered = Object.freeze({ ...certificate, answer: add(certificate.answer, rational(1)) });
  const tamperedVerification = verifyCp003(testCase.input, tampered);
  assert(!tamperedVerification.valid, `${testCase.input.solveMode}: tampered answer was accepted`);
  tamperRejections += 1;
}

const exercisedModes = new Set(cases.map((testCase) => testCase.input.solveMode));
assert(exercisedModes.size === 22, `Expected all 22 learner solve modes, exercised ${exercisedModes.size}`);

let invalidInputRejections = 0;
for (const invalidInput of [
  {
    solveMode: "timeGainLossFromSpeedChange",
    distance: rational(100),
    originalSpeed: rational(50),
    changedSpeed: rational(50),
  },
  {
    solveMode: "distanceFromSpeedTimeDifference",
    slowerSpeed: rational(60),
    fasterSpeed: rational(40),
    timeDifference: rational(1),
  },
  {
    solveMode: "speedFromFixedRouteTimeDifference",
    representation: "KNOWN_OTHER_SPEED",
    distance: rational(100),
    timeDifference: rational(3),
    knownSpeed: rational(40),
    unknownRole: "FASTER",
  },
  {
    solveMode: "scheduledArrivalTimeFromActualSpeed",
    departureMinuteFromDayZero: rational(-1),
    distance: rational(60),
    actualSpeed: rational(60),
  },
  {
    solveMode: "requiredRemainingSpeedAfterPartialRoute",
    totalDistance: rational(100),
    scheduledTotalTime: rational(2),
    completedDistance: rational(100),
    completedSpeed: rational(50),
  },
  {
    solveMode: "stoppageDurationFromRunningAndOverallSpeed",
    distance: rational(100),
    runningSpeed: rational(40),
    overallSpeed: rational(50),
  },
  {
    solveMode: "numberOfStopsFromOverallDelay",
    totalDelay: rational(1),
    stopDuration: rational(3, 10),
  },
  {
    solveMode: "restTimeInRepeatedTravelRestCycle",
    travelTimePerCycle: rational(1),
    cycleCount: rational(2),
    restEvents: rational(1),
    totalElapsedTime: rational(3, 2),
  },
  {
    solveMode: "speedChangePointDistance",
    totalDistance: rational(100),
    totalTravelTime: rational(1),
    firstSpeed: rational(30),
    secondSpeed: rational(60),
  },
  {
    solveMode: "fractionOfRouteAtChangedSpeed",
    totalDistance: rational(100),
    totalTravelTime: rational(2),
    originalSpeed: rational(50),
    changedSpeed: rational(50),
  },
  {
    solveMode: "lostTimeDurationFromScheduleRecovery",
    remainingDistance: rational(100),
    usualSpeed: rational(60),
    recoverySpeed: rational(50),
    finalArrivalDelay: rational(0),
  },
  {
    solveMode: "startTimeShiftForSameArrival",
    distance: rational(100),
    originalSpeed: rational(50),
    newSpeed: rational(50),
  },
  {
    solveMode: "arrivalShiftFromDepartureAndSpeedChanges",
    distance: rational(120),
    originalSpeed: rational(60),
    newSpeed: rational(40),
    departureShift: rational(-1),
  },
  {
    solveMode: "walkingRidingAllocation",
    totalDistance: rational(30),
    totalTime: rational(1),
    walkingSpeed: rational(5),
    ridingSpeed: rational(20),
    target: "WALKING_DISTANCE",
  },
  {
    solveMode: "scheduleBuffer",
    scheduledDuration: rational(3),
    plannedTravelDuration: rational(4),
  },
] as const) {
  try {
    solveCp003(invalidInput as TsdCp003SolveInput);
  } catch {
    invalidInputRejections += 1;
  }
}
assert(invalidInputRejections === 15, "CP-003 solver did not reject all invalid boundary states");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_ALL_LEARNER_AUTHORITIES_EXACT_SOLVER",
  learnerSolveModes: exercisedModes.size,
  exactCases: cases.length,
  representationVariants: cases.length - exercisedModes.size,
  tamperRejections,
  invalidInputRejections,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
