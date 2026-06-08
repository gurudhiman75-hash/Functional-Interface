import type { NsPf001Parameters, NsPf001ReasoningGraph, NsPf001ReasoningNode, NsPf001SolverResult } from "./types";

export function buildNsPf001ReasoningGraph(parameters: NsPf001Parameters, solver: NsPf001SolverResult): NsPf001ReasoningGraph {
  const nodes: NsPf001ReasoningNode[] = [
    {
      id: "problem-recognition",
      type: "Problem Recognition",
      inputs: { canonicalProblemId: parameters.canonicalProblemId, topology: parameters.topology },
      outputs: { sourceTrace: parameters.sourceTrace },
    },
    {
      id: "parameter-integrity",
      type: "Parameter Integrity",
      inputs: { number: parameters.number, prime: parameters.prime, difficultyBand: parameters.difficultyBand },
      outputs: {
        inputValid: solver.verification.inputValid,
        selectedPrimeValid: solver.verification.selectedPrimeValid,
      },
    },
    {
      id: "prime-factorization",
      type: "Prime Factorization",
      inputs: { number: parameters.number },
      outputs: {
        orderedPrimeBases: solver.factorization.orderedPrimeBases,
        exponentsByPrime: solver.factorization.exponentsByPrime,
        repeatedPrimeFactors: solver.factorization.repeatedPrimeFactors,
        totalPrimeFactorCount: solver.factorization.totalPrimeFactorCount,
        distinctPrimeFactorCount: solver.factorization.distinctPrimeFactorCount,
        smallestPrimeFactor: solver.factorization.smallestPrimeFactor,
        largestPrimeFactor: solver.factorization.largestPrimeFactor,
        factorizationText: solver.factorizationText,
        factorizationLatex: solver.factorizationLatex,
      },
    },
    {
      id: "answer-extraction",
      type: "Answer Extraction",
      inputs: {
        canonicalProblemId: parameters.canonicalProblemId,
        selectedPrime: solver.selectedPrime,
        selectedExponent: solver.selectedExponent,
        selectedPrimePower: solver.selectedPrimePower,
      },
      outputs: { answer: solver.answer, answerRuleSatisfied: solver.verification.answerRuleSatisfied },
    },
    {
      id: "mathjax-evidence",
      type: "MathJax Evidence",
      inputs: { factorizationText: solver.factorizationText },
      outputs: { factorizationLatex: solver.factorizationLatex, mathJaxValid: solver.verification.mathJaxValid },
    },
    {
      id: "explanation-data",
      type: "Explanation Data",
      inputs: { answer: solver.answer },
      outputs: {
        number: parameters.number,
        prime: parameters.prime,
        exponent: solver.selectedExponent,
        answer: solver.answer,
        factorization: solver.factorizationText,
        factorizationLatex: solver.factorizationLatex,
      },
    },
    {
      id: "traceability",
      type: "Traceability",
      inputs: { questionId: parameters.questionId },
      outputs: {
        archetypeId: parameters.archetypeId,
        canonicalProblemId: parameters.canonicalProblemId,
        difficultyBand: parameters.difficultyBand,
        factorizationText: solver.factorizationText,
        factorizationLatex: solver.factorizationLatex,
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
    sourceTrace: parameters.sourceTrace,
    factorizationText: solver.factorizationText,
    factorizationLatex: solver.factorizationLatex,
    nodes,
    edges: [
      { from: "problem-recognition", to: "parameter-integrity", relationship: "identifies required inputs" },
      { from: "parameter-integrity", to: "prime-factorization", relationship: "provides approved values" },
      { from: "prime-factorization", to: "answer-extraction", relationship: "supports CP-specific answer" },
      { from: "prime-factorization", to: "mathjax-evidence", relationship: "renders MathJax factorization" },
      { from: "answer-extraction", to: "explanation-data", relationship: "feeds approved explanation" },
      { from: "mathjax-evidence", to: "explanation-data", relationship: "provides factorization evidence" },
      { from: "explanation-data", to: "traceability", relationship: "preserves rendered evidence" },
      { from: "traceability", to: "final-answer", relationship: "confirms traceable answer" },
    ],
    answerNodeId: "final-answer",
  };
}

export const buildNsPf001Cp001ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp002ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp003ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp004ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp005ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp006ReasoningGraph = buildNsPf001ReasoningGraph;
export const buildNsPf001Cp007ReasoningGraph = buildNsPf001ReasoningGraph;
