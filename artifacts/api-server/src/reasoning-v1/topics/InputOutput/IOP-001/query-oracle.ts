import { renderTokenRow } from "./engine.ts";
import type { IopChildQuestion, IopMachineTrace } from "./types.ts";

function getStep(trace: IopMachineTrace, stepNumber: number) {
  const step = trace.steps.find((candidate) => candidate.stepNumber === stepNumber);
  if (!step) throw new Error(`Query oracle cannot find Step ${stepNumber}`);
  return step;
}

export function recomputeChildAnswer(trace: IopMachineTrace, child: IopChildQuestion): string {
  const evidence = child.evidence;
  switch (evidence.kind) {
    case "STEP_OUTPUT":
      return renderTokenRow(getStep(trace, evidence.stepNumber).tokens);
    case "ELEMENT_AT_POSITION": {
      const token = getStep(trace, evidence.stepNumber).tokens[evidence.position - 1];
      if (!token) throw new Error(`Query oracle position ${evidence.position} is outside the row`);
      return token.visibleValue;
    }
    case "POSITION_OF_ELEMENT": {
      const index = getStep(trace, evidence.stepNumber).tokens.findIndex((token) => token.id === evidence.tokenId);
      if (index < 0) throw new Error(`Query oracle cannot find token ${evidence.tokenId}`);
      return String(index + 1);
    }
    case "FINAL_OUTPUT":
      return renderTokenRow(trace.final);
  }
}

export function assertChildAnswerOracle(trace: IopMachineTrace, child: IopChildQuestion): void {
  const expected = recomputeChildAnswer(trace, child);
  if (expected !== child.answerDisplay) throw new Error(`Child answer oracle mismatch: ${expected} != ${child.answerDisplay}`);
  if (child.options[child.answerIndex]?.display !== expected) throw new Error("Child correct option does not match independent query oracle");
}
