import type { EnglishDifficulty } from "../../../../core/types";
import type { GerundInfinitiveParticipleSceneV1 } from "./cp009-catalog-v1";
import {
  CP009_SCENES_V2 as CP009_SCENES_V2_BASE,
} from "./cp009-catalog-v2-base";

function finalRevision(
  id: string,
  correctSegments: readonly [string, string, string, string],
  errorSegments: readonly [string, string, string, string],
  errorIndex: 0 | 1 | 2 | 3,
  correction: string,
): GerundInfinitiveParticipleSceneV1 {
  const base = CP009_SCENES_V2_BASE.find((scene) => scene.id === id);
  if (!base) throw new Error(`Unknown CP009 V2 scene ${id}.`);
  return { ...base, correctSegments, errorSegments, errorIndex, correction };
}

const finalOverrides: Readonly<Record<string, GerundInfinitiveParticipleSceneV1>> = Object.freeze({
  "GIP-E20": finalRevision(
    "GIP-E20",
    ["After verification,", "the documents", "submitted yesterday", "were sent to accounts."],
    ["After verification,", "the documents", "submitting yesterday", "were sent to accounts."],
    2,
    "submitted yesterday",
  ),
  "GIP-H11": finalRevision(
    "GIP-H11",
    ["The clerk approved the request", "and forwarded it", "to the accounts section", "without checking the supporting documents."],
    ["The clerk approved the request", "and forwarded it", "to the accounts section", "without to check the supporting documents."],
    3,
    "without checking the supporting documents.",
  ),
});

export const CP009_SCENES_V2: readonly GerundInfinitiveParticipleSceneV1[] = CP009_SCENES_V2_BASE.map(
  (scene) => finalOverrides[scene.id] ?? scene,
);

export const CP009_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly GerundInfinitiveParticipleSceneV1[]>> = Object.freeze({
  easy: CP009_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP009_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP009_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
});
