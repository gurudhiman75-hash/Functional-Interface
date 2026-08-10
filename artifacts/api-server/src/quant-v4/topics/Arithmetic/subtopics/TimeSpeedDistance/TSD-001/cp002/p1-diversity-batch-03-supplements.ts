import { questionLanguageId, reopenedEditorialLifecycle } from "../editorial-contract";
import { CP002_KEY_RULE, CP002_TEACHING_LEADS } from "./cases";
import {
  cp002CorrectIndex,
  cp002Difficulty,
  cp002Shortcut,
  cp002WorkingLines,
  semanticCp002OptionKey,
} from "./editorial-remodel";
import { f } from "./fraction";
import { formatCp002Solution, stableStringify } from "./runtime";
import { solveCp002 } from "./solver";
import type {
  TsdCp002GeneratedQuestion,
  TsdCp002Input,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
  TsdCp002Solution,
} from "./types";
import { verifyCp002Solution } from "./verifier";

const LABELS = ["A", "B", "C", "D"] as const;

type AuthorityKey =
  | "unknownSegmentSpeedFromAverage"
  | "unknownSegmentTimeFromAverage"
  | "unknownSegmentDistanceFromAverage"
  | "unknownRoundTripLegSpeedFromAverage"
  | "oneWayDistanceFromRoundTripData"
  | "roundTripLegTimeSum"
  | "requiredRemainingSpeedForTargetAverage";

interface WrongSeed {
  readonly solution: TsdCp002Solution;
  readonly misconceptionId: string;
  readonly reason: string;
}

interface Definition {
  readonly authorityKey: AuthorityKey;
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly legacyQlId: `TSD-QL-${string}`;
  readonly seed: string;
  readonly representation: string;
  readonly stem: string;
  readonly input: TsdCp002Input;
  readonly wrongOptions: readonly [WrongSeed, WrongSeed, WrongSeed];
}

const speed = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "SPEED", value: f(n, d) });
const time = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "TIME", value: f(n, d) });
const distance = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "DISTANCE", value: f(n, d) });
const wrong = (solution: TsdCp002Solution, misconceptionId: string, reason: string): WrongSeed => Object.freeze({ solution, misconceptionId, reason });

