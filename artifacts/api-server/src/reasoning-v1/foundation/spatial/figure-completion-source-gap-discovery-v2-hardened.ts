import type { SpatialLineNode, SpatialPoint } from "./types";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  generateFigureCompletionSourceGapQuestionV2 as generateBaseFigureCompletionSourceGapQuestionV2,
  type FigureCompletionSourceGapPrototypeV1,
  type FigureCompletionSourceGapQuestionV2,
} from "./figure-completion-source-gap-discovery-v2";

export { FGC_001_SOURCE_GAP_PROTOTYPES_V1 };
export type { FigureCompletionSourceGapPrototypeV1, FigureCompletionSourceGapQuestionV2 };

const MIN_CIRCLE_TO_ARROW_CLEARANCE = 3;

function pointSegmentDistance(point: SpatialPoint, line: SpatialLineNode): number {
  const vx = line.end.x - line.start.x;
  const vy = line.end.y - line.start.y;
  const wx = point.x - line.start.x;
  const wy = point.y - line.start.y;
  const vv = vx * vx + vy * vy;
  const t = vv <= 1e-12 ? 0 : Math.max(0, Math.min(1, (wx * vx + wy * vy) / vv));
  return Math.hypot(
    point.x - (line.start.x + t * vx),
    point.y - (line.start.y + t * vy),
  );
}

function assertP09MobileClearance(question: FigureCompletionSourceGapQuestionV2): void {
  if (question.prototypeId !== "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION") return;

  for (const option of question.options) {
    const circles = option.scene.nodes.filter(
      (node) => node.kind === "circle" && node.role === "completion-circle",
    );
    const arrow = option.scene.nodes.filter(
      (node): node is SpatialLineNode => node.kind === "line" && node.role === "completion-arrow",
    );
    if (arrow.length !== 3) {
      throw new Error(`${question.prototypeId}: malformed completion arrow in hardened V2 state.`);
    }
    for (const circle of circles) {
      if (circle.kind !== "circle") continue;
      const minimumDistance = Math.min(...arrow.map((segment) => pointSegmentDistance(circle.center, segment)));
      if (minimumDistance < circle.radius + MIN_CIRCLE_TO_ARROW_CLEARANCE) {
        throw new Error(
          `${question.prototypeId}: perceptually equivalent source-gap options mobile circle-arrow clearance below ${MIN_CIRCLE_TO_ARROW_CLEARANCE}.`,
        );
      }
    }
  }
}

export function generateFigureCompletionSourceGapQuestionV2(request: {
  prototypeId: FigureCompletionSourceGapPrototypeV1;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): FigureCompletionSourceGapQuestionV2 {
  const question = generateBaseFigureCompletionSourceGapQuestionV2(request);
  assertP09MobileClearance(question);
  return question;
}
