import type { SpatialTransformProofQuestion } from "./proof-types";
import type { SpatialScene } from "./types";

export function buildSpatialStemPresentationScene(
  question: SpatialTransformProofQuestion,
): SpatialScene {
  const source = question.sourceScene;
  const isMirror = question.requestedTransform === "REFLECT_VERTICAL";
  const padding = 18;
  const axisNode = isMirror
    ? {
        kind: "line" as const,
        id: "presentation-mirror-line",
        role: "reflection-axis-presentation",
        start: {
          x: source.viewBox.minX + source.viewBox.width + padding / 2,
          y: source.viewBox.minY + 4,
        },
        end: {
          x: source.viewBox.minX + source.viewBox.width + padding / 2,
          y: source.viewBox.minY + source.viewBox.height - 4,
        },
        style: {
          stroke: "#374151",
          strokeWidth: 1.5,
          dashArray: [4, 3],
        },
      }
    : {
        kind: "line" as const,
        id: "presentation-water-line",
        role: "reflection-axis-presentation",
        start: {
          x: source.viewBox.minX + 4,
          y: source.viewBox.minY + source.viewBox.height + padding / 2,
        },
        end: {
          x: source.viewBox.minX + source.viewBox.width - 4,
          y: source.viewBox.minY + source.viewBox.height + padding / 2,
        },
        style: {
          stroke: "#374151",
          strokeWidth: 1.5,
          dashArray: [4, 3],
        },
      };

  return {
    ...source,
    id: `${source.id}-presentation`,
    viewBox: {
      ...source.viewBox,
      width: source.viewBox.width + (isMirror ? padding : 0),
      height: source.viewBox.height + (isMirror ? 0 : padding),
    },
    nodes: [...source.nodes, axisNode],
    metadata: {
      ...source.metadata,
      presentationAxis: isMirror ? "RIGHT_VERTICAL" : "BELOW_HORIZONTAL",
    },
  };
}
