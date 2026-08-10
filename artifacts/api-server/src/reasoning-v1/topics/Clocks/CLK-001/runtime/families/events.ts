import {
  absoluteRational,
  addRationals,
  classifyHourMinuteEventAtSecondsExact,
  compareRationals,
  enumerateHourMinuteAngleEventsExact,
  exactRational,
  exactTimeInterval,
  hourMinuteAngleSnapshotExact,
  multiplyRationals,
  nearestSpecialEventExact,
  nthEventAfterExact,
  roundRationalToInteger,
  solveHourMinuteAngleEventsExact,
  standardEventRootsExact,
  subtractRationals,
  totalSecondsToClockTimeExact,
  type ClockEventRoot,
  type ClockEventType,
  type ExactRational,
  type ExactTimeInterval,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type {
  ClockContractEvidence,
  ClockFamilySolverInput,
  SolvedClockPrototype,
} from "../solver-types";
import type { ClockSemanticAnswer } from "../types";
import {
  clockSeconds,
  formatAngle,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  rationalAnswer,
  textAnswer,
  timeAnswer,
  timeSetAnswer,
} from "../utils";

type StandardEventType = Exclude<ClockEventType, "ARBITRARY_ANGLE">;

const CP003_TASKS = new Set<ClockTaskId>([
  "ONE_TIME_FOR_ANGLE_IN_HOUR",
  "ALL_TIMES_FOR_ANGLE_IN_HOUR",
  "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE",
  "NEXT_PREVIOUS_ANGLE_EVENT",
  "EXACT_FRACTIONAL_MINUTE_EVENT",
  "ROUNDED_ANGLE_EVENT",
  "COUNT_SOLUTIONS_IN_HOUR",
  "RECOVER_ANGLE_FROM_CANDIDATE_TIMES",
]);

const CP004_TASKS = new Set<ClockTaskId>([
  "COINCIDENCE_IN_HOUR",
  "OPPOSITION_IN_HOUR",
  "RIGHT_ANGLE_TIMES_IN_HOUR",
  "STRAIGHT_LINE_EVENT",
  "GAP_BETWEEN_SPECIAL_EVENTS",
  "NEAREST_SPECIAL_EVENT",
  "EVENT_ORDER_IN_HOUR",
  "CLASSIFY_EVENT_FROM_TIME",
]);

const CP005_TASKS = new Set<ClockTaskId>([
  "COUNT_COINCIDENCES",
  "COUNT_OPPOSITIONS",
  "COUNT_RIGHT_ANGLES",
  "COUNT_STRAIGHT_LINE",
  "COUNT_ARBITRARY_ANGLE",
  "COUNT_PARTIAL_INTERVAL",
  "NTH_OCCURRENCE",
  "ELAPSED_FOR_EVENT_COUNT",
  "COUNT_WITH_ENDPOINTS",
  "COMPARE_EVENT_FREQUENCIES",
]);

const ANGLE_POOL = [30, 45, 60, 90, 120, 150] as const;
const STANDARD_TYPES = [
  "COINCIDENCE",
  "OPPOSITION",
  "RIGHT_ANGLE",
] as const satisfies readonly StandardEventType[];

function eventLabel(eventType: StandardEventType): string {
  switch (eventType) {
    case "COINCIDENCE":
      return "coincidence";
    case "OPPOSITION":
      return "opposition";
    case "RIGHT_ANGLE":
      return "right angle";
    case "STRAIGHT_LINE":
      return "straight-line position";
  }
}

function intervalLabel(interval: ExactTimeInterval): string {
  const left = interval.includeStart ? "[" : "(";
  const right = interval.includeEnd ? "]" : ")";
  return `${left}${formatClockTimeFromSeconds(interval.startSeconds, { includeSeconds: true })}, ${formatClockTimeFromSeconds(interval.endSeconds, { includeSeconds: true })}${right}`;
}

function hourInterval(
  hour: number,
  includeStart = false,
  includeEnd = false,
): ExactTimeInterval {
  return exactTimeInterval({
    startSeconds: clockSeconds(hour, 0),
    endSeconds: clockSeconds(hour + 1, 0),
    includeStart,
    includeEnd,
  });
}

function arbitraryRoots(
  targetAngleDeg: number,
  interval: ExactTimeInterval,
  independent = false,
): ClockEventRoot[] {
  const request = {
    targetAngleDeg,
    angleMode: "SMALLER" as const,
    interval,
    requestedEventType: "ARBITRARY_ANGLE" as const,
  };
  return independent
    ? enumerateHourMinuteAngleEventsExact(request)
    : solveHourMinuteAngleEventsExact(request);
}

function standardRoots(
  eventType: StandardEventType,
  interval: ExactTimeInterval,
  independent = false,
): ClockEventRoot[] {
  if (eventType === "STRAIGHT_LINE") {
    const coincidence = standardRoots("COINCIDENCE", interval, independent);
    const opposition = standardRoots("OPPOSITION", interval, independent);
    return [...coincidence, ...opposition]
      .sort((left, right) => compareRationals(left.timeSeconds, right.timeSeconds))
      .map((root) => ({ ...root, eventType: "STRAIGHT_LINE" as const }));
  }
  const targetAngleDeg = eventType === "COINCIDENCE"
    ? 0
    : eventType === "OPPOSITION"
      ? 180
      : 90;
  if (independent) {
    return enumerateHourMinuteAngleEventsExact({
      targetAngleDeg,
      angleMode: "SMALLER",
      interval,
      requestedEventType: eventType,
    });
  }
  return standardEventRootsExact(eventType, interval);
}

function rootsKey(roots: readonly ClockEventRoot[]): string {
  return roots
    .map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`)
    .join("|");
}

function requireMatchingRoots(
  analytic: readonly ClockEventRoot[],
  independent: readonly ClockEventRoot[],
  context: string,
): void {
  if (rootsKey(analytic) !== rootsKey(independent)) {
    throw new Error(`CLK event oracle disagreement for ${context}.`);
  }
}

function findArbitraryCase(
  input: ClockFamilySolverInput,
  requiredRootCount: 1 | 2 | "ANY",
): {
  hour: number;
  targetAngleDeg: number;
  interval: ExactTimeInterval;
  analytic: ClockEventRoot[];
  independent: ClockEventRoot[];
} {
  const angles = input.rng.shuffle(ANGLE_POOL);
  const hours = input.rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const);
  for (const targetAngleDeg of angles) {
    for (const hour of hours) {
      const interval = hourInterval(hour);
      const analytic = arbitraryRoots(targetAngleDeg, interval);
      const independent = arbitraryRoots(targetAngleDeg, interval, true);
      requireMatchingRoots(analytic, independent, `${targetAngleDeg}° in hour ${hour}`);
      if (
        (requiredRootCount === "ANY" && analytic.length > 0) ||
        analytic.length === requiredRootCount
      ) {
        return { hour, targetAngleDeg, interval, analytic, independent };
      }
    }
  }
  throw new Error(`No arbitrary-angle case found for required root count ${requiredRootCount}.`);
}

function findStandardHour(
  input: ClockFamilySolverInput,
  eventType: StandardEventType,
  minimumRoots = 1,
): {
  hour: number;
  interval: ExactTimeInterval;
  analytic: ClockEventRoot[];
  independent: ClockEventRoot[];
} {
  for (const hour of input.rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const)) {
    const interval = hourInterval(hour);
    const analytic = standardRoots(eventType, interval);
    const independent = standardRoots(eventType, interval, true);
    requireMatchingRoots(analytic, independent, `${eventType} in hour ${hour}`);
    if (analytic.length >= minimumRoots) {
      return { hour, interval, analytic, independent };
    }
  }
  throw new Error(`No ${eventType} case with ${minimumRoots} roots was found.`);
}

function contract(
  expectedAnswerKind: ClockSemanticAnswer["kind"],
  oracleName: string,
  visibleStemTokens: readonly string[],
): ClockContractEvidence {
  return {
    expectedAnswerKind,
    oracleName,
    visibleStemTokens,
  };
}

function timeDistractors(
  correct: ExactRational,
  allRoots: readonly ClockEventRoot[] = [],
): SolvedClockPrototype["distractors"] {
  const alternatives = allRoots
    .filter((root) => compareRationals(root.timeSeconds, correct) !== 0)
    .map((root) => ({
      answer: timeAnswer(root.timeSeconds, { includeSeconds: true }),
      reasonCode: "OTHER_VALID_ROOT_WRONG_ORDER",
      reason: "This is another valid root, but it does not satisfy the requested earlier, later, next or previous ordering.",
    }));
  return [
    ...alternatives,
    {
      answer: timeAnswer(addRationals(correct, 60), { includeSeconds: true }),
      reasonCode: "ROOT_SHIFTED_ONE_MINUTE",
      reason: "This shifts the exact root by one minute, so the requested angle or special-event equation is no longer satisfied.",
    },
    {
      answer: timeAnswer(subtractRationals(correct, 60), { includeSeconds: true }),
      reasonCode: "ROOT_SHIFTED_BACK_ONE_MINUTE",
      reason: "This moves one minute before the exact root and therefore fails the modular hand-position condition.",
    },
    {
      answer: timeAnswer(addRationals(correct, 300), { includeSeconds: true }),
      reasonCode: "FIVE_MINUTE_ESTIMATE",
      reason: "This uses a rough five-minute estimate instead of the exact fractional-minute event time.",
    },
  ];
}

function countDistractors(count: number): SolvedClockPrototype["distractors"] {
  const lower = Math.max(0, count - 1);
  const doubled = count === 0 ? 2 : count === 1 ? 3 : count * 2;
  return [
    {
      answer: rationalAnswer("COUNT", count + 1, `${count + 1}`),
      reasonCode: "ENDPOINT_DOUBLE_COUNTED",
      reason: "This includes one boundary event that the stated endpoint policy excludes.",
    },
    {
      answer: rationalAnswer("COUNT", lower, `${lower}`),
      reasonCode: "VALID_EVENT_OMITTED",
      reason: "This drops one exact event that lies inside the stated interval.",
    },
    {
      answer: rationalAnswer("COUNT", doubled, `${doubled}`),
      reasonCode: "BRANCH_COUNT_DOUBLED",
      reason: "This counts both algebraic branches without removing duplicates or enforcing the interval.",
    },
  ];
}

function classificationDistractors(
  correct: StandardEventType | "OTHER",
): SolvedClockPrototype["distractors"] {
  return (["COINCIDENCE", "OPPOSITION", "RIGHT_ANGLE", "OTHER"] as const)
    .filter((value) => value !== correct)
    .map((value) => ({
      answer: textAnswer("CLASSIFICATION", value, value.toLowerCase().replaceAll("_", " ")),
      reasonCode: `MISCLASSIFIED_AS_${value}`,
      reason: "This label does not match the exact smaller angle at the supplied time.",
    }));
}

function solveCp003(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "ALL_TIMES_FOR_ANGLE_IN_HOUR") {
    const selected = findArbitraryCase(input, 2);
    const answer = timeSetAnswer(selected.analytic.map((root) => root.timeSeconds));
    const verifierAnswer = timeSetAnswer(selected.independent.map((root) => root.timeSeconds));
    const hourStart = `${selected.hour}:00`;
    const hourEnd = `${selected.hour + 1}:00`;
    return {
      taskId: input.taskId,
      stem: `At what all times strictly between ${hourStart} and ${hourEnd} is the smaller angle between the hour and minute hands ${selected.targetAngleDeg}°?`,
      scenario: {
        hour: selected.hour,
        targetAngleDeg: selected.targetAngleDeg,
        includeStart: false,
        includeEnd: false,
        rootContract: "ALL_TIMES_IN_INTERVAL",
      },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: timeSetAnswer(selected.analytic.slice(1).map((root) => root.timeSeconds)),
          reasonCode: "EARLIER_VALID_ROOT_OMITTED",
          reason: "This keeps only the later algebraic branch and omits the earlier valid time.",
        },
        {
          answer: timeSetAnswer(selected.analytic.slice(0, -1).map((root) => root.timeSeconds)),
          reasonCode: "LATER_VALID_ROOT_OMITTED",
          reason: "This keeps only the earlier branch and omits the later valid time.",
        },
        {
          answer: timeSetAnswer(selected.analytic.map((root) => addRationals(root.timeSeconds, 60))),
          reasonCode: "ALL_ROOTS_SHIFTED_ONE_MINUTE",
          reason: "Every listed time is shifted by one minute and therefore fails the exact angle equation.",
        },
      ],
      explanation: {
        given: `Open interval ${hourStart} to ${hourEnd}; target smaller angle ${selected.targetAngleDeg}°.` ,
        rule: "Solve both relative-angle branches and retain every exact root inside the declared open interval.",
        working: selected.analytic.map((root, index) => `Valid root ${index + 1}: ${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })}.`),
        validityCheck: `Independent phase-cycle enumeration returned the same ${selected.independent.length} roots.`,
        closestTrap: "Using only one ± branch gives an incomplete answer set.",
        answer: answer.display,
      },
      canonicalTrace: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      verifierTrace: selected.independent.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      solveTraceExtras: {
        endpointPolicy: "(start,end)",
        eventRoots: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      },
      contractEvidence: contract("TIME_SET", "CP003_ALL_ROOTS_EXACT_ORACLE", [hourStart, hourEnd, `${selected.targetAngleDeg}°`]),
    };
  }

  if (input.taskId === "COUNT_SOLUTIONS_IN_HOUR") {
    const selected = findArbitraryCase(input, "ANY");
    const answer = rationalAnswer("COUNT", selected.analytic.length, `${selected.analytic.length}`);
    const verifierAnswer = rationalAnswer("COUNT", selected.independent.length, `${selected.independent.length}`);
    const hourStart = `${selected.hour}:00`;
    const hourEnd = `${selected.hour + 1}:00`;
    return {
      taskId: input.taskId,
      stem: `How many times strictly between ${hourStart} and ${hourEnd} is the smaller angle between the hands ${selected.targetAngleDeg}°?`,
      scenario: {
        hour: selected.hour,
        targetAngleDeg: selected.targetAngleDeg,
        includeStart: false,
        includeEnd: false,
      },
      answer,
      verifierAnswer,
      distractors: countDistractors(selected.analytic.length),
      explanation: {
        given: `Target ${selected.targetAngleDeg}° in the open hour interval ${hourStart}–${hourEnd}.`,
        rule: "Solve both exact branches, reject out-of-interval values and count the remaining distinct roots.",
        working: [`Accepted roots: ${selected.analytic.map((root) => formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })).join(", ")}.`, `Count = ${selected.analytic.length}.`],
        validityCheck: "The independent enumerator gives the same distinct-root count.",
        closestTrap: "Counting two algebraic branches automatically can be wrong when a branch is outside the hour or duplicates another root.",
        answer: answer.display,
      },
      canonicalTrace: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      verifierTrace: selected.independent.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      solveTraceExtras: { endpointPolicy: "(start,end)" },
      contractEvidence: contract("COUNT", "CP003_ROOT_CARDINALITY_ORACLE", [hourStart, hourEnd, `${selected.targetAngleDeg}°`]),
    };
  }

  if (input.taskId === "RECOVER_ANGLE_FROM_CANDIDATE_TIMES") {
    const selected = findArbitraryCase(input, 2);
    const candidateTimes = selected.analytic.map((root) => formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true }));
    const firstSnapshot = hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(selected.analytic[0]!.timeSeconds));
    const secondSnapshot = hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(selected.analytic[1]!.timeSeconds));
    if (compareRationals(firstSnapshot.smallerAngleDeg, secondSnapshot.smallerAngleDeg) !== 0) {
      throw new Error("Candidate times do not recover one common angle.");
    }
    const answer = rationalAnswer("ANGLE", firstSnapshot.smallerAngleDeg, formatAngle(firstSnapshot.smallerAngleDeg));
    const verifierAnswer = rationalAnswer("ANGLE", secondSnapshot.smallerAngleDeg, formatAngle(secondSnapshot.smallerAngleDeg));
    return {
      taskId: input.taskId,
      stem: `At both ${candidateTimes[0]} and ${candidateTimes[1]}, the clock hands form the same smaller angle. What is that angle?`,
      scenario: {
        candidateTimes,
        candidateTimeSeconds: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: rationalAnswer("ANGLE", subtractRationals(180, firstSnapshot.smallerAngleDeg), formatAngle(subtractRationals(180, firstSnapshot.smallerAngleDeg))),
          reasonCode: "COMPLEMENT_TO_STRAIGHT_ANGLE",
          reason: "This subtracts from 180° even though the smaller angle is obtained directly from the hand separation.",
        },
        {
          answer: rationalAnswer("ANGLE", subtractRationals(360, firstSnapshot.smallerAngleDeg), formatAngle(subtractRationals(360, firstSnapshot.smallerAngleDeg))),
          reasonCode: "REFLEX_INSTEAD_OF_SMALLER",
          reason: "This reports the reflex angle although the question asks for the common smaller angle.",
        },
        {
          answer: rationalAnswer("ANGLE", addRationals(firstSnapshot.smallerAngleDeg, 30), formatAngle(addRationals(firstSnapshot.smallerAngleDeg, 30))),
          reasonCode: "HOUR_MARK_ADDED",
          reason: "This incorrectly adds one 30° hour-space to the recovered separation.",
        },
      ],
      explanation: {
        given: `Candidate times ${candidateTimes[0]} and ${candidateTimes[1]}.`,
        rule: "Compute the exact hand separation at each supplied time; the common value is the requested angle.",
        working: [`At ${candidateTimes[0]}, smaller angle = ${answer.display}.`, `At ${candidateTimes[1]}, smaller angle = ${verifierAnswer.display}.`],
        validityCheck: "Both independently evaluated candidate times give the same exact angle.",
        closestTrap: "The two times are not averaged; each must separately satisfy the same angle condition.",
        answer: answer.display,
      },
      canonicalTrace: [`first=${firstSnapshot.smallerAngleDeg.numerator}/${firstSnapshot.smallerAngleDeg.denominator}`],
      verifierTrace: [`second=${secondSnapshot.smallerAngleDeg.numerator}/${secondSnapshot.smallerAngleDeg.denominator}`],
      contractEvidence: contract("ANGLE", "CP003_CANDIDATE_TIME_REPLAY_ORACLE", candidateTimes),
    };
  }

  const needsTwoRoots = input.taskId === "NEXT_PREVIOUS_ANGLE_EVENT";
  const selected = findArbitraryCase(input, needsTwoRoots ? 2 : "ANY");
  let selectedRoot = selected.analytic[0]!;
  let verifierRoot = selected.independent[0]!;
  let stem: string;
  let visibleTokens: string[];
  let rootContract = "EARLIER_IN_HOUR";
  let roundingPolicy: string | undefined;

  if (input.taskId === "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE") {
    const anchorSeconds = selected.interval.startSeconds;
    const anchorText = formatClockTimeFromSeconds(anchorSeconds);
    stem = `What is the first time after ${anchorText} at which the smaller angle between the hands is ${selected.targetAngleDeg}°?`;
    visibleTokens = [anchorText, `${selected.targetAngleDeg}°`, "first time"];
    rootContract = "FIRST_AFTER_ANCHOR";
  } else if (input.taskId === "NEXT_PREVIOUS_ANGLE_EVENT") {
    const first = selected.analytic[0]!;
    const second = selected.analytic[1]!;
    const askNext = input.rng.pick([true, false] as const);
    if (askNext) {
      const anchorSeconds = addRationals(first.timeSeconds, exactRational(1));
      const anchorText = formatClockTimeFromSeconds(anchorSeconds, { includeSeconds: true });
      selectedRoot = second;
      verifierRoot = selected.independent[1]!;
      rootContract = "NEXT_AFTER_GIVEN_TIME";
      stem = `The smaller angle between the hands is ${selected.targetAngleDeg}° at more than one time. What is the next such time after ${anchorText}?`;
      visibleTokens = [anchorText, `${selected.targetAngleDeg}°`, "next such time"];
    } else {
      selectedRoot = first;
      verifierRoot = selected.independent[0]!;
      rootContract = "PREVIOUS_BEFORE_GIVEN_TIME";
      const beforeSecond = subtractRationals(second.timeSeconds, exactRational(1));
      const beforeText = formatClockTimeFromSeconds(beforeSecond, { includeSeconds: true });
      stem = `The smaller angle between the hands is ${selected.targetAngleDeg}° at more than one time. What is the previous such time before ${beforeText}?`;
      visibleTokens = [beforeText, `${selected.targetAngleDeg}°`, "previous such time"];
    }
  } else if (input.taskId === "EXACT_FRACTIONAL_MINUTE_EVENT") {
    const root = selected.analytic.find((candidate) => candidate.timeSeconds.denominator !== 1n) ?? selected.analytic[0]!;
    const rootIndex = selected.analytic.findIndex((candidate) => compareRationals(candidate.timeSeconds, root.timeSeconds) === 0);
    selectedRoot = root;
    verifierRoot = selected.independent[rootIndex]!;
    stem = `Give the earlier exact time, including any fractional seconds, between ${selected.hour}:00 and ${selected.hour + 1}:00 when the smaller angle is ${selected.targetAngleDeg}°.`;
    visibleTokens = [`${selected.hour}:00`, `${selected.hour + 1}:00`, `${selected.targetAngleDeg}°`, "fractional seconds"];
    rootContract = "EARLIER_EXACT_FRACTIONAL_RESULT";
  } else if (input.taskId === "ROUNDED_ANGLE_EVENT") {
    const exactRoot = selected.analytic[0]!;
    const independentExact = selected.independent[0]!;
    selectedRoot = { ...exactRoot, timeSeconds: exactRational(roundRationalToInteger(exactRoot.timeSeconds)) };
    verifierRoot = { ...independentExact, timeSeconds: exactRational(roundRationalToInteger(independentExact.timeSeconds)) };
    stem = `To the nearest second, what is the earlier time strictly between ${selected.hour}:00 and ${selected.hour + 1}:00 when the smaller angle is ${selected.targetAngleDeg}°?`;
    visibleTokens = [`${selected.hour}:00`, `${selected.hour + 1}:00`, `${selected.targetAngleDeg}°`, "nearest second"];
    rootContract = "EARLIER_ROOT_ROUNDED_NEAREST_SECOND";
    roundingPolicy = "NEAREST_SECOND_HALF_UP";
  } else {
    stem = `What is the earlier time strictly between ${selected.hour}:00 and ${selected.hour + 1}:00 when the smaller angle between the hands is ${selected.targetAngleDeg}°?`;
    visibleTokens = [`${selected.hour}:00`, `${selected.hour + 1}:00`, `${selected.targetAngleDeg}°`, "earlier time"];
  }

  const answer = timeAnswer(selectedRoot.timeSeconds, { includeSeconds: true });
  const verifierAnswer = timeAnswer(verifierRoot.timeSeconds, { includeSeconds: true });
  return {
    taskId: input.taskId,
    stem,
    scenario: {
      hour: selected.hour,
      targetAngleDeg: selected.targetAngleDeg,
      rootContract,
      includeStart: false,
      includeEnd: false,
      exactRootSeconds: `${selected.analytic[0]!.timeSeconds.numerator}/${selected.analytic[0]!.timeSeconds.denominator}`,
    },
    answer,
    verifierAnswer,
    distractors: timeDistractors(selectedRoot.timeSeconds, selected.analytic),
    explanation: {
      given: `Target smaller angle ${selected.targetAngleDeg}° with root contract ${rootContract}.`,
      rule: "Solve both exact relative-angle branches, apply the stated order and interval rule, then round only when the question explicitly asks for it.",
      working: [
        `Exact interval roots: ${selected.analytic.map((root) => formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })).join(", ")}.`,
        `Selected root: ${answer.display}.`,
      ],
      validityCheck: `Independent phase-cycle enumeration selects the same answer${roundingPolicy ? " after the same rounding rule" : ""}.`,
      closestTrap: "The midpoint of two valid roots is generally not an event time, and another valid root may violate the requested order.",
      answer: answer.display,
    },
    canonicalTrace: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
    verifierTrace: selected.independent.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
    solveTraceExtras: {
      endpointPolicy: "(start,end)",
      roundingPolicy,
      eventRoots: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
    },
    contractEvidence: contract("TIME", `CP003_${rootContract}_ORACLE`, visibleTokens),
  };
}

function solveCp004(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "GAP_BETWEEN_SPECIAL_EVENTS") {
    const interval = exactTimeInterval({ startSeconds: 0, endSeconds: 43_200, includeStart: true, includeEnd: false });
    const coincidences = standardRoots("COINCIDENCE", interval);
    const oppositions = standardRoots("OPPOSITION", interval);
    const independentCoincidences = standardRoots("COINCIDENCE", interval, true);
    const independentOppositions = standardRoots("OPPOSITION", interval, true);
    const start = coincidences[0]!;
    const finish = oppositions.find((root) => compareRationals(root.timeSeconds, start.timeSeconds) > 0)!;
    const independentStart = independentCoincidences[0]!;
    const independentFinish = independentOppositions.find((root) => compareRationals(root.timeSeconds, independentStart.timeSeconds) > 0)!;
    const duration = subtractRationals(finish.timeSeconds, start.timeSeconds);
    const verifierDuration = subtractRationals(independentFinish.timeSeconds, independentStart.timeSeconds);
    const answer = rationalAnswer("DURATION", duration, formatDurationSeconds(duration));
    const verifierAnswer = rationalAnswer("DURATION", verifierDuration, formatDurationSeconds(verifierDuration));
    return {
      taskId: input.taskId,
      stem: "Starting from the 12:00 coincidence, how much time elapses before the hands are next opposite to each other?",
      scenario: { startEvent: "COINCIDENCE", endEvent: "OPPOSITION", anchor: "12:00" },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: rationalAnswer("DURATION", multiplyRationals(duration, 2), formatDurationSeconds(multiplyRationals(duration, 2))),
          reasonCode: "FULL_RELATIVE_CYCLE_USED",
          reason: "This uses the full coincidence-to-coincidence cycle instead of the half-cycle to opposition.",
        },
        {
          answer: rationalAnswer("DURATION", subtractRationals(duration, 60), formatDurationSeconds(subtractRationals(duration, 60))),
          reasonCode: "ONE_MINUTE_EARLY",
          reason: "This rounds the exact opposition event one minute too early.",
        },
        {
          answer: rationalAnswer("DURATION", addRationals(duration, 60), formatDurationSeconds(addRationals(duration, 60))),
          reasonCode: "ONE_MINUTE_LATE",
          reason: "This rounds the exact opposition event one minute too late.",
        },
      ],
      explanation: {
        given: "The hands coincide at 12:00; find the next opposition.",
        rule: "Opposition is reached after 180° of relative motion at 11/120° per second.",
        working: [`Elapsed time = 180 ÷ (11/120) = ${answer.display}.`],
        validityCheck: "Independent event enumeration locates the same first opposition after 12:00.",
        closestTrap: "Using the complete 360° relative cycle gives the next coincidence, not the next opposition.",
        answer: answer.display,
      },
      canonicalTrace: [`start=${start.timeSeconds.numerator}/${start.timeSeconds.denominator}`, `finish=${finish.timeSeconds.numerator}/${finish.timeSeconds.denominator}`],
      verifierTrace: [`start=${independentStart.timeSeconds.numerator}/${independentStart.timeSeconds.denominator}`, `finish=${independentFinish.timeSeconds.numerator}/${independentFinish.timeSeconds.denominator}`],
      contractEvidence: contract("DURATION", "CP004_EVENT_TO_EVENT_GAP_ORACLE", ["12:00", "coincidence", "opposite"]),
    };
  }

  if (input.taskId === "NEAREST_SPECIAL_EVENT") {
    const eventType = input.rng.pick(STANDARD_TYPES);
    const anchorHour = input.rng.int(1, 10);
    const anchorMinute = input.rng.pick([10, 20, 30, 40, 50] as const);
    const anchorSeconds = clockSeconds(anchorHour, anchorMinute);
    const canonicalRoot = nearestSpecialEventExact({ eventType, anchorSeconds });
    const searchInterval = exactTimeInterval({
      startSeconds: subtractRationals(anchorSeconds, 43_200),
      endSeconds: addRationals(anchorSeconds, 43_200),
      includeStart: true,
      includeEnd: true,
    });
    const candidates = standardRoots(eventType, searchInterval, true);
    const verifierRoot = candidates.reduce((best, candidate) =>
      compareRationals(
        absoluteRational(subtractRationals(candidate.timeSeconds, anchorSeconds)),
        absoluteRational(subtractRationals(best.timeSeconds, anchorSeconds)),
      ) < 0 ? candidate : best,
    );
    const anchorText = formatClockTimeFromSeconds(anchorSeconds);
    const answer = timeAnswer(canonicalRoot.timeSeconds, { includeSeconds: true });
    const verifierAnswer = timeAnswer(verifierRoot.timeSeconds, { includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `Which ${eventLabel(eventType)} is nearest to ${anchorText}?`,
      scenario: { eventType, anchor: anchorText },
      answer,
      verifierAnswer,
      distractors: timeDistractors(canonicalRoot.timeSeconds, candidates),
      explanation: {
        given: `Anchor time ${anchorText}; event type ${eventLabel(eventType)}.`,
        rule: "Find the exact event immediately before and after the anchor, compare absolute time differences and choose the smaller.",
        working: [`Nearest ${eventLabel(eventType)} = ${answer.display}.`],
        validityCheck: "Independent enumeration on both sides of the anchor selects the same event.",
        closestTrap: "The next event is not always the nearest event; the previous one can be closer.",
        answer: answer.display,
      },
      canonicalTrace: [`nearest=${canonicalRoot.timeSeconds.numerator}/${canonicalRoot.timeSeconds.denominator}`],
      verifierTrace: [`nearest=${verifierRoot.timeSeconds.numerator}/${verifierRoot.timeSeconds.denominator}`],
      contractEvidence: contract("TIME", "CP004_NEAREST_EVENT_DISTANCE_ORACLE", [anchorText, eventLabel(eventType)]),
    };
  }

  if (input.taskId === "EVENT_ORDER_IN_HOUR") {
    let selected: { hour: number; analytic: ClockEventRoot[]; independent: ClockEventRoot[] } | null = null;
    for (const hour of input.rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const)) {
      const interval = hourInterval(hour);
      const analytic = STANDARD_TYPES.flatMap((eventType) => standardRoots(eventType, interval))
        .sort((left, right) => compareRationals(left.timeSeconds, right.timeSeconds));
      const independent = STANDARD_TYPES.flatMap((eventType) => standardRoots(eventType, interval, true))
        .sort((left, right) => compareRationals(left.timeSeconds, right.timeSeconds));
      if (analytic.length >= 2 && rootsKey(analytic) === rootsKey(independent)) {
        selected = { hour, analytic, independent };
        break;
      }
    }
    if (!selected) throw new Error("No special-event order case found.");
    const renderOrder = (roots: readonly ClockEventRoot[]) => roots
      .map((root) => `${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })} (${eventLabel(root.eventType as StandardEventType)})`)
      .join(" → ");
    const correctDisplay = renderOrder(selected.analytic);
    const verifierDisplay = renderOrder(selected.independent);
    const answer = textAnswer("POSITION", `ORDER:${rootsKey(selected.analytic)}`, correctDisplay);
    const verifierAnswer = textAnswer("POSITION", `ORDER:${rootsKey(selected.independent)}`, verifierDisplay);
    const reversed = [...selected.analytic].reverse();
    const omitted = selected.analytic.slice(1);
    return {
      taskId: input.taskId,
      stem: `Arrange all coincidence, opposition and right-angle events strictly between ${selected.hour}:00 and ${selected.hour + 1}:00 in chronological order.`,
      scenario: { hour: selected.hour, includedEventTypes: ["COINCIDENCE", "OPPOSITION", "RIGHT_ANGLE"] },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: textAnswer("POSITION", `REVERSED:${rootsKey(reversed)}`, renderOrder(reversed)),
          reasonCode: "EVENT_ORDER_REVERSED",
          reason: "This lists the valid events in reverse chronological order.",
        },
        {
          answer: textAnswer("POSITION", `OMITTED:${rootsKey(omitted)}`, renderOrder(omitted)),
          reasonCode: "EARLIEST_EVENT_OMITTED",
          reason: "This omits the first exact special event inside the hour.",
        },
        {
          answer: textAnswer("POSITION", "LABELS_ONLY", selected.analytic.map((root) => eventLabel(root.eventType as StandardEventType)).join(" → ")),
          reasonCode: "TIMES_OMITTED_FROM_ORDER",
          reason: "This gives event labels but not the requested chronological event-time sequence.",
        },
      ],
      explanation: {
        given: `Open interval ${selected.hour}:00–${selected.hour + 1}:00 and three special-event families.`,
        rule: "Generate each exact event set, merge them and sort by absolute time.",
        working: selected.analytic.map((root, index) => `${index + 1}. ${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })}: ${eventLabel(root.eventType as StandardEventType)}.`),
        validityCheck: "Independent enumerated event sets produce the same merged order.",
        closestTrap: "Memorised frequency does not determine the order within a particular hour; exact roots must be sorted.",
        answer: answer.display,
      },
      canonicalTrace: selected.analytic.map((root) => `${root.eventType}:${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      verifierTrace: selected.independent.map((root) => `${root.eventType}:${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      contractEvidence: contract("POSITION", "CP004_MERGED_EVENT_ORDER_ORACLE", [`${selected.hour}:00`, `${selected.hour + 1}:00`, "chronological order"]),
    };
  }

  if (input.taskId === "CLASSIFY_EVENT_FROM_TIME") {
    const eventType = input.rng.pick(STANDARD_TYPES);
    const selected = findStandardHour(input, eventType);
    const root = selected.analytic[0]!;
    const timeText = formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true });
    const canonicalType = classifyHourMinuteEventAtSecondsExact(root.timeSeconds);
    if (canonicalType === "ARBITRARY_ANGLE") {
      throw new Error("A standard event root was classified as an arbitrary angle.");
    }
    const snapshot = hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(root.timeSeconds));
    const independentType = compareRationals(snapshot.smallerAngleDeg, 0) === 0
      ? "COINCIDENCE"
      : compareRationals(snapshot.smallerAngleDeg, 180) === 0
        ? "OPPOSITION"
        : compareRationals(snapshot.smallerAngleDeg, 90) === 0
          ? "RIGHT_ANGLE"
          : "OTHER";
    const answer = textAnswer("CLASSIFICATION", canonicalType, canonicalType.toLowerCase().replaceAll("_", " "));
    const verifierAnswer = textAnswer("CLASSIFICATION", independentType, independentType.toLowerCase().replaceAll("_", " "));
    return {
      taskId: input.taskId,
      stem: `At ${timeText}, are the hour and minute hands coincident, opposite, at a right angle, or in none of these positions?`,
      scenario: { time: timeText, timeSeconds: `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}` },
      answer,
      verifierAnswer,
      distractors: classificationDistractors(canonicalType),
      explanation: {
        given: `Exact time ${timeText}.`,
        rule: "Evaluate the exact smaller angle and classify 0° as coincidence, 90° as right angle and 180° as opposition.",
        working: [`Smaller angle = ${formatAngle(snapshot.smallerAngleDeg)}.`, `Classification = ${answer.display}.`],
        validityCheck: "A second calculation from exact hand positions gives the same class.",
        closestTrap: "A visually near-special position is not exact; the rational angle decides the class.",
        answer: answer.display,
      },
      canonicalTrace: [`classification=${canonicalType}`],
      verifierTrace: [`smaller=${snapshot.smallerAngleDeg.numerator}/${snapshot.smallerAngleDeg.denominator}`, `classification=${independentType}`],
      contractEvidence: contract("CLASSIFICATION", "CP004_EXACT_TIME_CLASSIFICATION_ORACLE", [timeText, "coincident", "opposite", "right angle"]),
    };
  }

  const eventType: StandardEventType = input.taskId === "COINCIDENCE_IN_HOUR"
    ? "COINCIDENCE"
    : input.taskId === "OPPOSITION_IN_HOUR"
      ? "OPPOSITION"
      : input.taskId === "RIGHT_ANGLE_TIMES_IN_HOUR"
        ? "RIGHT_ANGLE"
        : "STRAIGHT_LINE";
  const minimumRoots = input.taskId === "RIGHT_ANGLE_TIMES_IN_HOUR" ? 2 : 1;
  const selected = findStandardHour(input, eventType, minimumRoots);
  const hourStart = `${selected.hour}:00`;
  const hourEnd = `${selected.hour + 1}:00`;

  if (input.taskId === "RIGHT_ANGLE_TIMES_IN_HOUR") {
    const answer = timeSetAnswer(selected.analytic.map((root) => root.timeSeconds));
    const verifierAnswer = timeSetAnswer(selected.independent.map((root) => root.timeSeconds));
    return {
      taskId: input.taskId,
      stem: `At what all times strictly between ${hourStart} and ${hourEnd} are the hands at a right angle?`,
      scenario: { hour: selected.hour, eventType, includeStart: false, includeEnd: false },
      answer,
      verifierAnswer,
      distractors: [
        { answer: timeSetAnswer(selected.analytic.slice(1).map((root) => root.timeSeconds)), reasonCode: "EARLIER_RIGHT_ANGLE_OMITTED", reason: "This omits the earlier right-angle event in the hour." },
        { answer: timeSetAnswer(selected.analytic.slice(0, -1).map((root) => root.timeSeconds)), reasonCode: "LATER_RIGHT_ANGLE_OMITTED", reason: "This omits the later right-angle event in the hour." },
        { answer: timeSetAnswer(selected.analytic.map((root) => addRationals(root.timeSeconds, 60))), reasonCode: "RIGHT_ANGLE_ROOTS_SHIFTED", reason: "Both exact event times are shifted and no longer form 90°." },
      ],
      explanation: {
        given: `Open interval ${hourStart}–${hourEnd}.`,
        rule: "Solve the two 90° relative-phase branches and retain every valid root in the hour.",
        working: selected.analytic.map((root, index) => `Right-angle time ${index + 1}: ${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })}.`),
        validityCheck: "Independent phase-cycle enumeration returns the identical time set.",
        closestTrap: "A right-angle question usually has two branches; reporting only one can be incomplete.",
        answer: answer.display,
      },
      canonicalTrace: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      verifierTrace: selected.independent.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
      solveTraceExtras: { endpointPolicy: "(start,end)", eventRoots: selected.analytic.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`) },
      contractEvidence: contract("TIME_SET", "CP004_RIGHT_ANGLE_ROOT_SET_ORACLE", [hourStart, hourEnd, "right angle"]),
    };
  }

  if (input.taskId === "STRAIGHT_LINE_EVENT") {
    const root = selected.analytic[0]!;
    const independentRoot = selected.independent[0]!;
    const actualType = classifyHourMinuteEventAtSecondsExact(root.timeSeconds);
    const independentType = classifyHourMinuteEventAtSecondsExact(independentRoot.timeSeconds);
    const display = `${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })} — ${eventLabel(actualType as StandardEventType)}`;
    const verifierDisplay = `${formatClockTimeFromSeconds(independentRoot.timeSeconds, { includeSeconds: true })} — ${eventLabel(independentType as StandardEventType)}`;
    const answer = textAnswer("POSITION", `STRAIGHT:${root.timeSeconds.numerator}/${root.timeSeconds.denominator}:${actualType}`, display);
    const verifierAnswer = textAnswer("POSITION", `STRAIGHT:${independentRoot.timeSeconds.numerator}/${independentRoot.timeSeconds.denominator}:${independentType}`, verifierDisplay);
    return {
      taskId: input.taskId,
      stem: `Give the earlier time strictly between ${hourStart} and ${hourEnd} when the hands lie on one straight line, and state whether they coincide or point in opposite directions.`,
      scenario: { hour: selected.hour, eventType: "STRAIGHT_LINE", rootOrder: "EARLIER" },
      answer,
      verifierAnswer,
      distractors: [
        ...timeDistractors(root.timeSeconds, selected.analytic).slice(0, 2).map((candidate) => ({
          ...candidate,
          answer: textAnswer("POSITION", `WRONG_TIME:${candidate.answer.semanticKey}`, `${candidate.answer.display} — ${eventLabel(actualType as StandardEventType)}`),
        })),
        {
          answer: textAnswer("POSITION", "RIGHT_TIME_WRONG_TYPE", `${formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })} — ${actualType === "COINCIDENCE" ? "opposition" : "coincidence"}`),
          reasonCode: "STRAIGHT_LINE_TYPE_REVERSED",
          reason: "The time is retained but the straight-line subtype is reversed.",
        },
      ],
      explanation: {
        given: `Open interval ${hourStart}–${hourEnd}; straight-line position requested.`,
        rule: "Straight-line positions are the union of coincidence (0°) and opposition (180°); sort their exact roots and select the earlier one.",
        working: [`Earlier straight-line event = ${display}.`],
        validityCheck: "Independent coincidence/opposition enumeration gives the same time and subtype.",
        closestTrap: "A straight line can mean coincident or opposite; the subtype must be identified from the exact angle.",
        answer: answer.display,
      },
      canonicalTrace: [`${actualType}:${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`],
      verifierTrace: [`${independentType}:${independentRoot.timeSeconds.numerator}/${independentRoot.timeSeconds.denominator}`],
      contractEvidence: contract("POSITION", "CP004_STRAIGHT_LINE_UNION_ORACLE", [hourStart, hourEnd, "straight line", "coincide", "opposite"]),
    };
  }

  const root = selected.analytic[0]!;
  const independentRoot = selected.independent[0]!;
  const answer = timeAnswer(root.timeSeconds, { includeSeconds: true });
  const verifierAnswer = timeAnswer(independentRoot.timeSeconds, { includeSeconds: true });
  return {
    taskId: input.taskId,
    stem: `At what time strictly between ${hourStart} and ${hourEnd} do the hour and minute hands reach ${eventLabel(eventType)}?`,
    scenario: { hour: selected.hour, eventType, includeStart: false, includeEnd: false },
    answer,
    verifierAnswer,
    distractors: timeDistractors(root.timeSeconds, selected.analytic),
    explanation: {
      given: `Open interval ${hourStart}–${hourEnd}; event ${eventLabel(eventType)}.`,
      rule: eventType === "COINCIDENCE"
        ? "Set the relative phase to 0° and retain the interval-valid root."
        : "Set the smaller angle to 180° and retain the interval-valid root.",
      working: [`Exact ${eventLabel(eventType)} time = ${answer.display}.`],
      validityCheck: "Independent cycle enumeration returns the same event time.",
      closestTrap: "An arbitrary-angle root or the midpoint of two roots is not a special-event time.",
      answer: answer.display,
    },
    canonicalTrace: [`${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`],
    verifierTrace: [`${independentRoot.timeSeconds.numerator}/${independentRoot.timeSeconds.denominator}`],
    solveTraceExtras: { endpointPolicy: "(start,end)", eventRoots: [`${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`] },
    contractEvidence: contract("TIME", `CP004_${eventType}_ROOT_ORACLE`, [hourStart, hourEnd, eventLabel(eventType)]),
  };
}

