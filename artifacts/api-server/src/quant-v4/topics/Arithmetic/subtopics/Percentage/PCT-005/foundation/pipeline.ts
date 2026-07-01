import { renderPct005Explanation } from "./explanation-renderer";
import { getQuestionEntry, renderTemplate } from "./library";
import { generatePct005Parameters, type Pct005ParameterInput } from "./parameter-generator";
import { buildPct005ReasoningGraph } from "./reasoning-graph";
import { solvePct005 } from "./solver";
import { PCT_005_ARCHETYPE_ID, type Pct005CanonicalProblemId, type Pct005Language, type Pct005QuestionPackage } from "./types";
import { validatePct005QuestionPackage } from "./validator";

export function runPct005Pipeline(cpId: Pct005CanonicalProblemId, input: Pct005ParameterInput = {}): Pct005QuestionPackage {
  const parameters = generatePct005Parameters(cpId, input);
  const solver = solvePct005(parameters);
  const reasoningGraph = buildPct005ReasoningGraph(parameters, solver);
  const explanation = renderPct005Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_005_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    language: parameters.language,
    difficultyBand: parameters.difficultyBand,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      taskKind: parameters.taskKind,
      answerType: parameters.answerType,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validatePct005QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct005ForLanguages(cpId: Pct005CanonicalProblemId, input: Pct005ParameterInput = {}) {
  const base = generatePct005Parameters(cpId, { ...input, language: "hi", questionLanguageId: undefined });
  return (["en", "hi", "pa"] as Pct005Language[]).map((language) =>
    runPct005Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
