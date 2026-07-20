import type {
  Avg001Explanation,
  Avg001Parameters,
  Avg001ReasoningEvidence,
  Avg001SolverResult,
} from "./types";

export function renderAvg001Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
): Avg001Explanation {
  const givens = evidence.givens;

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      return {
        lines: [
          `The average gives the equal share for one observation: ${givens.average}.`,
          `There are ${givens.count} observations, so the total must contain ${givens.count} such shares.`,
          "Use total = average × count.",
          `$$\\text{Total}=${givens.average}\\times${givens.count}=${solver.answer}$$`,
          `Check: ${solver.answer} ÷ ${givens.count} = ${givens.average}, which returns the stated average.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findAverageFromSumAndCount":
      return {
        lines: [
          `The total ${givens.total} is shared equally among ${givens.count} observations.`,
          "Average means the value of one equal share.",
          "Use average = total ÷ count.",
          `$$\\text{Average}=${givens.total}\\div${givens.count}=${solver.answer}$$`,
          `Check: ${solver.answer} × ${givens.count} = ${givens.total}, so the full total is recovered.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findCountFromSumAndAverage":
      return {
        lines: [
          `Each observation contributes an average value of ${givens.average}.`,
          `The complete total is ${givens.total}.`,
          "The number of observations is total ÷ average.",
          `$$\\text{Count}=${givens.total}\\div${givens.average}=${solver.answer}$$`,
          `Check: ${solver.answer} × ${givens.average} = ${givens.total}.`,
          `Therefore, the ${evidence.finalContext} is ${solver.answer}.`,
        ],
      };

    case "findMissingValueFromAverage":
      return {
        lines: [
          `First reconstruct the total required for ${givens.count} observations with average ${givens.average}.`,
          `$$\\text{Required total}=${givens.average}\\times${givens.count}=${evidence.intermediateValues.requiredTotal}$$`,
          `The known observations already contribute ${givens.knownTotal}.`,
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
