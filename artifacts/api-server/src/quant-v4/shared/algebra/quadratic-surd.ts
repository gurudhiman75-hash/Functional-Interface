import {
  ZERO,
  addRational,
  divideRational,
  equalsRational,
  isZeroRational,
  multiplyRational,
  negateRational,
  rational,
  type Rational,
} from "./rational";

export interface QuadraticSurd {
  p: Rational;
  q: Rational;
  d: bigint;
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function extractSquareFactor(value: bigint): { outside: bigint; squareFree: bigint } {
  if (value < 0n) throw new Error("Real quadratic surd radicand cannot be negative");
  if (value === 0n) return { outside: 0n, squareFree: 1n };
  let remaining = value;
  let outside = 1n;
  let squareFree = 1n;
  let p = 2n;
  while (p * p <= remaining) {
    let count = 0;
    while (remaining % p === 0n) {
      remaining /= p;
      count += 1;
    }
    if (count >= 2) outside *= p ** BigInt(Math.floor(count / 2));
    if (count % 2 === 1) squareFree *= p;
    p = p === 2n ? 3n : p + 2n;
  }
  if (remaining > 1n) squareFree *= remaining;
  return { outside, squareFree };
}

export function quadraticSurd(p: Rational, q: Rational, d: bigint): QuadraticSurd {
  if (d < 0n) throw new Error("Real quadratic surd radicand cannot be negative");
  if (isZeroRational(q) || d === 0n) return { p, q: ZERO, d: 1n };
  const { outside, squareFree } = extractSquareFactor(d);
  const scaledQ = multiplyRational(q, rational(outside));
  if (squareFree === 1n) {
    return { p: addRational(p, scaledQ), q: ZERO, d: 1n };
  }
  return { p, q: scaledQ, d: squareFree };
}

export function rationalAsSurd(value: Rational): QuadraticSurd {
  return quadraticSurd(value, ZERO, 1n);
}

export function sqrtRational(value: Rational): QuadraticSurd {
  if (value.numerator < 0n) throw new Error("Cannot take a real square root of a negative rational");
  if (value.numerator === 0n) return rationalAsSurd(ZERO);
  return quadraticSurd(ZERO, rational(1n, value.denominator), value.numerator * value.denominator);
}

export function negateSurd(value: QuadraticSurd): QuadraticSurd {
  return quadraticSurd(negateRational(value.p), negateRational(value.q), value.d);
}

export function addSurd(a: QuadraticSurd, b: QuadraticSurd): QuadraticSurd {
  if (isZeroRational(a.q)) return quadraticSurd(addRational(a.p, b.p), b.q, b.d);
  if (isZeroRational(b.q)) return quadraticSurd(addRational(a.p, b.p), a.q, a.d);
  if (a.d !== b.d) throw new Error("Addition of unlike quadratic surds is outside the canonical form");
  return quadraticSurd(addRational(a.p, b.p), addRational(a.q, b.q), a.d);
}

export function subtractSurd(a: QuadraticSurd, b: QuadraticSurd): QuadraticSurd {
  return addSurd(a, negateSurd(b));
}

export function multiplySurd(a: QuadraticSurd, b: QuadraticSurd): QuadraticSurd {
  if (isZeroRational(a.q)) return scaleSurd(b, a.p);
  if (isZeroRational(b.q)) return scaleSurd(a, b.p);
  if (a.d !== b.d) throw new Error("Multiplication of unlike non-rational quadratic surds is outside the canonical form");
  const rationalPart = addRational(
    multiplyRational(a.p, b.p),
    multiplyRational(multiplyRational(a.q, b.q), rational(a.d)),
  );
  const radicalPart = addRational(multiplyRational(a.p, b.q), multiplyRational(a.q, b.p));
  return quadraticSurd(rationalPart, radicalPart, a.d);
}

export function scaleSurd(value: QuadraticSurd, scalar: Rational): QuadraticSurd {
  return quadraticSurd(multiplyRational(value.p, scalar), multiplyRational(value.q, scalar), value.d);
}

export function divideSurdByRational(value: QuadraticSurd, divisor: Rational): QuadraticSurd {
  return quadraticSurd(divideRational(value.p, divisor), divideRational(value.q, divisor), value.d);
}

export function conjugateSurd(value: QuadraticSurd): QuadraticSurd {
  return quadraticSurd(value.p, negateRational(value.q), value.d);
}

export function equalsSurd(a: QuadraticSurd, b: QuadraticSurd): boolean {
  if (isZeroRational(a.q) && isZeroRational(b.q)) return equalsRational(a.p, b.p);
  return a.d === b.d && equalsRational(a.p, b.p) && equalsRational(a.q, b.q);
}

export function formatSurd(value: QuadraticSurd): string {
  if (isZeroRational(value.q)) return value.p.denominator === 1n ? value.p.numerator.toString() : `${value.p.numerator}/${value.p.denominator}`;
  const pText = value.p.numerator === 0n ? "" : `${value.p.numerator}/${value.p.denominator}`;
  const qAbs = abs(value.q.numerator);
  const qText = value.q.denominator === 1n ? (qAbs === 1n ? "" : qAbs.toString()) : `${qAbs}/${value.q.denominator}`;
  const radical = `${qText}√${value.d}`;
  if (!pText) return value.q.numerator < 0n ? `-${radical}` : radical;
  return `${pText} ${value.q.numerator < 0n ? "-" : "+"} ${radical}`;
}
