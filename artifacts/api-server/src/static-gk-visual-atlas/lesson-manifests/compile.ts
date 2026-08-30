import type { StaticGkFactLockPack } from "../fact-packs/types";
import type { StaticGkSceneCue } from "../scenes/types";
import type { StaticGkLessonManifest } from "./types";
import { validateLessonManifest } from "./types";

export function compileLessonManifest(
  manifest: StaticGkLessonManifest,
  factPack: StaticGkFactLockPack,
): StaticGkSceneCue[] {
  validateLessonManifest(manifest);
  if (manifest.visualId !== factPack.visualId) {
    throw new Error(`${manifest.visualId}: manifest/fact-pack visualId mismatch`);
  }

  const factIds = new Set(factPack.facts.map((fact) => fact.id));
  const narrationIds = new Set(factPack.narration.map((narration) => narration.id));
  const geoTargetIds = new Set(factPack.geoTargets.map((target) => target.id));

  for (const shot of manifest.shots) {
    for (const factId of shot.factIds) {
      if (!factIds.has(factId)) throw new Error(`${manifest.visualId}: ${shot.id} references unknown fact ${factId}`);
    }
    if (shot.narrationRef && !narrationIds.has(shot.narrationRef)) {
      throw new Error(`${manifest.visualId}: ${shot.id} references unknown narration ${shot.narrationRef}`);
    }
    for (const action of shot.actions) {
      if (action.targetRef && !geoTargetIds.has(action.targetRef)) {
        throw new Error(`${manifest.visualId}: ${shot.id} references unknown geo target ${action.targetRef}`);
      }
    }
  }

  return manifest.shots.flatMap((shot) =>
    shot.actions.map((action, actionIndex) => ({
      id: `${shot.id}-A${String(actionIndex + 1).padStart(2, "0")}`,
      startMs: shot.startMs,
      endMs: shot.endMs,
      layer: action.layer,
      action: action.action,
      targetRef: action.targetRef,
      text: action.text,
      factIds: [...shot.factIds],
    })),
  );
}
