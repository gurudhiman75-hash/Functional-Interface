import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type ProfitLossFamilyId =
  | "pl_cp_sp_percent"
  | "pl_cp_percent_to_sp"
  | "pl_sp_percent_to_cp"
  | "pl_mp_discount_to_sp"
  | "pl_mp_sp_discount_percent"
  | "pl_cp_mp_discount_to_percent"
  | "pl_successive_discounts"
  | "pl_mp_for_target_profit"
  | "pl_equal_sp_profit_loss"
  | "pl_two_article_overall"
  | "pl_no_profit_no_loss"
  | "pl_asymmetric_item_equivalence"
  | "pl_fractional_value_shift"
  | "pl_markup_discount_triangle"
  | "pl_target_profit_discount_calibration"
  | "pl_target_profit_mp_calibration"
  | "pl_successive_discount_equivalent"
  | "pl_dual_item_identical_sp"
  | "pl_dual_item_mixed_baseline"
  | "pl_partial_inventory_allocation"
  | "pl_sequential_supply_chain"
  | "pl_supply_chain_mixed_profit_loss"
  | "pl_compound_error_baseline_shift"
  | "pl_dishonest_dealer_weight_fraud"
  | "pl_dishonest_dealer_dual_fraud"
  | "pl_dishonest_dealer_absolute_hybrid"
  | "pl_buy_get_free_discount"
  | "pl_hybrid_promotion_scaling"
  | "pl_cashback_coupon_discount"
  | "pl_gst_after_discount"
  | "pl_tax_inclusive_back_calc"
  | "pl_profit_after_commission_tax"
  | "pl_repair_overhead_cost"
  | "pl_required_sp_after_overhead"
  | "pl_manufacturing_breakdown"
  | "pl_loss_recovery_cp_from_difference"
  | "pl_required_sp_after_loss"
  | "pl_sp_difference_two_rates"
  | "pl_equal_profit_loss_amount"
  | "pl_same_profit_amount_different_rates"
  | "pl_inverse_cp_from_mp_discount_profit"
  | "pl_inverse_discount_from_cp_mp_profit"
  | "pl_inverse_markup_from_cp_discount_profit"
  | "pl_multi_condition_inverse_absolute";

export type ProfitLossAnswerKind =
  | "amount"
  | "percent";

export type ProfitLossSemanticAnswer =
  | "profit_percent"
  | "loss_percent"
  | "selling_price"
  | "cost_price"
  | "discount_percent"
  | "markup_percent"
  | "marked_price"
  | "overall_profit_percent"
  | "overall_loss_percent"
  | "no_profit_no_loss"
  | "effective_discount_percent"
  | "final_bill"
  | "net_profit_percent"
  | "profit_amount"
  | "loss_amount"
  | "ratio";

export type CanonicalProfitLossProblem = {
  id: string;
  topic: "profit_loss_discount";
  family: ProfitLossFamilyId;
  subtype: ProfitLossFamilyId;
  category: "profit_loss_discount";
  variables: Record<string, number>;
  answer: number;
  answerKind: ProfitLossAnswerKind;
  answerSemantic: ProfitLossSemanticAnswer;
  difficulty: Lowercase<DifficultyLabel>;
  topology: {
    family: string;
    variant: ProfitLossFamilyId;
  };
  traps: string[];
  distractors: number[];
  object: {
    en: string;
    pluralEn: string;
    hi: string;
    pluralHi: string;
    pa: string;
    pluralPa: string;
  };
  customStem?: {
    en: string;
    hi: string;
    pa: string;
  };
  customSteps?: ProfitLossStep[];
};

export type ProfitLossStep = {
  key: string;
  en: string;
  hi: string;
  pa: string;
  expression?: string;
  value?: number;
};

export type ProfitLossRealization = {
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
  steps: ProfitLossStep[];
};

export type ProfitLossMotifFactory = (input: {
  seed: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: ProfitLossFamilyId;
}) => CanonicalProfitLossProblem;
