import {
  ZERO,
  addSurd,
  equalsRational,
  equalsSurd,
  multiplySurd,
  quadraticDiscriminant,
  rational,
  rationalAsSurd,
  scaleSurd,
  solveQuadraticEquation,
  type QuadraticEquation,
  type QuadraticSurd,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP009_DISCOVERY_CANDIDATES, generateAlgCp009DiscoveryItem } from "../ALG-002/ALG-CP-009";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function evaluateRationalQuadratic(equation: QuadraticEquation, x: Rational): Rational {
  const x2 = rational(x.numerator * x.numerator, x.denominator * x.denominator);
  const ax2 = rational(equation.a.numerator * x2.numerator, equation.a.denominator * x2.denominator);
  const bx = rational(equation.b.numerator * x.numerator, equation.b.denominator * x.denominator);
  return rational(
    ax2.numerator * bx.denominator * equation.c.denominator
      + bx.numerator * ax2.denominator * equation.c.denominator
      + equation.c.numerator * ax2.denominator * bx.denominator,
    ax2.denominator * bx.denominator * equation.c.denominator,
  );
}

function evaluateSurdQuadratic(equation: QuadraticEquation, x: QuadraticSurd): QuadraticSurd {
  const x2 = multiplySurd(x, x);
  return addSurd(
    addSurd(scaleSurd(x2, equation.a), scaleSurd(x, equation.b)),
    rationalAsSurd(equation.c),
  );
}

for (const candidate of ALG_CP009_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp009DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp009DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 12, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 40, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    const canonical = solveQuadraticEquation(first.equation);

    if (first.answer.kind === "RATIONAL_ROOT_SET") {
      for (const root of first.answer.values) {
        assert(equalsRational(evaluateRationalQuadratic(first.equation, root), ZERO), `${candidate.candidateId} seed ${seed} rational root fails substitution`);
      }
      if (first.answer.values.length === 1) assert(canonical.kind === "REPEATED_ROOT", `${candidate.candidateId} seed ${seed} expected repeated root`);
      else assert(canonical.kind === "TWO_RATIONAL_ROOTS", `${candidate.candidateId} seed ${seed} expected two rational roots`);
    }

    if (first.answer.kind === "SURD_ROOT_SET") {
      assert(canonical.kind === "TWO_IRRATIONAL_ROOTS", `${candidate.candidateId} seed ${seed} expected two irrational roots`);
      for (const root of first.answer.values) {
        assert(equalsSurd(evaluateSurdQuadratic(first.equation, root), rationalAsSurd(ZERO)), `${candidate.candidateId} seed ${seed} surd root fails exact substitution`);
      }
    }

    if (first.answer.kind === "NO_REAL_ROOTS") {
      assert(canonical.kind === "NO_REAL_ROOTS", `${candidate.candidateId} seed ${seed} should have no real roots`);
      assert(quadraticDiscriminant(first.equation).numerator < 0n, `${candidate.candidateId} seed ${seed} discriminant should be negative`);
    }

    if (first.answer.kind === "PARAMETER_VALUE" && candidate.solveMode === "findParameterForEqualRoots") {
      assert(equalsRational(first.answer.value, first.equation.c), `${candidate.candidateId} seed ${seed} parameter/state mismatch`);
      assert(quadraticDiscriminant(first.equation).numerator === 0n, `${candidate.candidateId} seed ${seed} equal-root discriminant is not zero`);
    }

    if (first.answer.kind === "PARAMETER_VALUE" && candidate.solveMode === "findCoefficientFromKnownRoot") {
      assert(equalsRational(first.answer.value, first.equation.b), `${candidate.candidateId} seed ${seed} coefficient/state mismatch`);
      assert(first.knownRootEvidence !== undefined, `${candidate.candidateId} seed ${seed} lacks known-root evidence`);
      assert(equalsRational(evaluateRationalQuadratic(first.equation, first.knownRootEvidence!), ZERO), `${candidate.candidateId} seed ${seed} known root does not satisfy equation`);
    }
  }
}

console.log(`ALG-CP-009 executable discovery passed for ${ALG_CP009_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
