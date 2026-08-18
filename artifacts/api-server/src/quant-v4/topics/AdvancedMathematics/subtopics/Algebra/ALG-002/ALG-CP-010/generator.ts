import {
  addRational,
  equalsRational,
  formatRational,
  monicQuadraticFromRootInvariants,
  productPlusMinusSumRootEquation,
  quadraticRootInvariants,
  rational,
  reciprocalQuadraticRoots,
  rootPowerSum,
  rootReciprocalSum,
  rootSquareSum,
  shiftQuadraticRoots,
  subtractRational,
  type QuadraticEquation,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp010Candidate } from "./registry";
import type { AlgCp010DiscoveryItem } from "./types";

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

function distinctNonZeroInt(seed: number, min: number, max: number, salt: number, forbidden: number): number {
  let value = nonZeroInt(seed, min, max, salt);
  if (value === forbidden) value = value === max ? value - 1 : value + 1;
  if (value === 0) value = forbidden === 1 ? -1 : 1;
  return value;
}

function signedCoefficientTerm(coefficient: Rational, variable: "x²" | "x" | "", first: boolean): string {
  if (coefficient.numerator === 0n) return "";
  const negative = coefficient.numerator < 0n;
  const absolute = rational(negative ? -coefficient.numerator : coefficient.numerator, coefficient.denominator);
  const magnitude = variable && equalsRational(absolute, rational(1n)) ? variable : `${formatRational(absolute)}${variable}`;
  if (first) return negative ? `-${magnitude}` : magnitude;
  return ` ${negative ? "-" : "+"} ${magnitude}`;
}

function equationText(equation: QuadraticEquation): string {
  return `${signedCoefficientTerm(equation.a, "x²", true)}${signedCoefficientTerm(equation.b, "x", false)}${signedCoefficientTerm(equation.c, "", false)} = 0`;
}

function factorableBase(seed: number, salt: number): { equation: QuadraticEquation; roots: [Rational, Rational] } {
  const r1 = nonZeroInt(seed, -8, 8, salt + 1);
  const r2 = distinctNonZeroInt(seed, -8, 8, salt + 2, r1);
  const scale = pickInt(seed, 1, 3, salt + 3);
  return {
    equation: {
      a: rational(scale),
      b: rational(-scale * (r1 + r2)),
      c: rational(scale * r1 * r2),
    },
    roots: [rational(r1), rational(r2)],
  };
}

function scalarItem(
  candidateId: string,
  solveMode: AlgCp010DiscoveryItem["solveMode"],
  seed: number,
  equation: QuadraticEquation,
  roots: [Rational, Rational],
  stemTarget: string,
  value: Rational,
  explanation: string,
): AlgCp010DiscoveryItem {
  return {
    cpId: "ALG-CP-010", candidateId, solveMode, seed,
    stem: `If α and β are the roots of ${equationText(equation)}, ${stemTarget}`,
    originalEquation: equation,
    answer: { kind: "RATIONAL", value },
    explanation,
    sourceStatus: "UNVERIFIED_DRAFT",
    hiddenRoots: roots,
  };
}

