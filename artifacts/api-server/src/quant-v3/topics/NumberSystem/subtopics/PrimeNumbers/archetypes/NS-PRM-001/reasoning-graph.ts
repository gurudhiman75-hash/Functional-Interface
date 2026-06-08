import type { NsPrm001Parameters, NsPrm001ReasoningGraph, NsPrm001ReasoningNode, NsPrm001SolverResult } from "./types";

export function buildNsPrm001ReasoningGraph(parameters: NsPrm001Parameters, solver: NsPrm001SolverResult): NsPrm001ReasoningGraph {
  const nodes: NsPrm001ReasoningNode[] = [
    {
      id: "problem-recognition",
      type: "Problem Recognition",
      inputs: { canonicalProblemId: parameters.canonicalProblemId, topology: parameters.topology },
      outputs: { reasoningPatternId: parameters.reasoningPatternId },
    },
    {
      id: "parameter-integrity",
      type: "Parameter Integrity",
      inputs: {
        number: parameters.number,
        lowerBound: parameters.lowerBound,
        upperBound: parameters.upperBound,
        position: parameters.position,
      },
      outputs: { inputValid: solver.verification.inputValid, rangeWidth: parameters.rangeWidth },
    },
    {
      id: "prime-evidence",
      type: "Prime Evidence",
      inputs: {
        number: parameters.number,
        lowerBound: parameters.lowerBound,
        upperBound: parameters.upperBound,
        position: parameters.position,
      },
      outputs: {
        primesInRange: solver.primesInRange,
        selectedPrime: solver.selectedPrime,
        answerClass: solver.answerClass,
        primeEvidenceValid: solver.verification.primeEvidenceValid,
      },
    },
    {
      id: "range-evaluation",
      type: "Range Evaluation",
      inputs: { lowerBound: parameters.lowerBound, upperBound: parameters.upperBound, rangeWidth: parameters.rangeWidth },
      outputs: { rangeValid: solver.verification.rangeValid, count: solver.count, sum: solver.sum },
    },
    {
      id: "search-evaluation",
      type: "Search Evaluation",
      inputs: { number: parameters.number, position: parameters.position },
      outputs: { selectedPrime: solver.selectedPrime },
    },
    {
      id: "answer-extraction",
      type: "Answer Extraction",
      inputs: { solverAnswer: solver.answer },
      outputs: { answer: solver.answer, answerRuleSatisfied: solver.verification.answerRuleSatisfied },
    },
    {
      id: "explanation-data",
      type: "Explanation Data",
      inputs: { answer: solver.answer },
      outputs: {
        number: parameters.number,
        lowerBound: parameters.lowerBound,
        upperBound: parameters.upperBound,
        position: parameters.position,
        answer: solver.answer,
      },
    },
    {
      id: "final-answer",
      type: "Final Answer",
      inputs: { answer: solver.answer },
      outputs: { answer: solver.answer },
    },
  ];

  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges: [
      { from: "problem-recognition", to: "parameter-integrity", relationship: "identifies required inputs" },
      { from: "parameter-integrity", to: "prime-evidence", relationship: "provides approved values" },
      { from: "prime-evidence", to: "range-evaluation", relationship: "supports range operations" },
      { from: "prime-evidence", to: "search-evaluation", relationship: "supports search operations" },
      { from: "range-evaluation", to: "answer-extraction", relationship: "supports range answer" },
      { from: "search-evaluation", to: "answer-extraction", relationship: "supports search answer" },
      { from: "answer-extraction", to: "explanation-data", relationship: "feeds approved explanation" },
      { from: "explanation-data", to: "final-answer", relationship: "confirms final answer" },
    ],
    answerNodeId: "final-answer",
  };
}

export const buildNsPrm001Cp001ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp002ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp003ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp004ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp005ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp006ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp007ReasoningGraph = buildNsPrm001ReasoningGraph;
export const buildNsPrm001Cp008ReasoningGraph = buildNsPrm001ReasoningGraph;
