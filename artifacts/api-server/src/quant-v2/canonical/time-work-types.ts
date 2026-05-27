import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type TimeWorkFamilyId =
  | "tw_basic_combined_work"
  | "tw_basic_residual_work"
  | "tw_efficiency_ratio_scaling"
  | "tw_individual_from_combined"
  | "tw_work_fraction_days"
  | "tw_man_days_hours_basic"
  | "tw_work_done_ratio_from_times"
  | "tw_time_ratio_from_efficiency"
  | "tw_efficiency_from_wages"
  | "tw_one_day_work_fraction"
  | "tw_remaining_work_fraction"
  | "tw_delayed_join"
  | "tw_forward_leave"
  | "tw_backward_leave"
  | "tw_multi_phase_join_leave"
  | "tw_partial_completion_then_team"
  | "tw_interrupted_work"
  | "tw_replacement_worker"
  | "tw_worker_added_to_meet_deadline"
  | "tw_worker_removed_delay"
  | "tw_machine_breakdown_midway"
  | "tw_alternating_days_two_workers"
  | "tw_alternating_hours"
  | "tw_alternating_group_cycle"
  | "tw_terminal_overshoot_cycle"
  | "tw_work_rest_cycle"
  | "tw_conditional_activation"
  | "tw_relative_efficiency_percent"
  | "tw_worker_equivalence_men_women"
  | "tw_worker_equivalence_men_women_children"
  | "tw_group_conversion_and_or"
  | "tw_efficiency_chain"
  | "tw_team_a_vs_team_b"
  | "tw_pairwise_ab_bc_ac"
  | "tw_pairwise_total_abc"
  | "tw_unknown_worker_from_team"
  | "tw_reverse_contribution_deduction"
  | "tw_phase_state_reconstruction"
  | "tw_wage_distribution_efficiency"
  | "tw_wage_with_helper"
  | "tw_wage_partial_time"
  | "tw_wage_efficiency_ratio"
  | "tw_contract_penalty_bonus"
  | "tw_work_quality_rejection"
  | "pc_basic_fill_empty"
  | "pc_two_fillers_one_empty"
  | "pc_leak_hidden_rate"
  | "pc_drain_after_partial_fill"
  | "pc_alternating_fill_empty"
  | "pc_alternating_spill_cycle"
  | "pc_capacity_leakage_rate"
  | "pc_tank_capacity_from_rate"
  | "pc_multiple_pipes_timing"
  | "pc_two_tanks_transfer"
  | "pc_overflow_waste_rate"
  | "pc_partial_tank_initially_filled"
  | "pc_leak_starts_after_fill"
  | "pc_pipe_closed_before_completion"
  | "pc_find_pipe_rate_from_net_time"
  | "tw_food_resource_basic"
  | "tw_food_population_change"
  | "tw_food_remaining_stock"
  | "tw_resource_rate_equivalence"
  | "tw_typist_pages_per_hour"
  | "tw_printer_job_queue"
  | "tw_farm_harvest_workers"
  | "tw_road_construction_work"
  | "tw_painting_walls_area_work"
  | "tw_digging_filling_negative_work"
  | "tw_parallel_machine_batches"
  | "tw_lcm_hidden_total_work"
  | "tw_negative_positive_mixed_work"
  | "tw_productivity_decay"
  | "tw_machine_parallel_scheduling"
  | "tw_contract_deadline_extra_workers";

export type TimeWorkAnswerKind =
  | "time"
  | "fraction"
  | "ratio"
  | "amount"
  | "number"
  | "workers"
  | "output"
  | "rate";

export type TimeWorkAnswerUnit =
  | "none"
  | "days"
  | "hours"
  | "minutes"
  | "fraction"
  | "ratio"
  | "rupees"
  | "workers"
  | "work"
  | "units"
  | "items"
  | "sheets"
  | "litres"
  | "pages"
  | "metres"
  | "percent";

export type TimeWorkLocalizedText = {
  en: string;
  hi: string;
  pa: string;
};

export type TimeWorkExplanationStep = {
  key: string;
  text: TimeWorkLocalizedText;
  math?: string;
  value?: number | string;
};

export type TimeWorkSolverKind =
  | "combined_time"
  | "remaining_fraction"
  | "efficiency_alone_time"
  | "unknown_time_from_combined"
  | "full_time_from_fraction"
  | "man_days_hours"
  | "inverse_ratio_from_times"
  | "time_ratio_from_efficiency"
  | "ratio_from_values"
  | "one_day_fraction"
  | "linear_remaining_time"
  | "linear_total_time"
  | "backward_leave_time"
  | "required_workers"
  | "delay_from_removed_workers"
  | "cycle_time"
  | "equivalent_team_time"
  | "team_compare_time"
  | "pairwise_worker_time"
  | "team_minus_known_time"
  | "contribution_rate"
  | "unknown_phase_duration"
  | "wage_share"
  | "contract_earning"
  | "accepted_output"
  | "pipe_net_time"
  | "leak_hidden_time"
  | "capacity_from_rate"
  | "overflow_waste"
  | "unknown_pipe_time"
  | "resource_days"
  | "resource_phase_days"
  | "weighted_resource_days"
  | "parallel_output"
  | "opposing_net_time"
  | "changed_rate_time"
  | "ratio_text";

export type TimeWorkSolverModel = {
  kind: TimeWorkSolverKind;
  inputs: Record<string, unknown>;
};

export type TimeWorkAuditMeta = {
  seed: string;
  runId: string;
  motifId: TimeWorkFamilyId;
  topologyId: TimeWorkFamilyId;
  stemSkeleton: string;
  numericSignature: string;
  solverAnswer: string;
  explanationFinalAnswer: string;
  difficultyReason: string;
  realismScore: number;
  trapTypes: string[];
};

export type CanonicalTimeWorkProblem = {
  id: string;
  topic: "time-work";
  motifId: TimeWorkFamilyId;
  family: TimeWorkFamilyId;
  topologyId: TimeWorkFamilyId;
  subtype: TimeWorkFamilyId;
  category: "time_work";
  principle: TimeWorkLocalizedText;
  formulaModel: string;
  shortcut: TimeWorkLocalizedText;
  commonTraps: string[];
  variables: Record<string, unknown>;
  stemData: Record<string, unknown>;
  solverModel: TimeWorkSolverModel;
  answer: number | string;
  answerText: string;
  answerKind: TimeWorkAnswerKind;
  answerUnit: TimeWorkAnswerUnit;
  options: string[];
  correct: number;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced";
  topology: {
    family: "time_work";
    variant: TimeWorkFamilyId;
  };
  traps: string[];
  distractors: string[];
  explanationSteps: TimeWorkExplanationStep[];
  localizationData: {
    stem: TimeWorkLocalizedText;
    explanation: TimeWorkLocalizedText;
    options: {
      en: string[];
      hi: string[];
      pa: string[];
    };
  };
  auditMeta: TimeWorkAuditMeta;
};

export type TimeWorkMotifFactory = (input: {
  seed: string;
  runId: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: TimeWorkFamilyId;
}) => CanonicalTimeWorkProblem;
