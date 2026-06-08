import { renderCp001ExplanationFromGraph, renderCp002ExplanationFromGraph, renderCp003ExplanationFromGraph } from "./explanation-renderer";
import { renderApprovedCp001Stem, renderApprovedCp002Stem, renderApprovedCp003Stem } from "./language-contract";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  generateCp007Parameters,
} from "./parameter-generator";
import {
  buildCp001ReasoningGraph,
  buildCp002ReasoningGraph,
  buildCp003ReasoningGraph,
  buildCp004ReasoningGraph,
  buildCp005ReasoningGraph,
  buildCp006ReasoningGraph,
  buildCp007ReasoningGraph,
} from "./reasoning-graph";
import { selectNsDiv001ExplanationStyle, selectNsDiv001ValidDigitSetExplanationStyle } from "./realism-library";
import { solveCp001, solveCp002, solveCp003, solveCp004, solveCp005, solveCp006, solveCp007 } from "./solver";
import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001QuestionPackage,
  type Cp001ReasoningGraph,
  type Cp001ValidationResult,
  type Cp002QuestionPackage,
  type Cp003SolverResult,
  type Cp003QuestionPackage,
  type Cp004QuestionPackage,
  type Cp005QuestionPackage,
  type Cp006QuestionPackage,
  type Cp007QuestionPackage,
  type ValidDigitSetParameters,
  type ValidDigitSetQuestionPackage,
} from "./types";
import {
  validateCp001AnswerContract,
  validateCp001QuestionPackage,
  validateCp002AnswerContract,
  validateCp002QuestionPackage,
  validateCp003AnswerContract,
  validateCp003QuestionPackage,
  validateCp004AnswerContract,
  validateCp004QuestionPackage,
  validateCp005AnswerContract,
  validateCp005QuestionPackage,
  validateCp006AnswerContract,
  validateCp006QuestionPackage,
  validateCp007AnswerContract,
  validateCp007QuestionPackage,
} from "./validator";

export function runNsDiv001Cp001Pipeline(input: { seed?: string } = {}): Cp001QuestionPackage {
  const parameters = generateCp001Parameters(input);
  const solver = solveCp001(parameters);
  const reasoningGraph = buildCp001ReasoningGraph(parameters, solver);
  const answerValidation = validateCp001AnswerContract(solver, reasoningGraph);

  if (!answerValidation.valid) {
    throw new Error("CP-001 answer validation failed before rendering.");
  }

  const renderedStem = renderApprovedCp001Stem(parameters);
  const explanationStyle = selectNsDiv001ExplanationStyle({
    numberExpression: parameters.numberExpression,
    divisor: parameters.divisor,
    answerDigit: solver.answerDigit,
    knownDigitSum: solver.knownDigitSum,
  });
  const explanation = renderCp001ExplanationFromGraph(parameters, reasoningGraph, explanationStyle.id);
  const questionPackage: Cp001QuestionPackage = {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
    questionId: parameters.questionId,
    patternId: parameters.patternId,
    instanceId: parameters.instanceId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    stemFamilyId: renderedStem.familyId,
    questionLanguageId: renderedStem.questionLanguageId,
    stem: renderedStem.stem,
    answer: solver.answerDigit,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };

  const finalValidation = validateCp001QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error("CP-001 final validation failed.");
  }

  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

export function runNsDiv001Cp002Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp002QuestionPackage {
  const parameters = generateCp002Parameters(input);
  const solver = solveCp002(parameters);
  const reasoningGraph = buildCp002ReasoningGraph(parameters, solver);
  const answerValidation = validateCp002AnswerContract(solver, reasoningGraph);

  if (!answerValidation.valid) {
    throw new Error("CP-002 answer validation failed before rendering.");
  }

  const renderedStem = renderApprovedCp002Stem(parameters);
  const explanationStyle = selectNsDiv001ExplanationStyle({
    numberExpression: parameters.numberExpression,
    divisor: parameters.divisor,
    answerDigit: solver.answerDigit,
    knownDigitSum: solver.knownDigitSum,
  });
  const explanation = renderCp002ExplanationFromGraph(parameters, reasoningGraph, explanationStyle.id);
  const questionPackage: Cp002QuestionPackage = {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
    questionId: parameters.questionId,
    patternId: parameters.patternId,
    instanceId: parameters.instanceId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    stemFamilyId: renderedStem.familyId,
    questionLanguageId: renderedStem.questionLanguageId,
    stem: renderedStem.stem,
    answer: solver.answerDigit,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  };

  const finalValidation = validateCp002QuestionPackage(questionPackage);
  if (!finalValidation.valid) {
    throw new Error("CP-002 final validation failed.");
  }

  return {
    ...questionPackage,
    validation: finalValidation,
  };
}

