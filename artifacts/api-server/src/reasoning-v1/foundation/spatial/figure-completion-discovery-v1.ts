import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialScene } from "./types";

export const FGC_001_DISCOVERY_VERSION_V1 = "FGC-001-DISCOVERY-V1" as const;

export const FGC_001_PROTOTYPES_V1 = [
  "FGC-PROT-01-STRAIGHT-CONTINUITY",
  "FGC-PROT-02-CURVED-PATH-CONTINUITY",
  "FGC-PROT-03-JUNCTION-CONTINUITY",
  "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY",
  "FGC-PROT-05-COMPOUND-CONTOUR-MARKER",
] as const;

export type FigureCompletionPrototypeV1 = (typeof FGC_001_PROTOTYPES_V1)[number];
export type FigureCompletionMisconceptionV1 =
  | "CORRECT_FRAGMENT"
  | "CROSSED_ENDPOINTS"
  | "REVERSED_DIRECTION"
  | "PARALLEL_SUBSTITUTION"
  | "WRONG_CURVATURE"
  | "CURVE_PEAK_SHIFT"
  | "CURVE_DIRECTION_REVERSAL"
  | "PAIRWISE_CONNECTION"
  | "OFFSET_JUNCTION"
  | "WRONG_JUNCTION_ARM"
  | "OUTER_ONLY_MATCH"
  | "INNER_DIRECTION_ERROR"
  | "CONTOUR_OFFSET"
  | "MARKER_WRONG_SIDE"
  | "MARKER_WRONG_LEVEL"
  | "STRUCTURE_ONLY_MARKER_OMITTED";

export interface FigureCompletionOptionV1 {
  misconception: FigureCompletionMisconceptionV1;
  scene: SpatialScene;
}

export interface FigureCompletionSolverEvidenceV1 {
  patchOrigin: { x: number; y: number };
  patchSize: number;
  fullSceneFingerprint: string;
  reconstructedFingerprints: string[];
  matchingOptionIndexes: number[];
  visibleEntryCount: number;
  ruleSummary: string;
}

