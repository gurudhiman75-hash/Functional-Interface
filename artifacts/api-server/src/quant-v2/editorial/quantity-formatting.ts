import { roundClean } from "../utils/math-utils";
import type { LanguageCode } from "../localization/contracts/language-contracts";
import type { RealizationProfile } from "./realization-profiles";

export type QuantityType =
  | "currency"
  | "percentage"
  | "count"
  | "marks"
  | "population"
  | "quantity"
  | "absolute";

const CURRENCY_VARIABLE_RE =
  /(?:costPrice|sellingPrice|markedPrice|price|salary|wage|wages|income|expenditure|amount)$/iu;
const MARKS_VARIABLE_RE = /(?:marks?|score|shortBy|excessBy)$/iu;
const COUNT_VARIABLE_RE = /(?:votes?|voters?|population|people)$/iu;

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

export function formatQuantity(input: {
  value: number | undefined;
  type: QuantityType;
  language?: LanguageCode;
  profile?: RealizationProfile;
}) {
  const value = n(input.value);
  if (!value) {
    return "";
  }

  if (input.type === "currency") {
    return input.profile?.currencyStyle === "rs" ? `Rs. ${value}` : `\u20B9${value}`;
  }
  if (input.type === "percentage") {
    return `${value}%`;
  }
  return value;
}

export function currency(value: number | undefined, profile?: RealizationProfile) {
  return formatQuantity({
    value,
    type: "currency",
    profile,
  });
}

export const VARIABLE_QUANTITY_TYPES: Record<string, QuantityType> = {
  costPrice: "currency",
  sellingPrice: "currency",
  markedPrice: "currency",
  oldSalary: "currency",
  newSalary: "currency",
  income: "currency",
  wages: "currency",
  expenditure: "currency",
  winnerPercent: "percentage",
  loserPercent: "percentage",
  scoredPercent: "percentage",
  passPercent: "percentage",
  totalVotes: "count",
  validVotes: "count",
  margin: "count",
  totalMarks: "marks",
};

export function quantityTypeForVariable(variableName: string): QuantityType {
  if (VARIABLE_QUANTITY_TYPES[variableName]) {
    return VARIABLE_QUANTITY_TYPES[variableName];
  }
  if (CURRENCY_VARIABLE_RE.test(variableName)) {
    return "currency";
  }
  if (MARKS_VARIABLE_RE.test(variableName)) {
    return "marks";
  }
  if (COUNT_VARIABLE_RE.test(variableName)) {
    return "count";
  }
  if (/percent|rate|share/iu.test(variableName)) {
    return "percentage";
  }
  return "absolute";
}

export function quantityTypeForStemSubject(subject: string): QuantityType {
  if (/\b(?:price|salary|wage|income|expenditure|cost|selling|marked)\b/iu.test(subject)) {
    return "currency";
  }
  if (/\b(?:marks?|score)\b/iu.test(subject)) {
    return "marks";
  }
  if (/\b(?:votes?|voters?|population|people)\b/iu.test(subject)) {
    return "count";
  }
  return "absolute";
}
