import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function answer(solver: Rap003SolverResult) {
  return String(solver.answer).replaceAll("$$", "").trim();
}

function shown(value: number) {
  return String(Math.round(value * 10000) / 10000);
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function alligation(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const mixtureA = s(parameters, "mixtureA", s(parameters, "itemName", "First source"));
  const mixtureB = s(parameters, "mixtureB", "Second source");
  const valueA = n(parameters, "percentA");
  const valueB = n(parameters, "percentB");
  const target = n(parameters, "targetPercent");
  const partA = Math.abs(valueB - target);
  const partB = Math.abs(target - valueA);
  const final = answer(solver);
  return result(parameters, [
    `${target} lies between ${valueA} and ${valueB}, so use alligation.`,
    line(`${mixtureA}'s part is the opposite difference.`, `|${valueB}-${target}|=${partA}`),
    line(`${mixtureB}'s part is the other opposite difference.`, `|${target}-${valueA}|=${partB}`),
    line("Therefore, the mixing ratio is", `${mixtureA}:${mixtureB}=${partA}:${partB}`),
    line("Reduce the ratio.", `${partA}:${partB}=${final}`),
    `This weighted ratio gives the target value ${target}.`,
    `So, ${mixtureA} and ${mixtureB} should be mixed in the ratio ${final}.`,
  ]);
}

function weightedTwo(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const task = parameters.taskKind;
  const quantityA = parameters.variables.quantityA !== undefined ? n(parameters, "quantityA") : n(parameters, "mixRatioA") || n(parameters, "ratioA");
  const quantityB = parameters.variables.quantityB !== undefined ? n(parameters, "quantityB") : n(parameters, "mixRatioB") || n(parameters, "ratioB");
  const valueA = parameters.variables.averageA !== undefined ? n(parameters, "averageA") : parameters.variables.priceA !== undefined ? n(parameters, "priceA") : n(parameters, "percentA");
  const valueB = parameters.variables.averageB !== undefined ? n(parameters, "averageB") : parameters.variables.priceB !== undefined ? n(parameters, "priceB") : n(parameters, "percentB");
  const weightedA = quantityA * valueA;
  const weightedB = quantityB * valueB;
  const totalQuantity = quantityA + quantityB;
  const final = answer(solver);
  const subject = task === "marksAverageMixture" ? "combined average" : task === "averagePriceFromRatio" || task === "weightedAverageGroup" ? "average price" : task === "weightedProfitPercentMix" ? "overall profit percentage" : task === "weightedDiscountMix" ? "average discount percentage" : "final concentration";
  return result(parameters, [
    "Use a weighted average because the two source quantities are unequal or differently weighted.",
    line("First weighted contribution", `${quantityA}\\times${valueA}=${shown(weightedA)}`),
    line("Second weighted contribution", `${quantityB}\\times${valueB}=${shown(weightedB)}`),
    line("Add the weighted contributions.", `${shown(weightedA)}+${shown(weightedB)}=${shown(weightedA + weightedB)}`),
    line("Divide by the total weight or quantity.", `\\frac{${shown(weightedA + weightedB)}}{${totalQuantity}}=${final}`),
    `The denominator is ${quantityA}+${quantityB}=${totalQuantity}.`,
    `So, the ${subject} is ${final}.`,
  ]);
}

function equalThreeSources(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const fractionA = n(parameters, "ratioAComponent") / (n(parameters, "ratioAComponent") + n(parameters, "ratioAOther"));
  const fractionB = n(parameters, "ratioBComponent") / (n(parameters, "ratioBComponent") + n(parameters, "ratioBOther"));
  const fractionC = n(parameters, "ratioCComponent") / (n(parameters, "ratioCComponent") + n(parameters, "ratioCOther"));
  const finalFraction = (fractionA + fractionB + fractionC) / 3;
  const final = answer(solver);
  const component = s(parameters, "component", "component");
  return result(parameters, [
    "Equal source quantities mean the final component fraction is the average of the three source fractions.",
    line("First source fraction", `\\frac{${n(parameters, "ratioAComponent")}}{${n(parameters, "ratioAComponent") + n(parameters, "ratioAOther")}}=${shown(fractionA)}`),
    line("Second source fraction", `\\frac{${n(parameters, "ratioBComponent")}}{${n(parameters, "ratioBComponent") + n(parameters, "ratioBOther")}}=${shown(fractionB)}`),
    line("Third source fraction", `\\frac{${n(parameters, "ratioCComponent")}}{${n(parameters, "ratioCComponent") + n(parameters, "ratioCOther")}}=${shown(fractionC)}`),
    line("Average the three fractions.", `\\frac{${shown(fractionA)}+${shown(fractionB)}+${shown(fractionC)}}{3}=${shown(finalFraction)}`),
    line(`Convert the ${component} fraction to ${component}:other.`, `${shown(finalFraction)}:${shown(1 - finalFraction)}=${final}`),
    `So, the final ${component}:other ratio is ${final}.`,
  ]);
}

function missingQuantity(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const knownQuantity = n(parameters, "quantityA");
  const knownPercent = n(parameters, "percentA");
  const addedPercent = n(parameters, "percentB");
  const target = n(parameters, "targetPercent");
  const numeratorDifference = Math.abs(knownPercent - target);
  const denominatorDifference = Math.abs(target - addedPercent);
  const final = answer(solver);
  return result(parameters, [
    "Use alligation to compare the two source percentages with the target.",
    line("The known-source difference from the target is", `|${knownPercent}-${target}|=${numeratorDifference}`),
    line("The added-source difference from the target is", `|${target}-${addedPercent}|=${denominatorDifference}`),
    line("The source-quantity ratio is the opposite-difference ratio.", `\\text{known}:\\text{added}=${denominatorDifference}:${numeratorDifference}`),
    line("Scale from the known quantity.", `x=${knownQuantity}\\times\\frac{${numeratorDifference}}{${denominatorDifference}}=${final}`),
    "The final weighted percentage therefore equals the target percentage.",
    `So, ${final} litres of the second source should be added.`,
  ]);
}

function missingSourcePercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const ratioA = n(parameters, "mixRatioA");
  const ratioB = n(parameters, "mixRatioB");
  const percentA = n(parameters, "percentA");
  const target = n(parameters, "targetPercent");
  const final = answer(solver);
  return result(parameters, [
    "Let the unknown percentage in the second source be x.",
    line("Use the weighted-average equation.", `\\frac{${ratioA}\\times${percentA}+${ratioB}x}{${ratioA + ratioB}}=${target}`),
    line("Multiply by the total ratio parts.", `${ratioA}\\times${percentA}+${ratioB}x=${target}(${ratioA + ratioB})`),
    line("Move the known component contribution to the other side.", `${ratioB}x=${target}(${ratioA + ratioB})-${ratioA}\\times${percentA}`),
    line("Divide by the second-source ratio part.", `x=\\frac{${target}(${ratioA + ratioB})-${ratioA}\\times${percentA}}{${ratioB}}=${final}`),
    "Substitution returns the stated final percentage.",
    `So, the second source contains ${final} of the component.`,
  ]);
}

