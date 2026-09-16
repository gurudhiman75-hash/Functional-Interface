import type { EnglishDifficulty } from "../../../../core/types";
import { remediateCp012SceneForClosureV1 } from "./cp012-closure-remediation-v1";
import { CP012_EASY_SCENES_V1 } from "./cp012-scenes-easy";
import { CP012_HARD_SCENES_V1 } from "./cp012-scenes-hard";
import { CP012_MEDIUM_SCENES_V1 } from "./cp012-scenes-medium";
import type { VoiceNarrationSceneV1 } from "./cp012-scene-types";

const easy = CP012_EASY_SCENES_V1.map(remediateCp012SceneForClosureV1);
const medium = CP012_MEDIUM_SCENES_V1.map(remediateCp012SceneForClosureV1);
const hard = CP012_HARD_SCENES_V1.map(remediateCp012SceneForClosureV1);

export const CP012_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly VoiceNarrationSceneV1[]>> = Object.freeze({
  easy,
  medium,
  hard,
});

export const CP012_SCENES_V1: readonly VoiceNarrationSceneV1[] = [
  ...easy,
  ...medium,
  ...hard,
];
