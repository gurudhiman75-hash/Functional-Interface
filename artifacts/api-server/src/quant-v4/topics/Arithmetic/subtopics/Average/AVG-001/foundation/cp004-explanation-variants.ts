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
  Avg001QuestionPackage,
  Rational,
} from "./types";

type Cp004Entry = ReturnType<typeof getAvg001QuestionEntry> & {
  unitKind?: string;
};

function rationalText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    const rationalValue = value as Rational;
    if (rationalValue.denominator === 1) return String(rationalValue.numerator);
    const numeric = toNumber(rationalValue);
    if (Number.isInteger(numeric * 10)) return numeric.toFixed(1);
    return `${rationalValue.numerator}/${rationalValue.denominator}`;
  }
  return "";
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${groupedLeading},${lastThree}${decimal}`;
}

function entryUnit(entry: Cp004Entry) {
  return entry.unitKind ?? "none";
}

function displayValue(entry: Cp004Entry, value: unknown) {
  const rendered = rationalText(value);
  const grouped =
    entryUnit(entry) === "currency" ? groupIndianDigits(rendered) : rendered;
  switch (entryUnit(entry)) {
    case "currency":
      return `₹${grouped}`;
    case "marks":
      return `${grouped} marks`;
    case "kg":
      return `${grouped} kg`;
    case "years":
      return `${grouped} years`;
    case "units":
      return `${grouped} units`;
    case "runs":
      return `${grouped} runs`;
    case "kmh":
      return `${grouped} km/h`;
    case "unitsPerHour":
      return `${grouped} units per hour`;
    default:
      return grouped;
  }
}

function mathValue(value: unknown) {
  return rationalText(value).replace(/,/g, "");
}

function absolute(value: Rational) {
  return rational(Math.abs(value.numerator), value.denominator);
}

function direction(value: Rational) {
  return value.numerator < 0 ? "lower" : "higher";
}

function plusOrMinus(value: Rational) {
  return value.numerator < 0 ? "-" : "+";
}

function conclusion(pkg: Avg001QuestionPackage, entry: Cp004Entry) {
  const answer =
    pkg.parameters.answerType === "COUNT"
      ? groupIndianDigits(pkg.answer)
      : displayValue(entry, pkg.answer);
  return `Therefore, ${entry.finalContext} = ${answer}.`;
}

function replaceExplanation(
  pkg: Avg001QuestionPackage,
  lines: string[],
): Avg001QuestionPackage {
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}

function weightedFormula(
  averages: Rational[],
  counts: number[],
  combinedCount: number,
  answer: string,
) {
  const products = averages
    .map((average, index) => `${mathValue(average)}\\times${counts[index]}`)
    .join("+");
  return `$$(${products})\\div${combinedCount}=${mathValue(answer)}$$`;
}

function renderTwoGroup(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const counts = values.groupCounts as number[];
  const averages = values.groupAverages as Rational[];
  const totals = values.groupTotals as Rational[];
  const combinedCount = Number(values.combinedCount);
  const combinedTotal = values.combinedTotal as Rational;

  if (strategy === "weighted-two-balance") {
    const gap = subtract(averages[1]!, averages[0]!);
    const adjustment = divide(
      multiply(gap, rational(counts[1]!)),
      rational(combinedCount),
    );
    return replaceExplanation(pkg, [
      `Start from the first group's average, ${displayValue(entry, averages[0])}.`,
      `The second group is ${displayValue(entry, absolute(gap))} ${direction(gap)}, and it contains ${counts[1]} members.`,
      `Its weighted effect on all ${combinedCount} members is ${displayValue(entry, absolute(adjustment))}.`,
      `$$${mathValue(averages[0])}${plusOrMinus(adjustment)}${mathValue(absolute(adjustment))}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "weighted-two-deviation") {
    const gap = subtract(averages[1]!, averages[0]!);
    const movement = divide(
      multiply(gap, rational(counts[1]!)),
      rational(combinedCount),
    );
    return replaceExplanation(pkg, [
      `The two group averages differ by ${displayValue(entry, absolute(gap))}.`,
      `Only ${counts[1]} of the ${combinedCount} members carry the second group's side of this difference.`,
      `Move ${displayValue(entry, absolute(movement))} from the first average toward the second average.`,
      `$$${mathValue(averages[0])}${plusOrMinus(movement)}${mathValue(absolute(movement))}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `The first group total is ${displayValue(entry, averages[0])} × ${counts[0]} = ${displayValue(entry, totals[0])}.`,
    `The second group total is ${displayValue(entry, averages[1])} × ${counts[1]} = ${displayValue(entry, totals[1])}.`,
    `Together, the total is ${displayValue(entry, combinedTotal)} for ${combinedCount} members.`,
    weightedFormula(averages, counts, combinedCount, pkg.answer),
    conclusion(pkg, entry),
  ]);
}

function renderMultiGroup(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const counts = values.groupCounts as number[];
  const averages = values.groupAverages as Rational[];
  const totals = values.groupTotals as Rational[];
  const combinedCount = Number(values.combinedCount);
  const combinedTotal = values.combinedTotal as Rational;

  if (strategy === "weighted-multi-table") {
    const contributions = totals
      .map(
        (total, index) =>
          `G${index + 1}: ${displayValue(entry, averages[index])} × ${counts[index]} = ${displayValue(entry, total)}`,
      )
      .join("; ");
    return replaceExplanation(pkg, [
      `Write one total for each group: ${contributions}.`,
      `Adding these group totals gives ${displayValue(entry, combinedTotal)}.`,
      `The groups contain ${combinedCount} members altogether.`,
      `$$${mathValue(combinedTotal)}\\div${combinedCount}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "weighted-multi-balance") {
    const base = averages[0]!;
    const weightedChanges = averages
      .slice(1)
      .map((average, index) =>
        multiply(subtract(average, base), rational(counts[index + 1]!)),
      );
    const netChange = weightedChanges.reduce(add, rational(0));
    const adjustment = divide(netChange, rational(combinedCount));
    return replaceExplanation(pkg, [
      `Use the first group's average, ${displayValue(entry, base)}, as the reference level.`,
      `After weighting the other groups by their sizes, the net change is ${displayValue(entry, absolute(netChange))} ${netChange.numerator < 0 ? "downward" : "upward"}.`,
      `Spread this change across all ${combinedCount} members.`,
      `$$${mathValue(base)}${plusOrMinus(adjustment)}${mathValue(absolute(adjustment))}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `Each group contributes its average multiplied by its own count.`,
    `The resulting group totals are ${totals.map((total) => displayValue(entry, total)).join(", ")}.`,
    `Their sum is ${displayValue(entry, combinedTotal)}, and the combined count is ${combinedCount}.`,
    weightedFormula(averages, counts, combinedCount, pkg.answer),
    conclusion(pkg, entry),
  ]);
}

function renderUnknownCount(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const knownCount = Number(values.knownGroupCount);
  const knownAverage = values.knownGroupAverage as Rational;
  const unknownAverage = values.unknownGroupAverage as Rational;
  const combinedAverage = values.combinedAverage as Rational;
  const knownSide = subtract(combinedAverage, knownAverage);
  const unknownSide = subtract(unknownAverage, combinedAverage);
  const knownWeightedGap = multiply(rational(knownCount), knownSide);

  if (strategy === "weighted-count-equation") {
    return replaceExplanation(pkg, [
      `Let the number in the second group be x.`,
      `Its total is ${mathValue(unknownAverage)}x, while the first group's total is ${mathValue(knownAverage)}×${knownCount}.`,
      `The combined total must also equal ${mathValue(combinedAverage)}(${knownCount}+x).`,
      `$$${mathValue(knownAverage)}\\times${knownCount}+${mathValue(unknownAverage)}x=${mathValue(combinedAverage)}(${knownCount}+x)\\Rightarrow x=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "weighted-count-deviation") {
    return replaceExplanation(pkg, [
      `The first group is ${displayValue(entry, absolute(knownSide))} from the combined average.`,
      `The second group is ${displayValue(entry, absolute(unknownSide))} on the opposite side.`,
      `Their weighted deviations must balance.`,
      `$$${knownCount}\\times${mathValue(absolute(knownSide))}\\div${mathValue(absolute(unknownSide))}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `The known group creates a weighted gap of ${knownCount} × ${displayValue(entry, absolute(knownSide))} = ${displayValue(entry, absolute(knownWeightedGap))}.`,
    `Each member of the second group offsets ${displayValue(entry, absolute(unknownSide))} of that gap.`,
    `Divide the total gap by the offset supplied by one second-group member.`,
    `$$${mathValue(absolute(knownWeightedGap))}\\div${mathValue(absolute(unknownSide))}=${mathValue(pkg.answer)}$$`,
    conclusion(pkg, entry),
  ]);
}

