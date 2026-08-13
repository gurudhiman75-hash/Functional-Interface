import { createHash } from "node:crypto";
import type { SpatialGapQuestionBatchResultV1 } from "./gap-question-types-v1";
import type { SpatialGapIdV1 } from "./gap-types-v1";
import { renderSpatialSceneToSvg } from "./svg-renderer";

export interface SpatialGapQuestionReviewSampleV1 {
  gapId: SpatialGapIdV1;
  chapterCode: "FAN-001" | "FCL-001" | "FSR-001";
  prototypeId: string;
  stemText: string;
  decisiveProperty: string;
  correctOption: string;
  contentDigest: string;
  deliveryDigest: string;
  stimulusSvgs: string[];
  optionSvgs: string[];
  optionLabels: string[];
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
}

export interface SpatialGapQuestionEditorialReviewV1 {
  version: "SPA-FND-001-GAP-QUESTION-EDITORIAL-REVIEW-V1";
  seedPrefix: string;
  requestedPerGap: number;
  totalAccepted: number;
  correctSlotCounts: [number, number, number, number];
  chapterCounts: Record<"FAN-001" | "FCL-001" | "FSR-001", number>;
  sampleCount: number;
  samples: SpatialGapQuestionReviewSampleV1[];
  reviewStatus: "REPRESENTATIVE_ARTIFACT_READY_HUMAN_REVIEW_PENDING";
  englishFreezeStatus: "HUMAN_REVIEW_PENDING";
  lifecycle: SpatialGapQuestionBatchResultV1["lifecycle"];
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function buildSpatialGapQuestionEditorialReviewV1(
  batch: SpatialGapQuestionBatchResultV1,
): SpatialGapQuestionEditorialReviewV1 {
  const seen = new Set<SpatialGapIdV1>();
  const samples: SpatialGapQuestionReviewSampleV1[] = [];
  for (const question of batch.accepted) {
    if (seen.has(question.gapId)) continue;
    seen.add(question.gapId);
    samples.push({
      gapId: question.gapId,
      chapterCode: question.chapterCode,
      prototypeId: question.prototypeId,
      stemText: question.stemText,
      decisiveProperty: question.solverEvidence.decisiveProperty,
      correctOption: optionLetter(question.correctOptionIndex),
      contentDigest: digest(question.contentFingerprint),
      deliveryDigest: digest(question.deliveryFingerprint),
      stimulusSvgs: question.stimulusScenes.map((scene) => renderSpatialSceneToSvg(scene)),
      optionSvgs: question.options.map((option) => renderSpatialSceneToSvg(option.scene)),
      optionLabels: question.options.map((option) => option.misconception),
      explanation: { ...question.learnerExplanation },
    });
  }
  return {
    version: "SPA-FND-001-GAP-QUESTION-EDITORIAL-REVIEW-V1",
    seedPrefix: batch.seedPrefix,
    requestedPerGap: batch.requestedPerGap,
    totalAccepted: batch.totalAccepted,
    correctSlotCounts: [...batch.correctSlotCounts],
    chapterCounts: { ...batch.chapterCounts },
    sampleCount: samples.length,
    samples,
    reviewStatus: "REPRESENTATIVE_ARTIFACT_READY_HUMAN_REVIEW_PENDING",
    englishFreezeStatus: "HUMAN_REVIEW_PENDING",
    lifecycle: { ...batch.lifecycle },
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function svgStrip(svgs: readonly string[], prefix: string): string {
  return `<div class="strip">${svgs
    .map((svg, index) => `<div class="figure"><div class="cap">${escapeHtml(prefix)} ${index + 1}</div>${svg}</div>`)
    .join("")}</div>`;
}

export function buildSpatialGapQuestionEditorialReviewHtmlV1(
  review: SpatialGapQuestionEditorialReviewV1,
): string {
  const cards = review.samples
    .map((sample, index) => {
      const optionLabels = sample.optionLabels
        .map((label, optionIndex) => `${optionLetter(optionIndex)}=${label}`)
        .join(" · ");
      return `<article class="card">
<h2>${index + 1}. ${escapeHtml(sample.gapId)} — ${escapeHtml(sample.chapterCode)}</h2>
<div class="meta">Correct: <strong>${sample.correctOption}</strong> · ${escapeHtml(sample.prototypeId)} · ${sample.contentDigest.slice(0, 16)}…</div>
<p class="stem"><strong>Stem:</strong> ${escapeHtml(sample.stemText)}</p>
<p><strong>Decisive property:</strong> ${escapeHtml(sample.decisiveProperty)}</p>
${sample.stimulusSvgs.length ? `<h3>Stimulus</h3>${svgStrip(sample.stimulusSvgs, "Figure")}` : ""}
<h3>Options</h3>${svgStrip(sample.optionSvgs, "Option")}
<p class="meta">${escapeHtml(optionLabels)}</p>
<div class="explanation"><p><strong>Observe:</strong> ${escapeHtml(sample.explanation.observation)}</p><p><strong>Rule:</strong> ${escapeHtml(sample.explanation.rule)}</p><p><strong>Apply:</strong> ${escapeHtml(sample.explanation.application)}</p><p><strong>Check:</strong> ${escapeHtml(sample.explanation.check)}</p></div>
</article>`;
    })
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPA Gap Question Synthesis Editorial V1</title><style>
body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#181818}main{max-width:1180px;margin:auto;padding:24px}.summary{background:#fff;border:1px solid #ddd;border-radius:10px;padding:14px;margin-bottom:20px}.card{background:#fff;border:1px solid #d8d8d8;border-radius:10px;padding:16px;margin:0 0 18px}.meta{font-size:12px;color:#5a5a5a}.stem{font-size:15px}.strip{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}.figure{width:116px;border:1px solid #ddd;border-radius:8px;padding:5px;text-align:center;background:#fff}.figure svg{display:block;width:100%;height:auto}.cap{font-size:11px;color:#666;margin-bottom:3px}.explanation{background:#fafafa;border-left:3px solid #bbb;padding:8px 12px;margin-top:10px}.explanation p{margin:6px 0}h2{font-size:18px}h3{font-size:14px;margin-bottom:7px}@media(max-width:520px){main{padding:10px}.card{padding:10px}.figure{width:78px}.stem{font-size:14px}.explanation{font-size:13px}}
</style></head><body><main><div class="summary"><h1>SPA-FND-001 Gap Question Synthesis / Editorial V1</h1><p>${review.totalAccepted} synthesized learner questions · ${review.requestedPerGap}/gap · A/B/C/D ${review.correctSlotCounts.join(" / ")}</p><p>Representative samples: ${review.sampleCount}. Human mobile/editorial freeze remains pending.</p></div>${cards}</main></body></html>`;
}
