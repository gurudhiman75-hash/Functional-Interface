import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialArcNode, SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  figureGraphFingerprintV1,
  findFigureGraphEmbeddingsV1,
  spatialSceneToFigureGraphV1,
  type FigureGraphMatchPolicyV1,
} from "./figure-graph-v1";

export const EMB_001_PROTOTYPES_V1 = [
  "EMB-PROT-01-DIRECT-RIGID",
  "EMB-PROT-02-ROTATED-RIGID",
  "EMB-PROT-03-CROSSING-CLUTTER",
  "EMB-PROT-04-MULTI-OVERLAP",
  "EMB-PROT-05-TOPOLOGY-NEAR-MISS",
  "EMB-PROT-06-MIXED-CURVE-LINE",
] as const;

export type EmbeddedFigurePrototypeV1 = (typeof EMB_001_PROTOTYPES_V1)[number];
export type EmbeddedFigureMisconceptionV1 =
  | "CORRECT_EMBEDDING"
  | "MISSING_TARGET_EDGE"
  | "WRONG_TARGET_ANGLE"
  | "REFLECTED_TARGET_ONLY"
  | "BROKEN_TARGET_JUNCTION"
  | "SHIFTED_TARGET_COMPONENT"
  | "PARTIAL_TARGET_ONLY"
  | "WRONG_CURVE_RADIUS"
  | "WRONG_CURVE_SWEEP";

export interface EmbeddedFigureOptionV1 {
  scene: SpatialScene;
  misconception: EmbeddedFigureMisconceptionV1;
  graphFingerprint: string;
  embeddingCount: number;
}

export interface EmbeddedFigureQuestionV1 {
  version: "EMB-001-DISCOVERY-QUESTION-V1";
  packageId: "SPA-001";
  chapterCode: "EMB-001";
  prototypeId: EmbeddedFigurePrototypeV1;
  permanentQlId: null;
  seed: string;
  difficulty: "L1_DIRECT" | "L2_STANDARD" | "L3_ADVANCED" | "L4_HIGH_DISCRIMINATION";
  stem: string;
  targetScene: SpatialScene;
  options: EmbeddedFigureOptionV1[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  matchPolicy: FigureGraphMatchPolicyV1;
  solverEvidence: {
    targetGraphFingerprint: string;
    optionEmbeddingCounts: number[];
    matchingOptionIndexes: number[];
  };
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  contentFingerprint: string;
  deliveryFingerprint: string;
  renderer: {
    recommendedTargetPixels: 250;
    recommendedOptionPixels: 180;
    mobileMinimumOptionPixels: 112;
  };
  lifecycle: {
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    questionStudioDiscoverable: false;
    questionStudioRegistration: "NOT_REGISTERED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticPublication: false;
  };
}

const LETTERS = ["A", "B", "C", "D"] as const;
const STROKE = Object.freeze({ stroke: "#111", strokeWidth: 2.6, fill: "none" as const, lineCap: "round" as const, lineJoin: "round" as const });

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(seed: string, key: string, values: readonly T[]): T {
  return values[hash32(`${seed}:${key}`) % values.length]!;
}

function fraction(seed: string, key: string, min: number, max: number): number {
  const unit = hash32(`${seed}:${key}`) / 0xffffffff;
  return min + (max - min) * unit;
}

function line(id: string, ax: number, ay: number, bx: number, by: number, role = "figure"): SpatialNode {
  return { kind: "line", id, role, start: { x: ax, y: ay }, end: { x: bx, y: by }, style: { ...STROKE } };
}

function arc(
  id: string,
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number,
  sweep: "clockwise" | "counterclockwise",
): SpatialArcNode {
  return {
    kind: "arc",
    id,
    role: "figure",
    center: { x: cx, y: cy },
    radius,
    startAngleDeg,
    endAngleDeg,
    sweep,
    style: { ...STROKE },
  };
}

function scene(id: string, nodes: SpatialNode[], width = 100, height = 100): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: { minX: 0, minY: 0, width, height },
    nodes,
    metadata: { chapterCode: "EMB-001" },
  };
}

