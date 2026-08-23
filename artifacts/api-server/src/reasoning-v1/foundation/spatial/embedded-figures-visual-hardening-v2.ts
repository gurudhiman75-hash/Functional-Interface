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
  generateEmbeddedDirectionalQuestionV2_1 as generateBaseDirectionalQuestion,
  type EmbeddedDirectionalPrototypeV2,
  type EmbeddedDirectionalQuestionV2,
} from "./embedded-figures-directional-discovery-v2-1";

export const EMB_001_VISUAL_HARDENING_AUTHORITY_V2 = Object.freeze({
  authorityId: "EMB-001-VISUAL-HARDENING-V2" as const,
  purpose: "REMOVE_IDENTICAL_STAR_BURST_OPTION_CUE_AND_USE_STRUCTURED_EXAM_STYLE_CLUTTER" as const,
  remediation: {
    independentAnswerFigureClutter: true,
    structuredGeometricClutter: true,
    candidateRigidPlacementVariesByOption: true,
    identicalBackgroundSpotDifferenceCueRemoved: true,
    centralStarburstDependencyRemoved: true,
    graphSolverRevalidatedAfterVisualHardening: true,
    targetGeometryUnchanged: true,
    reflectionPolicyUnchanged: true,
    scalePolicyUnchanged: true,
    whiteReviewSurfaceRequired: true,
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

function rotateAround(point: SpatialPoint, origin: SpatialPoint, rotationDeg: number): SpatialPoint {
  const angle = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  return { x: origin.x + x * cos - y * sin, y: origin.y + x * sin + y * cos };
}

function transformPoint(point: SpatialPoint, origin: SpatialPoint, destination: SpatialPoint, rotationDeg: number): SpatialPoint {
  const rotated = rotateAround(point, origin, rotationDeg);
  return { x: rotated.x + destination.x - origin.x, y: rotated.y + destination.y - origin.y };
}

function nodeReferencePoints(node: SpatialNode): SpatialPoint[] {
  switch (node.kind) {
    case "line": return [node.start, node.end];
    case "polyline":
    case "polygon": return node.points;
    case "circle": return [node.center];
    case "arc": {
      const start = (node.startAngleDeg * Math.PI) / 180;
      const end = (node.endAngleDeg * Math.PI) / 180;
      return [
        node.center,
        { x: node.center.x + node.radius * Math.cos(start), y: node.center.y + node.radius * Math.sin(start) },
        { x: node.center.x + node.radius * Math.cos(end), y: node.center.y + node.radius * Math.sin(end) },
      ];
    }
  }
}

function centroid(nodes: readonly SpatialNode[]): SpatialPoint {
  const points = nodes.flatMap(nodeReferencePoints);
  if (points.length === 0) return { x: 60, y: 60 };
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function transformNode(node: SpatialNode, origin: SpatialPoint, destination: SpatialPoint, rotationDeg: number, prefix: string): SpatialNode {
  const common = { ...node, id: `${prefix}${node.id}`, role: node.role === "clutter" ? "clutter" : "candidate", style: node.style ? { ...node.style } : { ...STYLE } };
  switch (node.kind) {
    case "line":
      return { ...common, kind: "line", start: transformPoint(node.start, origin, destination, rotationDeg), end: transformPoint(node.end, origin, destination, rotationDeg) };
    case "polyline":
      return { ...common, kind: "polyline", points: node.points.map((point) => transformPoint(point, origin, destination, rotationDeg)) };
    case "polygon":
      return { ...common, kind: "polygon", points: node.points.map((point) => transformPoint(point, origin, destination, rotationDeg)) };
    case "circle":
      return { ...common, kind: "circle", center: transformPoint(node.center, origin, destination, rotationDeg) };
    case "arc":
      return {
        ...common,
        kind: "arc",
        center: transformPoint(node.center, origin, destination, rotationDeg),
        startAngleDeg: node.startAngleDeg + rotationDeg,
        endAngleDeg: node.endAngleDeg + rotationDeg,
      };
  }
}

function transformCandidate(nodes: readonly SpatialNode[], seed: string, optionIndex: number): SpatialNode[] {
  if (nodes.length === 0) return [];
  const origin = centroid(nodes);
  const destinations = [
    { x: 48, y: 48 },
    { x: 72, y: 48 },
    { x: 48, y: 72 },
    { x: 72, y: 72 },
  ] as const;
  const base = destinations[(hash32(`${seed}:destination-order`) + optionIndex) % destinations.length]!;
  const destination = {
    x: base.x + fraction(seed, `candidate-${optionIndex}-dx`, -4, 4),
    y: base.y + fraction(seed, `candidate-${optionIndex}-dy`, -4, 4),
  };
  const rotations = [0, 30, 45, 60, 90, 120, 135, 180, 225, 270, 315] as const;
  const rotationDeg = rotations[hash32(`${seed}:candidate-${optionIndex}-rotation`) % rotations.length]!;
  return nodes.map((node) => transformNode(node, origin, destination, rotationDeg, `vh-${optionIndex}-`));
}

function pathSegments(prefix: string, points: readonly SpatialPoint[], closed = false): SpatialNode[] {
  const output: SpatialNode[] = [];
  for (let index = 0; index < points.length - 1; index += 1) output.push(line(`${prefix}-${index}`, points[index]!, points[index + 1]!));
  if (closed && points.length > 2) output.push(line(`${prefix}-close`, points[points.length - 1]!, points[0]!));
  return output;
}

function layoutSegments(layout: number): Array<[SpatialPoint, SpatialPoint]> {
  switch (layout % 4) {
    case 0: {
      const pentagon = [{ x: 14, y: 24 }, { x: 53, y: 11 }, { x: 104, y: 36 }, { x: 88, y: 93 }, { x: 27, y: 101 }];
      const triangle = [{ x: 18, y: 77 }, { x: 62, y: 24 }, { x: 106, y: 78 }];
      return [
        ...pentagon.map((point, index) => [point, pentagon[(index + 1) % pentagon.length]!] as [SpatialPoint, SpatialPoint]),
        ...triangle.map((point, index) => [point, triangle[(index + 1) % triangle.length]!] as [SpatialPoint, SpatialPoint]),
        [{ x: 27, y: 101 }, { x: 62, y: 24 }],
        [{ x: 53, y: 11 }, { x: 88, y: 93 }],
      ];
    }
    case 1:
      return [
        [{ x: 13, y: 21 }, { x: 77, y: 14 }], [{ x: 77, y: 14 }, { x: 105, y: 51 }], [{ x: 105, y: 51 }, { x: 72, y: 96 }], [{ x: 72, y: 96 }, { x: 19, y: 86 }], [{ x: 19, y: 86 }, { x: 13, y: 21 }],
        [{ x: 24, y: 37 }, { x: 92, y: 82 }], [{ x: 36, y: 96 }, { x: 83, y: 25 }],
        [{ x: 12, y: 61 }, { x: 49, y: 31 }], [{ x: 49, y: 31 }, { x: 101, y: 65 }],
      ];
    case 2:
      return [
        [{ x: 16, y: 18 }, { x: 96, y: 22 }], [{ x: 96, y: 22 }, { x: 101, y: 88 }], [{ x: 101, y: 88 }, { x: 22, y: 98 }], [{ x: 22, y: 98 }, { x: 16, y: 18 }],
        [{ x: 28, y: 31 }, { x: 81, y: 37 }], [{ x: 81, y: 37 }, { x: 74, y: 79 }], [{ x: 74, y: 79 }, { x: 34, y: 73 }], [{ x: 34, y: 73 }, { x: 28, y: 31 }],
        [{ x: 16, y: 18 }, { x: 74, y: 79 }], [{ x: 96, y: 22 }, { x: 34, y: 73 }],
      ];
    default:
      return [
        [{ x: 11, y: 32 }, { x: 48, y: 13 }], [{ x: 48, y: 13 }, { x: 105, y: 31 }], [{ x: 105, y: 31 }, { x: 92, y: 75 }], [{ x: 92, y: 75 }, { x: 57, y: 103 }], [{ x: 57, y: 103 }, { x: 18, y: 83 }], [{ x: 18, y: 83 }, { x: 11, y: 32 }],
        [{ x: 18, y: 83 }, { x: 71, y: 43 }], [{ x: 71, y: 43 }, { x: 48, y: 13 }],
        [{ x: 33, y: 56 }, { x: 105, y: 31 }], [{ x: 33, y: 56 }, { x: 57, y: 103 }],
      ];
  }
}

function structuredClutter(seed: string, key: string, optionIndex: number, densityBoost = 0): SpatialNode[] {
  const layout = (hash32(`${seed}:${key}:${optionIndex}:layout`) + optionIndex) % 4;
  const base = layoutSegments(layout);
  const origin = { x: 60, y: 60 };
  const rotationDeg = [-18, -9, 0, 9, 18][hash32(`${seed}:${key}:${optionIndex}:layout-rotation`) % 5]!;
  const dx = fraction(seed, `${key}:${optionIndex}:layout-dx`, -3, 3);
  const dy = fraction(seed, `${key}:${optionIndex}:layout-dy`, -3, 3);
  const limit = Math.min(base.length, 8 + densityBoost + (hash32(`${seed}:${key}:${optionIndex}:density`) % 3));
  return base.slice(0, limit).map(([a, b], index) => {
    const ra = rotateAround(a, origin, rotationDeg);
    const rb = rotateAround(b, origin, rotationDeg);
    return line(`structured-${key}-${optionIndex}-${index}`, { x: ra.x + dx, y: ra.y + dy }, { x: rb.x + dx, y: rb.y + dy });
  });
}

function hardenedScene(base: SpatialScene, seed: string, optionIndex: number, densityBoost = 0): SpatialScene {
  const candidateNodes = base.nodes.filter((node) => node.role !== "clutter");
  const transformed = transformCandidate(candidateNodes, seed, optionIndex);
  return {
    ...base,
    id: `${base.id}:visual-hardened-v2`,
    nodes: [
      ...structuredClutter(seed, "option", optionIndex, densityBoost),
      ...transformed,
    ],
    metadata: { ...(base.metadata ?? {}), visualHardeningAuthority: EMB_001_VISUAL_HARDENING_AUTHORITY_V2.authorityId },
  };
}

export function generateEmbeddedFigureDiscoveryQuestionV2(request: {
  prototypeId: EmbeddedFigurePrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedFigureQuestionV1 {
  const base = generateBaseForwardQuestion(request);
  const targetGraph = spatialSceneToFigureGraphV1(base.targetScene);
  const densityBoost = request.prototypeId === "EMB-PROT-03-CROSSING-CLUTTER" || request.prototypeId === "EMB-PROT-04-MULTI-OVERLAP" ? 2 : 0;
  const options = base.options.map((option, index) => {
    const scene = hardenedScene(option.scene, base.seed, index, densityBoost);
    const graph = spatialSceneToFigureGraphV1(scene);
    return {
      ...option,
      scene,
      graphFingerprint: figureGraphFingerprintV1(graph),
      embeddingCount: findFigureGraphEmbeddingsV1(targetGraph, graph, base.matchPolicy).length,
    };
  });
  const matchingOptionIndexes = options.map((option, index) => ({ option, index })).filter(({ option }) => option.embeddingCount > 0).map(({ index }) => index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== base.correctOptionIndex) {
    throw new Error(`${base.prototypeId}/${base.seed}: visual hardening produced a non-unique EMB answer.`);
  }
  const optionSceneFingerprints = options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  if (new Set(optionSceneFingerprints).size !== 4) throw new Error(`${base.prototypeId}/${base.seed}: visual hardening produced duplicate answer figures.`);
  const contentFingerprint = JSON.stringify({
    prototypeId: base.prototypeId,
    target: spatialSceneSemanticFingerprint(base.targetScene),
    optionSet: [...optionSceneFingerprints].sort(),
    correct: optionSceneFingerprints[base.correctOptionIndex],
    policy: base.matchPolicy,
    visualHardening: EMB_001_VISUAL_HARDENING_AUTHORITY_V2.authorityId,
  });
  return {
    ...base,
    options,
    solverEvidence: { ...base.solverEvidence, optionEmbeddingCounts: options.map((option) => option.embeddingCount), matchingOptionIndexes },
    contentFingerprint,
    deliveryFingerprint: JSON.stringify({ contentFingerprint, orderedOptions: optionSceneFingerprints, correctOptionIndex: base.correctOptionIndex }),
  };
}

function hardenDirectionalHost(base: EmbeddedDirectionalQuestionV2): SpatialScene {
  const retained = base.questionScene.nodes.filter((node) => node.role !== "clutter");
  return {
    ...base.questionScene,
    id: `${base.questionScene.id}:visual-hardened-v2`,
    nodes: [
      ...structuredClutter(base.seed, "directional-host", 0, base.polarity === "SELECT_NOT_EMBEDDED" ? 2 : 1),
      ...retained.map((node) => ({ ...node, id: `vh-host-${node.id}` } as SpatialNode)),
    ],
    metadata: { ...(base.questionScene.metadata ?? {}), visualHardeningAuthority: EMB_001_VISUAL_HARDENING_AUTHORITY_V2.authorityId },
  };
}

export function generateEmbeddedDirectionalQuestionV3(request: {
  prototypeId: EmbeddedDirectionalPrototypeV2;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedDirectionalQuestionV2 {
  const base = generateBaseDirectionalQuestion(request);
  const questionScene = hardenDirectionalHost(base);
  const hostGraph = spatialSceneToFigureGraphV1(questionScene);
  const optionEmbeddingCounts = base.options.map((option) => findFigureGraphEmbeddingsV1(spatialSceneToFigureGraphV1(option.scene), hostGraph, base.matchPolicy).length);
  const satisfyingOptionIndexes = optionEmbeddingCounts.map((count, index) => ({ count, index }))
    .filter(({ count }) => base.polarity === "SELECT_EMBEDDED" ? count > 0 : count === 0)
    .map(({ index }) => index);
  if (satisfyingOptionIndexes.length !== 1 || satisfyingOptionIndexes[0] !== base.correctOptionIndex) {
    throw new Error(`${base.prototypeId}/${base.seed}: structured host clutter changed the directional EMB answer.`);
  }
  if (base.polarity === "SELECT_NOT_EMBEDDED" && optionEmbeddingCounts.filter((count) => count > 0).length !== 3) {
    throw new Error(`${base.prototypeId}/${base.seed}: negative directional EMB lost the three-present/one-absent invariant.`);
  }
  const questionFingerprint = spatialSceneSemanticFingerprint(questionScene);
  const optionSceneFingerprints = base.options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  const contentFingerprint = JSON.stringify({
    prototypeId: base.prototypeId,
    questionFingerprint,
    optionSet: [...optionSceneFingerprints].sort(),
    correct: optionSceneFingerprints[base.correctOptionIndex],
    polarity: base.polarity,
    visualHardening: EMB_001_VISUAL_HARDENING_AUTHORITY_V2.authorityId,
  });
  return {
    ...base,
    questionScene,
    options: base.options.map((option, index) => ({ ...option, embeddingCount: optionEmbeddingCounts[index]! })),
    solverEvidence: {
      ...base.solverEvidence,
      questionGraphFingerprint: figureGraphFingerprintV1(hostGraph),
      optionEmbeddingCounts,
      satisfyingOptionIndexes,
    },
    contentFingerprint,
    deliveryFingerprint: JSON.stringify({ contentFingerprint, ordered: optionSceneFingerprints, correctOptionIndex: base.correctOptionIndex }),
  };
}
