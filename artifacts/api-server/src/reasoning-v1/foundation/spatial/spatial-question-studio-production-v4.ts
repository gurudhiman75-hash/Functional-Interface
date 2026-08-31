import {
  generateSpatialProductionStudioBatchV5,
  generateSpatialProductionStudioQuestionV5,
  isSpatialCountingFiguresQuestionStudioQlIdV5,
  type SpatialCountingFiguresProductionStudioQuestionV5,
  type SpatialProductionStudioBatchRequestV5,
  type SpatialProductionStudioQuestionV5,
} from "./spatial-question-studio-production-v5";

// Compatibility surface for existing admin imports. The implementation now
// delegates to the governed v5 runtime, which preserves QLs 001..042 and adds CND 043..045.
export const isSpatialCountingFiguresQuestionStudioQlIdV4 =
  isSpatialCountingFiguresQuestionStudioQlIdV5;
export const generateSpatialProductionStudioQuestionV4 =
  generateSpatialProductionStudioQuestionV5;
export const generateSpatialProductionStudioBatchV4 =
  generateSpatialProductionStudioBatchV5;
export const generateSpatialProductionStudioQuestionV1 =
  generateSpatialProductionStudioQuestionV5;
export const generateSpatialProductionStudioBatchV1 =
  generateSpatialProductionStudioBatchV5;

export type SpatialCountingFiguresProductionStudioQuestionV4 =
  SpatialCountingFiguresProductionStudioQuestionV5;
export type SpatialProductionStudioBatchRequestV4 = SpatialProductionStudioBatchRequestV5;
export type SpatialProductionStudioQuestionV4 = SpatialProductionStudioQuestionV5;
export type SpatialProductionStudioQuestionV1 = SpatialProductionStudioQuestionV5;
