import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getPublicationIssues } from "../../lib/admin-question-management";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { buildCndQuestionBankPayloadV2 } from "../../routes/admin-question-studio-cubes-dice";
import { CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-question-studio-bank-activation-v1";
import { generateCubesDiceQuestionStudioBankV1 } from "../foundation/spatial/cubes-dice-question-studio-bank-runtime-v1";
import { generateCubesDiceQuestionStudioTestBuilderV1 } from "../foundation/spatial/cubes-dice-question-studio-test-builder-runtime-v1";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-test-builder-activation-v1";
import type { CubesDiceVoxelRuntimeTaskKindV2 } from "../foundation/spatial/cubes-dice-voxel-projection-runtime-v2";

const QLS = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;
const STACK_TASKS: readonly CubesDiceVoxelRuntimeTaskKindV2[] = [
  "STACK_TOTAL_CUBES",
  "STACK_EXPOSED_FACES",
  "STACK_MISSING_TO_COMPLETE_CUBOID",
];
const PROJECTION_TASKS: readonly CubesDiceVoxelRuntimeTaskKindV2[] = [
  "ORTHOGRAPHIC_TOP_CELL_COUNT",
  "ORTHOGRAPHIC_FRONT_CELL_COUNT",
  "ORTHOGRAPHIC_RIGHT_CELL_COUNT",
];

const BANK = CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
const ACTIVATION = CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1;

assert.equal(BANK.status, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(BANK.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(BANK.testEligible, false);
assert.equal(BANK.testBuilderEligible, false);
assert.equal(BANK.mockTestEligible, false);
assert.equal(BANK.publiclyPublishable, false);

assert.equal(ACTIVATION.status, "ACTIVE_INTERNAL_TEST_BUILDER");
assert.equal(ACTIVATION.sourceBankActivationAuthorityId, BANK.authorityId);
assert.equal(ACTIVATION.questionBankAcceptanceMode, "FULL_RELEASE");
assert.equal(ACTIVATION.manualApprovalRequired, true);
assert.equal(ACTIVATION.manualQuestionPublicationRequired, true);
assert.equal(ACTIVATION.testEligibility, "ELIGIBLE");
assert.equal(ACTIVATION.testEligible, true);
assert.equal(ACTIVATION.testBuilderEligible, true);
assert.equal(ACTIVATION.questionPublicationTarget, "INTERNAL_TEST_BUILDER");
assert.equal(ACTIVATION.mockTestEligible, false);
assert.equal(ACTIVATION.publiclyPublishable, true);
assert.equal(ACTIVATION.publicReleaseAuthorized, false);
assert.equal(ACTIVATION.studentDeliveryAuthorized, false);
assert.equal(ACTIVATION.automaticStudentPublication, false);

const basePublicationSnapshot = {
  status: "approved",
  approvedVersionId: "version-1",
  examVersionId: "exam-1",
  primaryTaxonomyNodeId: "topic-1",
  taxonomyNodeIds: ["topic-1"],
  stem: "Question stem",
  explanation: "Detailed explanation",
  optionCount: 4,
  correctOptionCount: 1,
};

let canonicalLanguageCases = 0;
for (const qlId of QLS) {
  for (const language of LANGUAGES) {
    const legacy = generateCubesDiceQuestionStudioBankV1({
      seed: `cnd-test-builder-legacy:${qlId}:${language}`,
      qlId,
      language,
    });
    assert.equal(legacy.lifecycle.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(legacy.lifecycle.testEligible, false);
    assert.equal(legacy.lifecycle.testBuilderEligible, false);
    assert.equal(legacy.lifecycle.publiclyPublishable, false);

    const question = generateCubesDiceQuestionStudioTestBuilderV1({
      seed: `cnd-test-builder:${qlId}:${language}`,
      qlId,
      language,
    });
    canonicalLanguageCases += 1;

    assert.equal(question.version, "CND-001-QUESTION-STUDIO-TEST-BUILDER-QUESTION-V1");
    assert.equal(question.testBuilderActivationAuthority, ACTIVATION.authorityId);
    assert.equal(question.lifecycle.registrationStatus, "REGISTERED_INTERNAL_TEST_BUILDER");
    assert.equal(question.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.lifecycle.questionBankWritable, true);
    assert.equal(question.lifecycle.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.manualQuestionPublicationRequired, true);
    assert.equal(question.lifecycle.testEligibility, "ELIGIBLE");
    assert.equal(question.lifecycle.testEligible, true);
    assert.equal(question.lifecycle.testBuilderEligible, true);
    assert.equal(question.lifecycle.mockTestEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, true);
    assert.equal(question.lifecycle.publicReleaseAuthorized, false);
    assert.equal(question.lifecycle.studentDeliveryAuthorized, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.exactSolverBacked, true);
    assert.equal(question.validation.studentSolutionV4, true);

    const payload = buildCndQuestionBankPayloadV2(question);
    assert.equal(payload.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(payload.questionBankAcceptanceAuthority, ACTIVATION.authorityId);
    assert.equal(payload.testReleaseAuthority, ACTIVATION.authorityId);
    assert.equal(payload.testEligibility, "ELIGIBLE");
    assert.equal(payload.testEligible, true);
    assert.equal(payload.testBuilderEligible, true);
    assert.equal(payload.mockTestEligible, false);
    assert.equal(payload.publiclyPublishable, true);
    assert.equal(payload.publicReleaseAuthorized, false);
    assert.equal(payload.studentDeliveryAuthorized, false);
    assert.equal(payload.automaticStudentPublication, false);
    assert.match(payload.stem, /data:image\/svg\+xml;base64,/);
    assert.equal(getGeneratedQuestionBankAcceptanceMode(payload), "FULL_RELEASE");
    assert.equal(getGeneratedQuestionBankEligibilityIssue(payload), null);
    assert.deepEqual(getGeneratedItemApprovalDisposition(payload), { mode: "question_bank", reason: null });

    const normalized = normalizeGeneratedQuestionPayload(payload, {
      itemId: `cnd-test-builder-item-${canonicalLanguageCases}`,
      generationRunCode: "CND-TEST-BUILDER-PROOF",
    });
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(generation.qlId, qlId);
    assert.equal(generation.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(generation.testEligible, true);
    assert.equal(generation.mockTestEligible, false);
    assert.equal(generation.publiclyPublishable, true);
    assert.equal(generation.automaticStudentPublication, false);
    assert.match(normalized.stem, /data:image\/svg\+xml;base64,/);

    assert.equal(getPublicationIssues({
      ...basePublicationSnapshot,
      generationTestEligible: generation.testEligible as boolean,
      generationPubliclyPublishable: generation.publiclyPublishable as boolean,
    }).length, 0);

    const legacyPublicationIssues = getPublicationIssues({
      ...basePublicationSnapshot,
      generationTestEligible: legacy.lifecycle.testEligible,
      generationPubliclyPublishable: legacy.lifecycle.publiclyPublishable,
    });
    assert.ok(legacyPublicationIssues.includes("Generation lifecycle has not enabled scored-test eligibility."));
    assert.ok(legacyPublicationIssues.includes("Generation lifecycle has not enabled public publication."));
  }
}

for (const language of LANGUAGES) {
  for (const voxelTaskKind of STACK_TASKS) {
    const question = generateCubesDiceQuestionStudioTestBuilderV1({
      seed: `cnd-test-builder-stack:${language}:${voxelTaskKind}`,
      qlId: "SPA-QL-046",
      language,
      voxelTaskKind,
    });
    assert.equal(question.taskKind, voxelTaskKind);
    assert.equal(question.lifecycle.testBuilderEligible, true);
    assert.equal(question.lifecycle.mockTestEligible, false);
  }
  for (const voxelTaskKind of PROJECTION_TASKS) {
    const question = generateCubesDiceQuestionStudioTestBuilderV1({
      seed: `cnd-test-builder-projection:${language}:${voxelTaskKind}`,
      qlId: "SPA-QL-047",
      language,
      voxelTaskKind,
    });
    assert.equal(question.taskKind, voxelTaskKind);
    assert.equal(question.lifecycle.testBuilderEligible, true);
    assert.equal(question.lifecycle.mockTestEligible, false);
  }
}

const cwd = process.cwd();
const questionPublishRoute = readFileSync(resolve(cwd, "src/routes/admin-question-lifecycle-hardening.ts"), "utf8");
const testsRoute = readFileSync(resolve(cwd, "src/routes/admin-tests.ts"), "utf8");
const cndRoute = readFileSync(resolve(cwd, "src/routes/admin-question-studio-cubes-dice.ts"), "utf8");
const seriesLib = readFileSync(resolve(cwd, "src/lib/admin-test-series.ts"), "utf8");

assert.match(questionPublishRoute, /generationTestEligible === false/);
assert.match(questionPublishRoute, /generationPubliclyPublishable === false/);
assert.match(questionPublishRoute, /status = 'published'::question_status/);
assert.match(questionPublishRoute, /published_version_id = approved_version_id/);
assert.match(testsRoute, /QUESTION_NOT_PUBLISHED/);
assert.match(testsRoute, /String\(row\.status\) !== "published"/);
assert.match(testsRoute, /String\(row\.publishedVersionId \?\? ""\) !== questionVersionId/);
assert.match(seriesLib, /\["qa_approved", "scheduled", "live", "completed"\]\.includes\(status\)/);
assert.match(seriesLib, /test\(s\) are not QA approved or released/);
assert.match(cndRoute, /REGISTERED_INTERNAL_TEST_BUILDER/);
assert.match(cndRoute, /questionBankAcceptanceMode: ACTIVATION\.questionBankAcceptanceMode/);
assert.match(cndRoute, /testBuilderEligible: true/);
assert.match(cndRoute, /mockTestEligible: false/);
assert.match(cndRoute, /studentDeliveryAuthorized: false/);
assert.match(cndRoute, /automaticStudentPublication: false/);

const evidence = {
  status: "PASS_CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_V1",
  activationAuthority: ACTIVATION.authorityId,
  sourceBankActivationAuthority: ACTIVATION.sourceBankActivationAuthorityId,
  permanentQlIds: [...ACTIVATION.permanentQlIds],
  languages: [...ACTIVATION.supportedLanguages],
  canonicalLanguageCases,
  stackTaskCases: STACK_TASKS.length * LANGUAGES.length,
  projectionTaskCases: PROJECTION_TASKS.length * LANGUAGES.length,
  questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
  manualGenerationApprovalRequired: ACTIVATION.manualApprovalRequired,
  manualQuestionPublicationRequired: ACTIVATION.manualQuestionPublicationRequired,
  testEligibility: ACTIVATION.testEligibility,
  testEligible: ACTIVATION.testEligible,
  testBuilderEligible: ACTIVATION.testBuilderEligible,
  questionPublicationTarget: ACTIVATION.questionPublicationTarget,
  mockTestEligible: ACTIVATION.mockTestEligible,
  publicReleaseAuthorized: ACTIVATION.publicReleaseAuthorized,
  studentDeliveryAuthorized: ACTIVATION.studentDeliveryAuthorized,
  automaticStudentPublication: ACTIVATION.automaticStudentPublication,
  seriesQaOrReleaseStillRequired: true,
  legacyBankOnlyRuntimePreserved: true,
  nextGate: ACTIVATION.nextGate,
};

const evidencePath = resolve(cwd, "dist/reasoning-v1/spatial/cnd-001-test-builder-activation-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

console.log("PASS_CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_V1", evidence);
