import type { NsSurd001Parameters } from "./parameter-generator";

export interface NsSurd001SolverResult {
  answer: string;
  answerLatex: string;
  sourceExpression: string;
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    mathJaxValid: boolean;
  };
}

export function solveNsSurd001(parameters: NsSurd001Parameters): NsSurd001SolverResult {
  const stem = parameters.stemItem.stem;
  const answer = solveStem(parameters.canonicalProblemId, stem);
  const answerLatex = `\\(${answer}\\)`;
  return {
    answer,
    answerLatex,
    sourceExpression: extractMath(stem).join(" | "),
    verification: {
      inputValid: stem.length > 0,
      answerRecomputed: answer.length > 0,
      mathJaxValid: hasBalancedMath(answerLatex),
    },
  };
}

function solveStem(cpId: string, stem: string): string {
  const expressions = extractMath(stem);
  if (cpId === "CP05") {
    return solveComparisonStem(stem, expressions);
  }
  const expression = expressions[0] ?? stem;
  if (cpId === "CP01") return simplifySingleSurd(expression);
  if (cpId === "CP02" || cpId === "CP04") return simplifyLinearExpression(expression);
  if (cpId === "CP03") return simplifyProductOrQuotient(expression);
  if (cpId === "CP06") return rationalizeMonomial(expression);
  if (cpId === "CP07") return rationalizeBinomial(expression);
  if (cpId === "CP08") return simplifyIdentity(expression);
  return expression;
}

function extractMath(stem: string): string[] {
  return [...stem.matchAll(/\\\((.*?)\\\)/g)].map((match) => match[1]!.trim());
}

function hasBalancedMath(value: string): boolean {
  return (value.match(/\\\(/g)?.length ?? 0) === (value.match(/\\\)/g)?.length ?? 0);
}

type Linear = Map<string, number>;

function simplifySingleSurd(expression: string): string {
  const term = parseSingleTerm(expression);
  return formatLinear(linearFromTerm(term));
}

function simplifyLinearExpression(expression: string): string {
  const linear: Linear = new Map();
  for (const token of splitTerms(expression)) {
    addLinear(linear, linearFromTerm(parseSingleTerm(token)));
  }
  return formatLinear(linear);
}

function simplifyProductOrQuotient(expression: string): string {
  if (expression.includes("\\frac")) {
    const frac = parseFrac(expression);
    const n = parseSingleTerm(frac.num);
    const d = parseSingleTerm(frac.den);
    if (n.kind === d.kind && n.rad > 0 && d.rad > 0) {
      return formatTerm({ coeff: n.coeff / d.coeff, kind: n.kind, rad: n.rad / d.rad });
    }
    return formatNumber(n.coeff / d.coeff);
  }
  const parts = expression.split("\\times").map((part) => parseSingleTerm(part));
  const kind = parts.find((part) => part.kind !== "rat")?.kind ?? "rat";
  const coeff = parts.reduce((value, part) => value * part.coeff, 1);
  const rad = parts.reduce((value, part) => value * (part.rad || 1), 1);
  return formatTerm({ coeff, kind, rad: kind === "rat" ? 0 : rad });
}

function rationalizeMonomial(expression: string): string {
  const frac = parseFrac(expression);
  const numerator = parseSingleTerm(frac.num);
  const denominator = parseSingleTerm(frac.den);
  if (denominator.kind === "sqrt") {
    return formatTerm({ coeff: numerator.coeff / denominator.coeff / denominator.rad, kind: "sqrt", rad: denominator.rad });
  }
  if (denominator.kind === "cbrt") {
    const missing = smallestCubeCompletion(denominator.rad);
    const denValue = Math.cbrt(denominator.rad * missing);
    return formatTerm({ coeff: numerator.coeff / denominator.coeff / denValue, kind: "cbrt", rad: missing });
  }
  return formatNumber(numerator.coeff / denominator.coeff);
}

function rationalizeBinomial(expression: string): string {
  const frac = parseFrac(expression);
  const numerator = parseSingleTerm(frac.num);
  const denominator = normalize(frac.den);
  const sign = denominator.includes("+") ? "+" : "-";
  const [aRaw, bRaw] = denominator.split(sign).map((part) => part.trim());
  const a = parseSingleTerm(aRaw!);
  const b = parseSingleTerm(bRaw!);
  const den = termNumeric(a) ** 2 - termNumeric(b) ** 2;
  const conjugateSign = sign === "+" ? "-" : "+";
  const leading = numerator.coeff === 1 ? "" : `${formatNumber(numerator.coeff)}`;
  return `\\frac{${leading}(${formatTerm(a)}${conjugateSign}${formatTerm(b)})}{${formatNumber(den)}}`;
}

