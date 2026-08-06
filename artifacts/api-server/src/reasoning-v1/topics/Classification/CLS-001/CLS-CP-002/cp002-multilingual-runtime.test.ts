import assert from "node:assert/strict";
import { CLS_CP002_QL_ID } from "./cp002-permanent-contract";
import { generateClsCp002Question } from "./cp002-multilingual-runtime";
import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_PROTOTYPES,
  CLS_CP002_RELATIONS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
} from "./relation-registry";
import { auditClsCp002DisplayedPairs } from "./runtime";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";
import {
  canonicalizeClsCp002StudentPair,
  localizeClsCp002StudentPair,
  localizedClsCp002StudentClassLabel,
} from "./localization/cp002-student-presentation";
import { getClsCp002TranslationCoverage } from "./localization/cp002-translation-coverage";

const LOCALES: readonly ClsCp002Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const coverage = getClsCp002TranslationCoverage();
assert.deepEqual(coverage, {
  totalImportedFacts: 324,
  multilingualSafeImportedFacts: 112,
  englishOnlyImportedFacts: 212,
  supplementalFacts: 48,
  totalMultilingualSafeFactPairs: 160,
  factRelationCount: 31,
  factRelationsWithAtLeastFourSafePairs: 31,
});

assert.deepEqual(
  localizeClsCp002StudentPair(
    { left: "Cold", right: "Cool" },
    ["CLS-CP002-ANA-LF-025", "CLS-CP002-ANA-LF-026", "CLS-CP002-ANA-LF-027", "CLS-CP002-ANA-LF-028"],
    "hi-IN",
  ),
  { left: "बहुत ठंडा", right: "ठंडा" },
);
assert.deepEqual(
  localizeClsCp002StudentPair(
    { left: "Cold", right: "Cool" },
    ["CLS-CP002-ANA-LF-025", "CLS-CP002-ANA-LF-026", "CLS-CP002-ANA-LF-027", "CLS-CP002-ANA-LF-028"],
    "pa-IN",
  ),
  { left: "ਬਹੁਤ ਠੰਢਾ", right: "ਠੰਢਾ" },
);
assert.deepEqual(
  localizeClsCp002StudentPair(
    { left: "Court", right: "Adjudication" },
    ["CLS-CP002-ANA-SF-145"],
    "hi-IN",
  ),
  { left: "न्यायालय", right: "न्याय करना" },
);
assert.deepEqual(
  localizeClsCp002StudentPair(
    { left: "Telephone", right: "Ring" },
    ["CLS-CP002-SUP-03-11"],
    "pa-IN",
  ),
  { left: "ਟੈਲੀਫੋਨ", right: "ਟ੍ਰਿਨ-ਟ੍ਰਿਨ" },
);
assert.equal(localizedClsCp002StudentClassLabel("CLS_MAMMALS", "hi-IN"), "दूध पिलाने वाले जानवर");
assert.equal(localizedClsCp002StudentClassLabel("CLS_AQUATIC_ANIMALS", "hi-IN"), "पानी में रहने वाले जानवर");

const hindiTreePair = localizeClsCp002StudentPair(
  { left: "Crown", right: "Sapwood" },
  [],
  "hi-IN",
);
assert.deepEqual(hindiTreePair, {
  left: "पेड़ का ऊपरी भाग",
  right: "पेड़ की नई लकड़ी",
});
assert.deepEqual(
  canonicalizeClsCp002StudentPair(hindiTreePair, [], "hi-IN"),
  { left: "Crown", right: "Sapwood" },
);

const punjabiTreePair = localizeClsCp002StudentPair(
  { left: "Crown", right: "Sapwood" },
  [],
  "pa-IN",
);
assert.deepEqual(punjabiTreePair, {
  left: "ਦਰੱਖਤ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ",
  right: "ਦਰੱਖਤ ਦੀ ਨਵੀਂ ਲੱਕੜ",
});
assert.deepEqual(
  canonicalizeClsCp002StudentPair(punjabiTreePair, [], "pa-IN"),
  { left: "Crown", right: "Sapwood" },
);

