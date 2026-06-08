export const NS_PF_001_ARCHETYPE_ID = "NS-PF-001" as const;
export const NS_PF_001_CP_001 = "CP-001" as const;
export const NS_PF_001_CP_002 = "CP-002" as const;
export const NS_PF_001_CP_003 = "CP-003" as const;
export const NS_PF_001_CP_004 = "CP-004" as const;
export const NS_PF_001_CP_005 = "CP-005" as const;
export const NS_PF_001_CP_006 = "CP-006" as const;
export const NS_PF_001_CP_007 = "CP-007" as const;

export type NsPf001CanonicalProblemId =
  | typeof NS_PF_001_CP_001
  | typeof NS_PF_001_CP_002
  | typeof NS_PF_001_CP_003
  | typeof NS_PF_001_CP_004
  | typeof NS_PF_001_CP_005
  | typeof NS_PF_001_CP_006
  | typeof NS_PF_001_CP_007;

export type NsPf001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsPf001Topology =
  | "Full Prime Factorization"
  | "Total Multiplicity Count"
  | "Distinct Support Count"
  | "Prime Base Maximum"
  | "Prime Base Minimum"
  | "Selected Prime Power Lookup"
  | "Selected Exponent Lookup";

export type NsPf001Answer = number | string;

export interface NsPf001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsPf001FactorTerm {
  prime: number;
  exponent: number;
  power: number;
}

export interface NsPf001Factorization {
  number: number;
  terms: readonly NsPf001FactorTerm[];
  orderedPrimeBases: readonly number[];
  exponentsByPrime: Record<string, number>;
  repeatedPrimeFactors: readonly number[];
  totalPrimeFactorCount: number;
  distinctPrimeFactorCount: number;
  smallestPrimeFactor: number;
  largestPrimeFactor: number;
  factorizationText: string;
  factorizationLatex: string;
}

export interface NsPf001TraceabilityPackage {
  archetypeId: typeof NS_PF_001_ARCHETYPE_ID;
  canonicalProblemId: NsPf001CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationStyleId: string;
  difficultyBand: NsPf001DifficultyBand;
  factorizationText: string;
  factorizationLatex: string;
}

export interface NsPf001Parameters {
  archetypeId: typeof NS_PF_001_ARCHETYPE_ID;
  canonicalProblemId: NsPf001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsPf001SourceTrace;
  topology: NsPf001Topology;
  difficultyBand: NsPf001DifficultyBand;
  number: number;
  prime?: number;
}

export interface NsPf001SolverResult {
  archetypeId: typeof NS_PF_001_ARCHETYPE_ID;
  canonicalProblemId: NsPf001CanonicalProblemId;
  topology: NsPf001Topology;
  number: number;
  prime?: number;
  answer: NsPf001Answer;
  factorization: NsPf001Factorization;
  factorizationText: string;
  factorizationLatex: string;
  selectedPrime?: number;
  selectedExponent?: number;
  selectedPrimePower?: number;
  inputClass: "Prime" | "Composite";
  numberShape: string;
  verification: {
    inputValid: boolean;
    factorizationCorrect: boolean;
    selectedPrimeValid: boolean;
    answerRuleSatisfied: boolean;
    mathJaxValid: boolean;
  };
}

export type NsPf001ReasoningNodeType =
  | "Problem Recognition"
  | "Parameter Integrity"
  | "Prime Factorization"
  | "Answer Extraction"
  | "MathJax Evidence"
  | "Explanation Data"
  | "Traceability"
  | "Final Answer";

export interface NsPf001ReasoningNode {
  id: string;
  type: NsPf001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsPf001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsPf001ReasoningGraph {
  graphId: string;
  archetypeId: typeof NS_PF_001_ARCHETYPE_ID;
  canonicalProblemId: NsPf001CanonicalProblemId;
  sourceTrace: NsPf001SourceTrace;
  factorizationText: string;
  factorizationLatex: string;
  nodes: readonly NsPf001ReasoningNode[];
  edges: readonly NsPf001ReasoningEdge[];
  answerNodeId: string;
}

export interface NsPf001Explanation {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
  factorizationText: string;
  factorizationLatex: string;
}

export interface NsPf001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsPf001QuestionPackage {
  archetypeId: typeof NS_PF_001_ARCHETYPE_ID;
  canonicalProblemId: NsPf001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsPf001SourceTrace;
  topology: NsPf001Topology;
  difficultyBand: NsPf001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: NsPf001Answer;
  factorizationText: string;
  factorizationLatex: string;
  parameters: NsPf001Parameters;
  solver: NsPf001SolverResult;
  reasoningGraph: NsPf001ReasoningGraph;
  explanation: NsPf001Explanation;
  validation: NsPf001ValidationResult;
  traceability: NsPf001TraceabilityPackage;
}

export interface NsPf001AuditReport {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
  mathJaxFailures: number;
  difficultyDistribution: Record<string, number>;
  primeInputCoverage: Record<string, number>;
  compositeInputCoverage: Record<string, number>;
  repeatedPrimeCoverage: Record<string, number>;
  primePowerCoverage: Record<string, number>;
  mixedPrimeCoverage: Record<string, number>;
  largestPrimeFactorCoverage: Record<string, number>;
  smallestPrimeFactorCoverage: Record<string, number>;
  selectedPrimeCoverage: Record<string, number>;
  selectedExponentCoverage: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  topologyDistribution: Record<string, number>;
  factorizationTextSamples: readonly string[];
  factorizationLatexSamples: readonly string[];
}
