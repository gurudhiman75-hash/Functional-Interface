import type { SeatingLifecycle } from "./types.ts";

/**
 * Historical discovery-layer lifecycle embedded in generated caselet evidence.
 * Keep this immutable so approved review fingerprints remain reproducible.
 * Permanent allocation/freeze state lives in ./permanent/freeze.ts.
 */
export const SEA_001_LIFECYCLE: SeatingLifecycle = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION",
  solveInventoryStatus: "OPEN",
  queryMixStatus: "OPEN",
  englishFreezeStatus: "NOT_STARTED",
  permanentQlCount: 0,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

export function assertSea001ActivationAllowed(): never {
  throw new Error("SEA-001 activation remains locked. The discovery layer is historical evidence; the permanent layer is frozen but inactive until an explicit downstream activation gate is approved.");
}
