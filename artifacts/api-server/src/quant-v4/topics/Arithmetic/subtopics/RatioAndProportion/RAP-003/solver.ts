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
  const answerDisplay = answerType === "PERCENT" ? `${answerValue}%` : answerValue;
  return {
    answer: `$$${answerDisplay}$$`,
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

function denominationWeightedUnitValue(parameters: Rap003Parameters) {
  const fourthValue = parameters.variables.denominationD === undefined ? 0 : n(parameters, "ratioD") * n(parameters, "denominationD");
  return n(parameters, "ratioA") * n(parameters, "denominationA")
    + n(parameters, "ratioB") * n(parameters, "denominationB")
    + n(parameters, "ratioC") * n(parameters, "denominationC")
    + fourthValue;
}

function denominationRatioFor(parameters: Rap003Parameters, denomination: number) {
  if (denomination === n(parameters, "denominationA")) return n(parameters, "ratioA");
  if (denomination === n(parameters, "denominationB")) return n(parameters, "ratioB");
  if (denomination === n(parameters, "denominationC")) return n(parameters, "ratioC");
  if (parameters.variables.denominationD !== undefined && denomination === n(parameters, "denominationD")) return n(parameters, "ratioD");
  throw new Error(`Unknown denomination target: ${denomination}`);
}

function denominationSetup(parameters: Rap003Parameters) {
  const ratios = [n(parameters, "ratioA"), n(parameters, "ratioB"), n(parameters, "ratioC")];
  const denominations = [n(parameters, "denominationA"), n(parameters, "denominationB"), n(parameters, "denominationC")];
  if (parameters.variables.denominationD !== undefined) {
    ratios.push(n(parameters, "ratioD"));
    denominations.push(n(parameters, "denominationD"));
  }
  return `${ratios.join(":")} at ${denominations.join(",")}`;
}

function denominationCalculationDenominator(parameters: Rap003Parameters) {
  const parts = [
    `${n(parameters, "ratioA")}\\times${n(parameters, "denominationA")}`,
    `${n(parameters, "ratioB")}\\times${n(parameters, "denominationB")}`,
    `${n(parameters, "ratioC")}\\times${n(parameters, "denominationC")}`,
  ];
  if (parameters.variables.denominationD !== undefined) parts.push(`${n(parameters, "ratioD")}\\times${n(parameters, "denominationD")}`);
  return parts.join("+");
}

function populationCells(parameters: Rap003Parameters) {
  const maleTotal = n(parameters, "totalPopulation") * n(parameters, "maleRatio") / (n(parameters, "maleRatio") + n(parameters, "femaleRatio"));
  const femaleTotal = n(parameters, "totalPopulation") - maleTotal;
  const literateMales = maleTotal * n(parameters, "maleLiterateRatio") / (n(parameters, "maleLiterateRatio") + n(parameters, "maleIlliterateRatio"));
  const illiterateMales = maleTotal - literateMales;
  const literateFemales = femaleTotal * n(parameters, "femaleLiterateRatio") / (n(parameters, "femaleLiterateRatio") + n(parameters, "femaleIlliterateRatio"));
  const illiterateFemales = femaleTotal - literateFemales;
  return { maleTotal, femaleTotal, literateMales, illiterateMales, literateFemales, illiterateFemales };
}

function populationCellValue(parameters: Rap003Parameters, cell: string) {
  const cells = populationCells(parameters);
  const normalized = cell.toLowerCase();
  if (normalized === "literate males" || normalized === "male literate") return cells.literateMales;
  if (normalized === "illiterate males" || normalized === "male illiterate") return cells.illiterateMales;
  if (normalized === "literate females" || normalized === "female literate") return cells.literateFemales;
  if (normalized === "illiterate females" || normalized === "female illiterate") return cells.illiterateFemales;
  throw new Error(`Unknown population cell: ${cell}`);
}

function targetPopulationCell(parameters: Rap003Parameters) {
  return populationCellValue(parameters, `${s(parameters, "targetLiteracy")} ${s(parameters, "targetGroup")}s`);
}

function electionPolledVotes(parameters: Rap003Parameters) {
  return n(parameters, "totalVoters") * n(parameters, "turnoutPercent") / 100;
}

function electionValidVotes(parameters: Rap003Parameters) {
  return electionPolledVotes(parameters) * n(parameters, "validPercent") / 100;
}

function electionWinnerRatio(parameters: Rap003Parameters) {
  return Math.max(n(parameters, "candidateRatioA"), n(parameters, "candidateRatioB"));
}

function electionLoserRatio(parameters: Rap003Parameters) {
  return Math.min(n(parameters, "candidateRatioA"), n(parameters, "candidateRatioB"));
}

function electionRatioSum(parameters: Rap003Parameters) {
  return n(parameters, "candidateRatioA") + n(parameters, "candidateRatioB");
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
    case "denominationTotalValue": {
      const weightedUnitValue = denominationWeightedUnitValue(parameters);
      const totalValue = n(parameters, "commonUnit") * weightedUnitValue;
      return numericResult(
        totalValue,
        "QUANTITY",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(weightedUnitValue),
          commonUnit: n(parameters, "commonUnit"),
          result: formatNumber(totalValue),
        },
        `${n(parameters, "commonUnit")}\\times(${denominationCalculationDenominator(parameters)})`,
      );
    }
    case "denominationCountsFromValue": {
      const weightedUnitValue = denominationWeightedUnitValue(parameters);
      const commonUnit = n(parameters, "totalValue") / weightedUnitValue;
      const targetRatio = denominationRatioFor(parameters, n(parameters, "targetDenomination"));
      const result = targetRatio * commonUnit;
      return numericResult(
        result,
        "COUNT",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(weightedUnitValue),
          commonUnit: formatNumber(commonUnit),
          targetDenomination: n(parameters, "targetDenomination"),
          targetRatio,
          result: formatNumber(result),
        },
        `x=\\frac{${n(parameters, "totalValue")}}{${denominationCalculationDenominator(parameters)}}`,
      );
    }
    case "denominationTargetCount": {
      const targetRatio = denominationRatioFor(parameters, n(parameters, "targetDenomination"));
      const result = targetRatio * n(parameters, "commonUnit");
      return numericResult(
        result,
        "COUNT",
        {
          setup: denominationSetup(parameters),
          commonUnit: n(parameters, "commonUnit"),
          targetDenomination: n(parameters, "targetDenomination"),
          targetRatio,
          result: formatNumber(result),
        },
        `${targetRatio}\\times${n(parameters, "commonUnit")}`,
      );
    }
    case "denominationSwapValue": {
      const weightedUnitValue = denominationWeightedUnitValue(parameters);
      const originalValue = n(parameters, "commonUnit") * weightedUnitValue;
      const delta = n(parameters, "swapCount") * (n(parameters, "toDenomination") - n(parameters, "fromDenomination"));
      const result = originalValue + delta;
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(weightedUnitValue),
          originalValue: formatNumber(originalValue),
          swapDelta: formatNumber(delta),
          result: formatNumber(result),
        },
        `${originalValue}+${n(parameters, "swapCount")}\\times(${n(parameters, "toDenomination")}-${n(parameters, "fromDenomination")})`,
      );
    }
    case "sdtTimeRatioFromSpeedDistance": {
      const timeA = n(parameters, "distanceRatioA") * n(parameters, "speedRatioB");
      const timeB = n(parameters, "distanceRatioB") * n(parameters, "speedRatioA");
      return ratioResult(
        [timeA, timeB],
        {
          setup: `S=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}, D=${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")}`,
          timeA,
          timeB,
          result: simplifyRatio([timeA, timeB]).join(":"),
        },
        `\\frac{${n(parameters, "distanceRatioA")}}{${n(parameters, "speedRatioA")}}:\\frac{${n(parameters, "distanceRatioB")}}{${n(parameters, "speedRatioB")}}`,
      );
    }
    case "sdtDistanceRatioFromSpeedTime": {
      const distanceA = n(parameters, "speedRatioA") * n(parameters, "timeRatioA");
      const distanceB = n(parameters, "speedRatioB") * n(parameters, "timeRatioB");
      return ratioResult(
        [distanceA, distanceB],
        {
          setup: `S=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}, T=${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`,
          distanceA,
          distanceB,
          result: simplifyRatio([distanceA, distanceB]).join(":"),
        },
        `(${n(parameters, "speedRatioA")}\\times${n(parameters, "timeRatioA")}):(${n(parameters, "speedRatioB")}\\times${n(parameters, "timeRatioB")})`,
      );
    }
    case "sdtSpeedRatioFromDistanceTime": {
      const speedA = n(parameters, "distanceRatioA") * n(parameters, "timeRatioB");
      const speedB = n(parameters, "distanceRatioB") * n(parameters, "timeRatioA");
      return ratioResult(
        [speedA, speedB],
        {
          setup: `D=${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")}, T=${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`,
          speedA,
          speedB,
          result: simplifyRatio([speedA, speedB]).join(":"),
        },
        `\\frac{${n(parameters, "distanceRatioA")}}{${n(parameters, "timeRatioA")}}:\\frac{${n(parameters, "distanceRatioB")}}{${n(parameters, "timeRatioB")}}`,
      );
    }
    case "sdtRaceLead": {
      const lead = n(parameters, "trackDistance") * (n(parameters, "speedRatioA") - n(parameters, "speedRatioB")) / n(parameters, "speedRatioA");
      return numericResult(
        lead,
        "QUANTITY",
        {
          setup: `Track=${n(parameters, "trackDistance")}, speeds=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`,
          slowerDistance: formatNumber(n(parameters, "trackDistance") * n(parameters, "speedRatioB") / n(parameters, "speedRatioA")),
          result: formatNumber(lead),
        },
        `${n(parameters, "trackDistance")}\\times\\frac{${n(parameters, "speedRatioA")}-${n(parameters, "speedRatioB")}}{${n(parameters, "speedRatioA")}}`,
      );
    }
    case "sdtOvertakeTime": {
      const relativeSpeedMetersPerSecond = (n(parameters, "speedA") - n(parameters, "speedB")) * 1000 / 3600;
      const timeSeconds = n(parameters, "leadDistance") / relativeSpeedMetersPerSecond;
      return numericResult(
        timeSeconds,
        "TIME",
        {
          setup: `Speeds=${n(parameters, "speedA")},${n(parameters, "speedB")} km/h; lead=${n(parameters, "leadDistance")} m`,
          relativeSpeed: formatNumber(relativeSpeedMetersPerSecond),
          result: formatNumber(timeSeconds),
        },
        `\\frac{${n(parameters, "leadDistance")}}{(${n(parameters, "speedA")}-${n(parameters, "speedB")})\\times\\frac{1000}{3600}}`,
      );
    }
    case "populationCrossTabCellCount": {
      const cells = populationCells(parameters);
      const result = targetPopulationCell(parameters);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `M:F=${n(parameters, "maleRatio")}:${n(parameters, "femaleRatio")}`,
          maleTotal: formatNumber(cells.maleTotal),
          femaleTotal: formatNumber(cells.femaleTotal),
          literateMales: formatNumber(cells.literateMales),
          illiterateMales: formatNumber(cells.illiterateMales),
          literateFemales: formatNumber(cells.literateFemales),
          illiterateFemales: formatNumber(cells.illiterateFemales),
          result: formatNumber(result),
        },
        `\\text{cell}=\\text{row total}\\times\\frac{\\text{target literacy part}}{\\text{row literacy parts}}`,
      );
    }
    case "populationTotalLiterate": {
      const cells = populationCells(parameters);
      const result = cells.literateMales + cells.literateFemales;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `M:F=${n(parameters, "maleRatio")}:${n(parameters, "femaleRatio")}`,
          literateMales: formatNumber(cells.literateMales),
          literateFemales: formatNumber(cells.literateFemales),
          result: formatNumber(result),
        },
        `${formatNumber(cells.literateMales)}+${formatNumber(cells.literateFemales)}`,
      );
    }
    case "populationLiteracyPercent": {
      const cells = populationCells(parameters);
      const literateTotal = cells.literateMales + cells.literateFemales;
      const result = literateTotal * 100 / n(parameters, "totalPopulation");
      return numericResult(
        result,
        "PERCENT",
        {
          setup: `Total=${n(parameters, "totalPopulation")}`,
          literateMales: formatNumber(cells.literateMales),
          literateFemales: formatNumber(cells.literateFemales),
          literateTotal: formatNumber(literateTotal),
          result: formatNumber(result),
        },
        `\\frac{${formatNumber(literateTotal)}}{${n(parameters, "totalPopulation")}}\\times100`,
      );
    }
    case "populationCellRatio": {
      const first = populationCellValue(parameters, s(parameters, "ratioCellA"));
      const second = populationCellValue(parameters, s(parameters, "ratioCellB"));
      return ratioResult(
        [first, second],
        {
          setup: `${s(parameters, "ratioCellA")}:${s(parameters, "ratioCellB")}`,
          first: formatNumber(first),
          second: formatNumber(second),
          result: simplifyRatio([first, second]).join(":"),
        },
        `${formatNumber(first)}:${formatNumber(second)}`,
      );
    }
    case "populationTotalIlliterate": {
      const cells = populationCells(parameters);
      const result = cells.illiterateMales + cells.illiterateFemales;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `M:F=${n(parameters, "maleRatio")}:${n(parameters, "femaleRatio")}`,
          illiterateMales: formatNumber(cells.illiterateMales),
          illiterateFemales: formatNumber(cells.illiterateFemales),
          result: formatNumber(result),
        },
        `${formatNumber(cells.illiterateMales)}+${formatNumber(cells.illiterateFemales)}`,
      );
    }
    case "electionWinnerVotes": {
      const result = n(parameters, "totalValidVotes") * electionWinnerRatio(parameters) / electionRatioSum(parameters);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Valid=${n(parameters, "totalValidVotes")}, split=${n(parameters, "candidateRatioA")}:${n(parameters, "candidateRatioB")}`,
          winnerRatio: electionWinnerRatio(parameters),
          result: formatNumber(result),
        },
        `${n(parameters, "totalValidVotes")}\\times\\frac{${electionWinnerRatio(parameters)}}{${electionRatioSum(parameters)}}`,
      );
    }
    case "electionWinningMargin": {
      const validVotes = electionValidVotes(parameters);
      const result = validVotes * (electionWinnerRatio(parameters) - electionLoserRatio(parameters)) / electionRatioSum(parameters);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Voters=${n(parameters, "totalVoters")}, turnout=${n(parameters, "turnoutPercent")}%, valid=${n(parameters, "validPercent")}%`,
          polledVotes: formatNumber(electionPolledVotes(parameters)),
          validVotes: formatNumber(validVotes),
          result: formatNumber(result),
        },
        `${formatNumber(validVotes)}\\times\\frac{${electionWinnerRatio(parameters)}-${electionLoserRatio(parameters)}}{${electionRatioSum(parameters)}}`,
      );
    }
    case "electionTotalVotersFromMargin": {
      const validVotes = n(parameters, "winningMargin") * electionRatioSum(parameters) / (electionWinnerRatio(parameters) - electionLoserRatio(parameters));
      const polledVotes = validVotes * 100 / n(parameters, "validPercent");
      const result = polledVotes * 100 / n(parameters, "turnoutPercent");
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Margin=${n(parameters, "winningMargin")}, turnout=${n(parameters, "turnoutPercent")}%, valid=${n(parameters, "validPercent")}%`,
          validVotes: formatNumber(validVotes),
          polledVotes: formatNumber(polledVotes),
          result: formatNumber(result),
        },
        `${n(parameters, "winningMargin")}\\times\\frac{${electionRatioSum(parameters)}}{${electionWinnerRatio(parameters)}-${electionLoserRatio(parameters)}}`,
      );
    }
    case "electionLoserVotes": {
      const validVotes = electionValidVotes(parameters);
      const result = validVotes * electionLoserRatio(parameters) / electionRatioSum(parameters);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Voters=${n(parameters, "totalVoters")}, turnout=${n(parameters, "turnoutPercent")}%, valid=${n(parameters, "validPercent")}%`,
          validVotes: formatNumber(validVotes),
          loserRatio: electionLoserRatio(parameters),
          result: formatNumber(result),
        },
        `${formatNumber(validVotes)}\\times\\frac{${electionLoserRatio(parameters)}}{${electionRatioSum(parameters)}}`,
      );
    }
    case "electionInvalidVotes": {
      const polledVotes = electionPolledVotes(parameters);
      const result = polledVotes * n(parameters, "invalidPercent") / 100;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Voters=${n(parameters, "totalVoters")}, turnout=${n(parameters, "turnoutPercent")}%, invalid=${n(parameters, "invalidPercent")}%`,
          polledVotes: formatNumber(polledVotes),
          result: formatNumber(result),
        },
        `${formatNumber(polledVotes)}\\times\\frac{${n(parameters, "invalidPercent")}}{100}`,
      );
    }
    case "geometricAreaRatioFromSide": {
      return ratioResult(
        [n(parameters, "sideRatioA") ** 2, n(parameters, "sideRatioB") ** 2],
        {
          setup: `Side=${n(parameters, "sideRatioA")}:${n(parameters, "sideRatioB")}`,
          result: simplifyRatio([n(parameters, "sideRatioA") ** 2, n(parameters, "sideRatioB") ** 2]).join(":"),
        },
        `${n(parameters, "sideRatioA")}^2:${n(parameters, "sideRatioB")}^2`,
      );
    }
    case "geometricVolumeRatioFromSide": {
      return ratioResult(
        [n(parameters, "sideRatioA") ** 3, n(parameters, "sideRatioB") ** 3],
        {
          setup: `Side=${n(parameters, "sideRatioA")}:${n(parameters, "sideRatioB")}`,
          result: simplifyRatio([n(parameters, "sideRatioA") ** 3, n(parameters, "sideRatioB") ** 3]).join(":"),
        },
        `${n(parameters, "sideRatioA")}^3:${n(parameters, "sideRatioB")}^3`,
      );
    }
    case "geometricSideRatioFromArea": {
      const sideA = Math.sqrt(n(parameters, "areaRatioA"));
      const sideB = Math.sqrt(n(parameters, "areaRatioB"));
      return ratioResult(
        [sideA, sideB],
        {
          setup: `Area=${n(parameters, "areaRatioA")}:${n(parameters, "areaRatioB")}`,
          sideA: formatNumber(sideA),
          sideB: formatNumber(sideB),
          result: simplifyRatio([sideA, sideB]).join(":"),
        },
        `\\sqrt{${n(parameters, "areaRatioA")}}:\\sqrt{${n(parameters, "areaRatioB")}}`,
      );
    }
    case "geometricSurfaceAreaRatioFromVolume": {
      const sideA = Math.cbrt(n(parameters, "volumeRatioA"));
      const sideB = Math.cbrt(n(parameters, "volumeRatioB"));
      return ratioResult(
        [sideA ** 2, sideB ** 2],
        {
          setup: `Volume=${n(parameters, "volumeRatioA")}:${n(parameters, "volumeRatioB")}`,
          sideRatio: `${formatNumber(sideA)}:${formatNumber(sideB)}`,
          result: simplifyRatio([sideA ** 2, sideB ** 2]).join(":"),
        },
        `(\\sqrt[3]{${n(parameters, "volumeRatioA")}})^2:(\\sqrt[3]{${n(parameters, "volumeRatioB")}})^2`,
      );
    }
    case "geometricAreaRatioFromRadius": {
      return ratioResult(
        [n(parameters, "radiusRatioA") ** 2, n(parameters, "radiusRatioB") ** 2],
        {
          setup: `Radius=${n(parameters, "radiusRatioA")}:${n(parameters, "radiusRatioB")}`,
          result: simplifyRatio([n(parameters, "radiusRatioA") ** 2, n(parameters, "radiusRatioB") ** 2]).join(":"),
        },
        `${n(parameters, "radiusRatioA")}^2:${n(parameters, "radiusRatioB")}^2`,
      );
    }
    case "agePresentFromFutureRatio": {
      const presentA = n(parameters, "ratioA");
      const presentB = n(parameters, "ratioB");
      const futureA = n(parameters, "futureRatioA");
      const futureB = n(parameters, "futureRatioB");
      const shift = n(parameters, "shiftYears");
      const unit = shift * (futureB - futureA) / (futureA * presentB - futureB * presentA);
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
    case "ageFromSumAndRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const unit = n(parameters, "ageSum") / (ratioA + ratioB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}, sum=${n(parameters, "ageSum")}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${ratioA + ratioB}x=${n(parameters, "ageSum")}`,
      );
    }
    case "ageFutureRatioFromPresent": {
      const presentAgeA = n(parameters, "presentAgeA");
      const presentAgeB = n(parameters, "presentAgeB");
      const shift = n(parameters, "shiftYears");
      return ratioResult(
        [presentAgeA + shift, presentAgeB + shift],
        {
          setup: `${presentAgeA}:${presentAgeB} after ${shift} years`,
          presentAgeA,
          presentAgeB,
          shiftYears: shift,
          result: simplifyRatio([presentAgeA + shift, presentAgeB + shift]).join(":"),
        },
        `(${presentAgeA}+${shift}):(${presentAgeB}+${shift})`,
      );
    }
    case "agePastRatioFromPresent": {
      const presentAgeA = n(parameters, "presentAgeA");
      const presentAgeB = n(parameters, "presentAgeB");
      const shift = n(parameters, "shiftYears");
      return ratioResult(
        [presentAgeA - shift, presentAgeB - shift],
        {
          setup: `${presentAgeA}:${presentAgeB} ${shift} years ago`,
          presentAgeA,
          presentAgeB,
          shiftYears: shift,
          result: simplifyRatio([presentAgeA - shift, presentAgeB - shift]).join(":"),
        },
        `(${presentAgeA}-${shift}):(${presentAgeB}-${shift})`,
      );
    }
    case "ageThreePersonSumRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const ratioC = n(parameters, "ratioC");
      const unit = n(parameters, "ageSum") / (ratioA + ratioB + ratioC);
      const target = s(parameters, "targetPerson");
      const result = target === s(parameters, "personC")
        ? ratioC * unit
        : target === s(parameters, "personB")
          ? ratioB * unit
          : ratioA * unit;
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}:${ratioC}, sum=${n(parameters, "ageSum")}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          presentAgeC: formatNumber(ratioC * unit),
          targetPerson: target,
          result: formatNumber(result),
        },
        `${ratioA + ratioB + ratioC}x=${n(parameters, "ageSum")}`,
      );
    }
    default:
      throw new Error(`RAP-003 solver missing for taskKind: ${parameters.taskKind}`);
  }
}
