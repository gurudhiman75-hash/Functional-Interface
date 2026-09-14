import type { EnglishDifficulty } from "../../../../core/types";
import type { VoiceNarrationRuleId } from "../../../../grammar/voice-narration";

export interface VoiceNarrationSceneV1 {
  id: string;
  difficulty: EnglishDifficulty;
  ruleId: VoiceNarrationRuleId;
  domain: string;
  correctSegments: readonly [string, string, string, string];
  errorSegments: readonly [string, string, string, string];
  errorIndex: 0 | 1 | 2 | 3;
  correction: string;
  reason: string;
}

export const voiceNarrationScene = (value: Omit<VoiceNarrationSceneV1, "correction">): VoiceNarrationSceneV1 => ({
  ...value,
  correction: value.correctSegments[value.errorIndex],
});
