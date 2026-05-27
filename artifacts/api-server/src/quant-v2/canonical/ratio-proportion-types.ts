import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type RatioProportionFamilyId =
  | "rp_direct_sharing"
  | "rp_sum_based_ratio_recovery"
  | "rp_difference_based_ratio_recovery"
  | "rp_missing_term_proportion"
  | "rp_ratio_to_fraction"
  | "rp_fraction_to_ratio"
  | "rp_ratio_after_increase"
  | "rp_ratio_after_decrease"
  | "rp_ratio_after_transfer"
  | "rp_age_future_ratio"
  | "rp_age_past_ratio"
  | "rp_partnership_basic"
  | "rp_partnership_time_variation"
  | "rp_direct_variation_basic"
  | "rp_inverse_variation_basic"
  | "rp_joint_variation"
  | "rp_combined_direct_inverse"
  | "rp_map_scale_ratio"
  | "rp_side_area_volume_ratio"
  | "rp_chain_ratio_network"
  | "rp_equivalent_ratio_generation"
  | "rp_ratio_to_percentage"
  | "rp_percentage_to_ratio"
  | "rp_product_based_ratio_recovery"
  | "rp_partial_value_ratio_recovery"
  | "rp_ratio_after_exchange"
  | "rp_ratio_restoration"
  | "rp_reverse_ratio_scaling"
  | "rp_age_difference_constant"
  | "rp_age_multi_generation"
  | "rp_partnership_partial_exit"
  | "rp_partnership_profit_distribution"
  | "rp_population_gender_ratio"
  | "rp_voter_turnout_ratio"
  | "rp_marks_distribution_ratio"
  | "rp_recipe_scaling_ratio"
  | "rp_blueprint_scaling"
  | "rp_shadow_height_ratio"
  | "rp_similarity_scaling"
  | "rp_weighted_ratio_balancing"
  | "rp_multi_equation_ratio"
  | "rp_ratio_graph_deduction"
  | "rp_circular_ratio_dependency"
  | "rp_hidden_total_trap"
  | "rp_fractional_distribution_chain"
  | "rp_variable_power_variation"
  | "rp_workforce_inverse_variation"
  | "rp_speed_distance_inverse"
  | "rp_inventory_allocation"
  | "rp_liquid_replacement_ratio";

export type RatioProportionAnswerKind =
  | "amount"
  | "number"
  | "ratio"
  | "fraction"
  | "distance"
  | "years"
  | "days"
  | "hours"
  | "percent";

export type RatioProportionAnswerUnit =
  | "none"
  | "rupees"
  | "students"
  | "items"
  | "marks"
  | "seats"
  | "years"
  | "days"
  | "hours"
  | "cm"
  | "km"
  | "m"
  | "percent"
  | "ratio"
  | "fraction";

export type RatioProportionLocalizedText = {
  en: string;
  hi: string;
  pa: string;
};

export type RatioProportionExplanationStep = {
  key: string;
  text: RatioProportionLocalizedText;
  math?: string;
  value?: number | string;
};

export type RatioProportionAuditMeta = {
  seed: string;
  runId: string;
  motifId: RatioProportionFamilyId;
  topologyId: RatioProportionFamilyId;
  stemSkeleton: string;
  numericSignature: string;
  solverAnswer: string;
  explanationFinalAnswer: string;
  difficultyReason: string;
  realismScore: number;
  trapTypes: string[];
};

export type CanonicalRatioProportionProblem = {
  id: string;
  topic: "ratio-proportion";
  motifId: RatioProportionFamilyId;
  family: RatioProportionFamilyId;
  topologyId: RatioProportionFamilyId;
  subtype: RatioProportionFamilyId;
  category: "ratio_proportion";
  variables: Record<string, number | string>;
  stemData: Record<string, number | string>;
  answer: number | string;
  answerText: string;
  answerKind: RatioProportionAnswerKind;
  answerUnit: RatioProportionAnswerUnit;
  options: string[];
  correct: number;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced";
  topology: {
    family: "ratio_proportion";
    variant: RatioProportionFamilyId;
  };
  traps: string[];
  distractors: string[];
  explanationSteps: RatioProportionExplanationStep[];
  localizationData: {
    stem: RatioProportionLocalizedText;
    explanation: RatioProportionLocalizedText;
    options: {
      en: string[];
      hi: string[];
      pa: string[];
    };
  };
  auditMeta: RatioProportionAuditMeta;
};

export type RatioProportionMotifFactory = (input: {
  seed: string;
  runId: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: RatioProportionFamilyId;
}) => CanonicalRatioProportionProblem;
