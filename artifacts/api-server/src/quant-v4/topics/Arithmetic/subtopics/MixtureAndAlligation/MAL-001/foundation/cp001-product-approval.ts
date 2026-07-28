import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import type { MalCp001FreezeCandidateId } from "./cp001-freeze-candidate-ledger";

export type MalCp001CandidateProductDecision =
  | "APPROVED_FIRST_ALLOCATION_SCOPE"
  | "APPROVED_WITH_VARIANT_DEFERRED"
  | "HELD_FOR_SOURCE_OR_EXPLICIT_ACCEPTANCE"
  | "DEFERRED_FROM_CP001_REFER_CP002";

export type MalCp001PrototypeProductDecision =
  | "IN_APPROVED_SCOPE"
  | "DEFERRED_VARIANT"
  | "HELD"
  | "REFERRED_TO_CP002";

export interface MalCp001CandidateProductApproval {
  freezeCandidateId: MalCp001FreezeCandidateId;
  decision: MalCp001CandidateProductDecision;
  includedPrototypeIds: readonly MalCp001DiscoveryPrototypeId[];
  excludedPrototypeIds: readonly MalCp001DiscoveryPrototypeId[];
  rationale: string;
}

export interface MalCp001PrototypeProductApproval {
  prototypeId: MalCp001DiscoveryPrototypeId;
  freezeCandidateId: MalCp001FreezeCandidateId;
  decision: MalCp001PrototypeProductDecision;
  reviewRowCountInScope: number;
  rationale: string;
}

export const MAL_CP001_PRODUCT_APPROVAL_METADATA = {
  approvalAuthority: "ExamTree product owner",
  approvalDate: "2026-07-28",
  approvalSource:
    "Explicit approval of the scoped non-allocating recommendation in the ExamTree project conversation.",
  approvedLanguageScope: "en",
  candidateScopeApproved: true,
  individualQuestionRowsApproved: false,
  allocationScopeFrozen: true,
  qlTemplateCountFrozen: false,
  permanentQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
} as const;

export const MAL_CP001_CANDIDATE_PRODUCT_APPROVALS:
  readonly MalCp001CandidateProductApproval[] = [
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TARGET-RATIO",
      decision: "APPROVED_FIRST_ALLOCATION_SCOPE",
      includedPrototypeIds: ["MAL-CP001-PROT-RATIO-FROM-TARGET"],
      excludedPrototypeIds: [],
      rationale:
        "The product owner approved the directly sourced target-ratio contract for the first CP-001 allocation scope.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      decision: "APPROVED_FIRST_ALLOCATION_SCOPE",
      includedPrototypeIds: [
        "MAL-CP001-PROT-MEAN-FROM-QUANTITIES",
        "MAL-CP001-PROT-MEAN-FROM-RATIO",
        "MAL-CP001-PROT-THREE-COMPONENT-MEAN",
      ],
      excludedPrototypeIds: [],
      rationale:
        "The product owner approved the final-mean contract with ratio, explicit-quantity and multi-component representations retained inside one solve contract.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      decision: "APPROVED_FIRST_ALLOCATION_SCOPE",
      includedPrototypeIds: [
        "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE",
        "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO",
      ],
      excludedPrototypeIds: [],
      rationale:
        "The product owner approved inverse source-value recovery from explicit quantities or ratio evidence.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      decision: "APPROVED_FIRST_ALLOCATION_SCOPE",
      includedPrototypeIds: [
        "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
        "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
        "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY",
      ],
      excludedPrototypeIds: [],
      rationale:
        "The product owner approved the static missing-quantity contract, including addition framing and an additional known component as retained representations.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      decision: "APPROVED_WITH_VARIANT_DEFERRED",
      includedPrototypeIds: [
        "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL",
        "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET",
      ],
      excludedPrototypeIds: ["MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES"],
      rationale:
        "The product owner approved total-scale and requested-share forms while preserving the unsourced difference-as-scale representation as deferred evidence.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
      decision: "APPROVED_FIRST_ALLOCATION_SCOPE",
      includedPrototypeIds: ["MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN"],
      excludedPrototypeIds: [],
      rationale:
        "The product owner approved the directly sourced forward two-stage final-mean contract.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
      decision: "HELD_FOR_SOURCE_OR_EXPLICIT_ACCEPTANCE",
      includedPrototypeIds: [],
      excludedPrototypeIds: ["MAL-CP001-PROT-TWO-STAGE-UNKNOWN"],
      rationale:
        "The approved recommendation keeps the exact inverse two-stage topology on hold because its external support remains analogous rather than direct.",
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
      decision: "DEFERRED_FROM_CP001_REFER_CP002",
      includedPrototypeIds: [],
      excludedPrototypeIds: ["MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION"],
      rationale:
        "The approved recommendation excludes this candidate from CP-001 and retains it only as CP-002 ownership-boundary evidence.",
    },
  ] as const;

export const MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS:
  readonly MalCp001PrototypeProductApproval[] =
  MAL_CP001_CANDIDATE_PRODUCT_APPROVALS.flatMap((candidate) => [
    ...candidate.includedPrototypeIds.map((prototypeId) => ({
      prototypeId,
      freezeCandidateId: candidate.freezeCandidateId,
      decision: "IN_APPROVED_SCOPE" as const,
      reviewRowCountInScope: 4,
      rationale: candidate.rationale,
    })),
    ...candidate.excludedPrototypeIds.map((prototypeId) => ({
      prototypeId,
      freezeCandidateId: candidate.freezeCandidateId,
      decision:
        candidate.decision === "APPROVED_WITH_VARIANT_DEFERRED"
          ? "DEFERRED_VARIANT" as const
          : candidate.decision === "HELD_FOR_SOURCE_OR_EXPLICIT_ACCEPTANCE"
            ? "HELD" as const
            : "REFERRED_TO_CP002" as const,
      reviewRowCountInScope: 4,
      rationale: candidate.rationale,
    })),
  ]);

export const MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS =
  MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS
    .filter((entry) => entry.decision === "IN_APPROVED_SCOPE")
    .map((entry) => entry.prototypeId);

export const MAL_CP001_DEFERRED_PROTOTYPE_IDS =
  MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS
    .filter((entry) => entry.decision === "DEFERRED_VARIANT")
    .map((entry) => entry.prototypeId);

export const MAL_CP001_HELD_PROTOTYPE_IDS =
  MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS
    .filter((entry) => entry.decision === "HELD")
    .map((entry) => entry.prototypeId);

export const MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS =
  MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS
    .filter((entry) => entry.decision === "REFERRED_TO_CP002")
    .map((entry) => entry.prototypeId);
