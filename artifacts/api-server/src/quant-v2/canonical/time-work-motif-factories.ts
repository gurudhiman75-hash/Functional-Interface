import type {
  CanonicalTimeWorkProblem,
  TimeWorkAnswerKind,
  TimeWorkAnswerUnit,
  TimeWorkExplanationStep,
  TimeWorkFamilyId,
  TimeWorkLocalizedText,
  TimeWorkMotifFactory,
  TimeWorkSolverKind,
  TimeWorkSolverModel,
} from "./time-work-types";

type Locale = "en" | "hi" | "pa";

export const TIME_WORK_FAMILY_IDS: readonly TimeWorkFamilyId[] = [
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
  "tw_delayed_join",
  "tw_forward_leave",
  "tw_backward_leave",
  "tw_multi_phase_join_leave",
  "tw_partial_completion_then_team",
  "tw_interrupted_work",
  "tw_replacement_worker",
  "tw_worker_added_to_meet_deadline",
  "tw_worker_removed_delay",
  "tw_machine_breakdown_midway",
  "tw_alternating_days_two_workers",
  "tw_alternating_hours",
  "tw_alternating_group_cycle",
  "tw_terminal_overshoot_cycle",
  "tw_work_rest_cycle",
  "tw_conditional_activation",
  "tw_relative_efficiency_percent",
  "tw_worker_equivalence_men_women",
  "tw_worker_equivalence_men_women_children",
  "tw_group_conversion_and_or",
  "tw_efficiency_chain",
  "tw_team_a_vs_team_b",
  "tw_pairwise_ab_bc_ac",
  "tw_pairwise_total_abc",
  "tw_unknown_worker_from_team",
  "tw_reverse_contribution_deduction",
  "tw_phase_state_reconstruction",
  "tw_wage_distribution_efficiency",
  "tw_wage_with_helper",
  "tw_wage_partial_time",
  "tw_wage_efficiency_ratio",
  "tw_contract_penalty_bonus",
  "tw_work_quality_rejection",
  "pc_basic_fill_empty",
  "pc_two_fillers_one_empty",
  "pc_leak_hidden_rate",
  "pc_drain_after_partial_fill",
  "pc_alternating_fill_empty",
  "pc_alternating_spill_cycle",
  "pc_capacity_leakage_rate",
  "pc_tank_capacity_from_rate",
  "pc_multiple_pipes_timing",
  "pc_two_tanks_transfer",
  "pc_overflow_waste_rate",
  "pc_partial_tank_initially_filled",
  "pc_leak_starts_after_fill",
  "pc_pipe_closed_before_completion",
  "pc_find_pipe_rate_from_net_time",
  "tw_food_resource_basic",
  "tw_food_population_change",
  "tw_food_remaining_stock",
  "tw_resource_rate_equivalence",
  "tw_typist_pages_per_hour",
  "tw_printer_job_queue",
  "tw_farm_harvest_workers",
  "tw_road_construction_work",
  "tw_painting_walls_area_work",
  "tw_digging_filling_negative_work",
  "tw_parallel_machine_batches",
  "tw_lcm_hidden_total_work",
  "tw_negative_positive_mixed_work",
  "tw_productivity_decay",
  "tw_machine_parallel_scheduling",
  "tw_contract_deadline_extra_workers",
];

export const TIME_WORK_TODO_FAMILY_IDS = {
  hidden: [],
} as const;

type Archetype =
  | "combined"
  | "residual"
  | "efficiencyAlone"
  | "unknownCombined"
  | "fractionWork"
  | "manDaysHours"
  | "workRatio"
  | "timeRatio"
  | "wageRatio"
  | "oneDay"
  | "delayedJoin"
  | "forwardLeave"
  | "backwardLeave"
  | "multiPhase"
  | "partialThenTeam"
  | "interrupted"
  | "replacement"
  | "workerAdded"
  | "workerRemoved"
  | "machineBreakdown"
  | "cycleTwo"
  | "cycleHours"
  | "cycleGroup"
  | "terminalCycle"
  | "workRest"
  | "conditionalCycle"
  | "relativePercent"
  | "equivMenWomen"
  | "equivThreeTypes"
  | "orAndTeams"
  | "efficiencyChain"
  | "teamCompare"
  | "pairwiseThree"
  | "teamMinusPair"
  | "unknownWorker"
  | "contributionRate"
  | "unknownPhase"
  | "wageShare"
  | "helperWage"
  | "partialTimeWage"
  | "efficiencyTimeWage"
  | "contractBonus"
  | "qualityRejection"
  | "pipeNet"
  | "twoFillersLeak"
  | "hiddenLeak"
  | "delayedLeak"
  | "pipeCycle"
  | "pipeTerminalCycle"
  | "capacityLeak"
  | "tankCapacity"
  | "pipeTimings"
  | "twoTankTransfer"
  | "overflow"
  | "partialTank"
  | "pipeClosure"
  | "unknownPipe"
  | "foodBasic"
  | "foodPopulationChange"
  | "foodRemaining"
  | "resourceEquivalence"
  | "typingOutput"
  | "printerQueue"
  | "farmHarvest"
  | "roadConstruction"
  | "paintingArea"
  | "digFill"
  | "parallelMachines"
  | "hiddenLcm"
  | "positiveNegative"
  | "productivityDecay"
  | "machineSchedule"
  | "deadlineExtra";

type MotifSpec = {
  id: TimeWorkFamilyId;
  archetype: Archetype;
  difficulty: "easy" | "medium" | "hard";
  complexity: "easy" | "medium" | "hard" | "advanced";
  group:
    | "core"
    | "dynamic"
    | "cycle"
    | "efficiency"
    | "system"
    | "wage"
    | "pipe"
    | "resource"
    | "applied"
    | "advanced";
  principle: TimeWorkLocalizedText;
  formula: string;
  shortcut: TimeWorkLocalizedText;
  traps: string[];
};

const RATE_PRINCIPLE: TimeWorkLocalizedText = {
  en: "Use work = rate x time. Positive rates add and opposite work is subtracted.",
  hi: "काम = दर x समय का उपयोग करें। समान दिशा की दरें जुड़ती हैं और विपरीत काम घटता है।",
  pa: "ਕੰਮ = ਦਰ x ਸਮਾਂ ਵਰਤੋ। ਇੱਕੋ ਦਿਸ਼ਾ ਵਾਲੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਵਿਰੋਧੀ ਕੰਮ ਘਟਦਾ ਹੈ।",
};

const RESOURCE_PRINCIPLE: TimeWorkLocalizedText = {
  en: "Total stock or output equals rate multiplied by active time.",
  hi: "कुल भंडार या उत्पादन दर और सक्रिय समय के गुणनफल के बराबर होता है।",
  pa: "ਕੁੱਲ ਭੰਡਾਰ ਜਾਂ ਉਤਪਾਦਨ ਦਰ ਅਤੇ ਸਰਗਰਮ ਸਮੇਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
};

const PIPE_PRINCIPLE: TimeWorkLocalizedText = {
  en: "A filling pipe has positive rate and an emptying pipe or leak has negative rate.",
  hi: "भरने वाले पाइप की दर धनात्मक और खाली करने वाले पाइप या रिसाव की दर ऋणात्मक मानी जाती है।",
  pa: "ਭਰਨ ਵਾਲੇ ਪਾਈਪ ਦੀ ਦਰ ਧਨਾਤਮਕ ਅਤੇ ਖਾਲੀ ਕਰਨ ਵਾਲੇ ਪਾਈਪ ਜਾਂ ਰਿਸਾਅ ਦੀ ਦਰ ਰਣਾਤਮਕ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।",
};

function spec(
  id: TimeWorkFamilyId,
  archetype: Archetype,
  difficulty: MotifSpec["difficulty"],
  group: MotifSpec["group"],
  formula: string,
  shortcutEn: string,
  traps: string[],
): MotifSpec {
  const complexity =
    difficulty === "easy" ? "easy" : difficulty === "medium" ? "medium" : group === "advanced" ? "advanced" : "hard";
  const principle = group === "pipe" ? PIPE_PRINCIPLE : group === "resource" || group === "applied" ? RESOURCE_PRINCIPLE : RATE_PRINCIPLE;
  return {
    id,
    archetype,
    difficulty,
    complexity,
    group,
    principle,
    formula,
    shortcut: {
      en: shortcutEn,
      hi: "इकाइयों या दरों को पहले साफ रखें, फिर आवश्यक मान निकालें।",
      pa: "ਇਕਾਈਆਂ ਜਾਂ ਦਰਾਂ ਪਹਿਲਾਂ ਸਾਫ ਰੱਖੋ, ਫਿਰ ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ।",
    },
    traps,
  };
}

export const TIME_WORK_MOTIF_SPECS: Record<TimeWorkFamilyId, MotifSpec> = {
  tw_basic_combined_work: spec("tw_basic_combined_work", "combined", "easy", "core", "\\frac{1}{T}=\\frac{1}{A}+\\frac{1}{B}", "For two workers, use T=AB/(A+B).", ["adds times", "averages times"]),
  tw_basic_residual_work: spec("tw_basic_residual_work", "residual", "easy", "core", "R=1-\\frac{t}{T}", "Remaining fraction is unfinished time over total time.", ["gives work done instead of left"]),
  tw_efficiency_ratio_scaling: spec("tw_efficiency_ratio_scaling", "efficiencyAlone", "medium", "core", "E_A:E_B=a:b", "Split the combined rate by efficiency ratio.", ["uses same ratio for time"]),
  tw_individual_from_combined: spec("tw_individual_from_combined", "unknownCombined", "medium", "core", "\\frac{1}{B}=\\frac{1}{T}-\\frac{1}{A}", "Subtract rates, not days.", ["subtracts completion times"]),
  tw_work_fraction_days: spec("tw_work_fraction_days", "fractionWork", "easy", "core", "\\frac{f}{d}=\\frac{1}{T}", "Full time = given days divided by fraction completed.", ["multiplies by the fraction"]),
  tw_man_days_hours_basic: spec("tw_man_days_hours_basic", "manDaysHours", "medium", "core", "M_1D_1H_1=M_2D_2H_2", "Use man-hours as work units.", ["treats men and time as both direct"]),
  tw_work_done_ratio_from_times: spec("tw_work_done_ratio_from_times", "workRatio", "easy", "core", "W_A:W_B=\\frac{1}{T_A}:\\frac{1}{T_B}", "Same time work ratio is inverse of completion times.", ["uses time ratio directly"]),
  tw_time_ratio_from_efficiency: spec("tw_time_ratio_from_efficiency", "timeRatio", "easy", "core", "T_A:T_B=E_B:E_A", "Reverse the efficiency ratio.", ["does not reverse ratio"]),
  tw_efficiency_from_wages: spec("tw_efficiency_from_wages", "wageRatio", "easy", "core", "W_A:W_B=E_A:E_B", "For same time, wage ratio equals work ratio.", ["uses inverse ratio"]),
  tw_one_day_work_fraction: spec("tw_one_day_work_fraction", "oneDay", "easy", "core", "\\text{one-day work}=\\frac{1}{T}", "One-day work is the reciprocal of full time.", ["returns total days"]),
  tw_remaining_work_fraction: spec("tw_remaining_work_fraction", "residual", "easy", "core", "R=1-\\frac{t}{T}", "Remaining fraction is (T-t)/T.", ["gives completed fraction"]),
  tw_delayed_join: spec("tw_delayed_join", "delayedJoin", "medium", "dynamic", "W_1=r_At_1,\\ T_2=\\frac{W-W_1}{r_A+r_B}", "Subtract first phase work, then divide by team rate.", ["uses team rate from start"]),
  tw_forward_leave: spec("tw_forward_leave", "forwardLeave", "medium", "dynamic", "W=(r_A+r_B)t_1+r_Bt_2", "Split the work before and after the leaving event.", ["ignores the leave event"]),
  tw_backward_leave: spec("tw_backward_leave", "backwardLeave", "hard", "dynamic", "r_A(T-a)+r_B(T-b)=W", "Assume total time T and subtract absent final days.", ["treats before-completion as forward leave"]),
  tw_multi_phase_join_leave: spec("tw_multi_phase_join_leave", "multiPhase", "hard", "dynamic", "\\sum r_it_i=W", "Make a phase table and add completed work.", ["mixes phase durations"]),
  tw_partial_completion_then_team: spec("tw_partial_completion_then_team", "partialThenTeam", "medium", "dynamic", "W_{left}=1-f", "Apply team rate only to the remaining fraction.", ["applies team to full work"]),
  tw_interrupted_work: spec("tw_interrupted_work", "interrupted", "medium", "dynamic", "T_{calendar}=T_{active}+T_{idle}", "Idle days add to calendar time but do no work.", ["counts pause as work"]),
  tw_replacement_worker: spec("tw_replacement_worker", "replacement", "medium", "dynamic", "r_1t_1+r_2t_2=W", "Use the old team rate before replacement and new team rate after it.", ["keeps old worker rate"]),
  tw_worker_added_to_meet_deadline: spec("tw_worker_added_to_meet_deadline", "workerAdded", "hard", "dynamic", "r_{needed}=\\frac{W-W_1}{t_{left}}", "Find required remaining rate, then convert to workers.", ["uses original rate"]),
  tw_worker_removed_delay: spec("tw_worker_removed_delay", "workerRemoved", "medium", "dynamic", "D=T_{actual}-T_{planned}", "Compare remaining time with fewer workers to planned time.", ["ignores reduced team"]),
  tw_machine_breakdown_midway: spec("tw_machine_breakdown_midway", "machineBreakdown", "medium", "dynamic", "O=\\sum r_it_i", "Split machine-hours before and after breakdown.", ["all machines run full time"]),
  tw_alternating_days_two_workers: spec("tw_alternating_days_two_workers", "cycleTwo", "hard", "cycle", "W_{cycle}=r_A+r_B", "Complete full cycles first, then handle the final turn.", ["forces full final cycle"]),
  tw_alternating_hours: spec("tw_alternating_hours", "cycleHours", "hard", "cycle", "W_{cycle}=r_A+r_B", "Use cycle work per two hours.", ["mixes hours and days"]),
  tw_alternating_group_cycle: spec("tw_alternating_group_cycle", "cycleGroup", "hard", "cycle", "W_{cycle}=r_A+r_B+r_C", "Use full cycles of A, B, C and then the remainder.", ["chooses wrong final worker"]),
  tw_terminal_overshoot_cycle: spec("tw_terminal_overshoot_cycle", "terminalCycle", "hard", "cycle", "W_{done}<W\\le W_{done}+r_i t_i", "Stop inside the final turn when the work reaches W.", ["adds drain or next worker after completion"]),
  tw_work_rest_cycle: spec("tw_work_rest_cycle", "workRest", "hard", "cycle", "W_{cycle}=r\\times active\\ days", "Only active days contribute work.", ["counts rest as work"]),
  tw_conditional_activation: spec("tw_conditional_activation", "conditionalCycle", "hard", "cycle", "W_{cycle}=r_A+r_B+r_C", "Build the repeating cycle including conditional work.", ["treats conditional worker as daily"]),
  tw_relative_efficiency_percent: spec("tw_relative_efficiency_percent", "relativePercent", "medium", "efficiency", "E_A=E_B(1+p/100)", "Convert percent efficiency to a ratio first.", ["applies percent to time directly"]),
  tw_worker_equivalence_men_women: spec("tw_worker_equivalence_men_women", "equivMenWomen", "medium", "efficiency", "R=\\sum n_ie_i", "Convert every worker type to one common unit.", ["treats all workers equal"]),
  tw_worker_equivalence_men_women_children: spec("tw_worker_equivalence_men_women_children", "equivThreeTypes", "hard", "efficiency", "R=\\sum n_ie_i", "Use child-equivalent or man-equivalent units.", ["wrong conversion direction"]),
  tw_group_conversion_and_or: spec("tw_group_conversion_and_or", "orAndTeams", "hard", "efficiency", "R_{OR}=R_{OR},\\ R_{AND}=R_1+R_2", "OR gives equivalent teams; AND combines them.", ["treats OR as AND"]),
  tw_efficiency_chain: spec("tw_efficiency_chain", "efficiencyChain", "medium", "efficiency", "A:B,\\ B:C\\Rightarrow A:B:C", "Make the common worker's efficiency equal.", ["concatenates ratios"]),
  tw_team_a_vs_team_b: spec("tw_team_a_vs_team_b", "teamCompare", "medium", "efficiency", "R_{team}=\\sum n_ie_i", "Compare total team efficiency, not headcount.", ["compares headcount only"]),
  tw_pairwise_ab_bc_ac: spec("tw_pairwise_ab_bc_ac", "pairwiseThree", "hard", "system", "2(A+B+C)=(A+B)+(B+C)+(C+A)", "Convert pair times to rates before solving individuals.", ["averages pair times"]),
  tw_pairwise_total_abc: spec("tw_pairwise_total_abc", "teamMinusPair", "medium", "system", "C=(A+B+C)-(A+B)", "Subtract rates from the full team rate.", ["subtracts days"]),
  tw_unknown_worker_from_team: spec("tw_unknown_worker_from_team", "unknownWorker", "medium", "system", "r_X=r_{team}-\\sum r_i", "Unknown worker rate is team rate minus known rates.", ["subtracts completion times"]),
  tw_reverse_contribution_deduction: spec("tw_reverse_contribution_deduction", "contributionRate", "medium", "system", "r=\\frac{W}{t}", "Contribution divided by time gives rate.", ["uses total work"]),
  tw_phase_state_reconstruction: spec("tw_phase_state_reconstruction", "unknownPhase", "hard", "system", "\\sum r_it_i=W", "Form one linear equation for the unknown phase.", ["guesses phase duration"]),
  tw_wage_distribution_efficiency: spec("tw_wage_distribution_efficiency", "wageShare", "medium", "wage", "Share\\propto rt", "Wages follow actual contribution.", ["splits equally"]),
  tw_wage_with_helper: spec("tw_wage_with_helper", "helperWage", "medium", "wage", "Share_C=\\frac{r_Ct_C}{\\sum rt}\\times wage", "Helper gets paid for helper contribution only.", ["ignores helper"]),
  tw_wage_partial_time: spec("tw_wage_partial_time", "partialTimeWage", "easy", "wage", "Share\\propto t", "With equal efficiency, wages follow days worked.", ["splits equally"]),
  tw_wage_efficiency_ratio: spec("tw_wage_efficiency_ratio", "efficiencyTimeWage", "medium", "wage", "W_A:W_B=E_At_A:E_Bt_B", "Multiply efficiency ratio by time ratio.", ["uses efficiency only"]),
  tw_contract_penalty_bonus: spec("tw_contract_penalty_bonus", "contractBonus", "medium", "wage", "Earning=base\\pm adjustment", "Find completion difference before applying bonus or penalty.", ["applies bonus before completion"]),
  tw_work_quality_rejection: spec("tw_work_quality_rejection", "qualityRejection", "medium", "wage", "O_a=O_g\\times p", "Use accepted output, not gross output.", ["uses gross output"]),
  pc_basic_fill_empty: spec("pc_basic_fill_empty", "pipeNet", "medium", "pipe", "r=\\frac{1}{F}-\\frac{1}{E}", "Filler is positive; leak is negative.", ["adds leak"]),
  pc_two_fillers_one_empty: spec("pc_two_fillers_one_empty", "twoFillersLeak", "medium", "pipe", "r=\\frac{1}{A}+\\frac{1}{B}-\\frac{1}{C}", "Add filling pipes and subtract the emptying pipe.", ["subtracts filler"]),
  pc_leak_hidden_rate: spec("pc_leak_hidden_rate", "hiddenLeak", "medium", "pipe", "\\frac{1}{L}=\\frac{1}{F}-\\frac{1}{T}", "Leak rate is the difference between normal and leaked fill rates.", ["subtracts times"]),
  pc_drain_after_partial_fill: spec("pc_drain_after_partial_fill", "delayedLeak", "hard", "pipe", "W_1=r_Ft_1,\\ T_2=\\frac{1-W_1}{r_F-r_L}", "Fill first, then use net rate after leak opens.", ["leak active from start"]),
  pc_alternating_fill_empty: spec("pc_alternating_fill_empty", "pipeCycle", "hard", "pipe", "W_{cycle}=r_F-r_E", "Use fill-empty cycles and stop at full tank.", ["full-cycle overshoot"]),
  pc_alternating_spill_cycle: spec("pc_alternating_spill_cycle", "pipeTerminalCycle", "hard", "pipe", "W_{done}<1\\le W_{done}+r_Ft", "Tank may fill before the emptying turn.", ["drains after tank is full"]),
  pc_capacity_leakage_rate: spec("pc_capacity_leakage_rate", "capacityLeak", "medium", "pipe", "C=r_{net}t", "Convert physical flow rate to capacity.", ["mixes minutes and hours"]),
  pc_tank_capacity_from_rate: spec("pc_tank_capacity_from_rate", "tankCapacity", "easy", "pipe", "C=rt", "Capacity is flow rate times time.", ["unit mismatch"]),
  pc_multiple_pipes_timing: spec("pc_multiple_pipes_timing", "pipeTimings", "hard", "pipe", "W=\\sum r_it_i", "Use a timeline table for open and closed pipes.", ["all pipes active full time"]),
  pc_two_tanks_transfer: spec("pc_two_tanks_transfer", "twoTankTransfer", "medium", "pipe", "V=rt", "Transferred water leaves one tank and enters another.", ["treats as simple filling only"]),
  pc_overflow_waste_rate: spec("pc_overflow_waste_rate", "overflow", "medium", "pipe", "W_e=rt_e", "After the tank is full, extra inflow is waste.", ["counts all inflow as stored"]),
  pc_partial_tank_initially_filled: spec("pc_partial_tank_initially_filled", "partialTank", "medium", "pipe", "T=\\frac{1-f}{r}", "Fill only the remaining fraction.", ["fills full tank"]),
  pc_leak_starts_after_fill: spec("pc_leak_starts_after_fill", "delayedLeak", "hard", "pipe", "W_1=r_Ft_1,\\ T_2=\\frac{1-W_1}{r_F-r_L}", "Use filler alone first, then filler-leak net rate.", ["leak from beginning"]),
  pc_pipe_closed_before_completion: spec("pc_pipe_closed_before_completion", "pipeClosure", "medium", "pipe", "W=r_1t_1+r_2t_2", "Split before and after pipe closure.", ["pipe active throughout"]),
  pc_find_pipe_rate_from_net_time: spec("pc_find_pipe_rate_from_net_time", "unknownPipe", "medium", "pipe", "\\frac{1}{X}=\\frac{1}{T}-\\sum r_i", "Subtract known pipe rates from net rate.", ["subtracts times"]),
  tw_food_resource_basic: spec("tw_food_resource_basic", "foodBasic", "easy", "resource", "M_1D_1=M_2D_2", "Food stock is measured in person-days.", ["uses direct proportion"]),
  tw_food_population_change: spec("tw_food_population_change", "foodPopulationChange", "medium", "resource", "Stock\\ left=Stock-consumed", "Consume first phase, then divide remaining stock.", ["uses final population from start"]),
  tw_food_remaining_stock: spec("tw_food_remaining_stock", "foodRemaining", "medium", "resource", "D=\\frac{S-consumed}{rate}", "Subtract consumed stock before finding days left.", ["ignores consumed stock"]),
  tw_resource_rate_equivalence: spec("tw_resource_rate_equivalence", "resourceEquivalence", "hard", "resource", "Rate=\\sum n_ie_i", "Convert consumers to adult-equivalent units.", ["equal consumption"]),
  tw_typist_pages_per_hour: spec("tw_typist_pages_per_hour", "typingOutput", "easy", "applied", "Pages=rate\\times time", "Add typing rates for typists working together.", ["adds hours"]),
  tw_printer_job_queue: spec("tw_printer_job_queue", "printerQueue", "medium", "applied", "Output=\\sum r_it", "Parallel printers add output rates.", ["uses one printer only"]),
  tw_farm_harvest_workers: spec("tw_farm_harvest_workers", "farmHarvest", "medium", "applied", "Work=workers\\times days", "Use worker-days for harvest work.", ["direct/inverse confusion"]),
  tw_road_construction_work: spec("tw_road_construction_work", "roadConstruction", "medium", "applied", "Length=worker\\ rate\\times workers\\times days", "Convert road length to worker-day output.", ["ignores length"]),
  tw_painting_walls_area_work: spec("tw_painting_walls_area_work", "paintingArea", "medium", "applied", "Time=\\frac{area}{rate}", "Painting time scales with area.", ["uses number of walls only"]),
  tw_digging_filling_negative_work: spec("tw_digging_filling_negative_work", "digFill", "medium", "applied", "r_{net}=r_{dig}-r_{fill}", "Opposite work is subtracted.", ["adds opposing work"]),
  tw_parallel_machine_batches: spec("tw_parallel_machine_batches", "parallelMachines", "medium", "applied", "Output=\\sum r_it", "Parallel machines produce at summed rates.", ["sequential assumption"]),
  tw_lcm_hidden_total_work: spec("tw_lcm_hidden_total_work", "hiddenLcm", "hard", "advanced", "W=LCM(times)", "LCM keeps efficiencies integral.", ["uses decimal unit work"]),
  tw_negative_positive_mixed_work: spec("tw_negative_positive_mixed_work", "positiveNegative", "hard", "advanced", "r_{net}=r_+-r_-", "Keep signs disciplined.", ["adds all rates"]),
  tw_productivity_decay: spec("tw_productivity_decay", "productivityDecay", "hard", "advanced", "r_2=r_1(1-p/100)", "Split before and after productivity change.", ["same rate throughout"]),
  tw_machine_parallel_scheduling: spec("tw_machine_parallel_scheduling", "machineSchedule", "hard", "advanced", "Output=\\sum r_it", "Use machine-hour windows.", ["same runtime for all"]),
  tw_contract_deadline_extra_workers: spec("tw_contract_deadline_extra_workers", "deadlineExtra", "hard", "advanced", "extra=required-current", "Compute remaining worker-days before adding workers.", ["adds workers without remaining work"]),
};

type TimeWorkStemBankId =
  | "combined_work"
  | "remaining_work"
  | "efficiency_ratio"
  | "man_days_hours"
  | "dynamic_timeline"
  | "alternating_cycle"
  | "worker_equivalence"
  | "pairwise_system"
  | "wages_contracts"
  | "pipes_leaks"
  | "capacity_flow"
  | "food_resource"
  | "applied_output";

export const TIME_WORK_STEM_TEMPLATE_COVERAGE: Record<TimeWorkStemBankId, number> = {
  combined_work: 6,
  remaining_work: 6,
  efficiency_ratio: 6,
  man_days_hours: 6,
  dynamic_timeline: 6,
  alternating_cycle: 6,
  worker_equivalence: 6,
  pairwise_system: 6,
  wages_contracts: 6,
  pipes_leaks: 6,
  capacity_flow: 6,
  food_resource: 6,
  applied_output: 6,
};

function stemBankForSpec(spec: MotifSpec): TimeWorkStemBankId {
  if (spec.group === "pipe") {
    return ["capacityLeak", "tankCapacity", "twoTankTransfer", "overflow"].includes(spec.archetype)
      ? "capacity_flow"
      : "pipes_leaks";
  }
  if (spec.group === "resource") return "food_resource";
  if (spec.group === "wage") return "wages_contracts";
  if (spec.group === "system") return "pairwise_system";
  if (spec.group === "cycle") return "alternating_cycle";
  if (spec.group === "efficiency") return "worker_equivalence";
  if (spec.group === "applied" || spec.group === "advanced") return "applied_output";
  if (spec.group === "dynamic") return "dynamic_timeline";
  if (["manDaysHours", "farmHarvest", "roadConstruction", "paintingArea"].includes(spec.archetype)) return "man_days_hours";
  if (["residual", "oneDay", "fractionWork"].includes(spec.archetype)) return "remaining_work";
  if (["efficiencyAlone", "unknownCombined", "workRatio", "timeRatio", "wageRatio", "relativePercent"].includes(spec.archetype)) return "efficiency_ratio";
  return "combined_work";
}

export const TIME_WORK_FAMILY_STEM_BANK: Record<TimeWorkFamilyId, TimeWorkStemBankId> =
  Object.fromEntries(
    TIME_WORK_FAMILY_IDS.map((family) => [family, stemBankForSpec(TIME_WORK_MOTIF_SPECS[family])]),
  ) as Record<TimeWorkFamilyId, TimeWorkStemBankId>;

type Draft = {
  variables: Record<string, unknown>;
  solverModel: TimeWorkSolverModel;
  stem: TimeWorkLocalizedText;
  answer: number | string;
  answerKind: TimeWorkAnswerKind;
  answerUnit: TimeWorkAnswerUnit;
  steps: TimeWorkExplanationStep[];
  shortcutMath: string;
  distractorValues: Array<number | string>;
};

const TIME_POOL = [6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72] as const;
const SHORT_TIME_POOL = [6, 8, 10, 12, 15, 18, 20, 24, 30] as const;

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}

function pool(seed: string, offset = 0) {
  return TIME_POOL[(hashText(`${seed}:${offset}`) + offset) % TIME_POOL.length]!;
}

function shortPool(seed: string, offset = 0) {
  return SHORT_TIME_POOL[(hashText(`${seed}:short:${offset}`) + offset) % SHORT_TIME_POOL.length]!;
}

function gcd(left: number, right: number): number {
  const a = Math.abs(Math.trunc(left));
  const b = Math.abs(Math.trunc(right));
  return b === 0 ? a || 1 : gcd(b, a % b);
}

function gcdMany(values: readonly number[]) {
  return values.reduce((acc, value) => gcd(acc, value), 0) || 1;
}

function lcm(left: number, right: number) {
  return Math.abs(left * right) / gcd(left, right);
}

function lcmMany(values: readonly number[]) {
  return values.reduce((acc, value) => lcm(acc, value), 1);
}

function simplify(values: readonly number[]) {
  const divisor = gcdMany(values);
  return values.map((value) => value / divisor);
}