export interface FigureCompletionQuestionV1 {
  version: typeof FGC_001_DISCOVERY_VERSION_V1;
  chapterCode: "FGC-001";
  prototypeId: FigureCompletionPrototypeV1;
  permanentQlId: null;
  seed: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  stimulusScene: SpatialScene;
  options: FigureCompletionOptionV1[];
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  solverEvidence: FigureCompletionSolverEvidenceV1;
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

const PATCH_ORIGIN = { x: 58, y: 34 } as const;
const PATCH_SIZE = 32;
const STIMULUS_VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OPTION_VIEW_BOX = { minX: 0, minY: 0, width: PATCH_SIZE, height: PATCH_SIZE } as const;
const BASE_STYLE = { stroke: "currentColor", strokeWidth: 2.5, fill: "none", lineCap: "round" as const, lineJoin: "round" as const };

function line(id: string, x1: number, y1: number, x2: number, y2: number, role = "figure-line"): SpatialNode {
  return { kind: "line", id, start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, role, style: BASE_STYLE };
}

function polyline(id: string, points: Array<{ x: number; y: number }>, role = "figure-line"): SpatialNode {
  return { kind: "polyline", id, points, role, style: BASE_STYLE };
}

function circle(id: string, x: number, y: number, radius = 2.2, role = "marker"): SpatialNode {
  return { kind: "circle", id, center: { x, y }, radius, role, style: { ...BASE_STYLE, fill: "currentColor" } };
}

function scene(id: string, nodes: SpatialNode[], option = false): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: option ? { ...OPTION_VIEW_BOX } : { ...STIMULUS_VIEW_BOX },
    nodes,
    metadata: { chapterCode: "FGC-001", semanticRole: option ? "completion-option" : "completion-stimulus" },
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
    style: { stroke: "currentColor", strokeWidth: 1.4, fill: "none", dashArray: [4, 3] },
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

function translateNode(node: SpatialNode, dx: number, dy: number, idPrefix: string): SpatialNode {
  const common = { ...node, id: `${idPrefix}${node.id}` };
  switch (node.kind) {
    case "line":
      return { ...common, kind: "line", start: { x: node.start.x + dx, y: node.start.y + dy }, end: { x: node.end.x + dx, y: node.end.y + dy } };
    case "circle":
      return { ...common, kind: "circle", center: { x: node.center.x + dx, y: node.center.y + dy } };
    case "polygon":
      return { ...common, kind: "polygon", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "polyline":
      return { ...common, kind: "polyline", points: node.points.map((point) => ({ x: point.x + dx, y: point.y + dy })) };
    case "arc":
      return { ...common, kind: "arc", center: { x: node.center.x + dx, y: node.center.y + dy } };
  }
}

function composeCoreScene(id: string, contextNodes: SpatialNode[], fragmentNodes: SpatialNode[]): SpatialScene {
  return scene(id, [
    outerFrame(),
    ...contextNodes,
    ...fragmentNodes.map((node) => translateNode(node, PATCH_ORIGIN.x, PATCH_ORIGIN.y, "placed-")),
  ]);
}

function buildStimulus(id: string, contextNodes: SpatialNode[]): SpatialScene {
  return scene(id, [outerFrame(), ...contextNodes, boundaryNode()]);
}

interface PrototypeMaterialV1 {
  contextNodes: SpatialNode[];
  correct: SpatialNode[];
  distractors: Array<{ misconception: Exclude<FigureCompletionMisconceptionV1, "CORRECT_FRAGMENT">; nodes: SpatialNode[] }>;
  visibleEntryCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ruleSummary: string;
  observation: string;
  application: string;
}

function buildStraightContinuity(rng: SpatialSeededRandom): PrototypeMaterialV1 {
  const y1 = rng.int(7, 13);
  const y2 = rng.int(20, 26);
  const d1 = rng.pick([-6, -4, 4, 6] as const);
  const d2Choices = [-7, -5, 5, 7].filter((value) => Math.sign(value) !== Math.sign(d1));
  const d2 = rng.pick(d2Choices);
  const correct = [line("f1", 0, y1, 32, y1 + d1), line("f2", 0, y2, 32, y2 + d2)];
  const contextNodes = [
    line("left-1", 10, PATCH_ORIGIN.y + y1 - 9, PATCH_ORIGIN.x, PATCH_ORIGIN.y + y1),
    line("right-1", PATCH_ORIGIN.x + 32, PATCH_ORIGIN.y + y1 + d1, 95, PATCH_ORIGIN.y + y1 + d1 + 3),
    line("left-2", 16, PATCH_ORIGIN.y + y2 + 6, PATCH_ORIGIN.x, PATCH_ORIGIN.y + y2),
    line("right-2", PATCH_ORIGIN.x + 32, PATCH_ORIGIN.y + y2 + d2, 94, PATCH_ORIGIN.y + y2 + d2 - 4),
  ];
  return {
    contextNodes,
    correct,
    distractors: [
      { misconception: "CROSSED_ENDPOINTS", nodes: [line("f1", 0, y1, 32, y2 + d2), line("f2", 0, y2, 32, y1 + d1)] },
      { misconception: "REVERSED_DIRECTION", nodes: [line("f1", 0, y1, 32, y1 - d1), line("f2", 0, y2, 32, y2 - d2)] },
      { misconception: "PARALLEL_SUBSTITUTION", nodes: [line("f1", 0, y1, 32, y1), line("f2", 0, y2, 32, y2)] },
    ],
    visibleEntryCount: 4,
    difficulty: "Easy",
    ruleSummary: "Each visible stroke must enter and leave the missing square with the same continuous direction.",
    observation: "Two broken lines reach the missing square from both sides.",
    application: "Match each left endpoint to the right endpoint that keeps the same stroke direction.",
  };
}

function buildCurvedContinuity(rng: SpatialSeededRandom): PrototypeMaterialV1 {
  const y = rng.int(8, 15);
  const rise = rng.int(7, 11);
  const second = rng.int(21, 26);
  const correct = [
    polyline("curve-1", [{ x: 0, y }, { x: 16, y: y - rise }, { x: 32, y: y + 1 }]),
    polyline("curve-2", [{ x: 0, y: second }, { x: 16, y: second + 5 }, { x: 32, y: second + 1 }]),
  ];
  const contextNodes = [
    polyline("curve-left-1", [{ x: 12, y: PATCH_ORIGIN.y + y + 5 }, { x: 35, y: PATCH_ORIGIN.y + y - 2 }, { x: PATCH_ORIGIN.x, y: PATCH_ORIGIN.y + y }]),
    polyline("curve-right-1", [{ x: PATCH_ORIGIN.x + 32, y: PATCH_ORIGIN.y + y + 1 }, { x: 94, y: PATCH_ORIGIN.y + y + 7 }]),
    polyline("curve-left-2", [{ x: 13, y: PATCH_ORIGIN.y + second - 4 }, { x: PATCH_ORIGIN.x, y: PATCH_ORIGIN.y + second }]),
    polyline("curve-right-2", [{ x: PATCH_ORIGIN.x + 32, y: PATCH_ORIGIN.y + second + 1 }, { x: 95, y: PATCH_ORIGIN.y + second - 5 }]),
  ];
  return {
    contextNodes,
    correct,
    distractors: [
      { misconception: "WRONG_CURVATURE", nodes: [polyline("curve-1", [{ x: 0, y }, { x: 16, y: y + rise }, { x: 32, y: y + 1 }]), polyline("curve-2", [{ x: 0, y: second }, { x: 16, y: second - 5 }, { x: 32, y: second + 1 }])] },
      { misconception: "CURVE_PEAK_SHIFT", nodes: [polyline("curve-1", [{ x: 0, y }, { x: 23, y: y - rise }, { x: 32, y: y + 1 }]), polyline("curve-2", [{ x: 0, y: second }, { x: 23, y: second + 5 }, { x: 32, y: second + 1 }])] },
      { misconception: "CURVE_DIRECTION_REVERSAL", nodes: [polyline("curve-1", [{ x: 0, y: y + 1 }, { x: 16, y: y - rise }, { x: 32, y }]), polyline("curve-2", [{ x: 0, y: second + 1 }, { x: 16, y: second + 5 }, { x: 32, y: second }])] },
    ],
    visibleEntryCount: 4,
    difficulty: "Medium",
    ruleSummary: "The missing piece must continue both bent paths smoothly between their visible entry and exit points.",
    observation: "Two bent paths disappear into the blank square and reappear on the other side.",
    application: "Continue the bend of both paths without reversing or shifting the turning point.",
  };
}

function buildJunctionContinuity(rng: SpatialSeededRandom): PrototypeMaterialV1 {
  const centerX = rng.int(14, 18);
  const centerY = rng.int(14, 18);
  const topX = rng.int(7, 11);
  const bottomX = rng.int(21, 25);
  const correct = [
    line("j1", 0, 8, centerX, centerY),
    line("j2", 32, 9, centerX, centerY),
    line("j3", topX, 0, centerX, centerY),
    line("j4", bottomX, 32, centerX, centerY),
  ];
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const contextNodes = [
    line("left-entry", 12, gy + 3, gx, gy + 8),
    line("right-entry", gx + 32, gy + 9, 95, gy + 4),
    line("top-entry", gx + topX - 4, 7, gx + topX, gy),
    line("bottom-entry", gx + bottomX, gy + 32, gx + bottomX + 5, 94),
  ];
  return {
    contextNodes,
    correct,
    distractors: [
      { misconception: "PAIRWISE_CONNECTION", nodes: [line("j1", 0, 8, 32, 9), line("j2", topX, 0, bottomX, 32), line("j3", 1, 27, 10, 18), line("j4", 22, 18, 31, 27)] },
      { misconception: "OFFSET_JUNCTION", nodes: [line("j1", 0, 8, centerX + 6, centerY - 5), line("j2", 32, 9, centerX + 6, centerY - 5), line("j3", topX, 0, centerX + 6, centerY - 5), line("j4", bottomX, 32, centerX + 6, centerY - 5)] },
      { misconception: "WRONG_JUNCTION_ARM", nodes: [line("j1", 0, 8, centerX, centerY), line("j2", 32, 9, centerX, centerY), line("j3", topX, 0, centerX, centerY), line("j4", bottomX, 32, centerX + 7, centerY + 1)] },
    ],
    visibleEntryCount: 4,
    difficulty: "Medium",
    ruleSummary: "All four visible arms belong to one junction inside the missing square.",
    observation: "Four line ends point into the missing square from four sides.",
    application: "Extend the four arms until they meet at one common junction.",
  };
}

function buildNestedContour(rng: SpatialSeededRandom): PrototypeMaterialV1 {
  const outerA = rng.int(7, 11);
  const innerA = outerA + rng.int(5, 8);
  const correct = [
    line("outer", 0, outerA, 32, 32 - outerA),
    line("inner", 0, innerA, 32, 32 - innerA),
  ];
  const gy = PATCH_ORIGIN.y;
  const gx = PATCH_ORIGIN.x;
  const contextNodes = [
    line("outer-left", 8, gy + outerA + 12, gx, gy + outerA),
    line("outer-right", gx + 32, gy + 32 - outerA, 95, gy + 32 - outerA - 10),
    line("inner-left", 16, gy + innerA + 7, gx, gy + innerA),
    line("inner-right", gx + 32, gy + 32 - innerA, 93, gy + 32 - innerA - 5),
    line("parallel-cue-1", 17, 18, 45, 32),
    line("parallel-cue-2", 21, 25, 47, 38),
  ];
  return {
    contextNodes,
    correct,
    distractors: [
      { misconception: "OUTER_ONLY_MATCH", nodes: [line("outer", 0, outerA, 32, 32 - outerA), line("inner", 0, innerA, 32, innerA)] },
      { misconception: "INNER_DIRECTION_ERROR", nodes: [line("outer", 0, outerA, 32, 32 - outerA), line("inner", 0, 32 - innerA, 32, innerA)] },
      { misconception: "CONTOUR_OFFSET", nodes: [line("outer", 0, outerA + 4, 32, 32 - outerA + 4), line("inner", 0, innerA + 4, 32, 32 - innerA + 4)] },
    ],
    visibleEntryCount: 4,
    difficulty: "Medium",
    ruleSummary: "Both nested contour lines must keep the same separation and direction through the missing square.",
    observation: "Two parallel contour lines enter the missing square and continue beyond it.",
    application: "Complete both contours together, preserving their direction and spacing.",
  };
}

function buildCompoundMarker(rng: SpatialSeededRandom): PrototypeMaterialV1 {
  const y = rng.int(10, 14);
  const delta = rng.pick([-5, -4, 4, 5] as const);
  const markerX = rng.int(12, 20);
  const markerY = y + Math.round((delta * markerX) / 32);
  const correct = [line("path", 0, y, 32, y + delta), circle("marker", markerX, markerY)];
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const contextNodes = [
    line("path-left", 10, gy + y - 8, gx, gy + y),
    line("path-right", gx + 32, gy + y + delta, 95, gy + y + delta + 6),
    circle("marker-left", 38, gy + y - 4, 2.2),
    circle("marker-right", 94, gy + y + delta + 6, 2.2),
  ];
  return {
    contextNodes,
    correct,
    distractors: [
      { misconception: "MARKER_WRONG_SIDE", nodes: [line("path", 0, y, 32, y + delta), circle("marker", 32 - markerX, markerY)] },
      { misconception: "MARKER_WRONG_LEVEL", nodes: [line("path", 0, y, 32, y + delta), circle("marker", markerX, Math.max(3, Math.min(29, markerY + (delta > 0 ? -7 : 7))))] },
      { misconception: "STRUCTURE_ONLY_MARKER_OMITTED", nodes: [line("path", 0, y, 32, y + delta), circle("marker", markerX, Math.max(3, Math.min(29, markerY + 10)))] },
    ],
    visibleEntryCount: 2,
    difficulty: "Hard",
    ruleSummary: "The fragment must continue the sloping path and place the marker on that same path progression.",
    observation: "A sloping path and its marker pattern both pass through the missing square.",
    application: "First continue the line, then place the missing marker at the matching position on that line.",
  };
}

function materialForPrototype(prototypeId: FigureCompletionPrototypeV1, rng: SpatialSeededRandom): PrototypeMaterialV1 {
  switch (prototypeId) {
    case "FGC-PROT-01-STRAIGHT-CONTINUITY": return buildStraightContinuity(rng);
    case "FGC-PROT-02-CURVED-PATH-CONTINUITY": return buildCurvedContinuity(rng);
    case "FGC-PROT-03-JUNCTION-CONTINUITY": return buildJunctionContinuity(rng);
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY": return buildNestedContour(rng);
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER": return buildCompoundMarker(rng);
  }
}

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-option:${seed}:${label}`, nodes, true);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

export function generateFigureCompletionDiscoveryQuestionV1(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 discovery requires a non-empty seed.");
  const rng = new SpatialSeededRandom(`FGC-001:${request.prototypeId}:${request.seed}`);
  const material = materialForPrototype(request.prototypeId, rng);
  const stimulusScene = buildStimulus(`fgc-stimulus:${request.prototypeId}:${request.seed}`, material.contextNodes);
  const fullScene = composeCoreScene(`fgc-full:${request.prototypeId}:${request.seed}`, material.contextNodes, material.correct);
  const rawOptions: FigureCompletionOptionV1[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", material.correct) },
    ...material.distractors.map((entry) => ({ misconception: entry.misconception, scene: optionScene(request.seed, entry.misconception, entry.nodes) })),
  ];

  assertValidSpatialScene(stimulusScene);
  assertValidSpatialScene(fullScene);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));
  const semanticUniqueness = validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene));
  if (!semanticUniqueness.ok) throw new Error(`${request.prototypeId}: semantically equivalent completion options.`);
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptualUniqueness.ok) throw new Error(`${request.prototypeId}: perceptually equivalent completion options.`);

  const desired = request.desiredCorrectOptionIndex ?? (rng.int(0, 3) as 0 | 1 | 2 | 3);
  const wrong = rawOptions.filter((option) => option.misconception !== "CORRECT_FRAGMENT");
  const options: FigureCompletionOptionV1[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === desired) options.push(rawOptions[0] as FigureCompletionOptionV1);
    else options.push(wrong[wrongIndex++] as FigureCompletionOptionV1);
  }

  const fullSceneFingerprint = spatialSceneSemanticFingerprint(fullScene);
  const reconstructedFingerprints = options.map((option, index) => spatialSceneSemanticFingerprint(
    composeCoreScene(`fgc-reconstructed:${request.seed}:${index}`, material.contextNodes, option.scene.nodes),
  ));
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
  const deliveryFingerprint = JSON.stringify({ contentFingerprint, ordered: options.map((option) => spatialSceneSemanticFingerprint(option.scene)), correctOptionIndex: desired });
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
      check: `Option ${answer} is the only piece that reconnects every required visible feature without changing the surrounding figure.`,
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
