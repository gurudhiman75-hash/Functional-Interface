import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_TSD_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-TSD-PYQ-NORMALIZATION-WAVE1-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/quality/QUANT-V4-TSD-PYQ-NORMALIZATION-WAVE1-P2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

type TsdWave1ExamId = Extract<QuantV4PyqExamId, "SSC_CHSL" | "IBPS_CLERK" | "SBI_PO">;

const UNRESOLVED_PAPER_ID_BY_EXAM_YEAR: Readonly<Record<string, string>> = Object.freeze({
  "SSC_CHSL:2012": "SSC-CHSL-COLLECTION-2012-PAPER-IDENTITY-UNRESOLVED",
  "SSC_CHSL:2013": "SSC-CHSL-COLLECTION-2013-PAPER-IDENTITY-UNRESOLVED",
  "IBPS_CLERK:2012": "IBPS-CLERK-COLLECTION-2012-PAPER-IDENTITY-UNRESOLVED",
  "IBPS_CLERK:2013": "IBPS-CLERK-COLLECTION-2013-PAPER-IDENTITY-UNRESOLVED",
  "SBI_PO:2011": "SBI-PO-COLLECTION-2011-PAPER-IDENTITY-UNRESOLVED",
});

function observation(input: {
  observationId: string;
  sourceId: string;
  examId: TsdWave1ExamId;
  examYear: 2011 | 2012 | 2013;
  sourceAttribution: string;
  questionRef: string;
  packageId: "TSD-001" | "TSD-002";
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const paperId = UNRESOLVED_PAPER_ID_BY_EXAM_YEAR[`${input.examId}:${input.examYear}`];
  if (!paperId) throw new Error(`Missing TSD Wave 1 unresolved paper identity for ${input.examId}/${input.examYear}.`);
  return Object.freeze({
    observationId: input.observationId,
    examId: input.examId,
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: ref(input.sourceId),
    sourceLabel: `Disha SSC Mathematics Guide collection attribution: ${input.sourceAttribution}; exact paper date/shift not preserved`,
    paperId,
    questionRef: input.questionRef,
    packageId: input.packageId,
    topic: "Arithmetic — Time, Speed & Distance",
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_TSD_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    observationId: "TSD-PYQ-W1-001",
    sourceId: "TSD-PYQ-W1-001",
    examId: "SSC_CHSL",
    examYear: 2012,
    sourceAttribution: "SSC 10+2-2012",
    questionRef: "DISHA-PDF-PAGE-191-Q68",
    packageId: "TSD-002",
    subtopic: "TSD-CP-008 — Train interaction with a moving observer",
    representation: "TRAIN_MOVING_OBSERVER_OPPOSITE_DIRECTION_MCQ",
    notes: "A 100 m train passes a man moving oppositely at 5 km/h in 7.2 s. Exact relative-speed reconstruction gives train speed 45 km/h.",
  }),
  observation({
    observationId: "TSD-PYQ-W1-002",
    sourceId: "TSD-PYQ-W1-002",
    examId: "SSC_CHSL",
    examYear: 2013,
    sourceAttribution: "SSC 10+2-2013",
    questionRef: "DISHA-PDF-PAGE-191-Q69",
    packageId: "TSD-001",
    subtopic: "TSD-CP-001 — Uniform motion and same-distance speed/time reconstruction",
    representation: "SAME_DISTANCE_CHANGED_TIME_SPEED_MCQ",
    notes: "At 80 km/h for 4.5 h the distance is 360 km; covering the same distance in 4 h requires 90 km/h.",
  }),
  observation({
    observationId: "TSD-PYQ-W1-003",
    sourceId: "TSD-PYQ-W1-003",
    examId: "IBPS_CLERK",
    examYear: 2012,
    sourceAttribution: "IBPS Clerk-2012",
    questionRef: "DISHA-PDF-PAGE-191-Q72",
    packageId: "TSD-001",
    subtopic: "TSD-CP-001 — Speed ratio with direct distance/time consequence",
    representation: "SPEED_RATIO_TO_TIME_MCQ",
    notes: "The bicycle covers 192 m in 8 s, so its speed is 24 m/s. The man moves at three-fourths of that speed, 18 m/s, and therefore covers 54 m in 3 s.",
  }),
  observation({
    observationId: "TSD-PYQ-W1-004",
    sourceId: "TSD-PYQ-W1-004",
    examId: "IBPS_CLERK",
    examYear: 2012,
    sourceAttribution: "IBPS Clerk-2012",
    questionRef: "DISHA-PDF-PAGE-191-Q73",
    packageId: "TSD-001",
    subtopic: "TSD-CP-001 — Speed from distance and time",
    representation: "DIRECT_SPEED_FROM_DISTANCE_TIME_MCQ",
    notes: "A bus covers 572 km in 13 h, giving an exact speed of 44 km/h.",
  }),
  observation({
    observationId: "TSD-PYQ-W1-005",
    sourceId: "TSD-PYQ-W1-005",
    examId: "IBPS_CLERK",
    examYear: 2013,
    sourceAttribution: "IBPS Clerk-2013",
    questionRef: "DISHA-PDF-PAGE-191-Q74",
    packageId: "TSD-002",
    subtopic: "TSD-CP-008 — Train interaction with a moving observer",
    representation: "TRAIN_MOVING_OBSERVER_OPPOSITE_DIRECTION_MCQ",
    notes: "A 210 m train crosses a man running oppositely at 9 km/h in 6 s. Relative speed is 126 km/h, so train speed is 117 km/h.",
  }),
  observation({
    observationId: "TSD-PYQ-W1-006",
    sourceId: "TSD-PYQ-W1-006",
    examId: "SBI_PO",
    examYear: 2011,
    sourceAttribution: "SBI PO-2011",
    questionRef: "DISHA-PDF-PAGE-195-Q54",
    packageId: "TSD-002",
    subtopic: "TSD-CP-011 — Wheel rotational-to-linear translation",
    representation: "WHEEL_RPM_FROM_RADIUS_AND_LINEAR_SPEED_MCQ",
    notes: "With radius 35 cm and π=22/7, one revolution covers 2.2 m. At 33 km/h the wheel covers 550 m/min, requiring exactly 250 revolutions per minute.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  exactPaperIdentityResolved: false,
  heldDateResolved: false,
  shiftResolved: false,
  normalizedObservationCount: QUANT_V4_TSD_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  packageCounts: Object.freeze({ "TSD-001": 3, "TSD-002": 3 } as const),
  profileObservationCounts: Object.freeze({
    SSC_CHSL: 2,
    IBPS_CLERK: 3,
    SBI_PO: 1,
  } as const),
  excludedAmbiguousCglTierQuestions: Object.freeze([
    "DISHA-PDF-PAGE-195-Q56",
    "DISHA-PDF-PAGE-195-Q57",
    "DISHA-PDF-PAGE-195-Q58",
    "DISHA-PDF-PAGE-195-Q59",
    "DISHA-PDF-PAGE-195-Q60",
    "DISHA-PDF-PAGE-195-Q61",
    "DISHA-PDF-PAGE-195-Q62",
  ] as const),
  excludedOwnershipHybridQuestions: Object.freeze([
    "DISHA-PDF-PAGE-191-Q70",
    "DISHA-PDF-PAGE-191-Q71",
    "DISHA-PDF-PAGE-195-Q53",
  ] as const),
  excludedStageAmbiguousBankingQuestions: Object.freeze([
    "DISHA-PDF-PAGE-195-Q55",
  ] as const),
  frequencyCalibrationAllowed: false,
} as const);
