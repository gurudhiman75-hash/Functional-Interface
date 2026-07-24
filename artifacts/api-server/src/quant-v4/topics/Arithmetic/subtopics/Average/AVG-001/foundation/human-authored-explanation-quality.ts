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

function rendered(pkg: Avg001QuestionPackage, key: string) {
  return String(pkg.parameters.renderVariables[key] ?? "");
}

function reconstructedArithmetic(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode === "findMiddleTermFromAverage") {
    const first = rendered(pkg, "firstTerm");
    const last = rendered(pkg, "lastTerm");
    if (first && last) {
      if (pkg.language === "hi") return `$$मध्य पद = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
      if (pkg.language === "pa") return `$$ਮੱਧਲਾ ਪਦ = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
      return `$$Middle term = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`;
    }
  }
  return undefined;
}

export function applyAvg001HumanAuthoredExplanation(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const planned = applyBasePlanner(pkg);
  if (planned.explanation.lines.some(hasSubstitutedArithmetic)) return planned;

  const verifiedArithmetic =
    pkg.explanation.lines.find(hasSubstitutedArithmetic) ?? reconstructedArithmetic(pkg);
  if (!verifiedArithmetic) return planned;

  const lines = [...planned.explanation.lines];
  const insertionIndex = Math.max(1, lines.length - 2);
  lines.splice(insertionIndex, 0, verifiedArithmetic);
  return {
    ...planned,
    explanation: { lines: lines.slice(0, 8) },
  };
}
