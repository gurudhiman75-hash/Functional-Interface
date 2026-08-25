import { auditNsExp001Batch, getNsExp001ActiveCanonicalProblemIds, renderQuestion } from "./library";
import { buildNsExp001ReasoningGraph } from "./reasoning-graph";
import { generateNsExp001Parameters, type NsExp001ParameterInput } from "./parameter-generator";
import { renderNsExp001Explanation } from "./explanation-renderer";
import { solveNsExp001 } from "./solver";
import { validateNsExp001QuestionPackage } from "./validator";
import type { NsExp001CanonicalProblemId, NsExp001QuestionPackage } from "./types";

export function runNsExp001Pipeline(cpId: NsExp001CanonicalProblemId, input: NsExp001ParameterInput = {}): NsExp001QuestionPackage {
  const parameters = generateNsExp001Parameters(cpId, input);
  const solver = solveNsExp001(parameters);
  const graph = buildNsExp001ReasoningGraph(parameters, solver);
  const explanation = renderNsExp001Explanation(parameters, solver, graph);
  const stem = renderQuestion(cpId, parameters.questionLanguageId, parameters.variables);
  const mathJax = mathJaxFromSolver(solver);
  const basePackage = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    difficultyBand: parameters.difficultyBand,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph: graph,
    explanation,
    traceability: { questionId: parameters.questionId, canonicalProblemId: cpId, questionLanguageId: parameters.questionLanguageId, explanationId: parameters.explanationId, difficultyBand: parameters.difficultyBand, graphId: graph.graphId, answer: solver.answer, ...mathJax },
    ...mathJax,
  };
  const validation = validateNsExp001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runNsExp001Cp01Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP01", input);
export const runNsExp001Cp02Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP02", input);
export const runNsExp001Cp03Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP03", input);
export const runNsExp001Cp04Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP04", input);
export const runNsExp001Cp05Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP05", input);
export const runNsExp001Cp06Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP06", input);
export const runNsExp001Cp07Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP07", input);
export const runNsExp001Cp09Pipeline = (input: NsExp001ParameterInput = {}) => runNsExp001Pipeline("CP09", input);

export const NS_EXP_001_PIPELINES = {
  CP01: runNsExp001Cp01Pipeline,
  CP02: runNsExp001Cp02Pipeline,
  CP03: runNsExp001Cp03Pipeline,
  CP04: runNsExp001Cp04Pipeline,
  CP05: runNsExp001Cp05Pipeline,
  CP06: runNsExp001Cp06Pipeline,
  CP07: runNsExp001Cp07Pipeline,
  CP09: runNsExp001Cp09Pipeline,
} as const;

export function generateNsExp001Batch(cpId: NsExp001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsExp001Pipeline(cpId, { seed: `${seed}:${cpId}:${index}` }));
}

export function generateNsExp001FullAudit(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsExp001ActiveCanonicalProblemIds().map((cpId) => [cpId, auditNsExp001Batch(generateNsExp001Batch(cpId, countPerCp, seed))]));
}

function mathJaxFromSolver(solver: ReturnType<typeof solveNsExp001>) {
  return {
    sameBaseCompressionLatex: solver.sameBaseCompressionLatex,
    sameBaseEquationLatex: solver.sameBaseEquationLatex,
    baseTransformationLatex: solver.baseTransformationLatex,
    negativeExponentLatex: solver.negativeExponentLatex,
    fractionalExponentLatex: solver.fractionalExponentLatex,
    mixedExponentLatex: solver.mixedExponentLatex,
    comparisonLatex: solver.comparisonLatex,
    substitutionLatex: solver.substitutionLatex,
  };
}
