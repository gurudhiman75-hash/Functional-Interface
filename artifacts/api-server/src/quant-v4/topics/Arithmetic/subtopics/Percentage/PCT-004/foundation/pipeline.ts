import { renderPct004Explanation } from "./explanation-renderer";
import { getCommonQuestionLanguageIds, getQuestionEntry, renderTemplate } from "./library";
import { generatePct004Parameters, selectQuestionLanguageId, type Pct004ParameterInput } from "./parameter-generator";
import { buildPct004ReasoningGraph } from "./reasoning-graph";
import { solvePct004 } from "./solver";
import { PCT_004_ARCHETYPE_ID, type Pct004CanonicalProblemId, type Pct004Language, type Pct004QuestionPackage } from "./types";
import { validatePct004QuestionPackage } from "./validator";

export function runPct004Pipeline(cpId: Pct004CanonicalProblemId, input: Pct004ParameterInput = {}): Pct004QuestionPackage {
  const parameters = generatePct004Parameters(cpId, input);
  const solver = solvePct004(parameters);
  const reasoningGraph = buildPct004ReasoningGraph(parameters, solver);
  const explanation = renderPct004Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_004_ARCHETYPE_ID,
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
  const validation = validatePct004QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct004ForLanguages(cpId: Pct004CanonicalProblemId, input: Pct004ParameterInput = {}) {
  const sharedQlIds = getCommonQuestionLanguageIds(cpId);
  const requestedQlId = input.questionLanguageId;
  const sharedQuestionLanguageId =
    requestedQlId && sharedQlIds.includes(requestedQlId)
      ? requestedQlId
      : selectQuestionLanguageId(cpId, "hi", input.seed ?? `PCT-004:${cpId}:shared`, input.difficultyBand);
  const base = generatePct004Parameters(cpId, {
    ...input,
    language: "hi",
    questionLanguageId: sharedQuestionLanguageId,
  });
  return (["en", "hi", "pa"] as Pct004Language[]).map((language) =>
    runPct004Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
