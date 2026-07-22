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

function text(value: unknown) {
  return String(value ?? "");
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
  const count = text(v.count);
  const reported = text(v.reportedAverage);
  const corrected = text(v.correctedAverage);
  const wrong = text(v.incorrectValue);
  const correct = text(v.correctValue);
  const wrong2 = text(v.incorrectValue2);
  const correct2 = text(v.correctValue2);
  const difference = text(v.entryDifference);
  const change = text(v.averageChange);
  const signedCorrection = text((pkg.parameters.values as Record<string, unknown>).netCorrection &&
    (pkg.parameters.values as Record<string, { numerator?: number; denominator?: number }>).netCorrection);
  const finalLine = conclusion(pkg);

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake": {
      if (style === 0) return [
        `${wrong} was used instead of ${correct}, so the recorded total must be corrected first.`,
        `$$\text{Change in total}=${correct}-${wrong}$$`,
        `$$\text{Correct average}=${reported}+\frac{${correct}-${wrong}}{${count}}=${corrected}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `Only one entry is wrong, so its difference is shared across all ${count} records.`,
        `$$\text{Difference in the entry}=${correct}-${wrong}$$`,
        `$$\text{Change in average}=\frac{${correct}-${wrong}}{${count}},\quad ${reported}+\frac{${correct}-${wrong}}{${count}}=${corrected}$$`,
        finalLine,
      ];
      return [
        `The reported total is based on the wrong entry ${wrong}; replace it with ${correct}.`,
        `$$\text{Corrected total}=(${reported}\times${count})-${wrong}+${correct}$$`,
        `$$\text{Correct average}=\frac{(${reported}\times${count})-${wrong}+${correct}}{${count}}=${corrected}$$`,
        finalLine,
      ];
    }

    case "findReportedAverageBeforeCorrection": {
      if (style === 0) return [
        `The correction from ${wrong} to ${correct} changed the total, so undo that change to recover the earlier average.`,
        `$$\text{Change in total}=${correct}-${wrong}$$`,
        `$$\text{Earlier average}=${corrected}-\frac{${correct}-${wrong}}{${count}}=${reported}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `The corrected average differs from the old average by the entry correction divided among ${count} records.`,
        `$$\text{Average change}=\frac{${correct}-${wrong}}{${count}}$$`,
        `$$\text{Earlier average}=${corrected}-\frac{${correct}-${wrong}}{${count}}=${reported}$$`,
        finalLine,
      ];
      return [
        `Start from the correct total and put the wrong entry back to reconstruct the earlier total.`,
        `$$\text{Earlier total}=(${corrected}\times${count})-${correct}+${wrong}$$`,
        `$$\text{Earlier average}=\frac{(${corrected}\times${count})-${correct}+${wrong}}{${count}}=${reported}$$`,
        finalLine,
      ];
    }

    case "findCorrectValueFromAverageShift": {
      if (style === 0) return [
        `The average changed from ${reported} to ${corrected} for ${count} records, so the total changed by that average difference times ${count}.`,
        `$$\text{Change in total}=(${corrected}-${reported})\times${count}$$`,
        `$$\text{Correct entry}=${wrong}+(${corrected}-${reported})\times${count}=${correct}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `Each record contributes to the average change, so scale the change back to the full total.`,
        `$$\text{Required correction}=(${corrected}-${reported})\times${count}$$`,
        `$$\text{Correct entry}=${wrong}+(${corrected}-${reported})\times${count}=${correct}$$`,
        finalLine,
      ];
      return [
        `Compare the corrected total with the reported total; their difference belongs entirely to the mistaken entry.`,
        `$$\text{Difference of totals}=(${corrected}\times${count})-(${reported}\times${count})$$`,
        `$$\text{Correct entry}=${wrong}+(${corrected}\times${count})-(${reported}\times${count})=${correct}$$`,
        finalLine,
      ];
    }

    case "findIncorrectValueFromCorrection": {
      if (style === 0) return [
        `The shift in average shows how much the total changed when the entry was corrected.`,
        `$$\text{Change in total}=(${corrected}-${reported})\times${count}$$`,
        `$$\text{Wrong entry}=${correct}-(${corrected}-${reported})\times${count}=${wrong}$$`,
        finalLine,
      ];
      if (style === 1) return [
        `Spread over ${count} records, the average change came from one mistaken entry.`,
        `$$\text{Entry correction}=(${corrected}-${reported})\times${count}$$`,
        `$$\text{Wrong entry}=${correct}-(${corrected}-${reported})\times${count}=${wrong}$$`,
        finalLine,
      ];
      return [
        `The gap between the corrected and reported totals is exactly the amount by which the entry was changed.`,
        `$$\text{Gap in totals}=(${corrected}\times${count})-(${reported}\times${count})$$`,
        `$$\text{Wrong entry}=${correct}-[(${corrected}\times${count})-(${reported}\times${count})]=${wrong}$$`,
        finalLine,
      ];
    }

    case "findEntryDifferenceFromAverageCorrection": {
      const firstLine = style === 2
        ? `The difference between the corrected and reported totals is the error in the single entry.`
        : `A change in one entry is spread over all ${count} records, so multiply the average change by ${count}.`;
      return [
        firstLine,
        `$$\text{Change in average}=|${corrected}-${reported}|=${change}$$`,
        `$$\text{Difference in entries}=${change}\times${count}=${difference}$$`,
        finalLine,
      ];
    }

    case "findAverageChangeFromEntryCorrection": {
      const firstLine = style === 2
        ? `Replacing ${wrong} with ${correct} changes the total by their difference; divide that change among ${count} records.`
        : `The wrong entry and correct entry differ by ${difference}, and this difference is shared by ${count} records.`;
      return [
        firstLine,
        `$$\text{Difference in entries}=|${correct}-${wrong}|=${difference}$$`,
        `$$\text{Change in average}=\frac{${difference}}{${count}}=${change}$$`,
        finalLine,
      ];
    }

    case "findNumberOfItemsFromTotalCorrection": {
      const firstLine = style === 2
        ? `The total changed by the difference between ${wrong} and ${correct}; the average changed by ${change} per record.`
        : `The number of records is how many average-change shares make up the full entry correction.`;
      return [
        firstLine,
        `$$\text{Difference in entries}=|${correct}-${wrong}|=${difference}$$`,
        `$$\text{Number of records}=\frac{${difference}}{${change}}=${count}$$`,
        finalLine,
      ];
    }

    case "findCorrectedAverageFromMultipleMistakes": {
      if (style === 2) return [
        `Rebuild the reported total by removing both wrong entries and adding both correct entries.`,
        `$$\text{Corrected total}=(${reported}\times${count})-${wrong}-${wrong2}+${correct}+${correct2}$$`,
        `$$\text{Correct average}=\frac{(${reported}\times${count})-${wrong}-${wrong2}+${correct}+${correct2}}{${count}}=${corrected}$$`,
        finalLine,
      ];
      return [
        `Correct both entries first, then share their combined effect across all ${count} records.`,
        `$$\text{Net change}=(${correct}-${wrong})+(${correct2}-${wrong2})$$`,
        `$$\text{Correct average}=${reported}+\frac{(${correct}-${wrong})+(${correct2}-${wrong2})}{${count}}=${corrected}$$`,
        finalLine,
      ];
    }

    default:
      return pkg.explanation.lines.map((line) => line.replace(/div/g, "\\div"));
  }
}

export function applyAvg001Cp005ExplanationVariants(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005") return pkg;
  const strategy = String(pkg.traceability.explanationStrategyId ?? "");
  return {
    ...pkg,
    explanation: {
      lines: buildLines(pkg, styleIndex(strategy)),
    },
  };
}
