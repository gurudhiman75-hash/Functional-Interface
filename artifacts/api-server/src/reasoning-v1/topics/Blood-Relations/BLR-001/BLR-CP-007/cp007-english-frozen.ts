import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import { generateBlrCp007EnglishFreezeDecisionCandidateBank } from "./cp007-english-freeze-decision-candidate";

export const BLR_CP007_ENGLISH_FREEZE_AUTHORITY =
  "BLR_CP007_ENGLISH_FROZEN" as const;

export const BLR_CP007_ENGLISH_FREEZE_APPROVED_AT = "2026-08-08" as const;

export const BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE =
  "Product-owner explicitly approved English freeze on 2026-08-08. The learner-facing English corpus is frozen. Localisation may begin; Question Studio and product delivery remain locked." as const;

type EmptyBlockers = readonly [];

export type GeneratedBlrCp007EnglishFrozenQuestion = Omit<
  GeneratedBlrCp007EditorialV4Question,
  "metadata" | "reviewProof" | "v4ReviewProof"
> & {
  reviewProof: GeneratedBlrCp007EditorialV4Question["reviewProof"] & {
    reviewerNote: typeof BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE;
  };
  metadata: Omit<
    GeneratedBlrCp007EditorialV4Question["metadata"],
    "activeEditorialBlockers"
  > & {
    activeEditorialBlockers: EmptyBlockers;
    englishFreezeStatus: typeof BLR_CP007_ENGLISH_FREEZE_AUTHORITY;
  };
  v4ReviewProof: Omit<
    GeneratedBlrCp007EditorialV4Question["v4ReviewProof"],
    "activeEditorialBlockers" | "humanReviewRequired"
  > & {
    activeEditorialBlockers: EmptyBlockers;
    humanReviewRequired: false;
  };
  englishFreezeProof: {
    authority: typeof BLR_CP007_ENGLISH_FREEZE_AUTHORITY;
    approvedBy: "PRODUCT_OWNER";
    approvedAt: typeof BLR_CP007_ENGLISH_FREEZE_APPROVED_AT;
    sourceAuthority: "BLR_CP007_ENGLISH_FREEZE_DECISION_CANDIDATE";
    learnerCorpusChanged: false;
    localisationUnlocked: true;
    productDeliveryUnlocked: false;
  };
};

export function generateBlrCp007EnglishFrozenBank(): readonly GeneratedBlrCp007EnglishFrozenQuestion[] {
  return generateBlrCp007EnglishFreezeDecisionCandidateBank().map((question) => ({
    ...question,
    reviewProof: {
      ...question.reviewProof,
      reviewerNote: BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE,
    },
    metadata: {
      ...question.metadata,
      activeEditorialBlockers: [] as const,
      englishFreezeStatus: BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      activeEditorialBlockers: [] as const,
      humanReviewRequired: false,
    },
    englishFreezeProof: {
      authority: BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
      approvedBy: "PRODUCT_OWNER",
      approvedAt: BLR_CP007_ENGLISH_FREEZE_APPROVED_AT,
      sourceAuthority: "BLR_CP007_ENGLISH_FREEZE_DECISION_CANDIDATE",
      learnerCorpusChanged: false,
      localisationUnlocked: true,
      productDeliveryUnlocked: false,
    },
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  }));
}

function learnerProjection(question: GeneratedBlrCp007EditorialV4Question): unknown {
  return {
    itemId: question.itemId,
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
    explanation: question.explanation,
    delivery: question.delivery,
  };
}

export function frozenLearnerCorpusIsUnchanged(): boolean {
  const source = generateBlrCp007EnglishFreezeDecisionCandidateBank();
  const frozen = generateBlrCp007EnglishFrozenBank();
  return JSON.stringify(source.map(learnerProjection)) === JSON.stringify(frozen.map(learnerProjection));
}
