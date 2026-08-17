import {
  FGC_001_PROTOTYPES_V1,
  type FigureCompletionPrototypeV1,
} from "./figure-completion-discovery-v2-hardened";
import {
  FGC_001_SYMMETRY_PROTOTYPES_V1,
  type FigureCompletionSymmetryPrototypeV1,
} from "./figure-completion-symmetry-discovery-v1";
import { FGC_001_ARC_PROTOTYPE_V1 } from "./figure-completion-arc-discovery-v1";
import {
  FGC_001_SOURCE_GAP_PROTOTYPES_V1,
  type FigureCompletionSourceGapPrototypeV1,
} from "./figure-completion-source-gap-discovery-v1";

export const FGC_001_MERGE_SPLIT_PROPOSAL_VERSION_V1 = "FGC-001-MERGE-SPLIT-PROPOSAL-V1" as const;

export type FigureCompletionExecutablePrototypeV1 =
  | FigureCompletionPrototypeV1
  | FigureCompletionSymmetryPrototypeV1
  | typeof FGC_001_ARC_PROTOTYPE_V1
  | FigureCompletionSourceGapPrototypeV1;

export const FGC_001_EXECUTABLE_PROTOTYPES_V1: readonly FigureCompletionExecutablePrototypeV1[] = [
  ...FGC_001_PROTOTYPES_V1,
  ...FGC_001_SYMMETRY_PROTOTYPES_V1,
  FGC_001_ARC_PROTOTYPE_V1,
  ...FGC_001_SOURCE_GAP_PROTOTYPES_V1,
] as const;

export const FGC_001_CANDIDATE_AUTHORITY_IDS_V1 = [
  "FGC-CAND-A-STRUCTURAL-CONTINUITY",
  "FGC-CAND-B-FEATURE-PROPERTY-COMPLETION",
  "FGC-CAND-C-QUADRANT-SYMMETRY",
  "FGC-CAND-D-COMPOUND-SYMMETRY-STATE",
] as const;

export type FigureCompletionCandidateAuthorityIdV1 =
  (typeof FGC_001_CANDIDATE_AUTHORITY_IDS_V1)[number];

export interface FigureCompletionCandidateAuthorityV1 {
  candidateId: FigureCompletionCandidateAuthorityIdV1;
  title: string;
  permanentQlId: null;
  executablePrototypes: readonly FigureCompletionExecutablePrototypeV1[];
  reasoningIdentity: string;
  mergeDecision: string;
  sourceEvidence: readonly string[];
  knownRepresentationGaps: readonly string[];
}

