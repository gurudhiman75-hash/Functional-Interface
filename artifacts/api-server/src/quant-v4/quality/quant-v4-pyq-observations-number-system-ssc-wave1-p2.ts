import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE1-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE1-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type Wave1ExamId = Extract<
  QuantV4PyqExamId,
  "SSC_CGL_TIER_I" | "SSC_CGL_TIER_II" | "SSC_CHSL"
>;

const UNRESOLVED_PAPER_ID_BY_EXAM: Record<Wave1ExamId, string> = {
  SSC_CGL_TIER_I: "SSC-CGL-TIER-I-COLLECTION-PAPER-IDENTITY-UNRESOLVED",
  SSC_CGL_TIER_II: "SSC-CGL-TIER-II-COLLECTION-PAPER-IDENTITY-UNRESOLVED",
  SSC_CHSL: "SSC-CHSL-COLLECTION-PAPER-IDENTITY-UNRESOLVED",
};

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: Wave1ExamId;
  sourceAttribution: string;
  questionRef: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: input.observationId,
    examId: input.examId,
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: ref(input.sourceId),
    sourceLabel: `Secondary PYQ collection attribution: ${input.sourceAttribution}; exact paper date/shift not preserved`,
    paperId: UNRESOLVED_PAPER_ID_BY_EXAM[input.examId],
    questionRef: input.questionRef,
    packageId: "NUM-001",
    topic: "Arithmetic — Number System",
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "NUM-SSC-W1-001",
    sourceId: "NUM-SSC-W1-001",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2010",
    questionRef: "COLLECTION-2010-Q67",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "REPEATED_DIGIT_BLOCK_DIVISIBILITY_MCQ",
    notes: "Collection Q67: a four-digit number formed by repeating one two-digit block; verified by ABAB = 101 × AB. The collection also attributes the item to SSC CGL 2005, but only the explicit Tier-I 2010 attribution is normalized here.",
  }),
  observation({
    observationId: "NUM-SSC-W1-002",
    sourceId: "NUM-SSC-W1-002",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2010",
    questionRef: "COLLECTION-2010-Q69",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "ALGEBRAIC_GUARANTEED_DIVISIBILITY_MCQ",
    notes: "Collection Q69: difference of fourth powers of two odd positive integers; independently verified to be divisible by 16 and therefore by the listed factor 8.",
  }),
  observation({
    observationId: "NUM-SSC-W1-003",
    sourceId: "NUM-SSC-W1-003",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2010",
    questionRef: "COLLECTION-2010-Q70",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "CONSECUTIVE_PRODUCT_DIVISIBILITY_MCQ",
    notes: "Collection Q70: n^3 − n; independently verified as n(n−1)(n+1), hence divisible by 6 for every integer n.",
  }),
  observation({
    observationId: "NUM-SSC-W1-004",
    sourceId: "NUM-SSC-W1-004",
    examId: "SSC_CHSL",
    sourceAttribution: "SSC CHSL DEO & LDC Exam 2011",
    questionRef: "COLLECTION-2011-Q46",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "REPEATED_DIGIT_BLOCK_DIVISIBILITY_MCQ",
    notes: "Collection Q46: six-digit xyxyxy structure; verified as 10101 × (10x+y). Wave 1 originally over-scoped this item to CGL Tier-I; direct source reinspection confirms CHSL DEO & LDC 2011.",
  }),
  observation({
    observationId: "NUM-SSC-W1-005",
    sourceId: "NUM-SSC-W1-005",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2011",
    questionRef: "COLLECTION-2011-Q49",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "POWER_EXPRESSION_DIVISIBILITY_MCQ",
    notes: "Collection Q49: 2^16 − 1; independently verified divisible by 17 via 2^16 − 1 = 255 × 257.",
  }),
  observation({
    observationId: "NUM-SSC-W1-006",
    sourceId: "NUM-SSC-W1-006",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2011",
    questionRef: "COLLECTION-2011-Q52",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "LEAST_ADDITION_FOR_DIVISIBILITY_MCQ",
    notes: "Collection Q52: least addition to 9999 for divisibility by 345; independently verified from 9999 mod 345 = 339, so the least addition is 6.",
  }),
  observation({
    observationId: "NUM-SSC-W1-007",
    sourceId: "NUM-SSC-W1-007",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2011",
    questionRef: "COLLECTION-2011-Q54",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "POWER_SUM_DIVISIBILITY_MCQ",
    notes: "Collection Q54: 5^71 + 5^72 + 5^73; independently verified as 5^71 × 31, hence divisible by 155.",
  }),
  observation({
    observationId: "NUM-SSC-W1-008",
    sourceId: "NUM-SSC-W1-008",
    examId: "SSC_CGL_TIER_II",
    sourceAttribution: "SSC CGL Tier-II Exam 2013",
    questionRef: "COLLECTION-2013-Q26",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "OPTION_FILTER_DIVISIBILITY_MCQ",
    notes: "Collection Q26: identify the listed integer divisible by 25; independently verified that 303375 ends in 75 and is divisible by 25. Wave 1 originally over-scoped this item to Tier-I; direct source reinspection confirms Tier-II 2013.",
  }),
  observation({
    observationId: "NUM-SSC-W1-009",
    sourceId: "NUM-SSC-W1-009",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2013",
    questionRef: "COLLECTION-2013-Q30",
    subtopic: "NUM-CP-003 — Divisibility Rules and Missing-Digit Constraints",
    representation: "REVERSED_DIGIT_DIFFERENCE_DIVISIBILITY_MCQ",
    notes: "Collection Q30: difference between a two-digit number and its digit-reversal; verified as 9(x−y), hence always divisible by 9.",
  }),
  observation({
    observationId: "NUM-SSC-W1-010",
    sourceId: "NUM-SSC-W1-010",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2013",
    questionRef: "COLLECTION-2013-Q31",
    subtopic: "NUM-CP-006 — HCF, LCM and Common-Alignment Applications",
    representation: "HCF_OF_POWER_EXPRESSIONS_MCQ",
    notes: "Collection Q31: gcd of 3^333+1 and 3^334+1; verified by subtracting three times the first expression from the second, reducing the gcd to 2; both expressions are even.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "SSC Mathematics Previous Year Solved Paper Number System [sscstudy.com].pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  cpCoverage: Object.freeze(["NUM-CP-003", "NUM-CP-006"] as const),
  profileObservationCounts: Object.freeze({
    SSC_CGL_TIER_I: 8,
    SSC_CHSL: 1,
    SSC_CGL_TIER_II: 1,
  } as const),
  selectionCalibrationAllowed: false,
} as const);
