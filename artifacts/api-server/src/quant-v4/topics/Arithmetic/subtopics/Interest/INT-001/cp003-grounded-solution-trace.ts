import type { Cp003QuestionContract, Rational } from "./cp003-exam-model";
import type { ResolvedState } from "./cp003-exam-support";
import {
  buildCp003SolutionTrace as baseBuildCp003SolutionTrace,
  type Cp003SolutionTrace,
  type Cp003SolutionTraceStep,
} from "./cp003-solution-trace";

export {
  INT_CP003_SOLUTION_TRACE_VERSION,
  validateCp003SolutionTrace,
  type Cp003SolutionMethodId,
  type Cp003SolutionOperationId,
  type Cp003SolutionTrace,
  type Cp003SolutionTraceStep,
  type Cp003TraceDatum,
  type Cp003TraceDatumSemantic,
} from "./cp003-solution-trace";

function rebuildTrace(
  trace: Cp003SolutionTrace,
  coreSteps: readonly Cp003SolutionTraceStep[],
  foundationSteps: readonly Cp003SolutionTraceStep[] = trace.foundationSteps,
  verificationSteps: readonly Cp003SolutionTraceStep[] = trace.verificationSteps,
): Cp003SolutionTrace {
  return Object.freeze({
    ...trace,
    coreSteps: Object.freeze([...coreSteps]),
    foundationSteps: Object.freeze([...foundationSteps]),
    verificationSteps: Object.freeze([...verificationSteps]),
  });
}

function withoutAnnualFactor(steps: readonly Cp003SolutionTraceStep[]): readonly Cp003SolutionTraceStep[] {
  return Object.freeze(steps.filter((step) => step.operationId !== "ANNUAL_FACTOR"));
}

export function buildCp003SolutionTrace(
  contract: Cp003QuestionContract,
  resolved: ResolvedState,
  solution: Rational,
): Cp003SolutionTrace {
  const trace = baseBuildCp003SolutionTrace(contract, resolved, solution);
  const representation = contract.presentation.representation;

  if (contract.qlId === "INT-QL-055" && representation === "GROWTH_RATIO") {
    const grounded = withoutAnnualFactor(trace.coreSteps);
    return rebuildTrace(trace, grounded, grounded);
  }

  if (contract.qlId === "INT-QL-056" && representation === "GROWTH_RATIO") {
    const grounded = withoutAnnualFactor(trace.coreSteps);
    return rebuildTrace(trace, grounded, grounded);
  }

  if (contract.qlId === "INT-QL-057") {
    const grounded = withoutAnnualFactor(trace.coreSteps);
    return rebuildTrace(trace, grounded, grounded);
  }

  if (contract.qlId === "INT-QL-061") {
    return rebuildTrace(trace, trace.coreSteps, trace.coreSteps, []);
  }

  return trace;
}