const DEFINITIONS: readonly Definition[] = Object.freeze([
  Object.freeze({
    authorityKey: "unknownSegmentSpeedFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-003",
    legacyQlId: "TSD-QL-026",
    seed: "p1-b03:unknown-speed:126",
    representation: "INVERSE_SPEED_ROUTE_LEDGER_126",
    stem: "A courier covers the first 84 km of a route at 42 km/h. The remaining 126 km is covered at a constant speed. If the complete-route average is 70 km/h, what is the speed on the remaining part?",
    input: Object.freeze({ mode: "unknownSegmentSpeedFromAverage", knownDistanceKm: f(84), knownSpeedKmph: f(42), unknownDistanceKm: f(126), overallAverageKmph: f(70) }),
    wrongOptions: Object.freeze([
      wrong(speed(70), "COPY_OVERALL_AVERAGE", "This copies the overall average instead of recovering the time left for the second segment."),
      wrong(speed(84), "USE_KNOWN_DISTANCE_AS_SPEED", "This treats the first distance as though it were the missing speed."),
      wrong(speed(105), "AVERAGE_THE_DISTANCE_VALUES", "This averages the two distance values, which does not satisfy the total-time equation."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownSegmentTimeFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-004",
    legacyQlId: "TSD-QL-027",
    seed: "p1-b03:unknown-time:1.5",
    representation: "INVERSE_TIME_TRAVEL_LOG_1_5",
    stem: "A transport log records 96 km completed in 1.5 hours, followed by another 144 km. The average speed for the full 240 km is 80 km/h. How much time was spent on the second part?",
    input: Object.freeze({ mode: "unknownSegmentTimeFromAverage", knownDistanceKm: f(96), knownTimeHours: f(3, 2), unknownDistanceKm: f(144), overallAverageKmph: f(80) }),
    wrongOptions: Object.freeze([
      wrong(time(3), "REPORT_COMPLETE_JOURNEY_TIME", "This is the time for the whole 240 km, not the second part alone."),
      wrong(time(9, 5), "APPLY_AVERAGE_TO_SECOND_DISTANCE_ONLY", "This divides 144 km directly by the overall average and ignores the first segment's effect."),
      wrong(time(5, 2), "SUBTRACT_DISTANCE_INSTEAD_OF_TIME", "This uses an unrelated difference and does not preserve the full-journey time."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownSegmentDistanceFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-005",
    legacyQlId: "TSD-QL-028",
    seed: "p1-b03:unknown-distance:120",
    representation: "INVERSE_DISTANCE_TWO_SPEED_BALANCE_120",
    stem: "A service vehicle travels 72 km at 36 km/h and then continues at 84 km/h. Its average speed over the entire journey is 56 km/h. How far does it travel at 84 km/h?",
    input: Object.freeze({ mode: "unknownSegmentDistanceFromAverage", knownDistanceKm: f(72), knownSpeedKmph: f(36), unknownSpeedKmph: f(84), overallAverageKmph: f(56) }),
    wrongOptions: Object.freeze([
      wrong(distance(72), "ASSUME_EQUAL_DISTANCES", "This assumes equal distances without checking whether the stated average is obtained."),
      wrong(distance(48), "USE_SPEED_DIFFERENCE_AS_DISTANCE", "This turns the speed difference into a distance, which has no valid unit basis."),
      wrong(distance(168), "ADD_GIVEN_DISTANCE_AND_SPEED", "This adds unlike quantities and does not satisfy total distance divided by total time."),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownRoundTripLegSpeedFromAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-007",
    legacyQlId: "TSD-QL-030",
    seed: "p1-b03:roundtrip-speed:84",
    representation: "RETURN_SPEED_HARMONIC_63_72_84",
    stem: "A survey vehicle travels to a site at 63 km/h and returns over the same distance at a different speed. If its average speed for the round trip is 72 km/h, what is the return speed?",
    input: Object.freeze({ mode: "unknownRoundTripLegSpeedFromAverage", knownLegSpeedKmph: f(63), overallAverageKmph: f(72), unknownLeg: "RETURN" }),
    wrongOptions: Object.freeze([
      wrong(speed(72), "COPY_ROUND_TRIP_AVERAGE", "This copies the complete-trip average as the return speed."),
      wrong(speed(81), "USE_ARITHMETIC_MEAN", "This assumes the arithmetic mean of the two speeds is 72 km/h, which is invalid for equal distances."),
      wrong(speed(63), "ASSUME_EQUAL_LEG_SPEEDS", "This repeats the outward speed and would make the round-trip average 63 km/h."),
    ]),
  }),
  Object.freeze({
    authorityKey: "oneWayDistanceFromRoundTripData",
    provisionalAuthorityId: "TSD-CP002-DISC-008",
    legacyQlId: "TSD-QL-031",
    seed: "p1-b03:one-way-distance:144",
    representation: "ROUND_TRIP_SHARED_DISTANCE_144",
    stem: "A technician drives from a depot to a plant at 48 km/h and returns along the same road at 72 km/h. The two-way journey takes 5 hours. What is the one-way distance?",
    input: Object.freeze({ mode: "oneWayDistanceFromRoundTripData", outwardSpeedKmph: f(48), returnSpeedKmph: f(72), totalTimeHours: f(5) }),
    wrongOptions: Object.freeze([
      wrong(distance(300), "ARITHMETIC_MEAN_TIMES_TOTAL_TIME", "This multiplies the total time by the arithmetic mean speed and treats a repeated distance as one continuous leg."),
      wrong(distance(240), "USE_OUTWARD_SPEED_FOR_TOTAL_TIME", "This assigns all 5 hours to the outward speed."),
      wrong(distance(360), "USE_RETURN_SPEED_FOR_TOTAL_TIME", "This assigns all 5 hours to the return speed."),
    ]),
  }),
  Object.freeze({
    authorityKey: "roundTripLegTimeSum",
    provisionalAuthorityId: "TSD-CP002-DISC-009",
    legacyQlId: "TSD-QL-032",
    seed: "p1-b03:roundtrip-time:5",
    representation: "OUTWARD_RETURN_TIME_LEDGER_132",
    stem: "A maintenance team travels 132 km to a station at 44 km/h and comes back at 66 km/h. Find the total travelling time for the complete trip.",
    input: Object.freeze({ mode: "roundTripTimeFromOneWayDistance", oneWayDistanceKm: f(132), outwardSpeedKmph: f(44), returnSpeedKmph: f(66) }),
    wrongOptions: Object.freeze([
      wrong(time(4), "DIVIDE_TWO_WAY_DISTANCE_BY_ARITHMETIC_MEAN", "This uses an arithmetic-mean speed instead of adding the two leg times."),
      wrong(time(3), "OMIT_RETURN_LEG_TIME", "This includes only the outward journey."),
      wrong(time(2), "OMIT_OUTWARD_LEG_TIME", "This includes only the return journey."),
    ]),
  }),
  Object.freeze({
    authorityKey: "requiredRemainingSpeedForTargetAverage",
    provisionalAuthorityId: "TSD-CP002-DISC-013",
    legacyQlId: "TSD-QL-036",
    seed: "p1-b03:target-average:84",
    representation: "TARGET_AVERAGE_TIME_BUDGET_420",
    stem: "A driver must complete 420 km at an overall average of 70 km/h. After covering 168 km, 3 hours have already elapsed. What speed is required for the remaining distance?",
    input: Object.freeze({ mode: "requiredRemainingSpeedForTargetAverage", totalDistanceKm: f(420), completedDistanceKm: f(168), completedTimeHours: f(3), targetAverageKmph: f(70) }),
    wrongOptions: Object.freeze([
      wrong(speed(70), "COPY_TARGET_AVERAGE", "This ignores that the first 168 km used more time than the target pace allows."),
      wrong(speed(56), "COPY_COMPLETED_SEGMENT_SPEED", "This continues at the completed segment's average speed and misses the target."),
      wrong(speed(42), "DIVIDE_REMAINING_DISTANCE_BY_TOTAL_ALLOWED_TIME", "This divides the remaining distance by the full 6-hour allowance instead of the 3 hours left."),
    ]),
  }),
]);

function mathJax(stem: string): string {
  return stem.replace(/(\d+(?:\.\d+)?)\s+(km\/h|km|hours?)/g, "\\($1\\,\\text{$2}\\)");
}

function buildOptions(definition: Definition, solution: TsdCp002Solution): {
  readonly options: readonly string[];
  readonly audit: readonly TsdCp002OptionAudit[];
  readonly analysis: readonly TsdCp002OptionAnalysis[];
  readonly correctIndex: number;
} {
  const correctText = formatCp002Solution(solution);
  const wrongEntries = definition.wrongOptions.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    reason: entry.reason,
  }));
  const keys = [correctText, ...wrongEntries.map((entry) => entry.text)].map(semanticCp002OptionKey);
  if (new Set(keys).size !== 4) throw new Error(`${definition.seed}: semantic option collision`);

  const correctIndex = cp002CorrectIndex(definition.provisionalAuthorityId, definition.seed);
  const entries = wrongEntries.map((entry) => ({ ...entry, isCorrect: false }));
  entries.splice(correctIndex, 0, {
    text: correctText,
    misconceptionId: "CORRECT",
    reason: "This value satisfies the complete total-distance and total-time relation.",
    isCorrect: true,
  });

  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map((entry) => Object.freeze({ text: entry.text, misconceptionId: entry.misconceptionId, isCorrect: entry.isCorrect }))),
    analysis: Object.freeze(entries.map((entry, index) => Object.freeze({
      option: LABELS[index], text: entry.text, misconceptionId: entry.misconceptionId, isCorrect: entry.isCorrect,
      reason: `${entry.text}: ${entry.reason}`,
    }))),
    correctIndex,
  });
}

function build(definition: Definition): TsdCp002GeneratedQuestion {
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) throw new Error(`${definition.seed}: ${verification.errors.join("; ")}`);
  const optionPackage = buildOptions(definition, solution);
  const answerText = formatCp002Solution(solution);
  const working = cp002WorkingLines(definition.input, solution, []);
  const mode = definition.input.mode;
  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: definition.provisionalAuthorityId,
    permanentQlId: definition.legacyQlId,
    questionLanguageId: questionLanguageId("TSD-CP-002", definition.authorityKey, definition.seed),
    solveMode: mode,
    authoritySubmode: "STANDARD" as const,
    language: "en" as const,
    seed: definition.seed,
    representation: definition.representation,
    difficulty: cp002Difficulty(mode, definition.input),
    stem: definition.stem,
    stemMathJax: mathJax(definition.stem),
    input: definition.input,
    solution,
    answerText,
    options: optionPackage.options,
    optionAudit: optionPackage.audit,
    correctIndex: optionPackage.correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[mode],
      stepByStepSolution: Object.freeze([CP002_TEACHING_LEADS[mode][2], ...working, `Therefore, the answer is ${answerText}.`]),
      examSpeedShortcut: cp002Shortcut(definition.input, "⚡ Exam Speed Trick: Reconstruct the complete journey totals before isolating the unknown."),
      optionAnalysis: optionPackage.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint: `P1-BATCH-03|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };
  const errors: string[] = [];
  if (base.options[base.correctIndex] !== base.answerText) errors.push("Answer key mismatch");
  if (new Set(base.options.map(semanticCp002OptionKey)).size !== 4) errors.push("Semantic option uniqueness failed");
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");
  return Object.freeze({ ...base, validation: Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze([] as string[]) }) });
}

export function generateP1DiversityBatch03Supplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(build));
}
