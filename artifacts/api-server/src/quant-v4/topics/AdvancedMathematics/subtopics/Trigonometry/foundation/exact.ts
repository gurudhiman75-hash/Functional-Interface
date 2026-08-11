import type {
  ExactNumberClass,
  ExactRadicalTerm,
  ExactRational,
  ExactTrigNumber,
  ExactTrigResult,
  ExactUndefined,
  ExactUndefinedReason,
} from "./types";

const MAX_RADICAL_PRIMES = 6;

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

export function rational(
  numerator: bigint | number,
  denominator: bigint | number = 1,
): ExactRational {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw new Error("Exact rational denominator cannot be zero.");
  if (n === 0n) return { kind: "RATIONAL", numerator: 0n, denominator: 1n };
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return {
    kind: "RATIONAL",
    numerator: (n / divisor) * sign,
    denominator: abs(d / divisor),
  };
}

export function rationalAdd(a: ExactRational, b: ExactRational) {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function rationalSubtract(a: ExactRational, b: ExactRational) {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function rationalMultiply(a: ExactRational, b: ExactRational) {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function rationalDivide(a: ExactRational, b: ExactRational) {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero rational.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function rationalNegate(value: ExactRational) {
  return rational(-value.numerator, value.denominator);
}

export function rationalEquals(a: ExactRational, b: ExactRational) {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export function rationalCompare(a: ExactRational, b: ExactRational) {
  const difference = a.numerator * b.denominator - b.numerator * a.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function rationalIsZero(value: ExactRational) {
  return value.numerator === 0n;
}

export function rationalToNumber(value: ExactRational) {
  return Number(value.numerator) / Number(value.denominator);
}

function squareFreeDecomposition(value: bigint) {
  if (value <= 0n) throw new Error("Real radical radicand must be positive.");
  let remaining = value;
  let outside = 1n;
  let inside = 1n;
  let factor = 2n;
  while (factor * factor <= remaining) {
    let exponent = 0;
    while (remaining % factor === 0n) {
      exponent += 1;
      remaining /= factor;
    }
    if (exponent > 0) {
      for (let index = 0; index < Math.floor(exponent / 2); index += 1) outside *= factor;
      if (exponent % 2 === 1) inside *= factor;
    }
    factor = factor === 2n ? 3n : factor + 2n;
  }
  if (remaining > 1n) inside *= remaining;
  return { outside, inside };
}

function normalizeTerms(terms: ExactRadicalTerm[]): ExactRadicalTerm[] {
  const combined = new Map<string, { radicand: bigint; coefficient: ExactRational }>();

  for (const term of terms) {
    if (term.radicand <= 0n) throw new Error("Real radical radicand must be positive.");
    if (rationalIsZero(term.coefficient)) continue;
    const { outside, inside } = squareFreeDecomposition(term.radicand);
    const coefficient = rationalMultiply(term.coefficient, rational(outside));
    const key = inside.toString();
    const existing = combined.get(key);
    combined.set(key, {
      radicand: inside,
      coefficient: existing
        ? rationalAdd(existing.coefficient, coefficient)
        : coefficient,
    });
  }

  return [...combined.values()]
    .filter((term) => !rationalIsZero(term.coefficient))
    .sort((a, b) => (a.radicand < b.radicand ? -1 : a.radicand > b.radicand ? 1 : 0));
}

export function exactFromTerms(terms: ExactRadicalTerm[]): ExactTrigNumber {
  return { kind: "RADICAL_SUM", terms: normalizeTerms(terms) };
}

export function exactInteger(value: bigint | number): ExactTrigNumber {
  return exactFromTerms([{ radicand: 1n, coefficient: rational(value) }]);
}

export function exactRational(
  numerator: bigint | number,
  denominator: bigint | number = 1,
): ExactTrigNumber {
  return exactFromTerms([{ radicand: 1n, coefficient: rational(numerator, denominator) }]);
}

export function exactSurd(
  coefficientNumerator: bigint | number,
  radicand: bigint | number,
  coefficientDenominator: bigint | number = 1,
): ExactTrigNumber {
  return exactFromTerms([{
    radicand: BigInt(radicand),
    coefficient: rational(coefficientNumerator, coefficientDenominator),
  }]);
}

export function exactRationalSurd(
  rationalNumerator: bigint | number,
  rationalDenominator: bigint | number,
  surdNumerator: bigint | number,
  radicand: bigint | number,
  surdDenominator: bigint | number = 1,
): ExactTrigNumber {
  return exactFromTerms([
    { radicand: 1n, coefficient: rational(rationalNumerator, rationalDenominator) },
    { radicand: BigInt(radicand), coefficient: rational(surdNumerator, surdDenominator) },
  ]);
}

export function exactUndefined(
  reason: ExactUndefinedReason,
  detail?: string,
): ExactUndefined {
  return { kind: "UNDEFINED", reason, ...(detail ? { detail } : {}) };
}

export function isUndefined(value: ExactTrigResult): value is ExactUndefined {
  return value.kind === "UNDEFINED";
}

export function isZeroExact(value: ExactTrigNumber) {
  return value.terms.length === 0;
}

export function negateExact(value: ExactTrigNumber): ExactTrigNumber {
  return exactFromTerms(value.terms.map((term) => ({
    radicand: term.radicand,
    coefficient: rationalNegate(term.coefficient),
  })));
}

export function addExact(a: ExactTrigNumber, b: ExactTrigNumber): ExactTrigNumber {
  return exactFromTerms([...a.terms, ...b.terms]);
}

export function subtractExact(a: ExactTrigNumber, b: ExactTrigNumber): ExactTrigNumber {
  return addExact(a, negateExact(b));
}

export function multiplyExact(a: ExactTrigNumber, b: ExactTrigNumber): ExactTrigNumber {
  if (isZeroExact(a) || isZeroExact(b)) return exactInteger(0);
  const terms: ExactRadicalTerm[] = [];
  for (const left of a.terms) {
    for (const right of b.terms) {
      terms.push({
        radicand: left.radicand * right.radicand,
        coefficient: rationalMultiply(left.coefficient, right.coefficient),
      });
    }
  }
  return exactFromTerms(terms);
}

function primeFactors(value: bigint) {
  if (value <= 0n) throw new Error("Prime factorization requires a positive integer.");
  const factors: bigint[] = [];
  let remaining = value;
  let factor = 2n;
  while (factor * factor <= remaining) {
    if (remaining % factor === 0n) {
      factors.push(factor);
      while (remaining % factor === 0n) remaining /= factor;
    }
    factor = factor === 2n ? 3n : factor + 2n;
  }
  if (remaining > 1n) factors.push(remaining);
  return factors;
}

function radicalPrimeBasis(value: ExactTrigNumber) {
  const seen = new Map<string, bigint>();
  for (const term of value.terms) {
    if (term.radicand === 1n) continue;
    for (const factor of primeFactors(term.radicand)) seen.set(factor.toString(), factor);
  }
  return [...seen.values()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function fieldBasis(primes: bigint[]) {
  const size = 1 << primes.length;
  const basis: bigint[] = [];
  for (let mask = 0; mask < size; mask += 1) {
    let radicand = 1n;
    for (let index = 0; index < primes.length; index += 1) {
      if ((mask & (1 << index)) !== 0) radicand *= primes[index];
    }
    basis.push(radicand);
  }
  return basis.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function solveRationalLinearSystem(matrix: ExactRational[][], rhs: ExactRational[]) {
  const size = rhs.length;
  const augmented = matrix.map((row, rowIndex) => [...row, rhs[rowIndex]]);

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    while (pivot < size && rationalIsZero(augmented[pivot][column])) pivot += 1;
    if (pivot === size) return null;
    if (pivot !== column) [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];

    const pivotValue = augmented[column][column];
    for (let index = column; index <= size; index += 1) {
      augmented[column][index] = rationalDivide(augmented[column][index], pivotValue);
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      if (rationalIsZero(factor)) continue;
      for (let index = column; index <= size; index += 1) {
        augmented[row][index] = rationalSubtract(
          augmented[row][index],
          rationalMultiply(factor, augmented[column][index]),
        );
      }
    }
  }

  return augmented.map((row) => row[size]);
}

export function reciprocalExact(value: ExactTrigNumber): ExactTrigResult {
  if (isZeroExact(value)) return exactUndefined("DIVISION_BY_ZERO", "Cannot invert exact zero.");

  const primes = radicalPrimeBasis(value);
  if (primes.length > MAX_RADICAL_PRIMES) {
    return exactUndefined(
      "RADICAL_FIELD_TOO_LARGE",
      `Exact reciprocal requires ${primes.length} independent radicals; maximum is ${MAX_RADICAL_PRIMES}.`,
    );
  }

  const basis = fieldBasis(primes);
  const indexByRadicand = new Map(basis.map((radicand, index) => [radicand.toString(), index]));
  const size = basis.length;
  const matrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rational(0)),
  );

  for (let column = 0; column < size; column += 1) {
    const basisElement = exactSurd(1, basis[column]);
    const product = multiplyExact(value, basisElement);
    for (const term of product.terms) {
      const row = indexByRadicand.get(term.radicand.toString());
      if (row === undefined) {
        throw new Error(`Internal exact-field error: missing basis radicand ${term.radicand}.`);
      }
      matrix[row][column] = rationalAdd(matrix[row][column], term.coefficient);
    }
  }

  const rhs = basis.map((radicand) => rational(radicand === 1n ? 1 : 0));
  const solution = solveRationalLinearSystem(matrix, rhs);
  if (!solution) return exactUndefined("DIVISION_BY_ZERO", "Exact reciprocal system was singular.");

  return exactFromTerms(solution.map((coefficient, index) => ({
    radicand: basis[index],
    coefficient,
  })));
}

export function divideExact(a: ExactTrigNumber, b: ExactTrigNumber): ExactTrigResult {
  const reciprocal = reciprocalExact(b);
  return isUndefined(reciprocal) ? reciprocal : multiplyExact(a, reciprocal);
}

export function powerExact(base: ExactTrigNumber, exponent: number): ExactTrigResult {
  if (!Number.isInteger(exponent)) {
    throw new Error("Exact trigonometry powers require an integer exponent.");
  }
  if (exponent === 0) return exactInteger(1);
  if (exponent < 0) {
    const reciprocal = reciprocalExact(base);
    if (isUndefined(reciprocal)) return reciprocal;
    return powerExact(reciprocal, -exponent);
  }

  let result = exactInteger(1);
  let factor = base;
  let remaining = exponent;
  while (remaining > 0) {
    if (remaining % 2 === 1) result = multiplyExact(result, factor);
    remaining = Math.floor(remaining / 2);
    if (remaining > 0) factor = multiplyExact(factor, factor);
  }
  return result;
}

export function exactKey(value: ExactTrigResult) {
  if (isUndefined(value)) return `U:${value.reason}:${value.detail ?? ""}`;
  if (value.terms.length === 0) return "N:0";
  return `N:${value.terms.map((term) =>
    `${term.coefficient.numerator}/${term.coefficient.denominator}*sqrt(${term.radicand})`,
  ).join("+")}`;
}

export function exactEquals(a: ExactTrigResult, b: ExactTrigResult) {
  return exactKey(a) === exactKey(b);
}

export function classifyExactNumber(value: ExactTrigNumber): ExactNumberClass {
  const rationalTerm = value.terms.find((term) => term.radicand === 1n);
  const radicalTerms = value.terms.filter((term) => term.radicand !== 1n);
  if (radicalTerms.length === 0) return "RATIONAL";
  if (!rationalTerm && radicalTerms.length === 1) return "SURD";
  if (rationalTerm && radicalTerms.length === 1) return "RATIONAL_SURD";
  return "MULTI_SURD";
}

export function exactToNumber(value: ExactTrigResult) {
  if (isUndefined(value)) return Number.NaN;
  return value.terms.reduce(
    (sum, term) => sum + rationalToNumber(term.coefficient) * Math.sqrt(Number(term.radicand)),
    0,
  );
}

function formatAbsoluteRational(value: ExactRational) {
  const numerator = abs(value.numerator);
  if (value.denominator === 1n) return `${numerator}`;
  return `\\frac{${numerator}}{${value.denominator}}`;
}

function formatAbsoluteRationalPlain(value: ExactRational) {
  const numerator = abs(value.numerator);
  if (value.denominator === 1n) return `${numerator}`;
  return `${numerator}/${value.denominator}`;
}

function formatAbsoluteTermMath(term: ExactRadicalTerm) {
  const coefficient = term.coefficient;
  const numerator = abs(coefficient.numerator);
  if (term.radicand === 1n) return formatAbsoluteRational(coefficient);
  const radical = `\\sqrt{${term.radicand}}`;
  if (coefficient.denominator === 1n) {
    return numerator === 1n ? radical : `${numerator}${radical}`;
  }
  const top = numerator === 1n ? radical : `${numerator}${radical}`;
  return `\\frac{${top}}{${coefficient.denominator}}`;
}

function formatAbsoluteTermPlain(term: ExactRadicalTerm) {
  const coefficient = term.coefficient;
  const numerator = abs(coefficient.numerator);
  if (term.radicand === 1n) return formatAbsoluteRationalPlain(coefficient);
  const radical = `√${term.radicand}`;
  if (coefficient.denominator === 1n) {
    return numerator === 1n ? radical : `${numerator}${radical}`;
  }
  const top = numerator === 1n ? radical : `${numerator}${radical}`;
  return `${top}/${coefficient.denominator}`;
}

function formatTerms(value: ExactTrigNumber, formatter: (term: ExactRadicalTerm) => string) {
  if (value.terms.length === 0) return "0";
  return value.terms.map((term, index) => {
    const negative = term.coefficient.numerator < 0n;
    const body = formatter(term);
    if (index === 0) return negative ? `-${body}` : body;
    return negative ? ` - ${body}` : ` + ${body}`;
  }).join("");
}

export function formatExactMath(value: ExactTrigResult) {
  if (isUndefined(value)) return "\\text{undefined}";
  return formatTerms(value, formatAbsoluteTermMath);
}

export function formatExactPlain(value: ExactTrigResult) {
  if (isUndefined(value)) return "undefined";
  return formatTerms(value, formatAbsoluteTermPlain);
}

export function assertDefined(value: ExactTrigResult): ExactTrigNumber {
  if (isUndefined(value)) {
    throw new Error(`Expected defined exact value, got ${value.reason}${value.detail ? `: ${value.detail}` : ""}.`);
  }
  return value;
}
