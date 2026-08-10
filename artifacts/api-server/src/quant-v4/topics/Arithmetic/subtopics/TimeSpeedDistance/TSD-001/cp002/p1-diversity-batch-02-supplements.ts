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

type Batch02AuthorityKey =
  | "unknownDistanceShareFromAverageSpeed"
  | "distanceRatioFromAverageAndSpeeds";

interface WrongSeed {
  readonly solution: TsdCp002Solution;
  readonly misconceptionId: string;
  readonly reason: string;
}

interface Batch02Definition {
  readonly authorityKey: Batch02AuthorityKey;
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly legacyQlId: `TSD-QL-${string}`;
  readonly seed: string;
  readonly representation: string;
  readonly authoritySubmode: TsdCp002GeneratedQuestion["authoritySubmode"];
  readonly stem: string;
  readonly input: TsdCp002Input;
  readonly wrongOptions: readonly [WrongSeed, WrongSeed, WrongSeed];
}

const percent = (value: number): TsdCp002Solution =>
  Object.freeze({ answerKind: "PERCENT", value: f(value) });

const ratio = (first: number, second: number): TsdCp002Solution =>
  Object.freeze({ answerKind: "RATIO", value: f(first, second) });

const DEFINITIONS: readonly Batch02Definition[] = Object.freeze([
  Object.freeze({
    authorityKey: "unknownDistanceShareFromAverageSpeed",
    provisionalAuthorityId: "TSD-CP002-DISC-006",
    legacyQlId: "TSD-QL-029",
    seed: "supplement:distance-share:0",
    representation: "DISTANCE_SHARE_SUPPLEMENTAL_60_PERCENT",
    authoritySubmode: "DISTANCE_SHARE",
    stem: "A delivery van covers part of a route at 45 km/h and the remainder at 95 km/h. If its overall average speed is 57 km/h, what percentage of the distance is covered at 45 km/h?",
    input: Object.freeze({
      mode: "unknownSegmentShareFromAverage",
      firstSpeedKmph: f(45),
      secondSpeedKmph: f(95),
      overallAverageKmph: f(57),
      shareKind: "DISTANCE",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({
        solution: percent(40),
        misconceptionId: "USE_COMPLEMENTARY_DISTANCE_SHARE",
        reason: "This gives the distance share at 95 km/h rather than the requested share at 45 km/h.",
      }),
      Object.freeze({
        solution: percent(50),
        misconceptionId: "ASSUME_EQUAL_DISTANCE",
        reason: "This assumes the two distance portions are equal, which would not produce an average of 57 km/h.",
      }),
      Object.freeze({
        solution: percent(57),
        misconceptionId: "COPY_AVERAGE_AS_PERCENT",
        reason: "This copies the average-speed number into a percentage without solving the distance-weighted equation.",
      }),
    ]),
  }),
  Object.freeze({
    authorityKey: "distanceRatioFromAverageAndSpeeds",
    provisionalAuthorityId: "TSD-CP002-DISC-012",
    legacyQlId: "TSD-QL-035",
    seed: "supplement:distance-ratio:1",
    representation: "DISTANCE_RATIO_SUPPLEMENTAL_FOUR_TO_THREE",
    authoritySubmode: "DISTANCE_RATIO",
    stem: "A bus covers two portions of a route at 55 km/h and 90 km/h. If the overall average speed is 66 km/h, what is the ratio of the distances covered at 55 km/h and 90 km/h?",
    input: Object.freeze({
      mode: "segmentRatioFromAverageAndSpeeds",
      firstSpeedKmph: f(55),
      secondSpeedKmph: f(90),
      overallAverageKmph: f(66),
      ratioKind: "DISTANCE",
    }),
    wrongOptions: Object.freeze([
      Object.freeze({
        solution: ratio(3, 4),
        misconceptionId: "REVERSE_REQUESTED_RATIO",
        reason: "This reverses the requested lower-speed to higher-speed distance order.",
      }),
      Object.freeze({
        solution: ratio(11, 18),
        misconceptionId: "COPY_REDUCED_SPEED_RATIO",
        reason: "This copies the reduced speed ratio 55:90 instead of solving the distance-weighted average.",
      }),
      Object.freeze({
        solution: ratio(24, 11),
        misconceptionId: "USE_TIME_RATIO_DEVIATIONS",
        reason: "This is the time ratio obtained from deviations around 66 km/h, not the requested distance ratio.",
      }),
    ]),
  }),
]);

