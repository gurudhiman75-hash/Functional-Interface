import type { ClockTaskId } from "./catalog";
import { CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION } from "./exam-natural-governance";
import type { ClockDifficulty } from "./types";

export type ClockDifficultyFeature =
  | "DIRECT_RATE_OR_COMPLEMENT"
  | "CONTINUOUS_HAND_MOTION"
  | "MODULAR_ANGLE"
  | "INVERSE_RELATION"
  | "ALGEBRAIC_ROOT"
  | "MULTIPLE_ROOTS_OR_BRANCHES"
  | "EXACT_FRACTION_LOAD"
  | "EVENT_PHASE_OR_RECURRENCE"
  | "INTERVAL_ENDPOINT_SEMANTICS"
  | "ACTUAL_VS_DISPLAYED_TIME"
  | "RATE_OR_OFFSET_INFERENCE"
  | "DAY_OFFSET"
  | "MODULAR_SELF_CORRECTION"
  | "TWO_CLOCK_COMPARISON"
  | "STRIKE_N_MINUS_ONE"
  | "VISUAL_INTERPRETATION"
  | "PHYSICAL_VALIDITY_CHECK";

export interface ClockDifficultyClusterProfile {
  score: number;
  features: readonly ClockDifficultyFeature[];
  rationale: string;
}

/**
 * Semantic baseline for each learner authority cluster after source saturation.
 * Checkpoint order is intentionally not used: V2 states that checkpoints are
 * solver/misconception boundaries, not difficulty bands.
 */
