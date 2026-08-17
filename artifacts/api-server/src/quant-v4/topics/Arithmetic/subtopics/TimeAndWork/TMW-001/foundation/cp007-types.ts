import type { Rational, TmwDifficulty } from "./types";

export const TMW_CP_007_ID = "TMW-CP-007" as const;

export const TMW_CP_007_SOLVE_MODES = [
  "findTwoCategoryEfficiencyRatio",
  "findThreeCategoryEfficiencyRatio",
  "findMixedCrewCompletionTime",
  "findEquivalentCategoryCount",
  "findUnknownCategoryCountForTargetTime",
  "findCrewCompositionFromTwoOutputFacts",
  "findCategoryRateFromWeightedCrewFacts",
  "findHeterogeneousGroupRate",
  "findCompletionAfterCategoryReplacement",
  "findMixedCrewOutput",
  "findEquivalentStandardResourceTime",
  "findMinimumIntegerCrewComposition",
  "findUnknownCategorySoloTime",
  "findCategoryContributionFraction",
  "compareTwoHeterogeneousCrews",
  "findIntegerCrewCompositionUnderConstraints",
] as const;

export type TmwCp007SolveMode = (typeof TMW_CP_007_SOLVE_MODES)[number];
export type TmwCp007AnswerType = "COUNT" | "TIME" | "RATE" | "RATIO" | "TRIPLE_RATIO" | "COUNT_PAIR" | "WORK" | "FRACTION" | "RESOURCE_TIME";
export type TmwCp007RuleId =
  | "TMW_CATEGORY_EQUIVALENCE"
  | "TMW_WEIGHTED_CREW_RATE"
  | "TMW_HETEROGENEOUS_LINEAR_SYSTEM"
  | "TMW_CATEGORY_REPLACEMENT"
  | "TMW_WEIGHTED_CONTRIBUTION"
  | "TMW_INTEGER_CREW_SEARCH";

export interface TmwCp007RegistryEntry {
  qlId:string;
  cpId:typeof TMW_CP_007_ID;
  solveMode:TmwCp007SolveMode;
  answerType:TmwCp007AnswerType;
  ruleId:TmwCp007RuleId;
  difficulty:TmwDifficulty;
  publiclyPublishable:false;
}

export interface TmwCp007Category {
  singular:string;
  plural:string;
  efficiency:Rational;
  resourceTimeUnit:string;
}

export interface TmwCp007Context {
  jobPhrase:string;
  outputUnit:string;
  categories:[TmwCp007Category,TmwCp007Category,TmwCp007Category];
}

export interface TmwCp007Parameters {
  context:TmwCp007Context;
  crewA:[Rational,Rational,Rational];
  crewB:[Rational,Rational,Rational];
  workA:Rational;
  workB:Rational;
  daysA:Rational;
  daysB:Rational;
  targetCategoryIndex?:0|1|2;
  sourceCategoryIndex?:0|1|2;
  replacementCategoryIndex?:0|1|2;
  totalCrewCount?:Rational;
  targetCrewRate?:Rational;
  maximumCrewCount?:Rational;
  pairwiseCrews?:Array<[Rational,Rational,Rational]>;
  pairwiseRates?:Rational[];
}

export interface TmwCp007Solution {
  answerValues:Rational[];
  answerType:TmwCp007AnswerType;
  formulaLatex:string;
  workedLatex:string[];
  answerText:string;
  answerKey:string;
}

export type TmwCp007MisconceptionId =
  | "CORRECT"
  | "CATEGORY_RATES_ASSUMED_EQUAL"
  | "COUNT_RATIO_NOT_INVERTED"
  | "CREW_RATE_NOT_SUMMED"
  | "KNOWN_CATEGORY_OMITTED"
  | "TOTAL_REPORTED_AS_REPLACEMENT"
  | "REPLACEMENT_RATIO_REVERSED"
  | "TIME_RATE_INVERSION_MISSED"
  | "CONTRIBUTION_USES_HEADCOUNT_ONLY"
  | "PAIR_ORDER_REVERSED"
  | "INTEGER_CONSTRAINT_IGNORED"
  | "PLAUSIBLE_SCALE_ERROR";

export interface TmwCp007Option {
  text:string;
  key:string;
  misconceptionId:TmwCp007MisconceptionId;
}

export interface TmwCp007LearningShortcut {
  title:string;
  steps:string[];
}

export interface TmwCp007CommonTrap {
  optionLabel:string;
  optionText:string;
  misconceptionId:Exclude<TmwCp007MisconceptionId,"CORRECT">;
  explanation:string;
}

export interface TmwCp007Explanation {
  opening:string;
  formula:string;
  givens:string[];
  steps:string[];
  shortcut:TmwCp007LearningShortcut;
  commonTrap:TmwCp007CommonTrap;
  conclusion:string;
}

export interface TmwCp007GeneratedQuestion {
  archetypeId:"TMW-001";
  canonicalProblemId:typeof TMW_CP_007_ID;
  questionLanguageId:string;
  solveMode:TmwCp007SolveMode;
  language:"en";
  seed:string;
  stem:string;
  parameters:TmwCp007Parameters;
  solution:TmwCp007Solution;
  options:string[];
  optionAudit:TmwCp007Option[];
  correctIndex:number;
  explanation:TmwCp007Explanation;
  mathematicalFingerprint:string;
  validation:{valid:boolean;errors:string[]};
  publiclyPublishable:false;
}
