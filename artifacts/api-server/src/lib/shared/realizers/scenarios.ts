import { pickRandomItem } from "../randomness";

export type ScenarioContext = {
  entity: string;
  metric: string;
  context: string;
};

const PERCENTAGE_SCENARIOS: ScenarioContext[] = [
  {
    entity: "company",
    metric: "revenue",
    context: "growth",
  },
  {
    entity: "factory",
    metric: "production",
    context: "increase",
  },
  {
    entity: "school",
    metric: "student strength",
    context: "change",
  },
  {
    entity: "country",
    metric: "exports",
    context: "growth",
  },
];

const RATIO_SCENARIOS: ScenarioContext[] = [
  {
    entity: "boys and girls",
    metric: "students",
    context: "distribution",
  },
  {
    entity: "red and blue balls",
    metric: "selection",
    context: "ratio",
  },
];

export function generateScenario(
  topic: string,
): ScenarioContext {
  const normalized =
    topic.toLowerCase();

  if (
    normalized.includes(
      "percentage",
    )
  ) {
    return pickRandomItem(
      PERCENTAGE_SCENARIOS,
    );
  }

  if (
    normalized.includes(
      "ratio",
    )
  ) {
    return pickRandomItem(
      RATIO_SCENARIOS,
    );
  }

  return {
    entity: "company",
    metric: "value",
    context: "change",
  };
}
