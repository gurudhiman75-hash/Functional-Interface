import type { EnglishDifficulty } from "../../../../core/types";
import type { ModifierRuleId } from "../../../../grammar/modifiers";

export interface ModifierSceneV1 {
  id: string;
  difficulty: EnglishDifficulty;
  ruleId: ModifierRuleId;
  domain: string;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

export const modifierScene = (value: Omit<ModifierSceneV1, "correction">): ModifierSceneV1 => ({
  ...value,
  correction: value.correctSegments[value.errorIndex],
});
