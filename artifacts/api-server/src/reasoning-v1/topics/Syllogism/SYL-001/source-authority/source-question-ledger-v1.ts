import type { SurfacePremiseForm } from "../foundation/types";

export type SylQuestionSourceProvenanceV1 =
  | "SECONDARY_OFFICIAL_PAPER_TAGGED"
  | "OFFICIAL_PDF_ARCHIVED";

export interface SylQuestionSourceLedgerEntryV1 {
  ledgerId: string;
  examProfile: "PUNJAB_POLICE";
  examName: "Punjab Police Constable";
  heldOn: string;
  shift: string;
  provenance: SylQuestionSourceProvenanceV1;
  sourceUrl: string;
  premiseCount: number;
  conclusionCount: number;
  optionCount: number;
  premiseForms: readonly SurfacePremiseForm[];
  taskShell: "CONCLUSION_FOLLOW_MASK";
  features: readonly (
    | "CLASSICAL_FORMS"
    | "POSSIBILITY_CONCLUSION_IN_STANDARD_SHELL"
    | "THREE_CONCLUSION_COMBINATION"
    | "SAME_VS_DIFFERENT_WITNESS_TRAP"
    | "CONVERSE_TRAP"
    | "CHAIN_INFERENCE"
  )[];
  note: string;
}

export const SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1: readonly SylQuestionSourceLedgerEntryV1[] = Object.freeze([
  {
    ledgerId: "SYL-PB-POLICE-2024-08-07-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2024-08-07",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--67f3dc487e4a21614ba3b37b",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["SOME", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "SAME_VS_DIFFERENT_WITNESS_TRAP"],
    note: "Two particular statements; neither proposed conclusion follows.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-05-13-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-05-13",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--68e59955e3d5ce18b0366373",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CONVERSE_TRAP"],
    note: "Converging universal statements; one existential converse follows under the selected exam convention.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2023-08-05-S2-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2023-08-05",
    shift: "2",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--69df80af905026db6c8272a0",
    premiseCount: 3,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "NO", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CHAIN_INFERENCE"],
    note: "Three-statement classical chain with one definite negative conclusion.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-06-10-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-06-10",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefu--68f904216289cd0835a85677",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CHAIN_INFERENCE"],
    note: "Two-link universal chain; both conclusions follow under the selected non-empty convention.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2024-08-08-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2024-08-08",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--67f3dc29f7b37165836fe035",
    premiseCount: 3,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["SOME", "NO", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "POSSIBILITY_CONCLUSION_IN_STANDARD_SHELL", "CHAIN_INFERENCE"],
    note: "A possibility-worded conclusion appears inside the ordinary two-conclusion four-option shell.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-06-04-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-06-04",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--690095171eef735fff021455",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["SOME", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "SAME_VS_DIFFERENT_WITNESS_TRAP"],
    note: "Two particular statements do not force the witnesses to be identical.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2023-09-05-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2023-09-05",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--667c12756dc217b0f16f0ce6",
    premiseCount: 3,
    conclusionCount: 3,
    optionCount: 4,
    premiseForms: ["ALL", "ALL", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "THREE_CONCLUSION_COMBINATION", "CHAIN_INFERENCE"],
    note: "Three-conclusion four-option combination with a witness propagated through a universal chain.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2024-08-08-S1-02",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2024-08-08",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--67f3dc2d4713d7539cae5070",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CHAIN_INFERENCE", "CONVERSE_TRAP"],
    note: "Two-link universal chain with one reverse-direction trap.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-06-02-S2-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-06-02",
    shift: "2",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--68fa469477071654a8915d5f",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["SOME", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CHAIN_INFERENCE"],
    note: "Existential witness transfers through a universal statement.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-06-07-S1-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-06-07",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--68f8735f42cd7166ff23fba3",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["SOME", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "SAME_VS_DIFFERENT_WITNESS_TRAP"],
    note: "One direct particular converse follows; the cross-witness conclusion does not.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2024-08-07-S1-02",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2024-08-07",
    shift: "1",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--67f3dc46f41e7c10be4285de",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "ALL"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CHAIN_INFERENCE"],
    note: "Universal chain with two following conclusions.",
  },
  {
    ledgerId: "SYL-PB-POLICE-2025-05-31-S2-01",
    examProfile: "PUNJAB_POLICE",
    examName: "Punjab Police Constable",
    heldOn: "2025-05-31",
    shift: "2",
    provenance: "SECONDARY_OFFICIAL_PAPER_TAGGED",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--68fb12934d1faafaab528690",
    premiseCount: 2,
    conclusionCount: 2,
    optionCount: 4,
    premiseForms: ["ALL", "SOME"],
    taskShell: "CONCLUSION_FOLLOW_MASK",
    features: ["CLASSICAL_FORMS", "CONVERSE_TRAP", "SAME_VS_DIFFERENT_WITNESS_TRAP"],
    note: "Universal plus particular statement; neither proposed universal conclusion follows.",
  },
]);

export const SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1 = Object.freeze({
  authorityId: "SYL_001_PUNJAB_POLICE_QUESTION_LEDGER_V1",
  status: "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE",
  questionCount: SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1.length,
  examYears: [2023, 2024, 2025] as const,
  scope: "Punjab Police Constable only",
  officialPdfArchivedCount: SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1.filter(
    (entry) => entry.provenance === "OFFICIAL_PDF_ARCHIVED",
  ).length,
  limitations: [
    "The pages are secondary transcriptions tagged to named official papers; official paper PDFs are not archived in this authority.",
    "The sample does not represent PSSSB, Punjab Patwari, Punjab Police SI or every Punjab-state recruitment exam.",
    "The sample is suitable for a provisional Punjab Police task-shape profile, not a final statewide frequency claim.",
  ],
});
