export type PfcSourceEvidenceClassV2 =
  | "UPLOADED_REFERENCE_BOOK"
  | "INDEXED_PREVIOUS_YEAR_QUESTION"
  | "PREPARATION_RELEVANCE_ONLY";

export type PfcSourceSheetShapeV2 = "SQUARE" | "RECTANGLE" | "CIRCLE";

export type PfcTaskContractV2 =
  | "OPAQUE_CUT_UNFOLD_FORWARD"
  | "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE"
  | "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION";

export type PfcCutShapeV2 =
  | "CIRCLE_HOLE"
  | "SQUARE_OR_RECTANGULAR_CUT"
  | "DIAMOND_CUT"
  | "TRIANGLE_CUT"
  | "V_NOTCH"
  | "ROUNDED_NOTCH"
  | "STRAIGHT_SLIT";

export interface PfcSourceEvidenceV2 {
  evidenceId: string;
  evidenceClass: PfcSourceEvidenceClassV2;
  sourceName: string;
  exam?: string;
  examDate?: string;
  taskContracts: readonly PfcTaskContractV2[];
  sheetShapes: readonly PfcSourceSheetShapeV2[];
  cutShapes: readonly PfcCutShapeV2[];
  observation: string;
  locator: string;
}

export const PFC_001_SOURCE_EVIDENCE_V2: readonly PfcSourceEvidenceV2[] = Object.freeze([
  {
    evidenceId: "PFC-SRC-UPLOAD-DISHA-CHAPTER",
    evidenceClass: "UPLOADED_REFERENCE_BOOK",
    sourceName: "Disha Verbal & Non-Verbal Reasoning for Competitive Exams",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD", "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION"],
    sheetShapes: ["SQUARE", "RECTANGLE"],
    cutShapes: ["CIRCLE_HOLE", "DIAMOND_CUT"],
    observation:
      "The chapter explicitly distinguishes paper cutting (fold, cut, then choose the unfolded result) from transparent-sheet paper folding (fold an existing design/pattern and choose the superimposed result). Its introductory cutting example uses a diamond cut.",
    locator: "Uploaded reasoning book.pdf, Paper Cutting and Folding chapter, pp. 319-326",
  },
  {
    evidenceId: "PFC-SRC-UPLOAD-DISHA-REVERSE",
    evidenceClass: "UPLOADED_REFERENCE_BOOK",
    sourceName: "Disha Verbal & Non-Verbal Reasoning for Competitive Exams",
    taskContracts: ["OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE"],
    sheetShapes: ["SQUARE", "RECTANGLE"],
    cutShapes: ["CIRCLE_HOLE"],
    observation:
      "The exercise gives the unfolded punched pattern and asks the learner to choose the manner in which the paper was folded and punched, proving a reverse-inference task rather than only forward unfolding.",
    locator: "Uploaded reasoning book.pdf, Paper Cutting and Folding chapter, p. 324",
  },
  {
    evidenceId: "PFC-SRC-UPLOAD-AGGARWAL-TRANSPARENT",
    evidenceClass: "UPLOADED_REFERENCE_BOOK",
    sourceName: "Reasoning for Competitions, Radian Book Company (2022)",
    taskContracts: ["TRANSPARENT_PATTERN_FOLD_SUPERPOSITION"],
    sheetShapes: ["SQUARE"],
    cutShapes: [],
    observation:
      "Paper Folding is a separate chapter with 41 square transparent-sheet pattern-superposition questions. The text states vertical folds superimpose a mirror image and horizontal folds superimpose a water image; questions 40-41 are tagged SSC GD Constable 2019.",
    locator: "Uploaded reasoning_aggarwal.pdf, Chapter 31 Paper Folding, pp. 31-1..31-4",
  },
  {
    evidenceId: "PFC-SRC-UPLOAD-AGGARWAL-CUTTING",
    evidenceClass: "UPLOADED_REFERENCE_BOOK",
    sourceName: "Reasoning for Competitions, Radian Book Company (2022)",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD"],
    sheetShapes: ["SQUARE", "RECTANGLE", "CIRCLE"],
    cutShapes: ["CIRCLE_HOLE", "SQUARE_OR_RECTANGULAR_CUT", "TRIANGLE_CUT"],
    observation:
      "Paper Cutting is a separate 60-question chapter and contains indexed SSC GD, SSC CPO and SSC CHSL previous-year items. The chapter uses two-, three- and four-stage fold/cut sequences rather than one fixed square-quarter template.",
    locator: "Uploaded reasoning_aggarwal.pdf, Chapter 32 Paper Cutting, pp. 32-1..32-6",
  },
  {
    evidenceId: "PFC-SRC-PYQ-SSC-CPO-2019-CIRCLE",
    evidenceClass: "INDEXED_PREVIOUS_YEAR_QUESTION",
    sourceName: "Testbook",
    exam: "SSC CPO Tier-I",
    examDate: "2019-03-14",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD"],
    sheetShapes: ["CIRCLE"],
    cutShapes: ["CIRCLE_HOLE"],
    observation: "Indexed previous-year question explicitly starts with a circular piece of paper that is folded and cut.",
    locator: "https://testbook.com/question-answer/a-circular-piece-of-paper-is-folded-and-cut-as-sho--5da889caf60d5d01ba7e7a05",
  },
  {
    evidenceId: "PFC-SRC-PYQ-SSC-CHSL-2020-CIRCLE",
    evidenceClass: "INDEXED_PREVIOUS_YEAR_QUESTION",
    sourceName: "Testbook",
    exam: "SSC CHSL",
    examDate: "2021-04-15",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD"],
    sheetShapes: ["CIRCLE"],
    cutShapes: ["CIRCLE_HOLE", "TRIANGLE_CUT"],
    observation: "Official-paper index shows a circular paper folded and cut, requiring curved-boundary unfolding semantics.",
    locator: "https://testbook.com/question-answer/the-sequence-of-folding-a-piece-of-circular-paper--615552aa1f78d96cc6fc128f",
  },
  {
    evidenceId: "PFC-SRC-PYQ-SSC-CGL-2023-RECTANGLE",
    evidenceClass: "INDEXED_PREVIOUS_YEAR_QUESTION",
    sourceName: "Testbook",
    exam: "SSC CGL Tier-II",
    examDate: "2023",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD"],
    sheetShapes: ["RECTANGLE"],
    cutShapes: ["CIRCLE_HOLE"],
    observation:
      "Indexed SSC CGL Tier-II item explicitly describes a rectangular paper folded vertically and horizontally with three circular punches.",
    locator: "https://testbook.com/question-answer/a-paper-is-folded-and-cut-description-a-rectang--69e0bc9f3d5217e9b24aa319",
  },
  {
    evidenceId: "PFC-SRC-PYQ-SSC-MTS-2017-MIXED-CUT",
    evidenceClass: "INDEXED_PREVIOUS_YEAR_QUESTION",
    sourceName: "Testbook",
    exam: "SSC MTS",
    examDate: "2017-10-21",
    taskContracts: ["OPAQUE_CUT_UNFOLD_FORWARD"],
    sheetShapes: ["SQUARE", "RECTANGLE"],
    cutShapes: ["CIRCLE_HOLE", "SQUARE_OR_RECTANGULAR_CUT"],
    observation:
      "Indexed previous-year solution explicitly reports an unfolded pattern containing eight circular holes and four square-shaped holes, proving mixed cut-shape coverage.",
    locator: "https://testbook.com/question-answer/a-piece-of-paper-is-folded-and-cut-as-shown-below--5bae19a73cb67e40af5f3a96",
  },
  {
    evidenceId: "PFC-SRC-PYQ-SSC-CGL-2024-TRANSPARENT",
    evidenceClass: "INDEXED_PREVIOUS_YEAR_QUESTION",
    sourceName: "Testbook",
    exam: "SSC CGL Tier-I",
    examDate: "2024-09-23",
    taskContracts: ["TRANSPARENT_PATTERN_FOLD_SUPERPOSITION"],
    sheetShapes: ["SQUARE"],
    cutShapes: [],
    observation:
      "Official-paper index asks how a transparent patterned sheet appears after folding at the middle horizontal line, confirming continued SSC recurrence of transparent-sheet superposition as a separate mechanism.",
    locator: "https://testbook.com/question-answer/a-transparent-sheet-with-a-pattern-is-given-below--6716037dcdf38ca06dab6bf9",
  },
]);

