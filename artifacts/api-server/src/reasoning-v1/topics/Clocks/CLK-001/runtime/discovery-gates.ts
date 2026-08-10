import {
  CLOCK_CANDIDATE_DISPOSITION,
  provisionalClockAuthorityClusters,
  type ClockCandidateDispositionRecord,
} from "./candidate-disposition";
import { CLOCK_SOURCE_AUDIT, type ClockSourceAuditRecord } from "./source-audit";
import type { ClockTaskId } from "./catalog";

export type ClockInverseAuditStatus =
  | "EXPLICIT_INVERSE_COVERED"
  | "CROSS_CLUSTER_INVERSE_COVERED"
  | "SELF_INVERSE"
  | "NO_SEPARATE_INVERSE_AUTHORITY_REQUIRED"
  | "ADVANCED_INVERSE_HELD";

export interface ClockInverseAuditRecord {
  status: ClockInverseAuditStatus;
  evidenceTaskIds: readonly ClockTaskId[];
  counterpartCluster?: string;
  note: string;
}

export interface ClockBoundaryAuditRecord {
  evidenceTaskIds: readonly ClockTaskId[];
  obligations: readonly string[];
  note: string;
}

function inverse(
  status: ClockInverseAuditStatus,
  evidenceTaskIds: readonly ClockTaskId[],
  note: string,
  counterpartCluster?: string,
): ClockInverseAuditRecord {
  return { status, evidenceTaskIds, counterpartCluster, note };
}

function boundary(
  evidenceTaskIds: readonly ClockTaskId[],
  obligations: readonly string[],
  note: string,
): ClockBoundaryAuditRecord {
  return { evidenceTaskIds, obligations, note };
}

/**
 * Explicit inverse decisions for every provisional authority cluster.
 * These decisions do not create new learner authorities. They only prove that
 * an inverse operation has either been represented, intentionally merged, held
 * for source confirmation, or judged not to require a separate learner QL.
 */
