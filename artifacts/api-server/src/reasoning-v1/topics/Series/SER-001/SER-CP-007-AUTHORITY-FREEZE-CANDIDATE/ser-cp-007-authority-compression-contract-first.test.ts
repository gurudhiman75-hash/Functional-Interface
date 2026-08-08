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
import {
  editorialTaskKindFor,
  proofModelFor,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

type OriginalAuthorityId =
  | (typeof SER_CP007_CANONICAL_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_B_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_C_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_D_AUTHORITY_IDS)[number]
  | (typeof SER_CP007_WAVE_E_AUTHORITY_IDS)[number];

type CandidateAuthorityId =
  | Exclude<
      OriginalAuthorityId,
      | "TWO_INTERLEAVED_CLUSTER_SERIES"
      | "K_INTERLEAVED_CLUSTER_SERIES"
      | "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER"
      | "GROWING_CONSECUTIVE_CLUSTER"
      | "REPEATED_BLOCK_COMPLETION"
      | "ALTERNATING_BLOCK_COMPLETION"
      | "CYCLIC_CLUSTER_PERMUTATION"
      | "FIXED_POSITION_PERMUTATION_CLUSTER"
    >
  | "INTERLEAVED_CLUSTER_SERIES"
  | "DIRECTIONAL_CONSECUTIVE_CLUSTER"
  | "PERIODIC_BLOCK_COMPLETION"
  | "POSITION_PERMUTATION_CLUSTER";

type CandidateQuestion = {
  readonly canonicalAuthorityId: OriginalAuthorityId;
  readonly taskKind: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly lifecycleLocks: Readonly<Record<string, boolean>>;
};

type TemplateProbe = {
  readonly temporaryTemplateId: string;
  readonly originalAuthorityId: OriginalAuthorityId;
  readonly generate: (seed: number) => CandidateQuestion;
};

const MERGE_MAP: Readonly<Record<OriginalAuthorityId, CandidateAuthorityId>> = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE:
    "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  ALTERNATING_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT:
    "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  CUMULATIVE_PREFIX_CLUSTER: "CUMULATIVE_PREFIX_CLUSTER",
  CYCLIC_CLUSTER_PERMUTATION: "POSITION_PERMUTATION_CLUSTER",
  EDGE_DELETION_WORD_SEQUENCE: "EDGE_DELETION_WORD_SEQUENCE",
  FIXED_POSITION_PERMUTATION_CLUSTER: "POSITION_PERMUTATION_CLUSTER",
  GROWING_CONSECUTIVE_CLUSTER: "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  K_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME:
    "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  PATTERNED_INTERIOR_INSERTION_GROWTH:
    "PATTERNED_INTERIOR_INSERTION_GROWTH",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION:
    "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  REPEATED_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  SYMMETRIC_EDGE_GROWTH: "SYMMETRIC_EDGE_GROWTH",
  TWO_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  VARIABLE_LENGTH_CONSECUTIVE_CLUSTER:
    "DIRECTIONAL_CONSECUTIVE_CLUSTER",
};

const originalAuthorityIds = new Set<OriginalAuthorityId>([
  ...SER_CP007_CANONICAL_AUTHORITY_IDS,
  ...SER_CP007_WAVE_B_AUTHORITY_IDS,
  ...SER_CP007_WAVE_C_AUTHORITY_IDS,
  ...SER_CP007_WAVE_D_AUTHORITY_IDS,
  ...SER_CP007_WAVE_E_AUTHORITY_IDS,
]);
const candidateAuthorityIds = new Set<CandidateAuthorityId>(
  [...originalAuthorityIds].map((authorityId) => MERGE_MAP[authorityId]),
);

assert.equal(originalAuthorityIds.size, 17);
assert.equal(Object.keys(MERGE_MAP).length, 17);
assert.equal(candidateAuthorityIds.size, 13);

const probes: TemplateProbe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as CandidateQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as CandidateQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as CandidateQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as CandidateQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    originalAuthorityId: template.canonicalAuthorityId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as CandidateQuestion,
  })),
];

assert.equal(probes.length, 140);
assert.equal(new Set(probes.map((probe) => probe.temporaryTemplateId)).size, 140);

const expectedMergeGroups: Readonly<Record<string, readonly OriginalAuthorityId[]>> = {
  DIRECTIONAL_CONSECUTIVE_CLUSTER: [
    "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
    "GROWING_CONSECUTIVE_CLUSTER",
  ],
  INTERLEAVED_CLUSTER_SERIES: [
    "TWO_INTERLEAVED_CLUSTER_SERIES",
    "K_INTERLEAVED_CLUSTER_SERIES",
  ],
  PERIODIC_BLOCK_COMPLETION: [
    "REPEATED_BLOCK_COMPLETION",
    "ALTERNATING_BLOCK_COMPLETION",
  ],
  POSITION_PERMUTATION_CLUSTER: [
    "CYCLIC_CLUSTER_PERMUTATION",
    "FIXED_POSITION_PERMUTATION_CLUSTER",
  ],
};

