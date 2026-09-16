import assert from "node:assert/strict";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import { generateClsCp005Question } from "./cp005-multilingual-runtime";
import { generateClsCp005LearnerReviewV2 } from "./cp005-learner-review-v2";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";

const qls: readonly ClsCp005EnglishQlId[] = [
  CLS_CP005_ODD_TUPLE_QL_ID,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
];
const locales: readonly ClsCp005TranslatedLocale[] = ["hi-IN", "pa-IN"];

let checked = 0;
for (const qlId of qls) {
  for (const locale of locales) {
    for (let seed = 0; seed < 100; seed += 1) {
      for (const optionCount of [4, 5] as const) {
        const frozen = generateClsCp005Question(qlId, locale, seed, optionCount);
        const learner = generateClsCp005LearnerReviewV2(qlId, locale, seed, optionCount);

        assert.deepEqual(learner.tuples, frozen.tuples);
        assert.deepEqual(learner.referenceTuple, frozen.referenceTuple);
        assert.deepEqual(learner.options, frozen.options);
        assert.equal(learner.correctIndex, frozen.correctIndex);
        assert.equal(learner.answer, frozen.answer);
        assert.equal(learner.qlId, frozen.qlId);
        assert.equal(learner.intendedRuleId, frozen.intendedRuleId);
        assert.equal(learner.intendedRuleValue, frozen.intendedRuleValue);
        assert.equal(learner.difficulty, frozen.difficulty);
        assert.deepEqual(learner.expandedAmbiguityAudit, frozen.expandedAmbiguityAudit);
        assert.deepEqual(learner.evidenceByOption, frozen.evidenceByOption);
        assert.deepEqual(learner.explanation.coreConcept, frozen.explanation.coreConcept);
        assert.equal(learner.explanation.stepByStep.length, 3);
        assert.equal(learner.explanation.examSpeedShortcut.length, 0);
        assert.equal(learner.explanation.commonTrapWarning.length, 0);
        assert.equal(learner.metadata.learnerReviewVersion, "cls-cp005-learner-review-v2");
        assert.equal(learner.metadata.learnerEditorialVersion, "compact-native-explanation-v2");
        assert.ok(!learner.stem.includes("विषम (अलग) विकल्प"));

        const exactEvidenceLinesInLearner = learner.evidenceByOption.filter((line) =>
          learner.explanation.stepByStep.includes(line),
        ).length;
        assert.ok(
          exactEvidenceLinesInLearner <= 2,
          `${qlId}/${locale}/${seed}/${optionCount}: routine option-by-option evidence leaked`,
        );
        if (qlId === CLS_CP005_EQUIVALENT_TUPLE_QL_ID) {
          assert.equal(exactEvidenceLinesInLearner, 1);
        }
        assert.ok(learner.explanation.stepByStep.at(-1)?.includes(learner.answer));
        checked += 1;
      }
    }
  }
}

assert.equal(checked, qls.length * locales.length * 100 * 2);
console.log("CLS-CP-005 compact native learner review V2 audit passed.", {
  checked,
  frozenStateChanges: 0,
  shortcutTrapLearnerSections: false,
  routineOptionByOptionLearnerAnalysis: false,
});
