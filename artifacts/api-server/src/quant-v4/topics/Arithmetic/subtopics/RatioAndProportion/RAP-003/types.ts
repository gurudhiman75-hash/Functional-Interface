export const RAP_003_ARCHETYPE_ID = "RAP-003" as const;

export const RAP_003_CP_IDS = ["RAP-CP-013", "RAP-CP-014", "RAP-CP-015", "RAP-CP-016", "RAP-CP-017"] as const;
export const RAP_003_LANGUAGES = ["en", "hi", "pa"] as const;

export type Rap003CanonicalProblemId = (typeof RAP_003_CP_IDS)[number];
export type Rap003Language = (typeof RAP_003_LANGUAGES)[number];
export type Rap003DifficultyBand = "Easy" | "Medium" | "Hard";

export type Rap003TaskKind =
  | "partnershipProfitShare"
  | "partnershipJoiningPartnerProfit"
  | "partnershipMidPeriodChange"
  | "agePresentFromFutureRatio"
  | "agePresentFromPastRatio"
  | "ageYearsToReachRatio"
  | "ageFromDifferenceAndRatio"
  | "incomeExpenditureSavingsRatio"
  | "incomeExpenditureEqualSavings"
  | "incomeFromSavingsRatio"
  | "expenditureFromSavingsRatio"
  | "alloyMixingRatioFromTarget"
  | "alloyTargetComponentFromMix"
  | "alloyThreeSourceEqualMix"
  | "replacementFinalRatio"
  | "replacementFinalQuantity"
  | "replacementIterationsFromFinalRatio";

export type Rap003AnswerType = "AGE" | "TIME" | "PROFIT" | "RATIO" | "PERCENT" | "QUANTITY" | "COUNT";
export type Rap003Variables = Record<string, string | number>;

export interface Rap003TaskRegistryEntry {
  cpId: Rap003CanonicalProblemId;
  taskKind: Rap003TaskKind;
  answerType: Rap003AnswerType;
  difficulty: Rap003DifficultyBand;
  requiredVariables: string[];
  explanationId: string;
}

export interface Rap003QuestionLanguageEntry {
  cpId: Rap003CanonicalProblemId;
  taskKind: Rap003TaskKind;
  template: string;
  difficulty: Rap003DifficultyBand;
}

export interface Rap003Parameters {
  archetypeId: typeof RAP_003_ARCHETYPE_ID;
  canonicalProblemId: Rap003CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap003Language;
  difficultyBand: Rap003DifficultyBand;
  taskKind: Rap003TaskKind;
  answerType: Rap003AnswerType;
  requiredVariables: string[];
  variables: Rap003Variables;
  sourceTrace: {
    questionLanguageSource: string;
    explanationSource: string;
    variableRangeSource: string;
  };
}

export interface Rap003SolverResult {
  answer: string;
  answerValue: string | number;
  answerType: Rap003AnswerType;
  workingValues: Record<string, string | number>;
  evidence: Record<string, string | number>;
  mathJax: Record<string, string>;
}

export interface Rap003Explanation {
  explanationId: string;
  lines: string[];
}

export interface Rap003ValidationResult {
  valid: boolean;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface Rap003QuestionPackage {
  archetypeId: typeof RAP_003_ARCHETYPE_ID;
  canonicalProblemId: Rap003CanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  explanationId: string;
  language: Rap003Language;
  difficultyBand: Rap003DifficultyBand;
  stem: string;
  answer: string;
  parameters: Rap003Parameters;
  solver: Rap003SolverResult;
  explanation: Rap003Explanation;
  validation: Rap003ValidationResult;
  mathJax: Record<string, string>;
}

export interface Rap003ParameterInput {
  seed?: string;
  language?: Rap003Language;
  canonicalProblemId?: Rap003CanonicalProblemId;
  questionLanguageId?: string;
  difficultyBand?: Rap003DifficultyBand;
}
