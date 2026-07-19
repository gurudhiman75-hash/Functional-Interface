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
  const illiterateMales = maleTotal - literateMales;
  const literateFemales = femaleTotal * femaleLiterateRatio / (femaleLiterateRatio + femaleIlliterateRatio);
  const illiterateFemales = femaleTotal - literateFemales;
  return { total, maleRatio, femaleRatio, maleTotal, femaleTotal, maleLiterateRatio, maleIlliterateRatio, femaleLiterateRatio, femaleIlliterateRatio, literateMales, illiterateMales, literateFemales, illiterateFemales };
}

function cellValue(values: ReturnType<typeof table>, label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("literate males")) return values.literateMales;
  if (normalized.includes("illiterate males")) return values.illiterateMales;
  if (normalized.includes("literate females")) return values.literateFemales;
  if (normalized.includes("illiterate females")) return values.illiterateFemales;
  return 0;
}

function baseLines(parameters: Rap003Parameters, values: ReturnType<typeof table>) {
  return [
    line("Split the total population into males and females.", `\\text{males}=\\frac{${values.maleRatio}}{${values.maleRatio + values.femaleRatio}}\\times${values.total}=${shown(values.maleTotal)},\\quad \\text{females}=${shown(values.femaleTotal)}`),
    line("Split the male total by the male literacy ratio.", `\\text{literate males}=${shown(values.maleTotal)}\\times\\frac{${values.maleLiterateRatio}}{${values.maleLiterateRatio + values.maleIlliterateRatio}}=${shown(values.literateMales)}`),
    line("The remaining males are illiterate.", `${shown(values.maleTotal)}-${shown(values.literateMales)}=${shown(values.illiterateMales)}`),
    line("Split the female total by the female literacy ratio.", `\\text{literate females}=${shown(values.femaleTotal)}\\times\\frac{${values.femaleLiterateRatio}}{${values.femaleLiterateRatio + values.femaleIlliterateRatio}}=${shown(values.literateFemales)}`),
    line("The remaining females are illiterate.", `${shown(values.femaleTotal)}-${shown(values.literateFemales)}=${shown(values.illiterateFemales)}`),
  ];
}

function cellCount(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const label = s(parameters, "targetCellLabel", `${s(parameters, "targetLiteracy", "literate")} ${s(parameters, "targetGroup", "male")}s`);
  const cell = cellValue(values, label);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 5),
    line(`Read the ${label} cell.`, `${shown(cell)}=${answer(solver)}`),
    `So, the number of ${label} is ${answer(solver)}.`,
  ]);
}

function totalLiteracy(parameters: Rap003Parameters, solver: Rap003SolverResult, kind: "literate" | "illiterate") {
  const values = table(parameters);
  const first = kind === "literate" ? values.literateMales : values.illiterateMales;
  const second = kind === "literate" ? values.literateFemales : values.illiterateFemales;
  const final = answer(solver);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 4),
    line(`Add ${kind} males and ${kind} females.`, `${shown(first)}+${shown(second)}=${final}`),
    `These two cells include every ${kind} person in the table.`,
    `So, the total ${kind} population is ${final}.`,
  ]);
}

function literacyPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const literate = values.literateMales + values.literateFemales;
  const final = answer(solver);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 4),
    line("Add literate males and literate females.", `${shown(values.literateMales)}+${shown(values.literateFemales)}=${shown(literate)}`),
    line("Divide by total population and multiply by 100.", `\\frac{${shown(literate)}}{${values.total}}\\times100=${final}`),
    `So, the overall literacy percentage is ${final}.`,
  ]);
}

function cellRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const labelA = s(parameters, "ratioCellA", "first cell");
  const labelB = s(parameters, "ratioCellB", "second cell");
  const first = cellValue(values, labelA);
  const second = cellValue(values, labelB);
  const final = answer(solver);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 3),
    line(`${labelA} equals`, `${shown(first)}`),
    line(`${labelB} equals`, `${shown(second)}`),
    line("Form and reduce the two-cell ratio.", `${shown(first)}:${shown(second)}=${final}`),
    `So, ${labelA}:${labelB} is ${final}.`,
  ]);
}

function cellPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const values = table(parameters);
  const label = s(parameters, "targetCellLabel", "target cell");
  const cell = cellValue(values, label);
  const final = answer(solver);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 4),
    line(`The ${label} cell is`, `${shown(cell)}`),
    line("Convert this cell to a percentage of total population.", `\\frac{${shown(cell)}}{${values.total}}\\times100=${final}`),
    `So, ${final} of the total population are ${label}.`,
  ]);
}

function recoverTotal(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const label = s(parameters, "knownCellLabel", "known cell");
  const known = n(parameters, "knownCellValue");
  const maleRatio = n(parameters, "maleRatio");
  const femaleRatio = n(parameters, "femaleRatio");
  const groupFraction = label.includes("female") ? femaleRatio / (maleRatio + femaleRatio) : maleRatio / (maleRatio + femaleRatio);
  const literateRatio = label.includes("female") ? n(parameters, "femaleLiterateRatio") : n(parameters, "maleLiterateRatio");
  const illiterateRatio = label.includes("female") ? n(parameters, "femaleIlliterateRatio") : n(parameters, "maleIlliterateRatio");
  const withinFraction = label.includes("illiterate") ? illiterateRatio / (literateRatio + illiterateRatio) : literateRatio / (literateRatio + illiterateRatio);
  const cellFraction = groupFraction * withinFraction;
  const total = known / cellFraction;
  const final = answer(solver);
  return result(parameters, [
    line("Find the male/female fraction containing the known cell.", `${shown(groupFraction)}`),
    line("Find the literacy fraction within that group.", `${shown(withinFraction)}`),
    line(`Therefore, ${label} form this fraction of the full population.`, `${shown(groupFraction)}\\times${shown(withinFraction)}=${shown(cellFraction)}`),
    line("Let total population be T.", `${shown(cellFraction)}T=${known}`),
    line("Solve for T.", `T=\\frac{${known}}{${shown(cellFraction)}}=${shown(total)}=${final}`),
    "Forward calculation reproduces the known cell value.",
    `So, the total population is ${final}.`,
  ]);
}

function differenceOrSum(parameters: Rap003Parameters, solver: Rap003SolverResult, operation: "difference" | "sum") {
  const values = table(parameters);
  const labelA = s(parameters, "ratioCellA", "first cell");
  const labelB = s(parameters, "ratioCellB", "second cell");
  const first = cellValue(values, labelA);
  const second = cellValue(values, labelB);
  const final = answer(solver);
  return result(parameters, [
    ...baseLines(parameters, values).slice(0, 3),
    line(`${labelA} equals`, `${shown(first)}`),
    line(`${labelB} equals`, `${shown(second)}`),
    operation === "difference" ? line("Take the absolute difference.", `|${shown(first)}-${shown(second)}|=${final}`) : line("Add the two selected cells.", `${shown(first)}+${shown(second)}=${final}`),
    `So, the ${operation} is ${final}.`,
  ]);
}

function threeRows(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalPopulation");
  const ratioA = n(parameters, "ratioA");
  const ratioB = n(parameters, "ratioB");
  const ratioC = n(parameters, "ratioC");
  const firstGroup = total * ratioA / (ratioA + ratioB + ratioC);
  const passed = firstGroup * n(parameters, "passRatioA") / (n(parameters, "passRatioA") + n(parameters, "failRatioA"));
  const final = answer(solver);
  return result(parameters, [
    line("Add the three group-ratio parts.", `${ratioA}+${ratioB}+${ratioC}=${ratioA + ratioB + ratioC}`),
    line("Find the first group's total.", `${total}\\times\\frac{${ratioA}}{${ratioA + ratioB + ratioC}}=${shown(firstGroup)}`),
    line("Add the passed and failed parts in the first group.", `${n(parameters, "passRatioA")}+${n(parameters, "failRatioA")}=${n(parameters, "passRatioA") + n(parameters, "failRatioA")}`),
    line("Passed students are the passed fraction of the first group.", `${shown(firstGroup)}\\times\\frac{${n(parameters, "passRatioA")}}{${n(parameters, "passRatioA") + n(parameters, "failRatioA")}}`),
    line("Evaluate the product.", `${shown(passed)}=${final}`),
    "The other two main groups do not affect the requested first-group cell.",
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
