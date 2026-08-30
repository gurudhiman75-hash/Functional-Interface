import {
  addPartnerRemuneration,
  allocateByEffectiveCapital,
  computeDistributablePool,
} from "./allocation-engine";
import { buildCapitalTimeline } from "./capital-timeline";
import { normalizeRatio } from "./math";
import {
  PRT_001_PACKAGE_ID,
  type PartnershipState,
  type Prt001Solution,
} from "./types";

export function solvePrt001State(state: PartnershipState): Prt001Solution {
  const timeline = buildCapitalTimeline(state);
  const pool = computeDistributablePool(state);
  const distributedShares = allocateByEffectiveCapital(
    pool.distributablePool,
    timeline.weights,
  );
  const finalPartnerReceipts = addPartnerRemuneration(
    distributedShares,
    pool.executions,
  );
  return {
    packageId: PRT_001_PACKAGE_ID,
    timeline,
    normalizedRatio: normalizeRatio(
      timeline.weights.map((item) => item.effectiveCapital),
    ),
    pool,
    distributedShares,
    finalPartnerReceipts,
  };
}
