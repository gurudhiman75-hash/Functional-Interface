import type { Sea002Cp006Caselet } from "../types.ts";
import { SEA002_CP006_LOCALIZATION_FREEZE } from "../permanent/freeze.ts";
import { localizeCp006PolishedReviewCaselet } from "./language-fidelity-polish.ts";
import type { Sea002Cp006TranslatedLocale } from "./readiness.ts";

export function localizeCp006FrozenCaselet(caselet: Sea002Cp006Caselet, locale: Sea002Cp006TranslatedLocale) {
  if (!SEA002_CP006_LOCALIZATION_FREEZE.freezeActive) {
    throw new Error("SEA-002 CP006 Hindi/Punjabi freeze is not active.");
  }
  const localized = localizeCp006PolishedReviewCaselet(caselet, locale);
  return Object.freeze({
    ...localized,
    localizationAuthority: "SEA002_CP006_HI_PA_EXPLANATION_PARITY_FROZEN" as const,
    localizationStatus: "FROZEN_AFTER_HUMAN_REVIEW" as const,
    humanLanguageReviewRequired: false as const,
    humanReviewStatus: "APPROVED" as const,
    activeEditorialBlockers: Object.freeze([] as const),
    approvedLocalizedReviewFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
    approvedLocalizationArtifactId: SEA002_CP006_LOCALIZATION_FREEZE.approvedArtifactId,
    productDeliveryUnlocked: false as const,
    productionStagingApproved: false as const,
  });
}
