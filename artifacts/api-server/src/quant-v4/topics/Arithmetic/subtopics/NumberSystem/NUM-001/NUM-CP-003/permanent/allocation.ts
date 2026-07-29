import {
  NUM_CP003_RETAINED_TEMPLATE_REGISTRY,
} from "../retained/template-registry";
import type {
  NumCp003RetainedAnswerSemantic,
  NumCp003RetainedAuthorityId,
  NumCp003RetainedRepresentation,
  NumCp003RetainedTemplateEntry,
} from "../retained/types";

export const NUM_CP003_PERMANENT_QL_IDS = [
  "NUM-QL-001",
  "NUM-QL-002",
  "NUM-QL-003",
  "NUM-QL-004",
  "NUM-QL-005",
  "NUM-QL-006",
  "NUM-QL-007",
  "NUM-QL-008",
  "NUM-QL-009",
  "NUM-QL-010",
  "NUM-QL-011",
  "NUM-QL-012",
  "NUM-QL-013",
  "NUM-QL-014",
  "NUM-QL-015",
  "NUM-QL-016",
  "NUM-QL-017",
] as const;

export type NumCp003PermanentQlId =
  (typeof NUM_CP003_PERMANENT_QL_IDS)[number];

export const NUM_CP003_PERMANENT_SOLVE_MODE_IDS = [
  "NUM-CP003-SM-APPLY-DIVISIBILITY-RULE",
  "NUM-CP003-SM-RESOLVE-SINGLE-DIGIT-CANDIDATE-SET",
  "NUM-CP003-SM-RESOLVE-ORDERED-DIGIT-PAIR-SET",
  "NUM-CP003-SM-FIND-DIGIT-BOUND-MULTIPLE",
  "NUM-CP003-SM-COUNT-ONE-DIVISOR-IN-RANGE",
  "NUM-CP003-SM-TEST-IMPLICIT-REPEATED-NUMERAL",
  "NUM-CP003-SM-RESOLVE-LINKED-ARITHMETIC-DIVISIBILITY",
] as const;

export type NumCp003PermanentSolveModeId =
  (typeof NUM_CP003_PERMANENT_SOLVE_MODE_IDS)[number];

export type NumCp003PermanentQlTemplateId =
  | "NUM-CP003-QLC-DIVISOR-POLARITY-SELECTION"
  | "NUM-CP003-QLC-UNIQUE-MISSING-DIGIT"
  | "NUM-CP003-QLC-EXTREMUM-VALID-DIGIT"
  | "NUM-CP003-QLC-VALID-DIGIT-COUNT"
  | "NUM-CP003-QLC-VALID-DIGIT-SUM"
  | "NUM-CP003-QLC-COMPLETE-VALID-DIGIT-SET"
  | "NUM-CP003-QLC-EXTREMUM-COMPLETED-NUMBER"
  | "NUM-CP003-QLC-UNIQUE-ORDERED-DIGIT-PAIR"
  | "NUM-CP003-QLC-ORDERED-PAIR-COUNT"
  | "NUM-CP003-QLC-COMPLETE-ORDERED-PAIR-SET"
  | "NUM-CP003-QLC-ORDERED-PAIR-SOLUTION-CLASS"
  | "NUM-CP003-QLC-EXTREMUM-N-DIGIT-MULTIPLE"
  | "NUM-CP003-QLC-ONE-DIVISOR-INCLUSIVE-RANGE-COUNT"
  | "NUM-CP003-QLC-IMPLICIT-REPEATED-NUMERAL-DIVISIBILITY"
  | "NUM-CP003-QLC-LINKED-ARITHMETIC-DIVISIBILITY-EXTREMUM"
  | "NUM-CP003-QLC-MISSING-DIGIT-DATA-SUFFICIENCY"
  | "NUM-CP003-QLC-DIVISIBILITY-CLAIM-VERIFICATION";

