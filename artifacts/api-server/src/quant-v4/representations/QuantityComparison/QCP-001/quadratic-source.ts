import { formatSurd } from "../../../shared/algebra/quadratic-surd";
import { solveQuadraticEquation } from "../../../shared/algebra/quadratic";
import { rational, formatRational } from "../../../shared/algebra/rational";
import type { Qcp001QuadraticState } from "./types";
export function solveQcpQuadratic(state: Qcp001QuadraticState) {
  const result = solveQuadraticEquation({
    a: rational(BigInt(state.a)),
    b: rational(BigInt(state.b)),
    c: rational(BigInt(state.c)),
  });
  if (result.kind === "NO_REAL_ROOTS")
    throw new Error(
      "QCP-001 currently requires real rational quadratic roots.",
    );
  if (result.kind === "TWO_IRRATIONAL_ROOTS") {
    // Review V4 admits only positive roots k√d with d in {2,3,5}.
    const root = result.roots.find(
      (r) => r.p.numerator === 0n && r.q.numerator > 0n,
    );
    if (
      !state.positiveOnly ||
      state.a !== 1 ||
      state.b !== 0 ||
      state.rootIndex !== 1 ||
      !root ||
      ![2n, 3n, 5n].includes(root.d)
    )
      throw Error("Unsupported irrational source domain");
    const text = formatSurd(root),
      value =
        (Number(root.q.numerator) / Number(root.q.denominator)) *
        Math.sqrt(Number(root.d));
    return {
      value,
      selectedText: text,
      roots: result.roots.map(formatSurd),
      irrational: true,
    };
  }
  if (state.positiveOnly)
    throw Error("Positive-only extension requires an irrational root");
  const roots = result.kind === "REPEATED_ROOT" ? [result.root] : result.roots;
  roots.sort((x, y) =>
    Number(x.numerator * y.denominator - y.numerator * x.denominator),
  );
  if (state.rootIndex >= roots.length)
    throw Error("Root index outside source domain");
  return {
    value:
      Number(roots[state.rootIndex]!.numerator) /
      Number(roots[state.rootIndex]!.denominator),
    selectedText: formatRational(roots[state.rootIndex]!),
    roots: roots.map(formatRational),
    irrational: false,
  };
}
export function quadraticText(state: Qcp001QuadraticState, variable: string) {
  const lead = state.a === 1 ? "" : state.a;
  return `${lead}${variable}²${state.b === 0 ? "" : ` ${state.b < 0 ? "−" : "+"} ${Math.abs(state.b)}${variable}`} ${state.c < 0 ? "−" : "+"} ${Math.abs(state.c)} = 0`;
}

export function quadraticWorking(
  state: Qcp001QuadraticState,
  variable: string,
): string {
  const result = solveQcpQuadratic(state);
  if (result.irrational)
    return `${quadraticText(state, variable)} ⇒ ${variable}² = ${-state.c}; ${variable} > 0 ⇒ ${variable} = ${result.selectedText}`;
  const factors = result.roots.map((root) => `(${variable} − (${root}))`);
  const product = factors.length === 1 ? `${factors[0]}²` : factors.join("");
  return `${quadraticText(state, variable)} ⇒ ${state.a === 1 ? "" : state.a}${product} = 0 ⇒ ${variable} ∈ {${result.roots.join(", ")}}`;
}

export function quadraticOperandPrompt(
  operand: import("./types").Qcp001Operand,
  language: import("./types").Qcp001Language,
): string {
  const variable = operand.label === "Quantity I" ? "x" : "y";
  const states = operand.states.filter(
    (s): s is Qcp001QuadraticState => s.kind === "ALGEBRA",
  );
  const equations = [...new Set(states.map((s) => quadraticText(s, variable)))];
  const where =
      language === "hi" ? "जहाँ" : language === "pa" ? "ਜਿੱਥੇ" : "where",
    or = language === "hi" ? " या " : language === "pa" ? " ਜਾਂ " : " or ";
  return `${variable}${states[0]?.positiveOnly ? " > 0" : ""}, ${where} ${equations.join(or)}`;
}
