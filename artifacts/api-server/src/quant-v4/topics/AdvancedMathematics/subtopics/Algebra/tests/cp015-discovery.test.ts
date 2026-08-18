import {
  absRational,
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  evaluatePolynomial,
  multiplyRational,
  rational,
  reciprocalRational,
  subtractRational,
  type LinearEquation,
  type LinearSystem2V,
  type QuantityRelation,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP015_DISCOVERY_CANDIDATES, generateAlgCp015DiscoveryItem } from "../ALG-002/ALG-CP-015";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function solveLinearDirect(equation: LinearEquation): Rational {
  const coefficient = subtractRational(equation.leftCoefficient, equation.rightCoefficient);
  if (coefficient.numerator === 0n) throw new Error("Independent CP-015 verifier expected unique linear equation");
  return divideRational(subtractRational(equation.rightConstant, equation.leftConstant), coefficient);
}

function solveSystemDirect(system: LinearSystem2V): { x: Rational; y: Rational } {
  const determinant = subtractRational(multiplyRational(system.a1, system.b2), multiplyRational(system.a2, system.b1));
  if (determinant.numerator === 0n) throw new Error("Independent CP-015 verifier expected unique system");
  const xNumerator = subtractRational(multiplyRational(system.c1, system.b2), multiplyRational(system.c2, system.b1));
  const yNumerator = subtractRational(multiplyRational(system.a1, system.c2), multiplyRational(system.a2, system.c1));
  return { x: divideRational(xNumerator, determinant), y: divideRational(yNumerator, determinant) };
}

function directRelation(a: Rational, b: Rational): QuantityRelation {
  const cmp = compareRational(a, b);
  return cmp > 0 ? "QUANTITY_I_GREATER" : cmp < 0 ? "QUANTITY_II_GREATER" : "EQUAL";
}

for (const candidate of ALG_CP015_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp015DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp015DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 20, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 70, `${candidate.candidateId} seed ${seed} has incomplete explanation`);
    assert(first.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} seed ${seed} leaked maturity`);

    if (first.math.kind === "LINEAR_RECIPROCAL") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong answer kind`);
      if (first.answer.kind !== "RATIONAL") continue;
      const x = solveLinearDirect(first.math.equation);
      assert(x.numerator !== 0n, `${candidate.candidateId} seed ${seed} produced zero reciprocal source`);
      const expected = addRational(x, reciprocalRational(x));
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} linear→reciprocal mismatch`);
      continue;
    }

    if (first.math.kind === "SYSTEM_QC") {
      assert(first.answer.kind === "QUANTITY_RELATION", `${candidate.candidateId} seed ${seed} has wrong QC answer kind`);
      if (first.answer.kind !== "QUANTITY_RELATION") continue;
      const solved = solveSystemDirect(first.math.system);
      assert(first.answer.value === directRelation(solved.x, solved.y), `${candidate.candidateId} seed ${seed} system→QC mismatch`);
      continue;
    }

    if (first.math.kind === "QUADRATIC_ROOT_GAP") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong root-gap answer kind`);
      if (first.answer.kind !== "RATIONAL") continue;
      const roots: Rational[] = [];
      for (let x = -12; x <= 12; x += 1) {
        const candidateX = rational(x);
        const value = addRational(
          addRational(multiplyRational(first.math.equation.a, multiplyRational(candidateX, candidateX)), multiplyRational(first.math.equation.b, candidateX)),
          first.math.equation.c,
        );
        if (value.numerator === 0n) roots.push(candidateX);
      }
      assert(roots.length === 2, `${candidate.candidateId} seed ${seed} should expose exactly two integer roots to independent scan`);
      const expected = absRational(subtractRational(roots[0]!, roots[1]!));
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} root-gap mismatch`);
      continue;
    }

    if (first.math.kind === "RATIONAL_ABS") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong rational-abs answer kind`);
      if (first.answer.kind !== "RATIONAL") continue;
      const numerator = addRational(first.math.p, multiplyRational(first.math.q, first.math.d));
      const denominator = subtractRational(first.math.q, rational(1n));
      const x = divideRational(numerator, denominator);
      assert(!equalsRational(x, first.math.d), `${candidate.candidateId} seed ${seed} solved to excluded denominator root`);
      const expected = absRational(subtractRational(x, first.math.offset));
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} rational→absolute mismatch`);
      continue;
    }

    if (first.math.kind === "DIVISION_EVAL") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong division answer kind`);
      if (first.answer.kind !== "RATIONAL") continue;
      const atRoot = evaluatePolynomial(first.math.polynomial, first.math.factorRoot);
      assert(atRoot.numerator === 0n, `${candidate.candidateId} seed ${seed} stated factor does not divide polynomial`);
      const denominator = subtractRational(first.math.evaluationPoint, first.math.factorRoot);
      assert(denominator.numerator !== 0n, `${candidate.candidateId} seed ${seed} evaluation point collides with factor root`);
      const expected = divideRational(evaluatePolynomial(first.math.polynomial, first.math.evaluationPoint), denominator);
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} division→evaluation mismatch`);
      continue;
    }

    if (first.math.kind === "SYSTEM_CASELET") {
      assert(first.answer.kind === "RATIONAL_PAIR", `${candidate.candidateId} seed ${seed} has wrong caselet answer kind`);
      if (first.answer.kind !== "RATIONAL_PAIR") continue;
      const solved = solveSystemDirect(first.math.system);
      const expectedSum = addRational(solved.x, solved.y);
      const expectedProduct = multiplyRational(solved.x, solved.y);
      assert(equalsRational(first.answer.first, expectedSum), `${candidate.candidateId} seed ${seed} caselet sum mismatch`);
      assert(equalsRational(first.answer.second, expectedProduct), `${candidate.candidateId} seed ${seed} caselet product mismatch`);
      continue;
    }

    if (first.math.kind === "BOUNDED_CUBIC_ROOT") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong cubic-root answer kind`);
      if (first.answer.kind !== "RATIONAL") continue;
      assert(evaluatePolynomial(first.math.polynomial, first.answer.value).numerator === 0n, `${candidate.candidateId} seed ${seed} answer is not a polynomial root`);
      let count = 0;
      let matched: Rational | null = null;
      for (let x = 1; x <= first.math.upperScanBound; x += 1) {
        const candidateX = rational(x);
        if (evaluatePolynomial(first.math.polynomial, candidateX).numerator === 0n) {
          count += 1;
          matched = candidateX;
        }
      }
      assert(count === 1 && matched !== null, `${candidate.candidateId} seed ${seed} must have exactly one bounded positive integer root`);
      assert(equalsRational(first.answer.value, matched!), `${candidate.candidateId} seed ${seed} bounded cubic-root mismatch`);
      continue;
    }

    throw new Error(`${candidate.candidateId} seed ${seed} has unsupported mixed state`);
  }
}

console.log(`ALG-CP-015 executable discovery passed for ${ALG_CP015_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);