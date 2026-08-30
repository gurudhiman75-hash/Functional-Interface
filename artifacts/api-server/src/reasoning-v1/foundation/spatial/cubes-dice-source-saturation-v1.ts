export type CubesDiceSourceConfidenceV1 = "DIRECT_SSC_PYQ" | "DIRECT_GOVT_EXAM_PYQ" | "CROSS_EXAM_RECURRING";
export type CubesDiceCandidateDispositionV1 = "RETAIN_CORE" | "RETAIN_SECONDARY" | "HOLD_FOR_LATER_PROOF";

export interface CubesDiceSourcePatternV1 {
  patternId: string;
  module:
    | "DICE_ORIENTATION"
    | "FACE_RELATIONS"
    | "POSSIBLE_IMPOSSIBLE"
    | "CUBE_NET"
    | "PAINTED_CUBE"
    | "SELECTIVE_PAINT"
    | "CUBE_STACK"
    | "ORTHOGRAPHIC_VIEW";
  task: string;
  sourceConfidence: CubesDiceSourceConfidenceV1;
  sourceExamples: readonly string[];
  disposition: CubesDiceCandidateDispositionV1;
  solverContract: string;
  representationNotes: string;
}

export const CND_001_SOURCE_SATURATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-SOURCE-SATURATION-V1" as const,
  chapterCode: "CND-001" as const,
  nextPermanentQlId: "SPA-QL-043" as const,
  sourcePolicy: "PATTERN_AND_REASONING_CONTRACT_ONLY_NO_SOURCE_WORDING_OR_DIAGRAM_COPY" as const,
  status: "SOURCE_SATURATED_CANDIDATE_INVENTORY_BEFORE_MERGE_SPLIT_AND_QL_ALLOCATION" as const,
  automaticStudentPublication: false,
});

