import type { EnglishDifficulty } from "../../../../core/types";
import type { ConditionalRuleId } from "../../../../grammar/conditionals";

export interface ConditionalSceneV1 {
  id: string;
  difficulty: EnglishDifficulty;
  ruleId: ConditionalRuleId;
  domain: string;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

export const conditionalScene = (value: Omit<ConditionalSceneV1, "correction">): ConditionalSceneV1 => ({
  ...value,
  correction: value.correctSegments[value.errorIndex],
});
