import { getAvg001QuestionEntry } from "./library";
import type { Avg001QuestionPackage } from "./types";

const AGE_SCENARIOS = new Set([
  "familyAgeElapsedTime",
  "newbornAfterElapsedYears",
  "memberLeavesAfterYears",
]);

const CURRENCY_SCENARIOS = new Set([
  "weeklySalesTotal",
  "salaryGroupTotal",
  "expenseTotal",
  "salesAverage",
  "expenseAverage",
  "missingSale",
  "missingExpense",
  "employeeLeavesSalary",
  "employeeLeavesGroup",
  "salaryLeavingValue",
  "findLeavingSalary",
]);

const UNIT_BY_SCENARIO: Record<string, string> = {
  dailyOutputTotal: "units",
  outputAverage: "components per hour",
  distanceAverage: "km",
  missingOutput: "units",
  missingDistance: "km",
  studentJoinsGroup: "marks",
  scoreRemoved: "marks",
  scoreReplacement: "marks",
  findJoiningScore: "marks",
  findIncomingScore: "marks",
  workerOutputReplacement: "units",
  findIncomingOutput: "units",
};

const LABEL_OVERRIDES: Record<string, string> = {
  "combined monthly salary": "total monthly salary",
  "average daily sales": "average sale per day",
  "new average marks": "new average",
  "child's age": "new member's age",
  "total score in marks": "total marks",
  "total production in units": "total production",
  "total passenger count across all trips": "total passengers",
  "average marks per test": "average score per test",
  "average hourly output": "average output per hour",
  "average distance per day in kilometres": "average distance per day",
  "arithmetic mean": "average",
  "number of operating days": "number of days",
  "distance on the remaining day in kilometres": "distance on the remaining day",
  "average of the sequence": "average",
  "average of the arithmetic progression": "average",
  "average of the odd-number sequence": "average of the odd numbers",
  "average of the even-number sequence": "average of the even numbers",
  "average production code": "average batch number",
  "new student's marks": "new student's score",
};

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${groupedLeading},${lastThree}${decimal}`;
}

function displayAnswer(pkg: Avg001QuestionPackage, label: string) {
  const grouped = groupIndianDigits(pkg.answer);
  const scenario = pkg.parameters.scenarioVariant;
  const stem = pkg.stem;

  if (pkg.parameters.answerType === "COUNT") return grouped;

  if (
    stem.includes("₹") ||
    CURRENCY_SCENARIOS.has(scenario) ||
    /salary|sale|expenditure|price/i.test(label)
  ) {
    return `₹${grouped}`;
  }

  if (
    /\bage\b|\byears?\b/i.test(stem) ||
    AGE_SCENARIOS.has(scenario) ||
    /\bage\b/i.test(label)
  ) {
    return `${grouped} years`;
  }

  if (/\bkg\b/i.test(stem)) return `${grouped} kg`;
  if (/\bkm\b/i.test(stem) || /distance/i.test(label)) return `${grouped} km`;
  if (/\bunits?\b/i.test(stem)) return `${grouped} units`;

  if (/\bmarks?\b/i.test(stem)) {
    return /marks/i.test(label) ? grouped : `${grouped} marks`;
  }

  if (/\bruns?\b|\binnings?\b|\bbatter\b|\bbatting\b|\bcricketer\b/i.test(stem)) {
    return `${grouped} runs`;
  }

  const exactUnit = UNIT_BY_SCENARIO[scenario];
  if (exactUnit) return `${grouped} ${exactUnit}`;
  if (/score/i.test(label)) return `${grouped} marks`;
  if (/passengers/i.test(label)) return grouped;
  if (/output/i.test(label)) return `${grouped} units`;

  return grouped;
}

function contextLabel(raw: string) {
  const normalized = raw
    .replace(/^the\s+/i, "")
    .replace(/\s+in rupees$/i, "")
    .trim();
  return LABEL_OVERRIDES[normalized] ?? normalized;
}

export function applyAvg001ContextualConclusion(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const genericIndex = pkg.explanation.lines.findIndex((line) =>
    /required answer|required result/i.test(line),
  );
  if (genericIndex < 0) return pkg;

  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  const label = contextLabel(entry.finalContext);
  const lines = [...pkg.explanation.lines];
  lines[genericIndex] = `Therefore, ${label} = ${displayAnswer(pkg, label)}.`;

  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}