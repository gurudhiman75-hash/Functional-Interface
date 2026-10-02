import {
  SER_CP007_PERMANENT_QL_IDS,
  SER_PERMANENT_QL_REGISTRY as SER_CP007_PERMANENT_QL_REGISTRY,
} from "./SER-PERMANENT-QL-REGISTRY";
import {
  SER_CP010_PERMANENT_ALLOCATIONS,
  SER_CP010_PERMANENT_QL_IDS,
  type SerCp010PermanentQlId,
} from "./SER-CP-010-PROMOTION/ser-cp-010-permanent-allocation";

export const SER_PERMANENT_QL_REGISTRY_V4_VERSION =
  "SER_PERMANENT_QL_REGISTRY_V4_2026_10_02" as const;

export const SER_PERMANENT_QL_IDS_V4 = Object.freeze([
  ...SER_CP007_PERMANENT_QL_IDS,
  ...SER_CP010_PERMANENT_QL_IDS,
] as const);

export type SerPermanentQlIdV4 =
  | (typeof SER_CP007_PERMANENT_QL_IDS)[number]
  | SerCp010PermanentQlId;

export const SER_PERMANENT_QL_REGISTRY_V4 = Object.freeze([
  ...SER_CP007_PERMANENT_QL_REGISTRY.map((entry) =>
    Object.freeze({
      permanentQlId: entry.permanentQlId as SerPermanentQlIdV4,
      chapterId: "SER-001" as const,
      sourceCheckpointId: "SER-CP-007" as const,
      sourceIdentity: entry.authorityId,
      title: entry.title,
      solveContract: entry.solveContract,
      allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  ),
  ...SER_CP010_PERMANENT_ALLOCATIONS.map((entry) =>
    Object.freeze({
      permanentQlId: entry.permanentQlId as SerPermanentQlIdV4,
      chapterId: "SER-001" as const,
      sourceCheckpointId: entry.sourceCheckpointId,
      sourceIdentity: entry.sourceAuthorityId,
      title: entry.title,
      solveContract: entry.solveContract,
      allocationStatus: entry.allocationStatus,
      active: entry.active,
      questionStudioDiscoverable: entry.questionStudioDiscoverable,
      questionBankWritable: entry.questionBankWritable,
      testEligible: entry.testEligible,
      mockTestEligible: entry.mockTestEligible,
      publiclyPublishable: entry.publiclyPublishable,
    }),
  ),
]);

export const SER_PERMANENT_QL_REGISTRY_V4_STATE = Object.freeze({
  registryVersion: 4,
  allocatedQlCount: SER_PERMANENT_QL_IDS_V4.length,
  firstAllocatedId: "SER-QL-001" as const,
  lastAllocatedId: "SER-QL-029" as const,
  nextAvailableId: "SER-QL-030" as const,
  allocatedRange: "SER-QL-001..SER-QL-029" as const,
  cp007LegacyCount: SER_CP007_PERMANENT_QL_IDS.length,
  cp010PromotedCount: SER_CP010_PERMANENT_QL_IDS.length,
  activeQlCount: 0,
  cp010QuestionStudioDiscoverableCount: 0,
  cp010QuestionBankWritableCount: 0,
  cp010TestEligibleCount: 0,
  cp010MockEligibleCount: 0,
  cp010PubliclyPublishableCount: 0,
});

if (SER_PERMANENT_QL_IDS_V4.length !== 29) {
  throw new Error("Series V4 permanent QL registry must contain exactly 29 identities.");
}
if (new Set(SER_PERMANENT_QL_IDS_V4).size !== 29) {
  throw new Error("Series V4 permanent QL registry contains duplicate identities.");
}
for (let index = 0; index < SER_PERMANENT_QL_IDS_V4.length; index += 1) {
  const expected = `SER-QL-${String(index + 1).padStart(3, "0")}`;
  if (SER_PERMANENT_QL_IDS_V4[index] !== expected) {
    throw new Error(
      `Series V4 permanent QL registry lost contiguity at index ${index}: expected ${expected}, found ${SER_PERMANENT_QL_IDS_V4[index]}`,
    );
  }
}
