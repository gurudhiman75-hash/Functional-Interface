import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  FGC_001_PROTOTYPES_V1,
  generateFigureCompletionDiscoveryQuestionV2 as generateBaseFigureCompletionDiscoveryQuestionV2,
  type FigureCompletionPrototypeV1,
  type FigureCompletionQuestionV1,
} from "./figure-completion-discovery-v2";

export { FGC_001_PROTOTYPES_V1 };
export type { FigureCompletionPrototypeV1, FigureCompletionQuestionV1 };

const MIN_BENT_PATH_BOUNDARY_SEPARATION = 4;
const MIN_BENT_PATH_OUTSIDE_SEPARATION = 2;
const P02_LEFT_CUE_X = 25;
const EPSILON = 1e-7;

function assertBentPathBoundarySeparation(question: FigureCompletionQuestionV1): void {
  if (question.prototypeId !== "FGC-PROT-02-CURVED-PATH-CONTINUITY") return;
  const correct = question.options[question.correctOptionIndex]!.scene;
  const paths = correct.nodes.filter((node) => node.kind === "polyline");
  if (paths.length !== 2 || paths.some((node) => node.kind !== "polyline" || node.points.length < 2)) {
    throw new Error(`${question.prototypeId}: malformed bent-path completion material.`);
  }

  const first = paths[0]!;
  const second = paths[1]!;
  if (first.kind !== "polyline" || second.kind !== "polyline") {
    throw new Error(`${question.prototypeId}: malformed bent-path completion material.`);
  }
  const leftSeparation = Math.abs(first.points[0]!.y - second.points[0]!.y);
  const rightSeparation = Math.abs(first.points[first.points.length - 1]!.y - second.points[second.points.length - 1]!.y);
  if (leftSeparation < MIN_BENT_PATH_BOUNDARY_SEPARATION || rightSeparation < MIN_BENT_PATH_BOUNDARY_SEPARATION) {
    throw new Error(
      `${question.prototypeId}: perceptually equivalent completion options boundary cue separation below ${MIN_BENT_PATH_BOUNDARY_SEPARATION}.`,
    );
  }
}

function interpolateAtX(boundary: SpatialPoint, outside: SpatialPoint, targetX: number): SpatialPoint {
  const dx = outside.x - boundary.x;
  if (Math.abs(dx) <= EPSILON) throw new Error("FGC P02 left cue cannot be shortened from a vertical line.");
  const ratio = (targetX - boundary.x) / dx;
  return {
    x: targetX,
    y: boundary.y + (outside.y - boundary.y) * ratio,
  };
}

