import assert from "node:assert/strict";

import { buildRnkCp005PermanentRuntime } from "./cp005-permanent-runtime-v1";
import type { RnkCp005LocalizedLocale } from "./cp005-localization-review-v1";
import { localizeRnkCp005PermanentQuestionV2 } from "./cp005-localization-review-v2";
import {
  RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL,
  RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
  localizeRnkCp005PermanentQuestionV3,
} from "./cp005-localization-review-v3";

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly RnkCp005LocalizedLocale[];
const canonical = buildRnkCp005PermanentRuntime();

function learnerText(question: Record<string, any>): string {
  return [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.flatMap((option: Record<string, any>) => [option.label, option.explanation]),
    question.answer,
    ...question.explanation,
  ].join("\n");
}

function stripStop(value: string): string {
  return value.replace(/[।.]$/u, "").trim();
}

function badOrdinalGrammar(text: string, locale: RnkCp005LocalizedLocale): boolean {
  if (locale === "hi-IN") {
    return /की रैंक (?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\d+वाँ) है|(?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\d+वाँ) स्थान पर/u.test(text);
  }
  return /ਦੀ ਰੈਂਕ (?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\d+ਵਾਂ) ਹੈ|(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\d+ਵਾਂ) ਸਥਾਨ 'ਤੇ/u.test(text);
}

const summary = {
  localizedQuestions: 0,
  rankFamilyQuestions: 0,
  relationPairQuestions: 0,
  sampledV2Isolation: 0,
  selectedModes: new Set<string>(),
  selectedContexts: new Set<string>(),
};

for (const locale of locales) {
  const fingerprints = new Set<string>();
  for (const question of canonical) {
    const localized = localizeRnkCp005PermanentQuestionV3(question, locale);
    const mode = question.candidateRuntimeProfile.mode as string;
    const text = learnerText(localized);

    summary.localizedQuestions += 1;
    assert.equal(localized.localizationMetadata.version, RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION);
    assert.equal(localized.localizationProof.authority, RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY);
    assert.equal(localized.localizationProof.canonicalPermanentRuntimeFingerprint, question.permanentRuntimeFingerprint);
    assert.equal(localized.localizationProof.canonicalMathematicalFingerprint, question.mathematicalFingerprint);
    assert.equal(localized.localizationProof.permanentQlId, question.permanentProfile.permanentQlId);
    assert.equal(localized.localizationProof.sourceMode, mode);
    assert.equal(localized.localizationProof.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(localized.localizationProof.nativeRankExplanationCoverage, "EXECUTABLE_PROVED");

    assert.equal(localized.correctIndex, question.correctIndex);
    assert.deepEqual(localized.options.map((option) => option.truth), question.options.map((option) => option.truth));
    assert.equal(localized.options.filter((option) => option.truth).length, 1);
    assert.equal(stripStop(localized.answer), stripStop(localized.options[localized.correctIndex]!.label));
    assert.equal(localized.validOrderCount, question.validOrderCount);
    assert.deepEqual(localized.permanentProfile, question.permanentProfile);
    assert.deepEqual(localized.candidateRuntimeProfile, question.candidateRuntimeProfile);
    assert.deepEqual(localized.lifecycle, question.lifecycle);
    assert.deepEqual(localized.exampleValidOrders, question.exampleValidOrders);
    assert.equal(localized.localizationLifecycle.multilingualFreezeGranted, false);
    assert.equal(localized.localizationLifecycle.questionStudio, "DISABLED");
    assert.equal(localized.localizationLifecycle.persistence, "DISABLED");
    assert.equal(localized.localizationLifecycle.questionBank, "NOT_STORED");
    assert.equal(localized.localizationLifecycle.testEligibility, "INELIGIBLE");
    assert.equal(localized.localizationLifecycle.publiclyPublishable, false);
    assert.equal(localized.localizationLifecycle.productDeliveryUnlocked, false);

    assert.equal(/[A-Za-z]/.test(text), false, `${question.discoveryId}/${locale}: residual English learner text`);
    assert.equal(badOrdinalGrammar(text, locale), false, `${question.discoveryId}/${locale}: native ordinal grammar regression`);
    assert.equal(/सीमा वाली रैंक|यही सीमा वास्तव में संभव|ਹੱਦ ਵਾਲੀ ਰੈਂਕ|ਇਹੀ ਹੱਦ ਅਸਲ ਵਿੱਚ ਸੰਭਵ/u.test(text), false,
      `${question.discoveryId}/${locale}: machine-like rank-bound phrase leaked`);
    assert.equal(/पूरा क्रम तय करें|पूरा क्रम निर्धारित|ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ|ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ/u.test(text), false,
      `${question.discoveryId}/${locale}: partial-order question implies unique full order`);

    if (mode === "EXACT_DEFINITE") {
      const joined = localized.explanation.join("\n");
      assert.equal(/ और नीचे | ਅਤੇ ਹੇਠਾਂ /u.test(joined), false,
        `${question.discoveryId}/${locale}: exact-rank above/below reasoning remains mechanically joined`);
    }
    if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
      const correctExplanation = localized.options[localized.correctIndex]!.explanation;
      if (locale === "hi-IN") {
        assert.ok(correctExplanation.includes(mode === "HIGHEST_POSSIBLE" ? "सबसे ऊँची संभव रैंक" : "सबसे नीची संभव रैंक"));
      } else {
        assert.ok(correctExplanation.includes(mode === "HIGHEST_POSSIBLE" ? "ਸਭ ਤੋਂ ਉੱਚੀ ਸੰਭਵ ਰੈਂਕ" : "ਸਭ ਤੋਂ ਹੇਠਲੀ ਸੰਭਵ ਰੈਂਕ"));
      }
      summary.rankFamilyQuestions += 1;
    } else if (mode === "EXACT_DEFINITE" || mode === "EXACT_INDETERMINATE") {
      summary.rankFamilyQuestions += 1;
    } else {
      summary.relationPairQuestions += 1;
    }

    assert.equal(fingerprints.has(localized.localizationProof.localizationFingerprint), false);
    fingerprints.add(localized.localizationProof.localizationFingerprint);
  }
  assert.equal(fingerprints.size, 576);
}

