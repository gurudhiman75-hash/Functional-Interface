import type { AlpExplanation, GeneratedAlpQuestion } from "./types";

export interface AlpLearnerExplanation {
  readonly schemaVersion: "ALP-001-LEARNER-EXPLANATION-V1";
  readonly coreConcept: string;
  readonly steps: readonly string[];
  readonly visualWorking: readonly string[];
  readonly conclusion: string;
}

export function toAlpLearnerExplanation(explanation: AlpExplanation): AlpLearnerExplanation {
  return {
    schemaVersion: "ALP-001-LEARNER-EXPLANATION-V1",
    coreConcept: explanation.coreConcept,
    steps: explanation.steps,
    visualWorking: explanation.visualWorking,
    conclusion: explanation.conclusion,
  };
}

export function toAlpReviewQuestion<T extends GeneratedAlpQuestion>(question: T): Omit<T, "explanation"> & { readonly explanation: AlpLearnerExplanation } {
  return {
    ...question,
    explanation: toAlpLearnerExplanation(question.explanation),
  };
}
