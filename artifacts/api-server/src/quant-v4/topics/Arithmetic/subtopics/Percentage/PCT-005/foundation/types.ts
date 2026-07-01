export const PCT_005_ARCHETYPE_ID = "PCT-005" as const;

export const PCT_005_CP_IDS = [
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

export const PCT_005_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct005CanonicalProblemId = (typeof PCT_005_CP_IDS)[number];
export type Pct005Language = (typeof PCT_005_LANGUAGES)[number];
export type Pct005DifficultyBand = "Easy" | "Medium" | "Hard";
export type Pct005Direction = "increase" | "decrease";

export type Pct005TaskKind =
  | "successiveIncrease"
  | "successiveDecrease"
  | "increaseThenDecrease"
  | "decreaseThenIncrease"
  | "netPercentageChange"
  | "equivalentSingleMultiplier"
  | "reverseSuccessiveChange"
  | "comparativeSuccessiveChange"
  | "multiStageSuccessiveChange"
  | "contextualSuccessiveChange";

export type Pct005AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Pct005TaskRegistryEntry {
  cpId: Pct005CanonicalProblemId;
  taskKind: Pct005TaskKind;
  answerType: Pct005AnswerType;
  requiredVariables: string[];
}

export interface Pct005TaskRegistryLibrary {
  archetypeId: typeof PCT_005_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct005TaskRegistryEntry>;
}

export interface Pct005QuestionLanguageEntry {
  template: string;
  difficulty: Pct005DifficultyBand;
}

export interface Pct005QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct005QuestionLanguageEntry>;
  };
}

export interface Pct005ExplanationEntry {
  explanationId: string;
}

export interface Pct005ExplanationLibrary {
  [cpId: string]: Pct005ExplanationEntry;
}

export type Pct005Variables = Record<string, number | string>;

export interface Pct005Parameters {
  archetypeId: typeof PCT_005_ARCHETYPE_ID;
  canonicalProblemId: Pct005CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct005Language;
  difficultyBand: Pct005DifficultyBand;
  taskKind: Pct005TaskKind;
  answerType: Pct005AnswerType;
  requiredVariables: string[];
  variables: Pct005Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct005SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct005AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct005ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct005ReasoningGraph {
  graphId: string;
  nodes: Pct005ReasoningNode[];
}

export interface Pct005Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct005ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct005QuestionPackage {
  archetypeId: typeof PCT_005_ARCHETYPE_ID;
  canonicalProblemId: Pct005CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct005Language;
  difficultyBand: Pct005DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct005Parameters;
  solver: Pct005SolverResult;
  reasoningGraph: Pct005ReasoningGraph;
  explanation: Pct005Explanation;
  traceability: Record<string, unknown>;
  validation: Pct005ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct005CoverageAudit {
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
