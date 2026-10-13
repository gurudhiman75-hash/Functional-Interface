import { solveQuadraticEquation } from "../../../shared/algebra/quadratic";
import { rational, formatRational } from "../../../shared/algebra/rational";
import type { Qcp001QuadraticState } from "./types";
export function solveQcpQuadratic(state: Qcp001QuadraticState) {
  const result = solveQuadraticEquation({
    a: rational(BigInt(state.a)),
    b: rational(BigInt(state.b)),
    c: rational(BigInt(state.c)),
  });
  if (result.kind === "NO_REAL_ROOTS" || result.kind === "TWO_IRRATIONAL_ROOTS")
    throw new Error(
      "QCP-001 currently requires real rational quadratic roots.",
    );
  const roots = result.kind === "REPEATED_ROOT" ? [result.root] : result.roots;
  roots.sort((x, y) =>
    Number(x.numerator * y.denominator - y.numerator * x.denominator),
  );
  if (state.rootIndex >= roots.length)
    throw new Error("QCP-001 root index outside source domain.");
  return {
    value:
      Number(roots[state.rootIndex]!.numerator) /
      Number(roots[state.rootIndex]!.denominator),
    roots: roots.map(formatRational),
  };
}
export function quadraticText(state: Qcp001QuadraticState, variable: string) {
  const lead = state.a === 1 ? "" : state.a;
  return `${lead}${variable}² ${state.b < 0 ? "−" : "+"} ${Math.abs(state.b)}${variable} ${state.c < 0 ? "−" : "+"} ${Math.abs(state.c)} = 0`;
}

export function quadraticWorking(
  state: Qcp001QuadraticState,
  variable: string,
): string {
  const result = solveQcpQuadratic(state);
  const factors = result.roots.map((root) => `(${variable} − (${root}))`);
  const product = factors.length === 1 ? `${factors[0]}²` : factors.join("");
  return `${quadraticText(state, variable)} ⇒ ${state.a === 1 ? "" : state.a}${product} = 0 ⇒ ${variable} ∈ {${result.roots.join(", ")}}`;
}
