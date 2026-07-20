import { formatRational, multiply, rational } from "./math";
import { getAvg001QuestionEntry } from "./library";
import type {
  Avg001Parameters,
  Avg001ReasoningEvidence,
  Avg001SolverResult,
} from "./types";

export function buildAvg001ReasoningEvidence(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
): Avg001ReasoningEvidence {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId);
  const { count, average, total, knownTotal } = parameters.values;
  const averageText = formatRational(average, parameters.displayPolicy);
  const totalText = formatRational(total, parameters.displayPolicy);

  if (parameters.solveMode === "findSumFromAverageAndCount") {
    return {
      conceptId: "sum-equals-average-times-count",
      givens: { average: averageText, count },
      equations: ["Total = Average × Count"],
      intermediateValues: { requiredTotal: solver.answer },
      decisiveCalculation: `${averageText} × ${count} = ${solver.answer}`,
      verification: `${solver.answer} ÷ ${count} = ${averageText}`,
      finalContext: entry.finalContext,
    };
  }

  if (parameters.solveMode === "findAverageFromSumAndCount") {
    return {
      conceptId: "average-equals-sum-divided-by-count",
      givens: { total: totalText, count },
      equations: ["Average = Total ÷ Count"],
      intermediateValues: { equalShare: solver.answer },
      decisiveCalculation: `${totalText} ÷ ${count} = ${solver.answer}`,
      verification: `${solver.answer} × ${count} = ${totalText}`,
      finalContext: entry.finalContext,
    };
  }

  if (parameters.solveMode === "findCountFromSumAndAverage") {
    return {
      conceptId: "count-equals-sum-divided-by-average",
      givens: { total: totalText, average: averageText },
      equations: ["Count = Total ÷ Average"],
      intermediateValues: { count: solver.answer },
      decisiveCalculation: `${totalText} ÷ ${averageText} = ${solver.answer}`,
      verification: `${solver.answer} × ${averageText} = ${totalText}`,
      finalContext: entry.finalContext,
    };
  }

  if (!knownTotal) throw new Error("Reasoning evidence missing known total");
  const knownText = formatRational(knownTotal, parameters.displayPolicy);
  const requiredText = formatRational(
    multiply(average, rational(count)),
    parameters.displayPolicy,
  );
  return {
    conceptId: "missing-value-from-required-total",
    givens: {
      average: averageText,
      count,
      knownTotal: knownText,
    },
    equations: [
      "Required total = Average × Count",
      "Missing value = Required total − Known total",
    ],
    intermediateValues: { requiredTotal: requiredText },
    decisiveCalculation: `${requiredText} − ${knownText} = ${solver.answer}`,
    verification: `${knownText} + ${solver.answer} = ${requiredText}`,
    finalContext: entry.finalContext,
  };
}
