import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";

type OriginalAuthorityId =
  | "CYCLIC_CLUSTER_PERMUTATION"
  | "FIXED_POSITION_PERMUTATION_CLUSTER";

type PermutationKind =
  | "CYCLIC_ROTATION"
  | "PAIRWISE_ADJACENT_SWAP"
  | "FULL_REVERSAL"
  | "ODD_EVEN_REORDER";

type ProvenanceClass =
  | "SERIES_SOURCE_SHAPED"
  | "SOURCE_LEDGER_COLLISION"
  | "SATURATION_ONLY_SERIES";

type LearnerRenderer =
  | "ROTATION_MOVEMENT"
  | "NEIGHBOUR_PAIR_SWAP"
  | "RIGHT_TO_LEFT_REVERSAL"
  | "ODD_THEN_EVEN_POSITIONS";

type ExamWeightClass =
  | "SOURCE_PRIMARY"
  | "SOURCE_COLLISION_SUPPORTED"
  | "SATURATION_GUARD";

type PermutationQuestion = {
  readonly questionId: string;
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: OriginalAuthorityId;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly lifecycleLocks: Readonly<Record<string, boolean>>;
  readonly hiddenState?: {
    readonly permutationOrder?: readonly number[];
    readonly rotationAmount?: number;
  };
};

type PermutationProbe = {
  readonly waveId: "WAVE_A" | "WAVE_C" | "WAVE_D" | "WAVE_E";
  readonly temporaryTemplateId: string;
  readonly originalAuthorityId: OriginalAuthorityId;
  readonly sourceRuleId: string;
  readonly generate: (seed: number) => PermutationQuestion;
};

