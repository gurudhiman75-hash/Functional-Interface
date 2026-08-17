import { buildSpatialFclSafeQuartetCatalogV1 } from "./fcl-safe-quartet-catalog-v1";
import {
  compareSpatialScenePerceptualSimilarityV2,
  SPATIAL_PERCEPTUAL_HARD_ALIAS_DICE_V2,
  SPATIAL_PERCEPTUAL_SAME_ROLE_NEAR_ALIAS_DICE_V2,
} from "./perceptual-scene-similarity-v2";
import { buildSpatialPrimitiveInstanceSceneV2 } from "./primitive-instance-v2";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { classifySpatialSceneSymmetry } from "./symmetry";
import { rotateScene } from "./transform";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import type {
  SpatialFclInstanceDescriptorAuditV2,
  SpatialFclPrimitiveInstanceV2,
} from "./synthesis-types-v2";

export type SpatialFclInstanceQuartetV2 = readonly [
  SpatialFclPrimitiveInstanceV2,
  SpatialFclPrimitiveInstanceV2,
  SpatialFclPrimitiveInstanceV2,
  SpatialFclPrimitiveInstanceV2,
];

export interface SpatialFclPerceptualAliasPairV2 {
  leftIndex: number;
  rightIndex: number;
  leftPrimitiveId: SpatialPrimitiveIdV2;
  rightPrimitiveId: SpatialPrimitiveIdV2;
  dice: number;
  jaccard: number;
  samePropertyValue: boolean;
  severity: "HARD_ALIAS" | "SAME_ROLE_NEAR_ALIAS";
}

export interface SpatialFclInstanceQuartetAuditV2 {
  propertyVector: boolean[];
  descriptorAudits: SpatialFclInstanceDescriptorAuditV2[];
  competingDescriptorIds: string[];
  reinforcingDescriptorIds: string[];
  disallowedShortcutDescriptorIds: string[];
  perceptualAliasPairs: SpatialFclPerceptualAliasPairV2[];
  globalRotationOrbitFingerprint: string;
  safe: boolean;
}

const STUDENT_VISIBLE_SHORTCUTS = new Set([
  "TOPOLOGY",
  "POLYGON_PRESENCE",
  "SIDE_COUNT_EXACT",
  "SIDE_PARITY",
  "ENCLOSED_REGION_COUNT",
  "JUNCTION_COUNT",
  "TRUE_CROSSING_COUNT",
  "FREE_TERMINAL_COUNT",
  "ROTATION_PERIOD",
  "VERTICAL_SYMMETRY",
  "HORIZONTAL_SYMMETRY",
  "HALF_TURN_SYMMETRY",
  "VISIBLE_ORIENTATION_CLASS",
]);

const ALLOWED_REINFORCING: Record<SpatialPrimitiveClassificationPropertyIdV2, readonly string[]> = {
  EVEN_SIDED_POLYGON: ["SIDE_PARITY"],
  VERTICAL_SYMMETRY: ["VERTICAL_SYMMETRY"],
  HORIZONTAL_SYMMETRY: ["HORIZONTAL_SYMMETRY"],
  HALF_TURN_SYMMETRY: ["HALF_TURN_SYMMETRY"],
  QUARTER_TURN_SYMMETRY: ["ROTATION_PERIOD"],
  HAS_BRANCH_JUNCTION: ["JUNCTION_COUNT"],
  HAS_TRUE_CROSSING: ["TRUE_CROSSING_COUNT"],
  PARTITIONED_FIGURE: ["TOPOLOGY", "ENCLOSED_REGION_COUNT"],
  HALF_TURN_ONLY: ["ROTATION_PERIOD"],
  TWO_FREE_TERMINALS: ["FREE_TERMINAL_COUNT"],
  CLOSED_SHAPE: ["TOPOLOGY", "ENCLOSED_REGION_COUNT", "FREE_TERMINAL_COUNT"],
  POLYGON: ["POLYGON_PRESENCE"],
};

const DESCRIPTOR_IDS = [
  "CATEGORY",
  "TOPOLOGY",
  "POLYGON_PRESENCE",
  "SIDE_COUNT_EXACT",
  "SIDE_PARITY",
  "ENCLOSED_REGION_COUNT",
  "JUNCTION_COUNT",
  "TRUE_CROSSING_COUNT",
  "FREE_TERMINAL_COUNT",
  "ROTATION_PERIOD",
  "VERTICAL_SYMMETRY",
  "HORIZONTAL_SYMMETRY",
  "HALF_TURN_SYMMETRY",
  "ORIENTATION_SENSITIVE",
  "REFLECTION_SENSITIVE",
  "CAN_CONTAIN_INNER",
  "SUPPORTS_FILL",
  "VISIBLE_ORIENTATION_CLASS",
] as const;

