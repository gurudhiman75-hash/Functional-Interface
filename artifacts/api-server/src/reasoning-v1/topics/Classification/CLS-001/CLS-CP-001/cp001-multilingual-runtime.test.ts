import assert from "node:assert/strict";
import { CLS_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import { CLS_CP001_CLASSES, CLS_CP001_ENTITIES } from "./semantic-dataset.en";
import {
  CLS_CP001_CLASS_LABELS,
  CLS_CP001_ENTITY_LABELS,
  type ClsCp001Locale,
} from "./localization/cp001-language-pack";

const LOCALES: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.ok(CLS_CP001_CLASSES.every((semanticClass) => CLS_CP001_CLASS_LABELS[semanticClass.classId]));
assert.ok(CLS_CP001_ENTITIES.every((entity) => CLS_CP001_ENTITY_LABELS[entity.label]));
assert.equal(Object.keys(CLS_CP001_CLASS_LABELS).length, CLS_CP001_CLASSES.length);
assert.equal(Object.keys(CLS_CP001_ENTITY_LABELS).length, CLS_CP001_ENTITIES.length);

const localeFingerprints = new Map<ClsCp001Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const answerPositions = new Map<ClsCp001Locale, number[]>(
  LOCALES.map((locale) => [locale, [0, 0, 0, 0]]),
);
const stemCoverage = new Map<ClsCp001Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);

for (const contract of CLS_CP001_PERMANENT_CONTRACTS) {
  for (let seed = 0; seed < 300; seed += 1) {
    const english = generateClsCp001Question(contract.qlId, "en-IN", seed);

    for (const locale of LOCALES) {
      const question = generateClsCp001Question(contract.qlId, locale, seed);
      const replay = generateClsCp001Question(contract.qlId, locale, seed);
      assert.deepEqual(question, replay, `${contract.qlId}/${locale}/${seed} is not deterministic`);

      assert.equal(question.qlId, contract.qlId);
      assert.equal(question.permanentQlId, contract.qlId);
      assert.equal(question.metadata.locale, locale);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.intendedClassId, english.intendedClassId);
      assert.equal(question.difficulty, english.difficulty);
      assert.deepEqual(question.difficultyFeatures, english.difficultyFeatures);
      assert.equal(question.metadata.sourcePrototypeId, english.metadata.sourcePrototypeId);
      assert.equal(question.metadata.sourcePrototypeSeed, english.metadata.sourcePrototypeSeed);
      assert.equal(question.metadata.solveContractId, english.metadata.solveContractId);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.evidenceByOption.length, 4);
      assert.deepEqual(question.evidenceByOption, question.explanation.optionChecks);
      assert.equal(question.lifecycle.reviewStatus, "FROZEN_RUNTIME_PROOF");
      assert.equal(question.questionStudioVisible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");

      if (locale === "en-IN") {
        assert.deepEqual(question, english);
      } else {
        assert.equal(question.metadata.localizationVersion, "cls-cp001-localization-v1");
        assert.notDeepEqual(question.options, english.options);
        assert.notEqual(question.intendedClassLabel, english.intendedClassLabel);

        const learnerText = [
          question.stem,
          ...question.givens,
          ...question.options,
          question.answer,
          question.intendedClassLabel,
          ...question.explanation.coreRule,
          ...question.explanation.optionChecks,
          ...question.explanation.examSpeedShortcut,
          ...question.explanation.commonTraps,
        ].join("\n");

        if (locale === "hi-IN") {
          assert.match(learnerText, /[\u0900-\u097F]/u);
          assert.ok(question.options.every((value) => /[\u0900-\u097F]/u.test(value)));
          assert.ok(!/[\u0A00-\u0A7F]/u.test(question.stem));
        } else {
          assert.match(learnerText, /[\u0A00-\u0A7F]/u);
          assert.ok(question.options.every((value) => /[\u0A00-\u0A7F]/u.test(value)));
          assert.ok(!/[\u0900-\u097F]/u.test(question.stem));
          assert.ok(!/(?:^|\s)(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?:\s|$)/u.test(learnerText));
        }

        assert.ok(!/[A-Za-z]{3,}/u.test(learnerText), `${contract.qlId}/${locale}/${seed} leaked English learner text`);
        assert.ok(!/undefined|null|NaN|Infinity/u.test(learnerText));
      }

      const fingerprint = JSON.stringify({
        qlId: question.qlId,
        locale,
        stem: question.stem,
        givens: question.givens,
        options: question.options,
      });
      assert.ok(!localeFingerprints.get(locale)!.has(fingerprint), `${contract.qlId}/${locale}/${seed} collided`);
      localeFingerprints.get(locale)!.add(fingerprint);
      answerPositions.get(locale)![question.correctIndex] += 1;
      stemCoverage.get(locale)!.add(question.stem);
    }
  }
}

for (const locale of LOCALES) {
  assert.equal(localeFingerprints.get(locale)!.size, 600);
  const positions = answerPositions.get(locale)!;
  assert.deepEqual(positions.map((count) => count > 0), [true, true, true, true]);
  assert.ok(Math.max(...positions) / Math.min(...positions) < 1.4, `${locale} answer positions are imbalanced: ${positions}`);
  assert.ok(stemCoverage.get(locale)!.size >= 8);
}

console.log("CLS-CP-001 multilingual runtime audit passed.", {
  qls: CLS_CP001_PERMANENT_CONTRACTS.length,
  locales: LOCALES,
  semanticClasses: CLS_CP001_CLASSES.length,
  semanticEntities: CLS_CP001_ENTITIES.length,
  questionsPerLocale: 600,
  totalQuestions: 1800,
  answerPositions: Object.fromEntries(answerPositions),
  stemCounts: Object.fromEntries([...stemCoverage].map(([locale, values]) => [locale, values.size])),
});
