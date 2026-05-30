import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type MixtureAlligationFamilyId =
  | "mix_two_price_blend_ratio"
  | "mix_two_items_find_ratio"
  | "mix_two_items_find_mean_price"
  | "mix_two_items_find_quantity"
  | "mix_two_items_find_missing_price"
  | "mix_three_items_weighted_average"
  | "mix_average_value_quantity_given"
  | "mix_average_value_ratio_given"
  | "mix_average_value_missing_quantity"
  | "mix_average_value_missing_rate"
  | "alligation_cheaper_dearer_ratio"
  | "alligation_mean_price_given"
  | "alligation_find_cost_price"
  | "alligation_find_selling_price"
  | "alligation_equal_quantity_average"
  | "alligation_unequal_quantity_average"
  | "alligation_successive_mixing"
  | "alligation_two_stage_mean"
  | "alligation_target_mean_quantity_added"
  | "alligation_remove_high_value_add_low_value"
  | "mix_milk_water_basic_ratio"
  | "mix_milk_water_find_water_added"
  | "mix_milk_water_find_milk_added"
  | "mix_milk_water_target_ratio"
  | "mix_milk_water_quantity_removed"
  | "replacement_single_operation"
  | "replacement_repeated_operation"
  | "replacement_find_original_quantity"
  | "replacement_find_replaced_quantity"
  | "replacement_final_purity"
  | "replacement_asymmetric_removal_fractions"
  | "replacement_double_replacement_third_liquid"
  | "dilution_water_added_to_solution"
  | "dilution_solution_removed_water_added"
  | "dilution_successive_replacement"
  | "dilution_find_number_of_operations"
  | "concentration_basic_percent"
  | "concentration_target_percent_by_adding_water"
  | "concentration_target_percent_by_adding_pure_substance"
  | "concentration_mixing_two_solutions"
  | "concentration_mixing_three_solutions"
  | "concentration_evaporation_increase_percent"
  | "concentration_water_evaporation"
  | "concentration_fresh_dry_weight_shift"
  | "mix_price_profit_basic"
  | "mix_price_profit_target_gain"
  | "mix_price_profit_target_loss"
  | "mix_cost_selling_price_alligation"
  | "mix_two_grades_of_rice"
  | "mix_two_grades_of_wheat"
  | "mix_tea_blend_average_price"
  | "mix_fuel_blend_average_price"
  | "dealer_dishonest_milk_water"
  | "dealer_false_weight_alligation"
  | "dealer_profit_by_mixing_water"
  | "dealer_profit_with_impurity"
  | "dealer_sells_mixture_at_cost_price"
  | "dealer_target_profit_after_adulteration"
  | "vessel_two_vessels_same_ratio"
  | "vessel_two_vessels_different_ratio"
  | "vessel_transfer_between_vessels"
  | "vessel_equalization_after_transfer"
  | "vessel_three_vessel_mixing"
  | "vessel_chain_mixing"
  | "vessel_chemical_concentration_equilibrium"
  | "mix_reverse_alligation"
  | "mix_difference_based_quantity"
  | "mix_ratio_change_after_addition"
  | "mix_ratio_change_after_removal"
  | "mix_ratio_change_after_replacement"
  | "mix_pure_component_extraction"
  | "mix_final_component_quantity"
  | "mix_compound_alligation_two_steps"
  | "mix_pyq_style_nested_mixture"
  | "mix_high_difficulty_constraint_system"
  | "mix_alligation_three_way_blend"
  | "alloy_metal_ratio_basic"
  | "alloy_metal_added_removed"
  | "alloy_mean_price_blend"
  | "alloy_density_matrix"
  | "mix_speed_distance_time_alligation"
  | "mix_partnership_capital_labor_alligation"
  | "mix_taxation_gst_bracket_blending"
  | "mix_geometric_density_fluid_strata"
  | "mix_average_score_weight_distribution"
  | "mix_symbolic_alligation_numeric"
  | "mix_clonable_boundary_edge_alligation";

