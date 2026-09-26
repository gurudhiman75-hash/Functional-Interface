import type { ClockTaskId } from "./catalog";
import { CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION } from "./exam-natural-governance";

export type ClockLocaleRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "NOT_FOR_CORE_LOCALISATION" | "INTERNAL_ONLY";

export interface ClockMultilingualClusterRisk {
  riskLevel: Exclude<ClockLocaleRiskLevel, "NOT_FOR_CORE_LOCALISATION" | "INTERNAL_ONLY">;
  terminology: readonly string[];
  risks: readonly string[];
  controls: readonly string[];
}

export const CLOCK_SHARED_TERMINOLOGY_AUTHORITY = [
  "clock/watch",
  "hour hand",
  "minute hand",
  "second hand",
  "smaller angle",
  "reflex angle",
  "clockwise",
  "anticlockwise",
  "coincide/overlap",
  "opposite direction",
  "right angle/perpendicular",
  "straight line",
  "gains",
  "loses",
  "fast clock",
  "slow clock",
  "correct time",
  "shown/displayed time",
  "actual time",
  "set right",
  "strike/chime",
  "mirror image",
  "past",
  "before",
  "after",
  "between",
  "inclusive",
  "exclusive",
] as const;

export const CLOCK_MULTILINGUAL_CLUSTER_RISK = {
  HAND_MOTION: {
    riskLevel: "LOW",
    terminology: ["hour hand", "minute hand", "second hand"],
    risks: ["Hand names translated inconsistently."],
    controls: ["Use one shared hand-name glossary across stem and explanation."],
  },
  DIAL_SPACE_CONVERSION: {
    riskLevel: "LOW",
    terminology: ["minute spaces", "angle"],
    risks: ["Minute-space wording may be translated literally and sound unnatural."],
    controls: ["Use exam-standard locale wording and keep numeric conversion language-neutral."],
  },
  ANGLE_AT_STATED_TIME: {
    riskLevel: "MEDIUM",
    terminology: ["smaller angle", "reflex angle", "clockwise", "anticlockwise"],
    risks: ["Reflex-angle terminology may be unfamiliar; directed angle wording may reverse direction."],
    controls: ["Freeze angle glossary before localisation; parity-check requested arc/direction metadata."],
  },
  HAND_RELATION_CLASSIFICATION: {
    riskLevel: "MEDIUM",
    terminology: ["coincide/overlap", "opposite direction", "right angle", "straight line"],
    risks: ["Hands are together may be mistranslated as physically joined rather than overlapping."],
    controls: ["Use approved relation terms and preserve semantic relation code across locales."],
  },
  TIME_FOR_ARBITRARY_ANGLE: {
    riskLevel: "MEDIUM",
    terminology: ["between", "after", "before", "first", "next", "previous"],
    risks: ["Root-order and endpoint meaning may shift in translation."],
    controls: ["Keep interval and root-order metadata language-neutral; human-review all boundary wording."],
  },
  SPECIAL_HAND_EVENT_TIME: {
    riskLevel: "MEDIUM",
    terminology: ["coincide", "opposite", "right angle", "between"],
    risks: ["Special-event relation or hour-window endpoint may become ambiguous."],
    controls: ["Render from typed event and interval contracts; never localise from free prose alone."],
  },
  SPECIAL_EVENT_RECURRENCE: {
    riskLevel: "MEDIUM",
    terminology: ["successive", "consecutive", "interval"],
    risks: ["Successive-event interval may be confused with count of events."],
    controls: ["Use duration answer metadata and explicit consecutive-event terminology."],
  },
  EVENT_COUNT_IN_INTERVAL: {
    riskLevel: "HIGH",
    terminology: ["from", "to", "including", "excluding", "between"],
    risks: ["Inclusive/exclusive endpoints can change the numerical answer."],
    controls: ["Endpoint policy remains typed metadata; locale review must explicitly approve both endpoints."],
  },
  EVENT_RECURRENCE_POSITION: {
    riskLevel: "HIGH",
    terminology: ["nth occurrence", "after", "from the anchor"],
    risks: ["Anchor event may accidentally be counted as the first post-anchor event."],
    controls: ["Preserve nth-index origin in metadata and require explicit locale wording review."],
  },
  UNIFORM_FAULTY_CLOCK_MAPPING: {
    riskLevel: "HIGH",
    terminology: ["fast clock", "slow clock", "actual time", "shown time"],
    risks: ["Fast/slow may be interpreted as mechanical speed rather than excess/deficit reading; actual and shown time may swap."],
    controls: ["Use approved faulty-clock glossary; preserve actual/displayed semantic roles in structured scenario fields."],
  },
  UNIFORM_GAIN_LOSS_ERROR: {
    riskLevel: "HIGH",
    terminology: ["gains", "loses", "per actual day", "error"],
    risks: ["Gain/loss direction or elapsed-time base may be mistranslated."],
    controls: ["Keep signed rate language-neutral; require human review of direction and period wording."],
  },
  INITIAL_OFFSET_CLOCK: {
    riskLevel: "HIGH",
    terminology: ["minutes fast", "minutes slow", "runs at correct rate"],
    risks: ["Initial offset can be confused with ongoing gain/loss rate."],
    controls: ["Localised stem must separately state initial reading error and subsequent rate behavior."],
  },
  INFER_FAULTY_CLOCK_MODEL: {
    riskLevel: "HIGH",
    terminology: ["set right", "actual time", "shown time", "gains", "loses"],
    risks: ["Observation roles or set-right time can be inverted by literal translation."],
    controls: ["Translate from typed observation roles and independently parity-check inferred rate/result."],
  },
  MULTIDAY_FAULTY_CLOCK: {
    riskLevel: "HIGH",
    terminology: ["day", "next day", "actual time", "shown time", "a.m./p.m."],
    risks: ["Day offset or AM/PM can disappear when rendered naturally."],
    controls: ["Day offset remains numeric metadata; verify visible day/AM-PM parity across locales."],
  },
  NEXT_CORRECT_READING: {
    riskLevel: "HIGH",
    terminology: ["next correct", "again", "strictly after"],
    risks: ["Next may accidentally include the current correct reading."],
    controls: ["Strict-future semantics remain typed and must appear explicitly in locale review."],
  },
  TWO_FAULTY_CLOCKS: {
    riskLevel: "HIGH",
    terminology: ["clock A", "clock B", "fast", "slow", "gains", "loses"],
    risks: ["Two independent clock states/rates may be crossed between sentences."],
    controls: ["Keep A/B structured fields; parity-check every rate, offset and query target."],
  },
  FAULT_FROM_COINCIDENCE_RECURRENCE: {
    riskLevel: "HIGH",
    terminology: ["successive displayed coincidences", "actual interval", "fast", "slow"],
    risks: ["Displayed event recurrence may be confused with actual elapsed recurrence."],
    controls: ["Preserve displayed-event versus actual-interval roles in metadata and explanation parity checks."],
  },
  STRIKE_GAP_MECHANICS: {
    riskLevel: "HIGH",
    terminology: ["strikes", "from first strike to last strike", "intervals"],
    risks: ["Translation can lose first-to-last semantics and recreate the n versus n−1 error."],
    controls: ["Approved wording must explicitly preserve n−1 interval meaning where total duration is stated."],
  },
  STANDARD_HOUR_STRIKE_TOTAL: {
    riskLevel: "MEDIUM",
    terminology: ["strikes", "at each hour", "including"],
    risks: ["Inclusive range or 12-to-1 cycle may be obscured."],
    controls: ["Keep range endpoints typed and use standard hour-strike terminology."],
  },
  VERTICAL_MIRROR_TIME: {
    riskLevel: "HIGH",
    terminology: ["mirror image", "actual time", "reflected reading"],
    risks: ["Mirror image may be confused with water image or with the physical displayed time."],
    controls: ["Use vertical-mirror terminology only; numeric water-time wording remains prohibited."],
  },
  CLOCK_DIAGRAM_TIME: {
    riskLevel: "MEDIUM",
    terminology: ["shown by the clock", "select the diagram"],
    risks: ["Visible prompt and alt text may diverge across locales."],
    controls: ["Diagram semantic key is shared; alt text requires locale parity review."],
  },
  CLOCK_DIAGRAM_ANGLE: {
    riskLevel: "MEDIUM",
    terminology: ["smaller angle", "reflex angle", "right angle"],
    risks: ["Arc terminology and alt text can disagree with the rendered diagram."],
    controls: ["Renderer state stays language-neutral; locale-specific alt text must be human-reviewed."],
  },
  HAND_INTERCHANGE: {
    riskLevel: "HIGH",
    terminology: ["hands are interchanged", "returns less than one hour later", "for how long"],
    risks: ["Interchanged may be read as the hands crossing or meeting rather than exchanging positions."],
    controls: ["Use approved exchange-position wording and preserve physical-validity constraint across locales."],
  },
} as const satisfies Record<string, ClockMultilingualClusterRisk>;

