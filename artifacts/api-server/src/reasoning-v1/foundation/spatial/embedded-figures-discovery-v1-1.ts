import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  figureGraphFingerprintV1,
  findFigureGraphEmbeddingsV1,
  spatialSceneToFigureGraphV1,
  type FigureGraphMatchPolicyV1,
} from "./figure-graph-v1";
import {
  EMB_001_PROTOTYPES_V1,
  generateEmbeddedFigureDiscoveryQuestionV1,
  type EmbeddedFigureMisconceptionV1,
  type EmbeddedFigureOptionV1,
  type EmbeddedFigurePrototypeV1,
  type EmbeddedFigureQuestionV1,
} from "./embedded-figures-discovery-v1";

export { EMB_001_PROTOTYPES_V1 };
export type { EmbeddedFigureMisconceptionV1, EmbeddedFigureOptionV1, EmbeddedFigurePrototypeV1, EmbeddedFigureQuestionV1 };

export const EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1 = Object.freeze({
  authorityId: "EMB-001-DISCOVERY-HARDENING-V1.1" as const,
  supersedesGenerator: "EMB-001-DISCOVERY-QUESTION-V1" as const,
  remediation: {
    topologyTargetChiral: true,
    reflectedNearMissCannotPassByTargetSymmetry: true,
    reflectionStillDisallowedByDefault: true,
  },
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowed: false,
} as const);

const LETTERS = ["A", "B", "C", "D"] as const;
const STYLE = Object.freeze({ stroke: "#111", strokeWidth: 2.6, fill: "none" as const, lineCap: "round" as const, lineJoin: "round" as const });

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function fraction(seed: string, key: string, min: number, max: number): number {
  const unit = hash32(`${seed}:${key}`) / 0xffffffff;
  return min + (max - min) * unit;
}

function line(id: string, a: SpatialPoint, b: SpatialPoint, role: string): SpatialNode {
  return { kind: "line", id, role, start: { ...a }, end: { ...b }, style: { ...STYLE } };
}

function scene(id: string, nodes: SpatialNode[], width: number, height: number): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: { minX: 0, minY: 0, width, height },
    nodes,
    metadata: { chapterCode: "EMB-001", semanticRole: "TOPOLOGY_CHIRAL_HARDENED" },
  };
}

function chiralTargetNodes(): SpatialNode[] {
  const top = { x: 50, y: 23 };
  const right = { x: 72, y: 45 };
  const bottom = { x: 50, y: 67 };
  const left = { x: 28, y: 45 };
  const branchEnd = { x: 64, y: 82 };
  return [
    line("t1", top, right, "target"),
    line("t2", right, bottom, "target"),
    line("t3", bottom, left, "target"),
    line("t4", left, top, "target"),
    line("t5", bottom, branchEnd, "target"),
  ];
}

function centroid(nodes: readonly SpatialNode[]): SpatialPoint {
  const points: SpatialPoint[] = [];
  for (const node of nodes) {
    if (node.kind !== "line") continue;
    points.push(node.start, node.end);
  }
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function transformPoint(
  point: SpatialPoint,
  origin: SpatialPoint,
  destination: SpatialPoint,
  rotationDeg: number,
  reflected: boolean,
): SpatialPoint {
  let x = point.x - origin.x;
  const y = point.y - origin.y;
  if (reflected) x = -x;
  const angle = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: destination.x + x * cos - y * sin,
    y: destination.y + x * sin + y * cos,
  };
}

function transformNodes(
  nodes: readonly SpatialNode[],
  destination: SpatialPoint,
  rotationDeg: number,
  reflected: boolean,
  prefix: string,
): SpatialNode[] {
  const origin = centroid(nodes);
  return nodes.map((node) => {
    if (node.kind !== "line") throw new Error("Hardened EMB topology target must contain lines only.");
    return {
      ...node,
      id: `${prefix}${node.id}`,
      start: transformPoint(node.start, origin, destination, rotationDeg, reflected),
      end: transformPoint(node.end, origin, destination, rotationDeg, reflected),
    };
  });
}

