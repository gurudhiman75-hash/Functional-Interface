import type {
  CanonicalPercentageProblem,
  PercentageCategory,
  PercentageSubtype,
} from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";

export type StemIntentKey =
  | "stem.successive_change"
  | "stem.election_votes"
  | "stem.pass_fail_marks"
  | "stem.population_growth"
  | "stem.reverse_percentage"
  | "stem.restore_original"
  | "stem.salary_increment"
  | "stem.price_consumption"
  | "stem.shopkeeper_profit"
  | "stem.mixture_water_milk"
  | "stem.general_percentage";

export type ScenarioAnchor =
  | "quantity_change"
  | "election_votes"
  | "pass_fail_marks"
  | "population_growth"
  | "reverse_quantity"
  | "restore_price"
  | "salary_increase"
  | "fuel_consumption"
  | "shopkeeper_profit"
  | "mixture_water_milk"
  | "general_percentage";

export interface StemIntent {
  key: StemIntentKey;
  fallbackText: string;
  category: PercentageCategory;
  subtype: PercentageSubtype;
  topologyVariant?: string;
  scenarioAnchor: ScenarioAnchor;
  values: Record<string, number>;
}

function scenarioAnchor(problem: CanonicalPercentageProblem): ScenarioAnchor {
  switch (problem.subtype) {
    case "increase_then_decrease":
    case "successive_increase":
    case "successive_decrease":
    case "decrease_then_increase":
    case "net_change":
      return "quantity_change";
    case "election_margin":
    case "vote_share":
    case "invalid_votes":
      return "election_votes";
    case "pass_fail":
      return "pass_fail_marks";
    case "population_growth":
    case "population_decay":
    case "male_female_population":
      return "population_growth";
    case "reverse_percentage":
    case "part_whole":
      return "reverse_quantity";
    case "restore_original":
      return "restore_price";
    case "salary_revision":
    case "taxation":
    case "commission":
      return "salary_increase";
    case "price_consumption":
    case "fixed_expenditure":
      return "fuel_consumption";
    case "profit_loss":
    case "discount_markup":
      return "shopkeeper_profit";
    case "mixture_percentage":
      return "mixture_water_milk";
    default:
      return "general_percentage";
  }
}

function stemIntentKey(problem: CanonicalPercentageProblem): StemIntentKey {
  switch (problem.subtype) {
    case "increase_then_decrease":
    case "successive_increase":
    case "successive_decrease":
    case "decrease_then_increase":
    case "net_change":
      return "stem.successive_change";
    case "election_margin":
    case "vote_share":
    case "invalid_votes":
      return "stem.election_votes";
    case "pass_fail":
      return "stem.pass_fail_marks";
    case "population_growth":
    case "population_decay":
    case "male_female_population":
      return "stem.population_growth";
    case "reverse_percentage":
    case "part_whole":
      return "stem.reverse_percentage";
    case "restore_original":
      return "stem.restore_original";
    case "salary_revision":
    case "taxation":
    case "commission":
      return "stem.salary_increment";
    case "price_consumption":
    case "fixed_expenditure":
      return "stem.price_consumption";
    case "profit_loss":
    case "discount_markup":
      return "stem.shopkeeper_profit";
    case "mixture_percentage":
      return "stem.mixture_water_milk";
    default:
      return "stem.general_percentage";
  }
}

export function extractStemIntent(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
}): StemIntent {
  return {
    key: stemIntentKey(input.problem),
    fallbackText: input.editorial.stem,
    category: input.problem.category,
    subtype: input.problem.subtype,
    topologyVariant: input.problem.topology?.variant,
    scenarioAnchor: scenarioAnchor(input.problem),
    values: input.problem.variables,
  };
}
