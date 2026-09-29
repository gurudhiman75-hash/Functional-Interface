import assert from "node:assert/strict";

import { previewStc001V22QuestionStudioReview } from "./question-studio-review-v2-2.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const locales: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 17, 63, 255, 511, 777, 1023, 1279, 1536, 1791, 2047] as const;

let checked = 0;

for (const qlId of STC_QL_IDS) {
  for (const locale of locales) {
    const stems = new Set<string>();
    const answerPositions = new Set<number>();
    const archetypes = new Set<string>();

    for (const seed of seeds) {
      const preview = previewStc001V22QuestionStudioReview({ qlId, locale, seed });
      const q = preview.question;

      assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(preview.reviewOnly, true);
      assert.equal(preview.generationReady, true);
      assert.equal(preview.presentationProfile, "FOUR_WAY");

      assert.equal(q.metadata.reviewOnly, true);
      assert.equal(q.metadata.questionBankWritable, false);
      assert.equal(q.metadata.testEligible, false);
      assert.equal(q.metadata.mockEligible, false);
      assert.equal(q.metadata.publicEligible, false);
      assert.equal(q.metadata.automaticPublication, false);

      assert.ok(q.stem.trim().length >= 20, `${qlId}/${locale}/${seed}: stem too thin`);
      assert.equal(q.conclusions.length, 2, `${qlId}/${locale}/${seed}: expected two conclusions`);
      assert.ok(q.conclusions.every((value) => value.trim().length >= 8), `${qlId}/${locale}/${seed}: conclusion too thin`);
      assert.equal(q.options.length, 4, `${qlId}/${locale}/${seed}: expected four answer-code options`);
      assert.equal(new Set(q.options).size, 4, `${qlId}/${locale}/${seed}: duplicate answer-code options`);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${qlId}/${locale}/${seed}: invalid correct index`);
      assert.ok(q.explanation.trim().length >= 55, `${qlId}/${locale}/${seed}: explanation too thin`);

      const learnerText = [q.stem, ...q.conclusions, q.explanation].join(" ");
      assert.doesNotMatch(
        learnerText,
        /prototype|authority|fingerprint|semantic slot|variant key|generator|STC-QL|STC-CP/i,
        `${qlId}/${locale}/${seed}: internal audit vocabulary leaked to learner surface`,
      );
      assert.doesNotMatch(
        learnerText,
        /associated with|most closely linked|broad(?:ly)?|best describes/i,
        `${qlId}/${locale}/${seed}: mechanical stem wording detected`,
      );

      if (locale === "en-IN") {
        assert.match(q.explanation, /I (?:follows|does not follow):/u);
        assert.match(q.explanation, /II (?:follows|does not follow):/u);
      } else if (locale === "hi-IN") {
        assert.match(q.explanation, /निष्कर्ष I/u);
        assert.match(q.explanation, /निष्कर्ष II/u);
      } else {
        assert.match(q.explanation, /ਨਤੀਜਾ I/u);
        assert.match(q.explanation, /ਨਤੀਜਾ II/u);
      }

      stems.add(q.stem);
      answerPositions.add(q.correctIndex);
      archetypes.add(q.surfaceArchetype);
      checked++;
    }

    assert.ok(stems.size >= 8, `${qlId}/${locale}: weak visible stem variation (${stems.size}/${seeds.length})`);
    assert.equal(answerPositions.size, 4, `${qlId}/${locale}: all four answer positions should be reachable`);
    assert.ok(archetypes.size >= 4, `${qlId}/${locale}: too few surface archetypes in audit sample (${archetypes.size})`);
  }
}

console.log(JSON.stringify({
  status: "PASS_STC_001_DEEP_AUDIT_WAVE1",
  qlCount: STC_QL_IDS.length,
  locales,
  seedsPerQlLocale: seeds.length,
  learnerSurfacesChecked: checked,
  lifecycle: "REVIEW_ONLY",
  noveltyStatus: "DEFERRED",
}, null, 2));
