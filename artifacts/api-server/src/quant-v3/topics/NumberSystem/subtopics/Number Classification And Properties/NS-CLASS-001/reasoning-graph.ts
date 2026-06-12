import type { NsClass001Parameters, NsClass001ReasoningGraph, NsClass001SolverResult } from "./types";

const NODE_IDS = {
  CP01: ["captureInputs", "classifyParity", "applyParityRules", "extractAnswer"],
  CP02: ["captureExpression", "identifySigns", "applySignRules", "extractAnswer"],
  CP03: ["identifySequenceType", "generateTerms", "applyConsecutiveProperty", "extractAnswer"],
  CP04: ["captureRangeOrList", "identifyPropertyFilter", "countValidIntegers", "extractAnswer"],
  CP05: ["captureConditions", "deriveProperties", "combineClassifications", "extractAnswer"],
  CP06: ["captureConditions", "generateCandidates", "evaluateCandidates", "selectUniqueAnswer"],
} as const;

export function buildNsClass001ReasoningGraph(parameters: NsClass001Parameters, solver: NsClass001SolverResult): NsClass001ReasoningGraph {
  const ids = NODE_IDS[parameters.canonicalProblemId];
  const nodes = ids.map((id, index) => ({
    id,
    inputs: index === 0 ? { questionLanguageId: parameters.questionLanguageId, coverageBucket: parameters.coverageBucket } : { previousNode: ids[index - 1] },
    outputs: id === "extractAnswer" || id === "selectUniqueAnswer" ? { answer: solver.answer } : { status: "complete" },
  }));
  const edges = ids.slice(1).map((id, index) => ({ from: ids[index], to: id, relationship: "supports" }));
  return {
    graphId: `NS-CLASS-001:${parameters.canonicalProblemId}:${parameters.questionId}`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes,
    edges,
    answerNodeId: ids[ids.length - 1],
    propertyWorkingLatex: solver.propertyWorkingLatex,
  };
}
