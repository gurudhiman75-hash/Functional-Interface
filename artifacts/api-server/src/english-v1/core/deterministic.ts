function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function deterministicIndex(seed: string, length: number): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error(`deterministicIndex requires a positive length, received ${length}`);
  }
  return hashSeed(seed) % length;
}

export function deterministicPick<T>(seed: string, values: readonly T[]): T {
  return values[deterministicIndex(seed, values.length)]!;
}

export function deterministicBoolean(seed: string, trueWeight = 0.5): boolean {
  if (trueWeight < 0 || trueWeight > 1) {
    throw new Error("trueWeight must be between 0 and 1");
  }
  return (hashSeed(seed) % 10_000) / 10_000 < trueWeight;
}
