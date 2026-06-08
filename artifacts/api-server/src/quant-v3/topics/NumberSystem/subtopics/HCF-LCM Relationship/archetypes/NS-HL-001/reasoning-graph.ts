import type { NsHl001Parameters, NsHl001ReasoningEdge, NsHl001ReasoningGraph, NsHl001ReasoningNode, NsHl001SolverResult } from "./types";

export function buildNsHl001ReasoningGraph(parameters: NsHl001Parameters, solver: NsHl001SolverResult): NsHl001ReasoningGraph {
  const nodes = nodesFor(parameters, solver);
  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    sourceTrace: parameters.sourceTrace,
    answerNodeId: nodes[nodes.length - 1].id,
    nodes,
    edges: edgesFor(nodes),
    productRelationLatex: solver.productRelationLatex,
    divisibilityCheckLatex: solver.divisibilityCheckLatex,
    productRelationCheckLatex: solver.productRelationCheckLatex,
    missingNumberFormulaLatex: solver.missingNumberFormulaLatex,
    hcfVerificationLatex: solver.hcfVerificationLatex,
    lcmVerificationLatex: solver.lcmVerificationLatex,
    quotientLatex: solver.quotientLatex,
    factorPairListLatex: solver.factorPairListLatex,
    coprimePairFilterLatex: solver.coprimePairFilterLatex,
    conditionFilterLatex: solver.conditionFilterLatex,
    reconstructedPairLatex: solver.reconstructedPairLatex,
    factorPairCountLatex: solver.factorPairCountLatex,
    orderedPairPolicyLatex: solver.orderedPairPolicyLatex,
    unorderedPairPolicyLatex: solver.unorderedPairPolicyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
    ratioMultiplierLatex: solver.ratioMultiplierLatex,
    hcfMultiplierLatex: solver.hcfMultiplierLatex,
    lcmMultiplierLatex: solver.lcmMultiplierLatex,
    consistencyCheckLatex: solver.consistencyCheckLatex,
  };
}

function nodesFor(parameters: NsHl001Parameters, solver: NsHl001SolverResult): NsHl001ReasoningNode[] {
  if (parameters.canonicalProblemId === "CP-002") {
    return [
      node("n1", "Divisibility Check", { hcf: parameters.hcf, lcm: parameters.lcm }, { divisibilityCheckLatex: solver.divisibilityCheckLatex }),
      node("n2", "Consistency Check", { a: parameters.a, b: parameters.b }, { productRelationCheckLatex: solver.productRelationCheckLatex }),
      node("n3", "Decision Node", { validityType: parameters.validityType }, { answer: solver.answer }),
      node("n4", "Answer Extraction", { decision: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-003") {
    return [
      node("n1", "Product Relation", { hcf: parameters.hcf, lcm: parameters.lcm }, { productRelationLatex: solver.productRelationLatex }),
      node("n2", "Missing Number Formula", { knownNumber: parameters.knownNumber }, { missingNumberFormulaLatex: solver.missingNumberFormulaLatex }),
      node("n3", "Consistency Check", { answerPair: solver.answerPair }, { hcfVerificationLatex: solver.hcfVerificationLatex, lcmVerificationLatex: solver.lcmVerificationLatex }),
      node("n4", "Answer Extraction", { missingNumber: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-004") {
    return [
      node("n1", "Quotient Calculation", { hcf: parameters.hcf, lcm: parameters.lcm }, { quotient: solver.quotient, quotientLatex: solver.quotientLatex }),
      node("n2", "Factor Pair Enumeration", { quotient: solver.quotient }, { factorPairs: solver.factorPairs }),
      node("n3", "Coprime Filter", { factorPairs: solver.factorPairs }, { coprimePairs: solver.coprimePairs }),
      node("n4", "Condition Filter", { conditionType: parameters.conditionType }, { selectedPairs: solver.selectedPairs }),
      node("n5", "Pair Reconstruction", { selectedPairs: solver.selectedPairs }, { answerPair: solver.answerPair }),
      node("n6", "Answer Extraction", { pair: solver.answerPair }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-005") {
    return [
      node("n1", "Quotient Calculation", { hcf: parameters.hcf, lcm: parameters.lcm }, { quotient: solver.quotient }),
      node("n2", "Factor Pair Enumeration", { quotient: solver.quotient }, { factorPairs: solver.factorPairs }),
      node("n3", "Coprime Filter", { factorPairs: solver.factorPairs }, { coprimePairs: solver.coprimePairs }),
      node("n4", "Pair Policy", { pairPolicy: parameters.pairPolicy }, { count: solver.answer }),
      node("n5", "Answer Extraction", { count: solver.answer }, { answer: solver.answer }),
    ];
  }
  if (parameters.canonicalProblemId === "CP-006") {
    return [
      node("n1", "Ratio Reduction", { ratio: parameters.ratio }, { ratioReductionLatex: solver.ratioReductionLatex }),
      node("n2", "Multiplier Determination", { hcf: parameters.hcf, lcm: parameters.lcm }, { ratioMultiplierLatex: solver.ratioMultiplierLatex }),
      node("n3", "Consistency Check", { ratioType: parameters.ratioType }, { consistencyCheckLatex: solver.consistencyCheckLatex }),
      node("n4", "Pair Reconstruction", { ratio: parameters.ratio }, { answerPair: solver.answerPair }),
      node("n5", "Answer Extraction", { pair: solver.answerPair }, { answer: solver.answer }),
    ];
  }
  return [
    node("n1", "Known Value Identification", { hcf: parameters.hcf, lcm: parameters.lcm, product: parameters.product }, { family: parameters.cp001Family }),
    node("n2", "Product Relation", { hcf: parameters.hcf, lcm: parameters.lcm, product: parameters.product }, { productRelationLatex: solver.productRelationLatex }),
    node("n3", "Answer Extraction", { family: parameters.cp001Family }, { answer: solver.answer }),
  ];
}

function node(id: string, type: NsHl001ReasoningNode["type"], inputs: Record<string, unknown>, outputs: Record<string, unknown>): NsHl001ReasoningNode {
  return { id, type, inputs, outputs };
}

function edgesFor(nodes: readonly NsHl001ReasoningNode[]): NsHl001ReasoningEdge[] {
  return nodes.slice(0, -1).map((from, index) => ({ from: from.id, to: nodes[index + 1].id, relationship: "feeds" }));
}
