import { PFC_001_SOURCE_SATURATION_AUTHORITY_V2 } from "./paper-folding-source-saturation-v2";
import { PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY } from "./paper-folding-source-saturated-discovery-v2";
import { PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1 } from "./paper-folding-post-wave2-saturation-audit-v1";
import { TPF_001_DISCOVERY_WAVE2_AUTHORITY } from "./transparent-pattern-folding-discovery-v2";

export type PfcTpfSkillProposalIdV1 =
  | "PFC-PROP-01"
  | "PFC-PROP-02"
  | "PFC-PROP-03"
  | "PFC-PROP-04"
  | "PFC-PROP-05"
  | "TPF-PROP-01";

export type PfcTpfProposalDifficultyV1 = "MODERATE" | "ADVANCED";

export interface PfcTpfSkillProposalV1 {
  proposalId: PfcTpfSkillProposalIdV1;
  chapterCode: "PFC-001" | "TPF-001";
  name: string;
  taskContract:
    | "OPAQUE_CUT_UNFOLD_FORWARD"
    | "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE"
    | "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION";
  skillAuthority: string;
  baseDifficulty: PfcTpfProposalDifficultyV1;
  historicalQlRelationship: "RETAIN_AND_EXPAND" | "NEW_DISTINCT_SKILL" | "SEPARATE_CHAPTER_SKILL";
  historicalQlId: "SPA-QL-035" | "SPA-QL-036" | "SPA-QL-037" | "SPA-QL-038" | null;
  permanentQlId: null;
  sourceShapes: readonly ("SQUARE" | "RECTANGLE" | "CIRCLE")[];
  foldFamilies: readonly string[];
  cutFamilies: readonly string[];
  representationPolicy: string;
  allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID";
}

