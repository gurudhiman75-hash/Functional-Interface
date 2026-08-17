import {
  cycleSelectedSpatialNodePositionsV1,
  reflectSelectedSpatialNodesV1,
  removeSelectedSpatialNodesV1,
  rotateSelectedSpatialNodesV1,
  scaleSelectedSpatialNodesV1,
  setSelectedSpatialFillV1,
  spatialNodeCenterV1,
  translateSelectedSpatialNodesV1,
} from "./gap-runtime-v1";
import type { SpatialGapIdV1 } from "./gap-types-v1";
import type {
  SpatialGapQuestionLearnerExplanationV1,
  SpatialGapQuestionMisconceptionV1,
} from "./gap-question-types-v1";
import type { SpatialFclCueAuditV2 } from "./gap-question-perceptual-v2";
import { hashSpatialSeed } from "./seed";
import { rotateScene } from "./transform";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialNode,
  type SpatialPoint,
  type SpatialScene,
} from "./types";

export interface SpatialCanonicalQuestionV2 {
  stimulusScenes: SpatialScene[];
  correctScene: SpatialScene;
  distractors: readonly [
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
  ];
  decisiveProperty: string;
  explanation: Omit<SpatialGapQuestionLearnerExplanationV1, "check"> & { check: string };
  fclCueAudit?: SpatialFclCueAuditV2;
}

type ShapeKind = "hook" | "triangle" | "square" | "diamond" | "pentagon" | "circle" | "arrow";

interface MaterialV2 {
  inset: number;
  hookSize: number;
  shapeSize: number;
  dotRadius: number;
  cornerShift: number;
}

const OUTLINE = { stroke: "#111", strokeWidth: 2, fill: "none" } as const;
const SOLID = { stroke: "#111", strokeWidth: 2, fill: "#111" } as const;

function material(seed: string): MaterialV2 {
  let value = hashSpatialSeed(seed) >>> 0;
  const digit = () => {
    const result = value % 5;
    value = Math.floor(value / 5);
    return result;
  };
  return {
    inset: 19 + digit(),
    hookSize: 8.5 + digit() * 0.9,
    shapeSize: 7 + digit() * 0.75,
    dotRadius: 2.5 + digit() * 0.25,
    cornerShift: (digit() - 2) * 0.8,
  };
}

function rotatePoint(point: SpatialPoint, center: SpatialPoint, angleDeg: number): SpatialPoint {
  const radians = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function rotatePoints(points: SpatialPoint[], center: SpatialPoint, angleDeg: number): SpatialPoint[] {
  return points.map((point) => rotatePoint(point, center, angleDeg));
}

function polygon(
  id: string,
  role: string,
  points: SpatialPoint[],
  fill: "none" | "#111" = "none",
  layer = 3,
): SpatialNode {
  return {
    kind: "polygon",
    id,
    role,
    layer,
    points,
    style: fill === "#111" ? { ...SOLID } : { ...OUTLINE },
  };
}

function box(id: string, inset: number): SpatialNode {
  return polygon(id, "container", [
    { x: inset, y: inset },
    { x: 120 - inset, y: inset },
    { x: 120 - inset, y: 120 - inset },
    { x: inset, y: 120 - inset },
  ], "none", 1);
}

function shape(
  kind: ShapeKind,
  id: string,
  role: string,
  center: SpatialPoint,
  size: number,
  angleDeg = 0,
  fill: "none" | "#111" = "none",
): SpatialNode {
  if (kind === "circle") {
    return {
      kind: "circle",
      id,
      role,
      layer: 3,
      center,
      radius: size,
      style: fill === "#111" ? { ...SOLID } : { ...OUTLINE },
    };
  }
  if (kind === "hook") {
    const base = [
      { x: center.x - size, y: center.y - size * 0.75 },
      { x: center.x + size * 0.2, y: center.y - size * 0.75 },
      { x: center.x + size * 0.2, y: center.y - size * 0.15 },
      { x: center.x + size * 0.75, y: center.y - size * 0.15 },
      { x: center.x + size * 0.75, y: center.y + size * 0.75 },
    ];
    return {
      kind: "polyline",
      id,
      role,
      layer: 3,
      points: rotatePoints(base, center, angleDeg),
      style: { stroke: "#111", strokeWidth: 2.4, fill: "none", lineCap: "round", lineJoin: "round" },
    };
  }
  let points: SpatialPoint[];
  switch (kind) {
    case "triangle":
      points = [
        { x: center.x, y: center.y - size },
        { x: center.x + size, y: center.y + size },
        { x: center.x - size, y: center.y + size },
      ];
      break;
    case "square":
      points = [
        { x: center.x - size, y: center.y - size },
        { x: center.x + size, y: center.y - size },
        { x: center.x + size, y: center.y + size },
        { x: center.x - size, y: center.y + size },
      ];
      break;
    case "diamond":
      points = [
        { x: center.x, y: center.y - size },
        { x: center.x + size, y: center.y },
        { x: center.x, y: center.y + size },
        { x: center.x - size, y: center.y },
      ];
      break;
    case "pentagon":
      points = Array.from({ length: 5 }, (_, index) => {
        const angle = (-90 + index * 72) * Math.PI / 180;
        return { x: center.x + Math.cos(angle) * size, y: center.y + Math.sin(angle) * size };
      });
      break;
    case "arrow":
      points = [
        { x: center.x - size, y: center.y - size * 0.28 },
        { x: center.x + size * 0.15, y: center.y - size * 0.28 },
        { x: center.x + size * 0.15, y: center.y - size * 0.58 },
        { x: center.x + size, y: center.y },
        { x: center.x + size * 0.15, y: center.y + size * 0.58 },
        { x: center.x + size * 0.15, y: center.y + size * 0.28 },
        { x: center.x - size, y: center.y + size * 0.28 },
      ];
      break;
    default:
      throw new Error(`Unsupported polygon shape '${kind}'.`);
  }
  return polygon(id, role, rotatePoints(points, center, angleDeg), fill);
}

function dot(id: string, center: SpatialPoint, radius: number): SpatialNode {
  return {
    kind: "circle",
    id,
    role: "dot",
    layer: 5,
    center,
    radius,
    style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
  };
}

function scene(id: string, nodes: SpatialNode[], chapterCode: string): SpatialScene {
  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { minX: 0, minY: 0, width: 120, height: 120 },
    nodes,
    metadata: { chapterCode, semanticRole: "LEARNER_REMEDIATION_V2" },
  };
}

