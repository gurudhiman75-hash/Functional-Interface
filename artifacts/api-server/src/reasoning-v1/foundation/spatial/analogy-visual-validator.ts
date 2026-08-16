import type {
  SpatialAnalogyFigureState,
  SpatialAnalogyRuleId,
} from "./analogy-types";
import {
  areSpatialScenesEquivalent,
  spatialNodeSemanticFingerprint,
} from "./normalize";
import { setSpatialAnalogyInnerShading } from "./analogy-scene";
import {
  reflectSceneHorizontally,
  reflectSceneVertically,
  rotateScene,
} from "./transform";
import type { SpatialScene } from "./types";

const PIVOT = { x: 50, y: 50 } as const;

const STATE_FEATURES: readonly (keyof SpatialAnalogyFigureState)[] = [
  "outerShape",
  "innerShape",
  "outerRotationQuarter",
  "innerRotationQuarter",
  "markerPosition",
  "direction",
  "shadedInner",
  "segmentCount",
  "segmentAnchor",
];

const REQUIRED_VISUAL_ROLES = [
  "outer-shape",
  "inner-shape",
  "direction-indicator",
  "count-segment",
  "distinguishing-marker",
] as const;

interface RuleDeltaContract {
  requiredStateFeatures: readonly (keyof SpatialAnalogyFigureState)[];
  allowedStateFeatures: readonly (keyof SpatialAnalogyFigureState)[];
  expectedVisualRoles: readonly string[];
}

const NON_GEOMETRIC_RULE_CONTRACTS: Partial<
  Record<SpatialAnalogyRuleId, RuleDeltaContract>
> = {
  MOVE_MARKER_CLOCKWISE: {
    requiredStateFeatures: ["markerPosition"],
    allowedStateFeatures: ["markerPosition"],
    expectedVisualRoles: ["distinguishing-marker"],
  },
  MOVE_MARKER_COUNTERCLOCKWISE: {
    requiredStateFeatures: ["markerPosition"],
    allowedStateFeatures: ["markerPosition"],
    expectedVisualRoles: ["distinguishing-marker"],
  },
  ADD_SEGMENT: {
    requiredStateFeatures: ["segmentCount"],
    allowedStateFeatures: ["segmentCount"],
    expectedVisualRoles: ["count-segment"],
  },
  REMOVE_SEGMENT: {
    requiredStateFeatures: ["segmentCount"],
    allowedStateFeatures: ["segmentCount"],
    expectedVisualRoles: ["count-segment"],
  },
  SUBSTITUTE_INNER_NEXT: {
    requiredStateFeatures: ["innerShape"],
    allowedStateFeatures: ["innerShape", "innerRotationQuarter"],
    expectedVisualRoles: ["inner-shape"],
  },
  TOGGLE_INNER_SHADING: {
    requiredStateFeatures: ["shadedInner"],
    allowedStateFeatures: ["shadedInner"],
    expectedVisualRoles: ["inner-shape"],
  },
  SWAP_INNER_OUTER: {
    requiredStateFeatures: ["outerShape", "innerShape"],
    allowedStateFeatures: [
      "outerShape",
      "innerShape",
      "outerRotationQuarter",
      "innerRotationQuarter",
    ],
    expectedVisualRoles: ["inner-shape", "outer-shape"],
  },
  REVERSE_DIRECTION: {
    requiredStateFeatures: ["direction"],
    allowedStateFeatures: ["direction"],
    expectedVisualRoles: ["direction-indicator"],
  },
  NO_CHANGE: {
    requiredStateFeatures: [],
    allowedStateFeatures: [],
    expectedVisualRoles: [],
  },
};

export interface SpatialAnalogyVisualValidation {
  ok: boolean;
  geometricTransformCheck: "PASS" | "FAIL" | "NOT_APPLICABLE";
  visualDeltaCheck: "PASS" | "FAIL";
  visibleRoleCheck: "PASS" | "FAIL";
  expectedChangedFeatures: string[];
  actualChangedFeatures: string[];
  changedVisualRoles: string[];
  errors: string[];
}

function changedStateFeatures(
  source: SpatialAnalogyFigureState,
  target: SpatialAnalogyFigureState,
): (keyof SpatialAnalogyFigureState)[] {
  return STATE_FEATURES.filter((feature) => source[feature] !== target[feature]);
}

function roleFingerprint(scene: SpatialScene, role: string): string {
  return scene.nodes
    .filter((node) => node.role === role)
    .map(spatialNodeSemanticFingerprint)
    .sort()
    .join("|");
}

function changedVisualRoles(
  sourceScene: SpatialScene,
  targetScene: SpatialScene,
): string[] {
  const roles = new Set(
    [...sourceScene.nodes, ...targetScene.nodes].map(
      (node) => node.role ?? node.kind,
    ),
  );
  return [...roles]
    .filter(
      (role) =>
        roleFingerprint(sourceScene, role) !==
        roleFingerprint(targetScene, role),
    )
    .sort();
}

