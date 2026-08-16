import { buildSpatialPrimitiveInstanceSceneV2 } from "./primitive-instance-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import {
  reflectSceneHorizontally,
  reflectSceneVertically,
  rotateScene,
} from "./transform";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import type { SpatialScene } from "./types";

export type SpatialPrimitiveRetrofitChapterV2 = "MIR-001" | "WAT-001" | "FAN-001";
export type SpatialPrimitiveRetrofitTransformV2 =
  | "REFLECT_VERTICAL"
  | "REFLECT_HORIZONTAL"
  | "ROTATE_90_CW"
  | "ROTATE_180"
  | "UNCHANGED";

export interface SpatialPrimitiveRetrofitQuestionV2 {
  chapterCode: SpatialPrimitiveRetrofitChapterV2;
  prototypeId: string;
  transform: Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">;
  sourcePrimitiveId: SpatialPrimitiveIdV2;
  sourceScene: SpatialScene;
  analogyTargetPrimitiveId?: SpatialPrimitiveIdV2;
  pairResultScene?: SpatialScene;
  targetScene?: SpatialScene;
  optionScenes: SpatialScene[];
  optionLabels: SpatialPrimitiveRetrofitTransformV2[];
  correctOptionIndex: number;
}

const PIVOT = { x: 50, y: 50 } as const;

function withMarker(scene: SpatialScene, id: string, x = 31, y = 37): SpatialScene {
  return {
    ...scene,
    id,
    nodes: [
      ...scene.nodes,
      {
        kind: "circle",
        id: `${id}-marker`,
        role: "retrofit-distinguishing-marker",
        layer: 9,
        center: { x, y },
        radius: 3.2,
        style: { stroke: "#111", strokeWidth: 1.2, fill: "#111" },
      },
    ],
    metadata: { ...(scene.metadata ?? {}), semanticRole: "SPATIAL_PRIMITIVE_RETROFIT_STIMULUS_V2" },
  };
}

function baseScene(primitiveId: SpatialPrimitiveIdV2, id: string, markerX = 31, markerY = 37): SpatialScene {
  return withMarker(
    buildSpatialPrimitiveInstanceSceneV2(primitiveId, `${id}-primitive`, { scale: 0.86 }),
    id,
    markerX,
    markerY,
  );
}

export function applySpatialPrimitiveRetrofitTransformV2(
  scene: SpatialScene,
  transform: SpatialPrimitiveRetrofitTransformV2,
  nextId: string,
): SpatialScene {
  switch (transform) {
    case "REFLECT_VERTICAL": return reflectSceneVertically(scene, 50, nextId);
    case "REFLECT_HORIZONTAL": return reflectSceneHorizontally(scene, 50, nextId);
    case "ROTATE_90_CW": return rotateScene(scene, 90, PIVOT, nextId);
    case "ROTATE_180": return rotateScene(scene, 180, PIVOT, nextId);
    case "UNCHANGED": return { ...scene, id: nextId, metadata: scene.metadata ? { ...scene.metadata } : undefined };
  }
}

function orderedOptions(
  source: SpatialScene,
  transforms: readonly SpatialPrimitiveRetrofitTransformV2[],
  correctTransform: SpatialPrimitiveRetrofitTransformV2,
  correctSlot: number,
): { scenes: SpatialScene[]; labels: SpatialPrimitiveRetrofitTransformV2[] } {
  const labels = [...transforms];
  const correctAt = labels.indexOf(correctTransform);
  if (correctAt < 0) throw new Error(`Correct transform '${correctTransform}' missing from candidate set.`);
  [labels[correctAt], labels[correctSlot]] = [labels[correctSlot]!, labels[correctAt]!];
  const scenes = labels.map((label, index) =>
    applySpatialPrimitiveRetrofitTransformV2(source, label, `${source.id}-option-${index + 1}-${label}`),
  );
  const fingerprints = scenes.map(spatialSceneSemanticFingerprint);
  if (new Set(fingerprints).size !== fingerprints.length) {
    throw new Error(`Retrofit candidates collide for '${source.id}'.`);
  }
  return { scenes, labels };
}

const MIRROR_PRIMITIVES: readonly SpatialPrimitiveIdV2[] = ["L_SHAPE", "TRAPEZIUM", "ARROW_RIGHT", "TRIANGLE"];
const WATER_PRIMITIVES: readonly SpatialPrimitiveIdV2[] = ["T_SHAPE", "CHEVRON_RIGHT", "SEMICIRCLE", "THREE_SPOKE"];

