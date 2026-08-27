import type { TsdCp010ExecutableInput } from "./executable-types";
import type { TsdCp010ExamRealLanguage } from "./exam-real-review-final";
import {
  TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW as ENGLISH_V3,
  renderTsdCp010ExamPaperStemV3 as renderEnglishV3,
} from "./exam-paper-review-final-v3";
import {
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW,
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW,
} from "./exam-real-review-final-v2";
import { renderTsdCp010NativeExamPaperStemV3 } from "./native-exam-paper-v3";

function polishNative(language: "hi" | "pa", stem: string) {
  if (language === "hi") return stem
    .replaceAll("समय-बढ़त", "समय की बढ़त")
    .replaceAll("दूरी-अंतर", "दूरी का अंतर")
    .replaceAll("जीत-अंतर", "जीत का अंतर")
    .replaceAll("समय-अंतर", "समय का अंतर");
  return stem
    .replaceAll("ਦੂਰੀ-ਅੰਤਰ", "ਦੂਰੀ ਦਾ ਅੰਤਰ")
    .replaceAll("ਜਿੱਤ-ਅੰਤਰ", "ਜਿੱਤ ਦਾ ਅੰਤਰ")
    .replaceAll("ਸਮਾਂ-ਅੰਤਰ", "ਸਮੇਂ ਦਾ ਅੰਤਰ");
}

export function renderTsdCp010ExamPaperStemV3(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  if (language === "en") return renderEnglishV3(language, familyId, input);
  return polishNative(language, renderTsdCp010NativeExamPaperStemV3(language, familyId, input));
}

export const TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW = ENGLISH_V3;

export const TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3("hi", question.familyId, question.input),
  })),
);

export const TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3("pa", question.familyId, question.input),
  })),
);
