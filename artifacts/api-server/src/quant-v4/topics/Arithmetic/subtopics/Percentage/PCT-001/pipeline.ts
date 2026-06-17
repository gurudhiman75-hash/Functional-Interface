import { renderPct001Explanation } from "./explanation-renderer";
import { buildPct001SemanticTrace, getQuestionEntry, renderTemplate } from "./library";
import { generatePct001Parameters, type Pct001ParameterInput } from "./parameter-generator";
import { buildPct001ReasoningGraph } from "./reasoning-graph";
import { solvePct001 } from "./solver";
import { PCT_001_ARCHETYPE_ID, type Pct001CanonicalProblemId, type Pct001Language, type Pct001QuestionPackage } from "./types";
import { validatePct001QuestionPackage } from "./validator";

export function runPct001Pipeline(cpId: Pct001CanonicalProblemId, input: Pct001ParameterInput = {}): Pct001QuestionPackage {
  const parameters = generatePct001Parameters(cpId, input);
  const solver = solvePct001(parameters);
  const reasoningGraph = buildPct001ReasoningGraph(parameters, solver);
  const explanation = renderPct001Explanation(parameters, solver, reasoningGraph);
  const stem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, parameters.variables);
  const semanticTrace = buildPct001SemanticTrace(parameters.semanticContext);
  const basePackage = {
    archetypeId: PCT_001_ARCHETYPE_ID,
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
      scenario: semanticTrace.scenarioId,
      scenarioId: semanticTrace.scenarioId,
      semanticDomain: semanticTrace.semanticDomain,
      entityIds: semanticTrace.entityIds,
      frequencyMetadata: semanticTrace.frequencyMetadata,
      grammarMetadata: semanticTrace.grammarMetadata,
      graphId: reasoningGraph.graphId,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validatePct001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runPct001ForLanguages(cpId: Pct001CanonicalProblemId, input: Pct001ParameterInput = {}) {
  const base = generatePct001Parameters(cpId, { ...input, language: "en" });
  return (["en", "hi", "pa"] as Pct001Language[]).map((language) =>
    runPct001Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}

export const runPct001Cp001Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-001", input);
export const runPct001Cp002Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-002", input);
export const runPct001Cp003Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-003", input);
export const runPct001Cp004Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-004", input);
export const runPct001Cp005Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-005", input);
export const runPct001Cp006Pipeline = (input: Pct001ParameterInput = {}) => runPct001Pipeline("PCT-CP-006", input);
