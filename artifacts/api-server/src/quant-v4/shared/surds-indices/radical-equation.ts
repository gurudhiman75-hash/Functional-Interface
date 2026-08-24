import { compareRational, equalsRational, multiplyRational, rational, type Rational } from "./rational";

export interface RadicalCandidateCheck {
  readonly valid: boolean;
  readonly reason: string;
}

/** Verify a candidate against sqrt(radicand)=rhs in the original real domain. */
export function verifySquareRootEquationCandidate(radicand: Rational, rhs: Rational): RadicalCandidateCheck {
  if (compareRational(radicand, rational(0n)) < 0) return { valid: false, reason: "radicand is negative in the original equation" };
  if (compareRational(rhs, rational(0n)) < 0) return { valid: false, reason: "principal square root cannot equal a negative right-hand side" };
  const squaredRhs = multiplyRational(rhs, rhs);
  if (!equalsRational(squaredRhs, radicand)) return { valid: false, reason: "candidate fails substitution into the original equation" };
  return { valid: true, reason: "candidate satisfies the original radical equation" };
}
