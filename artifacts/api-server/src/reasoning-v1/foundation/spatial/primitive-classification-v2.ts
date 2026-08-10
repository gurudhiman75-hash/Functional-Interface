import { buildSpatialPrimitiveInstanceSceneV2 } from "./primitive-instance-v2";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialPrimitiveAuthorityEntryV2, SpatialPrimitiveIdV2 } from "./primitive-types";
import type { SpatialScene } from "./types";

export type SpatialPrimitiveClassificationPropertyIdV2 =
  | "EVEN_SIDED_POLYGON"
  | "VERTICAL_SYMMETRY"
  | "HORIZONTAL_SYMMETRY"
  | "HALF_TURN_SYMMETRY"
  | "QUARTER_TURN_SYMMETRY"
  | "HAS_BRANCH_JUNCTION"
  | "HAS_TRUE_CROSSING"
  | "PARTITIONED_FIGURE"
  | "HALF_TURN_ONLY"
  | "TWO_FREE_TERMINALS"
  | "CLOSED_SHAPE"
  | "POLYGON";

export type SpatialPrimitiveClassificationDescriptorIdV2 =
  | "CATEGORY"
  | "TOPOLOGY"
  | "POLYGON_PRESENCE"
  | "SIDE_COUNT_EXACT"
  | "SIDE_PARITY"
  | "ENCLOSED_REGION_COUNT"
  | "JUNCTION_COUNT"
  | "TRUE_CROSSING_COUNT"
  | "FREE_TERMINAL_COUNT"
  | "ROTATION_PERIOD"
  | "VERTICAL_SYMMETRY"
  | "HORIZONTAL_SYMMETRY"
  | "HALF_TURN_SYMMETRY"
  | "ORIENTATION_SENSITIVE"
  | "REFLECTION_SENSITIVE"
  | "CAN_CONTAIN_INNER"
  | "SUPPORTS_FILL";

export interface SpatialPrimitiveClassificationDescriptorAuditV2 {
  descriptorId: SpatialPrimitiveClassificationDescriptorIdV2;
  values: string[];
  frequencies: Record<string, number>;
  threeToOne: boolean;
  minorityIndex: number | null;
  supportsCorrectOdd: boolean;
}

