import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  generateIntCp001ApprovedCloseDistractorEnglishQuestion,
  generateIntCp001ApprovedCloseDistractorLocalizedQuestion,
  type IntCp001ApprovedCloseDistractorEnglishQuestion,
  type IntCp001ApprovedCloseDistractorLocalizedQuestion,
} from "./cp001-close-distractor-runtime-approved";

export const INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID =
  "INT-CP-001-EXPLANATION-SANITIZATION-V1" as const;

export const INT_CP001_EXPLANATION_SANITIZATION_STATUS =
  "EXPLANATION_SANITIZATION_CANDIDATE" as const;

export const INT_CP001_EXPLANATION_SANITIZATION_REVIEW_STATUS =
  "PENDING_EXPLANATION_SANITIZATION_REVIEW" as const;

export type IntCp001ExplanationSanitizationLanguage = "en" | IntCp001Locale;

export type IntCp001SanitizedLocalizedQuestion = Omit<
  IntCp001ApprovedCloseDistractorLocalizedQuestion,
  "releaseId" | "maturity" | "reviewStatus" | "localeReviewStatus" | "explanation" | "validation"
> & {
  releaseId: "INT-CP-001-HI-v5" | "INT-CP-001-PA-v5";
  maturity: typeof INT_CP001_EXPLANATION_SANITIZATION_STATUS;
  reviewStatus: typeof INT_CP001_EXPLANATION_SANITIZATION_REVIEW_STATUS;
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  explanation: IntCp001ApprovedCloseDistractorLocalizedQuestion["explanation"];
  validation: IntCp001ApprovedCloseDistractorLocalizedQuestion["validation"];
  explanationSanitizationTrace: {
    patchId: typeof INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID;
    supersedesReleaseId: "INT-CP-001-HI-v4" | "INT-CP-001-PA-v4";
    learnerMathCurrencyTokensRemoved: number;
    redundantRatePercentTokensRemoved: number;
    canonicalStemChanged: false;
    optionValuesChanged: false;
    correctIndexChanged: false;
  };
};

export type IntCp001ExplanationSanitizationQuestion =
  | IntCp001ApprovedCloseDistractorEnglishQuestion
  | IntCp001SanitizedLocalizedQuestion;

const NUMERIC_RATE_TOKEN = /(?:\d+(?:\.\d+)?|\\frac\{[-+]?\d+\}\{\d+\})\\%/gu;
const MULTIPLICATION_LEFT = /(?:\\times|\\cdot)\s*$/u;
const MULTIPLICATION_RIGHT = /^\s*(?:\\times|\\cdot)/u;
const EXPLICIT_PERCENT_CONVERSION = /\\frac\{100|\}\{100\}/u;
const MATH_SEGMENT = /\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])*\$/gu;

export interface IntCp001ExplanationSanitizationCounts {
  learnerMathCurrencyTokensRemoved: number;
  redundantRatePercentTokensRemoved: number;
}

function isRedundantRateToken(body: string, token: string, offset: number): boolean {
  if (!EXPLICIT_PERCENT_CONVERSION.test(body)) return false;
  const left = body.slice(0, offset);
  const right = body.slice(offset + token.length);
  return MULTIPLICATION_LEFT.test(left) || MULTIPLICATION_RIGHT.test(right);
}

function sanitizeMathBody(
  body: string,
  counts: IntCp001ExplanationSanitizationCounts,
): string {
  let sanitized = body.replace(/\\text\{₹\}|₹/gu, () => {
    counts.learnerMathCurrencyTokensRemoved += 1;
    return "";
  });

  sanitized = sanitized.replace(NUMERIC_RATE_TOKEN, (token, offset: number, source: string) => {
    if (!isRedundantRateToken(source, token, offset)) return token;
    counts.redundantRatePercentTokensRemoved += 1;
    return token.slice(0, -2);
  });

  return sanitized;
}

