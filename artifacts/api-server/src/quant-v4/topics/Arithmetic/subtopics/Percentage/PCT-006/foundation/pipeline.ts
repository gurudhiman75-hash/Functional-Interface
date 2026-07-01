import { renderPct006Explanation } from "./explanation-renderer";
import { getQuestionEntry, renderTemplate } from "./library";
import { generatePct006Parameters, type Pct006ParameterInput } from "./parameter-generator";
import { buildPct006ReasoningGraph } from "./reasoning-graph";
import { solvePct006 } from "./solver";
import { PCT_006_ARCHETYPE_ID, type Pct006CanonicalProblemId, type Pct006Language, type Pct006QuestionPackage } from "./types";
import { validatePct006QuestionPackage } from "./validator";

export function runPct006Pipeline(cpId: Pct006CanonicalProblemId, input: Pct006ParameterInput = {}): Pct006QuestionPackage {
  const parameters = generatePct006Parameters(cpId, input);
  const solver = solvePct006(parameters);
  const reasoningGraph = buildPct006ReasoningGraph(parameters, solver);
  const explanation = renderPct006Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const basePackage = {
    archetypeId: PCT_006_ARCHETYPE_ID,
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
  const validation = validatePct006QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct006ForLanguages(cpId: Pct006CanonicalProblemId, input: Pct006ParameterInput = {}) {
  const base = generatePct006Parameters(cpId, { ...input, language: "hi", questionLanguageId: undefined });
  return (["en", "hi", "pa"] as Pct006Language[]).map((language) =>
    runPct006Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}
