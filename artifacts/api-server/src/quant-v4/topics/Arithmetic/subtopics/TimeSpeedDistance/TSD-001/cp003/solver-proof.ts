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
] as const) {
  try {
    solveCp003(invalidInput as TsdCp003SolveInput);
  } catch {
    invalidInputRejections += 1;
  }
}
assert(invalidInputRejections === 6, "CP-003 solver did not reject all invalid boundary states");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_SCHEDULE_AND_STOPPAGE_EXACT_SOLVER",
  executableSolveModes: cases.length,
  exactCases: cases.length,
  tamperRejections,
  invalidInputRejections,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
