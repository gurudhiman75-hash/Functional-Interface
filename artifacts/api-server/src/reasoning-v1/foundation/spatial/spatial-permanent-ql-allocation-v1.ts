import { SPATIAL_HUMAN_REVIEW_APPROVAL_V1 } from "./spatial-human-review-approval-v1";

export type SpatialPermanentChapterCodeV1 =
  | "MIR-001"
  | "WAT-001"
  | "FAN-001"
  | "FCL-001"
  | "FSR-001";

export type SpatialPermanentDifficultyV1 =
  | "FOUNDATIONAL"
  | "MODERATE"
  | "ADVANCED";

export interface SpatialPermanentQlAllocationV1 {
  permanentQlId: `SPA-QL-${string}`;
  proposalId: string;
  chapterCode: SpatialPermanentChapterCodeV1;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  englishImplementationFrozen: true;
  approvedReviewHead: string;
  allocationStatus: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN";
  active: false;
  questionStudioDiscoverable: false;
  questionStudioRegistrationStatus: "NOT_REGISTERED";
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  hindiPunjabiGeneration: false;
}

const APPROVED_HEAD = SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.sourceHead;

function ql(
  permanentQlId: `SPA-QL-${string}`,
  proposalId: string,
  chapterCode: SpatialPermanentChapterCodeV1,
  name: string,
  baseDifficulty: SpatialPermanentDifficultyV1,
): SpatialPermanentQlAllocationV1 {
  return {
    permanentQlId,
    proposalId,
    chapterCode,
    name,
    baseDifficulty,
    englishImplementationFrozen: true,
    approvedReviewHead: APPROVED_HEAD,
    allocationStatus: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN",
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  };
}

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V1 = [
  ql("SPA-QL-001", "MIR-PQL-01", "MIR-001", "General figure or symbol mirror image", "FOUNDATIONAL"),
  ql("SPA-QL-002", "MIR-PQL-02", "MIR-001", "Alphanumeric vector-string mirror image", "MODERATE"),
  ql("SPA-QL-003", "MIR-PQL-03", "MIR-001", "Analog clock mirror diagram", "MODERATE"),

  ql("SPA-QL-004", "WAT-PQL-01", "WAT-001", "General figure or symbol water image", "FOUNDATIONAL"),
  ql("SPA-QL-005", "WAT-PQL-02", "WAT-001", "Alphanumeric vector-string water image", "MODERATE"),

  ql("SPA-QL-006", "FAN-PQL-01", "FAN-001", "Whole-figure rigid transformation analogy", "FOUNDATIONAL"),
  ql("SPA-QL-007", "FAN-PQL-02", "FAN-001", "Independent component transformation analogy", "MODERATE"),
  ql("SPA-QL-008", "FAN-PQL-03", "FAN-001", "Component movement or cyclic permutation analogy", "MODERATE"),
  ql("SPA-QL-009", "FAN-PQL-04", "FAN-001", "Element count change analogy", "FOUNDATIONAL"),
  ql("SPA-QL-010", "FAN-PQL-05", "FAN-001", "Shape or symbol substitution analogy", "MODERATE"),
  ql("SPA-QL-011", "FAN-PQL-06", "FAN-001", "Nesting, size and containment-state analogy", "MODERATE"),
  ql("SPA-QL-012", "FAN-PQL-07", "FAN-001", "Shading or visual-state analogy", "FOUNDATIONAL"),
  ql("SPA-QL-013", "FAN-PQL-08", "FAN-001", "Compound multi-operation analogy", "ADVANCED"),

  ql("SPA-QL-014", "FCL-PQL-01", "FCL-001", "Transform-equivalence classification", "MODERATE"),
  ql("SPA-QL-015", "FCL-PQL-02", "FCL-001", "Symmetry-property classification", "MODERATE"),
  ql("SPA-QL-016", "FCL-PQL-03", "FCL-001", "Geometric form and closure classification", "FOUNDATIONAL"),
  ql("SPA-QL-017", "FCL-PQL-04", "FCL-001", "Count-relation classification", "MODERATE"),
  ql("SPA-QL-018", "FCL-PQL-05", "FCL-001", "Nested, replica and relative-size relation classification", "MODERATE"),
  ql("SPA-QL-019", "FCL-PQL-06", "FCL-001", "Relative-position and orientation relation classification", "MODERATE"),
  ql("SPA-QL-020", "FCL-PQL-07", "FCL-001", "Topology and connectivity classification", "ADVANCED"),
  ql("SPA-QL-021", "FCL-PQL-08", "FCL-001", "Shading, fill and partition-state classification", "MODERATE"),
  ql("SPA-QL-022", "FCL-PQL-09", "FCL-001", "Intra-option mirror, water or rotation relation classification", "ADVANCED"),

  ql("SPA-QL-023", "FSR-PQL-01", "FSR-001", "Whole-figure transformation series", "FOUNDATIONAL"),
  ql("SPA-QL-024", "FSR-PQL-02", "FSR-001", "Independent component transformation series", "MODERATE"),
  ql("SPA-QL-025", "FSR-PQL-03", "FSR-001", "Positional movement and cyclic permutation series", "MODERATE"),
  ql("SPA-QL-026", "FSR-PQL-04", "FSR-001", "Count, addition and removal progression", "FOUNDATIONAL"),
  ql("SPA-QL-027", "FSR-PQL-05", "FSR-001", "Shading and fill progression", "FOUNDATIONAL"),
  ql("SPA-QL-028", "FSR-PQL-06", "FSR-001", "Substitution and replacement progression", "MODERATE"),
  ql("SPA-QL-029", "FSR-PQL-07", "FSR-001", "Alternating-operation series", "ADVANCED"),
  ql("SPA-QL-030", "FSR-PQL-08", "FSR-001", "Compound multi-rule series", "ADVANCED"),
] as const satisfies readonly SpatialPermanentQlAllocationV1[];

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1 = {
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V1",
  status: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN" as const,
  approvalId: SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvalId,
  approvedReviewHead: APPROVED_HEAD,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  permanentQlCount: 30,
  nextAvailablePermanentQlId: "SPA-QL-031",
  chapterCounts: {
    "MIR-001": 3,
    "WAT-001": 2,
    "FAN-001": 8,
    "FCL-001": 9,
    "FSR-001": 8,
  },
  holdsUnallocated: ["WAT-HOLD-P01", "FCL-HOLD-P01"] as const,
  lifecycle: {
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  },
  nextGate: "SPATIAL_QUESTION_STUDIO_ACTIVATION_APPROVAL_V1" as const,
} as const;
