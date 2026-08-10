import {
  CLOCK_CANDIDATE_DISPOSITION,
  type ClockCandidateDispositionRecord,
} from "./candidate-disposition";
import {
  CLOCK_SOURCE_AUDIT,
  type ClockSourceAuditRecord,
} from "./source-audit";
import type { ClockTaskId } from "./catalog";

const SOURCE_NATURAL_INTERCHANGE_AUDIT: ClockSourceAuditRecord = {
  evidenceLevel: "DIRECT_MULTI_SOURCE",
  evidenceRefs: ["RS_AGGARWAL_CLOCKS", "DISHA_SSC_CLOCKS"],
  flags: ["MERGE_SPLIT_REVIEW_REQUIRED"],
  note: "R.S. Aggarwal and Disha both directly source the elapsed-duration interchange rule: when the two hands exchange positions, their combined angular movement is 360 degrees, so (6 + 0.5)t = 360 and t = 720/13 minutes = 55 5/13 minutes. This is the source-natural learner authority; arbitrary denominator-143 exact time-pair reconstruction remains an advanced held variant.",
};

const SOURCE_NATURAL_INTERCHANGE_DISPOSITION: ClockCandidateDispositionRecord = {
  disposition: "PROVISIONAL_AUTHORITY_ANCHOR",
  cluster: "HAND_INTERCHANGE",
  rationale: "Promote only the directly multi-sourced elapsed-duration interchange authority. Exact pair reconstruction, reverse reconstruction and pair validation remain advanced held variants until stronger exam-frequency evidence exists.",
};

/**
 * Post-source-calibration effective governance.
 *
 * The original source-audit and merge/split tables remain immutable historical
 * records of the first pass. Generation and later freeze gates consume these
 * effective views so a source correction is explicit rather than silently
 * rewriting the audit trail.
 */
export const CLOCK_EFFECTIVE_SOURCE_AUDIT = {
  ...CLOCK_SOURCE_AUDIT,
  TIME_AFTER_HANDS_INTERCHANGED: SOURCE_NATURAL_INTERCHANGE_AUDIT,
} satisfies Record<ClockTaskId, ClockSourceAuditRecord>;

export const CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION = {
  ...CLOCK_CANDIDATE_DISPOSITION,
  TIME_AFTER_HANDS_INTERCHANGED: SOURCE_NATURAL_INTERCHANGE_DISPOSITION,
} satisfies Record<ClockTaskId, ClockCandidateDispositionRecord>;

export const CLOCK_EXAM_NATURAL_CALIBRATION_POLICY = {
  status: "POST_SOURCE_CALIBRATION_EFFECTIVE_GOVERNANCE",
  historicalAuditPreserved: true,
  calibratedTaskIds: ["TIME_AFTER_HANDS_INTERCHANGED"] as const,
  permanentQlAllocationAllowed: false,
  sourceSaturationComplete: false,
  humanEditorialFreezeComplete: false,
} as const;

export function effectiveClockAuthorityClusters(): readonly string[] {
  return [...new Set(
    Object.values(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION)
      .filter((value) => value.disposition === "PROVISIONAL_AUTHORITY_ANCHOR")
      .map((value) => value.cluster),
  )].sort();
}
