import { readNsSurd001LibraryJson } from "./package-registry";
import type { SurdCpId, VariableRangesLibrary } from "./types";

const VARIABLE_RANGES_LIBRARY =
  readNsSurd001LibraryJson<VariableRangesLibrary>(
    "variable-ranges.library.json",
  );

export function getVariableDomainsForCp(cpId: SurdCpId): string[] {
  const domains = VARIABLE_RANGES_LIBRARY.cps[cpId];
  if (!domains || domains.length === 0) {
    throw new Error(`No NS-SURD-001 variable domains are linked to CP id: ${cpId}`);
  }
  return [...domains];
}

export function sampleVariableDomain(cpId: SurdCpId, index = 0): string {
  const domains = getVariableDomainsForCp(cpId);
  return domains[Math.abs(index) % domains.length]!;
}
