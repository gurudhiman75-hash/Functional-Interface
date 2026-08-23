import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  figureGraphFingerprintV1,
  findFigureGraphEmbeddingsV1,
  spatialSceneToFigureGraphV1,
} from "./figure-graph-v1";
import {
  generateEmbeddedFigureDiscoveryQuestionV1_1 as generateBaseForwardQuestion,
  type EmbeddedFigurePrototypeV1,
  type EmbeddedFigureQuestionV1,
} from "./embedded-figures-discovery-v1-1";
import {
  EMB_001_VISUAL_HARDENING_AUTHORITY_V2,
  generateEmbeddedDirectionalQuestionV3,
  generateEmbeddedFigureDiscoveryQuestionV2,
} from "./embedded-figures-visual-hardening-v2";

export { generateEmbeddedDirectionalQuestionV3 };

export const EMB_001_VISUAL_HARDENING_AUTHORITY_V2_1 = Object.freeze({
  authorityId: "EMB-001-VISUAL-HARDENING-V2.1" as const,
  supersedesAuthorityId: EMB_001_VISUAL_HARDENING_AUTHORITY_V2.authorityId,
  remediation: {
    ...EMB_001_VISUAL_HARDENING_AUTHORITY_V2.remediation,
    directRigidNoRotationPolicyPreserved: true,
    directRigidUsesTranslationOnlyPlacement: true,
  },
  status: "VISUAL_HARDENING_REVIEW_CANDIDATE" as const,
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowed: false,
} as const);

const STYLE = Object.freeze({ stroke: "#111", strokeWidth: 2.35, fill: "none" as const, lineCap: "round" as const, lineJoin: "round" as const });

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

function line(id: string, a: SpatialPoint, b: SpatialPoint): SpatialNode {
  return { kind: "line", id, role: "clutter", start: { ...a }, end: { ...b }, style: { ...STYLE } };
}

function rotate(point: SpatialPoint, origin: SpatialPoint, angleDeg: number): SpatialPoint {
  const angle = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  return { x: origin.x + x * cos - y * sin, y: origin.y + x * sin + y * cos };
}

function directStructuredClutter(seed: string, optionIndex: number): SpatialNode[] {
  const layouts: Array<Array<[SpatialPoint, SpatialPoint]>> = [
    [
      [{ x: 14, y: 22 }, { x: 58, y: 12 }], [{ x: 58, y: 12 }, { x: 105, y: 39 }], [{ x: 105, y: 39 }, { x: 88, y: 94 }], [{ x: 88, y: 94 }, { x: 26, y: 101 }], [{ x: 26, y: 101 }, { x: 14, y: 22 }],
      [{ x: 18, y: 76 }, { x: 62, y: 25 }], [{ x: 62, y: 25 }, { x: 105, y: 78 }], [{ x: 105, y: 78 }, { x: 18, y: 76 }], [{ x: 58, y: 12 }, { x: 88, y: 94 }],
    ],
    [
      [{ x: 12, y: 30 }, { x: 47, y: 13 }], [{ x: 47, y: 13 }, { x: 104, y: 30 }], [{ x: 104, y: 30 }, { x: 92, y: 74 }], [{ x: 92, y: 74 }, { x: 56, y: 103 }], [{ x: 56, y: 103 }, { x: 18, y: 84 }], [{ x: 18, y: 84 }, { x: 12, y: 30 }],
      [{ x: 18, y: 84 }, { x: 72, y: 42 }], [{ x: 72, y: 42 }, { x: 47, y: 13 }], [{ x: 34, y: 57 }, { x: 104, y: 30 }],
    ],
    [
      [{ x: 16, y: 18 }, { x: 96, y: 23 }], [{ x: 96, y: 23 }, { x: 101, y: 88 }], [{ x: 101, y: 88 }, { x: 22, y: 98 }], [{ x: 22, y: 98 }, { x: 16, y: 18 }],
      [{ x: 29, y: 32 }, { x: 81, y: 38 }], [{ x: 81, y: 38 }, { x: 74, y: 79 }], [{ x: 74, y: 79 }, { x: 34, y: 73 }], [{ x: 34, y: 73 }, { x: 29, y: 32 }], [{ x: 16, y: 18 }, { x: 74, y: 79 }],
    ],
    [
      [{ x: 13, y: 21 }, { x: 77, y: 14 }], [{ x: 77, y: 14 }, { x: 105, y: 51 }], [{ x: 105, y: 51 }, { x: 72, y: 96 }], [{ x: 72, y: 96 }, { x: 19, y: 86 }], [{ x: 19, y: 86 }, { x: 13, y: 21 }],
      [{ x: 24, y: 37 }, { x: 92, y: 82 }], [{ x: 36, y: 96 }, { x: 83, y: 25 }], [{ x: 12, y: 61 }, { x: 49, y: 31 }], [{ x: 49, y: 31 }, { x: 101, y: 65 }],
    ],
  ];
  const layout = layouts[(hash32(`${seed}:direct-layout:${optionIndex}`) + optionIndex) % layouts.length]!;
  const origin = { x: 60, y: 60 };
  const angle = [-16, -8, 0, 8, 16][hash32(`${seed}:direct-layout-angle:${optionIndex}`) % 5]!;
  const dx = fraction(seed, `direct-layout-dx:${optionIndex}`, -3, 3);
  const dy = fraction(seed, `direct-layout-dy:${optionIndex}`, -3, 3);
  return layout.map(([a, b], index) => {
    const ra = rotate(a, origin, angle);
    const rb = rotate(b, origin, angle);
    return line(`direct-structured-${optionIndex}-${index}`, { x: ra.x + dx, y: ra.y + dy }, { x: rb.x + dx, y: rb.y + dy });
  });
}

