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
import { renderTsdCp010ExamPaperStemV3 } from "./exam-paper-review-final-v3-all";

export {
  TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
};
export type { TsdCp010StudioCandidateLanguage, TsdCp010StudioCandidateDifficulty, TsdCp010StudioCandidateRequest };

export const TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-010-MULTILINGUAL-OFFICIAL-PAPER-V3-REVIEW-CANDIDATE-v8" as const;

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  ...BASE_PACKAGE,
  runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE" as const,
  stemNarrativePolicy: "RESULT_CAPABILITY_HANDICAP_FIRST_LOW_NARRATIVE" as const,
  stemEditorialPass: "OFFICIAL_PAPER_REPRESENTATION_PASS_V3" as const,
  rejectedStemStyle: "RAW_SPEED_DRILL_AND_SYNTHETIC_CONTEXT_PROSE" as const,
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE" as const,
});

export function previewTsdCp010StudioCandidate(request: TsdCp010StudioCandidateRequest = {}) {
  const preview = previewBase(request);
  const language = preview.request.language as TsdCp010StudioCandidateLanguage;
  const questions = preview.questions.map((question) => Object.freeze({
    ...question,
    stem: renderTsdCp010ExamPaperStemV3(language, question.familyId, question.input),
    runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
    validation: Object.freeze({
      ...question.validation,
      examRealStem: true,
      officialPaperRepresentationV3: true,
      rawSpeedDrillAvoidedWhereRaceRepresentationExists: true,
    }),
  }));

  if (new Set(questions.map((question) => question.stem)).size !== questions.length) {
    throw new Error(`CP010 ${language} official-paper V3 Studio preview contains duplicate learner stems`);
  }

  return Object.freeze({
    ...preview,
    package: TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
    questions: Object.freeze(questions),
  });
}
