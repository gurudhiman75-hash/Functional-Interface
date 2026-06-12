import {
  generateSimpl001Parameters,
  getSimpl001ActiveCanonicalProblemIds,
  type Simpl001ParameterInput,
  type Simpl001Parameters,
} from "./parameter-generator";
import { buildSimpl001ReasoningGraph, type Simpl001ReasoningGraph } from "./reasoning-graph";
import { renderSimpl001Explanation, type Simpl001RenderedExplanation } from "./explanation-renderer";
import { selectStemsByCp } from "./stem-selector";
import { solveSimpl001, type Simpl001SolverResult } from "./solver";
import { validateSimpl001QuestionPackage, type Simpl001ValidationResult } from "./validator";
import type { SimplCpId } from "./types";

export interface Simpl001QuestionPackage {
  packageId: "SIMPL-001";
  canonicalProblemId: SimplCpId;
  questionId: string;
  difficulty: string;
  questionLanguageId: string;
  explanationId: string;
  stem: string;
  answer: string;
  answerLatex: string;
  parameters: Simpl001Parameters;
  solver: Simpl001SolverResult;
  reasoningGraph: Simpl001ReasoningGraph;
  explanation: Simpl001RenderedExplanation;
  reasoningTrace: string;
  validation: Simpl001ValidationResult;
}

export function runSimpl001Pipeline(
  cpId: SimplCpId,
  input: Simpl001ParameterInput = {},
): Simpl001QuestionPackage {
  const parameters = generateSimpl001Parameters(cpId, input);
  const solver = solveSimpl001(parameters);
  const reasoningGraph = buildSimpl001ReasoningGraph(parameters, solver);
  const explanation = renderSimpl001Explanation(parameters, solver, reasoningGraph);
  const base = {
    packageId: "SIMPL-001" as const,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    difficulty: parameters.difficulty,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    stem: parameters.stemItem.text,
    answer: solver.answer,
    answerLatex: solver.answerLatex,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    reasoningTrace: reasoningGraph.nodes.map((node) => node.id).join(" -> "),
  };
  const validation = validateSimpl001QuestionPackage({
    ...base,
    validation: { valid: false, checks: [] },
  });
  return { ...base, validation };
}

export const runSimpl001Cp001Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-001", input);
export const runSimpl001Cp002Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-002", input);
export const runSimpl001Cp003Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-003", input);
export const runSimpl001Cp004Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-004", input);
export const runSimpl001Cp005Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-005", input);
export const runSimpl001Cp006Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-006", input);
export const runSimpl001Cp007Pipeline = (input: Simpl001ParameterInput = {}) =>
  runSimpl001Pipeline("CP-007", input);

export const SIMPL_001_PIPELINES = {
  "CP-001": runSimpl001Cp001Pipeline,
  "CP-002": runSimpl001Cp002Pipeline,
  "CP-003": runSimpl001Cp003Pipeline,
  "CP-004": runSimpl001Cp004Pipeline,
  "CP-005": runSimpl001Cp005Pipeline,
  "CP-006": runSimpl001Cp006Pipeline,
  "CP-007": runSimpl001Cp007Pipeline,
} as const;

export function generateSimpl001Batch(
  cpId: SimplCpId,
  count: number,
  seed: string,
): Simpl001QuestionPackage[] {
  const stems = selectStemsByCp(cpId);
  return Array.from({ length: count }, (_value, index) =>
    runSimpl001Pipeline(cpId, {
      seed: `${seed}:${cpId}:${index}`,
      questionLanguageId: stems[index % stems.length]!.id,
    }),
  );
}

export function generateSimpl001FullBatch(
  countPerCp: number,
  seed: string,
): Simpl001QuestionPackage[] {
  return getSimpl001ActiveCanonicalProblemIds().flatMap((cpId) =>
    generateSimpl001Batch(cpId, countPerCp, seed),
  );
}

export function generateSimpl001BalancedBatch(
  totalCount: number,
  seed: string,
): Simpl001QuestionPackage[] {
  const cps = getSimpl001ActiveCanonicalProblemIds();
  const base = Math.floor(totalCount / cps.length);
  const remainder = totalCount % cps.length;
  return cps.flatMap((cpId, index) =>
    generateSimpl001Batch(cpId, base + (index < remainder ? 1 : 0), seed),
  );
}
