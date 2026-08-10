export type Sea001SourceExamFamily = "SSC" | "BANKING" | "RAILWAY" | "PUNJAB_STATE";
export type Sea001SourceEvidenceTier = "OFFICIAL_PAPER_INDEX" | "MEMORY_BASED_PAPER" | "CURRENT_EXAM_PREP_PATTERN";

export interface Sea001SourceEvidence {
  readonly id: string;
  readonly examFamily: Sea001SourceExamFamily;
  readonly examLabel: string;
  readonly evidenceTier: Sea001SourceEvidenceTier;
  readonly sourceUrl: string;
  readonly observedTopology: string;
  readonly observedFacingPolicy: string;
  readonly observedFeatures: readonly string[];
  readonly supportsCheckpoints: readonly ("SEA-CP-001" | "SEA-CP-002" | "SEA-CP-003" | "SEA-CP-004" | "SEA-CP-005")[];
  readonly note: string;
}

/**
 * External exam evidence only. These records validate that the V3-designed SEA-001
 * contracts are exam-relevant; they do not override, expand, or redefine the V3 authority.
 * URLs are public source-index pages captured during the 2026-08-10 source audit.
 */
export const SEA001_EXTERNAL_SOURCE_EVIDENCE: readonly Sea001SourceEvidence[] = [
  {
    id: "SEA-SRC-SSC-001",
    examFamily: "SSC",
    examLabel: "SSC CGL 2024 Tier-II Official Paper-I (20 Jan 2025)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/m-n-o-x-y-and-z-are-sitting-around-a-circular--679757d4e06459b23ddc2e0f",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_CENTRE",
    observedFeatures: ["IMMEDIATE_NEIGHBOUR", "SECOND_RIGHT", "NEGATIVE_ADJACENCY", "IMMEDIATE_LEFT_QUERY"],
    supportsCheckpoints: ["SEA-CP-003"],
    note: "Indexed as an SSC CGL official-paper question; six persons face the centre around a circular table.",
  },
  {
    id: "SEA-SRC-SSC-002",
    examFamily: "SSC",
    examLabel: "SSC CGL 2021 Tier-I Official Paper (11 Apr 2022 Shift 2)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/five-persons-are-sitting-in-a-row-facing-the-north--6276bd4805c9ee2bf71fa7da",
    observedTopology: "SINGLE_LINEAR_ROW",
    observedFacingPolicy: "ALL_FACE_NORTH",
    observedFeatures: ["EXTREME_ENDS", "MIDDLE", "IMMEDIATE_LEFT_RIGHT", "ATTRIBUTE_FREE_POSITION_LOGIC"],
    supportsCheckpoints: ["SEA-CP-001"],
    note: "Indexed as an SSC CGL official-paper question; five-person same-facing linear arrangement.",
  },
  {
    id: "SEA-SRC-SSC-003",
    examFamily: "SSC",
    examLabel: "SSC CGL 2022 Tier-II Official Paper (7 Mar 2023)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/seven-persons-are-sitting-around-a-circular-dining--6410a12ae7f116c4147b4692",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_CENTRE",
    observedFeatures: ["LEFT_RIGHT", "SEAT_EXCHANGE_HYPOTHETICAL", "POST_SWAP_QUERY"],
    supportsCheckpoints: ["SEA-CP-003"],
    note: "Supports the V3 hypothetical seat-exchange query family as an observed SSC pattern.",
  },
  {
    id: "SEA-SRC-BANK-001",
    examFamily: "BANKING",
    examLabel: "SBI PO Prelims Memory Based Paper (1 Nov 2023 Shift 1)",
    evidenceTier: "MEMORY_BASED_PAPER",
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-is-false--63c8c908e47423efab2735aa",
    observedTopology: "SINGLE_LINEAR_ROW",
    observedFacingPolicy: "MIXED_NORTH_SOUTH",
    observedFeatures: ["REFERENCE_PERSON_FACING", "INFERRED_FACING", "EXTREME_END", "KTH_LEFT_RIGHT", "NEIGHBOUR_FACING"],
    supportsCheckpoints: ["SEA-CP-002"],
    note: "Direct evidence for a single-row mixed-facing banking puzzle with inferred directions.",
  },
  {
    id: "SEA-SRC-BANK-002",
    examFamily: "BANKING",
    examLabel: "SBI PO Prelims Memory Based Paper (21 Nov 2021 Shift 3)",
    evidenceTier: "MEMORY_BASED_PAPER",
    sourceUrl: "https://testbook.com/question-answer/how-many-people-facing-outside--608a9bad1eacceff651758ae",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "MIXED_CENTRE_OUTWARD",
    observedFeatures: ["MIXED_FACING_STATE", "OPPOSITE_FACING_RELATION", "KTH_RIGHT", "DIRECTIONAL_GAP", "FACING_COUNT_QUERY"],
    supportsCheckpoints: ["SEA-CP-005"],
    note: "Direct mixed centre/outward circular banking evidence; facing is part of the solved state.",
  },
  {
    id: "SEA-SRC-BANK-003",
    examFamily: "BANKING",
    examLabel: "SBI PO Prelims Memory Based Paper (17 Dec 2022 Shift 2)",
    evidenceTier: "MEMORY_BASED_PAPER",
    sourceUrl: "https://testbook.com/question-answer/who-sits-to-the-immediate-right-of-the-person-who--6094060f6201fe4acdc1d150",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "MIXED_CENTRE_OUTWARD",
    observedFeatures: ["INFERRED_FACING", "LEFT_RIGHT_BY_REFERENCE_FACING", "DIRECTIONAL_COUNT", "NEIGHBOUR_FACING_RELATION"],
    supportsCheckpoints: ["SEA-CP-005"],
    note: "Confirms mixed-facing circular left/right inference at banking prelims level.",
  },
  {
    id: "SEA-SRC-BANK-004",
    examFamily: "BANKING",
    examLabel: "Oliveboard 2026 Bank Exams Seating Arrangement Practice",
    evidenceTier: "CURRENT_EXAM_PREP_PATTERN",
    sourceUrl: "https://www.oliveboard.in/blog/seating-arrangement-questions-for-bank-exams/",
    observedTopology: "LINEAR_AND_CIRCULAR",
    observedFacingPolicy: "SAME_AND_MIXED_FACING",
    observedFeatures: ["LINEAR", "CIRCULAR", "MIXED_FACING", "POSITION_FROM_END", "COUNT_BETWEEN", "IMMEDIATE_NEIGHBOURS"],
    supportsCheckpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-005"],
    note: "Current competitor-pattern corroboration only; exact historical paper evidence above remains the stronger source lane.",
  },
  {
    id: "SEA-SRC-RAIL-001",
    examFamily: "RAILWAY",
    examLabel: "RRB NTPC UG CBT-I Official Paper (18 Aug 2025 Shift 1)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/six-passengers-l-m-n-p-q-and-r-are-sitting-on--68de4501f418ba2e1bd515f0",
    observedTopology: "SINGLE_LINEAR_ROW",
    observedFacingPolicy: "ALL_FACE_NORTH",
    observedFeatures: ["EXTREME_END", "IMMEDIATE_BETWEEN", "SECOND_LEFT", "NEGATIVE_ADJACENCY", "IMMEDIATE_LEFT_QUERY"],
    supportsCheckpoints: ["SEA-CP-001"],
    note: "Indexed as an RRB NTPC 2025 official-paper question.",
  },
  {
    id: "SEA-SRC-RAIL-002",
    examFamily: "RAILWAY",
    examLabel: "RRB Group D Official Paper (6 Sep 2022 Shift 2)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/six-friends-u-v-w-x-y-and-z-are-sitting-in-a--6371f92619b34b941d97796d",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_OUTWARD",
    observedFeatures: ["IMMEDIATE_LEFT", "SECOND_RIGHT", "NEGATIVE_ADJACENCY", "OUTWARD_LEFT_RIGHT_REVERSAL"],
    supportsCheckpoints: ["SEA-CP-004"],
    note: "Direct official-paper index evidence for an all-outward circular arrangement.",
  },
  {
    id: "SEA-SRC-RAIL-003",
    examFamily: "RAILWAY",
    examLabel: "RRB NTPC 2022 CBT-2 Official Paper (17 Jun 2022 Shift 2)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/five-people-a-b-c-d-and-e-are-sitting-around--62b9cc78c86a71be1a3f6cba",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_CENTRE",
    observedFeatures: ["IMMEDIATE_NEIGHBOUR", "SECOND_LEFT_RIGHT", "NEIGHBOUR_QUERY"],
    supportsCheckpoints: ["SEA-CP-003"],
    note: "Railway centre-facing circular corroboration.",
  },
  {
    id: "SEA-SRC-PUNJAB-001",
    examFamily: "PUNJAB_STATE",
    examLabel: "Punjab Police Constable Official Paper-I & II (12 May 2025 Shift 2)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/how-many-people-sit-between-c-and-e--68f8a40ac91c5f84e02f8d40",
    observedTopology: "SINGLE_LINEAR_ROW",
    observedFacingPolicy: "ALL_FACE_NORTH",
    observedFeatures: ["END", "MIDDLE", "THIRD_RIGHT", "EXACT_COUNT_BETWEEN", "COUNT_QUERY"],
    supportsCheckpoints: ["SEA-CP-001"],
    note: "Direct Punjab-state official-paper index evidence for the CP-001 core.",
  },
  {
    id: "SEA-SRC-PUNJAB-002",
    examFamily: "PUNJAB_STATE",
    examLabel: "Punjab Police Constable Official Paper-I & II (5 Sep 2023 Shift 1)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/six-friends-p-q-r-s-t-u-are-sitting-around-a--667c12a7ac7559b423d15313",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_CENTRE",
    observedFeatures: ["IMMEDIATE_LEFT_RIGHT", "ADJACENCY", "NEIGHBOUR_QUERY"],
    supportsCheckpoints: ["SEA-CP-003"],
    note: "Direct Punjab-state official-paper index evidence for centre-facing circular seating.",
  },
  {
    id: "SEA-SRC-PUNJAB-003",
    examFamily: "PUNJAB_STATE",
    examLabel: "Punjab Police Constable Official Paper-I & II (6 Aug 2023 Shift 2)",
    evidenceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/six-people-a-b-c-d-e-and-f-are-sitting-around--69e0ca9a9d8bf7f5ca3fc8dd",
    observedTopology: "CIRCULAR_TABLE",
    observedFacingPolicy: "ALL_FACE_CENTRE",
    observedFeatures: ["THIRD_RIGHT", "SECOND_LEFT", "IMMEDIATE_LEFT", "KTH_LEFT_QUERY"],
    supportsCheckpoints: ["SEA-CP-003"],
    note: "Additional Punjab-state evidence for centre-facing k-th left/right semantics.",
  },
] as const;

