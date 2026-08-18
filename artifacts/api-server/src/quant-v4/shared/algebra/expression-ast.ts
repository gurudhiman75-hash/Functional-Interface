import {
  absRational,
  addRational,
  divideRational,
  multiplyRational,
  negateRational,
  powRational,
  rational,
  type Rational,
} from "./rational";

export type AlgebraExpr =
  | { kind: "CONST"; value: Rational }
  | { kind: "VAR"; name: string }
  | { kind: "ADD"; terms: AlgebraExpr[] }
  | { kind: "MUL"; factors: AlgebraExpr[] }
  | { kind: "POW"; base: AlgebraExpr; exponent: number }
  | { kind: "NEG"; value: AlgebraExpr }
  | { kind: "DIV"; numerator: AlgebraExpr; denominator: AlgebraExpr }
  | { kind: "ABS"; value: AlgebraExpr };

export type VariableAssignment = Readonly<Record<string, Rational>>;

export function evaluateExpression(expr: AlgebraExpr, variables: VariableAssignment): Rational {
  switch (expr.kind) {
    case "CONST":
      return expr.value;
    case "VAR": {
      const value = variables[expr.name];
      if (!value) throw new Error(`Missing value for variable ${expr.name}`);
      return value;
    }
    case "ADD":
      return expr.terms.reduce((acc, term) => addRational(acc, evaluateExpression(term, variables)), rational(0n));
    case "MUL":
      return expr.factors.reduce((acc, factor) => multiplyRational(acc, evaluateExpression(factor, variables)), rational(1n));
    case "POW":
      return powRational(evaluateExpression(expr.base, variables), expr.exponent);
    case "NEG":
      return negateRational(evaluateExpression(expr.value, variables));
    case "DIV":
      return divideRational(evaluateExpression(expr.numerator, variables), evaluateExpression(expr.denominator, variables));
    case "ABS":
      return absRational(evaluateExpression(expr.value, variables));
  }
}
