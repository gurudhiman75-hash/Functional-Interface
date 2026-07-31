import {
  SER_CP001_TEMPORARY_TEMPLATE_IDS,
  SER_CP001_TEMPORARY_TEMPLATES,
  generateSerCp001Question,
} from "../SER-CP-001/foundation";
import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  SER_CP002_TEMPORARY_TEMPLATES,
  generateSerCp002Question,
} from "../SER-CP-002/foundation";
import {
  SER_CP003_TEMPORARY_TEMPLATE_IDS,
  SER_CP003_TEMPORARY_TEMPLATES,
  generateSerCp003Question,
} from "../SER-CP-003/foundation";
import {
  SER_CP004_RULE_IDS,
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  SER_CP004_TEMPORARY_TEMPLATES,
  generateSerCp004Question,
} from "../SER-CP-004/foundation";
import {
  SER_CP005_CANONICAL_AUTHORITY_IDS,
  SER_CP005_SOURCE_RULE_IDS,
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  SER_CP005_TEMPORARY_TEMPLATES,
  generateSerCp005Question,
} from "../SER-CP-005/foundation";

export type SerNumericCheckpointId =
  | "SER-CP-001"
  | "SER-CP-002"
  | "SER-CP-003"
  | "SER-CP-004"
  | "SER-CP-005";

export type SerNumericTaskKind =
  | "NEXT_TERM"
  | "MISSING_TERM"
  | "PREVIOUS_TERM"
  | "WRONG_TERM";

export type SerNumericAnswerSemantic =
  | "TERM_VALUE"
  | "WRONG_DISPLAYED_TERM";

export interface SerNumericTemplateSurface {
  readonly checkpointId: SerNumericCheckpointId;
  readonly temporaryTemplateId: string;
  readonly taskKind: SerNumericTaskKind;
  readonly answerSemantic: SerNumericAnswerSemantic;
}

function surfaces(
  checkpointId: SerNumericCheckpointId,
  templates: readonly {
    readonly temporaryTemplateId: string;
    readonly taskKind: SerNumericTaskKind;
    readonly answerSemantic: SerNumericAnswerSemantic;
  }[],
): SerNumericTemplateSurface[] {
  return templates.map((template) => ({
    checkpointId,
    temporaryTemplateId: template.temporaryTemplateId,
    taskKind: template.taskKind,
    answerSemantic: template.answerSemantic,
  }));
}

export const SER_NUMERIC_TEMPLATE_SURFACES: readonly SerNumericTemplateSurface[] = [
  ...surfaces("SER-CP-001", SER_CP001_TEMPORARY_TEMPLATES),
  ...surfaces("SER-CP-002", SER_CP002_TEMPORARY_TEMPLATES),
  ...surfaces("SER-CP-003", SER_CP003_TEMPORARY_TEMPLATES),
  ...surfaces("SER-CP-004", SER_CP004_TEMPORARY_TEMPLATES),
  ...surfaces("SER-CP-005", SER_CP005_TEMPORARY_TEMPLATES),
];

export interface SerNumericSourceFamily {
  readonly checkpointId: SerNumericCheckpointId;
  readonly sourceFamilyId: string;
}

export const SER_NUMERIC_SOURCE_FAMILIES: readonly SerNumericSourceFamily[] = [
  { checkpointId: "SER-CP-001", sourceFamilyId: "UNIFORM_ADDITIVE_STEP" },
  { checkpointId: "SER-CP-002", sourceFamilyId: "UNIFORM_MULTIPLICATIVE_RATIO" },
  { checkpointId: "SER-CP-002", sourceFamilyId: "AFFINE_MULTIPLY_THEN_ADD" },
  { checkpointId: "SER-CP-003", sourceFamilyId: "CONSTANT_NONZERO_SECOND_DIFFERENCE" },
  { checkpointId: "SER-CP-003", sourceFamilyId: "CONSTANT_NONZERO_THIRD_DIFFERENCE" },
  ...SER_CP004_RULE_IDS.map((sourceFamilyId) => ({
    checkpointId: "SER-CP-004" as const,
    sourceFamilyId,
  })),
  ...SER_CP005_SOURCE_RULE_IDS.map((sourceFamilyId) => ({
    checkpointId: "SER-CP-005" as const,
    sourceFamilyId,
  })),
];