function simpleMathJax(stem: string): string {
  return stem.replace(/(\d+(?:\.\d+)?)\s+km\/h/, "\\($1\\,\\text{km/h}\\)");
}

function buildOptions(
  definition: Batch02Definition,
  solution: TsdCp002Solution,
): {
  options: readonly string[];
  audit: readonly TsdCp002OptionAudit[];
  analysis: readonly TsdCp002OptionAnalysis[];
  correctIndex: number;
} {
  const correctText = formatCp002Solution(solution);
  const wrong = definition.wrongOptions.map((entry) => ({
    text: formatCp002Solution(entry.solution),
    misconceptionId: entry.misconceptionId,
    reason: entry.reason,
  }));

  if (wrong.some((entry) => semanticCp002OptionKey(entry.text) === semanticCp002OptionKey(correctText))) {
    throw new Error(`${definition.seed}: Batch 02 distractor collides with the correct answer`);
  }
  if (new Set(wrong.map((entry) => semanticCp002OptionKey(entry.text))).size !== 3) {
    throw new Error(`${definition.seed}: Batch 02 distractors are semantically duplicated`);
  }

  const correctIndex = cp002CorrectIndex(
    definition.provisionalAuthorityId,
    definition.seed.replace(/\D/g, "") || "0",
  );
  const entries: Array<{
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
    reason: string;
  }> = wrong.map((entry) => ({
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
    audit: Object.freeze(entries.map(({ text, misconceptionId, isCorrect }) =>
      Object.freeze({ text, misconceptionId, isCorrect }))),
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

function buildSupplement(definition: Batch02Definition): TsdCp002GeneratedQuestion {
  const solution = solveCp002(definition.input);
  const verification = verifyCp002Solution(definition.input, solution);
  if (!verification.valid) {
    throw new Error(`${definition.seed}: ${verification.errors.join("; ")}`);
  }

  const optionPackage = buildOptions(definition, solution);
  const mode = definition.input.mode;
  if (mode !== "unknownSegmentShareFromAverage" && mode !== "segmentRatioFromAverageAndSpeeds") {
    throw new Error(`${definition.seed}: unsupported Batch 02 supplemental mode`);
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
    questionLanguageId: questionLanguageId(
      "TSD-CP-002",
      definition.authorityKey,
      definition.seed,
    ),
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
        CP002_TEACHING_LEADS[mode][1],
        ...working,
        `Therefore, the answer is ${answerText}.`,
      ]),
      examSpeedShortcut: cp002Shortcut(
        definition.input,
        "⚡ Exam Speed Trick: Use the governing weighted-average equation.",
      ),
      optionAnalysis: optionPackage.analysis,
      conclusion: `Answer: ${answerText}.`,
    }),
    mathematicalFingerprint:
      `P1-BATCH-02|${definition.authorityKey}|${definition.representation}|${stableStringify(definition.input)}`,
    lifecycle: reopenedEditorialLifecycle(),
    publiclyPublishable: false as const,
  };

  const errors: string[] = [];
  if (base.options.length !== 4 || new Set(base.options.map(semanticCp002OptionKey)).size !== 4) {
    errors.push("Semantic option uniqueness failed");
  }
  if (base.options[base.correctIndex] !== base.answerText) errors.push("Answer key mismatch");
  if (base.explanation.stepByStepSolution.length < 5) errors.push("Explanation is incomplete");
  if (base.explanation.optionAnalysis.some((entry) => !entry.reason.includes(entry.text))) {
    errors.push("Option reason is not value-specific");
  }
  if (
    base.lifecycle.englishFreezeStatus !== "UNFROZEN"
    || base.lifecycle.testEligibility !== "INELIGIBLE"
  ) {
    errors.push("Lifecycle lock failed");
  }

  return Object.freeze({
    ...base,
    validation: Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze([] as string[]),
    }),
  });
}

export function generateP1DiversityBatch02Supplements(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(DEFINITIONS.map(buildSupplement));
}
