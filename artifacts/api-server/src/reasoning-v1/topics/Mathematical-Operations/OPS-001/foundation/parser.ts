import { canonicalExactKey } from "./exact-rational";
import {
  OpsFoundationError,
  type ArithmeticAst,
  type ArithmeticOperator,
  type ParsedExpression,
  type RelationAst,
  type SemanticToken,
} from "./types";

class Parser {
  private index = 0;

  constructor(private readonly tokens: readonly SemanticToken[]) {}

  parse(): ParsedExpression {
    const left = this.parseAdditive();
    const token = this.peek();
    if (token?.kind === "RELATION") {
      this.index += 1;
      const right = this.parseAdditive();
      if (this.index !== this.tokens.length) {
        throw new OpsFoundationError("INVALID_RELATION_STRUCTURE", "A completed statement may contain only one top-level relation.");
      }
      return {
        kind: "RELATION",
        ast: { kind: "RELATION", operator: token.operator, left, right },
      };
    }
    if (this.index !== this.tokens.length) {
      const trailing = this.tokens[this.index];
      if (trailing.kind === "RELATION") {
        throw new OpsFoundationError("INVALID_RELATION_STRUCTURE", "Unexpected relation token in arithmetic expression.");
      }
      throw new OpsFoundationError("MALFORMED_EXPRESSION", `Unexpected trailing token at index ${this.index}.`);
    }
    return { kind: "ARITHMETIC", ast: left };
  }

  private parseAdditive(): ArithmeticAst {
    let left = this.parseMultiplicative();
    while (true) {
      const token = this.peek();
      if (token?.kind !== "ARITHMETIC" || (token.operator !== "ADD" && token.operator !== "SUBTRACT")) break;
      this.index += 1;
      const right = this.parseMultiplicative();
      left = { kind: "BINARY", operator: token.operator, left, right };
    }
    return left;
  }

  private parseMultiplicative(): ArithmeticAst {
    let left = this.parseUnary();
    while (true) {
      const token = this.peek();
      if (token?.kind !== "ARITHMETIC" || (token.operator !== "MULTIPLY" && token.operator !== "DIVIDE")) break;
      this.index += 1;
      const right = this.parseUnary();
      left = { kind: "BINARY", operator: token.operator, left, right };
    }
    return left;
  }

  private parseUnary(): ArithmeticAst {
    const token = this.peek();
    if (token?.kind === "ARITHMETIC" && token.operator === "SUBTRACT") {
      this.index += 1;
      return { kind: "UNARY_NEGATE", child: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ArithmeticAst {
    const token = this.peek();
    if (!token) {
      throw new OpsFoundationError("MALFORMED_EXPRESSION", "Expected an operand but reached the end of the expression.");
    }
    if (token.kind === "NUMBER") {
      this.index += 1;
      return { kind: "VALUE", value: token.value, source: token.source };
    }
    if (token.kind === "LPAREN") {
      this.index += 1;
      const expression = this.parseAdditive();
      const closing = this.peek();
      if (closing?.kind !== "RPAREN") {
        throw new OpsFoundationError("UNBALANCED_BRACKETS", "Opening bracket has no matching closing bracket.");
      }
      this.index += 1;
      return expression;
    }
    if (token.kind === "RPAREN") {
      throw new OpsFoundationError("UNBALANCED_BRACKETS", "Closing bracket has no matching opening bracket.");
    }
    if (token.kind === "RELATION") {
      throw new OpsFoundationError("INVALID_RELATION_STRUCTURE", "Relation token cannot appear where an arithmetic operand is required.");
    }
    throw new OpsFoundationError("MALFORMED_EXPRESSION", `Operator ${token.operator} cannot appear here.`);
  }

  private peek(): SemanticToken | undefined {
    return this.tokens[this.index];
  }
}

export function parseSemanticTokens(tokens: readonly SemanticToken[]): ParsedExpression {
  return new Parser(tokens).parse();
}

export function arithmeticAstFingerprint(ast: ArithmeticAst): string {
  if (ast.kind === "VALUE") return `V(${canonicalExactKey(ast.value)})`;
  if (ast.kind === "UNARY_NEGATE") return `NEG(${arithmeticAstFingerprint(ast.child)})`;
  return `${operatorFingerprint(ast.operator)}(${arithmeticAstFingerprint(ast.left)},${arithmeticAstFingerprint(ast.right)})`;
}

function operatorFingerprint(operator: ArithmeticOperator): string {
  return operator;
}

export function relationAstFingerprint(ast: RelationAst): string {
  return `${ast.operator}(${arithmeticAstFingerprint(ast.left)},${arithmeticAstFingerprint(ast.right)})`;
}

export function parsedExpressionFingerprint(parsed: ParsedExpression): string {
  return parsed.kind === "ARITHMETIC"
    ? `ARITH:${arithmeticAstFingerprint(parsed.ast)}`
    : `REL:${relationAstFingerprint(parsed.ast)}`;
}
