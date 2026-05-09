import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type GeometryMotifDraft = {
  id: string;
  category:
    | "lines_angles"
    | "triangles"
    | "similarity_congruency"
    | "right_triangles"
    | "circles"
    | "quadrilaterals_polygons"
    | "coordinate_geometry";
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const geometryScopeMap = {
  chapter: "Geometry",
  coreDomains: [
    "Lines and angles",
    "Triangles and triangle centers",
    "Similarity and congruency",
    "Right-angled triangles",
    "Circles, tangents, and chords",
    "Quadrilaterals and polygons",
    "Coordinate geometry",
  ],
} as const;

export const geometryDistractorRegistry = [
  "Similarity_Ratio_Linear",
  "Circumcenter_Incenter_Confusion",
  "Pythagorean_Triple_Slip",
  "Tangent_Secant_Addition",
  "Cyclic_Adjacent_Trap",
  "Median_Altitude_Swap",
  "Exterior_Angle_Total",
  "Rhombus_Area_Side",
  "Slope_Inversion",
  "Distance_Sign_Error",
  "Internal_Bisector_Ratio_Flip",
  "Apollonius_Factor_Omission",
  "Tangent_Radius_Non_Perp",
  "Angle_at_Center_Half",
  "Semi-circle_Angle_Error",
  "Parallel_Transversal_Corresponding",
  "Isosceles_Base_Angle_Assumption",
  "Polygon_Diagonal_n",
  "Coordinate_Collinear_Check",
  "Common_Tangent_Sign_Swap",
] as const;

export const geometryProceduralMotifs: GeometryMotifDraft[] = [
  { id: "geo-ang-parallel", category: "lines_angles", operations: ["alternate interior angles", "corresponding angles"], hiddenStructures: ["parallel-transversal angle transfer"], distractors: ["Parallel_Transversal_Corresponding"], difficulty: 1 },
  { id: "geo-ang-bisector", category: "lines_angles", operations: ["angle bisector theorem"], hiddenStructures: ["side ratio to opposite segments"], distractors: ["Internal_Bisector_Ratio_Flip"], difficulty: 2 },
  { id: "geo-ang-complement", category: "lines_angles", operations: ["complementary angles", "supplementary angles"], hiddenStructures: ["angle sum invariant"], distractors: ["Exterior_Angle_Total"], difficulty: 1 },
  { id: "geo-ang-polygon", category: "lines_angles", operations: ["interior angle sum", "exterior angle sum"], hiddenStructures: ["polygon angle total"], distractors: ["Exterior_Angle_Total"], difficulty: 2 },
  { id: "geo-tri-inequality", category: "triangles", operations: ["triangle inequality"], hiddenStructures: ["valid side interval"], distractors: ["Pythagorean_Triple_Slip"], difficulty: 2 },
  { id: "geo-tri-orthocenter", category: "triangles", operations: ["altitudes", "orthocenter"], hiddenStructures: ["right-angle altitude intersection"], distractors: ["Median_Altitude_Swap"], difficulty: 3 },
  { id: "geo-tri-circumcenter", category: "triangles", operations: ["circumradius", "right triangle circumcenter"], hiddenStructures: ["hypotenuse midpoint"], distractors: ["Circumcenter_Incenter_Confusion"], difficulty: 3 },
  { id: "geo-tri-incenter", category: "triangles", operations: ["incenter angle"], hiddenStructures: ["half-angle relation"], distractors: ["Circumcenter_Incenter_Confusion"], difficulty: 3 },
  { id: "geo-tri-centroid", category: "triangles", operations: ["median", "centroid ratio"], hiddenStructures: ["2:1 median split"], distractors: ["Median_Altitude_Swap"], difficulty: 2 },
  { id: "geo-tri-med-length", category: "triangles", operations: ["Apollonius theorem"], hiddenStructures: ["median length reconstruction"], distractors: ["Apollonius_Factor_Omission"], difficulty: 4 },
  { id: "geo-tri-area-ratio", category: "triangles", operations: ["area ratio"], hiddenStructures: ["same height or same base"], distractors: ["Similarity_Ratio_Linear"], difficulty: 2 },
  { id: "geo-tri-exterior-angle", category: "triangles", operations: ["exterior angle theorem"], hiddenStructures: ["remote interior angle sum"], distractors: ["Exterior_Angle_Total"], difficulty: 2 },
  { id: "geo-tri-isosceles-base", category: "triangles", operations: ["isosceles base angles"], hiddenStructures: ["equal sides imply equal angles"], distractors: ["Isosceles_Base_Angle_Assumption"], difficulty: 2 },
  { id: "geo-sim-basic", category: "similarity_congruency", operations: ["AA similarity", "side proportion"], hiddenStructures: ["linear scale factor"], distractors: ["Similarity_Ratio_Linear"], difficulty: 2 },
  { id: "geo-sim-area", category: "similarity_congruency", operations: ["similar triangle area ratio"], hiddenStructures: ["square of side ratio"], distractors: ["Similarity_Ratio_Linear"], difficulty: 3 },
  { id: "geo-cong-proof", category: "similarity_congruency", operations: ["RHS", "ASA", "SAS"], hiddenStructures: ["congruency criteria selection"], distractors: ["Median_Altitude_Swap"], difficulty: 2 },
  { id: "geo-tri-thales", category: "similarity_congruency", operations: ["basic proportionality theorem"], hiddenStructures: ["parallel line side split"], distractors: ["Internal_Bisector_Ratio_Flip"], difficulty: 3 },
  { id: "geo-right-pythagoras", category: "right_triangles", operations: ["Pythagoras theorem"], hiddenStructures: ["right triangle triple"], distractors: ["Pythagorean_Triple_Slip"], difficulty: 1 },
  { id: "geo-right-altitude", category: "right_triangles", operations: ["altitude to hypotenuse"], hiddenStructures: ["geometric mean"], distractors: ["Median_Altitude_Swap"], difficulty: 3 },
  { id: "geo-right-30-60-90", category: "right_triangles", operations: ["30-60-90 ratio"], hiddenStructures: ["special right triangle"], distractors: ["Pythagorean_Triple_Slip"], difficulty: 2 },
  { id: "geo-right-45-45-90", category: "right_triangles", operations: ["45-45-90 ratio"], hiddenStructures: ["isosceles right triangle"], distractors: ["Pythagorean_Triple_Slip"], difficulty: 2 },
  { id: "geo-circ-chord-dist", category: "circles", operations: ["perpendicular from center to chord"], hiddenStructures: ["half-chord right triangle"], distractors: ["Tangent_Radius_Non_Perp"], difficulty: 3 },
  { id: "geo-circ-intersect-chord", category: "circles", operations: ["intersecting chords theorem"], hiddenStructures: ["product equality"], distractors: ["Tangent_Secant_Addition"], difficulty: 3 },
  { id: "geo-circ-tangent-secant", category: "circles", operations: ["tangent-secant theorem"], hiddenStructures: ["whole secant product"], distractors: ["Tangent_Secant_Addition"], difficulty: 3 },
  { id: "geo-circ-cyclic-quad", category: "circles", operations: ["cyclic quadrilateral"], hiddenStructures: ["opposite supplementary angles"], distractors: ["Cyclic_Adjacent_Trap"], difficulty: 2 },
  { id: "geo-circ-alternate-segment", category: "circles", operations: ["alternate segment theorem"], hiddenStructures: ["tangent chord angle transfer"], distractors: ["Angle_at_Center_Half"], difficulty: 3 },
  { id: "geo-circ-direct-common", category: "circles", operations: ["direct common tangent"], hiddenStructures: ["right triangle with radius difference"], distractors: ["Common_Tangent_Sign_Swap"], difficulty: 4 },
  { id: "geo-circ-trans-common", category: "circles", operations: ["transverse common tangent"], hiddenStructures: ["right triangle with radius sum"], distractors: ["Common_Tangent_Sign_Swap"], difficulty: 4 },
  { id: "geo-circ-angle-center", category: "circles", operations: ["angle at center"], hiddenStructures: ["center angle double circumference angle"], distractors: ["Angle_at_Center_Half"], difficulty: 2 },
  { id: "geo-circ-semicircle", category: "circles", operations: ["angle in semicircle"], hiddenStructures: ["diameter subtends right angle"], distractors: ["Semi-circle_Angle_Error"], difficulty: 2 },
  { id: "geo-quad-parallelogram", category: "quadrilaterals_polygons", operations: ["parallelogram adjacent angles"], hiddenStructures: ["supplementary adjacent angles"], distractors: ["Cyclic_Adjacent_Trap"], difficulty: 2 },
  { id: "geo-quad-rhombus-diag", category: "quadrilaterals_polygons", operations: ["rhombus diagonals"], hiddenStructures: ["perpendicular diagonal halves"], distractors: ["Rhombus_Area_Side"], difficulty: 3 },
  { id: "geo-quad-trapezium-mid", category: "quadrilaterals_polygons", operations: ["trapezium mid-segment"], hiddenStructures: ["average of parallel sides"], distractors: ["Similarity_Ratio_Linear"], difficulty: 2 },
  { id: "geo-poly-interior", category: "quadrilaterals_polygons", operations: ["regular polygon interior angle"], hiddenStructures: ["exterior angle complement"], distractors: ["Polygon_Diagonal_n"], difficulty: 2 },
  { id: "geo-poly-diagonal", category: "quadrilaterals_polygons", operations: ["polygon diagonals"], hiddenStructures: ["avoid double counting"], distractors: ["Polygon_Diagonal_n"], difficulty: 2 },
  { id: "geo-quad-kite", category: "quadrilaterals_polygons", operations: ["kite diagonals"], hiddenStructures: ["perpendicular diagonal area"], distractors: ["Rhombus_Area_Side"], difficulty: 3 },
  { id: "geo-coord-dist", category: "coordinate_geometry", operations: ["distance formula"], hiddenStructures: ["coordinate displacement"], distractors: ["Distance_Sign_Error"], difficulty: 2 },
  { id: "geo-coord-section", category: "coordinate_geometry", operations: ["section formula"], hiddenStructures: ["weighted coordinate average"], distractors: ["Internal_Bisector_Ratio_Flip"], difficulty: 3 },
  { id: "geo-coord-slope", category: "coordinate_geometry", operations: ["slope formula", "perpendicularity"], hiddenStructures: ["rise over run"], distractors: ["Slope_Inversion"], difficulty: 2 },
  { id: "geo-coord-area", category: "coordinate_geometry", operations: ["coordinate triangle area"], hiddenStructures: ["shoelace determinant"], distractors: ["Coordinate_Collinear_Check"], difficulty: 3 },
  { id: "geo-coord-circle", category: "coordinate_geometry", operations: ["circle equation"], hiddenStructures: ["center-radius form"], distractors: ["Distance_Sign_Error"], difficulty: 3 },
  { id: "geo-coord-midpoint", category: "coordinate_geometry", operations: ["midpoint formula"], hiddenStructures: ["coordinate averaging"], distractors: ["Slope_Inversion"], difficulty: 2 },
];

export const geometryMotifs: QuantMotif[] =
  geometryProceduralMotifs.map((motif) => {
    const difficultyMap = {
      1: ["Easy", "Medium"],
      2: ["Easy", "Medium", "Hard"],
      3: ["Medium", "Hard"],
      4: ["Hard"],
    } as const;

    return defineQuantMotif({
      id: motif.id,
      topicCluster: "geometry",
      reasoningCategories: [
        motif.category,
        ...motif.hiddenStructures,
      ],
      preferredOperations:
        motif.operations,
      compatibleTopics: [
        "geometry",
        "geometry-basics",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables:
        motif.operations,
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
        "visual",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "comparative",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        difficultyMap[motif.difficulty],
      commonDistractors:
        motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3
          ? "hidden"
          : "conditional",
      reasoningDepthRange:
        motif.difficulty === 1
          ? [1, 2]
          : motif.difficulty === 2
            ? [2, 4]
            : motif.difficulty === 3
              ? [3, 5]
              : [5, 7],
      generationStrategy: [
        "theorem-map procedural generation with MathJax-rendered geometry notation",
      ],
      parameterRanges: {
        angles:
          "Prefer clean angles such as 30, 45, 60, 70, 90, 110, 120, 140.",
        triples:
          "Prefer 3-4-5, 5-12-13, 8-15-17, 7-24-25 for right triangles.",
        coordinates:
          "Prefer small integer coordinates and avoid unintended collinearity.",
      },
      distractorStrategies:
        motif.distractors,
      difficultyTuning: {
        easy: [
          "Use one direct theorem and clean whole-number values.",
        ],
        medium: [
          "Require one hidden relation such as similarity, tangent product, or centroid split.",
        ],
        hard: [
          "Use triangle centers, common tangents, coordinate relations, or theorem chaining.",
        ],
      },
      validationRules: [
        "Render every angle, line relation, triangle symbol, congruency symbol, and similarity symbol in MathJax.",
        "Preserve theorem constraints before computing the answer.",
        "Avoid coordinate collinearity unless the motif explicitly asks for it.",
      ],
      diversityTags: [
        motif.category,
        motif.id,
      ],
      wordingBias: {
        balanced: 0.55,
        inferenceHeavy: 0.45,
      },
      examWeights: {
        ssc: 0.45,
        ibps: 0.15,
        cat: 0.3,
        rrb: 0.1,
      },
    });
  });