function withId(source: SpatialScene, id: string): SpatialScene {
  return { ...source, id, metadata: source.metadata ? { ...source.metadata } : undefined };
}

function node(source: SpatialScene, id: string): SpatialNode {
  const found = source.nodes.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`${source.id}: missing node '${id}'.`);
  return found;
}

function rotateTwo(source: SpatialScene, angleA: number, angleB: number, id: string): SpatialScene {
  const a = spatialNodeCenterV1(node(source, "comp-a"));
  const b = spatialNodeCenterV1(node(source, "comp-b"));
  const first = rotateSelectedSpatialNodesV1(source, ["comp-a"], angleA, a, `${id}-a`);
  return rotateSelectedSpatialNodesV1(first, ["comp-b"], angleB, b, id);
}

function cornerCenters(m: MaterialV2): [SpatialPoint, SpatialPoint, SpatialPoint, SpatialPoint] {
  const shift = m.cornerShift;
  return [
    { x: 38 + shift, y: 38 - shift },
    { x: 82 - shift, y: 38 + shift },
    { x: 82 + shift, y: 82 - shift },
    { x: 38 - shift, y: 82 + shift },
  ];
}

function cornerScene(
  id: string,
  m: MaterialV2,
  kinds: readonly [ShapeKind, ShapeKind, ShapeKind, ShapeKind],
  chapterCode: string,
): SpatialScene {
  const centers = cornerCenters(m);
  return scene(id, [
    box("container", m.inset),
    shape(kinds[0], "comp-a", "component-a", centers[0], kinds[0] === "hook" ? m.hookSize : m.shapeSize, 0),
    shape(kinds[1], "comp-b", "component-b", centers[1], kinds[1] === "hook" ? m.hookSize : m.shapeSize, 0),
    shape(kinds[2], "comp-c", "component-c", centers[2], kinds[2] === "hook" ? m.hookSize : m.shapeSize, 0),
    shape(kinds[3], "comp-d", "component-d", centers[3], kinds[3] === "hook" ? m.hookSize : m.shapeSize, 0),
  ], chapterCode);
}

function dotCountScene(id: string, m: MaterialV2, count: number): SpatialScene {
  const nodes: SpatialNode[] = [box("container", m.inset)];
  const spacing = 14;
  const start = 60 - ((Math.max(1, count) - 1) * spacing) / 2;
  for (let index = 0; index < count; index += 1) {
    nodes.push(dot(`dot-${index + 1}`, { x: start + index * spacing, y: 60 }, m.dotRadius + 0.5));
  }
  return scene(id, nodes, "FSR-001");
}

