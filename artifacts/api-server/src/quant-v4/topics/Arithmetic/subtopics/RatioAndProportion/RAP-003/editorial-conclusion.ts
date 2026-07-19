import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function conclusion(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const answer = cleanAnswer(solver.answer);
  const task = parameters.taskKind;
  if (task.startsWith("partnership")) {
    if (solver.answerType === "RATIO") return `So, the required partnership ratio is ${answer}.`;
    if (solver.answerType === "TIME") return `So, the required partnership time is ${answer} months.`;
    return `So, the required profit or loss share is ${answer}.`;
  }
  if (task.startsWith("age")) {
    return solver.answerType === "TIME"
      ? `So, the required time is ${answer} years.`
      : `So, the required age is ${answer} years.`;
  }
  if (/^election|marketShare|surveyResponse/.test(task)) {
    if (solver.answerType === "PERCENT") return `So, the required election percentage is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required vote ratio is ${answer}.`;
    return `So, the required number of votes or voters is ${answer}.`;
  }
  if (task.startsWith("population")) {
    if (solver.answerType === "PERCENT") return `So, the required population percentage is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required population ratio is ${answer}.`;
    return `So, the required population count is ${answer}.`;
  }
  if (/^sdt|fixedDistance|fixedTime|trainPlatform|workEfficiency|machinesOutput|pipesTime|workersEfficiency|findMissingRate|timeSaved|distanceSlower|sameWork|rateProduct|relativeSpeed/.test(task)) {
    if (solver.answerType === "TIME") return `So, the required time is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required rate, distance, work, or time ratio is ${answer}.`;
    return `So, the required distance, speed, work, or output is ${answer}.`;
  }
  if (/denomination|ticketValue|marksPerQuestion/.test(task)) {
    if (solver.answerType === "COUNT") return `So, the required number of coins or items is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required value ratio is ${answer}.`;
    return `So, the required total value is ${answer}.`;
  }
  if (/^geometric|^mapScale|similarSolid/.test(task)) return `So, the required geometric ratio is ${answer}.`;
  if (/income|expenditure|expense|savings|salarySpending|shopRevenue|pocketMoney|familyIncome|givenOneSaves|givenOneSpends|equalIncome|equalExpense/.test(task)) {
    if (solver.answerType === "RATIO") return `So, the required income, expenditure, or savings ratio is ${answer}.`;
    if (solver.answerType === "PERCENT") return `So, the required savings or profit percentage is ${answer}.`;
    return `So, the required income, expenditure, savings, or profit value is ${answer}.`;
  }
  if (solver.answerType === "PERCENT") return `So, the required percentage is ${answer}.`;
  if (solver.answerType === "RATIO") return `So, the required ratio is ${answer}.`;
  return `So, the required value is ${answer}.`;
}

export function ensureRap003EditorialConclusion(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  if (explanation.lines.some((line) => /^So,/i.test(line.trim()))) return explanation;
  const lines = explanation.lines.slice(0, 6);
  lines.push(conclusion(parameters, solver));
  return { ...explanation, lines };
}