function referencePoints(node: SpatialNode): SpatialPoint[] {
  switch (node.kind) {
    case "line": return [node.start, node.end];
    case "polyline":
    case "polygon": return node.points;
    case "circle": return [node.center];
    case "arc": return [node.center];
  }
}

function centroid(nodes: readonly SpatialNode[]): SpatialPoint {
  const points = nodes.flatMap(referencePoints);
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function translateNode(node: SpatialNode, dx: number, dy: number, optionIndex: number): SpatialNode {
  const common = { ...node, id: `direct-vh-${optionIndex}-${node.id}`, role: "candidate", style: node.style ? { ...node.style } : { ...STYLE } };
  switch (node.kind) {
    case "line": return { ...common, kind: "line", start: { x: node.start.x + dx, y: node.start.y + dy }, end: { x: node.end.x + dx, y: node.end.y + dy } };
    case "polyline": return { ...common, kind: "polyline", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "polygon": return { ...common, kind: "polygon", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "circle": return { ...common, kind: "circle", center: { x: node.center.x + dx, y: node.center.y + dy } };
    case "arc": return { ...common, kind: "arc", center: { x: node.center.x + dx, y: node.center.y + dy } };
  }
}

function hardenDirectRigid(base: EmbeddedFigureQuestionV1): EmbeddedFigureQuestionV1 {
  const targetGraph = spatialSceneToFigureGraphV1(base.targetScene);
  const destinations = [{ x: 44, y: 47 }, { x: 73, y: 45 }, { x: 47, y: 73 }, { x: 72, y: 72 }] as const;
  const options = base.options.map((option, index) => {
    const candidate = option.scene.nodes.filter((node) => node.role !== "clutter");
    const origin = centroid(candidate);
    const destination = destinations[(hash32(`${base.seed}:direct-destination-order`) + index) % destinations.length]!;
    const dx = destination.x - origin.x + fraction(base.seed, `direct-candidate-dx:${index}`, -3, 3);
    const dy = destination.y - origin.y + fraction(base.seed, `direct-candidate-dy:${index}`, -3, 3);
    const scene: SpatialScene = {
      ...option.scene,
      id: `${option.scene.id}:visual-hardened-v2-1`,
      nodes: [...directStructuredClutter(base.seed, index), ...candidate.map((node) => translateNode(node, dx, dy, index))],
      metadata: { ...(option.scene.metadata ?? {}), visualHardeningAuthority: EMB_001_VISUAL_HARDENING_AUTHORITY_V2_1.authorityId },
    };
    const graph = spatialSceneToFigureGraphV1(scene);
    return { ...option, scene, graphFingerprint: figureGraphFingerprintV1(graph), embeddingCount: findFigureGraphEmbeddingsV1(targetGraph, graph, base.matchPolicy).length };
  });
  const matchingOptionIndexes = options.map((option, index) => ({ option, index })).filter(({ option }) => option.embeddingCount > 0).map(({ index }) => index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== base.correctOptionIndex) {
    throw new Error(`${base.prototypeId}/${base.seed}: direct visual hardening produced a non-unique EMB answer.`);
  }
  const optionSceneFingerprints = options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  if (new Set(optionSceneFingerprints).size !== 4) throw new Error(`${base.prototypeId}/${base.seed}: direct visual hardening produced duplicate answer figures.`);
  const contentFingerprint = JSON.stringify({
    prototypeId: base.prototypeId,
    target: spatialSceneSemanticFingerprint(base.targetScene),
    optionSet: [...optionSceneFingerprints].sort(),
    correct: optionSceneFingerprints[base.correctOptionIndex],
    policy: base.matchPolicy,
    visualHardening: EMB_001_VISUAL_HARDENING_AUTHORITY_V2_1.authorityId,
  });
  return {
    ...base,
    options,
    solverEvidence: { ...base.solverEvidence, optionEmbeddingCounts: options.map((option) => option.embeddingCount), matchingOptionIndexes },
    contentFingerprint,
    deliveryFingerprint: JSON.stringify({ contentFingerprint, orderedOptions: optionSceneFingerprints, correctOptionIndex: base.correctOptionIndex }),
  };
}

export function generateEmbeddedFigureDiscoveryQuestionV2_1(request: {
  prototypeId: EmbeddedFigurePrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedFigureQuestionV1 {
  if (request.prototypeId !== "EMB-PROT-01-DIRECT-RIGID") return generateEmbeddedFigureDiscoveryQuestionV2(request);
  return hardenDirectRigid(generateBaseForwardQuestion(request));
}
