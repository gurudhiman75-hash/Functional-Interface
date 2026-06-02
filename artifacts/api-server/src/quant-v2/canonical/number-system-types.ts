import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type NumberSystemFamilyId =
  | "ns_missing_digit_single_rule"
  | "ns_missing_digit_multi_rule"
  | "ns_reverse_divisibility"
  | "ns_divisibility_multi_condition"
  | "ns_divisibility_range_count"
  | "ns_large_expression_divisibility"
  | "ns_divisibility_lcm_bridge"
  | "ns_hidden_divisor_deduction"
  | "ns_prime_factorization"
  | "ns_hidden_prime_exponent"
  | "ns_prime_composite_deduction"
  | "ns_factor_count_basic"
  | "ns_factor_count_constraint"
  | "ns_exact_divisor_count"
  | "ns_odd_even_divisor_count"
  | "ns_sum_of_divisors"
  | "ns_product_of_divisors"
  | "ns_hcf_lcm_relation"
  | "ns_three_number_hcf_lcm"
  | "ns_hidden_hcf"
  | "ns_hidden_lcm"
  | "ns_fraction_hcf_lcm"
  | "ns_hcf_lcm_word_problem"
  | "ns_schedule_alignment"
  | "ns_minimum_common_multiple"
  | "ns_remainder_after_division"
  | "ns_remainder_after_power"
  | "ns_modular_cycle"
  | "ns_nested_remainder"
  | "ns_remainder_pattern"
  | "ns_remainder_reconstruction"
  | "ns_remainder_factor_hybrid"
  | "ns_remainder_range_count"
  | "ns_unit_digit_cycle"
  | "ns_last_two_digits"
  | "ns_last_three_digits"
  | "ns_expression_last_digit"
  | "ns_power_tower_digit"
  | "ns_cycle_length_detection"
  | "ns_sum_of_digits"
  | "ns_number_of_digits"
  | "ns_digit_interchange"
  | "ns_digit_formation"
  | "ns_digit_constraints"
  | "ns_unknown_digit_equation"
  | "ns_digit_sum_reconstruction"
  | "ns_consecutive_digit_number"
  | "ns_trailing_zeroes"
  | "ns_highest_power_dividing"
  | "ns_factorial_divisibility"
  | "ns_factorial_remainder"
  | "ns_factorial_factor_count"
  | "ns_modular_arithmetic"
  | "ns_cyclic_pattern"
  | "ns_prime_remainder_hybrid"
  | "ns_factor_hcf_hybrid"
  | "ns_hidden_number_theory"
  | "ns_multi_cluster_reasoning"
  | "ns_least_number_constraint"
  | "ns_greatest_number_constraint"
  | "ns_minimum_addition"
  | "ns_minimum_subtraction"
  | "ns_minimum_multiplier"
  | "ns_minimum_divisor"
  | "ns_smallest_divisible_number"
  | "ns_largest_valid_number"
  | "ns_range_optimization"
  | "ns_multi_condition_optimization"
  | "ns_perfect_square_completion"
  | "ns_perfect_cube_completion"
  | "ns_least_square_multiple"
  | "ns_least_cube_multiple"
  | "ns_square_factor_constraint"
  | "ns_cube_factor_constraint"
  | "ns_square_remainder_hybrid"
  | "ns_square_divisibility_hybrid"
  | "ns_square_factor_count_hybrid"
  | "ns_hidden_number_reconstruction"
  | "ns_hidden_divisor_reconstruction"
  | "ns_hidden_exponent_reconstruction"
  | "ns_hidden_factorization_reconstruction"
  | "ns_hidden_square_reconstruction"
  | "ns_multi_condition_reconstruction"
  | "ns_reverse_number_theory"
  | "ns_prime_hcf_lcm_optimization"
  | "ns_digit_divisibility_reconstruction"
  | "ns_remainder_constraint_optimization"
  | "ns_factor_count_square_hidden"
  | "ns_prime_exact_divisor_optimization"
  | "ns_modular_cycle_reconstruction"
  | "ns_digit_divisibility_hcf_verification";

export type NumberSystemAliasFamilyId =
  | "ns_missing_digit_divisibility"
  | "ns_two_missing_digits_divisibility"
  | "ns_last_digit_power"
  | "ns_last_two_digits_power"
  | "ns_hcf_lcm_product_relation"
  | "ns_trailing_zeros_factorial"
  | "ns_highest_power_in_factorial";

export type NumberSystemArchetype =
  | "forward"
  | "reverse"
  | "hidden_variable"
  | "constraint"
  | "optimization"
  | "reconstruction"
  | "deduction"
  | "multi_stage"
  | "hybrid";

