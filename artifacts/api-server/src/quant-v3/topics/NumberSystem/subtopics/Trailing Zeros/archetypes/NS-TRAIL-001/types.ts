export const NS_TRAIL_001_ARCHETYPE_ID = "NS-TRAIL-001" as const;
export const NS_TRAIL_001_CP_001 = "CP-001" as const;
export const NS_TRAIL_001_CP_002 = "CP-002" as const;
export const NS_TRAIL_001_CP_003 = "CP-003" as const;
export const NS_TRAIL_001_CP_004 = "CP-004" as const;
export const NS_TRAIL_001_CP_005 = "CP-005" as const;

export type NsTrail001CanonicalProblemId =
  | typeof NS_TRAIL_001_CP_001
  | typeof NS_TRAIL_001_CP_002
  | typeof NS_TRAIL_001_CP_003
  | typeof NS_TRAIL_001_CP_004
  | typeof NS_TRAIL_001_CP_005;

export type NsTrail001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsTrail001Topology =
  | "Count Trailing Zeros In n!"
  | "Count Trailing Zeros In Factorial Expressions"
  | "Smallest Number Whose Factorial Has Given Trailing Zeros"
  | "Count Trailing Zeros In Powers"
  | "Determine Change In Trailing Zeros After Multiplication";
export type NsTrail001ExpressionType = "numeratorOnly" | "numeratorDenominator" | "cancellationCase";
export type NsTrail001TargetZeroBucket = "solutionExists" | "smallZeroCount" | "mediumZeroCount" | "largeZeroCount";
export type NsTrail001PowerType = "balancedTwoFive" | "excessTwos" | "excessFives" | "noTrailingZero";
export type NsTrail001ProductType = "productCreatesZeros" | "productAddsZeros" | "productNoZeroChange";

export interface NsTrail001MathJaxFields {
  factorFiveCountLatex: string;
  factorialExpressionLatex: string;
  searchProcessLatex: string;
  powerFactorizationLatex: string;
  productFactorizationLatex: string;
}

export interface NsTrail001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsTrail001Parameters {
  archetypeId: typeof NS_TRAIL_001_ARCHETYPE_ID;
  canonicalProblemId: NsTrail001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsTrail001SourceTrace;
  topology: NsTrail001Topology;
  difficultyBand: NsTrail001DifficultyBand;
  questionLanguageId: string;
  n?: number;
  expression?: string;
  numeratorTerms?: number[];
  denominatorTerms?: number[];
  zeroCount?: number;
  base?: number;
  exponent?: number;
  numberA?: number;
  numberB?: number;
  nBucket?: string;
  largestPowerOfFiveReached?: string;
  expressionType?: NsTrail001ExpressionType;
  targetZeroBucket?: NsTrail001TargetZeroBucket;
  baseFactorizationType?: NsTrail001PowerType;
  productType?: NsTrail001ProductType;
}

export interface NsTrail001SolverResult extends NsTrail001MathJaxFields {
  archetypeId: typeof NS_TRAIL_001_ARCHETYPE_ID;
  canonicalProblemId: NsTrail001CanonicalProblemId;
  topology: NsTrail001Topology;
  answer: number;
  nBucket: string;
  largestPowerOfFiveReached: string;
  expressionType?: NsTrail001ExpressionType;
  factorialTermCount?: number;
  targetZeroBucket?: NsTrail001TargetZeroBucket;
  searchIterations?: number;
  baseFactorizationType?: NsTrail001PowerType;
  powerMagnitude?: string;
  productType?: NsTrail001ProductType;
  twoCount?: number;
  fiveCount?: number;
  pairCount?: number;
  verification: {
    inputValid: boolean;
    answerRecomputed: boolean;
    smallestExactMatch: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsTrail001ReasoningNodeType =
  | "Input Capture"
  | "Trailing Zero Rule"
  | "Power Of Five Count"
  | "Aggregate Counts"
  | "Expression Parse"
  | "Numerator Contribution"
  | "Denominator Contribution"
  | "Search Candidates"
  | "Factorize Base"
  | "Multiply Exponents"
  | "Factorize Numbers"
  | "Count Complete Pairs"
  | "Answer Extraction";

export interface NsTrail001ReasoningNode {
  id: string;
  type: NsTrail001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsTrail001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsTrail001ReasoningGraph extends NsTrail001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_TRAIL_001_ARCHETYPE_ID;
  canonicalProblemId: NsTrail001CanonicalProblemId;
  sourceTrace: NsTrail001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsTrail001ReasoningNode[];
  edges: readonly NsTrail001ReasoningEdge[];
}

export interface NsTrail001Explanation extends NsTrail001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsTrail001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsTrail001TraceabilityPackage extends NsTrail001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsTrail001CanonicalProblemId;
  questionLanguageId: string;
  explanationStyleId: string;
  difficulty: NsTrail001DifficultyBand;
  difficultyBand: NsTrail001DifficultyBand;
  topology: NsTrail001Topology;
  reasoningGraphId: string;
  graphId: string;
  answer: number;
}

export interface NsTrail001QuestionPackage extends NsTrail001MathJaxFields {
  archetypeId: typeof NS_TRAIL_001_ARCHETYPE_ID;
  canonicalProblemId: NsTrail001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsTrail001SourceTrace;
  topology: NsTrail001Topology;
  difficultyBand: NsTrail001DifficultyBand;
  difficulty: NsTrail001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: number;
  parameters: NsTrail001Parameters;
  solver: NsTrail001SolverResult;
  reasoningGraph: NsTrail001ReasoningGraph;
  explanation: NsTrail001Explanation;
  traceability: NsTrail001TraceabilityPackage;
  validation: NsTrail001ValidationResult;
}

export interface NsTrail001AuditReport {
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
  canonicalProblemDistribution: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  nBucketCoverage: Record<string, number>;
  largestPowerOfFiveReachedCoverage: Record<string, number>;
  expressionTypeCoverage: Record<string, number>;
  factorialTermCountCoverage: Record<string, number>;
  targetZeroBucketCoverage: Record<string, number>;
  searchIterationsCoverage: Record<string, number>;
  baseFactorizationTypeCoverage: Record<string, number>;
  powerMagnitudeCoverage: Record<string, number>;
  productTypeCoverage: Record<string, number>;
  twoCountCoverage: Record<string, number>;
  fiveCountCoverage: Record<string, number>;
  pairCountCoverage: Record<string, number>;
  mathJaxUsage: Record<string, number>;
}
