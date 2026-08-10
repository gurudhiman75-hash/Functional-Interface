import { MAL_CP005_DISCOVERY_PROTOTYPE_IDS, type MalCp005DiscoveryPrototypeId } from "./cp005-types";

export const MAL_CP005_WAVE02_RECOMMENDATION_ID =
  "MAL-CP005-WAVE02-SOURCE-NORMALIZED-MERGE-SPLIT-V1" as const;

export type MalCp005Wave02CoreFamily =
  | "FREE_ADULTERANT_AT_PURE_COST"
  | "FREE_ADULTERANT_COMMERCIAL_RATE"
  | "PAID_CHEAPER_INGREDIENT_COMMERCIAL";

export type MalCp005Wave02PrototypeDecision =
  | "RETAIN_DISTINCT_TASK_CONTRACT"
  | "MERGE_AS_DUPLICATE"
  | "REASSIGN_OTHER_OWNER";

export interface MalCp005Wave02PrototypeDecisionEntry {
  prototypeId: MalCp005DiscoveryPrototypeId;
  coreFamily: MalCp005Wave02CoreFamily;
  decision: MalCp005Wave02PrototypeDecision;
  reason: string;
}

const family = (
  prototypeIds: readonly MalCp005DiscoveryPrototypeId[],
  coreFamily: MalCp005Wave02CoreFamily,
): MalCp005Wave02PrototypeDecisionEntry[] =>
  prototypeIds.map((prototypeId) => ({
    prototypeId,
    coreFamily,
    decision: "RETAIN_DISTINCT_TASK_CONTRACT" as const,
    reason:
      "The contract shares a mathematical core with sibling directions but changes the given/unknown relationship and answer semantic. Retain it as a distinct future QL candidate while sharing solver infrastructure.",
  }));

export const MAL_CP005_WAVE02_PROTOTYPE_DECISIONS: readonly MalCp005Wave02PrototypeDecisionEntry[] = [
  ...family(MAL_CP005_DISCOVERY_PROTOTYPE_IDS.slice(0, 6), "FREE_ADULTERANT_AT_PURE_COST"),
  ...family(MAL_CP005_DISCOVERY_PROTOTYPE_IDS.slice(6, 9), "FREE_ADULTERANT_COMMERCIAL_RATE"),
  ...family(MAL_CP005_DISCOVERY_PROTOTYPE_IDS.slice(9, 12), "PAID_CHEAPER_INGREDIENT_COMMERCIAL"),
];

export type MalCp005Wave02GapDecision =
  | "SPLIT_NEW_CP005_CANDIDATE"
  | "REASSIGN_MAL_CP001"
  | "REASSIGN_MAL_CP003"
  | "REASSIGN_PNL_CP005"
  | "HOLD_NO_DIRECT_SOURCE";

export interface MalCp005Wave02GapDecisionEntry {
  gapId: string;
  decision: MalCp005Wave02GapDecision;
  normalizedSourceIds: readonly string[];
  proposedContractId: string | null;
  candidateAnswerSemantic: "PROFIT_AMOUNT" | null;
  sharedCoreFamily: MalCp005Wave02CoreFamily | null;
  reason: string;
}

