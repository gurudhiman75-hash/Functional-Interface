import { extractPlaceholders, getQuestionEntry, getTaskRegistryEntry } from "./library";
import {
  chainedDropCount,
  electionTotalVoters,
  inclusionExclusionOverlap,
  isFiniteNumber,
  multiTierPiecewiseAmount,
  piecewiseAmount,
  repeatedReplacementAmount,
  repeatedReplacementPercent,
  reversePiecewiseSales,
  shiftedBaseChainCount,
  tripleInclusionExclusionUnion,
  variableReplacementPercent,
  weightedCount,
  weightedPercentage,
} from "./math";
import { PCT_002_ARCHETYPE_ID, PCT_002_CP_IDS, type Pct002Parameters, type Pct002QuestionPackage, type Pct002ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function placeholderSet(parameters: Pct002Parameters, language: "en" | "hi" | "pa") {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}

function expectedNumericAnswer(parameters: Pct002Parameters) {
  const value = (name: string) => Number(parameters.variables[name]);
  switch (parameters.taskKind) {
    case "inclusionExclusion":
      return inclusionExclusionOverlap(value("groupAPercentage"), value("groupBPercentage"), value("neitherPercentage"));
    case "tripleInclusionExclusion": {
      const union = tripleInclusionExclusionUnion(value("groupAPercentage"), value("groupBPercentage"), value("groupCPercentage"), value("groupABPercentage"), value("groupBCPercentage"), value("groupACPercentage"), value("groupABCPercentage"));
      return parameters.questionLanguageId === "PCT-QL-048" ? 100 - union : union;
    }
    case "multiTierPiecewiseRate":
      return multiTierPiecewiseAmount(value("totalBase"), value("tier1Limit"), value("tier2Limit"), value("tier1Rate"), value("tier2Rate"), value("tier3Rate"));
    case "reversePiecewiseRate":
      return reversePiecewiseSales(value("totalResult"), value("tier1Limit"), value("tier1Rate"), value("tier2Rate"));
    case "variableReplacement":
      return variableReplacementPercent([value("replacementRate1"), value("replacementRate2"), value("replacementRate3")]);
    case "fractionalError":
      return Math.abs((value("wrongNumerator") / value("wrongDenominator") - value("correctNumerator") / value("correctDenominator")) / (value("correctNumerator") / value("correctDenominator"))) * 100;
    case "wrongMultiplier":
      return Math.abs((value("wrongMultiplier") - value("correctMultiplier")) / value("correctMultiplier")) * 100;
    case "wrongDivisor":
      return Math.abs(value("correctDivisor") / value("wrongDivisor") - 1) * 100;
    case "tieredCommission":
      return piecewiseAmount(value("salesAmount"), value("thresholdAmount"), value("baseCommissionRate"), value("bonusCommissionRate"));
    case "tieredTax":
      return Math.max(0, value("grossIncome") - value("exemptionAmount")) * value("taxPercentage") / 100;
    case "piecewiseRate":
      return piecewiseAmount(value("usageAmount"), value("thresholdAmount"), value("baseChargeRate"), value("extraChargeRate"));
    case "weightedSubgroup":
      return weightedPercentage(value("malePercentage"), value("maleTraitPercentage"), value("femaleTraitPercentage"));
    case "hierarchicalPopulation":
      return weightedCount(value("totalPopulation"), value("malePercentage"), value("maleTraitPercentage"), value("femaleTraitPercentage"));
    case "branchAggregation":
      return weightedPercentage(value("groupAPercentage"), value("groupATraitPercentage"), value("groupBTraitPercentage"));
    case "repeatedReplacement":
      return repeatedReplacementPercent(value("initialVolume"), value("replacementVolume"), value("numberOfOperations"));
    case "iterativeDilution":
      return repeatedReplacementAmount(value("initialVolume"), value("replacementVolume"), value("numberOfOperations"));
    case "electionMargin":
      return electionTotalVoters(value("polledPercentage"), value("invalidPercentage"), value("winnerPercentage"), value("voteMargin"));
    case "multiStageAttrition":
      return chainedDropCount(value("initialCount"), [value("firstDropPercentage"), value("secondDropPercentage"), value("thirdDropPercentage")]);
    case "shiftedBaseChain":
      return shiftedBaseChainCount(value("initialCount"), [value("firstPassPercentage"), value("secondPassPercentage"), value("thirdPassPercentage")]);
    default:
      return NaN;
  }
}

function answerTypeLooksValid(pkg: Pct002QuestionPackage) {
  const answer = pkg.answer;
  if (pkg.parameters.answerType === "PERCENT") return answer.endsWith("%");
  if (pkg.parameters.answerType === "RATIO") return /^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(answer);
  if (pkg.parameters.answerType === "FRACTION") return /^-?\d+\/\d+$/.test(answer);
  if (pkg.parameters.answerType === "COUNT") return /^-?\d+$/.test(answer);
  return answer.length > 0 && !answer.includes("undefined") && !answer.includes("NaN");
}

export function validatePct002Parameters(parameters: Pct002Parameters): Pct002ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = placeholderSet(parameters, "hi");
  const paPlaceholders = placeholderSet(parameters, "pa");
  const checks = [
    check("archetype", parameters.archetypeId === PCT_002_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", PCT_002_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check("placeholderCrossLanguage", sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders), "EN/HI/PA placeholders must match."),
  ];

  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
    checks.push(check(`placeholder:${variable}`, enPlaceholders.has(variable) && hiPlaceholders.has(variable) && paPlaceholders.has(variable), `${variable} must appear in every language template.`));
  }

  for (const [key, value] of Object.entries(parameters.variables)) {
    if (typeof value === "number") {
      checks.push(check(`finite:${key}`, isFiniteNumber(value), `${key} must be finite.`));
      if (key.toLowerCase().includes("percentage") || key.toLowerCase().includes("rate")) {
        checks.push(check(`percentRange:${key}`, value > 0 && value < 100, `${key} must be between 0 and 100.`));
      }
      if (key.toLowerCase().includes("amount") || key.toLowerCase().includes("volume") || key.toLowerCase().includes("count") || key.toLowerCase().includes("income") || key.toLowerCase().includes("sales") || key.toLowerCase().includes("population") || key.toLowerCase().includes("margin")) {
        checks.push(check(`positive:${key}`, value > 0, `${key} must be positive.`));
      }
    }
  }

  if (parameters.taskKind === "inclusionExclusion") {
    const overlap = inclusionExclusionOverlap(Number(parameters.variables.groupAPercentage), Number(parameters.variables.groupBPercentage), Number(parameters.variables.neitherPercentage));
    checks.push(check("inclusionExclusionBounds", overlap >= 0 && Number(parameters.variables.groupAPercentage) + Number(parameters.variables.groupBPercentage) - overlap <= 100, "Set overlap must be valid."));
    checks.push(check("neitherNonNegative", Number(parameters.variables.neitherPercentage) >= 0, "Neither must be non-negative."));
  }

  if (parameters.taskKind === "tripleInclusionExclusion") {
    const union = tripleInclusionExclusionUnion(Number(parameters.variables.groupAPercentage), Number(parameters.variables.groupBPercentage), Number(parameters.variables.groupCPercentage), Number(parameters.variables.groupABPercentage), Number(parameters.variables.groupBCPercentage), Number(parameters.variables.groupACPercentage), Number(parameters.variables.groupABCPercentage));
    checks.push(check("unionBounds", union >= 0 && union <= 100, "Union must be between 0 and 100."));
  }

  if (parameters.taskKind === "multiTierPiecewiseRate") {
    checks.push(check("limitsOrdering", Number(parameters.variables.tier1Limit) < Number(parameters.variables.tier2Limit), "T1 limit must be less than T2 limit."));
    checks.push(check("baseExceedsLimits", Number(parameters.variables.totalBase) > Number(parameters.variables.tier2Limit), "Base must exceed limits for multi-tier."));
  }

  if (parameters.taskKind === "reversePiecewiseRate") {
    checks.push(check("resultReachable", Number(parameters.variables.totalResult) > 0, "Total result must be positive."));
  }

  if (parameters.taskKind === "variableReplacement") {
    const rates = [Number(parameters.variables.replacementRate1), Number(parameters.variables.replacementRate2), Number(parameters.variables.replacementRate3)];
    checks.push(check("ratesValid", rates.every(r => r > 0 && r < 100), "Replacement rates must be between 0 and 100."));
  }

  if (parameters.taskKind === "piecewiseRate" || parameters.taskKind === "tieredCommission" || parameters.taskKind === "tieredTax") {
    const threshold = Number(parameters.variables.thresholdAmount ?? parameters.variables.exemptionAmount);
    const amount = Number(parameters.variables.salesAmount ?? parameters.variables.usageAmount ?? parameters.variables.grossIncome);
    checks.push(check("thresholdOrdering", amount >= threshold, "Threshold-based question must remain active."));
    const rateKeys = Object.keys(parameters.variables).filter((key) => key.toLowerCase().includes("rate") || key.toLowerCase().includes("percentage"));
    checks.push(check("ratesNonNegative", rateKeys.every((key) => Number(parameters.variables[key]) >= 0), "Rates must be non-negative."));
  }

  if (parameters.taskKind === "weightedSubgroup" || parameters.taskKind === "hierarchicalPopulation" || parameters.taskKind === "branchAggregation") {
    const primary = Number(parameters.variables.malePercentage ?? parameters.variables.groupAPercentage ?? 0);
    checks.push(check("groupShares", primary > 0 && primary < 100, "Group percentages must sum to 100 with their complement."));
  }

  if (parameters.taskKind === "repeatedReplacement" || parameters.taskKind === "iterativeDilution") {
    const initialVolume = Number(parameters.variables.initialVolume);
    const replacementVolume = Number(parameters.variables.replacementVolume);
    const numberOfOperations = Number(parameters.variables.numberOfOperations);
    checks.push(check("replacementBounds", replacementVolume > 0 && replacementVolume < initialVolume, "Replacement volume must stay between 0 and initial volume."));
    checks.push(check("operationCount", [2, 3, 4, 5, 6].includes(numberOfOperations), "Number of operations must be in {2,3,4,5,6}."));
  }

  if (parameters.taskKind === "electionMargin") {
    const winnerPercentage = Number(parameters.variables.winnerPercentage);
    checks.push(check("winnerMajority", winnerPercentage > 50, "Winner percentage must exceed 50."));
  }

  if (parameters.taskKind === "multiStageAttrition" || parameters.taskKind === "shiftedBaseChain") {
    checks.push(check("positiveIntermediates", expectedNumericAnswer(parameters) > 0, "Intermediate populations must remain positive."));
  }

  return { valid: checks.every((item) => item.passed), checks };
}

