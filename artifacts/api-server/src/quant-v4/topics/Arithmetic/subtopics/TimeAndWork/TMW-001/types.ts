export const TMW_001_PACKAGE_ID = "TMW-001" as const;
export const TMW_CP_001_ID = "TMW-CP-001" as const;

export type Tmw001Language = "en" | "hi" | "pa";
export type Tmw001Difficulty = "Easy" | "Medium" | "Hard";
export type Tmw001Maturity = "PILOT" | "RUNTIME_PROOF" | "FROZEN";
export type Tmw001TimeUnit = "minute" | "hour" | "day" | "shift";
export type Tmw001AnswerType =
  | "WORK"
  | "RATE"
  | "TIME"
  | "FRACTION"
  | "PERCENT"
  | "OUTPUT"
  | "DIFFERENCE";

export interface Rational {
  numerator: number;
  denominator: number;
}

export type TmwCp001SolveMode =
  | "findWorkFromRateAndTime"
  | "findRateFromWorkAndTime"
  | "findTimeFromWorkAndRate"
  | "findOneUnitWorkFromCompletionTime"
  | "findCompletionTimeFromOneUnitWork"
  | "findFractionCompletedInGivenTime"
  | "findPercentCompletedInGivenTime"
  | "findTimeForGivenFraction"
  | "findTimeForGivenPercent"
  | "findRemainingFractionAfterTime"
  | "findRemainingPercentAfterTime"
  | "findOutputFromUnitRateAndTime"
  | "findUnitRateFromOutputAndTime"
  | "findTimeFromOutputAndUnitRate"
  | "recoverWholeWorkFromCompletedPart"
  | "recoverWholeTimeFromPartCompletion"
  | "convertRateAcrossTimeUnits"
  | "compareWorkCompletedAtEqualTime"
  | "compareTimeForDifferentWorkAtSameRate"
  | "findRequiredRateForTargetCompletion"
  | "findDelayFromReducedUniformRate"
  | "findTimeSavedFromIncreasedUniformRate";

export interface TmwCp001QuestionLanguageEntry {
  cpId: typeof TMW_CP_001_ID;
  qlId: string;
  solveMode: TmwCp001SolveMode;
  difficulty: Tmw001Difficulty;
  template: string;
  requiredVariables: string[];
  answerType: Tmw001AnswerType;
  answerUnitPolicy: string;
  scenarioFamily: string;
  formulaStrategyId: string;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  active: boolean;
}

export interface TmwCp001TaskRegistryEntry {
  cpId: typeof TMW_CP_001_ID;
  qlId: string;
  taskKind: "fundamentalWorkRateTimeMapping";
  solveMode: TmwCp001SolveMode;
  ruleId: string;
  answerType: Tmw001AnswerType;
  requiredVariables: string[];
  formulaStrategyId: string;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  independentVerifierId: string;
  scenarioFamily: string;
  renderer: "TEXT" | "STRUCTURED_TEXT";
  localeMode: "TRANSLATABLE";
  publiclyPublishable: false;
}

export interface TmwCp001Parameters {
  packageId: typeof TMW_001_PACKAGE_ID;
  canonicalProblemId: typeof TMW_CP_001_ID;
  qlId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Tmw001Difficulty;
  solveMode: TmwCp001SolveMode;
  answerType: Tmw001AnswerType;
  answerUnit: string;
  quantities: Record<string, Rational>;
  renderVariables: Record<string, string | number>;
  scenarioFamily: string;
  formulaStrategyId: string;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
}

export interface TmwCp001SolverResult {
  exactAnswer: Rational;
  answer: string;
  unit: string;
  equation: string;
  formulaLatex: string;
  workingValues: Record<string, string | number>;
}

export interface TmwCp001VerificationResult {
  valid: boolean;
  verifierId: string;
  check: string;
}

export interface TmwCp001ExplanationStep {
  label: string;
  prose: string;
  latex?: string;
}

export interface TmwCp001Explanation {
  strategyId: string;
  contextualOpening: string;
  keyRule: { label: string; latex: string; interpretation: string };
  steps: TmwCp001ExplanationStep[];
  verification?: { prose: string; latex?: string };
  conclusion: { prose: string; answerLatex: string };
}

export interface TmwCp001ValidationResult {
  valid: boolean;
  failures: string[];
}

export interface TmwCp001QuestionPackage {
  packageId: typeof TMW_001_PACKAGE_ID;
  canonicalProblemId: typeof TMW_CP_001_ID;
  qlId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Tmw001Difficulty;
  solveMode: TmwCp001SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  solver: TmwCp001SolverResult;
  independentVerification: TmwCp001VerificationResult;
  explanation: TmwCp001Explanation;
  validation: TmwCp001ValidationResult;
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  lifecycle: {
    generationSurface: "QUESTION_STUDIO";
    reviewStatus: "UNREVIEWED";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
  };
  traceability: {
    ruleId: string;
    formulaStrategyId: string;
    explanationStrategyId: string;
    distractorStrategyIds: string[];
    optionErrorLabels: Array<string | null>;
    fingerprint: string;
  };
}
