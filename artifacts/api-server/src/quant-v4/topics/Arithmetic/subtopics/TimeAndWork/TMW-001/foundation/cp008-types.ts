import type { Rational, TmwDifficulty } from "./types";
export const TMW_CP_008_ID="TMW-CP-008" as const;
export const TMW_CP_008_SOLVE_MODES=[
  "findPaymentRatioFromContributionFactors",
  "findSelectedPartyPayment",
  "findTotalPaymentPoolFromKnownShare",
  "findResidualPayment",
  "findPaymentAfterStagedParticipation",
  "findPaymentFromCompletedFractions",
  "findContributionFactorRatioFromPayments",
  "findMissingTimeFromPayment",
  "findMissingEfficiencyFromPayment",
  "findMixedCategoryPaymentDistribution",
  "findPieceRatePaymentFromOutput",
  "findBonusShareFromExtraContribution",
  "findPaymentAfterSignedContribution",
] as const;
export type TmwCp008SolveMode=(typeof TMW_CP_008_SOLVE_MODES)[number];
export type TmwCp008AnswerType="RATIO"|"MONEY"|"MONEY_TRIPLE"|"TIME"|"EFFICIENCY";
export type TmwCp008RuleId="TMW_CONTRIBUTION_RATIO"|"TMW_PAYMENT_SHARE"|"TMW_PAYMENT_INVERSE"|"TMW_STAGED_PAYMENT"|"TMW_PIECE_RATE"|"TMW_EXTRA_CONTRIBUTION"|"TMW_SIGNED_CONTRIBUTION";
export interface TmwCp008RegistryEntry{qlId:string;cpId:typeof TMW_CP_008_ID;solveMode:TmwCp008SolveMode;answerType:TmwCp008AnswerType;ruleId:TmwCp008RuleId;difficulty:TmwDifficulty;publiclyPublishable:false;}
export interface TmwCp008Role{name:string;role:string;pluralRole:string;count:Rational;efficiency:Rational;days:Rational;hoursPerDay:Rational;output:Rational;baselineOutput:Rational;defectiveOutput:Rational;}
export interface TmwCp008Context{setting:string;task:string;outputUnit:string;roles:[TmwCp008Role,TmwCp008Role,TmwCp008Role];}
export type TmwCp008EventKind="JOIN"|"LEAVE"|"HANDOFF";
export type TmwCp008FactorTarget="EFFICIENCY_RATIO"|"TIME_RATIO"|"TIME"|"EFFICIENCY";
export interface TmwCp008Parameters{
  context:TmwCp008Context;
  totalPayment:Rational;
  targetIndex?:0|1|2;
  selectedIndices?:Array<0|1|2>;
  contributionWeights?:[Rational,Rational,Rational];
  reportedPayments?:[Rational,Rational,Rational];
  knownPaymentIndices?:Array<0|1|2>;
  eventKind?:TmwCp008EventKind;
  factorTarget?:TmwCp008FactorTarget;
  pieceRate?:Rational;
  bonusPool?:Rational;
}
export interface TmwCp008Solution{answerValues:Rational[];answerType:TmwCp008AnswerType;answerText:string;answerKey:string;formulaLatex:string;workedLatex:string[];}
export type TmwCp008MisconceptionId="CORRECT"|"TIME_FACTOR_IGNORED"|"EFFICIENCY_FACTOR_IGNORED"|"HOURS_FACTOR_IGNORED"|"EQUAL_SPLIT_ASSUMED"|"RATIO_USED_AS_MONEY"|"TOTAL_REPORTED_AS_SHARE"|"KNOWN_PAYMENT_NOT_SUBTRACTED"|"RATIO_ORDER_REVERSED"|"CONTRIBUTION_FACTOR_NOT_ISOLATED"|"PIECE_RATE_NOT_APPLIED"|"BASELINE_OUTPUT_NOT_SUBTRACTED"|"DEFECTIVE_OUTPUT_NOT_DEDUCTED"|"PLAUSIBLE_SCALE_ERROR";
export interface TmwCp008Option{text:string;key:string;misconceptionId:TmwCp008MisconceptionId;}
export interface TmwCp008LearningShortcut{title:string;steps:string[];}
export interface TmwCp008CommonTrap{optionLabel:string;optionText:string;misconceptionId:Exclude<TmwCp008MisconceptionId,"CORRECT">;explanation:string;}
export interface TmwCp008Explanation{opening:string;formula:string;givens:string[];steps:string[];shortcut:TmwCp008LearningShortcut;commonTrap:TmwCp008CommonTrap;conclusion:string;}
export interface TmwCp008GeneratedQuestion{archetypeId:"TMW-001";canonicalProblemId:typeof TMW_CP_008_ID;questionLanguageId:string;solveMode:TmwCp008SolveMode;language:"en";seed:string;stem:string;parameters:TmwCp008Parameters;solution:TmwCp008Solution;options:string[];optionAudit:TmwCp008Option[];correctIndex:number;explanation:TmwCp008Explanation;mathematicalFingerprint:string;validation:{valid:boolean;errors:string[]};publiclyPublishable:false;}
