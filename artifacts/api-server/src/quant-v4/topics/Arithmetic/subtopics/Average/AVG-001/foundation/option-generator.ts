import {
  add,
  divide,
  formatRational,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import type {
  Avg001DisplayPolicy,
  Avg001Parameters,
  Avg001SolverResult,
  Rational,
} from "./types";

function displayPolicy(parameters: Avg001Parameters): Avg001DisplayPolicy {
  return parameters.answerType === "COUNT"
    ? "EXACT_INTEGER"
    : parameters.displayPolicy;
}

function formatCandidate(
  value: Rational,
  policy: Avg001DisplayPolicy,
  canonical: boolean,
) {
  if (canonical) return formatRational(value, policy);
  const numeric = toNumber(value);
  if (policy === "EXACT_INTEGER") {
    return String(Math.max(1, Math.round(numeric)));
  }
  if (policy === "EXACT_DECIMAL_1") return numeric.toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return numeric.toFixed(2);
  return formatRational(value, "EXACT_FRACTION");
}

function arithmeticStep(parameters: Avg001Parameters) {
  switch (parameters.scenarioVariant) {
    case "salaryGroupTotal":
    case "employeeCount":
      return rational(1000);
    case "weeklySalesTotal":
    case "salesAverage":
    case "transactionCount":
    case "missingSale":
      return rational(100);
    case "expenseTotal":
    case "expenseAverage":
    case "dayCountFromExpense":
    case "missingExpense":
      return rational(50);
    case "distanceAverage":
    case "missingDistance":
      return rational(1, 10);
    default:
      return rational(1);
  }
}

function misconceptionCandidates(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const values = parameters.values;
  const step = arithmeticStep(parameters);

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      return [
        multiply(values.average, rational(values.count - 1)),
        multiply(values.average, rational(values.count + 1)),
        add(solver.exactAnswer, step),
        subtract(solver.exactAnswer, step),
      ];
    case "findAverageFromSumAndCount":
      return [
        divide(values.total, rational(Math.max(1, values.count - 1))),
        divide(values.total, rational(values.count + 1)),
        add(solver.exactAnswer, step),
        subtract(solver.exactAnswer, step),
        add(solver.exactAnswer, multiply(step, rational(2))),
        subtract(solver.exactAnswer, multiply(step, rational(2))),
      ];
    case "findCountFromSumAndAverage":
      return [
        subtract(solver.exactAnswer, rational(1)),
        add(solver.exactAnswer, rational(1)),
        add(solver.exactAnswer, rational(2)),
      ];
    case "findMissingValueFromAverage":
      return [
        values.average,
        subtract(solver.exactAnswer, step),
        add(solver.exactAnswer, step),
        subtract(solver.exactAnswer, multiply(step, rational(2))),
        add(solver.exactAnswer, multiply(step, rational(2))),
      ];
    default:
      throw new Error(`No option strategy for ${parameters.solveMode}`);
  }
}

export function generateAvg001Options(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const policy = displayPolicy(parameters);
  const canonical = formatCandidate(solver.exactAnswer, policy, true);
  const unique = [canonical];

  for (const candidate of misconceptionCandidates(parameters, solver)) {
    const rendered = formatCandidate(candidate, policy, false);
    if (!unique.includes(rendered)) unique.push(rendered);
    if (unique.length === 4) break;
  }

  if (unique.length !== 4) {
    throw new Error(
      `Insufficient unique misconception distractors for ${parameters.questionLanguageId}`,
    );
  }

  const seedHash = [...parameters.seed].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const shift = seedHash % 4;
  const options = [...unique];
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }

  const correctIndex = options.indexOf(solver.answer);
  if (correctIndex < 0) {
    throw new Error("Canonical answer missing from generated options");
  }
  return { options, correctIndex };
}
