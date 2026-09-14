import type { EnglishDifficulty } from "../../../../core/types";
import { CP012_EASY_SCENES_V1 } from "./cp012-scenes-easy";
import { CP012_HARD_SCENES_V1 } from "./cp012-scenes-hard";
import { CP012_MEDIUM_SCENES_V1 } from "./cp012-scenes-medium";
import type { VoiceNarrationSceneV1 } from "./cp012-scene-types";

export const CP012_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly VoiceNarrationSceneV1[]>> = Object.freeze({
  easy: CP012_EASY_SCENES_V1,
  medium: CP012_MEDIUM_SCENES_V1,
  hard: CP012_HARD_SCENES_V1,
});

export const CP012_SCENES_V1: readonly VoiceNarrationSceneV1[] = [
  ...CP012_EASY_SCENES_V1,
  ...CP012_MEDIUM_SCENES_V1,
  ...CP012_HARD_SCENES_V1,
];
