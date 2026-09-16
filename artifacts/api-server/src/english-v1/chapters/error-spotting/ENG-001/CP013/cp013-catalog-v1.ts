import type { EnglishDifficulty } from "../../../../core/types";
import { remediateCp013SceneForClosureV1 } from "./cp013-closure-remediation-v1";
import { CP013_EASY_SCENES_V1 } from "./cp013-scenes-easy";
import { CP013_HARD_SCENES_V1 } from "./cp013-scenes-hard";
import { CP013_MEDIUM_SCENES_V1 } from "./cp013-scenes-medium";
import type { IdiomaticUsageSceneV1 } from "./cp013-scene-types";

const easy = CP013_EASY_SCENES_V1.map(remediateCp013SceneForClosureV1);
const medium = CP013_MEDIUM_SCENES_V1.map(remediateCp013SceneForClosureV1);
const hard = CP013_HARD_SCENES_V1.map(remediateCp013SceneForClosureV1);

export const CP013_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly IdiomaticUsageSceneV1[]>> = Object.freeze({
  easy,
  medium,
  hard,
});

export const CP013_SCENES_V1: readonly IdiomaticUsageSceneV1[] = [
  ...easy,
  ...medium,
  ...hard,
];
