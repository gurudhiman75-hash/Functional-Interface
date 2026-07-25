import type { Men001Parameters, Men001SolverResult } from "./types";

export type ManualExplanationWriter = (
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) => string[];

export function value(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  key: string,
): number {
  const candidate = solver.workingValues[key] ??
    parameters.values[key as keyof Men001Parameters["values"]];
  const numeric = Number(candidate);
  if (!Number.isFinite(numeric)) {
    throw new Error(
      `MEN-001 manual explanation requires numeric ${key} for ${parameters.questionLanguageId}.`,
    );
  }
  return numeric;
}

export function format(valueToFormat: number): string {
  return Number.isInteger(valueToFormat)
    ? String(valueToFormat)
    : String(Number(valueToFormat.toFixed(2)));
}

export function shownAnswer(solver: Men001SolverResult): string {
  return solver.canonicalAnswer.kind === "symbolic"
    ? solver.canonicalAnswer.display
    : solver.answer;
}

export function sentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

export function unit(solver: Men001SolverResult): string {
  return solver.unit;
}
