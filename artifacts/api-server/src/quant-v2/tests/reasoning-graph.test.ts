import assert from "node:assert/strict";
import test from "node:test";
import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import {
  PERCENTAGE_MOTIF_FACTORIES,
} from "../canonical/percentage-motif-factories";
import { substituteVariables } from "../reasoning/equation-utils";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import type {
  ReasoningGraph,
  ReasoningStep,
} from "../reasoning/reasoning-graph-types";
import { validateReasoningGraph } from "../validators/reasoning-validator";

const SHORTCUT_SUBTYPES = new Set([
  "election_margin",
  "pass_fail",
  "reverse_percentage",
  "restore_original",
  "price_consumption",
]);

const SEMANTIC_KEY_PATTERN = /^[a-z][a-z0-9_]*$/u;
const RENDERING_DELIMITER_PATTERN = /[<>\[\]`]/u;
const PROSE_MARKER_PATTERN =
  /\b(the|therefore|hence|because|find|calculate|student|question|answer is|correct answer)\b/iu;

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

function graphStrings(graph: ReasoningGraph) {
  return [
    graph.insightKey,
    graph.finalEquation,
    graph.shortcutEquation,
    graph.trapSummary,
    ...graph.branches.flatMap((branch) => [
      branch.branchId,
      branch.branchType,
      ...branch.steps.flatMap((step) => [
        step.id,
        step.descriptionKey,
        step.equation,
        step.explanationHint,
        step.trapWarning,
        step.outputVariable,
        ...step.inputVariables,
      ]),
    ]),
    ...graph.steps.flatMap((step) => [
      step.id,
      step.descriptionKey,
      step.equation,
      step.explanationHint,
      step.trapWarning,
      step.outputVariable,
      ...step.inputVariables,
    ]),
  ].filter((value): value is string => typeof value === "string");
}

function assertNoPresentationLayer(
  graph: ReasoningGraph,
  label: string,
) {
  for (const value of graphStrings(graph)) {
    assert.ok(
      !RENDERING_DELIMITER_PATTERN.test(value),
      `${label} contains rendering delimiter: ${value}`,
    );
  }

  for (const step of graph.steps) {
    assert.match(
      step.id,
      SEMANTIC_KEY_PATTERN,
      `${label} step id must be semantic`,
    );
    assert.match(
      step.descriptionKey,
      SEMANTIC_KEY_PATTERN,
      `${label} descriptionKey must be semantic`,
    );
    if (step.explanationHint) {
      assert.match(
        step.explanationHint,
        SEMANTIC_KEY_PATTERN,
        `${label} explanationHint must be semantic`,
      );
    }
    if (step.trapWarning) {
      assert.match(
        step.trapWarning,
        SEMANTIC_KEY_PATTERN,
        `${label} trapWarning must be semantic`,
      );
    }
  }

  for (const value of [
    graph.insightKey,
    graph.trapSummary,
  ]) {
    if (!value) {
      continue;
    }
    assert.ok(
      !PROSE_MARKER_PATTERN.test(value),
      `${label} contains prose marker: ${value}`,
    );
  }
}

function assertStepVariablesResolve(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  label: string,
) {
  const known = new Set([
    ...Object.keys(problem.variables),
    "answer",
  ]);
  const substitutionValues: Record<string, number> = {
    ...problem.variables,
    answer: problem.answer,
  };

  for (const step of graph.steps) {
    for (const input of step.inputVariables) {
      assert.ok(
        known.has(input),
        `${label} unresolved input ${input} in step ${step.id}`,
      );
    }

    if (step.equation) {
      substituteVariables(
        step.equation,
        substitutionValues,
      );
    }

    if (step.outputVariable) {
      known.add(step.outputVariable);
      substitutionValues[step.outputVariable] =
        problem.variables[step.outputVariable] ??
        problem.answer;
    }
  }

  if (graph.finalEquation) {
    substituteVariables(
      graph.finalEquation,
      substitutionValues,
    );
  }
  if (graph.shortcutEquation) {
    substituteVariables(
      graph.shortcutEquation,
      substitutionValues,
    );
  }
}

function assertFinalShape(
  graph: ReasoningGraph,
  label: string,
) {
  const finalStep: ReasoningStep | undefined =
    graph.steps.at(-1);

  assert.equal(
    finalStep?.type,
    "final_answer",
    `${label} must end with final_answer`,
  );
  assert.ok(
    graph.finalEquation,
    `${label} must include a finalEquation`,
  );
}

test("reasoning graphs build deterministically and validate for every golden motif", () => {
  for (const [name, factory] of Object.entries(PERCENTAGE_MOTIF_FACTORIES)) {
    for (let seed = 1; seed <= 100; seed += 1) {
      const problem = factory(seed);
      const graph = buildReasoningGraph(problem);
      const repeated = buildReasoningGraph(problem);
      const label = `${name} seed ${seed}`;

      assert.equal(
        stableJson(graph),
        stableJson(repeated),
        `${label} graph must be deterministic`,
      );

      const validation = validateReasoningGraph(
        problem,
        graph,
      );
      assert.equal(
        validation.valid,
        true,
        `${label} reasoning validation failed: ${validation.issues.join("; ")}`,
      );

      assertFinalShape(graph, label);
      assertStepVariablesResolve(
        problem,
        graph,
        label,
      );
      assertNoPresentationLayer(graph, label);

      if (
        !problem.topology &&
        SHORTCUT_SUBTYPES.has(problem.subtype)
      ) {
        assert.ok(
          graph.shortcutEquation,
          `${label} must include shortcutEquation`,
        );
      }
    }
  }
});

export {};
