import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type {
  LanguageCode,
  LocalizedRealization,
} from "../contracts/language-contracts";

const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;
const ENGLISH_LEAKAGE_RE =
  /\b(?:during|seasonal|sale|price|machine|product|candidate|winner|opponent|votes|find|total|value|population|marks|test|salary|employee|mixture|profit|loss|increase|decrease|consumption|expenditure|retailer|sold|cost|selling)\b/iu;

export interface MultilingualStemValidationResult {
  valid: boolean;
  issues: string[];
  metrics: {
    stemLocalizationScore: number;
    scriptConsistencyScore: number;
    englishLeakageScore: number;
    numberPreservationScore: number;
    fallbackAvoidanceScore: number;
  };
}

function formattedNumber(value: number) {
  const rounded = Number.isInteger(value)
    ? value
    : Number(value.toFixed(2));
  return String(rounded).replace(/\.0+$/u, "");
}

function variableNumbersVisibleInSource(
  problem: CanonicalPercentageProblem | undefined,
  sourceStem: string,
) {
  if (!problem) {
    return [];
  }
  const source = sourceStem.replace(/,/gu, "");
  const numbers = new Set<string>();
  for (const value of Object.values(problem.variables)) {
    const formatted = formattedNumber(Math.abs(value));
    if (formatted && source.includes(formatted)) {
      numbers.add(formatted);
    }
  }
  return [...numbers];
}

function scriptScore(language: LanguageCode, stem: string) {
  if (language === "hi") {
    return DEVANAGARI_RE.test(stem) ? 100 : 0;
  }
  if (language === "pa") {
    return GURMUKHI_RE.test(stem) ? 100 : 0;
  }
  return 100;
}

function numberScore(expectedNumbers: readonly string[], stem: string) {
  if (expectedNumbers.length === 0) {
    return 100;
  }
  const normalized = stem.replace(/,/gu, "");
  const preserved = expectedNumbers.filter((number) =>
    normalized.includes(number),
  ).length;
  return Math.round((preserved / expectedNumbers.length) * 100);
}

export function validateMultilingualStem(input: {
  language: LanguageCode;
  source: EditorialRealization;
  localized: LocalizedRealization;
  problem?: CanonicalPercentageProblem;
}): MultilingualStemValidationResult {
  const issues: string[] = [];
  const stem = input.localized.stem.trim();
  const expectedNumbers = variableNumbersVisibleInSource(
    input.problem,
    input.source.stem,
  );

  const hasStem = stem.length > 0;
  const sameAsEnglish = stem === input.source.stem.trim();
  const scriptConsistencyScore = scriptScore(input.language, stem);
  const englishLeakageScore =
    input.language === "en" || !ENGLISH_LEAKAGE_RE.test(stem) ? 100 : 0;
  const numberPreservationScore = numberScore(expectedNumbers, stem);
  const fallbackAvoidanceScore =
    input.language === "en" || !sameAsEnglish ? 100 : 0;

  if (!hasStem) {
    issues.push("Localized stem is missing.");
  }
  if (input.language !== "en" && sameAsEnglish) {
    issues.push("Localized stem fell back to the English stem.");
  }
  if (scriptConsistencyScore < 100) {
    issues.push(`Stem does not contain the expected ${input.language} script.`);
  }
  if (englishLeakageScore < 100) {
    issues.push("Localized stem contains English wording leakage.");
  }
  if (numberPreservationScore < 80) {
    issues.push("Localized stem did not preserve enough semantic numbers.");
  }

  const stemLocalizationScore = Math.round(
    (
      scriptConsistencyScore +
      englishLeakageScore +
      numberPreservationScore +
      fallbackAvoidanceScore
    ) / 4,
  );

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      stemLocalizationScore,
      scriptConsistencyScore,
      englishLeakageScore,
      numberPreservationScore,
      fallbackAvoidanceScore,
    },
  };
}
