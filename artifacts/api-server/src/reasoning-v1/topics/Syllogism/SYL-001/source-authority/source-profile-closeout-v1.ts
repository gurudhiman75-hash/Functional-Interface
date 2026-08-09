import type { SylQlId } from "../runtime/types";

export type SylSourceSnapshotStatus =
  | "VERIFIED_CURRENT_PAGE"
  | "BLOCKED_NO_DIRECT_PYQ_SAMPLE";

export type SylDeliveryRole =
  | "MOCK_AUTHENTIC"
  | "PRACTICE_AUTHENTIC_VARIANT"
  | "TRAINING_DIAGNOSTIC"
  | "BLOCKED_NO_SOURCE";

export type SylQlCloseoutAction =
  | "RETAIN"
  | "MERGE_CANDIDATE"
  | "REMODEL_BEFORE_MOCK"
  | "KEEP_TRAINING_ONLY";

export interface SylSourceSnapshotV1 {
  snapshotId: string;
  examProfile: "SSC" | "BANKING" | "CROSS_EXAM" | "PUNJAB";
  status: SylSourceSnapshotStatus;
  evidenceUrls: readonly string[];
  observedShapes: readonly string[];
  authorityBoundary: string;
}

export interface SylTargetMixEntryV1 {
  familyId: string;
  weight: number;
  sourceSnapshotIds: readonly string[];
  note: string;
}

export interface SylExamTargetMixV1 {
  profile: "SSC" | "BANKING" | "CROSS_EXAM" | "PUNJAB";
  status: "PROVISIONAL_SOURCE_BACKED" | "BLOCKED";
  entries: readonly SylTargetMixEntryV1[];
  note: string;
}

export interface SylQlCloseoutDecisionV1 {
  qlId: SylQlId;
  role: SylDeliveryRole;
  action: SylQlCloseoutAction;
  proposedArchetypeId: string;
  sourceSnapshotIds: readonly string[];
  rationale: string;
}

export const SYL_SOURCE_SNAPSHOTS_V1: readonly SylSourceSnapshotV1[] = Object.freeze([
  {
    snapshotId: "SYL-SNAPSHOT-SSC-SATHEE-2026",
    examProfile: "SSC",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://sathee.iitk.ac.in/sathee-ssc/student-corner/preparation-guide/reasoning/syllogisms/",
    ],
    observedShapes: [
      "classical ALL/NO/SOME/SOME_NOT statements",
      "definite conclusion evaluation",
      "complementary-pair rule",
      "compact Venn reasoning",
    ],
    authorityBoundary: "Concept and task-shape authority; not a frequency count.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-SSC-RPF-2026",
    examProfile: "SSC",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://testbook.com/questions/rpf-constable-syllogism-questions--65fbd8a585131d8702d53438",
    ],
    observedShapes: [
      "two statements followed by two conclusions",
      "four-option follows mask",
      "classical statement forms",
    ],
    authorityBoundary: "Representative solved-question set; not a complete RPF census.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
    examProfile: "BANKING",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://testbook.com/questions/rbi-assistant-syllogism-questions--64f9e59d5a90c6547313f6cc",
    ],
    observedShapes: [
      "three statements followed by two conclusions",
      "five-option conclusion combination",
      "either-or complementary pair",
      "possibility conclusion",
      "ONLY and ONLY_A_FEW forms",
    ],
    authorityBoundary: "Representative solved-question set; not an official RBI frequency table.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
    examProfile: "BANKING",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://testbook.com/questions/rbi-grade-b-syllogism-questions--66335a86dde389094bd3215b",
    ],
    observedShapes: [
      "possibility mixed with definite conclusions",
      "two- and three-conclusion option combinations",
      "five-option answer shell",
      "ONLY_A_FEW form",
    ],
    authorityBoundary: "Representative solved-question set; not an official RBI frequency table.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-BANK-NABARD-2026",
    examProfile: "BANKING",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://testbook.com/questions/nabard-grade-a-syllogism-questions--64f72cc913eb150f1ba6e309",
    ],
    observedShapes: [
      "ONLY_A_FEW consequences",
      "possibility conclusions",
      "two- and three-conclusion combinations",
      "five-option answer shell",
    ],
    authorityBoundary: "Representative solved-question set; not an official NABARD frequency table.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-CROSS-JIPMAT-2026",
    examProfile: "CROSS_EXAM",
    status: "VERIFIED_CURRENT_PAGE",
    evidenceUrls: [
      "https://www.afterboards.in/past-year-questions/jipmat/logical-reasoning/syllogism",
    ],
    observedShapes: [
      "three statements and three conclusions",
      "four-option conclusion combination",
      "difficulty labels vary by item",
    ],
    authorityBoundary: "JIPMAT cross-exam authority only; it must not be presented as SSC, Banking or Punjab provenance.",
  },
  {
    snapshotId: "SYL-SNAPSHOT-PUNJAB-DIRECT-PYQ",
    examProfile: "PUNJAB",
    status: "BLOCKED_NO_DIRECT_PYQ_SAMPLE",
    evidenceUrls: [],
    observedShapes: [],
    authorityBoundary: "No Punjab-state PYQ sample has yet been frozen for syllogism task weighting.",
  },
]);

