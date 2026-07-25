import { buildMen001ExplanationIllustration } from "./explanation-illustration.all";
import { getMen001QuestionEntry } from "./library";
import { authorFinalMen001ExplanationLines } from "./natural-explanation-authorship-final";
import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import { buildMen001StructuredExplanation } from "./structured-explanation";
import { normalizeMen001StructuredSections } from "./structured-explanation-normalizer";
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
  const sections = normalizeMen001StructuredSections(
    buildMen001StructuredExplanation(
      originalLines,
      authoredLines,
      parameters,
      solver,
    ),
  );
  return {
    strategyId: entry.explanationStrategyId,
    displayFormat: "KEY_RULE_STEPS_FINAL_ANSWER",
    sections,
    lines: authoredLines,
    ...(illustration ? { illustration } : {}),
  };
}
