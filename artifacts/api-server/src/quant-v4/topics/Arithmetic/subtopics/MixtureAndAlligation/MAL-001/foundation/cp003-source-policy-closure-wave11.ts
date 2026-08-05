import {
  MAL_CP003_WAVE10_COVERAGE_MATRIX,
  MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS,
  MAL_CP003_WAVE10_EXCLUDED_IDS,
  MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS,
} from "./cp003-coverage-closure-wave10";
import type { MalCp003Wave08CandidateId } from "./cp003-external-source-wave08";

export const MAL_CP003_WAVE11_AUTHORITY_ID =
  "MAL-CP003-SOURCE-POLICY-CLOSURE-WAVE11" as const;

export const MAL_CP003_WAVE11_EXACT_OPERATION_DOMAIN = Object.freeze({
  minimumOperations: 1,
  maximumOperations: 12,
  acceptedEvidence: "EXACT_RATIONAL_EQUALITY_ONLY" as const,
  noSolutionPolicy: "REJECT_INPUT_STATE" as const,
  multipleSolutionPolicy: "IMPOSSIBLE_UNDER_STRICT_RETENTION" as const,
  approximationPolicy: "NO_FLOATING_LOGARITHMS" as const,
});

export const MAL_CP003_WAVE11_UNEQUAL_STAGE_POLICY = Object.freeze({
  minimumStages: 2,
  maximumStages: 4,
  vesselVolumePolicy: "FIXED_AFTER_EACH_REFILL" as const,
  stageOrderPolicy: "PRESERVE_GIVEN_ORDER_IN_LEDGER" as const,
  finalQuantityInvariant:
    "INITIAL_ORIGINAL_TIMES_PRODUCT_OF_STAGE_RETENTION_FACTORS" as const,
  difficulty: "HARD" as const,
});

export const MAL_CP003_WAVE11_COMPONENT_SWITCH_POLICY = Object.freeze({
  vesselScope: "ONE_VESSEL" as const,
  ownership: "MAL-CP-003" as const,
  cp006Boundary:
    "MAL-CP-006_STARTS_ONLY_WHEN_MATERIAL_MOVES_BETWEEN_DISTINCT_VESSELS" as const,
  outputOrderPolicy: "EXACT_NAMED_ORDER_FROM_STEM" as const,
  requiredLedger: "FULL_COMPONENT_VECTOR_AFTER_EVERY_STAGE" as const,
});

export type MalCp003Wave11EvidenceKind =
  | "DIRECT_PUBLIC_OUTPUT_MATCH"
  | "DIRECT_PUBLIC_FAMILY_MATCH"
  | "INTERNAL_REVIEWED_RUNTIME_AUTHORITY"
  | "COMPLEMENT_REPRESENTATION_AUTHORITY"
  | "OWNERSHIP_BOUNDARY_AUTHORITY";

export interface MalCp003Wave11SourceReference {
  sourceId: string;
  publisher: string;
  title: string;
  url: string;
  retrievedOn: "2026-08-05";
  evidenceKind: MalCp003Wave11EvidenceKind;
  candidateIds: readonly MalCp003Wave08CandidateId[];
  observedContract: string;
  decisionImpact: string;
}

