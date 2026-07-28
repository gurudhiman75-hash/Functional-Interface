import type { BlrCp002PrototypeId, BlrCp002QuestionForm } from "./cp002-types";
import type {
  BlrCp002QlId,
  BlrCp002SolveAuthority,
} from "./cp002-permanent-contracts";

export const BLR_CP002_ENGLISH_DISCOVERY_FREEZE_VERSION =
  "BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export const BLR_CP002_FROZEN_PROTOTYPE_IDS: readonly BlrCp002PrototypeId[] = [
  "BLR-CP002-PROT-POINTED-TO-SPEAKER",
  "BLR-CP002-PROT-SPEAKER-TO-POINTED",
  "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
  "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
  "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
  "BLR-CP002-PROT-SELF-IDENTITY",
] as const;

export const BLR_CP002_FROZEN_SOLVE_AUTHORITIES: readonly BlrCp002SolveAuthority[] = [
  "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
] as const;

export const BLR_CP002_PERMANENT_QL_IDS: readonly BlrCp002QlId[] = [
  "BLR-QL-008",
] as const;

export const BLR_CP002_FROZEN_QUESTION_FORMS: readonly BlrCp002QuestionForm[] = [
  "HOW_RELATED",
  "WHOSE_PHOTOGRAPH",
  "WHOSE_PORTRAIT",
] as const;

export const BLR_CP002_INSTANCE_PROPERTIES = [
  "PRESENTATION_CONTEXT",
  "QUESTION_AND_OPTION_RENDERER",
  "ANCHOR_COUNT",
  "ANCHOR_DIRECTION",
  "ASSERTION_ROLE_DEPTH",
  "QUERY_ROLE_DEPTH",
  "ONE_OR_BOTH_DERIVED_QUERY_ENDPOINTS",
  "ROLE_VOCABULARY",
  "ONLY_CONSTRAINT_LOCATION",
  "ZERO_CARDINALITY_CONSTRAINT",
  "BLOOD_OR_AFFINAL_OUTPUT",
  "RELATION_OUTPUT_VALUE",
  "SELF_IDENTITY_COLLAPSE",
  "NAME_ASSIGNMENT",
  "DIFFICULTY",
] as const;

export interface BlrCp002SourceEvidenceEntry {
  source: string;
  strength: "DIRECT" | "CORROBORATING" | "EXECUTABLE" | "HUMAN_REVIEW";
  supports: readonly string[];
}

export const BLR_CP002_SOURCE_EVIDENCE_LEDGER: readonly BlrCp002SourceEvidenceEntry[] = [
  {
    source: "Reasoning source chapters covering pointing, photograph and conversation relations",
    strength: "DIRECT",
    supports: [
      "POINTER_AND_PHOTOGRAPH_FORMS",
      "NESTED_POSSESSIVE_ROLE_CHAINS",
      "SELF_IDENTITY",
      "ONLY_AND_NO_SIBLING_WORDING",
    ],
  },
  {
    source: "Independent exam-preparation examples covering introductions and photograph ownership",
    strength: "CORROBORATING",
    supports: [
      "THREE_ANCHOR_INTRODUCTIONS",
      "WHOSE_PHOTOGRAPH_AND_PORTRAIT_RENDERERS",
      "BOTH_DERIVED_QUERY_ENDPOINTS",
    ],
  },
  {
    source: "BLR-CP-002 canonical runtime, independent solver and deterministic gates",
    strength: "EXECUTABLE",
    supports: [
      "SIX_PROTOTYPES",
      "FORTY_FIVE_CANONICAL_SCENARIOS",
      "ONE_SOLVE_AUTHORITY",
      "CARDINALITY_AND_AFFINAL_GAP_CLOSURE",
      "THREE_THOUSAND_FOUR_HUNDRED_NINETY_TWO_QUESTION_PROOF",
    ],
  },
  {
    source: "User approval of BLR-CP-002 English open-discovery v8 human-review pack",
    strength: "HUMAN_REVIEW",
    supports: [
      "STEM_AND_OPTION_ACCEPTANCE",
      "EXPLANATION_ACCEPTANCE",
      "RENDERER_ACCEPTANCE",
      "ONE_AUTHORITY_FREEZE_APPROVAL",
    ],
  },
] as const;

export const BLR_CP002_OWNERSHIP_DISPOSITIONS = [
  { format: "pointer, photograph, portrait, introduction, stage and conversation exact-answer relations", owner: "BLR-CP-002", disposition: "INCLUDE" },
  { format: "shared multi-question family passages", owner: "BLR-CP-003", disposition: "DELEGATE" },
  { format: "member, gender, child, couple and family-composition counts", owner: "BLR-CP-004", disposition: "DELEGATE" },
  { format: "possible, impossible, one-of-two and cannot-be-determined pointer semantics", owner: "BLR-CP-005", disposition: "DELEGATE" },
  { format: "coded relation decoding", owner: "BLR-CP-006", disposition: "DELEGATE" },
  { format: "coded expression construction and validation", owner: "BLR-CP-007", disposition: "DELEGATE" },
  { format: "family plus profession, sport, colour or other puzzle attributes", owner: "Puzzle", disposition: "EXCLUDE" },
  { format: "Blood Relations Data Sufficiency wrapper", owner: "Data Sufficiency", disposition: "EXCLUDE" },
] as const;

export const BLR_CP002_RELEASE_LOCK = {
  permanentQlRange: "BLR-QL-008",
  permanentQlCount: 1,
  nextAvailableChapterQlId: "BLR-QL-009",
  prototypeCount: 6,
  canonicalScenarioCount: 45,
  solveAuthorityCount: 1,
  questionFormCount: 3,
  englishReviewOnly: true,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  publicPublicationAllowed: false,
  localisationAllowed: false,
} as const;