export function buildSpatialPrimitiveMirrorWaterRetrofitProofV2(): SpatialPrimitiveRetrofitQuestionV2[] {
  const result: SpatialPrimitiveRetrofitQuestionV2[] = [];
  MIRROR_PRIMITIVES.forEach((primitiveId, index) => {
    const source = baseScene(primitiveId, `MIR-V2-${index + 1}`, 29 + index, 35 + index);
    const correctSlot = index;
    const { scenes, labels } = orderedOptions(
      source,
      ["REFLECT_VERTICAL", "REFLECT_HORIZONTAL", "ROTATE_180", "UNCHANGED"],
      "REFLECT_VERTICAL",
      correctSlot,
    );
    result.push({
      chapterCode: "MIR-001",
      prototypeId: `MIR-001-V2-${index + 1}`,
      transform: "REFLECT_VERTICAL",
      sourcePrimitiveId: primitiveId,
      sourceScene: source,
      optionScenes: scenes,
      optionLabels: labels,
      correctOptionIndex: correctSlot,
    });
  });
  WATER_PRIMITIVES.forEach((primitiveId, index) => {
    const source = baseScene(primitiveId, `WAT-V2-${index + 1}`, 30 + index, 38 + index);
    const correctSlot = index;
    const { scenes, labels } = orderedOptions(
      source,
      ["REFLECT_HORIZONTAL", "REFLECT_VERTICAL", "ROTATE_180", "UNCHANGED"],
      "REFLECT_HORIZONTAL",
      correctSlot,
    );
    result.push({
      chapterCode: "WAT-001",
      prototypeId: `WAT-001-V2-${index + 1}`,
      transform: "REFLECT_HORIZONTAL",
      sourcePrimitiveId: primitiveId,
      sourceScene: source,
      optionScenes: scenes,
      optionLabels: labels,
      correctOptionIndex: correctSlot,
    });
  });
  return result;
}

const FAN_CASES: readonly {
  a: SpatialPrimitiveIdV2;
  c: SpatialPrimitiveIdV2;
  transform: Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">;
}[] = [
  { a: "L_SHAPE", c: "TRAPEZIUM", transform: "ROTATE_90_CW" },
  { a: "ARROW_RIGHT", c: "CHEVRON_RIGHT", transform: "ROTATE_180" },
  { a: "T_SHAPE", c: "SEMICIRCLE", transform: "REFLECT_VERTICAL" },
  { a: "U_SHAPE", c: "TRIANGLE", transform: "REFLECT_HORIZONTAL" },
  { a: "ZIGZAG", c: "THREE_SPOKE", transform: "ROTATE_90_CW" },
  { a: "SQUARE_DIAGONAL_DIVIDED", c: "PENTAGON", transform: "REFLECT_VERTICAL" },
] as const;

export function buildSpatialPrimitiveFanRetrofitProofV2(): SpatialPrimitiveRetrofitQuestionV2[] {
  return FAN_CASES.map((entry, index) => {
    const a = baseScene(entry.a, `FAN-V2-${index + 1}-A`, 30, 36);
    const b = applySpatialPrimitiveRetrofitTransformV2(a, entry.transform, `FAN-V2-${index + 1}-B`);
    const c = baseScene(entry.c, `FAN-V2-${index + 1}-C`, 34, 39);
    const transforms: SpatialPrimitiveRetrofitTransformV2[] =
      entry.transform === "ROTATE_90_CW"
        ? ["ROTATE_90_CW", "ROTATE_180", "REFLECT_VERTICAL", "UNCHANGED"]
        : entry.transform === "ROTATE_180"
          ? ["ROTATE_180", "REFLECT_VERTICAL", "REFLECT_HORIZONTAL", "UNCHANGED"]
          : [entry.transform, entry.transform === "REFLECT_VERTICAL" ? "REFLECT_HORIZONTAL" : "REFLECT_VERTICAL", "ROTATE_180", "UNCHANGED"];
    const correctSlot = index % 4;
    const { scenes, labels } = orderedOptions(c, transforms, entry.transform, correctSlot);
    return {
      chapterCode: "FAN-001",
      prototypeId: `FAN-001-V2-${index + 1}`,
      transform: entry.transform,
      sourcePrimitiveId: entry.a,
      sourceScene: a,
      analogyTargetPrimitiveId: entry.c,
      pairResultScene: b,
      targetScene: c,
      optionScenes: scenes,
      optionLabels: labels,
      correctOptionIndex: correctSlot,
    };
  });
}
