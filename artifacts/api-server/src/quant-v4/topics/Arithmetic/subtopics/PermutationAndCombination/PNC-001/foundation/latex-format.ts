import type { Pnc001QuestionPackage, Pnc001ValidationCheck } from "./types";

const DELIMITED_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;
const TOKEN_PATTERN = /@@PNC_LATEX_(\d+)@@/g;
const FORMULA_START = /(?:\b(?:\d+|[nrsk])(?:P|C)(?:\d+|[nrsk])\b|\b[CP]\(\s*[A-Za-z0-9]+\s*,\s*[A-Za-z0-9]+\s*\)|\b(?:\d+|n)!|\((?:n\s*[+-]\s*\d+)\)!|\b\d+\^\d+\b|\b[nrsk]\s*(?:=|≥|≤|>|<)\s*\d+\b|\b\d+\s*[×÷]\s*\d+\b|\b\d+(?:\s*[+−-]\s*\d+)+\s*=\s*\d+\b|\bn\s*\(\s*n\s*[-+]\s*\d+\s*\))/g;
const FORMULA_CHAR = /[0-9nrskPC!^×÷+−\-=≤≥<>()/,. \t]/;

function spaceLatexBraces(tex: string): string {
  let output = tex;
  for (let pass = 0; pass < 3; pass += 1) {
    output = output.replace(/\{([^{}]*)\}/g, (_match: string, inner: string) => {
      const trimmed = inner.trim();
      return trimmed ? `{ ${trimmed} }` : "{}";
    });
  }
  return output;
}

function inlineMath(tex: string): string {
  return `\\(${spaceLatexBraces(tex.trim())}\\)`;
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

function toLatexExpression(raw: string): string {
  let expression = raw.trim();

  expression = expression.replace(
    /\bC\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g,
    (_match: string, n: string, r: string) => combinationTex(n, r),
  );
  expression = expression.replace(
    /\bP\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g,
    (_match: string, n: string, r: string) => permutationTex(n, r),
  );

  expression = expression.replace(
    /\((n\s*[+-]\s*\d+)\)!\s*\/\s*n!/g,
    (_match: string, numerator: string) => `\\frac{(${numerator})!}{n!}`,
  );
  expression = expression.replace(
    /n!\s*\/\s*\((n\s*-\s*\d+)\)!/g,
    (_match: string, denominator: string) => `\\frac{n!}{(${denominator})!}`,
  );
  expression = expression.replace(
    /\b(\d+|n)!\s*(?:\/|÷)\s*\(([^)]+)\)/g,
    (_match: string, numerator: string, denominator: string) => `\\frac{${numerator}!}{${denominator}}`,
  );
  expression = expression.replace(
    /\b(\d+|n)!\s*(?:\/|÷)\s*(\d+|n)!/g,
    (_match: string, numerator: string, denominator: string) => `\\frac{${numerator}!}{${denominator}!}`,
  );

  expression = expression.replace(
    /\b(\d+|[nrs])P(\d+|[nrsk])\b/g,
    (_match: string, n: string, r: string) => permutationTex(n, r),
  );
  expression = expression.replace(
    /\b(\d+|[nrs])C(\d+|[nrsk])\b/g,
    (_match: string, n: string, r: string) => combinationTex(n, r),
  );
  expression = expression.replace(/\b(\d+)\^(\d+)\b/g, "$1^{$2}");
  expression = expression
    .replace(/\s*×\s*/g, " \\times ")
    .replace(/\s*÷\s*/g, " \\div ")
    .replace(/\s*≤\s*/g, " \\le ")
    .replace(/\s*≥\s*/g, " \\ge ")
    .replace(/−/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return expression;
}

function wrapFormulaSpans(value: string, protect: (segment: string) => string): string {
  let output = "";
  let cursor = 0;
  let searchFrom = 0;

  while (searchFrom < value.length) {
    FORMULA_START.lastIndex = searchFrom;
    const match = FORMULA_START.exec(value);
    if (!match || match.index === undefined) break;

    const start = match.index;
    let end = start + match[0].length;
    while (end < value.length && FORMULA_CHAR.test(value[end]!)) end += 1;
    while (end > start && /[\s,.]/.test(value[end - 1]!)) end -= 1;

    output += value.slice(cursor, start);
    output += protect(inlineMath(toLatexExpression(value.slice(start, end))));
    cursor = end;
    searchFrom = end;
  }

  return output + value.slice(cursor);
}

export function formatPnc001LatexText(value: string): string {
  if (!value.trim()) return value;

  const protectedSegments: string[] = [];
  const protect = (segment: string): string => {
    const index = protectedSegments.push(segment) - 1;
    return `@@PNC_LATEX_${index}@@`;
  };

  const protectedText = value.replace(DELIMITED_MATH, (match) => protect(match));
  const formatted = wrapFormulaSpans(protectedText, protect);

  return formatted.replace(TOKEN_PATTERN, (_match: string, rawIndex: string) => {
    const index = Number(rawIndex);
    return protectedSegments[index] ?? _match;
  });
}

export function hasUnformattedPncFormula(value: string): boolean {
  const plain = stripDelimitedMath(value);
  return [
    /\b(?:\d+|[nrs])P(?:\d+|[nrsk])\b/,
    /\b(?:\d+|[nrs])C(?:\d+|[nrsk])\b/,
    /\b[CP]\(\s*[A-Za-z0-9]+\s*,\s*[A-Za-z0-9]+\s*\)/,
    /\([^)]*n[^)]*\)!\s*\/\s*n!/,
    /n!\s*\/\s*\([^)]*\)!/,
    /\b\d+!\s*(?:\/|÷)\s*\d+!/,
    /\b\d+\^\d+\b/,
    /\b\d+\s*[×÷]\s*\d+/,
    /\b\d+(?:\s*[+−-]\s*\d+)+\s*=\s*\d+\b/,
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
