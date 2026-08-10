import type { ClockTaskId } from "./catalog";
import { CLOCK_DIFFICULTY_AUDIT } from "./difficulty-governance";
import { CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION } from "./exam-natural-governance";
import type { SolvedClockPrototype } from "./solver-types";
import type { ClockDifficulty, ClockSemanticAnswer } from "./types";

export type ClockItemDifficultyFactor =
  | "BASE_SEMANTIC_CLUSTER"
  | "FRACTIONAL_ANSWER"
  | "HIGH_DENOMINATOR_FRACTION"
  | "MULTIPLE_EXACT_ANSWERS"
  | "SECONDS_IN_STEM"
  | "ABSOLUTE_DAY_OFFSET"
  | "OPTION_DIAGRAM_SELECTION"
  | "PROMPT_DIAGRAM_INTERPRETATION"
  | "INVERSE_QUERY"
  | "MULTI_CLOCK"
  | "MULTI_STAGE_SYNTHESIS"
  | "ADVANCED_HOLD_SENTINEL"
  | "INTERNAL_ONLY_SENTINEL";

export interface ClockItemDifficultyAudit {
  taskId: ClockTaskId;
  baselineScore: number;
  itemScore: number;
  difficulty: ClockDifficulty;
  factors: readonly ClockItemDifficultyFactor[];
  rationale: readonly string[];
  provisional: true;
  humanCalibrationRequired: true;
}

const INVERSE_TASKS = new Set<ClockTaskId>([
  "HAND_DURATION_FROM_ANGLE",
  "ONE_TIME_FOR_ANGLE_IN_HOUR",
  "ALL_TIMES_FOR_ANGLE_IN_HOUR",
  "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE",
  "NEXT_PREVIOUS_ANGLE_EVENT",
  "ACTUAL_FROM_DISPLAYED_ELAPSED",
  "ACTUAL_DURATION_FROM_READING_CHANGE",
  "DERIVE_RATE_FROM_OBSERVATIONS",
  "DERIVE_SET_RIGHT_TIME",
  "MULTIDAY_ACTUAL_FROM_DISPLAY",
  "TIME_WHEN_ERROR_REACHES_TARGET",
  "NEXT_CORRECT_READING",
  "GAINING_AND_LOSING_EQUALITY",
  "MISSING_GAIN_LOSS_FROM_FINAL",
  "GAIN_FROM_COINCIDENCE_INTERVAL",
  "LOSS_FROM_COINCIDENCE_INTERVAL",
  "ACTUAL_FROM_MIRROR",
  "ORIGINAL_FROM_INTERCHANGED",
]);

const MULTI_CLOCK_TASKS = new Set<ClockTaskId>([
  "COMPARE_TWO_FAULTY_CLOCKS",
  "GAINING_AND_LOSING_EQUALITY",
]);

const SYNTHESIS_TASKS = new Set<ClockTaskId>([
  "ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME",
  "ACTUAL_TIME_OF_FAULTY_HAND_EVENT",
  "MIRROR_READING_OF_FAULTY_CLOCK",
  "STRIKE_EVENT_UNDER_RATE_ERROR",
  "TEXT_DIAGRAM_SYNTHESIS",
]);

function exactDenominators(answer: ClockSemanticAnswer): bigint[] {
  const values: bigint[] = [];
  if (answer.exactValue) values.push(BigInt(answer.exactValue.denominator));
  for (const value of answer.values ?? []) values.push(BigInt(value.denominator));
  return values;
}

function hasFractionalAnswer(answer: ClockSemanticAnswer): boolean {
  return exactDenominators(answer).some((denominator) => denominator !== 1n);
}

function hasHighDenominator(answer: ClockSemanticAnswer): boolean {
  return exactDenominators(answer).some((denominator) => denominator > 12n);
}

function hasMultipleAnswers(answer: ClockSemanticAnswer): boolean {
  return (answer.kind === "TIME_SET" || answer.kind === "TIME_PAIR") && (answer.values?.length ?? 0) > 1;
}

function hasExplicitSeconds(stem: string): boolean {
  return /\b(?:1[0-2]|[1-9]):\d{2}:\d{2}\b/.test(stem) || /\bseconds?\b/i.test(stem);
}

function hasNonzeroDayOffset(solved: SolvedClockPrototype): boolean {
  const text = [
    solved.stem,
    solved.answer.display,
    ...solved.distractors.map((value) => value.answer.display),
    ...Object.values(solved.scenario).flatMap((value) => Array.isArray(value) ? value : [value]),
  ].filter((value): value is string => typeof value === "string").join(" ");
  return /\b(?:day|days) (?:later|earlier)\b/i.test(text);
}

