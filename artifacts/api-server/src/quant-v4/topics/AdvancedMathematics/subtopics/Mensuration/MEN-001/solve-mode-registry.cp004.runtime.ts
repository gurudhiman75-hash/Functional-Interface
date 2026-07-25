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
    throw new Error(`MEN-001 CP-004 refined state requires positive ${String(key)}.`);
  }
  return value;
}

function refineOuterCircularState(values: Values): Values {
  const pathWidth = Math.min(positive(values, "pathWidth"), 7);
  const generatedInnerRadius = positive(values, "innerRadius");
  const innerRadius = Math.max(generatedInnerRadius, 3 * pathWidth);
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piArea(innerRadius);
  const outerArea = piArea(outerRadius);
  const area = outerArea - innerArea;
  const ratePerSquareMetre = values.ratePerSquareMetre;
  return {
    ...values,
    pathWidth,
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
  const generatedPathWidth = positive(values, "pathWidth");
  const pathWidth = Math.min(generatedPathWidth, 7);
  const generatedOuterRadius = positive(values, "outerRadius");
  const generatedInnerRadius = generatedOuterRadius - generatedPathWidth;
  const innerRadius = Math.max(generatedInnerRadius, 3 * pathWidth);
  const outerRadius = innerRadius + pathWidth;
  const innerArea = piArea(innerRadius);
  const outerArea = piArea(outerRadius);
  return {
    ...values,
    pathWidth,
    innerRadius,
    outerRadius,
    innerArea,
    outerArea,
    area: outerArea - innerArea,
  };
}

function refinePathTileState(values: Values): Values {
  const area = positive(values, "area");
  const tileLength = 1;
  const tileBreadth = 0.5;
  const tileArea = tileLength * tileBreadth;
  const tileCount = area / tileArea;
  if (!Number.isInteger(tileCount)) {
    throw new Error(`MEN-001 CP-004 refined path-tile state must divide exactly.`);
  }
  return {
    ...values,
    tileLength,
    tileBreadth,
    tileArea,
    tileCount,
  };
}

function refinePaintingState(values: Values): Values {
  const generatedLength = positive(values, "outerLength");
  const ratePerSquareMetre = positive(values, "ratePerSquareMetre");
  const presets: Record<number, readonly [number, number, number, number]> = {
    12: [8, 4, 2, 2],
    15: [10, 5, 2, 2],
    18: [12, 6, 3, 2],
    20: [15, 8, 3, 2],
    24: [18, 9, 4, 3],
  };
  const [outerLength, outerBreadth, innerLength, innerBreadth] =
    presets[generatedLength] ?? [12, 6, 3, 2];
  const outerArea = outerLength * outerBreadth;
  const innerArea = innerLength * innerBreadth;
  const area = outerArea - innerArea;
  return {
    ...values,
    outerLength,
    outerBreadth,
    innerLength,
    innerBreadth,
    outerArea,
    innerArea,
    area,
    cost: area * ratePerSquareMetre,
  };
}

const outerCircularArea = MEN_001_CP004_SOLVE_MODE_REGISTRY.findOuterCircularPathArea;
const innerCircularArea = MEN_001_CP004_SOLVE_MODE_REGISTRY.findInnerCircularPathArea;
const circularPathCost = MEN_001_CP004_SOLVE_MODE_REGISTRY.findCircularPathCost;
const pathTiles = MEN_001_CP004_ADDITIONAL_SOLVE_MODE_REGISTRY.findOuterRectangularPathTilesRequired;
const paintingCost = MEN_001_CP004_ADDITIONAL_SOLVE_MODE_REGISTRY.findPaintingCostExcludingRectangularDoor;

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
  findOuterRectangularPathTilesRequired: {
    ...pathTiles,
    generateValues: (seed: string) =>
      refinePathTileState(pathTiles.generateValues(seed)),
  },
  findPaintingCostExcludingRectangularDoor: {
    ...paintingCost,
    generateValues: (seed: string) =>
      refinePaintingState(paintingCost.generateValues(seed)),
  },
} as const;
