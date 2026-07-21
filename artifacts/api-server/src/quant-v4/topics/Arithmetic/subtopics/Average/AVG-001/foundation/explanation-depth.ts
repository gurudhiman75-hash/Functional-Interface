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

function shown(pkg: Avg001QuestionPackage, key: string): string {
  const renderVariables = pkg.parameters.renderVariables as Record<string, unknown>;
  const values = pkg.parameters.values as Record<string, unknown>;
  return rationalText(renderVariables[key] ?? values[key]);
}

function originalCalculation(pkg: Avg001QuestionPackage): string {
  return (
    pkg.explanation.lines.find((line) => /\$\$/.test(line)) ??
    `$$${pkg.reasoningEvidence.decisiveCalculation}$$`
  );
}

function lineContainsAnswer(line: string, answer: string): boolean {
  const normalizedLine = line.replace(/,/g, "");
  const normalizedAnswer = answer.replace(/,/g, "");
  const escaped = normalizedAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^0-9.])${escaped}([^0-9.]|$)`).test(normalizedLine);
}

function originalConclusion(pkg: Avg001QuestionPackage): string {
  if (
    pkg.parameters.scenarioVariant === "newbornAfterElapsedYears" &&
    pkg.solveMode === "findAddedMemberValueFromShift"
  ) {
    return `Therefore, the new member was ${pkg.answer} years old at joining.`;
  }

  return (
    [...pkg.explanation.lines]
      .reverse()
      .find(
        (line) =>
          lineContainsAnswer(line, pkg.answer) &&
          !/\$\$/.test(line) &&
          !/check|verification|indeed|again/i.test(line),
      ) ?? `Therefore, the required result is ${pkg.answer}.`
  );
}

function originalCheck(pkg: Avg001QuestionPackage): string | undefined {
  return pkg.explanation.lines.find((line) =>
    /check|verification|indeed|again/i.test(line),
  );
}

function finish(
  pkg: Avg001QuestionPackage,
  reasoningLines: string[],
): Avg001QuestionPackage {
  const lines = [
    ...reasoningLines,
    originalCalculation(pkg),
    originalConclusion(pkg),
    originalCheck(pkg),
  ].filter((line): line is string => Boolean(line));

  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}

function deepenCp001(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
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
      return finish(pkg, [
        `An average of ${average} means the same combined total would be obtained if each of the ${count} ${entity.plural} contributed an equal share of ${average}.`,
        `The required total therefore consists of ${count} such equal shares.`,
        `Multiplying the representative share by the number of ${entity.plural} gives the combined total.`,
      ]);

    case "findAverageFromSumAndCount":
      return finish(pkg, [
        `The amount ${total} is the combined total for ${count} ${entity.plural}.`,
        `An average is the equal share obtained when this total is distributed evenly among all ${count} ${entity.plural}.`,
        `So the correct operation is total divided by count, not a comparison of individual values.`,
      ]);

    case "findCountFromSumAndAverage":
      return finish(pkg, [
        `The total ${total} can be viewed as equal-share groups, with each group representing the average value ${average}.`,
        `The required count is the number of these equal groups contained in the total.`,
        `Therefore, dividing the total by the value represented by one group gives the number of ${entity.plural}.`,
      ]);

    case "findMissingValueFromAverage":
      return finish(pkg, [
        `The stated average fixes the total that all ${count} ${entity.plural} must make together.`,
        `The known ${entity.plural} already contribute ${knownTotal}, so only the remaining gap is unaccounted for.`,
        `The missing ${entity.singular} must equal the required full total minus this known contribution.`,
      ]);

    default:
      return pkg;
  }
}

function deepenCp002(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const count = Number(shown(pkg, "count"));
  const first = shown(pkg, "firstTerm");
  const last = shown(pkg, "lastTerm");
  const average = shown(pkg, "average");
  const difference = shown(pkg, "commonDifference");
  const halfSpan = rationalText(
    (pkg.reasoningEvidence.intermediateValues as Record<string, unknown>).halfSpan,
  );
  const target = String(pkg.parameters.values.targetExtreme ?? "largest");

  if (
    pkg.solveMode === "findAverageOfConsecutiveSet" ||
    pkg.solveMode === "findAverageOfOddOrEvenSet"
  ) {
    return finish(pkg, [
      `Because the values are equally spaced, every step above the centre is matched by an equal step below it.`,
      `Thus, the first and last values (${first} and ${last}), the second and second-last, and every other opposite pair have the same pair mean.`,
      `The average of the whole set is therefore the common mean of its opposite-end pairs.`,
    ]);
  }

  if (pkg.solveMode === "findMiddleTermFromAverage") {
    return finish(pkg, [
      `With ${count} equally spaced values, terms on the two sides of the centre occur in balanced pairs.`,
      `Each lower deviation from the centre is cancelled by an equal upper deviation.`,
      `The unpaired central term must therefore equal the given average, ${average}.`,
    ]);
  }

  if (pkg.solveMode === "findExtremeFromAverageAndCount") {
    return finish(pkg, [
      `${count} terms create ${count - 1} equal gaps, each of size ${difference}.`,
      `The average lies halfway between the two extremes, so the distance from the average to either end is half of the complete span${halfSpan ? `, namely ${halfSpan}` : ""}.`,
      `${target === "smallest" ? "Subtracting" : "Adding"} this half-span ${target === "smallest" ? "from" : "to"} the average locates the requested ${target} value.`,
    ]);
  }

  return pkg;
}

function deepenCp003(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const values = pkg.parameters.values as Record<string, unknown>;
  const oldCount = shown(pkg, "oldCount");
  const newCount = shown(pkg, "newCount");
  const oldAverage = shown(pkg, "oldAverage");
  const newAverage = shown(pkg, "newAverage");
  const oldTotal = shown(pkg, "oldTotal");
  const newTotal = shown(pkg, "newTotal");
  const addedValue = shown(pkg, "addedValue");
  const removedValue = shown(pkg, "removedValue");
  const outgoingValue = shown(pkg, "outgoingValue");
  const incomingValue = shown(pkg, "incomingValue");
  const elapsedYears = Number(values.elapsedYears ?? 0);
  const ageScenario = /Years|Elapsed/.test(pkg.parameters.scenarioVariant);
  const oldAverageNumber = numericValue(values.oldAverage);
  const oldCountNumber = numericValue(values.oldCount);
  const averageAtChange = ageScenario
    ? rationalText(oldAverageNumber + elapsedYears)
    : oldAverage;
  const totalAtChange = ageScenario
    ? rationalText((oldAverageNumber + elapsedYears) * oldCountNumber)
    : oldTotal;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return finish(pkg, [
        ...(ageScenario
          ? [
              `Before the new member joins, every original member has aged by ${elapsedYears} years, so the original group average also rises by ${elapsedYears} to ${averageAtChange}.`,
            ]
          : []),
        `The existing ${oldCount} members have a combined total represented by average × count${totalAtChange ? `, giving ${totalAtChange}` : ""}.`,
        `Adding the new value ${addedValue} increases the total, while the count rises from ${oldCount} to ${newCount}.`,
        `The revised average is the updated total shared equally across all ${newCount} members.`,
      ]);

    case "findNewAverageAfterRemoval":
      return finish(pkg, [
        `The old average represents the combined total of ${oldCount} observations${oldTotal ? `, namely ${oldTotal}` : ""}.`,
        `Removing ${removedValue} reduces both the total and the count; ${newCount} observations remain.`,
        `The new average must therefore be calculated from the remaining total, not from the old average alone.`,
      ]);

    case "findNewAverageAfterReplacement":
      return finish(pkg, [
        `A replacement does not change the number of observations, so the count remains ${oldCount}.`,
        `Only the total changes: ${outgoingValue} is removed and ${incomingValue} is added.`,
        `The resulting change in the total is spread across the same ${oldCount} observations to obtain the revised average.`,
      ]);

    case "findAddedMemberValueFromShift":
      return finish(pkg, [
        ...(ageScenario
          ? [
              `After ${elapsedYears} years, the original group average first becomes ${averageAtChange}; this aged state must be used before the new member is included.`,
            ]
          : []),
        `The new average ${newAverage} for ${newCount} members fixes the required new total${newTotal ? ` at ${newTotal}` : ""}.`,
        `The original group already accounts for its adjusted total, so the joining member must supply exactly the difference between the new and old totals.`,
        `That total gap is the value of the added member.`,
      ]);

    case "findRemovedMemberValueFromShift":
      return finish(pkg, [
        ...(ageScenario
          ? [
              `Before the member leaves, all original members age by ${elapsedYears} years, so the average at the time of departure is ${averageAtChange}.`,
            ]
          : []),
        `The old group total and the remaining group total describe the group immediately before and after the removal.`,
        `Since ${newCount} members remain with average ${newAverage}, their total is fixed${newTotal ? ` at ${newTotal}` : ""}.`,
        `The amount missing from the old total is precisely the value of the member who left.`,
      ]);

    case "findReplacementValueFromShift":
      return finish(pkg, [
        `The count stays fixed at ${oldCount}, so a rise in average from ${oldAverage} to ${newAverage} represents a definite rise in the total.`,
        `That total rise equals the average increase multiplied by ${oldCount}.`,
        `The incoming value must therefore equal the outgoing value ${outgoingValue} plus the required rise in total.`,
      ]);

    case "findInningsValueOrNewCricketAverage":
      if (values.targetKind === "memberValue") {
        return finish(pkg, [
          `The current batting average ${oldAverage} over ${oldCount} innings determines the runs already scored in total.`,
          `After one more innings, the target average ${newAverage} over ${newCount} innings determines the total runs that will be required.`,
          `The score in the next innings must fill the gap between this target total and the current total.`,
        ]);
      }
      return finish(pkg, [
        `The current average ${oldAverage} over ${oldCount} innings first gives the batter's existing run total.`,
        `The next score ${addedValue} is added to that total, and the innings count rises to ${newCount}.`,
        `Sharing the updated run total across ${newCount} innings gives the revised batting average.`,
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
      return deepenCp001(pkg);
    case "AVG-CP-002":
      return deepenCp002(pkg);
    case "AVG-CP-003":
      return deepenCp003(pkg);
    default:
      return pkg;
  }
}
