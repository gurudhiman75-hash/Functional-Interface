const LABELS: Readonly<Record<string, string>> = {
  base: "base",
  commonBase: "common base",
  visible1: "first visible base",
  visible2: "second visible base",
  secondBase: "second base",
  numeratorBase: "numerator base",
  denominatorBase: "denominator base",
  reciprocalBase: "reciprocal base",
  rootBase: "root-compatible base",
  cubeBase: "cube-compatible base",
  exponent: "exponent",
  m: "first exponent",
  n: "second exponent",
  p: "denominator exponent",
  top: "numerator exponent",
  positive: "positive exponent",
  positivePower: "positive exponent",
  negativeExponent: "negative exponent",
  reciprocalExponent: "reciprocal exponent",
  numerator: "fractional numerator",
  denominator: "fractional denominator",
  rootIndex: "root index",
  fractionalExponent: "fractional exponent",
  exactExponent: "exact exponent",
  decimalExponent: "decimal exponent",
};

export function describeSriGivenState(state: Readonly<Record<string, string | number | boolean>>): string {
  const parts = Object.entries(state).map(([key, value]) => `${LABELS[key] ?? key.replace(/([A-Z])/g, " $1").toLowerCase()} = ${String(value)}`);
  return `Given ${parts.join(", ")}.`;
}
