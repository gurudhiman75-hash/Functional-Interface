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

function people(parameters: Rap003Parameters) {
  return {
    personA: s(parameters, "personA", "Person A"),
    personB: s(parameters, "personB", "Person B"),
  };
}

function savingsFromUnits(parameters: Rap003Parameters, solver: Rap003SolverResult, labels: { income?: string; expense?: string; saving?: string } = {}) {
  const { personA, personB } = people(parameters);
  const incomeUnit = n(parameters, "incomeUnit");
  const expenseUnit = n(parameters, "expenditureUnit");
  const incomeA = n(parameters, "incomeRatioA") * incomeUnit;
  const incomeB = n(parameters, "incomeRatioB") * incomeUnit;
  const expenseA = n(parameters, "expenditureRatioA") * expenseUnit;
  const expenseB = n(parameters, "expenditureRatioB") * expenseUnit;
  const savingA = incomeA - expenseA;
  const savingB = incomeB - expenseB;
  const final = answer(solver);
  return result(parameters, [
    line(`Calculate ${personA}'s ${labels.income ?? "income"}.`, `${n(parameters, "incomeRatioA")}\\times${incomeUnit}=${incomeA}`),
    line(`Calculate ${personB}'s ${labels.income ?? "income"}.`, `${n(parameters, "incomeRatioB")}\\times${incomeUnit}=${incomeB}`),
    line(`Calculate their ${labels.expense ?? "expenditures"}.`, `${personA}: ${n(parameters, "expenditureRatioA")}\\times${expenseUnit}=${expenseA},\\quad ${personB}: ${n(parameters, "expenditureRatioB")}\\times${expenseUnit}=${expenseB}`),
    line(`${personA}'s ${labels.saving ?? "saving"} is`, `${incomeA}-${expenseA}=${savingA}`),
    line(`${personB}'s ${labels.saving ?? "saving"} is`, `${incomeB}-${expenseB}=${savingB}`),
    line("Form and reduce the required ratio.", `${savingA}:${savingB}=${final}`),
    `So, the required ${labels.saving ?? "savings"} ratio is ${final}.`,
  ]);
}

function equalSavings(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const incomeScale = n(parameters, "givenIncomeA") / n(parameters, "incomeRatioA");
  const expenseScale = (n(parameters, "incomeRatioB") - n(parameters, "incomeRatioA")) * incomeScale
    / (n(parameters, "expenditureRatioB") - n(parameters, "expenditureRatioA"));
  const incomeA = n(parameters, "incomeRatioA") * incomeScale;
  const incomeB = n(parameters, "incomeRatioB") * incomeScale;
  const expenseA = n(parameters, "expenditureRatioA") * expenseScale;
  const expenseB = n(parameters, "expenditureRatioB") * expenseScale;
  const saving = incomeB - expenseB;
  const final = answer(solver);
  return result(parameters, [
    line(`${personA}'s income fixes the income-ratio unit.`, `${incomeScale}=\\frac{${n(parameters, "givenIncomeA")}}{${n(parameters, "incomeRatioA")}}`),
    line("Therefore, the two incomes are", `${personA}: ${incomeA},\\quad ${personB}: ${incomeB}`),
    line("Let one expenditure-ratio unit be y and use equal savings.", `${incomeA}-${n(parameters, "expenditureRatioA")}y=${incomeB}-${n(parameters, "expenditureRatioB")}y`),
    line("Solving gives the expenditure unit.", `y=${shown(expenseScale)}`),
    line(`${personB}'s expenditure is`, `${n(parameters, "expenditureRatioB")}\\times${shown(expenseScale)}=${shown(expenseB)}`),
    line(`${personB}'s saving is`, `${incomeB}-${shown(expenseB)}=${shown(saving)}`),
    `So, ${personB}'s saving is ${final}.`,
  ]);
}

