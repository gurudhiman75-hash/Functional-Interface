import type { MenCp012PrototypeDefinition, MenCp012PrototypeId } from "./types";

export const MEN_CP_012_PROTOTYPES: readonly MenCp012PrototypeDefinition[] = [
  { prototypeId: "MEN-CP012-PROT-SPHERE-TO-SMALL-SPHERES-COUNT", solveMode: "findSmallSphereCountByVolumeConservation", target: "COUNT", difficulty: "Easy", reasoningCluster: "ONE_TO_MANY_COUNT", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-CYLINDER-TO-SPHERES-COUNT", solveMode: "findSphereCountFromCylinder", target: "COUNT", difficulty: "Medium", reasoningCluster: "ONE_TO_MANY_COUNT", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-CUBE-TO-SMALL-CUBES-COUNT", solveMode: "findSmallCubeCountAfterRecasting", target: "COUNT", difficulty: "Easy", reasoningCluster: "ONE_TO_MANY_COUNT", provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP012-PROT-CYLINDER-TO-CONE-HEIGHT", solveMode: "findConeHeightAfterRecastingCylinder", target: "LENGTH", difficulty: "Easy", reasoningCluster: "ONE_TO_ONE_INVERSE", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-CONE-TO-CYLINDER-HEIGHT", solveMode: "findCylinderHeightAfterRecastingCone", target: "LENGTH", difficulty: "Easy", reasoningCluster: "ONE_TO_ONE_INVERSE", provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP012-PROT-CUBOID-TO-CUBE-SIDE", solveMode: "findCubeSideAfterRecastingCuboid", target: "LENGTH", difficulty: "Medium", reasoningCluster: "ONE_TO_ONE_INVERSE", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-SPHERE-TO-CYLINDER-HEIGHT", solveMode: "findCylinderHeightAfterRecastingSphere", target: "LENGTH", difficulty: "Medium", reasoningCluster: "ONE_TO_ONE_INVERSE", provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP012-PROT-CYLINDER-TO-WIRE-LENGTH", solveMode: "findWireLengthByAreaLengthConservation", target: "LENGTH", difficulty: "Medium", reasoningCluster: "WIRE_SHEET_DRAWING", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-ROD-TO-WIRE-METRE-CONVERSION", solveMode: "findWireLengthWithCmToMConversion", target: "LENGTH", difficulty: "Medium", reasoningCluster: "UNIT_CONVERSION", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-TWO-SPHERES-TO-CYLINDER-HEIGHT", solveMode: "findCylinderHeightFromCombinedSpheres", target: "LENGTH", difficulty: "Medium", reasoningCluster: "COMBINED_SOURCE_SOLIDS", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-CUBE-WASTAGE-TO-SMALL-CUBES", solveMode: "findSmallCubeCountAfterMaterialLoss", target: "COUNT", difficulty: "Medium", reasoningCluster: "WASTAGE_CONSERVATION", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-WASTAGE-INVERSE-CYLINDER-HEIGHT", solveMode: "findSourceCylinderHeightWithMaterialLoss", target: "LENGTH", difficulty: "Hard", reasoningCluster: "WASTAGE_CONSERVATION", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-HOLLOW-CYLINDER-TO-SOLID-CYLINDER", solveMode: "findSolidCylinderCountFromHollowCylinderMaterial", target: "COUNT", difficulty: "Hard", reasoningCluster: "HOLLOW_TO_SOLID_CONSERVATION", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-SLAB-TO-THIN-SHEET-LENGTH", solveMode: "findSheetLengthAfterThicknessChange", target: "LENGTH", difficulty: "Medium", reasoningCluster: "WIRE_SHEET_DRAWING", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-CUBIC-METRE-TO-CM-CUBES", solveMode: "findCmCubeCountFromCubicMetreBlock", target: "COUNT", difficulty: "Medium", reasoningCluster: "UNIT_CONVERSION", provisionalDisposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP012-PROT-MANY-CONES-TO-ONE-CYLINDER", solveMode: "findCylinderHeightFromManyCones", target: "LENGTH", difficulty: "Medium", reasoningCluster: "COMBINED_SOURCE_SOLIDS", provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
] as const;

export function getMenCp012Prototype(prototypeId: MenCp012PrototypeId) {
  const definition = MEN_CP_012_PROTOTYPES.find((row) => row.prototypeId === prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-012 prototype: ${prototypeId}`);
  return definition;
}

export function auditMenCp012Registry() {
  const prototypeIds = MEN_CP_012_PROTOTYPES.map((row) => row.prototypeId);
  const solveModes = MEN_CP_012_PROTOTYPES.map((row) => row.solveMode);
  return {
    prototypeCount: prototypeIds.length,
    uniquePrototypeCount: new Set(prototypeIds).size,
    uniqueSolveModeCount: new Set(solveModes).size,
    reasoningClusterCount: new Set(MEN_CP_012_PROTOTYPES.map((row) => row.reasoningCluster)).size,
    permanentQlCount: 0,
    lifecycleLocked: true,
  } as const;
}
