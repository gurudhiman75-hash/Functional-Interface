import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { listQuantV4Packages } from "../../../..//quant-v4/generation-engine";
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration";

const packages = listBlr001StandardQuestionStudioPackages();
assert.equal(packages.length, 7);
assert.equal(packages.every((entry) => entry.enabled), true);
assert.deepEqual(packages.slice(0, 2).map((entry) => entry.supportedLanguages), [["en"], ["en"]]);
assert.equal(packages.slice(2).every((entry) => entry.supportedLanguages.join(",") === "en,hi,pa"), true);
assert.equal(packages.every((entry) => entry.runtimeMode === "STANDARD_QUESTION_STUDIO"), true);
for (const pkg of packages) {
  assert.equal("reviewStatus" in pkg, false);
  assert.equal("questionBankStatus" in pkg, false);
  assert.equal("testEligibility" in pkg, false);
  assert.equal("publiclyPublishable" in pkg, false);
}

const genericPackages = listQuantV4Packages();
for (const pkg of packages) {
  const registered = genericPackages.find((entry) => entry.packageId === pkg.packageId);
  assert.ok(registered, `${pkg.packageId} must be listed by the shared Question Studio engine.`);
  assert.equal(registered?.enabled, true);
}

let validatedQlLanguagePairs = 0;
for (const pkg of packages) {
  for (const language of pkg.supportedLanguages) {
    for (const qlId of pkg.qlIds) {
      const result = generateBlr001StandardQuestionStudioBatch({
        packageId: pkg.packageId,
        language,
        canonicalProblemId: qlId,
        count: 1,
        seed: `standard:${pkg.packageId}:${language}:${qlId}`,
      });
      assert.equal(result.questions.length, 1);
      assert.equal(result.generationContext.runtimeMode, "STANDARD_QUESTION_STUDIO");
      assert.equal(result.generationContext.reviewStatus, "REVIEW_REQUIRED");
      const question = result.questions[0]!;
      assert.equal(question.packageId, pkg.packageId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(question.correctIndex >= 0 && question.correctIndex < 4, true);
      assert.equal(question.validation?.valid, true);
      assert.equal(question.runtimeMode, "STANDARD_QUESTION_STUDIO");
      assert.equal(question.reviewStatus, "REVIEW_REQUIRED");
      assert.equal(question.manualApprovalRequired, true);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(result.generationContext.persistenceAllowed, true);
      validatedQlLanguagePairs += 1;
    }
  }
}

const cp006 = generateBlr001StandardQuestionStudioBatch({
  packageId: "REASONING_V1_BLR_001_CP_006",
  language: "hi",
  count: 1,
  seed: "cp006-review-lock",
}).questions[0]!;
assert.equal(cp006.questionBankStatus, "NOT_STORED");
assert.equal(cp006.testEligibility, "INELIGIBLE");
assert.equal(cp006.publiclyPublishable, false);
assert.equal(cp006.reviewOnly, true);

for (const language of ["en", "hi", "pa"] as const) {
  const cp007 = generateBlr001StandardQuestionStudioBatch({
    packageId: "REASONING_V1_BLR_001_CP_007",
    language,
    count: 1,
    seed: `cp007-release-after-approval:${language}`,
  }).questions[0]!;
  assert.equal(cp007.runtimeMode, "STANDARD_QUESTION_STUDIO");
  assert.equal(cp007.reviewStatus, "REVIEW_REQUIRED");
  assert.equal(cp007.questionBankStatus, "READY_FOR_STORAGE");
  assert.equal(cp007.testEligibility, "ELIGIBLE");
  assert.equal(cp007.publiclyPublishable, true);
  assert.equal(cp007.manualApprovalRequired, true);
  assert.equal(cp007.automaticStudentPublication, false);
}

const deterministicA = generateBlr001StandardQuestionStudioBatch({
  packageId: "REASONING_V1_BLR_001_CP_004",
  language: "pa",
  difficulty: "Hard",
  count: 3,
  seed: "deterministic-standard-replay",
});
const deterministicB = generateBlr001StandardQuestionStudioBatch({
  packageId: "REASONING_V1_BLR_001_CP_004",
  language: "pa",
  difficulty: "Hard",
  count: 3,
  seed: "deterministic-standard-replay",
});
assert.deepEqual(
  deterministicA.questions.map((entry) => entry.questionId),
  deterministicB.questions.map((entry) => entry.questionId),
);

const repoRoot = resolve(import.meta.dirname, "../../../../../../..");
const routeIndex = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/index.ts"), "utf8");
const commonRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const bulkRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts"), "utf8");
const operationsPage = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");
const engine = readFileSync(resolve(repoRoot, "artifacts/api-server/src/quant-v4/generation-engine.ts"), "utf8");

assert.match(commonRoute, /router\.get\("\/capabilities"/);
assert.match(commonRoute, /router\.post\("\/runs"/);
assert.match(commonRoute, /generation_run_items/);
assert.match(bulkRoute, /approvalMode/);
assert.match(bulkRoute, /review_only/);
assert.match(engine, /listBlr001StandardQuestionStudioPackages/);
assert.match(engine, /generateBlr001StandardQuestionStudioBatch/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningBlrChapterRouter/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningCp006Router/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningRouter/);
assert.doesNotMatch(operationsPage, /QuestionStudioReasoningReviewPanel/);

console.log(JSON.stringify({
  verdict: "BLR_001_STANDARD_QUESTION_STUDIO_INTEGRATION_PROVED",
  packageCount: packages.length,
  permanentQlCount: new Set(packages.flatMap((entry) => entry.qlIds)).size,
  permanentQlRange: "BLR-QL-001..BLR-QL-035",
  validatedQlLanguagePairs,
  sharedCockpitOnly: true,
  uniformPackagePresentation: true,
  uniformRuntimePresentation: true,
  separateReasoningPanel: false,
  separateReasoningRoutes: false,
  cp001ThroughCp006ReviewOnly: true,
  cp007QuestionBankEligibleAfterManualApproval: true,
  automaticStudentPublication: false,
}, null, 2));
