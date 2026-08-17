import { spatialSceneSemanticFingerprint } from "./normalize";
import { SpatialSeededRandom } from "./seed";
import { validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { assertValidSpatialScene, validateSpatialOptionUniqueness } from "./validator";
import type { SpatialNode, SpatialScene } from "./types";
import {
  FGC_001_DISCOVERY_VERSION_V1,
  FGC_001_PROTOTYPES_V1,
  generateFigureCompletionDiscoveryQuestionV1,
  type FigureCompletionMisconceptionV1,
  type FigureCompletionOptionV1,
  type FigureCompletionPrototypeV1,
  type FigureCompletionQuestionV1,
} from "./figure-completion-discovery-v1";

export { FGC_001_PROTOTYPES_V1 };
export type { FigureCompletionPrototypeV1, FigureCompletionQuestionV1 };

const PATCH_ORIGIN = { x: 58, y: 34 } as const;
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

function line(id: string, x1: number, y1: number, x2: number, y2: number, role = "figure-line"): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    role,
    style: BASE_STYLE,
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

function optionScene(seed: string, label: string, nodes: SpatialNode[]): SpatialScene {
  return scene(`fgc-option:${seed}:${label}`, nodes, true);
}

function answerLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] as "A" | "B" | "C" | "D";
}

function continuationStartY(boundaryY: number, delta: number, boundaryX: number, startX: number): number {
  return boundaryY - (delta * (boundaryX - startX)) / PATCH_SIZE;
}

function continuationEndY(boundaryY: number, delta: number, boundaryX: number, endX: number): number {
  return boundaryY + (delta * (endX - boundaryX)) / PATCH_SIZE;
}

function generateRemediatedNestedContourQuestion(request: {
  prototypeId: "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY";
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  if (!request.seed.trim()) throw new Error("FGC-001 discovery requires a non-empty seed.");

  const rng = new SpatialSeededRandom(`FGC-001:${request.prototypeId}:${request.seed}:REMEDIATED`);
  const slopeDelta = rng.pick([-8, -6, -4, 4, 6, 8] as const);
  const outerY = rng.int(9, 13);
  const gap = rng.int(5, 8);
  const innerY = outerY + gap;
  const shift = slopeDelta > 0 ? -3 : 3;

  const correctNodes = [
    line("outer", 0, outerY, PATCH_SIZE, outerY + slopeDelta),
    line("inner", 0, innerY, PATCH_SIZE, innerY + slopeDelta),
  ];

  const outerLeftX = rng.int(12, 18);
  const innerLeftX = rng.int(18, 24);
  const outerRightX = rng.int(93, 95);
  const innerRightX = rng.int(91, 94);
  const gx = PATCH_ORIGIN.x;
  const gy = PATCH_ORIGIN.y;
  const patchRightX = gx + PATCH_SIZE;

  const contextNodes = [
    line(
      "outer-left",
      outerLeftX,
      continuationStartY(gy + outerY, slopeDelta, gx, outerLeftX),
      gx,
      gy + outerY,
    ),
    line(
      "outer-right",
      patchRightX,
      gy + outerY + slopeDelta,
      outerRightX,
      continuationEndY(gy + outerY + slopeDelta, slopeDelta, patchRightX, outerRightX),
    ),
    line(
      "inner-left",
      innerLeftX,
      continuationStartY(gy + innerY, slopeDelta, gx, innerLeftX),
      gx,
      gy + innerY,
    ),
    line(
      "inner-right",
      patchRightX,
      gy + innerY + slopeDelta,
      innerRightX,
      continuationEndY(gy + innerY + slopeDelta, slopeDelta, patchRightX, innerRightX),
    ),
  ];

  const distractors: Array<{
    misconception: Exclude<FigureCompletionMisconceptionV1, "CORRECT_FRAGMENT">;
    nodes: SpatialNode[];
  }> = [
    {
      misconception: "OUTER_ONLY_MATCH",
      nodes: [
        line("outer", 0, outerY, PATCH_SIZE, outerY + slopeDelta),
        line("inner", 0, innerY, PATCH_SIZE, innerY),
      ],
    },
    {
      misconception: "INNER_DIRECTION_ERROR",
      nodes: [
        line("outer", 0, outerY, PATCH_SIZE, outerY + slopeDelta),
        line("inner", 0, innerY, PATCH_SIZE, innerY - slopeDelta),
      ],
    },
    {
      misconception: "CONTOUR_OFFSET",
      nodes: [
        line("outer", 0, outerY + shift, PATCH_SIZE, outerY + slopeDelta + shift),
        line("inner", 0, innerY + shift, PATCH_SIZE, innerY + slopeDelta + shift),
      ],
    },
  ];

  const stimulusScene = buildStimulus(`fgc-stimulus:${request.prototypeId}:${request.seed}`, contextNodes);
  const fullScene = composeCoreScene(`fgc-full:${request.prototypeId}:${request.seed}`, contextNodes, correctNodes);
  const rawOptions: FigureCompletionOptionV1[] = [
    { misconception: "CORRECT_FRAGMENT", scene: optionScene(request.seed, "correct", correctNodes) },
    ...distractors.map((entry) => ({
      misconception: entry.misconception,
      scene: optionScene(request.seed, entry.misconception, entry.nodes),
    })),
  ];

  assertValidSpatialScene(stimulusScene);
  assertValidSpatialScene(fullScene);
  rawOptions.forEach((option) => assertValidSpatialScene(option.scene));

  const semanticUniqueness = validateSpatialOptionUniqueness(rawOptions.map((option) => option.scene));
  if (!semanticUniqueness.ok) {
    throw new Error(`${request.prototypeId}: semantically equivalent completion options.`);
  }
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(rawOptions.map((option) => option.scene));
  if (!perceptualUniqueness.ok) {
    throw new Error(`${request.prototypeId}: perceptually equivalent completion options.`);
  }

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
      composeCoreScene(`fgc-reconstructed:${request.seed}:${index}`, contextNodes, option.scene.nodes),
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
    difficulty: "Medium",
    stem: "Choose the option that correctly completes the missing part of the figure.",
    stimulusScene,
    options,
    correctOptionIndex: desired,
    answer,
    explanation: {
      observation: "Two parallel contour lines reach the missing square and continue beyond it.",
      rule: "Both contour lines must keep the same slope and the same spacing through the missing square.",
      application: "Continue both visible lines at the shared angle without flattening, reversing, or shifting either contour.",
      check: `Option ${answer} is the only figure that reconnects both contours while preserving their common direction and spacing.`,
    },
    solverEvidence: {
      patchOrigin: { ...PATCH_ORIGIN },
      patchSize: PATCH_SIZE,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      visibleEntryCount: 4,
      ruleSummary: "Both nested contour lines preserve one common slope and one fixed separation through the missing region.",
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

export function generateFigureCompletionDiscoveryQuestionV1Remediated(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  if (request.prototypeId === "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY") {
    return generateRemediatedNestedContourQuestion({
      prototypeId: request.prototypeId,
      seed: request.seed,
      desiredCorrectOptionIndex: request.desiredCorrectOptionIndex,
    });
  }
  return generateFigureCompletionDiscoveryQuestionV1(request);
}
