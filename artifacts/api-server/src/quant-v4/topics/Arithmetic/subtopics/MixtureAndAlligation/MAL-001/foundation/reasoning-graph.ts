import { formatRational, toLatex } from "./rational";
import type {
  MalCp001PrototypeParameters,
  MalCp001SolveResult,
  MalReasoningGraph,
} from "./types";

export function buildMalCp001ReasoningGraph(
  parameters: MalCp001PrototypeParameters,
  solution: MalCp001SolveResult,
): MalReasoningGraph {
  const request = parameters.request;
  const nodes: MalReasoningGraph["nodes"] = [];

  nodes.push({
    id: "given-state",
    kind: "GIVEN",
    text: `Use the displayed component quantities and values for ${parameters.context.material}.`,
    dependsOn: [],
  });

  if (request.mode === "TWO_COMPONENT_RATIO_FROM_TARGET" && solution.kind === "COMPONENT_RATIO") {
    nodes.push({
      id: "target-relation",
      kind: "RELATION",
      text: "The target lies between the lower and higher source values.",
      mathLatex: `L=${toLatex(request.lowerValue)},\\ M=${toLatex(request.targetValue)},\\ H=${toLatex(request.higherValue)}`,
      dependsOn: ["given-state"],
    });
    nodes.push({
      id: "cross-differences",
      kind: "DERIVATION",
      text: "Take opposite differences and reduce them to the source-quantity ratio.",
      mathLatex: `q_L:q_H=${toLatex(solution.firstPart)}:${toLatex(solution.secondPart)}`,
      dependsOn: ["target-relation"],
    });
  } else {
    nodes.push({
      id: "weighted-equation",
      kind: "RELATION",
      text: "Write one weighted-conservation equation for the complete blend.",
      mathLatex: "\\sum q_i v_i=M\\sum q_i",
      dependsOn: ["given-state"],
    });
    nodes.push({
      id: "solve-unknown",
      kind: "DERIVATION",
      text: "Rearrange the exact equation for the requested mean, value or quantity.",
      dependsOn: ["weighted-equation"],
    });
  }

  nodes.push({
    id: "independent-check",
    kind: "VERIFICATION",
    text: "Reconstruct the final weighted total and verify that it equals target value × total quantity.",
    dependsOn: [nodes[nodes.length - 1].id],
  });

  const answerText = (() => {
    switch (solution.kind) {
      case "MEAN_VALUE":
      case "SOURCE_VALUE":
        return formatRational(solution.value);
      case "COMPONENT_QUANTITY":
        return formatRational(solution.quantity);
      case "COMPONENT_RATIO":
        return `${formatRational(solution.firstPart)}:${formatRational(solution.secondPart)}`;
      case "COMPONENT_QUANTITY_PAIR":
        return `${formatRational(solution.firstQuantity)}, ${formatRational(solution.secondQuantity)}`;
    }
  })();

  nodes.push({
    id: "conclusion",
    kind: "CONCLUSION",
    text: `Report the requested semantic answer: ${answerText}.`,
    dependsOn: ["independent-check"],
  });

  return { nodes };
}
