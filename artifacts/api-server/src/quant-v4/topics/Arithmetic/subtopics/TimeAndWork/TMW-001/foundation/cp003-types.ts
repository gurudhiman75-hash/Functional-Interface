import type { Rational, TmwDifficulty, TmwTimeUnit } from "./types";

export const TMW_CP_003_ID = "TMW-CP-003" as const;
export const TMW_CP_003_SOLVE_MODES = [
  "findEfficiencyRatioFromEqualWorkTimes",
  "findTimeRatioFromEfficiencyRatio",
  "findEfficiencyPercentMoreFromCompletionTimes",
  "findEfficiencyPercentLessFromCompletionTimes",
  "findFasterTimeFromSlowerTimeAndPercentMoreEfficient",
  "findSlowerTimeFromFasterTimeAndPercentMoreEfficient",
  "findTimePercentLessFromEfficiencyPercentMore",
  "findTimePercentMoreFromEfficiencyPercentLess",
  "findWorkRatioAtEqualTimeFromEfficiencyRatio",
  "findWorkRatioFromEfficiencyRatioAndUnequalTimes",
  "findTimeRatioForUnequalWorkAndEfficiencyRatio",
  "findEfficiencyRatioFromUnequalWorkAndTimes",
  "findOutputFromEfficiencyRatioAndReferenceOutput",
  "findReferenceOutputFromEfficiencyRatioAndOtherOutput",
  "findIndividualTimeFromEfficiencyRatioAndCombinedTime",
  "findIndividualTimeFromEfficiencyRatioAndTimeDifference",
  "findIndividualTimeFromEfficiencyRatioAndTimeSum",
  "findEfficiencyRatioFromOutputAndTimeComparison",
  "findComparativeOutputFromDifferentEfficienciesAndDurations",
  "findComparativeDurationFromDifferentWorkAndEfficiencies",
  "findSuccessiveEfficiencyRatioAcrossThreeAgents",
  "findSuccessiveEfficiencyPercentComparison",
  "findEfficiencyChangePercentFromCompletionTimeChange",
] as const;

export type TmwCp003SolveMode = (typeof TMW_CP_003_SOLVE_MODES)[number];
export type TmwCp003AnswerType = "RATIO" | "PERCENT" | "TIME" | "OUTPUT";
export type TmwCp003RuleId =
  | "TMW_EFFICIENCY_TIME_INVERSE"
  | "TMW_EFFICIENCY_PERCENT_CHANGE"
  | "TMW_COMPARATIVE_PRODUCTIVITY"
  | "TMW_EFFICIENCY_COMBINED_RATE"
  | "TMW_SUCCESSIVE_EFFICIENCY";

export interface TmwCp003RegistryEntry {
  qlId: string;
  cpId: typeof TMW_CP_003_ID;
  solveMode: TmwCp003SolveMode;
  answerType: TmwCp003AnswerType;
  ruleId: TmwCp003RuleId;
  difficulty: TmwDifficulty;
  publiclyPublishable: false;
}

export interface TmwCp003Context {
  agentNoun: string;
  jobPhrase: string;
  outputNoun: string;
  outputVerb: string;
}

export interface TmwCp003Parameters {
  timeUnit: TmwTimeUnit;
  efficiencyA: Rational;
  efficiencyB: Rational;
  efficiencyC?: Rational;
  timeA?: Rational;
  timeB?: Rational;
  timeC?: Rational;
  workA?: Rational;
  workB?: Rational;
  durationA?: Rational;
  durationB?: Rational;
  outputA?: Rational;
  outputB?: Rational;
  combinedTime?: Rational;
  timeDifference?: Rational;
  timeSum?: Rational;
  percentAOverB?: Rational;
  percentBOverC?: Rational;
  originalTime?: Rational;
  changedTime?: Rational;
  targetAgentIndex?: 0 | 1;
  context: TmwCp003Context;
}

export interface TmwCp003Solution {
  answer: Rational;
  answerType: TmwCp003AnswerType;
  formulaLatex: string;
  workedLatex: string[];
  answerText: string;
}

export type TmwCp003MisconceptionId =
  | "CORRECT"
  | "DIRECT_TIME_RATIO"
  | "RATIO_ORDER_REVERSED"
  | "RATIO_SUM_USED"
  | "PERCENT_BASE_REVERSED"
  | "EFFICIENCY_PERCENT_USED_AS_TIME_PERCENT"
  | "TIME_PERCENT_USED_AS_EFFICIENCY_PERCENT"
  | "EFFICIENCY_MULTIPLIER_NOT_INVERTED"
  | "EQUAL_TIME_ASSUMED"
  | "TIME_FACTOR_OMITTED"
  | "WORK_FACTOR_OMITTED"
  | "OUTPUT_DIVIDED_INSTEAD_OF_MULTIPLIED"
  | "REFERENCE_OUTPUT_REPORTED"
  | "COMBINED_TIME_REPORTED"
  | "OTHER_AGENT_TIME_REPORTED"
  | "TIME_DIFFERENCE_USED_DIRECTLY"
  | "TIME_SUM_USED_DIRECTLY"
  | "SUCCESSIVE_PERCENTAGES_ADDED"
  | "SECOND_RELATION_OMITTED"
  | "TIME_CHANGE_PERCENT_REPORTED"
  | "OLD_TIME_BASE_USED"
  | "RAW_TIME_RATIO_PERCENT"
  | "PLAUSIBLE_SCALE_ERROR";

export interface TmwCp003Option {
  text: string;
  value: Rational;
  misconceptionId: TmwCp003MisconceptionId;
}

export interface TmwCp003GeneratedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: typeof TMW_CP_003_ID;
  questionLanguageId: string;
  solveMode: TmwCp003SolveMode;
  language: "en";
  seed: string;
  stem: string;
  parameters: TmwCp003Parameters;
  solution: TmwCp003Solution;
  options: string[];
  optionAudit: TmwCp003Option[];
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
      misconceptionId: Exclude<TmwCp003MisconceptionId, "CORRECT">;
      explanation: string;
    };
    conclusion: string;
  };
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  publiclyPublishable: false;
}
