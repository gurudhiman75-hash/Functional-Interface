import assert from "node:assert/strict";
import {
  SER_CP007_CANDIDATE_13_COUNTS,
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_COUNTS,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
  type SerCp007DiscoveryAuthorityId,
} from "./authority-compression-contract";
import {
  editorialTaskKindFor,
  proofModelFor,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

assert.equal(SER_CP007_DISCOVERY_AUTHORITY_IDS.length, 17);
assert.equal(new Set(SER_CP007_DISCOVERY_AUTHORITY_IDS).size, 17);
assert.equal(SER_CP007_TEMPLATE_PROBES.length, 140);
assert.equal(
  new Set(SER_CP007_TEMPLATE_PROBES.map((probe) => probe.temporaryTemplateId))
    .size,
  140,
);
assert.equal(Object.keys(SER_CP007_CANDIDATE_14_COUNTS).length, 14);
assert.equal(Object.keys(SER_CP007_CANDIDATE_13_COUNTS).length, 13);

assert.equal(
  Object.values(SER_CP007_CANDIDATE_14_COUNTS).reduce(
    (sum, count) => sum + count,
    0,
  ),
  140,
);
assert.equal(
  Object.values(SER_CP007_CANDIDATE_13_COUNTS).reduce(
    (sum, count) => sum + count,
    0,
  ),
  140,
);

assert.equal(SER_CP007_CANDIDATE_14_COUNTS.INTERLEAVED_CLUSTER_SERIES, 17);
assert.equal(
  SER_CP007_CANDIDATE_14_COUNTS.DIRECTIONAL_CONSECUTIVE_CLUSTER,
  8,
);
assert.equal(SER_CP007_CANDIDATE_14_COUNTS.PERIODIC_BLOCK_COMPLETION, 4);
assert.equal(SER_CP007_CANDIDATE_13_COUNTS.INTERLEAVED_CLUSTER_SERIES, 17);
assert.equal(
  SER_CP007_CANDIDATE_13_COUNTS.DIRECTIONAL_CONSECUTIVE_CLUSTER,
  8,
);
assert.equal(SER_CP007_CANDIDATE_13_COUNTS.PERIODIC_BLOCK_COMPLETION, 4);
assert.equal(SER_CP007_CANDIDATE_13_COUNTS.POSITION_PERMUTATION_CLUSTER, 21);

const mergeGroups14: Readonly<Record<string, readonly SerCp007DiscoveryAuthorityId[]>> = {
  INTERLEAVED_CLUSTER_SERIES: [
    "TWO_INTERLEAVED_CLUSTER_SERIES",
    "K_INTERLEAVED_CLUSTER_SERIES",
  ],
  DIRECTIONAL_CONSECUTIVE_CLUSTER: [
    "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER",
    "GROWING_CONSECUTIVE_CLUSTER",
  ],
  PERIODIC_BLOCK_COMPLETION: [
    "REPEATED_BLOCK_COMPLETION",
    "ALTERNATING_BLOCK_COMPLETION",
  ],
};
const mergeGroups13 = {
  ...mergeGroups14,
  POSITION_PERMUTATION_CLUSTER: [
    "CYCLIC_CLUSTER_PERMUTATION",
    "FIXED_POSITION_PERMUTATION_CLUSTER",
  ] as const,
};

for (const [candidateAuthorityId, sourceAuthorities] of Object.entries(
  mergeGroups13,
)) {
  const proofModels = new Set(sourceAuthorities.map(proofModelFor));
  assert.equal(
    proofModels.size,
    1,
    `${candidateAuthorityId}: merge crosses learner proof models`,
  );
}

const discoveryTemplateCounts = new Map<SerCp007DiscoveryAuthorityId, number>();
const taskCounts = new Map<string, number>();
const candidate14TaskCounts = new Map<string, number>();
const candidate13TaskCounts = new Map<string, number>();
let generatedSpotProofs = 0;
let answerProofs = 0;
let lifecycleProofs = 0;

for (const probe of SER_CP007_TEMPLATE_PROBES) {
  discoveryTemplateCounts.set(
    probe.originalAuthorityId,
    (discoveryTemplateCounts.get(probe.originalAuthorityId) ?? 0) + 1,
  );
  const editorialTaskKind = editorialTaskKindFor(probe.taskKind);
  taskCounts.set(editorialTaskKind, (taskCounts.get(editorialTaskKind) ?? 0) + 1);

  const candidate14 = SER_CP007_CANDIDATE_14_MAP[probe.originalAuthorityId];
  const candidate13 = SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId];
  candidate14TaskCounts.set(
    `${candidate14}:${editorialTaskKind}`,
    (candidate14TaskCounts.get(`${candidate14}:${editorialTaskKind}`) ?? 0) + 1,
  );
  candidate13TaskCounts.set(
    `${candidate13}:${editorialTaskKind}`,
    (candidate13TaskCounts.get(`${candidate13}:${editorialTaskKind}`) ?? 0) + 1,
  );

  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    assert.equal(question.temporaryTemplateId, probe.temporaryTemplateId);
    assert.equal(question.canonicalAuthorityId, probe.originalAuthorityId);
    assert.equal(question.sourceRuleId, probe.sourceRuleId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    answerProofs += 1;

    for (const lock of Object.values(question.lifecycleLocks)) {
      assert.equal(lock, false);
    }
    lifecycleProofs += 1;
    generatedSpotProofs += 1;
  }
}