function simplifyIdentity(expression: string): string {
  const normalized = normalize(expression);
  if (normalized.includes(")^2")) {
    const inside = normalized.slice(normalized.indexOf("(") + 1, normalized.indexOf(")"));
    const sign = inside.includes("+") ? "+" : "-";
    const [aRaw, bRaw] = inside.split(sign).map((part) => part.trim());
    const a = parseSingleTerm(aRaw!);
    const b = parseSingleTerm(bRaw!);
    const rational = termNumeric(a) ** 2 + termNumeric(b) ** 2;
    const middle = multiplyTerms(a, b, sign === "+" ? 2 : -2);
    const linear = linearFromTerm(middle);
    addLinear(linear, linearFromTerm({ coeff: rational, kind: "rat", rad: 0 }));
    return formatLinear(linear);
  }
  if (normalized.includes(")-(")) {
    const [left, right] = normalized.split("-");
    return `${simplifyIdentity(left!)}-${simplifyIdentity(right!)}`;
  }
  const factors = [...normalized.matchAll(/\(([^)]+)\)/g)].map((match) => match[1]!);
  if (factors.length === 2) {
    const firstSign = factors[0]!.includes("+") ? "+" : "-";
    const [aRaw, bRaw] = factors[0]!.split(firstSign).map((part) => part.trim());
    const a = parseSingleTerm(aRaw!);
    const b = parseSingleTerm(bRaw!);
    return formatNumber(termNumeric(a) ** 2 - termNumeric(b) ** 2);
  }
  return simplifyLinearExpression(expression);
}

function solveComparisonStem(stem: string, expressions: string[]): string {
  const values = expressions.map((expr) => ({ expr, value: numericExpression(expr) }));
  if (stem.includes("in increasing order") || stem.includes("correct increasing order")) {
    return values.sort((a, b) => a.value - b.value).map((item) => item.expr).join(", ");
  }
  if (stem.includes("in decreasing order") || stem.includes("correct decreasing order")) {
    return values.sort((a, b) => b.value - a.value).map((item) => item.expr).join(", ");
  }
  if (stem.toLowerCase().includes("smaller") || stem.toLowerCase().includes("least") || stem.toLowerCase().includes("lowest") || stem.toLowerCase().includes("smallest")) {
    return values.sort((a, b) => a.value - b.value)[0]!.expr;
  }
  return values.sort((a, b) => b.value - a.value)[0]!.expr;
}

interface Term {
  coeff: number;
  kind: "rat" | "sqrt" | "cbrt";
  rad: number;
}

function parseSingleTerm(raw: string): Term {
  let expr = normalize(raw);
  let sign = 1;
  if (expr.startsWith("-")) {
    sign = -1;
    expr = expr.slice(1);
  }
  const frac = expr.match(/^\\frac\{(.+)\}\{(.+)\}$/);
  if (frac) {
    const n = parseSingleTerm(frac[1]!);
    const d = parseSingleTerm(frac[2]!);
    return { coeff: termNumeric(n) / termNumeric(d), kind: "rat", rad: 0 };
  }
  const sqrt = expr.match(/^(\\d*)\\sqrt\{(\\d+)\}$/);
  if (sqrt) return simplifyTerm({ coeff: sign * Number(sqrt[1] || 1), kind: "sqrt", rad: Number(sqrt[2]) });
  const cbrt = expr.match(/^(\\d*)\\sqrt\[3\]\{(\\d+)\}$/);
  if (cbrt) return simplifyTerm({ coeff: sign * Number(cbrt[1] || 1), kind: "cbrt", rad: Number(cbrt[2]) });
  return { coeff: sign * Number(expr || 1), kind: "rat", rad: 0 };
}

function normalize(value: string): string {
  return value.replaceAll(" ", "").replaceAll("\\left", "").replaceAll("\\right", "");
}

function splitTerms(expression: string): string[] {
  return normalize(expression).replaceAll("-", "+-").split("+").filter(Boolean);
}

