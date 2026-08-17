import { MEN_CP_012_PROTOTYPES } from "./registry";
import { MEN_CP_012_DISCOVERY_V2_DEFINITIONS } from "./discovery-v2";
import { MEN_CP_012_SATURATION_V3_DEFINITIONS } from "./saturation-v3";

export const MEN_CP_012_MERGE_SPLIT_V4_AUTHORITY =
  "MEN-CP012-MERGE-SPLIT-V4-V1" as const;

export type MenCp012CanonicalClusterId =
  | "RECAST_COUNT_DIRECT"
  | "RECAST_LINEAR_DIMENSION_DIRECT"
  | "RECAST_SQUARE_ROOT_DIMENSION_INVERSE"
  | "RECAST_CUBE_ROOT_DIMENSION_INVERSE"
  | "DRAWING_ROLLING_LENGTH_DIRECT"
  | "DRAWING_ROLLING_CROSS_SECTION_INVERSE"
  | "COMBINED_SOURCE_RECAST"
  | "LOSS_AWARE_RECAST_GIVEN"
  | "LOSS_YIELD_PERCENT_UNKNOWN"
  | "HOLLOW_SOURCE_MATERIAL_RECAST"
  | "HOLLOW_TARGET_LENGTH_DIRECT"
  | "HOLLOW_TARGET_THICKNESS_INVERSE"
  | "RECAST_THEN_SECONDARY_MEASURE";

export type MenCp012AnswerSemantic =
  | "COUNT"
  | "LENGTH"
  | "LENGTH_OR_RATIO"
  | "PERCENT"
  | "SECONDARY_PERCENT";

export interface MenCp012CanonicalCluster {
  readonly clusterId: MenCp012CanonicalClusterId;
  readonly title: string;
  readonly governingInference: string;
  readonly reasoningSignature: string;
  readonly splitReason: string;
  readonly coreEvidenceIds: readonly string[];
  readonly representationEvidenceIds: readonly string[];
  readonly answerSemantic: MenCp012AnswerSemantic;
  readonly ownership:
    | "CP012_RECAST_CONSERVATION"
    | "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY";
}

