export const NS_FAC_001_ARCHETYPE_ID = "NS-FAC-001" as const;
export const NS_FAC_001_CP_001 = "CP-001" as const;
export const NS_FAC_001_CP_002 = "CP-002" as const;
export const NS_FAC_001_CP_003 = "CP-003" as const;
export const NS_FAC_001_CP_004 = "CP-004" as const;
export const NS_FAC_001_CP_005 = "CP-005" as const;
export const NS_FAC_001_CP_006 = "CP-006" as const;
export const NS_FAC_001_CP_007 = "CP-007" as const;
export const NS_FAC_001_CP_008 = "CP-008" as const;
export const NS_FAC_001_CP_009 = "CP-009" as const;

export type NsFac001CanonicalProblemId =
  | typeof NS_FAC_001_CP_001
  | typeof NS_FAC_001_CP_002
  | typeof NS_FAC_001_CP_003
  | typeof NS_FAC_001_CP_004
  | typeof NS_FAC_001_CP_005
  | typeof NS_FAC_001_CP_006
  | typeof NS_FAC_001_CP_007
  | typeof NS_FAC_001_CP_008
  | typeof NS_FAC_001_CP_009;

export type NsFac001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsFac001Answer = number | string | "Odd" | "Even";
export type NsFac001Topology =
  | "Factor Count Formula"
  | "Factor Sum Formula"
  | "Factor Product Formula"
  | "Perfect Square Factor Parity"
  | "Proper Factor Maximum"
  | "Divisible Factor Count"
  | "Derived Complement Factor Count"
  | "Ordered Factor Selection - Increasing"
  | "Ordered Factor Selection - Decreasing";

export interface NsFac001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsFac001FactorTerm {
  prime: number;
  exponent: number;
  power: number;
}

export interface NsFac001MathJaxFields {
  primeFactorizationLatex: string;
  factorCountFormulaLatex: string;
  factorSumFormulaLatex: string;
  factorProductFormulaLatex: string;
  factorListLatex: string;
  factorsIncreasingLatex: string;
  factorsDecreasingLatex: string;
  kPrimeFactorizationLatex: string;
  divisibleFactorConstraintLatex: string;
  complementFormulaLatex: string;
  selectedPositionFormulaLatex: string;
  greatestProperFactorFormulaLatex: string;
  perfectSquareRuleLatex: string;
}

export interface NsFac001FactorModel extends NsFac001MathJaxFields {
  number: number;
  primeFactorization: readonly NsFac001FactorTerm[];
  factorCount: number;
  factorSum: number;
  factorProduct: string;
  factorProductString: string;
  productDigitCount: number;
  factorList: readonly number[];
  factorsIncreasing: readonly number[];
  factorsDecreasing: readonly number[];
  largestPrimeFactor: number;
  smallestPrimeFactor: number;
  greatestProperFactor: number;
  isPrimeInput: boolean;
  isCompositeInput: boolean;
  isPerfectSquare: boolean;
  isPrimePower: boolean;
  isMixedPrime: boolean;
  isHighlyCompositeNumber: boolean;
}

export interface NsFac001TraceabilityPackage extends NsFac001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsFac001CanonicalProblemId;
  difficultyBand: NsFac001DifficultyBand;
  questionLanguageId: string;
  explanationStyleId: string;
  number: number;
  k?: number;
  position?: number;
  ordinalDisplay?: string;
  answer: NsFac001Answer;
  productDigitCount: number;
  graphId: string;
}

export interface NsFac001Parameters {
  archetypeId: typeof NS_FAC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFac001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsFac001SourceTrace;
  topology: NsFac001Topology;
  difficultyBand: NsFac001DifficultyBand;
  number: number;
  k?: number;
  position?: number;
  ordinalDisplay?: string;
}

