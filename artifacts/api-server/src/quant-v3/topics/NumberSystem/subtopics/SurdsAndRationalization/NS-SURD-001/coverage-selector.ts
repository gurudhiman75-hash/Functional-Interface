import { readNsSurd001LibraryJson } from "./package-registry";
import type { CoverageTargetsLibrary, SurdCpId } from "./types";

const COVERAGE_TARGETS_LIBRARY =
  readNsSurd001LibraryJson<CoverageTargetsLibrary>(
    "coverage-targets.library.json",
  );

export function getCoverageCategoriesForCp(cpId: SurdCpId): string[] {
  const categories = COVERAGE_TARGETS_LIBRARY.cps[cpId];
  if (!categories || categories.length === 0) {
    throw new Error(`No NS-SURD-001 coverage categories are linked to CP id: ${cpId}`);
  }
  return [...categories];
}

export function buildMinimumCoveragePlan(): Record<SurdCpId, string[]> {
  return {
    CP01: getCoverageCategoriesForCp("CP01"),
    CP02: getCoverageCategoriesForCp("CP02"),
    CP03: getCoverageCategoriesForCp("CP03"),
    CP04: getCoverageCategoriesForCp("CP04"),
    CP05: getCoverageCategoriesForCp("CP05"),
    CP06: getCoverageCategoriesForCp("CP06"),
    CP07: getCoverageCategoriesForCp("CP07"),
    CP08: getCoverageCategoriesForCp("CP08"),
  };
}
