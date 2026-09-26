import { PGK_001_CP005_REVIEW_BATCH_V1 } from "../pgk-001-cp005-review-batch-v1";
import { PGK_CP005_HI_V1 } from "./pgk-cp005-hi-v1";
import { PGK_CP005_PA_V1 } from "./pgk-cp005-pa-v1";
import {
  PGK_ENGLISH_CERTIFICATION_V1,
  PGK_LOCALIZATION_V1,
  type PgkLocaleV1,
  type PgkNativeOverlayV1,
} from "./pgk-localization-types-v1";

type EnglishQuestion = (typeof PGK_001_CP005_REVIEW_BATCH_V1)[number];
type NativeLocale = Exclude<PgkLocaleV1, "en">;

export type PgkCp005LocalizedQuestionV1 = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: EnglishQuestion["difficulty"];
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: string[];
  sourceIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
  locale: PgkLocaleV1;
  localizationV1: {
    version: typeof PGK_LOCALIZATION_V1;
    englishQuestionId: string;
    englishCertification: typeof PGK_ENGLISH_CERTIFICATION_V1;
    semanticInvariant: true;
    qlInvariant: true;
    difficultyInvariant: true;
    factInvariant: true;
    sourceInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
    reviewOnly: true;
  };
};

function overlayFor(index: number, locale: NativeLocale): PgkNativeOverlayV1 {
  const number = index + 1;
  const overlay = locale === "hi" ? PGK_CP005_HI_V1[number] : PGK_CP005_PA_V1[number];
  if (!overlay) throw new Error(`PGK-001 CP005 #${number}: missing ${locale} localization overlay`);
  return overlay;
}

function baseQuestion(
  q: EnglishQuestion,
  locale: PgkLocaleV1,
  stem: string,
  options: string[],
  explanation: string,
): PgkCp005LocalizedQuestionV1 {
  return {
    questionId: locale === "en" ? q.questionId : `${q.questionId}-${locale.toUpperCase()}`,
    qlId: q.qlId,
    qlName: q.qlName,
    difficulty: q.difficulty,
    stem,
    options,
    correctIndex: q.correctIndex,
    canonicalAnswer: options[q.correctIndex]!,
    explanation,
    factIds: [...q.factIds],
    sourceIds: [...q.sourceIds],
    reviewOnly: true,
    runtimeRegistered: false,
    locale,
    localizationV1: {
      version: PGK_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      englishCertification: PGK_ENGLISH_CERTIFICATION_V1,
      semanticInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      factInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true,
    },
  };
}

export function generatePgkCp005LocalizedReviewV1(locale: PgkLocaleV1): PgkCp005LocalizedQuestionV1[] {
  return PGK_001_CP005_REVIEW_BATCH_V1.map((q, index) => {
    if (locale === "en") return baseQuestion(q, "en", q.stem, [...q.options], q.explanation);
    const overlay = overlayFor(index, locale);
    return baseQuestion(q, locale, overlay.stem, [...overlay.options], overlay.explanation);
  });
}

export const PGK_CP005_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;
export const PGK_CP005_LOCALIZATION_V1_SUPPORTED_CPS = ["PGK-001-CP-005"] as const;
