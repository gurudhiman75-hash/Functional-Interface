import {
  allRealIntervals,
  classifyDataSufficiency,
  compareRationalPossibilitySets,
  compareRationalQuantities,
  equalsRational,
  formatDataSufficiencyVerdict,
  formatQuantityRelation,
  formatRational,
  intersectIntervalSets,
  rational,
  solveLinearEquation,
  solveLinearInequality,
  solveLinearSystem2V,
  type LinearEquation,
  type LinearSystem2V,
  type Rational,
  type RationalIntervalSet,
} from "../../../../../../shared/algebra";
import { getAlgCp014Candidate } from "./registry";
import type { AlgCp014DiscoveryItem, AlgCp014SingleVariableStatement } from "./types";

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

function pointSet(value: Rational): RationalIntervalSet {
  return [{ lower: value, lowerClosed: true, upper: value, upperClosed: true }];
}

function equationSet(equation: LinearEquation): RationalIntervalSet {
  const solved = solveLinearEquation(equation);
  return solved.kind === "UNIQUE" ? pointSet(solved.value) : solved.kind === "INFINITE_SOLUTIONS" ? allRealIntervals() : [];
}

function statementSet(statement: AlgCp014SingleVariableStatement): RationalIntervalSet {
  return statement.kind === "LINEAR_EQUATION"
    ? equationSet(statement.equation)
    : solveLinearInequality(statement.a, statement.b, statement.operator);
}

function isSingleton(set: RationalIntervalSet): boolean {
  return set.length === 1
    && set[0]!.lower !== null
    && set[0]!.upper !== null
    && set[0]!.lowerClosed
    && set[0]!.upperClosed
    && equalsRational(set[0]!.lower, set[0]!.upper);
}

function singleVariableVerdict(statementI: AlgCp014SingleVariableStatement, statementII: AlgCp014SingleVariableStatement) {
  const setI = statementSet(statementI);
  const setII = statementSet(statementII);
  return classifyDataSufficiency(isSingleton(setI), isSingleton(setII), isSingleton(intersectIntervalSets(setI, setII)));
}

function uniqueEquationFor(value: number, coefficient: number): LinearEquation {
  return {
    leftCoefficient: rational(coefficient),
    leftConstant: rational(0n),
    rightCoefficient: rational(0n),
    rightConstant: rational(coefficient * value),
  };
}

function equationText(value: number, coefficient: number): string {
  return coefficient === 1 ? `x = ${value}` : `${coefficient}x = ${coefficient * value}`;
}

function inequalityStatement(boundary: number, greater: boolean): AlgCp014SingleVariableStatement {
  return {
    kind: "LINEAR_INEQUALITY",
    a: rational(1n),
    b: rational(-boundary),
    operator: greater ? "GT" : "LT",
  };
}