const probes: PermutationProbe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES
    .filter(
      (template) =>
        template.canonicalAuthorityId === "CYCLIC_CLUSTER_PERMUTATION",
    )
    .map((template) => ({
      waveId: "WAVE_A" as const,
      temporaryTemplateId: template.temporaryTemplateId,
      originalAuthorityId: template.canonicalAuthorityId,
      sourceRuleId: template.sourceRuleId,
      generate: (seed: number) =>
        generateSerCp007Question(
          template.temporaryTemplateId,
          seed,
        ) as unknown as PermutationQuestion,
    })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES
    .filter(
      (template) =>
        template.canonicalAuthorityId === "CYCLIC_CLUSTER_PERMUTATION",
    )
    .map((template) => ({
      waveId: "WAVE_C" as const,
      temporaryTemplateId: template.temporaryTemplateId,
      originalAuthorityId: template.canonicalAuthorityId,
      sourceRuleId: template.sourceRuleId,
      generate: (seed: number) =>
        generateSerCp007WaveCQuestion(
          template.temporaryTemplateId,
          seed,
        ) as unknown as PermutationQuestion,
    })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES
    .filter(
      (template) =>
        template.canonicalAuthorityId ===
        "FIXED_POSITION_PERMUTATION_CLUSTER",
    )
    .map((template) => ({
      waveId: "WAVE_D" as const,
      temporaryTemplateId: template.temporaryTemplateId,
      originalAuthorityId: template.canonicalAuthorityId,
      sourceRuleId: template.sourceRuleId,
      generate: (seed: number) =>
        generateSerCp007WaveDQuestion(
          template.temporaryTemplateId,
          seed,
        ) as unknown as PermutationQuestion,
    })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES
    .filter(
      (template) =>
        template.canonicalAuthorityId === "CYCLIC_CLUSTER_PERMUTATION",
    )
    .map((template) => ({
      waveId: "WAVE_E" as const,
      temporaryTemplateId: template.temporaryTemplateId,
      originalAuthorityId: template.canonicalAuthorityId,
      sourceRuleId: template.sourceRuleId,
      generate: (seed: number) =>
        generateSerCp007WaveEQuestion(
          template.temporaryTemplateId,
          seed,
        ) as unknown as PermutationQuestion,
    })),
];

assert.equal(probes.length, 21);
assert.equal(new Set(probes.map((probe) => probe.temporaryTemplateId)).size, 21);

function permutationKindFor(sourceRuleId: string): PermutationKind {
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
      throw new Error(`Unsupported permutation source rule: ${sourceRuleId}`);
  }
}

function provenanceFor(waveId: PermutationProbe["waveId"]): ProvenanceClass {
  switch (waveId) {
    case "WAVE_A":
    case "WAVE_C":
      return "SERIES_SOURCE_SHAPED";
    case "WAVE_E":
      return "SOURCE_LEDGER_COLLISION";
    case "WAVE_D":
      return "SATURATION_ONLY_SERIES";
  }
}

function rendererFor(kind: PermutationKind): LearnerRenderer {
  switch (kind) {
    case "CYCLIC_ROTATION":
      return "ROTATION_MOVEMENT";
    case "PAIRWISE_ADJACENT_SWAP":
      return "NEIGHBOUR_PAIR_SWAP";
    case "FULL_REVERSAL":
      return "RIGHT_TO_LEFT_REVERSAL";
    case "ODD_EVEN_REORDER":
      return "ODD_THEN_EVEN_POSITIONS";
  }
}

function examWeightFor(provenance: ProvenanceClass): ExamWeightClass {
  switch (provenance) {
    case "SERIES_SOURCE_SHAPED":
      return "SOURCE_PRIMARY";
    case "SOURCE_LEDGER_COLLISION":
      return "SOURCE_COLLISION_SUPPORTED";
    case "SATURATION_ONLY_SERIES":
      return "SATURATION_GUARD";
  }
}

function jsonRoundTrip<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const subtypeCounts = new Map<PermutationKind, number>();
const provenanceCounts = new Map<ProvenanceClass, number>();
const rendererCounts = new Map<LearnerRenderer, number>();
const sourceRuleCounts = new Map<string, number>();
let generatedQuestions = 0;
let questionStudioProofs = 0;
let questionBankProofs = 0;
let analyticsProofs = 0;
let lifecycleProofs = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    assert.equal(question.temporaryTemplateId, probe.temporaryTemplateId);
    assert.equal(question.canonicalAuthorityId, probe.originalAuthorityId);
    assert.equal(question.sourceRuleId, probe.sourceRuleId);

    const permutationKind = permutationKindFor(probe.sourceRuleId);
    const provenanceClass = provenanceFor(probe.waveId);
    const learnerRenderer = rendererFor(permutationKind);
    const examWeightClass = examWeightFor(provenanceClass);

    const candidateMetadata = {
      candidateAuthorityId: "POSITION_PERMUTATION_CLUSTER" as const,
      migrationSourceAuthorityId: probe.originalAuthorityId,
      sourceRuleId: probe.sourceRuleId,
      permutationKind,
      provenanceClass,
      examWeightClass,
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
      assert.equal(examWeightClass, "SATURATION_GUARD");
      assert.ok((candidateMetadata.permutationOrder?.length ?? 0) >= 3);
    }

    const studioRecord = jsonRoundTrip({
      questionId: question.questionId,
      temporaryTemplateId: question.temporaryTemplateId,
      taskKind: question.taskKind,
      correctAnswer: question.correctAnswer,
      correctIndex: question.correctIndex,
      candidateMetadata,
    });
    assert.deepEqual(studioRecord.candidateMetadata, candidateMetadata);
    questionStudioProofs += 1;

    const bankRecord = jsonRoundTrip({
      itemVersion: 1,
      sourceQuestionId: studioRecord.questionId,
      authorityId: studioRecord.candidateMetadata.candidateAuthorityId,
      metadata: studioRecord.candidateMetadata,
    });
    assert.deepEqual(bankRecord.metadata, candidateMetadata);
    assert.equal(
      bankRecord.metadata.migrationSourceAuthorityId,
      probe.originalAuthorityId,
    );
    questionBankProofs += 1;

    const analyticsEvent = jsonRoundTrip({
      eventType: "SERIES_ITEM_GENERATED",
      authorityId: bankRecord.authorityId,
      subtype: bankRecord.metadata.permutationKind,
      sourceRuleId: bankRecord.metadata.sourceRuleId,
      provenanceClass: bankRecord.metadata.provenanceClass,
      examWeightClass: bankRecord.metadata.examWeightClass,
      learnerRenderer: bankRecord.metadata.learnerRenderer,
    });
    assert.equal(analyticsEvent.authorityId, "POSITION_PERMUTATION_CLUSTER");
    assert.equal(analyticsEvent.subtype, permutationKind);
    assert.equal(analyticsEvent.provenanceClass, provenanceClass);
    assert.equal(analyticsEvent.learnerRenderer, learnerRenderer);
    analyticsProofs += 1;

    for (const lock of Object.values(question.lifecycleLocks)) {
      assert.equal(lock, false);
    }
    lifecycleProofs += 1;

    subtypeCounts.set(permutationKind, (subtypeCounts.get(permutationKind) ?? 0) + 1);
    provenanceCounts.set(
      provenanceClass,
      (provenanceCounts.get(provenanceClass) ?? 0) + 1,
    );
    rendererCounts.set(
      learnerRenderer,
      (rendererCounts.get(learnerRenderer) ?? 0) + 1,
    );
    sourceRuleCounts.set(
      probe.sourceRuleId,
      (sourceRuleCounts.get(probe.sourceRuleId) ?? 0) + 1,
    );
    generatedQuestions += 1;
  }
}

assert.equal(generatedQuestions, 63);
assert.equal(questionStudioProofs, 63);
assert.equal(questionBankProofs, 63);
assert.equal(analyticsProofs, 63);
assert.equal(lifecycleProofs, 63);

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
assert.equal(rendererCounts.size, 4);
assert.equal(sourceRuleCounts.size, 6);

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_POSITION_PERMUTATION_SUBTYPE_METADATA_PRESERVATION",
      candidateAuthorityId: "POSITION_PERMUTATION_CLUSTER",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      generatedQuestions,
      subtypeCounts: Object.fromEntries([...subtypeCounts.entries()].sort()),
      provenanceCounts: Object.fromEntries(
        [...provenanceCounts.entries()].sort(),
      ),
      rendererCounts: Object.fromEntries([...rendererCounts.entries()].sort()),
      sourceRuleCounts: Object.fromEntries([...sourceRuleCounts.entries()].sort()),
      questionStudioProofs,
      questionBankProofs,
      analyticsProofs,
      lifecycleProofs,
      subtypePreservation: "PASS",
      permanentQls: 0,
      finalAuthorityDecision: "PENDING",
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_AUTHORITY_COMPRESSION_14_VS_13_POLICY_DECISION",
    },
    null,
    2,
  ),
);