assert.equal(discoveryTemplateCounts.size, 17);
assert.equal(generatedSpotProofs, 420);
assert.equal(answerProofs, 420);
assert.equal(lifecycleProofs, 420);
assert.equal(
  [...candidate14TaskCounts.values()].reduce((sum, count) => sum + count, 0),
  140,
);
assert.equal(
  [...candidate13TaskCounts.values()].reduce((sum, count) => sum + count, 0),
  140,
);

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    FILL_GAPS: 2,
    FILL_GAP_GROUPS: 2,
    MISSING_TERM: 33,
    MISSING_TWO_TERMS: 1,
    NEXT_TERM: 33,
    NEXT_TWO_TERMS: 6,
    PREVIOUS_TERM: 29,
    REPLACE_WRONG_TERM: 33,
    WRONG_AND_REPLACEMENT: 1,
  },
);

function permutationKindFor(sourceRuleId: string): string | null {
  switch (sourceRuleId) {
    case "CYCLIC_CLUSTER_ROTATION":
    case "NEXT_TWO_ROTATION":
    case "UNIFORM_FRAME_CASE_MARKER_ROTATION":
      return "CYCLIC_ROTATION";
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return "PAIRWISE_ADJACENT_SWAP";
    case "FULL_REVERSAL_PERMUTATION":
      return "FULL_REVERSAL";
    case "ODD_EVEN_POSITION_REORDERING":
      return "ODD_EVEN_REORDER";
    default:
      return null;
  }
}

function provenanceFor(waveId: string): string {
  if (waveId === "WAVE_D") return "SATURATION_ONLY_SERIES";
  if (waveId === "WAVE_E") return "SOURCE_LEDGER_COLLISION";
  return "SERIES_SOURCE_SHAPED";
}

function rendererFor(permutationKind: string): string {
  switch (permutationKind) {
    case "CYCLIC_ROTATION":
      return "ROTATION_MOVEMENT";
    case "PAIRWISE_ADJACENT_SWAP":
      return "NEIGHBOUR_PAIR_SWAP";
    case "FULL_REVERSAL":
      return "RIGHT_TO_LEFT_REVERSAL";
    case "ODD_EVEN_REORDER":
      return "ODD_THEN_EVEN_POSITIONS";
    default:
      throw new Error(`Unknown permutation kind ${permutationKind}`);
  }
}

const permutationProbes = SER_CP007_TEMPLATE_PROBES.filter(
  (probe) =>
    SER_CP007_CANDIDATE_13_MAP[probe.originalAuthorityId] ===
    "POSITION_PERMUTATION_CLUSTER",
);
assert.equal(permutationProbes.length, 21);

const subtypeCounts = new Map<string, number>();
const provenanceCounts = new Map<string, number>();
let studioProofs = 0;
let bankProofs = 0;
let analyticsProofs = 0;

