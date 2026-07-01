import { renderPct002Explanation } from "./explanation-renderer";
import { getCommonQuestionLanguageIds, getQuestionEntry, renderTemplate } from "./library";
import { generatePct002Parameters, selectQuestionLanguageId, type Pct002ParameterInput } from "./parameter-generator";
import { buildPct002ReasoningGraph } from "./reasoning-graph";
import { solvePct002 } from "./solver";
import { PCT_002_ARCHETYPE_ID, type Pct002CanonicalProblemId, type Pct002Language, type Pct002QuestionPackage } from "./types";
import { validatePct002QuestionPackage } from "./validator";

export function runPct002Pipeline(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}): Pct002QuestionPackage {
  const parameters = generatePct002Parameters(cpId, input);
  const solver = solvePct002(parameters);
  const reasoningGraph = buildPct002ReasoningGraph(parameters, solver);
  const explanation = renderPct002Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_002_ARCHETYPE_ID,
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
  const validation = validatePct002QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct002ForLanguages(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}) {
  const sharedQlIds = getCommonQuestionLanguageIds(cpId);
  const requestedQlId = input.questionLanguageId;
  const sharedQuestionLanguageId =
    requestedQlId && sharedQlIds.includes(requestedQlId)
      ? requestedQlId
      : selectQuestionLanguageId(cpId, "hi", input.seed ?? `PCT-002:${cpId}:shared`, input.difficultyBand);
  const base = generatePct002Parameters(cpId, {
    ...input,
    language: "hi",
    questionLanguageId: sharedQuestionLanguageId,
  });
  return (["en", "hi", "pa"] as Pct002Language[]).map((language) =>
    runPct002Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
