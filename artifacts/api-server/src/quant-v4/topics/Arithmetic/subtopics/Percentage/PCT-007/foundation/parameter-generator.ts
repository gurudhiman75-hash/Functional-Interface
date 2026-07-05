import {
  getAnswerType,
  getContextTag,
  getExplanationId,
  getQuestionEntry,
  getQuestionLanguageIds,
  getRequiredVariables,
  getScenarioFamily,
  getSolveMode,
  getTaskKind,
} from "./library";
import { getLocalizedQuestionLanguageIds, isQlLocalized } from "../../../../../../common/language-coverage";
import { localizePercentageLabelFields } from "../../../../../../common/percentage-label-localization";
import { stableBucket } from "./math";
import {
  PCT_007_ARCHETYPE_ID,
  PCT_007_CP_IDS,
  type Pct007CanonicalProblemId,
  type Pct007DifficultyBand,
  type Pct007Language,
  type Pct007Parameters,
  type Pct007Variables,
} from "./types";

export interface Pct007ParameterInput {
  seed?: string;
  language?: Pct007Language;
  questionLanguageId?: string;
  difficultyBand?: Pct007DifficultyBand;
}

type ContextMeta = {
  unitLabel: string;
  wholeLabel: string;
  valuePrefix: string;
};

type CaseletComparisonCandidate = {
  baseValue1: number;
  baseValue2: number;
  rate1: number;
  rate2: number;
};

const AMOUNT_BASES = [4000, 5000, 6000, 8000, 10000, 12000, 15000];
const SMALL_AMOUNT_BASES = [400, 500, 600, 800, 1000, 1200, 1500, 2000];
const PERCENT_CASES = [10, 20, 25, 30, 40, 50, 60, 75, 80] as const;
const SAVINGS_RATE_CASES = [10, 20, 25, 30, 40] as const;
const MARKS_TOTALS = [100, 200, 300, 400, 500, 600];
const SCORE_RATE_CASES = [25, 30, 40, 50, 60, 75, 80] as const;
const PASS_RATE_CASES = [33, 35, 40, 50] as const;
const TOTAL_VOTER_CASES = [1000, 2000, 5000, 10000, 20000];
const TURNOUT_CASES = [60, 70, 75, 80, 90] as const;
const INVALID_RATE_CASES = [5, 10, 20, 25] as const;
const CANDIDATE_RATE_CASES = [40, 50, 60, 70] as const;
const APPLICATION_RATES = [10, 20, 25, 30, 40, 50] as const;
const MIXTURE_RATE_CASES = [10, 20, 25, 40, 50, 60, 75] as const;
const DISCOUNT_CASES = [10, 20, 25, 30, 40] as const;
const TAX_CASES = [5, 10, 15, 20] as const;
const COMMISSION_CASES = [5, 10, 15, 20, 25] as const;
const ERROR_RATE_CASES = [10, 20, 25, 50] as const;

const FAIL_MARGIN_CASES = [
  { percentageRate: 25, passRate: 35, totalMarks: 200 },
  { percentageRate: 30, passRate: 40, totalMarks: 300 },
  { percentageRate: 35, passRate: 50, totalMarks: 400 },
  { percentageRate: 40, passRate: 50, totalMarks: 500 },
  { percentageRate: 45, passRate: 60, totalMarks: 600 },
] as const;

const PASS_MARGIN_CASES = [
  { percentageRate: 45, passRate: 35, totalMarks: 200 },
  { percentageRate: 50, passRate: 40, totalMarks: 300 },
  { percentageRate: 60, passRate: 50, totalMarks: 400 },
  { percentageRate: 70, passRate: 50, totalMarks: 500 },
  { percentageRate: 80, passRate: 60, totalMarks: 600 },
] as const;

const VOTE_SHARE_PAIR_CASES = [
  { rate1: 55, rate2: 45 },
  { rate1: 60, rate2: 30 },
  { rate1: 52, rate2: 40 },
  { rate1: 65, rate2: 25 },
  { rate1: 48, rate2: 42 },
] as const;

