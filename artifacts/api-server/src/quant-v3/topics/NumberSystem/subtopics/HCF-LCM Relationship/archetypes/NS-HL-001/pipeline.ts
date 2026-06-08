import { renderNsHl001Explanation } from "./explanation-renderer";
import { getExplanationEntries, getQuestionLanguageEntries, renderQuestionLanguage } from "./library";
import {
  generateCp001Parameters,
  generateCp002Parameters,
  generateCp003Parameters,
  generateCp004Parameters,
  generateCp005Parameters,
  generateCp006Parameters,
  stableBucket,
  type NsHl001ParameterInput,
} from "./parameter-generator";
import { buildNsHl001ReasoningGraph } from "./reasoning-graph";
import { solveNsHl001 } from "./solver";
import {
  NS_HL_001_ARCHETYPE_ID,
  NS_HL_001_CP_001,
  NS_HL_001_CP_002,
  NS_HL_001_CP_003,
  NS_HL_001_CP_004,
  NS_HL_001_CP_005,
  NS_HL_001_CP_006,
  type NsHl001CanonicalProblemId,
  type NsHl001Parameters,
  type NsHl001QuestionPackage,
  type NsHl001SolverResult,
} from "./types";
import { validateNsHl001QuestionPackage } from "./validator";

export function runNsHl001Cp001Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_001, input); }
export function runNsHl001Cp002Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_002, input); }
export function runNsHl001Cp003Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_003, input); }
export function runNsHl001Cp004Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_004, input); }
export function runNsHl001Cp005Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_005, input); }
export function runNsHl001Cp006Pipeline(input: NsHl001ParameterInput = {}) { return runPipeline(NS_HL_001_CP_006, input); }

export const NS_HL_001_PIPELINES = {
  [NS_HL_001_CP_001]: runNsHl001Cp001Pipeline,
  [NS_HL_001_CP_002]: runNsHl001Cp002Pipeline,
  [NS_HL_001_CP_003]: runNsHl001Cp003Pipeline,
  [NS_HL_001_CP_004]: runNsHl001Cp004Pipeline,
  [NS_HL_001_CP_005]: runNsHl001Cp005Pipeline,
  [NS_HL_001_CP_006]: runNsHl001Cp006Pipeline,
} as const;

function runPipeline(canonicalProblemId: NsHl001CanonicalProblemId, input: NsHl001ParameterInput): NsHl001QuestionPackage {
  const seed = input.seed ?? `NS-HL-001:${canonicalProblemId}`;
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const parameters = parameterGenerator(canonicalProblemId)({ ...input, questionLanguageId, seed });
  const solver = solveNsHl001(parameters);
  const reasoningGraph = buildNsHl001ReasoningGraph(parameters, solver);
  const explanationStyleId = selectExplanationStyleId(canonicalProblemId, seed, solver);
  const explanation = renderNsHl001Explanation({ solver, reasoningGraph, styleId: explanationStyleId });
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
    validityType: parameters.validityType,
    conditionType: parameters.conditionType,
    pairPolicy: parameters.pairPolicy,
    ratioType: parameters.ratioType,
    productRelationLatex: solver.productRelationLatex,
    divisibilityCheckLatex: solver.divisibilityCheckLatex,
    productRelationCheckLatex: solver.productRelationCheckLatex,
    missingNumberFormulaLatex: solver.missingNumberFormulaLatex,
    hcfVerificationLatex: solver.hcfVerificationLatex,
    lcmVerificationLatex: solver.lcmVerificationLatex,
    quotientLatex: solver.quotientLatex,
    factorPairListLatex: solver.factorPairListLatex,
    coprimePairFilterLatex: solver.coprimePairFilterLatex,
    conditionFilterLatex: solver.conditionFilterLatex,
    reconstructedPairLatex: solver.reconstructedPairLatex,
    factorPairCountLatex: solver.factorPairCountLatex,
    orderedPairPolicyLatex: solver.orderedPairPolicyLatex,
    unorderedPairPolicyLatex: solver.unorderedPairPolicyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
    ratioMultiplierLatex: solver.ratioMultiplierLatex,
    hcfMultiplierLatex: solver.hcfMultiplierLatex,
    lcmMultiplierLatex: solver.lcmMultiplierLatex,
    consistencyCheckLatex: solver.consistencyCheckLatex,
  };
  const questionPackage: Omit<NsHl001QuestionPackage, "validation"> = {
    archetypeId: NS_HL_001_ARCHETYPE_ID,
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
    productRelationLatex: solver.productRelationLatex,
    divisibilityCheckLatex: solver.divisibilityCheckLatex,
    productRelationCheckLatex: solver.productRelationCheckLatex,
    missingNumberFormulaLatex: solver.missingNumberFormulaLatex,
    hcfVerificationLatex: solver.hcfVerificationLatex,
    lcmVerificationLatex: solver.lcmVerificationLatex,
    quotientLatex: solver.quotientLatex,
    factorPairListLatex: solver.factorPairListLatex,
    coprimePairFilterLatex: solver.coprimePairFilterLatex,
    conditionFilterLatex: solver.conditionFilterLatex,
    reconstructedPairLatex: solver.reconstructedPairLatex,
    factorPairCountLatex: solver.factorPairCountLatex,
    orderedPairPolicyLatex: solver.orderedPairPolicyLatex,
    unorderedPairPolicyLatex: solver.unorderedPairPolicyLatex,
    ratioReductionLatex: solver.ratioReductionLatex,
    ratioMultiplierLatex: solver.ratioMultiplierLatex,
    hcfMultiplierLatex: solver.hcfMultiplierLatex,
    lcmMultiplierLatex: solver.lcmMultiplierLatex,
    consistencyCheckLatex: solver.consistencyCheckLatex,
  };
  const validation = validateNsHl001QuestionPackage(questionPackage as NsHl001QuestionPackage);
  return { ...questionPackage, validation };
}

function parameterGenerator(canonicalProblemId: NsHl001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001": return generateCp001Parameters;
    case "CP-002": return generateCp002Parameters;
    case "CP-003": return generateCp003Parameters;
    case "CP-004": return generateCp004Parameters;
    case "CP-005": return generateCp005Parameters;
    case "CP-006": return generateCp006Parameters;
  }
}

function selectQuestionLanguageId(canonicalProblemId: NsHl001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectExplanationStyleId(canonicalProblemId: NsHl001CanonicalProblemId, seed: string, solver: NsHl001SolverResult) {
  const validityCase = canonicalProblemId === "CP-002" ? (solver.answer === "Valid" ? "valid" : "invalid") : undefined;
  const entries = getExplanationEntries(canonicalProblemId, validityCase);
  return entries[stableBucket(`${seed}:es`, entries.length)].id;
}

function valuesForRendering(parameters: NsHl001Parameters) {
  return {
    hcf: parameters.hcf,
    lcm: parameters.lcm,
    product: parameters.product,
    a: parameters.a,
    b: parameters.b,
    knownNumber: parameters.knownNumber,
    sum: parameters.sum,
    difference: parameters.difference,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
    ratio: parameters.ratio,
  };
}
