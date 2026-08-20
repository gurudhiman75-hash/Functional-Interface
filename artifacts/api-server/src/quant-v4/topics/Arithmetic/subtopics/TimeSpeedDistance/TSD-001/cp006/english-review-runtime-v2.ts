import {
  absRational,
  add,
  divide,
  modulo,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import { generateCp006EnglishReviewSetV1, type TsdCp006EnglishReviewQuestionV1 } from "./english-review-runtime-v1";
import type { TsdCp006Solution } from "./types";

export type TsdCp006EnglishReviewQuestionV2 = Omit<TsdCp006EnglishReviewQuestionV1, "stem" | "options" | "correctIndex" | "answerText" | "explanation" | "lifecycle"> & Readonly<{
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  explanation: Readonly<{ readonly steps: readonly [string, string] }>;
  presentationVersion: "V2_EXAM_NATURALIZED";
  presentationUnitSystem: "METRE_MINUTE";
  lifecycle: Readonly<{
    englishReviewStatus: "REVIEW_CANDIDATE_V2";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function unitSuffix(solution: TsdCp006Solution): string {
  return ({ HOUR: " minutes", KM: " m", KM_PER_HOUR: " m/min", LAP: " laps", COUNT: "", RATIO: "", NONE: "" } as Record<string, string>)[solution.unit] ?? "";
}

function formatValue(value: Rational, solution: TsdCp006Solution): string {
  return `${toMixedString(value)}${unitSuffix(solution)}`;
}

function formatAnswer(solution: TsdCp006Solution): string {
  if (solution.answerKind === "VALUE" && solution.value) return formatValue(solution.value, solution);
  if (solution.answerKind === "COUNT" && typeof solution.count === "number") return String(solution.count);
  if (solution.answerKind === "LIST" && solution.values) return solution.values.map((value, index) => `${["AB", "AC", "BC"][index] ?? index + 1} = ${formatValue(value, solution)}`).join(", ");
  throw new Error(`${solution.solveMode}: unsupported CP006 V2 answer kind`);
}

function personNames(stem: string): string {
  return stem
    .replaceAll("inspection vehicle A", "Runner A").replaceAll("inspection vehicle B", "Runner B")
    .replaceAll("service cart A", "Athlete A").replaceAll("service cart B", "Athlete B")
    .replaceAll("patrol vehicle A", "Trainee A").replaceAll("patrol vehicle B", "Trainee B")
    .replaceAll("test car A", "Cadet A").replaceAll("test car B", "Cadet B")
    .replaceAll("delivery van A", "Participant A").replaceAll("delivery van B", "Participant B")
    .replaceAll("maintenance vehicle A", "Jogger A").replaceAll("maintenance vehicle B", "Jogger B")
    .replaceAll("Three vehicles", "Three runners")
    .replaceAll("Vehicles A, B and C", "Runners A, B and C")
    .replaceAll("overtakes it", "overtakes the other runner");
}

function metreMinute(text: string): string {
  return text
    .replace(/km\/h/g, "m/min")
    .replace(/\bkm\b/g, "m")
    .replace(/\bhours\b/g, "minutes")
    .replace(/\bhour\b/g, "minute");
}

function naturalizeStem(row: TsdCp006EnglishReviewQuestionV1): string {
  let stem = metreMinute(personNames(row.stem));
  if (row.permanentQlId === "TSD-QL-081") {
    stem = stem.replace(/ Because this position lies close to completing a full lap, .*?relative lap\./, "");
  }
  if (row.permanentQlId === "TSD-QL-082") {
    stem = stem.replace(/—by which time .*? has completed at least one lap—/g, "");
  }
  stem = stem.replace(/\s+,/g, ",").replace(/\s{2,}/g, " ").trim();
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function relativePeriod(row: TsdCp006EnglishReviewQuestionV1, opposite: boolean): Rational {
  const { trackLength: L, speedA: u, speedB: v } = row.input;
  return divide(L!, opposite ? add(u!, v!) : absRational(subtract(u!, v!)));
}

function rationalCandidates(row: TsdCp006EnglishReviewQuestionV1): readonly Rational[] {
  const correct = row.solution.value!;
  const { trackLength: L, speedA: u, speedB: v, speedC: w, timeWindow: t } = row.input;
  switch (row.authorityKey) {
    case "circularFirstMeetingOrOvertakeTime":
      return [correct, relativePeriod(row, false), relativePeriod(row, true), add(correct, relativePeriod(row, row.input.directionB === -1)), multiply(correct, rational(2))];
    case "relativeLapDifferenceAfterTime":
      return [correct, divide(multiply(u!, t!), L!), divide(multiply(v!, t!), L!), divide(multiply(add(u!, v!), t!), L!)];
    case "circularMeetingPointLocation":
      return [correct, subtract(L!, correct), divide(L!, rational(2)), add(correct, L!)];
    case "trackLengthFromCircularMeetingPeriod":
      return [correct, multiply(absRational(subtract(u!, v!)), row.input.observedMeetingTime!), multiply(u!, row.input.observedMeetingTime!), multiply(v!, row.input.observedMeetingTime!)];
    case "runnerSpeedFromCircularEventCount": {
      const oneLapGain = divide(L!, row.input.timeWindow!);
      return [correct, add(v!, oneLapGain), add(v!, multiply(rational(Math.max(1, row.input.observedMeetingCount! - 1)), oneLapGain)), subtract(correct, v!)];
    }
    case "simultaneousReturnToStart": {
      const values = [correct, divide(L!, u!), divide(L!, v!)];
      if (w) values.push(divide(L!, w));
      values.push(relativePeriod(row, row.input.directionB === -1));
      return values;
    }
    case "multiRunnerFirstCommonMeeting": {
      const ab = divide(L!, absRational(subtract(u!, v!)));
      const ac = divide(L!, add(u!, w!));
      const bc = divide(L!, add(v!, w!));
      return [correct, ab, ac, bc];
    }
    case "circularMeetingFromInitialArcGap": {
      const gap = row.input.startPositionB!;
      const relative = subtract(u!, v!);
      return [correct, divide(subtract(L!, gap), relative), divide(gap, u!), divide(gap, v!)];
    }
    case "circularStaggeredStartMeeting": {
      const delay = row.input.startDelayB!;
      return [correct, subtract(correct, delay), delay, add(delay, divide(L!, subtract(v!, u!)))];
    }
    case "circularLapStateAfterTime": {
      if (row.solveMode === "findLocationAfterGivenTime") {
        const travel = multiply(u!, t!);
        const ignoreStart = modulo(row.input.directionA === -1 ? subtract(L!, modulo(travel, L!)) : travel, L!);
        return [correct, ignoreStart, subtract(L!, correct), modulo(add(row.input.startPositionA!, travel), L!)];
      }
      return [correct, add(correct, rational(1)), subtract(correct, rational(1)), divide(multiply(u!, t!), L!)];
    }
    default:
      return [correct, add(correct, rational(1)), subtract(correct, rational(1)), multiply(correct, rational(2))];
  }
}

function distinctRationals(values: readonly Rational[]): Rational[] {
  const seen = new Set<string>();
  const result: Rational[] = [];
  for (const value of values) {
    if (value.numerator < 0n) continue;
    const key = `${value.numerator}/${value.denominator}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function listOptions(row: TsdCp006EnglishReviewQuestionV1): string[] {
  const values = row.solution.values!;
  const render = (ordered: readonly Rational[]) => ordered.map((value, index) => `${["AB", "AC", "BC"][index]} = ${formatValue(value, row.solution)}`).join(", ");
  return [
    render(values),
    render([values[0]!, values[2]!, values[1]!]),
    render([values[1]!, values[0]!, values[2]!]),
    render(values.map((value) => add(value, rational(1)))),
  ];
}

function countOptions(row: TsdCp006EnglishReviewQuestionV1): string[] {
  const c = row.solution.count!;
  const raw = row.authorityKey === "distinctCircularMeetingPointCount"
    ? [c, 1, c + 1, Math.max(0, c - 1), c * 2]
    : [c, Math.max(0, c - 1), c + 1, c + 2];
  return [...new Set(raw.map(String))];
}

function makeOptions(row: TsdCp006EnglishReviewQuestionV1): { options: readonly string[]; correctIndex: number; answerText: string } {
  const answerText = formatAnswer(row.solution);
  let authorityCandidates: string[];
  if (row.solution.answerKind === "LIST") authorityCandidates = listOptions(row);
  else if (row.solution.answerKind === "COUNT") authorityCandidates = countOptions(row);
  else authorityCandidates = distinctRationals(rationalCandidates(row)).map((value) => formatValue(value, row.solution));

  const unique: string[] = [];
  const seen = new Set<string>();
  const addOption = (candidate: string) => {
    if (!candidate || seen.has(candidate)) return;
    seen.add(candidate);
    unique.push(candidate);
  };

  // Keep the exact answer first in the unshuffled pool, then preserve the strongest authority-specific misconceptions.
  addOption(answerText);
  for (const candidate of authorityCandidates) addOption(candidate);

  // Some mathematically meaningful misconceptions coincide for special ratios. Fill only after exhausting those,
  // and keep filling until the rendered option strings themselves are genuinely unique.
  for (let delta = 1; unique.length < 4 && delta <= 64; delta += 1) {
    if (row.solution.answerKind === "COUNT") {
      const c = row.solution.count!;
      addOption(String(c + delta));
      if (c - delta >= 0) addOption(String(c - delta));
      continue;
    }
    if (row.solution.answerKind === "LIST" && row.solution.values) {
      const shifted = row.solution.values.map((value) => add(value, rational(delta)));
      addOption(shifted.map((value, index) => `${["AB", "AC", "BC"][index] ?? index + 1} = ${formatValue(value, row.solution)}`).join(", "));
      continue;
    }
    if (row.solution.value) {
      addOption(formatValue(add(row.solution.value, rational(delta)), row.solution));
      const lower = subtract(row.solution.value, rational(delta));
      if (lower.numerator >= 0n) addOption(formatValue(lower, row.solution));
    }
  }

  if (unique.length < 4) throw new Error(`${row.permanentQlId}/${row.seed}: V2 could not create four unique rendered options`);
  const raw = unique.slice(0, 4);
  const order = [0, 1, 2, 3];
  let state = hash(`${row.seed}:v2-options`) || 1;
  for (let i = 3; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const options = Object.freeze(order.map((index) => raw[index]!));
  return { options, correctIndex: options.indexOf(answerText), answerText };
}

function editorialSteps(row: TsdCp006EnglishReviewQuestionV1): readonly [string, string] {
  if (row.authorityKey === "multiRunnerPairwiseMeetingSchedule") {
    const L = row.input.trackLength!, u = row.input.speedA!, v = row.input.speedB!, w = row.input.speedC!;
    const ab = divide(L, absRational(subtract(u, v)));
    const ac = divide(L, add(u, w));
    const bc = divide(L, add(v, w));
    return [
      `For AB use their speed difference; for AC and BC use the speed sums because C moves oppositely. The three periods are ${toMixedString(ab)}, ${toMixedString(ac)} and ${toMixedString(bc)} minutes.`,
      `So, in AB–AC–BC order, the required schedule is ${formatAnswer(row.solution)}.`,
    ];
  }
  if (row.authorityKey === "distinctCircularMeetingPointCount") {
    const period = relativePeriod(row, true);
    const shift = modulo(multiply(row.input.speedA!, period), row.input.trackLength!);
    return [
      `They meet every ${toMixedString(period)} minutes. In one such period A advances ${toMixedString(shift)} m around the track, so each new meeting shifts the point by that amount.`,
      `Repeating this shift modulo the full ${toMixedString(row.input.trackLength!)} m track returns to the first point after ${formatAnswer(row.solution)} distinct locations.`,
    ];
  }
  return row.explanation.steps.map((step) => metreMinute(step)) as unknown as readonly [string, string];
}

export function generateCp006EnglishReviewSetV2(): readonly TsdCp006EnglishReviewQuestionV2[] {
  return Object.freeze(generateCp006EnglishReviewSetV1(6).map((row) => {
    const { options, correctIndex, answerText } = makeOptions(row);
    if (correctIndex < 0) throw new Error(`${row.permanentQlId}/${row.seed}: V2 answer missing from options`);
    return Object.freeze({
      ...row,
      stem: naturalizeStem(row),
      options,
      correctIndex,
      answerText,
      explanation: Object.freeze({ steps: Object.freeze(editorialSteps(row)) as readonly [string, string] }),
      presentationVersion: "V2_EXAM_NATURALIZED" as const,
      presentationUnitSystem: "METRE_MINUTE" as const,
      lifecycle: Object.freeze({
        englishReviewStatus: "REVIEW_CANDIDATE_V2" as const,
        englishFreezeStatus: "UNFROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    });
  }));
}
