import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { roundClean, sanitizeValue } from "../utils/math-utils";
import type { ValidationResult } from "./problem-validator";

function closeEnough(left: number, right: number, tolerance = 0.02) {
  return Math.abs(left - right) <= tolerance;
}

function expectedFinalIndex(problem: CanonicalPercentageProblem) {
  const v = problem.variables;
  const relationCount = Math.max(1, Math.trunc(v.relationCount ?? 1));
  let index = v.baseIndex ?? 100;

  for (let relationIndex = 1; relationIndex <= relationCount; relationIndex += 1) {
    const multiplier = v[`relation${relationIndex}Index`];
    if (typeof multiplier !== "number") {
      return undefined;
    }
    index = roundClean((index * multiplier) / 100, 2);
  }

  return index;
}

export function validateRelationalPercentage(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
): ValidationResult {
  const issues: string[] = [];

  if (problem.subtype !== "relational_percentage") {
    return {
      valid: true,
      issues,
    };
  }

  if (graph.reasoningPattern !== "relational_chain") {
    issues.push("Relational percentage graph must use relational_chain pattern.");
  }
  if (!problem.topology?.family || !problem.topology.variant) {
    issues.push("Relational percentage problem must carry topology metadata.");
  }
  if (!graph.steps.some((step) => step.type === "relation_normalization")) {
    issues.push("Relational graph is missing normalization step.");
  }
  if (!graph.steps.some((step) => step.type === "comparison_inference")) {
    issues.push("Relational graph is missing final comparison inference.");
  }

  const expectedIndex = expectedFinalIndex(problem);
  if (typeof expectedIndex !== "number") {
    issues.push("Relation multipliers are incomplete.");
  } else if (!closeEnough(expectedIndex, problem.variables.finalIndex)) {
    issues.push(
      `Final index mismatch: expected ${expectedIndex}, received ${problem.variables.finalIndex}.`,
    );
  } else {
    const expectedAnswer = sanitizeValue(expectedIndex - (problem.variables.baseIndex ?? 100));
    if (!closeEnough(expectedAnswer, problem.answer)) {
      issues.push(
        `Relation answer mismatch: expected ${expectedAnswer}, received ${problem.answer}.`,
      );
    }
  }

  const relationSteps = graph.steps.filter((step) =>
    step.type === "relation_transformation" ||
    step.type === "relation_inversion"
  );
  if (relationSteps.length !== Math.trunc(problem.variables.relationCount ?? 1)) {
    issues.push("Relation step count does not match canonical relationCount.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
