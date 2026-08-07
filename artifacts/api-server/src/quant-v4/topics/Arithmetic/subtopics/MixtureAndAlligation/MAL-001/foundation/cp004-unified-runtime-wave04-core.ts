import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";
import type {
  MalCp004Wave04OptionAudit,
  MalCp004Wave04Question,
} from "./cp004-unified-runtime-wave04-types";

export function malCp004Wave04Hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

export function malCp004Wave04Pick<T>(
  values: readonly T[],
  seed: string,
): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty list.");
  return values[malCp004Wave04Hash(seed) % values.length]!;
}

export function malCp004Wave04VariantIndex(
  seed: string,
  count: number,
): number {
  return malCp004Wave04Hash(seed) % count;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = malCp004Wave04Hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function malCp004Wave04Percent(value: Rational): string {
  return `${formatRational(multiplyRational(value, rational(100)))}%`;
}

export function malCp004Wave04Quantity(
  value: Rational,
  unit: "litres" | "kg",
): string {
  return `${formatRational(value)} ${unit}`;
}

export function malCp004Wave04AnswerText(
  value: Rational,
  unit: "litres" | "kg" | "percent",
): string {
  return unit === "percent"
    ? malCp004Wave04Percent(value)
    : malCp004Wave04Quantity(value, unit);
}

function addControlledFallbackDistractors(
  unique: Map<
    string,
    { value: Rational; misconceptionId: string; isCorrect: boolean }
  >,
  input: {
    answerValue: Rational;
    answerUnit: "litres" | "kg" | "percent";
  },
): void {
  const candidates =
    input.answerUnit === "percent"
      ? [
          {
            value: subtractRational(rational(1), input.answerValue),
            misconceptionId: "reported_complement_percentage",
          },
          {
            value: divideRational(input.answerValue, rational(2)),
            misconceptionId: "halved_component_rate",
          },
          {
            value: divideRational(
              addRational(input.answerValue, rational(1)),
              rational(2),
            ),
            misconceptionId: "averaged_rate_with_pure_component",
          },
        ]
      : [
          {
            value: divideRational(input.answerValue, rational(2)),
            misconceptionId: "divided_required_change_between_two_steps",
          },
          {
            value: multiplyRational(input.answerValue, rational(2)),
            misconceptionId: "applied_required_change_twice",
          },
          {
            value: multiplyRational(input.answerValue, rational(3, 2)),
            misconceptionId: "used_one_and_half_times_required_change",
          },
        ];

  for (const candidate of candidates) {
    if (unique.size >= 4) break;
    if (compareRational(candidate.value, rational(0)) <= 0) continue;
    if (
      input.answerUnit === "percent" &&
      compareRational(candidate.value, rational(1)) >= 0
    ) {
      continue;
    }
    const key = rationalKey(candidate.value);
    if (!unique.has(key)) {
      unique.set(key, {
        value: candidate.value,
        misconceptionId: candidate.misconceptionId,
        isCorrect: false,
      });
    }
  }
}

export function malCp004Wave04BuildOptions(input: {
  answerValue: Rational;
  answerUnit: "litres" | "kg" | "percent";
  distractors: readonly { value: Rational; misconceptionId: string }[];
  seed: string;
}): {
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
} {
  const unique = new Map<
    string,
    { value: Rational; misconceptionId: string; isCorrect: boolean }
  >();
  unique.set(rationalKey(input.answerValue), {
    value: input.answerValue,
    misconceptionId: "correct",
    isCorrect: true,
  });
  for (const distractor of input.distractors) {
    if (compareRational(distractor.value, rational(0)) <= 0) continue;
    if (
      input.answerUnit === "percent" &&
      compareRational(distractor.value, rational(1)) >= 0
    ) {
      continue;
    }
    const key = rationalKey(distractor.value);
    if (!unique.has(key)) {
      unique.set(key, {
        value: distractor.value,
        misconceptionId: distractor.misconceptionId,
        isCorrect: false,
      });
    }
  }
  if (unique.size < 4) {
    addControlledFallbackDistractors(unique, input);
  }
  if (unique.size < 4) {
    throw new Error(
      `Insufficient conceptual options for ${input.seed}: ${[
        ...unique.keys(),
      ].join(", ")}.`,
    );
  }
  const selected = shuffle([...unique.values()].slice(0, 4), input.seed);
  const answer = malCp004Wave04AnswerText(
    input.answerValue,
    input.answerUnit,
  );
  const options = selected.map((item) =>
    malCp004Wave04AnswerText(item.value, input.answerUnit),
  );
  const correctIndex = selected.findIndex((item) => item.isCorrect);
  if (correctIndex < 0 || options[correctIndex] !== answer) {
    throw new Error(`Correct option was lost for ${input.seed}.`);
  }
  return {
    answer,
    options,
    correctIndex,
    optionAudit: selected.map((item, index) => ({
      text: options[index]!,
      value: item.value,
      misconceptionId: item.misconceptionId,
      isCorrect: item.isCorrect,
    })),
  };
}

export function malCp004Wave04StateFingerprint(
  exactState: Readonly<Record<string, Rational | string>>,
): string {
  return Object.entries(exactState)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) =>
      typeof value === "string"
        ? `${key}=${value}`
        : `${key}=${rationalKey(value)}`,
    )
    .join("|");
}

