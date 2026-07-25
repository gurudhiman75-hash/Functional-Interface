import { getPnc002QuestionEntries } from "./library";
import { runPnc002Pipeline } from "./pipeline";
import type { Pnc002CoverageAudit } from "./types";

function increment(target: Record<string, number>, key: string): void { target[key] = (target[key] ?? 0) + 1; }

export function auditPnc002Cp008Coverage(): Pnc002CoverageAudit {
  const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-008");
  const expectedQlIds = Array.from({ length: 18 }, (_, index) => `PNC-QL-${String(index + 125).padStart(3, "0")}`);
  const actualIds = entries.map((entry) => entry.qlId);
  const missingQlIds = expectedQlIds.filter((qlId) => !actualIds.includes(qlId));
  const duplicateQlIds = [...new Set(actualIds.filter((qlId, index) => actualIds.indexOf(qlId) !== index))];
  const templateGroups = new Map<string, string[]>();
  const difficultyCounts: Record<string, number> = {};
  const solveModeCounts: Record<string, number> = {};
  const invalidRuntimeSamples: string[] = [];
  for (const entry of entries) {
    const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
    templateGroups.set(normalized, [...(templateGroups.get(normalized) ?? []), entry.qlId]);
    increment(difficultyCounts, entry.difficulty);
    increment(solveModeCounts, entry.solveMode);
    const sample = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `cp008-coverage:${entry.qlId}` });
    if (!sample.validation.valid) invalidRuntimeSamples.push(`${entry.qlId}:${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
  }
  const exactDuplicateTemplateGroups = [...templateGroups.values()].filter((qlIds) => qlIds.length > 1);
  const expectedDifficultyCounts = { Easy: 4, Medium: 8, Hard: 6 };
  const expectedSolveModeCounts = {
    countObjectAtExactPosition: 1,
    countObjectAtEitherEnd: 1,
    countSpecifiedObjectsAtBothEnds: 1,
    countObjectExcludedFromEnds: 1,
    countPrescribedRelativeOrder: 3,
    countIndependentRelativeOrderChains: 1,
    countStrictAlternation: 3,
    countNoTwoCategoryMembersAdjacent: 2,
    countExactGapBetweenPair: 1,
    countAtLeastGapBetweenPair: 1,
    countSpecifiedObjectsInPositionClass: 2,
    recoverPositionGapParameter: 1,
  };
  const passed = entries.length === 18
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && invalidRuntimeSamples.length === 0
    && JSON.stringify(difficultyCounts) === JSON.stringify(expectedDifficultyCounts)
    && JSON.stringify(solveModeCounts) === JSON.stringify(expectedSolveModeCounts);
  return { passed, activeQlCount: entries.length, expectedQlCount: 18, missingQlIds, duplicateQlIds, exactDuplicateTemplateGroups, difficultyCounts, solveModeCounts, invalidRuntimeSamples };
}