function distinctInstancesForPrimitive(
  primitiveId: SpatialPrimitiveIdV2,
): SpatialFclPrimitiveInstanceV2[] {
  const entry = getSpatialPrimitiveV2(primitiveId);
  const seen = new Set<string>();
  const instances: SpatialFclPrimitiveInstanceV2[] = [];
  for (const quarter of [0, 1, 2, 3] as const) {
    const scene = buildSpatialPrimitiveInstanceSceneV2(
      primitiveId,
      `FCL-INSTANCE-${primitiveId}-${quarter}`,
      { rotationQuarterTurns: quarter, scale: 0.9, idPrefix: `fcl-instance-${primitiveId.toLowerCase()}-${quarter}` },
    );
    const sceneFingerprint = spatialSceneSemanticFingerprint(scene);
    if (seen.has(sceneFingerprint)) continue;
    seen.add(sceneFingerprint);
    instances.push({
      primitiveId,
      rotationQuarterTurns: quarter,
      visibleOrientationClass: quarter % entry.rotationPeriodQuarterTurns,
      scene,
      sceneFingerprint,
    });
  }
  return instances;
}

const instanceCache = new Map<SpatialPrimitiveIdV2, readonly SpatialFclPrimitiveInstanceV2[]>();

export function getSpatialFclPrimitiveInstancesV2(
  primitiveId: SpatialPrimitiveIdV2,
): readonly SpatialFclPrimitiveInstanceV2[] {
  const cached = instanceCache.get(primitiveId);
  if (cached) return cached;
  const built = Object.freeze(distinctInstancesForPrimitive(primitiveId));
  instanceCache.set(primitiveId, built);
  return built;
}

export function spatialFclInstancePropertySatisfiedV2(
  instance: SpatialFclPrimitiveInstanceV2,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): boolean {
  const entry = getSpatialPrimitiveV2(instance.primitiveId);
  const connectivity = getSpatialPrimitiveConnectivityV2(instance.primitiveId);
  const symmetry = classifySpatialSceneSymmetry(instance.scene);
  switch (propertyId) {
    case "EVEN_SIDED_POLYGON": return entry.polygonSideCount !== null && entry.polygonSideCount % 2 === 0;
    case "VERTICAL_SYMMETRY": return symmetry.vertical;
    case "HORIZONTAL_SYMMETRY": return symmetry.horizontal;
    case "HALF_TURN_SYMMETRY": return symmetry.rotational180;
    case "QUARTER_TURN_SYMMETRY": return entry.rotationPeriodQuarterTurns === 1;
    case "HAS_BRANCH_JUNCTION": return connectivity.junctionCount > 0;
    case "HAS_TRUE_CROSSING": return connectivity.crossingCount > 0;
    case "PARTITIONED_FIGURE": return entry.category === "PARTITIONED_FIGURE";
    case "HALF_TURN_ONLY": return symmetry.rotational180 && entry.rotationPeriodQuarterTurns === 2;
    case "TWO_FREE_TERMINALS": return connectivity.terminalCount === 2;
    case "CLOSED_SHAPE": return entry.topology === "CLOSED" && entry.enclosedRegionCount === 1;
    case "POLYGON": return entry.polygonSideCount !== null && entry.topology === "CLOSED";
  }
}

