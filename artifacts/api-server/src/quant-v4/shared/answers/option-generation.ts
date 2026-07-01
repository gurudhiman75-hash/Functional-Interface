import {
  formatNumber,
  getComparableAnswerKey,
  normalizeQuantV4Answer,
  renderQuantV4Answer,
  type QuantV4AnswerLike,
  type QuantV4CanonicalAnswer,
} from "./answer-contract";

export interface QuantV4OptionGenerationInput {
  seed?: string;
  existingOptions?: readonly unknown[];
  optionCount?: number;
}

export interface QuantV4OptionGenerationResult {
  options: string[];
  correct: number;
  canonicalAnswer: QuantV4CanonicalAnswer;
}

function seededHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleDeterministically<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = seededHash(seed) || 1;
  for (let index = shuffled.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex]!,
      shuffled[index]!,
    ];
  }
  return shuffled;
}

function addUnique(options: string[], value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!options.some((existing) => existing.trim() === trimmed)) {
    options.push(trimmed);
  }
}

function numericOffsets(value: number) {
  const magnitude = Math.abs(value);
  if (magnitude >= 1000) return [100, -100, 50, -50, 10, -10];
  if (magnitude >= 100) return [10, -10, 20, -20, 5, -5];
  if (magnitude >= 10) return [1, -1, 2, -2, 5, -5];
  return [0.5, -0.5, 1, -1, 2, -2];
}

function formatLike(answer: QuantV4CanonicalAnswer, value: number) {
  switch (answer.kind) {
    case "integer":
    case "decimal":
      return formatNumber(value, answer.precision);
    case "percentage":
      return `${formatNumber(value, answer.precision)}%`;
    case "currency":
      return `${answer.currency}${formatNumber(value, answer.precision)}`;
    case "unit":
      return `${formatNumber(value, answer.precision)} ${answer.unit}`.trim();
    default:
      return formatNumber(value);
  }
}

function numericDistractors(answer: Extract<QuantV4CanonicalAnswer, { value: number }>) {
  const values = numericOffsets(answer.value).map((offset) => answer.value + offset);
  return values
    .filter((value) => Number.isFinite(value))
    .map((value) => formatLike(answer, value));
}

function fractionDistractors(answer: Extract<QuantV4CanonicalAnswer, { kind: "fraction" }>) {
  const numerator = answer.numerator;
  const denominator = answer.denominator;
  return [
    `${numerator + 1}/${denominator}`,
    `${Math.max(1, numerator - 1)}/${denominator}`,
    `${numerator}/${denominator + 1}`,
    `${numerator}/${Math.max(1, denominator - 1)}`,
    `${denominator}/${numerator || 1}`,
  ];
}

function ratioDistractors(answer: Extract<QuantV4CanonicalAnswer, { kind: "ratio" }>) {
  const terms = [...answer.terms];
  const candidates: string[] = [];
  for (let index = 0; index < terms.length; index++) {
    const plus = [...terms];
    plus[index] = (plus[index] ?? 0) + 1;
    candidates.push(plus.join(":"));

    const minus = [...terms];
    minus[index] = Math.max(1, (minus[index] ?? 0) - 1);
    candidates.push(minus.join(":"));
  }
  candidates.push([...terms].reverse().join(":"));
  return candidates;
}

function symbolicDistractors(answer: Extract<QuantV4CanonicalAnswer, { kind: "symbolic" }>) {
  const value = answer.display ?? answer.value;
  if (!value) return ["0", "1", "-1"];
  return [`-${value}`, `${value} + 1`, `${value} - 1`, `2${value}`];
}

function distractorsFor(answer: QuantV4CanonicalAnswer) {
  switch (answer.kind) {
    case "integer":
    case "decimal":
    case "percentage":
    case "currency":
    case "unit":
      return numericDistractors(answer);
    case "fraction":
      return fractionDistractors(answer);
    case "ratio":
      return ratioDistractors(answer);
    case "symbolic":
      return symbolicDistractors(answer);
  }
}

function correctIndexFromCanonical(options: readonly string[], canonicalAnswer: QuantV4CanonicalAnswer) {
  const canonicalKey = getComparableAnswerKey(canonicalAnswer);
  const rendered = renderQuantV4Answer(canonicalAnswer).trim();
  const display = (canonicalAnswer.display ?? rendered).trim();
  const exact = options.findIndex((option) => option.trim() === rendered || option.trim() === display);
  if (exact >= 0) return exact;

  return options.findIndex((option) => {
    try {
      return getComparableAnswerKey(option as QuantV4AnswerLike) === canonicalKey;
    } catch {
      return false;
    }
  });
}

export function buildQuantV4AnswerOptions(
  answer: QuantV4AnswerLike,
  input: QuantV4OptionGenerationInput = {},
): QuantV4OptionGenerationResult {
  const canonicalAnswer = normalizeQuantV4Answer(answer);
  const desiredCount = Math.max(2, Math.floor(input.optionCount ?? 4));
  const seed = input.seed ?? renderQuantV4Answer(canonicalAnswer) ?? "quant-v4";
  const existingOptions = Array.isArray(input.existingOptions)
    ? input.existingOptions.map((option) => String(option ?? "").trim()).filter(Boolean)
    : [];

  if (existingOptions.length >= desiredCount) {
    const options = existingOptions.slice(0, desiredCount);
    const existingCorrect = correctIndexFromCanonical(options, canonicalAnswer);
    if (existingCorrect >= 0) {
      return { options, correct: existingCorrect, canonicalAnswer };
    }
  }

  const generated: string[] = [];
  addUnique(generated, renderQuantV4Answer(canonicalAnswer));
  for (const option of existingOptions) addUnique(generated, option);
  for (const option of distractorsFor(canonicalAnswer)) addUnique(generated, option);

  let fallbackOffset = 1;
  while (generated.length < desiredCount) {
    if (
      canonicalAnswer.kind === "integer" ||
      canonicalAnswer.kind === "decimal" ||
      canonicalAnswer.kind === "percentage" ||
      canonicalAnswer.kind === "currency" ||
      canonicalAnswer.kind === "unit"
    ) {
      addUnique(generated, formatLike(canonicalAnswer, canonicalAnswer.value + fallbackOffset));
    } else {
      addUnique(generated, `${renderQuantV4Answer(canonicalAnswer)} ${fallbackOffset}`);
    }
    fallbackOffset++;
  }

  const shuffled = shuffleDeterministically(generated.slice(0, desiredCount), seed);
  const correct = Math.max(0, correctIndexFromCanonical(shuffled, canonicalAnswer));
  return { options: shuffled, correct, canonicalAnswer };
}

export { renderQuantV4Answer } from "./answer-contract";
