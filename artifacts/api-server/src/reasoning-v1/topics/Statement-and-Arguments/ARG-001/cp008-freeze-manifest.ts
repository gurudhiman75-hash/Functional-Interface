import { ARG_CP006_FREEZE_AUTHORITY } from "./cp006-freeze-manifest.ts";
import { ARG_CP007_AUTHORITY } from "./cp007-exam-profile-generator-v2.ts";

export const ARG_CP008_CHECKPOINT_ID = "ARG-CP-008" as const;
export const ARG_CP008_FREEZE_AUTHORITY = "ARG_CP008_REAL_PAPER_CLOSURE_V1" as const;
export const ARG_CP008_CHAPTER_ID = "ARG-001" as const;
export const ARG_CP008_SUBJECT_CODE = "REAS-ARG" as const;

export const ARG_CP008_EXAM_PROFILES = Object.freeze([
  "SSC_RECENT_2X4",
  "BANKING_CLASSIC_2X5",
  "BANKING_COMBO_3X5",
  "BANKING_COMBO_4X5",
] as const);

export const ARG_CP008_LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const);

/**
 * CP008 closes the additive CP007 real-paper delivery layer. It intentionally
 * does not re-freeze cross-chapter registries, which must remain evolvable for
 * unrelated Question Studio packages. CP006 continues to pin the 29-file core.
 */
export const ARG_CP008_FROZEN_BLOBS = Object.freeze([
  Object.freeze([
    "artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp007-exam-profile-generator-v2.ts",
    "d3ead23d5192261c30c09ff64430ad7fa891c02b",
  ] as const),
  Object.freeze([
    "artifacts/api-server/src/routes/admin-question-studio-arguments-cp007-v2.ts",
    "71d4c47937e6370a957d166a4b28a6c8c832d752",
  ] as const),
  Object.freeze([
    "artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp007-exam-profile-proof-v2.test.ts",
    "d07984fb19dcd7bbe336e00cde6a5579656aa619",
  ] as const),
] as const);

export const ARG_CP008_FROZEN_CONTRACT = Object.freeze({
  chapterId: ARG_CP008_CHAPTER_ID,
  subjectCode: ARG_CP008_SUBJECT_CODE,
  checkpointId: ARG_CP008_CHECKPOINT_ID,
  authority: ARG_CP008_FREEZE_AUTHORITY,
  status: "FROZEN_CERTIFIED" as const,
  preservesCp006Authority: ARG_CP006_FREEZE_AUTHORITY,
  closesCp007Authority: ARG_CP007_AUTHORITY,
  examProfiles: ARG_CP008_EXAM_PROFILES,
  locales: ARG_CP008_LOCALES,
  permanentQlCount: 6 as const,
  cp007ProfileTemplateCount: 6 as const,
  cp006FrozenBlobCount: 29 as const,
  cp008FrozenBlobCount: 3 as const,
  questionStudioRuntimeMode: "REVIEW_ONLY_REAL_PAPER_PARITY" as const,
  manualApprovalRequired: true as const,
  persistenceAllowed: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: "LOCKED" as const,
});
