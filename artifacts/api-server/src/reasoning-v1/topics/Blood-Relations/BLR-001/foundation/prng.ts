function normalizeSeed(seed: number): number {
  const finite = Number.isFinite(seed) ? Math.trunc(seed) : 0;
  return finite >>> 0;
}

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = normalizeSeed(seed) || 0x6d2b79f5;
  }

  next(): number {
    let value = (this.state += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  int(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error(`maxExclusive must be a positive integer, received ${maxExclusive}.`);
    }
    return Math.floor(this.next() * maxExclusive);
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty collection.");
    return values[this.int(values.length)]!;
  }

  shuffle<T>(values: readonly T[]): T[] {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(index + 1);
      [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
    }
    return copy;
  }
}

export function stableHash(parts: readonly (string | number)[]): string {
  let hash = 2166136261;
  for (const character of parts.join("|")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
