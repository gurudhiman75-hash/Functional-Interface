export const NS_COP_001_ARCHETYPE_ID = "NS-COP-001" as const;
export const NS_COP_001_CP_001 = "CP-001" as const;
export const NS_COP_001_CP_002 = "CP-002" as const;
export const NS_COP_001_CP_003 = "CP-003" as const;
export const NS_COP_001_CP_004 = "CP-004" as const;
export const NS_COP_001_CP_005 = "CP-005" as const;
export const NS_COP_001_CP_006 = "CP-006" as const;

export type NsCop001CanonicalProblemId =
  | typeof NS_COP_001_CP_001
  | typeof NS_COP_001_CP_002
  | typeof NS_COP_001_CP_003
  | typeof NS_COP_001_CP_004
  | typeof NS_COP_001_CP_005
  | typeof NS_COP_001_CP_006;

export type NsCop001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsCop001Answer = number | string;
export type NsCop001Topology =
  | "Co-Prime Check"
  | "Count Co-Primes From A List"
  | "Missing Number For Co-Prime Condition"
  | "Count Co-Prime Pairs"
  | "Consecutive Number Co-Prime Property"
  | "Ratio Reduction To Lowest Form";
export type NsCop001Cp001AnswerType = "coprimeClassification" | "hcfValue" | "commonFactorCount" | "categorySelection";
export type NsCop001CoprimeStatus = "coprime" | "notCoprime";
export type NsCop001GenerationBucket =
  | "coprime"
  | "notCoprime"
  | "primeAndPrime"
  | "primeAndComposite"
  | "compositeAndComposite"
  | "consecutiveNumbers"
  | "powerRelationship"
  | "commonFactorGreaterThanOne";
export type NsCop001ListLength = "shortList" | "mediumList" | "longList";
export type NsCop001Density = "low" | "medium" | "high";
export type NsCop001SetSize = "smallSet" | "mediumSet" | "largeSet";
export type NsCop001RatioType = "alreadyReduced" | "reducibleOnce" | "reducibleMultipleFactors" | "equalTerms" | "largeHcf";

export interface NsCop001MathJaxFields {
  hcfLatex: string;
  coprimeCheckLatex: string;
  candidateEvaluationLatex: string;
  pairEvaluationLatex: string;
  consecutivePropertyLatex: string;
  ratioReductionLatex: string;
}

export interface NsCop001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export interface NsCop001Pair {
  a: number;
  b: number;
}

export interface NsCop001Parameters {
  archetypeId: typeof NS_COP_001_ARCHETYPE_ID;
  canonicalProblemId: NsCop001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsCop001SourceTrace;
  topology: NsCop001Topology;
  difficultyBand: NsCop001DifficultyBand;
  questionLanguageId: string;
  a?: number;
  b?: number;
  number?: number;
  nextNumber?: number;
  targetNumber?: number;
  numberList?: number[];
  numberSet?: number[];
  candidateSet?: number[];
  hcf?: number;
  decisionText?: string;
  cp001AnswerType?: NsCop001Cp001AnswerType;
  generationBucket?: NsCop001GenerationBucket;
  listLength?: NsCop001ListLength;
  coprimeDensity?: NsCop001Density;
  setSize?: NsCop001SetSize;
  ratioType?: NsCop001RatioType;
}

export interface NsCop001SolverResult extends NsCop001MathJaxFields {
  archetypeId: typeof NS_COP_001_ARCHETYPE_ID;
  canonicalProblemId: NsCop001CanonicalProblemId;
  topology: NsCop001Topology;
  answer: NsCop001Answer;
  hcf?: number;
  commonFactors: number[];
  coprimeStatus?: NsCop001CoprimeStatus;
  numberList: number[];
  numberSet: number[];
  candidateSet: number[];
  validCandidates: number[];
  coprimePairs: NsCop001Pair[];
  allPairs: NsCop001Pair[];
  reducedRatio?: string;
  cp001AnswerType?: NsCop001Cp001AnswerType;
  generationBucket?: NsCop001GenerationBucket;
  listLength?: NsCop001ListLength;
  coprimeDensity?: NsCop001Density;
  candidateCount?: number;
  distractorCount?: number;
  setSize?: NsCop001SetSize;
  pairCount?: number;
  ratioType?: NsCop001RatioType;
  hcfBucket: string;
  commonFactorBucket: string;
  hcfSize: string;
  verification: {
    inputValid: boolean;
    answerConsistentWithHcf: boolean;
    answerConsistentWithCommonFactors: boolean;
    uniqueCandidateValid: boolean;
    reducedRatioEquivalent: boolean;
    reducedTermsCoprime: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsCop001ReasoningNodeType =
  | "Input Capture"
  | "Compute HCF"
  | "Compute Common Factors"
  | "Determine Relationship"
  | "Evaluate List Element"
  | "Evaluate Candidates"
  | "Generate Pairs"
  | "Evaluate Pair HCF"
  | "Recognize Consecutive Numbers"
  | "Apply Consecutive Property"
  | "Divide Ratio Terms"
  | "Verify Reduced Ratio"
  | "Count Valid Entries"
  | "Answer Extraction";

export interface NsCop001ReasoningNode {
  id: string;
  type: NsCop001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsCop001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsCop001ReasoningGraph extends NsCop001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_COP_001_ARCHETYPE_ID;
  canonicalProblemId: NsCop001CanonicalProblemId;
  sourceTrace: NsCop001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsCop001ReasoningNode[];
  edges: readonly NsCop001ReasoningEdge[];
}

export interface NsCop001Explanation extends NsCop001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsCop001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export interface NsCop001TraceabilityPackage extends NsCop001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsCop001CanonicalProblemId;
  questionLanguageId: string;
  explanationStyleId: string;
  difficulty: NsCop001DifficultyBand;
  difficultyBand: NsCop001DifficultyBand;
  topology: NsCop001Topology;
  reasoningGraphId: string;
  graphId: string;
  answer: NsCop001Answer;
}

export interface NsCop001QuestionPackage extends NsCop001MathJaxFields {
  archetypeId: typeof NS_COP_001_ARCHETYPE_ID;
  canonicalProblemId: NsCop001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsCop001SourceTrace;
  topology: NsCop001Topology;
  difficultyBand: NsCop001DifficultyBand;
  difficulty: NsCop001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: NsCop001Answer;
  parameters: NsCop001Parameters;
  solver: NsCop001SolverResult;
  reasoningGraph: NsCop001ReasoningGraph;
  explanation: NsCop001Explanation;
  traceability: NsCop001TraceabilityPackage;
  validation: NsCop001ValidationResult;
}

export interface NsCop001AuditReport {
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
  cp001AnswerTypeCoverage: Record<string, number>;
  coprimeStatusCoverage: Record<string, number>;
  hcfBucketCoverage: Record<string, number>;
  commonFactorBucketCoverage: Record<string, number>;
  listLengthCoverage: Record<string, number>;
  coprimeDensityCoverage: Record<string, number>;
  candidateCountCoverage: Record<string, number>;
  distractorCountCoverage: Record<string, number>;
  setSizeCoverage: Record<string, number>;
  pairCountCoverage: Record<string, number>;
  ratioTypeCoverage: Record<string, number>;
  hcfSizeCoverage: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  mathJaxUsage: Record<string, number>;
}
