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
  | "part_whole"
  | "ratio_percentage"
  | "relational_percentage";

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
  "part_whole",
  "ratio_percentage",
  "relational_percentage",
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
