import { TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-exam-review";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";
import type { TsdCp007EnglishQlAuthoringSpec } from "./english-authoring-registry";

export type TsdCp007FrozenEnglishQl = Omit<TsdCp007EnglishQlAuthoringSpec, "editorialStatus"> & {
  readonly editorialStatus: "FROZEN";
};

export const TSD_CP007_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-007" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-22" as const,
  approvalInstruction: "approved" as const,
  approvedSourceBranch: "feat/tsd-cp007-executable-discovery-v1" as const,
  approvedSourceHead: "143231fa0458a264f1e6bb636c79639b9f272124" as const,
  approvedQlRange: "TSD-QL-084..TSD-QL-094" as const,
  approvedQlCount: 11 as const,
  approvedQuestionFamilies: 66 as const,
  approvedDifficulty: Object.freeze({ EASY: 25 as const, MEDIUM: 41 as const, HARD: 0 as const }),
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_SPLIT" as const,
  nextPermanentQl: "TSD-QL-095" as const,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "IN_PROGRESS" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP007_FROZEN_ENGLISH_REGISTRY: readonly TsdCp007FrozenEnglishQl[] = Object.freeze(
  TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    qlId: ql.qlId,
    authorityKey: ql.authorityKey,
    learnerContract: ql.learnerContract,
    objectPool: ql.objectPool,
    stemFamilies: ql.stemFamilies,
    editorialStatus: "FROZEN" as const,
  })),
);

if (JSON.stringify(TSD_CP007_FROZEN_ENGLISH_REGISTRY.map((entry) => entry.qlId)) !== JSON.stringify(TSD_CP007_PERMANENT_QL_IDS)) {
  throw new Error("TSD-CP-007 frozen English registry no longer matches permanent QL allocation");
}