function renderMissingAverage(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const knownCount = Number(values.knownGroupCount);
  const unknownCount = Number(values.unknownGroupCount);
  const knownAverage = values.knownGroupAverage as Rational;
  const combinedAverage = values.combinedAverage as Rational;
  const combinedCount = Number(values.combinedCount);
  const combinedTotal = values.combinedTotal as Rational;
  const knownTotal = multiply(knownAverage, rational(knownCount));
  const missingTotal = subtract(combinedTotal, knownTotal);
  const knownDeviation = subtract(combinedAverage, knownAverage);
  const adjustment = divide(
    multiply(knownDeviation, rational(knownCount)),
    rational(unknownCount),
  );

  if (strategy === "weighted-missing-equation") {
    return replaceExplanation(pkg, [
      `Let the second group's average be x.`,
      `The first group contributes ${mathValue(knownAverage)}×${knownCount}, and the second contributes ${unknownCount}x.`,
      `Together they must total ${mathValue(combinedAverage)}×${combinedCount}.`,
      `$$${mathValue(knownAverage)}\\times${knownCount}+${unknownCount}x=${mathValue(combinedAverage)}\\times${combinedCount}\\Rightarrow x=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "weighted-missing-balance") {
    return replaceExplanation(pkg, [
      `The first group's average is ${displayValue(entry, absolute(knownDeviation))} ${knownDeviation.numerator < 0 ? "above" : "below"} the combined average.`,
      `Across ${knownCount} members, this creates a weighted difference of ${displayValue(entry, absolute(multiply(knownDeviation, rational(knownCount))))}.`,
      `The ${unknownCount} members in the second group must balance that difference.`,
      `$$${mathValue(combinedAverage)}${plusOrMinus(adjustment)}${mathValue(absolute(adjustment))}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `The required total for all ${combinedCount} members is ${displayValue(entry, combinedAverage)} × ${combinedCount} = ${displayValue(entry, combinedTotal)}.`,
    `The known group contributes ${displayValue(entry, knownAverage)} × ${knownCount} = ${displayValue(entry, knownTotal)}.`,
    `So the second group must contribute ${displayValue(entry, missingTotal)} in total.`,
    `$$${mathValue(missingTotal)}\\div${unknownCount}=${mathValue(pkg.answer)}$$`,
    conclusion(pkg, entry),
  ]);
}

function renderEqualDistance(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const speed1 = values.speed1 as Rational;
  const speed2 = values.speed2 as Rational;
  const product = multiply(speed1, speed2);
  const sum = add(speed1, speed2);

  if (strategy === "speed-harmonic-time") {
    return replaceExplanation(pkg, [
      `Take the distance of each leg as ${mathValue(product)} km.`,
      `The two travel times are then ${mathValue(speed2)} hours and ${mathValue(speed1)} hours.`,
      `Total distance is ${mathValue(multiply(rational(2), product))} km and total time is ${mathValue(sum)} hours.`,
      `$$${mathValue(multiply(rational(2), product))}\\div${mathValue(sum)}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "speed-harmonic-formula") {
    return replaceExplanation(pkg, [
      `Equal distances do not give the two speeds equal time weight.`,
      `The slower leg takes longer, so the arithmetic mean is not valid.`,
      `Use the equal-distance average-speed formula.`,
      `$$\\frac{2\\times${mathValue(speed1)}\\times${mathValue(speed2)}}{${mathValue(speed1)}+${mathValue(speed2)}}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `Both legs cover the same distance, but at ${displayValue(entry, speed1)} and ${displayValue(entry, speed2)}.`,
    `Average speed is total distance divided by total travel time.`,
    `For equal distances, this becomes twice the product divided by the sum.`,
    `$$2\\times${mathValue(speed1)}\\times${mathValue(speed2)}\\div(${mathValue(speed1)}+${mathValue(speed2)})=${mathValue(pkg.answer)}$$`,
    conclusion(pkg, entry),
  ]);
}

function renderEqualTime(
  pkg: Avg001QuestionPackage,
  entry: Cp004Entry,
  strategy: string,
) {
  const values = pkg.parameters.values as Record<string, any>;
  const speed1 = values.speed1 as Rational;
  const speed2 = values.speed2 as Rational;
  const lower = toNumber(speed1) <= toNumber(speed2) ? speed1 : speed2;
  const higher = toNumber(speed1) <= toNumber(speed2) ? speed2 : speed1;
  const halfGap = divide(subtract(higher, lower), rational(2));
  const quantity = entryUnit(entry) === "unitsPerHour" ? "output" : "distance";

  if (strategy === "speed-equal-time-total") {
    return replaceExplanation(pkg, [
      `Assume each rate applies for one hour.`,
      `The two periods produce a total ${quantity} of ${mathValue(add(speed1, speed2))} in two hours.`,
      `Average rate is total ${quantity} divided by total time.`,
      `$$(${mathValue(speed1)}+${mathValue(speed2)})\\div2=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  if (strategy === "speed-equal-time-balance") {
    return replaceExplanation(pkg, [
      `The two rates act for equal time, so the average lies exactly halfway between them.`,
      `Their difference is ${displayValue(entry, subtract(higher, lower))}.`,
      `Add half of this difference to the lower rate.`,
      `$$${mathValue(lower)}+${mathValue(halfGap)}=${mathValue(pkg.answer)}$$`,
      conclusion(pkg, entry),
    ]);
  }

  return replaceExplanation(pkg, [
    `Both rates apply for the same duration, so they carry equal weight.`,
    `Add ${displayValue(entry, speed1)} and ${displayValue(entry, speed2)}.`,
    `Divide their sum by two.`,
    `$$(${mathValue(speed1)}+${mathValue(speed2)})\\div2=${mathValue(pkg.answer)}$$`,
    conclusion(pkg, entry),
  ]);
}

export function applyAvg001Cp004ExplanationVariants(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-004") return pkg;

  const entry = getAvg001QuestionEntry(pkg.questionLanguageId) as Cp004Entry;
  const strategy = entry.explanationStrategyId;

  switch (pkg.solveMode) {
    case "findCombinedAverageOfTwoGroups":
      return renderTwoGroup(pkg, entry, strategy);
    case "findCombinedAverageOfThreeOrFourGroups":
      return renderMultiGroup(pkg, entry, strategy);
    case "findGroupCountFromCombinedAverage":
      return renderUnknownCount(pkg, entry, strategy);
    case "findMissingGroupAverage":
      return renderMissingAverage(pkg, entry, strategy);
    case "findAverageSpeedEqualDistance":
      return renderEqualDistance(pkg, entry, strategy);
    case "findAverageSpeedEqualTime":
      return renderEqualTime(pkg, entry, strategy);
    default:
      return pkg;
  }
}
