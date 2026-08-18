import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  FGC_001_DISCOVERY_VERSION_V1,
  FGC_001_PROTOTYPES_V1,
  type FigureCompletionMisconceptionV1,
  type FigureCompletionOptionV1,
  type FigureCompletionPrototypeV1,
  type FigureCompletionQuestionV1,
} from "./figure-completion-discovery-v1";
import { generateFigureCompletionDiscoveryQuestionV1Remediated } from "./figure-completion-discovery-v1-remediated";

export { FGC_001_PROTOTYPES_V1 };
export type { FigureCompletionPrototypeV1, FigureCompletionQuestionV1 };

const PATCH_ORIGIN = { x: 34, y: 34 } as const;
const PATCH_SIZE = 32;
const STIMULUS_VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW_BOX = { minX: 0, minY: 0, width: PATCH_SIZE, height: PATCH_SIZE } as const;
const BASE_STYLE = {
  stroke: "currentColor",
  strokeWidth: 2.5,
  fill: "none",
  lineCap: "round" as const,
  lineJoin: "round" as const,
};

interface PrototypeMaterialV2 {
  contextNodes: SpatialNode[];
  correct: SpatialNode[];
  distractors: Array<{
    misconception: Exclude<FigureCompletionMisconceptionV1, "CORRECT_FRAGMENT">;
    nodes: SpatialNode[];
  }>;
  visibleEntryCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ruleSummary: string;
  observation: string;
  application: string;
}

function line(id: string, x1: number, y1: number, x2: number, y2: number, role = "figure-line"): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    role,
    style: { ...BASE_STYLE },
  };
}

function polyline(id: string, points: SpatialPoint[], role = "figure-line"): SpatialNode {
  return {
    kind: "polyline",
    id,
    points,
    role,
    style: { ...BASE_STYLE },
  };
}

