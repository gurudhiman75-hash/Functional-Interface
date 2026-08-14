import type { NumCp002Wave02PrototypeId } from "./types";

const DESIGN = "NUM-001 complete checkpoint design §12/§19";
const LEGACY = "Quant V3 NS-FRACDEC-001 CP-008 termination authority";
const PYQ = "Uploaded SSC previous-year Number System collection: exact fraction/decimal representation evidence";

export const NUM_CP002_WAVE02_SOURCE_ANCESTRY: Readonly<Record<NumCp002Wave02PrototypeId, readonly string[]>> = {
  "NUM-CP002-PROT-013": [DESIGN, LEGACY, "least multiplier for termination inverse"],
  "NUM-CP002-PROT-014": [DESIGN, LEGACY, "least denominator divisor for termination inverse"],
  "NUM-CP002-PROT-015": [DESIGN, LEGACY, "recover denominator structure from exact decimal-place count"],
  "NUM-CP002-PROT-016": [DESIGN, LEGACY, "least power of ten needed for exact integer scaling"],
  "NUM-CP002-PROT-017": [DESIGN, PYQ, "bounded denominator count producing terminating expansion"],
  "NUM-CP002-PROT-018": [DESIGN, PYQ, "complete bounded denominator set producing terminating expansion"],
  "NUM-CP002-PROT-019": [DESIGN, LEGACY, "numerator cancellation condition for termination"],
  "NUM-CP002-PROT-020": [DESIGN, "Quant V3 NS-FRACDEC-001 CP-005 recurring long-division authority", "recover marked recurring-block digit"],
  "NUM-CP002-PROT-021": [DESIGN, "bounded remainder-cycle proof", "repeating-block length"],
  "NUM-CP002-PROT-022": [DESIGN, "repeating-nines edge-state authority", "equivalent recurring and terminating notation"],
};

export const NUM_CP002_WAVE02_STATUS = Object.freeze({
  checkpointId: "NUM-CP-002",
  wave: 2,
  temporaryPrototypeCount: 10,
  cumulativeTemporaryPrototypeCount: 22,
  permanentQlCount: 0,
  sourceSaturated: false,
  mergeSplitComplete: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  remainingDiscovery: [
    "unknown numerator/denominator from exact rational-value evidence",
    "possible/impossible termination under compound constraints",
    "recurring-pattern comparison/equivalence beyond repeating nines",
    "claim verification after direct/inverse coverage",
    "data sufficiency only after ordinary inverse proof",
    "source-saturation merge/split audit",
  ] as const,
});
