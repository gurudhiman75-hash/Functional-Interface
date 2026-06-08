import { renderNsRem001ExplanationFromGraph } from "./explanation-renderer";
import { stableBucket } from "./instance-generator";
import { getExplanationEntries, getQuestionLanguageIds } from "./library";
import { renderApprovedNsRem001Stem } from "./language-contract";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  generateCp007Parameters,
  type NsRem001ParameterInput,
} from "./parameter-generator";
import { buildNsRem001ReasoningGraph } from "./reasoning-graph";
import { solveNsRem001 } from "./solver";
import {
  NS_REM_001_ARCHETYPE_ID,
  NS_REM_001_CP_001,
  NS_REM_001_CP_002,
  NS_REM_001_CP_003,
  NS_REM_001_CP_004,
  NS_REM_001_CP_005,
  NS_REM_001_CP_006,
  NS_REM_001_CP_007,
  type NsRem001CanonicalProblemId,
  type NsRem001Parameters,
  type NsRem001QuestionPackage,
} from "./types";
import { validateNsRem001AnswerContract, validateNsRem001QuestionPackage } from "./validator";

export function runNsRem001Cp001Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_001, generateCp001Parameters(input));
}

export function runNsRem001Cp002Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_002, generateCp002Parameters(input));
}

export function runNsRem001Cp003Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_003, generateCp003Parameters(input));
}

export function runNsRem001Cp004Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_004, generateCp004Parameters(input));
}

export function runNsRem001Cp005Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_005, generateCp005Parameters(input));
}

export function runNsRem001Cp006Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_006, generateCp006Parameters(input));
}

export function runNsRem001Cp007Pipeline(input: NsRem001ParameterInput = {}) {
  return runNsRem001Pipeline(NS_REM_001_CP_007, generateCp007Parameters(input));
}

function runNsRem001Pipeline(canonicalProblemId: NsRem001CanonicalProblemId, parameters: NsRem001Parameters): NsRem001QuestionPackage {
  const solver = solveNsRem001(parameters);
  const reasoningGraph = buildNsRem001ReasoningGraph(parameters, solver);
  const answerValidation = validateNsRem001AnswerContract(solver, reasoningGraph);

  if (!answerValidation.valid) {
    throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  }

  const questionLanguageId = selectQuestionLanguageId(parameters);
  const explanationStyleId = selectExplanationStyleId(parameters, solver.answer);
  const renderedStem = renderApprovedNsRem001Stem(parameters, questionLanguageId);
  const explanation = renderNsRem001ExplanationFromGraph(parameters, reasoningGraph, explanationStyleId);
  const questionPackage: NsRem001QuestionPackage = {
    archetypeId: NS_REM_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    patternId: parameters.patternId,
    instanceId: parameters.instanceId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    questionLanguageId: renderedStem.questionLanguageId,
    explanationStyleId,
    difficultyBand: parameters.difficultyBand,
    stem: renderedStem.stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };
  const finalValidation = validateNsRem001QuestionPackage(questionPackage);

  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed: ${finalValidation.checks.filter((check) => !check.passed).map((check) => check.name).join(", ")}`);
  }

  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

function selectQuestionLanguageId(parameters: NsRem001Parameters) {
  const ids = getQuestionLanguageIds(parameters.canonicalProblemId);
  if (ids.length === 0) throw new Error(`No approved question language entries for ${parameters.canonicalProblemId}.`);
  return ids[stableBucket(`${parameters.questionId}:question-language`, ids.length)];
}

function selectExplanationStyleId(parameters: NsRem001Parameters, answer: number) {
  const entries = getExplanationEntries();
  if (entries.length === 0) throw new Error("No approved explanation entries for NS-REM-001.");
  return entries[stableBucket(`${parameters.questionId}:${answer}:explanation`, entries.length)].id;
}

export const NS_REM_001_PIPELINES = {
  [NS_REM_001_CP_001]: runNsRem001Cp001Pipeline,
  [NS_REM_001_CP_002]: runNsRem001Cp002Pipeline,
  [NS_REM_001_CP_003]: runNsRem001Cp003Pipeline,
  [NS_REM_001_CP_004]: runNsRem001Cp004Pipeline,
  [NS_REM_001_CP_005]: runNsRem001Cp005Pipeline,
  [NS_REM_001_CP_006]: runNsRem001Cp006Pipeline,
  [NS_REM_001_CP_007]: runNsRem001Cp007Pipeline,
} as const;
