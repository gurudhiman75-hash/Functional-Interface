export const PCT_006_ARCHETYPE_ID = "PCT-006" as const;

export const PCT_006_CP_IDS = [
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

export const PCT_006_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct006CanonicalProblemId = (typeof PCT_006_CP_IDS)[number];
export type Pct006Language = (typeof PCT_006_LANGUAGES)[number];
export type Pct006DifficultyBand = "Easy" | "Medium" | "Hard";
export type Pct006ComparisonDirection = "more" | "less" | "equal";

export type Pct006TaskKind =
  | "directMoreThanComparison"
  | "directLessThanComparison"
  | "reverseBaseSwitchingComparison"
  | "differenceAsPercentageOfSelectedBase"
  | "ratioBasedPercentageComparison"
  | "requiredPercentageChangeToMatchTarget"
  | "compareAfterDifferentPercentageChanges"
  | "chainPercentageComparison"
  | "percentagePointsVsPercentageChange"
  | "crossBasePercentageComparison";

export type Pct006AnswerType =
  | "ABSOLUTE"
  | "PERCENT"
  | "COMPARISON"
  | "DIFFERENCE"
  | "RATIO";

export type Pct006SolveMode =
  | "moreFindGreater"
  | "moreFindBase"
  | "moreFindDifference"
  | "lessFindLower"
  | "lessFindBase"
  | "lessFindDifference"
  | "reverseLessFromMore"
  | "reverseMoreFromLess"
  | "differenceAsPercentOfFirst"
  | "differenceAsPercentOfSecond"
  | "largerMoreThanSmaller"
  | "smallerLessThanLarger"
  | "ratioMoreThan"
  | "ratioLessThan"
  | "requiredIncreaseToTarget"
  | "requiredDecreaseToTarget"
  | "compareFinalBothIncrease"
  | "compareFinalBothDecrease"
  | "compareFinalAUpBDown"
  | "compareFinalADownBUp"
  | "chainAAboveB_BBelowC"
  | "chainABelow_BAboveC"
  | "chainAAboveB_BAboveC"
  | "chainABelow_BBelowC"
  | "percentagePointDifferenceOnly"
  | "relativePercentageChangeOnly"
  | "bothPointAndRelative"
  | "crossBaseWhoIsHigher"
  | "crossBaseDifferenceOnly"
  | "crossBasePercentMore";

export interface Pct006TaskRegistryEntry {
  cpId: Pct006CanonicalProblemId;
  taskKind: Pct006TaskKind;
  solveMode: Pct006SolveMode;
  answerType: Pct006AnswerType;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string;
}

export interface Pct006TaskRegistryLibrary {
  archetypeId: typeof PCT_006_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct006TaskRegistryEntry>;
}

export interface Pct006QuestionLanguageEntry {
  template: string;
  difficulty: Pct006DifficultyBand;
}

export interface Pct006QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct006QuestionLanguageEntry>;
  };
}

export interface Pct006ExplanationEntry {
  explanationId: string;
}

export interface Pct006ExplanationLibrary {
  [cpId: string]: Pct006ExplanationEntry;
}

export type Pct006Variables = Record<string, number | string>;

export interface Pct006Parameters {
  archetypeId: typeof PCT_006_ARCHETYPE_ID;
  canonicalProblemId: Pct006CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct006Language;
  difficultyBand: Pct006DifficultyBand;
  taskKind: Pct006TaskKind;
  solveMode: Pct006SolveMode;
  answerType: Pct006AnswerType;
  requiredVariables: string[];
  variables: Pct006Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Pct006SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct006AnswerType;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Pct006ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct006ReasoningGraph {
  graphId: string;
  nodes: Pct006ReasoningNode[];
}

export interface Pct006Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct006ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct006QuestionPackage {
  archetypeId: typeof PCT_006_ARCHETYPE_ID;
  canonicalProblemId: Pct006CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct006Language;
  difficultyBand: Pct006DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct006Parameters;
  solver: Pct006SolverResult;
  reasoningGraph: Pct006ReasoningGraph;
  explanation: Pct006Explanation;
  traceability: Record<string, unknown>;
  validation: Pct006ValidationResult;
  mathJax: Record<string, string>;
}

export interface Pct006CoverageAudit {
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
