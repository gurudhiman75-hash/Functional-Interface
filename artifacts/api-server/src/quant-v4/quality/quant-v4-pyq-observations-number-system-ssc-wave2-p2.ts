import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE2-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE2-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type Wave2ExamId = Extract<QuantV4PyqExamId, "SSC_CGL_TIER_I" | "SSC_CHSL">;

const UNRESOLVED_PAPER_ID_BY_EXAM: Record<Wave2ExamId, string> = {
  SSC_CGL_TIER_I: "SSC-CGL-TIER-I-COLLECTION-PAPER-IDENTITY-UNRESOLVED",
  SSC_CHSL: "SSC-CHSL-COLLECTION-PAPER-IDENTITY-UNRESOLVED",
};

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: Wave2ExamId;
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

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "NUM-SSC-W2-001",
    sourceId: "NUM-SSC-W2-001",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2011",
    questionRef: "COLLECTION-2011-Q29",
    subtopic: "NUM-CP-001 — Number Sets, Order, Parity and Integer Structure",
    representation: "ODD_PARITY_EXPRESSION_MCQ",
    notes: "Collection Q29 asks which expression is even when a and b are odd. The retained option a+b+2ab is independently even because odd+odd is even and 2ab is even.",
  }),
  observation({
    observationId: "NUM-SSC-W2-002",
    sourceId: "NUM-SSC-W2-002",
    examId: "SSC_CGL_TIER_I",
    sourceAttribution: "SSC CGL Tier-I Exam 2010",
    questionRef: "COLLECTION-SECTION-I-2010-Q13",
    subtopic: "NUM-CP-002 — Fractions, Decimals and Recurring Representations",
    representation: "FRACTION_ORDER_COMPARISON_MCQ",
    notes: "Collection Section I Q13 compares 15/16, 19/20, 24/25 and 34/35. Exact cross-multiplication confirms 15/16 is the least.",
  }),
  observation({
    observationId: "NUM-SSC-W2-003",
    sourceId: "NUM-SSC-W2-003",
    examId: "SSC_CHSL",
    sourceAttribution: "SSC CHSL (10+2) LDC, DEO & PA/SA Exam 2016",
    questionRef: "COLLECTION-SECTION-III-2016-Q1",
    subtopic: "NUM-CP-002 — Fractions, Decimals and Recurring Representations",
    representation: "RECURRING_DECIMAL_TO_FRACTION_MCQ",
    notes: "Collection Section III Q1 converts recurring 0.3939... to a vulgar fraction; 39/99 reduces exactly to 13/33.",
  }),
  observation({
    observationId: "NUM-SSC-W2-004",
    sourceId: "NUM-SSC-W2-004",
    examId: "SSC_CHSL",
    sourceAttribution: "SSC CHSL DEO Exam 2014",
    questionRef: "COLLECTION-SECTION-II-2014-Q15",
    subtopic: "NUM-CP-004 — Prime Structure and Factorisation",
    representation: "PRIME_RANGE_PRODUCT_MCQ",
    notes: "Collection Q15 asks for the product of primes strictly between 80 and 90. The only primes are 83 and 89, and 83×89=7387.",
  }),
  observation({
    observationId: "NUM-SSC-W2-005",
    sourceId: "NUM-SSC-W2-005",
    examId: "SSC_CHSL",
    sourceAttribution: "SSC CHSL (10+2) LDC, DEO & PA/SA Exam 2015",
    questionRef: "COLLECTION-SECTION-II-2015-Q1",
    subtopic: "NUM-CP-004 — Prime Structure and Factorisation",
    representation: "PRIME_RANGE_EXTREMA_DIFFERENCE_MCQ",
    notes: "Collection Section II Q1 asks for the difference between the greatest and least primes below 100. They are 97 and 2, so the answer is 95.",
  }),
  observation({
    observationId: "NUM-SSC-W2-006",
    sourceId: "NUM-SSC-W2-006",
    examId: "SSC_CHSL",
    sourceAttribution: "SSC CHSL DEO & LDC Exam 2012",
    questionRef: "COLLECTION-PAGE37-2012-Q20",
    subtopic: "NUM-CP-002 — Fractions, Decimals and Recurring Representations",
    representation: "RECURRING_DECIMAL_SUM_MCQ",
    notes: "Collection page 37 Q20 adds recurring 0.63... and recurring 0.37.... Converting to 63/99 and 37/99 gives 100/99 exactly.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "SSC Mathematics Previous Year Solved Paper Number System [sscstudy.com].pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_COUNTABLE_PYQ_OBSERVATIONS.length,
  cpCoverage: Object.freeze(["NUM-CP-001", "NUM-CP-002", "NUM-CP-004"] as const),
  profileObservationCounts: Object.freeze({
    SSC_CGL_TIER_I: 2,
    SSC_CHSL: 4,
  } as const),
  selectionCalibrationAllowed: false,
} as const);
