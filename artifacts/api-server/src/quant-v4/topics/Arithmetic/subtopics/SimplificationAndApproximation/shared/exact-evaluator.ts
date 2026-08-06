import {
  addRational,
  divideRational,
  formatRational,
  isIntegerRational,
  multiplyRational,
  negateRational,
  powRational,
  rational,
  subtractRational,
  type Rational,
} from "./exact-rational";
import type { ExpressionNode } from "./expression-ast";

export interface EvaluationTraceStep {
  readonly operation: string;
  readonly input: string;
  readonly output: string;
}

export interface ExactEvaluation {
  readonly value: Rational;
  readonly trace: readonly EvaluationTraceStep[];
}

function factorial(value: bigint): bigint {
  if (value < 0n) {
    throw new Error("Factorial requires a non-negative integer.");
  }
  if (value > 30n) {
    throw new Error("SAP discovery factorials are bounded to 30!.");
  }
  let product = 1n;
  for (let factor = 2n; factor <= value; factor += 1n) {
    product *= factor;
  }
  return product;
}

function integerPower(base: bigint, exponent: bigint): bigint {
  if (exponent < 0n) throw new Error("integerPower requires a non-negative exponent.");
  let result = 1n;
  let factor = base;
  let remaining = exponent;
  while (remaining > 0n) {
    if (remaining % 2n === 1n) result *= factor;
    remaining /= 2n;
    if (remaining > 0n) factor *= factor;
  }
  return result;
}

function exactIntegerRoot(value: bigint, degree: bigint): bigint {
  if (degree <= 0n) throw new Error("Root degree must be positive.");
  if (value < 0n && degree % 2n === 0n) {
    throw new Error("An even exact root of a negative number is not real.");
  }
  const sign = value < 0n ? -1n : 1n;
  const target = value < 0n ? -value : value;
  if (target <= 1n) return sign * target;
  let low = 0n;
  let high = target + 1n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    const powered = integerPower(mid, degree);
    if (powered === target) return sign * mid;
    if (powered < target) low = mid;
    else high = mid;
  }
  throw new Error(`${value} is not a perfect ${degree.toString()}th power.`);
}

function evaluateNode(node: ExpressionNode, trace: EvaluationTraceStep[]): Rational {
  switch (node.kind) {
    case "VALUE":
      return node.value;
    case "GROUP":
      return evaluateNode(node.child, trace);
    case "NEGATE": {
      const child = evaluateNode(node.child, trace);
      const output = negateRational(child);
      trace.push({ operation: "NEGATE", input: formatRational(child), output: formatRational(output) });
      return output;
    }
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "IMPLICIT_MULTIPLY":
    case "DIVIDE":
    case "FRACTION_BAR":
    case "OF": {
      const left = evaluateNode(node.left, trace);
      const right = evaluateNode(node.right, trace);
      const output = node.kind === "ADD"
        ? addRational(left, right)
        : node.kind === "SUBTRACT"
          ? subtractRational(left, right)
          : node.kind === "DIVIDE" || node.kind === "FRACTION_BAR"
            ? divideRational(left, right)
            : multiplyRational(left, right);
      trace.push({
        operation: node.kind,
        input: `${formatRational(left)} | ${formatRational(right)}`,
        output: formatRational(output),
      });
      return output;
    }
    case "POWER": {
      const base = evaluateNode(node.base, trace);
      const output = powRational(base, node.exponent);
      trace.push({
        operation: "POWER",
        input: `${formatRational(base)} ^ ${node.exponent.toString()}`,
        output: formatRational(output),
      });
      return output;
    }
    case "EXACT_ROOT": {
      const radicand = evaluateNode(node.radicand, trace);
      const numerator = exactIntegerRoot(radicand.numerator, node.degree);
      const denominator = exactIntegerRoot(radicand.denominator, node.degree);
      const output = rational(numerator, denominator);
      trace.push({
        operation: "EXACT_ROOT",
        input: `${node.degree.toString()} | ${formatRational(radicand)}`,
        output: formatRational(output),
      });
      return output;
    }
    case "FACTORIAL": {
      const child = evaluateNode(node.child, trace);
      if (!isIntegerRational(child)) {
        throw new Error("Factorial requires an integer operand.");
      }
      const output = rational(factorial(child.numerator));
      trace.push({ operation: "FACTORIAL", input: formatRational(child), output: formatRational(output) });
      return output;
    }
    case "PERCENT_OF": {
      const percent = evaluateNode(node.percent, trace);
      const quantity = evaluateNode(node.quantity, trace);
      const output = divideRational(multiplyRational(percent, quantity), rational(100n));
      trace.push({
        operation: "PERCENT_OF",
        input: `${formatRational(percent)}% | ${formatRational(quantity)}`,
        output: formatRational(output),
      });
      return output;
    }
  }
}

export function evaluateExact(node: ExpressionNode): ExactEvaluation {
  const trace: EvaluationTraceStep[] = [];
  const value = evaluateNode(node, trace);
  return Object.freeze({ value, trace: Object.freeze(trace.map((step) => Object.freeze(step))) });
}
