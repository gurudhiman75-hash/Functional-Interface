import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_DESCRIPTOR_IDS_V2,
  auditSpatialPrimitiveClassificationDescriptorV2,
  spatialPrimitiveClassificationPropertySatisfiedV2,
  type SpatialPrimitiveClassificationDescriptorAuditV2,
  type SpatialPrimitiveClassificationDescriptorIdV2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import { SPATIAL_FCL_PRIMITIVE_POOL_V2 } from "./primitive-chapter-pools-v2";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
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
  reinforcingDescriptorIds: readonly string[];
  disallowedShortcutDescriptorIds: readonly string[];
  productionDomainEligible: boolean;
  safe: boolean;
}

export interface SpatialFclQuartetCapacityDiagnosticV1 {
  propertyId: SpatialPrimitiveClassificationPropertyIdV2;
  eligiblePoolSize: number;
  commonPoolSize: number;
  oddPoolSize: number;
  rawQuartetCount: number;
  noCompetingMinorityCount: number;
  strictSafeCount: number;
  disallowedShortcutFrequency: Record<string, number>;
  disallowedShortcutSignatures: Record<string, number>;
}

// Only properties a learner can inspect or count from one static rendered option
// are eligible to be treated as same-answer shortcuts. Internal capabilities such
// as supportsFill/canContainInner and transform-sensitivity metadata remain part of
// the broad different-minority audit, but they cannot reject a question merely by
// reinforcing the intended odd option.
const STUDENT_VISIBLE_SHORTCUT_DESCRIPTOR_IDS = new Set<SpatialPrimitiveClassificationDescriptorIdV2>([
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
]);

// HAS_TRUE_CROSSING uses a production presentation that shortens one or more free
// arms on every option until whole-figure vertical, horizontal and 180° symmetry
// are all absent. That physical rendering step removes those symmetry shortcuts
// without changing junction/crossing topology.
const CROSSING_PRESENTATION_NEUTRALIZED_DESCRIPTORS: readonly SpatialPrimitiveClassificationDescriptorIdV2[] = [
  "VERTICAL_SYMMETRY",
  "HORIZONTAL_SYMMETRY",
  "HALF_TURN_SYMMETRY",
];

const ALLOWED_REINFORCING_DESCRIPTORS: Record<
  SpatialPrimitiveClassificationPropertyIdV2,
  readonly SpatialPrimitiveClassificationDescriptorIdV2[]
> = {
  EVEN_SIDED_POLYGON: ["SIDE_PARITY"],
  VERTICAL_SYMMETRY: ["VERTICAL_SYMMETRY"],
  HORIZONTAL_SYMMETRY: ["HORIZONTAL_SYMMETRY"],
  HALF_TURN_SYMMETRY: ["HALF_TURN_SYMMETRY"],
  QUARTER_TURN_SYMMETRY: ["ROTATION_PERIOD"],
  HAS_BRANCH_JUNCTION: ["JUNCTION_COUNT"],
  HAS_TRUE_CROSSING: ["TRUE_CROSSING_COUNT", ...CROSSING_PRESENTATION_NEUTRALIZED_DESCRIPTORS],
  PARTITIONED_FIGURE: ["TOPOLOGY", "ENCLOSED_REGION_COUNT"],
  HALF_TURN_ONLY: ["ROTATION_PERIOD"],
  TWO_FREE_TERMINALS: ["FREE_TERMINAL_COUNT"],
  CLOSED_SHAPE: ["TOPOLOGY", "ENCLOSED_REGION_COUNT", "FREE_TERMINAL_COUNT"],
  POLYGON: ["POLYGON_PRESENCE"],
};

function productionDomainEligible(
  primitiveId: SpatialPrimitiveIdV2,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): boolean {
  const entry = getSpatialPrimitiveV2(primitiveId);

  // Internal symbols are useful inside figures, but a lone dot/star/tick is not
  // used as a full production classification option in this chapter.
  if (entry.category === "INTERNAL_SYMBOL") return false;

  switch (propertyId) {
    case "EVEN_SIDED_POLYGON":
      // A divided polygon still has an unambiguous outer side count. Every option
      // must expose a polygon side-count authority, eliminating polygon-vs-line shortcuts.
      return entry.polygonSideCount !== null;
    case "HAS_BRANCH_JUNCTION":
      // Keep all four options in the open-line domain. This avoids semantic
      // near-misses where a learner reasonably counts a polygon boundary plus an
      // internal divider as three strokes meeting at a vertex.
      return entry.topology === "OPEN";
    case "HAS_TRUE_CROSSING":
      // Keep all four options inside the same open junction-bearing domain. The
      // three common figures contain true crossings; the odd figure still has a
      // junction but its branches terminate at that meeting point.
      return entry.topology === "OPEN" && getSpatialPrimitiveConnectivityV2(primitiveId).junctionCount > 0;
    case "POLYGON":
      // A divided square still looks like a polygon to a learner. Restrict this
      // family to simple closed figures so only the outer-boundary question is asked.
      return entry.category === "CLOSED_SHAPE";
    case "TWO_FREE_TERMINALS":
      // Prevent the trivial three-open-vs-one-closed shortcut.
      return entry.topology === "OPEN";
    case "PARTITIONED_FIGURE":
      // Compare divided figures against an undivided closed figure, not an
      // unrelated open stroke such as Z/V/chevron.
      return entry.category === "PARTITIONED_FIGURE" || entry.category === "CLOSED_SHAPE";
    case "CLOSED_SHAPE":
      // Partitioned containers remain visibly closed to humans even when their
      // machine topology is COMPOSITE, so exclude that semantic near-miss.
      return entry.category !== "PARTITIONED_FIGURE";
    default:
      return true;
  }
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
  const reinforcingDescriptorIds = descriptorAudits
    .filter((audit) => audit.threeToOne && audit.supportsCorrectOdd)
    .map((audit) => audit.descriptorId);
  const allowedReinforcing = new Set(ALLOWED_REINFORCING_DESCRIPTORS[propertyId]);
  const disallowedShortcutDescriptorIds = reinforcingDescriptorIds.filter(
    (descriptorId) =>
      STUDENT_VISIBLE_SHORTCUT_DESCRIPTOR_IDS.has(descriptorId) &&
      !allowedReinforcing.has(descriptorId),
  );
  const domainEligible = primitiveIds.every((primitiveId) =>
    productionDomainEligible(primitiveId, propertyId),
  );

  return {
    propertyVector,
    descriptorAudits,
    competingDescriptorIds,
    reinforcingDescriptorIds,
    disallowedShortcutDescriptorIds,
    productionDomainEligible: domainEligible,
    safe:
      propertyIsValid &&
      domainEligible &&
      competingDescriptorIds.length === 0 &&
      disallowedShortcutDescriptorIds.length === 0,
  };
}

