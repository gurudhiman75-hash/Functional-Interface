import { SEA002_CP008_SOURCE_EVIDENCE_V1, type Sea002Cp008SourceRecord } from "./source-evidence-v1.ts";

export type Sea002Cp008Wave02SourceRecord = Sea002Cp008SourceRecord | Readonly<{
  id: string;
  lineage: "RRB" | "SSC" | "STATE_GOVT" | "BANKING_PRACTICE" | "EXTENDED_DISCOVERY";
  sourceLabel: string;
  sourceUrl: string;
  schema: "ALT8_CORNERS_MIDDLES" | "SIDEPAIR8" | "VARIABLE_SIDE6" | "ALT12_CORNER_PLUS_TWO_SIDE";
  facingMode: "ALL_IN" | "ALL_OUT" | "MIXED";
  evidenceStrength: "OFFICIAL_PAPER_RELAY" | "ESTABLISHED_PREP_ARCHIVE" | "DISCOVERY_ONLY";
  prototypeIds: readonly string[];
  notes: string;
}>;

const WAVE02_ADDITIONAL_SOURCES: readonly Sea002Cp008Wave02SourceRecord[] = Object.freeze([
  Object.freeze({
    id: "CP008-SRC-007",
    lineage: "RRB",
    sourceLabel: "RRB Section Controller Official Paper, 12 Feb 2026 Shift 1",
    sourceUrl: "https://testbook.com/question-answer/a-b-c-d-j-k-l-and-m-are-sitting-around-a-squ--69a136333794729033a9fdfc",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "ALL_IN",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-006"]),
    notes: "Eight square seats using corners and side centres; every person faces the centre. Corner/side role is a placement attribute, not a facing rule.",
  }),
  Object.freeze({
    id: "CP008-SRC-008",
    lineage: "SSC",
    sourceLabel: "SSC JE Mechanical Official Paper, 14 Nov 2022 Shift 2",
    sourceUrl: "https://testbook.com/question-answer/l-m-n-o-p-q-r-and-s-are-eight-people-sitting--637e6695bccd943ec0d70c89",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "ALL_IN",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-006"]),
    notes: "Independent SSC lineage confirms the all-inward alternating corner/side-centre square family.",
  }),
  Object.freeze({
    id: "CP008-SRC-009",
    lineage: "STATE_GOVT",
    sourceLabel: "OSSC CGL 2022 Official Paper, 20 Oct Shift 1",
    sourceUrl: "https://testbook.com/question-answer/which-of-the-following-people-sit-in-the-middle-of--637cf21b3739ca2a1c47996d",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "ALL_OUT",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-007"]),
    notes: "Eight square seats, four corners + four side centres, all facing outside; tests whether uniform direction reversal is parameter-only.",
  }),
  Object.freeze({
    id: "CP008-SRC-010",
    lineage: "SSC",
    sourceLabel: "SSC MTS 2020 Official Paper, 2 Nov 2021 Shift 1",
    sourceUrl: "https://testbook.com/question-answer/ques--6230b50233510d8c6a53ba55",
    schema: "SIDEPAIR8",
    facingMode: "ALL_IN",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-003"]),
    notes: "Eight people, one pair on each side, no corner occupancy, all facing centre. Strong official support for SIDEPAIR8 beyond banking practice.",
  }),
  Object.freeze({
    id: "CP008-SRC-011",
    lineage: "RRB",
    sourceLabel: "RRB Group D Official Paper, 22 Sep 2022 Shift 3",
    sourceUrl: "https://testbook.com/question-answer/six-classmates-kanti-manoj-suman-divya-anuj-a--636e321b7e0ca79284ac99fc",
    schema: "VARIABLE_SIDE6",
    facingMode: "ALL_IN",
    evidenceStrength: "OFFICIAL_PAPER_RELAY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-009"]),
    notes: "Six people, no corners, uneven side occupancy (one opposite side pair occupied singly and the other two sides doubly). Requires a topology model beyond fixed two-per-side.",
  }),
  Object.freeze({
    id: "CP008-SRC-012",
    lineage: "BANKING_PRACTICE",
    sourceLabel: "IDBI AM/Executive reasoning archive, 22 Jun 2022",
    sourceUrl: "https://www.bankersadda.com/reasoning-ability-quiz-for-idbi-am-executive-2022-22nd-june/",
    schema: "ALT8_CORNERS_MIDDLES",
    facingMode: "MIXED",
    evidenceStrength: "ESTABLISHED_PREP_ARCHIVE",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-008"]),
    notes: "Corners and side centres remain meaningful while individual facing is mixed; this is not role-derived facing.",
  }),
  Object.freeze({
    id: "CP008-SRC-013",
    lineage: "EXTENDED_DISCOVERY",
    sourceLabel: "RBI Grade B square-table practice compilation, 12-person mixed facing",
    sourceUrl: "https://www.scribd.com/document/704981717/Seating-Arrangement-26-Puzzle-28PDF-29-RBI-Grade-27B-27-281-29",
    schema: "ALT12_CORNER_PLUS_TWO_SIDE",
    facingMode: "MIXED",
    evidenceStrength: "DISCOVERY_ONLY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-010"]),
    notes: "Twelve people, one per corner and two per side with mixed facing. Kept discovery-only; it cannot independently justify a permanent authority.",
  }),
]);