function targetNodes(prototypeId: EmbeddedFigurePrototypeV1): SpatialNode[] {
  switch (prototypeId) {
    case "EMB-PROT-01-DIRECT-RIGID":
      return [
        line("t1", 28, 34, 58, 34),
        line("t2", 58, 34, 69, 51),
        line("t3", 69, 51, 48, 68),
        line("t4", 48, 68, 36, 54),
      ];
    case "EMB-PROT-02-ROTATED-RIGID":
      return [
        line("t1", 27, 30, 61, 30),
        line("t2", 61, 30, 61, 54),
        line("t3", 61, 54, 43, 68),
        line("t4", 43, 68, 31, 56),
        line("t5", 43, 68, 43, 81),
      ];
    case "EMB-PROT-03-CROSSING-CLUTTER":
      return [
        line("t1", 29, 62, 50, 28),
        line("t2", 50, 28, 73, 62),
        line("t3", 73, 62, 29, 62),
        line("t4", 50, 28, 50, 76),
      ];
    case "EMB-PROT-04-MULTI-OVERLAP":
      return [
        line("t1", 30, 35, 56, 26),
        line("t2", 56, 26, 72, 48),
        line("t3", 72, 48, 54, 67),
        line("t4", 54, 67, 33, 58),
        line("t5", 33, 58, 48, 44),
      ];
    case "EMB-PROT-05-TOPOLOGY-NEAR-MISS":
      return [
        line("t1", 50, 24, 71, 45),
        line("t2", 71, 45, 50, 66),
        line("t3", 50, 66, 29, 45),
        line("t4", 29, 45, 50, 24),
        line("t5", 50, 66, 50, 82),
      ];
    case "EMB-PROT-06-MIXED-CURVE-LINE":
      return [
        arc("t-arc", 50, 45, 20, 180, 0, "clockwise"),
        line("t1", 30, 45, 41, 70),
        line("t2", 41, 70, 59, 70),
        line("t3", 59, 70, 70, 45),
      ];
  }
}

