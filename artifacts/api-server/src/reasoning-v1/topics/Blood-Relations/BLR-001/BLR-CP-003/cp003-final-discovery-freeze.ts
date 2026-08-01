import {
  BLR_CP003_CROSS_CHECKPOINT_OWNERSHIP,
  BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION,
  BLR_CP003_FINAL_AUTHORITY_DECISIONS,
  type BlrCp003PermanentAuthority,
  type BlrCp003PermanentQlId,
} from "./cp003-final-authority-audit";
import {
  BLR_CP003_FINAL_APPROVED_BANK_VERSION,
  buildBlrCp003FinalBankTelemetry,
  generateBlrCp003FinalApprovedBank,
} from "./cp003-final-approved-bank";
import {
  BLR_CP003_PERMANENT_CONTRACTS,
  type BlrCp003QuestionForm,
} from "./cp003-permanent-contracts";

export const BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION =
  "BLR_CP003_ENGLISH_DISCOVERY_FREEZE_V1" as const;

const finalBank = generateBlrCp003FinalApprovedBank();
const telemetry = buildBlrCp003FinalBankTelemetry(finalBank);

export const BLR_CP003_FROZEN_SOLVE_AUTHORITIES: readonly BlrCp003PermanentAuthority[] =
  BLR_CP003_PERMANENT_CONTRACTS.map((contract) => contract.solveAuthority);

export const BLR_CP003_PERMANENT_QL_IDS: readonly BlrCp003PermanentQlId[] =
  BLR_CP003_PERMANENT_CONTRACTS.map((contract) => contract.qlId);

export const BLR_CP003_FROZEN_PROTOTYPE_IDS: readonly string[] = [
  ...new Set(finalBank.map((record) => record.sourcePrototypeId)),
].sort();

export const BLR_CP003_FROZEN_TOPOLOGY_IDS: readonly string[] = [
  ...new Set(finalBank.map((record) => record.topologyId)),
].sort();

export const BLR_CP003_FROZEN_QUESTION_FORMS: readonly BlrCp003QuestionForm[] = [
  ...new Set(
    BLR_CP003_PERMANENT_CONTRACTS.flatMap(
      (contract) => contract.questionForms,
    ),
  ),
];

export const BLR_CP003_INSTANCE_PROPERTIES = [
  "SHARED_PASSAGE_GROUPING",
  "SOURCE_BANK",
  "GRAPH_TOPOLOGY",
  "CLUE_ORDER",
  "NEGATIVE_CLUE_COUNT",
  "UNKNOWN_SPOUSE_BOUNDARY",
  "TARGET_MARITAL_STATUS",
  "PAIR_RELATION_PREDICATE",
  "COMPLETE_SET_CARDINALITY",
  "MATERNAL_OR_PATERNAL_BRANCH",
  "GENERATION_DISTANCE",
  "EVIDENCE_PATH_COUNT",
  "NAME_ASSIGNMENT",
  "OPTION_ROTATION",
  "DIFFICULTY_TIER",
] as const;

export const BLR_CP003_SOURCE_EVIDENCE_LEDGER = [
  {
    source: "BLR-CP-003 V5 competitive SVG pack and corrected sibling-arrow approval",
    strength: "HUMAN_REVIEW",
    supports: [
      "EXACT_LINEAGE_PERSON_IDENTIFICATION",
      "NATIVE_SVG_FAMILY_TREE",
      "RESPONSIVE_VISUAL_PROOF",
    ],
  },
  {
    source: "BLR-CP-003 V8 editorial baseline approval",
    strength: "HUMAN_REVIEW",
    supports: [
      "AUTHENTIC_UNORDERED_PAIR_ITEMS",
      "COMPLETE_MEMBER_SETS",
      "EXPLICIT_MARITAL_STATUS_IDENTIFICATION",
      "HUMAN_AUTHORED_ENGLISH_EXPLANATIONS",
    ],
  },
  {
    source: "BLR-CP-003 V9 Wave 01 structural-staging approval",
    strength: "HUMAN_REVIEW",
    supports: [
      "MULTI_MARRIED_SIBLING_IN_LAW",
      "DUAL_MATERNAL_PATERNAL_BRANCHES",
      "FOUR_GENERATION_ASYMMETRIC_LINEAGE",
      "UNEQUAL_COUSIN_BRANCHES",
    ],
  },
  {
    source: "BLR-CP-003 V9 Wave 02 FINISH_CP owner directive",
    strength: "HUMAN_REVIEW",
    supports: [
      "NEGATIVE_AND_EXCLUSION_CLUES",
      "UNKNOWN_SPOUSE_BOUNDARIES",
      "THREE_STATE_MARITAL_EVIDENCE",
      "MIXED_IN_LAW_AND_GENERATION_PATHS",
    ],
  },
  {
    source: "Independent graph, spouse-boundary, editorial, SVG and combined-bank executable gates",
    strength: "EXECUTABLE",
    supports: [
      "TWO_HUNDRED_NINETY_EIGHT_APPROVED_RECORDS",
      "ONE_HUNDRED_TWO_SHARED_PASSAGE_GROUPS",
      "NINE_GRAPH_TOPOLOGIES",
      "TWENTY_NINE_SOURCE_PROTOTYPES",
      "FOUR_PERMANENT_SOLVE_AUTHORITIES",
    ],
  },
] as const;

