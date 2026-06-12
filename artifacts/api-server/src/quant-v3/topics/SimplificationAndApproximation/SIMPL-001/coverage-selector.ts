import { readSimpl001LibraryJson } from "./package-registry";
import type { SimplCpId } from "./types";
import type { CoverageTargetsLibrary } from "./types";

const COVERAGE_TARGETS_LIBRARY = readSimpl001LibraryJson<CoverageTargetsLibrary>(
  "coverage-targets.library.json",
);

export function getCoverageTargetsLibrary(): CoverageTargetsLibrary {
  return COVERAGE_TARGETS_LIBRARY;
}

export function selectCoverageTarget(targetName: string): unknown {
  const target = COVERAGE_TARGETS_LIBRARY.targets[targetName];
  if (target === undefined) {
    throw new Error(`Unknown SIMPL-001 coverage target: ${targetName}`);
  }
  return target;
}

export function listCoverageTargetNames(): string[] {
  return Object.keys(COVERAGE_TARGETS_LIBRARY.targets);
}

const CP_COVERAGE_TARGET_BY_CP: Record<SimplCpId, string> = {
  "CP-001": "cp001Coverage",
  "CP-002": "cp002Coverage",
  "CP-003": "cp003Coverage",
  "CP-004": "cp004Coverage",
  "CP-005": "cp005Coverage",
  "CP-006": "cp006Coverage",
  "CP-007": "cp007Coverage",
};

export function getCoverageCategoriesForCp(cpId: SimplCpId): string[] {
  const targetName = CP_COVERAGE_TARGET_BY_CP[cpId];
  const target = selectCoverageTarget(targetName);
  if (
    !target ||
    typeof target !== "object" ||
    !("buckets" in target) ||
    !Array.isArray((target as { buckets: unknown }).buckets)
  ) {
    throw new Error(`SIMPL-001 coverage target ${targetName} has no buckets.`);
  }
  return (target as { buckets: string[] }).buckets;
}
