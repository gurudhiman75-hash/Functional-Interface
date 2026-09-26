import assert from "node:assert/strict";

import { RNK_PERSON_POOL_V2 } from "../foundation/rnk-object-pool-v2";
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

function clueCue(context: string, variant: number, locale: RnkCp005LocalizedLocale): string {
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

function hasGenderedRankBoundary(text: string, locale: RnkCp005LocalizedLocale): boolean {
  if (locale === "hi-IN") {
    return /(?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\d+वाँ) से (?:ऊपर|नीचे) नहीं जा सक(?:ता|ती)/u.test(text);
  }
  return /(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\d+ਵਾਂ) ਤੋਂ (?:ਉੱਪਰ|ਹੇਠਾਂ) ਨਹੀਂ ਜਾ ਸਕ(?:ਦਾ|ਦੀ)/u.test(text);
}

function hasNominativeOrdinalBeforePostposition(text: string, locale: RnkCp005LocalizedLocale): boolean {
  if (locale === "hi-IN") {
    return /(?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\d+वाँ) से (?:ऊँची|नीची) रैंक/u.test(text);
  }
  return /(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\d+ਵਾਂ) ਤੋਂ (?:ਉੱਚੀ|ਹੇਠਲੀ) ਰੈਂਕ/u.test(text);
}

assert.equal(canonical.length, 576);
assert.deepEqual(
  Object.fromEntries(
    ["RNK-QL-036", "RNK-QL-037", "RNK-QL-038"].map((qlId) => [
      qlId,
      canonical.filter((question) => question.permanentProfile.permanentQlId === qlId).length,
    ]),
  ),
  { "RNK-QL-036": 192, "RNK-QL-037": 192, "RNK-QL-038": 192 },
);

const modeCounts = Object.fromEntries(
  [...new Set(canonical.map((question) => question.candidateRuntimeProfile.mode))]
    .map((mode) => [mode, canonical.filter((question) => question.candidateRuntimeProfile.mode === mode).length]),
);
assert.deepEqual(modeCounts, {
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
  clueDirectionChecks: 0,
  shuffledQuestions: 0,
  boundSurfaces: 0,
  nonBoundSurfaces: 0,
  introVariants: new Map<number, number>(),
  queryVariants: new Map<number, number>(),
  clueVariants: new Map<number, number>(),
  contexts: new Set<string>(),
  modes: new Set<string>(),
};

for (const locale of locales) {
  const fingerprints = new Set<string>();
  for (const question of canonical) {
    const localized = localizeRnkCp005PermanentQuestionV2(question, locale);
    const text = learnerText(localized);
    const diversity = localized.localizationMetadata.diversity;
    const mode = question.candidateRuntimeProfile.mode as string;

    summary.localizedQuestions += 1;
    summary.contexts.add(question.context);
    summary.modes.add(mode);

    assert.equal(localized.localizationMetadata.version, RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION);
    assert.equal(localized.localizationProof.authority, RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY);
    assert.equal(localized.localizationProof.canonicalPermanentRuntimeFingerprint, question.permanentRuntimeFingerprint);
    assert.equal(localized.localizationProof.canonicalMathematicalFingerprint, question.mathematicalFingerprint);
    assert.equal(localized.localizationProof.permanentQlId, question.permanentProfile.permanentQlId);
    assert.equal(localized.localizationProof.sourceMode, mode);
    assert.equal(localized.localizationProof.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(localized.localizationMetadata.validOrderSetPreserved, true);

    assert.equal(localized.correctIndex, question.correctIndex);
    assert.equal(localized.options.length, question.options.length);
    assert.deepEqual(localized.options.map((option) => option.truth), question.options.map((option) => option.truth));
    assert.equal(localized.options.filter((option) => option.truth).length, 1);
    assert.equal(localized.options[localized.correctIndex]!.truth, true);
    assert.equal(stripStop(localized.answer), stripStop(localized.options[localized.correctIndex]!.label));
    assert.equal(localized.validOrderCount, question.validOrderCount);
    assert.deepEqual(localized.permanentProfile, question.permanentProfile);
    assert.deepEqual(localized.candidateRuntimeProfile, question.candidateRuntimeProfile);
    assert.deepEqual(localized.lifecycle, question.lifecycle);
    assert.deepEqual(localized.exampleValidOrders, question.exampleValidOrders);

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

    assert.equal(/[A-Za-z]/.test(text), false, `${question.discoveryId}/${locale}: residual English learner text`);
    assert.equal(/पूरा क्रम तय करें|पूरा क्रम निर्धारित|ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ|ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ/u.test(text), false,
      `${question.discoveryId}/${locale}: partial-order question implies unique complete order`);
    assert.equal(hasGenderedRankBoundary(text, locale), false,
      `${question.discoveryId}/${locale}: gender-dependent rank-bound construction leaked`);

    for (const canonicalName of localized.canonicalNames) {
      assert.equal(text.includes(canonicalName), false, `${question.discoveryId}/${locale}: Latin name leak ${canonicalName}`);
    }

    summary.introVariants.set(diversity.introVariant, (summary.introVariants.get(diversity.introVariant) ?? 0) + 1);
    summary.queryVariants.set(diversity.queryVariant, (summary.queryVariants.get(diversity.queryVariant) ?? 0) + 1);
    for (const variant of diversity.clueVariantIds) {
      summary.clueVariants.set(variant, (summary.clueVariants.get(variant) ?? 0) + 1);
    }
    assert.equal(diversity.maxConsecutiveSameClueTemplate <= 2, true);
    if (localized.clues.length >= 3) assert.ok(new Set(diversity.clueVariantIds).size >= 2);
    assert.equal(diversity.clueOrderShuffled, true, `${question.discoveryId}: clue order not shuffled`);
    summary.shuffledQuestions += 1;
    assert.deepEqual([...diversity.canonicalClueOrderKeys].sort(), [...diversity.renderedClueOrderKeys].sort());

    localized.clues.forEach((clue, index) => {
      const [higher, lower] = diversity.renderedClueOrderKeys[index]!.split(">");
      assert.ok(higher && lower);
      const high = localizedName(higher, locale);
      const low = localizedName(lower, locale);
      const variant = diversity.clueVariantIds[index]!;
      assert.ok(clue.includes(high) && clue.includes(low));
      assert.ok(clue.includes(clueCue(question.context, variant, locale)));
      if (variant === 2) assert.ok(clue.indexOf(low) < clue.indexOf(high));
      else assert.ok(clue.indexOf(high) < clue.indexOf(low));
      summary.clueDirectionChecks += 1;
    });

    if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
      assert.equal(hasNominativeOrdinalBeforePostposition(localized.explanation.join("\n"), locale), false,
        `${question.discoveryId}/${locale}: nominative ordinal remains before postposition`);
      assert.equal(hasGenderedRankBoundary(localized.explanation.join("\n"), locale), false);
      summary.boundSurfaces += 1;
    } else {
      summary.nonBoundSurfaces += 1;
    }

    assert.equal(fingerprints.has(localized.localizationProof.localizationFingerprint), false,
      `${question.discoveryId}/${locale}: duplicate localized fingerprint`);
    fingerprints.add(localized.localizationProof.localizationFingerprint);
  }
  assert.equal(fingerprints.size, 576);
}

// V1→V2 surface isolation and deterministic replay are sampled across every authority/mode/context
// rather than rebuilding the expensive partial-order state three times for all 1,152 records.
const sampleIndexes = new Set<number>();
for (let index = 0; index < canonical.length; index += 17) sampleIndexes.add(index);
for (const mode of Object.keys(modeCounts)) {
  const index = canonical.findIndex((question) => question.candidateRuntimeProfile.mode === mode);
  assert.ok(index >= 0);
  sampleIndexes.add(index);
}
for (const context of ["MERIT_LIST", "INTERVIEW_SHORTLIST", "PERFORMANCE_REVIEW", "RACE_RESULT", "EXAM_SCORE_ORDER"]) {
  const index = canonical.findIndex((question) => question.context === context);
  assert.ok(index >= 0);
  sampleIndexes.add(index);
}

let deterministicSamples = 0;
let isolationSamples = 0;
for (const locale of locales) {
  for (const index of [...sampleIndexes].sort((a, b) => a - b)) {
    const question = canonical[index]!;
    const v1 = localizeRnkCp005PermanentQuestionV1(question, locale);
    const v2 = localizeRnkCp005PermanentQuestionV2(question, locale);
    const replay = localizeRnkCp005PermanentQuestionV2(question, locale);
    assert.equal(v2.localizationProof.localizationFingerprint, replay.localizationProof.localizationFingerprint);
    assert.equal(v2.localizationProof.v1LocalizationFingerprint, v1.localizationProof.localizationFingerprint);
    deterministicSamples += 1;

    const mode = question.candidateRuntimeProfile.mode as string;
    if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
      assert.deepEqual(v2.instruction, v1.instruction);
      assert.deepEqual(v2.clues, v1.clues);
      assert.deepEqual(v2.stem, v1.stem);
      assert.deepEqual(v2.options, v1.options);
      assert.deepEqual(v2.answer, v1.answer);
      assert.notDeepEqual(v2.explanation, v1.explanation);
    } else {
      assert.equal(learnerText(v2), learnerText(v1));
    }
    isolationSamples += 1;
  }
}

assert.equal(summary.localizedQuestions, 1_152);
assert.equal(summary.shuffledQuestions, 1_152);
assert.equal(summary.boundSurfaces, 384);
assert.equal(summary.nonBoundSurfaces, 768);
assert.deepEqual([...summary.contexts].sort(), [
  "EXAM_SCORE_ORDER", "INTERVIEW_SHORTLIST", "MERIT_LIST", "PERFORMANCE_REVIEW", "RACE_RESULT",
]);
assert.deepEqual([...summary.modes].sort(), Object.keys(modeCounts).sort());
assert.ok((summary.introVariants.get(0) ?? 0) > 0 && (summary.introVariants.get(1) ?? 0) > 0);
assert.ok((summary.queryVariants.get(0) ?? 0) > 0 && (summary.queryVariants.get(1) ?? 0) > 0);
assert.ok([0, 1, 2].every((variant) => (summary.clueVariants.get(variant) ?? 0) > 0));
assert.ok(deterministicSamples > 0 && isolationSamples > 0);

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
  canonicalQuestions: canonical.length,
  localizedQuestions: summary.localizedQuestions,
  modeCounts,
  contexts: [...summary.contexts].sort(),
  introVariants: Object.fromEntries(summary.introVariants),
  queryVariants: Object.fromEntries(summary.queryVariants),
  clueVariants: Object.fromEntries(summary.clueVariants),
  clueDirectionChecks: summary.clueDirectionChecks,
  shuffledQuestions: summary.shuffledQuestions,
  boundSurfaces: summary.boundSurfaces,
  nonBoundSurfaces: summary.nonBoundSurfaces,
  deterministicReplaySamples: deterministicSamples,
  v1V2IsolationSamples: isolationSamples,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
