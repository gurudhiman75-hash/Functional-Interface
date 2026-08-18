import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialScene, SpatialStyle } from "./types";

export const FGC_001_SYMMETRY_DISCOVERY_VERSION_V1 = "FGC-001-SYMMETRY-DISCOVERY-V1" as const;

export const FGC_001_SYMMETRY_PROTOTYPES_V1 = [
  "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY",
  "FGC-PROT-07-MIRROR-STATE-REVERSAL",
] as const;

export type FigureCompletionSymmetryPrototypeV1 = (typeof FGC_001_SYMMETRY_PROTOTYPES_V1)[number];

export type FigureCompletionSymmetryMisconceptionV1 =
  | "CORRECT_FRAGMENT"
  | "UNTRANSFORMED_COPY"
  | "SINGLE_AXIS_ONLY"
  | "WRONG_AXIS"
  | "GEOMETRY_RIGHT_STATE_WRONG"
  | "STATE_RIGHT_GEOMETRY_WRONG"
  | "ROW_RULE_ONLY";

export interface FigureCompletionSymmetryOptionV1 {
  misconception: FigureCompletionSymmetryMisconceptionV1;
  scene: SpatialScene;
}

export interface FigureCompletionSymmetryQuestionV1 {
  version: typeof FGC_001_SYMMETRY_DISCOVERY_VERSION_V1;
  chapterCode: "FGC-001";
  prototypeId: FigureCompletionSymmetryPrototypeV1;
  permanentQlId: null;
  seed: string;
  difficulty: "Medium" | "Hard";
  stem: string;
  stimulusScene: SpatialScene;
  options: FigureCompletionSymmetryOptionV1[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  solverEvidence: {
    patchOrigin: { x: number; y: number };
    patchSize: number;
    fullSceneFingerprint: string;
    reconstructedFingerprints: string[];
    matchingOptionIndexes: number[];
    ruleSummary: string;
  };
  contentFingerprint: string;
  deliveryFingerprint: string;
  lifecycle: {
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

const PATCH_ORIGIN = { x: 50, y: 50 } as const;
const PATCH_SIZE = 40;
const MAIN_VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW_BOX = { minX: 0, minY: 0, width: PATCH_SIZE, height: PATCH_SIZE } as const;
const LINE_STYLE: SpatialStyle = {
  stroke: "currentColor",
  strokeWidth: 2.3,
  fill: "none",
  lineCap: "round",
  lineJoin: "round",
};

function line(id: string, x1: number, y1: number, x2: number, y2: number, role = "figure-line"): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    role,
    style: { ...LINE_STYLE },
  };
}

function circle(id: string, x: number, y: number, radius: number, filled: boolean, role = "figure-marker"): SpatialNode {
  return {
    kind: "circle",
    id,
    center: { x, y },
    radius,
    role,
    style: {
      ...LINE_STYLE,
      fill: filled ? "currentColor" : "none",
    },
  };
}

function polygon(id: string, points: Array<{ x: number; y: number }>, filled: boolean, role = "figure-shape"): SpatialNode {
  return {
    kind: "polygon",
    id,
    points,
    role,
    style: {
      ...LINE_STYLE,
      fill: filled ? "currentColor" : "none",
    },
  };
}

function scene(id: string, nodes: SpatialNode[], option = false): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: option ? { ...OPTION_VIEW_BOX } : { ...MAIN_VIEW_BOX },
    nodes,
    metadata: {
      chapterCode: "FGC-001",
      semanticRole: option ? "completion-option" : "completion-stimulus",
    },
  };
}

function gridFrameNodes(): SpatialNode[] {
  return [
    {
      kind: "polygon",
      id: "main-frame",
      points: [
        { x: 10, y: 10 },
        { x: 90, y: 10 },
        { x: 90, y: 90 },
        { x: 10, y: 90 },
      ],
      role: "figure-frame",
      layer: -10,
      style: { stroke: "currentColor", strokeWidth: 1.7, fill: "none" },
    },
    line("vertical-axis", 50, 10, 50, 90, "symmetry-axis"),
    line("horizontal-axis", 10, 50, 90, 50, "symmetry-axis"),
  ];
}

function missingBoundary(): SpatialNode {
  return {
    kind: "polygon",
    id: "missing-quadrant",
    points: [
      { x: 50, y: 50 },
      { x: 90, y: 50 },
      { x: 90, y: 90 },
      { x: 50, y: 90 },
    ],
    role: "missing-region",
    layer: 20,
    style: {
      stroke: "currentColor",
      strokeWidth: 1.3,
      fill: "none",
      dashArray: [4, 3],
    },
  };
}

