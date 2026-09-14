import type { EnglishDifficulty } from "../../../../core/types";
import type { ConditionalRuleId } from "../../../../grammar/conditionals";
import { CP011_EASY_SCENES_V1 } from "./cp011-scenes-easy";
import { CP011_HARD_SCENES_V1 } from "./cp011-scenes-hard";
import { CP011_MEDIUM_SCENES_V1 } from "./cp011-scenes-medium";
import type { ConditionalSceneV1 } from "./cp011-scene-types";

export const CP011_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly ConditionalSceneV1[]>> = {
  easy: CP011_EASY_SCENES_V1,
  medium: CP011_MEDIUM_SCENES_V1,
  hard: CP011_HARD_SCENES_V1,
};

export const CP011_SCENES_V1: readonly ConditionalSceneV1[] = [
  ...CP011_EASY_SCENES_V1,
  ...CP011_MEDIUM_SCENES_V1,
  ...CP011_HARD_SCENES_V1,
];

export const CP011_RULE_IDS_V1: readonly ConditionalRuleId[] = [
  "GR-CND-001", "GR-CND-002", "GR-CND-003", "GR-CND-004", "GR-CND-005",
  "GR-CND-006", "GR-CND-007", "GR-CND-008", "GR-CND-009", "GR-CND-010",
];