function clean(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function fractionDisplay(value: number, math = false) {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const whole = Math.floor(absolute);
  const decimal = absolute - whole;
  const fractions: Array<[number, number]> = [
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 4],
    [3, 4],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ];
  const match = fractions.find(([numerator, denominator]) =>
    Math.abs(decimal - numerator / denominator) < 0.006,
  );
  if (!match) return clean(value);
  const [numerator, denominator] = match;
  const fraction = math ? `\\frac{${numerator}}{${denominator}}` : `${numerator}/${denominator}`;
  if (whole === 0) return `${sign}${fraction}`;
  return math ? `${sign}${whole}${fraction}` : `${sign}${whole} ${fraction}`;
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function sanitizeMathExpression(expression: string) {
  return expression
    .replace(/work\\ left/gu, "W_l")
    .replace(/remaining\/net\\ rate/gu, "W_l/r_n")
    .replace(/remaining\\ stock\/final\\ people/gu, "S_l/P_2")
    .replace(/stock\/rate/gu, "S/R")
    .replace(/full\\ cycles\+terminal\\ fill/gu, "C_f+t_f")
    .replace(/total\\ rate\\times time/gu, "\\sum r_it_i")
    .replace(/rate\\times time/gu, "r\\times t")
    .replace(/extra\\ inflow/gu, "r\\times t_e")
    .replace(/remaining\/rate/gu, "W_l/r")
    .replace(/required-current/gu, "N_r-N_c")
    .replace(/phase1\+phase2/gu, "t_1+t_2")
    .replace(/B\\ common/gu, "B_c")
    .replace(/active\\ days/gu, "d_a")
    .replace(/acceptance\\ rate/gu, "q/100")
    .replace(/\bWaste\b/gu, "V_w")
    .replace(/\bAccepted\b/gu, "O_a")
    .replace(/\bProduced\b/gu, "O")
    .replace(/\bPages\b/gu, "P_g")
    .replace(/\bLength\b/gu, "L")
    .replace(/\bTime\b/gu, "T")
    .replace(/\bWork\b/gu, "W")
    .replace(/\bStock\\ left\b/gu, "S_l")
    .replace(/(\d+)\.33\b/gu, (_match, whole) => `${whole}\\frac{1}{3}`)
    .replace(/(\d+)\.67\b/gu, (_match, whole) => `${whole}\\frac{2}{3}`);
}

function displayMath(expression: string) {
  return `\\[\n${sanitizeMathExpression(expression)}\n\\]`;
}

function inlineMath(expression: string) {
  return `\\(${expression}\\)`;
}

function unitText(value: number, unit: TimeWorkAnswerUnit, language: Locale = "en") {
  if (unit === "rupees") return money(value);
  if (unit === "percent") return `${clean(value)}%`;
  if (unit === "days") {
    const display = fractionDisplay(value);
    if (language === "hi") return `${display} दिन`;
    if (language === "pa") return `${display} ਦਿਨ`;
    return `${display} ${value === 1 ? "day" : "days"}`;
  }
  if (unit === "hours") {
    const display = fractionDisplay(value);
    if (language === "hi") return `${display} घंटे`;
    if (language === "pa") return `${display} ਘੰਟੇ`;
    return `${display} ${value === 1 ? "hour" : "hours"}`;
  }
  if (unit === "minutes") {
    const display = fractionDisplay(value);
    if (language === "hi") return `${display} मिनट`;
    if (language === "pa") return `${display} ਮਿੰਟ`;
    return `${display} ${value === 1 ? "minute" : "minutes"}`;
  }
  if (unit === "workers") {
    if (language === "hi") return `${clean(value)} मजदूर`;
    if (language === "pa") return `${clean(value)} ਮਜ਼ਦੂਰ`;
    return `${clean(value)} ${value === 1 ? "worker" : "workers"}`;
  }
  if (unit === "litres") {
    if (language === "hi") return `${clean(value)} लीटर`;
    if (language === "pa") return `${clean(value)} ਲੀਟਰ`;
    return `${clean(value)} litres`;
  }
  if (unit === "pages") {
    if (language === "hi") return `${clean(value)} पृष्ठ`;
    if (language === "pa") return `${clean(value)} ਸਫ਼ੇ`;
    return `${clean(value)} pages`;
  }
  if (unit === "metres") {
    if (language === "hi") return `${clean(value)} मीटर`;
    if (language === "pa") return `${clean(value)} ਮੀਟਰ`;
    return `${clean(value)} m`;
  }
  if (unit === "units") {
    if (language === "hi") return `${clean(value)} इकाइयाँ`;
    if (language === "pa") return `${clean(value)} ਇਕਾਈਆਂ`;
    return `${clean(value)} units`;
  }
  if (unit === "items") {
    if (language === "hi") return `${clean(value)} वस्तुएँ`;
    if (language === "pa") return `${clean(value)} ਵਸਤੂਆਂ`;
    return `${clean(value)} items`;
  }
  if (unit === "sheets") {
    if (language === "hi") return `${clean(value)} उत्तर-पत्रक`;
    if (language === "pa") return `${clean(value)} ਉੱਤਰ ਪੱਤਰ`;
    return `${clean(value)} answer sheets`;
  }
  if (unit === "work") {
    if (language === "hi") return `${clean(value)} काम इकाइयाँ`;
    if (language === "pa") return `${clean(value)} ਕੰਮ ਇਕਾਈਆਂ`;
    return `${clean(value)} work units`;
  }
  return clean(value);
}

function answerText(value: number | string, unit: TimeWorkAnswerUnit, language: Locale = "en") {
  if (typeof value === "string") return value;
  return unitText(value, unit, language);
}

function asNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function asNumberList(value: unknown) {
  return Array.isArray(value) ? value.map(Number).filter(Number.isFinite) : [];
}

function question(text: string) {
  return `${text.trim().replace(/[.।?]+$/u, "")}?`;
}

function stemFrom(seed: string, en: readonly string[], hi: readonly string[], pa: readonly string[]): TimeWorkLocalizedText {
  return {
    en: question(phrase(`${seed}:en`, en)),
    hi: question(phrase(`${seed}:hi`, hi)),
    pa: question(phrase(`${seed}:pa`, pa)),
  };
}

function dayValue(value: number) {
  return fractionDisplay(value);
}

function timeFrom(totalWork: number, rate: number) {
  return rate ? dayValue(totalWork / rate) : "0";
}

function naturalTimeWorkStem(
  seed: string,
  spec: MotifSpec,
  variables: Record<string, unknown>,
  fallback: TimeWorkLocalizedText,
): TimeWorkLocalizedText {
  const archetype = spec.archetype;

  if (archetype === "combined" || archetype === "hiddenLcm") {
    const [a = 12, b = 18] = asNumberList(variables.times);
    return stemFrom(seed, [
      `A can complete a piece of work in ${a} days and B can complete the same work in ${b} days. In how many days will they complete it working together`,
      `A alone finishes a job in ${a} days, while B alone finishes it in ${b} days. How many days will the job take if both work together`,
      `One worker can do a job in ${a} days and another can do it in ${b} days. In how many days will they complete it together`,
      `A takes ${a} days to finish a work and B takes ${b} days for the same work. In how many days can A and B finish it together`,
      `If A can complete a work in ${a} days and B can complete it in ${b} days, how many days are needed when both work at the same time`,
      `A and B can separately complete a job in ${a} days and ${b} days. What is the time taken when they work together`,
    ], [
      `A एक काम ${a} दिन में और B वही काम ${b} दिन में पूरा करता है। दोनों मिलकर उसे कितने दिन में पूरा करेंगे`,
      `A अकेला काम ${a} दिन में करता है और B अकेला ${b} दिन में करता है। साथ काम करने पर कितने दिन लगेंगे`,
      `एक काम A ${a} दिन में और B ${b} दिन में पूरा कर सकता है। दोनों साथ हों तो काम कितने दिन में पूरा होगा`,
      `A को काम पूरा करने में ${a} दिन और B को ${b} दिन लगते हैं। दोनों मिलकर कितने दिन लेंगे`,
    ], [
      `A ਇੱਕ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ਉਹੀ ਕੰਮ ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ`,
      `A ਇਕੱਲਾ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ ਅਤੇ B ਇਕੱਲਾ ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਤੇ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
      `ਇੱਕ ਕੰਮ A ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਹੋਣ ਤਾਂ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ`,
      `A ਨੂੰ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${a} ਦਿਨ ਅਤੇ B ਨੂੰ ${b} ਦਿਨ ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕਿੰਨੇ ਦਿਨ ਲੈਣਗੇ`,
    ]);
  }

  if (archetype === "residual") {
    const totalTime = asNumber(variables.totalTime, 12);
    const elapsed = asNumber(variables.elapsed, 4);
    return stemFrom(seed, [
      `A team can complete a job in ${totalTime} days. If it works for ${elapsed} days, what fraction of the job will still be unfinished`,
      `A job needs ${totalTime} days to finish. After ${elapsed} days of work, what part of the job is still left`,
      `A group is expected to complete a work in ${totalTime} days. It has already worked for ${elapsed} days. What fraction remains`,
      `If a work is completed in ${totalTime} days and ${elapsed} days have passed, what fraction of the work is yet to be done`,
      `A team takes ${totalTime} days for a job. After working for ${elapsed} days, what fraction of the job remains`,
      `A job can be finished in ${totalTime} days. If work continues for ${elapsed} days, what fraction is still incomplete`,
    ], [
      `एक दल काम ${totalTime} दिन में पूरा कर सकता है। ${elapsed} दिन काम करने के बाद काम का कितना भाग बाकी रहेगा`,
      `एक काम पूरा होने में ${totalTime} दिन लगते हैं। ${elapsed} दिन काम हो चुका है। कितना भाग अभी अधूरा है`,
      `एक समूह काम ${totalTime} दिन में पूरा करता है। ${elapsed} दिन बाद काम का कितना अंश शेष रहेगा`,
      `${totalTime} दिन के काम में से ${elapsed} दिन काम हो चुका है। काम का कौन-सा भाग अभी बचा है`,
    ], [
      `ਇੱਕ ਟੀਮ ਕੰਮ ${totalTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੀ ਹੈ। ${elapsed} ਦਿਨ ਕੰਮ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ`,
      `ਇੱਕ ਕੰਮ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ${totalTime} ਦਿਨ ਲੱਗਦੇ ਹਨ। ${elapsed} ਦਿਨ ਕੰਮ ਹੋ ਗਿਆ ਹੈ। ਕਿੰਨਾ ਹਿੱਸਾ ਅਜੇ ਅਧੂਰਾ ਹੈ`,
      `ਇੱਕ ਸਮੂਹ ਕੰਮ ${totalTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ${elapsed} ਦਿਨਾਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨਾ ਅੰਸ਼ ਬਚੇਗਾ`,
      `${totalTime} ਦਿਨਾਂ ਦੇ ਕੰਮ ਵਿੱਚੋਂ ${elapsed} ਦਿਨ ਕੰਮ ਹੋ ਚੁੱਕਾ ਹੈ। ਕੰਮ ਦਾ ਕਿਹੜਾ ਹਿੱਸਾ ਅਜੇ ਬਾਕੀ ਹੈ`,
    ]);
  }

  if (archetype === "oneDay") {
    const time = asNumber(variables.time, 20);
    return stemFrom(seed, [
      `A can complete a job in ${time} days. What fraction of the job does A complete in one day`,
      `If a worker finishes a piece of work in ${time} days, what part is completed in one day`,
      `A needs ${time} days to complete a work. What is A's work in one day as a fraction of the whole job`,
      `A job takes ${time} days for one worker. What fraction is done by the worker in a single day`,
      `A completes a work in ${time} days. What part of the work is completed per day`,
      `One worker finishes the whole job in ${time} days. What fraction of it is finished in one day`,
    ], [
      `A एक काम ${time} दिन में पूरा करता है। A एक दिन में काम का कितना भाग करता है`,
      `यदि एक मजदूर काम ${time} दिन में पूरा करता है, तो वह एक दिन में कितना भाग करेगा`,
      `A को पूरा काम करने में ${time} दिन लगते हैं। एक दिन का काम भिन्न में कितना होगा`,
      `एक मजदूर पूरा काम ${time} दिन में करता है। एक दिन में काम का कौन-सा भाग होगा`,
    ], [
      `A ਇੱਕ ਕੰਮ ${time} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। A ਇੱਕ ਦਿਨ ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦਾ ਹੈ`,
      `ਜੇ ਇੱਕ ਮਜ਼ਦੂਰ ਕੰਮ ${time} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ, ਤਾਂ ਉਹ ਇੱਕ ਦਿਨ ਵਿੱਚ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰੇਗਾ`,
      `A ਨੂੰ ਪੂਰਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ${time} ਦਿਨ ਲੱਗਦੇ ਹਨ। ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ ਭਿੰਨ ਵਿੱਚ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `ਇੱਕ ਮਜ਼ਦੂਰ ਪੂਰਾ ਕੰਮ ${time} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। ਇੱਕ ਦਿਨ ਵਿੱਚ ਕੰਮ ਦਾ ਕਿਹੜਾ ਹਿੱਸਾ ਹੋਵੇਗਾ`,
    ]);
  }

  if (archetype === "fractionWork" || archetype === "partialThenTeam") {
    const numerator = asNumber(variables.numerator, 1);
    const denominator = asNumber(variables.denominator, 3);
    const days = asNumber(variables.days, 6);
    const fraction = inlineMath(`\\frac{${numerator}}{${denominator}}`);
    return stemFrom(seed, [
      `A completes ${fraction} of a job in ${days} days. In how many days will A complete the whole job`,
      `A worker finishes ${fraction} of a work in ${days} days. How many days are needed for the full work`,
      `If ${fraction} of a piece of work takes ${days} days, in how many days will the entire work be completed`,
      `A does ${fraction} of a job in ${days} days. What is the time required for the complete job`,
      `A can finish ${fraction} of a work in ${days} days. In how many days can A finish all of it`,
      `The fraction ${fraction} of a job is completed in ${days} days. How many days will the whole job take`,
    ], [
      `A काम का ${fraction} भाग ${days} दिन में करता है। पूरा काम कितने दिन में होगा`,
      `एक मजदूर काम का ${fraction} भाग ${days} दिन में पूरा करता है। पूरा काम करने में कितने दिन लगेंगे`,
      `यदि काम का ${fraction} भाग ${days} दिन में होता है, तो पूरा काम कितने दिन में होगा`,
      `A ${days} दिन में काम का ${fraction} भाग करता है। पूरा काम कितने दिन में पूरा होगा`,
    ], [
      `A ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ${days} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਵੇਗਾ`,
      `ਇੱਕ ਮਜ਼ਦੂਰ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ${days} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
      `ਜੇ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ${days} ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਵੇਗਾ`,
      `A ${days} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਕਰਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ`,
    ]);
  }

  if (archetype === "efficiencyAlone" || archetype === "relativePercent") {
    const parts = asNumberList(variables.efficiencyParts);
    const a = parts[0] ?? 2;
    const b = parts[1] ?? 3;
    const togetherTime = asNumber(variables.togetherTime, 8);
    return stemFrom(seed, [
      `The efficiencies of A and B are in the ratio ${a}:${b}. Together they complete a work in ${togetherTime} days. In how many days can A alone complete the work`,
      `A and B have efficiencies in the ratio ${a}:${b}. If they finish a job together in ${togetherTime} days, how many days will A alone take`,
      `The efficiency ratio of A to B is ${a}:${b}. They complete the work together in ${togetherTime} days. In how many days can A do it alone`,
      `Two workers A and B have efficiencies ${a}:${b}. If both together finish the job in ${togetherTime} days, in how many days can A alone finish it`,
      `A and B together complete a work in ${togetherTime} days. Their efficiencies are in the ratio ${a}:${b}. In how many days can A alone complete it`,
      `A and B finish a work together in ${togetherTime} days, and their efficiency ratio is ${a}:${b}. How many days will A alone need`,
    ], [
      `A और B की कार्य क्षमता का अनुपात ${a}:${b} है। दोनों मिलकर काम ${togetherTime} दिन में करते हैं। A अकेला कितने दिन लेगा`,
      `A की क्षमता B से ${a}:${b} के अनुपात में है। दोनों साथ काम ${togetherTime} दिन में पूरा करते हैं। A अकेला कितने दिन में करेगा`,
      `दो मजदूरों A और B की क्षमता ${a}:${b} है। दोनों काम ${togetherTime} दिन में पूरा करते हैं। A अकेले का समय कितना होगा`,
      `A:B की कार्य क्षमता ${a}:${b} है। दोनों काम ${togetherTime} दिन में करते हैं। A अकेला कितने दिन में करेगा`,
    ], [
      `A ਅਤੇ B ਦੀ ਕੰਮ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ${togetherTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
      `A ਦੀ ਸਮਰੱਥਾ B ਨਾਲ ${a}:${b} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਕੰਮ ${togetherTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ`,
      `ਦੋ ਮਜ਼ਦੂਰਾਂ A ਅਤੇ B ਦੀ ਸਮਰੱਥਾ ${a}:${b} ਹੈ। ਦੋਵੇਂ ਕੰਮ ${togetherTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `A:B ਦੀ ਕੰਮ ਸਮਰੱਥਾ ${a}:${b} ਹੈ। ਦੋਵੇਂ ਕੰਮ ${togetherTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ`,
    ]);
  }

  if (archetype === "unknownCombined") {
    const combinedTime = asNumber(variables.combinedTime, 8);
    const known = asNumberList(variables.knownTimes)[0] ?? 12;
    return stemFrom(seed, [
      `A and B together can complete a work in ${combinedTime} days. A alone can complete it in ${known} days. In how many days will B alone complete it`,
      `A alone finishes a job in ${known} days, while A and B together finish it in ${combinedTime} days. How many days will B alone take`,
      `A can do a work in ${known} days. With B, the same work is completed in ${combinedTime} days. In how many days can B alone complete it`,
      `The job takes ${combinedTime} days when A and B work together. If A alone takes ${known} days, in how many days can B alone finish it`,
      `A needs ${known} days for a work and A with B needs ${combinedTime} days. In how many days can B do the work alone`,
      `A and B together finish a job in ${combinedTime} days. A alone takes ${known} days. How many days will B alone take`,
    ], [
      `A और B मिलकर काम ${combinedTime} दिन में पूरा करते हैं। A अकेला वही काम ${known} दिन में करता है। B अकेला कितने दिन लेगा`,
      `A अकेला काम ${known} दिन में करता है, जबकि A और B मिलकर ${combinedTime} दिन में करते हैं। B अकेला कितने दिन में करेगा`,
      `A किसी काम को ${known} दिन में करता है। B के साथ वही काम ${combinedTime} दिन में होता है। B का समय कितना होगा`,
      `A और B साथ काम ${combinedTime} दिन में करते हैं। A अकेला ${known} दिन लेता है। B अकेला कितने दिन लेगा`,
    ], [
      `A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ${combinedTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਉਹੀ ਕੰਮ ${known} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। B ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
      `A ਇਕੱਲਾ ਕੰਮ ${known} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ, ਜਦਕਿ A ਅਤੇ B ਮਿਲ ਕੇ ${combinedTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। B ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗਾ`,
      `A ਕਿਸੇ ਕੰਮ ਨੂੰ ${known} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। B ਨਾਲ ਉਹੀ ਕੰਮ ${combinedTime} ਦਿਨਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ। B ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `A ਅਤੇ B ਨਾਲ ਕੰਮ ${combinedTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ${known} ਦਿਨ ਲੈਂਦਾ ਹੈ। B ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
    ]);
  }

  if (archetype === "workRatio" || archetype === "timeRatio") {
    const times = asNumberList(variables.times);
    const parts = asNumberList(variables.efficiencyParts);
    const a = (archetype === "timeRatio" ? parts[0] : times[0]) ?? 10;
    const b = (archetype === "timeRatio" ? parts[1] : times[1]) ?? 15;
    if (archetype === "timeRatio") {
      return stemFrom(seed, [
        `The efficiencies of A and B are in the ratio ${a}:${b}. What is the ratio of the times taken by A and B for the same work`,
        `A and B have efficiencies in the ratio ${a}:${b}. Find the ratio of their completion times`,
        `If the efficiency ratio A:B is ${a}:${b}, what will be the time ratio A:B for the same job`,
        `For the same work, the efficiencies of A and B are ${a}:${b}. What is the ratio of their times`,
        `A and B's efficiencies are ${a}:${b}. What is the ratio of days required by A and B separately`,
        `Two workers have efficiencies ${a}:${b}. What is the ratio of days required by them separately`,
      ], [
        `A और B की कार्य क्षमता का अनुपात ${a}:${b} है। समान काम के लिए उनके समय का अनुपात क्या होगा`,
        `A और B की क्षमता ${a}:${b} है। काम पूरा करने के समय का अनुपात ज्ञात करें`,
        `यदि A:B की क्षमता ${a}:${b} है, तो एक ही काम के लिए समय अनुपात क्या होगा`,
        `समान काम के लिए A और B की क्षमता ${a}:${b} है। उनके समय का अनुपात क्या होगा`,
      ], [
        `A ਅਤੇ B ਦੀ ਕੰਮ ਸਮਰੱਥਾ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। ਇੱਕੋ ਕੰਮ ਲਈ ਉਹਨਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
        `A ਅਤੇ B ਦੀ ਸਮਰੱਥਾ ${a}:${b} ਹੈ। ਕੰਮ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ`,
        `ਜੇ A:B ਦੀ ਸਮਰੱਥਾ ${a}:${b} ਹੈ, ਤਾਂ ਇੱਕੋ ਕੰਮ ਲਈ ਸਮਾਂ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
        `ਇੱਕੋ ਕੰਮ ਲਈ A ਅਤੇ B ਦੀ ਸਮਰੱਥਾ ${a}:${b} ਹੈ। ਉਹਨਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
      ]);
    }
    return stemFrom(seed, [
      `A can complete a work in ${a} days and B can complete it in ${b} days. In the same number of days, what is the ratio of the work done by A and B`,
      `A alone takes ${a} days and B alone takes ${b} days for the same job. What is the ratio of work done by A and B in the same time`,
      `A alone can complete a work in ${a} days and B alone in ${b} days. What is the ratio of work done by them in the same time`,
      `A finishes a job in ${a} days and B in ${b} days. What is the ratio of work done by A and B in the same time`,
      `If A's time is ${a} days and B's time is ${b} days, what ratio of work will they do in equal time`,
      `A and B complete the same work separately in ${a} and ${b} days. What is the ratio of work done by A and B in one day`,
    ], [
      `A काम ${a} दिन में और B ${b} दिन में पूरा करता है। समान समय में उनके काम का अनुपात क्या होगा`,
      `A अकेला ${a} दिन और B अकेला ${b} दिन लेता है। बराबर समय में काम का अनुपात ज्ञात करें`,
      `यदि A का समय ${a} दिन और B का समय ${b} दिन है, तो समान समय में काम का अनुपात क्या होगा`,
      `A और B वही काम क्रमशः ${a} और ${b} दिन में करते हैं। एक दिन के योगदान का अनुपात क्या होगा`,
    ], [
      `A ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਇੱਕੋ ਜਿਹੇ ਸਮੇਂ ਵਿੱਚ ਉਹਨਾਂ ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
      `A ਇਕੱਲਾ ${a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${b} ਦਿਨ ਲੈਂਦਾ ਹੈ। ਬਰਾਬਰ ਸਮੇਂ ਵਿੱਚ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ`,
      `ਜੇ A ਦਾ ਸਮਾਂ ${a} ਦਿਨ ਅਤੇ B ਦਾ ਸਮਾਂ ${b} ਦਿਨ ਹੈ, ਤਾਂ ਇੱਕੋ ਜਿਹੇ ਸਮੇਂ ਵਿੱਚ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
      `A ਅਤੇ B ਉਹੀ ਕੰਮ ਕ੍ਰਮਵਾਰ ${a} ਅਤੇ ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। ਇੱਕ ਦਿਨ ਦੇ ਯੋਗਦਾਨ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
    ]);
  }

  if (archetype === "wageRatio") {
    const values = asNumberList(variables.values);
    const a = values[0] ?? 300;
    const b = values[1] ?? 500;
    return stemFrom(seed, [
      `A and B work for the same number of days and receive ₹${a} and ₹${b}. If wages are proportional to work done, what is the ratio of work done by A and B in the same time`,
      `For equal working time, A is paid ₹${a} and B is paid ₹${b}. What is the ratio of their work`,
      `A and B earn ₹${a} and ₹${b} for the same duration of work. What is the ratio of work done by A and B`,
      `Two workers work for equal time. Their wages are ₹${a} and ₹${b}. What is the ratio of work done by A and B`,
      `A gets ₹${a} and B gets ₹${b} for equal time on the same job. What is the ratio of work done by A and B in the same time`,
      `If wages for equal time are ₹${a} and ₹${b} for A and B, what is their work ratio`,
    ], [
      `A और B समान दिन काम करते हैं और उन्हें ₹${a} तथा ₹${b} मिलते हैं। काम के अनुपात में मजदूरी हो तो A:B काम अनुपात क्या होगा`,
      `बराबर समय के लिए A को ₹${a} और B को ₹${b} मिलते हैं। उनके काम का अनुपात क्या होगा`,
      `A और B समान अवधि काम करके ₹${a} और ₹${b} कमाते हैं। उनके काम का अनुपात ज्ञात करें`,
      `दो मजदूर बराबर समय काम करते हैं। उनकी मजदूरी ₹${a} और ₹${b} है। योगदान अनुपात क्या होगा`,
    ], [
      `A ਅਤੇ B ਇੱਕੋ ਜਿਹੇ ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ₹${a} ਅਤੇ ₹${b} ਮਿਲਦੇ ਹਨ। ਕੰਮ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਜ਼ਦੂਰੀ ਹੋਵੇ ਤਾਂ A:B ਕੰਮ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
      `ਬਰਾਬਰ ਸਮੇਂ ਲਈ A ਨੂੰ ₹${a} ਅਤੇ B ਨੂੰ ₹${b} ਮਿਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
      `A ਅਤੇ B ਇੱਕੋ ਮਿਆਦ ਕੰਮ ਕਰਕੇ ₹${a} ਅਤੇ ₹${b} ਕਮਾਉਂਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ`,
      `ਦੋ ਮਜ਼ਦੂਰ ਬਰਾਬਰ ਸਮਾਂ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਮਜ਼ਦੂਰੀ ₹${a} ਅਤੇ ₹${b} ਹੈ। ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
    ]);
  }

  if (["manDaysHours", "farmHarvest", "roadConstruction", "paintingArea"].includes(archetype)) {
    const m1 = asNumber(variables.m1, 12);
    const d1 = asNumber(variables.d1, 10);
    const h1 = asNumber(variables.h1, 8);
    const d2 = asNumber(variables.d2, 16);
    const h2 = asNumber(variables.h2, 6);
    const noun = archetype === "farmHarvest" ? "farm workers" : archetype === "paintingArea" ? "painters" : "workers";
    const job = archetype === "farmHarvest" ? "harvest a field" : archetype === "roadConstruction" ? "build a road stretch" : archetype === "paintingArea" ? "paint a building" : "complete a job";
    return stemFrom(seed, [
      `${m1} ${noun} can ${job} in ${d1} days by working ${h1} hours a day. How many workers are needed to finish it in ${d2} days by working ${h2} hours a day`,
      `A job is finished by ${m1} workers in ${d1} days when each works ${h1} hours daily. How many workers are needed for ${d2} days at ${h2} hours daily`,
      `${m1} workers working ${h1} hours per day finish the job in ${d1} days. If the daily working time is ${h2} hours, how many workers are needed to finish it in ${d2} days`,
      `${m1} workers complete the same job in ${d1} days at ${h1} hours a day. How many workers are required to complete the same job in ${d2} days at ${h2} hours a day`,
      `A work requires ${m1} workers for ${d1} days with ${h1} working hours per day. How many workers will be needed for ${d2} days with ${h2} hours per day`,
      `${m1} workers finish a job in ${d1} days, working ${h1} hours daily. How many workers should work ${h2} hours daily to finish it in ${d2} days`,
    ], [
      `${m1} मजदूर रोज ${h1} घंटे काम करके ${d1} दिन में काम पूरा करते हैं। रोज ${h2} घंटे काम करके ${d2} दिन में काम पूरा करने के लिए कितने मजदूर चाहिए`,
      `एक काम ${m1} मजदूर ${d1} दिन में पूरा करते हैं, जब प्रत्येक रोज ${h1} घंटे काम करता है। ${d2} दिन और ${h2} घंटे रोज के लिए कितने मजदूर लगेंगे`,
      `${m1} मजदूर ${h1} घंटे प्रतिदिन काम कर काम ${d1} दिन में पूरा करते हैं। ${h2} घंटे प्रतिदिन पर ${d2} दिन के लिए मजदूरों की संख्या क्या होगी`,
      `${m1} मजदूर ${d1} दिन तक रोज ${h1} घंटे काम करके काम पूरा करते हैं। वही काम ${d2} दिन में रोज ${h2} घंटे काम करके कितने मजदूर करेंगे`,
    ], [
      `${m1} ਮਜ਼ਦੂਰ ਰੋਜ਼ ${h1} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ${d1} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਰੋਜ਼ ${h2} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ${d2} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ`,
      `ਇੱਕ ਕੰਮ ${m1} ਮਜ਼ਦੂਰ ${d1} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ, ਜਦੋਂ ਹਰ ਇੱਕ ਰੋਜ਼ ${h1} ਘੰਟੇ ਕੰਮ ਕਰਦਾ ਹੈ। ${d2} ਦਿਨ ਅਤੇ ${h2} ਘੰਟੇ ਰੋਜ਼ ਲਈ ਕਿੰਨੇ ਮਜ਼ਦੂਰ ਲੱਗਣਗੇ`,
      `${m1} ਮਜ਼ਦੂਰ ${h1} ਘੰਟੇ ਪ੍ਰਤੀ ਦਿਨ ਕੰਮ ਕਰਕੇ ਕੰਮ ${d1} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${h2} ਘੰਟੇ ਪ੍ਰਤੀ ਦਿਨ ਤੇ ${d2} ਦਿਨਾਂ ਲਈ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਕੀ ਹੋਵੇਗੀ`,
      `${m1} ਮਜ਼ਦੂਰ ${d1} ਦਿਨ ਰੋਜ਼ ${h1} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਹੀ ਕੰਮ ${d2} ਦਿਨਾਂ ਵਿੱਚ ਰੋਜ਼ ${h2} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ਕਿੰਨੇ ਮਜ਼ਦੂਰ ਕਰਨਗੇ`,
    ]);
  }

  if (["delayedJoin", "forwardLeave", "backwardLeave", "multiPhase", "interrupted", "replacement"].includes(archetype)) {
    const totalWork = asNumber(variables.totalWork, 120);
    const doneRate = asNumber(variables.doneRate, 6);
    const doneTime = asNumber(variables.doneTime, 3);
    const remainingRate = asNumber(variables.remainingRate, 10);
    const rates = asNumberList(variables.rates);
    const calendarOffset = asNumber(variables.calendarOffset, 0);
    if (archetype === "delayedJoin") {
      const a = timeFrom(totalWork, doneRate);
      const b = timeFrom(totalWork, remainingRate - doneRate);
      return stemFrom(seed, [
        `A can complete a work in ${a} days and B can complete it in ${b} days. A starts alone, and after ${doneTime} days B joins him. In how many days will the whole work be completed`,
        `A alone takes ${a} days and B alone takes ${b} days. A works alone for ${doneTime} days, then B joins. How many days will the job take in all`,
        `A begins a job alone. A can finish it in ${a} days and B can finish it in ${b} days. If B joins after ${doneTime} days, how many days will the job take in all`,
        `A starts a work and B joins after ${doneTime} days. A and B can finish the work alone in ${a} and ${b} days. What is the total time taken`,
        `A works alone for ${doneTime} days on a job. A's time is ${a} days and B's time is ${b} days. How many days are needed in all if B joins afterward`,
        `A can do a work in ${a} days and B in ${b} days. After A works for ${doneTime} days alone, both work together. In how many days is the work completed`,
      ], [
        `A काम ${a} दिन में और B ${b} दिन में पूरा करता है। A अकेला शुरू करता है और ${doneTime} दिन बाद B जुड़ता है। शुरू से कुल कितने दिन लगेंगे`,
        `A अकेला ${a} दिन और B अकेला ${b} दिन लेता है। A ${doneTime} दिन अकेला काम करता है, फिर B जुड़ता है। पूरा काम कुल कितने दिन में होगा`,
        `A काम शुरू करता है। A उसे ${a} दिन में और B ${b} दिन में कर सकता है। B ${doneTime} दिन बाद जुड़े तो काम कब पूरा होगा`,
        `A पहले ${doneTime} दिन अकेला काम करता है। A और B के अकेले समय ${a} और ${b} दिन हैं। कुल समय कितना होगा`,
      ], [
        `A ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। A ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${doneTime} ਦਿਨਾਂ ਬਾਅਦ B ਜੁੜਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `A ਇਕੱਲਾ ${a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${b} ਦਿਨ ਲੈਂਦਾ ਹੈ। A ${doneTime} ਦਿਨ ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ B ਜੁੜਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਵੇਗਾ`,
        `A ਕੰਮ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। A ਉਸ ਨੂੰ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦਾ ਹੈ। B ${doneTime} ਦਿਨਾਂ ਬਾਅਦ ਜੁੜੇ ਤਾਂ ਕੰਮ ਕਦੋਂ ਪੂਰਾ ਹੋਵੇਗਾ`,
        `A ਪਹਿਲਾਂ ${doneTime} ਦਿਨ ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ। A ਅਤੇ B ਦੇ ਇਕੱਲੇ ਸਮੇਂ ${a} ਅਤੇ ${b} ਦਿਨ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      ]);
    }
    if (archetype === "forwardLeave") {
      const bRate = remainingRate;
      const aRate = doneRate - bRate;
      const a = timeFrom(totalWork, aRate);
      const b = timeFrom(totalWork, bRate);
      return stemFrom(seed, [
        `A and B start a work together. A can complete it in ${a} days and B in ${b} days. After ${doneTime} days, A leaves. In how many days will the work be completed in all`,
        `A and B begin a job together. A alone needs ${a} days and B alone needs ${b} days. A leaves after ${doneTime} days. In how many days will the job be completed in all`,
        `A can finish a work in ${a} days and B in ${b} days. They work together for ${doneTime} days, then B alone finishes it. How many days are taken altogether`,
        `A and B work together at first. A's time is ${a} days and B's time is ${b} days. If A leaves after ${doneTime} days, when will the job be finished in all`,
        `A and B start the same job. A alone takes ${a} days and B alone takes ${b} days. After ${doneTime} days only B continues. How many days are needed in all`,
        `A and B jointly work for ${doneTime} days. A then leaves, and B completes the job. If A and B alone need ${a} and ${b} days, how many days does the work take`,
      ], [
        `A और B साथ काम शुरू करते हैं। A ${a} दिन और B ${b} दिन में काम कर सकता है। ${doneTime} दिन बाद A चला जाता है। शुरू से कुल कितने दिन लगेंगे`,
        `A और B मिलकर काम शुरू करते हैं। उनके अकेले समय ${a} और ${b} दिन हैं। A ${doneTime} दिन बाद चला जाता है। कुल समय कितना होगा`,
        `A काम ${a} दिन में और B ${b} दिन में कर सकता है। दोनों ${doneTime} दिन साथ काम करते हैं, फिर B अकेला पूरा करता है। कुल कितने दिन लगेंगे`,
        `A और B पहले साथ काम करते हैं। A का समय ${a} दिन और B का ${b} दिन है। A ${doneTime} दिन बाद जाए तो काम कब पूरा होगा`,
      ], [
        `A ਅਤੇ B ਨਾਲ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। A ${a} ਦਿਨ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਕਰ ਸਕਦਾ ਹੈ। ${doneTime} ਦਿਨਾਂ ਬਾਅਦ A ਚਲਾ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਇਕੱਲੇ ਸਮੇਂ ${a} ਅਤੇ ${b} ਦਿਨ ਹਨ। A ${doneTime} ਦਿਨਾਂ ਬਾਅਦ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `A ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦਾ ਹੈ। ਦੋਵੇਂ ${doneTime} ਦਿਨ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ, ਫਿਰ B ਇਕੱਲਾ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `A ਅਤੇ B ਪਹਿਲਾਂ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। A ਦਾ ਸਮਾਂ ${a} ਦਿਨ ਅਤੇ B ਦਾ ${b} ਦਿਨ ਹੈ। A ${doneTime} ਦਿਨਾਂ ਬਾਅਦ ਜਾਵੇ ਤਾਂ ਕੰਮ ਕਦੋਂ ਪੂਰਾ ਹੋਵੇਗਾ`,
      ]);
    }
    if (archetype === "backwardLeave") {
      const leaves = asNumberList(variables.leaveBefore);
      const a = timeFrom(totalWork, rates[0] ?? 6);
      const b = timeFrom(totalWork, rates[1] ?? 4);
      return stemFrom(seed, [
        `A and B can separately complete a work in ${a} and ${b} days. A is absent for the last ${leaves[0] ?? 2} days and B is absent for the last ${leaves[1] ?? 3} days. In how many days is the work completed`,
        `A alone takes ${a} days and B alone takes ${b} days. During a joint job, A does not work in the last ${leaves[0] ?? 2} days and B does not work in the last ${leaves[1] ?? 3} days. What is the total time`,
        `A and B work on a job but leave before it is completed. A leaves ${leaves[0] ?? 2} days early and B leaves ${leaves[1] ?? 3} days early. A alone takes ${a} days and B alone takes ${b} days. How long does the job take`,
        `A can do a job in ${a} days and B in ${b} days. A misses the final ${leaves[0] ?? 2} days and B misses the final ${leaves[1] ?? 3} days. Find the total number of days`,
        `In a joint job, A alone needs ${a} days and B alone needs ${b} days. A is not present in the last ${leaves[0] ?? 2} days and B in the last ${leaves[1] ?? 3} days. How many days does the job take`,
        `A and B can finish a job alone in ${a} and ${b} days. If A stops ${leaves[0] ?? 2} days before the end and B stops ${leaves[1] ?? 3} days before the end, how many days are needed`,
      ], [
        `A और B अलग-अलग काम ${a} और ${b} दिन में कर सकते हैं। A अंतिम ${leaves[0] ?? 2} दिन और B अंतिम ${leaves[1] ?? 3} दिन अनुपस्थित रहता है। काम कितने दिन में पूरा होगा`,
        `A अकेला ${a} दिन और B अकेला ${b} दिन लेता है। संयुक्त काम में A आखिरी ${leaves[0] ?? 2} दिन और B आखिरी ${leaves[1] ?? 3} दिन काम नहीं करता। कुल समय कितना होगा`,
        `A और B काम पूरा होने से पहले चले जाते हैं। A ${leaves[0] ?? 2} दिन पहले और B ${leaves[1] ?? 3} दिन पहले जाता है। उनके अकेले समय ${a} और ${b} दिन हैं। काम में कितने दिन लगेंगे`,
        `A काम ${a} दिन में और B ${b} दिन में कर सकता है। A अंतिम ${leaves[0] ?? 2} दिन और B अंतिम ${leaves[1] ?? 3} दिन नहीं रहता। कुल दिन ज्ञात करें`,
      ], [
        `A ਅਤੇ B ਵੱਖ-ਵੱਖ ਕੰਮ ${a} ਅਤੇ ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। A ਆਖਰੀ ${leaves[0] ?? 2} ਦਿਨ ਅਤੇ B ਆਖਰੀ ${leaves[1] ?? 3} ਦਿਨ ਗੈਰਹਾਜ਼ਰ ਰਹਿੰਦਾ ਹੈ। ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ`,
        `A ਇਕੱਲਾ ${a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${b} ਦਿਨ ਲੈਂਦਾ ਹੈ। ਸਾਂਝੇ ਕੰਮ ਵਿੱਚ A ਆਖਰੀ ${leaves[0] ?? 2} ਦਿਨ ਅਤੇ B ਆਖਰੀ ${leaves[1] ?? 3} ਦਿਨ ਕੰਮ ਨਹੀਂ ਕਰਦਾ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `A ਅਤੇ B ਕੰਮ ਪੂਰਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਚਲੇ ਜਾਂਦੇ ਹਨ। A ${leaves[0] ?? 2} ਦਿਨ ਪਹਿਲਾਂ ਅਤੇ B ${leaves[1] ?? 3} ਦਿਨ ਪਹਿਲਾਂ ਜਾਂਦਾ ਹੈ। ਉਹਨਾਂ ਦੇ ਇਕੱਲੇ ਸਮੇਂ ${a} ਅਤੇ ${b} ਦਿਨ ਹਨ। ਕੰਮ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `A ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦਾ ਹੈ। A ਆਖਰੀ ${leaves[0] ?? 2} ਦਿਨ ਅਤੇ B ਆਖਰੀ ${leaves[1] ?? 3} ਦਿਨ ਨਹੀਂ ਰਹਿੰਦਾ। ਕੁੱਲ ਦਿਨ ਪਤਾ ਕਰੋ`,
      ]);
    }
    if (archetype === "interrupted") {
      const activeTime = dayValue(totalWork / remainingRate);
      const pauseText = `${calendarOffset} ${calendarOffset === 1 ? "day" : "days"}`;
      return stemFrom(seed, [
      `A team can finish a job in ${activeTime} days of actual work. The work stops for ${pauseText} in between. In how many calendar days will the job be completed`,
      `A group needs ${activeTime} working days to complete a job. If there is a break of ${pauseText}, how many days pass from start to finish`,
      `Workers can complete a job in ${activeTime} days if there is no break. Work is paused for ${pauseText}. What is the total elapsed time`,
      `A job would be completed in ${activeTime} days of work. Due to a ${pauseText} stoppage, in how many calendar days is it completed`,
      `A team requires ${activeTime} working days for a job. If work is interrupted for ${pauseText}, what is the total duration`,
      `A job needs ${activeTime} days of work. Work stops for ${pauseText} during the job. How many days pass from start to finish`,
      ], [
        `एक दल को काम पूरा करने के लिए ${activeTime} कामकाजी दिन चाहिए। बीच में ${calendarOffset} दिन काम रुकता है। कुल कैलेंडर समय कितना होगा`,
        `एक काम के लिए ${activeTime} सक्रिय दिन चाहिए। ${calendarOffset} दिन के विराम के कारण पूरा होने तक कितने दिन बीतेंगे`,
        `मजदूर काम ${activeTime} कामकाजी दिन में पूरा कर सकते हैं। यदि काम ${calendarOffset} दिन रुकता है, तो कुल समय कितना होगा`,
        `काम का वास्तविक कामकाजी समय ${activeTime} दिन है। ${calendarOffset} दिन की रुकावट हो तो कुल अवधि कितनी होगी`,
      ], [
        `ਇੱਕ ਟੀਮ ਨੂੰ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ${activeTime} ਕੰਮਕਾਜੀ ਦਿਨ ਚਾਹੀਦੇ ਹਨ। ਵਿਚਕਾਰ ${calendarOffset} ਦਿਨ ਕੰਮ ਰੁਕਦਾ ਹੈ। ਕੁੱਲ ਕੈਲੰਡਰ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਇੱਕ ਕੰਮ ਲਈ ${activeTime} ਸਰਗਰਮ ਦਿਨ ਚਾਹੀਦੇ ਹਨ। ${calendarOffset} ਦਿਨ ਦੇ ਵਿਰਾਮ ਕਾਰਨ ਪੂਰਾ ਹੋਣ ਤੱਕ ਕਿੰਨੇ ਦਿਨ ਬੀਤਣਗੇ`,
        `ਮਜ਼ਦੂਰ ਕੰਮ ${activeTime} ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਜੇ ਕੰਮ ${calendarOffset} ਦਿਨ ਰੁਕਦਾ ਹੈ, ਤਾਂ ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਕੰਮ ਦਾ ਅਸਲ ਕੰਮਕਾਜੀ ਸਮਾਂ ${activeTime} ਦਿਨ ਹੈ। ${calendarOffset} ਦਿਨ ਦੀ ਰੁਕਾਵਟ ਹੋਵੇ ਤਾਂ ਕੁੱਲ ਮਿਆਦ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
      ]);
    }
    const action = archetype === "replacement" ? "one worker is replaced" : "more workers join";
    return stemFrom(seed, [
      `A printing team completes ${doneRate} pages per day for the first ${doneTime} days. After that, ${action} and the team completes ${remainingRate} pages per day. If ${totalWork} pages must be completed, how many days are needed in all`,
      `For ${doneTime} days a team completes ${doneRate} forms per day. Then the team changes and completes ${remainingRate} forms per day. How many days will ${totalWork} forms take altogether`,
      `A packing job has ${totalWork} boxes. The team packs ${doneRate} boxes daily at first for ${doneTime} days, and then ${remainingRate} boxes daily. How many days are needed in all`,
      `During the first ${doneTime} days, ${doneRate} metres of wall are painted each day. After the team changes, ${remainingRate} metres are painted each day. How many days are needed for ${totalWork} metres`,
      `A work order has ${totalWork} forms. The first team completes ${doneRate} forms per day for ${doneTime} days, then the changed team completes ${remainingRate} per day. How many days will be required to complete the order`,
      `A team completes ${doneRate} files per day for ${doneTime} days and then ${remainingRate} files per day after a team change. How many days are required for ${totalWork} files`,
    ], [
      `एक टीम पहले ${doneTime} दिन रोज ${doneRate} फाइलें पूरी करती है। इसके बाद टीम बदलती है और रोज ${remainingRate} फाइलें पूरी करती है। ${totalWork} फाइलों के लिए कुल कितने दिन लगेंगे`,
      `${doneTime} दिन तक टीम रोज ${doneRate} फॉर्म पूरे करती है। फिर बदली हुई टीम रोज ${remainingRate} फॉर्म करती है। ${totalWork} फॉर्म कुल कितने दिन में पूरे होंगे`,
      `एक काम में ${totalWork} फाइलें हैं। पहले ${doneTime} दिन रोज ${doneRate} फाइलें और बाद में रोज ${remainingRate} फाइलें पूरी होती हैं। कुल समय कितना होगा`,
      `पहले ${doneTime} दिन रोज ${doneRate} दस्तावेज पूरे होते हैं। टीम बदलने के बाद रोज ${remainingRate} दस्तावेज पूरे होते हैं। ${totalWork} दस्तावेजों के लिए कितने दिन चाहिए`,
    ], [
      `ਇੱਕ ਟੀਮ ਪਹਿਲਾਂ ${doneTime} ਦਿਨ ਰੋਜ਼ ${doneRate} ਫਾਈਲਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ਟੀਮ ਬਦਲਦੀ ਹੈ ਅਤੇ ਰੋਜ਼ ${remainingRate} ਫਾਈਲਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ। ${totalWork} ਫਾਈਲਾਂ ਲਈ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
      `${doneTime} ਦਿਨ ਤੱਕ ਟੀਮ ਰੋਜ਼ ${doneRate} ਫਾਰਮ ਪੂਰੇ ਕਰਦੀ ਹੈ। ਫਿਰ ਬਦਲੀ ਹੋਈ ਟੀਮ ਰੋਜ਼ ${remainingRate} ਫਾਰਮ ਕਰਦੀ ਹੈ। ${totalWork} ਫਾਰਮ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰੇ ਹੋਣਗੇ`,
      `ਇੱਕ ਕੰਮ ਵਿੱਚ ${totalWork} ਫਾਈਲਾਂ ਹਨ। ਪਹਿਲਾਂ ${doneTime} ਦਿਨ ਰੋਜ਼ ${doneRate} ਫਾਈਲਾਂ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਰੋਜ਼ ${remainingRate} ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `ਪਹਿਲਾਂ ${doneTime} ਦਿਨ ਰੋਜ਼ ${doneRate} ਦਸਤਾਵੇਜ਼ ਪੂਰੇ ਹੁੰਦੇ ਹਨ। ਟੀਮ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਰੋਜ਼ ${remainingRate} ਦਸਤਾਵੇਜ਼ ਪੂਰੇ ਹੁੰਦੇ ਹਨ। ${totalWork} ਦਸਤਾਵੇਜ਼ਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
    ]);
  }

  if (archetype === "workerAdded" || archetype === "deadlineExtra" || archetype === "workerRemoved") {
    const totalWork = asNumber(variables.totalWork, asNumber(variables.plannedTotalWork, 240));
    const completedWork = asNumber(variables.completedWork, Math.max(0, totalWork - asNumber(variables.remainingWork, 120)));
    const currentWorkers = asNumber(variables.currentWorkers, asNumber(variables.originalWorkers, 12));
    const worked = asNumber(variables.worked, 10);
    const timeLeft = asNumber(variables.timeLeft, 10);
    const removedWorkers = asNumber(variables.removedWorkers, 3);
    if (archetype === "workerRemoved") {
      return stemFrom(seed, [
        `${currentWorkers} workers were expected to complete a job in the planned time. After working for ${worked} days, ${removedWorkers} workers left. By how many days will the job be delayed`,
        `${currentWorkers} workers start a job together. After ${worked} days, ${removedWorkers} of them leave. What is the delay in days compared with the original plan`,
        `A job was planned with ${currentWorkers} workers. When ${worked} days had passed, ${removedWorkers} workers left. How many extra days will be needed`,
        `${currentWorkers} equal workers begin a job. After ${worked} days, only ${currentWorkers - removedWorkers} workers remain. By how many days is the work delayed`,
        `A team of ${currentWorkers} workers works for ${worked} days, then ${removedWorkers} workers leave. What is the delay in completion`,
        `${currentWorkers} workers were assigned to a job. ${removedWorkers} workers left after ${worked} days. How many days late will the job finish`,
      ], [
        `${currentWorkers} मजदूर नियोजित समय में काम पूरा करने वाले थे। ${worked} दिन काम के बाद ${removedWorkers} मजदूर चले गए। काम कितने दिन देर से पूरा होगा`,
        `${currentWorkers} मजदूर साथ काम शुरू करते हैं। ${worked} दिन बाद उनमें से ${removedWorkers} चले जाते हैं। मूल योजना से कितने दिन की देरी होगी`,
        `एक काम ${currentWorkers} मजदूरों से होना था। ${worked} दिन बाद ${removedWorkers} मजदूर चले गए। कितने अतिरिक्त दिन लगेंगे`,
        `${currentWorkers} मजदूर काम शुरू करते हैं। ${worked} दिन बाद केवल ${currentWorkers - removedWorkers} मजदूर रह जाते हैं। काम में कितनी देरी होगी`,
      ], [
        `${currentWorkers} ਮਜ਼ਦੂਰ ਨਿਯਤ ਸਮੇਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਨ। ${worked} ਦਿਨ ਕੰਮ ਤੋਂ ਬਾਅਦ ${removedWorkers} ਮਜ਼ਦੂਰ ਚਲੇ ਗਏ। ਕੰਮ ਕਿੰਨੇ ਦਿਨ ਦੇਰੀ ਨਾਲ ਪੂਰਾ ਹੋਵੇਗਾ`,
        `${currentWorkers} ਮਜ਼ਦੂਰ ਨਾਲ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${worked} ਦਿਨਾਂ ਬਾਅਦ ਉਹਨਾਂ ਵਿੱਚੋਂ ${removedWorkers} ਚਲੇ ਜਾਂਦੇ ਹਨ। ਮੂਲ ਯੋਜਨਾ ਨਾਲੋਂ ਕਿੰਨੇ ਦਿਨ ਦੀ ਦੇਰੀ ਹੋਵੇਗੀ`,
        `ਇੱਕ ਕੰਮ ${currentWorkers} ਮਜ਼ਦੂਰਾਂ ਨਾਲ ਹੋਣਾ ਸੀ। ${worked} ਦਿਨਾਂ ਬਾਅਦ ${removedWorkers} ਮਜ਼ਦੂਰ ਚਲੇ ਗਏ। ਕਿੰਨੇ ਵਾਧੂ ਦਿਨ ਲੱਗਣਗੇ`,
        `${currentWorkers} ਮਜ਼ਦੂਰ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${worked} ਦਿਨਾਂ ਬਾਅਦ ਕੇਵਲ ${currentWorkers - removedWorkers} ਮਜ਼ਦੂਰ ਰਹਿ ਜਾਂਦੇ ਹਨ। ਕੰਮ ਵਿੱਚ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ`,
      ]);
    }
    return stemFrom(seed, [
      `${currentWorkers} workers have completed ${completedWork} of ${totalWork} forms. Only ${timeLeft} days are left. How many extra workers are needed to finish on time`,
      `A job has ${totalWork} forms. ${currentWorkers} workers have finished ${completedWork} forms, and ${timeLeft} days remain. How many more workers should be added`,
      `${currentWorkers} workers have packed ${completedWork} boxes out of ${totalWork}. To finish the rest in ${timeLeft} days, how many additional workers are needed`,
      `After a delay, ${completedWork} of ${totalWork} records are completed by ${currentWorkers} workers. How many extra workers are needed if the remaining records must be finished in ${timeLeft} days`,
      `A team of ${currentWorkers} workers has completed ${completedWork} items from a ${totalWork}-item order. With ${timeLeft} days left, how many workers must be added`,
      `${completedWork} of ${totalWork} forms are complete. ${currentWorkers} workers are available and ${timeLeft} days remain. How many additional workers are required`,
    ], [
      `${currentWorkers} मजदूरों ने ${totalWork} फॉर्म में से ${completedWork} फॉर्म पूरे कर दिए हैं। केवल ${timeLeft} दिन बचे हैं। समय पर पूरा करने के लिए कितने अतिरिक्त मजदूर चाहिए`,
      `एक काम में ${totalWork} फॉर्म हैं। ${currentWorkers} मजदूर ${completedWork} फॉर्म कर चुके हैं और ${timeLeft} दिन बचे हैं। कितने और मजदूर जोड़ने होंगे`,
      `${currentWorkers} मजदूरों ने ${totalWork} में से ${completedWork} फाइलें कर दी हैं। शेष काम ${timeLeft} दिन में पूरा करने के लिए कितने अतिरिक्त मजदूर चाहिए`,
      `देरी के बाद ${totalWork} रिकॉर्ड में से ${completedWork} रिकॉर्ड ${currentWorkers} मजदूरों ने कर दिए हैं। बाकी ${timeLeft} दिन में करने के लिए कितने और मजदूर चाहिए`,
    ], [
      `${currentWorkers} ਮਜ਼ਦੂਰਾਂ ਨੇ ${totalWork} ਫਾਰਮਾਂ ਵਿੱਚੋਂ ${completedWork} ਫਾਰਮ ਪੂਰੇ ਕਰ ਦਿੱਤੇ ਹਨ। ਕੇਵਲ ${timeLeft} ਦਿਨ ਬਚੇ ਹਨ। ਸਮੇਂ ਤੇ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਵਾਧੂ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ`,
      `ਇੱਕ ਕੰਮ ਵਿੱਚ ${totalWork} ਫਾਰਮ ਹਨ। ${currentWorkers} ਮਜ਼ਦੂਰ ${completedWork} ਫਾਰਮ ਕਰ ਚੁੱਕੇ ਹਨ ਅਤੇ ${timeLeft} ਦਿਨ ਬਚੇ ਹਨ। ਕਿੰਨੇ ਹੋਰ ਮਜ਼ਦੂਰ ਜੋੜਣੇ ਹੋਣਗੇ`,
      `${currentWorkers} ਮਜ਼ਦੂਰਾਂ ਨੇ ${totalWork} ਵਿੱਚੋਂ ${completedWork} ਫਾਈਲਾਂ ਕਰ ਦਿੱਤੀਆਂ ਹਨ। ਬਾਕੀ ਕੰਮ ${timeLeft} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਵਾਧੂ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ`,
      `ਦੇਰੀ ਤੋਂ ਬਾਅਦ ${totalWork} ਰਿਕਾਰਡਾਂ ਵਿੱਚੋਂ ${completedWork} ਰਿਕਾਰਡ ${currentWorkers} ਮਜ਼ਦੂਰਾਂ ਨੇ ਕਰ ਦਿੱਤੇ ਹਨ। ਬਾਕੀ ${timeLeft} ਦਿਨਾਂ ਵਿੱਚ ਕਰਨ ਲਈ ਕਿੰਨੇ ਹੋਰ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ`,
    ]);
  }

  if (["cycleTwo", "cycleHours", "cycleGroup", "terminalCycle", "workRest", "conditionalCycle"].includes(archetype)) {
    const totalWork = asNumber(variables.totalWork, 90);
    const rates = asNumberList(variables.rates);
    const unit = archetype === "cycleHours" ? "hours" : "days";
    if (archetype === "workRest") {
      return stemFrom(seed, [
        `A works every alternate day and rests on the next day. On each working day A lays ${rates[0] ?? 8} metres of cable. If ${totalWork} metres are to be laid, in how many days will the work be completed`,
        `A follows a one-day work and one-day rest pattern. A completes ${rates[0] ?? 8} metres of fencing on each working day. How many days are needed for ${totalWork} metres`,
        `A works on day 1, rests on day 2, and repeats this pattern. A completes ${rates[0] ?? 8} metres on a working day. In how many days will ${totalWork} metres be completed`,
        `A works only on alternate days. A finishes ${rates[0] ?? 8} metres on each working day. If the total work is ${totalWork} metres, in how many calendar days will it be completed`,
        `A completes ${rates[0] ?? 8} metres whenever he works and then rests the next day. How many days will ${totalWork} metres take`,
        `A works for one day and rests for one day repeatedly. If A completes ${rates[0] ?? 8} metres on each workday, how many days are needed for ${totalWork} metres`,
      ], [
        `A एक दिन काम करता है और अगले दिन आराम करता है। हर कामकाजी दिन A ${rates[0] ?? 8} मीटर केबल बिछाता है। ${totalWork} मीटर के लिए कितने दिन लगेंगे`,
        `A एक दिन काम और एक दिन आराम का क्रम रखता है। हर काम वाले दिन ${rates[0] ?? 8} मीटर बाड़ लगती है। ${totalWork} मीटर के लिए कितने दिन चाहिए`,
        `A पहले दिन काम करता है, दूसरे दिन आराम करता है और यही क्रम दोहराता है। काम वाले दिन ${rates[0] ?? 8} मीटर काम होता है। ${totalWork} मीटर कब पूरा होगा`,
        `A के लिए केवल वैकल्पिक दिन काम के हैं। हर कामकाजी दिन ${rates[0] ?? 8} मीटर पूरा होता है। ${totalWork} मीटर के लिए कुल कितने दिन लगेंगे`,
      ], [
        `A ਇੱਕ ਦਿਨ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਦਿਨ ਆਰਾਮ ਕਰਦਾ ਹੈ। ਹਰ ਕੰਮਕਾਜੀ ਦਿਨ A ${rates[0] ?? 8} ਮੀਟਰ ਕੇਬਲ ਪਾਉਂਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਲਈ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `A ਇੱਕ ਦਿਨ ਕੰਮ ਅਤੇ ਇੱਕ ਦਿਨ ਆਰਾਮ ਦਾ ਕ੍ਰਮ ਰੱਖਦਾ ਹੈ। ਹਰ ਕੰਮ ਵਾਲੇ ਦਿਨ ${rates[0] ?? 8} ਮੀਟਰ ਬਾੜ ਲੱਗਦੀ ਹੈ। ${totalWork} ਮੀਟਰ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
        `A ਪਹਿਲੇ ਦਿਨ ਕੰਮ ਕਰਦਾ ਹੈ, ਦੂਜੇ ਦਿਨ ਆਰਾਮ ਕਰਦਾ ਹੈ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਦੁਹਰਾਉਂਦਾ ਹੈ। ਕੰਮ ਵਾਲੇ ਦਿਨ ${rates[0] ?? 8} ਮੀਟਰ ਕੰਮ ਹੁੰਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਕਦੋਂ ਪੂਰਾ ਹੋਵੇਗਾ`,
        `A ਲਈ ਕੇਵਲ ਬਦਲਵੇਂ ਦਿਨ ਕੰਮ ਦੇ ਹਨ। ਹਰ ਕੰਮਕਾਜੀ ਦਿਨ ${rates[0] ?? 8} ਮੀਟਰ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਲਈ ਕੁੱਲ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
      ]);
    }
    if (archetype === "cycleGroup" || archetype === "conditionalCycle") {
      return stemFrom(seed, [
        `A, B and C work on successive days in that order. They pack ${rates[0] ?? 8}, ${rates[1] ?? 5} and ${rates[2] ?? 4} boxes respectively on their turns. If ${totalWork} boxes are to be packed, in how many days will the job be completed`,
        `Three workers take turns in the order A, B, C. They print ${rates[0] ?? 8}, ${rates[1] ?? 5} and ${rates[2] ?? 4} pages on their turns. How many days are needed for ${totalWork} pages`,
        `A works on the first day, B on the second and C on the third, then the order repeats. They complete ${rates[0] ?? 8}, ${rates[1] ?? 5} and ${rates[2] ?? 4} forms on their days. In how many days will ${totalWork} forms be completed`,
        `A, B and C handle documents one day at a time in rotation. They complete ${rates[0] ?? 8}, ${rates[1] ?? 5} and ${rates[2] ?? 4} documents on their turns. In how many days will ${totalWork} documents be finished`,
        `Workers A, B and C work one after another daily. A repairs ${rates[0] ?? 8} metres of road, B ${rates[1] ?? 5} metres and C ${rates[2] ?? 4} metres. How many days are needed for ${totalWork} metres`,
        `The order is A, then B, then C, and it repeats. They build ${rates[0] ?? 8}, ${rates[1] ?? 5} and ${rates[2] ?? 4} metres of wall on their turns. How many days are needed for ${totalWork} metres`,
      ], [
        `A, B और C क्रम से अलग-अलग दिन काम करते हैं। वे अपनी बारी में ${rates[0] ?? 8}, ${rates[1] ?? 5} और ${rates[2] ?? 4} फाइलें करते हैं। ${totalWork} फाइलें कितने दिन में पूरी होंगी`,
        `तीन मजदूर A, B, C के क्रम में बारी-बारी काम करते हैं। उनकी दैनिक फाइल संख्या ${rates[0] ?? 8}, ${rates[1] ?? 5} और ${rates[2] ?? 4} है। ${totalWork} फाइलों के लिए कितने दिन चाहिए`,
        `पहले दिन A, दूसरे दिन B और तीसरे दिन C काम करता है, फिर यही क्रम दोहरता है। वे ${rates[0] ?? 8}, ${rates[1] ?? 5} और ${rates[2] ?? 4} फॉर्म करते हैं। ${totalWork} फॉर्म कितने दिन लेंगे`,
        `A, B और C एक-एक दिन के क्रम से दस्तावेज संभालते हैं। उनकी दैनिक संख्या ${rates[0] ?? 8}, ${rates[1] ?? 5} और ${rates[2] ?? 4} है। ${totalWork} दस्तावेज कितने दिन में होंगे`,
      ], [
        `A, B ਅਤੇ C ਕ੍ਰਮ ਨਾਲ ਵੱਖ-ਵੱਖ ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਹ ਆਪਣੀ ਵਾਰੀ ਵਿੱਚ ${rates[0] ?? 8}, ${rates[1] ?? 5} ਅਤੇ ${rates[2] ?? 4} ਫਾਈਲਾਂ ਕਰਦੇ ਹਨ। ${totalWork} ਫਾਈਲਾਂ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ`,
        `ਤਿੰਨ ਮਜ਼ਦੂਰ A, B, C ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਫਾਈਲ ਗਿਣਤੀ ${rates[0] ?? 8}, ${rates[1] ?? 5} ਅਤੇ ${rates[2] ?? 4} ਹੈ। ${totalWork} ਫਾਈਲਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
        `ਪਹਿਲੇ ਦਿਨ A, ਦੂਜੇ ਦਿਨ B ਅਤੇ ਤੀਜੇ ਦਿਨ C ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ ਇਹੀ ਕ੍ਰਮ ਦੁਹਰਦਾ ਹੈ। ਉਹ ${rates[0] ?? 8}, ${rates[1] ?? 5} ਅਤੇ ${rates[2] ?? 4} ਫਾਰਮ ਕਰਦੇ ਹਨ। ${totalWork} ਫਾਰਮ ਕਿੰਨੇ ਦਿਨ ਲੈਣਗੇ`,
        `A, B ਅਤੇ C ਇੱਕ-ਇੱਕ ਦਿਨ ਦੇ ਕ੍ਰਮ ਨਾਲ ਦਸਤਾਵੇਜ਼ ਸੰਭਾਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਗਿਣਤੀ ${rates[0] ?? 8}, ${rates[1] ?? 5} ਅਤੇ ${rates[2] ?? 4} ਹੈ। ${totalWork} ਦਸਤਾਵੇਜ਼ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਣਗੇ`,
      ]);
    }
    return stemFrom(seed, [
      `A and B work on alternate ${unit}, starting with A. A packs ${rates[0] ?? 8} boxes in ${unit === "hours" ? "an hour" : "a day"} and B packs ${rates[1] ?? 5} boxes in ${unit === "hours" ? "an hour" : "a day"}. If ${totalWork} boxes are to be packed, in how many ${unit} will the job be finished`,
      `A works first and B works next, then the order repeats. A completes ${rates[0] ?? 8} forms and B completes ${rates[1] ?? 5} forms on their turns. How many ${unit} are needed for ${totalWork} forms`,
      `Two workers take turns, with A starting. A prints ${rates[0] ?? 8} pages per turn and B prints ${rates[1] ?? 5} pages per turn. In how many ${unit} will ${totalWork} pages be printed`,
      `A and B work by turns. A starts and paints ${rates[0] ?? 8} metres per turn; B paints ${rates[1] ?? 5} metres. How many ${unit} will ${totalWork} metres take`,
      `Starting with A, two workers alternate. A completes ${rates[0] ?? 8} records and B completes ${rates[1] ?? 5} records on their respective turns. How many ${unit} will be required to complete ${totalWork} records`,
      `A repairs ${rates[0] ?? 8} metres of road on his turn and B repairs ${rates[1] ?? 5} metres on the next turn. They continue alternately, starting with A. If the road length is ${totalWork} metres, in how many ${unit} will the repair be completed`,
    ], [
      `A और B बारी-बारी ${unit === "hours" ? "घंटे" : "दिन"} काम करते हैं और शुरुआत A करता है। A अपनी बारी में ${rates[0] ?? 8} फाइलें और B ${rates[1] ?? 5} फाइलें करता है। ${totalWork} फाइलें कितने ${unit === "hours" ? "घंटों" : "दिनों"} में पूरी होंगी`,
      `पहले A और फिर B काम करता है, फिर यही क्रम दोहरता है। वे अपनी बारी में ${rates[0] ?? 8} और ${rates[1] ?? 5} फॉर्म करते हैं। ${totalWork} फॉर्म के लिए कितने ${unit === "hours" ? "घंटे" : "दिन"} चाहिए`,
      `दो मजदूर बारी-बारी काम करते हैं और A शुरू करता है। A हर बारी में ${rates[0] ?? 8} फाइलें और B ${rates[1] ?? 5} फाइलें करता है। ${totalWork} फाइलें कितने ${unit === "hours" ? "घंटों" : "दिनों"} में होंगी`,
      `A और B बारी से काम करते हैं। A शुरू करता है और हर बारी में ${rates[0] ?? 8} दस्तावेज करता है; B ${rates[1] ?? 5} करता है। ${totalWork} दस्तावेज कितने ${unit === "hours" ? "घंटों" : "दिनों"} में होंगे`,
    ], [
      `A ਅਤੇ B ਵਾਰੀ-ਵਾਰੀ ${unit === "hours" ? "ਘੰਟੇ" : "ਦਿਨ"} ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਸ਼ੁਰੂਆਤ A ਕਰਦਾ ਹੈ। A ਆਪਣੀ ਵਾਰੀ ਵਿੱਚ ${rates[0] ?? 8} ਫਾਈਲਾਂ ਅਤੇ B ${rates[1] ?? 5} ਫਾਈਲਾਂ ਕਰਦਾ ਹੈ। ${totalWork} ਫਾਈਲਾਂ ਕਿੰਨੇ ${unit === "hours" ? "ਘੰਟਿਆਂ" : "ਦਿਨਾਂ"} ਵਿੱਚ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ`,
      `ਪਹਿਲਾਂ A ਅਤੇ ਫਿਰ B ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ ਇਹੀ ਕ੍ਰਮ ਦੁਹਰਦਾ ਹੈ। ਉਹ ਆਪਣੀ ਵਾਰੀ ਵਿੱਚ ${rates[0] ?? 8} ਅਤੇ ${rates[1] ?? 5} ਫਾਰਮ ਕਰਦੇ ਹਨ। ${totalWork} ਫਾਰਮ ਲਈ ਕਿੰਨੇ ${unit === "hours" ? "ਘੰਟੇ" : "ਦਿਨ"} ਚਾਹੀਦੇ ਹਨ`,
      `ਦੋ ਮਜ਼ਦੂਰ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ A ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। A ਹਰ ਵਾਰੀ ਵਿੱਚ ${rates[0] ?? 8} ਫਾਈਲਾਂ ਅਤੇ B ${rates[1] ?? 5} ਫਾਈਲਾਂ ਕਰਦਾ ਹੈ। ${totalWork} ਫਾਈਲਾਂ ਕਿੰਨੇ ${unit === "hours" ? "ਘੰਟਿਆਂ" : "ਦਿਨਾਂ"} ਵਿੱਚ ਹੋਣਗੀਆਂ`,
      `A ਅਤੇ B ਵਾਰੀ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। A ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ਹਰ ਵਾਰੀ ਵਿੱਚ ${rates[0] ?? 8} ਦਸਤਾਵੇਜ਼ ਕਰਦਾ ਹੈ; B ${rates[1] ?? 5} ਕਰਦਾ ਹੈ। ${totalWork} ਦਸਤਾਵੇਜ਼ ਕਿੰਨੇ ${unit === "hours" ? "ਘੰਟਿਆਂ" : "ਦਿਨਾਂ"} ਵਿੱਚ ਹੋਣਗੇ`,
    ]);
  }

  if (["equivMenWomen", "equivThreeTypes", "orAndTeams", "teamCompare"].includes(archetype)) {
    const totalWork = asNumber(variables.totalWork, 300);
    const counts = asNumberList(variables.counts);
    const unitRates = asNumberList(variables.unitRates);
    const men = counts[0] ?? 3;
    const women = counts[1] ?? 4;
    const children = counts[2] ?? 0;
    return stemFrom(seed, [
      `One man packs ${unitRates[0] ?? 4} boxes in a day and one woman packs ${unitRates[1] ?? 3} boxes in a day. If ${men} men and ${women} women work together, in how many days will they pack ${totalWork} boxes`,
      `${men} men and ${women} women work together. A man packs ${unitRates[0] ?? 4} boxes per day and a woman packs ${unitRates[1] ?? 3} boxes per day. How many days are needed for ${totalWork} boxes`,
      `In a workshop, each man finishes ${unitRates[0] ?? 4} boxes daily and each woman finishes ${unitRates[1] ?? 3} boxes daily. In how many days will ${men} men and ${women} women finish ${totalWork} boxes`,
      `A packing job has ${totalWork} boxes. If ${men} men and ${women} women work together, with each man doing ${unitRates[0] ?? 4} boxes and each woman ${unitRates[1] ?? 3} boxes daily, how many days will it take`,
      `${men} men, ${women} women${children ? ` and ${children} children` : ""} work together on ${totalWork} boxes. Their daily capacities are ${unitRates.join(", ")} boxes respectively. How many days will they take`,
      `A team has ${men} men and ${women} women${children ? ` with ${children} children` : ""}. They finish ${unitRates.join(", ")} boxes per person per day respectively. How many days are needed for ${totalWork} boxes`,
    ], [
      `एक पुरुष रोज ${unitRates[0] ?? 4} वस्तुएँ और एक महिला रोज ${unitRates[1] ?? 3} वस्तुएँ करती है। ${men} पुरुष और ${women} महिलाएँ मिलकर ${totalWork} वस्तुएँ कितने दिन में करेंगे`,
      `${men} पुरुष और ${women} महिलाएँ साथ काम करते हैं। एक पुरुष रोज ${unitRates[0] ?? 4} और एक महिला रोज ${unitRates[1] ?? 3} वस्तुएँ करती है। ${totalWork} वस्तुओं के लिए कितने दिन चाहिए`,
      `मिश्रित दल में ${men} पुरुष और ${women} महिलाएँ हैं। उनकी दैनिक संख्या क्रमशः ${unitRates[0] ?? 4} और ${unitRates[1] ?? 3} है। दल ${totalWork} वस्तुएँ कितने दिन में करेगा`,
      `यदि हर पुरुष रोज ${unitRates[0] ?? 4} वस्तुएँ और हर महिला ${unitRates[1] ?? 3} वस्तुएँ करती है, तो ${men} पुरुष और ${women} महिलाएँ ${totalWork} वस्तुएँ कितने दिन में करेंगे`,
    ], [
      `ਇੱਕ ਆਦਮੀ ਰੋਜ਼ ${unitRates[0] ?? 4} ਵਸਤੂਆਂ ਅਤੇ ਇੱਕ ਔਰਤ ਰੋਜ਼ ${unitRates[1] ?? 3} ਵਸਤੂਆਂ ਕਰਦੀ ਹੈ। ${men} ਆਦਮੀ ਅਤੇ ${women} ਔਰਤਾਂ ਮਿਲ ਕੇ ${totalWork} ਵਸਤੂਆਂ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰਨਗੇ`,
      `${men} ਆਦਮੀ ਅਤੇ ${women} ਔਰਤਾਂ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। ਇੱਕ ਆਦਮੀ ਰੋਜ਼ ${unitRates[0] ?? 4} ਅਤੇ ਇੱਕ ਔਰਤ ਰੋਜ਼ ${unitRates[1] ?? 3} ਵਸਤੂਆਂ ਕਰਦੀ ਹੈ। ${totalWork} ਵਸਤੂਆਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
      `ਮਿਸ਼ਰਤ ਟੀਮ ਵਿੱਚ ${men} ਆਦਮੀ ਅਤੇ ${women} ਔਰਤਾਂ ਹਨ। ਉਹਨਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਗਿਣਤੀ ਕ੍ਰਮਵਾਰ ${unitRates[0] ?? 4} ਅਤੇ ${unitRates[1] ?? 3} ਹੈ। ਟੀਮ ${totalWork} ਵਸਤੂਆਂ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰੇਗੀ`,
      `ਜੇ ਹਰ ਆਦਮੀ ਰੋਜ਼ ${unitRates[0] ?? 4} ਵਸਤੂਆਂ ਅਤੇ ਹਰ ਔਰਤ ${unitRates[1] ?? 3} ਵਸਤੂਆਂ ਕਰਦੀ ਹੈ, ਤਾਂ ${men} ਆਦਮੀ ਅਤੇ ${women} ਔਰਤਾਂ ${totalWork} ਵਸਤੂਆਂ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰਨਗੇ`,
    ]);
  }

  if (archetype === "efficiencyChain") {
    const first = asNumberList(variables.firstRatio);
    const second = asNumberList(variables.secondRatio);
    const a = first[0] ?? 2;
    const b = first[1] ?? 3;
    const c = second[0] ?? 4;
    const d = second[1] ?? 5;
    return stemFrom(seed, [
      `The efficiencies of A and B are in the ratio ${a}:${b}, and the efficiencies of B and C are in the ratio ${c}:${d}. What is the ratio A:B:C`,
      `The efficiency ratio of A to B is ${a}:${b}. The efficiency ratio of B to C is ${c}:${d}. Find the ratio A:B:C`,
      `A:B is ${a}:${b} and B:C is ${c}:${d} for the same kind of work. What is the combined ratio A:B:C`,
      `For three workers, the efficiency ratio A:B is ${a}:${b} and B:C is ${c}:${d}. What is the ratio A:B:C`,
      `The efficiency ratio A:B is ${a}:${b}, while B:C is ${c}:${d}. Find the ratio A:B:C`,
      `Given the efficiency ratios A:B = ${a}:${b} and B:C = ${c}:${d}, what is the ratio A:B:C`,
    ], [
      `A और B की कार्य क्षमता ${a}:${b} है और B तथा C की कार्य क्षमता ${c}:${d} है। A:B:C क्या होगा`,
      `A:B क्षमता अनुपात ${a}:${b} है। B:C क्षमता अनुपात ${c}:${d} है। A:B:C ज्ञात करें`,
      `समान काम के लिए A:B = ${a}:${b} और B:C = ${c}:${d} है। संयुक्त अनुपात A:B:C क्या होगा`,
      `तीन मजदूरों के लिए A:B = ${a}:${b} और B:C = ${c}:${d} है। A, B और C का अनुपात क्या होगा`,
    ], [
      `A ਅਤੇ B ਦੀ ਕੰਮ ਸਮਰੱਥਾ ${a}:${b} ਹੈ ਅਤੇ B ਅਤੇ C ਦੀ ਕੰਮ ਸਮਰੱਥਾ ${c}:${d} ਹੈ। A:B:C ਕੀ ਹੋਵੇਗਾ`,
      `A:B ਸਮਰੱਥਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। B:C ਸਮਰੱਥਾ ਅਨੁਪਾਤ ${c}:${d} ਹੈ। A:B:C ਪਤਾ ਕਰੋ`,
      `ਇੱਕੋ ਕੰਮ ਲਈ A:B = ${a}:${b} ਅਤੇ B:C = ${c}:${d} ਹੈ। ਸਾਂਝਾ ਅਨੁਪਾਤ A:B:C ਕੀ ਹੋਵੇਗਾ`,
      `ਤਿੰਨ ਮਜ਼ਦੂਰਾਂ ਲਈ A:B = ${a}:${b} ਅਤੇ B:C = ${c}:${d} ਹੈ। A, B ਅਤੇ C ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ`,
    ]);
  }

  if (["pairwiseThree", "teamMinusPair", "unknownWorker", "contributionRate", "unknownPhase"].includes(archetype)) {
    if (archetype === "pairwiseThree") {
      const ab = asNumber(variables.ab, 10);
      const bc = asNumber(variables.bc, 12);
      const ac = asNumber(variables.ac, 15);
      return stemFrom(seed, [
        `A and B together complete a work in ${ab} days, B and C in ${bc} days, and C and A in ${ac} days. In how many days will A alone complete it`,
        `The pairs A+B, B+C and C+A finish a job in ${ab}, ${bc} and ${ac} days respectively. In how many days will A alone finish it`,
        `A with B takes ${ab} days, B with C takes ${bc} days and C with A takes ${ac} days. How many days will A alone take`,
        `For the same work, AB finishes in ${ab} days, BC in ${bc} days and CA in ${ac} days. In how many days can A alone finish it`,
        `A+B, B+C and C+A can complete a job in ${ab}, ${bc} and ${ac} days. In how many days can A alone complete the job`,
        `Three pairs of workers finish the same job in ${ab}, ${bc} and ${ac} days. If the pairs are AB, BC and CA, in how many days can A alone finish it`,
      ], [
        `A और B साथ काम ${ab} दिन में, B और C ${bc} दिन में तथा C और A ${ac} दिन में पूरा करते हैं। A अकेला कितने दिन लेगा`,
        `जोड़े A+B, B+C और C+A काम क्रमशः ${ab}, ${bc} और ${ac} दिन में करते हैं। A का अकेला समय क्या होगा`,
        `A के साथ B ${ab} दिन लेता है, B के साथ C ${bc} दिन और C के साथ A ${ac} दिन। A अकेला कितने दिन लेगा`,
        `समान काम के लिए AB ${ab} दिन, BC ${bc} दिन और CA ${ac} दिन लेते हैं। A का समय ज्ञात करें`,
      ], [
        `A ਅਤੇ B ਨਾਲ ਕੰਮ ${ab} ਦਿਨਾਂ ਵਿੱਚ, B ਅਤੇ C ${bc} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ C ਅਤੇ A ${ac} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
        `ਜੋੜੇ A+B, B+C ਅਤੇ C+A ਕੰਮ ਕ੍ਰਮਵਾਰ ${ab}, ${bc} ਅਤੇ ${ac} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਦਾ ਇਕੱਲਾ ਸਮਾਂ ਕੀ ਹੋਵੇਗਾ`,
        `A ਨਾਲ B ${ab} ਦਿਨ ਲੈਂਦਾ ਹੈ, B ਨਾਲ C ${bc} ਦਿਨ ਅਤੇ C ਨਾਲ A ${ac} ਦਿਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
        `ਇੱਕੋ ਕੰਮ ਲਈ AB ${ab} ਦਿਨ, BC ${bc} ਦਿਨ ਅਤੇ CA ${ac} ਦਿਨ ਲੈਂਦੇ ਹਨ। A ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ`,
      ]);
    }
    if (archetype === "contributionRate") {
      const contribution = asNumber(variables.contribution, 30);
      const time = asNumber(variables.time, 5);
      return {
        en: question(phrase(`${seed}:en`, [
          `A checks ${contribution} answer sheets in ${time} days. How many answer sheets does A check in one day`,
          `An examiner checks ${contribution} answer sheets in ${time} days. How many answer sheets are checked per day`,
          `A teacher evaluates ${contribution} answer sheets in ${time} days. What is the daily number of answer sheets evaluated`,
          `In ${time} days, A checks ${contribution} answer sheets. How many answer sheets are checked in one day`,
          `A completes checking ${contribution} answer sheets over ${time} days. What is the one-day count of answer sheets`,
          `A has to check answer sheets. If ${contribution} sheets are checked in ${time} days, how many sheets are checked per day`,
        ])),
        hi: question(`A ${time} दिन में ${contribution} उत्तर-पत्रक जाँचता है। A एक दिन में कितने उत्तर-पत्रक जाँचेगा`),
        pa: question(`A ${time} ਦਿਨਾਂ ਵਿੱਚ ${contribution} ਉੱਤਰ ਪੱਤਰ ਜਾਂਚਦਾ ਹੈ। A ਇੱਕ ਦਿਨ ਵਿੱਚ ਕਿੰਨੇ ਉੱਤਰ ਪੱਤਰ ਜਾਂਚੇਗਾ`),
      };
      return stemFrom(seed, [
        `A checks ${contribution} answer sheets in ${time} days. How many answer sheets does A check in one day`,
        `A processes ${contribution} files in ${time} days. What is A's daily file count`,
        `A completes ${contribution} forms in ${time} days. How many forms are completed per day`,
        `In ${time} days, A finishes ${contribution} records. What is the number of records finished in one day`,
        `A handles ${contribution} documents over ${time} days. How many documents are handled per day`,
        `A finishes ${contribution} items in ${time} days. What is A's one-day item count`,
      ], [
        `A ${time} दिन में ${contribution} उत्तर-पुस्तिकाएँ जांचता है। A एक दिन में कितनी उत्तर-पुस्तिकाएँ जांचेगा`,
        `A ${time} दिन में ${contribution} फाइलें पूरी करता है। A की दैनिक फाइल संख्या क्या होगी`,
        `A ${time} दिन में ${contribution} फॉर्म पूरे करता है। एक दिन में कितने फॉर्म पूरे होंगे`,
        `${time} दिन में A ${contribution} रिकॉर्ड पूरे करता है। एक दिन में रिकॉर्ड की संख्या कितनी होगी`,
      ], [
        `A ${time} ਦਿਨਾਂ ਵਿੱਚ ${contribution} ਉੱਤਰ-ਪੱਤਰੀਆਂ ਜਾਂਚਦਾ ਹੈ। A ਇੱਕ ਦਿਨ ਵਿੱਚ ਕਿੰਨੀਆਂ ਉੱਤਰ-ਪੱਤਰੀਆਂ ਜਾਂਚੇਗਾ`,
        `A ${time} ਦਿਨਾਂ ਵਿੱਚ ${contribution} ਫਾਈਲਾਂ ਪੂਰੀ ਕਰਦਾ ਹੈ। A ਦੀ ਰੋਜ਼ਾਨਾ ਫਾਈਲ ਗਿਣਤੀ ਕੀ ਹੋਵੇਗੀ`,
        `A ${time} ਦਿਨਾਂ ਵਿੱਚ ${contribution} ਫਾਰਮ ਪੂਰੇ ਕਰਦਾ ਹੈ। ਇੱਕ ਦਿਨ ਵਿੱਚ ਕਿੰਨੇ ਫਾਰਮ ਪੂਰੇ ਹੋਣਗੇ`,
        `${time} ਦਿਨਾਂ ਵਿੱਚ A ${contribution} ਰਿਕਾਰਡ ਪੂਰੇ ਕਰਦਾ ਹੈ। ਇੱਕ ਦਿਨ ਵਿੱਚ ਰਿਕਾਰਡ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
      ]);
    }
    if (archetype === "unknownPhase") {
      const totalWork = asNumber(variables.totalWork, 120);
      const fixedWork = asNumber(variables.fixedWork, 48);
      const unknownRate = asNumber(variables.unknownRate, 8);
      return stemFrom(seed, [
        `A publishing job has ${totalWork} pages. The first stages finish ${fixedWork} pages. The last typist can type ${unknownRate} pages per day. How many days will the last stage take`,
        `Out of ${totalWork} forms, ${fixedWork} forms are already complete. The final worker completes ${unknownRate} forms daily. How many days are needed for the rest`,
        `A record-entry job has ${totalWork} records. Earlier workers complete ${fixedWork} records. If the final worker enters ${unknownRate} records per day, how many days will be needed`,
        `${fixedWork} pages of a ${totalWork}-page job are complete. The remaining pages are typed at ${unknownRate} pages per day. In how many days will the job finish`,
        `A team has completed ${fixedWork} documents from a total of ${totalWork}. The last stage completes ${unknownRate} documents per day. How many days will that stage take`,
        `A job contains ${totalWork} forms. After ${fixedWork} forms are done, one worker finishes ${unknownRate} forms each day. How many days are needed to finish it`,
      ], [
        `एक प्रकाशन कार्य में ${totalWork} पृष्ठ हैं। पहले चरण ${fixedWork} पृष्ठ पूरे करते हैं। अंतिम टाइपिस्ट रोज ${unknownRate} पृष्ठ टाइप करता है। अंतिम चरण में कितने दिन लगेंगे`,
        `${totalWork} फॉर्म में से ${fixedWork} फॉर्म पूरे हो चुके हैं। अंतिम मजदूर रोज ${unknownRate} फॉर्म करता है। बाकी के लिए कितने दिन चाहिए`,
        `रिकॉर्ड प्रविष्टि के काम में ${totalWork} रिकॉर्ड हैं। पहले मजदूर ${fixedWork} रिकॉर्ड पूरे करते हैं। अंतिम मजदूर रोज ${unknownRate} रिकॉर्ड करे तो कितने दिन लगेंगे`,
        `${totalWork} पृष्ठ के काम में से ${fixedWork} पृष्ठ पूरे हैं। बाकी पृष्ठ रोज ${unknownRate} की गति से टाइप होते हैं। काम कितने दिन में पूरा होगा`,
      ], [
        `ਇੱਕ ਪ੍ਰਕਾਸ਼ਨ ਕੰਮ ਵਿੱਚ ${totalWork} ਸਫ਼ੇ ਹਨ। ਪਹਿਲੇ ਪੜਾਅ ${fixedWork} ਸਫ਼ੇ ਪੂਰੇ ਕਰਦੇ ਹਨ। ਆਖਰੀ ਟਾਈਪਿਸਟ ਰੋਜ਼ ${unknownRate} ਸਫ਼ੇ ਟਾਈਪ ਕਰਦਾ ਹੈ। ਆਖਰੀ ਪੜਾਅ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `${totalWork} ਫਾਰਮਾਂ ਵਿੱਚੋਂ ${fixedWork} ਫਾਰਮ ਪੂਰੇ ਹੋ ਚੁੱਕੇ ਹਨ। ਆਖਰੀ ਮਜ਼ਦੂਰ ਰੋਜ਼ ${unknownRate} ਫਾਰਮ ਕਰਦਾ ਹੈ। ਬਾਕੀ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
        `ਰਿਕਾਰਡ ਐਂਟਰੀ ਦੇ ਕੰਮ ਵਿੱਚ ${totalWork} ਰਿਕਾਰਡ ਹਨ। ਪਹਿਲੇ ਮਜ਼ਦੂਰ ${fixedWork} ਰਿਕਾਰਡ ਪੂਰੇ ਕਰਦੇ ਹਨ। ਆਖਰੀ ਮਜ਼ਦੂਰ ਰੋਜ਼ ${unknownRate} ਰਿਕਾਰਡ ਕਰੇ ਤਾਂ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `${totalWork} ਸਫ਼ਿਆਂ ਦੇ ਕੰਮ ਵਿੱਚੋਂ ${fixedWork} ਸਫ਼ੇ ਪੂਰੇ ਹਨ। ਬਾਕੀ ਸਫ਼ੇ ਰੋਜ਼ ${unknownRate} ਦੀ ਗਤੀ ਨਾਲ ਟਾਈਪ ਹੁੰਦੇ ਹਨ। ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ`,
      ]);
    }
    const teamTime = asNumber(variables.teamTime, 6);
    const knownTimes = asNumberList(variables.knownTimes);
    return stemFrom(seed, [
      `A, B and C together complete a work in ${teamTime} days. A and B together can complete it in ${knownTimes[0] ?? 10} days. In how many days will C alone complete the work`,
      `A, B and C can finish a job together in ${teamTime} days. A and B together need ${knownTimes[0] ?? 10} days. How many days will C alone take`,
      `The three workers A, B and C complete a work in ${teamTime} days. If A and B together complete it in ${knownTimes[0] ?? 10} days, how many days will C alone need`,
      `A+B+C finish a job in ${teamTime} days, while A+B finish the same job in ${knownTimes[0] ?? 10} days. In how many days can C finish it alone`,
      `A, B and C together take ${teamTime} days. A and B together take ${knownTimes[0] ?? 10} days. In how many days can C alone complete it`,
      `A job is completed by A, B and C together in ${teamTime} days. A and B together can do it in ${knownTimes[0] ?? 10} days. In how many days can C alone do it`,
    ], [
      `A, B और C मिलकर काम ${teamTime} दिन में करते हैं। A और B मिलकर उसे ${knownTimes[0] ?? 10} दिन में कर सकते हैं। C अकेला कितने दिन लेगा`,
      `पूरी टीम A+B+C काम ${teamTime} दिन में करती है। ज्ञात मजदूरों के समय ${knownTimes.join(" और ")} दिन हैं। बचे हुए मजदूर का अकेला समय क्या होगा`,
      `एक टीम काम ${teamTime} दिन में पूरा करती है। दिए गए अकेले समय ${knownTimes.join(", ")} दिन हैं। अज्ञात मजदूर का समय कितना होगा`,
      `A, B और C साथ काम ${teamTime} दिन में पूरा करते हैं। ज्ञात मजदूर अकेले ${knownTimes.join(" और ")} दिन लेते हैं। शेष मजदूर का समय ज्ञात करें`,
    ], [
      `A, B ਅਤੇ C ਮਿਲ ਕੇ ਕੰਮ ${teamTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਅਤੇ B ਮਿਲ ਕੇ ਉਸ ਨੂੰ ${knownTimes[0] ?? 10} ਦਿਨਾਂ ਵਿੱਚ ਕਰ ਸਕਦੇ ਹਨ। C ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ`,
      `ਪੂਰੀ ਟੀਮ A+B+C ਕੰਮ ${teamTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੀ ਹੈ। ਜਾਣੇ ਮਜ਼ਦੂਰਾਂ ਦੇ ਸਮੇਂ ${knownTimes.join(" ਅਤੇ ")} ਦਿਨ ਹਨ। ਬਚੇ ਹੋਏ ਮਜ਼ਦੂਰ ਦਾ ਇਕੱਲਾ ਸਮਾਂ ਕੀ ਹੋਵੇਗਾ`,
      `ਇੱਕ ਟੀਮ ਕੰਮ ${teamTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਦਿੱਤੇ ਇਕੱਲੇ ਸਮੇਂ ${knownTimes.join(", ")} ਦਿਨ ਹਨ। ਅਣਜਾਣ ਮਜ਼ਦੂਰ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `A, B ਅਤੇ C ਨਾਲ ਕੰਮ ${teamTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਜਾਣੇ ਮਜ਼ਦੂਰ ਇਕੱਲੇ ${knownTimes.join(" ਅਤੇ ")} ਦਿਨ ਲੈਂਦੇ ਹਨ। ਬਾਕੀ ਮਜ਼ਦੂਰ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ`,
    ]);
  }

  if (["wageShare", "helperWage", "partialTimeWage", "efficiencyTimeWage", "contractBonus", "qualityRejection"].includes(archetype)) {
    if (archetype === "contractBonus") {
      const base = asNumber(variables.base, 8000);
      const deltaDays = asNumber(variables.deltaDays, 3);
      const bonusPerDay = asNumber(variables.bonusPerDay, 200);
      return stemFrom(seed, [
        `A contractor is to receive ₹${base}. For each day of early completion, a bonus of ₹${bonusPerDay} is paid. If the work is completed ${deltaDays} days early, what amount will the contractor receive`,
        `A job contract pays ₹${base}, with ₹${bonusPerDay} extra for every day saved. The job is finished ${deltaDays} days early. What is the final payment`,
        `A contractor earns ₹${base} for a job and gets ₹${bonusPerDay} per day as bonus for finishing early. If the work is ${deltaDays} days early, what is the earning`,
        `A contract amount is ₹${base}. Completion ${deltaDays} days before the deadline earns ₹${bonusPerDay} per day as bonus. What amount is payable`,
        `A job pays ₹${base} plus ₹${bonusPerDay} for each day completed early. If it is completed ${deltaDays} days early, what is the total earning`,
        `A contractor receives ₹${base} and a bonus of ₹${bonusPerDay} per day saved. For ${deltaDays} days saved, what is the total amount`,
      ], [
        `एक ठेकेदार को ₹${base} मिलने हैं। समय से पहले हर दिन के लिए ₹${bonusPerDay} बोनस मिलता है। काम ${deltaDays} दिन पहले पूरा हो तो कितनी राशि मिलेगी`,
        `एक काम का ठेका ₹${base} का है और हर बचाए दिन पर ₹${bonusPerDay} अतिरिक्त मिलते हैं। काम ${deltaDays} दिन पहले पूरा हुआ। अंतिम भुगतान कितना होगा`,
        `ठेकेदार को काम के लिए ₹${base} और जल्दी पूरा करने पर रोज ₹${bonusPerDay} बोनस मिलता है। काम ${deltaDays} दिन पहले हो तो कमाई कितनी होगी`,
        `ठेका राशि ₹${base} है। समयसीमा से ${deltaDays} दिन पहले पूरा करने पर ₹${bonusPerDay} प्रति दिन बोनस मिलता है। देय राशि कितनी होगी`,
      ], [
        `ਇੱਕ ਠੇਕੇਦਾਰ ਨੂੰ ₹${base} ਮਿਲਣੇ ਹਨ। ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਦਿਨ ਲਈ ₹${bonusPerDay} ਬੋਨਸ ਮਿਲਦਾ ਹੈ। ਕੰਮ ${deltaDays} ਦਿਨ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਵੇ ਤਾਂ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ`,
        `ਇੱਕ ਕੰਮ ਦਾ ਠੇਕਾ ₹${base} ਦਾ ਹੈ ਅਤੇ ਹਰ ਬਚੇ ਦਿਨ ਤੇ ₹${bonusPerDay} ਵਾਧੂ ਮਿਲਦੇ ਹਨ। ਕੰਮ ${deltaDays} ਦਿਨ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਇਆ। ਆਖਰੀ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਠੇਕੇਦਾਰ ਨੂੰ ਕੰਮ ਲਈ ₹${base} ਅਤੇ ਜਲਦੀ ਪੂਰਾ ਕਰਨ ਤੇ ਰੋਜ਼ ₹${bonusPerDay} ਬੋਨਸ ਮਿਲਦਾ ਹੈ। ਕੰਮ ${deltaDays} ਦਿਨ ਪਹਿਲਾਂ ਹੋਵੇ ਤਾਂ ਕਮਾਈ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
        `ਠੇਕਾ ਰਕਮ ₹${base} ਹੈ। ਸਮਾਂ ਸੀਮਾ ਤੋਂ ${deltaDays} ਦਿਨ ਪਹਿਲਾਂ ਪੂਰਾ ਕਰਨ ਤੇ ₹${bonusPerDay} ਪ੍ਰਤੀ ਦਿਨ ਬੋਨਸ ਮਿਲਦਾ ਹੈ। ਦੇਣਯੋਗ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
      ]);
    }
    if (archetype === "qualityRejection") {
      const grossRate = asNumber(variables.grossRate, 100);
      const time = asNumber(variables.time, 6);
      const acceptPercent = asNumber(variables.acceptPercent, 90);
      return stemFrom(seed, [
        `A printer prints ${grossRate} pages per hour for ${time} hours. If only ${acceptPercent}% of the pages are accepted, how many pages are accepted`,
        `${grossRate} pages are printed every hour for ${time} hours. After checking, ${acceptPercent}% are accepted. How many accepted pages are there`,
        `A press prints at ${grossRate} pages per hour for ${time} hours. If ${acceptPercent}% pass inspection, what is the number of accepted pages`,
        `A machine prints ${grossRate} pages per hour. It runs for ${time} hours and ${acceptPercent}% pages are usable. How many usable pages are obtained`,
        `In ${time} hours, a printer works at ${grossRate} pages per hour. If ${acceptPercent}% are approved, how many pages are approved`,
        `A printing job produces ${grossRate} pages each hour for ${time} hours. With ${acceptPercent}% acceptance, what is the accepted page count`,
      ], [
        `एक प्रिंटर ${time} घंटे तक प्रति घंटे ${grossRate} पृष्ठ छापता है। यदि केवल ${acceptPercent}% पृष्ठ स्वीकार होते हैं, तो कितने पृष्ठ स्वीकार होंगे`,
        `${time} घंटे तक हर घंटे ${grossRate} पृष्ठ छपते हैं। जांच के बाद ${acceptPercent}% स्वीकार होते हैं। स्वीकार पृष्ठ कितने हैं`,
        `एक प्रेस ${time} घंटे तक प्रति घंटे ${grossRate} पृष्ठ छापती है। यदि ${acceptPercent}% जांच में पास होते हैं, तो पृष्ठों की संख्या कितनी होगी`,
        `एक मशीन प्रति घंटे ${grossRate} पृष्ठ छापती है। वह ${time} घंटे चलती है और ${acceptPercent}% पृष्ठ उपयोगी हैं। उपयोगी पृष्ठ कितने मिलेंगे`,
      ], [
        `ਇੱਕ ਪ੍ਰਿੰਟਰ ${time} ਘੰਟਿਆਂ ਤੱਕ ਪ੍ਰਤੀ ਘੰਟਾ ${grossRate} ਸਫ਼ੇ ਛਾਪਦਾ ਹੈ। ਜੇ ਕੇਵਲ ${acceptPercent}% ਸਫ਼ੇ ਮਨਜ਼ੂਰ ਹੁੰਦੇ ਹਨ, ਤਾਂ ਕਿੰਨੇ ਸਫ਼ੇ ਮਨਜ਼ੂਰ ਹੋਣਗੇ`,
        `${time} ਘੰਟਿਆਂ ਤੱਕ ਹਰ ਘੰਟੇ ${grossRate} ਸਫ਼ੇ ਛਪਦੇ ਹਨ। ਜਾਂਚ ਤੋਂ ਬਾਅਦ ${acceptPercent}% ਮਨਜ਼ੂਰ ਹੁੰਦੇ ਹਨ। ਮਨਜ਼ੂਰ ਸਫ਼ੇ ਕਿੰਨੇ ਹਨ`,
        `ਇੱਕ ਪ੍ਰੈਸ ${time} ਘੰਟਿਆਂ ਤੱਕ ਪ੍ਰਤੀ ਘੰਟਾ ${grossRate} ਸਫ਼ੇ ਛਾਪਦੀ ਹੈ। ਜੇ ${acceptPercent}% ਜਾਂਚ ਵਿੱਚ ਪਾਸ ਹੁੰਦੇ ਹਨ, ਤਾਂ ਸਫ਼ਿਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
        `ਇੱਕ ਮਸ਼ੀਨ ਪ੍ਰਤੀ ਘੰਟਾ ${grossRate} ਸਫ਼ੇ ਛਾਪਦੀ ਹੈ। ਉਹ ${time} ਘੰਟੇ ਚੱਲਦੀ ਹੈ ਅਤੇ ${acceptPercent}% ਸਫ਼ੇ ਵਰਤਣਯੋਗ ਹਨ। ਵਰਤਣਯੋਗ ਸਫ਼ੇ ਕਿੰਨੇ ਮਿਲਣਗੇ`,
      ]);
    }
    const totalWage = asNumber(variables.totalWage, 9000);
    const contributions = asNumberList(variables.contributions);
    const index = asNumber(variables.index, 0);
    const person = index === 2 ? "C" : index === 1 ? "B" : "A";
    if (contributions.length === 2) {
      const ratio = contributions.join(":");
      return {
        en: question(phrase(`${seed}:en`, [
          `A and B complete a job and receive ₹${totalWage}. Their work shares are in the ratio ${ratio}. What is ${person}'s share`,
          `The total wage for a job is ₹${totalWage}. A and B contribute in the ratio ${ratio}. How much should ${person} receive`,
          `A job earns ₹${totalWage} for A and B. If their work shares are in the ratio ${ratio}, what is ${person}'s wage`,
          `A and B divide ₹${totalWage} according to the work-share ratio ${ratio}. What will ${person} receive`,
          `Two workers receive ₹${totalWage} for a job. Their contributions are proportional to ${ratio}. How much will ${person} get`,
          `A contract payment of ₹${totalWage} is shared between A and B in the ratio ${ratio}. What amount goes to ${person}`,
        ])),
        hi: question(`A और B एक काम पूरा कर ₹${totalWage} पाते हैं। उनके काम का अनुपात ${ratio} है। ${person} का हिस्सा कितना होगा`),
        pa: question(`A ਅਤੇ B ਇੱਕ ਕੰਮ ਪੂਰਾ ਕਰਕੇ ₹${totalWage} ਲੈਂਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${person} ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੋਵੇਗਾ`),
      };
    }
    return stemFrom(seed, [
      `A, B and C complete a job and receive ₹${totalWage}. Their work shares are in the ratio ${contributions.join(":")}. What is ${person}'s share`,
      `The total wage for a job is ₹${totalWage}. A, B and C contribute in the ratio ${contributions.join(":")}. How much should ${person} receive`,
      `A job earns ₹${totalWage} for the workers. If their work shares are in the ratio ${contributions.join(":")}, what is ${person}'s wage`,
      `A, B and C divide ₹${totalWage} according to the work-share ratio ${contributions.join(":")}. What will ${person} receive`,
      `Three workers receive ₹${totalWage} for a job. Their contributions are proportional to ${contributions.join(":")}. How much will ${person} get`,
      `A contract payment of ₹${totalWage} is shared among A, B and C in the ratio ${contributions.join(":")}. What amount goes to ${person}`,
    ], [
      `A, B और C एक काम पूरा कर ₹${totalWage} पाते हैं। उनके काम के हिस्से ${contributions.join(":")} के अनुपात में हैं। ${person} का हिस्सा कितना होगा`,
      `एक काम की कुल मजदूरी ₹${totalWage} है। A, B और C का योगदान ${contributions.join(":")} के अनुपात में है। ${person} को कितना मिलना चाहिए`,
      `एक काम से मजदूरों को ₹${totalWage} मिलते हैं। यदि A:B:C योगदान अनुपात ${contributions.join(":")} है, तो ${person} की मजदूरी कितनी होगी`,
      `A, B और C ₹${totalWage} को अपने योगदान अनुपात ${contributions.join(":")} में बांटते हैं। ${person} का हिस्सा ज्ञात करें`,
    ], [
      `A, B ਅਤੇ C ਇੱਕ ਕੰਮ ਪੂਰਾ ਕਰਕੇ ₹${totalWage} ਲੈਂਦੇ ਹਨ। ਉਹਨਾਂ ਦੇ ਕੰਮ ਦੇ ਹਿੱਸੇ ${contributions.join(":")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। ${person} ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `ਇੱਕ ਕੰਮ ਦੀ ਕੁੱਲ ਮਜ਼ਦੂਰੀ ₹${totalWage} ਹੈ। A, B ਅਤੇ C ਦਾ ਯੋਗਦਾਨ ${contributions.join(":")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ। ${person} ਨੂੰ ਕਿੰਨਾ ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ`,
      `ਇੱਕ ਕੰਮ ਤੋਂ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ₹${totalWage} ਮਿਲਦੇ ਹਨ। ਜੇ A:B:C ਯੋਗਦਾਨ ਅਨੁਪਾਤ ${contributions.join(":")} ਹੈ, ਤਾਂ ${person} ਦੀ ਮਜ਼ਦੂਰੀ ਕਿੰਨੀ ਹੋਵੇਗੀ`,
      `A, B ਅਤੇ C ₹${totalWage} ਨੂੰ ਆਪਣੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ${contributions.join(":")} ਵਿੱਚ ਵੰਡਦੇ ਹਨ। ${person} ਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ`,
    ]);
  }

  if (["pipeNet", "twoFillersLeak", "hiddenLeak", "delayedLeak", "pipeCycle", "pipeTerminalCycle", "partialTank", "pipeClosure", "pipeTimings", "unknownPipe"].includes(archetype)) {
    if (archetype === "hiddenLeak") {
      const normalTime = asNumber(variables.normalTime, 12);
      const leakedTime = asNumber(variables.leakedTime, 18);
      return stemFrom(seed, [
        `A pipe can fill a tank in ${normalTime} hours. Due to a leak, the tank is filled in ${leakedTime} hours. In how many hours can the leak empty the full tank`,
        `A tank is filled by a pipe in ${normalTime} hours. When a leak is present, it takes ${leakedTime} hours. How many hours will the leak alone take to empty the tank`,
        `Normally a pipe fills a tank in ${normalTime} hours, but with leakage it fills in ${leakedTime} hours. What is the emptying time of the leak`,
        `An inlet pipe fills a tank in ${normalTime} hours. With a leak, the same tank fills in ${leakedTime} hours. In how many hours can the leak empty a full tank`,
        `A pipe fills a tank in ${normalTime} hours. A leak slows the filling to ${leakedTime} hours. What time will the leak take to empty the tank alone`,
        `Without leakage, a tank fills in ${normalTime} hours. With leakage, it fills in ${leakedTime} hours. Find the leak's emptying time in hours`,
      ], [
        `एक पाइप टंकी ${normalTime} घंटे में भरता है। रिसाव के कारण टंकी ${leakedTime} घंटे में भरती है। रिसाव अकेला भरी टंकी कितने घंटे में खाली करेगा`,
        `एक टंकी पाइप से ${normalTime} घंटे में भरती है। रिसाव होने पर ${leakedTime} घंटे लगते हैं। रिसाव अकेला टंकी कितने घंटे में खाली करेगा`,
        `सामान्य रूप से पाइप टंकी ${normalTime} घंटे में भरता है, लेकिन रिसाव के साथ ${leakedTime} घंटे लगते हैं। रिसाव का खाली करने का समय कितना है`,
        `एक भरने वाला पाइप टंकी के लिए ${normalTime} घंटे लेता है। रिसाव के साथ वही टंकी ${leakedTime} घंटे में भरती है। रिसाव भरी टंकी कितने घंटे में खाली करेगा`,
      ], [
        `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${normalTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਰਿਸਾਅ ਕਾਰਨ ਟੈਂਕੀ ${leakedTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ। ਰਿਸਾਅ ਇਕੱਲਾ ਭਰੀ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰੇਗਾ`,
        `ਇੱਕ ਟੈਂਕੀ ਪਾਈਪ ਨਾਲ ${normalTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ। ਰਿਸਾਅ ਹੋਣ ਤੇ ${leakedTime} ਘੰਟੇ ਲੱਗਦੇ ਹਨ। ਰਿਸਾਅ ਇਕੱਲਾ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰੇਗਾ`,
        `ਆਮ ਤੌਰ ਤੇ ਪਾਈਪ ਟੈਂਕੀ ${normalTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ, ਪਰ ਰਿਸਾਅ ਨਾਲ ${leakedTime} ਘੰਟੇ ਲੱਗਦੇ ਹਨ। ਰਿਸਾਅ ਦਾ ਖਾਲੀ ਕਰਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੈ`,
        `ਇੱਕ ਭਰਨ ਵਾਲਾ ਪਾਈਪ ਟੈਂਕੀ ਲਈ ${normalTime} ਘੰਟੇ ਲੈਂਦਾ ਹੈ। ਰਿਸਾਅ ਨਾਲ ਉਹੀ ਟੈਂਕੀ ${leakedTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੀ ਹੈ। ਰਿਸਾਅ ਭਰੀ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰੇਗਾ`,
      ]);
    }
    if (archetype === "partialTank") {
      const fillTime = asNumberList(variables.fillTimes)[0] ?? 12;
      return stemFrom(seed, [
        `A tank is already one-fourth full. A pipe can fill the whole tank in ${fillTime} hours. In how many hours will the remaining part be filled`,
        `A pipe fills a tank in ${fillTime} hours. If the tank is already ${inlineMath("\\frac{1}{4}")} full, how many hours are needed to fill it completely`,
        `One-fourth of a tank is filled. The pipe can fill a full tank in ${fillTime} hours. In how many hours will the remaining part be filled`,
        `A tank has ${inlineMath("\\frac{1}{4}")} of its capacity filled. A pipe fills the complete tank in ${fillTime} hours. What is the time needed now`,
        `If a tank is ${inlineMath("\\frac{1}{4}")} full and a pipe fills the tank in ${fillTime} hours, how many hours are required to fill it`,
        `A pipe takes ${fillTime} hours to fill a tank from empty. The tank is already one-fourth full. In how many hours will it be completely filled`,
      ], [
        `टंकी पहले से एक-चौथाई भरी है। एक पाइप पूरी टंकी ${fillTime} घंटे में भरता है। शेष भाग कितने घंटे में भरेगा`,
        `एक पाइप टंकी ${fillTime} घंटे में भरता है। यदि टंकी पहले से ${inlineMath("\\frac{1}{4}")} भरी है, तो उसे पूरा भरने में कितने घंटे लगेंगे`,
        `टंकी का एक-चौथाई भाग भरा है। पाइप पूरी टंकी ${fillTime} घंटे में भरता है। बाकी भरने में कितना समय लगेगा`,
        `टंकी की क्षमता का ${inlineMath("\\frac{1}{4}")} भाग भरा है। पाइप पूरी टंकी ${fillTime} घंटे में भरता है। अब कितना समय चाहिए`,
      ], [
        `ਟੈਂਕੀ ਪਹਿਲਾਂ ਤੋਂ ਇੱਕ-ਚੌਥਾਈ ਭਰੀ ਹੈ। ਇੱਕ ਪਾਈਪ ਪੂਰੀ ਟੈਂਕੀ ${fillTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਬਾਕੀ ਹਿੱਸਾ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗਾ`,
        `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${fillTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਜੇ ਟੈਂਕੀ ਪਹਿਲਾਂ ਤੋਂ ${inlineMath("\\frac{1}{4}")} ਭਰੀ ਹੈ, ਤਾਂ ਉਸ ਨੂੰ ਪੂਰਾ ਭਰਨ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
        `ਟੈਂਕੀ ਦਾ ਇੱਕ-ਚੌਥਾਈ ਹਿੱਸਾ ਭਰਿਆ ਹੈ। ਪਾਈਪ ਪੂਰੀ ਟੈਂਕੀ ${fillTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਬਾਕੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ`,
        `ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ਦਾ ${inlineMath("\\frac{1}{4}")} ਹਿੱਸਾ ਭਰਿਆ ਹੈ। ਪਾਈਪ ਪੂਰੀ ਟੈਂਕੀ ${fillTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਹੁਣ ਕਿੰਨਾ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ`,
      ]);
    }
    const fillTimes = asNumberList(variables.fillTimes);
    const emptyTimes = asNumberList(variables.emptyTimes);
    const fixedTime = asNumber(variables.fixedTime, asNumber(variables.doneTime, 2));
    if (archetype === "pipeClosure" || archetype === "pipeTimings") {
      const totalWork = asNumber(variables.totalWork, 36);
      const doneRate = asNumber(variables.doneRate, 3);
      const remainingRate = asNumber(variables.remainingRate, 5);
      const a = timeFrom(totalWork, archetype === "pipeClosure" ? doneRate - remainingRate : doneRate);
      const b = timeFrom(totalWork, archetype === "pipeClosure" ? remainingRate : remainingRate - doneRate);
      const eventEn = archetype === "pipeClosure" ? `Pipe A is closed after ${fixedTime} hours` : `Pipe B is opened ${fixedTime} hours later`;
      const eventHi = archetype === "pipeClosure" ? `${fixedTime} घंटे बाद पाइप A बंद कर दिया जाता है` : `${fixedTime} घंटे बाद पाइप B खोला जाता है`;
      const eventPa = archetype === "pipeClosure" ? `${fixedTime} ਘੰਟਿਆਂ ਬਾਅਦ ਪਾਈਪ A ਬੰਦ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ` : `${fixedTime} ਘੰਟਿਆਂ ਬਾਅਦ ਪਾਈਪ B ਖੋਲ੍ਹਿਆ ਜਾਂਦਾ ਹੈ`;
      return stemFrom(seed, [
        `Pipe A can fill a tank in ${a} hours and pipe B can fill it in ${b} hours. Both pipes are used, and ${eventEn}. In how many hours will the tank be completely filled`,
        `A tank has two filling pipes. Pipe A fills it in ${a} hours and pipe B in ${b} hours. ${eventEn}. In how many hours will the tank be completely filled`,
        `Pipe A takes ${a} hours and pipe B takes ${b} hours to fill the tank alone. If ${eventEn}, in how many hours will the tank be completely filled`,
        `Two filling pipes A and B take ${a} and ${b} hours respectively. If ${eventEn}, how many hours are needed to fill the tank`,
        `A tank is filled using pipes A and B. Pipe A alone takes ${a} hours and pipe B alone takes ${b} hours. If ${eventEn}, in how many hours will the tank be completely filled`,
        `Pipe A fills in ${a} hours and pipe B fills in ${b} hours. If ${eventEn}, in how many hours is the tank filled`,
      ], [
        `पाइप A टंकी ${a} घंटे में और पाइप B ${b} घंटे में भरता है। ${eventHi}। शुरू से टंकी कितने घंटे में भरेगी`,
        `टंकी में दो भरने वाले पाइप हैं। पाइप A ${a} घंटे और पाइप B ${b} घंटे में भरता है। ${eventHi}। कुल भरने का समय कितना होगा`,
        `पाइप A अकेला ${a} घंटे और पाइप B अकेला ${b} घंटे लेता है। दी गई खोलने-बंद करने की स्थिति में कितने घंटे लगेंगे`,
        `दो पाइप A और B क्रमशः ${a} और ${b} घंटे लेते हैं। ${eventHi}। टंकी भरने का समय कितना होगा`,
      ], [
        `ਪਾਈਪ A ਟੈਂਕੀ ${a} ਘੰਟਿਆਂ ਵਿੱਚ ਅਤੇ ਪਾਈਪ B ${b} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ${eventPa}। ਸ਼ੁਰੂ ਤੋਂ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
        `ਟੈਂਕੀ ਵਿੱਚ ਦੋ ਭਰਨ ਵਾਲੇ ਪਾਈਪ ਹਨ। ਪਾਈਪ A ${a} ਘੰਟੇ ਅਤੇ ਪਾਈਪ B ${b} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ${eventPa}। ਕੁੱਲ ਭਰਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਪਾਈਪ A ਇਕੱਲਾ ${a} ਘੰਟੇ ਅਤੇ ਪਾਈਪ B ਇਕੱਲਾ ${b} ਘੰਟੇ ਲੈਂਦਾ ਹੈ। ਦਿੱਤੀ ਖੋਲ੍ਹਣ-ਬੰਦ ਕਰਨ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
        `ਦੋ ਪਾਈਪ A ਅਤੇ B ਕ੍ਰਮਵਾਰ ${a} ਅਤੇ ${b} ਘੰਟੇ ਲੈਂਦੇ ਹਨ। ${eventPa}। ਟੈਂਕੀ ਭਰਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      ]);
    }
    if (archetype === "pipeCycle" || archetype === "pipeTerminalCycle") {
      return stemFrom(seed, [
        `Pipe A adds 12 litres in one hour and a drain removes 5 litres in the next hour. This pattern repeats. If the tank capacity is 60 litres, in how many hours will it be full`,
        `A tank is filled for one hour at 12 litres per hour and then drained for one hour at 5 litres per hour, repeatedly. How many hours are needed to fill a 60-litre tank`,
        `A filling tap adds 12 litres in an hour, then an emptying tap removes 5 litres in the next hour. The tank holds 60 litres. When will the tank become full`,
        `Water is added at 12 litres in the first hour and removed at 5 litres in the next hour, and this continues. How many hours will a 60-litre tank take to fill`,
        `A filling pipe and a drain work alternately for one hour each. The pipe adds 12 litres and the drain removes 5 litres. How many hours are needed for a 60-litre tank`,
        `A 60-litre tank is filled by alternate filling and draining hours. Filling adds 12 litres and draining removes 5 litres. In how many hours is the tank full`,
      ], [
        `एक नल एक घंटे में 12 लीटर भरता है और अगले घंटे निकासी 5 लीटर निकालती है। यह क्रम दोहरता है। 60 लीटर की टंकी कितने घंटे में भरेगी`,
        `टंकी एक घंटे 12 लीटर प्रति घंटे से भरती है और अगले घंटे 5 लीटर प्रति घंटे से खाली होती है। 60 लीटर टंकी भरने में कितने घंटे लगेंगे`,
        `भरने वाला नल एक घंटे में 12 लीटर जोड़ता है, फिर खाली करने वाला नल अगले घंटे 5 लीटर निकालता है। टंकी 60 लीटर की है। कब भरेगी`,
        `पहले घंटे 12 लीटर पानी भरता है और अगले घंटे 5 लीटर निकलता है, और यह चलता रहता है। 60 लीटर टंकी को भरने में कितने घंटे लगेंगे`,
      ], [
        `ਇੱਕ ਨਲ ਇੱਕ ਘੰਟੇ ਵਿੱਚ 12 ਲੀਟਰ ਭਰਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਘੰਟੇ ਨਿਕਾਸੀ 5 ਲੀਟਰ ਕੱਢਦੀ ਹੈ। ਇਹ ਕ੍ਰਮ ਦੁਹਰਦਾ ਹੈ। 60 ਲੀਟਰ ਦੀ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
        `ਟੈਂਕੀ ਇੱਕ ਘੰਟਾ 12 ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਨਾਲ ਭਰਦੀ ਹੈ ਅਤੇ ਅਗਲੇ ਘੰਟੇ 5 ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਨਾਲ ਖਾਲੀ ਹੁੰਦੀ ਹੈ। 60 ਲੀਟਰ ਟੈਂਕੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
        `ਭਰਨ ਵਾਲਾ ਨਲ ਇੱਕ ਘੰਟੇ ਵਿੱਚ 12 ਲੀਟਰ ਜੋੜਦਾ ਹੈ, ਫਿਰ ਖਾਲੀ ਕਰਨ ਵਾਲਾ ਨਲ ਅਗਲੇ ਘੰਟੇ 5 ਲੀਟਰ ਕੱਢਦਾ ਹੈ। ਟੈਂਕੀ 60 ਲੀਟਰ ਦੀ ਹੈ। ਕਦੋਂ ਭਰੇਗੀ`,
        `ਪਹਿਲੇ ਘੰਟੇ 12 ਲੀਟਰ ਪਾਣੀ ਭਰਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਘੰਟੇ 5 ਲੀਟਰ ਨਿਕਲਦਾ ਹੈ, ਅਤੇ ਇਹ ਚਲਦਾ ਰਹਿੰਦਾ ਹੈ। 60 ਲੀਟਰ ਟੈਂਕੀ ਨੂੰ ਭਰਨ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
      ]);
    }
    const firstFill = fillTimes[0] ?? 12;
    const secondFill = fillTimes[1] ?? 18;
    const firstEmpty = emptyTimes[0] ?? 36;
    if (archetype === "twoFillersLeak") {
      return stemFrom(seed, [
        `Pipe A can fill a tank in ${firstFill} hours and pipe B can fill it in ${secondFill} hours. Pipe C can empty the tank in ${firstEmpty} hours. If all three pipes are opened together, in how many hours will the tank be filled`,
        `Two pipes fill a tank in ${firstFill} and ${secondFill} hours, while a third pipe empties it in ${firstEmpty} hours. In how many hours will the tank be completely filled if all are open`,
        `Pipes A and B can fill a tank in ${firstFill} and ${secondFill} hours. Pipe C can empty it in ${firstEmpty} hours. In how many hours will the tank be completely filled when all run together`,
        `A tank has two inlet pipes of ${firstFill} hours and ${secondFill} hours and one outlet pipe of ${firstEmpty} hours. How many hours are needed when all are opened`,
        `Pipe A fills in ${firstFill} hours, pipe B fills in ${secondFill} hours and pipe C empties in ${firstEmpty} hours. In how many hours will the tank be filled with all pipes open`,
        `Two filling pipes and one emptying pipe are opened together. Their times are ${firstFill}, ${secondFill} and ${firstEmpty} hours respectively. What is the time to fill the tank`,
      ], [
        `पाइप A टंकी ${firstFill} घंटे में और पाइप B ${secondFill} घंटे में भरता है। पाइप C टंकी ${firstEmpty} घंटे में खाली करता है। तीनों साथ खुलें तो टंकी कितने घंटे में भरेगी`,
        `दो पाइप टंकी ${firstFill} और ${secondFill} घंटे में भरते हैं, जबकि तीसरा पाइप ${firstEmpty} घंटे में खाली करता है। सभी खुले हों तो कितना समय लगेगा`,
        `पाइप A और B भरने वाले पाइप हैं जो ${firstFill} और ${secondFill} घंटे लेते हैं। पाइप C ${firstEmpty} घंटे में खाली करता है। साथ चलने पर भरने का समय कितना होगा`,
        `टंकी में दो इनलेट पाइप ${firstFill} और ${secondFill} घंटे के तथा एक आउटलेट पाइप ${firstEmpty} घंटे का है। सभी खोलने पर कितने घंटे लगेंगे`,
      ], [
        `ਪਾਈਪ A ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਅਤੇ ਪਾਈਪ B ${secondFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਪਾਈਪ C ਟੈਂਕੀ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਤਿੰਨੇ ਨਾਲ ਖੁੱਲ੍ਹਣ ਤਾਂ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
        `ਦੋ ਪਾਈਪ ਟੈਂਕੀ ${firstFill} ਅਤੇ ${secondFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੇ ਹਨ, ਜਦਕਿ ਤੀਜਾ ਪਾਈਪ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਸਾਰੇ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤਾਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ`,
        `ਪਾਈਪ A ਅਤੇ B ਭਰਨ ਵਾਲੇ ਪਾਈਪ ਹਨ ਜੋ ${firstFill} ਅਤੇ ${secondFill} ਘੰਟੇ ਲੈਂਦੇ ਹਨ। ਪਾਈਪ C ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਨਾਲ ਚੱਲਣ ਤੇ ਭਰਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਟੈਂਕੀ ਵਿੱਚ ਦੋ ਇਨਲੈਟ ਪਾਈਪ ${firstFill} ਅਤੇ ${secondFill} ਘੰਟਿਆਂ ਦੇ ਅਤੇ ਇੱਕ ਆਉਟਲੈਟ ਪਾਈਪ ${firstEmpty} ਘੰਟਿਆਂ ਦਾ ਹੈ। ਸਾਰੇ ਖੋਲ੍ਹਣ ਤੇ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
      ]);
    }
    if (archetype === "delayedLeak") {
      return stemFrom(seed, [
        `A pipe can fill a tank in ${firstFill} hours. It runs alone for ${fixedTime} hours, then a leak that can empty the tank in ${firstEmpty} hours starts. In how many hours will the tank be completely filled`,
        `An inlet pipe can fill a tank in ${firstFill} hours. After it works for ${fixedTime} hours, a leak opens and can empty the tank in ${firstEmpty} hours. In how many hours will the tank be completely filled`,
        `A tank is filled by a pipe for ${fixedTime} hours before a leak starts. The pipe fills in ${firstFill} hours and the leak empties in ${firstEmpty} hours. How many hours are needed in all`,
        `Pipe A fills a tank in ${firstFill} hours. After ${fixedTime} hours, a leak begins which empties a full tank in ${firstEmpty} hours. Find the total time to fill the tank`,
        `A pipe starts filling a tank and works alone for ${fixedTime} hours. A leak that empties a full tank in ${firstEmpty} hours then starts. If the pipe alone fills in ${firstFill} hours, in how many hours will the tank be completely filled`,
        `The tank is filled for ${fixedTime} hours by a pipe taking ${firstFill} hours alone. Then a leak starts and can empty it in ${firstEmpty} hours. In how many hours will the tank be completely filled`,
      ], [
        `एक पाइप टंकी ${firstFill} घंटे में भरता है। वह ${fixedTime} घंटे अकेला चलता है, फिर ${firstEmpty} घंटे में टंकी खाली करने वाला रिसाव शुरू होता है। शुरू से टंकी कितने घंटे में भरेगी`,
        `भरने वाला पाइप टंकी के लिए ${firstFill} घंटे लेता है। ${fixedTime} घंटे बाद रिसाव खुलता है जो टंकी ${firstEmpty} घंटे में खाली कर सकता है। कुल भरने का समय कितना होगा`,
        `टंकी ${fixedTime} घंटे पाइप से भरती है, फिर रिसाव शुरू होता है। पाइप ${firstFill} घंटे में भरता है और रिसाव ${firstEmpty} घंटे में खाली करता है। कुल कितने घंटे लगेंगे`,
        `पाइप A टंकी ${firstFill} घंटे में भरता है। ${fixedTime} घंटे बाद रिसाव शुरू होता है जो भरी टंकी ${firstEmpty} घंटे में खाली करता है। टंकी भरने का कुल समय क्या होगा`,
      ], [
        `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਉਹ ${fixedTime} ਘੰਟੇ ਇਕੱਲਾ ਚੱਲਦਾ ਹੈ, ਫਿਰ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਟੈਂਕੀ ਖਾਲੀ ਕਰਨ ਵਾਲਾ ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
        `ਭਰਨ ਵਾਲਾ ਪਾਈਪ ਟੈਂਕੀ ਲਈ ${firstFill} ਘੰਟੇ ਲੈਂਦਾ ਹੈ। ${fixedTime} ਘੰਟਿਆਂ ਬਾਅਦ ਰਿਸਾਅ ਖੁੱਲ੍ਹਦਾ ਹੈ ਜੋ ਟੈਂਕੀ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰ ਸਕਦਾ ਹੈ। ਕੁੱਲ ਭਰਨ ਦਾ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
        `ਟੈਂਕੀ ${fixedTime} ਘੰਟੇ ਪਾਈਪ ਨਾਲ ਭਰਦੀ ਹੈ, ਫਿਰ ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਪਾਈਪ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ ਰਿਸਾਅ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਘੰਟੇ ਲੱਗਣਗੇ`,
        `ਪਾਈਪ A ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ${fixedTime} ਘੰਟਿਆਂ ਬਾਅਦ ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਜੋ ਭਰੀ ਟੈਂਕੀ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਟੈਂਕੀ ਭਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੀ ਹੋਵੇਗਾ`,
      ]);
    }
    return stemFrom(seed, [
      `Pipe A can fill a tank in ${firstFill} hours and pipe B can empty the same tank in ${firstEmpty} hours. If both pipes are opened together, in how many hours will the tank be filled`,
      `A filling pipe fills a tank in ${firstFill} hours and a leak empties it in ${firstEmpty} hours. In how many hours will the tank be completely filled when both work together`,
      `Pipe A fills a tank in ${firstFill} hours. A drain pipe can empty the tank in ${firstEmpty} hours. If both are open, in how many hours will the tank be completely filled`,
      `A tank is filled by a pipe taking ${firstFill} hours and emptied by another pipe taking ${firstEmpty} hours. In how many hours will the tank be filled if both are opened`,
      `One pipe fills a tank in ${firstFill} hours, while another empties it in ${firstEmpty} hours. In how many hours will the tank be completely filled with both open`,
      `Pipe A is an inlet of ${firstFill} hours and pipe B is an outlet of ${firstEmpty} hours. If both are opened together, in how many hours will the tank be completely filled`,
    ], [
      `पाइप A टंकी ${firstFill} घंटे में भरता है और पाइप B वही टंकी ${firstEmpty} घंटे में खाली करता है। दोनों साथ खोलें तो टंकी कितने घंटे में भरेगी`,
      `भरने वाला पाइप टंकी ${firstFill} घंटे में भरता है और रिसाव ${firstEmpty} घंटे में खाली करता है। दोनों साथ हों तो भरने में कितना समय लगेगा`,
      `पाइप A टंकी ${firstFill} घंटे में भरता है। निकासी पाइप टंकी ${firstEmpty} घंटे में खाली कर सकता है। दोनों खुले हों तो भरने का समय क्या होगा`,
      `एक टंकी ${firstFill} घंटे वाले पाइप से भरती है और ${firstEmpty} घंटे वाले पाइप से खाली होती है। दोनों खोलने पर टंकी कितने घंटे में भरेगी`,
    ], [
      `ਪਾਈਪ A ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ ਪਾਈਪ B ਉਹੀ ਟੈਂਕੀ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਖੋਲ੍ਹਣ ਤਾਂ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
      `ਭਰਨ ਵਾਲਾ ਪਾਈਪ ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ ਰਿਸਾਅ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਹੋਣ ਤਾਂ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ`,
      `ਪਾਈਪ A ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਨਿਕਾਸੀ ਪਾਈਪ ਟੈਂਕੀ ${firstEmpty} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰ ਸਕਦਾ ਹੈ। ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤਾਂ ਭਰਨ ਦਾ ਸਮਾਂ ਕੀ ਹੋਵੇਗਾ`,
      `ਇੱਕ ਟੈਂਕੀ ${firstFill} ਘੰਟਿਆਂ ਵਾਲੇ ਪਾਈਪ ਨਾਲ ਭਰਦੀ ਹੈ ਅਤੇ ${firstEmpty} ਘੰਟਿਆਂ ਵਾਲੇ ਪਾਈਪ ਨਾਲ ਖਾਲੀ ਹੁੰਦੀ ਹੈ। ਦੋਵੇਂ ਖੋਲ੍ਹਣ ਤੇ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਭਰੇਗੀ`,
    ]);
  }

  if (["capacityLeak", "tankCapacity", "twoTankTransfer", "overflow"].includes(archetype)) {
    const rate = asNumber(variables.rate, 15);
    const time = asNumber(variables.time, asNumber(variables.extraTime, 20));
    return stemFrom(seed, [
      `A filling pipe delivers ${rate} litres of water per minute for ${time} minutes. How many litres of water are delivered`,
      `Water flows into a tank at ${rate} litres per minute. In ${time} minutes, how many litres will enter the tank`,
      `A pump sends ${rate} litres of water per minute into a tank. How many litres will it send in ${time} minutes`,
      `A pipe transfers ${rate} litres of water every minute. How many litres are transferred in ${time} minutes`,
      `After a tank is full, water continues to flow at ${rate} litres per minute for ${time} minutes. How many litres overflow`,
      `A tank receives water for ${time} minutes at ${rate} litres per minute. What is the quantity of water received`,
    ], [
      `एक पाइप ${time} मिनट तक प्रति मिनट ${rate} लीटर पानी देता है। कुल कितने लीटर पानी मिलेगा`,
      `पानी टंकी में प्रति मिनट ${rate} लीटर की मात्रा से जाता है। ${time} मिनट में कितने लीटर पानी जाएगा`,
      `एक नल प्रति मिनट ${rate} लीटर पानी देता है। ${time} मिनट में कितना पानी देगा`,
      `एक पाइप हर मिनट ${rate} लीटर पानी स्थानांतरित करता है। ${time} मिनट में कितने लीटर पानी जाएगा`,
    ], [
      `ਇੱਕ ਪਾਈਪ ${time} ਮਿੰਟ ਤੱਕ ਪ੍ਰਤੀ ਮਿੰਟ ${rate} ਲੀਟਰ ਪਾਣੀ ਦਿੰਦਾ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਲੀਟਰ ਪਾਣੀ ਮਿਲੇਗਾ`,
      `ਪਾਣੀ ਟੈਂਕੀ ਵਿੱਚ ਪ੍ਰਤੀ ਮਿੰਟ ${rate} ਲੀਟਰ ਦੀ ਮਾਤਰਾ ਨਾਲ ਜਾਂਦਾ ਹੈ। ${time} ਮਿੰਟ ਵਿੱਚ ਕਿੰਨੇ ਲੀਟਰ ਪਾਣੀ ਜਾਵੇਗਾ`,
      `ਇੱਕ ਨਲ ਪ੍ਰਤੀ ਮਿੰਟ ${rate} ਲੀਟਰ ਪਾਣੀ ਦਿੰਦਾ ਹੈ। ${time} ਮਿੰਟ ਵਿੱਚ ਕਿੰਨਾ ਪਾਣੀ ਦੇਵੇਗਾ`,
      `ਇੱਕ ਪਾਈਪ ਹਰ ਮਿੰਟ ${rate} ਲੀਟਰ ਪਾਣੀ ਤਬਦੀਲ ਕਰਦਾ ਹੈ। ${time} ਮਿੰਟ ਵਿੱਚ ਕਿੰਨੇ ਲੀਟਰ ਪਾਣੀ ਜਾਵੇਗਾ`,
    ]);
  }

  if (["foodBasic", "foodPopulationChange", "foodRemaining", "resourceEquivalence"].includes(archetype)) {
    if (archetype === "foodBasic") {
      const people1 = asNumber(variables.people1, 20);
      const days1 = asNumber(variables.days1, 30);
      const people2 = asNumber(variables.people2, 25);
      return stemFrom(seed, [
        `Food is sufficient for ${people1} people for ${days1} days. For how many days will the same food last for ${people2} people`,
        `A food stock lasts ${days1} days for ${people1} people. How many days will it last for ${people2} people`,
        `If ${people1} people can use a food stock for ${days1} days, for how many days will the stock last for ${people2} people`,
        `There is enough food for ${people1} people for ${days1} days. What is its duration for ${people2} people`,
        `${people1} people have food for ${days1} days. If the number of people becomes ${people2}, for how many days will the food last`,
        `A ration stock is enough for ${people1} people for ${days1} days. Find the number of days for ${people2} people`,
      ], [
        `${people1} लोगों के लिए भोजन ${days1} दिन पर्याप्त है। वही भोजन ${people2} लोगों के लिए कितने दिन चलेगा`,
        `भोजन का भंडार ${people1} लोगों के लिए ${days1} दिन चलता है। ${people2} लोगों के लिए कितने दिन चलेगा`,
        `यदि ${people1} लोग भोजन ${days1} दिन तक उपयोग कर सकते हैं, तो ${people2} लोगों के लिए कितने दिन चलेगा`,
        `${people1} लोगों के लिए ${days1} दिन का भोजन है। लोगों की संख्या ${people2} हो जाए तो भोजन कितने दिन चलेगा`,
      ], [
        `${people1} ਲੋਕਾਂ ਲਈ ਭੋਜਨ ${days1} ਦਿਨ ਕਾਫ਼ੀ ਹੈ। ਉਹੀ ਭੋਜਨ ${people2} ਲੋਕਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
        `ਭੋਜਨ ਦਾ ਭੰਡਾਰ ${people1} ਲੋਕਾਂ ਲਈ ${days1} ਦਿਨ ਚੱਲਦਾ ਹੈ। ${people2} ਲੋਕਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
        `ਜੇ ${people1} ਲੋਕ ਭੋਜਨ ${days1} ਦਿਨ ਤੱਕ ਵਰਤ ਸਕਦੇ ਹਨ, ਤਾਂ ${people2} ਲੋਕਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
        `${people1} ਲੋਕਾਂ ਲਈ ${days1} ਦਿਨ ਦਾ ਭੋਜਨ ਹੈ। ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ${people2} ਹੋ ਜਾਵੇ ਤਾਂ ਭੋਜਨ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
      ]);
    }
    if (archetype === "resourceEquivalence") {
      const stock = asNumber(variables.stock, 720);
      const weightedRate = asNumber(variables.weightedRate, 30);
      return stemFrom(seed, [
        `A hostel has ${stock} meal packets. The residents consume ${weightedRate} packets per day. For how many days will the stock last`,
        `There are ${stock} ration packets in a camp. If ${weightedRate} packets are used each day, how many days will they last`,
        `A relief camp has ${stock} food packets and uses ${weightedRate} packets daily. What is the number of days the food will last`,
        `A stock of ${stock} packets is consumed at ${weightedRate} packets per day. For how many days is the stock sufficient`,
        `${stock} ration packets are available. Daily consumption is ${weightedRate} packets. For how many days will the ration last`,
        `A group uses ${weightedRate} meal packets each day from a stock of ${stock}. How many days will the stock last`,
      ], [
        `एक छात्रावास में ${stock} भोजन पैकेट हैं। निवासी रोज ${weightedRate} पैकेट उपयोग करते हैं। भंडार कितने दिन चलेगा`,
        `एक शिविर में ${stock} राशन पैकेट हैं। यदि रोज ${weightedRate} पैकेट लगते हैं, तो वे कितने दिन चलेंगे`,
        `राहत शिविर में ${stock} भोजन पैकेट हैं और रोज ${weightedRate} पैकेट उपयोग होते हैं। भोजन कितने दिन चलेगा`,
        `${stock} पैकेट का भंडार रोज ${weightedRate} पैकेट की खपत से चलता है। भंडार कितने दिन के लिए पर्याप्त है`,
      ], [
        `ਇੱਕ ਹੋਸਟਲ ਵਿੱਚ ${stock} ਭੋਜਨ ਪੈਕਟ ਹਨ। ਰਹਿਣ ਵਾਲੇ ਰੋਜ਼ ${weightedRate} ਪੈਕਟ ਵਰਤਦੇ ਹਨ। ਭੰਡਾਰ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
        `ਇੱਕ ਕੈਂਪ ਵਿੱਚ ${stock} ਰਾਸ਼ਨ ਪੈਕਟ ਹਨ। ਜੇ ਰੋਜ਼ ${weightedRate} ਪੈਕਟ ਲੱਗਦੇ ਹਨ, ਤਾਂ ਉਹ ਕਿੰਨੇ ਦਿਨ ਚੱਲਣਗੇ`,
        `ਰਾਹਤ ਕੈਂਪ ਵਿੱਚ ${stock} ਭੋਜਨ ਪੈਕਟ ਹਨ ਅਤੇ ਰੋਜ਼ ${weightedRate} ਪੈਕਟ ਵਰਤੇ ਜਾਂਦੇ ਹਨ। ਭੋਜਨ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
        `${stock} ਪੈਕਟ ਦਾ ਭੰਡਾਰ ਰੋਜ਼ ${weightedRate} ਪੈਕਟ ਦੀ ਖਪਤ ਨਾਲ ਚੱਲਦਾ ਹੈ। ਭੰਡਾਰ ਕਿੰਨੇ ਦਿਨ ਲਈ ਕਾਫ਼ੀ ਹੈ`,
      ]);
    }
    const stock = asNumber(variables.stock, 600);
    const peopleFirst = asNumber(variables.peopleFirst, 20);
    const firstDays = asNumber(variables.firstDays, 5);
    const peopleSecond = asNumber(variables.peopleSecond, 25);
    const originalDays = dayValue(stock / peopleFirst);
    return stemFrom(seed, [
      `Food is sufficient for ${peopleFirst} people for ${originalDays} days. After ${firstDays} days, the number of people becomes ${peopleSecond}. For how many more days will the food last`,
      `A group of ${peopleFirst} people has food for ${originalDays} days. They consume it for ${firstDays} days, and then the group becomes ${peopleSecond}. How many days will the remaining food last`,
      `A food stock would last ${peopleFirst} people for ${originalDays} days. After ${firstDays} days, more people join and the total becomes ${peopleSecond}. Find the further duration in days`,
      `${peopleFirst} people have food for ${originalDays} days. After ${firstDays} days, there are ${peopleSecond} people. For how many additional days will the food be sufficient`,
      `A camp has food for ${peopleFirst} people for ${originalDays} days. After ${firstDays} days, the camp has ${peopleSecond} people. For how many more days will the remaining food last`,
      `Food for ${peopleFirst} people lasts ${originalDays} days. If after ${firstDays} days the number of people changes to ${peopleSecond}, how many more days will it last`,
    ], [
      `${peopleFirst} लोगों के लिए भोजन ${originalDays} दिन पर्याप्त है। ${firstDays} दिन बाद लोगों की संख्या ${peopleSecond} हो जाती है। भोजन और कितने दिन चलेगा`,
      `${peopleFirst} लोगों के समूह के पास ${originalDays} दिन का भोजन है। वे ${firstDays} दिन भोजन लेते हैं, फिर संख्या ${peopleSecond} हो जाती है। बचा भोजन कितने दिन चलेगा`,
      `भोजन ${peopleFirst} लोगों के लिए ${originalDays} दिन चलता। ${firstDays} दिन बाद लोग बढ़कर ${peopleSecond} हो जाते हैं। आगे कितने दिन चलेगा`,
      `${peopleFirst} लोगों के पास ${originalDays} दिन का भोजन है। ${firstDays} दिन बाद ${peopleSecond} लोग हो जाते हैं। भोजन कितने और दिन पर्याप्त होगा`,
    ], [
      `${peopleFirst} ਲੋਕਾਂ ਲਈ ਭੋਜਨ ${originalDays} ਦਿਨ ਕਾਫ਼ੀ ਹੈ। ${firstDays} ਦਿਨਾਂ ਬਾਅਦ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ${peopleSecond} ਹੋ ਜਾਂਦੀ ਹੈ। ਭੋਜਨ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
      `${peopleFirst} ਲੋਕਾਂ ਦੇ ਸਮੂਹ ਕੋਲ ${originalDays} ਦਿਨ ਦਾ ਭੋਜਨ ਹੈ। ਉਹ ${firstDays} ਦਿਨ ਭੋਜਨ ਲੈਂਦੇ ਹਨ, ਫਿਰ ਗਿਣਤੀ ${peopleSecond} ਹੋ ਜਾਂਦੀ ਹੈ। ਬਚਿਆ ਭੋਜਨ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
      `ਭੋਜਨ ${peopleFirst} ਲੋਕਾਂ ਲਈ ${originalDays} ਦਿਨ ਚੱਲਦਾ। ${firstDays} ਦਿਨਾਂ ਬਾਅਦ ਲੋਕ ਵਧ ਕੇ ${peopleSecond} ਹੋ ਜਾਂਦੇ ਹਨ। ਅੱਗੇ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ`,
      `${peopleFirst} ਲੋਕਾਂ ਕੋਲ ${originalDays} ਦਿਨ ਦਾ ਭੋਜਨ ਹੈ। ${firstDays} ਦਿਨਾਂ ਬਾਅਦ ${peopleSecond} ਲੋਕ ਹੋ ਜਾਂਦੇ ਹਨ। ਭੋਜਨ ਕਿੰਨੇ ਹੋਰ ਦਿਨ ਕਾਫ਼ੀ ਹੋਵੇਗਾ`,
    ]);
  }

  if (["typingOutput", "printerQueue", "machineBreakdown", "parallelMachines", "machineSchedule", "digFill", "positiveNegative", "productivityDecay"].includes(archetype)) {
    if (archetype === "digFill" || archetype === "positiveNegative") {
      const totalWork = asNumber(variables.totalWork, 150);
      const positiveRate = asNumber(variables.positiveRate, 15);
      const negativeRate = asNumber(variables.negativeRate, 4);
      return stemFrom(seed, [
        `A road crew lays ${positiveRate} metres of road per day, while rain damages ${negativeRate} metres per day. If ${totalWork} metres must be completed, in how many days will the road be finished`,
        `A team repairs ${positiveRate} metres daily, but another effect damages ${negativeRate} metres daily. How many days are needed to complete ${totalWork} metres`,
        `Workers build ${positiveRate} metres of boundary each day, while ${negativeRate} metres are spoiled daily. In how many days will ${totalWork} metres be completed`,
        `A repair team completes ${positiveRate} metres per day and daily damage removes ${negativeRate} metres. In how many days will ${totalWork} metres be completed`,
        `A team adds ${positiveRate} metres to a project each day, but ${negativeRate} metres are lost each day. What is the time for ${totalWork} metres`,
        `Construction progresses by ${positiveRate} metres daily and damage reduces it by ${negativeRate} metres daily. How many days are required for ${totalWork} metres`,
      ], [
        `एक सड़क दल रोज ${positiveRate} मीटर सड़क बनाता है, जबकि बारिश रोज ${negativeRate} मीटर खराब करती है। ${totalWork} मीटर पूरा करने में कितने दिन लगेंगे`,
        `एक टीम रोज ${positiveRate} मीटर मरम्मत करती है, लेकिन रोज ${negativeRate} मीटर नुकसान होता है। ${totalWork} मीटर पूरा करने के लिए कितने दिन चाहिए`,
        `मजदूर रोज ${positiveRate} मीटर सीमा बनाते हैं, जबकि रोज ${negativeRate} मीटर खराब हो जाता है। ${totalWork} मीटर कितने दिन में पूरा होगा`,
        `एक मरम्मत टीम रोज ${positiveRate} मीटर पूरा करती है और रोज ${negativeRate} मीटर नुकसान होता है। ${totalWork} मीटर में कितना समय लगेगा`,
      ], [
        `ਇੱਕ ਸੜਕ ਟੀਮ ਰੋਜ਼ ${positiveRate} ਮੀਟਰ ਸੜਕ ਬਣਾਉਂਦੀ ਹੈ, ਜਦਕਿ ਮੀਂਹ ਰੋਜ਼ ${negativeRate} ਮੀਟਰ ਖਰਾਬ ਕਰਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ`,
        `ਇੱਕ ਟੀਮ ਰੋਜ਼ ${positiveRate} ਮੀਟਰ ਮੁਰੰਮਤ ਕਰਦੀ ਹੈ, ਪਰ ਰੋਜ਼ ${negativeRate} ਮੀਟਰ ਨੁਕਸਾਨ ਹੁੰਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
        `ਮਜ਼ਦੂਰ ਰੋਜ਼ ${positiveRate} ਮੀਟਰ ਹੱਦ ਬਣਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਰੋਜ਼ ${negativeRate} ਮੀਟਰ ਖਰਾਬ ਹੋ ਜਾਂਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ`,
        `ਇੱਕ ਮੁਰੰਮਤ ਟੀਮ ਰੋਜ਼ ${positiveRate} ਮੀਟਰ ਪੂਰਾ ਕਰਦੀ ਹੈ ਅਤੇ ਰੋਜ਼ ${negativeRate} ਮੀਟਰ ਨੁਕਸਾਨ ਹੁੰਦਾ ਹੈ। ${totalWork} ਮੀਟਰ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ`,
      ]);
    }
    if (archetype === "productivityDecay") {
      const totalWork = asNumber(variables.totalWork, 180);
      const firstRate = asNumber(variables.firstRate, 15);
      const firstTime = asNumber(variables.firstTime, 5);
      const secondRate = asNumber(variables.secondRate, 12);
      return stemFrom(seed, [
        `A worker makes ${firstRate} toys per day for the first ${firstTime} days. After that, the worker makes ${secondRate} toys per day. How many days are needed to make ${totalWork} toys`,
        `A machine packs ${firstRate} boxes per day for ${firstTime} days and then packs ${secondRate} boxes per day. In how many days will ${totalWork} boxes be packed`,
        `For ${firstTime} days, a worker finishes ${firstRate} items daily. Later the worker finishes ${secondRate} items daily. In how many days will ${totalWork} items be completed`,
        `A production job has ${totalWork} items. The first ${firstTime} days produce ${firstRate} items per day, and after that ${secondRate} items per day. What is the total time`,
        `A worker completes ${firstRate} forms daily for ${firstTime} days and then ${secondRate} forms daily. How many days are needed for ${totalWork} forms`,
        `A machine makes ${firstRate} parts per day initially for ${firstTime} days, then ${secondRate} parts per day. How many days are required for ${totalWork} parts`,
      ], [
        `एक मजदूर पहले ${firstTime} दिन रोज ${firstRate} खिलौने बनाता है। उसके बाद रोज ${secondRate} खिलौने बनाता है। ${totalWork} खिलौनों के लिए कितने दिन चाहिए`,
        `एक मशीन ${firstTime} दिन तक रोज ${firstRate} डिब्बे पैक करती है और फिर रोज ${secondRate} डिब्बे पैक करती है। ${totalWork} डिब्बे कितने दिन में पैक होंगे`,
        `${firstTime} दिन तक मजदूर रोज ${firstRate} वस्तुएँ पूरी करता है। बाद में रोज ${secondRate} वस्तुएँ पूरी करता है। ${totalWork} वस्तुएँ कितने दिन लेंगी`,
        `${totalWork} वस्तुओं का उत्पादन कार्य है। पहले ${firstTime} दिन रोज ${firstRate} वस्तुएँ और बाद में रोज ${secondRate} वस्तुएँ बनती हैं। कुल समय कितना होगा`,
      ], [
        `ਇੱਕ ਮਜ਼ਦੂਰ ਪਹਿਲਾਂ ${firstTime} ਦਿਨ ਰੋਜ਼ ${firstRate} ਖਿਡੌਣੇ ਬਣਾਉਂਦਾ ਹੈ। ਉਸ ਤੋਂ ਬਾਅਦ ਰੋਜ਼ ${secondRate} ਖਿਡੌਣੇ ਬਣਾਉਂਦਾ ਹੈ। ${totalWork} ਖਿਡੌਣਿਆਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚਾਹੀਦੇ ਹਨ`,
        `ਇੱਕ ਮਸ਼ੀਨ ${firstTime} ਦਿਨ ਤੱਕ ਰੋਜ਼ ${firstRate} ਡੱਬੇ ਪੈਕ ਕਰਦੀ ਹੈ ਅਤੇ ਫਿਰ ਰੋਜ਼ ${secondRate} ਡੱਬੇ ਪੈਕ ਕਰਦੀ ਹੈ। ${totalWork} ਡੱਬੇ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੈਕ ਹੋਣਗੇ`,
        `${firstTime} ਦਿਨ ਤੱਕ ਮਜ਼ਦੂਰ ਰੋਜ਼ ${firstRate} ਵਸਤੂਆਂ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਬਾਅਦ ਵਿੱਚ ਰੋਜ਼ ${secondRate} ਵਸਤੂਆਂ ਪੂਰੀ ਕਰਦਾ ਹੈ। ${totalWork} ਵਸਤੂਆਂ ਕਿੰਨੇ ਦਿਨ ਲੈਣਗੀਆਂ`,
        `${totalWork} ਵਸਤੂਆਂ ਦਾ ਉਤਪਾਦਨ ਕੰਮ ਹੈ। ਪਹਿਲਾਂ ${firstTime} ਦਿਨ ਰੋਜ਼ ${firstRate} ਵਸਤੂਆਂ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਰੋਜ਼ ${secondRate} ਵਸਤੂਆਂ ਬਣਦੀਆਂ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      ]);
    }
    const rates = asNumberList(variables.rates);
    const times = asNumberList(variables.times);
    const time = times[0] ?? 5;
    const machineTimeText = times.length > 1 ? `${times.join(", ")} hours respectively` : `${time} hours`;
    if (archetype === "typingOutput" || archetype === "printerQueue") {
      const noun = archetype === "typingOutput" ? "typists" : "printers";
      return stemFrom(seed, [
        `Three ${noun} can complete ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18} pages per hour respectively. If they work together for ${time} hours, how many pages will they complete`,
        `${noun[0]!.toUpperCase()}${noun.slice(1)} A, B and C complete ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18} pages in one hour. How many pages will be completed in ${time} hours`,
        `A page job is shared by three ${noun}. Their hourly page counts are ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18}. What is the total number of pages in ${time} hours`,
        `Three ${noun} work together for ${time} hours. They complete ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18} pages per hour. How many pages are completed`,
        `A, B and C are ${noun} with hourly page counts ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18}. If all work for ${time} hours, what is the output in pages`,
        `In a printing job, three workers complete ${rates[0] ?? 12}, ${rates[1] ?? 15} and ${rates[2] ?? 18} pages per hour. How many pages are completed in ${time} hours`,
      ], [
        `तीन कर्मचारी प्रति घंटे क्रमशः ${rates[0] ?? 12}, ${rates[1] ?? 15} और ${rates[2] ?? 18} पृष्ठ पूरे करते हैं। वे ${time} घंटे साथ काम करें तो कितने पृष्ठ पूरे होंगे`,
        `A, B और C एक घंटे में ${rates[0] ?? 12}, ${rates[1] ?? 15} और ${rates[2] ?? 18} पृष्ठ करते हैं। ${time} घंटे में कुल कितने पृष्ठ होंगे`,
        `पृष्ठों का काम तीन कर्मचारियों में बांटा गया है। उनकी प्रति घंटे संख्या ${rates[0] ?? 12}, ${rates[1] ?? 15} और ${rates[2] ?? 18} है। ${time} घंटे में कुल पृष्ठ कितने होंगे`,
        `तीन कर्मचारी ${time} घंटे साथ काम करते हैं। वे प्रति घंटे ${rates[0] ?? 12}, ${rates[1] ?? 15} और ${rates[2] ?? 18} पृष्ठ करते हैं। कितने पृष्ठ पूरे होंगे`,
      ], [
        `ਤਿੰਨ ਕਰਮਚਾਰੀ ਪ੍ਰਤੀ ਘੰਟਾ ਕ੍ਰਮਵਾਰ ${rates[0] ?? 12}, ${rates[1] ?? 15} ਅਤੇ ${rates[2] ?? 18} ਸਫ਼ੇ ਪੂਰੇ ਕਰਦੇ ਹਨ। ਉਹ ${time} ਘੰਟੇ ਨਾਲ ਕੰਮ ਕਰਨ ਤਾਂ ਕਿੰਨੇ ਸਫ਼ੇ ਪੂਰੇ ਹੋਣਗੇ`,
        `A, B ਅਤੇ C ਇੱਕ ਘੰਟੇ ਵਿੱਚ ${rates[0] ?? 12}, ${rates[1] ?? 15} ਅਤੇ ${rates[2] ?? 18} ਸਫ਼ੇ ਕਰਦੇ ਹਨ। ${time} ਘੰਟਿਆਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਸਫ਼ੇ ਹੋਣਗੇ`,
        `ਸਫ਼ਿਆਂ ਦਾ ਕੰਮ ਤਿੰਨ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ। ਉਹਨਾਂ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਗਿਣਤੀ ${rates[0] ?? 12}, ${rates[1] ?? 15} ਅਤੇ ${rates[2] ?? 18} ਹੈ। ${time} ਘੰਟਿਆਂ ਵਿੱਚ ਕੁੱਲ ਸਫ਼ੇ ਕਿੰਨੇ ਹੋਣਗੇ`,
        `ਤਿੰਨ ਕਰਮਚਾਰੀ ${time} ਘੰਟੇ ਨਾਲ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਹ ਪ੍ਰਤੀ ਘੰਟਾ ${rates[0] ?? 12}, ${rates[1] ?? 15} ਅਤੇ ${rates[2] ?? 18} ਸਫ਼ੇ ਕਰਦੇ ਹਨ। ਕਿੰਨੇ ਸਫ਼ੇ ਪੂਰੇ ਹੋਣਗੇ`,
      ]);
    }
    return stemFrom(seed, [
      `Machines A, B and C make ${rates[0] ?? 20}, ${rates[1] ?? 25} and ${rates[2] ?? 30} parts per hour. If they run for ${machineTimeText}, how many parts are made`,
      `A factory uses three machines. Machine A makes ${rates[0] ?? 20} parts per hour, B makes ${rates[1] ?? 25}, and C makes ${rates[2] ?? 30}. How many parts are produced in ${machineTimeText}`,
      `Three machines produce ${rates[0] ?? 20}, ${rates[1] ?? 25} and ${rates[2] ?? 30} parts per hour respectively. If they run for ${machineTimeText}, what is the total number of parts`,
      `Machines A, B and C operate for ${machineTimeText} and make ${rates[0] ?? 20}, ${rates[1] ?? 25} and ${rates[2] ?? 30} parts per hour. How many parts are produced`,
      `A production batch uses three machines making ${rates[0] ?? 20}, ${rates[1] ?? 25} and ${rates[2] ?? 30} parts per hour. What is the number of parts made in ${machineTimeText}`,
      `Machines A, B and C produce ${rates[0] ?? 20}, ${rates[1] ?? 25} and ${rates[2] ?? 30} parts per hour respectively. If they work for ${machineTimeText}, how many parts will be produced in total`,
    ], [
      `मशीन A, B और C प्रति घंटे ${rates[0] ?? 20}, ${rates[1] ?? 25} और ${rates[2] ?? 30} वस्तुएँ बनाती हैं। वे क्रमशः ${times.join(", ") || time} घंटे चलें तो कुल कितनी वस्तुएँ बनेंगी`,
      `एक कारखाने में तीन मशीनें हैं। उनकी प्रति घंटे संख्या ${rates[0] ?? 20}, ${rates[1] ?? 25} और ${rates[2] ?? 30} है। दिए गए ${times.join(", ") || time} घंटों में कितनी वस्तुएँ बनेंगी`,
      `तीन मशीनें साथ काम करती हैं और प्रति घंटे ${rates[0] ?? 20}, ${rates[1] ?? 25} और ${rates[2] ?? 30} वस्तुएँ बनाती हैं। ${times.join(", ") || time} घंटों के लिए कुल उत्पादन कितना होगा`,
      `मशीन A, B और C ${times.join(", ") || time} घंटे चलती हैं और प्रति घंटे ${rates[0] ?? 20}, ${rates[1] ?? 25} और ${rates[2] ?? 30} वस्तुएँ बनाती हैं। कुल कितनी वस्तुएँ बनेंगी`,
    ], [
      `ਮਸ਼ੀਨ A, B ਅਤੇ C ਪ੍ਰਤੀ ਘੰਟਾ ${rates[0] ?? 20}, ${rates[1] ?? 25} ਅਤੇ ${rates[2] ?? 30} ਵਸਤੂਆਂ ਬਣਾਉਂਦੀਆਂ ਹਨ। ਉਹ ਕ੍ਰਮਵਾਰ ${times.join(", ") || time} ਘੰਟੇ ਚੱਲਣ ਤਾਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਵਸਤੂਆਂ ਬਣਣਗੀਆਂ`,
      `ਇੱਕ ਕਾਰਖਾਨੇ ਵਿੱਚ ਤਿੰਨ ਮਸ਼ੀਨਾਂ ਹਨ। ਉਹਨਾਂ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਗਿਣਤੀ ${rates[0] ?? 20}, ${rates[1] ?? 25} ਅਤੇ ${rates[2] ?? 30} ਹੈ। ਦਿੱਤੇ ${times.join(", ") || time} ਘੰਟਿਆਂ ਵਿੱਚ ਕਿੰਨੀਆਂ ਵਸਤੂਆਂ ਬਣਣਗੀਆਂ`,
      `ਤਿੰਨ ਮਸ਼ੀਨਾਂ ਨਾਲ ਕੰਮ ਕਰਦੀਆਂ ਹਨ ਅਤੇ ਪ੍ਰਤੀ ਘੰਟਾ ${rates[0] ?? 20}, ${rates[1] ?? 25} ਅਤੇ ${rates[2] ?? 30} ਵਸਤੂਆਂ ਬਣਾਉਂਦੀਆਂ ਹਨ। ${times.join(", ") || time} ਘੰਟਿਆਂ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ`,
      `ਮਸ਼ੀਨ A, B ਅਤੇ C ${times.join(", ") || time} ਘੰਟੇ ਚੱਲਦੀਆਂ ਹਨ ਅਤੇ ਪ੍ਰਤੀ ਘੰਟਾ ${rates[0] ?? 20}, ${rates[1] ?? 25} ਅਤੇ ${rates[2] ?? 30} ਵਸਤੂਆਂ ਬਣਾਉਂਦੀਆਂ ਹਨ। ਕੁੱਲ ਕਿੰਨੀਆਂ ਵਸਤੂਆਂ ਬਣਣਗੀਆਂ`,
    ]);
  }

  return {
    en: question(fallback.en),
    hi: question(fallback.hi),
    pa: question(fallback.pa),
  };
}

function fractionText(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function ratioText(parts: readonly number[]) {
  return simplify(parts).join(":");
}

function numbers(input: unknown) {
  return Array.isArray(input) ? input.map(Number) : [];
}

function numberInput(model: TimeWorkSolverModel, key: string) {
  return Number(model.inputs[key]);
}

export function evaluateTimeWorkSolverModel(model: TimeWorkSolverModel): number | string {
  switch (model.kind) {
    case "combined_time": {
      const times = numbers(model.inputs.times);
      const work = lcmMany(times);
      return work / times.reduce((sum, time) => sum + work / time, 0);
    }
    case "remaining_fraction": {
      const total = numberInput(model, "totalTime");
      const elapsed = numberInput(model, "elapsed");
      return fractionText(total - elapsed, total);
    }
    case "efficiency_alone_time": {
      const parts = numbers(model.inputs.efficiencyParts);
      const together = numberInput(model, "togetherTime");
      const index = numberInput(model, "index");
      return (parts.reduce((sum, part) => sum + part, 0) * together) / parts[index]!;
    }
    case "unknown_time_from_combined": {
      const combined = numberInput(model, "combinedTime");
      const knownTimes = numbers(model.inputs.knownTimes);
      const rate = 1 / combined - knownTimes.reduce((sum, time) => sum + 1 / time, 0);
      return 1 / rate;
    }
    case "full_time_from_fraction":
      return numberInput(model, "days") * numberInput(model, "denominator") / numberInput(model, "numerator");
    case "man_days_hours":
      return numberInput(model, "m1") * numberInput(model, "d1") * numberInput(model, "h1") * numberInput(model, "w2") /
        (numberInput(model, "w1") * numberInput(model, "d2") * numberInput(model, "h2"));
    case "inverse_ratio_from_times": {
      const times = numbers(model.inputs.times);
      return ratioText([times[1]!, times[0]!]);
    }
    case "time_ratio_from_efficiency": {
      const parts = numbers(model.inputs.efficiencyParts);
      return ratioText([...parts].reverse());
    }
    case "ratio_from_values":
      return ratioText(numbers(model.inputs.values));
    case "one_day_fraction":
      return fractionText(1, numberInput(model, "time"));
    case "linear_remaining_time": {
      const total = numberInput(model, "totalWork");
      const done = numberInput(model, "doneRate") * numberInput(model, "doneTime") + numberInput(model, "fixedDone");
      return (total - done) / numberInput(model, "remainingRate") + numberInput(model, "calendarOffset");
    }
    case "linear_total_time": {
      const total = numberInput(model, "totalWork");
      const done = numberInput(model, "doneRate") * numberInput(model, "doneTime") + numberInput(model, "fixedDone");
      return numberInput(model, "doneTime") + (total - done) / numberInput(model, "remainingRate") + numberInput(model, "calendarOffset");
    }
    case "backward_leave_time": {
      const total = numberInput(model, "totalWork");
      const rates = numbers(model.inputs.rates);
      const leaves = numbers(model.inputs.leaveBefore);
      return (total + rates.reduce((sum, rate, index) => sum + rate * (leaves[index] ?? 0), 0)) /
        rates.reduce((sum, rate) => sum + rate, 0);
    }
    case "required_workers": {
      const remaining = numberInput(model, "totalWork") - numberInput(model, "completedWork");
      const requiredTotal = Math.ceil(remaining / (numberInput(model, "unitRate") * numberInput(model, "timeLeft")));
      return Math.max(0, requiredTotal - numberInput(model, "currentWorkers"));
    }
    case "delay_from_removed_workers": {
      const remaining = numberInput(model, "remainingWork");
      const unitRate = numberInput(model, "unitRate");
      const planned = numberInput(model, "plannedTime");
      const actual = remaining / (unitRate * (numberInput(model, "originalWorkers") - numberInput(model, "removedWorkers")));
      return actual - planned;
    }
    case "cycle_time": {
      const total = numberInput(model, "totalWork");
      const rates = numbers(model.inputs.rates);
      const durations = numbers(model.inputs.durations);
      const cycleWork = rates.reduce((sum, rate, index) => sum + rate * (durations[index] ?? 1), 0);
      const cycleTime = durations.reduce((sum, duration) => sum + duration, 0);
      const fullCycles = Math.floor(total / cycleWork);
      let done = fullCycles * cycleWork;
      let time = fullCycles * cycleTime;
      if (done === total) return time;
      for (let index = 0; index < rates.length; index += 1) {
        const rate = rates[index]!;
        const duration = durations[index] ?? 1;
        const possible = rate * duration;
        if (done + possible >= total) {
          return time + (total - done) / rate;
        }
        done += possible;
        time += duration;
      }
      return time;
    }
    case "equivalent_team_time":
    case "team_compare_time": {
      const counts = numbers(model.inputs.counts);
      const unitRates = numbers(model.inputs.unitRates);
      const rate = counts.reduce((sum, count, index) => sum + count * (unitRates[index] ?? 0), 0);
      return numberInput(model, "totalWork") / rate;
    }
    case "pairwise_worker_time": {
      const ab = numberInput(model, "ab");
      const bc = numberInput(model, "bc");
      const ac = numberInput(model, "ac");
      const work = lcmMany([ab, bc, ac]);
      const rateAb = work / ab;
      const rateBc = work / bc;
      const rateAc = work / ac;
      const rates = [(rateAb + rateAc - rateBc) / 2, (rateAb + rateBc - rateAc) / 2, (rateBc + rateAc - rateAb) / 2];
      return work / rates[numberInput(model, "index")]!;
    }
    case "team_minus_known_time": {
      const teamRate = 1 / numberInput(model, "teamTime");
      const knownRate = numbers(model.inputs.knownTimes).reduce((sum, time) => sum + 1 / time, 0);
      return 1 / (teamRate - knownRate);
    }
    case "contribution_rate":
      return numberInput(model, "contribution") / numberInput(model, "time");
    case "unknown_phase_duration":
      return (numberInput(model, "totalWork") - numberInput(model, "fixedWork")) / numberInput(model, "unknownRate");
    case "wage_share": {
      const contributions = numbers(model.inputs.contributions);
      const index = numberInput(model, "index");
      return numberInput(model, "totalWage") * contributions[index]! / contributions.reduce((sum, value) => sum + value, 0);
    }
    case "contract_earning": {
      const delta = numberInput(model, "deltaDays");
      return numberInput(model, "base") + (numberInput(model, "early") ? delta * numberInput(model, "bonusPerDay") : -delta * numberInput(model, "penaltyPerDay"));
    }
    case "accepted_output":
      return numberInput(model, "grossRate") * numberInput(model, "time") * numberInput(model, "acceptPercent") / 100;
    case "pipe_net_time": {
      const fillRate = numbers(model.inputs.fillTimes).reduce((sum, time) => sum + 1 / time, 0);
      const emptyRate = numbers(model.inputs.emptyTimes).reduce((sum, time) => sum + 1 / time, 0);
      return (1 - numberInput(model, "initialFraction") - numberInput(model, "completedFraction")) / (fillRate - emptyRate) + numberInput(model, "fixedTime");
    }
    case "leak_hidden_time": {
      const rate = 1 / numberInput(model, "normalTime") - 1 / numberInput(model, "leakedTime");
      return 1 / rate;
    }
    case "capacity_from_rate":
      return numberInput(model, "rate") * numberInput(model, "time");
    case "overflow_waste":
      return numberInput(model, "rate") * numberInput(model, "extraTime");
    case "unknown_pipe_time": {
      const net = 1 / numberInput(model, "netTime");
      const knownFill = numbers(model.inputs.knownFillTimes).reduce((sum, time) => sum + 1 / time, 0);
      const empty = numbers(model.inputs.emptyTimes).reduce((sum, time) => sum + 1 / time, 0);
      return 1 / (net - knownFill + empty);
    }
    case "resource_days":
      return numberInput(model, "people1") * numberInput(model, "days1") * numberInput(model, "consumption1") /
        (numberInput(model, "people2") * numberInput(model, "consumption2"));
    case "resource_phase_days": {
      const stock = numberInput(model, "stock");
      const consumed = numberInput(model, "peopleFirst") * numberInput(model, "firstDays") * numberInput(model, "consumption");
      return (stock - consumed) / (numberInput(model, "peopleSecond") * numberInput(model, "consumption"));
    }
    case "weighted_resource_days":
      return numberInput(model, "stock") / numberInput(model, "weightedRate");
    case "parallel_output": {
      const rates = numbers(model.inputs.rates);
      const times = numbers(model.inputs.times);
      return rates.reduce((sum, rate, index) => sum + rate * (times[index] ?? times[0] ?? 0), 0);
    }
    case "opposing_net_time":
      return numberInput(model, "totalWork") / (numberInput(model, "positiveRate") - numberInput(model, "negativeRate"));
    case "changed_rate_time": {
      const done = numberInput(model, "firstRate") * numberInput(model, "firstTime");
      return numberInput(model, "firstTime") + (numberInput(model, "totalWork") - done) / numberInput(model, "secondRate");
    }
    case "ratio_text":
      return String(model.inputs.result ?? "");
    default:
      return "0";
  }
}

function step(key: string, en: string, hi: string, pa: string, math?: string, value?: number | string): TimeWorkExplanationStep {
  return {
    key,
    text: { en, hi, pa },
    math,
    value,
  };
}

function formulaStepText(spec: MotifSpec, kind: TimeWorkSolverModel["kind"]) {
  if (kind === "combined_time") {
    return [
      ["Take the LCM as total work.", "कुल काम के लिए LCM लें।", "ਕੁੱਲ ਕੰਮ ਲਈ LCM ਲਵੋ।"],
      ["Find each worker's one-period efficiency.", "प्रत्येक मजदूर की एक-अवधि दक्षता निकालें।", "ਹਰ ਮਜ਼ਦੂਰ ਦੀ ਇੱਕ-ਅਵਧੀ ਕੁਸ਼ਲਤਾ ਕੱਢੋ।"],
      ["Divide total work by the combined efficiency.", "कुल काम को संयुक्त दक्षता से भाग दें।", "ਕੁੱਲ ਕੰਮ ਨੂੰ ਸਾਂਝੀ ਕੁਸ਼ਲਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    ] as const;
  }
  if (kind === "remaining_fraction" || kind === "full_time_from_fraction" || kind === "one_day_fraction") {
    return [
      ["Convert the given time into the fraction of work completed.", "दिए गए समय को पूरे काम के अंश में बदलें।", "ਦਿੱਤੇ ਸਮੇਂ ਨੂੰ ਪੂਰੇ ਕੰਮ ਦੇ ਹਿੱਸੇ ਵਿੱਚ ਬਦਲੋ।"],
      ["Use the remaining or required fraction of work.", "शेष या आवश्यक काम का अंश लें।", "ਬਾਕੀ ਜਾਂ ਲੋੜੀਂਦੇ ਕੰਮ ਦਾ ਹਿੱਸਾ ਲਵੋ।"],
      ["Scale the time in the same ratio as the work.", "काम के अनुपात में समय को बढ़ाएँ या घटाएँ।", "ਕੰਮ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਸਮਾਂ ਵਧਾਓ ਜਾਂ ਘਟਾਓ।"],
    ] as const;
  }
  if (kind === "efficiency_alone_time" || kind === "unknown_time_from_combined" || kind === "inverse_ratio_from_times" || kind === "time_ratio_from_efficiency") {
    return [
      ["Convert time or efficiency data into work rates.", "समय या दक्षता के आंकड़ों को काम की दरों में बदलें।", "ਸਮਾਂ ਜਾਂ ਕੁਸ਼ਲਤਾ ਦੇ ਅੰਕੜਿਆਂ ਨੂੰ ਕੰਮ ਦੀਆਂ ਦਰਾਂ ਵਿੱਚ ਬਦਲੋ।"],
      ["Combine or compare the rates as required.", "प्रश्न के अनुसार दरों को जोड़ें या तुलना करें।", "ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਦਰਾਂ ਨੂੰ ਜੋੜੋ ਜਾਂ ਤੁਲਨਾ ਕਰੋ।"],
      ["Convert the final rate relation back into time or ratio.", "अंतिम दर-संबंध को समय या अनुपात में बदलें।", "ਅੰਤਿਮ ਦਰ-ਸੰਬੰਧ ਨੂੰ ਸਮੇਂ ਜਾਂ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲੋ।"],
    ] as const;
  }
  if (kind === "man_days_hours" || kind === "required_workers" || kind === "delay_from_removed_workers") {
    return [
      ["Total work is proportional to workers x days x hours.", "कुल काम मजदूर x दिन x घंटे के समानुपाती होता है।", "ਕੁੱਲ ਕੰਮ ਮਜ਼ਦੂਰ x ਦਿਨ x ਘੰਟਿਆਂ ਦੇ ਅਨੁਪਾਤੀ ਹੁੰਦਾ ਹੈ।"],
      ["Keep the total work same on both sides of the equation.", "समीकरण के दोनों तरफ कुल काम समान रखें।", "ਸਮੀਕਰਨ ਦੇ ਦੋਹਾਂ ਪਾਸਿਆਂ ਕੁੱਲ ਕੰਮ ਇੱਕੋ ਰੱਖੋ।"],
      ["Solve the remaining relation for the required workforce or delay.", "बचे हुए संबंध से आवश्यक मजदूर या देरी निकालें।", "ਬਚੇ ਹੋਏ ਸੰਬੰਧ ਤੋਂ ਲੋੜੀਂਦੇ ਮਜ਼ਦੂਰ ਜਾਂ ਦੇਰੀ ਕੱਢੋ।"],
    ] as const;
  }
  if (kind === "linear_remaining_time" || kind === "linear_total_time" || /join|leave|phase|replacement|interrupted|workerAdded|workerRemoved|deadlineExtra/u.test(spec.archetype)) {
    return [
      ["Split the work into timeline phases.", "काम को समय-चरणों में बाँटें।", "ਕੰਮ ਨੂੰ ਸਮੇਂ ਦੇ ਚਰਨਾਂ ਵਿੱਚ ਵੰਡੋ।"],
      ["Subtract the work already completed.", "अब तक पूरा हुआ काम घटाएँ।", "ਹੁਣ ਤੱਕ ਹੋਇਆ ਕੰਮ ਘਟਾਓ।"],
      ["Use the active rate for the remaining phase.", "शेष चरण के लिए सक्रिय दर लगाएँ।", "ਬਾਕੀ ਚਰਨ ਲਈ ਸਰਗਰਮ ਦਰ ਲਗਾਓ।"],
    ] as const;
  }
  if (kind === "backward_leave_time" || kind === "unknown_phase_duration" || kind === "changed_rate_time") {
    return [
      ["Write the total work as the sum of phase-wise work.", "कुल काम को अलग-अलग चरणों के काम के योग के रूप में लिखें।", "ਕੁੱਲ ਕੰਮ ਨੂੰ ਵੱਖ-ਵੱਖ ਚਰਣਾਂ ਦੇ ਕੰਮ ਦੇ ਜੋੜ ਵਜੋਂ ਲਿਖੋ।"],
      ["Use each phase rate only for the time it is active.", "हर चरण की दर को केवल उसके सक्रिय समय के लिए लगाएँ।", "ਹਰ ਚਰਣ ਦੀ ਦਰ ਸਿਰਫ ਉਸਦੇ ਸਰਗਰਮ ਸਮੇਂ ਲਈ ਲਗਾਓ।"],
      ["Solve the phase equation for the required time.", "चरण-समीकरण से आवश्यक समय निकालें।", "ਚਰਣ-ਸਮੀਕਰਨ ਤੋਂ ਲੋੜੀਂਦਾ ਸਮਾਂ ਕੱਢੋ।"],
    ] as const;
  }
  if (kind === "pipe_net_time" || kind === "unknown_pipe_time" || kind === "leak_hidden_time" || spec.group === "pipe") {
    return [
      ["Write filling rates as positive and emptying rates as negative.", "भरने की दर धनात्मक और खाली करने की दर ऋणात्मक लें।", "ਭਰਨ ਦੀ ਦਰ ਧਨਾਤਮਕ ਅਤੇ ਖਾਲੀ ਕਰਨ ਦੀ ਦਰ ਰਣਾਤਮਕ ਲਵੋ।"],
      ["Find the effective tank rate.", "टंकी की प्रभावी दर निकालें।", "ਟੈਂਕੀ ਦੀ ਪ੍ਰਭਾਵੀ ਦਰ ਕੱਢੋ।"],
      ["Divide the required tank work by that rate.", "आवश्यक टंकी-काम को उसी दर से भाग दें।", "ਲੋੜੀਂਦੇ ਟੈਂਕੀ-ਕੰਮ ਨੂੰ ਉਸ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    ] as const;
  }
  if (kind === "cycle_time") {
    return [
      ["Find the work completed in one full cycle.", "एक पूरे चक्र में हुआ काम निकालें।", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਕੱਢੋ।"],
      ["Count full cycles before the last turn.", "अंतिम बारी से पहले पूरे चक्र गिनें।", "ਆਖਰੀ ਵਾਰੀ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਚੱਕਰ ਗਿਣੋ।"],
      ["Add only the needed part of the final turn.", "अंतिम बारी का केवल आवश्यक भाग जोड़ें।", "ਆਖਰੀ ਵਾਰੀ ਦਾ ਕੇਵਲ ਲੋੜੀਂਦਾ ਭਾਗ ਜੋੜੋ।"],
    ] as const;
  }
  if (kind === "equivalent_team_time" || kind === "team_compare_time") {
    return [
      ["Convert every worker type into a common efficiency unit.", "हर प्रकार के मजदूर को एक समान दक्षता-इकाई में बदलें।", "ਹਰ ਕਿਸਮ ਦੇ ਮਜ਼ਦੂਰ ਨੂੰ ਇੱਕੋ ਕੁਸ਼ਲਤਾ-ਇਕਾਈ ਵਿੱਚ ਬਦਲੋ।"],
      ["Add the equivalent units in the working team.", "काम करने वाली टीम की समान इकाइयाँ जोड़ें।", "ਕੰਮ ਕਰਨ ਵਾਲੀ ਟੀਮ ਦੀਆਂ ਸਮਾਨ ਇਕਾਈਆਂ ਜੋੜੋ।"],
      ["Divide the total work by the team's equivalent rate.", "कुल काम को टीम की समान दर से भाग दें।", "ਕੁੱਲ ਕੰਮ ਨੂੰ ਟੀਮ ਦੀ ਸਮਾਨ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    ] as const;
  }
  if (kind === "pairwise_worker_time" || kind === "team_minus_known_time" || kind === "contribution_rate" || kind === "ratio_from_values" || kind === "ratio_text") {
    return [
      ["Work with rates, not with completion times directly.", "सीधे समय से नहीं, दरों से काम करें।", "ਸਿੱਧੇ ਸਮੇਂ ਨਾਲ ਨਹੀਂ, ਦਰਾਂ ਨਾਲ ਕੰਮ ਕਰੋ।"],
      ["Use the given pair, team, or contribution data to isolate the required rate.", "दिए गए जोड़े, टीम या योगदान से आवश्यक दर अलग करें।", "ਦਿੱਤੇ ਜੋੜੇ, ਟੀਮ ਜਾਂ ਯੋਗਦਾਨ ਨਾਲ ਲੋੜੀਂਦੀ ਦਰ ਵੱਖ ਕਰੋ।"],
      ["Convert the isolated rate or values into the asked result.", "अलग की गई दर या मानों को पूछे गए परिणाम में बदलें।", "ਵੱਖ ਕੀਤੀ ਦਰ ਜਾਂ ਮੁੱਲਾਂ ਨੂੰ ਪੁੱਛੇ ਗਏ ਨਤੀਜੇ ਵਿੱਚ ਬਦਲੋ।"],
    ] as const;
  }
  if (spec.group === "wage" || kind === "wage_share" || kind === "contract_earning") {
    return [
      ["Convert each person's work into contribution units.", "हर व्यक्ति के काम को योगदान इकाइयों में बदलें।", "ਹਰ ਵਿਅਕਤੀ ਦੇ ਕੰਮ ਨੂੰ ਯੋਗਦਾਨ ਇਕਾਈਆਂ ਵਿੱਚ ਬਦਲੋ।"],
      ["Use the work-share ratio for the wage.", "हिस्से के लिए कार्य-अनुपात लगाएँ।", "ਹਿੱਸੇ ਲਈ ਕੰਮ-ਅਨੁਪਾਤ ਲਗਾਓ।"],
      ["Apply the wage or contract amount.", "मजदूरी या ठेके की राशि लगाएँ।", "ਮਜ਼ਦੂਰੀ ਜਾਂ ਠੇਕੇ ਦੀ ਰਕਮ ਲਗਾਓ।"],
    ] as const;
  }
  if (kind === "accepted_output") {
    return [
      ["First find the gross output produced.", "पहले कुल बना हुआ उत्पादन निकालें।", "ਪਹਿਲਾਂ ਕੁੱਲ ਬਣਿਆ ਉਤਪਾਦਨ ਕੱਢੋ।"],
      ["Apply the accepted-output percentage to remove rejected work.", "अस्वीकृत काम हटाने के लिए स्वीकृत-उत्पादन प्रतिशत लगाएँ।", "ਰੱਦ ਹੋਏ ਕੰਮ ਨੂੰ ਹਟਾਉਣ ਲਈ ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਪ੍ਰਤੀਸ਼ਤ ਲਗਾਓ।"],
      ["Use the net accepted output for the final answer.", "अंतिम उत्तर के लिए शुद्ध स्वीकृत उत्पादन लें।", "ਅੰਤਿਮ ਉੱਤਰ ਲਈ ਸ਼ੁੱਧ ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਲਵੋ।"],
    ] as const;
  }
  if (spec.group === "resource" || kind === "resource_days" || kind === "resource_phase_days" || kind === "weighted_resource_days") {
    return [
      ["Convert the stock into consumption units.", "भंडार को खपत इकाइयों में बदलें।", "ਭੰਡਾਰ ਨੂੰ ਖਪਤ ਇਕਾਈਆਂ ਵਿੱਚ ਬਦਲੋ।"],
      ["Subtract the stock already consumed.", "पहले खपत हुआ भंडार घटाएँ।", "ਪਹਿਲਾਂ ਖਪਤ ਹੋਇਆ ਭੰਡਾਰ ਘਟਾਓ।"],
      ["Divide the remaining stock by the new daily use.", "शेष भंडार को नई दैनिक खपत से भाग दें।", "ਬਾਕੀ ਭੰਡਾਰ ਨੂੰ ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਖਪਤ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    ] as const;
  }
  if (kind === "parallel_output" || spec.group === "applied") {
    return [
      ["Write output as rate multiplied by active time.", "उत्पादन को दर गुणा सक्रिय समय लिखें।", "ਉਤਪਾਦਨ ਨੂੰ ਦਰ ਗੁਣਾ ਸਰਗਰਮ ਸਮਾਂ ਲਿਖੋ।"],
      ["Add the outputs of all active agents.", "सभी सक्रिय साधनों का उत्पादन जोड़ें।", "ਸਾਰੇ ਸਰਗਰਮ ਸਾਧਨਾਂ ਦਾ ਉਤਪਾਦਨ ਜੋੜੋ।"],
      ["Simplify the total output.", "कुल उत्पादन सरल करें।", "ਕੁੱਲ ਉਤਪਾਦਨ ਸਰਲ ਕਰੋ।"],
    ] as const;
  }
  return [
    ["Choose work units so that all rates stay comparable.", "काम की इकाइयाँ ऐसी चुनें कि सभी दरों की तुलना हो सके।", "ਕੰਮ ਦੀਆਂ ਇਕਾਈਆਂ ਅਜਿਹੀਆਂ ਚੁਣੋ ਕਿ ਸਾਰੀਆਂ ਦਰਾਂ ਦੀ ਤੁਲਨਾ ਹੋ ਸਕੇ।"],
    ["Apply the active rates for their respective times.", "सक्रिय दरों को उनके अपने समय के लिए लगाएँ।", "ਸਰਗਰਮ ਦਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਆਪਣੇ ਸਮੇਂ ਲਈ ਲਗਾਓ।"],
    ["Use the resulting work equation to compute the asked quantity.", "बने हुए काम-समीकरण से पूछी गई मात्रा निकालें।", "ਬਣੇ ਕੰਮ-ਸਮੀਕਰਨ ਤੋਂ ਪੁੱਛੀ ਗਈ ਮਾਤਰਾ ਕੱਢੋ।"],
  ] as const;
}

function formulaSteps(
  spec: MotifSpec,
  kind: TimeWorkSolverModel["kind"],
  formula: string,
  substitution: string,
  simplification: string,
) {
  const labels = formulaStepText(spec, kind);
  return [
    step("formula", labels[0][0], labels[0][1], labels[0][2], formula),
    step("substitution", labels[1][0], labels[1][1], labels[1][2], substitution),
    step("simplification", labels[2][0], labels[2][1], labels[2][2], simplification),
  ];
}

function phrase<T>(seed: string, values: readonly T[]) {
  return pick(values, `${seed}:phrase`);
}

function buildExplanation(
  steps: readonly TimeWorkExplanationStep[],
  answerValue: string,
  shortcutMath: string,
  language: Locale,
) {
  const heading = {
    en: "Shortcut / Exam Method:",
    hi: "शॉर्टकट / परीक्षा विधि:",
    pa: "ਸ਼ਾਰਟਕਟ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ:",
  }[language];
  const answerLabel = {
    en: "Answer",
    hi: "उत्तर",
    pa: "ਉੱਤਰ",
  }[language];
  const lines: string[] = [];
  for (const item of steps) {
    lines.push(item.text[language]);
    if (item.math) lines.push(displayMath(item.math));
  }
  lines.push(heading);
  lines.push(displayMath(shortcutMath));
  lines.push(`${answerLabel}: ${answerValue}`);
  return lines.join("\n");
}

function shuffle<T>(items: readonly T[], seed: string) {
  return [...items].sort((left, right) => hashText(`${seed}:${String(left)}`) - hashText(`${seed}:${String(right)}`));
}

function optionValues(answer: number | string, candidates: Array<number | string>) {
  return [answer, ...candidates].filter((value, index, values) => values.findIndex((item) => String(item) === String(value)) === index).slice(0, 4);
}

function formatOptions(values: readonly (number | string)[], unit: TimeWorkAnswerUnit, language: Locale = "en") {
  return values.map((value) => answerText(value, unit, language));
}

function numericDistractors(answer: number, seed: string) {
  const basis = [
    Math.max(0.5, answer + pick([-3, -2, -1, 1, 2, 3], `${seed}:d1`)),
    Math.max(0.5, answer * pick([0.75, 0.8, 1.2, 1.25, 1.5], `${seed}:d2`)),
    Math.max(0.5, answer + pick([4, 5, 6, -4, -5], `${seed}:d3`)),
    Math.max(0.5, answer / 2),
  ];
  return basis.map((value) => Number(clean(value)));
}

function stemSkeleton(stem: string) {
  return stem
    .replace(/₹\d+(?:\.\d+)?/gu, "₹#")
    .replace(/\d+(?:\.\d+)?/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(variables: Record<string, unknown>) {
  return Object.entries(variables)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : String(value)}`)
    .join("|");
}

function realismFor(spec: MotifSpec, seed: string) {
  const jitter = hashText(`${seed}:realism`) % 5;
  if (spec.complexity === "easy") return 72 + jitter;
  if (spec.complexity === "medium") return 80 + jitter;
  if (spec.complexity === "hard") return 86 + jitter;
  return 90 + jitter;
}

function distinctPair(seed: string, offset = 0): [number, number] {
  const first = shortPool(seed, offset);
  let second = shortPool(seed, offset + 3);
  if (second === first) second = shortPool(seed, offset + 5);
  if (second === first) second += 6;
  return [first, second];
}

function distinctTriple(seed: string, offset = 0): [number, number, number] {
  const [a, b] = distinctPair(seed, offset);
  let c = shortPool(seed, offset + 7);
  if (c === a || c === b) c += 6;
  return [a, b, c];
}

function workAndRates(times: readonly number[]) {
  const totalWork = lcmMany(times);
  const rates = times.map((time) => totalWork / time);
  return { totalWork, rates };
}

function makeDraft(input: {
  seed: string;
  spec: MotifSpec;
  model: TimeWorkSolverModel;
  stem: TimeWorkLocalizedText;
  answerKind: TimeWorkAnswerKind;
  answerUnit: TimeWorkAnswerUnit;
  formula: string;
  substitution: string;
  simplification: string;
  shortcutMath: string;
  extraVariables?: Record<string, unknown>;
  distractors?: Array<number | string>;
}): Draft {
  const answer = evaluateTimeWorkSolverModel(input.model);
  const variables = {
    solverKind: input.model.kind,
    ...input.model.inputs,
    ...(input.extraVariables ?? {}),
  };
  return {
    variables,
    solverModel: input.model,
    stem: naturalTimeWorkStem(input.seed, input.spec, variables, input.stem),
    answer,
    answerKind: input.answerKind,
    answerUnit: input.answerUnit,
    steps: formulaSteps(input.spec, input.model.kind, input.formula, input.substitution, input.simplification),
    shortcutMath: input.shortcutMath,
    distractorValues: input.distractors ?? (typeof answer === "number" ? numericDistractors(answer, input.seed) : []),
  };
}

function buildCombined(seed: string, spec: MotifSpec): Draft {
  const [a, b] = distinctPair(seed);
  const { totalWork, rates } = workAndRates([a, b]);
  const model: TimeWorkSolverModel = { kind: "combined_time", inputs: { times: [a, b] } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A can finish a work in ${a} days and B in ${b} days. In how many days can they finish it together?`,
        `A can complete a work in ${a} days and B can complete the same work in ${b} days. In how many days will they complete it together?`,
        `A completes a job in ${a} days, while B completes it in ${b} days. Find the time required when both work together.`,
      ]),
      hi: `A एक काम ${a} दिन में और B वही काम ${b} दिन में पूरा करता है। दोनों मिलकर काम कितने दिन में पूरा करेंगे?`,
      pa: `A ਇੱਕ ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ਉਹੀ ਕੰਮ ${b} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ?`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `W=LCM(${a},${b})=${totalWork}`,
    substitution: `A=${totalWork}/${a}=${rates[0]},\\quad B=${totalWork}/${b}=${rates[1]}`,
    simplification: `T=\\frac{${totalWork}}{${rates[0]}+${rates[1]}}=${clean(Number(answer))}`,
    shortcutMath: `T=\\frac{${a}\\times ${b}}{${a}+${b}}=${clean(Number(answer))}`,
    distractors: [a + b, (a + b) / 2, Math.min(a, b), Math.abs(a - b)],
  });
}

function buildResidual(seed: string, spec: MotifSpec): Draft {
  const totalTime = pick([10, 12, 15, 18, 20, 24, 30], `${seed}:total`);
  const elapsed = pick([2, 3, 4, 5, 6, 8, 10], `${seed}:elapsed`);
  const safeElapsed = Math.min(elapsed, totalTime - 2);
  const model: TimeWorkSolverModel = { kind: "remaining_fraction", inputs: { totalTime, elapsed: safeElapsed } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A team can complete a work in ${totalTime} days. It works for ${safeElapsed} days. What fraction of work is left?`,
        `A work is planned to finish in ${totalTime} days. After ${safeElapsed} days of work, find the remaining fraction.`,
        `If a job takes ${totalTime} days and ${safeElapsed} days have already been worked, what part is still unfinished?`,
      ]),
      hi: `एक काम ${totalTime} दिन में पूरा होता है। ${safeElapsed} दिन काम होने के बाद कितना भाग शेष रहेगा?`,
      pa: `ਇੱਕ ਕੰਮ ${totalTime} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${safeElapsed} ਦਿਨ ਕੰਮ ਹੋਣ ਤੋਂ ਬਾਅਦ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`,
    },
    answerKind: "fraction",
    answerUnit: "fraction",
    formula: `R=1-\\frac{t}{T}`,
    substitution: `R=1-\\frac{${safeElapsed}}{${totalTime}}`,
    simplification: `R=\\frac{${totalTime - safeElapsed}}{${totalTime}}=${fractionText(totalTime - safeElapsed, totalTime)}`,
    shortcutMath: `R=\\frac{${totalTime}-${safeElapsed}}{${totalTime}}=${fractionText(totalTime - safeElapsed, totalTime)}`,
    distractors: [fractionText(safeElapsed, totalTime), fractionText(totalTime, totalTime - safeElapsed), fractionText(totalTime - safeElapsed, safeElapsed)],
  });
}

function buildEfficiencyAlone(seed: string, spec: MotifSpec): Draft {
  const parts = pick([[2, 3], [3, 4], [4, 5], [5, 7]] as const, `${seed}:parts`);
  const together = pick([6, 8, 10, 12], `${seed}:together`);
  const model: TimeWorkSolverModel = { kind: "efficiency_alone_time", inputs: { efficiencyParts: [...parts], togetherTime: together, index: 0 } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `The efficiencies of A and B are in the ratio ${parts[0]}:${parts[1]}. Together they finish the work in ${together} days. In how many days can A alone complete the work?`,
        `A:B efficiency is ${parts[0]}:${parts[1]}. If both together complete a job in ${together} days, in how many days can A alone finish it?`,
        `The efficiencies of two workers are in the ratio ${parts[0]}:${parts[1]}. Together they complete the work in ${together} days. In how many days can A alone complete it?`,
      ]),
      hi: `A और B की दक्षता का अनुपात ${parts[0]}:${parts[1]} है। दोनों मिलकर काम ${together} दिन में पूरा करते हैं। A अकेला कितने दिन लेगा?`,
      pa: `A ਅਤੇ B ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ${parts[0]}:${parts[1]} ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ${together} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ?`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `W=(a+b)T`,
    substitution: `W=(${parts[0]}+${parts[1]})\\times ${together}`,
    simplification: `T_A=\\frac{${(parts[0] + parts[1]) * together}}{${parts[0]}}=${clean(Number(answer))}`,
    shortcutMath: `T_A=\\frac{(a+b)T}{a}=\\frac{(${parts[0]}+${parts[1]})${together}}{${parts[0]}}=${clean(Number(answer))}`,
    distractors: [together * parts[0] / parts[1], together * parts[1] / parts[0], together + parts[0] + parts[1]],
  });
}

function buildUnknownCombined(seed: string, spec: MotifSpec): Draft {
  const known = pick([12, 15, 18, 20, 24, 30], `${seed}:known`);
  const combined = pick([6, 8, 10, 12], `${seed}:combined`);
  const safeCombined = Math.min(combined, known - 2);
  const model: TimeWorkSolverModel = { kind: "unknown_time_from_combined", inputs: { combinedTime: safeCombined, knownTimes: [known] } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A and B together complete a work in ${safeCombined} days. A alone takes ${known} days. In how many days can B alone complete it?`,
        `A and B together finish a work in ${safeCombined} days. If A can finish alone in ${known} days, in how many days can B alone finish it?`,
        `A alone needs ${known} days, while A and B together need ${safeCombined} days. How many days will B alone need?`,
      ]),
      hi: `A और B मिलकर काम ${safeCombined} दिन में करते हैं। A अकेला ${known} दिन लेता है। B अकेला कितने दिन लेगा?`,
      pa: `A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ${safeCombined} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ${known} ਦਿਨ ਲੈਂਦਾ ਹੈ। B ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ?`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `\\frac{1}{B}=\\frac{1}{T}-\\frac{1}{A}`,
    substitution: `\\frac{1}{B}=\\frac{1}{${safeCombined}}-\\frac{1}{${known}}`,
    simplification: `B=${clean(Number(answer))}`,
    shortcutMath: `B=\\frac{${safeCombined}\\times ${known}}{${known}-${safeCombined}}=${clean(Number(answer))}`,
    distractors: [known - safeCombined, known + safeCombined, (known + safeCombined) / 2],
  });
}

function buildFractionWork(seed: string, spec: MotifSpec): Draft {
  const frac = pick([[1, 3], [2, 5], [3, 8], [4, 9]] as const, `${seed}:frac`);
  const days = pick([4, 6, 8, 9, 12], `${seed}:days`);
  const model: TimeWorkSolverModel = { kind: "full_time_from_fraction", inputs: { numerator: frac[0], denominator: frac[1], days } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A completes ${inlineMath(`\\frac{${frac[0]}}{${frac[1]}}`)} of a work in ${days} days. Find the time needed for the whole work.`,
        `If ${inlineMath(`\\frac{${frac[0]}}{${frac[1]}}`)} of a job takes ${days} days, how many days will the full job take?`,
        `A worker finishes ${inlineMath(`\\frac{${frac[0]}}{${frac[1]}}`)} of the work in ${days} days. Find the total time.`,
      ]),
      hi: `A किसी काम का ${inlineMath(`\\frac{${frac[0]}}{${frac[1]}}`)} भाग ${days} दिन में करता है। पूरा काम कितने दिन में होगा?`,
      pa: `A ਕਿਸੇ ਕੰਮ ਦਾ ${inlineMath(`\\frac{${frac[0]}}{${frac[1]}}`)} ਹਿੱਸਾ ${days} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਵੇਗਾ?`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `T=d\\times \\frac{q}{p}`,
    substitution: `T=${days}\\times \\frac{${frac[1]}}{${frac[0]}}`,
    simplification: `T=${clean(Number(answer))}`,
    shortcutMath: `T=${days}\\div \\frac{${frac[0]}}{${frac[1]}}=${clean(Number(answer))}`,
    distractors: [days * frac[0] / frac[1], days + frac[1], days * frac[1]],
  });
}

function buildManDaysHours(seed: string, spec: MotifSpec): Draft {
  const tuple = pick([
    { m1: 12, d1: 10, h1: 8, d2: 16, h2: 6 },
    { m1: 16, d1: 12, h1: 6, d2: 18, h2: 8 },
    { m1: 10, d1: 15, h1: 8, d2: 20, h2: 6 },
    { m1: 18, d1: 8, h1: 5, d2: 12, h2: 6 },
    { m1: 15, d1: 16, h1: 6, d2: 12, h2: 8 },
  ] as const, `${seed}:tuple`);
  const { m1, d1, h1, d2, h2 } = tuple;
  const model: TimeWorkSolverModel = { kind: "man_days_hours", inputs: { m1, d1, h1, w1: 1, d2, h2, w2: 1 } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `${m1} men working ${h1} hours a day finish a work in ${d1} days. How many men are needed to finish it in ${d2} days working ${h2} hours a day?`,
        `A job needs ${m1} men for ${d1} days at ${h1} hours per day. Find the men required for ${d2} days at ${h2} hours per day.`,
        `${m1} workers complete a job in ${d1} days by working ${h1} hours daily. For ${h2} hours daily and ${d2} days, find the required workers.`,
      ]),
      hi: `${m1} मजदूर रोज ${h1} घंटे काम करके ${d1} दिन में काम पूरा करते हैं। रोज ${h2} घंटे काम करके ${d2} दिन में काम पूरा करने के लिए कितने मजदूर चाहिए?`,
      pa: `${m1} ਮਜ਼ਦੂਰ ਰੋਜ਼ ${h1} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ${d1} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਰੋਜ਼ ${h2} ਘੰਟੇ ਕੰਮ ਕਰਕੇ ${d2} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ?`,
    },
    answerKind: "workers",
    answerUnit: "workers",
    formula: `M_1D_1H_1=M_2D_2H_2`,
    substitution: `${m1}\\times ${d1}\\times ${h1}=M_2\\times ${d2}\\times ${h2}`,
    simplification: `M_2=${clean(Number(answer))}`,
    shortcutMath: `M_2=\\frac{${m1}\\times ${d1}\\times ${h1}}{${d2}\\times ${h2}}=${clean(Number(answer))}`,
    distractors: [Math.round(m1 * d2 / d1), m1, Math.ceil(Number(answer) + 3)],
  });
}

function buildRatioFromTimes(seed: string, spec: MotifSpec): Draft {
  const [a, b] = distinctPair(seed);
  const model: TimeWorkSolverModel = { kind: spec.archetype === "timeRatio" ? "time_ratio_from_efficiency" : "inverse_ratio_from_times", inputs: spec.archetype === "timeRatio" ? { efficiencyParts: [a, b] } : { times: [a, b] } };
  const answer = evaluateTimeWorkSolverModel(model);
  const askTime = spec.archetype === "timeRatio";
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: askTime
        ? phrase(seed, [
            `The efficiencies of A and B are in the ratio ${a}:${b}. Find their time ratio.`,
            `A:B efficiency is ${a}:${b}. What is A:B time ratio for the same work?`,
            `If efficiency ratio of A and B is ${a}:${b}, find the ratio of their completion times.`,
          ])
        : phrase(seed, [
            `A alone takes ${a} days and B alone takes ${b} days. Find the ratio of work done by them in the same time.`,
            `A can complete a work in ${a} days and B can complete it in ${b} days. What is the ratio of work done by A and B in the same number of days?`,
            `A finishes in ${a} days and B in ${b} days. Find their efficiency ratio.`,
          ]),
      hi: askTime
        ? `A और B की दक्षता का अनुपात ${a}:${b} है। उनका समय अनुपात ज्ञात करें।`
        : `A अकेला ${a} दिन और B अकेला ${b} दिन लेता है। समान समय में उनके काम का अनुपात ज्ञात करें।`,
      pa: askTime
        ? `A ਅਤੇ B ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। ਉਹਨਾਂ ਦਾ ਸਮਾਂ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`
        : `A ਇਕੱਲਾ ${a} ਦਿਨ ਅਤੇ B ਇਕੱਲਾ ${b} ਦਿਨ ਲੈਂਦਾ ਹੈ। ਸਮਾਨ ਸਮੇਂ ਵਿੱਚ ਉਹਨਾਂ ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "ratio",
    answerUnit: "ratio",
    formula: askTime ? `T_A:T_B=E_B:E_A` : `W_A:W_B=\\frac{1}{${a}}:\\frac{1}{${b}}`,
    substitution: askTime ? `T_A:T_B=${b}:${a}` : `W_A:W_B=${b}:${a}`,
    simplification: `${askTime ? "T_A:T_B" : "W_A:W_B"}=${answer}`,
    shortcutMath: `${askTime ? "T" : "E"}=${answer}`,
    distractors: [`${a}:${b}`, `${b}:${a + b}`, `${a + b}:${b}`],
  });
}

function buildWageRatio(seed: string, spec: MotifSpec): Draft {
  const values = pick([[300, 500], [450, 600], [720, 960], [800, 1200]] as const, `${seed}:wage`);
  const model: TimeWorkSolverModel = { kind: "ratio_from_values", inputs: { values: [...values] } };
  const answer = evaluateTimeWorkSolverModel(model);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A and B work for the same number of days and earn ₹${values[0]} and ₹${values[1]}. Find their efficiency ratio.`,
        `For equal working time, A gets ₹${values[0]} and B gets ₹${values[1]}. What is A:B efficiency?`,
        `A and B are paid ₹${values[0]} and ₹${values[1]} for equal time. Find the ratio of their work rates.`,
      ]),
      hi: `A और B समान दिन काम करते हैं और उन्हें ₹${values[0]} तथा ₹${values[1]} मिलते हैं। उनकी दक्षता का अनुपात ज्ञात करें।`,
      pa: `A ਅਤੇ B ਇੱਕੋ ਜਿਹੇ ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ₹${values[0]} ਅਤੇ ₹${values[1]} ਮਿਲਦੇ ਹਨ। ਉਹਨਾਂ ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "ratio",
    answerUnit: "ratio",
    formula: `W_A:W_B=E_A:E_B`,
    substitution: `E_A:E_B=${values[0]}:${values[1]}`,
    simplification: `E_A:E_B=${answer}`,
    shortcutMath: `E=${answer}`,
    distractors: [`${values[1]}:${values[0]}`, `${values[0] / 10}:${values[1] / 20}`, `${values[0] + values[1]}:${values[1]}`],
  });
}

function buildOneDay(seed: string, spec: MotifSpec): Draft {
  const time = pool(seed);
  const model: TimeWorkSolverModel = { kind: "one_day_fraction", inputs: { time } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A completes a work in ${time} days. Find A's one-day work.`,
        `If a worker finishes a job in ${time} days, what fraction is completed in one day?`,
        `A needs ${time} days for the whole work. Find the work done in one day.`,
      ]),
      hi: `A एक काम ${time} दिन में पूरा करता है। एक दिन का काम ज्ञात करें।`,
      pa: `A ਇੱਕ ਕੰਮ ${time} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "fraction",
    answerUnit: "fraction",
    formula: `r=\\frac{1}{T}`,
    substitution: `r=\\frac{1}{${time}}`,
    simplification: `r=${fractionText(1, time)}`,
    shortcutMath: `r=1/${time}=${fractionText(1, time)}`,
    distractors: [String(time), fractionText(time - 1, time), fractionText(1, time + 1)],
  });
}

function buildLinearTimeline(seed: string, spec: MotifSpec): Draft {
  const [a, b, c] = distinctTriple(seed);
  const { totalWork, rates } = workAndRates([a, b, c]);
  const t1 = pick([2, 3, 4, 5], `${seed}:t1`);
  const idle = spec.archetype === "interrupted" ? pick([1, 2, 3], `${seed}:idle`) : 0;
  let model: TimeWorkSolverModel;
  let stem: TimeWorkLocalizedText;
  let substitution = "";
  let simplification = "";
  let shortcut = "";

  if (spec.archetype === "delayedJoin") {
    model = { kind: "linear_total_time", inputs: { totalWork, doneRate: rates[0], doneTime: t1, fixedDone: 0, remainingRate: rates[0]! + rates[1]!, calendarOffset: 0 } };
    stem = {
      en: phrase(seed, [
        `A can finish a work in ${a} days and B in ${b} days. A works alone for ${t1} days, then B joins. Find the total time taken.`,
        `A starts a job alone and works for ${t1} days. A and B then finish it together. A alone takes ${a} days and B alone takes ${b} days. Find the total time.`,
        `A needs ${a} days and B needs ${b} days for the same work. After A works ${t1} days alone, both work together. In how many days will the job be completed in all?`,
      ]),
      hi: `A काम ${a} दिन में और B ${b} दिन में करता है। A पहले ${t1} दिन अकेला काम करता है, फिर B जुड़ता है। कुल समय ज्ञात करें।`,
      pa: `A ਕੰਮ ${a} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ B ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦਾ ਹੈ। A ਪਹਿਲਾਂ ${t1} ਦਿਨ ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ B ਜੁੜਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    };
    substitution = `W_1=${rates[0]}\\times ${t1},\\quad R=${totalWork}-${rates[0] * t1}`;
    simplification = `T=${t1}+\\frac{${totalWork - rates[0]! * t1}}{${rates[0]}+${rates[1]}}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`;
    shortcut = `T=${t1}+\\frac{${totalWork}-${rates[0]}\\times ${t1}}{${rates[0]}+${rates[1]}}`;
  } else if (spec.archetype === "forwardLeave") {
    model = { kind: "linear_total_time", inputs: { totalWork, doneRate: rates[0]! + rates[1]!, doneTime: t1, fixedDone: 0, remainingRate: rates[1], calendarOffset: 0 } };
    stem = {
      en: phrase(seed, [
        `A and B start a work together. A alone takes ${a} days and B alone takes ${b} days. A leaves after ${t1} days; B finishes the rest. Find the total time.`,
        `A and B work together for ${t1} days, then only B continues. A alone needs ${a} days and B alone needs ${b} days. How many days are needed in all?`,
        `A and B begin a job together. After ${t1} days A leaves. If A and B alone take ${a} and ${b} days, find when the job ends.`,
      ]),
      hi: `A और B साथ काम शुरू करते हैं। A ${a} दिन और B ${b} दिन में अकेले काम करते हैं। ${t1} दिन बाद A चला जाता है। कुल समय ज्ञात करें।`,
      pa: `A ਅਤੇ B ਇਕੱਠੇ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। A ${a} ਦਿਨ ਅਤੇ B ${b} ਦਿਨ ਵਿੱਚ ਇਕੱਲੇ ਕੰਮ ਕਰਦੇ ਹਨ। ${t1} ਦਿਨ ਬਾਅਦ A ਚਲਾ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    };
    substitution = `W_1=(${rates[0]}+${rates[1]})\\times ${t1}`;
    simplification = `T=${t1}+\\frac{${totalWork - (rates[0]! + rates[1]!) * t1}}{${rates[1]}}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`;
    shortcut = `T=${t1}+\\frac{W-W_1}{B}`;
  } else if (spec.archetype === "interrupted") {
    const activeDays = pick([6, 8, 10, 12, 15], `${seed}:active-days`);
    const interruptedTotalWork = (rates[0]! + rates[1]!) * activeDays;
    const activeTime = fractionDisplay(activeDays);
    model = { kind: "linear_total_time", inputs: { totalWork: interruptedTotalWork, doneRate: rates[0]! + rates[1]!, doneTime: 0, fixedDone: 0, remainingRate: rates[0]! + rates[1]!, calendarOffset: idle } };
    stem = {
      en: phrase(seed, [
        `A and B together can finish a work in ${activeTime} days. Work is stopped for ${idle} days due to interruption. Find the calendar time.`,
        `A and B need ${activeTime} active days together. If there is a ${idle}-day pause, find the total calendar duration.`,
        `A job requires ${activeTime} working days by the team. Work remains paused for ${idle} days. Find total elapsed time.`,
      ]),
      hi: `A और B मिलकर काम ${activeTime} सक्रिय दिन में करते हैं। बीच में ${idle} दिन काम रुकता है। कुल कैलेंडर समय ज्ञात करें।`,
      pa: `A ਅਤੇ B ਮਿਲ ਕੇ ਕੰਮ ${activeTime} ਸਰਗਰਮ ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। ਵਿਚਕਾਰ ${idle} ਦਿਨ ਕੰਮ ਰੁਕਦਾ ਹੈ। ਕੁੱਲ ਕੈਲੰਡਰ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    };
    substitution = `T_{active}=\\frac{${interruptedTotalWork}}{${rates[0]}+${rates[1]}}`;
    simplification = `T=T_{active}+${idle}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`;
    shortcut = `T=t_a+t_i`;
  } else if (spec.archetype === "backwardLeave") {
    const leaves = [2, 3];
    model = { kind: "backward_leave_time", inputs: { totalWork, rates: [rates[0], rates[1]], leaveBefore: leaves } };
    stem = {
      en: phrase(seed, [
        `A and B can finish a work alone in ${a} and ${b} days. A leaves ${leaves[0]} days before completion and B leaves ${leaves[1]} days before completion. Find the total time.`,
        `A needs ${a} days and B needs ${b} days. In a joint job, A is absent for the last ${leaves[0]} days and B for the last ${leaves[1]} days. Find total duration.`,
        `A and B work on a job but leave before completion by ${leaves[0]} and ${leaves[1]} days respectively. Their alone times are ${a} and ${b} days. Find total time.`,
      ]),
      hi: `A और B अकेले काम ${a} और ${b} दिन में करते हैं। A पूर्ण होने से ${leaves[0]} दिन पहले और B ${leaves[1]} दिन पहले चला जाता है। कुल समय ज्ञात करें।`,
      pa: `A ਅਤੇ B ਇਕੱਲੇ ਕੰਮ ${a} ਅਤੇ ${b} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। A ਪੂਰਾ ਹੋਣ ਤੋਂ ${leaves[0]} ਦਿਨ ਪਹਿਲਾਂ ਅਤੇ B ${leaves[1]} ਦਿਨ ਪਹਿਲਾਂ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    };
    substitution = `${rates[0]}(T-${leaves[0]})+${rates[1]}(T-${leaves[1]})=${totalWork}`;
    simplification = `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`;
    shortcut = `T=\\frac{W+A\\times ${leaves[0]}+B\\times ${leaves[1]}}{A+B}`;
  } else {
    const firstRate = spec.archetype === "replacement" ? rates[0]! + rates[1]! : rates[0]!;
    const remainingRate = spec.archetype === "replacement" ? rates[0]! + rates[2]! : rates[0]! + rates[1]! + rates[2]!;
    model = { kind: "linear_total_time", inputs: { totalWork, doneRate: firstRate, doneTime: t1, fixedDone: 0, remainingRate, calendarOffset: 0 } };
    const action = spec.archetype === "replacement" ? "B is replaced by C" : "B and C join";
    stem = {
      en: phrase(seed, [
        `A, B and C alone take ${a}, ${b} and ${c} days. For the first ${t1} days the initial phase runs, then ${action}. Find the total time.`,
        `In a phased job, the first phase lasts ${t1} days. Individual times of A, B and C are ${a}, ${b} and ${c} days. After that, ${action}. Find total time.`,
        `A job changes team after ${t1} days. A, B and C alone take ${a}, ${b} and ${c} days. If ${action}, find the completion time.`,
      ]),
      hi: `A, B और C अकेले ${a}, ${b} और ${c} दिन लेते हैं। पहले ${t1} दिन प्रारंभिक चरण चलता है, फिर ${action}। कुल समय ज्ञात करें।`,
      pa: `A, B ਅਤੇ C ਇਕੱਲੇ ${a}, ${b} ਅਤੇ ${c} ਦਿਨ ਲੈਂਦੇ ਹਨ। ਪਹਿਲੇ ${t1} ਦਿਨ ਪਹਿਲਾ ਚਰਨ ਚੱਲਦਾ ਹੈ, ਫਿਰ ${action}। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    };
    substitution = `W_1=${firstRate}\\times ${t1}`;
    simplification = `T=${t1}+\\frac{${totalWork - firstRate * t1}}{${remainingRate}}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`;
    shortcut = `T=t_1+\\frac{W-W_1}{r_2}`;
  }

  return makeDraft({
    seed,
    spec,
    model,
    stem,
    answerKind: "time",
    answerUnit: "days",
    formula: spec.formula,
    substitution,
    simplification,
    shortcutMath: shortcut,
  });
}

function buildWorkerAdjustment(seed: string, spec: MotifSpec): Draft {
  const unitRate = 1;
  const totalWork = pick([180, 240, 300, 360], `${seed}:work`);
  const currentWorkers = pick([8, 10, 12], `${seed}:workers`);
  const worked = pick([6, 8, 10], `${seed}:worked`);
  const timeLeft = pick([8, 10, 12], `${seed}:left`);
  if (spec.archetype === "workerRemoved") {
    const removedWorkers = pick([2, 3, 4], `${seed}:removed`);
    const plannedTime = (totalWork - currentWorkers * unitRate * worked) / (currentWorkers * unitRate);
    const model: TimeWorkSolverModel = { kind: "delay_from_removed_workers", inputs: { remainingWork: totalWork - currentWorkers * worked, unitRate, plannedTime, originalWorkers: currentWorkers, removedWorkers } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `${currentWorkers} workers start a job of ${totalWork} units and work ${worked} days. Then ${removedWorkers} workers leave. Find the delay compared with the original plan.`,
          `A project has ${totalWork} work units. ${currentWorkers} workers work for ${worked} days, then ${removedWorkers} leave. Find the delay.`,
          `${currentWorkers} equal workers planned a job. After ${worked} days, ${removedWorkers} workers leave. Find how many days the work is delayed.`,
        ]),
        hi: `${currentWorkers} मजदूर ${totalWork} इकाई काम शुरू करते हैं और ${worked} दिन काम करते हैं। फिर ${removedWorkers} मजदूर चले जाते हैं। मूल योजना की तुलना में देरी ज्ञात करें।`,
        pa: `${currentWorkers} ਮਜ਼ਦੂਰ ${totalWork} ਇਕਾਈ ਕੰਮ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ${worked} ਦਿਨ ਕੰਮ ਕਰਦੇ ਹਨ। ਫਿਰ ${removedWorkers} ਮਜ਼ਦੂਰ ਚਲੇ ਜਾਂਦੇ ਹਨ। ਮੂਲ ਯੋਜਨਾ ਨਾਲੋਂ ਦੇਰੀ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `D=T_{actual}-T_{planned}`,
      substitution: `R=${totalWork}-${currentWorkers}\\times ${worked}`,
      simplification: `D=\\frac{${totalWork - currentWorkers * worked}}{${currentWorkers - removedWorkers}}-\\frac{${totalWork - currentWorkers * worked}}{${currentWorkers}}`,
      shortcutMath: `D=T_a-T_p`,
      extraVariables: { totalWork, currentWorkers, worked, removedWorkers },
    });
  }
  const completedWork = currentWorkers * unitRate * worked;
  const model: TimeWorkSolverModel = { kind: "required_workers", inputs: { totalWork, completedWork, unitRate, timeLeft, currentWorkers } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `${currentWorkers} workers have completed ${completedWork} units of a ${totalWork}-unit job. Only ${timeLeft} days remain. How many extra workers are needed?`,
        `A job has ${totalWork} units. ${currentWorkers} workers finish ${completedWork} units, and ${timeLeft} days are left. Find the extra workers required.`,
        `After a delay, ${completedWork} of ${totalWork} work units are done by ${currentWorkers} workers. To meet a ${timeLeft}-day deadline, find extra workers.`,
      ]),
      hi: `${totalWork} इकाई काम में से ${completedWork} इकाई ${currentWorkers} मजदूरों ने कर दी है। केवल ${timeLeft} दिन बचे हैं। कितने अतिरिक्त मजदूर चाहिए?`,
      pa: `${totalWork} ਇਕਾਈ ਕੰਮ ਵਿਚੋਂ ${completedWork} ਇਕਾਈ ${currentWorkers} ਮਜ਼ਦੂਰਾਂ ਨੇ ਕਰ ਦਿੱਤੀ ਹੈ। ਕੇਵਲ ${timeLeft} ਦਿਨ ਬਚੇ ਹਨ। ਕਿੰਨੇ ਵਾਧੂ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ?`,
    },
    answerKind: "workers",
    answerUnit: "workers",
      formula: `N_{extra}=\\left\\lceil\\frac{R}{r\\times t}\\right\\rceil-N_c`,
      substitution: `N_{extra}=\\left\\lceil\\frac{${totalWork - completedWork}}{1\\times ${timeLeft}}\\right\\rceil-${currentWorkers}`,
      simplification: `N_{extra}=${evaluateTimeWorkSolverModel(model)}`,
      shortcutMath: `N_{extra}=N_r-N_c`,
  });
}

function buildCycle(seed: string, spec: MotifSpec): Draft {
  const totalWork = pick([60, 72, 90, 120], `${seed}:work`);
  const rates =
    spec.archetype === "cycleGroup" || spec.archetype === "conditionalCycle"
      ? [pick([6, 8, 10], `${seed}:a`), pick([4, 5, 6], `${seed}:b`), pick([3, 4, 5], `${seed}:c`)]
      : [pick([6, 8, 10], `${seed}:a`), -pick([2, 3, 4], `${seed}:b`)];
  if (spec.archetype === "cycleTwo" || spec.archetype === "cycleHours" || spec.archetype === "terminalCycle" || spec.archetype === "workRest") {
    rates[1] = spec.archetype === "workRest" ? 0 : pick([4, 5, 6], `${seed}:b`);
  }
  const durations = rates.map(() => 1);
  const model: TimeWorkSolverModel = { kind: "cycle_time", inputs: { totalWork, rates, durations } };
  const unit = spec.archetype === "cycleHours" ? "hours" : "days";
  const unitSingular = unit.slice(0, -1);
  const stemEn = (() => {
    if (spec.archetype === "cycleTwo") {
      return phrase(seed, [
        `A and B work on alternate days, starting with A. A packs ${rates[0]} boxes in a day and B packs ${rates[1]} boxes in a day. If ${totalWork} boxes are to be packed, in how many days will the job be completed?`,
        `A works on the first day and B on the second day, and the order repeats. A prints ${rates[0]} pages per day and B prints ${rates[1]} pages per day. In how many days will ${totalWork} pages be printed?`,
        `Two workers take turns day by day, starting with A. A repairs ${rates[0]} metres and B repairs ${rates[1]} metres on their turns. In how many days will ${totalWork} metres be repaired?`,
      ]);
    }
    if (spec.archetype === "cycleHours") {
      return phrase(seed, [
        `A and B work on alternate hours, starting with A. A completes ${rates[0]} units in one hour and B completes ${rates[1]} units in one hour. If the total work is ${totalWork} units, in how many hours will the work be completed?`,
        `A works in the first hour and B in the next hour, and the order repeats. They print ${rates[0]} and ${rates[1]} pages per hour respectively. In how many hours will ${totalWork} pages be printed?`,
        `A and B paint a wall in alternate hours, starting with A. A paints ${rates[0]} metres per hour and B paints ${rates[1]} metres per hour. In how many hours will ${totalWork} metres be painted?`,
      ]);
    }
    if (spec.archetype === "cycleGroup") {
      return phrase(seed, [
        `A, B and C work on successive days in that order. They pack ${rates[0]}, ${rates[1]} and ${rates[2]} boxes respectively on their turns. In how many days will ${totalWork} boxes be packed?`,
        `Three workers repeat the order A, B, C. They print ${rates[0]}, ${rates[1]} and ${rates[2]} pages on their turns. How many days are needed for ${totalWork} pages?`,
        `A, B and C repair a road on successive days. They repair ${rates[0]}, ${rates[1]} and ${rates[2]} metres respectively. In how many days will ${totalWork} metres be repaired?`,
      ]);
    }
    if (spec.archetype === "terminalCycle") {
      return phrase(seed, [
        `A and B work on alternate days, starting with A. A packs ${rates[0]} boxes and B packs ${rates[1]} boxes on their turns. If ${totalWork} boxes are required, in how many days will the job be completed?`,
        `A starts and B works the next day, then the order repeats. A prints ${rates[0]} pages and B prints ${rates[1]} pages on their turns. In how many days will ${totalWork} pages be printed?`,
        `A repairs ${rates[0]} metres of road on his turn and B repairs ${rates[1]} metres on the next turn. They continue alternately, starting with A. If the road length is ${totalWork} metres, in how many turns will the repair be completed?`,
      ]);
    }
    if (spec.archetype === "workRest") {
      return phrase(seed, [
        `A works for one day and then rests for one day. On a working day A completes ${rates[0]} units. Find the time for ${totalWork} units.`,
        `A follows a work-rest cycle: one active day, then one rest day. Each active day gives ${rates[0]} units. Find when ${totalWork} units are completed.`,
        `A works on day 1, rests on day 2, and repeats this pattern. A completes ${rates[0]} units on each working day. If the total work is ${totalWork} units, in how many days will the work be completed?`,
      ]);
    }
    if (spec.archetype === "conditionalCycle") {
      return phrase(seed, [
        `A, B and C contribute in a repeating three-turn cycle. Their outputs are ${rates.join(", ")} units. Find the time for ${totalWork} units.`,
        `Every cycle has three active turns with outputs ${rates.join(", ")} units. The job has ${totalWork} units. Find completion time.`,
        `The third worker joins only on the third turn of each cycle. Turn outputs are ${rates.join(", ")} units. Find the time for ${totalWork} units.`,
      ]);
    }
    return phrase(seed, [
      `Work has ${totalWork} units. The repeating rates are ${rates.join(", ")} units per ${unitSingular}. Find when the work is completed.`,
      `A cyclic schedule contributes ${rates.join(", ")} units on successive turns. Total work is ${totalWork} units. Find completion time.`,
      `Successive turns produce ${rates.join(", ")} units each. The work has ${totalWork} units. Find the total ${unit}.`,
    ]);
  })();
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: stemEn,
      hi: `कुल काम ${totalWork} इकाई है। क्रमिक चक्र में दरें ${rates.join(", ")} इकाई प्रति ${unit === "hours" ? "घंटा" : "दिन"} हैं। काम पूरा होने का समय ज्ञात करें।`,
      pa: `ਕੁੱਲ ਕੰਮ ${totalWork} ਇਕਾਈ ਹੈ। ਲਗਾਤਾਰ ਚੱਕਰ ਵਿੱਚ ਦਰਾਂ ${rates.join(", ")} ਇਕਾਈ ਪ੍ਰਤੀ ${unit === "hours" ? "ਘੰਟਾ" : "ਦਿਨ"} ਹਨ। ਕੰਮ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "time",
    answerUnit: unit,
    formula: `W_{cycle}=\\sum r_i`,
    substitution: `W_{cycle}=${rates.join("+")}`,
    simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `T=n_c+s`,
  });
}

function buildEquivalence(seed: string, spec: MotifSpec): Draft {
  if (spec.archetype === "efficiencyChain") {
    const first = pick([[2, 3], [3, 5], [4, 7]] as const, `${seed}:first`);
    const second = pick([[3, 4], [5, 6], [7, 8]] as const, `${seed}:second`);
    const l = lcm(first[1], second[0]);
    const values = [first[0] * l / first[1], l, second[1] * l / second[0]];
    const model: TimeWorkSolverModel = { kind: "ratio_text", inputs: { result: ratioText(values) } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `Efficiency ratios are A:B=${first[0]}:${first[1]} and B:C=${second[0]}:${second[1]}. Find A:B:C.`,
          `Given A:B efficiency ${first[0]}:${first[1]} and B:C efficiency ${second[0]}:${second[1]}, find the combined ratio.`,
          `A, B and C have chained efficiency ratios A:B=${first[0]}:${first[1]}, B:C=${second[0]}:${second[1]}. Find A:B:C.`,
        ]),
        hi: `दक्षता अनुपात A:B=${first[0]}:${first[1]} और B:C=${second[0]}:${second[1]} है। A:B:C ज्ञात करें।`,
        pa: `ਕੁਸ਼ਲਤਾ ਅਨੁਪਾਤ A:B=${first[0]}:${first[1]} ਅਤੇ B:C=${second[0]}:${second[1]} ਹੈ। A:B:C ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "ratio",
      answerUnit: "ratio",
      formula: `B\\ common`,
      substitution: `LCM(${first[1]},${second[0]})=${l}`,
      simplification: `A:B:C=${ratioText(values)}`,
      shortcutMath: `A:B:C=${ratioText(values)}`,
      extraVariables: { firstRatio: [...first], secondRatio: [...second] },
      distractors: [`${first[0]}:${first[1]}:${second[1]}`, `${values[2]}:${values[1]}:${values[0]}`, `${first[0]}:${second[0]}:${second[1]}`],
    });
  }
  const totalWork = pick([240, 300, 360], `${seed}:work`);
  const counts = spec.archetype === "equivThreeTypes" ? [2, 3, 4] : spec.archetype === "orAndTeams" ? [6, 8] : [3, 4];
  const unitRates = spec.archetype === "equivThreeTypes" ? [4, 2, 1] : [4, 3];
  const model: TimeWorkSolverModel = { kind: spec.archetype === "teamCompare" ? "team_compare_time" : "equivalent_team_time", inputs: { totalWork, counts, unitRates } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `Use the equivalence of worker types. The team has counts ${counts.join(", ")} with unit efficiencies ${unitRates.join(", ")}. Total work is ${totalWork} units. Find the time.`,
        `A mixed team has ${counts.join(", ")} workers of different types, with relative efficiencies ${unitRates.join(", ")}. Find the time for ${totalWork} boxes.`,
        `Convert all workers to common units. Counts are ${counts.join(", ")} and efficiencies ${unitRates.join(", ")}. Find completion time for ${totalWork} units.`,
      ]),
      hi: `मजदूरों को समान दक्षता इकाइयों में बदलें। संख्याएँ ${counts.join(", ")} और दक्षताएँ ${unitRates.join(", ")} हैं। ${totalWork} इकाई काम का समय ज्ञात करें।`,
      pa: `ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਸਾਂਝੀ ਕੁਸ਼ਲਤਾ ਇਕਾਈ ਵਿੱਚ ਬਦਲੋ। ਗਿਣਤੀਆਂ ${counts.join(", ")} ਅਤੇ ਕੁਸ਼ਲਤਾਵਾਂ ${unitRates.join(", ")} ਹਨ। ${totalWork} ਇਕਾਈ ਕੰਮ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `T=\\frac{W}{\\sum ne}`,
    substitution: `T=\\frac{${totalWork}}{${counts.map((count, index) => `${count}\\times ${unitRates[index]}`).join("+")}}`,
    simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `T=W/R`,
  });
}

function buildSystem(seed: string, spec: MotifSpec): Draft {
  const [a, b, c] = [10, 12, 15];
  if (spec.archetype === "pairwiseThree") {
    const model: TimeWorkSolverModel = { kind: "pairwise_worker_time", inputs: { ab: a, bc: b, ac: c, index: 0 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
        `A+B finish in ${a} days, B+C in ${b} days and C+A in ${c} days. In how many days can A alone complete the work?`,
          `Pair teams AB, BC and CA finish in ${a}, ${b} and ${c} days respectively. In how many days can A alone complete it?`,
          `Three pairwise teams complete the work in ${a}, ${b} and ${c} days respectively. In how many days can A alone complete it?`,
        ]),
        hi: `A+B ${a} दिन में, B+C ${b} दिन में और C+A ${c} दिन में काम पूरा करते हैं। A अकेला कितने दिन लेगा?`,
        pa: `A+B ${a} ਦਿਨਾਂ ਵਿੱਚ, B+C ${b} ਦਿਨਾਂ ਵਿੱਚ ਅਤੇ C+A ${c} ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ। A ਇਕੱਲਾ ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ?`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `2(A+B+C)=(A+B)+(B+C)+(C+A)`,
      substitution: `AB=${a},\\ BC=${b},\\ CA=${c}`,
      simplification: `T_A=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `A=\\frac{AB+AC-BC}{2}`,
    });
  }
  if (spec.archetype === "contributionRate") {
    const contribution = pick([24, 30, 36, 40], `${seed}:contrib`);
    const time = pick([4, 5, 6, 8], `${seed}:time`);
    const model: TimeWorkSolverModel = { kind: "contribution_rate", inputs: { contribution, time } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `A contributes ${contribution} work units in ${time} days. Find A's daily rate.`,
        hi: `A ${time} दिन में ${contribution} काम इकाइयाँ करता है। A की दैनिक दर ज्ञात करें।`,
        pa: `A ${time} ਦਿਨਾਂ ਵਿੱਚ ${contribution} ਕੰਮ ਇਕਾਈਆਂ ਕਰਦਾ ਹੈ। A ਦੀ ਰੋਜ਼ਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "rate",
      answerUnit: "sheets",
      formula: `r=\\frac{W}{t}`,
      substitution: `r=\\frac{${contribution}}{${time}}`,
      simplification: `r=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `r=W/t`,
    });
  }
  if (spec.archetype === "unknownPhase") {
    const totalWork = 120;
    const fixedWork = pick([36, 48, 60], `${seed}:fixed`);
    const unknownRate = pick([6, 8, 10], `${seed}:rate`);
    const model: TimeWorkSolverModel = { kind: "unknown_phase_duration", inputs: { totalWork, fixedWork, unknownRate } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `A phased job has ${totalWork} work units. Known phases complete ${fixedWork} units. The last phase rate is ${unknownRate} units per day. Find its duration.`,
        hi: `एक चरणबद्ध काम ${totalWork} इकाई का है। ज्ञात चरण ${fixedWork} इकाई काम करते हैं। अंतिम चरण की दर ${unknownRate} इकाई प्रति दिन है। उसकी अवधि ज्ञात करें।`,
        pa: `ਇੱਕ ਚਰਨਬੱਧ ਕੰਮ ${totalWork} ਇਕਾਈ ਦਾ ਹੈ। ਜਾਣੇ ਚਰਨ ${fixedWork} ਇਕਾਈ ਕੰਮ ਕਰਦੇ ਹਨ। ਆਖਰੀ ਚਰਨ ਦੀ ਦਰ ${unknownRate} ਇਕਾਈ ਪ੍ਰਤੀ ਦਿਨ ਹੈ। ਉਸਦੀ ਮਿਆਦ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `x=\\frac{W-W_1}{r}`,
      substitution: `x=\\frac{${totalWork}-${fixedWork}}{${unknownRate}}`,
      simplification: `x=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `x=\\frac{W_l}{r}`,
    });
  }
  const unknownWorkerTuples = [
    { teamTime: 6, knownTimes: [12, 24] },
    { teamTime: 8, knownTimes: [16, 32] },
    { teamTime: 10, knownTimes: [20, 40] },
  ];
  const unknownWorkerTuple = pick(unknownWorkerTuples, `${seed}:unknown-worker`);
  const teamTime = spec.archetype === "teamMinusPair" ? pick([6, 8, 10], `${seed}:team`) : unknownWorkerTuple.teamTime;
  const knownTimes = spec.archetype === "teamMinusPair" ? [pick([12, 15, 20], `${seed}:pair`)] : unknownWorkerTuple.knownTimes;
  const model: TimeWorkSolverModel = { kind: "team_minus_known_time", inputs: { teamTime, knownTimes } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A team completes a work in ${teamTime} days. Known worker times are ${knownTimes.join(" and ")} days. Find the unknown worker's time.`,
        `The full team takes ${teamTime} days. The known workers alone take ${knownTimes.join(", ")} days. In how many days can the remaining worker alone finish it?`,
        `A+B+C finish in ${teamTime} days, while the known workers take ${knownTimes.join(", ")} days alone. How many days will the missing worker need alone?`,
      ]),
      hi: `पूरी टीम काम ${teamTime} दिन में करती है। ज्ञात मजदूरों के समय ${knownTimes.join(", ")} दिन हैं। अज्ञात मजदूर का समय ज्ञात करें।`,
      pa: `ਪੂਰੀ ਟੀਮ ਕੰਮ ${teamTime} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੀ ਹੈ। ਜਾਣੇ ਮਜ਼ਦੂਰਾਂ ਦੇ ਸਮੇਂ ${knownTimes.join(", ")} ਦਿਨ ਹਨ। ਅਣਜਾਣ ਮਜ਼ਦੂਰ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `r_X=r_{team}-\\sum r_i`,
    substitution: `r_X=\\frac{1}{${teamTime}}-${knownTimes.map((time) => `\\frac{1}{${time}}`).join("-")}`,
    simplification: `T_X=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `T_X=1/r_X`,
  });
}

