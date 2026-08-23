import { TSD_CP008_ENGLISH_AUTHORING_REGISTRY, type TsdCp008EnglishQlSpec } from "./english-authoring-registry";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";

export type TsdCp008FrozenEnglishQl = TsdCp008EnglishQlSpec & {
  readonly editorialStatus: "FROZEN";
};

export const TSD_CP008_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-008" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-23" as const,
  approvalInstruction: "approved" as const,
  approvedSourceBranch: "feat/tsd-cp008-executable-discovery-v1" as const,
  approvedSourceHead: "14f09b2c687eadd6f422dd6547e564cdf5f30305" as const,
  approvedQlRange: "TSD-QL-095..TSD-QL-103" as const,
  approvedQlCount: 9 as const,
  approvedQuestionFamilies: 54 as const,
  approvedDifficulty: Object.freeze({ EASY: 17 as const, MEDIUM: 37 as const, HARD: 0 as const }),
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_HARD_QUOTA" as const,
  nextPermanentQl: "TSD-QL-104" as const,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "IN_PROGRESS" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP008_FROZEN_ENGLISH_REGISTRY: readonly TsdCp008FrozenEnglishQl[] = Object.freeze(
  TSD_CP008_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    editorialStatus: "FROZEN" as const,
  })),
);

if (JSON.stringify(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((entry) => entry.qlId)) !== JSON.stringify(TSD_CP008_PERMANENT_QL_IDS)) {
  throw new Error("TSD-CP-008 frozen English registry no longer matches permanent QL allocation");
}
