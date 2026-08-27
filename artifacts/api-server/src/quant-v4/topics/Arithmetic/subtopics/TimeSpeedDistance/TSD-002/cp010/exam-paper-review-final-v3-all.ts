import type { TsdCp010ExecutableInput } from "./executable-types";
import type { TsdCp010ExamRealLanguage } from "./exam-real-review-final";
import {
  TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,
  renderTsdCp010ExamPaperStemV3 as renderEnglishV3,
} from "./exam-paper-review-final-v3";
import {
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW,
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW,
} from "./exam-real-review-final-v2";
import { renderTsdCp010NativeExamPaperStemV3 } from "./native-exam-paper-v3";

export function renderTsdCp010ExamPaperStemV3(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  if (language === "en") return renderEnglishV3(language, familyId, input);
  return renderTsdCp010NativeExamPaperStemV3(language, familyId, input);
}

export const TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW = TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW;

export const TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010NativeExamPaperStemV3("hi", question.familyId, question.input),
  })),
);

export const TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010NativeExamPaperStemV3("pa", question.familyId, question.input),
  })),
);
