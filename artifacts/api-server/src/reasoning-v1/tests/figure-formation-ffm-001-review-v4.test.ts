import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateFigureFormationReviewQuestionV4Final } from "../foundation/spatial/figure-formation-review-runtime-v4-final";

const qlIds = ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const;
const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 8 }, (_, index) => `ffm-review-v4-${String(index + 1).padStart(2, "0")}`);

function minimumSegmentLength(svg: string): number {
  const lengths: number[] = [];
  for (const tag of svg.match(/<line\b[^>]*>/gi) ?? []) {
    if (/stroke="#9ca3af"/i.test(tag)) continue;
    const get = (name: string) => Number(tag.match(new RegExp(`${name}="([\\d.-]+)"`, "i"))?.[1]);
    const x1 = get("x1"), y1 = get("y1"), x2 = get("x2"), y2 = get("y2");
    if ([x1, y1, x2, y2].some((value) => !Number.isFinite(value))) continue;
    const length = Math.hypot(x2 - x1, y2 - y1);
    if (length > 0.5) lengths.push(length);
  }
  assert.ok(lengths.length > 0, "Expected SVG line geometry.");
  return Math.min(...lengths);
}

function expectedQuestionUnit(qlId: typeof qlIds[number]): number {
  if (qlId === "SPA-QL-051") return 16;
  if (qlId === "SPA-QL-052") return 12;
  return 14;
}

let generated = 0;
let deterministicReplayChecks = 0;
let scaleChecks = 0;
let illustrationChecks = 0;
let explanationChecks = 0;

for (const qlId of qlIds) {
  for (const seed of seeds) {
    for (const language of languages) {
      const question = generateFigureFormationReviewQuestionV4Final({ qlId, seed, language }) as any;
      const replay = generateFigureFormationReviewQuestionV4Final({ qlId, seed, language }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      generated += 1;

      assert.equal(question.version, "SPA-FFM-001-REVIEW-QUESTION-V4", `${owner}: V4 wrapper missing.`);
      assert.equal(question.renderer.reviewGeometryScalePolicy, "COMMON_UNIT_PER_QUESTION_NO_INDEPENDENT_AUTOSCALE", `${owner}: common-scale authority missing.`);
      assert.equal(question.renderer.reviewIllustratedExplanation, true, `${owner}: explanation illustration gate missing.`);
      assert.equal(question.review.v3RejectedForGeometryScaleAndExplanation, true, `${owner}: V3 rejection not recorded.`);
      assert.equal(question.review.learnerContentFrozen, false, `${owner}: learner content frozen before approval.`);
      assert.equal(question.review.downstreamActivationAllowed, false, `${owner}: downstream activation opened before approval.`);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false, `${owner}: Question Studio gate opened.`);
      assert.equal(question.lifecycle.persistenceAllowed, false, `${owner}: persistence gate opened.`);
      assert.equal(question.lifecycle.questionBankWritable, false, `${owner}: Question Bank gate opened.`);
      assert.equal(question.lifecycle.testBuilderEligible, false, `${owner}: Test Builder gate opened.`);
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, `${owner}: student delivery gate opened.`);

      assert.deepEqual(question, replay, `${owner}: generation is not deterministic.`);
      deterministicReplayChecks += 1;

      const unit = expectedQuestionUnit(qlId);
      for (const [index, svg] of question.stimulusSvgs.entries()) {
        assert.match(svg, /<rect[^>]+fill="white"/i, `${owner}: stimulus ${index} lost white background.`);
        assert.match(svg, /stroke-width="1\.35"/i, `${owner}: stimulus ${index} lost exam stroke.`);
        assert.ok(Math.abs(minimumSegmentLength(svg) - unit) < 0.02, `${owner}: stimulus ${index} is not on the ${unit}px common unit.`);
        scaleChecks += 1;
      }
      if (qlId !== "SPA-QL-052") {
        for (const [index, svg] of question.optionSvgs.entries()) {
          assert.match(svg, /stroke-width="1\.35"/i, `${owner}: option ${index} lost exam stroke.`);
          assert.ok(Math.abs(minimumSegmentLength(svg) - unit) < 0.02, `${owner}: option ${index} is not on the ${unit}px common unit.`);
          scaleChecks += 1;
        }
      }

      assert.match(question.explanationIllustrationSvg, /<svg\b/i, `${owner}: explanation illustration missing.`);
      assert.match(question.explanationIllustrationSvg, /Required final outline/i, `${owner}: explanation illustration does not identify the final outline.`);
      assert.match(question.explanationIllustrationSvg, /stroke-width="1\.35"/i, `${owner}: explanation illustration lost exam stroke.`);
      illustrationChecks += 1;

      if (language === "en") {
        assert.ok(Array.isArray(question.explanation.steps), `${owner}: learner steps missing.`);
        assert.ok(question.explanation.steps.length >= 4, `${owner}: learner explanation is too shallow.`);
        assert.match(question.explanation.observation, /scale|length/i, `${owner}: explanation does not address size/scale.`);
        assert.match(question.explanation.rule, /not mirrored|not mirrored or resized|not mirrored\. |not mirrored or/i, `${owner}: transformation rule missing.`);
        assert.match(question.explanation.check, new RegExp(`option ${question.answer}`, "i"), `${owner}: final answer check missing.`);
        explanationChecks += 1;
      }
    }
  }
}

const evidence = {
  status: "PASS_FFM_001_REVIEW_V4_COMMON_SCALE_AND_ILLUSTRATED_EXPLANATION",
  generated,
  deterministicReplayChecks,
  scaleChecks,
  illustrationChecks,
  explanationChecks,
  qlIds,
  languages,
  learnerContentFrozen: false,
  downstreamActivationAllowed: false,
};
const evidencePath = resolve(process.cwd(), "dist/reasoning-v1/spatial/ffm-001-review-v4-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
