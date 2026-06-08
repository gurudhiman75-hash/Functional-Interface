export const NS_LCM_001_ARCHETYPE_ID = "NS-LCM-001" as const;
export const NS_LCM_001_CP_001 = "CP-001" as const;
export const NS_LCM_001_CP_002 = "CP-002" as const;
export const NS_LCM_001_CP_003 = "CP-003" as const;
export const NS_LCM_001_CP_004 = "CP-004" as const;
export const NS_LCM_001_CP_005 = "CP-005" as const;

export type NsLcm001CanonicalProblemId =
  | typeof NS_LCM_001_CP_001
  | typeof NS_LCM_001_CP_002
  | typeof NS_LCM_001_CP_003
  | typeof NS_LCM_001_CP_004
  | typeof NS_LCM_001_CP_005;

export type NsLcm001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsLcm001Answer = number;
export type NsLcm001Cp003Family = "candidate_list" | "bounded_range" | "divisibility_condition" | "arithmetic_condition";
export type NsLcm001CycleContext =
  | "bells"
  | "lights"
  | "alarms"
  | "runners"
  | "machines"
  | "buses"
  | "trains"
  | "traffic_signals"
  | "sprinklers"
  | "cleaning_schedules";
export type NsLcm001Topology =
  | "Direct LCM Computation"
  | "Common Cycle Synchronization"
  | "Missing Number Using LCM"
  | "Count Common Multiples In A Range"
  | "Smallest Common Multiple Greater Than A Threshold";

export interface NsLcm001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsLcm001FactorTerm {
  prime: number;
  exponent: number;
  power: number;
}

export interface NsLcm001MathJaxFields {
  operandFactorizationLatex: string;
  primeUnionLatex: string;
  maximumExponentSelectionLatex: string;
  lcmLatex: string;
  synchronizationInterpretationLatex: string;
  candidateEvaluationLatex: string;
  rangeCountFormulaLatex: string;
  thresholdSelectionFormulaLatex: string;
}

export interface NsLcm001Parameters {
  archetypeId: typeof NS_LCM_001_ARCHETYPE_ID;
  canonicalProblemId: NsLcm001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsLcm001SourceTrace;
  topology: NsLcm001Topology;
  difficultyBand: NsLcm001DifficultyBand;
  questionLanguageId: string;
  numbers: number[];
  cycleLengths?: number[];
  cycleContext?: NsLcm001CycleContext;
  knownNumbers?: number[];
  targetLcm?: number;
  cp003Family?: NsLcm001Cp003Family;
  candidateValues?: number[];
  missingNumber?: number;
  candidateSet?: string;
  lowerBound?: number;
  upperBound?: number;
  divisor?: number;
  threshold?: number;
}

export interface NsLcm001SolverResult extends NsLcm001MathJaxFields {
  archetypeId: typeof NS_LCM_001_ARCHETYPE_ID;
  canonicalProblemId: NsLcm001CanonicalProblemId;
  topology: NsLcm001Topology;
  numbers: number[];
  cycleLengths?: number[];
  cycleContext?: NsLcm001CycleContext;
  knownNumbers?: number[];
  targetLcm?: number;
  cp003Family?: NsLcm001Cp003Family;
  candidateValues: number[];
  validCandidates: number[];
  missingNumber?: number;
  lowerBound?: number;
  upperBound?: number;
  threshold?: number;
  lcm: number;
  answer: number;
  operandPrimeFactorizations: NsLcm001FactorTerm[][];
  lcmPrimeFactorization: NsLcm001FactorTerm[];
  distinctPrimeBaseCount: number;
  maximumExponent: number;
  operandCount: number;
  pairwiseCoprime: boolean;
  nonCoprime: boolean;
  rangeWidth?: number;
  zeroCountCase?: boolean;
  positiveCountCase?: boolean;
  thresholdIsMultiple?: boolean;
  thresholdNotMultiple?: boolean;
  exactLcmMatch?: boolean;
  verification: {
    inputValid: boolean;
    lcmValid: boolean;
    countValid: boolean;
    thresholdValid: boolean;
    uniquenessValid: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsLcm001ReasoningNodeType =
  | "Input Capture"
  | "Prime Factorization"
  | "Prime Union"
  | "Maximum Exponent Selection"
  | "LCM Construction"
  | "Synchronization Interpretation"
  | "Candidate Generation"
  | "Candidate Evaluation"
  | "Range Count"
  | "Threshold Selection"
  | "Answer Extraction";

export interface NsLcm001ReasoningNode {
  id: string;
  type: NsLcm001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsLcm001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsLcm001ReasoningGraph extends NsLcm001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_LCM_001_ARCHETYPE_ID;
  canonicalProblemId: NsLcm001CanonicalProblemId;
  sourceTrace: NsLcm001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsLcm001ReasoningNode[];
  edges: readonly NsLcm001ReasoningEdge[];
}

export interface NsLcm001Explanation extends NsLcm001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsLcm001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsLcm001TraceabilityPackage extends NsLcm001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsLcm001CanonicalProblemId;
  questionLanguageId: string;
  explanationStyleId: string;
  difficulty: NsLcm001DifficultyBand;
  difficultyBand: NsLcm001DifficultyBand;
  topology: NsLcm001Topology;
  reasoningGraphId: string;
  graphId: string;
  answer: number;
  cycleContext?: NsLcm001CycleContext;
  cp003Family?: NsLcm001Cp003Family;
}

export interface NsLcm001QuestionPackage extends NsLcm001MathJaxFields {
  archetypeId: typeof NS_LCM_001_ARCHETYPE_ID;
  canonicalProblemId: NsLcm001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsLcm001SourceTrace;
  topology: NsLcm001Topology;
  difficultyBand: NsLcm001DifficultyBand;
  difficulty: NsLcm001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: number;
  numbers: number[];
  cycleContext?: NsLcm001CycleContext;
  cp003Family?: NsLcm001Cp003Family;
  parameters: NsLcm001Parameters;
  solver: NsLcm001SolverResult;
  reasoningGraph: NsLcm001ReasoningGraph;
  explanation: NsLcm001Explanation;
  traceability: NsLcm001TraceabilityPackage;
  validation: NsLcm001ValidationResult;
}

export interface NsLcm001AuditReport {
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
  operandCountCoverage: Record<string, number>;
  pairwiseCoprimeCoverage: Record<string, number>;
  nonCoprimeCoverage: Record<string, number>;
  lcmSizeCoverage: Record<string, number>;
  distinctPrimeBaseCountCoverage: Record<string, number>;
  maximumExponentCoverage: Record<string, number>;
  cycleContextCoverage: Record<string, number>;
  cp003FamilyCoverage: Record<string, number>;
  rangeWidthCoverage: Record<string, number>;
  zeroCountCaseCoverage: Record<string, number>;
  positiveCountCaseCoverage: Record<string, number>;
  thresholdIsMultipleCoverage: Record<string, number>;
  thresholdNotMultipleCoverage: Record<string, number>;
  exactLcmMatchCoverage: Record<string, number>;
  mathJaxObjectCoverage: Record<string, number>;
}
