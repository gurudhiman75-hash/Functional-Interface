export const NS_REM_002_ARCHETYPE_ID = "NS-REM-002" as const;
export const NS_REM_002_CP_001 = "CP-001" as const;
export const NS_REM_002_CP_002 = "CP-002" as const;
export const NS_REM_002_CP_003 = "CP-003" as const;
export const NS_REM_002_CP_004 = "CP-004" as const;
export const NS_REM_002_CP_005 = "CP-005" as const;
export const NS_REM_002_CP_006 = "CP-006" as const;
export const NS_REM_002_CP_007 = "CP-007" as const;
export const NS_REM_002_CP_008 = "CP-008" as const;
export const NS_REM_002_CP_009 = "CP-009" as const;

export const NS_REM_002_REASONING_PATTERN_ID = "RP-REM-002" as const;

export type NsRem002CanonicalProblemId =
  | typeof NS_REM_002_CP_001
  | typeof NS_REM_002_CP_002
  | typeof NS_REM_002_CP_003
  | typeof NS_REM_002_CP_004
  | typeof NS_REM_002_CP_005
  | typeof NS_REM_002_CP_006
  | typeof NS_REM_002_CP_007
  | typeof NS_REM_002_CP_008
  | typeof NS_REM_002_CP_009;

export type NsRem002DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsRem002Topology = "Direct Reconstruction" | "Bounded Search" | "Range Counting" | "Range Summation" | "Missing Component";

export interface NsRem002SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsRem002Parameters {
  archetypeId: typeof NS_REM_002_ARCHETYPE_ID;
  canonicalProblemId: NsRem002CanonicalProblemId;
  questionId: string;
  reasoningPatternId: typeof NS_REM_002_REASONING_PATTERN_ID;
  sourceTrace: NsRem002SourceTrace;
  topology: NsRem002Topology;
  difficultyBand: NsRem002DifficultyBand;
  divisor?: number;
  quotient?: number;
  remainder?: number;
  dividend?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface NsRem002SolverResult {
  archetypeId: typeof NS_REM_002_ARCHETYPE_ID;
  canonicalProblemId: NsRem002CanonicalProblemId;
  reasoningPatternId: typeof NS_REM_002_REASONING_PATTERN_ID;
  topology: NsRem002Topology;
  answer: number;
  dividend?: number;
  divisor?: number;
  quotient?: number;
  remainder?: number;
  lowerBound?: number;
  upperBound?: number;
  validNumbers: readonly number[];
  firstValidNumber?: number;
  lastValidNumber?: number;
  count?: number;
  sum?: number;
  selectionRule: string;
  verification: {
    equationConsistent: boolean;
    remainderValid: boolean;
    rangeValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsRem002ReasoningNodeType =
  | "Problem Recognition"
  | "Parameter Integrity"
  | "Equation Consistency"
  | "Remainder Condition"
  | "Range Evaluation"
  | "Answer Extraction"
  | "Explanation Data"
  | "Final Answer";

export interface NsRem002ReasoningNode {
  id: string;
  type: NsRem002ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsRem002ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsRem002ReasoningGraph {
  graphId: string;
  archetypeId: typeof NS_REM_002_ARCHETYPE_ID;
  canonicalProblemId: NsRem002CanonicalProblemId;
  reasoningPatternId: typeof NS_REM_002_REASONING_PATTERN_ID;
  sourceTrace: NsRem002SourceTrace;
  nodes: readonly NsRem002ReasoningNode[];
  edges: readonly NsRem002ReasoningEdge[];
  answerNodeId: string;
}

export interface NsRem002Explanation {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsRem002ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsRem002QuestionPackage {
  archetypeId: typeof NS_REM_002_ARCHETYPE_ID;
  canonicalProblemId: NsRem002CanonicalProblemId;
  questionId: string;
  reasoningPatternId: typeof NS_REM_002_REASONING_PATTERN_ID;
  sourceTrace: NsRem002SourceTrace;
  topology: NsRem002Topology;
  difficultyBand: NsRem002DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: number;
  parameters: NsRem002Parameters;
  solver: NsRem002SolverResult;
  reasoningGraph: NsRem002ReasoningGraph;
  explanation: NsRem002Explanation;
  validation: NsRem002ValidationResult;
}

export interface NsRem002AuditReport {
  questionCount: number;
  difficultyDistribution: Record<string, number>;
  divisorDistribution: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  topologyDistribution: Record<string, number>;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
}
