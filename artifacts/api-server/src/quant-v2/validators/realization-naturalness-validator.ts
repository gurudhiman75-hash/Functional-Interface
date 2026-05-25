import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { LocalizedRealization } from "../localization/contracts/language-contracts";

const OVER_NARRATIVE_RE =
  /\b(?:warehouse stock reduction|quantity in a mixture tank|retail electronics vendor|operating in a busy market|excessively detailed|according to a detailed|after a warehouse stock reduction)\b/iu;
const FILLER_RE =
  /\b(?:given below|carefully|as we know|it is clear that|from the above discussion)\b/iu;
const DUPLICATED_STEM_FRAGMENT_RE =
  /\b(?:the marked price|the price|the quantity|a quantity),\s+(?:the marked price|the price|the quantity|a quantity)\b/iu;
const VERBOSE_ARTICLE_RE =
  /\b(?:The price of a household appliance|the price of the appliance|After a salary revision|warehouse stock|mixture tank)\b/iu;

function scorePenalty(base: number, penalty: number) {
  return Math.max(0, base - penalty);
}

export function validateRealizationNaturalness(input: {
  problem: CanonicalPercentageProblem;
  editorial: EditorialRealization;
  localized?: readonly LocalizedRealization[];
  optionsHi?: readonly string[];
  optionsPa?: readonly string[];
}) {
  const issues: string[] = [];
  let compactnessScore = 100;
  let examCadenceScore = 100;
  let optionLocalizationScore = 100;
  let quantityFormattingScore = 100;

  const stem = input.editorial.stem;
  const words = stem.split(/\s+/u).filter(Boolean).length;

  if (words > 42) {
    issues.push("English stem is too narrativized for compact exam style.");
    compactnessScore = scorePenalty(compactnessScore, Math.min(30, words - 42));
  }
  if (OVER_NARRATIVE_RE.test(stem)) {
    issues.push("English stem contains synthetic realism wording.");
    examCadenceScore = scorePenalty(examCadenceScore, 35);
  }
  if (VERBOSE_ARTICLE_RE.test(stem)) {
    issues.push("English stem contains verbose realism wrappers.");
    examCadenceScore = scorePenalty(examCadenceScore, 25);
  }
  if (FILLER_RE.test(`${stem}\n${input.editorial.explanation}`)) {
    issues.push("Realization contains filler narration.");
    examCadenceScore = scorePenalty(examCadenceScore, 20);
  }
  if (DUPLICATED_STEM_FRAGMENT_RE.test(stem)) {
    issues.push("Stem contains duplicated semantic fragments.");
    compactnessScore = scorePenalty(compactnessScore, 35);
  }

  if (
    ["profit_loss", "salary_revision"].includes(input.problem.subtype) &&
    !/[\u20B9]|Rs\./u.test(stem)
  ) {
    issues.push("Currency-related stem lacks semantic currency formatting.");
    quantityFormattingScore = 70;
  }
  if (
    input.problem.subtype === "increase_then_decrease" &&
    /\b(?:marked price|price of an item)\b/iu.test(stem) &&
    !/[\u20B9]|Rs\./u.test(stem)
  ) {
    issues.push("Price-change stem lacks currency formatting.");
    quantityFormattingScore = 70;
  }

  const hindiOptions = input.optionsHi?.join(" ") ?? "";
  const punjabiOptions = input.optionsPa?.join(" ") ?? "";
  if (
    input.problem.subtype === "profit_loss" &&
    (!/लाभ|हानि/u.test(hindiOptions) || !/ਲਾਭ|ਨੁਕਸਾਨ/u.test(punjabiOptions))
  ) {
    issues.push("Profit/loss options are not semantically localized.");
    optionLocalizationScore = 65;
  }
  if (
    input.problem.subtype === "price_consumption" &&
    input.problem.variables.quantityDifference === undefined &&
    (!/कमी|वृद्धि/u.test(hindiOptions) || !/ਕਮੀ|ਵਾਧਾ/u.test(punjabiOptions))
  ) {
    issues.push("Consumption-change options are not semantically localized.");
    optionLocalizationScore = 75;
  }
  if (
    input.problem.subtype === "price_consumption" &&
    !/price .*increased by \d+(?:\.\d+)?%/iu.test(stem)
  ) {
    issues.push("Price-consumption scenario is not aligned to compact English cadence.");
    examCadenceScore = scorePenalty(examCadenceScore, 30);
  }

  const localizedStems = input.localized ?? [];
  for (const localized of localizedStems) {
    if (
      localized.language !== "en" &&
      localized.stem.trim() === input.editorial.stem.trim()
    ) {
      issues.push(`${localized.language} stem fell back to English.`);
      optionLocalizationScore = scorePenalty(optionLocalizationScore, 25);
    }
  }

  const naturalnessScore = Math.round(
    (
      compactnessScore +
      examCadenceScore +
      optionLocalizationScore +
      quantityFormattingScore
    ) / 4,
  );

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      compactnessScore,
      examCadenceScore,
      optionLocalizationScore,
      quantityFormattingScore,
      naturalnessScore,
    },
  };
}
