import { auditNsFracdec001Batch, getNsFracdec001ActiveCanonicalProblemIds, renderQuestion } from "./library";
import { buildNsFracdec001ReasoningGraph } from "./reasoning-graph";
import { generateNsFracdec001Parameters, type NsFracdec001ParameterInput } from "./parameter-generator";
import { renderNsFracdec001Explanation } from "./explanation-renderer";
import { solveNsFracdec001 } from "./solver";
import { validateNsFracdec001QuestionPackage } from "./validator";
import type { NsFracdec001CanonicalProblemId, NsFracdec001QuestionPackage } from "./types";

export function runNsFracdec001Pipeline(cpId: NsFracdec001CanonicalProblemId, input: NsFracdec001ParameterInput = {}): NsFracdec001QuestionPackage {
  const parameters = generateNsFracdec001Parameters(cpId, input);
  const solver = solveNsFracdec001(parameters);
  const graph = buildNsFracdec001ReasoningGraph(parameters, solver);
  const explanation = renderNsFracdec001Explanation(parameters, solver, graph);
  const stem = renderQuestion(cpId, parameters.questionLanguageId, {
    fraction: parameters.fraction,
    improperFraction: parameters.improperFraction,
    mixedFraction: parameters.mixedFraction,
    expression: parameters.expression,
    values: parameters.values,
    valueA: parameters.valueA,
    valueB: parameters.valueB,
    decimal: parameters.decimal,
    recurringDecimal: parameters.recurringDecimal,
    fractions: parameters.fractions,
  });
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
  const validation = validateNsFracdec001QuestionPackage({ ...basePackage, validation: { valid: false, checks: [] } });
  return { ...basePackage, validation };
}

export const runNsFracdec001Cp001Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-001", input);
export const runNsFracdec001Cp002Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-002", input);
export const runNsFracdec001Cp003Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-003", input);
export const runNsFracdec001Cp004Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-004", input);
export const runNsFracdec001Cp005Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-005", input);
export const runNsFracdec001Cp006Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-006", input);
export const runNsFracdec001Cp007Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-007", input);
export const runNsFracdec001Cp008Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-008", input);
export const runNsFracdec001Cp009Pipeline = (input: NsFracdec001ParameterInput = {}) => runNsFracdec001Pipeline("CP-009", input);

export const NS_FRACDEC_001_PIPELINES = {
  "CP-001": runNsFracdec001Cp001Pipeline,
  "CP-002": runNsFracdec001Cp002Pipeline,
  "CP-003": runNsFracdec001Cp003Pipeline,
  "CP-004": runNsFracdec001Cp004Pipeline,
  "CP-005": runNsFracdec001Cp005Pipeline,
  "CP-006": runNsFracdec001Cp006Pipeline,
  "CP-007": runNsFracdec001Cp007Pipeline,
  "CP-008": runNsFracdec001Cp008Pipeline,
  "CP-009": runNsFracdec001Cp009Pipeline,
} as const;

export function generateNsFracdec001Batch(cpId: NsFracdec001CanonicalProblemId, count: number, seed: string) {
  return Array.from({ length: count }, (_value, index) => runNsFracdec001Pipeline(cpId, { seed: `${seed}:${cpId}:${index}` }));
}

export function generateNsFracdec001FullAudit(countPerCp: number, seed: string) {
  return Object.fromEntries(getNsFracdec001ActiveCanonicalProblemIds().map((cpId) => [cpId, auditNsFracdec001Batch(generateNsFracdec001Batch(cpId, countPerCp, seed))]));
}

function mathJaxFromSolver(solver: ReturnType<typeof solveNsFracdec001>) {
  return {
    fractionReductionLatex: solver.fractionReductionLatex,
    mixedFractionConversionLatex: solver.mixedFractionConversionLatex,
    fractionArithmeticLatex: solver.fractionArithmeticLatex,
    comparisonWorkingLatex: solver.comparisonWorkingLatex,
    fractionToDecimalLatex: solver.fractionToDecimalLatex,
    decimalToFractionLatex: solver.decimalToFractionLatex,
    recurringDecimalConversionLatex: solver.recurringDecimalConversionLatex,
    terminatingCheckLatex: solver.terminatingCheckLatex,
    fractionHcfLcmLatex: solver.fractionHcfLcmLatex,
  };
}