export const MAL_CP003_WAVE11_SOURCE_REFERENCES:
  readonly MalCp003Wave11SourceReference[] = [
    {
      sourceId: "OLIVEBOARD-LIC-AAO-2023-INITIAL-WATER",
      publisher: "Oliveboard",
      title:
        "LIC AAO 2023 repeated replacement: reconstruct the initial water quantity",
      url: "https://www.oliveboard.in/question-answer/pyq-a-vessel-contains-60-liters-mixture-of-water-and-milk-in-certain",
      retrievedOn: "2026-08-05",
      evidenceKind: "COMPLEMENT_REPRESENTATION_AUTHORITY",
      candidateIds: [
        "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      ],
      observedContract:
        "Recover one initial component quantity from vessel volume, repeated-replacement evidence and a final component quantity.",
      decisionImpact:
        "Initial water and initial milk are complementary outputs of one uniquely reconstructed initial composition; they do not require separate QLs.",
    },
    {
      sourceId: "EXAMTREE-RAP003-QL1110-EXACT-OPERATION-COUNT",
      publisher: "ExamTree quant-v2 reviewed runtime",
      title: "replacementIterationsFromFinalRatio",
      url: "repository://RAP-003/RAP-CP-017/RAP-QL-1110",
      retrievedOn: "2026-08-05",
      evidenceKind: "INTERNAL_REVIEWED_RUNTIME_AUTHORITY",
      candidateIds: ["MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL"],
      observedContract:
        "Given vessel volume, equal removal quantity and exact final component ratio, recover the whole-number operation count.",
      decisionImpact:
        "Confirms that exact operation-count reconstruction is established ExamTree prior art rather than an invented closure mode.",
    },
    {
      sourceId: "GMATCLUB-REPLACEMENT-ITERATIONS-17-TO-8",
      publisher: "GMAT Club",
      title:
        "Repeated milk replacement: determine how many operations produce the final 17:8 ratio",
      url: "https://gmatclub.com/forum/a-mixture-of-milk-and-water-is-in-the-ratio-of-3-5-if-20-of-the-415803.html",
      retrievedOn: "2026-08-05",
      evidenceKind: "DIRECT_PUBLIC_OUTPUT_MATCH",
      candidateIds: ["MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL"],
      observedContract:
        "Find the exact number of repeated replacement operations required to reach a supplied final ratio.",
      decisionImpact:
        "Closes the direct-output authority gap for exact operation count; this remains distinct from minimum threshold crossing.",
    },
    {
      sourceId: "TESTBOOK-UNEQUAL-STAGES-50-5-8",
      publisher: "Testbook",
      title:
        "Fifty litres of milk: replace 5 litres, then replace 8 litres of the resulting mixture",
      url: "https://testbook.com/question-answer/a-container-contains-50-litres-of-milk-5-litres--5f6b098e4304d8263c1d4e48",
      retrievedOn: "2026-08-05",
      evidenceKind: "DIRECT_PUBLIC_OUTPUT_MATCH",
      candidateIds: [
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      ],
      observedContract:
        "Find the original-liquid quantity after successive remove-and-refill stages with different removal quantities.",
      decisionImpact:
        "Closes the unequal-stage source gap and validates a product of stage-specific retention factors.",
    },
    {
      sourceId: "EXAMTREE-RAP003-QL1112-UNEQUAL-STAGES",
      publisher: "ExamTree quant-v2 reviewed runtime",
      title: "replacementDifferentRounds",
      url: "repository://RAP-003/RAP-CP-017/RAP-QL-1112",
      retrievedOn: "2026-08-05",
      evidenceKind: "INTERNAL_REVIEWED_RUNTIME_AUTHORITY",
      candidateIds: [
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      ],
      observedContract:
        "First replace one quantity and then a different quantity; find the original component left.",
      decisionImpact:
        "Provides internal continuity and confirms the unequal-stage family already existed in reviewed production-oriented prior art.",
    },
    {
      sourceId: "TESTBOOK-THREE-COMPONENT-36-12-ACID",
      publisher: "Testbook",
      title:
        "Alcohol, acid and water mixture: remove 12 litres and replace the sample with acid",
      url: "https://testbook.com/question-answer/a-vessel-contains-36-litres-of-a-mixture-of-alcoh--5f8d51f0752cbb0d0c6e9c68",
      retrievedOn: "2026-08-05",
      evidenceKind: "DIRECT_PUBLIC_FAMILY_MATCH",
      candidateIds: [
        "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      ],
      observedContract:
        "Apply proportional removal to a three-component state, add a named component, and report the final ordered composition.",
      decisionImpact:
        "Confirms that full three-component ledgers and ordered A:B:C outputs are exam-relevant single-vessel tasks.",
    },
    {
      sourceId: "CAT-2025-ACID-WATER-STAGE-SWITCHING",
      publisher: "Cracku",
      title:
        "CAT 2025: repeated replacement stages alternate between water and pure acid",
      url: "https://cracku.in/65-a-container-has-200-litres-of-a-solution-that-is-x-cat-2025-slot-1-quant",
      retrievedOn: "2026-08-05",
      evidenceKind: "DIRECT_PUBLIC_FAMILY_MATCH",
      candidateIds: [
        "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      ],
      observedContract:
        "Track one vessel through several replacement stages whose refill component changes between stages.",
      decisionImpact:
        "Closes the stage-switching authority gap and confirms CP-003 ownership when no liquid is transferred between separate vessels.",
    },
    {
      sourceId: "MAL001-END-TO-END-CP003-CP006-BOUNDARY",
      publisher: "ExamTree MAL-001 design authority",
      title: "Repeated replacement versus multi-vessel transfer ownership",
      url: "repository://MAL-001/MAL-001-END-TO-END-DESIGN.md",
      retrievedOn: "2026-08-05",
      evidenceKind: "OWNERSHIP_BOUNDARY_AUTHORITY",
      candidateIds: [
        "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      ],
      observedContract:
        "CP-003 owns repeated operations in one vessel; CP-006 requires an explicit vessel-by-vessel transfer ledger.",
      decisionImpact:
        "Closes the CP-003 versus CP-006 ownership blocker without absorbing cross-vessel transfer questions.",
    },
  ] as const;

export type MalCp003Wave11ClosureDecision =
  | "PROMOTE_SOURCE_POLICY_CLOSED"
  | "CLOSE_AS_COMPLEMENT_REPRESENTATION";

export interface MalCp003Wave11BlockerClosure {
  candidateId: MalCp003Wave08CandidateId;
  closureDecision: MalCp003Wave11ClosureDecision;
  effectiveContractId: MalCp003Wave08CandidateId;
  sourceEvidenceIds: readonly string[];
  policyDecisions: readonly string[];
  closureReason: string;
  remainingBlockers: readonly [];
}

export const MAL_CP003_WAVE11_BLOCKER_CLOSURES:
  readonly MalCp003Wave11BlockerClosure[] = [
    {
      candidateId: "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      closureDecision: "CLOSE_AS_COMPLEMENT_REPRESENTATION",
      effectiveContractId:
        "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      sourceEvidenceIds: ["OLIVEBOARD-LIC-AAO-2023-INITIAL-WATER"],
      policyDecisions: [
        "Recover the complete initial two-component state from one final named-component quantity and known vessel volume.",
        "The complementary initial component is vessel volume minus the reconstructed named component.",
        "Inputs that omit vessel volume, stage count or equal removal quantity are outside this contract.",
      ],
      closureReason:
        "The supplied evidence uniquely reconstructs an initial composition. Asking for milk instead of water changes only which complementary component is displayed.",
      remainingBlockers: [],
    },
    {
      candidateId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      closureDecision: "PROMOTE_SOURCE_POLICY_CLOSED",
      effectiveContractId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      sourceEvidenceIds: [
        "EXAMTREE-RAP003-QL1110-EXACT-OPERATION-COUNT",
        "GMATCLUB-REPLACEMENT-ITERATIONS-17-TO-8",
      ],
      policyDecisions: [
        "Generate only exact rational states with a whole-number answer from 1 through 12 operations.",
        "Search the finite domain by exact equality; never use floating logarithms.",
        "Because 0 < retained fraction < 1, the original quantity is strictly decreasing and an exact target has at most one positive operation count.",
        "Reject states with no exact match instead of rounding or returning an approximate count.",
      ],
      closureReason:
        "Direct public and reviewed internal evidence match the exact count output, while the finite exact-search policy closes maximum-domain and no-solution behaviour.",
      remainingBlockers: [],
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      closureDecision: "PROMOTE_SOURCE_POLICY_CLOSED",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      sourceEvidenceIds: [
        "TESTBOOK-UNEQUAL-STAGES-50-5-8",
        "EXAMTREE-RAP003-QL1112-UNEQUAL-STAGES",
      ],
      policyDecisions: [
        "Use two to four stages and restore the same vessel volume after each stage.",
        "Preserve the stated stage order in the learner ledger even when the final scalar product is commutative.",
        "Keep this family Hard because every stage has its own removal and retained fraction.",
      ],
      closureReason:
        "Direct exam-style and reviewed internal evidence establish unequal stages as a real learner contract rather than a synthetic algebraic extension.",
      remainingBlockers: [],
    },
    {
      candidateId: "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      closureDecision: "PROMOTE_SOURCE_POLICY_CLOSED",
      effectiveContractId:
        "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      sourceEvidenceIds: [
        "TESTBOOK-THREE-COMPONENT-36-12-ACID",
        "CAT-2025-ACID-WATER-STAGE-SWITCHING",
        "MAL001-END-TO-END-CP003-CP006-BOUNDARY",
      ],
      policyDecisions: [
        "Track every named component after every removal and refill stage.",
        "Report components in the exact order named by the stem and preserve that order in options and verification.",
        "Retain CP-003 ownership only while all operations occur in one vessel.",
        "Move any cross-vessel sample transfer to MAL-CP-006.",
      ],
      closureReason:
        "Public three-component and stage-switching evidence plus the chapter ownership authority close source, output-order and CP-006 boundary questions.",
      remainingBlockers: [],
    },
  ] as const;

export const MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS = [
  ...MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS,
] as const;

const allClosedCandidateIds = new Set(
  MAL_CP003_WAVE11_BLOCKER_CLOSURES.map((closure) => closure.candidateId),
);

export const MAL_CP003_WAVE11_READINESS = Object.freeze({
  authorityId: MAL_CP003_WAVE11_AUTHORITY_ID,
  discoveryCandidateCount: MAL_CP003_WAVE10_COVERAGE_MATRIX.length,
  effectiveOwnedContractCount:
    MAL_CP003_WAVE11_FINAL_EFFECTIVE_CONTRACT_IDS.length,
  newlyClosedBlockerCount: MAL_CP003_WAVE11_BLOCKER_CLOSURES.length,
  representationMergeCount: MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length,
  excludedToCp004Count: MAL_CP003_WAVE10_EXCLUDED_IDS.length,
  remainingSourcePolicyBlockerCount:
    MAL_CP003_WAVE10_COVERAGE_MATRIX.filter(
      (entry) =>
        entry.remainingFreezeBlockers.length > 0 &&
        !allClosedCandidateIds.has(entry.candidateId),
    ).length,
  sourcePolicyReadiness: true,
  runtimeEditorialReadiness: false,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  nextPermanentQlIdReserved: false,
  nextPermanentQlId: "MAL-QL-029",
  verdict: "READY_FOR_UNIFIED_RUNTIME_AND_EDITORIAL_AUDIT" as const,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
});
