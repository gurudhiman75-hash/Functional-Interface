import type { SapCp003PrototypeId } from "./types";

export type SapCp003ReleaseTier =
  | "FOUNDATION_DRILL"
  | "SSC_STANDARD"
  | "BANKING_PRELIMS"
  | "ADVANCED_SPEED_PRACTICE";

export type SapCp003MockUse =
  | "FOUNDATION_ONLY"
  | "SSC_ELIGIBLE"
  | "SSC_AND_BANKING_ELIGIBLE"
  | "REMEDIATION_PENDING";

export type SapCp003StructuralRisk = "LOW" | "MEDIUM" | "HIGH";

export interface SapCp003ExamReadinessPolicy {
  readonly releaseTier: SapCp003ReleaseTier;
  readonly mockUse: SapCp003MockUse;
  readonly structuralRisk: SapCp003StructuralRisk;
  readonly learnerUse: string;
  readonly mockWeightGuidance: string;
}

export const SAP_CP003_EXAM_READINESS_POLICY: Readonly<Record<SapCp003PrototypeId, SapCp003ExamReadinessPolicy>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Operation-order practice with exact terminating decimals.",
    mockWeightGuidance: "Normal chapter-test weight; use mixed operation frames rather than long same-frame blocks.",
  }),
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Mixed decimal and fraction evaluation.",
    mockWeightGuidance: "Normal weight after cancellation-friendly and multi-frame expansion.",
  }),
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Decimal multiplication fluency and place-value control.",
    mockWeightGuidance: "Low weight in full mocks; normal weight in foundation and chapter-speed tests.",
  }),
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "FOUNDATION_ONLY",
    structuralRisk: "HIGH",
    learnerUse: "Basic place-value fluency when dividing by powers of ten.",
    mockWeightGuidance: "Exclude from standard mixed mocks except as an occasional easy anchor.",
  }),
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Compatible-factor and reciprocal-based decimal division.",
    mockWeightGuidance: "Low-to-normal SSC weight; retain as speed practice.",
  }),
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Familiar percentage-fraction conversion and direct evaluation.",
    mockWeightGuidance: "Low weight in full mocks; normal weight in conversion drills.",
  }),
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Scope control for percentage-of blocks inside larger expressions.",
    mockWeightGuidance: "Normal weight with varied operation order and cancellation-friendly values.",
  }),
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Exact evaluation across three representations.",
    mockWeightGuidance: "Normal advanced weight after filtering artificial large-fraction outcomes.",
  }),
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Select a common exact fractional representation before evaluation.",
    mockWeightGuidance: "Normal weight; prioritise expressions where conversion creates useful cancellation.",
  }),
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Select a terminating-decimal representation for efficient evaluation.",
    mockWeightGuidance: "Normal weight with varied term order and operation frames.",
  }),
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Fast use of benchmark fraction-decimal equivalences.",
    mockWeightGuidance: "Normal speed-test weight; avoid repeating identical benchmark pair structures.",
  }),
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Convert recurring decimals to exact fractions and evaluate.",
    mockWeightGuidance: "Normal weight after notation and derivation support are present.",
  }),
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "REMEDIATION_PENDING",
    structuralRisk: "HIGH",
    learnerUse: "Recognise percentage factors that sum to one whole.",
    mockWeightGuidance: "Foundation only until different-base, difference and missing-component variants are added.",
  }),
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "REMEDIATION_PENDING",
    structuralRisk: "HIGH",
    learnerUse: "Multiply successive percentage factors as exact numerical factors.",
    mockWeightGuidance: "Hold from unrestricted mocks until the percentage-pair and task pools are broadened.",
  }),
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Use inverse operations to recover a missing decimal operand.",
    mockWeightGuidance: "Low SSC weight; normal foundation weight; favour multiplication and two-step variants in mocks.",
  }),
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Isolate and identify a missing percentage factor.",
    mockWeightGuidance: "Normal weight with bounded, misconception-based options.",
  }),
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Compare values written through equivalent or near-equivalent representations.",
    mockWeightGuidance: "Low-to-normal weight; include both exact-base and unknown-base comparison variants.",
  }),
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "FOUNDATION_ONLY",
    structuralRisk: "HIGH",
    learnerUse: "Diagnose decimal placement after whole-number multiplication.",
    mockWeightGuidance: "Foundation and error-diagnosis use only; do not count as a separate full-mock evaluation authority.",
  }),
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Locate the first value-changing representation or calculation step.",
    mockWeightGuidance: "Normal chapter-test weight; low full-mock weight as a diagnostic format.",
  }),
});
