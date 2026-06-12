import { auditNsDigit001Batch, getNsDigit001ActiveCanonicalProblemIds, renderQuestion } from "./library";
import { buildNsDigit001ReasoningGraph } from "./reasoning-graph";
import { generateNsDigit001Parameters, type NsDigit001ParameterInput } from "./parameter-generator";
import { renderNsDigit001Explanation } from "./explanation-renderer";
import { solveNsDigit001 } from "./solver";
import { validateNsDigit001QuestionPackage } from "./validator";
import type { NsDigit001CanonicalProblemId, NsDigit001QuestionPackage } from "./types";

export function runNsDigit001Pipeline(cpId: NsDigit001CanonicalProblemId, input: NsDigit001ParameterInput = {}): NsDigit001QuestionPackage {
  const parameters = generateNsDigit001Parameters(cpId, input);
  const solver = solveNsDigit001(parameters);
  const graph = buildNsDigit001ReasoningGraph(parameters, solver);
  const explanation = renderNsDigit001Explanation(parameters, solver, graph);
  const stem = renderQuestion(cpId, parameters.questionLanguageId, {
    number: parameters.number,
    base: parameters.base,
    exponent: parameters.exponent,
    expression: parameters.expression,
    digitCount: parameters.digitCount,
  });
  const mathJax = {
    digitCountFormulaLatex: solver.digitCountFormulaLatex,
    logarithmExpansionLatex: solver.logarithmExpansionLatex,
    productDigitFormulaLatex: solver.productDigitFormulaLatex,
    nDigitNumberFormulaLatex: solver.nDigitNumberFormulaLatex,
    exponentDigitFormulaLatex: solver.exponentDigitFormulaLatex,
  };
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
  const validation = validateNsDigit001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runNsDigit001Cp001Pipeline = (input: NsDigit001ParameterInput = {}) => runNsDigit001Pipeline("CP-001", input);
export const runNsDigit001Cp002Pipeline = (input: NsDigit001ParameterInput = {}) => runNsDigit001Pipeline("CP-002", input);
export const runNsDigit001Cp003Pipeline = (input: NsDigit001ParameterInput = {}) => runNsDigit001Pipeline("CP-003", input);
export const runNsDigit001Cp004Pipeline = (input: NsDigit001ParameterInput = {}) => runNsDigit001Pipeline("CP-004", input);
export const runNsDigit001Cp005Pipeline = (input: NsDigit001ParameterInput = {}) => runNsDigit001Pipeline("CP-005", input);

export const NS_DIGIT_001_PIPELINES = {
  "CP-001": runNsDigit001Cp001Pipeline,
  "CP-002": runNsDigit001Cp002Pipeline,
  "CP-003": runNsDigit001Cp003Pipeline,
  "CP-004": runNsDigit001Cp004Pipeline,
  "CP-005": runNsDigit001Cp005Pipeline,
} as const;

export function generateNsDigit001Batch(cpId: NsDigit001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsDigit001Pipeline(cpId, { seed: `${seed}:${cpId}:${index}` }));
}

export function generateNsDigit001FullAudit(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsDigit001ActiveCanonicalProblemIds().map((cpId) => [cpId, auditNsDigit001Batch(generateNsDigit001Batch(cpId, countPerCp, seed))]));
}
