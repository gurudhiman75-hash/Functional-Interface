import assert from "node:assert/strict";
import {
  listProbabilityNativeReviewCatalog,
  previewProbabilityNativeReview,
  PROBABILITY_NATIVE_REVIEW_AUTHORITY,
  PROBABILITY_NATIVE_REVIEW_PACKAGE,
} from "./native-review-adapter";
import {
  assertProbabilityNativeFreezeReady,
  assertProbabilityNativeStudentDeliveryAllowed,
  getProbabilityNativeFreezeSummary,
} from "./native-review-freeze";
import { buildProbabilityMultilingualManifest } from "./multilingual-foundation";
import { auditProbabilityNativeText } from "./native-language-primitives";

function normalizeVisible(value: string): string {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

const NATIVE_MACHINE_STEM = /(?:पहले यह करें|इन चरणों का पालन करें|सबसे पहले निकालें|ਪਹਿਲਾਂ ਇਹ ਕਰੋ|ਇਹ ਕਦਮ ਅਪਣਾਓ|ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੱਢੋ)/u;
const HINDI_FORBIDDEN_EDITORIAL = /(?:पुनःस्थापन|प्रतिदर्श समष्टि|चुने गए गेंदें|उसके नीला होने|अज्ञात राशि)/u;
const PUNJABI_FORBIDDEN_EDITORIAL = /(?:ਪੁਨਰਸਥਾਪਨ|ਨਮੂਨਾ-ਅਵਕਾਸ|ਚੁਣੀਆਂ ਗੇਂਦਾਂ|ਉਸ ਦੇ ਨੀਲਾ ਹੋਣ|ਅਗਿਆਤ ਰਕਮ)/u;

function assertNativeContextConsistency(stem: string, explanation: string, language: "hi" | "pa", qlId: string) {
  const families = language === "hi"
    ? [
        ["कंच", /कंच/u],
        ["पेन", /पेन/u],
        ["रंगीन पत्थर", /रंगीन पत्थ/u],
        ["गेंद", /गेंद/u],
        ["समिति", /समिति/u],
        ["अभ्यर्थ", /अभ्यर्थ/u],
      ] as const
    : [
        ["ਕੰਚ", /ਕੰਚ/u],
        ["ਪੈਨ", /ਪੈਨ/u],
        ["ਰੰਗੀਨ ਪੱਥਰ", /ਰੰਗੀਨ ਪੱਥ/u],
        ["ਗੇਂਦ", /ਗੇਂਦ/u],
        ["ਕਮੇਟੀ", /ਕਮੇਟੀ/u],
        ["ਉਮੀਦਵਾਰ", /ਉਮੀਦਵਾਰ/u],
      ] as const;
  for (const [label, pattern] of families) {
    if (pattern.test(stem)) {
      assert.equal(pattern.test(explanation), true, `${qlId}/${language}: ${label} scenario drifted between stem and explanation`);
    }
  }
}

const catalog = listProbabilityNativeReviewCatalog();
assert.equal(catalog.length, 216);
assert.equal(new Set(catalog.map((entry) => `${entry.packageId}:${entry.qlId}`)).size, 216);
assert.equal(catalog.filter((entry) => entry.packageId === "PRB-001").length, 120);
assert.equal(catalog.filter((entry) => entry.packageId === "PRB-002").length, 96);

assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.permanentQlCount, 216);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.nativeReviewSurfaceCount, 432);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.lifecycleStage, "REVIEW_ONLY");
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.reviewSurfaceRequired, true);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.manualApprovalRequired, true);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.testEligible, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.releaseFreezeStatus, "PENDING_HUMAN_REVIEW");