function clutter(seed: string): SpatialNode[] {
  const dx = fraction(seed, "clutter-x", -2, 2);
  const dy = fraction(seed, "clutter-y", -2, 2);
  const raw = [
    [{ x: 10, y: 18 }, { x: 109, y: 86 }],
    [{ x: 11, y: 96 }, { x: 106, y: 22 }],
    [{ x: 7, y: 56 }, { x: 113, y: 56 }],
    [{ x: 61, y: 7 }, { x: 61, y: 113 }],
    [{ x: 16, y: 28 }, { x: 108, y: 79 }],
    [{ x: 20, y: 108 }, { x: 98, y: 16 }],
    [{ x: 8, y: 76 }, { x: 112, y: 34 }],
  ] as const;
  return raw.map(([a, b], index) => line(
    `clutter-${index}`,
    { x: a.x + dx, y: a.y + dy },
    { x: b.x + dx, y: b.y + dy },
    "clutter",
  ));
}

function cloneClutter(nodes: readonly SpatialNode[], prefix: string): SpatialNode[] {
  return nodes.map((node) => ({ ...node, id: `${prefix}${node.id}` } as SpatialNode));
}

function graphPolicy(): FigureGraphMatchPolicyV1 {
  return { allowRotation: true, allowReflection: false, allowScale: false, tolerance: 1e-4 };
}

