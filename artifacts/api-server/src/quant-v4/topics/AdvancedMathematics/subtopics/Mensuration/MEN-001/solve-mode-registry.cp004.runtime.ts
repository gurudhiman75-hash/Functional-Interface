import { MEN_001_CP004_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp004";
import { MEN_001_CP004_ADDITIONAL_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp004.additional";
import type { Men001Parameters } from "./types";

type Values = Men001Parameters["values"];

const PI_NUMERATOR = 22;
const PI_DENOMINATOR = 7;

function piArea(radius: number) {
  const area = (PI_NUMERATOR * radius * radius) / PI_DENOMINATOR;
  if (!Number.isInteger(area)) {
    throw new Error(`MEN-001 CP-004 refined circular state must remain exact under π = 22/7.`);
  }
  return area;
}

function positive(values: Values, key: keyof Values) {
  const value = values[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-004 refined circular state requires positive ${String(key)}.`);
  }
  return value;
}

function refineOuterCircularState(values: Values): Values {
  const pathWidth = positive(values, "pathWidth");
  const generatedInnerRadius = positive(values, "innerRadius");
  const innerRadius = generatedInnerRadius > pathWidth
    ? generatedInnerRadius
    : 2 * pathWidth;
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piArea(innerRadius);
  const outerArea = piArea(outerRadius);
  const area = outerArea - innerArea;
  const ratePerSquareMetre = values.ratePerSquareMetre;
  return {
    ...values,
    innerRadius,
    outerRadius,
    innerArea,
    outerArea,
    area,
    ...(typeof ratePerSquareMetre === "number"
      ? { cost: area * ratePerSquareMetre }
      : {}),
  };
}

function refineInnerCircularState(values: Values): Values {
  const pathWidth = positive(values, "pathWidth");
  const generatedOuterRadius = positive(values, "outerRadius");
  const generatedInnerRadius = generatedOuterRadius - pathWidth;
  const innerRadius = generatedInnerRadius > pathWidth
    ? generatedInnerRadius
    : 2 * pathWidth;
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piArea(innerRadius);
  const outerArea = piArea(outerRadius);
  return {
    ...values,
    innerRadius,
    outerRadius,
    innerArea,
    outerArea,
    area: outerArea - innerArea,
  };
}

const outerCircularArea = MEN_001_CP004_SOLVE_MODE_REGISTRY.findOuterCircularPathArea;
const innerCircularArea = MEN_001_CP004_SOLVE_MODE_REGISTRY.findInnerCircularPathArea;
const circularPathCost = MEN_001_CP004_SOLVE_MODE_REGISTRY.findCircularPathCost;

export const MEN_001_CP004_RUNTIME_SOLVE_MODE_REGISTRY = {
  ...MEN_001_CP004_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP004_ADDITIONAL_SOLVE_MODE_REGISTRY,
  findOuterCircularPathArea: {
    ...outerCircularArea,
    generateValues: (seed: string) =>
      refineOuterCircularState(outerCircularArea.generateValues(seed)),
  },
  findInnerCircularPathArea: {
    ...innerCircularArea,
    generateValues: (seed: string) =>
      refineInnerCircularState(innerCircularArea.generateValues(seed)),
  },
  findCircularPathCost: {
    ...circularPathCost,
    generateValues: (seed: string) =>
      refineOuterCircularState(circularPathCost.generateValues(seed)),
  },
} as const;
