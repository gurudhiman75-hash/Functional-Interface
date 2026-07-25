import type { Avg001QuestionPackage } from "./types";

export function finalizeAvg001ExplanationSymbols(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lines = pkg.explanation.lines.map((line) =>
    line
      .replaceAll("−", "-")
      .replaceAll("–", "-")
      .replaceAll("—", "-")
      .replace(/\s+x\s+/g, " × "),
  );
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationSymbolFinalizer: "AVG-001 normalized arithmetic symbols v1",
    },
  };
}
