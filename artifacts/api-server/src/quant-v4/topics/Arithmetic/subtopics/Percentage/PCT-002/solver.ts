import {
  chainedDropCount,
  divisorErrorPercent,
  electionTotalVoters,
  formatAnswer,
  fractionalErrorPercent,
  inclusionExclusionOverlap,
  mathJaxLine,
  multiplierErrorPercent,
  multiTierPiecewiseAmount,
  piecewiseAmount,
  repeatedReplacementAmount,
  repeatedReplacementPercent,
  reversePiecewiseSales,
  roundTo,
  shiftedBaseChainCount,
  tripleInclusionExclusionUnion,
  variableReplacementPercent,
  weightedCount,
  weightedPercentage,
} from "./math";
import type { Pct002Parameters, Pct002SolverResult } from "./types";

function value(parameters: Pct002Parameters, name: string) {
  return Number(parameters.variables[name]);
}

export function solvePct002(parameters: Pct002Parameters): Pct002SolverResult {
  const t = parameters.taskKind;
  let numericAnswer = 0;
  let evidence: Record<string, number | string> = { taskKind: t, answerType: parameters.answerType };
  let mathJax: Record<string, string> = {};

  if (t === "inclusionExclusion") {
    const overlap = inclusionExclusionOverlap(value(parameters, "groupAPercentage"), value(parameters, "groupBPercentage"), value(parameters, "neitherPercentage"));
    numericAnswer = overlap;
    evidence = { ...evidence, overlap, totalWithNeither: value(parameters, "groupAPercentage") + value(parameters, "groupBPercentage") + value(parameters, "neitherPercentage") };
    mathJax = {
      setupLatex: mathJaxLine("setup", "A + B + Neither - 100"),
      calculationLatex: mathJaxLine("calculation", `${value(parameters, "groupAPercentage")} + ${value(parameters, "groupBPercentage")} + ${value(parameters, "neitherPercentage")} - 100 = ${overlap}`),
    };
  } else if (t === "tripleInclusionExclusion") {
    const union = tripleInclusionExclusionUnion(
      value(parameters, "groupAPercentage"),
      value(parameters, "groupBPercentage"),
      value(parameters, "groupCPercentage"),
      value(parameters, "groupABPercentage"),
      value(parameters, "groupBCPercentage"),
      value(parameters, "groupACPercentage"),
      value(parameters, "groupABCPercentage"),
    );
    const asksNone = parameters.questionLanguageId === "PCT-QL-048";
    numericAnswer = asksNone ? 100 - union : union;
    evidence = { ...evidence, union, none: 100 - union };
    mathJax = {
      setupLatex: mathJaxLine("setup", "A+B+C - (AB+BC+AC) + ABC"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(numericAnswer, 4)}`),
    };
  } else if (t === "multiTierPiecewiseRate") {
    const totalResult = multiTierPiecewiseAmount(
      value(parameters, "totalBase"),
      value(parameters, "tier1Limit"),
      value(parameters, "tier2Limit"),
      value(parameters, "tier1Rate"),
      value(parameters, "tier2Rate"),
      value(parameters, "tier3Rate"),
    );
    numericAnswer = totalResult;
    evidence = { ...evidence, totalResult };
    mathJax = {
      setupLatex: mathJaxLine("setup", "\\text{Slab-wise summation}"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(totalResult, 4)}`),
    };
  } else if (t === "reversePiecewiseRate") {
    const totalSales = reversePiecewiseSales(
      value(parameters, "totalResult"),
      value(parameters, "tier1Limit"),
      value(parameters, "tier1Rate"),
      value(parameters, "tier2Rate"),
    );
    numericAnswer = totalSales;
    evidence = { ...evidence, totalSales };
    mathJax = {
      setupLatex: mathJaxLine("setup", "L + \\frac{C - L \\times r_1}{r_2}"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(totalSales, 4)}`),
    };
  } else if (t === "variableReplacement") {
    const remainingPercent = variableReplacementPercent([
      value(parameters, "replacementRate1"),
      value(parameters, "replacementRate2"),
      value(parameters, "replacementRate3"),
    ]);
    numericAnswer = remainingPercent;
    evidence = { ...evidence, remainingPercent };
    mathJax = {
      setupLatex: mathJaxLine("setup", "100 \\times \\prod(1 - r_i)"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(remainingPercent, 4)}`),
    };
  } else if (t === "fractionalError") {
    const percentError = fractionalErrorPercent(
      value(parameters, "correctNumerator"),
      value(parameters, "correctDenominator"),
      value(parameters, "wrongNumerator"),
      value(parameters, "wrongDenominator"),
    );
    numericAnswer = percentError;
    evidence = { ...evidence, percentError };
    mathJax = {
      setupLatex: mathJaxLine("setup", "\\left|\\frac{\\text{wrong} - \\text{correct}}{\\text{correct}}\\right| \\times 100"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(percentError, 4)}`),
    };
  } else if (t === "wrongMultiplier") {
    const percentError = multiplierErrorPercent(value(parameters, "correctMultiplier"), value(parameters, "wrongMultiplier"));
    numericAnswer = percentError;
    evidence = { ...evidence, percentError };
    mathJax = {
      setupLatex: mathJaxLine("setup", "\\left|\\frac{\\text{wrong} - \\text{correct}}{\\text{correct}}\\right| \\times 100"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(percentError, 4)}`),
    };
  } else if (t === "wrongDivisor") {
    const percentError = divisorErrorPercent(value(parameters, "correctDivisor"), value(parameters, "wrongDivisor"));
    numericAnswer = percentError;
    evidence = { ...evidence, percentError };
    mathJax = {
      setupLatex: mathJaxLine("setup", "\\left|\\frac{\\text{correct}}{\\text{wrong}} - 1\\right| \\times 100"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(percentError, 4)}`),
    };
  } else if (t === "tieredCommission") {
    const commission = piecewiseAmount(
      value(parameters, "salesAmount"),
      value(parameters, "thresholdAmount"),
      value(parameters, "baseCommissionRate"),
      value(parameters, "bonusCommissionRate"),
    );
    numericAnswer = commission;
    evidence = { ...evidence, commission };
    mathJax = {
      setupLatex: mathJaxLine("setup", "threshold \\times base\\% + excess \\times bonus\\%"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(commission, 4)}`),
    };
  } else if (t === "tieredTax") {
    const taxableIncome = Math.max(0, value(parameters, "grossIncome") - value(parameters, "exemptionAmount"));
    const tax = taxableIncome * value(parameters, "taxPercentage") / 100;
    numericAnswer = tax;
    evidence = { ...evidence, taxableIncome, tax };
    mathJax = {
      setupLatex: mathJaxLine("setup", "(income - exemption) \\times tax\\%"),
      calculationLatex: mathJaxLine("calculation", `${taxableIncome} \\times ${value(parameters, "taxPercentage")}\\% = ${roundTo(tax, 4)}`),
    };
  } else if (t === "piecewiseRate") {
    const charge = piecewiseAmount(
      value(parameters, "usageAmount"),
      value(parameters, "thresholdAmount"),
      value(parameters, "baseChargeRate"),
      value(parameters, "extraChargeRate"),
    );
    numericAnswer = charge;
    evidence = { ...evidence, charge };
    mathJax = {
      setupLatex: mathJaxLine("setup", "threshold \\times base\\% + excess \\times extra\\%"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(charge, 4)}`),
    };
  } else if (t === "weightedSubgroup") {
    const totalPercentage = weightedPercentage(
      value(parameters, "malePercentage"),
      value(parameters, "maleTraitPercentage"),
      value(parameters, "femaleTraitPercentage"),
    );
    numericAnswer = totalPercentage;
    evidence = { ...evidence, totalPercentage };
    mathJax = {
      setupLatex: mathJaxLine("setup", "male\\% \\times maleTrait\\% + female\\% \\times femaleTrait\\%"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(totalPercentage, 4)}`),
    };
  } else if (t === "hierarchicalPopulation") {
    const employedCount = weightedCount(
      value(parameters, "totalPopulation"),
      value(parameters, "malePercentage"),
      value(parameters, "maleTraitPercentage"),
      value(parameters, "femaleTraitPercentage"),
    );
    numericAnswer = employedCount;
    evidence = { ...evidence, employedCount };
    mathJax = {
      setupLatex: mathJaxLine("setup", "total \\times weighted\\%"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(employedCount, 4)}`),
    };
  } else if (t === "branchAggregation") {
    const totalPercentage = weightedPercentage(
      value(parameters, "groupAPercentage"),
      value(parameters, "groupATraitPercentage"),
      value(parameters, "groupBTraitPercentage"),
    );
    numericAnswer = totalPercentage;
    evidence = { ...evidence, totalPercentage };
    mathJax = {
      setupLatex: mathJaxLine("setup", "A\\% \\times Atrait\\% + B\\% \\times Btrait\\%"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(totalPercentage, 4)}`),
    };
  } else if (t === "repeatedReplacement") {
    const remainingPercent = repeatedReplacementPercent(
      value(parameters, "initialVolume"),
      value(parameters, "replacementVolume"),
      value(parameters, "numberOfOperations"),
    );
    numericAnswer = remainingPercent;
    evidence = { ...evidence, remainingPercent };
    mathJax = {
      setupLatex: mathJaxLine("setup", "\\left(1 - \\frac{replacement}{initial}\\right)^n \\times 100"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(remainingPercent, 4)}`),
    };
  } else if (t === "iterativeDilution") {
    const remainingAmount = repeatedReplacementAmount(
      value(parameters, "initialVolume"),
      value(parameters, "replacementVolume"),
      value(parameters, "numberOfOperations"),
    );
    numericAnswer = remainingAmount;
    evidence = { ...evidence, remainingAmount };
    mathJax = {
      setupLatex: mathJaxLine("setup", "initial \\times \\left(1 - \\frac{replacement}{initial}\\right)^n"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(remainingAmount, 4)}`),
    };
  } else if (t === "electionMargin") {
    const totalVoters = electionTotalVoters(
      value(parameters, "polledPercentage"),
      value(parameters, "invalidPercentage"),
      value(parameters, "winnerPercentage"),
      value(parameters, "voteMargin"),
    );
    numericAnswer = totalVoters;
    evidence = { ...evidence, totalVoters };
    mathJax = {
      setupLatex: mathJaxLine("setup", "polled \\times valid \\times winner-gap \\times total = margin"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(totalVoters, 4)}`),
    };
  } else if (t === "multiStageAttrition") {
    const finalCount = chainedDropCount(
      value(parameters, "initialCount"),
      [value(parameters, "firstDropPercentage"), value(parameters, "secondDropPercentage"), value(parameters, "thirdDropPercentage")],
    );
    numericAnswer = finalCount;
    evidence = { ...evidence, finalCount };
    mathJax = {
      setupLatex: mathJaxLine("setup", "initial \\times (1-a) \\times (1-b) \\times (1-c)"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(finalCount, 4)}`),
    };
  } else if (t === "shiftedBaseChain") {
    const finalCount = shiftedBaseChainCount(
      value(parameters, "initialCount"),
      [value(parameters, "firstPassPercentage"), value(parameters, "secondPassPercentage"), value(parameters, "thirdPassPercentage")],
    );
    numericAnswer = finalCount;
    evidence = { ...evidence, finalCount };
    mathJax = {
      setupLatex: mathJaxLine("setup", "initial \\times a \\times b \\times c"),
      calculationLatex: mathJaxLine("calculation", `${roundTo(finalCount, 4)}`),
    };
  }

  const roundedAnswer = parameters.answerType === "COUNT" ? Math.round(numericAnswer) : roundTo(numericAnswer, 4);
  const answer = formatAnswer(parameters.answerType, roundedAnswer);
  const derivedEvidence = {
    ...parameters.variables,
    coveredPercentage: roundTo(100 - value(parameters, "neitherPercentage"), 4),
    singleTotal: roundTo(value(parameters, "groupAPercentage") + value(parameters, "groupBPercentage") + value(parameters, "groupCPercentage"), 4),
    pairOverlapTotal: roundTo(value(parameters, "groupABPercentage") + value(parameters, "groupBCPercentage") + value(parameters, "groupACPercentage"), 4),
    femalePercentage: roundTo(100 - value(parameters, "malePercentage"), 4),
    groupBPercentage: roundTo(100 - value(parameters, "groupAPercentage"), 4),
    remainingFraction: roundTo(1 - value(parameters, "replacementVolume") / value(parameters, "initialVolume"), 4),
    factor1: roundTo(1 - value(parameters, "replacementRate1") / 100, 4),
    factor2: roundTo(1 - value(parameters, "replacementRate2") / 100, 4),
    factor3: roundTo(1 - value(parameters, "replacementRate3") / 100, 4),
  };
  return {
    answer,
    numericAnswer: roundedAnswer,
    answerType: parameters.answerType,
    evidence: { ...derivedEvidence, ...evidence, answer },
    mathJax,
  };
}
