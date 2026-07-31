import { MEN_CP_008_PROTOTYPES } from "../cp008-foundation/registry";
import { MEN_CP_008_WAVE_01_PROTOTYPES } from "../cp008-gap-wave-01/registry";
import { MEN_CP_008_WAVE_02_PROTOTYPES } from "../cp008-gap-wave-02/registry";
import { MEN_CP_008_WAVE_03_PROTOTYPES } from "../cp008-source-gap-wave-03/registry";
import { MEN_CP_008_WAVE_04_PROTOTYPES } from "../cp008-source-gap-wave-04/registry";

export type MenCp008AnyPrototypeId =
  | (typeof MEN_CP_008_PROTOTYPES)[number]["prototypeId"]
  | (typeof MEN_CP_008_WAVE_01_PROTOTYPES)[number]["prototypeId"]
  | (typeof MEN_CP_008_WAVE_02_PROTOTYPES)[number]["prototypeId"]
  | (typeof MEN_CP_008_WAVE_03_PROTOTYPES)[number]["prototypeId"]
  | (typeof MEN_CP_008_WAVE_04_PROTOTYPES)[number]["prototypeId"];

export interface MenCp008CompressionGroup {
  groupId: string;
  decision: "MERGE_CANDIDATE";
  canonicalReasoning: string;
  members: readonly MenCp008AnyPrototypeId[];
}

export const MEN_CP_008_SETTLED_MERGE_CANDIDATES: readonly MenCp008CompressionGroup[] = [
  {
    groupId: "CYLINDER_DIRECT_VOLUME_AND_CAPACITY",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Apply cylinder volume once; capacity unit and declared pi policy are output representations.",
    members: [
      "MEN-CP008-PROT-CYLINDER-VOLUME",
      "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7",
      "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14",
    ],
  },
  {
    groupId: "CYLINDER_DIRECT_SURFACE_STATE",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Select curved or total included surface, then apply the corresponding cylinder area formula.",
    members: ["MEN-CP008-PROT-CYLINDER-CSA", "MEN-CP008-PROT-CYLINDER-TSA"],
  },
  {
    groupId: "CYLINDER_RADIUS_FROM_VOLUME_EXACT_KIND",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Rearrange cylinder volume for radius; rational and surd answers are exact-state variants.",
    members: [
      "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME",
    ],
  },
  {
    groupId: "CONE_DIRECT_SURFACE_STATE_AND_EXACT_KIND",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Select curved or total cone surface; pi-surd output is an exact representation, not a new task.",
    members: [
      "MEN-CP008-PROT-CONE-CSA",
      "MEN-CP008-PROT-CONE-TSA",
      "MEN-CP008-W2-PROT-CONE-CSA-PI-SURD",
    ],
  },
  {
    groupId: "CONE_SLANT_FROM_RADIUS_HEIGHT_EXACT_KIND",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Use the same right-triangle relation; integral and surd slant heights are state variants.",
    members: [
      "MEN-CP008-PROT-CONE-SLANT-HEIGHT",
      "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD",
    ],
  },
  {
    groupId: "CONE_RADIUS_FROM_VOLUME_EXACT_KIND",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Rearrange cone volume for radius; rational and surd outputs share one inverse contract.",
    members: [
      "MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME",
      "MEN-CP008-W2-PROT-CONE-RADIUS-SURD-FROM-VOLUME",
    ],
  },
  {
    groupId: "VOLUME_PERCENT_CHANGE_BY_R_SQUARED_H",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Cylinder and cone volume percentage changes both use the same r-squared-h scale factor.",
    members: [
      "MEN-CP008-W1-PROT-CYLINDER-VOLUME-PERCENT-CHANGE",
      "MEN-CP008-W1-PROT-CONE-VOLUME-PERCENT-CHANGE",
    ],
  },
  {
    groupId: "LIKE_SOLID_VOLUME_RATIO_BY_DIMENSION_RATIOS",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "For either like cylinders or like cones, the common shape constant cancels and volume ratio is r-squared-h.",
    members: [
      "MEN-CP008-W2-PROT-CYLINDER-VOLUME-RATIO-DIMENSION-RATIOS",
      "MEN-CP008-W2-PROT-CONE-VOLUME-RATIO-DIMENSION-RATIOS",
    ],
  },
  {
    groupId: "CURVED_TO_TOTAL_SURFACE_RATIO",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Cancel the common pi-radius factor and compare the curved contribution with the complete surface contribution.",
    members: [
      "MEN-CP008-W1-PROT-CYLINDER-CSA-TSA-RATIO",
      "MEN-CP008-W1-PROT-CONE-CSA-TSA-RATIO",
    ],
  },
  {
    groupId: "SOLID_SURFACE_MATERIAL_COST",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Choose the required cylinder or cone surface, calculate its area, then multiply by the material rate.",
    members: [
      "MEN-CP008-PROT-CONE-CANVAS-COST",
      "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST",
    ],
  },
  {
    groupId: "EQUAL_VOLUME_CYLINDER_CONE_MISSING_HEIGHT_DIRECTION",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Conserve one cylinder-cone volume equality and solve for the missing height; target solid is a parameter with the same length answer semantic.",
    members: [
      "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT",
      "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT",
    ],
  },
  {
    groupId: "ROLLER_INVERSE_DIMENSION_DIRECTION",
    decision: "MERGE_CANDIDATE",
    canonicalReasoning: "Solve the same roller swept-area equation for one missing linear dimension; radius versus roller length is a target-role parameter.",
    members: [
      "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA",
      "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA",
    ],
  },
] as const;

export const MEN_CP_008_MERGE_REVIEW_GROUPS: readonly MenCp008CompressionGroup[] = [] as const;

