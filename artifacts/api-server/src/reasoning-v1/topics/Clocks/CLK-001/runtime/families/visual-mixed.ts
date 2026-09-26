import {
  absoluteRational,
  actualTimeFromDisplayedExact,
  addRationals,
  affineFaultyClockModel,
  clockRateFromGainLoss,
  clockTimeToHandAnglesByCycleExact,
  clockTimeToHandAnglesExact,
  compareRationals,
  divideRationals,
  durationForStrikesExact,
  exactRational,
  findHandInterchangePairsExact,
  hourMinuteAngleSnapshotExact,
  mirrorClockSecondsExact,
  nthEventAfterExact,
  moduloRational,
  multiplyRationals,
  rationalToNumber,
  rationalsEqual,
  solveHandInterchangeExact,
  subtractRationals,
  totalSecondsToClockTimeExact,
  validateMirrorTimeGeometryExact,
  validateProposedHandInterchangeExact,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import {
  clockDiagramSemanticKey,
  renderClockFromAnglesSvg,
  renderClockSvg,
} from "../clock-svg";
import type {
  ClockContractEvidence,
  ClockFamilySolverInput,
  SolvedClockPrototype,
} from "../solver-types";
import type {
  ClockAnswerKind,
  ClockMediaAsset,
  ClockQuestionMedia,
  ClockSemanticAnswer,
} from "../types";
import {
  clockSeconds,
  formatAngle,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  pairAnswer,
  rationalAnswer,
  textAnswer,
  timeAnswer,
} from "../utils";

const CP011_TASKS = new Set<ClockTaskId>([
  "MIRROR_FROM_ACTUAL",
  "ACTUAL_FROM_MIRROR",
  "MIRROR_AROUND_12_BOUNDARY",
  "ACTUAL_FROM_TEXTUAL_MIRROR",
  "MIRROR_BOUNDARY_CASES",
  "MIRROR_GEOMETRIC_VERIFICATION",
]);

const CP012_TASKS = new Set<ClockTaskId>([
  "READ_TIME_FROM_DIAGRAM",
  "SELECT_DIAGRAM_FOR_TIME",
  "READ_ANGLE_TYPE_FROM_DIAGRAM",
  "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM",
  "COMPLETE_PARTIAL_DIAL",
  "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT",
]);

const CP013_TASKS = new Set<ClockTaskId>([
  "TIME_AFTER_HANDS_INTERCHANGED",
  "ORIGINAL_FROM_INTERCHANGED",
  "VALIDATE_PROPOSED_INTERCHANGE",
  "FIND_INTERCHANGE_TIME_PAIR",
]);

const CP014_TASKS = new Set<ClockTaskId>([
  "ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME",
  "ACTUAL_TIME_OF_FAULTY_HAND_EVENT",
  "MIRROR_READING_OF_FAULTY_CLOCK",
  "STRIKE_EVENT_UNDER_RATE_ERROR",
  "OFFSET_PLUS_RATE_CORRECTION",
  "TEXT_DIAGRAM_SYNTHESIS",
]);

function exactKey(value: ExactRational): string {
  return `${value.numerator}/${value.denominator}`;
}

function contract(
  expectedAnswerKind: ClockAnswerKind,
  oracleName: string,
  visibleStemTokens: readonly string[],
): ClockContractEvidence {
  return { expectedAnswerKind, oracleName, visibleStemTokens };
}

function timeDistractors(correct: ExactRational): SolvedClockPrototype["distractors"] {
  return [
    { answer: timeAnswer(addRationals(correct, 60), { includeSeconds: true }), reasonCode: "ONE_MINUTE_LATE", reason: "This shifts the exact clock time one minute later." },
    { answer: timeAnswer(subtractRationals(correct, 60), { includeSeconds: true }), reasonCode: "ONE_MINUTE_EARLY", reason: "This shifts the exact clock time one minute earlier." },
    { answer: timeAnswer(addRationals(correct, 3_600), { includeSeconds: true }), reasonCode: "ONE_HOUR_SHIFT", reason: "This changes the hour while retaining neither the required hand geometry nor the stated transformation." },
  ];
}

function absoluteTimeDistractors(correct: ExactRational): SolvedClockPrototype["distractors"] {
  return [
    { answer: timeAnswer(addRationals(correct, 300), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "OFFSET_ADDED_TWICE", reason: "This adds a five-minute offset after it has already been included in the affine conversion." },
    { answer: timeAnswer(subtractRationals(correct, 300), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "OFFSET_DIRECTION_REVERSED", reason: "This applies an ahead/behind offset in the wrong direction." },
    { answer: timeAnswer(addRationals(correct, 3_600), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "ONE_HOUR_BASE_ERROR", reason: "This applies the rate correction to the wrong time base and shifts the answer by an hour." },
  ];
}

function makeAsset(
  id: string,
  role: ClockMediaAsset["role"],
  rendered: { svg: string; fingerprint: string; semanticKey: string },
  ariaLabel: string,
): ClockMediaAsset {
  return {
    id,
    role,
    mimeType: "image/svg+xml",
    svg: rendered.svg,
    ariaLabel,
    semanticKey: rendered.semanticKey,
    fingerprint: rendered.fingerprint,
  };
}

function mirrorVerifier(actualSeconds: ExactRational): ExactRational {
  return moduloRational(subtractRationals(43_200, actualSeconds), 43_200);
}

function solveCp011(input: ClockFamilySolverInput): SolvedClockPrototype {
  const boundary = input.taskId === "MIRROR_AROUND_12_BOUNDARY" || input.taskId === "MIRROR_BOUNDARY_CASES";
  const hour = boundary
    ? input.rng.pick([11, 12] as const)
    : input.rng.int(1, 12);
  const minute = boundary
    ? input.rng.pick([0, 1, 5, 10, 50, 55, 59] as const)
    : input.rng.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const);
  const actual = clockSeconds(hour, minute);
  const mirror = mirrorClockSecondsExact(actual);
  const verifierMirror = mirrorVerifier(actual);
  const actualText = formatClockTimeFromSeconds(actual);
  const mirrorText = formatClockTimeFromSeconds(mirror);

  if (input.taskId === "ACTUAL_FROM_MIRROR" || input.taskId === "ACTUAL_FROM_TEXTUAL_MIRROR") {
    const recovered = mirrorClockSecondsExact(mirror);
    const verifierRecovered = mirrorVerifier(mirror);
    const answer = timeAnswer(recovered);
    const verifierAnswer = timeAnswer(verifierRecovered);
    return {
      taskId: input.taskId,
      stem: input.taskId === "ACTUAL_FROM_TEXTUAL_MIRROR"
        ? `A vertical mirror beside an analog clock appears to show ${mirrorText}. What is the actual clock time?`
        : `The vertical mirror image of an analog clock shows ${mirrorText}. What is the actual time?`,
      scenario: { mirrorReading: mirrorText, transformation: "VERTICAL_MIRROR" },
      answer,
      verifierAnswer,
      distractors: timeDistractors(recovered),
      explanation: {
        given: `Mirror reading ${mirrorText}.`,
        rule: "For a vertical mirror, actual time = 12:00 − mirror time, interpreted modulo 12 hours.",
        working: [`12:00 − ${mirrorText} = ${answer.display}.`],
        validityCheck: "Applying the same mirror transformation again returns the stated mirror reading.",
        closestTrap: "Do not subtract separately from 11 hours and 60 minutes without handling the 12-hour boundary correctly.",
        answer: answer.display,
      },
      canonicalTrace: [`mirror(mirror)=${exactKey(recovered)}`],
      verifierTrace: [`43200-mirror mod43200=${exactKey(verifierRecovered)}`],
      solveTraceExtras: { mirrorGeometryAgreement: validateMirrorTimeGeometryExact(recovered).agreement },
      contractEvidence: contract("TIME", "CP011_MIRROR_INVOLUTION_ORACLE", [mirrorText, "actual"]),
    };
  }

  if (input.taskId === "MIRROR_GEOMETRIC_VERIFICATION") {
    const useValid = input.rng.pick([true, false] as const);
    const proposed = useValid ? mirror : addRationals(mirror, 300);
    const proposedText = formatClockTimeFromSeconds(proposed);
    const geometry = validateMirrorTimeGeometryExact(actual);
    const canonicalValid = geometry.agreement && rationalsEqual(mirror, proposed);
    const verifierValid = rationalsEqual(mirrorVerifier(actual), proposed);
    const answer = textAnswer("BOOLEAN", canonicalValid ? "TRUE" : "FALSE", canonicalValid ? "Yes" : "No");
    const verifierAnswer = textAnswer("BOOLEAN", verifierValid ? "TRUE" : "FALSE", verifierValid ? "Yes" : "No");
    return {
      taskId: input.taskId,
      stem: `An analog clock shows ${actualText}. A student claims that its vertical mirror reading is ${proposedText}. Is the claim correct?`,
      scenario: { actualTime: actualText, proposedMirror: proposedText },
      answer,
      verifierAnswer,
      distractors: [
        { answer: textAnswer("BOOLEAN", canonicalValid ? "FALSE" : "TRUE", canonicalValid ? "No" : "Yes"), reasonCode: "MIRROR_VALIDITY_REVERSED", reason: "This reverses the result of the exact mirror arithmetic and geometry check." },
        { answer: textAnswer("BOOLEAN", "CANNOT_DETERMINE", "Cannot be determined"), reasonCode: "SUFFICIENT_CLOCK_DATA_IGNORED", reason: "The actual time and proposed mirror reading are sufficient to verify the claim exactly." },
        { answer: textAnswer("BOOLEAN", "ONLY_APPROXIMATE", "Approximately correct"), reasonCode: "EXACT_TRANSFORMATION_TREATED_AS_APPROXIMATE", reason: "Vertical mirror time is an exact transformation, not an estimate." },
      ],
      explanation: {
        given: `Actual ${actualText}; proposed mirror ${proposedText}.`,
        rule: "Compute 12:00−actual and independently reflect both hand angles across the vertical axis.",
        working: [`Exact arithmetic mirror = ${mirrorText}.`, `Proposed reading = ${proposedText}.`],
        validityCheck: `Arithmetic and geometric mirror authorities agree: ${geometry.agreement}.`,
        closestTrap: "A visually plausible time is not enough; both reflected hand positions must match exactly.",
        answer: answer.display,
      },
      canonicalTrace: [`geometry=${geometry.agreement}`, `expected=${exactKey(mirror)}`, `proposed=${exactKey(proposed)}`],
      verifierTrace: [`arithmeticExpected=${exactKey(verifierMirror)}`],
      solveTraceExtras: { mirrorGeometryAgreement: geometry.agreement },
      contractEvidence: contract("BOOLEAN", "CP011_MIRROR_ARITHMETIC_GEOMETRY_ORACLE", [actualText, proposedText, "claim correct"]),
    };
  }

  const answer = timeAnswer(mirror);
  const verifierAnswer = timeAnswer(verifierMirror);
  const stem = input.taskId === "MIRROR_BOUNDARY_CASES"
    ? `A vertical mirror is placed beside a clock showing the boundary-case time ${actualText}. What mirror time is seen?`
    : input.taskId === "MIRROR_AROUND_12_BOUNDARY"
      ? `A clock shows ${actualText}, close to the 12 o'clock boundary. What time appears in a vertical mirror?`
      : `A clock shows ${actualText}. What time appears in a vertical mirror?`;
  return {
    taskId: input.taskId,
    stem,
    scenario: { actualTime: actualText, transformation: "VERTICAL_MIRROR" },
    answer,
    verifierAnswer,
    distractors: [
      { answer: timeAnswer(actual), reasonCode: "ACTUAL_TIME_COPIED", reason: "This copies the original clock reading without applying the mirror transformation." },
      { answer: timeAnswer(addRationals(mirror, 60)), reasonCode: "BORROWING_ERROR_ONE_MINUTE", reason: "This introduces a one-minute borrowing error around the 12-hour subtraction." },
      { answer: timeAnswer(moduloRational(subtractRationals(39_600, actual), 43_200)), reasonCode: "SUBTRACTED_FROM_ELEVEN_HOURS", reason: "This subtracts from 11:00 rather than from the 12:00 reference." },
    ],
    explanation: {
      given: `Actual time ${actualText}.`,
      rule: "Vertical mirror reading = 12:00 − actual time, modulo 12 hours.",
      working: [`Mirror reading = 12:00 − ${actualText} = ${answer.display}.`],
      validityCheck: "The exact arithmetic result agrees with vertical reflection of both continuous hand angles.",
      closestTrap: "Handle 12:00 as the modular zero boundary; do not lose an hour while borrowing minutes.",
      answer: answer.display,
    },
    canonicalTrace: [`mirrorAuthority=${exactKey(mirror)}`],
    verifierTrace: [`43200-actual mod43200=${exactKey(verifierMirror)}`],
    solveTraceExtras: { mirrorGeometryAgreement: validateMirrorTimeGeometryExact(actual).agreement },
    contractEvidence: contract("TIME", "CP011_VERTICAL_MIRROR_FORWARD_ORACLE", [actualText, "vertical mirror"]),
  };
}

function minuteResolutionTimeFromAngles(hourAngle: ExactRational, minuteAngle: ExactRational): ExactRational | null {
  for (let totalMinute = 0; totalMinute < 720; totalMinute += 1) {
    const candidate = clockTimeToHandAnglesByCycleExact(totalSecondsToClockTimeExact(totalMinute * 60));
    if (rationalsEqual(candidate.hourAngleDeg, hourAngle) && rationalsEqual(candidate.minuteAngleDeg, minuteAngle)) {
      return exactRational(totalMinute * 60);
    }
  }
  return null;
}

function relationFromSmallerAngle(angle: ExactRational): "COINCIDENT" | "RIGHT_ANGLE" | "OPPOSITE" | "OTHER" {
  if (compareRationals(angle, 0) === 0) return "COINCIDENT";
  if (compareRationals(angle, 90) === 0) return "RIGHT_ANGLE";
  if (compareRationals(angle, 180) === 0) return "OPPOSITE";
  return "OTHER";
}

function solveCp012(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "COMPLETE_PARTIAL_DIAL") {
    const missing = input.rng.int(1, 12);
    const rendered = renderClockSvg({
      hour: 10,
      minute: 10,
      partialDialMissingNumeral: missing,
      ariaLabel: "Partial analog clock dial with one numeral missing.",
    });
    const media: ClockQuestionMedia = {
      prompt: makeAsset("CLK-CP012-PARTIAL-DIAL", "PROMPT_DIAGRAM", rendered, "Partial analog clock dial with one numeral missing."),
    };
    const visibleNumerals = Array.from({ length: 12 }, (_, index) => index + 1).filter((value) => value !== missing);
    const verifierMissing = 78 - visibleNumerals.reduce((sum, value) => sum + value, 0);
    const answer = rationalAnswer("POSITION", missing, missing.toString(), "MISSING_DIAL_NUMERAL");
    const verifierAnswer = rationalAnswer("POSITION", verifierMissing, verifierMissing.toString(), "MISSING_DIAL_NUMERAL");
    return {
      taskId: input.taskId,
      stem: "One numeral is missing from the attached standard clock dial. Which numeral should fill the blank position?",
      media,
      scenario: { missingNumeral: missing, dialType: "STANDARD_1_TO_12" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("POSITION", missing === 12 ? 1 : missing + 1, (missing === 12 ? 1 : missing + 1).toString(), "MISSING_DIAL_NUMERAL"), reasonCode: "NEXT_CLOCKWISE_NUMERAL", reason: "This chooses the next clockwise numeral rather than the blank position itself." },
        { answer: rationalAnswer("POSITION", missing === 1 ? 12 : missing - 1, (missing === 1 ? 12 : missing - 1).toString(), "MISSING_DIAL_NUMERAL"), reasonCode: "PREVIOUS_ANTICLOCKWISE_NUMERAL", reason: "This chooses the previous numeral rather than the missing numeral." },
        { answer: rationalAnswer("POSITION", 13 - missing, (13 - missing).toString(), "MISSING_DIAL_NUMERAL"), reasonCode: "OPPOSITE_SUM_COMPLEMENT", reason: "This uses the 13-complement of the missing numeral instead of reading its dial position." },
      ],
      explanation: {
        given: "A standard 1-to-12 dial with one blank numeral position.",
        rule: "Follow the standard clockwise numeral order or subtract the visible numerals from 1+⋯+12=78.",
        working: [`The blank position corresponds to ${answer.display}.`],
        validityCheck: "The visual position and independent missing-sum calculation agree.",
        closestTrap: "Do not report a neighbouring numeral or the numeral opposite the blank.",
        answer: answer.display,
      },
      canonicalTrace: [`renderMissing=${missing}`],
      verifierTrace: [`78-visibleSum=${verifierMissing}`],
      solveTraceExtras: { rendererFingerprint: rendered.fingerprint },
      contractEvidence: contract("POSITION", "CP012_PARTIAL_DIAL_POSITION_ORACLE", ["attached standard clock dial", "missing"]),
    };
  }

  if (input.taskId === "DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT") {
    const useValid = input.rng.pick([true, false] as const);
    let hourAngle: number;
    let minuteAngle: number;
    if (useValid) {
      const time = { hour: input.rng.int(1, 12), minute: input.rng.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const) };
      const angles = clockTimeToHandAnglesExact(time);
      hourAngle = rationalToNumber(angles.hourAngleDeg);
      minuteAngle = rationalToNumber(angles.minuteAngleDeg);
    } else {
      minuteAngle = input.rng.pick([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const);
      hourAngle = input.rng.pick([11, 41, 71, 101, 131, 161, 191, 221, 251, 281, 311, 341] as const);
    }
    const rendered = renderClockFromAnglesSvg({ hourAngleDeg: hourAngle, minuteAngleDeg: minuteAngle, ariaLabel: "Analog clock hand-placement question diagram." });
    const exhaustiveMatch = (() => {
      for (let totalMinute = 0; totalMinute < 720; totalMinute += 1) {
        const angles = clockTimeToHandAnglesExact(totalSecondsToClockTimeExact(totalMinute * 60));
        if (Math.abs(rationalToNumber(angles.hourAngleDeg) - hourAngle) < 1e-9 && Math.abs(rationalToNumber(angles.minuteAngleDeg) - minuteAngle) < 1e-9) return true;
      }
      return false;
    })();
    const canonicalValid = useValid;
    const verifierValid = exhaustiveMatch;
    const answer = textAnswer("BOOLEAN", canonicalValid ? "POSSIBLE" : "IMPOSSIBLE", canonicalValid ? "Possible" : "Impossible");
    const verifierAnswer = textAnswer("BOOLEAN", verifierValid ? "POSSIBLE" : "IMPOSSIBLE", verifierValid ? "Possible" : "Impossible");
    return {
      taskId: input.taskId,
      stem: "Can the exact hour-hand and minute-hand placement in the attached diagram occur on a correctly working clock at a whole-minute time?",
      media: { prompt: makeAsset("CLK-CP012-PLACEMENT", "PROMPT_DIAGRAM", rendered, "Analog clock hand-placement question diagram.") },
      scenario: { hourAngleDeg: hourAngle, minuteAngleDeg: minuteAngle, wholeMinuteModel: true },
      answer,
      verifierAnswer,
      distractors: [
        { answer: textAnswer("BOOLEAN", canonicalValid ? "IMPOSSIBLE" : "POSSIBLE", canonicalValid ? "Impossible" : "Possible"), reasonCode: "PLACEMENT_VALIDITY_REVERSED", reason: "This reverses the result of the exact whole-minute placement check." },
        { answer: textAnswer("BOOLEAN", "ONLY_IF_FAULTY", "Possible only on a faulty clock"), reasonCode: "FAULTY_CLOCK_INTRODUCED", reason: "The question asks about a correctly working clock and supplies exact hand geometry." },
        { answer: textAnswer("BOOLEAN", "CANNOT_DETERMINE", "Cannot be determined"), reasonCode: "EXHAUSTIVE_GEOMETRY_IGNORED", reason: "The two exact hand directions are sufficient to test every whole-minute clock position." },
      ],
      explanation: {
        given: "Exact hand directions from the diagram under the whole-minute model.",
        rule: "At minute m, the minute hand is at 6m° and the hour hand must be at 30H+0.5m°.",
        working: [`Exhaustive whole-minute match found: ${verifierValid}.`, `Classification = ${answer.display}.`],
        validityCheck: "A separate scan of all 720 whole-minute dial positions gives the same result.",
        closestTrap: "A visually plausible placement can still violate the hour hand's compulsory half-degree movement per minute.",
        answer: answer.display,
      },
      canonicalTrace: [`constructedValidity=${canonicalValid}`],
      verifierTrace: [`exhaustive720=${verifierValid}`],
      solveTraceExtras: { rendererFingerprint: rendered.fingerprint },
      contractEvidence: contract("BOOLEAN", "CP012_HAND_PLACEMENT_EXHAUSTIVE_ORACLE", ["attached diagram", "correctly working clock", "whole-minute"]),
    };
  }

  const hour = input.rng.int(1, 12);
  const minute = input.rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const);
  const sourceSeconds = clockSeconds(hour, minute);
  const sourceAngles = clockTimeToHandAnglesExact({ hour, minute });
  const rendered = renderClockSvg({
    hour,
    minute,
    ariaLabel: "Analog clock question diagram with hour and minute hands.",
    highlightArc: input.taskId === "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM" ? input.rng.pick(["SMALLER", "REFLEX"] as const) : null,
  });

  if (input.taskId === "READ_TIME_FROM_DIAGRAM") {
    const reconstructed = minuteResolutionTimeFromAngles(sourceAngles.hourAngleDeg, sourceAngles.minuteAngleDeg);
    if (!reconstructed) throw new Error("Rendered whole-minute clock could not be reconstructed.");
    const answer = timeAnswer(sourceSeconds);
    const verifierAnswer = timeAnswer(reconstructed);
    return {
      taskId: input.taskId,
      stem: "What time is shown by the attached analog clock diagram?",
      media: { prompt: makeAsset("CLK-CP012-READ-TIME", "PROMPT_DIAGRAM", rendered, "Analog clock question diagram with hour and minute hands.") },
      scenario: { wholeMinuteDiagram: true },
      answer,
      verifierAnswer,
      distractors: timeDistractors(sourceSeconds),
      explanation: {
        given: "One analog clock diagram.",
        rule: "Read the longer hand as minutes and use the shorter hand's continuous position to confirm the hour.",
        working: [`Minute hand indicates ${minute} minutes.`, `Hour hand lies in the ${hour} o'clock sector.`, `Time = ${answer.display}.`],
        validityCheck: "Independent exhaustive matching of all 720 whole-minute positions recovers the same time.",
        closestTrap: "Do not interchange the hour and minute hands merely because both point near numeral marks.",
        answer: answer.display,
      },
      canonicalTrace: [`source=${exactKey(sourceSeconds)}`],
      verifierTrace: [`reconstructed=${exactKey(reconstructed)}`],
      solveTraceExtras: { rendererFingerprint: rendered.fingerprint },
      contractEvidence: contract("TIME", "CP012_DIAGRAM_TO_TIME_ORACLE", ["attached analog clock diagram"]),
    };
  }

  if (input.taskId === "SELECT_DIAGRAM_FOR_TIME") {
    const targetText = formatClockTimeFromSeconds(sourceSeconds);
    const candidateTimes = [
      sourceSeconds,
      moduloRational(addRationals(sourceSeconds, 300), 43_200),
      moduloRational(subtractRationals(sourceSeconds, 300), 43_200),
      moduloRational(addRationals(sourceSeconds, 3_600), 43_200),
    ];
    const renderCandidate = (seconds: ExactRational, index: number) => {
      const time = totalSecondsToClockTimeExact(seconds);
      return renderClockSvg({ hour: time.hour, minute: time.minute, second: time.second, ariaLabel: `Clock option diagram ${index + 1}.` });
    };
    const renderedCandidates = candidateTimes.map(renderCandidate);
    const correctRendered = renderedCandidates[0]!;
    const answer: ClockSemanticAnswer = { kind: "DIAGRAM", semanticKey: correctRendered.semanticKey, display: "Diagram option matching the target time", metadata: { fingerprint: correctRendered.fingerprint } };
    const verifierKey = clockDiagramSemanticKey({ hour, minute });
    const verifierAnswer: ClockSemanticAnswer = { kind: "DIAGRAM", semanticKey: verifierKey, display: "Diagram option matching the target time", metadata: { fingerprint: correctRendered.fingerprint } };
    const optionMedia = renderedCandidates.map((candidate, index) => ({
      semanticKey: candidate.semanticKey,
      asset: makeAsset(`CLK-CP012-OPTION-${index + 1}`, "OPTION_DIAGRAM", candidate, `Clock option diagram ${index + 1}.`),
    }));
    return {
      taskId: input.taskId,
      stem: `Which attached option diagram shows ${targetText}?`,
      media: { options: optionMedia },
      scenario: { targetTime: targetText, optionCount: 4 },
      answer,
      verifierAnswer,
      distractors: renderedCandidates.slice(1).map((candidate, index) => ({
        answer: { kind: "DIAGRAM", semanticKey: candidate.semanticKey, display: `Diagram option ${index + 2}`, metadata: { fingerprint: candidate.fingerprint } },
        reasonCode: ["FIVE_MINUTES_LATE", "FIVE_MINUTES_EARLY", "ONE_HOUR_LATE"][index]!,
        reason: ["This option shows a time five minutes later than the target.", "This option shows a time five minutes earlier than the target.", "This option advances the hour while preserving neither exact hand position."][index]!,
      })),
      explanation: {
        given: `Target time ${targetText}.`,
        rule: "Convert the target time to exact continuous hour- and minute-hand angles, then match both hands.",
        working: [`Required diagram semantic key = ${correctRendered.semanticKey}.`],
        validityCheck: "The renderer key and independently recomputed time-to-angle key are identical.",
        closestTrap: "Matching only the minute hand can leave an option with the wrong continuous hour-hand position.",
        answer: "The option whose two hand positions match the target time.",
      },
      canonicalTrace: [`renderer=${correctRendered.semanticKey}`],
      verifierTrace: [`kinematicsKey=${verifierKey}`],
      solveTraceExtras: { rendererFingerprint: correctRendered.fingerprint },
      contractEvidence: contract("DIAGRAM", "CP012_TIME_TO_DIAGRAM_SEMANTIC_ORACLE", [targetText, "option diagram"]),
    };
  }

  const canonicalSnapshot = hourMinuteAngleSnapshotExact({ hour, minute });
  const cycleAngles = clockTimeToHandAnglesByCycleExact({ hour, minute });
  const independentSmaller = (() => {
    const clockwise = moduloRational(subtractRationals(cycleAngles.minuteAngleDeg, cycleAngles.hourAngleDeg), 360);
    const complement = subtractRationals(360, clockwise);
    return compareRationals(clockwise, complement) <= 0 ? clockwise : complement;
  })();

  if (input.taskId === "READ_ANGLE_TYPE_FROM_DIAGRAM") {
    const canonicalClass = relationFromSmallerAngle(canonicalSnapshot.smallerAngleDeg);
    const verifierClass = relationFromSmallerAngle(independentSmaller);
    const answer = textAnswer("CLASSIFICATION", canonicalClass, canonicalClass.toLowerCase().replaceAll("_", " "));
    const verifierAnswer = textAnswer("CLASSIFICATION", verifierClass, verifierClass.toLowerCase().replaceAll("_", " "));
    return {
      taskId: input.taskId,
      stem: "Which exact relation do the hour and minute hands in the attached diagram form: coincident, right angle, opposite, or other?",
      media: { prompt: makeAsset("CLK-CP012-RELATION", "PROMPT_DIAGRAM", rendered, "Analog clock relation question diagram.") },
      scenario: { wholeMinuteDiagram: true },
      answer,
      verifierAnswer,
      distractors: (["COINCIDENT", "RIGHT_ANGLE", "OPPOSITE", "OTHER"] as const).filter((value) => value !== canonicalClass).map((value) => ({ answer: textAnswer("CLASSIFICATION", value, value.toLowerCase().replaceAll("_", " ")), reasonCode: `MISCLASSIFIED_AS_${value}`, reason: "This label does not match the exact hand separation in the diagram." })),
      explanation: {
        given: "Attached analog clock diagram.",
        rule: "Compute or read the exact smaller angle: 0°, 90°, 180° or another value.",
        working: [`Smaller angle = ${formatAngle(canonicalSnapshot.smallerAngleDeg)}.`, `Relation = ${answer.display}.`],
        validityCheck: "Independent cycle-derived hand positions give the same classification.",
        closestTrap: "A near-right or near-opposite drawing is not exact; use both continuous hand positions.",
        answer: answer.display,
      },
      canonicalTrace: [`smaller=${exactKey(canonicalSnapshot.smallerAngleDeg)}`],
      verifierTrace: [`cycleSmaller=${exactKey(independentSmaller)}`],
      solveTraceExtras: { rendererFingerprint: rendered.fingerprint },
      contractEvidence: contract("CLASSIFICATION", "CP012_DIAGRAM_RELATION_ORACLE", ["attached diagram", "coincident", "right angle", "opposite"]),
    };
  }

  const askReflex = input.rng.pick([true, false] as const);
  const canonical = askReflex ? canonicalSnapshot.reflexAngleDeg : canonicalSnapshot.smallerAngleDeg;
  const verifier = askReflex
    ? compareRationals(independentSmaller, 0) === 0 ? exactRational(0) : subtractRationals(360, independentSmaller)
    : independentSmaller;
  const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
  const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
  return {
    taskId: input.taskId,
    stem: `What is the ${askReflex ? "reflex" : "smaller"} angle between the hands in the attached clock diagram?`,
    media: { prompt: makeAsset("CLK-CP012-ANGLE", "PROMPT_DIAGRAM", rendered, "Analog clock angle question diagram.") },
    scenario: { requestedAngle: askReflex ? "REFLEX" : "SMALLER", wholeMinuteDiagram: true },
    answer,
    verifierAnswer,
    distractors: [
      { answer: rationalAnswer("ANGLE", askReflex ? canonicalSnapshot.smallerAngleDeg : canonicalSnapshot.reflexAngleDeg, formatAngle(askReflex ? canonicalSnapshot.smallerAngleDeg : canonicalSnapshot.reflexAngleDeg)), reasonCode: askReflex ? "SMALLER_INSTEAD_OF_REFLEX" : "REFLEX_INSTEAD_OF_SMALLER", reason: "This selects the other circular angle between the same two hands." },
      { answer: rationalAnswer("ANGLE", sourceAngles.minuteAngleDeg, formatAngle(sourceAngles.minuteAngleDeg)), reasonCode: "MINUTE_HAND_DIRECTION_USED", reason: "This reports the minute hand's direction from 12 rather than the angle between the hands." },
      { answer: rationalAnswer("ANGLE", sourceAngles.hourAngleDeg, formatAngle(sourceAngles.hourAngleDeg)), reasonCode: "HOUR_HAND_DIRECTION_USED", reason: "This reports the hour hand's direction from 12 rather than the angle between the hands." },
    ],
    explanation: {
      given: `Attached diagram; requested ${askReflex ? "reflex" : "smaller"} angle.`,
      rule: "Find the smaller separation first; the non-zero reflex angle is 360° minus the smaller angle.",
      working: [`Smaller angle = ${formatAngle(canonicalSnapshot.smallerAngleDeg)}.`, `${askReflex ? "Reflex" : "Required"} angle = ${answer.display}.`],
      validityCheck: "Independent cycle-derived hand directions reproduce the same angle.",
      closestTrap: "A hand's direction from 12 is not the angle between the two hands.",
      answer: answer.display,
    },
    canonicalTrace: [`requested=${exactKey(canonical)}`],
    verifierTrace: [`cycleRequested=${exactKey(verifier)}`],
    solveTraceExtras: { rendererFingerprint: rendered.fingerprint },
    contractEvidence: contract("ANGLE", "CP012_DIAGRAM_SMALLER_REFLEX_ORACLE", [askReflex ? "reflex" : "smaller", "attached clock diagram"]),
  };
}

