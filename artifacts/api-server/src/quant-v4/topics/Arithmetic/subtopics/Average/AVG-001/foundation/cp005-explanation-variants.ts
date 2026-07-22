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

const shiftStrategies = new Set([
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
  if (shiftStrategies.has(strategy)) return 1;
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
      return `So the average reported before correction was ${pkg.answer}.`;
    case "findCorrectValueFromAverageShift":
      return `So the value that should have been entered is ${pkg.answer}.`;
    case "findIncorrectValueFromCorrection":
      return `So the value entered incorrectly was ${pkg.answer}.`;
    case "findEntryDifferenceFromAverageCorrection":
      return `So the wrong and correct entries differ by ${pkg.answer}.`;
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
  const reported = value(v.reportedAverage);
  const corrected = value(v.correctedAverage);
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
        `${wrong} was used instead of ${correct}, so the recorded total must be corrected first.`,
        `$$Change in total = ${correct} - ${wrong}$$`,
        `$$Correct average = ${reported} + [(${correct} - ${wrong}) ÷ ${count}] = ${corrected}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `Only one entry is wrong, so its difference is shared across all ${count} records.`,
        `$$Difference in the entry = ${correct} - ${wrong}$$`,
        `$$Correct average = ${reported} + [(${correct} - ${wrong}) ÷ ${count}] = ${corrected}$$`,
        finalLine,
      ];
      return [
        `The reported total includes ${wrong}; remove it and put ${correct} in its place.`,
        `$$Corrected total = (${reported} × ${count}) - ${wrong} + ${correct}$$`,
        `$$Correct average = [(${reported} × ${count}) - ${wrong} + ${correct}] ÷ ${count} = ${corrected}$$`,
        finalLine,
      ];

    case "findReportedAverageBeforeCorrection":
      if (style === 0) return [
        `The correction from ${wrong} to ${correct} changed the total, so undo that change to recover the earlier average.`,
        `$$Change in total = ${correct} - ${wrong}$$`,
        `$$Earlier average = ${corrected} - [(${correct} - ${wrong}) ÷ ${count}] = ${reported}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `The entry correction was shared across ${count} records, which changed the average by an equal amount per record.`,
        `$$Change in average = (${correct} - ${wrong}) ÷ ${count}$$`,
        `$$Earlier average = ${corrected} - [(${correct} - ${wrong}) ÷ ${count}] = ${reported}$$`,
        finalLine,
      ];
      return [
        `Start from the correct total and put the wrong entry back to reconstruct the earlier total.`,
        `$$Earlier total = (${corrected} × ${count}) - ${correct} + ${wrong}$$`,
        `$$Earlier average = [(${corrected} × ${count}) - ${correct} + ${wrong}] ÷ ${count} = ${reported}$$`,
        finalLine,
      ];

    case "findCorrectValueFromAverageShift":
      if (style === 2) return [
        `The corrected and reported totals differ only because of the mistaken entry.`,
        `$$Difference in totals = (${corrected} × ${count}) - (${reported} × ${count})$$`,
        `$$Correct entry = ${wrong} + [(${corrected} × ${count}) - (${reported} × ${count})] = ${correct}$$`,
        finalLine,
      ];
      return [
        `The average changed from ${reported} to ${corrected} for ${count} records, so scale that change up to the total.`,
        `$$Change in total = (${corrected} - ${reported}) × ${count}$$`,
        `$$Correct entry = ${wrong} + [(${corrected} - ${reported}) × ${count}] = ${correct}$$`,
        finalLine,
      ];

    case "findIncorrectValueFromCorrection":
      if (style === 2) return [
        `The gap between the corrected and reported totals is exactly the amount by which the entry was changed.`,
        `$$Gap in totals = (${corrected} × ${count}) - (${reported} × ${count})$$`,
        `$$Wrong entry = ${correct} - [(${corrected} × ${count}) - (${reported} × ${count})] = ${wrong}$$`,
        finalLine,
      ];
      return [
        `The shift in average shows how much the total changed when the entry was corrected.`,
        `$$Change in total = (${corrected} - ${reported}) × ${count}$$`,
        `$$Wrong entry = ${correct} - [(${corrected} - ${reported}) × ${count}] = ${wrong}$$`,
        finalLine,
      ];

    case "findEntryDifferenceFromAverageCorrection":
      return [
        style === 2
          ? `The difference between the corrected and reported totals is the error in the single entry.`
          : `A change in one entry is spread over all ${count} records, so multiply the average change by ${count}.`,
        `$$Change in average = |${corrected} - ${reported}| = ${change}$$`,
        `$$Difference in entries = ${change} × ${count} = ${difference}$$`,
        finalLine,
      ];

    case "findAverageChangeFromEntryCorrection":
      return [
        style === 2
          ? `Replacing ${wrong} with ${correct} changes the total by their difference; divide that change among ${count} records.`
          : `The wrong and correct entries differ by ${difference}, and this difference is shared by ${count} records.`,
        `$$Difference in entries = |${correct} - ${wrong}| = ${difference}$$`,
        `$$Change in average = ${difference} ÷ ${count} = ${change}$$`,
        finalLine,
      ];

    case "findNumberOfItemsFromTotalCorrection":
      return [
        style === 2
          ? `The total changed by the difference between ${wrong} and ${correct}; the average changed by ${change} per record.`
          : `The number of records is how many average-change shares make up the full entry correction.`,
        `$$Difference in entries = |${correct} - ${wrong}| = ${difference}$$`,
        `$$Number of records = ${difference} ÷ ${change} = ${count}$$`,
        finalLine,
      ];

    case "findCorrectedAverageFromMultipleMistakes":
      if (style === 2) return [
        `Rebuild the reported total by removing both wrong entries and adding both correct entries.`,
        `$$Corrected total = (${reported} × ${count}) - ${wrong} - ${wrong2} + ${correct} + ${correct2}$$`,
        `$$Correct average = [(${reported} × ${count}) - ${wrong} - ${wrong2} + ${correct} + ${correct2}] ÷ ${count} = ${corrected}$$`,
        finalLine,
      ];
      return [
        `Correct both entries first, then share their combined effect across all ${count} records.`,
        `$$Net change = (${correct} - ${wrong}) + (${correct2} - ${wrong2})$$`,
        `$$Correct average = ${reported} + [(${correct} - ${wrong}) + (${correct2} - ${wrong2})] ÷ ${count} = ${corrected}$$`,
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
