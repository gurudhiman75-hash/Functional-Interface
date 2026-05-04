import type { QuantMotif } from "../motifs/types";

export type ReasoningOperation =
  | "aggregate"
  | "average"
  | "filter"
  | "compare"
  | "transform"
  | "reverse"
  | "infer"
  | "rank"
  | "ratio"
  | "percentage"
  | "trend"
  | "cumulative"
  | "deviation"
  | "conditional-selection";

export type ReasoningStep = {
  operation: ReasoningOperation;
  detail: string;
};

export function createReasoningStep(
  operation: ReasoningOperation,
  detail: string,
): ReasoningStep {
  return {
    operation,
    detail,
  };
}

export function attachReasoningTrace<
  TQuestion extends object,
>(
  question: TQuestion,
  steps: ReasoningStep[],
  dependencyComplexity = steps.length,
  operationChain = steps.map(
    (step) => step.operation,
  ),
): TQuestion & {
  reasoningSteps: string[];
  dependencyComplexity: number;
  operationChain: ReasoningOperation[];
} {
  return {
    ...question,
    reasoningSteps: steps.map(
      (step) =>
        `${step.operation}: ${step.detail}`,
    ),
    dependencyComplexity,
    operationChain,
  };
}

export function alignReasoningStepsWithMotif(
  reasoningSteps: ReasoningStep[],
  motif: QuantMotif | null,
) {
  if (!motif) {
    return reasoningSteps;
  }

  const alignedSteps = [
    ...reasoningSteps,
  ];
  const hasPreferredSignal =
    alignedSteps.some((step) =>
      motif.preferredOperations.includes(
        step.operation,
      ),
    );

  if (!hasPreferredSignal) {
    const preferredOperation =
      motif.preferredOperations[0];

    if (preferredOperation) {
      alignedSteps.unshift(
        createReasoningStep(
          preferredOperation as ReasoningOperation,
          motif.inferenceStyle ===
            "hidden"
            ? "Identify the concealed base relation before computing the final value."
            : motif.inferenceStyle ===
                "conditional"
              ? "Apply the motif condition before evaluating the target quantity."
              : "Start from the direct relation highlighted in the motif.",
        ),
      );
    }
  }

  return alignedSteps;
}
