import type { NumCp002Wave03PrototypeId } from "./types";

const DESIGN = "NUM-001 complete design §12/§19 plus NUM-001-NUM-002 end-to-end CP002 baseline";
const LEGACY_COMPARE = "Quant V3 NS-FRACDEC-001 comparison/order authority";
const LEGACY_RECUR = "Quant V3 NS-FRACDEC-001 recurring-decimal authority";
const INVERSE = "CP002 direct/inverse executable authority from Waves 01-02";

export const NUM_CP002_WAVE03_SOURCE_ANCESTRY: Readonly<Record<NumCp002Wave03PrototypeId, readonly string[]>> = {
  "NUM-CP002-PROT-023": [DESIGN, LEGACY_COMPARE, "fraction/value insertion between exact rational bounds"],
  "NUM-CP002-PROT-024": [DESIGN, LEGACY_COMPARE, "largest/smallest exact-rational selection adapter"],
  "NUM-CP002-PROT-025": [DESIGN, INVERSE, "unknown numerator from exact terminating representation"],
  "NUM-CP002-PROT-026": [DESIGN, LEGACY_RECUR, INVERSE, "unknown denominator from exact recurring representation"],
  "NUM-CP002-PROT-027": [DESIGN, INVERSE, "reciprocal/complement under exact representation constraint"],
  "NUM-CP002-PROT-028": [DESIGN, INVERSE, "unknown rational from sum/difference exact evidence"],
  "NUM-CP002-PROT-029": [DESIGN, LEGACY_RECUR, "equivalent recurring notation through repeated minimal block"],
  "NUM-CP002-PROT-030": [DESIGN, INVERSE, "compound parameter condition for decimal termination"],
  "NUM-CP002-PROT-031": [DESIGN, INVERSE, "statement-combination representation after ordinary authorities"],
  "NUM-CP002-PROT-032": [DESIGN, INVERSE, "data-sufficiency representation after ordinary inverse authority"],
};

export const NUM_CP002_WAVE03_DISCOVERY_DISPOSITIONS = Object.freeze({
  largestSmallest: "ORDERING_ADAPTER_CANDIDATE",
  repeatedRecurringBlock: "RECURRING_REPRESENTATION_ADAPTER_CANDIDATE",
  statementCombination: "PROTECTED_ANSWER_SHAPE_PENDING_MERGE_SPLIT",
  dataSufficiency: "PROTECTED_ANSWER_SHAPE_PENDING_MERGE_SPLIT",
  reciprocalComplement: "OWNERSHIP_REVIEW_REQUIRED_IF_GENERAL_ALGEBRA_DOMINATES",
} as const);

export const NUM_CP002_WAVE03_STATUS = Object.freeze({
  checkpointId: "NUM-CP-002",
  wave: 3,
  waveTemporaryPrototypeCount: 10,
  cumulativeTemporaryPrototypeCount: 32,
  permanentQlCount: 0,
  sourceSaturationCandidate: true,
  sourceSaturated: false,
  mergeSplitComplete: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});
