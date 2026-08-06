import { rational, type Rational } from "./exact-rational";

export type BracketStyle = "ROUND" | "SQUARE" | "CURLY";

export type ExpressionNode =
  | { readonly kind: "VALUE"; readonly value: Rational }
  | { readonly kind: "NEGATE"; readonly child: ExpressionNode }
  | { readonly kind: "GROUP"; readonly child: ExpressionNode; readonly style: BracketStyle }
  | {
      readonly kind:
        | "ADD"
        | "SUBTRACT"
        | "MULTIPLY"
        | "IMPLICIT_MULTIPLY"
        | "DIVIDE"
        | "FRACTION_BAR"
        | "OF";
      readonly left: ExpressionNode;
      readonly right: ExpressionNode;
    }
  | { readonly kind: "POWER"; readonly base: ExpressionNode; readonly exponent: bigint }
  | { readonly kind: "EXACT_ROOT"; readonly degree: bigint; readonly radicand: ExpressionNode }
  | { readonly kind: "FACTORIAL"; readonly child: ExpressionNode }
  | { readonly kind: "PERCENT_OF"; readonly percent: ExpressionNode; readonly quantity: ExpressionNode };

export const valueNode = (value: bigint | Rational): ExpressionNode => Object.freeze({
  kind: "VALUE" as const,
  value: typeof value === "bigint" ? rational(value) : value,
});

export const negateNode = (child: ExpressionNode): ExpressionNode => Object.freeze({
  kind: "NEGATE" as const,
  child,
});

export const groupNode = (
  child: ExpressionNode,
  style: BracketStyle = "ROUND",
): ExpressionNode => Object.freeze({ kind: "GROUP" as const, child, style });

export const binaryNode = (
  kind:
    | "ADD"
    | "SUBTRACT"
    | "MULTIPLY"
    | "IMPLICIT_MULTIPLY"
    | "DIVIDE"
    | "FRACTION_BAR"
    | "OF",
  left: ExpressionNode,
  right: ExpressionNode,
): ExpressionNode => Object.freeze({ kind, left, right });

export const implicitMultiplyNode = (
  coefficient: ExpressionNode,
  groupedFactor: ExpressionNode,
): ExpressionNode => {
  if (groupedFactor.kind !== "GROUP") {
    throw new Error("Implicit multiplication requires an explicitly grouped right factor.");
  }
  return binaryNode("IMPLICIT_MULTIPLY", coefficient, groupedFactor);
};

export const fractionBarNode = (
  numerator: ExpressionNode,
  denominator: ExpressionNode,
): ExpressionNode => Object.freeze({
  kind: "FRACTION_BAR" as const,
  left: numerator,
  right: denominator,
});

export const powerNode = (base: ExpressionNode, exponent: bigint): ExpressionNode => Object.freeze({
  kind: "POWER" as const,
  base,
  exponent,
});

export const exactRootNode = (
  degree: bigint,
  radicand: ExpressionNode,
): ExpressionNode => Object.freeze({ kind: "EXACT_ROOT" as const, degree, radicand });

export const factorialNode = (child: ExpressionNode): ExpressionNode => Object.freeze({
  kind: "FACTORIAL" as const,
  child,
});

export const percentOfNode = (
  percent: ExpressionNode,
  quantity: ExpressionNode,
): ExpressionNode => Object.freeze({
  kind: "PERCENT_OF" as const,
  percent,
  quantity,
});

export function expressionFingerprint(node: ExpressionNode): string {
  switch (node.kind) {
    case "VALUE":
      return `V(${node.value.numerator}/${node.value.denominator})`;
    case "NEGATE":
      return `N(${expressionFingerprint(node.child)})`;
    case "GROUP":
      return `G:${node.style}(${expressionFingerprint(node.child)})`;
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "IMPLICIT_MULTIPLY":
    case "DIVIDE":
    case "FRACTION_BAR":
    case "OF":
      return `${node.kind}(${expressionFingerprint(node.left)},${expressionFingerprint(node.right)})`;
    case "POWER":
      return `POWER(${expressionFingerprint(node.base)},${node.exponent})`;
    case "EXACT_ROOT":
      return `ROOT(${node.degree},${expressionFingerprint(node.radicand)})`;
    case "FACTORIAL":
      return `FACT(${expressionFingerprint(node.child)})`;
    case "PERCENT_OF":
      return `PERCENT_OF(${expressionFingerprint(node.percent)},${expressionFingerprint(node.quantity)})`;
  }
}
