/**
 * Deterministic Pseudo-Random Number Generator (PRNG) based on Mulberry32
 * with MurmurHash3 seed hashing. Guarantees 100% reproducible sequences
 * across all platforms.
 */

function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return h;
}

export interface PRNG {
  readonly seed: number;
  /** Returns pseudo-random float in [0, 1) */
  next(): number;
  /** Returns pseudo-random integer in [min, max] inclusive */
  nextInt(min: number, max: number): number;
  /** Picks a single element from an array */
  pickOne<T>(items: readonly T[]): T;
  /** Picks N distinct elements from an array without replacement */
  pickDistinct<T>(items: readonly T[], n: number): T[];
  /** Returns a new array with elements shuffled using Fisher-Yates */
  shuffle<T>(items: readonly T[]): T[];
}

export function createRng(initialSeed: number | string): PRNG {
  const seedNum =
    typeof initialSeed === "number"
      ? (initialSeed >>> 0)
      : hashSeed(String(initialSeed));

  let state = seedNum;

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1) >>> 0;
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61) >>> 0;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    if (min > max) {
      throw new Error(`min (${min}) cannot be greater than max (${max})`);
    }
    const r = next();
    return Math.floor(r * (max - min + 1)) + min;
  }

  function pickOne<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty array");
    }
    const idx = nextInt(0, items.length - 1);
    return items[idx]!;
  }

  function shuffle<T>(items: readonly T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      const temp = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = temp;
    }
    return arr;
  }

  function pickDistinct<T>(items: readonly T[], n: number): T[] {
    if (n > items.length) {
      throw new Error(`Cannot pick ${n} distinct items from array of length ${items.length}`);
    }
    const shuffled = shuffle(items);
    return shuffled.slice(0, n);
  }

  return {
    seed: seedNum,
    next,
    nextInt,
    pickOne,
    pickDistinct,
    shuffle,
  };
}
