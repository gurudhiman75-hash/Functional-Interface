import type { EntityReference } from "../../../../../../common/entity-types";

export const PCT_002_ARCHETYPE_ID = "PCT-002" as const;

export const PCT_002_CP_IDS = [
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

export const PCT_002_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct002CanonicalProblemId = (typeof PCT_002_CP_IDS)[number];
export type Pct002Language = (typeof PCT_002_LANGUAGES)[number];
export type Pct002DifficultyBand = "Easy" | "Medium" | "Hard";

export type Pct002TaskKind =
  | "wholeFromPart"
  | "anotherPercentageFromKnownPercentage"
  | "percentageFromPartAndWhole"
  | "reversePercentageMapping"
  | "ratioToPercentage"
  | "complementaryPercentage"
  | "differenceBetweenPercentageParts"
  | "percentagePartition"
  | "missingPercentage"
  | "multiCategoryPercentageDistribution";

export type Pct002AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Pct002TaskRegistryEntry {
  cpId: Pct002CanonicalProblemId;
  taskKind: Pct002TaskKind;
  answerType: Pct002AnswerType;
  requiredVariables: string[];
}

export interface Pct002TaskRegistryLibrary {
  archetypeId: typeof PCT_002_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct002TaskRegistryEntry>;
}

export interface Pct002QuestionLanguageEntry {
  template: string;
  difficulty: Pct002DifficultyBand;
}

export interface Pct002QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct002QuestionLanguageEntry>;
  };
}

export interface Pct002ExplanationEntry {
  explanationId: string;
}

export interface Pct002ExplanationLibrary {
  [cpId: string]: Pct002ExplanationEntry;
}

export type Pct002Variables = Record<string, number | string | EntityReference>;

export interface Pct002Parameters {
  archetypeId: typeof PCT_002_ARCHETYPE_ID;
  canonicalProblemId: Pct002CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct002Language;
  difficultyBand: Pct002DifficultyBand;
  taskKind: Pct002TaskKind;
  answerType: Pct002AnswerType;
  requiredVariables: string[];
  variables: Pct002Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct002SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct002AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct002ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct002ReasoningGraph {
  graphId: string;
  nodes: Pct002ReasoningNode[];
}

export interface Pct002Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct002ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct002QuestionPackage {
  archetypeId: typeof PCT_002_ARCHETYPE_ID;
  canonicalProblemId: Pct002CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct002Language;
  difficultyBand: Pct002DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct002Parameters;
  solver: Pct002SolverResult;
  reasoningGraph: Pct002ReasoningGraph;
  explanation: Pct002Explanation;
  traceability: Record<string, unknown>;
  validation: Pct002ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct002CoverageAudit {
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
