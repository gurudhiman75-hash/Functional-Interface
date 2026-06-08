import { renderNsCop001Explanation } from "./explanation-renderer";
import { getExplanationEntries, getQuestionLanguageEntries, renderQuestionLanguage } from "./library";
import { formatNumberList } from "./math";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  stableBucket,
  type NsCop001ParameterInput,
} from "./parameter-generator";
import { buildNsCop001ReasoningGraph } from "./reasoning-graph";
import { solveNsCop001 } from "./solver";
import {
  NS_COP_001_ARCHETYPE_ID,
  NS_COP_001_CP_001,
  NS_COP_001_CP_002,
  NS_COP_001_CP_003,
  NS_COP_001_CP_004,
  NS_COP_001_CP_005,
  NS_COP_001_CP_006,
  type NsCop001CanonicalProblemId,
  type NsCop001Parameters,
  type NsCop001QuestionPackage,
} from "./types";
import { validateNsCop001QuestionPackage } from "./validator";

export function runNsCop001Cp001Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_001, input); }
export function runNsCop001Cp002Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_002, input); }
export function runNsCop001Cp003Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_003, input); }
export function runNsCop001Cp004Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_004, input); }
export function runNsCop001Cp005Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_005, input); }
export function runNsCop001Cp006Pipeline(input: NsCop001ParameterInput = {}) { return runPipeline(NS_COP_001_CP_006, input); }

export const NS_COP_001_PIPELINES = {
  [NS_COP_001_CP_001]: runNsCop001Cp001Pipeline,
  [NS_COP_001_CP_002]: runNsCop001Cp002Pipeline,
  [NS_COP_001_CP_003]: runNsCop001Cp003Pipeline,
  [NS_COP_001_CP_004]: runNsCop001Cp004Pipeline,
  [NS_COP_001_CP_005]: runNsCop001Cp005Pipeline,
  [NS_COP_001_CP_006]: runNsCop001Cp006Pipeline,
} as const;

function runPipeline(canonicalProblemId: NsCop001CanonicalProblemId, input: NsCop001ParameterInput): NsCop001QuestionPackage {
  const seed = input.seed ?? `NS-COP-001:${canonicalProblemId}`;
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const parameters = parameterGenerator(canonicalProblemId)({ ...input, questionLanguageId, seed });
  const solver = solveNsCop001(parameters);
  const reasoningGraph = buildNsCop001ReasoningGraph(parameters, solver);
  const explanationStyleId = selectExplanationStyleId(canonicalProblemId, seed);
  const explanation = renderNsCop001Explanation({ solver, reasoningGraph, styleId: explanationStyleId });
  const stem = renderQuestionLanguage({ canonicalProblemId, questionLanguageId, values: valuesForRendering(parameters) });
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
    hcfLatex: solver.hcfLatex,
    coprimeCheckLatex: solver.coprimeCheckLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    pairEvaluationLatex: solver.pairEvaluationLatex,
    consecutivePropertyLatex: solver.consecutivePropertyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
  };
  const questionPackage: Omit<NsCop001QuestionPackage, "validation"> = {
    archetypeId: NS_COP_001_ARCHETYPE_ID,
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
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability,
    hcfLatex: solver.hcfLatex,
    coprimeCheckLatex: solver.coprimeCheckLatex,
    candidateEvaluationLatex: solver.candidateEvaluationLatex,
    pairEvaluationLatex: solver.pairEvaluationLatex,
    consecutivePropertyLatex: solver.consecutivePropertyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
  };
  const validation = validateNsCop001QuestionPackage(questionPackage as NsCop001QuestionPackage);
  return { ...questionPackage, validation };
}

function parameterGenerator(canonicalProblemId: NsCop001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001": return generateCp001Parameters;
    case "CP-002": return generateCp002Parameters;
    case "CP-003": return generateCp003Parameters;
    case "CP-004": return generateCp004Parameters;
    case "CP-005": return generateCp005Parameters;
    case "CP-006": return generateCp006Parameters;
  }
}

function selectQuestionLanguageId(canonicalProblemId: NsCop001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectExplanationStyleId(canonicalProblemId: NsCop001CanonicalProblemId, seed: string) {
  const entries = getExplanationEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:es`, entries.length)].id;
}

function valuesForRendering(parameters: NsCop001Parameters) {
  return {
    a: parameters.a,
    b: parameters.b,
    number: parameters.number,
    nextNumber: parameters.nextNumber,
    targetNumber: parameters.targetNumber,
    numberList: formatNumberList(parameters.numberList ?? []),
    numberSet: formatNumberList(parameters.numberSet ?? []),
  };
}
