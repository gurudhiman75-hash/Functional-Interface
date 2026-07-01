import { renderPct003Explanation } from "./explanation-renderer";
import { getCommonQuestionLanguageIds, getQuestionEntry, renderTemplate } from "./library";
import { generatePct003Parameters, selectQuestionLanguageId, type Pct003ParameterInput } from "./parameter-generator";
import { buildPct003ReasoningGraph } from "./reasoning-graph";
import { solvePct003 } from "./solver";
import { PCT_003_ARCHETYPE_ID, type Pct003CanonicalProblemId, type Pct003Language, type Pct003QuestionPackage } from "./types";
import { validatePct003QuestionPackage } from "./validator";

export function runPct003Pipeline(cpId: Pct003CanonicalProblemId, input: Pct003ParameterInput = {}): Pct003QuestionPackage {
  const parameters = generatePct003Parameters(cpId, input);
  const solver = solvePct003(parameters);
  const reasoningGraph = buildPct003ReasoningGraph(parameters, solver);
  const explanation = renderPct003Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_003_ARCHETYPE_ID,
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
  const validation = validatePct003QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct003ForLanguages(cpId: Pct003CanonicalProblemId, input: Pct003ParameterInput = {}) {
  const sharedQlIds = getCommonQuestionLanguageIds(cpId);
  const requestedQlId = input.questionLanguageId;
  const sharedQuestionLanguageId =
    requestedQlId && sharedQlIds.includes(requestedQlId)
      ? requestedQlId
      : selectQuestionLanguageId(cpId, "hi", input.seed ?? `PCT-003:${cpId}:shared`, input.difficultyBand);
  const base = generatePct003Parameters(cpId, {
    ...input,
    language: "hi",
    questionLanguageId: sharedQuestionLanguageId,
  });
  return (["en", "hi", "pa"] as Pct003Language[]).map((language) =>
    runPct003Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
