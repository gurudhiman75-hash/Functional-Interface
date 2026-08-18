import { canonicalDigest } from "../canonical.ts";
import { SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "../permanent/freeze.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "../saturation/corpus.ts";
import { buildSea001ExplanationParityCandidate } from "./explanation-parity-candidate.ts";
import {
  SEA001_LOCALIZATION_AUTHORITY,
  type Sea001TranslatedLocale,
  sea001CanonicalParityProjection,
} from "./readiness.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";

export const SEA001_MULTILINGUAL_FREEZE_AUTHORITY = "SEA001_MULTILINGUAL_FROZEN" as const;
export const SEA001_MULTILINGUAL_FREEZE_APPROVED_AT = "2026-08-18" as const;
export const SEA001_MULTILINGUAL_FREEZE_APPROVED_BY = "PRODUCT_OWNER" as const;
export const SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE = "PR#662_COMMENT_5325577211" as const;
export const SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD =
  "d019f736afc87a7afee86e74f247b7210f68b20e" as const;
export const SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID = "9218301753" as const;
export const SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST =
  "3918be759d9ccf56fcef1111c24cfca4e7d3dfb4112a7d3a549f45d0fa358169" as const;

export const SEA001_MULTILINGUAL_FREEZE_REVIEW_NOTE =
  "Product owner explicitly approved the exact Hindi/Punjabi explanation-parity review candidate on 2026-08-18. English, Hindi and Punjabi reviewed learner content is frozen. Question Studio, Question Bank, mock-test eligibility, production staging and public delivery remain locked." as const;

export type Sea001MultilingualFrozenCaselet = Omit<
  Sea001LocalizedReviewCaselet,
  | "localizationStatus"
  | "humanLanguageReviewRequired"
  | "activeEditorialBlockers"
  | "productDeliveryUnlocked"
  | "productionStagingApproved"
> & {
  readonly localizationStatus: "MULTILINGUAL_FROZEN";
  readonly humanLanguageReviewRequired: false;
  readonly activeEditorialBlockers: readonly [];
  readonly productDeliveryUnlocked: false;
  readonly productionStagingApproved: false;
  readonly multilingualFreezeProof: {
    readonly authority: typeof SEA001_MULTILINGUAL_FREEZE_AUTHORITY;
    readonly approvedBy: typeof SEA001_MULTILINGUAL_FREEZE_APPROVED_BY;
    readonly approvedAt: typeof SEA001_MULTILINGUAL_FREEZE_APPROVED_AT;
    readonly approvalEvidence: typeof SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE;
    readonly sourceAuthority: typeof SEA001_LOCALIZATION_AUTHORITY;
    readonly sourceImplementationHead: typeof SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD;
    readonly sourceArtifactId: typeof SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID;
    readonly sourceArtifactDigest: typeof SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST;
    readonly learnerCorpusChanged: false;
    readonly semanticParityPreserved: true;
    readonly questionStudioUnlocked: false;
    readonly questionBankUnlocked: false;
    readonly mockTestUnlocked: false;
    readonly productionStagingUnlocked: false;
    readonly publicDeliveryUnlocked: false;
  };
};

function freezeLocalizedCaselet(
  caselet: Sea001LocalizedReviewCaselet,
): Sea001MultilingualFrozenCaselet {
  return {
    ...caselet,
    localizationStatus: "MULTILINGUAL_FROZEN",
    humanLanguageReviewRequired: false,
    activeEditorialBlockers: [],
    productDeliveryUnlocked: false,
    productionStagingApproved: false,
    multilingualFreezeProof: {
      authority: SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
      approvedBy: SEA001_MULTILINGUAL_FREEZE_APPROVED_BY,
      approvedAt: SEA001_MULTILINGUAL_FREEZE_APPROVED_AT,
      approvalEvidence: SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE,
      sourceAuthority: SEA001_LOCALIZATION_AUTHORITY,
      sourceImplementationHead: SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD,
      sourceArtifactId: SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID,
      sourceArtifactDigest: SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST,
      learnerCorpusChanged: false,
      semanticParityPreserved: true,
      questionStudioUnlocked: false,
      questionBankUnlocked: false,
      mockTestUnlocked: false,
      productionStagingUnlocked: false,
      publicDeliveryUnlocked: false,
    },
  };
}

function canonicalApprovedReviewCorpus() {
  return selectManualReviewCorpus(buildSea001SaturationCorpus(40).caselets, 5);
}

export function generateSea001ApprovedLocalizedReviewCorpus(
  locale: Sea001TranslatedLocale,
): readonly Sea001LocalizedReviewCaselet[] {
  return canonicalApprovedReviewCorpus().map((source) =>
    buildSea001ExplanationParityCandidate(source, locale)
  );
}

export function generateSea001MultilingualFrozenReviewCorpus(
  locale: Sea001TranslatedLocale,
): readonly Sea001MultilingualFrozenCaselet[] {
  return generateSea001ApprovedLocalizedReviewCorpus(locale).map(freezeLocalizedCaselet);
}

type ProjectionSource = Sea001LocalizedReviewCaselet | Sea001MultilingualFrozenCaselet;

function reviewedLearnerProjection(caselet: ProjectionSource): unknown {
  const {
    localizationStatus: _localizationStatus,
    humanLanguageReviewRequired: _humanLanguageReviewRequired,
    activeEditorialBlockers: _activeEditorialBlockers,
    productDeliveryUnlocked: _productDeliveryUnlocked,
    productionStagingApproved: _productionStagingApproved,
    ...reviewedContent
  } = caselet;
  if ("multilingualFreezeProof" in reviewedContent) {
    const { multilingualFreezeProof: _multilingualFreezeProof, ...withoutFreezeProof } = reviewedContent;
    return withoutFreezeProof;
  }
  return reviewedContent;
}

export function sea001ApprovedLocalizedLearnerFingerprint(
  locale: Sea001TranslatedLocale,
): string {
  return canonicalDigest(generateSea001ApprovedLocalizedReviewCorpus(locale).map(reviewedLearnerProjection));
}

export function sea001MultilingualFrozenLearnerFingerprint(
  locale: Sea001TranslatedLocale,
): string {
  return canonicalDigest(generateSea001MultilingualFrozenReviewCorpus(locale).map(reviewedLearnerProjection));
}

export function sea001ApprovedLocalizedSemanticFingerprint(
  locale: Sea001TranslatedLocale,
): string {
  return canonicalDigest(
    generateSea001ApprovedLocalizedReviewCorpus(locale).map(sea001CanonicalParityProjection),
  );
}

export function sea001MultilingualFrozenSemanticFingerprint(
  locale: Sea001TranslatedLocale,
): string {
  return canonicalDigest(
    generateSea001MultilingualFrozenReviewCorpus(locale).map(sea001CanonicalParityProjection),
  );
}

export function assertSea001MultilingualFreezeKeepsDeliveryLocked(): void {
  if (SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-001 multilingual freeze must not bypass downstream activation gates.");
  }
}
