/** Pure package-member resolution shared by the canonical admin route and regression tests. */
export function composePackageTestIds(directTestIds: readonly string[], seriesTestGroups: readonly (readonly string[])[]): string[] {
  const output: string[] = [];
  const seen = new Set<string>();
  for (const id of [...directTestIds, ...seriesTestGroups.flat()]) {
    if (!seen.has(id)) { seen.add(id); output.push(id); }
  }
  return output;
}

export function snapshotSeriesComposition(directTestIds: readonly string[], seriesVersionIds: readonly string[]) {
  return { directTestIds: [...directTestIds], seriesVersionIds: [...seriesVersionIds] };
}

export interface SeriesSelectionState {
  archived: boolean;
  availabilityEndAt: string | Date | null;
  learnerVisibility: string | null;
  memberStatuses: readonly (string | null)[];
  missingOrArchivedMembers: number;
}
export function seriesSelectionBlockers(state: SeriesSelectionState, now: Date = new Date()): string[] {
  const blockers: string[] = [];
  if (state.archived) blockers.push("Series is archived");
  if (state.learnerVisibility && state.learnerVisibility !== "live") blockers.push("Series is not learner-visible");
  if (state.availabilityEndAt) {
    const end = new Date(state.availabilityEndAt);
    if (!Number.isFinite(end.getTime()) || end.getTime() <= now.getTime()) blockers.push("Series availability has ended");
  }
  if (!state.memberStatuses.length) blockers.push("Series has no tests");
  if (state.missingOrArchivedMembers > 0) blockers.push("Series contains unavailable or archived tests");
  if (state.memberStatuses.some(status => status !== null && !["live", "scheduled", "completed"].includes(status))) {
    blockers.push("Series contains tests that are not release-ready");
  }
  return blockers;
}
