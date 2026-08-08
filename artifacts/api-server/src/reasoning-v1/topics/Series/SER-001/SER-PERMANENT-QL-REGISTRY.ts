import type {
  SerCp007AuthorityCandidateV1Id,
  SerCp007CandidateProofModel,
  SerCp007DiscoveryAuthorityId,
} from "./SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-candidate-v1";

export const SER_CP007_PERMANENT_QL_IDS = [
  "SER-QL-001",
  "SER-QL-002",
  "SER-QL-003",
  "SER-QL-004",
  "SER-QL-005",
  "SER-QL-006",
  "SER-QL-007",
  "SER-QL-008",
  "SER-QL-009",
  "SER-QL-010",
  "SER-QL-011",
  "SER-QL-012",
  "SER-QL-013",
] as const;

export type SerCp007PermanentQlId =
  (typeof SER_CP007_PERMANENT_QL_IDS)[number];

export const SER_CP007_AUTHORITY_TO_PERMANENT_QL = Object.freeze({
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE: "SER-QL-001",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "SER-QL-002",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT: "SER-QL-003",
  CUMULATIVE_PREFIX_CLUSTER: "SER-QL-004",
  DIRECTIONAL_CONSECUTIVE_CLUSTER: "SER-QL-005",
  EDGE_DELETION_WORD_SEQUENCE: "SER-QL-006",
  INTERLEAVED_CLUSTER_SERIES: "SER-QL-007",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME: "SER-QL-008",
  PATTERNED_INTERIOR_INSERTION_GROWTH: "SER-QL-009",
  PERIODIC_BLOCK_COMPLETION: "SER-QL-010",
  POSITION_PERMUTATION_CLUSTER: "SER-QL-011",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION: "SER-QL-012",
  SYMMETRIC_EDGE_GROWTH: "SER-QL-013",
} satisfies Readonly<
  Record<SerCp007AuthorityCandidateV1Id, SerCp007PermanentQlId>
>);