export interface ClockTaskMultilingualRiskRecord {
  taskId: ClockTaskId;
  cluster: string;
  riskLevel: ClockLocaleRiskLevel;
  reviewRequired: boolean;
}

export const CLOCK_MULTILINGUAL_RISK_AUDIT = Object.fromEntries(
  (Object.keys(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION) as ClockTaskId[]).map((taskId) => {
    const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
    if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
      return [taskId, { taskId, cluster: disposition.cluster, riskLevel: "INTERNAL_ONLY", reviewRequired: false }];
    }
    if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
      return [taskId, { taskId, cluster: disposition.cluster, riskLevel: "NOT_FOR_CORE_LOCALISATION", reviewRequired: false }];
    }
    const clusterRisk = CLOCK_MULTILINGUAL_CLUSTER_RISK[disposition.cluster as keyof typeof CLOCK_MULTILINGUAL_CLUSTER_RISK];
    if (!clusterRisk) throw new Error(`Missing multilingual-risk profile for effective cluster ${disposition.cluster}.`);
    return [taskId, { taskId, cluster: disposition.cluster, riskLevel: clusterRisk.riskLevel, reviewRequired: true }];
  }),
) as Record<ClockTaskId, ClockTaskMultilingualRiskRecord>;

export const CLOCK_MULTILINGUAL_RISK_POLICY = {
  status: "MULTILINGUAL_RISK_AUDIT_COMPLETE__LOCALISATION_BLOCKED",
  riskAuditComplete: true,
  mathematicsLanguageNeutral: true,
  westernArabicNumeralsPreferred: true,
  englishFreezeRequiredBeforeLocalisation: true,
  hindiGenerationAllowed: false,
  punjabiGenerationAllowed: false,
  humanReviewRequiredPerLocale: true,
  answerParityRequired: true,
  terminologyParityRequired: true,
  diagramAltTextParityRequired: true,
  permanentQlAllocationAllowed: false,
} as const;

export function clockMultilingualRiskSummary() {
  const records = Object.values(CLOCK_MULTILINGUAL_RISK_AUDIT);
  return {
    totalCandidateRows: records.length,
    coreRowsRequiringReview: records.filter((record) => record.reviewRequired).length,
    lowRiskCoreRows: records.filter((record) => record.riskLevel === "LOW").length,
    mediumRiskCoreRows: records.filter((record) => record.riskLevel === "MEDIUM").length,
    highRiskCoreRows: records.filter((record) => record.riskLevel === "HIGH").length,
    advancedHeldRows: records.filter((record) => record.riskLevel === "NOT_FOR_CORE_LOCALISATION").length,
    internalRows: records.filter((record) => record.riskLevel === "INTERNAL_ONLY").length,
  } as const;
}
