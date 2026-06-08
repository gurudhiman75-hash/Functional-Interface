import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
  type Cp001ReasoningEdge,
  type Cp001ReasoningGraph,
  type Cp001ReasoningNode,
  type Cp001SolverResult,
  type Cp002Parameters,
  type Cp002SolverResult,
  type Cp003Parameters,
  type Cp003SolverResult,
  type Cp004Parameters,
  type Cp005Parameters,
  type Cp006Parameters,
  type Cp007Parameters,
  type ValidDigitSetParameters,
} from "./types";
import { assertNsDiv001DivisorCapabilityAllowed } from "./realism-library";

export function buildCp001ReasoningGraph(parameters: Cp001Parameters, solver: Cp001SolverResult): Cp001ReasoningGraph {
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const nodes: Cp001ReasoningNode[] = [
    {
      id: "node-1-problem-recognition",
      type: "Problem Recognition",
      inputs: {
        archetypeId: parameters.archetypeId,
        canonicalProblemId: parameters.canonicalProblemId,
        questionId: parameters.questionId,
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
      },
      outputs: {
        recognized: true,
        requestedOutputType: "single digit",
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
      },
    },
    {
      id: "node-2-divisor-recognition",
      type: "Divisor Recognition",
      inputs: {
        divisor: parameters.divisor,
        sourceTrace: parameters.sourceTrace.sourceId,
      },
      outputs: {
        reasoningPatternId: parameters.reasoningPatternId,
        divisorCapabilityId: parameters.divisorCapabilityId,
        divisor: parameters.divisor,
      },
    },
    {
      id: "node-3-rule-selection",
      type: "Rule Selection",
      inputs: {
        reasoningPatternId: parameters.reasoningPatternId,
      },
      outputs: {
        ruleContract: divisorCapability.reasoningPattern.name,
        ruleOwner: NS_DIV_001_ARCHETYPE_ID,
      },
    },
    {
      id: "node-4-condition-construction",
      type: "Condition Construction",
      inputs: {
        knownDigitSum: solver.knownDigitSum,
        candidateDomain: parameters.candidateDomain,
      },
      outputs: {
        condition: "resolved number must be divisible by approved divisor",
        divisor: parameters.divisor,
      },
    },
    {
      id: "node-5-candidate-evaluation",
      type: "Candidate Evaluation",
      inputs: {
        candidateDomain: parameters.candidateDomain,
        conditionNodeId: "node-4-condition-construction",
      },
      outputs: {
        validCandidates: solver.validCandidates,
        selectedCandidate: solver.answerDigit,
      },
    },
    {
      id: "node-6-verification",
      type: "Verification",
      inputs: {
        selectedCandidate: solver.answerDigit,
        resolvedNumber: solver.resolvedNumber,
      },
      outputs: {
        digitSum: solver.verification.digitSum,
        isDivisible: solver.verification.isDivisible,
      },
    },
    {
      id: "node-7-answer-production",
      type: "Answer Production",
      inputs: {
        verificationNodeId: "node-6-verification",
      },
      outputs: {
        answerDigit: solver.answerDigit,
        resolvedNumber: solver.resolvedNumber,
      },
    },
  ];

  const edges: Cp001ReasoningEdge[] = [
    { from: nodes[0].id, to: nodes[1].id, relationship: "recognizes divisor after problem ownership" },
    { from: nodes[1].id, to: nodes[2].id, relationship: "selects approved rule contract" },
    { from: nodes[2].id, to: nodes[3].id, relationship: "constructs candidate condition" },
    { from: nodes[3].id, to: nodes[4].id, relationship: "evaluates candidates against condition" },
    { from: nodes[4].id, to: nodes[5].id, relationship: "verifies selected candidate" },
    { from: nodes[5].id, to: nodes[6].id, relationship: "produces answer after verification" },
  ];

  return {
    graphId: "NS-DIV-001:CP-001:GRAPH",
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges,
    answerNodeId: "node-7-answer-production",
  };
}

