import { getAvg001QuestionEntry } from "./library";
import type {
  Avg001Explanation,
  Avg001Parameters,
  Avg001ReasoningEvidence,
  Avg001SolverResult,
} from "./types";

type ValueRole = "total" | "average" | "answer" | "known";

const SUBJECTS: Record<string, { singular: string; plural: string }> = {
  marksTotal: { singular: "student", plural: "students" },
  dailyOutputTotal: { singular: "day", plural: "days" },
  weeklySalesTotal: { singular: "day", plural: "days" },
  salaryGroupTotal: { singular: "employee", plural: "employees" },
  passengerTotal: { singular: "trip", plural: "trips" },
  expenseTotal: { singular: "day", plural: "days" },
  marksAverage: { singular: "test", plural: "tests" },
  outputAverage: { singular: "hour", plural: "hours" },
  salesAverage: { singular: "day", plural: "days" },
  expenseAverage: { singular: "day", plural: "days" },
  distanceAverage: { singular: "day", plural: "days" },
  observationAverage: { singular: "number", plural: "numbers" },
  dayCount: { singular: "day", plural: "days" },
  studentCount: { singular: "student", plural: "students" },
  transactionCount: { singular: "transaction", plural: "transactions" },
  employeeCount: { singular: "employee", plural: "employees" },
  tripCount: { singular: "trip", plural: "trips" },
  dayCountFromExpense: { singular: "day", plural: "days" },
  missingMark: { singular: "test", plural: "tests" },
  missingOutput: { singular: "shift", plural: "shifts" },
  missingSale: { singular: "day", plural: "days" },
  missingExpense: { singular: "day", plural: "days" },
  missingDistance: { singular: "day", plural: "days" },
  missingObservation: { singular: "number", plural: "numbers" },
};

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
]);

const SUFFIXES: Record<
  string,
  Partial<Record<ValueRole, string>>
> = {
  marksTotal: { average: "marks", answer: "marks", total: "marks" },
  marksAverage: { total: "marks", answer: "marks" },
  studentCount: { total: "marks", average: "marks per student" },
  missingMark: {
    average: "marks",
    total: "marks",
    known: "marks",
    answer: "marks",
  },
  dailyOutputTotal: {
    average: "units per day",
    total: "units",
    answer: "units",
  },
  outputAverage: {
    total: "components",
    answer: "components per hour",
  },
  dayCount: { total: "units", average: "units per day" },
  missingOutput: {
    average: "units",
    total: "units",
    known: "units",
    answer: "units",
  },
  passengerTotal: {
    average: "passengers per trip",
    total: "passengers",
    answer: "passengers",
  },
  tripCount: {
    total: "passengers",
    average: "passengers per trip",
  },
  distanceAverage: { total: "km", answer: "km per day" },
  missingDistance: {
    average: "km per day",
    total: "km",
    known: "km",
    answer: "km",
  },
};

const RESULT_LABELS: Record<string, string> = {
  marksTotal: "total score",
  dailyOutputTotal: "total production",
  weeklySalesTotal: "total sales",
  salaryGroupTotal: "total monthly salary",
  passengerTotal: "total number of passengers carried",
  expenseTotal: "total amount spent",
  marksAverage: "average score per test",
  outputAverage: "average output per hour",
  salesAverage: "average sale per day",
  expenseAverage: "average daily spending",
  distanceAverage: "average distance per day",
  observationAverage: "average",
  missingMark: "score in the last test",
  missingOutput: "output in the last shift",
  missingSale: "sale on the last day",
  missingExpense: "spending on the last day",
  missingDistance: "distance on the last day",
  missingObservation: "remaining number",
};

function subject(parameters: Avg001Parameters) {
  return (
    SUBJECTS[parameters.scenarioVariant] ?? {
      singular: "number",
      plural: "numbers",
    }
  );
}

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

function plainValue(value: string | number) {
  return groupIndianDigits(String(value));
}

function contextValue(
  parameters: Avg001Parameters,
  value: string | number,
  role: ValueRole,
) {
  const rendered = plainValue(value);
  if (MONEY_SCENARIOS.has(parameters.scenarioVariant)) return `₹${rendered}`;
  const suffix = SUFFIXES[parameters.scenarioVariant]?.[role];
  return suffix ? `${rendered} ${suffix}` : rendered;
}

function resultConclusion(
  parameters: Avg001Parameters,
  answer: string,
  lead: "So" | "Hence" | "This gives" = "So",
) {
  const label = RESULT_LABELS[parameters.scenarioVariant] ?? "answer";
  const renderedAnswer = contextValue(parameters, answer, "answer");
  if (lead === "This gives") {
    return `This gives ${renderedAnswer} as the ${label}.`;
  }
  return `${lead}, the ${label} is ${renderedAnswer}.`;
}

function countConclusion(parameters: Avg001Parameters, answer: string) {
  switch (parameters.scenarioVariant) {
    case "dayCount":
      return `So the factory worked for ${answer} days.`;
    case "studentCount":
      return `So the class has ${answer} students.`;
    case "transactionCount":
      return `So there are ${answer} transactions.`;
    case "employeeCount":
      return `So there are ${answer} employees.`;
    case "tripCount":
      return `So the bus made ${answer} trips.`;
    case "dayCountFromExpense":
      return `So the amount lasted ${answer} days.`;
    default:
      return `So the count is ${answer}.`;
  }
}

