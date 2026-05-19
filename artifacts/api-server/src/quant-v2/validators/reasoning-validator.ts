import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import { sanitizeEquation } from "../reasoning/equation-utils";
import type {
  ReasoningGraph,
  ReasoningBranch,
  ReasoningStep,
} from "../reasoning/reasoning-graph-types";
import type { ValidationResult } from "./problem-validator";

const SEMANTIC_KEY_PATTERN = /^[a-z][a-z0-9_]*$/u;
const VARIABLE_PATTERN = /\b[A-Za-z_][A-Za-z0-9_]*\b/gu;
const PLACEHOLDER_PATTERN = /\{([A-Za-z_][A-Za-z0-9_]*)\}/gu;
const NUMERIC_WORDS = new Set([
  "e",
]);

function addIssue(issues: string[], message: string) {
  issues.push(message);
}

function equationReferences(
  equation: string,
  outputVariable?: string,
) {
  const refs = new Set<string>();
  const normalized = sanitizeEquation(equation);
  const [left, ...rightParts] = normalized.split("=");
  const right =
    rightParts.length > 0
      ? rightParts.join("=")
      : normalized;

  for (const match of right.matchAll(PLACEHOLDER_PATTERN)) {
    refs.add(match[1]!);
  }

  const withoutPlaceholders = right.replace(
    PLACEHOLDER_PATTERN,
    " ",
  );

  for (const match of withoutPlaceholders.matchAll(VARIABLE_PATTERN)) {
    const token = match[0];
    if (
      token !== outputVariable &&
      !NUMERIC_WORDS.has(token)
    ) {
      refs.add(token);
    }
  }

  if (!outputVariable && left) {
    for (const match of left.matchAll(PLACEHOLDER_PATTERN)) {
      refs.add(match[1]!);
    }
  }

  return refs;
}

function containsReference(
  equation: string | undefined,
  variable: string,
) {
  if (!equation) {
    return false;
  }

  return equationReferences(equation).has(variable);
}

function validateSemanticKey(
  value: string | undefined,
  label: string,
  issues: string[],
) {
  if (!value) {
    return;
  }
  if (!SEMANTIC_KEY_PATTERN.test(value)) {
    addIssue(
      issues,
      `${label} must be a semantic snake_case identifier: ${value}.`,
    );
  }
}

