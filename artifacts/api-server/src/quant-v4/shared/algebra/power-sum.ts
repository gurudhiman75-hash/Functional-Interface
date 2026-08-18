import { TWO, multiplyRational, subtractRational, type Rational } from "./rational";

/**
 * Exact Newton recurrence for roots r1,r2 of t^2 - s*t + p = 0:
 * P0 = 2, P1 = s, Pn = s*P(n-1) - p*P(n-2).
 */
export function powerSumOfQuadraticRoots(sum: Rational, product: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("Power-sum exponent must be a non-negative integer");
  if (exponent === 0) return TWO;
  if (exponent === 1) return sum;
  let previous2 = TWO;
  let previous1 = sum;
  for (let n = 2; n <= exponent; n += 1) {
    const current = subtractRational(multiplyRational(sum, previous1), multiplyRational(product, previous2));
    previous2 = previous1;
    previous1 = current;
  }
  return previous1;
}

/** x and 1/x are roots of t^2 - s*t + 1 = 0 when s = x + 1/x. */
export function reciprocalPlusPowerSum(sumXAndReciprocal: Rational, exponent: number): Rational {
  return powerSumOfQuadraticRoots(sumXAndReciprocal, { numerator: 1n, denominator: 1n }, exponent);
}
