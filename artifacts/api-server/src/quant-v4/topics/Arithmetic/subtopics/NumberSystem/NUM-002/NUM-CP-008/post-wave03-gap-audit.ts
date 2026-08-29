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

export const NUM_CP008_DESIGN_DIRECTION_DISPOSITIONS = [
  {
    form: "LARGE_MODULAR_EXPRESSION_REMAINDER",
    disposition: "REPRESENTED_PARAMETER_COMPOSITION",
    authorityPressure: ["NUM-CP008-PROT-002", "NUM-CP008-PROT-003", "NUM-CP008-PROT-018"],
    reason:
      "Large expressions do not create a new target by size alone: ordinary sum/product composition, power reduction and genuinely nested-modulus work already have separate executable engines.",
  },
  {
    form: "LEAST_POSITIVE_LINEAR_CONGRUENCE_REPRESENTATIVE",
    disposition: "REPRESENTED_PARAMETER_PROJECTION",
    authorityPressure: ["NUM-CP008-PROT-004", "NUM-CP008-PROT-009"],
    reason:
      "A solved linear congruence already yields its residue class; choosing the least positive or another bounded representative is the existing bounded-projection operation rather than a new solve contract.",
  },
  {
    form: "GREATEST_BOUNDED_SIMULTANEOUS_SYSTEM_SOLUTION",
    disposition: "REPRESENTED_PARAMETER_PROJECTION_AFTER_CRT",
    authorityPressure: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-009", "NUM-CP008-PROT-015"],
    reason:
      "After CRT reduces a compatible system to one residue class, greatest-below-bound is the same progression-extremum target already proved by the bounded representative authority.",
  },
  {
    form: "SAME_REMAINDER_ACROSS_SEVERAL_MODULI",
    disposition: "REPRESENTED_COMPATIBLE_SYSTEM_SURFACE_WITH_CP006_BOUNDARY",
    authorityPressure: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-015", "NUM-CP008-PROT-020"],
    reason:
      "When the learner target is the number/residue system, it is a compatible-system surface. When the target is the greatest divisor producing a common remainder, ownership stays with CP006.",
  },
  {
    form: "RECONSTRUCT_NUMBER_FROM_SYSTEM_PLUS_RANGE",
    disposition: "REPRESENTED_BOUNDED_SYSTEM_PROJECTION",
    authorityPressure: ["NUM-CP008-PROT-011", "NUM-CP008-PROT-024", "NUM-CP008-PROT-025", "NUM-CP008-PROT-026"],
    reason:
      "Range reconstruction is already represented through exact bounded set/count/multiplicity outputs after the system is combined; a unique-number wording is a finite-set parameter state rather than a new solver.",
  },
  {
    form: "SINGLE_BOOLEAN_MODULAR_CLAIM",
    disposition: "REPRESENTED_STATEMENT_ADAPTER",
    authorityPressure: ["NUM-CP008-PROT-019", "NUM-CP008-PROT-021"],
    reason:
      "Candidate verification and three-statement truth evaluation already prove the claim-evaluation burden. A one-claim true/false surface is a lower-burden adapter, not a separate authority.",
  },
  {
    form: "LEAST_REPUNIT_LENGTH_DIVISIBLE_BY_M",
    disposition: "SOURCE_HOLD_INVERSE_RECURRENCE",
    authorityPressure: ["NUM-CP008-PROT-023"],
    reason:
      "Repeated-numeral remainder recurrence is executable, but an inverse least-length target is not promoted without direct ordinary SSC/Banking/Punjab source evidence; it remains an explicit source-backed candidate rather than a hidden gap.",
  },
  {
    form: "STRUCTURED_CONCATENATION_REMAINDER",
    disposition: "REPRESENTED_RECURRENCE_ADAPTER_OR_CP010_HANDOFF",
    authorityPressure: ["NUM-CP008-PROT-023"],
    reason:
      "Repeated fixed-block concatenation uses the same append/remainder recurrence. If arbitrary digit construction itself becomes essential, ownership moves to digit-structure CP010 rather than creating a duplicate modular QL.",
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
  designDirectionDispositionCount: NUM_CP008_DESIGN_DIRECTION_DISPOSITIONS.length,
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