const DRYING_CASES = [
  { waterRate: 80, dryWaterRate: 20, initialWeight: 100, finalWeight: 25, waterLost: 75 },
  { waterRate: 80, dryWaterRate: 25, initialWeight: 150, finalWeight: 40, waterLost: 110 },
  { waterRate: 75, dryWaterRate: 25, initialWeight: 120, finalWeight: 40, waterLost: 80 },
  { waterRate: 75, dryWaterRate: 20, initialWeight: 160, finalWeight: 50, waterLost: 110 },
  { waterRate: 70, dryWaterRate: 20, initialWeight: 160, finalWeight: 60, waterLost: 100 },
  { waterRate: 70, dryWaterRate: 25, initialWeight: 100, finalWeight: 40, waterLost: 60 },
  { waterRate: 90, dryWaterRate: 10, initialWeight: 180, finalWeight: 20, waterLost: 160 },
] as const;

const EVAPORATION_CASES = [
  { oldRate: 10, newRate: 20, initialVolume: 100, finalVolume: 50, evaporated: 50 },
  { oldRate: 20, newRate: 25, initialVolume: 100, finalVolume: 80, evaporated: 20 },
  { oldRate: 20, newRate: 40, initialVolume: 100, finalVolume: 50, evaporated: 50 },
  { oldRate: 25, newRate: 50, initialVolume: 80, finalVolume: 40, evaporated: 40 },
  { oldRate: 30, newRate: 50, initialVolume: 100, finalVolume: 60, evaporated: 40 },
  { oldRate: 20, newRate: 50, initialVolume: 100, finalVolume: 40, evaporated: 60 },
] as const;

const TWO_SAME_REMOVAL_CASES = [
  { totalValue: 500, percentageRate: 20, remaining: 320 },
  { totalValue: 400, percentageRate: 25, remaining: 225 },
  { totalValue: 800, percentageRate: 50, remaining: 200 },
  { totalValue: 1000, percentageRate: 20, remaining: 640 },
  { totalValue: 160, percentageRate: 25, remaining: 90 },
] as const;

const THREE_SAME_REMOVAL_CASES = [
  { totalValue: 1000, percentageRate: 20, remaining: 512 },
  { totalValue: 800, percentageRate: 50, remaining: 100 },
  { totalValue: 640, percentageRate: 25, remaining: 270 },
  { totalValue: 500, percentageRate: 20, remaining: 256 },
  { totalValue: 320, percentageRate: 25, remaining: 135 },
] as const;

const TWO_DIFFERENT_REMOVAL_CASES = [
  { totalValue: 1000, rate1: 20, rate2: 25, remaining: 600 },
  { totalValue: 800, rate1: 25, rate2: 20, remaining: 480 },
  { totalValue: 500, rate1: 40, rate2: 20, remaining: 240 },
  { totalValue: 1200, rate1: 50, rate2: 25, remaining: 450 },
  { totalValue: 900, rate1: 20, rate2: 50, remaining: 360 },
] as const;

const GOOD_UNIT_CASES = [
  { totalValue: 1000, percentageRate: 10, rate1: 20, remainingGoodUnits: 720 },
  { totalValue: 800, percentageRate: 20, rate1: 25, remainingGoodUnits: 480 },
  { totalValue: 1200, percentageRate: 25, rate1: 20, remainingGoodUnits: 720 },
  { totalValue: 500, percentageRate: 10, rate1: 40, remainingGoodUnits: 270 },
  { totalValue: 900, percentageRate: 20, rate1: 50, remainingGoodUnits: 360 },
] as const;

const CASELET_COMPARISON_METADATA: Record<string, { subjectA: string; subjectB: string }> = {
  "PCT-QL-491": { subjectA: "Riya", subjectB: "Karan" },
  "PCT-QL-492": { subjectA: "Section A", subjectB: "Section B" },
  "PCT-QL-493": { subjectA: "Town A", subjectB: "Town B" },
  "PCT-QL-494": { subjectA: "Unit A", subjectB: "Unit B" },
  "PCT-QL-495": { subjectA: "Store A", subjectB: "Store B" },
  "PCT-QL-496": { subjectA: "Route A", subjectB: "Route B" },
  "PCT-QL-497": { subjectA: "Candidate A", subjectB: "Candidate B" },
  "PCT-QL-498": { subjectA: "Warehouse A", subjectB: "Warehouse B" },
  "PCT-QL-499": { subjectA: "Block A", subjectB: "Block B" },
  "PCT-QL-500": { subjectA: "Factory A", subjectB: "Factory B" },
};

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function getSelectableQuestionLanguageIds(cpId: Pct007CanonicalProblemId, language: Pct007Language) {
  return getLocalizedQuestionLanguageIds("PCT-007", language, getQuestionLanguageIds(cpId, "en"));
}

