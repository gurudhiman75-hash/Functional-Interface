import {
  comparisonAnswer,
  decreaseByPercent,
  formatNumber,
  formatPercent,
  increaseByPercent,
  numericAnswer,
  percentOf,
  prefixedValue,
  roundTo,
} from "./math";
import type { Pct007Parameters, Pct007SolverResult } from "./types";

function asNumber(parameters: Pct007Parameters, key: string) {
  return Number(parameters.variables[key] ?? 0);
}

function asString(parameters: Pct007Parameters, key: string, fallback = "") {
  return String(parameters.variables[key] ?? fallback);
}

function numericResult(parameters: Pct007Parameters, numericValue: number, evidence: Record<string, string | number>, mathJax: Record<string, string>): Pct007SolverResult {
  return {
    answer: numericAnswer(parameters.answerType, numericValue),
    numericAnswer: roundTo(numericValue, 4),
    answerType: parameters.answerType,
    evidence,
    mathJax,
  };
}

export function solvePct007(parameters: Pct007Parameters): Pct007SolverResult {
  const solveMode = parameters.solveMode;
  const evidence: Record<string, string | number> = {
    taskKind: parameters.taskKind,
    solveMode,
  };
  const mathJax: Record<string, string> = {};

  switch (solveMode) {
    case "findSavingsFromSpendRate": {
      const income = asNumber(parameters, "baseValue");
      const spendRate = asNumber(parameters, "percentageRate");
      const savingsRate = 100 - spendRate;
      const savings = percentOf(income, savingsRate);
      evidence.income = income;
      evidence.spendRate = spendRate;
      evidence.savingsRate = savingsRate;
      evidence.savings = savings;
      mathJax.core = `\\frac{${formatNumber(savingsRate)}}{100}\\times${formatNumber(income)}=${formatNumber(savings)}`;
      return numericResult(parameters, savings, evidence, mathJax);
    }
    case "findExpenditureFromSavingsRate": {
      const income = asNumber(parameters, "baseValue");
      const savingsRate = asNumber(parameters, "percentageRate");
      const expenditureRate = 100 - savingsRate;
      const expenditure = percentOf(income, expenditureRate);
      evidence.income = income;
      evidence.savingsRate = savingsRate;
      evidence.expenditureRate = expenditureRate;
      evidence.expenditure = expenditure;
      mathJax.core = `\\frac{${formatNumber(expenditureRate)}}{100}\\times${formatNumber(income)}=${formatNumber(expenditure)}`;
      return numericResult(parameters, expenditure, evidence, mathJax);
    }
    case "findIncomeFromSavingsAmount": {
      const savingsRate = asNumber(parameters, "percentageRate");
      const savings = asNumber(parameters, "value1");
      const income = roundTo((savings * 100) / savingsRate, 4);
      evidence.savingsRate = savingsRate;
      evidence.savings = savings;
      evidence.income = income;
      mathJax.core = `${formatNumber(savings)}\\times\\frac{100}{${formatNumber(savingsRate)}}=${formatNumber(income)}`;
      return numericResult(parameters, income, evidence, mathJax);
    }
    case "findIncomeFromExpenditureAmount": {
      const expenditureRate = asNumber(parameters, "percentageRate");
      const expenditure = asNumber(parameters, "value1");
      const income = roundTo((expenditure * 100) / expenditureRate, 4);
      evidence.expenditureRate = expenditureRate;
      evidence.expenditure = expenditure;
      evidence.income = income;
      mathJax.core = `${formatNumber(expenditure)}\\times\\frac{100}{${formatNumber(expenditureRate)}}=${formatNumber(income)}`;
      return numericResult(parameters, income, evidence, mathJax);
    }
    case "findExpenditureFromSavingsAmount": {
      const savingsRate = asNumber(parameters, "percentageRate");
      const savings = asNumber(parameters, "value1");
      const income = roundTo((savings * 100) / savingsRate, 4);
      const expenditure = roundTo(income - savings, 4);
      evidence.savingsRate = savingsRate;
      evidence.savings = savings;
      evidence.income = income;
      evidence.expenditure = expenditure;
      mathJax.core = `${formatNumber(income)}-${formatNumber(savings)}=${formatNumber(expenditure)}`;
      return numericResult(parameters, expenditure, evidence, mathJax);
    }
    case "findMarksFromTotalMarks": {
      const totalMarks = asNumber(parameters, "totalMarks");
      const percentageRate = asNumber(parameters, "percentageRate");
      const marksObtained = percentOf(totalMarks, percentageRate);
      evidence.totalMarks = totalMarks;
      evidence.percentageRate = percentageRate;
      evidence.marksObtained = marksObtained;
      mathJax.core = `\\frac{${formatNumber(percentageRate)}}{100}\\times${formatNumber(totalMarks)}=${formatNumber(marksObtained)}`;
      return numericResult(parameters, marksObtained, evidence, mathJax);
    }
    case "findTotalFromMarksPercent": {
      const percentageRate = asNumber(parameters, "percentageRate");
      const marksObtained = asNumber(parameters, "marksObtained");
      const totalMarks = roundTo((marksObtained * 100) / percentageRate, 4);
      evidence.percentageRate = percentageRate;
      evidence.marksObtained = marksObtained;
      evidence.totalMarks = totalMarks;
      mathJax.core = `${formatNumber(marksObtained)}\\times\\frac{100}{${formatNumber(percentageRate)}}=${formatNumber(totalMarks)}`;
      return numericResult(parameters, totalMarks, evidence, mathJax);
    }
    case "findPassMarksFromTotalMarks": {
      const totalMarks = asNumber(parameters, "totalMarks");
      const passRate = asNumber(parameters, "passRate");
      const passMarks = percentOf(totalMarks, passRate);
      evidence.totalMarks = totalMarks;
      evidence.passRate = passRate;
      evidence.passMarks = passMarks;
      mathJax.core = `\\frac{${formatNumber(passRate)}}{100}\\times${formatNumber(totalMarks)}=${formatNumber(passMarks)}`;
      return numericResult(parameters, passMarks, evidence, mathJax);
    }
    case "findTotalFromFailMargin": {
      const percentageRate = asNumber(parameters, "percentageRate");
      const passRate = asNumber(parameters, "passRate");
      const margin = asNumber(parameters, "value1");
      const totalMarks = roundTo((margin * 100) / (passRate - percentageRate), 4);
      evidence.percentageRate = percentageRate;
      evidence.passRate = passRate;
      evidence.margin = margin;
      evidence.totalMarks = totalMarks;
      mathJax.core = `${formatNumber(margin)}\\times\\frac{100}{${formatNumber(passRate - percentageRate)}}=${formatNumber(totalMarks)}`;
      return numericResult(parameters, totalMarks, evidence, mathJax);
    }
    case "findTotalFromPassMargin": {
      const percentageRate = asNumber(parameters, "percentageRate");
      const passRate = asNumber(parameters, "passRate");
      const margin = asNumber(parameters, "value1");
      const totalMarks = roundTo((margin * 100) / (percentageRate - passRate), 4);
      evidence.percentageRate = percentageRate;
      evidence.passRate = passRate;
      evidence.margin = margin;
      evidence.totalMarks = totalMarks;
      mathJax.core = `${formatNumber(margin)}\\times\\frac{100}{${formatNumber(percentageRate - passRate)}}=${formatNumber(totalMarks)}`;
      return numericResult(parameters, totalMarks, evidence, mathJax);
    }
    case "findVotesPolledFromTurnout": {
      const totalVoters = asNumber(parameters, "totalVoters");
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const votesPolled = percentOf(totalVoters, turnoutRate);
      evidence.totalVoters = totalVoters;
      evidence.turnoutRate = turnoutRate;
      evidence.votesPolled = votesPolled;
      mathJax.core = `\\frac{${formatNumber(turnoutRate)}}{100}\\times${formatNumber(totalVoters)}=${formatNumber(votesPolled)}`;
      return numericResult(parameters, votesPolled, evidence, mathJax);
    }
    case "findValidVotesFromInvalidRate": {
      const totalVoters = asNumber(parameters, "totalVoters");
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const invalidRate = asNumber(parameters, "invalidRate");
      const votesPolled = percentOf(totalVoters, turnoutRate);
      const invalidVotes = percentOf(votesPolled, invalidRate);
      const validVotes = roundTo(votesPolled - invalidVotes, 4);
      evidence.totalVoters = totalVoters;
      evidence.turnoutRate = turnoutRate;
      evidence.invalidRate = invalidRate;
      evidence.votesPolled = votesPolled;
      evidence.invalidVotes = invalidVotes;
      evidence.validVotes = validVotes;
      mathJax.core = `${formatNumber(votesPolled)}-${formatNumber(invalidVotes)}=${formatNumber(validVotes)}`;
      return numericResult(parameters, validVotes, evidence, mathJax);
    }
    case "findCandidateVotesFromValidVotes": {
      const totalVoters = asNumber(parameters, "totalVoters");
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const invalidRate = asNumber(parameters, "invalidRate");
      const candidateRate = asNumber(parameters, "candidateRate");
      const votesPolled = percentOf(totalVoters, turnoutRate);
      const validVotes = roundTo(votesPolled - percentOf(votesPolled, invalidRate), 4);
      const candidateVotes = percentOf(validVotes, candidateRate);
      evidence.totalVoters = totalVoters;
      evidence.turnoutRate = turnoutRate;
      evidence.invalidRate = invalidRate;
      evidence.candidateRate = candidateRate;
      evidence.votesPolled = votesPolled;
      evidence.validVotes = validVotes;
      evidence.candidateVotes = candidateVotes;
      mathJax.core = `\\frac{${formatNumber(candidateRate)}}{100}\\times${formatNumber(validVotes)}=${formatNumber(candidateVotes)}`;
      return numericResult(parameters, candidateVotes, evidence, mathJax);
    }
    case "findWinningMarginFromVoteShare": {
      const totalVoters = asNumber(parameters, "totalVoters");
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const invalidRate = asNumber(parameters, "invalidRate");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const votesPolled = percentOf(totalVoters, turnoutRate);
      const validVotes = roundTo(votesPolled - percentOf(votesPolled, invalidRate), 4);
      const candidate1Votes = percentOf(validVotes, rate1);
      const candidate2Votes = percentOf(validVotes, rate2);
      const margin = roundTo(Math.abs(candidate1Votes - candidate2Votes), 4);
      evidence.votesPolled = votesPolled;
      evidence.validVotes = validVotes;
      evidence.candidate1Votes = candidate1Votes;
      evidence.candidate2Votes = candidate2Votes;
      evidence.margin = margin;
      mathJax.core = `\\left|${formatNumber(candidate1Votes)}-${formatNumber(candidate2Votes)}\\right|=${formatNumber(margin)}`;
      return numericResult(parameters, margin, evidence, mathJax);
    }
    case "findTotalVotersFromVotesPolled": {
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const votesPolled = asNumber(parameters, "value1");
      const totalVoters = roundTo((votesPolled * 100) / turnoutRate, 4);
      evidence.turnoutRate = turnoutRate;
      evidence.votesPolled = votesPolled;
      evidence.totalVoters = totalVoters;
      mathJax.core = `${formatNumber(votesPolled)}\\times\\frac{100}{${formatNumber(turnoutRate)}}=${formatNumber(totalVoters)}`;
      return numericResult(parameters, totalVoters, evidence, mathJax);
    }
    case "findRevisedValueAfterIncrease": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const revisedValue = increaseByPercent(totalValue, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.revisedValue = revisedValue;
      mathJax.core = `${formatNumber(totalValue)}\\times\\frac{${formatNumber(100 + percentageRate)}}{100}=${formatNumber(revisedValue)}`;
      return numericResult(parameters, revisedValue, evidence, mathJax);
    }
    case "findOriginalValueBeforeIncrease": {
      const percentageRate = asNumber(parameters, "percentageRate");
      const revisedValue = asNumber(parameters, "value1");
      const originalValue = roundTo((revisedValue * 100) / (100 + percentageRate), 4);
      evidence.percentageRate = percentageRate;
      evidence.revisedValue = revisedValue;
      evidence.originalValue = originalValue;
      mathJax.core = `${formatNumber(revisedValue)}\\times\\frac{100}{${formatNumber(100 + percentageRate)}}=${formatNumber(originalValue)}`;
      return numericResult(parameters, originalValue, evidence, mathJax);
    }
    case "findRevisedValueAfterDecrease": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const revisedValue = decreaseByPercent(totalValue, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.revisedValue = revisedValue;
      mathJax.core = `${formatNumber(totalValue)}\\times\\frac{${formatNumber(100 - percentageRate)}}{100}=${formatNumber(revisedValue)}`;
      return numericResult(parameters, revisedValue, evidence, mathJax);
    }
    case "findUsedQuantityFromPercent": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const usedQuantity = percentOf(totalValue, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.usedQuantity = usedQuantity;
      mathJax.core = `\\frac{${formatNumber(percentageRate)}}{100}\\times${formatNumber(totalValue)}=${formatNumber(usedQuantity)}`;
      return numericResult(parameters, usedQuantity, evidence, mathJax);
    }
    case "findRemainingQuantityFromPercent": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const remainingQuantity = decreaseByPercent(totalValue, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.remainingQuantity = remainingQuantity;
      mathJax.core = `${formatNumber(totalValue)}\\times\\frac{${formatNumber(100 - percentageRate)}}{100}=${formatNumber(remainingQuantity)}`;
      return numericResult(parameters, remainingQuantity, evidence, mathJax);
    }
    case "findComponentFromTotalAndRate": {
      const totalValue = asNumber(parameters, "totalValue");
      const componentRate = asNumber(parameters, "componentRate");
      const componentAmount = percentOf(totalValue, componentRate);
      evidence.totalValue = totalValue;
      evidence.componentRate = componentRate;
      evidence.componentAmount = componentAmount;
      mathJax.core = `\\frac{${formatNumber(componentRate)}}{100}\\times${formatNumber(totalValue)}=${formatNumber(componentAmount)}`;
      return numericResult(parameters, componentAmount, evidence, mathJax);
    }
    case "findOtherComponentFromTotalAndRate": {
      const totalValue = asNumber(parameters, "totalValue");
      const componentRate = asNumber(parameters, "componentRate");
      const componentAmount = percentOf(totalValue, componentRate);
      const otherAmount = roundTo(totalValue - componentAmount, 4);
      evidence.totalValue = totalValue;
      evidence.componentRate = componentRate;
      evidence.otherAmount = otherAmount;
      mathJax.core = `${formatNumber(totalValue)}-${formatNumber(componentAmount)}=${formatNumber(otherAmount)}`;
      return numericResult(parameters, otherAmount, evidence, mathJax);
    }
    case "findTotalFromComponentAndRate": {
      const componentRate = asNumber(parameters, "componentRate");
      const componentAmount = asNumber(parameters, "value1");
      const totalValue = roundTo((componentAmount * 100) / componentRate, 4);
      evidence.componentRate = componentRate;
      evidence.componentAmount = componentAmount;
      evidence.totalValue = totalValue;
      mathJax.core = `${formatNumber(componentAmount)}\\times\\frac{100}{${formatNumber(componentRate)}}=${formatNumber(totalValue)}`;
      return numericResult(parameters, totalValue, evidence, mathJax);
    }
    case "findRateFromComponentAndTotal": {
      const componentAmount = asNumber(parameters, "value1");
      const totalValue = asNumber(parameters, "totalValue");
      const componentRate = roundTo((componentAmount * 100) / totalValue, 4);
      evidence.componentAmount = componentAmount;
      evidence.totalValue = totalValue;
      evidence.componentRate = componentRate;
      mathJax.core = `${formatNumber(componentAmount)}\\times\\frac{100}{${formatNumber(totalValue)}}=${formatPercent(componentRate)}`;
      return numericResult(parameters, componentRate, evidence, mathJax);
    }
    case "findTotalFromOtherComponentAndRate": {
      const componentRate = asNumber(parameters, "componentRate");
      const otherAmount = asNumber(parameters, "value1");
      const totalValue = roundTo((otherAmount * 100) / (100 - componentRate), 4);
      evidence.componentRate = componentRate;
      evidence.otherAmount = otherAmount;
      evidence.totalValue = totalValue;
      mathJax.core = `${formatNumber(otherAmount)}\\times\\frac{100}{${formatNumber(100 - componentRate)}}=${formatNumber(totalValue)}`;
      return numericResult(parameters, totalValue, evidence, mathJax);
    }
    case "findFinalDryWeight": {
      const waterRate = asNumber(parameters, "waterRate");
      const dryWaterRate = asNumber(parameters, "dryWaterRate");
      const initialWeight = asNumber(parameters, "baseValue");
      const solidAmount = percentOf(initialWeight, 100 - waterRate);
      const finalWeight = roundTo((solidAmount * 100) / (100 - dryWaterRate), 4);
      evidence.initialWeight = initialWeight;
      evidence.waterRate = waterRate;
      evidence.dryWaterRate = dryWaterRate;
      evidence.solidAmount = solidAmount;
      evidence.finalWeight = finalWeight;
      mathJax.core = `${formatNumber(solidAmount)}\\times\\frac{100}{${formatNumber(100 - dryWaterRate)}}=${formatNumber(finalWeight)}`;
      return numericResult(parameters, finalWeight, evidence, mathJax);
    }
    case "findWaterLostAfterDrying": {
      const waterRate = asNumber(parameters, "waterRate");
      const dryWaterRate = asNumber(parameters, "dryWaterRate");
      const initialWeight = asNumber(parameters, "baseValue");
      const solidAmount = percentOf(initialWeight, 100 - waterRate);
      const finalWeight = roundTo((solidAmount * 100) / (100 - dryWaterRate), 4);
      const waterLost = roundTo(initialWeight - finalWeight, 4);
      evidence.initialWeight = initialWeight;
      evidence.finalWeight = finalWeight;
      evidence.waterLost = waterLost;
      mathJax.core = `${formatNumber(initialWeight)}-${formatNumber(finalWeight)}=${formatNumber(waterLost)}`;
      return numericResult(parameters, waterLost, evidence, mathJax);
    }
    case "findFinalVolumeAfterEvaporation": {
      const oldRate = asNumber(parameters, "oldRate");
      const newRate = asNumber(parameters, "newRate");
      const initialVolume = asNumber(parameters, "baseValue");
      const soluteAmount = percentOf(initialVolume, oldRate);
      const finalVolume = roundTo((soluteAmount * 100) / newRate, 4);
      evidence.initialVolume = initialVolume;
      evidence.oldRate = oldRate;
      evidence.newRate = newRate;
      evidence.soluteAmount = soluteAmount;
      evidence.finalVolume = finalVolume;
      mathJax.core = `${formatNumber(soluteAmount)}\\times\\frac{100}{${formatNumber(newRate)}}=${formatNumber(finalVolume)}`;
      return numericResult(parameters, finalVolume, evidence, mathJax);
    }
    case "findEvaporatedAmount": {
      const oldRate = asNumber(parameters, "oldRate");
      const newRate = asNumber(parameters, "newRate");
      const initialVolume = asNumber(parameters, "baseValue");
      const soluteAmount = percentOf(initialVolume, oldRate);
      const finalVolume = roundTo((soluteAmount * 100) / newRate, 4);
      const evaporatedAmount = roundTo(initialVolume - finalVolume, 4);
      evidence.initialVolume = initialVolume;
      evidence.finalVolume = finalVolume;
      evidence.evaporatedAmount = evaporatedAmount;
      mathJax.core = `${formatNumber(initialVolume)}-${formatNumber(finalVolume)}=${formatNumber(evaporatedAmount)}`;
      return numericResult(parameters, evaporatedAmount, evidence, mathJax);
    }
    case "findInitialWeightFromFinalDryWeight": {
      const waterRate = asNumber(parameters, "waterRate");
      const dryWaterRate = asNumber(parameters, "dryWaterRate");
      const finalWeight = asNumber(parameters, "value1");
      const solidAmount = percentOf(finalWeight, 100 - dryWaterRate);
      const initialWeight = roundTo((solidAmount * 100) / (100 - waterRate), 4);
      evidence.waterRate = waterRate;
      evidence.dryWaterRate = dryWaterRate;
      evidence.finalWeight = finalWeight;
      evidence.initialWeight = initialWeight;
      mathJax.core = `${formatNumber(solidAmount)}\\times\\frac{100}{${formatNumber(100 - waterRate)}}=${formatNumber(initialWeight)}`;
      return numericResult(parameters, initialWeight, evidence, mathJax);
    }
    case "findDiscountAmount": {
      const baseValue = asNumber(parameters, "baseValue");
      const discountRate = asNumber(parameters, "discountRate");
      const discountAmount = percentOf(baseValue, discountRate);
      evidence.baseValue = baseValue;
      evidence.discountRate = discountRate;
      evidence.discountAmount = discountAmount;
      mathJax.core = `\\frac{${formatNumber(discountRate)}}{100}\\times${formatNumber(baseValue)}=${formatNumber(discountAmount)}`;
      return numericResult(parameters, discountAmount, evidence, mathJax);
    }
    case "findBillAfterDiscount": {
      const baseValue = asNumber(parameters, "baseValue");
      const discountRate = asNumber(parameters, "discountRate");
      const finalBill = decreaseByPercent(baseValue, discountRate);
      evidence.baseValue = baseValue;
      evidence.discountRate = discountRate;
      evidence.finalBill = finalBill;
      mathJax.core = `${formatNumber(baseValue)}\\times\\frac{${formatNumber(100 - discountRate)}}{100}=${formatNumber(finalBill)}`;
      return numericResult(parameters, finalBill, evidence, mathJax);
    }
    case "findTaxOrChargeAmount": {
      const baseValue = asNumber(parameters, "baseValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const taxAmount = percentOf(baseValue, percentageRate);
      evidence.baseValue = baseValue;
      evidence.percentageRate = percentageRate;
      evidence.taxAmount = taxAmount;
      mathJax.core = `\\frac{${formatNumber(percentageRate)}}{100}\\times${formatNumber(baseValue)}=${formatNumber(taxAmount)}`;
      return numericResult(parameters, taxAmount, evidence, mathJax);
    }
    case "findFinalBillAfterDiscountAndTax": {
      const baseValue = asNumber(parameters, "baseValue");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const afterDiscount = decreaseByPercent(baseValue, rate1);
      const finalBill = increaseByPercent(afterDiscount, rate2);
      evidence.baseValue = baseValue;
      evidence.rate1 = rate1;
      evidence.rate2 = rate2;
      evidence.afterDiscount = afterDiscount;
      evidence.finalBill = finalBill;
      mathJax.core = `${formatNumber(afterDiscount)}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(finalBill)}`;
      return numericResult(parameters, finalBill, evidence, mathJax);
    }
    case "findCommissionAmount": {
      const baseValue = asNumber(parameters, "baseValue");
      const commissionRate = asNumber(parameters, "commissionRate");
      const commissionAmount = percentOf(baseValue, commissionRate);
      evidence.baseValue = baseValue;
      evidence.commissionRate = commissionRate;
      evidence.commissionAmount = commissionAmount;
      mathJax.core = `\\frac{${formatNumber(commissionRate)}}{100}\\times${formatNumber(baseValue)}=${formatNumber(commissionAmount)}`;
      return numericResult(parameters, commissionAmount, evidence, mathJax);
    }
    case "findPercentageErrorFromWrongAndCorrect":
    case "findPercentageErrorOnBill": {
      const wrongValue = asNumber(parameters, "wrongValue");
      const correctValue = asNumber(parameters, "correctValue");
      const absoluteError = Math.abs(wrongValue - correctValue);
      const percentageError = roundTo((absoluteError * 100) / correctValue, 4);
      evidence.wrongValue = wrongValue;
      evidence.correctValue = correctValue;
      evidence.absoluteError = absoluteError;
      evidence.percentageError = percentageError;
      mathJax.core = `${formatNumber(absoluteError)}\\times\\frac{100}{${formatNumber(correctValue)}}=${formatPercent(percentageError)}`;
      return numericResult(parameters, percentageError, evidence, mathJax);
    }
    case "findCorrectValueFromOverstatement":
    case "findActualValueFromMeasuredError": {
      const wrongValue = asNumber(parameters, "wrongValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const correctValue = roundTo((wrongValue * 100) / (100 + percentageRate), 4);
      evidence.wrongValue = wrongValue;
      evidence.percentageRate = percentageRate;
      evidence.correctValue = correctValue;
      mathJax.core = `${formatNumber(wrongValue)}\\times\\frac{100}{${formatNumber(100 + percentageRate)}}=${formatNumber(correctValue)}`;
      return numericResult(parameters, correctValue, evidence, mathJax);
    }
    case "findCorrectValueFromUnderstatement": {
      const wrongValue = asNumber(parameters, "wrongValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const correctValue = roundTo((wrongValue * 100) / (100 - percentageRate), 4);
      evidence.wrongValue = wrongValue;
      evidence.percentageRate = percentageRate;
      evidence.correctValue = correctValue;
      mathJax.core = `${formatNumber(wrongValue)}\\times\\frac{100}{${formatNumber(100 - percentageRate)}}=${formatNumber(correctValue)}`;
      return numericResult(parameters, correctValue, evidence, mathJax);
    }
    case "findRemainingAfterOneRemoval": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const remaining = decreaseByPercent(totalValue, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.remaining = remaining;
      mathJax.core = `${formatNumber(totalValue)}\\times\\frac{${formatNumber(100 - percentageRate)}}{100}=${formatNumber(remaining)}`;
      return numericResult(parameters, remaining, evidence, mathJax);
    }
    case "findRemainingAfterTwoSameRemovals": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const afterFirst = decreaseByPercent(totalValue, percentageRate);
      const remaining = decreaseByPercent(afterFirst, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.afterFirst = afterFirst;
      evidence.remaining = remaining;
      mathJax.core = `${formatNumber(afterFirst)}\\times\\frac{${formatNumber(100 - percentageRate)}}{100}=${formatNumber(remaining)}`;
      return numericResult(parameters, remaining, evidence, mathJax);
    }
    case "findRemainingAfterThreeSameRemovals": {
      const totalValue = asNumber(parameters, "totalValue");
      const percentageRate = asNumber(parameters, "percentageRate");
      const afterFirst = decreaseByPercent(totalValue, percentageRate);
      const afterSecond = decreaseByPercent(afterFirst, percentageRate);
      const remaining = decreaseByPercent(afterSecond, percentageRate);
      evidence.totalValue = totalValue;
      evidence.percentageRate = percentageRate;
      evidence.afterFirst = afterFirst;
      evidence.afterSecond = afterSecond;
      evidence.remaining = remaining;
      mathJax.core = `${formatNumber(afterSecond)}\\times\\frac{${formatNumber(100 - percentageRate)}}{100}=${formatNumber(remaining)}`;
      return numericResult(parameters, remaining, evidence, mathJax);
    }
    case "findRemainingAfterTwoDifferentRemovals": {
      const totalValue = asNumber(parameters, "totalValue");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const afterFirst = decreaseByPercent(totalValue, rate1);
      const remaining = decreaseByPercent(afterFirst, rate2);
      evidence.totalValue = totalValue;
      evidence.rate1 = rate1;
      evidence.rate2 = rate2;
      evidence.afterFirst = afterFirst;
      evidence.remaining = remaining;
      mathJax.core = `${formatNumber(afterFirst)}\\times\\frac{${formatNumber(100 - rate2)}}{100}=${formatNumber(remaining)}`;
      return numericResult(parameters, remaining, evidence, mathJax);
    }
    case "findTotalRemovedAfterTwoDifferentRemovals": {
      const totalValue = asNumber(parameters, "totalValue");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const afterFirst = decreaseByPercent(totalValue, rate1);
      const remaining = decreaseByPercent(afterFirst, rate2);
      const removed = roundTo(totalValue - remaining, 4);
      evidence.totalValue = totalValue;
      evidence.rate1 = rate1;
      evidence.rate2 = rate2;
      evidence.afterFirst = afterFirst;
      evidence.remaining = remaining;
      evidence.removed = removed;
      mathJax.core = `${formatNumber(totalValue)}-${formatNumber(remaining)}=${formatNumber(removed)}`;
      return numericResult(parameters, removed, evidence, mathJax);
    }
    case "findCaseletSavings": {
      const income = asNumber(parameters, "baseValue");
      const spendRate = asNumber(parameters, "percentageRate");
      const savings = percentOf(income, 100 - spendRate);
      evidence.income = income;
      evidence.spendRate = spendRate;
      evidence.savings = savings;
      mathJax.core = `\\frac{${formatNumber(100 - spendRate)}}{100}\\times${formatNumber(income)}=${formatNumber(savings)}`;
      return numericResult(parameters, savings, evidence, mathJax);
    }
    case "findCaseletCandidateVotes": {
      const totalVoters = asNumber(parameters, "totalVoters");
      const turnoutRate = asNumber(parameters, "turnoutRate");
      const invalidRate = asNumber(parameters, "invalidRate");
      const candidateRate = asNumber(parameters, "candidateRate");
      const votesPolled = percentOf(totalVoters, turnoutRate);
      const validVotes = roundTo(votesPolled - percentOf(votesPolled, invalidRate), 4);
      const candidateVotes = percentOf(validVotes, candidateRate);
      evidence.votesPolled = votesPolled;
      evidence.validVotes = validVotes;
      evidence.candidateVotes = candidateVotes;
      mathJax.core = `\\frac{${formatNumber(candidateRate)}}{100}\\times${formatNumber(validVotes)}=${formatNumber(candidateVotes)}`;
      return numericResult(parameters, candidateVotes, evidence, mathJax);
    }
    case "findCaseletFinalBill": {
      const baseValue = asNumber(parameters, "baseValue");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const afterDiscount = decreaseByPercent(baseValue, rate1);
      const finalBill = increaseByPercent(afterDiscount, rate2);
      evidence.afterDiscount = afterDiscount;
      evidence.finalBill = finalBill;
      mathJax.core = `${formatNumber(afterDiscount)}\\times\\frac{${formatNumber(100 + rate2)}}{100}=${formatNumber(finalBill)}`;
      return numericResult(parameters, finalBill, evidence, mathJax);
    }
    case "findCaseletRemainingGoodUnits": {
      const totalValue = asNumber(parameters, "totalValue");
      const defectiveRate = asNumber(parameters, "percentageRate");
      const soldRate = asNumber(parameters, "rate1");
      const goodUnits = decreaseByPercent(totalValue, defectiveRate);
      const remainingGoodUnits = decreaseByPercent(goodUnits, soldRate);
      evidence.totalValue = totalValue;
      evidence.defectiveRate = defectiveRate;
      evidence.goodUnits = goodUnits;
      evidence.soldRate = soldRate;
      evidence.remainingGoodUnits = remainingGoodUnits;
      mathJax.core = `${formatNumber(goodUnits)}\\times\\frac{${formatNumber(100 - soldRate)}}{100}=${formatNumber(remainingGoodUnits)}`;
      return numericResult(parameters, remainingGoodUnits, evidence, mathJax);
    }
    case "findCaseletComparison": {
      const subjectA = asString(parameters, "subjectA", "First");
      const subjectB = asString(parameters, "subjectB", "Second");
      const baseValue1 = asNumber(parameters, "baseValue1");
      const baseValue2 = asNumber(parameters, "baseValue2");
      const rate1 = asNumber(parameters, "rate1");
      const rate2 = asNumber(parameters, "rate2");
      const actual1 = percentOf(baseValue1, rate1);
      const actual2 = percentOf(baseValue2, rate2);
      const difference = roundTo(Math.abs(actual1 - actual2), 4);
      const direction = actual1 === actual2 ? "equal" : actual1 > actual2 ? "greater" : "less";
      const magnitude = prefixedValue(difference, asString(parameters, "valuePrefix"), asString(parameters, "unitLabel"));
      evidence.subjectA = subjectA;
      evidence.subjectB = subjectB;
      evidence.actual1 = actual1;
      evidence.actual2 = actual2;
      evidence.difference = difference;
      evidence.direction = direction;
      mathJax.core = `${formatNumber(actual1)},\\;${formatNumber(actual2)}`;
      return {
        answer: comparisonAnswer(direction, subjectA, subjectB, magnitude, parameters.language),
        numericAnswer: difference,
        answerType: parameters.answerType,
        evidence,
        mathJax,
      };
    }
  }
}
