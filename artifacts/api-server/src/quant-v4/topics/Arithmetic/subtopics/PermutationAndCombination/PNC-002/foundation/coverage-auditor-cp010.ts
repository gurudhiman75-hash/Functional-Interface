import { getPnc002QuestionEntries } from "./library";
import { runPnc002Pipeline } from "./pipeline";
import type { Pnc002CoverageAudit } from "./types";

function increment(target: Record<string, number>, key: string): void { target[key] = (target[key] ?? 0) + 1; }

export function auditPnc002Cp010Coverage(): Pnc002CoverageAudit {
  const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-010");
  const expectedQlIds = Array.from({ length: 29 }, (_, index) => `PNC-QL-${String(index + 177).padStart(3, "0")}`);
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
    const sample = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `cp010-coverage:${entry.qlId}` });
    if (!sample.validation.valid) invalidRuntimeSamples.push(`${entry.qlId}:${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
  }
  const exactDuplicateTemplateGroups = [...templateGroups.values()].filter((qlIds) => qlIds.length > 1);
  const passed = entries.length === expectedQlIds.length
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && invalidRuntimeSamples.length === 0;
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