function centroidOfNodes(nodes: readonly SpatialNode[]): SpatialPoint {
  const points: SpatialPoint[] = [];
  for (const node of nodes) {
    switch (node.kind) {
      case "line": points.push(node.start, node.end); break;
      case "polyline": case "polygon": points.push(...node.points); break;
      case "circle": points.push(node.center); break;
      case "arc": {
        points.push(node.center);
        const start = (node.startAngleDeg * Math.PI) / 180;
        const end = (node.endAngleDeg * Math.PI) / 180;
        points.push(
          { x: node.center.x + node.radius * Math.cos(start), y: node.center.y + node.radius * Math.sin(start) },
          { x: node.center.x + node.radius * Math.cos(end), y: node.center.y + node.radius * Math.sin(end) },
        );
        break;
      }
    }
  }
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function transformPointAround(
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

function angleFrom(center: SpatialPoint, point: SpatialPoint): number {
  const value = (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;
  return value < 0 ? value + 360 : value;
}

function transformNode(
  node: SpatialNode,
  origin: SpatialPoint,
  destination: SpatialPoint,
  rotationDeg: number,
  reflected: boolean,
  prefix: string,
): SpatialNode {
  const common = { ...node, id: `${prefix}${node.id}`, style: node.style ? { ...node.style } : undefined };
  switch (node.kind) {
    case "line":
      return {
        ...common,
        kind: "line",
        start: transformPointAround(node.start, origin, destination, rotationDeg, reflected),
        end: transformPointAround(node.end, origin, destination, rotationDeg, reflected),
      };
    case "polyline":
      return {
        ...common,
        kind: "polyline",
        points: node.points.map((point) => transformPointAround(point, origin, destination, rotationDeg, reflected)),
      };
    case "polygon":
      return {
        ...common,
        kind: "polygon",
        points: node.points.map((point) => transformPointAround(point, origin, destination, rotationDeg, reflected)),
      };
    case "circle":
      return {
        ...common,
        kind: "circle",
        center: transformPointAround(node.center, origin, destination, rotationDeg, reflected),
      };
    case "arc": {
      const startRadians = (node.startAngleDeg * Math.PI) / 180;
      const endRadians = (node.endAngleDeg * Math.PI) / 180;
      const startPoint = {
        x: node.center.x + node.radius * Math.cos(startRadians),
        y: node.center.y + node.radius * Math.sin(startRadians),
      };
      const endPoint = {
        x: node.center.x + node.radius * Math.cos(endRadians),
        y: node.center.y + node.radius * Math.sin(endRadians),
      };
      const center = transformPointAround(node.center, origin, destination, rotationDeg, reflected);
      const transformedStart = transformPointAround(startPoint, origin, destination, rotationDeg, reflected);
      const transformedEnd = transformPointAround(endPoint, origin, destination, rotationDeg, reflected);
      return {
        ...common,
        kind: "arc",
        center,
        startAngleDeg: angleFrom(center, transformedStart),
        endAngleDeg: angleFrom(center, transformedEnd),
        sweep: reflected ? (node.sweep === "clockwise" ? "counterclockwise" : "clockwise") : node.sweep,
      };
    }
  }
}

function transformTargetNodes(
  nodes: readonly SpatialNode[],
  rotationDeg: number,
  reflected: boolean,
  destination: SpatialPoint,
  prefix: string,
): SpatialNode[] {
  const origin = centroidOfNodes(nodes);
  return nodes.map((node) => transformNode(node, origin, destination, rotationDeg, reflected, prefix));
}

function mutateNodeEndpoint(node: SpatialNode, dx: number, dy: number, prefix: string): SpatialNode {
  if (node.kind !== "line") return { ...node, id: `${prefix}${node.id}` };
  return {
    ...node,
    id: `${prefix}${node.id}`,
    end: { x: node.end.x + dx, y: node.end.y + dy },
  };
}

function clutterNodes(seed: string, density: number): SpatialNode[] {
  const nodes: SpatialNode[] = [];
  const base = [
    [10, 18, 108, 84],
    [12, 91, 104, 23],
    [8, 54, 112, 54],
    [58, 8, 58, 112],
    [18, 14, 96, 102],
    [16, 104, 102, 35],
    [7, 72, 111, 32],
    [30, 7, 91, 111],
    [8, 36, 110, 75],
    [21, 111, 88, 9],
  ] as const;
  const offsetX = fraction(seed, "clutter-x", -2.5, 2.5);
  const offsetY = fraction(seed, "clutter-y", -2.5, 2.5);
  const start = hash32(`${seed}:clutter-start`) % base.length;
  for (let index = 0; index < density; index += 1) {
    const spec = base[(start + index) % base.length]!;
    const jitter = (index % 3) - 1;
    nodes.push(line(
      `clutter-${index}`,
      spec[0] + offsetX + jitter,
      spec[1] + offsetY - jitter,
      spec[2] + offsetX - jitter,
      spec[3] + offsetY + jitter,
      "clutter",
    ));
  }
  return nodes;
}

function transformAngleForPrototype(prototypeId: EmbeddedFigurePrototypeV1, seed: string): number {
  switch (prototypeId) {
    case "EMB-PROT-01-DIRECT-RIGID": return 0;
    case "EMB-PROT-02-ROTATED-RIGID": return pick(seed, "angle", [45, 90, 135, 180, 225, 270, 315] as const);
    case "EMB-PROT-03-CROSSING-CLUTTER": return pick(seed, "angle", [0, 45, 90, 135] as const);
    case "EMB-PROT-04-MULTI-OVERLAP": return pick(seed, "angle", [30, 60, 90, 120, 150] as const);
    case "EMB-PROT-05-TOPOLOGY-NEAR-MISS": return pick(seed, "angle", [0, 45, 90, 135, 180] as const);
    case "EMB-PROT-06-MIXED-CURVE-LINE": return pick(seed, "angle", [0, 45, 90, 135, 180] as const);
  }
}

function policyForPrototype(prototypeId: EmbeddedFigurePrototypeV1): FigureGraphMatchPolicyV1 {
  return {
    allowRotation: prototypeId !== "EMB-PROT-01-DIRECT-RIGID",
    allowReflection: false,
    allowScale: false,
    tolerance: 1e-4,
  };
}

function difficultyForPrototype(prototypeId: EmbeddedFigurePrototypeV1): EmbeddedFigureQuestionV1["difficulty"] {
  switch (prototypeId) {
    case "EMB-PROT-01-DIRECT-RIGID": return "L1_DIRECT";
    case "EMB-PROT-02-ROTATED-RIGID":
    case "EMB-PROT-03-CROSSING-CLUTTER": return "L2_STANDARD";
    case "EMB-PROT-04-MULTI-OVERLAP":
    case "EMB-PROT-05-TOPOLOGY-NEAR-MISS": return "L3_ADVANCED";
    case "EMB-PROT-06-MIXED-CURVE-LINE": return "L4_HIGH_DISCRIMINATION";
  }
}

function densityForPrototype(prototypeId: EmbeddedFigurePrototypeV1): number {
  switch (prototypeId) {
    case "EMB-PROT-01-DIRECT-RIGID": return 4;
    case "EMB-PROT-02-ROTATED-RIGID": return 5;
    case "EMB-PROT-03-CROSSING-CLUTTER": return 7;
    case "EMB-PROT-04-MULTI-OVERLAP": return 9;
    case "EMB-PROT-05-TOPOLOGY-NEAR-MISS": return 7;
    case "EMB-PROT-06-MIXED-CURVE-LINE": return 7;
  }
}

function correctHost(
  prototypeId: EmbeddedFigurePrototypeV1,
  seed: string,
  target: readonly SpatialNode[],
): SpatialScene {
  const rotationDeg = transformAngleForPrototype(prototypeId, seed);
  const destination = {
    x: fraction(seed, "dest-x", 53, 67),
    y: fraction(seed, "dest-y", 52, 68),
  };
  const embedded = transformTargetNodes(target, rotationDeg, false, destination, "embedded-");
  return scene(`emb-correct:${prototypeId}:${seed}`, [...clutterNodes(seed, densityForPrototype(prototypeId)), ...embedded], 120, 120);
}

function distractorHosts(
  prototypeId: EmbeddedFigurePrototypeV1,
  seed: string,
  target: readonly SpatialNode[],
): Array<{ scene: SpatialScene; misconception: Exclude<EmbeddedFigureMisconceptionV1, "CORRECT_EMBEDDING"> }> {
  const rotationDeg = transformAngleForPrototype(prototypeId, seed);
  const destination = {
    x: fraction(seed, "dest-x", 53, 67),
    y: fraction(seed, "dest-y", 52, 68),
  };
  const density = densityForPrototype(prototypeId);
  const clutter = clutterNodes(seed, density);
  const base = transformTargetNodes(target, rotationDeg, false, destination, "base-");
  const reflected = transformTargetNodes(target, rotationDeg, true, destination, "reflected-");

  const missing = base.filter((_, index) => index !== Math.min(1, base.length - 1)).map((node) => ({ ...node, id: `missing-${node.id}` } as SpatialNode));
  const wrongAngle = base.map((node, index) => index === 1 ? mutateNodeEndpoint(node, 7, -8, "wrong-angle-") : ({ ...node, id: `wrong-angle-${node.id}` } as SpatialNode));
  const broken = base.map((node, index) => index === Math.min(2, base.length - 1) ? mutateNodeEndpoint(node, 8, 5, "broken-") : ({ ...node, id: `broken-${node.id}` } as SpatialNode));
  const shifted = base.map((node, index) => {
    if (index !== Math.min(2, base.length - 1)) return { ...node, id: `shifted-${node.id}` } as SpatialNode;
    if (node.kind !== "line") return { ...node, id: `shifted-${node.id}` } as SpatialNode;
    return {
      ...node,
      id: `shifted-${node.id}`,
      start: { x: node.start.x + 8, y: node.start.y - 3 },
      end: { x: node.end.x + 8, y: node.end.y - 3 },
    };
  });

  const host = (name: string, nodes: SpatialNode[]): SpatialScene => scene(`emb-${name}:${prototypeId}:${seed}`, [...clutter.map((node) => ({ ...node, id: `${name}-${node.id}` } as SpatialNode)), ...nodes], 120, 120);

  if (prototypeId === "EMB-PROT-03-CROSSING-CLUTTER") {
    return [
      { scene: host("partial", missing), misconception: "PARTIAL_TARGET_ONLY" },
      { scene: host("shifted", shifted), misconception: "SHIFTED_TARGET_COMPONENT" },
      { scene: host("wrong-angle", wrongAngle), misconception: "WRONG_TARGET_ANGLE" },
    ];
  }

  if (prototypeId === "EMB-PROT-05-TOPOLOGY-NEAR-MISS") {
    return [
      { scene: host("broken", broken), misconception: "BROKEN_TARGET_JUNCTION" },
      { scene: host("reflected", reflected), misconception: "REFLECTED_TARGET_ONLY" },
      { scene: host("missing", missing), misconception: "MISSING_TARGET_EDGE" },
    ];
  }

  if (prototypeId === "EMB-PROT-06-MIXED-CURVE-LINE") {
    const radiusWrong = base.map((node) => {
      if (node.kind !== "arc") return { ...node, id: `radius-${node.id}` } as SpatialNode;
      return { ...node, id: `radius-${node.id}`, radius: node.radius + 5 } as SpatialNode;
    });
    const sweepWrong = base.map((node) => {
      if (node.kind !== "arc") return { ...node, id: `sweep-${node.id}` } as SpatialNode;
      return { ...node, id: `sweep-${node.id}`, sweep: node.sweep === "clockwise" ? "counterclockwise" : "clockwise" } as SpatialNode;
    });
    return [
      { scene: host("curve-radius", radiusWrong), misconception: "WRONG_CURVE_RADIUS" },
      { scene: host("curve-sweep", sweepWrong), misconception: "WRONG_CURVE_SWEEP" },
      { scene: host("missing", missing), misconception: "MISSING_TARGET_EDGE" },
    ];
  }

  if (prototypeId === "EMB-PROT-04-MULTI-OVERLAP") {
    return [
      { scene: host("missing", missing), misconception: "MISSING_TARGET_EDGE" },
      { scene: host("wrong-angle", wrongAngle), misconception: "WRONG_TARGET_ANGLE" },
      { scene: host("reflected", reflected), misconception: "REFLECTED_TARGET_ONLY" },
    ];
  }

  return [
    { scene: host("missing", missing), misconception: "MISSING_TARGET_EDGE" },
    { scene: host("wrong-angle", wrongAngle), misconception: "WRONG_TARGET_ANGLE" },
    { scene: host("reflected", reflected), misconception: "REFLECTED_TARGET_ONLY" },
  ];
}

function explanationFor(
  prototypeId: EmbeddedFigurePrototypeV1,
  answer: EmbeddedFigureQuestionV1["answer"],
): EmbeddedFigureQuestionV1["explanation"] {
  const check = `Option ${answer} is the only answer figure that contains every required target segment${prototypeId === "EMB-PROT-06-MIXED-CURVE-LINE" ? " and the exact curved arc" : ""} in one permitted embedding.`;
  switch (prototypeId) {
    case "EMB-PROT-01-DIRECT-RIGID":
      return {
        observation: "Trace the target as one continuous asymmetric path and note the two changes in direction.",
        rule: "For this direct family the target may move within the answer figure, but its orientation, lengths and junctions must remain unchanged.",
        application: `Following the same path in option ${answer} reproduces all four target edges in the same orientation despite the extra lines.`,
        check,
      };
    case "EMB-PROT-02-ROTATED-RIGID":
      return {
        observation: "Use the long edge, the right-angle turn and the short terminal branch as the target's three strongest clues.",
        rule: "The complete target may be rotated, but reflection and scaling are not allowed.",
        application: `Rotate the target mentally and trace the long edge, bend and terminal branch together inside option ${answer}.`,
        check,
      };
    case "EMB-PROT-03-CROSSING-CLUTTER":
      return {
        observation: "The target is a triangle-like outline with a line continuing through its top vertex.",
        rule: "Extra crossing lines may pass through the target; they do not erase a target edge that is still present completely.",
        application: `In option ${answer}, all target edges can be traced continuously even where unrelated lines cross them.`,
        check,
      };
    case "EMB-PROT-04-MULTI-OVERLAP":
      return {
        observation: "Do not follow one large outline. Track the target's five-edge route through the overlapping figures.",
        rule: "A valid embedding may borrow visible edges from different overlapping host shapes, but every target edge and junction must still be exact.",
        application: `The required five-edge route can be traced completely through the overlap in option ${answer}.`,
        check,
      };
    case "EMB-PROT-05-TOPOLOGY-NEAR-MISS":
      return {
        observation: "The decisive feature is the closed diamond-like loop with a branch attached to its lower vertex.",
        rule: "Matching line counts or a similar outline is not enough; the branch must meet the same exact junction and reflection is not accepted.",
        application: `Option ${answer} preserves both the closed loop and the branch at the correct shared vertex.`,
        check,
      };
    case "EMB-PROT-06-MIXED-CURVE-LINE":
      return {
        observation: "The target combines one upper curved arc with three straight lower edges.",
        rule: "The arc must keep its exact radius, endpoints and sweep while the straight edges keep their exact connections; rotation is allowed but reflection and scaling are not.",
        application: `Option ${answer} contains the same curved top and the complete connected straight base as one figure.`,
        check,
      };
  }
}

function orderOptions<T>(correct: T, distractors: readonly T[], desiredCorrectOptionIndex: 0 | 1 | 2 | 3): T[] {
  const result = [...distractors];
  result.splice(desiredCorrectOptionIndex, 0, correct);
  return result;
}

export function generateEmbeddedFigureDiscoveryQuestionV1(request: {
  prototypeId: EmbeddedFigurePrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedFigureQuestionV1 {
  const seed = request.seed.trim();
  if (!seed) throw new Error("EMB-001 discovery requires a non-empty deterministic seed.");
  const desiredCorrectOptionIndex = request.desiredCorrectOptionIndex ?? ((hash32(`${seed}:answer-slot`) % 4) as 0 | 1 | 2 | 3);
  const targetNodeList = targetNodes(request.prototypeId);
  const targetScene = scene(`emb-target:${request.prototypeId}:${seed}`, targetNodeList);
  const matchPolicy = policyForPrototype(request.prototypeId);
  const targetGraph = spatialSceneToFigureGraphV1(targetScene);
  const correctScene = correctHost(request.prototypeId, seed, targetNodeList);
  const distractors = distractorHosts(request.prototypeId, seed, targetNodeList);
  const canonicalOptions = [
    { scene: correctScene, misconception: "CORRECT_EMBEDDING" as const },
    ...distractors,
  ];
  const orderedRaw = orderOptions(canonicalOptions[0]!, canonicalOptions.slice(1), desiredCorrectOptionIndex);

  const options: EmbeddedFigureOptionV1[] = orderedRaw.map((option) => {
    const graph = spatialSceneToFigureGraphV1(option.scene);
    const embeddingCount = findFigureGraphEmbeddingsV1(targetGraph, graph, matchPolicy).length;
    return {
      scene: option.scene,
      misconception: option.misconception,
      graphFingerprint: figureGraphFingerprintV1(graph),
      embeddingCount,
    };
  });

  const matchingOptionIndexes = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.embeddingCount > 0)
    .map(({ index }) => index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desiredCorrectOptionIndex) {
    throw new Error(`${request.prototypeId}/${seed}: EMB graph solver did not preserve one unique answer.`);
  }
  if (options[desiredCorrectOptionIndex]!.misconception !== "CORRECT_EMBEDDING") {
    throw new Error(`${request.prototypeId}/${seed}: correct option ownership was lost during ordering.`);
  }
  if (new Set(options.map((option) => spatialSceneSemanticFingerprint(option.scene))).size !== 4) {
    throw new Error(`${request.prototypeId}/${seed}: answer figures are not semantically unique.`);
  }

  const answer = LETTERS[desiredCorrectOptionIndex];
  const optionSceneFingerprints = options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  const correctSceneFingerprint = optionSceneFingerprints[desiredCorrectOptionIndex]!;
  const contentFingerprint = JSON.stringify({
    prototypeId: request.prototypeId,
    target: spatialSceneSemanticFingerprint(targetScene),
    optionSet: [...optionSceneFingerprints].sort(),
    correct: correctSceneFingerprint,
    policy: matchPolicy,
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    orderedOptions: optionSceneFingerprints,
    correctOptionIndex: desiredCorrectOptionIndex,
  });

  return {
    version: "EMB-001-DISCOVERY-QUESTION-V1",
    packageId: "SPA-001",
    chapterCode: "EMB-001",
    prototypeId: request.prototypeId,
    permanentQlId: null,
    seed,
    difficulty: difficultyForPrototype(request.prototypeId),
    stem: "The problem figure is hidden inside one of the answer figures. Select the answer figure that contains the problem figure exactly.",
    targetScene,
    options,
    correctOptionIndex: desiredCorrectOptionIndex,
    answer,
    matchPolicy,
    solverEvidence: {
      targetGraphFingerprint: figureGraphFingerprintV1(targetGraph),
      optionEmbeddingCounts: options.map((option) => option.embeddingCount),
      matchingOptionIndexes,
    },
    explanation: explanationFor(request.prototypeId, answer),
    contentFingerprint,
    deliveryFingerprint,
    renderer: {
      recommendedTargetPixels: 250,
      recommendedOptionPixels: 180,
      mobileMinimumOptionPixels: 112,
    },
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
