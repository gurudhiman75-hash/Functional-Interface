import {
  addRational,
  divideRational,
  isIntegerRational,
  multiplyRational,
  negateRational,
  powRational,
  rational,
  subtractRational,
  type Rational,
} from "./exact-rational";
import type { ExpressionNode } from "./expression-ast";

export type RpnToken =
  | { readonly kind: "VALUE"; readonly value: Rational }
  | { readonly kind: "UNARY"; readonly operation: "NEGATE" | "FACTORIAL" }
  | {
      readonly kind: "BINARY";
      readonly operation:
        | "ADD"
        | "SUBTRACT"
        | "MULTIPLY"
        | "IMPLICIT_MULTIPLY"
        | "DIVIDE"
        | "FRACTION_BAR"
        | "OF"
        | "PERCENT_OF";
    }
  | { readonly kind: "POWER"; readonly exponent: bigint }
  | { readonly kind: "ROOT"; readonly degree: bigint };

function factorial(value: bigint): bigint {
  if (value < 0n || value > 30n) throw new Error("Independent factorial operand is outside the proof domain.");
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
  throw new Error("Independent root enumeration found no exact root.");
}

function emitRpn(node: ExpressionNode, output: RpnToken[]): void {
  switch (node.kind) {
    case "VALUE":
      output.push(Object.freeze({ kind: "VALUE", value: node.value }));
      return;
    case "GROUP":
      emitRpn(node.child, output);
      return;
    case "NEGATE":
      emitRpn(node.child, output);
      output.push(Object.freeze({ kind: "UNARY", operation: "NEGATE" }));
      return;
    case "FACTORIAL":
      emitRpn(node.child, output);
      output.push(Object.freeze({ kind: "UNARY", operation: "FACTORIAL" }));
      return;
    case "POWER":
      emitRpn(node.base, output);
      output.push(Object.freeze({ kind: "POWER", exponent: node.exponent }));
      return;
    case "EXACT_ROOT":
      emitRpn(node.radicand, output);
      output.push(Object.freeze({ kind: "ROOT", degree: node.degree }));
      return;
    case "PERCENT_OF":
      emitRpn(node.percent, output);
      emitRpn(node.quantity, output);
      output.push(Object.freeze({ kind: "BINARY", operation: "PERCENT_OF" }));
      return;
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "IMPLICIT_MULTIPLY":
    case "DIVIDE":
    case "FRACTION_BAR":
    case "OF":
      emitRpn(node.left, output);
      emitRpn(node.right, output);
      output.push(Object.freeze({ kind: "BINARY", operation: node.kind }));
      return;
  }
}

function pop(stack: Rational[]): Rational {
  const value = stack.pop();
  if (!value) throw new Error("Malformed RPN stack state.");
  return value;
}

export function evaluateIndependent(node: ExpressionNode): Rational {
  const tokens: RpnToken[] = [];
  emitRpn(node, tokens);
  const stack: Rational[] = [];
  for (const token of tokens) {
    if (token.kind === "VALUE") {
      stack.push(token.value);
      continue;
    }
    if (token.kind === "UNARY") {
      const operand = pop(stack);
      if (token.operation === "NEGATE") {
        stack.push(negateRational(operand));
      } else {
        if (!isIntegerRational(operand)) throw new Error("Factorial requires an integer operand.");
        stack.push(rational(factorial(operand.numerator)));
      }
      continue;
    }
    if (token.kind === "POWER") {
      stack.push(powRational(pop(stack), token.exponent));
      continue;
    }
    if (token.kind === "ROOT") {
      const radicand = pop(stack);
      stack.push(rational(
        exactRootByEnumeration(radicand.numerator, token.degree),
        exactRootByEnumeration(radicand.denominator, token.degree),
      ));
      continue;
    }
    const right = pop(stack);
    const left = pop(stack);
    switch (token.operation) {
      case "ADD":
        stack.push(addRational(left, right));
        break;
      case "SUBTRACT":
        stack.push(subtractRational(left, right));
        break;
      case "MULTIPLY":
      case "IMPLICIT_MULTIPLY":
      case "OF":
        stack.push(multiplyRational(left, right));
        break;
      case "DIVIDE":
      case "FRACTION_BAR":
        stack.push(divideRational(left, right));
        break;
      case "PERCENT_OF":
        stack.push(divideRational(multiplyRational(left, right), rational(100n)));
        break;
    }
  }
  if (stack.length !== 1) throw new Error("Malformed expression left multiple verifier values.");
  return stack[0]!;
}