function topologyQuestion(seed: string, desiredCorrectOptionIndex: 0 | 1 | 2 | 3): EmbeddedFigureQuestionV1 {
  const targetNodes = chiralTargetNodes();
  const targetScene = scene(`emb-v1-1-target:${seed}`, targetNodes, 100, 100);
  const targetGraph = spatialSceneToFigureGraphV1(targetScene);
  const destination = {
    x: fraction(seed, "dest-x", 54, 67),
    y: fraction(seed, "dest-y", 53, 68),
  };
  const rotationDeg = [0, 45, 90, 135, 180][hash32(`${seed}:rotation`) % 5]!;
  const baseClutter = clutter(seed);
  const correctNodes = transformNodes(targetNodes, destination, rotationDeg, false, "correct-");
  const reflectedNodes = transformNodes(targetNodes, destination, rotationDeg, true, "reflected-");
  const missingNodes = correctNodes.filter((_, index) => index !== 1).map((node) => ({ ...node, id: `missing-${node.id}` } as SpatialNode));
  const brokenNodes = correctNodes.map((node, index) => {
    if (index !== 4 || node.kind !== "line") return { ...node, id: `broken-${node.id}` } as SpatialNode;
    return {
      ...node,
      id: `broken-${node.id}`,
      start: { x: node.start.x + 7, y: node.start.y - 3 },
    };
  });

  const raw = [
    {
      scene: scene(`emb-v1-1-correct:${seed}`, [...cloneClutter(baseClutter, "c-"), ...correctNodes], 120, 120),
      misconception: "CORRECT_EMBEDDING" as const,
    },
    {
      scene: scene(`emb-v1-1-broken:${seed}`, [...cloneClutter(baseClutter, "b-"), ...brokenNodes], 120, 120),
      misconception: "BROKEN_TARGET_JUNCTION" as const,
    },
    {
      scene: scene(`emb-v1-1-reflected:${seed}`, [...cloneClutter(baseClutter, "r-"), ...reflectedNodes], 120, 120),
      misconception: "REFLECTED_TARGET_ONLY" as const,
    },
    {
      scene: scene(`emb-v1-1-missing:${seed}`, [...cloneClutter(baseClutter, "m-"), ...missingNodes], 120, 120),
      misconception: "MISSING_TARGET_EDGE" as const,
    },
  ];
  const distractors = raw.slice(1);
  const orderedRaw = [...distractors];
  orderedRaw.splice(desiredCorrectOptionIndex, 0, raw[0]!);
  const policy = graphPolicy();
  const options: EmbeddedFigureOptionV1[] = orderedRaw.map((option) => {
    const graph = spatialSceneToFigureGraphV1(option.scene);
    return {
      scene: option.scene,
      misconception: option.misconception,
      graphFingerprint: figureGraphFingerprintV1(graph),
      embeddingCount: findFigureGraphEmbeddingsV1(targetGraph, graph, policy).length,
    };
  });
  const matchingOptionIndexes = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.embeddingCount > 0)
    .map(({ index }) => index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desiredCorrectOptionIndex) {
    throw new Error(`EMB-PROT-05-TOPOLOGY-NEAR-MISS/${seed}: hardened topology solver did not preserve one unique answer.`);
  }
  if (options[desiredCorrectOptionIndex]!.misconception !== "CORRECT_EMBEDDING") {
    throw new Error(`EMB-PROT-05-TOPOLOGY-NEAR-MISS/${seed}: correct-option ownership lost.`);
  }
  const sceneFingerprints = options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  if (new Set(sceneFingerprints).size !== 4) throw new Error(`EMB-PROT-05-TOPOLOGY-NEAR-MISS/${seed}: option scenes are not unique.`);
  const answer = LETTERS[desiredCorrectOptionIndex];
  const contentFingerprint = JSON.stringify({
    prototypeId: "EMB-PROT-05-TOPOLOGY-NEAR-MISS",
    target: spatialSceneSemanticFingerprint(targetScene),
    optionSet: [...sceneFingerprints].sort(),
    correct: sceneFingerprints[desiredCorrectOptionIndex],
    policy,
    hardening: EMB_001_DISCOVERY_HARDENING_AUTHORITY_V1_1.authorityId,
  });
  const deliveryFingerprint = JSON.stringify({ contentFingerprint, orderedOptions: sceneFingerprints, correctOptionIndex: desiredCorrectOptionIndex });

  return {
    version: "EMB-001-DISCOVERY-QUESTION-V1",
    packageId: "SPA-001",
    chapterCode: "EMB-001",
    prototypeId: "EMB-PROT-05-TOPOLOGY-NEAR-MISS",
    permanentQlId: null,
    seed,
    difficulty: "L3_ADVANCED",
    stem: "The problem figure is hidden inside one of the answer figures. Select the answer figure that contains the problem figure exactly.",
    targetScene,
    options,
    correctOptionIndex: desiredCorrectOptionIndex,
    answer,
    matchPolicy: policy,
    solverEvidence: {
      targetGraphFingerprint: figureGraphFingerprintV1(targetGraph),
      optionEmbeddingCounts: options.map((option) => option.embeddingCount),
      matchingOptionIndexes,
    },
    explanation: {
      observation: "The target is a diamond-like loop with a short branch leaving its lower vertex toward one side.",
      rule: "The full loop, the exact shared junction and the branch direction must all be present under rotation. A reflected version is not the same target.",
      application: `Option ${answer} contains the closed four-edge loop and the slanting branch attached to the same vertex as the problem figure.`,
      check: `Option ${answer} is the only answer figure with the exact chiral topology; the near-misses break a junction, omit an edge or contain only the reflected target.`,
    },
    contentFingerprint,
    deliveryFingerprint,
    renderer: { recommendedTargetPixels: 250, recommendedOptionPixels: 180, mobileMinimumOptionPixels: 112 },
    lifecycle: {
      maturity: "EXECUTABLE_DISCOVERY_PROOF",
      questionStudioDiscoverable: false,
      questionStudioRegistration: "NOT_REGISTERED",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticPublication: false,
    },
  };
}

export function generateEmbeddedFigureDiscoveryQuestionV1_1(request: {
  prototypeId: EmbeddedFigurePrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedFigureQuestionV1 {
  const seed = request.seed.trim();
  if (!seed) throw new Error("EMB-001 V1.1 requires a non-empty deterministic seed.");
  const desiredCorrectOptionIndex = request.desiredCorrectOptionIndex ?? ((hash32(`${seed}:answer-slot`) % 4) as 0 | 1 | 2 | 3);
  if (request.prototypeId === "EMB-PROT-05-TOPOLOGY-NEAR-MISS") {
    return topologyQuestion(seed, desiredCorrectOptionIndex);
  }
  return generateEmbeddedFigureDiscoveryQuestionV1({
    prototypeId: request.prototypeId,
    seed,
    desiredCorrectOptionIndex,
  });
}
