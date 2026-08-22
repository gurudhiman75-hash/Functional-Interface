import {
  ZERO,
  compareRational,
  multiplyRational,
  rational,
  type Rational,
} from "./rational";
import {
  addSurd,
  negateSurd,
  rationalAsSurd,
  type QuadraticSurd,
} from "./quadratic-surd";

/**
 * Exact ordering for quadratic surds when the irrational parts share one
 * radicand (or either side is rational). No floating-point approximation is
 * used. Unlike-radicand comparisons remain deliberately unsupported.
 */
export function compareQuadraticSurdExact(a: QuadraticSurd, b: QuadraticSurd): -1 | 0 | 1 {
  if (a.q.numerator !== 0n && b.q.numerator !== 0n && a.d !== b.d) {
    throw new Error("Exact comparison of unlike quadratic-surd radicands is not supported");
  }
  return signOfQuadraticSurd(addSurd(a, negateSurd(b)));
}

export function signOfQuadraticSurd(value: QuadraticSurd): -1 | 0 | 1 {
  const qSign = compareRational(value.q, ZERO);
  if (qSign === 0) return compareRational(value.p, ZERO);

  const pSign = compareRational(value.p, ZERO);
  if (pSign === 0) return qSign;
  if (pSign === qSign) return pSign;

  const pSquared = multiplyRational(value.p, value.p);
  const qSquaredTimesD = multiplyRational(multiplyRational(value.q, value.q), rational(value.d));
  const magnitudeCmp = compareRational(pSquared, qSquaredTimesD);
  if (magnitudeCmp === 0) return 0;
  return magnitudeCmp > 0 ? pSign : qSign;
}

export function compareRationalAsExactSurd(a: Rational, b: QuadraticSurd): -1 | 0 | 1 {
  return compareQuadraticSurdExact(rationalAsSurd(a), b);
}
