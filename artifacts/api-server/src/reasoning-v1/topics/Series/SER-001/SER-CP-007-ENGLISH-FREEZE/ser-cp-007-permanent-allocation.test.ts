import assert from "node:assert/strict";
import {
  SER_CP007_AUTHORITY_CANDIDATE_V1_IDS,
  serCp007AuthorityCandidateV1Metadata,
  type SerCp007DiscoveryWaveId,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-candidate-v1";
import {
  SER_CP007_TEMPLATE_PROBES_V71,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";
import { buildAdaptiveSerCp007ReviewV71Final } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review-v7-1-final";
import {
  selectSerCp007PrimaryReleaseV71,
  type SerCp007ReleaseEntryV71,
} from "../SER-CP-007-ENGLISH-REMODEL/student-release-selection-v7-1";
import {
  SER_CP007_PERMANENT_QL_IDS,
  SER_PERMANENT_QL_REGISTRY,
  SER_PERMANENT_QL_REGISTRY_STATE,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  SER_CP007_ENGLISH_FREEZE_STATE,
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
} from "./ser-cp-007-english-freeze-authority";
import {
  generateSerCp007PermanentEnglishPackage,
  generateSerCp007PermanentEnglishSweep,
  regenerateSerCp007PermanentEnglishPackage,
} from "./ser-cp-007-permanent-runtime";

function discoveryWaveId(waveId: string): SerCp007DiscoveryWaveId {
  switch (waveId) {
    case "WAVE_A":
      return "SER-CP-007-WAVE-A";
    case "WAVE_B":
      return "SER-CP-007-WAVE-B";
    case "WAVE_C":
      return "SER-CP-007-WAVE-C";
    case "WAVE_D":
      return "SER-CP-007-WAVE-D";
    case "WAVE_E":
      return "SER-CP-007-WAVE-E";
    default:
      throw new Error(`Unknown discovery wave ${waveId}.`);
  }
}

assert.deepEqual(SER_CP007_PERMANENT_QL_IDS, [
  "SER-QL-001",
  "SER-QL-002",
  "SER-QL-003",
  "SER-QL-004",
  "SER-QL-005",
  "SER-QL-006",
  "SER-QL-007",
  "SER-QL-008",
  "SER-QL-009",
  "SER-QL-010",
  "SER-QL-011",
  "SER-QL-012",
  "SER-QL-013",
]);
assert.equal(new Set(SER_CP007_PERMANENT_QL_IDS).size, 13);
assert.equal(SER_PERMANENT_QL_REGISTRY.length, 13);
assert.equal(SER_CP007_AUTHORITY_CANDIDATE_V1_IDS.length, 13);
assert.equal(SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length, 140);
assert.equal(
  new Set(
    SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.map(
      (entry) => entry.temporaryTemplateId,
    ),
  ).size,
  140,
);
assert.equal(
  SER_PERMANENT_QL_REGISTRY.reduce(
    (total, entry) => total + entry.templateCount,
    0,
  ),
  140,
);
assert.equal(SER_PERMANENT_QL_REGISTRY_STATE.registryVersion, 3);
assert.equal(SER_PERMANENT_QL_REGISTRY_STATE.multilingualFrozenQlCount, 13);
assert.equal(SER_PERMANENT_QL_REGISTRY_STATE.nextAvailableId, "SER-QL-014");
assert.equal(SER_CP007_ENGLISH_FREEZE_STATE.approvalDate, "2026-08-07");

const expectedTemplateCounts = Object.fromEntries(
  SER_PERMANENT_QL_REGISTRY.map((entry) => [
    entry.permanentQlId,
    entry.templateCount,
  ]),
);
const actualTemplateCounts = new Map<string, number>();
let historicalEvidenceMutationFailures = 0;
for (const frozen of SER_CP007_FROZEN_TEMPLATE_AUTHORITIES) {
  actualTemplateCounts.set(
    frozen.permanentQlId,
    (actualTemplateCounts.get(frozen.permanentQlId) ?? 0) + 1,
  );
  const historical = serCp007AuthorityCandidateV1Metadata({
    migrationSourceAuthorityId: frozen.migrationSourceAuthorityId,
    discoveryWaveId: frozen.discoveryWaveId,
    sourceRuleId: frozen.sourceRuleId,
  });
  if (historical.permanentQlId !== null || historical.freezeApproved !== false) {
    historicalEvidenceMutationFailures += 1;
  }
  assert.equal(frozen.freezeApproved, true);
  assert.equal(frozen.englishStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(frozen.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(frozen.active, false);
  assert.equal(frozen.questionStudioDiscoverable, false);
  assert.equal(frozen.questionBankWritable, false);
  assert.equal(frozen.testEligible, false);
  assert.equal(frozen.publiclyPublishable, false);
}
assert.equal(historicalEvidenceMutationFailures, 0);
assert.deepEqual(
  Object.fromEntries([...actualTemplateCounts.entries()].sort()),
  Object.fromEntries(Object.entries(expectedTemplateCounts).sort()),
);

for (const entry of SER_PERMANENT_QL_REGISTRY) {
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.englishStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(entry.allocationApproval, "PRODUCT_OWNER_APPROVED_2026_08_07");
  assert.equal(
    entry.localizationStatus,
    "MULTILINGUAL_MANUAL_FREEZE_APPROVED",
  );
  assert.equal(
    entry.localizationApproval,
    "PRODUCT_OWNER_APPROVED_2026_08_08",
  );
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}

const sweep = generateSerCp007PermanentEnglishSweep(10);
assert.equal(sweep.length, 1_400);
let deterministicRegenerationProofs = 0;
let optionContractProofs = 0;
let explanationContractProofs = 0;
let lifecycleLockProofs = 0;
const reachedPermanentQls = new Set<string>();
const reachedDifficulties = new Set<string>();
const reachedAnswerPositions = new Set<number>();

for (const permanent of sweep) {
  reachedPermanentQls.add(permanent.permanentQlId);
  reachedDifficulties.add(permanent.review.difficulty);
  reachedAnswerPositions.add(permanent.question.correctIndex);
  const regenerated = regenerateSerCp007PermanentEnglishPackage({
    temporaryTemplateId: permanent.temporaryTemplateId,
    seed: permanent.seed,
    subtypeId: permanent.frozenTemplateAuthority.subtypeId,
    learnerRenderer: permanent.frozenTemplateAuthority.learnerRenderer,
  });
  assert.deepEqual(regenerated.question, permanent.question);
  assert.deepEqual(regenerated.review, permanent.review);
  deterministicRegenerationProofs += 1;

  assert.equal(permanent.question.options.length, 4);
  assert.equal(new Set(permanent.question.options).size, 4);
  assert.equal(
    permanent.question.options[permanent.question.correctIndex],
    permanent.question.correctAnswer,
  );
  optionContractProofs += 1;

  assert.match(permanent.review.conciseReview, /\*\*Answer:\*\*/);
  assert.match(permanent.review.conciseReview, /### Explanation/);
  assert.ok(permanent.review.workedSteps.length > 0);
  explanationContractProofs += 1;

  assert.equal(permanent.lifecycle.active, false);
  assert.equal(permanent.lifecycle.questionStudioDiscoverable, false);
  assert.equal(permanent.lifecycle.questionBankWritable, false);
  assert.equal(permanent.lifecycle.testEligible, false);
  assert.equal(permanent.lifecycle.publiclyPublishable, false);
  lifecycleLockProofs += 1;
}

assert.equal(reachedPermanentQls.size, 13);
assert.deepEqual([...reachedDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...reachedAnswerPositions].sort(), [0, 1, 2, 3]);

const releaseEntries: SerCp007ReleaseEntryV71[] = [];
for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
  const frozen = SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.find(
    (entry) => entry.temporaryTemplateId === probe.temporaryTemplateId,
  );
  assert.ok(frozen);
  assert.equal(
    frozen.discoveryWaveId,
    discoveryWaveId(probe.waveId),
  );
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    releaseEntries.push({
      question,
      review: buildAdaptiveSerCp007ReviewV71Final(question),
    });
  }
}
assert.equal(releaseEntries.length, 420);
const selection = selectSerCp007PrimaryReleaseV71(releaseEntries);
assert.equal(selection.primary.length, 135);
assert.equal(selection.standardPrimary.length, 96);
assert.equal(selection.advancedPrimary.length, 39);
assert.deepEqual(selection.standardAnswerPositionCounts, [24, 24, 24, 24]);
assert.deepEqual(selection.advancedAnswerPositionCounts, [10, 10, 10, 9]);
assert.equal(
  new Set(
    selection.primary.map((entry) => entry.review.studentReleasePoolKey),
  ).size,
  135,
);
const primaryPermanentQls = new Set(
  selection.primary.map(
    (entry) =>
      generateSerCp007PermanentEnglishPackage(
        entry.question.temporaryTemplateId,
        entry.question.seed,
      ).permanentQlId,
  ),
);
assert.equal(primaryPermanentQls.size, 13);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ENGLISH_FREEZE_AND_PERMANENT_ALLOCATION",
      approvalDate: "2026-08-07",
      multilingualApprovalDate: "2026-08-08",
      permanentQlRange: SER_PERMANENT_QL_REGISTRY_STATE.allocatedRange,
      nextAvailablePermanentQlId: SER_PERMANENT_QL_REGISTRY_STATE.nextAvailableId,
      permanentQlsAllocatedInactive: SER_PERMANENT_QL_REGISTRY.length,
      multilingualFrozenQls:
        SER_PERMANENT_QL_REGISTRY_STATE.multilingualFrozenQlCount,
      frozenPrototypeTemplates: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
      frozenLearnerReleasePools: selection.primary.length,
      standardPrimaryCandidates: selection.standardPrimary.length,
      advancedPrimaryCandidates: selection.advancedPrimary.length,
      standardAnswerPositionCounts: selection.standardAnswerPositionCounts,
      advancedAnswerPositionCounts: selection.advancedAnswerPositionCounts,
      runtimePackages: sweep.length,
      deterministicRegenerationProofs,
      optionContractProofs,
      explanationContractProofs,
      lifecycleLockProofs,
      historicalEvidenceMutationFailures,
      reachedPermanentQls: reachedPermanentQls.size,
      reachedDifficulties: [...reachedDifficulties].sort(),
      reachedAnswerPositions: [...reachedAnswerPositions].sort(),
      localizationStatus: "MULTILINGUAL_MANUAL_FREEZE_APPROVED",
      lifecycle: {
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
      nextAuthority:
        "SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_AUDIT",
    },
    null,
    2,
  ),
);