export function validatePct002QuestionPackage(pkg: Pct002QuestionPackage): Pct002ValidationResult {
  const parameterValidation = validatePct002Parameters(pkg.parameters);
  const expected = expectedNumericAnswer(pkg.parameters);
  const numericExpected = pkg.parameters.answerType === "COUNT" ? Math.round(expected) : Number(expected.toFixed(4));
  const numericActual = pkg.solver.numericAnswer;
  const checks = [
    ...parameterValidation.checks,
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined") && !pkg.stem.includes("NaN"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("answerTypeFormat", answerTypeLooksValid(pkg), "Answer format must match declared answer type."),
    check("solverAnswerType", pkg.solver.answerType === pkg.parameters.answerType, "Solver answer type must match parameters."),
    check("solverCorrectness", numericActual !== null && Math.abs(numericActual - numericExpected) < 1e-6, "Solver answer must match independent recomputation."),
    check("graph", pkg.reasoningGraph.nodes.some((node) => node.id === "answer"), "Graph must contain answer node."),
    check("graphAnswerType", pkg.reasoningGraph.nodes.some((node) => node.id === "answerType" && node.value === pkg.parameters.answerType), "Graph must contain answer type node."),
    check("explanation", pkg.explanation.lines.length > 0, "Explanation must render."),
    check("traceability", pkg.traceability.answer === pkg.answer, "Traceability answer must match."),
    check("mathJax", Object.values(pkg.mathJax).every((value) => value.length > 0), "MathJax evidence must be populated."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
