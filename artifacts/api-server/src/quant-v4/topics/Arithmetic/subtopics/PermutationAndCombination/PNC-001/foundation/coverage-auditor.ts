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
  const checkpointIds = Array.from({ length: 106 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
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
    solveModeCounts[String(entry.solveMode)] = (solveModeCounts[String(entry.solveMode)] ?? 0) + 1;
    const sample = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed: `audit:${entry.qlId}` });
    if (!sample.validation.valid) {
      const failed = sample.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(",");
      invalidRuntimeSamples.push(`${entry.qlId}:${failed}`);
    }
  }

  const exactDuplicateTemplates = [...duplicateGroups.values()].filter((count) => count > 1).length;
  const observedDifficultySnapshot: Record<string, number> = { Easy: 39, Medium: 45, Hard: 22 };
  const observedSolveModeSnapshot: Record<string, number> = {
    countSequentialIndependentChoices: 14,
    countMutuallyExclusiveAlternatives: 10,
    countDisjointCasePartition: 10,
    countUsingSimpleComplement: 8,
    recoverMissingStageChoiceCount: 6,
    evaluateFactorialValue: 2,
    evaluateFactorialUnitExpression: 2,
    simplifyFactorialQuotient: 3,
    recoverFactorialArgument: 2,
    recoverFactorialQuotientArgument: 1,
    arrangeAllDistinctObjects: 3,
    arrangeRFromNDistinctObjects: 3,
    recoverPermutationParameter: 2,
    selectRFromNDistinctObjects: 5,
    recoverCombinationParameter: 2,
    recoverComplementaryCombinationIndex: 1,
    formNumbersWithoutRepetitionNoZero: 1,
    formNumbersWithoutRepetitionWithZero: 1,
    formCodesWithRepetition: 1,
    formNumbersWithRepetitionAndZero: 1,
    formParityNumbersWithoutRepetition: 3,
    formDivisibleByFiveNumbersWithoutRepetition: 1,
    formNumbersAboveLeadingThreshold: 1,
    formAlphanumericCodes: 1,
    recoverSymbolCountForCode: 1,
    formCodesWithExactlyOnePair: 1,
    arrangeAllMultisetObjects: 4,
    arrangeMultisetAfterFixingPosition: 2,
    findMultisetOvercountFactor: 1,
    recoverMultisetMultiplicity: 1,
    findDictionaryRankOfWord: 2,
    selectThenAssignDistinctRoles: 4,
    selectThenArrangeAllSelected: 2,
    findRoleAssignmentMultiplier: 1,
    recoverSelectionRoleParameter: 3,
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
