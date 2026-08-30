import { formatRational } from "./math";
import { formatPrt001Money } from "./parameter-generator";
import type {
  Prt001PilotParameters,
  Prt001ReasoningGraph,
  Prt001ReasoningNode,
  Prt001Solution,
  Prt001TaskAnswer,
} from "./types";

export function buildPrt001ReasoningGraph(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): Prt001ReasoningGraph {
  const nodes: Prt001ReasoningNode[] = [
    {
      id: "given-state",
      kind: "GIVEN",
      label: "Partnership state",
      value: `${input.parameters.state.partners.length} partners over ${formatRational(input.parameters.state.totalDuration)} months`,
    },
    {
      id: "timeline",
      kind: "TIMELINE",
      label: "Capital timeline",
      value: input.parameters.state.partners
        .map(
          (partner) => `${partner.partnerId}:${partner.capitalSegments.length}`,
        )
        .join(","),
    },
    {
      id: "weights",
      kind: "WEIGHT",
      label: "Effective capital weights",
      value: input.solution.timeline.weights
        .map(
          (item) =>
            `${item.partnerId}=${formatRational(item.effectiveCapital)}`,
        )
        .join(","),
    },
  ];
  const edges: { from: string; to: string }[] = [
    { from: "given-state", to: "timeline" },
    { from: "timeline", to: "weights" },
  ];
  let previous = "weights";
  if (input.solution.pool.executions.length > 0) {
    nodes.push({
      id: "allocations",
      kind: "ALLOCATION",
      label: "Ordered pre-distribution allocations",
      value: input.solution.pool.executions
        .map(
          (item) =>
            `${item.sequence}:${item.kind}:${formatPrt001Money(item.amount)}`,
        )
        .join(","),
    });
    edges.push({ from: previous, to: "allocations" });
    previous = "allocations";
  }
  nodes.push({
    id: "distribution",
    kind: "DISTRIBUTION",
    label: "Distributable pool and ratio",
    value: `${formatPrt001Money(input.solution.pool.distributablePool)} @ ${input.solution.normalizedRatio.join(":")}`,
  });
  edges.push({ from: previous, to: "distribution" });
  nodes.push({
    id: "answer",
    kind: "ANSWER",
    label: input.parameters.entry.solveMode,
    value: input.answer.display,
  });
  edges.push({ from: "distribution", to: "answer" });
  return { nodes, edges };
}
