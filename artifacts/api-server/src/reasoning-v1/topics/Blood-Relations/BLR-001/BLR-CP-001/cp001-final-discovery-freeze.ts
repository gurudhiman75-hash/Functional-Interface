import type {
  BlrCp001QlId,
  BlrCp001SourcePrototypeId,
} from "./cp001-permanent-contracts";
import type { BlrCp001ProvisionalAuthority } from "./cp001-review-registry";

export const BLR_CP001_ENGLISH_DISCOVERY_FREEZE_VERSION =
  "BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export const BLR_CP001_FROZEN_PROTOTYPE_IDS: readonly BlrCp001SourcePrototypeId[] = [
  "BLR-CP001-PROT-DIRECT-FORWARD",
  "BLR-CP001-PROT-DIRECT-REVERSE",
  "BLR-CP001-PROT-COMPOSED-TWO-EDGE",
  "BLR-CP001-PROT-COMPOSED-THREE-EDGE",
  "BLR-CP001-PROT-IDENTIFY-PERSON",
  "BLR-CP001-PROT-IDENTIFY-PAIR",
  "BLR-CP001-PROT-RELATION-CLAIM",
  "BLR-CP001-PROT-GENERATION-COMPARISON",
  "BLR-CP001-PROT-BRANCHING-RELATION",
  "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER",
  "BLR-CP001-PROT-EXACT-LINEAGE-RELATION",
] as const;

export const BLR_CP001_FROZEN_SOLVE_AUTHORITIES: readonly BlrCp001ProvisionalAuthority[] = [
  "RESOLVE_NAMED_PERSON_RELATION",
  "IDENTIFY_PERSON_BY_RELATION",
  "IDENTIFY_PERSON_BY_GENDER",
  "IDENTIFY_ORDERED_RELATION_PAIR",
  "SELECT_RELATION_CLAIM",
  "COMPARE_GENERATIONS",
  "RESOLVE_EXACT_LINEAGE_RELATION",
] as const;

export const BLR_CP001_PERMANENT_QL_IDS: readonly BlrCp001QlId[] = [
  "BLR-QL-001",
  "BLR-QL-002",
  "BLR-QL-003",
  "BLR-QL-004",
  "BLR-QL-005",
  "BLR-QL-006",
  "BLR-QL-007",
] as const;

export const BLR_CP001_INSTANCE_PROPERTIES = [
  "QUERY_DIRECTION",
  "PATH_LENGTH",
  "LINEAR_OR_BRANCHING_TOPOLOGY",
  "CLAIM_POLARITY",
  "TARGET_GENDER",
  "MATERNAL_OR_PATERNAL_SIDE",
  "RELATION_OUTPUT_VALUE",
  "CLUE_ORDER",
  "NAME_ASSIGNMENT",
  "DIFFICULTY",
  "RENDERER_VARIATION",
] as const;

export const BLR_CP001_SECOND_GAP_RELATIONS = [
  "GREAT_GRANDFATHER",
  "GREAT_GRANDMOTHER",
  "GREAT_GRANDSON",
  "GREAT_GRANDDAUGHTER",
] as const;

export interface BlrCp001SourceEvidenceEntry {
  source: string;
  strength: "DIRECT" | "CORROBORATING" | "EXECUTABLE" | "HUMAN_REVIEW";
  supports: readonly string[];
}

export const BLR_CP001_SOURCE_EVIDENCE_LEDGER: readonly BlrCp001SourceEvidenceEntry[] = [
  {
    source: "Reasoning for Competitions — Blood Relation chapter",
    strength: "DIRECT",
    supports: [
      "DIRECT_AND_COMPOSED_RELATIONS",
      "IDENTITY_PAIR_GENDER_GENERATION",
      "MATERNAL_PATERNAL_LINEAGE",
      "IN_LAW_RELATIONS",
      "POINTER_AND_CODED_BOUNDARIES",
    ],
  },
  {
    source: "Verbal & Non-Verbal Reasoning for Competitive Exams — Blood Relation chapter",
    strength: "CORROBORATING",
    supports: [
      "DIRECT_NAMED_RELATIONS",
      "GREAT_GENERATION_RELATIONS",
      "ONE_OF_TWO_AND_INDETERMINACY_BOUNDARY",
      "COUNT_POINTER_CODED_BOUNDARIES",
    ],
  },
  {
    source: "BLR-CP-001 executable prototype, solver and editorial gates",
    strength: "EXECUTABLE",
    supports: [
      "ELEVEN_PROTOTYPES",
      "SEVEN_SOLVE_AUTHORITIES",
      "INDEPENDENT_SOLVER_PARITY",
      "GREAT_GENERATION_GAP_CLOSURE",
    ],
  },
  {
    source: "External 88-record English audit and approved V2 remediation",
    strength: "HUMAN_REVIEW",
    supports: [
      "STEM_NATURALNESS",
      "FAMILY_TREE_GRIDS",
      "GENERATION_ARITHMETIC",
      "OPTION_SPECIFIC_TRAPS",
    ],
  },
] as const;

export const BLR_CP001_OWNERSHIP_DISPOSITIONS = [
  { format: "direct declarative named-person relations", owner: "BLR-CP-001", disposition: "INCLUDE" },
  { format: "pointer, photograph, conversation and nested self-reference", owner: "BLR-CP-002", disposition: "DELEGATE" },
  { format: "shared multi-question family passages", owner: "BLR-CP-003", disposition: "DELEGATE" },
  { format: "member, gender, child, couple and family-composition counts", owner: "BLR-CP-004", disposition: "DELEGATE" },
  { format: "possible, impossible, one-of-two and cannot-be-determined semantics", owner: "BLR-CP-005", disposition: "DELEGATE" },
  { format: "coded relation decoding", owner: "BLR-CP-006", disposition: "DELEGATE" },
  { format: "coded expression construction and validation", owner: "BLR-CP-007", disposition: "DELEGATE" },
  { format: "family plus profession, sport, colour or other puzzle attributes", owner: "Puzzle", disposition: "EXCLUDE" },
  { format: "Blood Relations Data Sufficiency wrapper", owner: "Data Sufficiency", disposition: "EXCLUDE" },
] as const;

export const BLR_CP001_RELEASE_LOCK = {
  permanentQlRange: "BLR-QL-001..007",
  permanentQlCount: 7,
  nextAvailableChapterQlId: "BLR-QL-008",
  prototypeCount: 11,
  solveAuthorityCount: 7,
  englishReviewOnly: true,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  publicPublicationAllowed: false,
  localisationAllowed: false,
} as const;