function buildWage(seed: string, spec: MotifSpec): Draft {
  if (spec.archetype === "contractBonus") {
    const base = pick([6000, 8000, 9000], `${seed}:base`);
    const deltaDays = pick([2, 3, 4], `${seed}:delta`);
    const bonusPerDay = pick([150, 200, 250], `${seed}:bonus`);
    const model: TimeWorkSolverModel = { kind: "contract_earning", inputs: { base, deltaDays, bonusPerDay, penaltyPerDay: bonusPerDay, early: 1 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `A contract pays ₹${base} with a bonus of ₹${bonusPerDay} per day for early completion. The work is completed ${deltaDays} days early. Find the earning.`,
        hi: `एक ठेके में ₹${base} मिलते हैं और जल्दी पूरा करने पर प्रति दिन ₹${bonusPerDay} बोनस है। काम ${deltaDays} दिन पहले पूरा हुआ। कमाई ज्ञात करें।`,
        pa: `ਇੱਕ ਠੇਕੇ ਵਿੱਚ ₹${base} ਮਿਲਦੇ ਹਨ ਅਤੇ ਜਲਦੀ ਪੂਰਾ ਕਰਨ ਤੇ ਪ੍ਰਤੀ ਦਿਨ ₹${bonusPerDay} ਬੋਨਸ ਹੈ। ਕੰਮ ${deltaDays} ਦਿਨ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਇਆ। ਕਮਾਈ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "amount",
      answerUnit: "rupees",
      formula: `E=base+bonus`,
      substitution: `E=${base}+${deltaDays}\\times ${bonusPerDay}`,
      simplification: `E=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `E=B+\\Delta`,
    });
  }
  if (spec.archetype === "qualityRejection") {
    const grossRate = pick([80, 100, 120], `${seed}:rate`);
    const time = pick([5, 6, 8], `${seed}:time`);
    const acceptPercent = pick([85, 90, 95], `${seed}:accept`);
    const model: TimeWorkSolverModel = { kind: "accepted_output", inputs: { grossRate, time, acceptPercent } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `${grossRate} pages are printed per hour for ${time} hours, but only ${acceptPercent}% are accepted. Find the accepted pages.`,
        hi: `प्रति घंटे ${grossRate} पृष्ठ ${time} घंटे छपते हैं, लेकिन केवल ${acceptPercent}% स्वीकार होते हैं। स्वीकार पृष्ठ ज्ञात करें।`,
        pa: `ਪ੍ਰਤੀ ਘੰਟਾ ${grossRate} ਸਫ਼ੇ ${time} ਘੰਟੇ ਛਪਦੇ ਹਨ, ਪਰ ਕੇਵਲ ${acceptPercent}% ਮਨਜ਼ੂਰ ਹੁੰਦੇ ਹਨ। ਮਨਜ਼ੂਰ ਸਫ਼ੇ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "output",
      answerUnit: "pages",
      formula: `O_a=O_g\\times \\frac{p}{100}`,
      substitution: `O_a=${grossRate}\\times ${time}\\times \\frac{${acceptPercent}}{100}`,
      simplification: `O_a=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `O_a=O_g\\times \\frac{p}{100}`,
    });
  }
  const totalWage = pick([7200, 9000, 12000], `${seed}:wage`);
  const contributions = spec.archetype === "partialTimeWage" ? [8, 12] : spec.archetype === "efficiencyTimeWage" ? [3 * 5, 4 * 6] : spec.archetype === "helperWage" ? [30, 30, 12] : [24, 36, 40];
  const index = spec.archetype === "helperWage" ? 2 : 0;
  const model: TimeWorkSolverModel = { kind: "wage_share", inputs: { totalWage, contributions, index } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `A contract wage of ₹${totalWage} is divided in the work-share ratio ${contributions.join(":")}. What is the asked worker's share?`,
        `Workers share ₹${totalWage} for a job in the ratio ${contributions.join(":")}. What will the selected worker receive?`,
        `The total wage is ₹${totalWage}. Actual work shares are ${contributions.join(":")}. What is the selected share?`,
      ]),
      hi: `₹${totalWage} की मजदूरी योगदान ${contributions.join(":")} के अनुपात में बाँटी जाती है। आवश्यक हिस्सा ज्ञात करें।`,
      pa: `₹${totalWage} ਦੀ ਮਜ਼ਦੂਰੀ ਯੋਗਦਾਨ ${contributions.join(":")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੀ ਹੈ। ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "amount",
    answerUnit: "rupees",
    formula: `Share=\\frac{c_i}{\\sum c}\\times W`,
    substitution: `Share=\\frac{${contributions[index]}}{${contributions.reduce((sum, value) => sum + value, 0)}}\\times ${totalWage}`,
    simplification: `Share=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `S_i=\\frac{c_i}{\\sum c}\\times W`,
  });
}

