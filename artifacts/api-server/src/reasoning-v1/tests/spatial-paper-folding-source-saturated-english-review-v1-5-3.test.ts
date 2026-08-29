import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3,
  countNormalizedStageSvgsV1_5_3,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_3,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_3,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-3";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  minimumPatternOptionDistanceV1_5,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_5_2 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-2";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_5_2();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_5_3();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));

for (const question of questions) {
  if (question.taskKind === "REVERSE_INFERENCE") continue;
  const distance = minimumPatternOptionDistanceV1_5(question);
  assert.ok(
    distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
    `${question.reviewQuestionId} regressed below the 0.16 option-separation gate at ${distance.toFixed(3)}.`,
  );
}

const threeFoldIds = [
  "PFC-W2-SQUARE-THREE-FOLD-HOLE",
  "PFC-W2-RECT-THREE-FOLD-HOLE",
  "PFC-W2-RECT-THREE-FOLD-DIAMOND",
  "PFC-W2-RECT-THREE-FOLD-MIXED-CUTS",
] as const;

const threeFold = threeFoldIds.map((sourceId) => {
  const question = questions.find((q) => q.sourceId === sourceId);
  assert.ok(question, `Missing ${sourceId}.`);
  return question!;
});

for (const question of threeFold) {
  assert.equal((question.stimulusSvg.match(/class="fixed-stage"/g) ?? []).length, 4, `${question.reviewQuestionId} must expose 4 fixed stage cards.`);
  assert.equal((question.stimulusSvg.match(/data-stage-normalized="true"/g) ?? []).length, 4, `${question.reviewQuestionId} must independently normalize Fold 1, Fold 2, Fold 3 and Cut/Punch.`);
}

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const PAPER_FILL_RE = /\bfill="(?:white|#fafafa)"/i;
function attr(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}
function paperSpan(svg: string): number | null {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    if (!PAPER_FILL_RE.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const values = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
    for (let i = 0; i + 1 < values.length; i += 2) { xs.push(values[i]); ys.push(values[i + 1]); }
  }
  for (const tag of svg.match(/<rect\b[^>]*\/?\s*>/g) ?? []) {
    if (!PAPER_FILL_RE.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const x = attr(tag,"x") ?? 0, y = attr(tag,"y") ?? 0, w = attr(tag,"width"), h = attr(tag,"height");
    if (w === null || h === null) continue;
    xs.push(x,x+w); ys.push(y,y+h);
  }
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    if (!PAPER_FILL_RE.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const cx=attr(tag,"cx"), cy=attr(tag,"cy"), r=attr(tag,"r");
    if(cx===null||cy===null||r===null||r<10) continue;
    xs.push(cx-r,cx+r); ys.push(cy-r,cy+r);
  }
  if (!xs.length || !ys.length) return null;
  return Math.max(Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys));
}
function fillRatio(svg: string): number | null {
  const vb = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  if (vb.length !== 4) return null;
  const span = paperSpan(svg);
  if (span === null) return null;
  return span / Math.max(vb[2],vb[3]);
}

const threeFoldRatios: number[] = [];
for (const question of threeFold) {
  const svgs = question.stimulusSvg.match(/<svg\b[^>]*data-stage-normalized="true"[\s\S]*?<\/svg>/g) ?? [];
  assert.equal(svgs.length, 4);
  for (const svg of svgs) {
    const ratio = fillRatio(svg);
    assert.notEqual(ratio, null, `${question.reviewQuestionId} stage has no measurable paper fill.`);
    threeFoldRatios.push(ratio!);
    assert.ok(Math.abs(ratio! - 1/1.30) <= 0.015, `${question.reviewQuestionId} stage fill ${ratio!.toFixed(3)} shows progressive shrinking.`);
  }
}
assert.equal(threeFoldRatios.length, 16);
assert.ok(Math.max(...threeFoldRatios)-Math.min(...threeFoldRatios) <= 0.03, "Three-fold stage scale is not visually uniform.");

let reverseMultiStageOptions = 0;
for (const question of questions.filter((q) => q.taskKind === "REVERSE_INFERENCE")) {
  for (const option of question.options) {
    const count = (option.svg.match(/data-stage-normalized="true"/g) ?? []).length;
    if (count > 0) {
      reverseMultiStageOptions += 1;
      assert.ok(count >= 2, `${question.reviewQuestionId}/${option.optionId} reverse process has only ${count} normalized stage(s).`);
    }
  }
}
assert.ok(reverseMultiStageOptions > 0, "Expected reverse multi-stage options to be structurally normalized.");

const normalizedStageCount = countNormalizedStageSvgsV1_5_3(questions);
assert.ok(normalizedStageCount >= 16 + reverseMultiStageOptions * 2, `Unexpectedly low normalized stage count ${normalizedStageCount}.`);

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_3(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.5.3"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3.authorityId));
assert.ok(html.includes(".fixed-stage{width:178px;flex:0 0 178px"));
assert.ok(html.includes(".stimulus-panels .fixed-stage svg{width:156px!important;height:156px!important"));
assert.ok(html.includes("min-width:max-content!important"));
assert.ok(!html.includes("data-perceptual-distractor"));
assert.ok(!html.includes("data-distinct-distractor"));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length);
const idSet = new Set(ids);
for (const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((m) => m[1])) assert.ok(idSet.has(ref));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_3,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_5_3",
  reviewQuestionCount: questions.length,
  minimumPatternDistanceGate: PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  threeFoldQuestionIds: threeFold.map((q) => q.reviewQuestionId),
  threeFoldStageCount: threeFoldRatios.length,
  minThreeFoldStagePaperFillRatio: Math.min(...threeFoldRatios),
  maxThreeFoldStagePaperFillRatio: Math.max(...threeFoldRatios),
  reverseMultiStageOptionCount: reverseMultiStageOptions,
  normalizedStageSvgCount: normalizedStageCount,
  retainedSemanticFingerprints: questions.map((q) => q.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((q) => q.correctOptionId),
  governance: {
    correctAnswersChangedFromV1_5_2: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-3-evidence.json", `${JSON.stringify(evidence,null,2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-3.html", html, "utf8");
console.log(JSON.stringify(evidence));
