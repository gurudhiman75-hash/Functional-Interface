import { CND_001_SOURCE_SATURATION_AUTHORITY_V1 } from "./cubes-dice-source-saturation-v1";

export type CubesDiceCanonicalSkillStatusV1 =
  | "RETAIN_FOR_PRE_ALLOCATION_APPROVAL"
  | "RETAIN_HELD_FOR_RUNTIME_PROOF";

export interface CubesDiceCanonicalSkillV1 {
  canonicalSkillId: string;
  name: string;
  status: CubesDiceCanonicalSkillStatusV1;
  absorbsSourcePatterns: readonly string[];
  solverFamily: string;
  mergeRationale: string;
  splitRationale: string;
  earliestPermanentQlId: string | null;
}

export const CND_001_MERGE_SPLIT_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-MERGE-SPLIT-V1" as const,
  chapterCode: "CND-001" as const,
  sourceAuthorityId: CND_001_SOURCE_SATURATION_AUTHORITY_V1.authorityId,
  nextPermanentQlId: "SPA-QL-043" as const,
  policy: "SEMANTIC_SKILL_NOT_STEM_OR_REPRESENTATION_VARIANT" as const,
  permanentQlAllocationAuthorized: false,
  status: "CANONICAL_SKILLS_RETAINED_PRE_ALLOCATION_REVIEW" as const,
  automaticStudentPublication: false,
});

export const CND_001_CANONICAL_SKILLS_V1 = Object.freeze([
  {
    canonicalSkillId: "CND-CAN-A-DIE-FACE-RELATIONS",
    name: "Infer die face relations under proper cube rotation",
    status: "RETAIN_FOR_PRE_ALLOCATION_APPROVAL",
    absorbsSourcePatterns: ["CND-SRC-001", "CND-SRC-002", "CND-SRC-003", "CND-SRC-004", "CND-SRC-012", "CND-SRC-013"],
    solverFamily: "CUBE_ROTATION_ASSIGNMENT_AND_FACE_ADJACENCY",
    mergeRationale: "Opposite, adjacent, common-face, valid-view and possible/impossible prompts are query variants over the same labelled-cube orientation and face-relation state.",
    splitRationale: "Kept separate from cube nets because nets require a 2D-to-3D fold transformation rather than inference from already folded views or verbal face constraints.",
    earliestPermanentQlId: "SPA-QL-043",
  },
  {
    canonicalSkillId: "CND-CAN-B-CUBE-NET-FOLDING",
    name: "Fold a cube net and infer face relations",
    status: "RETAIN_FOR_PRE_ALLOCATION_APPROVAL",
    absorbsSourcePatterns: ["CND-SRC-005", "CND-SRC-006"],
    solverFamily: "ORTHOGONAL_NET_TO_3D_FACE_NORMALS",
    mergeRationale: "Opposite-pair and possible-folded-view tasks are queries over the same exact folded face-normal state.",
    splitRationale: "Distinct from die-view reasoning because the learner must construct the cube from a planar net before applying face relations.",
    earliestPermanentQlId: "SPA-QL-044",
  },
  {
    canonicalSkillId: "CND-CAN-C-PAINTED-CUBE-EXPOSURE",
    name: "Count subdivided cubes by painted-face exposure",
    status: "RETAIN_FOR_PRE_ALLOCATION_APPROVAL",
    absorbsSourcePatterns: ["CND-SRC-007", "CND-SRC-008", "CND-SRC-009", "CND-SRC-010", "CND-SRC-011"],
    solverFamily: "UNIT_CUBE_COORDINATE_BOUNDARY_EXPOSURE",
    mergeRationale: "Exactly-zero/one/two/three-face, category aggregation and selective-paint prompts differ by paint specification and query, not by underlying unit-cube exposure skill.",
    splitRationale: "Distinct from face-relation tasks because no rigid cube orientation inference is required; the state is a subdivided solid with boundary exposure.",
    earliestPermanentQlId: "SPA-QL-045",
  },
  {
    canonicalSkillId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY",
    name: "Reason about complete and incomplete unit-cube stacks",
    status: "RETAIN_HELD_FOR_RUNTIME_PROOF",
    absorbsSourcePatterns: ["CND-SRC-014"],
    solverFamily: "VOXEL_OCCUPANCY_SUPPORT_AND_EXPOSURE",
    mergeRationale: "Hidden-cube, completion and exposed-face queries share one explicit voxel occupancy state.",
    splitRationale: "Kept separate from orthographic projection because stack occupancy asks about the 3D object itself rather than its 2D projected image.",
    earliestPermanentQlId: null,
  },
  {
    canonicalSkillId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION",
    name: "Interpret top, front and side views of cube stacks",
    status: "RETAIN_HELD_FOR_RUNTIME_PROOF",
    absorbsSourcePatterns: ["CND-SRC-015"],
    solverFamily: "VOXEL_TO_ORTHOGRAPHIC_PROJECTION",
    mergeRationale: "Top/front/right are camera-axis parameters of one projection skill rather than separate QLs.",
    splitRationale: "Separate from voxel occupancy because projection can lose depth information and requires reasoning about a 2D view rather than direct cube counts.",
    earliestPermanentQlId: null,
  },
] as const satisfies readonly CubesDiceCanonicalSkillV1[]);

export const CND_001_MERGE_SPLIT_SUMMARY_V1 = Object.freeze({
  authorityId: CND_001_MERGE_SPLIT_AUTHORITY_V1.authorityId,
  canonicalSkillCount: CND_001_CANONICAL_SKILLS_V1.length,
  preAllocationApprovalCandidateCount: CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_FOR_PRE_ALLOCATION_APPROVAL").length,
  heldForRuntimeProofCount: CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_HELD_FOR_RUNTIME_PROOF").length,
  proposedInitialRangeIfApproved: "SPA-QL-043..SPA-QL-045" as const,
  allocationPerformed: false,
});
