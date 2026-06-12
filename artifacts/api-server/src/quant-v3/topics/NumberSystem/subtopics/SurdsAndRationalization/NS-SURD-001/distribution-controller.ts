import { readNsSurd001LibraryJson } from "./package-registry";
import type { DistributionTargetsLibrary, SurdCpId } from "./types";

const DISTRIBUTION_TARGETS_LIBRARY =
  readNsSurd001LibraryJson<DistributionTargetsLibrary>(
    "distribution-targets.library.json",
  );

export function getDistributionTargetForCp(
  cpId: SurdCpId,
): DistributionTargetsLibrary["cpAllocation"][SurdCpId] {
  const target = DISTRIBUTION_TARGETS_LIBRARY.cpAllocation[cpId];
  if (!target) {
    throw new Error(`No NS-SURD-001 distribution target is linked to CP id: ${cpId}`);
  }
  if (target.minimumAllocation < 1) {
    throw new Error(`NS-SURD-001 distribution target for ${cpId} has zero allocation`);
  }
  return target;
}

export function buildMinimumDistributionPlan(): Record<SurdCpId, number> {
  return {
    CP01: getDistributionTargetForCp("CP01").minimumAllocation,
    CP02: getDistributionTargetForCp("CP02").minimumAllocation,
    CP03: getDistributionTargetForCp("CP03").minimumAllocation,
    CP04: getDistributionTargetForCp("CP04").minimumAllocation,
    CP05: getDistributionTargetForCp("CP05").minimumAllocation,
    CP06: getDistributionTargetForCp("CP06").minimumAllocation,
    CP07: getDistributionTargetForCp("CP07").minimumAllocation,
    CP08: getDistributionTargetForCp("CP08").minimumAllocation,
  };
}
