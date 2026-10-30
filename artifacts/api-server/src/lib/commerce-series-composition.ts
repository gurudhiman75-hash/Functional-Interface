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
