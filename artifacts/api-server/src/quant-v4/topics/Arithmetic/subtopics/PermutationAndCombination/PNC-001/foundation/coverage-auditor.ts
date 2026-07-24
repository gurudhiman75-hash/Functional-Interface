import { getPnc001QuestionEntries } from "./library";
import { runPnc001Pipeline } from "./pipeline";

export interface Pnc001CoverageAudit {
  valid: boolean;
  qlCount: number;
  exactDuplicateTemplates: number;
  missingIds: string[];
  placeholderMismatches: string[];
  difficultyCounts: Record<string, number>;
  solveModeCounts: Record<string, number>;
  invalidRuntimeSamples: string[];
}

function placeholders(template: string): string[] {
  return [...new Set([...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))].sort();
}

function recordMatches(actual: Record<string, number>, snapshot: Record<string, number>): boolean {
  return Object.keys(actual).length === Object.keys(snapshot).length
    && Object.entries(snapshot).every(([key, count]) => actual[key] === count);
}

export function auditPnc001Coverage(): Pnc001CoverageAudit {
  const entries = getPnc001QuestionEntries();

  // Regression snapshot for the currently reviewed CP-001 checkpoint. This is
  // intentionally not a final package/family target.
  const checkpointIds = Array.from({ length: 48 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
  const actualIds = new Set(entries.map((entry) => entry.qlId));
  const missingIds = checkpointIds.filter((id) => !actualIds.has(id));
  const duplicateGroups = new Map<string, number>();
  const placeholderMismatches: string[] = [];
  const difficultyCounts: Record<string, number> = {};
  const solveModeCounts: Record<string, number> = {};
  const invalidRuntimeSamples: string[] = [];

  for (const entry of entries) {
    const normalized = entry.template.trim().replace(/\s+/g, " ").toLowerCase();
    duplicateGroups.set(normalized, (duplicateGroups.get(normalized) ?? 0) + 1);
    const found = placeholders(entry.template);
    const required = [...entry.requiredVariables].sort();
    if (JSON.stringify(found) !== JSON.stringify(required)) placeholderMismatches.push(entry.qlId);
    difficultyCounts[entry.difficulty] = (difficultyCounts[entry.difficulty] ?? 0) + 1;
    solveModeCounts[entry.solveMode] = (solveModeCounts[entry.solveMode] ?? 0) + 1;

    const sample = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed: `audit:${entry.qlId}` });
    if (!sample.validation.valid) invalidRuntimeSamples.push(entry.qlId);
  }

  const exactDuplicateTemplates = [...duplicateGroups.values()].filter((count) => count > 1).length;
  const observedDifficultySnapshot: Record<string, number> = { Easy: 22, Medium: 18, Hard: 8 };
  const observedSolveModeSnapshot: Record<string, number> = {
    countSequentialIndependentChoices: 14,
    countMutuallyExclusiveAlternatives: 10,
    countDisjointCasePartition: 10,
    countUsingSimpleComplement: 8,
    recoverMissingStageChoiceCount: 6,
  };
  const snapshotMatches = recordMatches(difficultyCounts, observedDifficultySnapshot)
    && recordMatches(solveModeCounts, observedSolveModeSnapshot);

  return {
    valid: entries.length === checkpointIds.length
      && actualIds.size === checkpointIds.length
      && missingIds.length === 0
      && exactDuplicateTemplates === 0
      && placeholderMismatches.length === 0
      && invalidRuntimeSamples.length === 0
      && snapshotMatches,
    qlCount: entries.length,
    exactDuplicateTemplates,
    missingIds,
    placeholderMismatches,
    difficultyCounts,
    solveModeCounts,
    invalidRuntimeSamples,
  };
}
