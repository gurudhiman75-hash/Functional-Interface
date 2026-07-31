import {
  getMenCp008AllPrototypeIds,
  MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS,
  type MenCp008AnyPrototypeId,
} from "./compression";

export type MenCp008CoverageDimension =
  | "DIRECT_MEASUREMENT"
  | "SINGLE_EVIDENCE_INVERSE"
  | "MULTI_EVIDENCE_INVERSE"
  | "RATIO_AND_COMPARISON"
  | "SCALING_AND_CHANGE"
  | "ROLLER_APPLICATION"
  | "COST_AND_MATERIAL"
  | "CAPACITY"
  | "TENT_APPLICATION"
  | "EXACT_NUMBER_KIND"
  | "PI_POLICY"
  | "OWNERSHIP_BOUNDARY";

export interface MenCp008CoverageRow {
  rowId: string;
  dimension: MenCp008CoverageDimension;
  learnerContract: string;
  evidence: readonly MenCp008AnyPrototypeId[];
  disposition: "COVERED" | "COVERED_AS_REPRESENTATION" | "EXCLUDED_TO_OWNER";
  owner?: string;
}

export const MEN_CP_008_NO_GAP_MATRIX: readonly MenCp008CoverageRow[] = [
  {
    rowId: "DIRECT-CYLINDER-MEASURE",
    dimension: "DIRECT_MEASUREMENT",
    learnerContract: "Cylinder volume, curved surface and total surface from stated dimensions",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-VOLUME",
      "MEN-CP008-PROT-CYLINDER-CSA",
      "MEN-CP008-PROT-CYLINDER-TSA",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "DIRECT-CONE-MEASURE",
    dimension: "DIRECT_MEASUREMENT",
    learnerContract: "Cone volume, curved surface and total surface from stated dimensions",
    evidence: [
      "MEN-CP008-PROT-CONE-VOLUME",
      "MEN-CP008-PROT-CONE-CSA",
      "MEN-CP008-PROT-CONE-TSA",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CYLINDER-VOLUME-INVERSES",
    dimension: "SINGLE_EVIDENCE_INVERSE",
    learnerContract: "Recover cylinder radius or height from volume evidence",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME",
      "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CYLINDER-SURFACE-INVERSES",
    dimension: "SINGLE_EVIDENCE_INVERSE",
    learnerContract: "Recover cylinder radius or height from curved or total surface evidence",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA",
      "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA",
      "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA",
      "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-TSA",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CONE-RIGHT-TRIANGLE-INVERSES",
    dimension: "SINGLE_EVIDENCE_INVERSE",
    learnerContract: "Recover cone slant height, height or radius from two right-triangle dimensions",
    evidence: [
      "MEN-CP008-PROT-CONE-SLANT-HEIGHT",
      "MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT",
      "MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT",
      "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CONE-VOLUME-INVERSES",
    dimension: "SINGLE_EVIDENCE_INVERSE",
    learnerContract: "Recover cone radius or height from volume evidence",
    evidence: [
      "MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME",
      "MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CONE-RADIUS-SURD-FROM-VOLUME",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CONE-SURFACE-INVERSES",
    dimension: "SINGLE_EVIDENCE_INVERSE",
    learnerContract: "Recover cone radius or slant height from curved or total surface evidence",
    evidence: [
      "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-CSA",
      "MEN-CP008-W1-PROT-CONE-SLANT-FROM-CSA",
      "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-TSA",
      "MEN-CP008-W1-PROT-CONE-SLANT-FROM-TSA",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CYLINDER-MULTI-EVIDENCE",
    dimension: "MULTI_EVIDENCE_INVERSE",
    learnerContract: "Recover cylinder dimensions or volume from two surface measures or a dimension ratio",
    evidence: [
      "MEN-CP008-W2-PROT-CYLINDER-RADIUS-FROM-TSA-CSA-DIFFERENCE",
      "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-TSA",
      "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME",
      "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CYLINDER-CHAINED-VOLUME",
    dimension: "MULTI_EVIDENCE_INVERSE",
    learnerContract: "Recover cylinder volume from surface evidence plus radius",
    evidence: [
      "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-RADIUS",
      "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-TSA-RADIUS",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CONE-CHAINED-VOLUME",
    dimension: "MULTI_EVIDENCE_INVERSE",
    learnerContract: "Recover cone volume from surface evidence plus radius or from radius/slant evidence",
    evidence: [
      "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-RADIUS-SLANT",
      "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-HEIGHT-SLANT",
      "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-CSA-RADIUS",
      "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-TSA-RADIUS",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CONE-MULTI-EVIDENCE",
    dimension: "MULTI_EVIDENCE_INVERSE",
    learnerContract: "Recover cone height, slant height or curved area through chained volume/surface evidence",
    evidence: [
      "MEN-CP008-W2-PROT-CONE-HEIGHT-FROM-CSA-TSA",
      "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT",
      "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "SURFACE-RATIOS",
    dimension: "RATIO_AND_COMPARISON",
    learnerContract: "Curved-to-total area ratio and inverse dimension recovery from area ratio",
    evidence: [
      "MEN-CP008-W1-PROT-CYLINDER-CSA-TSA-RATIO",
      "MEN-CP008-W1-PROT-CONE-CSA-TSA-RATIO",
      "MEN-CP008-W1-PROT-CYLINDER-RADIUS-FROM-AREA-RATIO",
      "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-AREA-RATIO",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "LIKE-SOLID-VOLUME-RATIOS",
    dimension: "RATIO_AND_COMPARISON",
    learnerContract: "Volume ratios of like cylinders or like cones from dimension ratios",
    evidence: [
      "MEN-CP008-W2-PROT-CYLINDER-VOLUME-RATIO-DIMENSION-RATIOS",
      "MEN-CP008-W2-PROT-CONE-VOLUME-RATIO-DIMENSION-RATIOS",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "CONE-DERIVED-RATIOS",
    dimension: "RATIO_AND_COMPARISON",
    learnerContract: "Cone height or curved-area ratios from volume, radius and slant-height ratios",
    evidence: [
      "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS",
      "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "CROSS-SOLID-COMPARISON",
    dimension: "RATIO_AND_COMPARISON",
    learnerContract: "Cylinder-cone volume or total-surface comparison under stated relations",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO",
      "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "EQUAL-VOLUME-DIRECTION",
    dimension: "RATIO_AND_COMPARISON",
    learnerContract: "Recover either cylinder or cone height under equal-volume evidence",
    evidence: [
      "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT",
      "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "VOLUME-SCALING",
    dimension: "SCALING_AND_CHANGE",
    learnerContract: "Percentage change in cylinder or cone volume under radius/height scaling",
    evidence: [
      "MEN-CP008-W1-PROT-CYLINDER-VOLUME-PERCENT-CHANGE",
      "MEN-CP008-W1-PROT-CONE-VOLUME-PERCENT-CHANGE",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "ROLLER-FORWARD-AND-COUNT",
    dimension: "ROLLER_APPLICATION",
    learnerContract: "Swept area and number of revolutions for a cylindrical roller",
    evidence: [
      "MEN-CP008-W2-PROT-ROLLER-SWEPT-AREA",
      "MEN-CP008-PROT-ROLLER-REVOLUTIONS",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "ROLLER-INVERSE-DIMENSION",
    dimension: "ROLLER_APPLICATION",
    learnerContract: "Recover missing roller radius or length from swept area",
    evidence: [
      "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA",
      "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "SURFACE-MATERIAL-COST",
    dimension: "COST_AND_MATERIAL",
    learnerContract: "Canvas, coating or material cost from required cylinder/cone surface",
    evidence: [
      "MEN-CP008-PROT-CONE-CANVAS-COST",
      "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "CYLINDER-CAPACITY",
    dimension: "CAPACITY",
    learnerContract: "Cylinder capacity with exact litre conversion and declared pi policy",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7",
      "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "TENT-CLOTH",
    dimension: "TENT_APPLICATION",
    learnerContract: "Conical tent cloth area or roll length from dimensions and cloth width",
    evidence: [
      "MEN-CP008-PROT-CONE-CANVAS-COST",
      "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH",
    ],
    disposition: "COVERED",
  },
  {
    rowId: "TENT-FLOOR-AIR",
    dimension: "TENT_APPLICATION",
    learnerContract: "Conical tent height from floor-space and air-volume requirements",
    evidence: ["MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR"],
    disposition: "COVERED",
  },
  {
    rowId: "EXACT-RATIONAL-SURD",
    dimension: "EXACT_NUMBER_KIND",
    learnerContract: "Rational and exact-surd lengths",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "EXACT-PI-PI-SURD",
    dimension: "EXACT_NUMBER_KIND",
    learnerContract: "Exact pi and pi-surd area or volume outputs",
    evidence: [
      "MEN-CP008-PROT-CONE-VOLUME",
      "MEN-CP008-W2-PROT-CONE-CSA-PI-SURD",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  {
    rowId: "PI-POLICIES",
    dimension: "PI_POLICY",
    learnerContract: "Exact pi, declared 22/7 and declared 3.14 policies",
    evidence: [
      "MEN-CP008-PROT-CYLINDER-VOLUME",
      "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7",
      "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14",
    ],
    disposition: "COVERED_AS_REPRESENTATION",
  },
  ...MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS.map((exclusion, index) => ({
    rowId: `OWNERSHIP-${index + 1}`,
    dimension: "OWNERSHIP_BOUNDARY" as const,
    learnerContract: exclusion.families.join(", "),
    evidence: [] as readonly MenCp008AnyPrototypeId[],
    disposition: "EXCLUDED_TO_OWNER" as const,
    owner: exclusion.owner,
  })),
] as const;

export const MEN_CP_008_REQUIRED_COVERAGE_DIMENSIONS: readonly MenCp008CoverageDimension[] = [
  "DIRECT_MEASUREMENT",
  "SINGLE_EVIDENCE_INVERSE",
  "MULTI_EVIDENCE_INVERSE",
  "RATIO_AND_COMPARISON",
  "SCALING_AND_CHANGE",
  "ROLLER_APPLICATION",
  "COST_AND_MATERIAL",
  "CAPACITY",
  "TENT_APPLICATION",
  "EXACT_NUMBER_KIND",
  "PI_POLICY",
  "OWNERSHIP_BOUNDARY",
] as const;

export function auditMenCp008NoKnownGapMatrix() {
  const allPrototypeIds = getMenCp008AllPrototypeIds();
  const executableRows = MEN_CP_008_NO_GAP_MATRIX.filter(
    (row) => row.disposition !== "EXCLUDED_TO_OWNER",
  );
  const evidenceIds = executableRows.flatMap((row) => row.evidence);
  const unknownEvidence = evidenceIds.filter(
    (prototypeId) => !allPrototypeIds.includes(prototypeId),
  );
  const coveredDimensions = new Set(MEN_CP_008_NO_GAP_MATRIX.map((row) => row.dimension));
  const missingDimensions = MEN_CP_008_REQUIRED_COVERAGE_DIMENSIONS.filter(
    (dimension) => !coveredDimensions.has(dimension),
  );
  const rowsWithoutEvidence = executableRows.filter((row) => row.evidence.length === 0);
  const ownershipRows = MEN_CP_008_NO_GAP_MATRIX.filter(
    (row) => row.disposition === "EXCLUDED_TO_OWNER",
  );

  return {
    rows: MEN_CP_008_NO_GAP_MATRIX.length,
    executableRows: executableRows.length,
    ownershipRows: ownershipRows.length,
    coveredDimensions: coveredDimensions.size,
    requiredDimensions: MEN_CP_008_REQUIRED_COVERAGE_DIMENSIONS.length,
    uniqueEvidencePrototypes: new Set(evidenceIds).size,
    unknownEvidence,
    missingDimensions,
    rowsWithoutEvidence: rowsWithoutEvidence.map((row) => row.rowId),
    ownershipRowsWithoutOwner: ownershipRows
      .filter((row) => !row.owner)
      .map((row) => row.rowId),
    verdict:
      unknownEvidence.length === 0 &&
      missingDimensions.length === 0 &&
      rowsWithoutEvidence.length === 0 &&
      ownershipRows.every((row) => Boolean(row.owner))
        ? "PASS_NO_KNOWN_CP008_GAP_SOURCE_RECHECK_PENDING"
        : "FAIL_COVERAGE_MATRIX",
  } as const;
}
