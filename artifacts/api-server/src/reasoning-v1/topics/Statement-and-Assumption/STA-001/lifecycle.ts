import type { StaLifecycle } from "./types.ts";

export const STA_PERMANENT_QL_LIFECYCLE: StaLifecycle = {
  maturity: "PERMANENT_QL_SEMANTIC_FREEZE",
  permanentQlCount: 4,
  proposedQlCount: 4,
  englishCorpusStatus: "FROZEN_V2",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiPunjabiStatus: "NOT_STARTED",
};

/** Compatibility alias for discovery code paths; downstream gates remain closed. */
export const STA_EXECUTABLE_DISCOVERY_LIFECYCLE = STA_PERMANENT_QL_LIFECYCLE;
