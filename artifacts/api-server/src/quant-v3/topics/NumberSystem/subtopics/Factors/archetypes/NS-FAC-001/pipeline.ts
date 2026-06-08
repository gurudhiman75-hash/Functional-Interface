import { renderNsFac001ExplanationFromGraph } from "./explanation-renderer";
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
  generateCp009Parameters,
  type NsFac001ParameterInput,
} from "./parameter-generator";
import { buildNsFac001ReasoningGraph } from "./reasoning-graph";
import { solveNsFac001 } from "./solver";
import {
  NS_FAC_001_ARCHETYPE_ID,
  NS_FAC_001_CP_001,
  NS_FAC_001_CP_002,
  NS_FAC_001_CP_003,
  NS_FAC_001_CP_004,
  NS_FAC_001_CP_005,
  NS_FAC_001_CP_006,
  NS_FAC_001_CP_007,
  NS_FAC_001_CP_008,
  NS_FAC_001_CP_009,
  type NsFac001CanonicalProblemId,
  type NsFac001Parameters,
  type NsFac001QuestionPackage,
} from "./types";
import { validateNsFac001AnswerContract, validateNsFac001QuestionPackage } from "./validator";

export function runNsFac001Cp001Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_001, generateCp001Parameters(input));
}
export function runNsFac001Cp002Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_002, generateCp002Parameters(input));
}
export function runNsFac001Cp003Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_003, generateCp003Parameters(input));
}
export function runNsFac001Cp004Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_004, generateCp004Parameters(input));
}
export function runNsFac001Cp005Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_005, generateCp005Parameters(input));
}
export function runNsFac001Cp006Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_006, generateCp006Parameters(input));
}
export function runNsFac001Cp007Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_007, generateCp007Parameters(input));
}
export function runNsFac001Cp008Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_008, generateCp008Parameters(input));
}
export function runNsFac001Cp009Pipeline(input: NsFac001ParameterInput = {}) {
  return runNsFac001Pipeline(NS_FAC_001_CP_009, generateCp009Parameters(input));
}

function runNsFac001Pipeline(canonicalProblemId: NsFac001CanonicalProblemId, parameters: NsFac001Parameters): NsFac001QuestionPackage {
  const solver = solveNsFac001(parameters);
  const reasoningGraph = buildNsFac001ReasoningGraph(parameters, solver);
  const answerValidation = validateNsFac001AnswerContract(solver, reasoningGraph);
  if (!answerValidation.valid) throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  const questionLanguageId = selectQuestionLanguageId(parameters);
  const explanationStyleId = selectExplanationStyleId(parameters);
  const stem = renderQuestionLanguage({
    canonicalProblemId,
    questionLanguageId,
    values: {
      number: parameters.number,
      k: parameters.k,
      position: parameters.position,
      ordinalDisplay: parameters.ordinalDisplay,
    },
  });
  const explanation = renderNsFac001ExplanationFromGraph(parameters, reasoningGraph, explanationStyleId);
  const packageBase = {
    archetypeId: NS_FAC_001_ARCHETYPE_ID,
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
    number: parameters.number,
    k: parameters.k,
    position: parameters.position,
    ordinalDisplay: parameters.ordinalDisplay,
    productDigitCount: solver.productDigitCount,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    primeFactorizationLatex: solver.primeFactorizationLatex,
    factorCountFormulaLatex: solver.factorCountFormulaLatex,
    factorSumFormulaLatex: solver.factorSumFormulaLatex,
    factorProductFormulaLatex: solver.factorProductFormulaLatex,
    factorListLatex: solver.factorListLatex,
    factorsIncreasingLatex: solver.factorsIncreasingLatex,
    factorsDecreasingLatex: solver.factorsDecreasingLatex,
    kPrimeFactorizationLatex: solver.kPrimeFactorizationLatex,
    divisibleFactorConstraintLatex: solver.divisibleFactorConstraintLatex,
    complementFormulaLatex: solver.complementFormulaLatex,
    selectedPositionFormulaLatex: solver.selectedPositionFormulaLatex,
    greatestProperFactorFormulaLatex: solver.greatestProperFactorFormulaLatex,
    perfectSquareRuleLatex: solver.perfectSquareRuleLatex,
  };
  const questionPackage: NsFac001QuestionPackage = {
    ...packageBase,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId,
      difficultyBand: parameters.difficultyBand,
      questionLanguageId,
      explanationStyleId,
      number: parameters.number,
      k: parameters.k,
      position: parameters.position,
      ordinalDisplay: parameters.ordinalDisplay,
      answer: solver.answer,
      productDigitCount: solver.productDigitCount,
      graphId: reasoningGraph.graphId,
      primeFactorizationLatex: solver.primeFactorizationLatex,
      factorCountFormulaLatex: solver.factorCountFormulaLatex,
      factorSumFormulaLatex: solver.factorSumFormulaLatex,
      factorProductFormulaLatex: solver.factorProductFormulaLatex,
      factorListLatex: solver.factorListLatex,
      factorsIncreasingLatex: solver.factorsIncreasingLatex,
      factorsDecreasingLatex: solver.factorsDecreasingLatex,
      kPrimeFactorizationLatex: solver.kPrimeFactorizationLatex,
      divisibleFactorConstraintLatex: solver.divisibleFactorConstraintLatex,
      complementFormulaLatex: solver.complementFormulaLatex,
      selectedPositionFormulaLatex: solver.selectedPositionFormulaLatex,
      greatestProperFactorFormulaLatex: solver.greatestProperFactorFormulaLatex,
      perfectSquareRuleLatex: solver.perfectSquareRuleLatex,
    },
    validation: answerValidation,
  };
  const finalValidation = validateNsFac001QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed: ${finalValidation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  }
  return { ...questionPackage, validation: finalValidation };
}

function selectQuestionLanguageId(parameters: NsFac001Parameters) {
  const entries = getQuestionLanguageEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:question-language`, entries.length)].id;
}

function selectExplanationStyleId(parameters: NsFac001Parameters) {
  const entries = getExplanationEntries(parameters.canonicalProblemId);
  return entries[stableBucket(`${parameters.questionId}:explanation`, entries.length)].id;
}

export const NS_FAC_001_PIPELINES = {
  [NS_FAC_001_CP_001]: runNsFac001Cp001Pipeline,
  [NS_FAC_001_CP_002]: runNsFac001Cp002Pipeline,
  [NS_FAC_001_CP_003]: runNsFac001Cp003Pipeline,
  [NS_FAC_001_CP_004]: runNsFac001Cp004Pipeline,
  [NS_FAC_001_CP_005]: runNsFac001Cp005Pipeline,
  [NS_FAC_001_CP_006]: runNsFac001Cp006Pipeline,
  [NS_FAC_001_CP_007]: runNsFac001Cp007Pipeline,
  [NS_FAC_001_CP_008]: runNsFac001Cp008Pipeline,
  [NS_FAC_001_CP_009]: runNsFac001Cp009Pipeline,
} as const;
