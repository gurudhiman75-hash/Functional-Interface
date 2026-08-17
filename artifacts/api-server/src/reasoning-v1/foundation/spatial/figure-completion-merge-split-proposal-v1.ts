import {
  FGC_001_PROTOTYPES_V1,
  type FigureCompletionPrototypeV1,
} from "./figure-completion-discovery-v2-hardened";
import {
  FGC_001_SYMMETRY_PROTOTYPES_V1,
  type FigureCompletionSymmetryPrototypeV1,
} from "./figure-completion-symmetry-discovery-v1";
import { FGC_001_ARC_PROTOTYPE_V1 } from "./figure-completion-arc-discovery-v1";

export const FGC_001_MERGE_SPLIT_PROPOSAL_VERSION_V1 = "FGC-001-MERGE-SPLIT-PROPOSAL-V1" as const;

export type FigureCompletionExecutablePrototypeV1 =
  | FigureCompletionPrototypeV1
  | FigureCompletionSymmetryPrototypeV1
  | typeof FGC_001_ARC_PROTOTYPE_V1;

export const FGC_001_EXECUTABLE_PROTOTYPES_V1: readonly FigureCompletionExecutablePrototypeV1[] = [
  ...FGC_001_PROTOTYPES_V1,
  ...FGC_001_SYMMETRY_PROTOTYPES_V1,
  FGC_001_ARC_PROTOTYPE_V1,
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
    executablePrototypes: ["FGC-PROT-05-COMPOUND-CONTOUR-MARKER"],
    reasoningIdentity:
      "Recover a missing non-boundary feature or local property, such as a marker position, while also respecting the surrounding structure.",
    mergeDecision:
      "RETAIN AS A DISTINCT CANDIDATE: unlike pure connectivity, the answer depends on a feature/property relation that is not determined by boundary endpoints alone.",
    sourceEvidence: [
      "SSC MTS 2017 Shift 3: correct completion depends on dots being placed diagonally and away from the centre/intersection.",
      "SSC MTS 2017 Shift 3 material also includes component-count/orientation completion (three circles and opposite arrow directions).",
    ],
    knownRepresentationGaps: [
      "SOURCE_EVIDENCED_NOT_EXECUTABLE: component-count/orientation completion with repeated symbols/arrows.",
    ],
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
    title: "Compound symmetry with visual-state completion",
    permanentQlId: null,
    executablePrototypes: ["FGC-PROT-07-MIRROR-STATE-REVERSAL"],
    reasoningIdentity:
      "Apply a geometric relation and an independent visual-state/property change together to recover the missing part.",
    mergeDecision:
      "RETAIN AS A DISTINCT CANDIDATE: the learner must satisfy both geometry and a second state rule; geometry alone is insufficient.",
    sourceEvidence: [
      "SSC MTS 2024 Shift 3: black/white reversal is combined with a mirror relation.",
      "SSC GD 2024 Shift 1: shading/contact state and vertical-flip errors distinguish wrong completion options.",
    ],
    knownRepresentationGaps: [
      "SOURCE_EVIDENCED_NOT_EXECUTABLE: additional shape-class/contact-state variants beyond the current filled/outline representation.",
    ],
  },
] as const;

export const FGC_001_MERGE_SPLIT_GOVERNANCE_V1 = {
  version: FGC_001_MERGE_SPLIT_PROPOSAL_VERSION_V1,
  chapterCode: "FGC-001" as const,
  status: "MERGE_SPLIT_PROPOSAL_READY_SOURCE_SATURATION_OPEN" as const,
  executablePrototypeCount: 8,
  candidateAuthorityCount: 4,
  permanentQlCount: 0,
  nextSpatialQlCoordinateReserved: false,
  proposedFirstCoordinateIfLaterApproved: "SPA-QL-031" as const,
  sourcePosture: {
    SSC: "CONTROLLED_FAMILY_EVIDENCE_PRESENT_NOT_FULLY_SATURATED" as const,
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
