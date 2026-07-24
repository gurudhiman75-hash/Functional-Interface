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

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function denominationValues(parameters: Rap003Parameters) {
  const denoms = [n(parameters, "denominationA"), n(parameters, "denominationB"), n(parameters, "denominationC")];
  const ratios = [n(parameters, "ratioA"), n(parameters, "ratioB"), n(parameters, "ratioC")];
  if (parameters.variables.denominationD !== undefined) {
    denoms.push(n(parameters, "denominationD"));
    ratios.push(n(parameters, "ratioD"));
  }
  const weighted = ratios.map((ratio, index) => ratio * denoms[index]!);
  return {
    denoms,
    ratios,
    weighted,
    weightedSum: weighted.reduce((sum, value) => sum + value, 0),
    ratioSum: ratios.reduce((sum, value) => sum + value, 0),
  };
}

function totalFromUnit(parameters: Rap003Parameters, solver: Rap003SolverResult, finalLabel: string) {
  const { denoms, ratios, weighted, weightedSum } = denominationValues(parameters);
  const unit = n(parameters, "commonUnit");
  const final = answer(solver);
  const contributionLines = ratios.map((ratio, index) =>
    line(`Value contributed by type ${index + 1}`, `${ratio}x\\times${denoms[index]}=${weighted[index]}x`),
  );
  return result(parameters, [
    line("Let the counts be the ratio parts multiplied by the common unit.", ratios.map((ratio) => `${ratio}x`).join(":")),
    ...contributionLines,
    line("Total value for one common ratio unit", `${weighted.join("+")}=${weightedSum}`),
    line(`Use x=${unit}.`, `${weightedSum}\\times${unit}=${final}`),
    `So, the ${finalLabel} is ${final}.`,
  ]);
}

function targetCountFromValue(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { denoms, ratios, weightedSum } = denominationValues(parameters);
  const totalValue = n(parameters, "totalValue");
  const unit = totalValue / weightedSum;
  const targetDenom = n(parameters, "targetDenomination");
  const targetIndex = denoms.indexOf(targetDenom);
  if (targetIndex < 0) throw new Error(`Unknown target denomination in explanation: ${targetDenom}`);
  const targetRatio = ratios[targetIndex]!;
  const final = answer(solver);
  return result(parameters, [
    line("Let the counts be the ratio parts multiplied by x.", ratios.map((ratio) => `${ratio}x`).join(":")),
    line(
      "The total value represented by one x is",
      `${ratios.map((ratio, index) => `${ratio}\\times${denoms[index]}`).join("+")}=${weightedSum}`,
    ),
    line("Use the given total value.", `${weightedSum}x=${totalValue}`),
    line("Solve for x.", `x=\\frac{${totalValue}}{${weightedSum}}=${unit}`),
    line(`The ${targetDenom}-value type has ${targetRatio} ratio parts.`, `${targetRatio}\\times${unit}=${final}`),
    "This count, together with the other ratio counts, reproduces the total value.",
    `So, the number of ${targetDenom}-value items is ${final}.`,
  ]);
}

function directTargetCount(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { denoms, ratios } = denominationValues(parameters);
  const unit = n(parameters, "commonUnit");
  const target = n(parameters, "targetDenomination");
  const index = denoms.indexOf(target);
  if (index < 0) throw new Error(`Unknown target denomination in explanation: ${target}`);
  const targetRatio = ratios[index]!;
  const final = answer(solver);
  return result(parameters, [
    line("The item counts follow the stated ratio.", ratios.join(":")),
    line("The common multiplier is", `x=${unit}`),
    line("Therefore, the counts are", ratios.map((ratio) => `${ratio}\\times${unit}`).join(":")),
    line(`The ${target}-value type corresponds to ${targetRatio} ratio parts.`, `${targetRatio}\\times${unit}`),
    line("Evaluating gives", `${targetRatio * unit}=${final}`),
    "No denomination multiplication is needed because the question asks for count.",
    `So, there are ${final} items of value ${target}.`,
  ]);
}

function swapValue(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { weightedSum } = denominationValues(parameters);
  const unit = n(parameters, "commonUnit");
  const original = weightedSum * unit;
  const delta = n(parameters, "swapCount") * (n(parameters, "toDenomination") - n(parameters, "fromDenomination"));
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the original total value.", `${weightedSum}\\times${unit}=${original}`),
    line("Each replacement changes value by", `${n(parameters, "toDenomination")}-${n(parameters, "fromDenomination")}=${n(parameters, "toDenomination") - n(parameters, "fromDenomination")}`),
    line("There are several such replacements.", `${n(parameters, "swapCount")}\\times${n(parameters, "toDenomination") - n(parameters, "fromDenomination")}=${delta}`),
    line("Add the change to the original value.", `${original}+${delta}=${final}`),
    "The total number of notes stays unchanged.",
    "Only the denomination of the replaced notes changes.",
    `So, the new total value is ${final}.`,
  ]);
}

function totalCountFromValue(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { ratios, weightedSum, ratioSum } = denominationValues(parameters);
  const unit = n(parameters, "totalValue") / weightedSum;
  const final = answer(solver);
  return result(parameters, [
    line("Let the counts be the ratio parts multiplied by x.", ratios.map((ratio) => `${ratio}x`).join(":")),
    line("Value represented by one x is", `${weightedSum}`),
    line("Use the total value to find x.", `${weightedSum}x=${n(parameters, "totalValue")}`),
    line("Therefore,", `x=${n(parameters, "totalValue")}\\div${weightedSum}=${unit}`),
    line("The total count contains all ratio parts.", `(${ratios.join("+")})x=${ratioSum}\\times${unit}=${final}`),
    "The individual counts remain in the stated ratio.",
    `So, the total number of items is ${final}.`,
  ]);
}

