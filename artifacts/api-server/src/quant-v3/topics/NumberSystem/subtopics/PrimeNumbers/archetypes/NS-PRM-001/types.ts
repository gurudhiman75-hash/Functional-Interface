export const NS_PRM_001_ARCHETYPE_ID = "NS-PRM-001" as const;
export const NS_PRM_001_CP_001 = "CP-001" as const;
export const NS_PRM_001_CP_002 = "CP-002" as const;
export const NS_PRM_001_CP_003 = "CP-003" as const;
export const NS_PRM_001_CP_004 = "CP-004" as const;
export const NS_PRM_001_CP_005 = "CP-005" as const;
export const NS_PRM_001_CP_006 = "CP-006" as const;
export const NS_PRM_001_CP_007 = "CP-007" as const;
export const NS_PRM_001_CP_008 = "CP-008" as const;

export const NS_PRM_001_REASONING_PATTERN_ID = "RP-PRM-001" as const;

export type NsPrm001CanonicalProblemId =
  | typeof NS_PRM_001_CP_001
  | typeof NS_PRM_001_CP_002
  | typeof NS_PRM_001_CP_003
  | typeof NS_PRM_001_CP_004
  | typeof NS_PRM_001_CP_005
  | typeof NS_PRM_001_CP_006
  | typeof NS_PRM_001_CP_007
  | typeof NS_PRM_001_CP_008;

export type NsPrm001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsPrm001Topology =
  | "Prime Classification"
  | "Range Counting"
  | "Range Search Minimum"
  | "Range Search Maximum"
  | "Range Summation"
  | "Forward Prime Search"
  | "Backward Prime Search"
  | "Prime Enumeration / Position Lookup";
export type NsPrm001Answer = number | "Prime" | "Composite";

export interface NsPrm001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsPrm001Parameters {
  archetypeId: typeof NS_PRM_001_ARCHETYPE_ID;
  canonicalProblemId: NsPrm001CanonicalProblemId;
  questionId: string;
  reasoningPatternId: typeof NS_PRM_001_REASONING_PATTERN_ID;
  sourceTrace: NsPrm001SourceTrace;
  topology: NsPrm001Topology;
  difficultyBand: NsPrm001DifficultyBand;
  number?: number;
  lowerBound?: number;
  upperBound?: number;
  rangeWidth?: number;
  position?: number;
}

export interface NsPrm001SolverResult {
  archetypeId: typeof NS_PRM_001_ARCHETYPE_ID;
  canonicalProblemId: NsPrm001CanonicalProblemId;
  reasoningPatternId: typeof NS_PRM_001_REASONING_PATTERN_ID;
  topology: NsPrm001Topology;
  answer: NsPrm001Answer;
  number?: number;
  lowerBound?: number;
  upperBound?: number;
  rangeWidth?: number;
  position?: number;
  primesInRange: readonly number[];
  selectedPrime?: number;
  count?: number;
  sum?: number;
  answerClass?: "Prime" | "Composite";
  verification: {
    inputValid: boolean;
    primeEvidenceValid: boolean;
    rangeValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsPrm001ReasoningNodeType =
  | "Problem Recognition"
  | "Parameter Integrity"
  | "Prime Evidence"
  | "Range Evaluation"
  | "Search Evaluation"
  | "Answer Extraction"
  | "Explanation Data"
  | "Final Answer";

export interface NsPrm001ReasoningNode {
  id: string;
  type: NsPrm001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsPrm001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsPrm001ReasoningGraph {
  graphId: string;
  archetypeId: typeof NS_PRM_001_ARCHETYPE_ID;
  canonicalProblemId: NsPrm001CanonicalProblemId;
  reasoningPatternId: typeof NS_PRM_001_REASONING_PATTERN_ID;
  sourceTrace: NsPrm001SourceTrace;
  nodes: readonly NsPrm001ReasoningNode[];
  edges: readonly NsPrm001ReasoningEdge[];
  answerNodeId: string;
}

export interface NsPrm001Explanation {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsPrm001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsPrm001QuestionPackage {
  archetypeId: typeof NS_PRM_001_ARCHETYPE_ID;
  canonicalProblemId: NsPrm001CanonicalProblemId;
  questionId: string;
  reasoningPatternId: typeof NS_PRM_001_REASONING_PATTERN_ID;
  sourceTrace: NsPrm001SourceTrace;
  topology: NsPrm001Topology;
  difficultyBand: NsPrm001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: NsPrm001Answer;
  parameters: NsPrm001Parameters;
  solver: NsPrm001SolverResult;
  reasoningGraph: NsPrm001ReasoningGraph;
  explanation: NsPrm001Explanation;
  validation: NsPrm001ValidationResult;
}

export interface NsPrm001AuditReport {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
  difficultyDistribution: Record<string, number>;
  primeCompositeDistribution: Record<string, number>;
  rangeBucketDistribution: Record<string, number>;
  positionBucketDistribution: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  topologyDistribution: Record<string, number>;
}
