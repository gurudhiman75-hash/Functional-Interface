export type Di001Rational = Readonly<{
  numerator: bigint;
  denominator: bigint;
}>;

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left === 0n ? 1n : left;
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1n): Di001Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("DI rational denominator cannot be zero.");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcdBigInt(n, d);
  return { numerator: n / divisor, denominator: d / divisor };
}

export function addRational(a: Di001Rational, b: Di001Rational): Di001Rational {
  return rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

export function multiplyRational(a: Di001Rational, b: Di001Rational): Di001Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divideRational(a: Di001Rational, b: Di001Rational): Di001Rational {
  if (b.numerator === 0n) throw new Error("DI rational division by zero.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function rationalEquals(a: Di001Rational, b: Di001Rational): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export function rationalToDisplay(value: Di001Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `${value.numerator}/${value.denominator}`;
}

export function ratioDisplay(left: number, right: number): string {
  const divisor = Number(gcdBigInt(BigInt(left), BigInt(right)));
  return `${left / divisor}:${right / divisor}`;
}

export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: string): () => number {
  let state = hashSeed(seed) || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(random: () => number, values: readonly T[]): T {
  if (!values.length) throw new Error("Cannot pick from an empty DI pool.");
  return values[Math.floor(random() * values.length)]!;
}

export function shuffle<T>(random: () => number, values: readonly T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target]!, result[index]!];
  }
  return result;
}
