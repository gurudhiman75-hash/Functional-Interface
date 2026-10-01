import type { SeatingLifecycle } from "./types.ts";

export const SEA_001_LIFECYCLE: SeatingLifecycle = Object.freeze({
  discoveryStatus: "EXECUTABLE_FOUNDATION",
  solveInventoryStatus: "FROZEN",
  queryMixStatus: "FROZEN",
  englishFreezeStatus: "FROZEN",
  multilingualFreezeStatus: "FROZEN",
  permanentQlCount: 9,
  questionStudioRegistered: true,
  questionStudioReviewOnly: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

export function assertSea001ActivationAllowed(): never {
  throw new Error("SEA-001 is multilingual-frozen and available in Question Studio for review only; Question Bank writes, tests, mocks and public/student delivery remain locked.");
}
