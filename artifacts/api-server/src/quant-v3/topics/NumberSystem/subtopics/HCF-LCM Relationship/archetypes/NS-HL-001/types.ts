export const NS_HL_001_ARCHETYPE_ID = "NS-HL-001" as const;
export const NS_HL_001_CP_001 = "CP-001" as const;
export const NS_HL_001_CP_002 = "CP-002" as const;
export const NS_HL_001_CP_003 = "CP-003" as const;
export const NS_HL_001_CP_004 = "CP-004" as const;
export const NS_HL_001_CP_005 = "CP-005" as const;
export const NS_HL_001_CP_006 = "CP-006" as const;

export type NsHl001CanonicalProblemId =
  | typeof NS_HL_001_CP_001
  | typeof NS_HL_001_CP_002
  | typeof NS_HL_001_CP_003
  | typeof NS_HL_001_CP_004
  | typeof NS_HL_001_CP_005
  | typeof NS_HL_001_CP_006;

export type NsHl001DifficultyBand = "Easy" | "Medium" | "Hard";
export type NsHl001Answer = number | string;
export type NsHl001Cp001Family = "findProduct" | "findHcf" | "findLcm";
export type NsHl001ValidityType = "validAllChecksPass" | "hcfDoesNotDivideLcm" | "productRelationFailure" | "numberConsistencyFailure";
export type NsHl001ConditionType = "sumCondition" | "differenceCondition" | "rangeCondition" | "directPairCondition";
export type NsHl001PairPolicy = "orderedPairs" | "unorderedPairs";
export type NsHl001PairCountCase = "singlePairCase" | "multiplePairCase";
export type NsHl001RatioType = "ratioPlusHcf" | "ratioPlusLcm" | "ratioPlusHcfPlusLcm";
export type NsHl001RatioReductionType = "alreadyReducedRatio" | "reducibleRatio";

export interface NsHl001MathJaxFields {
  productRelationLatex: string;
  divisibilityCheckLatex: string;
  productRelationCheckLatex: string;
  missingNumberFormulaLatex: string;
  hcfVerificationLatex: string;
  lcmVerificationLatex: string;
  quotientLatex: string;
  factorPairListLatex: string;
  coprimePairFilterLatex: string;
  conditionFilterLatex: string;
  reconstructedPairLatex: string;
  factorPairCountLatex: string;
  orderedPairPolicyLatex: string;
  unorderedPairPolicyLatex: string;
  ratioReductionLatex: string;
  ratioMultiplierLatex: string;
  hcfMultiplierLatex: string;
  lcmMultiplierLatex: string;
  consistencyCheckLatex: string;
}

export interface NsHl001SourceTrace {
  sourceId: string;
  sourceType: "approved-library-package";
  note: string;
}

export type NsHl001Topology =
  | "Product Relation Applications"
  | "HCF-LCM Validity Check"
  | "Missing Number From HCF, LCM And One Number"
  | "Number Pair Reconstruction"
  | "Count Possible Number Pairs"
  | "Ratio-Based Number Reconstruction";

export interface NsHl001Pair {
  a: number;
  b: number;
}

export interface NsHl001Parameters {
  archetypeId: typeof NS_HL_001_ARCHETYPE_ID;
  canonicalProblemId: NsHl001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsHl001SourceTrace;
  topology: NsHl001Topology;
  difficultyBand: NsHl001DifficultyBand;
  questionLanguageId: string;
  hcf?: number;
  lcm?: number;
  product?: number;
  a?: number;
  b?: number;
  knownNumber?: number;
  sum?: number;
  difference?: number;
  lowerBound?: number;
  upperBound?: number;
  ratio?: string;
  cp001Family?: NsHl001Cp001Family;
  validityType?: NsHl001ValidityType;
  conditionType?: NsHl001ConditionType;
  pairPolicy?: NsHl001PairPolicy;
  pairCountCase?: NsHl001PairCountCase;
  ratioType?: NsHl001RatioType;
  ratioReductionType?: NsHl001RatioReductionType;
}

