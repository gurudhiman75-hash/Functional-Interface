import {
  ZERO,
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  intervalContains,
  multiplyRational,
  negateRational,
  quadraticDiscriminant,
  rational,
  solveQuadraticEquation,
  subtractRational,
  type InequalityOperator,
  type ParameterRange,
  type QuadraticEquation,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP012_DISCOVERY_CANDIDATES, generateAlgCp012DiscoveryItem } from "../ALG-002/ALG-CP-012";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function comparisonHolds(value: Rational, operator: InequalityOperator): boolean {
  const sign = compareRational(value, ZERO);
  return operator === "GT" ? sign > 0 : operator === "GE" ? sign >= 0 : operator === "LT" ? sign < 0 : sign <= 0;
}

function evalLinear(a: Rational, b: Rational, x: Rational): Rational {
  return addRational(multiplyRational(a, x), b);
}

function evalQuadratic(equation: QuadraticEquation, x: Rational): Rational {
  return addRational(
    addRational(multiplyRational(equation.a, multiplyRational(x, x)), multiplyRational(equation.b, x)),
    equation.c,
  );
}

function midpoint(a: Rational, b: Rational): Rational {
  return divideRational(addRational(a, b), rational(2n));
}

function rangeContains(range: ParameterRange, value: Rational): boolean {
  const sign = compareRational(value, range.bound);
  return range.operator === "GT" ? sign > 0 : range.operator === "GE" ? sign >= 0 : range.operator === "LT" ? sign < 0 : sign <= 0;
}

function globalConditionHolds(a: Rational, b: Rational, k: Rational, target: "POSITIVE" | "NONNEGATIVE" | "NEGATIVE" | "NONPOSITIVE"): boolean {
  const equation: QuadraticEquation = { a, b, c: k };
  const d = quadraticDiscriminant(equation);
  const dSign = compareRational(d, ZERO);
  const aSign = compareRational(a, ZERO);
  if (target === "POSITIVE") return aSign > 0 && dSign < 0;
  if (target === "NONNEGATIVE") return aSign > 0 && dSign <= 0;
  if (target === "NEGATIVE") return aSign < 0 && dSign < 0;
  return aSign < 0 && dSign <= 0;
}

function verifyIntervalAnswer(item: ReturnType<typeof generateAlgCp012DiscoveryItem>): void {
  assert(item.answer.kind === "INTERVAL_SET", `${item.candidateId} must return interval set`);
  if (item.answer.kind !== "INTERVAL_SET") return;

  if (item.math.kind === "LINEAR") {
    const boundary = divideRational(negateRational(item.math.b), item.math.a);
    const samples = [subtractRational(boundary, rational(1n)), boundary, addRational(boundary, rational(1n))];
    for (const sample of samples) {
      const truth = comparisonHolds(evalLinear(item.math.a, item.math.b, sample), item.math.operator);
      assert(intervalContains(item.answer.value, sample) === truth, `${item.candidateId} linear interval mismatch at ${stable(sample)}`);
    }
    return;
  }

  if (item.math.kind === "COMPOUND_LINEAR") {
    const [first, second] = item.math.inequalities;
    const b1 = divideRational(negateRational(first.b), first.a);
    const b2 = divideRational(negateRational(second.b), second.a);
    const low = compareRational(b1, b2) <= 0 ? b1 : b2;
    const high = compareRational(b1, b2) <= 0 ? b2 : b1;
    const samples = [subtractRational(low, rational(1n)), low, midpoint(low, high), high, addRational(high, rational(1n))];
    for (const sample of samples) {
      const truth = comparisonHolds(evalLinear(first.a, first.b, sample), first.operator)
        && comparisonHolds(evalLinear(second.a, second.b, sample), second.operator);
      assert(intervalContains(item.answer.value, sample) === truth, `${item.candidateId} compound interval mismatch at ${stable(sample)}`);
    }
    return;
  }

  if (item.math.kind === "QUADRATIC_INEQUALITY") {
    const roots = solveQuadraticEquation(item.math.equation);
    const samples: Rational[] = [];
    if (roots.kind === "NO_REAL_ROOTS") {
      samples.push(rational(-1n), rational(0n), rational(1n));
    } else if (roots.kind === "REPEATED_ROOT") {
      samples.push(subtractRational(roots.root, rational(1n)), roots.root, addRational(roots.root, rational(1n)));
    } else if (roots.kind === "TWO_RATIONAL_ROOTS") {
      let [r1, r2] = roots.roots;
      if (compareRational(r1, r2) > 0) [r1, r2] = [r2, r1];
      samples.push(subtractRational(r1, rational(1n)), r1, midpoint(r1, r2), r2, addRational(r2, rational(1n)));
    } else {
      throw new Error(`${item.candidateId} discovery unexpectedly produced irrational inequality endpoints`);
    }
    for (const sample of samples) {
      const truth = comparisonHolds(evalQuadratic(item.math.equation, sample), item.math.operator);
      assert(intervalContains(item.answer.value, sample) === truth, `${item.candidateId} quadratic sign mismatch at ${stable(sample)}`);
    }
    return;
  }

  throw new Error(`${item.candidateId} interval answer has incompatible math state ${item.math.kind}`);
}

