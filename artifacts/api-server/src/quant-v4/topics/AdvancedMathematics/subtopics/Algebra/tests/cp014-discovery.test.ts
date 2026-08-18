import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  multiplyRational,
  subtractRational,
  type DataSufficiencyVerdict,
  type LinearEquation,
  type QuantityRelation,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP014_DISCOVERY_CANDIDATES, generateAlgCp014DiscoveryItem } from "../ALG-002/ALG-CP-014";
import type { AlgCp014SingleVariableStatement } from "../ALG-002/ALG-CP-014/types";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function directRelation(a: Rational, b: Rational): QuantityRelation {
  const cmp = compareRational(a, b);
  return cmp > 0 ? "QUANTITY_I_GREATER" : cmp < 0 ? "QUANTITY_II_GREATER" : "EQUAL";
}

function exhaustiveRelation(left: Rational[], right: Rational[]): QuantityRelation {
  const relations = new Set<QuantityRelation>();
  for (const a of left) for (const b of right) relations.add(directRelation(a, b));
  return relations.size === 1 ? [...relations][0]! : "CANNOT_BE_DETERMINED";
}

function solveEquationDirect(equation: LinearEquation): Rational | null {
  const coefficient = subtractRational(equation.leftCoefficient, equation.rightCoefficient);
  if (coefficient.numerator === 0n) return null;
  const constant = subtractRational(equation.rightConstant, equation.leftConstant);
  return divideRational(constant, coefficient);
}

function inequalityAccepts(statement: Extract<AlgCp014SingleVariableStatement, { kind: "LINEAR_INEQUALITY" }>, x: Rational): boolean {
  const value = addRational(multiplyRational(statement.a, x), statement.b);
  const cmp = compareRational(value, { numerator: 0n, denominator: 1n });
  return statement.operator === "GT" ? cmp > 0
    : statement.operator === "GE" ? cmp >= 0
    : statement.operator === "LT" ? cmp < 0
    : cmp <= 0;
}

function statementUniqueValue(statement: AlgCp014SingleVariableStatement): Rational | null {
  return statement.kind === "LINEAR_EQUATION" ? solveEquationDirect(statement.equation) : null;
}

function togetherUniqueValue(statementI: AlgCp014SingleVariableStatement, statementII: AlgCp014SingleVariableStatement): Rational | null {
  const first = statementUniqueValue(statementI);
  const second = statementUniqueValue(statementII);
  if (first !== null && second !== null) return equalsRational(first, second) ? first : null;
  if (first !== null && statementII.kind === "LINEAR_INEQUALITY") return inequalityAccepts(statementII, first) ? first : null;
  if (second !== null && statementI.kind === "LINEAR_INEQUALITY") return inequalityAccepts(statementI, second) ? second : null;
  return null;
}

function directDsVerdict(firstSufficient: boolean, secondSufficient: boolean, togetherSufficient: boolean): DataSufficiencyVerdict {
  if (firstSufficient && secondSufficient) return "EITHER_ALONE";
  if (firstSufficient) return "STATEMENT_I_ALONE";
  if (secondSufficient) return "STATEMENT_II_ALONE";
  return togetherSufficient ? "BOTH_TOGETHER" : "NOT_SUFFICIENT";
}

function rowFixesTarget(a: Rational, b: Rational, target: "x" | "y"): boolean {
  return target === "x" ? a.numerator !== 0n && b.numerator === 0n : b.numerator !== 0n && a.numerator === 0n;
}

for (const candidate of ALG_CP014_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp014DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp014DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 15, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 60, `${candidate.candidateId} seed ${seed} has incomplete explanation`);
    assert(first.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} seed ${seed} leaked maturity`);

    if (first.math.kind === "EXACT_QC") {
      assert(first.answer.kind === "QUANTITY_RELATION", `${candidate.candidateId} seed ${seed} has wrong QC answer kind`);
      if (first.answer.kind !== "QUANTITY_RELATION") continue;
      assert(first.answer.value === directRelation(first.math.quantityI, first.math.quantityII), `${candidate.candidateId} seed ${seed} exact QC mismatch`);
      continue;
    }

    if (first.math.kind === "SET_QC") {
      assert(first.answer.kind === "QUANTITY_RELATION", `${candidate.candidateId} seed ${seed} has wrong set-QC answer kind`);
      if (first.answer.kind !== "QUANTITY_RELATION") continue;
      const expected = exhaustiveRelation(first.math.quantityIValues, first.math.quantityIIValues);
      assert(first.answer.value === expected, `${candidate.candidateId} seed ${seed} possibility-set QC mismatch`);
      if (candidate.solveMode === "compareDeterminatePossibilitySets") assert(expected !== "CANNOT_BE_DETERMINED", `${candidate.candidateId} seed ${seed} should be determinate`);
      if (candidate.solveMode === "compareIndeterminatePossibilitySets") assert(expected === "CANNOT_BE_DETERMINED", `${candidate.candidateId} seed ${seed} should be indeterminate`);
      continue;
    }

    if (first.math.kind === "DS_SINGLE_VARIABLE") {
      assert(first.answer.kind === "DATA_SUFFICIENCY", `${candidate.candidateId} seed ${seed} has wrong DS answer kind`);
      if (first.answer.kind !== "DATA_SUFFICIENCY") continue;
      const firstValue = statementUniqueValue(first.math.statementI);
      const secondValue = statementUniqueValue(first.math.statementII);
      const togetherValue = togetherUniqueValue(first.math.statementI, first.math.statementII);
      const expected = directDsVerdict(firstValue !== null, secondValue !== null, togetherValue !== null);
      assert(first.answer.value === expected, `${candidate.candidateId} seed ${seed} single-variable DS mismatch`);
      continue;
    }

    if (first.math.kind === "DS_SYSTEM") {
      assert(first.answer.kind === "DATA_SUFFICIENCY", `${candidate.candidateId} seed ${seed} has wrong system-DS answer kind`);
      if (first.answer.kind !== "DATA_SUFFICIENCY") continue;
      const system = first.math.system;
      const firstSufficient = rowFixesTarget(system.a1, system.b1, first.math.target);
      const secondSufficient = rowFixesTarget(system.a2, system.b2, first.math.target);
      const determinant = subtractRational(multiplyRational(system.a1, system.b2), multiplyRational(system.a2, system.b1));
      const expected = directDsVerdict(firstSufficient, secondSufficient, determinant.numerator !== 0n);
      assert(first.answer.value === expected, `${candidate.candidateId} seed ${seed} system DS mismatch`);
      if (candidate.solveMode === "dataSufficiencyBothTogether") assert(determinant.numerator !== 0n, `${candidate.candidateId} seed ${seed} should have independent rows`);
      if (candidate.solveMode === "dataSufficiencyNotSufficient") assert(determinant.numerator === 0n, `${candidate.candidateId} seed ${seed} should remain dependent`);
      continue;
    }

    throw new Error(`${candidate.candidateId} seed ${seed} has unsupported math state`);
  }
}

console.log(`ALG-CP-014 executable discovery passed for ${ALG_CP014_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
