import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V4,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V4,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V4,
} from "./com003-localization-v2-wave1-v4";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2_V2,
  COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2,
} from "./com003-localization-v2-wave2-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE3,
  COM003_LOCALIZATION_V2_WAVE3_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE3,
} from "./com003-localization-v2-wave3";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE4,
  COM003_LOCALIZATION_V2_WAVE4_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE4,
} from "./com003-localization-v2-wave4";

export const COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE = Object.freeze([
  ...COM003_HINDI_LOCALIZATION_V2_WAVE1_V4,
  ...COM003_HINDI_LOCALIZATION_V2_WAVE2_V2,
  ...COM003_HINDI_LOCALIZATION_V2_WAVE3,
  ...COM003_HINDI_LOCALIZATION_V2_WAVE4,
]);

export const COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE = Object.freeze([
  ...COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V4,
  ...COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2,
  ...COM003_PUNJABI_LOCALIZATION_V2_WAVE3,
  ...COM003_PUNJABI_LOCALIZATION_V2_WAVE4,
]);

export const COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-V2-CHAPTER-CANDIDATE-1" as const,
  chapterCode: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  sourceEnglishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  sourceEnglishCorpus: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
  waveAuthorityIds: Object.freeze([
    COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V4.authorityId,
    COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2.authorityId,
    COM003_LOCALIZATION_V2_WAVE3_AUTHORITY.authorityId,
    COM003_LOCALIZATION_V2_WAVE4_AUTHORITY.authorityId,
  ] as const),
  qlRange: "COM-003-QL-001..COM-003-QL-019" as const,
  qlCount: 19,
  englishQuestionCount: COM003_ENGLISH_REVIEW_CORPUS_V16_2.length,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  localizedQuestionCount:
    COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length +
    COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  questionLanguageArtifactCount:
    COM003_ENGLISH_REVIEW_CORPUS_V16_2.length +
    COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length +
    COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  questionsPerQlPerLanguage: 12,
  status: "AGGREGATED_REVIEW_CANDIDATE" as const,
  governance: Object.freeze({
    humanLanguageReviewRequired: true,
    localizationFrozen: false,
    mutationAllowedOnlyInSource: true,
    questionStudioRuntimeAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publiclyPublishable: false,
    productionReleased: false,
  }),
  nextGate: "COM003_LOCALIZATION_V2_CHAPTER_HUMAN_REVIEW_AND_FREEZE" as const,
});