function buildPipe(seed: string, spec: MotifSpec): Draft {
  if (spec.archetype === "hiddenLeak") {
    const normalTime = pick([10, 12, 15], `${seed}:normal`);
    const leakedTime = normalTime + pick([5, 6, 10], `${seed}:leaked`);
    const model: TimeWorkSolverModel = { kind: "leak_hidden_time", inputs: { normalTime, leakedTime } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `A pipe fills a tank in ${normalTime} hours. With a leak, it fills in ${leakedTime} hours. Find the time in which the leak alone empties the full tank.`,
          `Normally a tank fills in ${normalTime} hours, but with leakage it takes ${leakedTime} hours. Find the leak's emptying time.`,
          `An inlet pipe fills a tank in ${normalTime} hours. Because of a leak, the tank fills in ${leakedTime} hours. Find the leak time.`,
        ]),
        hi: `एक पाइप टंकी ${normalTime} घंटे में भरता है। रिसाव होने पर ${leakedTime} घंटे लगते हैं। रिसाव अकेला भरी टंकी कितने घंटे में खाली करेगा?`,
        pa: `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${normalTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਰਿਸਾਅ ਹੋਣ ਤੇ ${leakedTime} ਘੰਟੇ ਲੱਗਦੇ ਹਨ। ਰਿਸਾਅ ਇਕੱਲਾ ਭਰੀ ਟੈਂਕੀ ਕਿੰਨੇ ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰੇਗਾ?`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `\\frac{1}{L}=\\frac{1}{F}-\\frac{1}{T}`,
      substitution: `\\frac{1}{L}=\\frac{1}{${normalTime}}-\\frac{1}{${leakedTime}}`,
      simplification: `L=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `L=\\frac{FT}{T-F}`,
    });
  }
  if (spec.archetype === "capacityLeak" || spec.archetype === "tankCapacity" || spec.archetype === "twoTankTransfer") {
    const rate = pick([12, 15, 20, 25], `${seed}:rate`);
    const time = pick([20, 24, 30, 40], `${seed}:time`);
    const model: TimeWorkSolverModel = { kind: "capacity_from_rate", inputs: { rate, time } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `Water flows at ${rate} litres per minute for ${time} minutes. Find the quantity of water.`,
          `A pipe supplies ${rate} litres per minute. How much water is supplied in ${time} minutes?`,
          `A tank receives water at ${rate} litres/minute for ${time} minutes. Find the volume filled.`,
        ]),
        hi: `पानी ${rate} लीटर प्रति मिनट की दर से ${time} मिनट बहता है। पानी की मात्रा ज्ञात करें।`,
        pa: `ਪਾਣੀ ${rate} ਲੀਟਰ ਪ੍ਰਤੀ ਮਿੰਟ ਦੀ ਦਰ ਨਾਲ ${time} ਮਿੰਟ ਵਗਦਾ ਹੈ। ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "output",
      answerUnit: "litres",
      formula: `C=rt`,
      substitution: `C=${rate}\\times ${time}`,
      simplification: `C=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `C=rt`,
    });
  }
  if (spec.archetype === "overflow") {
    const rate = pick([10, 12, 15], `${seed}:rate`);
    const extraTime = pick([4, 5, 6], `${seed}:extra`);
    const model: TimeWorkSolverModel = { kind: "overflow_waste", inputs: { rate, extraTime } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `After a tank becomes full, the pipe continues to run at ${rate} litres per minute for ${extraTime} minutes. Find the wasted water.`,
        hi: `टंकी भरने के बाद पाइप ${rate} लीटर प्रति मिनट की दर से ${extraTime} मिनट और चलता है। व्यर्थ पानी ज्ञात करें।`,
        pa: `ਟੈਂਕੀ ਭਰਨ ਤੋਂ ਬਾਅਦ ਪਾਈਪ ${rate} ਲੀਟਰ ਪ੍ਰਤੀ ਮਿੰਟ ਦੀ ਦਰ ਨਾਲ ${extraTime} ਮਿੰਟ ਹੋਰ ਚੱਲਦਾ ਹੈ। ਵਿਅਰਥ ਪਾਣੀ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "output",
      answerUnit: "litres",
      formula: `W_e=rt_e`,
      substitution: `W_e=${rate}\\times ${extraTime}`,
      simplification: `W_e=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `W_e=rt_e`,
    });
  }
  if (spec.archetype === "unknownPipe") {
    const known = pick([12, 15, 20], `${seed}:known`);
    const netTime = pick([6, 8, 10], `${seed}:net`);
    const model: TimeWorkSolverModel = { kind: "unknown_pipe_time", inputs: { netTime, knownFillTimes: [known], emptyTimes: [] } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `Pipe A fills a tank in ${known} hours. Pipes A and B together fill it in ${netTime} hours. In how many hours can Pipe B alone fill the tank?`,
        hi: `पाइप A टंकी ${known} घंटे में भरता है। A और B मिलकर ${netTime} घंटे में भरते हैं। B अकेला कितना समय लेगा?`,
        pa: `ਪਾਈਪ A ਟੈਂਕੀ ${known} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। A ਅਤੇ B ਮਿਲ ਕੇ ${netTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੇ ਹਨ। B ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `\\frac{1}{B}=\\frac{1}{T}-\\frac{1}{A}`,
      substitution: `\\frac{1}{B}=\\frac{1}{${netTime}}-\\frac{1}{${known}}`,
      simplification: `B=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `B=\\frac{AT}{A-T}`,
    });
  }
  if (spec.archetype === "pipeCycle" || spec.archetype === "pipeTerminalCycle") {
    const model: TimeWorkSolverModel = { kind: "cycle_time", inputs: { totalWork: 60, rates: [12, -5], durations: [1, 1] } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `A filling pipe adds 12 litres in one hour and an emptying pipe removes 5 litres in the next hour alternately. The tank capacity is 60 litres. In how many hours will the tank be completely filled?`,
          `A tank is filled for one hour at 12 litres per hour and then drained for one hour at 5 litres per hour repeatedly. In how many hours will a 60-litre tank be completely filled?`,
          `Water is added at 12 litres in the first hour and removed at 5 litres in the next hour, and this pattern repeats. In how many hours will a 60-litre tank be full?`,
        ]),
        hi: `भरना और खाली होना बारी-बारी होता है। भरने की दर 12 इकाई प्रति घंटा और खाली करने की दर 5 इकाई प्रति घंटा है। टंकी 60 इकाई की है। समय ज्ञात करें।`,
        pa: `ਭਰਨਾ ਅਤੇ ਖਾਲੀ ਹੋਣਾ ਵਾਰੀ-ਵਾਰੀ ਹੁੰਦਾ ਹੈ। ਭਰਨ ਦੀ ਦਰ 12 ਇਕਾਈ ਪ੍ਰਤੀ ਘੰਟਾ ਅਤੇ ਖਾਲੀ ਕਰਨ ਦੀ ਦਰ 5 ਇਕਾਈ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ। ਟੈਂਕੀ 60 ਇਕਾਈ ਦੀ ਹੈ। ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `W_{cycle}=12-5`,
      substitution: `60\\ units,\\ cycle=7`,
      simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=C_f+t_f`,
    });
  }
  if (spec.archetype === "partialTank") {
    const fillTime = 12;
    const initialFraction = 0.25;
    const model: TimeWorkSolverModel = { kind: "pipe_net_time", inputs: { fillTimes: [fillTime], emptyTimes: [], initialFraction, completedFraction: 0, fixedTime: 0 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `A tank is already one-fourth full. A pipe can fill the whole tank in ${fillTime} hours. Find the time needed to fill the remaining part.`,
          `A pipe fills a full tank in ${fillTime} hours. If the tank is already ${inlineMath("\\frac{1}{4}")} full, in how many hours will it be completely filled?`,
          `One-fourth of a tank is filled. The filling pipe alone fills the tank in ${fillTime} hours. In how many hours will the tank be completely filled?`,
        ]),
        hi: `टंकी पहले से \\(\\frac{1}{4}\\) भरी है। एक पाइप पूरी टंकी ${fillTime} घंटे में भरता है। शेष भाग भरने का समय ज्ञात करें।`,
        pa: `ਟੈਂਕੀ ਪਹਿਲਾਂ ਹੀ \\(\\frac{1}{4}\\) ਭਰੀ ਹੈ। ਇੱਕ ਪਾਈਪ ਪੂਰੀ ਟੈਂਕੀ ${fillTime} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਬਾਕੀ ਹਿੱਸਾ ਭਰਨ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `T=\\frac{1-f}{r_f}`,
      substitution: `T=\\frac{1-1/4}{1/${fillTime}}`,
      simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=(1-f)F`,
    });
  }
  if (spec.archetype === "pipeClosure") {
    const [a, b] = [12, 18];
    const { totalWork, rates } = workAndRates([a, b]);
    const firstPhase = 2;
    const firstRate = rates[0]! + rates[1]!;
    const model: TimeWorkSolverModel = { kind: "linear_total_time", inputs: { totalWork, doneRate: firstRate, doneTime: firstPhase, fixedDone: 0, remainingRate: rates[1], calendarOffset: 0 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `Pipes A and B fill a tank in ${a} hours and ${b} hours respectively. Both are opened together, but A is closed after ${firstPhase} hours. Find the total time to fill the tank.`,
          `A tank has two filling pipes taking ${a} hours and ${b} hours alone. After both run for ${firstPhase} hours, Pipe A is closed. In how many hours will the tank be completely filled?`,
          `Pipe A can fill a tank in ${a} hours and pipe B in ${b} hours. A runs only for the first ${firstPhase} hours while B continues. In how many hours will the tank be completely filled?`,
        ]),
        hi: `पाइप A और B टंकी को क्रमशः ${a} और ${b} घंटे में भरते हैं। दोनों साथ खुलते हैं, लेकिन ${firstPhase} घंटे बाद A बंद हो जाता है। कुल समय ज्ञात करें।`,
        pa: `ਪਾਈਪ A ਅਤੇ B ਟੈਂਕੀ ਨੂੰ ਕ੍ਰਮਵਾਰ ${a} ਅਤੇ ${b} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਖੁੱਲ੍ਹਦੇ ਹਨ, ਪਰ ${firstPhase} ਘੰਟਿਆਂ ਬਾਅਦ A ਬੰਦ ਹੋ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `W_1=(r_A+r_B)t_1,\\quad T=t_1+\\frac{W-W_1}{r_B}`,
      substitution: `W_1=(${rates[0]}+${rates[1]})\\times ${firstPhase}`,
      simplification: `T=${firstPhase}+\\frac{${totalWork - firstRate * firstPhase}}{${rates[1]}}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=t_1+\\frac{W-W_1}{r_B}`,
    });
  }
  if (spec.archetype === "pipeTimings") {
    const [a, b] = [12, 18];
    const { totalWork, rates } = workAndRates([a, b]);
    const firstPhase = 2;
    const model: TimeWorkSolverModel = { kind: "linear_total_time", inputs: { totalWork, doneRate: rates[0], doneTime: firstPhase, fixedDone: 0, remainingRate: rates[0]! + rates[1]!, calendarOffset: 0 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: phrase(seed, [
          `Pipe A fills a tank in ${a} hours. It is opened first, and pipe B, which fills it in ${b} hours, is opened ${firstPhase} hours later. Find the total time.`,
          `A tank is filled by Pipe A alone for ${firstPhase} hours. Then Pipe B is also opened. A and B alone take ${a} and ${b} hours respectively. In how many hours will the tank be completely filled?`,
          `Pipe A starts filling a tank. After ${firstPhase} hours, Pipe B joins. Their individual filling times are ${a} hours and ${b} hours. In how many hours will the tank be completely filled?`,
        ]),
        hi: `पाइप A टंकी ${a} घंटे में भरता है। A पहले खुलता है और ${firstPhase} घंटे बाद पाइप B भी खुलता है, जो अकेला ${b} घंटे लेता है। कुल समय ज्ञात करें।`,
        pa: `ਪਾਈਪ A ਟੈਂਕੀ ${a} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। A ਪਹਿਲਾਂ ਖੁੱਲ੍ਹਦਾ ਹੈ ਅਤੇ ${firstPhase} ਘੰਟਿਆਂ ਬਾਅਦ ਪਾਈਪ B ਵੀ ਖੁੱਲ੍ਹਦਾ ਹੈ, ਜੋ ਇਕੱਲਾ ${b} ਘੰਟੇ ਲੈਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "hours",
      formula: `W_1=r_At_1,\\quad T=t_1+\\frac{W-W_1}{r_A+r_B}`,
      substitution: `W_1=${rates[0]}\\times ${firstPhase}`,
      simplification: `T=${firstPhase}+\\frac{${totalWork - rates[0]! * firstPhase}}{${rates[0]}+${rates[1]}}=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=t_1+\\frac{W-W_1}{r_A+r_B}`,
    });
  }
  const fillTimes = spec.archetype === "twoFillersLeak" ? [12, 18] : [12];
  const emptyTimes = spec.archetype === "pipeNet" || spec.archetype === "twoFillersLeak" ? [36] : spec.archetype === "delayedLeak" ? [30] : [];
  const fixedTime = spec.archetype === "delayedLeak" || spec.archetype === "pipeClosure" || spec.archetype === "pipeTimings" ? 2 : 0;
  const completedFraction = fixedTime ? fixedTime / fillTimes[0]! : 0;
  const model: TimeWorkSolverModel = { kind: "pipe_net_time", inputs: { fillTimes, emptyTimes, initialFraction: spec.archetype === "partialTank" ? 0.25 : 0, completedFraction, fixedTime } };
  const pipeStemEn =
    spec.archetype === "twoFillersLeak"
      ? phrase(seed, [
        `Pipes A and B fill a tank in ${fillTimes[0]} hours and ${fillTimes[1]} hours. A leak empties the full tank in ${emptyTimes[0]} hours. Find the time to fill the tank when all are open.`,
          `Two filling pipes take ${fillTimes[0]} hours and ${fillTimes[1]} hours. An emptying pipe can empty the tank in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
          `Pipes A and B are opened together, while a leak is also present. Their filling times are ${fillTimes[0]} and ${fillTimes[1]} hours, and the leak empties in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
      ])
      : spec.archetype === "delayedLeak"
        ? phrase(seed, [
          `A pipe can fill a tank in ${fillTimes[0]} hours. It runs alone for ${fixedTime} hours, then a leak that empties the tank in ${emptyTimes[0]} hours starts. Find the total time.`,
          `A tank is filled by a pipe taking ${fillTimes[0]} hours. After ${fixedTime} hours, a leak opens and can empty the full tank in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
          `A filling pipe works for ${fixedTime} hours before a leak starts. The pipe fills in ${fillTimes[0]} hours and the leak empties in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
        ])
        : phrase(seed, [
          `A pipe can fill a tank in ${fillTimes[0]} hours. A leak can empty the full tank in ${emptyTimes[0]} hours. Find the time to fill the tank when both are open.`,
          `An inlet pipe fills a tank in ${fillTimes[0]} hours, while a leak empties the tank in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
          `A tank is being filled by a pipe and emptied by a leak at the same time. The pipe fills in ${fillTimes[0]} hours and the leak empties in ${emptyTimes[0]} hours. In how many hours will the tank be completely filled?`,
        ]);
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: pipeStemEn,
      hi: spec.archetype === "twoFillersLeak"
        ? `पाइप A और B टंकी को ${fillTimes[0]} और ${fillTimes[1]} घंटे में भरते हैं। एक रिसाव पूरी टंकी ${emptyTimes[0]} घंटे में खाली कर सकता है। सभी खुले हों तो भरने का समय ज्ञात करें।`
        : spec.archetype === "delayedLeak"
          ? `एक पाइप टंकी ${fillTimes[0]} घंटे में भरता है। वह ${fixedTime} घंटे अकेला चलता है, फिर ${emptyTimes[0]} घंटे में टंकी खाली करने वाला रिसाव शुरू होता है। कुल समय ज्ञात करें।`
          : `एक पाइप टंकी ${fillTimes[0]} घंटे में भरता है। एक रिसाव पूरी टंकी ${emptyTimes[0]} घंटे में खाली कर सकता है। दोनों साथ हों तो भरने का समय ज्ञात करें।`,
      pa: spec.archetype === "twoFillersLeak"
        ? `ਪਾਈਪ A ਅਤੇ B ਟੈਂਕੀ ਨੂੰ ${fillTimes[0]} ਅਤੇ ${fillTimes[1]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦੇ ਹਨ। ਇੱਕ ਰਿਸਾਅ ਪੂਰੀ ਟੈਂਕੀ ${emptyTimes[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰ ਸਕਦਾ ਹੈ। ਸਾਰੇ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤਾਂ ਭਰਨ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`
        : spec.archetype === "delayedLeak"
          ? `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${fillTimes[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਉਹ ${fixedTime} ਘੰਟੇ ਇਕੱਲਾ ਚੱਲਦਾ ਹੈ, ਫਿਰ ${emptyTimes[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਟੈਂਕੀ ਖਾਲੀ ਕਰਨ ਵਾਲਾ ਰਿਸਾਅ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`
          : `ਇੱਕ ਪਾਈਪ ਟੈਂਕੀ ${fillTimes[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ। ਇੱਕ ਰਿਸਾਅ ਪੂਰੀ ਟੈਂਕੀ ${emptyTimes[0]} ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰ ਸਕਦਾ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਹੋਣ ਤਾਂ ਭਰਨ ਦਾ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "time",
    answerUnit: "hours",
    formula: `T=\\frac{W_l}{r_f-r_e}`,
    substitution: `r=${fillTimes.map((time) => `1/${time}`).join("+")}${emptyTimes.length ? `-${emptyTimes.map((time) => `1/${time}`).join("-")}` : ""}`,
    simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `T=\\frac{W_l}{r_n}`,
  });
}

function buildResource(seed: string, spec: MotifSpec): Draft {
  if (spec.archetype === "foodPopulationChange" || spec.archetype === "foodRemaining") {
    const stock = pick([600, 720, 900], `${seed}:stock`);
    const peopleFirst = pick([20, 24, 30], `${seed}:p1`);
    const firstDays = pick([5, 6, 8], `${seed}:d1`);
    const peopleSecond = peopleFirst + pick([5, 6, 10], `${seed}:p2`);
    const model: TimeWorkSolverModel = { kind: "resource_phase_days", inputs: { stock, peopleFirst, firstDays, peopleSecond, consumption: 1 } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `${stock} person-days of food are available. ${peopleFirst} people consume it for ${firstDays} days, then the group becomes ${peopleSecond}. Find how many more days the food will last.`,
        hi: `${stock} व्यक्ति-दिन भोजन उपलब्ध है। ${peopleFirst} लोग ${firstDays} दिन भोजन लेते हैं, फिर संख्या ${peopleSecond} हो जाती है। भोजन और कितने दिन चलेगा?`,
        pa: `${stock} ਵਿਅਕਤੀ-ਦਿਨ ਭੋਜਨ ਉਪਲਬਧ ਹੈ। ${peopleFirst} ਲੋਕ ${firstDays} ਦਿਨ ਭੋਜਨ ਲੈਂਦੇ ਹਨ, ਫਿਰ ਗਿਣਤੀ ${peopleSecond} ਹੋ ਜਾਂਦੀ ਹੈ। ਭੋਜਨ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ?`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `D=\\frac{S-consumed}{people}`,
      substitution: `D=\\frac{${stock}-${peopleFirst}\\times ${firstDays}}{${peopleSecond}}`,
      simplification: `D=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `D=\\frac{S_l}{P_2}`,
    });
  }
  if (spec.archetype === "resourceEquivalence") {
    const stock = 720;
    const weightedRate = pick([24, 30, 36], `${seed}:rate`);
    const model: TimeWorkSolverModel = { kind: "weighted_resource_days", inputs: { stock, weightedRate } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `A group consumes food at ${weightedRate} adult-equivalent units per day. The stock is ${stock} units. Find how many days it will last.`,
        hi: `एक समूह रोज ${weightedRate} वयस्क-समतुल्य इकाई भोजन खाता है। भंडार ${stock} इकाई है। भोजन कितने दिन चलेगा?`,
        pa: `ਇੱਕ ਸਮੂਹ ਰੋਜ਼ ${weightedRate} ਬਾਲਗ-ਸਮਕੱਖ ਇਕਾਈ ਭੋਜਨ ਖਾਂਦਾ ਹੈ। ਭੰਡਾਰ ${stock} ਇਕਾਈ ਹੈ। ਭੋਜਨ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ?`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `D=\\frac{S}{R}`,
      substitution: `D=\\frac{${stock}}{${weightedRate}}`,
      simplification: `D=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `D=\\frac{S}{R}`,
    });
  }
  const people1 = pick([20, 24, 30], `${seed}:p1`);
  const days1 = pick([24, 30, 36], `${seed}:d1`);
  const people2 = pick([25, 30, 40], `${seed}:p2`);
  const model: TimeWorkSolverModel = { kind: "resource_days", inputs: { people1, days1, people2, consumption1: 1, consumption2: 1 } };
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: phrase(seed, [
        `Food for ${people1} people lasts ${days1} days. How many days will it last for ${people2} people?`,
        `A stock is enough for ${people1} people for ${days1} days. Find its duration for ${people2} people.`,
        `If ${people1} people can use a food stock for ${days1} days, find the days for ${people2} people.`,
      ]),
      hi: `${people1} लोगों का भोजन ${days1} दिन चलता है। ${people2} लोगों के लिए कितने दिन चलेगा?`,
      pa: `${people1} ਲੋਕਾਂ ਦਾ ਭੋਜਨ ${days1} ਦਿਨ ਚੱਲਦਾ ਹੈ। ${people2} ਲੋਕਾਂ ਲਈ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ?`,
    },
    answerKind: "time",
    answerUnit: "days",
    formula: `M_1D_1=M_2D_2`,
    substitution: `${people1}\\times ${days1}=${people2}\\times D_2`,
    simplification: `D_2=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: `D_2=\\frac{${people1}\\times ${days1}}{${people2}}`,
  });
}

