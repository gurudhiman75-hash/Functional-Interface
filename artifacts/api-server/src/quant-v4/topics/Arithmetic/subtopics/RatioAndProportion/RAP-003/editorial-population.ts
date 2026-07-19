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

function table(parameters: Rap003Parameters) {
  const total = n(parameters, "totalPopulation");
  const maleRatio = n(parameters, "maleRatio");
  const femaleRatio = n(parameters, "femaleRatio");
  const maleTotal = total * maleRatio / (maleRatio + femaleRatio);
  const femaleTotal = total - maleTotal;
  const maleLiterateRatio = n(parameters, "maleLiterateRatio");
  const maleIlliterateRatio = n(parameters, "maleIlliterateRatio");
  const femaleLiterateRatio = n(parameters, "femaleLiterateRatio");
  const femaleIlliterateRatio = n(parameters, "femaleIlliterateRatio");
  const literateMales = maleTotal * maleLiterateRatio / (maleLiterateRatio + maleIlliterateRatio);
  const illiterateMales = maleTotal * maleIlliterateRatio / (maleLiterateRatio + maleIlliterateRatio);
  const literateFemales = femaleTotal * femaleLiterateRatio / (femaleLiterateRatio + femaleIlliterateRatio);
  const illiterateFemales = femaleTotal * femaleIlliterateRatio / (femaleLiterateRatio + femaleIlliterateRatio);
  return {
    total,
    maleRatio,
    femaleRatio,
    maleTotal,
    femaleTotal,
    maleLiterateRatio,
    maleIlliterateRatio,
    femaleLiterateRatio,
    femaleIlliterateRatio,
    literateMales,
    illiterateMales,
    literateFemales,
    illiterateFemales,
  };
}

function normalizedCell(label: string) {
  const normalized = label.toLowerCase();
  // Check illiterate before literate because "illiterate" contains "literate".
  if (normalized.includes("illiterate males")) return "illiterate males";
  if (normalized.includes("literate males")) return "literate males";
  if (normalized.includes("illiterate females")) return "illiterate females";
  if (normalized.includes("literate females")) return "literate females";
  return normalized;
}

function cellValue(values: ReturnType<typeof table>, label: string) {
  switch (normalizedCell(label)) {
    case "illiterate males": return values.illiterateMales;
    case "literate males": return values.literateMales;
    case "illiterate females": return values.illiterateFemales;
    case "literate females": return values.literateFemales;
    default: return 0;
  }
}

function groupTotalsLine(values: ReturnType<typeof table>) {
  return line(
    "First split the population into males and females.",
    `\\text{males}=\\frac{${values.maleRatio}}{${values.maleRatio + values.femaleRatio}}\\times${values.total}=${shown(values.maleTotal)},\\quad \\text{females}=${shown(values.femaleTotal)}`,
  );
}

function cellCalculationLine(values: ReturnType<typeof table>, rawLabel: string) {
  const label = normalizedCell(rawLabel);
  const isFemale = label.includes("female");
  const isIlliterate = label.includes("illiterate");
  const groupTotal = isFemale ? values.femaleTotal : values.maleTotal;
  const literatePart = isFemale ? values.femaleLiterateRatio : values.maleLiterateRatio;
  const illiteratePart = isFemale ? values.femaleIlliterateRatio : values.maleIlliterateRatio;
  const targetPart = isIlliterate ? illiteratePart : literatePart;
  const cell = cellValue(values, label);
  return line(
    `Now find ${label}.`,
    `\\text{${label}}=${shown(groupTotal)}\\times\\frac{${targetPart}}{${literatePart + illiteratePart}}=${shown(cell)}`,
  );
}

function cellCount(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const label = normalizedCell(s(parameters, "targetCellLabel", `${s(parameters, "targetLiteracy", "literate")} ${s(parameters, "targetGroup", "male")}s`));
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, label),
    `So, the number of ${label} is ${answer(solver)}.`,
  ]);
}

function totalLiteracy(parameters: Rap003Parameters, solver: Rap003SolverResult, kind: "literate" | "illiterate") {
  const values = table(parameters);
  const maleLabel = `${kind} males`;
  const femaleLabel = `${kind} females`;
  const first = cellValue(values, maleLabel);
  const second = cellValue(values, femaleLabel);
  const final = answer(solver);
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, maleLabel),
    cellCalculationLine(values, femaleLabel),
    line(`Add ${maleLabel} and ${femaleLabel}.`, `${shown(first)}+${shown(second)}=${final}`),
    `So, the total ${kind} population is ${final}.`,
  ]);
}

function literacyPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const literate = values.literateMales + values.literateFemales;
  const final = answer(solver);
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, "literate males"),
    cellCalculationLine(values, "literate females"),
    line("Add the two literate groups.", `${shown(values.literateMales)}+${shown(values.literateFemales)}=${shown(literate)}`),
    line("Convert this total to a percentage of the population.", `\\frac{${shown(literate)}}{${values.total}}\\times100=${final}`),
    `So, the overall literacy percentage is ${final}.`,
  ]);
}

function cellRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const labelA = normalizedCell(s(parameters, "ratioCellA", "first cell"));
  const labelB = normalizedCell(s(parameters, "ratioCellB", "second cell"));
  const first = cellValue(values, labelA);
  const second = cellValue(values, labelB);
  const final = answer(solver);
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, labelA),
    cellCalculationLine(values, labelB),
    line("Form and reduce the two-cell ratio.", `${shown(first)}:${shown(second)}=${final}`),
    `So, ${labelA}:${labelB} is ${final}.`,
  ]);
}

function cellPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const label = normalizedCell(s(parameters, "targetCellLabel", "target cell"));
  const cell = cellValue(values, label);
  const final = answer(solver);
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, label),
    line("Convert this cell to a percentage of the total population.", `\\frac{${shown(cell)}}{${values.total}}\\times100=${final}`),
    `So, ${final} of the total population are ${label}.`,
  ]);
}

function recoverTotal(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const label = normalizedCell(s(parameters, "knownCellLabel", "known cell"));
  const known = n(parameters, "knownCellValue");
  const maleRatio = n(parameters, "maleRatio");
  const femaleRatio = n(parameters, "femaleRatio");
  const isFemale = label.includes("female");
  const isIlliterate = label.includes("illiterate");
  const groupFraction = isFemale ? femaleRatio / (maleRatio + femaleRatio) : maleRatio / (maleRatio + femaleRatio);
  const literateRatio = isFemale ? n(parameters, "femaleLiterateRatio") : n(parameters, "maleLiterateRatio");
  const illiterateRatio = isFemale ? n(parameters, "femaleIlliterateRatio") : n(parameters, "maleIlliterateRatio");
  const withinFraction = isIlliterate ? illiterateRatio / (literateRatio + illiterateRatio) : literateRatio / (literateRatio + illiterateRatio);
  const cellFraction = groupFraction * withinFraction;
  const total = known / cellFraction;
  const final = answer(solver);
  return result(parameters, [
    line(`Find the fraction of the population represented by ${label}.`, `${shown(groupFraction)}\\times${shown(withinFraction)}=${shown(cellFraction)}`),
    line("Let the total population be T.", `${shown(cellFraction)}T=${known}`),
    line("Solve for T.", `T=\\frac{${known}}{${shown(cellFraction)}}=${shown(total)}=${final}`),
    `So, the total population is ${final}.`,
  ]);
}

function differenceOrSum(parameters: Rap003Parameters, solver: Rap003SolverResult, operation: "difference" | "sum") {
  const values = table(parameters);
  const labelA = normalizedCell(s(parameters, "ratioCellA", "first cell"));
  const labelB = normalizedCell(s(parameters, "ratioCellB", "second cell"));
  const first = cellValue(values, labelA);
  const second = cellValue(values, labelB);
  const final = answer(solver);
  return result(parameters, [
    groupTotalsLine(values),
    cellCalculationLine(values, labelA),
    cellCalculationLine(values, labelB),
    operation === "difference"
      ? line("Take the absolute difference.", `|${shown(first)}-${shown(second)}|=${final}`)
      : line("Add the two selected cells.", `${shown(first)}+${shown(second)}=${final}`),
    `So, the ${operation} is ${final}.`,
  ]);
}

function threeRows(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalPopulation");
  const ratioA = n(parameters, "ratioA");
  const ratioB = n(parameters, "ratioB");
  const ratioC = n(parameters, "ratioC");
  const firstGroup = total * ratioA / (ratioA + ratioB + ratioC);
  const passRatio = n(parameters, "passRatioA");
  const failRatio = n(parameters, "failRatioA");
  const passed = firstGroup * passRatio / (passRatio + failRatio);
  const final = answer(solver);
  return result(parameters, [
    line("Find the first group's total.", `${total}\\times\\frac{${ratioA}}{${ratioA + ratioB + ratioC}}=${shown(firstGroup)}`),
    line("Take the passed fraction of that group.", `${shown(firstGroup)}\\times\\frac{${passRatio}}{${passRatio + failRatio}}=${shown(passed)}=${final}`),
    `So, ${final} students passed in the first group.`,
  ]);
}

export function renderRap003PopulationExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "populationCrossTabCellCount":
    case "populationMissingRowTotal": return cellCount(parameters, solver);
    case "populationTotalLiterate": return totalLiteracy(parameters, solver, "literate");
    case "populationTotalIlliterate": return totalLiteracy(parameters, solver, "illiterate");
    case "populationLiteracyPercent": return literacyPercent(parameters, solver);
    case "populationCellRatio":
    case "populationMiniCaseletQuestion2":
    case "populationColumnRatioGiven":
    case "populationTableValidationTrap": return cellRatio(parameters, solver);
    case "populationCellPercentOfTotal": return cellPercent(parameters, solver);
    case "populationRecoverTotalFromCell": return recoverTotal(parameters, solver);
    case "populationDifferenceBetweenCells":
    case "populationMiniCaseletQuestion1": return differenceOrSum(parameters, solver, "difference");
    case "populationSumOfSelectedCells": return differenceOrSum(parameters, solver, "sum");
    case "populationThreeRows": return threeRows(parameters, solver);
    default: return explanation;
  }
}
