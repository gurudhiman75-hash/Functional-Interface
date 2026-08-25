import type { Sea002Cp007CandidateAuthorityKey } from "../production-caselet-v1.ts";

export const SEA002_CP007_PERMANENT_QL_IDS = [
  "SEA-QL-025",
  "SEA-QL-026",
  "SEA-QL-027",
  "SEA-QL-028",
] as const;

export type Sea002Cp007PermanentQlId = (typeof SEA002_CP007_PERMANENT_QL_IDS)[number];

export const SEA002_CP007_AUTHORITY_TO_PERMANENT_QL = Object.freeze({
  "CP007-AUTH-01": "SEA-QL-025",
  "CP007-AUTH-02": "SEA-QL-026",
  "CP007-AUTH-03": "SEA-QL-027",
  "CP007-AUTH-04": "SEA-QL-028",
} as const satisfies Readonly<Record<Sea002Cp007CandidateAuthorityKey, Sea002Cp007PermanentQlId>>);

const AUTHORITY = Object.freeze({
  "CP007-AUTH-01": Object.freeze({
    label: "Facing-aware same-row relative position",
    solveContract: "resolve the reference person's facing, then apply a signed same-row left/right distance",
    definingDiscriminators: Object.freeze(["reference-person facing", "same-row relative position", "parameterized left/right distance"]),
  }),
  "CP007-AUTH-02": Object.freeze({
    label: "Facing-direction relation and inference",
    solveContract: "propagate same/opposite-facing relations from a stated facing anchor to determine an unstated person's direction",
    definingDiscriminators: Object.freeze(["facing anchor", "same/opposite-facing chain", "queried facing is not directly stated"]),
  }),
  "CP007-AUTH-03": Object.freeze({
    label: "Joint row and facing inference",
    solveContract: "infer row membership from a row anchor plus same-row/cross-row relations and independently infer facing from the facing-relation chain",
    definingDiscriminators: Object.freeze(["single row anchor", "row membership not roster-supplied", "same-row/cross-row propagation", "facing inference"]),
  }),
  "CP007-AUTH-04": Object.freeze({
    label: "Inferred-facing diagonal composition",
    solveContract: "infer the reference person's facing, apply person-relative left/right, then switch rows to the corresponding diagonal position",
    definingDiscriminators: Object.freeze(["queried reference facing is not directly stated", "facing-aware horizontal move", "cross-row diagonal composition"]),
  }),
} as const satisfies Readonly<Record<Sea002Cp007CandidateAuthorityKey, {
  readonly label: string;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
}>>);

export interface Sea002Cp007PermanentQlRegistryEntry {
  readonly permanentQlId: Sea002Cp007PermanentQlId;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-002";
  readonly checkpointId: "SEA-CP-007";
  readonly authorityKey: Sea002Cp007CandidateAuthorityKey;
  readonly authorityLabel: string;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly sourceSaturationStatus: "FOUR_AUTHORITIES_PROVEN";
  readonly productionUniquenessStatus: "INDEPENDENT_UNIQUENESS_V2_PROVEN";
  readonly englishReviewStatus: "CI_CERTIFIED_SELF_REVIEW_COMPLETE";
  readonly localizationStatus: "V2_REVIEW_READY_HUMAN_APPROVAL_PENDING";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly mockTestEligible: false;
  readonly productionStaging: false;
  readonly publiclyPublishable: false;
  readonly automaticStudentPublication: false;
}

export const SEA002_CP007_PERMANENT_QL_REGISTRY: readonly Sea002Cp007PermanentQlRegistryEntry[] = Object.freeze(
  (Object.keys(SEA002_CP007_AUTHORITY_TO_PERMANENT_QL) as Sea002Cp007CandidateAuthorityKey[]).map((authorityKey) => Object.freeze({
    permanentQlId: SEA002_CP007_AUTHORITY_TO_PERMANENT_QL[authorityKey],
    chapterId: "REAS-SEA" as const,
    packageId: "SEA-002" as const,
    checkpointId: "SEA-CP-007" as const,
    authorityKey,
    authorityLabel: AUTHORITY[authorityKey].label,
    solveContract: AUTHORITY[authorityKey].solveContract,
    definingDiscriminators: AUTHORITY[authorityKey].definingDiscriminators,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    sourceSaturationStatus: "FOUR_AUTHORITIES_PROVEN" as const,
    productionUniquenessStatus: "INDEPENDENT_UNIQUENESS_V2_PROVEN" as const,
    englishReviewStatus: "CI_CERTIFIED_SELF_REVIEW_COMPLETE" as const,
    localizationStatus: "V2_REVIEW_READY_HUMAN_APPROVAL_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  })),
);

export const SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP007 = "SEA-QL-029" as const;