function fanBuild(gapId: SpatialGapIdV1, seed: string): SpatialCanonicalQuestionV2 {
  const m = material(seed);
  switch (gapId) {
    case "FAN-GAP-01": {
      const a = scene(`${seed}-a`, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 40, y: 42 }, m.hookSize),
        shape("triangle", "comp-b", "component-b", { x: 79, y: 42 }, m.shapeSize),
        shape("circle", "comp-c", "component-c", { x: 42, y: 78 }, m.shapeSize - 1),
      ], "FAN-001");
      const b = rotateTwo(a, 90, -90, `${seed}-b`);
      const c = scene(`${seed}-c`, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 40, y: 42 }, m.hookSize, 180),
        shape("triangle", "comp-b", "component-b", { x: 79, y: 42 }, m.shapeSize, 90),
        shape("diamond", "comp-c", "component-c", { x: 42, y: 78 }, m.shapeSize),
        shape("pentagon", "comp-d", "component-d", { x: 79, y: 78 }, m.shapeSize),
      ], "FAN-001");
      const correct = rotateTwo(c, 90, -90, `${seed}-correct`);
      const aCenter = spatialNodeCenterV1(node(c, "comp-a"));
      const bCenter = spatialNodeCenterV1(node(c, "comp-b"));
      return {
        stimulusScenes: [a, b, c],
        correctScene: correct,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(c, ["comp-a"], 90, aCenter, `${seed}-only-hook`) },
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(c, ["comp-b"], -90, bCenter, `${seed}-only-triangle`) },
          { misconception: "WRONG_DIRECTION", scene: rotateTwo(c, -90, 90, `${seed}-wrong-directions`) },
        ],
        decisiveProperty: "the hooked line turns 90° clockwise while the triangle turns 90° anticlockwise",
        explanation: {
          observation: "From A to B, the hooked line turns 90° clockwise while the triangle turns 90° anticlockwise. The circle stays fixed.",
          rule: "Turn the two changing shapes independently in opposite directions; do not rotate the whole figure.",
          application: "In C, repeat those two turns while the diamond and pentagon stay fixed.",
          check: "Option {correct} is correct because it applies both turns. The distractors change only one shape or reverse the two directions.",
        },
      };
    }
    case "FAN-GAP-02": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      const a = cornerScene(`${seed}-a`, m, ["hook", "triangle", "circle", "square"], "FAN-001");
      const b = cycleSelectedSpatialNodePositionsV1(a, ids, `${seed}-b`);
      const c = cornerScene(`${seed}-c`, m, ["hook", "arrow", "diamond", "pentagon"], "FAN-001");
      const correct = cycleSelectedSpatialNodePositionsV1(c, ids, `${seed}-correct`);
      return {
        stimulusScenes: [a, b, c],
        correctScene: correct,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: cycleSelectedSpatialNodePositionsV1(c, [...ids].reverse(), `${seed}-reverse`) },
          { misconception: "PARTIAL_RULE", scene: cycleSelectedSpatialNodePositionsV1(c, ["comp-a", "comp-b", "comp-c"], `${seed}-partial`) },
          { misconception: "NO_CHANGE", scene: withId(c, `${seed}-no-change`) },
        ],
        decisiveProperty: "all four symbols move one corner clockwise without changing their own form",
        explanation: {
          observation: "From A to B, every symbol moves to the next corner in the same cycle; no symbol is turned or replaced.",
          rule: "Track each symbol's identity and move all four one position in the same direction.",
          application: "C uses a different set of symbols, so transfer the movement rule rather than copying the appearance of B.",
          check: "Option {correct} is correct because every symbol advances exactly one corner. The distractors reverse, skip or fail to complete the cycle.",
        },
      };
    }
    case "FAN-GAP-03": {
      const a = scene(`${seed}-a`, [
        box("container", m.inset),
        shape("circle", "comp-c", "component-c", { x: 48, y: 62 }, m.shapeSize - 1),
        shape("hook", "comp-a", "component-a", { x: 78, y: 60 }, m.hookSize * 0.8),
      ], "FAN-001");
      const cCenter = spatialNodeCenterV1(node(a, "comp-c"));
      const b = scaleSelectedSpatialNodesV1(a, ["comp-c"], 1.55, cCenter, `${seed}-b`);
      const c = scene(`${seed}-c`, [
        box("container", m.inset),
        shape("diamond", "comp-c", "component-c", { x: 48, y: 62 }, m.shapeSize),
        shape("arrow", "comp-a", "component-a", { x: 78, y: 60 }, m.shapeSize, 0),
      ], "FAN-001");
      const targetCenter = spatialNodeCenterV1(node(c, "comp-c"));
      const otherCenter = spatialNodeCenterV1(node(c, "comp-a"));
      return {
        stimulusScenes: [a, b, c],
        correctScene: scaleSelectedSpatialNodesV1(c, ["comp-c"], 1.55, targetCenter, `${seed}-correct`),
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: scaleSelectedSpatialNodesV1(c, ["comp-c"], 0.65, targetCenter, `${seed}-smaller`) },
          { misconception: "WRONG_COMPONENT", scene: scaleSelectedSpatialNodesV1(c, ["comp-a"], 1.55, otherCenter, `${seed}-wrong-shape`) },
          { misconception: "NO_CHANGE", scene: withId(c, `${seed}-no-change`) },
        ],
        decisiveProperty: "only the selected inner shape becomes clearly larger",
        explanation: {
          observation: "From A to B, the circle becomes clearly larger while the hooked line and its position remain unchanged.",
          rule: "Increase the size of the corresponding shape only; do not enlarge the whole drawing.",
          application: "In C, enlarge the diamond and leave the arrow unchanged.",
          check: "Option {correct} is correct because only the diamond is enlarged. The distractors shrink it, enlarge the arrow or make no change.",
        },
      };
    }
    case "FAN-GAP-04": {
      const containerInset = Math.max(22, m.inset);
      const a = scene(`${seed}-a`, [
        box("container", containerInset),
        shape("circle", "comp-c", "component-c", { x: 58, y: 62 }, m.shapeSize - 1),
        shape("arrow", "comp-a", "component-a", { x: 42, y: 42 }, m.shapeSize * 0.85),
      ], "FAN-001");
      const b = translateSelectedSpatialNodesV1(a, ["comp-c"], 43, 0, `${seed}-b`);
      const c = scene(`${seed}-c`, [
        box("container", containerInset),
        shape("diamond", "comp-c", "component-c", { x: 58, y: 62 }, m.shapeSize),
        shape("hook", "comp-a", "component-a", { x: 42, y: 42 }, m.hookSize * 0.8),
      ], "FAN-001");
      return {
        stimulusScenes: [a, b, c],
        correctScene: translateSelectedSpatialNodesV1(c, ["comp-c"], 43, 0, `${seed}-correct`),
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: translateSelectedSpatialNodesV1(c, ["comp-c"], -43, 0, `${seed}-left`) },
          { misconception: "WRONG_COMPONENT", scene: translateSelectedSpatialNodesV1(c, ["comp-a"], 43, 0, `${seed}-wrong-shape`) },
          { misconception: "NO_CHANGE", scene: withId(c, `${seed}-no-change`) },
        ],
        decisiveProperty: "the selected shape moves from inside the box to just outside the right side",
        explanation: {
          observation: "From A to B, the circle itself does not change; only its position changes from inside the box to outside the right side.",
          rule: "Preserve the selected shape and move it across the same inside-to-outside boundary.",
          application: "In C, move the diamond outside the right side while the hooked line remains fixed.",
          check: "Option {correct} is correct because only the diamond crosses the right boundary. The distractors move it left, move the wrong shape or make no change.",
        },
      };
    }
    case "FAN-GAP-05": {
      const a = scene(`${seed}-a`, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 39, y: 40 }, m.hookSize * 0.8),
        shape("triangle", "comp-b", "component-b", { x: 79, y: 40 }, m.shapeSize * 0.85),
        shape("square", "comp-d", "component-d", { x: 78, y: 78 }, m.shapeSize * 0.75),
        dot("dot-1", { x: 48, y: 78 }, m.dotRadius),
        dot("dot-2", { x: 58, y: 78 }, m.dotRadius),
      ], "FAN-001");
      const aCenter = spatialNodeCenterV1(node(a, "comp-a"));
      let b = reflectSelectedSpatialNodesV1(a, ["comp-a"], "VERTICAL", aCenter.x, `${seed}-b-reflect`);
      b = translateSelectedSpatialNodesV1(b, ["comp-b"], 0, 22, `${seed}-b-move`);
      b = setSelectedSpatialFillV1(b, ["comp-d"], "#111", `${seed}-b-fill`);
      b = removeSelectedSpatialNodesV1(b, ["dot-1"], `${seed}-b`);
      const c = scene(`${seed}-c`, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 39, y: 40 }, m.hookSize * 0.8, 180),
        shape("arrow", "comp-b", "component-b", { x: 79, y: 40 }, m.shapeSize * 0.85, 90),
        shape("pentagon", "comp-d", "component-d", { x: 78, y: 78 }, m.shapeSize * 0.8),
        dot("dot-1", { x: 48, y: 78 }, m.dotRadius),
        dot("dot-2", { x: 58, y: 78 }, m.dotRadius),
      ], "FAN-001");
      const cCenter = spatialNodeCenterV1(node(c, "comp-a"));
      let correct = reflectSelectedSpatialNodesV1(c, ["comp-a"], "VERTICAL", cCenter.x, `${seed}-c-reflect`);
      correct = translateSelectedSpatialNodesV1(correct, ["comp-b"], 0, 22, `${seed}-c-move`);
      correct = setSelectedSpatialFillV1(correct, ["comp-d"], "#111", `${seed}-c-fill`);
      correct = removeSelectedSpatialNodesV1(correct, ["dot-1"], `${seed}-correct`);
      let twoChanges = translateSelectedSpatialNodesV1(c, ["comp-b"], 0, 22, `${seed}-partial-move`);
      twoChanges = setSelectedSpatialFillV1(twoChanges, ["comp-d"], "#111", `${seed}-partial-two`);
      let noMirror = setSelectedSpatialFillV1(c, ["comp-d"], "#111", `${seed}-no-mirror-fill`);
      noMirror = translateSelectedSpatialNodesV1(noMirror, ["comp-b"], 0, 22, `${seed}-no-mirror-move`);
      noMirror = removeSelectedSpatialNodesV1(noMirror, ["dot-1"], `${seed}-no-mirror`);
      let keepsDots = reflectSelectedSpatialNodesV1(c, ["comp-a"], "VERTICAL", cCenter.x, `${seed}-keeps-dots-reflect`);
      keepsDots = translateSelectedSpatialNodesV1(keepsDots, ["comp-b"], 0, 22, `${seed}-keeps-dots-move`);
      keepsDots = setSelectedSpatialFillV1(keepsDots, ["comp-d"], "#111", `${seed}-keeps-dots`);
      return {
        stimulusScenes: [a, b, c],
        correctScene: correct,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: twoChanges },
          { misconception: "PARTIAL_RULE", scene: noMirror },
          { misconception: "PARTIAL_RULE", scene: keepsDots },
        ],
        decisiveProperty: "four changes occur together: mirror the hooked line, move the upper shape down, shade the lower-right shape and remove one dot",
        explanation: {
          observation: "From A to B, the hooked line is mirrored, the triangle moves down, the small square becomes solid and one dot disappears.",
          rule: "A compound analogy is complete only when every visible change is transferred.",
          application: "Apply the same four changes to C: mirror the hooked line, move the arrow down, shade the pentagon and leave one dot.",
          check: "Option {correct} is correct because it contains all four changes. Each distractor omits at least one visible part of the rule.",
        },
      };
    }
    default:
      throw new Error(`${gapId}: unsupported FAN remediation gap.`);
  }
}

