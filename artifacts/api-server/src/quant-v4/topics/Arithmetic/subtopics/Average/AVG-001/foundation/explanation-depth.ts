import type { Avg001QuestionPackage } from "./types";

type Entity = { singular: string; plural: string };

const ENTITIES: Record<string, Entity> = {
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

function rationalText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    const numerator = Number((value as { numerator: number }).numerator);
    const denominator = Number((value as { denominator: number }).denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10)
      ? decimal.toFixed(1)
      : `${numerator}/${denominator}`;
  }
  return "";
}

function numericValue(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/,/g, ""));
  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    return (
      Number((value as { numerator: number }).numerator) /
      Number((value as { denominator: number }).denominator)
    );
  }
  return Number.NaN;
}

function cleanNumber(value: number) {
  if (Number.isInteger(value)) return String(value);
  if (Number.isInteger(value * 10)) return value.toFixed(1);
  return String(Number(value.toFixed(2)));
}

function mathNumber(value: string) {
  return value.replace(/,/g, "");
}

function shown(pkg: Avg001QuestionPackage, key: string): string {
  const renderVariables = pkg.parameters.renderVariables as Record<string, unknown>;
  const values = pkg.parameters.values as Record<string, unknown>;
  return rationalText(renderVariables[key] ?? values[key]);
}

function shownEither(pkg: Avg001QuestionPackage, ...keys: string[]) {
  for (const key of keys) {
    const value = shown(pkg, key);
    if (value) return value;
  }
  return "";
}

function calculation(pkg: Avg001QuestionPackage): string {
  return (
    pkg.explanation.lines.find((line) => /\$\$/.test(line)) ??
    `$$${pkg.reasoningEvidence.decisiveCalculation}$$`
  );
}

function resultLine(pkg: Avg001QuestionPackage) {
  return `Therefore, the required result is ${pkg.answer}.`;
}

function withLines(
  pkg: Avg001QuestionPackage,
  lines: string[],
): Avg001QuestionPackage {
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines: [...lines, resultLine(pkg)],
    },
  };
}

function simplifyCp001(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const entity = ENTITIES[pkg.parameters.scenarioVariant] ?? {
    singular: "value",
    plural: "values",
  };
  const count = shown(pkg, "count");
  const average = shown(pkg, "average");
  const total = shown(pkg, "total");
  const knownTotal = shown(pkg, "knownTotal");

  switch (pkg.solveMode) {
    case "findSumFromAverageAndCount":
      return withLines(pkg, [
        `There are ${count} ${entity.plural}, with an average of ${average}.`,
        `So multiply the average by the number of ${entity.plural}.`,
        calculation(pkg),
      ]);

    case "findAverageFromSumAndCount":
      return withLines(pkg, [
        `The total ${total} is shared among ${count} ${entity.plural}.`,
        `So divide the total by ${count}.`,
        calculation(pkg),
      ]);

    case "findCountFromSumAndAverage":
      return withLines(pkg, [
        `The total is ${total}, and the average for each ${entity.singular} is ${average}.`,
        `So divide the total by the average to find the number of ${entity.plural}.`,
        calculation(pkg),
      ]);

    case "findMissingValueFromAverage":
      return withLines(pkg, [
        `The required total for ${count} ${entity.plural} is ${total}.`,
        `The known values add up to ${knownTotal}.`,
        `Subtract the known total from the required total.`,
        `$$${mathNumber(total)}-${mathNumber(knownTotal)}=${mathNumber(pkg.answer)}$$`,
      ]);

    default:
      return pkg;
  }
}

function simplifyCp002(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const count = Number(shown(pkg, "count"));
  const first = shown(pkg, "firstTerm");
  const last = shown(pkg, "lastTerm");
  const average = shown(pkg, "average");
  const difference = shown(pkg, "commonDifference");
  const target = String(pkg.parameters.values.targetExtreme ?? "largest");

  if (
    pkg.solveMode === "findAverageOfConsecutiveSet" ||
    pkg.solveMode === "findAverageOfOddOrEvenSet"
  ) {
    return withLines(pkg, [
      `The numbers are equally spaced, so their average is halfway between ${first} and ${last}.`,
      `Only the first and last numbers are needed.`,
      calculation(pkg),
    ]);
  }

  if (pkg.solveMode === "findMiddleTermFromAverage") {
    return withLines(pkg, [
      `There are ${count} equally spaced terms, so there is one middle term.`,
      `For an odd number of terms, the middle term is the same as the average ${average}.`,
      calculation(pkg),
    ]);
  }

  if (pkg.solveMode === "findExtremeFromAverageAndCount") {
    return withLines(pkg, [
      `${count} terms have ${count - 1} equal gaps of ${difference}.`,
      `Half of this span lies on each side of the average.`,
      `${target === "smallest" ? "Subtract" : "Add"} that half-span ${target === "smallest" ? "from" : "to"} the average.`,
      calculation(pkg),
    ]);
  }

  return pkg;
}

