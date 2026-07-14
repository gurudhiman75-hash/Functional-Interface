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
    case "partnershipLeavingPartnerProfit":
    case "partnershipLossShare": {
      const productA = n(parameters, "investmentA") * n(parameters, "timeA");
      const productB = n(parameters, "investmentB") * n(parameters, "timeB");
      const total = parameters.taskKind === "partnershipLossShare" ? n(parameters, "totalLoss") : n(parameters, "totalProfit");
      const result = s(parameters, "targetPartner") === s(parameters, "personB")
        ? total * productB / (productA + productB)
        : total * productA / (productA + productB);
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
    case "partnershipMidPeriodChangeBoth": {
      const productA = n(parameters, "initialInvestmentA") * n(parameters, "firstPeriod")
        + n(parameters, "changedInvestmentA") * n(parameters, "secondPeriod");
      const productB = n(parameters, "initialInvestmentB") * n(parameters, "firstPeriod")
        + n(parameters, "changedInvestmentB") * n(parameters, "secondPeriod");
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
        `(${n(parameters, "initialInvestmentA")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentA")}\\times${n(parameters, "secondPeriod")}):(${n(parameters, "initialInvestmentB")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentB")}\\times${n(parameters, "secondPeriod")})`,
      );
    }
    case "partnershipSalaryThenProfitShare":
    case "partnershipRemainingProfitAfterCommission": {
      const productA = n(parameters, "investmentA") * n(parameters, "timeA");
      const productB = n(parameters, "investmentB") * n(parameters, "timeB");
      const deduction = parameters.taskKind === "partnershipSalaryThenProfitShare" ? n(parameters, "salaryAmount") : n(parameters, "commission");
      const remainingProfit = n(parameters, "totalProfit") - deduction;
      const baseShare = s(parameters, "targetPartner") === s(parameters, "personB")
        ? remainingProfit * productB / (productA + productB)
        : remainingProfit * productA / (productA + productB);
      const salaryExtra = parameters.taskKind === "partnershipSalaryThenProfitShare" && s(parameters, "targetPartner") === s(parameters, "salaryPartner")
        ? n(parameters, "salaryAmount")
        : 0;
      const result = baseShare + salaryExtra;
      return numericResult(
        result,
        "PROFIT",
        {
          setup: `${s(parameters, "personA")}:${s(parameters, "personB")}`,
          productA: formatNumber(productA),
          productB: formatNumber(productB),
          profitRatio: `${formatNumber(productA)}:${formatNumber(productB)}`,
          remainingProfit: formatNumber(remainingProfit),
          targetPartner: s(parameters, "targetPartner"),
          result: formatNumber(result),
        },
        `${formatNumber(remainingProfit)}\\times\\frac{${s(parameters, "targetPartner") === s(parameters, "personB") ? formatNumber(productB) : formatNumber(productA)}}{${formatNumber(productA + productB)}}${salaryExtra ? `+${salaryExtra}` : ""}`,
      );
    }
    case "partnershipProfitFromKnownShare": {
      const productA = n(parameters, "investmentA") * n(parameters, "timeA");
      const productB = n(parameters, "investmentB") * n(parameters, "timeB");
      const knownProduct = s(parameters, "knownPartner") === s(parameters, "personB") ? productB : productA;
      const totalProfit = n(parameters, "knownShare") * (productA + productB) / knownProduct;
      return numericResult(
        totalProfit,
        "PROFIT",
        {
          setup: `${formatNumber(productA)}:${formatNumber(productB)}`,
          productA: formatNumber(productA),
          productB: formatNumber(productB),
          profitRatio: `${formatNumber(productA)}:${formatNumber(productB)}`,
          knownPartner: s(parameters, "knownPartner"),
          result: formatNumber(totalProfit),
        },
        `${n(parameters, "knownShare")}\\times\\frac{${formatNumber(productA + productB)}}{${formatNumber(knownProduct)}}`,
      );
    }
    case "partnershipCapitalRatioTimeRatio":
    case "workContributionShare": {
      const left = parameters.taskKind === "workContributionShare"
        ? n(parameters, "efficiencyRatioA") * n(parameters, "daysA")
        : n(parameters, "capitalRatioA") * n(parameters, "timeRatioA");
      const right = parameters.taskKind === "workContributionShare"
        ? n(parameters, "efficiencyRatioB") * n(parameters, "daysB")
        : n(parameters, "capitalRatioB") * n(parameters, "timeRatioB");
      return ratioResult(
        [left, right],
        {
          setup: parameters.taskKind === "workContributionShare"
            ? `Efficiency=${n(parameters, "efficiencyRatioA")}:${n(parameters, "efficiencyRatioB")}, days=${n(parameters, "daysA")}:${n(parameters, "daysB")}`
            : `Capital=${n(parameters, "capitalRatioA")}:${n(parameters, "capitalRatioB")}, time=${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`,
          productA: formatNumber(left),
          productB: formatNumber(right),
          profitRatio: simplifyRatio([left, right]).join(":"),
        },
        `${formatNumber(left)}:${formatNumber(right)}`,
      );
    }
    case "partnershipNewPartnerCapital": {
      const requiredInvestment = n(parameters, "investmentA") * n(parameters, "timeA") * n(parameters, "profitRatioB")
        / (n(parameters, "profitRatioA") * n(parameters, "timeB"));
      return numericResult(
        requiredInvestment,
        "QUANTITY",
        {
          setup: `${s(parameters, "personA")}:${s(parameters, "personB")} profit=${n(parameters, "profitRatioA")}:${n(parameters, "profitRatioB")}`,
          productA: formatNumber(n(parameters, "investmentA") * n(parameters, "timeA")),
          productB: formatNumber(requiredInvestment * n(parameters, "timeB")),
          profitRatio: `${n(parameters, "profitRatioA")}:${n(parameters, "profitRatioB")}`,
          result: formatNumber(requiredInvestment),
        },
        `\\frac{x\\times${n(parameters, "timeB")}}{${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}}=\\frac{${n(parameters, "profitRatioB")}}{${n(parameters, "profitRatioA")}}`,
      );
    }
    case "partnershipTimeFromProfitRatio": {
      const timeB = n(parameters, "profitRatioB") * n(parameters, "investmentA") * n(parameters, "timeA")
        / (n(parameters, "profitRatioA") * n(parameters, "investmentB"));
      return numericResult(
        timeB,
        "TIME",
        {
          setup: `${s(parameters, "personA")}:${s(parameters, "personB")} profit=${n(parameters, "profitRatioA")}:${n(parameters, "profitRatioB")}`,
          productA: formatNumber(n(parameters, "investmentA") * n(parameters, "timeA")),
          productB: formatNumber(n(parameters, "investmentB") * timeB),
          profitRatio: `${n(parameters, "profitRatioA")}:${n(parameters, "profitRatioB")}`,
          result: formatNumber(timeB),
        },
        `\\frac{${n(parameters, "investmentB")}\\times x}{${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}}=\\frac{${n(parameters, "profitRatioB")}}{${n(parameters, "profitRatioA")}}`,
      );
    }
    case "partnershipTargetPartnerShareFromRatio": {
      const productA = n(parameters, "effectiveRatioA");
      const productB = n(parameters, "effectiveRatioB");
      const result = s(parameters, "targetPartner") === s(parameters, "personB")
        ? n(parameters, "totalProfit") * productB / (productA + productB)
        : n(parameters, "totalProfit") * productA / (productA + productB);
      return numericResult(
        result,
        "PROFIT",
        {
          setup: `${productA}:${productB}`,
          productA,
          productB,
          profitRatio: `${productA}:${productB}`,
          targetPartner: s(parameters, "targetPartner"),
          result: formatNumber(result),
        },
        `${n(parameters, "totalProfit")}\\times\\frac{${s(parameters, "targetPartner") === s(parameters, "personB") ? productB : productA}}{${productA + productB}}`,
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
      const expenditureScale = parameters.variables.givenExpenditureB !== undefined
        ? n(parameters, "givenExpenditureB") / n(parameters, "expenditureRatioB")
        : undefined;
      const incomeScale = parameters.variables.givenExpenditureB !== undefined
        ? ((n(parameters, "expenditureRatioB") - n(parameters, "expenditureRatioA")) * Number(expenditureScale))
          / (n(parameters, "incomeRatioB") - n(parameters, "incomeRatioA"))
        : n(parameters, "givenIncomeA") / n(parameters, "incomeRatioA");
      const finalExpenditureScale = expenditureScale ?? ((n(parameters, "incomeRatioB") - n(parameters, "incomeRatioA")) * incomeScale)
        / (n(parameters, "expenditureRatioB") - n(parameters, "expenditureRatioA"));
      const savingsA = n(parameters, "incomeRatioA") * incomeScale - n(parameters, "expenditureRatioA") * finalExpenditureScale;
      const savingsB = n(parameters, "incomeRatioB") * incomeScale - n(parameters, "expenditureRatioB") * finalExpenditureScale;
      const result = targetByPerson(parameters, savingsA, savingsB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `Equal savings, I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeScale: formatNumber(incomeScale),
          expenditureScale: formatNumber(finalExpenditureScale),
          savingsA: formatNumber(savingsA),
          savingsB: formatNumber(savingsB),
          result: formatNumber(result),
        },
        `${n(parameters, "incomeRatioA")}x-${n(parameters, "expenditureRatioA")}y=${n(parameters, "incomeRatioB")}x-${n(parameters, "expenditureRatioB")}y`,
      );
    }
    case "incomeFromSavingsRatio": {
      if (parameters.answerType === "RATIO" && parameters.variables.expenditureUnit !== undefined && parameters.variables.savingsUnit !== undefined) {
        const incomeA = n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit") + n(parameters, "savingsRatioA") * n(parameters, "savingsUnit");
        const incomeB = n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit") + n(parameters, "savingsRatioB") * n(parameters, "savingsUnit");
        return ratioResult(
          [incomeA, incomeB],
          {
            setup: `E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}, S=${n(parameters, "savingsRatioA")}:${n(parameters, "savingsRatioB")}`,
            incomeA: formatNumber(incomeA),
            incomeB: formatNumber(incomeB),
            result: simplifyRatio([incomeA, incomeB]).join(":"),
          },
          `(${n(parameters, "expenditureRatioA")}\\times${n(parameters, "expenditureUnit")}+${n(parameters, "savingsRatioA")}\\times${n(parameters, "savingsUnit")}):(${n(parameters, "expenditureRatioB")}\\times${n(parameters, "expenditureUnit")}+${n(parameters, "savingsRatioB")}\\times${n(parameters, "savingsUnit")})`,
        );
      }
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
      if (parameters.answerType === "RATIO" && parameters.variables.incomeUnit !== undefined && parameters.variables.savingsUnit !== undefined) {
        const expenditureA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit") - n(parameters, "savingsRatioA") * n(parameters, "savingsUnit");
        const expenditureB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit") - n(parameters, "savingsRatioB") * n(parameters, "savingsUnit");
        return ratioResult(
          [expenditureA, expenditureB],
          {
            setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, S=${n(parameters, "savingsRatioA")}:${n(parameters, "savingsRatioB")}`,
            expenditureA: formatNumber(expenditureA),
            expenditureB: formatNumber(expenditureB),
            result: simplifyRatio([expenditureA, expenditureB]).join(":"),
          },
          `(${n(parameters, "incomeRatioA")}\\times${n(parameters, "incomeUnit")}-${n(parameters, "savingsRatioA")}\\times${n(parameters, "savingsUnit")}):(${n(parameters, "incomeRatioB")}\\times${n(parameters, "incomeUnit")}-${n(parameters, "savingsRatioB")}\\times${n(parameters, "savingsUnit")})`,
        );
      }
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
    case "incomeExpenseDifferenceSavings":
    case "givenOneSavesMore": {
      const savingsPartA = n(parameters, "incomeRatioA") - n(parameters, "expenditureRatioA");
      const savingsPartB = n(parameters, "incomeRatioB") - n(parameters, "expenditureRatioB");
      const scale = n(parameters, "savingsDifference") / Math.abs(savingsPartA - savingsPartB);
      const incomeA = n(parameters, "incomeRatioA") * scale;
      const incomeB = n(parameters, "incomeRatioB") * scale;
      const result = targetByPerson(parameters, incomeA, incomeB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          savingsA: formatNumber(savingsPartA * scale),
          savingsB: formatNumber(savingsPartB * scale),
          result: formatNumber(result),
        },
        `${Math.abs(savingsPartA - savingsPartB)}x=${n(parameters, "savingsDifference")}`,
      );
    }
    case "incomeExpenseSumSavings": {
      const savingsPartA = n(parameters, "incomeRatioA") - n(parameters, "expenditureRatioA");
      const savingsPartB = n(parameters, "incomeRatioB") - n(parameters, "expenditureRatioB");
      const scale = n(parameters, "savingsSum") / (savingsPartA + savingsPartB);
      const expenditureA = n(parameters, "expenditureRatioA") * scale;
      const expenditureB = n(parameters, "expenditureRatioB") * scale;
      const result = targetByPerson(parameters, expenditureA, expenditureB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          expenditureA: formatNumber(expenditureA),
          expenditureB: formatNumber(expenditureB),
          savingsA: formatNumber(savingsPartA * scale),
          savingsB: formatNumber(savingsPartB * scale),
          result: formatNumber(result),
        },
        `${savingsPartA + savingsPartB}x=${n(parameters, "savingsSum")}`,
      );
    }
    case "incomeExpenseOneSavesPercent": {
      const savingsA = n(parameters, "incomeRatioA") * n(parameters, "savePercentA");
      const savingsB = n(parameters, "incomeRatioB") * n(parameters, "savePercentB");
      return ratioResult(
        [savingsA, savingsB],
        {
          setup: `Income=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, savings percent=${n(parameters, "savePercentA")}:${n(parameters, "savePercentB")}`,
          savingsA,
          savingsB,
          result: simplifyRatio([savingsA, savingsB]).join(":"),
        },
        `${n(parameters, "incomeRatioA")}\\times${n(parameters, "savePercentA")}:${n(parameters, "incomeRatioB")}\\times${n(parameters, "savePercentB")}`,
      );
    }
    case "incomeExpenseFindSavingsPercent": {
      const incomeA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
      const incomeB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
      const expenditureA = n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit");
      const expenditureB = n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit");
      const income = s(parameters, "targetPerson") === s(parameters, "personB") ? incomeB : incomeA;
      const expenditure = s(parameters, "targetPerson") === s(parameters, "personB") ? expenditureB : expenditureA;
      const percent = (income - expenditure) * 100 / income;
      return numericResult(
        percent,
        "PERCENT",
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          expenditureA: formatNumber(expenditureA),
          expenditureB: formatNumber(expenditureB),
          result: formatNumber(percent),
        },
        `\\frac{${formatNumber(income)}-${formatNumber(expenditure)}}{${formatNumber(income)}}\\times100`,
      );
    }
    case "familyIncomeExpenditure":
    case "incomeExpenseTotalIncome":
    case "incomeExpenseTotalExpense": {
      const incomeScale = parameters.taskKind === "incomeExpenseTotalIncome"
        ? n(parameters, "totalIncome") / (n(parameters, "incomeRatioA") + n(parameters, "incomeRatioB"))
        : parameters.variables.incomeUnit !== undefined
          ? n(parameters, "incomeUnit")
          : n(parameters, "totalExpense") / (n(parameters, "incomeRatioA") + n(parameters, "incomeRatioB"));
      const expenditureScale = parameters.taskKind === "incomeExpenseTotalExpense"
        ? n(parameters, "totalExpense") / (n(parameters, "expenditureRatioA") + n(parameters, "expenditureRatioB"))
        : n(parameters, "expenditureUnit");
      const incomeA = n(parameters, "incomeRatioA") * incomeScale;
      const incomeB = n(parameters, "incomeRatioB") * incomeScale;
      const expenditureA = n(parameters, "expenditureRatioA") * expenditureScale;
      const expenditureB = n(parameters, "expenditureRatioB") * expenditureScale;
      const result = parameters.taskKind === "incomeExpenseTotalExpense"
        ? incomeA + incomeB
        : incomeA + incomeB - expenditureA - expenditureB;
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          expenditureA: formatNumber(expenditureA),
          expenditureB: formatNumber(expenditureB),
          savingsA: formatNumber(incomeA - expenditureA),
          savingsB: formatNumber(incomeB - expenditureB),
          result: formatNumber(result),
        },
        parameters.taskKind === "incomeExpenseTotalExpense"
          ? `${formatNumber(incomeA)}+${formatNumber(incomeB)}`
          : `(${formatNumber(incomeA)}+${formatNumber(incomeB)})-(${formatNumber(expenditureA)}+${formatNumber(expenditureB)})`,
      );
    }
    case "salarySpendingSavings":
    case "givenOneSpendsMore": {
      const scale = parameters.taskKind === "givenOneSpendsMore"
        ? n(parameters, "expenseDifference") / Math.abs(n(parameters, "expenditureRatioB") - n(parameters, "expenditureRatioA"))
        : n(parameters, "incomeUnit");
      const incomeA = n(parameters, "incomeRatioA") * scale;
      const incomeB = n(parameters, "incomeRatioB") * scale;
      const expenditureA = n(parameters, "expenditureRatioA") * scale;
      const expenditureB = n(parameters, "expenditureRatioB") * scale;
      const savingsA = incomeA - expenditureA;
      const savingsB = incomeB - expenditureB;
      const result = parameters.taskKind === "givenOneSpendsMore"
        ? targetByPerson(parameters, savingsA, savingsB)
        : Math.abs(savingsA - savingsB);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `I=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}, E=${n(parameters, "expenditureRatioA")}:${n(parameters, "expenditureRatioB")}`,
          savingsA: formatNumber(savingsA),
          savingsB: formatNumber(savingsB),
          result: formatNumber(result),
        },
        parameters.taskKind === "givenOneSpendsMore"
          ? `${s(parameters, "targetPerson")}\\text{ savings}=${formatNumber(result)}`
          : `|(${formatNumber(incomeA)}-${formatNumber(expenditureA)})-(${formatNumber(incomeB)}-${formatNumber(expenditureB)})|`,
      );
    }
    case "shopRevenueCostProfit": {
      const profitA = n(parameters, "revenueRatioA") * n(parameters, "revenueUnit") - n(parameters, "costRatioA") * n(parameters, "costUnit");
      const profitB = n(parameters, "revenueRatioB") * n(parameters, "revenueUnit") - n(parameters, "costRatioB") * n(parameters, "costUnit");
      return ratioResult(
        [profitA, profitB],
        {
          setup: `Revenue=${n(parameters, "revenueRatioA")}:${n(parameters, "revenueRatioB")}, cost=${n(parameters, "costRatioA")}:${n(parameters, "costRatioB")}`,
          savingsA: formatNumber(profitA),
          savingsB: formatNumber(profitB),
          result: simplifyRatio([profitA, profitB]).join(":"),
        },
        `(${n(parameters, "revenueRatioA")}\\times${n(parameters, "revenueUnit")}-${n(parameters, "costRatioA")}\\times${n(parameters, "costUnit")}):(${n(parameters, "revenueRatioB")}\\times${n(parameters, "revenueUnit")}-${n(parameters, "costRatioB")}\\times${n(parameters, "costUnit")})`,
      );
    }
    case "equalIncomeDifferentExpense":
    case "equalExpenseDifferentIncome":
    case "pocketMoneySpending":
    case "incomeExpenseSavingsComparison": {
      const incomeA = parameters.taskKind === "equalIncomeDifferentExpense"
        ? n(parameters, "incomeValue")
        : n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
      const incomeB = parameters.taskKind === "equalIncomeDifferentExpense"
        ? n(parameters, "incomeValue")
        : n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
      const expenditureA = parameters.taskKind === "equalExpenseDifferentIncome"
        ? n(parameters, "expenseValue")
        : n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit");
      const expenditureB = parameters.taskKind === "equalExpenseDifferentIncome"
        ? n(parameters, "expenseValue")
        : n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit");
      const savingsA = incomeA - expenditureA;
      const savingsB = incomeB - expenditureB;
      return ratioResult(
        [savingsA, savingsB],
        {
          setup: `Savings=${formatNumber(savingsA)}:${formatNumber(savingsB)}`,
          savingsA: formatNumber(savingsA),
          savingsB: formatNumber(savingsB),
          result: simplifyRatio([savingsA, savingsB]).join(":"),
        },
        `(${formatNumber(incomeA)}-${formatNumber(expenditureA)}):(${formatNumber(incomeB)}-${formatNumber(expenditureB)})`,
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
      const fractions = [
        [n(parameters, "ratioAComponent"), n(parameters, "ratioAComponent") + n(parameters, "ratioAOther")],
        [n(parameters, "ratioBComponent"), n(parameters, "ratioBComponent") + n(parameters, "ratioBOther")],
        [n(parameters, "ratioCComponent"), n(parameters, "ratioCComponent") + n(parameters, "ratioCOther")],
      ] as const;
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
      const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
      const commonDenominator = fractions.map(([, denominator]) => denominator).reduce(lcm);
      const componentUnits = fractions.reduce((sum, [numerator, denominator]) => sum + numerator * (commonDenominator / denominator), 0);
      const totalUnits = 3 * commonDenominator;
      const otherUnits = totalUnits - componentUnits;
      const componentFraction = componentUnits / totalUnits;
      return ratioResult(
        [componentUnits, otherUnits],
        {
          setup: `${n(parameters, "ratioAComponent")}:${n(parameters, "ratioAOther")}, ${n(parameters, "ratioBComponent")}:${n(parameters, "ratioBOther")}, ${n(parameters, "ratioCComponent")}:${n(parameters, "ratioCOther")}`,
          componentFraction: formatNumber(componentFraction),
          result: simplifyRatio([componentUnits, otherUnits]).join(":"),
        },
        `\\frac{${fractions.map(([numerator, denominator]) => `\\frac{${numerator}}{${denominator}}`).join("+")}}{3}`,
      );
    }
    case "weightedAverageGroup":
    case "weightedProfitPercentMix":
    case "weightedDiscountMix":
    case "marksAverageMixture": {
      const result = (n(parameters, "quantityA") * n(parameters, "averageA") + n(parameters, "quantityB") * n(parameters, "averageB")) / (n(parameters, "quantityA") + n(parameters, "quantityB"));
      const answerType = parameters.taskKind === "weightedAverageGroup" || parameters.taskKind === "marksAverageMixture" ? "QUANTITY" : "PERCENT";
      return numericResult(
        result,
        answerType,
        {
          setup: `${n(parameters, "quantityA")}@${n(parameters, "averageA")}, ${n(parameters, "quantityB")}@${n(parameters, "averageB")}`,
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "quantityA")}\\times${n(parameters, "averageA")}+${n(parameters, "quantityB")}\\times${n(parameters, "averageB")}}{${n(parameters, "quantityA") + n(parameters, "quantityB")}}`,
      );
    }
    case "alloyMissingQuantity": {
      const result = n(parameters, "quantityA") * Math.abs(n(parameters, "percentA") - n(parameters, "targetPercent")) / Math.abs(n(parameters, "targetPercent") - n(parameters, "percentB"));
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: `${n(parameters, "quantityA")} at ${n(parameters, "percentA")}%, target=${n(parameters, "targetPercent")}%, other=${n(parameters, "percentB")}%`,
          result: formatNumber(result),
        },
        `${n(parameters, "quantityA")}\\times\\frac{|${n(parameters, "percentA")}-${n(parameters, "targetPercent")}|}{|${n(parameters, "targetPercent")}-${n(parameters, "percentB")}|}`,
      );
    }
    case "alloyMissingSourcePercent": {
      const result = (n(parameters, "targetPercent") * (n(parameters, "mixRatioA") + n(parameters, "mixRatioB")) - n(parameters, "mixRatioA") * n(parameters, "percentA")) / n(parameters, "mixRatioB");
      return numericResult(
        result,
        "PERCENT",
        {
          setup: `Mix=${n(parameters, "mixRatioA")}:${n(parameters, "mixRatioB")}, known=${n(parameters, "percentA")}%, target=${n(parameters, "targetPercent")}%`,
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "targetPercent")}(${n(parameters, "mixRatioA")}+${n(parameters, "mixRatioB")})-${n(parameters, "mixRatioA")}\\times${n(parameters, "percentA")}}{${n(parameters, "mixRatioB")}}`,
      );
    }
    case "alloyTargetFromThreeSources": {
      const totalQuantity = n(parameters, "quantityA") + n(parameters, "quantityB") + n(parameters, "quantityC");
      const result = (n(parameters, "quantityA") * n(parameters, "percentA") + n(parameters, "quantityB") * n(parameters, "percentB") + n(parameters, "quantityC") * n(parameters, "percentC")) / totalQuantity;
      return numericResult(
        result,
        "PERCENT",
        {
          setup: `${n(parameters, "quantityA")}@${n(parameters, "percentA")}%, ${n(parameters, "quantityB")}@${n(parameters, "percentB")}%, ${n(parameters, "quantityC")}@${n(parameters, "percentC")}%`,
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "quantityA")}\\times${n(parameters, "percentA")}+${n(parameters, "quantityB")}\\times${n(parameters, "percentB")}+${n(parameters, "quantityC")}\\times${n(parameters, "percentC")}}{${totalQuantity}}`,
      );
    }
    case "alloyPureAndImpureMix":
    case "alloyZeroComponentMix":
    case "alloyTargetExactlyMidpoint":
    case "alloyNonMidpointTrap":
    case "mixingRatioFromAveragePrice": {
      const partA = Math.abs(n(parameters, "targetPercent") - n(parameters, "percentB"));
      const partB = Math.abs(n(parameters, "percentA") - n(parameters, "targetPercent"));
      return ratioResult(
        [partA, partB],
        {
          setup: `${n(parameters, "percentA")} and ${n(parameters, "percentB")} -> ${n(parameters, "targetPercent")}`,
          result: simplifyRatio([partA, partB]).join(":"),
        },
        `${formatNumber(partA)}:${formatNumber(partB)}`,
      );
    }
    case "sugarSolutionConcentration": {
      const sugar = n(parameters, "quantityA") * n(parameters, "percentA") / 100 + n(parameters, "quantityB") * n(parameters, "percentB") / 100;
      const result = sugar * 100 / (n(parameters, "quantityA") + n(parameters, "quantityB"));
      return numericResult(result, "PERCENT", { setup: "Weighted sugar percentage", sugar: formatNumber(sugar), result: formatNumber(result) }, `\\frac{${formatNumber(sugar)}}{${n(parameters, "quantityA") + n(parameters, "quantityB")}}\\times100`);
    }
    case "averagePriceFromRatio": {
      const result = (n(parameters, "ratioA") * n(parameters, "priceA") + n(parameters, "ratioB") * n(parameters, "priceB")) / (n(parameters, "ratioA") + n(parameters, "ratioB"));
      return numericResult(result, "QUANTITY", { setup: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, result: formatNumber(result) }, `\\frac{${n(parameters, "ratioA")}\\times${n(parameters, "priceA")}+${n(parameters, "ratioB")}\\times${n(parameters, "priceB")}}{${n(parameters, "ratioA") + n(parameters, "ratioB")}}`);
    }
    case "reverseWeightedAverageCount": {
      const result = n(parameters, "quantityA") * Math.abs(n(parameters, "averageA") - n(parameters, "combinedAverage")) / Math.abs(n(parameters, "combinedAverage") - n(parameters, "averageB"));
      return numericResult(result, "COUNT", { setup: `${n(parameters, "quantityA")} at ${n(parameters, "averageA")}, target=${n(parameters, "combinedAverage")}`, result: formatNumber(result) }, `${n(parameters, "quantityA")}\\times\\frac{|${n(parameters, "averageA")}-${n(parameters, "combinedAverage")}|}{|${n(parameters, "combinedAverage")}-${n(parameters, "averageB")}|}`);
    }
    case "reverseWeightedAverageGroupAvg": {
      const result = (n(parameters, "combinedAverage") * (n(parameters, "quantityA") + n(parameters, "quantityB")) - n(parameters, "quantityA") * n(parameters, "averageA")) / n(parameters, "quantityB");
      return numericResult(result, "QUANTITY", { setup: `Combined average=${n(parameters, "combinedAverage")}`, result: formatNumber(result) }, `\\frac{${n(parameters, "combinedAverage")}(${n(parameters, "quantityA")}+${n(parameters, "quantityB")})-${n(parameters, "quantityA")}\\times${n(parameters, "averageA")}}{${n(parameters, "quantityB")}}`);
    }
    case "alloyReplaceToTarget": {
      const result = n(parameters, "totalQuantity") * (n(parameters, "targetPercent") - n(parameters, "initialPercent")) / (n(parameters, "addPercent") - n(parameters, "initialPercent"));
      return numericResult(result, "QUANTITY", { setup: `Initial=${n(parameters, "initialPercent")}%, add=${n(parameters, "addPercent")}%, target=${n(parameters, "targetPercent")}%`, result: formatNumber(result) }, `${n(parameters, "totalQuantity")}\\times\\frac{${n(parameters, "targetPercent")}-${n(parameters, "initialPercent")}}{${n(parameters, "addPercent")}-${n(parameters, "initialPercent")}}`);
    }
    case "alloyRatioToFinalPercent": {
      const result = (n(parameters, "mixRatioA") * n(parameters, "percentA") + n(parameters, "mixRatioB") * n(parameters, "percentB")) / (n(parameters, "mixRatioA") + n(parameters, "mixRatioB"));
      return numericResult(result, "PERCENT", { setup: `${n(parameters, "mixRatioA")}:${n(parameters, "mixRatioB")}`, result: formatNumber(result) }, `\\frac{${n(parameters, "mixRatioA")}\\times${n(parameters, "percentA")}+${n(parameters, "mixRatioB")}\\times${n(parameters, "percentB")}}{${n(parameters, "mixRatioA") + n(parameters, "mixRatioB")}}`);
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
    case "replacementAddedLiquidQuantity": {
      const remainingA = replacementOriginalRemaining(parameters);
      const addedLiquid = n(parameters, "initialVolume") - remainingA;
      return numericResult(
        addedLiquid,
        "QUANTITY",
        {
          setup: `${n(parameters, "initialVolume")}, remove ${n(parameters, "removedVolume")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber(replacementRetention(parameters)),
          remainingA: formatNumber(remainingA),
          result: formatNumber(addedLiquid),
        },
        `${n(parameters, "initialVolume")}-${formatNumber(remainingA)}`,
      );
    }
    case "replacementOriginalPercentRemaining": {
      const remainingA = replacementOriginalRemaining(parameters);
      const percent = remainingA * 100 / n(parameters, "initialVolume");
      return numericResult(
        percent,
        "PERCENT",
        {
          setup: `${n(parameters, "initialVolume")}, remove ${n(parameters, "removedVolume")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber(replacementRetention(parameters)),
          remainingA: formatNumber(remainingA),
          result: formatNumber(percent),
        },
        `\\left(1-\\frac{${n(parameters, "removedVolume")}}{${n(parameters, "initialVolume")}}\\right)^{${n(parameters, "replacementCount")}}\\times100`,
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
    case "replacementRemovedVolumeFromFinalRatio": {
      const finalFraction = n(parameters, "finalRatioA") / (n(parameters, "finalRatioA") + n(parameters, "finalRatioB"));
      const removedVolume = n(parameters, "initialVolume") * (1 - Math.pow(finalFraction, 1 / n(parameters, "replacementCount")));
      return numericResult(
        removedVolume,
        "QUANTITY",
        {
          setup: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")} after ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber(Math.pow(finalFraction, 1 / n(parameters, "replacementCount"))),
          result: formatNumber(removedVolume),
        },
        `1-\\frac{x}{${n(parameters, "initialVolume")}}=\\left(\\frac{${n(parameters, "finalRatioA")}}{${n(parameters, "finalRatioA") + n(parameters, "finalRatioB")}}\\right)^{1/${n(parameters, "replacementCount")}}`,
      );
    }
    case "replacementDifferentRounds": {
      const retentionA = (n(parameters, "initialVolume") - n(parameters, "removedVolumeA")) / n(parameters, "initialVolume");
      const retentionB = (n(parameters, "initialVolume") - n(parameters, "removedVolumeB")) / n(parameters, "initialVolume");
      const remainingA = n(parameters, "initialVolume") * retentionA * retentionB;
      return numericResult(
        remainingA,
        "QUANTITY",
        {
          setup: `${n(parameters, "initialVolume")}, remove ${n(parameters, "removedVolumeA")} then ${n(parameters, "removedVolumeB")}`,
          retentionFactor: `${formatNumber(retentionA)}\\times${formatNumber(retentionB)}`,
          result: formatNumber(remainingA),
        },
        `${n(parameters, "initialVolume")}\\times\\left(1-\\frac{${n(parameters, "removedVolumeA")}}{${n(parameters, "initialVolume")}}\\right)\\times\\left(1-\\frac{${n(parameters, "removedVolumeB")}}{${n(parameters, "initialVolume")}}\\right)`,
      );
    }
    case "replacementTankSolution":
    case "replacementStrengthAfterRounds": {
      const retention = replacementRetention(parameters);
      const finalStrength = n(parameters, "addLiquidPercent") + (n(parameters, "initialPercent") - n(parameters, "addLiquidPercent")) * Math.pow(retention, n(parameters, "replacementCount"));
      return numericResult(
        finalStrength,
        "PERCENT",
        {
          setup: `${n(parameters, "initialPercent")}% to ${n(parameters, "addLiquidPercent")}%`,
          retentionFactor: formatNumber(retention),
          result: formatNumber(finalStrength),
        },
        `${n(parameters, "addLiquidPercent")}+(${n(parameters, "initialPercent")}-${n(parameters, "addLiquidPercent")})\\left(1-\\frac{${n(parameters, "removedVolume")}}{${n(parameters, "initialVolume")}}\\right)^{${n(parameters, "replacementCount")}}`,
      );
    }
    case "replacementInventoryAnalogy": {
      const remaining = n(parameters, "initialStock") * Math.pow((n(parameters, "initialStock") - n(parameters, "soldEachRound")) / n(parameters, "initialStock"), n(parameters, "replacementCount"));
      return numericResult(
        remaining,
        "QUANTITY",
        {
          setup: `${n(parameters, "initialStock")}, sold ${n(parameters, "soldEachRound")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: formatNumber((n(parameters, "initialStock") - n(parameters, "soldEachRound")) / n(parameters, "initialStock")),
          result: formatNumber(remaining),
        },
        `${n(parameters, "initialStock")}\\times\\left(1-\\frac{${n(parameters, "soldEachRound")}}{${n(parameters, "initialStock")}}\\right)^{${n(parameters, "replacementCount")}}`,
      );
    }
    case "replacementInitialFromFinalQuantity": {
      const retention = 1 - n(parameters, "removedFractionNumerator") / n(parameters, "removedFractionDenominator");
      const initial = n(parameters, "finalQuantity") / Math.pow(retention, n(parameters, "replacementCount"));
      return numericResult(
        initial,
        "QUANTITY",
        {
          setup: `Final ${n(parameters, "finalQuantity")}, retention ${formatNumber(retention)}`,
          retentionFactor: formatNumber(retention),
          result: formatNumber(initial),
        },
        `x\\times\\left(1-\\frac{${n(parameters, "removedFractionNumerator")}}{${n(parameters, "removedFractionDenominator")}}\\right)^{${n(parameters, "replacementCount")}}=${n(parameters, "finalQuantity")}`,
      );
    }
    case "replacementFinalAfterFractionRemoval": {
      const remainingUnits = Math.pow(n(parameters, "removedFractionDenominator") - n(parameters, "removedFractionNumerator"), n(parameters, "replacementCount"));
      const totalUnits = Math.pow(n(parameters, "removedFractionDenominator"), n(parameters, "replacementCount"));
      return ratioResult(
        [remainingUnits, totalUnits - remainingUnits],
        {
          setup: `Remove ${n(parameters, "removedFractionNumerator")}/${n(parameters, "removedFractionDenominator")} for ${n(parameters, "replacementCount")} rounds`,
          retentionFactor: `${n(parameters, "removedFractionDenominator") - n(parameters, "removedFractionNumerator")}/${n(parameters, "removedFractionDenominator")}`,
          result: simplifyRatio([remainingUnits, totalUnits - remainingUnits]).join(":"),
        },
        `(${n(parameters, "removedFractionDenominator")}-${n(parameters, "removedFractionNumerator")})^{${n(parameters, "replacementCount")}}:${n(parameters, "removedFractionDenominator")}^{${n(parameters, "replacementCount")}}-(${n(parameters, "removedFractionDenominator")}-${n(parameters, "removedFractionNumerator")})^{${n(parameters, "replacementCount")}}`,
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
    case "denominationTotalCountFromValue":
    case "denominationFourTypeTotalCount": {
      const weightedUnitValue = denominationWeightedUnitValue(parameters);
      const commonUnit = n(parameters, "totalValue") / weightedUnitValue;
      const ratioSum = n(parameters, "ratioA") + n(parameters, "ratioB") + n(parameters, "ratioC") + (parameters.variables.ratioD === undefined ? 0 : n(parameters, "ratioD"));
      const result = commonUnit * ratioSum;
      return numericResult(
        result,
        "COUNT",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(weightedUnitValue),
          commonUnit: formatNumber(commonUnit),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "totalValue")}}{${denominationCalculationDenominator(parameters)}}\\times${ratioSum}`,
      );
    }
    case "denominationTotalValueFromTotalCount": {
      const ratioSum = n(parameters, "ratioA") + n(parameters, "ratioB") + n(parameters, "ratioC");
      const commonUnit = n(parameters, "totalCount") / ratioSum;
      const result = commonUnit * denominationWeightedUnitValue(parameters);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(denominationWeightedUnitValue(parameters)),
          commonUnit: formatNumber(commonUnit),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "totalCount")}}{${ratioSum}}\\times(${denominationCalculationDenominator(parameters)})`,
      );
    }
    case "denominationValueRatio": {
      const values = parameters.variables.denominationD === undefined
        ? [n(parameters, "ratioA") * n(parameters, "denominationA"), n(parameters, "ratioB") * n(parameters, "denominationB"), n(parameters, "ratioC") * n(parameters, "denominationC")]
        : [n(parameters, "ratioA") * n(parameters, "denominationA"), n(parameters, "ratioB") * n(parameters, "denominationB"), n(parameters, "ratioC") * n(parameters, "denominationC"), n(parameters, "ratioD") * n(parameters, "denominationD")];
      return ratioResult(
        values,
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(denominationWeightedUnitValue(parameters)),
          result: simplifyRatio(values).join(":"),
        },
        values.map((value) => formatNumber(value)).join(":"),
      );
    }
    case "denominationAverageValue": {
      const ratioSum = n(parameters, "ratioA") + n(parameters, "ratioB") + n(parameters, "ratioC");
      const result = denominationWeightedUnitValue(parameters) / ratioSum;
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(denominationWeightedUnitValue(parameters)),
          result: formatNumber(result),
        },
        `\\frac{${denominationCalculationDenominator(parameters)}}{${ratioSum}}`,
      );
    }
    case "denominationMissingRatioPart": {
      const totalUnitValue = n(parameters, "totalValue") / n(parameters, "commonUnit");
      const knownValue = n(parameters, "ratioA") * n(parameters, "denominationA") + n(parameters, "ratioB") * n(parameters, "denominationB");
      const result = (totalUnitValue - knownValue) / n(parameters, "denominationC");
      return numericResult(
        result,
        "COUNT",
        {
          setup: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}:x at ${n(parameters, "denominationA")},${n(parameters, "denominationB")},${n(parameters, "denominationC")}`,
          weightedUnitValue: formatNumber(totalUnitValue),
          commonUnit: n(parameters, "commonUnit"),
          result: formatNumber(result),
        },
        `x=\\frac{${formatNumber(totalUnitValue)}-(${n(parameters, "ratioA")}\\times${n(parameters, "denominationA")}+${n(parameters, "ratioB")}\\times${n(parameters, "denominationB")})}{${n(parameters, "denominationC")}}`,
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
    case "ticketValueSystem":
    case "marksPerQuestionType": {
      const result = n(parameters, "commonUnit") * denominationWeightedUnitValue(parameters);
      return numericResult(
        result,
        "QUANTITY",
        {
          setup: denominationSetup(parameters),
          weightedUnitValue: formatNumber(denominationWeightedUnitValue(parameters)),
          commonUnit: n(parameters, "commonUnit"),
          result: formatNumber(result),
        },
        `${n(parameters, "commonUnit")}\\times(${denominationCalculationDenominator(parameters)})`,
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
    case "fixedDistanceSpeedTimeInverse":
    case "pipesTimeRatio": {
      return ratioResult(
        [n(parameters, "speedRatioB"), n(parameters, "speedRatioA")],
        { setup: `Rate=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`, result: simplifyRatio([n(parameters, "speedRatioB"), n(parameters, "speedRatioA")]).join(":") },
        `${n(parameters, "speedRatioB")}:${n(parameters, "speedRatioA")}`,
      );
    }
    case "fixedTimeSpeedDistanceDirect": {
      return ratioResult(
        [n(parameters, "speedRatioA"), n(parameters, "speedRatioB")],
        { setup: `Speed=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`, result: simplifyRatio([n(parameters, "speedRatioA"), n(parameters, "speedRatioB")]).join(":") },
        `${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`,
      );
    }
    case "sdtRaceLeadSpeedRatio": {
      const slowerDistance = n(parameters, "raceLength") - n(parameters, "leadDistance");
      return ratioResult(
        [n(parameters, "raceLength"), slowerDistance],
        { setup: `Race=${n(parameters, "raceLength")}, lead=${n(parameters, "leadDistance")}`, result: simplifyRatio([n(parameters, "raceLength"), slowerDistance]).join(":") },
        `${n(parameters, "raceLength")}:${slowerDistance}`,
      );
    }
    case "sdtRaceLeadTime": {
      return ratioResult(
        [n(parameters, "timeB"), n(parameters, "timeA")],
        { setup: `Times=${n(parameters, "timeA")}:${n(parameters, "timeB")}`, result: simplifyRatio([n(parameters, "timeB"), n(parameters, "timeA")]).join(":") },
        `${n(parameters, "timeB")}:${n(parameters, "timeA")}`,
      );
    }
    case "sdtOppositeDirectionMeeting": {
      const time = n(parameters, "distance") / (n(parameters, "speedA") + n(parameters, "speedB"));
      return numericResult(
        time,
        "TIME",
        { setup: `Distance=${n(parameters, "distance")}, speeds=${n(parameters, "speedA")}+${n(parameters, "speedB")}`, relativeSpeed: n(parameters, "speedA") + n(parameters, "speedB"), result: formatNumber(time) },
        `\\frac{${n(parameters, "distance")}}{${n(parameters, "speedA")}+${n(parameters, "speedB")}}`,
      );
    }
    case "trainPlatformRatio": {
      const timeA = n(parameters, "lengthRatioA") * n(parameters, "speedRatioB");
      const timeB = n(parameters, "lengthRatioB") * n(parameters, "speedRatioA");
      return ratioResult(
        [timeA, timeB],
        { setup: `Length=${n(parameters, "lengthRatioA")}:${n(parameters, "lengthRatioB")}, speed=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`, result: simplifyRatio([timeA, timeB]).join(":") },
        `\\frac{${n(parameters, "lengthRatioA")}}{${n(parameters, "speedRatioA")}}:\\frac{${n(parameters, "lengthRatioB")}}{${n(parameters, "speedRatioB")}}`,
      );
    }
    case "workEfficiencyTimeRatio":
    case "sameWorkTwoTeams": {
      const rateA = n(parameters, "workerRatioA") * n(parameters, "efficiencyRatioA");
      const rateB = n(parameters, "workerRatioB") * n(parameters, "efficiencyRatioB");
      return ratioResult(
        [rateB * n(parameters, "workRatioA"), rateA * n(parameters, "workRatioB")],
        { setup: `Rate=${rateA}:${rateB}, work=${n(parameters, "workRatioA")}:${n(parameters, "workRatioB")}`, result: simplifyRatio([rateB * n(parameters, "workRatioA"), rateA * n(parameters, "workRatioB")]).join(":") },
        `\\frac{${n(parameters, "workRatioA")}}{${rateA}}:\\frac{${n(parameters, "workRatioB")}}{${rateB}}`,
      );
    }
    case "machinesOutputTime":
    case "workersEfficiencyDays": {
      const outputA = n(parameters, "machineRatioA") * n(parameters, "timeRatioA") * n(parameters, "efficiencyRatioA");
      const outputB = n(parameters, "machineRatioB") * n(parameters, "timeRatioB") * n(parameters, "efficiencyRatioB");
      return ratioResult(
        [outputA, outputB],
        { setup: `Output factors`, result: simplifyRatio([outputA, outputB]).join(":") },
        `${outputA}:${outputB}`,
      );
    }
    case "findMissingRateFromOutput": {
      const rateA = n(parameters, "outputRatioA") * n(parameters, "timeRatioB");
      const rateB = n(parameters, "outputRatioB") * n(parameters, "timeRatioA");
      return ratioResult(
        [rateA, rateB],
        { setup: `Output=${n(parameters, "outputRatioA")}:${n(parameters, "outputRatioB")}, time=${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`, result: simplifyRatio([rateA, rateB]).join(":") },
        `\\frac{${n(parameters, "outputRatioA")}}{${n(parameters, "timeRatioA")}}:\\frac{${n(parameters, "outputRatioB")}}{${n(parameters, "timeRatioB")}}`,
      );
    }
    case "timeSavedByHigherSpeed": {
      const newTime = n(parameters, "oldTime") * n(parameters, "speedRatioA") / n(parameters, "speedRatioB");
      const saved = n(parameters, "oldTime") - newTime;
      return numericResult(
        saved,
        "TIME",
        { setup: `Speed=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}, old time=${n(parameters, "oldTime")}`, result: formatNumber(saved) },
        `${n(parameters, "oldTime")}-${n(parameters, "oldTime")}\\times\\frac{${n(parameters, "speedRatioA")}}{${n(parameters, "speedRatioB")}}`,
      );
    }
    case "distanceSlowerCoversWhenFasterFinishes": {
      const distance = n(parameters, "trackDistance") * n(parameters, "speedRatioB") / n(parameters, "speedRatioA");
      return numericResult(
        distance,
        "QUANTITY",
        { setup: `Track=${n(parameters, "trackDistance")}, speed=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`, result: formatNumber(distance) },
        `${n(parameters, "trackDistance")}\\times\\frac{${n(parameters, "speedRatioB")}}{${n(parameters, "speedRatioA")}}`,
      );
    }
    case "rateProductAbsoluteOutput": {
      const outputB = n(parameters, "outputA") * n(parameters, "rateRatioB") * n(parameters, "timeRatioB") * n(parameters, "unitRatioB")
        / (n(parameters, "rateRatioA") * n(parameters, "timeRatioA") * n(parameters, "unitRatioA"));
      return numericResult(
        outputB,
        "QUANTITY",
        { setup: `Rate-time-unit product`, result: formatNumber(outputB) },
        `${n(parameters, "outputA")}\\times\\frac{${n(parameters, "rateRatioB")}\\times${n(parameters, "timeRatioB")}\\times${n(parameters, "unitRatioB")}}{${n(parameters, "rateRatioA")}\\times${n(parameters, "timeRatioA")}\\times${n(parameters, "unitRatioA")}}`,
      );
    }
    case "relativeSpeedRatioFromOvertake": {
      const relative = n(parameters, "leadDistance") * 18 / (5 * n(parameters, "overtakeTime"));
      return numericResult(
        relative,
        "QUANTITY",
        { setup: `Lead=${n(parameters, "leadDistance")}, time=${n(parameters, "overtakeTime")}`, result: formatNumber(relative) },
        `\\frac{${n(parameters, "leadDistance")}}{${n(parameters, "overtakeTime")}}\\times\\frac{18}{5}`,
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
    case "populationCellPercentOfTotal": {
      const result = populationCellValue(parameters, s(parameters, "targetCellLabel")) * 100 / n(parameters, "totalPopulation");
      return numericResult(
        result,
        "PERCENT",
        {
          setup: `Target=${s(parameters, "targetCellLabel")}`,
          targetCell: formatNumber(populationCellValue(parameters, s(parameters, "targetCellLabel"))),
          result: formatNumber(result),
        },
        `\\frac{${formatNumber(populationCellValue(parameters, s(parameters, "targetCellLabel")))}}{${n(parameters, "totalPopulation")}}\\times100`,
      );
    }
    case "populationRecoverTotalFromCell": {
      const unitCell = populationCellValue({ ...parameters, variables: { ...parameters.variables, totalPopulation: 1 } }, s(parameters, "knownCellLabel"));
      const result = n(parameters, "knownCellValue") / unitCell;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Known ${s(parameters, "knownCellLabel")}=${n(parameters, "knownCellValue")}`,
          unitCell: formatNumber(unitCell),
          result: formatNumber(result),
        },
        `\\frac{${n(parameters, "knownCellValue")}}{${formatNumber(unitCell)}}`,
      );
    }
    case "populationMissingRowTotal": {
      const cells = populationCells(parameters);
      const result = cells.literateMales;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `Total literates=${formatNumber(cells.literateMales + cells.literateFemales)}`,
          literateMales: formatNumber(cells.literateMales),
          literateFemales: formatNumber(cells.literateFemales),
          result: formatNumber(result),
        },
        `${formatNumber(cells.literateMales + cells.literateFemales)}-${formatNumber(cells.literateFemales)}`,
      );
    }
    case "populationDifferenceBetweenCells":
    case "populationMiniCaseletQuestion1": {
      const first = populationCellValue(parameters, s(parameters, "ratioCellA"));
      const second = populationCellValue(parameters, s(parameters, "ratioCellB"));
      const result = Math.abs(first - second);
      return numericResult(
        result,
        "COUNT",
        {
          setup: `${s(parameters, "ratioCellA")} and ${s(parameters, "ratioCellB")}`,
          first: formatNumber(first),
          second: formatNumber(second),
          result: formatNumber(result),
        },
        `|${formatNumber(first)}-${formatNumber(second)}|`,
      );
    }
    case "populationSumOfSelectedCells": {
      const first = populationCellValue(parameters, s(parameters, "ratioCellA"));
      const second = populationCellValue(parameters, s(parameters, "ratioCellB"));
      const result = first + second;
      return numericResult(
        result,
        "COUNT",
        {
          setup: `${s(parameters, "ratioCellA")} and ${s(parameters, "ratioCellB")}`,
          first: formatNumber(first),
          second: formatNumber(second),
          result: formatNumber(result),
        },
        `${formatNumber(first)}+${formatNumber(second)}`,
      );
    }
    case "populationThreeRows": {
      const groupA = n(parameters, "totalPopulation") * n(parameters, "ratioA") / (n(parameters, "ratioA") + n(parameters, "ratioB") + n(parameters, "ratioC"));
      const result = groupA * n(parameters, "passRatioA") / (n(parameters, "passRatioA") + n(parameters, "failRatioA"));
      return numericResult(
        result,
        "COUNT",
        {
          setup: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}:${n(parameters, "ratioC")}`,
          groupA: formatNumber(groupA),
          result: formatNumber(result),
        },
        `${formatNumber(groupA)}\\times\\frac{${n(parameters, "passRatioA")}}{${n(parameters, "passRatioA") + n(parameters, "failRatioA")}}`,
      );
    }
    case "populationMiniCaseletQuestion2":
    case "populationColumnRatioGiven":
    case "populationTableValidationTrap": {
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
    case "electionPolledVotesFromTurnout": {
      const result = electionPolledVotes(parameters);
      return numericResult(result, "COUNT", { setup: `Voters=${n(parameters, "totalVoters")}, turnout=${n(parameters, "turnoutPercent")}%`, result: formatNumber(result) }, `${n(parameters, "totalVoters")}\\times\\frac{${n(parameters, "turnoutPercent")}}{100}`);
    }
    case "electionValidVotesFromInvalidRate": {
      const result = n(parameters, "polledVotes") * (100 - n(parameters, "invalidPercent")) / 100;
      return numericResult(result, "COUNT", { setup: `Polled=${n(parameters, "polledVotes")}, invalid=${n(parameters, "invalidPercent")}%`, result: formatNumber(result) }, `${n(parameters, "polledVotes")}\\times\\frac{${100 - n(parameters, "invalidPercent")}}{100}`);
    }
    case "electionWinnerFromMarginAndValidVotes": {
      const result = (n(parameters, "totalValidVotes") + n(parameters, "winningMargin")) / 2;
      return numericResult(result, "COUNT", { setup: `Valid=${n(parameters, "totalValidVotes")}, margin=${n(parameters, "winningMargin")}`, result: formatNumber(result) }, `\\frac{${n(parameters, "totalValidVotes")}+${n(parameters, "winningMargin")}}{2}`);
    }
    case "electionLoserFromMarginAndValidVotes": {
      const result = (n(parameters, "totalValidVotes") - n(parameters, "winningMargin")) / 2;
      return numericResult(result, "COUNT", { setup: `Valid=${n(parameters, "totalValidVotes")}, margin=${n(parameters, "winningMargin")}`, result: formatNumber(result) }, `\\frac{${n(parameters, "totalValidVotes")}-${n(parameters, "winningMargin")}}{2}`);
    }
    case "electionThreeCandidateSplit": {
      const maxRatio = Math.max(n(parameters, "candidateRatioA"), n(parameters, "candidateRatioB"), n(parameters, "candidateRatioC"));
      const ratioSum = n(parameters, "candidateRatioA") + n(parameters, "candidateRatioB") + n(parameters, "candidateRatioC");
      const result = n(parameters, "totalValidVotes") * maxRatio / ratioSum;
      return numericResult(result, "COUNT", { setup: `Valid=${n(parameters, "totalValidVotes")}, split=${n(parameters, "candidateRatioA")}:${n(parameters, "candidateRatioB")}:${n(parameters, "candidateRatioC")}`, result: formatNumber(result) }, `${n(parameters, "totalValidVotes")}\\times\\frac{${maxRatio}}{${ratioSum}}`);
    }
    case "electionCandidateSharePercent":
    case "electionMarginAsPercentOfValid": {
      const ratioSum = electionRatioSum(parameters);
      const result = parameters.taskKind === "electionCandidateSharePercent"
        ? electionWinnerRatio(parameters) * 100 / ratioSum
        : (electionWinnerRatio(parameters) - electionLoserRatio(parameters)) * 100 / ratioSum;
      return numericResult(result, "PERCENT", { setup: `Split=${n(parameters, "candidateRatioA")}:${n(parameters, "candidateRatioB")}`, result: formatNumber(result) }, `\\frac{${parameters.taskKind === "electionCandidateSharePercent" ? electionWinnerRatio(parameters) : electionWinnerRatio(parameters) - electionLoserRatio(parameters)}}{${ratioSum}}\\times100`);
    }
    case "electionRatioFromVoteSharePercent": {
      return ratioResult(
        [n(parameters, "percentA"), n(parameters, "percentB")],
        { setup: `${n(parameters, "percentA")}%:${n(parameters, "percentB")}%`, result: simplifyRatio([n(parameters, "percentA"), n(parameters, "percentB")]).join(":") },
        `${n(parameters, "percentA")}:${n(parameters, "percentB")}`,
      );
    }
    case "electionOneCandidateMorePercent": {
      const result = n(parameters, "totalValidVotes") * (100 + n(parameters, "morePercent")) / (200 + n(parameters, "morePercent"));
      return numericResult(result, "COUNT", { setup: `Valid=${n(parameters, "totalValidVotes")}, more=${n(parameters, "morePercent")}%`, result: formatNumber(result) }, `${n(parameters, "totalValidVotes")}\\times\\frac{${100 + n(parameters, "morePercent")}}{${200 + n(parameters, "morePercent")}}`);
    }
    case "electionTotalElectorateFromCandidateVotes": {
      const validVotes = n(parameters, "candidateVotes") * electionRatioSum(parameters) / electionWinnerRatio(parameters);
      const polledVotes = validVotes * 100 / n(parameters, "validPercent");
      const result = polledVotes * 100 / n(parameters, "turnoutPercent");
      return numericResult(result, "COUNT", { setup: `Candidate votes=${n(parameters, "candidateVotes")}`, validVotes: formatNumber(validVotes), result: formatNumber(result) }, `${n(parameters, "candidateVotes")}\\times\\frac{${electionRatioSum(parameters)}}{${electionWinnerRatio(parameters)}}`);
    }
    case "marketShareWinner": {
      const result = n(parameters, "totalMarket") * electionWinnerRatio(parameters) / electionRatioSum(parameters);
      return numericResult(result, "QUANTITY", { setup: `Market=${n(parameters, "totalMarket")}, split=${n(parameters, "candidateRatioA")}:${n(parameters, "candidateRatioB")}`, result: formatNumber(result) }, `${n(parameters, "totalMarket")}\\times\\frac{${electionWinnerRatio(parameters)}}{${electionRatioSum(parameters)}}`);
    }
    case "surveyResponseShare": {
      const result = n(parameters, "totalResponses") * n(parameters, "candidateRatioA") / electionRatioSum(parameters);
      return numericResult(result, "COUNT", { setup: `Responses=${n(parameters, "totalResponses")}`, result: formatNumber(result) }, `${n(parameters, "totalResponses")}\\times\\frac{${n(parameters, "candidateRatioA")}}{${electionRatioSum(parameters)}}`);
    }
    case "electionNotaInvalidStyle": {
      const polledVotes = electionPolledVotes(parameters);
      const result = polledVotes * n(parameters, "notaPercent") / 100;
      return numericResult(result, "COUNT", { setup: `Polled=${formatNumber(polledVotes)}, NOTA=${n(parameters, "notaPercent")}%`, result: formatNumber(result) }, `${formatNumber(polledVotes)}\\times\\frac{${n(parameters, "notaPercent")}}{100}`);
    }
    case "electionReverseTurnoutFromValidVotes": {
      const polledVotes = n(parameters, "totalValidVotes") * 100 / n(parameters, "validPercent");
      const result = polledVotes * 100 / n(parameters, "totalVoters");
      return numericResult(result, "PERCENT", { setup: `Valid=${n(parameters, "totalValidVotes")}, valid percent=${n(parameters, "validPercent")}%`, polledVotes: formatNumber(polledVotes), result: formatNumber(result) }, `\\frac{${formatNumber(polledVotes)}}{${n(parameters, "totalVoters")}}\\times100`);
    }
    case "electionMarginDifferenceChain": {
      const validVotes = n(parameters, "winningMargin") * electionRatioSum(parameters) / (electionWinnerRatio(parameters) - electionLoserRatio(parameters));
      const polledVotes = validVotes * 100 / (100 - n(parameters, "invalidPercent"));
      const result = polledVotes * 100 / n(parameters, "turnoutPercent");
      return numericResult(result, "COUNT", { setup: `Margin=${n(parameters, "winningMargin")}, invalid=${n(parameters, "invalidPercent")}%`, validVotes: formatNumber(validVotes), result: formatNumber(result) }, `${n(parameters, "winningMargin")}\\times\\frac{${electionRatioSum(parameters)}}{${electionWinnerRatio(parameters)}-${electionLoserRatio(parameters)}}`);
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
    case "mapScaleAreaRatio": {
      return ratioResult(
        [n(parameters, "scaleRatioA") ** 2, n(parameters, "scaleRatioB") ** 2],
        {
          setup: `Length scale=${n(parameters, "scaleRatioA")}:${n(parameters, "scaleRatioB")}`,
          result: simplifyRatio([n(parameters, "scaleRatioA") ** 2, n(parameters, "scaleRatioB") ** 2]).join(":"),
        },
        `${n(parameters, "scaleRatioA")}^2:${n(parameters, "scaleRatioB")}^2`,
      );
    }
    case "mapScaleLengthFromArea": {
      const scaleA = Math.sqrt(n(parameters, "areaRatioA"));
      const scaleB = Math.sqrt(n(parameters, "areaRatioB"));
      return ratioResult(
        [scaleA, scaleB],
        {
          setup: `Map area=${n(parameters, "areaRatioA")}:${n(parameters, "areaRatioB")}`,
          scaleA: formatNumber(scaleA),
          scaleB: formatNumber(scaleB),
          result: simplifyRatio([scaleA, scaleB]).join(":"),
        },
        `\\sqrt{${n(parameters, "areaRatioA")}}:\\sqrt{${n(parameters, "areaRatioB")}}`,
      );
    }
    case "similarSolidSurfaceToVolume": {
      const sideA = Math.sqrt(n(parameters, "surfaceAreaRatioA"));
      const sideB = Math.sqrt(n(parameters, "surfaceAreaRatioB"));
      return ratioResult(
        [sideA ** 3, sideB ** 3],
        {
          setup: `Surface area=${n(parameters, "surfaceAreaRatioA")}:${n(parameters, "surfaceAreaRatioB")}`,
          sideRatio: `${formatNumber(sideA)}:${formatNumber(sideB)}`,
          result: simplifyRatio([sideA ** 3, sideB ** 3]).join(":"),
        },
        `(\\sqrt{${n(parameters, "surfaceAreaRatioA")}})^3:(\\sqrt{${n(parameters, "surfaceAreaRatioB")}})^3`,
      );
    }
    case "geometricPowerMixedStatement": {
      return ratioResult(
        [n(parameters, "sideRatioA") ** 3, n(parameters, "sideRatioB") ** 3],
        {
          setup: `Side=${n(parameters, "sideRatioA")}:${n(parameters, "sideRatioB")}`,
          result: simplifyRatio([n(parameters, "sideRatioA") ** 3, n(parameters, "sideRatioB") ** 3]).join(":"),
        },
        `${n(parameters, "sideRatioA")}^3:${n(parameters, "sideRatioB")}^3`,
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
    case "ageYearsToReachPastRatio": {
      const presentAgeA = n(parameters, "presentAgeA");
      const presentAgeB = n(parameters, "presentAgeB");
      const pastA = n(parameters, "pastRatioA");
      const pastB = n(parameters, "pastRatioB");
      const years = (pastA * presentAgeB - pastB * presentAgeA) / (pastA - pastB);
      return numericResult(
        years,
        "TIME",
        {
          setup: `${presentAgeA}:${presentAgeB} <- ${pastA}:${pastB}`,
          presentAgeA,
          presentAgeB,
          pastRatio: ratioLatex([pastA, pastB]),
          result: formatNumber(years),
        },
        `\\frac{${presentAgeA}-y}{${presentAgeB}-y}=\\frac{${pastA}}{${pastB}}`,
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
    case "ageThreePersonKnownAge": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const ratioC = n(parameters, "ratioC");
      const known = s(parameters, "knownPerson");
      const target = s(parameters, "targetPerson");
      const knownRatio = known === s(parameters, "personC") ? ratioC : known === s(parameters, "personB") ? ratioB : ratioA;
      const targetRatio = target === s(parameters, "personC") ? ratioC : target === s(parameters, "personB") ? ratioB : ratioA;
      const unit = n(parameters, "knownAge") / knownRatio;
      const result = targetRatio * unit;
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}:${ratioC}`,
          unit: formatNumber(unit),
          knownPerson: known,
          knownAge: n(parameters, "knownAge"),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          presentAgeC: formatNumber(ratioC * unit),
          targetPerson: target,
          result: formatNumber(result),
        },
        `${knownRatio}x=${n(parameters, "knownAge")}`,
      );
    }
    case "ageAverageAndRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const ageSum = n(parameters, "averageAge") * 2;
      const unit = ageSum / (ratioA + ratioB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}, average=${n(parameters, "averageAge")}`,
          unit: formatNumber(unit),
          ageSum: formatNumber(ageSum),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${ratioA + ratioB}x=${formatNumber(ageSum)}`,
      );
    }
    case "ageAverageThreePersonRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const ratioC = n(parameters, "ratioC");
      const ageSum = n(parameters, "averageAge") * 3;
      const unit = ageSum / (ratioA + ratioB + ratioC);
      const target = s(parameters, "targetPerson");
      const targetRatio = target === s(parameters, "personC") ? ratioC : target === s(parameters, "personB") ? ratioB : ratioA;
      const result = targetRatio * unit;
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}:${ratioC}, average=${n(parameters, "averageAge")}`,
          unit: formatNumber(unit),
          ageSum: formatNumber(ageSum),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          presentAgeC: formatNumber(ratioC * unit),
          targetPerson: target,
          result: formatNumber(result),
        },
        `${ratioA + ratioB + ratioC}x=${formatNumber(ageSum)}`,
      );
    }
    case "ageFutureSumAndPresentRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const shift = n(parameters, "shiftYears");
      const unit = (n(parameters, "futureSum") - 2 * shift) / (ratioA + ratioB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}, future sum=${n(parameters, "futureSum")}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${ratioA + ratioB}x+2\\times${shift}=${n(parameters, "futureSum")}`,
      );
    }
    case "agePastSumAndPresentRatio": {
      const ratioA = n(parameters, "ratioA");
      const ratioB = n(parameters, "ratioB");
      const shift = n(parameters, "shiftYears");
      const unit = (n(parameters, "pastSum") + 2 * shift) / (ratioA + ratioB);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${ratioA}:${ratioB}, past sum=${n(parameters, "pastSum")}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(ratioA * unit),
          presentAgeB: formatNumber(ratioB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${ratioA + ratioB}x-2\\times${shift}=${n(parameters, "pastSum")}`,
      );
    }
    case "ageDoubleHalfWording": {
      const presentA = n(parameters, "ratioA");
      const presentB = n(parameters, "ratioB");
      const shift = n(parameters, "shiftYears");
      const factor = n(parameters, "relationFactor");
      const unit = shift * (1 - factor) / (factor * presentB - presentA);
      const result = targetAge(parameters, unit);
      return numericResult(
        result,
        "AGE",
        {
          setup: `${presentA}:${presentB}, after ${shift} years ${s(parameters, "personA")}=${factor} times ${s(parameters, "personB")}`,
          unit: formatNumber(unit),
          presentAgeA: formatNumber(presentA * unit),
          presentAgeB: formatNumber(presentB * unit),
          targetPerson: s(parameters, "targetPerson"),
          result: formatNumber(result),
        },
        `${presentA}x+${shift}=${factor}(${presentB}x+${shift})`,
      );
    }
    default:
      throw new Error(`RAP-003 solver missing for taskKind: ${parameters.taskKind}`);
  }
}