const fingerprints = new Map<ClsCp002Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const duplicateCounts = new Map<ClsCp002Locale, number>(
  LOCALES.map((locale) => [locale, 0]),
);
const answerPositions = new Map<ClsCp002Locale, number[]>(
  LOCALES.map((locale) => [locale, [0, 0, 0, 0, 0]]),
);
const relationCoverage = new Set<string>();
const prototypeCoverage = new Set<string>();
const explanationTraces = new Set<string>();

function eligibleRelationIds(question: ReturnType<typeof generateClsCp002Question>): readonly string[] {
  if (question.family === "CLASS_COHESION") return CLS_CP002_CLASS_RELATION_IDS;
  if (question.generationProfile === "LEXICAL_POLARITY") return CLS_CP002_LEXICAL_RELATION_IDS;
  return [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS];
}

for (let seed = 0; seed < 600; seed += 1) {
  const english = generateClsCp002Question(CLS_CP002_QL_ID, "en-IN", seed);

  for (const locale of LOCALES) {
    const question = generateClsCp002Question(CLS_CP002_QL_ID, locale, seed);
    const replay = generateClsCp002Question(CLS_CP002_QL_ID, locale, seed);
    assert.deepEqual(question, replay, `${locale}/${seed} is not deterministic`);

    assert.equal(question.qlId, CLS_CP002_QL_ID);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.intendedRelationId, english.intendedRelationId);
    assert.equal(question.difficulty, english.difficulty);
    assert.deepEqual(question.difficultyFeatures, english.difficultyFeatures);
    assert.equal(question.metadata.sourcePrototypeId, english.metadata.sourcePrototypeId);
    assert.equal(question.metadata.sourcePrototypeSeed, english.metadata.sourcePrototypeSeed);
    assert.equal(question.metadata.optionCount, english.metadata.optionCount);
    assert.equal(question.metadata.solveContractId, english.metadata.solveContractId);
    assert.equal(question.options.length, english.options.length);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.equal(question.explanation.coreConcept.length, 1);
    assert.equal(question.explanation.stepByStep.length, 3);
    assert.equal(question.explanation.examSpeedShortcut.length, 1);
    assert.equal(question.explanation.commonTrapWarning.length, 1);
    assert.ok(question.explanation.stepByStep.join(" ").includes(question.answer));

    if (question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR") {
      assert.ok(CLS_CP002_FALSE_PAIR_SAFE_RELATION_IDS.includes(question.intendedRelationId as never));
    }

    let canonicalPairs = question.pairs;
    if (locale !== "en-IN") {
      assert.equal(question.metadata.localizationVersion, "cls-cp002-localization-v1");
      canonicalPairs = question.pairs.map((pair) =>
        canonicalizeClsCp002StudentPair(pair, question.metadata.sourceRelationFactIds, locale),
      );
      assert.deepEqual(canonicalPairs, english.pairs, `${locale}/${seed} canonical reconstruction changed`);
      assert.notDeepEqual(question.options, english.options);
      assert.notEqual(question.intendedRelationLabel, english.intendedRelationLabel);
    }

    const independent = auditClsCp002DisplayedPairs(canonicalPairs, eligibleRelationIds(question));
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.winningRelationId, question.intendedRelationId);
    assert.equal(independent.winningOutlierIndex, question.correctIndex);

    const learnerText = [
      question.stem,
      ...question.options,
      question.answer,
      question.intendedRelationLabel,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/CLS-|SEM_|LEX_|PAIR_CLASS_|prototype|quality rank|candidate relation|ontology/i.test(learnerText));
    assert.ok(!/undefined|null|NaN|Infinity/.test(learnerText));
    assert.ok(!/pair of|की जोड़ी का संबंध|ਦੀ ਜੋੜੀ ਵਾਲਾ ਰਿਸ਼ਤਾ/i.test(learnerText));
    assert.ok(!/उष्णकटिबंधीय|स्तनधारी|जलीय जानवर|अंगूरी मदिरा|न्याय-निर्णय/u.test(learnerText));
    assert.ok(!/ਅੰਗੂਰੀ ਮਦਿਰਾ|ਨਿਆਂ-ਨਿਰਣੇ|ਬਰਤਨ/u.test(learnerText));

    if (locale === "hi-IN") {
      assert.match(learnerText, /[\u0904-\u0939\u0958-\u0961]/u);
      assert.ok(question.options.every((option) => /[\u0904-\u0939\u0958-\u0961]/u.test(option)));
      assert.ok(!/[\u0A05-\u0A39\u0A59-\u0A5E]/u.test(learnerText));
      assert.ok(!/[A-Za-z]{3,}/u.test(learnerText), `${seed} leaked English into Hindi output`);
    } else if (locale === "pa-IN") {
      assert.match(learnerText, /[\u0A05-\u0A39\u0A59-\u0A5E]/u);
      assert.ok(question.options.every((option) => /[\u0A05-\u0A39\u0A59-\u0A5E]/u.test(option)));
      assert.ok(!/[\u0904-\u0939\u0958-\u0961]/u.test(learnerText));
      assert.ok(!/[A-Za-z]{3,}/u.test(learnerText), `${seed} leaked English into Punjabi output`);
      assert.ok(!/(?:^|\s)(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਾਦਰਿਸ਼ਤਾ)(?:\s|$)/u.test(learnerText));
    }

    const fingerprint = JSON.stringify({
      locale,
      stem: question.stem,
      options: question.options,
      answer: question.answer,
      prototype: question.metadata.sourcePrototypeId,
    });
    const localeFingerprints = fingerprints.get(locale)!;
    if (localeFingerprints.has(fingerprint)) {
      duplicateCounts.set(locale, duplicateCounts.get(locale)! + 1);
    } else {
      localeFingerprints.add(fingerprint);
    }

    answerPositions.get(locale)![question.correctIndex] += 1;
    explanationTraces.add(JSON.stringify({
      locale,
      core: question.explanation.coreConcept,
      steps: question.explanation.stepByStep,
      shortcut: question.explanation.examSpeedShortcut,
      trap: question.explanation.commonTrapWarning,
    }));

    if (locale === "en-IN") {
      relationCoverage.add(question.intendedRelationId);
      prototypeCoverage.add(question.metadata.sourcePrototypeId);
    }
  }
}

