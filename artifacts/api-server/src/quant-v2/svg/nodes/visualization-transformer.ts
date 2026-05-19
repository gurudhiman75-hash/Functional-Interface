import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { LanguageCode } from "../../localization/contracts/language-contracts";
import type {
  ReasoningGraph,
  ReasoningStep,
} from "../../reasoning/reasoning-graph-types";
import { substituteVariables } from "../../reasoning/equation-utils";
import { roundClean } from "../../utils/math-utils";
import { createProblemSignature } from "../../utils/problem-signature";
import type {
  SvgEmphasis,
  SvgPedagogyEdge,
  SvgPedagogyGraph,
  SvgPedagogyNode,
  SvgVisualizationNodeType,
} from "../contracts/svg-visualization-types";
import {
  defaultNodeKey,
  svgLabel,
  titleKeyForCategory,
} from "./svg-labels";

function cleanNumber(value: number) {
  const rounded = roundClean(value, 4);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function variables(problem: CanonicalPercentageProblem) {
  return {
    ...problem.variables,
    answer: problem.answer,
  };
}

function equationForStep(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
) {
  if (!step.equation) {
    return undefined;
  }

  try {
    const scopedVariables = variables(problem);
    const braced = substituteVariables(step.equation, scopedVariables);
    return braced
      .replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/gu, (token) =>
        typeof scopedVariables[token] === "number"
          ? cleanNumber(scopedVariables[token]!)
          : token,
      )
      .replace(/=>/gu, "=")
      .replace(/\*/gu, "×");
  } catch {
    const scopedVariables = variables(problem);
    return step.equation
      .replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/gu, (token) =>
        typeof scopedVariables[token] === "number"
          ? cleanNumber(scopedVariables[token]!)
          : token,
      )
      .replace(/=>/gu, "=")
      .replace(/\*/gu, "×");
  }
}

function nodeTypeForStep(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
): SvgVisualizationNodeType {
  if (
    step.type === "subtract_invalid_component" ||
    step.type === "filter_subset"
  ) {
    return "vote_filter_node";
  }
  if (step.type === "reconstruct_component") {
    return problem.topology?.hiddenBase
      ? "hidden_base_node"
      : "reverse_percentage_node";
  }
  if (step.type === "population_projection") {
    return "population_projection_node";
  }
  if (step.type === "mixture_balance") {
    return "mixture_balance_node";
  }
  if (
    step.descriptionKey.includes("pass") ||
    step.descriptionKey.includes("marks") ||
    problem.subtype === "pass_fail"
  ) {
    return "pass_fail_gap_node";
  }
  if (step.type === "reverse_calculation") {
    return "reverse_percentage_node";
  }
  if (step.type === "aggregate_components") {
    return "component_aggregation_node";
  }
  if (step.type === "apply_multiplier") {
    return "base_change_node";
  }
  return "percentage_mapping_node";
}

function semanticKeyForStep(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
  type: SvgVisualizationNodeType,
) {
  if (problem.subtype === "election_margin") {
    if (step.descriptionKey.includes("valid")) {
      return "svg.node.valid_votes";
    }
    if (step.descriptionKey.includes("total")) {
      return "svg.node.total_votes";
    }
    if (step.descriptionKey.includes("gap") || step.descriptionKey.includes("margin")) {
      return "svg.node.vote_margin";
    }
  }
  if (problem.subtype === "pass_fail") {
    if (step.descriptionKey.includes("total") || step.descriptionKey.includes("maximum")) {
      return "svg.node.maximum_marks";
    }
    return "svg.node.pass_gap";
  }
  return defaultNodeKey(type);
}

function emphasisForStep(
  problem: CanonicalPercentageProblem,
  step: ReasoningStep,
  type: SvgVisualizationNodeType,
): SvgEmphasis {
  if (type === "hidden_base_node" || problem.topology?.hiddenBase) {
    return "hidden_base";
  }
  if (
    step.type === "map_percentage_to_value" ||
    step.type === "reverse_calculation" ||
    step.type === "reconstruct_component"
  ) {
    return "final_derivation";
  }
  return "standard";
}

function answerText(problem: CanonicalPercentageProblem) {
  if (problem.subtype === "profit_loss") {
    return problem.answer < 0
      ? `${cleanNumber(Math.abs(problem.answer))}% loss`
      : `${cleanNumber(problem.answer)}% profit`;
  }
  if (problem.subtype === "salary_revision") {
    return problem.answer < 0
      ? `${cleanNumber(Math.abs(problem.answer))}% decrease`
      : `${cleanNumber(problem.answer)}% increase`;
  }
  if (
    problem.subtype === "restore_original" ||
    problem.subtype === "price_consumption"
  ) {
    return `${cleanNumber(Math.abs(problem.answer))}%`;
  }
  return cleanNumber(problem.answer);
}

export function buildSvgPedagogyGraph(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  language?: LanguageCode;
}): SvgPedagogyGraph {
  const language = input.language ?? "en";
  const nodes: SvgPedagogyNode[] = [];

  if (input.graph.shortcutEquation) {
    const equation = input.graph.shortcutEquation
      .replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/gu, (_, key: string) =>
        typeof variables(input.problem)[key] === "number"
          ? cleanNumber(variables(input.problem)[key]!)
          : key,
      )
      .replace(/\*/gu, "×");
    nodes.push({
      id: "shortcut",
      type: "shortcut_node",
      semanticLabelKey: "svg.node.shortcut",
      label: svgLabel(language, "svg.node.shortcut"),
      equation,
      emphasis: "shortcut",
    });
  }

  input.graph.steps
    .filter((step) => step.type !== "final_answer")
    .filter((step) => !step.descriptionKey.startsWith("convert_"))
    .forEach((step, index) => {
      const type = nodeTypeForStep(input.problem, step);
      const semanticLabelKey = semanticKeyForStep(input.problem, step, type);
      nodes.push({
        id: `step_${index + 1}_${step.id}`,
        type,
        sourceStepId: step.id,
        sourceStepType: step.type,
        semanticLabelKey,
        label: svgLabel(language, semanticLabelKey),
        equation: equationForStep(input.problem, step),
        emphasis: emphasisForStep(input.problem, step, type),
      });
    });

  nodes.push({
    id: "answer",
    type: "answer_confirmation_node",
    semanticLabelKey: "svg.node.answer",
    label: svgLabel(language, "svg.node.answer"),
    equation: answerText(input.problem),
    emphasis: "answer",
  });

  const edges: SvgPedagogyEdge[] = nodes.slice(0, -1).map((node, index) => {
    const next = nodes[index + 1]!;
    return {
      from: node.id,
      to: next.id,
      relation: node.type === "vote_filter_node" ? "filter" : next.type === "answer_confirmation_node" ? "confirm" : "next",
    };
  });

  return {
    id: createProblemSignature(input.problem),
    language,
    subtype: input.problem.subtype,
    category: input.problem.category,
    difficulty: input.problem.difficulty,
    title: svgLabel(language, titleKeyForCategory(input.problem.category)),
    nodes,
    edges,
    metadata: {
      topologyFamily: input.problem.topology?.family,
      topologyVariant: input.problem.topology?.variant,
      branchCount: input.graph.branches.length,
      shortcutAvailable: Boolean(input.graph.shortcutEquation),
    },
  };
}
