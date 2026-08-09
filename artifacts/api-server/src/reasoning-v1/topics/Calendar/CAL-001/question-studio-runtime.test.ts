import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../quant-v4/generation-engine.ts";
import { analyzeGeneratedQuestionPayload } from "../../../../lib/question-studio-quality.ts";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import { CAL_001_RELEASE_LOCK } from "./final-discovery-freeze.ts";
import {
  CAL_001_PACKAGE_ID,
  CAL_001_QUESTION_STUDIO_ACTIVATION,
  CAL_001_QUESTION_STUDIO_LANGUAGES,
  runCal001QuestionStudioPipeline,
  toCal001QuestionStudioPreview,
} from "./question-studio-runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const englishWord = /[A-Za-z]{2,}/;
let permanentPackagesChecked = 0;
let localizedParityChecks = 0;
let qualityChecks = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (let seedIndex = 0; seedIndex < 8; seedIndex++) {
    const seed = `cal-question-studio-proof:${qlId}:${seedIndex}`;
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
    assert(english.parameters.questionBankStatus === "NOT_STORED", `${qlId}: Question Bank gate opened.`);
    assert(english.parameters.testEligibility === "INELIGIBLE", `${qlId}: test gate opened.`);
    assert(english.parameters.publiclyPublishable === false, `${qlId}: publication gate opened.`);

    const englishPreview = toCal001QuestionStudioPreview(english, seed);
    const englishQuality = analyzeGeneratedQuestionPayload(englishPreview);
    assert(englishQuality.blockerCount === 0, `${qlId}: English preview has quality blockers.`);
    assert(englishPreview.questionBankStatus === "NOT_STORED", `${qlId}: English preview became bank-writable.`);
    assert(englishPreview.testEligibility === "INELIGIBLE", `${qlId}: English preview became test-eligible.`);
    assert(englishPreview.publiclyPublishable === false, `${qlId}: English preview became publishable.`);
    qualityChecks++;

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
      assert(preview.questionBankStatus === "NOT_STORED", `${qlId} ${language}: preview became bank-writable.`);
      assert(preview.testEligibility === "INELIGIBLE", `${qlId} ${language}: preview became test-eligible.`);
      assert(preview.publiclyPublishable === false, `${qlId} ${language}: preview became publishable.`);

      permanentPackagesChecked++;
      localizedParityChecks += 5;
      qualityChecks++;
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
assert(catalogPackage.questionBankStatus === "NOT_STORED", "CAL-001 capability opened Question Bank writes.");
assert(catalogPackage.testEligibility === "INELIGIBLE", "CAL-001 capability opened test eligibility.");
assert(catalogPackage.publiclyPublishable === false, "CAL-001 capability opened publication.");

const mixedBatch = await generateQuestion({
  packageId: CAL_001_PACKAGE_ID,
  count: 36,
  language: "hi",
  seed: "cal-question-studio-mixed-batch",
});
assert(mixedBatch.questions.length === 36, "Mixed Calendar batch size mismatch.");
assert(mixedBatch.questionPackages.length === 36, "Mixed Calendar package count mismatch.");
assert(new Set(mixedBatch.questions.map((question: any) => question.canonicalProblemId)).size === 36, "Mixed Calendar batch did not cover all 36 permanent QLs.");
assert(mixedBatch.questions.every((question: any) => question.section === "Reasoning"), "Calendar preview section is not Reasoning.");
assert(mixedBatch.questions.every((question: any) => question.generationBackend === "reasoning-v1"), "Calendar preview backend is not reasoning-v1.");
assert(mixedBatch.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"), "Mixed batch opened Question Bank writes.");
assert(mixedBatch.questions.every((question: any) => question.testEligibility === "INELIGIBLE"), "Mixed batch opened test eligibility.");
assert(mixedBatch.questions.every((question: any) => question.publiclyPublishable === false), "Mixed batch opened publication.");

const explicitRegeneration = await generateQuestion({
  packageId: CAL_001_PACKAGE_ID,
  canonicalProblemId: "CAL-QL-036",
  count: 1,
  language: "pa",
  difficulty: "Easy",
  seed: "cal-question-studio-regeneration",
});
assert(explicitRegeneration.questions.length === 1, "Explicit Calendar regeneration returned wrong count.");
assert(explicitRegeneration.questions[0]?.canonicalProblemId === "CAL-QL-036", "Explicit Calendar QL selection failed.");
assert(explicitRegeneration.questions[0]?.language === "pa", "Explicit Calendar language selection failed.");
assert(explicitRegeneration.questions[0]?.questionBankStatus === "NOT_STORED", "Regeneration opened Question Bank writes.");

assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionStudioVisible, "Current Calendar Question Studio activation is closed.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionStudioGeneratable, "Calendar generation is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.reviewAndRevisionEnabled, "Calendar review/revision is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.regenerationEnabled, "Calendar regeneration is disabled.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.questionBankStatus === "NOT_STORED", "Calendar Question Bank gate opened.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.testEligibility === "INELIGIBLE", "Calendar test gate opened.");
assert(CAL_001_QUESTION_STUDIO_ACTIVATION.publiclyPublishable === false, "Calendar publication gate opened.");

assert(CAL_001_RELEASE_LOCK.questionStudioAllowed === false, "Historical multilingual freeze snapshot was mutated.");
assert(CAL_001_RELEASE_LOCK.questionBankWriteAllowed === false, "Historical Question Bank lock was mutated.");
assert(CAL_001_RELEASE_LOCK.mockTestAllowed === false, "Historical mock-test lock was mutated.");
assert(CAL_001_RELEASE_LOCK.publicPublicationAllowed === false, "Historical publication lock was mutated.");

console.log(JSON.stringify({
  status: "PASS_CAL_001_QUESTION_STUDIO_INTEGRATION",
  packageId: CAL_001_PACKAGE_ID,
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  languages: CAL_001_QUESTION_STUDIO_LANGUAGES,
  permanentPackagesChecked,
  localizedParityChecks,
  qualityChecks,
  mixedBatchQuestions: mixedBatch.questions.length,
  explicitRegenerationQl: explicitRegeneration.questions[0]?.canonicalProblemId,
  questionStudioVisible: true,
  questionStudioGeneratable: true,
  reviewAndRevisionEnabled: true,
  regenerationEnabled: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