function simplifyCp003(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const values = pkg.parameters.values as Record<string, unknown>;
  const oldCount = shown(pkg, "oldCount");
  const newCount = shown(pkg, "newCount");
  const oldAverage = shown(pkg, "oldAverage");
  const newAverage = shown(pkg, "newAverage");
  const addedValue = shownEither(pkg, "addedValue", "nextScore");
  const removedValue = shown(pkg, "removedValue");
  const outgoingValue = shownEither(pkg, "outgoingValue", "oldValue");
  const incomingValue = shownEither(pkg, "incomingValue", "newValue");
  const elapsedYears = Number(values.elapsedYears ?? values.yearsElapsed ?? 0);
  const ageScenario = /Years|Elapsed/.test(pkg.parameters.scenarioVariant);
  const oldAverageNumber = numericValue(values.oldAverage ?? values.average);
  const oldCountNumber = Number(values.oldCount ?? values.count ?? oldCount);
  const averageAtChange = ageScenario
    ? oldAverageNumber + elapsedYears
    : oldAverageNumber;
  const oldTotalAtChange = cleanNumber(averageAtChange * oldCountNumber);
  const averageAtChangeText = cleanNumber(averageAtChange);
  const ageLine = ageScenario
    ? `After ${elapsedYears} years, the old average becomes ${averageAtChangeText}.`
    : null;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `Old total = ${averageAtChangeText} × ${oldCount} = ${oldTotalAtChange}.`,
        `Add ${addedValue}; then divide the new total by ${newCount}.`,
        calculation(pkg),
      ]);

    case "findNewAverageAfterRemoval":
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `Old total = ${averageAtChangeText} × ${oldCount} = ${oldTotalAtChange}.`,
        `Subtract ${removedValue}; then divide the remaining total by ${newCount}.`,
        calculation(pkg),
      ]);

    case "findNewAverageAfterReplacement":
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `Old total = ${averageAtChangeText} × ${oldCount} = ${oldTotalAtChange}.`,
        `Replace ${outgoingValue} with ${incomingValue}; the count remains unchanged at ${oldCount}.`,
        calculation(pkg),
      ]);

    case "findAddedMemberValueFromShift":
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `Old total = ${averageAtChangeText} × ${oldCount} = ${oldTotalAtChange}.`,
        `New total = ${newAverage} × ${newCount}.`,
        `The difference between the two totals gives the new value.`,
        calculation(pkg),
      ]);

    case "findRemovedMemberValueFromShift":
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `Old total = ${averageAtChangeText} × ${oldCount} = ${oldTotalAtChange}.`,
        `Remaining total = ${newAverage} × ${newCount}.`,
        `The difference between these totals gives the removed value.`,
        calculation(pkg),
      ]);

    case "findReplacementValueFromShift": {
      const increase = numericValue(values.newAverage) - averageAtChange;
      const totalChange = cleanNumber(Math.abs(increase * oldCountNumber));
      const replacementTarget = String(values.replacementTarget ?? "new");
      return withLines(pkg, [
        ...(ageLine ? [ageLine] : []),
        `The count stays ${oldCount}, and the average ${increase >= 0 ? "rises" : "falls"} by ${cleanNumber(Math.abs(increase))}.`,
        `So the total ${increase >= 0 ? "rises" : "falls"} by ${totalChange}.`,
        replacementTarget === "old"
          ? `Compare this change with the known incoming value ${incomingValue}.`
          : `Apply this change to the outgoing value ${outgoingValue}.`,
        calculation(pkg),
      ]);
    }

    case "findInningsValueOrNewCricketAverage":
      if (
        pkg.parameters.answerType === "MEMBER_VALUE" ||
        values.targetKind === "memberValue"
      ) {
        return withLines(pkg, [
          `Current runs = ${oldAverage} × ${oldCount}.`,
          `Required runs = ${newAverage} × ${newCount}.`,
          `The next score is the difference between these totals.`,
          calculation(pkg),
        ]);
      }
      return withLines(pkg, [
        `Current runs = ${oldAverage} × ${oldCount}.`,
        `Add the next score ${addedValue}; the innings become ${newCount}.`,
        `Divide the new total by ${newCount}.`,
        calculation(pkg),
      ]);

    default:
      return pkg;
  }
}

export function applyAvg001ExplanationDepth(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  switch (pkg.canonicalProblemId) {
    case "AVG-CP-001":
      return simplifyCp001(pkg);
    case "AVG-CP-002":
      return simplifyCp002(pkg);
    case "AVG-CP-003":
      return simplifyCp003(pkg);
    default:
      return pkg;
  }
}