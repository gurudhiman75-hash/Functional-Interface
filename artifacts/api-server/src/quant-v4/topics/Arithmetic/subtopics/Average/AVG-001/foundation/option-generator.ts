import {
  add,
  divide,
  formatRational,
  multiply,
  rational,
  subtract,
} from "./math";
import type {
  Avg001DisplayPolicy,
  Avg001Parameters,
  Avg001SolverResult,
  Rational,
} from "./types";

function safe(candidate: () => Rational): Rational | undefined {
  try {
    return candidate();
  } catch {
    return undefined;
  }
}

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
  const numeric = value.numerator / value.denominator;
  if (policy === "EXACT_INTEGER") {
    return String(Math.max(1, Math.round(numeric)));
  }
  if (policy === "EXACT_DECIMAL_1") return numeric.toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return numeric.toFixed(2);
  return formatRational(value, "EXACT_FRACTION");
}

function misconceptionCandidates(parameters: Avg001Parameters) {
  const values = parameters.values;
  const correct =
    parameters.solveMode === "findCountFromSumAndAverage"
      ? divide(values.total, values.average)
      : undefined;

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      return [
        safe(() => divide(values.average, rational(values.count))),
        multiply(values.average, rational(values.count - 1)),
        multiply(values.average, rational(values.count + 1)),
        add(values.average, rational(values.count)),
        subtract(
          multiply(values.average, rational(values.count)),
          values.average,
        ),
      ];
    case "findAverageFromSumAndCount":
      return [
        divide(values.total, rational(Math.max(1, values.count - 1))),
        divide(values.total, rational(values.count + 1)),
        values.total,
        subtract(values.total, rational(values.count)),
        add(divide(values.total, rational(values.count)), rational(1)),
      ];
    case "findCountFromSumAndAverage":
      if (!correct) throw new Error("Count distractor construction failed");
      return [
        subtract(correct, rational(1)),
        add(correct, rational(1)),
        values.average,
        values.total,
        add(values.average, correct),
      ];
    case "findMissingValueFromAverage":
      if (!values.knownTotal) throw new Error("Options missing known total");
      return [
        values.total,
        values.knownTotal,
        subtract(values.total, values.average),
        subtract(values.knownTotal, values.average),
        values.average,
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

  for (const candidate of misconceptionCandidates(parameters)) {
    if (!candidate) continue;
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
