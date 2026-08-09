import {
  SYL_EXAM_TARGET_MIX_V1,
  SYL_QL_CLOSEOUT_DECISIONS_V1,
  SYL_SOURCE_SNAPSHOTS_V1,
  type SylExamTargetMixV1,
  type SylSourceSnapshotV1,
} from "./source-profile-closeout-v1";
import {
  SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1,
  SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1,
} from "./source-question-ledger-v1";

export type SylSourceSnapshotStatusV2 =
  | SylSourceSnapshotV1["status"]
  | "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE";

export interface SylSourceSnapshotV2 extends Omit<SylSourceSnapshotV1, "status"> {
  status: SylSourceSnapshotStatusV2;
}

export const SYL_SOURCE_SNAPSHOTS_V2: readonly SylSourceSnapshotV2[] = Object.freeze([
  ...SYL_SOURCE_SNAPSHOTS_V1.filter((entry) => entry.examProfile !== "PUNJAB"),
  {
    snapshotId: "SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1",
    examProfile: "PUNJAB",
    status: "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE",
    evidenceUrls: SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1.map((entry) => entry.sourceUrl),
    observedShapes: [
      "two or three classical statements",
      "two conclusions with a four-option follows mask",
      "one three-conclusion four-option combination",
      "possibility wording inside the standard conclusion shell",
      "same-versus-different witness traps",
      "universal chain and converse traps",
      "no observed ONLY or ONLY_A_FEW premise in the current sample",
      "no observed standalone modality-classification answer shell",
    ],
    authorityBoundary: [
      "Twelve secondary pages explicitly tagged to Punjab Police Constable official papers held during 2023-2025.",
      "This supports a provisional Punjab Police task-shape profile only.",
      "It is not an archived official-PDF corpus and must not be generalized to every Punjab-state recruitment exam.",
    ].join(" "),
  },
]);

export const SYL_EXAM_TARGET_MIX_V2: readonly SylExamTargetMixV1[] = Object.freeze([
  ...SYL_EXAM_TARGET_MIX_V1.filter((entry) => entry.profile !== "PUNJAB"),
  {
    profile: "PUNJAB",
    status: "PROVISIONAL_SOURCE_BACKED",
    entries: [
      {
        familyId: "PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION",
        weight: 90,
        sourceSnapshotIds: ["SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1"],
        note: "Primary provisional Punjab Police shell; 11 of 12 ledger questions use two conclusions and four options.",
      },
      {
        familyId: "PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION",
        weight: 10,
        sourceSnapshotIds: ["SYL-SNAPSHOT-PUNJAB-POLICE-2023-2025-V1"],
        note: "Minor advanced shell represented by one question in the current ledger.",
      },
    ],
    note: [
      "Provisional Punjab Police target mix derived from a 12-question secondary official-paper-tagged sample.",
      "Not a statewide Punjab profile and not claimed as a final historical frequency estimate.",
      "ONLY, ONLY_A_FEW and standalone modality-classification tasks receive zero weight until direct Punjab evidence is added.",
    ].join(" "),
  },
]);

export const SYL_SOURCE_PROFILE_CLOSEOUT_V2 = Object.freeze({
  authorityId: "SYL_001_SOURCE_PROFILE_CLOSEOUT_V2",
  status: "SOURCE_LEDGER_PROVISIONAL",
  supersedes: "SYL_001_SOURCE_PROFILE_CLOSEOUT_V1",
  baseCommit: "cf14902141176f09bff0b8524773ad173fc480cd",
  sourceSnapshotCount: SYL_SOURCE_SNAPSHOTS_V2.length,
  questionLedgerCount: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.questionCount,
  qlDecisionCount: SYL_QL_CLOSEOUT_DECISIONS_V1.length,
  mockWeightingFrozen: false,
  permanentQlFreezePermitted: false,
  profileStatus: {
    SSC: "PROVISIONAL_SOURCE_BACKED",
    BANKING: "PROVISIONAL_SOURCE_BACKED",
    CROSS_EXAM: "PROVISIONAL_SOURCE_BACKED",
    PUNJAB_POLICE: "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE",
    PUNJAB_STATEWIDE: "BLOCKED_NOT_REPRESENTATIVE",
  },
  blockers: [
    "Official Punjab Police paper PDFs are not archived; current evidence is secondary official-paper-tagged transcription.",
    "PSSSB, Punjab Patwari and Punjab Police SI question-level samples are not yet represented.",
    "Current 36-scenario pool has no exam-profile weighting mechanism.",
    "Current difficulty labels are static scenario labels rather than calibrated generated-question scores.",
    "Merge/remodel candidates must be implemented before permanent QL freeze.",
  ],
});

export { SYL_QL_CLOSEOUT_DECISIONS_V1 as SYL_QL_CLOSEOUT_DECISIONS_V2 };