function bandForScore(score: number): ClockDifficulty {
  if (score <= 2) return "FOUNDATION";
  if (score <= 4) return "STANDARD";
  return "ADVANCED";
}

export function auditClockItemDifficulty(
  taskId: ClockTaskId,
  solved: SolvedClockPrototype,
): ClockItemDifficultyAudit {
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId].disposition;
  const baseline = CLOCK_DIFFICULTY_AUDIT[taskId];
  const factors: ClockItemDifficultyFactor[] = ["BASE_SEMANTIC_CLUSTER"];
  const rationale: string[] = [baseline.rationale];

  if (disposition === "INTERNAL_VERIFICATION_ONLY") {
    return {
      taskId,
      baselineScore: baseline.semanticScore,
      itemScore: 99,
      difficulty: "ADVANCED",
      factors: ["INTERNAL_ONLY_SENTINEL"],
      rationale: ["Internal verification metadata has no learner difficulty; ADVANCED is a non-release sentinel."],
      provisional: true,
      humanCalibrationRequired: true,
    };
  }
  if (disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    return {
      taskId,
      baselineScore: baseline.semanticScore,
      itemScore: 99,
      difficulty: "ADVANCED",
      factors: ["ADVANCED_HOLD_SENTINEL"],
      rationale: ["Held sparse-source/advanced candidate is not assigned a core learner band until source and editorial approval."],
      provisional: true,
      humanCalibrationRequired: true,
    };
  }

  let score = baseline.semanticScore;

  if (hasFractionalAnswer(solved.answer)) {
    score += 1;
    factors.push("FRACTIONAL_ANSWER");
    rationale.push("The exact learner answer contains a non-integer rational value.");
  }
  if (hasHighDenominator(solved.answer)) {
    score += 1;
    factors.push("HIGH_DENOMINATOR_FRACTION");
    rationale.push("The exact answer has a denominator above 12, increasing arithmetic/reading load.");
  }
  if (hasMultipleAnswers(solved.answer)) {
    score += 1;
    factors.push("MULTIPLE_EXACT_ANSWERS");
    rationale.push("The query requires retaining and ordering more than one exact valid answer.");
  }
  if (hasExplicitSeconds(solved.stem)) {
    score += 1;
    factors.push("SECONDS_IN_STEM");
    rationale.push("Seconds are explicit in the learner givens rather than being hidden implementation precision.");
  }
  if (hasNonzeroDayOffset(solved)) {
    score += 1;
    factors.push("ABSOLUTE_DAY_OFFSET");
    rationale.push("The item crosses a civil-day boundary and must preserve absolute-time semantics.");
  }
  if ((solved.media?.options?.length ?? 0) > 0) {
    score += 1;
    factors.push("OPTION_DIAGRAM_SELECTION");
    rationale.push("The learner must compare rendered option diagrams rather than only symbolic values.");
  } else if (solved.media?.prompt) {
    factors.push("PROMPT_DIAGRAM_INTERPRETATION");
    rationale.push("The item requires visual interpretation of an exact prompt diagram.");
  }
  if (INVERSE_TASKS.has(taskId) && !baseline.features.includes("INVERSE_RELATION")) {
    score += 1;
    factors.push("INVERSE_QUERY");
    rationale.push("The task asks for the inverse direction of an otherwise direct relation.");
  }
  if (MULTI_CLOCK_TASKS.has(taskId)) {
    score += 1;
    factors.push("MULTI_CLOCK");
    rationale.push("Two independent clock states/rates must be compared at a common actual instant.");
  }
  if (SYNTHESIS_TASKS.has(taskId)) {
    score += 2;
    factors.push("MULTI_STAGE_SYNTHESIS");
    rationale.push("The item composes more than one clock authority before the final answer can be obtained.");
  }

  return {
    taskId,
    baselineScore: baseline.semanticScore,
    itemScore: score,
    difficulty: bandForScore(score),
    factors,
    rationale,
    provisional: true,
    humanCalibrationRequired: true,
  };
}

export const CLOCK_ITEM_DIFFICULTY_POLICY = {
  status: "PROVISIONAL_ITEM_LEVEL_DIFFICULTY_CALIBRATION",
  semanticBaselineRequired: true,
  generatedItemFeaturesRequired: true,
  checkpointOrderUsedAsDifficultyProxy: false,
  humanCalibrationRequired: true,
  permanentQlAllocationAllowed: false,
} as const;
