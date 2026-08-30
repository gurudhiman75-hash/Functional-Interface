import { equalRational } from "./math";
import type {
  Prt001IndependentVerification,
  Prt001Solution,
  Prt001ValidationCheck,
  Prt001ValidationResult,
  Rational,
} from "./types";

function compareRecord(
  expected: Readonly<Record<string, Rational>>,
  actual: Readonly<Record<string, Rational>>,
): boolean {
  const expectedKeys = Object.keys(expected).sort();
  const actualKeys = Object.keys(actual).sort();
  return (
    expectedKeys.length === actualKeys.length &&
    expectedKeys.every((key, index) => key === actualKeys[index]) &&
    expectedKeys.every((key) => equalRational(expected[key]!, actual[key]!))
  );
}

export function validatePrt001Solution(
  solution: Prt001Solution,
  verification: Prt001IndependentVerification,
): Prt001ValidationResult {
  const checks: Prt001ValidationCheck[] = [
    {
      name: "verifier-weights",
      passed:
        solution.timeline.weights.length === verification.weights.length &&
        solution.timeline.weights.every((weight, index) => {
          const verified = verification.weights[index];
          return (
            verified?.partnerId === weight.partnerId &&
            equalRational(verified.effectiveCapital, weight.effectiveCapital)
          );
        }),
      message:
        "canonical and boundary-sweep effective-capital weights must match",
    },
    {
      name: "verifier-pool",
      passed: equalRational(
        solution.pool.distributablePool,
        verification.distributablePool,
      ),
      message:
        "canonical and independently reconstructed distributable pools must match",
    },
    {
      name: "verifier-shares",
      passed: compareRecord(
        solution.distributedShares,
        verification.distributedShares,
      ),
      message: "canonical and independent distributed shares must match",
    },
    {
      name: "verifier-final-receipts",
      passed: compareRecord(
        solution.finalPartnerReceipts,
        verification.finalPartnerReceipts,
      ),
      message: "canonical and independent final partner receipts must match",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
