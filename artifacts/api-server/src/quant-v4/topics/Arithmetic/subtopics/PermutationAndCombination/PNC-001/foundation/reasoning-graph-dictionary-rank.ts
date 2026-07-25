import type {
  Pnc001IndependentVerification,
  Pnc001Parameters,
  Pnc001ReasoningEvidence,
  Pnc001SolverResult,
} from "./types";

export function buildPnc001DictionaryRankReasoningEvidence(
  _parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  verification: Pnc001IndependentVerification,
): Pnc001ReasoningEvidence {
  const evidence = solver.evidence;
  const sourceWord = evidence.dictionarySourceWord ?? "";
  const targetWord = evidence.dictionaryTargetWord ?? "";
  const contributions = evidence.dictionaryRankContributions ?? [];
  const grouped = contributions.map((item) =>
    `position ${item.position}: ${item.smallerLetter} before ${item.currentLetter} gives ${item.remainingArrangementCount}`,
  );
  return {
    conceptId: "PNC-DICTIONARY-RANK",
    givens: {
      sourceWord,
      targetWord,
      sortedLetters: evidence.dictionarySortedLetters ?? "",
    },
    equations: [solver.equation],
    intermediateValues: {
      precedingCount: evidence.dictionaryPrecedingCount ?? 0,
      contributionSummary: grouped.join("; ") || "No earlier block",
    },
    decisiveCalculation: solver.equation,
    verification: `${verification.method}: rank ${verification.answer}`,
  };
}