function buildApplied(seed: string, spec: MotifSpec): Draft {
  if (spec.archetype === "digFill" || spec.archetype === "positiveNegative") {
    const totalWork = pick([120, 150, 180], `${seed}:work`);
    const positiveRate = pick([12, 15, 18], `${seed}:pos`);
    const negativeRate = pick([3, 4, 5], `${seed}:neg`);
    const model: TimeWorkSolverModel = { kind: "opposing_net_time", inputs: { totalWork, positiveRate, negativeRate } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `One team completes ${positiveRate} units per day while another undoes ${negativeRate} units per day. For ${totalWork} units, find the net completion time.`,
        hi: `एक टीम रोज ${positiveRate} इकाई काम करती है जबकि दूसरी ${negativeRate} इकाई काम बिगाड़ती है। ${totalWork} इकाई काम का शुद्ध समय ज्ञात करें।`,
        pa: `ਇੱਕ ਟੀਮ ਰੋਜ਼ ${positiveRate} ਇਕਾਈ ਕੰਮ ਕਰਦੀ ਹੈ ਜਦਕਿ ਦੂਜੀ ${negativeRate} ਇਕਾਈ ਕੰਮ ਵਾਪਸ ਕਰਦੀ ਹੈ। ${totalWork} ਇਕਾਈ ਕੰਮ ਦਾ ਸ਼ੁੱਧ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `T=\\frac{W}{r_+-r_-}`,
      substitution: `T=\\frac{${totalWork}}{${positiveRate}-${negativeRate}}`,
      simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=\\frac{W}{r_n}`,
    });
  }
  if (spec.archetype === "productivityDecay") {
    const totalWork = 180;
    const firstRate = 15;
    const firstTime = pick([4, 5, 6], `${seed}:first`);
    const secondRate = 12;
    const model: TimeWorkSolverModel = { kind: "changed_rate_time", inputs: { totalWork, firstRate, firstTime, secondRate } };
    return makeDraft({
      seed,
      spec,
      model,
      stem: {
        en: `A worker does ${firstRate} units per day for ${firstTime} days, then slows to ${secondRate} units per day. Total work is ${totalWork} units. Find total time.`,
        hi: `एक मजदूर ${firstTime} दिन तक रोज ${firstRate} इकाई काम करता है, फिर दर ${secondRate} इकाई प्रतिदिन हो जाती है। कुल काम ${totalWork} इकाई है। कुल समय ज्ञात करें।`,
        pa: `ਇੱਕ ਮਜ਼ਦੂਰ ${firstTime} ਦਿਨ ਤੱਕ ਰੋਜ਼ ${firstRate} ਇਕਾਈ ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ ਦਰ ${secondRate} ਇਕਾਈ ਪ੍ਰਤੀ ਦਿਨ ਹੋ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਕੰਮ ${totalWork} ਇਕਾਈ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      },
      answerKind: "time",
      answerUnit: "days",
      formula: `T=t_1+\\frac{W-r_1t_1}{r_2}`,
      substitution: `T=${firstTime}+\\frac{${totalWork}-${firstRate}\\times ${firstTime}}{${secondRate}}`,
      simplification: `T=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
      shortcutMath: `T=t_1+t_2`,
    });
  }
  if (spec.archetype === "farmHarvest" || spec.archetype === "roadConstruction" || spec.archetype === "paintingArea") {
    return buildManDaysHours(seed, spec);
  }
  const rates = spec.archetype === "machineSchedule" ? [20, 25, 30] : [12, 15, 18];
  const times = spec.archetype === "machineSchedule" ? [6, 5, 4] : [pick([5, 6, 8], `${seed}:time`)];
  const model: TimeWorkSolverModel = { kind: "parallel_output", inputs: { rates, times } };
  const unit: TimeWorkAnswerUnit = spec.archetype === "typingOutput" || spec.archetype === "printerQueue" ? "pages" : "items";
  return makeDraft({
    seed,
    spec,
    model,
    stem: {
      en: spec.archetype === "typingOutput"
        ? phrase(seed, [
          `Three typists type ${rates.join(", ")} pages per hour. They work for ${times[0]} hours. Find the total pages typed.`,
          `Typists A, B and C type at ${rates.join(", ")} pages per hour. If all work for ${times[0]} hours, find the output.`,
          `A typing job is shared by three typists with hourly speeds ${rates.join(", ")} pages. Find the pages typed in ${times[0]} hours.`,
        ])
        : spec.archetype === "printerQueue"
          ? phrase(seed, [
            `Three printers print ${rates.join(", ")} pages per hour. They run together for ${times[0]} hours. Find the total pages printed.`,
            `Printers A, B and C have hourly outputs ${rates.join(", ")} pages. Find the combined output in ${times[0]} hours.`,
            `A print job uses three printers working together for ${times[0]} hours at ${rates.join(", ")} pages per hour. Find the total pages.`,
          ])
          : spec.archetype === "machineSchedule"
            ? phrase(seed, [
              `Machines A, B and C produce ${rates.join(", ")} units per hour and run for ${times.join(", ")} hours respectively. Find the total output.`,
              `A factory uses three machines for different durations: ${times.join(", ")} hours. Their hourly outputs are ${rates.join(", ")} units. Find total production.`,
              `Machine outputs are ${rates.join(", ")} units per hour. They operate for ${times.join(", ")} hours respectively. Find the combined production.`,
            ])
            : phrase(seed, [
              `Three machines produce ${rates.join(", ")} units per hour. They run together for ${times[0]} hours. Find total output.`,
              `A production batch uses three machines with hourly rates ${rates.join(", ")} units. Find the output in ${times[0]} hours.`,
              `Machines A, B and C work together for ${times[0]} hours at ${rates.join(", ")} units per hour. Find the total produced.`,
            ]),
      hi: `समानांतर दरें ${rates.join(", ")} प्रति घंटा और सक्रिय समय ${times.join(", ")} घंटे हैं। कुल उत्पादन ज्ञात करें।`,
      pa: `ਸਮਾਂਤਰ ਦਰਾਂ ${rates.join(", ")} ਪ੍ਰਤੀ ਘੰਟਾ ਅਤੇ ਸਰਗਰਮ ਸਮਾਂ ${times.join(", ")} ਘੰਟੇ ਹਨ। ਕੁੱਲ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`,
    },
    answerKind: "output",
    answerUnit: unit,
    formula: `O=\\sum r_it_i`,
    substitution: `O=${rates.map((rate, index) => `${rate}\\times ${times[index] ?? times[0]}`).join("+")}`,
    simplification: `O=${clean(Number(evaluateTimeWorkSolverModel(model)))}`,
    shortcutMath: times.length === 1 ? `O=(r_1+r_2+r_3)t` : `O=\\sum r_it_i`,
  });
}

