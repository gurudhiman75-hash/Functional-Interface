import {
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE as BASE_PACKAGE,
  TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
  previewTsdCp010StudioCandidate as previewBase,
  type TsdCp010StudioCandidateLanguage,
  type TsdCp010StudioCandidateDifficulty,
  type TsdCp010StudioCandidateRequest,
} from "./question-studio-candidate-adapter-final";
import { renderTsdCp010ExamRealStem } from "./exam-real-review-final";

export {
  TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
};
export type { TsdCp010StudioCandidateLanguage, TsdCp010StudioCandidateDifficulty, TsdCp010StudioCandidateRequest };

export const TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-010-MULTILINGUAL-EXAM-REAL-REVIEW-CANDIDATE-v6" as const;

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  ...BASE_PACKAGE,
  runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_EXAM_REAL_RACE_LANGUAGE" as const,
  stemNarrativePolicy: "RESULT_FIRST_LOW_NARRATIVE" as const,
  rejectedStemStyle: "SYNTHETIC_PRACTICE_TRIAL_REPORT_PROSE" as const,
});

export function previewTsdCp010StudioCandidate(request: TsdCp010StudioCandidateRequest = {}) {
  const preview = previewBase(request);
  const language = preview.request.language as TsdCp010StudioCandidateLanguage;
  const questions = preview.questions.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamRealStem(language, question.familyId, question.input),
    runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
    validation: Object.freeze({ ...question.validation, examRealStem: true }),
  }));

  if (new Set(questions.map((question) => question.stem)).size !== questions.length) {
    throw new Error(`CP010 ${language} exam-real Studio preview contains duplicate learner stems`);
  }

  return Object.freeze({
    ...preview,
    package: TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
    questions: Object.freeze(questions),
  });
}
