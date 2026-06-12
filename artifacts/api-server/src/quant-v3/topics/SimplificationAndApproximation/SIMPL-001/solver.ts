import type { Simpl001Parameters } from "./parameter-generator";

export interface Simpl001SolverResult {
  expression: string;
  numericValue: number;
  answer: string;
  answerLatex: string;
  mathJaxObjects: Record<string, string>;
}

export function solveSimpl001(parameters: Simpl001Parameters): Simpl001SolverResult {
  const expression = extractExpression(parameters.stemItem.text);
  const numericValue = evaluateExpression(expression);
  const answer = formatAnswer(parameters.canonicalProblemId, expression, numericValue);
  const answerLatex = `\\(${escapeLatex(answer)}\\)`;
  return {
    expression,
    numericValue,
    answer,
    answerLatex,
    mathJaxObjects: {
      simplificationLatex: `\\(${escapeLatex(expression)} = ${escapeLatex(answer)}\\)`,
    },
  };
}

export function extractExpression(stem: string): string {
  let text = stem.trim().replace(/[.:?]$/u, "");
  const prefixes = [
    "Simplify and find the value of ",
    "Choose the most appropriate value for ",
    "Which option best represents ",
    "Find the approximate result of ",
    "Select the option closest to ",
    "Choose the closest answer for ",
    "Select the nearest answer for ",
    "Choose the value closest to ",
    "Find the value nearest to ",
    "Find the approximate value of ",
    "Choose the nearest answer for ",
    "Select the value closest to ",
    "Which answer is nearest to ",
    "Which value is closest to ",
    "Which value is nearest to ",
    "Which option is closest to ",
    "Choose the nearest value of ",
    "Find the closest value of ",
    "Find the nearest value of ",
    "Find the final value of ",
    "Compute the value of ",
    "Determine the value of ",
    "What is the final value of ",
    "What is the value of ",
    "Find the result of ",
    "Find the value of ",
    "Approximate ",
    "Estimate ",
    "Evaluate ",
    "Simplify ",
  ];
  for (const prefix of prefixes) {
    if (text.startsWith(prefix)) {
      text = text.slice(prefix.length);
      break;
    }
  }
  return text.trim();
}

export function evaluateExpression(expression: string): number {
  let js = expression
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("²", "^2")
    .replaceAll("³", "^3");
  js = js.replace(/\b(\d+)\s+(\d+)\/(\d+)\b/g, "($1+$2/$3)");
  js = js.replace(/cube root of\s+(\d+(?:\.\d+)?)/gi, "Math.cbrt($1)");
  js = js.replace(/sqrt\(([^)]+)\)/gi, "Math.sqrt($1)");
  js = js.replace(/(\d+(?:\.\d+)?)%\s*of\s*/gi, "($1/100)*");
  js = js.replace(/\bof\b/gi, "*");
  js = js.replace(/\s+x\s+/gi, "*");
  js = replacePowers(js);
  if (!/^[0-9+\-*/().\sMathsqrtcbrt]+$/u.test(js)) {
    throw new Error(`Unsupported SIMPL-001 expression: ${expression}`);
  }
  const value = Function(`"use strict"; return (${js});`)() as unknown;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`SIMPL-001 expression did not evaluate to a finite number: ${expression}`);
  }
  return value;
}

function replacePowers(input: string): string {
  let output = input;
  const powerPattern = /(\d+(?:\.\d+)?|\([^()]+\)|Math\.(?:sqrt|cbrt)\([^()]+\))\s*\^\s*(\d+)/;
  while (powerPattern.test(output)) {
    output = output.replace(powerPattern, "Math.pow($1,$2)");
  }
  return output;
}

function formatAnswer(cpId: Simpl001Parameters["canonicalProblemId"], expression: string, value: number): string {
  if (cpId === "CP-002") {
    return decimalToFraction(value);
  }
  if (cpId === "CP-006" || cpId === "CP-007") {
    return String(Math.round(value));
  }
  return trimNumber(value);
}

function decimalToFraction(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  let bestNumerator = Math.round(abs);
  let bestDenominator = 1;
  let bestError = Math.abs(abs - bestNumerator);
  for (let denominator = 1; denominator <= 10000; denominator++) {
    const numerator = Math.round(abs * denominator);
    const error = Math.abs(abs - numerator / denominator);
    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;
    }
    if (error < 1e-12) break;
  }
  const divisor = gcd(bestNumerator, bestDenominator);
  const numerator = bestNumerator / divisor;
  const denominator = bestDenominator / divisor;
  return denominator === 1 ? `${sign}${numerator}` : `${sign}${numerator}/${denominator}`;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function trimNumber(value: number): string {
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-10) return String(rounded);
  return Number(value.toFixed(6)).toString();
}

function escapeLatex(value: string): string {
  return value.replaceAll("*", "\\times ").replaceAll("/", "\\div ");
}
