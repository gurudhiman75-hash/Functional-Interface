import { buildMen001ExplanationIllustration } from "./explanation-illustration.all";
import { getMen001QuestionEntry } from "./library";
import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
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
  return {
    strategyId: entry.explanationStrategyId,
    lines: definition.explain(parameters, solver),
    ...(illustration ? { illustration } : {}),
  };
}