type LocalTransform = "IDENTITY" | "REFLECT_VERTICAL" | "REFLECT_HORIZONTAL" | "ROTATE_180";

function transformPoint(point: { x: number; y: number }, transform: LocalTransform): { x: number; y: number } {
  switch (transform) {
    case "IDENTITY":
      return { ...point };
    case "REFLECT_VERTICAL":
      return { x: PATCH_SIZE - point.x, y: point.y };
    case "REFLECT_HORIZONTAL":
      return { x: point.x, y: PATCH_SIZE - point.y };
    case "ROTATE_180":
      return { x: PATCH_SIZE - point.x, y: PATCH_SIZE - point.y };
  }
}

function transformNode(node: SpatialNode, transform: LocalTransform, idPrefix: string): SpatialNode {
  const common = { ...node, id: `${idPrefix}${node.id}` };
  switch (node.kind) {
    case "line":
      return {
        ...common,
        kind: "line",
        start: transformPoint(node.start, transform),
        end: transformPoint(node.end, transform),
      };
    case "circle":
      return {
        ...common,
        kind: "circle",
        center: transformPoint(node.center, transform),
      };
    case "polygon":
      return {
        ...common,
        kind: "polygon",
        points: node.points.map((point) => transformPoint(point, transform)),
      };
    case "polyline":
      return {
        ...common,
        kind: "polyline",
        points: node.points.map((point) => transformPoint(point, transform)),
      };
    case "arc":
      throw new Error("FGC symmetry discovery V1 does not use arc primitives.");
  }
}

function transformNodes(nodes: readonly SpatialNode[], transform: LocalTransform, idPrefix: string): SpatialNode[] {
  return nodes.map((node) => transformNode(node, transform, idPrefix));
}

function translateNode(node: SpatialNode, dx: number, dy: number, idPrefix: string): SpatialNode {
  const common = { ...node, id: `${idPrefix}${node.id}` };
  switch (node.kind) {
    case "line":
      return {
        ...common,
        kind: "line",
        start: { x: node.start.x + dx, y: node.start.y + dy },
        end: { x: node.end.x + dx, y: node.end.y + dy },
      };
    case "circle":
      return {
        ...common,
        kind: "circle",
        center: { x: node.center.x + dx, y: node.center.y + dy },
      };
    case "polygon":
      return {
        ...common,
        kind: "polygon",
        points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
      };
    case "polyline":
      return {
        ...common,
        kind: "polyline",
        points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
      };
    case "arc":
      return {
        ...common,
        kind: "arc",
        center: { x: node.center.x + dx, y: node.center.y + dy },
      };
  }
}

function placeQuadrant(nodes: readonly SpatialNode[], originX: number, originY: number, prefix: string): SpatialNode[] {
  return nodes.map((node) => translateNode(node, originX, originY, prefix));
}

function invertVisualState(nodes: readonly SpatialNode[], idPrefix: string): SpatialNode[] {
  return nodes.map((node) => {
    const copied = { ...node, id: `${idPrefix}${node.id}` } as SpatialNode;
    if ((node.kind === "circle" || node.kind === "polygon") && node.role === "state-shape") {
      const currentFill = node.style?.fill?.trim().toLowerCase();
      const filled = Boolean(currentFill && currentFill !== "none" && currentFill !== "transparent");
      copied.style = { ...node.style, fill: filled ? "none" : "currentColor" };
    }
    return copied;
  });
}

function buildMirrorBase(rng: SpatialSeededRandom): SpatialNode[] {
  const a = rng.int(6, 11);
  const b = rng.int(8, 14);
  const c = rng.int(24, 31);
  const d = rng.int(22, 30);
  const markerX = rng.int(10, 17);
  const markerY = rng.int(19, 27);
  return [
    line("diag-a", a, b, c, d),
    line("diag-b", 7, 31, 28, 9 + rng.int(0, 4)),
    circle("marker", markerX, markerY, 2.3, true),
  ];
}