function eligiblePools(propertyId: SpatialPrimitiveClassificationPropertyIdV2) {
  const eligiblePool = SPATIAL_FCL_PRIMITIVE_POOL_V2.filter((primitiveId) =>
    productionDomainEligible(primitiveId, propertyId),
  );
  return {
    eligiblePool,
    commonPool: eligiblePool.filter((primitiveId) =>
      spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, propertyId),
    ),
    oddPool: eligiblePool.filter((primitiveId) =>
      !spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, propertyId),
    ),
  };
}

function forEachPropertyQuartet(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
  visit: (quartet: SpatialFclSafeQuartetV1) => void,
): { eligiblePoolSize: number; commonPoolSize: number; oddPoolSize: number } {
  const { eligiblePool, commonPool, oddPool } = eligiblePools(propertyId);
  for (let first = 0; first < commonPool.length - 2; first += 1) {
    for (let second = first + 1; second < commonPool.length - 1; second += 1) {
      for (let third = second + 1; third < commonPool.length; third += 1) {
        for (const odd of oddPool) {
          visit([
            commonPool[first]!,
            commonPool[second]!,
            commonPool[third]!,
            odd,
          ]);
        }
      }
    }
  }
  return {
    eligiblePoolSize: eligiblePool.length,
    commonPoolSize: commonPool.length,
    oddPoolSize: oddPool.length,
  };
}

export function diagnoseSpatialFclQuartetCapacityV1(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): SpatialFclQuartetCapacityDiagnosticV1 {
  let rawQuartetCount = 0;
  let noCompetingMinorityCount = 0;
  let strictSafeCount = 0;
  const disallowedShortcutFrequency: Record<string, number> = {};
  const disallowedShortcutSignatures: Record<string, number> = {};
  const poolSizes = forEachPropertyQuartet(propertyId, (quartet) => {
    rawQuartetCount += 1;
    const audit = auditSpatialFclQuartetV1(quartet, propertyId, 3);
    if (audit.competingDescriptorIds.length === 0) {
      noCompetingMinorityCount += 1;
      if (audit.disallowedShortcutDescriptorIds.length === 0) {
        strictSafeCount += 1;
      } else {
        for (const descriptorId of audit.disallowedShortcutDescriptorIds) {
          disallowedShortcutFrequency[descriptorId] =
            (disallowedShortcutFrequency[descriptorId] ?? 0) + 1;
        }
        const signature = [...audit.disallowedShortcutDescriptorIds].sort().join("+");
        disallowedShortcutSignatures[signature] =
          (disallowedShortcutSignatures[signature] ?? 0) + 1;
      }
    }
  });

  return {
    propertyId,
    ...poolSizes,
    rawQuartetCount,
    noCompetingMinorityCount,
    strictSafeCount,
    disallowedShortcutFrequency,
    disallowedShortcutSignatures,
  };
}

export function buildSpatialFclSafeQuartetCatalogV1(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): readonly SpatialFclSafeQuartetV1[] {
  const cached = cache.get(propertyId);
  if (cached) return cached;

  const safe: SpatialFclSafeQuartetV1[] = [];
  forEachPropertyQuartet(propertyId, (quartet) => {
    if (auditSpatialFclQuartetV1(quartet, propertyId, 3).safe) {
      safe.push(quartet);
    }
  });

  const frozen = Object.freeze(
    safe.map((quartet) => Object.freeze([...quartet]) as SpatialFclSafeQuartetV1),
  );
  cache.set(propertyId, frozen);
  return frozen;
}

export function spatialFclSafeQuartetCatalogSizeV1(
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): number {
  return buildSpatialFclSafeQuartetCatalogV1(propertyId).length;
}