let reviewedSurfaceCount = 0;
const reviewIds = new Set<string>();
const normalizedStemAnswerByLanguage = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
let nativeExplanationWordTotal = 0;
let nativeExplanationLineTotal = 0;
for (const entry of catalog) {
  for (const language of ["hi", "pa"] as const) {
    const result = previewProbabilityNativeReview({
      language,
      packageId: entry.packageId,
      qlId: entry.qlId,
      count: 1,
      seed: `ml06-review:${entry.packageId}:${entry.qlId}:${language}`,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;
    reviewedSurfaceCount += 1;
    reviewIds.add(question.questionId);

    assert.equal(question.packageId, entry.packageId);
    assert.equal(question.qlId, entry.qlId);
    assert.equal(question.language, language);
    assert.equal(question.reviewStatus, "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW");
    assert.equal(question.integrationAuthority, PROBABILITY_NATIVE_REVIEW_AUTHORITY);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.releaseFreezeStatus, "PENDING_HUMAN_REVIEW");
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.sourceEnglishValid, true);
    assert.equal(question.validation.nativePresentationValid, true);
    assert.equal(question.validation.optionByteParity, true);
    assert.equal(question.validation.correctIndexParity, true);
    assert.equal(question.validation.answerParity, true);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert(question.stem.length > 0);
    assert(question.explanation.steps.length >= 4, `${entry.qlId}/${language}: native explanation is too shallow`);
    assert.equal(NATIVE_MACHINE_STEM.test(question.stem), false, `${entry.qlId}/${language}: instruction-style machine stem survived`);
    const learnerText = [question.stem, ...question.explanation.steps].join("\n");
    const audit = auditProbabilityNativeText(learnerText, language);
    assert.equal(audit.valid, true, `${entry.qlId}/${language}: final learner surface failed native language audit`);
    if (language === "hi") {
      assert.equal(HINDI_FORBIDDEN_EDITORIAL.test(learnerText), false, `${entry.qlId}/hi: known unnatural editorial phrase survived`);
    } else {
      assert.equal(PUNJABI_FORBIDDEN_EDITORIAL.test(learnerText), false, `${entry.qlId}/pa: known unnatural editorial phrase survived`);
    }
    const explanationText = question.explanation.steps.join(" ");
    assertNativeContextConsistency(question.stem, explanationText, language, entry.qlId);
    const visibleKey = `${normalizeVisible(question.stem)}::${question.answer}`;
    assert.equal(normalizedStemAnswerByLanguage[language].has(visibleKey), false, `${entry.qlId}/${language}: duplicate visible native question`);
    normalizedStemAnswerByLanguage[language].add(visibleKey);
    nativeExplanationWordTotal += explanationText.trim().split(/\s+/u).filter(Boolean).length;
    nativeExplanationLineTotal += question.explanation.steps.length;
    assert.equal(question.traceability.answerKeyAuthority, "ENGLISH_RUNTIME");
    assert.equal(question.traceability.solverAuthority, "ENGLISH_RUNTIME");
    assert.equal(question.traceability.mockPolicyAuthority, "ENGLISH_RUNTIME");
  }
}

assert.equal(reviewedSurfaceCount, 432);
assert.equal(reviewIds.size, 432);
assert.equal(normalizedStemAnswerByLanguage.hi.size, 216);
assert.equal(normalizedStemAnswerByLanguage.pa.size, 216);
assert.ok(nativeExplanationWordTotal / 432 >= 35, "Native explanation average is below 35 words.");
assert.ok(nativeExplanationLineTotal / 432 >= 4, "Native explanation structure is too shallow.");

const deterministicA = previewProbabilityNativeReview({ language: "hi", count: 5, seed: "ml06-determinism" });
const deterministicB = previewProbabilityNativeReview({ language: "hi", count: 5, seed: "ml06-determinism" });
assert.deepEqual(
  deterministicA.questions.map((question) => [question.qlId, question.questionId, question.stem, question.options, question.correctIndex]),
  deterministicB.questions.map((question) => [question.qlId, question.questionId, question.stem, question.options, question.correctIndex]),
);

const manifest = buildProbabilityMultilingualManifest();
for (const language of ["hi", "pa"] as const) {
  const rows = manifest.filter((entry) => entry.language === language);
  assert.equal(rows.length, 216);
  assert(rows.every((entry) => entry.localizationStatus === "PENDING_NATIVE_EDITORIAL"));
  assert(rows.every((entry) => entry.questionStudioEnabled === false));
  assert(rows.every((entry) => entry.publiclyPublishable === false));
}

const freeze = getProbabilityNativeFreezeSummary();
assert.equal(freeze.requiredDecisionCount, 432);
assert.equal(freeze.recordedDecisionCount, 0);
assert.equal(freeze.approvedDecisionCount, 0);
assert.equal(freeze.hindiApprovedCount, 0);
assert.equal(freeze.punjabiApprovedCount, 0);
assert.equal(freeze.freezeReady, false);
assert.equal(freeze.status, "PENDING_HUMAN_REVIEW");
assert.throws(() => assertProbabilityNativeFreezeReady(), /0\/432 explicit human approvals/);
assert.throws(() => assertProbabilityNativeStudentDeliveryAllowed(), /student delivery remains disabled/);

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "ML-06-REVIEW-READY",
  permanentQlCount: 216,
  nativeReviewSurfaceCount: reviewedSurfaceCount,
  hindiReviewSurfaceCount: 216,
  punjabiReviewSurfaceCount: 216,
  recordedHumanDecisionCount: freeze.recordedDecisionCount,
  nativeAverageExplanationWords: Number((nativeExplanationWordTotal / 432).toFixed(1)),
  nativeAverageExplanationLines: Number((nativeExplanationLineTotal / 432).toFixed(1)),
  nativeQuestionBankWritable: false,
  nativeTestEligible: false,
  nativePubliclyPublishable: false,
}, null, 2));