export const CLOCK_INVERSE_AUDIT = {
  HAND_MOTION: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["HAND_HOUR_ROTATION", "HAND_DURATION_FROM_ANGLE"],
    "Angle-from-duration and duration-from-angle are the two directions of the same exact hand-rate relation.",
  ),
  DIAL_SPACE_CONVERSION: inverse(
    "NO_SEPARATE_INVERSE_AUTHORITY_REQUIRED",
    ["MINUTE_SPACES_TO_ANGLE"],
    "The reverse conversion is a deterministic unit conversion and does not justify a separate learner authority.",
  ),
  ANGLE_AT_STATED_TIME: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["SMALLER_ANGLE_AT_TIME", "ONE_TIME_FOR_ANGLE_IN_HOUR", "ALL_TIMES_FOR_ANGLE_IN_HOUR"],
    "The inverse of evaluating the angle at a stated time is solving the exact root set for a target angle.",
    "TIME_FOR_ARBITRARY_ANGLE",
  ),
  HAND_RELATION_CLASSIFICATION: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["CLASSIFY_HAND_RELATION", "CLASSIFY_EVENT_FROM_TIME"],
    "Forward relation classification and classification from an event time are represented without creating another solver authority.",
  ),
  TIME_FOR_ARBITRARY_ANGLE: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["ONE_TIME_FOR_ANGLE_IN_HOUR", "ALL_TIMES_FOR_ANGLE_IN_HOUR", "SMALLER_ANGLE_AT_TIME"],
    "Root solving is the inverse direction of stated-time angle evaluation.",
    "ANGLE_AT_STATED_TIME",
  ),
  SPECIAL_HAND_EVENT_TIME: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["COINCIDENCE_IN_HOUR", "OPPOSITION_IN_HOUR", "RIGHT_ANGLE_TIMES_IN_HOUR", "CLASSIFY_EVENT_FROM_TIME"],
    "Event location is paired with event/relation classification from an exact time.",
    "HAND_RELATION_CLASSIFICATION",
  ),
  SPECIAL_EVENT_RECURRENCE: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["GAP_BETWEEN_SPECIAL_EVENTS", "NTH_OCCURRENCE", "ELAPSED_FOR_EVENT_COUNT"],
    "Recurrence gap, nth position and elapsed-for-count are complementary directions of the same phase recurrence.",
    "EVENT_RECURRENCE_POSITION",
  ),
  EVENT_COUNT_IN_INTERVAL: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["COUNT_COINCIDENCES", "COUNT_PARTIAL_INTERVAL", "ELAPSED_FOR_EVENT_COUNT"],
    "Counting events in an interval is paired with recovering elapsed span from an event count/position.",
    "EVENT_RECURRENCE_POSITION",
  ),
  EVENT_RECURRENCE_POSITION: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["NTH_OCCURRENCE", "ELAPSED_FOR_EVENT_COUNT"],
    "Nth occurrence and elapsed-for-event-count are explicit inverse query directions.",
  ),
  UNIFORM_FAULTY_CLOCK_MAPPING: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["DISPLAYED_FROM_ACTUAL_ELAPSED", "ACTUAL_FROM_DISPLAYED_ELAPSED"],
    "Actual-to-displayed and displayed-to-actual mappings are both explicit under one affine authority.",
  ),
  UNIFORM_GAIN_LOSS_ERROR: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["ERROR_AFTER_ACTUAL_DURATION", "ACTUAL_DURATION_FROM_READING_CHANGE", "TIME_WHEN_ERROR_REACHES_TARGET"],
    "Error accumulation and duration-from-error are both represented under the same exact rate model.",
  ),
  INITIAL_OFFSET_CLOCK: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["INITIAL_OFFSET_CORRECT_RATE", "INITIAL_OFFSET_AND_WRONG_RATE", "DERIVE_RATE_FROM_OBSERVATIONS"],
    "Forward offset/rate evolution is paired with inferring the affine clock model from observations.",
    "INFER_FAULTY_CLOCK_MODEL",
  ),
  INFER_FAULTY_CLOCK_MODEL: inverse(
    "CROSS_CLUSTER_INVERSE_COVERED",
    ["DERIVE_RATE_FROM_OBSERVATIONS", "DERIVE_SET_RIGHT_TIME", "MISSING_GAIN_LOSS_FROM_FINAL", "DISPLAYED_FROM_ACTUAL_ELAPSED"],
    "Model inference is the inverse direction of applying a known uniform faulty-clock model.",
    "UNIFORM_FAULTY_CLOCK_MAPPING",
  ),
  MULTIDAY_FAULTY_CLOCK: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["MULTIDAY_ACTUAL_FROM_DISPLAY", "MULTIDAY_DISPLAY_FROM_ACTUAL"],
    "Both directions of multi-day actual/displayed mapping are represented explicitly.",
  ),
  NEXT_CORRECT_READING: inverse(
    "NO_SEPARATE_INVERSE_AUTHORITY_REQUIRED",
    ["NEXT_CORRECT_READING"],
    "The task solves a modular recurrence condition; a separate inverse learner query would not add a distinct operation.",
  ),
  TWO_FAULTY_CLOCKS: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["COMPARE_TWO_FAULTY_CLOCKS", "GAINING_AND_LOSING_EQUALITY"],
    "Comparing two faulty clocks and solving the equality time use the same relative affine model in opposite query directions.",
  ),
  FAULT_FROM_COINCIDENCE_RECURRENCE: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["GAIN_FROM_COINCIDENCE_INTERVAL", "LOSS_FROM_COINCIDENCE_INTERVAL", "COINCIDENCE_INTERVAL_FROM_RATE"],
    "Rate-from-recurrence and recurrence-from-rate are both represented.",
  ),
  STRIKE_GAP_MECHANICS: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["DURATION_FOR_N_STRIKES", "GAP_FROM_N_STRIKES", "STRIKES_IN_DURATION"],
    "Strike duration, gap and count queries cover the reversible n−1 equal-gap relation.",
  ),
  STANDARD_HOUR_STRIKE_TOTAL: inverse(
    "ADVANCED_INVERSE_HELD",
    ["TOTAL_STRIKES_24_HOURS", "INFER_RANGE_OR_HOUR_FROM_TOTAL"],
    "The reverse total-to-range/hour query exists as a candidate but remains held because direct source evidence is sparse.",
  ),
  VERTICAL_MIRROR_TIME: inverse(
    "SELF_INVERSE",
    ["MIRROR_FROM_ACTUAL", "ACTUAL_FROM_MIRROR", "MIRROR_BOUNDARY_CASES"],
    "Vertical mirror-time arithmetic is an involution: applying the same exact transform twice returns the original reading.",
  ),
  CLOCK_DIAGRAM_TIME: inverse(
    "EXPLICIT_INVERSE_COVERED",
    ["READ_TIME_FROM_DIAGRAM", "SELECT_DIAGRAM_FOR_TIME"],
    "Diagram-to-time and time-to-diagram selection are both represented using the same renderer ground truth.",
  ),
  CLOCK_DIAGRAM_ANGLE: inverse(
    "NO_SEPARATE_INVERSE_AUTHORITY_REQUIRED",
    ["READ_ANGLE_TYPE_FROM_DIAGRAM", "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM"],
    "The inverse would only select/render a diagram for a known angle and does not add a distinct exam operation beyond the renderer authority.",
  ),
} satisfies Record<string, ClockInverseAuditRecord>;

