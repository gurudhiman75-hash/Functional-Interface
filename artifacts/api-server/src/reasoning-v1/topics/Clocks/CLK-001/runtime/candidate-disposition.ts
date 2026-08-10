import type { ClockTaskId } from "./catalog";

export type ClockCandidateDisposition =
  | "PROVISIONAL_AUTHORITY_ANCHOR"
  | "MERGE_AS_QUERY_OR_RENDERER_VARIANT"
  | "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION"
  | "INTERNAL_VERIFICATION_ONLY";

export interface ClockCandidateDispositionRecord {
  disposition: ClockCandidateDisposition;
  cluster: string;
  rationale: string;
}

function anchor(cluster: string, rationale: string): ClockCandidateDispositionRecord {
  return { disposition: "PROVISIONAL_AUTHORITY_ANCHOR", cluster, rationale };
}
function merge(cluster: string, rationale: string): ClockCandidateDispositionRecord {
  return { disposition: "MERGE_AS_QUERY_OR_RENDERER_VARIANT", cluster, rationale };
}
function hold(cluster: string, rationale: string): ClockCandidateDispositionRecord {
  return { disposition: "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION", cluster, rationale };
}
function internal(cluster: string, rationale: string): ClockCandidateDispositionRecord {
  return { disposition: "INTERNAL_VERIFICATION_ONLY", cluster, rationale };
}

/**
 * Provisional merge/split disposition only. This is not a QL map and does not
 * freeze authority count. Source saturation and human editorial review may
 * still merge, split, reject or revive any learner candidate.
 */
