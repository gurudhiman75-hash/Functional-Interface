import { renderNsPf001ExplanationFromGraph } from "./explanation-renderer";
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
  type NsPf001ParameterInput,
} from "./parameter-generator";
import { buildNsPf001ReasoningGraph } from "./reasoning-graph";
import { solveNsPf001 } from "./solver";
import {
  NS_PF_001_ARCHETYPE_ID,
  NS_PF_001_CP_001,
  NS_PF_001_CP_002,
  NS_PF_001_CP_003,
  NS_PF_001_CP_004,
  NS_PF_001_CP_005,
  NS_PF_001_CP_006,
  NS_PF_001_CP_007,
  type NsPf001CanonicalProblemId,
  type NsPf001Parameters,
  type NsPf001QuestionPackage,
} from "./types";
import { validateNsPf001AnswerContract, validateNsPf001QuestionPackage } from "./validator";

export function runNsPf001Cp001Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_001, generateCp001Parameters(input));
}
export function runNsPf001Cp002Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_002, generateCp002Parameters(input));
}
export function runNsPf001Cp003Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_003, generateCp003Parameters(input));
}
export function runNsPf001Cp004Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_004, generateCp004Parameters(input));
}
export function runNsPf001Cp005Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_005, generateCp005Parameters(input));
}
export function runNsPf001Cp006Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_006, generateCp006Parameters(input));
}
export function runNsPf001Cp007Pipeline(input: NsPf001ParameterInput = {}) {
  return runNsPf001Pipeline(NS_PF_001_CP_007, generateCp007Parameters(input));
}

function runNsPf001Pipeline(canonicalProblemId: NsPf001CanonicalProblemId, parameters: NsPf001Parameters): NsPf001QuestionPackage {
  const solver = solveNsPf001(parameters);
  const reasoningGraph = buildNsPf001ReasoningGraph(parameters, solver);
  const answerValidation = validateNsPf001AnswerContract(solver, reasoningGraph);
  if (!answerValidation.valid) {
    throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  }

  const questionLanguageId = selectQuestionLanguageId(parameters);
  const explanationStyleId = selectExplanationStyleId(parameters);
  const stem = renderQuestionLanguage({
    canonicalProblemId,
    questionLanguageId,
    values: {
      number: parameters.number,
      prime: parameters.prime,
    },
  });
  const explanation = renderNsPf001ExplanationFromGraph(parameters, reasoningGraph, explanationStyleId);
  const questionPackage: NsPf001QuestionPackage = {
    archetypeId: NS_PF_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    sourceTrace: parameters.sourceTrace,
    topology: parameters.topology,
    difficultyBand: parameters.difficultyBand,
    questionLanguageId,
    explanationFamilyId: explanation.familyId,
    explanationStyleId,
    stem,
    answer: solver.answer,
    factorizationText: solver.factorizationText,
    factorizationLatex: solver.factorizationLatex,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability: {
      archetypeId: NS_PF_001_ARCHETYPE_ID,
      canonicalProblemId,
      questionId: parameters.questionId,
      questionLanguageId,
      explanationStyleId,
      difficultyBand: parameters.difficultyBand,
      factorizationText: solver.factorizationText,
      factorizationLatex: solver.factorizationLatex,
    },
    validation: answerValidation,
  };
  const finalValidation = validateNsPf001QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed: ${finalValidation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  }
  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

function selectQuestionLanguageId(parameters: NsPf001Parameters) {
  const entries = getQuestionLanguageEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:question-language`, entries.length)].id;
}

function selectExplanationStyleId(parameters: NsPf001Parameters) {
  const entries = getExplanationEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:explanation`, entries.length)].id;
}

export const NS_PF_001_PIPELINES = {
  [NS_PF_001_CP_001]: runNsPf001Cp001Pipeline,
  [NS_PF_001_CP_002]: runNsPf001Cp002Pipeline,
  [NS_PF_001_CP_003]: runNsPf001Cp003Pipeline,
  [NS_PF_001_CP_004]: runNsPf001Cp004Pipeline,
  [NS_PF_001_CP_005]: runNsPf001Cp005Pipeline,
  [NS_PF_001_CP_006]: runNsPf001Cp006Pipeline,
  [NS_PF_001_CP_007]: runNsPf001Cp007Pipeline,
} as const;
