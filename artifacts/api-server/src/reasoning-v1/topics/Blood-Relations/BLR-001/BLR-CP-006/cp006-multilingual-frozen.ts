import { generateBlrCp006FrozenBank } from "./cp006-runtime";
import {
  BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
  blrCp006CanonicalParityProjection,
  generateBlrCp006LocalizedReviewBank,
  type GeneratedBlrCp006LocalizedQuestion,
} from "./localization/cp006-localizer";
import type { BlrCp006TranslatedLocale } from "./localization/cp006-language-pack";

export const BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY =
  "BLR_CP006_MULTILINGUAL_FROZEN" as const;
export const BLR_CP006_MULTILINGUAL_FREEZE_APPROVED_AT = "2026-08-13" as const;
export const BLR_CP006_MULTILINGUAL_FREEZE_REVIEW_NOTE =
  "Product-owner approved the reviewed Hindi and Punjabi Editorial V2 corpus on 2026-08-13 after representative review across BLR-QL-026..030 and exhaustive language, editorial and semantic-parity audits. Learner wording is frozen; Question Studio and every product-delivery surface remain locked." as const;

export type GeneratedBlrCp006MultilingualFrozenQuestion = Omit<
  GeneratedBlrCp006LocalizedQuestion,
  "metadata"
> & {
  metadata: Omit<
    GeneratedBlrCp006LocalizedQuestion["metadata"],
    | "localizationAuthority"
    | "localizationStatus"
    | "reviewStatus"
    | "humanLanguageReviewRequired"
    | "activeEditorialBlockers"
    | "productDeliveryUnlocked"
    | "productionStagingApproved"
  > & {
    localizationAuthority: typeof BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY;
    localizationStatus: "MULTILINGUAL_FROZEN";
    reviewStatus: "MULTILINGUAL_FROZEN";
    humanLanguageReviewRequired: false;
    activeEditorialBlockers: readonly [];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
    multilingualFreezeStatus: typeof BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY;
  };
  multilingualFreezeProof: {
    authority: typeof BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY;
    approvedBy: "PRODUCT_OWNER";
    approvedAt: typeof BLR_CP006_MULTILINGUAL_FREEZE_APPROVED_AT;
    sourceAuthority: typeof BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    learnerCorpusChanged: false;
    semanticParityPreserved: true;
    questionStudioUnlocked: false;
    productDeliveryUnlocked: false;
  };
};

function freezeLocalizedQuestion(
  question: GeneratedBlrCp006LocalizedQuestion,
): GeneratedBlrCp006MultilingualFrozenQuestion {
  return {
    ...question,
    metadata: {
      ...question.metadata,
      localizationAuthority: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
      localizationStatus: "MULTILINGUAL_FROZEN",
      reviewStatus: "MULTILINGUAL_FROZEN",
      humanLanguageReviewRequired: false,
      activeEditorialBlockers: [],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
      multilingualFreezeStatus: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
    },
    multilingualFreezeProof: {
      authority: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
      approvedBy: "PRODUCT_OWNER",
      approvedAt: BLR_CP006_MULTILINGUAL_FREEZE_APPROVED_AT,
      sourceAuthority: BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      learnerCorpusChanged: false,
      semanticParityPreserved: true,
      questionStudioUnlocked: false,
      productDeliveryUnlocked: false,
    },
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  };
}

export function generateBlrCp006MultilingualFrozenBank(
  locale: BlrCp006TranslatedLocale,
): readonly GeneratedBlrCp006MultilingualFrozenQuestion[] {
  return generateBlrCp006LocalizedReviewBank(locale).map(freezeLocalizedQuestion);
}

export function generateBlrCp006MultilingualFrozenBundle() {
  return {
    english: generateBlrCp006FrozenBank(),
    hindi: generateBlrCp006MultilingualFrozenBank("hi-IN"),
    punjabi: generateBlrCp006MultilingualFrozenBank("pa-IN"),
  } as const;
}

function learnerProjection(
  question: GeneratedBlrCp006LocalizedQuestion | GeneratedBlrCp006MultilingualFrozenQuestion,
): unknown {
  return {
    itemId: question.itemId,
    questionLanguageId: question.questionLanguageId,
    locale: question.locale,
    qlId: question.qlId,
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({
      text: option.text,
      semanticKey: option.semanticKey,
      isCorrect: option.isCorrect,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    decodedStatements: question.decodedStatements,
    explanation: question.explanation,
  };
}

export function multilingualFrozenLearnerCorpusIsUnchanged(
  locale: BlrCp006TranslatedLocale,
): boolean {
  const source = generateBlrCp006LocalizedReviewBank(locale);
  const frozen = generateBlrCp006MultilingualFrozenBank(locale);
  return JSON.stringify(source.map(learnerProjection))
    === JSON.stringify(frozen.map(learnerProjection));
}

export function multilingualFrozenSemanticParityIsExact(
  locale: BlrCp006TranslatedLocale,
): boolean {
  const source = generateBlrCp006LocalizedReviewBank(locale);
  const frozen = generateBlrCp006MultilingualFrozenBank(locale);
  return JSON.stringify(source.map(blrCp006CanonicalParityProjection))
    === JSON.stringify(
      frozen.map((question) =>
        blrCp006CanonicalParityProjection(
          question as unknown as GeneratedBlrCp006LocalizedQuestion,
        )
      ),
    );
}
