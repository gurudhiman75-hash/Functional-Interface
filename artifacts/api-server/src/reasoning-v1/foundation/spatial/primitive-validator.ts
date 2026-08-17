import { areSpatialScenesEquivalent, spatialSceneSemanticFingerprint } from "./normalize";
import { classifySpatialSceneSymmetry } from "./symmetry";
import { rotateScene } from "./transform";
import { validateSpatialScene } from "./validator";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
import { SPATIAL_PRIMITIVE_AUTHORITY_V2 } from "./primitive-library-v2";
import type {
  SpatialPrimitiveAuthorityEntryV2,
  SpatialPrimitiveQuarterTurnPeriod,
  SpatialPrimitiveValidationIssueV2,
  SpatialPrimitiveValidationResultV2,
} from "./primitive-types";

function scenePivot(entry: SpatialPrimitiveAuthorityEntryV2): { x: number; y: number } {
  const { minX, minY, width, height } = entry.canonicalScene.viewBox;
  return { x: minX + width / 2, y: minY + height / 2 };
}

export function deriveSpatialPrimitiveQuarterTurnPeriodV2(
  entry: SpatialPrimitiveAuthorityEntryV2,
): SpatialPrimitiveQuarterTurnPeriod {
  const pivot = scenePivot(entry);
  for (const quarterTurns of [1, 2, 4] as const) {
    const rotated = rotateScene(
      entry.canonicalScene,
      quarterTurns * 90,
      pivot,
      `${entry.canonicalScene.id}-period-${quarterTurns}`,
    );
    if (areSpatialScenesEquivalent(entry.canonicalScene, rotated)) return quarterTurns;
  }
  return 4;
}

export function validateSpatialPrimitiveV2(
  entry: SpatialPrimitiveAuthorityEntryV2,
): SpatialPrimitiveValidationResultV2 {
  const errors: SpatialPrimitiveValidationIssueV2[] = [];
  const add = (code: string, message: string) =>
    errors.push({ primitiveId: entry.primitiveId, code, message });

  const sceneValidation = validateSpatialScene(entry.canonicalScene);
  for (const issue of sceneValidation.errors) {
    add(`SCENE_${issue.code}`, issue.message);
  }

  const metadata = entry.canonicalScene.metadata ?? {};
  if (metadata.primitiveId !== entry.primitiveId) add("METADATA_ID", "Scene primitiveId metadata does not match authority entry.");
  if (metadata.primitiveCategory !== entry.category) add("METADATA_CATEGORY", "Scene primitiveCategory metadata does not match authority entry.");
  if (metadata.primitiveTopology !== entry.topology) add("METADATA_TOPOLOGY", "Scene primitiveTopology metadata does not match authority entry.");
  if (metadata.authorityVersion !== entry.authorityVersion) add("METADATA_VERSION", "Scene authorityVersion metadata does not match authority entry.");

  const actualSymmetry = classifySpatialSceneSymmetry(entry.canonicalScene);
  if (actualSymmetry.vertical !== entry.symmetry.vertical) add("SYMMETRY_VERTICAL", "Declared vertical symmetry does not match canonical geometry.");
  if (actualSymmetry.horizontal !== entry.symmetry.horizontal) add("SYMMETRY_HORIZONTAL", "Declared horizontal symmetry does not match canonical geometry.");
  if (actualSymmetry.rotational180 !== entry.symmetry.rotational180) add("SYMMETRY_180", "Declared 180-degree rotational symmetry does not match canonical geometry.");

  const actualPeriod = deriveSpatialPrimitiveQuarterTurnPeriodV2(entry);
  if (actualPeriod !== entry.rotationPeriodQuarterTurns) add("ROTATION_PERIOD", `Declared quarter-turn period ${entry.rotationPeriodQuarterTurns} does not match geometry period ${actualPeriod}.`);
  if (entry.orientationSensitive !== (actualPeriod !== 1)) add("ORIENTATION_SENSITIVITY", "orientationSensitive must match quarter-turn geometry.");
  if (entry.reflectionSensitive !== !(actualSymmetry.vertical && actualSymmetry.horizontal)) add("REFLECTION_SENSITIVITY", "reflectionSensitive must match vertical/horizontal canonical symmetry.");

  if (entry.polygonSideCount !== null && entry.polygonSideCount < 3) add("POLYGON_SIDE_COUNT", "Polygon side count must be at least three.");
  if (entry.enclosedRegionCount < 0) add("ENCLOSED_REGION_COUNT", "Enclosed-region count cannot be negative.");

  const connectivity = getSpatialPrimitiveConnectivityV2(entry.primitiveId);
  if (connectivity.junctionCount < 0) add("JUNCTION_COUNT", "Junction count cannot be negative.");
  if (connectivity.crossingCount < 0) add("CROSSING_COUNT", "Crossing count cannot be negative.");
  if (connectivity.terminalCount < 0) add("TERMINAL_COUNT", "Free-terminal count cannot be negative.");
  if (connectivity.crossingCount > connectivity.junctionCount) add("CONNECTIVITY_ORDER", "Crossing count cannot exceed junction count.");
  if (entry.interiorIntersectionCount !== connectivity.junctionCount) {
    add(
      "LEGACY_MEETING_POINT_COUNT",
      "Legacy interiorIntersectionCount must equal the authoritative branch-junction count until V3 removes the compatibility field.",
    );
  }

  if (entry.canContainInner && (entry.category !== "CLOSED_SHAPE" || entry.topology !== "CLOSED")) add("CONTAINMENT_CONTRACT", "Only closed-shape primitives may advertise inner containment.");
  if (new Set(entry.usageRoles).size !== entry.usageRoles.length) add("DUPLICATE_USAGE_ROLE", "Primitive usage roles must be unique.");
  if (new Set(entry.examTags).size !== entry.examTags.length) add("DUPLICATE_EXAM_TAG", "Primitive exam tags must be unique.");

  return { ok: errors.length === 0, errors };
}

export interface SpatialPrimitiveLibraryValidationV2 extends SpatialPrimitiveValidationResultV2 {
  primitiveCount: number;
  uniqueSceneFingerprintCount: number;
}

export function validateSpatialPrimitiveLibraryV2(): SpatialPrimitiveLibraryValidationV2 {
  const errors = SPATIAL_PRIMITIVE_AUTHORITY_V2.flatMap((entry) => validateSpatialPrimitiveV2(entry).errors);
  const ids = SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => entry.primitiveId);
  const sceneFingerprints = SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => spatialSceneSemanticFingerprint(entry.canonicalScene));

  if (new Set(ids).size !== ids.length) {
    errors.push({ primitiveId: ids[0]!, code: "DUPLICATE_PRIMITIVE_ID", message: "Primitive authority contains duplicate IDs." });
  }
  if (new Set(sceneFingerprints).size !== sceneFingerprints.length) {
    errors.push({ primitiveId: ids[0]!, code: "DUPLICATE_CANONICAL_SCENE", message: "Two primitive IDs render to the same canonical semantic scene." });
  }

  return {
    ok: errors.length === 0,
    errors,
    primitiveCount: ids.length,
    uniqueSceneFingerprintCount: new Set(sceneFingerprints).size,
  };
}