function countEventAnswer(
  eventType: StandardEventType,
  interval: ExactTimeInterval,
): {
  answer: ClockSemanticAnswer;
  verifierAnswer: ClockSemanticAnswer;
  analytic: ClockEventRoot[];
  independent: ClockEventRoot[];
} {
  const analytic = standardRoots(eventType, interval);
  const independent = standardRoots(eventType, interval, true);
  requireMatchingRoots(analytic, independent, `${eventType} count in ${intervalLabel(interval)}`);
  return {
    answer: rationalAnswer("COUNT", analytic.length, `${analytic.length}`),
    verifierAnswer: rationalAnswer("COUNT", independent.length, `${independent.length}`),
    analytic,
    independent,
  };
}

function solveCp005(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "NTH_OCCURRENCE") {
    const eventType = input.rng.pick(STANDARD_TYPES);
    const anchorHour = input.rng.int(1, 6);
    const occurrence = input.rng.int(2, 5);
    const anchorSeconds = clockSeconds(anchorHour, 0);
    const canonicalRoot = nthEventAfterExact({ eventType, anchorSeconds, occurrence });
    const interval = exactTimeInterval({
      startSeconds: anchorSeconds,
      endSeconds: addRationals(anchorSeconds, 43_200),
      includeStart: false,
      includeEnd: true,
    });
    const independentRoots = standardRoots(eventType, interval, true);
    const verifierRoot = independentRoots[occurrence - 1]!;
    const anchorText = `${anchorHour}:00`;
    const answer = timeAnswer(canonicalRoot.timeSeconds, { includeSeconds: true });
    const verifierAnswer = timeAnswer(verifierRoot.timeSeconds, { includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `What is the time of the ${occurrence}${occurrence === 2 ? "nd" : occurrence === 3 ? "rd" : "th"} ${eventLabel(eventType)} after ${anchorText}?`,
      scenario: { eventType, anchor: anchorText, occurrence },
      answer,
      verifierAnswer,
      distractors: [
        ...independentRoots
          .filter((_, index) => index !== occurrence - 1)
          .slice(0, 2)
          .map((root, index) => ({
            answer: timeAnswer(root.timeSeconds, { includeSeconds: true }),
            reasonCode: index < occurrence - 1 ? "EARLIER_OCCURRENCE_SELECTED" : "LATER_OCCURRENCE_SELECTED",
            reason: "This selects a valid event but not the stated occurrence number after the anchor.",
          })),
        {
          answer: timeAnswer(addRationals(canonicalRoot.timeSeconds, 60), { includeSeconds: true }),
          reasonCode: "NTH_EVENT_SHIFTED_ONE_MINUTE",
          reason: "This shifts the required nth event and no longer satisfies the exact event condition.",
        },
      ],
      explanation: {
        given: `${occurrence}th ${eventLabel(eventType)} after ${anchorText}.`,
        rule: "Enumerate exact occurrences strictly after the anchor and select the stated ordinal.",
        working: independentRoots.slice(0, occurrence).map((candidate, index) => `${index + 1}: ${formatClockTimeFromSeconds(candidate.timeSeconds, { includeSeconds: true })}.`),
        validityCheck: "The direct nth-event solver and independent enumerated list select the same root.",
        closestTrap: "The first event after the anchor is not automatically the requested nth occurrence.",
        answer: answer.display,
      },
      canonicalTrace: [`nth=${canonicalRoot.timeSeconds.numerator}/${canonicalRoot.timeSeconds.denominator}`],
      verifierTrace: independentRoots.slice(0, occurrence).map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      contractEvidence: contract("TIME", "CP005_NTH_EVENT_ORDINAL_ORACLE", [anchorText, `${occurrence}`, eventLabel(eventType)]),
    };
  }

  if (input.taskId === "ELAPSED_FOR_EVENT_COUNT") {
    const eventType = input.rng.pick(STANDARD_TYPES);
    const eventCount = input.rng.int(3, 5);
    const interval = exactTimeInterval({ startSeconds: 0, endSeconds: 43_200, includeStart: true, includeEnd: false });
    const roots = standardRoots(eventType, interval);
    const independent = standardRoots(eventType, interval, true);
    const first = roots[0]!;
    const last = roots[eventCount - 1]!;
    const verifierFirst = independent[0]!;
    const verifierLast = independent[eventCount - 1]!;
    const duration = subtractRationals(last.timeSeconds, first.timeSeconds);
    const verifierDuration = subtractRationals(verifierLast.timeSeconds, verifierFirst.timeSeconds);
    const answer = rationalAnswer("DURATION", duration, formatDurationSeconds(duration));
    const verifierAnswer = rationalAnswer("DURATION", verifierDuration, formatDurationSeconds(verifierDuration));
    return {
      taskId: input.taskId,
      stem: `How much time elapses from the first to the ${eventCount}th ${eventLabel(eventType)} in a 12-hour cycle?`,
      scenario: { eventType, eventCount, measurement: "FIRST_TO_NTH" },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: rationalAnswer("DURATION", multiplyRationals(subtractRationals(roots[1]!.timeSeconds, roots[0]!.timeSeconds), eventCount), formatDurationSeconds(multiplyRationals(subtractRationals(roots[1]!.timeSeconds, roots[0]!.timeSeconds), eventCount))),
          reasonCode: "N_GAPS_USED_FOR_N_EVENTS",
          reason: "This uses n recurrence gaps for n events; from the first to the nth event there are only n−1 gaps.",
        },
        {
          answer: rationalAnswer("DURATION", subtractRationals(roots[eventCount]!.timeSeconds, first.timeSeconds), formatDurationSeconds(subtractRationals(roots[eventCount]!.timeSeconds, first.timeSeconds))),
          reasonCode: "ONE_EXTRA_EVENT_INCLUDED",
          reason: "This measures through the next event beyond the stated nth occurrence.",
        },
        {
          answer: rationalAnswer("DURATION", subtractRationals(duration, 60), formatDurationSeconds(subtractRationals(duration, 60))),
          reasonCode: "RECURRENCE_ROUNDED_EARLY",
          reason: "This rounds each recurrence before multiplication and loses one minute overall.",
        },
      ],
      explanation: {
        given: `Measure from the first through the ${eventCount}th ${eventLabel(eventType)}.`,
        rule: "The elapsed span from the first to the nth occurrence contains n−1 recurrence gaps.",
        working: [`First event = ${formatClockTimeFromSeconds(first.timeSeconds, { includeSeconds: true })}.`, `${eventCount}th event = ${formatClockTimeFromSeconds(last.timeSeconds, { includeSeconds: true })}.`, `Elapsed time = ${answer.display}.`],
        validityCheck: "Independent enumeration produces the same first and nth event timestamps.",
        closestTrap: "Counting events as gaps creates one extra recurrence interval.",
        answer: answer.display,
      },
      canonicalTrace: [`first=${first.timeSeconds.numerator}/${first.timeSeconds.denominator}`, `last=${last.timeSeconds.numerator}/${last.timeSeconds.denominator}`],
      verifierTrace: [`first=${verifierFirst.timeSeconds.numerator}/${verifierFirst.timeSeconds.denominator}`, `last=${verifierLast.timeSeconds.numerator}/${verifierLast.timeSeconds.denominator}`],
      contractEvidence: contract("DURATION", "CP005_FIRST_TO_NTH_GAP_ORACLE", [`${eventCount}th`, eventLabel(eventType), "first"]),
    };
  }

  if (input.taskId === "COUNT_WITH_ENDPOINTS") {
    const eventType: StandardEventType = "COINCIDENCE";
    const includeStart = input.rng.pick([true, false] as const);
    const includeEnd = input.rng.pick([true, false] as const);
    const interval = exactTimeInterval({ startSeconds: 0, endSeconds: 43_200, includeStart, includeEnd });
    const result = countEventAnswer(eventType, interval);
    const startWord = includeStart ? "including" : "excluding";
    const endWord = includeEnd ? "including" : "excluding";
    return {
      taskId: input.taskId,
      stem: `How many coincidences occur from 12:00 to the next 12:00, ${startWord} the starting 12:00 and ${endWord} the ending 12:00?`,
      scenario: { eventType, includeStart, includeEnd, startSeconds: 0, endSeconds: 43_200 },
      answer: result.answer,
      verifierAnswer: result.verifierAnswer,
      distractors: countDistractors(result.analytic.length),
      explanation: {
        given: `A 12-hour interval with start ${includeStart ? "included" : "excluded"} and end ${includeEnd ? "included" : "excluded"}.`,
        rule: "Enumerate exact coincidence roots and apply both endpoint flags before counting.",
        working: [`Accepted coincidence count = ${result.answer.display}.`],
        validityCheck: "Analytic and independent event lists agree after the same endpoint policy.",
        closestTrap: "Two adjacent closed intervals double-count the shared 12:00 coincidence.",
        answer: result.answer.display,
      },
      canonicalTrace: result.analytic.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      verifierTrace: result.independent.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      solveTraceExtras: { endpointPolicy: `${includeStart ? "[" : "("}start,end${includeEnd ? "]" : ")"}` },
      contractEvidence: contract("COUNT", "CP005_ENDPOINT_POLICY_ORACLE", ["12:00", startWord, endWord]),
    };
  }

  if (input.taskId === "COMPARE_EVENT_FREQUENCIES") {
    const durationHours = input.rng.pick([12, 24] as const);
    const pair = input.rng.pick([
      ["RIGHT_ANGLE", "COINCIDENCE"],
      ["STRAIGHT_LINE", "OPPOSITION"],
      ["RIGHT_ANGLE", "OPPOSITION"],
    ] as const) as readonly [StandardEventType, StandardEventType];
    const interval = exactTimeInterval({ startSeconds: 0, endSeconds: durationHours * 3_600, includeStart: true, includeEnd: false });
    const left = standardRoots(pair[0], interval);
    const right = standardRoots(pair[1], interval);
    const independentLeft = standardRoots(pair[0], interval, true);
    const independentRight = standardRoots(pair[1], interval, true);
    const ratio = exactRational(left.length, right.length);
    const verifierRatio = exactRational(independentLeft.length, independentRight.length);
    const answer = rationalAnswer("RATIO", ratio, `${ratio.numerator}:${ratio.denominator}`);
    const verifierAnswer = rationalAnswer("RATIO", verifierRatio, `${verifierRatio.numerator}:${verifierRatio.denominator}`);
    return {
      taskId: input.taskId,
      stem: `In ${durationHours} hours, what is the ratio of the number of ${eventLabel(pair[0])} events to ${eventLabel(pair[1])} events?`,
      scenario: { durationHours, firstEventType: pair[0], secondEventType: pair[1], includeStart: true, includeEnd: false },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("RATIO", exactRational(right.length, left.length), `${right.length}:${left.length}`), reasonCode: "RATIO_ORDER_REVERSED", reason: "This reverses the event types in the requested ratio." },
        { answer: rationalAnswer("RATIO", exactRational(1), "1:1"), reasonCode: "FREQUENCIES_ASSUMED_EQUAL", reason: "This assumes the two event types occur equally often without enumerating them." },
        { answer: rationalAnswer("RATIO", multiplyRationals(ratio, 2), `${multiplyRationals(ratio, 2).numerator}:${multiplyRationals(ratio, 2).denominator}`), reasonCode: "ONE_FREQUENCY_DOUBLED", reason: "This doubles one event count before forming the ratio." },
      ],
      explanation: {
        given: `${durationHours}-hour half-open interval; compare ${eventLabel(pair[0])} with ${eventLabel(pair[1])}.`,
        rule: "Count both event sets under the same endpoint convention, then reduce the ordered ratio.",
        working: [`${eventLabel(pair[0])}: ${left.length}.`, `${eventLabel(pair[1])}: ${right.length}.`, `Ratio = ${answer.display}.`],
        validityCheck: "Independent enumeration gives the same two counts and reduced ratio.",
        closestTrap: "The ratio order follows the wording; reversing the two event types gives the reciprocal.",
        answer: answer.display,
      },
      canonicalTrace: [`left=${left.length}`, `right=${right.length}`],
      verifierTrace: [`left=${independentLeft.length}`, `right=${independentRight.length}`],
      solveTraceExtras: { endpointPolicy: "[start,end)" },
      contractEvidence: contract("RATIO", "CP005_EVENT_FREQUENCY_RATIO_ORACLE", [`${durationHours} hours`, eventLabel(pair[0]), eventLabel(pair[1])]),
    };
  }

  if (input.taskId === "COUNT_ARBITRARY_ANGLE") {
    const targetAngleDeg = input.rng.pick(ANGLE_POOL);
    const durationHours = input.rng.pick([6, 12] as const);
    const interval = exactTimeInterval({ startSeconds: 0, endSeconds: durationHours * 3_600, includeStart: true, includeEnd: false });
    const analytic = arbitraryRoots(targetAngleDeg, interval);
    const independent = arbitraryRoots(targetAngleDeg, interval, true);
    requireMatchingRoots(analytic, independent, `count ${targetAngleDeg}° over ${durationHours}h`);
    const answer = rationalAnswer("COUNT", analytic.length, `${analytic.length}`);
    const verifierAnswer = rationalAnswer("COUNT", independent.length, `${independent.length}`);
    return {
      taskId: input.taskId,
      stem: `During the ${durationHours}-hour interval from 12:00, how many times is the smaller angle between the hands exactly ${targetAngleDeg}°? Count the starting instant and exclude the ending instant.`,
      scenario: { targetAngleDeg, durationHours, includeStart: true, includeEnd: false },
      answer,
      verifierAnswer,
      distractors: countDistractors(analytic.length),
      explanation: {
        given: `${durationHours} hours, target ${targetAngleDeg}°, endpoint policy [start,end).`,
        rule: "Enumerate both exact target-angle branches over the full stated interval and deduplicate boundary roots.",
        working: [`Accepted root count = ${analytic.length}.`],
        validityCheck: "The analytic and cycle-enumeration root sets are identical.",
        closestTrap: "Multiplying a memorised hourly count ignores partial cycles and endpoint duplicates.",
        answer: answer.display,
      },
      canonicalTrace: analytic.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      verifierTrace: independent.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      solveTraceExtras: { endpointPolicy: "[start,end)" },
      contractEvidence: contract("COUNT", "CP005_ARBITRARY_ANGLE_COUNT_ORACLE", [`${durationHours}-hour`, `${targetAngleDeg}°`, "exclude the ending"]),
    };
  }

  if (input.taskId === "COUNT_PARTIAL_INTERVAL") {
    const eventType = input.rng.pick(STANDARD_TYPES);
    const startHour = input.rng.int(1, 6);
    const startMinute = input.rng.pick([10, 15, 20] as const);
    const endHour = startHour + input.rng.pick([2, 3, 4] as const);
    const endMinute = input.rng.pick([35, 40, 45, 50] as const);
    const startSeconds = clockSeconds(startHour, startMinute);
    const endSeconds = clockSeconds(endHour, endMinute);
    const interval = exactTimeInterval({ startSeconds, endSeconds, includeStart: false, includeEnd: true });
    const result = countEventAnswer(eventType, interval);
    const startText = formatClockTimeFromSeconds(startSeconds);
    const endText = formatClockTimeFromSeconds(endSeconds);
    return {
      taskId: input.taskId,
      stem: `How many ${eventLabel(eventType)} events occur after ${startText} and up to and including ${endText}?`,
      scenario: { eventType, start: startText, end: endText, includeStart: false, includeEnd: true },
      answer: result.answer,
      verifierAnswer: result.verifierAnswer,
      distractors: countDistractors(result.analytic.length),
      explanation: {
        given: `Partial interval (${startText}, ${endText}].`,
        rule: "Generate exact event roots only for the stated partial interval and apply its endpoint flags.",
        working: [`Accepted roots: ${result.analytic.map((candidate) => formatClockTimeFromSeconds(candidate.timeSeconds, { includeSeconds: true })).join(", ") || "none"}.`, `Count = ${result.answer.display}.`],
        validityCheck: "Independent enumeration returns the same partial-interval roots.",
        closestTrap: "A standard 12-hour frequency cannot be substituted for a non-standard partial interval.",
        answer: result.answer.display,
      },
      canonicalTrace: result.analytic.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      verifierTrace: result.independent.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
      solveTraceExtras: { endpointPolicy: "(start,end]" },
      contractEvidence: contract("COUNT", "CP005_PARTIAL_INTERVAL_COUNT_ORACLE", [startText, endText, eventLabel(eventType)]),
    };
  }

  const eventType: StandardEventType = input.taskId === "COUNT_COINCIDENCES"
    ? "COINCIDENCE"
    : input.taskId === "COUNT_OPPOSITIONS"
      ? "OPPOSITION"
      : input.taskId === "COUNT_RIGHT_ANGLES"
        ? "RIGHT_ANGLE"
        : "STRAIGHT_LINE";
  const durationHours = input.rng.pick([12, 24] as const);
  const interval = exactTimeInterval({ startSeconds: 0, endSeconds: durationHours * 3_600, includeStart: true, includeEnd: false });
  const result = countEventAnswer(eventType, interval);
  return {
    taskId: input.taskId,
    stem: `How many ${eventLabel(eventType)} events occur in ${durationHours} hours, counting the starting 12:00 instant and excluding the ending instant?`,
    scenario: { eventType, durationHours, includeStart: true, includeEnd: false },
    answer: result.answer,
    verifierAnswer: result.verifierAnswer,
    distractors: countDistractors(result.analytic.length),
    explanation: {
      given: `${durationHours}-hour interval with endpoint policy [start,end).`,
      rule: "Enumerate the exact event roots over the full interval and count each accepted timestamp once.",
      working: [`Accepted ${eventLabel(eventType)} count = ${result.answer.display}.`],
      validityCheck: "The independent phase-cycle enumerator gives the same root set and count.",
      closestTrap: "Including both 12:00 boundaries double-counts the shared coincidence and can corrupt adjacent-window totals.",
      answer: result.answer.display,
    },
    canonicalTrace: result.analytic.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
    verifierTrace: result.independent.map((candidate) => `${candidate.timeSeconds.numerator}/${candidate.timeSeconds.denominator}`),
    solveTraceExtras: { endpointPolicy: "[start,end)" },
    contractEvidence: contract("COUNT", `CP005_${eventType}_COUNT_ORACLE`, [`${durationHours} hours`, eventLabel(eventType), "excluding the ending"]),
  };
}

export function solveEventFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (CP003_TASKS.has(input.taskId)) return solveCp003(input);
  if (CP004_TASKS.has(input.taskId)) return solveCp004(input);
  if (CP005_TASKS.has(input.taskId)) return solveCp005(input);
  return null;
}
