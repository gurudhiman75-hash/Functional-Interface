import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

const numberValue = (parameters: Rap003Parameters, key: string) => Number(parameters.variables[key]);
const nameValue = (parameters: Rap003Parameters, key: string, fallback: string) => String(parameters.variables[key] ?? fallback);
const answerText = (solver: Rap003SolverResult) => String(solver.answer).replaceAll("$$", "").trim();
const working = (label: string, math: string) => `${label}\n\n$$\\Rightarrow ${math}$$`;

export function renderRap003ExpenditureRatioExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  previous: Rap003Explanation,
): Rap003Explanation {
  if (
    parameters.language !== "en"
    || parameters.taskKind !== "expenditureFromSavingsRatio"
    || parameters.variables.incomeUnit === undefined
    || parameters.variables.savingsUnit === undefined
  ) {
    return previous;
  }

  const personA = nameValue(parameters, "personA", "Person A");
  const personB = nameValue(parameters, "personB", "Person B");
  const incomeA = numberValue(parameters, "incomeRatioA") * numberValue(parameters, "incomeUnit");
  const incomeB = numberValue(parameters, "incomeRatioB") * numberValue(parameters, "incomeUnit");
  const savingA = numberValue(parameters, "savingsRatioA") * numberValue(parameters, "savingsUnit");
  const savingB = numberValue(parameters, "savingsRatioB") * numberValue(parameters, "savingsUnit");
  const expenditureA = incomeA - savingA;
  const expenditureB = incomeB - savingB;
  const answer = answerText(solver);

  return {
    explanationId: parameters.explanationId,
    lines: [
      working(`${personA}'s income is`, `${numberValue(parameters, "incomeRatioA")}\\times${numberValue(parameters, "incomeUnit")}=${incomeA}`),
      working(`${personB}'s income is`, `${numberValue(parameters, "incomeRatioB")}\\times${numberValue(parameters, "incomeUnit")}=${incomeB}`),
      working(`${personA}'s saving is`, `${numberValue(parameters, "savingsRatioA")}\\times${numberValue(parameters, "savingsUnit")}=${savingA}`),
      working(`${personB}'s saving is`, `${numberValue(parameters, "savingsRatioB")}\\times${numberValue(parameters, "savingsUnit")}=${savingB}`),
      working(`${personA}'s expenditure is income minus saving.`, `${incomeA}-${savingA}=${expenditureA}`),
      working(`${personB}'s expenditure is income minus saving; reduce the ratio.`, `${incomeB}-${savingB}=${expenditureB},\\quad ${expenditureA}:${expenditureB}=${answer}`),
      `So, the expenditure ratio is ${answer}.`,
    ],
  };
}