export function sanitizeIntCp001LearnerMath(
  value: string,
  counts: IntCp001ExplanationSanitizationCounts = {
    learnerMathCurrencyTokensRemoved: 0,
    redundantRatePercentTokensRemoved: 0,
  },
): string {
  return value.replace(MATH_SEGMENT, (segment) => {
    const display = segment.startsWith("$$");
    const delimiter = display ? "$$" : "$";
    const body = segment.slice(delimiter.length, -delimiter.length);
    return `${delimiter}${sanitizeMathBody(body, counts)}${delimiter}`;
  });
}

function sanitizeExplanationValue<T>(
  value: T,
  counts: IntCp001ExplanationSanitizationCounts,
): T {
  if (typeof value === "string") {
    return sanitizeIntCp001LearnerMath(value, counts) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeExplanationValue(item, counts)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, sanitizeExplanationValue(item, counts)]),
    ) as T;
  }
  return value;
}

export function collectIntCp001MathSegments(value: unknown): string[] {
  const segments: string[] = [];
  const visit = (item: unknown): void => {
    if (typeof item === "string") {
      for (const match of item.matchAll(MATH_SEGMENT)) segments.push(match[0]);
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (item && typeof item === "object") {
      Object.values(item as Record<string, unknown>).forEach(visit);
    }
  };
  visit(value);
  return segments;
}

export function validateIntCp001SanitizedExplanation(explanation: unknown): string[] {
  const errors: string[] = [];
  for (const segment of collectIntCp001MathSegments(explanation)) {
    if (segment.includes("₹") || segment.includes("\\text{₹}")) {
      errors.push(`Currency symbol remains inside learner math: ${segment}`);
    }
    const body = segment.startsWith("$$") ? segment.slice(2, -2) : segment.slice(1, -1);
    for (const match of body.matchAll(NUMERIC_RATE_TOKEN)) {
      const token = match[0];
      const offset = match.index ?? 0;
      if (isRedundantRateToken(body, token, offset)) {
        errors.push(`Redundant percent token remains in explicitly scaled substitution: ${segment}`);
      }
    }
  }
  return errors;
}

function localizedReleaseId(locale: IntCp001Locale): IntCp001SanitizedLocalizedQuestion["releaseId"] {
  return locale === "hi" ? "INT-CP-001-HI-v5" : "INT-CP-001-PA-v5";
}

export function generateIntCp001SanitizedLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001SanitizedLocalizedQuestion {
  const approved = generateIntCp001ApprovedCloseDistractorLocalizedQuestion(qlId, seed, locale);
  const counts: IntCp001ExplanationSanitizationCounts = {
    learnerMathCurrencyTokensRemoved: 0,
    redundantRatePercentTokensRemoved: 0,
  };
  const explanation = sanitizeExplanationValue(approved.explanation, counts);
  const sanitationErrors = validateIntCp001SanitizedExplanation(explanation);
  const errors = [...approved.validation.errors, ...sanitationErrors];

  return {
    ...approved,
    releaseId: localizedReleaseId(locale),
    maturity: INT_CP001_EXPLANATION_SANITIZATION_STATUS,
    reviewStatus: INT_CP001_EXPLANATION_SANITIZATION_REVIEW_STATUS,
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    explanation,
    validation: {
      ...approved.validation,
      ok: errors.length === 0,
      errors,
    },
    explanationSanitizationTrace: {
      patchId: INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID,
      supersedesReleaseId: approved.releaseId,
      learnerMathCurrencyTokensRemoved: counts.learnerMathCurrencyTokensRemoved,
      redundantRatePercentTokensRemoved: counts.redundantRatePercentTokensRemoved,
      canonicalStemChanged: false,
      optionValuesChanged: false,
      correctIndexChanged: false,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateIntCp001ExplanationSanitizationQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  language: IntCp001ExplanationSanitizationLanguage,
): IntCp001ExplanationSanitizationQuestion {
  return language === "en"
    ? generateIntCp001ApprovedCloseDistractorEnglishQuestion(qlId, seed)
    : generateIntCp001SanitizedLocalizedQuestion(qlId, seed, language);
}
