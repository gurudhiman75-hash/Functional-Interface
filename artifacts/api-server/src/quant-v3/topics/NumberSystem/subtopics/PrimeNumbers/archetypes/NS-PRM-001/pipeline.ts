import { renderNsPrm001ExplanationFromGraph } from "./explanation-renderer";
import { getExplanationEntries, getQuestionLanguageEntries, renderQuestionLanguage } from "./library";
import { stableBucket } from "./parameter-generator";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  generateCp007Parameters,
  generateCp008Parameters,
  type NsPrm001ParameterInput,
} from "./parameter-generator";
import { buildNsPrm001ReasoningGraph } from "./reasoning-graph";
import { solveNsPrm001 } from "./solver";
import {
  NS_PRM_001_ARCHETYPE_ID,
  NS_PRM_001_CP_001,
  NS_PRM_001_CP_002,
  NS_PRM_001_CP_003,
  NS_PRM_001_CP_004,
  NS_PRM_001_CP_005,
  NS_PRM_001_CP_006,
  NS_PRM_001_CP_007,
  NS_PRM_001_CP_008,
  type NsPrm001CanonicalProblemId,
  type NsPrm001Parameters,
  type NsPrm001QuestionPackage,
} from "./types";
import { validateNsPrm001AnswerContract, validateNsPrm001QuestionPackage } from "./validator";

export function runNsPrm001Cp001Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_001, generateCp001Parameters(input));
}
export function runNsPrm001Cp002Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_002, generateCp002Parameters(input));
}
export function runNsPrm001Cp003Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_003, generateCp003Parameters(input));
}
export function runNsPrm001Cp004Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_004, generateCp004Parameters(input));
}
export function runNsPrm001Cp005Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_005, generateCp005Parameters(input));
}
export function runNsPrm001Cp006Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_006, generateCp006Parameters(input));
}
export function runNsPrm001Cp007Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_007, generateCp007Parameters(input));
}
export function runNsPrm001Cp008Pipeline(input: NsPrm001ParameterInput = {}) {
  return runNsPrm001Pipeline(NS_PRM_001_CP_008, generateCp008Parameters(input));
}

function runNsPrm001Pipeline(canonicalProblemId: NsPrm001CanonicalProblemId, parameters: NsPrm001Parameters): NsPrm001QuestionPackage {
  const solver = solveNsPrm001(parameters);
  const reasoningGraph = buildNsPrm001ReasoningGraph(parameters, solver);
  const answerValidation = validateNsPrm001AnswerContract(solver, reasoningGraph);
  if (!answerValidation.valid) {
    throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  }

  const questionLanguageId = selectQuestionLanguageId(parameters);
  const explanationStyleId = selectExplanationStyleId(parameters, solver.answer);
  const stem = renderQuestionLanguage({
    canonicalProblemId,
    questionLanguageId,
    values: {
      number: parameters.number,
      lowerBound: parameters.lowerBound,
      upperBound: parameters.upperBound,
      position: parameters.position,
    },
  });
  const explanation = renderNsPrm001ExplanationFromGraph(parameters, reasoningGraph, explanationStyleId);
  const questionPackage: NsPrm001QuestionPackage = {
    archetypeId: NS_PRM_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    topology: parameters.topology,
    difficultyBand: parameters.difficultyBand,
    questionLanguageId,
    explanationFamilyId: explanation.familyId,
    explanationStyleId,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };
  const finalValidation = validateNsPrm001QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed: ${finalValidation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  }
  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

function selectQuestionLanguageId(parameters: NsPrm001Parameters) {
  const entries = getQuestionLanguageEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:question-language`, entries.length)].id;
}

function selectExplanationStyleId(parameters: NsPrm001Parameters, answer: string | number) {
  const entries = getExplanationEntries(parameters.canonicalProblemId, answer);
  return entries[stableBucket(`${parameters.questionId}:${answer}:explanation`, entries.length)].id;
}

export const NS_PRM_001_PIPELINES = {
  [NS_PRM_001_CP_001]: runNsPrm001Cp001Pipeline,
  [NS_PRM_001_CP_002]: runNsPrm001Cp002Pipeline,
  [NS_PRM_001_CP_003]: runNsPrm001Cp003Pipeline,
  [NS_PRM_001_CP_004]: runNsPrm001Cp004Pipeline,
  [NS_PRM_001_CP_005]: runNsPrm001Cp005Pipeline,
  [NS_PRM_001_CP_006]: runNsPrm001Cp006Pipeline,
  [NS_PRM_001_CP_007]: runNsPrm001Cp007Pipeline,
  [NS_PRM_001_CP_008]: runNsPrm001Cp008Pipeline,
} as const;
