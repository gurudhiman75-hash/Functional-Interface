import questionLanguageLibrary from "./question-language.library.json" assert { type: "json" };
import { simplifySurd } from "./formatter";

type Variables = Record<string, number | string>;

function getStem(cpId: string, qlId: string): string {
  const item = questionLanguageLibrary.items.find((entry) => entry.id === qlId);
  if (!item) {
    throw new Error(`Unknown question language id: ${qlId}`);
  }
  if (item.cpId !== cpId) {
    throw new Error(`Question language id ${qlId} belongs to ${item.cpId}, not ${cpId}`);
  }
  return item.stem;
}

function inferRootIndex(stem: string): number {
  return stem.includes("\\sqrt[3]") ? 3 : 2;
}

function isPerfectPower(value: number, index: number): boolean {
  if (index === 3) {
    const root = Math.round(Math.cbrt(value));
    return root ** 3 === value;
  }
  const root = Math.round(Math.sqrt(value));
  return root ** 2 === value;
}

function evaluateComparisonValues(variables: Variables): number[] {
  const values = [
    Number(variables.leftCoefficient ?? 1) * Math.sqrt(Number(variables.leftRadicand ?? 0)),
    Number(variables.rightCoefficient ?? 1) * Math.sqrt(Number(variables.rightRadicand ?? 0)),
  ];
  if (variables.middleRadicand !== undefined) {
    values.push(
      Number(variables.middleCoefficient ?? 1) * Math.sqrt(Number(variables.middleRadicand)),
    );
  }
  return values;
}

export function validate(cpId: string, qlId: string, variables: Variables): { valid: boolean; reason?: string } {
  const stem = getStem(cpId, qlId);
  const rootIndex = inferRootIndex(stem);

  for (const [key, value] of Object.entries(variables)) {
    if (typeof value !== "number") {
      continue;
    }
    if (key.toLowerCase().includes("radicand") && value <= 0) {
      return { valid: false, reason: `Invalid radicand: ${key}=${value}` };
    }
    if (
      (key.toLowerCase().includes("coefficient") || key === "numerator" || key === "constantTerm") &&
      value === 0
    ) {
      return { valid: false, reason: `Zero coefficient-like value: ${key}` };
    }
  }

  if (cpId === "CP01") {
    const radicand = Number(variables.radicand);
    const simplified = simplifySurd(radicand, rootIndex);
    if (isPerfectPower(radicand, rootIndex)) {
      return { valid: false, reason: "Perfect power not allowed for CP01" };
    }
    if (simplified.coeff === 1 || simplified.radicand === 1) {
      return { valid: false, reason: "CP01 requires non-trivial extraction with a surd remaining" };
    }
  }

  if (cpId === "CP02" || cpId === "CP04") {
    const radicandKeys = Object.keys(variables).filter((key) => key.toLowerCase().includes("radicand"));
    const simplifiedRadicands = radicandKeys.map((key) => simplifySurd(Number(variables[key]), rootIndex).radicand);
    if (simplifiedRadicands.some((value) => value === 1)) {
      return { valid: false, reason: "Perfect powers are not allowed in surd combination questions" };
    }
    const unique = new Set(simplifiedRadicands);
    if (unique.size > 1) {
      return { valid: false, reason: "Surd terms do not simplify to compatible radical parts" };
    }
  }

  if (cpId === "CP03") {
    const radicandKeys = Object.keys(variables).filter((key) => key.toLowerCase().includes("radicand"));
    if (radicandKeys.some((key) => isPerfectPower(Number(variables[key]), rootIndex))) {
      return { valid: false, reason: "Perfect-power radicands are not allowed in CP03" };
    }
    if (stem.includes("\\div") || stem.includes("\\frac") || stem.toLowerCase().includes("quotient")) {
      const numeratorRadicand = Number(variables.numeratorRadicand);
      const denominatorRadicand = Number(variables.denominatorRadicand);
      if (denominatorRadicand <= 0 || numeratorRadicand % denominatorRadicand !== 0) {
        return { valid: false, reason: "Division case must reduce to a positive integer radicand quotient" };
      }
    }
  }

  if (cpId === "CP05") {
    const radicandKeys = Object.keys(variables).filter((key) => key.toLowerCase().includes("radicand"));
    if (radicandKeys.some((key) => isPerfectPower(Number(variables[key]), 2))) {
      return { valid: false, reason: "Perfect-square radicands are not allowed in CP05" };
    }
    const values = evaluateComparisonValues(variables);
    const unique = new Set(values.map((value) => value.toFixed(12)));
    if (unique.size !== values.length) {
      return { valid: false, reason: "Duplicate comparison values" };
    }
  }

  if (cpId === "CP06") {
    const denominatorRadicand = Number(variables.denominatorRadicand);
    if (isPerfectPower(denominatorRadicand, rootIndex)) {
      return { valid: false, reason: "Rationalization denominator must remain irrational before simplification" };
    }
    if (variables.denominatorCoefficient !== undefined && Number(variables.denominatorCoefficient) <= 0) {
      return { valid: false, reason: "Invalid denominator coefficient" };
    }
  }

  if (cpId === "CP07") {
    const radicandKeys = Object.keys(variables).filter((key) => key.toLowerCase().includes("radicand"));
    if (radicandKeys.some((key) => isPerfectPower(Number(variables[key]), 2))) {
      return { valid: false, reason: "Perfect-square radicands are not allowed in CP07" };
    }
    if (variables.constantTerm !== undefined && variables.denominatorRadicand !== undefined) {
      if (Number(variables.constantTerm) ** 2 === Number(variables.denominatorRadicand)) {
        return { valid: false, reason: "Binomial denominator collapses to zero after conjugate expansion" };
      }
    }
    if (variables.leftRadicand !== undefined && variables.rightRadicand !== undefined) {
      if (Number(variables.leftRadicand) === Number(variables.rightRadicand)) {
        return { valid: false, reason: "Duplicate surd denominator terms are not allowed" };
      }
    }
  }

  if (cpId === "CP08") {
    const radicandKeys = Object.keys(variables).filter((key) => key.toLowerCase().includes("radicand"));
    for (const key of radicandKeys) {
      if (isPerfectPower(Number(variables[key]), 2)) {
        return { valid: false, reason: `Perfect square not allowed in identity evaluation: ${key}` };
      }
    }
  }

  return { valid: true };
}
