import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateFigureFormationReviewQuestionV5 } from "../foundation/spatial/figure-formation-review-runtime-v5";

const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 8 }, (_, index) => `ffm-review-v5-${String(index + 1).padStart(2, "0")}`);

let generated = 0;
let deterministicChecks = 0;
let assemblyIllustrationChecks = 0;
let seamChecks = 0;
let explanationChecks = 0;

for (const qlId of qlIds) {
  for (const seed of seeds) {
    for (const language of languages) {
      const question = generateFigureFormationReviewQuestionV5({ qlId, seed, language }) as any;
      const replay = generateFigureFormationReviewQuestionV5({ qlId, seed, language }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      generated += 1;

      assert.equal(question.version, "SPA-FFM-001-REVIEW-QUESTION-V5", `${owner}: V5 wrapper missing.`);
      assert.equal(question.renderer.reviewAssemblyPathIllustration, true, `${owner}: assembly-path illustration flag missing.`);
      assert.equal(question.renderer.reviewAssemblySeamVisible, true, `${owner}: joining-seam flag missing.`);
      assert.equal(question.review.v4RejectedForMissingConnectionMethod, true, `${owner}: V4 explanation rejection not recorded.`);
      assert.equal(question.review.learnerContentFrozen, false, `${owner}: learner content froze before visual approval.`);
      assert.equal(question.review.downstreamActivationAllowed, false, `${owner}: downstream activation opened before approval.`);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${owner}: Question Studio gate opened.`);
      assert.equal(question.lifecycle.persistenceAllowed, false, `${owner}: persistence gate opened.`);
      assert.equal(question.lifecycle.questionBankWritable, false, `${owner}: Question Bank gate opened.`);
      assert.equal(question.lifecycle.testBuilderEligible, false, `${owner}: Test Builder gate opened.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: student delivery gate opened.`);

      assert.deepEqual(question, replay, `${owner}: V5 generation is not deterministic.`);
      deterministicChecks += 1;

      const svg = String(question.explanationIllustrationSvg ?? "");
      assert.match(svg, /1\. As shown/i, `${owner}: starting-orientation stage missing.`);
      assert.match(svg, /2\. Turn pieces/i, `${owner}: turn stage missing.`);
      assert.match(svg, /3\. Join in final positions/i, `${owner}: final-position stage missing.`);
      assert.match(svg, /data-assembly-stage="joined"/i, `${owner}: assembled placement geometry missing.`);
      assemblyIllustrationChecks += 1;

      assert.match(svg, /data-seam="true"/i, `${owner}: exact joining seam is not drawn.`);
      assert.match(svg, /dashed line = joining seam/i, `${owner}: seam legend missing.`);
      seamChecks += 1;

      if (language === "en") {
        assert.ok(Array.isArray(question.explanation.steps), `${owner}: explanation steps missing.`);
        assert.ok(question.explanation.steps.length >= 4, `${owner}: explanation is too shallow.`);
        assert.match(question.explanation.application, /movement plan/i, `${owner}: connection movement plan missing.`);
        assert.match(question.explanation.application, /last panel places/i, `${owner}: final placement is not explained.`);
        assert.match(question.explanation.check, /dashed seam/i, `${owner}: joining seam is not explained.`);
        explanationChecks += 1;
      }
    }
  }
}

const evidence = {
  status: "PASS_FFM_001_REVIEW_V5_EXACT_CONNECTION_METHOD",
  generated,
  deterministicChecks,
  assemblyIllustrationChecks,
  seamChecks,
  explanationChecks,
  qlIds,
  languages,
  learnerContentFrozen: false,
  downstreamActivationAllowed: false,
};
const evidencePath = resolve(process.cwd(), "dist/reasoning-v1/spatial/ffm-001-review-v5-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
