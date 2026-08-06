import type {
  ExactPi,
  ExactPiSurd,
  ExactRational,
  ExactSurd,
  ExactValue,
  Men002Unit,
} from "./types";

function abs(value: bigint) {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint) {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1): ExactRational {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw new Error("Exact rational denominator cannot be zero.");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return {
    kind: "RATIONAL",
    numerator: (n / divisor) * sign,
    denominator: abs(d / divisor),
  };
}

export function add(a: ExactRational, b: ExactRational) {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtract(a: ExactRational, b: ExactRational) {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiply(a: ExactRational, b: ExactRational) {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divide(a: ExactRational, b: ExactRational) {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function square(a: ExactRational) {
  return multiply(a, a);
}

export function cube(a: ExactRational) {
  return multiply(square(a), a);
}

function extractSquareFactor(value: bigint) {
  if (value <= 0n) throw new Error("A real surd radicand must be positive.");
  let outside = 1n;
  let inside = value;
  for (let factor = 2n; factor * factor <= inside; factor += 1n) {
    const squareFactor = factor * factor;
    while (inside % squareFactor === 0n) {
      outside *= factor;
      inside /= squareFactor;
    }
  }
  return { outside, inside };
}

export function surd(
  coefficientNumerator: bigint | number,
  radicand: bigint | number,
  coefficientDenominator: bigint | number = 1,
): ExactValue {
  const reducedCoefficient = rational(coefficientNumerator, coefficientDenominator);
  const reducedRadicand = BigInt(radicand);
  const { outside, inside } = extractSquareFactor(reducedRadicand);
  const coefficient = multiply(reducedCoefficient, rational(outside));
  if (inside === 1n) return coefficient;
  return {
    kind: "SURD",
    coefficient,
    radicand: inside,
  } satisfies ExactSurd;
}

export function pi(
  coefficientNumerator: bigint | number = 1,
  coefficientDenominator: bigint | number = 1,
): ExactPi {
  return {
    kind: "PI",
    coefficient: rational(coefficientNumerator, coefficientDenominator),
  };
}

export function piSurd(
  coefficientNumerator: bigint | number,
  radicand: bigint | number,
  coefficientDenominator: bigint | number = 1,
): ExactValue {
  const reducedCoefficient = rational(coefficientNumerator, coefficientDenominator);
  const reducedRadicand = BigInt(radicand);
  const { outside, inside } = extractSquareFactor(reducedRadicand);
  const coefficient = multiply(reducedCoefficient, rational(outside));
  if (inside === 1n) return pi(coefficient.numerator, coefficient.denominator);
  return {
    kind: "PI_SURD",
    coefficient,
    radicand: inside,
  } satisfies ExactPiSurd;
}

export function exactKey(value: ExactValue) {
  switch (value.kind) {
    case "RATIONAL": return `R:${value.numerator}/${value.denominator}`;
    case "SURD": return `S:${value.coefficient.numerator}/${value.coefficient.denominator}:sqrt(${value.radicand})`;
    case "PI": return `P:${value.coefficient.numerator}/${value.coefficient.denominator}`;
    case "PI_SURD": return `PS:${value.coefficient.numerator}/${value.coefficient.denominator}:sqrt(${value.radicand})`;
  }
}

export function exactEquals(a: ExactValue, b: ExactValue) {
  return exactKey(a) === exactKey(b);
}

export function isPositive(value: ExactValue) {
  return value.kind === "RATIONAL"
    ? value.numerator > 0n
    : value.coefficient.numerator > 0n;
}

export function rationalToNumber(value: ExactRational) {
  return Number(value.numerator) / Number(value.denominator);
}

function formatRationalMath(value: ExactRational) {
  if (value.denominator === 1n) return `${value.numerator}`;
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}

function formatRationalPlain(value: ExactRational) {
  if (value.denominator === 1n) return `${value.numerator}`;
  return `${value.numerator}/${value.denominator}`;
}

function formatMonomialCoefficientMath(coefficient: ExactRational) {
  if (coefficient.numerator === coefficient.denominator) return "";
  if (coefficient.numerator === -coefficient.denominator) return "-";
  return formatRationalMath(coefficient);
}

function formatMonomialCoefficientPlain(coefficient: ExactRational) {
  if (coefficient.numerator === coefficient.denominator) return "";
  if (coefficient.numerator === -coefficient.denominator) return "-";
  return formatRationalPlain(coefficient);
}

export function formatIndianInteger(value: bigint | number) {
  const integer = BigInt(value);
  const negative = integer < 0n;
  const digits = (negative ? -integer : integer).toString();
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3);
  const groups: string[] = [];
  for (let index = leading.length; index > 0; index -= 2) {
    groups.unshift(leading.slice(Math.max(0, index - 2), index));
  }
  return `${negative ? "-" : ""}${groups.join(",")},${lastThree}`;
}

export function formatExactMath(value: ExactValue) {
  switch (value.kind) {
    case "RATIONAL": return formatRationalMath(value);
    case "SURD": return `${formatMonomialCoefficientMath(value.coefficient)}\\sqrt{${value.radicand}}`;
    case "PI": return `${formatMonomialCoefficientMath(value.coefficient)}\\pi`;
    case "PI_SURD": return `${formatMonomialCoefficientMath(value.coefficient)}\\pi\\sqrt{${value.radicand}}`;
  }
}

export function formatExactPlain(value: ExactValue) {
  switch (value.kind) {
    case "RATIONAL": return formatRationalPlain(value);
    case "SURD": return `${formatMonomialCoefficientPlain(value.coefficient)}√${value.radicand}`;
    case "PI": return `${formatMonomialCoefficientPlain(value.coefficient)}π`;
    case "PI_SURD": return `${formatMonomialCoefficientPlain(value.coefficient)}π√${value.radicand}`;
  }
}

function formatCurrencyAmountMath(value: ExactValue) {
  if (value.kind !== "RATIONAL") return `\\text{₹}${formatExactMath(value)}`;
  const numerator = formatIndianInteger(value.numerator);
  if (value.denominator === 1n) return `\\text{₹}${numerator}`;
  return `\\text{₹}\\frac{${numerator}}{${formatIndianInteger(value.denominator)}}`;
}

function formatCurrencyRateMath(value: ExactValue, denominatorMath: string) {
  if (value.kind !== "RATIONAL") {
    return `\\frac{\\text{₹}${formatExactMath(value)}}{${denominatorMath}}`;
  }
  const numerator = formatIndianInteger(value.numerator);
  const rationalDenominator = value.denominator === 1n
    ? denominatorMath
    : `${formatIndianInteger(value.denominator)}${denominatorMath}`;
  return `\\frac{\\text{₹}${numerator}}{${rationalDenominator}}`;
}

function formatUnitMath(unit: Men002Unit) {
  switch (unit) {
    case "cm²": return "\\text{ cm}^{2}";
    case "m²": return "\\text{ m}^{2}";
    case "cm³": return "\\text{ cm}^{3}";
    case "m³": return "\\text{ m}^{3}";
    case "%": return "\\%";
    case "₹": return "\\text{₹}";
    case "₹/m": return "\\frac{\\text{₹}}{\\text{m}}";
    case "₹/m²": return "\\frac{\\text{₹}}{\\text{m}^{2}}";
    case "₹/m³": return "\\frac{\\text{₹}}{\\text{m}^{3}}";
    default: return `\\text{ ${unit}}`;
  }
}

export function formatWithUnit(value: ExactValue, unit: Men002Unit) {
  const maths = formatExactMath(value);
  if (unit === "₹") return `$${formatCurrencyAmountMath(value)}$`;
  if (unit === "₹/m") return `$${formatCurrencyRateMath(value, "\\text{m}")}$`;
  if (unit === "₹/m²") return `$${formatCurrencyRateMath(value, "\\text{m}^{2}")}$`;
  if (unit === "₹/m³") return `$${formatCurrencyRateMath(value, "\\text{m}^{3}")}$`;
  return `$${maths}${formatUnitMath(unit)}$`;
}

export function integerCubeRoot(value: bigint) {
  if (value < 0n) throw new Error("Cube root domain must be non-negative.");
  let low = 0n;
  let high = value + 1n;
  while (low + 1n < high) {
    const middle = (low + high) / 2n;
    const cubed = middle * middle * middle;
    if (cubed <= value) low = middle;
    else high = middle;
  }
  if (low * low * low !== value) throw new Error(`${value} is not a perfect cube.`);
  return low;
}

export function integerSquareRoot(value: bigint) {
  if (value < 0n) throw new Error("Square root domain must be non-negative.");
  let low = 0n;
  let high = value + 1n;
  while (low + 1n < high) {
    const middle = (low + high) / 2n;
    const squared = middle * middle;
    if (squared <= value) low = middle;
    else high = middle;
  }
  if (low * low !== value) return null;
  return low;
}

export function exactFromSquaredLength(value: bigint): ExactValue {
  const root = integerSquareRoot(value);
  return root === null ? surd(1, value) : rational(root);
}
