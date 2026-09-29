import type { SeatingLifecycle } from "./types.ts";

export const SEA_001_LIFECYCLE: SeatingLifecycle = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION",
  solveInventoryStatus: "FROZEN",
  queryMixStatus: "FROZEN",
  englishFreezeStatus: "NOT_STARTED",
  permanentQlCount: 9,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

export function assertSea001ActivationAllowed(): never {
  throw new Error("SEA-001 has a review-only permanent QL allocation; English freeze, Question Studio registration, Question Bank writes, tests, mocks and public delivery remain locked.");
}
