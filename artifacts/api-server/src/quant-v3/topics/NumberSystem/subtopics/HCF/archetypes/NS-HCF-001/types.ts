export const NS_HCF_001_ARCHETYPE_ID = "NS-HCF-001" as const;
export const NS_HCF_001_CP_001 = "CP-001" as const;
export const NS_HCF_001_CP_002 = "CP-002" as const;
export const NS_HCF_001_CP_003 = "CP-003" as const;
export const NS_HCF_001_CP_004 = "CP-004" as const;

export type NsHcf001CanonicalProblemId =
  | typeof NS_HCF_001_CP_001
  | typeof NS_HCF_001_CP_002
  | typeof NS_HCF_001_CP_003
  | typeof NS_HCF_001_CP_004;

export type NsHcf001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsHcf001Answer = number;
export type NsHcf001Cp003Family = "bounded_range" | "candidate_set" | "divisibility_restriction" | "arithmetic_restriction" | "exam_mixed";
export type NsHcf001Topology = "Direct HCF" | "Common Divisor Count" | "Missing Number Using HCF" | "Equal Grouping Application";

export interface NsHcf001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsHcf001FactorTerm {
  prime: number;
  exponent: number;
  power: number;
}

export interface NsHcf001MathJaxFields {
  operandFactorizationLatex: string;
  commonPrimeIntersectionLatex: string;
  minimumExponentSelectionLatex: string;
  hcfLatex: string;
  hcfFactorCountFormulaLatex: string;
  candidateEvaluationLatex: string;
  groupingInterpretationLatex: string;
}

export interface NsHcf001Parameters {
  archetypeId: typeof NS_HCF_001_ARCHETYPE_ID;
  canonicalProblemId: NsHcf001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsHcf001SourceTrace;
  topology: NsHcf001Topology;
  difficultyBand: NsHcf001DifficultyBand;
  questionLanguageId: string;
  numbers: number[];
  knownOperands?: number[];
  targetHcf?: number;
  cp003Family?: NsHcf001Cp003Family;
  candidateValues?: number[];
  missingNumber?: number;
  rangeStart?: number;
  rangeEnd?: number;
  numberList?: string;
  divisibleBy?: number;
  notDivisibleBy?: number;
  baseNumber?: number;
  increase?: number;
  decrease?: number;
  contextQuantities?: number[];
}

export interface NsHcf001SolverResult extends NsHcf001MathJaxFields {
  archetypeId: typeof NS_HCF_001_ARCHETYPE_ID;
  canonicalProblemId: NsHcf001CanonicalProblemId;
  topology: NsHcf001Topology;
  numbers: number[];
  knownOperands?: number[];
  targetHcf?: number;
  cp003Family?: NsHcf001Cp003Family;
  candidateValues: number[];
  validCandidates: number[];
  missingNumber?: number;
  hcf: number;
  answer: number;
  commonDivisorCount?: number;
  operandPrimeFactorizations: NsHcf001FactorTerm[][];
  hcfPrimeFactorization: NsHcf001FactorTerm[];
  verification: {
    inputValid: boolean;
    hcfValid: boolean;
    commonDivisorCountValid: boolean;
    uniquenessValid: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsHcf001ReasoningNodeType =
  | "Input Capture"
  | "Prime Factorization"
  | "HCF Computation"
  | "Factor Count"
  | "Apply HCF Condition"
  | "Generate Candidates"
  | "Apply Extra Condition"
  | "Eliminate Invalid Candidates"
  | "Context Interpretation"
  | "Equal Grouping Rule"
  | "Answer Extraction";

export interface NsHcf001ReasoningNode {
  id: string;
  type: NsHcf001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsHcf001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsHcf001ReasoningGraph extends NsHcf001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_HCF_001_ARCHETYPE_ID;
  canonicalProblemId: NsHcf001CanonicalProblemId;
  sourceTrace: NsHcf001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsHcf001ReasoningNode[];
  edges: readonly NsHcf001ReasoningEdge[];
}

export interface NsHcf001Explanation extends NsHcf001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsHcf001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsHcf001TraceabilityPackage extends NsHcf001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsHcf001CanonicalProblemId;
  questionLanguageId: string;
  explanationStyleId: string;
  difficulty: NsHcf001DifficultyBand;
  difficultyBand: NsHcf001DifficultyBand;
  topology: NsHcf001Topology;
  reasoningGraphId: string;
  graphId: string;
  answer: number;
  cp003Family?: NsHcf001Cp003Family;
}

export interface NsHcf001QuestionPackage extends NsHcf001MathJaxFields {
  archetypeId: typeof NS_HCF_001_ARCHETYPE_ID;
  canonicalProblemId: NsHcf001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsHcf001SourceTrace;
  topology: NsHcf001Topology;
  difficultyBand: NsHcf001DifficultyBand;
  difficulty: NsHcf001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: number;
  numbers: number[];
  cp003Family?: NsHcf001Cp003Family;
  parameters: NsHcf001Parameters;
  solver: NsHcf001SolverResult;
  reasoningGraph: NsHcf001ReasoningGraph;
  explanation: NsHcf001Explanation;
  traceability: NsHcf001TraceabilityPackage;
  validation: NsHcf001ValidationResult;
}

export interface NsHcf001AuditReport {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
  mathJaxFailures: number;
  unusedQuestionLanguageIds: readonly string[];
  unusedExplanationIds: readonly string[];
  maximumExactQuestionRepetition: number;
  repeatedQuestionExamples: readonly string[];
  difficultyDistribution: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  cpFamilyDistribution: Record<string, number>;
  contextFamilyDistribution: Record<string, number>;
  operandCountDistribution: Record<string, number>;
  hcfValueDistribution: Record<string, number>;
  mathJaxObjectCoverage: Record<string, number>;
}
