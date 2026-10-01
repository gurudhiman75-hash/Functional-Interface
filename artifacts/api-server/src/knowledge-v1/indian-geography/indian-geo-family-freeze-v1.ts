import { auditIndianGeoLocalizationFamilyV2 } from "./indian-geo-localization-family-audit-v2";

export const INDIAN_GEO_FAMILY_FREEZE_AUTHORITY_V1 = "INDIAN-GEO-FAMILY-FREEZE-V1" as const;
export const INDIAN_GEO_FAMILY_FREEZE_STATUS_V1 = "FROZEN_CLOSED" as const;
export const INDIAN_GEO_FAMILY_REVISION_POLICY_V1 =
  "REOPEN_EXPLICITLY_THEN_REVISE_SOURCE_AND_REVALIDATE_ALL_17_PACKAGES" as const;

export function getIndianGeoFamilyFreezeV1() {
  const audit = auditIndianGeoLocalizationFamilyV2();
  if (!audit.structuralValid) throw new Error("Indian Geography family freeze blocked: structural audit failed.");
  if (!audit.qualityReadyForFreeze) throw new Error("Indian Geography family freeze blocked: localization quality audit failed.");
  if (audit.reviewRequired) throw new Error("Indian Geography family freeze blocked: review is still required.");
  if (audit.packageCount !== 17) throw new Error("Indian Geography family freeze blocked: expected 17 packages.");
  if (audit.totals.canonicalQuestionCount !== 7220) throw new Error("Indian Geography family freeze blocked: canonical corpus drift detected.");
  if (audit.totals.localizedVersionCount !== 21660) throw new Error("Indian Geography family freeze blocked: localized corpus drift detected.");

  return Object.freeze({
    authorityId: INDIAN_GEO_FAMILY_FREEZE_AUTHORITY_V1,
    status: INDIAN_GEO_FAMILY_FREEZE_STATUS_V1,
    revisionPolicy: INDIAN_GEO_FAMILY_REVISION_POLICY_V1,
    packageCount: audit.packageCount,
    canonicalQuestionCount: audit.totals.canonicalQuestionCount,
    localizedVersionCount: audit.totals.localizedVersionCount,
    structuralValid: audit.structuralValid,
    qualityReadyForFreeze: audit.qualityReadyForFreeze,
    reviewRequired: audit.reviewRequired,
    frozenPackageIds: Object.freeze(audit.packages.map((pkg) => pkg.packageId)),
  });
}

export const INDIAN_GEO_FAMILY_FREEZE_V1 = getIndianGeoFamilyFreezeV1();