export function generateAlgCp010DiscoveryItem(candidateId: string, seed: number): AlgCp010DiscoveryItem {
  const candidate = getAlgCp010Candidate(candidateId);
  const base = factorableBase(seed, 10 + candidateId.length);
  const invariants = quadraticRootInvariants(base.equation);
  const aText = formatRational(base.equation.a);
  const bText = formatRational(base.equation.b);
  const cText = formatRational(base.equation.c);

  switch (candidate.solveMode) {
    case "findSumOfRootsByVieta":
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α + β.", invariants.sum,
        `For ax² + bx + c = 0, α + β = -b/a. Here a = ${aText} and b = ${bText}, so α + β = -(${bText})/(${aText}) = ${formatRational(invariants.sum)}. There is no need to solve the roots separately.`,
      );

    case "findProductOfRootsByVieta":
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find αβ.", invariants.product,
        `For ax² + bx + c = 0, αβ = c/a. Here c = ${cText} and a = ${aText}, so αβ = (${cText})/(${aText}) = ${formatRational(invariants.product)}.`,
      );

    case "findSquareSumOfRootsByVieta": {
      const value = rootSquareSum(base.equation);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α² + β².", value,
        `Use α² + β² = (α + β)² - 2αβ. From Vieta, α + β = ${formatRational(invariants.sum)} and αβ = ${formatRational(invariants.product)}. Therefore α² + β² = (${formatRational(invariants.sum)})² - 2(${formatRational(invariants.product)}) = ${formatRational(value)}.`,
      );
    }

    case "findReciprocalSumOfRootsByVieta": {
      const value = rootReciprocalSum(base.equation);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find 1/α + 1/β.", value,
        `Since neither root is zero, 1/α + 1/β = (α + β)/(αβ). Using Vieta gives (${formatRational(invariants.sum)})/(${formatRational(invariants.product)}) = ${formatRational(value)}.`,
      );
    }

    case "findCubeSumOfRootsByVieta": {
      const value = rootPowerSum(base.equation, 3);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α³ + β³.", value,
        `Let S = α + β = ${formatRational(invariants.sum)} and P = αβ = ${formatRational(invariants.product)}. Use α³ + β³ = S³ - 3PS. Thus α³ + β³ = (${formatRational(invariants.sum)})³ - 3(${formatRational(invariants.product)})(${formatRational(invariants.sum)}) = ${formatRational(value)}.`,
      );
    }

    case "constructEquationFromSumAndProduct": {
      const answer = monicQuadraticFromRootInvariants(invariants.sum, invariants.product);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Form a monic quadratic equation whose roots have sum ${formatRational(invariants.sum)} and product ${formatRational(invariants.product)}.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `A monic quadratic with root sum S and product P is x² - Sx + P = 0. Substituting S = ${formatRational(invariants.sum)} and P = ${formatRational(invariants.product)} gives ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
      };
    }

    case "constructEquationWithShiftedRoots": {
      const shift = rational(nonZeroInt(seed, -5, 5, 70));
      const answer = shiftQuadraticRoots(base.equation, shift);
      const transformed = quadraticRootInvariants(answer);
      const magnitude = rational(shift.numerator < 0n ? -shift.numerator : shift.numerator, shift.denominator);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are α ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)} and β ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)}.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `Original Vieta values are S = ${formatRational(invariants.sum)} and P = ${formatRational(invariants.product)}. After shifting each root by ${formatRational(shift)}, the new sum is S' = S + 2t = ${formatRational(transformed.sum)} and the new product is P' = P + tS + t² = ${formatRational(transformed.product)}. Therefore x² - S'x + P' = 0 gives ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "SHIFT", value: shift },
      };
    }

    case "constructEquationWithReciprocalRoots": {
      const answer = reciprocalQuadraticRoots(base.equation);
      const transformed = quadraticRootInvariants(answer);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are 1/α and 1/β.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `Original Vieta values are S = ${formatRational(invariants.sum)} and P = ${formatRational(invariants.product)}. For reciprocal roots, S' = S/P = ${formatRational(transformed.sum)} and P' = 1/P = ${formatRational(transformed.product)}. Hence x² - S'x + P' = 0 gives ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "RECIPROCAL" },
      };
    }

    case "findOtherRootFromKnownRoot": {
      const known = base.roots[0];
      const other = base.roots[1];
      const viaSum = addRational(known, other);
      if (!equalsRational(viaSum, invariants.sum)) throw new Error("Known-root construction failed Vieta check");
      const recovered = subtractRational(invariants.sum, known);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `One root of ${equationText(base.equation)} is ${formatRational(known)}. Find the other root.`,
        originalEquation: base.equation,
        answer: { kind: "RATIONAL", value: other },
        explanation: `The sum of the roots is -b/a = ${formatRational(invariants.sum)}. Therefore the other root is ${formatRational(invariants.sum)} - (${formatRational(known)}) = ${formatRational(recovered)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        knownRootEvidence: known,
      };
    }

    case "constructEquationWithProductPlusMinusSumRoots": {
      const answer = productPlusMinusSumRootEquation(base.equation);
      const transformed = quadraticRootInvariants(answer);
      const plusRoot = addRational(invariants.product, invariants.sum);
      const minusRoot = subtractRational(invariants.product, invariants.sum);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are αβ + α + β and αβ - α - β.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `Let S = ${formatRational(invariants.sum)} and P = ${formatRational(invariants.product)}. The new roots are P + S = ${formatRational(plusRoot)} and P - S = ${formatRational(minusRoot)}. Their sum is ${formatRational(transformed.sum)} and product is ${formatRational(transformed.product)}, so the required monic equation is ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "PRODUCT_PLUS_MINUS_SUM" },
      };
    }

    case "constructEquationWithReciprocalThenShiftedRoots": {
      const shift = rational(nonZeroInt(seed, -4, 4, 91));
      const reciprocalEquation = reciprocalQuadraticRoots(base.equation);
      const reciprocalInvariants = quadraticRootInvariants(reciprocalEquation);
      const answer = shiftQuadraticRoots(reciprocalEquation, shift);
      const transformed = quadraticRootInvariants(answer);
      const magnitude = rational(shift.numerator < 0n ? -shift.numerator : shift.numerator, shift.denominator);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are 1/α ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)} and 1/β ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)}.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `Original Vieta values are S = ${formatRational(invariants.sum)} and P = ${formatRational(invariants.product)}. Reciprocal roots have sum ${formatRational(reciprocalInvariants.sum)} and product ${formatRational(reciprocalInvariants.product)}. After shifting both by ${formatRational(shift)}, the final sum is ${formatRational(transformed.sum)} and product is ${formatRational(transformed.product)}. Therefore the monic equation is ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "RECIPROCAL_THEN_SHIFT", value: shift },
      };
    }
  }
}
