import { buildMen001Options } from "./distractor-strategies.all";
import { renderMen001Explanation } from "./explanation-renderer";
import { getMen001QuestionEntry, renderMen001Template } from "./library";
import { generateMen001Parameters, type Men001ParameterInput } from "./parameter-generator";
import { buildMen001ReasoningGraph } from "./reasoning-graph";
import { solveMen001 } from "./solver";
import {
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001QuestionPackage,
} from "./types";
import { validateMen001QuestionPackage } from "./validator.final";

export function runMen001Pipeline(
  cpId: Men001ActiveCanonicalProblemId,
  input: Men001ParameterInput = {},
): Men001QuestionPackage {
  const parameters = generateMen001Parameters(cpId, input);
  const entry = getMen001QuestionEntry(parameters.questionLanguageId);
  const stem = renderMen001Template(entry.template, parameters.renderVariables);
  const solver = solveMen001(parameters);
  const reasoningGraph = buildMen001ReasoningGraph(parameters, solver);
  const explanation = renderMen001Explanation(parameters, solver, reasoningGraph);
  const optionResult = buildMen001Options(entry, parameters, solver);
  const mathematicalFingerprint = [
    parameters.solveMode,
    entry.unitPolicy,
    ...Object.entries(parameters.values)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`),
  ].join("|");

  const basePackage: Omit<Men001QuestionPackage, "validation"> = {
    packageId: MEN_001_PACKAGE_ID,
    archetypeId: MEN_001_PACKAGE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    language: "en",
    difficultyBand: parameters.difficulty,
    taskKind: parameters.taskKind,
    solveMode: parameters.solveMode,
    stem,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: MEN_001_PACKAGE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationStrategyId: entry.explanationStrategyId,
      distractorStrategyIds: entry.distractorStrategyIds,
      generatedDistractors: optionResult.distractors,
      optionSource: "DECLARED_MISCONCEPTION_STRATEGIES",
      diagramRequirement: entry.diagramRequirement,
      answerDimension: entry.answerDimension,
      unitPolicy: entry.unitPolicy,
      seed: parameters.seed,
    },
  };
  const validation = validateMen001QuestionPackage(basePackage);
  return { ...basePackage, validation };
}

export const runMen001Cp001Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-001", input);

export const runMen001Cp002Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-002", input);

export const runMen001Cp003Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-003", input);

export const runMen001Cp004Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-004", input);

export const runMen001Cp005Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-005", input);
