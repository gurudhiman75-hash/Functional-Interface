import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-english-freeze-v1";
import { FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-hi-pa-localization-freeze-v1";
import { generateFigureCompletionLocalizedQuestionV1 } from "../foundation/spatial/figure-completion-localization-v1-remediated";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const freeze = FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1;

assert(freeze.status === "HI_PA_LOCALIZATION_FROZEN", "FGC localization freeze status drifted.");
assert(freeze.permanentQlRange === "SPA-QL-031..SPA-QL-034", "FGC localization freeze QL range drifted.");
assert(freeze.permanentQlCount === 4, "FGC localization freeze must cover four permanent QLs.");
assert(JSON.stringify(freeze.supportedLanguages) === JSON.stringify(["en", "hi", "pa"]), "FGC supported language list drifted.");
assert(JSON.stringify(freeze.locales) === JSON.stringify(["en-IN", "hi-IN", "pa-IN"]), "FGC locale list drifted.");
assert(freeze.englishFreezeAuthorityId === FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId, "FGC localization freeze must extend the frozen English authority.");

assert(freeze.exactReviewedAuthority.headSha === "3f8a6763c271587905dd7fec13ef365de471c0ed", "FGC localization reviewed head drifted.");
assert(freeze.exactReviewedAuthority.workflowRunId === 32010900018, "FGC localization workflow run drifted.");
assert(freeze.exactReviewedAuthority.artifactId === 9281720797, "FGC localization artifact drifted.");
assert(freeze.exactReviewedAuthority.artifactDigest === "sha256:388a4fd770bea9eab0c31538a112a31fbdcaf075a9770d84fbdbd174f2b1f9b5", "FGC localization artifact digest drifted.");
assert(freeze.exactReviewedAuthority.localizedParityQuestions === 192, "FGC localization parity proof count drifted.");
assert(freeze.exactReviewedAuthority.retainedLearnerReviewQuestions === 48, "FGC localization retained review count drifted.");
assert(freeze.exactReviewedAuthority.approximateMobileOptionPixels === 104, "FGC localization mobile review size drifted.");
assert(freeze.exactReviewedAuthority.reviewVerdict === "APPROVED_SIMPLE_HI_PA_NO_REMAINING_LEARNER_BLOCKER", "FGC localization requires clean simple-language review.");

for (const [name, value] of Object.entries(freeze.invariants)) {
  assert(value === true, `FGC localization invariant ${name} must remain true.`);
}
assert(freeze.simpleLanguageStandard.hindiLabels.join("|") === "क्या देखें|नियम|कैसे लगाएँ|जाँच", "FGC Hindi explanation labels drifted.");
assert(freeze.simpleLanguageStandard.punjabiLabels.join("|") === "ਕੀ ਵੇਖਣਾ|ਨਿਯਮ|ਕਿਵੇਂ ਲਗਾਉਣਾ|ਜਾਂਚ", "FGC Punjabi explanation labels drifted.");
assert(freeze.simpleLanguageStandard.formalTechnicalHindiRejected, "FGC formal Hindi rejection guarantee missing.");
assert(freeze.simpleLanguageStandard.formalTechnicalPunjabiRejected, "FGC formal Punjabi rejection guarantee missing.");
assert(freeze.simpleLanguageStandard.technicalEnglishLeakageRejected, "FGC technical English leakage rejection guarantee missing.");
assert(freeze.simpleLanguageStandard.p05EqualSpacingMadeExplicit, "FGC P05 localization remediation guarantee missing.");
assert(freeze.simpleLanguageStandard.p07FigureFlipWordingMadeDirect, "FGC P07 localization remediation guarantee missing.");
assert(freeze.simpleLanguageStandard.p10CornerWordingSimplified, "FGC P10 localization remediation guarantee missing.");
assert(freeze.simpleLanguageStandard.learnerFacingQlTitlesSimplified, "FGC localized QL title simplification guarantee missing.");

const paritySeeds = [
  ["SPA-QL-031", "FGC-FREEZE-PARITY-031"],
  ["SPA-QL-032", "FGC-FREEZE-PARITY-032"],
  ["SPA-QL-033", "FGC-FREEZE-PARITY-033"],
  ["SPA-QL-034", "FGC-FREEZE-PARITY-034"],
] as const;
for (const [qlId, seed] of paritySeeds) {
  const en = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: 2, language: "en" });
  const hi = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: 2, language: "hi" });
  const pa = generateFigureCompletionLocalizedQuestionV1({ qlId, seed, desiredCorrectOptionIndex: 2, language: "pa" });
  for (const localized of [hi, pa]) {
    assert(JSON.stringify(localized.stimulusScenes) === JSON.stringify(en.stimulusScenes), `${qlId}: frozen localization geometry drifted.`);
    assert(JSON.stringify(localized.optionScenes) === JSON.stringify(en.optionScenes), `${qlId}: frozen localization options drifted.`);
    assert(localized.correctOptionIndex === en.correctOptionIndex && localized.answer === en.answer, `${qlId}: frozen localization answer drifted.`);
    assert(localized.questionId === en.questionId && localized.canonicalItemId === en.canonicalItemId && localized.questionLanguageId === en.questionLanguageId, `${qlId}: frozen localization IDs drifted.`);
    assert(localized.contentFingerprint === en.contentFingerprint && localized.deliveryFingerprint === en.deliveryFingerprint && localized.sourceQuestionFingerprint === en.sourceQuestionFingerprint, `${qlId}: frozen localization fingerprints drifted.`);
  }
}

assert(freeze.lifecycle.englishFrozen, "FGC English must remain frozen at multilingual freeze.");
assert(freeze.lifecycle.hindiPunjabiGeneration && freeze.lifecycle.localizationFrozen, "FGC HI/PA must be enabled and frozen at this gate.");
assert(!freeze.lifecycle.questionStudioDiscoverable, "FGC Question Studio must remain off until standard integration.");
assert(freeze.lifecycle.questionStudioRegistrationStatus === "NOT_REGISTERED", "FGC must remain unregistered until standard integration.");
assert(!freeze.lifecycle.persistenceAllowed && !freeze.lifecycle.questionBankWritable, "FGC persistence/QB writes must remain off until standard integration.");
assert(!freeze.lifecycle.testEligible && !freeze.lifecycle.publiclyPublishable, "FGC tests/publication must remain off until standard integration.");
assert(!freeze.lifecycle.automaticStudentPublication, "FGC automatic publication must remain off.");
assert(freeze.nextGate === "FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION", "FGC next gate must be standard Question Studio integration.");

console.log(JSON.stringify({
  status: "PASS_FGC_001_HI_PA_LOCALIZATION_FREEZE_V1",
  authorityId: freeze.authorityId,
  exactReviewedAuthority: freeze.exactReviewedAuthority,
  supportedLanguages: freeze.supportedLanguages,
  lifecycle: freeze.lifecycle,
  nextGate: freeze.nextGate,
}, null, 2));
