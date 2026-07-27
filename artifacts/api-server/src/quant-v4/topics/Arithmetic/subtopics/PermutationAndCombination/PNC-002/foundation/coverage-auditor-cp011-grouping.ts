import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "./cp011-grouping-runtime";

export interface Cp011GroupingCoverageAudit {
  passed: boolean;
  activeQlCount: number;
  expectedQlCount: number;
  missingQlIds: string[];
  duplicateQlIds: string[];
  exactDuplicateTemplateGroups: string[][];
  difficultyCounts: Record<string, number>;
  solveModeCounts: Record<string, number>;
  invalidRuntimeSamples: string[];
}

function groupDuplicates(entries: { qlId: string; template: string }[]): string[][] {
  const byTemplate = new Map<string, string[]>();
  for (const entry of entries) {
    const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
    byTemplate.set(normalized, [...(byTemplate.get(normalized) ?? []), entry.qlId]);
  }
  return [...byTemplate.values()].filter((group) => group.length > 1);
}

export function auditCp011GroupingCoverage(): Cp011GroupingCoverageAudit {
  const entries = getCp011GroupingEntries();
  const expectedIds = Array.from({ length: 10 }, (_, index) => `PNC-QL-${String(209 + index).padStart(3, "0")}`);
  const actualIds = entries.map((entry) => entry.qlId);
  const missingQlIds = expectedIds.filter((qlId) => !actualIds.includes(qlId));
  const duplicateQlIds = actualIds.filter((qlId, index) => actualIds.indexOf(qlId) !== index);
  const exactDuplicateTemplateGroups = groupDuplicates(entries);
  const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [
    difficulty,
    entries.filter((entry) => entry.difficulty === difficulty).length,
  ]));
  const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((mode) => [
    mode,
    entries.filter((entry) => entry.solveMode === mode).length,
  ]));
  const invalidRuntimeSamples: string[] = [];
  for (const entry of entries) {
    for (let seedIndex = 0; seedIndex < 4; seedIndex += 1) {
      const generated = runPnc002Cp011GroupingPipeline({
        questionLanguageId: entry.qlId,
        seed: `cp011-grouping-audit:${entry.qlId}:${seedIndex}`,
      });
      if (!generated.validation.valid) {
        invalidRuntimeSamples.push(`${entry.qlId}:${seedIndex}:${generated.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
      }
    }
  }
  const passed = entries.length === 10
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && JSON.stringify(difficultyCounts) === JSON.stringify({ Easy: 1, Medium: 6, Hard: 3 })
    && Object.keys(solveModeCounts).length === 7
    && invalidRuntimeSamples.length === 0;
  return {
    passed,
    activeQlCount: entries.length,
    expectedQlCount: 10,
    missingQlIds,
    duplicateQlIds,
    exactDuplicateTemplateGroups,
    difficultyCounts,
    solveModeCounts,
    invalidRuntimeSamples,
  };
}
