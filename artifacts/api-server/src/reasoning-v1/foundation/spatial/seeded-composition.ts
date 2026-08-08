import { SPATIAL_SCENE_VERSION, type SpatialScene } from "./types";
import { SpatialSeededRandom } from "./seed";
import { buildStandardTransformCandidates, classifySpatialSceneSymmetry } from "./symmetry";
import { validateSpatialTransformCandidateUniqueness } from "./transform-validator";
import { validateSpatialScene } from "./validator";

const AXIS = 50;
const MAX_ATTEMPTS = 24;

function buildCandidateScene(seed: string, attempt: number): SpatialScene {
  const random = new SpatialSeededRandom(`${seed}:composition:${attempt}`);
  const jitter = () => random.int(-3, 3);
  const markerLeft = random.pick([true, false]);
  const markerTop = random.pick([true, false]);
  const primaryFill = random.pick(["none", "#e5e7eb", "#d1d5db"] as const);

  return {
    version: SPATIAL_SCENE_VERSION,
    id: `SPA-PROOF-${seed}-${attempt}`,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    metadata: {
      seed,
      semanticRole: "seeded-asymmetric-composition",
      proofAttempt: attempt,
    },
    nodes: [
      {
        kind: "polygon",
        id: "primary-shape",
        role: "primary-shape",
        layer: 1,
        points: [
          { x: 24 + jitter(), y: 31 + jitter() },
          { x: 65 + jitter(), y: 25 + jitter() },
          { x: 73 + jitter(), y: 63 + jitter() },
          { x: 35 + jitter(), y: 74 + jitter() },
        ],
        style: {
          stroke: "#111",
          strokeWidth: 2,
          fill: primaryFill,
          lineJoin: "round",
        },
        explanationTags: ["transform-entire-shape"],
      },
      {
        kind: "circle",
        id: "marker",
        role: "distinguishing-marker",
        layer: 3,
        center: {
          x: markerLeft ? random.int(31, 40) : random.int(58, 67),
          y: markerTop ? random.int(35, 44) : random.int(56, 66),
        },
        radius: random.int(3, 5),
        style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
        explanationTags: ["track-marker-position"],
      },
      {
        kind: "polyline",
        id: "orientation-mark",
        role: "orientation-mark",
        layer: 4,
        points: [
          { x: 29 + jitter(), y: 28 + jitter() },
          { x: 36 + jitter(), y: 20 + jitter() },
          { x: 42 + jitter(), y: 27 + jitter() },
        ],
        style: {
          stroke: "#111",
          strokeWidth: 2,
          fill: "none",
          lineCap: "round",
          lineJoin: "round",
        },
        explanationTags: ["track-orientation"],
      },
      {
        kind: "polygon",
        id: "secondary-shape",
        role: "secondary-shape",
        layer: 2,
        points: [
          { x: 57 + jitter(), y: 46 + jitter() },
          { x: 69 + jitter(), y: 50 + jitter() },
          { x: 61 + jitter(), y: 59 + jitter() },
        ],
        style: { stroke: "#111", strokeWidth: 1.5, fill: "none" },
        explanationTags: ["track-secondary-shape"],
      },
    ],
  };
}

export function buildSeededAsymmetricComposition(seed: string): SpatialScene {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const scene = buildCandidateScene(seed, attempt);
    const sceneValidation = validateSpatialScene(scene);
    if (!sceneValidation.ok) continue;

    const symmetry = classifySpatialSceneSymmetry(scene, {
      axisX: AXIS,
      axisY: AXIS,
      pivot: { x: AXIS, y: AXIS },
    });
    if (symmetry.vertical || symmetry.horizontal || symmetry.rotational180) {
      continue;
    }

    const candidateValidation = validateSpatialTransformCandidateUniqueness(
      buildStandardTransformCandidates(scene, {
        axisX: AXIS,
        axisY: AXIS,
        pivot: { x: AXIS, y: AXIS },
      }),
    );
    if (!candidateValidation.ok) continue;

    return scene;
  }

  throw new Error(
    `Unable to construct a valid asymmetric spatial proof scene for seed '${seed}'.`,
  );
}

export const SPATIAL_PROOF_AXIS = AXIS;
