import { absBigInt } from "./rational";

export interface PrimeFactor {
  readonly prime: bigint;
  readonly exponent: number;
}

export function integerSqrtFloor(value: bigint): bigint {
  if (value < 0n) throw new Error("Integer square root is undefined for negative integers");
  if (value < 2n) return value;
  let low = 1n;
  let high = value / 2n + 1n;
  let best = 1n;
  while (low <= high) {
    const mid = (low + high) / 2n;
    const square = mid * mid;
    if (square === value) return mid;
    if (square < value) {
      best = mid;
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }
  }
  return best;
}

export function primeFactorisation(input: bigint): PrimeFactor[] {
  let value = absBigInt(input);
  if (value < 2n) return [];
  const result: PrimeFactor[] = [];
  let count = 0;
  while (value % 2n === 0n) {
    value /= 2n;
    count += 1;
  }
  if (count > 0) result.push({ prime: 2n, exponent: count });

  let divisor = 3n;
  while (divisor * divisor <= value) {
    count = 0;
    while (value % divisor === 0n) {
      value /= divisor;
      count += 1;
    }
    if (count > 0) result.push({ prime: divisor, exponent: count });
    divisor += 2n;
  }
  if (value > 1n) result.push({ prime: value, exponent: 1 });
  return result;
}

export function productOfFactors(factors: readonly PrimeFactor[]): bigint {
  return factors.reduce((product, factor) => product * factor.prime ** BigInt(factor.exponent), 1n);
}

export function factorisationKey(input: bigint): string {
  if (input === 0n) return "0";
  const sign = input < 0n ? "-" : "+";
  const factors = primeFactorisation(input).map(({ prime, exponent }) => `${prime}^${exponent}`).join("*");
  return `${sign}${factors || "1"}`;
}