export const MEN_CP_012_CANONICAL_CLUSTERS: readonly MenCp012CanonicalCluster[] = [
  {
    clusterId: "RECAST_COUNT_DIRECT",
    title: "Direct recasting count by material-volume ratio",
    governingInference: "For zero-loss recasting, required unit count equals total source/target material volume divided by one unit volume; unit and shape wording are representations.",
    reasoningSignature: "n = Vmaterial / Vone-unit",
    splitReason: "Count is a discrete quotient solve and should not be mixed with inverse dimension recovery.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-SPHERE-TO-SMALL-SPHERES-COUNT",
      "MEN-CP012-PROT-CYLINDER-TO-SPHERES-COUNT",
      "V3-MANY-SPHERES-TO-CYLINDER-RELATIVE-N",
    ],
    representationEvidenceIds: [
      "MEN-CP012-PROT-CUBE-TO-SMALL-CUBES-COUNT",
      "MEN-CP012-PROT-CUBIC-METRE-TO-CM-CUBES",
      "CP012-D2-SOURCE-SPHERE-COUNT-TO-CYLINDER",
      "CP012-D2-METRE-TO-MM-CUBE-COUNT",
      "V3-COINS-DIAMETER-THICKNESS-TO-CUBOID-COUNT",
      "V3-COINS-CIRCUMFERENCE-THICKNESS-TO-CUBOID-COUNT",
    ],
    answerSemantic: "COUNT",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "RECAST_LINEAR_DIMENSION_DIRECT",
    title: "Single-source recasting with a first-power target dimension",
    governingInference: "Equate source and target volumes and isolate a target height/length that occurs to the first power; ratio and rounding requests remain representations of the same solve.",
    reasoningSignature: "Vsource = K × x  =>  x = Vsource/K",
    splitReason: "First-power recovery is materially simpler than square-root/cube-root dimension recovery and supports distinct distractor logic.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-CYLINDER-TO-CONE-HEIGHT",
      "MEN-CP012-PROT-SPHERE-TO-CYLINDER-HEIGHT",
    ],
    representationEvidenceIds: [
      "MEN-CP012-PROT-CONE-TO-CYLINDER-HEIGHT",
      "V3-SPHERE-TO-CYLINDER-RATIO-H-R",
      "V3-SPHERE-TO-CYLINDER-DECIMAL-HEIGHT",
    ],
    answerSemantic: "LENGTH_OR_RATIO",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "RECAST_SQUARE_ROOT_DIMENSION_INVERSE",
    title: "Recasting with square-root radius/diameter recovery",
    governingInference: "After volume conservation, isolate a squared radius/diameter term and take the positive square root; derived ratio requests occur only after the root recovery.",
    reasoningSignature: "x² = Vsource/K  =>  x = √(Vsource/K)",
    splitReason: "Square-root target recovery is a distinct solve path from first-power and cube-root dimensions.",
    coreEvidenceIds: [
      "CP012-D2-CYLINDER-RADIUS-FROM-SPHERE-COUNT",
      "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO",
    ],
    representationEvidenceIds: [],
    answerSemantic: "LENGTH_OR_RATIO",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "RECAST_CUBE_ROOT_DIMENSION_INVERSE",
    title: "Recasting with cube-root side/radius recovery",
    governingInference: "When the unknown is the sole linear dimension of a cube/sphere-type volume, conserve material, isolate x³, and take the positive cube root.",
    reasoningSignature: "x³ = Vmaterial/K  =>  x = ∛(Vmaterial/K)",
    splitReason: "Cube-root dimension recovery is a stable reasoning identity across source/target direction and same/cross-shape wording.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-CUBOID-TO-CUBE-SIDE",
      "CP012-D2-SPHERE-TARGET-RADIUS-FROM-COUNT",
    ],
    representationEvidenceIds: [
      "CP012-D2-SPHERE-SOURCE-RADIUS-FROM-COUNT",
      "CP012-D2-SMALL-CUBE-SIDE-FROM-COUNT",
      "CP012-D2-SOURCE-CUBE-SIDE-FROM-COUNT",
    ],
    answerSemantic: "LENGTH",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "DRAWING_ROLLING_LENGTH_DIRECT",
    title: "Drawing/rolling conservation with final length as the unknown",
    governingInference: "Preserve cross-sectional area × length (or width × thickness × length) and solve the new length; diameter/radius and final-unit wording are representations.",
    reasoningSignature: "A1L1 = A2L2  =>  L2 = A1L1/A2",
    splitReason: "Direct length expansion after drawing/rolling has a stable inverse-area shortcut and differs from recovering cross-section itself.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-CYLINDER-TO-WIRE-LENGTH",
      "MEN-CP012-PROT-SLAB-TO-THIN-SHEET-LENGTH",
    ],
    representationEvidenceIds: [
      "MEN-CP012-PROT-ROD-TO-WIRE-METRE-CONVERSION",
      "CP012-D2-WIRE-DIAMETER-PHRASING",
    ],
    answerSemantic: "LENGTH",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "DRAWING_ROLLING_CROSS_SECTION_INVERSE",
    title: "Drawing/rolling conservation with radius/thickness as the unknown",
    governingInference: "Conserve material in a wire/plate transformation, then recover the changed cross-sectional dimension from final length and the remaining dimensions.",
    reasoningSignature: "Across-section = V/L; recover r by √ when circular, thickness linearly when rectangular",
    splitReason: "The unknown is cross-sectional rather than longitudinal; this creates different rearrangement/root traps from direct length questions.",
    coreEvidenceIds: [
      "CP012-D2-WIRE-RADIUS-FROM-LENGTH",
      "CP012-D2-SHEET-THICKNESS-INVERSE",
    ],
    representationEvidenceIds: [
      "V3-SPHERE-TO-WIRE-RADIUS-MIXED-UNITS",
    ],
    answerSemantic: "LENGTH",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "COMBINED_SOURCE_RECAST",
    title: "Multiple source solids combined before recasting",
    governingInference: "Add all usable source volumes first, then equate their sum to the target volume and recover the requested target dimension.",
    reasoningSignature: "ΣVsource = Vtarget",
    splitReason: "Summing heterogeneous/equal source solids is the decisive added reasoning and remains stable across target shape/root type.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-TWO-SPHERES-TO-CYLINDER-HEIGHT",
      "CP012-D2-CYLINDER-PLUS-CONE-TO-CYLINDER",
      "V3-UNEQUAL-SPHERES-TO-SPHERE-RADIUS",
    ],
    representationEvidenceIds: [
      "MEN-CP012-PROT-MANY-CONES-TO-ONE-CYLINDER",
    ],
    answerSemantic: "LENGTH",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "LOSS_AWARE_RECAST_GIVEN",
    title: "Recasting with a stated loss/retained-material fraction",
    governingInference: "Apply the retained fraction to source material before equating it to target material; the unknown may be count or a source/target dimension.",
    reasoningSignature: "(1−loss) × Vsource = Vtarget-total",
    splitReason: "A given loss factor is a reusable modifier identity distinct from estimating the loss/yield percentage itself.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-CUBE-WASTAGE-TO-SMALL-CUBES",
      "MEN-CP012-PROT-WASTAGE-INVERSE-CYLINDER-HEIGHT",
      "CP012-D2-SOURCE-SPHERE-COUNT-WITH-WASTAGE",
    ],
    representationEvidenceIds: [],
    answerSemantic: "COUNT",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "LOSS_YIELD_PERCENT_UNKNOWN",
    title: "Infer loss/yield percentage from observed recasting output",
    governingInference: "Compare actual target material with the no-loss source material to recover retained/yield percentage and its complementary loss percentage.",
    reasoningSignature: "yield% = Vactual/Vsource ×100; loss% = 100−yield%",
    splitReason: "The efficiency percentage itself is the unknown, so the solve direction differs from loss-as-input questions.",
    coreEvidenceIds: [
      "CP012-D2-LOSS-PERCENT-FROM-OUTPUT-COUNT",
    ],
    representationEvidenceIds: [
      "CP012-D2-YIELD-PERCENT-FROM-OUTPUT",
    ],
    answerSemantic: "PERCENT",
    ownership: "CP012_RECAST_CONSERVATION",
  },
  {
    clusterId: "HOLLOW_SOURCE_MATERIAL_RECAST",
    title: "Hollow source material recast into solid target(s)",
    governingInference: "Subtract the source hollow core from the outer volume to obtain material volume, then apply ordinary recasting conservation to the target.",
    reasoningSignature: "Vmaterial = Vouter−Vinner; Vmaterial = Vtarget-total",
    splitReason: "Hollow-source material extraction is a stable pre-step. CP-012 owns it only when recasting is decisive; CP-011 retains hollow geometry without transformation.",
    coreEvidenceIds: [
      "MEN-CP012-PROT-HOLLOW-CYLINDER-TO-SOLID-CYLINDER",
      "V3-HOLLOW-SPHERE-TO-SOLID-CYLINDER-HEIGHT",
    ],
    representationEvidenceIds: [],
    answerSemantic: "LENGTH",
    ownership: "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY",
  },
  {
    clusterId: "HOLLOW_TARGET_LENGTH_DIRECT",
    title: "Solid source recast into hollow target with shell length unknown",
    governingInference: "Equate source material to π(R²−r²)L and isolate shell length directly.",
    reasoningSignature: "L = Vsource/[π(R²−r²)]",
    splitReason: "Length is a first-power direct solve and is materially simpler than recovering the inner radius/thickness.",
    coreEvidenceIds: [
      "V3-SPHERE-TO-HOLLOW-TUBE-LENGTH",
    ],
    representationEvidenceIds: [],
    answerSemantic: "LENGTH",
    ownership: "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY",
  },
  {
    clusterId: "HOLLOW_TARGET_THICKNESS_INVERSE",
    title: "Solid source recast into hollow target with wall thickness unknown",
    governingInference: "Use source material to recover the hollow target's inner radius from R²−r², then convert inner radius to wall thickness R−r.",
    reasoningSignature: "r = √(R²−Vsource/(πL)); thickness = R−r",
    splitReason: "This is a two-stage square-root + subtraction solve, not a direct hollow-shell length formula.",
    coreEvidenceIds: [
      "V3-SPHERE-TO-HOLLOW-TUBE-THICKNESS",
    ],
    representationEvidenceIds: [],
    answerSemantic: "LENGTH",
    ownership: "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY",
  },
  {
    clusterId: "RECAST_THEN_SECONDARY_MEASURE",
    title: "Recast first, then evaluate a secondary measure",
    governingInference: "Use volume conservation to determine the new solid first; only then compute the requested secondary quantity such as surface-area change.",
    reasoningSignature: "conserve volume → recover new dimension → compute/compare secondary measure",
    splitReason: "The second-stage measure is a genuine additional inference; surface area is not conserved and cannot be collapsed into ordinary recasting count/dimension solves.",
    coreEvidenceIds: [
      "V3-UNEQUAL-SPHERES-TO-SPHERE-SURFACE-DECREASE",
    ],
    representationEvidenceIds: [],
    answerSemantic: "SECONDARY_PERCENT",
    ownership: "CP012_RECAST_CONSERVATION",
  },
] as const;

