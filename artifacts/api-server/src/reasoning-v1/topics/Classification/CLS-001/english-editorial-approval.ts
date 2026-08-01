export const CLS001_ENGLISH_EDITORIAL_APPROVAL = {
  chapterId: "CLS-001",
  locale: "en-IN",
  status: "APPROVED",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF",
  approvedAtUtc: "2026-08-01T02:10:00.000Z",
  approvedAtIst: "2026-08-01T07:40:00+05:30",
  permanentQlRange: {
    first: "CLS-QL-001",
    last: "CLS-QL-013",
    count: 13,
  },
  reviewQuestionCount: 494,
  checkpointQuestionCounts: {
    "CLS-CP-001": 48,
    "CLS-CP-002": 20,
    "CLS-CP-003": 40,
    "CLS-CP-004": 40,
    "CLS-CP-005": 190,
    "CLS-CP-006": 80,
    "CLS-CP-007": 76,
    "CLS-CP-008": 0,
  },
  qlQuestionCounts: {
    "CLS-QL-001": 16,
    "CLS-QL-002": 16,
    "CLS-QL-003": 16,
    "CLS-QL-004": 20,
    "CLS-QL-005": 24,
    "CLS-QL-006": 16,
    "CLS-QL-007": 40,
    "CLS-QL-008": 70,
    "CLS-QL-009": 120,
    "CLS-QL-010": 40,
    "CLS-QL-011": 40,
    "CLS-QL-012": 52,
    "CLS-QL-013": 24,
  },
  sourceArtifacts: [
    {
      scope: "CLS-CP-001_TO_CLS-CP-005",
      artifactId: 8781484326,
      digest:
        "sha256:dd4b6937a08c4813f26b33d461b6533b2587e896ee5286a420426e949100c734",
      questionCount: 338,
    },
    {
      scope: "CLS-CP-006",
      artifactId: 8782575271,
      digest:
        "sha256:62b9838f5bfe3ca770d95760e9a04553d7cc898ae40146ef9b7039a34d77e239",
      questionCount: 80,
    },
    {
      scope: "CLS-CP-007",
      artifactId: 8802075274,
      digest:
        "sha256:f00fe0e899e210d5edd02c3096fc882a8d6508ff2683823d0736637e971c91cb",
      questionCount: 76,
    },
  ],
  reopenOnlyFor: [
    "MATHEMATICAL_OR_LOGICAL_DEFECT",
    "ANSWER_INTEGRITY_DEFECT",
    "AMBIGUITY_OR_COMPETING_ANSWER_DEFECT",
    "SOURCE_PARITY_DEFECT",
    "RENDERING_DEFECT",
    "EXAM_PATTERN_COVERAGE_DEFECT",
  ],
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  localisation: {
    hindiApprovedByThisDecision: false,
    punjabiApprovedByThisDecision: false,
  },
} as const;

export type Cls001EnglishEditorialApproval =
  typeof CLS001_ENGLISH_EDITORIAL_APPROVAL;