for (const candidate of ALG_CP012_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp012DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp012DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 15, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 70, `${candidate.candidateId} seed ${seed} has incomplete explanation`);
    assert(first.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} seed ${seed} leaked maturity`);

    if (first.answer.kind === "INTERVAL_SET") {
      verifyIntervalAnswer(first);
      continue;
    }

    if (first.math.kind === "EXTREMUM") {
      assert(first.answer.kind === "EXTREMUM", `${candidate.candidateId} seed ${seed} has wrong extremum answer kind`);
      if (first.answer.kind !== "EXTREMUM") continue;
      const expectedX = divideRational(negateRational(first.math.equation.b), multiplyRational(rational(2n), first.math.equation.a));
      const expectedValue = evalQuadratic(first.math.equation, expectedX);
      assert(equalsRational(first.answer.value.x, expectedX), `${candidate.candidateId} seed ${seed} has wrong vertex x`);
      assert(equalsRational(first.answer.value.value, expectedValue), `${candidate.candidateId} seed ${seed} has wrong extremum value`);
      const left = evalQuadratic(first.math.equation, subtractRational(expectedX, rational(1n)));
      const right = evalQuadratic(first.math.equation, addRational(expectedX, rational(1n)));
      const isMinimum = compareRational(first.math.equation.a, ZERO) > 0;
      assert(first.answer.value.kind === (isMinimum ? "MINIMUM" : "MAXIMUM"), `${candidate.candidateId} seed ${seed} has wrong extremum class`);
      assert(isMinimum ? compareRational(left, expectedValue) > 0 && compareRational(right, expectedValue) > 0 : compareRational(left, expectedValue) < 0 && compareRational(right, expectedValue) < 0, `${candidate.candidateId} seed ${seed} failed neighboring-value extremum proof`);
      continue;
    }

    if (first.math.kind === "GLOBAL_SIGN_PARAMETER") {
      assert(first.answer.kind === "PARAMETER_RANGE", `${candidate.candidateId} seed ${seed} has wrong parameter answer kind`);
      if (first.answer.kind !== "PARAMETER_RANGE") continue;
      const below = subtractRational(first.answer.value.bound, rational(1n));
      const equal = first.answer.value.bound;
      const above = addRational(first.answer.value.bound, rational(1n));
      for (const sample of [below, equal, above]) {
        const rangeTruth = rangeContains(first.answer.value, sample);
        const mathTruth = globalConditionHolds(first.math.a, first.math.b, sample, first.math.target);
        assert(rangeTruth === mathTruth, `${candidate.candidateId} seed ${seed} parameter range mismatch at ${stable(sample)}`);
      }
      continue;
    }

    if (first.math.kind === "INTEGER_COUNT") {
      assert(first.answer.kind === "INTEGER_COUNT", `${candidate.candidateId} seed ${seed} has wrong count answer kind`);
      if (first.answer.kind !== "INTEGER_COUNT") continue;
      const rootState = solveQuadraticEquation(first.math.equation);
      assert(rootState.kind === "TWO_RATIONAL_ROOTS", `${candidate.candidateId} seed ${seed} integer-count state must have two rational roots`);
      let count = 0n;
      for (let x = -30; x <= 30; x += 1) {
        if (comparisonHolds(evalQuadratic(first.math.equation, rational(x)), first.math.operator)) count += 1n;
      }
      assert(first.answer.value === count, `${candidate.candidateId} seed ${seed} integer count mismatch`);
      continue;
    }

    if (first.math.kind === "SYMMETRIC_FIXED_SUM") {
      assert(first.answer.kind === "SYMMETRIC_EXTREMUM", `${candidate.candidateId} seed ${seed} has wrong symmetric-extremum answer kind`);
      if (first.answer.kind !== "SYMMETRIC_EXTREMUM") continue;
      const balanced = divideRational(first.math.sum, rational(3n));
      assert(equalsRational(first.answer.balancedVariable, balanced), `${candidate.candidateId} seed ${seed} has wrong equality state`);
      const expected = first.math.target === "RECIPROCAL_SUM"
        ? divideRational(rational(9n), first.math.sum)
        : divideRational(multiplyRational(first.math.sum, first.math.sum), rational(3n));
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} has wrong symmetric minimum`);

      const delta = divideRational(balanced, rational(2n));
      const x = addRational(balanced, delta);
      const y = subtractRational(balanced, delta);
      const z = balanced;
      assert(compareRational(y, ZERO) > 0, `${candidate.candidateId} seed ${seed} perturbation left positive domain`);
      const perturbed = first.math.target === "RECIPROCAL_SUM"
        ? addRational(addRational(divideRational(rational(1n), x), divideRational(rational(1n), y)), divideRational(rational(1n), z))
        : addRational(addRational(multiplyRational(x, x), multiplyRational(y, y)), multiplyRational(z, z));
      assert(compareRational(perturbed, expected) > 0, `${candidate.candidateId} seed ${seed} failed independent non-balanced minimum check`);
      continue;
    }

    throw new Error(`${candidate.candidateId} seed ${seed} has unverified math state ${first.math.kind}`);
  }
}

console.log(`ALG-CP-012 executable discovery passed for ${ALG_CP012_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);