/**
 * Boundary obligations for every provisional authority cluster. The audit is
 * explicit because the V2 design treats endpoint, wrap, root-branch and
 * physical-validity semantics as correctness gates rather than editorial detail.
 */
export const CLOCK_BOUNDARY_AUDIT = {
  HAND_MOTION: boundary(["HAND_HOUR_ROTATION", "HAND_DURATION_FROM_ANGLE", "HAND_REVOLUTIONS"], ["ZERO_DURATION", "FULL_REVOLUTION", "EXACT_FRACTIONAL_DURATION", "HAND_RATE_SELECTION"], "Keep exact rates and do not snap the hour hand."),
  DIAL_SPACE_CONVERSION: boundary(["MINUTE_SPACES_TO_ANGLE"], ["ZERO_SPACES", "SIXTY_SPACE_WRAP", "DIRECTED_VS_SMALLER_SEPARATION"], "Minute-space conversion must state the intended angular semantics across the dial wrap."),
  ANGLE_AT_STATED_TIME: boundary(["SMALLER_ANGLE_AT_TIME", "REFLEX_ANGLE_AT_TIME", "ANGLE_AT_TIME_WITH_SECONDS"], ["ANGLE_ZERO", "ANGLE_180", "TWELVE_O_CLOCK_WRAP", "CONTINUOUS_HOUR_HAND", "EXACT_SECONDS"], "Angles use exact modular arithmetic and continuous hour-hand motion."),
  HAND_RELATION_CLASSIFICATION: boundary(["CLASSIFY_HAND_RELATION", "CLASSIFY_EVENT_FROM_TIME"], ["EXACT_COINCIDENCE", "EXACT_OPPOSITION", "EXACT_RIGHT_ANGLE", "NO_FLOAT_TOLERANCE"], "Relation classification must use exact cyclic equality."),
  TIME_FOR_ARBITRARY_ANGLE: boundary(["ONE_TIME_FOR_ANGLE_IN_HOUR", "ALL_TIMES_FOR_ANGLE_IN_HOUR", "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE", "NEXT_PREVIOUS_ANGLE_EVENT"], ["PLUS_MINUS_BRANCHES", "ZERO_AND_180_DEGENERACY", "OPEN_HOUR_WINDOW", "STRICT_AFTER_ANCHOR", "ROOT_ORDERING"], "All exact roots must be generated before query-specific filtering or ordering."),
  SPECIAL_HAND_EVENT_TIME: boundary(["COINCIDENCE_IN_HOUR", "OPPOSITION_IN_HOUR", "RIGHT_ANGLE_TIMES_IN_HOUR"], ["HOUR_BOUNDARY", "TWO_RIGHT_ANGLE_BRANCHES", "COINCIDENCE_PHASE", "OPPOSITION_PHASE"], "Special events are exact phases of the same relative-motion model."),
  SPECIAL_EVENT_RECURRENCE: boundary(["GAP_BETWEEN_SPECIAL_EVENTS"], ["EXACT_RECURRENCE_FRACTION", "PHASE_ORIGIN", "CONSECUTIVE_EVENT_ORDER"], "Recurrence gaps must be derived from exact relative speed, not memorized constants."),
  EVENT_COUNT_IN_INTERVAL: boundary(["COUNT_COINCIDENCES", "COUNT_PARTIAL_INTERVAL", "COUNT_WITH_ENDPOINTS"], ["INCLUDE_START", "INCLUDE_END", "ADJACENT_WINDOW_DOUBLE_COUNT", "PARTIAL_INTERVAL"], "Every count must carry explicit endpoint semantics."),
  EVENT_RECURRENCE_POSITION: boundary(["NTH_OCCURRENCE", "ELAPSED_FOR_EVENT_COUNT"], ["NTH_INDEX_ORIGIN", "STRICT_NEXT_EVENT", "ANCHOR_IS_EVENT", "EXACT_RECURRENCE_FRACTION"], "Nth-event semantics must distinguish the anchor event from the first event strictly after it."),
  UNIFORM_FAULTY_CLOCK_MAPPING: boundary(["DISPLAYED_FROM_ACTUAL_ELAPSED", "ACTUAL_FROM_DISPLAYED_ELAPSED"], ["GAIN_VS_LOSS_SIGN", "RATE_DIRECTION", "ANCHOR_OFFSET", "NONNEGATIVE_ELAPSED"], "Apply the displayed:actual rate only to elapsed time from the anchor."),
  UNIFORM_GAIN_LOSS_ERROR: boundary(["ERROR_AFTER_ACTUAL_DURATION", "ACTUAL_DURATION_FROM_READING_CHANGE", "TIME_WHEN_ERROR_REACHES_TARGET"], ["ZERO_ERROR_EXCLUDED_WHERE_REQUIRED", "GAIN_LOSS_SIGN", "ACTUAL_PERIOD_BASE", "TARGET_ERROR_SIGN"], "Gain/loss is measured against actual elapsed time and retains sign until final wording."),
  INITIAL_OFFSET_CLOCK: boundary(["INITIAL_OFFSET_CORRECT_RATE", "INITIAL_OFFSET_AND_WRONG_RATE"], ["OFFSET_SIGN", "ANCHOR_READING", "CORRECT_RATE_VS_WRONG_RATE", "OFFSET_NOT_APPLIED_TWICE"], "Initial offset and subsequent rate are separate affine components."),
  INFER_FAULTY_CLOCK_MODEL: boundary(["DERIVE_RATE_FROM_OBSERVATIONS", "DERIVE_SET_RIGHT_TIME", "MISSING_GAIN_LOSS_FROM_FINAL"], ["DISTINCT_OBSERVATION_TIMES", "CONSISTENT_AFFINE_MODEL", "NONZERO_ELAPSED_BASE", "RATE_SIGN"], "Observation pairs must uniquely determine a physically valid affine model."),
  MULTIDAY_FAULTY_CLOCK: boundary(["MULTIDAY_ACTUAL_FROM_DISPLAY", "MULTIDAY_DISPLAY_FROM_ACTUAL"], ["DAY_OFFSET_EXPLICIT", "TWELVE_HOUR_DIAL_WRAP", "TWENTY_FOUR_HOUR_ELAPSED", "ANCHOR_DAY"], "Day offset is semantic data and must not be lost in 12-hour display formatting."),
  NEXT_CORRECT_READING: boundary(["NEXT_CORRECT_READING"], ["FULL_12_HOUR_DIAL_DRIFT", "STRICTLY_FUTURE", "GAIN_LOSS_DIRECTION", "MODULAR_SELF_CORRECTION"], "Self-correction occurs when accumulated dial error reaches a full 12-hour cycle."),
  TWO_FAULTY_CLOCKS: boundary(["COMPARE_TWO_FAULTY_CLOCKS", "GAINING_AND_LOSING_EQUALITY"], ["EQUAL_RATES", "NO_FUTURE_EQUALITY", "DIFFERENT_ANCHORS", "RELATIVE_RATE_SIGN"], "Equality-time queries must reject or classify degenerate relative-rate cases explicitly."),
  FAULT_FROM_COINCIDENCE_RECURRENCE: boundary(["GAIN_FROM_COINCIDENCE_INTERVAL", "LOSS_FROM_COINCIDENCE_INTERVAL", "COINCIDENCE_INTERVAL_FROM_RATE", "CLASSIFY_FROM_EVENT_INTERVAL"], ["NORMAL_INTERVAL_43200_OVER_11", "SHORTER_MEANS_FAST", "LONGER_MEANS_SLOW", "EXACT_RECURRENCE_RATIO"], "Compare the observed displayed recurrence with the exact normal-clock recurrence."),
  STRIKE_GAP_MECHANICS: boundary(["DURATION_FOR_N_STRIKES", "GAP_FROM_N_STRIKES", "FIRST_LAST_INCLUSION"], ["N_MINUS_ONE_GAPS", "AT_LEAST_TWO_STRIKES", "FIRST_LAST_INCLUSIVE", "EQUAL_GAP_ASSUMPTION"], "A strike count is not an interval count; n strikes span n−1 equal gaps."),
  STANDARD_HOUR_STRIKE_TOTAL: boundary(["TOTAL_STRIKES_12_HOURS", "TOTAL_STRIKES_24_HOURS", "TOTAL_STRIKES_INCLUSIVE_RANGE"], ["TWELVE_TO_ONE_WRAP", "RANGE_ENDPOINTS", "MIDNIGHT_NOON_CYCLE", "STANDARD_HOUR_LABEL_SCHEDULE"], "Schedule totals must preserve the 12→1 cycle and explicit range inclusion."),
  VERTICAL_MIRROR_TIME: boundary(["MIRROR_FROM_ACTUAL", "ACTUAL_FROM_MIRROR", "MIRROR_AROUND_12_BOUNDARY", "MIRROR_BOUNDARY_CASES"], ["TWELVE_O_CLOCK_BOUNDARY", "MODULO_12_HOURS", "ZERO_MINUTE_BORROW", "NO_NUMERIC_WATER_TIME"], "Vertical mirror arithmetic is allowed; numeric water-time formulas remain outside CLK-001 learner ownership."),
  CLOCK_DIAGRAM_TIME: boundary(["READ_TIME_FROM_DIAGRAM", "SELECT_DIAGRAM_FOR_TIME"], ["RENDERER_ANGLE_AGREEMENT", "CONTINUOUS_HOUR_HAND", "MOBILE_READABILITY", "ALT_TEXT_PARITY"], "Diagram truth must come from the same exact angular engine before float SVG coordinates are produced."),
  CLOCK_DIAGRAM_ANGLE: boundary(["READ_ANGLE_TYPE_FROM_DIAGRAM", "IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM"], ["SMALLER_VS_REFLEX", "ANGLE_ZERO", "ANGLE_180", "ALT_TEXT_PARITY"], "Visual angle labels must match exact smaller/reflex semantics and accessibility metadata."),
} satisfies Record<string, ClockBoundaryAuditRecord>;