function buildStateBase(rng: SpatialSeededRandom): SpatialNode[] {
  const apexX = rng.int(16, 22);
  const leftX = rng.int(6, 10);
  const rightX = rng.int(28, 34);
  const topY = rng.int(6, 10);
  const bottomY = rng.int(26, 32);
  const disc1X = rng.int(9, 14);
  const disc2X = rng.int(26, 32);
  const discY = rng.int(17, 23);
  return [
    polygon(
      "state-triangle",
      [
        { x: apexX, y: topY },
        { x: rightX, y: bottomY },
        { x: leftX, y: bottomY - rng.int(0, 3) },
      ],
      false,
      "state-shape",
    ),
    circle("state-disc-a", disc1X, discY, 2.6, true, "state-shape"),
    circle("state-disc-b", disc2X, PATCH_SIZE - discY + 2, 2.6, false, "state-shape"),
    line("state-guide", 8, 12, 31, 27),
  ];
}

interface SymmetryMaterial {
  contextNodes: SpatialNode[];
  correctNodes: SpatialNode[];
  distractors: Array<{
    misconception: Exclude<FigureCompletionSymmetryMisconceptionV1, "CORRECT_FRAGMENT">;
    nodes: SpatialNode[];
  }>;
  difficulty: "Medium" | "Hard";
  observation: string;
  rule: string;
  application: string;
  ruleSummary: string;
}

function buildMirrorSymmetryMaterial(rng: SpatialSeededRandom): SymmetryMaterial {
  const base = buildMirrorBase(rng);
  const topRight = transformNodes(base, "REFLECT_VERTICAL", "tr-");
  const bottomLeft = transformNodes(base, "REFLECT_HORIZONTAL", "bl-");
  const correct = transformNodes(base, "ROTATE_180", "correct-");
  return {
    contextNodes: [
      ...placeQuadrant(base, 10, 10, "tl-place-"),
      ...placeQuadrant(topRight, 50, 10, "tr-place-"),
      ...placeQuadrant(bottomLeft, 10, 50, "bl-place-"),
    ],
    correctNodes: correct,
    distractors: [
      { misconception: "UNTRANSFORMED_COPY", nodes: transformNodes(base, "IDENTITY", "wrong-copy-") },
      { misconception: "SINGLE_AXIS_ONLY", nodes: transformNodes(base, "REFLECT_VERTICAL", "wrong-v-") },
      { misconception: "WRONG_AXIS", nodes: transformNodes(base, "REFLECT_HORIZONTAL", "wrong-h-") },
    ],
    difficulty: "Medium",
    observation: "Three quadrants show the same lines and marker mirrored across the centre axes, while the fourth quadrant is missing.",
    rule: "The right quadrant mirrors the left one and the lower quadrant mirrors the upper one.",
    application: "Apply both mirror directions to the top-left figure to obtain the missing bottom-right figure.",
    ruleSummary: "Complete the fourth quadrant by preserving horizontal and vertical mirror symmetry of the whole figure.",
  };
}

function buildMirrorStateMaterial(rng: SpatialSeededRandom): SymmetryMaterial {
  const base = buildStateBase(rng);
  const topRight = transformNodes(base, "REFLECT_VERTICAL", "tr-");
  const bottomLeftGeometry = transformNodes(base, "REFLECT_HORIZONTAL", "bl-geom-");
  const bottomLeft = invertVisualState(bottomLeftGeometry, "bl-state-");
  const correctGeometry = transformNodes(base, "ROTATE_180", "correct-geom-");
  const correct = invertVisualState(correctGeometry, "correct-state-");

  const geometryRightStateWrong = transformNodes(base, "ROTATE_180", "wrong-no-state-");
  const stateRightGeometryWrong = invertVisualState(base, "wrong-state-copy-");
  const rowRuleOnlyGeometry = transformNodes(base, "REFLECT_VERTICAL", "wrong-row-geom-");
  const rowRuleOnly = invertVisualState(rowRuleOnlyGeometry, "wrong-row-state-");

  return {
    contextNodes: [
      ...placeQuadrant(base, 10, 10, "tl-place-"),
      ...placeQuadrant(topRight, 50, 10, "tr-place-"),
      ...placeQuadrant(bottomLeft, 10, 50, "bl-place-"),
    ],
    correctNodes: correct,
    distractors: [
      { misconception: "GEOMETRY_RIGHT_STATE_WRONG", nodes: geometryRightStateWrong },
      { misconception: "STATE_RIGHT_GEOMETRY_WRONG", nodes: stateRightGeometryWrong },
      { misconception: "ROW_RULE_ONLY", nodes: rowRuleOnly },
    ],
    difficulty: "Hard",
    observation: "Across each row the figure is mirrored, and from the upper row to the lower row the filled and outline shapes exchange states.",
    rule: "Use the mirror rule for position and the black/white reversal rule for visual state together.",
    application: "Mirror the lower-left figure into the missing quadrant while keeping its reversed filled/outline states.",
    ruleSummary: "The missing quadrant must satisfy both the row mirror relation and the vertical filled/outline state reversal.",
  };
}

