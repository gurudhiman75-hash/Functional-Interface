import {
  ZERO,
  addRational,
  divideRational,
  equalsRational,
  evaluatePolynomial,
  multiplyRational,
  rational,
  subtractRational,
  type QuadraticEquation,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP010_DISCOVERY_CANDIDATES, generateAlgCp010DiscoveryItem } from "../ALG-002/ALG-CP-010";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function evaluateQuadratic(equation: QuadraticEquation, x: Rational): Rational {
  return addRational(
    addRational(
      multiplyRational(equation.a, multiplyRational(x, x)),
      multiplyRational(equation.b, x),
    ),
    equation.c,
  );
}

const cubicTargetsSeen = new Set<string>();

for (const candidate of ALG_CP010_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp010DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp010DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 18, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 40, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    if (candidate.solveMode === "findDirectCubicVietaInvariant") {
      assert(first.originalPolynomial !== undefined, `${candidate.candidateId} seed ${seed} lacks cubic polynomial evidence`);
      assert(first.hiddenCubicRoots !== undefined, `${candidate.candidateId} seed ${seed} lacks cubic roots`);
      assert(first.cubicInvariantTarget !== undefined, `${candidate.candidateId} seed ${seed} lacks cubic target evidence`);
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} cubic Vieta answer must be rational`);
      if (!first.originalPolynomial || !first.hiddenCubicRoots || !first.cubicInvariantTarget || first.answer.kind !== "RATIONAL") continue;
      const [alpha, beta, gamma] = first.hiddenCubicRoots;
      for (const root of first.hiddenCubicRoots) {
        assert(equalsRational(evaluatePolynomial(first.originalPolynomial, root), ZERO), `${candidate.candidateId} seed ${seed} hidden cubic root fails substitution`);
      }
      const expected = first.cubicInvariantTarget === "SUM"
        ? addRational(addRational(alpha, beta), gamma)
        : first.cubicInvariantTarget === "PAIRWISE_PRODUCT_SUM"
          ? addRational(addRational(multiplyRational(alpha, beta), multiplyRational(beta, gamma)), multiplyRational(gamma, alpha))
          : multiplyRational(multiplyRational(alpha, beta), gamma);
      cubicTargetsSeen.add(first.cubicInvariantTarget);
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} cubic invariant mismatch`);
      continue;
    }

    assert(first.originalEquation !== undefined, `${candidate.candidateId} seed ${seed} lacks quadratic equation evidence`);
    assert(first.hiddenRoots !== undefined, `${candidate.candidateId} seed ${seed} lacks hidden-root evidence`);
    if (!first.originalEquation || !first.hiddenRoots) continue;
    const [alpha, beta] = first.hiddenRoots;
    assert(equalsRational(evaluateQuadratic(first.originalEquation, alpha), ZERO), `${candidate.candidateId} seed ${seed} alpha is not an original root`);
    assert(equalsRational(evaluateQuadratic(first.originalEquation, beta), ZERO), `${candidate.candidateId} seed ${seed} beta is not an original root`);

    if (first.answer.kind === "RATIONAL") {
      let expected: Rational;
      switch (candidate.solveMode) {
        case "findSumOfRootsByVieta":
          expected = addRational(alpha, beta);
          break;
        case "findProductOfRootsByVieta":
          expected = multiplyRational(alpha, beta);
          break;
        case "findSquareSumOfRootsByVieta":
          expected = addRational(multiplyRational(alpha, alpha), multiplyRational(beta, beta));
          break;
        case "findReciprocalSumOfRootsByVieta":
          expected = addRational(divideRational(rational(1n), alpha), divideRational(rational(1n), beta));
          break;
        case "findCubeSumOfRootsByVieta":
          expected = addRational(
            multiplyRational(multiplyRational(alpha, alpha), alpha),
            multiplyRational(multiplyRational(beta, beta), beta),
          );
          break;
        case "findOtherRootFromKnownRoot":
          assert(first.knownRootEvidence !== undefined, `${candidate.candidateId} seed ${seed} lacks known root`);
          expected = equalsRational(first.knownRootEvidence!, alpha) ? beta : alpha;
          break;
        default:
          throw new Error(`${candidate.candidateId} unexpectedly returned a scalar answer`);
      }
      assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} Vieta target mismatch`);
    }

    if (first.answer.kind === "QUADRATIC_EQUATION") {
      assert(equalsRational(first.answer.value.a, rational(1n)), `${candidate.candidateId} seed ${seed} transformed equation must be monic`);
      let transformedRoots: [Rational, Rational];
      if (candidate.solveMode === "constructEquationWithShiftedRoots") {
        assert(first.transformEvidence?.kind === "SHIFT", `${candidate.candidateId} seed ${seed} lacks shift evidence`);
        const shift = first.transformEvidence!.kind === "SHIFT" ? first.transformEvidence!.value : rational(0n);
        transformedRoots = [addRational(alpha, shift), addRational(beta, shift)];
      } else if (candidate.solveMode === "constructEquationWithReciprocalRoots") {
        transformedRoots = [divideRational(rational(1n), alpha), divideRational(rational(1n), beta)];
      } else if (candidate.solveMode === "constructEquationWithProductPlusMinusSumRoots") {
        assert(first.transformEvidence?.kind === "PRODUCT_PLUS_MINUS_SUM", `${candidate.candidateId} seed ${seed} lacks symmetric-transform evidence`);
        const sum = addRational(alpha, beta);
        const product = multiplyRational(alpha, beta);
        transformedRoots = [addRational(product, sum), subtractRational(product, sum)];
      } else if (candidate.solveMode === "constructEquationWithReciprocalThenShiftedRoots") {
        assert(first.transformEvidence?.kind === "RECIPROCAL_THEN_SHIFT", `${candidate.candidateId} seed ${seed} lacks composed-transform evidence`);
        const shift = first.transformEvidence!.kind === "RECIPROCAL_THEN_SHIFT" ? first.transformEvidence!.value : rational(0n);
        transformedRoots = [
          addRational(divideRational(rational(1n), alpha), shift),
          addRational(divideRational(rational(1n), beta), shift),
        ];
      } else {
        transformedRoots = [alpha, beta];
      }
      assert(equalsRational(evaluateQuadratic(first.answer.value, transformedRoots[0]), ZERO), `${candidate.candidateId} seed ${seed} first transformed root fails`);
      assert(equalsRational(evaluateQuadratic(first.answer.value, transformedRoots[1]), ZERO), `${candidate.candidateId} seed ${seed} second transformed root fails`);
    }
  }
}

assert(cubicTargetsSeen.size === 3, `Cubic Vieta discovery must exercise sum, pairwise-product sum and product; saw ${[...cubicTargetsSeen].join(", ")}`);
console.log(`ALG-CP-010 executable discovery passed for ${ALG_CP010_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);