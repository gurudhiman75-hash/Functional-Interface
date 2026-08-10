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

type SupplementalAuthorityKey =
  | "unknownTimeShareFromAverageSpeed"
  | "timeRatioFromAverageAndSpeeds"
  | "segmentAllocationFromTotalsAndSpeeds";

interface WrongSeed {
  readonly solution: TsdCp002Solution;
  readonly misconceptionId: string;
  readonly reason: string;
}

interface SupplementalDefinition {
  readonly authorityKey: SupplementalAuthorityKey;
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly legacyQlId: `TSD-QL-${string}`;
  readonly seed: string;
  readonly representation: string;
  readonly authoritySubmode: TsdCp002GeneratedQuestion["authoritySubmode"];
  readonly stem: string;
  readonly input: TsdCp002Input;
  readonly wrongOptions: readonly [WrongSeed, WrongSeed, WrongSeed];
}

const percent = (value: number): TsdCp002Solution => Object.freeze({ answerKind: "PERCENT", value: f(value) });
const ratio = (first: number, second: number): TsdCp002Solution => Object.freeze({ answerKind: "RATIO", value: f(first, second) });
const time = (numerator: number, denominator = 1): TsdCp002Solution => Object.freeze({ answerKind: "TIME", value: f(numerator, denominator) });

