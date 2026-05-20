import type {
  CanonicalPercentageProblem,
  PercentageSubtype,
} from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";

export type CompactnessBand = "ultra_compact" | "compact" | "balanced";

export type CorpusRealismMetrics = {
  compactnessBand: CompactnessBand;
  wordCount: number;
  maxAbsoluteValue: number;
  numberRealismScore: number;
  compactnessBalanceScore: number;
  objectRealismScore: number;
  domainAnchor: string;
  difficultyLayer: string;
};

export type CorpusRealismGovernorReport = {
  valid: boolean;
  issues: string[];
  metrics: CorpusRealismMetrics;
};

const PERCENTAGE_VARIABLE_RE = /percent|rate|share/iu;
const GENERIC_COMMERCIAL_RE =
  /\b(?:an item|a product|the product|the item|household appliance)\b/iu;
const REAL_OBJECT_RE =
  /\b(?:bicycle|refrigerator|mobile phone|wheat bag|sugar packet|cooking oil tin|television|laptop|school bag|shirt|rice bag)\b/iu;

const DOMAIN_BY_SUBTYPE: Partial<Record<PercentageSubtype, string>> = {
  election_margin: "election",
  pass_fail: "exam_marks",
  population_growth: "population",
  salary_revision: "income_salary",
  price_consumption: "household_expenditure",
  profit_loss: "commercial_objects",
  mixture_percentage: "mixture_usage",
  reverse_percentage: "reverse_quantity",
  restore_original: "price_recovery",
  increase_then_decrease: "price_or_quantity_change",
};

function stemWordCount(stem: string) {
  return stem.split(/\s+/u).filter(Boolean).length;
}

export function compactnessBandForStem(stem: string): CompactnessBand {
  const words = stemWordCount(stem);
  if (words < 11) {
    return "ultra_compact";
  }
  if (words <= 32) {
    return "compact";
  }
  return "balanced";
}

function nonPercentageValues(problem: CanonicalPercentageProblem) {
  return [
    ...Object.entries(problem.variables)
      .filter(([key]) => !PERCENTAGE_VARIABLE_RE.test(key))
      .map(([, value]) => value),
    problem.answer,
  ].filter((value) => Number.isFinite(value));
}

function maxAbsoluteValue(problem: CanonicalPercentageProblem) {
  return Math.max(
    0,
    ...nonPercentageValues(problem).map((value) => Math.abs(value)),
  );
}

function numberRealismScore(problem: CanonicalPercentageProblem) {
  const maxValue = maxAbsoluteValue(problem);
  if (maxValue <= 1_000_000) {
    return 100;
  }
  if (maxValue <= 1_500_000) {
    return 85;
  }
  return 65;
}

function compactnessBalanceScore(stem: string) {
  const words = stemWordCount(stem);
  if (words < 8) {
    return 72;
  }
  if (words < 11) {
    return 88;
  }
  if (words <= 42) {
    return 100;
  }
  if (words <= 58) {
    return 88;
  }
  return 70;
}

function objectRealismScore(problem: CanonicalPercentageProblem, stem: string) {
  if (!["profit_loss", "increase_then_decrease", "restore_original"].includes(problem.subtype)) {
    return 100;
  }
  if (REAL_OBJECT_RE.test(stem)) {
    return 100;
  }
  if (GENERIC_COMMERCIAL_RE.test(stem)) {
    return 78;
  }
  return 90;
}

export function createCorpusRealismGovernorReport(input: {
  problem: CanonicalPercentageProblem;
  editorial: EditorialRealization;
}): CorpusRealismGovernorReport {
  const issues: string[] = [];
  const stem = input.editorial.stem;
  const maxValue = maxAbsoluteValue(input.problem);
  const metrics: CorpusRealismMetrics = {
    compactnessBand: compactnessBandForStem(stem),
    wordCount: stemWordCount(stem),
    maxAbsoluteValue: maxValue,
    numberRealismScore: numberRealismScore(input.problem),
    compactnessBalanceScore: compactnessBalanceScore(stem),
    objectRealismScore: objectRealismScore(input.problem, stem),
    domainAnchor:
      DOMAIN_BY_SUBTYPE[input.problem.subtype] ?? input.problem.category,
    difficultyLayer: input.problem.difficulty,
  };

  if (metrics.maxAbsoluteValue > 1_000_000) {
    issues.push(
      `Visually heavy numeric scale: ${metrics.maxAbsoluteValue}. Prefer values below 10 lakh.`,
    );
  }
  if (metrics.compactnessBalanceScore < 85) {
    issues.push("Stem compactness is outside balanced exam cadence.");
  }
  if (metrics.objectRealismScore < 85) {
    issues.push("Commercial stem still uses generic object wording.");
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics,
  };
}
