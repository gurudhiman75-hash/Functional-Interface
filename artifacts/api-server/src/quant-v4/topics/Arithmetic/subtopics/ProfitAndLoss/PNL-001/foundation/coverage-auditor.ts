export type CoverageEntry = Readonly<{
  id: string;
  solveMode: string;
  answerSemantic: string;
  direction: string;
  percentageBase?: string;
}>;

export type CoverageAudit = Readonly<{
  ok: boolean;
  duplicateIds: readonly string[];
  uncoveredRequiredModes: readonly string[];
}>;

export function auditCoverage(
  entries: readonly CoverageEntry[],
  requiredModes: readonly string[],
): CoverageAudit {
  const seen = new Set<string>();
  const duplicateIds = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) duplicateIds.add(entry.id);
    seen.add(entry.id);
  }
  const coveredModes = new Set(entries.map((entry) => entry.solveMode));
  const uncoveredRequiredModes = requiredModes.filter((mode) => !coveredModes.has(mode));
  return {
    ok: duplicateIds.size === 0 && uncoveredRequiredModes.length === 0,
    duplicateIds: [...duplicateIds],
    uncoveredRequiredModes,
  };
}
