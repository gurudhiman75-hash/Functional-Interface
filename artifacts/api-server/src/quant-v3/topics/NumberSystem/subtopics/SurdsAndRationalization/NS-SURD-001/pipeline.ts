import { buildNsSurd001ReasoningGraph, type NsSurd001ReasoningGraph } from "./reasoning-graph";
import { generateNsSurd001Parameters, getNsSurd001ActiveCanonicalProblemIds, type NsSurd001ParameterInput, type NsSurd001Parameters } from "./parameter-generator";
import { renderNsSurd001Explanation, type NsSurd001RenderedExplanation } from "./explanation-renderer";
import { solveNsSurd001, type NsSurd001SolverResult } from "./solver";
import { selectStemsByCp } from "./stem-selector";
import { validateNsSurd001QuestionPackage, type NsSurd001ValidationResult } from "./validator";
import type { SurdCpId } from "./types";

export interface NsSurd001QuestionPackage {
  packageId: "NS-SURD-001";
  canonicalProblemId: SurdCpId;
  questionId: string;
  difficulty: string;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: string;
  answerLatex: string;
  parameters: NsSurd001Parameters;
  solver: NsSurd001SolverResult;
  reasoningGraph: NsSurd001ReasoningGraph;
  explanation: NsSurd001RenderedExplanation;
  reasoningTrace: string;
  validation: NsSurd001ValidationResult;
}

export function runNsSurd001Pipeline(
  cpId: SurdCpId,
  input: NsSurd001ParameterInput = {},
): NsSurd001QuestionPackage {
  const parameters = generateNsSurd001Parameters(cpId, input);
  const solver = solveNsSurd001(parameters);
  const reasoningGraph = buildNsSurd001ReasoningGraph(parameters, solver);
  const explanation = renderNsSurd001Explanation(parameters, solver, reasoningGraph);
  const base = {
    packageId: "NS-SURD-001" as const,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    difficulty: parameters.difficulty,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    stem: parameters.stemItem.stem,
    answer: solver.answer,
    answerLatex: solver.answerLatex,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    reasoningTrace: reasoningGraph.nodes.map((node) => node.id).join(" -> "),
  };
  const validation = validateNsSurd001QuestionPackage({ ...base, validation: { valid: false, checks: [] } });
  return { ...base, validation };
}

export const runNsSurd001Cp01Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP01", input);
export const runNsSurd001Cp02Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP02", input);
export const runNsSurd001Cp03Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP03", input);
export const runNsSurd001Cp04Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP04", input);
export const runNsSurd001Cp05Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP05", input);
export const runNsSurd001Cp06Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP06", input);
export const runNsSurd001Cp07Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP07", input);
export const runNsSurd001Cp08Pipeline = (input: NsSurd001ParameterInput = {}) => runNsSurd001Pipeline("CP08", input);

export const NS_SURD_001_PIPELINES = {
  CP01: runNsSurd001Cp01Pipeline,
  CP02: runNsSurd001Cp02Pipeline,
  CP03: runNsSurd001Cp03Pipeline,
  CP04: runNsSurd001Cp04Pipeline,
  CP05: runNsSurd001Cp05Pipeline,
  CP06: runNsSurd001Cp06Pipeline,
  CP07: runNsSurd001Cp07Pipeline,
  CP08: runNsSurd001Cp08Pipeline,
} as const;

export function generateNsSurd001Batch(cpId: SurdCpId, count: number, seed: string): NsSurd001QuestionPackage[] {
  const stems = selectStemsByCp(cpId);
  return Array.from({ length: count }, (_value, index) =>
    runNsSurd001Pipeline(cpId, {
      seed: `${seed}:${cpId}:${index}`,
      questionLanguageId: stems[index % stems.length]!.id,
    }),
  );
}

export function generateNsSurd001FullBatch(countPerCp: number, seed: string): NsSurd001QuestionPackage[] {
  return getNsSurd001ActiveCanonicalProblemIds().flatMap((cpId) => generateNsSurd001Batch(cpId, countPerCp, seed));
}
