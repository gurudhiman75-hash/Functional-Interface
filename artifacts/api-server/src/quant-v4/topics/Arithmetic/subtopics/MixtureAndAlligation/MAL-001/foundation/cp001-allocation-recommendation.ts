import type { MalCp001FreezeCandidateId } from "./cp001-freeze-candidate-ledger";
import type { MalCp001FreezeReadiness } from "./cp001-source-fixture-ledger";

export type MalCp001AllocationRecommendation =
  | "READY_AFTER_HUMAN_REVIEW"
  | "READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED"
  | "HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE"
  | "DEFER_FROM_CP001_REFER_CP002";

export interface MalCp001AllocationRecommendationEntry {
  freezeCandidateId: MalCp001FreezeCandidateId;
  sourceReadiness: MalCp001FreezeReadiness;
  recommendation: MalCp001AllocationRecommendation;
  retainedPrototypeScope: string;
  deferredPrototypeScope: string | null;
  rationale: string;
  humanReviewStatus: "PENDING";
  permanentQlId: null;
  currentlyAllocationEligible: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

/**
 * This is an allocation recommendation, not an allocation table. Every row is
 * deliberately ineligible until an actual human product decision is recorded.
 */
export const MAL_CP001_ALLOCATION_RECOMMENDATIONS:
  readonly MalCp001AllocationRecommendationEntry[] = [
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TARGET-RATIO",
      sourceReadiness: "SUPPORTED",
      recommendation: "READY_AFTER_HUMAN_REVIEW",
      retainedPrototypeScope: "Target ratio from two source values and a target mean.",
      deferredPrototypeScope: null,
      rationale:
        "Direct external evidence, a distinct ratio answer semantic and executable alligation proof support the contract; only human product approval remains.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      sourceReadiness: "SUPPORTED",
      recommendation: "READY_AFTER_HUMAN_REVIEW",
      retainedPrototypeScope: "Final blend mean from ratio, explicit quantities or multiple complete source components.",
      deferredPrototypeScope: null,
      rationale:
        "Direct source evidence supports all represented input forms; component count and ratio presentation remain variants inside one contract.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      sourceReadiness: "SUPPORTED",
      recommendation: "READY_AFTER_HUMAN_REVIEW",
      retainedPrototypeScope: "Recover one source value from target mean and quantity or ratio evidence.",
      deferredPrototypeScope: null,
      rationale:
        "The inverse source-value task is directly sourced and remains distinct from quantity reconstruction.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      sourceReadiness: "SUPPORTED",
      recommendation: "READY_AFTER_HUMAN_REVIEW",
      retainedPrototypeScope: "Recover one missing component quantity in a static weighted blend, including addition framing.",
      deferredPrototypeScope: null,
      rationale:
        "Direct source evidence supports the unknown-quantity balance; temporal addition wording does not create another contract.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      sourceReadiness: "SUPPORTED_WITH_VARIANT_GAP",
      recommendation: "READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED",
      retainedPrototypeScope: "Scale an alligation ratio from a stated total or one known component quantity.",
      deferredPrototypeScope: "Difference-as-scale presentation remains executable evidence but should not enter the first permanent allocation until directly sourced or explicitly approved.",
      rationale:
        "The contract is directly supported through total and known-counterpart forms. The unsupported difference wording is a merged representation and can be deferred without creating or blocking a separate identity.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
      sourceReadiness: "SUPPORTED",
      recommendation: "READY_AFTER_HUMAN_REVIEW",
      retainedPrototypeScope: "Derive an intermediate homogeneous blend value, then calculate the second-stage final mean.",
      deferredPrototypeScope: null,
      rationale:
        "Direct compound-blend evidence and a materially additional intermediate-state burden support the forward two-stage contract.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
      sourceReadiness: "SUPPORTED_WITH_VARIANT_GAP",
      recommendation: "HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE",
      retainedPrototypeScope: "Executable inverse second-stage quantity reconstruction remains available for review and testing.",
      deferredPrototypeScope: "Do not allocate the exact second-stage added-quantity topology from analogous evidence alone.",
      rationale:
        "External references support inverse mixing of pre-blended sources, but the current exact topology lacks a direct recovered fixture. It needs either direct evidence or an explicit product decision accepting the analogy.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
      sourceReadiness: "BLOCKED_SOURCE_GAP",
      recommendation: "DEFER_FROM_CP001_REFER_CP002",
      retainedPrototypeScope: "Keep the executable prototype only as mathematical and ownership-boundary evidence.",
      deferredPrototypeScope: "Exclude the candidate from the first CP-001 permanent allocation proposal.",
      rationale:
        "The recovered competitive-exam three-component relation is an addition-driven ratio-adjustment problem owned by CP-002, not direct evidence for the CP-001 weighted-mean topology. The CP-001 blocker therefore remains unresolved and the safest recommendation is deferral from this chapter.",
      humanReviewStatus: "PENDING",
      permanentQlId: null,
      currentlyAllocationEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  ] as const;
