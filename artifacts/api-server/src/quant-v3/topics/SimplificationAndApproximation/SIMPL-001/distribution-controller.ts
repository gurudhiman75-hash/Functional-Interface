import { readSimpl001LibraryJson } from "./package-registry";
import type {
  DistributionTargetsLibrary,
  SimplCpId,
  SimplDifficultyBand,
} from "./types";

const DISTRIBUTION_TARGETS_LIBRARY =
  readSimpl001LibraryJson<DistributionTargetsLibrary>(
    "distribution-targets.library.json",
  );

export function getDistributionTargetsLibrary(): DistributionTargetsLibrary {
  return DISTRIBUTION_TARGETS_LIBRARY;
}

export function selectCpDistribution(cpId: SimplCpId): {
  targetShare: number;
  allocation: string;
} {
  const distribution = DISTRIBUTION_TARGETS_LIBRARY.canonicalProblems[cpId];
  if (!distribution) {
    throw new Error(`Unknown SIMPL-001 CP distribution id: ${cpId}`);
  }
  return distribution;
}

export function selectDifficultyDistribution(
  difficulty: SimplDifficultyBand,
): number {
  const share = DISTRIBUTION_TARGETS_LIBRARY.difficulty[difficulty];
  if (share === undefined) {
    throw new Error(`Unknown SIMPL-001 difficulty distribution: ${difficulty}`);
  }
  return share;
}