function shortenLeftCue(node: SpatialNode): SpatialNode {
  if (node.kind !== "line") throw new Error(`FGC P02 ${node.id}: expected a line cue.`);
  const startOnBoundary = Math.abs(node.start.x - 34) <= EPSILON;
  const endOnBoundary = Math.abs(node.end.x - 34) <= EPSILON;
  if (startOnBoundary === endOnBoundary) {
    throw new Error(`FGC P02 ${node.id}: expected exactly one left-boundary endpoint.`);
  }
  const boundary = startOnBoundary ? node.start : node.end;
  const outside = startOnBoundary ? node.end : node.start;
  const shortenedOutside = interpolateAtX(boundary, outside, P02_LEFT_CUE_X);
  return startOnBoundary
    ? { ...node, start: { ...boundary }, end: shortenedOutside }
    : { ...node, start: shortenedOutside, end: { ...boundary } };
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

function recomputeAfterStimulusChange(
  question: FigureCompletionQuestionV1,
  stimulusScene: SpatialScene,
): FigureCompletionQuestionV1 {
  const baseNodes = stimulusScene.nodes.filter((node) => node.id !== "missing-box");
  const { x: patchX, y: patchY } = question.solverEvidence.patchOrigin;
  const reconstructedFingerprints = question.options.map((option, index) => {
    const reconstructed: SpatialScene = {
      version: stimulusScene.version,
      id: `fgc-hardened-reconstructed:${question.seed}:${index}`,
      viewBox: { ...stimulusScene.viewBox },
      nodes: [
        ...baseNodes,
        ...option.scene.nodes.map((node) => translateNode(node, patchX, patchY, `placed-${index}-`)),
      ],
    };
    return spatialSceneSemanticFingerprint(reconstructed);
  });
  const fullSceneFingerprint = reconstructedFingerprints[question.correctOptionIndex]!;
  const matchingOptionIndexes = reconstructedFingerprints
    .map((fingerprint, index) => ({ fingerprint, index }))
    .filter((entry) => entry.fingerprint === fullSceneFingerprint)
    .map((entry) => entry.index);
  if (matchingOptionIndexes.length !== 1 || matchingOptionIndexes[0] !== question.correctOptionIndex) {
    throw new Error(`${question.prototypeId}: hardened stimulus reconstruction lost unique answer authority.`);
  }

  const optionFingerprints = question.options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  const contentFingerprint = JSON.stringify({
    prototypeId: question.prototypeId,
    stimulus: spatialSceneSemanticFingerprint(stimulusScene),
    optionSet: [...optionFingerprints].sort(),
    correct: optionFingerprints[question.correctOptionIndex],
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    ordered: optionFingerprints,
    correctOptionIndex: question.correctOptionIndex,
  });

  return {
    ...question,
    stimulusScene,
    solverEvidence: {
      ...question.solverEvidence,
      fullSceneFingerprint,
      reconstructedFingerprints,
      matchingOptionIndexes,
    },
    contentFingerprint,
    deliveryFingerprint,
  };
}

function removeP02OutsideCrossing(question: FigureCompletionQuestionV1): FigureCompletionQuestionV1 {
  if (question.prototypeId !== "FGC-PROT-02-CURVED-PATH-CONTINUITY") return question;
  let topOutsideY: number | undefined;
  let bottomOutsideY: number | undefined;
  const nodes = question.stimulusScene.nodes.map((node) => {
    if (node.id !== "curve-left-1" && node.id !== "curve-left-2") return node;
    const shortened = shortenLeftCue(node);
    if (shortened.kind !== "line") return shortened;
    const outside = Math.abs(shortened.start.x - P02_LEFT_CUE_X) <= EPSILON ? shortened.start : shortened.end;
    if (node.id === "curve-left-1") topOutsideY = outside.y;
    else bottomOutsideY = outside.y;
    return shortened;
  });
  if (topOutsideY === undefined || bottomOutsideY === undefined) {
    throw new Error(`${question.prototypeId}: missing authored left-side path cues.`);
  }
  if (bottomOutsideY - topOutsideY < MIN_BENT_PATH_OUTSIDE_SEPARATION) {
    throw new Error(
      `${question.prototypeId}: perceptually equivalent completion options outside cue separation below ${MIN_BENT_PATH_OUTSIDE_SEPARATION}.`,
    );
  }
  return recomputeAfterStimulusChange(question, { ...question.stimulusScene, nodes });
}

function polishExplanation(question: FigureCompletionQuestionV1): FigureCompletionQuestionV1 {
  const answer = question.answer;
  switch (question.prototypeId) {
    case "FGC-PROT-01-STRAIGHT-CONTINUITY":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          check: `Option ${answer} is the only piece that continues both sloping lines at the correct visible angles.`,
        },
      };
    case "FGC-PROT-02-CURVED-PATH-CONTINUITY":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          check: `Option ${answer} is the only piece that joins both bent paths with the required incoming and outgoing directions.`,
        },
      };
    case "FGC-PROT-03-JUNCTION-CONTINUITY":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          check: `Option ${answer} is the only piece that continues all four visible arms into one common junction.`,
        },
      };
    case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
      return question;
    case "FGC-PROT-05-COMPOUND-CONTOUR-MARKER":
      return {
        ...question,
        explanation: {
          ...question.explanation,
          observation: "A straight sloping line passes through the blank, with one marker visible on each side.",
          rule: "The line must continue at one angle, and the three markers must be equally spaced along that line.",
          application: "Continue the line without a kink, then place the missing marker midway between the two visible markers.",
          check: `Option ${answer} is the only piece that continues the line and places the missing marker midway between the two visible markers.`,
        },
      };
  }
}

export function generateFigureCompletionDiscoveryQuestionV2(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  const baseQuestion = generateBaseFigureCompletionDiscoveryQuestionV2(request);
  assertBentPathBoundarySeparation(baseQuestion);
  const visuallyHardened = removeP02OutsideCrossing(baseQuestion);
  return polishExplanation(visuallyHardened);
}