export interface NsHl001SolverResult extends NsHl001MathJaxFields {
  archetypeId: typeof NS_HL_001_ARCHETYPE_ID;
  canonicalProblemId: NsHl001CanonicalProblemId;
  topology: NsHl001Topology;
  hcf?: number;
  lcm?: number;
  product?: number;
  answer: NsHl001Answer;
  answerPair?: NsHl001Pair;
  quotient?: number;
  factorPairs: NsHl001Pair[];
  coprimePairs: NsHl001Pair[];
  selectedPairs: NsHl001Pair[];
  cp001Family?: NsHl001Cp001Family;
  validityType?: NsHl001ValidityType;
  conditionType?: NsHl001ConditionType;
  pairPolicy?: NsHl001PairPolicy;
  pairCountCase?: NsHl001PairCountCase;
  ratioType?: NsHl001RatioType;
  ratioReductionType?: NsHl001RatioReductionType;
  operandSize: string;
  quotientSize: string;
  coprimeMultiplierCount: number;
  verification: {
    inputValid: boolean;
    productRelationValid: boolean;
    divisibilityValid: boolean;
    numberConsistencyValid: boolean;
    uniquenessValid: boolean;
    pairPolicyValid: boolean;
    ratioValid: boolean;
    mathJaxValid: boolean;
    answerRuleSatisfied: boolean;
  };
}

export type NsHl001ReasoningNodeType =
  | "Input Capture"
  | "Known Value Identification"
  | "Product Relation"
  | "Divisibility Check"
  | "Consistency Check"
  | "Missing Number Formula"
  | "Quotient Calculation"
  | "Factor Pair Enumeration"
  | "Coprime Filter"
  | "Condition Filter"
  | "Pair Policy"
  | "Ratio Reduction"
  | "Multiplier Determination"
  | "Pair Reconstruction"
  | "Decision Node"
  | "Answer Extraction";

export interface NsHl001ReasoningNode {
  id: string;
  type: NsHl001ReasoningNodeType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface NsHl001ReasoningEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface NsHl001ReasoningGraph extends NsHl001MathJaxFields {
  graphId: string;
  archetypeId: typeof NS_HL_001_ARCHETYPE_ID;
  canonicalProblemId: NsHl001CanonicalProblemId;
  sourceTrace: NsHl001SourceTrace;
  answerNodeId: string;
  nodes: readonly NsHl001ReasoningNode[];
  edges: readonly NsHl001ReasoningEdge[];
}

export interface NsHl001Explanation extends NsHl001MathJaxFields {
  graphId: string;
  familyId: string;
  styleId: string;
  lines: readonly string[];
}

export interface NsHl001ValidationResult {
  valid: boolean;
  checks: readonly {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface NsHl001TraceabilityPackage extends NsHl001MathJaxFields {
  questionId: string;
  canonicalProblemId: NsHl001CanonicalProblemId;
  questionLanguageId: string;
  explanationStyleId: string;
  difficulty: NsHl001DifficultyBand;
  difficultyBand: NsHl001DifficultyBand;
  topology: NsHl001Topology;
  reasoningGraphId: string;
  graphId: string;
  answer: NsHl001Answer;
  validityType?: NsHl001ValidityType;
  conditionType?: NsHl001ConditionType;
  pairPolicy?: NsHl001PairPolicy;
  ratioType?: NsHl001RatioType;
}

export interface NsHl001QuestionPackage extends NsHl001MathJaxFields {
  archetypeId: typeof NS_HL_001_ARCHETYPE_ID;
  canonicalProblemId: NsHl001CanonicalProblemId;
  questionId: string;
  sourceTrace: NsHl001SourceTrace;
  topology: NsHl001Topology;
  difficultyBand: NsHl001DifficultyBand;
  difficulty: NsHl001DifficultyBand;
  questionLanguageId: string;
  explanationFamilyId: string;
  explanationStyleId: string;
  stem: string;
  answer: NsHl001Answer;
  parameters: NsHl001Parameters;
  solver: NsHl001SolverResult;
  reasoningGraph: NsHl001ReasoningGraph;
  explanation: NsHl001Explanation;
  traceability: NsHl001TraceabilityPackage;
  validation: NsHl001ValidationResult;
}

export interface NsHl001AuditReport {
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
  cpFamilyDistribution: Record<string, number>;
  operandSizeCoverage: Record<string, number>;
  quotientSizeCoverage: Record<string, number>;
  coprimeMultiplierCountCoverage: Record<string, number>;
  validityTypeCoverage: Record<string, number>;
  ratioTypeCoverage: Record<string, number>;
  ratioReductionCoverage: Record<string, number>;
  pairPolicyCoverage: Record<string, number>;
  pairCountCaseCoverage: Record<string, number>;
  conditionTypeCoverage: Record<string, number>;
  questionLanguageDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  mathJaxUsage: Record<string, number>;
}