export const CLOCK_DIFFICULTY_CLUSTER_PROFILES = {
  HAND_MOTION: { score: 1, features: ["DIRECT_RATE_OR_COMPLEMENT"], rationale: "Direct hand rate × duration or its immediate inverse." },
  DIAL_SPACE_CONVERSION: { score: 1, features: ["DIRECT_RATE_OR_COMPLEMENT"], rationale: "Single minute-space to degree conversion." },
  ANGLE_AT_STATED_TIME: { score: 2, features: ["CONTINUOUS_HAND_MOTION", "MODULAR_ANGLE"], rationale: "Compute continuous hand positions and select the requested arc." },
  HAND_RELATION_CLASSIFICATION: { score: 2, features: ["CONTINUOUS_HAND_MOTION", "MODULAR_ANGLE"], rationale: "Exact hand-position relation classification." },
  TIME_FOR_ARBITRARY_ANGLE: { score: 4, features: ["INVERSE_RELATION", "ALGEBRAIC_ROOT", "MULTIPLE_ROOTS_OR_BRANCHES", "EXACT_FRACTION_LOAD"], rationale: "Inverse relative-angle equation with branch and interval filtering." },
  SPECIAL_HAND_EVENT_TIME: { score: 3, features: ["ALGEBRAIC_ROOT", "EVENT_PHASE_OR_RECURRENCE", "EXACT_FRACTION_LOAD"], rationale: "Locate a special phase from exact relative motion." },
  SPECIAL_EVENT_RECURRENCE: { score: 3, features: ["EVENT_PHASE_OR_RECURRENCE", "EXACT_FRACTION_LOAD"], rationale: "Derive recurrence gap from relative speed." },
  EVENT_COUNT_IN_INTERVAL: { score: 4, features: ["EVENT_PHASE_OR_RECURRENCE", "INTERVAL_ENDPOINT_SEMANTICS", "MULTIPLE_ROOTS_OR_BRANCHES"], rationale: "Enumerate repeated events with explicit interval boundaries." },
  EVENT_RECURRENCE_POSITION: { score: 4, features: ["EVENT_PHASE_OR_RECURRENCE", "INVERSE_RELATION", "EXACT_FRACTION_LOAD"], rationale: "Use recurrence to locate the nth event or invert an event count." },
  UNIFORM_FAULTY_CLOCK_MAPPING: { score: 3, features: ["ACTUAL_VS_DISPLAYED_TIME", "INVERSE_RELATION"], rationale: "Map actual and displayed elapsed time under one uniform rate." },
  UNIFORM_GAIN_LOSS_ERROR: { score: 3, features: ["ACTUAL_VS_DISPLAYED_TIME", "INVERSE_RELATION"], rationale: "Accumulate or invert uniform clock error." },
  INITIAL_OFFSET_CLOCK: { score: 3, features: ["ACTUAL_VS_DISPLAYED_TIME", "DIRECT_RATE_OR_COMPLEMENT"], rationale: "Keep initial offset separate from subsequent elapsed-time behavior." },
  INFER_FAULTY_CLOCK_MODEL: { score: 5, features: ["ACTUAL_VS_DISPLAYED_TIME", "RATE_OR_OFFSET_INFERENCE", "INVERSE_RELATION"], rationale: "Infer rate or set-right state from observations before answering." },
  MULTIDAY_FAULTY_CLOCK: { score: 5, features: ["ACTUAL_VS_DISPLAYED_TIME", "DAY_OFFSET", "INVERSE_RELATION"], rationale: "Preserve absolute day offset while mapping actual/displayed time." },
  NEXT_CORRECT_READING: { score: 6, features: ["ACTUAL_VS_DISPLAYED_TIME", "MODULAR_SELF_CORRECTION", "INVERSE_RELATION", "EXACT_FRACTION_LOAD"], rationale: "Solve when accumulated error reaches one exact 12-hour dial cycle." },
  TWO_FAULTY_CLOCKS: { score: 5, features: ["ACTUAL_VS_DISPLAYED_TIME", "TWO_CLOCK_COMPARISON", "RATE_OR_OFFSET_INFERENCE"], rationale: "Compare or intersect two independent faulty-clock models." },
  FAULT_FROM_COINCIDENCE_RECURRENCE: { score: 5, features: ["ACTUAL_VS_DISPLAYED_TIME", "EVENT_PHASE_OR_RECURRENCE", "RATE_OR_OFFSET_INFERENCE", "EXACT_FRACTION_LOAD"], rationale: "Infer clock error by comparing observed and normal hand-event recurrence." },
  STRIKE_GAP_MECHANICS: { score: 2, features: ["STRIKE_N_MINUS_ONE"], rationale: "Translate strikes to n−1 equal gaps, then transfer or invert." },
  STANDARD_HOUR_STRIKE_TOTAL: { score: 2, features: ["STRIKE_N_MINUS_ONE", "INTERVAL_ENDPOINT_SEMANTICS"], rationale: "Sum the standard hour-label strike schedule over a declared range." },
  VERTICAL_MIRROR_TIME: { score: 1, features: ["DIRECT_RATE_OR_COMPLEMENT"], rationale: "Direct 12-hour vertical-mirror complement with exact boundary handling." },
  CLOCK_DIAGRAM_TIME: { score: 1, features: ["VISUAL_INTERPRETATION"], rationale: "Read or select an ordinary clock diagram from exact renderer state." },
  CLOCK_DIAGRAM_ANGLE: { score: 2, features: ["VISUAL_INTERPRETATION", "MODULAR_ANGLE"], rationale: "Interpret angular relation from an exact clock diagram." },
  HAND_INTERCHANGE: { score: 4, features: ["CONTINUOUS_HAND_MOTION", "INVERSE_RELATION", "PHYSICAL_VALIDITY_CHECK"], rationale: "Source-natural first interchange uses combined hand movement and a physical-pair validity check." },
} as const satisfies Record<string, ClockDifficultyClusterProfile>;

const CLOCK_TASK_DIFFICULTY_ADJUSTMENTS: Partial<Record<ClockTaskId, number>> = {
  DIRECTED_CLOCKWISE_SEPARATION: 1,
  ANGLE_AT_TIME_WITH_SECONDS: 1,
  ANGLE_AFTER_BEFORE_SHIFT: 1,
  COMPARE_ANGLES_AT_TWO_TIMES: 1,
  NEXT_PREVIOUS_ANGLE_EVENT: 1,
  RIGHT_ANGLE_TIMES_IN_HOUR: 1,
  ACTUAL_FROM_DISPLAYED_ELAPSED: 1,
  INITIAL_OFFSET_CORRECT_RATE: -1,
  INITIAL_OFFSET_AND_WRONG_RATE: 1,
  TIME_WHEN_ERROR_REACHES_TARGET: 1,
  DERIVE_SET_RIGHT_TIME: 1,
  GAINING_AND_LOSING_EQUALITY: 1,
  TRANSFER_STRIKE_COUNT: 1,
  STRIKES_IN_DURATION: 1,
  COMPARE_STRIKING_SPEEDS: 1,
  TOTAL_STRIKES_INCLUSIVE_RANGE: 1,
  SELECT_DIAGRAM_FOR_TIME: 1,
  IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM: 1,
  OFFSET_PLUS_RATE_CORRECTION: 1,
};

