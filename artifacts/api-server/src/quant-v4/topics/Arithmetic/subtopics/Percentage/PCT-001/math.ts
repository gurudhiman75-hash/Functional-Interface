export function roundTo(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number): string {
  const rounded = roundTo(value, 2);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

export function formatFraction(numerator: number, denominator: number): string {
  const sign = numerator * denominator < 0 ? "-" : "";
  const n = Math.abs(Math.round(numerator));
  const d = Math.abs(Math.round(denominator));
  const divisor = gcd(n, d);
  return `${sign}${n / divisor}/${d / divisor}`;
}

export function formatRatio(left: number, right: number): string {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function percentOf(rate: number, base: number): number {
  return (rate * base) / 100;
}

export function mathJaxLine(label: string, expression: string | number): string {
  return `${label}: \\(${expression}\\)`;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value);
}

export function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function stableBucket(seed: string, size: number): number {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}
