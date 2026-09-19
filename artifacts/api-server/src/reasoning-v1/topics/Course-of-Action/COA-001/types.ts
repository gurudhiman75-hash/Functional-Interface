export const COA_QL_IDS = [
  "COA-QL-001",
  "COA-QL-002",
  "COA-QL-003",
  "COA-QL-004",
  "COA-QL-005",
  "COA-QL-006",
  "COA-QL-007",
  "COA-QL-008",
  "COA-QL-009",
] as const;

export type CoaQlId = (typeof COA_QL_IDS)[number];
export type CoaDifficulty = "EASY" | "MEDIUM" | "HARD";
export type CoaVerdict = "FOLLOWS" | "DOES_NOT_FOLLOW";
export type CoaAnswerClass = "ONLY_I" | "ONLY_II" | "BOTH" | "NEITHER";

export type CoaDomain =
  | "PUBLIC_UTILITY"
  | "BANKING"
  | "EDUCATION"
  | "EXAM_ADMIN"
  | "WORKPLACE"
  | "TRANSPORT"
  | "LOGISTICS"
  | "PUBLIC_ADMIN"
  | "DIGITAL_SERVICE"
  | "CONSUMER_SERVICE"
  | "HEALTH_SERVICE"
  | "CIVIC_SERVICE";

export type CoaReasonCode =
  | "DIRECT_REMEDY"
  | "TARGETED_PREVENTION"
  | "VERIFY_BEFORE_IRREVERSIBLE_ACTION"
  | "WITHIN_OPERATIONAL_AUTHORITY"
  | "CONSTRAINT_COMPATIBLE"
  | "PROPORTIONATE_RESPONSE"
  | "USEFUL_TEMPORARY_SAFEGUARD"
  | "ORDERED_RESPONSE"
  | "UNRELATED_GOOD_ACTION"
  | "RESTATES_PROBLEM"
  | "OUTSIDE_AUTHORITY"
  | "UNSUPPORTED_ASSUMPTION"
  | "EXCESSIVE_RESPONSE"
  | "TOO_WEAK_TO_ADDRESS_PROBLEM"
  | "CONSTRAINT_VIOLATION"
  | "PREMATURE_PUNITIVE_ACTION"
  | "WRONG_TARGET"
  | "WRONG_TIMING"
  | "LONG_TERM_ONLY_WHEN_IMMEDIATE_ACTION_REQUIRED"
  | "SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED"
  | "CORRECT_ACTION_WRONG_SEQUENCE"
  | "SYMBOLIC_BUT_INEFFECTIVE"
  | "DUPLICATE_OR_REDUNDANT_ACTION";

export type CoaActionAuthority = Readonly<{
  id: string;
  text: string;
  explanation: string;
  relevance: "DIRECT" | "INDIRECT" | "UNRELATED";
  actionability: "ACTIONABLE" | "VAGUE_WISH" | "RESTATEMENT";
  authorityFit: "WITHIN_SCOPE" | "ESCALATABLE" | "OUTSIDE_SCOPE";
  feasibility: "FEASIBLE" | "CONSTRAINED" | "IMPOSSIBLE";
  proportionality: "PROPORTIONATE" | "EXCESSIVE" | "INSUFFICIENT";
  evidenceFit: "SUPPORTED" | "UNSUPPORTED" | "CONTRADICTED";
  expectedUtility: "HIGH" | "MODERATE" | "LOW" | "HARMFUL";
  urgencyFit: "IMMEDIATE" | "FOLLOW_UP" | "MISMATCHED";
  constraintFit: "COMPATIBLE" | "NOT_APPLICABLE" | "VIOLATES";
  sequenceFit: "NOT_APPLICABLE" | "VALID_STEP" | "WRONG_ORDER" | "REDUNDANT_AFTER_PRIOR";
  expectedVerdict: CoaVerdict;
  reasonCodes: readonly CoaReasonCode[];
}>;

export type CoaScenarioAuthority = Readonly<{
  id: string;
  qlId: CoaQlId;
  difficulty: CoaDifficulty;
  domain: CoaDomain;
  statement: string;
  actions: readonly [CoaActionAuthority, CoaActionAuthority];
  expectedAnswerClass: CoaAnswerClass;
}>;
