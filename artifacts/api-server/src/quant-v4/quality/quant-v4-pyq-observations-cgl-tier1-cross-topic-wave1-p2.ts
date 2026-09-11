import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-CGL-TIER1-CROSS-TOPIC-PYQ-NORMALIZATION-WAVE1-P2" as const;

export const QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  {
    observationId: "CGL-T1-XTOP-W1-2024-09-09-S1-Q51",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: "library://file_00000000c95482438c82d805300a3107#page=3&question=51",
    sourceLabel: "30 Yearwise SSC CGL Solved Paper (English) 2024 — SSC CGL Tier-I, held 09 Sep 2024 Shift 1, Quantitative Aptitude Q51",
    heldDate: "2024-09-09",
    shift: "Shift 1",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-09-S1",
    questionRef: "YEARWISE-SSC-CGL-2024-P3-Q51",
    packageId: "PNL-001",
    topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-005 / PNL-QL-121 — Short weight at stated cost price to profit percentage",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Grocer charges for 1 kg at cost price but delivers 870 g. Profit = 130/870 × 100 = 14.94%. The solved-paper collection preserves Tier-I date/shift identity; evidence remains VERIFIED_PYQ_COLLECTION rather than OFFICIAL_PAPER.",
  },
  {
    observationId: "CGL-T1-XTOP-W1-2023-07-27-S2-Q29",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: "library://file_000000003d58820880870d8465ef40c5#page=2&question=29",
    sourceLabel: "30 Yearwise SSC CGL Solved Paper (English) 2023 — SSC CGL Tier-I, held 27 Jul 2023 Shift 2, Quantitative Aptitude Q29",
    heldDate: "2023-07-27",
    shift: "Shift 2",
    paperId: "SSC-CGL-2023-TIER-I-2023-07-27-S2",
    questionRef: "YEARWISE-SSC-CGL-2023-P2-Q29",
    packageId: "TMW-001",
    topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-002 — Combined work and rate reconstruction",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "P, Q and R take 9, 12 and 18 days. Combined one-day work = 1/9 + 1/12 + 1/18 = 1/4. The solved-paper collection preserves Tier-I date/shift identity; evidence remains VERIFIED_PYQ_COLLECTION rather than OFFICIAL_PAPER.",
  },
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  normalizedObservationCount: QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  sourceFiles: Object.freeze([
    "file_00000000c95482438c82d805300a3107 — 30 Yearwise SSC CGL Solved Paper (English) 2024.pdf",
    "file_000000003d58820880870d8465ef40c5 — 30 Yearwise SSC CGL Solved Paper (English) 2023.pdf",
  ] as const),
  paperIdentityResolved: true,
  heldDateResolved: true,
  shiftResolved: true,
  packageCounts: Object.freeze({ "PNL-001": 1, "TMW-001": 1 } as const),
  profileObservationCounts: Object.freeze({ SSC_CGL_TIER_I: 2 } as const),
  frequencyCalibrationAllowed: false,
} as const);
