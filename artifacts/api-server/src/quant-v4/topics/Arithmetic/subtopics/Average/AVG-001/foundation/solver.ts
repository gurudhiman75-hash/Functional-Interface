import {
  divide,
  formatRational,
  latex,
  multiply,
  rational,
  subtract,
} from "./math";
import type { Avg001Parameters, Avg001SolverResult } from "./types";

export function solveAvg001(
  parameters: Avg001Parameters,
): Avg001SolverResult {
  const { count, average, total, knownTotal } = parameters.values;
  let exactAnswer;
  let equation = "";
  const workingValues: Record<string, string | number> = {
    count,
    average: formatRational(average, parameters.displayPolicy),
    total: formatRational(total, parameters.displayPolicy),
  };

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      exactAnswer = multiply(average, rational(count));
      equation = `${latex(average)}\\times${count}=${latex(exactAnswer)}`;
      break;
    case "findAverageFromSumAndCount":
      exactAnswer = divide(total, rational(count));
      equation = `${latex(total)}\\div${count}=${latex(exactAnswer)}`;
      break;
    case "findCountFromSumAndAverage":
      exactAnswer = divide(total, average);
      equation = `${latex(total)}\\div${latex(average)}=${latex(exactAnswer)}`;
      break;
    case "findMissingValueFromAverage":
      if (!knownTotal) throw new Error("Missing known total");
      exactAnswer = subtract(
        multiply(average, rational(count)),
        knownTotal,
      );
      equation = `${latex(average)}\\times${count}-${latex(knownTotal)}=${latex(exactAnswer)}`;
      workingValues.knownTotal = formatRational(
        knownTotal,
        parameters.displayPolicy,
      );
      break;
    default:
      throw new Error(
        `Unsupported AVG-001 runtime-proof solve mode: ${parameters.solveMode}`,
      );
  }

  return {
    exactAnswer,
    answer: formatRational(exactAnswer, parameters.displayPolicy),
    equation,
    workingValues,
  };
}
