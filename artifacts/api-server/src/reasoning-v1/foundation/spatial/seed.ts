export function hashSpatialSeed(seed: string): number {
  let hash = 0x811c9dc5;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

export class SpatialSeededRandom {
  private state: number;

  constructor(seed: string | number) {
    const initial =
      typeof seed === "number" ? seed >>> 0 : hashSpatialSeed(seed);
    this.state = initial === 0 ? 0x6d2b79f5 : initial;
  }

  nextUint32(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  nextFloat(): number {
    return this.nextUint32() / 0x1_0000_0000;
  }

  int(minInclusive: number, maxInclusive: number): number {
    if (
      !Number.isInteger(minInclusive) ||
      !Number.isInteger(maxInclusive) ||
      minInclusive > maxInclusive
    ) {
      throw new Error("Spatial seeded integer bounds must be ordered integers.");
    }

    const width = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(this.nextFloat() * width);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot choose from an empty spatial seed pool.");
    }

    return items[this.int(0, items.length - 1)] as T;
  }

  shuffle<T>(items: readonly T[]): T[] {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex] as T,
        shuffled[index] as T,
      ];
    }

    return shuffled;
  }
}

/**
 * Convenience adapter for synthesis/search code. It delegates all entropy to
 * SpatialSeededRandom so the project continues to have one deterministic RNG
 * authority while exposing max-exclusive integer and sampling helpers.
 */
export class DeterministicSpatialRng {
  private readonly random: SpatialSeededRandom;

  constructor(seed: string | number) {
    this.random = new SpatialSeededRandom(seed);
  }

  next(): number {
    return this.random.nextFloat();
  }

  int(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("Spatial synthesis maxExclusive must be a positive integer.");
    }
    return this.random.int(0, maxExclusive - 1);
  }

  bool(): boolean {
    return this.int(2) === 1;
  }

  pick<T>(items: readonly T[]): T {
    return this.random.pick(items);
  }

  shuffle<T>(items: readonly T[]): T[] {
    return this.random.shuffle(items);
  }

  sampleWithoutReplacement<T>(items: readonly T[], count: number): T[] {
    if (!Number.isInteger(count) || count < 0 || count > items.length) {
      throw new Error("Spatial synthesis sample count must be between zero and the pool size.");
    }
    return this.random.shuffle(items).slice(0, count);
  }
}
