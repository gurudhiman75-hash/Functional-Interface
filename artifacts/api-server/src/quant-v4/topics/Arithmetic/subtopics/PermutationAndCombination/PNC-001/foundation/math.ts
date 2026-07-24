const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

export function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer; received ${value}`);
}

export function toSafeCount(value: bigint, label = "count", ceiling = Number.MAX_SAFE_INTEGER): number {
  if (value < 0n) throw new Error(`${label} must not be negative`);
  if (value > MAX_SAFE_BIGINT) throw new Error(`${label} exceeds Number.MAX_SAFE_INTEGER`);
  const numeric = Number(value);
  if (numeric > ceiling) throw new Error(`${label} exceeds configured ceiling ${ceiling}`);
  return numeric;
}

export function productExact(values: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  if (values.length === 0) return 1;
  let result = 1n;
  for (const [index, value] of values.entries()) {
    assertNonNegativeInteger(value, `factor[${index}]`);
    result *= BigInt(value);
  }
  return toSafeCount(result, "product", ceiling);
}

export function sumExact(values: number[], ceiling = Number.MAX_SAFE_INTEGER): number {
  let result = 0n;
  for (const [index, value] of values.entries()) {
    assertNonNegativeInteger(value, `term[${index}]`);
    result += BigInt(value);
  }
  return toSafeCount(result, "sum", ceiling);
}

export function subtractExact(total: number, invalid: number): number {
  assertNonNegativeInteger(total, "total");
  assertNonNegativeInteger(invalid, "invalid");
  if (invalid > total) throw new Error(`invalid count ${invalid} exceeds total ${total}`);
  return total - invalid;
}

export function divideExact(total: number, divisor: number): number {
  assertNonNegativeInteger(total, "total");
  assertNonNegativeInteger(divisor, "divisor");
  if (divisor === 0) throw new Error("divisor must be positive");
  if (total % divisor !== 0) throw new Error(`${total} is not exactly divisible by ${divisor}`);
  return total / divisor;
}

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: string): () => number {
  let state = hashSeed(seed) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickSeeded<T>(values: readonly T[], random: () => number): T {
  if (values.length === 0) throw new Error("Cannot select from an empty collection");
  return values[Math.floor(random() * values.length)]!;
}

export function shuffleSeeded<T>(values: readonly T[], random: () => number): T[] {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target]!, output[index]!];
  }
  return output;
}
