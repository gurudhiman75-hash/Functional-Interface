export type SeaRealnessLane = "SSC" | "BANKING" | "PUNJAB_STATE";
export type SeaFamilyPackage = "SEA-001" | "SEA-002" | "SEA-003" | "UNRESOLVED";

export interface SeaExamRealnessEvidence {
  readonly id: string;
  readonly lane: SeaRealnessLane;
  readonly exam: string;
  readonly examDate: string;
  readonly shift: string;
  readonly sourceTier: "OFFICIAL_PAPER_INDEX" | "MEMORY_ANALYSIS" | "EXAM_ANALYSIS";
  readonly sourceUrl: string;
  readonly topology: string;
  readonly facingPolicy: string;
  readonly seatCount: number | null;
  readonly exactQuestionsInSet: number | null;
  readonly observedQuestionsRange: readonly [number, number] | null;
  readonly linkedQuestionLowerBound: number | null;
  readonly requiredPackage: SeaFamilyPackage;
  readonly observedQueryFeatures: readonly string[];
  readonly note: string;
}

/**
 * Realness evidence is deliberately separate from the frozen SEA-001 design authority.
 * It measures what target exams actually exposed and therefore informs future product
 * mixers/completeness gates. It never silently changes a permanent QL or frozen query mix.
 */