function fclBuild(gapId: SpatialGapIdV1, seed: string): SpatialCanonicalQuestionV2 {
  const m = material(seed);
  switch (gapId) {
    case "FCL-GAP-01": {
      const base = scene(`${seed}-base`, [
        shape("hook", "comp-a", "component-a", { x: 43, y: 48 }, m.hookSize),
        shape("triangle", "comp-b", "component-b", { x: 75, y: 48 }, m.shapeSize * 0.8),
        dot("dot-1", { x: 61, y: 76 }, m.dotRadius + 0.5),
      ], "FCL-001");
      const common2 = rotateScene(base, 90, { x: 60, y: 60 }, `${seed}-r90`);
      const common3 = rotateScene(base, 180, { x: 60, y: 60 }, `${seed}-r180`);
      const center = spatialNodeCenterV1(node(base, "comp-a"));
      const odd = scaleSelectedSpatialNodesV1(base, ["comp-a"], 1.65, center, `${seed}-odd`);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: base },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three figures have identical internal geometry under rotation; one has a substantially larger hooked line",
        fclCueAudit: {
          decisiveCue: "hook-size",
          cues: {
            "hook-size": ["normal", "normal", "normal", "large"],
            "whole-orientation": ["0", "90", "180", "0"],
            "dot-count": ["1", "1", "1", "1"],
          },
        },
        explanation: {
          observation: "The first three figures contain the same hooked line, triangle and dot in the same relative arrangement; only the whole arrangement is turned.",
          rule: "Rotation may change orientation, but it does not change the size or shape of an internal part.",
          application: "Mentally rotate the figures to the same orientation and compare the hooked line's size.",
          check: "Option {correct} is the odd figure because its hooked line is substantially larger; the other three coincide under rotation.",
        },
      };
    }
    case "FCL-GAP-02": {
      const build = (id: string, angle: number, count: number) => scene(id, [
        shape("arrow", "arrow", "orientation-cue", { x: 60, y: 39 }, m.shapeSize * 0.9, angle),
        ...Array.from({ length: count }, (_, index) => dot(`dot-${index + 1}`, { x: 46 + index * 14, y: 72 }, m.dotRadius + 0.5)),
      ], "FCL-001");
      const common1 = build(`${seed}-a`, 0, 3);
      const common2 = build(`${seed}-b`, 90, 3);
      const common3 = build(`${seed}-c`, 180, 3);
      const odd = build(`${seed}-odd`, 270, 4);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three figures contain three solid dots while one contains four",
        fclCueAudit: {
          decisiveCue: "dot-count",
          cues: {
            "dot-count": ["3", "3", "3", "4"],
            "arrow-orientation": ["0", "90", "180", "270"],
          },
        },
        explanation: {
          observation: "The first three figures each contain three solid dots. The arrow points in a different direction in every option, so arrow direction cannot form a 3-to-1 group.",
          rule: "Ignore a feature that is unique in every option and compare the common dot count.",
          application: "Count the solid dots in all four figures.",
          check: "Option {correct} is the odd figure because it alone contains four dots; the other three contain three.",
        },
      };
    }
    case "FCL-GAP-03": {
      const build = (id: string, angle: number, reversed: boolean) => scene(id, [
        shape("arrow", "arrow", "orientation-cue", { x: 60, y: 34 }, m.shapeSize * 0.75, angle),
        shape("circle", "circle", "component-c", { x: 44, y: 72 }, reversed ? m.shapeSize : m.shapeSize + 4),
        shape("square", "square", "component-d", { x: 78, y: 72 }, reversed ? m.shapeSize + 5 : m.shapeSize - 1),
      ], "FCL-001");
      const common1 = build(`${seed}-a`, 0, false);
      const common2 = build(`${seed}-b`, 90, false);
      const common3 = build(`${seed}-c`, 180, false);
      const odd = build(`${seed}-odd`, 270, true);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "the square is smaller than the circle in three figures but larger in one",
        fclCueAudit: {
          decisiveCue: "size-relation",
          cues: {
            "size-relation": ["square-smaller", "square-smaller", "square-smaller", "square-larger"],
            "arrow-orientation": ["0", "90", "180", "270"],
          },
        },
        explanation: {
          observation: "The first three figures keep the same size relation: the square is smaller than the circle. The arrow orientation differs in every option.",
          rule: "Compare the size of the square with the circle rather than overall orientation.",
          application: "Look for the option where the usual smaller-square / larger-circle relation is reversed.",
          check: "Option {correct} is the odd figure because its square is larger than its circle.",
        },
      };
    }
    case "FCL-GAP-04": {
      const build = (id: string, angle: number, oddPosition: boolean) => scene(id, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", oddPosition ? { x: 80, y: 80 } : { x: 40, y: 40 }, m.hookSize * 0.78),
        shape("triangle", "comp-b", "orientation-cue", { x: 78, y: 42 }, m.shapeSize * 0.75, angle),
      ], "FCL-001");
      const common1 = build(`${seed}-a`, 0, false);
      const common2 = build(`${seed}-b`, 90, false);
      const common3 = build(`${seed}-c`, 180, false);
      const odd = build(`${seed}-odd`, 270, true);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "the hooked line is in the upper-left region in three figures and the lower-right region in one",
        fclCueAudit: {
          decisiveCue: "hook-position",
          cues: {
            "hook-position": ["upper-left", "upper-left", "upper-left", "lower-right"],
            "triangle-orientation": ["0", "90", "180", "270"],
          },
        },
        explanation: {
          observation: "The first three figures place the hooked line in the upper-left region. The triangle points differently in every option.",
          rule: "Track the position of the hooked line relative to the box.",
          application: "Ignore the triangle's changing orientation and locate the hooked line.",
          check: "Option {correct} is the odd figure because its hooked line has moved to the lower-right region.",
        },
      };
    }
    case "FCL-GAP-05": {
      const build = (id: string, angle: number, shadeTriangle: boolean) => scene(id, [
        box("container", m.inset),
        shape("hook", "comp-a", "orientation-cue", { x: 39, y: 40 }, m.hookSize * 0.72, angle),
        shape("triangle", "comp-b", "component-b", { x: 79, y: 42 }, m.shapeSize * 0.75, 0, shadeTriangle ? "#111" : "none"),
        shape("square", "comp-d", "component-d", { x: 78, y: 78 }, m.shapeSize * 0.72, 0, shadeTriangle ? "none" : "#111"),
      ], "FCL-001");
      const common1 = build(`${seed}-a`, 0, false);
      const common2 = build(`${seed}-b`, 90, false);
      const common3 = build(`${seed}-c`, 180, false);
      const odd = build(`${seed}-odd`, 270, true);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_FILL_LOCATION", scene: common1 },
          { misconception: "WRONG_FILL_LOCATION", scene: common2 },
          { misconception: "WRONG_FILL_LOCATION", scene: common3 },
        ],
        decisiveProperty: "three figures shade the lower-right square while one shades the triangle",
        fclCueAudit: {
          decisiveCue: "filled-shape",
          cues: {
            "filled-shape": ["square", "square", "square", "triangle"],
            "hook-orientation": ["0", "90", "180", "270"],
          },
        },
        explanation: {
          observation: "The first three figures place the solid fill on the small square. The hooked line has a different orientation in every option.",
          rule: "Compare where the solid shading is placed.",
          application: "Find the option in which the filled region moves from the square to another shape.",
          check: "Option {correct} is the odd figure because it shades the triangle while leaving the square unshaded.",
        },
      };
    }
    case "FCL-GAP-06": {
      const pair = (id: string, angle: number, odd: boolean): SpatialScene => {
        const leftCenter = { x: 38, y: 60 };
        const rightCenter = { x: 82, y: 60 };
        const leftHook = shape("hook", "left-hook", "component-a", leftCenter, m.hookSize * 0.78, angle) as Extract<SpatialNode, { kind: "polyline" }>;
        const rightPoints = odd
          ? rotatePoints(leftHook.points.map((point) => ({ x: point.x + 44, y: point.y })), rightCenter, 90)
          : leftHook.points.map((point) => ({ x: rightCenter.x - (point.x - leftCenter.x), y: point.y }));
        const leftDot = { x: leftCenter.x + 9, y: leftCenter.y - 13 };
        const rightDot = odd
          ? { x: rightCenter.x + 13, y: rightCenter.y + 9 }
          : { x: rightCenter.x - 9, y: rightCenter.y - 13 };
        return scene(id, [
          leftHook,
          { ...leftHook, id: "right-hook", points: rightPoints },
          dot("left-dot", leftDot, m.dotRadius),
          dot("right-dot", rightDot, m.dotRadius),
          {
            kind: "line",
            id: "divider",
            role: "pair-divider",
            layer: 0,
            start: { x: 60, y: 28 },
            end: { x: 60, y: 92 },
            style: { stroke: "#888", strokeWidth: 1, dashArray: [3, 3] },
          },
        ], "FCL-001");
      };
      const common1 = pair(`${seed}-a`, 0, false);
      const common2 = pair(`${seed}-b`, 45, false);
      const common3 = pair(`${seed}-c`, -45, false);
      const odd = pair(`${seed}-odd`, 0, true);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three option-pairs show an exact left-right mirror relation, including the marker dot; one pair does not",
        fclCueAudit: {
          decisiveCue: "pair-relation",
          cues: {
            "pair-relation": ["mirror", "mirror", "mirror", "rotation"],
            "left-hook-orientation": ["0", "45", "-45", "0"],
            "marker-count": ["2", "2", "2", "2"],
          },
        },
        explanation: {
          observation: "In the first three options, every bend and the marker dot appear at the horizontally opposite position on the right.",
          rule: "A vertical mirror reverses left and right while keeping corresponding points at the same height.",
          application: "Check both the hooked line and the dot; a rotation is not the same as a mirror.",
          check: "Option {correct} is the odd pair because its right-hand shape and marker cannot be obtained by a vertical mirror of the left-hand figure.",
        },
      };
    }
    default:
      throw new Error(`${gapId}: unsupported FCL remediation gap.`);
  }
}

