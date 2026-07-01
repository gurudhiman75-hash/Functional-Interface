import type { PercentOfKnownNumberEvidence } from "./eev2/percent-of-known-number/evidence";

export const PCT_001_ARCHETYPE_ID = "PCT-001" as const;

export const PCT_001_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
] as const;

export const PCT_001_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pct001CanonicalProblemId = (typeof PCT_001_CP_IDS)[number];
export type Pct001Language = (typeof PCT_001_LANGUAGES)[number];
export type Pct001DifficultyBand = "Easy" | "Medium" | "Hard";

export type Pct001TaskKind =
  | "percentOf"
  | "percentToFraction"
  | "valueAsPercent"
  | "directRelation"
  | "moreToLess"
  | "lessToMore"
  | "ratioFromPercentEquality"
  | "reversePercent"
  | "increaseNewValue"
  | "decreaseNewValue"
  | "reverseIncrease"
  | "reverseDecrease"
  | "increaseByAmount"
  | "percentOfKnownNumber"
  | "differenceOfPercents"
  | "restoreAfterDecrease"
  | "successiveIncrease"
  | "successiveChange"
  | "compoundGrowth"
  | "compoundDecay"
  | "areaChange"
  | "squareAreaChange"
  | "invarianceDecrease"
  | "invarianceIncrease"
  | "restoreAfterIncrease"
  | "revenueChange"
  | "circleAreaDecrease"
  | "incomePartition"
  | "successiveExpense"
  | "winnerVotes"
  | "cancelledVotes"
  | "passMarks"
  | "partToTotal"
  | "complementOfTotal"
  | "moreMarksBase"
  | "twoShareRemainder"
  | "loserVotes"
  | "dilutionAddWater"
  | "dryFromFresh"
  | "addSolute"
  | "dilutedPercent"
  | "freshFromDry"
  | "addPureComponent"
  | "evaporationOriginal"
  | "alloyComplement";

export type Pct001AnswerType = "ABSOLUTE" | "PERCENT" | "COUNT" | "RATIO" | "FRACTION";

export interface Pct001TaskRegistryEntry {
  cpId: Pct001CanonicalProblemId;
  taskKind: Pct001TaskKind;
  answerType: Pct001AnswerType;
  requiredVariables: string[];
}

export interface Pct001TaskRegistryLibrary {
  archetypeId: typeof PCT_001_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Pct001TaskRegistryEntry>;
}

export interface Pct001QuestionLanguageEntry {
  template: string;
  difficulty: Pct001DifficultyBand;
}

export interface Pct001QuestionLanguageLibrary {
  [cpId: string]: {
    families: Record<string, Pct001QuestionLanguageEntry>;
  };
}

export interface Pct001ExplanationEntry {
  explanationId: string;
  steps?: string[];
  taskExplanations?: Record<string, { steps?: string[]; variants?: string[][]; aliasOf?: string }>;
}

export interface Pct001ExplanationLibrary {
  [cpId: string]: Pct001ExplanationEntry;
}

export type Pct001Variables = Record<string, number | string>;

export interface Pct001SemanticEntity {
  id: string;
  en: string;
  hi: string;
  pa: string;
  gender?: string;
  numberType?: string;
  frequency?: string;
}

export interface Pct001SemanticContext {
  scenario: string;
  entities: Record<string, Pct001SemanticEntity>;
}

export interface Pct001Parameters {
  archetypeId: typeof PCT_001_ARCHETYPE_ID;
  canonicalProblemId: Pct001CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct001Language;
  difficultyBand: Pct001DifficultyBand;
  taskKind: Pct001TaskKind;
  answerType: Pct001AnswerType;
  requiredVariables: string[];
  variables: Pct001Variables;
  semanticContext?: Pct001SemanticContext;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
    semanticSource?: string;
  };
}

export interface Pct001SolverResult {
  answer: string;
  numericAnswer: number | null;
  answerType: Pct001AnswerType;
  evidence: Record<string, string | number>;
  educationalEvidence?: PercentOfKnownNumberEvidence;
  mathJax: Record<string, string>;
}

export interface Pct001ReasoningNode {
  id: string;
  label: string;
  value: string | number | Record<string, string | number>;
}

export interface Pct001ReasoningGraph {
  graphId: string;
  nodes: Pct001ReasoningNode[];
}

export interface Pct001Explanation {
  explanationId: string;
  lines: string[];
}

export interface Pct001ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Pct001QuestionPackage {
  archetypeId: typeof PCT_001_ARCHETYPE_ID;
  canonicalProblemId: Pct001CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Pct001Language;
  difficultyBand: Pct001DifficultyBand;
  stem: string;
  answer: string;
  parameters: Pct001Parameters;
  solver: Pct001SolverResult;
  reasoningGraph: Pct001ReasoningGraph;
  explanation: Pct001Explanation;
  traceability: Record<string, unknown>;
  validation: Pct001ValidationResult;
  mathJax: Record<string, string>;
}