function buildDraft(seed: string, spec: MotifSpec): Draft {
  switch (spec.archetype) {
    case "combined":
    case "hiddenLcm":
      return buildCombined(seed, spec);
    case "residual":
      return buildResidual(seed, spec);
    case "efficiencyAlone":
    case "relativePercent":
      return buildEfficiencyAlone(seed, spec);
    case "unknownCombined":
      return buildUnknownCombined(seed, spec);
    case "fractionWork":
    case "partialThenTeam":
      return buildFractionWork(seed, spec);
    case "manDaysHours":
      return buildManDaysHours(seed, spec);
    case "workRatio":
    case "timeRatio":
      return buildRatioFromTimes(seed, spec);
    case "wageRatio":
      return buildWageRatio(seed, spec);
    case "oneDay":
      return buildOneDay(seed, spec);
    case "delayedJoin":
    case "forwardLeave":
    case "backwardLeave":
    case "multiPhase":
    case "interrupted":
    case "replacement":
      return buildLinearTimeline(seed, spec);
    case "workerAdded":
    case "workerRemoved":
    case "deadlineExtra":
      return buildWorkerAdjustment(seed, spec);
    case "machineBreakdown":
      return buildApplied(seed, spec);
    case "cycleTwo":
    case "cycleHours":
    case "cycleGroup":
    case "terminalCycle":
    case "workRest":
    case "conditionalCycle":
      return buildCycle(seed, spec);
    case "equivMenWomen":
    case "equivThreeTypes":
    case "orAndTeams":
    case "efficiencyChain":
    case "teamCompare":
      return buildEquivalence(seed, spec);
    case "pairwiseThree":
    case "teamMinusPair":
    case "unknownWorker":
    case "contributionRate":
    case "unknownPhase":
      return buildSystem(seed, spec);
    case "wageShare":
    case "helperWage":
    case "partialTimeWage":
    case "efficiencyTimeWage":
    case "contractBonus":
    case "qualityRejection":
      return buildWage(seed, spec);
    case "pipeNet":
    case "twoFillersLeak":
    case "hiddenLeak":
    case "delayedLeak":
    case "pipeCycle":
    case "pipeTerminalCycle":
    case "capacityLeak":
    case "tankCapacity":
    case "pipeTimings":
    case "twoTankTransfer":
    case "overflow":
    case "partialTank":
    case "pipeClosure":
    case "unknownPipe":
      return buildPipe(seed, spec);
    case "foodBasic":
    case "foodPopulationChange":
    case "foodRemaining":
    case "resourceEquivalence":
      return buildResource(seed, spec);
    case "typingOutput":
    case "printerQueue":
    case "farmHarvest":
    case "roadConstruction":
    case "paintingArea":
    case "digFill":
    case "parallelMachines":
    case "positiveNegative":
    case "productivityDecay":
    case "machineSchedule":
      return buildApplied(seed, spec);
    default:
      return buildCombined(seed, spec);
  }
}

