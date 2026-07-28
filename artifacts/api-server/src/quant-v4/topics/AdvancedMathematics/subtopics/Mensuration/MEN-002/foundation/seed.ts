export interface SeededRandom {
  next(): number;
  int(minimum: number, maximum: number): number;
  pick<T>(values: readonly T[]): T;
  shuffle<T>(values: readonly T[]): T[];
}

function hashSeed(seed: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash === 0 ? 0x9e3779b9 : hash;
}

export function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(seed);
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x1_0000_0000;
  };
  return {
    next,
    int(minimum, maximum) {
      if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) {
        throw new Error("Invalid deterministic integer range.");
      }
      return minimum + Math.floor(next() * (maximum - minimum + 1));
    },
    pick<T>(values: readonly T[]) {
      if (values.length === 0) throw new Error("Cannot pick from an empty list.");
      return values[Math.floor(next() * values.length)]!;
    },
    shuffle<T>(values: readonly T[]) {
      const copy = [...values];
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(next() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
      }
      return copy;
    },
  };
}