export type MixtureAlligationAnswerKind = "quantity" | "ratio" | "price" | "percent" | "number";
export type MixtureAlligationAnswerUnit = "kg" | "litres" | "rupees" | "ratio" | "percent" | "density" | "none";

export type MixtureLocalizedText = { en: string; hi: string; pa: string };
export type MixtureExplanationStep = {
  key: string;
  text: MixtureLocalizedText;
  math?: string;
  value?: number | string;
};
export type MixtureExplanationBlock =
  | { type: "concept"; title: MixtureLocalizedText; body: MixtureLocalizedText }
  | { type: "given"; title: MixtureLocalizedText; items: MixtureLocalizedText[] }
  | { type: "diagram"; title: MixtureLocalizedText; html: MixtureLocalizedText }
  | { type: "working"; title: MixtureLocalizedText; steps: MixtureExplanationStep[] }
  | { type: "shortcut"; title: MixtureLocalizedText; body: MixtureLocalizedText; math?: string }
  | { type: "answer"; title: MixtureLocalizedText; body: MixtureLocalizedText };

export type MixtureSolverKind =
  | "alligation_ratio"
  | "weighted_mean"
  | "target_add_quantity"
  | "replacement_left"
  | "concentration_add_water"
  | "concentration_add_pure"
  | "evaporation"
  | "fresh_dry"
  | "dealer_profit_ratio"
  | "false_weight_profit"
  | "vessel_transfer"
  | "density_blend";

export type MixtureSolverModel = {
  kind: MixtureSolverKind;
  inputs: Record<string, unknown>;
};

export type MixturePreferredSolutionMethod =
  | "alligation_cross"
  | "direct_ratio_balancing"
  | "weighted_average"
  | "replacement_formula"
  | "conserved_solute"
  | "density_volume"
  | "dealer_profit"
  | "vessel_transfer";

export type MixtureAuditMeta = {
  seed: string;
  runId: string;
  motifId: MixtureAlligationFamilyId;
  topologyId: MixtureAlligationFamilyId;
  stemSkeleton: string;
  numericSignature: string;
  solverAnswer: string;
  explanationFinalAnswer: string;
  difficultyReason: string;
  realismScore: number;
  trapTypes: string[];
  preferredSolutionMethod: MixturePreferredSolutionMethod;
  questionTrivialityScore: number;
  reasoningStepCount: number;
};

export type CanonicalMixtureAlligationProblem = {
  id: string;
  topic: "mixture-alligation";
  motifId: MixtureAlligationFamilyId;
  family: MixtureAlligationFamilyId;
  topologyId: MixtureAlligationFamilyId;
  subtype: MixtureAlligationFamilyId;
  category: "mixture_alligation";
  principle: MixtureLocalizedText;
  formulaModel: string;
  preferredSolutionMethod: MixturePreferredSolutionMethod;
  questionTrivialityScore: number;
  reasoningStepCount: number;
  shortcut: MixtureLocalizedText;
  commonTraps: string[];
  variables: Record<string, unknown>;
  stemData: Record<string, unknown>;
  solverModel: MixtureSolverModel;
  answer: number | string;
  answerText: string;
  answerKind: MixtureAlligationAnswerKind;
  answerUnit: MixtureAlligationAnswerUnit;
  options: string[];
  correct: number;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced";
  topology: {
    family: "mixture_alligation";
    variant: MixtureAlligationFamilyId;
  };
  traps: string[];
  distractors: string[];
  explanationSteps: MixtureExplanationStep[];
  explanationBlocks: MixtureExplanationBlock[];
  conceptExplanation: MixtureLocalizedText;
  stepwiseExplanation: MixtureLocalizedText;
  shortcutExplanation: MixtureLocalizedText;
  localizationData: {
    stem: MixtureLocalizedText;
    explanation: MixtureLocalizedText;
    options: { en: string[]; hi: string[]; pa: string[] };
  };
  auditMeta: MixtureAuditMeta;
};

export type MixtureAlligationMotifFactory = (input: {
  seed: string;
  runId: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: MixtureAlligationFamilyId;
}) => CanonicalMixtureAlligationProblem;
