import { writeMen001Cp001Working } from "./natural-explanation-manual.cp001";
import { writeMen001Cp002Working } from "./natural-explanation-manual.cp002";
import { writeMen001Cp003Working } from "./natural-explanation-manual.cp003";
import { writeMen001Cp004Working } from "./natural-explanation-manual.cp004";
import { writeRefinedMen001Working } from "./natural-explanation-manual-refinement";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function writeManualMen001Working(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const lines =
    writeRefinedMen001Working(parameters, solver) ??
    writeMen001Cp001Working(parameters, solver) ??
    writeMen001Cp002Working(parameters, solver) ??
    writeMen001Cp003Working(parameters, solver) ??
    writeMen001Cp004Working(parameters, solver);

  if (!lines?.length) {
    throw new Error(
      `MEN-001 has no manually authored explanation working for ${parameters.questionLanguageId}.`,
    );
  }

  return lines;
}
