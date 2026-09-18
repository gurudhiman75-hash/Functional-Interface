const protectedExamTerms = [
  "Y. K. Alagh Task Force",
  "Lakdawala Expert Group",
  "Tendulkar Expert Group",
  "Rangarajan Expert Group",
  "Demand-pull inflation",
  "Cost-push inflation",
  "Headline inflation",
  "Core inflation",
  "GDP deflator",
  "Core CPI",
  "Disinflation",
  "Hyperinflation",
  "Poverty headcount ratio",
  "Headcount ratio",
] as const;

const allowedAbbreviations = [
  "I",
  "II",
  "CPI",
  "WPI",
  "GDP",
  "GNP",
  "NDP",
  "NNP",
  "NFIA",
  "GVA",
  "MoSPI",
  "LFPR",
  "WPR",
  "UR",
  "MGNREGA",
  "NCERT",
] as const;

export const ECO_PROTECTED_EXAM_TERMS_V1 = Object.freeze([...protectedExamTerms]);
export const ECO_ALLOWED_ROMAN_ABBREVIATIONS_V1 = Object.freeze([...allowedAbbreviations]);

const protectedSet = new Set<string>(ECO_PROTECTED_EXAM_TERMS_V1);

export function isEcoProtectedExamTermV1(value: string): boolean {
  return protectedSet.has(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripEcoAllowedRomanV1(text: string): string {
  let result = text;
  for (const term of [...ECO_PROTECTED_EXAM_TERMS_V1].sort((a, b) => b.length - a.length)) {
    result = result.split(term).join("");
  }
  const abbreviations = ECO_ALLOWED_ROMAN_ABBREVIATIONS_V1.map(escapeRegExp).join("|");
  return result.replace(new RegExp(`\\b(?:${abbreviations})\\b`, "gu"), "");
}