const DEFINITIONS: readonly SupplementalDefinition[] = Object.freeze([
  Object.freeze({
    authorityKey: "unknownTimeShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "supplement:time-share:0",
    representation: "TIME_SHARE_SUPPLEMENTAL_50_PERCENT",
    authoritySubmode: "TIME_SHARE",
    stem: "A vehicle travels for part of its total time at 20 km/h and for the remaining time at 80 km/h. If its time-weighted average speed is 50 km/h, what percentage of the time is spent at 20 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(20),
      secondSpeedKmph: f(80),
      overallAverageKmph: f(50),
      shareKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({ solution: percent(25), misconceptionId: "USE_SPEED_RATIO_AS_TIME_SHARE", reason: "This turns the speed relation into a percentage without solving the time-weighted equation." }),
      Object.freeze({ solution: percent(75), misconceptionId: "USE_COMPLEMENTARY_TIME_SHARE", reason: "This gives the faster-speed time share instead of the requested slower-speed share." }),
      Object.freeze({ solution: percent(60), misconceptionId: "USE_SPEED_DIFFERENCE_AS_PERCENT", reason: "This copies the difference between the two speeds as a percentage." }),
    ]),
  }),
  Object.freeze({
    authorityKey: "unknownTimeShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "supplement:time-share:1",
    representation: "TIME_SHARE_SUPPLEMENTAL_25_PERCENT",
    authoritySubmode: "TIME_SHARE",
    stem: "A car travels at 40 km/h for part of its total time and at 100 km/h for the rest. If the time-weighted average speed is 85 km/h, what percentage of the time is spent at 40 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(40),
      secondSpeedKmph: f(100),
      overallAverageKmph: f(85),
      shareKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({ solution: percent(75), misconceptionId: "USE_COMPLEMENTARY_TIME_SHARE", reason: "This gives the time at 100 km/h rather than the requested time at 40 km/h." }),
      Object.freeze({ solution: percent(50), misconceptionId: "ASSUME_EQUAL_TIME", reason: "This assumes both speeds are used for equal times, which would not produce the stated average." }),
      Object.freeze({ solution: percent(85), misconceptionId: "COPY_AVERAGE_AS_PERCENT", reason: "This copies the average-speed number into a percentage without solving for the time share." }),
    ]),
  }),
  Object.freeze({
    authorityKey: "timeRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "supplement:time-ratio:0",
    representation: "TIME_RATIO_SUPPLEMENTAL_EQUAL",
    authoritySubmode: "TIME_RATIO",
    stem: "A vehicle travels at 20 km/h and 80 km/h for different periods. If its time-weighted average speed is 50 km/h, what is the ratio of the time spent at 20 km/h to the time spent at 80 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(20),
      secondSpeedKmph: f(80),
      overallAverageKmph: f(50),
      ratioKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({ solution: ratio(1, 4), misconceptionId: "COPY_SPEED_RATIO", reason: "This copies the speed ratio rather than deriving the time weights around the average." }),
      Object.freeze({ solution: ratio(4, 1), misconceptionId: "REVERSE_SPEED_RATIO", reason: "This reverses the copied speed ratio and still ignores the weighted-average equation." }),
      Object.freeze({ solution: ratio(1, 3), misconceptionId: "USE_ONE_DIFFERENCE_ONLY", reason: "This uses only one side of the deviation from the average." }),
    ]),
  }),
  Object.freeze({
    authorityKey: "timeRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "supplement:time-ratio:1",
    representation: "TIME_RATIO_SUPPLEMENTAL_ONE_TO_THREE",
    authoritySubmode: "TIME_RATIO",
    stem: "A car travels at 40 km/h and 100 km/h for different periods. If its time-weighted average speed is 85 km/h, what is the time ratio at 40 km/h to the time at 100 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(40),
      secondSpeedKmph: f(100),
      overallAverageKmph: f(85),
      ratioKind: "TIME",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({ solution: ratio(3, 1), misconceptionId: "REVERSE_REQUESTED_RATIO", reason: "This reverses the requested lower-speed to higher-speed time order." }),
      Object.freeze({ solution: ratio(2, 3), misconceptionId: "COPY_REDUCED_SPEED_RATIO", reason: "This simplifies the speed ratio rather than solving the time-weighted average." }),
      Object.freeze({ solution: ratio(1, 2), misconceptionId: "USE_INCOMPLETE_DEVIATION", reason: "This uses an incomplete difference from the average and does not reconstruct 85 km/h." }),
    ]),
  }),
  Object.freeze({
    authorityKey: "segmentAllocationFromTotalsAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-011",
    legacyQlId: "TSD-QL-034",
    seed: "supplement:allocation-second-time:0",
    representation: "SECOND_TIME",
    authoritySubmode: "SECOND_TIME",
    stem: "A vehicle covers 180 km in 3 hours, travelling at 40 km/h for part of the time and at 80 km/h for the rest. How long does it travel at 80 km/h?",
    input: Object.freeze({
      mode: "segmentAllocationFromTotalsAndSpeeds",
      totalDistanceKm: f(180),
      totalTimeHours: f(3),
      firstSpeedKmph: f(40),
      secondSpeedKmph: f(80),
      requested: "SECOND_TIME",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({ solution: time(1), misconceptionId: "USE_DISTANCE_DIFFERENCE_AS_TIME", reason: "This does not satisfy both the total-time and total-distance equations." }),
      Object.freeze({ solution: time(2), misconceptionId: "USE_COMPLEMENTARY_UNSOLVED_TIME", reason: "This guesses the complementary duration without solving the simultaneous equations." }),
      Object.freeze({ solution: time(5, 2), misconceptionId: "ASSIGN_EXCESS_TIME_TO_FAST_SEGMENT", reason: "This allocates too much time to the faster segment and produces more than 180 km." }),
    ]),
  }),
]);

function simpleMathJax(stem: string): string {
  return stem.replace(/(\d+(?:\.\d+)?)\s+km\/h/, "\\($1\\,\\text{km/h}\\)");
}

