import { auditNsClass001Batch, getNsClass001ActiveCanonicalProblemIds, renderQuestion } from "./library";
import { buildNsClass001ReasoningGraph } from "./reasoning-graph";
import { generateNsClass001Parameters, type NsClass001ParameterInput } from "./parameter-generator";
import { renderNsClass001Explanation } from "./explanation-renderer";
import { solveNsClass001 } from "./solver";
import { validateNsClass001QuestionPackage } from "./validator";
import type { NsClass001CanonicalProblemId, NsClass001QuestionPackage } from "./types";

export function runNsClass001Pipeline(cpId: NsClass001CanonicalProblemId, input: NsClass001ParameterInput = {}): NsClass001QuestionPackage {
  const parameters = generateNsClass001Parameters(cpId, input);
  const solver = solveNsClass001(parameters);
  const graph = buildNsClass001ReasoningGraph(parameters, solver);
  const explanation = renderNsClass001Explanation(parameters, solver, graph);
  const stem = renderQuestion(cpId, parameters.questionLanguageId);
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
    traceability: { questionId: parameters.questionId, canonicalProblemId: cpId, questionLanguageId: parameters.questionLanguageId, explanationId: parameters.explanationId, difficultyBand: parameters.difficultyBand, graphId: graph.graphId, answer: solver.answer, propertyWorkingLatex: solver.propertyWorkingLatex },
    propertyWorkingLatex: solver.propertyWorkingLatex,
  };
  const validation = validateNsClass001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runNsClass001Cp01Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP01", input);
export const runNsClass001Cp02Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP02", input);
export const runNsClass001Cp03Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP03", input);
export const runNsClass001Cp04Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP04", input);
export const runNsClass001Cp05Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP05", input);
export const runNsClass001Cp06Pipeline = (input: NsClass001ParameterInput = {}) => runNsClass001Pipeline("CP06", input);

export const NS_CLASS_001_PIPELINES = {
  CP01: runNsClass001Cp01Pipeline,
  CP02: runNsClass001Cp02Pipeline,
  CP03: runNsClass001Cp03Pipeline,
  CP04: runNsClass001Cp04Pipeline,
  CP05: runNsClass001Cp05Pipeline,
  CP06: runNsClass001Cp06Pipeline,
} as const;

export function generateNsClass001Batch(cpId: NsClass001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsClass001Pipeline(cpId, { seed: `${seed}:${cpId}:${index}` }));
}

export function generateNsClass001FullAudit(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsClass001ActiveCanonicalProblemIds().map((cpId) => [cpId, auditNsClass001Batch(generateNsClass001Batch(cpId, countPerCp, seed))]));
}
