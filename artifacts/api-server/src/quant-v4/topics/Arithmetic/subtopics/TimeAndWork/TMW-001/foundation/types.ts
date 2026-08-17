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
  "recoverWholeWorkFromPartAndFraction",
  "recoverWholeTimeFromPartCompletion",
  "convertRateAcrossTimeUnits",
  "compareWorkCompletedAtEqualTime",
  "compareTimeForDifferentWorkAtSameRate",
  "findRequiredRateForTargetCompletion",
  "findDelayFromReducedUniformRate",
  "findTimeSavedFromIncreasedUniformRate",
] as const;

export type TmwCp001SolveMode = (typeof TMW_CP_001_SOLVE_MODES)[number];
export type TmwLanguage = "en" | "hi" | "pa";
export type TmwDifficulty = "Easy" | "Medium" | "Hard";
export type TmwAnswerType = "WORK" | "RATE" | "TIME" | "FRACTION" | "PERCENT" | "OUTPUT";
export type TmwTimeUnit = "minute" | "hour" | "day" | "shift";
export type TmwScenarioFamily = "production" | "document_work" | "inspection" | "painting" | "construction";

export interface Rational {
  numerator: number;
  denominator: number;
}

export type TmwMisconceptionId =
  | "CORRECT"
  | "RATE_TIME_ADDITION"
  | "RATE_TIME_DIVISION"
  | "WORK_TIME_MULTIPLICATION"
  | "WORK_RATE_MULTIPLICATION"
  | "RECIPROCAL_NOT_TAKEN"
  | "RECIPROCAL_WRONG_DENOMINATOR"
  | "PERCENT_NOT_SCALED"
  | "COMPLETED_REPORTED_AS_REMAINING"
  | "REMAINING_REPORTED_AS_COMPLETED"
  | "TARGET_FRACTION_INVERTED"
  | "TARGET_COMPLEMENT_USED"
  | "PART_MULTIPLIED_INSTEAD_OF_DIVIDED"
  | "PART_COMPLEMENT_USED"
  | "UNIT_CONVERSION_REVERSED"
  | "UNIT_CONVERSION_IGNORED"
  | "COMPARISON_SUM_INSTEAD_OF_DIFFERENCE"
  | "FIRST_QUANTITY_REPORTED"
  | "SECOND_QUANTITY_REPORTED"
  | "REQUIRED_RATE_INVERTED"
  | "CHANGED_TOTAL_TIME_REPORTED"
  | "ORIGINAL_TIME_REPORTED"
  | "PERCENT_OF_TIME_ONLY";

export interface TmwCp001RegistryEntry {
  qlId: string;
  cpId: typeof TMW_CP_001_ID;
  solveMode: TmwCp001SolveMode;
  answerType: TmwAnswerType;
  ruleId: "TMW_RATE_DIRECT" | "TMW_RATE_RECIPROCAL" | "TMW_RATE_COMPARISON" | "TMW_RATE_CHANGE";
  formulaStrategyId:
    | "FORMULA_WORK_RATE_TIME"
    | "FORMULA_RECIPROCAL_RATE"
    | "FORMULA_PART_WHOLE"
    | "FORMULA_RATE_CONVERSION"
    | "FORMULA_RATE_COMPARISON"
    | "FORMULA_RATE_CHANGE";
  explanationStrategyId:
    | "EXP_RATE_DIRECT"
    | "EXP_RECIPROCAL_DIRECT"
    | "EXP_PART_WHOLE"
    | "EXP_RATE_CONVERSION"
    | "EXP_RATE_COMPARISON"
    | "EXP_RATE_CHANGE";
  scenarioFamily: TmwScenarioFamily;
  difficulty: TmwDifficulty;
  publiclyPublishable: false;
}

export interface TmwContext {
  actor: string;
  peerActor: string;
  action: string;
  object: string;
  jobPhrase: string;
  outputUnit: "items" | "pages" | "forms" | "metres";
}

export interface TmwCp001Parameters {
  totalWork: Rational;
  rate: Rational;
  time: Rational;
  timeUnit: TmwTimeUnit;
  requestedFraction?: Rational;
  partWork?: Rational;
  partTime?: Rational;
  secondaryRate?: Rational;
  secondaryWork?: Rational;
  sourceDuration?: Rational;
  targetDuration?: Rational;
  originalRate?: Rational;
  changedRate?: Rational;
  originalTime?: Rational;
  changePercent?: Rational;
  context: TmwContext;
}

export interface TmwCp001Solution {
  answer: Rational;
  answerType: TmwAnswerType;
  formulaLatex: string;
  workedLatex: string[];
  answerText: string;
}

export interface TmwOption {
  text: string;
  value: Rational;
  misconceptionId: TmwMisconceptionId;
}

export interface TmwGeneratedQuestion {
  archetypeId: typeof TMW_001_ARCHETYPE_ID;
  canonicalProblemId: typeof TMW_CP_001_ID;
  questionLanguageId: string;
  solveMode: TmwCp001SolveMode;
  language: "en";
  seed: string;
  stem: string;
  parameters: TmwCp001Parameters;
  solution: TmwCp001Solution;
  options: string[];
  optionAudit: TmwOption[];
  correctIndex: number;
  explanation: {
    opening: string;
    formula: string;
    steps: string[];
    shortcut: {
      title: string;
      steps: string[];
    };
    commonTrap: {
      optionLabel: string;
      optionText: string;
      misconceptionId: Exclude<TmwMisconceptionId, "CORRECT">;
      explanation: string;
    };
    conclusion: string;
  };
  mathematicalFingerprint: string;
  validation: {
    valid: boolean;
    errors: string[];
  };
  publiclyPublishable: false;
}
