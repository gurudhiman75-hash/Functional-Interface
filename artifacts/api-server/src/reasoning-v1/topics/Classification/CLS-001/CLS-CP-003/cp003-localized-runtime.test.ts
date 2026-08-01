import assert from "node:assert/strict";
import {
  CLS_CP003_LOCALIZED_CONTRACTS,
  CLS_CP003_LOCALIZED_LOCALES,
  CLS_CP003_LOCALIZED_QL_IDS,
} from "./cp003-localized-contracts";
import {
  analyzeClsCp003LocalizedWord,
  auditClsCp003LocalizedWords,
} from "./cp003-localized-runtime";
import {
  generateClsCp003LocalizedQuestionV3,
  independentlyVerifyClsCp003LocalizedQuestionV3,
} from "./cp003-localized-runtime-v3";
import { getClsCp003LocalizedDatasetSummary } from "./word-dataset.localized";

assert.deepEqual(CLS_CP003_LOCALIZED_LOCALES, ["hi-IN", "pa-IN"]);
assert.deepEqual(CLS_CP003_LOCALIZED_QL_IDS, ["CLS-QL-005", "CLS-QL-006"]);
assert.equal(CLS_CP003_LOCALIZED_CONTRACTS.length, 2);

for (const locale of CLS_CP003_LOCALIZED_LOCALES) {
  const summary = getClsCp003LocalizedDatasetSummary(locale);
  assert.ok(summary.wordCount >= 130, `${locale} native word dataset is too small: ${summary.wordCount}`);
  assert.equal(summary.jumbleWordCount, 35);
  assert.ok(summary.affixFamilyCount >= 5);
  assert.equal(summary.semanticClassCount, 7);
}

const perLocale = new Map<string, {
  generated: number;
  unique: Set<string>;
  explanationFingerprints: Set<string>;
  qls: Set<string>;
  prototypes: Set<string>;
  rules: Set<string>;
  optionCounts: Set<number>;
  difficulties: Set<string>;
  answerPositions: number[];
}>();

for (const locale of CLS_CP003_LOCALIZED_LOCALES) {
  perLocale.set(locale, {
    generated: 0,
    unique: new Set(),
    explanationFingerprints: new Set(),
    qls: new Set(),
    prototypes: new Set(),
    rules: new Set(),
    optionCounts: new Set(),
    difficulties: new Set(),
    answerPositions: [0, 0, 0, 0, 0],
  });
}

