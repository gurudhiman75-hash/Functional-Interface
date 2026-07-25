import { authorMen001ExplanationLines } from "./natural-explanation-authorship";
import type { Men001Parameters, Men001SolverResult } from "./types";

const REDUNDANT_NARRATIVE_ENDING = /^(Therefore|Hence|Thus|So|Accordingly|The required|The final|The answer|A square unit|A linear unit|The numerical rate)/i;

function isRedundantEnding(line: string) {
  return !line.includes("=") && REDUNDANT_NARRATIVE_ENDING.test(line);
}

export function authorFinalMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const authored = authorMen001ExplanationLines(
    originalLines,
    parameters,
    solver,
  );
  const opening = authored[0]!;
  const conclusion = authored[authored.length - 1]!;
  const working = authored
    .slice(1, -1)
    .filter((line) => !isRedundantEnding(line));

  return [opening, ...working, conclusion];
}
