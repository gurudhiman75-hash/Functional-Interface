import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

const num = (p: Rap003Parameters, key: string) => Number(p.variables[key]);
const text = (p: Rap003Parameters, key: string, fallback: string) => String(p.variables[key] ?? fallback);
const display = (value: number) => String(Math.round(value * 10000) / 10000);
const finalAnswer = (s: Rap003SolverResult) => String(s.answer).replaceAll("$$", "").trim();
const working = (label: string, math: string) => `${label}\n\n$$\\Rightarrow ${math}$$`;

export function renderRap003EqualSavingsExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  previous: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en" || parameters.taskKind !== "incomeExpenditureEqualSavings") return previous;

  const a = text(parameters, "personA", "Person A");
  const b = text(parameters, "personB", "Person B");
  const target = text(parameters, "targetPerson", a);
  const ia = num(parameters, "incomeRatioA");
  const ib = num(parameters, "incomeRatioB");
  const ea = num(parameters, "expenditureRatioA");
  const eb = num(parameters, "expenditureRatioB");

  let x: number;
  let y: number;
  let firstLine: string;
  let equationLine: string;
  let solvedLine: string;

  if (parameters.variables.givenExpenditureB !== undefined) {
    const given = num(parameters, "givenExpenditureB");
    y = given / eb;
    x = ((eb - ea) * y) / (ib - ia);
    firstLine = working(`${b}'s expenditure fixes one expenditure part.`, `y=\\frac{${given}}{${eb}}=${display(y)}`);
    equationLine = working("Use equal savings.", `${ia}x-${ea}(${display(y)})=${ib}x-${eb}(${display(y)})`);
    solvedLine = working("Solve for the income part.", `x=${display(x)}`);
  } else {
    const given = num(parameters, "givenIncomeA");
    x = given / ia;
    y = ((ib - ia) * x) / (eb - ea);
    firstLine = working(`${a}'s income fixes one income part.`, `x=\\frac{${given}}{${ia}}=${display(x)}`);
    equationLine = working("Use equal savings.", `${ia}(${display(x)})-${ea}y=${ib}(${display(x)})-${eb}y`);
    solvedLine = working("Solve for the expenditure part.", `y=${display(y)}`);
  }

  const incomeA = ia * x;
  const incomeB = ib * x;
  const expenseA = ea * y;
  const expenseB = eb * y;
  const savingA = incomeA - expenseA;
  const savingB = incomeB - expenseB;
  const targetIncome = target === b ? incomeB : incomeA;
  const targetExpense = target === b ? expenseB : expenseA;
  const targetSaving = target === b ? savingB : savingA;
  const answer = finalAnswer(solver);

  return {
    explanationId: parameters.explanationId,
    lines: [
      firstLine,
      equationLine,
      solvedLine,
      working("The two incomes are", `${a}: ${display(incomeA)},\\quad ${b}: ${display(incomeB)}`),
      working("The two expenditures are", `${a}: ${display(expenseA)},\\quad ${b}: ${display(expenseB)}`),
      working(`${target}'s saving is`, `${display(targetIncome)}-${display(targetExpense)}=${display(targetSaving)}=${answer}`),
      `So, ${target}'s saving is ${answer}.`,
    ],
  };
}
