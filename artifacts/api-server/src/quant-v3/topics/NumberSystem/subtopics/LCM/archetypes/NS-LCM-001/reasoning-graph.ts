import type { NsLcm001Parameters, NsLcm001ReasoningEdge, NsLcm001ReasoningGraph, NsLcm001ReasoningNode, NsLcm001SolverResult } from "./types";

export function buildNsLcm001ReasoningGraph(parameters: NsLcm001Parameters, solver: NsLcm001SolverResult): NsLcm001ReasoningGraph {
  const nodes = nodesFor(parameters, solver);
  const edges = edgesFor(nodes);
  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    sourceTrace: parameters.sourceTrace,
    answerNodeId: nodes[nodes.length - 1].id,
    nodes,
    edges,
    operandFactorizationLatex: solver.operandFactorizationLatex,
    primeUnionLatex: solver.primeUnionLatex,
    maximumExponentSelectionLatex: solver.maximumExponentSelectionLatex,
    lcmLatex: solver.lcmLatex,
    synchronizationInterpretationLatex: solver.synchronizationInterpretationLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    rangeCountFormulaLatex: solver.rangeCountFormulaLatex,
    thresholdSelectionFormulaLatex: solver.thresholdSelectionFormulaLatex,
  };
}

function nodesFor(parameters: NsLcm001Parameters, solver: NsLcm001SolverResult): NsLcm001ReasoningNode[] {
  if (parameters.canonicalProblemId === "CP-002") {
    return [
      node("n1", "Synchronization Interpretation", { cycleLengths: parameters.cycleLengths, cycleContext: parameters.cycleContext }, { synchronizationInterpretationLatex: solver.synchronizationInterpretationLatex }),
      node("n2", "Prime Factorization", { numbers: solver.numbers }, { operandFactorizationLatex: solver.operandFactorizationLatex }),
      node("n3", "LCM Construction", { cycleLengths: solver.numbers }, { lcm: solver.lcm, lcmLatex: solver.lcmLatex }),
      node("n4", "Answer Extraction", { lcm: solver.lcm }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-003") {
    return [
      node("n1", "Input Capture", { knownNumbers: parameters.knownNumbers, targetLcm: parameters.targetLcm }, { targetLcm: parameters.targetLcm }),
      node("n2", "Candidate Generation", { family: parameters.cp003Family }, { candidateValues: solver.candidateValues }),
      node("n3", "Candidate Evaluation", { candidateValues: solver.candidateValues }, { validCandidates: solver.validCandidates, candidateEvaluationLatex: solver.candidateEvaluationLatex }),
      node("n4", "Answer Extraction", { validCandidates: solver.validCandidates }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-004") {
    return [
      node("n1", "Input Capture", { numbers: parameters.numbers, lowerBound: parameters.lowerBound, upperBound: parameters.upperBound }, { numbers: parameters.numbers }),
      node("n2", "LCM Construction", { numbers: parameters.numbers }, { lcm: solver.lcm, lcmLatex: solver.lcmLatex }),
      node("n3", "Range Count", { lcm: solver.lcm, lowerBound: parameters.lowerBound, upperBound: parameters.upperBound }, { answer: solver.answer, rangeCountFormulaLatex: solver.rangeCountFormulaLatex }),
      node("n4", "Answer Extraction", { count: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-005") {
    return [
      node("n1", "Input Capture", { numbers: parameters.numbers, threshold: parameters.threshold }, { numbers: parameters.numbers }),
      node("n2", "LCM Construction", { numbers: parameters.numbers }, { lcm: solver.lcm, lcmLatex: solver.lcmLatex }),
      node("n3", "Threshold Selection", { lcm: solver.lcm, threshold: parameters.threshold }, { answer: solver.answer, thresholdSelectionFormulaLatex: solver.thresholdSelectionFormulaLatex }),
      node("n4", "Answer Extraction", { selectedMultiple: solver.answer }, { answer: solver.answer }),
    ];
  }
  return [
    node("n1", "Input Capture", { numbers: parameters.numbers }, { numbers: parameters.numbers }),
    node("n2", "Prime Factorization", { numbers: parameters.numbers }, { operandFactorizationLatex: solver.operandFactorizationLatex }),
    node("n3", "Prime Union", { numbers: parameters.numbers }, { primeUnionLatex: solver.primeUnionLatex }),
    node("n4", "Maximum Exponent Selection", { numbers: parameters.numbers }, { maximumExponentSelectionLatex: solver.maximumExponentSelectionLatex }),
    node("n5", "LCM Construction", { terms: solver.lcmPrimeFactorization }, { lcm: solver.lcm, lcmLatex: solver.lcmLatex }),
    node("n6", "Answer Extraction", { lcm: solver.lcm }, { answer: solver.answer }),
  ];
}

function node(id: string, type: NsLcm001ReasoningNode["type"], inputs: Record<string, unknown>, outputs: Record<string, unknown>): NsLcm001ReasoningNode {
  return { id, type, inputs, outputs };
}

function edgesFor(nodes: readonly NsLcm001ReasoningNode[]): NsLcm001ReasoningEdge[] {
  return nodes.slice(0, -1).map((from, index) => ({
    from: from.id,
    to: nodes[index + 1].id,
    relationship: "feeds",
  }));
}
