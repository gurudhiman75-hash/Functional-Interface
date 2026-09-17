import type { CoaQlId } from "./types.ts";

export const COA_CP008_CHECKPOINT_ID = "COA-CP-008" as const;

export const COA_CP008_SEMANTIC_QL_POLICY = Object.freeze([
  { qlId: "COA-QL-001", decision: "KEEP", boundary: "Direct remedial action is the decisive learner operation." },
  { qlId: "COA-QL-002", decision: "KEEP", boundary: "Prevention or risk reduction is the decisive learner operation." },
  { qlId: "COA-QL-003", decision: "KEEP", boundary: "Verification before irreversible action is decisive." },
  { qlId: "COA-QL-004", decision: "KEEP_WITH_OVERLAP_GUARD", boundary: "Use only when institutional authority/process is material and no more specific QL fully decides the item." },
  { qlId: "COA-QL-005", decision: "KEEP", boundary: "An explicit operational constraint materially changes correctness." },
  { qlId: "COA-QL-006", decision: "KEEP", boundary: "The central distinction is proportionate response versus unnecessary breadth/severity." },
  { qlId: "COA-QL-007", decision: "RETIRE_CANDIDATE_PRESENTATION_ONLY", boundary: "Paired Course I / Course II is presentation rather than a learner operation; preserve legacy IDs only for compatibility." },
  { qlId: "COA-QL-008", decision: "KEEP", boundary: "Order, dependency or prerequisite itself changes correctness." },
  { qlId: "COA-QL-009", decision: "KEEP_WITH_STRICT_BOUNDARY", boundary: "Multiple material reasoning dimensions are required; a single earlier-family rule must not fully decide the item." },
] as const satisfies readonly {
  readonly qlId: CoaQlId;
  readonly decision: string;
  readonly boundary: string;
}[]);

export const COA_CP008_ACTIVE_SEMANTIC_QL_IDS = Object.freeze([
  "COA-QL-001",
  "COA-QL-002",
  "COA-QL-003",
  "COA-QL-004",
  "COA-QL-005",
  "COA-QL-006",
  "COA-QL-008",
  "COA-QL-009",
] as const);

export const COA_CP008_LEGACY_PRESENTATION_QL_IDS = Object.freeze([
  "COA-QL-007",
] as const);

export const COA_CP008_PRESENTATION_POLICY = Object.freeze({
  TWO_ACTION_FOUR_WAY: Object.freeze({
    status: "SUPPORTED" as const,
    generationPolicy: "SEMANTIC_AUTHORITY_REQUIRED" as const,
  }),
  TWO_ACTION_FIVE_CODE: Object.freeze({
    status: "SOURCE_BACKED_EXCLUSIVE_EITHER_AUTHORITY_REQUIRED" as const,
    generationPolicy: "FAIL_CLOSED_UNTIL_EXCLUSIVE_EITHER_AUTHORITY_EXISTS" as const,
  }),
  MULTIPLE_COURSE_BEST_ACTION: Object.freeze({
    status: "EVIDENCE_EXISTS_NOT_V1_FROZEN" as const,
    generationPolicy: "BLOCKED_PENDING_STRONGER_EXAM_SPECIFIC_SOURCE_SET" as const,
  }),
  THREE_ACTION_COMBINATION: Object.freeze({
    status: "BLOCKED_PENDING_STRONGER_EXAM_EVIDENCE" as const,
    generationPolicy: "BLOCKED" as const,
  }),
  SEQUENCE_ACTION: Object.freeze({
    status: "SUPPORTED_THROUGH_QL008" as const,
    generationPolicy: "QL008_SEMANTIC_AUTHORITY_REQUIRED" as const,
  }),
});

export const COA_CP008_TAXONOMY_STATUS = "PROVISIONALLY_SATURATED" as const;
export const COA_CP008_FINAL_FREEZE_REQUIRES = Object.freeze([
  "CP007_HUMAN_APPROVAL",
  "CP008_HUMAN_APPROVAL",
] as const);
