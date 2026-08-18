import { spatialSceneSemanticFingerprint } from "./normalize";
import { assertValidSpatialScene } from "./validator";
import type { SpatialNode, SpatialScene } from "./types";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  generateFigureCompletionSourceGapQuestionV2 as generateHardenedSourceGapQuestionV2,
  type FigureCompletionSourceGapPrototypeV1,
  type FigureCompletionSourceGapQuestionV2,
} from "./figure-completion-source-gap-discovery-v2-hardened";

export { FGC_001_SOURCE_GAP_PROTOTYPES_V1 };
export type { FigureCompletionSourceGapPrototypeV1, FigureCompletionSourceGapQuestionV2 };

const PATCH_ORIGIN = { x: 34, y: 34 } as const;

function line(id: string, x1: number, y1: number, x2: number, y2: number, role: string): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    role,
    style: {
      stroke: "currentColor",
      strokeWidth: 2.2,
      fill: "none",
      lineCap: "round",
      lineJoin: "round",
    },
  };
}

function circle(id: string, x: number, y: number, radius = 2.6, role = "p09-reference-circle"): SpatialNode {
  return {
    kind: "circle",
    id,
    center: { x, y },
    radius,
    role,
    style: {
      stroke: "currentColor",
      strokeWidth: 2.2,
      fill: "none",
    },
  };
}

function arrowNodes(
  idPrefix: string,
  centerX: number,
  centerY: number,
  direction: "LEFT" | "RIGHT",
  role: string,
  length = 14,
): SpatialNode[] {
  const half = length / 2;
  const head = 3.5;
  const tipX = direction === "RIGHT" ? centerX + half : centerX - half;
  const tailX = direction === "RIGHT" ? centerX - half : centerX + half;
  const headX = direction === "RIGHT" ? tipX - head : tipX + head;
  return [
    line(`${idPrefix}-shaft`, tailX, centerY, tipX, centerY, role),
    line(`${idPrefix}-head-a`, tipX, centerY, headX, centerY - head, role),
    line(`${idPrefix}-head-b`, tipX, centerY, headX, centerY + head, role),
  ];
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

function reconstructedScene(
  question: FigureCompletionSourceGapQuestionV2,
  contextNodes: SpatialNode[],
  optionIndex: number,
): SpatialScene {
  return {
    ...question.stimulusScene,
    id: `fgc-source-gap-exam-ready-reconstructed:${question.seed}:${optionIndex}`,
    nodes: [
      ...contextNodes,
      ...question.options[optionIndex]!.scene.nodes.map((node) => translateNode(node, PATCH_ORIGIN.x, PATCH_ORIGIN.y, "placed-")),
    ],
  };
}

function makeP09RuleLearnerDerivable(question: FigureCompletionSourceGapQuestionV2): FigureCompletionSourceGapQuestionV2 {
  if (question.prototypeId !== "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION") return question;

  const referenceDirection = question.solverEvidence.propertyEvidence.referenceArrowDirection;
  const requiredDirection = question.solverEvidence.propertyEvidence.requiredArrowDirection;
  if ((referenceDirection !== "LEFT" && referenceDirection !== "RIGHT") ||
      (requiredDirection !== "LEFT" && requiredDirection !== "RIGHT")) {
    throw new Error(`${question.prototypeId}: exam-ready P09 requires horizontal direction evidence.`);
  }

  const retainedContext = question.stimulusScene.nodes.filter(
    (node) => node.id !== "missing-box" && node.role !== "reference-arrow",
  );
  const missingBox = question.stimulusScene.nodes.find((node) => node.id === "missing-box");
  if (!missingBox) throw new Error(`${question.prototypeId}: missing-box absent.`);

  const referenceMotifs: SpatialNode[] = [
    circle("p09-reference-circle-left", 20, 11),
    circle("p09-reference-circle-middle", 50, 11),
    circle("p09-reference-circle-right", 80, 11),
    ...arrowNodes("p09-reference-arrow-a", 30, 23, referenceDirection, "p09-completed-reference-arrow"),
    ...arrowNodes("p09-reference-arrow-b", 54, 23, requiredDirection, "p09-completed-reference-arrow"),
    ...arrowNodes("p09-active-visible-arrow", 24, 60, referenceDirection, "p09-active-visible-arrow"),
  ];

  const contextNodes = [...retainedContext, ...referenceMotifs];
  const stimulusScene: SpatialScene = {
    ...question.stimulusScene,
    id: `fgc-source-gap-exam-ready-stimulus:${question.seed}`,
    nodes: [...contextNodes, missingBox],
  };
  assertValidSpatialScene(stimulusScene);

  const reconstructedScenes = question.options.map((_, index) => reconstructedScene(
    { ...question, stimulusScene },
    contextNodes,
    index,
  ));
  reconstructedScenes.forEach(assertValidSpatialScene);
  const reconstructedFingerprints = reconstructedScenes.map(spatialSceneSemanticFingerprint);
  const fullSceneFingerprint = reconstructedFingerprints[question.correctOptionIndex]!;
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== question.correctOptionIndex) {
    throw new Error(`${question.prototypeId}: exam-ready reconstruction lost unique answer ownership.`);
  }

  const contentFingerprint = JSON.stringify({
    prototypeId: question.prototypeId,
    stimulus: spatialSceneSemanticFingerprint(stimulusScene),
    optionSet: question.options.map((option) => spatialSceneSemanticFingerprint(option.scene)).sort(),
    correct: spatialSceneSemanticFingerprint(question.options[question.correctOptionIndex]!.scene),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    ordered: question.options.map((option) => spatialSceneSemanticFingerprint(option.scene)),
    correctOptionIndex: question.correctOptionIndex,
  });

  return {
    ...question,
    stimulusScene,
    explanation: {
      observation: "The completed example at the top shows two rules: a row contains three circles, and the two arrows in a pair point in opposite directions.",
      rule: "Apply both completed-example rules to the unfinished lower part: restore the third circle and make the missing arrow opposite to the visible lower arrow.",
      application: "Put one circle in the middle gap of the lower circle row, then choose the arrow direction opposite to the lower arrow already shown at the left.",
      check: `Option ${question.answer} alone completes both the three-circle row and the opposite-arrow pair shown by the visible example.`,
    },
    solverEvidence: {
      ...question.solverEvidence,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
      ruleSummary: "Copy the two visible completed motifs: three circles per row and opposite directions within each arrow pair.",
    },
    contentFingerprint,
    deliveryFingerprint,
  };
}

export function generateFigureCompletionSourceGapQuestionV2(request: {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionSourceGapQuestionV2 {
  return makeP09RuleLearnerDerivable(generateHardenedSourceGapQuestionV2(request));
}
