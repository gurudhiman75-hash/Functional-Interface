import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generatePfcPermanentEnglishCorpusV1,
  generatePfcPermanentEnglishQlV1,
  renderPfcPermanentEnglishReviewHtmlV1,
} from "../foundation/spatial/paper-folding-permanent-english-runtime-v1";
import {
  pfcDiscoveryOptionIsReadableV1,
} from "../foundation/spatial/paper-folding-discovery-v1";
import { renderPfcDiscoveryStimulusSvgV3 } from "../foundation/spatial/paper-folding-discovery-presentation-v3";

const qlIds = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const;
const corpus = generatePfcPermanentEnglishCorpusV1();
assert.equal(corpus.length, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.totalQuestions, 320);
assert.equal(PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.questionsPerQl, 80);

const permanentIds = new Set<string>();
const canonicalIds = new Set<string>();
const semanticFingerprints = new Set<string>();
const deliveryFingerprints = new Set<string>();
const sourceDiscoveryIds = new Set<string>();

for (const qlId of qlIds) {
  const questions = generatePfcPermanentEnglishQlV1(qlId);
  assert.equal(questions.length, 80, `${qlId} must contain 80 questions`);
  const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
  const representationCounts = new Map<string, number>();

  for (const question of questions) {
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.options.length, 4);
    assert.ok(question.stem.includes("folded in the arrow direction"));
    assert.ok(question.explanation.includes(`option ${question.correctOptionId}`));
    assert.ok(!/\(\d+(?:\.\d+)?,\s*\d/.test(question.explanation));
    assert.ok(renderPfcDiscoveryStimulusSvgV3(question, 520).includes("marker-end="));
    assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
    assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");
    assert.ok(question.options.every(pfcDiscoveryOptionIsReadableV1));

    answerCounts[question.correctOptionId] += 1;
    representationCounts.set(
      question.representationId,
      (representationCounts.get(question.representationId) ?? 0) + 1,
    );

    assert.ok(!permanentIds.has(question.permanentQuestionId));
    assert.ok(!canonicalIds.has(question.canonicalQuestionId));
    assert.ok(!semanticFingerprints.has(question.semanticFingerprint));
    assert.ok(!deliveryFingerprints.has(question.deliveryFingerprint));
    assert.ok(!sourceDiscoveryIds.has(question.sourceDiscoveryQuestionId));
    permanentIds.add(question.permanentQuestionId);
    canonicalIds.add(question.canonicalQuestionId);
    semanticFingerprints.add(question.semanticFingerprint);
    deliveryFingerprints.add(question.deliveryFingerprint);
    sourceDiscoveryIds.add(question.sourceDiscoveryQuestionId);
  }

  assert.deepEqual(answerCounts, { A: 20, B: 20, C: 20, D: 20 });
  assert.ok(representationCounts.size >= 2, `${qlId} must exercise multiple representations`);
  assert.deepEqual(generatePfcPermanentEnglishQlV1(qlId), generatePfcPermanentEnglishQlV1(qlId));
}

assert.equal(permanentIds.size, 320);
assert.equal(canonicalIds.size, 320);
assert.equal(semanticFingerprints.size, 320);
assert.equal(deliveryFingerprints.size, 320);
assert.equal(sourceDiscoveryIds.size, 320);

const reviewOffsets = [0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 79];
const reviewQuestions = qlIds.flatMap((qlId) => {
  const questions = generatePfcPermanentEnglishQlV1(qlId);
  return reviewOffsets.map((offset) => questions[offset]);
});
assert.equal(reviewQuestions.length, 48);
const reviewHtml = renderPfcPermanentEnglishReviewHtmlV1(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Permanent English Review V1"));
assert.ok(reviewHtml.includes("SPA-QL-035"));
assert.ok(reviewHtml.includes("SPA-QL-038"));
assert.ok(reviewHtml.includes("marker-end="));
assert.ok(reviewHtml.includes("width=\"112\""));
assert.ok(!reviewHtml.includes("<script"));

const evidence = {
  authority: PFC_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  status: "PASS_PFC_001_PERMANENT_ENGLISH_RUNTIME_V1",
  corpus: {
    totalQuestions: corpus.length,
    uniquePermanentQuestionIds: permanentIds.size,
    uniqueCanonicalQuestionIds: canonicalIds.size,
    uniqueSemanticQuestions: semanticFingerprints.size,
    uniqueDeliveryFingerprints: deliveryFingerprints.size,
    sourceDiscoveryQuestionsUsed: sourceDiscoveryIds.size,
    questionsPerQl: 80,
    exactAnswerBalancePerQl: { A: 20, B: 20, C: 20, D: 20 },
    retainedLearnerReviewQuestions: reviewQuestions.length,
    learnerOptionPixels: 112,
    stimulusReviewPixels: 520,
  },
  governance: {
    englishImplementationFrozen: false,
    questionStudioRegistered: false,
    questionBankWrites: false,
    testEligible: false,
    automaticPublication: false,
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-english-runtime-v1-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
