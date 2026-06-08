import type {
  NsTrail001Parameters,
  NsTrail001ReasoningEdge,
  NsTrail001ReasoningGraph,
  NsTrail001ReasoningNode,
  NsTrail001SolverResult,
} from "./types";

export function buildNsTrail001ReasoningGraph(parameters: NsTrail001Parameters, solver: NsTrail001SolverResult): NsTrail001ReasoningGraph {
  const nodes = nodesFor(parameters, solver);
  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    sourceTrace: parameters.sourceTrace,
    answerNodeId: nodes[nodes.length - 1].id,
    nodes,
    edges: edgesFor(nodes),
    factorFiveCountLatex: solver.factorFiveCountLatex,
    factorialExpressionLatex: solver.factorialExpressionLatex,
    searchProcessLatex: solver.searchProcessLatex,
    powerFactorizationLatex: solver.powerFactorizationLatex,
    productFactorizationLatex: solver.productFactorizationLatex,
  };
}

function nodesFor(parameters: NsTrail001Parameters, solver: NsTrail001SolverResult): NsTrail001ReasoningNode[] {
  const inputNode: NsTrail001ReasoningNode = {
    id: "input",
    type: "Input Capture",
    inputs: parameters,
    outputs: { canonicalProblemId: parameters.canonicalProblemId },
  };
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return [
        inputNode,
        {
          id: "rule",
          type: "Trailing Zero Rule",
          inputs: { n: parameters.n },
          outputs: { rule: "Count factors of 5 in n! because factors of 2 are in excess." },
        },
        {
          id: "five-count",
          type: "Power Of Five Count",
          inputs: { n: parameters.n },
          outputs: { factorFiveCountLatex: solver.factorFiveCountLatex, answer: solver.answer },
        },
        answerNode(solver.answer),
      ];
    case "CP-002":
      return [
        inputNode,
        {
          id: "expression",
          type: "Expression Parse",
          inputs: { expression: parameters.expression },
          outputs: { numeratorTerms: parameters.numeratorTerms, denominatorTerms: parameters.denominatorTerms },
        },
        {
          id: "numerator",
          type: "Numerator Contribution",
          inputs: { numeratorTerms: parameters.numeratorTerms },
          outputs: { factorialExpressionLatex: solver.factorialExpressionLatex },
        },
        {
          id: "denominator",
          type: "Denominator Contribution",
          inputs: { denominatorTerms: parameters.denominatorTerms },
          outputs: { factorialExpressionLatex: solver.factorialExpressionLatex },
        },
        answerNode(solver.answer),
      ];
    case "CP-003":
      return [
        inputNode,
        {
          id: "search",
          type: "Search Candidates",
          inputs: { zeroCount: parameters.zeroCount },
          outputs: { searchProcessLatex: solver.searchProcessLatex, searchIterations: solver.searchIterations },
        },
        answerNode(solver.answer),
      ];
    case "CP-004":
      return [
        inputNode,
        {
          id: "factorize-base",
          type: "Factorize Base",
          inputs: { base: parameters.base },
          outputs: { powerFactorizationLatex: solver.powerFactorizationLatex },
        },
        {
          id: "multiply-exponents",
          type: "Multiply Exponents",
          inputs: { exponent: parameters.exponent },
          outputs: { twoCount: solver.twoCount, fiveCount: solver.fiveCount },
        },
        {
          id: "pairs",
          type: "Count Complete Pairs",
          inputs: { twoCount: solver.twoCount, fiveCount: solver.fiveCount },
          outputs: { pairCount: solver.pairCount },
        },
        answerNode(solver.answer),
      ];
    case "CP-005":
      return [
        inputNode,
        {
          id: "factorize-numbers",
          type: "Factorize Numbers",
          inputs: { numberA: parameters.numberA, numberB: parameters.numberB },
          outputs: { productFactorizationLatex: solver.productFactorizationLatex },
        },
        {
          id: "aggregate-counts",
          type: "Aggregate Counts",
          inputs: { numberA: parameters.numberA, numberB: parameters.numberB },
          outputs: { twoCount: solver.twoCount, fiveCount: solver.fiveCount },
        },
        {
          id: "pairs",
          type: "Count Complete Pairs",
          inputs: { twoCount: solver.twoCount, fiveCount: solver.fiveCount },
          outputs: { pairCount: solver.pairCount },
        },
        answerNode(solver.answer),
      ];
  }
}

function answerNode(answer: number): NsTrail001ReasoningNode {
  return {
    id: "answer",
    type: "Answer Extraction",
    inputs: { answer },
    outputs: { answer },
  };
}

function edgesFor(nodes: readonly NsTrail001ReasoningNode[]): NsTrail001ReasoningEdge[] {
  return nodes.slice(0, -1).map((node, index) => ({
    from: node.id,
    to: nodes[index + 1].id,
    relationship: "feeds",
  }));
}