function descriptorValue(
  instance: SpatialFclPrimitiveInstanceV2,
  descriptorId: typeof DESCRIPTOR_IDS[number],
): string {
  const entry = getSpatialPrimitiveV2(instance.primitiveId);
  const connectivity = getSpatialPrimitiveConnectivityV2(instance.primitiveId);
  const symmetry = classifySpatialSceneSymmetry(instance.scene);
  switch (descriptorId) {
    case "CATEGORY": return entry.category;
    case "TOPOLOGY": return entry.topology;
    case "POLYGON_PRESENCE": return entry.polygonSideCount === null ? "NO" : "YES";
    case "SIDE_COUNT_EXACT": return entry.polygonSideCount === null ? "NONE" : String(entry.polygonSideCount);
    case "SIDE_PARITY": return entry.polygonSideCount === null ? "NONE" : entry.polygonSideCount % 2 === 0 ? "EVEN" : "ODD";
    case "ENCLOSED_REGION_COUNT": return String(entry.enclosedRegionCount);
    case "JUNCTION_COUNT": return String(connectivity.junctionCount);
    case "TRUE_CROSSING_COUNT": return String(connectivity.crossingCount);
    case "FREE_TERMINAL_COUNT": return String(connectivity.terminalCount);
    case "ROTATION_PERIOD": return String(entry.rotationPeriodQuarterTurns);
    case "VERTICAL_SYMMETRY": return String(symmetry.vertical);
    case "HORIZONTAL_SYMMETRY": return String(symmetry.horizontal);
    case "HALF_TURN_SYMMETRY": return String(symmetry.rotational180);
    case "ORIENTATION_SENSITIVE": return String(entry.orientationSensitive);
    case "REFLECTION_SENSITIVE": return String(entry.reflectionSensitive);
    case "CAN_CONTAIN_INNER": return String(entry.canContainInner);
    case "SUPPORTS_FILL": return String(entry.supportsFill);
    case "VISIBLE_ORIENTATION_CLASS": return String(instance.visibleOrientationClass);
  }
}

function auditDescriptor(
  quartet: SpatialFclInstanceQuartetV2,
  descriptorId: typeof DESCRIPTOR_IDS[number],
  correctOddIndex: number,
): SpatialFclInstanceDescriptorAuditV2 {
  const values = quartet.map((instance) => descriptorValue(instance, descriptorId));
  const frequencies = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  const counts = Object.values(frequencies).sort((a, b) => a - b);
  const threeToOne = counts.length === 2 && counts[0] === 1 && counts[1] === 3;
  let minorityIndex: number | null = null;
  if (threeToOne) {
    const minority = Object.entries(frequencies).find(([, count]) => count === 1)?.[0];
    minorityIndex = minority === undefined ? null : values.indexOf(minority);
  }
  return {
    descriptorId,
    values: [...values],
    frequencies,
    threeToOne,
    minorityIndex,
    supportsCorrectOdd: !threeToOne || minorityIndex === correctOddIndex,
  };
}

function auditPerceptualAliases(
  quartet: SpatialFclInstanceQuartetV2,
  propertyVector: readonly boolean[],
): SpatialFclPerceptualAliasPairV2[] {
  const aliases: SpatialFclPerceptualAliasPairV2[] = [];
  for (let leftIndex = 0; leftIndex < quartet.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < quartet.length; rightIndex += 1) {
      const left = quartet[leftIndex]!;
      const right = quartet[rightIndex]!;
      const similarity = compareSpatialScenePerceptualSimilarityV2(left.scene, right.scene);
      const samePropertyValue = propertyVector[leftIndex] === propertyVector[rightIndex];
      const hardAlias = similarity.dice >= SPATIAL_PERCEPTUAL_HARD_ALIAS_DICE_V2;
      const sameRoleNearAlias = samePropertyValue && similarity.dice >= SPATIAL_PERCEPTUAL_SAME_ROLE_NEAR_ALIAS_DICE_V2;
      if (!hardAlias && !sameRoleNearAlias) continue;
      aliases.push({
        leftIndex,
        rightIndex,
        leftPrimitiveId: left.primitiveId,
        rightPrimitiveId: right.primitiveId,
        dice: similarity.dice,
        jaccard: similarity.jaccard,
        samePropertyValue,
        severity: hardAlias ? "HARD_ALIAS" : "SAME_ROLE_NEAR_ALIAS",
      });
    }
  }
  return aliases;
}

export function spatialFclInstanceQuartetGlobalRotationOrbitFingerprintV2(
  quartet: SpatialFclInstanceQuartetV2,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): string {
  const candidates: string[] = [];
  for (const quarter of [0, 1, 2, 3] as const) {
    const optionFingerprints = quartet.map((instance, index) =>
      spatialSceneSemanticFingerprint(
        rotateScene(instance.scene, quarter * 90, { x: 50, y: 50 }, `FCL-ORBIT-${propertyId}-${quarter}-${index}`),
      ),
    ).sort();
    candidates.push(`${propertyId}::${optionFingerprints.join("||")}`);
  }
  return candidates.sort()[0]!;
}

