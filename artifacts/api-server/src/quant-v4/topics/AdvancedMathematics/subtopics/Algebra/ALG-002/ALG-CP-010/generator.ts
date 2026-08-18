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

  switch (candidate.solveMode) {
    case "findSumOfRootsByVieta":
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α + β.", invariants.sum,
        `For ax² + bx + c = 0, the sum of roots is -b/a. Here α + β = ${formatRational(invariants.sum)}. There is no need to solve the two roots separately.`,
      );

    case "findProductOfRootsByVieta":
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find αβ.", invariants.product,
        `For ax² + bx + c = 0, the product of roots is c/a. Hence αβ = ${formatRational(invariants.product)}.`,
      );

    case "findSquareSumOfRootsByVieta": {
      const value = rootSquareSum(base.equation);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α² + β².", value,
        `Use α² + β² = (α + β)² - 2αβ. From Vieta, α + β = ${formatRational(invariants.sum)} and αβ = ${formatRational(invariants.product)}. Therefore α² + β² = ${formatRational(value)}.`,
      );
    }

    case "findReciprocalSumOfRootsByVieta": {
      const value = rootReciprocalSum(base.equation);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find 1/α + 1/β.", value,
        `Since neither root is zero, 1/α + 1/β = (α + β)/(αβ). Using Vieta gives ${formatRational(invariants.sum)}/${formatRational(invariants.product)} = ${formatRational(value)}.`,
      );
    }

    case "findCubeSumOfRootsByVieta": {
      const value = rootPowerSum(base.equation, 3);
      return scalarItem(
        candidateId, candidate.solveMode, seed, base.equation, base.roots,
        "find α³ + β³.", value,
        `Use the shared root power-sum recurrence with α + β = ${formatRational(invariants.sum)} and αβ = ${formatRational(invariants.product)}. It gives α³ + β³ = ${formatRational(value)} without solving the roots individually.`,
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
      const magnitude = rational(shift.numerator < 0n ? -shift.numerator : shift.numerator, shift.denominator);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are α ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)} and β ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)}.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `The new root sum is (α + β) + 2(${formatRational(shift)}) and the new product is αβ + ${formatRational(shift)}(α + β) + (${formatRational(shift)})². Using Vieta gives the transformed equation ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "SHIFT", value: shift },
      };
    }

    case "constructEquationWithReciprocalRoots": {
      const answer = reciprocalQuadraticRoots(base.equation);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are 1/α and 1/β.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `For reciprocal roots, the new sum is (α + β)/(αβ) and the new product is 1/(αβ). Applying Vieta directly gives ${equationText(answer)}.`,
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
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `One root of ${equationText(base.equation)} is ${formatRational(known)}. Find the other root.`,
        originalEquation: base.equation,
        answer: { kind: "RATIONAL", value: other },
        explanation: `The sum of the roots is -b/a = ${formatRational(invariants.sum)}. Subtract the known root ${formatRational(known)} to get the other root ${formatRational(other)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        knownRootEvidence: known,
      };
    }

    case "constructEquationWithProductPlusMinusSumRoots": {
      const answer = productPlusMinusSumRootEquation(base.equation);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are αβ + α + β and αβ - α - β.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `Let S = α + β = ${formatRational(invariants.sum)} and P = αβ = ${formatRational(invariants.product)}. The new roots are P + S and P - S. Their sum is 2P and their product is P² - S², so Vieta gives ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "PRODUCT_PLUS_MINUS_SUM" },
      };
    }

    case "constructEquationWithReciprocalThenShiftedRoots": {
      const shift = rational(nonZeroInt(seed, -4, 4, 91));
      const reciprocalEquation = reciprocalQuadraticRoots(base.equation);
      const answer = shiftQuadraticRoots(reciprocalEquation, shift);
      const magnitude = rational(shift.numerator < 0n ? -shift.numerator : shift.numerator, shift.denominator);
      return {
        cpId: "ALG-CP-010", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${equationText(base.equation)}, form the monic quadratic whose roots are 1/α ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)} and 1/β ${shift.numerator < 0n ? "-" : "+"} ${formatRational(magnitude)}.`,
        originalEquation: base.equation,
        answer: { kind: "QUADRATIC_EQUATION", value: answer },
        explanation: `First use Vieta to transform the roots to 1/α and 1/β. Their sum is (α + β)/(αβ) and their product is 1/(αβ). Then shift both reciprocal roots by ${formatRational(shift)}. Applying the ordinary shifted-root formulas to those reciprocal-root invariants gives ${equationText(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        hiddenRoots: base.roots,
        transformEvidence: { kind: "RECIPROCAL_THEN_SHIFT", value: shift },
      };
    }
  }
}