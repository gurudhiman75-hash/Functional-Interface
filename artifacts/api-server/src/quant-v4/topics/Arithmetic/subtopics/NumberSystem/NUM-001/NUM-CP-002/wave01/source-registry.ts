import type { NumCp002Wave01PrototypeId } from "./types";

const LEGACY_ROOT = "quant-v3/NumberSystem/Fractions Decimals Rational Numbers/NS-FRACDEC-001";

export const NUM_CP002_WAVE01_SOURCE_ANCESTRY: Readonly<Record<NumCp002Wave01PrototypeId, readonly string[]>> = {
  "NUM-CP002-PROT-001": [`${LEGACY_ROOT}/CP-001 Simplify Fraction`, "NUM-001 complete design §12 representation conversion"],
  "NUM-CP002-PROT-002": [`${LEGACY_ROOT}/CP-002 Improper To Mixed`, "NUM-001 complete design §12 representation conversion"],
  "NUM-CP002-PROT-003": [`${LEGACY_ROOT}/CP-002 Mixed To Improper`, "NUM-001 complete design §12 representation conversion"],
  "NUM-CP002-PROT-004": [`${LEGACY_ROOT}/CP-006 Terminating Decimal To Fraction`, "NUM-001 complete design §12 representation conversion"],
  "NUM-CP002-PROT-005": [`${LEGACY_ROOT}/CP-007 Pure Recurring Decimal To Fraction`, "NUM-001 complete design §12 recurring reconstruction"],
  "NUM-CP002-PROT-006": [`${LEGACY_ROOT}/CP-007 Mixed Recurring Decimal To Fraction`, "NUM-001 complete design §12 recurring reconstruction"],
  "NUM-CP002-PROT-007": [`${LEGACY_ROOT}/CP-005 Fraction To Terminating Decimal`, "NUM-001 complete design §12 representation conversion"],
  "NUM-CP002-PROT-008": [`${LEGACY_ROOT}/CP-005 Fraction To Recurring Decimal`, "NUM-001 complete design §12 recurring representation"],
  "NUM-CP002-PROT-009": [`${LEGACY_ROOT}/CP-004 Compare Rational Values`, "NUM-001 complete design §12 exact comparison"],
  "NUM-CP002-PROT-010": [`${LEGACY_ROOT}/CP-004 Order Mixed Rational Values`, "NUM-001 complete design §12 exact comparison"],
  "NUM-CP002-PROT-011": [`${LEGACY_ROOT}/CP-008 Terminating Or Recurring`, "NUM-001 complete design §12 decimal termination structure"],
  "NUM-CP002-PROT-012": [`${LEGACY_ROOT}/CP-008 termination-place extension`, "NUM-001 complete design §12 number of terminating decimal places"],
};

export const NUM_CP002_LEGACY_OWNERSHIP_DISPOSITION = Object.freeze([
  { legacy: "CP-001 Simplify Fraction", disposition: "IN_NUM_CP002", reason: "Reduced rational equivalence is representation structure." },
  { legacy: "CP-002 Improper/Mixed Conversion", disposition: "IN_NUM_CP002", reason: "Equivalent rational representation conversion." },
  { legacy: "CP-003 Fraction/Decimal Arithmetic", disposition: "REASSIGN_SIMPLIFICATION", reason: "Expression evaluation, not representation structure." },
  { legacy: "CP-004 Compare/Order Rational Values", disposition: "IN_NUM_CP002", reason: "Exact rational comparison is explicitly owned by CP002." },
  { legacy: "CP-005 Fraction To Decimal", disposition: "IN_NUM_CP002", reason: "Direct representation conversion." },
  { legacy: "CP-006 Decimal To Fraction", disposition: "IN_NUM_CP002", reason: "Direct representation conversion." },
  { legacy: "CP-007 Recurring Decimal To Fraction", disposition: "IN_NUM_CP002", reason: "Recurring reconstruction is explicitly owned by CP002." },
  { legacy: "CP-008 Terminating Or Recurring", disposition: "IN_NUM_CP002", reason: "Denominator-controlled decimal nature is a governing invariant." },
  { legacy: "CP-009 HCF/LCM Of Fractions", disposition: "REASSIGN_NUM_CP006", reason: "Final HCF/LCM target belongs to CP006." },
] as const);

export const NUM_CP002_WAVE01_DISCOVERY_STATUS = Object.freeze({
  checkpointId: "NUM-CP-002",
  wave: 1,
  temporaryPrototypeCount: 12,
  permanentQlCount: 0,
  permanentQlIdsAllocated: false,
  sourceSaturated: false,
  mergeSplitComplete: false,
  humanReviewComplete: false,
  languages: ["en-IN"] as const,
  nextWaveFocus: [
    "least multiplier/divisor for termination",
    "missing denominator factor",
    "bounded denominator sets/counts",
    "unknown numerator/denominator reconstruction",
    "recurring-block digit recovery",
    "bounded repetend length and equivalence including repeating nines",
    "claim and data-sufficiency adapters after ordinary inverse proof",
  ] as const,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});
