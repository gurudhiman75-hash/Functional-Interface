import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
  type Cp001ReasoningEdge,
  type Cp001ReasoningGraph,
  type Cp001ReasoningNode,
  type Cp001SolverResult,
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
      },
      outputs: {
        recognized: true,
        requestedOutputType: "single digit",
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
