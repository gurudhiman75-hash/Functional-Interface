import {
  MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS,
  type MalCp003Wave08CandidateId,
} from "./cp003-external-source-wave08";

export const MAL_CP003_WAVE10_COVERAGE_AUTHORITY_ID =
  "MAL-CP003-COVERAGE-CLOSURE-WAVE10" as const;

export type MalCp003Wave10Disposition =
  | "SOURCE_BACKED_DISTINCT_RUNTIME_READY"
  | "MERGED_REPRESENTATION_VARIANT"
  | "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY"
  | "EXCLUDED_TO_MAL_CP004";

export type MalCp003Wave10RuntimeAuthority =
  | "CP003_DISCOVERY_PIPELINE_V1"
  | "MAL-CP003-EN-SOURCE-BACKED-DISCOVERY-V1"
  | "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1"
  | "NONE_CP004_EXCLUSION";

export type MalCp003Wave10FreezeBlocker =
  | "DIRECT_OUTPUT_MATCHED_SOURCE"
  | "NON_PURE_INITIAL_STATE_DETERMINACY_POLICY"
  | "DIRECT_EXACT_EQUALITY_OPERATION_COUNT_SOURCE"
  | "MAXIMUM_OPERATION_DOMAIN_AUTHORITY"
  | "NO_SOLUTION_AND_MULTIPLE_SOLUTION_POLICY"
  | "AUTHORITATIVE_UNEQUAL_STAGE_EXAM_SOURCE"
  | "UNEQUAL_STAGE_ORDER_AND_DIFFICULTY_CALIBRATION"
  | "AUTHORITATIVE_THIRD_LIQUID_EXAM_SOURCE"
  | "CP003_VERSUS_CP006_OWNERSHIP_CLOSURE"
  | "THREE_COMPONENT_OUTPUT_ORDER_POLICY";