export function buildCp002ReasoningGraph(parameters: Cp002Parameters, solver: Cp002SolverResult): Cp001ReasoningGraph {
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const nodes: Cp001ReasoningNode[] = [
    {
      id: "node-1-recognize-divisor",
      type: "Recognize Divisor",
      inputs: {
        archetypeId: parameters.archetypeId,
        canonicalProblemId: parameters.canonicalProblemId,
        questionId: parameters.questionId,
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
        divisor: parameters.divisor,
        sourceTrace: parameters.sourceTrace.sourceId,
      },
      outputs: {
        divisor: parameters.divisor,
        divisorCapabilityId: parameters.divisorCapabilityId,
        recognized: true,
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
      },
    },
    {
      id: "node-2-select-divisibility-rule",
      type: "Select Divisibility Rule",
      inputs: {
        divisor: parameters.divisor,
        divisorCapabilityId: parameters.divisorCapabilityId,
      },
      outputs: {
        reasoningPatternId: parameters.reasoningPatternId,
        ruleContract: divisorCapability.reasoningPattern.name,
        ruleOwner: NS_DIV_001_ARCHETYPE_ID,
      },
    },
    {
      id: "node-3-generate-candidate-digit-set",
      type: "Generate Candidate Digit Set",
      inputs: {
        missingPosition: parameters.missingPosition,
        leadingZeroRule: parameters.missingPosition === 1 ? "digit 0 prohibited" : "digit 0 allowed",
      },
      outputs: {
        candidateDigitSet: solver.candidateDigitSet,
        evaluationOrder: "Ascending",
      },
    },
    {
      id: "node-4-evaluate-candidates",
      type: "Evaluate Candidates",
      inputs: {
        candidateDigitSet: solver.candidateDigitSet,
        numberExpression: parameters.numberExpression,
        divisor: parameters.divisor,
      },
      outputs: {
        candidateEvaluationResults: solver.candidateEvaluations,
      },
    },
    {
      id: "node-5-build-valid-digit-set",
      type: "Build Valid Digit Set",
      inputs: {
        candidateEvaluationResultsNodeId: "node-4-evaluate-candidates",
      },
      outputs: {
        validDigitSet: solver.validDigitSet,
        validSetSize: solver.selectionMetadata.validSetSize,
      },
    },
    {
      id: "node-6-select-largest-valid-digit",
      type: "Select Largest Valid Digit",
      inputs: {
        validDigitSet: solver.validDigitSet,
        sortingOrder: solver.selectionMetadata.sortingOrder,
      },
      outputs: {
        sortedValidDigitSet: solver.sortedValidDigitSet,
        largestValidDigit: solver.largestValidDigit,
        selectionRule: solver.selectionMetadata.selectionRule,
      },
    },
    {
      id: "node-7-verify-result",
      type: "Verify Result",
      inputs: {
        largestValidDigit: solver.largestValidDigit,
        validDigitSet: solver.validDigitSet,
        resolvedNumber: solver.resolvedNumber,
      },
      outputs: {
        answerDigit: solver.answerDigit,
        resolvedNumber: solver.resolvedNumber,
        verificationResult: solver.verification,
      },
    },
  ];

  const edges: Cp001ReasoningEdge[] = [
    { from: nodes[0].id, to: nodes[1].id, relationship: "selects approved divisibility rule after divisor recognition" },
    { from: nodes[1].id, to: nodes[2].id, relationship: "generates candidate set after rule selection" },
    { from: nodes[2].id, to: nodes[3].id, relationship: "evaluates generated candidates" },
    { from: nodes[3].id, to: nodes[4].id, relationship: "builds valid digit set from evaluations" },
    { from: nodes[4].id, to: nodes[5].id, relationship: "selects largest digit from valid set" },
    { from: nodes[5].id, to: nodes[6].id, relationship: "verifies selected result" },
  ];

  return {
    graphId: "NS-DIV-001:CP-002:GRAPH",
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges,
    answerNodeId: "node-7-verify-result",
  };
}

export function buildCp003ReasoningGraph(parameters: Cp003Parameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  return buildValidDigitSetReasoningGraph(parameters, solver);
}

export function buildCp004ReasoningGraph(parameters: Cp004Parameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  return buildValidDigitSetReasoningGraph(parameters, solver);
}

export function buildCp005ReasoningGraph(parameters: Cp005Parameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  return buildValidDigitSetReasoningGraph(parameters, solver);
}

export function buildCp006ReasoningGraph(parameters: Cp006Parameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  return buildValidDigitSetReasoningGraph(parameters, solver);
}

export function buildCp007ReasoningGraph(parameters: Cp007Parameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  return buildValidDigitSetReasoningGraph(parameters, solver);
}

