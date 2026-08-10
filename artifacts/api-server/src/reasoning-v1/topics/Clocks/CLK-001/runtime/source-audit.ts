import { CLOCK_TASK_CATALOG, type ClockTaskId } from "./catalog";

export type ClockSourceEvidenceLevel =
  | "DIRECT_MULTI_SOURCE"
  | "DIRECT_SOURCE"
  | "ADJACENT_SOURCE"
  | "DESIGN_INCLUDED_SOURCE_SPARSE"
  | "INTERNAL_REVIEW_METADATA_ONLY";

export type ClockSourceAuditFlag =
  | "MERGE_SPLIT_REVIEW_REQUIRED"
  | "VALUE_POOL_CALIBRATION_REQUIRED"
  | "WORDING_REMODEL_REQUIRED"
  | "ADVANCED_LIMITED_USE"
  | "OWNERSHIP_BOUNDARY_REVIEW"
  | "DO_NOT_PROMOTE_TO_LEARNER_QL";

export interface ClockSourceAuditRecord {
  evidenceLevel: ClockSourceEvidenceLevel;
  evidenceRefs: readonly string[];
  flags: readonly ClockSourceAuditFlag[];
  note: string;
}

/**
 * Source-audit evidence identifiers. These are descriptive references to the
 * uploaded sources used during the audit, not frozen bibliographic authority.
 */
export const CLOCK_SOURCE_EVIDENCE = {
  RS_AGGARWAL_CLOCKS: "RS Aggarwal Reasoning / Quantitative Aptitude — Clocks section",
  REASONING_FOR_COMPETITIONS_CLOCK: "Reasoning for Competitions — Clock chapter",
  DISHA_SSC_CLOCKS: "Disha SSC Mathematics Guide — Clocks section",
  ARUN_SHARMA_CLOCKS: "Arun Sharma Quantitative Aptitude — clock examples",
  MIRROR_DESIGN: "MIR-001 end-to-end design — clock reflection ownership and geometry",
  CLK_V2_DESIGN: "CLK-001 master end-to-end design V2",
} as const;

type SourceEvidenceId = keyof typeof CLOCK_SOURCE_EVIDENCE;

function record(
  evidenceLevel: ClockSourceEvidenceLevel,
  evidenceRefs: readonly SourceEvidenceId[],
  note: string,
  flags: readonly ClockSourceAuditFlag[] = ["MERGE_SPLIT_REVIEW_REQUIRED"],
): ClockSourceAuditRecord {
  return { evidenceLevel, evidenceRefs, flags, note };
}

const MULTI = ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK", "DISHA_SSC_CLOCKS"] as const;
const RS_REASONING = ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK"] as const;
const FAULTY_MULTI = ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK", "ARUN_SHARMA_CLOCKS"] as const;
const DESIGN_ONLY = ["CLK_V2_DESIGN"] as const;

