import type {
  LanguageCode,
  LocalizedRealization,
} from "../contracts/language-contracts";
import type { EditorialRealization } from "../../editorial/editorial-types";
import { leakedInternalExplanationTerms } from "../../quality/teacher-explanation-normalizer";

export interface LocalizationValidationIssue {
  code:
    | "english_leakage"
    | "equation_corruption"
    | "script_mismatch"
    | "missing_intent"
    | "encoding_corruption"
    | "internal_label_leakage"
    | "incomplete_explanation";
  message: string;
}

export interface LocalizationMetrics {
  localizationCoverage: number;
  missingIntentCount: number;
  fallbackCount: number;
  scriptConsistencyScore: number;
  equationPreservationScore: number;
  multilingualReadinessScore: number;
}

const ASCII_WORD_RE = /\b[A-Za-z]{2,}\b/gu;
const ALLOWED_ASCII_WORDS = new Set([
  "kg",
  "km",
  "cm",
  "mm",
  "ml",
  "lt",
  "m",
  "l",
]);
const MOJIBAKE_RE = /(?:Ã.|Â.|â‚¹|à¤|à¨|ï¿½)/u;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;

function equationLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) =>
      /^(?:=\s*)?[-+]?[\d][\d\s().xX*/+\-/%^]*$/u.test(line),
    );
}

function isNeutralLine(line: string) {
  const trimmed = line.trim();
  return (
    trimmed.length === 0 ||
    /^(?:=\s*)?[-+]?[\d][\d\s().xX*/+\-/%^]*$/u.test(trimmed)
  );
}

function disallowedEnglishWords(line: string) {
  return [...line.matchAll(ASCII_WORD_RE)]
    .map((match) => match[0]!.toLowerCase())
    .filter((word) => !ALLOWED_ASCII_WORDS.has(word));
}

function scriptScore(language: LanguageCode, localized: LocalizedRealization) {
  if (language === "en") {
    return 100;
  }

  let checked = 0;
  let valid = 0;
  const script = language === "hi" ? DEVANAGARI_RE : GURMUKHI_RE;

  for (const line of localized.lines) {
    if (isNeutralLine(line.renderedText)) {
      continue;
    }
    checked += 1;
    if (
      script.test(line.renderedText) &&
      disallowedEnglishWords(line.renderedText).length === 0
    ) {
      valid += 1;
    }
  }

  return Math.round((valid / Math.max(1, checked)) * 100);
}

function finalExplanationLine(explanation: string) {
  return explanation
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);
}

function isIncompleteEnding(line: string | undefined) {
  const value = String(line ?? "").trim();
  return (
    value.length === 0 ||
    /[:=]\s*$/u.test(value) ||
    /(?:[+\-*/xX]|\()\s*$/u.test(value) ||
    !/\d/u.test(value)
  );
}

export function createLocalizationMetrics(input: {
  source: EditorialRealization;
  localized: LocalizedRealization;
}): LocalizationMetrics {
  const total = input.localized.coverage.totalIntentLines;
  const coverage =
    total === 0
      ? 100
      : Math.round(
          (input.localized.coverage.localizedIntentLines / total) * 100,
        );
  const sourceEquations = equationLines(input.source.explanation);
  const localizedEquations = equationLines(input.localized.explanation);
  const equationPreservationScore =
    sourceEquations.length === localizedEquations.length &&
    sourceEquations.every(
      (line, index) => line === localizedEquations[index],
    )
      ? 100
      : 60;
  const scriptConsistencyScore = scriptScore(
    input.localized.language,
    input.localized,
  );
  const multilingualReadinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        coverage * 0.4 +
          scriptConsistencyScore * 0.3 +
          equationPreservationScore * 0.3 -
          input.localized.coverage.fallbackCount * 6,
      ),
    ),
  );

  return {
    localizationCoverage: coverage,
    missingIntentCount: input.localized.coverage.missingIntents.length,
    fallbackCount: input.localized.coverage.fallbackCount,
    scriptConsistencyScore,
    equationPreservationScore,
    multilingualReadinessScore,
  };
}

export function validateLocalization(input: {
  source: EditorialRealization;
  localized: LocalizedRealization;
}): {
  valid: boolean;
  issues: LocalizationValidationIssue[];
  metrics: LocalizationMetrics;
} {
  const issues: LocalizationValidationIssue[] = [];
  const metrics = createLocalizationMetrics(input);

  if (metrics.equationPreservationScore < 100) {
    issues.push({
      code: "equation_corruption",
      message: "Localized explanation changed universal equation lines.",
    });
  }
  if (
    input.localized.language !== "en" &&
    metrics.scriptConsistencyScore < 95
  ) {
    issues.push({
      code: "script_mismatch",
      message: "Localized narration contains mixed script or English leakage.",
    });
  }
  if (input.localized.coverage.fallbackCount > 0) {
    issues.push({
      code: "missing_intent",
      message: `Missing localization for ${input.localized.coverage.fallbackCount} intent lines.`,
    });
  }
  if (
    input.localized.language !== "en" &&
    input.localized.lines.some(
      (line) =>
        !isNeutralLine(line.renderedText) &&
        disallowedEnglishWords(line.renderedText).length > 0,
    )
  ) {
    issues.push({
      code: "english_leakage",
      message: "Localized rendering leaked English editorial text.",
    });
  }
  if (MOJIBAKE_RE.test(input.localized.explanation) || MOJIBAKE_RE.test(input.localized.stem)) {
    issues.push({
      code: "encoding_corruption",
      message: "Localized rendering contains mojibake or replacement characters.",
    });
  }
  const internalTerms = leakedInternalExplanationTerms(input.localized.explanation);
  if (internalTerms.length > 0) {
    issues.push({
      code: "internal_label_leakage",
      message: `Localized rendering leaked internal label terms: ${internalTerms.join(", ")}.`,
    });
  }
  if (isIncompleteEnding(finalExplanationLine(input.localized.explanation))) {
    issues.push({
      code: "incomplete_explanation",
      message:
        "Localized explanation ends without a complete numeric answer line.",
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics,
  };
}
