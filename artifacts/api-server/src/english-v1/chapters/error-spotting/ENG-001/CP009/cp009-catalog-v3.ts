import type { EnglishDifficulty } from "../../../../core/types";
import type { GerundInfinitiveParticipleSceneV1 } from "./cp009-catalog-v1";
import { CP009_SCENES_V2 } from "./cp009-catalog-v2";

const patches: Readonly<Record<string, Partial<GerundInfinitiveParticipleSceneV1>>> = {
  "GIP-H02": {
    correctSegments: ["Although the branch agreed to meet again, the audit team recommended reviewing the disputed entries first", "before the report was sent", "to the finance committee", "for final consideration."],
    errorSegments: ["Although the branch agreed to meet again, the audit team recommended to review the disputed entries first", "before the report was sent", "to the finance committee", "for final consideration."],
    errorIndex: 0,
    correction: "Although the branch agreed to meet again, the audit team recommended reviewing the disputed entries first",
  },
  "GIP-H04": {
    correctSegments: ["After considering postponing the vote, the board eventually agreed to reconsider", "the third proposal", "during its closing session", "before members left."],
    errorSegments: ["After considering postponing the vote, the board eventually agreed reconsidering", "the third proposal", "during its closing session", "before members left."],
    errorIndex: 0,
    correction: "After considering postponing the vote, the board eventually agreed to reconsider",
  },
  "GIP-H06": {
    correctSegments: ["After warning them against using phones, the officer reminded the trainees to keep the devices switched off", "until they left", "the practical laboratory", "after the assessment."],
    errorSegments: ["After warning them against using phones, the officer reminded the trainees keep the devices switched off", "until they left", "the practical laboratory", "after the assessment."],
    errorIndex: 0,
    correction: "After warning them against using phones, the officer reminded the trainees to keep the devices switched off",
  },
  "GIP-H08": {
    correctSegments: ["Although the inspector required a register update, the inspection made the contractor revise the safety plan", "before further work", "could begin", "at the site."],
    errorSegments: ["Although the inspector required a register update, the inspection made the contractor to revise the safety plan", "before further work", "could begin", "at the site."],
    errorIndex: 0,
    correction: "Although the inspector required a register update, the inspection made the contractor revise the safety plan",
  },
  "GIP-H10": {
    correctSegments: ["Although the team planned to wait, the rescue leader said they may resume the search", "once the control room", "gives formal clearance", "for the next stage."],
    errorSegments: ["Although the team planned to wait, the rescue leader said they may to resume the search", "once the control room", "gives formal clearance", "for the next stage."],
    errorIndex: 0,
    correction: "Although the team planned to wait, the rescue leader said they may resume the search",
  },
};

export const CP009_SCENES_V3: readonly GerundInfinitiveParticipleSceneV1[] = CP009_SCENES_V2.map((scene) => {
  const patch = patches[scene.id];
  return patch ? { ...scene, ...patch } as GerundInfinitiveParticipleSceneV1 : scene;
});

export const CP009_SCENES_BY_DIFFICULTY_V3: Readonly<Record<EnglishDifficulty, readonly GerundInfinitiveParticipleSceneV1[]>> = Object.freeze({
  easy: CP009_SCENES_V3.filter((scene) => scene.difficulty === "easy"),
  medium: CP009_SCENES_V3.filter((scene) => scene.difficulty === "medium"),
  hard: CP009_SCENES_V3.filter((scene) => scene.difficulty === "hard"),
});