function incomeFromSavings(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const expenseScale = n(parameters, "givenExpenditureB") / n(parameters, "expenditureRatioB");
  const numerator = (n(parameters, "savingsRatioA") * n(parameters, "expenditureRatioB")
    - n(parameters, "savingsRatioB") * n(parameters, "expenditureRatioA")) * expenseScale;
  const denominator = n(parameters, "savingsRatioA") * n(parameters, "incomeRatioB")
    - n(parameters, "savingsRatioB") * n(parameters, "incomeRatioA");
  const incomeScale = numerator / denominator;
  const target = s(parameters, "targetPerson", personA);
  const targetPart = target === personB ? n(parameters, "incomeRatioB") : n(parameters, "incomeRatioA");
  const final = answer(solver);
  return result(parameters, [
    line(`${personB}'s expenditure fixes the expenditure-ratio unit.`, `y=\\frac{${n(parameters, "givenExpenditureB")}}{${n(parameters, "expenditureRatioB")}}=${shown(expenseScale)}`),
    "Let one income-ratio unit be x.",
    line("Use the stated savings ratio.", `\\frac{${n(parameters, "incomeRatioA")}x-${n(parameters, "expenditureRatioA")}(${shown(expenseScale)})}{${n(parameters, "incomeRatioB")}x-${n(parameters, "expenditureRatioB")}(${shown(expenseScale)})}=\\frac{${n(parameters, "savingsRatioA")}}{${n(parameters, "savingsRatioB")}}`),
    line("Cross-multiply and solve for x.", `x=${shown(incomeScale)}`),
    line(`${target}'s income uses ${targetPart} income parts.`, `${targetPart}\\times${shown(incomeScale)}=${final}`),
    "The resulting incomes and expenditures reproduce the stated savings ratio.",
    `So, ${target}'s income is ${final}.`,
  ]);
}

function expenditureFromSavings(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const incomeScale = n(parameters, "givenIncomeA") / n(parameters, "incomeRatioA");
  const numerator = (n(parameters, "savingsRatioB") * n(parameters, "incomeRatioA")
    - n(parameters, "savingsRatioA") * n(parameters, "incomeRatioB")) * incomeScale;
  const denominator = n(parameters, "savingsRatioB") * n(parameters, "expenditureRatioA")
    - n(parameters, "savingsRatioA") * n(parameters, "expenditureRatioB");
  const expenseScale = numerator / denominator;
  const target = s(parameters, "targetPerson", personB);
  const targetPart = target === personA ? n(parameters, "expenditureRatioA") : n(parameters, "expenditureRatioB");
  const final = answer(solver);
  return result(parameters, [
    line(`${personA}'s income fixes the income-ratio unit.`, `x=\\frac{${n(parameters, "givenIncomeA")}}{${n(parameters, "incomeRatioA")}}=${shown(incomeScale)}`),
    "Let one expenditure-ratio unit be y.",
    line("Use the stated savings ratio.", `\\frac{${n(parameters, "incomeRatioA")}(${shown(incomeScale)})-${n(parameters, "expenditureRatioA")}y}{${n(parameters, "incomeRatioB")}(${shown(incomeScale)})-${n(parameters, "expenditureRatioB")}y}=\\frac{${n(parameters, "savingsRatioA")}}{${n(parameters, "savingsRatioB")}}`),
    line("Cross-multiply and solve for y.", `y=${shown(expenseScale)}`),
    line(`${target}'s expenditure uses ${targetPart} expenditure parts.`, `${targetPart}\\times${shown(expenseScale)}=${final}`),
    "The calculated values reproduce the required savings ratio.",
    `So, ${target}'s expenditure is ${final}.`,
  ]);
}

function commonUnitDifference(parameters: Rap003Parameters, solver: Rap003SolverResult, targetKind: "income" | "saving") {
  const { personA, personB } = people(parameters);
  const savingPartA = n(parameters, "incomeRatioA") - n(parameters, "expenditureRatioA");
  const savingPartB = n(parameters, "incomeRatioB") - n(parameters, "expenditureRatioB");
  const difference = targetKind === "income" ? n(parameters, "savingsDifference") : n(parameters, "expenseDifference");
  const unit = targetKind === "income"
    ? difference / Math.abs(savingPartA - savingPartB)
    : difference / Math.abs(n(parameters, "expenditureRatioA") - n(parameters, "expenditureRatioB"));
  const target = s(parameters, "targetPerson", personA);
  const targetIncomePart = target === personB ? n(parameters, "incomeRatioB") : n(parameters, "incomeRatioA");
  const targetSavingPart = target === personB ? savingPartB : savingPartA;
  const final = answer(solver);
  return result(parameters, [
    "Because the same unit is used, subtract the expenditure part from the income part.",
    line(`${personA}'s saving coefficient is`, `${n(parameters, "incomeRatioA")}-${n(parameters, "expenditureRatioA")}=${savingPartA}`),
    line(`${personB}'s saving coefficient is`, `${n(parameters, "incomeRatioB")}-${n(parameters, "expenditureRatioB")}=${savingPartB}`),
    line("Use the stated difference to find the common unit.", `x=${difference}\\div${targetKind === "income" ? Math.abs(savingPartA - savingPartB) : Math.abs(n(parameters, "expenditureRatioA") - n(parameters, "expenditureRatioB"))}=${shown(unit)}`),
    line(`${target}'s required ${targetKind} is`, `${targetKind === "income" ? targetIncomePart : targetSavingPart}\\times${shown(unit)}=${final}`),
    "Substitution gives the stated difference between the two amounts.",
    `So, ${target}'s ${targetKind} is ${final}.`,
  ]);
}

