import {
  FGC_001_PROTOTYPES_V1,
  generateFigureCompletionDiscoveryQuestionV2 as generateBaseFigureCompletionDiscoveryQuestionV2,
  type FigureCompletionPrototypeV1,
  type FigureCompletionQuestionV1,
} from "./figure-completion-discovery-v2";

export { FGC_001_PROTOTYPES_V1 };
export type { FigureCompletionPrototypeV1, FigureCompletionQuestionV1 };

const MIN_BENT_PATH_BOUNDARY_SEPARATION = 4;

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

export function generateFigureCompletionDiscoveryQuestionV2(request: {
  prototypeId: FigureCompletionPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionQuestionV1 {
  const question = generateBaseFigureCompletionDiscoveryQuestionV2(request);
  assertBentPathBoundarySeparation(question);
  return question;
}
