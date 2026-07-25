import type { Men001SolveMode } from "./solve-mode-registry.all";
export type { Men001SolveMode } from "./solve-mode-registry.all";

export const MEN_001_PACKAGE_ID = "MEN-001" as const;

export const MEN_001_CP_IDS = [
  "MEN-CP-001",
  "MEN-CP-002",
  "MEN-CP-003",
  "MEN-CP-004",
  "MEN-CP-005",
  "MEN-CP-006",
] as const;

export const MEN_001_ACTIVE_CP_IDS = [
  "MEN-CP-001",
  "MEN-CP-002",
  "MEN-CP-003",
  "MEN-CP-004",
] as const;

export type Men001CanonicalProblemId = (typeof MEN_001_CP_IDS)[number];
export type Men001ActiveCanonicalProblemId = (typeof MEN_001_ACTIVE_CP_IDS)[number];
export type Men001Language = "en" | "hi" | "pa";
export type Men001Difficulty = "Easy" | "Medium" | "Hard";
export type Men001TaskKind =
  | "triangleMeasurementApplication"
  | "quadrilateralMeasurementApplication"
  | "circleMeasurementApplication"
  | "pathBorderFlooringFencingApplication";
export type Men001AnswerDimension =
  | "LENGTH"
  | "AREA"
  | "COST"
  | "RATE"
  | "ANGLE"
  | "COUNT";
/** Unit policies consumed by the original CP-001–004 registries. */
export type Men001UnitPolicy =
  | "CENTIMETRES"
  | "METRES"
  | "SQUARE_CENTIMETRES"
  | "SQUARE_METRES"
  | "RUPEES"
  | "DEGREES"
  | "TILES";
/** Additive policies used by exhaustiveness modes without widening legacy registry maps. */
export type Men001ExtendedUnitPolicy =
  | "RUPEES_PER_SQUARE_METRE"
  | "RUPEES_PER_METRE"
  | "REVOLUTIONS";
export type Men001AnyUnitPolicy = Men001UnitPolicy | Men001ExtendedUnitPolicy;
export type Men001DiagramRequirement = "REQUIRED" | "OPTIONAL" | "NONE";

export type ExactSpatialNumber =
  | { kind: "INTEGER"; value: number }
  | { kind: "RATIONAL"; numerator: number; denominator: number }
  | {
      kind: "SURD";
      coefficientNumerator: number;
      coefficientDenominator: number;
      radicand: number;
    };

export type Men001CanonicalAnswer =
  | {
      kind: "unit";
      value: number;
      unit: string;
      precision: number;
      display: string;
      rounding: "exact";
      metadata: Record<string, unknown>;
    }
  | {
      kind: "currency";
      value: number;
      currency: "₹";
      precision: number;
      display: string;
      rounding: "exact";
      metadata: Record<string, unknown>;
    }
  | {
      kind: "symbolic";
      value: string;
      rendered: string;
      display: string;
      rounding: "exact";
      metadata: Record<string, unknown>;
    };

export interface Men001QuestionLanguageEntry {
  cpId: Men001CanonicalProblemId;
  qlId: string;
  solveMode: Men001SolveMode;
  difficulty: Men001Difficulty;
  template: string;
  requiredVariables: string[];
  answerDimension: Men001AnswerDimension;
  unitPolicy: Men001AnyUnitPolicy;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  /** Diagram attached to the question stem, not to its explanation. */
  diagramRequirement: Men001DiagramRequirement;
  active: boolean;
}

export interface Men001TaskRegistryEntry {
  cpId: Men001CanonicalProblemId;
  qlId: string;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  answerDimension: Men001AnswerDimension;
  requiredVariables: string[];
}

export interface Men001Parameters {
  packageId: typeof MEN_001_PACKAGE_ID;
  canonicalProblemId: Men001ActiveCanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  language: Men001Language;
  difficulty: Men001Difficulty;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  answerDimension: Men001AnswerDimension;
  /** Legacy field type retained for existing registries; parameter generation validates extended policies before casting. */
  unitPolicy: Men001UnitPolicy;
  seed: string;
  values: {
    base?: number;
    height?: number;
    heightCoefficient?: number;
    area?: number;
    sideA?: number;
    sideB?: number;
    sideC?: number;
    legA?: number;
    legB?: number;
    side?: number;
    perimeter?: number;
    areaCoefficient?: number;
    equalSide?: number;
    ratioA?: number;
    ratioB?: number;
    ratioC?: number;
    scale?: number;
    ratePerSquareMetre?: number;
    ratePerMetre?: number;
    cost?: number;
    length?: number;
    breadth?: number;
    diagonal?: number;
    diagonalCoefficient?: number;
    adjacentSide?: number;
    diagonalA?: number;
    diagonalB?: number;
    halfDiagonalA?: number;
    halfDiagonalB?: number;
    parallelSideA?: number;
    parallelSideB?: number;
    perpendicularA?: number;
    perpendicularB?: number;
    radius?: number;
    diameter?: number;
    circumference?: number;
    radiusSquare?: number;
    fullArea?: number;
    semicircleArc?: number;
    quadrantArc?: number;
    angleDegrees?: number;
    arcLength?: number;
    sectorArea?: number;
    outerRadius?: number;
    innerRadius?: number;
    outerArea?: number;
    innerArea?: number;
    radiusSquareDifference?: number;
    outerRadiusSquare?: number;
    innerRadiusSquare?: number;
    revolutions?: number;
    distance?: number;
    pathWidth?: number;
    outerLength?: number;
    outerBreadth?: number;
    innerLength?: number;
    innerBreadth?: number;
    outerSide?: number;
    innerSide?: number;
    floorLength?: number;
    floorBreadth?: number;
    floorArea?: number;
    tileLength?: number;
    tileBreadth?: number;
    tileArea?: number;
    tileCount?: number;
    coveredArea?: number;
    costPerTile?: number;
    gateWidth?: number;
    rounds?: number;
    fenceLength?: number;
    wireLength?: number;
    roadWidthA?: number;
    roadWidthB?: number;
    roadAreaA?: number;
    roadAreaB?: number;
    overlapArea?: number;
    roadArea?: number;
    fieldArea?: number;
    discriminant?: number;
  };
  renderVariables: Record<string, string | number>;
}

