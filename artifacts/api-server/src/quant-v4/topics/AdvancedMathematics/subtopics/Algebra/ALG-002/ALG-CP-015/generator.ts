import {
  absRational,
  addRational,
  compareRationalQuantities,
  constantRationalFunction,
  dividePolynomialByLinearFactor,
  evaluatePolynomial,
  formatQuantityRelation,
  formatRational,
  multiplyPolynomials,
  multiplyRational,
  polynomial,
  rational,
  reciprocalRational,
  solveLinearEquation,
  solveLinearSystem2V,
  solveQuadraticEquation,
  solveRationalEquationOverRationals,
  subtractRational,
  verifyLinearPolynomialDivision,
  type LinearEquation,
  type LinearSystem2V,
  type Polynomial1,
  type QuadraticEquation,
  type RationalEquation1,
} from "../../../../../../shared/algebra";
import { getAlgCp015Candidate } from "./registry";
import type { AlgCp015DiscoveryItem } from "./types";

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
  if (value === 0) value = min < 0 ? -1 : 1;
  return value;
}

function linearExpressionText(a: number, b: number): string {
  const xPart = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b === 0) return xPart;
  return `${xPart} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

function absoluteOffsetText(offset: number): string {
  if (offset === 0) return "|x|";
  return `|x ${offset < 0 ? "+" : "-"} ${Math.abs(offset)}|`;
}

function systemEquationText(a: number, b: number, c: number): string {
  const xPart = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const yMagnitude = Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`;
  return `${xPart} ${b < 0 ? "-" : "+"} ${yMagnitude} = ${c}`;
}

