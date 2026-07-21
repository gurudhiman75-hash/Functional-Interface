import { getAvg001QuestionEntry } from "./library";
import type { Avg001QuestionPackage } from "./types";

const MONEY_SCENARIOS = new Set([
  "weeklySalesTotal",
  "salaryGroupTotal",
  "expenseTotal",
  "salesAverage",
  "expenseAverage",
  "transactionCount",
  "employeeCount",
  "dayCountFromExpense",
  "missingSale",
  "missingExpense",
  "employeeLeavesSalary",
  "salaryLeavingValue",
]);

const LABEL_OVERRIDES: Record<string, string> = {
  "combined monthly salary": "total monthly salary",
  "average daily sales": "average sale per day",
  "new average marks": "new average",
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

function displayAnswer(pkg: Avg001QuestionPackage) {
  const grouped = groupIndianDigits(pkg.answer);
  if (
    MONEY_SCENARIOS.has(pkg.parameters.scenarioVariant) ||
    pkg.parameters.contextDomain === "Workplace"
  ) {
    return `₹${grouped}`;
  }
  if (
    pkg.parameters.contextDomain === "Family" ||
    /Age|age/.test(pkg.parameters.scenarioVariant)
  ) {
    return `${grouped} years`;
  }
  if (
    pkg.parameters.contextDomain === "Classroom" &&
    /mark|score/i.test(pkg.parameters.scenarioVariant)
  ) {
    return `${grouped} marks`;
  }
  if (pkg.parameters.contextDomain === "Sports") {
    return pkg.solveMode === "findInningsValueOrNewCricketAverage" &&
      pkg.parameters.values.targetKind === "memberValue"
      ? `${grouped} runs`
      : grouped;
  }
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
  lines[genericIndex] = `Therefore, the ${label} is ${displayAnswer(pkg)}.`;

  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}
