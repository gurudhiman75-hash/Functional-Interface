import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_ALGEBRA_WAVE3_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE3-P2" as const;

const HOLD_LEDGER =
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Algebra/ALG-HOLD-RESOLUTION-PASS-01.md";
const FREEZE_LEDGER =
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Algebra/ALG-FINAL-SOURCE-FIXTURE-LEDGER.md";

function ref(ledger: string, sourceId: string) {
  return `repo://${ledger}#${sourceId}`;
}

export const QUANT_V4_ALGEBRA_WAVE3_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  {
    observationId: "ALG-HR1-S02",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref(HOLD_LEDGER, "ALG-HR1-S02"),
    sourceLabel: "SSC CGL 2024 Tier-I, 10 Sep 2024 Shift 3",
    heldDate: "2024-09-10",
    shift: "Shift 3",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-10-S3",
    questionRef: "ALG-HR1-S02",
    packageId: "ALG-001",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 / ALG-QL-014 — Identity-form recognition and factorisation",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC CGL perfect-square-trinomial recognition fixture retained under the permanent identity-form contract.",
  },
  {
    observationId: "ALG-HR1-S03",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref(HOLD_LEDGER, "ALG-HR1-S03"),
    sourceLabel: "SSC CGL 2024 Tier-I, 26 Sep 2024 Shift 1",
    heldDate: "2024-09-26",
    shift: "Shift 1",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-26-S1",
    questionRef: "ALG-HR1-S03",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-022 — Classify 2×2 system solution state",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC CGL no-solution system-classification fixture; unique/no/infinite remain answer states of one contract.",
  },
  {
    observationId: "ALG-HR1-S04",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref(HOLD_LEDGER, "ALG-HR1-S04"),
    sourceLabel: "SSC CGL 2024 Tier-I, 11 Sep 2024 Shift 2",
    heldDate: "2024-09-11",
    shift: "Shift 2",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-11-S2",
    questionRef: "ALG-HR1-S04",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-022 — Classify 2×2 system solution state",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Independent dated SSC CGL coefficient-ratio system-classification fixture.",
  },
  {
    observationId: "ALG-HR1-S05",
    examId: "SSC_CGL_TIER_II",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref(HOLD_LEDGER, "ALG-HR1-S05"),
    sourceLabel: "SSC CGL 2022 Tier-II, held 06 Mar 2023",
    heldDate: "2023-03-06",
    paperId: "SSC-CGL-2022-TIER-II-2023-03-06",
    questionRef: "ALG-HR1-S05",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-023 — Parameter for system consistency or inconsistency",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC CGL Tier-II parameter-for-no-solution fixture. The source ledger does not state a shift, so none is inferred.",
  },
  {
    observationId: "ALG-FRZ-S08",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref(FREEZE_LEDGER, "ALG-FRZ-S08"),
    sourceLabel: "SSC CGL 2022 Tier-I, 12 Dec 2022 Shift 4",
    heldDate: "2022-12-12",
    shift: "Shift 4",
    paperId: "SSC-CGL-2022-TIER-I-2022-12-12-S4",
    questionRef: "ALG-FRZ-S08",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-010 / ALG-QL-031 — Construct quadratic under controlled root transformation",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC CGL transformed-root equation fixture whose target roots are α² and β².",
  },
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_ALGEBRA_WAVE3_NON_MIGRATED_SOURCE_IDS = Object.freeze([
  "ALG-HR1-S01", // SSC Selection Post is outside the current eleven-profile simulation contract.
  "ALG-HR1-S06", // RRB NTPC is outside the current eleven-profile simulation contract.
  "ALG-HR1-S07", // Allahabad High Court recruitment is comparable evidence, not current-profile evidence.
  "ALG-HR1-S08", // DSSSB is comparable evidence, not current-profile evidence.
  "ALG-HR1-S09", // Collection-level SSC corpus lacks a normalized paper/question identity here.
  "ALG-FRZ-S01", // RRB Group D is outside the current profile set.
  "ALG-FRZ-S02", // RRB NTPC is outside the current profile set.
  "ALG-FRZ-S03", // RRB JE is outside the current profile set.
  "ALG-FRZ-S04", // Target taxonomy is non-countable frequency evidence.
  "ALG-FRZ-S05", // Banking syllabus/taxonomy is non-countable frequency evidence.
  "ALG-FRZ-S06", // EMRS is comparable evidence, not current-profile evidence.
  "ALG-FRZ-S07", // DSSSB is comparable evidence, not current-profile evidence.
  "ALG-FRZ-S09", // UPPSC is comparable evidence, not current-profile evidence.
  "ALG-FRZ-S10", // OSSC is comparable evidence, not current-profile evidence.
  "ALG-FRZ-S11", // RRB NTPC is outside the current profile set.
  "ALG-FRZ-S12", // Banking/Insurance practice taxonomy is non-countable evidence.
  "ALG-FRZ-S13", // SSC CGL collection is not question-level normalized in this ledger.
] as const);
