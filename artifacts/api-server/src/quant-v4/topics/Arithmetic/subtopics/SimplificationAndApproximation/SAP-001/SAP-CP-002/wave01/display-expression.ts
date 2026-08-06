import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  negateRational,
  rational,
  subtractRational,
  type Rational,
} from "../../../shared/exact-rational";
import {
  binaryNode,
  fractionBarNode,
  groupNode,
  negateNode,
  valueNode,
  type BracketStyle,
  type ExpressionNode,
} from "../../../shared/expression-ast";

export type SapFractionValueDisplay = "INTEGER" | "FRACTION" | "MIXED_NUMBER";

export type SapFractionExpressionNode =
  | {
      readonly kind: "VALUE";
      readonly value: Rational;
      readonly display: SapFractionValueDisplay;
    }
  | { readonly kind: "NEGATE"; readonly child: SapFractionExpressionNode }
  | {
      readonly kind: "GROUP";
      readonly child: SapFractionExpressionNode;
      readonly style: BracketStyle;
    }
  | {
      readonly kind: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | "OF" | "COMPLEX_FRACTION";
      readonly left: SapFractionExpressionNode;
      readonly right: SapFractionExpressionNode;
    };

export interface SapFractionIndependentEvaluation {
  readonly value: Rational;
  readonly trace: readonly string[];
}

export const fractionValueNode = (
  numerator: bigint,
  denominator: bigint = 1n,
  display: SapFractionValueDisplay = denominator === 1n ? "INTEGER" : "FRACTION",
): SapFractionExpressionNode => Object.freeze({
  kind: "VALUE" as const,
  value: rational(numerator, denominator),
  display,
});

export const rationalValueNode = (
  value: Rational,
  display: SapFractionValueDisplay = value.denominator === 1n ? "INTEGER" : "FRACTION",
): SapFractionExpressionNode => Object.freeze({ kind: "VALUE" as const, value, display });

export const fractionNegateNode = (child: SapFractionExpressionNode): SapFractionExpressionNode => (
  Object.freeze({ kind: "NEGATE" as const, child })
);

export const fractionGroupNode = (
  child: SapFractionExpressionNode,
  style: BracketStyle = "ROUND",
): SapFractionExpressionNode => Object.freeze({ kind: "GROUP" as const, child, style });

export const fractionBinaryNode = (
  kind: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | "OF" | "COMPLEX_FRACTION",
  left: SapFractionExpressionNode,
  right: SapFractionExpressionNode,
): SapFractionExpressionNode => Object.freeze({ kind, left, right });

