export const CP010_ENGLISH_DISCOVERY_FREEZE_VERSION = "COD_CP010_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export const CP010_FROZEN_PROTOTYPE_IDS = [
  "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE",
] as const;

export const CP010_FROZEN_SOLVE_CONTRACT_IDS = [
  "APPLY_CONDITIONAL_TABLE_FORWARD",
] as const;

export const CP010_FROZEN_DOMAINS = ["LETTER", "DIGIT"] as const;

export const CP010_FROZEN_ENDPOINT_SIGNATURES = [
  "LETTER:CONSONANT_CONSONANT",
  "LETTER:VOWEL_VOWEL",
  "LETTER:CONSONANT_VOWEL",
  "LETTER:VOWEL_CONSONANT",
  "DIGIT:ODD_EVEN",
  "DIGIT:EVEN_ODD",
  "DIGIT:ODD_ODD",
  "DIGIT:EVEN_EVEN",
] as const;

export const CP010_FROZEN_ACTION_KINDS = [
  "REPLACE_ENDPOINTS_WITH_CONSTANT",
  "SWAP_ENDPOINT_CODES",
  "COPY_LEFT_CODE_TO_BOTH",
  "COPY_RIGHT_CODE_TO_BOTH",
  "REPLACE_MATCHING_CLASS_WITH_DESIGNATED_CODE",
] as const;

export const CP010_SOURCE_EVIDENCE_LEDGER = [
  {
    evidenceId: "RFC-TYPE6-EXAMPLES-14-16",
    source: "Reasoning for Competitions, Coding-Decoding, Type 6 Conditional Coding, examples 14-16",
    supports: ["LETTER_TABLE", "ENDPOINT_CLASSIFICATION", "CONSTANT", "SWAP", "COPY_LEFT"],
    strength: "DIRECT",
  },
  {
    evidenceId: "RFC-TYPE6-Q276-Q277",
    source: "Reasoning for Competitions, conditional digit-coding questions 276-277",
    supports: ["DIGIT_TABLE", "ODD_EVEN_CLASSIFICATION", "COPY_LEFT", "COPY_RIGHT", "CONSTANT"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "RFC-TYPE6-Q278-Q279",
    source: "Reasoning for Competitions, conditional letter-coding questions 278-279",
    supports: ["LETTER_TABLE", "SWAP", "CONSTANT", "CLASS_WIDE_OVERRIDE"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "EXECUTABLE-800-QUESTION-PROTOTYPE",
    source: "COD-CP-010 independent-solver prototype audit",
    supports: ["ONE_SOLVE_CONTRACT", "EIGHT_ENDPOINT_SIGNATURES", "FIVE_ACTION_KINDS"],
    strength: "EXECUTABLE",
  },
] as const;

export const CP010_OWNERSHIP_DISPOSITIONS = [
  { format: "explicit mutually exclusive conditional lookup table", owner: "COD-CP-010", disposition: "INCLUDE" },
  { format: "ordinary direct letter or symbol substitution", owner: "COD-CP-001", disposition: "DELEGATE" },
  { format: "uniform digit translation", owner: "COD-CP-007", disposition: "DELEGATE" },
  { format: "sentence/artificial-language constraints", owner: "COD-CP-009", disposition: "DELEGATE" },
  { format: "arithmetic or relation-symbol substitution", owner: "OPS-001", disposition: "EXCLUDE" },
] as const;

export const CP010_EXCLUDED_EXPANSIONS = [
  "INVERSE_DECODE_WITH_NON_INJECTIVE_OVERRIDES",
  "MISSING_TOKEN_WITHOUT_RECURRING_SOURCE_EVIDENCE",
  "HIDDEN_CONDITION_INFERENCE",
  "OVERLAPPING_CONDITION_PRECEDENCE_WITHOUT_SOURCE_EVIDENCE",
  "REPEATED_CHARACTER_ONLY_FAMILY_WITHOUT_SOURCE_EVIDENCE",
  "POSITION_OVERRIDE_ONLY_FAMILY_WITHOUT_SOURCE_EVIDENCE",
  "DOMAIN_OR_ACTION_AS_SEPARATE_QL",
] as const;

export const CP010_FREEZE_SEQUENCE_LOCK = {
  permanentQlIdsAllocated: 0,
  currentChapterLastPermanentQlId: "COD-QL-198",
  nextAvailableQlId: "COD-QL-199",
  predecessorRequiredBeforeAllocation: "COD-CP-009",
  localisationAllowed: false,
  questionStudioAllowed: false,
  publicPublicationAllowed: false,
} as const;
