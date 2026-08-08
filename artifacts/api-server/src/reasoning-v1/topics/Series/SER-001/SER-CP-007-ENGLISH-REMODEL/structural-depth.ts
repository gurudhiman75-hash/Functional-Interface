import type { SerCp007EditorialQuestion } from "./adaptive-review";

export type SerCp007StructuralBlocker =
  | "ANSWER_LEAKAGE_PERIODIC_LAYOUT"
  | "ANSWER_ALREADY_VISIBLE_MULTIPLE_TIMES"
  | "EQUALITY_MATCH_ONLY"
  | "INSUFFICIENT_STRUCTURAL_DEPTH";

export interface SerCp007StructuralDepthProfile {
  readonly blockers: readonly SerCp007StructuralBlocker[];
  readonly warnings: readonly string[];
  readonly passesStructuralDepth: boolean;
  readonly minimumExactPeriod: number | null;
  readonly visibleAnswerOccurrences: number;
  readonly canonicalTermCount: number;
  readonly uniqueCanonicalTermCount: number;
  readonly uniqueCanonicalRatio: number;
  readonly requiresIntendedRuleApplication: boolean;
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
]);

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function canonicalAnswerIndexes(question: StructuralQuestion): readonly number[] {
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const answerPieces = question.correctAnswer
    .split(/,|→/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  return answerPieces
    .map((piece) => terms.indexOf(piece))
    .filter((index) => index >= 0);
}

function answerTerms(question: StructuralQuestion): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const indexes = canonicalAnswerIndexes(question);
  if (terms.length > 0 && indexes.length > 0) {
    return unique(indexes.map((index) => terms[index]!).filter(Boolean));
  }
  if (!WHOLE_TERM_TASKS.has(question.taskKind)) return [];
  const replacement = question.correctAnswer.split("→").at(-1)?.trim();
  return replacement ? [replacement] : [question.correctAnswer];
}

function parsedVisibleTerms(question: StructuralQuestion): readonly string[] {
  if (question.sequence) {
    return question.sequence.filter((term): term is string => Boolean(term));
  }
  const seriesLine = question.stem.split("\n").at(-1) ?? "";
  return seriesLine
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term.length > 0 && !/^\?+$/.test(term));
}

function minimumExactPeriod(terms: readonly string[]): number | null {
  if (terms.length < 4) return null;
  const maximumPeriod = Math.min(3, Math.floor(terms.length / 2));
  for (let period = 1; period <= maximumPeriod; period += 1) {
    if (terms.every((term, index) => term === terms[index % period])) {
      return period;
    }
  }
  return null;
}

function periodicAnswerIsVisiblyForced(
  question: StructuralQuestion,
  period: number,
): boolean {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const answerIndexes = canonicalAnswerIndexes(question);
  if (terms.length === 0 || answerIndexes.length === 0) return false;

  for (const answerIndex of answerIndexes) {
    const answer = terms[answerIndex];
    if (!answer) continue;
    let sameResidueVisible = 0;
    for (let index = 0; index < terms.length; index += 1) {
      if (index === answerIndex) continue;
      if (index % period === answerIndex % period && terms[index] === answer) {
        sameResidueVisible += 1;
      }
    }
    if (sameResidueVisible >= 1) return true;
  }
  return false;
}

function equalityOnlyLeak(
  question: StructuralQuestion,
  visibleTerms: readonly string[],
  answers: readonly string[],
  period: number | null,
): boolean {
  if (!WHOLE_TERM_TASKS.has(question.taskKind)) return false;
  if (period !== null && periodicAnswerIsVisiblyForced(question, period)) {
    return true;
  }
  return answers.some(
    (answer) => visibleTerms.filter((term) => term === answer).length >= 2,
  );
}

export function analyzeSerCp007StructuralDepth(
  question: StructuralQuestion,
): SerCp007StructuralDepthProfile {
  const canonicalTerms = question.hiddenState?.canonicalTerms ?? [];
  const visibleTerms = parsedVisibleTerms(question);
  const answers = answerTerms(question);
  const blockers: SerCp007StructuralBlocker[] = [];
  const warnings: string[] = [];

  if (!WHOLE_TERM_TASKS.has(question.taskKind) || canonicalTerms.length === 0) {
    return {
      blockers,
      warnings,
      passesStructuralDepth: true,
      minimumExactPeriod: null,
      visibleAnswerOccurrences: 0,
      canonicalTermCount: canonicalTerms.length,
      uniqueCanonicalTermCount: new Set(canonicalTerms).size,
      uniqueCanonicalRatio:
        canonicalTerms.length === 0
          ? 1
          : new Set(canonicalTerms).size / canonicalTerms.length,
      requiresIntendedRuleApplication: true,
    };
  }

  const period = minimumExactPeriod(canonicalTerms);
  const visibleAnswerOccurrences = answers.reduce(
    (total, answer) =>
      total + visibleTerms.filter((term) => term === answer).length,
    0,
  );
  const uniqueCanonicalTermCount = new Set(canonicalTerms).size;
  const uniqueCanonicalRatio = uniqueCanonicalTermCount / canonicalTerms.length;

  if (period !== null && periodicAnswerIsVisiblyForced(question, period)) {
    blockers.push("ANSWER_LEAKAGE_PERIODIC_LAYOUT");
    warnings.push(
      `The canonical sequence repeats every ${period} term${period === 1 ? "" : "s"}, so the blank can be filled by matching an earlier position.`,
    );
  }

  if (visibleAnswerOccurrences >= 2) {
    blockers.push("ANSWER_ALREADY_VISIBLE_MULTIPLE_TIMES");
    warnings.push(
      `The required answer is already displayed ${visibleAnswerOccurrences} times.`,
    );
  }

  if (equalityOnlyLeak(question, visibleTerms, answers, period)) {
    blockers.push("EQUALITY_MATCH_ONLY");
    warnings.push(
      "The answer can be selected through equality matching without applying the intended transformation.",
    );
  }

  if (
    canonicalTerms.length >= 6 &&
    (uniqueCanonicalTermCount <= 3 || uniqueCanonicalRatio < 0.6)
  ) {
    blockers.push("INSUFFICIENT_STRUCTURAL_DEPTH");
    warnings.push(
      `Only ${uniqueCanonicalTermCount} distinct states appear across ${canonicalTerms.length} canonical terms.`,
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
  };
}

export function assertSerCp007StructuralDepth(
  question: StructuralQuestion,
): SerCp007StructuralDepthProfile {
  const profile = analyzeSerCp007StructuralDepth(question);
  if (!profile.passesStructuralDepth) {
    throw new Error(
      `${question.temporaryTemplateId}:${question.seed} failed structural depth: ${profile.blockers.join(", ")}`,
    );
  }
  return profile;
}
