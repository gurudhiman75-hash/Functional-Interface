export const PCT_003_ARCHETYPE_ID = "PCT-003" as const;

export const PCT_003_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
  "PCT-CP-007",
  "PCT-CP-008",
  "PCT-CP-009",
  "PCT-CP-010",
] as const;

export const PCT_003_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct003CanonicalProblemId = (typeof PCT_003_CP_IDS)[number];
export type Pct003Language = (typeof PCT_003_LANGUAGES)[number];
export type Pct003DifficultyBand = "Easy" | "Medium" | "Hard";

export type Pct003TaskKind =
  | "directPercentageIncrease"
  | "increaseAmount"
  | "originalValueFromIncreasedValue"
  | "equivalentMultiplier"
  | "repeatedPercentageIncrease"
  | "netIncreasePercentage"
  | "comparativeIncrease"
  | "percentageIncreaseInParts"
  | "requiredIncrease"
  | "growthBridge";

export type Pct003AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Pct003TaskRegistryEntry {
  cpId: Pct003CanonicalProblemId;
  taskKind: Pct003TaskKind;
  answerType: Pct003AnswerType;
  requiredVariables: string[];
}

export interface Pct003TaskRegistryLibrary {
  archetypeId: typeof PCT_003_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct003TaskRegistryEntry>;
}

export interface Pct003QuestionLanguageEntry {
  template: string;
  difficulty: Pct003DifficultyBand;
}

export interface Pct003QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct003QuestionLanguageEntry>;
  };
}

export interface Pct003ExplanationEntry {
  explanationId: string;
}

export interface Pct003ExplanationLibrary {
  [cpId: string]: Pct003ExplanationEntry;
}

export type Pct003Variables = Record<string, number | string>;

export interface Pct003Parameters {
  archetypeId: typeof PCT_003_ARCHETYPE_ID;
  canonicalProblemId: Pct003CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct003Language;
  difficultyBand: Pct003DifficultyBand;
  taskKind: Pct003TaskKind;
  answerType: Pct003AnswerType;
  requiredVariables: string[];
  variables: Pct003Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct003SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct003AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct003ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct003ReasoningGraph {
  graphId: string;
  nodes: Pct003ReasoningNode[];
}

export interface Pct003Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct003ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct003QuestionPackage {
  archetypeId: typeof PCT_003_ARCHETYPE_ID;
  canonicalProblemId: Pct003CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct003Language;
  difficultyBand: Pct003DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct003Parameters;
  solver: Pct003SolverResult;
  reasoningGraph: Pct003ReasoningGraph;
  explanation: Pct003Explanation;
  traceability: Record<string, unknown>;
  validation: Pct003ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct003CoverageAudit {
  questionCount: number;
  generationFailures: number;
  validationFailures: number;
  renderFailures: number;
  solverFailures: number;
  duplicateRate: number;
  cpCoverage: Record<string, number>;
  qlCoverage: Record<string, number>;
  esCoverage: Record<string, number>;
  difficultyCoverage: Record<string, number>;
  unusedQlIds: string[];
  unusedEsIds: string[];
  crossLanguageConsistencyFailures: number;
  libraryValidationFailures: string[];
}
