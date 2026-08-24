export function sriHashSeed(seed: string): number {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function sriBucket(seed: string, modulo: number): number {
  if (!Number.isInteger(modulo) || modulo <= 0) throw new Error("modulo must be a positive integer");
  return sriHashSeed(seed) % modulo;
}

export function sriPick<T>(seed: string, values: readonly T[]): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty array");
  return values[sriBucket(seed, values.length)]!;
}

export function sriInt(seed: string, min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error("Invalid deterministic integer bounds");
  return min + sriBucket(seed, max - min + 1);
}
