import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2,
  countNormalizedStagesV1_5_2,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_2,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_2,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-2";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  minimumPatternOptionDistanceV1_5,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_4_1 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-4-1";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_4_1();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_5_2();
assert.equal(questions.length, 48);
assert.equal(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2.reviewQuestionCount, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));

let minimumPatternDistance = 1;
let changedNonReverseCount = 0;
for (let index = 0; index < questions.length; index += 1) {
  const question = questions[index];
  const markup = [question.stimulusSvg, ...question.options.map((o) => o.svg)].join("\n");
  assert.equal(/data-(?:perceptual|distinct)-distractor/.test(markup), false, `${question.reviewQuestionId} retains a synthetic distractor mark.`);
  if (question.taskKind === "REVERSE_INFERENCE") continue;

  const distance = minimumPatternOptionDistanceV1_5(question);
  minimumPatternDistance = Math.min(minimumPatternDistance, distance);
  assert.ok(
    distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
    `${question.reviewQuestionId} remains too similar at ${distance.toFixed(3)}.`,
  );

  const priorCorrect = prior[index].options.find((o) => o.optionId === prior[index].correctOptionId);
  const currentCorrect = question.options.find((o) => o.optionId === question.correctOptionId);
  assert.equal(currentCorrect?.svg, priorCorrect?.svg, `${question.reviewQuestionId} correct option artwork changed.`);
  if (question.options.some((o, oi) => o.svg !== prior[index].options[oi].svg)) changedNonReverseCount += 1;
}
assert.ok(changedNonReverseCount >= 12, `Expected broad choice remediation, got ${changedNonReverseCount}.`);

const tpf = questions.filter((q) => q.chapterCode === "TPF-001");
assert.equal(tpf.length, 8);
for (const question of tpf) {
  const index = questions.findIndex((q) => q.reviewQuestionId === question.reviewQuestionId);
  const changedWrong = question.options.filter((o, oi) => o.optionId !== question.correctOptionId && o.svg !== prior[index].options[oi].svg).length;
  assert.equal(changedWrong, 3, `${question.reviewQuestionId} does not have three semantic wrong choices.`);
}

const threeStep = questions.filter((q) =>
  q.taskKind === "MULTISHAPE_FORWARD" && (q.stimulusSvg.match(/data-stage-normalized="true"/g) ?? []).length >= 4,
);
assert.ok(threeStep.length >= 4, `Expected at least four normalized three-step forward questions; got ${threeStep.length}.`);

const numberRe = /-?\d+(?:\.\d+)?/g;
function attr(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}
function paperSpan(svg: string): number | null {
  const xs: number[] = [], ys: number[] = [];
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const points = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(numberRe)?.map(Number) ?? [];
    for (let i = 0; i + 1 < points.length; i += 2) { xs.push(points[i]); ys.push(points[i + 1]); }
  }
  for (const tag of svg.match(/<rect\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const x = attr(tag,"x") ?? 0, y = attr(tag,"y") ?? 0, w = attr(tag,"width"), h = attr(tag,"height");
    if (w === null || h === null) continue; xs.push(x,x+w); ys.push(y,y+h);
  }
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    if (!/\bfill="white"/i.test(tag) || !/\bstroke="(?:#111|black)"/i.test(tag)) continue;
    const cx=attr(tag,"cx"), cy=attr(tag,"cy"), r=attr(tag,"r"); if(cx===null||cy===null||r===null||r<10) continue;
    xs.push(cx-r,cx+r); ys.push(cy-r,cy+r);
  }
  if (!xs.length || !ys.length) return null;
  return Math.max(Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys));
}
function stageFillRatio(svg: string): number | null {
  const vb = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(numberRe)?.map(Number) ?? [];
  if (vb.length !== 4) return null;
  const span = paperSpan(svg); if (span === null) return null;
  return span / Math.max(vb[2],vb[3]);
}

const stageRatios: number[] = [];
for (const question of [...threeStep, ...questions.filter((q) => q.taskKind === "REVERSE_INFERENCE")]) {
  const markup = question.taskKind === "REVERSE_INFERENCE" ? question.options.map((o) => o.svg).join("\n") : question.stimulusSvg;
  for (const svg of markup.match(/<svg\b[^>]*data-stage-normalized="true"[\s\S]*?<\/svg>/g) ?? []) {
    const ratio = stageFillRatio(svg);
    assert.notEqual(ratio, null, `${question.reviewQuestionId} normalized stage has no measurable paper bounds.`);
    stageRatios.push(ratio!);
    assert.ok(Math.abs(ratio! - 1/1.30) <= 0.015, `${question.reviewQuestionId} stage fill ratio ${ratio!.toFixed(3)} indicates progressive shrinking.`);
  }
}
assert.ok(stageRatios.length >= 100, `Expected >=100 measured normalized stages; got ${stageRatios.length}.`);
assert.ok(Math.max(...stageRatios)-Math.min(...stageRatios) <= 0.03, "Normalized stage fill ratios are not visually uniform.");

const normalizedStageCount = countNormalizedStagesV1_5_2(questions);
assert.ok(normalizedStageCount >= stageRatios.length);

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_2(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.5.2"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2.authorityId));
assert.ok(html.includes(".fixed-stage{width:178px;flex:0 0 178px"));
assert.ok(html.includes(".stimulus-panels .fixed-stage svg{width:156px!important;height:156px!important"));
assert.ok(html.includes(".option-process .fixed-stage svg{width:96px!important;height:96px!important"));
assert.ok(html.includes("min-width:max-content!important"));
assert.ok(!html.includes("data-perceptual-distractor"));
assert.ok(!html.includes("data-distinct-distractor"));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length);
const idSet = new Set(ids);
for (const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((m) => m[1])) assert.ok(idSet.has(ref));

const evidence = {
  authority: PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2,
  status: "PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_5_2",
  reviewQuestionCount: questions.length,
  changedNonReverseQuestionCount: changedNonReverseCount,
  minimumPatternPairwiseDistance: minimumPatternDistance,
  minimumPatternDistanceGate: PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  transparentQuestionCount: tpf.length,
  normalizedStageSvgCount: normalizedStageCount,
  measuredStageCount: stageRatios.length,
  minStagePaperFillRatio: Math.min(...stageRatios),
  maxStagePaperFillRatio: Math.max(...stageRatios),
  threeStepForwardQuestionIds: threeStep.map((q) => q.reviewQuestionId),
  retainedSemanticFingerprints: questions.map((q) => q.semanticFingerprint),
  retainedCorrectOptionIds: questions.map((q) => q.correctOptionId),
  governance: {
    correctOptionArtworkChangedForNonReverse: false,
    randomExtraMarksAllowed: false,
    humanLearnerReviewRequired: true,
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-2-evidence.json", `${JSON.stringify(evidence,null,2)}\n`, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-2.html", html, "utf8");
console.log(JSON.stringify(evidence));
