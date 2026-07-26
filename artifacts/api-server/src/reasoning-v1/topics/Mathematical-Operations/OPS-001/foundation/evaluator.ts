import {
  addExact,
  compareExact,
  divideExact,
  multiplyExact,
  negateExact,
  subtractExact,
} from "./exact-rational";
import {
  type ArithmeticAst,
  type EvaluationResult,
  type ExactRational,
  type ParsedExpression,
  type RelationAst,
} from "./types";

export function evaluateArithmeticAst(ast: ArithmeticAst): ExactRational {
  if (ast.kind === "VALUE") return ast.value;
  if (ast.kind === "UNARY_NEGATE") return negateExact(evaluateArithmeticAst(ast.child));

  const left = evaluateArithmeticAst(ast.left);
  const right = evaluateArithmeticAst(ast.right);
  switch (ast.operator) {
    case "ADD": return addExact(left, right);
    case "SUBTRACT": return subtractExact(left, right);
    case "MULTIPLY": return multiplyExact(left, right);
    case "DIVIDE": return divideExact(left, right);
  }
}

export function evaluateRelationAst(ast: RelationAst): boolean {
  const comparison = compareExact(evaluateArithmeticAst(ast.left), evaluateArithmeticAst(ast.right));
  switch (ast.operator) {
    case "EQUAL": return comparison === 0;
    case "LESS_THAN": return comparison < 0;
    case "GREATER_THAN": return comparison > 0;
  }
}

export function evaluateParsedExpression(parsed: ParsedExpression): EvaluationResult {
  if (parsed.kind === "ARITHMETIC") {
    return { parsed, arithmeticValue: evaluateArithmeticAst(parsed.ast) };
  }
  return { parsed, relationValue: evaluateRelationAst(parsed.ast) };
}
