export function hashKnowledgeSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function deterministicIndex(seed: string, length: number) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("deterministicIndex requires a positive length");
  }
  return hashKnowledgeSeed(seed) % length;
}

export function deterministicPick<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) {
    throw new Error("Cannot select from an empty deterministic pool");
  }
  return items[deterministicIndex(seed, items.length)]!;
}

export function deterministicShuffle<T>(items: readonly T[], seed: string): T[] {
  const output = [...items];
  let state = hashKnowledgeSeed(seed) || 1;

  for (let index = output.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [output[index], output[swapIndex]] = [
      output[swapIndex]!,
      output[index]!,
    ];
  }

  return output;
}

export function deterministicTieBreak(seed: string, key: string) {
  return hashKnowledgeSeed(`${seed}:${key}`);
}
