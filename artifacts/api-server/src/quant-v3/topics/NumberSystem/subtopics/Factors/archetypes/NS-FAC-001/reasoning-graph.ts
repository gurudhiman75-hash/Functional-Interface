import type { NsFac001Parameters, NsFac001ReasoningGraph, NsFac001ReasoningNode, NsFac001SolverResult } from "./types";

export function buildNsFac001ReasoningGraph(parameters: NsFac001Parameters, solver: NsFac001SolverResult): NsFac001ReasoningGraph {
  const nodes: NsFac001ReasoningNode[] = [
    {
      id: "prime-factorization",
      type: "Prime Factorization",
      inputs: { number: parameters.number },
      outputs: { primeFactorization: solver.primeFactorization, primeFactorizationLatex: solver.primeFactorizationLatex },
    },
    {
      id: "factor-count-formula",
      type: "Factor Count Formula",
      inputs: { primeFactorization: solver.primeFactorization },
      outputs: { factorCount: solver.factorCount, factorCountFormulaLatex: solver.factorCountFormulaLatex },
    },
    {
      id: "factor-sum-formula",
      type: "Factor Sum Formula",
      inputs: { factors: solver.factorList },
      outputs: { factorSum: solver.factorSum, factorSumFormulaLatex: solver.factorSumFormulaLatex },
    },
    {
      id: "factor-product-formula",
      type: "Factor Product Formula",
      inputs: { number: parameters.number, factorCount: solver.factorCount },
      outputs: {
        factorProduct: solver.factorProductString,
        factorProductFormulaLatex: solver.factorProductFormulaLatex,
        productDigitCount: solver.productDigitCount,
      },
    },
    {
      id: "perfect-square-rule",
      type: "Perfect Square Rule",
      inputs: { number: parameters.number },
      outputs: { isPerfectSquare: solver.isPerfectSquare, perfectSquareRuleLatex: solver.perfectSquareRuleLatex },
    },
    {
      id: "factor-enumeration",
      type: "Factor Enumeration",
      inputs: { number: parameters.number },
      outputs: {
        factorList: solver.factorList,
        factorListLatex: solver.factorListLatex,
        factorsIncreasing: solver.factorsIncreasing,
        factorsIncreasingLatex: solver.factorsIncreasingLatex,
        factorsDecreasing: solver.factorsDecreasing,
        factorsDecreasingLatex: solver.factorsDecreasingLatex,
      },
    },
    {
      id: "divisible-factor-selection",
      type: "Divisible Factor Selection",
      inputs: { k: parameters.k, factorList: solver.factorList },
      outputs: {
        divisibleFactors: solver.divisibleFactors,
        divisibleFactorCount: solver.divisibleFactorCount,
        kPrimeFactorizationLatex: solver.kPrimeFactorizationLatex,
        divisibleFactorConstraintLatex: solver.divisibleFactorConstraintLatex,
      },
    },
    {
      id: "complement-counting",
      type: "Complement Counting",
      inputs: { factorCount: solver.factorCount, divisibleFactorCount: solver.divisibleFactorCount },
      outputs: { notDivisibleFactorCount: solver.notDivisibleFactorCount, complementFormulaLatex: solver.complementFormulaLatex },
    },
    {
      id: "ordered-factor-selection",
      type: "Ordered Factor Selection",
      inputs: { position: parameters.position, ordinalDisplay: parameters.ordinalDisplay },
      outputs: {
        selectedPosition: solver.selectedPosition,
        selectedFactor: solver.selectedFactor,
        positionClass: solver.positionClass,
        selectedPositionFormulaLatex: solver.selectedPositionFormulaLatex,
      },
    },
    {
      id: "answer-extraction",
      type: "Answer Extraction",
      inputs: { canonicalProblemId: parameters.canonicalProblemId },
      outputs: { answer: solver.answer },
    },
  ];

  return {
    graphId: `${parameters.questionId}:graph`,
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    sourceTrace: parameters.sourceTrace,
    answerNodeId: "answer-extraction",
    nodes,
    edges: [
      { from: "prime-factorization", to: "factor-count-formula", relationship: "provides exponents" },
      { from: "factor-enumeration", to: "factor-sum-formula", relationship: "provides factor list" },
      { from: "factor-count-formula", to: "factor-product-formula", relationship: "provides d(N)" },
      { from: "factor-count-formula", to: "complement-counting", relationship: "provides total factors" },
      { from: "divisible-factor-selection", to: "complement-counting", relationship: "provides divisible count" },
      { from: "factor-enumeration", to: "ordered-factor-selection", relationship: "provides ordered factors" },
      { from: "factor-count-formula", to: "answer-extraction", relationship: "supports CP-001 and CP-007" },
      { from: "factor-sum-formula", to: "answer-extraction", relationship: "supports CP-002" },
      { from: "factor-product-formula", to: "answer-extraction", relationship: "supports CP-003" },
      { from: "perfect-square-rule", to: "answer-extraction", relationship: "supports CP-004" },
      { from: "divisible-factor-selection", to: "answer-extraction", relationship: "supports CP-006" },
      { from: "complement-counting", to: "answer-extraction", relationship: "supports CP-007" },
      { from: "ordered-factor-selection", to: "answer-extraction", relationship: "supports CP-008 and CP-009" },
    ],
    primeFactorizationLatex: solver.primeFactorizationLatex,
    factorCountFormulaLatex: solver.factorCountFormulaLatex,
    factorSumFormulaLatex: solver.factorSumFormulaLatex,
    factorProductFormulaLatex: solver.factorProductFormulaLatex,
    factorListLatex: solver.factorListLatex,
    factorsIncreasingLatex: solver.factorsIncreasingLatex,
    factorsDecreasingLatex: solver.factorsDecreasingLatex,
    kPrimeFactorizationLatex: solver.kPrimeFactorizationLatex,
    divisibleFactorConstraintLatex: solver.divisibleFactorConstraintLatex,
    complementFormulaLatex: solver.complementFormulaLatex,
    selectedPositionFormulaLatex: solver.selectedPositionFormulaLatex,
    greatestProperFactorFormulaLatex: solver.greatestProperFactorFormulaLatex,
    perfectSquareRuleLatex: solver.perfectSquareRuleLatex,
  };
}

export const buildNsFac001Cp001ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp002ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp003ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp004ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp005ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp006ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp007ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp008ReasoningGraph = buildNsFac001ReasoningGraph;
export const buildNsFac001Cp009ReasoningGraph = buildNsFac001ReasoningGraph;
