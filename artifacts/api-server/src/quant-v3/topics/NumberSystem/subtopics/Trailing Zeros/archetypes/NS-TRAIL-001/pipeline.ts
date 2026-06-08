import { buildNsTrail001ReasoningGraph } from "./reasoning-graph";
import { generateParameters, type NsTrail001ParameterInput } from "./parameter-generator";
import { getNsTrail001ActiveCanonicalProblemIds, renderQuestionLanguage } from "./library";
import { renderNsTrail001Explanation } from "./explanation-renderer";
import { solveNsTrail001 } from "./solver";
import { validateNsTrail001QuestionPackage } from "./validator";
import type {
  NsTrail001CanonicalProblemId,
  NsTrail001QuestionPackage,
  NsTrail001TraceabilityPackage,
} from "./types";

export function runNsTrail001Pipeline(canonicalProblemId: NsTrail001CanonicalProblemId, input: NsTrail001ParameterInput = {}): NsTrail001QuestionPackage {
  const parameters = generateParameters(canonicalProblemId, input);
  const solver = solveNsTrail001(parameters);
  const reasoningGraph = buildNsTrail001ReasoningGraph(parameters, solver);
  const explanation = renderNsTrail001Explanation(parameters, solver, reasoningGraph);
  const stem = renderQuestionLanguage({
    canonicalProblemId,
    questionLanguageId: parameters.questionLanguageId,
    values: {
      n: parameters.n,
      expression: parameters.expression,
      zeroCount: parameters.zeroCount,
      base: parameters.base,
      exponent: parameters.exponent,
      numberA: parameters.numberA,
      numberB: parameters.numberB,
    },
  });
  const traceability: NsTrail001TraceabilityPackage = {
    questionId: parameters.questionId,
    canonicalProblemId,
    questionLanguageId: parameters.questionLanguageId,
    explanationStyleId: explanation.styleId,
    difficulty: parameters.difficultyBand,
    difficultyBand: parameters.difficultyBand,
    topology: parameters.topology,
    reasoningGraphId: reasoningGraph.graphId,
    graphId: reasoningGraph.graphId,
    answer: solver.answer,
    factorFiveCountLatex: solver.factorFiveCountLatex,
    factorialExpressionLatex: solver.factorialExpressionLatex,
    searchProcessLatex: solver.searchProcessLatex,
    powerFactorizationLatex: solver.powerFactorizationLatex,
    productFactorizationLatex: solver.productFactorizationLatex,
  };
  const packageWithoutValidation = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId,
    questionId: parameters.questionId,
    sourceTrace: parameters.sourceTrace,
    topology: parameters.topology,
    difficultyBand: parameters.difficultyBand,
    difficulty: parameters.difficultyBand,
    questionLanguageId: parameters.questionLanguageId,
    explanationFamilyId: explanation.familyId,
    explanationStyleId: explanation.styleId,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    traceability,
    factorFiveCountLatex: solver.factorFiveCountLatex,
    factorialExpressionLatex: solver.factorialExpressionLatex,
    searchProcessLatex: solver.searchProcessLatex,
    powerFactorizationLatex: solver.powerFactorizationLatex,
    productFactorizationLatex: solver.productFactorizationLatex,
  };
  const validation = validateNsTrail001QuestionPackage({ ...packageWithoutValidation, validation: { valid: false, checks: [] } });
  return { ...packageWithoutValidation, validation };
}

export function runNsTrail001Cp001Pipeline(input: NsTrail001ParameterInput = {}) {
  return runNsTrail001Pipeline("CP-001", input);
}
export function runNsTrail001Cp002Pipeline(input: NsTrail001ParameterInput = {}) {
  return runNsTrail001Pipeline("CP-002", input);
}
export function runNsTrail001Cp003Pipeline(input: NsTrail001ParameterInput = {}) {
  return runNsTrail001Pipeline("CP-003", input);
}
export function runNsTrail001Cp004Pipeline(input: NsTrail001ParameterInput = {}) {
  return runNsTrail001Pipeline("CP-004", input);
}
export function runNsTrail001Cp005Pipeline(input: NsTrail001ParameterInput = {}) {
  return runNsTrail001Pipeline("CP-005", input);
}

export const NS_TRAIL_001_PIPELINES = {
  "CP-001": runNsTrail001Cp001Pipeline,
  "CP-002": runNsTrail001Cp002Pipeline,
  "CP-003": runNsTrail001Cp003Pipeline,
  "CP-004": runNsTrail001Cp004Pipeline,
  "CP-005": runNsTrail001Cp005Pipeline,
} as const;

export function generateNsTrail001Batch(canonicalProblemId: NsTrail001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsTrail001Pipeline(canonicalProblemId, { seed: `${seed}:${canonicalProblemId}:${index}` }));
}

export function generateNsTrail001FullSet(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsTrail001ActiveCanonicalProblemIds().map((cpId) => [cpId, generateNsTrail001Batch(cpId, countPerCp, seed)]));
}
