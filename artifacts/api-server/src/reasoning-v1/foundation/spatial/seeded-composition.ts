import { validateMarkerClearance } from "./perceptual-validator";
import { SpatialSeededRandom } from "./seed";
import {
  buildStandardTransformCandidates,
  classifySpatialSceneSymmetry,
  transformSceneByRequestedOperation,
} from "./symmetry";
import { validateSpatialTransformCandidateUniqueness } from "./transform-validator";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialNode,
  type SpatialScene,
} from "./types";
import { validateSpatialScene } from "./validator";

const AXIS = 50;
const MAX_ATTEMPTS = 64;

function legacyNodes(
  random: SpatialSeededRandom,
  jitter: () => number,
  primaryFill: string,
): SpatialNode[] {
  return [
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
      style: { stroke: "#111", strokeWidth: 2, fill: primaryFill, lineJoin: "round" },
    },
    {
      kind: "circle",
      id: "marker",
      role: "distinguishing-marker",
      layer: 3,
      center: { x: random.int(31, 40), y: random.int(53, 63) },
      radius: 3,
      style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
    },
    {
      kind: "polyline",
      id: "orientation-mark",
      role: "orientation-mark",
      layer: 4,
      points: [
        { x: 28 + jitter(), y: 27 + jitter() },
        { x: 35 + jitter(), y: 18 + jitter() },
        { x: 45 + jitter(), y: 27 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 2, fill: "none", lineCap: "round", lineJoin: "round" },
    },
    {
      kind: "polygon",
      id: "secondary-shape",
      role: "secondary-shape",
      layer: 2,
      points: [
        { x: 59 + jitter(), y: 42 + jitter() },
        { x: 71 + jitter(), y: 48 + jitter() },
        { x: 61 + jitter(), y: 57 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 1.5, fill: "none" },
    },
  ];
}

function nestedNodes(
  random: SpatialSeededRandom,
  jitter: () => number,
  _primaryFill: string,
): SpatialNode[] {
  return [
    {
      kind: "circle",
      id: "primary-shape",
      role: "primary-shape",
      layer: 1,
      center: { x: 48 + jitter(), y: 49 + jitter() },
      radius: 27,
      style: { stroke: "#111", strokeWidth: 2, fill: "none" },
    },
    {
      kind: "circle",
      id: "marker",
      role: "distinguishing-marker",
      layer: 3,
      center: { x: random.int(32, 39), y: random.int(55, 63) },
      radius: 3,
      style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
    },
    {
      kind: "polyline",
      id: "orientation-mark",
      role: "orientation-mark",
      layer: 4,
      points: [
        { x: 65 + jitter(), y: 24 + jitter() },
        { x: 75 + jitter(), y: 24 + jitter() },
        { x: 75 + jitter(), y: 34 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 2, fill: "none", lineCap: "round", lineJoin: "round" },
    },
    {
      kind: "polygon",
      id: "secondary-shape",
      role: "secondary-shape",
      layer: 2,
      points: [
        { x: 56 + jitter(), y: 38 + jitter() },
        { x: 69 + jitter(), y: 43 + jitter() },
        { x: 58 + jitter(), y: 50 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 1.7, fill: "#d1d5db" },
    },
  ];
}

function zigzagNodes(
  random: SpatialSeededRandom,
  jitter: () => number,
  _primaryFill: string,
): SpatialNode[] {
  return [
    {
      kind: "polyline",
      id: "primary-shape",
      role: "primary-shape",
      layer: 1,
      points: [
        { x: 22 + jitter(), y: 29 + jitter() },
        { x: 62 + jitter(), y: 24 + jitter() },
        { x: 73 + jitter(), y: 45 + jitter() },
        { x: 57 + jitter(), y: 72 + jitter() },
        { x: 27 + jitter(), y: 64 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 2.2, fill: "none", lineCap: "round", lineJoin: "round" },
    },
    {
      kind: "circle",
      id: "marker",
      role: "distinguishing-marker",
      layer: 3,
      center: { x: random.int(31, 38), y: random.int(39, 48) },
      radius: 3,
      style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
    },
    {
      kind: "line",
      id: "orientation-mark",
      role: "orientation-mark",
      layer: 4,
      start: { x: 31 + jitter(), y: 76 + jitter() },
      end: { x: 46 + jitter(), y: 83 + jitter() },
      style: { stroke: "#111", strokeWidth: 2.2, lineCap: "round" },
    },
    {
      kind: "circle",
      id: "secondary-shape",
      role: "secondary-shape",
      layer: 2,
      center: { x: 65 + jitter(), y: 55 + jitter() },
      radius: 7,
      style: { stroke: "#111", strokeWidth: 1.7, fill: "none" },
    },
  ];
}

function hexagonNodes(
  random: SpatialSeededRandom,
  jitter: () => number,
  _primaryFill: string,
): SpatialNode[] {
  return [
    {
      kind: "polygon",
      id: "primary-shape",
      role: "primary-shape",
      layer: 1,
      points: [
        { x: 31 + jitter(), y: 22 + jitter() },
        { x: 61 + jitter(), y: 25 + jitter() },
        { x: 75 + jitter(), y: 43 + jitter() },
        { x: 66 + jitter(), y: 72 + jitter() },
        { x: 37 + jitter(), y: 77 + jitter() },
        { x: 23 + jitter(), y: 51 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 2, fill: "#e5e7eb", lineJoin: "round" },
    },
    {
      kind: "circle",
      id: "marker",
      role: "distinguishing-marker",
      layer: 3,
      center: { x: random.int(35, 42), y: random.int(55, 64) },
      radius: 3,
      style: { stroke: "#111", strokeWidth: 1.5, fill: "#111" },
    },
    {
      kind: "polyline",
      id: "orientation-mark",
      role: "orientation-mark",
      layer: 4,
      points: [
        { x: 54 + jitter(), y: 17 + jitter() },
        { x: 62 + jitter(), y: 10 + jitter() },
        { x: 69 + jitter(), y: 18 + jitter() },
      ],
      style: { stroke: "#111", strokeWidth: 2, fill: "none", lineCap: "round", lineJoin: "round" },
    },
    {
      kind: "line",
      id: "secondary-shape",
      role: "secondary-shape",
      layer: 2,
      start: { x: 53 + jitter(), y: 38 + jitter() },
      end: { x: 69 + jitter(), y: 56 + jitter() },
      style: { stroke: "#111", strokeWidth: 2.2, lineCap: "round" },
    },
  ];
}

function buildCandidateScene(seed: string, attempt: number): SpatialScene {
  const random = new SpatialSeededRandom(`${seed}:composition:${attempt}`);
  const templateIndex = random.int(0, 3);
  const jitter = () => random.int(-2, 2);
  const primaryFill = random.pick(["none", "#e5e7eb", "#d1d5db"] as const);
  const builders = [legacyNodes, nestedNodes, zigzagNodes, hexagonNodes] as const;
  const nodes = builders[templateIndex]!(random, jitter, primaryFill);

  return {
    version: SPATIAL_SCENE_VERSION,
    id: `SPA-PROOF-${seed}-${attempt}`,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    metadata: {
      seed,
      semanticRole: "seeded-asymmetric-composition",
      proofAttempt: attempt,
      templateKind: ["QUADRILATERAL", "NESTED_CIRCLE", "OPEN_ZIGZAG", "IRREGULAR_HEXAGON"][templateIndex]!,
    },
    nodes,
  };
}

export function buildSeededAsymmetricComposition(seed: string): SpatialScene {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const scene = buildCandidateScene(seed, attempt);
    const sceneValidation = validateSpatialScene(scene);
    if (!sceneValidation.ok) continue;

    const axes = { axisX: AXIS, axisY: AXIS, pivot: { x: AXIS, y: AXIS } };
    const symmetry = classifySpatialSceneSymmetry(scene, axes);
    if (symmetry.vertical || symmetry.horizontal || symmetry.rotational180) continue;

    const candidateValidation = validateSpatialTransformCandidateUniqueness(
      buildStandardTransformCandidates(scene, axes),
    );
    if (!candidateValidation.ok) continue;

    const vertical = transformSceneByRequestedOperation(scene, "REFLECT_VERTICAL", axes);
    const horizontal = transformSceneByRequestedOperation(scene, "REFLECT_HORIZONTAL", axes);
    const markerOnly = (transformed: SpatialScene, suffix: string): SpatialScene => {
      const transformedMarker = transformed.nodes.find((node) => node.id === "marker");
      return {
        ...scene,
        id: `${scene.id}-${suffix}`,
        nodes: scene.nodes.map((node) =>
          node.id === "marker" && transformedMarker ? transformedMarker : node,
        ),
      };
    };
    const verticalMarkerOnly = markerOnly(vertical, "vertical-marker-only");
    const horizontalMarkerOnly = markerOnly(horizontal, "horizontal-marker-only");
    if (
      !validateMarkerClearance(scene).ok ||
      !validateMarkerClearance(vertical).ok ||
      !validateMarkerClearance(horizontal).ok ||
      !validateMarkerClearance(verticalMarkerOnly).ok ||
      !validateMarkerClearance(horizontalMarkerOnly).ok
    ) {
      continue;
    }

    return scene;
  }

  throw new Error(
    `Unable to construct a valid asymmetric spatial proof scene for seed '${seed}'.`,
  );
}

export const SPATIAL_PROOF_AXIS = AXIS;