// V3 must be a narrow learner-language overlay. Check V2 identity exhaustively by mode representatives
// plus periodic samples without rebuilding V2 for every expensive partial-order record.
const sampleIndexes = new Set<number>();
for (let index = 0; index < canonical.length; index += 29) sampleIndexes.add(index);
for (const mode of [...new Set(canonical.map((question) => question.candidateRuntimeProfile.mode))]) {
  const index = canonical.findIndex((question) => question.candidateRuntimeProfile.mode === mode);
  assert.ok(index >= 0);
  sampleIndexes.add(index);
}
for (const locale of locales) {
  for (const index of sampleIndexes) {
    const question = canonical[index]!;
    const v2 = localizeRnkCp005PermanentQuestionV2(question, locale);
    const v3 = localizeRnkCp005PermanentQuestionV3(question, locale);
    assert.equal(v3.localizationProof.v2LocalizationFingerprint, v2.localizationProof.localizationFingerprint);
    assert.deepEqual(v3.instruction, v2.instruction);
    assert.deepEqual(v3.clues, v2.clues);
    assert.deepEqual(v3.options.map((option) => ({ label: option.label, truth: option.truth })),
      v2.options.map((option) => ({ label: option.label, truth: option.truth })));
    assert.deepEqual(v3.answer, v2.answer);

    const mode = question.candidateRuntimeProfile.mode as string;
    if (["MUST", "COULD", "CANNOT", "PAIR_FIRST_ABOVE", "PAIR_SECOND_ABOVE", "PAIR_INDETERMINATE"].includes(mode)) {
      assert.equal(learnerText(v3), learnerText(v2), `${question.discoveryId}/${locale}: V3 changed relation/pair surface`);
    }
    summary.sampledV2Isolation += 1;
  }
}

for (const [qlId, ordinals] of Object.entries(RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL)) {
  for (const ordinal of ordinals) {
    const question = canonical.find((candidate) =>
      candidate.permanentProfile.permanentQlId === qlId &&
      candidate.permanentProfile.permanentOrdinalWithinAuthority === ordinal);
    assert.ok(question, `Missing V3 review sample ${qlId}/${ordinal}`);
    summary.selectedModes.add(question.candidateRuntimeProfile.mode);
    summary.selectedContexts.add(question.context);
  }
}
assert.deepEqual([...summary.selectedModes].sort(), [
  "CANNOT",
  "COULD",
  "EXACT_DEFINITE",
  "EXACT_INDETERMINATE",
  "HIGHEST_POSSIBLE",
  "LOWEST_POSSIBLE",
  "MUST",
  "PAIR_FIRST_ABOVE",
  "PAIR_INDETERMINATE",
  "PAIR_SECOND_ABOVE",
]);
assert.deepEqual([...summary.selectedContexts].sort(), [
  "EXAM_SCORE_ORDER",
  "INTERVIEW_SHORTLIST",
  "MERIT_LIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
]);

assert.equal(summary.localizedQuestions, 1_152);
assert.equal(summary.rankFamilyQuestions, 768);
assert.equal(summary.relationPairQuestions, 384);

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
  localizedQuestions: summary.localizedQuestions,
  rankFamilyQuestions: summary.rankFamilyQuestions,
  relationPairQuestions: summary.relationPairQuestions,
  sampledV2Isolation: summary.sampledV2Isolation,
  reviewModes: [...summary.selectedModes].sort(),
  reviewContexts: [...summary.selectedContexts].sort(),
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
}, null, 2));