export interface SpatialPrimitiveClassificationQuestionV2 {
  prototypeId: string;
  propertyId: SpatialPrimitiveClassificationPropertyIdV2;
  propertyDescription: string;
  primitiveIds: SpatialPrimitiveIdV2[];
  optionScenes: SpatialScene[];
  propertyVector: boolean[];
  correctOptionIndex: number;
  descriptorAudits: SpatialPrimitiveClassificationDescriptorAuditV2[];
  reinforcingDescriptorIds: SpatialPrimitiveClassificationDescriptorIdV2[];
  learnerExplanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

export const SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2: readonly SpatialPrimitiveClassificationPropertyIdV2[] = [
  "EVEN_SIDED_POLYGON",
  "VERTICAL_SYMMETRY",
  "HORIZONTAL_SYMMETRY",
  "HALF_TURN_SYMMETRY",
  "QUARTER_TURN_SYMMETRY",
  "HAS_BRANCH_JUNCTION",
  "HAS_TRUE_CROSSING",
  "PARTITIONED_FIGURE",
  "HALF_TURN_ONLY",
  "TWO_FREE_TERMINALS",
  "CLOSED_SHAPE",
  "POLYGON",
] as const;

const PROPERTY_DESCRIPTION: Record<SpatialPrimitiveClassificationPropertyIdV2, string> = {
  EVEN_SIDED_POLYGON: "the figure is a polygon with an even number of sides",
  VERTICAL_SYMMETRY: "the figure has vertical mirror symmetry",
  HORIZONTAL_SYMMETRY: "the figure has horizontal mirror symmetry",
  HALF_TURN_SYMMETRY: "the figure looks unchanged after a 180° rotation",
  QUARTER_TURN_SYMMETRY: "the figure looks unchanged after a 90° rotation",
  HAS_BRANCH_JUNCTION: "three or more line branches meet at one point",
  HAS_TRUE_CROSSING: "the figure contains a true crossing where lines continue through the meeting point",
  PARTITIONED_FIGURE: "the figure is divided into internal regions",
  HALF_TURN_ONLY: "the figure looks unchanged after 180° but changes after 90°",
  TWO_FREE_TERMINALS: "the open figure has exactly two free line ends",
  CLOSED_SHAPE: "the figure forms one closed basic shape",
  POLYGON: "the figure is a polygon made only of straight sides",
};

function propertySatisfied(entry: SpatialPrimitiveAuthorityEntryV2, propertyId: SpatialPrimitiveClassificationPropertyIdV2): boolean {
  const connectivity = getSpatialPrimitiveConnectivityV2(entry.primitiveId);
  switch (propertyId) {
    case "EVEN_SIDED_POLYGON": return entry.polygonSideCount !== null && entry.polygonSideCount % 2 === 0;
    case "VERTICAL_SYMMETRY": return entry.symmetry.vertical;
    case "HORIZONTAL_SYMMETRY": return entry.symmetry.horizontal;
    case "HALF_TURN_SYMMETRY": return entry.symmetry.rotational180;
    case "QUARTER_TURN_SYMMETRY": return entry.rotationPeriodQuarterTurns === 1;
    case "HAS_BRANCH_JUNCTION": return connectivity.junctionCount > 0;
    case "HAS_TRUE_CROSSING": return connectivity.crossingCount > 0;
    case "PARTITIONED_FIGURE": return entry.category === "PARTITIONED_FIGURE";
    case "HALF_TURN_ONLY": return entry.symmetry.rotational180 && entry.rotationPeriodQuarterTurns === 2;
    case "TWO_FREE_TERMINALS": return connectivity.terminalCount === 2;
    case "CLOSED_SHAPE": return entry.topology === "CLOSED" && entry.enclosedRegionCount === 1;
    case "POLYGON": return entry.polygonSideCount !== null && entry.topology === "CLOSED";
  }
}

function descriptorValue(entry: SpatialPrimitiveAuthorityEntryV2, descriptorId: SpatialPrimitiveClassificationDescriptorIdV2): string {
  const connectivity = getSpatialPrimitiveConnectivityV2(entry.primitiveId);
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
    case "VERTICAL_SYMMETRY": return String(entry.symmetry.vertical);
    case "HORIZONTAL_SYMMETRY": return String(entry.symmetry.horizontal);
    case "HALF_TURN_SYMMETRY": return String(entry.symmetry.rotational180);
    case "ORIENTATION_SENSITIVE": return String(entry.orientationSensitive);
    case "REFLECTION_SENSITIVE": return String(entry.reflectionSensitive);
    case "CAN_CONTAIN_INNER": return String(entry.canContainInner);
    case "SUPPORTS_FILL": return String(entry.supportsFill);
  }
}

const DESCRIPTOR_IDS: readonly SpatialPrimitiveClassificationDescriptorIdV2[] = [
  "CATEGORY", "TOPOLOGY", "POLYGON_PRESENCE", "SIDE_COUNT_EXACT", "SIDE_PARITY",
  "ENCLOSED_REGION_COUNT", "JUNCTION_COUNT", "TRUE_CROSSING_COUNT", "FREE_TERMINAL_COUNT", "ROTATION_PERIOD",
  "VERTICAL_SYMMETRY", "HORIZONTAL_SYMMETRY", "HALF_TURN_SYMMETRY",
  "ORIENTATION_SENSITIVE", "REFLECTION_SENSITIVE", "CAN_CONTAIN_INNER", "SUPPORTS_FILL",
] as const;

function auditDescriptor(
  entries: readonly SpatialPrimitiveAuthorityEntryV2[],
  descriptorId: SpatialPrimitiveClassificationDescriptorIdV2,
  correctOddIndex: number,
): SpatialPrimitiveClassificationDescriptorAuditV2 {
  const values = entries.map((entry) => descriptorValue(entry, descriptorId));
  const frequencies = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
  const counts = Object.values(frequencies).sort((a, b) => a - b);
  const threeToOne = counts.length === 2 && counts[0] === 1 && counts[1] === 3;
  let minorityIndex: number | null = null;
  if (threeToOne) {
    const minorityValue = Object.entries(frequencies).find(([, count]) => count === 1)?.[0];
    minorityIndex = minorityValue === undefined ? null : values.indexOf(minorityValue);
  }
  return {
    descriptorId,
    values,
    frequencies,
    threeToOne,
    minorityIndex,
    supportsCorrectOdd: !threeToOne || minorityIndex === correctOddIndex,
  };
}

