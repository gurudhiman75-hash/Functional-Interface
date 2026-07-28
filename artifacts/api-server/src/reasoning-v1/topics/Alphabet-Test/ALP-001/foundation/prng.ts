export function hashSeed(value: string | number): number {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRng(seed: string | number): () => number {
  let state = (hashSeed(seed) ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: readonly T[], seed: string | number): T {
  if (items.length === 0) throw new Error("Cannot choose from an empty list.");
  const random = createRng(seed);
  return items[Math.floor(random() * items.length)]!;
}

export function intBetween(min: number, max: number, seed: string | number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
    throw new Error(`Invalid integer range: ${min}..${max}`);
  }
  return min + Math.floor(createRng(seed)() * (max - min + 1));
}

export function shuffle<T>(items: readonly T[], seed: string | number): T[] {
  const result = [...items];
  const random = createRng(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target]!, result[index]!];
  }
  return result;
}
