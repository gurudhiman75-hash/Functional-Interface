import { createRng } from "./core.ts";

export interface QuotientZeroEdgeCase {
  readonly seed: number;
  readonly dividend: number;
  readonly divisor: number;
  readonly quotient: 0;
  readonly remainder: number;
}

/**
 * Auxiliary edge proof for the existing direct division-lemma authorities.
 * It deliberately does not create a new prototype/QL direction.
 * Missing-divisor questions are excluded because N=r with q=0 does not
 * uniquely determine the divisor.
 */
export function buildQuotientZeroEdgeCase(seed: number): QuotientZeroEdgeCase {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`Invalid edge seed: ${seed}`);
  const rng = createRng(seed * 4099 + 97);
  const divisor = rng.int(3, 99);
  const dividend = rng.int(1, divisor - 1);
  return {
    seed,
    dividend,
    divisor,
    quotient: 0,
    remainder: dividend,
  };
}

export function verifyQuotientZeroEdgeCase(edge: QuotientZeroEdgeCase): boolean {
  return edge.dividend < edge.divisor &&
    edge.quotient === 0 &&
    edge.remainder === edge.dividend &&
    edge.dividend === edge.divisor * edge.quotient + edge.remainder &&
    edge.remainder >= 0 &&
    edge.remainder < edge.divisor;
}
