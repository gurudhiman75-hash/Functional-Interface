import type { IopLifecycle } from "./types.ts";

export const IOP_001_LIFECYCLE: IopLifecycle = Object.freeze({
  maturity: "EXECUTABLE_DISCOVERY_PROOF",
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiPunjabiStatus: "NOT_STARTED",
});

export function assertIop001ActivationAllowed(): never {
  throw new Error("IOP-001 remains discovery-only: permanent QLs, Question Studio, Question Bank, tests and public delivery are locked.");
}