export type ClockGapAuditStatus =
  | "CORE_CLUSTER_COVERED"
  | "INTENTIONAL_ADVANCED_HOLD"
  | "UNRESOLVED_SOURCE_BACKED_HOLD"
  | "INTERNAL_ONLY";

export interface ClockGapAuditRecord {
  taskId: ClockTaskId;
  status: ClockGapAuditStatus;
  cluster: string;
  sourceEvidenceLevel: ClockSourceAuditRecord["evidenceLevel"];
  note: string;
}

function gapStatus(
  taskId: ClockTaskId,
  disposition: ClockCandidateDispositionRecord,
  source: ClockSourceAuditRecord,
): ClockGapAuditStatus {
  if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") return "INTERNAL_ONLY";
  if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    if (source.evidenceLevel === "DIRECT_SOURCE" || source.evidenceLevel === "DIRECT_MULTI_SOURCE") {
      return "UNRESOLVED_SOURCE_BACKED_HOLD";
    }
    return "INTENTIONAL_ADVANCED_HOLD";
  }
  return "CORE_CLUSTER_COVERED";
}

export const CLOCK_GAP_AUDIT = Object.fromEntries(
  (Object.keys(CLOCK_CANDIDATE_DISPOSITION) as ClockTaskId[]).map((taskId) => {
    const disposition = CLOCK_CANDIDATE_DISPOSITION[taskId];
    const source = CLOCK_SOURCE_AUDIT[taskId];
    const status = gapStatus(taskId, disposition, source);
    const note = status === "UNRESOLVED_SOURCE_BACKED_HOLD"
      ? "Direct source evidence exists, but the candidate is still held; resolve before discovery freeze."
      : status === "INTENTIONAL_ADVANCED_HOLD"
        ? "Held intentionally because current evidence is adjacent, design-sparse, ownership-sensitive or advanced."
        : status === "INTERNAL_ONLY"
          ? "Verification metadata only; must not become a learner authority."
          : "Covered by a provisional authority anchor or a merged query/renderer variant.";
    return [taskId, { taskId, status, cluster: disposition.cluster, sourceEvidenceLevel: source.evidenceLevel, note }];
  }),
) as Record<ClockTaskId, ClockGapAuditRecord>;

