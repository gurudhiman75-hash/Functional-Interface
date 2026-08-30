export interface Prt001Random {
  next(): number;
  pick<T>(values: readonly T[]): T;
  shuffle<T>(values: readonly T[]): T[];
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createPrt001Random(seed: string): Prt001Random {
  let state = hashSeed(seed);
  const next = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    pick<T>(values: readonly T[]): T {
      if (values.length === 0)
        throw new Error("cannot pick from an empty pool");
      return values[Math.floor(next() * values.length)]!;
    },
    shuffle<T>(values: readonly T[]): T[] {
      const result = [...values];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(next() * (index + 1));
        [result[index], result[swapIndex]] = [
          result[swapIndex]!,
          result[index]!,
        ];
      }
      return result;
    },
  };
}