function parseContextTag(contextTag: string): ContextMeta {
  const [unitLabel = "", wholeLabel = "value", valueMode = "plain"] = contextTag.split("|");
  return {
    unitLabel,
    wholeLabel,
    valuePrefix: valueMode === "money" ? "Rs. " : "",
  };
}

const LABEL_FIELDS = ["wholeLabel", "unitLabel"] as const;

function isDiscreteCountUnit(unitLabel: string) {
  return ["marks", "people", "students", "passengers", "votes", "bags", "items", "units"].includes(unitLabel);
}

function applicationResultFor(baseValue: number, percentageRate: number, solveMode: string) {
  switch (solveMode) {
    case "findOriginalValueBeforeIncrease":
      return (baseValue * (100 + percentageRate)) / 100;
    case "findRevisedValueAfterIncrease":
      return (baseValue * (100 + percentageRate)) / 100;
    case "findRevisedValueAfterDecrease":
    case "findRemainingQuantityFromPercent":
      return (baseValue * (100 - percentageRate)) / 100;
    case "findUsedQuantityFromPercent":
      return (baseValue * percentageRate) / 100;
    default:
      return baseValue;
  }
}

function getMagnitudePool(unitLabel: string, valuePrefix: string) {
  if (valuePrefix) return SMALL_AMOUNT_BASES;
  if (unitLabel === "marks") return MARKS_TOTALS;
  if (unitLabel === "people") return [1000, 2000, 5000, 10000];
  if (unitLabel === "students") return [100, 120, 150, 200, 240];
  if (unitLabel === "litres") return [20, 40, 50, 80, 100, 120, 200];
  if (unitLabel === "kg") return [20, 40, 50, 80, 100, 120, 200];
  if (unitLabel === "passengers") return [120, 150, 200, 240, 300];
  if (unitLabel === "votes") return [1000, 2000, 5000, 10000];
  if (unitLabel === "bags") return [100, 120, 150, 200, 240];
  if (unitLabel === "items") return [100, 120, 150, 200, 240, 300];
  return [100, 120, 150, 200, 240, 300, 400, 500];
}

function baseMeta(questionLanguageId: string, contextTag: string): Pct007Variables {
  const contextMeta = parseContextTag(contextTag);
  const comparisonMeta = CASELET_COMPARISON_METADATA[questionLanguageId];

  return {
    wholeLabel: contextMeta.wholeLabel,
    unitLabel: contextMeta.unitLabel,
    valuePrefix: contextMeta.valuePrefix,
    ...(comparisonMeta ?? {}),
  };
}

function localizedBaseMeta(questionLanguageId: string, contextTag: string, language: Pct007Language): Pct007Variables {
  return localizePercentageLabelFields(baseMeta(questionLanguageId, contextTag), language, LABEL_FIELDS);
}

function assignDifficulty(cpId: Pct007CanonicalProblemId, language: Pct007Language, seed: string): Pct007DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

function buildSavingsVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const income = pick(AMOUNT_BASES, `${seed}:income`);
  const savingsRate = pick(SAVINGS_RATE_CASES, `${seed}:savingsRate`);
  const spendRate = pick(PERCENT_CASES, `${seed}:spendRate`);

  switch (solveMode) {
    case "findSavingsFromSpendRate":
      return { ...meta, percentageRate: spendRate, baseValue: income };
    case "findExpenditureFromSavingsRate":
      return { ...meta, percentageRate: savingsRate, baseValue: income };
    case "findIncomeFromSavingsAmount":
      return { ...meta, percentageRate: savingsRate, value1: (income * savingsRate) / 100 };
    case "findIncomeFromExpenditureAmount":
      return { ...meta, percentageRate: spendRate, value1: (income * spendRate) / 100 };
    default:
      return { ...meta, percentageRate: savingsRate, value1: (income * savingsRate) / 100 };
  }
}

function buildMarksVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  switch (solveMode) {
    case "findMarksFromTotalMarks": {
      const totalMarks = pick(MARKS_TOTALS, `${seed}:totalMarks`);
      const percentageRate = pick(SCORE_RATE_CASES, `${seed}:percentageRate`);
      return { ...meta, totalMarks, percentageRate };
    }
    case "findTotalFromMarksPercent": {
      const totalMarks = pick(MARKS_TOTALS, `${seed}:totalMarks`);
      const percentageRate = pick(SCORE_RATE_CASES, `${seed}:percentageRate`);
      return { ...meta, marksObtained: (totalMarks * percentageRate) / 100, percentageRate };
    }
    case "findPassMarksFromTotalMarks": {
      const totalMarks = pick(MARKS_TOTALS, `${seed}:totalMarks`);
      const passRate = pick(PASS_RATE_CASES, `${seed}:passRate`);
      return { ...meta, totalMarks, passRate };
    }
    case "findTotalFromFailMargin": {
      const selected = pick(FAIL_MARGIN_CASES, `${seed}:failCase`);
      return {
        ...meta,
        percentageRate: selected.percentageRate,
        passRate: selected.passRate,
        value1: (selected.totalMarks * (selected.passRate - selected.percentageRate)) / 100,
      };
    }
    default: {
      const selected = pick(PASS_MARGIN_CASES, `${seed}:passCase`);
      return {
        ...meta,
        percentageRate: selected.percentageRate,
        passRate: selected.passRate,
        value1: (selected.totalMarks * (selected.percentageRate - selected.passRate)) / 100,
      };
    }
  }
}

function buildElectionVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const totalVoters = pick(TOTAL_VOTER_CASES, `${seed}:totalVoters`);
  const turnoutRate = pick(TURNOUT_CASES, `${seed}:turnoutRate`);
  const invalidRate = pick(INVALID_RATE_CASES, `${seed}:invalidRate`);
  const candidateRate = pick(CANDIDATE_RATE_CASES, `${seed}:candidateRate`);

  if (solveMode === "findVotesPolledFromTurnout") {
    return { ...meta, totalVoters, turnoutRate };
  }
  if (solveMode === "findValidVotesFromInvalidRate") {
    return { ...meta, totalVoters, turnoutRate, invalidRate };
  }
  if (solveMode === "findCandidateVotesFromValidVotes") {
    const candidates = TOTAL_VOTER_CASES.flatMap((candidateTotalVoters) =>
      TURNOUT_CASES.flatMap((candidateTurnoutRate) =>
        INVALID_RATE_CASES.flatMap((candidateInvalidRate) =>
          CANDIDATE_RATE_CASES
            .filter((candidateCandidateRate) => {
              const votesPolled = (candidateTotalVoters * candidateTurnoutRate) / 100;
              const validVotes = votesPolled * (100 - candidateInvalidRate) / 100;
              const candidateVotes = validVotes * candidateCandidateRate / 100;
              return Number.isInteger(votesPolled) && Number.isInteger(validVotes) && Number.isInteger(candidateVotes);
            })
            .map((candidateCandidateRate) => ({
              totalVoters: candidateTotalVoters,
              turnoutRate: candidateTurnoutRate,
              invalidRate: candidateInvalidRate,
              candidateRate: candidateCandidateRate,
            })),
        ),
      ),
    );
    const selected = pick(candidates, `${seed}:integer-candidate-votes`);
    return { ...meta, ...selected };
  }
  if (solveMode === "findWinningMarginFromVoteShare") {
    const candidates = TOTAL_VOTER_CASES.flatMap((candidateTotalVoters) =>
      TURNOUT_CASES.flatMap((candidateTurnoutRate) =>
        INVALID_RATE_CASES.flatMap((candidateInvalidRate) =>
          VOTE_SHARE_PAIR_CASES.filter((pair) => {
            const votesPolled = (candidateTotalVoters * candidateTurnoutRate) / 100;
            const validVotes = votesPolled * (100 - candidateInvalidRate) / 100;
            const candidateVotes1 = validVotes * pair.rate1 / 100;
            const candidateVotes2 = validVotes * pair.rate2 / 100;
            const margin = Math.abs(candidateVotes1 - candidateVotes2);
            return (
              Number.isInteger(votesPolled) &&
              Number.isInteger(validVotes) &&
              Number.isInteger(candidateVotes1) &&
              Number.isInteger(candidateVotes2) &&
              Number.isInteger(margin) &&
              margin > 0
            );
          }).map((pair) => ({
            totalVoters: candidateTotalVoters,
            turnoutRate: candidateTurnoutRate,
            invalidRate: candidateInvalidRate,
            rate1: pair.rate1,
            rate2: pair.rate2,
          })),
        ),
      ),
    );
    const selected = pick(candidates, `${seed}:integer-winning-margin`);
    return { ...meta, ...selected };
  }
  const value1 = (totalVoters * turnoutRate) / 100;
  return { ...meta, turnoutRate, value1 };
}

function buildApplicationVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const totalPool = getMagnitudePool(meta.unitLabel, meta.valuePrefix);
  const countSafeContext = isDiscreteCountUnit(meta.unitLabel);
  const candidates = countSafeContext
    ? totalPool.flatMap((totalValue) =>
        APPLICATION_RATES
          .filter((percentageRate) => Number.isInteger(applicationResultFor(totalValue, percentageRate, solveMode)))
          .map((percentageRate) => ({ totalValue, percentageRate })),
      )
    : [];
  const chosen = candidates.length ? pick(candidates, `${seed}:count-safe`) : null;
  const totalValue = chosen?.totalValue ?? pick(totalPool, `${seed}:totalValue`);
  const percentageRate = chosen?.percentageRate ?? pick(APPLICATION_RATES, `${seed}:percentageRate`);

  if (solveMode === "findOriginalValueBeforeIncrease") {
    return {
      ...meta,
      percentageRate,
      value1: (totalValue * (100 + percentageRate)) / 100,
    };
  }

  return { ...meta, totalValue, percentageRate };
}

function buildMixtureVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const totalValue = pick(getMagnitudePool(meta.unitLabel, meta.valuePrefix), `${seed}:totalValue`);
  const componentRate = pick(MIXTURE_RATE_CASES, `${seed}:componentRate`);
  const componentAmount = (totalValue * componentRate) / 100;
  const otherAmount = totalValue - componentAmount;

  if (solveMode === "findTotalFromComponentAndRate") {
    return { ...meta, componentRate, value1: componentAmount };
  }
  if (solveMode === "findRateFromComponentAndTotal") {
    return { ...meta, value1: componentAmount, totalValue };
  }
  if (solveMode === "findTotalFromOtherComponentAndRate") {
    return { ...meta, componentRate, value1: otherAmount };
  }

  return { ...meta, componentRate, totalValue };
}

function buildDryingVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  if (solveMode === "findFinalVolumeAfterEvaporation" || solveMode === "findEvaporatedAmount") {
    const selected = pick(EVAPORATION_CASES, `${seed}:evaporation`);
    return {
      ...meta,
      oldRate: selected.oldRate,
      newRate: selected.newRate,
      baseValue: selected.initialVolume,
    };
  }

  const selected = pick(DRYING_CASES, `${seed}:drying`);
  if (solveMode === "findInitialWeightFromFinalDryWeight") {
    return {
      ...meta,
      waterRate: selected.waterRate,
      dryWaterRate: selected.dryWaterRate,
      value1: selected.finalWeight,
    };
  }

  return {
    ...meta,
    waterRate: selected.waterRate,
    dryWaterRate: selected.dryWaterRate,
    baseValue: selected.initialWeight,
  };
}

function buildBillingVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const baseValue = pick(SMALL_AMOUNT_BASES, `${seed}:baseValue`);

  if (solveMode === "findDiscountAmount" || solveMode === "findBillAfterDiscount") {
    return { ...meta, baseValue, discountRate: pick(DISCOUNT_CASES, `${seed}:discountRate`) };
  }

  if (solveMode === "findTaxOrChargeAmount") {
    return { ...meta, baseValue, percentageRate: pick(TAX_CASES, `${seed}:taxRate`) };
  }

  if (solveMode === "findFinalBillAfterDiscountAndTax") {
    return {
      ...meta,
      baseValue,
      rate1: pick(DISCOUNT_CASES, `${seed}:rate1`),
      rate2: pick(TAX_CASES, `${seed}:rate2`),
    };
  }

  return { ...meta, baseValue, commissionRate: pick(COMMISSION_CASES, `${seed}:commissionRate`) };
}

function buildErrorVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const correctValue = pick(getMagnitudePool(meta.unitLabel, meta.valuePrefix), `${seed}:correctValue`);
  const percentageRate = pick(ERROR_RATE_CASES, `${seed}:percentageRate`);
  const overstatedWrong = (correctValue * (100 + percentageRate)) / 100;
  const understatedWrong = (correctValue * (100 - percentageRate)) / 100;

  if (solveMode === "findPercentageErrorFromWrongAndCorrect" || solveMode === "findPercentageErrorOnBill") {
    return { ...meta, wrongValue: overstatedWrong, correctValue };
  }
  if (solveMode === "findCorrectValueFromOverstatement" || solveMode === "findActualValueFromMeasuredError") {
    return { ...meta, wrongValue: overstatedWrong, percentageRate };
  }
  return { ...meta, wrongValue: understatedWrong, percentageRate };
}

function buildRepeatedVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  if (solveMode === "findRemainingAfterTwoSameRemovals") {
    const selected = pick(TWO_SAME_REMOVAL_CASES, `${seed}:twoSame`);
    return { ...meta, totalValue: selected.totalValue, percentageRate: selected.percentageRate };
  }
  if (solveMode === "findRemainingAfterThreeSameRemovals") {
    const selected = pick(THREE_SAME_REMOVAL_CASES, `${seed}:threeSame`);
    return { ...meta, totalValue: selected.totalValue, percentageRate: selected.percentageRate };
  }
  if (solveMode === "findRemainingAfterTwoDifferentRemovals" || solveMode === "findTotalRemovedAfterTwoDifferentRemovals") {
    const selected = pick(TWO_DIFFERENT_REMOVAL_CASES, `${seed}:twoDifferent`);
    return { ...meta, totalValue: selected.totalValue, rate1: selected.rate1, rate2: selected.rate2 };
  }

  return {
    ...meta,
    totalValue: pick(getMagnitudePool(meta.unitLabel, meta.valuePrefix), `${seed}:totalValue`),
    percentageRate: pick([10, 20, 25, 40, 50] as const, `${seed}:percentageRate`),
  };
}

