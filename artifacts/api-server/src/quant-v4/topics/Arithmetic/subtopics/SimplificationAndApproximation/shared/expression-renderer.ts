import { formatRational } from "./exact-rational";
import type { BracketStyle, ExpressionNode } from "./expression-ast";

const PRECEDENCE: Record<ExpressionNode["kind"], number> = {
  VALUE: 100,
  GROUP: 100,
  FRACTION_BAR: 95,
  FACTORIAL: 90,
  POWER: 80,
  EXACT_ROOT: 80,
  NEGATE: 70,
  PERCENT_OF: 65,
  OF: 60,
  IMPLICIT_MULTIPLY: 50,
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

function renderFractionOperand(node: ExpressionNode): string {
  if (node.kind === "GROUP") return renderNode(node.child, 0);
  return renderNode(node, 0);
}

function renderNode(node: ExpressionNode, parentPrecedence: number, isRightChild = false): string {
  const ownPrecedence = PRECEDENCE[node.kind];
  let output: string;
  switch (node.kind) {
    case "VALUE":
      output = formatRational(node.value);
      break;
    case "GROUP": {
      const [open, close] = bracketPair(node.style);
      output = `${open}${renderNode(node.child, 0)}${close}`;
      break;
    }
    case "NEGATE":
      output = `−${renderNode(node.child, ownPrecedence)}`;
      break;
    case "FACTORIAL":
      output = `${renderNode(node.child, ownPrecedence)}!`;
      break;
    case "POWER":
      output = `${renderNode(node.base, ownPrecedence)}^${node.exponent.toString()}`;
      break;
    case "EXACT_ROOT":
      output = node.degree === 2n
        ? `√${renderNode(node.radicand, ownPrecedence)}`
        : `root_${node.degree.toString()}(${renderNode(node.radicand, 0)})`;
      break;
    case "PERCENT_OF":
      output = `${renderNode(node.percent, ownPrecedence)}% of ${renderNode(node.quantity, ownPrecedence)}`;
      break;
    case "OF":
      output = `${renderNode(node.left, ownPrecedence)} of ${renderNode(node.right, ownPrecedence)}`;
      break;
    case "FRACTION_BAR":
      output = `⟦${renderFractionOperand(node.left)}⟧⁄⟦${renderFractionOperand(node.right)}⟧`;
      break;
    case "IMPLICIT_MULTIPLY":
      if (node.right.kind !== "GROUP") {
        throw new Error("Implicit multiplication is renderable only with an explicitly grouped right factor.");
      }
      output = `${renderNode(node.left, ownPrecedence)}${renderNode(node.right, ownPrecedence, true)}`;
      break;
    case "ADD":
      output = `${renderNode(node.left, ownPrecedence)} + ${renderNode(node.right, ownPrecedence, true)}`;
      break;
    case "SUBTRACT":
      output = `${renderNode(node.left, ownPrecedence)} − ${renderNode(node.right, ownPrecedence, true)}`;
      break;
    case "MULTIPLY":
      output = `${renderNode(node.left, ownPrecedence)} × ${renderNode(node.right, ownPrecedence, true)}`;
      break;
    case "DIVIDE":
      output = `${renderNode(node.left, ownPrecedence)} ÷ ${renderNode(node.right, ownPrecedence, true)}`;
      break;
  }

  const nonAssociativeRight = isRightChild && (
    node.kind === "ADD"
    || node.kind === "SUBTRACT"
    || node.kind === "MULTIPLY"
    || node.kind === "IMPLICIT_MULTIPLY"
    || node.kind === "DIVIDE"
  );
  if (ownPrecedence < parentPrecedence || (ownPrecedence === parentPrecedence && nonAssociativeRight)) {
    return `(${output})`;
  }
  return output;
}

export function renderExpression(node: ExpressionNode): string {
  return renderNode(node, 0);
}
