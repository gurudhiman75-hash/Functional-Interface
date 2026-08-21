import assert from "node:assert/strict";

import { RNK_PERSON_POOL_V2 } from "../foundation/rnk-object-pool-v2";
import { buildRnkCp005EditorialV3State } from "./cp005-partial-order-editorial-v3-release";
import { buildRnkCp005PermanentRuntime } from "./cp005-permanent-runtime-v1";
import {
  localizeRnkCp005PermanentQuestionV1,
  type RnkCp005LocalizedLocale,
} from "./cp005-localization-review-v1";
import {
  RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
  localizeRnkCp005PermanentQuestionV2,
} from "./cp005-localization-review-v2";

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

function localizedName(name: string, locale: RnkCp005LocalizedLocale): string {
  const entry = RNK_PERSON_POOL_V2.find((person) => person.names.en === name);
  assert.ok(entry, `Object Pool V2 missing ${name}`);
  return locale === "hi-IN" ? entry.names.hi : entry.names.pa;
}

function clueCue(
  context: string,
  variant: number,
  locale: RnkCp005LocalizedLocale,
): string {
  const hi: Record<string, readonly [string, string, string]> = {
    MERIT_LIST: ["ऊपर", "ऊपर", "नीचे"],
    INTERVIEW_SHORTLIST: ["ऊपर", "बेहतर", "नीचे"],
    PERFORMANCE_REVIEW: ["बेहतर", "ऊपर", "नीचे"],
    RACE_RESULT: ["पहले", "ऊपर", "बाद"],
    EXAM_SCORE_ORDER: ["अधिक", "ऊपर", "नीचे"],
  };
  const pa: Record<string, readonly [string, string, string]> = {
    MERIT_LIST: ["ਉੱਪਰ", "ਉੱਪਰ", "ਹੇਠਾਂ"],
    INTERVIEW_SHORTLIST: ["ਉੱਪਰ", "ਬਿਹਤਰ", "ਹੇਠਾਂ"],
    PERFORMANCE_REVIEW: ["ਬਿਹਤਰ", "ਉੱਪਰ", "ਹੇਠਾਂ"],
    RACE_RESULT: ["ਪਹਿਲਾਂ", "ਉੱਪਰ", "ਬਾਅਦ"],
    EXAM_SCORE_ORDER: ["ਵੱਧ", "ਉੱਪਰ", "ਹੇਠਾਂ"],
  };
  return (locale === "hi-IN" ? hi : pa)[context]![variant]!;
}

assert.equal(canonical.length, 576, "CP005 frozen runtime must remain 576 questions");

const qlCounts = new Map<string, number>();
const modeCounts = new Map<string, number>();
for (const question of canonical) {
  const ql = question.permanentProfile.permanentQlId;
  qlCounts.set(ql, (qlCounts.get(ql) ?? 0) + 1);
  const mode = question.candidateRuntimeProfile.mode;
  modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
}
assert.deepEqual(Object.fromEntries(qlCounts), {
  "RNK-QL-036": 192,
  "RNK-QL-037": 192,
  "RNK-QL-038": 192,
});
assert.deepEqual(Object.fromEntries(modeCounts), {
  MUST: 48,
  COULD: 48,
  CANNOT: 48,
  PAIR_FIRST_ABOVE: 16,
  PAIR_SECOND_ABOVE: 16,
  PAIR_INDETERMINATE: 16,
  HIGHEST_POSSIBLE: 96,
  LOWEST_POSSIBLE: 96,
  EXACT_DEFINITE: 96,
  EXACT_INDETERMINATE: 96,
});

const summary = {
  localizedQuestions: 0,
  deterministicReplays: 0,
  semanticParityChecks: 0,
  clueDirectionChecks: 0,
  shuffledQuestionCount: 0,
  v2GenderNeutralChanges: 0,
  v1PreservedNonBoundSurfaces: 0,
  introVariants: new Map<number, number>(),
  queryVariants: new Map<number, number>(),
  clueVariants: new Map<number, number>(),
  contexts: new Set<string>(),
  modes: new Set<string>(),
  localeFingerprints: new Map<string, Set<string>>(),
};

