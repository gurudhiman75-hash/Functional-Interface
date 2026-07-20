import {
  add,
  divide,
  formatRational,
  isInteger,
  multiply,
  rational,
  subtract,
} from "./math";
import type {
  Avg001Parameters,
  Avg001SolverResult,
  Rational,
} from "./types";

function safe(candidate: () => Rational, fallback: Rational) {
  try {
    return candidate();
  } catch {
    return fallback;
  }
}

export function generateAvg001Options(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const values = parameters.values;
  const correct = solver.exactAnswer;
  let distractors: Rational[] = [];

  switch (parameters.solveMode) {
    case "findSumFromAverageAndCount":
      distractors = [
        safe(
          () => divide(values.average, rational(values.count)),
          add(correct, rational(1)),
        ),
        multiply(values.average, rational(values.count - 1)),
        add(values.average, rational(values.count)),
      ];
      break;
    case "findAverageFromSumAndCount":
      distractors = [
        divide(values.total, rational(Math.max(1, values.count - 1))),
        divide(values.total, rational(values.count + 1)),
        values.total,
      ];
      break;
    case "findCountFromSumAndAverage":
      distractors = [
        subtract(correct, rational(1)),
        add(correct, rational(1)),
        values.average,
      ];
      break;
    case "findMissingValueFromAverage":
      if (!values.knownTotal) throw new Error("Options missing known total");
      distractors = [
        values.total,
        values.knownTotal,
        subtract(values.total, values.average),
      ];
      break;
    default:
      throw new Error(`No option strategy for ${parameters.solveMode}`);
  }

  const formatted = [correct, ...distractors].map((value, index) => {
    const policy =
      parameters.answerType === "COUNT"
        ? "EXACT_INTEGER"
        : parameters.displayPolicy;
    if (index === 0) return formatRational(value, policy as any);

    const numeric = value.numerator / value.denominator;
    if (policy === "EXACT_INTEGER") {
      return String(Math.max(1, Math.round(numeric)));
    }
    if (policy === "EXACT_DECIMAL_1") return numeric.toFixed(1);
    if (policy === "EXACT_DECIMAL_2") return numeric.toFixed(2);
    return formatRational(value, "EXACT_FRACTION");
  });

  const unique: string[] = [];
  for (const value of formatted) {
    if (!unique.includes(value)) unique.push(value);
  }

  let bump = 1;
  while (unique.length < 4) {
    const numeric = Number(solver.answer);
    const candidate = String(
      Number.isFinite(numeric) ? numeric + bump : `${solver.answer}${bump}`,
    );
    if (!unique.includes(candidate)) unique.push(candidate);
    bump += 1;
  }

  const seedHash = [...parameters.seed].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const shift = seedHash % 4;
  const options = [...unique.slice(0, 4)];
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }

  const correctIndex = options.indexOf(solver.answer);
  if (correctIndex < 0) {
    throw new Error("Canonical answer missing from generated options");
  }
  return { options, correctIndex };
}