function localizedOptions(options: readonly string[], draft: Draft) {
  if (draft.answerUnit === "ratio" || draft.answerUnit === "fraction") {
    return { en: [...options], hi: [...options], pa: [...options] };
  }
  const rawValues = options.map((option) => Number(String(option).match(/-?\d+(?:\.\d+)?/u)?.[0]));
  return {
    en: [...options],
    hi: rawValues.map((value, index) => Number.isFinite(value) ? answerText(value, draft.answerUnit, "hi") : options[index]!),
    pa: rawValues.map((value, index) => Number.isFinite(value) ? answerText(value, draft.answerUnit, "pa") : options[index]!),
  };
}

function finalizeProblem(input: {
  seed: string;
  runId: string;
  spec: MotifSpec;
  difficulty: "easy" | "medium" | "hard";
  draft: Draft;
}): CanonicalTimeWorkProblem {
  const answer = input.draft.answer;
  if (typeof answer === "number" && !Number.isFinite(answer)) {
    throw new Error(`Non-finite Time Work answer for ${input.spec.id}`);
  }
  const answerString = answerText(answer, input.draft.answerUnit, "en");
  const optionRaw = optionValues(answer, input.draft.distractorValues);
  for (let guard = 0; optionRaw.length < 4 && guard < 12; guard += 1) {
    const next = typeof answer === "number" ? Number(clean(answer + optionRaw.length + 2)) : `${answer}:${optionRaw.length}`;
    if (!optionRaw.some((value) => String(value) === String(next))) optionRaw.push(next);
  }
  if (optionRaw.length < 4) {
    throw new Error(`Unable to build Time Work options for ${input.spec.id}`);
  }
  const optionStrings = shuffle(formatOptions(optionRaw, input.draft.answerUnit, "en"), `${input.seed}:options`);
  const correct = optionStrings.indexOf(answerString);
  const localized = localizedOptions(optionStrings, input.draft);
  const realism = realismFor(input.spec, input.seed);
  const explanation = {
    en: buildExplanation(input.draft.steps, answerString, input.draft.shortcutMath, "en"),
    hi: buildExplanation(input.draft.steps, answerText(answer, input.draft.answerUnit, "hi"), input.draft.shortcutMath, "hi"),
    pa: buildExplanation(input.draft.steps, answerText(answer, input.draft.answerUnit, "pa"), input.draft.shortcutMath, "pa"),
  };
  const variables = input.draft.variables;
  const signature = numericSignature(variables);
  const problem: CanonicalTimeWorkProblem = {
    id: `${input.spec.id}|${hashText(`${input.seed}:${signature}`)}`,
    topic: "time-work",
    motifId: input.spec.id,
    family: input.spec.id,
    topologyId: input.spec.id,
    subtype: input.spec.id,
    category: "time_work",
    principle: input.spec.principle,
    formulaModel: input.spec.formula,
    shortcut: input.spec.shortcut,
    commonTraps: input.spec.traps,
    variables,
    stemData: variables,
    solverModel: input.draft.solverModel,
    answer,
    answerText: answerString,
    answerKind: input.draft.answerKind,
    answerUnit: input.draft.answerUnit,
    options: optionStrings,
    correct: correct >= 0 ? correct : 0,
    difficulty: input.spec.difficulty,
    complexity: input.spec.complexity,
    topology: {
      family: "time_work",
      variant: input.spec.id,
    },
    traps: input.spec.traps,
    distractors: optionStrings.filter((option) => option !== answerString),
    explanationSteps: input.draft.steps,
    localizationData: {
      stem: input.draft.stem,
      explanation,
      options: localized,
    },
    auditMeta: {
      seed: input.seed,
      runId: input.runId,
      motifId: input.spec.id,
      topologyId: input.spec.id,
      stemSkeleton: stemSkeleton(input.draft.stem.en),
      numericSignature: signature,
      solverAnswer: answerString,
      explanationFinalAnswer: answerString,
      difficultyReason: `${input.spec.group} ${input.spec.complexity} rate-state topology`,
      realismScore: realism,
      trapTypes: input.spec.traps,
    },
  };
  return problem;
}

