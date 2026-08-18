import {
  absRational,
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  intervalContains,
  multiplyRational,
  negateRational,
  rational,
  subtractRational,
  type AbsoluteEquationSolution,
  type InequalityOperator,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP013_DISCOVERY_CANDIDATES, generateAlgCp013DiscoveryItem } from "../ALG-002/ALG-CP-013";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function absoluteValue(a: Rational, b: Rational, x: Rational): Rational {
  return absRational(addRational(multiplyRational(a, x), b));
}

function inequalityTruth(value: Rational, rhs: Rational, operator: InequalityOperator): boolean {
  const sign = compareRational(value, rhs);
  return operator === "GT" ? sign > 0 : operator === "GE" ? sign >= 0 : operator === "LT" ? sign < 0 : sign <= 0;
}

function sortRationals(values: Rational[]): Rational[] {
  return [...values].sort((a, b) => compareRational(a, b));
}

function independentEquationSolution(a: Rational, b: Rational, rhs: Rational): AbsoluteEquationSolution {
  if (rhs.numerator < 0n) return { kind: "NO_SOLUTION" };
  if (a.numerator === 0n) {
    return equalsRational(absRational(b), rhs) ? { kind: "ALL_REAL" } : { kind: "NO_SOLUTION" };
  }
  if (rhs.numerator === 0n) return { kind: "FINITE", values: [divideRational(negateRational(b), a)] };
  return {
    kind: "FINITE",
    values: sortRationals([
      divideRational(addRational(rhs, negateRational(b)), a),
      divideRational(addRational(negateRational(rhs), negateRational(b)), a),
    ]),
  };
}

function solutionEquals(a: AbsoluteEquationSolution, b: AbsoluteEquationSolution): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind !== "FINITE" || b.kind !== "FINITE") return true;
  if (a.values.length !== b.values.length) return false;
  return a.values.every((value, index) => equalsRational(value, b.values[index]!));
}

function midpoint(a: Rational, b: Rational): Rational {
  return divideRational(addRational(a, b), rational(2n));
}

for (const candidate of ALG_CP013_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp013DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp013DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 12, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 55, `${candidate.candidateId} seed ${seed} has incomplete explanation`);
    assert(first.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} seed ${seed} leaked maturity`);

    if (first.math.kind === "ABS_EQUATION") {
      assert(first.answer.kind === "ABSOLUTE_SOLUTION", `${candidate.candidateId} seed ${seed} has wrong equation answer kind`);
      if (first.answer.kind !== "ABSOLUTE_SOLUTION") continue;
      const expected = independentEquationSolution(first.math.a, first.math.b, first.math.rhs);
      assert(solutionEquals(first.answer.value, expected), `${candidate.candidateId} seed ${seed} absolute equation mismatch`);
      if (first.answer.value.kind === "FINITE") {
        for (const value of first.answer.value.values) {
          assert(equalsRational(absoluteValue(first.math.a, first.math.b, value), first.math.rhs), `${candidate.candidateId} seed ${seed} returned non-solution`);
        }
      }
      continue;
    }

    if (first.math.kind === "EQUAL_DISTANCE") {
      assert(first.answer.kind === "ABSOLUTE_SOLUTION", `${candidate.candidateId} seed ${seed} has wrong equal-distance answer kind`);
      if (first.answer.kind !== "ABSOLUTE_SOLUTION") continue;
      if (equalsRational(first.math.leftCenter, first.math.rightCenter)) {
        assert(first.answer.value.kind === "ALL_REAL", `${candidate.candidateId} seed ${seed} equal centers should allow all reals`);
      } else {
        const expected = midpoint(first.math.leftCenter, first.math.rightCenter);
        assert(first.answer.value.kind === "FINITE" && first.answer.value.values.length === 1 && equalsRational(first.answer.value.values[0]!, expected), `${candidate.candidateId} seed ${seed} midpoint mismatch`);
        const leftDistance = absRational(subtractRational(expected, first.math.leftCenter));
        const rightDistance = absRational(subtractRational(expected, first.math.rightCenter));
        assert(equalsRational(leftDistance, rightDistance), `${candidate.candidateId} seed ${seed} midpoint fails distance proof`);
      }
      continue;
    }

    if (first.math.kind === "ABS_INEQUALITY") {
      assert(first.answer.kind === "INTERVAL_SET", `${candidate.candidateId} seed ${seed} has wrong inequality answer kind`);
      if (first.answer.kind !== "INTERVAL_SET") continue;
      const samples: Rational[] = [];
      const center = divideRational(negateRational(first.math.b), first.math.a);
      if (first.math.rhs.numerator > 0n) {
        const left = divideRational(addRational(negateRational(first.math.rhs), negateRational(first.math.b)), first.math.a);
        const right = divideRational(addRational(first.math.rhs, negateRational(first.math.b)), first.math.a);
        const low = compareRational(left, right) <= 0 ? left : right;
        const high = compareRational(left, right) <= 0 ? right : left;
        samples.push(subtractRational(low, rational(1n)), low, midpoint(low, high), high, addRational(high, rational(1n)));
      } else {
        samples.push(subtractRational(center, rational(1n)), center, addRational(center, rational(1n)));
      }
      for (const sample of samples) {
        const truth = inequalityTruth(absoluteValue(first.math.a, first.math.b, sample), first.math.rhs, first.math.operator);
        assert(intervalContains(first.answer.value, sample) === truth, `${candidate.candidateId} seed ${seed} interval mismatch at ${stable(sample)}`);
      }
      continue;
    }

    if (first.math.kind === "INTEGER_COUNT") {
      assert(first.answer.kind === "INTEGER_COUNT", `${candidate.candidateId} seed ${seed} has wrong integer-count answer kind`);
      if (first.answer.kind !== "INTEGER_COUNT") continue;
      let count = 0n;
      for (let x = -30; x <= 30; x += 1) {
        if (inequalityTruth(absoluteValue(first.math.a, first.math.b, rational(x)), first.math.rhs, first.math.operator)) count += 1n;
      }
      assert(first.answer.value === count, `${candidate.candidateId} seed ${seed} integer count mismatch`);
      continue;
    }

    throw new Error(`${candidate.candidateId} seed ${seed} has unsupported state ${first.math.kind}`);
  }
}

console.log(`ALG-CP-013 executable discovery passed for ${ALG_CP013_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
