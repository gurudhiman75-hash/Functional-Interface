import type {
  StaticGkFact,
  StaticGkGeoTarget,
  StaticGkQuizPrompt,
  StaticGkSourceReference,
  StaticGkVisualTemplate,
} from "../types";

export type StaticGkFactLockStatus = "draft" | "source-locked" | "review-approved";

export interface StaticGkNarrationBeatDraft {
  id: string;
  purpose: "hook" | "teach" | "reinforce" | "quiz-setup";
  text: string;
  factIds: string[];
  targetIds: string[];
}

export interface StaticGkFactLockPack {
  visualId: string;
  title: string;
  template: StaticGkVisualTemplate;
  status: StaticGkFactLockStatus;
  sourceRefs: StaticGkSourceReference[];
  facts: StaticGkFact[];
  geoTargets: StaticGkGeoTarget[];
  narration: StaticGkNarrationBeatDraft[];
  quiz: StaticGkQuizPrompt;
  renderConstraints: string[];
  exclusions: string[];
  reviewNotes: string[];
}
