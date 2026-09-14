import type { EnglishDifficulty } from "../../../../core/types";
import type { IdiomaticUsageRuleId } from "../../../../grammar/idiomatic-usage";

export interface IdiomaticUsageSceneV1 {
  id: string;
  difficulty: EnglishDifficulty;
  ruleId: IdiomaticUsageRuleId;
  domain: string;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

export const idiomaticUsageScene = (value: Omit<IdiomaticUsageSceneV1, "correction">): IdiomaticUsageSceneV1 => ({
  ...value,
  correction: value.correctSegments[value.errorIndex],
});
