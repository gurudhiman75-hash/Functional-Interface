import assert from "node:assert/strict";
import { CLS_CP003_LOCALIZED_LOCALES, CLS_CP003_LOCALIZED_QL_IDS } from "./cp003-localized-contracts";
import { generateClsCp003LocalizedQuestionV3 } from "./cp003-localized-runtime-v3";
import {
  generateClsCp003LocalizedQuestionV4,
  independentlyVerifyClsCp003LocalizedQuestionV4,
} from "./cp003-localized-runtime-v4";

let generated = 0;
let correctedPluralLines = 0;

for (const qlId of CLS_CP003_LOCALIZED_QL_IDS) {
  for (const locale of CLS_CP003_LOCALIZED_LOCALES) {
    for (let seed = 0; seed < 400; seed += 1) {
      const v3 = generateClsCp003LocalizedQuestionV3(qlId, locale, seed);
      const v4 = generateClsCp003LocalizedQuestionV4(qlId, locale, seed);

      assert.deepEqual(v4.options, v3.options);
      assert.deepEqual(v4.canonicalWords, v3.canonicalWords);
      assert.equal(v4.correctIndex, v3.correctIndex);
      assert.equal(v4.answer, v3.answer);
      assert.equal(v4.prototypeId, v3.prototypeId);
      assert.equal(v4.intendedRuleId, v3.intendedRuleId);
      assert.deepEqual(v4.ambiguityAudit, v3.ambiguityAudit);
      assert.equal(v4.metadata.runtimeVersion, "cls-cp003-localized-runtime-v4");
      assert.equal(v4.metadata.localizationVersion, "cls-cp003-hi-pa-localization-v4");

      const verification = independentlyVerifyClsCp003LocalizedQuestionV4(v4);
      assert.equal(verification.result, "UNIQUE");
      assert.equal(verification.outlierIndex, v4.correctIndex);

      const v3Text = [
        ...v3.evidenceByOption,
        ...v3.explanation.stepByStep,
      ].join("\n");
      const v4Text = [
        v4.stem,
        ...v4.options,
        v4.answer,
        ...v4.evidenceByOption,
        ...v4.explanation.coreConcept,
        ...v4.explanation.stepByStep,
        ...v4.explanation.examSpeedShortcut,
        ...v4.explanation.commonTrapWarning,
      ].join("\n");

      if (locale === "hi-IN") {
        const previousMatches = v3Text.match(/([2-9२-९]|[1-9१-९][0-9०-९]+) मात्रा हैं/g) ?? [];
        correctedPluralLines += previousMatches.length;
        assert.ok(!/([2-9२-९]|[1-9१-९][0-9०-९]+) मात्रा हैं/.test(v4Text));
        assert.ok(!/1 मात्राएँ हैं/.test(v4Text));
      }
      assert.ok(!/पैटर्न|अंतर्निहित स्वर|मात्रा-चिह्न/.test(v4Text));
      assert.ok(!/ਅੰਦਰਲੀ ਧੁਨੀ/.test(v4Text));
      assert.ok(!/लगाने पर [^।]+ बनता है/.test(v4Text));
      assert.ok(!/ਲਗਾਉਣ ਤੇ [^।]+ ਬਣਦਾ ਹੈ/.test(v4Text));
      assert.equal(v4.lifecycle.questionStudioDiscoverable, false);
      assert.equal(v4.lifecycle.publiclyPublishable, false);
      generated += 1;
    }
  }
}

assert.equal(generated, 1600);
assert.ok(correctedPluralLines > 0, "The V4 proof did not exercise any Hindi plural correction");

console.log("CLS-CP-003 localized V4 grammar audit passed.", {
  generated,
  correctedPluralLines,
  mathematicalStateChanges: 0,
});
