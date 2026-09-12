export type SelectedAffairsProcessingState = {
  reviewEventPresent: boolean;
  eventStatus: string | null;
  verifiedFactCount: number;
  openConflictCount: number;
  officialEvidenceCount: number;
  supportedOfficialEvidenceCount: number;
  enrichmentFailureCount: number;
  authoringStatus: string | null;
  hindiStatus: string | null;
  punjabiStatus: string | null;
};

export type SelectedAffairsProcessingBlocker =
  | "review_event_missing"
  | "official_evidence_missing"
  | "official_source_not_automatically_supported"
  | "primary_enrichment_failed"
  | "fact_conflict"
  | "verification_required"
  | "verified_facts_missing"
  | "english_needs_editorial"
  | "hindi_needs_editorial"
  | "punjabi_needs_editorial";

export function isSelectedProcessingReadyStatus(value: string | null | undefined) {
  return ["ready", "manual", "approved"].includes(String(value ?? ""));
}

export function selectedAffairsProcessingBlockers(
  state: SelectedAffairsProcessingState,
): SelectedAffairsProcessingBlocker[] {
  if (!state.reviewEventPresent) return ["review_event_missing"];

  const blockers: SelectedAffairsProcessingBlocker[] = [];
  const verified = state.eventStatus === "verified";

  if (!verified) {
    if (state.officialEvidenceCount === 0) blockers.push("official_evidence_missing");
    else if (state.supportedOfficialEvidenceCount === 0) blockers.push("official_source_not_automatically_supported");
    else if (state.enrichmentFailureCount > 0) blockers.push("primary_enrichment_failed");
  }

  if (state.openConflictCount > 0) blockers.push("fact_conflict");
  if (!verified) blockers.push("verification_required");
  if (verified && state.verifiedFactCount <= 0) blockers.push("verified_facts_missing");

  if (verified && state.openConflictCount === 0 && !isSelectedProcessingReadyStatus(state.authoringStatus)) {
    blockers.push("english_needs_editorial");
  }

  if (verified && state.openConflictCount === 0 && isSelectedProcessingReadyStatus(state.authoringStatus)) {
    if (!isSelectedProcessingReadyStatus(state.hindiStatus)) blockers.push("hindi_needs_editorial");
    if (!isSelectedProcessingReadyStatus(state.punjabiStatus)) blockers.push("punjabi_needs_editorial");
  }

  return [...new Set(blockers)];
}

export function selectedAffairsProcessingStage(
  state: SelectedAffairsProcessingState,
) {
  const blockers = selectedAffairsProcessingBlockers(state);
  if (blockers.length === 0) return "ready" as const;
  if (blockers.includes("review_event_missing")) return "event_linking" as const;
  if (blockers.some((item) => [
    "official_evidence_missing",
    "official_source_not_automatically_supported",
    "primary_enrichment_failed",
    "fact_conflict",
    "verification_required",
    "verified_facts_missing",
  ].includes(item))) return "verification" as const;
  if (blockers.includes("english_needs_editorial")) return "english" as const;
  return "localization" as const;
}

export const SELECTED_AFFAIRS_PROCESSING_VERSION = "cp053-process-selected-v1";
