import {
  generateBlrCp007EnglishFrozenBank,
  type GeneratedBlrCp007EnglishFrozenQuestion,
} from "./cp007-english-frozen";
import {
  blrCp007CanonicalParityProjection,
  generateBlrCp007LocalizedBank,
  type GeneratedBlrCp007LocalizedQuestion,
} from "./localization/cp007-localizer";
import type { BlrCp007TranslatedLocale } from "./localization/cp007-language-pack";

export const BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY =
  "BLR_CP007_MULTILINGUAL_FROZEN" as const;

export const BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT = "2026-08-08" as const;

export const BLR_CP007_MULTILINGUAL_FREEZE_REVIEW_NOTE =
  "Product-owner explicitly approved the reviewed Hindi and Punjabi corpus on 2026-08-08. English, Hindi and Punjabi learner-facing wording is frozen. Question Studio and all product-delivery surfaces remain locked." as const;

export type GeneratedBlrCp007MultilingualFrozenQuestion = Omit<
  GeneratedBlrCp007LocalizedQuestion,
  "reviewProof" | "metadata" | "v4ReviewProof" | "localisationProof"
> & {
  readonly reviewProof: Omit<
    GeneratedBlrCp007LocalizedQuestion["reviewProof"],
    "reviewStatus" | "reviewerNote"
  > & {
    readonly reviewStatus: "MULTILINGUAL_FROZEN";
    readonly reviewerNote: typeof BLR_CP007_MULTILINGUAL_FREEZE_REVIEW_NOTE;
  };
  readonly metadata: Omit<
    GeneratedBlrCp007LocalizedQuestion["metadata"],
    "activeEditorialBlockers" | "localizationStatus"
  > & {
    readonly activeEditorialBlockers: readonly string[];
    readonly localizationStatus: typeof BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY;
    readonly multilingualFreezeStatus: typeof BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY;
  };
  readonly v4ReviewProof: Omit<
    GeneratedBlrCp007LocalizedQuestion["v4ReviewProof"],
    "activeEditorialBlockers" | "humanReviewRequired"
  > & {
    readonly activeEditorialBlockers: readonly string[];
    readonly humanReviewRequired: false;
  };
  readonly localisationProof: Omit<
    GeneratedBlrCp007LocalizedQuestion["localisationProof"],
    "authority" | "sourceAuthority" | "humanLanguageReviewRequired" | "productDeliveryUnlocked"
  > & {
    readonly authority: typeof BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY;
    readonly sourceAuthority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE";
    readonly humanLanguageReviewRequired: false;
    readonly productDeliveryUnlocked: false;
  };
  readonly multilingualFreezeProof: {
    readonly authority: typeof BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY;
    readonly approvedBy: "PRODUCT_OWNER";
    readonly approvedAt: typeof BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT;
    readonly sourceAuthority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE";
    readonly learnerCorpusChanged: false;
    readonly semanticParityPreserved: true;
    readonly questionStudioUnlocked: false;
    readonly productDeliveryUnlocked: false;
  };
};

function freezeLocalizedQuestion(
  question: GeneratedBlrCp007LocalizedQuestion,
): GeneratedBlrCp007MultilingualFrozenQuestion {
  return {
    ...question,
    reviewProof: {
      ...question.reviewProof,
      reviewStatus: "MULTILINGUAL_FROZEN",
      reviewerNote: BLR_CP007_MULTILINGUAL_FREEZE_REVIEW_NOTE,
    },
    metadata: {
      ...question.metadata,
      activeEditorialBlockers: [],
      localizationStatus: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
      multilingualFreezeStatus: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      activeEditorialBlockers: [],
      humanReviewRequired: false,
    },
    localisationProof: {
      ...question.localisationProof,
      authority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
      sourceAuthority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE",
      humanLanguageReviewRequired: false,
      productDeliveryUnlocked: false,
    },
    multilingualFreezeProof: {
      authority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
      approvedBy: "PRODUCT_OWNER",
      approvedAt: BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT,
      sourceAuthority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE",
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

export function generateBlrCp007MultilingualFrozenBank(
  locale: BlrCp007TranslatedLocale,
): readonly GeneratedBlrCp007MultilingualFrozenQuestion[] {
  return generateBlrCp007LocalizedBank(locale).map(freezeLocalizedQuestion);
}

export function generateBlrCp007MultilingualFrozenBundle(): Readonly<{
  english: readonly GeneratedBlrCp007EnglishFrozenQuestion[];
  hindi: readonly GeneratedBlrCp007MultilingualFrozenQuestion[];
  punjabi: readonly GeneratedBlrCp007MultilingualFrozenQuestion[];
}> {
  return {
    english: generateBlrCp007EnglishFrozenBank(),
    hindi: generateBlrCp007MultilingualFrozenBank("hi-IN"),
    punjabi: generateBlrCp007MultilingualFrozenBank("pa-IN"),
  };
}

type LearnerProjectionSource =
  | GeneratedBlrCp007LocalizedQuestion
  | GeneratedBlrCp007MultilingualFrozenQuestion;

function learnerProjection(question: LearnerProjectionSource): unknown {
  return {
    itemId: question.itemId,
    locale: question.locale,
    qlId: question.qlId,
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({
      text: option.text,
      studentExplanation: option.studentExplanation,
      isCorrectAnswerForTask: option.isCorrectAnswerForTask,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    decodedStatements: question.decodedStatements,
    explanation: question.explanation,
    delivery: question.delivery,
  };
}

export function multilingualFrozenLearnerCorpusIsUnchanged(
  locale: BlrCp007TranslatedLocale,
): boolean {
  const source = generateBlrCp007LocalizedBank(locale);
  const frozen = generateBlrCp007MultilingualFrozenBank(locale);
  return JSON.stringify(source.map(learnerProjection))
    === JSON.stringify(frozen.map(learnerProjection));
}

export function multilingualFrozenSemanticParityIsExact(
  locale: BlrCp007TranslatedLocale,
): boolean {
  const source = generateBlrCp007LocalizedBank(locale);
  const frozen = generateBlrCp007MultilingualFrozenBank(locale);
  return JSON.stringify(source.map(blrCp007CanonicalParityProjection))
    === JSON.stringify(
      frozen.map((question) =>
        blrCp007CanonicalParityProjection(
          question as unknown as GeneratedBlrCp007LocalizedQuestion,
        )),
    );
}
