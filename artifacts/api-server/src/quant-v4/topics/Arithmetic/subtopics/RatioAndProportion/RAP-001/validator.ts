import { extractPlaceholders, getQuestionEntry, getTaskRegistryEntry } from "./library";
import { gcdMany, isFiniteNumber, ratioFromDecimals, ratioFromFractions, roundTo, simplifyRatio } from "./math";
import { RAP_001_ARCHETYPE_ID, RAP_001_CP_IDS, type Rap001Parameters, type Rap001QuestionPackage, type Rap001ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function value(parameters: Rap001Parameters, name: string) {
  return Number(parameters.variables[name]);
}

function placeholderSet(parameters: Rap001Parameters, language: "en" | "hi" | "pa") {
  return new Set(extractPlaceholders(getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, language).template));
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function expectedAnswerValue(parameters: Rap001Parameters): string | number {
  switch (parameters.taskKind) {
    case "simpleLinkage":
      return simplifyRatio([value(parameters, "ratioA1") * value(parameters, "ratioB2"), value(parameters, "ratioB1") * value(parameters, "ratioB2"), value(parameters, "ratioB1") * value(parameters, "ratioC2")]).join(":");
    case "ratioNormalization":
      return ratioFromFractions(value(parameters, "numerator1"), value(parameters, "denominator1"), value(parameters, "numerator2"), value(parameters, "denominator2")).join(":");
    case "ratioTreeLinkage":
      return simplifyRatio([value(parameters, "ratioA") * value(parameters, "ratioB_prime") * value(parameters, "ratioC_prime"), value(parameters, "ratioB") * value(parameters, "ratioC") * value(parameters, "ratioD")]).join(":");
    case "scalingByComponent":
      return value(parameters, "valueA") * value(parameters, "ratioB") / value(parameters, "ratioA");
    case "decimalNormalization":
      return ratioFromDecimals(value(parameters, "decimalA"), value(parameters, "decimalB")).join(":");
    case "basicPartition": {
      const ratios = [value(parameters, "ratioA"), value(parameters, "ratioB"), value(parameters, "ratioC")];
      const names = [String(parameters.variables.personA), String(parameters.variables.personB), String(parameters.variables.personC)];
      const index = names.indexOf(String(parameters.variables.targetPerson));
      return value(parameters, "totalAmount") * ratios[index]! / ratios.reduce((sum, part) => sum + part, 0);
    }
    case "shareDifference":
      return value(parameters, "totalAmount") * (value(parameters, "ratioA") - value(parameters, "ratioC")) / (value(parameters, "ratioA") + value(parameters, "ratioB") + value(parameters, "ratioC"));
    case "reversePartition":
      return value(parameters, "shareDifference") * (value(parameters, "ratioA") + value(parameters, "ratioB") + value(parameters, "ratioC")) / (value(parameters, "ratioA") - value(parameters, "ratioC"));
    case "salaryDistribution":
      return value(parameters, "totalSalary") * value(parameters, "ratioSav") / (value(parameters, "ratioExp") + value(parameters, "ratioSav"));
    case "twoStateAddition": {
      const numerator = value(parameters, "addedCount") * value(parameters, "finalRatioB");
      const denominator = value(parameters, "ratioB") * value(parameters, "finalRatioA") - value(parameters, "ratioA") * value(parameters, "finalRatioB");
      return value(parameters, "ratioA") * (numerator / denominator);
    }
    case "twoStateSubtraction": {
      const numerator = value(parameters, "removedCount") * value(parameters, "finalRatioB");
      const denominator = value(parameters, "ratioA") * value(parameters, "finalRatioB") - value(parameters, "ratioB") * value(parameters, "finalRatioA");
      const x = numerator / denominator;
      return (value(parameters, "ratioA") + value(parameters, "ratioB")) * x;
    }
    case "twoStateTransfer": {
      const numerator = value(parameters, "transferredCount") * (value(parameters, "finalRatioA") - value(parameters, "finalRatioB"));
      const denominator = value(parameters, "ratioA") * value(parameters, "finalRatioB") - value(parameters, "ratioB") * value(parameters, "finalRatioA");
      const x = numerator / denominator;
      return Math.max(value(parameters, "ratioA"), value(parameters, "ratioB")) * x;
    }
    case "incomeExpenditureSystem": {
      const numerator = (value(parameters, "expRatioB") - value(parameters, "expRatioA")) * value(parameters, "savingsAmount");
      const denominator = value(parameters, "incomeRatioA") * value(parameters, "expRatioB") - value(parameters, "incomeRatioB") * value(parameters, "expRatioA");
      return value(parameters, "incomeRatioA") * (numerator / denominator);
    }
    case "multiStageTransformation": {
      const numerator = value(parameters, "finalRatioA") * value(parameters, "removedCount") + value(parameters, "finalRatioB") * value(parameters, "addedCount");
      const denominator = value(parameters, "ratioB") * value(parameters, "finalRatioA") - value(parameters, "ratioA") * value(parameters, "finalRatioB");
      return value(parameters, "ratioB") * (numerator / denominator);
    }
    case "meanProportional":
      return Math.sqrt(value(parameters, "numA") * value(parameters, "numB"));
    case "thirdProportional":
      return value(parameters, "numB") * value(parameters, "numB") / value(parameters, "numA");
    case "fourthProportional":
      return value(parameters, "numB") * value(parameters, "numC") / value(parameters, "numA");
    case "directVariation":
      return value(parameters, "varY1") * value(parameters, "varX2") / value(parameters, "varX1");
    case "inverseVariation":
      return value(parameters, "varY1") * value(parameters, "varX1") / value(parameters, "varX2");
    case "coinCounting": {
      const ratioValues = [value(parameters, "ratio1"), value(parameters, "ratio2"), value(parameters, "ratio3")];
      const denomValues = [value(parameters, "denom1"), value(parameters, "denom2"), value(parameters, "denom3")];
      const unit = value(parameters, "totalValue") / ratioValues.reduce((sum, ratio, index) => sum + ratio * denomValues[index]!, 0);
      return ratioValues[denomValues.indexOf(value(parameters, "targetDenom"))]! * unit;
    }
    case "multiDenominationMapping": {
      const denomValues = [value(parameters, "denom1"), value(parameters, "denom2"), value(parameters, "denom3"), value(parameters, "denom4")];
      const valueRatios = [value(parameters, "valRatio1"), value(parameters, "valRatio2"), value(parameters, "valRatio3"), value(parameters, "valRatio4")];
      const scale = 10 ** Math.max(...valueRatios.map((ratio, index) => {
        const text = String(ratio / denomValues[index]!);
        const dot = text.indexOf(".");
        return dot === -1 ? 0 : text.length - dot - 1;
      }));
      const countWeights = simplifyRatio(valueRatios.map((ratio, index) => Math.round((ratio / denomValues[index]!) * scale)));
      const unit = value(parameters, "totalCoins") / countWeights.reduce((sum, part) => sum + part, 0);
      return countWeights[denomValues.indexOf(value(parameters, "targetDenom"))]! * unit;
    }
    case "weightedMapping": {
      const unit = value(parameters, "totalWeight") / (value(parameters, "countA") * value(parameters, "ratioA") + value(parameters, "countB") * value(parameters, "ratioB") + value(parameters, "countC") * value(parameters, "ratioC"));
      return unit * value(parameters, "ratioA");
    }
    case "weightedMarks": {
      const unit = value(parameters, "totalScore") / (value(parameters, "ratio1") * value(parameters, "w1") + value(parameters, "ratio2") * value(parameters, "w2") + value(parameters, "ratio3") * value(parameters, "w3"));
      return unit * value(parameters, "ratio1");
    }
    case "binaryMixture": {
      const numerator = value(parameters, "addedAmount") * value(parameters, "finalRatio2");
      const denominator = value(parameters, "ratio2") * value(parameters, "finalRatio1") - value(parameters, "ratio1") * value(parameters, "finalRatio2");
      return value(parameters, "ratio2") * (numerator / denominator);
    }
    case "mixtureComponentFinding": {
      const initial1 = value(parameters, "totalVolume") * value(parameters, "ratio1") / (value(parameters, "ratio1") + value(parameters, "ratio2"));
      const initial2 = value(parameters, "totalVolume") * value(parameters, "ratio2") / (value(parameters, "ratio1") + value(parameters, "ratio2"));
      return initial1 * value(parameters, "finalRatio2") / value(parameters, "finalRatio1") - initial2;
    }
    case "threeComponentMixture": {
      const denominator = value(parameters, "ratio1") * value(parameters, "finalRatio2") / value(parameters, "finalRatio1") - value(parameters, "ratio2");
      const unit = value(parameters, "addedAmount") / denominator;
      return unit * (value(parameters, "ratio1") + value(parameters, "ratio2") + value(parameters, "ratio3"));
    }
    case "variableReplacementRatio": {
      const firstRemaining = value(parameters, "initialVolume") - value(parameters, "removedVolume1");
      const finalLiquidA = firstRemaining * (value(parameters, "initialVolume") - value(parameters, "removedVolume2")) / value(parameters, "initialVolume");
      const finalLiquidB = value(parameters, "initialVolume") - finalLiquidA;
      return simplifyRatio([finalLiquidA, finalLiquidB]).join(":");
    }
    case "acidConcentration":
      return value(parameters, "acidVolume") * 100 / (value(parameters, "acidVolume") + value(parameters, "waterVolume"));
  }
}

function answerTypeLooksValid(pkg: Rap001QuestionPackage) {
  const answer = pkg.answer;
  if (pkg.parameters.answerType === "PERCENT") return answer.endsWith("%");
  if (pkg.parameters.answerType === "RATIO") return /^\d+(?::\d+)+$/.test(answer);
  if (pkg.parameters.answerType === "COUNT") return /^-?\d+$/.test(answer);
  return answer.length > 0 && !answer.includes("undefined") && !answer.includes("NaN");
}

function nearlyEqual(left: string | number, right: string | number) {
  if (typeof left === "string" || typeof right === "string") return String(left) === String(right);
  return Math.abs(roundTo(left, 4) - roundTo(right, 4)) < 1e-4;
}

export function validateRap001Parameters(parameters: Rap001Parameters): Rap001ValidationResult {
  const registryEntry = getTaskRegistryEntry(parameters.canonicalProblemId, parameters.questionLanguageId);
  const enPlaceholders = placeholderSet(parameters, "en");
  const hiPlaceholders = placeholderSet(parameters, "hi");
  const paPlaceholders = placeholderSet(parameters, "pa");
  const checks = [
    check("archetype", parameters.archetypeId === RAP_001_ARCHETYPE_ID, "Archetype ID must match."),
    check("cp", RAP_001_CP_IDS.includes(parameters.canonicalProblemId), "CP must be active."),
    check("taskKindRegistry", parameters.taskKind === registryEntry.taskKind, "Task kind must come from task registry."),
    check("answerTypeRegistry", parameters.answerType === registryEntry.answerType, "Answer type must come from task registry."),
    check("requiredVariablesRegistry", parameters.requiredVariables.join("|") === registryEntry.requiredVariables.join("|"), "Required variables must come from task registry."),
    check("placeholderCrossLanguage", sameSet(enPlaceholders, hiPlaceholders) && sameSet(enPlaceholders, paPlaceholders), "EN/HI/PA placeholders must match."),
  ];
  for (const variable of registryEntry.requiredVariables) {
    checks.push(check(`requiredVariable:${variable}`, Object.hasOwn(parameters.variables, variable), `${variable} must be generated.`));
    checks.push(check(`placeholder:${variable}`, enPlaceholders.has(variable) && hiPlaceholders.has(variable) && paPlaceholders.has(variable), `${variable} must appear in every language template.`));
  }
  for (const [key, raw] of Object.entries(parameters.variables)) {
    if (typeof raw === "number") {
      checks.push(check(`finite:${key}`, isFiniteNumber(raw), `${key} must be finite.`));
      if (key.toLowerCase().includes("ratio") || key.toLowerCase().includes("volume") || key.toLowerCase().includes("amount") || key.toLowerCase().includes("count") || key.toLowerCase().includes("score") || key.toLowerCase().includes("value") || key.toLowerCase().includes("num")) {
        checks.push(check(`positive:${key}`, raw > 0, `${key} must be positive.`));
      }
    }
  }

  if (parameters.taskKind === "simpleLinkage") {
    const overlap = gcdMany([value(parameters, "ratioB1"), value(parameters, "ratioB2")]) >= 1;
    checks.push(check("pivotSynchronization", overlap, "Linked ratios must share a synchronizable pivot."));
  }
  if (parameters.taskKind === "ratioTreeLinkage") {
    checks.push(check("treePivots", value(parameters, "ratioB") > 0 && value(parameters, "ratioB_prime") > 0 && value(parameters, "ratioC") > 0 && value(parameters, "ratioC_prime") > 0, "Tree linkage pivots must remain positive."));
  }
  if (parameters.taskKind === "basicPartition" || parameters.taskKind === "shareDifference") {
    const sum = value(parameters, "ratioA") + value(parameters, "ratioB") + value(parameters, "ratioC");
    checks.push(check("partitionUnits", value(parameters, "totalAmount") % sum === 0, "Partition total should map cleanly to ratio units."));
  }
  if (parameters.taskKind === "reversePartition") {
    checks.push(check("positiveDifference", value(parameters, "ratioA") > value(parameters, "ratioC"), "Reverse partition needs a positive leading difference."));
  }
  if (parameters.taskKind === "twoStateAddition" || parameters.taskKind === "twoStateSubtraction" || parameters.taskKind === "twoStateTransfer" || parameters.taskKind === "multiStageTransformation") {
    checks.push(check("finalRatios", value(parameters, "finalRatioA") > 0 && value(parameters, "finalRatioB") > 0, "Final ratio parts must remain positive."));
  }
  if (parameters.taskKind === "directVariation" || parameters.taskKind === "inverseVariation") {
    checks.push(check("variationBase", value(parameters, "varX1") !== 0 && value(parameters, "varX2") !== 0, "Variation inputs must be non-zero."));
  }
  if (parameters.taskKind === "binaryMixture" || parameters.taskKind === "mixtureComponentFinding" || parameters.taskKind === "threeComponentMixture") {
    checks.push(check("mixtureRatios", value(parameters, "ratio1") > 0 && value(parameters, "ratio2") > 0, "Mixture components must stay positive."));
  }
  if (parameters.taskKind === "variableReplacementRatio") {
    checks.push(check("replacementBounds", value(parameters, "removedVolume1") < value(parameters, "initialVolume") && value(parameters, "removedVolume2") < value(parameters, "initialVolume"), "Replacement volumes must stay below the initial volume."));
  }
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateRap001QuestionPackage(pkg: Rap001QuestionPackage): Rap001ValidationResult {
  const parameterValidation = validateRap001Parameters(pkg.parameters);
  const expected = expectedAnswerValue(pkg.parameters);
  const checks = [
    ...parameterValidation.checks,
    check("stem", pkg.stem.length > 0 && !pkg.stem.includes("undefined") && !pkg.stem.includes("NaN"), "Stem must render."),
    check("answer", pkg.answer.length > 0 && !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Answer must render."),
    check("answerTypeFormat", answerTypeLooksValid(pkg), "Answer format must match declared answer type."),
    check("solverAnswerType", pkg.solver.answerType === pkg.parameters.answerType, "Solver answer type must match parameters."),
    check("answerCorrectness", nearlyEqual(pkg.solver.answerValue, expected), "Solver answer must match independent recomputation."),
    check("graphNodes", pkg.reasoningGraph.nodes.length >= 3, "Reasoning graph must contain traceable nodes."),
    check("explanation", pkg.explanation.lines.length > 0 && pkg.explanation.lines.every((line) => !line.includes("{")), "Explanation must render completely."),
    check("traceability", pkg.traceability.questionLanguageId === pkg.questionLanguageId && pkg.traceability.explanationId === pkg.explanationId, "Traceability must remain aligned."),
    check("mathJax", Object.values(pkg.mathJax).every((item) => item.length > 0), "MathJax values must be populated."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
