import { exactNthRoot } from "./perfect-power";
import { rational } from "./rational";
import { surdSum, type SurdSum } from "./surd-sum";

export interface DenestResult {
  readonly outerConstant: bigint;
  readonly innerProduct: bigint;
  readonly sign: 1 | -1;
  readonly firstRadicand: bigint;
  readonly secondRadicand: bigint;
  readonly value: SurdSum;
}

/**
 * Denest sqrt(A ± 2sqrt(B)) as sqrt(m) ± sqrt(n), where m+n=A and mn=B.
 * Returns null when the requested integer-radicand denesting does not exist.
 */
export function denestNestedSquareRoot(A: bigint, B: bigint, sign: 1 | -1 = 1): DenestResult | null {
  if (A < 0n || B < 0n) throw new Error("Nested square-root parameters must be non-negative");
  const discriminant = A * A - 4n * B;
  if (discriminant < 0n) return null;
  const root = exactNthRoot(discriminant, 2);
  if (root === null) return null;
  if ((A + root) % 2n !== 0n || (A - root) % 2n !== 0n) return null;
  const m = (A + root) / 2n;
  const n = (A - root) / 2n;
  if (m < 0n || n < 0n || m * n !== B) return null;
  if (sign === -1 && m < n) return null;
  const value = surdSum([
    { coefficient: rational(1n), radicand: m },
    { coefficient: rational(sign), radicand: n },
  ]);
  return { outerConstant: A, innerProduct: B, sign, firstRadicand: m, secondRadicand: n, value };
}

export function isDenestableNestedSquareRoot(A: bigint, B: bigint, sign: 1 | -1 = 1): boolean {
  return denestNestedSquareRoot(A, B, sign) !== null;
}
