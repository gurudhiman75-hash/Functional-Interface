import { renderPct002Explanation } from "./explanation-renderer";
import { getQuestionEntry, renderTemplate } from "./library";
import { generatePct002Parameters, type Pct002ParameterInput } from "./parameter-generator";
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
      graphId: reasoningGraph.graphId,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validatePct002QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct002ForLanguages(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}) {
  const base = generatePct002Parameters(cpId, { ...input, language: "en" });
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

export const runPct002Cp001Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-001", input);
export const runPct002Cp002Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-002", input);
export const runPct002Cp003Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-003", input);
export const runPct002Cp004Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-004", input);
export const runPct002Cp005Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-005", input);
export const runPct002Cp006Pipeline = (input: Pct002ParameterInput = {}) => runPct002Pipeline("PCT-CP-006", input);
