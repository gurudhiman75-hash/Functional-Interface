import { renderNsHcf001Explanation } from "./explanation-renderer";
import { getExplanationEntries, getQuestionLanguageEntries, renderQuestionLanguage } from "./library";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  stableBucket,
  type NsHcf001ParameterInput,
} from "./parameter-generator";
import { buildNsHcf001ReasoningGraph } from "./reasoning-graph";
import { solveNsHcf001 } from "./solver";
import {
  NS_HCF_001_ARCHETYPE_ID,
  NS_HCF_001_CP_001,
  NS_HCF_001_CP_002,
  NS_HCF_001_CP_003,
  NS_HCF_001_CP_004,
  type NsHcf001CanonicalProblemId,
  type NsHcf001QuestionPackage,
} from "./types";
import { validateNsHcf001QuestionPackage } from "./validator";
import { formatNumberList } from "./math";

export function runNsHcf001Cp001Pipeline(input: NsHcf001ParameterInput = {}) {
  return runPipeline(NS_HCF_001_CP_001, input);
}
export function runNsHcf001Cp002Pipeline(input: NsHcf001ParameterInput = {}) {
  return runPipeline(NS_HCF_001_CP_002, input);
}
export function runNsHcf001Cp003Pipeline(input: NsHcf001ParameterInput = {}) {
  return runPipeline(NS_HCF_001_CP_003, input);
}
export function runNsHcf001Cp004Pipeline(input: NsHcf001ParameterInput = {}) {
  return runPipeline(NS_HCF_001_CP_004, input);
}

export const NS_HCF_001_PIPELINES = {
  [NS_HCF_001_CP_001]: runNsHcf001Cp001Pipeline,
  [NS_HCF_001_CP_002]: runNsHcf001Cp002Pipeline,
  [NS_HCF_001_CP_003]: runNsHcf001Cp003Pipeline,
  [NS_HCF_001_CP_004]: runNsHcf001Cp004Pipeline,
} as const;

function runPipeline(canonicalProblemId: NsHcf001CanonicalProblemId, input: NsHcf001ParameterInput): NsHcf001QuestionPackage {
  const seed = input.seed ?? `NS-HCF-001:${canonicalProblemId}`;
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const parameters = parameterGenerator(canonicalProblemId)({ ...input, questionLanguageId, seed });
  const solver = solveNsHcf001(parameters);
  const reasoningGraph = buildNsHcf001ReasoningGraph(parameters, solver);
  const explanationStyleId = selectExplanationStyleId(canonicalProblemId, seed);
  const explanation = renderNsHcf001Explanation({ solver, reasoningGraph, styleId: explanationStyleId });
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
    cp003Family: parameters.cp003Family,
    operandFactorizationLatex: solver.operandFactorizationLatex,
    commonPrimeIntersectionLatex: solver.commonPrimeIntersectionLatex,
    minimumExponentSelectionLatex: solver.minimumExponentSelectionLatex,
    hcfLatex: solver.hcfLatex,
    hcfFactorCountFormulaLatex: solver.hcfFactorCountFormulaLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    groupingInterpretationLatex: solver.groupingInterpretationLatex,
  };
  const questionPackage: Omit<NsHcf001QuestionPackage, "validation"> = {
    archetypeId: NS_HCF_001_ARCHETYPE_ID,
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
    cp003Family: parameters.cp003Family,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability,
    operandFactorizationLatex: solver.operandFactorizationLatex,
    commonPrimeIntersectionLatex: solver.commonPrimeIntersectionLatex,
    minimumExponentSelectionLatex: solver.minimumExponentSelectionLatex,
    hcfLatex: solver.hcfLatex,
    hcfFactorCountFormulaLatex: solver.hcfFactorCountFormulaLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    groupingInterpretationLatex: solver.groupingInterpretationLatex,
  };
  const validation = validateNsHcf001QuestionPackage(questionPackage as NsHcf001QuestionPackage);
  return { ...questionPackage, validation };
}

function parameterGenerator(canonicalProblemId: NsHcf001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return generateCp001Parameters;
    case "CP-002":
      return generateCp002Parameters;
    case "CP-003":
      return generateCp003Parameters;
    case "CP-004":
      return generateCp004Parameters;
  }
}

function selectQuestionLanguageId(canonicalProblemId: NsHcf001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectExplanationStyleId(canonicalProblemId: NsHcf001CanonicalProblemId, seed: string) {
  const entries = getExplanationEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:es`, entries.length)].id;
}

function valuesForRendering(parameters: ReturnType<typeof generateCp001Parameters>) {
  return {
    numbers: formatNumberList(parameters.numbers),
    knownOperands: formatNumberList(parameters.knownOperands ?? []),
    targetHcf: parameters.targetHcf,
    rangeStart: parameters.rangeStart,
    rangeEnd: parameters.rangeEnd,
    numberList: parameters.numberList,
    divisibleBy: parameters.divisibleBy,
    notDivisibleBy: parameters.notDivisibleBy,
    baseNumber: parameters.baseNumber,
    increase: parameters.increase,
    decrease: parameters.decrease,
  };
}
