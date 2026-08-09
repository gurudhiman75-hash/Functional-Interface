import type { SeatingLifecycle } from "./types.ts";

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
  throw new Error("SEA-001 is an executable discovery foundation only; permanent QLs, Question Bank writes, tests and public delivery remain locked.");
}
