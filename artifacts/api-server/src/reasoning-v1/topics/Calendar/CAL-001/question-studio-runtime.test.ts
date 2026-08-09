import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../quant-v4/generation-engine.ts";
import {
  assertGeneratedQuestionBankEligible,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../../../lib/admin-question-conversion.ts";
import { analyzeGeneratedQuestionPayload } from "../../../../lib/question-studio-quality.ts";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import { CAL_001_RELEASE_LOCK } from "./final-discovery-freeze.ts";
import {
  CAL_001_PACKAGE_ID,
  CAL_001_PRODUCTION_RELEASE,
  CAL_001_PRODUCTION_RELEASE_AUTHORITY,
  CAL_001_QUESTION_STUDIO_ACTIVATION,
  CAL_001_QUESTION_STUDIO_LANGUAGES,
  runCal001QuestionStudioPipeline,
  toCal001QuestionStudioPreview,
} from "./question-studio-runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertProductionReleasePayload(
  preview: ReturnType<typeof toCal001QuestionStudioPreview>,
  label: string,
  itemId: string,
) {
  assert(preview.runtimeMode === "CANONICAL_REVIEW", `${label}: runtime mode is not canonical review.`);
  assert(preview.reviewStatus === "APPROVED_EDITORIAL_CANONICAL", `${label}: editorial release status is missing.`);
  assert(preview.questionBankStatus === "READY_FOR_STORAGE", `${label}: Question Bank storage is not enabled.`);
  assert(preview.testEligibility === "ELIGIBLE", `${label}: test eligibility is not enabled.`);
  assert(preview.publiclyPublishable === true, `${label}: publication workflow eligibility is not enabled.`);
  assert(preview.mockTestEligible === true, `${label}: mock-test eligibility is not enabled.`);
  assert(preview.manualApprovalRequired === true, `${label}: manual approval gate is missing.`);
  assert(preview.automaticStudentPublication === false, `${label}: automatic student publication was enabled.`);
  assert(preview.releaseAuthority === CAL_001_PRODUCTION_RELEASE_AUTHORITY, `${label}: release authority mismatch.`);
  assert(getGeneratedQuestionBankEligibilityIssue(preview) === null, `${label}: converter still rejects the payload.`);
  assertGeneratedQuestionBankEligible(preview);

  const normalized = normalizeGeneratedQuestionPayload(preview, {
    itemId,
    generationRunCode: "CAL-001-PRODUCTION-PROOF",
  });
  const answerModel = normalized.answerModel as any;
  assert(normalized.options.length === 4, `${label}: normalized option count changed.`);
  assert(normalized.correctIndex === preview.correctIndex, `${label}: normalized answer index changed.`);
  assert(answerModel.generation.packageId === CAL_001_PACKAGE_ID, `${label}: normalized package ID changed.`);
  assert(answerModel.generation.language === preview.language, `${label}: normalized language changed.`);
}