export function runNsDiv001Cp003Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp003QuestionPackage {
  return runValidDigitSetPipeline(
    NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
    input,
    generateCp003Parameters,
    solveCp003,
    buildCp003ReasoningGraph,
    validateCp003AnswerContract,
    validateCp003QuestionPackage as (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
  ) as Cp003QuestionPackage;
}

export function runNsDiv001Cp004Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp004QuestionPackage {
  return runValidDigitSetPipeline(
    NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
    input,
    generateCp004Parameters,
    solveCp004,
    buildCp004ReasoningGraph,
    validateCp004AnswerContract,
    validateCp004QuestionPackage as (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
  ) as Cp004QuestionPackage;
}

export function runNsDiv001Cp005Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp005QuestionPackage {
  return runValidDigitSetPipeline(
    NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
    input,
    generateCp005Parameters,
    solveCp005,
    buildCp005ReasoningGraph,
    validateCp005AnswerContract,
    validateCp005QuestionPackage as (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
  ) as Cp005QuestionPackage;
}

export function runNsDiv001Cp006Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp006QuestionPackage {
  return runValidDigitSetPipeline(
    NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
    input,
    generateCp006Parameters,
    solveCp006,
    buildCp006ReasoningGraph,
    validateCp006AnswerContract,
    validateCp006QuestionPackage as (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
  ) as Cp006QuestionPackage;
}

export function runNsDiv001Cp007Pipeline(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp007QuestionPackage {
  return runValidDigitSetPipeline(
    NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
    input,
    generateCp007Parameters,
    solveCp007,
    buildCp007ReasoningGraph,
    validateCp007AnswerContract,
    validateCp007QuestionPackage as (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
  ) as Cp007QuestionPackage;
}

function runValidDigitSetPipeline(
  canonicalProblemId: ValidDigitSetParameters["canonicalProblemId"],
  input: { seed?: string; numberExpression?: string; divisor?: number },
  generateParameters: (input: { seed?: string; numberExpression?: string; divisor?: number }) => ValidDigitSetParameters,
  solve: (parameters: ValidDigitSetParameters) => Cp003SolverResult,
  buildGraph: (parameters: ValidDigitSetParameters, solver: Cp003SolverResult) => Cp001ReasoningGraph,
  validateAnswer: (solver: Cp003SolverResult, graph: Cp001ReasoningGraph) => Cp001ValidationResult,
  validateQuestion: (questionPackage: ValidDigitSetQuestionPackage) => Cp001ValidationResult,
): ValidDigitSetQuestionPackage {
  const parameters = generateParameters(input);
  const solver = solve(parameters);
  const reasoningGraph = buildGraph(parameters, solver);
  const answerValidation = validateAnswer(solver, reasoningGraph);

  if (!answerValidation.valid) {
    throw new Error(`${canonicalProblemId} answer validation failed before rendering.`);
  }

  const renderedStem = renderApprovedCp003Stem(parameters);
  const explanationStyle = selectNsDiv001ValidDigitSetExplanationStyle({
    questionId: parameters.questionId,
    numberExpression: parameters.numberExpression,
    divisor: parameters.divisor,
    answer: solver.answer,
  });
  const explanation = renderCp003ExplanationFromGraph(parameters, reasoningGraph, explanationStyle.id);
  const questionPackage = {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    patternId: parameters.patternId,
    instanceId: parameters.instanceId,
    reasoningPatternId: parameters.reasoningPatternId,
    sourceTrace: parameters.sourceTrace,
    stemFamilyId: renderedStem.familyId,
    questionLanguageId: renderedStem.questionLanguageId,
    stem: renderedStem.stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    validation: answerValidation,
  } as ValidDigitSetQuestionPackage;

  const finalValidation = validateQuestion(questionPackage);
  if (!finalValidation.valid) {
    throw new Error(`${canonicalProblemId} final validation failed.`);
  }

  return {
    ...questionPackage,
    validation: finalValidation,
  } as ValidDigitSetQuestionPackage;
}
