import { formatAnswer, formatRatio, mathJaxLine, ratioFromDecimals, ratioFromFractions, roundTo, simplifyRatio } from "./math";
import type { Rap001Parameters, Rap001SolverResult } from "./types";

function value(parameters: Rap001Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function asString(parameters: Rap001Parameters, name: string) {
  return String(parameters.variables[name]);
}

export function solveRap001(parameters: Rap001Parameters): Rap001SolverResult {
  let answerValue: string | number = 0;
  let workingValues: Record<string, string | number> = {};
  let evidence: Record<string, string | number> = { taskKind: parameters.taskKind, answerType: parameters.answerType };
  let mathJax: Record<string, string> = {};

  switch (parameters.taskKind) {
    case "simpleLinkage": {
      const linked = simplifyRatio([value(parameters, "ratioA1") * value(parameters, "ratioB2"), value(parameters, "ratioB1") * value(parameters, "ratioB2"), value(parameters, "ratioB1") * value(parameters, "ratioC2")]);
      answerValue = linked.join(":");
      workingValues = { linkedA: linked[0]!, linkedB: linked[1]!, linkedC: linked[2]! };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "A:B = a:b, B:C = m:n"),
        calculationLatex: mathJaxLine("calculation", `${linked[0]}:${linked[1]}:${linked[2]}`),
      };
      break;
    }
    case "ratioNormalization": {
      const linked = ratioFromFractions(value(parameters, "numerator1"), value(parameters, "denominator1"), value(parameters, "numerator2"), value(parameters, "denominator2"));
      answerValue = linked.join(":");
      workingValues = { normalizedLeft: linked[0]!, normalizedRight: linked[1]! };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{a}{b}:\\frac{c}{d} = ad:bc"),
        calculationLatex: mathJaxLine("calculation", `${linked[0]}:${linked[1]}`),
      };
      break;
    }
    case "ratioTreeLinkage": {
      const linked = simplifyRatio([
        value(parameters, "ratioA") * value(parameters, "ratioB_prime") * value(parameters, "ratioC_prime"),
        value(parameters, "ratioB") * value(parameters, "ratioC") * value(parameters, "ratioD"),
      ]);
      answerValue = linked.join(":");
      workingValues = { ratioPersonAToPersonD: `${linked[0]}:${linked[1]}` };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{A}{B} \\times \\frac{B}{C} \\times \\frac{C}{D} = \\frac{A}{D}"),
        calculationLatex: mathJaxLine("calculation", `${linked[0]}:${linked[1]}`),
      };
      break;
    }
    case "scalingByComponent": {
      answerValue = value(parameters, "valueA") * value(parameters, "ratioB") / value(parameters, "ratioA");
      workingValues = { unitValue: value(parameters, "valueA") / value(parameters, "ratioA") };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "A:B = a:b"),
        calculationLatex: mathJaxLine("calculation", `${value(parameters, "valueA")} \\times ${value(parameters, "ratioB")} / ${value(parameters, "ratioA")} = ${answerValue}`),
      };
      break;
    }
    case "decimalNormalization": {
      const linked = ratioFromDecimals(value(parameters, "decimalA"), value(parameters, "decimalB"));
      answerValue = linked.join(":");
      workingValues = { normalizedLeft: linked[0]!, normalizedRight: linked[1]! };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "scale decimals to whole numbers"),
        calculationLatex: mathJaxLine("calculation", `${linked[0]}:${linked[1]}`),
      };
      break;
    }
    case "basicPartition": {
      const ratios = [value(parameters, "ratioA"), value(parameters, "ratioB"), value(parameters, "ratioC")];
      const names = [asString(parameters, "personA"), asString(parameters, "personB"), asString(parameters, "personC")];
      const targetName = asString(parameters, "targetPerson");
      const targetIndex = names.indexOf(targetName);
      const unitValue = value(parameters, "totalAmount") / ratios.reduce((sum, part) => sum + part, 0);
      answerValue = unitValue * ratios[targetIndex]!;
      workingValues = { unitValue, targetIndex };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "share = total \\times ratioPart / ratioSum"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "shareDifference": {
      const sum = value(parameters, "ratioA") + value(parameters, "ratioB") + value(parameters, "ratioC");
      const unitValue = value(parameters, "totalAmount") / sum;
      answerValue = unitValue * (value(parameters, "ratioA") - value(parameters, "ratioC"));
      workingValues = { unitValue };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "(A-C) \\times unit"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "reversePartition": {
      const unitValue = value(parameters, "shareDifference") / (value(parameters, "ratioA") - value(parameters, "ratioC"));
      answerValue = unitValue * (value(parameters, "ratioA") + value(parameters, "ratioB") + value(parameters, "ratioC"));
      workingValues = { unitValue };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "difference = (A-C) \\times unit"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "salaryDistribution": {
      const unitValue = value(parameters, "totalSalary") / (value(parameters, "ratioExp") + value(parameters, "ratioSav"));
      answerValue = unitValue * value(parameters, "ratioSav");
      workingValues = { unitValue };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "salary parts = expense + saving"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "twoStateAddition": {
      const numerator = value(parameters, "addedCount") * value(parameters, "finalRatioB");
      const denominator = value(parameters, "ratioB") * value(parameters, "finalRatioA") - value(parameters, "ratioA") * value(parameters, "finalRatioB");
      const x = numerator / denominator;
      answerValue = value(parameters, "ratioA") * x;
      workingValues = { x };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{ax+p}{bx} = \\frac{c}{d}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "twoStateSubtraction": {
      const numerator = value(parameters, "removedCount") * value(parameters, "finalRatioB");
      const denominator = value(parameters, "ratioA") * value(parameters, "finalRatioB") - value(parameters, "ratioB") * value(parameters, "finalRatioA");
      const x = numerator / denominator;
      answerValue = (value(parameters, "ratioA") + value(parameters, "ratioB")) * x;
      workingValues = { x };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{ax-p}{bx} = \\frac{c}{d}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "twoStateTransfer": {
      const numerator = value(parameters, "transferredCount") * (value(parameters, "finalRatioA") - value(parameters, "finalRatioB"));
      const denominator = value(parameters, "ratioA") * value(parameters, "finalRatioB") - value(parameters, "ratioB") * value(parameters, "finalRatioA");
      const x = numerator / denominator;
      answerValue = Math.max(value(parameters, "ratioA"), value(parameters, "ratioB")) * x;
      workingValues = { x };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{ax+p}{bx+p} = \\frac{c}{d}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "incomeExpenditureSystem": {
      const numerator = (value(parameters, "expRatioB") - value(parameters, "expRatioA")) * value(parameters, "savingsAmount");
      const denominator = value(parameters, "incomeRatioA") * value(parameters, "expRatioB") - value(parameters, "incomeRatioB") * value(parameters, "expRatioA");
      const x = numerator / denominator;
      answerValue = value(parameters, "incomeRatioA") * x;
      workingValues = { x, ratioA: value(parameters, "incomeRatioA"), ratioB: value(parameters, "incomeRatioB") };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "px-my=s, qx-ny=s"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "multiStageTransformation": {
      const numerator = value(parameters, "finalRatioA") * value(parameters, "removedCount") + value(parameters, "finalRatioB") * value(parameters, "addedCount");
      const denominator = value(parameters, "ratioB") * value(parameters, "finalRatioA") - value(parameters, "ratioA") * value(parameters, "finalRatioB");
      const x = numerator / denominator;
      answerValue = value(parameters, "ratioB") * x;
      workingValues = { x };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{ax+p}{bx-q} = \\frac{c}{d}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "meanProportional": {
      answerValue = Math.sqrt(value(parameters, "numA") * value(parameters, "numB"));
      evidence = { ...evidence, product: value(parameters, "numA") * value(parameters, "numB") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "x^2 = ab"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "thirdProportional": {
      answerValue = value(parameters, "numB") * value(parameters, "numB") / value(parameters, "numA");
      evidence = { ...evidence, square: value(parameters, "numB") * value(parameters, "numB") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "a:b = b:x"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "fourthProportional": {
      answerValue = value(parameters, "numB") * value(parameters, "numC") / value(parameters, "numA");
      evidence = { ...evidence, product: value(parameters, "numB") * value(parameters, "numC") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "a:b = c:x"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "directVariation": {
      answerValue = value(parameters, "varY1") * value(parameters, "varX2") / value(parameters, "varX1");
      evidence = { ...evidence, constant: value(parameters, "varY1") / value(parameters, "varX1") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "y/x = constant"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "inverseVariation": {
      answerValue = value(parameters, "varY1") * value(parameters, "varX1") / value(parameters, "varX2");
      evidence = { ...evidence, constant: value(parameters, "varY1") * value(parameters, "varX1") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "xy = constant"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "coinCounting": {
      const ratioValues = [value(parameters, "ratio1"), value(parameters, "ratio2"), value(parameters, "ratio3")];
      const denomValues = [value(parameters, "denom1"), value(parameters, "denom2"), value(parameters, "denom3")];
      const targetDenom = value(parameters, "targetDenom");
      const valuePerUnit = ratioValues.reduce((sum, ratio, index) => sum + ratio * denomValues[index]!, 0);
      const unit = value(parameters, "totalValue") / valuePerUnit;
      const targetIndex = denomValues.indexOf(targetDenom);
      answerValue = ratioValues[targetIndex]! * unit;
      workingValues = { unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "total value = k(r_1d_1 + r_2d_2 + r_3d_3)"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "multiDenominationMapping": {
      const denomValues = [value(parameters, "denom1"), value(parameters, "denom2"), value(parameters, "denom3"), value(parameters, "denom4")];
      const valueRatios = [value(parameters, "valRatio1"), value(parameters, "valRatio2"), value(parameters, "valRatio3"), value(parameters, "valRatio4")];
      const countWeightsRaw = valueRatios.map((ratio, index) => ratio / denomValues[index]!);
      const scale = 10 ** Math.max(...countWeightsRaw.map((value) => {
        const text = String(value);
        const dot = text.indexOf(".");
        return dot === -1 ? 0 : text.length - dot - 1;
      }));
      const countWeights = simplifyRatio(countWeightsRaw.map((value) => Math.round(value * scale)));
      const unit = value(parameters, "totalCoins") / countWeights.reduce((sum, weight) => sum + weight, 0);
      const targetIndex = denomValues.indexOf(value(parameters, "targetDenom"));
      answerValue = countWeights[targetIndex]! * unit;
      workingValues = { countWeight1: countWeights[0]!, countWeight2: countWeights[1]!, countWeight3: countWeights[2]!, countWeight4: countWeights[3]!, unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "count ratio = value ratio / denomination"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "weightedMapping": {
      const totalWeightedUnits =
        value(parameters, "countA") * value(parameters, "ratioA") +
        value(parameters, "countB") * value(parameters, "ratioB") +
        value(parameters, "countC") * value(parameters, "ratioC");
      const unit = value(parameters, "totalWeight") / totalWeightedUnits;
      answerValue = unit * value(parameters, "ratioA");
      workingValues = { unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "total = unit(c_1r_1 + c_2r_2 + c_3r_3)"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "weightedMarks": {
      const totalWeightedUnits =
        value(parameters, "ratio1") * value(parameters, "w1") +
        value(parameters, "ratio2") * value(parameters, "w2") +
        value(parameters, "ratio3") * value(parameters, "w3");
      const unit = value(parameters, "totalScore") / totalWeightedUnits;
      answerValue = unit * value(parameters, "ratio1");
      workingValues = { unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "weighted total = unit(r_1w_1 + r_2w_2 + r_3w_3)"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "binaryMixture": {
      const numerator = value(parameters, "addedAmount") * value(parameters, "finalRatio2");
      const denominator = value(parameters, "ratio2") * value(parameters, "finalRatio1") - value(parameters, "ratio1") * value(parameters, "finalRatio2");
      const unit = numerator / denominator;
      answerValue = unit * value(parameters, "ratio2");
      workingValues = { unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{r_1x + a}{r_2x} = \\frac{f_1}{f_2}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "mixtureComponentFinding": {
      const initial1 = value(parameters, "totalVolume") * value(parameters, "ratio1") / (value(parameters, "ratio1") + value(parameters, "ratio2"));
      const initial2 = value(parameters, "totalVolume") * value(parameters, "ratio2") / (value(parameters, "ratio1") + value(parameters, "ratio2"));
      answerValue = initial1 * value(parameters, "finalRatio2") / value(parameters, "finalRatio1") - initial2;
      workingValues = { initial1, initial2 };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "\\frac{A}{B+x} = \\frac{f_1}{f_2}"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "threeComponentMixture": {
      const denominator = value(parameters, "ratio1") * value(parameters, "finalRatio2") / value(parameters, "finalRatio1") - value(parameters, "ratio2");
      const unit = value(parameters, "addedAmount") / denominator;
      answerValue = unit * (value(parameters, "ratio1") + value(parameters, "ratio2") + value(parameters, "ratio3"));
      workingValues = { unit };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "use unchanged components as pivot"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
    case "variableReplacementRatio": {
      const initialVolume = value(parameters, "initialVolume");
      const firstRemaining = initialVolume - value(parameters, "removedVolume1");
      const finalLiquidA = firstRemaining * (initialVolume - value(parameters, "removedVolume2")) / initialVolume;
      const finalLiquidB = initialVolume - finalLiquidA;
      answerValue = formatRatio([finalLiquidA, finalLiquidB]);
      workingValues = { finalLiquidA: roundTo(finalLiquidA, 4), finalLiquidB: roundTo(finalLiquidB, 4) };
      evidence = { ...evidence, ...workingValues };
      mathJax = {
        setupLatex: mathJaxLine("setup", "A_{final} = A_0\\left(1-\\frac{r_1}{V}\\right)\\left(1-\\frac{r_2}{V}\\right)"),
        calculationLatex: mathJaxLine("calculation", String(answerValue)),
      };
      break;
    }
    case "acidConcentration": {
      answerValue = value(parameters, "acidVolume") * 100 / (value(parameters, "acidVolume") + value(parameters, "waterVolume"));
      evidence = { ...evidence, totalSolution: value(parameters, "acidVolume") + value(parameters, "waterVolume") };
      mathJax = {
        setupLatex: mathJaxLine("setup", "acid\\% = \\frac{acid}{acid + water} \\times 100"),
        calculationLatex: mathJaxLine("calculation", `${answerValue}`),
      };
      break;
    }
  }

  const normalizedValue = typeof answerValue === "number" ? roundTo(answerValue, 4) : answerValue;
  const answer = formatAnswer(parameters.answerType, normalizedValue);
  return {
    answer,
    answerValue: normalizedValue,
    answerType: parameters.answerType,
    workingValues,
    evidence: { ...evidence, answer },
    mathJax,
  };
}
