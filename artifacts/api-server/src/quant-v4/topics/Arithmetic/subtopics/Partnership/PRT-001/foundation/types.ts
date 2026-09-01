export const PRT_001_PACKAGE_ID = "PRT-001" as const;
export const PRT_001_CP_IDS = [
  "PRT-CP-001",
  "PRT-CP-002",
  "PRT-CP-003",
  "PRT-CP-004",
  "PRT-CP-005",
  "PRT-CP-006",
  "PRT-CP-007",
] as const;

export type Prt001PilotCanonicalProblemId = (typeof PRT_001_CP_IDS)[number];
export type Prt001Language = "en" | "hi" | "pa";
export type Prt001Difficulty = "Easy" | "Medium" | "Hard";
export type Prt001AnswerType = "RATIO" | "MONEY" | "CAPITAL" | "DURATION" | "PERCENT";
export type Prt001PilotSolveMode =
  | "findProfitRatioFromCapitals"
  | "findPartnerShareFromTotalProfitAndCapitals"
  | "findTotalProfitFromPartnerShareAndCapitals"
  | "findProfitDifferenceFromTotalProfitAndCapitals"
  | "findProfitRatioFromCapitalAndDuration"
  | "findPartnerShareFromTotalProfitCapitalDuration"
  | "findUnknownCapitalFromShareRatioAndDurations"
  | "findUnknownDurationFromShareRatioAndCapitals"
  | "findProfitRatioWhenPartnerJoinsLater"
  | "findShareWhenPartnerLeavesEarly"
  | "findUnknownJoinTimeFromProfitRatio"
  | "findProfitRatioWithMultipleStaggeredJoins"
  | "findProfitRatioAfterCapitalAddition"
  | "findShareAfterCapitalWithdrawal"
  | "findUnknownAddedCapitalFromProfitRatio"
  | "findEventTimeForEqualProfitShares"
  | "findThreePartnerProfitRatio"
  | "findMultiPartnerSharesFromTotalProfit"
  | "findUnknownCapitalInThreePartnerSystem"
  | "findTotalProfitFromOnePartnerShareInMultiPartnerSystem"
  | "findActivePartnerTotalReceiptWithFixedSalary"
  | "findOtherPartnerShareWithPercentCommission"
  | "findSharesAfterCharityDeduction"
  | "findUnknownSalaryFromFinalPartnerReceipts"
  | "findShareWithLateJoinAndCapitalChange"
  | "findShareWithDynamicCapitalAndWorkingPartnerSalary"
  | "findMultiPartnerSharesWithStaggeredEvents"
  | "findUnknownJoinTimeWithPreDistributionDeduction"
  | "findProfitRatioWithJoinAndLeaveEvents"
  | "findUnknownLeaveTimeFromProfitRatio"
  | "findUnknownCapitalOfLateJoiningPartner"
  | "findProfitRatioAfterPercentageCapitalIncrease"
  | "findProfitRatioWithChangesForMultiplePartners"
  | "findSharesFromCapitalMultiplesAndDurations"
  | "findTotalProfitFromActivePartnerFinalReceipt"
  | "findPartnerReceiptsWithMultipleOrderedAllocations"
  | "findProfitRatioWithJoinLeaveAndCapitalChange"
  | "findUnknownCapitalWithStaggeredParticipation"
  | "findTotalProfitFromShareDifferenceAndCapitals"
  | "findCapitalRatioFromProfitRatioAndTimeRatio"
  | "findTimeRatioFromProfitRatioAndCapitalRatio"
  | "findProfitRatioWithMultipleChangesForOnePartner"
  | "findUnknownCapitalChangeTimeFromProfitRatio"
  | "findFourPartnerProfitRatio"
  | "findUnknownDurationInThreePartnerSystem"
  | "findCapitalRatioFromPartnerShareRelations"
  | "findTotalProfitFromSleepingPartnerReceipt"
  | "findPartnerReceiptWithSalaryAndDeduction"
  | "findShareWithDynamicCapitalAndPercentCommission"
  | "findUnknownJoinTimeWithCapitalChangeHistory"
  | "findTotalProfitFromMixedTimelineFinalReceipt"
  | "findDifferenceBetweenFinalReceiptsInMixedSystem"
  | "findTotalProfitFromShareDifferenceAndWeights"
  | "findUnknownPercentageCapitalChange"
  | "findInitialCapitalFromFinalShareAndChangeHistory"
  | "findDurationRatioFromPartnerShareRelations"
  | "findUnknownCommissionPercentFromFinalReceipt"
  | "findUnknownDeductionFromPartnerShare"
  | "findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary"
  | "findEqualFinalReceiptsConditionWithRemuneration"
  | "findReverseContributionFromMixedPartnerRelations"
  | "findUnknownCapitalFromProfitRatio"
  | "findTotalProfitFromPartnerShareCapitalDuration"
  | "findUnknownJoinTimeFromPartnerShare"
  | "findUnknownWithdrawnCapitalFromProfitRatio"
  | "findTotalProfitFromDifferenceBetweenTwoShares"
  | "findOtherPartnerShareFromKnownShareAndCapitals"
  | "findCapitalRatioFromProfitShares"
  | "findLossShareFromCapitals"
  | "findIndividualCapitalsFromTotalCapitalAndProfitRatio"
  | "findCapitalForEqualProfitGivenDurations"
  | "findDurationForEqualProfitGivenCapitals"
  | "findProfitDifferenceFromCapitalDurationWeights"
  | "findProfitRatioWhenPartnerLeavesEarly"
  | "findShareWhenPartnerJoinsLater"
  | "findUnknownCapitalOfEarlyLeavingPartner"
  | "findTotalProfitFromStaggeredPartnerShare"
  | "findProfitRatioAfterPercentageCapitalDecrease"
  | "findProfitRatioAfterFractionalCapitalChange"
  | "findUnknownCapitalChangeTimeFromPartnerShare";

