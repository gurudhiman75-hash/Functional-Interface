import {
  buildRnkCp006EqualityEditorialV4Final,
  type RnkCp006EditorialV4FinalQuestion,
} from "./cp006-equality-ranking-editorial-v4-final";
import type { RnkCp006EditorialSourceForm } from "./cp006-equality-ranking-editorial-v2";

export const RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION =
  "RNK_CP006_AUTHORITY_CONSOLIDATION_V1" as const;

export const RNK_CP006_PROVISIONAL_AUTHORITY_IDS = [
  "EQUALITY_AWARE_PAIR_RELATION",
  "EQUALITY_AWARE_ENDPOINT",
  "COMPLETE_WEAK_ORDER",
] as const;

export type RnkCp006ProvisionalAuthorityId =
  (typeof RNK_CP006_PROVISIONAL_AUTHORITY_IDS)[number];

export type RnkCp006AuthorityProofContract =
  | "EQUALITY_BRIDGED_DIRECTIONAL_PAIR_PROOF"
  | "EQUALITY_BRIDGED_ENDPOINT_SELECTION"
  | "EQUALITY_AWARE_FULL_SEQUENCE";

export type RnkCp006AuthorityAnswerSemantic =
  | "RELATION"
  | "ENTITY"
  | "WEAK_ORDER_SEQUENCE";

export interface RnkCp006AuthorityProfile {
  readonly version: typeof RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION;
  readonly sourceForm: RnkCp006EditorialSourceForm;
  readonly provisionalAuthorityId: RnkCp006ProvisionalAuthorityId;
  readonly stateContract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY";
  readonly proofContract: RnkCp006AuthorityProofContract;
  readonly answerSemantic: RnkCp006AuthorityAnswerSemantic;
  readonly decision: "KEEP_DISTINCT_PROVISIONAL_AUTHORITY";
  readonly cp004Analogue: "RNK-QL-027" | "RNK-QL-030" | "RNK-QL-031";
  readonly whyNotCp004: "CP004_REQUIRES_ONE_UNIQUE_STRICT_TOTAL_ORDER";
  readonly permanentQlId: null;
  readonly freezeEligible: false;
}

export type RnkCp006ConsolidatedQuestion = RnkCp006EditorialV4FinalQuestion & {
  readonly authorityProfile: RnkCp006AuthorityProfile;
};

function profileFor(sourceForm: RnkCp006EditorialSourceForm): RnkCp006AuthorityProfile {
  switch (sourceForm) {
    case "PAIR_RELATION_THROUGH_EQUALITY":
      return {
        version: RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION,
        sourceForm,
        provisionalAuthorityId: "EQUALITY_AWARE_PAIR_RELATION",
        stateContract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
        proofContract: "EQUALITY_BRIDGED_DIRECTIONAL_PAIR_PROOF",
        answerSemantic: "RELATION",
        decision: "KEEP_DISTINCT_PROVISIONAL_AUTHORITY",
        cp004Analogue: "RNK-QL-031",
        whyNotCp004: "CP004_REQUIRES_ONE_UNIQUE_STRICT_TOTAL_ORDER",
        permanentQlId: null,
        freezeEligible: false,
      };
    case "ENDPOINT_ENTITY_THROUGH_EQUALITY":
      return {
        version: RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION,
        sourceForm,
        provisionalAuthorityId: "EQUALITY_AWARE_ENDPOINT",
        stateContract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
        proofContract: "EQUALITY_BRIDGED_ENDPOINT_SELECTION",
        answerSemantic: "ENTITY",
        decision: "KEEP_DISTINCT_PROVISIONAL_AUTHORITY",
        cp004Analogue: "RNK-QL-027",
        whyNotCp004: "CP004_REQUIRES_ONE_UNIQUE_STRICT_TOTAL_ORDER",
        permanentQlId: null,
        freezeEligible: false,
      };
    case "COMPLETE_WEAK_ORDER":
      return {
        version: RNK_CP006_AUTHORITY_CONSOLIDATION_VERSION,
        sourceForm,
        provisionalAuthorityId: "COMPLETE_WEAK_ORDER",
        stateContract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
        proofContract: "EQUALITY_AWARE_FULL_SEQUENCE",
        answerSemantic: "WEAK_ORDER_SEQUENCE",
        decision: "KEEP_DISTINCT_PROVISIONAL_AUTHORITY",
        cp004Analogue: "RNK-QL-030",
        whyNotCp004: "CP004_REQUIRES_ONE_UNIQUE_STRICT_TOTAL_ORDER",
        permanentQlId: null,
        freezeEligible: false,
      };
  }
}

export function buildRnkCp006ConsolidatedEditorialQuestions(): readonly RnkCp006ConsolidatedQuestion[] {
  return buildRnkCp006EqualityEditorialV4Final().map((question) => ({
    ...question,
    authorityProfile: profileFor(question.sourceForm),
  }));
}