function totalValueFromCount(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { ratios, weightedSum, ratioSum } = denominationValues(parameters);
  const unit = n(parameters, "totalCount") / ratioSum;
  const final = answer(solver);
  return result(parameters, [
    line("Add the count-ratio parts.", `${ratios.join("+")}=${ratioSum}`),
    line("Find one count-ratio unit.", `x=\\frac{${n(parameters, "totalCount")}}{${ratioSum}}=${unit}`),
    line("The counts are", ratios.map((ratio) => ratio * unit).join(":")),
    line("The value of one ratio unit is", `${weightedSum}`),
    line("Multiply by the common count unit.", `${weightedSum}\\times${unit}=${final}`),
    "This includes the value of every item in all groups.",
    `So, the total value is ${final}.`,
  ]);
}

function valueRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { denoms, ratios, weighted } = denominationValues(parameters);
  const final = answer(solver);
  return result(parameters, [
    "Value contribution equals count part multiplied by denomination.",
    ...ratios.map((ratio, index) => line(`Type ${index + 1}`, `${ratio}\\times${denoms[index]}=${weighted[index]}`)),
    line("Form the value contributions as a ratio.", weighted.join(":")),
    line("Reduce if necessary.", `${weighted.join(":")}=${final}`),
    `So, the value-contribution ratio is ${final}.`,
  ]);
}

function averageValue(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { ratios, weightedSum, ratioSum } = denominationValues(parameters);
  const final = answer(solver);
  return result(parameters, [
    "Average item value is total weighted value divided by total count parts.",
    line("Weighted value numerator", `${weightedSum}`),
    line("Total count-ratio parts", `${ratios.join("+")}=${ratioSum}`),
    line("Divide numerator by denominator.", `\\frac{${weightedSum}}{${ratioSum}}=${final}`),
    "The common multiplier cancels from both total value and total count.",
    "Therefore, its actual value is not needed.",
    `So, the average value per item is ${final}.`,
  ]);
}

function fourType(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { denoms, ratios, weightedSum, ratioSum } = denominationValues(parameters);
  const unit = n(parameters, "totalValue") / weightedSum;
  const final = answer(solver);
  return result(parameters, [
    line("Let the four counts be the ratio parts multiplied by x.", ratios.map((ratio) => `${ratio}x`).join(":")),
    line("Value represented by one x is", `${ratios.map((ratio, index) => `${ratio}\\times${denoms[index]}`).join("+")}=${weightedSum}`),
    line("Use the total value.", `${weightedSum}x=${n(parameters, "totalValue")}`),
    line("Solve for x.", `x=${unit}`),
    line("Add all four count parts.", `${ratioSum}\\times${unit}=${final}`),
    "The resulting counts preserve the original four-part ratio.",
    `So, the total number of items is ${final}.`,
  ]);
}

function missingPart(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const unit = n(parameters, "commonUnit");
  const oneUnitValue = n(parameters, "totalValue") / unit;
  const knownWeighted = n(parameters, "ratioA") * n(parameters, "denominationA") + n(parameters, "ratioB") * n(parameters, "denominationB");
  const remainingWeighted = oneUnitValue - knownWeighted;
  const final = answer(solver);
  return result(parameters, [
    line("Find the value represented by one common ratio unit.", `\\frac{${n(parameters, "totalValue")}}{${unit}}=${oneUnitValue}`),
    line("Known weighted value from the first two types", `${n(parameters, "ratioA")}\\times${n(parameters, "denominationA")}+${n(parameters, "ratioB")}\\times${n(parameters, "denominationB")}=${knownWeighted}`),
    line("The third type must contribute", `${oneUnitValue}-${knownWeighted}=${remainingWeighted}`),
    line("Let its missing ratio part be x.", `${n(parameters, "denominationC")}x=${remainingWeighted}`),
    line("Solve for x.", `x=\\frac{${remainingWeighted}}{${n(parameters, "denominationC")}}=${final}`),
    "Substitution reproduces the stated total value.",
    `So, the missing ratio part is ${final}.`,
  ]);
}

export function renderRap003DenominationExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "denominationTotalValue": return totalFromUnit(parameters, solver, "total value");
    case "ticketValueSystem": return totalFromUnit(parameters, solver, "total revenue");
    case "marksPerQuestionType": return totalFromUnit(parameters, solver, "total marks");
    case "denominationCountsFromValue": return targetCountFromValue(parameters, solver);
    case "denominationTargetCount": return directTargetCount(parameters, solver);
    case "denominationSwapValue": return swapValue(parameters, solver);
    case "denominationTotalCountFromValue": return totalCountFromValue(parameters, solver);
    case "denominationTotalValueFromTotalCount": return totalValueFromCount(parameters, solver);
    case "denominationValueRatio": return valueRatio(parameters, solver);
    case "denominationAverageValue": return averageValue(parameters, solver);
    case "denominationFourTypeTotalCount": return fourType(parameters, solver);
    case "denominationMissingRatioPart": return missingPart(parameters, solver);
    default: return explanation;
  }
}