for (const locale of LOCALES) {
  const uniqueCount = fingerprints.get(locale)!.size;
  const duplicateCount = duplicateCounts.get(locale)!;
  assert.ok(
    uniqueCount >= 590,
    `${locale} visible-question diversity is too low: ${uniqueCount}/600 unique (${duplicateCount} duplicates)`,
  );
  assert.ok(duplicateCount <= 10);
  const positions = answerPositions.get(locale)!;
  assert.deepEqual(positions.map((count) => count > 0), [true, true, true, true, true]);
  assert.ok(Math.max(...positions.slice(0, 4)) / Math.min(...positions.slice(0, 4)) < 1.5);
  assert.ok(positions[4]! > 15);
}
assert.equal(relationCoverage.size, CLS_CP002_RELATIONS.length);
assert.equal(prototypeCoverage.size, CLS_CP002_PROTOTYPES.length);
assert.ok(explanationTraces.size > 1700, `Explanations are too repetitive: ${explanationTraces.size}`);

console.log("CLS-CP-002 multilingual parity audit passed.", {
  qlId: CLS_CP002_QL_ID,
  locales: LOCALES,
  questionsPerLocale: 600,
  totalQuestions: 1800,
  relations: relationCoverage.size,
  prototypes: prototypeCoverage.size,
  translationCoverage: coverage,
  uniqueVisibleQuestions: Object.fromEntries(
    [...fingerprints].map(([locale, values]) => [locale, values.size]),
  ),
  duplicateCounts: Object.fromEntries(duplicateCounts),
  uniqueExplanationTraces: explanationTraces.size,
  answerPositions: Object.fromEntries(answerPositions),
});