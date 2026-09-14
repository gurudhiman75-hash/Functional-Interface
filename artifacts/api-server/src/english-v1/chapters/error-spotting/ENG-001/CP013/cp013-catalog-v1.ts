import type { EnglishDifficulty } from "../../../../core/types";
import { CP013_EASY_SCENES_V1 } from "./cp013-scenes-easy";
import { CP013_HARD_SCENES_V1 } from "./cp013-scenes-hard";
import { CP013_MEDIUM_SCENES_V1 } from "./cp013-scenes-medium";
import type { IdiomaticUsageSceneV1 } from "./cp013-scene-types";

export const CP013_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly IdiomaticUsageSceneV1[]>> = Object.freeze({
  easy: CP013_EASY_SCENES_V1,
  medium: CP013_MEDIUM_SCENES_V1,
  hard: CP013_HARD_SCENES_V1,
});

export const CP013_SCENES_V1: readonly IdiomaticUsageSceneV1[] = [
  ...CP013_EASY_SCENES_V1,
  ...CP013_MEDIUM_SCENES_V1,
  ...CP013_HARD_SCENES_V1,
];