function validateVisibleRoles(scene: SpatialScene): string[] {
  const errors: string[] = [];
  for (const role of REQUIRED_VISUAL_ROLES) {
    if (!scene.nodes.some((node) => node.role === role)) {
      errors.push(`Missing required visual role '${role}' in scene '${scene.id}'.`);
    }
  }

  const layerForRole = (role: string, fallback: number): number[] =>
    scene.nodes
      .filter((node) => node.role === role)
      .map((node) => node.layer ?? fallback);

  const innerLayers = layerForRole("inner-shape", 0);
  const directionLayers = layerForRole("direction-indicator", 0);
  const markerLayers = layerForRole("distinguishing-marker", 0);
  const segmentLayers = layerForRole("count-segment", 0);

  const maxInner = Math.max(...innerLayers, Number.NEGATIVE_INFINITY);
  const minDirection = Math.min(...directionLayers, Number.POSITIVE_INFINITY);
  const maxDirection = Math.max(...directionLayers, Number.NEGATIVE_INFINITY);
  const maxSegment = Math.max(...segmentLayers, Number.NEGATIVE_INFINITY);
  const minMarker = Math.min(...markerLayers, Number.POSITIVE_INFINITY);

  if (minDirection <= maxInner) {
    errors.push(
      `Direction indicator is not layered above the inner shape in scene '${scene.id}'.`,
    );
  }
  if (minMarker <= Math.max(maxDirection, maxSegment)) {
    errors.push(
      `Marker is not layered above all other discriminating features in scene '${scene.id}'.`,
    );
  }

  return errors;
}

export function buildExpectedSpatialAnalogyGeometricScene(
  sourceScene: SpatialScene,
  targetState: SpatialAnalogyFigureState,
  ruleId: SpatialAnalogyRuleId,
  nextId: string,
): SpatialScene | null {
  switch (ruleId) {
    case "ROTATE_90_CW":
      return rotateScene(sourceScene, 90, PIVOT, nextId);
    case "ROTATE_90_CCW":
      return rotateScene(sourceScene, -90, PIVOT, nextId);
    case "ROTATE_180":
      return rotateScene(sourceScene, 180, PIVOT, nextId);
    case "REFLECT_VERTICAL":
      return reflectSceneVertically(sourceScene, 50, nextId);
    case "REFLECT_HORIZONTAL":
      return reflectSceneHorizontally(sourceScene, 50, nextId);
    case "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING":
      return setSpatialAnalogyInnerShading(
        rotateScene(sourceScene, 90, PIVOT, nextId),
        targetState.shadedInner,
        nextId,
      );
    case "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING":
      return setSpatialAnalogyInnerShading(
        rotateScene(sourceScene, -90, PIVOT, nextId),
        targetState.shadedInner,
        nextId,
      );
    default:
      return null;
  }
}

export function validateSpatialAnalogyVisualPair(
  sourceState: SpatialAnalogyFigureState,
  targetState: SpatialAnalogyFigureState,
  sourceScene: SpatialScene,
  targetScene: SpatialScene,
  ruleId: SpatialAnalogyRuleId,
): SpatialAnalogyVisualValidation {
  const errors: string[] = [];
  const actualFeatures = changedStateFeatures(sourceState, targetState);
  const visualRoles = changedVisualRoles(sourceScene, targetScene);
  const visibilityErrors = [
    ...validateVisibleRoles(sourceScene),
    ...validateVisibleRoles(targetScene),
  ];
  errors.push(...visibilityErrors);

  const expectedGeometricScene = buildExpectedSpatialAnalogyGeometricScene(
    sourceScene,
    targetState,
    ruleId,
    targetScene.id,
  );

  let geometricTransformCheck: SpatialAnalogyVisualValidation["geometricTransformCheck"] =
    "NOT_APPLICABLE";
  let visualDeltaCheck: SpatialAnalogyVisualValidation["visualDeltaCheck"] =
    "PASS";
  let expectedFeatures: string[] = [];

  if (expectedGeometricScene) {
    expectedFeatures = [
      "complete-scene geometry",
      ...(ruleId.includes("TOGGLE_SHADING") ? ["shadedInner"] : []),
    ];
    if (!areSpatialScenesEquivalent(expectedGeometricScene, targetScene)) {
      geometricTransformCheck = "FAIL";
      visualDeltaCheck = "FAIL";
      errors.push(
        `Rendered target '${targetScene.id}' is not the exact matrix transform required by '${ruleId}'.`,
      );
    } else {
      geometricTransformCheck = "PASS";
    }
  } else {
    const contract = NON_GEOMETRIC_RULE_CONTRACTS[ruleId];
    if (!contract) {
      visualDeltaCheck = "FAIL";
      errors.push(`No visual delta contract exists for rule '${ruleId}'.`);
    } else {
      expectedFeatures = [...contract.allowedStateFeatures];
      const unexpectedFeatures = actualFeatures.filter(
        (feature) => !contract.allowedStateFeatures.includes(feature),
      );
      const missingRequiredFeatures = contract.requiredStateFeatures.filter(
        (feature) => !actualFeatures.includes(feature),
      );
      const expectedRoles = [...contract.expectedVisualRoles].sort();

      if (unexpectedFeatures.length > 0) {
        visualDeltaCheck = "FAIL";
        errors.push(
          `Rule '${ruleId}' unexpectedly changed state features: ${unexpectedFeatures.join(", ")}.`,
        );
      }
      if (missingRequiredFeatures.length > 0) {
        visualDeltaCheck = "FAIL";
        errors.push(
          `Rule '${ruleId}' did not change required state features: ${missingRequiredFeatures.join(", ")}.`,
        );
      }
      if (
        visualRoles.length !== expectedRoles.length ||
        visualRoles.some((role, index) => role !== expectedRoles[index])
      ) {
        visualDeltaCheck = "FAIL";
        errors.push(
          `Rule '${ruleId}' changed visual roles [${visualRoles.join(", ")}] instead of [${expectedRoles.join(", ")}].`,
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    geometricTransformCheck,
    visualDeltaCheck,
    visibleRoleCheck: visibilityErrors.length === 0 ? "PASS" : "FAIL",
    expectedChangedFeatures: expectedFeatures.map(String),
    actualChangedFeatures: actualFeatures.map(String),
    changedVisualRoles: visualRoles,
    errors,
  };
}