function savingsSum(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const savingPartA = n(parameters, "incomeRatioA") - n(parameters, "expenditureRatioA");
  const savingPartB = n(parameters, "incomeRatioB") - n(parameters, "expenditureRatioB");
  const unit = n(parameters, "savingsSum") / (savingPartA + savingPartB);
  const target = s(parameters, "targetPerson", personB);
  const targetExpensePart = target === personA ? n(parameters, "expenditureRatioA") : n(parameters, "expenditureRatioB");
  const final = answer(solver);
  return result(parameters, [
    line(`${personA}'s saving coefficient is`, `${n(parameters, "incomeRatioA")}-${n(parameters, "expenditureRatioA")}=${savingPartA}`),
    line(`${personB}'s saving coefficient is`, `${n(parameters, "incomeRatioB")}-${n(parameters, "expenditureRatioB")}=${savingPartB}`),
    line("Their total savings correspond to", `${savingPartA}+${savingPartB}=${savingPartA + savingPartB}\\text{ units}`),
    line("Find the common unit.", `x=\\frac{${n(parameters, "savingsSum")}}{${savingPartA + savingPartB}}=${shown(unit)}`),
    line(`${target}'s expenditure is`, `${targetExpensePart}\\times${shown(unit)}=${final}`),
    "The two savings add to the stated total.",
    `So, ${target}'s expenditure is ${final}.`,
  ]);
}

function savingsPercentRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const rawA = n(parameters, "incomeRatioA") * n(parameters, "savePercentA");
  const rawB = n(parameters, "incomeRatioB") * n(parameters, "savePercentB");
  const final = answer(solver);
  return result(parameters, [
    "Savings are proportional to income part multiplied by savings percentage.",
    line(`${personA}'s savings weight is`, `${n(parameters, "incomeRatioA")}\\times${n(parameters, "savePercentA")}=${rawA}`),
    line(`${personB}'s savings weight is`, `${n(parameters, "incomeRatioB")}\\times${n(parameters, "savePercentB")}=${rawB}`),
    line("Form the savings ratio.", `${rawA}:${rawB}`),
    line("Reduce it to lowest terms.", `${rawA}:${rawB}=${final}`),
    "No monetary unit is needed because only a ratio is required.",
    `So, their savings ratio is ${final}.`,
  ]);
}

function savingPercentage(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const target = s(parameters, "targetPerson", personA);
  const isA = target === personA;
  const income = n(parameters, isA ? "incomeRatioA" : "incomeRatioB") * n(parameters, "incomeUnit");
  const expense = n(parameters, isA ? "expenditureRatioA" : "expenditureRatioB") * n(parameters, "expenditureUnit");
  const saving = income - expense;
  const final = answer(solver);
  return result(parameters, [
    line(`${target}'s income is`, `${n(parameters, isA ? "incomeRatioA" : "incomeRatioB")}\\times${n(parameters, "incomeUnit")}=${income}`),
    line(`${target}'s expenditure is`, `${n(parameters, isA ? "expenditureRatioA" : "expenditureRatioB")}\\times${n(parameters, "expenditureUnit")}=${expense}`),
    line(`${target}'s saving is`, `${income}-${expense}=${saving}`),
    line("Saving percentage equals saving divided by income, multiplied by 100.", `\\frac{${saving}}{${income}}\\times100`),
    line("Evaluating gives", `${final}`),
    "The percentage is measured against income, not expenditure.",
    `So, ${target} saves ${final} of income.`,
  ]);
}