for (const locale of locales) {
  const fingerprints = new Set<string>();
  summary.localeFingerprints.set(locale, fingerprints);

  for (const question of canonical) {
    const v1 = localizeRnkCp005PermanentQuestionV1(question, locale);
    const localized = localizeRnkCp005PermanentQuestionV2(question, locale);
    const replay = localizeRnkCp005PermanentQuestionV2(question, locale);
    const mode = question.candidateRuntimeProfile.mode;
    const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
    assert.ok(state, `${question.discoveryId}: frozen V3 state must reconstruct`);

    summary.localizedQuestions += 1;
    summary.deterministicReplays += 1;
    summary.semanticParityChecks += 1;
    summary.contexts.add(question.context);
    summary.modes.add(mode);

    assert.equal(localized.localizationMetadata.version, RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION);
    assert.equal(localized.localizationProof.authority, RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY);
    assert.equal(localized.localizationProof.localizationFingerprint, replay.localizationProof.localizationFingerprint);
    assert.equal(localized.localizationProof.v1LocalizationFingerprint, v1.localizationProof.localizationFingerprint);
    assert.equal(localized.localizationProof.canonicalPermanentRuntimeFingerprint, question.permanentRuntimeFingerprint);
    assert.equal(localized.localizationProof.canonicalMathematicalFingerprint, question.mathematicalFingerprint);
    assert.equal(localized.localizationProof.permanentQlId, question.permanentProfile.permanentQlId);
    assert.equal(localized.localizationProof.sourceMode, mode);
    assert.equal(localized.localizationProof.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(localized.localizationProof.validOrderSetSource, "FROZEN_PARTIAL_ORDER_STATE");
    assert.equal(localized.localizationMetadata.validOrderSetPreserved, true);
    assert.equal(state.validOrders.length, question.validOrderCount);

    assert.equal(localized.correctIndex, question.correctIndex);
    assert.equal(localized.options.length, question.options.length);
    assert.deepEqual(
      localized.options.map((option) => option.truth),
      question.options.map((option) => option.truth),
      `${question.discoveryId}: option truth ancestry drift`,
    );
    assert.equal(localized.options.filter((option) => option.truth).length, 1);
    assert.equal(localized.options[localized.correctIndex]!.truth, true);
    assert.equal(stripStop(localized.answer), stripStop(localized.options[localized.correctIndex]!.label));

    assert.deepEqual(localized.permanentProfile, question.permanentProfile);
    assert.deepEqual(localized.candidateRuntimeProfile, question.candidateRuntimeProfile);
    assert.deepEqual(localized.lifecycle, question.lifecycle);
    assert.deepEqual(localized.exampleValidOrders, question.exampleValidOrders);
    assert.equal(localized.validOrderCount, question.validOrderCount);
    assert.equal(localized.localizationLifecycle.permanentQlAllocated, true);
    assert.equal(localized.localizationLifecycle.englishFrozen, true);
    assert.equal(localized.localizationLifecycle.hindiPunjabi, "REVIEW_CANDIDATE");
    assert.equal(localized.localizationLifecycle.humanLanguageReviewRequired, true);
    assert.equal(localized.localizationLifecycle.multilingualFreezeGranted, false);
    assert.equal(localized.localizationLifecycle.questionStudio, "DISABLED");
    assert.equal(localized.localizationLifecycle.persistence, "DISABLED");
    assert.equal(localized.localizationLifecycle.questionBank, "NOT_STORED");
    assert.equal(localized.localizationLifecycle.testEligibility, "INELIGIBLE");
    assert.equal(localized.localizationLifecycle.publiclyPublishable, false);
    assert.equal(localized.localizationLifecycle.productDeliveryUnlocked, false);

    const text = learnerText(localized);
    assert.ok(text.length > 0);
    assert.equal(/[A-Za-z]/.test(text), false, `${question.discoveryId}/${locale}: residual English learner text`);
    assert.equal(/RNK|QL-|fingerprint|MUST|COULD|CANNOT|DEFINITE|VARIABLE|IMPOSSIBLE/i.test(text), false);
    assert.equal(/पूरा क्रम तय करें|पूरा क्रम निर्धारित|ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ|ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ/u.test(text), false,
      `${question.discoveryId}/${locale}: CP005 must not imply a unique full order`);
    assert.equal(/जा सकता|जा सकती|ਜਾ ਸਕਦਾ|ਜਾ ਸਕਦੀ/u.test(text), false,
      `${question.discoveryId}/${locale}: gender-dependent rank-bound verb leaked`);
    if (locale === "hi-IN") assert.ok(/[\u0900-\u097F]/u.test(text));
    else assert.ok(/[\u0A00-\u0A7F]/u.test(text));

    for (const canonicalName of state.entities) {
      assert.equal(text.includes(canonicalName), false, `${question.discoveryId}/${locale}: Latin name leak ${canonicalName}`);
    }

    const diversity = localized.localizationMetadata.diversity;
    summary.introVariants.set(diversity.introVariant, (summary.introVariants.get(diversity.introVariant) ?? 0) + 1);
    summary.queryVariants.set(diversity.queryVariant, (summary.queryVariants.get(diversity.queryVariant) ?? 0) + 1);
    for (const variant of diversity.clueVariantIds) {
      summary.clueVariants.set(variant, (summary.clueVariants.get(variant) ?? 0) + 1);
    }

    assert.equal(diversity.maxConsecutiveSameClueTemplate <= 2, true);
    if (localized.clues.length >= 3) assert.ok(new Set(diversity.clueVariantIds).size >= 2);
    assert.equal(diversity.clueOrderShuffled, true, `${question.discoveryId}: clue order should be visibly shuffled`);
    summary.shuffledQuestionCount += 1;
    assert.deepEqual(
      [...diversity.canonicalClueOrderKeys].sort(),
      [...diversity.renderedClueOrderKeys].sort(),
      `${question.discoveryId}: clue-edge set drift`,
    );
    assert.equal(localized.clues.length, diversity.renderedClueOrderKeys.length);

    localized.clues.forEach((clue, index) => {
      const [higher, lower] = diversity.renderedClueOrderKeys[index]!.split(">");
      assert.ok(higher && lower);
      const high = localizedName(higher, locale);
      const low = localizedName(lower, locale);
      assert.ok(clue.includes(high) && clue.includes(low), `${question.discoveryId}/${locale}: clue lost relation names`);
      const variant = diversity.clueVariantIds[index]!;
      const cue = clueCue(question.context, variant, locale);
      assert.ok(clue.includes(cue), `${question.discoveryId}/${locale}: clue direction cue mismatch`);
      if (variant === 2) assert.ok(clue.indexOf(low) < clue.indexOf(high), `${question.discoveryId}/${locale}: inverse clue subject order drift`);
      else assert.ok(clue.indexOf(high) < clue.indexOf(low), `${question.discoveryId}/${locale}: direct clue subject order drift`);
      summary.clueDirectionChecks += 1;
    });

    const v1Text = learnerText(v1);
    if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
      assert.deepEqual(localized.instruction, v1.instruction);
      assert.deepEqual(localized.clues, v1.clues);
      assert.deepEqual(localized.stem, v1.stem);
      assert.deepEqual(localized.options, v1.options);
      assert.deepEqual(localized.answer, v1.answer);
      assert.notDeepEqual(localized.explanation, v1.explanation);
      assert.equal(/जा सकता|ਜਾ ਸਕਦਾ/u.test(learnerText(localized)), false);
      summary.v2GenderNeutralChanges += 1;
    } else {
      assert.equal(text, v1Text, `${question.discoveryId}/${locale}: V2 changed a non-rank-bound learner surface`);
      summary.v1PreservedNonBoundSurfaces += 1;
    }

    fingerprints.add(localized.localizationProof.localizationFingerprint);
  }

  assert.equal(fingerprints.size, 576, `${locale}: localized fingerprint uniqueness drift`);
}

