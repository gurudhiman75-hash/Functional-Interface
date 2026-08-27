export type Sea002Cp008SourceRecord = Readonly<{
  id: string;
  lineage: "RRB" | "SBI" | "IBPS" | "BANKING_PRACTICE" | "EXTENDED_DISCOVERY";
  sourceLabel: string;
  sourceUrl: string;
  schema: "ALT8_CORNERS_MIDDLES" | "SIDEPAIR8" | "ALT12_CORNER_PLUS_TWO_SIDE";
  facingMode: "CORNERS_IN_SIDES_OUT" | "CORNERS_OUT_SIDES_IN" | "ALL_IN" | "MIXED";
  evidenceStrength: "OFFICIAL_PAPER_RELAY" | "EXAM_BOOK_RELAY" | "ESTABLISHED_PREP_ARCHIVE" | "DISCOVERY_ONLY";
  prototypeIds: readonly string[];
  notes: string;
}>;

export const SEA002_CP008_SOURCE_EVIDENCE_V1: readonly Sea002Cp008SourceRecord[] = Object.freeze([
  Object.freeze({
    id: "CP008-SRC-001",
    lineage: "RRB",
    sourceLabel: "RRB NTPC CBT 2 Level-3, 14 Jun 2022 Shift 2 (relayed by Testbook)",
    sourceUrl: "https://testbook.com/question-answer/read-the-given-seating-arrangement-information-and--62b4347bb4b4ee6daa5b362e",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "CORNERS_IN_SIDES_OUT",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-001"]),
    notes: "Eight people; four corners face centre and four side-middle seats face outside; square opposite/relative queries.",
  }),
  Object.freeze({
    id: "CP008-SRC-002",
    lineage: "SBI",
    sourceLabel: "SBI Clerk 2019 seating practice relay (Embibe/Arihant)",
    sourceUrl: "https://www.embibe.com/books/SBI-Clerical-Cadre-Junior-Associates%2C-Preliminary-Examination-2019/Sitting-Arrangement/Practice-Questions/kve383517-1",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "CORNERS_IN_SIDES_OUT",
    evidenceStrength: "EXAM_BOOK_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-001"]),
    notes: "Confirms the classic eight-seat alternating corner/middle geometry in banking material.",
  }),
  Object.freeze({
    id: "CP008-SRC-003",
    lineage: "IBPS",
    sourceLabel: "IBPS PO Prelims 2023 solved-paper relay",
    sourceUrl: "https://adisclasses.in/all-exams/banking-and-govt-exams/ibps-po-preparation/ibps-po-previous-year-papers/ibps-po-prelims-2023-solved-paper-part-1/",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "CORNERS_OUT_SIDES_IN",
    evidenceStrength: "EXAM_BOOK_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-002"]),
    notes: "Reverse role-facing rule proves that inward/outward assignment is a source variant rather than a fixed square assumption.",
  }),
  Object.freeze({
    id: "CP008-SRC-004",
    lineage: "IBPS",
    sourceLabel: "IBPS RRB practice archive, 31 Aug 2020",
    sourceUrl: "https://www.bankersadda.com/wp-content/uploads/2020/08/31192718/RRB-31st-August.pdf",
    schema: "SIDEPAIR8",
    facingMode: "ALL_IN",
    evidenceStrength: "ESTABLISHED_PREP_ARCHIVE",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-003"]),
    notes: "Eight people, two persons on each side, all facing centre; opposite-side correspondence is explicit.",
  }),
  Object.freeze({
    id: "CP008-SRC-005",
    lineage: "IBPS",
    sourceLabel: "IBPS Clerk practice archive, 12 Nov 2020",
    sourceUrl: "https://www.bankersadda.com/wp-content/uploads/2020/11/11224426/IBPS-Clerk-12th-November.pdf",
    schema: "SIDEPAIR8",
    facingMode: "MIXED",
    evidenceStrength: "ESTABLISHED_PREP_ARCHIVE",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-004"]),
    notes: "Eight people, two persons on each side, mixed inward/outward facing with facing relations embedded in clues.",
  }),
  Object.freeze({
    id: "CP008-SRC-006",
    lineage: "EXTENDED_DISCOVERY",
    sourceLabel: "12-person square-table extended variant relay",
    sourceUrl: "https://askfilo.com/user-question-answers-smart-solutions/twelve-persons-o-p-q-r-s-t-u-v-w-x-y-and-z-are-sitting-on-a-3430393334353138",
    schema: "ALT12_CORNER_PLUS_TWO_SIDE",
    facingMode: "CORNERS_IN_SIDES_OUT",
    evidenceStrength: "DISCOVERY_ONLY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-005"]),
    notes: "One person on each corner plus two on each side; retained only to test whether larger square scale creates a new solve mode. Not sufficient for permanent allocation by itself.",
  }),
]);

export const SEA002_CP008_SOURCE_DISCOVERY_STATUS = Object.freeze({
  checkpointId: "SEA-CP-008" as const,
  status: "WAVE01_SOURCE_DISCOVERY_OPEN" as const,
  sourceRecordCount: SEA002_CP008_SOURCE_EVIDENCE_V1.length,
  representedLineages: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V1.map((record) => record.lineage))]),
  representedSchemas: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V1.map((record) => record.schema))]),
  permanentQlAllocated: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
  nextFreeQlId: "SEA-QL-029" as const,
});
