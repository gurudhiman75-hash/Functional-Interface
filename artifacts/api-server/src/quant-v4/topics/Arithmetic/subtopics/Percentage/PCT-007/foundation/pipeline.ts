import { renderPct007Explanation } from "./explanation-renderer";
import { getQuestionEntry, renderTemplate } from "./library";
import { generatePct007Parameters, type Pct007ParameterInput } from "./parameter-generator";
import { buildPct007ReasoningGraph } from "./reasoning-graph";
import { solvePct007 } from "./solver";
import { PCT_007_ARCHETYPE_ID, type Pct007CanonicalProblemId, type Pct007Language, type Pct007QuestionPackage } from "./types";
import { validatePct007QuestionPackage } from "./validator";

export function runPct007Pipeline(cpId: Pct007CanonicalProblemId, input: Pct007ParameterInput = {}): Pct007QuestionPackage {
  const parameters = generatePct007Parameters(cpId, input);
  const solver = solvePct007(parameters);
  const reasoningGraph = buildPct007ReasoningGraph(parameters, solver);
  const explanation = renderPct007Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_007_ARCHETYPE_ID,
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
      solveMode: parameters.solveMode,
      answerType: parameters.answerType,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validatePct007QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct007ForLanguages(cpId: Pct007CanonicalProblemId, input: Pct007ParameterInput = {}) {
  const base = generatePct007Parameters(cpId, { ...input, language: "hi", questionLanguageId: undefined });
  return (["en", "hi", "pa"] as Pct007Language[]).map((language) =>
    runPct007Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