const SOLVE_MODE_BY_AUTHORITY = {
  APPLY_DIVISIBILITY_RULE: "NUM-CP003-SM-APPLY-DIVISIBILITY-RULE",
  RESOLVE_SINGLE_DIGIT_CANDIDATE_SET: "NUM-CP003-SM-RESOLVE-SINGLE-DIGIT-CANDIDATE-SET",
  RESOLVE_ORDERED_DIGIT_PAIR_SET: "NUM-CP003-SM-RESOLVE-ORDERED-DIGIT-PAIR-SET",
  FIND_DIGIT_BOUND_MULTIPLE: "NUM-CP003-SM-FIND-DIGIT-BOUND-MULTIPLE",
  COUNT_ONE_DIVISOR_IN_RANGE: "NUM-CP003-SM-COUNT-ONE-DIVISOR-IN-RANGE",
  TEST_IMPLICIT_REPEATED_NUMERAL: "NUM-CP003-SM-TEST-IMPLICIT-REPEATED-NUMERAL",
  RESOLVE_LINKED_ARITHMETIC_DIVISIBILITY: "NUM-CP003-SM-RESOLVE-LINKED-ARITHMETIC-DIVISIBILITY",
} as const satisfies Record<NumCp003RetainedAuthorityId, NumCp003PermanentSolveModeId>;

type RetainedTemplateLabel =
  (typeof NUM_CP003_RETAINED_TEMPLATE_REGISTRY)[number]["temporaryTemplateLabel"];

interface NumCp003PermanentDefinition {
  qlId: NumCp003PermanentQlId;
  qlTemplateId: NumCp003PermanentQlTemplateId;
  temporaryTemplateLabel: RetainedTemplateLabel;
}

