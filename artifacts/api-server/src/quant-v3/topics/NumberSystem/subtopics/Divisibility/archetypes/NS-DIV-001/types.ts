export const NS_DIV_001_ARCHETYPE_ID = "NS-DIV-001" as const;
export const NS_DIV_001_CANONICAL_PROBLEM_ID = "CP-001" as const;
export const NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID = "CP-002" as const;
export const NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID = "CP-003" as const;
export const NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID = "CP-004" as const;
export const NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID = "CP-005" as const;
export const NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID = "CP-006" as const;
export const NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID = "CP-007" as const;
export const NS_DIV_001_REASONING_PATTERN_ID = "RP-001" as const;

export type NsDiv001ArchetypeId = typeof NS_DIV_001_ARCHETYPE_ID;
export type NsDiv001CanonicalProblemId =
  | typeof NS_DIV_001_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID;
export type NsDiv001ValidDigitSetCanonicalProblemId =
  | typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID
  | typeof NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID;
export type NsDiv001ReasoningPatternId = string;

export interface NsDiv001SourceTrace {
  sourceId: string;
  sourceType: "reference-vertical-slice";
  note: string;
}

export interface Cp001Parameters {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: typeof NS_DIV_001_CANONICAL_PROBLEM_ID;
  questionId: string;
  patternId: string;
  instanceId: string;
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

export interface Cp002Parameters {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: typeof NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID;
  questionId: string;
  patternId: string;
  instanceId: string;
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

export interface ValidDigitSetParameters {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId;
  questionId: string;
  patternId: string;
  instanceId: string;
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

export type Cp003Parameters = ValidDigitSetParameters & { canonicalProblemId: typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID };
export type Cp004Parameters = ValidDigitSetParameters & { canonicalProblemId: typeof NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID };
export type Cp005Parameters = ValidDigitSetParameters & { canonicalProblemId: typeof NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID };
export type Cp006Parameters = ValidDigitSetParameters & { canonicalProblemId: typeof NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID };
export type Cp007Parameters = ValidDigitSetParameters & { canonicalProblemId: typeof NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID };

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

export interface Cp002CandidateEvaluation {
  candidate: number;
  resolvedNumber: number;
  isValid: boolean;
}

export interface Cp002SolverResult {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: typeof NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  knownDigitSum: number;
  candidateDigitSet: readonly number[];
  candidateEvaluations: readonly Cp002CandidateEvaluation[];
  validDigitSet: readonly number[];
  sortedValidDigitSet: readonly number[];
  largestValidDigit: number;
  answerDigit: number;
  resolvedNumber: number;
  selectionMetadata: {
    sortingOrder: "Ascending";
    selectionRule: "Select maximum element.";
    validSetSize: number;
  };
  verification: {
    divisor: number;
    isDivisible: boolean;
    selectedDigitIsMaximum: boolean;
  };
}

export interface Cp003SolverResult {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  knownDigitSum: number;
  candidateDigitSet: readonly number[];
  candidateEvaluations: readonly Cp002CandidateEvaluation[];
  validDigitSet: readonly number[];
  sortedValidDigitSet: readonly number[];
  selectedDigit?: number;
  smallestValidDigit?: number;
  largestValidDigit?: number;
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
    isDivisible: boolean;
    answerRuleSatisfied: boolean;
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

export type Cp002ReasoningNodeType =
  | "Recognize Divisor"
  | "Select Divisibility Rule"
  | "Generate Candidate Digit Set"
  | "Evaluate Candidates"
  | "Build Valid Digit Set"
  | "Select Largest Valid Digit"
  | "Verify Result";

export type Cp003ReasoningNodeType =
  | "Problem Recognition"
  | "Divisor Recognition"
  | "Rule Selection"
  | "Candidate Generation"
  | "Valid Digit Identification"
  | "Minimum Selection"
  | "Maximum Selection"
  | "Counting"
  | "Summation"
  | "Number Formation"
  | "Answer Production";

export interface Cp001ReasoningNode {
  id: string;
  type: Cp001ReasoningNodeType | Cp002ReasoningNodeType | Cp003ReasoningNodeType;
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
  styleId: string;
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
  questionId: string;
  patternId: string;
  instanceId: string;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  stemFamilyId: string;
  questionLanguageId: string;
  stem: string;
  answer: number;
  parameters: Cp001Parameters;
  solver: Cp001SolverResult;
  reasoningGraph: Cp001ReasoningGraph;
  explanation: Cp001Explanation;
  validation: Cp001ValidationResult;
}

export interface Cp002QuestionPackage {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: typeof NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID;
  questionId: string;
  patternId: string;
  instanceId: string;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  stemFamilyId: string;
  questionLanguageId: string;
  stem: string;
  answer: number;
  parameters: Cp002Parameters;
  solver: Cp002SolverResult;
  reasoningGraph: Cp001ReasoningGraph;
  explanation: Cp001Explanation;
  validation: Cp001ValidationResult;
}

export interface Cp003QuestionPackage {
  archetypeId: NsDiv001ArchetypeId;
  canonicalProblemId: typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID;
  questionId: string;
  patternId: string;
  instanceId: string;
  reasoningPatternId: NsDiv001ReasoningPatternId;
  sourceTrace: NsDiv001SourceTrace;
  stemFamilyId: string;
  questionLanguageId: string;
  stem: string;
  answer: number;
  parameters: Cp003Parameters;
  solver: Cp003SolverResult;
  reasoningGraph: Cp001ReasoningGraph;
  explanation: Cp001Explanation;
  validation: Cp001ValidationResult;
}

export type Cp004QuestionPackage = Omit<Cp003QuestionPackage, "canonicalProblemId" | "parameters"> & {
  canonicalProblemId: typeof NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID;
  parameters: Cp004Parameters;
};
export type Cp005QuestionPackage = Omit<Cp003QuestionPackage, "canonicalProblemId" | "parameters"> & {
  canonicalProblemId: typeof NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID;
  parameters: Cp005Parameters;
};
export type Cp006QuestionPackage = Omit<Cp003QuestionPackage, "canonicalProblemId" | "parameters"> & {
  canonicalProblemId: typeof NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID;
  parameters: Cp006Parameters;
};
export type Cp007QuestionPackage = Omit<Cp003QuestionPackage, "canonicalProblemId" | "parameters"> & {
  canonicalProblemId: typeof NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID;
  parameters: Cp007Parameters;
};
export type ValidDigitSetQuestionPackage =
  | Cp003QuestionPackage
  | Cp004QuestionPackage
  | Cp005QuestionPackage
  | Cp006QuestionPackage
  | Cp007QuestionPackage;