function evidence(entry: SpatialPrimitiveAuthorityEntryV2, propertyId: SpatialPrimitiveClassificationPropertyIdV2): string {
  const connectivity = getSpatialPrimitiveConnectivityV2(entry.primitiveId);
  switch (propertyId) {
    case "EVEN_SIDED_POLYGON": return entry.polygonSideCount === null ? `${entry.label}: not a polygon` : `${entry.label}: ${entry.polygonSideCount} sides`;
    case "VERTICAL_SYMMETRY": return `${entry.label}: vertical symmetry ${entry.symmetry.vertical ? "present" : "absent"}`;
    case "HORIZONTAL_SYMMETRY": return `${entry.label}: horizontal symmetry ${entry.symmetry.horizontal ? "present" : "absent"}`;
    case "HALF_TURN_SYMMETRY": return `${entry.label}: 180° symmetry ${entry.symmetry.rotational180 ? "present" : "absent"}`;
    case "QUARTER_TURN_SYMMETRY": return `${entry.label}: repeats after ${entry.rotationPeriodQuarterTurns * 90}°`;
    case "HAS_BRANCH_JUNCTION": return `${entry.label}: ${connectivity.junctionCount} branch junction${connectivity.junctionCount === 1 ? "" : "s"}`;
    case "HAS_TRUE_CROSSING": return `${entry.label}: ${connectivity.crossingCount} true crossing${connectivity.crossingCount === 1 ? "" : "s"}`;
    case "PARTITIONED_FIGURE": return `${entry.label}: ${entry.category === "PARTITIONED_FIGURE" ? `${entry.enclosedRegionCount} internal regions` : "not divided into internal regions"}`;
    case "HALF_TURN_ONLY": return `${entry.label}: repeats after ${entry.rotationPeriodQuarterTurns * 90}°`;
    case "TWO_FREE_TERMINALS": return `${entry.label}: ${connectivity.terminalCount} free line end${connectivity.terminalCount === 1 ? "" : "s"}`;
    case "CLOSED_SHAPE": return `${entry.label}: ${entry.topology === "CLOSED" ? "closed" : "open"}`;
    case "POLYGON": return entry.polygonSideCount === null ? `${entry.label}: not a straight-sided polygon` : `${entry.label}: polygon with ${entry.polygonSideCount} sides`;
  }
}

const BASE_QUARTETS: readonly {
  propertyId: SpatialPrimitiveClassificationPropertyIdV2;
  primitiveIds: readonly [SpatialPrimitiveIdV2, SpatialPrimitiveIdV2, SpatialPrimitiveIdV2, SpatialPrimitiveIdV2];
}[] = [
  { propertyId: "EVEN_SIDED_POLYGON", primitiveIds: ["RECTANGLE", "TRAPEZIUM", "HEXAGON", "PENTAGON"] },
  { propertyId: "VERTICAL_SYMMETRY", primitiveIds: ["PLUS", "X_CROSS", "SIX_SPOKE", "ARROW_RIGHT"] },
  { propertyId: "HORIZONTAL_SYMMETRY", primitiveIds: ["PLUS", "X_CROSS", "SIX_SPOKE", "THREE_SPOKE"] },
  { propertyId: "HALF_TURN_SYMMETRY", primitiveIds: ["Z_SHAPE", "TICK_DIAGONAL", "SQUARE_DIAGONAL_DIVIDED", "TRIANGLE_MEDIAN_DIVIDED"] },
  { propertyId: "QUARTER_TURN_SYMMETRY", primitiveIds: ["CIRCLE", "SQUARE", "DIAMOND", "SEMICIRCLE"] },
  { propertyId: "HAS_BRANCH_JUNCTION", primitiveIds: ["T_SHAPE", "THREE_SPOKE", "ARROW_RIGHT", "CHEVRON_RIGHT"] },
  { propertyId: "HAS_TRUE_CROSSING", primitiveIds: ["PLUS", "X_CROSS", "SIX_SPOKE", "ARROW_RIGHT"] },
  { propertyId: "PARTITIONED_FIGURE", primitiveIds: ["SQUARE_CROSS_DIVIDED", "CIRCLE_CROSS_DIVIDED", "CIRCLE_DIAMETER", "RECTANGLE"] },
  { propertyId: "HALF_TURN_ONLY", primitiveIds: ["RECTANGLE", "HEXAGON", "PARALLEL_PAIR", "PLUS"] },
  { propertyId: "TWO_FREE_TERMINALS", primitiveIds: ["L_SHAPE", "Z_SHAPE", "ZIGZAG", "T_SHAPE"] },
  { propertyId: "CLOSED_SHAPE", primitiveIds: ["TRIANGLE", "PENTAGON", "SEMICIRCLE", "V_SHAPE"] },
  { propertyId: "POLYGON", primitiveIds: ["TRIANGLE", "PENTAGON", "TRAPEZIUM", "SEMICIRCLE"] },
] as const;