export const CLOCK_CANDIDATE_DISPOSITION = {
  // CP-001 — hand motion foundation.
  HAND_HOUR_ROTATION: anchor("HAND_MOTION", "Representative direct hand-movement authority; hand type is a variable, not a separate learner concept."),
  HAND_MINUTE_ROTATION: merge("HAND_MOTION", "Same rate×time authority as hour-hand rotation with a different hand variable."),
  HAND_SECOND_ROTATION: merge("HAND_MOTION", "Second-hand motion is source-supported but belongs to the same hand-movement authority."),
  HAND_DURATION_FROM_ANGLE: merge("HAND_MOTION", "Inverse query of the same hand-rate relation."),
  HAND_REVOLUTIONS: merge("HAND_MOTION", "Revolutions are total angular movement divided by 360°, not a distinct conceptual authority."),
  MINUTE_SPACES_TO_ANGLE: anchor("DIAL_SPACE_CONVERSION", "Minute-space conversion is a standard exam method and useful standalone foundation."),
  HAND_TIP_DISTANCE: hold("HAND_TIP_DISTANCE", "Clock context is valid in V2, but direct source frequency remains sparse and mensuration ownership needs care."),
  COMPARE_HAND_MOTION: merge("HAND_MOTION", "Comparison uses the same hand-rate outputs and should be a query variant."),

  // CP-002 — angle at stated time.
  SMALLER_ANGLE_AT_TIME: anchor("ANGLE_AT_STATED_TIME", "Core exam authority for continuous hour-hand geometry."),
  REFLEX_ANGLE_AT_TIME: merge("ANGLE_AT_STATED_TIME", "Arc-selection variant of the same stated-time geometry."),
  DIRECTED_CLOCKWISE_SEPARATION: merge("ANGLE_AT_STATED_TIME", "Direction-specific output belongs to the same geometry authority; keep only if source frequency warrants exposure."),
  ANGLE_AT_TIME_WITH_SECONDS: merge("ANGLE_AT_STATED_TIME", "Seconds change the value pool, not the underlying hour-minute geometry."),
  ANGLE_AFTER_BEFORE_SHIFT: merge("ANGLE_AT_STATED_TIME", "Time-shift wrapper around the same angle authority."),
  CLASSIFY_HAND_RELATION: anchor("HAND_RELATION_CLASSIFICATION", "Special relations—coincident, opposite, right-angle, other—are repeatedly sourced."),
  COMPARE_ANGLES_AT_TWO_TIMES: merge("ANGLE_AT_STATED_TIME", "Comparison is a query wrapper over two ordinary angle solves."),
  ANGLE_INVOLVING_SECOND_HAND: hold("SECOND_HAND_ANGLE", "Second-hand rate is sourced, but direct second-hand angle question frequency is not yet strong enough for core promotion."),

  // CP-003 — time for angle.
  ONE_TIME_FOR_ANGLE_IN_HOUR: anchor("TIME_FOR_ARBITRARY_ANGLE", "Representative root-solving authority within an hour."),
  ALL_TIMES_FOR_ANGLE_IN_HOUR: merge("TIME_FOR_ARBITRARY_ANGLE", "Both-root query of the same ±θ equation."),
  FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE: merge("TIME_FOR_ARBITRARY_ANGLE", "Ordering constraint on the same root set."),
  NEXT_PREVIOUS_ANGLE_EVENT: merge("TIME_FOR_ARBITRARY_ANGLE", "Previous/next selection from the same recurrence/root authority."),
  EXACT_FRACTIONAL_MINUTE_EVENT: merge("TIME_FOR_ARBITRARY_ANGLE", "Exact fraction rendering is a value/output policy, not a new authority."),
  ROUNDED_ANGLE_EVENT: merge("TIME_FOR_ARBITRARY_ANGLE", "Requested rounding is a presentation variant after exact solving."),
  COUNT_SOLUTIONS_IN_HOUR: merge("TIME_FOR_ARBITRARY_ANGLE", "Counts the accepted root set rather than introducing a new equation."),
  RECOVER_ANGLE_FROM_CANDIDATE_TIMES: hold("INVERSE_ANGLE_FROM_CANDIDATES", "Direct source support is sparse; retain only as advanced discovery until confirmed."),

  // CP-004 — special events.
  COINCIDENCE_IN_HOUR: anchor("SPECIAL_HAND_EVENT_TIME", "Representative special-event time authority with event type parameter."),
  OPPOSITION_IN_HOUR: merge("SPECIAL_HAND_EVENT_TIME", "Opposition is another target phase under the same event engine."),
  RIGHT_ANGLE_TIMES_IN_HOUR: merge("SPECIAL_HAND_EVENT_TIME", "Right angle is another event target with two branches where applicable."),
  STRAIGHT_LINE_EVENT: merge("SPECIAL_HAND_EVENT_TIME", "Straight-line position is the union/classification of sourced special phases."),
  GAP_BETWEEN_SPECIAL_EVENTS: anchor("SPECIAL_EVENT_RECURRENCE", "Recurrence/gap is a distinct useful reasoning output from locating a single event."),
  NEAREST_SPECIAL_EVENT: hold("SPECIAL_EVENT_ORDERING", "Mathematically valid but current direct exam evidence is sparse."),
  EVENT_ORDER_IN_HOUR: hold("SPECIAL_EVENT_ORDERING", "Ordering multiple event types is advanced synthesis without strong direct source evidence."),
  CLASSIFY_EVENT_FROM_TIME: merge("HAND_RELATION_CLASSIFICATION", "Inverse query of the sourced hand-relation classification authority."),

  // CP-005 — counts and recurrence.
  COUNT_COINCIDENCES: anchor("EVENT_COUNT_IN_INTERVAL", "Representative event-count authority with explicit interval and endpoint policy."),
  COUNT_OPPOSITIONS: merge("EVENT_COUNT_IN_INTERVAL", "Event type is a parameter of the same interval-count authority."),
  COUNT_RIGHT_ANGLES: merge("EVENT_COUNT_IN_INTERVAL", "Event type is a parameter of the same interval-count authority."),
  COUNT_STRAIGHT_LINE: merge("EVENT_COUNT_IN_INTERVAL", "Event type is a parameter of the same interval-count authority."),
  COUNT_ARBITRARY_ANGLE: merge("EVENT_COUNT_IN_INTERVAL", "Target angle is a parameter of the same exact interval-count machinery."),
  COUNT_PARTIAL_INTERVAL: merge("EVENT_COUNT_IN_INTERVAL", "Partial interval is a boundary/value variant, directly evidenced in sources."),
  NTH_OCCURRENCE: anchor("EVENT_RECURRENCE_POSITION", "Nth occurrence uses event recurrence/order rather than merely counting a closed interval."),
  ELAPSED_FOR_EVENT_COUNT: merge("EVENT_RECURRENCE_POSITION", "Inverse query of nth occurrence/recurrence."),
  COUNT_WITH_ENDPOINTS: merge("EVENT_COUNT_IN_INTERVAL", "Endpoint policy must be explicit but is not a standalone learner concept."),
  COMPARE_EVENT_FREQUENCIES: merge("EVENT_COUNT_IN_INTERVAL", "Comparison is derived from two event counts/recurrences."),

  // CP-006 — basic uniform faulty clocks.
  DISPLAYED_FROM_ACTUAL_ELAPSED: anchor("UNIFORM_FAULTY_CLOCK_MAPPING", "Core forward actual→displayed mapping."),
  ACTUAL_FROM_DISPLAYED_ELAPSED: merge("UNIFORM_FAULTY_CLOCK_MAPPING", "Inverse of the same uniform affine mapping."),
  ERROR_AFTER_ACTUAL_DURATION: anchor("UNIFORM_GAIN_LOSS_ERROR", "Core gain/loss accumulation authority."),
  ACTUAL_DURATION_FROM_READING_CHANGE: merge("UNIFORM_GAIN_LOSS_ERROR", "Inverse unitary-rate query."),
  CLASSIFY_FAST_SLOW: merge("UNIFORM_GAIN_LOSS_ERROR", "Classification derives from the sign of the same rate error."),
  CONVERT_GAIN_LOSS_RATE: merge("UNIFORM_GAIN_LOSS_ERROR", "Unit conversion of the same rate."),
  INITIAL_OFFSET_CORRECT_RATE: anchor("INITIAL_OFFSET_CLOCK", "Initial offset with correct subsequent rate is a directly sourced offset authority."),
  INITIAL_OFFSET_AND_WRONG_RATE: merge("INITIAL_OFFSET_CLOCK", "Adds uniform rate error to the same offset model."),

  // CP-007 — inverse, multi-day, two-clock, piecewise.
  DERIVE_RATE_FROM_OBSERVATIONS: anchor("INFER_FAULTY_CLOCK_MODEL", "Two observations infer a uniform rate and/or offset."),
  DERIVE_SET_RIGHT_TIME: merge("INFER_FAULTY_CLOCK_MODEL", "Inverse query after inferring the same model."),
  MULTIDAY_ACTUAL_FROM_DISPLAY: anchor("MULTIDAY_FAULTY_CLOCK", "Representative multi-day inverse mapping with explicit day convention."),
  MULTIDAY_DISPLAY_FROM_ACTUAL: merge("MULTIDAY_FAULTY_CLOCK", "Forward direction of the same multi-day model."),
  TIME_WHEN_ERROR_REACHES_TARGET: merge("UNIFORM_GAIN_LOSS_ERROR", "Target-error time is an inverse of error accumulation."),
  NEXT_CORRECT_READING: anchor("NEXT_CORRECT_READING", "12-hour wrap and recurring correctness add a distinct modular condition."),
  COMPARE_TWO_FAULTY_CLOCKS: anchor("TWO_FAULTY_CLOCKS", "Directly sourced comparison of two rates/offsets."),
  GAINING_AND_LOSING_EQUALITY: merge("TWO_FAULTY_CLOCKS", "Equality time is an inverse of the same two-clock comparison model."),
  PIECEWISE_RATE: hold("PIECEWISE_FAULTY_CLOCK", "V2 permits it, but direct constant-segment source evidence remains sparse."),
  MISSING_GAIN_LOSS_FROM_FINAL: merge("INFER_FAULTY_CLOCK_MODEL", "Recovers the missing rate/error from observations under the same affine model."),

  // CP-008 — infer fault from hand-event recurrence.
  GAIN_FROM_COINCIDENCE_INTERVAL: anchor("FAULT_FROM_COINCIDENCE_RECURRENCE", "Direct multi-source form, including the standard 64-minute coincidence problem."),
  LOSS_FROM_COINCIDENCE_INTERVAL: merge("FAULT_FROM_COINCIDENCE_RECURRENCE", "Slow-clock counterpart of the same recurrence comparison."),
  COINCIDENCE_INTERVAL_FROM_RATE: merge("FAULT_FROM_COINCIDENCE_RECURRENCE", "Inverse query of the same recurrence/rate relation."),
  CLASSIFY_FROM_EVENT_INTERVAL: merge("FAULT_FROM_COINCIDENCE_RECURRENCE", "Fast/slow/correct classification from the same recurrence comparison."),
  RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE: hold("FAULT_FROM_OTHER_EVENT_RECURRENCE", "Design-valid extension, but direct source evidence is currently sparse."),
  ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT: hold("FAULTY_EVENT_SYNTHESIS", "Combines faulty mapping with event order; direct source frequency remains sparse."),

  // CP-009 — strike interval mechanics.
  DURATION_FOR_N_STRIKES: anchor("STRIKE_GAP_MECHANICS", "Core n strikes → n−1 gaps authority."),
  GAP_FROM_N_STRIKES: merge("STRIKE_GAP_MECHANICS", "Inverse of the same n−1 gap relation."),
  TRANSFER_STRIKE_COUNT: merge("STRIKE_GAP_MECHANICS", "Same recovered gap applied to a new strike count."),
  STRIKES_IN_DURATION: merge("STRIKE_GAP_MECHANICS", "Count query under the same equal-gap timeline."),
  FIRST_LAST_INCLUSION: merge("STRIKE_GAP_MECHANICS", "Boundary wording clarifies the n−1 model rather than creating a new concept."),
  COMPARE_STRIKING_SPEEDS: merge("STRIKE_GAP_MECHANICS", "Comparison is derived from inferred strike gaps."),

  // CP-010 — hour strike schedules.
  TOTAL_STRIKES_12_HOURS: merge("STANDARD_HOUR_STRIKE_TOTAL", "12-hour total is the half-cycle form of the standard 24-hour schedule."),
  TOTAL_STRIKES_24_HOURS: anchor("STANDARD_HOUR_STRIKE_TOTAL", "Directly sourced standard schedule total."),
  TOTAL_STRIKES_INCLUSIVE_RANGE: merge("STANDARD_HOUR_STRIKE_TOTAL", "Range restriction on the same standard hour-label schedule."),
  INFER_RANGE_OR_HOUR_FROM_TOTAL: hold("INVERSE_HOUR_STRIKE_TOTAL", "Reverse inference lacks strong direct evidence in the current source pass."),
  CUSTOM_HOUR_STRIKE_SCHEDULE: hold("CUSTOM_STRIKE_SCHEDULE", "Non-standard schedules require direct source evidence before learner promotion."),
  HOURLY_AND_HALF_HOUR_CHIME: hold("CUSTOM_STRIKE_SCHEDULE", "V2 permits explicitly defined schedules, but frequency is not yet established."),

  // CP-011 — mirror arithmetic.
  MIRROR_FROM_ACTUAL: anchor("VERTICAL_MIRROR_TIME", "Core numeric mirror-time authority."),
  ACTUAL_FROM_MIRROR: merge("VERTICAL_MIRROR_TIME", "Inverse of the same 12:00 complement relation."),
  MIRROR_AROUND_12_BOUNDARY: merge("VERTICAL_MIRROR_TIME", "Boundary handling/value pool of the same mirror arithmetic."),
  ACTUAL_FROM_TEXTUAL_MIRROR: merge("VERTICAL_MIRROR_TIME", "Textual reading is a presentation variant."),
  MIRROR_BOUNDARY_CASES: merge("VERTICAL_MIRROR_TIME", "Boundary corpus belongs to the same authority."),
  MIRROR_GEOMETRIC_VERIFICATION: internal("VERTICAL_MIRROR_TIME_VERIFICATION", "Geometry is required as independent verification metadata and must not become a learner QL."),

  // CP-012 — diagram literacy.
  READ_TIME_FROM_DIAGRAM: anchor("CLOCK_DIAGRAM_TIME", "Core normal-clock diagram interpretation."),
  SELECT_DIAGRAM_FOR_TIME: merge("CLOCK_DIAGRAM_TIME", "Inverse renderer/query variant of the same normal-clock representation."),
  READ_ANGLE_TYPE_FROM_DIAGRAM: anchor("CLOCK_DIAGRAM_ANGLE", "Visual relation/angle reading has a distinct learner interaction from reading time."),
  IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM: merge("CLOCK_DIAGRAM_ANGLE", "Arc-selection variant of diagram angle literacy."),
  COMPLETE_PARTIAL_DIAL: hold("PARTIAL_DIAL", "Design-included after readability validation but direct source frequency remains sparse."),
  DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT: hold("CLOCK_DIAGRAM_VALIDITY", "Useful verification idea but sparse as a direct learner question family."),

  // CP-013 — hand interchange.
  TIME_AFTER_HANDS_INTERCHANGED: hold("HAND_INTERCHANGE", "A hand-interchange motif is sourced, but the current exact-time-pair form with denominator-143 seconds is not yet exam-natural enough for core promotion."),
  ORIGINAL_FROM_INTERCHANGED: hold("HAND_INTERCHANGE", "Inverse of the same advanced motif; merge if the family survives source saturation."),
  VALIDATE_PROPOSED_INTERCHANGE: hold("HAND_INTERCHANGE", "Validation should remain an advanced query variant, not an independent authority."),
  FIND_INTERCHANGE_TIME_PAIR: hold("HAND_INTERCHANGE", "Pair selection is a renderer/query variant of the same advanced motif."),

  // CP-014 — mixed synthesis.
  ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME: hold("FAULTY_CLOCK_ANGLE_SYNTHESIS", "Composition is valid but direct mixed-source frequency is not yet established."),
  ACTUAL_TIME_OF_FAULTY_HAND_EVENT: hold("FAULTY_EVENT_SYNTHESIS", "Deep composition; hold until advanced source confirmation and value calibration."),
  MIRROR_READING_OF_FAULTY_CLOCK: hold("FAULTY_MIRROR_SYNTHESIS", "V2-valid synthesis with sparse direct source evidence."),
  STRIKE_EVENT_UNDER_RATE_ERROR: hold("FAULTY_STRIKE_SYNTHESIS", "V2-valid synthesis with sparse direct source evidence."),
  OFFSET_PLUS_RATE_CORRECTION: merge("INITIAL_OFFSET_CLOCK", "This is already represented by initial-offset plus wrong-rate faulty-clock authority, not a new mixed QL."),
  TEXT_DIAGRAM_SYNTHESIS: hold("TEXT_DIAGRAM_SYNTHESIS", "Design-approved synthesis, but direct exam frequency and ownership need confirmation."),
} satisfies Record<ClockTaskId, ClockCandidateDispositionRecord>;

export const CLOCK_MERGE_SPLIT_POLICY = {
  status: "PROVISIONAL_MERGE_SPLIT_AUDIT",
  permanentQlAllocationAllowed: false,
  authorityCountFrozen: false,
  sourceSaturationComplete: false,
  humanEditorialFreezeComplete: false,
} as const;

export function clockCandidateDispositionSummary(): Readonly<Record<ClockCandidateDisposition, number>> {
  const summary: Record<ClockCandidateDisposition, number> = {
    PROVISIONAL_AUTHORITY_ANCHOR: 0,
    MERGE_AS_QUERY_OR_RENDERER_VARIANT: 0,
    HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION: 0,
    INTERNAL_VERIFICATION_ONLY: 0,
  };
  for (const value of Object.values(CLOCK_CANDIDATE_DISPOSITION)) {
    summary[value.disposition] += 1;
  }
  return summary;
}

export function provisionalClockAuthorityClusters(): readonly string[] {
  return [...new Set(
    Object.values(CLOCK_CANDIDATE_DISPOSITION)
      .filter((value) => value.disposition === "PROVISIONAL_AUTHORITY_ANCHOR")
      .map((value) => value.cluster),
  )].sort();
}
