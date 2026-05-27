import type {
  FormulaQuestion,
  GeneratorOptions,
} from "../../lib/core/generator-engine";
import { TIME_WORK_FAMILY_IDS } from "../canonical/time-work-motif-factories";

export type CorpusSchedulerProfileId =
  | "balanced_mock"
  | "ssc_mock"
  | "banking_mock"
  | "railway_mock"
  | "punjab_state_mock"
  | "pyq_balanced"
  | "pyq_hard"
  | "pyq_plus"
  | "ssc_mock_pyq"
  | "profit_loss_balanced"
  | "profit_loss_discount"
  | "profit_loss_hard"
  | "profit_loss_pyq_plus"
  | "interest_balanced"
  | "interest_pyq"
  | "interest_hard"
  | "interest_pyq_plus"
  | "ratio_basic"
  | "ratio_balanced"
  | "ratio_hard"
  | "ratio_pyq_plus"
  | "ratio_review_100"
  | "ratio_production_60"
  | "time_work_basic"
  | "time_work_balanced"
  | "time_work_hard"
  | "time_work_pyq_plus"
  | "time_work_review_100"
  | "time_work_production_60"
  | "advanced_coverage_audit";

export type CorpusSchedulerProfile = {
  id: CorpusSchedulerProfileId;
  topicId?: "percentage" | "profit_loss" | "interest" | "ratio_proportion" | "time_work";
  label: string;
  description: string;
  maxShare: {
    simpleTemplate: number;
    singleTopologyFamily: number;
    singleExaminerIntent: number;
    singleSemanticAnchor: number;
    singleDistractorTrap: number;
    hardStreak: number;
  };
  minShare: {
    reverseLogic: number;
    relational: number;
    filtered: number;
    hybrid: number;
    multiStep: number;
  };
  difficultyTarget: Record<"easy" | "medium" | "hard", number>;
  preferredMotifRotation: string[];
  maxAttemptsPerSlot: number;
};

export type CorpusSchedulerState = {
  profile: CorpusSchedulerProfile;
  targetCount: number;
  acceptedCount: number;
  topologyCounts: Record<string, number>;
  topologyGroupCounts: Record<string, number>;
  examinerIntentCounts: Record<string, number>;
  semanticAnchorCounts: Record<string, number>;
  distractorTrapCounts: Record<string, number>;
  familyCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  fingerprintCounts: Record<string, number>;
  finalDuplicateFingerprintCounts: Record<string, number>;
  topologyVectorCounts: Record<string, number>;
  operationCounts: Record<string, number>;
  stemOpeningCounts: Record<string, number>;
  answerPatternCounts: Record<string, number>;
  recentExaminerIntents: string[];
  recentTopologyKeys: string[];
  recentSemanticAnchors: string[];
  pacingEvents: string[];
  rejectionReasons: Record<string, number>;
  hardStreak: number;
};

