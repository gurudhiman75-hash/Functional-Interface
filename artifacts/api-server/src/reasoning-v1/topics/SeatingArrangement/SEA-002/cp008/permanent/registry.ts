import {
  SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS,
  type Sea002Cp008PermanentEligibleSignatureId,
} from "../solve-signature-v4.ts";

export const SEA002_CP008_PERMANENT_QL_IDS = Object.freeze([
  "SEA-QL-029",
  "SEA-QL-030",
  "SEA-QL-031",
  "SEA-QL-032",
  "SEA-QL-033",
  "SEA-QL-034",
  "SEA-QL-035",
] as const);

export type Sea002Cp008PermanentQlId = (typeof SEA002_CP008_PERMANENT_QL_IDS)[number];

export const SEA002_CP008_SIGNATURE_TO_PERMANENT_QL = Object.freeze({
  "SEA-CP008-SIG-A": "SEA-QL-029",
  "SEA-CP008-SIG-B": "SEA-QL-030",
  "SEA-CP008-SIG-C": "SEA-QL-031",
  "SEA-CP008-SIG-E": "SEA-QL-032",
  "SEA-CP008-SIG-F": "SEA-QL-033",
  "SEA-CP008-SIG-G": "SEA-QL-034",
  "SEA-CP008-SIG-H": "SEA-QL-035",
} as const satisfies Readonly<Record<Sea002Cp008PermanentEligibleSignatureId, Sea002Cp008PermanentQlId>>);

const AUTHORITY = Object.freeze({
  "SEA-CP008-SIG-A": Object.freeze({
    authorityKey: "CP008-AUTH-01" as const,
    label: "Alternating corner/side square with role-derived facing",
    solveContract: "place eight people at four corners and four side centres, derive inward/outward facing from seat role, then apply person-relative left/right and square-opposite relations",
    definingDiscriminators: Object.freeze(["corner/side-centre role", "role-derived facing", "square opposite", "person-relative left/right"] as const),
  }),
  "SEA-CP008-SIG-B": Object.freeze({
    authorityKey: "CP008-AUTH-02" as const,
    label: "Two persons per side with uniform inward facing",
    solveContract: "place two people on every side without corner occupancy, preserve same-side pairing and opposite-side correspondence, then resolve inward-facing relative positions",
    definingDiscriminators: Object.freeze(["two occupants per side", "no corner occupancy", "same-side pairing", "uniform inward facing"] as const),
  }),
  "SEA-CP008-SIG-C": Object.freeze({
    authorityKey: "CP008-AUTH-03" as const,
    label: "Two persons per side with independent mixed-facing inference",
    solveContract: "solve the two-per-side square topology while independently propagating inward/outward facing relations before applying person-relative left/right constraints",
    definingDiscriminators: Object.freeze(["two occupants per side", "mixed facing inference", "same-side pairing", "facing-aware relative movement"] as const),
  }),
  "SEA-CP008-SIG-E": Object.freeze({
    authorityKey: "CP008-AUTH-04" as const,
    label: "Alternating corner/side-centre square with uniform facing",
    solveContract: "place four corner and four side-centre occupants under one global inward or outward facing rule, then solve square-opposite and person-relative positions",
    definingDiscriminators: Object.freeze(["corner/side-centre role", "global uniform facing", "all-in/all-out parameter reversal", "square opposite"] as const),
  }),
  "SEA-CP008-SIG-F": Object.freeze({
    authorityKey: "CP008-AUTH-05" as const,
    label: "Alternating corner/side-centre square with independent mixed-facing inference",
    solveContract: "solve corner/side-centre placement and an independent mixed-facing relation graph jointly, because seat role does not determine each person's direction",
    definingDiscriminators: Object.freeze(["corner/side-centre role", "independent mixed facing", "facing relation propagation", "person-relative left/right"] as const),
  }),
  "SEA-CP008-SIG-G": Object.freeze({
    authorityKey: "CP008-AUTH-06" as const,
    label: "Variable side occupancy square with 1-2-1-2 pattern",
    solveContract: "identify the alternating single-side and paired-side occupancy classes, use only legitimate half-turn symmetry, then apply same-side, opposite-side and inward-facing relative relations",
    definingDiscriminators: Object.freeze(["1-2-1-2 side occupancy", "no corners", "half-turn symmetry only", "occupancy-class reasoning"] as const),
  }),
  "SEA-CP008-SIG-H": Object.freeze({
    authorityKey: "CP008-AUTH-07" as const,
    label: "Extended 12-seat square with metric perimeter distance",
    solveContract: "place one person at each corner and two on each side of a 12-seat square, preserve multiple side slots, and convert equal perimeter spacing into metric left/right and opposite constraints",
    definingDiscriminators: Object.freeze(["12-seat square", "multiple side slots", "same-side pairing", "metric perimeter distance"] as const),
  }),
} as const satisfies Readonly<Record<Sea002Cp008PermanentEligibleSignatureId, {
  readonly authorityKey: `CP008-AUTH-0${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  readonly label: string;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
}>>);

export type Sea002Cp008AuthorityKey = (typeof AUTHORITY)[Sea002Cp008PermanentEligibleSignatureId]["authorityKey"];

export interface Sea002Cp008PermanentQlRegistryEntry {
  readonly permanentQlId: Sea002Cp008PermanentQlId;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-002";
  readonly checkpointId: "SEA-CP-008";
  readonly signatureId: Sea002Cp008PermanentEligibleSignatureId;
  readonly authorityKey: Sea002Cp008AuthorityKey;
  readonly authorityLabel: string;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly sourceSaturationStatus: "PRODUCTION_SOURCE_SATURATION_WAVE04_PROVEN";
  readonly structuralProofStatus: "INDEPENDENT_UNIQUENESS_FAMILY_PROVEN";
  readonly englishReviewStatus: "NOT_STARTED";
  readonly localizationStatus: "NOT_STARTED";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly mockTestEligible: false;
  readonly productionStaging: false;
  readonly publiclyPublishable: false;
  readonly automaticStudentPublication: false;
}

export const SEA002_CP008_PERMANENT_QL_REGISTRY: readonly Sea002Cp008PermanentQlRegistryEntry[] = Object.freeze(
  SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.map((signatureId) => Object.freeze({
    permanentQlId: SEA002_CP008_SIGNATURE_TO_PERMANENT_QL[signatureId],
    chapterId: "REAS-SEA" as const,
    packageId: "SEA-002" as const,
    checkpointId: "SEA-CP-008" as const,
    signatureId,
    authorityKey: AUTHORITY[signatureId].authorityKey,
    authorityLabel: AUTHORITY[signatureId].label,
    solveContract: AUTHORITY[signatureId].solveContract,
    definingDiscriminators: AUTHORITY[signatureId].definingDiscriminators,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    sourceSaturationStatus: "PRODUCTION_SOURCE_SATURATION_WAVE04_PROVEN" as const,
    structuralProofStatus: "INDEPENDENT_UNIQUENESS_FAMILY_PROVEN" as const,
    englishReviewStatus: "NOT_STARTED" as const,
    localizationStatus: "NOT_STARTED" as const,
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

export const SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008 = "SEA-QL-036" as const;
