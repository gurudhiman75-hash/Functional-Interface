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

const reasoningByStyle = [
  "Handle the entry correction directly before solving for the requested value.",
  "Treat the entry correction as an average shift across the unchanged record count.",
  "Use the entry correction to rebuild and compare the reported and corrected totals.",
] as const;

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
  const lines = [
    reasoningByStyle[style],
    ...pkg.explanation.lines.slice(1, -1).map((line) => varyEquation(line, style)),
    pkg.explanation.lines.at(-1)!,
  ];
  return { ...pkg, explanation: { lines } };
}