import type { Avg001QuestionPackage } from "./types";

const directStrategies = new Set([
  "correct-total-then-divide",
  "reverse-average-shift",
  "recover-correct-entry",
  "recover-wrong-entry",
  "scale-average-change",
  "spread-entry-difference",
  "count-from-delta-ratio",
  "net-two-entry-correction",
]);

const averageFirstStrategies = new Set([
  "per-record-delta",
  "restore-wrong-total",
  "total-gap-equation",
  "reverse-total-gap",
  "compare-wrong-correct-totals",
  "per-record-correction",
  "total-gap-over-average-gap",
  "rebuild-two-entry-total",
]);

function styleIndex(strategy: string) {
  if (directStrategies.has(strategy)) return 0;
  if (averageFirstStrategies.has(strategy)) return 1;
  return 2;
}

function value(raw: unknown) {
  return String(raw ?? "");
}

function conclusion(pkg: Avg001QuestionPackage) {
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
    case "findCorrectedAverageFromMultipleMistakes":
      return `So the correct average is ${pkg.answer}.`;
    case "findReportedAverageBeforeCorrection":
      return `So the old average was ${pkg.answer}.`;
    case "findCorrectValueFromAverageShift":
      return `So the correct value is ${pkg.answer}.`;
    case "findIncorrectValueFromCorrection":
      return `So the wrong value was ${pkg.answer}.`;
    case "findEntryDifferenceFromAverageCorrection":
      return `So the two values differ by ${pkg.answer}.`;
    case "findAverageChangeFromEntryCorrection":
      return `So the average changes by ${pkg.answer}.`;
    case "findNumberOfItemsFromTotalCorrection":
      return `So ${pkg.answer} records were included.`;
    default:
      return `So the answer is ${pkg.answer}.`;
  }
}

