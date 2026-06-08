import {
  NS_REM_002_ARCHETYPE_ID,
  type NsRem002Parameters,
  type NsRem002ReasoningEdge,
  type NsRem002ReasoningGraph,
  type NsRem002ReasoningNode,
  type NsRem002SolverResult,
} from "./types";

export function buildNsRem002ReasoningGraph(parameters: NsRem002Parameters, solver: NsRem002SolverResult): NsRem002ReasoningGraph {
  const nodes: NsRem002ReasoningNode[] = [
    {
      id: "node-1-problem-recognition",
      type: "Problem Recognition",
      inputs: {
        archetypeId: parameters.archetypeId,
        canonicalProblemId: parameters.canonicalProblemId,
        questionId: parameters.questionId,
      },
      outputs: {
        topology: parameters.topology,
        difficultyBand: parameters.difficultyBand,
      },
    },
    {
      id: "node-2-parameter-integrity",
      type: "Parameter Integrity",
      inputs: {
        divisor: parameters.divisor,
        quotient: parameters.quotient,
        remainder: parameters.remainder,
        dividend: parameters.dividend,
        lowerBound: parameters.lowerBound,
        upperBound: parameters.upperBound,
      },
      outputs: {
        parameterSetAccepted: true,
      },
    },
    {
      id: "node-3-equation-consistency",
      type: "Equation Consistency",
      inputs: {
        foundationalRelation: "Dividend = Divisor * Quotient + Remainder",
      },
      outputs: {
        equationConsistent: solver.verification.equationConsistent,
        dividend: solver.dividend,
        divisor: solver.divisor,
        quotient: solver.quotient,
        remainder: solver.remainder,
      },
    },
    {
      id: "node-4-remainder-condition",
      type: "Remainder Condition",
      inputs: {
        divisor: solver.divisor,
        remainder: solver.remainder,
      },
      outputs: {
        remainderValid: solver.verification.remainderValid,
        validNumbers: solver.validNumbers,
      },
    },
    {
      id: "node-5-range-evaluation",
      type: "Range Evaluation",
      inputs: {
        lowerBound: solver.lowerBound,
        upperBound: solver.upperBound,
      },
      outputs: {
        rangeValid: solver.verification.rangeValid,
        firstValidNumber: solver.firstValidNumber,
        lastValidNumber: solver.lastValidNumber,
        count: solver.count,
        sum: solver.sum,
      },
    },
    {
      id: "node-6-answer-extraction",
      type: "Answer Extraction",
      inputs: {
        topology: solver.topology,
        selectionRule: solver.selectionRule,
      },
      outputs: {
        answer: solver.answer,
        answerRuleSatisfied: solver.verification.answerRuleSatisfied,
      },
    },
    {
      id: "node-7-explanation-data",
      type: "Explanation Data",
      inputs: {
        answerNodeId: "node-6-answer-extraction",
      },
      outputs: {
        answer: solver.answer,
      },
    },
    {
      id: "node-8-final-answer",
      type: "Final Answer",
      inputs: {
        answerExtractionNodeId: "node-6-answer-extraction",
      },
      outputs: {
        answer: solver.answer,
        verification: solver.verification,
      },
    },
  ];
  const edges: NsRem002ReasoningEdge[] = [
    { from: nodes[0].id, to: nodes[1].id, relationship: "recognizes required parameter shape" },
    { from: nodes[1].id, to: nodes[2].id, relationship: "checks division relation where applicable" },
    { from: nodes[2].id, to: nodes[3].id, relationship: "checks remainder validity" },
    { from: nodes[3].id, to: nodes[4].id, relationship: "evaluates range where applicable" },
    { from: nodes[4].id, to: nodes[5].id, relationship: "extracts CP-specific answer" },
    { from: nodes[5].id, to: nodes[6].id, relationship: "prepares explanation data" },
    { from: nodes[6].id, to: nodes[7].id, relationship: "produces final answer" },
  ];

  return {
    graphId: `NS-REM-002:${parameters.canonicalProblemId}:GRAPH:${parameters.questionId}`,
    archetypeId: NS_REM_002_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges,
    answerNodeId: "node-8-final-answer",
  };
}

export const buildCp001ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp002ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp003ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp004ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp005ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp006ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp007ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp008ReasoningGraph = buildNsRem002ReasoningGraph;
export const buildCp009ReasoningGraph = buildNsRem002ReasoningGraph;
