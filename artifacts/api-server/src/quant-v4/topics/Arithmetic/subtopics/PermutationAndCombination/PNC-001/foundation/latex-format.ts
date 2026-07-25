import type { Pnc001QuestionPackage, Pnc001ValidationCheck } from "./types";

const DELIMITED_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;
const TOKEN_PATTERN = /@@PNC_LATEX_(\d+)@@/g;

function spaceLatexBraces(tex: string): string {
  return tex.replace(/\{([^{}]*)\}/g, (_match: string, inner: string) => {
    const trimmed = inner.trim();
    return trimmed ? `{ ${trimmed} }` : "{}";
  });
}

function inlineMath(tex: string): string {
  return `\\(${spaceLatexBraces(tex.trim())}\\)`;
}

function texOperators(value: string): string {
  return value
    .replace(/\s*×\s*/g, " \\times ")
    .replace(/\s*÷\s*/g, " \\div ")
    .replace(/−/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function delimiterCount(value: string, delimiter: string): number {
  return value.split(delimiter).length - 1;
}

function stripDelimitedMath(value: string): string {
  return value.replace(DELIMITED_MATH, " ");
}

function permutationTex(n: string, r: string): string {
  return `{}^{${n}}P_{${r}}`;
}

function combinationTex(n: string, r: string): string {
  return `\\binom{${n}}{${r}}`;
}

function relationTex(operator: string): string {
  if (operator === "≥") return "\\ge";
  if (operator === "≤") return "\\le";
  return operator;
}

export function formatPnc001LatexText(value: string): string {
  if (!value.trim()) return value;

  const protectedSegments: string[] = [];
  const protect = (segment: string): string => {
    const index = protectedSegments.push(segment) - 1;
    return `@@PNC_LATEX_${index}@@`;
  };
  const wrap = (tex: string): string => protect(inlineMath(tex));

  let output = value.replace(DELIMITED_MATH, (match) => protect(match));

  output = output.replace(
    /\b(\d+|[nrs])C(\d+|[nrsk])\s*×\s*(\d+|[nrs])P(\d+|[nrsk])(?:\s*=\s*(\d+)(?!\s*[×÷+−\-!CP]))?/g,
    (_match: string, n: string, s: string, selected: string, roles: string, answer?: string) =>
      wrap(`${combinationTex(n, s)} \\times ${permutationTex(selected, roles)}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\b(\d+|[nrs])C(\d+|[nrsk])\s*=\s*(\d+|[nrs])C(\d+|[nrsk])/g,
    (_match: string, firstN: string, firstR: string, secondN: string, secondR: string) =>
      wrap(`${combinationTex(firstN, firstR)} = ${combinationTex(secondN, secondR)}`),
  );
  output = output.replace(
    /\b(\d+|[nrs])P(\d+|[nrsk])(?:\s*=\s*(\d+)(?!\s*[×÷+−\-!CP]))?/g,
    (_match: string, n: string, r: string, answer?: string) =>
      wrap(`${permutationTex(n, r)}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\b(\d+|[nrs])C(\d+|[nrsk])(?:\s*=\s*(\d+)(?!\s*[×÷+−\-!CP]))?/g,
    (_match: string, n: string, r: string, answer?: string) =>
      wrap(`${combinationTex(n, r)}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\bC\(\s*([A-Za-z])\s*,\s*([A-Za-z])\s*\)/g,
    (_match: string, n: string, r: string) => wrap(combinationTex(n, r)),
  );
  output = output.replace(
    /\bP\(\s*([A-Za-z])\s*,\s*([A-Za-z])\s*\)/g,
    (_match: string, n: string, r: string) => wrap(permutationTex(n, r)),
  );

  output = output.replace(
    /\((n\s*[+-]\s*\d+)\)!\s*\/\s*n!/g,
    (_match: string, numerator: string) => wrap(`\\frac{(${texOperators(numerator)})!}{n!}`),
  );
  output = output.replace(
    /n!\s*\/\s*\((n\s*-\s*\d+)\)!/g,
    (_match: string, denominator: string) => wrap(`\\frac{n!}{(${texOperators(denominator)})!}`),
  );
  output = output.replace(
    /(\d+!(?:\s*[×÷+−-]\s*\d+!)+)(?:\s*=\s*(\d+))?/g,
    (_match: string, expression: string, answer?: string) =>
      wrap(`${texOperators(expression)}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\(?(\d+)!\)?\s*(?:\/|÷)\s*\(?(\d+)!\)?(?:\s*=\s*(\d+))?/g,
    (_match: string, numerator: string, denominator: string, answer?: string) =>
      wrap(`\\frac{${numerator}!}{${denominator}!}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\((n\s*[+-]\s*\d+)\)!/g,
    (_match: string, expression: string) => wrap(`(${texOperators(expression)})!`),
  );

  output = output.replace(
    /\b(\d+)\^(\d+)\s*×\s*(\d+)\^(\d+)(?:\s*=\s*(\d+))?/g,
    (_match: string, firstBase: string, firstExponent: string, secondBase: string, secondExponent: string, answer?: string) =>
      wrap(`${firstBase}^{${firstExponent}} \\times ${secondBase}^{${secondExponent}}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\b(\d+)\^(\d+)(?:\s*=\s*(\d+))?/g,
    (_match: string, base: string, exponent: string, answer?: string) =>
      wrap(`${base}^{${exponent}}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\((\d+\s*×\s*\d+)\)\s*\+\s*\((\d+\s*×\s*\d+)\)(?:\s*=\s*(\d+))?/g,
    (_match: string, first: string, second: string, answer?: string) =>
      wrap(`(${texOperators(first)}) + (${texOperators(second)})${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\b(\d+(?:\s*[×÷+−-]\s*\d+){1,})(?:\s*=\s*(\d+))?/g,
    (_match: string, expression: string, answer?: string) =>
      wrap(`${texOperators(expression)}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(
    /\b(\d+!)(?:\s*=\s*(\d+))?/g,
    (_match: string, factorial: string, answer?: string) =>
      wrap(`${factorial}${answer ? ` = ${answer}` : ""}`),
  );
  output = output.replace(/\bn!/g, () => wrap("n!"));

  output = output.replace(
    /\b(\d+)\s*≤\s*([nrsk])\s*≤\s*(\d+)\b/g,
    (_match: string, minimum: string, symbol: string, maximum: string) =>
      wrap(`${minimum} \\le ${symbol} \\le ${maximum}`),
  );
  output = output.replace(
    /\b([nrsk])\s*(≥|≤|>|<)\s*(\d+)\b/g,
    (_match: string, symbol: string, operator: string, number: string) =>
      wrap(`${symbol} ${relationTex(operator)} ${number}`),
  );
  output = output.replace(
    /\b([nrsk])\s*=\s*(\d+)\b/g,
    (_match: string, symbol: string, number: string) => wrap(`${symbol} = ${number}`),
  );

  return output.replace(TOKEN_PATTERN, (_match: string, rawIndex: string) => {
    const index = Number(rawIndex);
    return protectedSegments[index] ?? _match;
  });
}

export function hasUnformattedPncFormula(value: string): boolean {
  const plain = stripDelimitedMath(value);
  return [
    /\b(?:\d+|[nrs])P(?:\d+|[nrsk])\b/,
    /\b(?:\d+|[nrs])C(?:\d+|[nrsk])\b/,
    /\b[CP]\(\s*[A-Za-z]\s*,\s*[A-Za-z]\s*\)/,
    /\([^)]*n[^)]*\)!\s*\/\s*n!/,
    /n!\s*\/\s*\([^)]*\)!/,
    /\b\d+!\s*(?:\/|÷)\s*\d+!/,
    /\b\d+\^\d+\b/,
    /\b\d+\s*[×÷]\s*\d+/,
    /\b[nrsk]\s*(?:=|≥|≤|>|<)\s*\d+\b/,
  ].some((pattern) => pattern.test(plain));
}

export function validatePnc001LatexContract(pkg: Pnc001QuestionPackage): Pnc001ValidationCheck[] {
  const visibleText = [
    pkg.stem,
    ...pkg.options,
    ...pkg.explanation.lines,
    ...pkg.reasoningEvidence.equations,
    pkg.reasoningEvidence.decisiveCalculation,
    pkg.reasoningEvidence.verification,
  ];
  const rawFormulaFields = visibleText.filter(hasUnformattedPncFormula);
  const balanced = visibleText.every((text) =>
    delimiterCount(text, "\\(") === delimiterCount(text, "\\)")
    && delimiterCount(text, "\\[") === delimiterCount(text, "\\]"),
  );
  const solverTexReady = Boolean(pkg.solver.mathJax.trim())
    && !/\$|\\\(|\\\)|\\\[|\\\]/.test(pkg.solver.mathJax);

  return [
    {
      name: "latex-no-raw-formulas",
      passed: rawFormulaFields.length === 0,
      message: rawFormulaFields.length === 0
        ? "All user-facing PNC formulas use MathJax delimiters"
        : `${rawFormulaFields.length} user-facing field(s) still contain raw ASCII formulas`,
    },
    {
      name: "latex-balanced-delimiters",
      passed: balanced,
      message: balanced ? "All generated LaTeX delimiters are balanced" : "Unbalanced LaTeX delimiters detected",
    },
    {
      name: "latex-solver-source",
      passed: solverTexReady,
      message: solverTexReady ? "Solver exposes delimiter-free TeX authority" : "Solver MathJax authority is missing or already delimited",
    },
  ];
}
