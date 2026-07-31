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

assert.equal(CLS_CP001_PERMANENT_CONTRACTS.length, 3);
assert.ok(CLS_CP001_CLASSES.every((semanticClass) => CLS_CP001_CLASS_LABELS[semanticClass.classId]));
assert.ok(CLS_CP001_ENTITIES.every((entity) => CLS_CP001_ENTITY_LABELS[entity.label]));
assert.equal(Object.keys(CLS_CP001_CLASS_LABELS).length, CLS_CP001_CLASSES.length);
assert.equal(Object.keys(CLS_CP001_ENTITY_LABELS).length, CLS_CP001_ENTITIES.length);

const localeFingerprints = new Map<ClsCp001Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const answerPositions = new Map<ClsCp001Locale, number[]>(
  LOCALES.map((locale) => [locale, [0, 0, 0, 0, 0]]),
);
const stemCoverage = new Map<ClsCp001Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const taskCoverage = new Map<ClsCp001Locale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);

for (const contract of CLS_CP001_PERMANENT_CONTRACTS) {
  for (let seed = 0; seed < 200; seed += 1) {
    const english = generateClsCp001Question(contract.qlId, "en-IN", seed);

    for (const locale of LOCALES) {
      const question = generateClsCp001Question(contract.qlId, locale, seed);
      const replay = generateClsCp001Question(contract.qlId, locale, seed);
      assert.deepEqual(question, replay, `${contract.qlId}/${locale}/${seed} is not deterministic`);

      assert.equal(question.qlId, contract.qlId);
      assert.equal(question.permanentQlId, contract.qlId);
      assert.equal(question.task, contract.task);
      assert.equal(question.metadata.locale, locale);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.intendedClassId, english.intendedClassId);
      assert.equal(question.difficulty, english.difficulty);
      assert.deepEqual(question.difficultyFeatures, english.difficultyFeatures);
      assert.equal(question.metadata.sourcePrototypeId, english.metadata.sourcePrototypeId);
      assert.equal(question.metadata.sourcePrototypeSeed, english.metadata.sourcePrototypeSeed);
      assert.equal(question.metadata.sourceOptionCount, english.metadata.sourceOptionCount);
      assert.equal(question.metadata.solveContractId, english.metadata.solveContractId);
      assert.equal(question.options.length, english.options.length);
      assert.equal(question.options.length, question.metadata.sourceOptionCount);
      assert.ok(question.options.length === 4 || question.options.length === 5);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.evidenceByOption.length, question.options.length);
      assert.equal(question.explanation.coreRule.length, 1);
      assert.ok(question.explanation.optionChecks.length >= 3 && question.explanation.optionChecks.length <= 4);
      assert.equal(question.explanation.examSpeedShortcut.length, 1);
      assert.equal(question.explanation.commonTraps.length, 1);
      assert.equal(question.optionGroups.length, english.optionGroups.length);
      assert.equal(question.lifecycle.reviewStatus, "FROZEN_RUNTIME_PROOF");
      assert.equal(question.questionStudioVisible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");

      const solutionText = question.explanation.optionChecks.join(" ");
      assert.ok(solutionText.includes(question.answer), `${contract.qlId}/${locale}/${seed} solution omitted answer`);

      if (question.task === "SELECT_COHERENT_GROUP") {
        assert.equal(question.optionGroups.length, question.options.length);
        assert.ok(question.optionGroups.every((group) => group.length === 3 && new Set(group).size === 3));
        for (const label of question.optionGroups[question.correctIndex]!) {
          assert.ok(solutionText.includes(label), `${contract.qlId}/${locale}/${seed} solution omitted ${label}`);
        }
      } else {
        assert.equal(question.optionGroups.length, 0);
        if (question.task === "SELECT_CLASS_MEMBER") {
          for (const label of question.givens) {
            assert.ok(solutionText.includes(label), `${contract.qlId}/${locale}/${seed} solution omitted ${label}`);
          }
        } else {
          for (const [optionIndex, label] of question.options.entries()) {
            if (optionIndex === question.correctIndex) continue;
            assert.ok(solutionText.includes(label), `${contract.qlId}/${locale}/${seed} solution omitted ${label}`);
          }
        }
      }

      if (locale === "en-IN") {
        assert.deepEqual(question, english);
      } else {
        assert.equal(question.metadata.localizationVersion, "cls-cp001-localization-v2");
        assert.notDeepEqual(question.options, english.options);
        assert.notEqual(question.intendedClassLabel, english.intendedClassLabel);
        if (question.optionGroups.length > 0) assert.notDeepEqual(question.optionGroups, english.optionGroups);

        const learnerText = [
          question.stem,
          ...question.givens,
          ...question.options,
          ...question.optionGroups.flat(),
          question.answer,
          question.intendedClassLabel,
          ...question.explanation.coreRule,
          ...question.explanation.optionChecks,
          ...question.explanation.examSpeedShortcut,
          ...question.explanation.commonTraps,
        ].join("\n");

        if (locale === "hi-IN") {
          assert.match(learnerText, /[\u0904-\u0939\u0958-\u0961]/u);
          assert.ok(question.options.every((value) => /[\u0904-\u0939\u0958-\u0961]/u.test(value)));
          assert.ok(question.optionGroups.flat().every((value) => /[\u0904-\u0939\u0958-\u0961]/u.test(value)));
          assert.ok(!/[\u0A05-\u0A39\u0A59-\u0A5E]/u.test(question.stem));
        } else {
          assert.match(learnerText, /[\u0A05-\u0A39\u0A59-\u0A5E]/u);
          assert.ok(question.options.every((value) => /[\u0A05-\u0A39\u0A59-\u0A5E]/u.test(value)));
          assert.ok(question.optionGroups.flat().every((value) => /[\u0A05-\u0A39\u0A59-\u0A5E]/u.test(value)));
          assert.ok(!/[\u0904-\u0939\u0958-\u0961]/u.test(question.stem));
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
        optionGroups: question.optionGroups,
      });
      assert.ok(!localeFingerprints.get(locale)!.has(fingerprint), `${contract.qlId}/${locale}/${seed} collided`);
      localeFingerprints.get(locale)!.add(fingerprint);
      answerPositions.get(locale)![question.correctIndex] += 1;
      stemCoverage.get(locale)!.add(question.stem);
      taskCoverage.get(locale)!.add(question.task);
    }
  }
}

for (const locale of LOCALES) {
  assert.equal(localeFingerprints.get(locale)!.size, 600);
  const positions = answerPositions.get(locale)!;
  assert.deepEqual(positions.map((count) => count > 0), [true, true, true, true, true]);
  assert.ok(
    Math.max(...positions.slice(0, 4)) / Math.min(...positions.slice(0, 4)) < 1.5,
    `${locale} first four answer positions are imbalanced: ${positions}`,
  );
  assert.ok(positions[4]! > 20, `${locale} did not materially exercise fifth-position answers: ${positions}`);
  assert.ok(stemCoverage.get(locale)!.size >= 12);
  assert.deepEqual(
    taskCoverage.get(locale),
    new Set(["FIND_OUTLIER", "SELECT_CLASS_MEMBER", "SELECT_COHERENT_GROUP"]),
  );
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
  taskCoverage: Object.fromEntries(
    [...taskCoverage].map(([locale, values]) => [locale, [...values].sort()]),
  ),
});
