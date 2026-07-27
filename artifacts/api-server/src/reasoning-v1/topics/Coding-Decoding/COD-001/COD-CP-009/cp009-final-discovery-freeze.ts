export const CP009_ENGLISH_DISCOVERY_FREEZE_VERSION = "COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1" as const;

export const CP009_FROZEN_TASK_CONTRACT_IDS = [
  "COD-CP009-PROT-EXACT-WORD-TO-TOKEN",
  "COD-CP009-PROT-EXACT-TOKEN-TO-WORD",
  "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS",
  "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE",
  "COD-CP009-PROT-MISSING-TOKEN",
  "COD-CP009-PROT-MISSING-WORD",
  "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN",
  "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD",
  "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN",
  "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD",
  "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS",
  "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS",
  "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS",
  "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS",
  "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET",
  "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET",
] as const;

export const CP009_FROZEN_EXACT_ATOMIC_TOPOLOGIES = [
  "DIRECT_SINGLE_INTERSECTION",
  "CHAINED_SINGLETON_PROPAGATION",
  "SET_DIFFERENCE_ELIMINATION",
  "FORKED_EVIDENCE_JOIN",
  "GLOBAL_BIJECTION_DEDUCTION",
] as const;

export const CP009_FROZEN_TOPOLOGY_FAMILIES = [
  ...CP009_FROZEN_EXACT_ATOMIC_TOPOLOGIES,
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
  "PHRASE_SET_COMPOSITION",
  "MISSING_MEMBER_COMPLETION",
  "RESOLVED_COMPONENT_COMPOSITION",
] as const;

export const CP009_FROZEN_INVERSE_PAIRS = [
  ["COD-CP009-PROT-EXACT-WORD-TO-TOKEN", "COD-CP009-PROT-EXACT-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS", "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE"],
  ["COD-CP009-PROT-MISSING-TOKEN", "COD-CP009-PROT-MISSING-WORD"],
  ["COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN", "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN", "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS", "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS"],
  ["COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS", "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS"],
  ["COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET", "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET"],
] as const;

export const CP009_SOURCE_EVIDENCE_LEDGER = [
  {
    evidenceId: "RADIAN-TYPE5-COMMON-WORD-COMMON-CODE",
    source: "Reasoning for Competitions, Coding-Decoding, Type 5 Sentence Coding",
    observedBehaviour: "Recover one exact word-token relation by comparing messages with common words and common code words.",
    supports: ["EXACT_ATOMIC", "CHAINED_EXACT"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "RADIAN-Q247-Q253-INDETERMINATE",
    source: "Reasoning for Competitions, sentence-coding exercise questions 247 and 253",
    observedBehaviour: "The displayed statements may leave a target unresolved, and Cannot be determined is a valid answer.",
    supports: ["AMBIGUITY_REJECTION", "COMPLETE_SOLUTION_SPACE"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "RADIAN-Q250-Q263-EITHER-OR",
    source: "Reasoning for Competitions, sentence-coding questions 250 and 263",
    observedBehaviour: "The complete answer is an either/or candidate domain rather than one arbitrarily selected possible member.",
    supports: ["COMPLETE_CANDIDATE_DOMAIN", "PARTIAL_INFORMATION"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "RADIAN-Q248-Q252-Q265-Q266-COMPOSED-MESSAGE",
    source: "Reasoning for Competitions, sentence-coding questions 248, 252, 265 and 266",
    observedBehaviour: "Code or decode a new multiword message by combining relations established in separate evidence rows.",
    supports: ["RESOLVED_COMPONENT_COMPOSITION", "SET_ANSWER"],
    strength: "DIRECT_RECURRING",
  },
  {
    evidenceId: "RADIAN-Q255-MAY-MEAN",
    source: "Reasoning for Competitions, sentence-coding question 255",
    observedBehaviour: "Choose a phrase that may represent a requested new expression while preserving one unresolved component.",
    supports: ["POSSIBLE_MIXED_SET", "EXISTENCE_WITNESS"],
    strength: "DIRECT",
  },
  {
    evidenceId: "SPEED-TEST-10-MAY-REPRESENT",
    source: "Uploaded reasoning book, Speed Test 10, sentence-coding question 5",
    observedBehaviour: "Choose an option that may represent a new phrase from a partially resolved sentence-code system.",
    supports: ["POSSIBLE_RELATION", "POSSIBLE_MIXED_SET"],
    strength: "INDEPENDENT_CORROBORATION",
  },
  {
    evidenceId: "EXECUTABLE-DISTINCT-PRESENTATIONS",
    source: "CP-009 dual-solver prototypes and combined saturation audit",
    observedBehaviour: "Missing-member and impossible-answer presentations have distinct payload, truth predicate, distractor and explanation obligations.",
    supports: ["MISSING_MEMBER", "IMPOSSIBLE_ATOMIC", "INVERSE_CONTRACTS"],
    strength: "EXECUTABLE_DISTINCT_EXTENSION",
  },
] as const;

export const CP009_OWNERSHIP_DISPOSITIONS = [
  { format: "sentence/artificial-language word-token constraints", owner: "COD-CP-009", disposition: "INCLUDE" },
  { format: "direct character substitution", owner: "COD-CP-001", disposition: "DELEGATE" },
  { format: "alphabet-rank and scalar number coding", owner: "COD-CP-002", disposition: "DELEGATE" },
  { format: "uniform and class-dependent shifts", owner: "COD-CP-003/COD-CP-004", disposition: "DELEGATE" },
  { format: "positional permutation and multi-stage character coding", owner: "COD-CP-005/COD-CP-006", disposition: "DELEGATE" },
  { format: "digit, symbol and alphanumeric coding", owner: "COD-CP-007", disposition: "DELEGATE" },
  { format: "renaming and substitution of real entities", owner: "COD-CP-008", disposition: "DELEGATE" },
  { format: "lookup table with conditional coding rules", owner: "COD-CP-010", disposition: "DELEGATE" },
  { format: "operator or relation-symbol substitution", owner: "OPS-001", disposition: "EXCLUDE" },
  { format: "statement-sufficiency wrapper over sentence coding", owner: "Data Sufficiency", disposition: "EXCLUDE_WRAPPER_REUSE_SOLVER" },
  { format: "general multi-attribute deduction puzzle", owner: "Puzzle", disposition: "EXCLUDE" },
  { format: "input-output transformation sequence", owner: "Input-Output", disposition: "EXCLUDE" },
] as const;

export const CP009_EXCLUDED_FORMAL_EXPANSIONS = [
  "IMPOSSIBLE_PHRASE_OR_SET_WITHOUT_DIRECT_SOURCE_EVIDENCE",
  "STATIC_TABLE_VERSUS_PARAGRAPH_AS_SEPARATE_QL",
  "ROW_COUNT_AS_SEPARATE_QL",
  "TOKEN_ORDER_AS_MEANINGFUL_WHEN_SOURCE_CODES_ARE_UNORDERED",
  "EVERY_PREDICATE_DIRECTION_CARDINALITY_CARTESIAN_PRODUCT",
  "DATA_SUFFICIENCY_WRAPPER",
  "FREE_FORM_SENTENCE_GENERATION",
] as const;

export const CP009_FREEZE_SEQUENCE_LOCK = {
  permanentQlIdsAllocated: 0,
  currentChapterLastPermanentQlId: "COD-QL-168",
  predecessorsRequiredBeforeAllocation: ["COD-CP-007", "COD-CP-008"],
  localisationAllowed: false,
  questionStudioAllowed: false,
  publicPublicationAllowed: false,
} as const;
