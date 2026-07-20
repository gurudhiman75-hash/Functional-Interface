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
  distanceAverage: { singular: "working day", plural: "working days" },
  observationAverage: { singular: "observation", plural: "observations" },
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
  missingObservation: { singular: "observation", plural: "observations" },
};

function subject(parameters: Avg001Parameters) {
  return (
    SUBJECTS[parameters.scenarioVariant] ?? {
      singular: "observation",
      plural: "observations",
    }
  );
}

export function renderAvg001Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
): Avg001Explanation {
  const givens = evidence.givens;
  const noun = subject(parameters);

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      return {
        lines: [
          `The average gives the value for one ${noun.singular}: ${givens.average}.`,
          `There are ${givens.count} ${noun.plural}, so the total contains ${givens.count} equal average shares.`,
          "Use total = average × count.",
          `$$\\text{Total}=${givens.average}\\times${givens.count}=${solver.answer}$$`,
          `Check: ${solver.answer} ÷ ${givens.count} = ${givens.average}, which returns the stated average.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findAverageFromSumAndCount":
      return {
        lines: [
          `The total ${givens.total} belongs to ${givens.count} ${noun.plural}.`,
          `The average is the equal value for one ${noun.singular}.`,
          "Use average = total ÷ count.",
          `$$\\text{Average}=${givens.total}\\div${givens.count}=${solver.answer}$$`,
          `Check: ${solver.answer} × ${givens.count} = ${givens.total}, so the full total is recovered.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findCountFromSumAndAverage":
      return {
        lines: [
          `The complete total is ${givens.total}, and the average value per ${noun.singular} is ${givens.average}.`,
          `The number of ${noun.plural} is found by dividing the total by the average value for one ${noun.singular}.`,
          "Use count = total ÷ average.",
          `$$\\text{Count}=${givens.total}\\div${givens.average}=${solver.answer}$$`,
          `Check: ${solver.answer} × ${givens.average} = ${givens.total}.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findMissingValueFromAverage":
      return {
        lines: [
          `First reconstruct the total required for ${givens.count} ${noun.plural} with average ${givens.average}.`,
          `$$\\text{Required total}=${givens.average}\\times${givens.count}=${evidence.intermediateValues.requiredTotal}$$`,
          `The first ${parameters.values.knownCount} ${noun.plural} already contribute ${givens.knownTotal}.`,
          "Subtract the known total from the required total.",
          `$$\\text{Missing value}=${evidence.intermediateValues.requiredTotal}-${givens.knownTotal}=${solver.answer}$$`,
          `Check: ${givens.knownTotal} + ${solver.answer} = ${evidence.intermediateValues.requiredTotal}.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    default:
      throw new Error(
        `No AVG-001 explanation renderer for ${parameters.solveMode}`,
      );
  }
}
