import type { ScenarioContext } from "./scenario-generator";

export function realizeQuestion(
  scenario: ScenarioContext,
  values: Record<string, number>,
  topic: string,
) {
  const normalized =
    topic.toLowerCase();

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