function materialForPrototype(prototypeId: FigureCompletionSymmetryPrototypeV1, rng: SpatialSeededRandom): SymmetryMaterial {
  switch (prototypeId) {
    case "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY":
      return buildMirrorSymmetryMaterial(rng);
    case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
      return buildMirrorStateMaterial(rng);
  }
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-symmetry-option:${seed}:${label}`, nodes, true);
}

function buildStimulus(id: string, contextNodes: SpatialNode[]): SpatialScene {
  return scene(id, [...gridFrameNodes(), ...contextNodes, missingBoundary()]);
}

function composeFullScene(id: string, contextNodes: SpatialNode[], fragmentNodes: SpatialNode[]): SpatialScene {
  return scene(id, [
    ...gridFrameNodes(),
    ...contextNodes,
    ...placeQuadrant(fragmentNodes, PATCH_ORIGIN.x, PATCH_ORIGIN.y, "placed-")
  ]);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

export function generateFigureCompletionSymmetryQuestionV1(request: {
  prototypeId: FigureCompletionSymmetryPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionSymmetryQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 symmetry discovery requires a non-empty seed.");
  const rng = new SpatialSeededRandom(`FGC-001:SYMMETRY:${request.prototypeId}:${request.seed}`);
  const material = materialForPrototype(request.prototypeId, rng);

  const stimulusScene = buildStimulus(`fgc-symmetry-stimulus:${request.prototypeId}:${request.seed}`, material.contextNodes);
  const fullScene = composeFullScene(`fgc-symmetry-full:${request.prototypeId}:${request.seed}`, material.contextNodes, material.correctNodes);
  const rawOptions: FigureCompletionSymmetryOptionV1[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", material.correctNodes) },
    ...material.distractors.map((entry) => ({
      misconception: entry.misconception,
      scene: optionScene(request.seed, entry.misconception, entry.nodes),
    })),
  ];

  assertValidSpatialScene(stimulusScene);
  assertValidSpatialScene(fullScene);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));

  const semanticUniqueness = validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene));
  if (!semanticUniqueness.ok) {
    throw new Error(`${request.prototypeId}: semantically equivalent symmetry options.`);
  }
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptualUniqueness.ok) {
    throw new Error(`${request.prototypeId}: perceptually equivalent symmetry options.`);
  }

  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionSymmetryOptionV1[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === desired) options.push(rawOptions[0] as FigureCompletionSymmetryOptionV1);
    else options.push(wrong[wrongIndex++] as FigureCompletionSymmetryOptionV1);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(fullScene);
  const reconstructedFingerprints = options.map((option, index) =>
    spatialSceneSemanticFingerprint(
      composeFullScene(`fgc-symmetry-reconstructed:${request.seed}:${index}`, material.contextNodes, option.scene.nodes),
    ),
  );
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desired) {
    throw new Error(`${request.prototypeId}: symmetry completion oracle did not identify exactly the intended option.`);
  }

  const contentFingerprint = JSON.stringify({
    prototypeId: request.prototypeId,
    stimulus: spatialSceneSemanticFingerprint(stimulusScene),
    optionSet: options.map((option) => spatialSceneSemanticFingerprint(option.scene)).sort(),
    correct: spatialSceneSemanticFingerprint(options[desired]!.scene),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    ordered: options.map((option) => spatialSceneSemanticFingerprint(option.scene)),
    correctOptionIndex: desired,
  });
  const answer = answerLetter(desired);

  return {
    version: FGC_001_SYMMETRY_DISCOVERY_VERSION_V1,
    chapterCode: "FGC-001",
    prototypeId: request.prototypeId,
    permanentQlId: null,
    seed: request.seed,
    difficulty: material.difficulty,
    stem: "Choose the option that correctly completes the missing quadrant of the figure.",
    stimulusScene,
    options,
    correctOptionIndex: desired,
    answer,
    explanation: {
      observation: material.observation,
      rule: material.rule,
      application: material.application,
      check: `Option ${answer} is the only figure that completes every required symmetry and visible-state relation.`,
    },
    solverEvidence: {
      patchOrigin: { ...PATCH_ORIGIN },
      patchSize: PATCH_SIZE,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      ruleSummary: material.ruleSummary,
    },
    contentFingerprint,
    deliveryFingerprint,
    lifecycle: {
      maturity: "EXECUTABLE_DISCOVERY_PROOF",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}
