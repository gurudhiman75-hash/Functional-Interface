import assert from "node:assert/strict";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006Question } from "./cp006-multilingual-runtime";
import { generateClsCp006LearnerReviewV2 } from "./cp006-learner-review-v2";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";

const qls: readonly ClsCp006EnglishQlId[] = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
];
const locales: readonly ClsCp006TranslatedLocale[] = ["hi-IN", "pa-IN"];

let checked = 0;
let punjabiParityChecked = 0;
for (const qlId of qls) {
  for (const locale of locales) {
    for (let seed = 0; seed < 100; seed += 1) {
      for (const optionCount of [4, 5] as const) {
        const frozen = generateClsCp006Question(qlId, locale, seed, optionCount);
        const learner = generateClsCp006LearnerReviewV2(qlId, locale, seed, optionCount);

        assert.deepEqual(learner.options, frozen.options);
        assert.equal(learner.correctIndex, frozen.correctIndex);
        assert.equal(learner.answer, frozen.answer);
        assert.equal(learner.qlId, frozen.qlId);
        assert.equal(learner.permanentQlId, frozen.permanentQlId);
        assert.equal(learner.task, frozen.task);
        assert.equal(learner.optionKind, frozen.optionKind);
        assert.equal(learner.intendedRuleId, frozen.intendedRuleId);
        assert.equal(learner.intendedRuleValue, frozen.intendedRuleValue);
        assert.equal(learner.difficulty, frozen.difficulty);
        assert.deepEqual(learner.ambiguityAudit, frozen.ambiguityAudit);
        assert.deepEqual(learner.evidenceByOption, frozen.evidenceByOption);
        assert.equal(learner.explanation.stepByStep.length, 3);
        assert.equal(learner.explanation.examSpeedShortcut.length, 0);
        assert.equal(learner.explanation.commonTrapWarning.length, 0);
        assert.equal(learner.metadata.learnerReviewVersion, "cls-cp006-learner-review-v2");
        assert.equal(learner.metadata.learnerEditorialVersion, "compact-native-explanation-v2");
        assert.ok(!learner.stem.includes("विषम (अलग)"));
        assert.ok(!learner.stem.includes("आंतरिक नियम"));
        assert.ok(!learner.stem.includes("ਅੰਦਰੂਨੀ ਨਿਯਮ"));

        const evidenceLinesInLearner = frozen.evidenceByOption.filter((line) =>
          learner.explanation.stepByStep.includes(line),
        ).length;
        assert.ok(evidenceLinesInLearner <= 2);
        assert.ok(learner.explanation.stepByStep.at(-1)?.includes(learner.answer));

        if (locale === "pa-IN" && learner.intendedRuleId === "LETTER_POSITION_PARITY") {
          const learnerText = [
            ...learner.explanation.coreConcept,
            ...learner.explanation.stepByStep,
          ].join("\n");
          assert.ok(learnerText.includes("ਜਿਸਤ") || learnerText.includes("ਟਾਂਕ"));
          assert.ok(!learnerText.includes("ਜੋੜਾ"), "Punjabi even-position label must use ਜਿਸਤ, not ਜੋੜਾ");
          punjabiParityChecked += 1;
        }
        checked += 1;
      }
    }
  }
}

assert.equal(checked, qls.length * locales.length * 100 * 2);
assert.ok(punjabiParityChecked > 0);
console.log("CLS-CP-006 compact native learner review V2 audit passed.", {
  checked,
  punjabiParityChecked,
  frozenStateChanges: 0,
  shortcutTrapLearnerSections: false,
  routineOptionByOptionLearnerAnalysis: false,
});