export const SEA002_CP008_SOURCE_EVIDENCE_V2: readonly Sea002Cp008Wave02SourceRecord[] = Object.freeze([
  ...SEA002_CP008_SOURCE_EVIDENCE_V1,
  ...WAVE02_ADDITIONAL_SOURCES,
]);

export const SEA002_CP008_WAVE02_GAPS = Object.freeze([
  Object.freeze({
    id: "CP008-GAP-001",
    family: "ALT8_UNIFORM_FACING",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-006", "SEA-CP008-PROT-007"] as const),
    status: "SOURCE_PROVEN_TOPOLOGY_MODEL_REUSABLE" as const,
    question: "Do all-in and all-out variants collapse to one uniform-facing authority?",
  }),
  Object.freeze({
    id: "CP008-GAP-002",
    family: "ALT8_MIXED_FACING",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-008"] as const),
    status: "SOURCE_PROVEN_NEEDS_DISCOVERY_GENERATOR" as const,
    question: "Does mixed individual facing on corner/side-centre geometry require its own solve authority?",
  }),
  Object.freeze({
    id: "CP008-GAP-003",
    family: "VARIABLE_SIDE_OCCUPANCY",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-009"] as const),
    status: "OFFICIAL_SOURCE_PROVEN_NEW_TOPOLOGY_PRIMITIVE_REQUIRED" as const,
    question: "How should uneven side occupancy and opposite-side identity be modeled without pretending seats are equally spaced corner/midpoint positions?",
  }),
  Object.freeze({
    id: "CP008-GAP-004",
    family: "ALT12_MIXED_FACING",
    prototypeIds: Object.freeze(["SEA-CP008-PROT-010"] as const),
    status: "DISCOVERY_ONLY_SOURCE_TOO_WEAK_FOR_ALLOCATION" as const,
    question: "Retain as a stress prototype only unless stronger exam-lineage evidence appears.",
  }),
] as const);

export const SEA002_CP008_SOURCE_SATURATION_V2 = Object.freeze({
  status: "WAVE02_SOURCE_EXPANSION_COMPLETE_SATURATION_NOT_YET_CLAIMED" as const,
  sourceRecordCount: SEA002_CP008_SOURCE_EVIDENCE_V2.length,
  officialPaperRelayCount: SEA002_CP008_SOURCE_EVIDENCE_V2.filter((record) => record.evidenceStrength === "OFFICIAL_PAPER_RELAY").length,
  representedSchemas: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V2.map((record) => record.schema))]),
  representedFacingModes: Object.freeze([...new Set(SEA002_CP008_SOURCE_EVIDENCE_V2.map((record) => record.facingMode))]),
  openGapCount: SEA002_CP008_WAVE02_GAPS.length,
  permanentQlAllocated: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
  nextFreeQlId: "SEA-QL-029" as const,
});
