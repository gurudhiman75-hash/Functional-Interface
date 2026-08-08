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
    structuralRisk: "LOW",
    learnerUse: "Operation-order practice through product-first, bracket-division, bracket-difference and division-then-add frames.",
    mockWeightGuidance: "Normal chapter-test weight and controlled mixed-mock weight; rotate all four frames and avoid same-frame blocks.",
  }),
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Evaluate decimal and fraction combinations through four exact, cancellation-friendly operation frames.",
    mockWeightGuidance: "Normal controlled weight across fraction-of, mixed bracket, subtraction-chain and bracket-division frames.",
  }),
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Decimal multiplication and place-value control through direct, scaled and bracketed product frames.",
    mockWeightGuidance: "Low mixed-mock weight; normal foundation and chapter-speed weight. Do not use long runs of direct products.",
  }),
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "FOUNDATION_ONLY",
    structuralRisk: "HIGH",
    learnerUse: "Basic place-value fluency when dividing by powers of ten.",
    mockWeightGuidance: "Foundation practice only; exclude from normal mixed mocks except as an occasional easy anchor.",
  }),
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Compatible-factor decimal division through direct, bracket-sum, scaled-numerator and bracket-difference frames.",
    mockWeightGuidance: "Low-to-normal SSC weight; use as timed speed practice, not as a dominant mixed-mock family.",
  }),
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Percentage-factor fluency across direct, reversed-factor, bracket-base and percentage-then-division frames.",
    mockWeightGuidance: "Low mixed-mock weight; normal conversion-drill weight using the expanded percentage benchmark pool.",
  }),
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Scope control for percentage-of blocks through outside terms, brackets, final division and scaled-block frames.",
    mockWeightGuidance: "Normal SSC and banking-prelims weight with all four frames represented and compatible quantities preferred.",
  }),
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Evaluate percentage, fraction and decimal terms through four curated exact-arithmetic frames.",
    mockWeightGuidance: "Controlled normal weight using cancellation-friendly quantities and reduced answers with denominators no greater than eight.",
  }),
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Convert decimal and percentage terms to fractions across sum, product, signed-chain and division frames.",
    mockWeightGuidance: "Controlled normal weight; use all four frames and retain exact reduced-fraction answer semantics.",
  }),
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Convert familiar fractions and percentages to terminating decimals across sum, signed, product and division frames.",
    mockWeightGuidance: "Normal weight after rotating all four frames; avoid long blocks of three-term addition questions.",
  }),
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": Object.freeze({
    releaseTier: "ADVANCED_SPEED_PRACTICE",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Use benchmark fraction-decimal equivalences in shared-base, different-base, difference and bracket-scope frames.",
    mockWeightGuidance: "Normal chapter-speed weight but low mixed-mock weight; this is primarily an SSC shortcut-fluency family.",
  }),
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Convert recurring decimals to exact fractions in addition, cancellation, multiplication and two-recurring-number frames.",
    mockWeightGuidance: "Normal controlled weight with accessible notation, explicit exact conversion and a mix of one- and two-digit recurring blocks.",
  }),
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Recognise complementary parts, distinguish shared and different bases, and evaluate percentage differences or three-part totals.",
    mockWeightGuidance: "Low full-mock weight; normal foundation and chapter-test weight using diversified shared-base, different-base, difference and three-part variants.",
  }),
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Multiply successive percentage factors across nested, product and grouped frames.",
    mockWeightGuidance: "Controlled normal weight using the broadened factor-pair pool; avoid runs of pairs that collapse to the same net factor.",
  }),
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Use inverse operations to recover a missing decimal operand across addition, subtraction, multiplication and signed variants.",
    mockWeightGuidance: "Low SSC mixed-mock weight; normal foundation weight. Multiplication and two-step variants should dominate mock selection.",
  }),
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_AND_BANKING_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Recover a missing percentage through add-block, block-minus-term, subtract-from-total and bracket-base frames.",
    mockWeightGuidance: "Normal controlled weight with all four inverse frames represented and percentage options bound to visible-base mistakes.",
  }),
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "MEDIUM",
    learnerUse: "Compare equivalent, near-equivalent and unknown-base fraction-decimal-percentage results.",
    mockWeightGuidance: "Low-to-normal SSC weight; retain genuine cannot-be-determined cases but avoid overusing the same-base equality frame.",
  }),
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": Object.freeze({
    releaseTier: "FOUNDATION_DRILL",
    mockUse: "FOUNDATION_ONLY",
    structuralRisk: "HIGH",
    learnerUse: "Diagnose decimal placement after whole-number multiplication.",
    mockWeightGuidance: "Foundation and error-diagnosis use only; do not count this as a normal full-mock simplification authority.",
  }),
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": Object.freeze({
    releaseTier: "SSC_STANDARD",
    mockUse: "SSC_ELIGIBLE",
    structuralRisk: "LOW",
    learnerUse: "Locate a conversion error, fraction-addition error, final representation error, or confirm that no error exists.",
    mockWeightGuidance: "Normal chapter-test weight and low mixed-mock weight; rotate Step 1, Step 2, Step 3 and no-error cases evenly.",
  }),
});
