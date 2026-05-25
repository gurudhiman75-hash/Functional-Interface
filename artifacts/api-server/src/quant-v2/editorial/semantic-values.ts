import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { roundClean } from "../utils/math-utils";

export type PercentageDirection =
  | "increase"
  | "decrease"
  | "profit"
  | "loss"
  | "reduction"
  | "neutral"
  | "less"
  | "more";

export type SemanticValue =
  | {
      kind: "percentage";
      value: number;
      direction?: PercentageDirection;
    }
  | {
      kind: "absolute";
      value: number;
      label?: string;
    }
  | {
      kind: "count";
      value: number;
      label: string;
    }
  | {
      kind: "currency";
      value: number;
      label?: string;
    }
  | {
      kind: "ratio";
      value: number;
    };

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

export function formatSemanticValue(value: SemanticValue) {
  const absolute = Math.abs(value.value);

  if (value.kind === "percentage") {
    const direction =
      value.direction && value.direction !== "neutral"
        ? ` ${value.direction}`
        : "";
    return `${n(absolute)}%${direction}`;
  }

  return n(value.value);
}

export function semanticValueForLabel(
  label: string,
  value: number,
): SemanticValue {
  if (/(?:percentage|percent|share|rate)/iu.test(label)) {
    return {
      kind: "percentage",
      value,
    };
  }
  if (/required increase/iu.test(label)) {
    return {
      kind: "percentage",
      value,
      direction: "increase",
    };
  }
  if (/reduction in consumption|required reduction/iu.test(label)) {
    return {
      kind: "percentage",
      value,
      direction: "reduction",
    };
  }
  if (/loss percentage/iu.test(label)) {
    return {
      kind: "percentage",
      value,
      direction: "loss",
    };
  }
  if (/profit percentage/iu.test(label)) {
    return {
      kind: "percentage",
      value,
      direction: "neutral",
    };
  }
  if (/votes?|voters?/iu.test(label)) {
    return {
      kind: "count",
      value,
      label: "votes",
    };
  }
  if (/marks?|score/iu.test(label)) {
    return {
      kind: "count",
      value,
      label: "marks",
    };
  }
  if (/population|people/iu.test(label)) {
    return {
      kind: "count",
      value,
      label: "people",
    };
  }
  if (/salary|price|amount|cost|selling/iu.test(label)) {
    return {
      kind: "currency",
      value,
    };
  }

  return {
    kind: "absolute",
    value,
  };
}

export function semanticAnswerValue(
  problem: CanonicalPercentageProblem,
): SemanticValue {
  if (problem.variables.answerIsPercentage === 1) {
    return {
      kind: "percentage",
      value: Math.abs(problem.answer),
      direction: "neutral",
    };
  }

  switch (problem.subtype) {
    case "profit_loss":
      return {
        kind: "percentage",
        value: Math.abs(problem.answer),
        direction: problem.answer < 0 ? "loss" : "profit",
      };
    case "price_consumption":
      if (problem.variables.quantityDifference !== undefined) {
        return {
          kind: "absolute",
          value: problem.answer,
        };
      }
      return {
        kind: "percentage",
        value: Math.abs(problem.answer),
        direction: problem.answer < 0 ? "increase" : "reduction",
      };
    case "restore_original":
      return {
        kind: "percentage",
        value: Math.abs(problem.answer),
        direction: "neutral",
      };
    case "salary_revision":
      return {
        kind: "percentage",
        value: Math.abs(problem.answer),
        direction: problem.answer < 0 ? "decrease" : "increase",
      };
    case "relational_percentage":
      return {
        kind: "percentage",
        value: Math.abs(problem.answer),
        direction: problem.answer < 0 ? "less" : "more",
      };
    default:
      return {
        kind: "absolute",
        value: problem.answer,
      };
  }
}
