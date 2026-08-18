import {
  constantRationalFunction,
  equalsRational,
  formatRational,
  multiplyPolynomials,
  polynomial,
  rational,
  rationalEquationExcludedValues,
  solveRationalEquationOverRationals,
  type Polynomial1,
  type Rational,
  type RationalEquation1,
  type RationalFunction1,
} from "../../../../../../shared/algebra";
import { getAlgCp008Candidate } from "./registry";
import type { AlgCp008DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  return min + (mixSeed(seed ^ (salt * 0x9e3779b9)) % (max - min + 1));
}

function nonZeroInt(seed: number, min: number, max: number, salt: number): number {
  let value = pickInt(seed, min, max, salt);
  if (value === 0) value = min <= -1 ? -1 : 1;
  return value;
}

function distinctInt(seed: number, min: number, max: number, salt: number, forbidden: number): number {
  let value = pickInt(seed, min, max, salt);
  if (value === forbidden) value = value === max ? value - 1 : value + 1;
  return value;
}

function linear(variableCoefficient: number, constant: number): Polynomial1 {
  return polynomial("x", [rational(constant), rational(variableCoefficient)]);
}

function xMinus(value: number): Polynomial1 {
  return linear(1, -value);
}

function rationalFunction(numerator: Polynomial1, denominator: Polynomial1): RationalFunction1 {
  return { numerator, denominator };
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    const sign = coefficient.numerator < 0n ? -1 : 1;
    const absolute = rational(coefficient.numerator < 0n ? -coefficient.numerator : coefficient.numerator, coefficient.denominator);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : degree === 2 ? "x²" : `x^${degree}`;
    const coefficientText = degree > 0 && equalsRational(absolute, rational(1n)) ? "" : formatRational(absolute);
    const magnitude = `${coefficientText}${variable}` || "1";
    if (pieces.length === 0) pieces.push(sign < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${sign < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function linearText(a: number, b: number): string {
  const xPart = a === 0 ? "" : a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b === 0) return xPart || "0";
  if (!xPart) return String(b);
  return `${xPart} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

function fractionText(value: RationalFunction1): string {
  return `(${polynomialText(value.numerator)})/(${polynomialText(value.denominator)})`;
}

function equationText(equation: RationalEquation1): string {
  return `${fractionText(equation.left)} = ${fractionText(equation.right)}`;
}

function rootSetAnswer(equation: RationalEquation1): { values: Rational[]; rejected: Rational[]; excluded: Rational[] } {
  const solved = solveRationalEquationOverRationals(equation);
  if (solved.kind !== "FINITE") throw new Error("Expected a finite rational-equation solution");
  return { values: solved.roots, rejected: solved.rejectedExcludedRoots, excluded: solved.excludedValues };
}

export function generateAlgCp008DiscoveryItem(candidateId: string, seed: number): AlgCp008DiscoveryItem {
  const candidate = getAlgCp008Candidate(candidateId);

  switch (candidate.solveMode) {
    case "identifyExcludedValueLinearDenominator": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const a = nonZeroInt(seed, -6, 6, 2);
      let b = pickInt(seed, -8, 8, 3);
      if (a * excluded + b === 0) b += 1;
      const left = rationalFunction(linear(a, b), xMinus(excluded));
      const equation: RationalEquation1 = { left, right: constantRationalFunction("x", rational(0n)) };
      const exclusions = rationalEquationExcludedValues(equation);
      if (exclusions.length !== 1 || !equalsRational(exclusions[0]!, rational(excluded))) throw new Error("Excluded-value construction failed");
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `For the algebraic fraction ${fractionText(left)}, which value of x is not allowed?`,
        equation,
        answer: { kind: "EXCLUDED_VALUE", value: rational(excluded) },
        explanation: `The denominator cannot be zero. Set ${polynomialText(left.denominator)} = 0, which gives x = ${excluded}. Therefore x = ${excluded} is excluded from the domain.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveLinearFractionEqualsConstant": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const target = distinctInt(seed, -8, 8, 2, excluded);
      const a = nonZeroInt(seed, -6, 6, 3);
      let rhs = nonZeroInt(seed, -5, 5, 4);
      if (rhs === a) rhs = rhs === 5 ? 4 : rhs + 1;
      const b = rhs * (target - excluded) - a * target;
      const equation: RationalEquation1 = {
        left: rationalFunction(linear(a, b), xMinus(excluded)),
        right: constantRationalFunction("x", rational(rhs)),
      };
      const solved = rootSetAnswer(equation);
      if (solved.values.length !== 1 || !equalsRational(solved.values[0]!, rational(target))) throw new Error("Linear fraction construction failed");
      const collectedCoefficient = a - rhs;
      const collectedRhs = -rhs * excluded - b;
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`,
        equation,
        answer: { kind: "ROOT_SET", values: solved.values },
        explanation: `First note x ≠ ${excluded}. Multiply by the nonzero denominator ${polynomialText(equation.left.denominator)}: ${linearText(a, b)} = ${linearText(rhs, -rhs * excluded)}. Collecting x-terms gives ${linearText(collectedCoefficient, 0)} = ${collectedRhs}, so x = ${target}. This value is not excluded and satisfies the original fraction equation.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveTwoReciprocalFractions": {
      const e = nonZeroInt(seed, -7, 7, 1);
      let f = distinctInt(seed, -7, 7, 2, e);
      if (f === 0) f = e === 1 ? -1 : 1;
      const a = nonZeroInt(seed, 1, 6, 3);
      let b = nonZeroInt(seed, 1, 6, 4);
      if (b === a) b = b === 6 ? 5 : b + 1;
      const equation: RationalEquation1 = {
        left: rationalFunction(polynomial("x", [rational(a)]), xMinus(e)),
        right: rationalFunction(polynomial("x", [rational(b)]), xMinus(f)),
      };
      const solved = rootSetAnswer(equation);
      if (solved.values.length !== 1) throw new Error("Two-reciprocal construction should have one valid root");
      const collectedCoefficient = a - b;
      const collectedRhs = a * f - b * e;
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`,
        equation,
        answer: { kind: "ROOT_SET", values: solved.values },
        explanation: `The original denominators require x ≠ ${e} and x ≠ ${f}. Cross-multiplying gives ${a}(${polynomialText(xMinus(f))}) = ${b}(${polynomialText(xMinus(e))}). Expanding and collecting x-terms gives ${linearText(collectedCoefficient, 0)} = ${collectedRhs}, so x = ${formatRational(solved.values[0]!)}. Direct substitution in the original equation confirms the value is valid.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "rejectCancelledExcludedRoot": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const validRoot = distinctInt(seed, -8, 8, 2, excluded);
      const numerator = multiplyPolynomials(xMinus(excluded), xMinus(validRoot));
      const equation: RationalEquation1 = {
        left: rationalFunction(numerator, xMinus(excluded)),
        right: constantRationalFunction("x", rational(0n)),
      };
      const solved = solveRationalEquationOverRationals(equation);
      if (solved.kind !== "FINITE" || solved.roots.length !== 1 || solved.rejectedExcludedRoots.length !== 1) throw new Error("Cancelled-root construction failed");
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`,
        equation,
        answer: { kind: "ROOT_SET", values: solved.roots },
        explanation: `From the original denominator, x = ${excluded} is not allowed. The numerator factors as (${polynomialText(xMinus(excluded))})(${polynomialText(xMinus(validRoot))}), giving candidates x = ${excluded} and x = ${validRoot}. Reject ${excluded} because it makes the original denominator zero. Therefore the only valid solution is x = ${validRoot}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyNoValidRootAfterFiltering": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const factor = xMinus(excluded);
      const equation: RationalEquation1 = {
        left: rationalFunction(multiplyPolynomials(factor, factor), factor),
        right: constantRationalFunction("x", rational(0n)),
      };
      const solved = solveRationalEquationOverRationals(equation);
      if (solved.kind !== "NO_SOLUTION" || solved.rejectedExcludedRoots.length !== 1) throw new Error("No-valid-root filtering construction failed");
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`,
        equation,
        answer: { kind: "NO_SOLUTION" },
        explanation: `The denominator makes x = ${excluded} invalid. The numerator is (${polynomialText(factor)})², so the cross-multiplied equation gives only x = ${excluded}. That candidate is outside the original domain, hence the rational equation has no solution.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveReciprocalPlusConstant": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const target = distinctInt(seed, -8, 8, 2, excluded);
      const offset = pickInt(seed, -5, 5, 3);
      const rhs = rational(offset * (target - excluded) + 1, target - excluded);
      const numerator = linear(offset, 1 - offset * excluded);
      const equation: RationalEquation1 = {
        left: rationalFunction(numerator, xMinus(excluded)),
        right: constantRationalFunction("x", rhs),
      };
      const solved = rootSetAnswer(equation);
      if (solved.values.length !== 1 || !equalsRational(solved.values[0]!, rational(target))) throw new Error("Reciprocal-plus-constant construction failed");
      const reciprocalValue = rational(1, target - excluded);
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve 1/(${polynomialText(xMinus(excluded))}) ${offset < 0 ? "-" : "+"} ${Math.abs(offset)} = ${formatRational(rhs)}.`,
        equation,
        answer: { kind: "ROOT_SET", values: solved.values },
        explanation: `The denominator first gives x ≠ ${excluded}. Move ${offset} to the right: 1/(${polynomialText(xMinus(excluded))}) = ${formatRational(reciprocalValue)}. Invert both nonzero sides to get ${polynomialText(xMinus(excluded))} = ${target - excluded}, hence x = ${target}. Since ${target} is not excluded, it is valid.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyInfiniteOnRestrictedDomain": {
      const excluded = nonZeroInt(seed, -7, 7, 1);
      const factor = xMinus(excluded);
      const equation: RationalEquation1 = {
        left: rationalFunction(factor, factor),
        right: constantRationalFunction("x", rational(1n)),
      };
      const solved = solveRationalEquationOverRationals(equation);
      if (solved.kind !== "INFINITE_ON_DOMAIN") throw new Error("Infinite-domain construction failed");
      return {
        cpId: "ALG-CP-008", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Describe the solution set of ${equationText(equation)}.`,
        equation,
        answer: { kind: "INFINITE_ON_DOMAIN", excludedValues: solved.excludedValues },
        explanation: `The numerator and denominator are the same, so the fraction equals 1 wherever it is defined. But x = ${excluded} makes the original denominator zero. Therefore every real x except ${excluded} satisfies the equation.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }
  }
}
