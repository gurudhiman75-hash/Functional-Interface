import type { EnglishDifficulty } from "../../../../core/types";
import type { ModifierRuleId } from "../../../../grammar/modifiers";
import { CP010_EASY_SCENES_V1 } from "./cp010-scenes-easy";
import { CP010_HARD_SCENES_V1 } from "./cp010-scenes-hard";
import { CP010_MEDIUM_SCENES_V1 } from "./cp010-scenes-medium";
import type { ModifierSceneV1 } from "./cp010-scene-types";

export const CP010_SCENES_BY_DIFFICULTY_V1: Readonly<Record<EnglishDifficulty, readonly ModifierSceneV1[]>> = {
  easy: CP010_EASY_SCENES_V1,
  medium: CP010_MEDIUM_SCENES_V1,
  hard: CP010_HARD_SCENES_V1,
};

export const CP010_SCENES_V1: readonly ModifierSceneV1[] = [
  ...CP010_EASY_SCENES_V1,
  ...CP010_MEDIUM_SCENES_V1,
  ...CP010_HARD_SCENES_V1,
];

export const CP010_RULE_IDS_V1: readonly ModifierRuleId[] = [
  "GR-MOD-001", "GR-MOD-002", "GR-MOD-003", "GR-MOD-004", "GR-MOD-005",
  "GR-MOD-006", "GR-MOD-007", "GR-MOD-008", "GR-MOD-009", "GR-MOD-010",
];