export const MAL_CP005_WAVE02_GAP_DECISIONS = [
  {
    gapId: "ADULTERATION_PLUS_PRICE_CHANGE_COMMERCIAL_RESULT",
    decision: "SPLIT_NEW_CP005_CANDIDATE",
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P388-Q111"],
    proposedContractId: "MAL-CP005-CAND-PROFIT-AFTER-FREE-ADULTERATION-AND-PRICE-CHANGE",
    candidateAnswerSemantic: "PROFIT_AMOUNT",
    sharedCoreFamily: "FREE_ADULTERANT_COMMERCIAL_RATE",
    reason:
      "The direct source combines free adulteration with a selling-price increase and asks for total monetary profit. Wave 03 proves that its composition/rate arithmetic canonicalizes to the existing free-adulterant commercial core, so it does not create a fourth core. It remains a distinct task-contract candidate because the existing approved forward contract answers profit percentage whereas this source requires profit amount; scaling the paid quantity leaves the percentage unchanged but changes the monetary answer.",
  },
  {
    gapId: "PAID_BLEND_UNKNOWN_QUANTITY_FROM_KNOWN_QUANTITY_AND_TARGET_PROFIT",
    decision: "REASSIGN_MAL_CP001",
    normalizedSourceIds: ["ARUN-SHARMA-QA-2018-II40-SOL5", "ARUN-SHARMA-QA-2018-II40-SOL7"],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "The source cases are neutral blends of two paid qualities. Once target average cost is derived, the remaining task is ordinary alligation quantity allocation already owned by CP-001; creating a CP-005 duplicate would be quota inflation.",
  },
  {
    gapId: "PAID_BLEND_MISSING_COMPONENT_COST_FROM_RATIO_AND_COMMERCIAL_TARGET",
    decision: "REASSIGN_MAL_CP001",
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q102", "RS-AGGARWAL-QA-2017-P387-Q109"],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "The sale/profit condition determines a target mean cost, after which the missing source price is a weighted-blend reconstruction. The cited questions are legitimate paid blends, not adulteration.",
  },
  {
    gapId: "MULTI_PAID_VARIETY_BLEND_PROFIT",
    decision: "REASSIGN_MAL_CP001",
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q104"],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "Three legitimate paid varieties with a sale objective do not become dishonest mixing merely because profit is asked. Preserve the weighted-mixture ownership boundary and let PNL consume the resulting cost if needed.",
  },
  {
    gapId: "ADULTERATION_PLUS_FALSE_MEASURE",
    decision: "REASSIGN_PNL_CP005",
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P393-Q191"],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "The false 800 ml measure is indispensable to the outcome. Profit and Loss owns false weight/measure/short delivery, even when adulteration is also present.",
  },
  {
    gapId: "REPEATED_REPLACEMENT_THEN_SALE",
    decision: "REASSIGN_MAL_CP003",
    normalizedSourceIds: [],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "The governing state transition is repeated sampling and refill. No normalized Wave-02 source establishes a distinct commercial contract that should override CP-003 ownership.",
  },
  {
    gapId: "TARGET_LOSS_AFTER_ADULTERATION",
    decision: "HOLD_NO_DIRECT_SOURCE",
    normalizedSourceIds: [],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "A mathematically possible loss direction is not promoted merely for symmetry. No normalized Wave-02 reference fixture directly establishes it as an exam family.",
  },
  {
    gapId: "MARKUP_OR_DISCOUNT_AFTER_ADULTERATION",
    decision: "HOLD_NO_DIRECT_SOURCE",
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P388-Q111"],
    proposedContractId: null,
    candidateAnswerSemantic: null,
    sharedCoreFamily: null,
    reason:
      "Q111 directly supports one price-increase-plus-adulteration monetary-profit form, already captured by the Wave 03 candidate. It does not justify a broader markup-plus-discount family without further source authority.",
  },
] as const satisfies readonly MalCp005Wave02GapDecisionEntry[];

export const MAL_CP005_WAVE02_FREEZE_RECOMMENDATION = {
  existingPrototypeCount: 12,
  retainedExistingPrototypeCount: 12,
  newCp005CandidateCount: 1,
  futureCandidateContractCount: 13,
  sharedMathematicalCoreCount: 3,
  permanentQlCount: 0,
  permanentSolveModeCount: 0,
  allocationStatus: "UNALLOCATED_PENDING_PERMANENT_REVIEW",
  note:
    "Wave 02 normalizes evidence and recommends task contracts only. Wave 03 confirms that the thirteenth candidate shares the existing free-adulterant commercial core but has a distinct PROFIT_AMOUNT answer semantic. Permanent MAL-QL identities and permanent solve modes require a later explicit allocation checkpoint.",
} as const;