export const TIME_WORK_MOTIF_FACTORIES: Record<TimeWorkFamilyId, TimeWorkMotifFactory> =
  Object.fromEntries(
    TIME_WORK_FAMILY_IDS.map((family) => [
      family,
      ({ seed, runId, difficulty }) => {
        const spec = TIME_WORK_MOTIF_SPECS[family];
        return finalizeProblem({
          seed,
          runId,
          difficulty,
          spec,
          draft: buildDraft(`${seed}:${family}`, spec),
        });
      },
    ]),
  ) as Record<TimeWorkFamilyId, TimeWorkMotifFactory>;

const EASY_FAMILIES = TIME_WORK_FAMILY_IDS.filter((family) => TIME_WORK_MOTIF_SPECS[family].difficulty === "easy");
const MEDIUM_FAMILIES = TIME_WORK_FAMILY_IDS.filter((family) => TIME_WORK_MOTIF_SPECS[family].difficulty === "medium");
const HARD_FAMILIES = TIME_WORK_FAMILY_IDS.filter((family) => TIME_WORK_MOTIF_SPECS[family].difficulty === "hard");

function familyPool(difficulty: "easy" | "medium" | "hard") {
  if (difficulty === "easy") return EASY_FAMILIES;
  if (difficulty === "hard") return HARD_FAMILIES;
  return [...MEDIUM_FAMILIES, ...EASY_FAMILIES, ...HARD_FAMILIES] as readonly TimeWorkFamilyId[];
}

export function createTimeWorkProblem(input: {
  seed: string;
  runId?: string;
  difficulty?: "easy" | "medium" | "hard";
  family?: TimeWorkFamilyId;
}) {
  const difficulty = input.difficulty ?? "medium";
  const family =
    input.family && TIME_WORK_FAMILY_IDS.includes(input.family)
      ? input.family
      : pick(familyPool(difficulty), `${input.seed}:family`);
  return TIME_WORK_MOTIF_FACTORIES[family]({
    seed: input.seed,
    runId: input.runId ?? input.seed,
    difficulty,
    family,
  });
}