export const CLOCK_DISCOVERY_GATE_POLICY = {
  status: "PROVISIONAL_INVERSE_BOUNDARY_GAP_AUDIT",
  permanentQlAllocationAllowed: false,
  inverseAuditComplete: true,
  boundaryAuditComplete: true,
  gapAuditComplete: true,
  sourceSaturationComplete: false,
  difficultyAuditComplete: false,
  multilingualRiskAuditComplete: false,
  humanEditorialFreezeComplete: false,
  discoveryFreezeEligible: false,
} as const;

export function clockDiscoveryAuditSummary() {
  const authorityClusters = provisionalClockAuthorityClusters();
  const inverseClusters = Object.keys(CLOCK_INVERSE_AUDIT).sort();
  const boundaryClusters = Object.keys(CLOCK_BOUNDARY_AUDIT).sort();
  const unresolvedSourceBackedHolds = Object.values(CLOCK_GAP_AUDIT)
    .filter((record) => record.status === "UNRESOLVED_SOURCE_BACKED_HOLD")
    .map((record) => record.taskId)
    .sort();
  const intentionalAdvancedHolds = Object.values(CLOCK_GAP_AUDIT)
    .filter((record) => record.status === "INTENTIONAL_ADVANCED_HOLD")
    .map((record) => record.taskId)
    .sort();

  return {
    authorityClusters,
    inverseClusters,
    boundaryClusters,
    unresolvedSourceBackedHolds,
    intentionalAdvancedHolds,
    discoveryFreezeEligible:
      CLOCK_DISCOVERY_GATE_POLICY.discoveryFreezeEligible && unresolvedSourceBackedHolds.length === 0,
  } as const;
}