export interface SerNumericCanonicalAuthority {
  readonly checkpointId: SerNumericCheckpointId;
  readonly authorityId: string;
  readonly maturity: "PROVISIONAL_CANONICAL_AUTHORITY";
}

export const SER_NUMERIC_CANONICAL_AUTHORITIES: readonly SerNumericCanonicalAuthority[] = [
  {
    checkpointId: "SER-CP-001",
    authorityId: "UNIFORM_ADDITIVE_STEP",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-002",
    authorityId: "UNIFORM_MULTIPLICATIVE_RATIO",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-002",
    authorityId: "AFFINE_MULTIPLY_THEN_ADD",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-003",
    authorityId: "CONSTANT_NONZERO_SECOND_DIFFERENCE",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-003",
    authorityId: "CONSTANT_NONZERO_THIRD_DIFFERENCE",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-004",
    authorityId: "CONSECUTIVE_PRIMES",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-004",
    authorityId: "FACTORIAL_SEQUENCE",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  {
    checkpointId: "SER-CP-004",
    authorityId: "ADD_PREVIOUS_TWO_RECURRENCE",
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY",
  },
  ...SER_CP005_CANONICAL_AUTHORITY_IDS.map((authorityId) => ({
    checkpointId: "SER-CP-005" as const,
    authorityId,
    maturity: "PROVISIONAL_CANONICAL_AUTHORITY" as const,
  })),
];

export interface SerNumericCollisionMapping {
  readonly sourceCheckpointId: SerNumericCheckpointId;
  readonly sourceFamilyId: string;
  readonly canonicalCheckpointId: SerNumericCheckpointId;
  readonly canonicalAuthorityId: string;
  readonly reason:
    | "CROSS_CHECKPOINT_MATHEMATICAL_COLLISION"
    | "EQUIVALENT_INTERLEAVED_REPRESENTATION"
    | "PHASE_VARIANT_MERGE";
}

export const SER_NUMERIC_COLLISION_MAPPINGS: readonly SerNumericCollisionMapping[] = [
  {
    sourceCheckpointId: "SER-CP-004",
    sourceFamilyId: "CONSECUTIVE_SQUARES",
    canonicalCheckpointId: "SER-CP-003",
    canonicalAuthorityId: "CONSTANT_NONZERO_SECOND_DIFFERENCE",
    reason: "CROSS_CHECKPOINT_MATHEMATICAL_COLLISION",
  },
  {
    sourceCheckpointId: "SER-CP-004",
    sourceFamilyId: "CONSECUTIVE_CUBES",
    canonicalCheckpointId: "SER-CP-003",
    canonicalAuthorityId: "CONSTANT_NONZERO_THIRD_DIFFERENCE",
    reason: "CROSS_CHECKPOINT_MATHEMATICAL_COLLISION",
  },
  {
    sourceCheckpointId: "SER-CP-004",
    sourceFamilyId: "TRIANGULAR_NUMBERS",
    canonicalCheckpointId: "SER-CP-003",
    canonicalAuthorityId: "CONSTANT_NONZERO_SECOND_DIFFERENCE",
    reason: "CROSS_CHECKPOINT_MATHEMATICAL_COLLISION",
  },
  {
    sourceCheckpointId: "SER-CP-004",
    sourceFamilyId: "FIXED_BASE_CONSECUTIVE_POWERS",
    canonicalCheckpointId: "SER-CP-002",
    canonicalAuthorityId: "UNIFORM_MULTIPLICATIVE_RATIO",
    reason: "CROSS_CHECKPOINT_MATHEMATICAL_COLLISION",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "ALTERNATING_ADDITIVE_STEPS",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "TWO_INTERLEAVED_ARITHMETIC",
    reason: "EQUIVALENT_INTERLEAVED_REPRESENTATION",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "ALTERNATING_MULTIPLICATIVE_RATIOS",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "TWO_INTERLEAVED_GEOMETRIC",
    reason: "EQUIVALENT_INTERLEAVED_REPRESENTATION",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "ALTERNATING_ADD_THEN_MULTIPLY",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "ALTERNATING_FIXED_AFFINE_PHASE",
    reason: "PHASE_VARIANT_MERGE",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "ALTERNATING_MULTIPLY_THEN_ADD",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "ALTERNATING_FIXED_AFFINE_PHASE",
    reason: "PHASE_VARIANT_MERGE",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
    reason: "PHASE_VARIANT_MERGE",
  },
  {
    sourceCheckpointId: "SER-CP-005",
    sourceFamilyId: "PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES",
    canonicalCheckpointId: "SER-CP-005",
    canonicalAuthorityId: "PROGRESSIVE_ALTERNATING_AFFINE_CYCLES",
    reason: "PHASE_VARIANT_MERGE",
  },
];

export type SerNumericGapStatus = "COVERED" | "PARTIAL" | "OPEN";

export interface SerNumericGapDimension {
  readonly dimensionId: string;
  readonly status: SerNumericGapStatus;
  readonly evidence: string;
  readonly blocksPermanentFreeze: boolean;
  readonly recommendedWave:
    | "NONE"
    | "EDGE_DOMAIN_EXPANSION"
    | "HIGHER_ORDER_AND_RECURRENCE_EXPANSION"
    | "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION"
    | "SOURCE_SATURATION_AND_EDITORIAL_AUDIT";
}

export const SER_NUMERIC_GAP_MATRIX: readonly SerNumericGapDimension[] = [
  {
    dimensionId: "UNIFORM_ADDITIVE_INTEGER",
    status: "COVERED",
    evidence: "SER-CP-001 executable authority",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "FIRST_ORDER_MULTIPLICATIVE_AND_AFFINE_INTEGER",
    status: "COVERED",
    evidence: "SER-CP-002 complete-pool executable authorities",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "SECOND_AND_THIRD_FINITE_DIFFERENCE_INTEGER",
    status: "COVERED",
    evidence: "SER-CP-003 executable authorities",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "SELECTED_SPECIAL_NUMBER_AND_TWO_TERM_SUM_RECURRENCE",
    status: "COVERED",
    evidence: "SER-CP-004 retained prime, factorial and previous-two-sum authorities",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "TWO_LANE_INTERLEAVING",
    status: "COVERED",
    evidence: "SER-CP-005 arithmetic, geometric and mixed lane authorities",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "ALTERNATING_FIXED_AFFINE_PHASE",
    status: "COVERED",
    evidence: "SER-CP-005 phase-normalized authority",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "PROGRESSIVE_COMPOSITE_AFFINE",
    status: "COVERED",
    evidence: "SER-CP-005 progressive multiply-plus-add and alternating-cycle authorities",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "NEXT_TERM_TASK",
    status: "COVERED",
    evidence: "All 22 source families expose NEXT_TERM",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "INTERIOR_MISSING_TERM_TASK",
    status: "COVERED",
    evidence: "All 22 source families expose MISSING_TERM",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "PREVIOUS_TERM_TASK",
    status: "COVERED",
    evidence: "All 22 source families expose PREVIOUS_TERM",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "WRONG_DISPLAYED_TERM_TASK",
    status: "COVERED",
    evidence: "All 22 source families expose WRONG_TERM with displayed-term answer semantics",
    blocksPermanentFreeze: false,
    recommendedWave: "NONE",
  },
  {
    dimensionId: "DESCENDING_AND_SIGNED_DOMAINS",
    status: "PARTIAL",
    evidence: "Some additive and finite-difference generators reach signed or descending cases; chapter-wide parity is unproved",
    blocksPermanentFreeze: true,
    recommendedWave: "EDGE_DOMAIN_EXPANSION",
  },
  {
    dimensionId: "SPECIAL_NUMBER_AND_RECURRENCE_SOURCE_SATURATION",
    status: "PARTIAL",
    evidence: "Only consecutive primes, factorials and previous-two sums are executable",
    blocksPermanentFreeze: true,
    recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
  },
  {
    dimensionId: "ZERO_STEP_AND_CONSTANT_SERIES",
    status: "OPEN",
    evidence: "No accepted zero-step authority or explicit ownership decision",
    blocksPermanentFreeze: true,
    recommendedWave: "EDGE_DOMAIN_EXPANSION",
  },
  {
    dimensionId: "FRACTION_DECIMAL_AND_DIVISION_SERIES",
    status: "OPEN",
    evidence: "Current executable domains are bounded integers",
    blocksPermanentFreeze: true,
    recommendedWave: "EDGE_DOMAIN_EXPANSION",
  },
  {
    dimensionId: "FOURTH_AND_HIGHER_FINITE_DIFFERENCES",
    status: "OPEN",
    evidence: "SER-CP-003 currently stops at non-zero third differences",
    blocksPermanentFreeze: true,
    recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
  },
  {
    dimensionId: "PRIME_GAP_COMPOSITE_NUMBER_AND_CHANGING_POWER_SERIES",
    status: "OPEN",
    evidence: "Named in the manifest as unresolved CP-004 expansion",
    blocksPermanentFreeze: true,
    recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
  },
  {
    dimensionId: "RICHER_STATEFUL_RECURRENCES",
    status: "OPEN",
    evidence: "Difference, weighted, three-term and mixed previous-term recurrences are not executable",
    blocksPermanentFreeze: true,
    recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
  },
  {
    dimensionId: "THREE_OR_MORE_INTERLEAVED_LANES",
    status: "OPEN",
    evidence: "SER-CP-005 currently proves two-lane structures only",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "ALTERNATING_SIGN_PARITY_AND_OPERATOR_SERIES",
    status: "OPEN",
    evidence: "No dedicated complete-pool authority has been proved",
    blocksPermanentFreeze: true,
    recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
  },
  {
    dimensionId: "SPARSE_DISPLAY",
    status: "OPEN",
    evidence: "Current questions display contiguous positions except one target or one corruption",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "MULTIPLE_BLANKS",
    status: "OPEN",
    evidence: "Current completion tasks require exactly one blank",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "CORRECT_REPLACEMENT_FOR_WRONG_TERM",
    status: "OPEN",
    evidence: "Current wrong-term questions answer with the incorrect displayed value, not its replacement",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "CONTINUATION_BLOCK_OR_CLUSTER",
    status: "OPEN",
    evidence: "Current numeric questions return one scalar answer",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "EXPLICIT_RULE_MATCHING_SEQUENCE",
    status: "OPEN",
    evidence: "No matching-sequence-under-rule task is executable",
    blocksPermanentFreeze: true,
    recommendedWave: "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
  },
  {
    dimensionId: "SSC_BANKING_RAILWAYS_AND_PUNJAB_SOURCE_SATURATION",
    status: "OPEN",
    evidence: "Source collection and frequency-weighted exam-pattern audit remain open",
    blocksPermanentFreeze: true,
    recommendedWave: "SOURCE_SATURATION_AND_EDITORIAL_AUDIT",
  },
];

export interface SerNumericLifecycleSample {
  readonly checkpointId: SerNumericCheckpointId;
  readonly temporaryTemplateId: string;
  readonly permanentQlId: null;
  readonly taskKind: SerNumericTaskKind;
  readonly answerSemantic: SerNumericAnswerSemantic;
  readonly lifecycle: {
    readonly maturity: "OPEN_EXECUTABLE_DISCOVERY";
    readonly sourceSaturation: "OPEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function collectSerNumericLifecycleSamples(): readonly SerNumericLifecycleSample[] {
  return [
    ...SER_CP001_TEMPORARY_TEMPLATE_IDS.map((id) => generateSerCp001Question(id, 1)),
    ...SER_CP002_TEMPORARY_TEMPLATE_IDS.map((id) => generateSerCp002Question(id, 1)),
    ...SER_CP003_TEMPORARY_TEMPLATE_IDS.map((id) => generateSerCp003Question(id, 1)),
    ...SER_CP004_TEMPORARY_TEMPLATE_IDS.map((id) => generateSerCp004Question(id, 1)),
    ...SER_CP005_TEMPORARY_TEMPLATE_IDS.map((id) => generateSerCp005Question(id, 1)),
  ];
}

export const SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME = 10_560;
export const SER_NUMERIC_PERMANENT_QL_COUNT = 0;
export const SER_NUMERIC_FREEZE_DECISION = "BLOCK_PERMANENT_QL_ALLOCATION" as const;
