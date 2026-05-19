import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type {
  FilteringStage,
  MisconceptionDistractor,
} from "../reasoning/topology-types";
import { topologyIsSupported } from "../reasoning/topology-registry";
import { roundClean, safeDivide } from "../utils/math-utils";
import type { ValidationResult } from "./problem-validator";

function closeEnough(left: number, right: number, tolerance = 0.02) {
  return Math.abs(left - right) <= tolerance;
}

function addIssue(issues: string[], message: string) {
  issues.push(message);
}

function values(
  problem: CanonicalPercentageProblem,
): Record<string, number> {
  return {
    ...problem.variables,
    answer: problem.answer,
  };
}

function valueOf(
  variables: Record<string, number>,
  key: string | undefined,
) {
  if (!key) {
    return undefined;
  }

  return variables[key];
}

function evaluateStage(
  stage: FilteringStage,
  variables: Record<string, number>,
) {
  const input = valueOf(variables, stage.inputVariable);
  if (typeof input !== "number") {
    return undefined;
  }

  if (
    stage.kind === "percentage_filter" ||
    stage.kind === "remaining_percentage" ||
    stage.kind === "direct_component"
  ) {
    const percent = valueOf(variables, stage.percentVariable);
    return typeof percent === "number"
      ? roundClean((input * percent) / 100, 2)
      : undefined;
  }

  if (stage.kind === "subtract_component") {
    const amount = valueOf(variables, stage.amountVariable);
    return typeof amount === "number"
      ? roundClean(input - amount, 2)
      : undefined;
  }

  const numerator = valueOf(variables, stage.numeratorVariable);
  const denominator = valueOf(variables, stage.denominatorVariable);
  if (
    typeof numerator === "number" &&
    typeof denominator === "number"
  ) {
    return safeDivide(input * numerator, denominator);
  }

  return undefined;
}

function validateFilteringChain(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const chain = problem.topology?.filteringChain;
  if (!chain) {
    return;
  }

  if (chain.stages.length === 0) {
    addIssue(issues, "Filtering chain must contain at least one stage.");
    return;
  }

  const variables = values(problem);
  let expectedInput = chain.baseVariable;

  for (const stage of chain.stages) {
    if (stage.inputVariable !== expectedInput) {
      addIssue(
        issues,
        `Filtering continuity failed at ${stage.stageId}: expected input ${expectedInput}, received ${stage.inputVariable}.`,
      );
    }

    const expected = evaluateStage(stage, variables);
    const actual = valueOf(variables, stage.outputVariable);
    if (
      typeof expected === "number" &&
      typeof actual === "number" &&
      !closeEnough(expected, actual)
    ) {
      addIssue(
        issues,
        `Filtering stage ${stage.stageId} expected ${stage.outputVariable}=${expected}, received ${actual}.`,
      );
    }

    expectedInput = stage.outputVariable;
  }

  if (expectedInput !== chain.targetVariable) {
    addIssue(
      issues,
      `Filtering chain must end at ${chain.targetVariable}, received ${expectedInput}.`,
    );
  }
}

function validateHiddenBase(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const relation = problem.topology?.hiddenBase;
  if (!relation) {
    return;
  }

  const variables = values(problem);
  const base = valueOf(variables, relation.baseVariable);
  const known = valueOf(variables, relation.knownVariable);
  const percent = valueOf(variables, relation.percentVariable);

  if (
    typeof base !== "number" ||
    typeof known !== "number" ||
    typeof percent !== "number"
  ) {
    addIssue(
      issues,
      `Hidden base relation has missing variables: ${relation.baseVariable}, ${relation.knownVariable}, ${relation.percentVariable}.`,
    );
    return;
  }

  const expectedKnown = roundClean((base * percent) / 100, 2);
  if (!closeEnough(expectedKnown, known)) {
    addIssue(
      issues,
      `Hidden base relation expected ${relation.knownVariable}=${expectedKnown}, received ${known}.`,
    );
  }
}

