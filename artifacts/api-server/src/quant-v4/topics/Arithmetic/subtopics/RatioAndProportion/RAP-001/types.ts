export const RAP_001_ARCHETYPE_ID = "RAP-001" as const;

export const RAP_001_CP_IDS = [
  "RAP-CP-001",
  "RAP-CP-002",
  "RAP-CP-003",
  "RAP-CP-004",
  "RAP-CP-005",
  "RAP-CP-006",
] as const;

export const RAP_001_LANGUAGES = ["en", "hi", "pa"] as const;

export type Rap001CanonicalProblemId = (typeof RAP_001_CP_IDS)[number];
export type Rap001Language = (typeof RAP_001_LANGUAGES)[number];
export type Rap001DifficultyBand = "Easy" | "Medium" | "Hard";

export type Rap001TaskKind =
  | "simpleLinkage"
  | "ratioNormalization"
  | "ratioTreeLinkage"
  | "scalingByComponent"
  | "decimalNormalization"
  | "basicPartition"
  | "shareDifference"
  | "reversePartition"
  | "salaryDistribution"
  | "twoStateAddition"
  | "twoStateSubtraction"
  | "twoStateTransfer"
  | "incomeExpenditureSystem"
  | "multiStageTransformation"
  | "meanProportional"
  | "thirdProportional"
  | "fourthProportional"
  | "directVariation"
  | "inverseVariation"
  | "coinCounting"
  | "multiDenominationMapping"
  | "weightedMapping"
  | "weightedMarks"
  | "binaryMixture"
  | "mixtureComponentFinding"
  | "threeComponentMixture"
  | "variableReplacementRatio"
  | "acidConcentration";

export type Rap001AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Rap001TaskRegistryEntry {
  cpId: Rap001CanonicalProblemId;
  taskKind: Rap001TaskKind;
  answerType: Rap001AnswerType;
  requiredVariables: string[];
}

export interface Rap001TaskRegistryLibrary {
  archetypeId: typeof RAP_001_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  entries: Record<string, Rap001TaskRegistryEntry>;
}

export interface Rap001QuestionLanguageEntry {
  template: string;
  difficulty: Rap001DifficultyBand;
}

export interface Rap001QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Rap001QuestionLanguageEntry>;
  };
}

export interface Rap001ExplanationEntry {
  explanationId: string;
  steps: string[];
}

export interface Rap001ExplanationLibrary {
  [cpId: string]: Rap001ExplanationEntry;
}

export type Rap001Variables = Record<string, string | number>;

export interface Rap001SemanticEntity {
  id: string;
  en: string;
  hi: string;
  pa: string;
  gender?: string;
  numberType?: string;
  frequency?: string;
}

export interface Rap001SemanticContext {
  scenario: string;
  entities: Record<string, Rap001SemanticEntity>;
}

export interface Rap001Parameters {
  archetypeId: typeof RAP_001_ARCHETYPE_ID;
  canonicalProblemId: Rap001CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap001Language;
  difficultyBand: Rap001DifficultyBand;
  taskKind: Rap001TaskKind;
  answerType: Rap001AnswerType;
  requiredVariables: string[];
  variables: Rap001Variables;
  semanticContext?: Rap001SemanticContext;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
    semanticSource?: string;
  };
}

export interface Rap001SolverResult {
  answer: string;
  answerValue: string | number;
  answerType: Rap001AnswerType;
  workingValues: Record<string, string | number>;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Rap001ReasoningNode {
  nodeId: string;
  operation: string;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
  description: string;
  evidence: Record<string, string | number>;
}

export interface Rap001ReasoningGraph {
  graphId: string;
  nodes: Rap001ReasoningNode[];
}

export interface Rap001Explanation {
  explanationId: string;
  lines: string[];
}

export interface Rap001ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Rap001QuestionPackage {
  archetypeId: typeof RAP_001_ARCHETYPE_ID;
  canonicalProblemId: Rap001CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap001Language;
  difficultyBand: Rap001DifficultyBand;
  stem: string;
  answer: string;
  parameters: Rap001Parameters;
  solver: Rap001SolverResult;
  reasoningGraph: Rap001ReasoningGraph;
  explanation: Rap001Explanation;
  traceability: Record<string, unknown>;
  validation: Rap001ValidationResult;
  mathJax: Record<string, string>;
}

export interface Rap001CoverageAudit {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  renderFailures: number;
  solverFailures: number;
  crossLanguageFailures: number;
  placeholderFailures: number;
  duplicateRate: number;
  cpCoverage: Record<string, number>;
  taskKindCoverage: Record<string, number>;
  qlCoverage: Record<string, number>;
  esCoverage: Record<string, number>;
  difficultyCoverage: Record<string, number>;
  mathJaxCoverage: Record<string, number>;
  unusedQlIds: string[];
  unusedEsIds: string[];
  libraryValidationFailures: string[];
}
