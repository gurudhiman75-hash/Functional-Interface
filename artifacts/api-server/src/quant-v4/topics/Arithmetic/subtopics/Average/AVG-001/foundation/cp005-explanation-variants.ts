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

const modeReasoning: Record<string, [string, string, string]> = {
  findCorrectedAverageFromMistake: [
    "Correct the single entry first, then spread that total change across all records.",
    "Convert the entry difference into a per-record average adjustment.",
    "Rebuild the reported total with the corrected entry before taking the mean again.",
  ],
  findReportedAverageBeforeCorrection: [
    "Reverse the single entry correction to recover the earlier average.",
    "Move backwards by the per-record effect of the corrected entry.",
    "Restore the earlier total by undoing the correction, then divide by the unchanged count.",
  ],
  findCorrectValueFromAverageShift: [
    "Scale the average shift by the record count to recover the full entry correction.",
    "The change per record builds up to the amount missing from the wrong entry.",
    "Compare the reported and corrected totals to find what the entry must become.",
  ],
  findIncorrectValueFromCorrection: [
    "Scale the average shift to find the total correction, then work back from the correct entry.",
    "The per-record change shows how far the earlier entry was from the correct one.",
    "Compare the two totals and subtract their difference from the correct entry.",
  ],
  findEntryDifferenceFromAverageCorrection: [
    "Multiply the average change by the number of records to find the single-entry error.",
    "Each record shares the effect of one wrong entry, so scale the change back up.",
    "The gap between the corrected and reported totals equals the entry error.",
  ],
  findAverageChangeFromEntryCorrection: [
    "Find the entry difference and distribute it across all records.",
    "Treat the correction as a per-record adjustment to the mean.",
    "Compare the old and new totals, then divide their difference by the record count.",
  ],
  findNumberOfItemsFromTotalCorrection: [
    "Divide the full entry correction by its effect on the average.",
    "The count tells how many equal shares of the average change make the total correction.",
    "Compare the total gap with the per-record gap to recover the number of records.",
  ],
  findCorrectedAverageFromMultipleMistakes: [
    "Combine both entry corrections, then spread their net effect across all records.",
    "Find the per-record effect of the two corrections taken together.",
    "Rebuild the reported total by replacing both wrong entries before dividing again.",
  ],
};

function styleIndex(strategy: string) {
  if (directStrategies.has(strategy)) return 0;
  if (shiftStrategies.has(strategy)) return 1;
  return 2;
}

function varyEquation(line: string, style: number) {
  if (style === 0) return line;
  if (style === 1) {
    return line
      .replace(/Entry correction/g, "Change in total")
      .replace(/Entry error/g, "Total error")
      .replace(/Average change/g, "Change per record")
      .replace(/Corrected average/g, "Average after correction")
      .replace(/Reported average/g, "Average before correction")
      .replace(/Correct entry/g, "Required entry")
      .replace(/Wrong entry/g, "Recorded entry")
      .replace(/Net correction/g, "Combined correction")
      .replace(/Count/g, "Number of records");
  }
  return line
    .replace(/Entry correction/g, "Difference between totals")
    .replace(/Entry error/g, "Gap in totals")
    .replace(/Average change/g, "Average gap")
    .replace(/Corrected average/g, "Rebuilt average")
    .replace(/Reported average/g, "Original average")
    .replace(/Correct entry/g, "Entry after rebuilding")
    .replace(/Wrong entry/g, "Entry before rebuilding")
    .replace(/Net correction/g, "Net change in total")
    .replace(/Count/g, "Records averaged");
}

export function applyAvg001Cp005ExplanationVariants(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005") return pkg;
  const strategy = String(pkg.traceability.explanationStrategyId ?? "");
  const style = styleIndex(strategy);
  const reasoning = modeReasoning[pkg.solveMode]?.[style] ?? pkg.explanation.lines[0]!;
  const lines = [
    reasoning,
    ...pkg.explanation.lines.slice(1, -1).map((line) => varyEquation(line, style)),
    pkg.explanation.lines.at(-1)!,
  ];
  return { ...pkg, explanation: { lines } };
}