import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { createProblemSignature } from "../utils/problem-signature";
import type { ScenarioContext } from "./editorial-types";
import { hashText } from "./phrase-rotation";

export type ContextualGrounding = {
  opening: string;
  subject: string;
  objectNoun: string;
  scenarioAnchor: string;
  stemPatternId: string;
};

const GROUNDINGS = {
  increase_then_decrease: [
    {
      opening: "Product price",
      subject: "the price",
      objectNoun: "price",
      anchor: "product_price_change",
      pattern: "product_price_change",
    },
    {
      opening: "The marked price",
      subject: "the marked price",
      objectNoun: "price",
      anchor: "marked_price_change",
      pattern: "marked_price_change",
    },
  ],
  reverse_percentage: [
    {
      opening: "In a coaching institute test",
      subject: "the marks scored",
      objectNoun: "marks",
      anchor: "reverse_marks",
      pattern: "test_marks_reverse",
    },
    {
      opening: "In a district census report",
      subject: "the counted population",
      objectNoun: "population",
      anchor: "reverse_population",
      pattern: "district_census_reverse",
    },
  ],
  restore_original: [
    {
      opening: "Marked price",
      subject: "marked price",
      objectNoun: "price",
      anchor: "restore_marked_price",
      pattern: "machine_price_restore",
    },
    {
      opening: "Salary",
      subject: "salary",
      objectNoun: "salary",
      anchor: "restore_salary",
      pattern: "salary_restore",
    },
  ],
  salary_revision: [
    {
      opening: "Salary",
      subject: "salary",
      objectNoun: "salary",
      anchor: "salary_increase",
      pattern: "employee_salary_revision",
    },
  ],
  price_consumption: [
    {
      opening: "Fuel price",
      subject: "fuel price",
      objectNoun: "consumption",
      anchor: "fuel_consumption",
      pattern: "fuel_consumption",
    },
  ],
  profit_loss: [
    {
      opening: "A shopkeeper sold a product",
      subject: "the product",
      objectNoun: "price",
      anchor: "shopkeeper_profit",
      pattern: "shopkeeper_product_profit_loss",
    },
  ],
  mixture_percentage: [
    {
      opening: "In a milk-water mixture",
      subject: "the mixture",
      objectNoun: "quantity",
      anchor: "mixture_water_milk",
      pattern: "milk_water_mixture",
    },
  ],
} as const;

function pickIndex(seed: number | string | undefined, key: string, length: number) {
  return hashText(`${seed ?? ""}|${key}`) % length;
}

export function selectContextualGrounding(input: {
  problem: CanonicalPercentageProblem;
  scenario: ScenarioContext;
  seed?: number | string;
}): ContextualGrounding {
  const signature = createProblemSignature(input.problem);
  const options =
    GROUNDINGS[input.problem.subtype as keyof typeof GROUNDINGS];

  if (!options) {
    return {
      opening: input.scenario.opening,
      subject: input.scenario.entityLabel,
      objectNoun: input.scenario.domainNoun,
      scenarioAnchor: input.scenario.family,
      stemPatternId: `${input.problem.subtype}:scenario_default`,
    };
  }

  const selected = options[
    pickIndex(
      input.seed,
      `${signature}|${input.problem.subtype}|grounding`,
      options.length,
    )
  ]!;

  return {
    opening: selected.opening,
    subject: selected.subject,
    objectNoun: selected.objectNoun,
    scenarioAnchor: selected.anchor,
    stemPatternId: `${input.problem.subtype}:${selected.pattern}`,
  };
}