function buildValidDigitSetReasoningGraph(parameters: ValidDigitSetParameters, solver: Cp003SolverResult): Cp001ReasoningGraph {
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const extractionNode = answerExtractionNode(parameters, solver);
  const nodes: Cp001ReasoningNode[] = [
    {
      id: "node-1-problem-recognition",
      type: "Problem Recognition",
      inputs: {
        archetypeId: parameters.archetypeId,
        canonicalProblemId: parameters.canonicalProblemId,
        questionId: parameters.questionId,
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
      },
      outputs: {
        recognized: true,
        requestedOutputType: "single digit",
        patternId: parameters.patternId,
        instanceId: parameters.instanceId,
      },
    },
    {
      id: "node-2-divisor-recognition",
      type: "Divisor Recognition",
      inputs: {
        divisor: parameters.divisor,
        divisorCapabilityId: parameters.divisorCapabilityId,
        sourceTrace: parameters.sourceTrace.sourceId,
      },
      outputs: {
        divisor: parameters.divisor,
        divisorCapabilityId: parameters.divisorCapabilityId,
        reasoningPatternId: parameters.reasoningPatternId,
      },
    },
    {
      id: "node-3-rule-selection",
      type: "Rule Selection",
      inputs: {
        divisor: parameters.divisor,
        reasoningPatternId: parameters.reasoningPatternId,
      },
      outputs: {
        ruleContract: divisorCapability.reasoningPattern.name,
        ruleOwner: NS_DIV_001_ARCHETYPE_ID,
      },
    },
    {
      id: "node-4-candidate-generation",
      type: "Candidate Generation",
      inputs: {
        missingPosition: parameters.missingPosition,
        leadingZeroRule: parameters.missingPosition === 1 ? "digit 0 prohibited" : "digit 0 allowed",
      },
      outputs: {
        candidateDigitSet: solver.candidateDigitSet,
        evaluationOrder: "Ascending",
      },
    },
    {
      id: "node-5-valid-digit-identification",
      type: "Valid Digit Identification",
      inputs: {
        candidateDigitSet: solver.candidateDigitSet,
        numberExpression: parameters.numberExpression,
        divisor: parameters.divisor,
      },
      outputs: {
        validDigitSet: solver.validDigitSet,
        candidateEvaluationResults: solver.candidateEvaluations,
        validSetSize: solver.selectionMetadata.validSetSize,
      },
    },
    {
      id: extractionNode.id,
      type: extractionNode.type,
      inputs: {
        validDigitSet: solver.validDigitSet,
        sortingOrder: solver.selectionMetadata.sortingOrder,
      },
      outputs: extractionNode.outputs,
    },
    {
      id: "node-7-answer-production",
      type:
        parameters.canonicalProblemId === NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID ||
        parameters.canonicalProblemId === NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID
          ? "Number Formation"
          : "Answer Production",
      inputs: {
        selectedDigit: solver.selectedDigit,
        validDigitSet: solver.validDigitSet,
        resolvedNumber: solver.resolvedNumber,
      },
      outputs: {
        answer: solver.answer,
        answerDigit: solver.answerDigit,
        resolvedNumber: solver.resolvedNumber,
        verificationResult: solver.verification,
      },
    },
  ];

  const edges: Cp001ReasoningEdge[] = [
    { from: nodes[0].id, to: nodes[1].id, relationship: "recognizes divisor after problem ownership" },
    { from: nodes[1].id, to: nodes[2].id, relationship: "selects approved rule contract" },
    { from: nodes[2].id, to: nodes[3].id, relationship: "generates candidate set after rule selection" },
    { from: nodes[3].id, to: nodes[4].id, relationship: "identifies valid digits from generated candidates" },
    { from: nodes[4].id, to: nodes[5].id, relationship: "extracts answer from valid digit set" },
    { from: nodes[5].id, to: nodes[6].id, relationship: "produces answer after valid digit set extraction" },
  ];

  return {
    graphId: `NS-DIV-001:${parameters.canonicalProblemId}:GRAPH`,
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    nodes,
    edges,
    answerNodeId: "node-7-answer-production",
  };
}

function answerExtractionNode(parameters: ValidDigitSetParameters, solver: Cp003SolverResult) {
  switch (parameters.canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return {
        id: "node-6-minimum-selection",
        type: "Minimum Selection" as const,
        outputs: {
          sortedValidDigitSet: solver.sortedValidDigitSet,
          smallestValidDigit: solver.smallestValidDigit,
          selectionRule: solver.selectionMetadata.selectionRule,
        },
      };
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return {
        id: "node-6-counting",
        type: "Counting" as const,
        outputs: {
          validDigitSet: solver.validDigitSet,
          count: solver.answer,
          selectionRule: solver.selectionMetadata.selectionRule,
        },
      };
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return {
        id: "node-6-summation",
        type: "Summation" as const,
        outputs: {
          validDigitSet: solver.validDigitSet,
          sum: solver.answer,
          selectionRule: solver.selectionMetadata.selectionRule,
        },
      };
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
      return {
        id: "node-6-maximum-selection",
        type: "Maximum Selection" as const,
        outputs: {
          sortedValidDigitSet: solver.sortedValidDigitSet,
          largestValidDigit: solver.largestValidDigit,
          selectionRule: solver.selectionMetadata.selectionRule,
        },
      };
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return {
        id: "node-6-minimum-selection",
        type: "Minimum Selection" as const,
        outputs: {
          sortedValidDigitSet: solver.sortedValidDigitSet,
          smallestValidDigit: solver.smallestValidDigit,
          selectionRule: solver.selectionMetadata.selectionRule,
        },
      };
  }
}