function fsrBuild(gapId: SpatialGapIdV1, seed: string): SpatialCanonicalQuestionV2 {
  const m = material(seed);
  switch (gapId) {
    case "FSR-GAP-01": {
      const frame0 = scene(`${seed}-f0`, [box("container", m.inset), shape("hook", "comp-a", "component-a", { x: 60, y: 60 }, m.hookSize)], "FSR-001");
      const pivot = spatialNodeCenterV1(node(frame0, "comp-a"));
      const frame1 = reflectSelectedSpatialNodesV1(frame0, ["comp-a"], "VERTICAL", pivot.x, `${seed}-f1`);
      const frame2 = reflectSelectedSpatialNodesV1(frame1, ["comp-a"], "VERTICAL", pivot.x, `${seed}-f2`);
      const correct = reflectSelectedSpatialNodesV1(frame2, ["comp-a"], "VERTICAL", pivot.x, `${seed}-correct`);
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: correct,
        distractors: [
          { misconception: "WRONG_AXIS", scene: reflectSelectedSpatialNodesV1(frame2, ["comp-a"], "HORIZONTAL", pivot.y, `${seed}-horizontal`) },
          { misconception: "WRONG_RELATION", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-a"], 180, pivot, `${seed}-rotate`) },
          { misconception: "NO_CHANGE", scene: withId(frame2, `${seed}-no-change`) },
        ],
        decisiveProperty: "the hooked line alternates between its original form and its left-right mirror",
        explanation: {
          observation: "The first hooked line becomes its left-right mirror in the second frame, then returns to the original in the third.",
          rule: "Repeat the same vertical reflection at every step.",
          application: "The third frame matches the first, so the next must match the second.",
          check: "Option {correct} is correct because it is the exact left-right mirror of the third figure.",
        },
      };
    }
    case "FSR-GAP-02": {
      const frame0 = scene(`${seed}-f0`, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 42, y: 58 }, m.hookSize),
        shape("triangle", "comp-b", "component-b", { x: 78, y: 58 }, m.shapeSize),
      ], "FSR-001");
      const frame1 = rotateTwo(frame0, 90, -90, `${seed}-f1`);
      const frame2 = rotateTwo(frame1, 90, -90, `${seed}-f2`);
      const correct = rotateTwo(frame2, 90, -90, `${seed}-correct`);
      const aCenter = spatialNodeCenterV1(node(frame2, "comp-a"));
      const bCenter = spatialNodeCenterV1(node(frame2, "comp-b"));
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: correct,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-a"], 90, aCenter, `${seed}-hook-only`) },
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-b"], -90, bCenter, `${seed}-triangle-only`) },
          { misconception: "WRONG_DIRECTION", scene: rotateTwo(frame2, 90, 90, `${seed}-same-way`) },
        ],
        decisiveProperty: "the hooked line turns 90° clockwise while the triangle turns 90° anticlockwise at every step",
        explanation: {
          observation: "Both shapes change in every transition, but they turn in opposite directions.",
          rule: "Repeat the two quarter-turns together at each step.",
          application: "Apply one more clockwise turn to the hooked line and one more anticlockwise turn to the triangle.",
          check: "Option {correct} is correct because both rotations continue together; the distractors change only one shape or turn both the same way.",
        },
      };
    }
    case "FSR-GAP-03": {
      const centers = cornerCenters(m);
      const build = (id: string, center: SpatialPoint) => scene(id, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", center, m.hookSize * 0.8),
      ], "FSR-001");
      const frame0 = build(`${seed}-f0`, centers[0]);
      const frame1 = build(`${seed}-f1`, centers[1]);
      const frame2 = build(`${seed}-f2`, centers[2]);
      const frame3 = build(`${seed}-f3`, centers[3]);
      return {
        stimulusScenes: [frame0, frame1, frame2, frame3],
        correctScene: build(`${seed}-correct`, centers[0]),
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: build(`${seed}-wrong-tr`, centers[1]) },
          { misconception: "NO_CHANGE", scene: build(`${seed}-wrong-bl`, centers[3]) },
          { misconception: "WRONG_DIRECTION", scene: build(`${seed}-wrong-br`, centers[2]) },
        ],
        decisiveProperty: "the hooked line moves around the four corners clockwise: top-left, top-right, bottom-right, bottom-left, top-left",
        explanation: {
          observation: "The four visible frames establish three consecutive moves: right, down and left.",
          rule: "Continue the same clockwise corner cycle with the same distance.",
          application: "After the bottom-left position, the next position is the top-left corner.",
          check: "Option {correct} is correct because it returns the hooked line to the top-left corner and continues the established four-corner cycle.",
        },
      };
    }
    case "FSR-GAP-04": {
      const frame0 = dotCountScene(`${seed}-f0`, m, 4);
      const frame1 = dotCountScene(`${seed}-f1`, m, 3);
      const frame2 = dotCountScene(`${seed}-f2`, m, 2);
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: dotCountScene(`${seed}-correct`, m, 1),
        distractors: [
          { misconception: "NO_CHANGE", scene: dotCountScene(`${seed}-two`, m, 2) },
          { misconception: "WRONG_COUNT_CHANGE", scene: dotCountScene(`${seed}-three`, m, 3) },
          { misconception: "WRONG_COUNT_CHANGE", scene: dotCountScene(`${seed}-zero`, m, 0) },
        ],
        decisiveProperty: "the number of dots decreases by exactly one: 4, 3, 2, 1",
        explanation: {
          observation: "The visible count is four dots, then three, then two.",
          rule: "Remove exactly one dot at each step.",
          application: "After two dots, the next frame must contain one dot.",
          check: "Option {correct} is correct because it contains exactly one dot.",
        },
      };
    }
    case "FSR-GAP-05": {
      const build = (id: string, filled: boolean) => scene(id, [
        box("container", m.inset),
        shape("square", "comp-d", "component-d", { x: 60, y: 60 }, m.shapeSize + 2, 0, filled ? "#111" : "none"),
      ], "FSR-001");
      return {
        stimulusScenes: [build(`${seed}-f0`, false), build(`${seed}-f1`, true), build(`${seed}-f2`, false)],
        correctScene: build(`${seed}-correct`, true),
        distractors: [
          { misconception: "NO_CHANGE", scene: build(`${seed}-outline`, false) },
          { misconception: "WRONG_FILL_LOCATION", scene: scene(`${seed}-triangle`, [box("container", m.inset), shape("triangle", "comp-d", "component-d", { x: 60, y: 60 }, m.shapeSize + 2, 0, "#111")], "FSR-001") },
          { misconception: "WRONG_RELATION", scene: scene(`${seed}-circle`, [box("container", m.inset), shape("circle", "comp-d", "component-d", { x: 60, y: 60 }, m.shapeSize + 2, 0, "#111")], "FSR-001") },
        ],
        decisiveProperty: "the same square alternates unshaded and shaded",
        explanation: {
          observation: "The square is outline, solid, then outline again.",
          rule: "Toggle the fill of the same square at every step.",
          application: "The next square must therefore be solid.",
          check: "Option {correct} is correct because it continues the outline → solid → outline → solid pattern without changing the shape.",
        },
      };
    }
    case "FSR-GAP-06": {
      const build = (id: string, kind: ShapeKind, fill: "none" | "#111" = "none") => scene(id, [
        box("container", m.inset),
        shape(kind, "comp-d", "component-d", { x: 60, y: 60 }, m.shapeSize + 2, 0, fill),
      ], "FSR-001");
      return {
        stimulusScenes: [build(`${seed}-f0`, "square"), build(`${seed}-f1`, "circle"), build(`${seed}-f2`, "square")],
        correctScene: build(`${seed}-correct`, "circle"),
        distractors: [
          { misconception: "NO_CHANGE", scene: build(`${seed}-square`, "square") },
          { misconception: "WRONG_RELATION", scene: build(`${seed}-triangle`, "triangle") },
          { misconception: "WRONG_FILL_LOCATION", scene: build(`${seed}-filled-square`, "square", "#111") },
        ],
        decisiveProperty: "the central shape alternates square and circle",
        explanation: {
          observation: "The sequence is square, circle, square.",
          rule: "Repeat the two-shape alternation.",
          application: "After the second square, the next shape must be a circle.",
          check: "Option {correct} is correct because it restores the circle without adding shading or introducing a third shape.",
        },
      };
    }
    case "FSR-GAP-07": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      const frame0 = cornerScene(`${seed}-f0`, m, ["hook", "triangle", "diamond", "pentagon"], "FSR-001");
      const frame1 = cycleSelectedSpatialNodePositionsV1(frame0, ids, `${seed}-f1`);
      const frame2 = cycleSelectedSpatialNodePositionsV1(frame1, ids, `${seed}-f2`);
      const correct = cycleSelectedSpatialNodePositionsV1(frame2, ids, `${seed}-correct`);
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: correct,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: cycleSelectedSpatialNodePositionsV1(frame2, [...ids].reverse(), `${seed}-reverse`) },
          { misconception: "PARTIAL_RULE", scene: cycleSelectedSpatialNodePositionsV1(frame2, ["comp-a", "comp-b", "comp-c"], `${seed}-partial`) },
          { misconception: "NO_CHANGE", scene: withId(frame2, `${seed}-no-change`) },
        ],
        decisiveProperty: "every symbol moves one corner in the same cyclic direction in each frame",
        explanation: {
          observation: "From frame 1 to 2 and again from 2 to 3, the hooked line, triangle, diamond and pentagon each move one corner in the same direction.",
          rule: "Keep each symbol unchanged and repeat the same four-way positional cycle.",
          application: "Move every symbol one more corner from frame 3.",
          check: "Option {correct} is correct because all four symbols advance one position; the distractors reverse, stop or only partly apply the cycle.",
        },
      };
    }
    case "FSR-GAP-08": {
      const build = (id: string, hookAngle: number, squareFilled: boolean, triangleFilled = false) => scene(id, [
        box("container", m.inset),
        shape("hook", "comp-a", "component-a", { x: 42, y: 58 }, m.hookSize * 0.85, hookAngle),
        shape("square", "comp-d", "component-d", { x: 78, y: 66 }, m.shapeSize * 0.8, 0, squareFilled ? "#111" : "none"),
        shape("triangle", "comp-b", "component-b", { x: 78, y: 39 }, m.shapeSize * 0.65, 0, triangleFilled ? "#111" : "none"),
      ], "FSR-001");
      const frame0 = build(`${seed}-f0`, 0, false);
      const frame1 = build(`${seed}-f1`, 90, false);
      const frame2 = build(`${seed}-f2`, 90, true);
      const frame3 = build(`${seed}-f3`, 180, true);
      return {
        stimulusScenes: [frame0, frame1, frame2, frame3],
        correctScene: build(`${seed}-correct`, 180, false),
        distractors: [
          { misconception: "WRONG_RELATION", scene: build(`${seed}-rotate-again`, 270, true) },
          { misconception: "NO_CHANGE", scene: withId(frame3, `${seed}-no-change`) },
          { misconception: "WRONG_FILL_LOCATION", scene: build(`${seed}-wrong-fill`, 180, true, true) },
        ],
        decisiveProperty: "two operations alternate: rotate the hooked line 90° clockwise, then toggle the square's shading",
        explanation: {
          observation: "Frame 1→2 rotates the hooked line; 2→3 shades the square; 3→4 rotates the hooked line again.",
          rule: "The transitions alternate rotation, shading, rotation, shading.",
          application: "The next transition is the shading step, so keep the hooked line fixed and toggle the square from solid back to outline.",
          check: "Option {correct} is correct because it changes only the square's shading. The distractors rotate again, make no change or shade the wrong shape.",
        },
      };
    }
    default:
      throw new Error(`${gapId}: unsupported FSR remediation gap.`);
  }
}

export function buildSpatialCanonicalQuestionV2(gapId: SpatialGapIdV1, seed: string): SpatialCanonicalQuestionV2 {
  if (gapId.startsWith("FAN-")) return fanBuild(gapId, seed);
  if (gapId.startsWith("FCL-")) return fclBuild(gapId, seed);
  return fsrBuild(gapId, seed);
}