export interface SerPermanentQlRegistryEntry {
  readonly permanentQlId: SerCp007PermanentQlId;
  readonly chapterId: "SER-001";
  readonly checkpointId: "SER-CP-007";
  readonly authorityId: SerCp007AuthorityCandidateV1Id;
  readonly title: string;
  readonly solveContract: string;
  readonly answerSemantic: string;
  readonly proofModel: SerCp007CandidateProofModel;
  readonly learnerRenderer: string;
  readonly templateCount: number;
  readonly discoveryAuthorityAncestry: readonly SerCp007DiscoveryAuthorityId[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly allocationApproval: "PRODUCT_OWNER_APPROVED_2026_08_07";
  readonly localizationStatus: "MULTILINGUAL_MANUAL_FREEZE_APPROVED";
  readonly localizationApproval: "PRODUCT_OWNER_APPROVED_2026_08_08";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const entries: readonly SerPermanentQlRegistryEntry[] = [
  {
    permanentQlId: "SER-QL-001",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
    title: "Alphabet-complement group sequence",
    solveContract:
      "Apply the alphabet-complement transformation, preserving the displayed positional or rotation condition.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "POSITION_TRANSFORMATION",
    learnerRenderer: "POSITION_TRANSFORMATION",
    templateCount: 8,
    discoveryAuthorityAncestry: ["ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE"],
  },
  {
    permanentQlId: "SER-QL-002",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
    title: "Fixed column-wise letter movement",
    solveContract:
      "Track each letter position independently and repeat its fixed signed movement across terms.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "DIRECT_COLUMN_MOVEMENT",
    learnerRenderer: "DIRECT_COLUMN_MOVEMENT",
    templateCount: 19,
    discoveryAuthorityAncestry: ["COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  },
  {
    permanentQlId: "SER-QL-003",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
    title: "Progressive column-wise letter movement",
    solveContract:
      "Track each column separately while the signed movement changes according to the displayed progression.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "DIRECT_COLUMN_MOVEMENT",
    learnerRenderer: "DIRECT_COLUMN_MOVEMENT",
    templateCount: 4,
    discoveryAuthorityAncestry: ["COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT"],
  },
  {
    permanentQlId: "SER-QL-004",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "CUMULATIVE_PREFIX_CLUSTER",
    title: "Cumulative prefix growth",
    solveContract:
      "Preserve the accumulated prefix and append the next rule-governed letter or segment.",
    answerSemantic: "LETTER_GROUP",
    proofModel: "LENGTH_OR_CONTENT_CHANGE",
    learnerRenderer: "LENGTH_OR_CONTENT_CHANGE",
    templateCount: 4,
    discoveryAuthorityAncestry: ["CUMULATIVE_PREFIX_CLUSTER"],
  },
  {
    permanentQlId: "SER-QL-005",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "DIRECTIONAL_CONSECUTIVE_CLUSTER",
    title: "Directional consecutive-letter blocks",
    solveContract:
      "Continue the changing block length and the governed movement of each block's starting letter.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "LENGTH_OR_CONTENT_CHANGE",
    learnerRenderer: "CONSECUTIVE_LENGTH_AND_GAP_PROGRESS",
    templateCount: 8,
    discoveryAuthorityAncestry: [
      "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
      "GROWING_CONSECUTIVE_CLUSTER",
    ],
  },
  {
    permanentQlId: "SER-QL-006",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "EDGE_DELETION_WORD_SEQUENCE",
    title: "Edge-deletion word sequence",
    solveContract:
      "Delete letters from the governed edge or edges while preserving the displayed deletion order.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "LENGTH_OR_CONTENT_CHANGE",
    learnerRenderer: "LENGTH_OR_CONTENT_CHANGE",
    templateCount: 10,
    discoveryAuthorityAncestry: ["EDGE_DELETION_WORD_SEQUENCE"],
  },
  {
    permanentQlId: "SER-QL-007",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "INTERLEAVED_CLUSTER_SERIES",
    title: "Interleaved letter-group rows",
    solveContract:
      "Separate the visible sequence into its two, three or four interleaved rows and solve only the target row.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "INTERLEAVED_ROWS",
    learnerRenderer: "INTERLEAVED_ROW_TABLE",
    templateCount: 17,
    discoveryAuthorityAncestry: [
      "TWO_INTERLEAVED_CLUSTER_SERIES",
      "K_INTERLEAVED_CLUSTER_SERIES",
    ],
  },
  {
    permanentQlId: "SER-QL-008",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
    title: "Marker movement over a periodic frame",
    solveContract:
      "Keep the periodic frame fixed and continue the governed movement of the marker, boundary or case signal.",
    answerSemantic: "MARKED_LETTER_GROUP_OR_ORDERED_GROUPS",
    proofModel: "MARKER_OR_BOUNDARY_MOVEMENT",
    learnerRenderer: "MARKER_OR_BOUNDARY_MOVEMENT",
    templateCount: 20,
    discoveryAuthorityAncestry: [
      "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
    ],
  },
  {
    permanentQlId: "SER-QL-009",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "PATTERNED_INTERIOR_INSERTION_GROWTH",
    title: "Patterned interior insertion growth",
    solveContract:
      "Preserve the existing outer structure while inserting the next governed interior letter or segment.",
    answerSemantic: "LETTER_GROUP",
    proofModel: "LENGTH_OR_CONTENT_CHANGE",
    learnerRenderer: "LENGTH_OR_CONTENT_CHANGE",
    templateCount: 8,
    discoveryAuthorityAncestry: ["PATTERNED_INTERIOR_INSERTION_GROWTH"],
  },
  {
    permanentQlId: "SER-QL-010",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "PERIODIC_BLOCK_COMPLETION",
    title: "Periodic block and gap completion",
    solveContract:
      "Reconstruct the repeated or alternating block cycle and fill the requested gaps in order.",
    answerSemantic: "LETTER_OR_ORDERED_GAP_GROUPS",
    proofModel: "CONTINUOUS_GAP_COMPLETION",
    learnerRenderer: "PERIODIC_BLOCK_RECONSTRUCTION",
    templateCount: 4,
    discoveryAuthorityAncestry: [
      "REPEATED_BLOCK_COMPLETION",
      "ALTERNATING_BLOCK_COMPLETION",
    ],
  },
  {
    permanentQlId: "SER-QL-011",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "POSITION_PERMUTATION_CLUSTER",
    title: "Position permutation of letter groups",
    solveContract:
      "Apply the stored positional permutation subtype, including rotation, adjacent swap, reversal or odd-even reorder.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "POSITION_TRANSFORMATION",
    learnerRenderer: "SUBTYPE_AWARE_POSITION_PERMUTATION",
    templateCount: 21,
    discoveryAuthorityAncestry: [
      "CYCLIC_CLUSTER_PERMUTATION",
      "FIXED_POSITION_PERMUTATION_CLUSTER",
    ],
  },
  {
    permanentQlId: "SER-QL-012",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
    title: "Progressive positional substitution",
    solveContract:
      "Continue the governed sequence of positions being replaced while preserving unaffected letters.",
    answerSemantic: "LETTER_GROUP_OR_ORDERED_LETTER_GROUPS",
    proofModel: "MARKER_OR_BOUNDARY_MOVEMENT",
    learnerRenderer: "MARKER_OR_BOUNDARY_MOVEMENT",
    templateCount: 12,
    discoveryAuthorityAncestry: ["PROGRESSIVE_POSITIONAL_SUBSTITUTION"],
  },
  {
    permanentQlId: "SER-QL-013",
    chapterId: "SER-001",
    checkpointId: "SER-CP-007",
    authorityId: "SYMMETRIC_EDGE_GROWTH",
    title: "Symmetric edge growth",
    solveContract:
      "Extend the group symmetrically at both edges according to the displayed outer-letter progression.",
    answerSemantic: "LETTER_GROUP",
    proofModel: "LENGTH_OR_CONTENT_CHANGE",
    learnerRenderer: "LENGTH_OR_CONTENT_CHANGE",
    templateCount: 5,
    discoveryAuthorityAncestry: ["SYMMETRIC_EDGE_GROWTH"],
  },
].map((entry) =>
  Object.freeze({
    ...entry,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
    allocationApproval: "PRODUCT_OWNER_APPROVED_2026_08_07" as const,
    localizationStatus: "MULTILINGUAL_MANUAL_FREEZE_APPROVED" as const,
    localizationApproval: "PRODUCT_OWNER_APPROVED_2026_08_08" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
);

export const SER_PERMANENT_QL_REGISTRY: readonly SerPermanentQlRegistryEntry[] =
  Object.freeze(entries);

export const SER_PERMANENT_QL_BY_ID: Readonly<
  Record<SerCp007PermanentQlId, SerPermanentQlRegistryEntry>
> = Object.freeze(
  Object.fromEntries(
    SER_PERMANENT_QL_REGISTRY.map((entry) => [entry.permanentQlId, entry]),
  ) as Record<SerCp007PermanentQlId, SerPermanentQlRegistryEntry>,
);

export const SER_PERMANENT_QL_BY_AUTHORITY: Readonly<
  Record<SerCp007AuthorityCandidateV1Id, SerPermanentQlRegistryEntry>
> = Object.freeze(
  Object.fromEntries(
    SER_PERMANENT_QL_REGISTRY.map((entry) => [entry.authorityId, entry]),
  ) as Record<SerCp007AuthorityCandidateV1Id, SerPermanentQlRegistryEntry>,
);

export const SER_PERMANENT_QL_REGISTRY_STATE = Object.freeze({
  registryVersion: 3,
  allocatedCheckpointCount: 1,
  allocatedTemplateCount: 13,
  frozenPrototypeTemplateCount: 140,
  frozenLearnerReleasePoolCount: 135,
  multilingualFrozenQlCount: 13,
  firstAllocatedId: "SER-QL-001" as const,
  lastAllocatedId: "SER-QL-013" as const,
  nextAvailableId: "SER-QL-014" as const,
  allocatedRange: "SER-QL-001..SER-QL-013" as const,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
});