export interface Sea001SourceAuditResult {
  readonly evidenceCount: number;
  readonly examFamiliesCovered: readonly Sea001SourceExamFamily[];
  readonly checkpointsCovered: readonly string[];
  readonly officialPaperIndexedFamilies: readonly Sea001SourceExamFamily[];
  readonly missingExamFamilies: readonly Sea001SourceExamFamily[];
  readonly missingCheckpoints: readonly string[];
  readonly invalidEvidenceCount: number;
  readonly passed: boolean;
  readonly limitation: string;
}

export function runSea001ExternalSourceAudit(): Sea001SourceAuditResult {
  const expectedFamilies: readonly Sea001SourceExamFamily[] = ["SSC", "BANKING", "RAILWAY", "PUNJAB_STATE"];
  const expectedCheckpoints = ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const;
  const examFamiliesCovered = [...new Set(SEA001_EXTERNAL_SOURCE_EVIDENCE.map((evidence) => evidence.examFamily))].sort() as Sea001SourceExamFamily[];
  const checkpointsCovered = [...new Set(SEA001_EXTERNAL_SOURCE_EVIDENCE.flatMap((evidence) => evidence.supportsCheckpoints))].sort();
  const officialPaperIndexedFamilies = [...new Set(SEA001_EXTERNAL_SOURCE_EVIDENCE
    .filter((evidence) => evidence.evidenceTier === "OFFICIAL_PAPER_INDEX")
    .map((evidence) => evidence.examFamily))].sort() as Sea001SourceExamFamily[];
  const missingExamFamilies = expectedFamilies.filter((family) => !examFamiliesCovered.includes(family));
  const missingCheckpoints = expectedCheckpoints.filter((checkpoint) => !checkpointsCovered.includes(checkpoint));
  const invalidEvidenceCount = SEA001_EXTERNAL_SOURCE_EVIDENCE.filter((evidence) =>
    !/^https:\/\//.test(evidence.sourceUrl)
    || evidence.observedFeatures.length === 0
    || evidence.supportsCheckpoints.length === 0).length;

  return {
    evidenceCount: SEA001_EXTERNAL_SOURCE_EVIDENCE.length,
    examFamiliesCovered,
    checkpointsCovered,
    officialPaperIndexedFamilies,
    missingExamFamilies,
    missingCheckpoints,
    invalidEvidenceCount,
    passed: missingExamFamilies.length === 0 && missingCheckpoints.length === 0 && invalidEvidenceCount === 0,
    limitation: "Bank-exam evidence includes memory-based paper indexes because many banking bodies do not publish reusable full question papers. External evidence validates exam relevance only; V3 remains the sole design authority.",
  };
}
