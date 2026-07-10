export const RAP_003_ARCHETYPE_ID = "RAP-003" as const;

export const RAP_003_CP_IDS = ["RAP-CP-013", "RAP-CP-014", "RAP-CP-015", "RAP-CP-016", "RAP-CP-017", "RAP-CP-018", "RAP-CP-019", "RAP-CP-020", "RAP-CP-021", "RAP-CP-022"] as const;
export const RAP_003_LANGUAGES = ["en", "hi", "pa"] as const;

export type Rap003CanonicalProblemId = (typeof RAP_003_CP_IDS)[number];
export type Rap003Language = (typeof RAP_003_LANGUAGES)[number];
export type Rap003DifficultyBand = "Easy" | "Medium" | "Hard";

export type Rap003TaskKind =
  | "partnershipProfitShare"
  | "partnershipJoiningPartnerProfit"
  | "partnershipMidPeriodChange"
  | "partnershipLeavingPartnerProfit"
  | "partnershipMidPeriodChangeBoth"
  | "partnershipSalaryThenProfitShare"
  | "partnershipProfitFromKnownShare"
  | "partnershipCapitalRatioTimeRatio"
  | "partnershipLossShare"
  | "workContributionShare"
  | "partnershipNewPartnerCapital"
  | "partnershipTimeFromProfitRatio"
  | "partnershipTargetPartnerShareFromRatio"
  | "partnershipRemainingProfitAfterCommission"
  | "agePresentFromFutureRatio"
  | "agePresentFromPastRatio"
  | "ageYearsToReachRatio"
  | "ageYearsToReachPastRatio"
  | "ageFromDifferenceAndRatio"
  | "ageFromSumAndRatio"
  | "ageFutureRatioFromPresent"
  | "agePastRatioFromPresent"
  | "ageThreePersonSumRatio"
  | "ageThreePersonKnownAge"
  | "ageAverageAndRatio"
  | "ageAverageThreePersonRatio"
  | "ageFutureSumAndPresentRatio"
  | "agePastSumAndPresentRatio"
  | "ageDoubleHalfWording"
  | "incomeExpenditureSavingsRatio"
  | "incomeExpenditureEqualSavings"
  | "incomeFromSavingsRatio"
  | "expenditureFromSavingsRatio"
  | "incomeExpenseDifferenceSavings"
  | "incomeExpenseSumSavings"
  | "incomeExpenseOneSavesPercent"
  | "incomeExpenseFindSavingsPercent"
  | "familyIncomeExpenditure"
  | "salarySpendingSavings"
  | "shopRevenueCostProfit"
  | "equalIncomeDifferentExpense"
  | "equalExpenseDifferentIncome"
  | "pocketMoneySpending"
  | "givenOneSavesMore"
  | "givenOneSpendsMore"
  | "incomeExpenseTotalIncome"
  | "incomeExpenseTotalExpense"
  | "incomeExpenseSavingsComparison"
  | "alloyMixingRatioFromTarget"
  | "alloyTargetComponentFromMix"
  | "alloyThreeSourceEqualMix"
  | "weightedAverageGroup"
  | "alloyMissingQuantity"
  | "alloyMissingSourcePercent"
  | "alloyTargetFromThreeSources"
  | "alloyPureAndImpureMix"
  | "alloyZeroComponentMix"
  | "weightedProfitPercentMix"
  | "weightedDiscountMix"
  | "sugarSolutionConcentration"
  | "averagePriceFromRatio"
  | "mixingRatioFromAveragePrice"
  | "marksAverageMixture"
  | "reverseWeightedAverageCount"
  | "reverseWeightedAverageGroupAvg"
  | "alloyTargetExactlyMidpoint"
  | "alloyNonMidpointTrap"
  | "alloyReplaceToTarget"
  | "alloyRatioToFinalPercent"
  | "replacementFinalRatio"
  | "replacementFinalQuantity"
  | "replacementIterationsFromFinalRatio"
  | "replacementAddedLiquidQuantity"
  | "replacementOriginalPercentRemaining"
  | "replacementRemovedVolumeFromFinalRatio"
  | "replacementDifferentRounds"
  | "replacementTankSolution"
  | "replacementInventoryAnalogy"
  | "replacementInitialFromFinalQuantity"
  | "replacementFinalAfterFractionRemoval"
  | "replacementStrengthAfterRounds"
  | "denominationTotalValue"
  | "denominationCountsFromValue"
  | "denominationTargetCount"
  | "denominationSwapValue"
  | "denominationTotalCountFromValue"
  | "denominationTotalValueFromTotalCount"
  | "denominationValueRatio"
  | "denominationAverageValue"
  | "denominationFourTypeTotalCount"
  | "denominationMissingRatioPart"
  | "ticketValueSystem"
  | "marksPerQuestionType"
  | "sdtTimeRatioFromSpeedDistance"
  | "sdtDistanceRatioFromSpeedTime"
  | "sdtSpeedRatioFromDistanceTime"
  | "sdtRaceLead"
  | "sdtOvertakeTime"
  | "fixedDistanceSpeedTimeInverse"
  | "fixedTimeSpeedDistanceDirect"
  | "sdtRaceLeadSpeedRatio"
  | "sdtRaceLeadTime"
  | "sdtOppositeDirectionMeeting"
  | "trainPlatformRatio"
  | "workEfficiencyTimeRatio"
  | "machinesOutputTime"
  | "pipesTimeRatio"
  | "workersEfficiencyDays"
  | "findMissingRateFromOutput"
  | "timeSavedByHigherSpeed"
  | "distanceSlowerCoversWhenFasterFinishes"
  | "sameWorkTwoTeams"
  | "rateProductAbsoluteOutput"
  | "relativeSpeedRatioFromOvertake"
  | "populationCrossTabCellCount"
  | "populationTotalLiterate"
  | "populationLiteracyPercent"
  | "populationCellRatio"
  | "populationTotalIlliterate"
  | "populationCellPercentOfTotal"
  | "populationRecoverTotalFromCell"
  | "populationMissingRowTotal"
  | "populationDifferenceBetweenCells"
  | "populationSumOfSelectedCells"
  | "populationThreeRows"
  | "populationMiniCaseletQuestion1"
  | "populationMiniCaseletQuestion2"
  | "populationColumnRatioGiven"
  | "populationTableValidationTrap"
  | "electionWinnerVotes"
  | "electionWinningMargin"
  | "electionTotalVotersFromMargin"
  | "electionLoserVotes"
  | "electionInvalidVotes"
  | "electionPolledVotesFromTurnout"
  | "electionValidVotesFromInvalidRate"
  | "electionWinnerFromMarginAndValidVotes"
  | "electionLoserFromMarginAndValidVotes"
  | "electionThreeCandidateSplit"
  | "electionCandidateSharePercent"
  | "electionRatioFromVoteSharePercent"
  | "electionOneCandidateMorePercent"
  | "electionMarginAsPercentOfValid"
  | "electionTotalElectorateFromCandidateVotes"
  | "marketShareWinner"
  | "surveyResponseShare"
  | "electionNotaInvalidStyle"
  | "electionReverseTurnoutFromValidVotes"
  | "electionMarginDifferenceChain"
  | "geometricAreaRatioFromSide"
  | "geometricVolumeRatioFromSide"
  | "geometricSideRatioFromArea"
  | "geometricSurfaceAreaRatioFromVolume"
  | "geometricAreaRatioFromRadius"
  | "mapScaleAreaRatio"
  | "mapScaleLengthFromArea"
  | "similarSolidSurfaceToVolume"
  | "geometricPowerMixedStatement";

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