const englishWord = /[A-Za-z]{2,}/;
let permanentPackagesChecked = 0;
let localizedParityChecks = 0;
let qualityChecks = 0;
let releaseEligibilityChecks = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 8; seedIndex++) {
    const seed = `cal-production-proof:${qlId}:${seedIndex}`;
    const english = runCal001QuestionStudioPipeline(qlId, {
      language: "en",
      seed,
    });

    assert(english.canonicalProblemId === qlId, `${qlId}: permanent identity changed.`);
    assert(english.options.length === 4, `${qlId}: expected four options.`);
    assert(new Set(english.options).size === 4, `${qlId}: duplicate option display.`);
    assert(english.options[english.correctIndex] === english.answer, `${qlId}: answer index mismatch.`);
    assert(english.validation.valid, `${qlId}: package validation failed.`);
    assert(english.parameters.questionStudioStatus === "ACTIVE", `${qlId}: Question Studio is not active.`);
    assert(english.parameters.questionBankStatus === "READY_FOR_STORAGE", `${qlId}: Question Bank release is closed.`);
    assert(english.parameters.testEligibility === "ELIGIBLE", `${qlId}: test release is closed.`);
    assert(english.parameters.publiclyPublishable === true, `${qlId}: publication workflow release is closed.`);
    assert(english.parameters.mockTestEligible === true, `${qlId}: mock-test release is closed.`);
    assert(english.parameters.manualApprovalRequired === true, `${qlId}: approval gate is missing.`);
    assert(english.parameters.automaticStudentPublication === false, `${qlId}: automatic publication opened.`);

    const englishPreview = toCal001QuestionStudioPreview(english, seed);
    const englishQuality = analyzeGeneratedQuestionPayload(englishPreview);
    assert(englishQuality.blockerCount === 0, `${qlId}: English preview has quality blockers.`);
    assertProductionReleasePayload(
      englishPreview,
      `${qlId} English seed ${seedIndex}`,
      `cal-${qlId}-en-${seedIndex}`,
    );
    qualityChecks++;
    releaseEligibilityChecks++;

    for (const language of ["hi", "pa"] as const) {
      const localized = runCal001QuestionStudioPipeline(qlId, {
        language,
        seed,
      });
      const preview = toCal001QuestionStudioPreview(localized, seed);

      assert(localized.canonicalProblemId === qlId, `${qlId} ${language}: identity changed.`);
      assert(localized.traceability.sourcePrototypeAuthority === english.traceability.sourcePrototypeAuthority, `${qlId} ${language}: source authority parity failed.`);
      assert(localized.traceability.mathematicalFingerprint === english.traceability.mathematicalFingerprint, `${qlId} ${language}: mathematical parity failed.`);
      assert(localized.correctIndex === english.correctIndex, `${qlId} ${language}: answer-index parity failed.`);
      assert(JSON.stringify(localized.parameters.facts) === JSON.stringify(english.parameters.facts), `${qlId} ${language}: semantic facts changed.`);
      assert(!englishWord.test(localized.stem), `${qlId} ${language}: English leaked into stem.`);
      assert(!englishWord.test(localized.explanation.lines.join(" ")), `${qlId} ${language}: English leaked into explanation.`);
      assert(!/[、]/.test(JSON.stringify(preview)), `${qlId} ${language}: foreign separator leaked into preview.`);

      const localizedQuality = analyzeGeneratedQuestionPayload(preview);
      assert(localizedQuality.blockerCount === 0, `${qlId} ${language}: preview has quality blockers.`);
      assertProductionReleasePayload(
        preview,
        `${qlId} ${language} seed ${seedIndex}`,
        `cal-${qlId}-${language}-${seedIndex}`,
      );

      permanentPackagesChecked++;
      localizedParityChecks += 5;
      qualityChecks++;
      releaseEligibilityChecks++;
    }
    permanentPackagesChecked++;
  }
}

const catalogPackage = listQuantV4Packages().find(
  (pkg) => pkg.packageId === CAL_001_PACKAGE_ID,
) as any;
assert(catalogPackage, "CAL-001 is missing from Question Studio capabilities.");
assert(catalogPackage.enabled === true, "CAL-001 capability is disabled.");
assert(catalogPackage.section === "Reasoning", "CAL-001 is not classified under Reasoning.");
assert(catalogPackage.subtopic === "Calendar", "CAL-001 subtopic is not Calendar.");
assert(catalogPackage.cpIds.length === 36, "CAL-001 capabilities do not expose all permanent QLs.");
assert(catalogPackage.supportedLanguages.join(",") === "en,hi,pa", "CAL-001 language capabilities are incomplete.");
assert(catalogPackage.runtimeMode === "CANONICAL_REVIEW", "CAL-001 capability is not in canonical review mode.");
assert(catalogPackage.reviewStatus === "APPROVED_EDITORIAL_CANONICAL", "CAL-001 capability is not editorially release-approved.");
assert(catalogPackage.questionBankStatus === "READY_FOR_STORAGE", "CAL-001 capability did not open approval-gated Question Bank conversion.");
assert(catalogPackage.testEligibility === "ELIGIBLE", "CAL-001 capability did not open test eligibility.");
assert(catalogPackage.publiclyPublishable === true, "CAL-001 capability did not open publication QA eligibility.");
assert(catalogPackage.mockTestEligible === true, "CAL-001 capability did not open mock-test eligibility.");
assert(catalogPackage.manualApprovalRequired === true, "CAL-001 capability removed manual approval.");
assert(catalogPackage.automaticStudentPublication === false, "CAL-001 capability enabled automatic student publication.");

