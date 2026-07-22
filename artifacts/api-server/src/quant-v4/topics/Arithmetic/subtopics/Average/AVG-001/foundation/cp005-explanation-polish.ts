import type { Avg001QuestionPackage } from "./types";

const countShareStrategies = new Set([
  "total-gap-over-average-gap",
]);

export function applyAvg001Cp005ExplanationPolish(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (
    pkg.canonicalProblemId !== "AVG-CP-005" ||
    pkg.solveMode !== "findNumberOfItemsFromTotalCorrection"
  ) {
    return pkg;
  }

  const strategy = String(pkg.traceability.explanationStrategyId ?? "");
  if (!countShareStrategies.has(strategy)) return pkg;

  const variables = pkg.parameters.renderVariables;
  const wrong = String(variables.incorrectValue);
  const correct = String(variables.correctValue);
  const difference = String(variables.entryDifference);
  const averageChange = String(variables.averageChange);
  const count = String(variables.count);

  return {
    ...pkg,
    explanation: {
      lines: [
        `Each record accounts for ${averageChange} of the total change, while the mistaken entry changed the total by ${difference}.`,
        `$$Total change = |${correct} - ${wrong}| = ${difference}$$`,
        `$$Number of records = total change ÷ change per record = ${difference} ÷ ${averageChange} = ${count}$$`,
        `So ${pkg.answer} records were included.`,
      ],
    },
  };
}