function quadraticText(a: number, b: number, c: number): string {
  const pieces: string[] = [];
  const push = (coefficient: number, variable: string) => {
    if (coefficient === 0) return;
    const absolute = Math.abs(coefficient);
    const magnitude = variable && absolute === 1 ? variable : `${absolute}${variable}`;
    if (pieces.length === 0) pieces.push(coefficient < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${coefficient < 0 ? "-" : "+"} ${magnitude}`);
  };
  push(a, "x²");
  push(b, "x");
  push(c, "");
  return pieces.join(" ") || "0";
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    if (coefficient.denominator !== 1n) throw new Error("CP-015 formatter expects integer polynomial coefficients");
    const n = Number(coefficient.numerator);
    const absolute = Math.abs(n);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : degree === 2 ? "x²" : `x^${degree}`;
    const magnitude = variable && absolute === 1 ? variable : `${absolute}${variable}`;
    if (pieces.length === 0) pieces.push(n < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${n < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function equationFromRoots(leading: number, r1: number, r2: number): QuadraticEquation {
  return { a: rational(leading), b: rational(-leading * (r1 + r2)), c: rational(leading * r1 * r2) };
}

function independentSystem(seed: number, salt: number, x: number, y: number): { system: LinearSystem2V; numeric: [number, number, number, number, number, number] } {
  const a1 = nonZeroInt(seed, -4, 4, salt);
  const b1 = nonZeroInt(seed, -4, 4, salt + 1);
  const a2 = nonZeroInt(seed, -4, 4, salt + 2);
  let b2 = nonZeroInt(seed, -4, 4, salt + 3);
  if (a1 * b2 === a2 * b1) b2 += b2 > 0 ? 1 : -1;
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  return {
    system: { a1: rational(a1), b1: rational(b1), c1: rational(c1), a2: rational(a2), b2: rational(b2), c2: rational(c2) },
    numeric: [a1, b1, c1, a2, b2, c2],
  };
}

export function generateAlgCp015DiscoveryItem(candidateId: string, seed: number): AlgCp015DiscoveryItem {
  const candidate = getAlgCp015Candidate(candidateId);

  switch (candidate.solveMode) {
    case "linearThenReciprocalTarget": {
      const hiddenX = nonZeroInt(seed, -6, 6, 1);
      const a = pickInt(seed, 2, 6, 2);
      const b = pickInt(seed, -7, 7, 3);
      const right = a * hiddenX + b;
      const equation: LinearEquation = { leftCoefficient: rational(a), leftConstant: rational(b), rightCoefficient: rational(0n), rightConstant: rational(right) };
      const solved = solveLinearEquation(equation);
      if (solved.kind !== "UNIQUE" || solved.value.numerator === 0n) throw new Error("CP-015 linear synthesis requires one nonzero solution");
      const reciprocal = reciprocalRational(solved.value);
      const value = addRational(solved.value, reciprocal);
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If ${linearExpressionText(a, b)} = ${right}, find x + 1/x.`,
        math: { kind: "LINEAR_RECIPROCAL", equation },
        answer: { kind: "RATIONAL", value, text: formatRational(value) },
        explanation: `First solve the linear equation. From ${linearExpressionText(a, b)} = ${right}, we get x = ${formatRational(solved.value)}. Its reciprocal is ${formatRational(reciprocal)}. Therefore x + 1/x = ${formatRational(solved.value)} + ${formatRational(reciprocal)} = ${formatRational(value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "systemThenQuantityComparison": {
      const hiddenX = nonZeroInt(seed, -6, 6, 1);
      const hiddenY = nonZeroInt(seed, -6, 6, 2);
      const { system, numeric } = independentSystem(seed, 10, hiddenX, hiddenY);
      const solved = solveLinearSystem2V(system);
      if (solved.kind !== "UNIQUE") throw new Error("CP-015 system QC requires unique solution");
      const relation = compareRationalQuantities(solved.x, solved.y);
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve the system and compare Quantity I = x with Quantity II = y: ${systemEquationText(numeric[0], numeric[1], numeric[2])}; ${systemEquationText(numeric[3], numeric[4], numeric[5])}.`,
        math: { kind: "SYSTEM_QC", system },
        answer: { kind: "QUANTITY_RELATION", value: relation, text: formatQuantityRelation(relation) },
        explanation: `Solve the two equations together to get x = ${formatRational(solved.x)} and y = ${formatRational(solved.y)}. Comparing these exact values gives ${formatQuantityRelation(relation)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "quadraticThenAbsoluteRootGap": {
      const r1 = nonZeroInt(seed, -7, 6, 1);
      let r2 = nonZeroInt(seed, -6, 7, 2);
      if (r1 === r2) r2 = r1 === 7 ? 6 : r1 + 1;
      const leading = pickInt(seed, 1, 3, 3);
      const equation = equationFromRoots(leading, r1, r2);
      const solved = solveQuadraticEquation(equation);
      if (solved.kind !== "TWO_RATIONAL_ROOTS") throw new Error("CP-015 root-gap synthesis requires two rational roots");
      const value = absRational(subtractRational(solved.roots[0], solved.roots[1]));
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If α and β are the roots of ${quadraticText(leading, Number(equation.b.numerator), Number(equation.c.numerator))} = 0, find |α - β|.`,
        math: { kind: "QUADRATIC_ROOT_GAP", equation },
        answer: { kind: "RATIONAL", value, text: formatRational(value) },
        explanation: `First find the two roots of the quadratic. They are ${formatRational(solved.roots[0])} and ${formatRational(solved.roots[1])}. Their absolute difference is |${formatRational(solved.roots[0])} - ${formatRational(solved.roots[1])}| = ${formatRational(value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "rationalEquationThenAbsoluteTarget": {
      const d = nonZeroInt(seed, -5, 5, 1);
      let hiddenX = nonZeroInt(seed, -7, 7, 2);
      if (hiddenX === d) hiddenX = d === 7 ? 6 : d + 1;
      const q = pickInt(seed, 2, 5, 3);
      const p = (q - 1) * hiddenX - q * d;
      const offset = pickInt(seed, -6, 6, 4);
      const equation: RationalEquation1 = {
        left: {
          numerator: polynomial("x", [rational(p), rational(1n)]),
          denominator: polynomial("x", [rational(-d), rational(1n)]),
        },
        right: constantRationalFunction("x", rational(q)),
      };
      const solved = solveRationalEquationOverRationals(equation);
      if (solved.kind !== "FINITE" || solved.roots.length !== 1) throw new Error("CP-015 rational synthesis requires one valid root");
      const root = solved.roots[0]!;
      const value = absRational(subtractRational(root, rational(offset)));
      const numeratorText = linearExpressionText(1, p);
      const denominatorText = linearExpressionText(1, -d);
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve (${numeratorText})/(${denominatorText}) = ${q}, then find ${absoluteOffsetText(offset)}.`,
        math: { kind: "RATIONAL_ABS", equation, p: rational(p), d: rational(d), q: rational(q), offset: rational(offset) },
        answer: { kind: "RATIONAL", value, text: formatRational(value) },
        explanation: `The denominator requires x ≠ ${d}. Solving the rational equation gives x = ${formatRational(root)}, which is allowed by that restriction. Now evaluate ${absoluteOffsetText(offset)} at this x. The result is ${formatRational(value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "factorDivisionThenEvaluateQuotient": {
      const factorRoot = nonZeroInt(seed, -5, 5, 1);
      let evaluationPoint = nonZeroInt(seed, -6, 6, 2);
      if (evaluationPoint === factorRoot) evaluationPoint = factorRoot === 6 ? 5 : factorRoot + 1;
      const q0 = nonZeroInt(seed, -6, 6, 3);
      const q1 = pickInt(seed, -5, 5, 4);
      const q2 = pickInt(seed, 1, 3, 5);
      const quotient = polynomial("x", [rational(q0), rational(q1), rational(q2)]);
      const divisor = polynomial("x", [rational(-factorRoot), rational(1n)]);
      const source = multiplyPolynomials(divisor, quotient);
      const division = dividePolynomialByLinearFactor(source, rational(factorRoot));
      if (!verifyLinearPolynomialDivision(source, division) || division.remainder.numerator !== 0n) throw new Error("CP-015 division synthesis must divide exactly");
      const value = evaluatePolynomial(division.quotient, rational(evaluationPoint));
      const factorText = factorRoot < 0 ? `x + ${Math.abs(factorRoot)}` : `x - ${factorRoot}`;
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Let P(x) = ${polynomialText(source)}. Since ${factorText} is a factor, define Q(x) = P(x)/(${factorText}). Find Q(${evaluationPoint}).`,
        math: { kind: "DIVISION_EVAL", polynomial: source, factorRoot: rational(factorRoot), evaluationPoint: rational(evaluationPoint) },
        answer: { kind: "RATIONAL", value, text: formatRational(value) },
        explanation: `Divide P(x) by the stated linear factor; the remainder is 0, so the quotient is exact. Then substitute x = ${evaluationPoint} in that quotient. This gives Q(${evaluationPoint}) = ${formatRational(value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "sharedSystemDerivedCaselet": {
      const hiddenX = nonZeroInt(seed, -6, 6, 1);
      const hiddenY = nonZeroInt(seed, -6, 6, 2);
      const { system, numeric } = independentSystem(seed, 30, hiddenX, hiddenY);
      const solved = solveLinearSystem2V(system);
      if (solved.kind !== "UNIQUE") throw new Error("CP-015 caselet requires unique system solution");
      const sum = addRational(solved.x, solved.y);
      const product = multiplyRational(solved.x, solved.y);
      return {
        cpId: "ALG-CP-015", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Use the same system for both parts: ${systemEquationText(numeric[0], numeric[1], numeric[2])}; ${systemEquationText(numeric[3], numeric[4], numeric[5])}. Find (i) x + y and (ii) xy.`,
        math: { kind: "SYSTEM_CASELET", system },
        answer: { kind: "RATIONAL_PAIR", first: sum, second: product, text: `(i) ${formatRational(sum)}, (ii) ${formatRational(product)}` },
        explanation: `Solve the shared system once: x = ${formatRational(solved.x)} and y = ${formatRational(solved.y)}. Use those same values for both requested results. Then x + y = ${formatRational(sum)} and xy = ${formatRational(product)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }
  }
}
