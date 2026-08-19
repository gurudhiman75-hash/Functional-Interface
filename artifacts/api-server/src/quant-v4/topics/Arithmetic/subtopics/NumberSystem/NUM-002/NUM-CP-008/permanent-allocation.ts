import { NUM_CP008_PROPOSED_AUTHORITIES } from "./post-wave04-authority-proposal.ts";

export const NUM_CP008_PERMANENT_ALLOCATION = NUM_CP008_PROPOSED_AUTHORITIES.map((authority, index) => ({
  qlId: `NUM-QL-${String(166 + index).padStart(3, "0")}`,
  authorityId: authority.authorityId,
  label: authority.label,
  prototypes: authority.prototypes,
})) as readonly {
  readonly qlId: string;
  readonly authorityId: string;
  readonly label: string;
  readonly prototypes: readonly string[];
}[];

export const NUM_CP008_ALLOCATION_STATUS = {
  checkpointId: "NUM-CP-008",
  approvalStatus: "EXPLICIT_COUNT_APPROVAL_RECEIVED",
  permanentQlCount: 19,
  firstPermanentQl: "NUM-QL-166",
  lastPermanentQl: "NUM-QL-184",
  nextAvailableQl: "NUM-QL-185",
  permanentIdentitiesAllocated: true,
  englishRuntimeFrozen: false,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;