function validateEquation(
  equation: string | undefined,
  issues: string[],
  label: string,
) {
  if (!equation) {
    return;
  }

  try {
    sanitizeEquation(equation);
  } catch (error) {
    addIssue(
      issues,
      `${label} is invalid: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }
}

function validateStepReferences(
  step: ReasoningStep,
  knownAtStep: Set<string>,
  issues: string[],
) {
  for (const input of step.inputVariables) {
    if (!knownAtStep.has(input)) {
      addIssue(
        issues,
        `Step ${step.id} references unknown input variable: ${input}.`,
      );
    }
  }

  if (!step.equation) {
    return;
  }

  try {
    for (const ref of equationReferences(
      step.equation,
      step.outputVariable,
    )) {
      if (!knownAtStep.has(ref)) {
        addIssue(
          issues,
          `Step ${step.id} equation references unknown variable: ${ref}.`,
        );
      }
    }
  } catch {
    // The equation syntax issue is reported by validateEquation.
  }
}

function outputIsConsumedLater(
  graph: ReasoningGraph,
  output: string,
  stepIndex: number,
) {
  const laterSteps = graph.steps.slice(stepIndex + 1);

  return (
    laterSteps.some((step) =>
      step.inputVariables.includes(output) ||
      containsReference(step.equation, output),
    ) ||
    containsReference(graph.finalEquation, output) ||
    containsReference(graph.shortcutEquation, output)
  );
}

function validateFinalEquation(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  knownVariables: Set<string>,
  issues: string[],
) {
  if (!graph.finalEquation) {
    addIssue(issues, "Graph finalEquation is missing.");
    return;
  }

  validateEquation(
    graph.finalEquation,
    issues,
    "Graph finalEquation",
  );

  let refs: Set<string>;
  try {
    refs = equationReferences(graph.finalEquation);
  } catch {
    return;
  }

  if (!graph.finalEquation.includes("answer")) {
    addIssue(
      issues,
      "Graph finalEquation must reference answer.",
    );
  }

  for (const ref of refs) {
    if (!knownVariables.has(ref)) {
      addIssue(
        issues,
        `Graph finalEquation references unknown variable: ${ref}.`,
      );
    }
  }

  if (
    !refs.has("answer") &&
    !Object.keys(problem.variables).some((key) =>
      refs.has(key),
    )
  ) {
    addIssue(
      issues,
      "Graph finalEquation must reference the canonical answer or a canonical variable.",
    );
  }
}

function validateBranch(
  branch: ReasoningBranch,
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  validateSemanticKey(
    branch.branchId,
    `Branch id ${branch.branchId}`,
    issues,
  );

  if (branch.steps.length === 0) {
    addIssue(issues, `Branch ${branch.branchId} must contain steps.`);
    return;
  }

  const known = new Set([
    ...Object.keys(problem.variables),
    "answer",
  ]);
  const stepIds = new Set<string>();
  const outputVariables = new Set<string>();

  branch.steps.forEach((step, index) => {
    if (stepIds.has(step.id)) {
      addIssue(
        issues,
        `Branch ${branch.branchId} has duplicate step id: ${step.id}.`,
      );
    }
    stepIds.add(step.id);

    validateSemanticKey(
      step.id,
      `Branch ${branch.branchId} step id ${step.id}`,
      issues,
    );
    validateSemanticKey(
      step.descriptionKey,
      `Branch ${branch.branchId} step ${step.id} descriptionKey`,
      issues,
    );
    validateSemanticKey(
      step.trapWarning,
      `Branch ${branch.branchId} step ${step.id} trapWarning`,
      issues,
    );

    const isFinal = step.type === "final_answer";
    if (!isFinal && !step.outputVariable) {
      addIssue(
        issues,
        `Branch ${branch.branchId} step ${step.id} must declare an outputVariable.`,
      );
    }
    if (isFinal && index !== branch.steps.length - 1) {
      addIssue(
        issues,
        `Branch ${branch.branchId} final step ${step.id} must be last.`,
      );
    }
    if (!isFinal && step.outputVariable) {
      if (outputVariables.has(step.outputVariable)) {
        addIssue(
          issues,
          `Branch ${branch.branchId} has duplicate output variable: ${step.outputVariable}.`,
        );
      }
      outputVariables.add(step.outputVariable);
    }

    validateEquation(
      step.equation,
      issues,
      `Branch ${branch.branchId} step ${step.id} equation`,
    );
    validateStepReferences(step, known, issues);

    if (step.outputVariable) {
      known.add(step.outputVariable);
    }
  });

  const final = branch.steps.at(-1);
  if (!final || final.type !== "final_answer") {
    addIssue(
      issues,
      `Branch ${branch.branchId} must end with a final_answer step.`,
    );
  }

  const finalInputs = new Set(final?.inputVariables ?? []);
  if (!finalInputs.has("answer")) {
    addIssue(
      issues,
      `Branch ${branch.branchId} final step must consume answer for consistency.`,
    );
  }
}

export function validateReasoningGraph(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
): ValidationResult {
  const issues: string[] = [];

  if (graph.subtype !== problem.subtype) {
    addIssue(
      issues,
      `Graph subtype mismatch: ${graph.subtype} !== ${problem.subtype}.`,
    );
  }
  if (graph.reasoningPattern !== problem.reasoningPattern) {
    addIssue(
      issues,
      `Graph reasoning pattern mismatch: ${graph.reasoningPattern} !== ${problem.reasoningPattern}.`,
    );
  }

  validateSemanticKey(
    graph.insightKey,
    "Graph insightKey",
    issues,
  );

  if (graph.steps.length === 0) {
    addIssue(issues, "Graph must contain reasoning steps.");
  }

  if (graph.branches.length === 0) {
    addIssue(issues, "Graph must contain at least one reasoning branch.");
  }

  const branchIds = new Set<string>();
  for (const branch of graph.branches) {
    if (branchIds.has(branch.branchId)) {
      addIssue(
        issues,
        `Duplicate reasoning branch id: ${branch.branchId}.`,
      );
    }
    branchIds.add(branch.branchId);
    validateBranch(branch, problem, issues);
  }

  if (!graph.branches.some((branch) => branch.branchType === "standard")) {
    addIssue(issues, "Graph must include a standard reasoning branch.");
  }

  const stepIds = new Set<string>();
  const outputVariables = new Set<string>();
  const knownAtEnd = new Set([
    ...Object.keys(problem.variables),
    "answer",
  ]);

  graph.steps.forEach((step, index) => {
    if (stepIds.has(step.id)) {
      addIssue(
        issues,
        `Duplicate reasoning step id: ${step.id}.`,
      );
    }
    stepIds.add(step.id);

    validateSemanticKey(
      step.id,
      `Step id ${step.id}`,
      issues,
    );
    validateSemanticKey(
      step.descriptionKey,
      `Step ${step.id} descriptionKey`,
      issues,
    );
    validateSemanticKey(
      step.explanationHint,
      `Step ${step.id} explanationHint`,
      issues,
    );
    validateSemanticKey(
      step.trapWarning,
      `Step ${step.id} trapWarning`,
      issues,
    );

    const isFinal = step.type === "final_answer";
    if (!isFinal && !step.outputVariable) {
      addIssue(
        issues,
        `Step ${step.id} must declare an outputVariable.`,
      );
    }
    if (isFinal && index !== graph.steps.length - 1) {
      addIssue(
        issues,
        `Final step ${step.id} must be the last step.`,
      );
    }
    if (!isFinal && step.outputVariable) {
      if (outputVariables.has(step.outputVariable)) {
        addIssue(
          issues,
          `Duplicate output variable: ${step.outputVariable}.`,
        );
      }
      outputVariables.add(step.outputVariable);
    }

    validateEquation(
      step.equation,
      issues,
      `Step ${step.id} equation`,
    );
    validateStepReferences(step, knownAtEnd, issues);

    if (step.outputVariable) {
      knownAtEnd.add(step.outputVariable);
    }
  });

  const finalStep = graph.steps.at(-1);
  if (!finalStep || finalStep.type !== "final_answer") {
    addIssue(issues, "Graph must end with a final_answer step.");
  }

  validateFinalEquation(
    problem,
    graph,
    knownAtEnd,
    issues,
  );

  validateEquation(
    graph.shortcutEquation,
    issues,
    "Graph shortcutEquation",
  );
  if (graph.shortcutEquation) {
    try {
      for (const ref of equationReferences(
        graph.shortcutEquation,
      )) {
        if (!knownAtEnd.has(ref)) {
          addIssue(
            issues,
            `Graph shortcutEquation references unknown variable: ${ref}.`,
          );
        }
      }
    } catch {
      // The equation syntax issue is reported by validateEquation.
    }
  }

  if (graph.trapSummary) {
    for (const trap of graph.trapSummary.split("|")) {
      validateSemanticKey(
        trap,
        "Graph trapSummary entry",
        issues,
      );
    }
  }

  graph.steps.forEach((step, index) => {
    if (
      step.type !== "final_answer" &&
      step.outputVariable &&
      !outputIsConsumedLater(
        graph,
        step.outputVariable,
        index,
      )
    ) {
      addIssue(
        issues,
        `Output variable is orphaned: ${step.outputVariable}.`,
      );
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}
