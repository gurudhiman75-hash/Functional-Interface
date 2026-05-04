import type { Pattern } from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  normalizeNumericValue,
  renderExplanation,
} from "../shared";

export type QuantScenarioContext = {
  entity: string;
  metric: string;
  context: string;
};

type ReasoningStepLike = {
  detail: string;
};

// The quant realizer owns wording and explanation phrasing only.
// It does not change formulas or mutate pattern solvability.
export function realizeQuestion(
  scenario: QuantScenarioContext,
  values: Record<string, number>,
  topic: string,
  motif?: QuantMotif | null,
) {
  const normalized =
    topic.toLowerCase();
  if (
    motif?.id ===
    "reverse_percentage_inference"
  ) {
    return `After a ${values.p ?? 20}% increase, the ${scenario.metric} of a ${scenario.entity} became ${values.b}. Find the original value.`;
  }

  if (
    motif?.id ===
    "successive_percentage_change"
  ) {
    return `The ${scenario.metric} of a ${scenario.entity} first increased by ${values.p ?? 20}% and then decreased by ${values.q ?? 10}%.
 Find the net percentage change.`;
  }

  if (
    motif?.id ===
    "contribution_based_growth"
  ) {
    return `The ${scenario.metric} of three ${scenario.entity}s contributes ${values.a}, ${values.b}, and ${values.c}. Find the required percentage contribution or growth comparison.`;
  }

  if (
    motif?.id ===
    "ratio_redistribution"
  ) {
    return `The ratio for ${scenario.entity} is ${values.a}:${values.b}. After redistribution, find the required ratio-based value.`;
  }

  if (
    motif?.id ===
    "common_base_comparison"
  ) {
    return `Two ${scenario.entity} groups are given in the ratio ${values.a}:${values.b}. Compare them after converting to a common base.`;
  }

  if (
    motif?.id ===
    "conditional_ratio_filtering"
  ) {
    return `The ratio among ${scenario.entity} changes under a condition. Apply the condition carefully and find the required value.`;
  }

  if (
    normalized.includes(
      "percentage",
    )
  ) {
    return `The ${scenario.metric} of a ${scenario.entity} changed from ${values.a} to ${values.b}.
    

Find the percentage change.`;
  }
  if (
    normalized.includes(
      "ratio",
    )
  ) {
    return `The ratio between ${scenario.entity} is ${values.a}:${values.b}.

Find the simplified ratio.`;
  }

  return `Find the required value using ${values.a} and ${values.b}.`;
}

export function buildMotifAwareExplanation(
  pattern: Pattern,
  values: Record<string, number>,
  correctAnswer: number,
  motif: QuantMotif | null,
  reasoningSteps: ReasoningStepLike[],
) {
  const motifLead =
    motif?.inferenceStyle === "hidden"
      ? "Work backward from the hidden quantity."
      : motif?.inferenceStyle ===
          "conditional"
        ? "Apply the condition first, then compute the required value."
        : "Substitute the known values into the required relation.";

  if (pattern.explanationTemplate) {
    const renderedTemplate =
      renderExplanation(
        pattern.explanationTemplate,
        values,
        correctAnswer,
      );

    return `${motifLead} ${renderedTemplate}`;
  }

  const operationLead =
    reasoningSteps.length > 0
      ? `Steps: ${reasoningSteps
          .map((step) => step.detail)
          .join(" ")}`
      : "Use the given relation directly.";

  return `${motifLead} ${operationLead} Final answer = ${normalizeNumericValue(correctAnswer)}.`;
}
