import assert from "node:assert/strict";
import { CLS_CP003_LOCALIZED_LOCALES, CLS_CP003_LOCALIZED_QL_IDS } from "./cp003-localized-contracts";
import { generateClsCp003LocalizedQuestionV4 } from "./cp003-localized-runtime-v4";
import {
  generateClsCp003LocalizedQuestionV5,
  independentlyVerifyClsCp003LocalizedQuestionV5,
} from "./cp003-localized-runtime-v5";

let generated = 0;

for (const qlId of CLS_CP003_LOCALIZED_QL_IDS) {
  for (const locale of CLS_CP003_LOCALIZED_LOCALES) {
    for (let seed = 0; seed < 400; seed += 1) {
      const v4 = generateClsCp003LocalizedQuestionV4(qlId, locale, seed);
      const v5 = generateClsCp003LocalizedQuestionV5(qlId, locale, seed);

      assert.equal(v5.qlId, v4.qlId);
      assert.equal(v5.prototypeId, v4.prototypeId);
      assert.equal(v5.seed, v4.seed);
      assert.deepEqual(v5.options, v4.options);
      assert.deepEqual(v5.canonicalWords, v4.canonicalWords);
      assert.equal(v5.correctIndex, v4.correctIndex);
      assert.equal(v5.answer, v4.answer);
      assert.equal(v5.intendedRuleId, v4.intendedRuleId);
      assert.deepEqual(v5.ambiguityAudit, v4.ambiguityAudit);
      assert.equal(v5.difficulty, v4.difficulty);
      assert.equal(v5.stem, v4.stem);
      assert.deepEqual(v5.evidenceByOption, v4.evidenceByOption);
      assert.deepEqual(v5.explanation.coreConcept, v4.explanation.coreConcept);
      assert.deepEqual(v5.explanation.stepByStep, v4.explanation.stepByStep);

      assert.deepEqual(v5.explanation.examSpeedShortcut, []);
      assert.deepEqual(v5.explanation.commonTrapWarning, []);
      assert.equal(v5.metadata.runtimeVersion, "cls-cp003-localized-runtime-v5");
      assert.equal(v5.metadata.localizationVersion, "cls-cp003-hi-pa-localization-v5");
      assert.equal(v5.metadata.editorialReviewVersion, "beginner-first-explanation-v1");

      const verification = independentlyVerifyClsCp003LocalizedQuestionV5(v5);
      assert.equal(verification.result, "UNIQUE");
      assert.equal(verification.outlierIndex, v5.correctIndex);

      const learnerText = [
        v5.stem,
        ...v5.options,
        v5.answer,
        ...v5.evidenceByOption,
        ...v5.explanation.coreConcept,
        ...v5.explanation.stepByStep,
      ].join("\n");

      assert.ok(!/Shortcut:|Trap:|shortcut|common trap/i.test(learnerText));
      assert.ok(!/पैटर्न|अंतर्निहित स्वर|मात्रा-चिह्न/.test(learnerText));
      assert.ok(!/ਅੰਦਰਲੀ ਧੁਨੀ/.test(learnerText));
      assert.equal(v5.lifecycle.questionStudioDiscoverable, false);
      assert.equal(v5.lifecycle.publiclyPublishable, false);
      generated += 1;
    }
  }
}

assert.equal(generated, 1600);

console.log("CLS-CP-003 localized V5 beginner-first explanation audit passed.", {
  generated,
  mathematicalStateChanges: 0,
  shortcutLinesRetained: 0,
  trapLinesRetained: 0,
});