export const MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS = [
  ...MEN_CP_012_PROTOTYPES.map((row) => row.prototypeId),
  ...MEN_CP_012_DISCOVERY_V2_DEFINITIONS.map((row) => row.id),
  ...MEN_CP_012_SATURATION_V3_DEFINITIONS.map((row) => row.id),
] as readonly string[];

export function auditMenCp012MergeSplitV4() {
  const mapped = MEN_CP_012_CANONICAL_CLUSTERS.flatMap((cluster) => [
    ...cluster.coreEvidenceIds,
    ...cluster.representationEvidenceIds,
  ]);
  const sourceSet = new Set(MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS);
  const mappedSet = new Set(mapped);
  return {
    authority: MEN_CP_012_MERGE_SPLIT_V4_AUTHORITY,
    canonicalClusterCount: MEN_CP_012_CANONICAL_CLUSTERS.length,
    discoverySourceCount: MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS.length,
    uniqueDiscoverySourceCount: sourceSet.size,
    mappedSourceCount: mapped.length,
    uniqueMappedSourceCount: mappedSet.size,
    missingSourceIds: MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS.filter((id) => !mappedSet.has(id)),
    unknownMappedSourceIds: mapped.filter((id) => !sourceSet.has(id)),
    duplicateMappedSourceIds: mapped.filter((id, index) => mapped.indexOf(id) !== index),
    hollowOwnershipClusterCount: MEN_CP_012_CANONICAL_CLUSTERS.filter(
      (cluster) => cluster.ownership === "CP012_WHEN_RECAST_DECISIVE__CP011_WHEN_HOLLOW_GEOMETRY_ONLY",
    ).length,
    coverageClosed:
      MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS.length === 42 &&
      sourceSet.size === 42 &&
      mapped.length === 42 &&
      mappedSet.size === 42 &&
      MEN_CP_012_ALL_DISCOVERY_SOURCE_IDS.every((id) => mappedSet.has(id)) &&
      mapped.every((id) => sourceSet.has(id)),
  } as const;
}