function weightedThree(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const quantities = [n(parameters, "quantityA"), n(parameters, "quantityB"), n(parameters, "quantityC")];
  const percents = [n(parameters, "percentA"), n(parameters, "percentB"), n(parameters, "percentC")];
  const contributions = quantities.map((quantity, index) => quantity * percents[index]!);
  const total = quantities.reduce((sum, value) => sum + value, 0);
  const final = answer(solver);
  return result(parameters, [
    "Calculate the weighted component contribution from each source.",
    line("First source", `${quantities[0]}\\times${percents[0]}=${contributions[0]}`),
    line("Second source", `${quantities[1]}\\times${percents[1]}=${contributions[1]}`),
    line("Third source", `${quantities[2]}\\times${percents[2]}=${contributions[2]}`),
    line("Divide the total weighted contribution by total quantity.", `\\frac{${contributions.join("+")}}{${total}}=${final}`),
    `The total quantity is ${quantities.join("+")}=${total}.`,
    `So, the final percentage is ${final}.`,
  ]);
}

function reverseCount(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const knownCount = n(parameters, "quantityA");
  const averageA = n(parameters, "averageA");
  const averageB = n(parameters, "averageB");
  const combined = n(parameters, "combinedAverage");
  const differenceA = Math.abs(averageA - combined);
  const differenceB = Math.abs(combined - averageB);
  const final = answer(solver);
  return result(parameters, [
    "Use alligation on the two group averages and the combined average.",
    line("Difference for the known group", `|${averageA}-${combined}|=${differenceA}`),
    line("Difference for the unknown-count group", `|${combined}-${averageB}|=${differenceB}`),
    line("The group-count ratio is the opposite-difference ratio.", `\\text{known}:\\text{unknown}=${differenceB}:${differenceA}`),
    line("Scale from the known count.", `x=${knownCount}\\times\\frac{${differenceA}}{${differenceB}}=${final}`),
    "The two group totals then produce the stated combined average.",
    `So, the second group has ${final} members.`,
  ]);
}

