import { renderNsLcm001Explanation } from "./explanation-renderer";
import { getExplanationEntries, getQuestionLanguageEntries, renderQuestionLanguage } from "./library";
import { formatNumberList } from "./math";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  stableBucket,
  type NsLcm001ParameterInput,
} from "./parameter-generator";
import { buildNsLcm001ReasoningGraph } from "./reasoning-graph";
import { solveNsLcm001 } from "./solver";
import {
  NS_LCM_001_ARCHETYPE_ID,
  NS_LCM_001_CP_001,
  NS_LCM_001_CP_002,
  NS_LCM_001_CP_003,
  NS_LCM_001_CP_004,
  NS_LCM_001_CP_005,
  type NsLcm001CanonicalProblemId,
  type NsLcm001Parameters,
  type NsLcm001QuestionPackage,
} from "./types";
import { validateNsLcm001QuestionPackage } from "./validator";

export function runNsLcm001Cp001Pipeline(input: NsLcm001ParameterInput = {}) {
  return runPipeline(NS_LCM_001_CP_001, input);
}
export function runNsLcm001Cp002Pipeline(input: NsLcm001ParameterInput = {}) {
  return runPipeline(NS_LCM_001_CP_002, input);
}
export function runNsLcm001Cp003Pipeline(input: NsLcm001ParameterInput = {}) {
  return runPipeline(NS_LCM_001_CP_003, input);
}
export function runNsLcm001Cp004Pipeline(input: NsLcm001ParameterInput = {}) {
  return runPipeline(NS_LCM_001_CP_004, input);
}
export function runNsLcm001Cp005Pipeline(input: NsLcm001ParameterInput = {}) {
  return runPipeline(NS_LCM_001_CP_005, input);
}

export const NS_LCM_001_PIPELINES = {
  [NS_LCM_001_CP_001]: runNsLcm001Cp001Pipeline,
  [NS_LCM_001_CP_002]: runNsLcm001Cp002Pipeline,
  [NS_LCM_001_CP_003]: runNsLcm001Cp003Pipeline,
  [NS_LCM_001_CP_004]: runNsLcm001Cp004Pipeline,
  [NS_LCM_001_CP_005]: runNsLcm001Cp005Pipeline,
} as const;

function runPipeline(canonicalProblemId: NsLcm001CanonicalProblemId, input: NsLcm001ParameterInput): NsLcm001QuestionPackage {
  const seed = input.seed ?? `NS-LCM-001:${canonicalProblemId}`;
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const parameters = parameterGenerator(canonicalProblemId)({ ...input, questionLanguageId, seed });
  const solver = solveNsLcm001(parameters);
  const reasoningGraph = buildNsLcm001ReasoningGraph(parameters, solver);
  const explanationStyleId = selectExplanationStyleId(canonicalProblemId, seed);
  const explanation = renderNsLcm001Explanation({ solver, reasoningGraph, styleId: explanationStyleId });
  const stem = renderQuestionLanguage({
    canonicalProblemId,
    questionLanguageId,
    values: valuesForRendering(parameters),
  });
  const traceability = {
    questionId: parameters.questionId,
    canonicalProblemId,
    questionLanguageId,
    explanationStyleId,
    difficulty: parameters.difficultyBand,
    difficultyBand: parameters.difficultyBand,
    topology: parameters.topology,
    reasoningGraphId: reasoningGraph.graphId,
    graphId: reasoningGraph.graphId,
    answer: solver.answer,
    cycleContext: parameters.cycleContext,
    cp003Family: parameters.cp003Family,
    operandFactorizationLatex: solver.operandFactorizationLatex,
    primeUnionLatex: solver.primeUnionLatex,
    maximumExponentSelectionLatex: solver.maximumExponentSelectionLatex,
    lcmLatex: solver.lcmLatex,
    synchronizationInterpretationLatex: solver.synchronizationInterpretationLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    rangeCountFormulaLatex: solver.rangeCountFormulaLatex,
    thresholdSelectionFormulaLatex: solver.thresholdSelectionFormulaLatex,
  };
  const questionPackage: Omit<NsLcm001QuestionPackage, "validation"> = {
    archetypeId: NS_LCM_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: parameters.questionId,
    sourceTrace: parameters.sourceTrace,
    topology: parameters.topology,
    difficultyBand: parameters.difficultyBand,
    difficulty: parameters.difficultyBand,
    questionLanguageId,
    explanationFamilyId: explanation.familyId,
    explanationStyleId,
    stem,
    answer: solver.answer,
    numbers: solver.numbers,
    cycleContext: parameters.cycleContext,
    cp003Family: parameters.cp003Family,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability,
    operandFactorizationLatex: solver.operandFactorizationLatex,
    primeUnionLatex: solver.primeUnionLatex,
    maximumExponentSelectionLatex: solver.maximumExponentSelectionLatex,
    lcmLatex: solver.lcmLatex,
    synchronizationInterpretationLatex: solver.synchronizationInterpretationLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    rangeCountFormulaLatex: solver.rangeCountFormulaLatex,
    thresholdSelectionFormulaLatex: solver.thresholdSelectionFormulaLatex,
  };
  const validation = validateNsLcm001QuestionPackage(questionPackage as NsLcm001QuestionPackage);
  return { ...questionPackage, validation };
}

function parameterGenerator(canonicalProblemId: NsLcm001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return generateCp001Parameters;
    case "CP-002":
      return generateCp002Parameters;
    case "CP-003":
      return generateCp003Parameters;
    case "CP-004":
      return generateCp004Parameters;
    case "CP-005":
      return generateCp005Parameters;
  }
}

function selectQuestionLanguageId(canonicalProblemId: NsLcm001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectExplanationStyleId(canonicalProblemId: NsLcm001CanonicalProblemId, seed: string) {
  const entries = getExplanationEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:es`, entries.length)].id;
}

function valuesForRendering(parameters: NsLcm001Parameters) {
  return {
    numbers: formatNumberList(parameters.numbers),
    cycleLengths: formatNumberList(parameters.cycleLengths ?? parameters.numbers),
    knownNumbers: formatNumberList(parameters.knownNumbers ?? []),
    targetLcm: parameters.targetLcm,
    candidateSet: parameters.candidateSet,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
    divisor: parameters.divisor,
    threshold: parameters.threshold,
  };
}
