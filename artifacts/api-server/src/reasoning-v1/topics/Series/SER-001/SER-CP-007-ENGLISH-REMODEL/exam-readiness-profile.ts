import type { SerCp007EditorialQuestion } from "./adaptive-review";

export type SerCp007Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SerCp007ReleaseTier =
  | "STANDARD_MOCK"
  | "ADVANCED_PRACTICE"
  | "INTERNAL_REVIEW_ONLY";

export interface SerCp007ExamReadinessProfile {
  readonly difficulty: SerCp007Difficulty;
  readonly releaseTier: SerCp007ReleaseTier;
  readonly standardMockEligible: boolean;
  readonly stateFingerprint: string;
  readonly maximumTermLength: number;
  readonly visibleCharacterLoad: number;
  readonly difficultyReasons: readonly string[];
  readonly releaseReasons: readonly string[];
}

const EASY_RULES = new Set([
  "ALPHABET_COMPLEMENT_CLUSTER",
  "UNIFORM_COLUMN_SHIFTS",
  "FIXED_FRONT_DELETION",
  "FIXED_END_DELETION",
  "CYCLIC_CLUSTER_ROTATION",
  "FULL_REVERSAL_PERMUTATION",
  "REPEATED_BLOCK_GAPS",
  "ALTERNATING_BLOCK_GAPS",
]);

const HARD_RULES = new Set([
  "PROGRESSIVE_COLUMN_SHIFTS",
  "THREE_INTERLEAVED_CLUSTER_ROWS",
  "FOUR_INTERLEAVED_CLUSTER_ROWS",
  "PROGRESSIVE_PREFIX_SUBSTITUTION",
  "PROGRESSIVE_SUFFIX_SUBSTITUTION",
  "MOVING_PATTERN_BOUNDARY",
  "REPEATED_BLOCK_MULTI_GAP_GROUPS",
  "ALTERNATING_BLOCK_MULTI_GAP_GROUPS",
  "NEXT_TWO_INTERLEAVED_ROWS",
]);

const LONG_FORM_RULES = new Set([
  "MARKER_SHIFT_WITH_FIXED_EDGE_TOKEN",
  "MARKER_SHIFT_OVER_PERIODIC_BACKGROUND",
  "PROGRESSIVE_PREFIX_SUBSTITUTION",
  "PROGRESSIVE_SUFFIX_SUBSTITUTION",
  "MOVING_PATTERN_BOUNDARY",
]);

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function visibleSeriesTerms(question: SerCp007EditorialQuestion): readonly string[] {
  const seriesLine = question.stem.split("\n").at(-1) ?? "";
  const terms = seriesLine
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);
  return terms.length > 1 ? terms : question.hiddenState?.canonicalTerms ?? [];
}

function letterLength(value: string): number {
  return [...value].filter((character) => /[A-Za-z]/.test(character)).length;
}

function promoteDifficulty(
  current: SerCp007Difficulty,
  target: SerCp007Difficulty,
): SerCp007Difficulty {
  const order: readonly SerCp007Difficulty[] = ["EASY", "MEDIUM", "HARD"];
  return order.indexOf(target) > order.indexOf(current) ? target : current;
}

export function serCp007StateFingerprint(
  question: SerCp007EditorialQuestion,
): string {
  return `${question.sourceRuleId}:${question.seed}`;
}

export function profileSerCp007Question(
  question: SerCp007EditorialQuestion,
): SerCp007ExamReadinessProfile {
  const terms = visibleSeriesTerms(question);
  const maximumTermLength = Math.max(
    0,
    ...terms.map(letterLength),
    letterLength(question.correctAnswer),
  );
  const visibleCharacterLoad = terms.reduce(
    (sum, term) => sum + letterLength(term),
    0,
  );
  const difficultyReasons: string[] = [];
  const releaseReasons: string[] = [];

  let difficulty: SerCp007Difficulty = EASY_RULES.has(question.sourceRuleId)
    ? "EASY"
    : HARD_RULES.has(question.sourceRuleId)
      ? "HARD"
      : "MEDIUM";

  if (HARD_RULES.has(question.sourceRuleId)) {
    difficultyReasons.push("multi-stage or progressive governing rule");
  } else if (EASY_RULES.has(question.sourceRuleId)) {
    difficultyReasons.push("single familiar exam transformation");
  } else {
    difficultyReasons.push("two-step or mixed-position reasoning");
  }

  if (
    question.taskKind === "NEXT_TWO_TERMS" ||
    question.taskKind === "MISSING_TWO_TERMS" ||
    question.taskKind === "WRONG_AND_REPLACEMENT" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    difficulty = promoteDifficulty(difficulty, "HARD");
    difficultyReasons.push("multiple answers or linked decisions are required");
  } else if (question.taskKind === "PREVIOUS_TERM") {
    difficulty = promoteDifficulty(difficulty, "MEDIUM");
    difficultyReasons.push("the governing rule must be applied backward");
  }

  if (maximumTermLength > 14) {
    difficulty = promoteDifficulty(difficulty, "HARD");
    difficultyReasons.push("long letter groups increase visual tracking load");
  }

  let releaseTier: SerCp007ReleaseTier = "STANDARD_MOCK";
  if (maximumTermLength > 25 || visibleCharacterLoad > 175) {
    releaseTier = "INTERNAL_REVIEW_ONLY";
    releaseReasons.push("visual load exceeds the learner-facing advanced limit");
  } else if (
    maximumTermLength > 14 ||
    visibleCharacterLoad > 105 ||
    (LONG_FORM_RULES.has(question.sourceRuleId) && maximumTermLength > 12)
  ) {
    releaseTier = "ADVANCED_PRACTICE";
    releaseReasons.push("question is valid but too dense for a standard mock slot");
  } else {
    releaseReasons.push("term length and total visual load fit a standard mock");
  }

  return {
    difficulty,
    releaseTier,
    standardMockEligible: releaseTier === "STANDARD_MOCK",
    stateFingerprint: serCp007StateFingerprint(question),
    maximumTermLength,
    visibleCharacterLoad,
    difficultyReasons,
    releaseReasons,
  };
}

export function selectSerCp007StandardMockSet(
  questions: readonly SerCp007EditorialQuestion[],
  requestedCount: number,
): readonly SerCp007EditorialQuestion[] {
  if (!Number.isInteger(requestedCount) || requestedCount < 1) {
    throw new Error("requestedCount must be a positive integer.");
  }

  const ordered = questions
    .map((question) => ({ question, profile: profileSerCp007Question(question) }))
    .filter((entry) => entry.profile.standardMockEligible)
    .sort((left, right) => {
      const leftKey = stableHash(
        `${left.question.temporaryTemplateId}:${left.question.seed}`,
      );
      const rightKey = stableHash(
        `${right.question.temporaryTemplateId}:${right.question.seed}`,
      );
      return leftKey - rightKey;
    });

  const selected: SerCp007EditorialQuestion[] = [];
  const usedStates = new Set<string>();
  const previousTermLimit = Math.max(1, Math.floor(requestedCount * 0.15));
  let previousTerms = 0;

  for (const entry of ordered) {
    if (selected.length >= requestedCount) break;
    if (usedStates.has(entry.profile.stateFingerprint)) continue;
    if (
      entry.question.taskKind === "PREVIOUS_TERM" &&
      previousTerms >= previousTermLimit
    ) {
      continue;
    }
    usedStates.add(entry.profile.stateFingerprint);
    selected.push(entry.question);
    if (entry.question.taskKind === "PREVIOUS_TERM") previousTerms += 1;
  }

  return selected;
}