for (const probe of permutationProbes) {
  const permutationKind = permutationKindFor(probe.sourceRuleId);
  assert.ok(permutationKind);
  const provenanceClass = provenanceFor(probe.waveId);
  const learnerRenderer = rendererFor(permutationKind!);

  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const metadata = {
      candidateAuthorityId: "POSITION_PERMUTATION_CLUSTER" as const,
      migrationSourceAuthorityId: probe.originalAuthorityId,
      sourceRuleId: probe.sourceRuleId,
      permutationKind,
      provenanceClass,
      learnerRenderer,
      permutationOrder:
        question.hiddenState?.permutationOrder === undefined
          ? null
          : [...question.hiddenState.permutationOrder],
      rotationAmount: question.hiddenState?.rotationAmount ?? null,
    };

    if (permutationKind === "CYCLIC_ROTATION") {
      assert.equal(learnerRenderer, "ROTATION_MOVEMENT");
      assert.notEqual(provenanceClass, "SATURATION_ONLY_SERIES");
    } else {
      assert.equal(provenanceClass, "SATURATION_ONLY_SERIES");
      assert.ok((metadata.permutationOrder?.length ?? 0) >= 3);
    }

    const studioRecord = JSON.parse(
      JSON.stringify({ questionId: question.questionId, metadata }),
    ) as { questionId: string; metadata: typeof metadata };
    assert.deepEqual(studioRecord.metadata, metadata);
    studioProofs += 1;

    const bankRecord = JSON.parse(
      JSON.stringify({
        authorityId: metadata.candidateAuthorityId,
        metadata: studioRecord.metadata,
      }),
    ) as { authorityId: string; metadata: typeof metadata };
    assert.deepEqual(bankRecord.metadata, metadata);
    bankProofs += 1;

    const analyticsEvent = JSON.parse(
      JSON.stringify({
        authorityId: bankRecord.authorityId,
        subtype: bankRecord.metadata.permutationKind,
        provenance: bankRecord.metadata.provenanceClass,
        renderer: bankRecord.metadata.learnerRenderer,
      }),
    ) as {
      authorityId: string;
      subtype: string;
      provenance: string;
      renderer: string;
    };
    assert.equal(analyticsEvent.authorityId, "POSITION_PERMUTATION_CLUSTER");
    assert.equal(analyticsEvent.subtype, permutationKind);
    assert.equal(analyticsEvent.provenance, provenanceClass);
    assert.equal(analyticsEvent.renderer, learnerRenderer);
    analyticsProofs += 1;

    subtypeCounts.set(
      permutationKind!,
      (subtypeCounts.get(permutationKind!) ?? 0) + 1,
    );
    provenanceCounts.set(
      provenanceClass,
      (provenanceCounts.get(provenanceClass) ?? 0) + 1,
    );
  }
}

assert.equal(studioProofs, 63);
assert.equal(bankProofs, 63);
assert.equal(analyticsProofs, 63);
assert.deepEqual(Object.fromEntries([...subtypeCounts.entries()].sort()), {
  CYCLIC_ROTATION: 27,
  FULL_REVERSAL: 12,
  ODD_EVEN_REORDER: 12,
  PAIRWISE_ADJACENT_SWAP: 12,
});
assert.deepEqual(Object.fromEntries([...provenanceCounts.entries()].sort()), {
  SATURATION_ONLY_SERIES: 36,
  SERIES_SOURCE_SHAPED: 15,
  SOURCE_LEDGER_COLLISION: 12,
});

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_AUTHORITY_COMPRESSION_CANDIDATES_17_TO_14_AND_13",
      discoveryAuthorities: 17,
      temporaryTemplates: 140,
      generatedSpotProofs,
      answerProofs,
      lifecycleProofs,
      conservativeCandidate: {
        authorities: 14,
        proposedMerges: 3,
        templateCounts: SER_CP007_CANDIDATE_14_COUNTS,
      },
      contractFirstCandidate: {
        authorities: 13,
        proposedMerges: 4,
        templateCounts: SER_CP007_CANDIDATE_13_COUNTS,
      },
      positionPermutationSubtypeProof: {
        templates: permutationProbes.length,
        sampledQuestions: 63,
        subtypeCounts: Object.fromEntries([...subtypeCounts.entries()].sort()),
        provenanceCounts: Object.fromEntries(
          [...provenanceCounts.entries()].sort(),
        ),
        studioProofs,
        bankProofs,
        analyticsProofs,
      },
      recommendation: "13_WITH_14_METADATA_FAILURE_FALLBACK",
      policyApproval: "PENDING_MANUAL_DECISION",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      nextAuthority:
        "SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF",
    },
    null,
    2,
  ),
);