export type MoneyUnit = "RUPEE";
export type TimeUnit = "MONTH" | "YEAR";
export type PartnerRole = "ACTIVE" | "SLEEPING" | "UNSPECIFIED";
export type AllocationBasis =
  | "FIXED_AMOUNT"
  | "PERCENT_OF_GROSS_PROFIT"
  | "PERCENT_OF_POST_DEDUCTION_POOL";
export type AllocationKind =
  | "SALARY"
  | "COMMISSION"
  | "BONUS"
  | "CHARITY"
  | "RESERVE"
  | "EXPENSE";

export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export interface CapitalSegment {
  readonly start: Rational;
  readonly end: Rational;
  readonly capital: Rational;
}

export interface Partner {
  readonly partnerId: string;
  readonly role: PartnerRole;
  readonly capitalSegments: readonly CapitalSegment[];
}

export interface PreDistributionAllocation {
  readonly recipientPartnerId?: string;
  readonly kind: AllocationKind;
  readonly basis: AllocationBasis;
  /** Fixed rupees or a percentage value such as 10 for 10%. */
  readonly value: Rational;
  readonly sequence: number;
}

export interface PartnershipState {
  readonly totalDuration: Rational;
  readonly grossProfitOrLoss: Rational;
  readonly partners: readonly Partner[];
  readonly allocations: readonly PreDistributionAllocation[];
  readonly moneyUnit?: MoneyUnit;
  readonly timeUnit?: TimeUnit;
}

export interface PartnerWeight {
  readonly partnerId: string;
  readonly effectiveCapital: Rational;
}

export interface CapitalTimeline {
  readonly totalDuration: Rational;
  readonly weights: readonly PartnerWeight[];
}

export interface AllocationExecution {
  readonly sequence: number;
  readonly kind: AllocationKind;
  readonly recipientPartnerId?: string;
  readonly poolBefore: Rational;
  readonly amount: Rational;
  readonly poolAfter: Rational;
}

