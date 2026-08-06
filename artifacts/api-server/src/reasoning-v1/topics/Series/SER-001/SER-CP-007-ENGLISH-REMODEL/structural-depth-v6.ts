import type { SerCp007EditorialQuestion } from "./adaptive-review";

export type SerCp007StructuralBlockerV6 =
  | "ANSWER_ALREADY_VISIBLE"
  | "ANSWER_LEAKAGE_PERIODIC_LAYOUT"
  | "REPEATED_CANONICAL_STATE"
  | "EQUALITY_MATCH_ONLY"
  | "INSUFFICIENT_STRUCTURAL_DEPTH"
  | "UNDERDETERMINED_INSERTION_RULE";

export interface SerCp007StructuralDepthProfileV6 {
  readonly blockers: readonly SerCp007StructuralBlockerV6[];
  readonly warnings: readonly string[];
  readonly passesStructuralDepth: boolean;
  readonly minimumExactPeriod: number | null;
  readonly visibleAnswerOccurrences: number;
  readonly canonicalTermCount: number;
  readonly uniqueCanonicalTermCount: number;
  readonly uniqueCanonicalRatio: number;
  readonly requiresIntendedRuleApplication: boolean;
  readonly determinateRule: boolean;
}

type StructuralQuestion = SerCp007EditorialQuestion & {
  readonly sequence?: readonly (string | null)[];
};

const WHOLE_TERM_TASKS = new Set([
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
  "REPLACE_WRONG_TERM",
  "NEXT_TWO_TERMS",
  "MISSING_TWO_TERMS",
  "WRONG_AND_REPLACEMENT",
]);

const INSERTION_RULES = new Set([
  "CENTER_INSERTION_GROWTH",
  "ALTERNATING_INTERIOR_INSERTION_GROWTH",
]);

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function answerIndexes(question: StructuralQuestion): readonly number[] {
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  return [];
}

function answerTerms(question: StructuralQuestion): readonly string[] {
  const canonicalTerms = question.hiddenState?.canonicalTerms ?? [];
  const indexes = answerIndexes(question);
  if (canonicalTerms.length > 0 && indexes.length > 0) {
    return unique(indexes.map((index) => canonicalTerms[index]!).filter(Boolean));
  }
  if (!WHOLE_TERM_TASKS.has(question.taskKind)) return [];
  if (question.correctAnswer.includes("→")) {
    const replacement = question.correctAnswer.split("→").at(-1)?.trim();
    return replacement ? [replacement] : [];
  }
  return unique(
    question.correctAnswer
      .split(",")
      .map((piece) => piece.trim())
      .filter(Boolean),
  );
}

function visibleTerms(question: StructuralQuestion): readonly string[] {
  if (question.sequence) {
    return question.sequence.filter((term): term is string => Boolean(term));
  }
  const line = question.stem.split("\n").at(-1) ?? "";
  return line
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term.length > 0 && !/^\?+$/.test(term));
}

function minimumExactPeriod(terms: readonly string[]): number | null {
  if (terms.length < 2) return null;
  for (let period = 1; period < terms.length; period += 1) {
    let repeated = false;
    let valid = true;
    for (let index = period; index < terms.length; index += 1) {
      if (terms[index] !== terms[index - period]) {
        valid = false;
        break;
      }
      repeated = true;
    }
    if (valid && repeated) return period;
  }
  return null;
}

function insertionRuleIsDeterminate(question: StructuralQuestion): boolean {
  if (!INSERTION_RULES.has(question.sourceRuleId)) return true;
  const key = (
    question.hiddenState as { readonly parameterKey?: string } | undefined
  )?.parameterKey;
  const hasStepMetadata = /insert-step:\d+/.test(key ?? "");
  const rule = question.explanation.rule;
  const statesLetterProgression =
    /inserted letters follow a fixed \+\d+ alphabet progression/i.test(rule);
  return hasStepMetadata && statesLetterProgression;
}

export function analyzeSerCp007StructuralDepthV6(
  question: StructuralQuestion,
): SerCp007StructuralDepthProfileV6 {
  const canonicalTerms = question.hiddenState?.canonicalTerms ?? [];
  const shownTerms = visibleTerms(question);
  const answers = answerTerms(question);
  const blockers: SerCp007StructuralBlockerV6[] = [];
  const warnings: string[] = [];
  const wholeTermTask = WHOLE_TERM_TASKS.has(question.taskKind);
  const uniqueCanonicalTermCount = new Set(canonicalTerms).size;
  const uniqueCanonicalRatio =
    canonicalTerms.length === 0
      ? 1
      : uniqueCanonicalTermCount / canonicalTerms.length;
  const period = wholeTermTask ? minimumExactPeriod(canonicalTerms) : null;
  const visibleAnswerOccurrences = wholeTermTask
    ? answers.reduce(
        (total, answer) =>
          total + shownTerms.filter((term) => term === answer).length,
        0,
      )
    : 0;
  const determinateRule = insertionRuleIsDeterminate(question);

  if (wholeTermTask && visibleAnswerOccurrences > 0) {
    blockers.push("ANSWER_ALREADY_VISIBLE");
    warnings.push(
      `A required answer is already displayed ${visibleAnswerOccurrences} time${visibleAnswerOccurrences === 1 ? "" : "s"} as a complete term.`,
    );
  }

  if (wholeTermTask && period !== null) {
    blockers.push("ANSWER_LEAKAGE_PERIODIC_LAYOUT");
    warnings.push(
      `The canonical sequence enters an exact period-${period} cycle before the task is complete.`,
    );
  }

  if (
    wholeTermTask &&
    canonicalTerms.length > 0 &&
    uniqueCanonicalTermCount < canonicalTerms.length
  ) {
    blockers.push("REPEATED_CANONICAL_STATE");
    warnings.push(
      `Only ${uniqueCanonicalTermCount} unique states occur across ${canonicalTerms.length} canonical terms.`,
    );
  }

  if (wholeTermTask && visibleAnswerOccurrences > 0) {
    blockers.push("EQUALITY_MATCH_ONLY");
    warnings.push(
      "The answer can be selected by equality matching instead of applying the intended rule.",
    );
  }

  if (
    wholeTermTask &&
    canonicalTerms.length >= 6 &&
    uniqueCanonicalTermCount < 4
  ) {
    blockers.push("INSUFFICIENT_STRUCTURAL_DEPTH");
    warnings.push("Fewer than four meaningful whole-term states are available.");
  }

  if (!determinateRule) {
    blockers.push("UNDERDETERMINED_INSERTION_RULE");
    warnings.push(
      "The insertion position is stated, but the identity of the next inserted letter is not determined.",
    );
  }

  const uniqueBlockers = unique(blockers);
  return {
    blockers: uniqueBlockers,
    warnings: unique(warnings),
    passesStructuralDepth: uniqueBlockers.length === 0,
    minimumExactPeriod: period,
    visibleAnswerOccurrences,
    canonicalTermCount: canonicalTerms.length,
    uniqueCanonicalTermCount,
    uniqueCanonicalRatio,
    requiresIntendedRuleApplication: uniqueBlockers.length === 0,
    determinateRule,
  };
}

export function assertSerCp007StructuralDepthV6(
  question: StructuralQuestion,
): SerCp007StructuralDepthProfileV6 {
  const profile = analyzeSerCp007StructuralDepthV6(question);
  if (!profile.passesStructuralDepth) {
    throw new Error(
      `${question.temporaryTemplateId}:${question.seed} failed V6 structural depth: ${profile.blockers.join(", ")}`,
    );
  }
  return profile;
}
