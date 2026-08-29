import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "./chapter-manifest";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  generateSriPermanentLocalizedQuestionV1,
  type SriLocalizedLocaleV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-v1";

export const SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1 = "SRI-ML-V1-FROZEN" as const;

export const SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1 = Object.freeze({
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL" as const,
  approvalDate: "2026-08-28" as const,
  approvalEvidence: "ACTIVE_SESSION_USER_APPROVED_ARTIFACT_9684834606" as const,
  approvedReviewAuthority: "SRI-PERMANENT-LOCALIZATION-REVIEW-V1" as const,
  approvedArtifactName: "sri-v4-permanent-localization-review-v1" as const,
  approvedArtifactId: 9684834606 as const,
  approvedArtifactDigest: "sha256:a212a40f917e8e91a6d5741fc4acd32a73782885981b2b7f7ef8b4c3bb7251ac" as const,
  approvedSourceHead: "a3d24d97221bf94da04e77daa140164dbcdb0e51" as const,
  baseRecertificationHead: "1b96cb213eacb25d9f5372afed77ee4ff286d2f8" as const,
  baseRecertificationRunId: 33176307480 as const,
  baseRecertificationArtifactId: 9687741252 as const,
  baseRecertificationArtifactDigest: "sha256:15a930313487ce840d2989271614b4d6595123ca4b541ebc1914ff0138873a79" as const,
  recertifiedBaseSha: "2754618366072250467e4d862caa11525d4e0900" as const,
  permanentQlCount: 58 as const,
  frozenSolveModeCount: 58 as const,
  prototypeAncestryMembers: 92 as const,
  englishReviewRows: 184 as const,
  localizedReviewRows: 368 as const,
  runtimeSeedsPerQl: 24 as const,
  localizedRuntimeQuestions: 2784 as const,
  locales: ["hi-IN", "pa-IN"] as const,
  englishFrozen: true as const,
  multilingualFrozen: true as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export interface SriPermanentMultilingualFrozenQuestionV1 extends Omit<
  SriPermanentLocalizedQuestionV1,
  "lifecycle"
> {
  readonly localizationFreezeId: typeof SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1;
  readonly approvedLocalizationArtifactId: typeof SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId;
  readonly approvedLocalizationSourceHead: typeof SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedSourceHead;
  readonly lifecycle: Readonly<{
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_FROZEN";
    localizationStatus: "FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionStudioGenerationEnabled: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

export function generateSriPermanentMultilingualFrozenQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
  locale: SriLocalizedLocaleV1,
): SriPermanentMultilingualFrozenQuestionV1 {
  assertSriReleaseLocks();
  if (!SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen || !SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen) {
    throw new Error("SRI multilingual frozen runtime requires both English and multilingual freeze flags");
  }

  const reviewed = generateSriPermanentLocalizedQuestionV1(qlId, externalSeed, locale);
  if (
    reviewed.lifecycle.reviewStatus !== "LOCALIZATION_REVIEW_READY"
    || reviewed.lifecycle.localizationStatus !== "REVIEW_READY"
    || reviewed.lifecycle.active
    || reviewed.lifecycle.questionStudioDiscoverable
    || reviewed.lifecycle.questionStudioGenerationEnabled
    || reviewed.lifecycle.questionBankWritable
    || reviewed.lifecycle.testEligible
    || reviewed.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${locale}: reviewed localization source crossed its pre-freeze lifecycle boundary`);
  }

  return deepFreeze({
    ...reviewed,
    localizationFreezeId: SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1,
    approvedLocalizationArtifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
    approvedLocalizationSourceHead: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedSourceHead,
    lifecycle: {
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "FROZEN" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function auditSriPermanentMultilingualFreezeV1() {
  assertSriReleaseLocks();
  return Object.freeze({
    freezeId: SRI_PERMANENT_MULTILINGUAL_FREEZE_ID_V1,
    approvalAuthority: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvalAuthority,
    artifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
    artifactDigest: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactDigest,
    approvedSourceHead: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedSourceHead,
    baseRecertificationRunId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.baseRecertificationRunId,
    recertifiedBaseSha: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.recertifiedBaseSha,
    permanentQlCount: SRI_CHAPTER_MANIFEST.permanentQlCount,
    frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
    englishFrozen: SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen,
    multilingualFrozen: SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen,
    downstreamLocked:
      !SRI_CHAPTER_MANIFEST.lifecycle.questionStudioDiscoverable
      && !SRI_CHAPTER_MANIFEST.lifecycle.questionStudioGenerationEnabled
      && !SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled
      && !SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled
      && !SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled,
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}
