export const TMW_001_ARCHETYPE_ID = "TMW-001" as const;
export const TMW_CP_001_ID = "TMW-CP-001" as const;

export const TMW_CP_001_SOLVE_MODES = [
  "findWorkFromRateAndTime",
  "findRateFromWorkAndTime",
  "findTimeFromWorkAndRate",
  "findOneUnitWorkFromCompletionTime",
  "findCompletionTimeFromOneUnitWork",
  "findFractionCompletedInGivenTime",
  "findPercentCompletedInGivenTime",
  "findTimeForGivenFraction",
  "findTimeForGivenPercent",
  "findRemainingFractionAfterTime",
  "findRemainingPercentAfterTime",
  "findOutputFromUnitRateAndTime",
] as const;

export type TmwCp001SolveMode = (typeof TMW_CP_001_SOLVE_MODES)[number];
export type TmwLanguage = "en" | "hi" | "pa";
export type TmwDifficulty = "Easy" | "Medium" | "Hard";
export type TmwAnswerType = "WORK" | "RATE" | "TIME" | "FRACTION" | "PERCENT" | "OUTPUT";

export interface Rational {
  numerator: number;
  denominator: number;
}

export interface TmwCp001RegistryEntry {
  qlId: string;
  cpId: typeof TMW_CP_001_ID;
  solveMode: TmwCp001SolveMode;
  answerType: TmwAnswerType;
  ruleId: "TMW_RATE_DIRECT" | "TMW_RATE_RECIPROCAL";
  formulaStrategyId: "FORMULA_WORK_RATE_TIME" | "FORMULA_RECIPROCAL_RATE";
  explanationStrategyId: "EXP_RATE_DIRECT" | "EXP_RECIPROCAL_DIRECT";
  scenarioFamily: "production" | "document_work" | "inspection" | "painting";
  difficulty: TmwDifficulty;
  publiclyPublishable: false;
}

export interface TmwCp001Parameters {
  totalWork: Rational;
  rate: Rational;
  time: Rational;
  requestedFraction?: Rational;
  outputUnit: "items" | "pages" | "forms" | "metres";
  context: {
    actor: string;
    action: string;
    object: string;
  };
}

export interface TmwCp001Solution {
  answer: Rational;
  answerType: TmwAnswerType;
  formulaLatex: string;
  workedLatex: string[];
  answerText: string;
}

export interface TmwGeneratedQuestion {
  archetypeId: typeof TMW_001_ARCHETYPE_ID;
  canonicalProblemId: typeof TMW_CP_001_ID;
  questionLanguageId: string;
  language: "en";
  seed: string;
  stem: string;
  parameters: TmwCp001Parameters;
  solution: TmwCp001Solution;
  options: string[];
  correctIndex: number;
  explanation: {
    opening: string;
    formula: string;
    steps: string[];
    conclusion: string;
  };
  mathematicalFingerprint: string;
  validation: {
    valid: boolean;
    errors: string[];
  };
  publiclyPublishable: false;
}
