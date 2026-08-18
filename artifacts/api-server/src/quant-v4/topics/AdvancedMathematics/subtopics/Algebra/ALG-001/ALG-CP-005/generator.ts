import {
  addPolynomials,
  dividePolynomialByLinearFactor,
  equalsRational,
  evaluatePolynomial,
  formatRational,
  multiplyPolynomials,
  polynomial,
  rational,
  solveLinearSystem2V,
  verifyLinearPolynomialDivision,
  verifyLinearSystemSolution,
  type Polynomial1,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp005Candidate } from "./registry";
import type { AlgCp005DiscoveryItem } from "./types";

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
  if (value === 0) value = min === 0 ? 1 : (min <= -1 ? -1 : 1);
  return value;
}

function makeCubic(seed: number, salt: number): Polynomial1 {
  return polynomial("x", [
    rational(pickInt(seed, -10, 10, salt + 1)),
    rational(pickInt(seed, -8, 8, salt + 2)),
    rational(pickInt(seed, -6, 6, salt + 3)),
    rational(pickInt(seed, 1, 3, salt + 4)),
  ]);
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    if (coefficient.denominator !== 1n) throw new Error("CP-005 discovery formatter expects integer coefficients");
    const n = Number(coefficient.numerator);
    const absolute = Math.abs(n);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : degree === 2 ? "x²" : degree === 3 ? "x³" : `x^${degree}`;
    const magnitude = degree > 0 && absolute === 1 ? variable : `${absolute}${variable}`;
    if (pieces.length === 0) pieces.push(n < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${n < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function linearDivisorText(a: number, b: number): string {
  const xPart = a === 1 ? "x" : `${a}x`;
  if (b === 0) return xPart;
  return `${xPart} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

function xMinusRootText(root: number): string {
  return root < 0 ? `x + ${Math.abs(root)}` : `x - ${root}`;
}

function signedKnownTerm(value: number, variable: string): string {
  if (value === 0) return "";
  const magnitude = Math.abs(value) === 1 && variable ? variable : `${Math.abs(value)}${variable}`;
  return ` ${value < 0 ? "-" : "+"} ${magnitude}`;
}

function symbolicCubicText(c3: number, c1: number, c0: number): string {
  const leading = c3 === 1 ? "x³" : `${c3}x³`;
  return `${leading} + kx²${signedKnownTerm(c1, "x")}${signedKnownTerm(c0, "")}`;
}

function symbolicTwoCoefficientCubicText(c3: number, c0: number): string {
  const leading = c3 === 1 ? "x³" : `${c3}x³`;
  return `${leading} + kx² + mx${signedKnownTerm(c0, "")}`;
}

function divisionFor(value: Polynomial1, root: Rational) {
  const division = dividePolynomialByLinearFactor(value, root);
  if (!verifyLinearPolynomialDivision(value, division)) throw new Error("Generated polynomial division failed recomposition verification");
  const theoremRemainder = evaluatePolynomial(value, root);
  if (!equalsRational(theoremRemainder, division.remainder)) throw new Error("Remainder theorem disagrees with synthetic division");
  return division;
}

function remainderItem(
  candidateId: string,
  solveMode: AlgCp005DiscoveryItem["solveMode"],
  seed: number,
  value: Polynomial1,
  a: Rational,
  b: Rational,
  root: Rational,
  stem: string,
  explanationPrefix: string,
): AlgCp005DiscoveryItem {
  const division = divisionFor(value, root);
  return {
    cpId: "ALG-CP-005",
    candidateId,
    solveMode,
    seed,
    stem,
    polynomial: value,
    divisor: { a, b, root },
    answer: { kind: "RATIONAL", value: division.remainder },
    explanation: `${explanationPrefix} Substituting gives P(${formatRational(root)}) = ${formatRational(division.remainder)}. Therefore the remainder is ${formatRational(division.remainder)}.`,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp005DiscoveryItem(candidateId: string, seed: number): AlgCp005DiscoveryItem {
  const candidate = getAlgCp005Candidate(candidateId);

  switch (candidate.solveMode) {
    case "findRemainderForXMinusK": {
      const root = nonZeroInt(seed, -5, 5, 1);
      const value = makeCubic(seed, 10);
      return remainderItem(
        candidateId,
        candidate.solveMode,
        seed,
        value,
        rational(1n),
        rational(-root),
        rational(root),
        `Find the remainder when P(x) = ${polynomialText(value)} is divided by ${xMinusRootText(root)}.`,
        `By the Remainder Theorem, division by ${xMinusRootText(root)} leaves the remainder P(${root}).`,
      );
    }

    case "findRemainderForXPlusK": {
      const k = pickInt(seed, 1, 6, 1);
      const value = makeCubic(seed, 20);
      const root = -k;
      return remainderItem(
        candidateId,
        candidate.solveMode,
        seed,
        value,
        rational(1n),
        rational(k),
        rational(root),
        `Find the remainder when P(x) = ${polynomialText(value)} is divided by x + ${k}.`,
        `For the divisor x + ${k}, set x + ${k} = 0, so x = ${root}. The remainder is P(${root}).`,
      );
    }

    case "findUnknownCoefficientFromFactorCondition": {
      const root = nonZeroInt(seed, -5, 5, 1);
      const c3 = pickInt(seed, 1, 3, 2);
      const k = nonZeroInt(seed, -6, 6, 3);
      const c1 = nonZeroInt(seed, -7, 7, 4);
      const c0 = -(c3 * root ** 3 + k * root ** 2 + c1 * root);
      const value = polynomial("x", [rational(c0), rational(c1), rational(k), rational(c3)]);
      const division = divisionFor(value, rational(root));
      if (division.remainder.numerator !== 0n) throw new Error("Constructed factor condition is not exact");
      return {
        cpId: "ALG-CP-005",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `If ${xMinusRootText(root)} is a factor of P(x) = ${symbolicCubicText(c3, c1, c0)}, find k.`,
        polynomial: value,
        divisor: { a: rational(1n), b: rational(-root), root: rational(root) },
        answer: { kind: "RATIONAL", value: rational(k) },
        explanation: `Because ${xMinusRootText(root)} is a factor, the Factor Theorem gives P(${root}) = 0. Substituting x = ${root} in ${symbolicCubicText(c3, c1, c0)} and solving the resulting linear equation gives k = ${k}. Synthetic division then gives remainder 0, confirming the factor.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findUnknownCoefficientFromGivenRemainder": {
      const root = nonZeroInt(seed, -5, 5, 1);
      const c3 = pickInt(seed, 1, 3, 2);
      const k = nonZeroInt(seed, -6, 6, 3);
      const c1 = nonZeroInt(seed, -7, 7, 4);
      const wantedRemainder = pickInt(seed, -6, 6, 5);
      const c0 = wantedRemainder - (c3 * root ** 3 + k * root ** 2 + c1 * root);
      const value = polynomial("x", [rational(c0), rational(c1), rational(k), rational(c3)]);
      const division = divisionFor(value, rational(root));
      if (!equalsRational(division.remainder, rational(wantedRemainder))) throw new Error("Constructed remainder condition is not exact");
      return {
        cpId: "ALG-CP-005",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `When P(x) = ${symbolicCubicText(c3, c1, c0)} is divided by ${xMinusRootText(root)}, the remainder is ${wantedRemainder}. Find k.`,
        polynomial: value,
        divisor: { a: rational(1n), b: rational(-root), root: rational(root) },
        answer: { kind: "RATIONAL", value: rational(k) },
        explanation: `The Remainder Theorem gives P(${root}) = ${wantedRemainder}. Substitute x = ${root}, equate the result to ${wantedRemainder}, and solve the resulting linear equation. This gives k = ${k}. Substituting that value back reproduces the stated remainder.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findRemainderForGeneralLinearDivisor": {
      const a = pickInt(seed, 2, 4, 1);
      const b = nonZeroInt(seed, -7, 7, 2);
      const root = rational(-b, a);
      const value = makeCubic(seed, 30);
      return remainderItem(
        candidateId,
        candidate.solveMode,
        seed,
        value,
        rational(a),
        rational(b),
        root,
        `Find the remainder when P(x) = ${polynomialText(value)} is divided by ${linearDivisorText(a, b)}.`,
        `For ${linearDivisorText(a, b)} = 0, x = ${formatRational(root)}. A linear divisor ax + b therefore leaves the remainder P(-b/a).`,
      );
    }

    case "verifyDeclaredLinearFactor": {
      const root = nonZeroInt(seed, -5, 5, 1);
      const divisor = polynomial("x", [rational(-root), rational(1n)]);
      const quotient = polynomial("x", [
        rational(nonZeroInt(seed, -6, 6, 2)),
        rational(pickInt(seed, -5, 5, 3)),
        rational(pickInt(seed, 1, 3, 4)),
      ]);
      const shouldBeFactor = mixSeed(seed ^ 0x51f15e) % 2 === 0;
      let value = multiplyPolynomials(divisor, quotient);
      if (!shouldBeFactor) {
        value = addPolynomials(value, polynomial("x", [rational(pickInt(seed, 1, 3, 5))]));
      }
      const division = divisionFor(value, rational(root));
      const isFactor = division.remainder.numerator === 0n;
      if (isFactor !== shouldBeFactor) throw new Error("Factor-verification construction failed");
      return {
        cpId: "ALG-CP-005",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `Is ${xMinusRootText(root)} a factor of P(x) = ${polynomialText(value)}?`,
        polynomial: value,
        divisor: { a: rational(1n), b: rational(-root), root: rational(root) },
        answer: { kind: "BOOLEAN", value: isFactor },
        explanation: `By the Factor Theorem, ${xMinusRootText(root)} is a factor exactly when P(${root}) = 0. Here P(${root}) = ${formatRational(division.remainder)}, so the statement is ${isFactor ? "true" : "false"}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findTwoCoefficientsFromTwoRemainderConditions": {
      const root1 = nonZeroInt(seed, -5, 5, 1);
      let root2 = nonZeroInt(seed, -5, 5, 2);
      if (root2 === root1) root2 = root1 === 5 ? 4 : root1 + 1;
      if (root2 === 0) root2 = root1 === 1 ? -1 : 1;
      const c3 = pickInt(seed, 1, 3, 3);
      const k = nonZeroInt(seed, -5, 5, 4);
      const m = nonZeroInt(seed, -7, 7, 5);
      const c0 = -(c3 * root1 ** 3 + k * root1 ** 2 + m * root1);
      const value = polynomial("x", [rational(c0), rational(m), rational(k), rational(c3)]);
      const firstDivision = divisionFor(value, rational(root1));
      if (firstDivision.remainder.numerator !== 0n) throw new Error("First condition must be an exact factor");
      const secondRemainder = evaluatePolynomial(value, rational(root2));

      const system = {
        a1: rational(root1 ** 2), b1: rational(root1), c1: rational(-c3 * root1 ** 3 - c0),
        a2: rational(root2 ** 2), b2: rational(root2), c2: rational(Number(secondRemainder.numerator) - c3 * root2 ** 3 - c0),
      };
      if (secondRemainder.denominator !== 1n) throw new Error("Constructed second remainder should be integral");
      system.c2 = rational(secondRemainder.numerator - BigInt(c3 * root2 ** 3 + c0));
      const solved = solveLinearSystem2V(system);
      if (solved.kind !== "UNIQUE" || !verifyLinearSystemSolution(system, solved.x, solved.y)) throw new Error("Two-condition coefficient system must be uniquely solvable");
      if (!equalsRational(solved.x, rational(k)) || !equalsRational(solved.y, rational(m))) throw new Error("Recovered coefficients do not match construction");

      return {
        cpId: "ALG-CP-005",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `For P(x) = ${symbolicTwoCoefficientCubicText(c3, c0)}, ${xMinusRootText(root1)} is a factor and division by ${xMinusRootText(root2)} leaves remainder ${formatRational(secondRemainder)}. Find k and m.`,
        polynomial: value,
        divisor: { a: rational(1n), b: rational(-root1), root: rational(root1) },
        answer: { kind: "COEFFICIENT_PAIR", k: solved.x, m: solved.y },
        explanation: `The factor condition gives P(${root1}) = 0, while the second condition gives P(${root2}) = ${formatRational(secondRemainder)}. Substituting these two x-values creates two linear equations in k and m. Solving that system gives k = ${k} and m = ${m}. Both remainder conditions then verify exactly.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        conditionEvidence: { secondRoot: rational(root2), secondRemainder },
      };
    }
  }
}
