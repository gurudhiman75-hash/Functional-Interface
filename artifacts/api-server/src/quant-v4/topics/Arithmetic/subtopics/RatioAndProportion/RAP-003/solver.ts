import { formatNumber, ratioLatex, simplifyRatio } from "./math";
import type { Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string) {
  return String(parameters.variables[key]);
}

function numericResult(value: number, answerType: "AGE" | "TIME" | "PROFIT" | "PERCENT" | "QUANTITY" | "COUNT", workingValues: Record<string, string | number>, calculationLatex: string): Rap003SolverResult {
  const answerValue = formatNumber(value);
  return {
    answer: `$$${answerValue}$$`,
    answerValue,
    answerType,
    workingValues,
    evidence: workingValues,
    mathJax: {
      setupLatex: String(workingValues.setup ?? ""),
      calculationLatex,
    },
  };
}

function ratioResult(values: readonly number[], workingValues: Record<string, string | number>, calculationLatex: string): Rap003SolverResult {
  const ratio = simplifyRatio(values);
  const answerValue = ratio.join(":");
  return {
    answer: `$$${ratioLatex(ratio)}$$`,
    answerValue,
    answerType: "RATIO",
    workingValues,
    evidence: workingValues,
    mathJax: {
      setupLatex: String(workingValues.setup ?? ""),
      calculationLatex,
    },
  };
}

function targetAge(parameters: Rap003Parameters, unit: number) {
  return s(parameters, "targetPerson") === s(parameters, "personB")
    ? n(parameters, "ratioB") * unit
    : n(parameters, "ratioA") * unit;
}

function targetProfit(parameters: Rap003Parameters, productA: number, productB: number) {
  const total = n(parameters, "totalProfit");
  return s(parameters, "targetPartner") === s(parameters, "personB")
    ? total * productB / (productA + productB)
    : total * productA / (productA + productB);
}

function targetByPerson(parameters: Rap003Parameters, valueA: number, valueB: number) {
  return s(parameters, "targetPerson") === s(parameters, "personB") ? valueB : valueA;
}

function replacementRetention(parameters: Rap003Parameters) {
  return (n(parameters, "initialVolume") - n(parameters, "removedVolume")) / n(parameters, "initialVolume");
}

function replacementOriginalRemaining(parameters: Rap003Parameters) {
  return n(parameters, "initialVolume") * Math.pow(replacementRetention(parameters), n(parameters, "replacementCount"));
}

