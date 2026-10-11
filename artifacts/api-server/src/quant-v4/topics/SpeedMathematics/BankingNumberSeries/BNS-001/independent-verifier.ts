import type { Bns001PatternKind, Bns001Question } from "./types";

const PATTERNS: readonly Bns001PatternKind[] = [
  "ARITHMETIC_DIFFERENCE",
  "PROGRESSIVE_DIFFERENCE",
  "GEOMETRIC_MULTIPLICATION",
  "MULTIPLY_AND_ADD",
  "INTERLEAVED_ARITHMETIC",
];

function deltas(values: readonly number[]): number[] {
  const output: number[] = [];
  for (let index = 1; index < values.length; index += 1) {
    output.push(values[index]! - values[index - 1]!);
  }
  return output;
}

function constant(values: readonly number[]): boolean {
  if (values.length === 0) return false;
  const first = values[0]!;
  return values.every((value) => value === first);
}

function independentlyMatches(pattern: Bns001PatternKind, series: readonly number[]): boolean {
  if (series.length < 6) return false;
  if (series.some((value) => !Number.isSafeInteger(value) || value <= 0)) return false;

  switch (pattern) {
    case "ARITHMETIC_DIFFERENCE":
      return constant(deltas(series));

    case "PROGRESSIVE_DIFFERENCE": {
      const first = deltas(series);
      const second = deltas(first);
      return first.length >= 5 && second.length >= 4 && constant(second) && second[0] !== 0;
    }

    case "GEOMETRIC_MULTIPLICATION": {
      for (const multiplier of [2, 3, 4]) {
        let valid = true;
        for (let index = 1; index < series.length; index += 1) {
          if (series[index] !== series[index - 1]! * multiplier) {
            valid = false;
            break;
          }
        }
        if (valid) return true;
      }
      return false;
    }

    case "MULTIPLY_AND_ADD": {
      for (const multiplier of [2, 3, 4]) {
        const addend = series[1]! - series[0]! * multiplier;
        if (addend === 0) continue;
        let valid = true;
        for (let index = 1; index < series.length; index += 1) {
          if (series[index] !== series[index - 1]! * multiplier + addend) {
            valid = false;
            break;
          }
        }
        if (valid) return true;
      }
      return false;
    }

    case "INTERLEAVED_ARITHMETIC": {
      const firstRow = series.filter((_value, index) => index % 2 === 0);
      const secondRow = series.filter((_value, index) => index % 2 === 1);
      if (firstRow.length < 3 || secondRow.length < 3) return false;
      const firstDiffs = deltas(firstRow);
      const secondDiffs = deltas(secondRow);
      return constant(firstDiffs) && constant(secondDiffs) && firstDiffs[0] !== secondDiffs[0];
    }
  }
}

export function independentGrammarMatches(series: readonly number[]): Bns001PatternKind[] {
  return PATTERNS.filter((pattern) => independentlyMatches(pattern, series));
}

function completedWithOption(question: Bns001Question, optionText: string): number[] {
  const candidate = Number(optionText);
  if (!Number.isSafeInteger(candidate) || candidate <= 0) return [];

  if (question.taskKind === "NEXT_TERM") {
    return [...question.visibleSeries.map(Number), candidate];
  }

  const hiddenIndex = question.proof.hiddenIndex;
  if (hiddenIndex === null) return [];
  return question.visibleSeries.map((value, index) => index === hiddenIndex ? candidate : Number(value));
}

export type Bns001IndependentVerification = Readonly<{
  valid: boolean;
  correctOptionCount: number;
  matchingOptionIndexes: readonly number[];
  canonicalGrammarMatches: readonly Bns001PatternKind[];
}>;

export function independentlyVerifyBns001Question(question: Bns001Question): Bns001IndependentVerification {
  // Reject malformed learner packages before verifying their arithmetic. A
  // correct continuation alone cannot validate an item with missing choices
  // or an unsupported task silently interpreted as a missing-term question.
  const hiddenIndex = question.proof.hiddenIndex;
  const shapeValid =
    question.optionCount === 5 &&
    question.options.length === 5 &&
    new Set(question.options).size === 5 &&
    Number.isInteger(question.correctIndex) &&
    question.correctIndex >= 0 && question.correctIndex < 5 &&
    question.visibleSeries.length === 6 &&
    PATTERNS.includes(question.patternKind) &&
    (question.taskKind === "NEXT_TERM"
      ? hiddenIndex === null && question.visibleSeries.every((value) => typeof value === "number")
      : question.taskKind === "MISSING_TERM" && hiddenIndex !== null &&
        [2, 3, 4].includes(hiddenIndex) &&
        question.visibleSeries[hiddenIndex] === "?" &&
        question.visibleSeries.filter((value) => value === "?").length === 1);
  if (!shapeValid) {
    return { valid: false, correctOptionCount: 0, matchingOptionIndexes: [], canonicalGrammarMatches: [] };
  }
  const matchingOptionIndexes: number[] = [];

  question.options.forEach((option, index) => {
    const completed = completedWithOption(question, option);
    const matches = independentGrammarMatches(completed);
    if (matches.length === 1 && matches[0] === question.patternKind) {
      matchingOptionIndexes.push(index);
    }
  });

  const canonicalCompleted = completedWithOption(question, question.answer);
  const canonicalGrammarMatches = independentGrammarMatches(canonicalCompleted);
  const correctOptionCount = question.options.filter((option) => option === question.answer).length;

  return {
    valid:
      canonicalGrammarMatches.length === 1 &&
      canonicalGrammarMatches[0] === question.patternKind &&
      correctOptionCount === 1 &&
      matchingOptionIndexes.length === 1 &&
      matchingOptionIndexes[0] === question.correctIndex,
    correctOptionCount,
    matchingOptionIndexes,
    canonicalGrammarMatches,
  };
}
