import { finalizeAvg001ExplanationCleanup } from "./human-authored-explanation-final-cleanup";
import { finalizeAvg001ExplanationLanguage } from "./human-authored-explanation-language-finalizer";
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
  const normalized: Avg001QuestionPackage = {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      explanationSymbolFinalizer: "AVG-001 normalized arithmetic symbols v1",
    },
  };
  return finalizeAvg001ExplanationCleanup(
    finalizeAvg001ExplanationLanguage(normalized),
  );
}