export interface MalCp003Wave10CoverageEntry {
  candidateId: MalCp003Wave08CandidateId;
  disposition: MalCp003Wave10Disposition;
  effectiveContractId: MalCp003Wave08CandidateId | null;
  runtimeAuthority: MalCp003Wave10RuntimeAuthority;
  directSourceStatus:
    | "DIRECT_SOURCE_BACKED"
    | "NO_DISTINCT_SOURCE_REQUIRED_AFTER_MERGE"
    | "DIRECT_SOURCE_PENDING"
    | "OUTPUT_MISMATCH_ONLY"
    | "DISCOVERY_LEAD_ONLY"
    | "NOT_APPLICABLE_CP004";
  answerContract: string;
  closureReason: string;
  remainingFreezeBlockers: readonly MalCp003Wave10FreezeBlocker[];
  permanentQlId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

const inactiveLifecycle = {
  permanentQlId: null,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
} as const;

export const MAL_CP003_WAVE10_COVERAGE_MATRIX:
  readonly MalCp003Wave10CoverageEntry[] = [
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      disposition: "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "DIRECT_SOURCE_BACKED",
      answerContract:
        "Find the final quantity of the original component after equal remove-and-refill operations.",
      closureReason:
        "Direct source evidence and executable runtime preserve final original-component quantity as the requested answer.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
      disposition: "MERGED_REPRESENTATION_VARIANT",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "NO_DISTINCT_SOURCE_REQUIRED_AFTER_MERGE",
      answerContract:
        "Express the same final original-component state as a fraction rather than a quantity.",
      closureReason:
        "For a known pure initial quantity, the fraction is the final original quantity divided by that known quantity. It changes answer representation, not the learner reasoning contract.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
      disposition: "MERGED_REPRESENTATION_VARIANT",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "NO_DISTINCT_SOURCE_REQUIRED_AFTER_MERGE",
      answerContract:
        "Express the same final two-component state through the complement refill quantity.",
      closureReason:
        "With fixed vessel volume, final refill quantity is the exact complement of final original quantity. Requested component and option wording remain variants under one contract.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId: "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      disposition: "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY",
      effectiveContractId:
        "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "OUTPUT_MISMATCH_ONLY",
      answerContract:
        "Recover the initial quantity of the named original component from a final component quantity.",
      closureReason:
        "The inverse unknown is distinct, but the recovered public evidence asks for the complementary initial component rather than the current output contract.",
      remainingFreezeBlockers: [
        "DIRECT_OUTPUT_MATCHED_SOURCE",
        "NON_PURE_INITIAL_STATE_DETERMINACY_POLICY",
      ],
      ...inactiveLifecycle,
    },
    {
      candidateId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      disposition: "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
      effectiveContractId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      runtimeAuthority: "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1",
      directSourceStatus: "DIRECT_SOURCE_BACKED",
      answerContract:
        "Recover the equal quantity removed in every operation from exact initial and final evidence.",
      closureReason:
        "Two direct sources match the requested removal quantity, and Wave 09 proves exact nth-root recovery plus forward replay.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      disposition: "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY",
      effectiveContractId: "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "DIRECT_SOURCE_PENDING",
      answerContract:
        "Recover an exact operation count from an exact final original-component quantity.",
      closureReason:
        "Exact equality reconstruction is not the same contract as the source-backed minimum threshold crossing. It remains distinct but unsupported by direct output-matched evidence.",
      remainingFreezeBlockers: [
        "DIRECT_EXACT_EQUALITY_OPERATION_COUNT_SOURCE",
        "MAXIMUM_OPERATION_DOMAIN_AUTHORITY",
        "NO_SOLUTION_AND_MULTIPLE_SOLUTION_POLICY",
      ],
      ...inactiveLifecycle,
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      disposition: "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "DISCOVERY_LEAD_ONLY",
      answerContract:
        "Find final original quantity when stage removal quantities are unequal.",
      closureReason:
        "A product of different stage retentions and a visible stage ledger make this materially different from the equal-stage power, but the recovered public item is only a discovery lead.",
      remainingFreezeBlockers: [
        "AUTHORITATIVE_UNEQUAL_STAGE_EXAM_SOURCE",
        "UNEQUAL_STAGE_ORDER_AND_DIFFICULTY_CALIBRATION",
      ],
      ...inactiveLifecycle,
    },
    {
      candidateId: "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      disposition: "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY",
      effectiveContractId:
        "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
      runtimeAuthority: "CP003_DISCOVERY_PIPELINE_V1",
      directSourceStatus: "DIRECT_SOURCE_PENDING",
      answerContract:
        "Track and report a final three-component state after different refill liquids are introduced across stages.",
      closureReason:
        "A full component vector ledger is mathematically distinct from scalar original-component retention, but source authority and the multi-vessel ownership boundary remain unresolved.",
      remainingFreezeBlockers: [
        "AUTHORITATIVE_THIRD_LIQUID_EXAM_SOURCE",
        "CP003_VERSUS_CP006_OWNERSHIP_CLOSURE",
        "THREE_COMPONENT_OUTPUT_ORDER_POLICY",
      ],
      ...inactiveLifecycle,
    },
    {
      candidateId:
        "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
      disposition: "EXCLUDED_TO_MAL_CP004",
      effectiveContractId: null,
      runtimeAuthority: "NONE_CP004_EXCLUSION",
      directSourceStatus: "NOT_APPLICABLE_CP004",
      answerContract:
        "Track a non-zero concentration carried by the replacement liquid.",
      closureReason:
        "Once the refill has its own concentration, conserved-solute accounting rather than pure original-component retention is decisive. MAL-CP-004 owns the contract.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
      disposition: "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
      effectiveContractId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
      runtimeAuthority: "MAL-CP003-EN-SOURCE-BACKED-DISCOVERY-V1",
      directSourceStatus: "DIRECT_SOURCE_BACKED",
      answerContract:
        "Find the final ordered and reduced original-to-refill or refill-to-original ratio.",
      closureReason:
        "Ordered ratio orientation creates distinct answer semantics and misconception behaviour even though the hidden final state is shared with quantity output.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId: "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
      disposition: "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
      effectiveContractId: "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
      runtimeAuthority: "MAL-CP003-EN-SOURCE-BACKED-DISCOVERY-V1",
      directSourceStatus: "DIRECT_SOURCE_BACKED",
      answerContract:
        "Recover vessel capacity from equal removal quantity, operation count and final component ratio.",
      closureReason:
        "A direct source matches the unknown vessel-capacity contract, and Wave 07 provides exact-root reconstruction and deterministic runtime.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
    {
      candidateId: MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
      disposition: "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
      effectiveContractId: MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
      runtimeAuthority: "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1",
      directSourceStatus: "DIRECT_SOURCE_BACKED",
      answerContract:
        "Find the minimum positive operation count that first crosses a strict original-component threshold.",
      closureReason:
        "Direct source evidence matches the minimum threshold task, and Wave 09 proves both the crossing stage and failure of the previous stage through exact simulation.",
      remainingFreezeBlockers: [],
      ...inactiveLifecycle,
    },
  ] as const;

export const MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS =
  MAL_CP003_WAVE10_COVERAGE_MATRIX.filter(
    (entry) => entry.disposition === "SOURCE_BACKED_DISTINCT_RUNTIME_READY",
  ).map((entry) => entry.candidateId);

export const MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS =
  MAL_CP003_WAVE10_COVERAGE_MATRIX.filter(
    (entry) => entry.disposition === "MERGED_REPRESENTATION_VARIANT",
  ).map((entry) => entry.candidateId);

export const MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS =
  MAL_CP003_WAVE10_COVERAGE_MATRIX.filter(
    (entry) => entry.disposition === "PROVISIONAL_SOURCE_BLOCKED_RUNTIME_READY",
  ).map((entry) => entry.candidateId);

export const MAL_CP003_WAVE10_EXCLUDED_IDS =
  MAL_CP003_WAVE10_COVERAGE_MATRIX.filter(
    (entry) => entry.disposition === "EXCLUDED_TO_MAL_CP004",
  ).map((entry) => entry.candidateId);

export const MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS = [
  ...MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS,
  ...MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS,
] as const;

export const MAL_CP003_WAVE10_FREEZE_VERDICT = {
  authorityId: MAL_CP003_WAVE10_COVERAGE_AUTHORITY_ID,
  discoveryCandidateCount: MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS.length,
  sourceBackedRuntimeReadyCount:
    MAL_CP003_WAVE10_SOURCE_BACKED_CONTRACT_IDS.length,
  mergedRepresentationVariantCount:
    MAL_CP003_WAVE10_MERGED_REPRESENTATION_IDS.length,
  provisionalBlockerContractCount:
    MAL_CP003_WAVE10_PROVISIONAL_BLOCKER_IDS.length,
  excludedToCp004Count: MAL_CP003_WAVE10_EXCLUDED_IDS.length,
  effectiveOwnedContractCount:
    MAL_CP003_WAVE10_EFFECTIVE_OWNED_CONTRACT_IDS.length,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  verdict: "BLOCKED_BY_FOUR_DISTINCT_SOURCE_AND_POLICY_CONTRACTS",
  nextPermanentQlIdReserved: false,
  nextPermanentQlId: null,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
} as const;
