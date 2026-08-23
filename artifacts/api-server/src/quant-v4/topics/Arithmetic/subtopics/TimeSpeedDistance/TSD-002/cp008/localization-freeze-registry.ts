import { TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP008_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";
import type { TsdCp008LocalizationRegistry, TsdCp008LocalizedQl } from "./localization-types";

export const TSD_CP008_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-008" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-23" as const,
  approvalInstruction: "approved" as const,
  approvedSourceBranch: "feat/tsd-cp008-executable-discovery-v1" as const,
  approvedSourceHead: "dce8a35d4082e8032f0b9f868565299e0031fa1a" as const,
  approvedReviewArtifact: "TSD-CP008-HINDI-PUNJABI-QUESTIONS.md" as const,
  englishFreezeStatus: "FROZEN" as const,
  hindiFreezeStatus: "FROZEN" as const,
  punjabiFreezeStatus: "FROZEN" as const,
  qlRange: "TSD-QL-095..TSD-QL-103" as const,
  qlCount: 9 as const,
  familiesPerLocale: 54 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  hindiPreferredSpeedTerm: "गति" as const,
  hindiBannedSpeedTerm: "चाल" as const,
  nextQl: "TSD-QL-104" as const,
  questionStudioIntegrationStatus: "READY_TO_REGISTER_REVIEW_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export type TsdCp008FrozenLocalizedQl = Readonly<
  Omit<TsdCp008LocalizedQl, "localizationStatus"> & {
    readonly localizationStatus: "FROZEN";
  }
>;

export type TsdCp008FrozenLocalizationRegistry = Readonly<{
  readonly locale: TsdCp008LocalizationRegistry["locale"];
  readonly qls: readonly TsdCp008FrozenLocalizedQl[];
}>;

function freezeLocale(registry: TsdCp008LocalizationRegistry): TsdCp008FrozenLocalizationRegistry {
  return Object.freeze({
    locale: registry.locale,
    qls: Object.freeze(registry.qls.map((ql) => Object.freeze({
      ...ql,
      localizationStatus: "FROZEN" as const,
    }))),
  });
}

export const TSD_CP008_FROZEN_HINDI_LOCALIZATION = freezeLocale(TSD_CP008_HINDI_LOCALIZATION);
export const TSD_CP008_FROZEN_PUNJABI_LOCALIZATION = freezeLocale(TSD_CP008_PUNJABI_LOCALIZATION);

const frozenEnglishQlIds = TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId);
if (JSON.stringify(frozenEnglishQlIds) !== JSON.stringify(TSD_CP008_PERMANENT_QL_IDS)) {
  throw new Error("TSD-CP-008 localization freeze QL order differs from permanent allocation");
}