for (const [candidateAuthorityId, sourceAuthorities] of Object.entries(
  expectedMergeGroups,
)) {
  const proofModels = new Set(sourceAuthorities.map(proofModelFor));
  assert.equal(
    proofModels.size,
    1,
    `${candidateAuthorityId}: proposed merge crosses proof models`,
  );
}

const templateCounts = new Map<CandidateAuthorityId, number>();
const taskCounts = new Map<CandidateAuthorityId, Map<string, number>>();
const sourceAuthoritiesByCandidate = new Map<
  CandidateAuthorityId,
  Set<OriginalAuthorityId>
>();
let generatedSpotProofs = 0;
let lifecycleProofs = 0;
let answerProofs = 0;

for (const probe of probes) {
  const candidateAuthorityId = MERGE_MAP[probe.originalAuthorityId];
  templateCounts.set(
    candidateAuthorityId,
    (templateCounts.get(candidateAuthorityId) ?? 0) + 1,
  );
  const sourceSet =
    sourceAuthoritiesByCandidate.get(candidateAuthorityId) ??
    new Set<OriginalAuthorityId>();
  sourceSet.add(probe.originalAuthorityId);
  sourceAuthoritiesByCandidate.set(candidateAuthorityId, sourceSet);

  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    assert.equal(question.canonicalAuthorityId, probe.originalAuthorityId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    answerProofs += 1;

    const editorialTaskKind = editorialTaskKindFor(question.taskKind);
    const candidateTasks =
      taskCounts.get(candidateAuthorityId) ?? new Map<string, number>();
    candidateTasks.set(
      editorialTaskKind,
      (candidateTasks.get(editorialTaskKind) ?? 0) + 1,
    );
    taskCounts.set(candidateAuthorityId, candidateTasks);

    for (const lock of Object.values(question.lifecycleLocks)) {
      assert.equal(lock, false);
    }
    lifecycleProofs += 1;
    generatedSpotProofs += 1;
  }
}

assert.equal(generatedSpotProofs, 420);
assert.equal(answerProofs, 420);
assert.equal(lifecycleProofs, 420);
assert.equal(templateCounts.size, 13);

assert.equal(templateCounts.get("INTERLEAVED_CLUSTER_SERIES"), 17);
assert.equal(templateCounts.get("DIRECTIONAL_CONSECUTIVE_CLUSTER"), 8);
assert.equal(templateCounts.get("PERIODIC_BLOCK_COMPLETION"), 8);
assert.equal(templateCounts.get("POSITION_PERMUTATION_CLUSTER"), 17);

assert.deepEqual(
  [...sourceAuthoritiesByCandidate.get("INTERLEAVED_CLUSTER_SERIES")!].sort(),
  ["K_INTERLEAVED_CLUSTER_SERIES", "TWO_INTERLEAVED_CLUSTER_SERIES"],
);
assert.deepEqual(
  [
    ...sourceAuthoritiesByCandidate.get(
      "DIRECTIONAL_CONSECUTIVE_CLUSTER",
    )!,
  ].sort(),
  ["GROWING_CONSECUTIVE_CLUSTER", "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER"],
);
assert.deepEqual(
  [...sourceAuthoritiesByCandidate.get("PERIODIC_BLOCK_COMPLETION")!].sort(),
  ["ALTERNATING_BLOCK_COMPLETION", "REPEATED_BLOCK_COMPLETION"],
);
assert.deepEqual(
  [...sourceAuthoritiesByCandidate.get("POSITION_PERMUTATION_CLUSTER")!].sort(),
  ["CYCLIC_CLUSTER_PERMUTATION", "FIXED_POSITION_PERMUTATION_CLUSTER"],
);

for (const candidateAuthorityId of candidateAuthorityIds) {
  assert.ok(templateCounts.has(candidateAuthorityId));
  assert.ok(taskCounts.has(candidateAuthorityId));
}

const candidateSummary = Object.fromEntries(
  [...candidateAuthorityIds]
    .sort()
    .map((candidateAuthorityId) => [
      candidateAuthorityId,
      {
        sourceAuthorities: [
          ...(sourceAuthoritiesByCandidate.get(candidateAuthorityId) ?? []),
        ].sort(),
        templates: templateCounts.get(candidateAuthorityId),
        sampledTaskCounts: Object.fromEntries(
          [...(taskCounts.get(candidateAuthorityId) ?? new Map()).entries()].sort(),
        ),
        proofModels: [
          ...new Set(
            [
              ...(sourceAuthoritiesByCandidate.get(candidateAuthorityId) ?? []),
            ].map(proofModelFor),
          ),
        ],
      },
    ]),
);

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_AUTHORITY_COMPRESSION_CONTRACT_FIRST_17_TO_13",
      originalProvisionalAuthorities: originalAuthorityIds.size,
      candidateAuthorities: candidateAuthorityIds.size,
      proposedMerges: 4,
      proposedSplits: 0,
      temporaryTemplates: probes.length,
      generatedSpotProofs,
      answerProofs,
      lifecycleProofs,
      candidateSummary,
      permanentQls: 0,
      compressionDecision: "PROVISIONAL_PENDING_POLICY_AND_MANUAL_REVIEW",
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_AUTHORITY_COMPRESSION_14_VS_13_POLICY_DECISION",
    },
    null,
    2,
  ),
);
