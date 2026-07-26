import {
  addExact,
  compareExact,
  divideExact,
  formatExact,
  fromFiniteDecimal,
  makeRational,
  multiplyExact,
  negateExact,
  subtractExact,
  type ExactRational,
} from "../foundation";

export interface TeachingStep {
  label: string;
  expression: string;
  result: string;
}

export interface MeaningPair {
  display: string;
  meaning: string;
}

export interface ArithmeticTrace {
  expression: string;
  value: string;
  steps: readonly TeachingStep[];
}

export interface RelationTrace {
  statement: string;
  left: ArithmeticTrace;
  relation: "=" | "<" | ">";
  right: ArithmeticTrace;
  truth: boolean;
}

const ARITHMETIC_OPERATORS = new Set(["+", "−", "×", "÷"]);
const SIGNED_FINITE_DECIMAL = /^-?\d+(?:\.\d+)?$/u;
const SIGNED_FRACTION = /^(-?\d+)\/(\d+)$/u;

function fail(message: string): never {
  throw new Error(`OPS-001 approved teaching runtime: ${message}`);
}

export function requireMatch(source: string, pattern: RegExp, context: string): RegExpMatchArray {
  const match = source.match(pattern);
  if (!match) fail(`${context} did not match the expected editorial pattern: ${source}`);
  return match;
}

export function parseMeaningPairs(source: string): readonly MeaningPair[] {
  const pairs: MeaningPair[] = [];
  const pattern = /([A-Za-z]+|[$#◆●+−×÷]) means ([+−×÷=<>])/gu;
  for (const match of source.matchAll(pattern)) {
    pairs.push({ display: match[1], meaning: match[2] });
  }
  if (pairs.length === 0) fail(`no symbol meanings were found in: ${source}`);
  return pairs;
}

export function meaningKey(pairs: readonly MeaningPair[]): string {
  return pairs.map((pair) => `${pair.display} → ${pair.meaning}`).join("; ");
}

export function substituteTokenMeanings(expression: string, pairs: readonly MeaningPair[]): string {
  const mapping = new Map(pairs.map((pair) => [pair.display, pair.meaning] as const));
  return expression
    .trim()
    .split(/\s+/u)
    .map((token) => mapping.get(token) ?? token)
    .join(" ");
}

function normalizeSignedSource(source: string): string {
  return source.startsWith("−") ? `-${source.slice(1)}` : source;
}

function parseExactNumber(source: string): ExactRational {
  const normalized = normalizeSignedSource(source);
  const fraction = normalized.match(SIGNED_FRACTION);
  if (fraction) return makeRational(BigInt(fraction[1]), BigInt(fraction[2]));
  if (!SIGNED_FINITE_DECIMAL.test(normalized)) fail(`unsupported number literal in teaching trace: ${source}`);
  if (!normalized.startsWith("-")) return fromFiniteDecimal(normalized);
  return negateExact(fromFiniteDecimal(normalized.slice(1)));
}

function applyArithmetic(left: ExactRational, operator: string, right: ExactRational): ExactRational {
  switch (operator) {
    case "+": return addExact(left, right);
    case "−": return subtractExact(left, right);
    case "×": return multiplyExact(left, right);
    case "÷": return divideExact(left, right);
    default: return fail(`unsupported arithmetic operator: ${operator}`);
  }
}

function renderState(values: readonly ExactRational[], operators: readonly string[]): string {
  const tokens: string[] = [];
  values.forEach((value, index) => {
    tokens.push(formatExact(value));
    if (operators[index]) tokens.push(operators[index]);
  });
  return tokens.join(" ");
}

export function arithmeticTrace(expression: string): ArithmeticTrace {
  const tokens = expression.trim().split(/\s+/u).filter(Boolean);
  if (tokens.length === 0 || tokens.length % 2 === 0) fail(`malformed arithmetic expression: ${expression}`);

  const values: ExactRational[] = [];
  const operators: string[] = [];
  tokens.forEach((token, index) => {
    if (index % 2 === 0) values.push(parseExactNumber(token));
    else if (ARITHMETIC_OPERATORS.has(token)) operators.push(token);
    else fail(`malformed operator position in: ${expression}`);
  });

  const steps: TeachingStep[] = [];
  const reduceAt = (operatorIndex: number, label: string): void => {
    const left = values[operatorIndex];
    const right = values[operatorIndex + 1];
    const operator = operators[operatorIndex];
    const result = applyArithmetic(left, operator, right);
    const calculation = `${formatExact(left)} ${operator} ${formatExact(right)}`;
    values.splice(operatorIndex, 2, result);
    operators.splice(operatorIndex, 1);
    const remaining = renderState(values, operators);
    steps.push({
      label,
      expression: calculation,
      result: remaining === formatExact(result)
        ? formatExact(result)
        : `${formatExact(result)}; the expression becomes ${remaining}`,
    });
  };

  while (operators.some((operator) => operator === "×" || operator === "÷")) {
    const index = operators.findIndex((operator) => operator === "×" || operator === "÷");
    reduceAt(index, "Calculate multiplication/division first");
  }
  while (operators.length > 0) {
    reduceAt(0, "Finish addition/subtraction from left to right");
  }

  return { expression, value: formatExact(values[0]), steps };
}

export function relationTrace(statement: string): RelationTrace {
  const match = requireMatch(statement, /^(.+?)\s(=|<|>)\s(.+)$/u, "relation statement");
  const left = arithmeticTrace(match[1]);
  const right = arithmeticTrace(match[3]);
  const comparison = compareExact(parseExactNumber(left.value), parseExactNumber(right.value));
  const relation = match[2] as "=" | "<" | ">";
  const truth = relation === "=" ? comparison === 0 : relation === "<" ? comparison < 0 : comparison > 0;
  return { statement, left, relation, right, truth };
}

export function relationSummary(trace: RelationTrace): string {
  const comparison = `${trace.left.value} ${trace.relation} ${trace.right.value}`;
  return `${comparison}, which is ${trace.truth ? "true" : "false"}`;
}

export function swapOperatorPairs(expression: string, pairs: readonly (readonly [string, string])[]): string {
  const mapping = new Map<string, string>();
  for (const [left, right] of pairs) {
    mapping.set(left, right);
    mapping.set(right, left);
  }
  return expression
    .trim()
    .split(/\s+/u)
    .map((token) => mapping.get(token) ?? token)
    .join(" ");
}

export function swapWholeNumbers(expression: string, left: string, right: string): string {
  return expression
    .trim()
    .split(/\s+/u)
    .map((token) => token === left ? right : token === right ? left : token)
    .join(" ");
}

export function swapDigits(expression: string, left: string, right: string): string {
  if (!/^\d$/u.test(left) || !/^\d$/u.test(right) || left === right) fail(`invalid digit pair ${left}, ${right}`);
  return expression.replace(/\d/gu, (digit) => digit === left ? right : digit === right ? left : digit);
}

export function parseArrowPair(source: string): readonly [string, string] {
  const match = requireMatch(source.trim(), /^(.+?)\s*↔\s*(.+)$/u, "interchange pair");
  return [match[1].trim(), match[2].trim()];
}

export function operatorPairKey(pair: readonly [string, string]): string {
  return [...pair].sort().join("↔");
}

export function tokensPresent(expression: string, tokens: readonly string[]): boolean {
  const sourceTokens = new Set(expression.trim().split(/\s+/u));
  return tokens.every((token) => sourceTokens.has(token));
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function withPrefix(steps: readonly TeachingStep[], prefix: string): readonly TeachingStep[] {
  return steps.map((step) => ({ ...step, label: `${prefix}: ${step.label}` }));
}