export const SYL_EXAM_TARGET_MIX_V1: readonly SylExamTargetMixV1[] = Object.freeze([
  {
    profile: "SSC",
    status: "PROVISIONAL_SOURCE_BACKED",
    entries: [
      {
        familyId: "SSC_TWO_CONCLUSION_FOUR_OPTION",
        weight: 55,
        sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-RPF-2026"],
        note: "Primary SSC mock shell.",
      },
      {
        familyId: "SSC_SINGLE_DEFINITE_SELECTION",
        weight: 25,
        sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-SATHEE-2026"],
        note: "Practice and sectional-test shell using classical definite inference.",
      },
      {
        familyId: "SSC_COMPLEMENTARY_PAIR",
        weight: 10,
        sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-SATHEE-2026"],
        note: "Complementary-pair coverage without importing Banking-only advanced forms.",
      },
      {
        familyId: "SSC_THREE_CONCLUSION_ADVANCED",
        weight: 10,
        sourceSnapshotIds: ["SYL-SNAPSHOT-CROSS-JIPMAT-2026"],
        note: "Cross-exam advanced practice; profile must remain labelled as adapted rather than SSC PYQ provenance.",
      },
    ],
    note: "Target mix, not claimed historical frequency. ONLY and ONLY_A_FEW are excluded from the SSC mock mix until direct SSC evidence is frozen.",
  },
  {
    profile: "BANKING",
    status: "PROVISIONAL_SOURCE_BACKED",
    entries: [
      {
        familyId: "BANK_TWO_CONCLUSION_FIVE_OPTION",
        weight: 35,
        sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026"],
        note: "Core Banking follows-mask shell.",
      },
      {
        familyId: "BANK_EITHER_OR_COMPLEMENTARY",
        weight: 20,
        sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026"],
        note: "Complementary-pair either-or questions.",
      },
      {
        familyId: "BANK_POSSIBILITY_IN_CONCLUSION_SET",
        weight: 20,
        sourceSnapshotIds: [
          "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
          "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
        ],
        note: "Possibility appears as a conclusion inside the ordinary option shell, not as a standalone three-label diagnostic.",
      },
      {
        familyId: "BANK_ONLY_AND_ONLY_A_FEW",
        weight: 15,
        sourceSnapshotIds: [
          "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
          "SYL-SNAPSHOT-BANK-NABARD-2026",
        ],
        note: "Special-form premise coverage inside Banking conclusion-combination questions.",
      },
      {
        familyId: "BANK_THREE_CONCLUSION_ADVANCED",
        weight: 10,
        sourceSnapshotIds: [
          "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
          "SYL-SNAPSHOT-BANK-NABARD-2026",
        ],
        note: "Advanced Banking combinations.",
      },
    ],
    note: "Target mix, not claimed historical frequency. Standalone modality and pair-classification diagnostics receive zero mock weight.",
  },
  {
    profile: "CROSS_EXAM",
    status: "PROVISIONAL_SOURCE_BACKED",
    entries: [
      {
        familyId: "CROSS_THREE_CONCLUSION_COMBINATION",
        weight: 60,
        sourceSnapshotIds: ["SYL-SNAPSHOT-CROSS-JIPMAT-2026"],
        note: "Primary evidenced cross-exam shell.",
      },
      {
        familyId: "CROSS_MIXED_PRACTICE",
        weight: 40,
        sourceSnapshotIds: [
          "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
          "SYL-SNAPSHOT-BANK-NABARD-2026",
        ],
        note: "Adapted mixed practice; source label must remain explicit.",
      },
    ],
    note: "Cross-exam practice profile only.",
  },
  {
    profile: "PUNJAB",
    status: "BLOCKED",
    entries: [],
    note: "No Punjab-state mock weighting may be frozen until a direct Punjab PYQ sample is collected and reviewed.",
  },
]);