export function auditSpatialFclInstanceQuartetV2(
  quartet: SpatialFclInstanceQuartetV2,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
  correctOddIndex = 3,
): SpatialFclInstanceQuartetAuditV2 {
  const propertyVector = quartet.map((instance) => spatialFclInstancePropertySatisfiedV2(instance, propertyId));
  const propertyIsValid = propertyVector.filter(Boolean).length === 3 && propertyVector[correctOddIndex] === false;
  const descriptorAudits = DESCRIPTOR_IDS.map((descriptorId) => auditDescriptor(quartet, descriptorId, correctOddIndex));
  const ignoredForCrossing = propertyId === "HAS_TRUE_CROSSING"
    ? new Set(["VERTICAL_SYMMETRY", "HORIZONTAL_SYMMETRY", "HALF_TURN_SYMMETRY"])
    : new Set<string>();
  const competingDescriptorIds = descriptorAudits
    .filter((audit) => audit.threeToOne && !audit.supportsCorrectOdd && !ignoredForCrossing.has(audit.descriptorId))
    .map((audit) => audit.descriptorId);
  const reinforcingDescriptorIds = descriptorAudits
    .filter((audit) => audit.threeToOne && audit.supportsCorrectOdd && !ignoredForCrossing.has(audit.descriptorId))
    .map((audit) => audit.descriptorId);
  const allowed = new Set(ALLOWED_REINFORCING[propertyId]);
  const disallowedShortcutDescriptorIds = reinforcingDescriptorIds.filter(
    (descriptorId) => STUDENT_VISIBLE_SHORTCUTS.has(descriptorId) && !allowed.has(descriptorId),
  );
  const perceptualAliasPairs = auditPerceptualAliases(quartet, propertyVector);
  const globalRotationOrbitFingerprint = spatialFclInstanceQuartetGlobalRotationOrbitFingerprintV2(quartet, propertyId);
  return {
    propertyVector,
    descriptorAudits,
    competingDescriptorIds,
    reinforcingDescriptorIds,
    disallowedShortcutDescriptorIds,
    perceptualAliasPairs,
    globalRotationOrbitFingerprint,
    safe: propertyIsValid
      && competingDescriptorIds.length === 0
      && disallowedShortcutDescriptorIds.length === 0
      && perceptualAliasPairs.length === 0,
  };
}

const catalogCache = new Map<SpatialPrimitiveClassificationPropertyIdV2, readonly SpatialFclInstanceQuartetV2[]>();

export function buildSpatialFclInstanceSafeQuartetCatalogV2(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): readonly SpatialFclInstanceQuartetV2[] {
  const cached = catalogCache.get(propertyId);
  if (cached) return cached;
  const canonicalQuartets = buildSpatialFclSafeQuartetCatalogV1(propertyId);
  const safe: SpatialFclInstanceQuartetV2[] = [];
  const seenOrbit = new Set<string>();

  for (const canonical of canonicalQuartets) {
    const pools = canonical.map((primitiveId) => getSpatialFclPrimitiveInstancesV2(primitiveId));
    for (const first of pools[0]!) {
      for (const second of pools[1]!) {
        for (const third of pools[2]!) {
          for (const odd of pools[3]!) {
            const quartet = [first, second, third, odd] as SpatialFclInstanceQuartetV2;
            const audit = auditSpatialFclInstanceQuartetV2(quartet, propertyId, 3);
            if (!audit.safe || seenOrbit.has(audit.globalRotationOrbitFingerprint)) continue;
            seenOrbit.add(audit.globalRotationOrbitFingerprint);
            safe.push(quartet);
          }
        }
      }
    }
  }

  const frozen = Object.freeze(safe.map((quartet) => Object.freeze([...quartet]) as SpatialFclInstanceQuartetV2));
  catalogCache.set(propertyId, frozen);
  return frozen;
}

export function spatialFclInstanceCatalogCapacityV2(): Record<SpatialPrimitiveClassificationPropertyIdV2, number> {
  return Object.fromEntries(
    SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.map((propertyId) => [
      propertyId,
      buildSpatialFclInstanceSafeQuartetCatalogV2(propertyId).length,
    ]),
  ) as Record<SpatialPrimitiveClassificationPropertyIdV2, number>;
}

export function spatialFclInstanceTotalCapacityV2(): number {
  return Object.values(spatialFclInstanceCatalogCapacityV2()).reduce((sum, value) => sum + value, 0);
}