export function solveRap003(parameters: Rap003Parameters): Rap003SolverResult {
  switch (parameters.taskKind) {
    case "partnershipProfitShare":
    case "partnershipJoiningPartnerProfit": {
      const productA = n(parameters, "investmentA") * n(parameters, "timeA");
      const productB = n(parameters, "investmentB") * n(parameters, "timeB");
      const result = targetProfit(parameters, productA, productB);
      return numericResult(
        result,
        "PROFIT",
        {
          setup: `${s(parameters, "personA")}:${s(parameters, "personB")}`,
          productA: formatNumber(productA),
          productB: formatNumber(productB),
          profitRatio: `${formatNumber(productA)}:${formatNumber(productB)}`,
          targetPartner: s(parameters, "targetPartner"),
          result: formatNumber(result),
        },
        `${formatNumber(productA)}:${formatNumber(productB)}`,
      );
    }
    case "partnershipMidPeriodChange": {
      const productA = n(parameters, "initialInvestmentA") * n(parameters, "firstPeriod")
        + n(parameters, "changedInvestmentA") * n(parameters, "secondPeriod");
      const productB = n(parameters, "investmentB") * n(parameters, "timeB");
      const result = targetProfit(parameters, productA, productB);
      return numericResult(
        result,
        "PROFIT",
        {
          setup: `${s(parameters, "personA")}:${s(parameters, "personB")}`,
          productA: formatNumber(productA),
          productB: formatNumber(productB),
          profitRatio: `${formatNumber(productA)}:${formatNumber(productB)}`,
          targetPartner: s(parameters, "targetPartner"),
          result: formatNumber(result),
        },
        `(${n(parameters, "initialInvestmentA")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentA")}\\times${n(parameters, "secondPeriod")}):(${n(parameters, "investmentB")}\\times${n(parameters, "timeB")})`,
      );
    }
    case "incomeExpenditureSavingsRatio": {
      const incomeA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
      const incomeB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
      const expenditureA = n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit");
      const expenditureB = n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit");
      const savingsA = incomeA - expenditureA;
      const savingsB = incomeB - expenditureB;
      return ratioResult(
        [savingsA, savingsB],
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          expenditureA: formatNumber(expenditureA),
          expenditureB: formatNumber(expenditureB),
          savingsA: formatNumber(savingsA),
          savingsB: formatNumber(savingsB),
          result: simplifyRatio([savingsA, savingsB]).join(":"),
        },
        `(${formatNumber(incomeA)}-${formatNumber(expenditureA)}):(${formatNumber(incomeB)}-${formatNumber(expenditureB)})`,
      );
    }
    case "incomeExpenditureEqualSavings": {
      const incomeScale = n(parameters, "givenIncomeA") / n(parameters, "incomeRatioA");
      const expenditureScale = ((n(parameters, "incomeRatioB") - n(parameters, "incomeRatioA")) * incomeScale)
        / (n(parameters, "expenditureRatioB") - n(parameters, "expenditureRatioA"));
      const savingsA = n(parameters, "incomeRatioA") * incomeScale - n(parameters, "expenditureRatioA") * expenditureScale;
      const savingsB = n(parameters, "incomeRatioB") * incomeScale - n(parameters, "expenditureRatioB") * expenditureScale;
      const result = targetByPerson(parameters, savingsA, savingsB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `Equal savings, I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeScale: formatNumber(incomeScale),
          expenditureScale: formatNumber(expenditureScale),
          savingsA: formatNumber(savingsA),
          savingsB: formatNumber(savingsB),
          result: formatNumber(result),
        },
        `${n(parameters, "incomeRatioA")}x-${n(parameters, "expenditureRatioA")}y=${n(parameters, "incomeRatioB")}x-${n(parameters, "expenditureRatioB")}y`,
      );
    }
    case "incomeFromSavingsRatio": {
      const expenditureScale = n(parameters, "givenExpenditureB") / n(parameters, "expenditureRatioB");
      const incomeScale = ((n(parameters, "savingsRatioB") * n(parameters, "expenditureRatioA") - n(parameters, "savingsRatioA") * n(parameters, "expenditureRatioB")) * expenditureScale)
        / (n(parameters, "savingsRatioB") * n(parameters, "incomeRatioA") - n(parameters, "savingsRatioA") * n(parameters, "incomeRatioB"));
      const incomeA = n(parameters, "incomeRatioA") * incomeScale;
      const incomeB = n(parameters, "incomeRatioB") * incomeScale;
      const result = targetByPerson(parameters, incomeA, incomeB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `S=${n(parameters, "savingsRatioA")}:${n(parameters, "savingsRatioB")}`,
          incomeScale: formatNumber(incomeScale),
          expenditureScale: formatNumber(expenditureScale),
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "incomeRatioA")}x-${n(parameters, "expenditureRatioA")}y}{${n(parameters, "incomeRatioB")}x-${n(parameters, "expenditureRatioB")}y}=\\frac{${n(parameters, "savingsRatioA")}}{${n(parameters, "savingsRatioB")}}`,
      );
    }
    case "expenditureFromSavingsRatio": {
      const incomeScale = n(parameters, "givenIncomeA") / n(parameters, "incomeRatioA");
      const expenditureScale = ((n(parameters, "savingsRatioB") * n(parameters, "incomeRatioA") - n(parameters, "savingsRatioA") * n(parameters, "incomeRatioB")) * incomeScale)
        / (n(parameters, "savingsRatioB") * n(parameters, "expenditureRatioA") - n(parameters, "savingsRatioA") * n(parameters, "expenditureRatioB"));
      const expenditureA = n(parameters, "expenditureRatioA") * expenditureScale;
      const expenditureB = n(parameters, "expenditureRatioB") * expenditureScale;
      const result = targetByPerson(parameters, expenditureA, expenditureB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `S=${n(parameters, "savingsRatioA")}:${n(parameters, "savingsRatioB")}`,
          incomeScale: formatNumber(incomeScale),
          expenditureScale: formatNumber(expenditureScale),
          expenditureA: formatNumber(expenditureA),
          expenditureB: formatNumber(expenditureB),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "incomeRatioA")}x-${n(parameters, "expenditureRatioA")}y}{${n(parameters, "incomeRatioB")}x-${n(parameters, "expenditureRatioB")}y}=\\frac{${n(parameters, "savingsRatioA")}}{${n(parameters, "savingsRatioB")}}`,
      );
    }
    case "alloyMixingRatioFromTarget": {
      const highDifference = Math.abs(n(parameters, "targetPercent") - n(parameters, "percentB"));
      const lowDifference = Math.abs(n(parameters, "percentA") - n(parameters, "targetPercent"));
      return ratioResult(
        [highDifference, lowDifference],
        {
          setup: `${n(parameters, "percentA")}%, ${n(parameters, "percentB")}% -> ${n(parameters, "targetPercent")}%`,
          differenceA: highDifference,
          differenceB: lowDifference,
          result: simplifyRatio([highDifference, lowDifference]).join(":"),
        },
        `${n(parameters, "targetPercent")}-${n(parameters, "percentB")}:${n(parameters, "percentA")}-${n(parameters, "targetPercent")}`,
      );
    }
    case "alloyTargetComponentFromMix": {
      const componentAmount = n(parameters, "quantityA") * n(parameters, "percentA") / 100
        + n(parameters, "quantityB") * n(parameters, "percentB") / 100;
      const totalQuantity = n(parameters, "quantityA") + n(parameters, "quantityB");
      const result = componentAmount * 100 / totalQuantity;
      return numericResult(
        result,
        "PERCENT",
        {
          setup: `${n(parameters, "quantityA")}@${n(parameters, "percentA")}%, ${n(parameters, "quantityB")}@${n(parameters, "percentB")}%`,
          componentAmount: formatNumber(componentAmount),
          totalQuantity: formatNumber(totalQuantity),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "quantityA")}\\times${n(parameters, "percentA")}+${n(parameters, "quantityB")}\\times${n(parameters, "percentB")}}{${totalQuantity}}`,
      );
    }
    case "alloyThreeSourceEqualMix": {
      const fractionA = n(parameters, "ratioAComponent") / (n(parameters, "ratioAComponent") + n(parameters, "ratioAOther"));
      const fractionB = n(parameters, "ratioBComponent") / (n(parameters, "ratioBComponent") + n(parameters, "ratioBOther"));
      const fractionC = n(parameters, "ratioCComponent") / (n(parameters, "ratioCComponent") + n(parameters, "ratioCOther"));
      const componentFraction = (fractionA + fractionB + fractionC) / 3;
      const scale = 1000000;
      const componentUnits = Math.round(componentFraction * scale);
      const otherUnits = scale - componentUnits;
      return ratioResult(
        [componentUnits, otherUnits],
        {
          setup: `${n(parameters, "ratioAComponent")}:${n(parameters, "ratioAOther")}, ${n(parameters, "ratioBComponent")}:${n(parameters, "ratioBOther")}, ${n(parameters, "ratioCComponent")}:${n(parameters, "ratioCOther")}`,
          componentFraction: formatNumber(componentFraction),
          result: simplifyRatio([componentUnits, otherUnits]).join(":"),
        },
        `\\frac{${formatNumber(fractionA)}+${formatNumber(fractionB)}+${formatNumber(fractionC)}}{3}`,
      );
    }
    case "replacementFinalRatio": {
      const remainingA = replacementOriginalRemaining(parameters);
      const liquidB = n(parameters, "initialVolume") - remainingA;
      const scale = 1000000;
      return ratioResult(
        [Math.round(remainingA * scale), Math.round(liquidB * scale)],
        {
          setup: `${n(parameters, "initialVolume")}, remove ${n(parameters, "removedVolume")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber(replacementRetention(parameters)),
          remainingA: formatNumber(remainingA),
          replacedLiquid: formatNumber(liquidB),
        },
        `${n(parameters, "initialVolume")}\\times\\left(1-\\frac{${n(parameters, "removedVolume")}}{${n(parameters, "initialVolume")}}\\right)^{${n(parameters, "replacementCount")}}`,
      );
    }
    case "replacementFinalQuantity": {
      const remainingA = replacementOriginalRemaining(parameters);
      return numericResult(
        remainingA,
        "QUANTITY",
        {
          setup: `${n(parameters, "initialVolume")}, remove ${n(parameters, "removedVolume")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber(replacementRetention(parameters)),
          result: formatNumber(remainingA),
        },
        `${n(parameters, "initialVolume")}\\times\\left(1-\\frac{${n(parameters, "removedVolume")}}{${n(parameters, "initialVolume")}}\\right)^{${n(parameters, "replacementCount")}}=${formatNumber(remainingA)}`,
      );
    }
    case "replacementIterationsFromFinalRatio": {
      const finalFraction = n(parameters, "finalRatioA") / (n(parameters, "finalRatioA") + n(parameters, "finalRatioB"));
      const years = Math.log(finalFraction) / Math.log(replacementRetention(parameters));
      const result = Math.round(years);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`,
          retentionFactor: formatNumber(replacementRetention(parameters)),
          finalFraction: formatNumber(finalFraction),
          result,
        },
        `\\left(1-\\frac{${n(parameters, "removedVolume")}}{${n(parameters, "initialVolume")}}\\right)^n=\\frac{${n(parameters, "finalRatioA")}}{${n(parameters, "finalRatioA") + n(parameters, "finalRatioB")}}`,
      );
    }
    case "agePresentFromFutureRatio": {
      const presentA = n(parameters, "ratioA");
      const presentB = n(parameters, "ratioB");
      const futureA = n(parameters, "futureRatioA");
      const futureB = n(parameters, "futureRatioB");
      const shift = n(parameters, "shiftYears");
      const unit = shift * (futureA - futureB) / (futureB * presentA - futureA * presentB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${presentA}:${presentB} -> ${futureA}:${futureB}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(presentA * unit),
          presentAgeB: formatNumber(presentB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `\\frac{${presentA}x+${shift}}{${presentB}x+${shift}}=\\frac{${futureA}}{${futureB}}`,
      );
    }
    case "agePresentFromPastRatio": {
      const presentA = n(parameters, "ratioA");
      const presentB = n(parameters, "ratioB");
      const pastA = n(parameters, "pastRatioA");
      const pastB = n(parameters, "pastRatioB");
      const shift = n(parameters, "shiftYears");
      const unit = shift * (pastB - pastA) / (pastB * presentA - pastA * presentB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${presentA}:${presentB} <- ${pastA}:${pastB}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(presentA * unit),
          presentAgeB: formatNumber(presentB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `\\frac{${presentA}x-${shift}}{${presentB}x-${shift}}=\\frac{${pastA}}{${pastB}}`,
      );
    }
    case "ageYearsToReachRatio": {
      const presentAgeA = n(parameters, "presentAgeA");
      const presentAgeB = n(parameters, "presentAgeB");
      const futureA = n(parameters, "futureRatioA");
      const futureB = n(parameters, "futureRatioB");
      const years = (futureA * presentAgeB - futureB * presentAgeA) / (futureB - futureA);
      return numericResult(
        years,
        "TIME",
        {
          setup: `${presentAgeA}:${presentAgeB} -> ${futureA}:${futureB}`,
          presentAgeA,
          presentAgeB,
          futureRatio: ratioLatex([futureA, futureB]),
          result: formatNumber(years),
        },
        `\\frac{${presentAgeA}+y}{${presentAgeB}+y}=\\frac{${futureA}}{${futureB}}`,
      );
    }
    case "ageFromDifferenceAndRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const unit = n(parameters, "ageDifference") / Math.abs(ratioA - ratioB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${Math.abs(ratioA - ratioB)}x=${n(parameters, "ageDifference")}`,
      );
    }
    default:
      throw new Error(`RAP-003 solver missing for taskKind: ${parameters.taskKind}`);
  }
}