export const PFC_001_SOURCE_SATURATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-001-SOURCE-SATURATION-AUDIT-V2" as const,
  auditDate: "2026-08-18" as const,
  supersedesSourceAudit: "PFC-001-EXAM-SOURCE-AUDIT-V1" as const,
  status: "SOURCE_GAP_REOPENED_ARCHITECTURE_SPLIT_REQUIRED" as const,
  sourceSheetShapesRequired: ["SQUARE", "RECTANGLE", "CIRCLE"] as const,
  taskContractsEstablished: [
    "OPAQUE_CUT_UNFOLD_FORWARD",
    "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE",
    "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION",
  ] as const,
  chapterOwnership: {
    pfc001: {
      name: "Paper Cutting, Punching and Unfolding",
      owns: ["OPAQUE_CUT_UNFOLD_FORWARD", "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE"] as const,
    },
    tpf001Candidate: {
      chapterCode: "TPF-001" as const,
      name: "Transparent Pattern Folding",
      owns: ["TRANSPARENT_PATTERN_FOLD_SUPERPOSITION"] as const,
      permanentQlAllocation: "NONE_DISCOVERY_REQUIRED" as const,
    },
  },
  cutShapesRequired: [
    "CIRCLE_HOLE",
    "SQUARE_OR_RECTANGULAR_CUT",
    "DIAMOND_CUT",
    "TRIANGLE_CUT",
    "V_NOTCH",
    "ROUNDED_NOTCH",
    "STRAIGHT_SLIT",
  ] as const,
  engineGaps: [
    "RECTANGULAR_SOURCE_SHEET_RUNTIME",
    "ANALYTIC_CIRCULAR_SOURCE_BOUNDARY",
    "CURVED_BOUNDARY_FOLD_AND_CUT_RENDERING",
    "POLYGON_AND_ORIENTED_CUT_GEOMETRY",
    "REVERSE_FOLD_PUNCH_SEARCH_SOLVER",
    "TRANSPARENT_PATTERN_SUPERPOSITION_SOLVER_SEPARATE_FROM_PFC",
  ] as const,
  oldV5CandidateStatus: "SUPERSEDED_NOT_SOURCE_SATURATED" as const,
  oldPermanentQl035To038Status: "HISTORICAL_CANDIDATE_ALLOCATION_REQUIRES_REMERGE_SPLIT_AFTER_DISCOVERY" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
  localizationAllowed: false,
  nextGate: "PFC_TPF_SOURCE_SATURATED_EXECUTABLE_DISCOVERY_V1" as const,
} as const);

export function pfcSourceSaturationCoverageV2() {
  const taskContracts = new Set<PfcTaskContractV2>();
  const sheetShapes = new Set<PfcSourceSheetShapeV2>();
  const cutShapes = new Set<PfcCutShapeV2>();
  const evidenceClasses = new Set<PfcSourceEvidenceClassV2>();
  for (const evidence of PFC_001_SOURCE_EVIDENCE_V2) {
    evidenceClasses.add(evidence.evidenceClass);
    evidence.taskContracts.forEach((value) => taskContracts.add(value));
    evidence.sheetShapes.forEach((value) => sheetShapes.add(value));
    evidence.cutShapes.forEach((value) => cutShapes.add(value));
  }
  return {
    evidenceCount: PFC_001_SOURCE_EVIDENCE_V2.length,
    evidenceClasses: [...evidenceClasses].sort(),
    taskContracts: [...taskContracts].sort(),
    sheetShapes: [...sheetShapes].sort(),
    cutShapes: [...cutShapes].sort(),
  };
}
