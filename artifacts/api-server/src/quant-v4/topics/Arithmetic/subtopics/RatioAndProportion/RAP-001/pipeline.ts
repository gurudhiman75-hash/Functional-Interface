import { renderRap001Explanation } from "./explanation-renderer";
import { buildRap001SemanticTrace, getQuestionEntry, renderTemplate, resolveRap001EntityVariables } from "./library";
import { generateRap001Parameters, type Rap001ParameterInput } from "./parameter-generator";
import { buildRap001ReasoningGraph } from "./reasoning-graph";
import { solveRap001 } from "./solver";
import { RAP_001_ARCHETYPE_ID, type Rap001CanonicalProblemId, type Rap001Language, type Rap001QuestionPackage } from "./types";
import { validateRap001QuestionPackage } from "./validator";
import { renderStemWithNumericDisplayPolicy } from "../numeric-display-policy";
import { naturalizeEnglishRapExplanation } from "../naturalize-explanation";
import { normalizeRap001EditorialParameters } from "./editorial-parameter-normalizer";
import { normalizeRap001EditorialSolver } from "./editorial-solver-normalizer";

export function runRap001Pipeline(cpId: Rap001CanonicalProblemId, input: Rap001ParameterInput = {}): Rap001QuestionPackage {
  const parameters = normalizeRap001EditorialParameters(generateRap001Parameters(cpId, input));
  const solver = normalizeRap001EditorialSolver(parameters, solveRap001(parameters));
  const reasoningGraph = buildRap001ReasoningGraph(parameters, solver);
  const explanation = naturalizeEnglishRapExplanation(
    renderRap001Explanation(parameters, solver, reasoningGraph),
    parameters.language,
    solver.answer,
  );
  const renderVariables = resolveRap001EntityVariables(parameters.variables, parameters.language, parameters.entityReferences);
  const renderedStem = renderTemplate(getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template, renderVariables);
  const stem = renderStemWithNumericDisplayPolicy(renderedStem, solver.answer, solver.answerType, parameters.language);
  const semanticTrace = buildRap001SemanticTrace(parameters.semanticContext);
  const basePackage = {
    archetypeId: RAP_001_ARCHETYPE_ID,
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
  const validation = validateRap001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export function runRap001ForLanguages(cpId: Rap001CanonicalProblemId, input: Rap001ParameterInput = {}) {
  const base = generateRap001Parameters(cpId, { ...input, language: "en" });
  return (["en", "hi", "pa"] as Rap001Language[]).map((language) =>
    runRap001Pipeline(cpId, {
      ...input,
      language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    }),
  );
}

export const runRap001Cp001Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-001", input);
export const runRap001Cp002Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-002", input);
export const runRap001Cp003Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-003", input);
export const runRap001Cp004Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-004", input);
export const runRap001Cp005Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-005", input);
export const runRap001Cp006Pipeline = (input: Rap001ParameterInput = {}) => runRap001Pipeline("RAP-CP-006", input);
