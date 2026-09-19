export type EcoTermDispositionV1 = "NATIVE" | "PROTECTED_ENGLISH" | "ABBREVIATION";

export type EcoTermPolicyEntryV1 = Readonly<{
  term: string;
  disposition: EcoTermDispositionV1;
}>;

const nativeTerms = [
  "Scarcity",
  "Opportunity cost",
  "Utility",
  "Production",
  "Consumption",
  "Distribution",
  "Demand",
  "Supply",
  "Market",
  "Microeconomics",
  "Macroeconomics",
  "Land",
  "Labour",
  "Capital",
  "Entrepreneurship",
  "Market economy",
  "Socialist economy",
  "Mixed economy",
  "Primary sector",
  "Secondary sector",
  "Tertiary sector",
  "Public sector",
  "Private sector",
  "Organised sector",
  "Unorganised sector",
  "Depreciation",
  "Nominal GDP",
  "Real GDP",
  "Per-capita income",
  "Value added",
  "Final",
  "Intermediate",
  "Double counting",
  "Inflation",
  "Deflation",
  "Purchasing power",
  "Base effect",
  "Revaluation",
  "Price index",
  "Labour force",
  "Worker",
  "Unemployed",
  "Self-employed",
  "Seasonal unemployment",
  "Disguised unemployment",
  "Structural unemployment",
  "Frictional unemployment",
  "Cyclical unemployment",
  "Absolute poverty",
  "Relative poverty",
  "Multidimensional poverty",
  "Poverty line",
  "Unemployment rate",
  "Worker population ratio",
  "Labour force participation rate",
  "Seasonal poverty",
  "Cyclical poverty",
  "Barter exchange",
  "Double coincidence of wants",
  "Medium of exchange",
  "Unit of account",
  "Store of value",
  "Standard of deferred payment",
  "Demand deposit",
  "Time deposit",
  "Money supply",
  "Monetary authority",
  "Government debt manager",
  "Regulation and supervision",
  "Manager of foreign exchange",
  "Developmental role",
] as const;

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
  "Fiat money",
  "Legal tender",
  "Reserve money",
  "High-powered money",
  "Narrow money",
  "Broad money",
  "Money multiplier",
  "Lender of last resort",
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
  "RBI",
  "FEMA",
  "PSS",
  "SEBI",
  "NABARD",
  "NSC",
  "NSCs",
] as const;

export const ECO_TERM_POLICY_V1: readonly EcoTermPolicyEntryV1[] = Object.freeze([
  ...nativeTerms.map((term) => ({ term, disposition: "NATIVE" as const })),
  ...protectedExamTerms.map((term) => ({ term, disposition: "PROTECTED_ENGLISH" as const })),
  ...allowedAbbreviations.map((term) => ({ term, disposition: "ABBREVIATION" as const })),
]);

export const ECO_NATIVE_TERMS_V1 = Object.freeze(
  ECO_TERM_POLICY_V1.filter((entry) => entry.disposition === "NATIVE").map((entry) => entry.term),
);

export const ECO_PROTECTED_EXAM_TERMS_V1 = Object.freeze(
  ECO_TERM_POLICY_V1.filter((entry) => entry.disposition === "PROTECTED_ENGLISH").map((entry) => entry.term),
);

export const ECO_ALLOWED_ROMAN_ABBREVIATIONS_V1 = Object.freeze(
  ECO_TERM_POLICY_V1.filter((entry) => entry.disposition === "ABBREVIATION").map((entry) => entry.term),
);

const protectedSet = new Set<string>(ECO_PROTECTED_EXAM_TERMS_V1);

export function isEcoProtectedExamTermV1(value: string): boolean {
  return protectedSet.has(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeTerm(text: string, term: string): boolean {
  const escaped = escapeRegExp(term);
  return new RegExp(`(^|[^A-Za-z])${escaped}(?=$|[^A-Za-z])`, "u").test(text);
}

function stripProtectedExamTerms(text: string): string {
  let result = text;
  for (const term of [...ECO_PROTECTED_EXAM_TERMS_V1].sort((a, b) => b.length - a.length)) {
    result = result.split(term).join("");
  }
  return result;
}

export function findEcoNativeTermsStillInEnglishV1(englishText: string, localizedText: string): string[] {
  const englishWithoutProtected = stripProtectedExamTerms(englishText);
  const localizedWithoutProtected = stripProtectedExamTerms(localizedText);
  return ECO_NATIVE_TERMS_V1.filter(
    (term) => containsWholeTerm(englishWithoutProtected, term) && containsWholeTerm(localizedWithoutProtected, term),
  );
}

export function stripEcoAllowedRomanV1(text: string): string {
  const result = stripProtectedExamTerms(text);
  const abbreviations = ECO_ALLOWED_ROMAN_ABBREVIATIONS_V1.map(escapeRegExp).join("|");
  return result.replace(new RegExp(`\\b(?:${abbreviations})\\b`, "gu"), "");
}