function systemEquationText(a: number, b: number, c: number): string {
  const ax = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const by = `${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`}`;
  return `${ax} ${by} = ${c}`;
}

function rowDeterminesTarget(a: number, b: number, target: "x" | "y"): boolean {
  return target === "x" ? a !== 0 && b === 0 : b !== 0 && a === 0;
}

function systemVerdict(system: LinearSystem2V, target: "x" | "y", numeric: { a1: number; b1: number; a2: number; b2: number }) {
  const first = rowDeterminesTarget(numeric.a1, numeric.b1, target);
  const second = rowDeterminesTarget(numeric.a2, numeric.b2, target);
  const together = solveLinearSystem2V(system).kind === "UNIQUE";
  return classifyDataSufficiency(first, second, together);
}

export function generateAlgCp014DiscoveryItem(candidateId: string, seed: number): AlgCp014DiscoveryItem {
  const candidate = getAlgCp014Candidate(candidateId);

  switch (candidate.solveMode) {
    case "compareExactQuantities": {
      const x = nonZeroInt(seed, -6, 6, 1);
      const a1 = pickInt(seed, 1, 5, 2);
      const b1 = pickInt(seed, -8, 8, 3);
      const a2 = pickInt(seed, 1, 5, 4);
      const b2 = pickInt(seed, -8, 8, 5);
      const q1 = rational(a1 * x + b1);
      const q2 = rational(a2 * x + b2);
      const relation = compareRationalQuantities(q1, q2);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Given x = ${x}, compare the two quantities. Quantity I: ${linearExpressionText(a1, b1)}. Quantity II: ${linearExpressionText(a2, b2)}.`,
        math: { kind: "EXACT_QC", quantityI: q1, quantityII: q2 },
        answer: { kind: "QUANTITY_RELATION", value: relation, text: formatQuantityRelation(relation) },
        explanation: `Substitute x = ${x} in both quantities. Quantity I becomes ${formatRational(q1)} and Quantity II becomes ${formatRational(q2)}. Therefore ${formatQuantityRelation(relation)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "compareDeterminatePossibilitySets": {
      const base = pickInt(seed, -4, 6, 1);
      const q1Values = [rational(base + 3), rational(base + 5)];
      const q2Values = [rational(base - 2), rational(base)];
      const relation = compareRationalPossibilitySets(q1Values, q2Values);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Quantity I can take either ${base + 3} or ${base + 5}. Quantity II can take either ${base - 2} or ${base}. Compare the quantities using all admissible cases.`,
        math: { kind: "SET_QC", quantityIValues: q1Values, quantityIIValues: q2Values },
        answer: { kind: "QUANTITY_RELATION", value: relation, text: formatQuantityRelation(relation) },
        explanation: `Check every allowed pairing, not just one convenient pair. Even the smallest possible Quantity I (${base + 3}) is greater than the largest possible Quantity II (${base}). Therefore ${formatQuantityRelation(relation)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "compareIndeterminatePossibilitySets": {
      const base = pickInt(seed, -4, 6, 1);
      const q1Values = [rational(base - 2), rational(base + 2)];
      const q2Values = [rational(base - 1), rational(base + 1)];
      const relation = compareRationalPossibilitySets(q1Values, q2Values);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Quantity I can take either ${base - 2} or ${base + 2}. Quantity II can take either ${base - 1} or ${base + 1}. Compare the quantities using all admissible cases.`,
        math: { kind: "SET_QC", quantityIValues: q1Values, quantityIIValues: q2Values },
        answer: { kind: "QUANTITY_RELATION", value: relation, text: formatQuantityRelation(relation) },
        explanation: `Different allowed pairings give different relationships: Quantity I can be smaller in one case and larger in another. Since one relation does not hold for every admissible case, ${formatQuantityRelation(relation).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "dataSufficiencyStatementIAlone": {
      const x = nonZeroInt(seed, -7, 7, 1);
      const coefficient = pickInt(seed, 2, 6, 2);
      const boundary = x - pickInt(seed, 1, 4, 3);
      const statementI: AlgCp014SingleVariableStatement = { kind: "LINEAR_EQUATION", equation: uniqueEquationFor(x, coefficient) };
      const statementII = inequalityStatement(boundary, true);
      const verdict = singleVariableVerdict(statementI, statementII);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: "Is the value of x uniquely determined?",
        statements: [`I. ${equationText(x, coefficient)}`, `II. x > ${boundary}`],
        math: { kind: "DS_SINGLE_VARIABLE", statementI, statementII, target: "x" },
        answer: { kind: "DATA_SUFFICIENCY", value: verdict, text: formatDataSufficiencyVerdict(verdict) },
        explanation: `Statement I fixes x at one exact value, so it is sufficient by itself. Statement II only restricts x to a range and allows many values. Therefore ${formatDataSufficiencyVerdict(verdict).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "dataSufficiencyStatementIIAlone": {
      const x = nonZeroInt(seed, -7, 7, 1);
      const coefficient = pickInt(seed, 2, 6, 2);
      const boundary = x + pickInt(seed, 1, 4, 3);
      const statementI = inequalityStatement(boundary, false);
      const statementII: AlgCp014SingleVariableStatement = { kind: "LINEAR_EQUATION", equation: uniqueEquationFor(x, coefficient) };
      const verdict = singleVariableVerdict(statementI, statementII);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: "Is the value of x uniquely determined?",
        statements: [`I. x < ${boundary}`, `II. ${equationText(x, coefficient)}`],
        math: { kind: "DS_SINGLE_VARIABLE", statementI, statementII, target: "x" },
        answer: { kind: "DATA_SUFFICIENCY", value: verdict, text: formatDataSufficiencyVerdict(verdict) },
        explanation: `Statement I gives only a range of possible x-values, so it is insufficient. Statement II gives one exact x-value and is sufficient by itself. Therefore ${formatDataSufficiencyVerdict(verdict).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "dataSufficiencyEitherAlone": {
      const x = nonZeroInt(seed, -7, 7, 1);
      const c1 = pickInt(seed, 2, 5, 2);
      const c2 = pickInt(seed, 2, 6, 3);
      const statementI: AlgCp014SingleVariableStatement = { kind: "LINEAR_EQUATION", equation: uniqueEquationFor(x, c1) };
      const statementII: AlgCp014SingleVariableStatement = { kind: "LINEAR_EQUATION", equation: uniqueEquationFor(x, c2) };
      const verdict = singleVariableVerdict(statementI, statementII);
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: "Is the value of x uniquely determined?",
        statements: [`I. ${equationText(x, c1)}`, `II. ${equationText(x, c2)}`],
        math: { kind: "DS_SINGLE_VARIABLE", statementI, statementII, target: "x" },
        answer: { kind: "DATA_SUFFICIENCY", value: verdict, text: formatDataSufficiencyVerdict(verdict) },
        explanation: `Statement I alone gives one exact value of x. Statement II alone also gives one exact value of x, and the statements are consistent. Therefore ${formatDataSufficiencyVerdict(verdict).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "dataSufficiencyBothTogether": {
      const x = nonZeroInt(seed, -5, 5, 1);
      const y = nonZeroInt(seed, -5, 5, 2);
      const a1 = nonZeroInt(seed, -4, 4, 3);
      const b1 = nonZeroInt(seed, -4, 4, 4);
      const a2 = nonZeroInt(seed, -4, 4, 5);
      let b2 = nonZeroInt(seed, -4, 4, 6);
      if (a1 * b2 === a2 * b1) b2 += b2 > 0 ? 1 : -1;
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      const system: LinearSystem2V = { a1: rational(a1), b1: rational(b1), c1: rational(c1), a2: rational(a2), b2: rational(b2), c2: rational(c2) };
      const verdict = systemVerdict(system, "x", { a1, b1, a2, b2 });
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: "Is the value of x uniquely determined?",
        statements: [`I. ${systemEquationText(a1, b1, c1)}`, `II. ${systemEquationText(a2, b2, c2)}`],
        math: { kind: "DS_SYSTEM", system, target: "x" },
        answer: { kind: "DATA_SUFFICIENCY", value: verdict, text: formatDataSufficiencyVerdict(verdict) },
        explanation: `Each statement alone is one equation in two unknowns, so x is not fixed. Taken together, the two equations are independent and have one unique solution. Therefore ${formatDataSufficiencyVerdict(verdict).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "dataSufficiencyNotSufficient": {
      const x = nonZeroInt(seed, -5, 5, 1);
      const y = nonZeroInt(seed, -5, 5, 2);
      const a1 = nonZeroInt(seed, -4, 4, 3);
      const b1 = nonZeroInt(seed, -4, 4, 4);
      const scale = pickInt(seed, 2, 4, 5);
      const c1 = a1 * x + b1 * y;
      const a2 = a1 * scale;
      const b2 = b1 * scale;
      const c2 = c1 * scale;
      const system: LinearSystem2V = { a1: rational(a1), b1: rational(b1), c1: rational(c1), a2: rational(a2), b2: rational(b2), c2: rational(c2) };
      const verdict = systemVerdict(system, "x", { a1, b1, a2, b2 });
      return {
        cpId: "ALG-CP-014", candidateId, solveMode: candidate.solveMode, seed,
        stem: "Is the value of x uniquely determined?",
        statements: [`I. ${systemEquationText(a1, b1, c1)}`, `II. ${systemEquationText(a2, b2, c2)}`],
        math: { kind: "DS_SYSTEM", system, target: "x" },
        answer: { kind: "DATA_SUFFICIENCY", value: verdict, text: formatDataSufficiencyVerdict(verdict) },
        explanation: `Statement II is only a multiple of Statement I, so the two statements describe the same line rather than two independent constraints. Infinitely many (x, y) pairs remain possible, so x is still not unique. Therefore ${formatDataSufficiencyVerdict(verdict).toLowerCase()}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }
  }
}