export type NumberSystemPreferredSolutionMethod =
  | "DIVISIBILITY_RULE_METHOD"
  | "PRIME_FACTORIZATION_METHOD"
  | "EXPONENT_TRACKING_METHOD"
  | "FACTOR_COUNT_METHOD"
  | "HCF_LCM_RELATION_METHOD"
  | "MODULAR_CYCLE_METHOD"
  | "LAST_DIGIT_CYCLE_METHOD"
  | "DIGITAL_ROOT_METHOD"
  | "TRAILING_ZERO_METHOD"
  | "HIGHEST_POWER_METHOD"
  | "DIGIT_EQUATION_METHOD"
  | "OPTIMIZATION_CONSTRAINT_METHOD"
  | "PERFECT_POWER_COMPLETION_METHOD"
  | "RECONSTRUCTION_METHOD"
  | "ELITE_HYBRID_CHAIN_METHOD";

export type NumberSystemAnswerUnit = "number" | "digit" | "count" | "remainder" | "factor" | "none";
export type NumberSystemLocalizedText = { en: string; hi: string; pa: string };

export type NumberSystemExplanationStep = {
  key: string;
  text: NumberSystemLocalizedText;
  math?: string;
  value?: number | string;
};

export type NumberSystemSolverKind =
  | "missing_digit"
  | "divisibility_count"
  | "prime_factorization"
  | "factor_count"
  | "hcf_lcm"
  | "remainder"
  | "last_digit"
  | "digit_logic"
  | "factorial"
  | "modular_hybrid"
  | "optimization_constraint"
  | "perfect_power_completion"
  | "reconstruction"
  | "elite_hybrid_chain";

export type NumberSystemSolverModel = {
  kind: NumberSystemSolverKind;
  inputs: Record<string, unknown>;
};

export type NumberSystemAuditMeta = {
  seed: string;
  runId: string;
  familyId: NumberSystemFamilyId;
  topologyId: NumberSystemFamilyId;
  situationId?: string;
  stemArchetype?: string;
  shortcutPatternId?: string;
  topologyDepth?: number;
  eliteTier?: boolean;
  familyDiversityBucket?: string;
  situationDiversityBucket?: string;
  sscAuthenticityScore?: number;
  bankingAuthenticityScore?: number;
  punjabAuthenticityScore?: number;
  stemSkeleton: string;
  numericSignature: string;
  solverAnswer: string;
  explanationFinalAnswer: string;
  difficultyReason: string;
  realismScore: number;
  trapTypes: string[];
  preferredSolutionMethod: NumberSystemPreferredSolutionMethod;
  questionTrivialityScore: number;
  reasoningStepCount: number;
};

export type CanonicalNumberSystemProblem = {
  id: string;
  topic: "number-system";
  motifId: NumberSystemFamilyId;
  family: NumberSystemFamilyId;
  topologyId: NumberSystemFamilyId;
  subtype: NumberSystemFamilyId;
  category: "number_system";
  archetype: NumberSystemArchetype;
  principle: NumberSystemLocalizedText;
  formulaModel: string;
  preferredSolutionMethod: NumberSystemPreferredSolutionMethod;
  entities: Record<string, unknown>;
  relationships: string[];
  constraints: string[];
  hiddenVariables: Record<string, unknown>;
  derivedVariables: Record<string, unknown>;
  target: string;
  reasoningDepth: number;
  questionTrivialityScore: number;
  realismScore: number;
  qualityMetadata: Record<string, unknown>;
  variables: Record<string, unknown>;
  stemData: Record<string, unknown>;
  solverModel: NumberSystemSolverModel;
  answer: number | string;
  answerText: string;
  answerUnit: NumberSystemAnswerUnit;
  options: string[];
  correct: number;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced" | "elite";
  topology: { family: "number_system"; variant: NumberSystemFamilyId };
  traps: string[];
  distractors: string[];
  explanationSteps: NumberSystemExplanationStep[];
  conceptExplanation: NumberSystemLocalizedText;
  stepwiseExplanation: NumberSystemLocalizedText;
  shortcutExplanation: NumberSystemLocalizedText;
  localizationData: {
    stem: NumberSystemLocalizedText;
    explanation: NumberSystemLocalizedText;
    options: { en: string[]; hi: string[]; pa: string[] };
  };
  auditMeta: NumberSystemAuditMeta;
};

export type NumberSystemMotifFactory = (input: {
  seed: string;
  runId: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: NumberSystemFamilyId;
}) => CanonicalNumberSystemProblem;
