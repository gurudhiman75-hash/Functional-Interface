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

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function gcdMany(values: readonly number[]) {
  return values.reduce((acc, value) => gcd(acc, value), 0) || 1;
}

export function simplifyRatio(values: readonly number[]) {
  const divisor = gcdMany(values);
  return values.map((value) => Math.round(value / divisor));
}

export function formatRatio(values: readonly number[]) {
  return simplifyRatio(values).join(":");
}

export function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10000) / 10000).replace(/\.?0+$/, "");
}

export function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function stableBucket(seed: string, size: number) {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

export function pick<T>(values: readonly T[], seed: string): T {
  return values[stableBucket(seed, values.length)]!;
}

export function alignChainRatios(
  ratioA: readonly [number, number],
  ratioB: readonly [number, number],
): [number, number, number] {
  const common = lcm(ratioA[1], ratioB[0]);
  return simplifyRatio([
    ratioA[0] * (common / ratioA[1]),
    common,
    ratioB[1] * (common / ratioB[0]),
  ]) as [number, number, number];
}

export function alignThreeChainRatios(
  ratioA: readonly [number, number],
  ratioB: readonly [number, number],
  ratioC: readonly [number, number],
): [number, number, number, number] {
  const firstThree = alignChainRatios(ratioA, ratioB);
  const common = lcm(firstThree[2], ratioC[0]);
  return simplifyRatio([
    firstThree[0] * (common / firstThree[2]),
    firstThree[1] * (common / firstThree[2]),
    common,
    ratioC[1] * (common / ratioC[0]),
  ]) as [number, number, number, number];
}

export function missingMiddleFromEndpointRatio(
  ratioA: readonly [number, number],
  ratioB: readonly [number, number],
  endpointRatio: readonly [number, number],
): number {
  const aligned = alignChainRatios(ratioA, ratioB);
  const target = simplifyRatio([aligned[0], aligned[2]]);
  const expected = simplifyRatio(endpointRatio);
  if (target[0] !== expected[0] || target[1] !== expected[1]) {
    throw new Error(`Endpoint ratio ${endpointRatio.join(":")} is inconsistent with chain ${aligned.join(":")}.`);
  }
  return aligned[1];
}

export function ratioLatex(values: readonly number[]) {
  return values.join(" : ");
}