for (const qlId of CLS_CP003_LOCALIZED_QL_IDS) {
  for (let seed = 0; seed < 400; seed += 1) {
    const hindi = generateClsCp003LocalizedQuestionV3(qlId, "hi-IN", seed);
    const punjabi = generateClsCp003LocalizedQuestionV3(qlId, "pa-IN", seed);

    assert.equal(hindi.prototypeId, punjabi.prototypeId, `${qlId}/${seed} prototype parity failed`);
    assert.equal(hindi.options.length, punjabi.options.length, `${qlId}/${seed} option-count parity failed`);
    assert.equal(hindi.correctIndex, punjabi.correctIndex, `${qlId}/${seed} answer-index parity failed`);
    assert.equal(hindi.metadata.solveContractId, punjabi.metadata.solveContractId);

    for (const question of [hindi, punjabi]) {
      const locale = question.metadata.locale;
      const replay = generateClsCp003LocalizedQuestionV3(qlId, locale, seed);
      assert.deepEqual(question, replay, `${locale}/${qlId}/${seed} is not deterministic`);
      assert.equal(question.qlId, qlId);
      assert.equal(question.permanentQlId, qlId);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.ok(question.options.length === 4 || question.options.length === 5);
      assert.equal(question.ambiguityAudit.result, "UNIQUE");
      assert.equal(question.ambiguityAudit.outlierIndex, question.correctIndex);
      assert.equal(question.metadata.runtimeVersion, "cls-cp003-localized-runtime-v3");
      assert.equal(question.metadata.localizationVersion, "cls-cp003-hi-pa-localization-v3");
      assert.equal(question.metadata.sourceSaturationStatus, "NATIVE_DATASET_GOVERNED_REVIEW_REQUIRED");
      assert.equal(question.metadata.parity.qlIdentityPreserved, true);
      assert.equal(question.metadata.parity.solveContractPreserved, true);
      assert.equal(question.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
      assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.questionStudioVisible, false);
      assert.equal(question.reviewOnly, true);

      if (qlId === "CLS-QL-006") {
        assert.equal(question.task, "RESOLVE_JUMBLES_AND_FIND_OUTLIER");
        assert.equal(auditClsCp003LocalizedWords(question.options, locale).result, "NO_VALID_RULE");
        if (locale === "hi-IN") {
          assert.ok(question.evidenceByOption.every((line) => /शब्द मिलता है/.test(line)));
        } else {
          assert.ok(question.evidenceByOption.every((line) => /ਸ਼ਬਦ ਮਿਲਦਾ ਹੈ/.test(line)));
        }
      } else {
        assert.equal(question.task, "FIND_WORD_STRUCTURE_OUTLIER");
        const features = question.options.map((option) => analyzeClsCp003LocalizedWord(option, locale));
        if (question.intendedRuleId === "VOWEL_MARK_COUNT") {
          assert.equal(new Set(features.map((feature) => feature.unitCount)).size, 1);
        }
        if (question.intendedRuleId === "REPEATED_UNIT_TOPOLOGY") {
          assert.equal(new Set(features.map((feature) => feature.unitCount)).size, 1);
          assert.equal(new Set(features.map((feature) => feature.vowelMarkCount)).size, 1);
        }
        if (question.intendedRuleId === "PALINDROME_STATUS") {
          assert.equal(new Set(features.map((feature) => feature.unitCount)).size, 1);
          assert.ok(features.every((feature) => feature.unitCount >= 3));
        }
        if (question.intendedRuleId === "BOUNDARY_MARK_PATTERN") {
          assert.equal(new Set(features.map((feature) => feature.unitCount)).size, 1);
          assert.equal(new Set(features.map((feature) => feature.vowelMarkCount)).size, 1);
        }
      }

      const independent = independentlyVerifyClsCp003LocalizedQuestionV3(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.outlierIndex, question.correctIndex);

      const learnerText = [
        question.stem,
        ...question.options,
        question.answer,
        ...question.evidenceByOption,
        ...question.explanation.coreConcept,
        ...question.explanation.stepByStep,
        ...question.explanation.examSpeedShortcut,
        ...question.explanation.commonTrapWarning,
      ].join("\n");
      assert.ok(!/[A-Za-z]/.test(learnerText), `${locale}/${qlId}/${seed} leaks Latin learner text`);
      assert.ok(!/CLS-|PROT-|LETTER_UNIT_COUNT|VOWEL_MARK_COUNT|NATIVE_AFFIX/i.test(learnerText));
      assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
      assert.ok(!/1 (?:अक्षर|मात्रा) हैं/.test(learnerText));
      assert.ok(!/1 (?:ਅੱਖਰ|ਲਗਾਂ) ਹਨ/.test(learnerText));
      assert.ok(!/ਪੈਸਾ ਦਾ|ਤੋਤਾ ਦਾ|ਸਮਾਂ ਦਾ/.test(learnerText));
      assert.ok(!/पैटर्न|अंतर्निहित स्वर|मात्रा-चिह्न/.test(learnerText));
      assert.ok(!/ਅੰਦਰਲੀ ਧੁਨੀ/.test(learnerText));
      assert.ok(!/लगाने पर [^।]+ बनता है/.test(learnerText));
      assert.ok(!/ਲਗਾਉਣ ਤੇ [^।]+ ਬਣਦਾ ਹੈ/.test(learnerText));
      if (locale === "hi-IN") {
        assert.ok(/\p{Script=Devanagari}/u.test(learnerText), `${qlId}/${seed} lacks Devanagari`);
      } else {
        assert.ok(/\p{Script=Gurmukhi}/u.test(learnerText), `${qlId}/${seed} lacks Gurmukhi`);
      }

      const metrics = perLocale.get(locale)!;
      metrics.generated += 1;
      metrics.unique.add(JSON.stringify({ qlId, stem: question.stem, options: question.options }));
      metrics.explanationFingerprints.add(JSON.stringify(question.explanation));
      metrics.qls.add(qlId);
      metrics.prototypes.add(question.prototypeId);
      metrics.rules.add(question.intendedRuleId);
      metrics.optionCounts.add(question.options.length);
      metrics.difficulties.add(question.difficulty);
      metrics.answerPositions[question.correctIndex] += 1;
    }
  }
}

for (const [locale, metrics] of perLocale) {
  assert.equal(metrics.generated, 800);
  assert.equal(metrics.qls.size, 2);
  assert.equal(metrics.prototypes.size, 7);
  assert.equal(metrics.rules.size, 7);
  assert.deepEqual(metrics.optionCounts, new Set([4, 5]));
  assert.deepEqual(metrics.difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
  assert.ok(metrics.answerPositions.every((count) => count > 0));
  assert.ok(metrics.unique.size >= 730, `${locale} visible diversity too low: ${metrics.unique.size}/800`);
  assert.ok(
    metrics.explanationFingerprints.size >= 700,
    `${locale} explanation diversity too low: ${metrics.explanationFingerprints.size}/800`,
  );
}

assert.throws(() => generateClsCp003LocalizedQuestionV3("CLS-QL-999" as never, "hi-IN", 0));
assert.throws(() => generateClsCp003LocalizedQuestionV3("CLS-QL-005", "hi-IN", -1));
assert.throws(() => generateClsCp003LocalizedQuestionV3("CLS-QL-005", "en-IN" as never, 0));

console.log("CLS-CP-003 Hindi/Punjabi localization V3 audit passed.", {
  locales: Object.fromEntries([...perLocale].map(([locale, metrics]) => [locale, {
    generated: metrics.generated,
    uniqueVisibleQuestions: metrics.unique.size,
    uniqueExplanations: metrics.explanationFingerprints.size,
    qls: metrics.qls.size,
    prototypes: metrics.prototypes.size,
    rules: metrics.rules.size,
    optionCounts: [...metrics.optionCounts].sort(),
    difficulties: [...metrics.difficulties].sort(),
    answerPositions: metrics.answerPositions,
  }])),
});
