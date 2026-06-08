import { renderNsRem002ExplanationFromGraph } from "./explanation-renderer";
import { stableBucket } from "./parameter-generator";
import { getExplanationEntries, getQuestionLanguageEntries } from "./library";
import { renderApprovedNsRem002Stem } from "./language-contract";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  generateCp007Parameters,
  generateCp008Parameters,
  generateCp009Parameters,
  type NsRem002ParameterInput,
} from "./parameter-generator";
import { buildNsRem002ReasoningGraph } from "./reasoning-graph";
import { solveNsRem002 } from "./solver";
import {
  NS_REM_002_ARCHETYPE_ID,
  NS_REM_002_CP_001,
  NS_REM_002_CP_002,
  NS_REM_002_CP_003,
  NS_REM_002_CP_004,
  NS_REM_002_CP_005,
  NS_REM_002_CP_006,
  NS_REM_002_CP_007,
  NS_REM_002_CP_008,
  NS_REM_002_CP_009,
  type NsRem002CanonicalProblemId,
  type NsRem002Parameters,
  type NsRem002QuestionPackage,
} from "./types";
import { validateNsRem002AnswerContract, validateNsRem002QuestionPackage } from "./validator";

export function runNsRem002Cp001Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_001, generateCp001Parameters(input));
}
export function runNsRem002Cp002Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_002, generateCp002Parameters(input));
}
export function runNsRem002Cp003Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_003, generateCp003Parameters(input));
}
export function runNsRem002Cp004Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_004, generateCp004Parameters(input));
}
export function runNsRem002Cp005Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_005, generateCp005Parameters(input));
}
export function runNsRem002Cp006Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_006, generateCp006Parameters(input));
}
export function runNsRem002Cp007Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_007, generateCp007Parameters(input));
}
export function runNsRem002Cp008Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_008, generateCp008Parameters(input));
}
export function runNsRem002Cp009Pipeline(input: NsRem002ParameterInput = {}) {
  return runNsRem002Pipeline(NS_REM_002_CP_009, generateCp009Parameters(input));
}

function runNsRem002Pipeline(canonicalProblemId: NsRem002CanonicalProblemId, parameters: NsRem002Parameters): NsRem002QuestionPackage {
  const solver = solveNsRem002(parameters);
  const reasoningGraph = buildNsRem002ReasoningGraph(parameters, solver);
  const answerValidation = validateNsRem002AnswerContract(solver, reasoningGraph);
  if (!answerValidation.valid) {
    throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  }

  const questionLanguageId = selectQuestionLanguageId(parameters);
  const explanationStyleId = selectExplanationStyleId(parameters, solver.answer);
  const renderedStem = renderApprovedNsRem002Stem(parameters, questionLanguageId);
  const explanation = renderNsRem002ExplanationFromGraph(parameters, reasoningGraph, explanationStyleId);
  const questionPackage: NsRem002QuestionPackage = {
    archetypeId: NS_REM_002_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    topology: parameters.topology,
    difficultyBand: parameters.difficultyBand,
    questionLanguageId: renderedStem.questionLanguageId,
    explanationFamilyId: explanation.familyId,
    explanationStyleId,
    stem: renderedStem.stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };
  const finalValidation = validateNsRem002QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed: ${finalValidation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  }
  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

function selectQuestionLanguageId(parameters: NsRem002Parameters) {
  const entries = getQuestionLanguageEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:question-language`, entries.length)].id;
}

function selectExplanationStyleId(parameters: NsRem002Parameters, answer: number) {
  const entries = getExplanationEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:${answer}:explanation`, entries.length)].id;
}

export const NS_REM_002_PIPELINES = {
  [NS_REM_002_CP_001]: runNsRem002Cp001Pipeline,
  [NS_REM_002_CP_002]: runNsRem002Cp002Pipeline,
  [NS_REM_002_CP_003]: runNsRem002Cp003Pipeline,
  [NS_REM_002_CP_004]: runNsRem002Cp004Pipeline,
  [NS_REM_002_CP_005]: runNsRem002Cp005Pipeline,
  [NS_REM_002_CP_006]: runNsRem002Cp006Pipeline,
  [NS_REM_002_CP_007]: runNsRem002Cp007Pipeline,
  [NS_REM_002_CP_008]: runNsRem002Cp008Pipeline,
  [NS_REM_002_CP_009]: runNsRem002Cp009Pipeline,
} as const;
