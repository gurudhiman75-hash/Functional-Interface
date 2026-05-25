import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type InterestFamilyId =
  | "int_si_from_prt"
  | "int_si_amount_from_prt"
  | "int_si_principal_from_si_rt"
  | "int_si_rate_from_si_pt"
  | "int_si_time_from_si_pr"
  | "int_si_difference_two_cases"
  | "int_si_sum_doubles"
  | "int_si_sum_triples"
  | "int_si_amount_ratio_time_gap"
  | "int_si_temporal_amount_gap"
  | "int_ci_amount_annual"
  | "int_ci_from_amount"
  | "int_ci_principal_from_amount"
  | "int_ci_rate_from_amount"
  | "int_ci_time_from_amount"
  | "int_ci_two_year_formula"
  | "int_ci_three_year_formula"
  | "int_ci_sum_doubles"
  | "int_ci_amount_multiplier_gap"
  | "int_ci_si_difference_2_years"
  | "int_ci_si_difference_3_years"
  | "int_rate_from_ci_si_diff_2y"
  | "int_principal_from_ci_si_diff_2y"
  | "int_hybrid_si_ci_crossover"
  | "int_si_ci_amount_difference"
  | "int_ci_half_yearly"
  | "int_ci_quarterly"
  | "int_ci_monthly"
  | "int_ci_annual_vs_half_yearly"
  | "int_ci_fractional_time_boundary"
  | "int_ci_specific_year_isolation"
  | "int_ci_nth_year_interest_from_principal"
  | "int_population_growth_ci"
  | "int_depreciation_ci"
  | "int_price_appreciation"
  | "int_machine_car_depreciation"
  | "int_successive_growth"
  | "int_successive_reduction"
  | "int_equal_annual_installments_ci"
  | "int_equal_half_yearly_installments_ci"
  | "int_loan_repayment_si"
  | "int_loan_repayment_ci"
  | "int_find_installment_amount"
  | "int_find_principal_from_installments"
  | "int_si_partial_discharge_timeline"
  | "int_different_rates_different_years_si"
  | "int_different_rates_different_years_ci"
  | "int_part_principal_two_rates_si"
  | "int_si_alligation_mixture"
  | "int_two_sums_same_interest"
  | "int_weighted_average_rate"
  | "int_true_discount"
  | "int_present_worth"
  | "int_bankers_discount"
  | "int_bankers_gain"
  | "int_bd_td_difference"
  | "int_bill_due_after_time"
  | "int_amount_ratio_find_rate_si"
  | "int_amount_ratio_find_time_si"
  | "int_amount_ratio_find_rate_ci"
  | "int_amount_ratio_find_time_ci"
  | "int_interest_more_by_rate_change"
  | "int_interest_more_by_time_change"
  | "int_si_calculated_on_amount_trap"
  | "int_ci_simple_addition_trap"
  | "int_wrong_period_conversion_trap"
  | "int_nominal_vs_effective_rate"
  | "int_interest_included_excluded_amount"
  | "int_compound_depreciation_repair_sale"
  | "int_partial_payment_before_final_amount"
  | "int_two_people_invest_same_rate"
  | "int_same_interest_different_sums_rates_times"
  | "int_divide_total_interest_between_investments"
  | "int_investment_ratio_from_interest"
  | "int_weighted_interest_income"
  | "int_ci_specific_year_rate_principal"
  | "int_si_ci_mixed_condition_inverse";

export type InterestAnswerKind = "amount" | "percent" | "rate" | "time" | "ratio";

export type InterestAnswerSemantic =
  | "simple_interest"
  | "compound_interest"
  | "amount"
  | "principal"
  | "rate"
  | "time"
  | "difference"
  | "installment"
  | "present_worth"
  | "bankers_discount"
  | "true_discount"
  | "bankers_gain"
  | "final_value"
  | "effective_rate"
  | "investment_ratio";

export type InterestContext = {
  en: string;
  hi: string;
  pa: string;
  pluralEn?: string;
  pluralHi?: string;
  pluralPa?: string;
};

export type InterestStep = {
  key: string;
  en: string;
  hi: string;
  pa: string;
  expression?: string;
  value?: number;
};

export type CanonicalInterestProblem = {
  id: string;
  topic: "interest";
  family: InterestFamilyId;
  subtype: InterestFamilyId;
  category: "interest";
  variables: Record<string, number>;
  answer: number;
  answerKind: InterestAnswerKind;
  answerSemantic: InterestAnswerSemantic;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced";
  topology: {
    family: string;
    variant: InterestFamilyId;
  };
  traps: string[];
  distractors: number[];
  context: InterestContext;
  customStem: {
    en: string;
    hi: string;
    pa: string;
  };
  customSteps: InterestStep[];
};

export type InterestRealization = {
  stem: {
    en: string;
    hi: string;
    pa: string;
  };
  explanation: {
    en: string;
    hi: string;
    pa: string;
  };
  steps: InterestStep[];
};

export type InterestMotifFactory = (input: {
  seed: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: InterestFamilyId;
}) => CanonicalInterestProblem;
