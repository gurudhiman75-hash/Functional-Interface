import assert from "node:assert/strict";
import {
  SER_CP007_CANDIDATE_13_COUNTS,
  SER_CP007_TEMPLATE_PROBES,
} from "./authority-compression-contract";
import {
  SER_CP007_AUTHORITY_CANDIDATE_V1,
  serCp007AuthorityCandidateV1Metadata,
} from "./authority-candidate-v1";

assert.equal(SER_CP007_TEMPLATE_PROBES.length, 140);
assert.equal(Object.keys(SER_CP007_CANDIDATE_13_COUNTS).length, 13);

const candidateCounts = new Map<string, number>();
const dispositionCounts = new Map<string, number>();
const proofModelCounts = new Map<string, number>();
let interleavedMetadataProofs = 0;
let directionalMetadataProofs = 0;
let periodicMetadataProofs = 0;
let permutationMetadataProofs = 0;
let studioProofs = 0;
let bankProofs = 0;
let analyticsProofs = 0;
let lifecycleProofs = 0;
let generatedQuestions = 0;

for (const probe of SER_CP007_TEMPLATE_PROBES) {
  const metadata = serCp007AuthorityCandidateV1Metadata({
    migrationSourceAuthorityId: probe.originalAuthorityId,
    discoveryWaveId: probe.waveId,
    sourceRuleId: probe.sourceRuleId,
    taskKind: probe.taskKind,
  });

  assert.equal(metadata.candidateVersion, SER_CP007_AUTHORITY_CANDIDATE_V1);
  assert.equal(metadata.migrationSourceAuthorityId, probe.originalAuthorityId);
  assert.equal(metadata.discoveryWaveId, probe.waveId);
  assert.equal(metadata.sourceRuleId, probe.sourceRuleId);
  assert.equal(metadata.permanentQlId, null);
  assert.equal(metadata.freezeApproved, false);

  candidateCounts.set(
    metadata.candidateAuthorityId,
    (candidateCounts.get(metadata.candidateAuthorityId) ?? 0) + 1,
  );
  dispositionCounts.set(
    metadata.sourceDisposition,
    (dispositionCounts.get(metadata.sourceDisposition) ?? 0) + 1,
  );
  proofModelCounts.set(
    metadata.proofModel,
    (proofModelCounts.get(metadata.proofModel) ?? 0) + 1,
  );

  if (metadata.candidateAuthorityId === "INTERLEAVED_CLUSTER_SERIES") {
    assert.ok([2, 3, 4].includes(metadata.rowCount ?? -1));
    assert.equal(metadata.learnerRenderer, "INTERLEAVED_ROW_TABLE");
    interleavedMetadataProofs += 1;
  } else {
    assert.equal(metadata.rowCount, null);
  }

  if (metadata.candidateAuthorityId === "DIRECTIONAL_CONSECUTIVE_CLUSTER") {
    assert.ok(
      metadata.lengthDeltaDirection === "GROWING" ||
        metadata.lengthDeltaDirection === "SHRINKING",
    );
    assert.equal(
      metadata.learnerRenderer,
      "CONSECUTIVE_LENGTH_AND_GAP_PROGRESS",
    );
    directionalMetadataProofs += 1;
  } else {
    assert.equal(metadata.lengthDeltaDirection, null);
  }

  if (metadata.candidateAuthorityId === "PERIODIC_BLOCK_COMPLETION") {
    assert.ok(metadata.blockCycleLength === 1 || metadata.blockCycleLength === 2);
    assert.equal(metadata.learnerRenderer, "PERIODIC_BLOCK_RECONSTRUCTION");
    periodicMetadataProofs += 1;
  } else {
    assert.equal(metadata.blockCycleLength, null);
  }

  if (metadata.candidateAuthorityId === "POSITION_PERMUTATION_CLUSTER") {
    assert.ok(metadata.permutationKind);
    assert.ok(
      [
        "ROTATION_MOVEMENT",
        "NEIGHBOUR_PAIR_SWAP",
        "RIGHT_TO_LEFT_REVERSAL",
        "ODD_THEN_EVEN_POSITIONS",
      ].includes(metadata.learnerRenderer),
    );
    permutationMetadataProofs += 1;
  } else {
    assert.equal(metadata.permutationKind, null);
  }

  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const studioRecord = JSON.parse(
      JSON.stringify({
        questionId: question.questionId,
        temporaryTemplateId: probe.temporaryTemplateId,
        taskKind: metadata.editorialTaskKind,
        correctAnswer: question.correctAnswer,
        correctIndex: question.correctIndex,
        authorityCandidate: metadata,
      }),
    ) as {
      questionId: string;
      temporaryTemplateId: string;
      taskKind: string;
      correctAnswer: string;
      correctIndex: number;
      authorityCandidate: typeof metadata;
    };
    assert.deepEqual(studioRecord.authorityCandidate, metadata);
    studioProofs += 1;

    const bankRecord = JSON.parse(
      JSON.stringify({
        itemVersion: 1,
        sourceQuestionId: studioRecord.questionId,
        authorityId: studioRecord.authorityCandidate.candidateAuthorityId,
        metadata: studioRecord.authorityCandidate,
      }),
    ) as {
      itemVersion: number;
      sourceQuestionId: string;
      authorityId: string;
      metadata: typeof metadata;
    };
    assert.equal(bankRecord.authorityId, metadata.candidateAuthorityId);
    assert.equal(
      bankRecord.metadata.migrationSourceAuthorityId,
      probe.originalAuthorityId,
    );
    assert.deepEqual(bankRecord.metadata, metadata);
    bankProofs += 1;

    const analyticsEvent = JSON.parse(
      JSON.stringify({
        eventType: "SERIES_CANDIDATE_ITEM",
        authorityId: bankRecord.authorityId,
        migrationSourceAuthorityId:
          bankRecord.metadata.migrationSourceAuthorityId,
        subtypeId: bankRecord.metadata.subtypeId,
        sourceDisposition: bankRecord.metadata.sourceDisposition,
        proofModel: bankRecord.metadata.proofModel,
        learnerRenderer: bankRecord.metadata.learnerRenderer,
      }),
    ) as {
      eventType: string;
      authorityId: string;
      migrationSourceAuthorityId: string;
      subtypeId: string;
      sourceDisposition: string;
      proofModel: string;
      learnerRenderer: string;
    };
    assert.equal(analyticsEvent.authorityId, metadata.candidateAuthorityId);
    assert.equal(
      analyticsEvent.migrationSourceAuthorityId,
      probe.originalAuthorityId,
    );
    assert.equal(analyticsEvent.subtypeId, probe.sourceRuleId);
    analyticsProofs += 1;

    for (const lock of Object.values(question.lifecycleLocks)) {
      assert.equal(lock, false);
    }
    lifecycleProofs += 1;
    generatedQuestions += 1;
  }
}

