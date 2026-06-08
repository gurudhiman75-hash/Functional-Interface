export const NS_REM_001_ARCHETYPE_ID = "NS-REM-001" as const;
export const NS_REM_001_CP_001 = "CP-001" as const;
export const NS_REM_001_CP_002 = "CP-002" as const;
export const NS_REM_001_CP_003 = "CP-003" as const;
export const NS_REM_001_CP_004 = "CP-004" as const;
export const NS_REM_001_CP_005 = "CP-005" as const;
export const NS_REM_001_CP_006 = "CP-006" as const;
export const NS_REM_001_CP_007 = "CP-007" as const;
export const NS_REM_001_REASONING_PATTERN_ID = "RP-REM-001" as const;

export type NsRem001CanonicalProblemId =
  | typeof NS_REM_001_CP_001
  | typeof NS_REM_001_CP_002
  | typeof NS_REM_001_CP_003
  | typeof NS_REM_001_CP_004
  | typeof NS_REM_001_CP_005
  | typeof NS_REM_001_CP_006
  | typeof NS_REM_001_CP_007;

export interface NsRem001SourceTrace {
  sourceId: string;
  sourceType: "approved-implementation-phase";
  note: string;
}

export interface NsRem001Parameters {
  archetypeId: typeof NS_REM_001_ARCHETYPE_ID;
  canonicalProblemId: NsRem001CanonicalProblemId;
  questionId: string;
  patternId: string;
  instanceId: string;
  reasoningPatternId: typeof NS_REM_001_REASONING_PATTERN_ID;
  sourceTrace: NsRem001SourceTrace;
  numberExpression: string;
  missingDigitSymbol: "x";
  knownDigits: readonly number[];
  missingPosition: number;
  numberLength: number;
  divisor: number;
  targetRemainder: number;
  candidateDomain: readonly number[];
  difficultyBand: "Easy" | "Medium" | "Hard";
}

export interface NsRem001CandidateEvaluation {
  candidate: number;
  resolvedNumber: number;
  remainder: number;
  isValid: boolean;
}

export interface NsRem001SolverResult {
  archetypeId: typeof NS_REM_001_ARCHETYPE_ID;
  canonicalProblemId: NsRem001CanonicalProblemId;
  reasoningPatternId: typeof NS_REM_001_REASONING_PATTERN_ID;
  candidateDigitSet: readonly number[];
  candidateEvaluations: readonly NsRem001CandidateEvaluation[];
  validValueSet: readonly number[];
  sortedValidValueSet: readonly number[];
  selectedValue?: number;
  smallestValidValue?: number;
  greatestValidValue?: number;
  formedNumber?: number;
  answer: number;
  answerDigit: number;
  resolvedNumber: number;
  selectionMetadata: {
    sortingOrder: "Ascending";
    selectionRule: string;
    validSetSize: number;
  };
  verification: {
    divisor: number;
    targetRemainder: number;
    resolvedNumberRemainder: number;
    targetRemainderSatisfied: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsRem001ReasoningNodeType =
  | "Pattern Integrity"
  | "Target Remainder Integrity"
  | "Candidate Generation"
  | "Valid Value Set"
  | "CP Specific Answer Extraction"
  | "Explanation Data"
  | "Final Answer";

export interface NsRem001ReasoningNode {
  id: string;
  type: NsRem001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsRem001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsRem001ReasoningGraph {
  graphId: string;
  archetypeId: typeof NS_REM_001_ARCHETYPE_ID;
  canonicalProblemId: NsRem001CanonicalProblemId;
  reasoningPatternId: typeof NS_REM_001_REASONING_PATTERN_ID;
  sourceTrace: NsRem001SourceTrace;
  nodes: readonly NsRem001ReasoningNode[];
  edges: readonly NsRem001ReasoningEdge[];
  answerNodeId: string;
}

export interface NsRem001Explanation {
  graphId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsRem001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsRem001QuestionPackage {
  archetypeId: typeof NS_REM_001_ARCHETYPE_ID;
  canonicalProblemId: NsRem001CanonicalProblemId;
  questionId: string;
  patternId: string;
  instanceId: string;
  reasoningPatternId: typeof NS_REM_001_REASONING_PATTERN_ID;
  sourceTrace: NsRem001SourceTrace;
  questionLanguageId: string;
  explanationStyleId: string;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  answer: number;
  parameters: NsRem001Parameters;
  solver: NsRem001SolverResult;
  reasoningGraph: NsRem001ReasoningGraph;
  explanation: NsRem001Explanation;
  validation: NsRem001ValidationResult;
}

export interface NsRem001AuditReport {
  questionCount: number;
  patternDistribution: Record<string, number>;
  divisorDistribution: Record<string, number>;
  targetRemainderDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
}
