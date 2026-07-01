export const PCT_004_ARCHETYPE_ID = "PCT-004" as const;

export const PCT_004_CP_IDS = [
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

export const PCT_004_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct004CanonicalProblemId = (typeof PCT_004_CP_IDS)[number];
export type Pct004Language = (typeof PCT_004_LANGUAGES)[number];
export type Pct004DifficultyBand = "Easy" | "Medium" | "Hard";

export type Pct004TaskKind =
  | "directPercentageDecrease"
  | "decreaseAmount"
  | "originalValueFromDecreasedValue"
  | "decreaseMultiplier"
  | "successiveDecrease"
  | "netPercentageDecrease"
  | "comparativeDecrease"
  | "componentWiseDecrease"
  | "requiredDecrease"
  | "percentageDecreaseBridge";

export type Pct004AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Pct004TaskRegistryEntry {
  cpId: Pct004CanonicalProblemId;
  taskKind: Pct004TaskKind;
  answerType: Pct004AnswerType;
  requiredVariables: string[];
}

export interface Pct004TaskRegistryLibrary {
  archetypeId: typeof PCT_004_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct004TaskRegistryEntry>;
}

export interface Pct004QuestionLanguageEntry {
  template: string;
  difficulty: Pct004DifficultyBand;
}

export interface Pct004QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct004QuestionLanguageEntry>;
  };
}

export interface Pct004ExplanationEntry {
  explanationId: string;
}

export interface Pct004ExplanationLibrary {
  [cpId: string]: Pct004ExplanationEntry;
}

export type Pct004Variables = Record<string, number | string>;

export interface Pct004Parameters {
  archetypeId: typeof PCT_004_ARCHETYPE_ID;
  canonicalProblemId: Pct004CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct004Language;
  difficultyBand: Pct004DifficultyBand;
  taskKind: Pct004TaskKind;
  answerType: Pct004AnswerType;
  requiredVariables: string[];
  variables: Pct004Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct004SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct004AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct004ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct004ReasoningGraph {
  graphId: string;
  nodes: Pct004ReasoningNode[];
}

export interface Pct004Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct004ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct004QuestionPackage {
  archetypeId: typeof PCT_004_ARCHETYPE_ID;
  canonicalProblemId: Pct004CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct004Language;
  difficultyBand: Pct004DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct004Parameters;
  solver: Pct004SolverResult;
  reasoningGraph: Pct004ReasoningGraph;
  explanation: Pct004Explanation;
  traceability: Record<string, unknown>;
  validation: Pct004ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct004CoverageAudit {
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
