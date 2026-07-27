import { buildMen001ExplanationIllustration } from "./explanation-illustration.all";
import { getMen001QuestionEntry } from "./library";
import { authorFinalMen001ExplanationLines } from "./natural-explanation-authorship-final";
import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import { buildMen001CommonTraps, type Men001OptionResult } from "./structured-common-traps";
import { buildMen001StructuredExplanation } from "./structured-explanation";
import { enhanceMen001StructuredSections } from "./structured-explanation-enhancer";
import { addMen001ExamShortcut } from "./structured-exam-shortcuts";
import { polishMen001StructuredSections } from "./structured-final-polisher";
import { latexizeMen001StructuredSections } from "./structured-math-latex";
import { normalizeMen001StructuredSections } from "./structured-explanation-normalizer";
import { restoreMen001SpecificStepAuthorship } from "./structured-specific-title-restorer";
import type {
  Men001Explanation,
  Men001Parameters,
  Men001ReasoningGraph,
  Men001SolverResult,
} from "./types";

function addCommonTraps(
  sections: ReturnType<typeof addMen001ExamShortcut>,
  trapSection: ReturnType<typeof buildMen001CommonTraps>,
) {
  const finalIndex = sections.findIndex((section) => section.kind === "FINAL_ANSWER");
  return finalIndex >= 0
    ? [...sections.slice(0, finalIndex), trapSection, ...sections.slice(finalIndex)]
    : [...sections, trapSection];
}

export function renderMen001Explanation(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  _graph: Men001ReasoningGraph,
  optionResult: Men001OptionResult,
): Men001Explanation {
  const entry = getMen001QuestionEntry(parameters.questionLanguageId);
  const definition = getMen001SolveModeDefinition(parameters.solveMode);
  const illustration = buildMen001ExplanationIllustration(parameters, solver);
  const originalLines = definition.explain(parameters, solver);
  const authoredLines = authorFinalMen001ExplanationLines(
    originalLines,
    parameters,
    solver,
  );
  const workedSections = polishMen001StructuredSections(
    restoreMen001SpecificStepAuthorship(
      normalizeMen001StructuredSections(
        enhanceMen001StructuredSections(
          buildMen001StructuredExplanation(
            originalLines,
            authoredLines,
            parameters,
            solver,
          ),
          originalLines,
          parameters,
          solver,
        ),
        parameters.solveMode,
      ),
      parameters.solveMode,
    ),
    parameters.solveMode,
  );
  const sections = latexizeMen001StructuredSections(
    addCommonTraps(
      addMen001ExamShortcut(workedSections, parameters, solver),
      buildMen001CommonTraps(entry, optionResult),
    ),
  );
  return {
    strategyId: entry.explanationStrategyId,
    displayFormat: "FOUR_TIER_COMPETITIVE_EXPLANATION",
    sections,
    lines: authoredLines,
    ...(illustration ? { illustration } : {}),
  };
}
