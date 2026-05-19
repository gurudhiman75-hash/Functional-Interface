export type SeededRandom = {
  next: () => number;
  int: (exclusiveMax: number) => number;
  pick: <T>(values: readonly T[]) => T;
};

function seedToNumber(seed: number | string): number {
  const seedText =
    typeof seed === "number"
      ? Number.isFinite(seed)
        ? String(seed)
        : "1"
      : seed;

  let hash = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function roundClean(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const factor = 10 ** decimals;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function sanitizeValue(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Cannot sanitize non-finite value: ${value}`);
  }

  return roundClean(value, 2);
}

export function safeDivide(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    throw new Error("safeDivide received a non-finite value.");
  }
  if (Math.abs(denominator) < 1e-12) {
    throw new Error("safeDivide received a zero denominator.");
  }

  return sanitizeValue(numerator / denominator);
}

export function percentageOf(base: number, percent: number): number {
  return sanitizeValue((base * percent) / 100);
}

export function applyPercentage(base: number, percentChange: number): number {
  return sanitizeValue(base * (1 + percentChange / 100));
}

export function reversePercentage(part: number, percent: number): number {
  return sanitizeValue((part * 100) / percent);
}

export function createSeededRandom(seed: number | string): SeededRandom {
  let state = seedToNumber(seed) || 1;

  const next = () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };

  const int = (exclusiveMax: number) => {
    if (!Number.isInteger(exclusiveMax) || exclusiveMax <= 0) {
      throw new Error("exclusiveMax must be a positive integer.");
    }
    return Math.floor(next() * exclusiveMax);
  };

  const pick = <T>(values: readonly T[]) => {
    if (values.length === 0) {
      throw new Error("Cannot pick from an empty list.");
    }
    return values[int(values.length)]!;
  };

  return {
    next,
    int,
    pick,
  };
}
