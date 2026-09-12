import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../../../../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../../../../../lib/admin-question-studio-approval-policy";
import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  generateInt001ChapterAdminQuestionStudioBatch,
} from "./int-001-chapter-question-studio-admin-adapter-v1";
import {
  INT_001_PROPOSED_BANK_ONLY_ACCEPTANCE_AUTHORITY,
  INT_001_QUESTION_BANK_READINESS_AUTHORITY,
  INT_001_QUESTION_BANK_READINESS_V1,
  buildInt001BankOnlyReadinessProbe,
} from "./int-001-question-bank-readiness-v1";

const authority = INT_001_QUESTION_BANK_READINESS_V1;
const livePackage = INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE;

assert.equal(authority.status, "READINESS_CERTIFICATION_ONLY");
assert.equal(authority.activationAuthorized, false);
assert.equal(authority.enablesQuestionBankWrites, false);
assert.equal(authority.enablesTests, false);
assert.equal(authority.enablesMocks, false);
assert.equal(authority.enablesPublication, false);
assert.equal(livePackage.permanentQlCount, 133);
assert.equal(livePackage.questionBankStatus, "NOT_STORED");
assert.equal(livePackage.questionBankWritable, false);
assert.equal(livePackage.testEligible, false);
assert.equal(livePackage.mockTestEligible, false);
assert.equal(livePackage.publiclyPublishable, false);
assert.equal(livePackage.automaticStudentPublication, false);

const SEEDS_PER_SURFACE = 2;
let generated = 0;
let liveReviewOnlyChecks = 0;
let liveBankRejectionChecks = 0;
let candidateBankEligibilityChecks = 0;
let candidateNormalizationChecks = 0;
let downstreamLockChecks = 0;
let answerParityChecks = 0;
let explanationParityChecks = 0;
const reached = new Set<string>();
const normalizedFingerprints = new Set<string>();

for (const checkpoint of livePackage.checkpoints) {
  for (const qlId of checkpoint.qlIds) {
    for (const language of INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES) {
      for (let seedIndex = 0; seedIndex < SEEDS_PER_SURFACE; seedIndex += 1) {
        const seed = `INT-001-QB-READINESS-V1:${checkpoint.checkpointId}:${qlId}:${language}:${seedIndex}`;
        const result = await generateInt001ChapterAdminQuestionStudioBatch({
          checkpointId: checkpoint.checkpointId,
          qlId,
          language,
          seed,
          count: 1,
        });
        assert.equal(result.questions.length, 1);
        const question = result.questions[0]!;
        generated += 1;
        reached.add(`${qlId}|${language}`);

        // Live Interest must remain review-only on this checkpoint.
        const liveDisposition = getGeneratedItemApprovalDisposition(question);
        assert.equal(liveDisposition.mode, "review_only", `${qlId}/${language}: live payload unexpectedly routes to Question Bank.`);
        assert.match(String(liveDisposition.reason), /disables Question Bank storage/u);
        liveReviewOnlyChecks += 2;
        const liveIssue = getGeneratedQuestionBankEligibilityIssue(question);
        assert.equal(liveIssue, "questionBankStatus is NOT_STORED", `${qlId}/${language}: live Question Bank rejection changed.`);
        liveBankRejectionChecks += 1;

        // Probe the exact future BANK_ONLY envelope without mutating the live runtime.
        const candidate = buildInt001BankOnlyReadinessProbe(question);
        const candidateDisposition = getGeneratedItemApprovalDisposition(candidate);
        assert.equal(candidateDisposition.mode, "question_bank", `${qlId}/${language}: BANK_ONLY probe would not enter the converter.`);
        assert.equal(candidateDisposition.reason, null);
        assert.equal(getGeneratedQuestionBankEligibilityIssue(candidate), null, `${qlId}/${language}: BANK_ONLY probe is not converter-eligible.`);
        candidateBankEligibilityChecks += 3;

        const normalized = normalizeGeneratedQuestionPayload(candidate, {
          itemId: `readiness-${qlId}-${language}-${seedIndex}`,
          generationRunCode: `INT-QB-READINESS-${seedIndex}`,
        });
        assert.equal(normalized.stem, question.stem);
        assert.deepEqual(normalized.options, [...question.options]);
        assert.equal(normalized.correctIndex, question.correctIndex);
        assert.equal(normalized.explanation, question.explanationLines.join("\n"));
        candidateNormalizationChecks += 4;

        const generation = (normalized.answerModel.generation ?? {}) as Record<string, unknown>;
        assert.equal(generation.packageId, "INT-001");
        assert.equal(generation.qlId, qlId);
        assert.equal(generation.language, language);
        assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
        assert.equal(generation.questionBankWritable, true);
        assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
        assert.equal(generation.questionBankAcceptanceAuthority, INT_001_PROPOSED_BANK_ONLY_ACCEPTANCE_AUTHORITY);
        assert.equal(generation.testEligibility, "INELIGIBLE");
        assert.equal(generation.testEligible, false);
        assert.equal(generation.mockTestEligible, false);
        assert.equal(generation.publiclyPublishable, false);
        assert.equal(generation.automaticStudentPublication, false);
        downstreamLockChecks += 12;

        assert.equal(normalized.answerModel.correctIndex, question.correctIndex);
        assert.equal(normalized.answerModel.correctOptionKey, String.fromCharCode(65 + question.correctIndex));
        assert.equal(normalized.answerModel.canonicalAnswer, question.answer);
        answerParityChecks += 3;
        assert.ok(normalized.explanation.length > 0);
        assert.ok(/\d/u.test(normalized.explanation));
        explanationParityChecks += 2;

        const fingerprint = JSON.stringify({
          qlId,
          language,
          seedIndex,
          stem: normalized.stem,
          options: normalized.options,
          correctIndex: normalized.correctIndex,
          canonicalAnswer: normalized.answerModel.canonicalAnswer,
        });
        assert.equal(normalizedFingerprints.has(fingerprint), false, `${qlId}/${language}: duplicate readiness normalization fingerprint.`);
        normalizedFingerprints.add(fingerprint);
      }
    }
  }
}

