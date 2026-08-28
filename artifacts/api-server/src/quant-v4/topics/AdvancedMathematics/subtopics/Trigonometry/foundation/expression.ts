import type { AngleMeasure, ExactTrigNumber, ExactTrigResult, TrigExpression, TrigFunction } from "./types";
import {
  addExact,
  divideExact,
  exactInteger,
  isUndefined,
  multiplyExact,
  negateExact,
  powerExact,
  subtractExact,
} from "./exact";
import { evaluateTrigExact } from "./standard-values";

export const expr = {
  constant(value: ExactTrigNumber): TrigExpression {
    return { kind: "CONST", value };
  },
  trig(fn: TrigFunction, angle: AngleMeasure): TrigExpression {
    return { kind: "TRIG", fn, angle };
  },
  add(...terms: TrigExpression[]): TrigExpression {
    return { kind: "ADD", terms };
  },
  subtract(left: TrigExpression, right: TrigExpression): TrigExpression {
    return { kind: "SUBTRACT", left, right };
  },
  multiply(...factors: TrigExpression[]): TrigExpression {
    return { kind: "MULTIPLY", factors };
  },
  divide(numerator: TrigExpression, denominator: TrigExpression): TrigExpression {
    return { kind: "DIVIDE", numerator, denominator };
  },
  power(base: TrigExpression, exponent: number): TrigExpression {
    return { kind: "POWER", base, exponent };
  },
  negate(operand: TrigExpression): TrigExpression {
    return { kind: "NEGATE", operand };
  },
};

export function evaluateTrigExpression(expression: TrigExpression): ExactTrigResult {
  switch (expression.kind) {
    case "CONST":
      return expression.value;

    case "TRIG":
      return evaluateTrigExact(expression.fn, expression.angle);

    case "ADD": {
      let result = exactInteger(0);
      for (const term of expression.terms) {
        const value = evaluateTrigExpression(term);
        if (isUndefined(value)) return value;
        result = addExact(result, value);
      }
      return result;
    }

    case "SUBTRACT": {
      const left = evaluateTrigExpression(expression.left);
      if (isUndefined(left)) return left;
      const right = evaluateTrigExpression(expression.right);
      if (isUndefined(right)) return right;
      return subtractExact(left, right);
    }

    case "MULTIPLY": {
      let result = exactInteger(1);
      for (const factor of expression.factors) {
        const value = evaluateTrigExpression(factor);
        if (isUndefined(value)) return value;
        result = multiplyExact(result, value);
      }
      return result;
    }

    case "DIVIDE": {
      const numerator = evaluateTrigExpression(expression.numerator);
      if (isUndefined(numerator)) return numerator;
      const denominator = evaluateTrigExpression(expression.denominator);
      if (isUndefined(denominator)) return denominator;
      return divideExact(numerator, denominator);
    }

    case "POWER": {
      const base = evaluateTrigExpression(expression.base);
      if (isUndefined(base)) return base;
      return powerExact(base, expression.exponent);
    }

    case "NEGATE": {
      const operand = evaluateTrigExpression(expression.operand);
      if (isUndefined(operand)) return operand;
      return negateExact(operand);
    }
  }
}