const mixedBatch = await generateQuestion({
  packageId: CAL_001_PACKAGE_ID,
  count: 36,
  language: "hi",
  seed: "cal-production-mixed-batch",
});
assert(mixedBatch.questions.length === 36, "Mixed Calendar batch size mismatch.");
assert(mixedBatch.questionPackages.length === 36, "Mixed Calendar package count mismatch.");
assert(new Set(mixedBatch.questions.map((question: any) => question.canonicalProblemId)).size === 36, "Mixed Calendar batch did not cover all 36 permanent QLs.");
assert(mixedBatch.questions.every((question: any) => question.section === "Reasoning"), "Calendar preview section is not Reasoning.");
assert(mixedBatch.questions.every((question: any) => question.generationBackend === "reasoning-v1"), "Calendar preview backend is not reasoning-v1.");
assert(mixedBatch.questions.every((question: any) => question.questionBankStatus === "READY_FOR_STORAGE"), "Mixed batch is not Question Bank ready after approval.");
assert(mixedBatch.questions.every((question: any) => question.testEligibility === "ELIGIBLE"), "Mixed batch is not test eligible after approval.");
assert(mixedBatch.questions.every((question: any) => question.publiclyPublishable === true), "Mixed batch is not publication-QA eligible after approval.");
assert(mixedBatch.questions.every((question: any) => question.mockTestEligible === true), "Mixed batch is not mock-test eligible after approval.");
assert(mixedBatch.questions.every((question: any) => question.manualApprovalRequired === true), "Mixed batch bypassed manual approval.");
assert(mixedBatch.questions.every((question: any) => question.automaticStudentPublication === false), "Mixed batch enabled automatic student publication.");
assert(mixedBatch.generationContext.runtimeMode === "CANONICAL_REVIEW", "Mixed batch runtime mode mismatch.");
assert(mixedBatch.generationContext.releaseAuthority === CAL_001_PRODUCTION_RELEASE_AUTHORITY, "Mixed batch release authority mismatch.");

const explicitRegeneration = await generateQuestion({
  packageId: CAL_001_PACKAGE_ID,
  canonicalProblemId: "CAL-QL-036",
  count: 1,
  language: "pa",
  difficulty: "Easy",
  seed: "cal-production-regeneration",
});
assert(explicitRegeneration.questions.length === 1, "Explicit Calendar regeneration returned wrong count.");
assert(explicitRegeneration.questions[0]?.canonicalProblemId === "CAL-QL-036", "Explicit Calendar QL selection failed.");
assert(explicitRegeneration.questions[0]?.language === "pa", "Explicit Calendar language selection failed.");
assert(explicitRegeneration.questions[0]?.questionBankStatus === "READY_FOR_STORAGE", "Regeneration is not approval-gated Question Bank ready.");
assert(explicitRegeneration.questions[0]?.manualApprovalRequired === true, "Regeneration bypassed manual approval.");
assert(explicitRegeneration.questions[0]?.automaticStudentPublication === false, "Regeneration enabled automatic publication.");

assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionStudioVisible, "Current Calendar Question Studio activation is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionStudioGeneratable, "Calendar generation is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.reviewAndRevisionEnabled, "Calendar review/revision is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.regenerationEnabled, "Calendar regeneration is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.persistenceEnabled, "Calendar generation persistence is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionBankStatus === "READY_FOR_STORAGE", "Calendar Question Bank release is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.testEligibility === "ELIGIBLE", "Calendar test release is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.publiclyPublishable === true, "Calendar publication-QA release is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.mockTestEligible === true, "Calendar mock-test release is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.manualApprovalRequired === true, "Calendar manual approval gate is missing.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.automaticStudentPublication === false, "Calendar automatic publication was enabled.");
assert(CAL_001_PRODUCTION_RELEASE.authority === CAL_001_PRODUCTION_RELEASE_AUTHORITY, "Calendar release authority changed.");

// Historical freeze snapshots remain immutable evidence. The newer release authority
// supersedes those delivery locks without rewriting the earlier audit record.
assert(CAL_001_RELEASE_LOCK.questionStudioAllowed === false, "Historical multilingual freeze snapshot was mutated.");
assert(CAL_001_RELEASE_LOCK.questionBankWriteAllowed === false, "Historical Question Bank lock was mutated.");
assert(CAL_001_RELEASE_LOCK.mockTestAllowed === false, "Historical mock-test lock was mutated.");
assert(CAL_001_RELEASE_LOCK.publicPublicationAllowed === false, "Historical publication lock was mutated.");

console.log(JSON.stringify({
  status: "PASS_CAL_001_PRODUCTION_LIFECYCLE",
  packageId: CAL_001_PACKAGE_ID,
  releaseAuthority: CAL_001_PRODUCTION_RELEASE_AUTHORITY,
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  languages: CAL_001_QUESTION_STUDIO_LANGUAGES,
  permanentPackagesChecked,
  localizedParityChecks,
  qualityChecks,
  releaseEligibilityChecks,
  mixedBatchQuestions: mixedBatch.questions.length,
  explicitRegenerationQl: explicitRegeneration.questions[0]?.canonicalProblemId,
  questionStudioVisible: true,
  questionStudioGeneratable: true,
  persistenceEnabled: true,
  reviewAndRevisionEnabled: true,
  regenerationEnabled: true,
  questionBankStatus: "READY_FOR_STORAGE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
  mockTestEligible: true,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
}, null, 2));
