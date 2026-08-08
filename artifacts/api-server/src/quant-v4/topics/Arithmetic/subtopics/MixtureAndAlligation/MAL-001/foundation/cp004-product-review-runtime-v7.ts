import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import {
  type MalCp004ProductReviewQuestion,
} from "./cp004-product-review-remediation-v3";
import { runMalCp004EnglishProductReviewV4Pipeline } from "./cp004-product-review-runtime-v4";
import { runMalCp004EnglishProductReviewV6Pipeline } from "./cp004-product-review-runtime-v6";
import type { MalCp004Wave04OptionAudit } from "./cp004-unified-runtime-wave04-types";
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

export const MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7 =
  "MAL-CP004-EN-PRODUCT-REVIEW-RUNTIME-V7" as const;

interface Candidate {
  value: Rational;
  misconceptionId: string;
}

function exact(question: MalCp004ProductReviewQuestion, key: string): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: '${key}' is not an exact rational.`);
  }
  return value;
}

function percentText(value: Rational): string {
  return `${formatRational(multiplyRational(value, rational(100)))}%`;
}

function optionText(
  question: MalCp004ProductReviewQuestion,
  value: Rational,
): string {
  return question.answerUnit === "percent"
    ? percentText(value)
    : `${formatRational(value)} ${question.answerUnit}`;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function ql038Candidates(question: MalCp004ProductReviewQuestion): Candidate[] {
  const total = exact(question, "total");
  const answer = question.answerValue;
  const rate = divideRational(answer, total);
  return [
    {
      value: subtractRational(total, answer),
      misconceptionId: "used_complementary_component",
    },
    {
      value: multiplyRational(rate, rational(100)),
      misconceptionId: "copied_percentage_as_litres",
    },
    {
      value: divideRational(total, rate),
      misconceptionId: "divided_by_component_fraction_instead_of_multiplying",
    },
    {
      value: multiplyRational(answer, rate),
      misconceptionId: "applied_component_fraction_twice",
    },
    { value: total, misconceptionId: "reported_total_mixture" },
    {
      value: subtractRational(total, multiplyRational(answer, rate)),
      misconceptionId: "subtracted_double_applied_share_from_total",
    },
  ];
}

function ql039Candidates(question: MalCp004ProductReviewQuestion): Candidate[] {
  const total = exact(question, "total");
  const tracked = exact(question, "trackedAmount");
  const other = exact(question, "otherAmount");
  const halfTracked = divideRational(tracked, rational(2));
  const halfOther = divideRational(other, rational(2));
  return [
    {
      value: divideRational(other, total),
      misconceptionId: "used_complementary_percentage",
    },
    {
      value: divideRational(tracked, other),
      misconceptionId: "divided_by_other_component",
    },
    {
      value: divideRational(tracked, multiplyRational(total, rational(2))),
      misconceptionId: "doubled_total_before_dividing",
    },
    {
      value: divideRational(addRational(tracked, halfOther), total),
      misconceptionId: "counted_half_other_component_as_requested_component",
    },
    {
      value: divideRational(tracked, addRational(total, halfOther)),
      misconceptionId: "added_half_other_component_to_total",
    },
    {
      value: divideRational(tracked, subtractRational(total, halfTracked)),
      misconceptionId: "removed_half_component_from_denominator",
    },
  ];
}

function candidates(question: MalCp004ProductReviewQuestion): Candidate[] {
  return question.permanentQlId === "MAL-QL-038"
    ? ql038Candidates(question)
    : ql039Candidates(question);
}

function acceptable(
  question: MalCp004ProductReviewQuestion,
  value: Rational,
): boolean {
  if (compareRational(value, rational(0)) <= 0) return false;
  if (equalsRational(value, question.answerValue)) return false;
  if (question.answerUnit === "percent") {
    return compareRational(value, rational(1)) < 0;
  }
  return true;
}

function rebuildOptions(
  question: MalCp004ProductReviewQuestion,
): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
} {
  const selected: Candidate[] = [];
  const valueKeys = new Set<string>([rationalKey(question.answerValue)]);
  const texts = new Set<string>([question.answer]);
  for (const candidate of candidates(question)) {
    if (!acceptable(question, candidate.value)) continue;
    const key = rationalKey(candidate.value);
    const text = optionText(question, candidate.value);
    if (valueKeys.has(key) || texts.has(text)) continue;
    valueKeys.add(key);
    texts.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${question.questionId}: V7 direct-percentage options collided.`);
  }

  const requestedSeed = question.parameters.requestedSeed;
  const correctIndex = hash(`${requestedSeed}:mal-cp004-direct-options-v7`) % 4;
  const options: string[] = [];
  const optionAudit: MalCp004Wave04OptionAudit[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(question.answer);
      optionAudit.push({
        text: question.answer,
        value: question.answerValue,
        misconceptionId: "correct",
        isCorrect: true,
      });
      continue;
    }
    const entry = selected[wrong++]!;
    const text = optionText(question, entry.value);
    options.push(text);
    optionAudit.push({
      text,
      value: entry.value,
      misconceptionId: entry.misconceptionId,
      isCorrect: false,
    });
  }
  return { options, correctIndex, optionAudit };
}

function polishDirectQuestion(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const base = runMalCp004EnglishProductReviewV4Pipeline(input);
  const options = rebuildOptions(base);
  const question = {
    ...base,
    ...options,
    parameters: {
      ...base.parameters,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7,
    },
    traceability: {
      ...base.traceability,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V7,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "DIRECT_PERCENTAGE_OPTION_POLISH_V7",
          passed: true,
          message:
            "Direct component and concentration questions use recognisable exam errors without tiny double-division quantities or awkward inflated denominators.",
        },
      ],
    },
  } as MalCp004ProductReviewQuestion;

  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.answer
  ) {
    throw new Error(`${question.questionId}: V7 option package is invalid.`);
  }
  if (
    question.permanentQlId === "MAL-QL-038" &&
    question.answerValue.denominator !== 1n
  ) {
    throw new Error(`${question.questionId}: V7 Easy answer is fractional.`);
  }
  return question;
}

export function runMalCp004EnglishProductReviewV7Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  if (
    input.questionLanguageId === "MAL-QL-038" ||
    input.questionLanguageId === "MAL-QL-039"
  ) {
    return polishDirectQuestion(input);
  }
  return runMalCp004EnglishProductReviewV6Pipeline(input);
}

export function malCp004ProductReviewV7Stable(
  question: MalCp004ProductReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