function circle(id: string, x: number, y: number, radius = 2.2, role = "marker"): SpatialNode {
  return {
    kind: "circle",
    id,
    center: { x, y },
    radius,
    role,
    style: { ...BASE_STYLE, fill: "currentColor" },
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

function outerFrame(): SpatialNode {
  return {
    kind: "polygon",
    id: "outer-frame",
    points: [
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      { x: 95, y: 95 },
      { x: 5, y: 95 },
    ],
    role: "figure-frame",
    layer: -10,
    style: { stroke: "currentColor", strokeWidth: 1.5, fill: "none" },
  };
}

function boundaryNode(): SpatialNode {
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
      strokeWidth: 1.4,
      fill: "none",
      dashArray: [4, 3],
    },
  };
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

function buildStimulus(id: string, contextNodes: SpatialNode[]): SpatialScene {
  return scene(id, [outerFrame(), ...contextNodes, boundaryNode()]);
}

function composeCoreScene(id: string, contextNodes: SpatialNode[], fragmentNodes: SpatialNode[]): SpatialScene {
  return scene(id, [
    outerFrame(),
    ...contextNodes,
    ...fragmentNodes.map((node) => translateNode(node, PATCH_ORIGIN.x, PATCH_ORIGIN.y, "placed-")),
  ]);
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-option-v2:${seed}:${label}`, nodes, true);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

function extendLineY(boundaryY: number, slope: number, boundaryX: number, targetX: number): number {
  return boundaryY + slope * (targetX - boundaryX);
}

function buildStraightContinuityV2(rng: SpatialSeededRandom): PrototypeMaterialV2 {
  const y1 = rng.int(8, 12);
  const y2 = rng.int(21, 25);
  const sign = rng.pick([-1, 1] as const);
  const d1 = sign * rng.pick([4, 6] as const);
  const d2 = sign * rng.pick([5, 7] as const);
  const leftX1 = rng.int(9, 14);
  const leftX2 = rng.int(14, 19);
  const rightX1 = rng.int(88, 94);
  const rightX2 = rng.int(84, 92);
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const rightBoundaryX = gx + PATCH_SIZE;
  const slope1 = d1 / PATCH_SIZE;
  const slope2 = d2 / PATCH_SIZE;

  const correct = [
    line("f1", 0, y1, PATCH_SIZE, y1 + d1),
    line("f2", 0, y2, PATCH_SIZE, y2 + d2),
  ];
  const contextNodes = [
    line("left-1", leftX1, extendLineY(gy + y1, slope1, gx, leftX1), gx, gy + y1),
    line("right-1", rightBoundaryX, gy + y1 + d1, rightX1, extendLineY(gy + y1 + d1, slope1, rightBoundaryX, rightX1)),
    line("left-2", leftX2, extendLineY(gy + y2, slope2, gx, leftX2), gx, gy + y2),
    line("right-2", rightBoundaryX, gy + y2 + d2, rightX2, extendLineY(gy + y2 + d2, slope2, rightBoundaryX, rightX2)),
  ];

  return {
    contextNodes,
    correct,
    distractors: [
      {
        misconception: "CROSSED_ENDPOINTS",
        nodes: [line("f1", 0, y1, PATCH_SIZE, y2 + d2), line("f2", 0, y2, PATCH_SIZE, y1 + d1)],
      },
      {
        misconception: "REVERSED_DIRECTION",
        nodes: [line("f1", 0, y1, PATCH_SIZE, y1 - d1), line("f2", 0, y2, PATCH_SIZE, y2 - d2)],
      },
      {
        misconception: "PARALLEL_SUBSTITUTION",
        nodes: [line("f1", 0, y1, PATCH_SIZE, y1), line("f2", 0, y2, PATCH_SIZE, y2)],
      },
    ],
    visibleEntryCount: 4,
    difficulty: "Easy",
    ruleSummary: "Each broken stroke must continue through the blank without changing its angle.",
    observation: "Two separate sloping lines reach the missing square and reappear on the other side.",
    application: "Extend each line at the same visible angle and keep the upper and lower strokes separate.",
  };
}

function buildBentPathContinuityV2(rng: SpatialSeededRandom): PrototypeMaterialV2 {
  const topStart = rng.int(10, 13);
  const bottomStart = rng.int(21, 24);
  const direction = rng.pick([-1, 1] as const);
  const endShift = direction * rng.pick([5, 6] as const);
  const topEnd = topStart + endShift;
  const bottomEnd = bottomStart - endShift;
  const topRise = rng.int(6, 8);
  const bottomFall = rng.int(5, 7);
  const topMid = topStart - topRise;
  const bottomMid = bottomStart + bottomFall;
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const rightBoundaryX = gx + PATCH_SIZE;
  const leftXTop = rng.int(9, 13);
  const leftXBottom = rng.int(11, 16);
  const rightXTop = rng.int(88, 94);
  const rightXBottom = rng.int(86, 92);

  const topSlopeIn = (topMid - topStart) / 16;
  const topSlopeOut = (topEnd - topMid) / 16;
  const bottomSlopeIn = (bottomMid - bottomStart) / 16;
  const bottomSlopeOut = (bottomEnd - bottomMid) / 16;

  const correct = [
    polyline("curve-1", [{ x: 0, y: topStart }, { x: 16, y: topMid }, { x: 32, y: topEnd }]),
    polyline("curve-2", [{ x: 0, y: bottomStart }, { x: 16, y: bottomMid }, { x: 32, y: bottomEnd }]),
  ];
  const contextNodes = [
    line("curve-left-1", leftXTop, extendLineY(gy + topStart, topSlopeIn, gx, leftXTop), gx, gy + topStart),
    line("curve-right-1", rightBoundaryX, gy + topEnd, rightXTop, extendLineY(gy + topEnd, topSlopeOut, rightBoundaryX, rightXTop)),
    line("curve-left-2", leftXBottom, extendLineY(gy + bottomStart, bottomSlopeIn, gx, leftXBottom), gx, gy + bottomStart),
    line("curve-right-2", rightBoundaryX, gy + bottomEnd, rightXBottom, extendLineY(gy + bottomEnd, bottomSlopeOut, rightBoundaryX, rightXBottom)),
  ];

  const wrongTopMid = topStart + topRise;
  const wrongBottomMid = bottomStart - bottomFall;
  return {
    contextNodes,
    correct,
    distractors: [
      {
        misconception: "WRONG_CURVATURE",
        nodes: [
          polyline("curve-1", [{ x: 0, y: topStart }, { x: 16, y: wrongTopMid }, { x: 32, y: topEnd }]),
          polyline("curve-2", [{ x: 0, y: bottomStart }, { x: 16, y: wrongBottomMid }, { x: 32, y: bottomEnd }]),
        ],
      },
      {
        misconception: "CURVE_PEAK_SHIFT",
        nodes: [
          polyline("curve-1", [{ x: 0, y: topStart }, { x: 24, y: topMid }, { x: 32, y: topEnd }]),
          polyline("curve-2", [{ x: 0, y: bottomStart }, { x: 24, y: bottomMid }, { x: 32, y: bottomEnd }]),
        ],
      },
      {
        misconception: "CURVE_DIRECTION_REVERSAL",
        nodes: [
          polyline("curve-1", [{ x: 0, y: topEnd }, { x: 16, y: topMid }, { x: 32, y: topStart }]),
          polyline("curve-2", [{ x: 0, y: bottomEnd }, { x: 16, y: bottomMid }, { x: 32, y: bottomStart }]),
        ],
      },
    ],
    visibleEntryCount: 4,
    difficulty: "Medium",
    ruleSummary: "Both bent paths must enter and leave the blank at the same visible angles, with their turns occurring inside the missing region.",
    observation: "Two broken paths enter the blank from the left and reappear on the right with clear incoming and outgoing directions.",
    application: "Follow each incoming direction to its turn, then leave the blank in the direction shown by the matching right-hand segment.",
  };
}

function extrapolateFromCenter(boundary: SpatialPoint, center: SpatialPoint, scale: number): SpatialPoint {
  return {
    x: boundary.x + (boundary.x - center.x) * scale,
    y: boundary.y + (boundary.y - center.y) * scale,
  };
}

function buildJunctionContinuityV2(rng: SpatialSeededRandom): PrototypeMaterialV2 {
  const centerX = rng.int(14, 18);
  const centerY = rng.int(14, 18);
  const topX = rng.int(7, 11);
  const bottomX = rng.int(21, 25);
  const scale = rng.pick([0.7, 0.8, 0.9] as const);
  const centerGlobal = { x: PATCH_ORIGIN.x + centerX, y: PATCH_ORIGIN.y + centerY };
  const boundaries = {
    left: { x: PATCH_ORIGIN.x, y: PATCH_ORIGIN.y + 8 },
    right: { x: PATCH_ORIGIN.x + PATCH_SIZE, y: PATCH_ORIGIN.y + 9 },
    top: { x: PATCH_ORIGIN.x + topX, y: PATCH_ORIGIN.y },
    bottom: { x: PATCH_ORIGIN.x + bottomX, y: PATCH_ORIGIN.y + PATCH_SIZE },
  };

  const correct = [
    line("j1", 0, 8, centerX, centerY),
    line("j2", PATCH_SIZE, 9, centerX, centerY),
    line("j3", topX, 0, centerX, centerY),
    line("j4", bottomX, PATCH_SIZE, centerX, centerY),
  ];
  const leftOuter = extrapolateFromCenter(boundaries.left, centerGlobal, scale);
  const rightOuter = extrapolateFromCenter(boundaries.right, centerGlobal, scale);
  const topOuter = extrapolateFromCenter(boundaries.top, centerGlobal, scale);
  const bottomOuter = extrapolateFromCenter(boundaries.bottom, centerGlobal, scale);
  const contextNodes = [
    line("left-entry", leftOuter.x, leftOuter.y, boundaries.left.x, boundaries.left.y),
    line("right-entry", boundaries.right.x, boundaries.right.y, rightOuter.x, rightOuter.y),
    line("top-entry", topOuter.x, topOuter.y, boundaries.top.x, boundaries.top.y),
    line("bottom-entry", boundaries.bottom.x, boundaries.bottom.y, bottomOuter.x, bottomOuter.y),
  ];

  return {
    contextNodes,
    correct,
    distractors: [
      {
        misconception: "PAIRWISE_CONNECTION",
        nodes: [
          line("j1", 0, 8, PATCH_SIZE, 9),
          line("j2", topX, 0, bottomX, PATCH_SIZE),
          line("j3", 1, 27, 10, 18),
          line("j4", 22, 18, 31, 27),
        ],
      },
      {
        misconception: "OFFSET_JUNCTION",
        nodes: [
          line("j1", 0, 8, centerX + 6, centerY - 5),
          line("j2", PATCH_SIZE, 9, centerX + 6, centerY - 5),
          line("j3", topX, 0, centerX + 6, centerY - 5),
          line("j4", bottomX, PATCH_SIZE, centerX + 6, centerY - 5),
        ],
      },
      {
        misconception: "WRONG_JUNCTION_ARM",
        nodes: [
          line("j1", 0, 8, centerX, centerY),
          line("j2", PATCH_SIZE, 9, centerX, centerY),
          line("j3", topX, 0, centerX, centerY),
          line("j4", bottomX, PATCH_SIZE, centerX + 7, centerY + 1),
        ],
      },
    ],
    visibleEntryCount: 4,
    difficulty: "Medium",
    ruleSummary: "The four visible arms point toward one common junction inside the missing square.",
    observation: "Four straight arms enter the blank from different sides and their visible directions point toward the same interior meeting point.",
    application: "Extend all four arms without bending them; they must meet at one common junction.",
  };
}

function buildCompoundMarkerV2(rng: SpatialSeededRandom): PrototypeMaterialV2 {
  const y = rng.int(10, 15);
  const delta = rng.pick([-6, -5, -4, 4, 5, 6] as const);
  const markerX = rng.pick([11, 13, 15, 17, 19, 21] as const);
  const spacing = rng.int(22, 27);
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const rightBoundaryX = gx + PATCH_SIZE;
  const slope = delta / PATCH_SIZE;
  const hiddenGlobalX = gx + markerX;
  const hiddenGlobalY = gy + y + slope * markerX;
  const leftMarkerX = hiddenGlobalX - spacing;
  const rightMarkerX = hiddenGlobalX + spacing;
  const leftMarkerY = gy + y + slope * (leftMarkerX - gx);
  const rightMarkerY = gy + y + slope * (rightMarkerX - gx);
  const leftLineX = rng.int(8, 13);
  const rightLineX = rng.int(89, 94);
  const markerY = y + slope * markerX;

  const correct = [
    line("path", 0, y, PATCH_SIZE, y + delta),
    circle("marker", markerX, markerY),
  ];
  const contextNodes = [
    line("path-left", leftLineX, extendLineY(gy + y, slope, gx, leftLineX), gx, gy + y),
    line("path-right", rightBoundaryX, gy + y + delta, rightLineX, extendLineY(gy + y + delta, slope, rightBoundaryX, rightLineX)),
    circle("marker-left", leftMarkerX, leftMarkerY, 2.2),
    circle("marker-right", rightMarkerX, rightMarkerY, 2.2),
  ];

  return {
    contextNodes,
    correct,
    distractors: [
      {
        misconception: "MARKER_WRONG_SIDE",
        nodes: [
          line("path", 0, y, PATCH_SIZE, y + delta),
          circle("marker", PATCH_SIZE - markerX, y + slope * (PATCH_SIZE - markerX)),
        ],
      },
      {
        misconception: "MARKER_WRONG_LEVEL",
        nodes: [
          line("path", 0, y, PATCH_SIZE, y + delta),
          circle("marker", markerX, Math.max(3, Math.min(29, markerY + (delta > 0 ? -7 : 7)))),
        ],
      },
      {
        misconception: "STRUCTURE_ONLY_MARKER_OMITTED",
        nodes: [line("path", 0, y, PATCH_SIZE, y + delta)],
      },
    ],
    visibleEntryCount: 2,
    difficulty: "Hard",
    ruleSummary: "The line must continue at one angle and the missing marker must complete the equal-spacing marker pattern on that line.",
    observation: "A straight sloping line passes through the blank, with one visible marker on each side at equal spacing from the missing middle marker.",
    application: "Continue the line without a kink, then place the missing marker midway between the two visible markers along that same line.",
  };
}

function materialForPrototypeV2(prototypeId: FigureCompletionPrototypeV1, rng: SpatialSeededRandom): PrototypeMaterialV2 | null {
  switch (prototypeId) {
    case "FGC-PROT-01-STRAIGHT-CONTINUITY":
      return buildStraightContinuityV2(rng);
    case "FGC-PROT-02-CURVED-PATH-CONTINUITY":
      return buildBentPathContinuityV2(rng);
    case "FGC-PROT-03-JUNCTION-CONTINUITY":
      return buildJunctionContinuityV2(rng);
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
      return null;
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      return buildCompoundMarkerV2(rng);
  }
}

function generateFromMaterial(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}, material: PrototypeMaterialV2): FigureCompletionQuestionV1 {
  const stimulusScene = buildStimulus(`fgc-stimulus-v2:${request.prototypeId}:${request.seed}`, material.contextNodes);
  const fullScene = composeCoreScene(`fgc-full-v2:${request.prototypeId}:${request.seed}`, material.contextNodes, material.correct);
  const rawOptions: FigureCompletionOptionV1[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", material.correct) },
    ...material.distractors.map((entry) => ({
      misconception: entry.misconception,
      scene: optionScene(request.seed, entry.misconception, entry.nodes),
    })),
  ];

  assertValidSpatialScene(stimulusScene);
  assertValidSpatialScene(fullScene);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));
  const semantic = validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene));
  if (!semantic.ok) throw new Error(`${request.prototypeId}: semantically equivalent completion options.`);
  const perceptual = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptual.ok) throw new Error(`${request.prototypeId}: perceptually equivalent completion options.`);

  const rng = new SpatialSeededRandom(`FGC-001:V2:ORDER:${request.prototypeId}:${request.seed}`);
  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionOptionV1[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === desired) options.push(rawOptions[0] as FigureCompletionOptionV1);
    else options.push(wrong[wrongIndex++] as FigureCompletionOptionV1);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(fullScene);
  const reconstructedFingerprints = options.map((option, index) =>
    spatialSceneSemanticFingerprint(
      composeCoreScene(`fgc-reconstructed-v2:${request.seed}:${index}`, material.contextNodes, option.scene.nodes),
    ),
  );
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== desired) {
    throw new Error(`${request.prototypeId}: completion oracle did not identify exactly the intended option.`);
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
    version: FGC_001_DISCOVERY_VERSION_V1,
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
      rule: material.ruleSummary,
      application: material.application,
      check: `Option ${answer} is the only piece that completes every visible line and marker relation without changing the surrounding figure.`,
    },
    solverEvidence: {
      patchOrigin: { ...PATCH_ORIGIN },
      patchSize: PATCH_SIZE,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      visibleEntryCount: material.visibleEntryCount,
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

export function generateFigureCompletionDiscoveryQuestionV2(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 discovery V2 requires a non-empty seed.");
  if (request.prototypeId === "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY") {
    return generateFigureCompletionDiscoveryQuestionV1Remediated(request);
  }
  const rng = new SpatialSeededRandom(`FGC-001:V2:${request.prototypeId}:${request.seed}`);
  const material = materialForPrototypeV2(request.prototypeId, rng);
  if (!material) throw new Error(`${request.prototypeId}: no V2 material authority.`);
  return generateFromMaterial(request, material);
}
