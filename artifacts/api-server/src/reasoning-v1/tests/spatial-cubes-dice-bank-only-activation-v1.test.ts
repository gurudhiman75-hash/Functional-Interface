import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-question-studio-bank-activation-v1";
import {
  generateCubesDiceQuestionStudioBankV1,
} from "../foundation/spatial/cubes-dice-question-studio-bank-runtime-v1";
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

const activation = CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
assert.equal(activation.status, "ACTIVE_INTERNAL_BANK_ONLY");
assert.equal(activation.persistenceAllowed, true);
assert.equal(activation.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(activation.questionBankWritable, true);
assert.equal(activation.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(activation.manualApprovalRequired, true);
assert.equal(activation.testEligibility, "INELIGIBLE");
assert.equal(activation.testEligible, false);
assert.equal(activation.testBuilderEligible, false);
assert.equal(activation.mockTestEligible, false);
assert.equal(activation.publiclyPublishable, false);
assert.equal(activation.publicReleaseAuthorized, false);
assert.equal(activation.automaticStudentPublication, false);

let generated = 0;
for (const qlId of QLS) {
  for (const language of LANGUAGES) {
    const question = generateCubesDiceQuestionStudioBankV1({
      seed: `cnd-bank-proof:${qlId}:${language}`,
      qlId,
      language,
    });
    generated += 1;
    assert.equal(question.version, "CND-001-QUESTION-STUDIO-BANK-QUESTION-V1");
    assert.equal(question.bankActivationAuthority, activation.authorityId);
    assert.equal(question.lifecycle.registrationStatus, "REGISTERED_BANK_ONLY_INTERNAL");
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.lifecycle.questionBankWritable, true);
    assert.equal(question.lifecycle.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(question.lifecycle.manualApprovalRequired, true);
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.testBuilderEligible, false);
    assert.equal(question.lifecycle.mockTestEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.exactSolverBacked, true);
    assert.equal(question.validation.studentSolutionV4, true);
    assert.equal(question.solution.quality.questionSpecific, true);
    assert.equal(question.solution.quality.exactCalculationOrDeductionShown, true);

    const bankOnlyPayload = {
      runtimeMode: "CANONICAL_REVIEW",
      reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
      questionBankStatus: question.lifecycle.questionBankStatus,
      questionBankWritable: question.lifecycle.questionBankWritable,
      questionBankAcceptanceMode: question.lifecycle.questionBankAcceptanceMode,
      testEligibility: question.lifecycle.testEligibility,
      testEligible: question.lifecycle.testEligible,
      publiclyPublishable: question.lifecycle.publiclyPublishable,
      automaticStudentPublication: question.lifecycle.automaticStudentPublication,
    };
    assert.equal(getGeneratedQuestionBankAcceptanceMode(bankOnlyPayload), "BANK_ONLY");
    assert.equal(getGeneratedQuestionBankEligibilityIssue(bankOnlyPayload), null);

    const fullReleasePayload = {
      ...bankOnlyPayload,
      questionBankAcceptanceMode: "FULL_RELEASE",
    };
    assert.match(
      getGeneratedQuestionBankEligibilityIssue(fullReleasePayload) ?? "",
      /testEligibility is INELIGIBLE/,
    );
  }
}

for (const language of LANGUAGES) {
  for (const voxelTaskKind of STACK_TASKS) {
    const question = generateCubesDiceQuestionStudioBankV1({
      seed: `cnd-bank-stack:${language}:${voxelTaskKind}`,
      qlId: "SPA-QL-046",
      language,
      voxelTaskKind,
    });
    assert.equal(question.taskKind, voxelTaskKind);
    assert.equal(question.lifecycle.questionBankAcceptanceMode, "BANK_ONLY");
  }
  for (const voxelTaskKind of PROJECTION_TASKS) {
    const question = generateCubesDiceQuestionStudioBankV1({
      seed: `cnd-bank-projection:${language}:${voxelTaskKind}`,
      qlId: "SPA-QL-047",
      language,
      voxelTaskKind,
    });
    assert.equal(question.taskKind, voxelTaskKind);
    assert.equal(question.lifecycle.questionBankAcceptanceMode, "BANK_ONLY");
  }
}

const routeSource = readFileSync(
  new URL("../../routes/admin-question-studio-cubes-dice.ts", import.meta.url),
  "utf8",
);
assert.match(routeSource, /content\.generation\.run/);
assert.match(routeSource, /INSERT INTO content\.generation_runs/);
assert.match(routeSource, /INSERT INTO content\.generation_run_items/);
assert.match(routeSource, /INSERT INTO content\.generation_item_versions/);
assert.match(routeSource, /encodeGeneratedSpatialSvgImage/);
assert.match(routeSource, /questionBankAcceptanceMode/);
assert.match(routeSource, /READY_FOR_STORAGE/);
assert.match(routeSource, /testEligible: false/);
assert.match(routeSource, /publiclyPublishable: false/);
assert.doesNotMatch(routeSource, /res\.status\(409\)/);

const evidence = {
  status: "PASS_CND_001_BANK_ONLY_ACTIVATION_V1",
  activationAuthority: activation.authorityId,
  permanentQlIds: [...activation.permanentQlIds],
  languages: [...activation.supportedLanguages],
  generatedCanonicalLanguageCases: generated,
  stackTaskCases: STACK_TASKS.length * LANGUAGES.length,
  projectionTaskCases: PROJECTION_TASKS.length * LANGUAGES.length,
  persistenceAllowed: activation.persistenceAllowed,
  internalReviewRunsWritable: activation.internalReviewRunsWritable,
  questionBankStatus: activation.questionBankStatus,
  questionBankWritable: activation.questionBankWritable,
  questionBankAcceptanceMode: activation.questionBankAcceptanceMode,
  manualApprovalRequired: activation.manualApprovalRequired,
  testEligibility: activation.testEligibility,
  testEligible: activation.testEligible,
  testBuilderEligible: activation.testBuilderEligible,
  mockTestEligible: activation.mockTestEligible,
  publiclyPublishable: activation.publiclyPublishable,
  publicReleaseAuthorized: activation.publicReleaseAuthorized,
  automaticStudentPublication: activation.automaticStudentPublication,
  scalarOptionFigurePersistence: "SANITIZED_SVG_DATA_IMAGE_EMBEDDED_IN_STEM",
  nextGate: activation.nextGate,
};

writeFileSync(
  new URL("./cnd-001-bank-only-activation-v1-evidence.json", import.meta.url),
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);

console.log("PASS_CND_001_BANK_ONLY_ACTIVATION_V1", evidence);