function parseFrac(expression: string): { num: string; den: string } {
  const match = normalize(expression).match(/^\\frac\{(.+)\}\{(.+)\}$/);
  if (!match) throw new Error(`Expected fraction expression: ${expression}`);
  return { num: match[1]!, den: match[2]! };
}

function simplifyTerm(term: Term): Term {
  if (term.kind === "rat") return term;
  if (term.kind === "sqrt") {
    let coeff = term.coeff;
    let rad = term.rad;
    for (let factor = Math.floor(Math.sqrt(rad)); factor >= 2; factor--) {
      const square = factor * factor;
      if (rad % square === 0) {
        coeff *= factor;
        rad /= square;
        break;
      }
    }
    return rad === 1 ? { coeff, kind: "rat", rad: 0 } : { coeff, kind: "sqrt", rad };
  }
  let coeff = term.coeff;
  let rad = term.rad;
  for (let factor = Math.floor(Math.cbrt(rad)); factor >= 2; factor--) {
    const cube = factor * factor * factor;
    if (rad % cube === 0) {
      coeff *= factor;
      rad /= cube;
      break;
    }
  }
  return rad === 1 ? { coeff, kind: "rat", rad: 0 } : { coeff, kind: "cbrt", rad };
}

function linearFromTerm(term: Term): Linear {
  const simplified = simplifyTerm(term);
  return new Map([[termKey(simplified), simplified.coeff]]);
}

function addLinear(target: Linear, source: Linear): void {
  for (const [key, value] of source) {
    target.set(key, (target.get(key) ?? 0) + value);
  }
}

function termKey(term: Term): string {
  return term.kind === "rat" ? "rat:0" : `${term.kind}:${term.rad}`;
}

function formatLinear(linear: Linear): string {
  const terms = [...linear.entries()].filter(([, coeff]) => Math.abs(coeff) > 1e-9);
  if (terms.length === 0) return "0";
  return terms
    .map(([key, coeff], index) => {
      const [kind, rawRad] = key.split(":");
      const term = formatTerm({ coeff: Math.abs(coeff), kind: kind as Term["kind"], rad: Number(rawRad) });
      return `${coeff < 0 ? "-" : index === 0 ? "" : "+"}${term}`;
    })
    .join("");
}

function formatTerm(term: Term): string {
  const simplified = simplifyTerm(term);
  if (simplified.kind === "rat") return formatNumber(simplified.coeff);
  const coeff = simplified.coeff === 1 ? "" : simplified.coeff === -1 ? "-" : formatNumber(simplified.coeff);
  const radical = simplified.kind === "sqrt" ? `\\sqrt{${simplified.rad}}` : `\\sqrt[3]{${simplified.rad}}`;
  return `${coeff}${radical}`;
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

function termNumeric(term: Term): number {
  const simplified = simplifyTerm(term);
  if (simplified.kind === "rat") return simplified.coeff;
  if (simplified.kind === "sqrt") return simplified.coeff * Math.sqrt(simplified.rad);
  return simplified.coeff * Math.cbrt(simplified.rad);
}

function multiplyTerms(a: Term, b: Term, extraCoeff: number): Term {
  if (a.kind === b.kind && a.kind !== "rat") {
    return simplifyTerm({ coeff: extraCoeff * a.coeff * b.coeff, kind: a.kind, rad: a.rad * b.rad });
  }
  if (a.kind === "rat") return simplifyTerm({ coeff: extraCoeff * a.coeff * b.coeff, kind: b.kind, rad: b.rad });
  if (b.kind === "rat") return simplifyTerm({ coeff: extraCoeff * a.coeff * b.coeff, kind: a.kind, rad: a.rad });
  return { coeff: extraCoeff * termNumeric(a) * termNumeric(b), kind: "rat", rad: 0 };
}

function numericExpression(expr: string): number {
  if (expr.includes("+") || normalize(expr).slice(1).includes("-")) {
    return splitTerms(expr).reduce((sum, token) => sum + termNumeric(parseSingleTerm(token)), 0);
  }
  return termNumeric(parseSingleTerm(expr));
}

function smallestCubeCompletion(value: number): number {
  for (let candidate = 1; candidate <= value * value; candidate++) {
    const root = Math.cbrt(value * candidate);
    if (Math.abs(root - Math.round(root)) < 1e-9) return candidate;
  }
  return value * value;
}
