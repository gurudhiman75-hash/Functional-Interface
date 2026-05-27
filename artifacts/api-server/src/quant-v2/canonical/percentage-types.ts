export type RealizerLanguage =
  | "en"
  | "hi"
  | "pa";

export type Trap =
  | "simple_addition"
  | "wrong_base"
  | "reverse_direction"
  | "margin_confusion"
  | "same_percentage_assumption"
  | "ignoring_invalid_votes"
  | "wrong_denominator"
  | "forgetting_filtering_stage"
  | "additive_instead_of_multiplicative"
  | "ignoring_remaining_component"
  | "ratio_confusion"
  | "direct_percentage_mapping"
  | "incorrect_inversion"
  | "normalization_error"
  | "transitive_shortcut_error";

export type Difficulty =
  | "easy"
  | "medium"
  | "hard";

export type PercentageCategory =
  | "base_change"
  | "comparison"
  | "ratio_mapping"
  | "population"
  | "finance"
  | "mixture"
  | "commercial"
  | "expenditure"
  | "election"
  | "growth_decay"
  | "data_interpretation"
  | "probability_percentage";

export type PercentageSubtype =
  | "successive_increase"
  | "successive_decrease"
  | "increase_then_decrease"
  | "decrease_then_increase"
  | "net_change"
  | "election_margin"
  | "vote_share"
  | "pass_fail"
  | "salary_revision"
  | "population_growth"
  | "population_decay"
  | "price_consumption"
  | "fixed_expenditure"
  | "profit_loss"
  | "discount_markup"
  | "reverse_percentage"
  | "restore_original"
  | "mixture_percentage"
  | "male_female_population"
  | "survey_percentage"
  | "invalid_votes"
  | "taxation"
  | "commission"
  | "venn_diagram"
  | "part_whole"
  | "ratio_percentage"
  | "relational_percentage"
  | "perc_geom_dimensional_scale"
  | "perc_demo_cross_tab_literacy"
  | "perc_budget_cascading_remainder"
  | "perc_const_absolute_offset"
  | "perc_exam_weighted_aggregate"
  | "perc_asset_variable_depreciation"
  | "perc_workforce_hierarchical_attrition"
  | "perc_elect_three_candidate_forfeiture"
  | "perc_agri_land_yield_compound"
  | "perc_demo_multi_factor_growth"
  | "perc_comm_tiered_salary_override"
  | "perc_asset_compound_leakage"
  | "perc_num_linear_equation_balancing"
  | "perc_num_fractional_perturbation_complex"
  | "perc_tax_bracket_retained_income"
  | "perc_num_square_proportional_delta"
  | "perc_mix_alloy_replacement";

export type ReasoningPattern =
  | "compound_shift"
  | "reverse_reconstruction"
  | "difference_mapping"
  | "fixed_base_relation"
  | "ratio_to_percentage"
  | "successive_base_change"
  | "population_projection"
  | "margin_mapping"
  | "weighted_average"
  | "mixture_balance"
  | "relational_chain";

export interface CanonicalPercentageProblem {
  id: string;
  concept: "percentage";
  category: PercentageCategory;
  subtype: PercentageSubtype;
  reasoningPattern: ReasoningPattern;
  variables: Record<string, number>;
  answer: number;
  distractors: number[];
  traps: Trap[];
  difficulty: Difficulty;
  topology?: import("../reasoning/topology-types").TopologyMetadata;
  visual?: PercentageVisualPayload;
}

export type PercentageVisualPayload = PercentageVennVisualPayload;

export interface PercentageVennVisualPayload {
  type: "venn";
  sets: [
    {
      id: "A";
      label: string;
      value: number;
    },
    {
      id: "B";
      label: string;
      value: number;
    },
  ];
  intersection: number;
  universe: number;
  outside: number;
  unit: "%";
  regions: {
    onlyA: number;
    onlyB: number;
    both: number;
    neither: number;
  };
  labels: {
    en: {
      onlyA: string;
      onlyB: string;
      both: string;
      neither: string;
      universe: string;
    };
    hi: {
      onlyA: string;
      onlyB: string;
      both: string;
      neither: string;
      universe: string;
    };
    pa: {
      onlyA: string;
      onlyB: string;
      both: string;
      neither: string;
      universe: string;
    };
  };
  svg?: string;
}

export const PERCENTAGE_CATEGORIES: readonly PercentageCategory[] = [
  "base_change",
  "comparison",
  "ratio_mapping",
  "population",
  "finance",
  "mixture",
  "commercial",
  "expenditure",
  "election",
  "growth_decay",
  "data_interpretation",
  "probability_percentage",
];

export const PERCENTAGE_SUBTYPES: readonly PercentageSubtype[] = [
  "successive_increase",
  "successive_decrease",
  "increase_then_decrease",
  "decrease_then_increase",
  "net_change",
  "election_margin",
  "vote_share",
  "pass_fail",
  "salary_revision",
  "population_growth",
  "population_decay",
  "price_consumption",
  "fixed_expenditure",
  "profit_loss",
  "discount_markup",
  "reverse_percentage",
  "restore_original",
  "mixture_percentage",
  "male_female_population",
  "survey_percentage",
  "invalid_votes",
  "taxation",
  "commission",
  "venn_diagram",
  "part_whole",
  "ratio_percentage",
  "relational_percentage",
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_budget_cascading_remainder",
  "perc_const_absolute_offset",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_elect_three_candidate_forfeiture",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_comm_tiered_salary_override",
  "perc_asset_compound_leakage",
  "perc_num_linear_equation_balancing",
  "perc_num_fractional_perturbation_complex",
  "perc_tax_bracket_retained_income",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
];

export const REASONING_PATTERNS: readonly ReasoningPattern[] = [
  "compound_shift",
  "reverse_reconstruction",
  "difference_mapping",
  "fixed_base_relation",
  "ratio_to_percentage",
  "successive_base_change",
  "population_projection",
  "margin_mapping",
  "weighted_average",
  "mixture_balance",
  "relational_chain",
];

export const TRAPS: readonly Trap[] = [
  "simple_addition",
  "wrong_base",
  "reverse_direction",
  "margin_confusion",
  "same_percentage_assumption",
  "ignoring_invalid_votes",
  "wrong_denominator",
  "forgetting_filtering_stage",
  "additive_instead_of_multiplicative",
  "ignoring_remaining_component",
  "ratio_confusion",
  "direct_percentage_mapping",
  "incorrect_inversion",
  "normalization_error",
  "transitive_shortcut_error",
];

export const DIFFICULTIES: readonly Difficulty[] = [
  "easy",
  "medium",
  "hard",
];
