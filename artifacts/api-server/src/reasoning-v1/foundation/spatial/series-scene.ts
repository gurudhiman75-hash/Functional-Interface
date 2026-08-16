import { instantiateSpatialPrimitiveNodesV2 } from "./primitive-instance-v2";
import { normalizeSpatialSeriesState } from "./series-rule-authority";
import type {
  SpatialSeriesCardinal,
  SpatialSeriesFrameState,
  SpatialSeriesPresentationProfile,
} from "./series-types";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialNode,
  type SpatialPoint,
  type SpatialScene,
} from "./types";

const MARKER_POSITION: Record<SpatialSeriesCardinal, SpatialPoint> = {
  TOP: { x: 50, y: 12 },
  RIGHT: { x: 88, y: 50 },
  BOTTOM: { x: 50, y: 88 },
  LEFT: { x: 12, y: 50 },
};

function dotCenters(count: number, anchor: SpatialSeriesCardinal): SpatialPoint[] {
  const spacing = 7;
  const first = 50 - ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => {
    const offset = first + index * spacing;
    switch (anchor) {
      case "TOP":
        return { x: offset, y: 11 };
      case "RIGHT":
        return { x: 89, y: offset };
      case "BOTTOM":
        return { x: offset, y: 89 };
      case "LEFT":
        return { x: 11, y: offset };
    }
  });
}

export function buildSpatialSeriesFrameScene(
  stateInput: SpatialSeriesFrameState,
  profile: SpatialSeriesPresentationProfile,
  sceneId: string,
): SpatialScene {
  const state = normalizeSpatialSeriesState(stateInput);
  const nodes: SpatialNode[] = [
    ...instantiateSpatialPrimitiveNodesV2(state.primitiveId, {
      center: { x: 50, y: 50 },
      scale: 0.68,
      rotationQuarterTurns: state.rotationQuarterTurns,
      idPrefix: "series-main",
      rolePrefix: "series-main-",
    }),
  ];

  if (profile.showMarker) {
    nodes.push({
      kind: "circle",
      id: "series-marker",
      role: "series-marker",
      layer: 8,
      center: MARKER_POSITION[state.markerPosition],
      radius: 3.8,
      style: { stroke: "#111", strokeWidth: 1.2, fill: "#111" },
    });
  }

  if (profile.showDots) {
    nodes.push(
      ...dotCenters(state.dotCount, state.dotAnchor).map((center, index) => ({
        kind: "circle" as const,
        id: `series-dot-${index + 1}`,
        role: "series-dot",
        layer: 8,
        center,
        radius: 2.8,
        style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
      })),
    );
  }

  return {
    version: SPATIAL_SCENE_VERSION,
    id: sceneId,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes,
    metadata: {
      chapterCode: "FSR-001",
      semanticRole: "FIGURE_SERIES_FRAME",
      primitiveId: state.primitiveId,
      rotationQuarterTurns: state.rotationQuarterTurns,
      showMarker: profile.showMarker,
      showDots: profile.showDots,
      markerPosition: profile.showMarker ? state.markerPosition : null,
      dotAnchor: profile.showDots ? state.dotAnchor : null,
      dotCount: profile.showDots ? state.dotCount : null,
    },
  };
}
