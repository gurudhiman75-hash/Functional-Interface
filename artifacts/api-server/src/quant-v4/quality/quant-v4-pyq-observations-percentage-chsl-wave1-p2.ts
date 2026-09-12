import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_PERCENTAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-PERCENTAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-PERCENTAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type PercentageChslWave1ExamId = Extract<QuantV4PyqExamId, "SSC_CHSL">;

const UNRESOLVED_PAPER_ID_BY_YEAR: Readonly<Record<number, string>> = Object.freeze({
  2012: "SSC-CHSL-COLLECTION-2012-PAPER-IDENTITY-UNRESOLVED",
  2013: "SSC-CHSL-COLLECTION-2013-PAPER-IDENTITY-UNRESOLVED",
  2014: "SSC-CHSL-COLLECTION-2014-PAPER-IDENTITY-UNRESOLVED",
});

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: PercentageChslWave1ExamId;
  examYear: 2012 | 2013 | 2014;
  sourceAttribution: string;
  questionRef: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const paperId = UNRESOLVED_PAPER_ID_BY_YEAR[input.examYear];
  if (!paperId) {
    throw new Error(`Missing Percentage CHSL Wave 1 unresolved paper identity for ${input.examYear}.`);
  }

  return Object.freeze({
    observationId: input.observationId,
    examId: input.examId,
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: ref(input.sourceId),
    sourceLabel: `Disha SSC Mathematics Guide collection attribution: ${input.sourceAttribution}; exact paper date/shift not preserved`,
    paperId,
    questionRef: input.questionRef,
    packageId: "PCT-002",
    topic: "Arithmetic — Percentage",
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_PERCENTAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "PCT-CHSL-PYQ-W1-001",
    sourceId: "PCT-CHSL-PYQ-W1-001",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-88-Q65",
    subtopic: "PCT-CP-003 — Percentage from part and whole",
    representation: "PART_WHOLE_PERCENTAGE_MCQ",
    notes: "A team won 24 of 40 games. The required percentage is 24/40 × 100 = 60%.",
  }),
  observation({
    observationId: "PCT-CHSL-PYQ-W1-002",
    sourceId: "PCT-CHSL-PYQ-W1-002",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-88-Q66",
    subtopic: "PCT-CP-001 — Whole from part",
    representation: "REVERSE_WHOLE_FROM_PERCENT_VALUE_MCQ",
    notes: "If 125% of x is 100, then x = 100 × 100/125 = 80.",
  }),
  observation({
    observationId: "PCT-CHSL-PYQ-W1-003",
    sourceId: "PCT-CHSL-PYQ-W1-003",
    examId: "SSC_CHSL",
    examYear: 2013,
    sourceAttribution: "SSC 10+2-2013",
    questionRef: "DISHA-PDF-PAGE-88-Q67",
    subtopic: "PCT-CP-004 — Reverse percentage mapping",
    representation: "PERCENT_LESS_REVERSE_BASE_MCQ",
    notes: "Mahuya has 10% fewer marks than Supriyo and has 81 marks, so 81 is 90% of Supriyo's score and the original score is 90.",
  }),
  observation({
    observationId: "PCT-CHSL-PYQ-W1-004",
    sourceId: "PCT-CHSL-PYQ-W1-004",
    examId: "SSC_CHSL",
    examYear: 2013,
    sourceAttribution: "SSC 10+2-2013",
    questionRef: "DISHA-PDF-PAGE-88-Q68",
    subtopic: "PCT-CP-005 — Ratio to percentage comparison with base switch",
    representation: "PERCENT_MORE_TO_PERCENT_LESS_BASE_SWITCH_MCQ",
    notes: "If Shyam's income is 100, Ram's is 120. Shyam is therefore 20/120 × 100 = 16 2/3% below Ram.",
  }),
  observation({
    observationId: "PCT-CHSL-PYQ-W1-005",
    sourceId: "PCT-CHSL-PYQ-W1-005",
    examId: "SSC_CHSL",
    examYear: 2014,
    sourceAttribution: "SSC 10+2-2014",
    questionRef: "DISHA-PDF-PAGE-88-Q69",
    subtopic: "PCT-CP-002 — Another percentage from a known percentage",
    representation: "CHAINED_PERCENTAGE_OF_PERCENTAGE_MCQ",
    notes: "One percent of one percent of 25% of 1000 is 0.01 × 0.01 × 0.25 × 1000 = 0.025.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_PERCENTAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  packageCounts: Object.freeze({ "PCT-002": 5 } as const),
  profileObservationCounts: Object.freeze({ SSC_CHSL: 5 } as const),
  excludedAmbiguousCglTierQuestions: Object.freeze([
    "DISHA-PDF-PAGE-91-Q48",
    "DISHA-PDF-PAGE-91-Q49",
    "DISHA-PDF-PAGE-91-Q50",
  ] as const),
  excludedBankingQuestionsForSeparateWave: Object.freeze([
    "DISHA-PDF-PAGE-91-Q40",
    "DISHA-PDF-PAGE-91-Q41",
    "DISHA-PDF-PAGE-91-Q42",
    "DISHA-PDF-PAGE-91-Q43",
    "DISHA-PDF-PAGE-91-Q44",
    "DISHA-PDF-PAGE-91-Q45",
    "DISHA-PDF-PAGE-91-Q46",
    "DISHA-PDF-PAGE-91-Q47",
  ] as const),
  frequencyCalibrationAllowed: false,
} as const);