export const SEA_EXAM_REALNESS_EVIDENCE: readonly SeaExamRealnessEvidence[] = [
  {
    id: "SEA-REAL-SSC-001",
    lane: "SSC",
    exam: "SSC CGL 2025 Tier-II",
    examDate: "2026-01-18",
    shift: "Paper-I analysis",
    sourceTier: "EXAM_ANALYSIS",
    sourceUrl: "https://www.collegedekho.com/exam/ssc-cgl/paper-analysis",
    topology: "SIX_PERSON_SEATING_UNSPECIFIED",
    facingPolicy: "UNSPECIFIED",
    seatCount: 6,
    exactQuestionsInSet: null,
    observedQuestionsRange: [2, 3],
    linkedQuestionLowerBound: null,
    requiredPackage: "UNRESOLVED",
    observedQueryFeatures: ["LIGHT_SEATING_WEIGHTAGE"],
    note: "Section analysis reports a six-person seating arrangement and 2-3 seating questions; topology is not specified strongly enough to assign a package.",
  },
  {
    id: "SEA-REAL-SSC-002",
    lane: "SSC",
    exam: "SSC GD Constable 2025 Official Paper",
    examDate: "2025-02-07",
    shift: "Shift 3",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/eight-people-are-sitting-in-two-parallel-rows-cont--67da613caf6676a62c47fc25",
    topology: "TWO_PARALLEL_ROWS_4_PLUS_4",
    facingPolicy: "ROW1_SOUTH_ROW2_NORTH",
    seatCount: 8,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-002",
    observedQueryFeatures: ["FACING_EACH_OTHER", "COUNT_BETWEEN", "SECOND_RIGHT", "IMMEDIATE_RIGHT"],
    note: "Official-paper-index question proves that full SSC seating coverage extends beyond SEA-001 into parallel rows.",
  },
  {
    id: "SEA-REAL-SSC-003",
    lane: "SSC",
    exam: "SSC GD Constable 2025 Official Paper",
    examDate: "2025-02-13",
    shift: "Shift 2",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/eight-people-are-sitting-in-two-parallel-rows-cont--67da7112068ba3ce7aff8cd7",
    topology: "TWO_PARALLEL_ROWS_4_PLUS_4",
    facingPolicy: "ROW1_SOUTH_ROW2_NORTH",
    seatCount: 8,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-002",
    observedQueryFeatures: ["EXTREME_ENDS", "FACING_EACH_OTHER", "COUNT_BETWEEN", "SECOND_RIGHT"],
    note: "A second 2025 official-paper-index shift independently corroborates parallel-row SSC demand.",
  },
  {
    id: "SEA-REAL-BANK-001",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-03-16",
    shift: "Shift 1",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-1-16-march/",
    topology: "PARALLEL_ROWS_14_PERSONS",
    facingPolicy: "OPPOSING_ROWS",
    seatCount: 14,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-002",
    observedQueryFeatures: ["PARALLEL_ROW_SET"],
    note: "Five-question parallel-row seating set.",
  },
  {
    id: "SEA-REAL-BANK-002",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-03-16",
    shift: "Shift 1",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-1-16-march/",
    topology: "CIRCULAR_9_PERSONS",
    facingPolicy: "ALL_FACE_CENTRE",
    seatCount: 9,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["CIRCULAR_SET"],
    note: "Five-question nine-person centre-facing circular set.",
  },
  {
    id: "SEA-REAL-BANK-003",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-03-16",
    shift: "Shift 1",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-1-16-march/",
    topology: "LINEAR_WITH_FRUIT_ATTRIBUTE",
    facingPolicy: "ALL_FACE_NORTH",
    seatCount: null,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-003",
    observedQueryFeatures: ["ATTRIBUTE_LINKED_SEATING", "LINEAR_SET"],
    note: "Five-question north-facing linear seating set with a fruit variable; attribute-linked seating belongs outside SEA-001.",
  },
  {
    id: "SEA-REAL-BANK-004",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-08-04",
    shift: "Shift 1",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-prelims-exam-analysis-2025-shift-1-4th-august/",
    topology: "CIRCULAR_INSIDE",
    facingPolicy: "ALL_FACE_CENTRE",
    seatCount: null,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["CIRCULAR_SET"],
    note: "Five-question circular-inside seating set.",
  },
  {
    id: "SEA-REAL-BANK-005",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-08-04",
    shift: "Shift 1",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-prelims-exam-analysis-2025-shift-1-4th-august/",
    topology: "PARALLEL_ROWS",
    facingPolicy: "OPPOSING_ROWS",
    seatCount: null,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-002",
    observedQueryFeatures: ["PARALLEL_ROW_SET"],
    note: "Five-question parallel-row seating set in the same shift as a circular set.",
  },
  {
    id: "SEA-REAL-BANK-006",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-08-04",
    shift: "Shift 4",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-4-4th-august/",
    topology: "CIRCULAR_9_PERSONS",
    facingPolicy: "ALL_FACE_CENTRE",
    seatCount: 9,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["CIRCULAR_SET"],
    note: "Five-question nine-person circular set.",
  },
  {
    id: "SEA-REAL-BANK-007",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-08-04",
    shift: "Shift 4",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-4-4th-august/",
    topology: "SINGLE_ROW_8_PERSONS",
    facingPolicy: "UNSPECIFIED_SINGLE_ROW",
    seatCount: 8,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["LINEAR_SET"],
    note: "Five-question eight-person single-row seating set.",
  },
  {
    id: "SEA-REAL-BANK-008",
    lane: "BANKING",
    exam: "SBI PO Prelims 2025",
    examDate: "2025-03-24",
    shift: "Shift 2",
    sourceTier: "MEMORY_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2025-shift-2-24-march/",
    topology: "CIRCULAR_8_PERSONS",
    facingPolicy: "MIXED_CENTRE_OUTWARD",
    seatCount: 8,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["MIXED_FACING", "CIRCULAR_SET"],
    note: "Five-question mixed centre/outward circular seating set.",
  },
  {
    id: "SEA-REAL-BANK-009",
    lane: "BANKING",
    exam: "SBI Clerk Prelims 2025",
    examDate: "2025-02-27",
    shift: "Shift 1",
    sourceTier: "EXAM_ANALYSIS",
    sourceUrl: "https://www.bankersadda.com/sbi-clerk-exam-analysis-2025-shift-1-27-february/",
    topology: "SQUARE_8_PERSONS",
    facingPolicy: "CORNERS_INSIDE_EDGES_OUTSIDE",
    seatCount: 8,
    exactQuestionsInSet: 5,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: null,
    requiredPackage: "SEA-002",
    observedQueryFeatures: ["POLYGONAL_SEATING", "MIXED_FACING"],
    note: "Five-question square mixed-facing arrangement demonstrates the polygonal SEA-002 requirement.",
  },
  {
    id: "SEA-REAL-PUNJAB-001",
    lane: "PUNJAB_STATE",
    exam: "Punjab Police Constable Official Paper-I & II",
    examDate: "2025-05-22",
    shift: "Shift 2",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/how-many-people-are-sitting-between-t-and-r--68fc705a1ab682a6647ab75a",
    topology: "SINGLE_ROW_5_PERSONS",
    facingPolicy: "ALL_FACE_NORTH",
    seatCount: 5,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["COUNT_BETWEEN", "RIGHT_END", "POSITION_FROM_LEFT"],
    note: "Compact five-person same-facing row with direct count/position queries.",
  },
  {
    id: "SEA-REAL-PUNJAB-002",
    lane: "PUNJAB_STATE",
    exam: "Punjab Police Constable Official Paper-I & II",
    examDate: "2025-05-20",
    shift: "Shift 1",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/how-many-people-are-sitting-between-a-and-b--68e786c7d3c463a4cd632a53",
    topology: "SINGLE_ROW_5_PERSONS",
    facingPolicy: "ALL_FACE_NORTH",
    seatCount: 5,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 2,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["COUNT_BETWEEN", "COUNT_TO_RIGHT"],
    note: "At least two indexed child questions share the same five-person arrangement; do not infer the final set size from the index alone.",
  },
  {
    id: "SEA-REAL-PUNJAB-003",
    lane: "PUNJAB_STATE",
    exam: "Punjab Police Constable Official Paper-I & II",
    examDate: "2025-06-07",
    shift: "Shift 1",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/what-is-the-position-of-d-with-respect-to-c--68f870ddaf9144fb2e2da0b2",
    topology: "CIRCULAR_5_PERSONS",
    facingPolicy: "ALL_FACE_CENTRE",
    seatCount: 5,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["KTH_RIGHT", "IMMEDIATE_NEIGHBOUR", "POSITION_RELATIVE"],
    note: "Compact centre-facing circular arrangement.",
  },
  {
    id: "SEA-REAL-PUNJAB-004",
    lane: "PUNJAB_STATE",
    exam: "Punjab Police Constable Official Paper-I & II",
    examDate: "2025-06-05",
    shift: "Shift 2",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/who-sits-second-to-the-left-of-n--68f9d35b8d5df91854552eac",
    topology: "CIRCULAR_5_PERSONS",
    facingPolicy: "ALL_FACE_CENTRE",
    seatCount: 5,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["IMMEDIATE_RIGHT", "SECOND_LEFT", "ADJACENCY"],
    note: "A second 2025 compact centre-facing circular example.",
  },
  {
    id: "SEA-REAL-PUNJAB-005",
    lane: "PUNJAB_STATE",
    exam: "Punjab Police Constable Official Paper-I & II",
    examDate: "2024-07-30",
    shift: "Shift 1",
    sourceTier: "OFFICIAL_PAPER_INDEX",
    sourceUrl: "https://testbook.com/question-answer/seven-persons-a-b-c-d-e-f-and-g-are-sitting-i--67f3dcd9eb72c7d832bf4d11",
    topology: "SINGLE_ROW_7_PERSONS",
    facingPolicy: "ALL_FACE_NORTH",
    seatCount: 7,
    exactQuestionsInSet: null,
    observedQuestionsRange: null,
    linkedQuestionLowerBound: 1,
    requiredPackage: "SEA-001",
    observedQueryFeatures: ["COUNT_BETWEEN", "IMMEDIATE_RIGHT", "POSITION_FROM_LEFT"],
    note: "Seven-person same-facing row corroborates the compact Punjab Police lane.",
  },
] as const;

