import type {
  ExactValue,
  Men002Difficulty,
  Men002Target,
  Men002Unit,
} from "../../foundation/types";

export const MEN_CP_009_ID = "MEN-CP-009" as const;
export const MEN_CP_009_AUTHORITY = "MEN-CP009-ENGLISH-IMPLEMENTATION-V1" as const;

export type MenCp009PiPolicy = "EXACT_PI" | "PI_22_OVER_7" | "PI_3_14";
export type MenCp009Shape = "SPHERE" | "HEMISPHERE";

export type MenCp009FamilyId =
  | "SPHERE_SURFACE_FROM_RADIUS"
  | "SPHERE_SURFACE_FROM_DIAMETER"
  | "SPHERE_VOLUME_FROM_RADIUS"
  | "SPHERE_VOLUME_FROM_DIAMETER"
  | "SPHERE_RADIUS_FROM_SURFACE"
  | "SPHERE_DIAMETER_FROM_SURFACE"
  | "SPHERE_RADIUS_FROM_VOLUME"
  | "SPHERE_DIAMETER_FROM_VOLUME"
  | "HEMISPHERE_CSA_FROM_RADIUS"
  | "HEMISPHERE_TSA_FROM_RADIUS"
  | "HEMISPHERE_VOLUME_FROM_RADIUS"
  | "HEMISPHERE_RADIUS_FROM_CSA"
  | "HEMISPHERE_RADIUS_FROM_TSA"
  | "HEMISPHERE_RADIUS_FROM_VOLUME"
  | "HEMISPHERE_CAPACITY_LITRES"
  | "SPHERE_PAINTING_COST"
  | "HEMISPHERE_INNER_POLISHING_COST"
  | "SPHERE_SURFACE_RATIO"
  | "SPHERE_VOLUME_RATIO"
  | "RADIUS_RATIO_FROM_SURFACE_RATIO"
  | "RADIUS_RATIO_FROM_VOLUME_RATIO"
  | "SPHERE_SURFACE_PERCENT_CHANGE"
  | "SPHERE_VOLUME_PERCENT_CHANGE"
  | "SPHERE_HEMISPHERE_MEASURE_RATIO";

export type MenCp009SolveMode =
  | "findSphereSurfaceAreaFromRadius"
  | "findSphereSurfaceAreaFromDiameter"
  | "findSphereVolumeFromRadius"
  | "findSphereVolumeFromDiameter"
  | "findSphereRadiusFromSurfaceArea"
  | "findSphereDiameterFromSurfaceArea"
  | "findSphereRadiusFromVolume"
  | "findSphereDiameterFromVolume"
  | "findHemisphereCurvedSurfaceArea"
  | "findHemisphereTotalSurfaceArea"
  | "findHemisphereVolume"
  | "findHemisphereRadiusFromCurvedSurfaceArea"
  | "findHemisphereRadiusFromTotalSurfaceArea"
  | "findHemisphereRadiusFromVolume"
  | "findHemisphericalCapacityInLitres"
  | "findSpherePaintingCost"
  | "findHemisphericalInnerPolishingCost"
  | "findSphereSurfaceAreaRatio"
  | "findSphereVolumeRatio"
  | "findRadiusRatioFromSphereSurfaceAreas"
  | "findRadiusRatioFromSphereVolumes"
  | "findSphereSurfaceAreaPercentageChange"
  | "findSphereVolumePercentageChange"
  | "compareSphereAndHemisphereMeasure";

export interface MenCp009QlDefinition {
  qlId: string;
  templateId: string;
  familyId: MenCp009FamilyId;
  solveMode: MenCp009SolveMode;
  title: string;
  shape: MenCp009Shape;
  target: Men002Target;
  difficultyFloor: Men002Difficulty;
  sourceClassification: "DESIGN_AND_FORMULA_AUTHORITY";
  ownership: "MEN-CP-009";
  permanentIdentityFrozen: true;
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

export interface MenCp009State {
  authority: typeof MEN_CP_009_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_009_ID;
  permanentQlId: string;
  familyId: MenCp009FamilyId;
  solveMode: MenCp009SolveMode;
  seed: string;
  shape: MenCp009Shape;
  target: Men002Target;
  difficulty: Men002Difficulty;
  piPolicy: MenCp009PiPolicy;
  unit: Men002Unit;
  radius: bigint;
  diameter: bigint;
  secondRadius: bigint | null;
  rate: bigint | null;
  percentageChange: bigint | null;
  givenExact: ExactValue | null;
  contextId: string;
}

export interface MenCp009Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp009Diagram {
  kind: "SPHERE" | "HEMISPHERE" | "COMPARISON";
  viewBox: "0 0 520 300";
  alt: string;
  svg: string;
  responsive: true;
  minWidthPx: 0;
}

export interface MenCp009Question {
  authority: typeof MEN_CP_009_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_009_ID;
  permanentQlId: string;
  templateId: string;
  familyId: MenCp009FamilyId;
  solveMode: MenCp009SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp009PiPolicy;
  stem: string;
  options: MenCp009Option[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Men002Unit;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string; equation?: string }>;
    shortcut: string;
    traps: string[];
  };
  diagram: MenCp009Diagram;
  state: MenCp009State;
  verification: {
    valid: boolean;
    method: string;
    reconstructed: string;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  maturity: "IMPLEMENTATION_COMPLETE";
  allocationStatus: "PERMANENT_QL_ALLOCATED";
  permanentIdentityFrozen: true;
  reviewStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