function combinedSavings(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const incomeA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
  const incomeB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
  const expenseA = n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit");
  const expenseB = n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit");
  const savingA = incomeA - expenseA;
  const savingB = incomeB - expenseB;
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the two incomes.", `${personA}: ${incomeA},\\quad ${personB}: ${incomeB}`),
    line("Calculate the two expenditures.", `${personA}: ${expenseA},\\quad ${personB}: ${expenseB}`),
    line(`${personA}'s saving is`, `${incomeA}-${expenseA}=${savingA}`),
    line(`${personB}'s saving is`, `${incomeB}-${expenseB}=${savingB}`),
    line("Add the two savings.", `${savingA}+${savingB}=${final}`),
    "This is the amount left after both families' expenditures.",
    `So, their combined savings are ${final}.`,
  ]);
}

function salaryDifference(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const unit = n(parameters, "incomeUnit");
  const savingA = (n(parameters, "incomeRatioA") - n(parameters, "expenditureRatioA")) * unit;
  const savingB = (n(parameters, "incomeRatioB") - n(parameters, "expenditureRatioB")) * unit;
  const final = answer(solver);
  return result(parameters, [
    "The same monetary unit applies to salary and spending ratios.",
    line(`${personA}'s saving is`, `(${n(parameters, "incomeRatioA")}-${n(parameters, "expenditureRatioA")})\\times${unit}=${savingA}`),
    line(`${personB}'s saving is`, `(${n(parameters, "incomeRatioB")}-${n(parameters, "expenditureRatioB")})\\times${unit}=${savingB}`),
    line("Find the absolute difference.", `|${savingA}-${savingB}|=${final}`),
    "The larger saving belongs to the person with the larger remaining ratio part.",
    "Both savings use the same common unit.",
    `So, the difference between their savings is ${final}.`,
  ]);
}

function profitRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const revenueA = n(parameters, "revenueRatioA") * n(parameters, "revenueUnit");
  const revenueB = n(parameters, "revenueRatioB") * n(parameters, "revenueUnit");
  const costA = n(parameters, "costRatioA") * n(parameters, "costUnit");
  const costB = n(parameters, "costRatioB") * n(parameters, "costUnit");
  const profitA = revenueA - costA;
  const profitB = revenueB - costB;
  const final = answer(solver);
  return result(parameters, [
    line(`${personA}'s revenue and cost are`, `${revenueA}\\text{ and }${costA}`),
    line(`${personB}'s revenue and cost are`, `${revenueB}\\text{ and }${costB}`),
    line(`${personA}'s profit is`, `${revenueA}-${costA}=${profitA}`),
    line(`${personB}'s profit is`, `${revenueB}-${costB}=${profitB}`),
    line("Form and reduce the profit ratio.", `${profitA}:${profitB}=${final}`),
    "Profit is revenue minus cost for each shop separately.",
    `So, their profit ratio is ${final}.`,
  ]);
}

function equalIncome(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const income = n(parameters, "incomeValue");
  const expenseA = n(parameters, "expenditureRatioA") * n(parameters, "expenditureUnit");
  const expenseB = n(parameters, "expenditureRatioB") * n(parameters, "expenditureUnit");
  const savingA = income - expenseA;
  const savingB = income - expenseB;
  const final = answer(solver);
  return result(parameters, [
    line("Both incomes are equal.", `${personA}:${personB}=${income}:${income}`),
    line("Their expenditures are", `${expenseA}:${expenseB}`),
    line(`${personA}'s saving is`, `${income}-${expenseA}=${savingA}`),
    line(`${personB}'s saving is`, `${income}-${expenseB}=${savingB}`),
    line("Reduce the savings ratio.", `${savingA}:${savingB}=${final}`),
    "The larger expenditure produces the smaller saving.",
    `So, their savings ratio is ${final}.`,
  ]);
}

function equalExpense(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB } = people(parameters);
  const expense = n(parameters, "expenseValue");
  const incomeA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
  const incomeB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
  const savingA = incomeA - expense;
  const savingB = incomeB - expense;
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the two incomes.", `${personA}: ${incomeA},\\quad ${personB}: ${incomeB}`),
    line("Both expenditures are equal.", `${personA}:${personB}=${expense}:${expense}`),
    line(`${personA}'s saving is`, `${incomeA}-${expense}=${savingA}`),
    line(`${personB}'s saving is`, `${incomeB}-${expense}=${savingB}`),
    line("Reduce the savings ratio.", `${savingA}:${savingB}=${final}`),
    "The equal expenditure is subtracted from each income separately.",
    `So, their savings ratio is ${final}.`,
  ]);
}

