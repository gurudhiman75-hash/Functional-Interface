import { TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import type { TsdCp009EnglishQl } from "./english-authoring-registry";
import { TSD_CP009_PERMANENT_QL_IDS } from "./ql-allocation";

export type TsdCp009FrozenEnglishQl = TsdCp009EnglishQl & {
  readonly editorialStatus: "FROZEN";
};

export const TSD_CP009_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-009" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-24" as const,
  approvalInstruction: "some stems need look up but feel ok" as const,
  approvedSourceBranch: "feat/tsd-cp009-executable-discovery-v1" as const,
  approvedSourceHead: "cf35bec161c28cf06141393dc9d5cadc3394f97d" as const,
  approvedSourceLayer: "TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY" as const,
  approvedQlRange: "TSD-QL-104..TSD-QL-114" as const,
  approvedQlCount: 11 as const,
  approvedQuestionFamilies: 66 as const,
  editoriallyPolishedStems: 12 as const,
  approvedDifficulty: Object.freeze({ EASY: 14 as const, MEDIUM: 52 as const, HARD: 0 as const }),
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_HARD_QUOTA" as const,
  nextPermanentQl: "TSD-QL-115" as const,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "IN_PROGRESS" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP009_FROZEN_ENGLISH_REGISTRY: readonly TsdCp009FrozenEnglishQl[] = Object.freeze(
  TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY.map((ql) => Object.freeze({
    ...ql,
    editorialStatus: "FROZEN" as const,
  })),
);

if (JSON.stringify(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((entry) => entry.qlId)) !== JSON.stringify(TSD_CP009_PERMANENT_QL_IDS)) {
  throw new Error("TSD-CP-009 frozen English registry no longer matches permanent QL allocation");
}
