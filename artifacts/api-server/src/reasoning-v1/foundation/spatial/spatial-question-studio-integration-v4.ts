import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as CURRENT_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V5,
  type SpatialQuestionStudioChapterCodeV5,
  type SpatialQuestionStudioDifficultyV5,
  type SpatialQuestionStudioPermanentQlIdV5,
} from "./spatial-question-studio-integration-v5";

// Compatibility surface: existing admin callers import v4/V1 names. Keep those
// imports stable while advancing the governed package to the approved 45-QL CND runtime.
export const SPATIAL_QUESTION_STUDIO_QLS_V4 = SPATIAL_QUESTION_STUDIO_QLS_V5;
export const SPATIAL_QUESTION_STUDIO_PACKAGE_V4 = SPATIAL_QUESTION_STUDIO_PACKAGE_V5;
export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V5;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 =
  CURRENT_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;

export type SpatialQuestionStudioChapterCodeV4 = SpatialQuestionStudioChapterCodeV5;
export type SpatialQuestionStudioPermanentQlIdV4 = SpatialQuestionStudioPermanentQlIdV5;
export type SpatialQuestionStudioDifficultyV4 = SpatialQuestionStudioDifficultyV5;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV5;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV5;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV5;
