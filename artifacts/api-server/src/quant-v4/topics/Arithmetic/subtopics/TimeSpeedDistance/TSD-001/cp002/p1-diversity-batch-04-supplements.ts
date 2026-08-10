import { questionLanguageId, reopenedEditorialLifecycle } from "../editorial-contract";
import { CP002_KEY_RULE, CP002_TEACHING_LEADS } from "./cases";
import { authoritySubmode } from "./editorial-authority-audit";
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
  | "unknownTimeShareFromAverageSpeed"
  | "timeRatioFromAverageAndSpeeds"
  | "averageSpeedFromSegments"
  | "segmentAllocationFromTotalsAndSpeeds"
  | "compareSegmentedJourneyPlans";

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

const speed = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "SPEED", value: f(n, d) });
const distance = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "DISTANCE", value: f(n, d) });
const percent = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "PERCENT", value: f(n, d) });
const ratio = (n: number, d = 1): TsdCp002Solution =>
  Object.freeze({ answerKind: "RATIO", value: f(n, d) });
const choice = (
  value: "Plan A" | "Plan B" | "Both plans have the same average speed",
): TsdCp002Solution => Object.freeze({ answerKind: "CHOICE", value });
const insufficient = (): TsdCp002Solution =>
  Object.freeze({ answerKind: "CLASSIFICATION", value: "INDETERMINATE" });
const wrong = (
  solution: TsdCp002Solution,
  misconceptionId: string,
  reason: string,
): WrongSeed => Object.freeze({ solution, misconceptionId, reason });

const DEFINITIONS: readonly Definition[] = Object.freeze([
  Object.freeze({
    authorityKey: "unknownTimeShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "p1-b04:time-share:37.5:0",
    representation: "TIME_SHARE_FIELD_LOG_37_5_PERCENT",
    stem: "A service vehicle operates at 42 km/h for part of its travelling time and at 98 km/h for the rest. If its time-weighted average speed is 77 km/h, what percentage of the total time is spent at 42 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(42),
      secondSpeedKmph: f(98),
      overallAverageKmph: f(77),
      shareKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      wrong(percent(50), "ASSUME_EQUAL_TIME_SHARE", "This assumes equal time at both speeds, which would give an average of 70 km/h rather than 77 km/h."),
      wrong(percent(125, 2), "USE_COMPLEMENTARY_TIME_SHARE", "This selects the time share at 98 km/h instead of the requested share at 42 km/h."),
      wrong(percent(25), "COPY_EXISTING_QUARTER_SHARE_PATTERN", "This reuses a familiar quarter-share pattern without satisfying the stated weighted average."),
    ]),
  }),
  Object.freeze({
    authorityKey: "timeRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "p1-b04:time-ratio:5:3:1",
    representation: "TIME_RATIO_OPERATING_LOG_5_TO_3",
    stem: "A machine carrier moves at 42 km/h and 98 km/h for different periods. If its time-weighted average speed is 63 km/h, what is the ratio of the time spent at 42 km/h to the time spent at 98 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(42),
      secondSpeedKmph: f(98),
      overallAverageKmph: f(63),
      ratioKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      wrong(ratio(3, 5), "REVERSE_REQUESTED_TIME_RATIO", "This reverses the requested lower-speed to higher-speed time order."),
      wrong(ratio(2, 1), "COPY_SPEED_GAP_AS_RATIO", "This turns the speed values into an unsupported simple ratio instead of balancing the average."),
      wrong(ratio(1, 2), "INVERT_WEIGHTED_DEVIATIONS", "This inverts the deviations from the average and does not reconstruct 63 km/h."),
    ]),
  }),
  Object.freeze({
    authorityKey: "averageSpeedFromSegments",
    provisionalAuthorityId: "TSD-CP002-DISC-001",
    legacyQlId: "TSD-QL-024",
    seed: "p1-b04:average-speed:equal-time:63:2",
    representation: "EQUAL_TIME_TWO_SEGMENT_63",
    stem: "A field survey vehicle travels for 2 hours at 42 km/h and then for another 2 hours at 84 km/h. What is its average speed over the complete journey?",
    input: Object.freeze({
      mode: "averageSpeedFromSegments",
      segments: Object.freeze([
        Object.freeze({ distanceKm: f(84), speedKmph: f(42) }),
        Object.freeze({ distanceKm: f(168), speedKmph: f(84) }),
      ]),
    }),
    wrongOptions: Object.freeze([
      wrong(speed(56), "USE_EQUAL_DISTANCE_HARMONIC_MEAN", "This applies the equal-distance harmonic mean even though the two travelling times are equal."),
      wrong(speed(42), "COPY_FIRST_SEGMENT_SPEED", "This ignores the second segment and copies only the first speed."),
      wrong(speed(84), "COPY_SECOND_SEGMENT_SPEED", "This ignores the first segment and copies only the second speed."),
    ]),
  }),
  Object.freeze({
    authorityKey: "segmentAllocationFromTotalsAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-011",
    legacyQlId: "TSD-QL-034",
    seed: "p1-b04:allocation:first-distance:67.5:3",
    representation: "FIRST_DISTANCE_TWO_SPEED_SYSTEM_67_5",
    stem: "A transport vehicle covers 255 km in 4 hours, travelling at 45 km/h for part of the time and at 75 km/h for the rest. How many kilometres are covered at 45 km/h?",
    input: Object.freeze({
      mode: "segmentAllocationFromTotalsAndSpeeds",
      totalDistanceKm: f(255),
      totalTimeHours: f(4),
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(75),
      requested: "FIRST_DISTANCE",
    }),
    wrongOptions: Object.freeze([
      wrong(distance(255, 2), "ASSUME_EQUAL_DISTANCE_SPLIT", "This divides the total distance equally without satisfying the four-hour time equation."),
      wrong(distance(180), "USE_FIRST_SPEED_FOR_ALL_TIME", "This assumes all four hours were travelled at 45 km/h."),
      wrong(distance(75), "COPY_HIGHER_SPEED_AS_DISTANCE", "This copies a speed value as a distance and does not satisfy both journey totals."),
    ]),
  }),
  Object.freeze({
    authorityKey: "compareSegmentedJourneyPlans",
    provisionalAuthorityId: "TSD-CP002-DISC-014",
    legacyQlId: "TSD-QL-037",
    seed: "p1-b04:compare-plans:two-ledgers:4",
    representation: "TWO_MULTI_SEGMENT_ROUTE_LEDGERS",
    stem: "Plan A covers 84 km at 42 km/h and then 126 km at 63 km/h. Plan B covers 96 km at 48 km/h and then 144 km at 72 km/h. Which plan has the higher average speed?",
    input: Object.freeze({
      mode: "compareSegmentedJourneyPlans",
      planA: Object.freeze([
        Object.freeze({ distanceKm: f(84), speedKmph: f(42) }),
        Object.freeze({ distanceKm: f(126), speedKmph: f(63) }),
      ]),
      planB: Object.freeze([
        Object.freeze({ distanceKm: f(96), speedKmph: f(48) }),
        Object.freeze({ distanceKm: f(144), speedKmph: f(72) }),
      ]),
    }),
    wrongOptions: Object.freeze([
      wrong(choice("Plan A"), "CHOOSE_PLAN_A_FROM_FIRST_LEG", "This favours Plan A from an isolated leg instead of comparing both complete route averages."),
      wrong(choice("Both plans have the same average speed"), "DECLARE_FALSE_PLAN_TIE", "The two complete distance-to-time ratios are different, so the plans do not tie."),
      wrong(insufficient(), "CLAIM_PLAN_DATA_INSUFFICIENT", "Both plans provide every segment distance and speed needed to calculate their averages."),
    ]),
  }),
]);