export const CLOCK_SOURCE_AUDIT = {
  HAND_HOUR_ROTATION: record("DIRECT_MULTI_SOURCE", MULTI, "Hand-rate and rotation calculations are explicitly taught and exemplified."),
  HAND_MINUTE_ROTATION: record("DIRECT_MULTI_SOURCE", MULTI, "Minute-hand rotation and 6° per minute are explicitly taught and used."),
  HAND_SECOND_ROTATION: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Second-hand rate and rotation are explicitly stated; retain but calibrate duration/value pools.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  HAND_DURATION_FROM_ANGLE: record("ADJACENT_SOURCE", MULTI, "Inverse of directly sourced hand-rate movement; no distinct learner authority should be assumed yet."),
  HAND_REVOLUTIONS: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Source explicitly states rounds completed by hour, minute and second hands."),
  MINUTE_SPACES_TO_ANGLE: record("DIRECT_MULTI_SOURCE", MULTI, "Minute-space method is a standard source technique."),
  HAND_TIP_DISTANCE: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "V2 permits hand-tip distance only when clock motion is the tested context; direct clock-source example not found in this pass.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  COMPARE_HAND_MOTION: record("ADJACENT_SOURCE", MULTI, "Relative hand speeds are directly sourced; explicit compare-output task is adjacent rather than independently sourced."),

  SMALLER_ANGLE_AT_TIME: record("DIRECT_MULTI_SOURCE", MULTI, "Core clock-angle form appears throughout the uploaded clock material."),
  REFLEX_ANGLE_AT_TIME: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Sources include non-smaller directed/reflex-style angle outputs; wording must specify the requested arc."),
  DIRECTED_CLOCKWISE_SEPARATION: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Direction-aware hand separation follows sourced hand-position arithmetic but direct exam frequency is not yet established.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  ANGLE_AT_TIME_WITH_SECONDS: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Source explicitly carries seconds in hand-movement calculations; stated-time angle with seconds is supported but should use exam-natural values.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  ANGLE_AFTER_BEFORE_SHIFT: record("ADJACENT_SOURCE", MULTI, "Time-shifted angle is a composition of directly sourced stated-time angle arithmetic."),
  CLASSIFY_HAND_RELATION: record("DIRECT_MULTI_SOURCE", MULTI, "Coincident, opposite, right-angle and straight-line relations are core sourced concepts."),
  COMPARE_ANGLES_AT_TWO_TIMES: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Uploaded material includes comparison/percentage-change of angles at two times."),
  ANGLE_INVOLVING_SECOND_HAND: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Second-hand kinematics are sourced, but direct second-hand angle questions were not established as a frequent exam family.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),

  ONE_TIME_FOR_ANGLE_IN_HOUR: record("DIRECT_MULTI_SOURCE", MULTI, "Standard between-H-and-H+1 angle-time form."),
  ALL_TIMES_FOR_ANGLE_IN_HOUR: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Universal-formula example explicitly returns both valid times for a target angle."),
  FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE: record("ADJACENT_SOURCE", MULTI, "Disambiguated first-root wording is a safe query variant of directly sourced angle-time problems."),
  NEXT_PREVIOUS_ANGLE_EVENT: record("ADJACENT_SOURCE", MULTI, "Recurrence supports next/previous variants, but distinct source frequency is not yet established."),
  EXACT_FRACTIONAL_MINUTE_EVENT: record("DIRECT_MULTI_SOURCE", MULTI, "Mixed-fraction minute answers are standard in source material."),
  ROUNDED_ANGLE_EVENT: record("DIRECT_SOURCE", ["DISHA_SSC_CLOCKS"], "Source converts exact fractional minutes to minute-second form/rounded seconds."),
  COUNT_SOLUTIONS_IN_HOUR: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Two-branch structure is sourced; asking only the number of valid roots is an adjacent query variant."),
  RECOVER_ANGLE_FROM_CANDIDATE_TIMES: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "No direct uploaded-source example found in this pass.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),

  COINCIDENCE_IN_HOUR: record("DIRECT_MULTI_SOURCE", MULTI, "Core sourced form."),
  OPPOSITION_IN_HOUR: record("DIRECT_MULTI_SOURCE", MULTI, "Core sourced form."),
  RIGHT_ANGLE_TIMES_IN_HOUR: record("DIRECT_MULTI_SOURCE", MULTI, "Core sourced form."),
  STRAIGHT_LINE_EVENT: record("DIRECT_MULTI_SOURCE", MULTI, "Straight-line together/opposite forms are directly sourced."),
  GAP_BETWEEN_SPECIAL_EVENTS: record("ADJACENT_SOURCE", MULTI, "Event recurrence is sourced; explicit gap comparison is a derived query variant."),
  NEAREST_SPECIAL_EVENT: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "No direct nearest-event problem found in the current source pass.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  EVENT_ORDER_IN_HOUR: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Event ordering is mathematically valid but direct exam evidence is sparse.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  CLASSIFY_EVENT_FROM_TIME: record("ADJACENT_SOURCE", MULTI, "Inverse classification of directly sourced special-event positions."),

  COUNT_COINCIDENCES: record("DIRECT_MULTI_SOURCE", MULTI, "Explicit 12/24-hour count questions appear in sources."),
  COUNT_OPPOSITIONS: record("DIRECT_MULTI_SOURCE", MULTI, "Explicit daily opposition counts appear in sources."),
  COUNT_RIGHT_ANGLES: record("DIRECT_MULTI_SOURCE", MULTI, "Explicit daily right-angle counts appear in sources."),
  COUNT_STRAIGHT_LINE: record("DIRECT_MULTI_SOURCE", MULTI, "Explicit straight-line counts appear in sources."),
  COUNT_ARBITRARY_ANGLE: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Arbitrary-angle roots are sourced; counting them over intervals is an adjacent form."),
  COUNT_PARTIAL_INTERVAL: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Source includes right-angle count over a stated partial time interval."),
  NTH_OCCURRENCE: record("ADJACENT_SOURCE", MULTI, "Recurrence is sourced; nth occurrence is an inverse/ordering variant."),
  ELAPSED_FOR_EVENT_COUNT: record("ADJACENT_SOURCE", MULTI, "Recurrence interval supports this form; keep pending merge/split review."),
  COUNT_WITH_ENDPOINTS: record("ADJACENT_SOURCE", ["CLK_V2_DESIGN"], "V2 requires explicit endpoint semantics; this is primarily a correctness boundary variant."),
  COMPARE_EVENT_FREQUENCIES: record("ADJACENT_SOURCE", MULTI, "Standard event counts support comparison, but separate learner authority is not yet justified."),

  DISPLAYED_FROM_ACTUAL_ELAPSED: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "Classic gain/loss forward-time problem."),
  ACTUAL_FROM_DISPLAYED_ELAPSED: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "Classic true-time-from-indicated-time problem."),
  ERROR_AFTER_ACTUAL_DURATION: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "Direct unitary gain/loss calculation."),
  ACTUAL_DURATION_FROM_READING_CHANGE: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Sources solve actual duration from a faulty reading/rate relationship."),
  CLASSIFY_FAST_SLOW: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "Fast/slow classification is explicit in ordinary and coincidence-based faulty-clock material."),
  CONVERT_GAIN_LOSS_RATE: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Sources convert gain per day/hour and percentage rate."),
  INITIAL_OFFSET_CORRECT_RATE: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Sources include clocks initially slow/fast and later correct."),
  INITIAL_OFFSET_AND_WRONG_RATE: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Uniformly gaining clock observed slow then fast is a direct source form."),

  DERIVE_RATE_FROM_OBSERVATIONS: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Two observations are used to infer a uniform gain rate."),
  DERIVE_SET_RIGHT_TIME: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Direct source form asks when a uniformly gaining watch was correct."),
  MULTIDAY_ACTUAL_FROM_DISPLAY: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "Multi-day indicated-to-actual conversion appears directly."),
  MULTIDAY_DISPLAY_FROM_ACTUAL: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Multi-day actual-to-display forward conversion is represented in source problems."),
  TIME_WHEN_ERROR_REACHES_TARGET: record("ADJACENT_SOURCE", FAULTY_MULTI, "Target-error timing is a natural inverse of sourced gain/loss and next-correct problems."),
  NEXT_CORRECT_READING: record("DIRECT_MULTI_SOURCE", FAULTY_MULTI, "When the watch is/was correct is a standard source form."),
  COMPARE_TWO_FAULTY_CLOCKS: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Source includes two clocks gaining/losing at different rates."),
  GAINING_AND_LOSING_EQUALITY: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Two-clock comparison is sourced; exact equality time is an adjacent inverse."),
  PIECEWISE_RATE: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "V2 permits explicitly stated piecewise rates, but no direct constant-segment exam example was established in this pass.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "WORDING_REMODEL_REQUIRED"]),
  MISSING_GAIN_LOSS_FROM_FINAL: record("ADJACENT_SOURCE", FAULTY_MULTI, "Recovering the missing uniform error from final reading is the inverse of directly sourced forms."),

  GAIN_FROM_COINCIDENCE_INTERVAL: record("DIRECT_MULTI_SOURCE", ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK", "ARUN_SHARMA_CLOCKS"], "Direct source question: hands coincide every 64 minutes; infer daily gain.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED", "WORDING_REMODEL_REQUIRED"]),
  LOSS_FROM_COINCIDENCE_INTERVAL: record("DIRECT_SOURCE", ["ARUN_SHARMA_CLOCKS"], "Direct source uses a longer-than-normal coincidence interval to infer loss.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED", "WORDING_REMODEL_REQUIRED"]),
  COINCIDENCE_INTERVAL_FROM_RATE: record("ADJACENT_SOURCE", ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK"], "Inverse of a directly sourced coincidence-interval gain/loss problem; current generated fractions need calibration.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED", "WORDING_REMODEL_REQUIRED"]),
  CLASSIFY_FROM_EVENT_INTERVAL: record("DIRECT_MULTI_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK", "DISHA_SSC_CLOCKS", "ARUN_SHARMA_CLOCKS"], "Sources explicitly state shorter recurrence means fast and longer recurrence means slow.", ["MERGE_SPLIT_REVIEW_REQUIRED", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "No direct uploaded-source example found for inferring rate from right-angle/opposition recurrence.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED", "WORDING_REMODEL_REQUIRED"]),
  ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "No direct uploaded-source example found for nth displayed hand event on a faulty clock.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED", "WORDING_REMODEL_REQUIRED"]),

  DURATION_FOR_N_STRIKES: record("DIRECT_MULTI_SOURCE", RS_REASONING, "Classic n strikes → n−1 gaps form."),
  GAP_FROM_N_STRIKES: record("DIRECT_MULTI_SOURCE", RS_REASONING, "Inverse gap-from-total-strike-duration form is standard."),
  TRANSFER_STRIKE_COUNT: record("DIRECT_MULTI_SOURCE", RS_REASONING, "Direct source form transfers duration from one strike count to another."),
  STRIKES_IN_DURATION: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Direct source asks strike count in a longer stated duration."),
  FIRST_LAST_INCLUSION: record("ADJACENT_SOURCE", RS_REASONING, "Endpoint wording is the core n−1 gap correctness boundary rather than a clearly separate source family."),
  COMPARE_STRIKING_SPEEDS: record("ADJACENT_SOURCE", RS_REASONING, "Comparison follows directly from sourced gap inference but distinct source frequency is not established."),

  TOTAL_STRIKES_12_HOURS: record("ADJACENT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Daily total is directly sourced; 12-hour total is its immediate half-cycle form."),
  TOTAL_STRIKES_24_HOURS: record("DIRECT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Explicit daily total-strikes question appears in source material."),
  TOTAL_STRIKES_INCLUSIVE_RANGE: record("ADJACENT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Hourly schedule is sourced; arbitrary inclusive range is a natural interval variant."),
  INFER_RANGE_OR_HOUR_FROM_TOTAL: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Reverse range/hour inference was not directly found in current source pass.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  CUSTOM_HOUR_STRIKE_SCHEDULE: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Standard 1-to-12 schedule is sourced; non-standard custom schedules need direct evidence before promotion.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  HOURLY_AND_HALF_HOUR_CHIME: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Explicitly allowed by V2 when defined, but direct source frequency is not yet established.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),

  MIRROR_FROM_ACTUAL: record("DIRECT_MULTI_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK", "MIRROR_DESIGN"], "Mirror-time arithmetic is directly taught and geometry-owned."),
  ACTUAL_FROM_MIRROR: record("DIRECT_MULTI_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK", "MIRROR_DESIGN"], "Inverse mirror-time arithmetic is directly taught."),
  MIRROR_AROUND_12_BOUNDARY: record("DIRECT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK"], "Source explicitly distinguishes borrowing/boundary cases around 11–12."),
  ACTUAL_FROM_TEXTUAL_MIRROR: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK", "MIRROR_DESIGN"], "Textual mirror reading is a renderer/query variant of sourced mirror arithmetic."),
  MIRROR_BOUNDARY_CASES: record("ADJACENT_SOURCE", ["REASONING_FOR_COMPETITIONS_CLOCK", "MIRROR_DESIGN"], "Boundary handling is sourced as a validity rule; likely merge with mirror arithmetic authority."),
  MIRROR_GEOMETRIC_VERIFICATION: record("INTERNAL_REVIEW_METADATA_ONLY", ["CLK_V2_DESIGN", "MIRROR_DESIGN"], "V2 requires geometry as verification metadata, not as a separate learner authority.", ["DO_NOT_PROMOTE_TO_LEARNER_QL", "OWNERSHIP_BOUNDARY_REVIEW"]),

  READ_TIME_FROM_DIAGRAM: record("ADJACENT_SOURCE", ["CLK_V2_DESIGN"], "Analog diagrams are pervasive representations, but this pass did not isolate a distinct read-time exam family.", ["MERGE_SPLIT_REVIEW_REQUIRED", "OWNERSHIP_BOUNDARY_REVIEW"]),
  SELECT_DIAGRAM_FOR_TIME: record("ADJACENT_SOURCE", ["CLK_V2_DESIGN"], "Normal clock-diagram selection is allowed in CLK-001; reflected-clock selection remains MIR-001.", ["MERGE_SPLIT_REVIEW_REQUIRED", "OWNERSHIP_BOUNDARY_REVIEW"]),
  READ_ANGLE_TYPE_FROM_DIAGRAM: record("ADJACENT_SOURCE", MULTI, "Special hand relations are sourced; diagram rendering is a representation variant."),
  IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM: record("ADJACENT_SOURCE", MULTI, "Angle semantics are sourced; diagram form is a renderer variant."),
  COMPLETE_PARTIAL_DIAL: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "V2 includes partial dials after readability validation; direct source example not found.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),
  DIAGNOSE_IMPOSSIBLE_HAND_PLACEMENT: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Useful validity concept, but direct learner-question evidence is sparse.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE"]),

  TIME_AFTER_HANDS_INTERCHANGED: record("DIRECT_SOURCE", ["DISHA_SSC_CLOCKS"], "Hand-interchange appears as an explicit guidebook illustration.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  ORIGINAL_FROM_INTERCHANGED: record("ADJACENT_SOURCE", ["DISHA_SSC_CLOCKS"], "Inverse of a sourced interchange motif; current exact denominator-143 presentation is not exam-natural.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  VALIDATE_PROPOSED_INTERCHANGE: record("ADJACENT_SOURCE", ["DISHA_SSC_CLOCKS"], "Validation is a correctness-oriented inverse variant rather than a separately established exam family.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  FIND_INTERCHANGE_TIME_PAIR: record("ADJACENT_SOURCE", ["DISHA_SSC_CLOCKS"], "Pair selection follows the sourced interchange motif but requires substantial value/format calibration.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),

  ANGLE_ON_FAULTY_CLOCK_AT_ACTUAL_TIME: record("ADJACENT_SOURCE", FAULTY_MULTI, "Composition of sourced faulty-clock conversion and sourced angle-at-time arithmetic.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  ACTUAL_TIME_OF_FAULTY_HAND_EVENT: record("ADJACENT_SOURCE", ["RS_AGGARWAL_CLOCKS", "REASONING_FOR_COMPETITIONS_CLOCK"], "Combines sourced hand events with sourced faulty-clock mapping; direct mixed example not established.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  MIRROR_READING_OF_FAULTY_CLOCK: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "V2 permits synthesis, but no direct faulty-plus-mirror source example found.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  STRIKE_EVENT_UNDER_RATE_ERROR: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "No direct source example found combining strike timing with rate error.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "VALUE_POOL_CALIBRATION_REQUIRED"]),
  OFFSET_PLUS_RATE_CORRECTION: record("ADJACENT_SOURCE", ["RS_AGGARWAL_CLOCKS"], "Initial offset plus uniform rate is represented by sourced slow/fast-to-correct problems."),
  TEXT_DIAGRAM_SYNTHESIS: record("DESIGN_INCLUDED_SOURCE_SPARSE", DESIGN_ONLY, "Renderer synthesis is design-approved but direct source frequency is not established.", ["MERGE_SPLIT_REVIEW_REQUIRED", "ADVANCED_LIMITED_USE", "OWNERSHIP_BOUNDARY_REVIEW"]),
} satisfies Record<ClockTaskId, ClockSourceAuditRecord>;

export const CLOCK_SOURCE_AUDIT_POLICY = {
  status: "PROVISIONAL_SOURCE_FREQUENCY_AUDIT",
  permanentQlAllocationAllowed: false,
  rowCountHasProductMeaning: false,
  sourceSaturationComplete: false,
  humanEditorialFreezeComplete: false,
} as const;

export function clockSourceAuditSummary(): Readonly<Record<ClockSourceEvidenceLevel, number>> {
  const summary: Record<ClockSourceEvidenceLevel, number> = {
    DIRECT_MULTI_SOURCE: 0,
    DIRECT_SOURCE: 0,
    ADJACENT_SOURCE: 0,
    DESIGN_INCLUDED_SOURCE_SPARSE: 0,
    INTERNAL_REVIEW_METADATA_ONLY: 0,
  };
  for (const [taskId] of CLOCK_TASK_CATALOG) {
    summary[CLOCK_SOURCE_AUDIT[taskId].evidenceLevel] += 1;
  }
  return summary;
}
