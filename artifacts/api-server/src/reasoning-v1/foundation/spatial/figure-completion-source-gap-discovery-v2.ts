import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialPoint, SpatialScene, SpatialStyle } from "./types";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  type FigureCompletionSourceGapPrototypeV1,
  type FigureCompletionSourceGapMisconceptionV1,
} from "./figure-completion-source-gap-discovery-v1";

export { FGC_001_SOURCE_GAP_PROTOTYPES_V1 };
export type { FigureCompletionSourceGapPrototypeV1 };

export const FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V2 = "FGC-001-SOURCE-GAP-DISCOVERY-V2" as const;

export interface FigureCompletionSourceGapOptionV2 {
  misconception: FigureCompletionSourceGapMisconceptionV1;
  scene: SpatialScene;
}

export interface FigureCompletionSourceGapQuestionV2 {
  version: typeof FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V2;
  chapterCode: "FGC-001";
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  permanentQlId: null;
  seed: string;
  difficulty: "Medium" | "Hard";
  stem: string;
  stimulusScene: SpatialScene;
  options: FigureCompletionSourceGapOptionV2[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: { observation: string; rule: string; application: string; check: string };
  solverEvidence: {
    patchOrigin: { x: number; y: number };
    patchSize: number;
    fullSceneFingerprint: string;
    reconstructedFingerprints: string[];
    matchingOptionIndexes: number[];
    ruleSummary: string;
    sourceAnchor: string;
    propertyEvidence: {
      referenceArrowDirection?: "LEFT" | "RIGHT";
      requiredArrowDirection?: "LEFT" | "RIGHT";
      correctGlobalCircleCount?: number;
      contactRule?: "MATCH_FILL_STATE";
      shapeRule?: "ORTHOGONAL_CORNER";
      flipRule?: "NO_VERTICAL_FLIP";
      minimumIndependentFeatureSeparation?: number;
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
const MAIN_VIEW = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW = { minX: 0, minY: 0, width: 32, height: 32 } as const;
const STYLE: SpatialStyle = {
  stroke: "currentColor",
  strokeWidth: 2.4,
  fill: "none",
  lineCap: "round",
  lineJoin: "round",
};

type HorizontalDirection = "LEFT" | "RIGHT";

interface MaterialV2 {
  context: SpatialNode[];
  correct: SpatialNode[];
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
  propertyEvidence: FigureCompletionSourceGapQuestionV2["solverEvidence"]["propertyEvidence"];
}

function line(id: string, x1: number, y1: number, x2: number, y2: number, role = "figure-line"): SpatialNode {
  return { kind: "line", id, start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, role, style: { ...STYLE } };
}

function circle(id: string, x: number, y: number, radius: number, filled: boolean, role: string): SpatialNode {
  return {
    kind: "circle",
    id,
    center: { x, y },
    radius,
    role,
    style: { ...STYLE, fill: filled ? "currentColor" : "none" },
  };
}

function polygon(id: string, points: SpatialPoint[], role: string): SpatialNode {
  return { kind: "polygon", id, points, role, style: { ...STYLE } };
}

function outerFrame(): SpatialNode {
  return polygon("outer-frame", [
    { x: 5, y: 5 }, { x: 95, y: 5 }, { x: 95, y: 95 }, { x: 5, y: 95 },
  ], "figure-frame");
}

function missingBoundary(): SpatialNode {
  return {
    kind: "polygon",
    id: "missing-box",
    points: [
      { x: 34, y: 34 }, { x: 66, y: 34 }, { x: 66, y: 66 }, { x: 34, y: 66 },
    ],
    role: "missing-region",
    layer: 20,
    style: { stroke: "currentColor", strokeWidth: 1.3, fill: "none", dashArray: [4, 3] },
  };
}

function scene(id: string, nodes: SpatialNode[], option = false): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: option ? { ...OPTION_VIEW } : { ...MAIN_VIEW },
    nodes,
    metadata: { chapterCode: "FGC-001", semanticRole: option ? "completion-option" : "completion-stimulus" },
  };
}

function translateNode(node: SpatialNode, dx: number, dy: number, prefix: string): SpatialNode {
  const common = { ...node, id: `${prefix}${node.id}` };
  switch (node.kind) {
    case "line": return { ...common, kind: "line", start: { x: node.start.x + dx, y: node.start.y + dy }, end: { x: node.end.x + dx, y: node.end.y + dy } };
    case "circle": return { ...common, kind: "circle", center: { x: node.center.x + dx, y: node.center.y + dy } };
    case "polygon": return { ...common, kind: "polygon", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "polyline": return { ...common, kind: "polyline", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "arc": return { ...common, kind: "arc", center: { x: node.center.x + dx, y: node.center.y + dy } };
  }
}

function buildStimulus(id: string, context: SpatialNode[]): SpatialScene {
  return scene(id, [outerFrame(), ...context, missingBoundary()]);
}

function compose(id: string, context: SpatialNode[], fragment: SpatialNode[]): SpatialScene {
  return scene(id, [outerFrame(), ...context, ...fragment.map((node) => translateNode(node, 34, 34, "placed-"))]);
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-source-gap-v2-option:${seed}:${label}`, nodes, true);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

function opposite(direction: HorizontalDirection): HorizontalDirection {
  return direction === "LEFT" ? "RIGHT" : "LEFT";
}

function arrowNodes(idPrefix: string, centerX: number, centerY: number, direction: HorizontalDirection, length = 16, role = "arrow"): SpatialNode[] {
  const half = length / 2;
  const head = 4;
  const tipX = direction === "RIGHT" ? centerX + half : centerX - half;
  const tailX = direction === "RIGHT" ? centerX - half : centerX + half;
  const headX = direction === "RIGHT" ? tipX - head : tipX + head;
  return [
    line(`${idPrefix}-shaft`, tailX, centerY, tipX, centerY, role),
    line(`${idPrefix}-head-a`, tipX, centerY, headX, centerY - head, role),
    line(`${idPrefix}-head-b`, tipX, centerY, headX, centerY + head, role),
  ];
}

function buildP09(rng: SpatialSeededRandom): MaterialV2 {
  const referenceDirection = rng.pick(["LEFT", "RIGHT"] as const);
  const requiredArrowDirection = opposite(referenceDirection);
  const radius = rng.pick([2.6, 3, 3.4] as const);
  const globalRowY = rng.int(48, 51);
  const localCircleY = globalRowY - 34;
  const localCircleX = rng.int(15, 18);
  const extraCircleX = rng.int(6, 9);
  const arrowY = rng.int(25, 27);
  const arrowX = rng.int(18, 20);
  const referenceY = rng.int(19, 22);
  const leftX = rng.int(15, 19);
  const rightX = rng.int(81, 85);

  const context = [
    circle("count-left", leftX, globalRowY, radius, false, "count-circle"),
    circle("count-right", rightX, globalRowY, radius, false, "count-circle"),
    line("row-guide-left", leftX + radius + 3, globalRowY, 34, globalRowY, "alignment-guide"),
    line("row-guide-right", 66, globalRowY, rightX - radius - 3, globalRowY, "alignment-guide"),
    ...arrowNodes("reference-arrow", 50 + rng.int(-2, 2), referenceY, referenceDirection, 16, "reference-arrow"),
  ];

  const correct = [
    circle("completion-circle", localCircleX, localCircleY, radius, false, "completion-circle"),
    ...arrowNodes("completion-arrow", arrowX, arrowY, requiredArrowDirection, 14, "completion-arrow"),
  ];
  const extra = circle("extra-circle", extraCircleX, localCircleY, Math.max(2.2, radius - 0.4), false, "completion-circle");

  return {
    context,
    correct,
    distractors: [
      {
        misconception: "COMPONENT_COUNT_ERROR",
        nodes: [
          circle("completion-circle", localCircleX, localCircleY, radius, false, "completion-circle"),
          extra,
          ...arrowNodes("completion-arrow", arrowX, arrowY, requiredArrowDirection, 14, "completion-arrow"),
        ],
      },
      {
        misconception: "ARROW_ORIENTATION_ERROR",
        nodes: [
          circle("completion-circle", localCircleX, localCircleY, radius, false, "completion-circle"),
          ...arrowNodes("completion-arrow", arrowX, arrowY, referenceDirection, 14, "completion-arrow"),
        ],
      },
      {
        misconception: "COUNT_AND_ORIENTATION_ERROR",
        nodes: [
          circle("completion-circle", localCircleX, localCircleY, radius, false, "completion-circle"),
          { ...extra, id: "extra-circle-both" },
          ...arrowNodes("completion-arrow", arrowX, arrowY, referenceDirection, 14, "completion-arrow"),
        ],
      },
    ],
    difficulty: "Medium",
    observation: "Two circles are visible on one straight row, leaving the missing middle component inside the blank; a reference arrow is also visible above the blank.",
    rule: "The complete figure must contain three circles on that row, and the arrow in the missing piece must point opposite to the reference arrow.",
    application: "Place exactly one circle on the row and keep the arrow as the opposite horizontal direction.",
    ruleSummary: "Complete the component count and the opposite arrow direction together.",
    sourceAnchor: "SSC MTS Previous Year Paper 66, 14-Oct-2017 Shift 3: the published solution identifies three circles and arrows in opposite directions.",
    propertyEvidence: {
      referenceArrowDirection: referenceDirection,
      requiredArrowDirection,
      correctGlobalCircleCount: 3,
      minimumIndependentFeatureSeparation: 7,
    },
  };
}

function buildP10(rng: SpatialSeededRandom): MaterialV2 {
  const radius = rng.pick([5, 5.5, 6] as const);
  const leftY = rng.int(43, 46);
  const topX = rng.int(55, 58);
  const leftPartner = { x: radius, y: leftY - 34 };
  const topPartner = { x: topX - 34, y: radius };
  const guideY = rng.int(25, 27);
  const guideX = rng.int(13, 15);
  const separation = Math.hypot(leftPartner.x - topPartner.x, leftPartner.y - topPartner.y);
  if (separation < radius * 2 + 3) {
    throw new Error("FGC-PROT-10-SHAPE-CONTACT-STATE: perceptually equivalent source-gap options independent feature separation too small.");
  }

  const context = [
    circle("left-contact-filled", 34 - radius, leftY, radius, true, "contact-reference-filled"),
    circle("top-contact-outline", topX, 34 - radius, radius, false, "contact-reference-outline"),
    circle("right-filled-a", 72, leftY, radius, true, "contact-reference-filled"),
    circle("right-filled-b", 72 + radius * 2, leftY, radius, true, "contact-reference-filled"),
    circle("bottom-outline-a", topX, 72, radius, false, "contact-reference-outline"),
    circle("bottom-outline-b", topX, 72 + radius * 2, radius, false, "contact-reference-outline"),
    line("shape-guide-left", 18, 34 + guideY, 34, 34 + guideY, "shape-guide"),
    line("shape-guide-top", 34 + guideX, 18, 34 + guideX, 34, "shape-guide"),
  ];

  const correctGuide = [
    line("shape-horizontal", 0, guideY, guideX, guideY, "orthogonal-corner"),
    line("shape-vertical", guideX, guideY, guideX, 0, "orthogonal-corner"),
  ];
  const correct = [
    circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, true, "contact-partner-filled"),
    circle("top-contact-partner", topPartner.x, topPartner.y, radius, false, "contact-partner-outline"),
    ...correctGuide,
  ];

  const slant = rng.int(4, 6);
  const slantedGuide = [
    line("shape-horizontal", 0, guideY, guideX, guideY - slant, "slanted-corner"),
    line("shape-vertical", guideX, guideY - slant, guideX, 0, "slanted-corner"),
  ];
  const flippedY = PATCH_SIZE - guideY;
  const flippedGuide = [
    line("shape-horizontal", 0, flippedY, guideX, flippedY, "flipped-corner"),
    line("shape-vertical", guideX, flippedY, guideX, PATCH_SIZE, "flipped-corner"),
  ];

  return {
    context,
    correct,
    distractors: [
      {
        misconception: "SHAPE_CLASS_ERROR",
        nodes: [
          circle("left-contact-partner", leftPartner.x, leftPartner.y, radius, true, "contact-partner-filled"),
          circle("top-contact-partner", topPartner.x, topPartner.y, radius, false, "contact-partner-outline"),
          ...slantedGuide,
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
    observation: "The completed reference pairs on the right and bottom show that touching filled circles stay filled together and touching outline circles stay outline together; two straight guides also enter the blank.",
    rule: "Match each missing contact partner to the fill state of the visible circle it touches, and continue the two guide lines as one square-like right-angle corner without slanting or vertically flipping it.",
    application: "Use a filled partner at the left contact, an outline partner at the top contact, and the unflipped orthogonal corner joining the visible guides.",
    ruleSummary: "Satisfy contact state and shape geometry together: matching fills, an orthogonal corner, and no vertical flip.",
    sourceAnchor: "SSC GD Constable Official Paper, 05-Mar-2024 Shift 1: published distractor analysis identifies rhombus-vs-square shape, shaded/non-shaded contact and vertical flip errors.",
    propertyEvidence: {
      contactRule: "MATCH_FILL_STATE",
      shapeRule: "ORTHOGONAL_CORNER",
      flipRule: "NO_VERTICAL_FLIP",
      minimumIndependentFeatureSeparation: separation,
    },
  };
}

function materialFor(prototypeId: FigureCompletionSourceGapPrototypeV1, rng: SpatialSeededRandom): MaterialV2 {
  return prototypeId === "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION" ? buildP09(rng) : buildP10(rng);
}

export function generateFigureCompletionSourceGapQuestionV2(request: {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionSourceGapQuestionV2 {
  if (!request.seed.trim()) throw new Error("FGC-001 source-gap V2 requires a non-empty seed.");
  const rng = new SpatialSeededRandom(`FGC-001:${request.prototypeId}:${request.seed}:SOURCE-GAP-V2`);
  const material = materialFor(request.prototypeId, rng);
  const stimulusScene = buildStimulus(`fgc-source-gap-v2-stimulus:${request.prototypeId}:${request.seed}`, material.context);
  const fullScene = compose(`fgc-source-gap-v2-full:${request.prototypeId}:${request.seed}`, material.context, material.correct);
  const rawOptions: FigureCompletionSourceGapOptionV2[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", material.correct) },
    ...material.distractors.map((entry) => ({ misconception: entry.misconception, scene: optionScene(request.seed, entry.misconception, entry.nodes) })),
  ];

  assertValidSpatialScene(stimulusScene);
  assertValidSpatialScene(fullScene);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));
  if (!validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene)).ok) {
    throw new Error(`${request.prototypeId}: semantically equivalent source-gap options.`);
  }
  if (!validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene)).ok) {
    throw new Error(`${request.prototypeId}: perceptually equivalent source-gap options.`);
  }

  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionSourceGapOptionV2[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === desired ? rawOptions[0]! : wrong[wrongIndex++]!);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(fullScene);
  const reconstructedFingerprints = options.map((option, index) => spatialSceneSemanticFingerprint(
    compose(`fgc-source-gap-v2-reconstructed:${request.seed}:${index}`, material.context, option.scene.nodes),
  ));
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desired) {
    throw new Error(`${request.prototypeId}: V2 completion oracle did not identify exactly the intended option.`);
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
    version: FGC_001_SOURCE_GAP_DISCOVERY_VERSION_V2,
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
      check: `Option ${answer} is the only piece that satisfies all visible completion rules together.`,
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