export interface SeaExamLaneSummary {
  readonly lane: SeaRealnessLane;
  readonly evidenceCount: number;
  readonly packagesObserved: readonly SeaFamilyPackage[];
  readonly exactSetSizesObserved: Readonly<Record<string, number>>;
  readonly seatCountsObserved: Readonly<Record<string, number>>;
  readonly topologyCount: number;
  readonly completenessStatus: "SEA001_SCOPE_SUPPORTED" | "REQUIRES_SEA002" | "REQUIRES_SEA002_AND_SEA003" | "SOURCE_BASE_TOO_NARROW";
  readonly productWeightFreezeReady: false;
}

function histogram(values: readonly (number | null)[]): Readonly<Record<string, number>> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (value === null) continue;
    const key = String(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => Number(left) - Number(right)));
}

export function summarizeSeaExamLane(lane: SeaRealnessLane): SeaExamLaneSummary {
  const records = SEA_EXAM_REALNESS_EVIDENCE.filter((record) => record.lane === lane);
  const packagesObserved = [...new Set(records.map((record) => record.requiredPackage))].sort() as SeaFamilyPackage[];
  let completenessStatus: SeaExamLaneSummary["completenessStatus"];
  if (lane === "BANKING" && packagesObserved.includes("SEA-002") && packagesObserved.includes("SEA-003")) {
    completenessStatus = "REQUIRES_SEA002_AND_SEA003";
  } else if (packagesObserved.includes("SEA-002")) {
    completenessStatus = "REQUIRES_SEA002";
  } else if (lane === "PUNJAB_STATE" && records.every((record) => record.exam.startsWith("Punjab Police"))) {
    completenessStatus = "SOURCE_BASE_TOO_NARROW";
  } else {
    completenessStatus = "SEA001_SCOPE_SUPPORTED";
  }
  return {
    lane,
    evidenceCount: records.length,
    packagesObserved,
    exactSetSizesObserved: histogram(records.map((record) => record.exactQuestionsInSet)),
    seatCountsObserved: histogram(records.map((record) => record.seatCount)),
    topologyCount: new Set(records.map((record) => record.topology)).size,
    completenessStatus,
    productWeightFreezeReady: false,
  };
}

export function summarizeSeaExamRealnessEvidence() {
  return {
    SSC: summarizeSeaExamLane("SSC"),
    BANKING: summarizeSeaExamLane("BANKING"),
    PUNJAB_STATE: summarizeSeaExamLane("PUNJAB_STATE"),
    weightingPolicy: "OBSERVED_COUNTS_ONLY_DO_NOT_CONVERT_TO_PRODUCT_PERCENTAGES_YET" as const,
  };
}