function buildCaseletVariables(questionLanguageId: string, solveMode: string, contextTag: string, seed: string, language: Pct007Language): Pct007Variables {
  if (solveMode === "findCaseletSavings") {
    return buildSavingsVariables(questionLanguageId, "findSavingsFromSpendRate", contextTag, seed, language);
  }
  if (solveMode === "findCaseletCandidateVotes") {
    return buildElectionVariables(questionLanguageId, "findCandidateVotesFromValidVotes", contextTag, seed, language);
  }
  if (solveMode === "findCaseletFinalBill") {
    return buildBillingVariables(questionLanguageId, "findFinalBillAfterDiscountAndTax", contextTag, seed, language);
  }
  if (solveMode === "findCaseletRemainingGoodUnits") {
    const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
    const selected = pick(GOOD_UNIT_CASES, `${seed}:goodUnits`);
    return {
      ...meta,
      totalValue: selected.totalValue,
      percentageRate: selected.percentageRate,
      rate1: selected.rate1,
    };
  }

  const meta = localizedBaseMeta(questionLanguageId, contextTag, language);
  const pool = getMagnitudePool(meta.unitLabel, meta.valuePrefix);
  const ratePool = [40, 50, 60, 70, 75, 80] as const;

  if (isDiscreteCountUnit(meta.unitLabel)) {
    const candidates: CaseletComparisonCandidate[] = [];
    for (const baseValue1 of pool) {
      for (const baseValue2 of pool) {
        if (baseValue1 === baseValue2) continue;
        for (const rate1 of ratePool) {
          const actual1 = (baseValue1 * rate1) / 100;
          if (!Number.isInteger(actual1)) continue;
          for (const rate2 of ratePool) {
            const actual2 = (baseValue2 * rate2) / 100;
            if (!Number.isInteger(actual2) || actual1 === actual2) continue;
            candidates.push({ baseValue1, baseValue2, rate1, rate2 });
          }
        }
      }
    }

    if (candidates.length) {
      const chosen = pick(candidates, `${seed}:count-safe-comparison`);
      return { ...meta, baseValue1: chosen.baseValue1, baseValue2: chosen.baseValue2, rate1: chosen.rate1, rate2: chosen.rate2 };
    }
  }

  const baseValue1 = pick(pool, `${seed}:baseValue1`);
  let baseValue2 = pick(pool, `${seed}:baseValue2`);
  if (baseValue2 === baseValue1) {
    baseValue2 = pool[(stableBucket(`${seed}:baseValue2:fallback`, pool.length - 1) + 1) % pool.length]!;
  }
  const rate1 = pick(ratePool, `${seed}:rate1`);
  let rate2 = pick(ratePool, `${seed}:rate2`);
  if ((baseValue1 * rate1) / 100 === (baseValue2 * rate2) / 100) {
    rate2 = ratePool[(stableBucket(`${seed}:rate2:fallback`, ratePool.length - 1) + 1) % ratePool.length]!;
  }

  return { ...meta, baseValue1, baseValue2, rate1, rate2 };
}

function buildVariables(
  cpId: Pct007CanonicalProblemId,
  questionLanguageId: string,
  solveMode: string,
  contextTag: string,
  seed: string,
  language: Pct007Language,
): Pct007Variables {
  switch (cpId) {
    case "PCT-CP-001":
      return buildSavingsVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-002":
      return buildMarksVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-003":
      return buildElectionVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-004":
      return buildApplicationVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-005":
      return buildMixtureVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-006":
      return buildDryingVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-007":
      return buildBillingVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-008":
      return buildErrorVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-009":
      return buildRepeatedVariables(questionLanguageId, solveMode, contextTag, seed, language);
    case "PCT-CP-010":
      return buildCaseletVariables(questionLanguageId, solveMode, contextTag, seed, language);
  }
}

export function selectQuestionLanguageId(
  cpId: Pct007CanonicalProblemId,
  language: Pct007Language,
  seed: string,
  difficultyBand?: Pct007DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct007Parameters(cpId: Pct007CanonicalProblemId, input: Pct007ParameterInput = {}): Pct007Parameters {
  const seed = input.seed ?? `PCT-007:${cpId}`;
  const language = input.language ?? "en";
  const difficultyBand = input.difficultyBand ?? assignDifficulty(cpId, language, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, seed, difficultyBand);
  if (!isQlLocalized("PCT-007", questionLanguageId, language)) {
    throw new Error(`Question language ${language}:${questionLanguageId} is not localized for PCT-007.`);
  }
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const resolvedDifficulty = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const solveMode = getSolveMode(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const scenarioFamily = getScenarioFamily(cpId, questionLanguageId);
  const contextTag = getContextTag(cpId, questionLanguageId);
  const variables = buildVariables(cpId, questionLanguageId, solveMode, contextTag, `${seed}:${scenarioFamily}`, language);

  for (const requiredVariable of requiredVariables) {
    if (!Object.hasOwn(variables, requiredVariable)) {
      throw new Error(`Missing required variable ${requiredVariable} for ${questionLanguageId}`);
    }
  }

  return {
    archetypeId: PCT_007_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${seed}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand: resolvedDifficulty,
    taskKind,
    solveMode,
    answerType,
    requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

export function getPct007ActiveCanonicalProblemIds() {
  return [...PCT_007_CP_IDS] as Pct007CanonicalProblemId[];
}

export function pickPct007CanonicalProblemId(seed: string) {
  return PCT_007_CP_IDS[stableBucket(seed, PCT_007_CP_IDS.length)]!;
}
