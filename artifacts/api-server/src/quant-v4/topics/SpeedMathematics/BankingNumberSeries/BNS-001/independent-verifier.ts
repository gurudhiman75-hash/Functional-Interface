import { ADVANCED_PATTERNS, independentAdvancedMatches, independentAdvancedCandidates } from "./advanced-verifier";
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
  return false;
}

export function independentGrammarMatches(series: readonly number[]): Bns001PatternKind[] {
  return [...PATTERNS.filter((pattern) => independentlyMatches(pattern, series)), ...independentAdvancedMatches(series)];
}

export type Bns001Repair = Readonly<{ index: number; replacement: number; pattern: Bns001PatternKind }>;

// Recover candidates from unaffected observations. Never consult generator proof
// values, the declared answer, or generator matching code.
export function independentWrongTermRepairs(series: readonly number[]): Bns001Repair[] {
  if (![6, 7, 8, 10].includes(series.length) || series.some((n) => !Number.isFinite(n) || n <= 0)) return [];
  const repairs: Bns001Repair[] = [];
  for (let gap = 0; gap < series.length; gap += 1) {
    const known = series.map((_n, i) => i).filter((i) => i !== gap);
    const candidates = new Set<number>(independentAdvancedCandidates(series, gap));
    const [a, b, c] = known as [number, number, number, ...number[]];
    candidates.add(series[a]! + (gap - a) * (series[b]! - series[a]!) / (b - a));
    // Quadratic interpolation recovers progressive first differences.
    candidates.add([a, b, c].reduce((sum, i) => sum + series[i]! *
      [a, b, c].filter((j) => j !== i).reduce((factor, j) => factor * (gap - j) / (i - j), 1), 0));
    const row = known.filter((i) => i % 2 === gap % 2);
    if (row.length >= 2) {
      const [r, t] = row as [number, number, ...number[]];
      candidates.add(series[r]! + (gap - r) * (series[t]! - series[r]!) / (t - r));
    }
    for (const m of [2, 3, 4]) {
      candidates.add(series[a]! * m ** (gap - a));
      const pair = known.find((i) => known.includes(i + 1));
      if (pair === undefined) continue;
      const add = series[pair + 1]! - m * series[pair]!;
      let value = series[a]!;
      for (let i = a; i < gap; i += 1) value = value * m + add;
      for (let i = a; i > gap; i -= 1) value = (value - add) / m;
      candidates.add(value);
    }
    for (const raw of candidates) {
      const replacement = Math.round(raw * 1e8) / 1e8;
      if (!Number.isFinite(replacement) || replacement <= 0 || replacement === series[gap]) continue;
      const completed = series.map((n, i) => i === gap ? replacement : n);
      for (const pattern of independentGrammarMatches(completed)) {
        if (!repairs.some((r) => r.index === gap && r.replacement === replacement))
          repairs.push({ index: gap, replacement, pattern });
      }
    }
  }
  return repairs;
}

function completedWithOption(question: Bns001Question, optionText: string): number[] {
  const candidate = Number(optionText);
  if (!Number.isFinite(candidate) || candidate <= 0) return [];

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
    question.visibleSeries.length === (question.taskKind === "WRONG_TERM" ? 8 : 6) &&
    [...PATTERNS, ...ADVANCED_PATTERNS].includes(question.patternKind) &&
    (question.taskKind === "NEXT_TERM"
      ? hiddenIndex === null && question.visibleSeries.every((value) => typeof value === "number")
      : question.taskKind === "WRONG_TERM"
        ? hiddenIndex !== null && Number.isInteger(hiddenIndex) && hiddenIndex >= 0 && hiddenIndex < question.visibleSeries.length &&
          question.visibleSeries.every((value) => typeof value === "number")
        : question.taskKind === "MISSING_TERM" && hiddenIndex !== null &&
        [2, 3, 4].includes(hiddenIndex) &&
        question.visibleSeries[hiddenIndex] === "?" &&
        question.visibleSeries.filter((value) => value === "?").length === 1);
  if (!shapeValid) {
    return { valid: false, correctOptionCount: 0, matchingOptionIndexes: [], canonicalGrammarMatches: [] };
  }
  if (question.taskKind === "WRONG_TERM") {
    const repairs = independentWrongTermRepairs(question.visibleSeries.map(Number));
    const repair = repairs.length === 1 ? repairs[0] : undefined;
    const count = question.options.filter((option) => option === question.answer).length;
    const indexes = repair ? question.options.flatMap((option, i) =>
      Number(option) === question.visibleSeries[repair.index] ? [i] : []) : [];
    return {
      valid: !!repair && independentGrammarMatches(question.visibleSeries.map((n,i)=>i===repair.index?repair.replacement:Number(n))).includes(question.patternKind) && repair.index === hiddenIndex &&
        count === 1 && indexes.length === 1 && indexes[0] === question.correctIndex &&
        question.options[question.correctIndex] === question.answer,
      correctOptionCount: count,
      matchingOptionIndexes: indexes,
      canonicalGrammarMatches: repair ? independentGrammarMatches(question.visibleSeries.map((n,i)=>i===repair.index?repair.replacement:Number(n))) : [],
    };
  }
  const matchingOptionIndexes: number[] = [];

  question.options.forEach((option, index) => {
    const completed = completedWithOption(question, option);
    const matches = independentGrammarMatches(completed);
    if (matches.length > 0) {
      matchingOptionIndexes.push(index);
    }
  });

  const canonicalCompleted = completedWithOption(question, question.answer);
  const canonicalGrammarMatches = independentGrammarMatches(canonicalCompleted);
  const correctOptionCount = question.options.filter((option) => option === question.answer).length;

  return {
    valid:
      canonicalGrammarMatches.includes(question.patternKind) &&
      correctOptionCount === 1 &&
      matchingOptionIndexes.length === 1 &&
      matchingOptionIndexes[0] === question.correctIndex,
    correctOptionCount,
    matchingOptionIndexes,
    canonicalGrammarMatches,
  };
}