export const BLR_CP003_OWNERSHIP_DISPOSITIONS = [
  ...BLR_CP003_CROSS_CHECKPOINT_OWNERSHIP,
  {
    sharedPassagePrototype: "UNORDERED_FAMILY_PAIR",
    disposition: "INCLUDE",
    ownerQlId: "BLR-QL-009",
    rationale: "CP-003 owns unordered name-pair answers derived from one shared family graph.",
  },
  {
    sharedPassagePrototype: "COMPLETE_MEMBER_SET",
    disposition: "INCLUDE",
    ownerQlId: "BLR-QL-010",
    rationale: "CP-003 owns exhaustive named-member sets under shared-passage evidence.",
  },
  {
    sharedPassagePrototype: "MEMBER_BY_MARITAL_STATUS",
    disposition: "INCLUDE",
    ownerQlId: "BLR-QL-011",
    rationale: "CP-003 owns married, explicitly unmarried and unresolved target-status identification.",
  },
  {
    sharedPassagePrototype: "PERSON_BY_EXACT_LINEAGE",
    disposition: "INCLUDE",
    ownerQlId: "BLR-QL-012",
    rationale: "CP-003 owns person-name identification from exact maternal or paternal lineage.",
  },
  {
    sharedPassagePrototype: "FAMILY_COMPOSITION_COUNTS",
    disposition: "DELEGATE",
    ownerQlId: "BLR-CP-004",
    rationale: "Member and relationship counts belong to the counting checkpoint.",
  },
  {
    sharedPassagePrototype: "POSSIBLE_OR_CANNOT_BE_DETERMINED",
    disposition: "DELEGATE",
    ownerQlId: "BLR-CP-005",
    rationale: "Possibility semantics belong to the uncertainty checkpoint.",
  },
  {
    sharedPassagePrototype: "CODED_RELATION",
    disposition: "DELEGATE",
    ownerQlId: "BLR-CP-006/007",
    rationale: "Coded decoding and expression construction remain separate checkpoints.",
  },
] as const;

export const BLR_CP003_RELEASE_LOCK = {
  permanentQlRange: "BLR-QL-009..BLR-QL-012",
  permanentQlCount: 4,
  nextAvailableChapterQlId: "BLR-QL-013",
  approvedRecordCount: telemetry.recordCount,
  sharedPassageGroupCount: telemetry.groupCount,
  topologyCount: telemetry.topologyCount,
  prototypeCount: telemetry.prototypeCount,
  solveAuthorityCount: telemetry.authorityCount,
  questionFormCount: BLR_CP003_FROZEN_QUESTION_FORMS.length,
  answerPositions: telemetry.answerPositions,
  structuralSaturationApproved: true,
  finalDiscoveryFreezeApproved: true,
  englishReviewOnly: true,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  localisationAllowed: false,
  publicPublicationAllowed: false,
  productionStagingAllowed: false,
  mergeAllowed: false,
} as const;

export const BLR_CP003_FINAL_DISCOVERY_FREEZE = {
  version: BLR_CP003_ENGLISH_DISCOVERY_FREEZE_VERSION,
  approvedBankVersion: BLR_CP003_FINAL_APPROVED_BANK_VERSION,
  authorityAuditVersion: BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION,
  approvalDate: "2026-08-01",
  approvedBy: "PROJECT_OWNER",
  approvalDirective: "FINISH_CP",
  authorityDecisions: BLR_CP003_FINAL_AUTHORITY_DECISIONS,
  permanentContracts: BLR_CP003_PERMANENT_CONTRACTS,
  telemetry,
  releaseLock: BLR_CP003_RELEASE_LOCK,
} as const;
