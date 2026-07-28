import type { Avg001QuestionPackage, Rational } from "./types";

export function qlNumber(pkg: Avg001QuestionPackage) {
  return Number(pkg.questionLanguageId.slice(-3));
}

export function variant(pkg: Avg001QuestionPackage) {
  return pkg.parameters.scenarioVariant
    .replace(/^findCount_/, "")
    .replace(/^findAverage_/, "");
}

export function rationalText(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && "numerator" in value && "denominator" in value) {
    const number = value as Rational;
    if (number.denominator === 1) return String(number.numerator);
    const decimal = number.numerator / number.denominator;
    return Number.isInteger(decimal * 10)
      ? decimal.toFixed(1)
      : `${number.numerator}/${number.denominator}`;
  }
  return "";
}

export function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  return rationalText(pkg.parameters.values[key]);
}
