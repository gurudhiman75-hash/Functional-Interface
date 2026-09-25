import { PGK_001_CP001_REVIEW_BATCH_V1 } from "../pgk-001-cp001-review-batch-v1";
import { PGK_CP001_HI_V1 } from "./pgk-cp001-hi-v1";
import { PGK_CP001_PA_V1 } from "./pgk-cp001-pa-v1";
import {
  PGK_ENGLISH_CERTIFICATION_V1,
  PGK_LOCALIZATION_V1,
  type PgkLocaleV1,
  type PgkLocalizedQuestionV1,
  type PgkNativeOverlayV1,
} from "./pgk-localization-types-v1";

type EnglishQuestion = (typeof PGK_001_CP001_REVIEW_BATCH_V1)[number];
type NativeLocale = Exclude<PgkLocaleV1, "en">;

function overlayFor(index: number, locale: NativeLocale): PgkNativeOverlayV1 {
  const number = index + 1;
  const overlay = locale === "hi" ? PGK_CP001_HI_V1[number] : PGK_CP001_PA_V1[number];
  if (!overlay) throw new Error(`PGK-001 CP001 #${number}: missing ${locale} localization overlay`);
  return overlay;
}

function baseQuestion(
  q: EnglishQuestion,
  locale: PgkLocaleV1,
  stem: string,
  options: string[],
  explanation: string,
): PgkLocalizedQuestionV1 {
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
    sourceFactIds: [...q.sourceFactIds],
    reviewOnly: true,
    runtimeRegistered: false,
    locale,
    localizationV1: {
      version: PGK_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      englishCertification: PGK_ENGLISH_CERTIFICATION_V1,
      semanticInvariant: true,
      cpInvariant: true,
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

export function generatePgkCp001LocalizedReviewV1(locale: PgkLocaleV1): PgkLocalizedQuestionV1[] {
  return PGK_001_CP001_REVIEW_BATCH_V1.map((q, index) => {
    if (locale === "en") {
      return baseQuestion(q, "en", q.stem, [...q.options], q.explanation);
    }
    const overlay = overlayFor(index, locale);
    return baseQuestion(q, locale, overlay.stem, [...overlay.options], overlay.explanation);
  });
}

export const PGK_CP001_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;
export const PGK_CP001_LOCALIZATION_V1_SUPPORTED_CPS = ["PGK-001-CP-001"] as const;