export interface NsFac001SolverResult extends NsFac001MathJaxFields {
  archetypeId: typeof NS_FAC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFac001CanonicalProblemId;
  topology: NsFac001Topology;
  number: number;
  k?: number;
  position?: number;
  ordinalDisplay?: string;
  answer: NsFac001Answer;
  factorModel: NsFac001FactorModel;
  primeFactorization: readonly NsFac001FactorTerm[];
  factorCount: number;
  factorSum: number;
  factorProduct: string;
  factorProductString: string;
  productDigitCount: number;
  factorList: readonly number[];
  factorsIncreasing: readonly number[];
  factorsDecreasing: readonly number[];
  largestPrimeFactor: number;
  smallestPrimeFactor: number;
  isPrimeInput: boolean;
  isCompositeInput: boolean;
  isPerfectSquare: boolean;
  isPrimePower: boolean;
  isMixedPrime: boolean;
  isHighlyCompositeNumber: boolean;
  selectedPosition?: number;
  selectedFactor?: number;
  selectedK?: number;
  divisibleFactors: readonly number[];
  notDivisibleFactors: readonly number[];
  divisibleFactorCount?: number;
  notDivisibleFactorCount?: number;
  positionClass?: string;
  verification: {
    inputValid: boolean;
    factorizationValid: boolean;
    factorCountValid: boolean;
    factorSumValid: boolean;
    factorProductValid: boolean;
    bigIntSerializationValid: boolean;
    productDigitCountValid: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsFac001ReasoningNodeType =
  | "Prime Factorization"
  | "Factor Count Formula"
  | "Factor Sum Formula"
  | "Factor Product Formula"
  | "Perfect Square Rule"
  | "Factor Enumeration"
  | "Divisible Factor Selection"
  | "Complement Counting"
  | "Ordered Factor Selection"
  | "Answer Extraction";

export interface NsFac001ReasoningNode {
  id: string;
  type: NsFac001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsFac001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsFac001ReasoningGraph extends NsFac001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_FAC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFac001CanonicalProblemId;
  sourceTrace: NsFac001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsFac001ReasoningNode[];
  edges: readonly NsFac001ReasoningEdge[];
}

export interface NsFac001Explanation extends NsFac001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsFac001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsFac001QuestionPackage extends NsFac001MathJaxFields {
  archetypeId: typeof NS_FAC_001_ARCHETYPE_ID;
  canonicalProblemId: NsFac001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsFac001SourceTrace;
  topology: NsFac001Topology;
  difficultyBand: NsFac001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: NsFac001Answer;
  number: number;
  k?: number;
  position?: number;
  ordinalDisplay?: string;
  productDigitCount: number;
  parameters: NsFac001Parameters;
  solver: NsFac001SolverResult;
  reasoningGraph: NsFac001ReasoningGraph;
  explanation: NsFac001Explanation;
  traceability: NsFac001TraceabilityPackage;
  validation: NsFac001ValidationResult;
}

export interface NsFac001AuditReport {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  traceabilityFailures: number;
  mathJaxFailures: number;
  bigIntSerializationFailures: number;
  unusedQuestionLanguageIds: readonly string[];
  unusedExplanationIds: readonly string[];
  maximumExactQuestionRepetition: number;
  repeatedQuestionExamples: readonly string[];
  difficultyDistribution: Record<string, number>;
  primeInputCoverage: Record<string, number>;
  compositeInputCoverage: Record<string, number>;
  primePowerCoverage: Record<string, number>;
  mixedPrimeCoverage: Record<string, number>;
  perfectSquareCoverage: Record<string, number>;
  nonPerfectSquareCoverage: Record<string, number>;
  highlyCompositeNumberCoverage: Record<string, number>;
  factorCountCoverage: Record<string, number>;
  kCoverage: Record<string, number>;
  positionCoverage: Record<string, number>;
  edgePositionCoverage: Record<string, number>;
  productDigitCountCoverage: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  mathJaxObjectCoverage: Record<string, number>;
}