function reverseAverage(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const quantityA = n(parameters, "quantityA");
  const quantityB = n(parameters, "quantityB");
  const averageA = n(parameters, "averageA");
  const combined = n(parameters, "combinedAverage");
  const final = answer(solver);
  return result(parameters, [
    "Let the unknown average of the second group be x.",
    line("Write the combined weighted-average equation.", `\\frac{${quantityA}\\times${averageA}+${quantityB}x}{${quantityA + quantityB}}=${combined}`),
    line("Multiply by the total number of members.", `${quantityA}\\times${averageA}+${quantityB}x=${combined}(${quantityA + quantityB})`),
    line("Move the known weighted total to the other side.", `${quantityB}x=${combined}(${quantityA + quantityB})-${quantityA}\\times${averageA}`),
    line("Divide by the second-group count.", `x=\\frac{${combined}(${quantityA + quantityB})-${quantityA}\\times${averageA}}{${quantityB}}=${final}`),
    "Substitution reproduces the stated combined average.",
    `So, the second group's average is ${final}.`,
  ]);
}

function replaceToTarget(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalQuantity");
  const initial = n(parameters, "initialPercent");
  const added = n(parameters, "addPercent");
  const target = n(parameters, "targetPercent");
  const final = answer(solver);
  return result(parameters, [
    "Let x litres of the original mixture be replaced by the stronger solution.",
    line("The removed mixture takes away component at the initial percentage.", `\\text{removed component}=\\frac{${initial}}{100}x`),
    line("The replacement adds component at the new percentage.", `\\text{added component}=\\frac{${added}}{100}x`),
    line("The required net increase in component is", `${total}\\times\\frac{${target - initial}}{100}`),
    line("Equate net increase and solve.", `x=\\frac{${total}(${target}-${initial})}{${added}-${initial}}=${final}`),
    "The total volume remains unchanged because removal and replacement amounts are equal.",
    `So, ${final} litres must be replaced.`,
  ]);
}

export function renderRap003MixtureExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "alloyMixingRatioFromTarget":
    case "alloyPureAndImpureMix":
    case "alloyZeroComponentMix":
    case "mixingRatioFromAveragePrice":
    case "alloyTargetExactlyMidpoint":
    case "alloyNonMidpointTrap": return alligation(parameters, solver);
    case "alloyTargetComponentFromMix":
    case "weightedAverageGroup":
    case "weightedProfitPercentMix":
    case "weightedDiscountMix":
    case "sugarSolutionConcentration":
    case "averagePriceFromRatio":
    case "marksAverageMixture":
    case "alloyRatioToFinalPercent": return weightedTwo(parameters, solver);
    case "alloyThreeSourceEqualMix": return equalThreeSources(parameters, solver);
    case "alloyMissingQuantity": return missingQuantity(parameters, solver);
    case "alloyMissingSourcePercent": return missingSourcePercent(parameters, solver);
    case "alloyTargetFromThreeSources": return weightedThree(parameters, solver);
    case "reverseWeightedAverageCount": return reverseCount(parameters, solver);
    case "reverseWeightedAverageGroupAvg": return reverseAverage(parameters, solver);
    case "alloyReplaceToTarget": return replaceToTarget(parameters, solver);
    default: return explanation;
  }
}
