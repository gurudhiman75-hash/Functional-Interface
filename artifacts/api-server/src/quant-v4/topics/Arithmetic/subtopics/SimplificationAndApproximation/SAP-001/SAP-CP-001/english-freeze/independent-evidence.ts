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
} from "../../../shared/exact-rational";
import type { ExpressionNode } from "../../../shared/expression-ast";

export interface IndependentEvaluationEvidence {
  readonly value: Rational;
  readonly rpnTrace: readonly string[];
}

type BinaryOperation =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "OF"
  | "IMPLICIT_MULTIPLY"
  | "FRACTION_BAR"
  | "PERCENT_OF";

type EvidenceToken =
  | { readonly kind: "VALUE"; readonly value: Rational }
  | { readonly kind: "UNARY"; readonly operation: "NEGATE" | "FACTORIAL" }
  | { readonly kind: "BINARY"; readonly operation: BinaryOperation }
  | { readonly kind: "POWER"; readonly exponent: bigint }
  | { readonly kind: "ROOT"; readonly degree: bigint };

function factorial(value: bigint): bigint {
  if (value < 0n || value > 30n) {
    throw new Error("Independent review factorial operand is outside the proof domain.");
  }
  let product = 1n;
  for (let factor = 2n; factor <= value; factor += 1n) product *= factor;
  return product;
}

function integerPower(base: bigint, exponent: bigint): bigint {
  let output = 1n;
  for (let count = 0n; count < exponent; count += 1n) output *= base;
  return output;
}

function exactRootByEnumeration(value: bigint, degree: bigint): bigint {
  if (degree <= 0n) throw new Error("Root degree must be positive.");
  const negative = value < 0n;
  if (negative && degree % 2n === 0n) throw new Error("Even root of negative value is not real.");
  const target = negative ? -value : value;
  for (let candidate = 0n; candidate <= target; candidate += 1n) {
    if (integerPower(candidate, degree) === target) return negative ? -candidate : candidate;
  }
  throw new Error("Independent review route found no exact root.");
}

function emit(node: ExpressionNode, output: EvidenceToken[]): void {
  switch (node.kind) {
    case "VALUE":
      output.push(Object.freeze({ kind: "VALUE", value: node.value }));
      return;
    case "GROUP":
      emit(node.child, output);
      return;
    case "NEGATE":
      emit(node.child, output);
      output.push(Object.freeze({ kind: "UNARY", operation: "NEGATE" }));
      return;
    case "FACTORIAL":
      emit(node.child, output);
      output.push(Object.freeze({ kind: "UNARY", operation: "FACTORIAL" }));
      return;
    case "POWER":
      emit(node.base, output);
      output.push(Object.freeze({ kind: "POWER", exponent: node.exponent }));
      return;
    case "EXACT_ROOT":
      emit(node.radicand, output);
      output.push(Object.freeze({ kind: "ROOT", degree: node.degree }));
      return;
    case "PERCENT_OF":
      emit(node.percent, output);
      emit(node.quantity, output);
      output.push(Object.freeze({ kind: "BINARY", operation: "PERCENT_OF" }));
      return;
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "DIVIDE":
    case "OF":
    case "IMPLICIT_MULTIPLY":
    case "FRACTION_BAR":
      emit(node.left, output);
      emit(node.right, output);
      output.push(Object.freeze({ kind: "BINARY", operation: node.kind }));
      return;
  }
}

function pop(stack: Rational[]): Rational {
  const value = stack.pop();
  if (!value) throw new Error("Malformed independent review stack state.");
  return value;
}

function operatorSymbol(operation: BinaryOperation): string {
  switch (operation) {
    case "ADD": return "+";
    case "SUBTRACT": return "−";
    case "MULTIPLY":
    case "IMPLICIT_MULTIPLY":
    case "OF": return "×";
    case "DIVIDE":
    case "FRACTION_BAR": return "÷";
    case "PERCENT_OF": return "% of";
  }
}

export function evaluateIndependentEvidence(node: ExpressionNode): IndependentEvaluationEvidence {
  const tokens: EvidenceToken[] = [];
  emit(node, tokens);
  const stack: Rational[] = [];
  const trace: string[] = [];

  for (const token of tokens) {
    if (token.kind === "VALUE") {
      stack.push(token.value);
      continue;
    }

    if (token.kind === "UNARY") {
      const operand = pop(stack);
      if (token.operation === "NEGATE") {
        const output = negateRational(operand);
        stack.push(output);
        trace.push(`NEGATE ${formatRational(operand)} → ${formatRational(output)}`);
      } else {
        if (!isIntegerRational(operand)) throw new Error("Factorial requires an integer operand.");
        const output = rational(factorial(operand.numerator));
        stack.push(output);
        trace.push(`FACTORIAL ${formatRational(operand)} → ${formatRational(output)}`);
      }
      continue;
    }

    if (token.kind === "POWER") {
      const base = pop(stack);
      const output = powRational(base, token.exponent);
      stack.push(output);
      trace.push(`POWER ${formatRational(base)} ^ ${token.exponent.toString()} → ${formatRational(output)}`);
      continue;
    }

    if (token.kind === "ROOT") {
      const radicand = pop(stack);
      const output = rational(
        exactRootByEnumeration(radicand.numerator, token.degree),
        exactRootByEnumeration(radicand.denominator, token.degree),
      );
      stack.push(output);
      trace.push(`ROOT ${token.degree.toString()} of ${formatRational(radicand)} → ${formatRational(output)}`);
      continue;
    }

    const right = pop(stack);
    const left = pop(stack);
    let output: Rational;
    switch (token.operation) {
      case "ADD":
        output = addRational(left, right);
        break;
      case "SUBTRACT":
        output = subtractRational(left, right);
        break;
      case "MULTIPLY":
      case "IMPLICIT_MULTIPLY":
      case "OF":
        output = multiplyRational(left, right);
        break;
      case "DIVIDE":
      case "FRACTION_BAR":
        output = divideRational(left, right);
        break;
      case "PERCENT_OF":
        output = divideRational(multiplyRational(left, right), rational(100n));
        break;
    }
    stack.push(output);
    trace.push(
      `${token.operation} ${formatRational(left)} ${operatorSymbol(token.operation)} ${formatRational(right)} → ${formatRational(output)}`,
    );
  }

  if (stack.length !== 1) throw new Error("Independent review route left an invalid stack state.");
  return Object.freeze({
    value: stack[0]!,
    rpnTrace: Object.freeze(trace),
  });
}