assert.equal(summary.localizedQuestions, 1_152);
assert.equal(summary.deterministicReplays, 1_152);
assert.equal(summary.semanticParityChecks, 1_152);
assert.equal(summary.shuffledQuestionCount, 1_152);
assert.equal(summary.v2GenderNeutralChanges, 384);
assert.equal(summary.v1PreservedNonBoundSurfaces, 768);
assert.deepEqual([...summary.contexts].sort(), [
  "EXAM_SCORE_ORDER",
  "INTERVIEW_SHORTLIST",
  "MERIT_LIST",
  "PERFORMANCE_REVIEW",
  "RACE_RESULT",
]);
assert.deepEqual([...summary.modes].sort(), [
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
assert.ok((summary.introVariants.get(0) ?? 0) > 0 && (summary.introVariants.get(1) ?? 0) > 0);
assert.ok((summary.queryVariants.get(0) ?? 0) > 0 && (summary.queryVariants.get(1) ?? 0) > 0);
assert.ok([0, 1, 2].every((variant) => (summary.clueVariants.get(variant) ?? 0) > 0));

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
  canonicalQuestions: canonical.length,
  localizedQuestions: summary.localizedQuestions,
  qlCounts: Object.fromEntries(qlCounts),
  modeCounts: Object.fromEntries(modeCounts),
  contexts: [...summary.contexts].sort(),
  modes: [...summary.modes].sort(),
  introVariants: Object.fromEntries(summary.introVariants),
  queryVariants: Object.fromEntries(summary.queryVariants),
  clueVariants: Object.fromEntries(summary.clueVariants),
  clueDirectionChecks: summary.clueDirectionChecks,
  shuffledQuestionCount: summary.shuffledQuestionCount,
  v2GenderNeutralChanges: summary.v2GenderNeutralChanges,
  v1PreservedNonBoundSurfaces: summary.v1PreservedNonBoundSurfaces,
  localizedUniqueFingerprintsPerLocale: Object.fromEntries(
    [...summary.localeFingerprints].map(([locale, fingerprints]) => [locale, fingerprints.size]),
  ),
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudio: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
