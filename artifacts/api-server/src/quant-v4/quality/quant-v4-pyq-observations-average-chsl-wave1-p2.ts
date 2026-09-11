import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_AVERAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-AVERAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-AVERAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type AverageChslWave1ExamId = Extract<QuantV4PyqExamId, "SSC_CHSL">;

// Reuse the same unresolved year-level identities already used for this source's
// SSC 10+2 observations. A year label is not promoted into a fictitious dated paper.
const UNRESOLVED_PAPER_ID_BY_YEAR: Readonly<Record<number, string>> = Object.freeze({
  2012: "SSC-CHSL-COLLECTION-2012-PAPER-IDENTITY-UNRESOLVED",
  2013: "SSC-CHSL-COLLECTION-2013-PAPER-IDENTITY-UNRESOLVED",
  2014: "SSC-CHSL-COLLECTION-2014-PAPER-IDENTITY-UNRESOLVED",
});

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: AverageChslWave1ExamId;
  examYear: 2012 | 2013 | 2014;
  sourceAttribution: string;
  questionRef: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const paperId = UNRESOLVED_PAPER_ID_BY_YEAR[input.examYear];
  if (!paperId) {
    throw new Error(`Missing Average CHSL Wave 1 unresolved paper identity for ${input.examYear}.`);
  }

  return Object.freeze({
    observationId: input.observationId,
    examId: input.examId,
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: ref(input.sourceId),
    sourceLabel: `Disha SSC Mathematics Guide collection attribution: ${input.sourceAttribution}; exact paper date/shift not preserved`,
    paperId,
    questionRef: input.questionRef,
    packageId: "AVG-001",
    topic: "Arithmetic — Average",
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_AVERAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "AVG-CHSL-PYQ-W1-001",
    sourceId: "AVG-CHSL-PYQ-W1-001",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-65-Q43",
    subtopic: "AVG-CP-003 — Increment/decrement from a newly added score",
    representation: "NEW_SCORE_CHANGES_AVERAGE_MCQ",
    notes: "A batsman scores 63 in the 12th innings and raises the average by 2. Solving (11A + 63)/12 = A + 2 gives old average 39 and new average 41.",
  }),
  observation({
    observationId: "AVG-CHSL-PYQ-W1-002",
    sourceId: "AVG-CHSL-PYQ-W1-002",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-65-Q44",
    subtopic: "AVG-CP-002 — Symmetric AP properties for consecutive even numbers",
    representation: "CONSECUTIVE_EVEN_NUMBERS_AVERAGE_MCQ",
    notes: "Four consecutive even numbers with average 9 are 6, 8, 10 and 12; the largest is 12.",
  }),
  observation({
    observationId: "AVG-CHSL-PYQ-W1-003",
    sourceId: "AVG-CHSL-PYQ-W1-003",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-65-Q45",
    subtopic: "AVG-CP-003 — Replacement and deviation",
    representation: "REPLACEMENT_AVERAGE_SHIFT_MCQ",
    notes: "Replacing a 55 kg crewman raises the average of 12 crewmen by 1/3 kg, so the replacement is 55 + 12 × 1/3 = 59 kg.",
  }),
  observation({
    observationId: "AVG-CHSL-PYQ-W1-004",
    sourceId: "AVG-CHSL-PYQ-W1-004",
    examId: "SSC_CHSL",
    examYear: 2013,
    sourceAttribution: "SSC 10+2-2013",
    questionRef: "DISHA-PDF-PAGE-65-Q46",
    subtopic: "AVG-CP-004 — Weighted and combined aggregation",
    representation: "COMBINED_GROUP_AVERAGE_MCQ",
    notes: "Thirty values average 40 and forty values average 30. Combined average = (30×40 + 40×30)/70 = 34 2/7.",
  }),
  observation({
    observationId: "AVG-CHSL-PYQ-W1-005",
    sourceId: "AVG-CHSL-PYQ-W1-005",
    examId: "SSC_CHSL",
    examYear: 2014,
    sourceAttribution: "SSC 10+2-2014",
    questionRef: "DISHA-PDF-PAGE-65-Q47",
    subtopic: "AVG-CP-004 — Weighted subgroup aggregation with unknown total count",
    representation: "SUBGROUP_AVERAGE_UNKNOWN_COUNT_MCQ",
    notes: "Overall average salary is 8000, seven technicians average 12000, and the rest average 6000. Solving 8000n = 7×12000 + (n−7)×6000 gives n = 21.",
  }),
  observation({
    observationId: "AVG-CHSL-PYQ-W1-006",
    sourceId: "AVG-CHSL-PYQ-W1-006",
    examId: "SSC_CHSL",
    examYear: 2014,
    sourceAttribution: "SSC 10+2-2014",
    questionRef: "DISHA-PDF-PAGE-65-Q48",
    subtopic: "AVG-CP-003 — Family-age shift with newborn member",
    representation: "FAMILY_AGE_NEWBORN_SHIFT_MCQ",
    notes: "Three years ago five members averaged 17. Their current total before the baby is 85 + 15 = 100; six members now average 17, so the baby's age is 102 − 100 = 2 years.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_AVERAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  packageCounts: Object.freeze({ "AVG-001": 6 } as const),
  profileObservationCounts: Object.freeze({ SSC_CHSL: 6 } as const),
  cpCoverage: Object.freeze([
    "AVG-CP-002",
    "AVG-CP-003",
    "AVG-CP-004",
  ] as const),
  excludedAmbiguousCglTierQuestions: Object.freeze([
    "DISHA-PDF-PAGE-67-Q18",
    "DISHA-PDF-PAGE-67-Q19",
    "DISHA-PDF-PAGE-67-Q20",
    "DISHA-PDF-PAGE-67-Q21",
    "DISHA-PDF-PAGE-67-Q22",
    "DISHA-PDF-PAGE-67-Q23",
  ] as const),
  excludedBankingQuestionsForSeparateWave: Object.freeze([
    "DISHA-PDF-PAGE-64-Q33",
    "DISHA-PDF-PAGE-65-Q34",
    "DISHA-PDF-PAGE-65-Q35",
    "DISHA-PDF-PAGE-65-Q36",
    "DISHA-PDF-PAGE-65-Q49",
    "DISHA-PDF-PAGE-65-Q50",
    "DISHA-PDF-PAGE-65-Q51",
    "DISHA-PDF-PAGE-65-Q52",
  ] as const),
  selectionCalibrationAllowed: false,
  frequencyCalibrationAllowed: false,
} as const);
