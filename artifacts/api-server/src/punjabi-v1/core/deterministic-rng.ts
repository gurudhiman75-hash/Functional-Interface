function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  return h;
}

export interface PRNG {
  readonly seed: number;
  next(): number;
  nextInt(min: number, max: number): number;
  pickOne<T>(items: readonly T[]): T;
  pickDistinct<T>(items: readonly T[], n: number): T[];
  shuffle<T>(items: readonly T[]): T[];
}

export function createRng(initialSeed: number | string): PRNG {
  const seed = typeof initialSeed === "number" ? initialSeed >>> 0 : hashSeed(String(initialSeed));
  let state = seed;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1) >>> 0;
    z ^= (z + Math.imul(z ^ (z >>> 7), z | 61)) >>> 0;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
  const nextInt = (min: number, max: number) => {
    if (min > max) throw new Error(`min (${min}) cannot exceed max (${max})`);
    return Math.floor(next() * (max - min + 1)) + min;
  };
  const pickOne = <T>(items: readonly T[]): T => {
    if (!items.length) throw new Error("Cannot pick from empty array");
    return items[nextInt(0, items.length - 1)]!;
  };
  const shuffle = <T>(items: readonly T[]): T[] => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  };
  const pickDistinct = <T>(items: readonly T[], n: number): T[] => {
    if (n > items.length) throw new Error(`Cannot pick ${n} from ${items.length}`);
    return shuffle(items).slice(0, n);
  };
  return { seed, next, nextInt, pickOne, pickDistinct, shuffle };
}
