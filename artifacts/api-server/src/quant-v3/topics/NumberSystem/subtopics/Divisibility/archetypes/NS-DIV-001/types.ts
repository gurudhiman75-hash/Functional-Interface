export const NS_DIV_001_ARCHETYPE_ID = "NS-DIV-001" as const;
export const NS_DIV_001_CANONICAL_PROBLEM_ID = "CP-001" as const;
export const NS_DIV_001_REASONING_PATTERN_ID = "RP-001" as const;

export type NsDiv001ArchetypeId = typeof NS_DIV_001_ARCHETYPE_ID;
export type NsDiv001CanonicalProblemId = typeof NS_DIV_001_CANONICAL_PROBLEM_ID;
export type NsDiv001ReasoningPatternId = string;

export interface NsDiv001SourceTrace {
  sourceId: string;
  sourceType: "reference-vertical-slice";
  note: string;
}

export interface Cp001Parameters {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001CanonicalProblemId;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  divisorCapabilityId: string;
  numberExpression: string;
  missingDigitSymbol: string;
  knownDigits: readonly number[];
  missingPosition: number;
  numberLength: number;
  divisor: number;
  divisorComponents?: readonly number[];
  candidateDomain: readonly number[];
}

export interface Cp001SolverResult {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001CanonicalProblemId;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  knownDigitSum: number;
  validCandidates: readonly number[];
  answerDigit: number;
  resolvedNumber: number;
  verification: {
    digitSum: number;
    divisor: number;
    isDivisible: boolean;
  };
}

export type Cp001ReasoningNodeType =
  | "Problem Recognition"
  | "Divisor Recognition"
  | "Rule Selection"
  | "Condition Construction"
  | "Candidate Evaluation"
  | "Verification"
  | "Answer Production";

export interface Cp001ReasoningNode {
  id: string;
  type: Cp001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface Cp001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface Cp001ReasoningGraph {
  graphId: string;
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001CanonicalProblemId;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  nodes: readonly Cp001ReasoningNode[];
  edges: readonly Cp001ReasoningEdge[];
  answerNodeId: string;
}

export interface Cp001Explanation {
  graphId: string;
  variantId: string;
  lines: readonly string[];
}

export interface Cp001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface Cp001QuestionPackage {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001CanonicalProblemId;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  stemFamilyId: string;
  stem: string;
  answer: number;
  parameters: Cp001Parameters;
  solver: Cp001SolverResult;
  reasoningGraph: Cp001ReasoningGraph;
  explanation: Cp001Explanation;
  validation: Cp001ValidationResult;
}
