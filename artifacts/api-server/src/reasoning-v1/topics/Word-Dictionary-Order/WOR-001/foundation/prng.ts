export function seedHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createWorRng(seed: number, salt = "WOR-001") {
  let state = seedHash(`${salt}:${seed}`) || 0x6d2b79f5;
  const next = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min: number, max: number) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick<T>(values: readonly T[]): T {
      if (!values.length) throw new Error("Cannot choose from an empty list.");
      return values[Math.floor(next() * values.length)]!;
    },
    shuffle<T>(values: readonly T[]): T[] {
      const result = [...values];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const other = Math.floor(next() * (index + 1));
        [result[index], result[other]] = [result[other]!, result[index]!];
      }
      return result;
    },
  };
}

export type WorRng = ReturnType<typeof createWorRng>;
