import { scaleSelectedSpatialNodesV1 } from "./gap-runtime-v1";
import type { SpatialCanonicalQuestionV2 } from "./gap-question-remediation-v2";
import { hashSpatialSeed } from "./seed";
import { translateScene } from "./transform";
import type { SpatialScene } from "./types";

function variant(seed: string): { factor: number; dx: number; dy: number } {
  let hash = hashSpatialSeed(`${seed}:EDITORIAL-MATERIAL-V2`) >>> 0;
  const scaleIndex = hash % 11;
  hash = Math.floor(hash / 11);
  const dxIndex = hash % 9;
  hash = Math.floor(hash / 9);
  const dyIndex = hash % 9;
  return {
    factor: 0.88 + scaleIndex * 0.024,
    dx: dxIndex - 4,
    dy: dyIndex - 4,
  };
}

function transformSceneMaterialV2(
  source: SpatialScene,
  factor: number,
  dx: number,
  dy: number,
  suffix: string,
): SpatialScene {
  const ids = source.nodes.map((node) => node.id);
  const scaled = ids.length > 0
    ? scaleSelectedSpatialNodesV1(source, ids, factor, { x: 60, y: 60 }, `${source.id}-${suffix}-scale`)
    : source;
  return translateScene(scaled, dx, dy, `${source.id}-${suffix}`);
}

export function applySpatialEditorialMaterialV2(
  source: SpatialCanonicalQuestionV2,
  seed: string,
): SpatialCanonicalQuestionV2 {
  const selected = variant(seed);
  const mapScene = (scene: SpatialScene, label: string) => transformSceneMaterialV2(
    scene,
    selected.factor,
    selected.dx,
    selected.dy,
    label,
  );
  return {
    ...source,
    stimulusScenes: source.stimulusScenes.map((scene, index) => mapScene(scene, `ev2-s${index + 1}`)),
    correctScene: mapScene(source.correctScene, "ev2-correct"),
    distractors: [
      { ...source.distractors[0], scene: mapScene(source.distractors[0].scene, "ev2-d1") },
      { ...source.distractors[1], scene: mapScene(source.distractors[1].scene, "ev2-d2") },
      { ...source.distractors[2], scene: mapScene(source.distractors[2].scene, "ev2-d3") },
    ],
  };
}
