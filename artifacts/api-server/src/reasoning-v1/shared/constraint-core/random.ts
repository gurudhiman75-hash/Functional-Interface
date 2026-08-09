function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export class DeterministicRandom {
  private state: number;

  constructor(seed: string) {
    this.state = hashSeed(seed) || 0x6d2b79f5;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state / 0x1_0000_0000;
  }

  integer(minInclusive: number, maxInclusive: number): number {
    if (!Number.isInteger(minInclusive) || !Number.isInteger(maxInclusive) || minInclusive > maxInclusive) {
      throw new Error(`Invalid integer range: ${minInclusive}..${maxInclusive}`);
    }
    return minInclusive + Math.floor(this.next() * (maxInclusive - minInclusive + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty collection");
    return values[this.integer(0, values.length - 1)] as T;
  }

  shuffle<T>(values: readonly T[]): T[] {
    const output = [...values];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = this.integer(0, index);
      [output[index], output[swapIndex]] = [output[swapIndex] as T, output[index] as T];
    }
    return output;
  }
}

export function stableHash(value: unknown): string {
  const serialised = JSON.stringify(value, Object.keys(value as object).sort());
  return hashSeed(serialised).toString(16).padStart(8, "0");
}
