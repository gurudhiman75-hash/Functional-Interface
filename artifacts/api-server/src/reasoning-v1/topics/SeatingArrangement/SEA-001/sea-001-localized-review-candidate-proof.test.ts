import { SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "./permanent/freeze.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { SEA001_TRANSLATION_TARGET_LOCALES, assertSea001LocalizationFoundationStillBlocked, sea001CanonicalParityFingerprint } from "./localization/readiness.ts";
import { SEA001_REVIEW_CANONICAL_NAMES } from "./localization/name-pack.ts";
import { sea001LocalizedLearnerSurface } from "./localization/candidate-localizer.ts";
import { buildSea001FinalLocalizedReviewCandidate } from "./localization/final-review-cleanup.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function latinTokens(text: string): readonly string[] {
  return [...text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map((match) => match[0]!);
}

const criticalEnglishOperators = new Set([
  "left", "right", "clockwise", "anticlockwise", "centre", "center", "outward",
  "north", "south", "opposite", "adjacent", "neighbour", "neighbours", "between",
  "facing", "faces", "seat", "seats", "clue", "clues", "row", "circle", "person", "persons",
]);

const mechanicalHindiFragments = [
  "संख्या सीटें से बायाँ को दायाँ",
  "पहला देखें कौन-सा तरीका",
  "क्योंकि का तरीका वह व्यक्ति",
  "केवल स्थिति 1 है बायाँ",
  "केवल स्थिति 2 है बायाँ",
  "बाद सभी संकेत हैं इस्तेमाल किया",
  "यह चलता है 1 सीट बहुत दूर",
  "यह है 1 कम से संख्या",
  "यह है 1 अधिक से संख्या",
  "दोनों व्यक्ति थे चुना गया",
  "यह रुकता है बाद 1 सीट",
  "प्रश्न पूछता है के लिए गलत कथन",
] as const;

const mechanicalPunjabiFragments = [
  "ਗਿਣਤੀ ਸੀਟਾਂ ਤੋਂ ਖੱਬਾ ਨੂੰ ਸੱਜਾ",
  "ਪਹਿਲਾ ਵੇਖੋ ਕਿਹੜਾ ਤਰੀਕਾ",
  "ਕਿਉਂਕਿ ਦਾ ਤਰੀਕਾ ਉਹ ਵਿਅਕਤੀ",
  "ਸਿਰਫ਼ ਸਥਿਤੀ 1 ਹੈ ਖੱਬਾ",
  "ਸਿਰਫ਼ ਸਥਿਤੀ 2 ਹੈ ਖੱਬਾ",
  "ਬਾਅਦ ਸਭ ਸੰਕੇਤ ਹਨ ਵਰਤਿਆ",
  "ਇਹ ਚਲਦਾ ਹੈ 1 ਸੀਟ ਬਹੁਤ ਦੂਰ",
  "ਇਹ ਹੈ 1 ਘੱਟ ਤੋਂ ਗਿਣਤੀ",
  "ਇਹ ਹੈ 1 ਵੱਧ ਤੋਂ ਗਿਣਤੀ",
  "ਦੋਵੇਂ ਵਿਅਕਤੀ ਸਨ ਚੁਣਿਆ ਗਿਆ",
  "ਇਹ ਰੁਕਦਾ ਹੈ ਬਾਅਦ 1 ਸੀਟ",
  "ਸਵਾਲ ਪੁੱਛਦਾ ਹੈ ਲਈ ਗਲਤ ਕਥਨ",
] as const;

const saturation = buildSea001SaturationCorpus(40);
const canonicalReview = selectManualReviewCorpus(saturation.caselets, 5);
assert(canonicalReview.length === 100, `expected 100 canonical review caselets, got ${canonicalReview.length}`);

let localizedCaseletCount = 0;
let localizedChildCount = 0;
let criticalLeakCount = 0;
let canonicalNameLeakCount = 0;
let mechanicalTranslationeseCount = 0;
const residualEnglish = new Map<string, number>();
const criticalResiduals = new Map<string, number>();

for (const locale of SEA001_TRANSLATION_TARGET_LOCALES) {
  for (const canonical of canonicalReview) {
    const localized = buildSea001FinalLocalizedReviewCandidate(canonical, locale);
    localizedCaseletCount += 1;
    localizedChildCount += localized.children.length;

    assert(localized.locale === locale, `${canonical.caseletId}: localized locale mismatch`);
    assert(localized.canonicalLocale === "en-IN", `${canonical.caseletId}: canonical locale mismatch`);
    assert(localized.canonicalCaseletId === canonical.caseletId, `${canonical.caseletId}: canonical caselet identity mismatch`);
    assert(localized.canonicalParityFingerprint === sea001CanonicalParityFingerprint(canonical), `${canonical.caseletId}: recorded canonical parity fingerprint mismatch`);
    assert(sea001CanonicalParityFingerprint(localized) === sea001CanonicalParityFingerprint(canonical), `${canonical.caseletId}/${locale}: semantic parity changed during localization`);
    assert(localized.children.length === canonical.children.length, `${canonical.caseletId}/${locale}: child count changed`);

    for (let childIndex = 0; childIndex < canonical.children.length; childIndex += 1) {
      const sourceChild = canonical.children[childIndex]!;
      const localizedChild = localized.children[childIndex]!;
      assert(localizedChild.queryContractId === sourceChild.queryContractId, `${canonical.caseletId}/${locale}: query contract changed`);
      assert(localizedChild.answerType === sourceChild.answerType, `${canonical.caseletId}/${locale}: answer type changed`);
      assert(localizedChild.answerIndex === sourceChild.answerIndex, `${canonical.caseletId}/${locale}: answer index changed`);
      assert(JSON.stringify(localizedChild.answer) === JSON.stringify(sourceChild.answer), `${canonical.caseletId}/${locale}: semantic answer changed`);
      assert(localizedChild.options.length === 4, `${canonical.caseletId}/${locale}: option count changed`);
      for (let optionIndex = 0; optionIndex < sourceChild.options.length; optionIndex += 1) {
        const sourceOption = sourceChild.options[optionIndex]!;
        const localizedOption = localizedChild.options[optionIndex]!;
        assert(localizedOption.semanticFingerprint === sourceOption.semanticFingerprint, `${canonical.caseletId}/${locale}: option semantic fingerprint changed`);
        assert(localizedOption.isCorrect === sourceOption.isCorrect, `${canonical.caseletId}/${locale}: option correctness changed`);
        assert(localizedOption.misconceptionId === sourceOption.misconceptionId, `${canonical.caseletId}/${locale}: misconception identity changed`);
      }
    }

    const surface = sea001LocalizedLearnerSurface(localized);
    if (locale === "hi-IN") {
      assert(/[\u0900-\u097F]/u.test(surface), `${canonical.caseletId}: Hindi learner surface lacks Devanagari`);
      for (const fragment of mechanicalHindiFragments) {
        if (surface.includes(fragment)) mechanicalTranslationeseCount += 1;
      }
    } else {
      assert(/[\u0A00-\u0A7F]/u.test(surface), `${canonical.caseletId}: Punjabi learner surface lacks Gurmukhi`);
      for (const fragment of mechanicalPunjabiFragments) {
        if (surface.includes(fragment)) mechanicalTranslationeseCount += 1;
      }
    }

    for (const name of SEA001_REVIEW_CANONICAL_NAMES) {
      if (new RegExp(`\\b${name}\\b`).test(surface)) canonicalNameLeakCount += 1;
    }

    for (const token of latinTokens(surface)) {
      const lower = token.toLowerCase();
      residualEnglish.set(lower, (residualEnglish.get(lower) ?? 0) + 1);
      if (criticalEnglishOperators.has(lower)) {
        criticalLeakCount += 1;
        criticalResiduals.set(lower, (criticalResiduals.get(lower) ?? 0) + 1);
      }
    }

    assert(localized.humanLanguageReviewRequired, `${canonical.caseletId}/${locale}: localized review cannot skip human language review`);
    assert(!localized.productDeliveryUnlocked, `${canonical.caseletId}/${locale}: localized review cannot unlock product delivery`);
    assert(!localized.productionStagingApproved, `${canonical.caseletId}/${locale}: localized review cannot approve staging`);
  }
}

const residualTop = [...residualEnglish.entries()]
  .sort((left, right) => right[1] - left[1])
  .slice(0, 80);
const criticalTop = [...criticalResiduals.entries()]
  .sort((left, right) => right[1] - left[1]);
const residualLatinCount = [...residualEnglish.values()].reduce((sum, count) => sum + count, 0);

console.log("SEA_001_LOCALIZED_REVIEW_DIAGNOSTIC");
console.log("localized caselets", localizedCaseletCount);
console.log("localized child questions", localizedChildCount);
console.log("semantic parity", "200/200");
console.log("canonical Latin-name leaks", canonicalNameLeakCount);
console.log("critical English seating-operator leaks", criticalLeakCount);
console.log("critical residual operators", JSON.stringify(criticalTop));
console.log("residual Latin tokens", residualLatinCount);
console.log("top residual Latin tokens", JSON.stringify(residualTop));
console.log("mechanical translationese hits", mechanicalTranslationeseCount);

assert(localizedCaseletCount === 200, `expected 200 localized review caselets, got ${localizedCaseletCount}`);
assert(localizedChildCount === 800, `expected 800 localized child questions, got ${localizedChildCount}`);
assert(canonicalNameLeakCount === 0, `localized learner text still exposes ${canonicalNameLeakCount} canonical Latin-script names`);
assert(criticalLeakCount === 0, `localized learner text still exposes ${criticalLeakCount} critical English seating-operator tokens`);
assert(residualLatinCount === 0, `localized learner text still exposes ${residualLatinCount} Latin learner-text tokens`);
assert(mechanicalTranslationeseCount === 0, `localized learner text still exposes ${mechanicalTranslationeseCount} known mechanical-translation fragments`);

assertSea001LocalizationFoundationStillBlocked();
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, "Question Studio must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, "Question Bank writes must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible, "mock-test eligibility must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, "public delivery must remain disabled");

console.log("PASS_SEA_001_LOCALIZED_REVIEW_CANDIDATE");
console.log("learner Latin residue", "ZERO");
console.log("known mechanical translationese", "ZERO");
console.log("human language review", "PENDING");
console.log("Question Studio registered", SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
console.log("publicly publishable", SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