export function malCp004Wave04Validate(
  question: Omit<MalCp004Wave04Question, "validation">,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (question.options.length !== 4)
    errors.push("Question does not have four options.");
  if (new Set(question.options).size !== 4)
    errors.push("Options are not unique.");
  if (question.options[question.correctIndex] !== question.answer) {
    errors.push("Correct option does not match the answer.");
  }
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Option audit does not contain exactly one correct option.");
  }
  if (
    new Set(question.optionAudit.map((option) => option.misconceptionId)).size !==
    4
  ) {
    errors.push("Distractor authorities are not distinct.");
  }
  if (
    !question.optionAudit.some(
      (option) =>
        option.isCorrect && equalsRational(option.value, question.answerValue),
    )
  ) {
    errors.push("Correct option value does not match the exact answer.");
  }
  if (question.sourceEvidenceIds.length === 0)
    errors.push("Source evidence is missing.");
  if (question.permanentQlId !== null)
    errors.push("Permanent QL leaked into discovery.");
  if (
    question.active ||
    question.publiclyPublishable ||
    question.questionStudioDiscoverable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    errors.push("A Wave 04 product flag became enabled.");
  }
  if (question.ledger.rows.length === 0)
    errors.push("Conservation table is empty.");
  if (question.explanation.calculation.length < 2) {
    errors.push("Explanation calculation is too shallow.");
  }
  if (!question.explanation.calculation.some((step) => /\d/u.test(step))) {
    errors.push("Explanation is not number-specific.");
  }
  if (!question.explanation.conclusion.includes(question.answer)) {
    errors.push("Conclusion omits the canonical answer.");
  }
  const learnerText = JSON.stringify({
    stem: question.stem,
    options: question.options,
    explanation: question.explanation,
    ledger: question.ledger,
  });
  if (
    /competitive-exam|homogeneous sample|unique integer exponent|stage strip|alligation/iu.test(
      learnerText,
    )
  ) {
    errors.push("Learner output contains artificial or unrelated language.");
  }
  if (
    /\b1 operations\b/iu.test(learnerText) ||
    /\b(?:2|3|4|5|6|7|8|9|\d{2,})(?:\s+\d+\/\d+)? litres is (?:added|removed|drawn|evaporated|present|left|lost)\b/iu.test(
      learnerText,
    )
  ) {
    errors.push("Grammar inflection is incorrect.");
  }
  return { ok: errors.length === 0, errors };
}

export function malCp004Wave04Stable(
  question: MalCp004Wave04Question,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
