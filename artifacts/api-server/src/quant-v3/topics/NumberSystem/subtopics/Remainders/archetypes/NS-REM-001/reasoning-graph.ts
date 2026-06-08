import {
  NS_REM_001_ARCHETYPE_ID,
  NS_REM_001_CP_001,
  NS_REM_001_CP_002,
  NS_REM_001_CP_003,
  NS_REM_001_CP_004,
  NS_REM_001_CP_005,
  NS_REM_001_CP_006,
  NS_REM_001_CP_007,
  type NsRem001Parameters,
  type NsRem001ReasoningEdge,
  type NsRem001ReasoningGraph,
  type NsRem001ReasoningNode,
  type NsRem001SolverResult,
} from "./types";

export function buildNsRem001ReasoningGraph(parameters: NsRem001Parameters, solver: NsRem001SolverResult): NsRem001ReasoningGraph {
  const nodes: NsRem001ReasoningNode[] = [
    {
      id: "node-1-pattern-integrity",
      type: "Pattern Integrity",
      inputs: {
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
        numberExpression: parameters.numberExpression,
      },
      outputs: {
        length: parameters.numberLength,
        missingPosition: parameters.missingPosition,
      },
    },
    {
      id: "node-2-target-remainder-integrity",
      type: "Target Remainder Integrity",
      inputs: {
        divisor: parameters.divisor,
        targetRemainder: parameters.targetRemainder,
      },
      outputs: {
        validRange: `0 <= remainder < ${parameters.divisor}`,
        targetRemainder: parameters.targetRemainder,
      },
    },
    {
      id: "node-3-candidate-generation",
      type: "Candidate Generation",
      inputs: {
        missingPosition: parameters.missingPosition,
        leadingZeroPolicy: parameters.missingPosition === 1 ? "0 excluded" : "0 allowed",
      },
      outputs: {
        candidateDigitSet: solver.candidateDigitSet,
      },
    },
    {
      id: "node-4-valid-value-set",
      type: "Valid Value Set",
      inputs: {
        candidateDigitSet: solver.candidateDigitSet,
        divisor: parameters.divisor,
        targetRemainder: parameters.targetRemainder,
      },
      outputs: {
        candidateEvaluations: solver.candidateEvaluations,
        validValueSet: solver.validValueSet,
      },
    },
    {
      id: "node-5-cp-specific-answer-extraction",
      type: "CP Specific Answer Extraction",
      inputs: {
        canonicalProblemId: parameters.canonicalProblemId,
        validValueSet: solver.validValueSet,
      },
      outputs: {
        selectionRule: solver.selectionMetadata.selectionRule,
        answer: solver.answer,
        selectedValue: solver.selectedValue,
      },
    },
    {
      id: "node-6-explanation-data",
      type: "Explanation Data",
      inputs: {
        validValueSetNodeId: "node-4-valid-value-set",
        answerNodeId: "node-5-cp-specific-answer-extraction",
      },
      outputs: {
        validSet: solver.validValueSet,
        answer: solver.answer,
        remainder: parameters.targetRemainder,
      },
    },
    {
      id: "node-7-final-answer",
      type: "Final Answer",
      inputs: {
        answerExtractionNodeId: "node-5-cp-specific-answer-extraction",
      },
      outputs: {
        answer: solver.answer,
        resolvedNumber: solver.resolvedNumber,
        verification: solver.verification,
      },
    },
  ];

  const edges: NsRem001ReasoningEdge[] = [
    { from: nodes[0].id, to: nodes[1].id, relationship: "passes structural instance into target remainder check" },
    { from: nodes[1].id, to: nodes[2].id, relationship: "uses approved remainder target for candidate generation" },
    { from: nodes[2].id, to: nodes[3].id, relationship: "evaluates candidates against target remainder" },
    { from: nodes[3].id, to: nodes[4].id, relationship: "extracts CP-specific answer from valid value set" },
    { from: nodes[4].id, to: nodes[5].id, relationship: "prepares approved explanation fields" },
    { from: nodes[5].id, to: nodes[6].id, relationship: "produces final answer" },
  ];

  return {
    graphId: `NS-REM-001:${parameters.canonicalProblemId}:GRAPH:${parameters.questionId}`,
    archetypeId: NS_REM_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges,
    answerNodeId: "node-7-final-answer",
  };
}

export const buildCp001ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp002ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp003ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp004ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp005ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp006ReasoningGraph = buildNsRem001ReasoningGraph;
export const buildCp007ReasoningGraph = buildNsRem001ReasoningGraph;

export function expectedAnswerRule(canonicalProblemId: string) {
  switch (canonicalProblemId) {
    case NS_REM_001_CP_001:
      return "Unique Valid Value";
    case NS_REM_001_CP_002:
      return "Minimum(Valid Value Set)";
    case NS_REM_001_CP_003:
      return "Maximum(Valid Value Set)";
    case NS_REM_001_CP_004:
      return "Count(Valid Value Set)";
    case NS_REM_001_CP_005:
      return "Sum(Valid Value Set)";
    case NS_REM_001_CP_006:
      return "Number formed using Minimum(Valid Value Set)";
    case NS_REM_001_CP_007:
      return "Number formed using Maximum(Valid Value Set)";
    default:
      throw new Error(`Unsupported NS-REM-001 canonical problem: ${canonicalProblemId}`);
  }
}
