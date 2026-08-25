import { compareRational } from "./rational";
import { squareSquareSurd, type SquareSurd } from "./square-surd";

function signOf(value: SquareSurd): -1 | 0 | 1 {
  return value.coefficient.numerator < 0n ? -1 : value.coefficient.numerator > 0n ? 1 : 0;
}

/** Exact comparison of canonical single square-surds without decimal approximation. */
export function compareSquareSurds(a: SquareSurd, b: SquareSurd): -1 | 0 | 1 {
  const signA = signOf(a);
  const signB = signOf(b);
  if (signA !== signB) return signA < signB ? -1 : 1;
  if (signA === 0) return 0;
  const squared = compareRational(squareSquareSurd(a), squareSquareSurd(b));
  return signA > 0 ? squared : squared === 0 ? 0 : squared === 1 ? -1 : 1;
}

export function maxSquareSurd(values: readonly SquareSurd[]): SquareSurd {
  if (values.length === 0) throw new Error("Cannot select maximum of an empty set");
  return values.reduce((best, value) => compareSquareSurds(value, best) > 0 ? value : best);
}

export function minSquareSurd(values: readonly SquareSurd[]): SquareSurd {
  if (values.length === 0) throw new Error("Cannot select minimum of an empty set");
  return values.reduce((best, value) => compareSquareSurds(value, best) < 0 ? value : best);
}