function validateConservation(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const groups = problem.topology?.conservationGroups ?? [];
  const variables = values(problem);

  for (const group of groups) {
    const total = group.partVariables.reduce((sum, key) => {
      const value = variables[key];
      return sum + (typeof value === "number" ? value : Number.NaN);
    }, 0);

    if (!Number.isFinite(total)) {
      addIssue(
        issues,
        `Percentage conservation group ${group.groupId} has missing parts.`,
      );
    } else if (!closeEnough(total, group.totalPercent)) {
      addIssue(
        issues,
        `Percentage conservation group ${group.groupId} totals ${total}, expected ${group.totalPercent}.`,
      );
    }
  }
}

function validateRemainingComponent(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const relation = problem.topology?.remainingComponent;
  if (!relation) {
    return;
  }

  const variables = values(problem);
  const knownTotal = relation.knownPercentVariables.reduce(
    (sum, key) => sum + (variables[key] ?? Number.NaN),
    0,
  );
  const remaining = variables[relation.remainingVariable];

  if (
    !Number.isFinite(knownTotal) ||
    typeof remaining !== "number"
  ) {
    addIssue(issues, "Remaining component relation has missing variables.");
    return;
  }

  const expected = roundClean(relation.totalPercent - knownTotal, 2);
  if (!closeEnough(expected, remaining)) {
    addIssue(
      issues,
      `Remaining component ${relation.remainingVariable} expected ${expected}, received ${remaining}.`,
    );
  }
}

function validateMultiEntity(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const relation = problem.topology?.multiEntity;
  if (!relation) {
    return;
  }

  const variables = values(problem);
  const total = variables[relation.totalVariable];
  const componentTotal = relation.componentVariables.reduce(
    (sum, key) => sum + (variables[key] ?? Number.NaN),
    0,
  );

  if (
    typeof total !== "number" ||
    !Number.isFinite(componentTotal)
  ) {
    addIssue(issues, "Multi-entity relation has missing variables.");
    return;
  }

  if (!closeEnough(total, componentTotal)) {
    addIssue(
      issues,
      `Multi-entity relation expected components to total ${total}, received ${componentTotal}.`,
    );
  }
}

function validateBranches(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  issues: string[],
) {
  const variables = values(problem);

  for (const branch of graph.branches) {
    const final = branch.steps.at(-1);
    const outputInputs =
      final?.inputVariables.filter((input) => input !== "answer") ?? [];
    const hasAnswerEquivalentOutput = outputInputs.some((input) =>
      closeEnough(variables[input] ?? Number.NaN, problem.answer),
    );

    if (!hasAnswerEquivalentOutput) {
      addIssue(
        issues,
        `Branch ${branch.branchId} does not expose an answer-equivalent final output.`,
      );
    }
  }
}

function validateMisconceptionDistractors(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const misconceptionDistractors =
    problem.topology?.misconceptionDistractors ?? [];

  if (misconceptionDistractors.length < 3) {
    addIssue(
      issues,
      "Topology must declare at least three misconception distractors.",
    );
    return;
  }

  const matched = misconceptionDistractors.filter(
    (candidate: MisconceptionDistractor) =>
      problem.distractors.some((distractor) =>
        closeEnough(distractor, candidate.value),
      ),
  );

  if (matched.length < 2) {
    addIssue(
      issues,
      "Distractors are not sufficiently grounded in topology misconceptions.",
    );
  }
}

export function validateTopology(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
): ValidationResult {
  const issues: string[] = [];
  const topology = problem.topology;

  if (!topology) {
    addIssue(issues, "Problem is missing topology metadata.");
    return {
      valid: false,
      issues,
    };
  }

  if (!topologyIsSupported(problem.subtype, topology.variant)) {
    addIssue(
      issues,
      `Topology variant ${topology.variant} is not registered for subtype ${problem.subtype}.`,
    );
  }

  if (graph.subtype !== problem.subtype) {
    addIssue(issues, "Topology graph subtype does not match problem subtype.");
  }

  validateFilteringChain(problem, issues);
  validateHiddenBase(problem, issues);
  validateConservation(problem, issues);
  validateRemainingComponent(problem, issues);
  validateMultiEntity(problem, issues);
  validateBranches(problem, graph, issues);
  validateMisconceptionDistractors(problem, issues);

  return {
    valid: issues.length === 0,
    issues,
  };
}
