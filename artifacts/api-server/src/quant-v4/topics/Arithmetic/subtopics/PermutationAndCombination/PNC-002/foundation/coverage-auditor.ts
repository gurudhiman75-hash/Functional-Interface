import { getPnc002QuestionEntries } from "./library";
import { runPnc002Pipeline } from "./pipeline";
import type { Pnc002CoverageAudit } from "./types";

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function auditPnc002Coverage(): Pnc002CoverageAudit {
  const entries = getPnc002QuestionEntries();
  const expectedQlIds = Array.from(
    { length: 18 },
    (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`,
  );
  const actualIds = entries.map((entry) => entry.qlId);
  const actualIdSet = new Set(actualIds);
  const missingQlIds = expectedQlIds.filter((qlId) => !actualIdSet.has(qlId));
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
    const sample = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `coverage:${entry.qlId}` });
    if (!sample.validation.valid) {
      const failed = sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",");
      invalidRuntimeSamples.push(`${entry.qlId}:${failed}`);
    }
  }

  const exactDuplicateTemplateGroups = [...templateGroups.values()].filter((qlIds) => qlIds.length > 1);
  const expectedDifficultyCounts = { Easy: 1, Medium: 8, Hard: 9 };
  const expectedSolveModeCounts = {
    countSingleBlockTogether: 2,
    countSingleBlockNotTogether: 2,
    countMultipleBlocksTogether: 4,
    countBlockWithExternalPairApart: 1,
    recoverBlockRestrictionParameter: 4,
    countTwoBlocksTogetherNotAdjacent: 2,
    countBlockWithOutsiderNotAdjacent: 1,
    countOneBlockTogetherOtherNotTogether: 1,
    countNotAllSpecifiedBlocksTogether: 1,
  };

  const passed = entries.length === expectedQlIds.length
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && invalidRuntimeSamples.length === 0
    && JSON.stringify(difficultyCounts) === JSON.stringify(expectedDifficultyCounts)
    && JSON.stringify(solveModeCounts) === JSON.stringify(expectedSolveModeCounts);

  return {
    passed,
    activeQlCount: entries.length,
    expectedQlCount: expectedQlIds.length,
    missingQlIds,
    duplicateQlIds,
    exactDuplicateTemplateGroups,
    difficultyCounts,
    solveModeCounts,
    invalidRuntimeSamples,
  };
}
