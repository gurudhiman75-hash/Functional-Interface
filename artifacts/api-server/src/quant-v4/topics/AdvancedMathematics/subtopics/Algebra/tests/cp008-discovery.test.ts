import {
  equalsRational,
  evaluatePolynomial,
  rational,
  rationalEquationCrossPolynomial,
  rationalEquationExcludedValues,
  solveRationalEquationOverRationals,
  verifyRationalEquationCandidate,
} from "../../../../../shared/algebra";
import { ALG_CP008_DISCOVERY_CANDIDATES, generateAlgCp008DiscoveryItem } from "../ALG-002/ALG-CP-008";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP008_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp008DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp008DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 15, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 45, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    const excluded = rationalEquationExcludedValues(first.equation);
    for (const value of excluded) {
      const leftZero = evaluatePolynomial(first.equation.left.denominator, value).numerator === 0n;
      const rightZero = evaluatePolynomial(first.equation.right.denominator, value).numerator === 0n;
      assert(leftZero || rightZero, `${candidate.candidateId} seed ${seed} recorded a non-domain exclusion`);
      assert(!verifyRationalEquationCandidate(first.equation, value), `${candidate.candidateId} seed ${seed} accepted an excluded value`);
    }

    if (first.answer.kind === "EXCLUDED_VALUE") {
      assert(excluded.some((value) => equalsRational(value, first.answer.value)), `${candidate.candidateId} seed ${seed} excluded answer mismatch`);
    }

    if (first.answer.kind === "ROOT_SET") {
      const solved = solveRationalEquationOverRationals(first.equation);
      assert(solved.kind === "FINITE", `${candidate.candidateId} seed ${seed} should have finite roots`);
      if (solved.kind === "FINITE") {
        assert(solved.roots.length === first.answer.values.length, `${candidate.candidateId} seed ${seed} root-count mismatch`);
        for (const root of first.answer.values) {
          assert(solved.roots.some((value) => equalsRational(value, root)), `${candidate.candidateId} seed ${seed} root-set mismatch`);
          assert(verifyRationalEquationCandidate(first.equation, root), `${candidate.candidateId} seed ${seed} root fails original equation`);
          assert(!excluded.some((value) => equalsRational(value, root)), `${candidate.candidateId} seed ${seed} retained an excluded root`);
        }
        if (candidate.solveMode === "rejectCancelledExcludedRoot") {
          assert(solved.rejectedExcludedRoots.length === 1, `${candidate.candidateId} seed ${seed} should reject exactly one cancelled root`);
          const cross = rationalEquationCrossPolynomial(first.equation);
          assert(evaluatePolynomial(cross, solved.rejectedExcludedRoots[0]!).numerator === 0n, `${candidate.candidateId} seed ${seed} rejected root was not a cross-multiplied candidate`);
        }
      }
    }

    if (first.answer.kind === "NO_SOLUTION") {
      const solved = solveRationalEquationOverRationals(first.equation);
      assert(solved.kind === "NO_SOLUTION", `${candidate.candidateId} seed ${seed} should have no valid solution`);
      if (candidate.solveMode === "classifyNoValidRootAfterFiltering" && solved.kind === "NO_SOLUTION") {
        assert(solved.rejectedExcludedRoots.length === 1, `${candidate.candidateId} seed ${seed} should reject its only algebraic root`);
      }
    }

    if (first.answer.kind === "INFINITE_ON_DOMAIN") {
      const solved = solveRationalEquationOverRationals(first.equation);
      assert(solved.kind === "INFINITE_ON_DOMAIN", `${candidate.candidateId} seed ${seed} should be an identity on its domain`);
      for (const sample of [rational(-9n), rational(-2n), rational(0n), rational(3n), rational(11n)]) {
        if (excluded.some((value) => equalsRational(value, sample))) continue;
        assert(verifyRationalEquationCandidate(first.equation, sample), `${candidate.candidateId} seed ${seed} identity failed at sample ${String(sample.numerator)}`);
      }
    }
  }
}

console.log(`ALG-CP-008 executable discovery passed for ${ALG_CP008_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
