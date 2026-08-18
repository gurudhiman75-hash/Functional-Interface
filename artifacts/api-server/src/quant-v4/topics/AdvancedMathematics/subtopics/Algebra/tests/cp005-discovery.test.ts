import {
  dividePolynomialByLinearFactor,
  equalsRational,
  evaluatePolynomial,
  verifyLinearPolynomialDivision,
} from "../../../../../shared/algebra";
import { ALG_CP005_DISCOVERY_CANDIDATES, generateAlgCp005DiscoveryItem } from "../ALG-001/ALG-CP-005";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP005_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp005DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp005DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 15, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 40, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    const division = dividePolynomialByLinearFactor(first.polynomial, first.divisor.root);
    assert(verifyLinearPolynomialDivision(first.polynomial, division), `${candidate.candidateId} seed ${seed} failed division recomposition`);
    assert(equalsRational(evaluatePolynomial(first.polynomial, first.divisor.root), division.remainder), `${candidate.candidateId} seed ${seed} theorem/division mismatch`);

    if (candidate.solveMode === "findRemainderForXMinusK" || candidate.solveMode === "findRemainderForXPlusK" || candidate.solveMode === "findRemainderForGeneralLinearDivisor") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong answer kind`);
      if (first.answer.kind === "RATIONAL") {
        assert(equalsRational(first.answer.value, division.remainder), `${candidate.candidateId} seed ${seed} has wrong remainder answer`);
      }
    }

    if (candidate.solveMode === "findUnknownCoefficientFromFactorCondition" || candidate.solveMode === "findUnknownCoefficientFromGivenRemainder") {
      assert(first.answer.kind === "RATIONAL", `${candidate.candidateId} seed ${seed} has wrong coefficient answer kind`);
      if (first.answer.kind === "RATIONAL") {
        assert(equalsRational(first.answer.value, first.polynomial.coefficients[2]!), `${candidate.candidateId} seed ${seed} coefficient answer/state mismatch`);
      }
    }

    if (candidate.solveMode === "findUnknownCoefficientFromFactorCondition") {
      assert(division.remainder.numerator === 0n, `${candidate.candidateId} seed ${seed} violates factor condition`);
    }

    if (candidate.solveMode === "verifyDeclaredLinearFactor") {
      assert(first.answer.kind === "BOOLEAN", `${candidate.candidateId} seed ${seed} has wrong boolean answer kind`);
      if (first.answer.kind === "BOOLEAN") {
        assert(first.answer.value === (division.remainder.numerator === 0n), `${candidate.candidateId} seed ${seed} factor verdict mismatch`);
      }
    }
  }
}

console.log(`ALG-CP-005 executable discovery passed for ${ALG_CP005_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
