import type { Men002Unit } from "../foundation/types";

export const MEN_CP011_MEASUREMENT_AUTHORITY =
  "MEN-CP011-PHASE2B-UNIT-REPRESENTATION-V1" as const;

export type MenCp011MeasurementProfileId =
  | "RADIAL_CM_LENGTH_CM_TO_CM3"
  | "RADIAL_M_LENGTH_M_TO_M3"
  | "RADIAL_CM_LENGTH_M_TO_CM3"
  | "RADIAL_M_LENGTH_CM_TO_CM3";

export type MenCp011LinearUnit = Extract<Men002Unit, "cm" | "m">;
export type MenCp011VolumeUnit = Extract<Men002Unit, "cm³" | "m³">;
export type MenCp011AnswerUnit = Extract<
  Men002Unit,
  "cm" | "m" | "cm³" | "m³"
>;

export interface MenCp011MeasurementProfile {
  id: MenCp011MeasurementProfileId;
  radialUnit: MenCp011LinearUnit;
  heightUnit: MenCp011LinearUnit;
  calculationUnit: MenCp011LinearUnit;
  volumeUnit: MenCp011VolumeUnit;
  lengthAnswerUnit: MenCp011LinearUnit;
  radialFactorToCalculationUnit: bigint;
  heightFactorToCalculationUnit: bigint;
  volumeScaleFromNominalState: bigint;
  mixedUnits: boolean;
  conversionFocus:
    | "NONE"
    | "CONVERT_HEIGHT_M_TO_CM"
    | "CONVERT_RADIAL_M_TO_CM_AND_SQUARE";
}

const PROFILES: readonly MenCp011MeasurementProfile[] = [
  {
    id: "RADIAL_CM_LENGTH_CM_TO_CM3",
    radialUnit: "cm",
    heightUnit: "cm",
    calculationUnit: "cm",
    volumeUnit: "cm³",
    lengthAnswerUnit: "cm",
    radialFactorToCalculationUnit: 1n,
    heightFactorToCalculationUnit: 1n,
    volumeScaleFromNominalState: 1n,
    mixedUnits: false,
    conversionFocus: "NONE",
  },
  {
    id: "RADIAL_M_LENGTH_M_TO_M3",
    radialUnit: "m",
    heightUnit: "m",
    calculationUnit: "m",
    volumeUnit: "m³",
    lengthAnswerUnit: "m",
    radialFactorToCalculationUnit: 1n,
    heightFactorToCalculationUnit: 1n,
    volumeScaleFromNominalState: 1n,
    mixedUnits: false,
    conversionFocus: "NONE",
  },
  {
    id: "RADIAL_CM_LENGTH_M_TO_CM3",
    radialUnit: "cm",
    heightUnit: "m",
    calculationUnit: "cm",
    volumeUnit: "cm³",
    lengthAnswerUnit: "cm",
    radialFactorToCalculationUnit: 1n,
    heightFactorToCalculationUnit: 100n,
    volumeScaleFromNominalState: 100n,
    mixedUnits: true,
    conversionFocus: "CONVERT_HEIGHT_M_TO_CM",
  },
  {
    id: "RADIAL_M_LENGTH_CM_TO_CM3",
    radialUnit: "m",
    heightUnit: "cm",
    calculationUnit: "cm",
    volumeUnit: "cm³",
    lengthAnswerUnit: "m",
    radialFactorToCalculationUnit: 100n,
    heightFactorToCalculationUnit: 1n,
    volumeScaleFromNominalState: 10_000n,
    mixedUnits: true,
    conversionFocus: "CONVERT_RADIAL_M_TO_CM_AND_SQUARE",
  },
] as const;

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

export function getMenCp011MeasurementProfiles() {
  return [...PROFILES];
}

export function getMenCp011MeasurementProfile(
  id: MenCp011MeasurementProfileId,
) {
  const profile = PROFILES.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`Unknown MEN-CP-011 measurement profile ${id}.`);
  return profile;
}

export function selectMenCp011MeasurementProfile(seed: string) {
  return PROFILES[
    hashText(`${MEN_CP011_MEASUREMENT_AUTHORITY}|${seed}`) % PROFILES.length
  ]!;
}

export function menCp011ExpectedAnswerUnit(
  profile: MenCp011MeasurementProfile,
  target: "VOLUME" | "LENGTH",
): MenCp011AnswerUnit {
  return target === "VOLUME" ? profile.volumeUnit : profile.lengthAnswerUnit;
}

export function menCp011CalculationValues(
  profile: MenCp011MeasurementProfile,
  values: {
    outerRadius: bigint;
    innerRadius: bigint;
    height: bigint;
    thickness: bigint;
    outerDiameter: bigint;
    innerDiameter: bigint;
  },
) {
  const radialFactor = profile.radialFactorToCalculationUnit;
  const heightFactor = profile.heightFactorToCalculationUnit;
  const outerRadius = values.outerRadius * radialFactor;
  const innerRadius = values.innerRadius * radialFactor;
  const height = values.height * heightFactor;
  const thickness = values.thickness * radialFactor;
  const outerDiameter = values.outerDiameter * radialFactor;
  const innerDiameter = values.innerDiameter * radialFactor;
  return {
    outerRadius,
    innerRadius,
    height,
    thickness,
    outerDiameter,
    innerDiameter,
    ringCoefficient: outerRadius ** 2n - innerRadius ** 2n,
    volumeCoefficient: height * (outerRadius ** 2n - innerRadius ** 2n),
  };
}