export const CND_001_SOURCE_PATTERNS_V1 = Object.freeze([
  {
    patternId: "CND-SRC-001",
    module: "FACE_RELATIONS",
    task: "Find the face opposite a target from two visible positions with one common face.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CGL Tier-I 2024 two-position labelled dice", "SSC CGL memory-based 2022 two-position labelled dice"],
    disposition: "RETAIN_CORE",
    solverContract: "Enumerate all proper rotations and compatible six-face assignments; opposite target must be unique.",
    representationNotes: "Two isometric die views, three visible faces each, labels may be numbers/letters/symbols.",
  },
  {
    patternId: "CND-SRC-002",
    module: "FACE_RELATIONS",
    task: "Find the face opposite a target when two faces are common across two die views.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC GD 2022/2023 symbol-labelled two-view dice"],
    disposition: "RETAIN_CORE",
    solverContract: "Exact compatibility solver; shortcut rule may be explained only after solver confirmation.",
    representationNotes: "Symbols and alphanumerics must remain visually unambiguous at mobile size.",
  },
  {
    patternId: "CND-SRC-003",
    module: "DICE_ORIENTATION",
    task: "Choose a valid next or alternative rotation of the same die.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC GD 2021 three-position die rotation"],
    disposition: "RETAIN_CORE",
    solverContract: "Candidate visible triplet must belong to the 24 proper rotations of a compatible labelled cube; reflections rejected.",
    representationNotes: "Option figures need the same camera convention as the stem views.",
  },
  {
    patternId: "CND-SRC-004",
    module: "POSSIBLE_IMPOSSIBLE",
    task: "Identify which candidate cube cannot be formed because opposite faces appear adjacent.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CHSL 2018 cube-formation option question"],
    disposition: "RETAIN_CORE",
    solverContract: "Resolve opposite pairs from the net/observations, then test every option against proper rotations only.",
    representationNotes: "All answer options are cube views, not text-only distractors.",
  },
  {
    patternId: "CND-SRC-005",
    module: "CUBE_NET",
    task: "Fold a labelled open cube/die net and find the opposite face.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CGL Tier-II 2023 open cube net", "SSC CPO 2023 alphanumeric cube net", "SSC GD 2021 letter/symbol cube nets"],
    disposition: "RETAIN_CORE",
    solverContract: "Fold orthogonally connected net cells into six unique 3D normals and resolve the antipodal normal.",
    representationNotes: "Equal orthogonal squares, canonical upright net, centered labels, white background.",
  },
  {
    patternId: "CND-SRC-006",
    module: "CUBE_NET",
    task: "Identify an opposite pair or a possible folded cube from a labelled net.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC GD open-die opposite-pair questions"],
    disposition: "RETAIN_CORE",
    solverContract: "All face relations derived from folded 3D normals; no memorized net-position heuristic accepted as validator.",
    representationNotes: "Question and options may be mixed text/figure depending on target relation.",
  },
  {
    patternId: "CND-SRC-007",
    module: "PAINTED_CUBE",
    task: "All six faces painted; count smaller cubes with exactly one painted face.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CGL 2021 Tier-I painted cube exactly-one-face questions"],
    disposition: "RETAIN_CORE",
    solverContract: "Enumerate subdivided cube coordinates and boundary paint exposure; formula is secondary explanation evidence.",
    representationNotes: "Can be text-first with a simple subdivided-cube stimulus when useful.",
  },
  {
    patternId: "CND-SRC-008",
    module: "PAINTED_CUBE",
    task: "All six faces painted; count smaller cubes with exactly two or three painted faces.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CGL 2021 Tier-I exactly-two-face and exactly-three-face questions"],
    disposition: "RETAIN_CORE",
    solverContract: "Coordinate exposure count must match edge/corner shortcut counts.",
    representationNotes: "Numeric options; avoid artificial decorative colours when paint colour is irrelevant.",
  },
  {
    patternId: "CND-SRC-009",
    module: "PAINTED_CUBE",
    task: "Count smaller cubes with no painted face, at least a given number of painted faces, or compare categories.",
    sourceConfidence: "CROSS_EXAM_RECURRING",
    sourceExamples: ["Government-exam painted-cube no-face and category-comparison questions"],
    disposition: "RETAIN_CORE",
    solverContract: "Coordinate enumeration and category aggregation.",
    representationNotes: "Text-first is acceptable; explanations must classify corner/edge/face/interior cubes.",
  },
  {
    patternId: "CND-SRC-010",
    module: "SELECTIVE_PAINT",
    task: "Different colours on opposite face-pairs; count cubes carrying specified colour combinations.",
    sourceConfidence: "DIRECT_GOVT_EXAM_PYQ",
    sourceExamples: ["DSSSB TGT 2021 opposite-pair red/yellow/blue painted cube"],
    disposition: "RETAIN_SECONDARY",
    solverContract: "Coordinate exposure with a face-to-colour map; evaluate exact colour set per unit cube.",
    representationNotes: "Colour metadata must also store face-name semantics for accessibility and localization.",
  },
  {
    patternId: "CND-SRC-011",
    module: "SELECTIVE_PAINT",
    task: "Adjacent/opposite faces use repeated colours; count cubes with only one specified colour or no paint.",
    sourceConfidence: "DIRECT_GOVT_EXAM_PYQ",
    sourceExamples: ["DSSSB PRT 2018/2022 selectively coloured cube questions"],
    disposition: "RETAIN_SECONDARY",
    solverContract: "Explicit painted-face colour map; all-six-face formula shortcuts are insufficient.",
    representationNotes: "Use restrained colours and textual colour labels in metadata.",
  },
  {
    patternId: "CND-SRC-012",
    module: "FACE_RELATIONS",
    task: "Infer adjacent colours/faces from verbal opposite and adjacency constraints.",
    sourceConfidence: "DIRECT_GOVT_EXAM_PYQ",
    sourceExamples: ["UPSSSC JE 2015 coloured cube face-relation question", "Telangana Police SI 2022 coloured cube relation question"],
    disposition: "RETAIN_SECONDARY",
    solverContract: "Search cube-face assignments satisfying all opposite/adjacency predicates.",
    representationNotes: "May be fully textual; cube diagram optional if it does not leak the answer.",
  },
  {
    patternId: "CND-SRC-013",
    module: "FACE_RELATIONS",
    task: "Minimum colours so adjacent cube faces differ.",
    sourceConfidence: "DIRECT_SSC_PYQ",
    sourceExamples: ["SSC CGL 2019 cube-face colouring"],
    disposition: "RETAIN_SECONDARY",
    solverContract: "Cube face adjacency graph colouring; opposite faces form the three reusable colour pairs.",
    representationNotes: "Text-only is adequate; this remains spatial face-graph reasoning, not general graph theory instruction.",
  },
  {
    patternId: "CND-SRC-014",
    module: "CUBE_STACK",
    task: "Count total/hidden cubes or exposed faces in an incomplete stable cube stack.",
    sourceConfidence: "CROSS_EXAM_RECURRING",
    sourceExamples: ["Competitive non-verbal reasoning cube-stack families"],
    disposition: "HOLD_FOR_LATER_PROOF",
    solverContract: "Explicit voxel occupancy with gravity/support validation and hidden-cube accounting.",
    representationNotes: "Requires reviewed isometric stack renderer before retention.",
  },
  {
    patternId: "CND-SRC-015",
    module: "ORTHOGRAPHIC_VIEW",
    task: "Determine or count cells in top/front/right view of a cube stack.",
    sourceConfidence: "CROSS_EXAM_RECURRING",
    sourceExamples: ["Competitive spatial reasoning orthographic cube-view families"],
    disposition: "HOLD_FOR_LATER_PROOF",
    solverContract: "Exact voxel projection to requested plane; candidate view must match projected occupied coordinates.",
    representationNotes: "Requires paired isometric and 2D view renderer review.",
  },
] as const satisfies readonly CubesDiceSourcePatternV1[]);

export const CND_001_SOURCE_SATURATION_SUMMARY_V1 = Object.freeze({
  authorityId: CND_001_SOURCE_SATURATION_AUTHORITY_V1.authorityId,
  patternCount: CND_001_SOURCE_PATTERNS_V1.length,
  directSscPatternCount: CND_001_SOURCE_PATTERNS_V1.filter((pattern) => pattern.sourceConfidence === "DIRECT_SSC_PYQ").length,
  directGovernmentPatternCount: CND_001_SOURCE_PATTERNS_V1.filter((pattern) => pattern.sourceConfidence === "DIRECT_GOVT_EXAM_PYQ").length,
  retainedCoreCount: CND_001_SOURCE_PATTERNS_V1.filter((pattern) => pattern.disposition === "RETAIN_CORE").length,
  retainedSecondaryCount: CND_001_SOURCE_PATTERNS_V1.filter((pattern) => pattern.disposition === "RETAIN_SECONDARY").length,
  heldForLaterProofCount: CND_001_SOURCE_PATTERNS_V1.filter((pattern) => pattern.disposition === "HOLD_FOR_LATER_PROOF").length,
  permanentQlAllocationAuthorized: false,
  nextPermanentQlId: "SPA-QL-043" as const,
});
