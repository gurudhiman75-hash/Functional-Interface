import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialScene, SpatialStyle } from "./types";

export const FGC_001_ARC_DISCOVERY_VERSION_V1 = "FGC-001-ARC-DISCOVERY-V1" as const;
export const FGC_001_ARC_PROTOTYPE_V1 = "FGC-PROT-08-ARC-QUADRANT-SYMMETRY" as const;

export type FigureCompletionArcMisconceptionV1 =
  | "CORRECT_FRAGMENT"
  | "WRONG_ARC_CORNER"
  | "INNER_ARC_MISSING"
  | "DIAGONAL_REVERSED";

export interface FigureCompletionArcOptionV1 {
  misconception: FigureCompletionArcMisconceptionV1;
  scene: SpatialScene;
}

export interface FigureCompletionArcQuestionV1 {
  version: typeof FGC_001_ARC_DISCOVERY_VERSION_V1;
  chapterCode: "FGC-001";
  prototypeId: typeof FGC_001_ARC_PROTOTYPE_V1;
  permanentQlId: null;
  seed: string;
  difficulty: "Medium";
  stem: string;
  stimulusScene: SpatialScene;
  options: FigureCompletionArcOptionV1[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  solverEvidence: {
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

const QUADRANT_SIZE = 40;
const MAIN_VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW_BOX = { minX: 0, minY: 0, width: QUADRANT_SIZE, height: QUADRANT_SIZE } as const;
const LINE_STYLE: SpatialStyle = {
  stroke: "currentColor",
  strokeWidth: 2.25,
  fill: "none",
  lineCap: "round",
  lineJoin: "round",
};

type Quadrant = "TL" | "TR" | "BL" | "BR";

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

function arc(
  id: string,
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number,
  role = "figure-arc",
): SpatialNode {
  return {
    kind: "arc",
    id,
    center: { x: cx, y: cy },
    radius,
    startAngleDeg,
    endAngleDeg,
    sweep: "clockwise",
    role,
    style: { ...LINE_STYLE },
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

function frameNodes(): SpatialNode[] {
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

function geometryForQuadrant(quadrant: Quadrant, outerRadius: number, innerRadius: number): SpatialNode[] {
  switch (quadrant) {
    case "TL":
      return [
        arc("outer-arc", 40, 40, outerRadius, 180, 270),
        arc("inner-arc", 40, 40, innerRadius, 180, 270),
        line("diagonal", 40, 40, 6, 6),
      ];
    case "TR":
      return [
        arc("outer-arc", 0, 40, outerRadius, 270, 0),
        arc("inner-arc", 0, 40, innerRadius, 270, 0),
        line("diagonal", 0, 40, 34, 6),
      ];
    case "BL":
      return [
        arc("outer-arc", 40, 0, outerRadius, 90, 180),
        arc("inner-arc", 40, 0, innerRadius, 90, 180),
        line("diagonal", 40, 0, 6, 34),
      ];
    case "BR":
      return [
        arc("outer-arc", 0, 0, outerRadius, 0, 90),
        arc("inner-arc", 0, 0, innerRadius, 0, 90),
        line("diagonal", 0, 0, 34, 34),
      ];
  }
}

function translateNode(node: SpatialNode, dx: number, dy: number, prefix: string): SpatialNode {
  const common = { ...node, id: `${prefix}${node.id}` };
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

function place(nodes: readonly SpatialNode[], dx: number, dy: number, prefix: string): SpatialNode[] {
  return nodes.map((node) => translateNode(node, dx, dy, prefix));
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-arc-option:${seed}:${label}`, nodes, true);
}

function stimulusScene(seed: string, outerRadius: number, innerRadius: number): SpatialScene {
  return scene(`fgc-arc-stimulus:${seed}`, [
    ...frameNodes(),
    ...place(geometryForQuadrant("TL", outerRadius, innerRadius), 10, 10, "tl-"),
    ...place(geometryForQuadrant("TR", outerRadius, innerRadius), 50, 10, "tr-"),
    ...place(geometryForQuadrant("BL", outerRadius, innerRadius), 10, 50, "bl-"),
    missingBoundary(),
  ]);
}

function composeFullScene(seed: string, outerRadius: number, innerRadius: number, fragment: SpatialNode[], suffix: string): SpatialScene {
  return scene(`fgc-arc-full:${seed}:${suffix}`, [
    ...frameNodes(),
    ...place(geometryForQuadrant("TL", outerRadius, innerRadius), 10, 10, "tl-"),
    ...place(geometryForQuadrant("TR", outerRadius, innerRadius), 50, 10, "tr-"),
    ...place(geometryForQuadrant("BL", outerRadius, innerRadius), 10, 50, "bl-"),
    ...place(fragment, 50, 50, "br-"),
  ]);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

export function generateFigureCompletionArcQuestionV1(request: {
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionArcQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 arc discovery requires a non-empty seed.");
  const rng = new SpatialSeededRandom(`FGC-001:ARC:${request.seed}`);
  const outerRadius = rng.int(25, 35);
  const innerRadius = rng.int(8, 16);

  const correctNodes = geometryForQuadrant("BR", outerRadius, innerRadius);
  const wrongCornerNodes = [
    arc("outer-arc", 40, 0, outerRadius, 90, 180),
    arc("inner-arc", 40, 0, innerRadius, 90, 180),
    line("diagonal", 40, 0, 6, 34),
  ];
  const missingInnerNodes = [
    arc("outer-arc", 0, 0, outerRadius, 0, 90),
    line("diagonal", 0, 0, 34, 34),
  ];
  const reversedDiagonalNodes = [
    arc("outer-arc", 0, 0, outerRadius, 0, 90),
    arc("inner-arc", 0, 0, innerRadius, 0, 90),
    line("diagonal", 0, 34, 34, 0),
  ];

  const stimulus = stimulusScene(request.seed, outerRadius, innerRadius);
  const full = composeFullScene(request.seed, outerRadius, innerRadius, correctNodes, "canonical");
  const rawOptions: FigureCompletionArcOptionV1[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", correctNodes) },
    { misconception: "WRONG_ARC_CORNER", scene: optionScene(request.seed, "wrong-corner", wrongCornerNodes) },
    { misconception: "INNER_ARC_MISSING", scene: optionScene(request.seed, "inner-missing", missingInnerNodes) },
    { misconception: "DIAGONAL_REVERSED", scene: optionScene(request.seed, "diag-reversed", reversedDiagonalNodes) },
  ];

  assertValidSpatialScene(stimulus);
  assertValidSpatialScene(full);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));

  const semantic = validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene));
  if (!semantic.ok) throw new Error("FGC arc discovery produced semantically equivalent options.");
  const perceptual = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptual.ok) throw new Error("FGC arc discovery produced perceptually equivalent options.");

  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionArcOptionV1[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === desired) options.push(rawOptions[0] as FigureCompletionArcOptionV1);
    else options.push(wrong[wrongIndex++] as FigureCompletionArcOptionV1);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(full);
  const reconstructedFingerprints = options.map((option, index) =>
    spatialSceneSemanticFingerprint(
      composeFullScene(request.seed, outerRadius, innerRadius, option.scene.nodes, `reconstructed-${index}`),
    ),
  );
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desired) {
    throw new Error("FGC arc completion oracle did not identify exactly the intended option.");
  }

  const contentFingerprint = JSON.stringify({
    prototypeId: FGC_001_ARC_PROTOTYPE_V1,
    stimulus: spatialSceneSemanticFingerprint(stimulus),
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
    version: FGC_001_ARC_DISCOVERY_VERSION_V1,
    chapterCode: "FGC-001",
    prototypeId: FGC_001_ARC_PROTOTYPE_V1,
    permanentQlId: null,
    seed: request.seed,
    difficulty: "Medium",
    stem: "Choose the option that correctly completes the missing quadrant of the figure.",
    stimulusScene: stimulus,
    options,
    correctOptionIndex: desired,
    answer,
    explanation: {
      observation: "The three visible quadrants repeat two quarter-circle arcs and one diagonal line around the centre.",
      rule: "The missing quadrant must preserve the same arc radii and radial symmetry around the centre.",
      application: "Place both quarter-circle arcs in the bottom-right quadrant and continue the diagonal from the centre toward the outer corner.",
      check: `Option ${answer} is the only figure that completes both arcs and the diagonal in the correct quadrant.`,
    },
    solverEvidence: {
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      ruleSummary: "Two concentric quarter-circle arcs and the centre-to-corner diagonal repeat with quadrant symmetry.",
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
