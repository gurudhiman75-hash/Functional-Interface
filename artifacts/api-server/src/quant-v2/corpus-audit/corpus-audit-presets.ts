import type { CorpusAuditPreset, CorpusAuditPresetId } from "./corpus-audit-types";
import { PROFIT_LOSS_FAMILY_IDS } from "../canonical/profit-loss-motif-factories";

export const CORPUS_AUDIT_PRESETS: readonly CorpusAuditPreset[] = [
  {
    id: "ssc_percentage_audit",
    label: "SSC Percentage Audit",
    description:
      "Balanced English/Hindi/Punjabi percentage corpus for SSC-style realism review.",
    defaultCount: 1000,
    examProfile: "ssc",
    seedPrefix: "ssc-percentage-audit",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "profit_loss_audit",
    label: "Profit, Loss & Discount Audit",
    description:
      "Comprehensive Profit, Loss & Discount corpus with CP/SP/MP, discount, promotion, GST, fraud, inventory, overhead, and inverse families.",
    defaultCount: 1000,
    examProfile: "ssc",
    seedPrefix: "profit-loss-audit",
    forcedMotifIds: [...PROFIT_LOSS_FAMILY_IDS],
    languages: ["en", "hi", "pa"],
  },
  {
    id: "banking_relational_audit",
    label: "Banking Relational Audit",
    description:
      "Relational percentage stress set with chained comparison and inversion traps.",
    defaultCount: 1000,
    examProfile: "ibps",
    seedPrefix: "banking-relational-audit",
    forcedMotifIds: [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
    ],
    languages: ["en", "hi", "pa"],
  },
  {
    id: "percentage_advanced_coverage_audit",
    label: "Percentage Advanced Coverage Audit",
    description:
      "100-question coverage audit for Percentage Pass B/C advanced motif registry density.",
    defaultCount: 100,
    examProfile: "ssc",
    seedPrefix: "percentage-advanced-coverage-audit",
    forcedMotifIds: [
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
    ],
    languages: ["en", "hi", "pa"],
  },
  {
    id: "punjabi_realism_audit",
    label: "Punjabi Realism Audit",
    description:
      "Punjabi-first realism audit while preserving aligned English and Hindi renderings.",
    defaultCount: 1000,
    examProfile: "punjab_state",
    seedPrefix: "punjabi-realism-audit",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "compactness_stress_test",
    label: "Compactness Stress Test",
    description:
      "Compact cadence stress export for repetition, abruptness, and explanation continuity checks.",
    defaultCount: 5000,
    examProfile: "rrb",
    seedPrefix: "compactness-stress-test",
    languages: ["en", "hi", "pa"],
  },
  {
    id: "difficulty_distribution_audit",
    label: "Difficulty Distribution Audit",
    description:
      "Large mixed-difficulty percentage corpus for operational distribution analysis.",
    defaultCount: 5000,
    examProfile: "ssc",
    seedPrefix: "difficulty-distribution-audit",
    languages: ["en", "hi", "pa"],
  },
];

export function getCorpusAuditPreset(id?: string) {
  return (
    CORPUS_AUDIT_PRESETS.find((preset) => preset.id === id) ??
    CORPUS_AUDIT_PRESETS[0]!
  );
}

export function isCorpusAuditPresetId(value: string): value is CorpusAuditPresetId {
  return CORPUS_AUDIT_PRESETS.some((preset) => preset.id === value);
}
