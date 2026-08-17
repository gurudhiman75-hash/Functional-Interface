import { areSpatialScenesEquivalent } from "./normalize";
import {
  reflectSceneHorizontally,
  reflectSceneVertically,
  rotateScene,
} from "./transform";
import type {
  SpatialPoint,
  SpatialRequestedTransform,
  SpatialScene,
  SpatialSymmetryProfile,
  SpatialTransformCandidate,
} from "./types";

export interface SpatialSymmetryAxes {
  axisX?: number;
  axisY?: number;
  pivot?: SpatialPoint;
}

function defaultAxisX(scene: SpatialScene): number {
  return scene.viewBox.minX + scene.viewBox.width / 2;
}

function defaultAxisY(scene: SpatialScene): number {
  return scene.viewBox.minY + scene.viewBox.height / 2;
}

function defaultPivot(scene: SpatialScene): SpatialPoint {
  return { x: defaultAxisX(scene), y: defaultAxisY(scene) };
}

export function transformSceneByRequestedOperation(
  scene: SpatialScene,
  requestedTransform: SpatialRequestedTransform,
  axes: SpatialSymmetryAxes = {},
  nextId = scene.id,
): SpatialScene {
  switch (requestedTransform) {
    case "REFLECT_VERTICAL":
      return reflectSceneVertically(
        scene,
        axes.axisX ?? defaultAxisX(scene),
        nextId,
      );
    case "REFLECT_HORIZONTAL":
      return reflectSceneHorizontally(
        scene,
        axes.axisY ?? defaultAxisY(scene),
        nextId,
      );
    case "ROTATE_180":
      return rotateScene(scene, 180, axes.pivot ?? defaultPivot(scene), nextId);
  }
}

export function classifySpatialSceneSymmetry(
  scene: SpatialScene,
  axes: SpatialSymmetryAxes = {},
): SpatialSymmetryProfile {
  const vertical = transformSceneByRequestedOperation(
    scene,
    "REFLECT_VERTICAL",
    axes,
    `${scene.id}-vertical-symmetry-check`,
  );
  const horizontal = transformSceneByRequestedOperation(
    scene,
    "REFLECT_HORIZONTAL",
    axes,
    `${scene.id}-horizontal-symmetry-check`,
  );
  const rotational180 = transformSceneByRequestedOperation(
    scene,
    "ROTATE_180",
    axes,
    `${scene.id}-rotation-symmetry-check`,
  );

  return {
    vertical: areSpatialScenesEquivalent(scene, vertical),
    horizontal: areSpatialScenesEquivalent(scene, horizontal),
    rotational180: areSpatialScenesEquivalent(scene, rotational180),
  };
}

export function buildStandardTransformCandidates(
  scene: SpatialScene,
  axes: SpatialSymmetryAxes = {},
): SpatialTransformCandidate[] {
  return [
    { label: "UNCHANGED_STIMULUS", scene },
    {
      label: "REFLECT_VERTICAL",
      scene: transformSceneByRequestedOperation(
        scene,
        "REFLECT_VERTICAL",
        axes,
        `${scene.id}-vertical`,
      ),
    },
    {
      label: "REFLECT_HORIZONTAL",
      scene: transformSceneByRequestedOperation(
        scene,
        "REFLECT_HORIZONTAL",
        axes,
        `${scene.id}-horizontal`,
      ),
    },
    {
      label: "ROTATE_180",
      scene: transformSceneByRequestedOperation(
        scene,
        "ROTATE_180",
        axes,
        `${scene.id}-rotation-180`,
      ),
    },
  ];
}
