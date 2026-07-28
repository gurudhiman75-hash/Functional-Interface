export function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pick<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error("Cannot pick from an empty collection.");
  return items[hashText(seed) % items.length]!;
}

export function rotate<T>(items: readonly T[], offset: number): T[] {
  if (items.length === 0) return [];
  const normalised = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalised), ...items.slice(0, normalised)];
}

export function deterministicIndex(seed: string, modulo: number): number {
  if (modulo <= 0) throw new Error("Modulo must be positive.");
  return hashText(seed) % modulo;
}
