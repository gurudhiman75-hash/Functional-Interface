import {
  addRational,
  equalsRational,
  multiplyRational,
  rational,
  solveLinearEquation,
  subtractRational,
  verifyLinearSolution,
  type LinearEquation,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_CP006_DISCOVERY_CANDIDATES, generateAlgCp006DiscoveryItem } from "../ALG-002/ALG-CP-006";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function sideValue(coefficient: Rational, constant: Rational, x: Rational): Rational {
  return addRational(multiplyRational(coefficient, x), constant);
}

function independentClassify(equation: LinearEquation): "UNIQUE" | "NO_SOLUTION" | "INFINITE_SOLUTIONS" {
  const zero = rational(0n);
  const one = rational(1n);
  const diffAtZero = subtractRational(
    sideValue(equation.leftCoefficient, equation.leftConstant, zero),
    sideValue(equation.rightCoefficient, equation.rightConstant, zero),
  );
  const diffAtOne = subtractRational(
    sideValue(equation.leftCoefficient, equation.leftConstant, one),
    sideValue(equation.rightCoefficient, equation.rightConstant, one),
  );
  if (diffAtZero.numerator === 0n && diffAtOne.numerator === 0n) return "INFINITE_SOLUTIONS";
  if (equalsRational(diffAtZero, diffAtOne)) return "NO_SOLUTION";
  return "UNIQUE";
}

for (const candidate of ALG_CP006_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp006DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp006DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 12, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 45, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    const canonical = solveLinearEquation(first.equation);
    const independent = independentClassify(first.equation);
    assert(canonical.kind === independent, `${candidate.candidateId} seed ${seed} solver/classifier disagreement`);

    if (first.answer.kind === "UNIQUE_VALUE") {
      assert(canonical.kind === "UNIQUE", `${candidate.candidateId} seed ${seed} expected unique canonical solution`);
      if (canonical.kind === "UNIQUE") {
        assert(equalsRational(first.answer.value, canonical.value), `${candidate.candidateId} seed ${seed} answer mismatch`);
        assert(verifyLinearSolution(first.equation, first.answer.value), `${candidate.candidateId} seed ${seed} substitution failed`);
      }
    }

    if (first.answer.kind === "NO_SOLUTION") {
      assert(independent === "NO_SOLUTION", `${candidate.candidateId} seed ${seed} should be inconsistent`);
    }

    if (first.answer.kind === "INFINITE_SOLUTIONS") {
      assert(independent === "INFINITE_SOLUTIONS", `${candidate.candidateId} seed ${seed} should be an identity`);
    }

    if (first.answer.kind === "PARAMETER_VALUE") {
      assert(first.parameterEvidence !== undefined, `${candidate.candidateId} seed ${seed} lacks parameter evidence`);
      const evidence = first.parameterEvidence!;
      const reconstructedCoefficient = addRational(first.answer.value, evidence.coefficientOffset);
      assert(equalsRational(reconstructedCoefficient, first.equation.leftCoefficient), `${candidate.candidateId} seed ${seed} parameter/coefficient mismatch`);
      assert(verifyLinearSolution(first.equation, evidence.knownSolution), `${candidate.candidateId} seed ${seed} known solution does not verify`);
    }
  }
}

console.log(`ALG-CP-006 executable discovery passed for ${ALG_CP006_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