export function renderAvg001Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
): Avg001Explanation {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId);
  const noun = subject(parameters);
  const averageRaw = String(evidence.givens.average);
  const totalRaw = String(
    evidence.givens.total ?? parameters.renderVariables.total,
  );
  const averageShown = contextValue(
    parameters,
    parameters.renderVariables.average ?? averageRaw,
    "average",
  );
  const totalShown = contextValue(
    parameters,
    parameters.renderVariables.total ?? totalRaw,
    "total",
  );
  const count = Number(evidence.givens.count ?? parameters.values.count);
  const requiredTotal = String(
    evidence.intermediateValues.requiredTotal ??
      parameters.renderVariables.total,
  );
  const knownTotal = String(
    parameters.renderVariables.knownTotal ??
      evidence.givens.knownTotal ??
      "",
  );
  const knownCount = parameters.values.knownCount ?? count - 1;

  switch (entry.explanationStrategyId) {
    case "total-direct-multiply":
      return {
        lines: [
          `The average for one ${noun.singular} is ${averageShown}.`,
          `For ${count} ${noun.plural}, multiply this value by ${count}.`,
          `$$\\text{Total}=${averageRaw}\\times${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer),
          `Check: ${solver.answer}\\div${count}=${averageRaw}.`,
        ],
      };

    case "total-equal-groups":
      return {
        lines: [
          `${count} ${noun.plural} means ${count} equal groups of ${averageShown}.`,
          "Adding equal groups is the same as multiplying.",
          `$$${averageRaw}\\times${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer, "Hence"),
          `Check: ${solver.answer}\\div${count}=${averageRaw}.`,
        ],
      };

    case "total-use-formula":
      return {
        lines: [
          "Use: Total = Average × Number.",
          `Here, the average is ${averageShown} and the number of ${noun.plural} is ${count}.`,
          `$$\\text{Total}=${averageRaw}\\times${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer, "This gives"),
          `Dividing ${plainValue(solver.answer)} by ${count} gives ${plainValue(averageRaw)}, so the answer checks.`,
        ],
      };

    case "average-share-equally": {
      const opening =
        parameters.scenarioVariant === "marksAverage"
          ? `The student scored ${totalShown} in ${count} tests.`
          : `The family spent ${totalShown} over ${count} days.`;
      return {
        lines: [
          opening,
          `To find the value for one ${noun.singular}, divide by ${count}.`,
          `$$\\text{Average}=${totalRaw}\\div${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer),
          `Check: ${solver.answer}\\times${count}=${totalRaw}.`,
        ],
      };
    }

    case "average-per-unit": {
      const opening =
        parameters.scenarioVariant === "outputAverage"
          ? `The machine made ${totalShown} in ${count} hours.`
          : `The vehicle covered ${totalShown} in ${count} days.`;
      return {
        lines: [
          opening,
          `Divide the total by ${count} to get the value for one ${noun.singular}.`,
          `$$${totalRaw}\\div${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer, "Hence"),
          `Multiplying ${plainValue(solver.answer)} by ${count} gives ${plainValue(totalRaw)} again.`,
        ],
      };
    }

    case "average-formula-check":
      return {
        lines: [
          "Average = Total ÷ Count.",
          `Substitute the total ${totalShown} and count ${count}.`,
          `$$\\text{Average}=${totalRaw}\\div${count}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer),
          `Verification: ${solver.answer}\\times${count}=${totalRaw}.`,
        ],
      };

    case "count-equal-groups": {
      const firstLine =
        parameters.scenarioVariant === "dayCount"
          ? `The factory produced ${totalShown} at an average of ${averageShown}.`
          : `${totalShown} is divided into average salaries of ${averageShown}.`;
      return {
        lines: [
          firstLine,
          "The number of equal groups is total ÷ value of one group.",
          `$$\\text{Count}=${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          countConclusion(parameters, solver.answer),
          `Check: ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };
    }

    case "count-reverse-product":
      return {
        lines: [
          `We need a number which, when multiplied by ${averageShown}, gives ${totalShown}.`,
          "That number is found by division.",
          `$$${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          countConclusion(parameters, solver.answer),
          `Indeed, ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };

    case "count-direct-division":
      return {
        lines: [
          "Use: Count = Total ÷ Average.",
          `Here, total = ${totalShown} and average = ${averageShown}.`,
          `$$\\text{Count}=${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          countConclusion(parameters, solver.answer),
          `Check: ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };

    case "missing-required-total":
      return {
        lines: [
          `First find the total needed for all ${count} ${noun.plural}.`,
          `$$\\text{Required total}=${averageRaw}\\times${count}=${requiredTotal}$$`,
          `The first ${knownCount} ${noun.plural} already total ${contextValue(parameters, knownTotal, "known")}.`,
          "Subtract this known total from the required total.",
          `$$\\text{Missing value}=${requiredTotal}-${String(evidence.givens.knownTotal)}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer),
        ],
      };

    case "missing-balance-gap":
      return {
        lines: [
          `At an average of ${averageShown}, the full total for ${count} ${noun.plural} should be ${contextValue(parameters, requiredTotal, "total")}.`,
          `The known ${knownCount} ${noun.plural} contribute ${contextValue(parameters, knownTotal, "known")}.`,
          `The last ${noun.singular} must fill the gap between these two totals.`,
          `$$${requiredTotal}-${String(evidence.givens.knownTotal)}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer),
          `Check: ${String(evidence.givens.knownTotal)}+${solver.answer}=${requiredTotal}.`,
        ],
      };

    case "missing-equation":
      return {
        lines: [
          `Let the missing ${noun.singular} be x.`,
          `The total required is ${averageRaw}\\times${count}=${requiredTotal}.`,
          `So, ${String(evidence.givens.knownTotal)}+x=${requiredTotal}.`,
          `$$x=${requiredTotal}-${String(evidence.givens.knownTotal)}=${solver.answer}$$`,
          resultConclusion(parameters, solver.answer, "Hence"),
        ],
      };

    default:
      throw new Error(
        `No AVG-001 explanation renderer for strategy ${entry.explanationStrategyId}`,
      );
  }
}
