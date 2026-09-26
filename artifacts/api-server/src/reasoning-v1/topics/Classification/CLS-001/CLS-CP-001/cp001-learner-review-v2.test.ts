import assert from "node:assert/strict";
import {
  CLS_CP001_PERMANENT_CONTRACTS,
  type ClsCp001QlId,
} from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import { generateClsCp001LearnerReviewV2 } from "./cp001-learner-review-v2";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

const locales: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const qls: readonly ClsCp001QlId[] = CLS_CP001_PERMANENT_CONTRACTS.map((entry) => entry.qlId);

function expectedLearnerLine(line: string, locale: ClsCp001Locale): string {
  if (locale === "hi-IN") {
    return line
      .replaceAll("दूध पिलाने वाले जानवर", "स्तनधारी")
      .replaceAll("दूध पिलाने वाला जानवर है", "एक स्तनधारी है");
  }
  if (locale === "pa-IN") {
    return line
      .replaceAll("ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲੇ ਜਾਨਵਰ", "ਥਣਧਾਰੀ")
      .replaceAll("ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲਾ ਜਾਨਵਰ ਹੈ", "ਇੱਕ ਥਣਧਾਰੀ ਹੈ");
  }
  return line;
}

let checked = 0;
for (const qlId of qls) {
  for (const locale of locales) {
    for (let seed = 0; seed < 200; seed += 1) {
      const frozen = generateClsCp001Question(qlId, locale, seed);
      const learner = generateClsCp001LearnerReviewV2(qlId, locale, seed);

      assert.equal(learner.chapterId, frozen.chapterId);
      assert.equal(learner.checkpointId, frozen.checkpointId);
      assert.equal(learner.qlId, frozen.qlId);
      assert.equal(learner.permanentQlId, frozen.permanentQlId);
      assert.equal(learner.seed, frozen.seed);
      assert.equal(learner.task, frozen.task);
      assert.equal(learner.family, frozen.family);
      assert.equal(learner.generationProfile, frozen.generationProfile);
      assert.equal(learner.difficulty, frozen.difficulty);
      assert.deepEqual(learner.difficultyFeatures, frozen.difficultyFeatures);
      assert.equal(learner.intendedClassId, frozen.intendedClassId);
      assert.equal(learner.intendedClassLabel, frozen.intendedClassLabel);
      assert.equal(learner.stem, frozen.stem);
      assert.deepEqual(learner.givens, frozen.givens);
      assert.deepEqual(learner.options, frozen.options);
      assert.deepEqual(learner.optionGroups, frozen.optionGroups);
      assert.equal(learner.correctIndex, frozen.correctIndex);
      assert.equal(learner.answer, frozen.answer);
      assert.deepEqual(learner.evidenceByOption, frozen.evidenceByOption);
      assert.deepEqual(learner.ambiguityAudit, frozen.ambiguityAudit);
      assert.deepEqual(learner.lifecycle, frozen.lifecycle);
      assert.equal(learner.reviewOnly, frozen.reviewOnly);
      assert.equal(learner.questionStudioVisible, frozen.questionStudioVisible);

      assert.deepEqual(
        learner.explanation.coreRule,
        frozen.explanation.coreRule.map((line) => expectedLearnerLine(line, locale)),
      );
      assert.deepEqual(
        learner.explanation.optionChecks,
        frozen.explanation.optionChecks.map((line) => expectedLearnerLine(line, locale)),
      );
      assert.ok(learner.explanation.optionChecks.length >= 2);
      assert.ok(learner.explanation.optionChecks.length <= 3);
      assert.equal(learner.explanation.examSpeedShortcut.length, 0);
      assert.equal(learner.explanation.commonTraps.length, 0);

      const {
        learnerReviewVersion,
        learnerEditorialVersion,
        ...learnerMetadata
      } = learner.metadata;
      assert.deepEqual(learnerMetadata, frozen.metadata);
      assert.equal(learnerReviewVersion, "cls-cp001-learner-review-v2");
      assert.equal(learnerEditorialVersion, "compact-explanation-natural-language-v2");

      const learnerText = [
        learner.stem,
        ...learner.explanation.coreRule,
        ...learner.explanation.optionChecks,
      ].join("\n");
      assert.doesNotMatch(learnerText, /\b(?:shortcut|common trap|exam speed|candidate rule|quality rank|hierarchy depth)\b/i);
      assert.doesNotMatch(learnerText, /दूध पिलाने वाल[ाे] जानवर|ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲ[ਾੇ] ਜਾਨਵਰ/u);
      assert.ok(learner.explanation.optionChecks.at(-1)?.includes(learner.answer));
      checked += 1;
    }
  }
}

assert.equal(checked, qls.length * locales.length * 200);
console.log("CLS-CP-001 compact learner review V2 audit passed.", {
  checked,
  frozenStateChanges: 0,
  shortcutTrapLearnerSections: false,
  routineOptionByOptionLearnerAnalysis: false,
  naturalNativeMammalWording: true,
});