function bandForScore(score: number): ClockDifficulty {
  if (score <= 2) return "FOUNDATION";
  if (score <= 4) return "STANDARD";
  return "ADVANCED";
}

export interface ClockTaskDifficultyAuditRecord {
  taskId: ClockTaskId;
  cluster: string;
  disposition: (typeof CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION)[ClockTaskId]["disposition"];
  semanticScore: number;
  difficulty: ClockDifficulty;
  features: readonly ClockDifficultyFeature[];
  calibrationStatus: "SEMANTIC_BASELINE_CALIBRATED" | "ADVANCED_HOLD_NOT_CORE_CALIBRATED" | "INTERNAL_ONLY";
  rationale: string;
}

function difficultyRecord(taskId: ClockTaskId): ClockTaskDifficultyAuditRecord {
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
  if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
    return {
      taskId,
      cluster: disposition.cluster,
      disposition: disposition.disposition,
      semanticScore: 99,
      difficulty: "ADVANCED",
      features: [],
      calibrationStatus: "INTERNAL_ONLY",
      rationale: "Internal verification metadata has no learner difficulty; ADVANCED is a non-release sentinel.",
    };
  }
  if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    return {
      taskId,
      cluster: disposition.cluster,
      disposition: disposition.disposition,
      semanticScore: 99,
      difficulty: "ADVANCED",
      features: [],
      calibrationStatus: "ADVANCED_HOLD_NOT_CORE_CALIBRATED",
      rationale: "Held experimental/sparse-source candidate; not eligible for core difficulty calibration or learner release.",
    };
  }

  const profile = CLOCK_DIFFICULTY_CLUSTER_PROFILES[disposition.cluster as keyof typeof CLOCK_DIFFICULTY_CLUSTER_PROFILES];
  if (!profile) throw new Error(`Missing semantic difficulty profile for effective cluster ${disposition.cluster}.`);
  const semanticScore = Math.max(0, profile.score + (CLOCK_TASK_DIFFICULTY_ADJUSTMENTS[taskId] ?? 0));
  return {
    taskId,
    cluster: disposition.cluster,
    disposition: disposition.disposition,
    semanticScore,
    difficulty: bandForScore(semanticScore),
    features: profile.features,
    calibrationStatus: "SEMANTIC_BASELINE_CALIBRATED",
    rationale: profile.rationale,
  };
}

export const CLOCK_DIFFICULTY_AUDIT = Object.fromEntries(
  (Object.keys(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION) as ClockTaskId[]).map((taskId) => [taskId, difficultyRecord(taskId)]),
) as Record<ClockTaskId, ClockTaskDifficultyAuditRecord>;

export const CLOCK_DIFFICULTY_POLICY = {
  status: "SEMANTIC_DIFFICULTY_AUDIT_COMPLETE",
  modelVersion: "CLK_DIFFICULTY_V1_SEMANTIC",
  checkpointOrderUsedAsDifficultyProxy: false,
  heldCandidatesCoreCalibrated: false,
  itemLevelHumanCalibrationStillRequired: true,
  difficultyAuditComplete: true,
  permanentQlAllocationAllowed: false,
} as const;

export function difficultyForClockTask(taskId: ClockTaskId): ClockDifficulty {
  return CLOCK_DIFFICULTY_AUDIT[taskId].difficulty;
}

export function clockDifficultyAuditSummary() {
  const records = Object.values(CLOCK_DIFFICULTY_AUDIT);
  const core = records.filter((record) => record.calibrationStatus === "SEMANTIC_BASELINE_CALIBRATED");
  return {
    totalCandidateRows: records.length,
    coreCalibratedRows: core.length,
    heldRows: records.filter((record) => record.calibrationStatus === "ADVANCED_HOLD_NOT_CORE_CALIBRATED").length,
    internalRows: records.filter((record) => record.calibrationStatus === "INTERNAL_ONLY").length,
    foundationCoreRows: core.filter((record) => record.difficulty === "FOUNDATION").length,
    standardCoreRows: core.filter((record) => record.difficulty === "STANDARD").length,
    advancedCoreRows: core.filter((record) => record.difficulty === "ADVANCED").length,
  } as const;
}