export interface DistributablePoolResult {
  readonly grossProfitOrLoss: Rational;
  readonly distributablePool: Rational;
  readonly executions: readonly AllocationExecution[];
}

export interface Prt001Solution {
  readonly packageId: typeof PRT_001_PACKAGE_ID;
  readonly timeline: CapitalTimeline;
  readonly normalizedRatio: readonly bigint[];
  readonly pool: DistributablePoolResult;
  readonly distributedShares: Readonly<Record<string, Rational>>;
  readonly finalPartnerReceipts: Readonly<Record<string, Rational>>;
}

export interface Prt001IndependentVerification {
  readonly supported: true;
  readonly method: string;
  readonly weights: readonly PartnerWeight[];
  readonly distributablePool: Rational;
  readonly distributedShares: Readonly<Record<string, Rational>>;
  readonly finalPartnerReceipts: Readonly<Record<string, Rational>>;
}

export interface Prt001ValidationCheck {
  readonly name: string;
  readonly passed: boolean;
  readonly message: string;
}

export interface Prt001ValidationResult {
  readonly valid: boolean;
  readonly checks: readonly Prt001ValidationCheck[];
}

export interface Prt001ReasoningNode {
  readonly id: string;
  readonly kind:
    | "GIVEN"
    | "TIMELINE"
    | "WEIGHT"
    | "ALLOCATION"
    | "DISTRIBUTION"
    | "ANSWER";
  readonly label: string;
  readonly value: string;
}

export interface Prt001ReasoningGraph {
  readonly nodes: readonly Prt001ReasoningNode[];
  readonly edges: readonly { readonly from: string; readonly to: string }[];
}

export interface Prt001TaskRegistryEntry {
  readonly cpId: Prt001PilotCanonicalProblemId;
  readonly taskKind: string;
  readonly solveMode: Prt001PilotSolveMode;
  readonly answerType: Prt001AnswerType;
  readonly difficulty: Prt001Difficulty;
  readonly requiredVariables: readonly string[];
  readonly scenarioFamily: string;
  readonly distractorProfile: string;
  readonly explanationStrategy: string;
  readonly active: boolean;
}

export interface Prt001PilotParameters {
  readonly questionLanguageId: string;
  readonly seed: string;
  readonly language: Prt001Language;
  readonly entry: Prt001TaskRegistryEntry;
  readonly state: PartnershipState;
  readonly partnerA: string;
  readonly partnerB: string;
  readonly partnerC?: string;
  readonly targetPartnerId?: string;
  readonly targetUnknown?: "CAPITAL_A" | "DURATION_A";
  readonly renderVariables: Readonly<Record<string, string | number>>;
}

export type Prt001TaskAnswer =
  | {
      readonly kind: "RATIO";
      readonly ratio: readonly bigint[];
      readonly display: string;
    }
  | {
      readonly kind: "RATIONAL";
      readonly exact: Rational;
      readonly display: string;
    };

export interface Prt001QuestionPackage {
  readonly packageId: typeof PRT_001_PACKAGE_ID;
  readonly archetypeId: typeof PRT_001_PACKAGE_ID;
  readonly canonicalProblemId: Prt001PilotCanonicalProblemId;
  readonly questionLanguageId: string;
  readonly questionId: string;
  readonly seed: string;
  readonly language: Prt001Language;
  readonly difficulty: Prt001Difficulty;
  readonly difficultyBand: Prt001Difficulty;
  readonly taskKind: string;
  readonly solveMode: Prt001PilotSolveMode;
  readonly answerType: Prt001AnswerType;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: { readonly lines: readonly string[] };
  readonly parameters: Readonly<Record<string, string | number>>;
  readonly reasoningGraph: Prt001ReasoningGraph;
  readonly validation: Prt001ValidationResult;
  readonly maturity: "RUNTIME_PROOF";
  readonly publiclyPublishable: false;
  readonly traceability: Readonly<Record<string, unknown>>;
}
