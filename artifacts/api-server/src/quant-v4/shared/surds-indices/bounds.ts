import { integerSqrtFloor } from "./integer-factorisation";

export interface SquareRootBounds {
  readonly radicand: bigint;
  readonly lower: bigint;
  readonly upper: bigint;
  readonly exact: boolean;
}

export function squareRootBounds(radicand: bigint): SquareRootBounds {
  if (radicand < 0n) throw new Error("Square-root bounds require a non-negative radicand");
  const lower = integerSqrtFloor(radicand);
  const exact = lower * lower === radicand;
  return { radicand, lower, upper: exact ? lower : lower + 1n, exact };
}

export function liesStrictlyBetweenConsecutiveIntegers(radicand: bigint, lower: bigint): boolean {
  if (radicand < 0n) return false;
  return lower * lower < radicand && radicand < (lower + 1n) * (lower + 1n);
}
