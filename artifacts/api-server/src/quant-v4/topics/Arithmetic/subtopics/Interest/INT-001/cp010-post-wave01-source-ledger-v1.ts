import type { IntCp010PrototypeId } from "./cp010-mixed-systems-discovery-v1";

export const INT_CP010_POST_WAVE01_SOURCE_LEDGER_VERSION = "INT-CP-010-POST-WAVE01-SOURCE-LEDGER-v1" as const;

export type IntCp010SourceDisposition =
  | "COVERED_RELIABLE_SOURCE"
  | "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED"
  | "REPRESENTATION_HOLD"
  | "DESIGN_ONLY_NO_DIRECT_SOURCE"
  | "OWNED_BY_EARLIER_CP";

export type IntCp010SourceDirection = Readonly<{
  id: string;
  label: string;
  disposition: IntCp010SourceDisposition;
  prototypes: readonly IntCp010PrototypeId[];
  sourceEvidence: string;
  note: string;
}>;

export const INT_CP010_POST_WAVE01_SOURCE_LEDGER = Object.freeze([
  Object.freeze({
    id: "S01",
    label: "legacy family int_hybrid_si_ci_crossover",
    disposition: "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED",
    prototypes: Object.freeze(["INT-CP010-PROT-001"] as const),
    sourceEvidence: "INT-001 legacy-77 recovery ledger row 24",
    note: "The legacy identifier is a source lead, but executable V2 inspection shows the broad ci_si/si_ci/hybrid_si_ci dispatch routes it to the ordinary ciSiDiff factory. The family name alone is insufficient authority for a permanent method-switch QL.",
  }),
  Object.freeze({
    id: "S02",
    label: "legacy family int_si_ci_mixed_condition_inverse",
    disposition: "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED",
    prototypes: Object.freeze(["INT-CP010-PROT-002"] as const),
    sourceEvidence: "INT-001 legacy-77 recovery ledger row 77",
    note: "The legacy identifier is a source lead, but executable V2 inspection routes it through the ordinary ciSiDiff factory. Retain the exact prototype as discovery evidence but do not allocate a permanent QL without direct recovered source authority.",
  }),
  Object.freeze({
    id: "S03",
    label: "variable or mixed rates across a cash-flow ledger",
    disposition: "COVERED_RELIABLE_SOURCE",
    prototypes: Object.freeze(["INT-CP010-PROT-003", "INT-CP010-PROT-004"] as const),
    sourceEvidence: "Certified INT-CP-009 post-Wave01 source ledger S17 reassigned to CP010",
    note: "This is the explicit inherited CP010 ownership direction and is implemented by both equal-series and heterogeneous repayment topologies.",
  }),
  Object.freeze({
    id: "S04",
    label: "variable annual rates with equal end-of-period instalments",
    disposition: "COVERED_RELIABLE_SOURCE",
    prototypes: Object.freeze(["INT-CP010-PROT-003"] as const),
    sourceEvidence: "INT-CP-009 S17 + mature CP005 variable-rate and CP008 equal-instalment authorities",
    note: "The mixed topology cannot be reduced to CP005 or CP008 alone because both the rate sequence and recurring payment recurrence are decisive.",
  }),
  Object.freeze({
    id: "S05",
    label: "variable annual rates with heterogeneous repayments and opening-debt inverse",
    disposition: "COVERED_RELIABLE_SOURCE",
    prototypes: Object.freeze(["INT-CP010-PROT-004"] as const),
    sourceEvidence: "INT-CP-009 S17 + mature CP005 variable-rate and CP009 heterogeneous dated-cash-flow authorities",
    note: "The mixed topology requires backward recurrence with a different rate in each period and unequal repayments.",
  }),
  Object.freeze({
    id: "S06",
    label: "simple-interest stage followed by compound-interest stage, direct final amount",
    disposition: "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED",
    prototypes: Object.freeze(["INT-CP010-PROT-001"] as const),
    sourceEvidence: "Provisional CP010 design + mislabeled legacy source lead",
    note: "Executable and exam-plausible, but direct source authority has not been recovered after discovering the V2 legacy misrouting.",
  }),
  Object.freeze({
    id: "S07",
    label: "simple-interest stage followed by compound-interest stage, later-rate inverse",
    disposition: "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED",
    prototypes: Object.freeze(["INT-CP010-PROT-002"] as const),
    sourceEvidence: "Provisional CP010 design + mislabeled legacy source lead",
    note: "Exact bounded inverse is proven, but permanence is held until direct source evidence is recovered.",
  }),
  Object.freeze({
    id: "S08",
    label: "compound-to-simple method reversal",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "Do not mirror P001 merely for symmetry. No recovered source direction requires it.",
  }),
  Object.freeze({
    id: "S09",
    label: "rate and compounding-frequency changes with intervening cash flows",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "CP004 and CP009 separately own the mature components; no direct mixed source fixture has been recovered.",
  }),
  Object.freeze({
    id: "S10",
    label: "borrowing under one interest method and staged lending under another",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "Potentially overlaps scheme comparison and profit semantics; do not invent without source-backed task evidence.",
  }),
  Object.freeze({
    id: "S11",
    label: "SI/CI difference combined with an independent cash-flow condition",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "The legacy mixed-condition identifier does not prove this topology because V2 generated a plain SI-CI difference problem.",
  }),
  Object.freeze({
    id: "S12",
    label: "growth or decay followed by equal-value allocation",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "CP005 and CP007 separately own the mature components; no mixed source authority recovered.",
  }),
  Object.freeze({
    id: "S13",
    label: "bounded system with two unknown interest variables",
    disposition: "DESIGN_ONLY_NO_DIRECT_SOURCE",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "Do not create algebra-for-algebra's-sake mixed systems without a recovered exam task contract.",
  }),
  Object.freeze({
    id: "S14",
    label: "possible/impossible or sufficient/insufficient mixed-system predicates",
    disposition: "REPRESENTATION_HOLD",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Provisional CP010 design only",
    note: "Predicate and data-sufficiency surfaces may be adapters only after an ordinary mixed mathematical authority is proven.",
  }),
  Object.freeze({
    id: "S15",
    label: "ordinary variable-rate growth/decay with no cash flow",
    disposition: "OWNED_BY_EARLIER_CP",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Certified INT-CP-005",
    note: "Remain in CP005; varying rates alone do not make a CP010 mixed system.",
  }),
  Object.freeze({
    id: "S16",
    label: "ordinary heterogeneous dated cash flow at one fixed periodic rate",
    disposition: "OWNED_BY_EARLIER_CP",
    prototypes: Object.freeze([] as const),
    sourceEvidence: "Certified INT-CP-009",
    note: "Remain in CP009; unequal payments alone do not make a CP010 mixed system.",
  }),
] as const satisfies readonly IntCp010SourceDirection[]);