export const PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1 = Object.freeze([
  {
    proposalId: "PFC-PROP-01",
    chapterCode: "PFC-001",
    name: "Axial and repeated-fold unfolding",
    taskContract: "OPAQUE_CUT_UNFOLD_FORWARD",
    skillAuthority: "Track one-axis reflection and repeated same-axis unfolding while preserving actual layer provenance.",
    baseDifficulty: "MODERATE",
    historicalQlRelationship: "RETAIN_AND_EXPAND",
    historicalQlId: "SPA-QL-035",
    permanentQlId: null,
    sourceShapes: ["SQUARE", "RECTANGLE", "CIRCLE"],
    foldFamilies: ["SINGLE_VERTICAL", "SINGLE_HORIZONTAL", "REPEATED_SAME_AXIS", "OFF_CENTRE_AXIAL"],
    cutFamilies: ["HOLE", "ORIENTED_POLYGON", "SLIT"],
    representationPolicy: "Sheet shape, cut shape and fold direction vary inside the same learner skill; they do not create separate QLs.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
  {
    proposalId: "PFC-PROP-02",
    chapterCode: "PFC-001",
    name: "Compound multi-axis and multi-fold unfolding",
    taskContract: "OPAQUE_CUT_UNFOLD_FORWARD",
    skillAuthority: "Reverse two or more folds in the correct order across different or repeated axes and preserve actual layer coverage.",
    baseDifficulty: "ADVANCED",
    historicalQlRelationship: "RETAIN_AND_EXPAND",
    historicalQlId: "SPA-QL-036",
    permanentQlId: null,
    sourceShapes: ["SQUARE", "RECTANGLE", "CIRCLE"],
    foldFamilies: ["PERPENDICULAR_DOUBLE", "AXIAL_PLUS_DIAGONAL", "DIAGONAL_PLUS_AXIAL", "THREE_FOLD_EIGHT_LAYER"],
    cutFamilies: ["HOLE", "ORIENTED_POLYGON", "MULTIPLE_MIXED_CUTS"],
    representationPolicy: "Fold depth is primarily a difficulty axis within this skill; it does not create a new QL by itself.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
  {
    proposalId: "PFC-PROP-03",
    chapterCode: "PFC-001",
    name: "Diagonal and corner-fold unfolding",
    taskContract: "OPAQUE_CUT_UNFOLD_FORWARD",
    skillAuthority: "Reflect cuts through diagonal or partial-overlap corner folds using the actual covered region rather than whole-sheet doubling assumptions.",
    baseDifficulty: "MODERATE",
    historicalQlRelationship: "RETAIN_AND_EXPAND",
    historicalQlId: "SPA-QL-037",
    permanentQlId: null,
    sourceShapes: ["SQUARE", "RECTANGLE"],
    foldFamilies: ["SINGLE_DIAGONAL", "CORNER_FOLD", "DIAGONAL_WITH_PARTIAL_OVERLAP"],
    cutFamilies: ["HOLE", "ORIENTED_POLYGON", "BOUNDARY_CUT"],
    representationPolicy: "Diagonal orientation and corner position are representation variants inside one overlap/reflection skill.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
  {
    proposalId: "PFC-PROP-04",
    chapterCode: "PFC-001",
    name: "Multiple-cut and cut-topology unfolding",
    taskContract: "OPAQUE_CUT_UNFOLD_FORWARD",
    skillAuthority: "Propagate multiple or non-point cuts and preserve whether the final geometry is an interior cut, slit, boundary notch or crease-coalesced cut.",
    baseDifficulty: "ADVANCED",
    historicalQlRelationship: "RETAIN_AND_EXPAND",
    historicalQlId: "SPA-QL-038",
    permanentQlId: null,
    sourceShapes: ["SQUARE", "RECTANGLE", "CIRCLE"],
    foldFamilies: ["SINGLE_FOLD", "MULTI_FOLD", "CREASE_EDGE_CUT", "OUTER_EDGE_CUT"],
    cutFamilies: ["MULTIPLE_HOLES", "MIXED_CUTS", "V_NOTCH", "ROUNDED_NOTCH", "SLIT", "TRIANGLE", "DIAMOND", "RECTANGULAR_CUT", "CREASE_COALESCENCE"],
    representationPolicy: "Cut shape is not a QL axis; topology-changing reasoning is the authority boundary.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
  {
    proposalId: "PFC-PROP-05",
    chapterCode: "PFC-001",
    name: "Reverse fold-and-punch inference",
    taskContract: "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE",
    skillAuthority: "Given the fully opened result, identify the unique folding and punching process by forward physical enumeration and elimination.",
    baseDifficulty: "ADVANCED",
    historicalQlRelationship: "NEW_DISTINCT_SKILL",
    historicalQlId: null,
    permanentQlId: null,
    sourceShapes: ["SQUARE", "RECTANGLE"],
    foldFamilies: ["ONE_FOLD_REVERSE", "TWO_FOLD_REVERSE", "THREE_FOLD_REVERSE"],
    cutFamilies: ["HOLE"],
    representationPolicy: "Reverse inference is a separate learner skill because the reasoning direction and distractor grammar differ materially from forward unfolding.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
  {
    proposalId: "TPF-PROP-01",
    chapterCode: "TPF-001",
    name: "Single-fold transparent pattern superposition",
    taskContract: "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION",
    skillAuthority: "Reflect the moving part of an existing transparent line pattern across one vertical or horizontal fold and superimpose it on the stationary part.",
    baseDifficulty: "MODERATE",
    historicalQlRelationship: "SEPARATE_CHAPTER_SKILL",
    historicalQlId: null,
    permanentQlId: null,
    sourceShapes: ["SQUARE"],
    foldFamilies: ["SINGLE_VERTICAL", "SINGLE_HORIZONTAL"],
    cutFamilies: [],
    representationPolicy: "Pattern primitive type is a representation axis. Diagonal, multi-fold and rectangular transparent cases remain evidence holds and are not silently generated.",
    allocationStatus: "PROPOSAL_ONLY_NO_PERMANENT_ID",
  },
] as const satisfies readonly PfcTpfSkillProposalV1[]);

export const PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_QL_PROPOSAL_V1 = Object.freeze({
  authorityId: "PFC-TPF-SOURCE-SATURATED-MERGE-SPLIT-QL-PROPOSAL-V1" as const,
  sourceAuthority: PFC_001_SOURCE_SATURATION_AUTHORITY_V2.authorityId,
  pfcWave2Authority: PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY.authorityId,
  tpfWave2Authority: TPF_001_DISCOVERY_WAVE2_AUTHORITY.authorityId,
  saturationAuditAuthority: PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.authorityId,
  exactGreenWave2Head: "14a90bd0d85c90efe1dd5e26fa37e1400506b666" as const,
  exactGreenWave2Run: 32207606025,
  exactGreenWave2Artifact: 9349644988,
  exactGreenWave2ArtifactDigest: "sha256:9c8605dcef7f2ed79185c0ae320d11fd7b8c11741c4c99198e61ca707d2e2608" as const,
  latestNewMainSnapshotObserved: "a75dccaff8c6bd8dc211b33ac972335d6cbd5957" as const,
  status: "SOURCE_SATURATED_SKILL_BOUNDARIES_PROPOSED_IDS_UNALLOCATED" as const,
  decisions: {
    sourceSheetShapeCreatesQl: false,
    cutShapeCreatesQl: false,
    foldDirectionCreatesQl: false,
    foldDepthCreatesQl: false,
    forwardVsReverseCreatesQlBoundary: true,
    opaqueVsTransparentCreatesChapterBoundary: true,
    oldForwardQlConceptsRetained: 4,
    newPfcReverseSkillProposed: true,
    separateTpfSkillProposed: true,
  },
  proposalCounts: {
    pfc: PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.filter((item) => item.chapterCode === "PFC-001").length,
    tpf: PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.filter((item) => item.chapterCode === "TPF-001").length,
    total: PFC_TPF_SOURCE_SATURATED_SKILL_PROPOSALS_V1.length,
  },
  historicalQlPolicy: {
    oldRange: "SPA-QL-035..SPA-QL-038" as const,
    status: "SEMANTIC_SUCCESSOR_MAPPING_ONLY_NOT_RESERVED_IDS" as const,
    preservationRule: "Reuse historical IDs only if the latest New-main allocation is collision-free after rebase and the semantic mapping remains exact." as const,
  },
  allocationGovernance: {
    permanentIdsAssigned: false,
    latestMainMustBeRecheckedImmediatelyBeforeAllocation: true,
    permanentQlAllocationAllowed: false,
    englishDiscoveryRuntimeAllowed: true,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    automaticPublication: false,
  },
  nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_RUNTIME_DISCOVERY_AND_REVIEW" as const,
} as const);
