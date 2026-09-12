export const SELECTED_APPROVAL_CENSUS_VERSION = "ca-cp070-selection-aware-approval-census-v1";

export type SelectedApprovalCensusInput = {
  broadCensus: null | {
    status: string;
    coverageConfidenceScore: number;
    blockers: string[];
    warnings: string[];
  };
  selectedHeadlineCount: number;
  resolvedSelectedHeadlineCount: number;
  liveSelectedEventIds: string[];
  storedPackEventIds: string[];
};

export type SelectedApprovalCensus = {
  version: typeof SELECTED_APPROVAL_CENSUS_VERSION;
  scope: "admin_selected";
  status: "complete" | "blocked";
  selectedHeadlineCount: number;
  resolvedSelectedHeadlineCount: number;
  selectedEventCount: number;
  storedPackEventCount: number;
  broadCensusStatus: string | null;
  broadCoverageConfidenceScore: number | null;
  broadCensusBlockerCount: number;
  blockers: string[];
  warnings: string[];
};

function normalizeIds(values: string[]) {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))].sort();
}

function sameIds(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function evaluateSelectedApprovalCensus(input: SelectedApprovalCensusInput): SelectedApprovalCensus {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const liveSelectedEventIds = normalizeIds(input.liveSelectedEventIds);
  const storedPackEventIds = normalizeIds(input.storedPackEventIds);

  if (!input.broadCensus) {
    blockers.push("The broad target-date discovery census has not been materialized.");
  } else {
    if (input.broadCensus.blockers.length > 0) {
      blockers.push(`The broad target-date discovery census has ${input.broadCensus.blockers.length} hard blocker(s); selection-aware approval cannot override discovery failures.`);
    }
    if (input.broadCensus.status !== "complete") {
      warnings.push(
        `Broad discovery monitoring remains ${input.broadCensus.status} at ${input.broadCensus.coverageConfidenceScore}%; unresolved unselected material remains visible for follow-up but does not block an otherwise closed admin-selected pack.`,
      );
    }
  }

  if (input.selectedHeadlineCount <= 0) {
    blockers.push("No manually selected headline exists for the target date.");
  }
  if (input.resolvedSelectedHeadlineCount !== input.selectedHeadlineCount) {
    blockers.push(
      `${Math.max(0, input.selectedHeadlineCount - input.resolvedSelectedHeadlineCount)} manually selected headline(s) do not resolve to an event.`,
    );
  }
  if (liveSelectedEventIds.length === 0) {
    blockers.push("The manually selected headline set does not resolve to any canonical event.");
  }
  if (!sameIds(liveSelectedEventIds, storedPackEventIds)) {
    blockers.push("The stored canonical pack membership is stale relative to the current manually selected headline set.");
  }

  return {
    version: SELECTED_APPROVAL_CENSUS_VERSION,
    scope: "admin_selected",
    status: blockers.length === 0 ? "complete" : "blocked",
    selectedHeadlineCount: input.selectedHeadlineCount,
    resolvedSelectedHeadlineCount: input.resolvedSelectedHeadlineCount,
    selectedEventCount: liveSelectedEventIds.length,
    storedPackEventCount: storedPackEventIds.length,
    broadCensusStatus: input.broadCensus?.status ?? null,
    broadCoverageConfidenceScore: input.broadCensus?.coverageConfidenceScore ?? null,
    broadCensusBlockerCount: input.broadCensus?.blockers.length ?? 0,
    blockers,
    warnings,
  };
}
