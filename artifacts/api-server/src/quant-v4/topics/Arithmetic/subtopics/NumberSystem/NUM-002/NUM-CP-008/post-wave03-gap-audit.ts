export const NUM_CP008_DISCOVERED_PROTOTYPE_IDS = Array.from(
  { length: 24 },
  (_, index) => `NUM-CP008-PROT-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

export const NUM_CP008_POST_WAVE03_MATERIAL_GAPS = [
  {
    gapId: "SYSTEM_SOLUTION_MULTIPLICITY_CLASSIFICATION",
    proposedPrototypeId: "NUM-CP008-PROT-025",
    disposition: "WAVE04_EXECUTABLE_DISCOVERY_REQUIRED",
    reason:
      "Existing authorities can solve or reject particular congruence systems, but no learner target yet classifies a bounded simultaneous system by zero, one, or multiple admissible solutions.",
  },
  {
    gapId: "BOUNDED_TRIPLE_SYSTEM_COMPLETE_SET",
    proposedPrototypeId: "NUM-CP008-PROT-026",
    disposition: "WAVE04_EXECUTABLE_DISCOVERY_REQUIRED",
    reason:
      "PROT-024 owns bounded count for a compatible three-congruence system; returning the complete bounded set is a different answer semantic and evidence burden and must be proved separately before merge/split.",
  },
] as const;

export const NUM_CP008_ADVANCED_DISPOSITIONS = [
  {
    form: "DIRECT_MODULAR_INVERSE_AS_FINAL_TARGET",
    disposition: "SOURCE_HOLD_ENRICHMENT",
    reason:
      "Inverse calculation already appears internally where a congruence needs it. A standalone inverse target is not promoted without ordinary SSC/Banking/Punjab source evidence.",
  },
  {
    form: "UNRESTRICTED_GENERAL_CRT_THEOREM",
    disposition: "SOURCE_HOLD_ENRICHMENT",
    reason:
      "Constructive two- and three-system CRT reasoning is represented. Symbolic theorem-level general CRT is not a routine learner authority by default.",
  },
  {
    form: "FERMAT_EULER_REDUCTION",
    disposition: "SOURCE_HOLD_ADVANCED_THEOREM",
    reason:
      "Exact repeated-squaring and recurrence authorities already solve ordinary power-remainder work without importing a theorem-only family.",
  },
  {
    form: "WILSON_THEOREM",
    disposition: "SOURCE_HOLD_ADVANCED_THEOREM",
    reason:
      "Wilson-theorem questions are held as advanced number-theory enrichment unless current exam-source evidence requires promotion.",
  },
] as const;

export const NUM_CP008_OWNERSHIP_HOLDS = [
  {
    form: "ONE_STAGE_DIVISION_LEMMA_OR_COMPATIBLE_NESTED_DIVISOR_TRANSFER",
    owner: "NUM-CP-007",
  },
  {
    form: "UNIT_LAST_TWO_LAST_THREE_DIGITS_AS_FINAL_TARGET",
    owner: "NUM-CP-009",
  },
  {
    form: "HCF_LCM_COMMON_ALIGNMENT_OR_GREATEST_COMMON_REMAINDER_DIVISOR",
    owner: "NUM-CP-006",
  },
  {
    form: "FORMED_NUMBER_ARRANGEMENT_COUNT",
    owner: "PNC",
  },
  {
    form: "ALGEBRAIC_EQUATION_WITHOUT_ESSENTIAL_MODULAR_TARGET",
    owner: "ALGEBRA",
  },
] as const;

export const NUM_CP008_POST_WAVE03_AUDIT = {
  checkpointId: "NUM-CP-008",
  discoveredPrototypeCount: 24,
  materialWave04GapCount: NUM_CP008_POST_WAVE03_MATERIAL_GAPS.length,
  advancedDispositionCount: NUM_CP008_ADVANCED_DISPOSITIONS.length,
  ownershipHoldCount: NUM_CP008_OWNERSHIP_HOLDS.length,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
  sourceSaturation: false,
  countProposalAllowed: false,
  nextGate: "IMPLEMENT_TWO_MATERIAL_WAVE04_CONTRACTS_THEN_RECHECK_SOURCES_AND_MERGE_SPLIT",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;
