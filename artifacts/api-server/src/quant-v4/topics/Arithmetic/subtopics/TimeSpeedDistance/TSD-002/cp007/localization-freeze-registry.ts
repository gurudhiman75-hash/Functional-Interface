import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP007_FINAL_HINDI_LOCALIZATION,
  TSD_CP007_FINAL_PUNJABI_LOCALIZATION,
} from "./localization-final";
import type { TsdCp007LocalizedQlSpec } from "./localization-authoring";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP007_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-007" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-22" as const,
  approvalInstruction: "approved continue" as const,
  approvedSourceBranch: "feat/tsd-cp007-executable-discovery-v1" as const,
  approvedSourceHead: "26a93b66f8680566509c49ae3b41c275996f0d12" as const,
  englishFreezeStatus: "FROZEN" as const,
  hindiFreezeStatus: "FROZEN" as const,
  punjabiFreezeStatus: "FROZEN" as const,
  qlRange: "TSD-QL-084..TSD-QL-094" as const,
  qlCount: 11 as const,
  familiesPerLocale: 66 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  hindiPreferredSpeedTerm: "गति" as const,
  hindiBannedSpeedTerm: "चाल" as const,
  nextQl: "TSD-QL-095" as const,
  questionStudioIntegrationStatus: "READY_TO_REGISTER_REVIEW_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export type TsdCp007FrozenLocalizedQlSpec = Readonly<
  Omit<TsdCp007LocalizedQlSpec, "localizationStatus"> & {
    readonly localizationStatus: "FROZEN";
  }
>;

function freezeLocale(
  registry: readonly TsdCp007LocalizedQlSpec[],
): readonly TsdCp007FrozenLocalizedQlSpec[] {
  return Object.freeze(registry.map((ql) => Object.freeze({
    ...ql,
    localizationStatus: "FROZEN" as const,
  })));
}

export const TSD_CP007_FROZEN_HINDI_LOCALIZATION = freezeLocale(
  TSD_CP007_FINAL_HINDI_LOCALIZATION,
);

export const TSD_CP007_FROZEN_PUNJABI_LOCALIZATION = freezeLocale(
  TSD_CP007_FINAL_PUNJABI_LOCALIZATION,
);

const frozenQlIds = TSD_CP007_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId);
if (JSON.stringify(frozenQlIds) !== JSON.stringify(TSD_CP007_PERMANENT_QL_IDS)) {
  throw new Error("TSD-CP-007 localization freeze QL order differs from permanent allocation");
}
