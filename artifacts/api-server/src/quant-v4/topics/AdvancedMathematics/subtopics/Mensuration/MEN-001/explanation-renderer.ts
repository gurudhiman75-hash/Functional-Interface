import { buildMen001ExplanationIllustration } from "./explanation-illustration.all";
import { applyMen001FiveElementBlueprint } from "./five-element-editorial";
import { getMen001QuestionEntry } from "./library";
import { authorFinalMen001ExplanationLines } from "./natural-explanation-authorship-final";
import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import { buildMen001CommonTraps, type Men001OptionResult } from "./structured-common-traps";
import { humanizeMen001Comprehension } from "./structured-comprehension-humanizer";
import { refineMen001Comprehension } from "./structured-comprehension-refiner";
import { ensureMen001ComprehensionSpecificity } from "./structured-comprehension-specificity";
import { buildMen001StructuredExplanation } from "./structured-explanation";
import { enhanceMen001StructuredSections } from "./structured-explanation-enhancer";
import { addMen001ExamShortcut } from "./structured-exam-shortcuts";
import {
  buildMen001ExactFourTierLines,
  finalizeMen001ExactFourTier,
} from "./structured-exact-four-tier";
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
  const legacyWorkedSections = polishMen001StructuredSections(
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
  const exactWorkedSections = finalizeMen001ExactFourTier(
    legacyWorkedSections,
    parameters,
    solver,
  );
  const teacherSections = humanizeMen001Comprehension(
    [
      ...addMen001ExamShortcut(exactWorkedSections, parameters, solver),
      buildMen001CommonTraps(entry, optionResult),
    ],
    parameters,
    solver,
  );
  const refinedSections = refineMen001Comprehension(
    teacherSections,
    parameters,
  );
  const specificSections = ensureMen001ComprehensionSpecificity(
    refinedSections,
    parameters,
  );
  const latexSections = latexizeMen001StructuredSections(specificSections);
  const sections = applyMen001FiveElementBlueprint(
    latexSections,
    parameters,
    solver,
    entry.distractorStrategyIds,
  );
  return {
    strategyId: entry.explanationStrategyId,
    displayFormat: "FOUR_TIER_COMPETITIVE_EXPLANATION",
    sections,
    lines: buildMen001ExactFourTierLines(sections),
    ...(illustration ? { illustration } : {}),
  };
}
