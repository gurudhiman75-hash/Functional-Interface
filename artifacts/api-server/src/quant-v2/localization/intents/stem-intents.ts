import type {
  CanonicalPercentageProblem,
  PercentageCategory,
  PercentageSubtype,
} from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import { detectCommercialAnchorKeyFromEnglish } from "../../semantic/anchorLexicon";

export type StemIntentKey =
  | "stem.successive_change"
  | "stem.election_votes"
  | "stem.pass_fail_marks"
  | "stem.population_growth"
  | "stem.reverse_percentage"
  | "stem.restore_original"
  | "stem.salary_increment"
  | "stem.price_consumption"
  | "stem.taxation"
  | "stem.commission"
  | "stem.shopkeeper_profit"
  | "stem.mixture_water_milk"
  | "stem.relational_percentage"
  | "stem.venn_diagram"
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
  | "relational_percentage"
  | "taxation"
  | "commission"
  | "advanced_percentage"
  | "general_percentage";

export interface StemIntent {
  key: StemIntentKey;
  fallbackText: string;
  category: PercentageCategory;
  subtype: PercentageSubtype;
  topologyVariant?: string;
  scenarioAnchor: ScenarioAnchor;
  semanticAnchorKey?: string;
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
      return "salary_increase";
    case "taxation":
      return "taxation";
    case "commission":
      return "commission";
    case "perc_geom_dimensional_scale":
    case "perc_demo_cross_tab_literacy":
    case "perc_budget_cascading_remainder":
    case "perc_const_absolute_offset":
    case "perc_exam_weighted_aggregate":
    case "perc_asset_variable_depreciation":
    case "perc_workforce_hierarchical_attrition":
    case "perc_elect_three_candidate_forfeiture":
    case "perc_agri_land_yield_compound":
    case "perc_demo_multi_factor_growth":
    case "perc_comm_tiered_salary_override":
    case "perc_asset_compound_leakage":
    case "perc_num_linear_equation_balancing":
    case "perc_num_fractional_perturbation_complex":
    case "perc_tax_bracket_retained_income":
    case "perc_num_square_proportional_delta":
    case "perc_mix_alloy_replacement":
      return "advanced_percentage";
    case "price_consumption":
    case "fixed_expenditure":
      return "fuel_consumption";
    case "profit_loss":
    case "discount_markup":
      return "shopkeeper_profit";
    case "mixture_percentage":
      return "mixture_water_milk";
    case "relational_percentage":
      return "relational_percentage";
    case "venn_diagram":
      return "general_percentage";
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
      return "stem.salary_increment";
    case "taxation":
      return "stem.taxation";
    case "commission":
      return "stem.commission";
    case "price_consumption":
    case "fixed_expenditure":
      return "stem.price_consumption";
    case "profit_loss":
    case "discount_markup":
      return "stem.shopkeeper_profit";
    case "mixture_percentage":
      return "stem.mixture_water_milk";
    case "relational_percentage":
      return "stem.relational_percentage";
    case "venn_diagram":
      return "stem.venn_diagram";
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
    semanticAnchorKey: detectCommercialAnchorKeyFromEnglish(
      input.editorial.stem,
    ),
    values: input.problem.variables,
  };
}
