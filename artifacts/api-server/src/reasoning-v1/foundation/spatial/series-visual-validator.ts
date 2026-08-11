import { areSpatialScenesEquivalent } from "./normalize";
import { rotateScene } from "./transform";
import type {
  SpatialSeriesCardinal,
  SpatialSeriesPresentationProfile,
  SpatialSeriesRuleId,
  SpatialSeriesVisualValidation,
} from "./series-types";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";

const CARDINAL_INDEX: Record<SpatialSeriesCardinal, number> = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3,
};

function mod4(value: number): number {
  return ((value % 4) + 4) % 4;
}

function primitiveScene(scene: SpatialScene): SpatialScene {
  return {
    ...scene,
    id: `${scene.id}-primitive-only`,
    nodes: scene.nodes.filter((node) => node.role?.startsWith("series-main-")),
  };
}

function markerNode(scene: SpatialScene): Extract<SpatialNode, { kind: "circle" }> | null {
  const node = scene.nodes.find((candidate) => candidate.role === "series-marker");
  return node?.kind === "circle" ? node : null;
}

function dotNodes(scene: SpatialScene): Extract<SpatialNode, { kind: "circle" }>[] {
  return scene.nodes.filter(
    (node): node is Extract<SpatialNode, { kind: "circle" }> =>
      node.kind === "circle" && node.role === "series-dot",
  );
}

function cardinalFromPoint(point: SpatialPoint): SpatialSeriesCardinal {
  const dx = point.x - 50;
  const dy = point.y - 50;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "RIGHT" : "LEFT";
  return dy >= 0 ? "BOTTOM" : "TOP";
}

function dotAnchor(scene: SpatialScene): SpatialSeriesCardinal | null {
  const dots = dotNodes(scene);
  if (dots.length === 0) return null;
  const summed = dots.reduce(
    (acc, node) => ({ x: acc.x + node.center.x, y: acc.y + node.center.y }),
    { x: 0, y: 0 },
  );
  return cardinalFromPoint({ x: summed.x / dots.length, y: summed.y / dots.length });
}

interface VisualSignature {
  rotationDeg: -90 | 0 | 90 | 180;
  markerDelta: -1 | 0 | 1 | 2;
  dotAnchorDelta: -1 | 0 | 1 | 2;
  dotCountDelta: -1 | 0 | 1;
}

function signature(ruleId: SpatialSeriesRuleId): VisualSignature {
  switch (ruleId) {
    case "ROTATE_90_CW":
      return { rotationDeg: 90, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "ROTATE_90_CCW":
      return { rotationDeg: -90, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "ROTATE_180":
      return { rotationDeg: 180, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "MOVE_MARKER_CW":
      return { rotationDeg: 0, markerDelta: 1, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "MOVE_MARKER_CCW":
      return { rotationDeg: 0, markerDelta: -1, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "MOVE_MARKER_180":
      return { rotationDeg: 0, markerDelta: 2, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "MOVE_DOTS_CW":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: 1, dotCountDelta: 0 };
    case "MOVE_DOTS_CCW":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: -1, dotCountDelta: 0 };
    case "MOVE_DOTS_180":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: 2, dotCountDelta: 0 };
    case "INCREASE_DOTS":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: 1 };
    case "DECREASE_DOTS":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: -1 };
    case "ROTATE_90_CW_MOVE_MARKER_CCW":
      return { rotationDeg: 90, markerDelta: -1, dotAnchorDelta: 0, dotCountDelta: 0 };
    case "ROTATE_90_CCW_MOVE_DOTS_CW":
      return { rotationDeg: -90, markerDelta: 0, dotAnchorDelta: 1, dotCountDelta: 0 };
    case "NO_CHANGE":
      return { rotationDeg: 0, markerDelta: 0, dotAnchorDelta: 0, dotCountDelta: 0 };
  }
}

function primitiveMatchesExpectedRotation(
  previous: SpatialScene,
  next: SpatialScene,
  rotationDeg: VisualSignature["rotationDeg"],
): boolean {
  const before = primitiveScene(previous);
  const after = primitiveScene(next);
  if (rotationDeg === 0) return areSpatialScenesEquivalent(before, after);
  return areSpatialScenesEquivalent(
    rotateScene(before, rotationDeg, { x: 50, y: 50 }, `${before.id}-independent-rotation`),
    after,
  );
}

export function validateSpatialSeriesVisualTransition(
  previous: SpatialScene,
  next: SpatialScene,
  ruleId: SpatialSeriesRuleId,
  profile: SpatialSeriesPresentationProfile,
): SpatialSeriesVisualValidation {
  const errors: string[] = [];
  const expected = signature(ruleId);
  const primitiveOk = primitiveMatchesExpectedRotation(previous, next, expected.rotationDeg);
  if (!primitiveOk) errors.push(`Primitive geometry does not match ${expected.rotationDeg}° expected rotation.`);

  let markerMotionCheck: SpatialSeriesVisualValidation["markerMotionCheck"] = "NOT_APPLICABLE";
  if (profile.showMarker) {
    markerMotionCheck = "PASS";
    const before = markerNode(previous);
    const after = markerNode(next);
    if (!before || !after) {
      errors.push("Visible marker is missing from a series transition.");
    } else {
      const delta = mod4(
        CARDINAL_INDEX[cardinalFromPoint(after.center)] -
          CARDINAL_INDEX[cardinalFromPoint(before.center)],
      );
      if (delta !== mod4(expected.markerDelta)) {
        errors.push(`Marker moved ${delta} quarter-sides; expected ${mod4(expected.markerDelta)}.`);
      }
    }
  } else if (markerNode(previous) || markerNode(next)) {
    errors.push("Marker must be absent when the presentation profile hides it.");
  }

  let dotMotionCheck: SpatialSeriesVisualValidation["dotMotionCheck"] = "NOT_APPLICABLE";
  let dotCountCheck: SpatialSeriesVisualValidation["dotCountCheck"] = "NOT_APPLICABLE";
  if (profile.showDots) {
    dotMotionCheck = "PASS";
    dotCountCheck = "PASS";
    const beforeAnchor = dotAnchor(previous);
    const afterAnchor = dotAnchor(next);
    if (beforeAnchor === null || afterAnchor === null) {
      errors.push("Visible dot group is missing from a series transition.");
    } else {
      const delta = mod4(CARDINAL_INDEX[afterAnchor] - CARDINAL_INDEX[beforeAnchor]);
      if (delta !== mod4(expected.dotAnchorDelta)) {
        errors.push(`Dot group moved ${delta} quarter-sides; expected ${mod4(expected.dotAnchorDelta)}.`);
      }
    }
    const countDelta = dotNodes(next).length - dotNodes(previous).length;
    if (countDelta !== expected.dotCountDelta) {
      errors.push(`Dot count changed by ${countDelta}; expected ${expected.dotCountDelta}.`);
    }
  } else if (dotNodes(previous).length > 0 || dotNodes(next).length > 0) {
    errors.push("Dots must be absent when the presentation profile hides them.");
  }

  return {
    ok: errors.length === 0,
    errors,
    primitiveTransformCheck: primitiveOk ? "PASS" : "NOT_APPLICABLE",
    markerMotionCheck,
    dotMotionCheck,
    dotCountCheck,
  };
}