function buildOptions(
  definition: SupplementalDefinition,
  solution: TsdCp002Solution,
): { options: readonly string[]; audit: readonly TsdCp002OptionAudit[]; analysis: readonly TsdCp002OptionAnalysis[]; correctIndex: number } {
  const correctText = formatCp002Solution(solution);
  const wrong = definition.wrongOptions.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    reason: entry.reason,
  }));
  if (wrong.some((entry) => semanticCp002OptionKey(entry.text) === semanticCp002OptionKey(correctText))) {
    throw new Error(`${definition.seed}: supplemental distractor collides with the correct answer`);
  }
  if (new Set(wrong.map((entry) => semanticCp002OptionKey(entry.text))).size !== 3) {
    throw new Error(`${definition.seed}: supplemental distractors are semantically duplicated`);
  }
  const correctIndex = cp002CorrectIndex(definition.provisionalAuthorityId, definition.seed.replace(/\D/g, "") || "0");
  const entries: Array<{ text: string; misconceptionId: string; isCorrect: boolean; reason: string }> = wrong.map((entry) => ({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: false,
    reason: `${entry.text}: ${entry.reason}`,
  }));
  entries.splice(correctIndex, 0, {
    text: correctText,
    misconceptionId: "CORRECT",
    isCorrect: true,
    reason: `${correctText}: this value satisfies the complete governing equation.`,
  });
  return Object.freeze({
    options: Object.freeze(entries.map((entry) => entry.text)),
    audit: Object.freeze(entries.map(({ text, misconceptionId, isCorrect }) => Object.freeze({ text, misconceptionId, isCorrect }))),
    analysis: Object.freeze(entries.map((entry, index) => Object.freeze({
      option: LABELS[index],
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
      reason: entry.reason,
    }))),
    correctIndex,
  });
}

function buildSupplement(definition: SupplementalDefinition): TsdCp002GeneratedQuestion {
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) throw new Error(`${definition.seed}: ${verification.errors.join("; ")}`);
  const optionPackage = buildOptions(definition, solution);
  const mode = definition.input.mode;
  if (mode !== "unknownSegmentShareFromAverage" && mode !== "segmentRatioFromAverageAndSpeeds" && mode !== "segmentAllocationFromTotalsAndSpeeds") {
    throw new Error(`${definition.seed}: unsupported supplemental mode`);
  }
  const working = cp002WorkingLines(definition.input, solution, []);
  const answerText = formatCp002Solution(solution);
  const base = {
    chapterId: "TSD-001" as const,
    checkpointId: "TSD-CP-002" as const,
    archetypeId: "TSD-001" as const,
    canonicalProblemId: "TSD-CP-002" as const,
    provisionalAuthorityId: definition.provisionalAuthorityId,
    permanentQlId: definition.legacyQlId,
    questionLanguageId: questionLanguageId("TSD-CP-002", definition.authorityKey, definition.seed),
    solveMode: mode,
    authoritySubmode: definition.authoritySubmode,
    language: "en" as const,
    seed: definition.seed,
    representation: definition.representation,
    difficulty: cp002Difficulty(mode, definition.input),
    stem: definition.stem,
    stemMathJax: simpleMathJax(definition.stem),
    input: definition.input,
    solution,
    answerText,
    options: optionPackage.options,
    optionAudit: optionPackage.audit,
    correctIndex: optionPackage.correctIndex,
    explanation: Object.freeze({
      keyRule: CP002_KEY_RULE[mode],
      stepByStepSolution: Object.freeze([
        CP002_TEACHING_LEADS[mode][0],
        ...working,
        `Therefore, the answer is ${answerText}.`,
      ]),
      examSpeedShortcut: cp002Shortcut(definition.input, "⚡ Exam Speed Trick: Use the governing weighted-average equation."),
      optionAnalysis: optionPackage.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint: `SUPPLEMENTAL|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };
  const errors: string[] = [];
  if (base.options.length !== 4 || new Set(base.options.map(semanticCp002OptionKey)).size !== 4) errors.push("Semantic option uniqueness failed");
  if (base.options[base.correctIndex] !== base.answerText) errors.push("Answer key mismatch");
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");
  if (base.explanation.optionAnalysis.some((entry) => !entry.reason.includes(entry.text))) errors.push("Option reason is not value-specific");
  if (base.lifecycle.englishFreezeStatus !== "UNFROZEN" || base.lifecycle.testEligibility !== "INELIGIBLE") errors.push("Lifecycle lock failed");
  return Object.freeze({
    ...base,
    validation: Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), warnings: Object.freeze([] as string[]) }),
  });
}

export function generateFinalPoolSupplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(buildSupplement));
}