function buildLines(pkg: Avg001QuestionPackage, style: number) {
  const v = pkg.parameters.renderVariables;
  const count = value(v.count);
  const oldAverage = value(v.reportedAverage);
  const correctAverage = value(v.correctedAverage);
  const wrong = value(v.incorrectValue);
  const correct = value(v.correctValue);
  const wrong2 = value(v.incorrectValue2);
  const correct2 = value(v.correctValue2);
  const difference = value(v.entryDifference);
  const change = value(v.averageChange);
  const finalLine = conclusion(pkg);

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      if (style === 0) return [
        `${wrong} was used instead of ${correct}. First find how much the total changes.`,
        `$$Change in total = ${correct} - ${wrong}$$`,
        `$$Correct average = ${oldAverage} + [(${correct} - ${wrong}) ÷ ${count}] = ${correctAverage}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `Only one value is wrong. Divide its difference by ${count} to find the change in average.`,
        `$$Difference = ${correct} - ${wrong}$$`,
        `$$Correct average = ${oldAverage} + [(${correct} - ${wrong}) ÷ ${count}] = ${correctAverage}$$`,
        finalLine,
      ];
      return [
        `The old total contains ${wrong}. Remove it and add ${correct}.`,
        `$$Correct total = (${oldAverage} × ${count}) - ${wrong} + ${correct}$$`,
        `$$Correct average = [(${oldAverage} × ${count}) - ${wrong} + ${correct}] ÷ ${count} = ${correctAverage}$$`,
        finalLine,
      ];

    case "findReportedAverageBeforeCorrection":
      if (style === 0) return [
        `Changing ${wrong} to ${correct} changed the average. Subtract that change from the correct average.`,
        `$$Change in total = ${correct} - ${wrong}$$`,
        `$$Old average = ${correctAverage} - [(${correct} - ${wrong}) ÷ ${count}] = ${oldAverage}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `The difference between the two values is divided among ${count} records.`,
        `$$Change in average = (${correct} - ${wrong}) ÷ ${count}$$`,
        `$$Old average = ${correctAverage} - [(${correct} - ${wrong}) ÷ ${count}] = ${oldAverage}$$`,
        finalLine,
      ];
      return [
        `Start with the correct total. Remove ${correct} and put ${wrong} back.`,
        `$$Old total = (${correctAverage} × ${count}) - ${correct} + ${wrong}$$`,
        `$$Old average = [(${correctAverage} × ${count}) - ${correct} + ${wrong}] ÷ ${count} = ${oldAverage}$$`,
        finalLine,
      ];

    case "findCorrectValueFromAverageShift":
      if (style === 2) return [
        `The difference between the two totals comes only from the wrong value.`,
        `$$Difference in totals = (${correctAverage} × ${count}) - (${oldAverage} × ${count})$$`,
        `$$Correct value = ${wrong} + [(${correctAverage} × ${count}) - (${oldAverage} × ${count})] = ${correct}$$`,
        finalLine,
      ];
      return [
        `The average changed from ${oldAverage} to ${correctAverage}. Multiply this change by ${count}.`,
        `$$Change in total = (${correctAverage} - ${oldAverage}) × ${count}$$`,
        `$$Correct value = ${wrong} + [(${correctAverage} - ${oldAverage}) × ${count}] = ${correct}$$`,
        finalLine,
      ];

    case "findIncorrectValueFromCorrection":
      if (style === 2) return [
        `The difference between the two totals is the amount added to or removed from the wrong value.`,
        `$$Difference in totals = (${correctAverage} × ${count}) - (${oldAverage} × ${count})$$`,
        `$$Wrong value = ${correct} - [(${correctAverage} × ${count}) - (${oldAverage} × ${count})] = ${wrong}$$`,
        finalLine,
      ];
      return [
        `Find how much the total changed, then use it to work back from the correct value.`,
        `$$Change in total = (${correctAverage} - ${oldAverage}) × ${count}$$`,
        `$$Wrong value = ${correct} - [(${correctAverage} - ${oldAverage}) × ${count}] = ${wrong}$$`,
        finalLine,
      ];

    case "findEntryDifferenceFromAverageCorrection":
      return [
        style === 2
          ? `The difference between the correct and old totals is the difference between the two values.`
          : `Multiply the change in average by ${count} to get the difference between the two values.`,
        `$$Change in average = |${correctAverage} - ${oldAverage}| = ${change}$$`,
        `$$Difference between values = ${change} × ${count} = ${difference}$$`,
        finalLine,
      ];

    case "findAverageChangeFromEntryCorrection":
      return [
        style === 2
          ? `Replacing ${wrong} with ${correct} changes the total by their difference. Divide by ${count}.`
          : `The two values differ by ${difference}. Divide this by ${count} to find the change in average.`,
        `$$Difference between values = |${correct} - ${wrong}| = ${difference}$$`,
        `$$Change in average = ${difference} ÷ ${count} = ${change}$$`,
        finalLine,
      ];

    case "findNumberOfItemsFromTotalCorrection":
      return [
        style === 2
          ? `Divide the difference between the two values by the change in average.`
          : `The full difference is ${difference}, while the average changes by ${change} for each record.`,
        `$$Difference between values = |${correct} - ${wrong}| = ${difference}$$`,
        `$$Number of records = ${difference} ÷ ${change} = ${count}$$`,
        finalLine,
      ];

    case "findCorrectedAverageFromMultipleMistakes":
      if (style === 2) return [
        `Remove both wrong values from the old total and add both correct values.`,
        `$$Correct total = (${oldAverage} × ${count}) - ${wrong} - ${wrong2} + ${correct} + ${correct2}$$`,
        `$$Correct average = [(${oldAverage} × ${count}) - ${wrong} - ${wrong2} + ${correct} + ${correct2}] ÷ ${count} = ${correctAverage}$$`,
        finalLine,
      ];
      return [
        `Find the change caused by both wrong values, then divide it by ${count}.`,
        `$$Total change = (${correct} - ${wrong}) + (${correct2} - ${wrong2})$$`,
        `$$Correct average = ${oldAverage} + [(${correct} - ${wrong}) + (${correct2} - ${wrong2})] ÷ ${count} = ${correctAverage}$$`,
        finalLine,
      ];

    default:
      return pkg.explanation.lines.map((line) => line.replace(/div/g, "÷"));
  }
}

export function applyAvg001Cp005ExplanationVariants(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005") return pkg;
  const strategy = String(pkg.traceability.explanationStrategyId ?? "");
  return { ...pkg, explanation: { lines: buildLines(pkg, styleIndex(strategy)) } };
}
