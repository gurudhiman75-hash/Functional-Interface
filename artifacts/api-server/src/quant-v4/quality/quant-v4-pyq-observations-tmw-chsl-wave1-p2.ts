import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_TMW_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-TMW-CHSL-PYQ-NORMALIZATION-WAVE1-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-TMW-CHSL-PYQ-NORMALIZATION-WAVE1-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type TmwChslWave1ExamId = Extract<QuantV4PyqExamId, "SSC_CHSL">;

const UNRESOLVED_PAPER_ID_BY_YEAR: Readonly<Record<number, string>> = Object.freeze({
  2012: "SSC-CHSL-COLLECTION-2012-PAPER-IDENTITY-UNRESOLVED",
  2013: "SSC-CHSL-COLLECTION-2013-PAPER-IDENTITY-UNRESOLVED",
  2014: "SSC-CHSL-COLLECTION-2014-PAPER-IDENTITY-UNRESOLVED",
});

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: TmwChslWave1ExamId;
  examYear: 2012 | 2013 | 2014;
  sourceAttribution: string;
  questionRef: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const paperId = UNRESOLVED_PAPER_ID_BY_YEAR[input.examYear];
  if (!paperId) throw new Error(`Missing TMW CHSL Wave 1 unresolved paper identity for ${input.examYear}.`);

  return Object.freeze({
    observationId: input.observationId,
    examId: input.examId,
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: ref(input.sourceId),
    sourceLabel: `Disha SSC Mathematics Guide collection attribution: ${input.sourceAttribution}; exact paper date/shift not preserved`,
    paperId,
    questionRef: input.questionRef,
    packageId: "TMW-001",
    topic: "Arithmetic — Time and Work",
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_TMW_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "TMW-CHSL-PYQ-W1-001",
    sourceId: "TMW-CHSL-PYQ-W1-001",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-167-Q55",
    subtopic: "TMW-CP-004 — Partial work and staged participation",
    representation: "ONE_WORKER_STARTS_OTHER_FINISHES_MCQ",
    notes: "B completes 9/12 = 3/4 of the work in 9 days; A needs 5 days to finish the remaining 1/4 at a 20-day full-job rate.",
  }),
  observation({
    observationId: "TMW-CHSL-PYQ-W1-002",
    sourceId: "TMW-CHSL-PYQ-W1-002",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-167-Q57",
    subtopic: "TMW-CP-003 — Efficiency, time ratios and comparative productivity",
    representation: "EFFICIENCY_RATIO_TIME_DIFFERENCE_TOGETHER_MCQ",
    notes: "A is three times as efficient as B and takes 60 fewer days, giving A = 30 days and B = 90 days; together they take 45/2 days.",
  }),
  observation({
    observationId: "TMW-CHSL-PYQ-W1-003",
    sourceId: "TMW-CHSL-PYQ-W1-003",
    examId: "SSC_CHSL",
    examYear: 2013,
    sourceAttribution: "SSC 10+2-2013",
    questionRef: "DISHA-PDF-PAGE-167-Q58",
    subtopic: "TMW-CP-002 — Combined work and rate reconstruction",
    representation: "TWO_WORKER_COMBINED_TIME_MCQ",
    notes: "A takes 20 days and B 30 days, so their combined rate is 1/20 + 1/30 = 1/12 and the work takes 12 days.",
  }),
  observation({
    observationId: "TMW-CHSL-PYQ-W1-004",
    sourceId: "TMW-CHSL-PYQ-W1-004",
    examId: "SSC_CHSL",
    examYear: 2014,
    sourceAttribution: "SSC 10+2-2014",
    questionRef: "DISHA-PDF-PAGE-167-Q59",
    subtopic: "TMW-CP-005 — Alternating and periodic schedules",
    representation: "ALTERNATE_DAY_COMPLETION_MCQ",
    notes: "A and B work on alternate days starting with A. Five two-day cycles complete 8/9 of the work and A finishes the remaining 1/9 on day 11.",
  }),
  observation({
    observationId: "TMW-CHSL-PYQ-W1-005",
    sourceId: "TMW-CHSL-PYQ-W1-005",
    examId: "SSC_CHSL",
    examYear: 2014,
    sourceAttribution: "SSC 10+2-2014",
    questionRef: "DISHA-PDF-PAGE-167-Q60",
    subtopic: "TMW-CP-010 — Staged, cyclic and level-based pipe operations",
    representation: "DELAYED_OUTLET_ACTIVATION_MCQ",
    notes: "A and B fill at 1/20 tank per minute for 7 minutes. With outlet C then opened the net rate is 1/60; the remaining 13/20 takes 39 more minutes, total 46 minutes.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_TMW_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  packageCounts: Object.freeze({ "TMW-001": 5 } as const),
  profileObservationCounts: Object.freeze({ SSC_CHSL: 5 } as const),
  cpCoverage: Object.freeze([
    "TMW-CP-002",
    "TMW-CP-003",
    "TMW-CP-004",
    "TMW-CP-005",
    "TMW-CP-010",
  ] as const),
  excludedCrossTopicQuestions: Object.freeze([
    "DISHA-PDF-PAGE-167-Q56",
  ] as const),
  selectionCalibrationAllowed: false,
  frequencyCalibrationAllowed: false,
} as const);
