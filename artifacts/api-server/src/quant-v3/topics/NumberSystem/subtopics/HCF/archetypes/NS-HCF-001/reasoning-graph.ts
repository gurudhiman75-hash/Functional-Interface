import type { NsHcf001Parameters, NsHcf001ReasoningEdge, NsHcf001ReasoningGraph, NsHcf001ReasoningNode, NsHcf001SolverResult } from "./types";

export function buildNsHcf001ReasoningGraph(parameters: NsHcf001Parameters, solver: NsHcf001SolverResult): NsHcf001ReasoningGraph {
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
    commonPrimeIntersectionLatex: solver.commonPrimeIntersectionLatex,
    minimumExponentSelectionLatex: solver.minimumExponentSelectionLatex,
    hcfLatex: solver.hcfLatex,
    hcfFactorCountFormulaLatex: solver.hcfFactorCountFormulaLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    groupingInterpretationLatex: solver.groupingInterpretationLatex,
  };
}

function nodesFor(parameters: NsHcf001Parameters, solver: NsHcf001SolverResult): NsHcf001ReasoningNode[] {
  if (parameters.canonicalProblemId === "CP-003") {
    return [
      node("n1", "Apply HCF Condition", { knownOperands: parameters.knownOperands, targetHcf: parameters.targetHcf }, { targetHcf: parameters.targetHcf }),
      node("n2", "Generate Candidates", { family: parameters.cp003Family }, { candidateValues: solver.candidateValues }),
      node("n3", "Apply Extra Condition", { questionLanguageId: parameters.questionLanguageId }, { validCandidates: solver.validCandidates }),
      node("n4", "Eliminate Invalid Candidates", { candidateValues: solver.candidateValues }, { validCandidates: solver.validCandidates }),
      node("n5", "Answer Extraction", { validCandidates: solver.validCandidates }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-004") {
    return [
      node("n1", "Context Interpretation", { quantities: parameters.numbers }, { groupingInterpretationLatex: solver.groupingInterpretationLatex }),
      node("n2", "Equal Grouping Rule", { quantities: parameters.numbers }, { rule: "HCF" }),
      node("n3", "HCF Computation", { numbers: parameters.numbers }, { hcf: solver.hcf, hcfLatex: solver.hcfLatex }),
      node("n4", "Answer Extraction", { hcf: solver.hcf }, { answer: solver.answer }),
    ];
  }
  const base = [
    node("n1", "Input Capture", { numbers: parameters.numbers }, { numbers: parameters.numbers }),
    node("n2", "Prime Factorization", { numbers: parameters.numbers }, { operandFactorizationLatex: solver.operandFactorizationLatex }),
    node("n3", "HCF Computation", { numbers: parameters.numbers }, { hcf: solver.hcf, hcfLatex: solver.hcfLatex }),
  ];
  if (parameters.canonicalProblemId === "CP-002") {
    base.push(node("n4", "Factor Count", { hcf: solver.hcf }, { count: solver.answer, hcfFactorCountFormulaLatex: solver.hcfFactorCountFormulaLatex }));
    base.push(node("n5", "Answer Extraction", { count: solver.answer }, { answer: solver.answer }));
    return base;
  }
  base.push(node("n4", "Answer Extraction", { hcf: solver.hcf }, { answer: solver.answer }));
  return base;
}

function node(id: string, type: NsHcf001ReasoningNode["type"], inputs: Record<string, unknown>, outputs: Record<string, unknown>): NsHcf001ReasoningNode {
  return { id, type, inputs, outputs };
}

function edgesFor(nodes: readonly NsHcf001ReasoningNode[]): NsHcf001ReasoningEdge[] {
  return nodes.slice(0, -1).map((from, index) => ({
    from: from.id,
    to: nodes[index + 1].id,
    relationship: "feeds",
  }));
}