function rotateForOddSlot<T>(items: readonly [T, T, T, T], desiredOddIndex: number): [T, T, T, T] {
  const offset = (3 - desiredOddIndex + 4) % 4;
  return [0, 1, 2, 3].map((index) => items[(index + offset) % 4]!) as [T, T, T, T];
}

export function buildSpatialPrimitiveClassificationProofV2(): SpatialPrimitiveClassificationQuestionV2[] {
  return BASE_QUARTETS.map((base, index) => {
    const correctOptionIndex = index % 4;
    const primitiveIds = rotateForOddSlot(base.primitiveIds, correctOptionIndex);
    const entries = primitiveIds.map(getSpatialPrimitiveV2);
    const propertyVector = entries.map((entry) => propertySatisfied(entry, base.propertyId));
    if (propertyVector.filter(Boolean).length !== 3 || propertyVector[correctOptionIndex] !== false) {
      throw new Error(`${base.propertyId}: property vector does not produce exactly three common figures and one intended odd figure.`);
    }
    const descriptorAudits = DESCRIPTOR_IDS.map((descriptorId) => auditDescriptor(entries, descriptorId, correctOptionIndex));
    const competing = descriptorAudits.filter((audit) => audit.threeToOne && !audit.supportsCorrectOdd);
    if (competing.length > 0) {
      throw new Error(`${base.propertyId}: competing visible 3-to-1 descriptor(s): ${competing.map((entry) => `${entry.descriptorId}->${entry.minorityIndex}`).join(", ")}`);
    }
    const optionScenes = primitiveIds.map((primitiveId, optionIndex) =>
      buildSpatialPrimitiveInstanceSceneV2(
        primitiveId,
        `FCL-001-V2-${String(index + 1).padStart(2, "0")}-OPTION-${optionIndex + 1}`,
        { scale: 0.9, idPrefix: `fcl-v2-${index + 1}-${optionIndex + 1}` },
      ),
    );
    const sceneFingerprints = optionScenes.map(spatialSceneSemanticFingerprint);
    if (new Set(sceneFingerprints).size !== 4) throw new Error(`${base.propertyId}: option scenes are not unique.`);
    const labels = entries.map((entry) => entry.label);
    const application = entries.map((entry, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${evidence(entry, base.propertyId)} ${propertyVector[optionIndex] ? "✓" : "✗"}`,
    ).join("  ");
    return {
      prototypeId: `FCL-001-V2-${String(index + 1).padStart(2, "0")}`,
      propertyId: base.propertyId,
      propertyDescription: PROPERTY_DESCRIPTION[base.propertyId],
      primitiveIds: [...primitiveIds],
      optionScenes,
      propertyVector,
      correctOptionIndex,
      descriptorAudits,
      reinforcingDescriptorIds: descriptorAudits.filter((audit) => audit.threeToOne && audit.supportsCorrectOdd).map((audit) => audit.descriptorId),
      learnerExplanation: {
        observation: `Compare the visible structure of ${labels.join(", ")}.`,
        rule: `Three figures share this relationship: ${PROPERTY_DESCRIPTION[base.propertyId]}.`,
        application,
        check: `Only option ${String.fromCharCode(65 + correctOptionIndex)} breaks the relationship. The broad visible-feature audit found no 3-to-1 feature pointing to a different option.`,
      },
      lifecycle: {
        permanentQlId: null,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
    };
  });
}
