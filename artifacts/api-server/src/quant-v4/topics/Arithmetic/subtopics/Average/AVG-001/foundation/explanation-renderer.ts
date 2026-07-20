import { getAvg001QuestionEntry } from "./library";
import type {
  Avg001Explanation,
  Avg001Parameters,
  Avg001ReasoningEvidence,
  Avg001SolverResult,
} from "./types";

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

const UNIT_BY_SCENARIO: Record<string, string> = {
  marksTotal: "marks",
  marksAverage: "marks",
  studentCount: "marks",
  missingMark: "marks",
  dailyOutputTotal: "units",
  outputAverage: "units",
  dayCount: "units",
  missingOutput: "units",
  passengerTotal: "passengers",
  tripCount: "passengers",
  distanceAverage: "km",
  missingDistance: "km",
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
) {
  const rendered = plainValue(value);
  if (MONEY_SCENARIOS.has(parameters.scenarioVariant)) return `₹${rendered}`;
  const unit = UNIT_BY_SCENARIO[parameters.scenarioVariant];
  return unit ? `${rendered} ${unit}` : rendered;
}

function answerText(parameters: Avg001Parameters, answer: string) {
  if (parameters.answerType === "COUNT") {
    return `${answer} ${subject(parameters).plural}`;
  }
  return contextValue(parameters, answer);
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
  );
  const totalShown = contextValue(
    parameters,
    parameters.renderVariables.total ?? totalRaw,
  );
  const answerShown = answerText(parameters, solver.answer);
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
          `So the ${evidence.finalContext} is ${answerShown}.`,
          `Check: ${solver.answer}\\div${count}=${averageRaw}.`,
        ],
      };

    case "total-equal-groups":
      return {
        lines: [
          `${count} ${noun.plural} means ${count} equal groups of ${averageShown}.`,
          "Adding equal groups is the same as multiplying.",
          `$$${averageRaw}\\times${count}=${solver.answer}$$`,
          `Hence, the total is ${answerShown}.`,
          `Check: ${solver.answer}\\div${count}=${averageRaw}.`,
        ],
      };

    case "total-use-formula":
      return {
        lines: [
          "Use: Total = Average × Number.",
          `Here, the average is ${averageShown} and the number of ${noun.plural} is ${count}.`,
          `$$\\text{Total}=${averageRaw}\\times${count}=${solver.answer}$$`,
          `This gives ${answerShown} as the ${evidence.finalContext}.`,
          `Dividing ${plainValue(solver.answer)} by ${count} gives ${plainValue(averageRaw)}, so the answer checks.`,
        ],
      };

    case "average-share-equally":
      return {
        lines: [
          `${totalShown} is shared across ${count} ${noun.plural}.`,
          `To get the value for one ${noun.singular}, divide by ${count}.`,
          `$$\\text{Average}=${totalRaw}\\div${count}=${solver.answer}$$`,
          `So the average is ${answerShown}.`,
          `Check: ${solver.answer}\\times${count}=${totalRaw}.`,
        ],
      };

    case "average-per-unit":
      return {
        lines: [
          `The question asks for the value per ${noun.singular}.`,
          `Divide the total, ${totalShown}, by ${count}.`,
          `$$${totalRaw}\\div${count}=${solver.answer}$$`,
          `Thus, the average is ${answerShown}.`,
          `Multiplying ${plainValue(solver.answer)} by ${count} gives ${plainValue(totalRaw)} again.`,
        ],
      };

    case "average-formula-check":
      return {
        lines: [
          "Average = Total ÷ Count.",
          `Substitute the total ${totalShown} and count ${count}.`,
          `$$\\text{Average}=${totalRaw}\\div${count}=${solver.answer}$$`,
          `The ${evidence.finalContext} is ${answerShown}.`,
          `Verification: ${solver.answer}\\times${count}=${totalRaw}.`,
        ],
      };

    case "count-equal-groups":
      return {
        lines: [
          `The total is ${totalShown}, and each ${noun.singular} accounts for ${averageShown}.`,
          "The number of equal groups is total ÷ value of one group.",
          `$$\\text{Count}=${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          `So there are ${answerShown}.`,
          `Check: ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };

    case "count-reverse-product":
      return {
        lines: [
          `We need a number which, when multiplied by ${averageShown}, gives ${totalShown}.`,
          "That number is found by division.",
          `$$${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          `Hence, the answer is ${answerShown}.`,
          `Indeed, ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };

    case "count-direct-division":
      return {
        lines: [
          "Use: Count = Total ÷ Average.",
          `Here, total = ${totalShown} and average = ${averageShown}.`,
          `$$\\text{Count}=${totalRaw}\\div${averageRaw}=${solver.answer}$$`,
          `So the ${evidence.finalContext} is ${answerShown}.`,
          `Check: ${solver.answer}\\times${averageRaw}=${totalRaw}.`,
        ],
      };

    case "missing-required-total":
      return {
        lines: [
          `First find the total needed for all ${count} ${noun.plural}.`,
          `$$\\text{Required total}=${averageRaw}\\times${count}=${requiredTotal}$$`,
          `The first ${knownCount} ${noun.plural} already total ${contextValue(parameters, knownTotal)}.`,
          "Subtract this known total from the required total.",
          `$$\\text{Missing value}=${requiredTotal}-${String(evidence.givens.knownTotal)}=${solver.answer}$$`,
          `So the ${evidence.finalContext} is ${answerShown}.`,
        ],
      };

    case "missing-balance-gap":
      return {
        lines: [
          `At an average of ${averageShown}, the full total for ${count} ${noun.plural} should be ${contextValue(parameters, requiredTotal)}.`,
          `The known ${knownCount} ${noun.plural} contribute ${contextValue(parameters, knownTotal)}.`,
          `The last ${noun.singular} must fill the gap between these two totals.`,
          `$$${requiredTotal}-${String(evidence.givens.knownTotal)}=${solver.answer}$$`,
          `So the missing value is ${answerShown}.`,
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
          `Hence, the ${evidence.finalContext} is ${answerShown}.`,
        ],
      };

    default:
      throw new Error(
        `No AVG-001 explanation renderer for strategy ${entry.explanationStrategyId}`,
      );
  }
}