export const SYL_QL_CLOSEOUT_DECISIONS_V1: readonly SylQlCloseoutDecisionV1[] = Object.freeze([
  {
    qlId: "SYL-QL-001",
    role: "MOCK_AUTHENTIC",
    action: "RETAIN",
    proposedArchetypeId: "SYL-A-SSC-SINGLE-DEFINITE",
    sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-SATHEE-2026"],
    rationale: "Classical definite-conclusion task is directly supported.",
  },
  {
    qlId: "SYL-QL-002",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "REMODEL_BEFORE_MOCK",
    proposedArchetypeId: "SYL-A-PRACTICE-NON-FOLLOWING",
    sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-RPF-2026"],
    rationale: "The inverse non-following task is pedagogically valid, but the reviewed source shell asks which conclusion follows.",
  },
  {
    qlId: "SYL-QL-003",
    role: "MOCK_AUTHENTIC",
    action: "RETAIN",
    proposedArchetypeId: "SYL-A-SSC-TWO-CONCLUSION-FOUR-OPTION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-SSC-RPF-2026"],
    rationale: "Directly matches the representative SSC/RPF shell.",
  },
  {
    qlId: "SYL-QL-004",
    role: "MOCK_AUTHENTIC",
    action: "RETAIN",
    proposedArchetypeId: "SYL-A-CROSS-THREE-CONCLUSION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-CROSS-JIPMAT-2026"],
    rationale: "Direct cross-exam three-conclusion support; must not be mislabeled as SSC or Punjab PYQ provenance.",
  },
  {
    qlId: "SYL-QL-005",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-BANK-POSSIBILITY-CONCLUSION",
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
      "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
    ],
    rationale: "Possibility is source-authentic, but the reviewed exams place it inside the normal conclusion-option shell rather than a standalone selection family.",
  },
  {
    qlId: "SYL-QL-006",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-IMPOSSIBILITY",
    sourceSnapshotIds: [],
    rationale: "No direct reviewed mock shell asks students to select an explicitly impossible conclusion as a separate task family.",
  },
  {
    qlId: "SYL-QL-007",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-MODAL-CLASSIFICATION",
    sourceSnapshotIds: [],
    rationale: "The three-label modality diagnostic is useful for learning but is not a reviewed exam answer shell.",
  },
  {
    qlId: "SYL-QL-008",
    role: "MOCK_AUTHENTIC",
    action: "RETAIN",
    proposedArchetypeId: "SYL-A-BANK-TWO-CONCLUSION-FIVE-OPTION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026"],
    rationale: "Directly matches Banking five-option and either-or patterns.",
  },
  {
    qlId: "SYL-QL-009",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-PAIR-CLASSIFICATION",
    sourceSnapshotIds: [],
    rationale: "Pair classification is a teaching diagnostic; reviewed exam sources use conclusion-combination answers instead.",
  },
  {
    qlId: "SYL-QL-010",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-BANK-SPECIAL-FORM-CONCLUSION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026"],
    rationale: "ONLY is source-authentic, but premise vocabulary should be a variant inside a source-shaped Banking task shell rather than a separate QL solely by statement form.",
  },
  {
    qlId: "SYL-QL-011",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-BANK-TWO-CONCLUSION-FIVE-OPTION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026"],
    rationale: "Merge the ONLY premise family into the Banking conclusion-combination archetype and align the answer shell.",
  },
  {
    qlId: "SYL-QL-012",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-MODAL-CLASSIFICATION",
    sourceSnapshotIds: [],
    rationale: "Special-form modality classification remains a training diagnostic.",
  },
  {
    qlId: "SYL-QL-013",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-BANK-SPECIAL-FORM-CONCLUSION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-BANK-NABARD-2026"],
    rationale: "ONLY_A_FEW is source-authentic; the standalone four-option selection shell is not the dominant reviewed Banking shape.",
  },
  {
    qlId: "SYL-QL-014",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-MODAL-CLASSIFICATION",
    sourceSnapshotIds: [],
    rationale: "ONLY_A_FEW modality classification remains a training diagnostic.",
  },
  {
    qlId: "SYL-QL-015",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-BANK-TWO-CONCLUSION-FIVE-OPTION",
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-ASSISTANT-2026",
      "SYL-SNAPSHOT-BANK-NABARD-2026",
    ],
    rationale: "Merge ONLY_A_FEW premises into the source-shaped Banking conclusion-combination archetype.",
  },
  {
    qlId: "SYL-QL-016",
    role: "PRACTICE_AUTHENTIC_VARIANT",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-CROSS-TWO-CONCLUSION-MIXED",
    sourceSnapshotIds: [
      "SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026",
      "SYL-SNAPSHOT-BANK-NABARD-2026",
    ],
    rationale: "Mixed forms are evidenced, but the current cross-exam four-option shell is adapted practice rather than a single frozen target-exam pattern.",
  },
  {
    qlId: "SYL-QL-017",
    role: "MOCK_AUTHENTIC",
    action: "MERGE_CANDIDATE",
    proposedArchetypeId: "SYL-A-CROSS-THREE-CONCLUSION",
    sourceSnapshotIds: ["SYL-SNAPSHOT-CROSS-JIPMAT-2026"],
    rationale: "Merge with QL-004 at the task-archetype level; mixed premise forms should be scenario variants, not a duplicate permanent QL.",
  },
  {
    qlId: "SYL-QL-018",
    role: "TRAINING_DIAGNOSTIC",
    action: "KEEP_TRAINING_ONLY",
    proposedArchetypeId: "SYL-A-TRAINING-MODAL-CLASSIFICATION",
    sourceSnapshotIds: [],
    rationale: "Mixed modality classification remains a zero-mock-weight training diagnostic.",
  },
]);

export const SYL_SOURCE_PROFILE_CLOSEOUT_V1 = Object.freeze({
  authorityId: "SYL_001_SOURCE_PROFILE_CLOSEOUT_V1",
  status: "AUDIT_OPEN",
  baseCommit: "cf14902141176f09bff0b8524773ad173fc480cd",
  sourceSnapshotCount: SYL_SOURCE_SNAPSHOTS_V1.length,
  qlDecisionCount: SYL_QL_CLOSEOUT_DECISIONS_V1.length,
  mockWeightingFrozen: false,
  permanentQlFreezePermitted: false,
  blockers: [
    "Punjab-state direct PYQ sample is absent.",
    "Current 36-scenario pool has no exam-profile weighting mechanism.",
    "Current difficulty labels are static scenario labels rather than calibrated generated-question scores.",
    "Merge/remodel candidates must be implemented before permanent QL freeze.",
  ],
});
