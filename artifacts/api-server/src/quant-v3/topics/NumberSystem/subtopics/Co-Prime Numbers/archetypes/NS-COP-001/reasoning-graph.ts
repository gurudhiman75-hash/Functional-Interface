import type { NsCop001Parameters, NsCop001ReasoningEdge, NsCop001ReasoningGraph, NsCop001ReasoningNode, NsCop001SolverResult } from "./types";

export function buildNsCop001ReasoningGraph(parameters: NsCop001Parameters, solver: NsCop001SolverResult): NsCop001ReasoningGraph {
  const nodes = nodesFor(parameters, solver);
  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    sourceTrace: parameters.sourceTrace,
    answerNodeId: nodes[nodes.length - 1].id,
    nodes,
    edges: edgesFor(nodes),
    hcfLatex: solver.hcfLatex,
    coprimeCheckLatex: solver.coprimeCheckLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    pairEvaluationLatex: solver.pairEvaluationLatex,
    consecutivePropertyLatex: solver.consecutivePropertyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
  };
}

function nodesFor(parameters: NsCop001Parameters, solver: NsCop001SolverResult): NsCop001ReasoningNode[] {
  if (parameters.canonicalProblemId === "CP-002") {
    return [
      node("n1", "Input Capture", { targetNumber: parameters.targetNumber, numberList: parameters.numberList }, { numberList: solver.numberList }),
      node("n2", "Evaluate List Element", { numberList: solver.numberList }, { coprimeCheckLatex: solver.coprimeCheckLatex }),
      node("n3", "Count Valid Entries", { validEntries: solver.answer }, { answer: solver.answer }),
      node("n4", "Answer Extraction", { count: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-003") {
    return [
      node("n1", "Evaluate Candidates", { number: parameters.number, candidateSet: parameters.candidateSet }, { candidateEvaluationLatex: solver.candidateEvaluationLatex }),
      node("n2", "Compute HCF", { candidateSet: parameters.candidateSet }, { validCandidates: solver.validCandidates }),
      node("n3", "Answer Extraction", { validCandidates: solver.validCandidates }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-004") {
    return [
      node("n1", "Generate Pairs", { numberSet: parameters.numberSet }, { allPairs: solver.allPairs }),
      node("n2", "Evaluate Pair HCF", { allPairs: solver.allPairs }, { pairEvaluationLatex: solver.pairEvaluationLatex }),
      node("n3", "Count Valid Entries", { coprimePairs: solver.coprimePairs }, { answer: solver.answer }),
      node("n4", "Answer Extraction", { pairCount: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-005") {
    return [
      node("n1", "Recognize Consecutive Numbers", { number: parameters.number, nextNumber: parameters.nextNumber }, { consecutive: true }),
      node("n2", "Apply Consecutive Property", { number: parameters.number }, { consecutivePropertyLatex: solver.consecutivePropertyLatex }),
      node("n3", "Answer Extraction", { propertyAnswer: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-006") {
    return [
      node("n1", "Compute HCF", { a: parameters.a, b: parameters.b }, { hcfLatex: solver.hcfLatex }),
      node("n2", "Divide Ratio Terms", { hcf: solver.hcf }, { ratioReductionLatex: solver.ratioReductionLatex }),
      node("n3", "Verify Reduced Ratio", { reducedRatio: solver.reducedRatio }, { reducedTermsCoprime: solver.verification.reducedTermsCoprime }),
      node("n4", "Answer Extraction", { reducedRatio: solver.answer }, { answer: solver.answer }),
    ];
  }
  return [
    node("n1", "Compute HCF", { a: parameters.a, b: parameters.b }, { hcf: solver.hcf, hcfLatex: solver.hcfLatex }),
    node("n2", "Compute Common Factors", { a: parameters.a, b: parameters.b }, { commonFactors: solver.commonFactors }),
    node("n3", "Determine Relationship", { hcf: solver.hcf }, { coprimeStatus: solver.coprimeStatus }),
    node("n4", "Answer Extraction", { answerType: parameters.cp001AnswerType }, { answer: solver.answer }),
  ];
}

function node(id: string, type: NsCop001ReasoningNode["type"], inputs: Record<string, unknown>, outputs: Record<string, unknown>): NsCop001ReasoningNode {
  return { id, type, inputs, outputs };
}

function edgesFor(nodes: readonly NsCop001ReasoningNode[]): NsCop001ReasoningEdge[] {
  return nodes.slice(0, -1).map((from, index) => ({ from: from.id, to: nodes[index + 1].id, relationship: "feeds" }));
}
