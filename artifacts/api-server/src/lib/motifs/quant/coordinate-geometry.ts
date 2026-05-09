import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type CoordinateCategory =
  | "points"
  | "lines_slopes"
  | "areas_properties"
  | "distance_reflection"
  | "circles"
  | "locus_advanced";

type CoordinateMotifDraft = {
  id: string;
  category: CoordinateCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const coordinateGeometryScopeMap = {
  chapter: "Coordinate Geometry",
  coreDomains: [
    "Points and distance",
    "Midpoint and section formula",
    "Straight lines and slopes",
    "Areas and collinearity",
    "Distance from lines",
    "Reflections",
    "Circles in Cartesian plane",
    "Locus and concurrency",
  ],
} as const;

export const coordinateGeometryDistractorRegistry = [
  "Slope_Inversion",
  "Section_Ratio_Flip",
  "Perpendicular_Slope_Neglect",
  "Area_Sign_Error",
  "Midpoint_Subtraction",
  "Distance_Formula_Plus",
  "Intercept_Area_Factor",
  "Reflection_Axis_Swap",
  "Circle_Radius_Squared",
  "General_Eqn_Sign_Flip",
  "Distance_Line_Denominator",
  "Parallel_Slope_Reciprocal",
  "Collinear_Slope_Mismatch",
  "External_Section_Plus",
  "Centroid_Denominator",
  "Slope_Tan_Theta_Confusion",
  "Origin_Distance_Linear",
  "Quadrant_Boundary_Neglect",
  "Line_Consistency_Confusion",
  "Equation_Normalization_Error",
] as const;

export const coordinateGeometryProceduralMotifs: CoordinateMotifDraft[] = [
  { id: "coord-dist-basic", category: "points", operations: ["distance formula"], hiddenStructures: ["coordinate displacement"], distractors: ["Distance_Formula_Plus"], difficulty: 1 },
  { id: "coord-midpoint", category: "points", operations: ["midpoint formula"], hiddenStructures: ["coordinate averaging"], distractors: ["Midpoint_Subtraction"], difficulty: 1 },
  { id: "coord-section-internal", category: "points", operations: ["internal section formula"], hiddenStructures: ["weighted coordinate average"], distractors: ["Section_Ratio_Flip"], difficulty: 2 },
  { id: "coord-section-external", category: "points", operations: ["external section formula"], hiddenStructures: ["weighted coordinate difference"], distractors: ["External_Section_Plus"], difficulty: 3 },
  { id: "coord-centroid-tri", category: "points", operations: ["centroid"], hiddenStructures: ["average of vertices"], distractors: ["Centroid_Denominator"], difficulty: 2 },
  { id: "coord-slope-find", category: "lines_slopes", operations: ["slope formula"], hiddenStructures: ["rise over run"], distractors: ["Slope_Inversion"], difficulty: 1 },
  { id: "coord-line-eqn-point-slope", category: "lines_slopes", operations: ["point slope equation"], hiddenStructures: ["line through point"], distractors: ["Equation_Normalization_Error"], difficulty: 2 },
  { id: "coord-line-eqn-two-point", category: "lines_slopes", operations: ["two point line equation"], hiddenStructures: ["slope then point-slope"], distractors: ["Slope_Inversion"], difficulty: 2 },
  { id: "coord-line-intercept-form", category: "lines_slopes", operations: ["intercept form", "axis triangle area"], hiddenStructures: ["intercepts as triangle legs"], distractors: ["Intercept_Area_Factor"], difficulty: 2 },
  { id: "coord-rel-parallel", category: "lines_slopes", operations: ["parallel slopes"], hiddenStructures: ["equal slope condition"], distractors: ["Parallel_Slope_Reciprocal"], difficulty: 2 },
  { id: "coord-rel-perp", category: "lines_slopes", operations: ["perpendicular slopes"], hiddenStructures: ["negative reciprocal"], distractors: ["Perpendicular_Slope_Neglect"], difficulty: 2 },
  { id: "coord-line-intersection", category: "lines_slopes", operations: ["simultaneous lines"], hiddenStructures: ["intersection as common solution"], distractors: ["Line_Consistency_Confusion"], difficulty: 2 },
  { id: "coord-slope-angle", category: "lines_slopes", operations: ["angle of inclination"], hiddenStructures: ["slope equals tangent"], distractors: ["Slope_Tan_Theta_Confusion"], difficulty: 3 },
  { id: "coord-line-general-slope", category: "lines_slopes", operations: ["general line slope"], hiddenStructures: ["m equals -a/b"], distractors: ["Equation_Normalization_Error"], difficulty: 2 },
  { id: "coord-line-axis-intercepts", category: "lines_slopes", operations: ["axis intercepts"], hiddenStructures: ["set one coordinate zero"], distractors: ["Intercept_Area_Factor"], difficulty: 2 },
  { id: "coord-area-tri", category: "areas_properties", operations: ["shoelace area"], hiddenStructures: ["determinant area"], distractors: ["Area_Sign_Error"], difficulty: 2 },
  { id: "coord-collinear-check", category: "areas_properties", operations: ["collinearity"], hiddenStructures: ["zero area or equal slopes"], distractors: ["Collinear_Slope_Mismatch"], difficulty: 2 },
  { id: "coord-quad-id", category: "areas_properties", operations: ["quadrilateral classification"], hiddenStructures: ["side length and slope pattern"], distractors: ["Perpendicular_Slope_Neglect"], difficulty: 3 },
  { id: "coord-area-quad", category: "areas_properties", operations: ["coordinate quadrilateral area"], hiddenStructures: ["shoelace over four vertices"], distractors: ["Area_Sign_Error"], difficulty: 3 },
  { id: "coord-dist-point-line", category: "distance_reflection", operations: ["point to line distance"], hiddenStructures: ["standard line equation"], distractors: ["Distance_Line_Denominator"], difficulty: 3 },
  { id: "coord-dist-parallel-lines", category: "distance_reflection", operations: ["parallel line distance"], hiddenStructures: ["same a and b coefficients"], distractors: ["Equation_Normalization_Error"], difficulty: 3 },
  { id: "coord-reflect-axis", category: "distance_reflection", operations: ["axis reflection"], hiddenStructures: ["coordinate sign transform"], distractors: ["Reflection_Axis_Swap"], difficulty: 2 },
  { id: "coord-reflect-line", category: "distance_reflection", operations: ["line reflection"], hiddenStructures: ["swap coordinates for y equals x"], distractors: ["Reflection_Axis_Swap"], difficulty: 4 },
  { id: "coord-translation-point", category: "distance_reflection", operations: ["translation"], hiddenStructures: ["vector addition"], distractors: ["Quadrant_Boundary_Neglect"], difficulty: 2 },
  { id: "coord-circ-eqn-center", category: "circles", operations: ["circle center-radius equation"], hiddenStructures: ["distance from center invariant"], distractors: ["Circle_Radius_Squared"], difficulty: 2 },
  { id: "coord-circ-general-to-center", category: "circles", operations: ["general circle form"], hiddenStructures: ["complete square"], distractors: ["General_Eqn_Sign_Flip"], difficulty: 3 },
  { id: "coord-circ-tangent", category: "circles", operations: ["circle tangent at point"], hiddenStructures: ["radius perpendicular tangent"], distractors: ["Perpendicular_Slope_Neglect"], difficulty: 4 },
  { id: "coord-circle-diameter", category: "circles", operations: ["circle on diameter"], hiddenStructures: ["midpoint center and half-distance radius"], distractors: ["Circle_Radius_Squared"], difficulty: 3 },
  { id: "coord-circle-point-position", category: "circles", operations: ["point position relative to circle"], hiddenStructures: ["compare squared distance to radius squared"], distractors: ["Origin_Distance_Linear"], difficulty: 3 },
  { id: "coord-circle-line-intersection-count", category: "circles", operations: ["line circle intersection count"], hiddenStructures: ["distance from center to line"], distractors: ["Distance_Line_Denominator"], difficulty: 4 },
  { id: "coord-locus-distance-origin", category: "locus_advanced", operations: ["locus from fixed distance"], hiddenStructures: ["circle as set of points"], distractors: ["Origin_Distance_Linear"], difficulty: 3 },
  { id: "coord-locus-equidistant-two-points", category: "locus_advanced", operations: ["perpendicular bisector locus"], hiddenStructures: ["equal distance condition"], distractors: ["Midpoint_Subtraction"], difficulty: 4 },
  { id: "coord-concurrency-lines", category: "locus_advanced", operations: ["line concurrency"], hiddenStructures: ["common intersection satisfies third line"], distractors: ["Line_Consistency_Confusion"], difficulty: 4 },
  { id: "coord-orthocenter-right", category: "locus_advanced", operations: ["right triangle orthocenter"], hiddenStructures: ["right-angle vertex is orthocenter"], distractors: ["Perpendicular_Slope_Neglect"], difficulty: 3 },
  { id: "coord-median-length", category: "locus_advanced", operations: ["median length from coordinates"], hiddenStructures: ["midpoint then distance"], distractors: ["Midpoint_Subtraction"], difficulty: 3 },
];

const categoryReasoning: Record<CoordinateCategory, string[]> = {
  points: ["coordinate-points", "ordered-pair-operations"],
  lines_slopes: ["straight-lines", "slope-relations"],
  areas_properties: ["coordinate-area", "geometric-classification"],
  distance_reflection: ["distance-from-line", "coordinate-transformations"],
  circles: ["cartesian-circle", "center-radius-invariant"],
  locus_advanced: ["locus-reasoning", "cartesian-constraints"],
};

export const coordinateGeometryMotifs: QuantMotif[] =
  coordinateGeometryProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "coordinate-geometry",
      reasoningCategories: [
        ...categoryReasoning[motif.category],
        ...motif.hiddenStructures,
      ],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "coordinate-geometry",
        "geometry",
        "cartesian-plane",
      ],
      compatiblePatternTypes: ["formula", "logic"],
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3
          ? "multi-step"
          : "direct",
        "symbolic",
      ],
      supportedDifficultyBands:
        motif.difficulty <= 1
          ? ["Easy", "Medium"]
          : motif.difficulty === 2
            ? ["Easy", "Medium", "Hard"]
            : motif.difficulty === 3
              ? ["Medium", "Hard"]
              : ["Hard"],
      commonDistractors: motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3
          ? "conditional"
          : "direct",
      reasoningDepthRange:
        motif.difficulty <= 2
          ? [1, 3]
          : motif.difficulty === 3
            ? [2, 4]
            : [3, 5],
      generationStrategy: [
        "spatial Cartesian engine with ordered-pair states and algebraic constraints",
      ],
      parameterRanges: {
        coordinates:
          "Prefer small integers and Pythagorean-friendly point pairs.",
        lines:
          "Use standard form ax + by + c = 0 before distance and relation checks.",
        circles:
          "Prefer integer centers and radii with clean squared-radius values.",
      },
      validationRules: [
        "Render every point, line equation, slope, and distance formula using MathJax.",
        "Standardize line equations to ax + by + c = 0 before applying distance formulas.",
        "Avoid unintended collinearity or degeneracy unless the motif asks for it.",
      ],
      diversityTags: [
        motif.category,
        motif.id,
      ],
      wordingBias: {
        concise: motif.difficulty <= 2 ? 0.35 : 0.15,
        balanced: 0.55,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.55 : 0.25,
      },
      examWeights: {
        ssc: motif.difficulty <= 2 ? 0.45 : 0.2,
        ibps: 0.15,
        cat: motif.difficulty >= 3 ? 0.75 : 0.45,
      },
      isActive: true,
      version: 1,
      source: "examtree-coordinate-geometry-knowledge-layer",
    }),
  );