function mathJax(stem: string): string {
  return stem.replace(/(\d+(?:\.\d+)?)\s+(km\/h|km|hours?)/g, "\\($1\\,\\text{$2}\\)");
}

function buildOptions(
  definition: Definition,
  solution: TsdCp002Solution,
): {
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
  const semanticKeys = [correctText, ...wrongEntries.map((entry) => entry.text)]
    .map(semanticCp002OptionKey);
  if (new Set(semanticKeys).size !== 4) {
    throw new Error(`${definition.seed}: semantic option collision`);
  }

  const correctIndex = cp002CorrectIndex(definition.provisionalAuthorityId, definition.seed);
  const entries = wrongEntries.map((entry) => ({ ...entry, isCorrect: false }));
  entries.splice(correctIndex, 0, {
    text: correctText,
    misconceptionId: "CORRECT",
    reason: "This result satisfies the complete weighted-distance and travelling-time relation.",
    isCorrect: true,
  });

  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map((entry) => Object.freeze({
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
    }))),
    analysis: Object.freeze(entries.map((entry, index) => Object.freeze({
      option: LABELS[index],
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
      reason: `${entry.text}: ${entry.reason}`,
    }))),
    correctIndex,
  });
}

function build(definition: Definition): TsdCp002GeneratedQuestion {
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) {
    throw new Error(`${definition.seed}: ${verification.errors.join("; ")}`);
  }

  const options = buildOptions(definition, solution);
  const answerText = formatCp002Solution(solution);
  const working = cp002WorkingLines(definition.input, solution, []);
  const mode = definition.input.mode;
  const submode = authoritySubmode(definition.input);
  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: definition.provisionalAuthorityId,
    permanentQlId: definition.legacyQlId,
    questionLanguageId: questionLanguageId("TSD-CP-002", definition.authorityKey, definition.seed),
    solveMode: mode,
    authoritySubmode: submode,
    language: "en" as const,
    seed: definition.seed,
    representation: definition.representation,
    difficulty: cp002Difficulty(mode, definition.input),
    stem: definition.stem,
    stemMathJax: mathJax(definition.stem),
    input: definition.input,
    solution,
    answerText,
    options: options.options,
    optionAudit: options.audit,
    correctIndex: options.correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[mode],
      stepByStepSolution: Object.freeze([
        CP002_TEACHING_LEADS[mode][1],
        ...working,
        `Therefore, the answer is ${answerText}.`,
      ]),
      examSpeedShortcut: cp002Shortcut(
        definition.input,
        "⚡ Exam Speed Trick: Reconstruct the complete weighted journey before selecting an option.",
      ),
      optionAnalysis: options.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint:
      `P1-BATCH-04|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };

  const errors: string[] = [];
  if (base.options[base.correctIndex] !== base.answerText) errors.push("Answer key mismatch");
  if (new Set(base.options.map(semanticCp002OptionKey)).size !== 4) {
    errors.push("Semantic option uniqueness failed");
  }
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");
  if (!base.stemMathJax.includes("\\(")) errors.push("Stem MathJax is missing");

  return Object.freeze({
    ...base,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

export function generateP1DiversityBatch04Cp002Supplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(build));
}
