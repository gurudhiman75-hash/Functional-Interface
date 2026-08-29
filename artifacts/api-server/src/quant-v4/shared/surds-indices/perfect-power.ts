import { primeFactorisation } from "./integer-factorisation";

export interface PerfectPowerDecomposition {
  readonly index: number;
  readonly outside: bigint;
  readonly residual: bigint;
}

function requireIndex(index: number): void {
  if (!Number.isInteger(index) || index < 2) throw new Error("Root index must be an integer >= 2");
}

export function exactNthRoot(value: bigint, index: number): bigint | null {
  requireIndex(index);
  if (value < 0n) {
    if (index % 2 === 0) return null;
    const positive = exactNthRoot(-value, index);
    return positive === null ? null : -positive;
  }
  if (value < 2n) return value;
  let low = 1n;
  let high = value;
  while (low <= high) {
    const mid = (low + high) / 2n;
    const power = mid ** BigInt(index);
    if (power === value) return mid;
    if (power < value) low = mid + 1n;
    else high = mid - 1n;
  }
  return null;
}

export function isPerfectPower(value: bigint, index: number): boolean {
  return exactNthRoot(value, index) !== null;
}

export function extractPerfectPower(value: bigint, index: number): PerfectPowerDecomposition {
  requireIndex(index);
  if (value === 0n) return { index, outside: 0n, residual: 1n };
  if (value < 0n && index % 2 === 0) throw new Error("Even root of a negative integer is not real");

  const negative = value < 0n;
  const absolute = negative ? -value : value;
  let outside = 1n;
  let residual = 1n;
  for (const { prime, exponent } of primeFactorisation(absolute)) {
    const quotient = Math.floor(exponent / index);
    const remainder = exponent % index;
    if (quotient > 0) outside *= prime ** BigInt(quotient);
    if (remainder > 0) residual *= prime ** BigInt(remainder);
  }
  if (negative) outside = -outside;
  return { index, outside, residual };
}

export function isIndexFree(value: bigint, index: number): boolean {
  requireIndex(index);
  const absolute = value < 0n ? -value : value;
  return primeFactorisation(absolute).every(({ exponent }) => exponent < index);
}