function stablePreviewHash(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function interleaveScheduledPreviewQuestions<T>(
  questions: readonly T[],
  seed: string,
  familyKey: (question: T) => string,
) {
  const groups = new Map<string, T[]>();
  for (const question of questions) {
    const family = familyKey(question);
    groups.set(family, [
      ...(groups.get(family) ?? []),
      question,
    ]);
  }
  if (groups.size < 2) {
    return [...questions];
  }

  const familyOrder = [...groups.keys()].sort(
    (a, b) =>
      stablePreviewHash(`${seed}|${a}`) -
      stablePreviewHash(`${seed}|${b}`),
  );
  const output: T[] = [];
  let round = 0;

  while (output.length < questions.length) {
    const offset =
      stablePreviewHash(`${seed}|round:${round}`) %
      familyOrder.length;
    let emittedThisRound = false;

    for (let index = 0; index < familyOrder.length; index += 1) {
      const family =
        familyOrder[(index + offset) % familyOrder.length]!;
      const bucket = groups.get(family);
      if (!bucket?.length) {
        continue;
      }
      output.push(bucket.shift()!);
      emittedThisRound = true;
      if (output.length >= questions.length) {
        break;
      }
    }

    if (!emittedThisRound) {
      break;
    }
    round += 1;
  }

  return output;
}

export type CorpusSchedulerCandidateAssessment = {
  accepted: boolean;
  score: number;
  reasons: string[];
  metadata: CorpusSchedulerCandidateMetadata;
};

export type CorpusSchedulerCandidateMetadata = {
  topologyKey: string;
  topologyGroup: string;
  examinerIntent: string;
  semanticAnchor: string;
  distractorTraps: string[];
  difficulty: "easy" | "medium" | "hard";
  fingerprintKey: string;
  finalDuplicateFingerprintKey: string;
  topologyVectorKey: string;
  operationFingerprint: string;
  stemOpening: string;
  answerPattern: string;
  familyKey: string;
  multiStep: boolean;
  trivialDirectRelation: boolean;
};

export type CorpusSchedulerSummary = {
  profileId: CorpusSchedulerProfileId;
  targetCount: number;
  acceptedCount: number;
  topologyDistribution: Record<string, number>;
  topologyGroupDistribution: Record<string, number>;
  examinerIntentDistribution: Record<string, number>;
  semanticAnchorDistribution: Record<string, number>;
  familyDistribution: Record<string, number>;
  distractorTrapDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  duplicateRisk: {
    repeatedFingerprintCount: number;
    repeatedFingerprintShare: number;
    uniqueFingerprintCount: number;
    repeatedTopologyVectorCount: number;
    repeatedOperationCount: number;
  };
  pacingReport: {
    hardStreakLimit: number;
    events: string[];
  };
  rejectionReasons: Record<string, number>;
  repeatedOpeningWarnings: string[];
  balanceWarnings: string[];
};

export const CORPUS_SCHEDULER_PROFILES: readonly CorpusSchedulerProfile[] = [
  {
    id: "balanced_mock",
    label: "Balanced Mock",
    description: "General-purpose percentage corpus with broad cognitive variety.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.28,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.18,
      filtered: 0.12,
      hybrid: 0.14,
      multiStep: 0.22,
    },
    difficultyTarget: {
      easy: 0.34,
      medium: 0.44,
      hard: 0.22,
    },
    preferredMotifRotation: [
      "perc_relational_chain",
      "perc_vote_election",
      "perc_reverse_find",
      "perc_price_consumption",
      "perc_geom_dimensional_scale",
      "perc_ratio_percentage_hybrid",
      "perc_mixture_water_add",
      "perc_exam_pass_fail",
      "perc_demo_cross_tab_literacy",
      "perc_restore_value",
      "perc_population_growth",
      "perc_budget_cascading_remainder",
      "perc_salary_hike",
      "perc_venn_diagram",
      "perc_taxation",
      "perc_commission",
      "perc_exam_weighted_aggregate",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "ssc_mock",
    label: "SSC Mock",
    description: "Compact arithmetic-heavy pacing with frequent base traps.",
    maxShare: {
      simpleTemplate: 0.12,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.3,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.16,
      filtered: 0.12,
      hybrid: 0.12,
      multiStep: 0.2,
    },
    difficultyTarget: {
      easy: 0.42,
      medium: 0.42,
      hard: 0.16,
    },
    preferredMotifRotation: [
      "perc_price_consumption",
      "perc_exam_pass_fail",
      "perc_vote_election",
      "perc_reverse_find",
      "perc_geom_dimensional_scale",
      "perc_relational_chain",
      "perc_salary_hike",
      "perc_budget_cascading_remainder",
      "perc_restore_value",
      "perc_mixture_water_add",
      "perc_taxation",
      "perc_commission",
      "perc_asset_variable_depreciation",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "banking_mock",
    label: "Banking Mock",
    description: "Inference-heavy set with layered and relational reasoning.",
    maxShare: {
      simpleTemplate: 0.08,
      singleTopologyFamily: 0.18,
      singleExaminerIntent: 0.16,
      singleSemanticAnchor: 0.1,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.24,
      filtered: 0.15,
      hybrid: 0.18,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.2,
      medium: 0.48,
      hard: 0.32,
    },
    preferredMotifRotation: [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
      "perc_vote_election",
      "perc_num_fractional_perturbation_complex",
      "perc_price_consumption",
      "perc_mixture_water_add",
      "perc_num_linear_equation_balancing",
      "perc_population_growth",
      "perc_venn_diagram",
      "perc_asset_compound_leakage",
    ],
    maxAttemptsPerSlot: 9,
  },
  {
    id: "railway_mock",
    label: "Railway Mock",
    description: "Direct but trap-oriented pacing with manageable arithmetic.",
    maxShare: {
      simpleTemplate: 0.14,
      singleTopologyFamily: 0.22,
      singleExaminerIntent: 0.2,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.3,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.13,
      relational: 0.16,
      filtered: 0.11,
      hybrid: 0.12,
      multiStep: 0.18,
    },
    difficultyTarget: {
      easy: 0.46,
      medium: 0.4,
      hard: 0.14,
    },
    preferredMotifRotation: [
      "perc_exam_pass_fail",
      "perc_price_consumption",
      "perc_vote_election",
      "perc_successive_hike",
      "perc_workforce_hierarchical_attrition",
      "perc_restore_value",
      "perc_relational_chain",
      "perc_mixture_water_add",
      "perc_taxation",
      "perc_agri_land_yield_compound",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "punjab_state_mock",
    label: "Punjab/State Mock",
    description: "Bilingual realism with compact wording and topic spread.",
    maxShare: {
      simpleTemplate: 0.12,
      singleTopologyFamily: 0.2,
      singleExaminerIntent: 0.18,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.28,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.18,
      filtered: 0.13,
      hybrid: 0.14,
      multiStep: 0.22,
    },
    difficultyTarget: {
      easy: 0.38,
      medium: 0.44,
      hard: 0.18,
    },
    preferredMotifRotation: [
      "perc_vote_election",
      "perc_exam_pass_fail",
      "perc_price_consumption",
      "perc_salary_hike",
      "perc_demo_multi_factor_growth",
      "perc_relational_chain",
      "perc_reverse_find",
      "perc_mixture_water_add",
      "perc_population_growth",
      "perc_exam_weighted_aggregate",
    ],
    maxAttemptsPerSlot: 8,
  },
  {
    id: "pyq_balanced",
    label: "PYQ Balanced",
    description: "SSC PYQ-inspired balance with medium/hard arithmetic and trap variety.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.18,
      singleExaminerIntent: 0.16,
      singleSemanticAnchor: 0.11,
      singleDistractorTrap: 0.24,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.16,
      filtered: 0.12,
      hybrid: 0.18,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.24,
      medium: 0.48,
      hard: 0.28,
    },
    preferredMotifRotation: [
      "perc_price_consumption",
      "perc_exam_pass_fail",
      "perc_reverse_find",
      "perc_relational_chain",
      "perc_taxation",
      "perc_commission",
      "perc_exam_weighted_aggregate",
      "perc_budget_cascading_remainder",
      "perc_population_growth",
      "perc_mixture_water_add",
      "perc_ratio_percentage_hybrid",
      "perc_geom_dimensional_scale",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "pyq_hard",
    label: "PYQ Hard",
    description: "Hard PYQ-style mix emphasizing inverse conditions, hidden bases, and multi-step traps.",
    maxShare: {
      simpleTemplate: 0.06,
      singleTopologyFamily: 0.16,
      singleExaminerIntent: 0.15,
      singleSemanticAnchor: 0.1,
      singleDistractorTrap: 0.24,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.2,
      relational: 0.16,
      filtered: 0.14,
      hybrid: 0.22,
      multiStep: 0.34,
    },
    difficultyTarget: {
      easy: 0.12,
      medium: 0.43,
      hard: 0.45,
    },
    preferredMotifRotation: [
      "perc_const_absolute_offset",
      "perc_num_linear_equation_balancing",
      "perc_num_fractional_perturbation_complex",
      "perc_exam_weighted_aggregate",
      "perc_commission",
      "perc_taxation",
      "perc_budget_cascading_remainder",
      "perc_asset_compound_leakage",
      "perc_demo_multi_factor_growth",
      "perc_price_consumption",
      "perc_reverse_relation",
      "perc_relational_chain",
    ],
    maxAttemptsPerSlot: 11,
  },
  {
    id: "pyq_plus",
    label: "PYQ Plus",
    description: "Premium Quant V2 benchmark profile with hybrid, inverse, and advanced motifs.",
    maxShare: {
      simpleTemplate: 0.05,
      singleTopologyFamily: 0.15,
      singleExaminerIntent: 0.14,
      singleSemanticAnchor: 0.1,
      singleDistractorTrap: 0.22,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.22,
      relational: 0.14,
      filtered: 0.16,
      hybrid: 0.24,
      multiStep: 0.38,
    },
    difficultyTarget: {
      easy: 0.08,
      medium: 0.38,
      hard: 0.54,
    },
    preferredMotifRotation: [
      "perc_num_linear_equation_balancing",
      "perc_tax_bracket_retained_income",
      "perc_comm_tiered_salary_override",
      "perc_mix_alloy_replacement",
      "perc_num_fractional_perturbation_complex",
      "perc_asset_compound_leakage",
      "perc_const_absolute_offset",
      "perc_budget_cascading_remainder",
      "perc_demo_cross_tab_literacy",
      "perc_exam_weighted_aggregate",
      "perc_agri_land_yield_compound",
      "perc_workforce_hierarchical_attrition",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ssc_mock_pyq",
    label: "SSC Mock PYQ",
    description: "SSC mock pacing using the PYQ+ benchmark difficulty mix.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.18,
      singleExaminerIntent: 0.16,
      singleSemanticAnchor: 0.11,
      singleDistractorTrap: 0.25,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.16,
      filtered: 0.12,
      hybrid: 0.18,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.22,
      medium: 0.5,
      hard: 0.28,
    },
    preferredMotifRotation: [
      "perc_exam_pass_fail",
      "perc_price_consumption",
      "perc_reverse_find",
      "perc_vote_election",
      "perc_commission",
      "perc_taxation",
      "perc_mixture_water_add",
      "perc_population_growth",
      "perc_exam_weighted_aggregate",
      "perc_budget_cascading_remainder",
      "perc_relational_chain",
      "perc_ratio_percentage_hybrid",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "profit_loss_balanced",
    topicId: "profit_loss",
    label: "Profit/Loss Balanced",
    description: "Balanced Profit, Loss & Discount V2 rotation across direct, discount, promotion, and inverse families.",
    maxShare: {
      simpleTemplate: 0.18,
      singleTopologyFamily: 0.1,
      singleExaminerIntent: 0.14,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.1,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.2,
      multiStep: 0.25,
    },
    difficultyTarget: {
      easy: 0.3,
      medium: 0.48,
      hard: 0.22,
    },
    preferredMotifRotation: [
      "pl_cp_sp_percent",
      "pl_cp_percent_to_sp",
      "pl_sp_percent_to_cp",
      "pl_mp_discount_to_sp",
      "pl_mp_sp_discount_percent",
      "pl_successive_discounts",
      "pl_mp_for_target_profit",
      "pl_equal_sp_profit_loss",
      "pl_two_article_overall",
      "pl_repair_overhead_cost",
      "pl_cashback_coupon_discount",
      "pl_gst_after_discount",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "profit_loss_discount",
    topicId: "profit_loss",
    label: "Profit/Loss Discount",
    description: "Marked-price and discount-heavy Profit/Loss V2 scheduler profile.",
    maxShare: {
      simpleTemplate: 0.14,
      singleTopologyFamily: 0.12,
      singleExaminerIntent: 0.14,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.28,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.24,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.24,
      medium: 0.52,
      hard: 0.24,
    },
    preferredMotifRotation: [
      "pl_mp_discount_to_sp",
      "pl_mp_sp_discount_percent",
      "pl_cp_mp_discount_to_percent",
      "pl_successive_discounts",
      "pl_mp_for_target_profit",
      "pl_markup_discount_triangle",
      "pl_target_profit_discount_calibration",
      "pl_successive_discount_equivalent",
      "pl_cashback_coupon_discount",
      "pl_gst_after_discount",
      "pl_tax_inclusive_back_calc",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "profit_loss_hard",
    topicId: "profit_loss",
    label: "Profit/Loss Hard",
    description: "Hard Profit/Loss V2 scheduler profile for fraud, inverse, inventory, and overhead traps.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.09,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.25,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.26,
      multiStep: 0.34,
    },
    difficultyTarget: {
      easy: 0.12,
      medium: 0.46,
      hard: 0.42,
    },
    preferredMotifRotation: [
      "pl_dishonest_dealer_weight_fraud",
      "pl_dishonest_dealer_dual_fraud",
      "pl_multi_condition_inverse_absolute",
      "pl_partial_inventory_allocation",
      "pl_sequential_supply_chain",
      "pl_supply_chain_mixed_profit_loss",
      "pl_compound_error_baseline_shift",
      "pl_manufacturing_breakdown",
      "pl_inverse_cp_from_mp_discount_profit",
      "pl_inverse_discount_from_cp_mp_profit",
      "pl_profit_after_commission_tax",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "profit_loss_pyq_plus",
    topicId: "profit_loss",
    label: "Profit/Loss PYQ+",
    description: "Advanced PYQ+ Profit/Loss V2 profile with controlled trap density and higher ceiling.",
    maxShare: {
      simpleTemplate: 0.08,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.11,
      singleSemanticAnchor: 0.12,
      singleDistractorTrap: 0.24,
      hardStreak: 5,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.28,
      multiStep: 0.38,
    },
    difficultyTarget: {
      easy: 0.08,
      medium: 0.42,
      hard: 0.5,
    },
    preferredMotifRotation: [
      "pl_dishonest_dealer_dual_fraud",
      "pl_multi_condition_inverse_absolute",
      "pl_manufacturing_breakdown",
      "pl_compound_error_baseline_shift",
      "pl_partial_inventory_allocation",
      "pl_supply_chain_mixed_profit_loss",
      "pl_inverse_markup_from_cp_discount_profit",
      "pl_loss_recovery_cp_from_difference",
      "pl_required_sp_after_loss",
      "pl_hybrid_promotion_scaling",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "interest_balanced",
    topicId: "interest",
    label: "Interest Balanced",
    description: "Balanced SI/CI, repayment, growth, and discount-bill Interest V2 rotation.",
    maxShare: {
      simpleTemplate: 0.2,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.25,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.18,
      multiStep: 0.25,
    },
    difficultyTarget: {
      easy: 0.28,
      medium: 0.46,
      hard: 0.26,
    },
    preferredMotifRotation: [
      "int_si_from_prt",
      "int_ci_amount_annual",
      "int_ci_si_difference_2_years",
      "int_si_temporal_amount_gap",
      "int_ci_half_yearly",
      "int_population_growth_ci",
      "int_equal_annual_installments_ci",
      "int_present_worth",
      "int_part_principal_two_rates_si",
      "int_nominal_vs_effective_rate",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "interest_pyq",
    topicId: "interest",
    label: "Interest PYQ",
    description: "SSC/IBPS style Interest V2 profile with medium-plus reasoning and clean traps.",
    maxShare: {
      simpleTemplate: 0.16,
      singleTopologyFamily: 0.07,
      singleExaminerIntent: 0.1,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.24,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.22,
      multiStep: 0.3,
    },
    difficultyTarget: {
      easy: 0.2,
      medium: 0.5,
      hard: 0.3,
    },
    preferredMotifRotation: [
      "int_si_temporal_amount_gap",
      "int_ci_si_difference_2_years",
      "int_ci_amount_multiplier_gap",
      "int_ci_half_yearly",
      "int_ci_specific_year_isolation",
      "int_equal_annual_installments_ci",
      "int_part_principal_two_rates_si",
      "int_si_alligation_mixture",
      "int_present_worth",
      "int_nominal_vs_effective_rate",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "interest_hard",
    topicId: "interest",
    label: "Interest Hard",
    description: "Hard Interest V2 rotation emphasizing inverse, repayment, banker discount, and split-investment traps.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.07,
      singleExaminerIntent: 0.1,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.24,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.24,
      multiStep: 0.34,
    },
    difficultyTarget: {
      easy: 0.12,
      medium: 0.44,
      hard: 0.44,
    },
    preferredMotifRotation: [
      "int_ci_specific_year_rate_principal",
      "int_si_ci_mixed_condition_inverse",
      "int_partial_payment_before_final_amount",
      "int_equal_half_yearly_installments_ci",
      "int_bankers_gain",
      "int_si_alligation_mixture",
      "int_wrong_period_conversion_trap",
      "int_compound_depreciation_repair_sale",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "interest_pyq_plus",
    topicId: "interest",
    label: "Interest PYQ+",
    description: "Advanced PYQ+ Interest V2 profile with elite hybrids and inverse conditions.",
    maxShare: {
      simpleTemplate: 0.08,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 5,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.08,
      filtered: 0.08,
      hybrid: 0.24,
      multiStep: 0.36,
    },
    difficultyTarget: {
      easy: 0.08,
      medium: 0.42,
      hard: 0.5,
    },
    preferredMotifRotation: [
      "int_ci_specific_year_rate_principal",
      "int_si_ci_mixed_condition_inverse",
      "int_nominal_vs_effective_rate",
      "int_partial_payment_before_final_amount",
      "int_compound_depreciation_repair_sale",
      "int_find_principal_from_installments",
      "int_bd_td_difference",
      "int_weighted_interest_income",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ratio_basic",
    topicId: "ratio_proportion",
    label: "Ratio Basic",
    description: "Direct Ratio, Proportion & Variation V2 fundamentals with light transformation coverage.",
    maxShare: {
      simpleTemplate: 0.36,
      singleTopologyFamily: 0.12,
      singleExaminerIntent: 0.14,
      singleSemanticAnchor: 0.16,
      singleDistractorTrap: 0.28,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.08,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.18,
      multiStep: 0.16,
    },
    difficultyTarget: {
      easy: 0.42,
      medium: 0.46,
      hard: 0.12,
    },
    preferredMotifRotation: [
      "rp_direct_sharing",
      "rp_sum_based_ratio_recovery",
      "rp_missing_term_proportion",
      "rp_ratio_to_fraction",
      "rp_fraction_to_ratio",
      "rp_equivalent_ratio_generation",
      "rp_ratio_to_percentage",
      "rp_percentage_to_ratio",
      "rp_partial_value_ratio_recovery",
      "rp_difference_based_ratio_recovery",
      "rp_ratio_after_increase",
      "rp_ratio_after_decrease",
      "rp_partnership_basic",
      "rp_direct_variation_basic",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "ratio_balanced",
    topicId: "ratio_proportion",
    label: "Ratio Balanced",
    description: "Balanced Ratio, Proportion & Variation V2 profile across core, ages, partnership, variation, scaling, and chain ratios.",
    maxShare: {
      simpleTemplate: 0.26,
      singleTopologyFamily: 0.1,
      singleExaminerIntent: 0.13,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.24,
      medium: 0.5,
      hard: 0.26,
    },
    preferredMotifRotation: [
      "rp_direct_sharing",
      "rp_sum_based_ratio_recovery",
      "rp_difference_based_ratio_recovery",
      "rp_missing_term_proportion",
      "rp_ratio_to_fraction",
      "rp_fraction_to_ratio",
      "rp_ratio_after_increase",
      "rp_ratio_after_decrease",
      "rp_age_future_ratio",
      "rp_age_past_ratio",
      "rp_partnership_basic",
      "rp_partnership_time_variation",
      "rp_direct_variation_basic",
      "rp_inverse_variation_basic",
      "rp_joint_variation",
      "rp_combined_direct_inverse",
      "rp_map_scale_ratio",
      "rp_side_area_volume_ratio",
      "rp_chain_ratio_network",
      "rp_ratio_after_transfer",
      "rp_equivalent_ratio_generation",
      "rp_ratio_to_percentage",
      "rp_percentage_to_ratio",
      "rp_product_based_ratio_recovery",
      "rp_partial_value_ratio_recovery",
      "rp_ratio_after_exchange",
      "rp_ratio_restoration",
      "rp_reverse_ratio_scaling",
      "rp_age_difference_constant",
      "rp_age_multi_generation",
      "rp_partnership_partial_exit",
      "rp_partnership_profit_distribution",
      "rp_population_gender_ratio",
      "rp_voter_turnout_ratio",
      "rp_marks_distribution_ratio",
      "rp_recipe_scaling_ratio",
      "rp_blueprint_scaling",
      "rp_shadow_height_ratio",
      "rp_similarity_scaling",
      "rp_weighted_ratio_balancing",
      "rp_multi_equation_ratio",
      "rp_ratio_graph_deduction",
      "rp_circular_ratio_dependency",
      "rp_hidden_total_trap",
      "rp_fractional_distribution_chain",
      "rp_variable_power_variation",
      "rp_workforce_inverse_variation",
      "rp_speed_distance_inverse",
      "rp_inventory_allocation",
      "rp_liquid_replacement_ratio",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ratio_hard",
    topicId: "ratio_proportion",
    label: "Ratio Hard",
    description: "Hard Ratio, Proportion & Variation V2 profile with transfer equations, chained ratios, geometry powers, and combined variation.",
    maxShare: {
      simpleTemplate: 0.12,
      singleTopologyFamily: 0.1,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.13,
      singleDistractorTrap: 0.25,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.22,
      multiStep: 0.38,
    },
    difficultyTarget: {
      easy: 0.1,
      medium: 0.42,
      hard: 0.48,
    },
    preferredMotifRotation: [
      "rp_ratio_after_transfer",
      "rp_chain_ratio_network",
      "rp_combined_direct_inverse",
      "rp_joint_variation",
      "rp_side_area_volume_ratio",
      "rp_age_future_ratio",
      "rp_age_past_ratio",
      "rp_partnership_time_variation",
      "rp_inverse_variation_basic",
      "rp_ratio_after_increase",
      "rp_ratio_after_decrease",
      "rp_ratio_after_exchange",
      "rp_ratio_restoration",
      "rp_partnership_partial_exit",
      "rp_weighted_ratio_balancing",
      "rp_product_based_ratio_recovery",
      "rp_age_difference_constant",
      "rp_age_multi_generation",
      "rp_similarity_scaling",
      "rp_multi_equation_ratio",
      "rp_ratio_graph_deduction",
      "rp_circular_ratio_dependency",
      "rp_hidden_total_trap",
      "rp_fractional_distribution_chain",
      "rp_variable_power_variation",
      "rp_workforce_inverse_variation",
      "rp_speed_distance_inverse",
      "rp_inventory_allocation",
      "rp_liquid_replacement_ratio",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ratio_pyq_plus",
    topicId: "ratio_proportion",
    label: "Ratio PYQ+",
    description: "PYQ+ Ratio, Proportion & Variation V2 profile with controlled traps and higher-ceiling proportional reasoning.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.09,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.13,
      singleDistractorTrap: 0.24,
      hardStreak: 5,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.22,
      multiStep: 0.4,
    },
    difficultyTarget: {
      easy: 0.08,
      medium: 0.4,
      hard: 0.52,
    },
    preferredMotifRotation: [
      "rp_ratio_after_transfer",
      "rp_chain_ratio_network",
      "rp_combined_direct_inverse",
      "rp_joint_variation",
      "rp_side_area_volume_ratio",
      "rp_partnership_time_variation",
      "rp_age_future_ratio",
      "rp_age_past_ratio",
      "rp_inverse_variation_basic",
      "rp_difference_based_ratio_recovery",
      "rp_ratio_after_exchange",
      "rp_ratio_restoration",
      "rp_partnership_partial_exit",
      "rp_weighted_ratio_balancing",
      "rp_product_based_ratio_recovery",
      "rp_reverse_ratio_scaling",
      "rp_age_multi_generation",
      "rp_similarity_scaling",
      "rp_multi_equation_ratio",
      "rp_ratio_graph_deduction",
      "rp_circular_ratio_dependency",
      "rp_hidden_total_trap",
      "rp_fractional_distribution_chain",
      "rp_variable_power_variation",
      "rp_workforce_inverse_variation",
      "rp_speed_distance_inverse",
      "rp_inventory_allocation",
      "rp_liquid_replacement_ratio",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ratio_review_100",
    topicId: "ratio_proportion",
    label: "Ratio Review 100",
    description: "100-question review profile that maximizes Phase A Ratio V2 motif coverage.",
    maxShare: {
      simpleTemplate: 0.28,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.3,
    },
    difficultyTarget: {
      easy: 0.22,
      medium: 0.5,
      hard: 0.28,
    },
    preferredMotifRotation: [
      "rp_direct_sharing",
      "rp_sum_based_ratio_recovery",
      "rp_difference_based_ratio_recovery",
      "rp_missing_term_proportion",
      "rp_ratio_to_fraction",
      "rp_fraction_to_ratio",
      "rp_ratio_after_increase",
      "rp_ratio_after_decrease",
      "rp_ratio_after_transfer",
      "rp_age_future_ratio",
      "rp_age_past_ratio",
      "rp_partnership_basic",
      "rp_partnership_time_variation",
      "rp_direct_variation_basic",
      "rp_inverse_variation_basic",
      "rp_joint_variation",
      "rp_combined_direct_inverse",
      "rp_map_scale_ratio",
      "rp_side_area_volume_ratio",
      "rp_chain_ratio_network",
      "rp_equivalent_ratio_generation",
      "rp_ratio_to_percentage",
      "rp_percentage_to_ratio",
      "rp_product_based_ratio_recovery",
      "rp_partial_value_ratio_recovery",
      "rp_ratio_after_exchange",
      "rp_ratio_restoration",
      "rp_reverse_ratio_scaling",
      "rp_age_difference_constant",
      "rp_age_multi_generation",
      "rp_partnership_partial_exit",
      "rp_partnership_profit_distribution",
      "rp_population_gender_ratio",
      "rp_voter_turnout_ratio",
      "rp_marks_distribution_ratio",
      "rp_recipe_scaling_ratio",
      "rp_blueprint_scaling",
      "rp_shadow_height_ratio",
      "rp_similarity_scaling",
      "rp_weighted_ratio_balancing",
      "rp_multi_equation_ratio",
      "rp_ratio_graph_deduction",
      "rp_circular_ratio_dependency",
      "rp_hidden_total_trap",
      "rp_fractional_distribution_chain",
      "rp_variable_power_variation",
      "rp_workforce_inverse_variation",
      "rp_speed_distance_inverse",
      "rp_inventory_allocation",
      "rp_liquid_replacement_ratio",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "ratio_production_60",
    topicId: "ratio_proportion",
    label: "Ratio Production 60",
    description: "Production-style 60Q Ratio V2 profile covering direct ratio, proportion, transformation, ages, partnership, variation, scaling, and chain ratios.",
    maxShare: {
      simpleTemplate: 0.3,
      singleTopologyFamily: 0.1,
      singleExaminerIntent: 0.13,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.08,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.24,
      medium: 0.5,
      hard: 0.26,
    },
    preferredMotifRotation: [
      "rp_direct_sharing",
      "rp_sum_based_ratio_recovery",
      "rp_difference_based_ratio_recovery",
      "rp_missing_term_proportion",
      "rp_ratio_after_increase",
      "rp_ratio_after_decrease",
      "rp_age_future_ratio",
      "rp_age_past_ratio",
      "rp_partnership_basic",
      "rp_partnership_time_variation",
      "rp_direct_variation_basic",
      "rp_inverse_variation_basic",
      "rp_joint_variation",
      "rp_combined_direct_inverse",
      "rp_map_scale_ratio",
      "rp_side_area_volume_ratio",
      "rp_chain_ratio_network",
      "rp_ratio_after_transfer",
      "rp_ratio_to_fraction",
      "rp_fraction_to_ratio",
      "rp_equivalent_ratio_generation",
      "rp_ratio_to_percentage",
      "rp_percentage_to_ratio",
      "rp_product_based_ratio_recovery",
      "rp_partial_value_ratio_recovery",
      "rp_ratio_after_exchange",
      "rp_ratio_restoration",
      "rp_reverse_ratio_scaling",
      "rp_age_difference_constant",
      "rp_age_multi_generation",
      "rp_partnership_partial_exit",
      "rp_partnership_profit_distribution",
      "rp_population_gender_ratio",
      "rp_voter_turnout_ratio",
      "rp_marks_distribution_ratio",
      "rp_recipe_scaling_ratio",
      "rp_blueprint_scaling",
      "rp_shadow_height_ratio",
      "rp_similarity_scaling",
      "rp_weighted_ratio_balancing",
      "rp_multi_equation_ratio",
      "rp_ratio_graph_deduction",
      "rp_circular_ratio_dependency",
      "rp_hidden_total_trap",
      "rp_fractional_distribution_chain",
      "rp_variable_power_variation",
      "rp_workforce_inverse_variation",
      "rp_speed_distance_inverse",
      "rp_inventory_allocation",
      "rp_liquid_replacement_ratio",
    ],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "time_work_basic",
    topicId: "time_work",
    label: "Time Work Basic",
    description: "Core Time & Work V2 profile for combined work, residual work, efficiency, one-day work, and basic pipes/resources.",
    maxShare: {
      simpleTemplate: 0.38,
      singleTopologyFamily: 0.1,
      singleExaminerIntent: 0.14,
      singleSemanticAnchor: 0.16,
      singleDistractorTrap: 0.28,
      hardStreak: 2,
    },
    minShare: {
      reverseLogic: 0.08,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.18,
      multiStep: 0.16,
    },
    difficultyTarget: {
      easy: 0.42,
      medium: 0.46,
      hard: 0.12,
    },
    preferredMotifRotation: [
      "tw_basic_combined_work",
      "tw_basic_residual_work",
      "tw_efficiency_ratio_scaling",
      "tw_individual_from_combined",
      "tw_work_fraction_days",
      "tw_man_days_hours_basic",
      "tw_work_done_ratio_from_times",
      "tw_time_ratio_from_efficiency",
      "tw_efficiency_from_wages",
      "tw_one_day_work_fraction",
      "tw_remaining_work_fraction",
      "pc_basic_fill_empty",
      "pc_tank_capacity_from_rate",
      "tw_food_resource_basic",
      "tw_typist_pages_per_hour",
    ],
    maxAttemptsPerSlot: 10,
  },
  {
    id: "time_work_balanced",
    topicId: "time_work",
    label: "Time Work Balanced",
    description: "Balanced Time & Work / Pipes & Cisterns V2 profile across all exposed rate-state families.",
    maxShare: {
      simpleTemplate: 0.26,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.3,
    },
    difficultyTarget: {
      easy: 0.22,
      medium: 0.5,
      hard: 0.28,
    },
    preferredMotifRotation: [...TIME_WORK_FAMILY_IDS],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "time_work_hard",
    topicId: "time_work",
    label: "Time Work Hard",
    description: "Hard Time & Work V2 profile emphasizing timelines, cycles, systems, pipes, and PYQ+ traps.",
    maxShare: {
      simpleTemplate: 0.14,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.13,
      singleDistractorTrap: 0.24,
      hardStreak: 4,
    },
    minShare: {
      reverseLogic: 0.14,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.4,
    },
    difficultyTarget: {
      easy: 0.08,
      medium: 0.42,
      hard: 0.5,
    },
    preferredMotifRotation: TIME_WORK_FAMILY_IDS.filter((family) =>
      /leave|phase|cycle|equivalence|pairwise|wage|pipe|leak|resource|advanced|deadline|decay|schedule|negative|positive|hidden/u.test(family),
    ),
    maxAttemptsPerSlot: 12,
  },
  {
    id: "time_work_pyq_plus",
    topicId: "time_work",
    label: "Time Work PYQ+",
    description: "PYQ+ Time & Work V2 profile with controlled traps above standard SSC ceiling.",
    maxShare: {
      simpleTemplate: 0.1,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.13,
      singleDistractorTrap: 0.24,
      hardStreak: 5,
    },
    minShare: {
      reverseLogic: 0.16,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.42,
    },
    difficultyTarget: {
      easy: 0.06,
      medium: 0.38,
      hard: 0.56,
    },
    preferredMotifRotation: TIME_WORK_FAMILY_IDS.filter((family) =>
      /multi|cycle|terminal|conditional|equivalence|pairwise|unknown|helper|contract|pipe|leak|overflow|resource|construction|negative|decay|schedule|deadline/u.test(family),
    ),
    maxAttemptsPerSlot: 12,
  },
  {
    id: "time_work_review_100",
    topicId: "time_work",
    label: "Time Work Review 100",
    description: "100-question review profile that maximizes Time & Work V2 motif coverage.",
    maxShare: {
      simpleTemplate: 0.24,
      singleTopologyFamily: 0.06,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.32,
    },
    difficultyTarget: {
      easy: 0.18,
      medium: 0.5,
      hard: 0.32,
    },
    preferredMotifRotation: [...TIME_WORK_FAMILY_IDS],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "time_work_production_60",
    topicId: "time_work",
    label: "Time Work Production 60",
    description: "Production-style 60Q Time & Work V2 profile covering core work, timelines, cycles, wages, pipes, resources, and applied contexts.",
    maxShare: {
      simpleTemplate: 0.28,
      singleTopologyFamily: 0.08,
      singleExaminerIntent: 0.12,
      singleSemanticAnchor: 0.14,
      singleDistractorTrap: 0.26,
      hardStreak: 3,
    },
    minShare: {
      reverseLogic: 0.12,
      relational: 0.06,
      filtered: 0.04,
      hybrid: 0.24,
      multiStep: 0.28,
    },
    difficultyTarget: {
      easy: 0.22,
      medium: 0.5,
      hard: 0.28,
    },
    preferredMotifRotation: [...TIME_WORK_FAMILY_IDS],
    maxAttemptsPerSlot: 12,
  },
  {
    id: "advanced_coverage_audit",
    label: "Advanced Coverage Audit",
    description: "Density-first audit profile for Percentage Pass B/C advanced motifs.",
    maxShare: {
      simpleTemplate: 1,
      singleTopologyFamily: 1,
      singleExaminerIntent: 1,
      singleSemanticAnchor: 1,
      singleDistractorTrap: 1,
      hardStreak: 100,
    },
    minShare: {
      reverseLogic: 0,
      relational: 0,
      filtered: 0,
      hybrid: 0,
      multiStep: 0,
    },
    difficultyTarget: {
      easy: 0.1,
      medium: 0.35,
      hard: 0.55,
    },
    preferredMotifRotation: [
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
    maxAttemptsPerSlot: 6,
  },
];

function normalizeShare(count: number, total: number) {
  return total <= 0 ? 0 : count / total;
}

function increment(map: Record<string, number>, key: string, amount = 1) {
  map[key] = (map[key] ?? 0) + amount;
}

export function getCorpusSchedulerProfile(id?: string) {
  return (
    CORPUS_SCHEDULER_PROFILES.find((profile) => profile.id === id) ??
    CORPUS_SCHEDULER_PROFILES[0]!
  );
}

export function createCorpusSchedulerState(input: {
  targetCount: number;
  profileId?: CorpusSchedulerProfileId | string;
}) {
  return {
    profile: getCorpusSchedulerProfile(input.profileId),
    targetCount: Math.max(1, Math.floor(input.targetCount)),
    acceptedCount: 0,
    topologyCounts: {},
    topologyGroupCounts: {},
    examinerIntentCounts: {},
    semanticAnchorCounts: {},
    distractorTrapCounts: {},
    familyCounts: {},
    difficultyCounts: {},
    fingerprintCounts: {},
    finalDuplicateFingerprintCounts: {},
    topologyVectorCounts: {},
    operationCounts: {},
    stemOpeningCounts: {},
    answerPatternCounts: {},
    recentExaminerIntents: [],
    recentTopologyKeys: [],
    recentSemanticAnchors: [],
    pacingEvents: [],
    rejectionReasons: {},
    hardStreak: 0,
  } satisfies CorpusSchedulerState;
}

function quantV2(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 ?? {}) as Record<string, any>;
}

function normalizeFinalDuplicateText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,]/gu, "")
    .replace(/[^\p{L}\p{N}.%]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function finalDuplicateFingerprint(question: FormulaQuestion) {
  const answer = String(question.options?.[question.correct ?? 0] ?? "");
  const optionSet = [...(question.options ?? [])]
    .map(normalizeFinalDuplicateText)
    .sort()
    .join("|");
  return [
    normalizeFinalDuplicateText(question.text),
    normalizeFinalDuplicateText((question as any).textHi),
    normalizeFinalDuplicateText((question as any).textPa),
    normalizeFinalDuplicateText(answer),
    optionSet,
  ].join("::");
}

function topologyKey(problem: any, quantPayload: Record<string, any>) {
  const topology = quantPayload.topology ?? problem?.topology;
  if (!topology) return `simple:${problem?.subtype ?? "unknown"}`;
  return `${topology.family ?? "none"}:${topology.variant ?? problem?.subtype ?? "unknown"}`;
}

function topologyGroup(problem: any, graph: any, topology: string) {
  const text = `${problem?.category ?? ""} ${problem?.subtype ?? ""} ${problem?.reasoningPattern ?? ""} ${topology}`;
  if (problem?.category === "profit_loss_discount") {
    const variant = String(problem?.topology?.variant ?? problem?.subtype ?? topology);
    if (/sp_percent_to_cp|mp_for_target_profit/u.test(variant)) {
      return "reverse_logic";
    }
    if (/discount|cp_mp/u.test(variant)) {
      return "hybrid";
    }
    if (/successive|equal_sp|two_article/u.test(variant)) {
      return "multi_step";
    }
    return "simple_template";
  }
  if (problem?.category === "interest") {
    const variant = String(problem?.topology?.variant ?? problem?.subtype ?? topology);
    if (/principal|rate|time|ratio_find|from_amount|inverse/u.test(variant)) {
      return "reverse_logic";
    }
    if (/bankers|present_worth|true_discount|installment|partial|alligation|weighted|specific_year|mixed/u.test(variant)) {
      return "multi_step";
    }
    if (/ci_|compound|growth|depreciation|half|quarter|month|frequency|nominal|successive/u.test(variant)) {
      return "hybrid";
    }
    return "simple_template";
  }
  if (problem?.category === "ratio_proportion") {
    const variant = String(problem?.topology?.variant ?? problem?.subtype ?? topology);
    if (/hidden_total|fractional_distribution|inventory|liquid_replacement/u.test(variant)) {
      return "filtered";
    }
    if (/multi_equation|graph|circular|variable_power|workforce|speed_distance/u.test(variant)) {
      return "multi_step";
    }
    if (/difference|missing_term|fraction_to_ratio|age|transfer/u.test(variant)) {
      return "reverse_logic";
    }
    if (/chain|joint_variation|combined_direct_inverse|partnership_time|side_area_volume/u.test(variant)) {
      return "multi_step";
    }
    if (/increase|decrease|variation|map_scale|partnership/u.test(variant)) {
      return "hybrid";
    }
    return "simple_template";
  }
  if (problem?.category === "time_work") {
    const variant = String(problem?.topology?.variant ?? problem?.subtype ?? topology);
    if (/food|resource|partial|remaining|hidden|overflow/u.test(variant)) {
      return "filtered";
    }
    if (/cycle|phase|leave|join|replacement|pairwise|unknown|deadline|schedule|decay|multi/u.test(variant)) {
      return "multi_step";
    }
    if (/efficiency|equivalence|ratio|wage|pipe|leak|capacity|machine|construction|painting/u.test(variant)) {
      return "hybrid";
    }
    if (/individual|fraction|one_day|remaining|resource/u.test(variant)) {
      return "reverse_logic";
    }
    return "simple_template";
  }
  if (/ratio|mixture|hybrid|consumption|expenditure/iu.test(text)) {
    return "hybrid";
  }
  if (/reverse|restore|hidden|inverse/iu.test(text)) {
    return "reverse_logic";
  }
  if (/filtered|valid|remaining|layered|election|population/iu.test(text)) {
    return "filtered";
  }
  if (/relational|relation|comparison_bridge|percentage_ratio_hybrid/iu.test(text)) {
    return "relational";
  }
  if ((graph?.steps?.length ?? 0) >= 4 || (graph?.branches?.length ?? 0) >= 2) {
    return "multi_step";
  }
  return "simple_template";
}

const SMALL_BATCH_FAMILY_CAPS: Record<string, number> = {
  election_margin: 5,
  price_consumption: 3,
  salary_revision: 2,
  single_relation: 0,
  two_step_relation_chain: 4,
  mixture_percentage: 3,
  reverse_percentage: 3,
  restore_original: 3,
  venn_diagram: 3,
  commission: 4,
  taxation: 2,
  population_growth: 4,
  pass_fail: 4,
  perc_geom_dimensional_scale: 2,
  perc_demo_cross_tab_literacy: 2,
  perc_budget_cascading_remainder: 2,
  perc_const_absolute_offset: 2,
  perc_exam_weighted_aggregate: 2,
  perc_asset_variable_depreciation: 2,
  perc_workforce_hierarchical_attrition: 2,
  perc_agri_land_yield_compound: 2,
  perc_demo_multi_factor_growth: 2,
  perc_comm_tiered_salary_override: 1,
  perc_asset_compound_leakage: 2,
  perc_num_linear_equation_balancing: 2,
  perc_num_fractional_perturbation_complex: 2,
  perc_tax_bracket_retained_income: 1,
  perc_num_square_proportional_delta: 1,
  perc_mix_alloy_replacement: 1,
  pl_cp_sp_percent: 3,
  pl_cp_percent_to_sp: 3,
  pl_sp_percent_to_cp: 3,
  pl_mp_discount_to_sp: 6,
  pl_mp_sp_discount_percent: 6,
  pl_cp_mp_discount_to_percent: 6,
  pl_successive_discounts: 6,
  pl_mp_for_target_profit: 6,
  pl_equal_sp_profit_loss: 6,
  pl_two_article_overall: 6,
  pl_no_profit_no_loss: 2,
  pl_asymmetric_item_equivalence: 2,
  pl_fractional_value_shift: 2,
  pl_loss_recovery_cp_from_difference: 2,
  pl_required_sp_after_loss: 2,
  pl_sp_difference_two_rates: 2,
  pl_markup_discount_triangle: 3,
  pl_target_profit_discount_calibration: 2,
  pl_target_profit_mp_calibration: 2,
  pl_successive_discount_equivalent: 3,
  pl_dual_item_identical_sp: 3,
  pl_dual_item_mixed_baseline: 2,
  pl_partial_inventory_allocation: 2,
  pl_equal_profit_loss_amount: 2,
  pl_same_profit_amount_different_rates: 2,
  pl_sequential_supply_chain: 2,
  pl_supply_chain_mixed_profit_loss: 2,
  pl_compound_error_baseline_shift: 2,
  pl_dishonest_dealer_weight_fraud: 2,
  pl_dishonest_dealer_dual_fraud: 2,
  pl_dishonest_dealer_absolute_hybrid: 2,
  pl_buy_get_free_discount: 2,
  pl_hybrid_promotion_scaling: 2,
  pl_cashback_coupon_discount: 2,
  pl_gst_after_discount: 2,
  pl_tax_inclusive_back_calc: 2,
  pl_profit_after_commission_tax: 2,
  pl_repair_overhead_cost: 2,
  pl_required_sp_after_overhead: 2,
  pl_manufacturing_breakdown: 2,
  pl_inverse_cp_from_mp_discount_profit: 2,
  pl_inverse_discount_from_cp_mp_profit: 2,
  pl_inverse_markup_from_cp_discount_profit: 2,
  pl_multi_condition_inverse_absolute: 2,
};

const DEFAULT_SMALL_BATCH_FAMILY_CAP = 4;
const STANDARD_ADVANCED_MIN_COUNT = 10;
const STANDARD_ADVANCED_MIN_DISTINCT = 8;
const STANDARD_RELATION_FAMILY_CAP = 5;

const PRODUCTION_ADVANCED_FAMILIES = [
  "perc_geom_dimensional_scale",
  "perc_demo_cross_tab_literacy",
  "perc_budget_cascading_remainder",
  "perc_const_absolute_offset",
  "perc_exam_weighted_aggregate",
  "perc_asset_variable_depreciation",
  "perc_workforce_hierarchical_attrition",
  "perc_agri_land_yield_compound",
  "perc_demo_multi_factor_growth",
  "perc_comm_tiered_salary_override",
  "perc_asset_compound_leakage",
  "perc_num_linear_equation_balancing",
  "perc_num_fractional_perturbation_complex",
  "perc_tax_bracket_retained_income",
  "perc_num_square_proportional_delta",
  "perc_mix_alloy_replacement",
] as const;

const PRODUCTION_ADVANCED_MOTIFS = [...PRODUCTION_ADVANCED_FAMILIES];

function isProductionAdvancedFamily(family: string) {
  return (PRODUCTION_ADVANCED_FAMILIES as readonly string[]).includes(family);
}

function productionAdvancedCount(state: CorpusSchedulerState) {
  return PRODUCTION_ADVANCED_FAMILIES.reduce(
    (sum, family) => sum + (state.familyCounts[family] ?? 0),
    0,
  );
}

function productionAdvancedDistinctCount(state: CorpusSchedulerState) {
  return PRODUCTION_ADVANCED_FAMILIES.filter((family) => (state.familyCounts[family] ?? 0) > 0).length;
}

function productionAdvancedNeeded(state: CorpusSchedulerState) {
  if (state.profile.id === "advanced_coverage_audit" || state.targetCount !== 60) {
    return false;
  }
  const remainingSlots = state.targetCount - state.acceptedCount;
  const requiredByNow = Math.floor(((state.acceptedCount + 1) * STANDARD_ADVANCED_MIN_COUNT) / state.targetCount);
  const countDeficit = Math.max(0, STANDARD_ADVANCED_MIN_COUNT - productionAdvancedCount(state));
  const distinctDeficit = Math.max(0, STANDARD_ADVANCED_MIN_DISTINCT - productionAdvancedDistinctCount(state));
  if (productionAdvancedCount(state) < requiredByNow) {
    return true;
  }
  return countDeficit > 0 && remainingSlots <= countDeficit + Math.max(0, distinctDeficit - countDeficit) + 18;
}

function firstNeededAdvancedMotif(state: CorpusSchedulerState, slotIndex: number) {
  const preferUnused = productionAdvancedDistinctCount(state) < STANDARD_ADVANCED_MIN_DISTINCT;
  for (let offset = 0; offset < PRODUCTION_ADVANCED_MOTIFS.length; offset += 1) {
    const motif = PRODUCTION_ADVANCED_MOTIFS[(slotIndex + offset) % PRODUCTION_ADVANCED_MOTIFS.length]!;
    const family = MOTIF_FAMILY[motif] ?? motif;
    if (preferUnused && (state.familyCounts[family] ?? 0) > 0) {
      continue;
    }
    if (!cappedMotif(state, motif)) {
      return motif;
    }
  }
  for (let offset = 0; offset < PRODUCTION_ADVANCED_MOTIFS.length; offset += 1) {
    const motif = PRODUCTION_ADVANCED_MOTIFS[(slotIndex + offset) % PRODUCTION_ADVANCED_MOTIFS.length]!;
    if (!cappedMotif(state, motif)) {
      return motif;
    }
  }
  return undefined;
}

function relationFamilyCount(state: CorpusSchedulerState) {
  return (
    (state.familyCounts.single_relation ?? 0) +
    (state.familyCounts.two_step_relation_chain ?? 0) +
    (state.familyCounts.multi_step_relation_chain ?? 0)
  );
}

function scaledFamilyCap(state: CorpusSchedulerState, per60: number) {
  if (state.targetCount <= 60) {
    return per60;
  }
  return Math.max(per60, Math.floor((state.targetCount * per60) / 60));
}

function proportionalFamilyCap(state: CorpusSchedulerState, family: string) {
  if (family === "election_margin") {
    return scaledFamilyCap(state, 5);
  }
  return undefined;
}

function isElectionFamily(problem: any, topology: string) {
  const text = [
    problem?.subtype,
    problem?.category,
    problem?.reasoningPattern,
    problem?.topology?.family,
    problem?.topology?.variant,
    topology,
  ].join(" ");
  return /election|vote|voter|registered|valid_vote|valid vote|direct_margin|invalid_vote_margin|turnout_margin|filtered_valid_vote_margin|remaining_vote_margin|multi_candidate_margin/iu.test(text);
}

function familyKey(problem: any, topology: string) {
  const subtype = String(problem?.subtype ?? "unknown");
  const variant = String(problem?.topology?.variant ?? topology);
  const relationCount = Math.trunc(Number(problem?.variables?.relationCount ?? 0));

  if (problem?.category === "ratio_proportion") {
    return subtype;
  }

  if (problem?.category === "time_work") {
    return subtype;
  }

  if (isElectionFamily(problem, topology)) {
    return "election_margin";
  }

  if (subtype === "relational_percentage") {
    if (relationCount <= 1 || variant.includes("single_relation")) {
      return "single_relation";
    }
    if (relationCount === 2 || variant.includes("two_step")) {
      return "two_step_relation_chain";
    }
    return "multi_step_relation_chain";
  }

  if (problem?.category === "interest") {
    return subtype;
  }

  return subtype;
}

function smallBatchFamilyCap(state: CorpusSchedulerState, family: string) {
  if (state.profile.id === "advanced_coverage_audit") {
    return undefined;
  }
  if (state.targetCount > 60) {
    if (state.targetCount >= 500 && state.targetCount <= 2000) {
      const largeAuditCaps: Record<string, number> = {
        two_step_relation_chain: 45,
        multi_step_relation_chain: 35,
        pass_fail: 40,
        population_growth: 40,
        election_margin: 35,
        perc_budget_cascading_remainder: 8,
        pl_cp_sp_percent: 40,
        pl_cp_percent_to_sp: 40,
        pl_sp_percent_to_cp: 40,
        pl_mp_for_target_profit: 35,
        pl_successive_discounts: 45,
        pl_equal_sp_profit_loss: 45,
        pl_two_article_overall: 45,
        pl_no_profit_no_loss: 25,
        pl_cp_mp_discount_to_percent: 35,
        pl_mp_discount_to_sp: 35,
        pl_mp_sp_discount_percent: 35,
        pl_asymmetric_item_equivalence: 35,
        pl_fractional_value_shift: 35,
        pl_loss_recovery_cp_from_difference: 35,
        pl_required_sp_after_loss: 35,
        pl_sp_difference_two_rates: 35,
        pl_markup_discount_triangle: 35,
        pl_target_profit_discount_calibration: 35,
        pl_target_profit_mp_calibration: 35,
        pl_successive_discount_equivalent: 40,
        pl_dual_item_identical_sp: 40,
        pl_dual_item_mixed_baseline: 35,
        pl_partial_inventory_allocation: 35,
        pl_equal_profit_loss_amount: 35,
        pl_same_profit_amount_different_rates: 35,
        pl_sequential_supply_chain: 35,
        pl_supply_chain_mixed_profit_loss: 35,
        pl_compound_error_baseline_shift: 35,
        pl_dishonest_dealer_weight_fraud: 35,
        pl_dishonest_dealer_dual_fraud: 35,
        pl_dishonest_dealer_absolute_hybrid: 35,
        pl_buy_get_free_discount: 35,
        pl_hybrid_promotion_scaling: 35,
        pl_cashback_coupon_discount: 35,
        pl_gst_after_discount: 35,
        pl_tax_inclusive_back_calc: 35,
        pl_profit_after_commission_tax: 35,
        pl_repair_overhead_cost: 35,
        pl_required_sp_after_overhead: 35,
        pl_manufacturing_breakdown: 35,
        pl_inverse_cp_from_mp_discount_profit: 35,
        pl_inverse_discount_from_cp_mp_profit: 35,
        pl_inverse_markup_from_cp_discount_profit: 35,
        pl_multi_condition_inverse_absolute: 35,
      };
      if (family.startsWith("pl_")) {
        return largeAuditCaps[family] ?? 60;
      }
      if (family.startsWith("int_")) {
        return 35;
      }
      if (family.startsWith("rp_")) {
        return 35;
      }
      if (family.startsWith("tw_") || family.startsWith("pc_")) {
        return 12;
      }
      return largeAuditCaps[family] ?? 45;
    }
    return proportionalFamilyCap(state, family);
  }
  const fixedCap = SMALL_BATCH_FAMILY_CAPS[family];
  if (family.startsWith("int_") && fixedCap === undefined) {
    return 3;
  }
  if (family.startsWith("rp_") && fixedCap === undefined) {
    return 3;
  }
  if ((family.startsWith("tw_") || family.startsWith("pc_")) && fixedCap === undefined) {
    return 2;
  }
  const proportionalCap = proportionalFamilyCap(state, family);
  if (fixedCap === undefined) {
    return proportionalCap ?? DEFAULT_SMALL_BATCH_FAMILY_CAP;
  }
  if (proportionalCap === undefined) {
    return fixedCap;
  }
  return Math.min(fixedCap, proportionalCap);
}

const MOTIF_FAMILY: Record<string, string> = {
  perc_vote_election: "election_margin",
  perc_price_consumption: "price_consumption",
  perc_salary_hike: "salary_revision",
  perc_income_savings_expense: "salary_revision",
  perc_sales_commission: "salary_revision",
  perc_tax_income: "salary_revision",
  perc_mixture_water_add: "mixture_percentage",
  perc_reverse_find: "reverse_percentage",
  perc_restore_value: "restore_original",
  perc_relational_chain: "two_step_relation_chain",
  perc_reverse_relation: "two_step_relation_chain",
  perc_exam_pass_fail: "pass_fail",
  perc_population_growth: "population_growth",
  perc_successive_hike: "population_growth",
  perc_ratio_percentage_hybrid: "two_step_relation_chain",
  pl_cp_sp_percent: "pl_cp_sp_percent",
  pl_cp_percent_to_sp: "pl_cp_percent_to_sp",
  pl_sp_percent_to_cp: "pl_sp_percent_to_cp",
  pl_mp_discount_to_sp: "pl_mp_discount_to_sp",
  pl_mp_sp_discount_percent: "pl_mp_sp_discount_percent",
  pl_cp_mp_discount_to_percent: "pl_cp_mp_discount_to_percent",
  pl_successive_discounts: "pl_successive_discounts",
  pl_mp_for_target_profit: "pl_mp_for_target_profit",
  pl_equal_sp_profit_loss: "pl_equal_sp_profit_loss",
  pl_two_article_overall: "pl_two_article_overall",
  pl_no_profit_no_loss: "pl_no_profit_no_loss",
  pl_asymmetric_item_equivalence: "pl_asymmetric_item_equivalence",
  pl_fractional_value_shift: "pl_fractional_value_shift",
  pl_loss_recovery_cp_from_difference: "pl_loss_recovery_cp_from_difference",
  pl_required_sp_after_loss: "pl_required_sp_after_loss",
  pl_sp_difference_two_rates: "pl_sp_difference_two_rates",
  pl_markup_discount_triangle: "pl_markup_discount_triangle",
  pl_target_profit_discount_calibration: "pl_target_profit_discount_calibration",
  pl_target_profit_mp_calibration: "pl_target_profit_mp_calibration",
  pl_successive_discount_equivalent: "pl_successive_discount_equivalent",
  pl_dual_item_identical_sp: "pl_dual_item_identical_sp",
  pl_dual_item_mixed_baseline: "pl_dual_item_mixed_baseline",
  pl_partial_inventory_allocation: "pl_partial_inventory_allocation",
  pl_equal_profit_loss_amount: "pl_equal_profit_loss_amount",
  pl_same_profit_amount_different_rates: "pl_same_profit_amount_different_rates",
  pl_sequential_supply_chain: "pl_sequential_supply_chain",
  pl_supply_chain_mixed_profit_loss: "pl_supply_chain_mixed_profit_loss",
  pl_compound_error_baseline_shift: "pl_compound_error_baseline_shift",
  pl_dishonest_dealer_weight_fraud: "pl_dishonest_dealer_weight_fraud",
  pl_dishonest_dealer_dual_fraud: "pl_dishonest_dealer_dual_fraud",
  pl_dishonest_dealer_absolute_hybrid: "pl_dishonest_dealer_absolute_hybrid",
  pl_buy_get_free_discount: "pl_buy_get_free_discount",
  pl_hybrid_promotion_scaling: "pl_hybrid_promotion_scaling",
  pl_cashback_coupon_discount: "pl_cashback_coupon_discount",
  pl_gst_after_discount: "pl_gst_after_discount",
  pl_tax_inclusive_back_calc: "pl_tax_inclusive_back_calc",
  pl_profit_after_commission_tax: "pl_profit_after_commission_tax",
  pl_repair_overhead_cost: "pl_repair_overhead_cost",
  pl_required_sp_after_overhead: "pl_required_sp_after_overhead",
  pl_manufacturing_breakdown: "pl_manufacturing_breakdown",
  pl_inverse_cp_from_mp_discount_profit: "pl_inverse_cp_from_mp_discount_profit",
  pl_inverse_discount_from_cp_mp_profit: "pl_inverse_discount_from_cp_mp_profit",
  pl_inverse_markup_from_cp_discount_profit: "pl_inverse_markup_from_cp_discount_profit",
  pl_multi_condition_inverse_absolute: "pl_multi_condition_inverse_absolute",
  rp_direct_sharing: "rp_direct_sharing",
  rp_sum_based_ratio_recovery: "rp_sum_based_ratio_recovery",
  rp_difference_based_ratio_recovery: "rp_difference_based_ratio_recovery",
  rp_missing_term_proportion: "rp_missing_term_proportion",
  rp_ratio_to_fraction: "rp_ratio_to_fraction",
  rp_fraction_to_ratio: "rp_fraction_to_ratio",
  rp_ratio_after_increase: "rp_ratio_after_increase",
  rp_ratio_after_decrease: "rp_ratio_after_decrease",
  rp_ratio_after_transfer: "rp_ratio_after_transfer",
  rp_age_future_ratio: "rp_age_future_ratio",
  rp_age_past_ratio: "rp_age_past_ratio",
  rp_partnership_basic: "rp_partnership_basic",
  rp_partnership_time_variation: "rp_partnership_time_variation",
  rp_direct_variation_basic: "rp_direct_variation_basic",
  rp_inverse_variation_basic: "rp_inverse_variation_basic",
  rp_joint_variation: "rp_joint_variation",
  rp_combined_direct_inverse: "rp_combined_direct_inverse",
  rp_map_scale_ratio: "rp_map_scale_ratio",
  rp_side_area_volume_ratio: "rp_side_area_volume_ratio",
  rp_chain_ratio_network: "rp_chain_ratio_network",
  rp_equivalent_ratio_generation: "rp_equivalent_ratio_generation",
  rp_ratio_to_percentage: "rp_ratio_to_percentage",
  rp_percentage_to_ratio: "rp_percentage_to_ratio",
  rp_product_based_ratio_recovery: "rp_product_based_ratio_recovery",
  rp_partial_value_ratio_recovery: "rp_partial_value_ratio_recovery",
  rp_ratio_after_exchange: "rp_ratio_after_exchange",
  rp_ratio_restoration: "rp_ratio_restoration",
  rp_reverse_ratio_scaling: "rp_reverse_ratio_scaling",
  rp_age_difference_constant: "rp_age_difference_constant",
  rp_age_multi_generation: "rp_age_multi_generation",
  rp_partnership_partial_exit: "rp_partnership_partial_exit",
  rp_partnership_profit_distribution: "rp_partnership_profit_distribution",
  rp_population_gender_ratio: "rp_population_gender_ratio",
  rp_voter_turnout_ratio: "rp_voter_turnout_ratio",
  rp_marks_distribution_ratio: "rp_marks_distribution_ratio",
  rp_recipe_scaling_ratio: "rp_recipe_scaling_ratio",
  rp_blueprint_scaling: "rp_blueprint_scaling",
  rp_shadow_height_ratio: "rp_shadow_height_ratio",
  rp_similarity_scaling: "rp_similarity_scaling",
  rp_weighted_ratio_balancing: "rp_weighted_ratio_balancing",
  rp_multi_equation_ratio: "rp_multi_equation_ratio",
  rp_ratio_graph_deduction: "rp_ratio_graph_deduction",
  rp_circular_ratio_dependency: "rp_circular_ratio_dependency",
  rp_hidden_total_trap: "rp_hidden_total_trap",
  rp_fractional_distribution_chain: "rp_fractional_distribution_chain",
  rp_variable_power_variation: "rp_variable_power_variation",
  rp_workforce_inverse_variation: "rp_workforce_inverse_variation",
  rp_speed_distance_inverse: "rp_speed_distance_inverse",
  rp_inventory_allocation: "rp_inventory_allocation",
  rp_liquid_replacement_ratio: "rp_liquid_replacement_ratio",
  perc_venn_diagram: "venn_diagram",
  perc_taxation: "taxation",
  perc_commission: "commission",
  perc_geom_dimensional_scale: "perc_geom_dimensional_scale",
  perc_demo_cross_tab_literacy: "perc_demo_cross_tab_literacy",
  perc_budget_cascading_remainder: "perc_budget_cascading_remainder",
  perc_const_absolute_offset: "perc_const_absolute_offset",
  perc_exam_weighted_aggregate: "perc_exam_weighted_aggregate",
  perc_asset_variable_depreciation: "perc_asset_variable_depreciation",
  perc_workforce_hierarchical_attrition: "perc_workforce_hierarchical_attrition",
  perc_elect_three_candidate_forfeiture: "election_margin",
  perc_agri_land_yield_compound: "perc_agri_land_yield_compound",
  perc_demo_multi_factor_growth: "perc_demo_multi_factor_growth",
  perc_comm_tiered_salary_override: "perc_comm_tiered_salary_override",
  perc_asset_compound_leakage: "perc_asset_compound_leakage",
  perc_num_linear_equation_balancing: "perc_num_linear_equation_balancing",
  perc_num_fractional_perturbation_complex: "perc_num_fractional_perturbation_complex",
  perc_tax_bracket_retained_income: "perc_tax_bracket_retained_income",
  perc_num_square_proportional_delta: "perc_num_square_proportional_delta",
  perc_mix_alloy_replacement: "perc_mix_alloy_replacement",
  ...Object.fromEntries(TIME_WORK_FAMILY_IDS.map((family) => [family, family])),
};

const PRODUCTION_FALLBACK_MOTIFS = [
  "perc_price_consumption",
  "perc_reverse_find",
  "perc_restore_value",
  "perc_mixture_water_add",
  "perc_exam_pass_fail",
  "perc_relational_chain",
  "perc_reverse_relation",
  "perc_venn_diagram",
  "perc_taxation",
  "perc_commission",
  "perc_salary_hike",
  "perc_population_growth",
  ...PRODUCTION_ADVANCED_MOTIFS,
];

const RATIO_PROPORTION_FALLBACK_MOTIFS = [
  "rp_direct_sharing",
  "rp_sum_based_ratio_recovery",
  "rp_difference_based_ratio_recovery",
  "rp_missing_term_proportion",
  "rp_ratio_to_fraction",
  "rp_fraction_to_ratio",
  "rp_ratio_after_increase",
  "rp_ratio_after_decrease",
  "rp_ratio_after_transfer",
  "rp_age_future_ratio",
  "rp_age_past_ratio",
  "rp_partnership_basic",
  "rp_partnership_time_variation",
  "rp_direct_variation_basic",
  "rp_inverse_variation_basic",
  "rp_joint_variation",
  "rp_combined_direct_inverse",
  "rp_map_scale_ratio",
  "rp_side_area_volume_ratio",
  "rp_chain_ratio_network",
  "rp_equivalent_ratio_generation",
  "rp_ratio_to_percentage",
  "rp_percentage_to_ratio",
  "rp_product_based_ratio_recovery",
  "rp_partial_value_ratio_recovery",
  "rp_ratio_after_exchange",
  "rp_ratio_restoration",
  "rp_reverse_ratio_scaling",
  "rp_age_difference_constant",
  "rp_age_multi_generation",
  "rp_partnership_partial_exit",
  "rp_partnership_profit_distribution",
  "rp_population_gender_ratio",
  "rp_voter_turnout_ratio",
  "rp_marks_distribution_ratio",
  "rp_recipe_scaling_ratio",
  "rp_blueprint_scaling",
  "rp_shadow_height_ratio",
  "rp_similarity_scaling",
  "rp_weighted_ratio_balancing",
  "rp_multi_equation_ratio",
  "rp_ratio_graph_deduction",
  "rp_circular_ratio_dependency",
  "rp_hidden_total_trap",
  "rp_fractional_distribution_chain",
  "rp_variable_power_variation",
  "rp_workforce_inverse_variation",
  "rp_speed_distance_inverse",
  "rp_inventory_allocation",
  "rp_liquid_replacement_ratio",
] as const;

const TIME_WORK_FALLBACK_MOTIFS = [...TIME_WORK_FAMILY_IDS] as const;

function cappedMotif(state: CorpusSchedulerState, motifId: string | undefined) {
  const family = motifId ? MOTIF_FAMILY[motifId] : undefined;
  if (
    family &&
    ["single_relation", "two_step_relation_chain", "multi_step_relation_chain"].includes(family) &&
    state.profile.id !== "advanced_coverage_audit" &&
    state.targetCount <= 60 &&
    relationFamilyCount(state) >= STANDARD_RELATION_FAMILY_CAP
  ) {
    return true;
  }
  const cap = family ? smallBatchFamilyCap(state, family) : undefined;
  return cap !== undefined && (state.familyCounts[family!] ?? 0) >= cap;
}

function firstUncappedMotif(state: CorpusSchedulerState, slotIndex: number) {
  const rotation = state.profile.preferredMotifRotation;
  for (let offset = 0; offset < rotation.length; offset += 1) {
    const motif = rotation[(slotIndex + offset) % rotation.length]!;
    if (!cappedMotif(state, motif)) {
      return motif;
    }
  }
  const fallbackMotifs =
    state.profile.topicId === "ratio_proportion"
      ? RATIO_PROPORTION_FALLBACK_MOTIFS
      : state.profile.topicId === "time_work"
        ? TIME_WORK_FALLBACK_MOTIFS
      : PRODUCTION_FALLBACK_MOTIFS;
  for (let offset = 0; offset < fallbackMotifs.length; offset += 1) {
    const motif = fallbackMotifs[(slotIndex + offset) % fallbackMotifs.length]!;
    if (!cappedMotif(state, motif)) {
      return motif;
    }
  }
  return rotation[slotIndex % rotation.length]!;
}

export function extractCorpusSchedulerMetadata(
  question: FormulaQuestion,
): CorpusSchedulerCandidateMetadata {
  const payload = quantV2(question);
  const problem = payload.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
  const graph = payload.reasoningGraph ?? question.reasoningGraph;
  const semantic = payload.semanticMetadata ?? {};
  const topology = topologyKey(problem, payload);
  const family = familyKey(problem, topology);
  const group = topologyGroup(problem, graph, topology);
  const examinerIntent =
    semantic.examinerIntent?.primaryIntent ??
    payload.examinerIntent?.primaryIntent ??
    (question.examRealismMetadata as any)?.examinerIntent?.primaryIntent ??
    "unknown_intent";
  const canonicalScenario =
    semantic.canonicalScenario ??
    payload.canonicalScenario ??
    (question.semanticMetadata as any)?.canonicalScenario ??
    {};
  const semanticAnchor = [
    canonicalScenario.domain ?? payload.category ?? problem?.category ?? "unknown_domain",
    canonicalScenario.object ?? payload.subtype ?? problem?.subtype ?? "unknown_object",
  ].join(":");
  const distractorTraps =
    semantic.distractorIntelligence?.map((item: any) => String(item.trapType)) ??
    question.optionMetadata
      ?.filter((item) => !item.isCorrect)
      .map((item: any) => String(item.reasoningTrap ?? item.distractorType)) ??
    [];
  const difficulty = String(problem?.difficulty ?? question.difficulty ?? "medium")
    .toLowerCase() as "easy" | "medium" | "hard";
  const fingerprints = semantic.corpusFingerprints ?? payload.corpusFingerprints ?? {};
  const operationFingerprint = String(
    fingerprints.operationFingerprint ??
    (graph?.steps ?? [])
      .map((step: any) => `${step.type}:${step.descriptionKey}`)
      .join(">") ??
    "operation",
  );
  const percentageVectorFingerprint = String(
    fingerprints.percentageVectorFingerprint ?? "vector",
  );
  const fingerprintKey =
    fingerprints.compositeFingerprint ??
    [
      fingerprints.topologyFingerprint ?? topology,
      fingerprints.operationFingerprint ?? "operation",
      fingerprints.percentageVectorFingerprint ?? "vector",
      fingerprints.semanticIntentFingerprint ?? semanticAnchor,
      fingerprints.distractorPatternFingerprint ?? distractorTraps.join("|"),
    ].join("::");
  const finalFingerprint = finalDuplicateFingerprint(question);
  const stemOpening = String(question.text ?? "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ")
    .toLowerCase();
  const answerPattern = [
    String(problem?.subtype ?? payload.subtype ?? "unknown"),
    String(question.options?.[question.correct ?? 0] ?? problem?.answer ?? ""),
  ]
    .join(":")
    .replace(/\d+(?:\.\d+)?/gu, "#")
    .toLowerCase();

  return {
    topologyKey: topology,
    topologyGroup: group,
    examinerIntent: String(examinerIntent),
    semanticAnchor,
    distractorTraps,
    difficulty: ["easy", "medium", "hard"].includes(difficulty)
      ? difficulty
      : "medium",
    fingerprintKey: String(fingerprintKey),
    finalDuplicateFingerprintKey: finalFingerprint,
    topologyVectorKey: `${topology}::${percentageVectorFingerprint}`,
    operationFingerprint,
    stemOpening,
    answerPattern,
    familyKey: family,
    multiStep: group === "multi_step" || (graph?.steps?.length ?? 0) >= 4,
    trivialDirectRelation:
      String(problem?.subtype ?? payload.subtype ?? "") === "relational_percentage" &&
      /Find by what percent A's income is more or less than B's income/iu.test(
        String(question.text ?? ""),
      ),
  };
}

function projectedShare(
  state: CorpusSchedulerState,
  map: Record<string, number>,
  key: string,
) {
  return normalizeShare((map[key] ?? 0) + 1, state.acceptedCount + 1);
}

function deficitBonus(
  currentShare: number,
  targetShare: number,
  weight: number,
) {
  return currentShare < targetShare ? (targetShare - currentShare) * weight : 0;
}

export function assessCorpusSchedulerCandidate(input: {
  state: CorpusSchedulerState;
  question: FormulaQuestion;
  index: number;
}): CorpusSchedulerCandidateAssessment {
  const metadata = extractCorpusSchedulerMetadata(input.question);
  const state = input.state;
  const reasons: string[] = [];
  let score = 100;
  const projectedTotal = state.acceptedCount + 1;

  if (state.fingerprintCounts[metadata.fingerprintKey]) {
    score -= 80;
    reasons.push("fingerprint collision");
  }
  const finalDuplicateCollision =
    Boolean(state.finalDuplicateFingerprintCounts[metadata.finalDuplicateFingerprintKey]);
  const finalDuplicateHardBlock =
    finalDuplicateCollision &&
    state.targetCount <= 200 &&
    state.profile.id !== "advanced_coverage_audit";
  if (finalDuplicateCollision) {
    score -= finalDuplicateHardBlock ? 10000 : 80;
    reasons.push("final rendered duplicate");
  }
  if (state.topologyVectorCounts[metadata.topologyVectorKey]) {
    score -= 70;
    reasons.push("topology plus percentage-vector collision");
  }
  if (
    state.operationCounts[metadata.operationFingerprint] &&
    projectedShare(state, state.operationCounts, metadata.operationFingerprint) > 0.1
  ) {
    score -= 32;
    reasons.push("operation-chain repetition");
  }
  if (
    metadata.stemOpening &&
    state.stemOpeningCounts[metadata.stemOpening] &&
    projectedShare(state, state.stemOpeningCounts, metadata.stemOpening) > 0.04
  ) {
    score -= 35;
    reasons.push("stem opening repetition");
  }
  if (
    state.answerPatternCounts[metadata.answerPattern] &&
    projectedShare(state, state.answerPatternCounts, metadata.answerPattern) > 0.08
  ) {
    score -= 26;
    reasons.push("answer-pattern repetition");
  }
  if (state.recentExaminerIntents.slice(-4).includes(metadata.examinerIntent)) {
    score -= 22;
    reasons.push("examiner intent repeated too close");
  }
  if (state.recentTopologyKeys.slice(-5).includes(metadata.topologyKey)) {
    score -= 26;
    reasons.push("topology repeated too close");
  }
  if (state.recentSemanticAnchors.slice(-5).includes(metadata.semanticAnchor)) {
    score -= 24;
    reasons.push("semantic anchor repeated too close");
  }
  if (
    projectedShare(state, state.topologyCounts, metadata.topologyKey) >
    state.profile.maxShare.singleTopologyFamily
  ) {
    score -= 28;
    reasons.push("topology clustering");
  }
  if (
    projectedShare(state, state.examinerIntentCounts, metadata.examinerIntent) >
    state.profile.maxShare.singleExaminerIntent
  ) {
    score -= 26;
    reasons.push("examiner intent clustering");
  }
  if (
    projectedShare(state, state.semanticAnchorCounts, metadata.semanticAnchor) >
    state.profile.maxShare.singleSemanticAnchor
  ) {
    score -= 30;
    reasons.push("semantic anchor clustering");
  }
  for (const trap of metadata.distractorTraps) {
    if (
      projectedShare(state, state.distractorTrapCounts, trap) >
      state.profile.maxShare.singleDistractorTrap
    ) {
      score -= 8;
      reasons.push(`distractor trap clustering: ${trap}`);
    }
  }
  const familyCap = smallBatchFamilyCap(state, metadata.familyKey);
  let familyCapExceeded = false;
  if (
    state.profile.id !== "advanced_coverage_audit" &&
    state.targetCount <= 60 &&
    ["single_relation", "two_step_relation_chain", "multi_step_relation_chain"].includes(metadata.familyKey) &&
    relationFamilyCount(state) + 1 > STANDARD_RELATION_FAMILY_CAP
  ) {
    familyCapExceeded = true;
    score -= 95;
    reasons.push("family cap exceeded: relation_chain_total");
  }
  if (
    familyCap !== undefined &&
    (state.familyCounts[metadata.familyKey] ?? 0) + 1 > familyCap
  ) {
    familyCapExceeded = true;
    score -= 95;
    reasons.push(`family cap exceeded: ${metadata.familyKey}`);
  }
  if (metadata.trivialDirectRelation) {
    familyCapExceeded = true;
    score -= 95;
    reasons.push("trivial direct relation suppressed");
  }
  if (
    productionAdvancedNeeded(state) &&
    !isProductionAdvancedFamily(metadata.familyKey)
  ) {
    score -= 55;
    reasons.push("advanced production coverage deficit");
  }
  if (
    metadata.topologyGroup === "simple_template" &&
    normalizeShare(
      (state.topologyGroupCounts.simple_template ?? 0) + 1,
      projectedTotal,
    ) > state.profile.maxShare.simpleTemplate
  ) {
    score -= 44;
    reasons.push("simple-template saturation");
  }
  if (
    metadata.difficulty === "hard" &&
    state.hardStreak >= state.profile.maxShare.hardStreak
  ) {
    score -= 25;
    reasons.push("hard difficulty pacing streak");
  }

  const difficultyShare = normalizeShare(
    state.difficultyCounts[metadata.difficulty] ?? 0,
    Math.max(1, state.acceptedCount),
  );
  score += deficitBonus(
    difficultyShare,
    state.profile.difficultyTarget[metadata.difficulty],
    20,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.reverse_logic ?? 0, state.acceptedCount),
    state.profile.minShare.reverseLogic,
    metadata.topologyGroup === "reverse_logic" ? 35 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.relational ?? 0, state.acceptedCount),
    state.profile.minShare.relational,
    metadata.topologyGroup === "relational" ? 35 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.filtered ?? 0, state.acceptedCount),
    state.profile.minShare.filtered,
    metadata.topologyGroup === "filtered" ? 28 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.hybrid ?? 0, state.acceptedCount),
    state.profile.minShare.hybrid,
    metadata.topologyGroup === "hybrid" ? 28 : 0,
  );
  score += deficitBonus(
    normalizeShare(state.topologyGroupCounts.multi_step ?? 0, state.acceptedCount),
    state.profile.minShare.multiStep,
    metadata.multiStep ? 20 : 0,
  );

  const accepted = !finalDuplicateHardBlock && !familyCapExceeded && (score >= 72 || input.index < 2);
  return {
    accepted,
    score: Math.round(score),
    reasons,
    metadata,
  };
}

export function recordCorpusSchedulerCandidate(
  state: CorpusSchedulerState,
  assessment: CorpusSchedulerCandidateAssessment,
) {
  const metadata = assessment.metadata;
  state.acceptedCount += 1;
  increment(state.topologyCounts, metadata.topologyKey);
  increment(state.topologyGroupCounts, metadata.topologyGroup);
  increment(state.examinerIntentCounts, metadata.examinerIntent);
  increment(state.semanticAnchorCounts, metadata.semanticAnchor);
  increment(state.difficultyCounts, metadata.difficulty);
  increment(state.familyCounts, metadata.familyKey);
  increment(state.fingerprintCounts, metadata.fingerprintKey);
  increment(state.finalDuplicateFingerprintCounts, metadata.finalDuplicateFingerprintKey);
  increment(state.topologyVectorCounts, metadata.topologyVectorKey);
  increment(state.operationCounts, metadata.operationFingerprint);
  increment(state.answerPatternCounts, metadata.answerPattern);
  if (metadata.stemOpening) {
    increment(state.stemOpeningCounts, metadata.stemOpening);
  }
  state.recentExaminerIntents = [...state.recentExaminerIntents, metadata.examinerIntent].slice(-8);
  state.recentTopologyKeys = [...state.recentTopologyKeys, metadata.topologyKey].slice(-8);
  state.recentSemanticAnchors = [...state.recentSemanticAnchors, metadata.semanticAnchor].slice(-8);
  for (const trap of metadata.distractorTraps) {
    increment(state.distractorTrapCounts, trap);
  }
  state.hardStreak = metadata.difficulty === "hard" ? state.hardStreak + 1 : 0;
  if (assessment.reasons.includes("hard difficulty pacing streak")) {
    state.pacingEvents.push(`Hard-streak softened near slot ${state.acceptedCount}.`);
  }
}

export function rejectCorpusSchedulerCandidate(
  state: CorpusSchedulerState,
  assessment: CorpusSchedulerCandidateAssessment,
) {
  for (const reason of assessment.reasons) {
    increment(state.rejectionReasons, reason);
  }
}

export function suggestSchedulerMotif(
  state: CorpusSchedulerState,
  slotIndex: number,
) {
  const percentageProfile =
    state.profile.topicId === "percentage" ||
    (
      !state.profile.topicId &&
      state.profile.preferredMotifRotation.some(
        (motif) => motif.startsWith("perc_"),
      )
    );

  if (!percentageProfile) {
    return firstUncappedMotif(state, slotIndex);
  }

  if (state.profile.id === "advanced_coverage_audit") {
    return firstUncappedMotif(state, slotIndex);
  }
  if (productionAdvancedNeeded(state)) {
    const advancedMotif = firstNeededAdvancedMotif(state, slotIndex);
    if (advancedMotif) {
      return advancedMotif;
    }
  }
  const accepted = Math.max(1, state.acceptedCount);
  const groups = state.topologyGroupCounts;
  if (
    normalizeShare(groups.relational ?? 0, accepted) <
    state.profile.minShare.relational
  ) {
    return cappedMotif(state, "perc_relational_chain")
      ? firstUncappedMotif(state, slotIndex)
      : "perc_relational_chain";
  }
  if (
    normalizeShare(groups.reverse_logic ?? 0, accepted) <
    state.profile.minShare.reverseLogic
  ) {
    const motif = slotIndex % 2 === 0 ? "perc_reverse_find" : "perc_restore_value";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  if (
    normalizeShare(groups.filtered ?? 0, accepted) <
    state.profile.minShare.filtered
  ) {
    const motif = slotIndex % 2 === 0
      ? "perc_vote_election"
      : "perc_population_growth";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  if (
    normalizeShare(groups.hybrid ?? 0, accepted) <
    state.profile.minShare.hybrid
  ) {
    const motif = slotIndex % 2 === 0
      ? "perc_ratio_percentage_hybrid"
      : "perc_price_consumption";
    return cappedMotif(state, motif) ? firstUncappedMotif(state, slotIndex) : motif;
  }
  return firstUncappedMotif(state, slotIndex);
}

export function createScheduledGeneratorOptions(input: {
  state: CorpusSchedulerState;
  index: number;
  attempt: number;
  seedPrefix: string;
  examProfile?: GeneratorOptions["examProfile"];
  forcedMotifId?: string;
}): GeneratorOptions {
  return {
    seed: `${input.seedPrefix}:scheduled:${input.index}:${input.attempt}`,
    examProfile: input.examProfile,
    forcedMotifId:
      input.forcedMotifId ??
      suggestSchedulerMotif(input.state, input.index + input.attempt),
  };
}

export function summarizeCorpusScheduler(
  state: CorpusSchedulerState,
): CorpusSchedulerSummary {
  const total = Math.max(1, state.acceptedCount);
  const repeatedFingerprintCount = Object.values(state.fingerprintCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedTopologyVectorCount = Object.values(state.topologyVectorCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedOperationCount = Object.values(state.operationCounts).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const repeatedOpeningWarnings = Object.entries(state.stemOpeningCounts)
    .filter(([, count]) => count > Math.max(2, total * 0.06))
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([opening, count]) => `Stem opening repeated ${count} times: ${opening}`);
  const groupShare = (key: string) =>
    normalizeShare(state.topologyGroupCounts[key] ?? 0, total);
  const warnings: string[] = [];

  if (groupShare("simple_template") > state.profile.maxShare.simpleTemplate) {
    warnings.push("simple-template share remains above profile target");
  }
  if (groupShare("relational") < state.profile.minShare.relational) {
    warnings.push("relational share remains below profile target");
  }
  if (groupShare("reverse_logic") < state.profile.minShare.reverseLogic) {
    warnings.push("reverse-logic share remains below profile target");
  }
  if (groupShare("filtered") < state.profile.minShare.filtered) {
    warnings.push("filtered reasoning share remains below profile target");
  }
  if (groupShare("hybrid") < state.profile.minShare.hybrid) {
    warnings.push("hybrid reasoning share remains below profile target");
  }
  if (repeatedFingerprintCount / total > 0.24) {
    warnings.push("fingerprint repetition risk is still visible");
  }
  if (repeatedTopologyVectorCount / total > 0.2) {
    warnings.push("topology plus percentage-vector repetition is still visible");
  }
  if (repeatedOpeningWarnings.length > 0) {
    warnings.push("stem opening repetition needs review");
  }

  return {
    profileId: state.profile.id,
    targetCount: state.targetCount,
    acceptedCount: state.acceptedCount,
    topologyDistribution: state.topologyCounts,
    topologyGroupDistribution: state.topologyGroupCounts,
    examinerIntentDistribution: state.examinerIntentCounts,
    semanticAnchorDistribution: state.semanticAnchorCounts,
    familyDistribution: state.familyCounts,
    distractorTrapDistribution: state.distractorTrapCounts,
    difficultyDistribution: state.difficultyCounts,
    duplicateRisk: {
      repeatedFingerprintCount,
      repeatedFingerprintShare: Number((repeatedFingerprintCount / total).toFixed(4)),
      uniqueFingerprintCount: Object.keys(state.fingerprintCounts).length,
      repeatedTopologyVectorCount,
      repeatedOperationCount,
    },
    pacingReport: {
      hardStreakLimit: state.profile.maxShare.hardStreak,
      events: state.pacingEvents,
    },
    rejectionReasons: state.rejectionReasons,
    repeatedOpeningWarnings,
    balanceWarnings: warnings,
  };
}

export function generateScheduledQuestion(input: {
  state: CorpusSchedulerState;
  index: number;
  seedPrefix: string;
  examProfile?: GeneratorOptions["examProfile"];
  forcedMotifId?: string;
  strict?: boolean;
  generate: (options: GeneratorOptions) => FormulaQuestion;
}) {
  let best:
    | {
        question: FormulaQuestion;
        assessment: CorpusSchedulerCandidateAssessment;
      }
    | undefined;

  for (let attempt = 0; attempt < input.state.profile.maxAttemptsPerSlot; attempt += 1) {
    const question = input.generate(
      createScheduledGeneratorOptions({
        state: input.state,
        index: input.index,
        attempt,
        seedPrefix: input.seedPrefix,
        examProfile: input.examProfile,
        forcedMotifId: input.forcedMotifId,
      }),
    );
    const assessment = assessCorpusSchedulerCandidate({
      state: input.state,
      question,
      index: input.index,
    });
    if (!best || assessment.score > best.assessment.score) {
      best = { question, assessment };
    }
    if (assessment.accepted) {
      break;
    }
    rejectCorpusSchedulerCandidate(input.state, assessment);
  }

  if (!best) {
    throw new Error("Corpus scheduler failed to generate a candidate.");
  }
  if (
    best.assessment.reasons.includes("final rendered duplicate") &&
    best.assessment.score < -9000
  ) {
    throw new Error("Corpus scheduler failed to replace a final rendered duplicate candidate.");
  }
  if (input.strict && !best.assessment.accepted) {
    throw new Error(`Corpus scheduler strict mode rejected candidate: ${best.assessment.reasons.join(", ")}`);
  }
  recordCorpusSchedulerCandidate(input.state, best.assessment);
  return {
    question: best.question,
    assessment: best.assessment,
  };
}
