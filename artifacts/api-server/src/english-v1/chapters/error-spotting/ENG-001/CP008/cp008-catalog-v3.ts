import type { EnglishDifficulty } from "../../../../core/types";
import type { NounQuantifierSceneV1 } from "./cp008-catalog-v1";
import { CP008_SCENES_V2 } from "./cp008-catalog-v2";

const patches: Readonly<Record<string, Partial<NounQuantifierSceneV1>>> = {
  "NQN-H03": {
    correctSegments: ["Although little time remained after the first test,", "the later work continued", "under the same conditions", "with a few additional trials producing consistent results."],
    errorSegments: ["Although little time remained after the first test,", "the later work continued", "under the same conditions", "with a little additional trials producing consistent results."],
    errorIndex: 3,
    correction: "with a few additional trials producing consistent results.",
    reason: "'Little' is correct with uncountable 'time', but 'trials' is plural and countable, so the later phrase requires 'a few'.",
  },
  "NQN-H07": {
    correctSegments: ["Although less staff time was spent on routine entry,", "the branch processed the same workload", "during the busiest hours", "and recorded fewer manual transactions."],
    errorSegments: ["Although less staff time was spent on routine entry,", "the branch processed the same workload", "during the busiest hours", "and recorded less manual transactions."],
    errorIndex: 3,
    correction: "and recorded fewer manual transactions.",
    reason: "'Less' correctly modifies uncountable 'staff time', but plural countable 'transactions' requires 'fewer'.",
  },
  "NQN-H09": {
    correctSegments: ["Although the amount of time spent on each call fell,", "the cancellation rate also declined", "during the review period", "as the number of appointments cancelled at short notice decreased."],
    errorSegments: ["Although the amount of time spent on each call fell,", "the cancellation rate also declined", "during the review period", "as the amount of appointments cancelled at short notice decreased."],
    errorIndex: 3,
    correction: "as the number of appointments cancelled at short notice decreased.",
    reason: "'Amount' is correct with uncountable 'time', but plural countable 'appointments' must be measured by 'number'.",
  },
};

export const CP008_SCENES_V3: readonly NounQuantifierSceneV1[] = CP008_SCENES_V2.map((scene) => {
  const patch = patches[scene.id];
  return patch ? { ...scene, ...patch } as NounQuantifierSceneV1 : scene;
});

export const CP008_SCENES_BY_DIFFICULTY_V3: Readonly<Record<EnglishDifficulty, readonly NounQuantifierSceneV1[]>> = {
  easy: CP008_SCENES_V3.filter((scene) => scene.difficulty === "easy"),
  medium: CP008_SCENES_V3.filter((scene) => scene.difficulty === "medium"),
  hard: CP008_SCENES_V3.filter((scene) => scene.difficulty === "hard"),
};
