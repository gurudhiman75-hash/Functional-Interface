import assert from "node:assert/strict";
import {
  SER_CP007_CANONICAL_AUTHORITY_IDS,
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_AUTHORITY_IDS,
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_AUTHORITY_IDS,
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_AUTHORITY_IDS,
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_AUTHORITY_IDS,
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";

type AuthorityId =
  | (typeof SER_CP007_CANONICAL_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_B_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_C_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_D_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_E_AUTHORITY_IDS)[number];

type WidthMode = "FIXED" | "GROWING" | "SHRINKING" | "GAP_LINE";

type AuthorityContract = {
  readonly authorityId: AuthorityId;
  readonly surface: "TERM_SEQUENCE" | "CONTINUOUS_GAP_LINE";
  readonly widthMode: WidthMode;
  readonly changeAxis: string;
  readonly partitionModel: string;
  readonly stateModel: string;
  readonly recoveryModel: string;
};

const CONTRACTS: readonly AuthorityContract[] = [
  {
    authorityId: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "LETTER_VALUE_BY_COLUMN",
    partitionModel: "ONE_ROW",
    stateModel: "FIXED_SIGNED_STEP_VECTOR",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "LETTER_VALUE_BY_COLUMN",
    partitionModel: "ONE_ROW",
    stateModel: "CHANGING_STEP_VECTOR",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "TWO_INTERLEAVED_CLUSTER_SERIES",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "ROW_LOCAL_TERM_PROGRESS",
    partitionModel: "TWO_POSITION_ROWS",
    stateModel: "TWO_INDEPENDENT_ROWS",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "CYCLIC_CLUSTER_PERMUTATION",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "POSITION_ORDER",
    partitionModel: "ONE_ROW",
    stateModel: "CYCLIC_WHOLE_CLUSTER_ROTATION",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "EDGE_DELETION_WORD_SEQUENCE",
    surface: "TERM_SEQUENCE",
    widthMode: "SHRINKING",
    changeAxis: "TERM_LENGTH_AT_EDGES",
    partitionModel: "ONE_ROW",
    stateModel: "ORDERED_EDGE_REMOVAL",
    recoveryModel: "FORWARD_ONLY_WHEN_HIDDEN_MATERIAL_UNKNOWN",
  },
  {
    authorityId: "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
    surface: "TERM_SEQUENCE",
    widthMode: "SHRINKING",
    changeAxis: "CONSECUTIVE_RANGE_LENGTH",
    partitionModel: "ONE_ROW",
    stateModel: "SHRINKING_CONSECUTIVE_RANGE",
    recoveryModel: "FORWARD_ONLY_WHEN_HIDDEN_MATERIAL_UNKNOWN",
  },
  {
    authorityId: "REPEATED_BLOCK_COMPLETION",
    surface: "CONTINUOUS_GAP_LINE",
    widthMode: "GAP_LINE",
    changeAxis: "BLANK_POSITIONS_IN_TEXT",
    partitionModel: "ONE_REPEATED_BLOCK",
    stateModel: "SINGLE_BLOCK_PERIOD",
    recoveryModel: "RECONSTRUCT_MISSING_LETTERS",
  },
  {
    authorityId: "ALTERNATING_BLOCK_COMPLETION",
    surface: "CONTINUOUS_GAP_LINE",
    widthMode: "GAP_LINE",
    changeAxis: "BLANK_POSITIONS_IN_TEXT",
    partitionModel: "TWO_ALTERNATING_BLOCKS",
    stateModel: "ALTERNATING_BLOCK_PERIOD",
    recoveryModel: "RECONSTRUCT_MISSING_GROUPS",
  },
  {
    authorityId: "GROWING_CONSECUTIVE_CLUSTER",
    surface: "TERM_SEQUENCE",
    widthMode: "GROWING",
    changeAxis: "CONSECUTIVE_RANGE_LENGTH",
    partitionModel: "ONE_ROW",
    stateModel: "GROWING_CONSECUTIVE_RANGE",
    recoveryModel: "BIDIRECTIONAL_WITH_LENGTH_RULE",
  },
  {
    authorityId: "CUMULATIVE_PREFIX_CLUSTER",
    surface: "TERM_SEQUENCE",
    widthMode: "GROWING",
    changeAxis: "APPEND_AFTER_FIXED_PREFIX",
    partitionModel: "ONE_ROW",
    stateModel: "FIXED_PREFIX_PLUS_CUMULATIVE_SUFFIX",
    recoveryModel: "BIDIRECTIONAL_WITH_ADDED_LETTER",
  },
  {
    authorityId: "SYMMETRIC_EDGE_GROWTH",
    surface: "TERM_SEQUENCE",
    widthMode: "GROWING",
    changeAxis: "BOTH_TERM_EDGES",
    partitionModel: "ONE_ROW",
    stateModel: "SYMMETRIC_EDGE_ADDITION",
    recoveryModel: "BIDIRECTIONAL_WITH_EDGE_RULE",
  },
  {
    authorityId: "K_INTERLEAVED_CLUSTER_SERIES",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "ROW_LOCAL_TERM_PROGRESS",
    partitionModel: "THREE_OR_MORE_POSITION_ROWS",
    stateModel: "K_INDEPENDENT_ROWS",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "FIXED_POSITION_PERMUTATION_CLUSTER",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "POSITION_ORDER",
    partitionModel: "ONE_ROW",
    stateModel: "GENERAL_FIXED_POSITION_PERMUTATION",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "LETTER_VALUE_TRANSFORM",
    partitionModel: "ONE_ROW",
    stateModel: "ALPHABET_COMPLEMENT_WITH_OPTIONAL_ROTATION",
    recoveryModel: "BIDIRECTIONAL",
  },
  {
    authorityId: "PATTERNED_INTERIOR_INSERTION_GROWTH",
    surface: "TERM_SEQUENCE",
    widthMode: "GROWING",
    changeAxis: "INTERIOR_TERM_LENGTH",
    partitionModel: "ONE_ROW",
    stateModel: "PATTERNED_INTERIOR_INSERTION",
    recoveryModel: "REMOVE_IDENTIFIED_INSERTED_LETTER",
  },
  {
    authorityId: "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "MARKER_POSITION_OVER_BACKGROUND",
    partitionModel: "ONE_ROW",
    stateModel: "REGENERATED_FIXED_OR_PERIODIC_FRAME",
    recoveryModel: "BIDIRECTIONAL_WITH_MARKER_STEP",
  },
  {
    authorityId: "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
    surface: "TERM_SEQUENCE",
    widthMode: "FIXED",
    changeAxis: "POSITION_STATE_CHANGE",
    partitionModel: "ONE_ROW",
    stateModel: "MOVING_SOURCE_TARGET_BOUNDARY",
    recoveryModel: "BIDIRECTIONAL_WITH_BOUNDARY_STEP",
  },
] as const;

const authorityIds = new Set<AuthorityId>([
  ...SER_CP007_CANONICAL_AUTHORITY_IDS,
  ...SER_CP007_WAVE_B_AUTHORITY_IDS,
  ...SER_CP007_WAVE_C_AUTHORITY_IDS,
  ...SER_CP007_WAVE_D_AUTHORITY_IDS,
  ...SER_CP007_WAVE_E_AUTHORITY_IDS,
]);

assert.equal(authorityIds.size, 17);
assert.equal(CONTRACTS.length, 17);
assert.deepEqual(
  CONTRACTS.map((entry) => entry.authorityId).sort(),
  [...authorityIds].sort(),
);

function contractKey(contract: AuthorityContract): string {
  return [
    contract.surface,
    contract.widthMode,
    contract.changeAxis,
    contract.partitionModel,
    contract.stateModel,
    contract.recoveryModel,
  ].join("|");
}

const contractKeys = CONTRACTS.map(contractKey);
assert.equal(new Set(contractKeys).size, 17);

let pairwiseComparisons = 0;
let unresolvedContractCollisions = 0;
for (let left = 0; left < CONTRACTS.length; left += 1) {
  for (let right = left + 1; right < CONTRACTS.length; right += 1) {
    pairwiseComparisons += 1;
    if (contractKeys[left] === contractKeys[right]) {
      unresolvedContractCollisions += 1;
    }
  }
}
assert.equal(pairwiseComparisons, 136);
assert.equal(unresolvedContractCollisions, 0);

type GenericQuestion = {
  readonly canonicalAuthorityId: AuthorityId;
  readonly taskKind: string;
  readonly permanentQlId: null;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly hiddenState?: {
    readonly canonicalTerms?: readonly string[];
  };
  readonly lifecycleLocks: Readonly<Record<string, boolean>>;
};

type TemplateProbe = {
  readonly temporaryTemplateId: string;
  readonly sourceRuleId: string;
  readonly canonicalAuthorityId: AuthorityId;
  readonly generate: (seed: number) => GenericQuestion;
};

const templateProbes: readonly TemplateProbe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007Question(template.temporaryTemplateId, seed) as GenericQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(template.temporaryTemplateId, seed) as GenericQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(template.temporaryTemplateId, seed) as GenericQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(template.temporaryTemplateId, seed) as GenericQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    sourceRuleId: template.sourceRuleId,
    canonicalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(template.temporaryTemplateId, seed) as GenericQuestion,
  })),
];

