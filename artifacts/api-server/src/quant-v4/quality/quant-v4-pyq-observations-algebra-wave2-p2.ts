import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY =
  "QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE2-P2" as const;

const LEDGER =
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Algebra/ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2.md";

function ref(sourceId: string) {
  return `repo://${LEDGER}#${sourceId}`;
}

export const QUANT_V4_ALGEBRA_WAVE2_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  {
    observationId: "ALG-V2-S01",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref("ALG-V2-S01"),
    sourceLabel: "SSC CGL 2024 Tier-I Official Paper, 10 Sep 2024 Shift 2",
    heldDate: "2024-09-10",
    shift: "Shift 2",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-10-S2",
    questionRef: "ALG-V2-S01",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-041 — Unique 3×3 linear system",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC target-exam evidence for the permanent 3×3 linear-system contract. Provenance is retained from the final Algebra V2 source fixture ledger.",
  },
  {
    observationId: "ALG-V2-S02",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref("ALG-V2-S02"),
    sourceLabel: "SSC CGL 2024 Tier-I Official Paper, 12 Sep 2024 Shift 3",
    heldDate: "2024-09-12",
    shift: "Shift 3",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-12-S3",
    questionRef: "ALG-V2-S02",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-041 — Unique 3×3 linear system",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Second dated SSC CGL paper identity for the 3×3 linear-system contract; counted as an independent paper/question observation.",
  },
  {
    observationId: "ALG-V2-S03",
    examId: "SSC_CHSL",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref("ALG-V2-S03"),
    sourceLabel: "SSC CHSL 2024 Tier-I Official Paper, 03 Jul 2024 Shift 3",
    heldDate: "2024-07-03",
    shift: "Shift 3",
    paperId: "SSC-CHSL-2024-TIER-I-2024-07-03-S3",
    questionRef: "ALG-V2-S03",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 / ALG-QL-041 — Unique 3×3 linear system",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct SSC CHSL target-exam evidence for the same 3×3 linear-system semantic contract.",
  },
  {
    observationId: "ALG-V2-S05",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref("ALG-V2-S05"),
    sourceLabel: "SSC CGL 2025 Tier-I, held 18 Sep 2025 Shift 1",
    heldDate: "2025-09-18",
    shift: "Shift 1",
    paperId: "SSC-CGL-2025-TIER-I-2025-09-18-S1",
    questionRef: "ALG-V2-S05",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-010 / ALG-QL-042 — Direct cubic Vieta invariant",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Direct cubic-coefficient to root-invariant task. This evidence does not authorize a general cubic-equation solver.",
  },
  {
    observationId: "ALG-V2-S07",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: ref("ALG-V2-S07"),
    sourceLabel: "SSC CGL 2024 Tier-I Official Paper, 09 Sep 2024 Shift 3",
    heldDate: "2024-09-09",
    shift: "Shift 3",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-09-S3",
    questionRef: "ALG-V2-S07",
    packageId: "ALG-002",
    topic: "Advanced Mathematics",
    subtopic: "ALG-CP-012 / ALG-QL-043 — Positive-variable fixed-sum symmetric extremum",
    representation: "DIRECT_MCQ",
    language: "en",
    notes: "Only the direct SSC CGL fixture from the mixed direct/comparable ledger entry is counted; the comparable OSSC fixture remains excluded.",
  },
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_ALGEBRA_WAVE2_NON_MIGRATED_SOURCE_IDS = Object.freeze([
  "ALG-V2-S04", // RRB JE is outside the current eleven-profile Quant V4 simulation contract.
  "ALG-V2-S06", // RRB NTPC is outside the current eleven-profile Quant V4 simulation contract.
  "ALG-V2-S08", // Comparable OSSC evidence is useful for coverage but is not counted into SSC frequency denominators.
  "ALG-V2-S09", // SSC MTS is outside the current eleven-profile contract and remains composition-only rather than a permanent cubic-solver QL.
] as const);