assert.equal(reached.size, 399);
assert.equal(generated, 399 * SEEDS_PER_SURFACE);
assert.equal(normalizedFingerprints.size, generated);

// Pin the real manual approval/conversion/publication safety chain used by the app.
const repoRoot = process.cwd();
const bulkRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts"), "utf8");
const conversion = readFileSync(resolve(repoRoot, "artifacts/api-server/src/lib/admin-question-conversion.ts"), "utf8");
const lifecycleRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-lifecycle-hardening.ts"), "utf8");
const registry = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-registry.ts"), "utf8");

assert.ok(bulkRoute.includes("getGeneratedItemApprovalDisposition(item.payload)"));
assert.ok(bulkRoute.includes('disposition.mode === "question_bank"'));
assert.ok(bulkRoute.includes("convertApprovedGenerationItem("));
assert.ok(bulkRoute.includes('approvalMode === "review_only"'));
assert.ok(conversion.includes('if (acceptanceMode === "BANK_ONLY") return null'));
assert.ok(conversion.includes('questionBankAcceptanceAuthority'));
assert.ok(conversion.includes('testEligible: lifecycleValue(payload, generationContext, "testEligible")'));
assert.ok(conversion.includes('publiclyPublishable: lifecycleValue(payload, generationContext, "publiclyPublishable")'));
assert.ok(lifecycleRoute.includes("question.generationTestEligible === false"));
assert.ok(lifecycleRoute.includes("question.generationPubliclyPublishable === false"));
const hardeningIndex = registry.indexOf("router.use(adminQuestionStudioBulkHardeningRouter)");
const legacyIndex = registry.indexOf("router.use(adminQuestionStudioRouter)");
assert.ok(hardeningIndex >= 0 && legacyIndex > hardeningIndex, "Bulk approval hardening must precede the legacy Question Studio router.");

console.log("PASS_INT_001_QUESTION_BANK_READINESS_V1_AUDIT", JSON.stringify({
  authorityId: INT_001_QUESTION_BANK_READINESS_AUTHORITY,
  status: authority.status,
  activationAuthorized: authority.activationAuthorized,
  permanentQlCount: livePackage.permanentQlCount,
  qlLanguageSurfaceCount: reached.size,
  seedsPerSurface: SEEDS_PER_SURFACE,
  generated,
  liveReviewOnlyChecks,
  liveBankRejectionChecks,
  candidateBankEligibilityChecks,
  candidateNormalizationChecks,
  downstreamLockChecks,
  answerParityChecks,
  explanationParityChecks,
  normalizedFingerprints: normalizedFingerprints.size,
  proposedAcceptanceMode: authority.proposedBankOnlyLifecycle.questionBankAcceptanceMode,
  proposedAcceptanceAuthority: authority.proposedBankOnlyLifecycle.questionBankAcceptanceAuthority,
  liveQuestionBankWritable: livePackage.questionBankWritable,
  readinessEnablesQuestionBankWrites: authority.enablesQuestionBankWrites,
  testEligibleAfterProposedBankAcceptance: authority.proposedBankOnlyLifecycle.testEligible,
  mockTestEligibleAfterProposedBankAcceptance: authority.proposedBankOnlyLifecycle.mockTestEligible,
  publiclyPublishableAfterProposedBankAcceptance: authority.proposedBankOnlyLifecycle.publiclyPublishable,
  automaticStudentPublicationAfterProposedBankAcceptance: authority.proposedBankOnlyLifecycle.automaticStudentPublication,
  nextGate: authority.nextGate,
}, null, 2));
