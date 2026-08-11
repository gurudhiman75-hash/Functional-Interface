import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_DESCRIPTOR_IDS_V2,
  auditSpatialPrimitiveClassificationDescriptorV2,
  spatialPrimitiveClassificationPropertySatisfiedV2,
  type SpatialPrimitiveClassificationDescriptorAuditV2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import { SPATIAL_FCL_PRIMITIVE_POOL_V2 } from "./primitive-chapter-pools-v2";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";

export type SpatialFclSafeQuartetV1 = readonly [
  SpatialPrimitiveIdV2,
  SpatialPrimitiveIdV2,
  SpatialPrimitiveIdV2,
  SpatialPrimitiveIdV2,
];

export interface SpatialFclQuartetAuditV1 {
  propertyVector: readonly boolean[];
  descriptorAudits: readonly SpatialPrimitiveClassificationDescriptorAuditV2[];
  competingDescriptorIds: readonly string[];
  safe: boolean;
}

const cache = new Map<SpatialPrimitiveClassificationPropertyIdV2, readonly SpatialFclSafeQuartetV1[]>();

export function auditSpatialFclQuartetV1(
  primitiveIds: SpatialFclSafeQuartetV1,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
  correctOddIndex = 3,
): SpatialFclQuartetAuditV1 {
  const entries = primitiveIds.map(getSpatialPrimitiveV2);
  const propertyVector = primitiveIds.map((primitiveId) =>
    spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, propertyId),
  );
  const propertyIsValid =
    propertyVector.filter(Boolean).length === 3 && propertyVector[correctOddIndex] === false;
  const descriptorAudits = SPATIAL_PRIMITIVE_CLASSIFICATION_DESCRIPTOR_IDS_V2.map((descriptorId) =>
    auditSpatialPrimitiveClassificationDescriptorV2(entries, descriptorId, correctOddIndex),
  );
  const competingDescriptorIds = descriptorAudits
    .filter((audit) => audit.threeToOne && !audit.supportsCorrectOdd)
    .map((audit) => audit.descriptorId);
  return {
    propertyVector,
    descriptorAudits,
    competingDescriptorIds,
    safe: propertyIsValid && competingDescriptorIds.length === 0,
  };
}

export function buildSpatialFclSafeQuartetCatalogV1(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): readonly SpatialFclSafeQuartetV1[] {
  const cached = cache.get(propertyId);
  if (cached) return cached;

  const commonPool = SPATIAL_FCL_PRIMITIVE_POOL_V2.filter((primitiveId) =>
    spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, propertyId),
  );
  const oddPool = SPATIAL_FCL_PRIMITIVE_POOL_V2.filter((primitiveId) =>
    !spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, propertyId),
  );
  const safe: SpatialFclSafeQuartetV1[] = [];

  for (let first = 0; first < commonPool.length - 2; first += 1) {
    for (let second = first + 1; second < commonPool.length - 1; second += 1) {
      for (let third = second + 1; third < commonPool.length; third += 1) {
        for (const odd of oddPool) {
          const quartet: SpatialFclSafeQuartetV1 = [
            commonPool[first]!,
            commonPool[second]!,
            commonPool[third]!,
            odd,
          ];
          if (auditSpatialFclQuartetV1(quartet, propertyId, 3).safe) {
            safe.push(quartet);
          }
        }
      }
    }
  }

  const frozen = Object.freeze(safe.map((quartet) => Object.freeze([...quartet]) as SpatialFclSafeQuartetV1));
  cache.set(propertyId, frozen);
  return frozen;
}

export function spatialFclSafeQuartetCatalogSizeV1(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): number {
  return buildSpatialFclSafeQuartetCatalogV1(propertyId).length;
}
