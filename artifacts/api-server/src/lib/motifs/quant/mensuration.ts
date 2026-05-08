import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type MensurationSubtype =
  | "tri_quad"
  | "circle_polygon"
  | "cuboid_prism"
  | "curved_solid"
  | "combined_solid"
  | "scaling";

type MensurationMotifDraft = {
  id: string;
  subtype: MensurationSubtype;
  primitives: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

type MensurationMotifConfig = {
  id: string;
  categories: string[];
  operations: string[];
  distractors: string[];
  depth: [number, number];
  difficulties: QuantMotif["supportedDifficultyBands"];
  strategy: string;
  tuning: QuantMotif["difficultyTuning"];
  diversityTag: string;
};

export const mensurationScopeMap = {
  chapter: "Mensuration",
  core2D: [
    "Triangles",
    "Quadrilaterals",
    "Circles and Sectors",
    "Polygons",
    "Inscribed and Circumscribed Shapes",
  ],
  core3D: [
    "Cubes and Cuboids",
    "Cylinders and Cones",
    "Spheres and Hemispheres",
    "Prisms and Pyramids",
    "Frustums",
    "Hollow Objects",
  ],
  dynamicTransformations: [
    "Recasting",
    "Boundary shifts",
    "Scaling effects",
    "Combined solids",
  ],
} as const;

export const mensurationConcepts = [
  "spatial-state geometry",
  "area and perimeter invariants",
  "volume and surface-area distinction",
  "recasting volume conservation",
  "wire perimeter conservation",
  "path boundary transformation",
  "scaling power laws",
  "combined solid decomposition",
];

export const mensurationCoreFrameworks = [
  {
    id: "CF1",
    title: "2D Area and Perimeter",
    canonicalRelation:
      "$A = \\pi r^2$, $C = 2\\pi r$, $s = \\frac{a+b+c}{2}$",
  },
  {
    id: "CF2",
    title: "3D Volume and Surface Area",
    canonicalRelation:
      "$V_{cyl} = \\pi r^2h$, $V_{cone}=\\frac{1}{3}\\pi r^2h$, $V_{sphere}=\\frac{4}{3}\\pi r^3$",
  },
  {
    id: "CF3",
    title: "Invariant Recasting",
    canonicalRelation:
      "$Volume_{initial}=Volume_{final}$",
  },
  {
    id: "CF4",
    title: "Wire Reshaping",
    canonicalRelation:
      "$Perimeter_{initial}=Perimeter_{final}$",
  },
  {
    id: "CF5",
    title: "Scaling Effects",
    canonicalRelation:
      "Area scales as $k^2$ and volume scales as $k^3$",
  },
];

export const mensurationDistractorRegistry = [
  "Diameter_Radius_Swap",
  "TS_CSA_Confusion",
  "Unit_Power_Error",
  "Heron_Semi_Error",
  "Slant_Height_Neglect",
  "Path_Overlap_Error",
  "Internal_vs_External",
  "Sphere_Hemisphere_TSA",
  "Scaling_Linear_Assumption",
  "Pythagorean_Triple_Slip",
  "Frustum_Formula_Mixup",
  "Diagonal_vs_Side",
  "Recasting_TSA_Invariant",
  "Inscribed_Circle_Radius",
  "Wire_Length_Units",
  "Sector_Angle_Radians",
  "Hexagon_Area_Error",
  "Paint_Area_Omission",
  "Cone_Water_Level",
  "Floating_Point_Pi",
] as const;

export const mensurationProceduralMotifs: MensurationMotifDraft[] = [
  {
    id: "men-tri-ratio",
    subtype: "tri_quad",
    primitives: ["side ratio", "perimeter", "area"],
    hiddenStructures: ["ratio scaling", "right-triangle area"],
    distractorFamilies: ["Pythagorean_Triple_Slip"],
    arithmeticProfile: ["3:4:5 triangle"],
    difficulty: 2,
    examples: ["Sides are in ratio 3:4:5 and perimeter is given."],
  },
  {
    id: "men-rect-path-in",
    subtype: "tri_quad",
    primitives: ["outer rectangle", "inside path width"],
    hiddenStructures: ["inner rectangle subtraction"],
    distractorFamilies: ["Path_Overlap_Error"],
    arithmeticProfile: ["area difference"],
    difficulty: 2,
    examples: ["Path of width w inside a rectangular field."],
  },
  {
    id: "men-rect-path-out",
    subtype: "tri_quad",
    primitives: ["rectangle", "outside path width"],
    hiddenStructures: ["expanded rectangle subtraction"],
    distractorFamilies: ["Path_Overlap_Error"],
    arithmeticProfile: ["boundary expansion"],
    difficulty: 2,
    examples: ["Path outside a rectangular garden."],
  },
  {
    id: "men-rhom-diag",
    subtype: "tri_quad",
    primitives: ["rhombus perimeter", "one diagonal"],
    hiddenStructures: ["half-diagonal right triangle"],
    distractorFamilies: ["Diagonal_vs_Side"],
    arithmeticProfile: ["Pythagorean diagonal recovery"],
    difficulty: 3,
    examples: ["Find other diagonal or area of a rhombus."],
  },
  {
    id: "men-trap-parallel",
    subtype: "tri_quad",
    primitives: ["area", "height", "parallel-side ratio"],
    hiddenStructures: ["sum of parallel sides"],
    distractorFamilies: ["Unit_Power_Error"],
    arithmeticProfile: ["trapezium reverse solve"],
    difficulty: 3,
    examples: ["Find parallel sides of a trapezium from area and ratio."],
  },
  {
    id: "men-circ-revolution",
    subtype: "circle_polygon",
    primitives: ["wheel radius", "revolutions"],
    hiddenStructures: ["circumference accumulation"],
    distractorFamilies: ["Diameter_Radius_Swap"],
    arithmeticProfile: ["circle travel distance"],
    difficulty: 2,
    examples: ["Wheel radius and number of revolutions."],
  },
  {
    id: "men-circ-sector",
    subtype: "circle_polygon",
    primitives: ["angle", "radius"],
    hiddenStructures: ["fraction of circle"],
    distractorFamilies: ["Sector_Angle_Radians"],
    arithmeticProfile: ["sector area"],
    difficulty: 2,
    examples: ["Area of a sector with angle and radius."],
  },
  {
    id: "men-poly-diag",
    subtype: "circle_polygon",
    primitives: ["number of sides"],
    hiddenStructures: ["polygon vertex connection exclusion"],
    distractorFamilies: ["Diagonal_vs_Side"],
    arithmeticProfile: ["diagonal count"],
    difficulty: 2,
    examples: ["Number of diagonals in a polygon."],
  },
  {
    id: "men-poly-angle",
    subtype: "circle_polygon",
    primitives: ["interior exterior angle ratio"],
    hiddenStructures: ["supplementary angle relation"],
    distractorFamilies: ["Inscribed_Circle_Radius"],
    arithmeticProfile: ["regular polygon side count"],
    difficulty: 3,
    examples: ["Interior and exterior angles in a ratio."],
  },
  {
    id: "men-boundary-bend",
    subtype: "circle_polygon",
    primitives: ["wire circumference", "square perimeter"],
    hiddenStructures: ["perimeter invariant"],
    distractorFamilies: ["Recasting_TSA_Invariant"],
    arithmeticProfile: ["wire reshaping"],
    difficulty: 2,
    examples: ["Wire bent from a circle into a square."],
  },
  {
    id: "men-cube-diagonal",
    subtype: "cuboid_prism",
    primitives: ["cube side", "space diagonal"],
    hiddenStructures: ["3D Pythagorean relation"],
    distractorFamilies: ["Diagonal_vs_Side"],
    arithmeticProfile: ["cube diagonal"],
    difficulty: 2,
    examples: ["Longest rod inside a cube."],
  },
  {
    id: "men-cuboid-surface-shift",
    subtype: "cuboid_prism",
    primitives: ["length percent change", "breadth percent change"],
    hiddenStructures: ["multiplicative dimension update"],
    distractorFamilies: ["Scaling_Linear_Assumption"],
    arithmeticProfile: ["volume percent change"],
    difficulty: 3,
    examples: ["Length increases and breadth decreases; find volume change."],
  },
  {
    id: "men-prism-base",
    subtype: "cuboid_prism",
    primitives: ["base area", "prism height"],
    hiddenStructures: ["base-area extrusion"],
    distractorFamilies: ["Hexagon_Area_Error"],
    arithmeticProfile: ["prism volume"],
    difficulty: 3,
    examples: ["Volume of a prism with a triangular or hexagonal base."],
  },
  {
    id: "men-cyl-csa-ratio",
    subtype: "curved_solid",
    primitives: ["cylinder radius", "height"],
    hiddenStructures: ["CSA TSA comparison"],
    distractorFamilies: ["TS_CSA_Confusion"],
    arithmeticProfile: ["surface area ratio"],
    difficulty: 2,
    examples: ["Ratio of CSA to TSA of a cylinder."],
  },
  {
    id: "men-cone-canvas",
    subtype: "curved_solid",
    primitives: ["cone radius", "slant height"],
    hiddenStructures: ["curved surface area"],
    distractorFamilies: ["Slant_Height_Neglect"],
    arithmeticProfile: ["conical tent canvas"],
    difficulty: 3,
    examples: ["Canvas required for a conical tent."],
  },
  {
    id: "men-sph-hem-tsa",
    subtype: "curved_solid",
    primitives: ["hemisphere radius"],
    hiddenStructures: ["curved area plus base"],
    distractorFamilies: ["Sphere_Hemisphere_TSA"],
    arithmeticProfile: ["hemisphere total surface"],
    difficulty: 2,
    examples: ["TSA of a hemisphere."],
  },
  {
    id: "men-cone-sphere-recast",
    subtype: "curved_solid",
    primitives: ["cone volume", "sphere volume"],
    hiddenStructures: ["volume invariant"],
    distractorFamilies: ["Recasting_TSA_Invariant"],
    arithmeticProfile: ["recast radius"],
    difficulty: 3,
    examples: ["Cone melted into a sphere."],
  },
  {
    id: "men-cyl-wire",
    subtype: "curved_solid",
    primitives: ["cylinder volume", "wire radius"],
    hiddenStructures: ["volume conservation with unit normalization"],
    distractorFamilies: ["Wire_Length_Units"],
    arithmeticProfile: ["wire length"],
    difficulty: 3,
    examples: ["Cylinder drawn into a thin wire."],
  },
  {
    id: "men-frustum-vol",
    subtype: "combined_solid",
    primitives: ["frustum radii", "height"],
    hiddenStructures: ["Rr cross-term"],
    distractorFamilies: ["Frustum_Formula_Mixup"],
    arithmeticProfile: ["frustum volume"],
    difficulty: 4,
    examples: ["Volume of a bucket or frustum."],
  },
  {
    id: "men-hollow-cyl",
    subtype: "combined_solid",
    primitives: ["outer radius", "inner radius", "height"],
    hiddenStructures: ["annular cross-section"],
    distractorFamilies: ["Internal_vs_External"],
    arithmeticProfile: ["hollow cylinder volume"],
    difficulty: 3,
    examples: ["Volume of material in a hollow pipe."],
  },
  {
    id: "men-inscribed-max",
    subtype: "combined_solid",
    primitives: ["sphere radius", "cube diagonal"],
    hiddenStructures: ["cube diagonal equals sphere diameter"],
    distractorFamilies: ["Diagonal_vs_Side"],
    arithmeticProfile: ["inscribed cube side"],
    difficulty: 4,
    examples: ["Largest cube carved from a sphere."],
  },
  {
    id: "men-ice-cream",
    subtype: "combined_solid",
    primitives: ["cone", "hemisphere"],
    hiddenStructures: ["combined solid volume"],
    distractorFamilies: ["TS_CSA_Confusion"],
    arithmeticProfile: ["cone plus hemisphere"],
    difficulty: 3,
    examples: ["Ice-cream cone topped with a hemisphere."],
  },
  {
    id: "men-pyramid-slant",
    subtype: "combined_solid",
    primitives: ["square base", "slant height"],
    hiddenStructures: ["four triangular faces"],
    distractorFamilies: ["Slant_Height_Neglect"],
    arithmeticProfile: ["pyramid TSA"],
    difficulty: 4,
    examples: ["TSA of a square-based pyramid."],
  },
  {
    id: "men-scale-area",
    subtype: "scaling",
    primitives: ["linear scale factor", "area"],
    hiddenStructures: ["area square law"],
    distractorFamilies: ["Scaling_Linear_Assumption"],
    arithmeticProfile: ["area scaling"],
    difficulty: 2,
    examples: ["Linear dimensions increase by k; area changes by k^2."],
  },
  {
    id: "men-scale-vol",
    subtype: "scaling",
    primitives: ["linear scale factor", "volume"],
    hiddenStructures: ["volume cube law"],
    distractorFamilies: ["Scaling_Linear_Assumption"],
    arithmeticProfile: ["volume scaling"],
    difficulty: 3,
    examples: ["Linear dimensions increase by k; volume changes by k^3."],
  },
  {
    id: "men-max-perimeter",
    subtype: "scaling",
    primitives: ["fixed perimeter", "area comparison"],
    hiddenStructures: ["circle maximizes area"],
    distractorFamilies: ["Scaling_Linear_Assumption"],
    arithmeticProfile: ["optimization relation"],
    difficulty: 4,
    examples: ["Best area for a fixed boundary length."],
  },
];

function buildConfig(
  draft: MensurationMotifDraft,
): MensurationMotifConfig {
  const difficultyMap = {
    1: ["Easy", "Medium"],
    2: ["Easy", "Medium", "Hard"],
    3: ["Medium", "Hard"],
    4: ["Hard"],
  } as const;
  return {
    id: draft.id,
    categories: [
      draft.subtype,
      ...draft.hiddenStructures,
    ],
    operations: [
      ...draft.primitives,
      ...draft.arithmeticProfile,
    ],
    distractors: draft.distractorFamilies,
    depth:
      draft.difficulty === 1
        ? [1, 2]
        : draft.difficulty === 2
          ? [2, 4]
          : draft.difficulty === 3
            ? [3, 5]
            : [5, 7],
    difficulties:
      difficultyMap[draft.difficulty],
    strategy:
      "spatial-state procedural generation with area, perimeter, volume, and invariant tracking",
    tuning: {
      easy: [
        "Use one standard shape and direct variables.",
        "Keep all formula symbols in MathJax.",
      ],
      medium: [
        "Use one transformation such as path, recasting, surface distinction, or scaling.",
        "Prefer clean values with $\\pi = \\frac{22}{7}$ when useful.",
      ],
      hard: [
        "Use combined solids, hollow objects, frustums, or inscribed geometry.",
        "Difficulty should come from spatial transformation, not large arithmetic.",
      ],
    },
    diversityTag: draft.subtype,
  };
}

const mensurationMotifConfigs =
  mensurationProceduralMotifs.map(
    buildConfig,
  );

export const mensurationMotifs =
  mensurationMotifConfigs.map((config) =>
    defineQuantMotif({
      id: config.id,
      topicCluster: "mensuration",
      reasoningCategories:
        config.categories,
      preferredOperations:
        config.operations,
      compatibleTopics: [
        "mensuration",
        "geometry-basics",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables:
        config.operations,
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "comparative",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        config.difficulties,
      commonDistractors:
        config.distractors,
      inferenceStyle:
        config.depth[1] >= 5
          ? "hidden"
          : "conditional",
      reasoningDepthRange:
        config.depth,
      generationStrategy: [
        config.strategy,
      ],
      parameterRanges: {
        piChoice:
          "Use 22/7 for radii divisible by 7; otherwise use clean integer pi-free relations.",
        length:
          "Prefer 6, 7, 10, 14, 21, 28, 35, 42 for clean geometry.",
        volume:
          "Preserve volume invariants exactly in recasting questions.",
      },
      distractorStrategies:
        config.distractors,
      difficultyTuning:
        config.tuning,
      validationRules: [
        "Render every formula and variable in MathJax syntax.",
        "Check unit consistency before solving.",
        "Do not assume surface area remains invariant during recasting.",
        "Use correct power law: area scales by $k^2$, volume by $k^3$.",
      ],
      diversityTags: [
        config.diversityTag,
        config.id,
      ],
      wordingBias: {
        balanced: 0.6,
        inferenceHeavy: 0.4,
      },
      examWeights: {
        ssc: 0.6,
        ibps: 0.2,
        rrb: 0.2,
      },
    }),
  );
