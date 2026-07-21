import { runAvg001Cp003Pipeline as runBaseCp003Pipeline } from "./cp003-runtime";
import { getAvg001QuestionEntry } from "./library";
import {
  add,
  divide,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import type {
  Avg001Language,
  Avg001Parameters,
  Avg001QuestionPackage,
  Avg001SolverResult,
  Rational,
} from "./types";

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function absolute(value: Rational) {
  return value.numerator < 0
    ? rational(-value.numerator, value.denominator)
    : value;
}

function normalizedOptionValue(
  value: Rational,
  parameters: Avg001Parameters,
) {
  const numeric = toNumber(value);
  const increment = parameters.contextDomain === "Workplace" ? 500 : 1;
  return rational(Math.round(numeric / increment) * increment);
}

function misconceptionCandidate(
  strategy: string,
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
): Rational | undefined {
  const values = parameters.values;
  const oldCount = values.oldCount!;
  const newCount = values.newCount!;
  const oldAverage = values.oldAverage!;
  const newAverage = values.newAverage!;
  const averageAtChange =
    parameters.scenarioVariant.includes("Years") ||
    parameters.scenarioVariant.includes("Elapsed")
      ? add(oldAverage, rational(values.elapsedYears ?? 0))
      : oldAverage;
  const oldTotalAtChange = multiply(averageAtChange, rational(oldCount));
  const newTotal = multiply(newAverage, rational(newCount));
  const averageShift = subtract(newAverage, averageAtChange);
  const fallbackStep = parameters.contextDomain === "Workplace" ? 1000 : 1;

  switch (strategy) {
    case "ignoreNewCount":
    case "ignoreNewInnings":
      return values.addedValue
        ? divide(add(oldTotalAtChange, values.addedValue), rational(oldCount))
        : undefined;
    case "useAddedValueAsAverage":
    case "useScoreAsAverage":
      return values.addedValue;
    case "arithmeticOffset":
      return add(solver.exactAnswer, rational(fallbackStep));
    case "forgetElapsedYears":
      if (
        parameters.solveMode === "findNewAverageAfterAddition" &&
        values.addedValue
      ) {
        return divide(
          add(multiply(oldAverage, rational(oldCount)), values.addedValue),
          rational(newCount),
        );
      }
      if (parameters.solveMode === "findAddedMemberValueFromShift") {
        return subtract(newTotal, multiply(oldAverage, rational(oldCount)));
      }
      if (parameters.solveMode === "findRemovedMemberValueFromShift") {
        return subtract(multiply(oldAverage, rational(oldCount)), newTotal);
      }
      return undefined;
    case "divideByOldCount":
      return values.removedValue
        ? divide(
            subtract(oldTotalAtChange, values.removedValue),
            rational(oldCount),
          )
        : undefined;
    case "addRemovedValue":
      return values.removedValue
        ? divide(
            add(oldTotalAtChange, values.removedValue),
            rational(newCount),
          )
        : undefined;
    case "addBothValues":
      return values.outgoingValue && values.incomingValue
        ? divide(
            add(
              add(oldTotalAtChange, values.outgoingValue),
              values.incomingValue,
            ),
            rational(oldCount),
          )
        : undefined;
    case "ignoreCount":
      return values.outgoingValue && values.incomingValue
        ? add(
            oldAverage,
            subtract(values.incomingValue, values.outgoingValue),
          )
        : undefined;
    case "reverseDelta":
      if (!values.outgoingValue) return undefined;
      if (
        parameters.solveMode === "findNewAverageAfterReplacement" &&
        values.incomingValue
      ) {
        return subtract(
          oldAverage,
          divide(
            subtract(values.incomingValue, values.outgoingValue),
            rational(oldCount),
          ),
        );
      }
      return subtract(
        values.outgoingValue,
        multiply(subtract(newAverage, oldAverage), rational(oldCount)),
      );
    case "averageDifferenceOnly":
      return absolute(averageShift);
    case "useNewTotal":
    case "useRemainingTotal":
      return newTotal;
    case "wrongCount":
      if (parameters.solveMode === "findAddedMemberValueFromShift") {
        return subtract(
          multiply(newAverage, rational(oldCount)),
          oldTotalAtChange,
        );
      }
      if (parameters.solveMode === "findRemovedMemberValueFromShift") {
        return absolute(
          subtract(
            oldTotalAtChange,
            multiply(newAverage, rational(oldCount)),
          ),
        );
      }
      if (parameters.solveMode === "findInningsValueOrNewCricketAverage") {
        return absolute(
          subtract(
            multiply(newAverage, rational(oldCount)),
            oldTotalAtChange,
          ),
        );
      }
      return undefined;
    case "ignoreOutgoingValue":
      return multiply(subtract(newAverage, oldAverage), rational(oldCount));
    case "wrongInningsCount":
      return absolute(
        subtract(
          multiply(newAverage, rational(oldCount)),
          oldTotalAtChange,
        ),
      );
    default:
      return undefined;
  }
}

function buildOptions(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId);
  const unique = [solver.answer];
  let misconceptionCount = 0;

  const addCandidate = (candidate: Rational | undefined, misconception: boolean) => {
    if (!candidate) return;
    const normalized = normalizedOptionValue(candidate, parameters);
    if (normalized.numerator <= 0) return;
    const rendered = String(normalized.numerator);
    if (unique.includes(rendered)) return;
    unique.push(rendered);
    if (misconception) misconceptionCount += 1;
  };

  for (const strategy of entry.distractorStrategyIds) {
    addCandidate(
      misconceptionCandidate(strategy, parameters, solver),
      true,
    );
  }

  const fallbackStep = parameters.contextDomain === "Workplace" ? 1000 : 1;
  for (const candidate of [
    subtract(solver.exactAnswer, rational(fallbackStep)),
    add(solver.exactAnswer, rational(fallbackStep)),
    add(solver.exactAnswer, rational(2 * fallbackStep)),
    subtract(solver.exactAnswer, rational(2 * fallbackStep)),
    add(solver.exactAnswer, rational(3 * fallbackStep)),
  ]) {
    if (unique.length === 4) break;
    addCandidate(candidate, false);
  }

  if (misconceptionCount < 2 || unique.length < 4) {
    throw new Error(
      `Insufficient misconception-driven CP-003 options for ${parameters.questionLanguageId}: ${misconceptionCount} misconception distractors`,
    );
  }

  const options = unique.slice(0, 4);
  const shift = hash(`${parameters.seed}:options:v2`) % options.length;
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }

  return {
    options,
    correctIndex: options.indexOf(solver.answer),
    misconceptionCount,
  };
}

export function runAvg001Cp003Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  const base = runBaseCp003Pipeline(input);
  const { options, correctIndex, misconceptionCount } = buildOptions(
    base.parameters,
    base.solver,
  );
  const replacementChecks = [
    {
      name: "options",
      passed: options.length === 4 && new Set(options).size === 4,
      message: "Four unique options",
    },
    {
      name: "correct",
      passed: options[correctIndex] === base.answer,
      message: "Correct index resolves answer",
    },
    {
      name: "misconception-options",
      passed: misconceptionCount >= 2,
      message: "At least two distractors come from authored misconception strategies",
    },
  ];
  const retainedChecks = base.validation.checks.filter(
    (check) => check.name !== "options" && check.name !== "correct",
  );
  const checks = [...retainedChecks, ...replacementChecks];
  const validation = {
    valid: checks.every((check) => check.passed),
    checks,
  };

  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }

  return {
    ...base,
    options,
    correctIndex,
    validation,
  };
}