export const MEN_CP_008_STANDALONE_CANDIDATES: readonly MenCp008AnyPrototypeId[] = [
  "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME",
  "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA",
  "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA",
  "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA",
  "MEN-CP008-PROT-ROLLER-REVOLUTIONS",
  "MEN-CP008-PROT-CONE-VOLUME",
  "MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT",
  "MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT",
  "MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME",
  "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO",

  "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-TSA",
  "MEN-CP008-W1-PROT-CYLINDER-RADIUS-FROM-AREA-RATIO",
  "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-AREA-RATIO",
  "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-CSA",
  "MEN-CP008-W1-PROT-CONE-SLANT-FROM-CSA",
  "MEN-CP008-W1-PROT-CONE-SLANT-FROM-TSA",
  "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-TSA",
  "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-RADIUS-SLANT",
  "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-HEIGHT-SLANT",

  "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-RADIUS",
  "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-TSA-RADIUS",
  "MEN-CP008-W2-PROT-CYLINDER-RADIUS-FROM-TSA-CSA-DIFFERENCE",
  "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-TSA",
  "MEN-CP008-W2-PROT-ROLLER-SWEPT-AREA",
  "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-CSA-RADIUS",
  "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-TSA-RADIUS",
  "MEN-CP008-W2-PROT-CONE-HEIGHT-FROM-CSA-TSA",

  "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO",
  "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME",
  "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT",
  "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT",
  "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS",
  "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS",
  "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT",
  "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH",
  "MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR",

  "MEN-CP008-W4-PROT-CONE-SIMILAR-HEIGHT-VOLUME-FRACTION",
  "MEN-CP008-W4-PROT-CONE-SEMICIRCLE-SECTOR-HEIGHT",
  "MEN-CP008-W4-PROT-CYLINDER-RECTANGLE-ROLLING-VOLUME-RATIO",
  "MEN-CP008-W4-PROT-CYLINDER-MINIMUM-TSA-HEIGHT",
] as const;

export const MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS = [
  { owner: "MEN-CP-010", families: ["frustums", "bucket/frustum measurement", "remaining frustum after a parallel cut"] },
  { owner: "MEN-CP-011", families: ["open solids", "hollow solids", "shells", "wall thickness", "exposed-face variants"] },
  { owner: "MEN-CP-012", families: ["melting", "recasting", "number of smaller solids", "volume conservation transformations"] },
  { owner: "MEN-CP-013", families: ["composite solids", "inscribed solids", "drilled solids", "displacement"] },
  { owner: "PIPES_AND_CISTERNS", families: ["fill or empty time for cylindrical or conical vessels"] },
  { owner: "TRIGONOMETRY", families: ["decisively angle-led height or slant recovery"] },
] as const;

export const MEN_CP_008_FREEZE_BLOCKERS: readonly string[] = [] as const;

export function getMenCp008AllPrototypeIds(): MenCp008AnyPrototypeId[] {
  return [
    ...MEN_CP_008_PROTOTYPES,
    ...MEN_CP_008_WAVE_01_PROTOTYPES,
    ...MEN_CP_008_WAVE_02_PROTOTYPES,
    ...MEN_CP_008_WAVE_03_PROTOTYPES,
    ...MEN_CP_008_WAVE_04_PROTOTYPES,
  ].map((definition) => definition.prototypeId);
}

export function auditMenCp008CompressionReadiness() {
  const allPrototypeIds = getMenCp008AllPrototypeIds();
  const groupedIds = MEN_CP_008_SETTLED_MERGE_CANDIDATES.flatMap((group) => group.members);
  const classifiedIds = [...groupedIds, ...MEN_CP_008_STANDALONE_CANDIDATES];
  const allSet = new Set(allPrototypeIds);
  const classifiedSet = new Set(classifiedIds);
  const duplicateClassifications = classifiedIds.filter(
    (prototypeId, index) => classifiedIds.indexOf(prototypeId) !== index,
  );
  const unclassified = allPrototypeIds.filter((prototypeId) => !classifiedSet.has(prototypeId));
  const foreignClassifications = classifiedIds.filter((prototypeId) => !allSet.has(prototypeId));
  const provisionalMinimumQlFamilies =
    MEN_CP_008_STANDALONE_CANDIDATES.length + MEN_CP_008_SETTLED_MERGE_CANDIDATES.length;

  return {
    prototypeCount: allPrototypeIds.length,
    uniquePrototypeCount: allSet.size,
    classifiedCount: classifiedIds.length,
    uniqueClassifiedCount: classifiedSet.size,
    standaloneCandidates: MEN_CP_008_STANDALONE_CANDIDATES.length,
    settledMergeGroups: MEN_CP_008_SETTLED_MERGE_CANDIDATES.length,
    mergeReviewGroups: MEN_CP_008_MERGE_REVIEW_GROUPS.length,
    provisionalMinimumQlFamilies,
    provisionalMaximumQlFamilies: provisionalMinimumQlFamilies,
    duplicateClassifications,
    unclassified,
    foreignClassifications,
    freezeBlockers: [...MEN_CP_008_FREEZE_BLOCKERS],
    readyToFreeze:
      allPrototypeIds.length === 66 &&
      allSet.size === 66 &&
      classifiedIds.length === 66 &&
      classifiedSet.size === 66 &&
      duplicateClassifications.length === 0 &&
      unclassified.length === 0 &&
      foreignClassifications.length === 0 &&
      MEN_CP_008_MERGE_REVIEW_GROUPS.length === 0 &&
      MEN_CP_008_FREEZE_BLOCKERS.length === 0,
  };
}