export interface Men001SolverResult {
  exactAnswer: ExactSpatialNumber;
  canonicalAnswer: Men001CanonicalAnswer;
  answer: string;
  answerDimension: Men001AnswerDimension;
  unit:
    | "cm"
    | "m"
    | "cm²"
    | "m²"
    | "₹"
    | "₹/m²"
    | "₹/m"
    | "°"
    | "tiles"
    | "revolutions";
  equation: string;
  workingValues: Record<string, string | number>;
}

export interface Men001ReasoningNode {
  nodeId: string;
  operation: string;
  description: string;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
}

export interface Men001ReasoningGraph {
  graphId: string;
  nodes: Men001ReasoningNode[];
}

export type Men001ExplanationIllustration =
  | {
      kind: "TRIANGLE_SIDE_LABELS";
      purpose: "HERON_SIDE_MAPPING";
      placement: "AFTER_SIDE_RECOVERY";
      notToScale: true;
      labels: { sideA: string; sideB: string; sideC: string };
      accessibleText: string;
    }
  | {
      kind: "ISOSCELES_ALTITUDE_SPLIT";
      purpose: "ALTITUDE_BISECTS_BASE";
      placement: "BEFORE_PYTHAGORAS";
      notToScale: true;
      labels: { equalSide: string; base: string; halfBase: string; height: string };
      accessibleText: string;
    }
  | {
      kind: "RECTANGLE_DIAGONAL_SPLIT";
      purpose: "DIAGONAL_FORMS_RIGHT_TRIANGLE";
      placement: "BEFORE_PYTHAGORAS";
      notToScale: true;
      labels: { diagonal: string; length: string; breadth: string };
      accessibleText: string;
    }
  | {
      kind: "RHOMBUS_HALF_DIAGONALS";
      purpose: "DIAGONALS_BISECT_AT_RIGHT_ANGLES";
      placement: "BEFORE_PYTHAGORAS";
      notToScale: true;
      labels: {
        diagonalA: string;
        diagonalB: string;
        halfDiagonalA: string;
        halfDiagonalB: string;
        side: string;
      };
      accessibleText: string;
    }
  | {
      kind: "QUADRILATERAL_DIAGONAL_PERPENDICULARS";
      purpose: "SPLIT_INTO_TWO_TRIANGLES";
      placement: "BEFORE_AREA_ADDITION";
      notToScale: true;
      labels: { diagonal: string; perpendicularA: string; perpendicularB: string };
      accessibleText: string;
    }
  | {
      kind: "CIRCLE_CENTRAL_ANGLE";
      purpose: "ARC_OR_SECTOR_FRACTION";
      placement: "BEFORE_FRACTION_CALCULATION";
      notToScale: true;
      labels: { radius: string; centralAngle: string; measuredPart: string };
      accessibleText: string;
    }
  | {
      kind: "ANNULUS_RADII";
      purpose: "OUTER_MINUS_INNER_CIRCLE";
      placement: "BEFORE_AREA_SUBTRACTION";
      notToScale: true;
      labels: { outerRadius: string; innerRadius: string };
      accessibleText: string;
    }
  | {
      kind: "CIRCLE_PART_BOUNDARY";
      purpose: "CURVE_PLUS_STRAIGHT_EDGES";
      placement: "BEFORE_PERIMETER_ADDITION";
      notToScale: true;
      labels: { radius: string; curvedBoundary: string; straightEdges: string };
      accessibleText: string;
    }
  | {
      kind: "RECTANGULAR_BORDER_BAND";
      purpose: "OUTER_MINUS_INNER_RECTANGLE";
      placement: "BEFORE_AREA_SUBTRACTION" | "BEFORE_WIDTH_RECOVERY";
      notToScale: true;
      labels: {
        outerLength: string;
        outerBreadth: string;
        innerLength: string;
        innerBreadth: string;
        pathWidth: string;
        region: string;
      };
      accessibleText: string;
    }
  | {
      kind: "CIRCULAR_BORDER_BAND";
      purpose: "OUTER_MINUS_INNER_CIRCLE";
      placement: "BEFORE_AREA_SUBTRACTION";
      notToScale: true;
      labels: {
        outerRadius: string;
        innerRadius: string;
        pathWidth: string;
        region: string;
      };
      accessibleText: string;
    };

export interface Men001Explanation {
  strategyId: string;
  lines: string[];
  illustration?: Men001ExplanationIllustration;
}

export interface Men001ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Men001ValidationResult {
  valid: boolean;
  checks: Men001ValidationCheck[];
}

export interface Men001QuestionPackage {
  packageId: typeof MEN_001_PACKAGE_ID;
  archetypeId: typeof MEN_001_PACKAGE_ID;
  canonicalProblemId: Men001ActiveCanonicalProblemId;
  questionId: string;
  questionLanguageId: string;
  language: "en";
  difficultyBand: Men001Difficulty;
  taskKind: Men001TaskKind;
  solveMode: Men001SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Men001Parameters;
  solver: Men001SolverResult;
  reasoningGraph: Men001ReasoningGraph;
  explanation: Men001Explanation;
  validation: Men001ValidationResult;
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}
