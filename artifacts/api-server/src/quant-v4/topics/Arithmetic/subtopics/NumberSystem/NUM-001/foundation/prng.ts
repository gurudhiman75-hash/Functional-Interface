export interface DeterministicRandom {
  nextUint32(): number;
  int(minimum: number, maximum: number): number;
  bool(probability?: number): boolean;
  pick<T>(values: readonly T[]): T;
  shuffle<T>(values: readonly T[]): T[];
}

function hashSeed(seed: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash === 0 ? 0x9e3779b9 : hash;
}

export function createRandom(seed: string): DeterministicRandom {
  let state = hashSeed(seed);
  const nextUint32 = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };

  return {
    nextUint32,
    int(minimum, maximum) {
      if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) {
        throw new Error(`Invalid integer range ${minimum}..${maximum}`);
      }
      return minimum + (nextUint32() % (maximum - minimum + 1));
    },
    bool(probability = 0.5) {
      if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
        throw new Error(`Invalid Boolean probability ${probability}`);
      }
      return nextUint32() / 0x1_0000_0000 < probability;
    },
    pick<T>(values: readonly T[]): T {
      if (values.length === 0) throw new Error("Cannot pick from an empty collection");
      return values[nextUint32() % values.length] as T;
    },
    shuffle<T>(values: readonly T[]): T[] {
      const result = [...values];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = nextUint32() % (index + 1);
        [result[index], result[swapIndex]] = [result[swapIndex] as T, result[index] as T];
      }
      return result;
    },
  };
}
