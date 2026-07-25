import { getPnc002QuestionEntries } from "./library";
import { runPnc002Pipeline } from "./pipeline";
import type { Pnc002CoverageAudit } from "./types";

function increment(target: Record<string, number>, key: string): void { target[key] = (target[key] ?? 0) + 1; }

export function auditPnc002Cp009Coverage(): Pnc002CoverageAudit {
  const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-009");
  const expectedQlIds = Array.from({ length: 29 }, (_, index) => `PNC-QL-${String(index + 148).padStart(3, "0")}`);
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
    const sample = runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `cp009-coverage:${entry.qlId}` });
    if (!sample.validation.valid) invalidRuntimeSamples.push(`${entry.qlId}:${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
  }
  const exactDuplicateTemplateGroups = [...templateGroups.values()].filter((qlIds) => qlIds.length > 1);
  const expectedDifficultyCounts = { Easy: 5, Medium: 14, Hard: 10 };
  const expectedSolveModeCounts = {
    countWithCompulsoryMembers: 2,
    countWithExcludedMembers: 2,
    countWithCompulsoryAndExcludedMembers: 1,
    countExactlyFromTwoCategories: 2,
    countAtLeastFromTwoCategories: 2,
    countAtMostFromTwoCategories: 1,
    countAtLeastOneFromCategory: 1,
    countAtLeastOneFromEachOfTwoCategories: 1,
    countExactThreeCategoryDistribution: 1,
    countAtLeastOneFromEachOfThreeCategories: 1,
    countExactlyTSpecifiedMembers: 2,
    countAtLeastOneSpecifiedMember: 1,
    countNotAllSpecifiedMembersTogether: 1,
    countAllOrNoneSpecifiedMembers: 1,
    countImplicationBetweenSpecifiedMembers: 1,
    countAtMostTSpecifiedMembers: 1,
    countNamedCompulsoryWithCategoryQuota: 1,
    countNamedExcludedWithCategoryQuota: 1,
    recoverConditionalSelectionParameter: 2,
    countSpecifiedMemberRange: 2,
    countTwoCategoryRange: 2,
  };
  const passed = entries.length === 29
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && invalidRuntimeSamples.length === 0
    && JSON.stringify(difficultyCounts) === JSON.stringify(expectedDifficultyCounts)
    && JSON.stringify(solveModeCounts) === JSON.stringify(expectedSolveModeCounts);
  return { passed, activeQlCount: entries.length, expectedQlCount: 29, missingQlIds, duplicateQlIds, exactDuplicateTemplateGroups, difficultyCounts, solveModeCounts, invalidRuntimeSamples };
}