function solveCp013(input: ClockFamilySolverInput): SolvedClockPrototype {
  const pairs = findHandInterchangePairsExact();
  const selected = input.rng.pick(pairs);
  const originalText = formatClockTimeFromSeconds(selected.originalSeconds, { includeSeconds: true });
  const candidateText = formatClockTimeFromSeconds(selected.candidateSeconds, { includeSeconds: true });

  if (input.taskId === "TIME_AFTER_HANDS_INTERCHANGED") {
    const solved = solveHandInterchangeExact(selected.originalSeconds);
    const answer = timeAnswer(solved.candidateSeconds, { includeSeconds: true });
    const verifierAnswer = timeAnswer(selected.candidateSeconds, { includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `At ${originalText}, the positions of the hour and minute hands are interchanged. At what valid clock time would those swapped positions occur?`,
      scenario: { originalTime: originalText },
      answer,
      verifierAnswer,
      distractors: timeDistractors(solved.candidateSeconds),
      explanation: {
        given: `Original time ${originalText}.`,
        rule: "The target hour hand must equal the original minute-hand direction and the target minute hand must equal the original hour-hand direction.",
        working: [`Exact swapped-position time = ${answer.display}.`],
        validityCheck: "Both swapped angle equalities hold exactly at the answer.",
        closestTrap: "Simply exchanging the written hour and minute numbers does not generally exchange the physical hand positions.",
        answer: answer.display,
      },
      canonicalTrace: [`solveInterchange=${exactKey(solved.candidateSeconds)}`],
      verifierTrace: [`catalogPair=${exactKey(selected.candidateSeconds)}`],
      contractEvidence: contract("TIME", "CP013_FORWARD_INTERCHANGE_ORACLE", [originalText, "swapped positions"]),
    };
  }

  if (input.taskId === "ORIGINAL_FROM_INTERCHANGED") {
    const reverse = solveHandInterchangeExact(selected.candidateSeconds);
    const answer = timeAnswer(reverse.candidateSeconds, { includeSeconds: true });
    const verifierAnswer = timeAnswer(selected.originalSeconds, { includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `After the hour and minute hand positions were interchanged, the clock showed ${candidateText}. What was the original valid time?`,
      scenario: { interchangedTime: candidateText },
      answer,
      verifierAnswer,
      distractors: timeDistractors(reverse.candidateSeconds),
      explanation: {
        given: `Interchanged time ${candidateText}.`,
        rule: "Hand interchange is symmetric: solve the same two exact angle equalities in reverse.",
        working: [`Original time = ${answer.display}.`],
        validityCheck: "Interchanging the recovered original returns the stated time.",
        closestTrap: "Reversing the written digits is not a physical hand-interchange operation.",
        answer: answer.display,
      },
      canonicalTrace: [`reverseSolve=${exactKey(reverse.candidateSeconds)}`],
      verifierTrace: [`catalogOriginal=${exactKey(selected.originalSeconds)}`],
      contractEvidence: contract("TIME", "CP013_REVERSE_INTERCHANGE_ORACLE", [candidateText, "original valid time"]),
    };
  }

  if (input.taskId === "VALIDATE_PROPOSED_INTERCHANGE") {
    const validProposal = input.rng.pick([true, false] as const);
    const proposed = validProposal ? selected.candidateSeconds : addRationals(selected.candidateSeconds, 60);
    const proposedText = formatClockTimeFromSeconds(proposed, { includeSeconds: true });
    const canonical = validateProposedHandInterchangeExact({ originalSeconds: selected.originalSeconds, proposedSeconds: proposed });
    const originalAngles = clockTimeToHandAnglesExact(totalSecondsToClockTimeExact(selected.originalSeconds));
    const proposedAngles = clockTimeToHandAnglesByCycleExact(totalSecondsToClockTimeExact(proposed));
    const verifier = rationalsEqual(originalAngles.hourAngleDeg, proposedAngles.minuteAngleDeg) && rationalsEqual(originalAngles.minuteAngleDeg, proposedAngles.hourAngleDeg);
    const answer = textAnswer("BOOLEAN", canonical ? "TRUE" : "FALSE", canonical ? "Yes" : "No");
    const verifierAnswer = textAnswer("BOOLEAN", verifier ? "TRUE" : "FALSE", verifier ? "Yes" : "No");
    return {
      taskId: input.taskId,
      stem: `Do ${originalText} and ${proposedText} form a valid pair in which the hour- and minute-hand positions are exactly interchanged?`,
      scenario: { originalTime: originalText, proposedTime: proposedText },
      answer,
      verifierAnswer,
      distractors: [
        { answer: textAnswer("BOOLEAN", canonical ? "FALSE" : "TRUE", canonical ? "No" : "Yes"), reasonCode: "INTERCHANGE_VALIDITY_REVERSED", reason: "This reverses the exact two-angle equality test." },
        { answer: textAnswer("BOOLEAN", "APPROXIMATE", "Approximately"), reasonCode: "EXACT_SWAP_TREATED_AS_APPROXIMATE", reason: "A physical hand interchange requires exact equality of both hand directions." },
        { answer: textAnswer("BOOLEAN", "CANNOT_DETERMINE", "Cannot be determined"), reasonCode: "COMPLETE_TIMES_IGNORED", reason: "Both full clock times are supplied, so the swap can be verified exactly." },
      ],
      explanation: {
        given: `Proposed pair ${originalText} and ${proposedText}.`,
        rule: "Check both equalities: target hour angle = source minute angle and target minute angle = source hour angle.",
        working: [`Both equalities hold: ${verifier}.`],
        validityCheck: "The direct interchange validator and independent cycle-angle comparison agree.",
        closestTrap: "Matching only one hand is insufficient; both hand positions must swap simultaneously.",
        answer: answer.display,
      },
      canonicalTrace: [`validator=${canonical}`],
      verifierTrace: [`twoAngleEqualities=${verifier}`],
      contractEvidence: contract("BOOLEAN", "CP013_PROPOSED_PAIR_VALIDATION_ORACLE", [originalText, proposedText, "exactly interchanged"]),
    };
  }

  const correct = pairAnswer(selected.originalSeconds, selected.candidateSeconds);
  const reverseSolved = solveHandInterchangeExact(selected.originalSeconds);
  const verifierAnswer = pairAnswer(selected.originalSeconds, reverseSolved.candidateSeconds);
  const otherPairs = input.rng.shuffle(pairs.filter((pair) => !rationalsEqual(pair.originalSeconds, selected.originalSeconds))).slice(0, 3);
  return {
    taskId: input.taskId,
    stem: "Which listed pair of valid clock times has the property that the hour- and minute-hand positions at one time are exactly interchanged at the other?",
    scenario: { candidatePairCount: 4 },
    answer: correct,
    verifierAnswer,
    distractors: otherPairs.map((pair, index) => ({
      answer: pairAnswer(pair.originalSeconds, addRationals(pair.candidateSeconds, (index + 1) * 60)),
      reasonCode: "PAIR_SECOND_TIME_SHIFTED",
      reason: "The second time is shifted away from the exact swapped-hand position.",
    })),
    explanation: {
      given: "Four candidate time pairs.",
      rule: "For each pair, compare both hour/minute angles crosswise; both must be exactly equal.",
      working: [`Valid pair = ${correct.display}.`],
      validityCheck: "The exact interchange solver reproduces the same second time from the first.",
      closestTrap: "A pair can look numerically related without its physical hand directions being swapped.",
      answer: correct.display,
    },
    canonicalTrace: [`catalogPair=${correct.semanticKey}`],
    verifierTrace: [`forwardSolve=${verifierAnswer.semanticKey}`],
    contractEvidence: contract("TIME_PAIR", "CP013_PAIR_SEARCH_ORACLE", ["listed pair", "exactly interchanged"]),
  };
}

function faultyModelForMixed(input: ClockFamilySolverInput) {
  const direction = input.rng.pick(["GAIN", "LOSS"] as const);
  const errorMinutes = input.rng.pick([8, 10, 12, 15, 20, 24] as const);
  const rate = clockRateFromGainLoss({ direction, errorUnits: errorMinutes * 60, actualPeriodUnits: 86_400 });
  const actualAnchor = clockSeconds(8, 0);
  const displayedAnchor = addRationals(actualAnchor, input.rng.pick([-600, -300, 300, 600] as const));
  const model = affineFaultyClockModel({ actualAnchorSeconds: actualAnchor, displayedAnchorSeconds: displayedAnchor, rateDisplayedPerActual: rate });
  return { direction, errorMinutes, rate, actualAnchor, displayedAnchor, model };
}

function solveCp014(input: ClockFamilySolverInput): SolvedClockPrototype {
  const faulty = faultyModelForMixed(input);

  if (input.taskId === "ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME") {
    const actualElapsedHours = input.rng.pick([6, 12, 18, 24, 30] as const);
    const actual = addRationals(faulty.actualAnchor, actualElapsedHours * 3_600);
    const displayed = addRationals(faulty.displayedAnchor, multiplyRationals(faulty.rate, actualElapsedHours * 3_600));
    const displayedTime = totalSecondsToClockTimeExact(displayed);
    const canonical = hourMinuteAngleSnapshotExact(displayedTime).smallerAngleDeg;
    const cycleAngles = clockTimeToHandAnglesByCycleExact(displayedTime);
    const clockwise = moduloRational(subtractRationals(cycleAngles.minuteAngleDeg, cycleAngles.hourAngleDeg), 360);
    const verifier = compareRationals(clockwise, subtractRationals(360, clockwise)) <= 0 ? clockwise : subtractRationals(360, clockwise);
    const actualText = formatClockTimeFromSeconds(actual, { includeDayOffset: true });
    const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
    const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
    return {
      taskId: input.taskId,
      stem: `At actual time ${actualText}, a clock that was ${formatDurationSeconds(absoluteRational(subtractRationals(faulty.displayedAnchor, faulty.actualAnchor)))} ${compareRationals(faulty.displayedAnchor, faulty.actualAnchor) > 0 ? "ahead" : "behind"} at actual 8:00 and runs at rate ${faulty.rate.numerator}:${faulty.rate.denominator} shows some reading. What smaller angle do its displayed hands form?`,
      scenario: { actualTime: actualText, actualAnchor: "8:00", displayedAnchor: formatClockTimeFromSeconds(faulty.displayedAnchor), rate: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("ANGLE", subtractRationals(360, canonical), formatAngle(subtractRationals(360, canonical))), reasonCode: "REFLEX_INSTEAD_OF_SMALLER", reason: "This selects the reflex angle at the faulty clock's displayed reading." },
        { answer: rationalAnswer("ANGLE", hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(actual)).smallerAngleDeg, formatAngle(hourMinuteAngleSnapshotExact(totalSecondsToClockTimeExact(actual)).smallerAngleDeg)), reasonCode: "ACTUAL_TIME_USED_AS_DISPLAYED_TIME", reason: "This finds the angle at actual time without first converting to the faulty clock's display." },
        { answer: rationalAnswer("ANGLE", cycleAngles.minuteAngleDeg, formatAngle(cycleAngles.minuteAngleDeg)), reasonCode: "MINUTE_HAND_DIRECTION_ONLY", reason: "This reports the displayed minute hand's direction from 12 rather than the angle between the hands." },
      ],
      explanation: {
        given: `Actual target ${actualText}, offset anchor and rate ${faulty.rate.numerator}:${faulty.rate.denominator}.`,
        rule: "First map actual time to displayed time with the affine faulty-clock model; then solve the normal continuous-hand angle at that displayed reading.",
        working: [`Displayed reading = ${formatClockTimeFromSeconds(displayed, { includeDayOffset: true, includeSeconds: true })}.`, `Smaller hand angle = ${answer.display}.`],
        validityCheck: "Independent cycle-derived hand positions at the displayed time give the same angle.",
        closestTrap: "The hands follow the faulty clock's displayed time, not the actual time.",
        answer: answer.display,
      },
      canonicalTrace: [`displayed=${exactKey(displayed)}`, `angle=${exactKey(canonical)}`],
      verifierTrace: [`cycleAngle=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
      contractEvidence: contract("ANGLE", "CP014_FAULTY_DISPLAY_THEN_ANGLE_ORACLE", [actualText, `${faulty.rate.numerator}:${faulty.rate.denominator}`, "smaller angle"]),
    };
  }

  if (input.taskId === "ACTUAL_TIME_OF_FAULTY_HAND_EVENT") {
    const occurrence = input.rng.pick([2, 3, 4, 5] as const);
    const displayedEvent = nthEventAfterExact({
      eventType: "COINCIDENCE",
      anchorSeconds: faulty.displayedAnchor,
      occurrence,
    }).timeSeconds;
    const canonical = actualTimeFromDisplayedExact(faulty.model, displayedEvent);
    const verifier = addRationals(faulty.actualAnchor, divideRationals(subtractRationals(displayedEvent, faulty.displayedAnchor), faulty.rate));
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(verifier, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A faulty clock has displayed:actual rate ${faulty.rate.numerator}:${faulty.rate.denominator}; at actual 8:00 it displays ${formatClockTimeFromSeconds(faulty.displayedAnchor)}. At what actual time will its display reach the ${occurrence}th displayed coincidence after the anchor reading?`,
      scenario: { rate: `${faulty.rate.numerator}:${faulty.rate.denominator}`, actualAnchor: "8:00", displayedAnchor: formatClockTimeFromSeconds(faulty.displayedAnchor), occurrence },
      answer,
      verifierAnswer,
      distractors: absoluteTimeDistractors(canonical),
      explanation: {
        given: `Find the ${occurrence}th exact displayed coincidence strictly after the anchor reading.`,
        rule: "Construct the exact displayed event timestamp, then invert the affine faulty-clock mapping.",
        working: [`Displayed event timestamp = ${formatClockTimeFromSeconds(displayedEvent, { includeDayOffset: true, includeSeconds: true })}.`, `Actual event time = ${answer.display}.`],
        validityCheck: "Forward mapping the answer returns the exact displayed coincidence timestamp.",
        closestTrap: "The normal event recurrence is in displayed time and must be converted to actual time using the clock rate and offset.",
        answer: answer.display,
      },
      canonicalTrace: [`inverseEvent=${exactKey(canonical)}`],
      verifierTrace: [`anchor+(target-D0)/r=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
      contractEvidence: contract("ABSOLUTE_TIME", "CP014_FAULTY_EVENT_INVERSE_ORACLE", [`${occurrence}th displayed coincidence`, `${faulty.rate.numerator}:${faulty.rate.denominator}`, "actual time"]),
    };
  }

  if (input.taskId === "MIRROR_READING_OF_FAULTY_CLOCK") {
    const actualElapsedHours = input.rng.pick([6, 12, 18, 24] as const);
    const actual = addRationals(faulty.actualAnchor, actualElapsedHours * 3_600);
    const displayed = addRationals(faulty.displayedAnchor, multiplyRationals(faulty.rate, actualElapsedHours * 3_600));
    const displayedDial = moduloRational(displayed, 43_200);
    const canonical = mirrorClockSecondsExact(displayedDial);
    const verifier = moduloRational(subtractRationals(43_200, displayedDial), 43_200);
    const actualText = formatClockTimeFromSeconds(actual, { includeDayOffset: true });
    const answer = timeAnswer(canonical);
    const verifierAnswer = timeAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `At actual time ${actualText}, a faulty clock anchored at actual 8:00/displayed ${formatClockTimeFromSeconds(faulty.displayedAnchor)} runs at rate ${faulty.rate.numerator}:${faulty.rate.denominator}. What reading appears in a vertical mirror beside that faulty clock?`,
      scenario: { actualTime: actualText, displayedAnchor: formatClockTimeFromSeconds(faulty.displayedAnchor), rate: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
      answer,
      verifierAnswer,
      distractors: [
        { answer: timeAnswer(displayedDial), reasonCode: "FAULTY_DISPLAY_NOT_MIRRORED", reason: "This stops after finding the faulty clock's display and does not apply the mirror transformation." },
        { answer: timeAnswer(mirrorClockSecondsExact(moduloRational(actual, 43_200))), reasonCode: "ACTUAL_TIME_MIRRORED", reason: "This mirrors actual time rather than the faulty clock's displayed reading." },
        { answer: timeAnswer(addRationals(canonical, 60)), reasonCode: "MIRROR_BORROWING_ERROR", reason: "This introduces a one-minute error in the final 12-hour mirror subtraction." },
      ],
      explanation: {
        given: `Actual target ${actualText}; faulty offset and rate supplied.`,
        rule: "Map actual to displayed time first, reduce to the 12-hour dial, then apply vertical mirror time = 12:00−displayed time.",
        working: [`Faulty displayed reading = ${formatClockTimeFromSeconds(displayedDial, { includeSeconds: true })}.`, `Mirror reading = ${answer.display}.`],
        validityCheck: "Independent arithmetic mirror subtraction gives the same result.",
        closestTrap: "Mirror the faulty display, not the actual time.",
        answer: answer.display,
      },
      canonicalTrace: [`displayedDial=${exactKey(displayedDial)}`, `mirror=${exactKey(canonical)}`],
      verifierTrace: [`43200-displayed=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}`, mirrorGeometryAgreement: validateMirrorTimeGeometryExact(displayedDial).agreement },
      contractEvidence: contract("TIME", "CP014_FAULTY_THEN_MIRROR_ORACLE", [actualText, `${faulty.rate.numerator}:${faulty.rate.denominator}`, "vertical mirror"]),
    };
  }

  if (input.taskId === "STRIKE_EVENT_UNDER_RATE_ERROR") {
    const strikes = input.rng.pick([5, 6, 8, 10, 12] as const);
    const displayedGap = exactRational(input.rng.pick([2, 3, 4, 5, 6] as const));
    const displayedDuration = durationForStrikesExact({ strikes, gapSeconds: displayedGap });
    const canonical = divideRationals(displayedDuration, faulty.rate);
    const zeroModel = affineFaultyClockModel({ rateDisplayedPerActual: faulty.rate });
    const verifier = actualTimeFromDisplayedExact(zeroModel, displayedDuration);
    const answer = rationalAnswer("DURATION", canonical, formatDurationSeconds(canonical));
    const verifierAnswer = rationalAnswer("DURATION", verifier, formatDurationSeconds(verifier));
    return {
      taskId: input.taskId,
      stem: `A faulty clock runs at displayed:actual rate ${faulty.rate.numerator}:${faulty.rate.denominator}. On its own displayed-time mechanism it gives ${strikes} strikes with ${formatDurationSeconds(displayedGap)} of displayed time between consecutive strikes. What actual time elapses from the first strike to the last?`,
      scenario: { rate: `${faulty.rate.numerator}:${faulty.rate.denominator}`, strikes, displayedGap: formatDurationSeconds(displayedGap) },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("DURATION", displayedDuration, formatDurationSeconds(displayedDuration)), reasonCode: "DISPLAYED_STRIKE_DURATION_USED_AS_ACTUAL", reason: "This computes n−1 displayed gaps but does not convert displayed duration to actual duration." },
        { answer: rationalAnswer("DURATION", divideRationals(multiplyRationals(displayedGap, strikes), faulty.rate), formatDurationSeconds(divideRationals(multiplyRationals(displayedGap, strikes), faulty.rate))), reasonCode: "N_STRIKES_TREATED_AS_N_GAPS", reason: "This uses n displayed gaps rather than n−1 before applying the rate conversion." },
        { answer: rationalAnswer("DURATION", multiplyRationals(displayedDuration, faulty.rate), formatDurationSeconds(multiplyRationals(displayedDuration, faulty.rate))), reasonCode: "RATE_MULTIPLIED_INSTEAD_OF_DIVIDED", reason: "This multiplies displayed elapsed time by the rate instead of dividing to recover actual elapsed time." },
      ],
      explanation: {
        given: `${strikes} strikes; displayed gap ${formatDurationSeconds(displayedGap)}; rate ${faulty.rate.numerator}:${faulty.rate.denominator}.`,
        rule: "First use n−1 gaps to obtain displayed duration, then divide by displayed:actual rate.",
        working: [`Displayed duration = ${strikes - 1}×${formatDurationSeconds(displayedGap)} = ${formatDurationSeconds(displayedDuration)}.`, `Actual duration = ${answer.display}.`],
        validityCheck: "The inverse affine elapsed-time mapping returns the same actual duration.",
        closestTrap: "Both conversions matter: strikes to gaps, then displayed time to actual time.",
        answer: answer.display,
      },
      canonicalTrace: [`displayedDuration/r=${exactKey(canonical)}`],
      verifierTrace: [`inverseAffine=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}`, strikeIntervalCount: strikes - 1 },
      contractEvidence: contract("DURATION", "CP014_STRIKE_UNDER_RATE_ORACLE", [`${strikes} strikes`, formatDurationSeconds(displayedGap), `${faulty.rate.numerator}:${faulty.rate.denominator}`]),
    };
  }

  if (input.taskId === "OFFSET_PLUS_RATE_CORRECTION") {
    const displayedTarget = addRationals(faulty.displayedAnchor, multiplyRationals(faulty.rate, input.rng.pick([12, 18, 24, 36] as const) * 3_600));
    const canonical = actualTimeFromDisplayedExact(faulty.model, displayedTarget);
    const verifier = addRationals(faulty.actualAnchor, divideRationals(subtractRationals(displayedTarget, faulty.displayedAnchor), faulty.rate));
    const displayedText = formatClockTimeFromSeconds(displayedTarget, { includeDayOffset: true, includeSeconds: true });
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(verifier, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `At actual 8:00 on day 0 a faulty clock displays ${formatClockTimeFromSeconds(faulty.displayedAnchor)} and then runs at displayed:actual rate ${faulty.rate.numerator}:${faulty.rate.denominator}. When it displays ${displayedText}, what is the actual time?`,
      scenario: { actualAnchor: "8:00 (day +0)", displayedAnchor: formatClockTimeFromSeconds(faulty.displayedAnchor), rate: `${faulty.rate.numerator}:${faulty.rate.denominator}`, displayedTarget: displayedText },
      answer,
      verifierAnswer,
      distractors: absoluteTimeDistractors(canonical),
      explanation: {
        given: "Initial actual/displayed offset, wrong rate and target displayed reading.",
        rule: "Actual target = actual anchor + (displayed target−displayed anchor) ÷ rate.",
        working: [`Actual target = ${answer.display}.`],
        validityCheck: "Forward mapping the answer returns the exact target displayed reading.",
        closestTrap: "Subtract the displayed anchor before dividing; the initial offset is not part of the running-rate interval.",
        answer: answer.display,
      },
      canonicalTrace: [`inverseAffine=${exactKey(canonical)}`],
      verifierTrace: [`A0+(D-D0)/r=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
      contractEvidence: contract("ABSOLUTE_TIME", "CP014_OFFSET_RATE_INVERSE_ORACLE", [formatClockTimeFromSeconds(faulty.displayedAnchor), `${faulty.rate.numerator}:${faulty.rate.denominator}`, displayedText]),
    };
  }

  const actualElapsedHours = input.rng.pick([2, 4, 6] as const);
  const actual = addRationals(faulty.actualAnchor, actualElapsedHours * 3_600);
  const displayedAbsolute = addRationals(
    faulty.displayedAnchor,
    multiplyRationals(faulty.rate, actualElapsedHours * 3_600),
  );
  const displayedDial = moduloRational(displayedAbsolute, 43_200);
  const displayedTime = totalSecondsToClockTimeExact(displayedDial);
  const rendered = renderClockSvg({ hour: displayedTime.hour, minute: displayedTime.minute, second: displayedTime.second, ariaLabel: "Faulty clock displayed-reading question diagram." });
  const verifier = actualTimeFromDisplayedExact(faulty.model, displayedAbsolute);
  const answer = timeAnswer(actual, { absolute: true, includeDayOffset: true, includeSeconds: true });
  const verifierAnswer = timeAnswer(verifier, { absolute: true, includeDayOffset: true, includeSeconds: true });
  return {
    taskId: input.taskId,
    stem: `The attached diagram shows the first occurrence of the faulty clock's displayed dial reading after the stated anchor. At actual 8:00 on day 0 it displayed ${formatClockTimeFromSeconds(faulty.displayedAnchor)} and thereafter ran at displayed:actual rate ${faulty.rate.numerator}:${faulty.rate.denominator}. What is the current actual time?`,
    media: { prompt: makeAsset("CLK-CP014-TEXT-DIAGRAM", "PROMPT_DIAGRAM", rendered, "Faulty clock displayed-reading question diagram.") },
    scenario: { displayedDiagramTime: formatClockTimeFromSeconds(displayedDial), displayedAbsolute: formatClockTimeFromSeconds(displayedAbsolute, { includeDayOffset: true, includeSeconds: true }), actualAnchor: "8:00 (day +0)", displayedAnchor: formatClockTimeFromSeconds(faulty.displayedAnchor), rate: `${faulty.rate.numerator}:${faulty.rate.denominator}` },
    answer,
    verifierAnswer,
    distractors: absoluteTimeDistractors(actual),
    explanation: {
      given: "Displayed reading from the diagram plus an actual/displayed anchor and rate.",
      rule: "Read the diagram to obtain displayed time, then invert the affine faulty-clock model.",
      working: [`Displayed time read from diagram = ${formatClockTimeFromSeconds(displayedDial)}.`, `Actual time = ${answer.display}.`],
      validityCheck: "Independent diagram reconstruction and algebraic inverse mapping give the same actual time.",
      closestTrap: "The diagram gives displayed time, not actual time; the offset and rate correction must still be applied.",
      answer: answer.display,
    },
    canonicalTrace: [`diagramDisplayed=${exactKey(displayedDial)}`, `inverse=${exactKey(actual)}`],
    verifierTrace: [`inverseAbsoluteDisplay=${exactKey(verifier)}`],
    solveTraceExtras: { rateRatio: `${faulty.rate.numerator}:${faulty.rate.denominator}`, rendererFingerprint: rendered.fingerprint },
    contractEvidence: contract("ABSOLUTE_TIME", "CP014_TEXT_DIAGRAM_AFFINE_ORACLE", ["attached diagram", formatClockTimeFromSeconds(faulty.displayedAnchor), `${faulty.rate.numerator}:${faulty.rate.denominator}`]),
  };
}

export function solveVisualAndSynthesisFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (CP011_TASKS.has(input.taskId)) return solveCp011(input);
  if (CP012_TASKS.has(input.taskId)) return solveCp012(input);
  if (CP013_TASKS.has(input.taskId)) return solveCp013(input);
  if (CP014_TASKS.has(input.taskId)) return solveCp014(input);
  return null;
}