export const INT_CP010_POST_WAVE01_SOURCE_RESULT = Object.freeze({
  directionsAudited: INT_CP010_POST_WAVE01_SOURCE_LEDGER.length,
  reliableSourceDirections: INT_CP010_POST_WAVE01_SOURCE_LEDGER.filter((item) => item.disposition === "COVERED_RELIABLE_SOURCE").length,
  sourceHolds: INT_CP010_POST_WAVE01_SOURCE_LEDGER.filter((item) => item.disposition === "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED").length,
  designOnlyNoDirectSource: INT_CP010_POST_WAVE01_SOURCE_LEDGER.filter((item) => item.disposition === "DESIGN_ONLY_NO_DIRECT_SOURCE").length,
  representationHolds: INT_CP010_POST_WAVE01_SOURCE_LEDGER.filter((item) => item.disposition === "REPRESENTATION_HOLD").length,
  earlierCpDirections: INT_CP010_POST_WAVE01_SOURCE_LEDGER.filter((item) => item.disposition === "OWNED_BY_EARLIER_CP").length,
  materialReliableSourceGaps: 0 as const,
  discoveryPrototypeCount: 4 as const,
  permanentCandidatePrototypeIds: Object.freeze(["INT-CP010-PROT-003", "INT-CP010-PROT-004"] as const),
  sourceHoldPrototypeIds: Object.freeze(["INT-CP010-PROT-001", "INT-CP010-PROT-002"] as const),
  proposedPermanentAuthorityCountBeforeMergeSplit: 2 as const,
  permanentQlCount: 0 as const,
  nextPotentialQlIdentity: "INT-QL-130" as const,
  nextPotentialQlIdentityReserved: false as const,
  nextGate: "TWO_AUTHORITY_MERGE_SPLIT_PROPOSAL" as const,
});