export function compileFractionExpression(node: SapFractionExpressionNode): ExpressionNode {
  switch (node.kind) {
    case "VALUE":
      return valueNode(node.value);
    case "NEGATE":
      return negateNode(compileFractionExpression(node.child));
    case "GROUP":
      return groupNode(compileFractionExpression(node.child), node.style);
    case "COMPLEX_FRACTION":
      return fractionBarNode(
        compileFractionExpression(node.left),
        compileFractionExpression(node.right),
      );
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "DIVIDE":
    case "OF":
      return binaryNode(
        node.kind,
        compileFractionExpression(node.left),
        compileFractionExpression(node.right),
      );
  }
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function formatMixed(value: Rational): string {
  const sign = value.numerator < 0n ? "−" : "";
  const numerator = abs(value.numerator);
  const whole = numerator / value.denominator;
  const remainder = numerator % value.denominator;
  if (remainder === 0n) return `${sign}${whole.toString()}`;
  if (whole === 0n) return `${sign}${remainder.toString()}/${value.denominator.toString()}`;
  return `${sign}${whole.toString()} ${remainder.toString()}/${value.denominator.toString()}`;
}

function formatValue(node: Extract<SapFractionExpressionNode, { kind: "VALUE" }>): string {
  if (node.display === "MIXED_NUMBER") return formatMixed(node.value);
  return formatRational(node.value).replace("-", "−");
}

const PRECEDENCE: Record<SapFractionExpressionNode["kind"], number> = {
  VALUE: 100,
  GROUP: 100,
  COMPLEX_FRACTION: 95,
  NEGATE: 80,
  OF: 60,
  MULTIPLY: 50,
  DIVIDE: 50,
  ADD: 40,
  SUBTRACT: 40,
};

function bracketPair(style: BracketStyle): readonly [string, string] {
  if (style === "SQUARE") return ["[", "]"];
  if (style === "CURLY") return ["{", "}"];
  return ["(", ")"];
}

function renderNode(
  node: SapFractionExpressionNode,
  parentPrecedence: number,
  isRightChild = false,
): string {
  const own = PRECEDENCE[node.kind];
  let output: string;
  switch (node.kind) {
    case "VALUE":
      output = formatValue(node);
      break;
    case "NEGATE":
      output = `−${renderNode(node.child, own)}`;
      break;
    case "GROUP": {
      const [open, close] = bracketPair(node.style);
      output = `${open}${renderNode(node.child, 0)}${close}`;
      break;
    }
    case "COMPLEX_FRACTION":
      output = `⟦${renderNode(node.left, 0)}⟧⁄⟦${renderNode(node.right, 0)}⟧`;
      break;
    case "OF":
      output = `${renderNode(node.left, own)} of ${renderNode(node.right, own, true)}`;
      break;
    case "ADD":
      output = `${renderNode(node.left, own)} + ${renderNode(node.right, own, true)}`;
      break;
    case "SUBTRACT":
      output = `${renderNode(node.left, own)} − ${renderNode(node.right, own, true)}`;
      break;
    case "MULTIPLY":
      output = `${renderNode(node.left, own)} × ${renderNode(node.right, own, true)}`;
      break;
    case "DIVIDE":
      output = `${renderNode(node.left, own)} ÷ ${renderNode(node.right, own, true)}`;
      break;
  }

  const rightNeedsGrouping = isRightChild && (
    node.kind === "ADD"
    || node.kind === "SUBTRACT"
    || node.kind === "MULTIPLY"
    || node.kind === "DIVIDE"
    || node.kind === "OF"
  );
  if (own < parentPrecedence || (own === parentPrecedence && rightNeedsGrouping)) {
    return `(${output})`;
  }
  return output;
}

export function renderFractionExpression(node: SapFractionExpressionNode): string {
  return renderNode(node, 0);
}

export function fractionExpressionFingerprint(node: SapFractionExpressionNode): string {
  switch (node.kind) {
    case "VALUE":
      return `V:${node.display}(${node.value.numerator}/${node.value.denominator})`;
    case "NEGATE":
      return `NEG(${fractionExpressionFingerprint(node.child)})`;
    case "GROUP":
      return `G:${node.style}(${fractionExpressionFingerprint(node.child)})`;
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "DIVIDE":
    case "OF":
    case "COMPLEX_FRACTION":
      return `${node.kind}(${fractionExpressionFingerprint(node.left)},${fractionExpressionFingerprint(node.right)})`;
  }
}

export function evaluateFractionExpressionIndependent(
  node: SapFractionExpressionNode,
): SapFractionIndependentEvaluation {
  switch (node.kind) {
    case "VALUE":
      return Object.freeze({ value: node.value, trace: Object.freeze([`Push ${formatRational(node.value)}.`]) });
    case "GROUP": {
      const child = evaluateFractionExpressionIndependent(node.child);
      return Object.freeze({
        value: child.value,
        trace: Object.freeze([...child.trace, `Close ${node.style.toLowerCase()} group at ${formatRational(child.value)}.`]),
      });
    }
    case "NEGATE": {
      const child = evaluateFractionExpressionIndependent(node.child);
      const value = negateRational(child.value);
      return Object.freeze({
        value,
        trace: Object.freeze([...child.trace, `Negate ${formatRational(child.value)} to get ${formatRational(value)}.`]),
      });
    }
    case "ADD":
    case "SUBTRACT":
    case "MULTIPLY":
    case "DIVIDE":
    case "OF":
    case "COMPLEX_FRACTION": {
      const left = evaluateFractionExpressionIndependent(node.left);
      const right = evaluateFractionExpressionIndependent(node.right);
      const value = node.kind === "ADD"
        ? addRational(left.value, right.value)
        : node.kind === "SUBTRACT"
          ? subtractRational(left.value, right.value)
          : node.kind === "MULTIPLY" || node.kind === "OF"
            ? multiplyRational(left.value, right.value)
            : divideRational(left.value, right.value);
      const label = node.kind === "COMPLEX_FRACTION" ? "DIVIDE_COMPLETE_BLOCKS" : node.kind;
      return Object.freeze({
        value,
        trace: Object.freeze([
          ...left.trace,
          ...right.trace,
          `${label}: ${formatRational(left.value)} and ${formatRational(right.value)} give ${formatRational(value)}.`,
        ]),
      });
    }
  }
}
