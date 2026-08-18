import { renderAdvancedRow } from "./advanced-engine.ts";
import type { IopAdvancedQueryEvidence, IopAdvancedTrace } from "./advanced-types.ts";

function stateAt(trace: IopAdvancedTrace, stepNumber: number) {
  const step = trace.steps.find((candidate) => candidate.stepNumber === stepNumber);
  if (!step) throw new Error(`Unknown Step ${stepNumber}`);
  return step;
}

export function recomputeAdvancedQueryAnswer(trace: IopAdvancedTrace, evidence: IopAdvancedQueryEvidence): string {
  if (evidence.kind === "STEP_OUTPUT" || evidence.kind === "MISSING_STEP") {
    return renderAdvancedRow(stateAt(trace, evidence.stepNumber).tokens, trace.layout);
  }
  if (evidence.kind === "ELEMENT_AT_POSITION") {
    const token = stateAt(trace, evidence.stepNumber).tokens[evidence.position - 1];
    if (!token) throw new Error(`Position ${evidence.position} does not exist in Step ${evidence.stepNumber}`);
    return token.visibleValue;
  }
  if (evidence.kind === "STEP_NUMBER") {
    const step = trace.steps.find((candidate) => candidate.stateFingerprint === evidence.stateFingerprint);
    if (!step) throw new Error(`State ${evidence.stateFingerprint} does not occur in trace`);
    return `Step ${step.stepNumber}`;
  }
  if (evidence.kind === "FINAL_OUTPUT") return renderAdvancedRow(trace.final, trace.layout);
  if (evidence.kind === "PREVIOUS_STEP") {
    if (evidence.stepNumber <= 1) return renderAdvancedRow(trace.input, trace.layout);
    return renderAdvancedRow(stateAt(trace, evidence.stepNumber - 1).tokens, trace.layout);
  }
  return String(trace.steps.length - evidence.stepNumber);
}
