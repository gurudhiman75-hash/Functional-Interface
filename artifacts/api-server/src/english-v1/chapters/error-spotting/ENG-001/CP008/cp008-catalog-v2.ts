import type { EnglishDifficulty } from "../../../../core/types";
import { CP008_SCENES_V1, type NounQuantifierSceneV1 } from "./cp008-catalog-v1";

const replacements: Readonly<Record<string, Partial<NounQuantifierSceneV1>>> = {
  "NQN-E04": {
    correctSegments: ["Before lunch,", "the clerk worked alone", "and completed", "a few pending forms."],
    errorSegments: ["Before lunch,", "the clerk worked alone", "and completed", "a little pending forms."],
    errorIndex: 3,
    correction: "a few pending forms.",
  },
  "NQN-E08": {
    correctSegments: ["Compared with yesterday's soup,", "this one", "contains", "less salt."],
    errorSegments: ["Compared with yesterday's soup,", "this one", "contains", "fewer salt."],
    errorIndex: 3,
    correction: "less salt.",
  },
  "NQN-M06": {
    correctSegments: ["Although the work continued", "throughout the afternoon,", "the team made", "very little progress."],
    errorSegments: ["Although the work continued", "throughout the afternoon,", "the team made", "very few progress."],
    errorIndex: 3,
    correction: "very little progress.",
  },
  "NQN-M10": {
    correctSegments: ["The monitoring system", "recorded during peak hours", "for the whole building", "the amount of electricity used."],
    errorSegments: ["The monitoring system", "recorded during peak hours", "for the whole building", "the number of electricity used."],
    errorIndex: 3,
    correction: "the amount of electricity used.",
  },
  "NQN-H08": {
    correctSegments: ["The modified process", "produces the same output", "while using", "considerably less water."],
    errorSegments: ["The modified process", "produces the same output", "while using", "considerably fewer water."],
    errorIndex: 3,
    correction: "considerably less water.",
  },
  "NQN-H10": {
    correctSegments: ["For each production unit,", "the review compared", "during normal operation", "the amount of fuel consumed."],
    errorSegments: ["For each production unit,", "the review compared", "during normal operation", "the number of fuel consumed."],
    errorIndex: 3,
    correction: "the amount of fuel consumed.",
  },
  "NQN-H19": {
    correctSegments: ["At the end of the meeting,", "the chairperson listened", "to a final request from", "one of the representatives."],
    errorSegments: ["At the end of the meeting,", "the chairperson listened", "to a final request from", "one of the representative."],
    errorIndex: 3,
    correction: "one of the representatives.",
  },
};

export const CP008_SCENES_V2: readonly NounQuantifierSceneV1[] = CP008_SCENES_V1.map((scene) => {
  const patch = replacements[scene.id];
  return patch ? { ...scene, ...patch } as NounQuantifierSceneV1 : scene;
});

export const CP008_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly NounQuantifierSceneV1[]>> = {
  easy: CP008_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP008_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP008_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
};
