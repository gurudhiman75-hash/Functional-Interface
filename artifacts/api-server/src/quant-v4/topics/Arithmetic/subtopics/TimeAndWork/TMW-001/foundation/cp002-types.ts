import type { Rational, TmwDifficulty, TmwTimeUnit } from "./types";

export const TMW_CP_002_ID = "TMW-CP-002" as const;
export const TMW_CP_002_SOLVE_MODES = [
  "findCombinedTimeFromIndividualTimes",
  "findCombinedWorkInGivenTime",
  "findMissingIndividualTimeFromCombinedAndKnownTimes",
  "findAllTogetherTimeFromPairwiseTimes",
  "findIndividualTimeFromPairwiseTimes",
  "findPairTimeFromAllTogetherAndThirdTime",
  "findNetTimeWithDestructiveAgent",
  "findDestructiveTimeFromPositiveAndNetTimes",
  "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes",
  "findIdenticalAgentCountFromSingleAndCombinedTime",
  "findCombinedTimeFromIdenticalAgentCount",
  "findCombinedOutputFromExplicitRates",
  "findMissingRateFromSignedNetRate",
  "findCompletionTimeDifferenceBetweenTeams",
] as const;

export type TmwCp002SolveMode = (typeof TMW_CP_002_SOLVE_MODES)[number];
export type TmwCp002AnswerType = "TIME" | "FRACTION" | "COUNT" | "OUTPUT" | "RATE";
export type TmwCp002RuleId =
  | "TMW_RATE_COMBINE_POSITIVE"
  | "TMW_RATE_COMPONENT_EXTRACT"
  | "TMW_PAIRWISE_RATE_SYSTEM"
  | "TMW_RATE_COMBINE_SIGNED"
  | "TMW_IDENTICAL_AGENT_SCALING"
  | "TMW_EXPLICIT_RATE_AGGREGATION"
  | "TMW_TEAM_RATE_COMPARISON";

export interface TmwCp002RegistryEntry {
  qlId: string;
  cpId: typeof TMW_CP_002_ID;
  solveMode: TmwCp002SolveMode;
  answerType: TmwCp002AnswerType;
  ruleId: TmwCp002RuleId;
  difficulty: TmwDifficulty;
  publiclyPublishable: false;
}

export interface TmwCp002Context {
  jobPhrase: string;
  agentNoun: string;
  outputNoun: string;
}

export interface TmwPairwiseTimes {
  ab: Rational;
  bc: Rational;
  ca: Rational;
}

export interface TmwCp002Parameters {
  totalWork: Rational;
  timeUnit: TmwTimeUnit;
  individualTimes: Rational[];
  individualRates: Rational[];
  duration?: Rational;
  combinedTime?: Rational;
  pairwiseTimes?: TmwPairwiseTimes;
  targetAgentIndex?: number;
  thirdTime?: Rational;
  destructiveTime?: Rational;
  netTime?: Rational;
  knownPositiveTimes?: Rational[];
  identicalAgentCount?: number;
  explicitRates?: Rational[];
  signedKnownRates?: Array<{ sign: 1 | -1; rate: Rational }>;
  missingRateSign?: 1 | -1;
  netRate?: Rational;
  teamATimes?: Rational[];
  teamBTimes?: Rational[];
  context: TmwCp002Context;
}

export interface TmwCp002Solution {
  answer: Rational;
  answerType: TmwCp002AnswerType;
  formulaLatex: string;
  workedLatex: string[];
  answerText: string;
}

export type TmwCp002MisconceptionId =
  | "CORRECT"
  | "ADD_TIMES_INSTEAD_OF_RATES"
  | "AVERAGE_TIMES"
  | "OMIT_ONE_AGENT"
  | "RECIPROCAL_NOT_TAKEN"
  | "PAIRWISE_FACTOR_TWO_MISSED"
  | "PAIRWISE_WRONG_SIGN"
  | "DESTRUCTIVE_RATE_ADDED"
  | "DESTRUCTIVE_RATE_OMITTED"
  | "KNOWN_RATE_WRONG_SIGN"
  | "INVERT_BEFORE_ISOLATING"
  | "IDENTICAL_COUNT_MULTIPLIED"
  | "IDENTICAL_COUNT_IGNORED"
  | "DURATION_OMITTED"
  | "ONE_RATE_OMITTED"
  | "TEAM_TIMES_ADDED"
  | "FASTER_TEAM_TIME_REPORTED"
  | "SLOWER_TEAM_TIME_REPORTED";

export interface TmwCp002Option {
  text: string;
  value: Rational;
  misconceptionId: TmwCp002MisconceptionId;
}

export interface TmwCp002GeneratedQuestion {
  archetypeId: "TMW-001";
  canonicalProblemId: typeof TMW_CP_002_ID;
  questionLanguageId: string;
  solveMode: TmwCp002SolveMode;
  language: "en";
  seed: string;
  stem: string;
  parameters: TmwCp002Parameters;
  solution: TmwCp002Solution;
  options: string[];
  optionAudit: TmwCp002Option[];
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
      misconceptionId: Exclude<TmwCp002MisconceptionId, "CORRECT">;
      explanation: string;
    };
    conclusion: string;
  };
  mathematicalFingerprint: string;
  validation: { valid: boolean; errors: string[] };
  publiclyPublishable: false;
}
