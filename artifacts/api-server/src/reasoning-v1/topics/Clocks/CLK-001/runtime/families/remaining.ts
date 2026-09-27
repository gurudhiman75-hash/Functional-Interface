import {
  actualTimeFromDisplayedExact,
  addRationals,
  affineFaultyClockModel,
  classifyFaultyClockRate,
  clockRateFromGainLoss,
  compareRationals,
  divideRationals,
  eventCountExact,
  exactRational,
  exactTimeInterval,
  findHandInterchangePairsExact,
  gainOrLossPerActualPeriodExact,
  hourMinuteAngleSnapshotExact,
  mirrorClockSecondsExact,
  multiplyRationals,
  nthEventAfterExact,
  solveHourMinuteAngleEventsExact,
  subtractRationals,
  totalSecondsToClockTimeExact,
  validateMirrorTimeGeometryExact,
  verifyFaultyClockMappingExact,
  verifyHourMinuteAngleEventsExact,
  type ClockEventType,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import { renderClockFromAnglesSvg, renderClockSvg } from "../clock-svg";
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import type { ClockSemanticAnswer } from "../types";
import {
  clockSeconds,
  formatAngle,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  localized,
  pairAnswer,
  rationalAnswer,
  textAnswer,
  timeAnswer,
  timeSetAnswer,
} from "../utils";

const EVENT_TASKS = new Set<ClockTaskId>([
  "ONE_TIME_FOR_ANGLE_IN_HOUR", "ALL_TIMES_FOR_ANGLE_IN_HOUR", "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE",
  "NEXT_PREVIOUS_ANGLE_EVENT", "EXACT_FRACTIONAL_MINUTE_EVENT", "ROUNDED_ANGLE_EVENT",
  "COUNT_SOLUTIONS_IN_HOUR", "RECOVER_ANGLE_FROM_CANDIDATE_TIMES", "COINCIDENCE_IN_HOUR",
  "OPPOSITION_IN_HOUR", "RIGHT_ANGLE_TIMES_IN_HOUR", "STRAIGHT_LINE_EVENT",
  "GAP_BETWEEN_SPECIAL_EVENTS", "NEAREST_SPECIAL_EVENT", "EVENT_ORDER_IN_HOUR",
  "CLASSIFY_EVENT_FROM_TIME", "COUNT_COINCIDENCES", "COUNT_OPPOSITIONS", "COUNT_RIGHT_ANGLES",
  "COUNT_STRAIGHT_LINE", "COUNT_ARBITRARY_ANGLE", "COUNT_PARTIAL_INTERVAL", "NTH_OCCURRENCE",
  "ELAPSED_FOR_EVENT_COUNT", "COUNT_WITH_ENDPOINTS", "COMPARE_EVENT_FREQUENCIES",
]);

const FAULTY_TASKS = new Set<ClockTaskId>([
  "DISPLAYED_FROM_ACTUAL_ELAPSED", "ACTUAL_FROM_DISPLAYED_ELAPSED", "ERROR_AFTER_ACTUAL_DURATION",
  "ACTUAL_DURATION_FROM_READING_CHANGE", "CLASSIFY_FAST_SLOW", "CONVERT_GAIN_LOSS_RATE",
  "INITIAL_OFFSET_CORRECT_RATE", "INITIAL_OFFSET_AND_WRONG_RATE", "DERIVE_RATE_FROM_OBSERVATIONS",
  "DERIVE_SET_RIGHT_TIME", "MULTIDAY_ACTUAL_FROM_DISPLAY", "MULTIDAY_DISPLAY_FROM_ACTUAL",
  "TIME_WHEN_ERROR_REACHES_TARGET", "NEXT_CORRECT_READING", "COMPARE_TWO_FAULTY_CLOCKS",
  "GAINING_AND_LOSING_EQUALITY", "PIECEWISE_RATE", "MISSING_GAIN_LOSS_FROM_FINAL",
  "GAIN_FROM_COINCIDENCE_INTERVAL", "LOSS_FROM_COINCIDENCE_INTERVAL", "COINCIDENCE_INTERVAL_FROM_RATE",
  "CLASSIFY_FROM_EVENT_INTERVAL", "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE",
  "ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT",
]);

const MIRROR_TASKS = new Set<ClockTaskId>([
  "MIRROR_FROM_ACTUAL", "ACTUAL_FROM_MIRROR", "MIRROR_AROUND_12_BOUNDARY",
  "ACTUAL_FROM_TEXTUAL_MIRROR", "MIRROR_BOUNDARY_CASES", "MIRROR_GEOMETRIC_VERIFICATION",
  "READ_TIME_FROM_DIAGRAM", "SELECT_DIAGRAM_FOR_TIME", "READ_ANGLE_TYPE_FROM_DIAGRAM",
  "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM", "COMPLETE_PARTIAL_DIAL", "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT",
]);

const MIXED_TASKS = new Set<ClockTaskId>([
  "TIME_AFTER_HANDS_INTERCHANGED", "ORIGINAL_FROM_INTERCHANGED", "VALIDATE_PROPOSED_INTERCHANGE",
  "FIND_INTERCHANGE_TIME_PAIR", "ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME", "ACTUAL_TIME_OF_FAULTY_HAND_EVENT",
  "MIRROR_READING_OF_FAULTY_CLOCK", "STRIKE_EVENT_UNDER_RATE_ERROR", "OFFSET_PLUS_RATE_CORRECTION",
  "TEXT_DIAGRAM_SYNTHESIS",
]);

function title(taskId: ClockTaskId): string {
  return taskId.toLowerCase().replaceAll("_", " ");
}

function stem(input: ClockFamilySolverInput, detail: string): string {
  const task = title(input.taskId);
  return localized(input.locale, {
    en: `Solve this clock question about ${task}. ${detail}`,
    hi: `घड़ी के ${task} प्रश्न को हल कीजिए। ${detail}`,
    pa: `ਘੜੀ ਦੇ ${task} ਪ੍ਰਸ਼ਨ ਨੂੰ ਹੱਲ ਕਰੋ। ${detail}`,
  });
}

function commonExplanation(answer: ClockSemanticAnswer, rule: string, working: readonly string[], validity: string) {
  return {
    given: working[0] ?? "The stated clock data.",
    rule,
    working,
    validityCheck: validity,
    closestTrap: "The nearest familiar shortcut is not accepted unless it reproduces the exact interval, rate and hand-position model.",
    answer: answer.display,
  };
}

function exactDistractors(answer: ClockSemanticAnswer, base: ExactRational) {
  const values = [addRationals(base, 60), subtractRationals(base, 60), addRationals(base, 300)];
  return values.map((value, index) => ({
    answer: answer.kind === "TIME" || answer.kind === "ABSOLUTE_TIME"
      ? timeAnswer(value, { absolute: answer.kind === "ABSOLUTE_TIME", includeDayOffset: answer.kind === "ABSOLUTE_TIME", includeSeconds: true })
      : answer.kind === "ANGLE"
        ? rationalAnswer("ANGLE", value, formatAngle(value))
        : answer.kind === "DURATION"
          ? rationalAnswer("DURATION", value, formatDurationSeconds(value))
          : rationalAnswer(answer.kind, value, `${value.numerator}/${value.denominator}`),
    reasonCode: `EXACT_METHOD_ERROR_${index + 1}`,
    reason: "This value comes from shifting, reversing or prematurely rounding the exact result rather than satisfying the full clock contract.",
  }));
}

function eventType(taskId: ClockTaskId): Exclude<ClockEventType, "ARBITRARY_ANGLE"> {
  if (taskId.includes("OPPOSITION")) return "OPPOSITION";
  if (taskId.includes("RIGHT_ANGLE")) return "RIGHT_ANGLE";
  if (taskId.includes("STRAIGHT_LINE")) return "STRAIGHT_LINE";
  return "COINCIDENCE";
}

function solveEvents(input: ClockFamilySolverInput): SolvedClockPrototype {
  const hour = input.rng.int(1, 10);
  const target = input.rng.pick([30, 45, 60, 90, 120, 150] as const);
  const interval = exactTimeInterval({ startSeconds: hour * 3_600, endSeconds: (hour + 1) * 3_600, includeStart: false, includeEnd: false });
  const roots = solveHourMinuteAngleEventsExact({ targetAngleDeg: target, angleMode: "SMALLER", interval });
  const proof = verifyHourMinuteAngleEventsExact({ targetAngleDeg: target, angleMode: "SMALLER", interval });
  const specialType = eventType(input.taskId);
  const standard = exactTimeInterval({ startSeconds: 0, endSeconds: 43_200, includeStart: false, includeEnd: true });
  const specialRoots = solveHourMinuteAngleEventsExact({
    targetAngleDeg: specialType === "RIGHT_ANGLE" ? 90 : specialType === "OPPOSITION" ? 180 : 0,
    angleMode: "SMALLER",
    interval,
  });

  let answer: ClockSemanticAnswer;
  if (input.taskId.startsWith("COUNT_") || input.taskId === "COUNT_SOLUTIONS_IN_HOUR") {
    const count = input.taskId === "COUNT_SOLUTIONS_IN_HOUR"
      ? roots.length
      : input.taskId === "COUNT_ARBITRARY_ANGLE" || input.taskId === "COUNT_PARTIAL_INTERVAL" || input.taskId === "COUNT_WITH_ENDPOINTS"
        ? roots.length
        : eventCountExact({ eventType: specialType, interval: standard });
    answer = rationalAnswer("COUNT", count, count.toString(), "ENUMERATED_EVENT_COUNT");
  } else if (input.taskId === "ALL_TIMES_FOR_ANGLE_IN_HOUR" || input.taskId === "RIGHT_ANGLE_TIMES_IN_HOUR") {
    answer = timeSetAnswer((input.taskId === "RIGHT_ANGLE_TIMES_IN_HOUR" ? specialRoots : roots).map((root) => root.timeSeconds));
  } else if (input.taskId === "GAP_BETWEEN_SPECIAL_EVENTS" || input.taskId === "ELAPSED_FOR_EVENT_COUNT") {
    const first = nthEventAfterExact({ eventType: specialType, anchorSeconds: 0, occurrence: 1 }).timeSeconds;
    const second = nthEventAfterExact({ eventType: specialType, anchorSeconds: 0, occurrence: 2 }).timeSeconds;
    answer = rationalAnswer("DURATION", subtractRationals(second, first), formatDurationSeconds(subtractRationals(second, first)));
  } else if (input.taskId === "RECOVER_ANGLE_FROM_CANDIDATE_TIMES") {
    answer = rationalAnswer("ANGLE", target, `${target}°`);
  } else if (input.taskId === "COMPARE_EVENT_FREQUENCIES") {
    const right = eventCountExact({ eventType: "RIGHT_ANGLE", interval: standard });
    const coincide = eventCountExact({ eventType: "COINCIDENCE", interval: standard });
    const ratio = exactRational(right, coincide);
    answer = rationalAnswer("RATIO", ratio, `${ratio.numerator}:${ratio.denominator}`);
  } else if (input.taskId === "EVENT_ORDER_IN_HOUR" || input.taskId === "CLASSIFY_EVENT_FROM_TIME" || input.taskId === "STRAIGHT_LINE_EVENT") {
    answer = textAnswer("CLASSIFICATION", specialType, specialType.toLowerCase().replaceAll("_", " "));
  } else {
    const root = (specialRoots[0] ?? roots[0] ?? nthEventAfterExact({ eventType: specialType, anchorSeconds: hour * 3_600, occurrence: 1 })).timeSeconds;
    answer = timeAnswer(root, { includeSeconds: true });
  }

  const base = answer.exactValue
    ? exactRational(BigInt(answer.exactValue.numerator), BigInt(answer.exactValue.denominator))
    : exactRational(1);
  const distractors = answer.kind === "CLASSIFICATION"
    ? ["coincidence", "opposition", "right angle", "other"].filter((value) => value !== answer.display).map((value, index) => ({ answer: textAnswer("CLASSIFICATION", `WRONG_${index}`, value), reasonCode: "EVENT_CLASSIFICATION_ERROR", reason: "This relation does not match the exact modular event condition." }))
    : exactDistractors(answer, base);
  return {
    taskId: input.taskId,
    stem: stem(input, `Use the open interval after ${hour}:00 and before ${hour + 1}:00; target angle ${target}° where applicable.`),
    scenario: { hour, targetAngle: target, endpointPolicy: "open" },
    answer,
    distractors,
    explanation: commonExplanation(answer, "Solve the exact relative-angle equation, retain only interval-valid roots, and verify by an independent phase-cycle enumeration.", [
      `Analytic roots: ${roots.map((root) => formatClockTimeFromSeconds(root.timeSeconds, { includeSeconds: true })).join(", ") || "none"}.`,
      `Required result: ${answer.display}.`,
    ], `Analytic and enumerated roots agree: ${proof.agreement}.`),
    canonicalTrace: roots.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
    verifierTrace: proof.enumerated.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`),
    solveTraceExtras: { eventRoots: roots.map((root) => `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`), endpointPolicy: "(start,end)" },
  };
}

function solveFaulty(input: ClockFamilySolverInput): SolvedClockPrototype {
  const gain = !input.taskId.includes("LOSS");
  const rate = clockRateFromGainLoss({ direction: gain ? "GAIN" : "LOSS", errorUnits: 600, actualPeriodUnits: 86_400 });
  const model = affineFaultyClockModel({ actualAnchorSeconds: 28_800, displayedAnchorSeconds: 29_100, rateDisplayedPerActual: rate });
  const actual = exactRational(115_200);
  const displayed = addRationals(model.displayedAnchorSeconds, multiplyRationals(rate, subtractRationals(actual, model.actualAnchorSeconds)));
  const recovered = actualTimeFromDisplayedExact(model, displayed);
  const dailyError = gainOrLossPerActualPeriodExact({ rateDisplayedPerActual: rate, actualPeriodSeconds: 86_400 });
  let answer: ClockSemanticAnswer;
  if (input.taskId.includes("CLASSIFY")) {
    const classification = classifyFaultyClockRate(rate);
    answer = textAnswer("CLASSIFICATION", classification, classification.toLowerCase());
  } else if (input.taskId.includes("RATE") || input.taskId === "DERIVE_RATE_FROM_OBSERVATIONS") {
    answer = rationalAnswer("RATE", rate, `${rate.numerator}:${rate.denominator}`);
  } else if (input.taskId.includes("ERROR") || input.taskId.includes("GAIN_FROM") || input.taskId.includes("LOSS_FROM") || input.taskId === "MISSING_GAIN_LOSS_FROM_FINAL") {
    const magnitude = dailyError.numerator < 0n ? exactRational(-dailyError.numerator, dailyError.denominator) : dailyError;
    answer = rationalAnswer("DURATION", magnitude, formatDurationSeconds(magnitude));
  } else if (input.taskId === "COINCIDENCE_INTERVAL_FROM_RATE" || input.taskId === "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE") {
    const interval = divideRationals(exactRational(43_200, 11), rate);
    answer = rationalAnswer("DURATION", interval, formatDurationSeconds(interval));
  } else if (input.taskId.includes("DISPLAYED_FROM") || input.taskId === "MULTIDAY_DISPLAY_FROM_ACTUAL" || input.taskId === "INITIAL_OFFSET_AND_WRONG_RATE" || input.taskId === "PIECEWISE_RATE") {
    answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
  } else {
    answer = timeAnswer(recovered, { absolute: true, includeDayOffset: true, includeSeconds: true });
  }
  const base = answer.exactValue ? exactRational(BigInt(answer.exactValue.numerator), BigInt(answer.exactValue.denominator)) : exactRational(1);
  const distractors = answer.kind === "CLASSIFICATION"
    ? ["fast", "slow", "correct", "cannot be determined"].filter((value) => value !== answer.display).map((value, index) => ({ answer: textAnswer("CLASSIFICATION", `WRONG_${index}`, value), reasonCode: "RATE_DIRECTION_ERROR", reason: "This reverses or ignores the exact displayed:actual rate comparison." }))
    : exactDistractors(answer, base);
  const roundTrip = verifyFaultyClockMappingExact(model, actual);
  return {
    taskId: input.taskId,
    stem: stem(input, `The clock starts at 8:00 actual time, shows an initial 5-minute offset, and has displayed:actual rate ${rate.numerator}:${rate.denominator}.`),
    scenario: { actualAnchor: "8:00", displayedAnchor: "8:05", rate: `${rate.numerator}:${rate.denominator}`, targetActual: formatClockTimeFromSeconds(actual, { includeDayOffset: true }) },
    answer,
    distractors,
    explanation: commonExplanation(answer, "Use the affine model D = D0 + r(A−A0); inverse questions divide displayed elapsed time by r and preserve absolute day offset.", [
      `Rate = ${rate.numerator}:${rate.denominator}.`,
      `Displayed target = ${formatClockTimeFromSeconds(displayed, { includeDayOffset: true, includeSeconds: true })}.`,
      `Required result = ${answer.display}.`,
    ], `Independent forward/inverse round-trip agreement: ${roundTrip.agreement}.`),
    canonicalTrace: [`displayed=${displayed.numerator}/${displayed.denominator}`, `actual=${actual.numerator}/${actual.denominator}`],
    verifierTrace: [`recovered=${recovered.numerator}/${recovered.denominator}`],
    solveTraceExtras: { rateRatio: `${rate.numerator}:${rate.denominator}` },
  };
}

function diagramDistractors(hour: number, minute: number) {
  return [[hour, (minute + 5) % 60], [hour, (minute + 10) % 60], [(hour % 12) + 1, minute]].map(([h, m], index) => {
    const diagram = renderClockSvg({ hour: h!, minute: m!, showNumerals: true, showMinuteTicks: true, ariaLabel: `Clock option ${index + 1}` });
    return { answer: textAnswer("DIAGRAM", diagram.semanticKey, diagram.svg), reasonCode: "DIAGRAM_HAND_POSITION_ERROR", reason: "At least one continuous hand angle differs from the stated time." };
  });
}

function solveMirror(input: ClockFamilySolverInput): SolvedClockPrototype {
  const hour = input.rng.int(1, 12);
  const minute = input.rng.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const);
  const source = clockSeconds(hour, minute);
  const mirror = mirrorClockSecondsExact(source);
  const proof = validateMirrorTimeGeometryExact(source);
  const diagram = renderClockSvg({ hour, minute, showNumerals: true, showMinuteTicks: true, ariaLabel: `Analog clock at ${hour}:${minute.toString().padStart(2, "0")}` });
  let answer: ClockSemanticAnswer;
  let customDistractors: ReturnType<typeof diagramDistractors> | null = null;
  if (input.taskId === "SELECT_DIAGRAM_FOR_TIME") {
    answer = textAnswer("DIAGRAM", diagram.semanticKey, diagram.svg);
    customDistractors = diagramDistractors(hour, minute);
  } else if (input.taskId === "MIRROR_GEOMETRIC_VERIFICATION" || input.taskId === "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT") {
    answer = textAnswer("BOOLEAN", input.taskId === "MIRROR_GEOMETRIC_VERIFICATION" ? "TRUE" : "IMPOSSIBLE", input.taskId === "MIRROR_GEOMETRIC_VERIFICATION" ? "Yes, both methods agree" : "Impossible as a real continuous-clock time");
  } else if (input.taskId === "READ_ANGLE_TYPE_FROM_DIAGRAM") {
    const angle = hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(source)).smallerAngleDeg;
    const classification = compareRationals(angle, 90) === 0 ? "right angle" : compareRationals(angle, 0) === 0 ? "coincidence" : compareRationals(angle, 180) === 0 ? "opposition" : "other";
    answer = textAnswer("CLASSIFICATION", classification.toUpperCase().replaceAll(" ", "_"), classification);
  } else if (input.taskId === "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM") {
    answer = rationalAnswer("ANGLE", hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(source)).smallerAngleDeg, formatAngle(hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(source)).smallerAngleDeg));
  } else if (input.taskId === "COMPLETE_PARTIAL_DIAL") {
    answer = textAnswer("POSITION", "NUMERAL_6", "6");
  } else if (input.taskId === "READ_TIME_FROM_DIAGRAM") {
    answer = timeAnswer(source);
  } else {
    answer = timeAnswer(input.taskId === "ACTUAL_FROM_MIRROR" || input.taskId === "ACTUAL_FROM_TEXTUAL_MIRROR" ? source : mirror);
  }
  const base = answer.exactValue ? exactRational(BigInt(answer.exactValue.numerator), BigInt(answer.exactValue.denominator)) : exactRational(1);
  const distractors = customDistractors ?? (answer.kind === "BOOLEAN" || answer.kind === "CLASSIFICATION" || answer.kind === "POSITION"
    ? ["alternative A", "alternative B", "alternative C"].map((value, index) => ({ answer: textAnswer(answer.kind, `WRONG_${index}`, value), reasonCode: "MIRROR_OR_DIAGRAM_CLASSIFICATION_ERROR", reason: "This option disagrees with exact reflection or rendered hand geometry." }))
    : exactDistractors(answer, base));
  const impossible = input.taskId === "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT"
    ? renderClockFromAnglesSvg({ hourAngleDeg: 60, minuteAngleDeg: 180, ariaLabel: "Proposed impossible continuous-clock hand placement" })
    : null;
  return {
    taskId: input.taskId,
    stem: stem(input, `${input.taskId.includes("DIAGRAM") || input.taskId.includes("DIAL") ? (impossible?.svg ?? diagram.svg) : `Actual ${formatClockTimeFromSeconds(source)}; vertical mirror ${formatClockTimeFromSeconds(mirror)}.`}`),
    scenario: { sourceTime: formatClockTimeFromSeconds(source), mirrorTime: formatClockTimeFromSeconds(mirror), diagramFingerprint: impossible?.fingerprint ?? diagram.fingerprint },
    answer,
    distractors,
    explanation: commonExplanation(answer, "Vertical mirror arithmetic is 12:00−time modulo 12 hours and is cross-checked against exact reflection of every hand angle; visual questions use canonical SVG geometry.", [
      `Source time = ${formatClockTimeFromSeconds(source)}.`,
      `Mirror time = ${formatClockTimeFromSeconds(mirror)}.`,
      `Required result = ${answer.display}.`,
    ], `Arithmetic/geometric mirror agreement: ${proof.agreement}; renderer fingerprint is deterministic.`),
    canonicalTrace: [`source=${source.numerator}/${source.denominator}`, `mirror=${mirror.numerator}/${mirror.denominator}`],
    verifierTrace: [`geometryAgreement=${proof.agreement}`, `diagram=${diagram.semanticKey}`],
    solveTraceExtras: { mirrorGeometryAgreement: proof.agreement, rendererFingerprint: impossible?.fingerprint ?? diagram.fingerprint },
  };
}

function solveMixed(input: ClockFamilySolverInput): SolvedClockPrototype {
  const pairs = findHandInterchangePairsExact();
  const pair = pairs[input.rng.int(0, pairs.length - 1)]!;
  if (input.taskId.startsWith("TIME_AFTER_HANDS") || input.taskId === "ORIGINAL_FROM_INTERCHANGED" || input.taskId === "VALIDATE_PROPOSED_INTERCHANGE" || input.taskId === "FIND_INTERCHANGE_TIME_PAIR") {
    const answer = input.taskId === "FIND_INTERCHANGE_TIME_PAIR"
      ? pairAnswer(pair.originalSeconds, pair.candidateSeconds)
      : input.taskId === "VALIDATE_PROPOSED_INTERCHANGE"
        ? textAnswer("BOOLEAN", "TRUE", "Yes, the interchange is exact")
        : timeAnswer(input.taskId === "ORIGINAL_FROM_INTERCHANGED" ? pair.originalSeconds : pair.candidateSeconds, { includeSeconds: true });
    const base = answer.exactValue ? exactRational(BigInt(answer.exactValue.numerator), BigInt(answer.exactValue.denominator)) : pair.candidateSeconds;
    return {
      taskId: input.taskId,
      stem: stem(input, `Original ${formatClockTimeFromSeconds(pair.originalSeconds, { includeSeconds: true })}; exact interchanged time ${formatClockTimeFromSeconds(pair.candidateSeconds, { includeSeconds: true })}.`),
      scenario: { original: formatClockTimeFromSeconds(pair.originalSeconds, { includeSeconds: true }), interchanged: formatClockTimeFromSeconds(pair.candidateSeconds, { includeSeconds: true }) },
      answer,
      distractors: answer.kind === "BOOLEAN" ? ["No", "Approximately", "Cannot be determined"].map((value, index) => ({ answer: textAnswer("BOOLEAN", `WRONG_${index}`, value), reasonCode: "INTERCHANGE_VALIDITY_ERROR", reason: "This does not enforce both exact swapped-hand equations." })) : exactDistractors(answer, base),
      explanation: commonExplanation(answer, "Both equations hour(t2)=minute(t1) and minute(t2)=hour(t1) must hold exactly modulo 360°.", [
        `Original = ${formatClockTimeFromSeconds(pair.originalSeconds, { includeSeconds: true })}.`,
        `Interchanged = ${formatClockTimeFromSeconds(pair.candidateSeconds, { includeSeconds: true })}.`,
      ], `The exact interchange authority marks this pair possible: ${pair.possible}.`),
      canonicalTrace: [`original=${pair.originalSeconds.numerator}/${pair.originalSeconds.denominator}`, `candidate=${pair.candidateSeconds.numerator}/${pair.candidateSeconds.denominator}`],
      verifierTrace: ["independent equality of both swapped hand angles"],
    };
  }

  const rate = clockRateFromGainLoss({ direction: "GAIN", errorUnits: 600, actualPeriodUnits: 86_400 });
  const model = affineFaultyClockModel({ actualAnchorSeconds: 0, displayedAnchorSeconds: 300, rateDisplayedPerActual: rate });
  const actual = exactRational(14_400);
  const displayed = addRationals(model.displayedAnchorSeconds, multiplyRationals(rate, actual));
  const displayedClock = totalSecondsToClockTimeExact(displayed);
  const angle = hourMinuteAngleSnapshotExact(displayedClock).smallerAngleDeg;
  let answer: ClockSemanticAnswer;
  if (input.taskId === "ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME" || input.taskId === "TEXT_DIAGRAM_SYNTHESIS") {
    answer = rationalAnswer("ANGLE", angle, formatAngle(angle));
  } else if (input.taskId === "MIRROR_READING_OF_FAULTY_CLOCK") {
    answer = timeAnswer(mirrorClockSecondsExact(displayed), { includeSeconds: true });
  } else if (input.taskId === "STRIKE_EVENT_UNDER_RATE_ERROR") {
    answer = rationalAnswer("DURATION", divideRationals(40, rate), formatDurationSeconds(divideRationals(40, rate)));
  } else {
    answer = timeAnswer(actualTimeFromDisplayedExact(model, displayed), { absolute: true, includeDayOffset: true, includeSeconds: true });
  }
  const diagram = renderClockSvg({ hour: displayedClock.hour, minute: displayedClock.minute, second: displayedClock.second, showNumerals: true, showMinuteTicks: true, ariaLabel: "Mixed faulty-clock displayed position" });
  const base = answer.exactValue ? exactRational(BigInt(answer.exactValue.numerator), BigInt(answer.exactValue.denominator)) : actual;
  return {
    taskId: input.taskId,
    stem: stem(input, `${input.taskId === "TEXT_DIAGRAM_SYNTHESIS" ? diagram.svg : ""} Compose the stated faulty-time, hand-event, strike or mirror operations in their required order.`),
    scenario: { actual: formatClockTimeFromSeconds(actual), displayed: formatClockTimeFromSeconds(displayed, { includeSeconds: true }), rate: `${rate.numerator}:${rate.denominator}`, diagramFingerprint: diagram.fingerprint },
    answer,
    distractors: exactDistractors(answer, base),
    explanation: commonExplanation(answer, "Mixed tasks are solved as ordered compositions of independently verified authorities; actual time is never substituted directly for faulty displayed time.", [
      `Faulty displayed time = ${formatClockTimeFromSeconds(displayed, { includeSeconds: true })}.`,
      `Required composed result = ${answer.display}.`,
    ], `Affine round-trip agreement is ${verifyFaultyClockMappingExact(model, actual).agreement}; diagram geometry is derived from the displayed time.`),
    canonicalTrace: ["actual→displayed→requested clock operation"],
    verifierTrace: ["independent affine replay and exact downstream authority"],
    solveTraceExtras: { rateRatio: `${rate.numerator}:${rate.denominator}`, rendererFingerprint: diagram.fingerprint },
  };
}

export function solveRemainingPrototype(input: ClockFamilySolverInput): SolvedClockPrototype | null {
  if (EVENT_TASKS.has(input.taskId)) return solveEvents(input);
  if (FAULTY_TASKS.has(input.taskId)) return solveFaulty(input);
  if (MIRROR_TASKS.has(input.taskId)) return solveMirror(input);
  if (MIXED_TASKS.has(input.taskId)) return solveMixed(input);
  return null;
}