function totalIncome(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const ratioSum = n(parameters, "incomeRatioA") + n(parameters, "incomeRatioB");
  const incomeUnit = n(parameters, "totalIncome") / ratioSum;
  const totalExpense = (n(parameters, "expenditureRatioA") + n(parameters, "expenditureRatioB")) * n(parameters, "expenditureUnit");
  const final = answer(solver);
  return result(parameters, [
    line("Find one income-ratio unit from the total income.", `x=\\frac{${n(parameters, "totalIncome")}}{${ratioSum}}=${shown(incomeUnit)}`),
    line("The two individual incomes are", `${n(parameters, "incomeRatioA")}\\times${shown(incomeUnit)}:${n(parameters, "incomeRatioB")}\\times${shown(incomeUnit)}`),
    line("Calculate the combined expenditure.", `(${n(parameters, "expenditureRatioA")}+${n(parameters, "expenditureRatioB")})\\times${n(parameters, "expenditureUnit")}=${totalExpense}`),
    line("Combined savings equal total income minus total expenditure.", `${n(parameters, "totalIncome")}-${totalExpense}=${final}`),
    "The income ratio only splits the known total; it does not change it.",
    "Both expenditures are included in the combined amount.",
    `So, their combined savings are ${final}.`,
  ]);
}

function totalExpense(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const expenseRatioSum = n(parameters, "expenditureRatioA") + n(parameters, "expenditureRatioB");
  const expenseUnit = n(parameters, "totalExpense") / expenseRatioSum;
  const incomeA = n(parameters, "incomeRatioA") * n(parameters, "incomeUnit");
  const incomeB = n(parameters, "incomeRatioB") * n(parameters, "incomeUnit");
  const final = answer(solver);
  return result(parameters, [
    line("Find one expenditure-ratio unit from the total expenditure.", `y=\\frac{${n(parameters, "totalExpense")}}{${expenseRatioSum}}=${shown(expenseUnit)}`),
    line("The two expenditures are", `${n(parameters, "expenditureRatioA")}\\times${shown(expenseUnit)}:${n(parameters, "expenditureRatioB")}\\times${shown(expenseUnit)}`),
    line("Calculate the two incomes from the income unit.", `${incomeA}:${incomeB}`),
    line("Add the two incomes.", `${incomeA}+${incomeB}=${final}`),
    "The question asks for combined income, so no savings subtraction is required.",
    "The calculated expenditures add to the given total expenditure.",
    `So, their combined income is ${final}.`,
  ]);
}

export function renderRap003IncomeExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "incomeExpenditureSavingsRatio":
    case "incomeExpenseSavingsComparison": return savingsFromUnits(parameters, solver);
    case "incomeExpenditureEqualSavings": return equalSavings(parameters, solver);
    case "incomeFromSavingsRatio": return incomeFromSavings(parameters, solver);
    case "expenditureFromSavingsRatio": return expenditureFromSavings(parameters, solver);
    case "incomeExpenseDifferenceSavings":
    case "givenOneSavesMore": return commonUnitDifference(parameters, solver, "income");
    case "incomeExpenseSumSavings": return savingsSum(parameters, solver);
    case "incomeExpenseOneSavesPercent": return savingsPercentRatio(parameters, solver);
    case "incomeExpenseFindSavingsPercent": return savingPercentage(parameters, solver);
    case "familyIncomeExpenditure": return combinedSavings(parameters, solver);
    case "salarySpendingSavings": return salaryDifference(parameters, solver);
    case "shopRevenueCostProfit": return profitRatio(parameters, solver);
    case "equalIncomeDifferentExpense": return equalIncome(parameters, solver);
    case "equalExpenseDifferentIncome": return equalExpense(parameters, solver);
    case "pocketMoneySpending": return savingsFromUnits(parameters, solver, { income: "pocket money", expense: "spending", saving: "saving" });
    case "givenOneSpendsMore": return commonUnitDifference(parameters, solver, "saving");
    case "incomeExpenseTotalIncome": return totalIncome(parameters, solver);
    case "incomeExpenseTotalExpense": return totalExpense(parameters, solver);
    default: return explanation;
  }
}
