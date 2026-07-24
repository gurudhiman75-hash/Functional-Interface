import { applyAvg001HumanAuthoredExplanation as applyBasePlanner } from "./human-authored-explanation";
import type { Avg001QuestionPackage } from "./types";

function hasSubstitutedArithmetic(line: string) {
  return (
    line.includes("\\times") ||
    line.includes("\\div") ||
    line.includes("×") ||
    line.includes("÷") ||
    /[+\-]=?/.test(line)
  );
}

export function applyAvg001HumanAuthoredExplanation(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const planned = applyBasePlanner(pkg);
  if (planned.explanation.lines.some(hasSubstitutedArithmetic)) return planned;

  const verifiedArithmetic = pkg.explanation.lines.find(hasSubstitutedArithmetic);
  if (!verifiedArithmetic) return planned;

  const lines = [...planned.explanation.lines];
  const insertionIndex = Math.max(1, lines.length - 2);
  lines.splice(insertionIndex, 0, verifiedArithmetic);
  return {
    ...planned,
    explanation: { lines: lines.slice(0, 8) },
  };
}
