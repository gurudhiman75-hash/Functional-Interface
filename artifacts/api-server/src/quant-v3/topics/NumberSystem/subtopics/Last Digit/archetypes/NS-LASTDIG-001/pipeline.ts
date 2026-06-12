import { auditNsLastdig001Batch, getNsLastdig001ActiveCanonicalProblemIds, renderQuestion } from "./library";
import { buildNsLastdig001ReasoningGraph } from "./reasoning-graph";
import { generateNsLastdig001Parameters, type NsLastdig001ParameterInput } from "./parameter-generator";
import { renderNsLastdig001Explanation } from "./explanation-renderer";
import { solveNsLastdig001 } from "./solver";
import { validateNsLastdig001QuestionPackage } from "./validator";
import type { NsLastdig001CanonicalProblemId, NsLastdig001QuestionPackage } from "./types";

export function runNsLastdig001Pipeline(cpId: NsLastdig001CanonicalProblemId, input: NsLastdig001ParameterInput = {}): NsLastdig001QuestionPackage {
  const parameters = generateNsLastdig001Parameters(cpId, input);
  const solver = solveNsLastdig001(parameters);
  const graph = buildNsLastdig001ReasoningGraph(parameters, solver);
  const explanation = renderNsLastdig001Explanation(parameters, solver, graph);
  const stem = renderQuestion(cpId, parameters.questionLanguageId, {
    base: parameters.base,
    exponent: parameters.exponent,
    powerProduct: parameters.powerProduct,
    towerExpression: parameters.towerExpression,
    targetLastDigit: parameters.targetLastDigit,
    options: parameters.options?.join(", "),
  });
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
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      graphId: graph.graphId,
      answer: solver.answer,
      cycleLatex: solver.cycleLatex,
      cyclePositionLatex: solver.cyclePositionLatex,
      effectiveExponentLatex: solver.effectiveExponentLatex,
      productLastDigitLatex: solver.productLastDigitLatex,
      towerReductionLatex: solver.towerReductionLatex,
    },
    cycleLatex: solver.cycleLatex,
    cyclePositionLatex: solver.cyclePositionLatex,
    effectiveExponentLatex: solver.effectiveExponentLatex,
    productLastDigitLatex: solver.productLastDigitLatex,
    towerReductionLatex: solver.towerReductionLatex,
  };
  const validation = validateNsLastdig001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runNsLastdig001Cp001Pipeline = (input: NsLastdig001ParameterInput = {}) => runNsLastdig001Pipeline("CP-001", input);
export const runNsLastdig001Cp002Pipeline = (input: NsLastdig001ParameterInput = {}) => runNsLastdig001Pipeline("CP-002", input);
export const runNsLastdig001Cp003Pipeline = (input: NsLastdig001ParameterInput = {}) => runNsLastdig001Pipeline("CP-003", input);
export const runNsLastdig001Cp004Pipeline = (input: NsLastdig001ParameterInput = {}) => runNsLastdig001Pipeline("CP-004", input);
export const runNsLastdig001Cp005Pipeline = (input: NsLastdig001ParameterInput = {}) => runNsLastdig001Pipeline("CP-005", input);

export const NS_LASTDIG_001_PIPELINES = {
  "CP-001": runNsLastdig001Cp001Pipeline,
  "CP-002": runNsLastdig001Cp002Pipeline,
  "CP-003": runNsLastdig001Cp003Pipeline,
  "CP-004": runNsLastdig001Cp004Pipeline,
  "CP-005": runNsLastdig001Cp005Pipeline,
} as const;

export function generateNsLastdig001Batch(cpId: NsLastdig001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsLastdig001Pipeline(cpId, { seed: `${seed}:${cpId}:${index}` }));
}

export function generateNsLastdig001FullAudit(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsLastdig001ActiveCanonicalProblemIds().map((cpId) => [cpId, auditNsLastdig001Batch(generateNsLastdig001Batch(cpId, countPerCp, seed))]));
}