export interface NumCp003PermanentAllocationEntry {
  qlId: NumCp003PermanentQlId;
  packageId: "NUM-001";
  cpId: "NUM-CP-003";
  qlTemplateId: NumCp003PermanentQlTemplateId;
  temporaryTemplateLabel: RetainedTemplateLabel;
  solveModeId: NumCp003PermanentSolveModeId;
  authorityId: NumCp003RetainedAuthorityId;
  taskDirection: NumCp003RetainedTemplateEntry["taskDirection"];
  answerSemantic: NumCp003RetainedAnswerSemantic;
  targetProjection: string;
  extremumDirectionParameter: boolean;
  representation: NumCp003RetainedRepresentation;
  sourceEvidence: readonly string[];
  prototypeAncestry: readonly string[];
  difficultyPolicy: "STATE_DERIVED";
  language: "en";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  maturity: "IMPLEMENTATION_PROOF";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

const DEFINITIONS = [
  ["NUM-QL-001", "NUM-CP003-QLC-DIVISOR-POLARITY-SELECTION", "NUM-CP003-QLT2-01"],
  ["NUM-QL-002", "NUM-CP003-QLC-UNIQUE-MISSING-DIGIT", "NUM-CP003-QLT2-02"],
  ["NUM-QL-003", "NUM-CP003-QLC-EXTREMUM-VALID-DIGIT", "NUM-CP003-QLT2-03"],
  ["NUM-QL-004", "NUM-CP003-QLC-VALID-DIGIT-COUNT", "NUM-CP003-QLT2-04"],
  ["NUM-QL-005", "NUM-CP003-QLC-VALID-DIGIT-SUM", "NUM-CP003-QLT2-05"],
  ["NUM-QL-006", "NUM-CP003-QLC-COMPLETE-VALID-DIGIT-SET", "NUM-CP003-QLT2-06"],
  ["NUM-QL-007", "NUM-CP003-QLC-EXTREMUM-COMPLETED-NUMBER", "NUM-CP003-QLT2-07"],
  ["NUM-QL-008", "NUM-CP003-QLC-UNIQUE-ORDERED-DIGIT-PAIR", "NUM-CP003-QLT2-08"],
  ["NUM-QL-009", "NUM-CP003-QLC-ORDERED-PAIR-COUNT", "NUM-CP003-QLT2-09"],
  ["NUM-QL-010", "NUM-CP003-QLC-COMPLETE-ORDERED-PAIR-SET", "NUM-CP003-QLT2-10"],
  ["NUM-QL-011", "NUM-CP003-QLC-ORDERED-PAIR-SOLUTION-CLASS", "NUM-CP003-QLT2-11"],
  ["NUM-QL-012", "NUM-CP003-QLC-EXTREMUM-N-DIGIT-MULTIPLE", "NUM-CP003-QLT2-12"],
  ["NUM-QL-013", "NUM-CP003-QLC-ONE-DIVISOR-INCLUSIVE-RANGE-COUNT", "NUM-CP003-QLT2-13"],
  ["NUM-QL-014", "NUM-CP003-QLC-IMPLICIT-REPEATED-NUMERAL-DIVISIBILITY", "NUM-CP003-QLT2-14"],
  ["NUM-QL-015", "NUM-CP003-QLC-LINKED-ARITHMETIC-DIVISIBILITY-EXTREMUM", "NUM-CP003-QLT2-15"],
  ["NUM-QL-016", "NUM-CP003-QLC-MISSING-DIGIT-DATA-SUFFICIENCY", "NUM-CP003-QLT2-16"],
  ["NUM-QL-017", "NUM-CP003-QLC-DIVISIBILITY-CLAIM-VERIFICATION", "NUM-CP003-QLT2-17"],
] as const satisfies readonly (readonly [
  NumCp003PermanentQlId,
  NumCp003PermanentQlTemplateId,
  RetainedTemplateLabel,
])[];

const retainedByLabel = new Map<RetainedTemplateLabel, NumCp003RetainedTemplateEntry>(
  NUM_CP003_RETAINED_TEMPLATE_REGISTRY.map((entry) => [entry.temporaryTemplateLabel, entry]),
);

const LOCKED_IMPLEMENTATION_BOUNDARY = {
  packageId: "NUM-001",
  cpId: "NUM-CP-003",
  difficultyPolicy: "STATE_DERIVED",
  language: "en",
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
  permanentIdentityFrozen: true,
  active: false,
  maturity: "IMPLEMENTATION_PROOF",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
} as const;

function allocate(
  [qlId, qlTemplateId, temporaryTemplateLabel]: typeof DEFINITIONS[number],
): NumCp003PermanentAllocationEntry {
  const retained = retainedByLabel.get(temporaryTemplateLabel);
  if (!retained) throw new Error(`Missing retained template ${temporaryTemplateLabel}`);
  if (retained.permanentQlId !== null) {
    throw new Error(`${temporaryTemplateLabel} was mutated before permanent allocation`);
  }
  return {
    qlId,
    qlTemplateId,
    temporaryTemplateLabel,
    solveModeId: SOLVE_MODE_BY_AUTHORITY[retained.authorityId],
    authorityId: retained.authorityId,
    taskDirection: retained.taskDirection,
    answerSemantic: retained.answerSemantic,
    targetProjection: retained.targetProjection,
    extremumDirectionParameter: retained.extremumDirectionParameter,
    representation: retained.representation,
    sourceEvidence: retained.sourceEvidence,
    prototypeAncestry: retained.prototypeAncestry,
    ...LOCKED_IMPLEMENTATION_BOUNDARY,
  };
}

/**
 * Product-owner-approved permanent identities for NUM-CP-003.
 *
 * Identity allocation is not release approval. Every row remains inactive and
 * unavailable to Question Studio, Question Bank, tests and public delivery.
 */
export const NUM_CP003_PERMANENT_ALLOCATION = DEFINITIONS.map(allocate) as
  readonly NumCp003PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp003PermanentQlId, NumCp003PermanentAllocationEntry>(
  NUM_CP003_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp003PermanentAllocation(
  qlId: NumCp003PermanentQlId,
): NumCp003PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-003 permanent QL ID: ${qlId}`);
  return entry;
}
