import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialPoint, SpatialScene, SpatialStyle } from "./types";

export const FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V1 = "FGC-001-SOURCE-GAP-DISCOVERY-V1" as const;

export const FGC_001_SOURCE_GAP_PROTOTYPES_V1 = [
  "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION",
  "FGC-PROT-10-SHAPE-CONTACT-STATE",
] as const;

export type FigureCompletionSourceGapPrototypeV1 = (typeof FGC_001_SOURCE_GAP_PROTOTYPES_V1)[number];

export type FigureCompletionSourceGapMisconceptionV1 =
  | "CORRECT_FRAGMENT"
  | "COMPONENT_COUNT_ERROR"
  | "ARROW_ORIENTATION_ERROR"
  | "COUNT_AND_ORIENTATION_ERROR"
  | "SHAPE_CLASS_ERROR"
  | "CONTACT_STATE_ERROR"
  | "VERTICAL_FLIP_ERROR";

export interface FigureCompletionSourceGapOptionV1 {
  misconception: FigureCompletionSourceGapMisconceptionV1;
  scene: SpatialScene;
}

export interface FigureCompletionSourceGapQuestionV1 {
  version: typeof FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V1;
  chapterCode: "FGC-001";
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  permanentQlId: null;
  seed: string;
  difficulty: "Medium" | "Hard";
  stem: string;
  stimulusScene: SpatialScene;
  options: FigureCompletionSourceGapOptionV1[];
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
    sourceAnchor: string;
    propertyEvidence: {
      referenceArrowDirection?: CardinalDirection;
      requiredArrowDirection?: CardinalDirection;
      correctGlobalCircleCount?: number;
      contactRule?: "MATCH_FILL_STATE";
      shapeRule?: "ORTHOGONAL_CORNER";
      flipRule?: "NO_VERTICAL_FLIP";
    };
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

const PATCH_ORIGIN = { x: 34, y: 34 } as const;
const PATCH_SIZE = 32;
const STIMULUS_VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW_BOX = { minX: 0, minY: 0, width: PATCH_SIZE, height: PATCH_SIZE } as const;
const LINE_STYLE: SpatialStyle = {
  stroke: "currentColor",
  strokeWidth: 2.4,
  fill: "none",
  lineCap: "round",
  lineJoin: "round",
};

type CardinalDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface SourceGapMaterial {
  contextNodes: SpatialNode[];
  correctNodes: SpatialNode[];
  distractors: Array<{
    misconception: Exclude<FigureCompletionSourceGapMisconceptionV1, "CORRECT_FRAGMENT">;
    nodes: SpatialNode[];
  }>;
  difficulty: "Medium" | "Hard";
  observation: string;
  rule: string;
  application: string;
  ruleSummary: string;
  sourceAnchor: string;
  propertyEvidence: FigureCompletionSourceGapQuestionV1["solverEvidence"]["propertyEvidence"];
}

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

function circle(id: string, x: number, y: number, radius: number, filled: boolean, role = "figure-circle"): SpatialNode {
  return {
    kind: "circle",
    id,
    center: { x, y },
    radius,
    role,
    style: { ...LINE_STYLE, fill: filled ? "currentColor" : "none" },
  };
}

function polygon(id: string, points: SpatialPoint[], role = "figure-shape"): SpatialNode {
  return {
    kind: "polygon",
    id,
    points,
    role,
    style: { ...LINE_STYLE, fill: "none" },
  };
}

function outerFrame(): SpatialNode {
  return polygon(
    "outer-frame",
    [
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      { x: 95, y: 95 },
      { x: 5, y: 95 },
    ],
    "figure-frame",
  );
}

function missingBoundary(): SpatialNode {
  return {
    kind: "polygon",
    id: "missing-box",
    points: [
      { x: PATCH_ORIGIN.x, y: PATCH_ORIGIN.y },
      { x: PATCH_ORIGIN.x + PATCH_SIZE, y: PATCH_ORIGIN.y },
      { x: PATCH_ORIGIN.x + PATCH_SIZE, y: PATCH_ORIGIN.y + PATCH_SIZE },
      { x: PATCH_ORIGIN.x, y: PATCH_ORIGIN.y + PATCH_SIZE },
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

function scene(id: string, nodes: SpatialNode[], option = false): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: option ? { ...OPTION_VIEW_BOX } : { ...STIMULUS_VIEW_BOX },
    nodes,
    metadata: {
      chapterCode: "FGC-001",
      semanticRole: option ? "completion-option" : "completion-stimulus",
    },
  };
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
      return { ...common, kind: "circle", center: { x: node.center.x + dx, y: node.center.y + dy } };
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
      return { ...common, kind: "arc", center: { x: node.center.x + dx, y: node.center.y + dy } };
  }
}

function buildStimulus(id: string, contextNodes: SpatialNode[]): SpatialScene {
  return scene(id, [outerFrame(), ...contextNodes, missingBoundary()]);
}

function composeFullScene(id: string, contextNodes: SpatialNode[], fragmentNodes: SpatialNode[]): SpatialScene {
  return scene(id, [
    outerFrame(),
    ...contextNodes,
    ...fragmentNodes.map((node) => translateNode(node, PATCH_ORIGIN.x, PATCH_ORIGIN.y, "placed-")),
  ]);
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-source-gap-option:${seed}:${label}`, nodes, true);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

function oppositeDirection(direction: CardinalDirection): CardinalDirection {
  switch (direction) {
    case "UP": return "DOWN";
    case "RIGHT": return "LEFT";
    case "DOWN": return "UP";
    case "LEFT": return "RIGHT";
  }
}

function arrowNodes(
  idPrefix: string,
  centerX: number,
  centerY: number,
  direction: CardinalDirection,
  role = "arrow",
  length = 18,
): SpatialNode[] {
  const half = length / 2;
  const head = 4;
  let start: SpatialPoint;
  let tip: SpatialPoint;
  let headA: SpatialPoint;
  let headB: SpatialPoint;
  switch (direction) {
    case "RIGHT":
      start = { x: centerX - half, y: centerY };
      tip = { x: centerX + half, y: centerY };
      headA = { x: tip.x - head, y: tip.y - head };
      headB = { x: tip.x - head, y: tip.y + head };
      break;
    case "LEFT":
      start = { x: centerX + half, y: centerY };
      tip = { x: centerX - half, y: centerY };
      headA = { x: tip.x + head, y: tip.y - head };
      headB = { x: tip.x + head, y: tip.y + head };
      break;
    case "UP":
      start = { x: centerX, y: centerY + half };
      tip = { x: centerX, y: centerY - half };
      headA = { x: tip.x - head, y: tip.y + head };
      headB = { x: tip.x + head, y: tip.y + head };
      break;
    case "DOWN":
      start = { x: centerX, y: centerY - half };
      tip = { x: centerX, y: centerY + half };
      headA = { x: tip.x - head, y: tip.y - head };
      headB = { x: tip.x + head, y: tip.y - head };
      break;
  }
  return [
    line(`${idPrefix}-shaft`, start.x, start.y, tip.x, tip.y, role),
    line(`${idPrefix}-head-a`, tip.x, tip.y, headA.x, headA.y, role),
    line(`${idPrefix}-head-b`, tip.x, tip.y, headB.x, headB.y, role),
  ];
}

function buildComponentCountOrientationMaterial(rng: SpatialSeededRandom): SourceGapMaterial {
  const referenceDirection = rng.pick(["UP", "RIGHT", "DOWN", "LEFT"] as const);
  const requiredDirection = oppositeDirection(referenceDirection);
  const circleRadius = rng.pick([2.6, 3, 3.4] as const);
  const rowY = 50 + rng.int(-3, 3);
  const leftX = 17 + rng.int(-2, 2);
  const rightX = 83 + rng.int(-2, 2);
  const missingCircleX = 16 + rng.int(-3, 3);
  const missingCircleY = rowY - PATCH_ORIGIN.y;
  const arrowCenterX = 16 + rng.int(-2, 2);
  const arrowCenterY = rng.int(22, 26);
  const referenceCenterX = PATCH_ORIGIN.x + arrowCenterX;
  const referenceCenterY = 20 + rng.int(-2, 2);
  const extraOffset = rng.pick([7, 8, 9] as const);

  const contextNodes: SpatialNode[] = [
    circle("count-circle-left", leftX, rowY, circleRadius, false, "count-circle"),
    circle("count-circle-right", rightX, rowY, circleRadius, false, "count-circle"),
    ...arrowNodes("reference-arrow", referenceCenterX, referenceCenterY, referenceDirection, "reference-arrow", 16),
    line("circle-alignment-left", leftX + circleRadius + 3, rowY, PATCH_ORIGIN.x, rowY, "alignment-guide"),
    line("circle-alignment-right", PATCH_ORIGIN.x + PATCH_SIZE, rowY, rightX - circleRadius - 3, rowY, "alignment-guide"),
  ];

  const correctNodes: SpatialNode[] = [
    circle("completion-circle", missingCircleX, missingCircleY, circleRadius, false, "completion-circle"),
    ...arrowNodes("completion-arrow", arrowCenterX, arrowCenterY, requiredDirection, "completion-arrow", 16),
  ];

  const extraCircle = circle(
    "extra-completion-circle",
    Math.min(PATCH_SIZE - 4, missingCircleX + extraOffset),
    missingCircleY,
    Math.max(2.1, circleRadius - 0.4),
    false,
    "completion-circle",
  );

  return {
    contextNodes,
    correctNodes,
    distractors: [
      {
        misconception: "COMPONENT_COUNT_ERROR",
        nodes: [
          circle("completion-circle", missingCircleX, missingCircleY, circleRadius, false, "completion-circle"),
          extraCircle,
          ...arrowNodes("completion-arrow", arrowCenterX, arrowCenterY, requiredDirection, "completion-arrow", 16),
        ],
      },
      {
        misconception: "ARROW_ORIENTATION_ERROR",
        nodes: [
          circle("completion-circle", missingCircleX, missingCircleY, circleRadius, false, "completion-circle"),
          ...arrowNodes("completion-arrow", arrowCenterX, arrowCenterY, referenceDirection, "completion-arrow", 16),
        ],
      },
      {
        misconception: "COUNT_AND_ORIENTATION_ERROR",
        nodes: [
          circle("completion-circle", missingCircleX, missingCircleY, circleRadius, false, "completion-circle"),
          { ...extraCircle, id: "extra-completion-circle-both" },
          ...arrowNodes("completion-arrow", arrowCenterX, arrowCenterY, referenceDirection, "completion-arrow", 16),
        ],
      },
    ],
    difficulty: "Medium",
    observation: "Two circles are already visible on one straight row, leaving the middle position inside the blank, and a reference arrow is shown above the blank.",
    rule: "The completed figure must contain three circles on the row, and the second arrow must point opposite to the reference arrow.",
    application: "Add exactly one circle in the missing middle position and choose the arrow that faces the opposite direction.",
    ruleSummary: "Complete both independent properties: total component count and opposite arrow orientation.",
    sourceAnchor: "SSC MTS Previous Year Paper 66, 14-Oct-2017 Shift 3: solution identifies three circles and arrows in opposite directions.",
    propertyEvidence: {
      referenceArrowDirection: referenceDirection,
      requiredArrowDirection: requiredDirection,
      correctGlobalCircleCount: 3,
    },
  };
}

function buildShapeContactStateMaterial(rng: SpatialSeededRandom): SourceGapMaterial {
  const radius = rng.pick([5, 5.5, 6] as const);
  const leftY = 44 + rng.int(-2, 2);
  const topX = 44 + rng.int(-2, 2);
  const rightY = leftY;
  const bottomX = topX;
  const guideOffset = rng.int(-2, 2);
  const localGuide = 24 + guideOffset;
  const leftPartner = { x: radius, y: leftY - PATCH_ORIGIN.y };
  const topPartner = { x: topX - PATCH_ORIGIN.x, y: radius };

  const contextNodes: SpatialNode[] = [
    circle("left-contact-filled", PATCH_ORIGIN.x - radius, leftY, radius, true, "contact-reference-filled"),
    circle("top-contact-outline", topX, PATCH_ORIGIN.y - radius, radius, false, "contact-reference-outline"),
    circle("right-contact-filled-a", 72, rightY, radius, true, "contact-reference-filled"),
    circle("right-contact-filled-b", 72 + radius * 2, rightY, radius, true, "contact-reference-filled"),
    circle("bottom-contact-outline-a", bottomX, 72, radius, false, "contact-reference-outline"),
    circle("bottom-contact-outline-b", bottomX, 72 + radius * 2, radius, false, "contact-reference-outline"),
    line("shape-guide-left", 18, PATCH_ORIGIN.y + localGuide, PATCH_ORIGIN.x, PATCH_ORIGIN.y + localGuide, "shape-guide"),
    line("shape-guide-top", PATCH_ORIGIN.x + localGuide, 18, PATCH_ORIGIN.x + localGuide, PATCH_ORIGIN.y, "shape-guide"),
  ];

  const correctGuide = [
    line("shape-horizontal", 0, localGuide, localGuide, localGuide, "orthogonal-corner"),
    line("shape-vertical", localGuide, localGuide, localGuide, 0, "orthogonal-corner"),
  ];
  const correctNodes: SpatialNode[] = [
    circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, true, "contact-partner-filled"),
    circle("top-contact-partner", topPartner.x, topPartner.y, radius, false, "contact-partner-outline"),
    ...correctGuide,
  ];

  const slant = rng.pick([5, 6, 7] as const);
  const shapeClassError = [
    line("shape-horizontal", 0, localGuide, localGuide, localGuide - slant, "slanted-corner"),
    line("shape-vertical", localGuide, localGuide - slant, localGuide, 0, "slanted-corner"),
  ];
  const flippedGuide = [
    line("shape-horizontal", 0, PATCH_SIZE - localGuide, localGuide, PATCH_SIZE - localGuide, "flipped-corner"),
    line("shape-vertical", localGuide, PATCH_SIZE - localGuide, localGuide, PATCH_SIZE, "flipped-corner"),
  ];

  return {
    contextNodes,
    correctNodes,
    distractors: [
      {
        misconception: "SHAPE_CLASS_ERROR",
        nodes: [
          circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, true, "contact-partner-filled"),
          circle("top-contact-partner", topPartner.x, topPartner.y, radius, false, "contact-partner-outline"),
          ...shapeClassError,
        ],
      },
      {
        misconception: "CONTACT_STATE_ERROR",
        nodes: [
          circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, false, "contact-partner-outline"),
          circle("top-contact-partner", topPartner.x, topPartner.y, radius, true, "contact-partner-filled"),
          ...correctGuide.map((node) => ({ ...node, id: `state-wrong-${node.id}` })),
        ],
      },
      {
        misconception: "VERTICAL_FLIP_ERROR",
        nodes: [
          circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, true, "contact-partner-filled"),
          circle("top-contact-partner", topPartner.x, topPartner.y, radius, false, "contact-partner-outline"),
          ...flippedGuide,
        ],
      },
    ],
    difficulty: "Hard",
    observation: "The visible reference pairs show that touching filled circles stay filled together and touching outline circles stay outline together; two straight guides also enter the blank at right angles.",
    rule: "The missing piece must preserve the contact state and continue the square-like right-angle corner without changing it into a slanted shape or flipping it vertically.",
    application: "Match each touching circle to the fill state of its visible partner, then connect the two guide entries with the same orthogonal corner.",
    ruleSummary: "Satisfy geometry and visual state together: matching contact fills, orthogonal shape class, and no vertical flip.",
    sourceAnchor: "SSC GD Constable Official Paper, 05-Mar-2024 Shift 1: distractors are rejected for rhombus-vs-square shape, shaded/non-shaded contact and vertical flip.",
    propertyEvidence: {
      contactRule: "MATCH_FILL_STATE",
      shapeRule: "ORTHOGONAL_CORNER",
      flipRule: "NO_VERTICAL_FLIP",
    },
  };
}

function materialForPrototype(prototypeId: FigureCompletionSourceGapPrototypeV1, rng: SpatialSeededRandom): SourceGapMaterial {
  switch (prototypeId) {
    case "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION":
      return buildComponentCountOrientationMaterial(rng);
    case "FGC-PROT-10-SHAPE-CONTACT-STATE":
      return buildShapeContactStateMaterial(rng);
  }
}

export function generateFigureCompletionSourceGapQuestionV1(request: {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionSourceGapQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 source-gap discovery requires a non-empty seed.");
  const rng = new SpatialSeededRandom(`FGC-001:${request.prototypeId}:${request.seed}:SOURCE-GAP-V1`);
  const material = materialForPrototype(request.prototypeId, rng);

  const stimulusScene = buildStimulus(`fgc-source-gap-stimulus:${request.prototypeId}:${request.seed}`, material.contextNodes);
  const fullScene = composeFullScene(`fgc-source-gap-full:${request.prototypeId}:${request.seed}`, material.contextNodes, material.correctNodes);
  const rawOptions: FigureCompletionSourceGapOptionV1[] = [
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
  if (!semanticUniqueness.ok) throw new Error(`${request.prototypeId}: semantically equivalent source-gap options.`);
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptualUniqueness.ok) throw new Error(`${request.prototypeId}: perceptually equivalent source-gap options.`);

  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionSourceGapOptionV1[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === desired) options.push(rawOptions[0]!);
    else options.push(wrong[wrongIndex++]!);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(fullScene);
  const reconstructedFingerprints = options.map((option, index) => spatialSceneSemanticFingerprint(
    composeFullScene(`fgc-source-gap-reconstructed:${request.seed}:${index}`, material.contextNodes, option.scene.nodes),
  ));
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desired) {
    throw new Error(`${request.prototypeId}: source-gap completion oracle did not identify exactly the intended option.`);
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
    version: FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V1,
    chapterCode: "FGC-001",
    prototypeId: request.prototypeId,
    permanentQlId: null,
    seed: request.seed,
    difficulty: material.difficulty,
    stem: "Choose the option that correctly completes the missing part of the figure.",
    stimulusScene,
    options,
    correctOptionIndex: desired,
    answer,
    explanation: {
      observation: material.observation,
      rule: material.rule,
      application: material.application,
      check: `Option ${answer} is the only piece that satisfies every required visible property at the same time.`,
    },
    solverEvidence: {
      patchOrigin: { ...PATCH_ORIGIN },
      patchSize: PATCH_SIZE,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      ruleSummary: material.ruleSummary,
      sourceAnchor: material.sourceAnchor,
      propertyEvidence: material.propertyEvidence,
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
