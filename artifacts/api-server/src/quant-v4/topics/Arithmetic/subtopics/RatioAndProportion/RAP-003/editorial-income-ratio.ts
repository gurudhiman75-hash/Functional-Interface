import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

const numberValue = (parameters: Rap003Parameters, key: string) => Number(parameters.variables[key]);
const nameValue = (parameters: Rap003Parameters, key: string, fallback: string) => String(parameters.variables[key] ?? fallback);
const answerText = (solver: Rap003SolverResult) => String(solver.answer).replaceAll("$$", "").trim();
const working = (label: string, math: string) => `${label}\n\n$$\\Rightarrow ${math}$$`;

export function renderRap003IncomeRatioExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  previous: Rap003Explanation,
): Rap003Explanation {
  if (
    parameters.language !== "en"
    || parameters.taskKind !== "incomeFromSavingsRatio"
    || parameters.variables.expenditureUnit === undefined
    || parameters.variables.savingsUnit === undefined
  ) {
    return previous;
  }

  const personA = nameValue(parameters, "personA", "Person A");
  const personB = nameValue(parameters, "personB", "Person B");
  const expenditureA = numberValue(parameters, "expenditureRatioA") * numberValue(parameters, "expenditureUnit");
  const expenditureB = numberValue(parameters, "expenditureRatioB") * numberValue(parameters, "expenditureUnit");
  const savingA = numberValue(parameters, "savingsRatioA") * numberValue(parameters, "savingsUnit");
  const savingB = numberValue(parameters, "savingsRatioB") * numberValue(parameters, "savingsUnit");
  const incomeA = expenditureA + savingA;
  const incomeB = expenditureB + savingB;
  const answer = answerText(solver);

  return {
    explanationId: parameters.explanationId,
    lines: [
      working(`${personA}'s expenditure is`, `${numberValue(parameters, "expenditureRatioA")}\\times${numberValue(parameters, "expenditureUnit")}=${expenditureA}`),
      working(`${personB}'s expenditure is`, `${numberValue(parameters, "expenditureRatioB")}\\times${numberValue(parameters, "expenditureUnit")}=${expenditureB}`),
      working(`${personA}'s saving is`, `${numberValue(parameters, "savingsRatioA")}\\times${numberValue(parameters, "savingsUnit")}=${savingA}`),
      working(`${personB}'s saving is`, `${numberValue(parameters, "savingsRatioB")}\\times${numberValue(parameters, "savingsUnit")}=${savingB}`),
      working(`${personA}'s income is expenditure plus saving.`, `${expenditureA}+${savingA}=${incomeA}`),
      working(`${personB}'s income is expenditure plus saving; reduce the ratio.`, `${expenditureB}+${savingB}=${incomeB},\\quad ${incomeA}:${incomeB}=${answer}`),
      `So, the income ratio is ${answer}.`,
    ],
  };
}