export const FGC_001_CANDIDATE_AUTHORITIES_V1: readonly FigureCompletionCandidateAuthorityV1[] = [
  {
    candidateId: "FGC-CAND-A-STRUCTURAL-CONTINUITY",
    title: "Structural continuity and local connection completion",
    permanentQlId: null,
    executablePrototypes: [
      "FGC-PROT-01-STRAIGHT-CONTINUITY",
      "FGC-PROT-02-CURVED-PATH-CONTINUITY",
      "FGC-PROT-03-JUNCTION-CONTINUITY",
      "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY",
    ],
    reasoningIdentity:
      "Recover the missing local structure by continuing visible strokes, paths, contours or connections across the blank without changing the surrounding geometry.",
    mergeDecision:
      "MERGE P01/P02/P03/P04: straight, bent, junction and nested-contour forms change the visual representation, but the learner still reconstructs missing connectivity from boundary evidence.",
    sourceEvidence: [
      "SSC CGL 2017 Shift 2: missing square completed by the required cross-line structure.",
      "SSC MTS 2017: square/diagonal/additional-line structure completion appears in previous-year material.",
    ],
    knownRepresentationGaps: [],
  },
  {
    candidateId: "FGC-CAND-B-FEATURE-PROPERTY-COMPLETION",
    title: "Feature and local property placement completion",
    permanentQlId: null,
    executablePrototypes: [
      "FGC-PROT-05-COMPOUND-CONTOUR-MARKER",
      "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION",
    ],
    reasoningIdentity:
      "Recover a missing non-boundary feature or local property, including marker placement, component count or orientation, while also respecting the surrounding structure.",
    mergeDecision:
      "MERGE P09 INTO B: marker placement and count/orientation use different visual objects, but both require recovering a local feature/property that is not determined by boundary connectivity alone.",
    sourceEvidence: [
      "SSC MTS 2017 Shift 3: correct completion depends on dots being placed diagonally and away from the centre/intersection.",
      "SSC MTS 2017 Shift 3: another completion is solved by preserving three circles and arrows in opposite directions.",
    ],
    knownRepresentationGaps: [],
  },
  {
    candidateId: "FGC-CAND-C-QUADRANT-SYMMETRY",
    title: "Quadrant symmetry completion",
    permanentQlId: null,
    executablePrototypes: [
      "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY",
      "FGC-PROT-08-ARC-QUADRANT-SYMMETRY",
    ],
    reasoningIdentity:
      "Recover the missing quadrant by preserving the geometric symmetry relation across the centre axes.",
    mergeDecision:
      "MERGE P08 INTO P06: quarter-circle arcs are an important SSC representation stress, but arc versus straight-line primitives do not create a new reasoning rule.",
    sourceEvidence: [
      "SSC CHSL 2025 Shift 3: two parallel diagonal lines complete central geometric symmetry.",
      "SSC CHSL 2025 Shift 1/3: large and small quarter-circle arcs plus diagonals complete missing-quadrant symmetry.",
    ],
    knownRepresentationGaps: [],
  },
  {
    candidateId: "FGC-CAND-D-COMPOUND-SYMMETRY-STATE",
    title: "Compound geometry with visual-state completion",
    permanentQlId: null,
    executablePrototypes: [
      "FGC-PROT-07-MIRROR-STATE-REVERSAL",
      "FGC-PROT-10-SHAPE-CONTACT-STATE",
    ],
    reasoningIdentity:
      "Apply a geometric relation and an independent visual-state/property rule together to recover the missing part.",
    mergeDecision:
      "MERGE P10 INTO D: mirror-plus-state reversal and shape/contact/flip completion use different geometry, but both require geometry and an independent state/property constraint simultaneously.",
    sourceEvidence: [
      "SSC MTS 2024 Shift 3: black/white reversal is combined with a mirror relation.",
      "SSC GD 2024 Shift 1: wrong completions are distinguished by rhombus-vs-square shape, shaded/non-shaded contact and vertical flip.",
    ],
    knownRepresentationGaps: [],
  },
] as const;

export const FGC_001_MERGE_SPLIT_GOVERNANCE_V1 = {
  version: FGC_001_MERGE_SPLIT_PROPOSAL_VERSION_V1,
  chapterCode: "FGC-001" as const,
  status: "MERGE_SPLIT_PROPOSAL_READY_SSC_REPRESENTATION_GAPS_CLOSED_REVIEW_OPEN" as const,
  executablePrototypeCount: 10,
  candidateAuthorityCount: 4,
  permanentQlCount: 0,
  nextSpatialQlCoordinateReserved: false,
  proposedFirstCoordinateIfLaterApproved: "SPA-QL-031" as const,
  sourcePosture: {
    SSC: "CONTROLLED_EXECUTABLE_REPRESENTATION_GAPS_CLOSED_PENDING_SATURATION_DECISION" as const,
    Banking: "NOT_ESTABLISHED" as const,
    PunjabState: "NOT_ESTABLISHED" as const,
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    multilingualStarted: false,
  },
  allocationGate:
    "BLOCKED_UNTIL_SOURCE_SATURATION_REVIEW_AND_EXPLICIT_PERMANENT_QL_APPROVAL" as const,
} as const;