assert.equal(templateProbes.length, 140);
assert.equal(new Set(templateProbes.map((entry) => entry.temporaryTemplateId)).size, 140);

const templatesPerAuthority = new Map<AuthorityId, number>();
const sourceAuthorityMap = new Map<string, Set<AuthorityId>>();
for (const template of templateProbes) {
  templatesPerAuthority.set(
    template.canonicalAuthorityId,
    (templatesPerAuthority.get(template.canonicalAuthorityId) ?? 0) + 1,
  );
  const mapped = sourceAuthorityMap.get(template.sourceRuleId) ?? new Set<AuthorityId>();
  mapped.add(template.canonicalAuthorityId);
  sourceAuthorityMap.set(template.sourceRuleId, mapped);
}
for (const authorityId of authorityIds) {
  assert.ok((templatesPerAuthority.get(authorityId) ?? 0) > 0);
}
for (const [sourceRuleId, mappedAuthorities] of sourceAuthorityMap) {
  assert.equal(
    mappedAuthorities.size,
    1,
    `${sourceRuleId} maps to more than one canonical authority`,
  );
}

const DECLARED_COLLISIONS: readonly [string, AuthorityId][] = [
  ["UNIFORM_COLUMN_SHIFTS", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["MIXED_COLUMN_SHIFTS", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["FIXED_FRONT_DELETION", "EDGE_DELETION_WORD_SEQUENCE"],
  ["FIXED_END_DELETION", "EDGE_DELETION_WORD_SEQUENCE"],
  ["ALTERNATING_EDGE_DELETION", "EDGE_DELETION_WORD_SEQUENCE"],
  ["PAIRED_EDGE_SHIFTS", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["FIXED_OUTER_FRAME_CORE_SHIFT", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["ALTERNATING_FRAME_CORE_ROWS", "TWO_INTERLEAVED_CLUSTER_SERIES"],
  ["REPEATED_BLOCK_MULTI_GAP_GROUPS", "REPEATED_BLOCK_COMPLETION"],
  ["ALTERNATING_BLOCK_MULTI_GAP_GROUPS", "ALTERNATING_BLOCK_COMPLETION"],
  ["NEXT_TWO_COLUMNWISE_FIXED", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["NEXT_TWO_INTERLEAVED_ROWS", "TWO_INTERLEAVED_CLUSTER_SERIES"],
  ["NEXT_TWO_ROTATION", "CYCLIC_CLUSTER_PERMUTATION"],
  ["NEXT_TWO_EDGE_DELETION", "EDGE_DELETION_WORD_SEQUENCE"],
  ["MISSING_TWO_COLUMNWISE_FIXED", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["WRONG_WITH_REPLACEMENT_PAIR", "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"],
  ["NEXT_TWO_GROWING_CLUSTER", "GROWING_CONSECUTIVE_CLUSTER"],
  ["NEXT_TWO_SYMMETRIC_GROWTH", "SYMMETRIC_EDGE_GROWTH"],
  ["FOUR_INTERLEAVED_CLUSTER_ROWS", "K_INTERLEAVED_CLUSTER_SERIES"],
  ["UNIFORM_FRAME_CASE_MARKER_ROTATION", "CYCLIC_CLUSTER_PERMUTATION"],
] as const;

for (const [sourceRuleId, authorityId] of DECLARED_COLLISIONS) {
  assert.deepEqual([...sourceAuthorityMap.get(sourceRuleId) ?? []], [authorityId]);
}

const contractByAuthority = new Map(
  CONTRACTS.map((contract) => [contract.authorityId, contract] as const),
);

function observedWidthMode(question: GenericQuestion): WidthMode | null {
  if (question.taskKind === "FILL_GAPS" || question.taskKind === "FILL_GAP_GROUPS") {
    return "GAP_LINE";
  }
  const terms = question.hiddenState?.canonicalTerms;
  if (!terms || terms.length < 2) return null;
  const differences = terms.slice(0, -1).map(
    (term, index) => terms[index + 1]!.length - term.length,
  );
  if (differences.every((difference) => difference === 0)) return "FIXED";
  if (differences.every((difference) => difference > 0)) return "GROWING";
  if (differences.every((difference) => difference < 0)) return "SHRINKING";
  return null;
}

let generatedSpotProofs = 0;
let widthModeProofs = 0;
let lifecycleProofs = 0;
for (const template of templateProbes) {
  for (const seed of [1, 2, 3]) {
    const question = template.generate(seed);
    assert.deepEqual(template.generate(seed), question);
    assert.equal(question.canonicalAuthorityId, template.canonicalAuthorityId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);

    const contract = contractByAuthority.get(question.canonicalAuthorityId)!;
    const observed = observedWidthMode(question);
    assert.notEqual(observed, null, `${template.temporaryTemplateId}: no width proof`);
    assert.equal(
      observed,
      contract.widthMode,
      `${template.temporaryTemplateId}: generated width mode contradicts authority contract`,
    );
    widthModeProofs += 1;

    for (const lock of Object.values(question.lifecycleLocks)) assert.equal(lock, false);
    lifecycleProofs += 1;
    generatedSpotProofs += 1;
  }
}

assert.equal(generatedSpotProofs, 420);
assert.equal(widthModeProofs, 420);
assert.equal(lifecycleProofs, 420);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_POST_WAVE_E_17_AUTHORITY_COLLISION_MATRIX",
      authorityContracts: CONTRACTS.length,
      pairwiseAuthorityComparisons: pairwiseComparisons,
      unresolvedContractCollisions,
      temporaryTemplates: templateProbes.length,
      generatedSpotProofs,
      widthModeProofs,
      lifecycleProofs,
      declaredSourceShapeCollisions: DECLARED_COLLISIONS.length,
      ambiguousSourceRuleMappings: 0,
      permanentQls: 0,
      questionStudioVisible: 0,
      questionBankWritable: 0,
      testEligible: 0,
      publiclyPublishable: 0,
      nextAuthority: "SER_CP007_POST_WAVE_E_SOURCE_LEDGER_COMPLETION",
    },
    null,
    2,
  ),
);