assert.deepEqual(
  Object.fromEntries([...candidateCounts.entries()].sort()),
  SER_CP007_CANDIDATE_13_COUNTS,
);
assert.equal(candidateCounts.size, 13);
assert.equal(interleavedMetadataProofs, 17);
assert.equal(directionalMetadataProofs, 8);
assert.equal(periodicMetadataProofs, 4);
assert.equal(permutationMetadataProofs, 21);
assert.deepEqual(Object.fromEntries([...dispositionCounts.entries()].sort()), {
  SATURATION_ONLY_SERIES: 28,
  SATURATION_ONLY_SERIES_COLLISION: 4,
  SOURCE_LEDGER_COLLISION: 4,
  SOURCE_LEDGER_RESOLVED: 32,
  SOURCE_SHAPED_DISCOVERY: 72,
});
assert.equal(proofModelCounts.size, 6);
assert.equal(generatedQuestions, 420);
assert.equal(studioProofs, 420);
assert.equal(bankProofs, 420);
assert.equal(analyticsProofs, 420);
assert.equal(lifecycleProofs, 420);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_AUTHORITY_CANDIDATE_V1_METADATA_REGISTRY",
      candidateVersion: SER_CP007_AUTHORITY_CANDIDATE_V1,
      candidateAuthorities: candidateCounts.size,
      temporaryTemplates: SER_CP007_TEMPLATE_PROBES.length,
      generatedQuestions,
      candidateCounts: Object.fromEntries([...candidateCounts.entries()].sort()),
      sourceDispositionCounts: Object.fromEntries(
        [...dispositionCounts.entries()].sort(),
      ),
      proofModelCounts: Object.fromEntries([...proofModelCounts.entries()].sort()),
      interleavedMetadataProofs,
      directionalMetadataProofs,
      periodicMetadataProofs,
      permutationMetadataProofs,
      studioProofs,
      bankProofs,
      analyticsProofs,
      lifecycleProofs,
      permanentQls: 0,
      freezeApproved: false,
      productionIntegration: "NOT_STARTED",
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_REAL_INTEGRATION_PROOF",
    },
    null,
    2,
  ),
);
