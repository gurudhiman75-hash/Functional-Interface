import { contextWords, normalizeContextLabel } from "./context-labels";

export interface CountConstraintInput {
  contextLabel: string;
  semanticUnit: string;
  knownRate: number;
  targetRate: number;
  targetQuantity: number;
}

export interface CountConstraintResult {
  decision: "ACCEPT" | "REJECT";
  policyId: string;
  normalizedLabel: string;
  discrete: boolean;
  roundedTarget: number;
  code?: string;
  reason?: string;
}

const DISCRETE_UNITS = new Set([
  "students",
  "workers",
  "families",
  "employees",
  "books",
  "trees",
  "animals",
  "items",
  "inventory",
  "people",
  "votes",
]);

const DISCRETE_CONTEXT_ROOTS = new Set([
  "student",
  "students",
  "worker",
  "workers",
  "family",
  "families",
  "employee",
  "employees",
  "book",
  "books",
  "tree",
  "trees",
  "animal",
  "animals",
  "item",
  "items",
  "inventory",
]);

const CONTINUOUS_CONTEXT_ROOTS = new Set([
  "population",
  "distance",
  "area",
  "marks",
  "weight",
  "volume",
  "length",
  "production",
]);

function isDiscreteContext(
  contextLabel: string,
  semanticUnit: string,
): boolean {
  const words = contextWords(contextLabel);
  if (words.some((word) => CONTINUOUS_CONTEXT_ROOTS.has(word))) {
    return false;
  }
  return (
    DISCRETE_UNITS.has(semanticUnit) ||
    words.some((word) => DISCRETE_CONTEXT_ROOTS.has(word))
  );
}

export function evaluateCountConstraints(
  input: CountConstraintInput,
): CountConstraintResult {
  const normalizedLabel = normalizeContextLabel(input.contextLabel);
  const discrete = isDiscreteContext(normalizedLabel, input.semanticUnit);
  const roundedTarget = Math.round(input.targetQuantity);

  if (!discrete) {
    return {
      decision: "ACCEPT",
      policyId: "CONTINUOUS_ENTITY",
      normalizedLabel,
      discrete: false,
      roundedTarget,
    };
  }

  if (input.knownRate > 100 || input.targetRate > 100) {
    return {
      decision: "REJECT",
      policyId: "BOUNDED_DISCRETE_COUNT",
      normalizedLabel,
      discrete: true,
      roundedTarget,
      code: "COUNT_PERCENT_OVER_100",
      reason:
        "A bounded discrete group cannot use percentages above 100% in this task kind.",
    };
  }

  if (roundedTarget === 0) {
    return {
      decision: "REJECT",
      policyId: "NON_ZERO_DISCRETE_RESULT",
      normalizedLabel,
      discrete: true,
      roundedTarget,
      code: "COUNT_ROUNDED_TO_ZERO",
      reason:
        "The discrete result would round to zero and erase the entity.",
    };
  }

  return {
    decision: "ACCEPT",
    policyId: "BOUNDED_DISCRETE_COUNT",
    normalizedLabel,
    discrete: true,
    roundedTarget,
  };
}

