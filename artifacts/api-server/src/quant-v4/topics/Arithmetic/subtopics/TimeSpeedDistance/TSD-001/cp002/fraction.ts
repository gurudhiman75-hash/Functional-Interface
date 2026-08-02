export interface Fraction {
  readonly n: number;
  readonly d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function f(n: number, d = 1): Fraction {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0) {
    throw new Error(`Invalid exact fraction ${n}/${d}`);
  }
  const sign = d < 0 ? -1 : 1;
  const divisor = gcd(n, d);
  return Object.freeze({ n: sign * n / divisor, d: Math.abs(d) / divisor });
}

export const ZERO = f(0);
export const ONE = f(1);

export function add(a: Fraction, b: Fraction): Fraction {
  return f(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subtract(a: Fraction, b: Fraction): Fraction {
  return f(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function multiply(a: Fraction, b: Fraction): Fraction {
  return f(a.n * b.n, a.d * b.d);
}

export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.n === 0) throw new Error("Division by zero");
  return f(a.n * b.d, a.d * b.n);
}

export function reciprocal(value: Fraction): Fraction {
  if (value.n === 0) throw new Error("Zero has no reciprocal");
  return f(value.d, value.n);
}

export function equals(a: Fraction, b: Fraction): boolean {
  return a.n === b.n && a.d === b.d;
}

export function compare(a: Fraction, b: Fraction): number {
  return Math.sign(a.n * b.d - b.n * a.d);
}

export function isPositive(value: Fraction): boolean {
  return value.n > 0;
}

export function sum(values: readonly Fraction[]): Fraction {
  return values.reduce(add, ZERO);
}

export function average(values: readonly Fraction[]): Fraction {
  if (values.length === 0) throw new Error("Cannot average an empty list");
  return divide(sum(values), f(values.length));
}

function finiteDecimalPlaces(denominator: number): number | null {
  let value = denominator;
  let twos = 0;
  let fives = 0;
  while (value % 2 === 0) {
    value /= 2;
    twos += 1;
  }
  while (value % 5 === 0) {
    value /= 5;
    fives += 1;
  }
  return value === 1 ? Math.max(twos, fives) : null;
}

export function formatFraction(value: Fraction): string {
  if (value.d === 1) return String(value.n);
  const places = finiteDecimalPlaces(value.d);
  if (places !== null && places <= 3) {
    return (value.n / value.d).toFixed(places).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "");
  }
  return `${value.n}/${value.d}`;
}

export function formatRatio(value: Fraction): string {
  return `${value.n}:${value.d}`;
}

export function stableFraction(value: Fraction): string {
  return `${value.n}/${value.d}`;
}
