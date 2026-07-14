export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function simplifyRatio(values: readonly number[]) {
  const divisor = values.reduce((acc, value) => gcd(acc, value), 0) || 1;
  return values.map((value) => Math.round(value / divisor));
}

export function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100).replace(/\.?0+$/, "");
}

export function ratioLatex(values: readonly number[]) {
  return values.join(" : ");
}

export function stableHash(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, size: number) {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

export function pick<T>(values: readonly T[], seed: string): T {
  return values[stableBucket(seed, values.length)]!;
}
